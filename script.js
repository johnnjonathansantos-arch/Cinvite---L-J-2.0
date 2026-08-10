(function(){
  'use strict';

  /* ---------------- Pétalas caindo ---------------- */
  var field = document.getElementById('petal-field');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function spawnPetal(){
    if (reduceMotion) return;
    var petal = document.createElement('div');
    petal.className = 'petal';

    var size = 10 + Math.random() * 12;
    var startX = Math.random() * 100;
    var fallDuration = 7 + Math.random() * 6;
    var swayDuration = 2.5 + Math.random() * 2;
    var delay = Math.random() * 0.6;
    var rotateStart = Math.random() * 60 - 30;

    petal.style.width = size + 'px';
    petal.style.height = size + 'px';
    petal.style.left = startX + 'vw';
    petal.style.transform = 'rotate(' + rotateStart + 'deg)';
    petal.style.animationDuration = fallDuration + 's, ' + swayDuration + 's';
    petal.style.animationDelay = delay + 's, 0s';

    field.appendChild(petal);

    window.setTimeout(function(){
      petal.remove();
    }, (fallDuration + delay) * 1000 + 200);
  }

  // rajada inicial suave
  for (var i = 0; i < 10; i++){
    window.setTimeout(spawnPetal, i * 260);
  }
  // fluxo contínuo, mais esparso
  window.setInterval(spawnPetal, 900);

  /* ---------------- Fluxo RSVP ---------------- */
  var panels = {
    question: document.getElementById('panel-question'),
    form: document.getElementById('panel-form'),
    obrigado: document.getElementById('panel-obrigado'),
    nao: document.getElementById('panel-nao')
  };

  function showPanel(target){
    Object.keys(panels).forEach(function(key){
      var el = panels[key];
      if (el === target){
        el.classList.remove('panel-leave');
        el.classList.add('is-active');
      } else if (el.classList.contains('is-active')) {
        el.classList.add('panel-leave');
        window.setTimeout(function(){
          el.classList.remove('is-active', 'panel-leave');
        }, 280);
      }
    });
    // foco no título do painel para acessibilidade
    window.setTimeout(function(){
      var heading = target.querySelector('.form-title, .result-title, .rsvp-question');
      if (heading) heading.setAttribute('tabindex', '-1'), heading.focus({preventScroll:true});
    }, 150);
  }

  document.getElementById('btn-sim').addEventListener('click', function(){
    showPanel(panels.form);
  });

  document.getElementById('btn-nao').addEventListener('click', function(){
    showPanel(panels.nao);
  });

  document.getElementById('btn-voltar-form').addEventListener('click', function(){
    showPanel(panels.question);
  });

  document.getElementById('btn-voltar-nao').addEventListener('click', function(){
    showPanel(panels.question);
  });

  document.getElementById('rsvp-form').addEventListener('submit', function(e){
    e.preventDefault();
    var nome = document.getElementById('nome').value.trim();
    var acompanhante = document.getElementById('acompanhante').value.trim();

    if (!nome){
      document.getElementById('nome').focus();
      return;
    }

    var texto = 'Mal podemos esperar para celebrar esse dia com você, ' + nome + '!';
    if (acompanhante){
      texto += ' Você e ' + acompanhante + ' são muito bem-vindos.';
    }
    document.getElementById('obrigado-texto').textContent = texto;

    showPanel(panels.obrigado);
  });

})();
