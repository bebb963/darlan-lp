(function(){
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Menu mobile */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menuMobile');
  function toggleMenu(force){
    var open = typeof force === 'boolean' ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', function(){ toggleMenu(); });
  menu.querySelectorAll('a').forEach(function(a){
    a.addEventListener('click', function(){ toggleMenu(false); });
  });

  /* Nav esconde ao rolar + CTA mobile */
  var nav = document.getElementById('nav');
  var ctaMobile = document.getElementById('ctaMobile');
  var lastY = 0;
  var contato = document.getElementById('contato');
  function nearContato(){
    var r = contato.getBoundingClientRect();
    return r.top < window.innerHeight && r.bottom > 0;
  }
  window.addEventListener('scroll', function(){
    var y = window.scrollY;
    nav.classList.toggle('hidden-nav', y > 400 && y > lastY);
    ctaMobile.classList.toggle('show', y > 600 && !nearContato());
    lastY = y;
  }, {passive:true});

  /* Parallax hero */
  var heroImg = document.getElementById('heroImg');
  if (!reduceMotion && heroImg){
    window.addEventListener('scroll', function(){
      var y = window.scrollY;
      if (y < window.innerHeight) heroImg.style.transform = 'translateY(' + (y * 0.25) + 'px)';
    }, {passive:true});
  }

  /* Scroll reveal */
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, {threshold:.15, rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });

  /* Contadores */
  var ioNum = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if (!e.isIntersecting) return;
      ioNum.unobserve(e.target);
      var el = e.target, alvo = +el.dataset.count, ini = null;
      if (reduceMotion){ el.textContent = alvo; return; }
      function passo(t){
        if (!ini) ini = t;
        var p = Math.min((t - ini) / 1600, 1);
        el.textContent = Math.round(alvo * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(passo);
      }
      requestAnimationFrame(passo);
    });
  }, {threshold:.6});
  document.querySelectorAll('[data-count]').forEach(function(el){ ioNum.observe(el); });

  /* Marquee — duplica para loop contínuo */
  var track = document.getElementById('marqueeTrack');
  var clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden','true');
  track.parentNode.appendChild(clone);

  /* Form → WhatsApp */
  var form = document.getElementById('formContato');
  form.addEventListener('submit', function(ev){
    ev.preventDefault();
    var nome = form.nome.value.trim();
    var cidade = form.cidade.value.trim();
    var detalhes = form.detalhes.value.trim();
    if (!nome || !cidade){
      [form.nome, form.cidade].forEach(function(c){
        if (!c.value.trim()) c.style.borderColor = 'var(--brasa)';
      });
      return;
    }
    var msg = 'Olá! Meu nome é ' + nome + ' e quero um orçamento para um show do Darlan Alves em ' + cidade + '.' + (detalhes ? ' Detalhes: ' + detalhes : '');
    window.open('https://wa.me/5519981290579?text=' + encodeURIComponent(msg), '_blank');
  });
  ['nome','cidade'].forEach(function(id){
    document.getElementById(id).addEventListener('input', function(){ this.style.borderColor = ''; });
  });

  /* Lightbox da galeria */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  document.querySelectorAll('.galeria-item').forEach(function(item){
    item.addEventListener('click', function(){
      var img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeLightbox(){
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }
  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function(e){
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
  });
})();
