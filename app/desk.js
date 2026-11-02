/* PanelPro Web — desktop shell (screens ≥ 1024 px wide). Interface only.
 *
 * Phones keep the one-column app. On a computer every screen is shown inside an app frame:
 * a sidebar (account space, sections, the open project's views), a title bar that carries the
 * screen's actions, menus that drop down where you click, and number boxes you type into
 * (same calculations as the keypad: 600-18, 2400/3…).
 */
(function () {
  'use strict';
  var A = null;
  var MQ = window.matchMedia ? window.matchMedia('(min-width: 1024px)') : null;
  var lastClick = null;   // the element the last menu / number box was opened from
  var ES = {
    'Projects': 'Proyectos', 'Search projects': 'Buscar proyectos', 'Modules': 'Módulos', 'Updated': 'Actualizado',
    'Name': 'Nombre', 'Client': 'Cliente', 'Project': 'Proyecto', 'Type a size or a calculation': 'Escriba una medida o un cálculo',
    'Enter to set · Esc to cancel': 'Enter para fijar · Esc para cancelar', 'Add module': 'Agregar módulo',
    'No modules yet': 'Aún no hay módulos', 'Pick a module on the left, or add one.': 'Elija un módulo a la izquierda o agregue uno.',
    'Project menu': 'Menú del proyecto', 'Composition': 'Composición', 'Cut list': 'Lista de corte', 'Cutting plan': 'Plan de corte',
    'Public gallery': 'Galería pública', 'Materials': 'Materiales', 'Companies': 'Empresas', 'Settings': 'Ajustes', 'Account': 'Cuenta',
    'Sign in': 'Iniciar sesión', 'No projects match.': 'Ningún proyecto coincide.'
  };
  function t(s) { return A.lang() === 'es' && ES[s] ? ES[s] : A.t(s); }
  function on() { return !!(MQ && MQ.matches); }
  function esc(s) { return A.esc(s); }
  function cloud() { return window.PPCloud && window.PPCloud.on ? window.PPCloud : null; }

  // ------------------------------------------------------------------ frame
  var ICON = {
    projects: '<path d="M3 6.5h7l2 2h9v10.5H3z"/>',
    materials: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
    gallery: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.5 5.2 3.5 8.5s-1 6.1-3.5 8.5c-2.5-2.4-3.5-5.2-3.5-8.5s1-6.1 3.5-8.5z"/>',
    companies: '<path d="M4 20V8l6-3v15M10 20V10h10v10M4 20h16M13 13h1M17 13h1M13 16h1M17 16h1"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    modules: '<rect x="4" y="4" width="7" height="16" rx="1"/><rect x="13" y="4" width="7" height="7" rx="1"/><rect x="13" y="13" width="7" height="7" rx="1"/>',
    compose: '<path d="M3 20h18M5 20V11h6v9M13 20V6h6v14"/>',
    cut: '<path d="M8 4v16M4 8h16M14 12h6M14 16h6"/>',
    opt: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M11 5v14M11 12h10"/>'
  };
  function ico(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true">' + ICON[k] + '</svg>'; }
  function navItem(href, key, label, active, sub) {
    return '<a class="dk-nav' + (active ? ' on' : '') + (sub ? ' sub' : '') + '" href="' + href + '">' + ico(key) + '<span>' + esc(label) + '</span></a>';
  }
  function sidebar() {
    var h = location.hash.replace(/^#\/?/, ''), p = h.split('/').map(decodeURIComponent);
    var C = cloud(), sp = C && C.space && C.space(), u = C && C.user && C.user();
    var site = p[0] === 'site' && p[1] ? A.site(p[1]) : null;
    var out = '<div class="dk-brand"><span class="dk-mark"><i></i><i></i><i></i></span><b>PanelPro</b></div>';
    if (sp) { out += '<button type="button" class="dk-space" id="dkSpace"><small>' + esc(t('Projects')) + '</small><span>' + esc(sp.name) + '</span><em>▾</em></button>'; }
    out += '<nav class="dk-navs">' + navItem('#/', 'projects', t('Projects'), !p[0] || (p[0] === 'site' && !site));
    if (site) {
      var base = '#/site/' + encodeURIComponent(site.id);
      out += '<div class="dk-proj"><div class="dk-proj-name" title="' + esc(site.name) + '">' + esc(site.name) + '</div>' +
        navItem(base, 'modules', t('Modules'), !p[2] || p[2] === 'm' || p[2] === 'new' || p[2] === 'pick', true) +
        navItem(base + '/compose', 'compose', t('Composition'), p[2] === 'compose', true) +
        navItem(base + '/cut', 'cut', t('Cut list'), p[2] === 'cut', true) +
        navItem(base + '/opt', 'opt', t('Cutting plan'), p[2] === 'opt', true) + '</div>';
    }
    out += navItem('#/materials', 'materials', t('Materials'), p[0] === 'materials');
    if (C) {
      out += navItem('#/gallery', 'gallery', t('Public gallery'), p[0] === 'gallery');
      out += navItem('#/companies', 'companies', t('Companies'), p[0] === 'companies' || p[0] === 'company');
    }
    out += navItem('#/settings', 'settings', t('Settings'), p[0] === 'settings') + '</nav>';
    if (u) {
      out += '<a class="dk-user' + (p[0] === 'account' || p[0] === 'plans' || p[0] === 'dev' ? ' on' : '') + '" href="#/account">' +
        (u.photoURL ? '<img alt="" src="' + esc(u.photoURL) + '" referrerpolicy="no-referrer">' : '<i>' + esc((u.displayName || u.email || '?')[0]) + '</i>') +
        '<span><b>' + esc(u.displayName || u.email) + '</b><small>' + esc(C.planLine()) + '</small></span></a>';
    }
    return out;
  }
  function wrap(html) {
    // sign-in and loading screens fill the window, without the app frame
    if (/^<div class="(signin|empty)"/.test(html)) { return html; }
    return '<div class="dk"><aside class="dk-side">' + sidebar() + '</aside><div class="dk-main">' + html + '</div></div>';
  }
  // After a screen is drawn: its bottom action bar moves into the title bar; the rest scrolls.
  function after(screen) {
    var main = screen.querySelector('.dk-main');
    if (!main) { return; }
    var top = main.querySelector(':scope > header.top');
    var body = document.createElement('div');
    body.className = 'dk-body';
    Array.prototype.slice.call(main.childNodes).forEach(function (n) { if (n !== top) { body.appendChild(n); } });
    main.appendChild(body);
    if (top) { dockInto(top, body); }
    var sp = screen.querySelector('#dkSpace');
    if (sp) { sp.onclick = function () { cloud().spaceMenu(); }; }
  }
  // a .dock directly in the scrolling body → its buttons go to the right of the title bar
  function dockInto(top, body) {
    var dock = body.querySelector(':scope > .dock');
    if (!dock) { return; }
    var box = top.querySelector('.dk-actions');
    if (!box) {
      box = document.createElement('div'); box.className = 'dk-actions';
      var more = top.querySelector('#moreBtn');
      top.insertBefore(box, more || null);
    }
    Array.prototype.slice.call(dock.children).forEach(function (b) { box.appendChild(b); });
    dock.remove();
  }
  function fixDock() {
    var main = document.querySelector('.dk-main');
    if (!main) { return; }
    var top = main.querySelector(':scope > header.top'), body = main.querySelector(':scope > .dk-body');
    var stray = main.querySelector(':scope > .dock') || document.querySelector('#screen > .dock');
    if (stray && body) { body.appendChild(stray); }
    if (top && body) { dockInto(top, body); }
  }

  // ------------------------------------------------------------------ menus that open where you click
  function menu(title, items) {
    var m = document.createElement('div');
    m.className = 'menu pop';
    m.innerHTML = '<div class="menu-sheet" role="menu">' + (title ? '<div class="menu-title">' + esc(title) + '</div>' : '') +
      items.map(function (it, i) { return '<button type="button" role="menuitem" data-i="' + i + '" class="' + (it.danger ? 'danger' : '') + '">' + esc(it.label) + '</button>'; }).join('') + '</div>';
    document.body.appendChild(m);
    place(m.firstChild, 'menu');
    var close = function () { m.remove(); document.removeEventListener('keydown', key, true); };
    var key = function (e) {
      var bs = Array.prototype.slice.call(m.querySelectorAll('button')), i = bs.indexOf(document.activeElement);
      if (e.key === 'Escape') { close(); e.preventDefault(); e.stopPropagation(); }
      else if (e.key === 'ArrowDown') { (bs[i + 1] || bs[0]).focus(); e.preventDefault(); }
      else if (e.key === 'ArrowUp') { (bs[i - 1] || bs[bs.length - 1]).focus(); e.preventDefault(); }
    };
    document.addEventListener('keydown', key, true);
    m.addEventListener('mousedown', function (e) { if (e.target === m) { close(); } });
    m.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (!b) { return; }
      close();
      items[+b.getAttribute('data-i')].run();
    });
    var first = m.querySelector('button'); if (first) { first.focus({ preventScroll: true }); }
  }
  // next to the element that was clicked, kept inside the window
  function place(box, kind) {
    var r = lastClick && lastClick.isConnected ? lastClick.getBoundingClientRect() : null;
    var w = box.offsetWidth, h = box.offsetHeight, W = innerWidth, H = innerHeight;
    var x, y;
    if (r) {
      x = kind === 'pad' ? r.right - w : r.left;
      if (x + w > W - 8) { x = r.right - w; }
      y = r.bottom + 6;
      if (y + h > H - 8) { y = r.top - h - 6; }
    } else { x = (W - w) / 2; y = Math.max(60, (H - h) / 3); }
    box.style.left = Math.max(8, Math.min(x, W - w - 8)) + 'px';
    box.style.top = Math.max(8, Math.min(y, H - h - 8)) + 'px';
  }

  // ------------------------------------------------------------------ number boxes (instead of the phone keypad)
  // opts as the app's openPad: label, value (mm or plain), unit, chips, auto, allowZero, done(v)
  function pad(opts) {
    var k = opts.unit ? 1 : A.uk(), unit = opts.unit || A.U();
    var old = document.querySelector('.dpad-wrap'); if (old) { old.remove(); }
    var w = document.createElement('div');
    w.className = 'dpad-wrap';
    var val = opts.value == null || opts.value === 'auto' ? '' : A.fmt(Number(opts.value) / k);
    w.innerHTML = '<div class="dpad" role="dialog" aria-label="' + esc(opts.label) + '"><label>' + esc(opts.label) + '</label>' +
      '<div class="dpad-in"><input type="text" inputmode="decimal" autocomplete="off" spellcheck="false" value="' + esc(val) + '" placeholder="' + esc(t('Type a size or a calculation')) + '"><span>' + esc(unit) + '</span></div>' +
      '<div class="dpad-res"></div>' +
      ((opts.chips || []).length ? '<div class="dpad-chips">' + opts.chips.map(function (c) { var v = A.fmt(c / k); return '<button type="button" data-chip="' + v + '">' + v + '</button>'; }).join('') + '</div>' : '') +
      '<div class="dpad-foot"><small>' + esc(t('Enter to set · Esc to cancel')) + '</small>' +
      (opts.auto ? '<button type="button" class="btn small" data-auto>' + esc(A.t('Auto')) + '</button>' : '') +
      '<button type="button" class="btn small primary" data-set>' + esc(A.t('Set')) + '</button></div></div>';
    document.body.appendChild(w);
    var box = w.firstChild, inp = box.querySelector('input'), res = box.querySelector('.dpad-res');
    place(box, 'pad');
    var close = function () { w.remove(); };
    var calc = window.PanelProWeb.calc;
    var show = function () {
      var e = inp.value.trim(), v = calc(e);
      res.classList.toggle('bad', e !== '' && isNaN(v));
      res.textContent = e === '' ? '' : isNaN(v) ? A.t('Not a valid calculation') : /[-+*/]/.test(e.replace(/^-/, '')) ? '= ' + A.fmt(v) + ' ' + unit : '';
    };
    var set = function () {
      var v = calc(inp.value.trim());
      if (v == null) { res.classList.add('bad'); res.textContent = A.t('Enter a size'); return; }
      if (isNaN(v) || v < 0 || (v === 0 && !opts.allowZero)) { res.classList.add('bad'); res.textContent = A.t('Not a valid calculation'); return; }
      close();
      opts.done(Math.round(v * k * 1000) / 1000);
    };
    inp.addEventListener('input', show);
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { set(); e.preventDefault(); }
      else if (e.key === 'Escape') { close(); e.preventDefault(); e.stopPropagation(); }
    });
    w.addEventListener('mousedown', function (e) { if (e.target === w) { close(); } });
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) { return; }
      if (b.hasAttribute('data-chip')) { inp.value = b.getAttribute('data-chip'); show(); inp.focus(); }
      else if (b.hasAttribute('data-auto')) { close(); opts.done('auto'); }
      else if (b.hasAttribute('data-set')) { set(); }
    });
    inp.focus(); inp.select();
  }

  // ------------------------------------------------------------------ start
  function init() {
    A = window.PPApp;
    document.body.classList.toggle('desk', on());
    // remember what was clicked, so menus and number boxes open next to it
    document.addEventListener('pointerdown', function (e) {
      var b = e.target.closest && e.target.closest('button, a, [role="button"]');
      if (b && !b.closest('.menu, .dpad-wrap')) { lastClick = b; }
    }, true);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { var b = document.activeElement; if (b && b.tagName === 'BUTTON') { lastClick = b; } }
    }, true);
    if (MQ) {
      var flip = function () { document.body.classList.toggle('desk', on()); A.route(); };
      if (MQ.addEventListener) { MQ.addEventListener('change', flip); } else if (MQ.addListener) { MQ.addListener(flip); }
    }
  }

  window.PPDesk = { on: on, wrap: wrap, after: after, fixDock: fixDock, menu: menu, pad: pad, init: init, t: t };
})();
