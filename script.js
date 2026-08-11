(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ================================================
     ENVELOPE → ABERTURA
     ================================================ */
  var envelope      = document.getElementById('envelope');
  var bowSvg        = document.getElementById('bow-svg');
  var bowHit        = document.getElementById('bow-hit');
  var envScene      = document.getElementById('envelope-scene');
  var inviteScene   = document.getElementById('invite-scene');
  var petalField    = document.getElementById('petal-field');
  var pullHint      = document.getElementById('pull-hint');
  var opened        = false;

  function openEnvelope() {
    if (opened) return;
    opened = true;

    // 1. Anima o laço sendo puxado
    bowSvg.classList.add('pulled');
    pullHint.style.opacity = '0';

    // 2. Após laço sumir, abre a tampa
    setTimeout(function () {
      envelope.classList.add('opening');
    }, 420);

    // 3. Exibe cena do convite
    setTimeout(function () {
      envScene.classList.add('hide');
      inviteScene.setAttribute('aria-hidden', 'false');
      inviteScene.classList.add('visible');

      // Ativa pétalas
      petalField.classList.add('active');
      startPetals();

      // Dispara animação de escrita
      animateWriteIn();

    }, 1100);
  }

  bowHit.addEventListener('click', openEnvelope);
  bowSvg.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openEnvelope(); }
  });
  bowSvg.setAttribute('tabindex', '0');
  bowSvg.setAttribute('role', 'button');

  /* ================================================
     ANIMAÇÃO DE ESCRITA SEQUENCIAL
     ================================================ */
  function animateWriteIn() {
    var elements = document.querySelectorAll('.write-in');
    var baseDelay = 0.1; // segundos

    elements.forEach(function (el, i) {
      var delay = baseDelay + i * 0.38;
      var dur   = el.classList.contains('names') ? 1.0 :
                  el.classList.contains('divider') ? 0.5 :
                  el.classList.contains('rsvp-wrap') ? 0.7 : 0.75;

      el.style.setProperty('--type-delay', delay + 's');
      el.style.setProperty('--type-dur',   dur   + 's');

      // pequeno requestAnimationFrame para garantir que o estilo foi aplicado
      requestAnimationFrame(function () {
        el.classList.add('typing');
        setTimeout(function () {
          el.classList.add('typed');
        }, (delay + dur) * 1000);
      });
    });
  }

  /* ================================================
     PÉTALAS
     ================================================ */
  function spawnPetal() {
    if (reduceMotion || !petalField.classList.contains('active')) return;
    var p = document.createElement('div');
    p.className = 'petal';

    var size     = 9  + Math.random() * 13;
    var startX   = Math.random() * 100;
    var fallDur  = 7  + Math.random() * 7;
    var swayDur  = 2  + Math.random() * 2.5;
    var delay    = Math.random() * 0.5;
    var rot      = Math.random() * 60 - 30;

    p.style.width               = size + 'px';
    p.style.height              = size + 'px';
    p.style.left                = startX + 'vw';
    p.style.transform           = 'rotate(' + rot + 'deg)';
    p.style.animationDuration   = fallDur + 's, ' + swayDur + 's';
    p.style.animationDelay      = delay + 's, 0s';

    petalField.appendChild(p);
    setTimeout(function () { p.remove(); }, (fallDur + delay) * 1000 + 300);
  }

  function startPetals() {
    // rajada inicial
    for (var i = 0; i < 12; i++) setTimeout(spawnPetal, i * 220);
    // fluxo contínuo
    setInterval(spawnPetal, 850);
  }

  /* ================================================
     RSVP — troca de painéis
     ================================================ */
  var panels = {
    question: document.getElementById('panel-question'),
    form:     document.getElementById('panel-form'),
    obrigado: document.getElementById('panel-obrigado'),
    nao:      document.getElementById('panel-nao')
  };

  function showPanel(target) {
    Object.keys(panels).forEach(function (key) {
      var el = panels[key];
      if (el === target) {
        el.classList.remove('panel-leave');
        el.classList.add('is-active');
      } else if (el.classList.contains('is-active')) {
        el.classList.add('panel-leave');
        setTimeout(function () {
          el.classList.remove('is-active', 'panel-leave');
        }, 280);
      }
    });
    setTimeout(function () {
      var h = target.querySelector('.form-title,.result-title,.rsvp-question');
      if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }, 150);
  }

  document.getElementById('btn-sim').addEventListener('click', function () { showPanel(panels.form); });
  document.getElementById('btn-nao').addEventListener('click', function () { showPanel(panels.nao); });
  document.getElementById('btn-voltar-form').addEventListener('click', function () { showPanel(panels.question); });
  document.getElementById('btn-voltar-nao').addEventListener('click', function () { showPanel(panels.question); });

  document.getElementById('rsvp-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var nome        = document.getElementById('nome').value.trim();
    var acompanhante = document.getElementById('acompanhante').value.trim();
    if (!nome) { document.getElementById('nome').focus(); return; }

    var texto = 'Mal podemos esperar para celebrar esse dia com você, ' + nome + '!';
    if (acompanhante) texto += ' Você e ' + acompanhante + ' são muito bem-vindos.';
    document.getElementById('obrigado-texto').textContent = texto;
    showPanel(panels.obrigado);
  });

})();
