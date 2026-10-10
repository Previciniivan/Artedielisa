(function () {
  // Menu mobile
  var burger = document.querySelector('.burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    var setMenu = function (open) {
      nav.classList.toggle('open', open);
      document.body.classList.toggle('lock', open);
      burger.setAttribute('aria-expanded', open);
      burger.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
    };
    burger.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  // Listino: tutte le categorie restano sempre aperte
  document.querySelectorAll('details.cat').forEach(function (c) {
    c.open = true;
    c.querySelector('summary').addEventListener('click', function (e) { e.preventDefault(); });
  });

  // Orari (ora italiana, indipendente dal fuso del visitatore). 0 = domenica
  var H = { 0: null, 1: null, 2: [11, 20], 3: [9, 20], 4: [13, 20], 5: [9, 20], 6: [9, 19] };
  var D = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var pad = function (n) { return (n < 10 ? '0' : '') + n + ':00'; };
  var now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/Rome' }));
  var day = now.getDay(), hr = now.getHours() + now.getMinutes() / 60;

  document.querySelectorAll('.hours tr[data-d]').forEach(function (tr) {
    if (+tr.dataset.d === day) tr.classList.add('today');
  });

  var el = document.querySelector('[data-status]');
  if (el) {
    var t = H[day], msg, open = false;
    if (t && hr >= t[0] && hr < t[1]) { open = true; msg = 'Oggi ricevo dalle ' + pad(t[0]) + ' alle ' + pad(t[1]); }
    else if (t && hr < t[0]) { msg = 'Oggi ricevo dalle ' + pad(t[0]) + ' alle ' + pad(t[1]); }
    else {
      for (var i = 1; i <= 7; i++) {
        var d = (day + i) % 7;
        if (H[d]) { msg = 'Oggi sono chiusa, riapro ' + (i === 1 ? 'domani' : D[d]) + ' dalle ' + pad(H[d][0]) + ' alle ' + pad(H[d][1]); break; }
      }
    }
    el.lastChild.textContent = msg + '. Solo su appuntamento.';
    el.classList.toggle('open', open);
  }

  // Galleria: filtri e lightbox
  var grid = document.querySelector('.grid');
  if (grid) {
    var items = [].slice.call(grid.querySelectorAll('button'));
    document.querySelectorAll('.filters button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.filters button').forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
        items.forEach(function (it) { it.hidden = b.dataset.f !== 'tutte' && it.dataset.c !== b.dataset.f; });
      });
    });
    var dlg = document.getElementById('lb');
    var img = dlg.querySelector('img'), cap = dlg.querySelector('p'), cur = 0;
    var visible = function () { return items.filter(function (i) { return !i.hidden; }); };
    var show = function (n) {
      var v = visible(); cur = (n + v.length) % v.length;
      var s = v[cur].querySelector('img');
      img.src = s.dataset.full || s.src; img.alt = s.alt; cap.textContent = s.alt;
    };
    items.forEach(function (it) {
      it.addEventListener('click', function () { show(visible().indexOf(it)); dlg.showModal(); });
    });
    dlg.querySelector('.x').addEventListener('click', function () { dlg.close(); });
    dlg.querySelector('.pv').addEventListener('click', function () { show(cur - 1); });
    dlg.querySelector('.nx').addEventListener('click', function () { show(cur + 1); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lb-in')) dlg.close(); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
    });
  }

  // Schede trattamenti scorrevoli: puntini, suggerimento "scorri" e piccolo movimento iniziale
  var rail = document.querySelector('.cards');
  if (rail) {
    var cards = [].slice.call(rail.children);
    var dots = document.createElement('div'); dots.className = 'dots';
    cards.forEach(function (c, i) {
      var d = document.createElement('button');
      d.type = 'button'; d.setAttribute('aria-label', 'Vai al trattamento ' + (i + 1) + ' di ' + cards.length);
      d.addEventListener('click', function () {
        rail.scrollTo({ left: c.offsetLeft - (rail.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
      });
      dots.appendChild(d);
    });
    var hint = document.createElement('p'); hint.className = 'swipe-hint';
    hint.innerHTML = '<span>Scorri di lato</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    var ui = document.createElement('div'); ui.className = 'rail-ui'; ui.appendChild(hint); ui.appendChild(dots);
    var wrap = document.createElement('div'); wrap.className = 'rail-wrap';
    rail.parentNode.insertBefore(ui, rail); rail.parentNode.insertBefore(wrap, rail); wrap.appendChild(rail);
    var chev = function (d) { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>'; };
    var prev = document.createElement('button'), next = document.createElement('button');
    prev.type = next.type = 'button'; prev.className = 'rail-arrow rail-prev off'; next.className = 'rail-arrow rail-next';
    prev.setAttribute('aria-label', 'Trattamento precedente'); next.setAttribute('aria-label', 'Trattamento successivo');
    prev.innerHTML = chev('M15 5l-7 7 7 7'); next.innerHTML = chev('M9 5l7 7-7 7');
    wrap.appendChild(prev); wrap.appendChild(next);
    var cur = 0;
    var go = function (i) {
      i = Math.max(0, Math.min(cards.length - 1, i)); var c = cards[i];
      rail.scrollTo({ left: c.offsetLeft - (rail.clientWidth - c.offsetWidth) / 2, behavior: 'smooth' });
    };
    prev.addEventListener('click', function () { go(cur - 1); });
    next.addEventListener('click', function () { go(cur + 1); });

    var touched = false, auto = false;
    var sync = function () {
      var mid = rail.scrollLeft + rail.clientWidth / 2, best = 0, dist = 1e9;
      cards.forEach(function (c, i) {
        var dd = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid);
        if (dd < dist) { dist = dd; best = i; }
      });
      if (rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4) best = cards.length - 1;
      [].forEach.call(dots.children, function (d, i) { d.setAttribute('aria-current', i === best); });
      cur = best;
      prev.classList.toggle('off', best === 0 && rail.scrollLeft < 12);
      next.classList.toggle('off', best === cards.length - 1);
    };
    rail.addEventListener('scroll', function () {
      sync();
      if (!auto && (touched || rail.scrollLeft > 24)) { touched = true; hint.classList.add('gone'); }
    }, { passive: true });
    rail.addEventListener('touchstart', function () { touched = true; }, { passive: true });
    sync();

    // movimento dimostrativo, una sola volta, quando le schede entrano nello schermo
    var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
    if ('IntersectionObserver' in window && !reduce) {
      var io = new IntersectionObserver(function (en) {
        if (!en[0].isIntersecting) return;
        io.disconnect();
        if (touched || rail.scrollWidth <= rail.clientWidth + 4 || rail.scrollLeft > 0) return;
        var t0 = null, max = 70, snap = rail.style.scrollSnapType;
        rail.style.scrollSnapType = 'none'; auto = true;
        var step = function (t) {
          if (touched) { auto = false; rail.style.scrollSnapType = snap; return; }
          if (t0 === null) t0 = t;
          var p = Math.min((t - t0) / 1100, 1);
          rail.scrollLeft = max * Math.sin(Math.PI * p);
          if (p < 1) requestAnimationFrame(step); else { rail.scrollLeft = 0; auto = false; rail.style.scrollSnapType = snap; }
        };
        setTimeout(function () { requestAnimationFrame(step); }, 500);
      }, { threshold: 0.6 });
      io.observe(rail);
    }
  }
})();
