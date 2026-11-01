/* PanelPro Web — field app screens (phone first, works offline).
 *
 * Sites (projects) → modules. A module is the plugin's own params object; every size, panel
 * and cut-list row comes from the shared engine (window.Engine → the plugin's core/*.rb).
 * This file is interface only: no module rules live here.
 */
(function () {
  'use strict';

  var VERSION = '0.3.24';
  var BUILD = 'df0aed43d8';
  var STORE = 'panelpro.web.sites.v1';
  var LANG_KEY = 'panelpro.web.lang';
  var FILE_FORMAT = 'panelpro-site';

  // ------------------------------------------------------------------ text (EN source, ES)
  var ES = {
    'Sites': 'Obras', 'New site': 'Obra nueva', 'Open a project file': 'Abrir un archivo de proyecto',
    'No sites yet': 'Aún no hay obras', 'Start one for the room you are measuring.': 'Cree una para el espacio que está midiendo.',
    'modules': 'módulos', 'module': 'módulo', 'Add module': 'Agregar módulo', 'Cut list': 'Lista de corte',
    'Share project file': 'Compartir archivo de proyecto', 'Rename site': 'Renombrar obra', 'Delete site': 'Eliminar obra',
    'Site name': 'Nombre de la obra', 'Client': 'Cliente', 'Notes': 'Notas', 'Create site': 'Crear obra',
    'No modules yet': 'Aún no hay módulos', 'Add the first module for this site.': 'Agregue el primer módulo de esta obra.',
    'Pick a module': 'Elija un módulo', 'Width': 'Ancho', 'Height': 'Alto', 'Depth': 'Fondo',
    'Name': 'Nombre', 'Fronts': 'Frentes', 'Section': 'Sección', 'Row': 'Fila', 'auto': 'auto', 'Auto': 'Auto',
    'Door': 'Puerta', 'Door pair': 'Par de puertas', 'Drawer': 'Gaveta', 'False front': 'Frente falso', 'Open': 'Abierto',
    'Hinge left': 'Bisagra izq.', 'Hinge right': 'Bisagra der.', 'Lift up': 'Abre hacia arriba', 'Drop down': 'Abatible',
    '+ Row': '+ Fila', 'Front style': 'Estilo de frente', 'Slab': 'Liso', 'Shaker': 'Shaker', 'Plank': 'Tablillas',
    'Grooved': 'Ranurado', 'Glass': 'Vidrio', 'Toe kick': 'Zócalo', 'Legs': 'Patas', 'Plinth': 'Zócalo aparte',
    'Built in': 'Integrado', 'None': 'Ninguno', 'Kick height': 'Altura del zócalo', 'Off the floor': 'Altura desde el piso',
    'Add to site': 'Agregar a la obra', 'Save changes': 'Guardar cambios', 'Duplicate': 'Duplicar', 'Delete module': 'Eliminar módulo',
    'Open all': 'Abrir todo', 'Close all': 'Cerrar todo', 'Fit': 'Ajustar', 'Drag to turn · pinch to zoom · tap a door': 'Arrastre para girar · pellizque para zoom · toque una puerta',
    'Set': 'Fijar', 'Enter a size': 'Escriba una medida', 'Not a valid calculation': 'Cálculo no válido',
    'Share cut list (CSV)': 'Compartir lista de corte (CSV)', 'Hardware': 'Herrajes', 'Edge banding': 'Canto',
    'Sheets (estimate incl. 15% waste)': 'Tableros (estimado con 15% de desperdicio)', 'Toe kick bars (4 m)': 'Barras de zócalo (4 m)',
    'bars': 'barras', 'pieces': 'piezas', 'Saved': 'Guardado', 'Added to the site': 'Agregado a la obra',
    'Deleted': 'Eliminado', 'Delete this site and its modules?': '¿Eliminar esta obra y sus módulos?',
    'Delete this module?': '¿Eliminar este módulo?', 'Discard your changes?': '¿Descartar los cambios?',
    'This file is not a PanelPro project.': 'Este archivo no es un proyecto PanelPro.',
    'Opened': 'Abierto', 'This site is already on the phone. Replace it with the file?': 'Esta obra ya está en el teléfono. ¿Reemplazarla con el archivo?',
    'Language': 'Idioma', 'English': 'English', 'Español': 'Español', 'Back': 'Atrás', 'More': 'Más',
    'Could not start the module engine.': 'No se pudo iniciar el motor de módulos.',
    'Check the connection and open the app again. The first start needs internet; after that it works offline.': 'Revise la conexión y abra la app otra vez. El primer inicio necesita internet; después funciona sin conexión.',
    'Loading the module engine…': 'Cargando el motor de módulos…',
    'The first time takes a moment. After that it opens offline.': 'La primera vez tarda un momento. Después abre sin conexión.',
    'Engine': 'Motor', 'New version ready': 'Nueva versión lista', 'Reload': 'Recargar',
    'Copy of': 'Copia de', 'Kneehole (open)': 'Hueco para piernas (abierto)', 'Shared': 'Compartido',
    'File saved': 'Archivo guardado', 'Could not save the site on this phone.': 'No se pudo guardar la obra en este teléfono.',
    'Height of this row': 'Alto de esta fila', 'Module': 'Módulo', 'Site': 'Obra', 'Cancel': 'Cancelar',
    'This module cannot be built:': 'Este módulo no se puede construir:', 'parts': 'piezas'
  };
  var lang = 'en';
  function t(s) {
    if (lang !== 'es') { return s; }
    if (ES[s]) { return ES[s]; }
    return window.I18N ? window.I18N.t(s) : s;
  }

  // ------------------------------------------------------------------ helpers
  function $(sel, root) { return (root || document).querySelector(sel); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function uid() {
    if (window.crypto && crypto.randomUUID) { return crypto.randomUUID(); }
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10);
  }
  function now() { return new Date().toISOString(); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fmt(v) {
    var n = Number(v);
    if (!isFinite(n)) { return String(v); }
    return String(Math.round(n * 10) / 10);
  }
  function load(key, fallback) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function save(key, v) {
    try { localStorage.setItem(key, JSON.stringify(v)); return true; } catch (e) { return false; }
  }
  var toastTimer = null;
  function toast(msg, action) {
    var el = $('#toast');
    el.innerHTML = '<span>' + esc(msg) + '</span>' + (action ? '<button type="button">' + esc(action.label) + '</button>' : '');
    el.hidden = false;
    if (action) { el.querySelector('button').onclick = function () { el.hidden = true; action.run(); }; }
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.hidden = true; }, action ? 10000 : 1600);
  }

  // Material colours for the 3D view (same defaults as the plugin's SketchUp materials).
  var COLORS = {
    'PanelPro Carcass': '#ece8de', 'PanelPro Back': '#cdc6b8', 'PanelPro Fronts': '#96a8ba', 'PanelPro Face Frame': '#b08458',
    'PanelPro Drawer Box': '#dec496', 'PanelPro Top': '#7d6854', 'PanelPro Kick': '#464646', 'PanelPro Glass': '#8c643e',
    'PanelPro Black Aluminium': '#202022', 'PanelPro Kick Stainless': '#c4c6c8', 'PanelPro Metal': '#969ba0',
    'PanelPro Pull Black': '#232325', 'PanelPro Pull Stainless': '#c0c2c4', 'PanelPro Pull Aluminium': '#aab0b8', 'PanelPro Pull Gold': '#c4a052'
  };
  function matInfo(name) {
    if (!name) { return null; }
    if (COLORS[name]) { return { color: COLORS[name], alpha: name === 'PanelPro Glass' ? 0.45 : 1 }; }
    var h = 7;
    for (var i = 0; i < name.length; i++) { h = (h * 31 + name.charCodeAt(i)) % 16777216; }
    var r = 120 + h % 120, g = 120 + Math.floor(h / 256) % 120, b = 120 + Math.floor(h / 65536) % 120;
    return { color: 'rgb(' + r + ',' + g + ',' + b + ')', alpha: 1 };
  }

  // ------------------------------------------------------------------ data
  var sites = [];
  var info = null;          // engine info: presets, choices…
  var presetThumbs = {};
  var modThumbs = {};       // module id + updated → data URL

  function persist() {
    if (!save(STORE, sites)) { toast(t('Could not save the site on this phone.')); }
  }
  function site(id) { return sites.find(function (s) { return s.id === id; }) || null; }
  function touch(s) { s.updated = now(); }

  // Codes (A, A1, B…) from the shared engine; the letter map is kept with the site.
  function codesOf(s) {
    if (!s.modules.length) { return {}; }
    try {
      var r = Engine.call('codes', { modules: s.modules, codes_state: s.codes_state || null });
      if (JSON.stringify(r.codes_state) !== JSON.stringify(s.codes_state || null)) { s.codes_state = r.codes_state; persist(); }
      return r.codes;
    } catch (e) { return {}; }
  }
  function codeSort(codes) {
    return function (a, b) {
      var ca = codes[a.id] || '', cb = codes[b.id] || '';
      var ma = /^([A-Z]+)(\d*)$/.exec(ca) || ['', ca, ''], mb = /^([A-Z]+)(\d*)$/.exec(cb) || ['', cb, ''];
      if (ma[1].length !== mb[1].length) { return ma[1].length - mb[1].length; }
      if (ma[1] !== mb[1]) { return ma[1] < mb[1] ? -1 : 1; }
      return (+ma[2] || 0) - (+mb[2] || 0);
    };
  }
  function dimsOf(p) { return fmt(p.width) + ' × ' + fmt(p.height) + ' × ' + fmt(p.depth); }
  function presetLabel(key) {
    var p = info && info.presets.find(function (x) { return x.key === key; });
    return p ? t(p.label) : '';
  }

  // ------------------------------------------------------------------ 3D (one viewer, moved between screens)
  var viewer = null, has3d = false;
  function ensureViewer() {
    if (viewer) { return viewer; }
    viewer = document.createElement('div');
    viewer.className = 'view3d-host';
    viewer.style.cssText = 'position:absolute;inset:0';
    has3d = !!(window.P3D && window.P3D.ok && window.P3D.init(viewer));
    return viewer;
  }
  function snapshot(res, w, h) {
    if (!window.P3D || !P3D.snapshot || !res) { return null; }
    return P3D.snapshot(res.parts || [], matInfo, res.movers || [], { w: w || 320, h: h || 240 });
  }
  function moduleThumb(m) {
    var k = m.id + '|' + m.updated;
    if (modThumbs[k] !== undefined) { return modThumbs[k]; }
    try { modThumbs[k] = snapshot(Engine.call('build', { params: m.params, lang: lang }), 288, 224); }
    catch (e) { modThumbs[k] = null; }
    return modThumbs[k];
  }

  // ------------------------------------------------------------------ keypad
  // Calculations allowed: 1200-18, 600*2, 2400/3 … (left to right with × ÷ first).
  function calc(expr) {
    var s = String(expr).replace(/\s+/g, '').replace(/,/g, '.').replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
    if (!s) { return null; }
    if (!/^[-+*/.\d]+$/.test(s)) { return NaN; }
    var toks = s.match(/(\d+\.?\d*|\.\d+|[-+*/])/g);
    if (!toks || toks.join('') !== s) { return NaN; }
    var i = 0;
    function num() {
      var sign = 1;
      while (toks[i] === '-' || toks[i] === '+') { if (toks[i] === '-') { sign = -sign; } i++; }
      if (i >= toks.length || !/^[\d.]/.test(toks[i])) { throw new Error('x'); }
      return sign * parseFloat(toks[i++]);
    }
    function term() {
      var v = num();
      while (toks[i] === '*' || toks[i] === '/') {
        var op = toks[i++], r = num();
        v = op === '*' ? v * r : v / r;
      }
      return v;
    }
    try {
      var v = term();
      while (toks[i] === '+' || toks[i] === '-') {
        var op = toks[i++], r = term();
        v = op === '+' ? v + r : v - r;
      }
      if (i !== toks.length) { return NaN; }
      return isFinite(v) ? Math.round(v * 10) / 10 : NaN;
    } catch (e) { return NaN; }
  }

  var pad = { cb: null, expr: '' };
  function openPad(opts) {
    pad.cb = opts.done;
    pad.expr = opts.value == null || opts.value === 'auto' ? '' : fmt(opts.value);
    pad.fresh = true;
    pad.allowZero = !!opts.allowZero;
    $('#padLabel').textContent = opts.label;
    $('#padChips').innerHTML = (opts.chips || []).map(function (c) {
      return '<button type="button" data-chip="' + c + '">' + c + '</button>';
    }).join('');
    $('#pad .pad-auto').hidden = !opts.auto;
    $('#pad .pad-auto').textContent = t('Auto');
    $('#pad .pad-set').textContent = t('Set');
    $('#pad').hidden = false;
    padShow();
  }
  function padShow() {
    $('#padExpr').textContent = pad.expr || '0';
    var v = calc(pad.expr), r = $('#padResult');
    var isCalc = /[-+*/]/.test(pad.expr.replace(/^-/, ''));
    r.classList.toggle('bad', pad.expr !== '' && isNaN(v));
    r.textContent = pad.expr === '' ? '' : isNaN(v) ? t('Not a valid calculation') : isCalc ? '= ' + fmt(v) + ' mm' : '';
  }
  function closePad() { $('#pad').hidden = true; pad.cb = null; }
  function wirePad() {
    $('#pad').addEventListener('click', function (e) {
      if (e.target === $('#pad')) { closePad(); return; }
      var b = e.target.closest('button');
      if (!b) { return; }
      var k = b.getAttribute('data-k'), chip = b.getAttribute('data-chip'), act = b.getAttribute('data-pad');
      if (k) {
        if (k === 'back') { pad.expr = pad.expr.slice(0, -1); }
        else {
          if (pad.fresh && /[\d.]/.test(k)) { pad.expr = ''; }
          pad.expr += k;
        }
        pad.fresh = false;
        padShow();
      } else if (chip) {
        pad.expr = chip; pad.fresh = false; padShow();
      } else if (act === 'cancel') { closePad(); }
      else if (act === 'auto') { var cb0 = pad.cb; closePad(); if (cb0) { cb0('auto'); } }
      else if (act === 'set') {
        var v = calc(pad.expr);
        if (v == null) { $('#padResult').textContent = t('Enter a size'); return; }
        if (isNaN(v) || v < 0 || (v === 0 && !pad.allowZero)) { $('#padResult').classList.add('bad'); $('#padResult').textContent = t('Not a valid calculation'); return; }
        var cb = pad.cb; closePad(); if (cb) { cb(v); }
      }
    });
    document.addEventListener('keydown', function (e) {
      if ($('#pad').hidden) { return; }
      if (/^[\d.+\-*/]$/.test(e.key)) { if (pad.fresh && /[\d.]/.test(e.key)) { pad.expr = ''; } pad.expr += e.key; pad.fresh = false; padShow(); e.preventDefault(); }
      else if (e.key === 'Backspace') { pad.expr = pad.expr.slice(0, -1); padShow(); e.preventDefault(); }
      else if (e.key === 'Enter') { $('#pad .pad-set').click(); e.preventDefault(); }
      else if (e.key === 'Escape') { closePad(); }
    });
  }

  // ------------------------------------------------------------------ menu sheet
  function menu(title, items) {
    var m = document.createElement('div');
    m.className = 'menu';
    m.innerHTML = '<div class="menu-sheet" role="menu">' + (title ? '<div class="menu-title">' + esc(title) + '</div>' : '') +
      items.map(function (it, i) { return '<button type="button" role="menuitem" data-i="' + i + '" class="' + (it.danger ? 'danger' : '') + '">' + esc(it.label) + '</button>'; }).join('') +
      '<button type="button" data-i="-1">' + esc(t('Cancel')) + '</button></div>';
    document.body.appendChild(m);
    m.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (e.target !== m && !b) { return; }
      m.remove();
      if (b && +b.getAttribute('data-i') >= 0) { items[+b.getAttribute('data-i')].run(); }
    });
  }

  // ------------------------------------------------------------------ routing (#/…, phone back button works)
  var screen = null;
  function go(hash, replace) {
    if (replace) { location.replace(hash); } else { location.hash = hash; }
  }
  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var p = h.split('/').map(decodeURIComponent);
    window.scrollTo(0, 0);
    if (p[0] === 'site' && site(p[1])) {
      var s = site(p[1]);
      if (p[2] === 'pick') { return renderPick(s); }
      if (p[2] === 'new' && p[3]) { return renderEdit(s, null, p[3]); }
      if (p[2] === 'm' && p[3]) {
        var m = s.modules.find(function (x) { return x.id === p[3]; });
        if (m) { return renderEdit(s, m); }
      }
      if (p[2] === 'cut') { return renderCut(s); }
      return renderSite(s);
    }
    if (p[0] === 'newsite') { return renderNewSite(); }
    renderSites();
  }
  function show(html) {
    screen = $('#screen');
    screen.innerHTML = html;
    screen.hidden = false;
    document.documentElement.lang = lang;
  }

  // ------------------------------------------------------------------ screens: sites
  function renderSites() {
    var list = sites.slice().sort(function (a, b) { return a.updated < b.updated ? 1 : -1; });
    show(
      '<header class="top"><h1>' + esc(t('Sites')) + '</h1>' +
      '<button type="button" class="text-btn" id="langBtn" aria-label="' + esc(t('Language')) + '">' + (lang === 'es' ? 'EN' : 'ES') + '</button>' +
      '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(t('More')) + '">⋯</button></header>' +
      '<div class="page">' +
      (list.length ? '<div class="list">' + list.map(function (s) {
        var n = s.modules.length;
        return '<button type="button" class="row-card" data-site="' + esc(s.id) + '"><span class="grow"><span class="t1">' + esc(s.name) + '</span>' +
          '<span class="t2">' + esc([s.client, n + ' ' + t(n === 1 ? 'module' : 'modules'), new Date(s.updated).toLocaleDateString(lang)].filter(Boolean).join(' · ')) + '</span></span>' +
          '<span class="chev" aria-hidden="true">›</span></button>';
      }).join('') + '</div>'
        : '<div class="empty"><h2>' + esc(t('No sites yet')) + '</h2><p>' + esc(t('Start one for the room you are measuring.')) + '</p></div>') +
      '<p class="meta-line" style="margin-top:28px;text-align:center">PanelPro Web ' + esc(VERSION) + ' · ' + esc(t('Engine')) + ' ' + esc(Engine.version || '') + '</p>' +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="newSite">' + esc(t('New site')) + '</button></div>'
    );
    screen.querySelectorAll('[data-site]').forEach(function (b) { b.onclick = function () { go('#/site/' + encodeURIComponent(b.getAttribute('data-site'))); }; });
    $('#newSite').onclick = function () { go('#/newsite'); };
    $('#langBtn').onclick = function () { setLang(lang === 'es' ? 'en' : 'es'); route(); };
    $('#moreBtn').onclick = function () {
      menu(null, [{ label: t('Open a project file'), run: function () { $('#fileIn').click(); } }]);
    };
  }

  function renderNewSite(s) {
    var editing = !!s;
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(editing ? t('Rename site') : t('New site')) + '</h1></header>' +
      '<div class="page">' +
      '<label class="field"><span>' + esc(t('Site name')) + '</span><input class="text-in" id="sName" autocomplete="off" value="' + esc(s ? s.name : '') + '" placeholder="Kitchen, 12 Ocean Drive"></label>' +
      '<label class="field"><span>' + esc(t('Client')) + '</span><input class="text-in" id="sClient" autocomplete="off" value="' + esc(s ? s.client : '') + '"></label>' +
      '<label class="field"><span>' + esc(t('Notes')) + '</span><input class="text-in" id="sNotes" autocomplete="off" value="' + esc(s ? s.notes : '') + '"></label>' +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="saveSite">' + esc(editing ? t('Save changes') : t('Create site')) + '</button></div>'
    );
    $('#back').onclick = function () { history.back(); };
    if (!editing) { setTimeout(function () { $('#sName').focus(); }, 50); }
    $('#saveSite').onclick = function () {
      var name = $('#sName').value.trim() || (t('Site') + ' ' + (sites.length + 1));
      if (editing) {
        s.name = name; s.client = $('#sClient').value.trim(); s.notes = $('#sNotes').value.trim(); touch(s); persist();
        renderSite(s);
        return;
      }
      var ns = { id: uid(), name: name, client: $('#sClient').value.trim(), notes: $('#sNotes').value.trim(),
                 created: now(), updated: now(), next_order: 1, codes_state: null, modules: [] };
      sites.push(ns); persist();
      go('#/site/' + encodeURIComponent(ns.id), true);
    };
  }

  // ------------------------------------------------------------------ screens: one site
  function renderSite(s) {
    var codes = codesOf(s);
    var mods = s.modules.slice().sort(codeSort(codes));
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(s.name) + (s.client ? '<span class="sub">' + esc(s.client) + '</span>' : '') + '</h1>' +
      '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(t('More')) + '">⋯</button></header>' +
      '<div class="page">' +
      (s.notes ? '<p class="meta-line">' + esc(s.notes) + '</p>' : '') +
      (mods.length ? '<div class="list">' + mods.map(function (m) {
        return '<button type="button" class="row-card" data-mod="' + esc(m.id) + '">' +
          '<span class="code">' + esc(codes[m.id] || '?') + '</span>' +
          '<img class="thumb" alt="" data-thumb="' + esc(m.id) + '">' +
          '<span class="grow"><span class="t1">' + esc(m.params.name || presetLabel(m.params.type)) + '</span>' +
          '<span class="t2 dims">' + dimsOf(m.params) + '</span></span></button>';
      }).join('') + '</div>' +
      '<div style="display:flex;gap:10px;margin-top:16px"><button type="button" class="btn" id="cutBtn" style="flex:1">' + esc(t('Cut list')) + '</button>' +
      '<button type="button" class="btn" id="shareBtn" style="flex:1">' + esc(t('Share project file')) + '</button></div>'
        : '<div class="empty"><h2>' + esc(t('No modules yet')) + '</h2><p>' + esc(t('Add the first module for this site.')) + '</p></div>') +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="addMod">' + esc(t('Add module')) + '</button></div>'
    );
    $('#back').onclick = function () { go('#/'); };
    $('#addMod').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/pick'); };
    if ($('#cutBtn')) { $('#cutBtn').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/cut'); }; }
    if ($('#shareBtn')) { $('#shareBtn').onclick = function () { shareSite(s); }; }
    screen.querySelectorAll('[data-mod]').forEach(function (b) {
      b.onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/m/' + encodeURIComponent(b.getAttribute('data-mod'))); };
    });
    $('#moreBtn').onclick = function () {
      menu(s.name, [
        { label: t('Share project file'), run: function () { shareSite(s); } },
        { label: t('Rename site'), run: function () { renderNewSite(s); } },
        { label: t('Delete site'), danger: true, run: function () {
          if (!confirm(t('Delete this site and its modules?'))) { return; }
          sites = sites.filter(function (x) { return x !== s; }); persist(); toast(t('Deleted')); go('#/', true);
        } }
      ]);
    };
    // thumbnails one by one, so the list shows at once
    var imgs = Array.prototype.slice.call(screen.querySelectorAll('[data-thumb]'));
    (function next() {
      var img = imgs.shift();
      if (!img || !img.isConnected) { return; }
      var m = s.modules.find(function (x) { return x.id === img.getAttribute('data-thumb'); });
      var url = m && moduleThumb(m);
      if (url) { img.src = url; } else { img.style.visibility = 'hidden'; }
      setTimeout(next, 0);
    })();
  }

  // ------------------------------------------------------------------ screens: module picker
  function renderPick(s) {
    var cats = [];
    info.presets.forEach(function (p) { if (cats.indexOf(p.category) < 0) { cats.push(p.category); } });
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(t('Pick a module')) + '</h1></header>' +
      '<div class="page">' + cats.map(function (c) {
        return '<h2 class="section-h">' + esc(t(c)) + '</h2><div class="cards">' + info.presets.filter(function (p) { return p.category === c; }).map(function (p) {
          var full = t(p.label), nm = full.indexOf(' — ') > 0 ? full.split(' — ').slice(1).join(' — ') : full;
          return '<button type="button" class="mcard" data-key="' + esc(p.key) + '"><img class="pic wait" alt="" data-pk="' + esc(p.key) + '">' +
            '<span class="nm">' + esc(nm) + '</span><span class="sz">' + esc(p.dims || '') + '</span></button>';
        }).join('') + '</div>';
      }).join('') + '</div>'
    );
    $('#back').onclick = function () { history.back(); };
    screen.querySelectorAll('[data-key]').forEach(function (b) {
      b.onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/new/' + encodeURIComponent(b.getAttribute('data-key'))); };
    });
    var imgs = Array.prototype.slice.call(screen.querySelectorAll('[data-pk]'));
    (function next() {
      var img = imgs.shift();
      if (!img || !img.isConnected) { return; }
      var url = presetThumb(img.getAttribute('data-pk'));
      if (url) { img.src = url; img.classList.remove('wait'); }
      setTimeout(next, 0);
    })();
  }
  function presetThumb(key) {
    if (presetThumbs[key]) { return presetThumbs[key]; }
    try {
      var url = snapshot(Engine.call('build', { params: Engine.call('preset', { key: key }) }), 320, 240);
      if (url) { presetThumbs[key] = url; save('panelpro.web.thumbs', { v: BUILD, t: presetThumbs }); }
      return url;
    } catch (e) { return null; }
  }

  // ------------------------------------------------------------------ screens: module editor
  var E = null; // { site, mod, params, res, error, dirty }

  var CHIPS = {
    width: [300, 400, 450, 500, 600, 800, 900, 1000],
    height: [360, 720, 870, 900, 2100, 2200, 2400],
    depth: [300, 350, 450, 560, 580, 600],
    row: [140, 180, 250, 300, 400],
    kick: [100, 150],
    elevation: [0, 1400, 1450, 1500]
  };
  var FRONT_CHOICES = [['door', 'Door'], ['door_pair', 'Door pair'], ['drawer', 'Drawer'], ['false_front', 'False front'], ['none', 'Open']];
  var STYLE_CHOICES = [['slab', 'Slab'], ['shaker', 'Shaker'], ['plank', 'Plank'], ['grooved', 'Grooved'], ['glass', 'Glass']];
  var KICK_CHOICES = [['legs', 'Legs'], ['plinth', 'Plinth'], ['integral', 'Built in'], ['none', 'None']];
  var HINGE_LABEL = { L: 'Hinge left', R: 'Hinge right', T: 'Lift up', B: 'Drop down' };

  function renderEdit(s, mod, presetKey) {
    if (!E || E.site !== s || E.mod !== mod || (!mod && E.presetKey !== presetKey)) {
      var params;
      try { params = mod ? Engine.call('normalize', { params: mod.params }) : Engine.call('preset', { key: presetKey }); }
      catch (e) { go('#/site/' + encodeURIComponent(s.id), true); return; }
      E = { site: s, mod: mod, presetKey: presetKey, params: params, dirty: !mod, changed: {} };
    }
    rebuild();
    var p = E.params;
    var title = mod ? (p.name || presetLabel(p.type)) : presetLabel(presetKey);
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(title) + '</h1>' +
      (mod ? '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(t('More')) + '">⋯</button>' : '') + '</header>' +
      '<div class="view3d" id="v3d"><span class="view-hint">' + esc(t('Drag to turn · pinch to zoom · tap a door')) + '</span>' +
      '<div class="view-tools"><button type="button" id="openAll">' + esc(t('Open all')) + '</button><button type="button" id="fitBtn">' + esc(t('Fit')) + '</button></div></div>' +
      '<div class="page" id="editBody"></div>' +
      '<div class="dock"><button type="button" class="btn primary" id="saveMod">' + esc(mod ? t('Save changes') : t('Add to site')) + '</button></div>'
    );
    var host = $('#v3d');
    host.insertBefore(ensureViewer(), host.firstChild);
    if (!has3d) { host.innerHTML = '<div class="view-err">3D view is not available on this device.</div>'; }
    else { P3D.resize(); draw3d(true); }
    $('#back').onclick = function () {
      if (E.dirty && mod && !confirm(t('Discard your changes?'))) { return; }
      E = null; history.back();
    };
    $('#fitBtn').onclick = function () { if (has3d) { P3D.zoomExtents(); } };
    $('#openAll').onclick = function () {
      if (!has3d) { return; }
      var opened = P3D.toggle('all');
      $('#openAll').textContent = t(opened ? 'Close all' : 'Open all');
    };
    if (window.P3D) { P3D.onMotion = function () { var b = $('#openAll'); if (b) { b.textContent = t(P3D.isOpen('all') ? 'Close all' : 'Open all'); } }; }
    $('#saveMod').onclick = saveModule;
    if (mod) {
      $('#moreBtn').onclick = function () {
        menu(title, [
          { label: t('Duplicate'), run: function () { duplicateModule(); } },
          { label: t('Delete module'), danger: true, run: function () {
            if (!confirm(t('Delete this module?'))) { return; }
            s.modules = s.modules.filter(function (x) { return x !== mod; }); touch(s); persist();
            E = null; toast(t('Deleted')); go('#/site/' + encodeURIComponent(s.id), true);
          } }
        ]);
      };
    }
    renderEditBody();
  }

  function rebuild() {
    try {
      var r = Engine.call('build', { params: E.params, lang: lang });
      E.res = r; E.error = null;
      E.params = r.params;
    } catch (e) {
      E.error = e.message; E.res = null;
    }
  }
  var firstDraw = true;
  function draw3d(reset) {
    if (!has3d) { return; }
    var r = E.res || { parts: [], movers: [] };
    P3D.update(r.parts, matInfo, r.movers);
    if (reset || firstDraw) { P3D.reset('iso'); firstDraw = false; }
    var b = $('#openAll');
    if (b) { b.textContent = t('Open all'); b.hidden = !(r.movers && r.movers.length); }
  }
  function changed(reset3d) {
    E.dirty = true;
    rebuild();
    draw3d(reset3d);
    renderEditBody();
  }

  function seg(id, choices, value, extraCls) {
    return '<div class="seg" data-seg="' + id + '">' + choices.map(function (c) {
      return '<button type="button" class="' + (extraCls || '') + '" data-v="' + esc(c[0]) + '" aria-pressed="' + (String(value) === String(c[0])) + '">' + esc(t(c[1])) + '</button>';
    }).join('') + '</div>';
  }

  function renderEditBody() {
    var body = $('#editBody');
    if (!body) { return; }
    var p = E.params;
    var html = '';
    html += '<div class="measure">' + ['width', 'height', 'depth'].map(function (k) {
      return '<button type="button" data-dim="' + k + '" class="' + (E.changed[k] ? 'changed' : '') + '"><span class="lbl">' + esc(t(k[0].toUpperCase() + k.slice(1))) + '</span>' +
        '<span class="num">' + fmt(p[k]) + '</span><span class="unit">mm</span></button>';
    }).join('') + '</div>';

    if (E.error) {
      html += '<div class="warn err"><p><b>' + esc(t('This module cannot be built:')) + '</b></p><p>' + esc(E.error) + '</p></div>';
    } else if (E.res && E.res.warnings && E.res.warnings.length) {
      html += '<div class="warn">' + E.res.warnings.map(function (w) { return '<p>' + esc(w) + '</p>'; }).join('') + '</div>';
    }

    html += '<label class="field"><span>' + esc(t('Name')) + '</span><input class="text-in" id="mName" autocomplete="off" value="' + esc(p.name || '') + '"></label>';

    // fronts per column / row
    html += '<div class="box"><h3>' + esc(t('Fronts')) + '</h3>';
    (p.columns || []).forEach(function (col, ci) {
      if (p.columns.length > 1) { html += '<div class="frow-head" style="margin-top:' + (ci ? 12 : 0) + 'px"><b>' + esc(t('Section')) + ' ' + (ci + 1) + '</b><span class="grow"></span>' + (col.w === 'auto' ? '' : fmt(col.w) + ' mm') + '</div>'; }
      if (col.kind === 'kneehole') { html += '<div class="frow">' + esc(t('Kneehole (open)')) + '</div>'; return; }
      (col.rows || []).forEach(function (row, ri) {
        var door = /door/.test(row.front);
        html += '<div class="frow"><div class="frow-head"><span>' + esc(t('Row')) + ' ' + (ri + 1) + '</span><span class="grow"></span>' +
          '<button type="button" class="hbtn" data-rowh="' + ci + ',' + ri + '">' + (row.h === 'auto' ? esc(t('auto')) : fmt(row.h) + ' mm') + '</button>' +
          (col.rows.length > 1 ? '<button type="button" class="xbtn" data-rowx="' + ci + ',' + ri + '" aria-label="Remove row">✕</button>' : '') + '</div>' +
          seg('front:' + ci + ',' + ri, FRONT_CHOICES, row.front.replace(/^glass_/, '')) +
          (door && row.front !== 'door_pair' && row.front !== 'glass_door_pair' ? '<div style="margin-top:6px">' + seg('hinge:' + ci + ',' + ri, [['L', HINGE_LABEL.L], ['R', HINGE_LABEL.R], ['T', HINGE_LABEL.T], ['B', HINGE_LABEL.B]], row.hinge || 'L') + '</div>' : '') +
          '</div>';
      });
      html += '<button type="button" class="btn small quiet addrow" data-rowadd="' + ci + '">' + esc(t('+ Row')) + '</button>';
    });
    html += '</div>';

    html += '<div class="box"><h3>' + esc(t('Front style')) + '</h3>' + seg('front_style', STYLE_CHOICES, p.front_style) + '</div>';

    html += '<div class="box"><h3>' + esc(t('Toe kick')) + '</h3>' + seg('kick_type', KICK_CHOICES, p.kick_type);
    if (p.kick_type !== 'none') {
      var kh = [[100, '100'], [150, '150']];
      if ([100, 150].indexOf(Number(p.kick_h)) < 0) { kh.push([p.kick_h, fmt(p.kick_h)]); }
      kh.push(['custom', '…']);
      html += '<div class="field" style="margin-bottom:0"><span>' + esc(t('Kick height')) + ' (mm)</span>' + seg('kick_h', kh, Number(p.kick_h), 'num-chip') + '</div>';
    }
    html += '</div>';

    html += '<div class="box"><h3><span class="grow">' + esc(t('Off the floor')) + '</span>' +
      '<button type="button" class="hbtn" id="elevBtn">' + fmt(p.elevation || 0) + ' mm</button></h3></div>';

    if (E.res) { html += '<p class="meta-line">' + E.res.parts.filter(function (x) { return x.cut; }).length + ' ' + esc(t('parts')) + '</p>'; }
    body.innerHTML = html;

    body.querySelectorAll('[data-dim]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-dim');
        openPad({ label: t(k[0].toUpperCase() + k.slice(1)), value: p[k], chips: CHIPS[k], done: function (v) {
          E.params[k] = v; E.changed[k] = true; changed(true);
        } });
      };
    });
    $('#mName').onchange = function () { E.params.name = this.value.trim(); E.dirty = true; };
    body.querySelectorAll('[data-seg]').forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-v]');
        if (!b) { return; }
        var id = g.getAttribute('data-seg'), v = b.getAttribute('data-v');
        var m = /^(front|hinge):(\d+),(\d+)$/.exec(id);
        if (m) {
          var row = E.params.columns[+m[2]].rows[+m[3]];
          if (m[1] === 'front') { row.front = v; } else { row.hinge = v; }
        } else if (id === 'kick_h') {
          if (v === 'custom') {
            openPad({ label: t('Kick height'), value: E.params.kick_h, chips: CHIPS.kick, done: function (x) { E.params.kick_h = x; changed(false); } });
            return;
          }
          E.params.kick_h = Number(v);
        } else {
          E.params[id] = v;
        }
        changed(false);
      });
    });
    body.querySelectorAll('[data-rowh]').forEach(function (b) {
      b.onclick = function () {
        var ix = b.getAttribute('data-rowh').split(',').map(Number), row = E.params.columns[ix[0]].rows[ix[1]];
        openPad({ label: t('Height of this row'), value: row.h, chips: CHIPS.row, auto: true, done: function (v) { row.h = v; changed(false); } });
      };
    });
    body.querySelectorAll('[data-rowx]').forEach(function (b) {
      b.onclick = function () {
        var ix = b.getAttribute('data-rowx').split(',').map(Number);
        E.params.columns[ix[0]].rows.splice(ix[1], 1);
        changed(false);
      };
    });
    body.querySelectorAll('[data-rowadd]').forEach(function (b) {
      b.onclick = function () {
        var col = E.params.columns[+b.getAttribute('data-rowadd')];
        var last = col.rows[col.rows.length - 1];
        col.rows.push({ h: 'auto', front: last ? last.front : 'drawer', hinge: last ? last.hinge : 'L', interior: 'none', shelves: 0 });
        changed(false);
      };
    });
    $('#elevBtn').onclick = function () {
      openPad({ label: t('Off the floor'), value: E.params.elevation || 0, chips: CHIPS.elevation, allowZero: true, done: function (v) { E.params.elevation = v; changed(false); } });
    };
  }

  function saveModule() {
    var s = E.site;
    var nameIn = $('#mName');
    if (nameIn) { E.params.name = nameIn.value.trim(); }
    if (E.mod) {
      E.mod.params = clone(E.params); E.mod.updated = now();
      touch(s); persist(); toast(t('Saved'));
    } else {
      s.modules.push({ id: uid(), order: s.next_order++, created: now(), updated: now(), params: clone(E.params) });
      touch(s); persist(); toast(t('Added to the site'));
    }
    E = null;
    go('#/site/' + encodeURIComponent(s.id), true);
  }
  function duplicateModule() {
    var s = E.site;
    var m = { id: uid(), order: s.next_order++, created: now(), updated: now(), params: clone(E.mod.params) };
    s.modules.push(m); touch(s); persist();
    E = null;
    go('#/site/' + encodeURIComponent(s.id) + '/m/' + encodeURIComponent(m.id), true);
  }

  // ------------------------------------------------------------------ screens: cut list
  function projectData(s) {
    var r = Engine.call('project', { modules: s.modules, codes_state: s.codes_state || null, lang: lang });
    if (JSON.stringify(r.codes_state) !== JSON.stringify(s.codes_state || null)) { s.codes_state = r.codes_state; persist(); }
    return r;
  }
  function renderCut(s) {
    var d;
    try { d = projectData(s); } catch (e) { toast(e.message); go('#/site/' + encodeURIComponent(s.id), true); return; }
    var cut = d.cutlist, byCode = {}, order = [];
    cut.rows.forEach(function (r) {
      if (!byCode[r.code]) { byCode[r.code] = { name: r.module, rows: [] }; order.push(r.code); }
      byCode[r.code].rows.push(r);
    });
    var html = order.map(function (c) {
      var g = byCode[c];
      return '<section class="cut-mod"><h3><span class="code">' + esc(c) + '</span>' + esc(g.name) + '</h3><table class="cut-tab"><tbody>' +
        g.rows.map(function (r) {
          return '<tr><td class="q">' + r.qty + '×</td><td>' + esc(r.part) + (r.eb ? '<span class="edge">' + esc(r.eb) + '</span>' : '') +
            '<span class="mat">' + esc(r.mat) + ' · ' + fmt(r.T) + ' mm' + (r.note ? ' · ' + esc(r.note) : '') + '</span></td>' +
            '<td class="sz">' + fmt(r.L) + ' × ' + fmt(r.W) + '</td></tr>';
        }).join('') + '</tbody></table></section>';
    }).join('');
    var warns = (cut.warnings || []).concat((d.errors || []).map(function (e) { return e.code + ': ' + e.error; }));
    var kick = (d.kick || []).map(function (k) {
      return '<div><span>' + fmt(k.h) + ' mm · ' + k.pieces + ' ' + esc(t('pieces')) + ' · ' + fmt(k.metres) + ' m</span><b>' + k.bars.length + ' ' + esc(t('bars')) + '</b></div>';
    }).join('');
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(t('Cut list')) + '<span class="sub">' + esc(s.name) + '</span></h1></header>' +
      '<div class="page">' +
      (warns.length ? '<div class="warn">' + warns.map(function (w) { return '<p>' + esc(w) + '</p>'; }).join('') + '</div>' : '') +
      html +
      (cut.hardware.length ? '<h2 class="section-h">' + esc(t('Hardware')) + '</h2><div class="box totals">' +
        cut.hardware.map(function (h) { return '<div><span>' + esc(h.item) + '</span><b>' + h.qty + '</b></div>'; }).join('') + '</div>' : '') +
      (kick ? '<h2 class="section-h">' + esc(t('Toe kick bars (4 m)')) + '</h2><div class="box totals">' + kick + '</div>' : '') +
      (cut.banding.length ? '<h2 class="section-h">' + esc(t('Edge banding')) + '</h2><div class="box totals">' +
        cut.banding.map(function (b) { return '<div><span>' + esc(b.mat) + '</span><b>' + fmt(b.m) + ' m</b></div>'; }).join('') + '</div>' : '') +
      (cut.sheets.length ? '<h2 class="section-h">' + esc(t('Sheets (estimate incl. 15% waste)')) + '</h2><div class="box totals">' +
        cut.sheets.map(function (x) { return '<div><span>' + esc(x.mat) + ' · ' + fmt(x.T) + ' mm · ' + esc(x.size) + '</span><b>' + x.sheets + '</b></div>'; }).join('') + '</div>' : '') +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="shareCsv">' + esc(t('Share cut list (CSV)')) + '</button></div>'
    );
    $('#back').onclick = function () { history.back(); };
    $('#shareCsv').onclick = function () {
      shareFile(fileName(s.name) + ' - ' + t('Cut list') + '.csv', '﻿' + d.cutlist.csv, 'text/csv');
    };
  }

  // ------------------------------------------------------------------ files: share / open
  function fileName(s) { return String(s || 'site').replace(/[\\/:*?"<>|]+/g, '-').trim().slice(0, 60) || 'site'; }
  function shareFile(name, text, mime) {
    var blob = new Blob([text], { type: mime });
    var file = null;
    try { file = new File([blob], name, { type: mime }); } catch (e) { file = null; }
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: name }).then(function () { toast(t('Shared')); }, function () {});
      return;
    }
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 4000);
    toast(t('File saved'));
  }
  function shareSite(s) {
    var doc = { format: FILE_FORMAT, format_version: 1, app: 'PanelPro Web ' + VERSION, exported: now(), site: s };
    shareFile(fileName(s.name) + '.panelpro.json', JSON.stringify(doc, null, 1), 'application/json');
  }
  function openFile(file) {
    var r = new FileReader();
    r.onload = function () {
      var doc;
      try { doc = JSON.parse(r.result); } catch (e) { doc = null; }
      if (!doc || doc.format !== FILE_FORMAT || !doc.site || !Array.isArray(doc.site.modules)) { toast(t('This file is not a PanelPro project.')); return; }
      var s = doc.site;
      s.id = s.id || uid();
      s.modules.forEach(function (m, i) { m.id = m.id || uid(); m.order = m.order || i + 1; m.updated = m.updated || now(); });
      s.next_order = Math.max(s.next_order || 1, s.modules.reduce(function (a, m) { return Math.max(a, m.order + 1); }, 1));
      var old = site(s.id);
      if (old) {
        if (!confirm(t('This site is already on the phone. Replace it with the file?'))) { return; }
        sites = sites.filter(function (x) { return x !== old; });
      }
      s.updated = s.updated || now();
      sites.push(s); persist();
      toast(t('Opened') + ': ' + s.name);
      go('#/site/' + encodeURIComponent(s.id));
    };
    r.readAsText(file);
  }

  // ------------------------------------------------------------------ language
  function setLang(l) {
    lang = l === 'es' ? 'es' : 'en';
    if (window.I18N) { window.I18N.lang = lang; }
    save(LANG_KEY, lang);
  }

  // ------------------------------------------------------------------ start
  function boot() {
    setLang(load(LANG_KEY, (navigator.language || 'en').slice(0, 2) === 'es' ? 'es' : 'en'));
    $('#bootMsg').textContent = t('Loading the module engine…');
    $('#bootNote').textContent = t('The first time takes a moment. After that it opens offline.');
    sites = load(STORE, []);
    var th = load('panelpro.web.thumbs', null);
    if (th && th.v === BUILD) { presetThumbs = th.t || {}; }
    wirePad();
    $('#fileIn').onchange = function () { if (this.files[0]) { openFile(this.files[0]); } this.value = ''; };

    Engine.start(function (label, f) { $('#bootBar').style.width = Math.max(4, Math.round(f * 92)) + '%'; }).then(function () {
      $('#bootBar').style.width = '100%';
      info = Engine.call('info');
      info.presets.forEach(function (p) {
        try { var pp = Engine.call('preset', { key: p.key }); p.dims = dimsOf(pp); } catch (e) { p.dims = ''; }
      });
      $('#boot').hidden = true;
      window.addEventListener('hashchange', route);
      route();
    }, function (err) {
      $('#boot').classList.add('error');
      $('#bootMsg').textContent = t('Could not start the module engine.');
      $('#bootNote').textContent = t('Check the connection and open the app again. The first start needs internet; after that it works offline.') + ' (' + (err && err.message || err) + ')';
    });

    if ('serviceWorker' in navigator && location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').then(function (reg) {
        reg.addEventListener('updatefound', function () {
          var w = reg.installing;
          if (!w) { return; }
          w.addEventListener('statechange', function () {
            if (w.state === 'installed' && navigator.serviceWorker.controller) {
              toast(t('New version ready'), { label: t('Reload'), run: function () { location.reload(); } });
            }
          });
        });
      }).catch(function () {});
    }
  }

  window.PanelProWeb = { calc: calc, version: VERSION };
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})();
