/* PanelPro Web — field app screens (phone first, works offline).
 *
 * Sites (projects) → modules. A module is the plugin's own params object; every size, panel
 * and cut-list row comes from the shared engine (window.Engine → the plugin's core/*.rb).
 * This file is interface only: no module rules live here.
 */
(function () {
  'use strict';

  var VERSION = '0.3.25';
  var BUILD = '19d643b976';
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
    'Open all': 'Abrir todo', 'Sizes': 'Medidas',
    'View': 'Ver', 'Show doors': 'Mostrar puertas', 'Show drawer fronts': 'Mostrar frentes de gaveta', 'Show drawer boxes': 'Mostrar cajas de gaveta',
    'Mirror (left ↔ right)': 'Reflejar (izquierda ↔ derecha)', 'Mirrored': 'Reflejado', 'Save as my preset…': 'Guardar como mi preset…',
    'Update my preset “': 'Actualizar mi preset «', 'Preset updated': 'Preset actualizado', 'Apply a finish set…': 'Aplicar un juego de acabados…',
    'Save these materials as a finish set…': 'Guardar estos materiales como juego de acabados…', 'Preset name': 'Nombre del preset',
    'Saved as my preset: ': 'Guardado como mi preset: ', 'Units': 'Unidades', 'Delete this preset?': '¿Eliminar este preset?',
    'Imported presets: ': 'Presets importados: ', 'Print / save PDF': 'Imprimir / guardar PDF', 'Composition': 'Composición',
    'This file is not a PanelPro presets file.': 'Este archivo no es un archivo de presets de PanelPro.',
    'Files for the supplier (cut list, PDF, Excel) are always in mm.': 'Los archivos para el proveedor (lista de corte, PDF, Excel) siempre van en mm.',
    'Save a module as a preset from its ⋯ menu. The file is the same as the plugin’s, so presets move between both.': 'Guarde un módulo como preset desde su menú ⋯. El archivo es el mismo del plugin, así que los presets pasan de uno a otro.',
    'Save a module’s materials as a finish set from its ⋯ menu, then apply it to other modules.': 'Guarde los materiales de un módulo como juego de acabados desde su menú ⋯ y aplíquelo a otros módulos.',
    'Names used in the cut list and its files. Leave a box empty for the default.': 'Nombres usados en la lista de corte y sus archivos. Deje la casilla vacía para el nombre por defecto.',
    'Laying the panels out on sheets the way a beam saw cuts them. This can take a little while on a phone.': 'Acomodando las piezas en tableros como las corta una seccionadora. En el teléfono puede tardar un poco.',
    'Drag modules to arrange them: they snap to the floor, side by side and on top of each other. Tap one to type its position.': 'Arrastre los módulos para acomodarlos: se ajustan al piso, uno al lado del otro y uno encima del otro. Toque uno para escribir su posición.',
    'Add modules to the site first.': 'Primero agregue módulos a la obra.', 'From the left': 'Desde la izquierda', 'Edit module': 'Editar módulo',
    'Put on the floor': 'Poner en el piso', 'Flat (over a module)': 'Acostado (sobre un módulo)', 'On edge (beside a module)': 'De canto (al costado de un módulo)', 'Upright (front / gap)': 'De pie (frente / hueco)', 'Arrange again side by side': 'Acomodar de nuevo uno al lado del otro', 'Front view': 'Vista frontal', 'Column': 'Columna', 'Empty': 'Vacío',
    'Columns run left → right, rows top → bottom. Leave auto to share what’s left.': 'Las columnas van de izquierda a derecha y las filas de arriba abajo. Deje auto para repartir lo que queda.', 'Close all': 'Cerrar todo', 'Fit': 'Ajustar', 'Drag to turn · pinch to zoom · tap a door': 'Arrastre para girar · pellizque para zoom · toque una puerta',
    'Drag to turn · scroll to zoom · click a door': 'Arrastre para girar · rueda para zoom · clic en una puerta',
    'Set': 'Fijar', 'Enter a size': 'Escriba una medida', 'Not a valid calculation': 'Cálculo no válido',
    'Share PDF': 'Compartir PDF', 'Share Excel': 'Compartir Excel', 'File saved to Downloads: ': 'Archivo guardado en Descargas: ', 'Could not save the file: ': 'No se pudo guardar el archivo: ', 'File ready': 'Archivo listo', 'Share': 'Compartir',
    'Summary': 'Resumen', 'Sheet size': 'Tamaño de tablero', 'Sheets': 'Tableros', 'Warnings': 'Avisos', 'Bar': 'Barra',
    'offcut': 'sobrante', 'cont.': 'cont.', 'Edge': 'Canto', 'L × W mm': 'Largo × Ancho mm', 'Hardware': 'Herrajes', 'Edge banding': 'Canto',
    'Sheets (estimate incl. 15% waste)': 'Tableros (estimado con 15% de desperdicio)', 'Toe kick bars (4 m)': 'Barras de zócalo (4 m)',
    'bars': 'barras', 'bar': 'barra', 'pieces': 'piezas', 'Saved': 'Guardado', 'Added to the site': 'Agregado a la obra',
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
  function dimsShown() { return load('panelpro.web.dims', true) !== false; }
  function finePointer() { return !!(window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  function fmt(v) {
    var n = Number(v);
    if (!isFinite(n)) { return String(v); }
    return String(Math.round(n * 10) / 10);
  }
  // Lengths on screen follow Settings › Units (mm or cm); everything stored stays in mm.
  function uk() { return prefs.units === 'cm' ? 10 : 1; }
  function U() { return prefs.units === 'cm' ? 'cm' : 'mm'; }
  function L(mm) { return fmt(Number(mm) / uk()); }
  function LU(mm) { return L(mm) + ' ' + U(); }
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

  // ------------------------------------------------------------------ preferences (kept on this phone)
  var PREFS_KEY = 'panelpro.web.prefs.v1';
  var prefs = {};
  function loadPrefs() {
    prefs = load(PREFS_KEY, {}) || {};
    prefs.units = prefs.units === 'cm' ? 'cm' : 'mm';
    prefs.names = prefs.names || {};
    prefs.opt = Object.assign({ kerf: 4.4, trim: 10, sheet_l: 2440, sheet_w: 1220, tape_extra: 10, tape_price: 0, currency: 'RD$', prices: {}, rotate: {} }, prefs.opt || {});
    prefs.book = prefs.book || {};        // my presets (same format as the plugin's presets file)
    prefs.finishes = prefs.finishes || {}; // finish sets: name → materials
  }
  function savePrefs() { if (!save(PREFS_KEY, prefs)) { toast(t('Could not save the site on this phone.')); } }

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
  function dimsOf(p) { return L(p.width) + ' × ' + L(p.height) + ' × ' + L(p.depth) + ' ' + U(); }
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
    pad.unit = opts.unit || U();                       // '°', '%', '' (count) or the length unit
    pad.k = opts.unit ? 1 : uk();                      // typed value × k = mm
    pad.expr = opts.value == null || opts.value === 'auto' ? '' : fmt(Number(opts.value) / pad.k);
    pad.fresh = true;
    pad.allowZero = !!opts.allowZero;
    $('#padLabel').textContent = opts.label;
    $('#padChips').innerHTML = (opts.chips || []).map(function (c) {
      var cv = fmt(c / pad.k);
      return '<button type="button" data-chip="' + cv + '">' + cv + '</button>';
    }).join('');
    $('#pad .pad-auto').hidden = !opts.auto;
    $('#pad .pad-auto').textContent = t('Auto');
    $('#pad .pad-set').textContent = t('Set');
    $('#pad .pad-unit').textContent = pad.unit;
    $('#pad').hidden = false;
    padShow();
  }
  function padShow() {
    $('#padExpr').textContent = pad.expr || '0';
    var v = calc(pad.expr), r = $('#padResult');
    var isCalc = /[-+*/]/.test(pad.expr.replace(/^-/, ''));
    r.classList.toggle('bad', pad.expr !== '' && isNaN(v));
    r.textContent = pad.expr === '' ? '' : isNaN(v) ? t('Not a valid calculation') : isCalc ? '= ' + fmt(v) + ' ' + pad.unit : '';
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
        var cb = pad.cb; closePad(); if (cb) { cb(Math.round(v * pad.k * 1000) / 1000); }
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
      if (p[2] === 'opt') { return renderOpt(s, false); }
      if (p[2] === 'compose') { return window.PPCompose.render(s); }
      return renderSite(s);
    }
    if (p[0] === 'newsite') { return renderNewSite(); }
    if (p[0] === 'settings') { return renderSettings(); }
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
      '<div class="page page-wide">' +
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
      menu(null, [
        { label: t('Open a project file'), run: function () { pickFile(null); } },
        { label: t('Settings'), run: function () { go('#/settings'); } }
      ]);
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
      '<div class="page page-wide">' +
      (s.notes ? '<p class="meta-line">' + esc(s.notes) + '</p>' : '') +
      (mods.length ? '<div class="list">' + mods.map(function (m) {
        return '<button type="button" class="row-card" data-mod="' + esc(m.id) + '">' +
          '<span class="code">' + esc(codes[m.id] || '?') + '</span>' +
          '<img class="thumb" alt="" data-thumb="' + esc(m.id) + '">' +
          '<span class="grow"><span class="t1">' + esc(m.params.name || presetLabel(m.params.type)) + '</span>' +
          '<span class="t2 dims">' + dimsOf(m.params) + '</span></span></button>';
      }).join('') + '</div>' +
      '<div class="actions-row" style="margin-top:16px"><button type="button" class="btn" id="compBtn">' + esc(t('Composition')) + '</button>' +
      '<button type="button" class="btn" id="cutBtn">' + esc(t('Cut list')) + '</button></div>' +
      '<div class="actions-row">' +
      '<button type="button" class="btn" id="shareBtn">' + esc(t('Share project file')) + '</button></div>'
        : '<div class="empty"><h2>' + esc(t('No modules yet')) + '</h2><p>' + esc(t('Add the first module for this site.')) + '</p></div>') +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="addMod">' + esc(t('Add module')) + '</button></div>'
    );
    $('#back').onclick = function () { go('#/'); };
    $('#addMod').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/pick'); };
    if ($('#cutBtn')) { $('#cutBtn').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/cut'); }; }
    if ($('#compBtn')) { $('#compBtn').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/compose'); }; }
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
    var mine = Engine.call('presets_list', { book: prefs.book });
    function card(key, nm, dims) {
      return '<button type="button" class="mcard" data-key="' + esc(key) + '"><img class="pic wait" alt="" data-pk="' + esc(key) + '">' +
        '<span class="nm">' + esc(nm) + '</span><span class="sz">' + esc(dims || '') + '</span></button>';
    }
    var html = '';
    if (mine.length) {
      var mc = [];
      mine.forEach(function (p) { if (mc.indexOf(p.category) < 0) { mc.push(p.category); } });
      mc.forEach(function (c) {
        html += '<h2 class="section-h">' + esc(t('My presets') + ' — ' + t(c)) + '</h2><div class="cards">' + mine.filter(function (p) { return p.category === c; }).map(function (p) {
          var pp = prefs.book[p.key] || {};
          return card('user:' + p.key, p.label, pp.width ? dimsOf(pp) : '');
        }).join('') + '</div>';
      });
    }
    html += cats.map(function (c) {
      return '<h2 class="section-h">' + esc(t(c)) + '</h2><div class="cards">' + info.presets.filter(function (p) { return p.category === c; }).map(function (p) {
        var full = t(p.label), nm = full.indexOf(' — ') > 0 ? full.split(' — ').slice(1).join(' — ') : full;
        return card(p.key, nm, p.pp ? dimsOf(p.pp) : '');
      }).join('') + '</div>';
    }).join('');
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(t('Pick a module')) + '</h1></header>' +
      '<div class="page page-wide">' + html + '</div>'
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
      var url = snapshot(Engine.call('build', { params: presetParams(key) }), 320, 240);
      if (url) {
        presetThumbs[key] = url;
        if (!/^user:/.test(key)) { save('panelpro.web.thumbs', { v: BUILD, t: presetThumbs }); }
      }
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

  // Preview options (remembered): 2D front view or 3D, and which moving parts are shown.
  var view = load('panelpro.web.view', { mode: '3d', vis: { doors: true, dfronts: true, dboxes: true } });
  function saveView() { save('panelpro.web.view', view); }
  function presetParams(key) {
    if (/^user:/.test(key)) { return Engine.call('preset_params', { book: prefs.book, key: key.slice(5) }); }
    return Engine.call('preset', { key: key });
  }
  function presetTitle(key) {
    if (/^user:/.test(key)) { var b = prefs.book[key.slice(5)]; return b ? b.name : ''; }
    return presetLabel(key);
  }

  function renderEdit(s, mod, presetKey) {
    if (!E || E.site !== s || E.mod !== mod || (!mod && E.presetKey !== presetKey)) {
      var params;
      try { params = mod ? Engine.call('normalize', { params: mod.params }) : presetParams(presetKey); }
      catch (e) { go('#/site/' + encodeURIComponent(s.id), true); return; }
      E = { site: s, mod: mod, presetKey: mod ? mod.preset || null : presetKey, params: params, dirty: !mod, changed: {} };
    }
    rebuild();
    var p = E.params;
    var title = mod ? (p.name || presetLabel(p.type)) : presetTitle(presetKey);
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(title) + '</h1>' +
      '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(t('More')) + '">⋯</button></header>' +
      '<div class="edit-layout">' +
      '<div class="view3d" id="v3d"><svg class="elev" id="elev" preserveAspectRatio="xMidYMid meet"></svg>' +
      '<span class="view-hint" id="viewHint"></span>' +
      '<div class="view-tools"><button type="button" id="dimBtn">' + (view.mode === '3d' ? '2D' : '3D') + '</button>' +
      '<button type="button" id="dimsBtn" aria-pressed="' + dimsShown() + '">' + esc(t('Sizes')) + '</button>' +
      '<button type="button" id="viewBtn" aria-label="' + esc(t('View')) + '">' + esc(t('View')) + ' ▾</button>' +
      '<button type="button" id="openAll">' + esc(t('Open all')) + '</button><button type="button" id="fitBtn">' + esc(t('Fit')) + '</button></div></div>' +
      '<div class="edit-side"><div class="page" id="editBody"></div>' +
      '<div class="dock"><button type="button" class="btn primary" id="saveMod">' + esc(mod ? t('Save changes') : t('Add to site')) + '</button></div></div>' +
      '</div>'
    );
    var host = $('#v3d');
    host.insertBefore(ensureViewer(), host.firstChild);
    if (!has3d) { view.mode = '2d'; }
    else { P3D.setDims(dimsShown()); P3D.resize(); }
    setViewMode(view.mode, true);
    $('#back').onclick = function () {
      if (E.dirty && mod && !confirm(t('Discard your changes?'))) { return; }
      E = null; history.back();
    };
    $('#dimBtn').onclick = function () { setViewMode(view.mode === '3d' ? '2d' : '3d'); };
    $('#fitBtn').onclick = function () { if (has3d && view.mode === '3d') { P3D.zoomExtents(); } };
    $('#dimsBtn').onclick = function () {
      var on = !dimsShown();
      save('panelpro.web.dims', on);
      this.setAttribute('aria-pressed', String(on));
      if (has3d) { P3D.setDims(on); P3D.zoomExtents(); }
    };
    $('#viewBtn').onclick = function () {
      var r = E.res || { movers: [] }, n = { door: 0, drawer: 0 };
      (r.movers || []).forEach(function (m) { n[m.kind] = (n[m.kind] || 0) + 1; });
      var mark = function (on) { return on ? '✓ ' : '  '; };
      var items = [
        { label: mark(view.vis.doors) + t('Show doors'), run: function () { view.vis.doors = !view.vis.doors; saveView(); draw3d(false); } },
        { label: mark(view.vis.dfronts) + t('Show drawer fronts'), run: function () { view.vis.dfronts = !view.vis.dfronts; saveView(); draw3d(false); } },
        { label: mark(view.vis.dboxes) + t('Show drawer boxes'), run: function () { view.vis.dboxes = !view.vis.dboxes; saveView(); draw3d(false); } }
      ];
      if (has3d && view.mode === '3d') {
        if (n.door) { items.push({ label: t(P3D.isOpen('door') ? 'Close doors' : 'Open doors'), run: function () { P3D.toggle('door'); } }); }
        if (n.drawer) { items.push({ label: t(P3D.isOpen('drawer') ? 'Close drawers' : 'Open drawers'), run: function () { P3D.toggle('drawer'); } }); }
      }
      menu(t('View'), items);
    };
    $('#openAll').onclick = function () {
      if (!has3d || view.mode !== '3d') { return; }
      var opened = P3D.toggle('all');
      $('#openAll').textContent = t(opened ? 'Close all' : 'Open all');
    };
    if (window.P3D) { P3D.onMotion = function () { var b = $('#openAll'); if (b) { b.textContent = t(P3D.isOpen('all') ? 'Close all' : 'Open all'); } }; }
    $('#saveMod').onclick = saveModule;
    $('#moreBtn').onclick = function () { editMenu(s, mod, title); };
    renderEditBody();
  }

  function editMenu(s, mod, title) {
    var items = [
      { label: t('Mirror (left ↔ right)'), run: function () {
        try { E.params = Engine.call('mirror', { params: E.params }); changed(false); toast(t('Mirrored')); } catch (e) { toast(e.message); }
      } },
      { label: t('Save as my preset…'), run: function () { savePresetFlow(); } }
    ];
    if (E.presetKey && /^user:/.test(E.presetKey) && prefs.book[E.presetKey.slice(5)]) {
      items.push({ label: t('Update my preset “') + prefs.book[E.presetKey.slice(5)].name + '”', run: function () {
        var r = Engine.call('presets_update', { book: prefs.book, key: E.presetKey.slice(5), params: E.params });
        prefs.book = r.book; savePrefs(); presetThumbs['user:' + E.presetKey.slice(5)] = null; toast(t('Preset updated'));
      } });
    }
    var fins = Object.keys(prefs.finishes).sort();
    if (fins.length) {
      items.push({ label: t('Apply a finish set…'), run: function () {
        menu(t('Finish sets'), fins.map(function (name) {
          return { label: name, run: function () { Object.assign(E.params, prefs.finishes[name]); changed(false); toast(t('Finish set applied: ') + name); } };
        }));
      } });
    }
    items.push({ label: t('Save these materials as a finish set…'), run: function () {
      var name = (prompt(t('Name for these materials, e.g. Kitchen A')) || '').trim();
      if (!name) { return; }
      prefs.finishes[name] = Engine.call('finish', { params: E.params }); savePrefs(); toast(t('Saved'));
    } });
    if (mod) {
      items.push({ label: t('Duplicate'), run: function () { duplicateModule(); } });
      items.push({ label: t('Delete module'), danger: true, run: function () {
        if (!confirm(t('Delete this module?'))) { return; }
        s.modules = s.modules.filter(function (x) { return x !== mod; }); touch(s); persist();
        E = null; toast(t('Deleted')); go('#/site/' + encodeURIComponent(s.id), true);
      } });
    }
    menu(title, items);
  }

  var CATS = ['Kitchen', 'Closet', 'Bath', 'Furniture', 'Other'];
  function savePresetFlow() {
    var name = (prompt(t('Preset name'), E.params.name || '') || '').trim();
    if (!name) { return; }
    menu(t('Category'), CATS.map(function (c) {
      return { label: t(c), run: function () {
        var r = Engine.call('presets_save', { book: prefs.book, name: name, category: c, params: E.params });
        prefs.book = r.book; savePrefs(); E.presetKey = 'user:' + r.key; presetThumbs['user:' + r.key] = null;
        toast(t('Saved as my preset: ') + name);
      } };
    }));
  }

  function setViewMode(mode, quiet) {
    view.mode = has3d ? mode : '2d'; saveView();
    var host = $('#v3d');
    if (!host) { return; }
    host.classList.toggle('is2d', view.mode === '2d');
    $('#dimBtn').textContent = view.mode === '3d' ? '2D' : '3D';
    $('#dimBtn').hidden = !has3d;
    $('#viewHint').textContent = view.mode === '2d' ? t('Front view') : t(finePointer() ? 'Drag to turn · scroll to zoom · click a door' : 'Drag to turn · pinch to zoom · tap a door');
    if (view.mode === '3d') { P3D.resize(); }
    draw3d(!quiet || true);
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
  function shownParts(r) {
    var kinds = {};
    (r.movers || []).forEach(function (m) { kinds[m.id] = m.kind; });
    return (r.parts || []).filter(function (p) { var g = window.PPReports.visGroup(p, kinds); return !g || view.vis[g]; });
  }
  function draw3d(reset) {
    var r = E.res || { parts: [], movers: [] };
    var parts = shownParts(r);
    var b = $('#openAll');
    if (b) { b.textContent = t('Open all'); b.hidden = view.mode !== '3d' || !(r.movers && r.movers.length); }
    if (view.mode === '2d' || !has3d) {
      var e = window.PPReports.elevation(parts.length ? parts : [{ shape: 'prism', axis: 'y', pos: 0, thk: 1, pts: [[0, 0], [1, 0], [1, 1], [0, 1]], role: 'carcass' }]);
      var svg = $('#elev');
      if (svg) { svg.setAttribute('viewBox', e.viewBox); svg.innerHTML = e.html; }
      return;
    }
    P3D.setSoft(E.params ? E.params.soft_close : true);
    P3D.update(parts, matInfo, r.movers);
    if (reset || firstDraw) { P3D.reset('iso'); firstDraw = false; }
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

  // ---- full editor: the plugin's Configurator settings (ui/fields.js, shared), drawn for touch
  // A tab lists whole sections of ui/fields.js, or a slice of one: { sec, from, until } (group titles).
  var DECO_TITLE = 'Decorative panels', ENDS_TITLE = 'Visible end panels', CUT_TITLE = 'Cut list';
  var TABS = [['layout', 'Layout', ['layout']], ['module', 'Module', ['module']],
              ['box', 'Box', [{ sec: 'box', until: DECO_TITLE }]],
              ['panels', 'Decorative panels', [{ sec: 'box', from: DECO_TITLE }, { sec: 'materials', from: ENDS_TITLE, until: CUT_TITLE }]],
              ['base', 'Base', ['base']],
              ['fronts', 'Fronts', ['fronts', 'frame', 'pulls', 'motion']], ['drawers', 'Drawers', ['drawers']],
              ['materials', 'Materials', [{ sec: 'materials', until: ENDS_TITLE }, { sec: 'materials', from: CUT_TITLE }]]];
  function sectionDefs(spec) {
    if (typeof spec === 'string') { return F().SECTIONS[spec] || []; }
    var list = F().SECTIONS[spec.sec] || [], out = [], on = !spec.from;
    list.forEach(function (d) {
      if (d[0] === '#' && d[1] === spec.from) { on = true; }
      if (d[0] === '#' && d[1] === spec.until) { on = false; }
      if (on) { out.push(d); }
    });
    return out;
  }
  var SKIP = { width: 1, height: 1, depth: 1 };                 // in the measurement bar above
  var WEB_LABEL = { elevation: 'Off the floor' };               // plugin wording that means something else here
  var SAME_MAT = ['mat_back', 'mat_front', 'mat_frame', 'mat_drawer', 'mat_top', 'mat_kick', 'mat_skin', 'mat_end'];
  var HINGE_CH = [['L', 'Hinge left'], ['R', 'Hinge right'], ['T', 'Lift up'], ['B', 'Drop down']];
  var INTERIOR_CH = [['none', 'Empty'], ['shelves', 'Shelves'], ['hang', 'Hang rail']];
  var editTab = load('panelpro.web.tab', 'layout');

  function F() { return window.PPFields; }
  function rctx() {
    return { t: t, show: L, units: U(), es: lang === 'es', settings: { opt: prefs.opt }, bbox: E && E.res ? E.res.bbox : null };
  }
  function lenText(v, type) {
    if (v === 'auto' || v == null) { return t('auto'); }
    return type === 'deg' ? fmt(v) + '°' : type === 'pct' ? fmt(v) + ' %' : LU(v);
  }
  function fieldHtml(d, p) {
    var key = d[0], label = t(WEB_LABEL[key] || d[1]), type = d[2];
    var c = F().cond(type === 'sel' ? d[4] : d[3]);
    if (key === '#') { return F().cond(d[2])(p) ? '<h3 class="grp">' + esc(label) + '</h3>' : ''; }
    if (SKIP[key] || !c(p) || (p.panel && key === 'inner_w')) { return ''; }
    if (type === 'info') {
      var ik = window.PPReports.INFO_KEYS[key], txt = ik ? window.PPReports.info[ik](p, rctx()) : '';
      return txt ? '<p class="readout">' + esc(txt) + '</p>' : '';
    }
    if (type === 'btn') { return '<button type="button" class="btn small fbtn" data-btn="' + key + '">' + esc(label) + '</button>'; }
    var ctl;
    if (type === 'len' || type === 'deg' || type === 'pct') {
      var v = key === 'inner_w' ? p.width - F().innerExtra(p) : p[key];
      ctl = '<button type="button" class="valbtn" data-len="' + key + '" data-type="' + type + '">' + esc(lenText(v, type)) + '</button>';
    } else if (type === 'bool') {
      ctl = '<label class="switch"><input type="checkbox" data-bool="' + key + '"' + (p[key] ? ' checked' : '') + '><span></span></label>';
    } else if (type === 'sel') {
      var opts = d[3];
      if (key === 'bx_height') {
        var hs = (F().BOXSYS[p.bx_brand] || F().BOXSYS.merivobox).heights;
        opts = opts.filter(function (o) { return hs[o[0]]; });
      }
      ctl = '<select class="sel" data-sel="' + key + '">' + opts.map(function (o) {
        return '<option value="' + esc(o[0]) + '"' + (String(p[key]) === o[0] ? ' selected' : '') + '>' + esc(t(o[1])) + '</option>';
      }).join('') + '</select>';
      return '<div class="frow-f stack"><span class="flbl">' + esc(label) + '</span>' + ctl + '</div>';
    } else if (type === 'mat') {
      var same = SAME_MAT.indexOf(key) >= 0 ? p[key + '_same'] !== false : false;
      ctl = '<input class="text-in" data-text="' + key + '" value="' + esc(p[key] || '') + '"' + (same ? ' disabled' : '') + '>' +
        (SAME_MAT.indexOf(key) >= 0 ? '<label class="chk"><input type="checkbox" data-same="' + key + '"' + (same ? ' checked' : '') + '> ' +
          esc(t(key === 'mat_end' ? 'Same as fronts' : 'Same as carcass')) + '</label>' : '');
      return '<div class="frow-f stack"><span class="flbl"><i class="swatch" style="background:' + esc((matInfo(p[key]) || {}).color || '#ddd') + '"></i>' + esc(label) + '</span>' + ctl + '</div>';
    } else {
      ctl = '<input class="text-in" data-text="' + key + '" value="' + esc(p[key] == null ? '' : p[key]) + '" autocomplete="off">';
      return '<div class="frow-f stack"><span class="flbl">' + esc(label) + '</span>' + ctl + '</div>';
    }
    var picks = '';
    if (F().PICKS[key]) {
      var mk = F().MODE_KEYS[key], active = mk && F().tMult(p[mk]) ? p[mk] : null;
      picks = '<div class="seg picks">' + F().PICKS[key].map(function (x) {
        var on = active ? String(x) === active : (typeof x === 'number' && Math.abs(x - p[key]) < 0.01);
        return '<button type="button" class="num-chip" data-pick="' + key + '" data-v="' + x + '" aria-pressed="' + on + '">' + esc(x === 0 ? t('Flush') : String(x)) + '</button>';
      }).join('') + '</div>';
    }
    return '<div class="frow-f"><span class="flbl">' + esc(label) + '</span>' + ctl + '</div>' + picks;
  }

  function layoutHtml(p) {
    var lay = (E.res && E.res.layout) || [];
    var h = '';
    (p.columns || []).forEach(function (col, ci) {
      var LY = lay[ci] || {};
      h += '<div class="box colbox"><div class="col-head"><b>' + esc(t('Column')) + ' ' + (ci + 1) + '</b>' +
        '<button type="button" class="hbtn" data-colw="' + ci + '">' + esc(col.w === 'auto' ? t('auto') + (LY.w ? ' = ' + L(LY.w) : '') : LU(col.w)) + '</button>' +
        '<span class="grow"></span>' +
        (p.columns.length > 1 ? '<button type="button" class="xbtn" data-colmv="' + ci + ',-1" aria-label="Move left">←</button><button type="button" class="xbtn" data-colmv="' + ci + ',1" aria-label="Move right">→</button>' +
          '<button type="button" class="xbtn" data-colx="' + ci + '" aria-label="Remove column">✕</button>' : '') + '</div>' +
        '<div class="seg" style="margin:6px 0 4px">' + [['normal', 'Cabinet section'], ['kneehole', 'Kneehole (open, no box)']].map(function (o) {
          return '<button type="button" data-colkind="' + ci + '" data-v="' + o[0] + '" aria-pressed="' + (col.kind === o[0]) + '">' + esc(t(o[1])) + '</button>';
        }).join('') + '</div>';
      if (col.kind === 'kneehole') { h += '<p class="meta-line">' + esc(t('Open kneehole — no bottom, back or fronts; adjacent partitions become pedestal sides.')) + '</p></div>'; return; }
      (col.rows || []).forEach(function (row, ri) {
        var front = row.front.replace(/^glass_/, ''), door = front === 'door', drawer = front === 'drawer';
        var rh = (LY.rows || [])[ri];
        h += '<div class="frow"><div class="frow-head"><span>' + esc(t('Row')) + ' ' + (ri + 1) + '</span><span class="grow"></span>' +
          '<button type="button" class="hbtn" data-rowh="' + ci + ',' + ri + '">' + esc(row.h === 'auto' ? t('auto') + (rh ? ' = ' + L(rh) : '') : LU(row.h)) + '</button>' +
          (col.rows.length > 1 ? '<button type="button" class="xbtn" data-rowx="' + ci + ',' + ri + '" aria-label="Remove row">✕</button>' : '') + '</div>' +
          seg('front:' + ci + ',' + ri, FRONT_CHOICES, front) +
          (door ? '<div class="sub-seg">' + seg('hinge:' + ci + ',' + ri, HINGE_CH, row.hinge || 'L') + '</div>' : '') +
          (!drawer ? '<div class="sub-seg">' + seg('interior:' + ci + ',' + ri, INTERIOR_CH, row.interior || 'none') + '</div>' : '') +
          (!drawer && row.interior === 'shelves' ? '<div class="stepper"><span>' + esc(t('Shelves')) + '</span>' +
            '<button type="button" data-shelf="' + ci + ',' + ri + ',-1" aria-label="Fewer shelves">−</button><b>' + (row.shelves || 0) + '</b>' +
            '<button type="button" data-shelf="' + ci + ',' + ri + ',1" aria-label="More shelves">+</button></div>' : '') +
          '</div>';
      });
      h += '<button type="button" class="btn small quiet addrow" data-rowadd="' + ci + '">' + esc(t('+ Row')) + '</button></div>';
    });
    h += '<button type="button" class="btn small addcol" id="addCol">' + esc(t('+ Add column')) + '</button>';
    h += '<p class="meta-line">' + esc(t('Columns run left → right, rows top → bottom. Leave auto to share what’s left.')) + '</p>';
    return h;
  }

  function renderEditBody() {
    var body = $('#editBody');
    if (!body) { return; }
    var p = E.params;
    var scrollY = body.scrollTop;
    var html = '<div class="measure">' + ['width', 'height', 'depth'].map(function (k) {
      return '<button type="button" data-dim="' + k + '" class="' + (E.changed[k] ? 'changed' : '') + '"><span class="lbl">' + esc(t(k[0].toUpperCase() + k.slice(1))) + '</span>' +
        '<span class="num">' + L(p[k]) + '</span><span class="unit">' + U() + '</span></button>';
    }).join('') + '</div>';
    if (E.error) {
      html += '<div class="warn err"><p><b>' + esc(t('This module cannot be built:')) + '</b></p><p>' + esc(E.error) + '</p></div>';
    } else if (E.res && E.res.warnings && E.res.warnings.length) {
      html += '<div class="warn">' + E.res.warnings.map(function (w) { return '<p>' + esc(w) + '</p>'; }).join('') + '</div>';
    }
    // a loose panel has no box, fronts or drawers: only its own settings and materials
    var tabs = p.panel ? TABS.filter(function (x) { return x[0] === 'module' || x[0] === 'materials'; }) : TABS;
    var tab = tabs.find(function (x) { return x[0] === editTab; }) || tabs[0];
    html += '<nav class="etabs" role="tablist">' + tabs.map(function (tb) {
      return '<button type="button" role="tab" data-tab="' + tb[0] + '" aria-selected="' + (tab[0] === tb[0]) + '">' + esc(t(tb[1])) + '</button>';
    }).join('') + '</nav>';
    html += '<div class="tabbody">';
    if (tab[0] === 'layout') { html += layoutHtml(p); }
    var fields = '';
    tab[2].forEach(function (sec) { sectionDefs(sec).forEach(function (d) { fields += fieldHtml(d, p); }); });
    if (fields) { html += '<div class="box fields">' + fields + '</div>'; }
    html += '</div>';
    if (E.res) { html += '<p class="meta-line">' + E.res.parts.filter(function (x) { return x.cut; }).length + ' ' + esc(t('parts')) + '</p>'; }
    body.innerHTML = html;
    body.scrollTop = scrollY;
    wireEditBody(body);
  }

  function setP(key, v) {
    var p = E.params;
    if (key === 'inner_w') { p.width = Math.round((v + F().innerExtra(p)) * 1000) / 1000; E.changed.width = true; return; }
    if (F().MODE_KEYS[key]) { p[F().MODE_KEYS[key]] = 'custom'; }
    p[key] = v;
  }

  function wireEditBody(body) {
    var p = E.params;
    body.onclick = function (e) {
      var b = e.target.closest('button');
      if (!b || !body.contains(b)) { return; }
      var a;
      if ((a = b.getAttribute('data-tab'))) { editTab = a; save('panelpro.web.tab', a); renderEditBody(); $('#editBody').scrollTop = 0; return; }
      if ((a = b.getAttribute('data-dim'))) {
        openPad({ label: t(a[0].toUpperCase() + a.slice(1)), value: p[a], chips: CHIPS[a], done: function (v) { E.params[a] = v; E.changed[a] = true; changed(true); } });
        return;
      }
      if ((a = b.getAttribute('data-len'))) {
        var type = b.getAttribute('data-type'), d = null;
        Object.keys(F().SECTIONS).forEach(function (s) { F().SECTIONS[s].forEach(function (x) { if (x[0] === a) { d = x; } }); });
        var cur = a === 'inner_w' ? p.width - F().innerExtra(p) : p[a];
        openPad({ label: t(WEB_LABEL[a] || (d ? d[1] : a)), value: cur, allowZero: true, unit: type === 'deg' ? '°' : type === 'pct' ? '%' : undefined,
                  chips: (F().PICKS[a] || []).filter(function (x) { return typeof x === 'number'; }),
                  done: function (v) { setP(a, v); changed(a === 'inner_w'); } });
        return;
      }
      if ((a = b.getAttribute('data-pick'))) {
        var x = b.getAttribute('data-v'), mk = F().MODE_KEYS[a];
        if (F().tMult(x)) { p[mk] = x; p[a] = p.t * F().tMult(x); } else { if (mk) { p[mk] = 'custom'; } p[a] = Number(x); }
        changed(false); return;
      }
      if ((a = b.getAttribute('data-btn')) === 'fridge_fit') {
        try { E.params = Engine.call('fridge_fit', { params: p }); toast(t('Module sized to the fridge: ') + dimsOf(E.params) + ' mm'); } catch (err) { toast(err.message); }
        E.changed.width = E.changed.height = E.changed.depth = true; changed(true); return;
      }
      if ((a = b.getAttribute('data-colw'))) {
        var col = p.columns[+a];
        openPad({ label: t('Clear interior width'), value: col.w, auto: true, done: function (v) { col.w = v; changed(false); } });
        return;
      }
      if ((a = b.getAttribute('data-colkind'))) {
        var ck = p.columns[+a]; ck.kind = b.getAttribute('data-v');
        if (ck.kind === 'normal' && (!ck.rows || !ck.rows.length)) { ck.rows = [{ h: 'auto', front: 'door', hinge: 'L', interior: 'shelves', shelves: 1 }]; }
        changed(false); return;
      }
      if ((a = b.getAttribute('data-colmv'))) {
        var m = a.split(',').map(Number), to = m[0] + m[1];
        if (to >= 0 && to < p.columns.length) { p.columns.splice(to, 0, p.columns.splice(m[0], 1)[0]); changed(false); }
        return;
      }
      if ((a = b.getAttribute('data-colx'))) { p.columns.splice(+a, 1); changed(false); return; }
      if (b.id === 'addCol') { p.columns.push({ w: 'auto', kind: 'normal', rows: [{ h: 'auto', front: 'door', hinge: 'R', interior: 'shelves', shelves: 1 }] }); changed(false); return; }
      if ((a = b.getAttribute('data-rowh'))) {
        var ix = a.split(',').map(Number), row = p.columns[ix[0]].rows[ix[1]];
        openPad({ label: t('Height of this row'), value: row.h, chips: CHIPS.row, auto: true, done: function (v) { row.h = v; changed(false); } });
        return;
      }
      if ((a = b.getAttribute('data-rowx'))) { var rx = a.split(',').map(Number); p.columns[rx[0]].rows.splice(rx[1], 1); changed(false); return; }
      if ((a = b.getAttribute('data-rowadd'))) {
        var c2 = p.columns[+a], last = c2.rows[c2.rows.length - 1];
        c2.rows.push({ h: 'auto', front: last ? last.front : 'drawer', hinge: last ? last.hinge : 'L', interior: 'none', shelves: 0 });
        changed(false); return;
      }
      if ((a = b.getAttribute('data-shelf'))) {
        var sx = a.split(',').map(Number), r2 = p.columns[sx[0]].rows[sx[1]];
        r2.shelves = Math.max(0, Math.min(12, (r2.shelves || 0) + sx[2])); changed(false); return;
      }
      var g = b.closest('[data-seg]');
      if (g) {
        var id = g.getAttribute('data-seg'), v = b.getAttribute('data-v');
        var mm = /^(front|hinge|interior):(\d+),(\d+)$/.exec(id);
        if (mm) {
          var rr = p.columns[+mm[2]].rows[+mm[3]];
          if (mm[1] === 'front') { rr.front = v; }
          else if (mm[1] === 'hinge') { rr.hinge = v; }
          else { rr.interior = v; if (v === 'shelves' && !rr.shelves) { rr.shelves = 1; } }
          changed(false);
        }
      }
    };
    body.onchange = function (e) {
      var el = e.target, a;
      if ((a = el.getAttribute('data-bool'))) {
        p[a] = el.checked;
        if (a === 'skin_add') { p.skin_fit = el.checked ? 'add' : 'inside'; }
        changed(false);
      } else if ((a = el.getAttribute('data-sel'))) {
        p[a] = el.value; changed(false);
      } else if ((a = el.getAttribute('data-same'))) {
        p[a + '_same'] = el.checked;
        if (el.checked) { p[a] = a === 'mat_end' ? p.mat_front : p.mat_carcass; }
        changed(false);
      } else if ((a = el.getAttribute('data-text'))) {
        p[a] = el.value.trim();
        if (a === 'mat_carcass') { SAME_MAT.forEach(function (k) { if (k !== 'mat_end' && p[k + '_same'] !== false) { p[k] = p.mat_carcass; } }); }
        if (a === 'mat_front' && p.mat_end_same !== false) { p.mat_end = p.mat_front; }
        if (a === 'name') { E.dirty = true; return; }
        changed(false);
      }
    };
  }

  function saveModule() {
    var s = E.site;
    var nameIn = document.querySelector('[data-text="name"]');
    if (nameIn) { E.params.name = nameIn.value.trim(); }
    if (E.mod) {
      E.mod.params = clone(E.params); E.mod.updated = now();
      touch(s); persist(); toast(t('Saved'));
    } else {
      s.modules.push({ id: uid(), order: s.next_order++, created: now(), updated: now(), params: clone(E.params), preset: E.presetKey || null });
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
  function projectData(s, withParts) {
    var r = Engine.call('project', { modules: s.modules, codes_state: s.codes_state || null, lang: lang, names: prefs.names, opt: prefs.opt, with_parts: !!withParts });
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
            '<span class="mat">' + esc(r.mat) + ' · ' + LU(r.T) + (r.note ? ' · ' + esc(r.note) : '') + '</span></td>' +
            '<td class="sz">' + L(r.L) + ' × ' + L(r.W) + '</td></tr>';
        }).join('') + '</tbody></table></section>';
    }).join('');
    var warns = (cut.warnings || []).concat((d.errors || []).map(function (e) { return e.code + ': ' + e.error; }));
    var kick = (d.kick || []).map(function (k) {
      return '<div><span>' + fmt(k.h) + ' mm · ' + k.pieces + ' ' + esc(t('pieces')) + ' · ' + fmt(k.metres) + ' m</span><b>' + k.bars.length + ' ' + esc(t(k.bars.length === 1 ? 'bar' : 'bars')) + '</b></div>';
    }).join('');
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(t('Cut list')) + '<span class="sub">' + esc(s.name) + '</span></h1></header>' +
      '<div class="page page-wide">' +
      '<div class="actions-row"><button type="button" class="btn small" id="manualBtn">' + esc(t('Module manual')) + '</button>' +
      '<button type="button" class="btn small" id="optBtn">' + esc(t('Optimize sheets')) + '</button></div>' +
      (warns.length ? '<div class="warn">' + warns.map(function (w) { return '<p>' + esc(w) + '</p>'; }).join('') + '</div>' : '') +
      '<div class="cut-layout"><div class="cut-main">' + html + '</div><aside class="cut-side">' +
      (cut.hardware.length ? '<h2 class="section-h">' + esc(t('Hardware')) + '</h2><div class="box totals">' +
        cut.hardware.map(function (h) { return '<div><span>' + esc(h.item) + '</span><b>' + h.qty + '</b></div>'; }).join('') + '</div>' : '') +
      (kick ? '<h2 class="section-h">' + esc(t('Toe kick bars (4 m)')) + '</h2><div class="box totals">' + kick + '</div>' : '') +
      (cut.banding.length ? '<h2 class="section-h">' + esc(t('Edge banding')) + '</h2><div class="box totals">' +
        cut.banding.map(function (b) { return '<div><span>' + esc(b.mat) + '</span><b>' + fmt(b.m) + ' m</b></div>'; }).join('') + '</div>' : '') +
      (cut.sheets.length ? '<h2 class="section-h">' + esc(t('Sheets (estimate incl. 15% waste)')) + '</h2><div class="box totals">' +
        cut.sheets.map(function (x) { return '<div><span>' + esc(x.mat) + ' · ' + fmt(x.T) + ' mm · ' + esc(x.size) + '</span><b>' + x.sheets + '</b></div>'; }).join('') + '</div>' : '') +
      '</aside></div></div>' +
      '<div class="dock"><button type="button" class="btn primary" id="sharePdf">' + esc(t('Share PDF')) + '</button>' +
      '<button type="button" class="btn primary" id="shareXlsx">' + esc(t('Share Excel')) + '</button></div>'
    );
    $('#back').onclick = function () { history.back(); };
    var meta = {
      site: s.name, client: s.client, notes: s.notes, date: new Date().toLocaleDateString(lang), version: VERSION, t: t,
      head: d.cutlist.csv.split(/\r?\n/)[0].split(',')
    };
    var base = fileName(s.name) + ' - ' + t('Cut list');
    function make(kind, btn) {
      btn.disabled = true;
      loadExport(kind).then(function () { return PPExport[kind](d, meta); }).then(function (blob) {
        btn.disabled = false;
        shareFile(base + (kind === 'pdf' ? '.pdf' : '.xlsx'), blob,
                  kind === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      }, function (e) { btn.disabled = false; toast(String(e && e.message || e)); });
    }
    $('#sharePdf').onclick = function () { make('pdf', this); };
    $('#shareXlsx').onclick = function () { make('xlsx', this); };
    $('#manualBtn').onclick = function () { makeManual(s); };
    $('#optBtn').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/opt'); };
  }

  // The PDF / Excel libraries load only when first used (they are in the offline cache either way).
  var loaded = {};
  function loadScript(src) {
    if (!loaded[src]) {
      loaded[src] = new Promise(function (ok, bad) {
        var el = document.createElement('script');
        el.src = src; el.onload = ok; el.onerror = function () { delete loaded[src]; bad(new Error(src + ' did not load')); };
        document.head.appendChild(el);
      });
    }
    return loaded[src];
  }
  function loadExport(kind) {
    return Promise.all([loadScript(kind === 'pdf' ? 'vendor/pdf-lib.min.js' : 'vendor/jszip.min.js'), loadScript('export.js')]);
  }

  // ------------------------------------------------------------------ printable documents (manual, cutting plan)
  // Shown full screen inside the app; Print opens the phone's print dialog (choose "Save as PDF").
  function showDoc(html, title) {
    var ov = document.createElement('div');
    ov.className = 'docview';
    ov.innerHTML = '<header class="top"><button type="button" class="icon-btn" data-close aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(title) + '</h1><button type="button" class="text-btn" data-print>' + esc(t('Print / save PDF')) + '</button></header>' +
      '<iframe title="' + esc(title) + '"></iframe>';
    document.body.appendChild(ov);
    var fr = ov.querySelector('iframe');
    fr.srcdoc = html.replace(/<div class="np">[\s\S]*?<\/div>/, '');
    ov.querySelector('[data-close]').onclick = function () { ov.remove(); };
    ov.querySelector('[data-print]').onclick = function () { try { fr.contentWindow.focus(); fr.contentWindow.print(); } catch (e) { toast(e.message); } };
  }

  function makeManual(s) {
    var d;
    try { d = projectData(s, true).manual_doc; } catch (e) { toast(e.message); return; }
    d.title = s.name + (s.client ? ' — ' + s.client : '');
    d.date = new Date().toISOString().slice(0, 10);
    d.scope = 'all';
    var html;
    try { html = window.PPManual.build(d, { t: t, show: L, units: U(), esc: esc, mats: matInfo }); }
    catch (e) { toast(t('Could not make the manual: ') + e.message); return; }
    showDoc(html, t('Module manual'));
  }

  // ------------------------------------------------------------------ screens: sheet optimizer
  var lastOpt = null;
  function runOptimizer(s) {
    var d = projectData(s);
    if (!d.cutlist.rows.length) { return null; }
    var res = Engine.call('optimize', { rows: d.cutlist.rows, opt: prefs.opt });
    res.model = s.name; res.date = new Date().toISOString().slice(0, 16).replace('T', ' ');
    res.count = s.modules.length; res.scope = 'all';
    return res;
  }
  function renderOpt(s, fresh) {
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(t('Cutting plan')) + '<span class="sub">' + esc(s.name) + '</span></h1></header>' +
      '<div class="page page-wide" id="optBody"><div class="empty"><h2>' + esc(t('Optimizing…')) + '</h2><p>' + esc(t('Laying the panels out on sheets the way a beam saw cuts them. This can take a little while on a phone.')) + '</p></div></div>'
    );
    $('#back').onclick = function () { history.back(); };
    setTimeout(function () {
      if (fresh || !lastOpt || lastOpt.site !== s.id || lastOpt.at !== s.updated) {
        try { lastOpt = { site: s.id, at: s.updated, d: runOptimizer(s) }; } catch (e) { toast(e.message); return; }
      }
      drawOpt(s, lastOpt.d);
    }, 60);
  }
  function drawOpt(s, d) {
    var body = $('#optBody');
    if (!body) { return; }
    if (!d) { body.innerHTML = '<div class="empty"><h2>' + esc(t('No modules yet')) + '</h2></div>'; return; }
    var R = window.PPReports, ctx = { t: t, show: L, units: U(), es: lang === 'es', settings: { opt: prefs.opt } };
    var tc = R.totalCost(d, ctx);
    var html = '<div class="cards stats">' +
      '<div class="stat"><b>' + d.sheets + '</b><span>' + esc(t(d.sheets === 1 ? 'sheet' : 'sheets')) + '</span></div>' +
      '<div class="stat"><b>' + fmt(d.tape_m) + ' m</b><span>' + esc(t('edge tape')) + ' (+' + fmt(d.settings.tape_extra) + ' %)</span></div>' +
      (tc ? '<div class="stat"><b>' + esc(R.money(tc, ctx)) + '</b><span>' + esc(t('Estimated cost')) + '</span></div>' : '') + '</div>' +
      '<p class="meta-line">' + esc(t('Kerf') + ' ' + fmt(d.settings.kerf) + ' mm · ' + t('trim') + ' ' + fmt(d.settings.trim) + ' mm') + '</p>';
    d.groups.forEach(function (g) {
      var c = R.groupCost(g, ctx);
      html += '<section class="box optgrp"><h3>' + esc(R.groupTitle(g)) + '</h3><p class="meta-line">' + esc(R.groupMeta(g, ctx)) + '</p>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Plain board (no grain): parts may be turned')) + '</span>' +
        '<label class="switch"><input type="checkbox" data-rot="' + esc(g.key) + '"' + (g.rotate ? ' checked' : '') + '><span></span></label></div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Price per sheet')) + (c.sheets || c.tape ? ' <small class="muted">= ' + esc(R.money(c.sheets + c.tape, ctx)) + '</small>' : '') + '</span>' +
        '<button type="button" class="valbtn" data-price="' + esc(g.key) + '">' + esc((prefs.opt.currency || '') + ' ' + fmt(R.priceOf(g, ctx))) + '</button></div>' +
        (g.oversize.length ? '<div class="warn"><p>' + esc(t('Too big for this sheet:') + ' ' + g.oversize.map(function (o) { return (o.code ? o.code + ' ' : '') + o.part + ' ' + fmt(o.L) + ' × ' + fmt(o.W); }).join(', ')) + '</p></div>' : '') +
        '<div class="sheets">' + g.sheets.map(function (sh) {
          return '<figure class="sheet">' + R.sheetSvg(g, sh, false) + '<figcaption>' + esc(t('Sheet') + ' ' + sh.n + ' / ' + g.sheets.length + ' · ' + sh.pieces.length + ' ' + t('parts') + ' · ' + t('waste') + ' ' + sh.waste_pct + ' %') + '</figcaption></figure>';
        }).join('') + '</div></section>';
    });
    body.innerHTML = html;
    var dock = document.createElement('div');
    dock.className = 'dock';
    dock.innerHTML = '<button type="button" class="btn primary" id="optPrint">' + esc(t('Print / save PDF')) + '</button>';
    screen.appendChild(dock);
    $('#optPrint').onclick = function () { showDoc(R.optReport(d, ctx), t('Cutting plan')); };
    body.querySelectorAll('[data-rot]').forEach(function (cb) {
      cb.onchange = function () {
        if (cb.checked) { prefs.opt.rotate[cb.getAttribute('data-rot')] = true; } else { delete prefs.opt.rotate[cb.getAttribute('data-rot')]; }
        savePrefs(); renderOpt(s, true);
      };
    });
    body.querySelectorAll('[data-price]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-price');
        openPad({ label: t('Price per sheet'), value: prefs.opt.prices[k] || 0, allowZero: true, unit: prefs.opt.currency || '$', done: function (v) {
          if (v > 0) { prefs.opt.prices[k] = v; } else { delete prefs.opt.prices[k]; }
          savePrefs(); drawOpt(s, d);
        } });
      };
    });
  }

  // ------------------------------------------------------------------ screens: settings
  var OPT_FIELDS = [['kerf', 'Saw blade kerf', 'len'], ['trim', 'Edge trim (each side)', 'len'], ['sheet_l', 'Default sheet length', 'len'],
                    ['sheet_w', 'Default sheet width', 'len'], ['tape_extra', 'Edge tape allowance (%)', 'pct'], ['tape_price', 'Edge tape price per metre', 'money']];
  function renderSettings() {
    var o = prefs.opt, nm = prefs.names[lang] || {};
    var mine = Engine.call('presets_list', { book: prefs.book });
    var fins = Object.keys(prefs.finishes).sort();
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(t('Settings')) + '</h1></header>' +
      '<div class="page">' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Language')) + '</h3>' +
        seg('lang', [['en', 'English'], ['es', 'Español']], lang) +
        '<h3 class="grp">' + esc(t('Units')) + '</h3>' + seg('units', [['mm', 'mm'], ['cm', 'cm']], prefs.units) +
        '<p class="meta-line" style="margin-top:6px">' + esc(t('Files for the supplier (cut list, PDF, Excel) are always in mm.')) + '</p></div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Sheet optimizer')) + '</h3>' +
        '<p class="meta-line">' + esc(t('Defaults match the supplier’s Biesse beam saw (OptiPlanning, Sektor 450). Sizes in mm.')) + '</p>' +
        OPT_FIELDS.map(function (f) {
          var v = o[f[0]], txt = f[2] === 'pct' ? fmt(v) + ' %' : f[2] === 'money' ? (o.currency || '') + ' ' + fmt(v) : fmt(v) + ' mm';
          return '<div class="frow-f"><span class="flbl">' + esc(t(f[1])) + '</span><button type="button" class="valbtn" data-opt="' + f[0] + '">' + esc(txt) + '</button></div>';
        }).join('') +
        '<div class="frow-f stack"><span class="flbl">' + esc(t('Currency')) + '</span><input class="text-in" id="optCur" value="' + esc(o.currency || '') + '" maxlength="8"></div></div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('My presets')) + '</h3>' +
        (mine.length ? mine.map(function (p) {
          return '<div class="frow-f"><span class="flbl">' + esc(p.label) + ' <small class="muted">' + esc(t(p.category)) + '</small></span>' +
            '<button type="button" class="xbtn" data-delpreset="' + esc(p.key) + '" aria-label="' + esc(t('Delete')) + '">✕</button></div>';
        }).join('') : '<p class="meta-line">' + esc(t('Save a module as a preset from its ⋯ menu. The file is the same as the plugin’s, so presets move between both.')) + '</p>') +
        '<div style="display:flex;gap:8px;margin:8px 0 4px"><button type="button" class="btn small" id="expPresets" style="flex:1"' + (mine.length ? '' : ' disabled') + '>' + esc(t('Export…')) + '</button>' +
        '<button type="button" class="btn small" id="impPresets" style="flex:1">' + esc(t('Import…')) + '</button></div></div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Finish sets')) + '</h3>' +
        (fins.length ? fins.map(function (n) {
          return '<div class="frow-f"><span class="flbl">' + esc(n) + '</span><button type="button" class="xbtn" data-delfin="' + esc(n) + '" aria-label="' + esc(t('Delete')) + '">✕</button></div>';
        }).join('') : '<p class="meta-line">' + esc(t('Save a module’s materials as a finish set from its ⋯ menu, then apply it to other modules.')) + '</p>') + '</div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Part names')) + '</h3>' +
        '<p class="meta-line">' + esc(t('Names used in the cut list and its files. Leave a box empty for the default.')) + '</p>' +
        (info.parts || []).map(function (pt) {
          var def = lang === 'es' ? pt.es : (pt.en_label || pt.en);
          return '<div class="frow-f stack"><span class="flbl">' + esc(def) + '</span><input class="text-in" data-pname="' + esc(pt.en) + '" value="' + esc(nm[pt.en] || '') + '" placeholder="' + esc(def) + '"></div>';
        }).join('') + '</div>' +
      '<p class="meta-line" style="text-align:center">PanelPro Web ' + esc(VERSION) + '</p>' +
      '</div>'
    );
    $('#back').onclick = function () { history.back(); };
    screen.querySelectorAll('[data-seg]').forEach(function (g) {
      g.onclick = function (e) {
        var b = e.target.closest('button[data-v]'); if (!b) { return; }
        if (g.getAttribute('data-seg') === 'lang') { setLang(b.getAttribute('data-v')); }
        else { prefs.units = b.getAttribute('data-v'); savePrefs(); modThumbs = {}; }
        renderSettings();
      };
    });
    screen.querySelectorAll('[data-opt]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-opt'), f = OPT_FIELDS.find(function (x) { return x[0] === k; });
        openPad({ label: t(f[1]), value: o[k], allowZero: true, unit: f[2] === 'pct' ? '%' : f[2] === 'money' ? (o.currency || '$') : 'mm',
                  done: function (v) { o[k] = v; savePrefs(); renderSettings(); } });
      };
    });
    $('#optCur').onchange = function () { o.currency = this.value.trim().slice(0, 8); savePrefs(); };
    screen.querySelectorAll('[data-pname]').forEach(function (inp) {
      inp.onchange = function () {
        var m = prefs.names[lang] = prefs.names[lang] || {};
        if (inp.value.trim()) { m[inp.getAttribute('data-pname')] = inp.value.trim(); } else { delete m[inp.getAttribute('data-pname')]; }
        savePrefs();
      };
    });
    screen.querySelectorAll('[data-delpreset]').forEach(function (b) {
      b.onclick = function () {
        if (!confirm(t('Delete this preset?'))) { return; }
        prefs.book = Engine.call('presets_delete', { book: prefs.book, key: b.getAttribute('data-delpreset') }).book; savePrefs(); renderSettings();
      };
    });
    screen.querySelectorAll('[data-delfin]').forEach(function (b) {
      b.onclick = function () { delete prefs.finishes[b.getAttribute('data-delfin')]; savePrefs(); renderSettings(); };
    });
    $('#expPresets').onclick = function () {
      shareFile('PanelPro presets.json', JSON.stringify(Engine.call('presets_export', { book: prefs.book }), null, 2), 'application/json');
    };
    $('#impPresets').onclick = function () { pickFile(importPresets); };
  }
  function importPresets(text) {
    try {
      var r = Engine.call('presets_import', { book: prefs.book, data: JSON.parse(text) });
      prefs.book = r.book; savePrefs();
      toast(t('Imported presets: ') + r.added);
      if (/settings/.test(location.hash)) { renderSettings(); }
    } catch (e) { toast(t('This file is not a PanelPro presets file.')); }
  }
  // One hidden file input, used for project files and preset files.
  var fileHandler = null;
  function pickFile(handler) { fileHandler = handler; $('#fileIn').click(); }

  // ------------------------------------------------------------------ files: share / open
  // File names without accents: some phones drop a downloaded file's name when it has them.
  function fileName(s) {
    return String(s || 'site').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^\x20-\x7e]+/g, '')
      .replace(/[\\/:*?"<>|]+/g, '-').trim().slice(0, 60) || 'site';
  }
  // Share sheet (WhatsApp, email, Drive…) where the phone allows that file type, else a download.
  // Share sheet (WhatsApp, email, Drive…) where the phone allows that file type, else a download.
  // Phones only share some file types: a project file (JSON) is offered as plain text when JSON
  // isn't allowed. Any failure falls back to saving the file, so the button always does something.
  function shareFile(name, data, mime) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: mime });
    var tries = [[name, mime]];
    if (/json/.test(mime)) { tries.push([name, 'text/plain'], [name.replace(/\.json$/i, '') + '.txt', 'text/plain']); }
    var file = null;
    for (var i = 0; i < tries.length && !file; i++) {
      var f = null;
      try { f = new File([blob], tries[i][0], { type: tries[i][1] }); } catch (e) { f = null; }
      try { if (f && navigator.canShare && navigator.share && navigator.canShare({ files: [f] })) { file = f; } } catch (e) { file = null; }
    }
    if (file) {
      var go = function () {
        navigator.share({ files: [file], title: name }).then(function () { toast(t('Shared')); }, function (e) {
          if (e && e.name === 'AbortError') { return; } // closed the share sheet
          // the tap "expired" while the file was being made: one more tap shares it
          if (e && e.name === 'NotAllowedError') { toast(t('File ready'), { label: t('Share'), run: go }); return; }
          download(blob, name);
        });
      };
      go();
      return;
    }
    download(blob, name);
  }
  function download(blob, name) {
    try {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.rel = 'noopener';
      document.body.appendChild(a); a.click();
      setTimeout(function () { a.remove(); URL.revokeObjectURL(a.href); }, 10000);
      toast(t('File saved to Downloads: ') + name);
    } catch (e) { toast(t('Could not save the file: ') + e.message); }
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
      if (doc && doc.panelpro_presets) { importPresets(r.result); return; }
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
    loadPrefs();
    var th = load('panelpro.web.thumbs', null);
    if (th && th.v === BUILD) { presetThumbs = th.t || {}; }
    wirePad();
    $('#fileIn').onchange = function () {
      var f = this.files[0], h = fileHandler;
      fileHandler = null; this.value = '';
      if (!f) { return; }
      if (h) { var rd = new FileReader(); rd.onload = function () { h(rd.result); }; rd.readAsText(f); }
      else { openFile(f); }
    };

    Engine.start(function (label, f) { $('#bootBar').style.width = Math.max(4, Math.round(f * 92)) + '%'; }).then(function () {
      $('#bootBar').style.width = '100%';
      info = Engine.call('info');
      info.presets.forEach(function (p) {
        try { p.pp = Engine.call('preset', { key: p.key }); } catch (e) { p.pp = null; }
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
  // Helpers for the composition view (web/compose.js).
  window.PPApp = {
    t: t, esc: esc, fmt: fmt, L: L, LU: LU, U: U, show: show, go: go, menu: menu, toast: toast, openPad: openPad,
    persist: function () { persist(); }, codesOf: codesOf, codeSort: codeSort, dimsOf: dimsOf, matInfo: matInfo,
    viewer: ensureViewer, has3d: function () { ensureViewer(); return has3d; }, dimsShown: dimsShown,
    loadPref: load, savePref: save,
    normalize: function (params) { return Engine.call('normalize', { params: params }); },
    buildModule: function (m) {
      var k = m.id + '|' + m.updated + '|' + lang;
      if (!builtCache[k]) { try { builtCache[k] = Engine.call('build', { params: m.params, lang: lang }); } catch (e) { builtCache[k] = null; } }
      return builtCache[k];
    }
  };
  var builtCache = {};
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', boot); } else { boot(); }
})();
