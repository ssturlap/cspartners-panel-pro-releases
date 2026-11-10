/* PanelPro Web — field app screens (phone first, works offline).
 *
 * Sites (projects) → modules. A module is the plugin's own params object; every size, panel
 * and cut-list row comes from the shared engine (window.Engine → the plugin's core/*.rb).
 * This file is interface only: no module rules live here.
 */
(function () {
  'use strict';

  var VERSION = '0.3.40';
  var BUILD = '18cac0431b';
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
    'Put on the floor': 'Poner en el piso', 'Flat (over a module)': 'Acostado (sobre un módulo)', 'On edge (beside a module)': 'De canto (al costado de un módulo)', 'Upright (front / gap)': 'De pie (frente / hueco)', 'Arrange again side by side': 'Acomodar de nuevo uno al lado del otro', 'Whole room': 'Espacio completo', 'Move up': 'Subir', 'Move down': 'Bajar', 'Choose…': 'Elegir…', 'Split below': 'Dividir debajo', 'As the module (Distribution)': 'Como el módulo (Distribución)', 'Stretchers': 'Travesaños', 'Full panel': 'Tablero completo', 'boxes stacked in this module.': 'cajas apiladas en este módulo.', 'Separate into modules': 'Separar en módulos', 'Separated into modules.': 'Separado en módulos.', 'This module has no splits.': 'Este módulo no tiene divisiones.', 'Top of the lower boxes (split module)': 'Techo de las cajas de abajo (módulo dividido)', 'Installation': 'Instalación', 'wall': 'pared', 'walls': 'paredes', 'Plan from above': 'Planta vista desde arriba', 'Elevation': 'Elevación', 'Seen from the front, left to right': 'Vista de frente, de izquierda a derecha', 'Floor': 'Piso', 'Wall cabinets': 'Alacenas', 'Open wall': 'Ver pared', 'Open a wall first.': 'Abrí una pared primero.', 'The whole room as placed in SketchUp. Open a wall to move its modules along it.': 'El espacio completo tal como está en SketchUp. Abrí una pared para mover sus módulos a lo largo de ella.', 'Room plan': 'Planta del espacio', 'Wall': 'Pared', 'Front view': 'Vista frontal', 'Column': 'Columna', 'Empty': 'Vacío',
    'Columns run left → right, rows top → bottom. Leave auto to share what’s left.': 'Las columnas van de izquierda a derecha y las filas de arriba abajo. Deje auto para repartir lo que queda.', 'Close all': 'Cerrar todo', 'Fit': 'Ajustar', 'Drag to turn · pinch to zoom · tap a door': 'Arrastre para girar · pellizque para zoom · toque una puerta',
    'Drag to turn · scroll to zoom · click a door': 'Arrastre para girar · rueda para zoom · clic en una puerta',
    'Set': 'Fijar', 'Enter a size': 'Escriba una medida', 'Not a valid calculation': 'Cálculo no válido',
    'Share PDF': 'Compartir PDF', 'Share Excel': 'Compartir Excel', 'Save PDF': 'Guardar PDF', 'Save Excel': 'Guardar Excel', 'File saved to Downloads: ': 'Archivo guardado en Descargas: ', 'Could not save the file: ': 'No se pudo guardar el archivo: ', 'File ready': 'Archivo listo', 'Share': 'Compartir',
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
    'App version': 'Versión de la app', 'build': 'compilación', 'Check for updates': 'Buscar actualizaciones', 'Checking…': 'Buscando…',
    'Updating to ': 'Actualizando a ', 'You have the latest version': 'Tiene la versión más reciente', 'Reload anyway': 'Recargar igual',
    'No connection: try again when online': 'Sin conexión: intente de nuevo con internet',
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
    var lib = window.PPMaterials && window.PPMaterials.info(name);
    if (lib) { return lib; }
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
    fixPrefs();
  }
  // Fill in what a fresh space / older save lacks.
  function fixPrefs() {
    prefs.units = prefs.units === 'cm' ? 'cm' : 'mm';
    prefs.names = prefs.names || {};
    prefs.opt = Object.assign({ kerf: 4.4, trim: 10, sheet_l: 2440, sheet_w: 1220, tape_extra: 10, tape_price: 0, currency: 'RD$', prices: {}, rotate: {} }, prefs.opt || {});
    prefs.book = prefs.book || {};        // my presets (same format as the plugin's presets file)
    prefs.finishes = prefs.finishes || {}; // finish sets: name → materials
    if (window.PPFields) { window.PPFields.showAll = !!prefs.showAll; }   // "Show all settings"
  }
  // Switching account space: part names, optimizer, presets and finish sets come from that space.
  function resetPrefs() { prefs = { units: prefs.units, showAll: prefs.showAll }; fixPrefs(); }
  function savePrefs() {
    if (window.PPCloud && window.PPCloud.on) { window.PPCloud.prefsChanged(prefs); return; }
    if (!save(PREFS_KEY, prefs)) { toast(t('Could not save the site on this phone.')); }
  }

  // ------------------------------------------------------------------ data
  var sites = [];
  var info = null;          // engine info: presets, choices…
  var presetThumbs = {};
  var modThumbs = {};       // module id + updated → data URL

  function persist() {
    if (window.PPCloud && window.PPCloud.on) { window.PPCloud.sitesChanged(sites); return; }
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
    if (desk()) { window.PPDesk.pad(opts); return; }
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
  // Each item can name an icon (item.icon); a ✓ at the start of a label becomes a check icon.
  var MENU_ICONS = {
    runpanels: '<path d="M3 4h18M3 20h18"/><rect x="4" y="7" width="5" height="10"/><rect x="9.5" y="7" width="5" height="10"/><rect x="15" y="7" width="5" height="10"/>',
    user: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5"/>',
    building: '<path d="M4 20V8l6-3v15M10 20V10h10v10M3 20h18M13 13h1M17 13h1M13 16h1M17 16h1"/>',
    file: '<path d="M3 7h6l2 2h10v10H3z"/><path d="M3 7V5h6"/>',
    materials: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 10h16M10 4v16"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8"/>',
    share: '<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v7h14v-7"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>',
    move: '<rect x="3" y="5" width="11" height="14" rx="1.5"/><path d="M14 12h7M18 9l3 3-3 3"/>',
    trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    door: '<rect x="4" y="3.5" width="10" height="17" rx="1"/><path d="M14 4.5l6 2v13l-6-1.5M11 12h.01"/>',
    drawer: '<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="M3 12h18M10 8.5h4M10 15.5h4"/>',
    mirror: '<path d="M12 3v18M9 7L4 12l5 5M15 7l5 5-5 5"/>',
    bookmark: '<path d="M6 3h12v18l-6-4-6 4z"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/>',
    palette: '<path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.8 1.2-1.6-.4-1 .2-2.4 1.6-2.4H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.4 3.5 5.2 3.5 8.5s-1 6.1-3.5 8.5c-2.5-2.4-3.5-5.2-3.5-8.5s1-6.1 3.5-8.5z"/>',
    copy: '<rect x="8" y="8" width="12" height="12" rx="1.5"/><path d="M16 8V4H4v12h4"/>',
    folder: '<path d="M3 6.5h7l2 2h9v10.5H3z"/>',
    logout: '<path d="M14 4h5v16h-5M10 8l-4 4 4 4M6 12h10"/>',
    shield: '<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z"/>',
    userx: '<circle cx="10" cy="8" r="3.5"/><path d="M3.5 20c.8-3.5 3.3-5.5 6.5-5.5 1.5 0 2.8.4 3.9 1.1M16 15l5 5M21 15l-5 5"/>',
    chat: '<path d="M4 18l1.3-3.8A7.5 7.5 0 1 1 8.5 18.6z"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    star: '<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>',
    download: '<path d="M12 4v11M8 11l4 4 4-4M5 20h14"/>',
    upload: '<path d="M12 15V4M8 8l4-4 4 4M5 20h14"/>',
    layout: '<path d="M3 20h18M5 20V10h5v10M12 20V6h7v14"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    blank: ''
  };
  function menuItemHtml(it) {
    var label = String(it.label), icon = it.icon || 'blank';
    if (/^✓ /.test(label)) { label = label.slice(2); icon = 'check'; } else if (/^ {1,2}/.test(label) && it.icon == null) { label = label.trim(); }
    return menuIcon(icon) + '<span>' + esc(label) + '</span>';
  }
  function menuIcon(name) {
    return '<svg class="mi" viewBox="0 0 24 24" aria-hidden="true">' + (MENU_ICONS[name] || '') + '</svg>';
  }
  function menu(title, items) {
    if (desk()) { window.PPDesk.menu(title, items); return; }
    var m = document.createElement('div');
    m.className = 'menu';
    m.innerHTML = '<div class="menu-sheet" role="menu">' + (title ? '<div class="menu-title">' + esc(title) + '</div>' : '') +
      items.map(function (it, i) { return '<button type="button" role="menuitem" data-i="' + i + '" class="' + (it.danger ? 'danger' : '') + '">' + menuItemHtml(it) + '</button>'; }).join('') +
      '<button type="button" data-i="-1">' + menuIcon('close') + '<span>' + esc(t('Cancel')) + '</span></button></div>';
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
    if (location.hash === hash) { route(); return; }   // same place (e.g. saved on desktop): draw it again
    if (replace) { location.replace(hash); } else { location.hash = hash; }
  }
  function route() {
    var h = location.hash.replace(/^#\/?/, '');
    var p = h.split('/').map(decodeURIComponent);
    window.scrollTo(0, 0);
    if (window.PPCloud && window.PPCloud.on && window.PPCloud.route(p)) { return; }
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
    if (p[0] === 'materials' && window.PPMaterials) { return window.PPMaterials.route(p); }
    renderSites();
  }
  // Small icon buttons over the 3D view (the label shows as a tooltip and is read out).
  var VT_ICONS = {
    sizes: '<path d="M3.5 15.5 15.5 3.5l5 5-12 12z"/><path d="M7.5 11.5l2 2M10.5 8.5l2 2M13.5 5.5l2 2"/>',
    view: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    open: '<rect x="4" y="3.5" width="10" height="17" rx="1"/><path d="M14 4.5l6 2v13l-6-1.5M11 12h.01"/>',
    fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
  };
  function vtBtn(id, icon, label, extra) {
    return '<button type="button" id="' + id + '" class="vt" title="' + esc(label) + '" aria-label="' + esc(label) + '"' + (extra || '') + '>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true">' + VT_ICONS[icon] + '</svg></button>';
  }
  function setOpenBtn(b, opened) {
    if (!b) { return; }
    var l = t(opened ? 'Close all' : 'Open all');
    b.setAttribute('aria-pressed', String(!!opened)); b.title = l; b.setAttribute('aria-label', l);
  }
  function desk() { return !!(window.PPDesk && window.PPDesk.on()); }
  function show(html) {
    screen = $('#screen');
    if (desk()) { screen.innerHTML = window.PPDesk.wrap(html); window.PPDesk.after(screen); }
    else { screen.innerHTML = html; }
    screen.hidden = false;
    document.documentElement.lang = lang;
  }

  // ------------------------------------------------------------------ screens: sites
 // Desktop: the projects as a table you can search and sort.
  var deskSort = load('panelpro.web.sort', { k: 'updated', d: -1 }), deskQuery = '';
  function renderSitesDesk(cloud) {
    var q = deskQuery.trim().toLowerCase();
    var list = sites.filter(function (s) { return !q || [s.name, s.client, s.notes].join(' ').toLowerCase().indexOf(q) >= 0; });
    var key = function (s) { return deskSort.k === 'modules' ? s.modules.length : String(s[deskSort.k] || '').toLowerCase(); };
    list.sort(function (a, b) { var x = key(a), y = key(b); return (x < y ? -1 : x > y ? 1 : 0) * deskSort.d; });
    var th = function (k, label, cls) {
      return '<th class="' + (cls || '') + '"><button type="button" data-sort="' + k + '">' + esc(label) + (deskSort.k === k ? (deskSort.d > 0 ? ' ▲' : ' ▼') : '') + '</button></th>';
    };
    var DT = window.PPDesk.t;
    show(
      '<header class="top"><h1>' + esc(DT('Projects')) + (cloud ? '<span class="sub">' + esc(cloud.space().name) + '</span>' : '') + '</h1>' +
      '<input class="dk-search" id="dkQ" type="search" placeholder="' + esc(DT('Search projects')) + '" value="' + esc(deskQuery) + '">' +
      '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(t('More')) + '">⋯</button></header>' +
      '<div class="page page-wide">' + (cloud ? cloud.invitesHtml() : '') +
      (sites.length ? '<table class="dk-table"><thead><tr><th class="th-pic"></th>' + th('name', DT('Name')) + th('client', DT('Client')) +
          th('modules', DT('Modules'), 'n') + th('updated', DT('Updated'), 'n') + '</tr></thead><tbody>' +
          (list.length ? list.map(function (s) {
            return '<tr data-site="' + esc(s.id) + '" tabindex="0"><td class="td-pic"><img alt="" data-sthumb="' + esc(s.id) + '"></td>' +
              '<td><b>' + esc(s.name) + '</b>' + (s.notes ? '<small>' + esc(s.notes) + '</small>' : '') + '</td><td>' + esc(s.client || '') + '</td>' +
              '<td class="n">' + s.modules.length + '</td><td class="n">' + esc(new Date(s.updated).toLocaleDateString(lang)) + '</td></tr>';
          }).join('') : '<tr><td colspan="5" class="muted">' + esc(DT('No projects match.')) + '</td></tr>') + '</tbody></table>'
        : '<div class="empty"><h2>' + esc(t('No sites yet')) + '</h2><p>' + esc(t('Start one for the room you are measuring.')) + '</p></div>') +
      '<p class="meta-line" style="margin-top:20px">PanelPro Web ' + esc(VERSION) + ' · ' + esc(t('Engine')) + ' ' + esc(Engine.version || '') + '</p>' +
      '</div><div class="dock"><button type="button" class="btn primary" id="newSite">+ ' + esc(t('New site')) + '</button></div>'
    );
    if (cloud) { cloud.wireInvites(); }
    screen.querySelectorAll('tr[data-site]').forEach(function (r) {
      var open = function () { go('#/site/' + encodeURIComponent(r.getAttribute('data-site'))); };
      r.onclick = open; r.onkeydown = function (e) { if (e.key === 'Enter') { open(); } };
    });
    screen.querySelectorAll('[data-sort]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-sort');
        deskSort = { k: k, d: deskSort.k === k ? -deskSort.d : (k === 'updated' || k === 'modules' ? -1 : 1) };
        save('panelpro.web.sort', deskSort); renderSitesDesk(cloud);
      };
    });
    var qi = $('#dkQ');
    qi.oninput = function () { deskQuery = qi.value; var pos = qi.selectionStart; renderSitesDesk(cloud); var n = $('#dkQ'); n.focus(); n.setSelectionRange(pos, pos); };
    $('#newSite').onclick = function () { go('#/newsite'); };
    $('#moreBtn').onclick = function () {
      menu(null, [{ label: t('Open a project file'), icon: 'file', run: function () { pickFile(null); } }]);
    };
    // a 3D picture of each project's first module, one by one
    var imgs = Array.prototype.slice.call(screen.querySelectorAll('[data-sthumb]'));
    (function next() {
      var img = imgs.shift();
      if (!img || !img.isConnected) { return; }
      var st = site(img.getAttribute('data-sthumb')), m = st && st.modules.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); })[0];
      var url = m && moduleThumb(m);
      if (url) { img.src = url; } else { img.style.visibility = 'hidden'; }
      setTimeout(next, 0);
    })();
  }

  function renderSites() {
    if (desk()) { return renderSitesDesk(window.PPCloud && window.PPCloud.on ? window.PPCloud : null); }
    var cloud = window.PPCloud && window.PPCloud.on ? window.PPCloud : null;
    var list = sites.slice().sort(function (a, b) { return a.updated < b.updated ? 1 : -1; });
    show(
      '<header class="top"><h1>' + esc(t('Sites')) + (cloud ? '<button type="button" class="space-chip" id="spaceBtn">' + esc(cloud.space().name) + ' ▾</button>' : '') + '</h1>' +
      '<button type="button" class="text-btn" id="langBtn" aria-label="' + esc(t('Language')) + '">' + (lang === 'es' ? 'EN' : 'ES') + '</button>' +
      '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(t('More')) + '">⋯</button></header>' +
      '<div class="page page-wide">' + (cloud ? cloud.invitesHtml() : '') +
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
    if (cloud) { $('#spaceBtn').onclick = cloud.spaceMenu; cloud.wireInvites(); }
    $('#moreBtn').onclick = function () {
      menu(cloud ? cloud.user().email : null, [
        cloud ? { label: cloud.t('Account') + ' · ' + cloud.planLine(), icon: 'user', run: function () { go('#/account'); } } : null,
        cloud ? { label: cloud.t('Companies'), icon: 'building', run: function () { go('#/companies'); } } : null,
        { label: t('Open a project file'), icon: 'file', run: function () { pickFile(null); } },
        { label: window.PPMaterials ? window.PPMaterials.t('Materials') : 'Materials', icon: 'materials', run: function () { go('#/materials'); } },
        { label: t('Settings'), icon: 'settings', run: function () { go('#/settings'); } }
      ].filter(Boolean));
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
  // Desktop project workspace: modules on the left, the 3D view in the middle, settings on the right.
  function deskModsHtml(s, curId) {
    var codes = codesOf(s), mods = s.modules.slice().sort(codeSort(codes)), DT = window.PPDesk.t;
    return '<aside class="ws-mods"><div class="ws-head"><b title="' + esc(s.name) + '">' + esc(s.name) + '</b>' +
      '<button type="button" class="icon-btn" id="projMore" aria-label="' + esc(DT('Project menu')) + '">⋯</button></div>' +
      (s.client ? '<div class="ws-client">' + esc(s.client) + '</div>' : '') +
      '<button type="button" class="btn small primary ws-add" id="wsAdd">+ ' + esc(DT('Add module')) + '</button>' +
      '<div class="ws-list">' + mods.map(function (m) {
        return '<button type="button" class="ws-mod' + (m.id === curId ? ' on' : '') + '" data-wsmod="' + esc(m.id) + '">' +
          '<span class="code">' + esc(codes[m.id] || '?') + '</span><img alt="" data-wthumb="' + esc(m.id) + '">' +
          '<span class="grow"><span class="t1">' + esc(m.params.name || presetLabel(m.params.type)) + '</span><span class="t2">' + dimsOf(m.params) + '</span></span></button>';
      }).join('') + (curId === 'new' ? '<div class="ws-mod on new"><span class="code">+</span><span class="grow"><span class="t1">' + esc(t('New module')) + '</span></span></div>' : '') +
      '</div></aside>';
  }
  function wireDeskMods(s) {
    $('#wsAdd').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/pick'); };
    $('#projMore').onclick = function () { siteMenu(s); };
    screen.querySelectorAll('[data-wsmod]').forEach(function (b) {
      b.onclick = function () {
        if (E && E.dirty && (E.mod || E.presetKey) && !confirm(t('Discard your changes?'))) { return; }
        E = null;
        go('#/site/' + encodeURIComponent(s.id) + '/m/' + encodeURIComponent(b.getAttribute('data-wsmod')));
      };
    });
    var imgs = Array.prototype.slice.call(screen.querySelectorAll('[data-wthumb]'));
    (function next() {
      var img = imgs.shift();
      if (!img || !img.isConnected) { return; }
      var m = s.modules.find(function (x) { return x.id === img.getAttribute('data-wthumb'); });
      var url = m && moduleThumb(m);
      if (url) { img.src = url; } else { img.style.visibility = 'hidden'; }
      setTimeout(next, 0);
    })();
  }
  function renderSiteDesk(s) {
    var first = s.modules.slice().sort(codeSort(codesOf(s)))[0];
    if (first) { go('#/site/' + encodeURIComponent(s.id) + '/m/' + encodeURIComponent(first.id), true); return; }
    var DT = window.PPDesk.t;
    show('<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(s.name) +
      (s.client ? '<span class="sub">' + esc(s.client) + '</span>' : '') + '</h1></header>' +
      '<div class="ws">' + deskModsHtml(s, null) + '<div class="ws-empty"><div class="empty"><h2>' + esc(DT('No modules yet')) + '</h2><p>' + esc(t('Add the first module for this site.')) + '</p>' +
      '<button type="button" class="btn primary" id="wsAdd2">+ ' + esc(DT('Add module')) + '</button></div></div></div>');
    $('#back').onclick = function () { go('#/'); };
    wireDeskMods(s);
    $('#wsAdd2').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/pick'); };
  }

  function renderSite(s) {
    if (desk()) { return renderSiteDesk(s); }
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
    $('#moreBtn').onclick = function () { siteMenu(s); };
    // thumbnails one by one, so the list shows at once
    siteThumbs(s);
  }
  function siteMenu(s) {
      menu(s.name, [
        { label: t('Share project file'), icon: 'share', run: function () { shareSite(s); } },
        { label: t('Rename site'), icon: 'edit', run: function () { renderNewSite(s); } },
        window.PPCloud && window.PPCloud.on && (window.PPCloud.hasCompanies() || window.PPCloud.space().kind === 'company') ? { label: window.PPCloud.t('Move to a company…'), icon: 'move', run: function () { window.PPCloud.moveSite(s); } } : null,
        { label: t('Delete site'), icon: 'trash', danger: true, run: function () {
          if (!confirm(t('Delete this site and its modules?'))) { return; }
          sites = sites.filter(function (x) { return x !== s; }); persist(); toast(t('Deleted')); go('#/', true);
        } }
      ].filter(Boolean));
  }
  function siteThumbs(s) {
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
    var G = window.PPCloud && window.PPCloud.on ? window.PPCloud : null;
    if (G) { html += '<h2 class="section-h">' + esc(G.t('Public gallery')) + '</h2><div class="cards" id="galCards"><p class="meta-line">…</p></div>'; }
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
    if (G) {
      (G.gallery.cached('modules') ? Promise.resolve(G.gallery.cached('modules')) : G.gallery.load('modules')).then(function (list) {
        var el = $('#galCards'); if (!el) { return; }
        el.innerHTML = list.length ? list.map(function (g) {
          return '<div class="mcard gcard"><button type="button" class="gpick" data-gal="' + esc(g.id) + '"><img class="pic" alt="" src="' + esc(g.thumb || '') + '">' +
            '<span class="nm">' + (g.official ? '<b class="badge">' + esc(G.t('Official')) + '</b> ' : '') + esc(g.name) + '</span>' +
            '<span class="sz">' + esc(G.t('Shared by: ') + (g.author && g.author.name || '')) + '</span></button>' +
            (G.gallery.admin('modules', g, function () { renderPick(s); }) ? '<button type="button" class="gmore" data-gmore="' + esc(g.id) + '" aria-label="⋯">⋯</button>' : '') + '</div>';
        }).join('') : '<p class="meta-line">' + esc(G.t('Nothing shared yet.')) + '</p>';
        el.querySelectorAll('[data-gal]').forEach(function (b) {
          b.onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/new/' + encodeURIComponent('gal:' + b.getAttribute('data-gal'))); };
        });
        el.querySelectorAll('[data-gmore]').forEach(function (b) {
          b.onclick = function () { var g = list.find(function (x) { return x.id === b.getAttribute('data-gmore'); }); G.gallery.admin('modules', g, function () { renderPick(s); })(); };
        });
      }, function () { var el = $('#galCards'); if (el) { el.innerHTML = ''; } });
    }
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
  var FRONT_CHOICES = [['door', 'Door'], ['door_pair', 'Door pair'], ['drawer', 'Drawer'], ['false_front', 'False front'], ['none', 'Open'], ['same', 'Same door ↑']];

  // Preview options (remembered): 2D front view or 3D, and which moving parts are shown.
  var view = load('panelpro.web.view', { mode: '3d', vis: { doors: true, dfronts: true, dboxes: true } });
  function saveView() { save('panelpro.web.view', view); }
  function presetParams(key) {
    if (/^user:/.test(key)) { return Engine.call('preset_params', { book: prefs.book, key: key.slice(5) }); }
    if (/^gal:/.test(key)) {
      var g = (window.PPCloud.gallery.cached('modules') || []).find(function (x) { return x.id === key.slice(4); });
      return Engine.call('normalize', { params: g ? JSON.parse(g.params) : {} });
    }
    var pp = Engine.call('preset', { key: key });
    // the material list's default material starts every new module (its carcass; parts set "same" follow)
    var dm = window.PPMaterials && window.PPMaterials.defaultMaterial && window.PPMaterials.defaultMaterial();
    if (dm && !pp.panel) { pp.mat_carcass = dm; pp = Engine.call('normalize', { params: pp }); }
    return pp;
  }
  function presetTitle(key) {
    if (/^user:/.test(key)) { var b = prefs.book[key.slice(5)]; return b ? b.name : ''; }
    if (/^gal:/.test(key)) { var g = (window.PPCloud.gallery.cached('modules') || []).find(function (x) { return x.id === key.slice(4); }); return g ? g.name : ''; }
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
      '<div class="edit-layout' + (desk() ? ' ws' : '') + '">' + (desk() ? deskModsHtml(s, mod ? mod.id : 'new') : '') +
      '<div class="view3d" id="v3d"><svg class="elev" id="elev" preserveAspectRatio="xMidYMid meet"></svg>' +
      '<span class="view-hint" id="viewHint"></span>' +
      '<div class="view-tools"><button type="button" id="dimBtn" class="vt vt-txt" title="2D / 3D">' + (view.mode === '3d' ? '2D' : '3D') + '</button>' +
      vtBtn('dimsBtn', 'sizes', t('Sizes'), ' aria-pressed="' + dimsShown() + '"') + vtBtn('viewBtn', 'view', t('View')) +
      vtBtn('openAll', 'open', t('Open all'), ' aria-pressed="false"') + vtBtn('fitBtn', 'fit', t('Fit')) + '</div></div>' +
      '<div class="edit-side"><div class="page" id="editBody"></div>' +
      '<div class="dock"><button type="button" class="btn primary" id="saveMod">' + esc(mod ? t('Save changes') : t('Add to site')) + '</button></div></div>' +
      '</div>'
    );
    var host = $('#v3d');
    host.insertBefore(ensureViewer(), host.firstChild);
    if (desk()) {
      wireDeskMods(s);
      // the 3D view's size is known only once the three panels are laid out: fit it then
      requestAnimationFrame(function () { if (has3d && view.mode === '3d' && $('#v3d')) { P3D.resize(); P3D.reset('iso'); } });
    }
    if (!has3d) { view.mode = '2d'; }
    else { P3D.setDimUnits(uk(), U()); P3D.setDims(dimsShown()); P3D.resize(); }
    setViewMode(view.mode, true);
    $('#back').onclick = function () {
      if (E.dirty && mod && !confirm(t('Discard your changes?'))) { return; }
      E = null;
      if (desk()) { go(mod ? '#/' : '#/site/' + encodeURIComponent(s.id)); } else { history.back(); }
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
        { label: t('Show doors'), icon: view.vis.doors ? 'check' : 'blank', run: function () { view.vis.doors = !view.vis.doors; saveView(); draw3d(false); } },
        { label: t('Show drawer fronts'), icon: view.vis.dfronts ? 'check' : 'blank', run: function () { view.vis.dfronts = !view.vis.dfronts; saveView(); draw3d(false); } },
        { label: t('Show drawer boxes'), icon: view.vis.dboxes ? 'check' : 'blank', run: function () { view.vis.dboxes = !view.vis.dboxes; saveView(); draw3d(false); } }
      ];
      if (has3d && view.mode === '3d') {
        if (n.door) { items.push({ label: t(P3D.isOpen('door') ? 'Close doors' : 'Open doors'), icon: 'door', run: function () { P3D.toggle('door'); } }); }
        if (n.drawer) { items.push({ label: t(P3D.isOpen('drawer') ? 'Close drawers' : 'Open drawers'), icon: 'drawer', run: function () { P3D.toggle('drawer'); } }); }
      }
      menu(t('View'), items);
    };
    $('#openAll').onclick = function () {
      if (!has3d || view.mode !== '3d') { return; }
      var opened = P3D.toggle('all');
      setOpenBtn($('#openAll'), opened);
    };
    if (window.P3D) { P3D.onMotion = function () { setOpenBtn($('#openAll'), P3D.isOpen('all')); }; }
    $('#saveMod').onclick = saveModule;
    $('#moreBtn').onclick = function () { editMenu(s, mod, title); };
    renderEditBody();
  }

  function editMenu(s, mod, title) {
    var items = [
      { label: t('Mirror (left ↔ right)'), icon: 'mirror', run: function () {
        try { E.params = Engine.call('mirror', { params: E.params }); changed(false); toast(t('Mirrored')); } catch (e) { toast(e.message); }
      } },
      { label: t('Save as my preset…'), icon: 'bookmark', run: function () { savePresetFlow(); } }
    ];
    if (E.presetKey && /^user:/.test(E.presetKey) && prefs.book[E.presetKey.slice(5)]) {
      items.push({ label: t('Update my preset “') + prefs.book[E.presetKey.slice(5)].name + '”', icon: 'refresh', run: function () {
        var r = Engine.call('presets_update', { book: prefs.book, key: E.presetKey.slice(5), params: E.params });
        prefs.book = r.book; savePrefs(); presetThumbs['user:' + E.presetKey.slice(5)] = null; toast(t('Preset updated'));
      } });
    }
    var fins = Object.keys(prefs.finishes).sort();
    if (fins.length) {
      items.push({ label: t('Apply a finish set…'), icon: 'palette', run: function () {
        menu(t('Finish sets'), fins.map(function (name) {
          return { label: name, icon: 'palette', run: function () { Object.assign(E.params, prefs.finishes[name]); changed(false); toast(t('Finish set applied: ') + name); } };
        }));
      } });
    }
    items.push({ label: t('Save these materials as a finish set…'), icon: 'bookmark', run: function () {
      var name = (prompt(t('Name for these materials, e.g. Kitchen A')) || '').trim();
      if (!name) { return; }
      prefs.finishes[name] = Engine.call('finish', { params: E.params }); savePrefs(); toast(t('Saved'));
    } });
    if (mod && window.PPCloud && window.PPCloud.on) {
      var G = window.PPCloud;
      items.push(mod.gallery_id
        ? { label: G.t('Remove from public gallery'), icon: 'globe', run: function () { G.gallery.unshareModule(mod); } }
        : { label: G.t('Share to public gallery'), icon: 'globe', run: function () { G.gallery.shareModule(mod, presetTitle(mod.preset || ''), moduleThumb(mod)).catch(function (e) { toast(e.code || e.message); }); } });
    }
    if (mod) {
      items.push({ label: t('Duplicate'), icon: 'copy', run: function () { duplicateModule(); } });
      items.push({ label: t('Delete module'), icon: 'trash', danger: true, run: function () {
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
      return { label: t(c), icon: 'folder', run: function () {
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
    if (b) { setOpenBtn(b, false); b.hidden = view.mode !== '3d' || !(r.movers && r.movers.length); }
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

  // A size in the layout: the number only, and an "auto" switch beside it (on = shares what is left).
  function sizeCtl(kind, idx, v, computed) {
    var auto = v === 'auto', shown = auto ? (computed ? L(computed) : '—') : L(v);
    return '<span class="szc"><button type="button" class="hbtn szv' + (auto ? ' is-auto' : '') + '" data-' + kind + '="' + idx + '">' + esc(shown) + '</button>' +
      '<button type="button" class="autob" data-auto="' + kind + ':' + idx + '" data-calc="' + (computed || '') + '" aria-pressed="' + auto + '" title="' +
      esc(t(auto ? 'Auto: shares the space left — tap to fix this size' : 'Fixed size — tap to make it auto')) + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h16M4 12l4-4M4 12l4 4M20 12l-4-4M20 12l-4 4"/></svg><span>' + esc(t('auto')) + '</span></button></span>';
  }
  function seg(id, choices, value, extraCls, segCls) {
    return '<div class="seg' + (segCls ? ' ' + segCls : '') + '" data-seg="' + id + '">' + choices.map(function (c) {
      return '<button type="button" class="' + (extraCls || '') + '" data-v="' + esc(c[0]) + '" aria-pressed="' + (String(value) === String(c[0])) + '">' + esc(t(c[1])) + '</button>';
    }).join('') + '</div>';
  }

  // ---- full editor: the plugin's Configurator settings (ui/fields.js, shared), drawn for touch
  // A tab lists whole sections of ui/fields.js, or a slice of one: { sec, from, until } (group titles).
  var DECO_TITLE = 'Decorative panels', ENDS_TITLE = 'Visible end panels', CUT_TITLE = 'Cut list';
  var TABS = [['layout', 'Layout', ['layout']], ['module', 'Module', ['module']],
              ['box', 'Box', [{ sec: 'box', until: DECO_TITLE }]],
              ['panels', 'Decorative panels', [{ sec: 'box', from: DECO_TITLE }, { sec: 'materials', from: ENDS_TITLE, until: CUT_TITLE }]],
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
  var INTERIOR_CH = [['none', 'Empty'], ['shelves', 'Shelves'], ['hang', 'Hang rail'], ['inner_drawers', 'Inner drawers'], ['shoe_pullout', 'Shoe pull-outs'], ['shoe_rack', 'Shoe rack']];
  var COUNT_L = { shelves: 'Shelves', inner_drawers: 'Drawers', shoe_pullout: 'Pull-outs', shoe_rack: 'Racks' };
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
    var c = F().condOf(d);
    if (key === '#') { return F().cond(d[2])(p) ? '<h3 class="grp">' + esc(label) + '</h3>' : ''; }
    if (SKIP[key] || !c(p) || (p.panel && key === 'inner_w')) { return ''; }
    if (type === 'info') {
      var ik = window.PPReports.INFO_KEYS[key], txt = ik ? window.PPReports.info[ik](p, rctx()) : '';
      return txt ? '<p class="readout">' + esc(txt) + '</p>' : '';
    }
    if (type === 'btn') { return '<button type="button" class="btn small fbtn" data-btn="' + key + '">' + esc(label) + '</button>'; }
    if (type === 'cards') {
      return '<div class="frow-f stack"><span class="flbl">' + esc(label) + '</span><div class="cards" data-cards="' + key + '">' + d[3].map(function (o) {
        return '<button type="button" class="card" data-v="' + esc(o[0]) + '" aria-pressed="' + (String(p[key]) === o[0]) + '">' + F().cardSvg(o) +
          '<span><b>' + esc(t(o[1])) + '</b><small>' + esc(t(o[2])) + '</small></span></button>';
      }).join('') + '</div></div>';
    }
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
      var front = key === 'mat_back' && p.mat_back_front === true;
      var same = !front && (SAME_MAT.indexOf(key) >= 0 ? p[key + '_same'] !== false : false);
      ctl = '<div class="matpick"><input class="text-in" autocomplete="off" data-text="' + key + '" value="' + esc(p[key] || '') + '"' + (same || front ? ' disabled' : '') + '>' +
        '<button type="button" class="btn small" data-matpick="' + key + '"' + (same || front ? ' disabled' : '') + '>' + esc(t('Choose…')) + '</button></div>' +
        (SAME_MAT.indexOf(key) >= 0 ? '<label class="chk"><input type="checkbox" data-same="' + key + '"' + (same ? ' checked' : '') + '> ' +
          esc(t(key === 'mat_end' ? 'Same as fronts' : 'Same as carcass')) + '</label>' : '') +
        (key === 'mat_back' ? '<label class="chk"><input type="checkbox" data-backfront="1"' + (front ? ' checked' : '') + '> ' + esc(t('Same as fronts')) + '</label>' : '');
      var sw = window.PPMaterials ? window.PPMaterials.swatchCss(p[key], (matInfo(p[key]) || {}).color) : 'background:' + ((matInfo(p[key]) || {}).color || '#ddd');
      return '<div class="frow-f stack"><span class="flbl"><i class="swatch" style="' + esc(sw) + '"></i>' + esc(label) + '</span>' + ctl + '</div>';
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

  var nkSel = null, nkN = 2;
  // a split module (boxes stacked) can be broken into separate modules
  function sepBoxHtml() {
    var nb = (E.res && E.res.boxes || []).length;
    return nb > 1 ? '<div class="box sepbox"><span>' + nb + ' ' + esc(t('boxes stacked in this module.')) + '</span>' +
      '<button type="button" class="btn small" id="sepMods">' + esc(t('Separate into modules')) + '</button></div>' : '';
  }
  function layoutHtml(p) {
    var lay = (E.res && E.res.layout) || [];
    var nk = p.layout_mode === 'nooks';
    // layout mode: columns and rows, or NOOKS (ui/nooks.js draws its editor into #nkHost after render)
    var h = '<div class="seg lmode" data-lmode="1">' + [['cols', 'Columns and rows'], ['nooks', 'NOOKS']].map(function (o) {
      return '<button type="button" data-lm="' + o[0] + '" aria-pressed="' + ((o[0] === 'nooks') === nk) + '">' + esc(t(o[1])) + '</button>';
    }).join('') + '</div>';
    if (nk) { return h + '<p class="meta-line">' + esc(t('Split the box into spaces as you like (nooks).')) + '</p><div id="nkHost" class="box"></div>' + sepBoxHtml(); }
    (p.columns || []).forEach(function (col, ci) {
      var LY = lay[ci] || {};
      h += '<div class="box colbox"><div class="col-head"><b>' + esc(t('Column')) + ' ' + (ci + 1) + '</b>' +
        sizeCtl('colw', String(ci), col.w, LY.w) +
        '<span class="grow"></span>' +
        (p.columns.length > 1 ? '<button type="button" class="xbtn" data-colmv="' + ci + ',-1" aria-label="Move left">←</button><button type="button" class="xbtn" data-colmv="' + ci + ',1" aria-label="Move right">→</button>' +
          '<button type="button" class="xbtn del" data-colx="' + ci + '" aria-label="Remove column">✕</button>' : '') + '</div>' +
        '<div class="seg" style="margin:6px 0 4px">' + [['normal', 'Cabinet section'], ['kneehole', 'Kneehole (open, no box)']].map(function (o) {
          return '<button type="button" data-colkind="' + ci + '" data-v="' + o[0] + '" aria-pressed="' + (col.kind === o[0]) + '">' + esc(t(o[1])) + '</button>';
        }).join('') + '</div>';
      if (col.kind === 'kneehole') { h += '<p class="meta-line">' + esc(t('Open kneehole — no bottom, back or fronts; adjacent partitions become pedestal sides.')) + '</p></div>'; return; }
      (col.rows || []).forEach(function (row, ri) {
        var front = row.front.replace(/^glass_/, ''), door = front === 'door', drawer = front === 'drawer';
        var rh = (LY.rows || [])[ri];
        // front = the category (one joined control); hinge and interior = its details, set apart below
        var details = (door ? '<div class="opt-l">' + esc(t('Hinge')) + '</div>' + seg('hinge:' + ci + ',' + ri, HINGE_CH, row.hinge || 'L', 'chip') : '') +
          (!drawer ? '<div class="opt-l">' + esc(t('Inside')) + '</div>' + seg('interior:' + ci + ',' + ri, INTERIOR_CH, row.interior || 'none', 'chip') : '') +
          (!drawer && COUNT_L[row.interior] ? '<div class="stepper"><span>' + esc(t(COUNT_L[row.interior])) + '</span>' +
            '<button type="button" data-shelf="' + ci + ',' + ri + ',-1" aria-label="Fewer shelves">−</button><b>' + (row.shelves || 0) + '</b>' +
            '<button type="button" data-shelf="' + ci + ',' + ri + ',1" aria-label="More shelves">+</button></div>' : '');
        h += '<div class="frow"><div class="frow-head"><span class="rlbl">' + esc(t('Row')) + ' ' + (ri + 1) + '</span>' +
          sizeCtl('rowh', ci + ',' + ri, row.h, rh) + '<span class="grow"></span>' +
          (col.rows.length > 1 ? '<button type="button" class="xbtn" data-rowmv="' + ci + ',' + ri + ',-1" aria-label="' + esc(t('Move up')) + '"' + (ri === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="xbtn" data-rowmv="' + ci + ',' + ri + ',1" aria-label="' + esc(t('Move down')) + '"' + (ri === col.rows.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button type="button" class="xbtn del" data-rowx="' + ci + ',' + ri + '" aria-label="Remove row">✕</button>' : '') + '</div>' +
          '<div class="opt-l">' + esc(t('Front')) + '</div>' + seg('front:' + ci + ',' + ri, FRONT_CHOICES, front, '', 'seg-joined') +
          (details ? '<div class="row-details">' + details + '</div>' : '') +
          '</div>';
        // split module: a separate box below this row
        if (ri < col.rows.length - 1) {
          h += '<div class="splitrow' + (row.split ? ' on' : '') + '"><button type="button" class="chip" data-split="' + ci + ',' + ri + '" aria-pressed="' + !!row.split + '">✂ ' + esc(t('Split below')) + '</button>' +
            (row.split ? '<select class="sel" data-splittop="' + ci + ',' + ri + '">' + [['', 'As the module (Distribution)'], ['stretchers', 'Stretchers'], ['full_panel', 'Full panel']].map(function (o) {
              return '<option value="' + o[0] + '"' + ((row.split_top || '') === o[0] ? ' selected' : '') + '>' + esc(t(o[1])) + '</option>';
            }).join('') + '</select>' : '') + '</div>';
        }
      });
      h += '<button type="button" class="btn small addbtn addrow" data-rowadd="' + ci + '">' + esc(t('+ Row')) + '</button></div>';
    });
    h += '<button type="button" class="btn small addbtn addcol" id="addCol">' + esc(t('+ Add column')) + '</button>';
    h += sepBoxHtml();
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
    // a loose panel has no box, fronts or drawers: only its own settings and materials; other tabs
    // show only when something in them applies to this module (Layout and Materials always)
    var tabs = p.panel ? TABS.filter(function (x) { return x[0] === 'module' || x[0] === 'materials'; })
      : TABS.filter(function (x) { return x[0] === 'layout' || x[0] === 'module' || x[0] === 'materials' || tabFields(x, p) !== ''; });
    var tab = tabs.find(function (x) { return x[0] === editTab; }) || tabs[0];
    html += '<nav class="etabs" role="tablist">' + tabs.map(function (tb) {
      return '<button type="button" role="tab" data-tab="' + tb[0] + '" aria-selected="' + (tab[0] === tb[0]) + '">' + esc(t(tb[1])) + '</button>';
    }).join('') + '</nav>';
    html += '<div class="tabbody">';
    if (tab[0] === 'layout') { html += layoutHtml(p); }
    var fields = tabFields(tab, p);
    if (fields) { html += '<div class="box fields">' + fields + '</div>'; }
    html += '</div>';
    if (E.res) { html += '<p class="meta-line">' + E.res.parts.filter(function (x) { return x.cut; }).length + ' ' + esc(t('parts')) + '</p>'; }
    body.innerHTML = html;
    body.scrollTop = scrollY;
    wireEditBody(body);
    var nh = document.getElementById('nkHost');
    if (nh && window.PPNooks) {
      window.PPNooks.render(nh, {
        t: t, show: function (v) { return L(v); }, units: U(), params: p, layout: E.res && E.res.nooks, sel: nkSel, n: nkN,
        parse: function (v) { var x = window.PP_CALC ? window.PP_CALC(v) : parseFloat(String(v).replace(',', '.')); return x == null || !isFinite(x) ? null : x * uk(); },
        select: function (path) { nkSel = path; renderEditBody(); },
        changed: function () { changed(false); }, setN: function (n) { nkN = n; }
      });
    }
  }

  // The settings of a tab as html; a group title with nothing under it is left out.
  function tabFields(tab, p) {
    var parts = [];
    tab[2].forEach(function (sec) { sectionDefs(sec).forEach(function (d) { var h = fieldHtml(d, p); if (h) { parts.push([d[0] === '#', h]); } }); });
    return parts.filter(function (x, i) { return !x[0] || (parts[i + 1] && !parts[i + 1][0]); }).map(function (x) { return x[1]; }).join('');
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
      if ((a = b.getAttribute('data-matpick')) && window.PPMaterials) {
        var mk = a;
        window.PPMaterials.pick(p[mk], function (name) {
          var inp = body.querySelector('[data-text="' + mk + '"]');
          if (inp) { inp.value = name; inp.dispatchEvent(new Event('change', { bubbles: true })); }   // same path as typing it
        });
        return;
      }
      if ((a = b.getAttribute('data-tab'))) { editTab = a; save('panelpro.web.tab', a); renderEditBody(); $('#editBody').scrollTop = 0; return; }
      if ((a = b.getAttribute('data-lm'))) {
        if (a === 'nooks') { p.layout_mode = 'nooks'; if (!p.nooks && window.PPNooks) { p.nooks = window.PPNooks.fromColumns(p.columns); } } else { delete p.layout_mode; }
        nkSel = null; changed(false); return;
      }
      if (b.closest('#nkHost')) { return; }   // the NOOKS editor handles its own buttons
      var cg = b.closest('[data-cards]');
      if (cg) { p[cg.getAttribute('data-cards')] = b.getAttribute('data-v'); changed(false); return; }
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
      if ((a = b.getAttribute('data-auto'))) {
        // auto on ↔ off; off keeps the size it came out as
        var am = /^(colw|rowh):(\d+)(?:,(\d+))?$/.exec(a);
        if (am) {
          var tgt = am[1] === 'colw' ? p.columns[+am[2]] : p.columns[+am[2]].rows[+am[3]], key = am[1] === 'colw' ? 'w' : 'h';
          var calc = parseFloat(b.getAttribute('data-calc'));
          if (tgt[key] === 'auto') { if (isFinite(calc) && calc > 0) { tgt[key] = Math.round(calc * 10) / 10; } else { return; } }
          else { tgt[key] = 'auto'; }
          changed(false);
        }
        return;
      }
      if ((a = b.getAttribute('data-colw'))) {
        var col = p.columns[+a], cw = col.w === 'auto' ? (((E.res && E.res.layout) || [])[+a] || {}).w : col.w;
        openPad({ label: t('Clear interior width'), value: cw || col.w, auto: true, done: function (v) { col.w = v; changed(false); } });
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
      if ((a = b.getAttribute('data-rowmv'))) {           // a row (with its front and inside) up or down the column
        var rm = a.split(',').map(Number), rws = p.columns[rm[0]].rows, rto = rm[1] + rm[2];
        if (rto >= 0 && rto < rws.length) { rws.splice(rto, 0, rws.splice(rm[1], 1)[0]); changed(false); }
        return;
      }
      if ((a = b.getAttribute('data-colx'))) { p.columns.splice(+a, 1); changed(false); return; }
      if (b.id === 'addCol') { p.columns.push({ w: 'auto', kind: 'normal', rows: [{ h: 'auto', front: 'door', hinge: 'R', interior: 'shelves', shelves: 1 }] }); changed(false); return; }
      if ((a = b.getAttribute('data-rowh'))) {
        var ix = a.split(',').map(Number), row = p.columns[ix[0]].rows[ix[1]];
        var rh0 = row.h === 'auto' ? ((((E.res && E.res.layout) || [])[ix[0]] || {}).rows || [])[ix[1]] : row.h;
        openPad({ label: t('Height of this row'), value: rh0 || row.h, chips: CHIPS.row, auto: true, done: function (v) { row.h = v; changed(false); } });
        return;
      }
      if ((a = b.getAttribute('data-split'))) {
        var sx = a.split(',').map(Number), srow = p.columns[sx[0]].rows[sx[1]];
        if (srow.split) { delete srow.split; delete srow.split_top; } else { srow.split = true; }
        changed(false); return;
      }
      if (b.id === 'sepMods') { separateModule(); return; }
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
          else { rr.interior = v; var c0 = F().COUNTED[v]; if (c0) { rr.shelves = c0; } }
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
      } else if ((a = el.getAttribute('data-splittop'))) {
        var tx = a.split(',').map(Number), trow = p.columns[tx[0]].rows[tx[1]];
        if (el.value) { trow.split_top = el.value; } else { delete trow.split_top; }
        changed(false);
      } else if ((a = el.getAttribute('data-sel'))) {
        p[a] = el.value; changed(false);
      } else if ((a = el.getAttribute('data-same'))) {
        p[a + '_same'] = el.checked;
        if (el.checked) { p[a] = a === 'mat_end' ? p.mat_front : p.mat_carcass; }
        if (el.checked && a === 'mat_back') { delete p.mat_back_front; }
        changed(false);
      } else if (el.getAttribute('data-backfront')) {
        if (el.checked) { p.mat_back_front = true; p.mat_back_same = false; p.mat_back = p.mat_front; } else { delete p.mat_back_front; }
        changed(false);
      } else if ((a = el.getAttribute('data-text'))) {
        p[a] = el.value.trim();
        if (a === 'mat_carcass') { SAME_MAT.forEach(function (k) { if (k !== 'mat_end' && p[k + '_same'] !== false) { p[k] = p.mat_carcass; } }); }
        if (a === 'mat_front' && p.mat_end_same !== false) { p.mat_end = p.mat_front; }
        if (a === 'mat_front' && p.mat_back_front === true) { p.mat_back = p.mat_front; }
        if (a === 'name') { E.dirty = true; return; }
        changed(false);
      }
    };
  }

  // Desktop editor keys: Ctrl+S save, Ctrl+D duplicate, Delete removes the module.
  document.addEventListener('keydown', function (e) {
    if (!E || !desk() || !/\/(m|new)\//.test(location.hash)) { return; }
    if (document.querySelector('.menu, .dpad-wrap, .docview')) { return; }
    var typing = /INPUT|TEXTAREA|SELECT/.test((document.activeElement || {}).tagName || '');
    var mod = e.ctrlKey || e.metaKey;
    if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); saveModule(); }
    else if (mod && e.key.toLowerCase() === 'd' && E.mod) { e.preventDefault(); duplicateModule(); }
    else if (!typing && (e.key === 'Delete') && E.mod) {
      e.preventDefault();
      if (!confirm(t('Delete this module?'))) { return; }
      var s = E.site, m = E.mod;
      s.modules = s.modules.filter(function (x) { return x !== m; }); touch(s); persist();
      E = null; toast(t('Deleted')); go('#/site/' + encodeURIComponent(s.id), true);
    }
  });
  function saveModule() {
    var s = E.site;
    var nameIn = document.querySelector('[data-text="name"]');
    if (nameIn) { E.params.name = nameIn.value.trim(); }
    var mid;
    if (E.mod) {
      // edge banding is switched in the cut list: keep the module's own
      if (E.mod.params && E.mod.params.edges) { E.params.edges = clone(E.mod.params.edges); } else { delete E.params.edges; }
      E.mod.params = clone(E.params); E.mod.updated = now(); mid = E.mod.id;
      touch(s); persist(); toast(t('Saved'));
    } else {
      mid = uid();
      s.modules.push({ id: mid, order: s.next_order++, created: now(), updated: now(), params: clone(E.params), preset: E.presetKey || null });
      touch(s); persist(); toast(t('Added to the site'));
    }
    E = null;
    // desktop: stay on the module (the list on the left shows the change)
    go('#/site/' + encodeURIComponent(s.id) + (desk() ? '/m/' + encodeURIComponent(mid) : ''), true);
  }
  // Split module → one module per box, in the box's place (composition / room), replacing it.
  function separateModule() {
    var s = E.site, mod = E.mod, src = clone(E.params), boxes;
    if (mod && mod.params && mod.params.edges) { src.edges = clone(mod.params.edges); }
    try { boxes = Engine.call('build', { params: src, lang: lang }).boxes || []; } catch (e) { toast(e.message); return; }
    if (boxes.length < 2) { toast(t('This module has no splits.')); return; }
    if (!confirm(t('Separate into modules') + ': ' + boxes.length + '?')) { return; }
    var at = mod ? s.modules.indexOf(mod) : s.modules.length, made = [];
    boxes.forEach(function (b) {
      var m = { id: uid(), order: s.next_order++, created: now(), updated: now(), params: b.params };
      if (mod && mod.pos) { m.pos = Object.assign({}, mod.pos, { z: (Number(mod.pos.z) || 0) + b.z }); }
      if (mod && mod.room) { m.room = Object.assign({}, mod.room, { z: (Number(mod.room.z) || 0) + b.z }); }
      made.push(m);
    });
    s.modules.splice.apply(s.modules, [at, mod ? 1 : 0].concat(made));
    touch(s); persist(); toast(t('Separated into modules.'));
    E = null;
    go('#/site/' + encodeURIComponent(s.id) + (desk() ? '/m/' + encodeURIComponent(made[made.length - 1].id) : ''), true);
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
  var EB_SIDES = ['L1', 'L2', 'W1', 'W2'];
  function fullEdges(r) { return EB_SIDES.every(function (k) { return r.edges && r.edges[k]; }); }
  function renderCut(s) {
    var d;
    try { d = projectData(s); } catch (e) { toast(e.message); go('#/site/' + encodeURIComponent(s.id), true); return; }
    var cut = d.cutlist, byCode = {}, order = [];
    cut.rows.forEach(function (r) {
      if (!byCode[r.code]) { byCode[r.code] = { name: r.module, rows: [] }; order.push(r.code); }
      byCode[r.code].rows.push(r);
    });
    var rowRefs = [], modRefs = [];
    var html = order.map(function (c) {
      var g = byCode[c], mi = modRefs.push(g) - 1, allOn = g.rows.every(fullEdges);
      return '<section class="cut-mod"><h3><span class="code">' + esc(c) + '</span>' + esc(g.name) +
        '<button type="button" class="eb all mod' + (allOn ? ' on' : '') + '" data-ebmod="' + mi + '" aria-pressed="' + allOn + '" title="' +
        esc(t(allOn ? 'Remove edge banding from every panel of this module' : 'Edge band every side of every panel of this module')) + '">' +
        esc(t('Edge banding')) + ': ' + esc(t('All')) + '</button></h3><table class="cut-tab"><tbody>' +
        g.rows.map(function (r) {
          var ri = rowRefs.push(r) - 1, f = fullEdges(r);
          return '<tr><td class="q">' + r.qty + '×</td><td>' + esc(r.part) +
            '<span class="mat">' + esc(r.mat) + ' · ' + LU(r.T) + (r.note ? ' · ' + esc(r.note) : '') + '</span>' +
            '<span class="eb-tog' + (r.eb_set ? ' set' : '') + '">' + EB_SIDES.map(function (k) {
              var on = !!(r.edges && r.edges[k]);
              return '<button type="button" class="eb' + (on ? ' on' : '') + '" data-eb="' + ri + '" data-side="' + k + '" aria-pressed="' + on + '">' + k + '</button>';
            }).join('') + '<button type="button" class="eb all' + (f ? ' on' : '') + '" data-eb="' + ri + '" data-side="all" aria-pressed="' + f + '">' + esc(t('All')) + '</button></span></td>' +
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
      '<div class="dock"><button type="button" class="btn primary" id="sharePdf">' + esc(t(finePointer() || desk() ? 'Save PDF' : 'Share PDF')) + '</button>' +
      '<button type="button" class="btn primary" id="shareXlsx">' + esc(t(finePointer() || desk() ? 'Save Excel' : 'Share Excel')) + '</button></div>'
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
    // edge banding per panel and side (stored on the module; the whole list follows)
    function edgeSet(mid, pids, side, on) {
      var m = s.modules.find(function (x) { return String(x.id) === String(mid); });
      if (!m || !pids.length) { return; }
      try { m.params = Engine.call('edge_set', { params: m.params, pids: pids, side: side, on: on }); } catch (e) { toast(e.message); return; }
      m.updated = now(); touch(s); persist();
      var y = window.scrollY, main = document.querySelector('.cut-main'), sy = main ? main.scrollTop : 0;
      renderCut(s);
      window.scrollTo(0, y); main = document.querySelector('.cut-main'); if (main) { main.scrollTop = sy; }
    }
    document.querySelectorAll('[data-eb]').forEach(function (b) {
      b.onclick = function () {
        var r = rowRefs[+b.dataset.eb], side = b.dataset.side;
        edgeSet(r.mid, r.pids || [], side, side === 'all' ? !fullEdges(r) : !(r.edges && r.edges[side]));
      };
    });
    document.querySelectorAll('[data-ebmod]').forEach(function (b) {
      b.onclick = function () {
        var g = modRefs[+b.dataset.ebmod], pids = [];
        g.rows.forEach(function (r) { pids = pids.concat(r.pids || []); });
        edgeSet(g.rows[0].mid, pids, 'all', !g.rows.every(fullEdges));
      };
    });
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

  // A project placed in a room (from SketchUp): the walls and the plan for the installer pages.
  function roomDoc(s) {
    var inRoom = s.modules.some(function (m) { return m.room; });
    // arranged in Composición (one wall): their places there, backs against the wall
    var placeOf = function (m) {
      if (m.room) { return m.room; }
      if (inRoom || !m.pos || !isFinite(m.pos.x)) { return null; }
      var y = m.pos.wy != null && isFinite(m.pos.wy) ? -m.pos.wy : -(Number(m.params.depth) || 0);
      return { x: m.pos.x, y: y, z: Number(m.pos.z) || 0, rot: 0 };
    };
    if (s.modules.filter(placeOf).length < 2) { return null; }
    try {
      var codes = codesOf(s), mods = {}, list = [], snap = { parts: [], movers: [], places: {} };
      s.modules.forEach(function (m0) {
        var rm = placeOf(m0);
        if (!rm) { return; }
        var m = { id: m0.id, params: m0.params, updated: m0.updated, room: rm };
        var res = window.PPApp.buildModule(m);
        if (!res) { return; }
        var id = m.id, pre = id + ':';
        mods[id] = { parts: res.parts, bb: res.bbox, code: codes[id] || '' };
        list.push({ id: id, code: codes[id] || '', room: m.room, bbox: res.bbox });
        snap.places[id] = { x: m.room.x, y: m.room.y, z: m.room.z, rz: m.room.rot };
        res.parts.forEach(function (q) { var c = Object.assign({}, q, { grp: id }); if (q.mover) { c.mover = pre + q.mover; } snap.parts.push(c); });
        (res.movers || []).forEach(function (mv) { snap.movers.push(Object.assign({}, mv, { id: pre + mv.id, grp: id })); });
      });
      return { layout: Engine.call('room', { mods: list, lang: lang }), mods: mods, snap: snap };
    } catch (e) { return null; }
  }
  function makeManual(s) {
    var d;
    try { d = projectData(s, true).manual_doc; } catch (e) { toast(e.message); return; }
    d.title = s.name + (s.client ? ' — ' + s.client : '');
    d.date = new Date().toISOString().slice(0, 10);
    d.scope = 'all';
    d.room = roomDoc(s);
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
    var M = window.PPMaterials;
    var res = Engine.call('optimize', { rows: d.cutlist.rows, opt: prefs.opt, materials: M ? M.engineList() : [],
                                        costs: M ? M.costDefaults(prefs.opt.prices) : { prices: prefs.opt.prices } });
    res.model = s.name; res.date = new Date().toISOString().slice(0, 16).replace('T', ' ');
    res.count = s.modules.length; res.scope = 'all';
    return res;
  }
  // Whole sheets × price and whole edge tape rolls × roll price (core/costing.rb).
  function costLines(g, ctx) {
    var c = g.cost, M = window.PPMaterials, R = window.PPReports;
    if (!c) { return ''; }
    var mt = M ? M.t : t, cur = function (v) { return R.money(v, ctx); };
    var tape = c.rolls ? c.rolls + ' × ' + fmt(c.roll_m) + ' m ' + mt(c.rolls === 1 ? 'roll' : 'rolls') + ' × ' + cur(c.roll_price) + ' = ' + cur(c.tape_cost) +
                         ' (' + mt('uses') + ' ' + fmt(c.tape_m) + ' m, ' + fmt(c.tape_left_m) + ' m ' + mt('left') + ')'
                       : c.tape_m > 0 ? fmt(c.tape_m) + ' m · ' + mt('no roll length set') : '—';
    return '<div class="costbox">' +
      '<div><span>' + esc(t('Sheets')) + '</span><b>' + esc(c.sheets + ' × ' + cur(c.sheet_price) + ' = ' + cur(c.sheets_cost)) + '</b></div>' +
      '<div><span>' + esc(t('Edge tape')) + '</span><b>' + esc(tape) + '</b></div>' +
      (c.apply_cost ? '<div><span>' + esc(mt('Edge banding work')) + '</span><b>' + esc(fmt(c.tape_m) + ' m × ' + cur(c.apply_m) + ' = ' + cur(c.apply_cost) + ' (' + mt('in the edge tape total') + ')') + '</b></div>' : '') +
      '<div class="tot"><span>' + esc(t('Total')) + '</span><b>' + esc(cur(c.total)) + '</b></div>' +
      (M ? '<button type="button" class="linkbtn" data-price="' + esc(g.key) + '" data-matedit="1">' + esc(M.t(c.listed ? 'Edit material' : 'Add to the material list')) + ' ›</button>' : '') +
      '</div>';
  }
  function renderOpt(s, fresh) {
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button>' +
      '<h1>' + esc(t('Cutting plan')) + '<span class="sub">' + esc(s.name) + '</span></h1></header>' +
      '<div class="page page-wide" id="optBody"><div class="empty"><h2>' + esc(t('Optimizing…')) + '</h2><p>' + esc(t('Laying the panels out on sheets the way a beam saw cuts them. This can take a little while on a phone.')) + '</p></div></div>'
    );
    $('#back').onclick = function () { history.back(); };
    setTimeout(function () {
      var ms = window.PPMaterials ? window.PPMaterials.stamp() : 0;
      if (fresh || !lastOpt || lastOpt.site !== s.id || lastOpt.at !== s.updated || lastOpt.ms !== ms) {
        try { lastOpt = { site: s.id, at: s.updated, ms: ms, d: runOptimizer(s) }; } catch (e) { toast(e.message); return; }
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
        '<div class="frow-f"><span class="flbl">' + esc(t('Price per sheet')) + '</span>' +
        '<button type="button" class="valbtn" data-price="' + esc(g.key) + '">' + esc((prefs.opt.currency || '') + ' ' + fmt(R.priceOf(g, ctx))) + '</button></div>' +
        costLines(g, ctx) +
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
    if (desk()) { window.PPDesk.fixDock(); }
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
        if (b.hasAttribute('data-matedit')) { var gg = d.groups.find(function (x) { return x.key === k; }); window.PPMaterials.openFor(gg.mat, gg.T); return; }
        openPad({ label: t('Price per sheet'), value: prefs.opt.prices[k] || 0, allowZero: true, unit: prefs.opt.currency || '$', done: function (v) {
          var g = d.groups.find(function (x) { return x.key === k; });
          if (window.PPMaterials && g) { window.PPMaterials.setPrice(g.mat, g.T, v); delete prefs.opt.prices[k]; savePrefs(); renderOpt(s, true); return; }
          if (v > 0) { prefs.opt.prices[k] = v; } else { delete prefs.opt.prices[k]; }
          savePrefs(); drawOpt(s, d);
        } });
      };
    });
  }

  // ------------------------------------------------------------------ screens: settings
  var OPT_FIELDS = [['kerf', 'Saw blade kerf', 'len'], ['trim', 'Edge trim (each side)', 'len'], ['sheet_l', 'Default sheet length', 'len'],
                    ['sheet_w', 'Default sheet width', 'len'], ['tape_extra', 'Edge tape allowance (%)', 'pct']];
  // Settings › Check for updates: ask the server for the newest build; if there is one, let the
  // offline cache pick it up and reload. "Reload anyway" refreshes the screens without asking.
  function hardReload() {
    var done = function () { location.reload(); };
    var jobs = [];
    if (window.caches) { jobs.push(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k.indexOf('panelpro-app-') === 0; }).map(function (k) { return caches.delete(k); })); })); }
    if (navigator.serviceWorker) { jobs.push(navigator.serviceWorker.getRegistration().then(function (r) { return r && r.update(); }).catch(function () {})); }
    Promise.all(jobs).then(done, done);
  }
  function checkUpdate(btn) {
    btn.disabled = true; btn.textContent = t('Checking…');
    fetch('version.json?t=' + Date.now(), { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (v) {
      btn.disabled = false; btn.textContent = t('Check for updates');
      if (v.build && v.build !== BUILD) {
        toast(t('Updating to ') + v.version + '…');
        setTimeout(hardReload, 400);
      } else {
        toast(t('You have the latest version'), { label: t('Reload anyway'), run: hardReload });
      }
    }, function () {
      btn.disabled = false; btn.textContent = t('Check for updates');
      toast(t('No connection: try again when online'));
    });
  }
  function renderSettings() {
    var CL = window.PPCloud && window.PPCloud.on ? window.PPCloud : null;
    var o = prefs.opt, nm = prefs.names[lang] || {};
    var mine = Engine.call('presets_list', { book: prefs.book });
    var fins = Object.keys(prefs.finishes).sort();
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(t('Settings')) +
        (CL ? '<span class="sub">' + esc(CL.space().name) + '</span>' : '') + '</h1></header>' +
      '<div class="page">' +
      (CL ? '<div class="box fields"><h3 class="grp">' + esc(CL.t('Account')) + '</h3><div class="frow-f"><span class="flbl">' + esc(CL.user().email + ' · ' + CL.planLine()) + '</span>' +
            '<button type="button" class="valbtn" id="acctBtn">›</button></div>' +
            (CL.canEdit() ? '' : '<p class="warn-line">' + esc(CL.t('Only admins change company materials and settings.')) + '</p>') + '</div>' : '') +
      '<div class="box fields"><h3 class="grp">' + esc(t('App version')) + '</h3>' +
        '<p class="app-ver"><b>PanelPro Web ' + esc(VERSION) + '</b> · ' + esc(t('build')) + ' ' + esc(BUILD) + ' · ' + esc(t('Engine')) + ' ' + esc(Engine.version || '') + '</p>' +
        '<button type="button" class="btn small" id="updBtn" style="width:100%">' + esc(t('Check for updates')) + '</button></div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Language')) + '</h3>' +
        seg('lang', [['en', 'English'], ['es', 'Español']], lang) +
        '<h3 class="grp">' + esc(t('Units')) + '</h3>' + seg('units', [['mm', 'mm'], ['cm', 'cm']], prefs.units) +
        '<p class="meta-line" style="margin-top:6px">' + esc(t('Files for the supplier (cut list, PDF, Excel) are always in mm.')) + '</p>' +
        '<h3 class="grp">' + esc(t('Configurator')) + '</h3>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Show all settings')) + '</span><label class="switch"><input type="checkbox" id="showAll"' + (prefs.showAll ? ' checked' : '') + '><span></span></label></div>' +
        '<p class="meta-line">' + esc(t('Off: each tab shows only the settings for what the module has (doors, drawers, shelves, a corner…). On: every setting, e.g. to set something up before adding it.')) + '</p></div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Sheet optimizer')) + '</h3>' +
        '<p class="meta-line">' + esc(t('Defaults match the supplier’s Biesse beam saw (OptiPlanning, Sektor 450). Sizes in mm.')) + '</p>' +
        OPT_FIELDS.map(function (f) {
          var v = o[f[0]], txt = f[2] === 'pct' ? fmt(v) + ' %' : f[2] === 'money' ? (o.currency || '') + ' ' + fmt(v) : fmt(v) + ' mm';
          return '<div class="frow-f"><span class="flbl">' + esc(t(f[1])) + '</span><button type="button" class="valbtn" data-opt="' + f[0] + '">' + esc(txt) + '</button></div>';
        }).join('') +
        '<div class="frow-f stack"><span class="flbl">' + esc(t('Currency')) + '</span><input class="text-in" id="optCur" value="' + esc(o.currency || '') + '" maxlength="8"></div>' +
        (window.PPMaterials ? '<button type="button" class="btn small" id="matsBtn" style="width:100%;margin-top:8px">' + esc(window.PPMaterials.t('Material list')) + ' ›</button>' : '') + '</div>' +
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
    $('#showAll').onchange = function () { prefs.showAll = this.checked; F().showAll = prefs.showAll; savePrefs(); };
    if ($('#matsBtn')) { $('#matsBtn').onclick = function () { go('#/materials'); }; }
    if ($('#acctBtn')) { $('#acctBtn').onclick = function () { go('#/account'); }; }
    $('#updBtn').onclick = function () { checkUpdate(this); };
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
    // on a computer (mouse / trackpad) the file is saved to Downloads; the share sheet is for phones
    if (finePointer() || desk()) { download(blob, name); return; }
    var tries = [[name, mime]];
    if (/json/.test(mime)) { tries.push([name, 'text/plain'], [name.replace(/\.json$/i, '') + '.txt', 'text/plain']); }
    var file = null;
    for (var i = 0; i < tries.length && !file; i++) {
      var f = null;
      try { f = new File([blob], tries[i][0], { type: tries[i][1] }); } catch (e) { f = null; }
      try { if (f && navigator.canShare && navigator.share && navigator.canShare({ files: [f] })) { file = f; } } catch (e) { file = null; }
    }
    if (file) {
      var retried = false;
      var go = function () {
        navigator.share({ files: [file], title: name }).then(function () { toast(t('Shared')); }, function (e) {
          if (e && e.name === 'AbortError') { return; } // closed the share sheet
          // the tap "expired" while the file was being made: one more tap shares it
          if (e && e.name === 'NotAllowedError' && !retried) { retried = true; toast(t('File ready'), { label: t('Share'), run: go }); return; }
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
    if (window.PPCloud) { window.PPCloud.langChanged(lang); }
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
    if (window.PPDesk) { window.PPDesk.init(); }
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
      return (window.PPMaterials ? window.PPMaterials.init() : Promise.resolve()).then(function () {
        window.addEventListener('hashchange', route);
        if (window.PPCloud && window.PPCloud.on) { window.PPCloud.start(); return; } // sign-in first, then the account's data
        $('#boot').hidden = true;
        route();
      });
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
    loadPref: load, savePref: save, uid: uid, menuItemHtml: menuItemHtml, version: VERSION, build: BUILD, vtBtn: vtBtn, setOpenBtn: setOpenBtn, lang: function () { return lang; }, site: site, uk: uk,
    prefsOpt: function () { return prefs.opt; }, shareFile: shareFile, pickFile: pickFile,
    sites: function () { return sites; }, prefs: function () { return prefs; }, resetPrefs: resetPrefs, fixPrefs: fixPrefs,
    route: function () { route(); }, setLang: setLang, presetThumb: presetThumb, moduleThumb: function (m) { return moduleThumb(m); },
    hideBoot: function () { $('#boot').hidden = true; },
    showLoading: function (msg) { $('#boot').hidden = true; show('<div class="empty" style="margin-top:30vh"><h2>' + esc(msg) + '</h2></div>'); },
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
