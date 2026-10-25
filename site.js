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

  // Galleria e prodotti: filtri, ordinamento e ingrandimento foto
  var grid = document.querySelector('.grid, .pgrid');
  if (grid) {
    var allItems = function () { return [].slice.call(grid.querySelectorAll('.ph button, button[data-c]')); };
    document.querySelectorAll('.filters button').forEach(function (b) {
      b.addEventListener('click', function () {
        document.querySelectorAll('.filters button').forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
        allItems().forEach(function (it) { it.hidden = b.dataset.f !== 'tutte' && it.dataset.c !== b.dataset.f; });
      });
    });
    var dlg = document.getElementById('lb');
    var img = dlg.querySelector('img'), cap = dlg.querySelector('p'), cur = 0;
    var visible = function () { return allItems().filter(function (i) { return !i.hidden; }); };
    var show = function (n) {
      var v = visible(); cur = (n + v.length) % v.length;
      var s = v[cur].querySelector('img');
      img.src = s.dataset.full || s.src; img.alt = s.alt; cap.textContent = s.alt;
    };
    allItems().forEach(function (it) {
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

  // Prodotti: ordine per prezzo (di base crescente; il prezzo conta quello in offerta se c'e')
  var pgrid = document.querySelector('.pgrid');
  if (pgrid) {
    var sortDir = 'asc';
    var priceOf = function (el) {
      var n = el.querySelector('.new') || el.querySelector('.p');
      var m = n ? n.textContent.replace(/\u00a0/g, ' ').match(/\d+(?:[.,]\d+)?/) : null;
      return m ? parseFloat(m[0].replace(',', '.')) : 1e9;
    };
    [].forEach.call(pgrid.children, function (c, i) { c.dataset.i = i; });
    window.sortProducts = function () {
      var list = [].slice.call(pgrid.children);
      list.sort(function (a, b) {
        var d = priceOf(a) - priceOf(b);
        return d !== 0 ? (sortDir === 'asc' ? d : -d) : a.dataset.i - b.dataset.i;
      });
      list.forEach(function (c) { pgrid.appendChild(c); });
    };
    var cnt = document.querySelector('.sortbar .count');
    if (cnt) { var np = pgrid.children.length; cnt.textContent = np + (np === 1 ? ' prodotto' : ' prodotti'); }
    var seg = document.querySelector('.sortbar .seg');
    document.querySelectorAll('.sortbar button').forEach(function (b) {
      b.addEventListener('click', function () {
        sortDir = b.dataset.sort;
        if (seg) seg.dataset.dir = sortDir;
        document.querySelectorAll('.sortbar button').forEach(function (o) { o.setAttribute('aria-pressed', o === b); });
        window.sortProducts();
      });
    });
  }

  // Schede trattamenti scorrevoli: puntini, suggerimento "scorri" e piccolo movimento iniziale
  [].forEach.call(document.querySelectorAll('.cards'), function (rail) {
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
  });

  // Offerta del momento (si configura solo in offerta.js)
  var eur = function (n) { return (n % 1 ? n.toFixed(2) : String(n)).replace('.', ',') + '\u00a0€'; };
  var el_ = function (tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
  var applyOffer = function () {
    var o = window.OFFERTA;
    if (!o || !o.attiva) return;
    var oggi = new Date().toLocaleDateString('sv-SE', { timeZone: 'Europe/Rome' });
    if ((o.inizio && oggi < o.inizio) || (o.scadenza && oggi > o.scadenza)) return;
    var fino = o.scadenza ? 'Valida fino al ' + new Date(o.scadenza + 'T12:00:00Z').toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '';
    var voci = Object.keys(o.prezzi || {}).map(function (n) { return { nome: n, prima: +o.prezzi[n].prima, ora: +o.prezzi[n].ora }; });
    var wa = 'https://wa.me/393487819352?text=' + encodeURIComponent('Ciao Elisa, vorrei prenotare con l\u2019offerta: ' + (o.titolo || 'offerta del momento'));

    // Home: riquadro dopo la parte iniziale
    var hero = document.querySelector('.hero');
    if (hero) {
      var sec = el_('section', 'offer-sec'); sec.id = 'offerta';
      var wrap = el_('div', 'wrap'), box = el_('div', 'offer');
      var left = el_('div', 'offer-text');
      left.appendChild(el_('span', 'offer-tag', 'Offerta attiva'));
      left.appendChild(el_('h2', null, o.titolo || 'Offerta del momento'));
      if (o.testo) left.appendChild(el_('p', null, o.testo));
      if (fino) left.appendChild(el_('p', 'offer-until', fino));
      var btns = el_('div', 'btns'), a = el_('a', 'btn btn-primary', 'Prenota l\u2019offerta'); a.href = wa; btns.appendChild(a); left.appendChild(btns);
      box.appendChild(left);
      if (voci.length) {
        var ul = el_('ul', 'offer-list');
        voci.forEach(function (v) {
          var li = el_('li'), p = el_('span', 'p');
          li.appendChild(el_('span', 'n', v.nome));
          p.appendChild(el_('s', 'old', eur(v.prima))); p.appendChild(el_('strong', 'new', eur(v.ora)));
          li.appendChild(p); ul.appendChild(li);
        });
        box.appendChild(ul);
      }
      wrap.appendChild(box); sec.appendChild(wrap);
      var anchor = document.getElementById('prodotti') || document.getElementById('orari');
      if (anchor) anchor.parentNode.insertBefore(sec, anchor); else hero.parentNode.insertBefore(sec, hero.nextSibling);
    }

    // Listino: prezzo barrato + prezzo scontato in evidenza
    var items = document.querySelectorAll('.prices li, .product, .pcard');
    if (items.length) {
      var map = {}; voci.forEach(function (v) { map[v.nome.trim().toLowerCase()] = v; });
      var n = 0, used = {};
      [].forEach.call(items, function (li) {
        var nm = li.querySelector('.n'), pr = li.querySelector('.p'), v = map[nm.textContent.trim().toLowerCase()];
        if (!nm || !pr || !v) return;
        n++; used[nm.textContent.trim().toLowerCase()] = true; li.classList.add('on-offer');
        nm.appendChild(el_('span', 'tag', 'Offerta'));
        pr.textContent = '';
        pr.appendChild(el_('s', 'old', eur(v.prima))); pr.appendChild(el_('strong', 'new', eur(v.ora)));
      });
      Object.keys(map).forEach(function (k) { if (!used[k]) console.warn('Offerta: "' + map[k].nome + '" non coincide con nessuna voce del listino'); });
      if (window.sortProducts) window.sortProducts();
      var top = document.querySelector('.page-top');
      if (top && n) {
        var bar = el_('div', 'offer-bar'), w2 = el_('div', 'wrap');
        w2.appendChild(el_('strong', null, 'Offerta attiva: ' + (o.titolo || '')));
        if (fino) w2.appendChild(document.createTextNode(' \u2013 ' + fino.charAt(0).toLowerCase() + fino.slice(1)));
        bar.appendChild(w2); top.parentNode.insertBefore(bar, top.nextSibling);
      }
    }
  };
  if (document.querySelector('.hero, .prices, .product, .pcard')) {
    var sc = document.createElement('script'); sc.src = 'offerta.js'; sc.onload = applyOffer; document.head.appendChild(sc);
  }
})();
