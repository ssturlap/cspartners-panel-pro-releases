/* PanelPro Web — field app screens (phone first, works offline).
 *
 * Sites (projects) → modules. A module is the plugin's own params object; every size, panel
 * and cut-list row comes from the shared engine (window.Engine → the plugin's core/*.rb).
 * This file is interface only: no module rules live here.
 */
(function () {
  'use strict';

  var VERSION = '0.3.80';
  var BUILD = '2aac19175d';
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
    'Add modules to the site first.': 'Primero agregue módulos a la obra.', 'Picture saved.': 'Imagen guardada.', 'Renders': 'Renders', 'No renders yet': 'Aún no hay renders',
    'Open a module or the composition and press the camera button on the 3D view.': 'Abra un módulo o la composición y pulse el botón de cámara en la vista 3D.',
    'pictures': 'imágenes', 'renders': 'renders', 'Project': 'Proyecto', 'Undo': 'Deshacer', 'The render server is not switched on yet — renders start working once it is set up.': 'El servidor de renders aún no está activado — los renders funcionarán cuando se configure.', 'Redo': 'Rehacer', 'Undone': 'Deshecho', 'Redone': 'Rehecho', 'Nothing to undo': 'Nada que deshacer', 'Outside': 'Exterior', 'Between the sides': 'Entre costados', 'Module name': 'Nombre del módulo', 'Height from the floor': 'Altura desde el piso',
    'Raised off the floor (besides the toe kick)': 'Elevado del piso (además del zócalo)', 'Are you sure?': '¿Está seguro?', 'Discard': 'Descartar', 'Replace': 'Reemplazar', 'OK': 'Aceptar',
    'To make a new render, open the module or the composition and press the camera button there.': 'Para hacer un render nuevo, abra el módulo o la composición y pulse allí el botón de cámara.', 'Renders need a signed-in PanelPro account.': 'Los renders necesitan una cuenta de PanelPro con sesión iniciada.', 'The 3D view is not available on this device.': 'La vista 3D no está disponible en este dispositivo.',
    'Could not capture the 3D view.': 'No se pudo capturar la vista 3D.',
    'New composition: top, back and side panels…': 'Nueva composición: tope, panel trasero y laterales…', 'Composition: top, back and side panels…': 'Composición: tope, panel trasero y laterales…',
    'Tap the modules of the composition, then Next.': 'Toque los módulos de la composición y luego Siguiente.',
    'Tap the modules of the composition (on every wall it covers), then Next.': 'Toque los módulos de la composición (en cada pared que cubre) y luego Siguiente.',
    'The modules of this composition are no longer in the site.': 'Los módulos de esta composición ya no están en la obra.', 'From the left': 'Desde la izquierda', 'Edit module': 'Editar módulo',
    'Put on the floor': 'Poner en el piso', 'Flat (over a module)': 'Acostado (sobre un módulo)', 'On edge (beside a module)': 'De canto (al costado de un módulo)', 'Upright (front / gap)': 'De pie (frente / hueco)', 'Arrange again side by side': 'Acomodar de nuevo uno al lado del otro', 'Whole room': 'Espacio completo', 'Move up': 'Subir', 'Move down': 'Bajar', 'Length ↔ grain': 'Largo ↔ veta', 'Length': 'Largo', 'Thickness': 'Espesor', 'Choose…': 'Elegir…', 'Pieces': 'Piezas', 'Dashboard': 'Inicio', 'Recent projects': 'Proyectos recientes', 'Welcome to PanelPro': 'Bienvenido a PanelPro', 'Good morning': 'Buenos días', 'Good afternoon': 'Buenas tardes', 'Good evening': 'Buenas noches', 'Get started on a new project': 'Empezar un proyecto nuevo', 'modules': 'módulos', 'Account': 'Cuenta', 'Let’s build something beautiful today.': 'Hoy construyamos algo hermoso.', 'Measure twice, cut once — we’ll do the counting.': 'Medir dos veces, cortar una — las cuentas las hacemos nosotros.', 'Your workshop is open. Sawdust optional.': 'Su taller está abierto. El aserrín es opcional.', 'Fresh boards, sharp blades, great ideas.': 'Tableros nuevos, sierras afiladas, grandes ideas.', 'Every great kitchen starts with one box.': 'Toda gran cocina empieza con una caja.', 'All projects': 'Todos los proyectos', 'most used': 'más usados', 'Add material to the catalog': 'Agregar material al catálogo', 'Quick view: module catalog': 'Ver catálogo de módulos', 'Quick add hardware': 'Agregar accesorio', 'Colour / finish': 'Color / acabado', 'Hinge type': 'Tipo de bisagra', 'Slide type': 'Tipo de corredera', 'Pull type': 'Tipo de jaladera', 'Type / model': 'Tipo / modelo', 'Length (mm)': 'Largo (mm)', 'Size / hole centres (mm)': 'Medida / entre centros (mm)', 'Height (mm)': 'Alto (mm)', 'Size': 'Medida', 'Hardware': 'Accesorios', 'Accessories': 'Accesorios', 'Project manual': 'Manual del proyecto', 'Manual for this module': 'Manual de este módulo', 'Close': 'Cerrar', 'Diagnostic view': 'Vista de diagnóstico', 'Full-extension slide, soft-close': 'Corredera extensión total, cierre suave', 'Full-extension slide, push to open': 'Corredera extensión total, push to open', 'Full-extension slide, regular': 'Corredera extensión total, normal', 'Concealed hinge, full overlay': 'Bisagra oculta, parche completo', 'Concealed hinge, half overlay': 'Bisagra oculta, medio parche', 'Concealed hinge, no overlay (inset)': 'Bisagra oculta, embutida (sin parche)', 'T-bar pull': 'Jaladera de barra (T-bar)', 'Face pull': 'Jaladera de frente', 'Edge pull': 'Jaladera de canto', 'Shelf pin': 'Soporte de entrepaño', 'Hinges': 'Bisagras', 'Drawer slides & systems': 'Correderas y sistemas de gaveta', 'Pulls & handles': 'Jaladeras y tiradores', 'Lift-ups & flap stays': 'Abatibles y compases', 'Legs & plinth': 'Patas y zócalo', 'Supports & brackets': 'Soportes y escuadras', 'Wardrobe rails': 'Tubos de closet', 'Lift-up / flap fitting': 'Abatible / compás', '— (not linked)': '— (sin vincular)', '— automatic (matching hardware)': '— automático (herrajes que coinciden)', 'Used for (what the modules ask for)': 'Se usa para (lo que piden los módulos)', 'Link each one to an item of your catalog: its price then goes into the project estimate.': 'Vincule cada uno con un artículo de su catálogo: su precio entra en el estimado del proyecto.', 'pieces': 'piezas', 'project': 'proyecto', 'projects': 'proyectos', 'used': 'usado', 'time': 'vez', 'times': 'veces', 'units': 'unidades', 'No materials used yet.': 'Aún no hay materiales usados.', 'No hardware used yet.': 'Aún no hay accesorios usados.', 'Counting your projects…': 'Contando sus proyectos…', 'Module catalog': 'Catálogo de módulos', 'Add to which project?': '¿Agregar a qué proyecto?', 'Open a project first': 'Abra primero un proyecto', 'Hinge': 'Bisagra', 'Drawer slide': 'Corredera', 'Pull / handle': 'Jaladera / tirador', 'Leg / plinth': 'Pata / zócalo', 'Shelf support': 'Soporte de entrepaño', 'Hanging rail': 'Tubo de closet', 'Other': 'Otro', 'piece': 'pieza', 'pair': 'par', 'set': 'juego', 'metre': 'metro', 'New hardware': 'Accesorio nuevo', 'No hardware listed yet': 'Aún no hay accesorios en su catálogo', 'Add the hinges, slides and pulls you buy, with their price.': 'Agregue las bisagras, correderas y jaladeras que compra, con su precio.', 'Used in your projects': 'Usados en sus proyectos', 'Photo (optional)': 'Foto (opcional)', 'Type': 'Tipo', 'Brand': 'Marca', 'Code': 'Código', 'Price': 'Precio', 'Per': 'Por', 'Enter a name': 'Escriba un nombre', 'Name': 'Nombre', 'Add': 'Agregar', 'Modules': 'Módulos', 'Estimated': 'Estimado', 'Totals': 'Totales', 'copy': 'copia', 'Project duplicated.': 'Proyecto duplicado.', 'Leg space': 'Hueco para piernas', 'W': 'An', 'H': 'Al', 'D': 'Fo', 'T': 'Es', 'Save': 'Guardar', 'Save & finish': 'Guardar y terminar', 'Save & next: ': 'Guardar y seguir: ', 'Step ': 'Paso ', ' of ': ' de ', 'Reset materials': 'Restablecer materiales', 'Copy materials from…': 'Copiar materiales de…', 'Materials reset.': 'Materiales restablecidos.', 'Materials copied.': 'Materiales copiados.', 'No other module in this site yet.': 'Todavía no hay otro módulo en esta obra.', 'Split below': 'Dividir debajo', 'As the module (Distribution)': 'Como el módulo (Distribución)', 'Stretchers': 'Travesaños', 'Full panel': 'Tablero completo', 'boxes stacked in this module.': 'cajas apiladas en este módulo.', 'Separate into modules': 'Separar en módulos', 'Separated into modules.': 'Separado en módulos.', 'This module has no splits.': 'Este módulo no tiene divisiones.', 'Top of the lower boxes (split module)': 'Techo de las cajas de abajo (módulo dividido)', 'Installation': 'Instalación', 'wall': 'pared', 'walls': 'paredes', 'Plan from above': 'Planta vista desde arriba', 'Elevation': 'Elevación', 'Seen from the front, left to right': 'Vista de frente, de izquierda a derecha', 'Floor': 'Piso', 'Wall cabinets': 'Alacenas', 'Open wall': 'Ver pared', 'Open a wall first.': 'Abrí una pared primero.', 'The whole room as placed in SketchUp. Open a wall to move its modules along it.': 'El espacio completo tal como está en SketchUp. Abrí una pared para mover sus módulos a lo largo de ella.', 'Room plan': 'Planta del espacio', 'Wall': 'Pared', 'Front view': 'Vista frontal', 'Column': 'Columna', 'Empty': 'Vacío',
    'Columns run left → right, rows top → bottom. Leave auto to share what’s left.': 'Las columnas van de izquierda a derecha y las filas de arriba abajo. Deje auto para repartir lo que queda.', 'Close all': 'Cerrar todo', 'Fit': 'Ajustar', 'Drag to turn · pinch to zoom · tap a door': 'Arrastre para girar · pellizque para zoom · toque una puerta', 'Drag to turn · pinch to zoom · tap a door · hold a panel for its material': 'Arrastre para girar · pellizque para zoom · toque una puerta · mantenga presionado un panel para su material', 'Drag to turn · scroll to zoom · click a door · right-click a panel for its material': 'Arrastre para girar · rueda para zoom · clic en una puerta · clic derecho en un panel para su material',
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
    'PanelPro Black Aluminium': '#202022', 'PanelPro Kick Stainless': '#c4c6c8', 'PanelPro Metal': '#969ba0', 'PanelPro Mattress': '#f3f1ec', 'PanelPro Mattress Trim': '#7d8794', 'PanelPro Slat Roll': '#e2cea8', 'PanelPro Strap': '#82878c', 'PanelPro Stone White Marble': '#eceae4', 'PanelPro Stone Grey Granite': '#80807e', 'PanelPro Stone Black Granite': '#262628',
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
  function dimsOf(p) {
    if (p.panel) { return panelDims(p).map(function (d) { return L(p[d[1]]); }).join(' × ') + ' ' + U(); }   // L × W × T
    if (p.slab) { return L(p.slab_l) + ' × ' + L(p.slab_w) + ' × ' + L(p.stone_t) + ' ' + U(); }             // stone piece
    return L(p.width) + ' × ' + L(p.height) + ' × ' + L(p.depth) + ' ' + U();
  }
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
    if (window.P3D && window.P3D.speed) { window.P3D.speed.orbit = 0.5; window.P3D.speed.zoom = 0.45; }   // calmer turning and zooming on the web
    if (has3d) { P3D.onPartMenu = function (p) { partMatMenu(p); }; P3D.setDiag(load('panelpro.web.diag', false)); }
    return viewer;
  }
  function snapshot(res, w, h) {
    if (!window.P3D || !P3D.snapshot || !res) { return null; }
    return P3D.snapshot(res.parts || [], matInfo, res.movers || [], { w: w || 320, h: h || 240 });
  }
  // The textures a build's parts use (for the module pictures).
  function texOf(res) {
    var u = {};
    ((res && res.parts) || []).forEach(function (p) { var i = matInfo(p.mat); if (i && i.thumb) { u[i.thumb] = true; } });
    return Object.keys(u);
  }
  // The module's picture, with its materials: first in the boards' colours, then — once the
  // texture images are loaded — again with the textures (every picture of it on screen).
  function moduleThumb(m) {
    var k = m.id + '|' + m.updated + '|' + (window.PPMaterials && PPMaterials.stamp ? PPMaterials.stamp() : 0) + '|' + JSON.stringify([m.params.mat_carcass, m.params.mat_front, m.params.mat_parts]);
    if (modThumbs[k] !== undefined) { return modThumbs[k]; }
    var res = null;
    try { res = Engine.call('build', { params: m.params, lang: lang }); modThumbs[k] = snapshot(res, 288, 224); }
    catch (e) { modThumbs[k] = null; }
    var urls = texOf(res);
    if (window.P3D && P3D.loadTex && urls.some(function (u) { return !P3D.texReady(u); })) {
      P3D.loadTex(urls, function () {
        modThumbs[k] = snapshot(res, 288, 224);
        setThumbImgs(m.id, modThumbs[k]);
      });
    }
    return modThumbs[k];
  }
  // the catalog arrived (or the material list changed): the pictures on screen again, with it
  window.addEventListener('pp-materials', function () {
    var seen = {};
    document.querySelectorAll('[data-wthumb], [data-thumb]').forEach(function (img) {
      var id = img.getAttribute('data-wthumb') || img.getAttribute('data-thumb');
      if (seen[id]) { return; }
      seen[id] = true;
      var m = null;
      sites.some(function (s) { m = s.modules.find(function (x) { return x.id === id; }) || null; return !!m; });
      if (m) { setThumbImgs(id, moduleThumb(m)); }
    });
    liveThumb();
    document.querySelectorAll('.dsw[data-mat]').forEach(function (el) { el.setAttribute('style', window.PPMaterials.swatchCss(el.getAttribute('data-mat'))); });
    // project pictures (first module) in the project list
    document.querySelectorAll('[data-sthumb]').forEach(function (img) {
      var st = site(img.getAttribute('data-sthumb')), m = st && st.modules.slice().sort(function (a, b) { return (a.order || 0) - (b.order || 0); })[0];
      var url = m && moduleThumb(m);
      if (url) { img.src = url; }
    });
    // the project numbers, again with the catalog's sheet sizes
    if (document.querySelector('[data-pstats]')) {
      sites.forEach(function (s) {
        var el = document.querySelector('[data-pstats="' + s.id + '"]');
        if (el && !siteStats(s)) { var tmp = document.createElement('span'); tmp.innerHTML = statsHtml(s); el.parentNode.replaceChild(tmp.firstChild, el); }
      });
      fillStats();
    }
    // and the module being edited, in its real materials
    if (E && E.res && $('#editBody')) { try { draw3d(false); } catch (e) { /* not drawn yet */ } }
  });
  function setThumbImgs(id, url) {
    if (!url) { return; }
    document.querySelectorAll('[data-wthumb="' + id + '"], [data-thumb="' + id + '"]').forEach(function (img) { img.src = url; img.style.visibility = ''; });
  }
  // While a module is edited, its picture in the site's list follows the changes.
  var liveThumbT = null;
  function liveThumb() {
    clearTimeout(liveThumbT);
    liveThumbT = setTimeout(function () {
      if (!E || !E.mod || !E.res) { return; }
      var res = E.res, put = function () { setThumbImgs(E.mod.id, snapshot(res, 288, 224)); };
      put();
      var urls = texOf(res);
      if (window.P3D && P3D.loadTex && urls.some(function (u) { return !P3D.texReady(u); })) { P3D.loadTex(urls, function () { if (E && E.res === res) { put(); } }); }
    }, 500);
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
    pad.modes = opts.modes || null; pad.mode = pad.modes ? pad.modes.value : null;
    padModes();
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
  // a choice above the keys (the width: outside / between the sides); switching shows that value
  function padModes() {
    var el = $('#padModes'), m = pad.modes;
    if (!el) { return; }
    el.hidden = !m;
    el.innerHTML = m ? m.list.map(function (o) { return '<button type="button" data-mode="' + o[0] + '" aria-pressed="' + (pad.mode === o[0]) + '">' + esc(o[1]) + '</button>'; }).join('') : '';
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
      } else if (b.getAttribute('data-mode')) {
        pad.mode = b.getAttribute('data-mode'); pad.expr = fmt(pad.modes.values[pad.mode] / pad.k); pad.fresh = true; padModes(); padShow();
      } else if (act === 'cancel') { closePad(); }
      else if (act === 'auto') { var cb0 = pad.cb; closePad(); if (cb0) { cb0('auto'); } }
      else if (act === 'set') {
        var v = calc(pad.expr);
        if (v == null) { $('#padResult').textContent = t('Enter a size'); return; }
        if (isNaN(v) || v < 0 || (v === 0 && !pad.allowZero)) { $('#padResult').classList.add('bad'); $('#padResult').textContent = t('Not a valid calculation'); return; }
        var cb = pad.cb, md = pad.mode; closePad(); if (cb) { cb(Math.round(v * pad.k * 1000) / 1000, md); }
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
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h7M9 14h7M9 17h5"/>',
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
    cut: '<circle cx="6" cy="7" r="2.6"/><circle cx="6" cy="17" r="2.6"/><path d="M8.2 8.5L20 17M8.2 15.5L20 7"/>',
    camera: '<path d="M3 8.5h4l1.6-2.5h6.8L17 8.5h4V19H3z"/><circle cx="12" cy="13.5" r="3.5"/>',
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
      if (p[2] === 'manual') {   // the project manual over the modules list; closing it goes back to the list
        renderSite(s);
        makeManual(s, null, function () { if (/\/manual$/.test(location.hash)) { go('#/site/' + encodeURIComponent(s.id), true); } });
        return;
      }
      if (p[2] === 'cut') { return renderCut(s); }
      if (p[2] === 'renders') { return renderGallery(s); }
      if (p[2] === 'opt') { return renderOpt(s, false); }
      if (p[2] === 'compose') { return window.PPCompose.render(s); }
      return renderSite(s);
    }
    if (p[0] === 'newsite') { location.replace('#/'); return; }
    if (p[0] === 'projects') { return renderSites(); }
    if (p[0] === 'catalog') { return renderPick(null); }
    if (p[0] === 'hardware') { return p[1] ? renderHwEdit(p[1]) : renderHwList(); }
    if (!p[0]) { return renderHome(); }
    if (p[0] === 'settings') { return renderSettings(); }
    if (p[0] === 'materials' && window.PPMaterials) { return window.PPMaterials.route(p); }
    renderSites();
  }
  // ------------------------------------------------------------------ AI renders (ui/render.js)
  // The 3D view as it is now → a photoreal picture made on the PanelPro server; tweaks make new
  // versions, all kept with the project. A photo of the room can be put behind the 3D view to place
  // the furniture in it. Needs the signed-in account (cloud on).
  var MAT_KEYS = ['mat_carcass', 'mat_front', 'mat_top', 'mat_skin', 'mat_back', 'mat_frame', 'mat_drawer', 'mat_kick', 'mat_inner', 'mat_end'];
  var STONE_NAMES = { marble_white: 'White marble', granite_grey: 'Grey granite', granite_black: 'Black granite' };
  function renderMaterials(list) {
    var names = [];
    (list || []).forEach(function (p) {
      MAT_KEYS.forEach(function (k) { if (p[k] && !/^PanelPro /.test(p[k]) && names.indexOf(p[k]) < 0) { names.push(p[k]); } });   // not the plain stand-in colours
      if ((p.stone || p.slab) && STONE_NAMES[p.stone_look] && names.indexOf(STONE_NAMES[p.stone_look]) < 0) { names.push(STONE_NAMES[p.stone_look]); }
    });
    return names.slice(0, 12);
  }
  function loadImg(src) {
    return new Promise(function (ok, no) { var im = new Image(); im.crossOrigin = 'anonymous'; im.onload = function () { ok(im); }; im.onerror = no; im.src = src; });
  }
  function jpeg(canvas, q) { return canvas.toDataURL('image/jpeg', q || 0.9).split(',')[1]; }
  function scaled(im, max) {
    var k = Math.min(1, max / Math.max(im.naturalWidth || im.width, im.naturalHeight || im.height));
    var c = document.createElement('canvas'); c.width = Math.round((im.naturalWidth || im.width) * k); c.height = Math.round((im.naturalHeight || im.height) * k);
    c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
    return c;
  }
  function swatches(names) {
    var jobs = names.map(function (n) {
      var inf = matInfo(n), src = inf && (inf.thumb || inf.tex);
      if (!src) { return Promise.resolve(null); }
      return loadImg(src).then(function (im) { return { mime: 'image/jpeg', data: jpeg(scaled(im, 512), 0.85) }; }, function () { return null; });
    });
    return Promise.all(jobs).then(function (l) { return l.filter(Boolean).slice(0, 6); });
  }
  // ------------------------------------------------------------------ render gallery
  // Every AI render of the project (its modules and compositions) with all their versions; tap a
  // picture to see it big, save it, or open it in the render window to change it.
  // Share a picture (data URL) with the phone's share sheet (WhatsApp, mail…); where the browser
  // can't share files, it is saved instead.
  function shareImage(url, name, title) {
    var save = function () {
      var a = document.createElement('a'); a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
      toast(t('Picture saved.'));
    };
    fetch(url).then(function (r) { return r.blob(); }).then(function (b) {
      var f = new File([b], name, { type: b.type || 'image/jpeg' });
      if (navigator.canShare && navigator.canShare({ files: [f] })) {
        return navigator.share({ files: [f], title: title }).catch(function (e) { if (e && e.name !== 'AbortError') { save(); } });
      }
      save();
    }).catch(save);
  }
  function renderGallery(s) {
    var C = window.PPCloud, base = '#/site/' + encodeURIComponent(s.id);
    show('<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(t('Renders')) +
      '<span class="sub">' + esc(s.name) + '</span></h1></header><div class="page page-wide"><div id="galBody"><p class="meta-line">' + esc(t('Loading…')) + '</p></div></div>');
    $('#back').onclick = function () { go(base); };
    var body = $('#galBody');
    if (!C || !C.on || !C.user()) { body.innerHTML = '<div class="empty"><p>' + esc(t('Renders need a signed-in PanelPro account.')) + '</p></div>'; return; }
    var cache = {};
    function img(rid, v, el) {
      var k = rid + ':' + v;
      if (cache[k]) { if (el) { el.style.backgroundImage = 'url(' + cache[k] + ')'; } return Promise.resolve(cache[k]); }
      return C.call('renderCall', { action: 'image', rid: rid, v: v }, 120000).then(function (r) {
        cache[k] = 'data:' + (r.mime || 'image/jpeg') + ';base64,' + r.data;
        if (el) { el.style.backgroundImage = 'url(' + cache[k] + ')'; }
        return cache[k];
      });
    }
    C.call('renderCall', { action: 'list', site: s.id }, 60000).then(function (res) {
      var list = res.renders || [];
      if (!list.length) {
        body.innerHTML = '<div class="empty"><h2>' + esc(t('No renders yet')) + '</h2><p>' + esc(t('Open a module or the composition and press the camera button on the 3D view.')) + '</p></div>';
        return;
      }
      var total = list.reduce(function (a, r) { return a + r.versions.length; }, 0);
      body.innerHTML = '<p class="meta-line">' + total + ' ' + esc(t('pictures')) + ' · ' + list.length + ' ' + esc(t('renders')) + '</p>' + list.map(function (r) {
        var what = (r.title || '').split(' · ')[0] || t('Project');
        return '<section class="gal-r"><h3>' + esc(what) + ' <small>' + esc(new Date(r.created).toLocaleString(lang) + ' · ' + t((window.PPRender.SCENE_LABEL || {})[r.scene] || r.scene)) + '</small></h3>' +
          '<div class="gal-grid">' + r.versions.slice().reverse().map(function (x) {
            return '<div class="gal-pic" role="button" tabindex="0" data-rid="' + esc(r.id) + '" data-v="' + x.v + '"><span class="th"></span>' +
              '<small>v' + x.v + (x.parent ? ' ← v' + x.parent : '') + (x.prompt ? ' · ' + esc(x.prompt) : '') + '</small>' +
              '<button type="button" class="gal-share" aria-label="' + esc(t('Share')) + '" title="' + esc(t('Share')) + '">' + menuIcon('share') + '</button></div>';
          }).join('') + '</div></section>';
      }).join('');
      var n = 0;
      body.querySelectorAll('.gal-pic').forEach(function (b) {
        var th = b.querySelector('.th');
        if (n++ < 60) { img(b.getAttribute('data-rid'), +b.getAttribute('data-v'), th).catch(function () { th.classList.add('bad'); }); }
        var fname = function (r, v) { return (s.name + ' ' + (r.title || '').split(' · ')[0] + ' v' + v).replace(/[^\w\- ]+/g, '').trim() + '.jpg'; };
        b.querySelector('.gal-share').onclick = function (e) {
          e.stopPropagation();
          var rid = b.getAttribute('data-rid'), v = +b.getAttribute('data-v'), r = list.find(function (x) { return x.id === rid; });
          img(rid, v, null).then(function (u) { shareImage(u, fname(r, v), r.title || s.name); });
        };
        b.onkeydown = function (e) { if (e.target === b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); b.onclick(); } };
        b.onclick = function () {
          var rid = b.getAttribute('data-rid'), v = +b.getAttribute('data-v'), r = list.find(function (x) { return x.id === rid; });
          var box = document.createElement('div');
          box.className = 'gal-view';
          box.innerHTML = '<div class="gal-in"><button type="button" class="rd-x gal-x" aria-label="' + esc(t('Close')) + '">✕</button><div class="gal-big"><span>' + esc(t('Loading…')) + '</span></div>' +
            '<div class="gal-bar"><b>' + esc((r.title || '').split(' · ')[0]) + ' · v' + v + '</b><span class="grow"></span>' +
            '<button type="button" class="btn small" data-g="share">' + menuIcon('share') + esc(t('Share')) + '</button>' +
            '<button type="button" class="btn small" data-g="save">' + menuIcon('download') + esc(t('Save image')) + '</button>' +
            '<button type="button" class="btn small primary" data-g="open">' + esc(t('Change this picture')) + '</button></div></div>';
          document.body.appendChild(box);
          function close() { box.remove(); document.removeEventListener('keydown', k1, true); }
          function k1(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } }
          document.addEventListener('keydown', k1, true);
          box.addEventListener('mousedown', function (e) { if (e.target === box) { close(); } });
          box.querySelector('.gal-x').onclick = close;
          var url = null;
          img(rid, v, null).then(function (u) { url = u; box.querySelector('.gal-big').innerHTML = '<img alt="" src="' + u + '">'; });
          box.querySelector('[data-g="save"]').onclick = function () {
            if (!url) { return; }
            var a = document.createElement('a'); a.href = url; a.download = (s.name + ' ' + (r.title || '').split(' · ')[0] + ' v' + v).replace(/[^\w\- ]+/g, '') + '.jpg';
            document.body.appendChild(a); a.click(); a.remove();
          };
          box.querySelector('[data-g="share"]').onclick = function () { if (url) { shareImage(url, fname(r, v), r.title || s.name); } };
          box.querySelector('[data-g="open"]').onclick = function () { close(); openRender(s, r.title || s.name, [], null, { rid: rid, v: v }); };
        };
      });
    }, function (e) { body.innerHTML = '<p class="meta-line">' + esc(e.message) + '</p>'; });
  }

  // dims: the real size { w, h, d } in mm (or a function giving it) — the AI needs it for the scale
  // start: { rid, v } — the picture to show first
  function openRender(s, title, paramsList, dims, start) {
    var C = window.PPCloud;
    if (!C || !C.on || !C.user()) { toast(t('Renders need a signed-in PanelPro account.')); return; }
    var sheet = document.createElement('div');
    sheet.className = 'rd-sheet';
    sheet.innerHTML = '<div class="rd-box"></div>';
    document.body.appendChild(sheet);
    var photo = null;
    function close() { if (has3d) { P3D.setBackdrop(null); } sheet.remove(); document.removeEventListener('keydown', esc1, true); }
    function esc1(e) { if (e.key === 'Escape' && !document.querySelector('.ask')) { e.preventDefault(); close(); } }
    document.addEventListener('keydown', esc1, true);
    // a click outside the panel closes it (not while placing the furniture on a photo)
    sheet.addEventListener('mousedown', function (e) { if (e.target === sheet && !sheet.classList.contains('placing')) { close(); } });
    window.PPRender.open(sheet.firstChild, {
      t: t, lang: lang, app: 'web', site: s.id, title: title, start: start || null,
      scenes: ['studio', 'studio_grey', 'kitchen', 'bedroom', 'living', 'bathroom', 'office', 'music', 'closet'].concat(has3d ? ['photo'] : []), scene: 'studio',
      call: function (action, data) {
        return C.call('renderCall', Object.assign({ action: action }, data), 300000).catch(function (e) {
          // the function not published yet (or the server down) answers "internal" / "not-found"
          var code = String((e && e.code) || ''), msg = String((e && e.message) || '');
          if (/internal|not-found/.test(code) || /^internal/.test(msg)) { throw new Error(t('The render server is not switched on yet — renders start working once it is set up.')); }
          throw e;
        });
      },
      setPhoto: function (url) { photo = url; if (has3d) { P3D.setBackdrop(url); } },
      place: function (on) { sheet.classList.toggle('placing', !!on); },
      capture: function (o) {
        if (!has3d) { return Promise.reject(new Error(t('The 3D view is not available on this device.'))); }
        if (!paramsList.length) { return Promise.reject(new Error(t('To make a new render, open the module or the composition and press the camera button there.'))); }
        var names = renderMaterials(paramsList);
        var view = P3D.capture({ w: 1600, transparent: o.scene === 'photo' });
        if (!view) { return Promise.reject(new Error(t('Could not capture the 3D view.'))); }
        var base = o.scene === 'photo' && photo ? loadImg(photo).then(function (im) {
          // the photo as it showed behind the view (cover, centred), then the furniture on it
          var c = document.createElement('canvas'), w = view.width, h = view.height, k = Math.max(w / im.naturalWidth, h / im.naturalHeight);
          c.width = w; c.height = h;
          var g = c.getContext('2d');
          g.drawImage(im, (w - im.naturalWidth * k) / 2, (h - im.naturalHeight * k) / 2, im.naturalWidth * k, im.naturalHeight * k);
          g.drawImage(view, 0, 0);
          return { image: jpeg(c), photo: jpeg(scaled(im, 1600), 0.88), w: w, h: h };
        }) : Promise.resolve({ image: jpeg(view), w: view.width, h: view.height });
        return base.then(function (r) { r.dims = typeof dims === 'function' ? dims() : dims; return swatches(names).then(function (sw) { r.materials = names; r.swatches = sw; return r; }); });
      },
      save: function (b64, mime, name) {
        var a = document.createElement('a');
        a.href = 'data:' + mime + ';base64,' + b64; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
      },
      ask: function (title) { return ask({ title: title, ok: t('Delete'), danger: true }); },
      close: close
    });
  }

  // Small icon buttons over the 3D view (the label shows as a tooltip and is read out).
  var VT_ICONS = {
    sizes: '<path d="M3.5 15.5 15.5 3.5l5 5-12 12z"/><path d="M7.5 11.5l2 2M10.5 8.5l2 2M13.5 5.5l2 2"/>',
    diag: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M13 17h8M17 13v8"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 11h7M9 14h7M9 17h5"/>',
    view: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    open: '<rect x="4" y="3.5" width="10" height="17" rx="1"/><path d="M14 4.5l6 2v13l-6-1.5M11 12h.01"/>',
    fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
    render: '<path d="M4 6.5h3l1.5-2h7L17 6.5h3v13H4z"/><circle cx="12" cy="13" r="3.6"/><path d="M18.5 2.5v3M17 4h3"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11"/>',
    redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13"/>'
  };
  function vtBtn(id, icon, label, extra) {
    return '<button type="button" id="' + id + '" class="vt" data-label="' + esc(label) + '" aria-label="' + esc(label) + '"' + (extra || '') + '>' +
      '<svg viewBox="0 0 24 24" aria-hidden="true">' + VT_ICONS[icon] + '</svg></button>';
  }
  // Diagnostic view: flat colours by kind of part (remembered on this device)
  function diagBtn() { return vtBtn('diagBtn', 'diag', t('Diagnostic view'), ' aria-pressed="' + !!(has3d && P3D.diagOn()) + '"'); }
  function wireDiag() {
    var b = document.getElementById('diagBtn');
    if (!b) { return; }
    b.onclick = function () {
      if (!has3d) { return; }
      var on = !P3D.diagOn();
      save('panelpro.web.diag', on);
      P3D.setDiag(on);
      b.setAttribute('aria-pressed', String(on));
    };
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
  // Each project's numbers for the list: modules, pieces, sheets and an estimated cost (whole
  // sheets × price + edge tape rolls, from the cutting plan). Worked out one project at a time
  // after the list shows, and kept until the project, the material prices or the cut settings change.
  var siteStatsCache = load('panelpro.web.siteStats', {});
  function statKey(s) {
    var ms = window.PPMaterials && PPMaterials.stamp ? PPMaterials.stamp() : 0;
    return s.updated + '|' + ms + '|' + JSON.stringify(prefs.opt || {}).length + '|' + hwStamp();
  }
  function siteStats(s) {
    var c = siteStatsCache[s.id];
    return c && c.k === statKey(s) ? c : null;
  }
  function computeStats(s) {
    var st = { k: statKey(s), modules: s.modules.length, pieces: 0, sheets: 0, cost: 0 };
    if (s.modules.length) {
      var d = projectData(s);
      st.pieces = d.cutlist.rows.reduce(function (a, r) { return a + (r.qty || 1); }, 0);
      st.mats = {};
      d.cutlist.rows.forEach(function (r) { if (r.mat) { st.mats[r.mat] = (st.mats[r.mat] || 0) + (r.qty || 1); } });
      st.hw = {};   // item id → [name in the app's language, quantity]
      (d.hw || []).forEach(function (x) { st.hw[x[0]] = [x[1], x[2]]; });
      if (d.cutlist.rows.length) {
        var M = window.PPMaterials, R = window.PPReports;
        var o = Engine.call('optimize', { rows: d.cutlist.rows, opt: prefs.opt, materials: M ? M.engineList() : [],
                                          costs: M ? M.costDefaults(prefs.opt.prices) : { prices: prefs.opt.prices } });
        st.sheets = o.sheets;
        st.cost = R.totalCost(o, { t: t, show: L, units: U(), es: lang === 'es', settings: { opt: prefs.opt } }) || 0;
        st.hwCost = hwCost(st.hw);
        st.cost += st.hwCost;
      }
    }
    siteStatsCache[s.id] = st;
    save('panelpro.web.siteStats', siteStatsCache);
    return st;
  }
  // the estimate in whole money (RD$ 30,750): it is an estimate, cents add nothing
  function money(v) { return ((prefs.opt && prefs.opt.currency) || '') + ' ' + Math.round(v).toLocaleString('en-US'); }
  function statsHtml(s) {
    var st = siteStats(s), v = function (x) { return st ? String(x) : '…'; };
    var cell = function (label, val, cls) { return '<span class="pst' + (cls ? ' ' + cls : '') + '"><small>' + esc(label) + '</small><b>' + esc(val) + '</b></span>'; };
    return '<span class="pstats" data-pstats="' + esc(s.id) + '">' +
      cell(t('Modules'), s.modules.length) + cell(t('Pieces'), v(st && st.pieces)) + cell(t('Sheets'), v(st && st.sheets)) +
      cell(t('Estimated'), st ? (st.cost ? money(st.cost) : '—') : '…', 'money') + '</span>';
  }
  // after the list shows: the missing numbers, one project at a time (the phone stays responsive)
  // done(): called when finished (if anything was worked out); all: every project, not only those on screen
  function fillStats(done, all) {
    if (typeof done !== 'function') { done = null; }
    // the catalog first: its boards' sheet sizes change the sheet count
    if (window.PPMaterials && PPMaterials.ready && !fillStats.ok) { PPMaterials.ready().then(function () { fillStats.ok = true; fillStats(done, all); }); return; }
    var scr = screen;
    var todo = sites.filter(function (s) { return !siteStats(s) && (all || document.querySelector('[data-pstats="' + s.id + '"]')); });
    var worked = todo.length > 0;
    (function next() {
      if (screen !== scr || !screen.isConnected) { return; }
      var s = todo.shift();
      if (!s) { if (done && worked) { done(); } return; }
      var el = document.querySelector('[data-pstats="' + s.id + '"]');
      if (!el && !all) { return; }
      try { computeStats(s); } catch (e) { siteStatsCache[s.id] = { k: statKey(s), modules: s.modules.length, pieces: 0, sheets: 0, cost: 0 }; }
      if (el) { var tmp = document.createElement('span'); tmp.innerHTML = statsHtml(s); el.parentNode.replaceChild(tmp.firstChild, el); }
      setTimeout(next, 30);
    })();
  }
  function siteCardHtml(s) {
    return '<div class="row-card site-card" data-site="' + esc(s.id) + '" role="button" tabindex="0"><span class="grow"><span class="t1">' + esc(s.name) + '</span>' +
      '<span class="t2">' + esc([s.client, new Date(s.updated).toLocaleDateString(lang)].filter(Boolean).join(' · ')) + '</span></span>' +
      rowBtns(s) + statsHtml(s) + '</div>';
  }
  function wireSiteCards() {
    screen.querySelectorAll('.site-card[data-site]').forEach(function (b) {
      b.onclick = function (e) {
        var d = e.target.closest('[data-dup]'), x = e.target.closest('[data-del]');
        if (d) { duplicateSite(site(d.getAttribute('data-dup'))); return; }
        if (x) { deleteSite(site(x.getAttribute('data-del')), function () { route(); }); return; }
        go('#/site/' + encodeURIComponent(b.getAttribute('data-site')));
      };
    });
  }

  // ------------------------------------------------------------------ screens: dashboard (start page)
  // Most used materials, modules and hardware over all projects, and the 8 latest projects.
  function usage() {
    var mats = {}, mods = {}, hw = {}, hwName = {}, matSites = {}, pending = 0;
    sites.forEach(function (s) {
      s.modules.forEach(function (m) { var k = m.preset || (m.params && m.params.type) || ''; if (k) { mods[k] = (mods[k] || 0) + 1; } });
      var st = siteStats(s);
      if (!st && s.modules.length) { pending++; return; }
      Object.keys((st && st.mats) || {}).forEach(function (k) { mats[k] = (mats[k] || 0) + st.mats[k]; (matSites[k] = matSites[k] || {})[s.id] = 1; });
      Object.keys((st && st.hw) || {}).forEach(function (k) { var v = st.hw[k]; if (!Array.isArray(v)) { return; } hw[k] = (hw[k] || 0) + v[1]; hwName[k] = v[0]; });
    });
    // a hinge always comes with its mounting plate: leave the plate out of "most used"
    var hwMain = {}; Object.keys(hw).forEach(function (k) { if (!/^Hinge mounting plate/.test(k)) { hwMain[k] = hw[k]; } });
    var top = function (o, n) { return Object.keys(o).sort(function (a, b) { return o[b] - o[a]; }).slice(0, n).map(function (k) { return [k, o[k]]; }); };
    return { mats: top(mats, 3), mods: top(mods, 3), hw: top(hwMain, 3), hwAll: top(hw, 999), hwName: hwName, matSites: matSites, pending: pending };
  }
  var HW_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M5.5 18.5l2.1-2.1M16.4 7.6l2.1-2.1"/></svg>';
  function dashCards() {
    var u = usage(), wait = u.pending ? '<p class="dash-wait">' + esc(t('Counting your projects…')) + '</p>' : '';
    var empty = function (txt) { return '<p class="dash-empty">' + esc(txt) + '</p>'; };
    var M = window.PPMaterials;
    var mats = u.mats.length ? u.mats.map(function (x) {
      var n = Object.keys(u.matSites[x[0]] || {}).length;
      return '<li><i class="dsw" data-mat="' + esc(x[0]) + '" style="' + esc(M ? M.swatchCss(x[0]) : 'background:#ddd') + '"></i><span><b>' + esc(x[0]) + '</b><small>' + x[1] + ' ' + esc(t('pieces')) + ' · ' + n + ' ' + esc(t(n === 1 ? 'project' : 'projects')) + '</small></span></li>';
    }).join('') : (u.pending ? '' : empty(t('No materials used yet.')));
    var mods = u.mods.length ? u.mods.map(function (x) {
      return '<li><img class="dpic" alt="" data-pk="' + esc(x[0]) + '"><span><b>' + esc(presetLabel(x[0]) || x[0]) + '</b><small>' + esc(t('used') + ' ' + x[1] + ' ' + t(x[1] === 1 ? 'time' : 'times')) + '</small></span></li>';
    }).join('') : empty(t('No modules yet'));
    var hw = u.hw.length ? u.hw.map(function (x) {
      var item = hwFor(x[0]);
      return '<li><i class="dhw">' + (item && item.photo ? '<img alt="" src="' + esc(item.photo) + '">' : hwIcon(item ? item.type : hwTypeOf(x[0]), x[0])) + '</i><span><b>' + esc(item ? item.name : u.hwName[x[0]] || x[0]) + '</b><small>' + x[1] + ' ' + esc(t('units')) +
        (item && item.price ? ' · ' + esc(money(item.price)) : '') + '</small></span></li>';
    }).join('') : (u.pending ? '' : empty(t('No hardware used yet.')));
    var card = function (cls, title, list, btnId, btn) {
      return '<section class="dash-card ' + cls + '"><h3>' + esc(title) + '<small>' + esc(t('most used')) + '</small></h3><ul>' + list + '</ul>' + (list ? '' : wait) +
        '<button type="button" class="btn small ghost" id="' + btnId + '">' + esc(btn) + '</button></section>';
    };
    return card('dc-mat', t('Materials'), mats, 'dAddMat', '+ ' + t('Add material to the catalog')) +
      card('dc-mod', t('Modules'), mods, 'dCatalog', '▦ ' + t('Quick view: module catalog')) +
      card('dc-hw', t('Accessories'), hw, 'dAddHw', '+ ' + t('Quick add hardware'));
  }
  // The welcome banner on top of the dashboard: hello with the user's name, a line of numbers and the
  // big "start a new project" button.
  var HERO_LINES = ['Let’s build something beautiful today.', 'Measure twice, cut once — we’ll do the counting.', 'Your workshop is open. Sawdust optional.',
    'Fresh boards, sharp blades, great ideas.', 'Every great kitchen starts with one box.'];
  function heroHtml(cloud) {
    var u = cloud && cloud.user ? cloud.user() : null;
    var first = u ? String(u.displayName || (u.email || '').split('@')[0] || '').split(/\s+/)[0] : '';
    var h = new Date().getHours(), hello = h < 12 ? t('Good morning') : h < 19 ? t('Good afternoon') : t('Good evening');
    var mods = sites.reduce(function (a, x) { return a + ((x.modules || []).length); }, 0);
    var line = HERO_LINES[Math.floor(Date.now() / 36e5) % HERO_LINES.length];
    return '<section class="hero">' +
      '<svg class="hero-art" viewBox="0 0 260 150" aria-hidden="true">' +
        '<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round">' +
        '<rect x="18" y="38" width="70" height="98" rx="3"/><rect x="24" y="44" width="28" height="86" rx="2"/><rect x="54" y="44" width="28" height="86" rx="2"/>' +
        '<rect x="96" y="66" width="70" height="70" rx="3"/><rect x="102" y="72" width="58" height="18" rx="2"/><rect x="102" y="93" width="58" height="18" rx="2"/><rect x="102" y="114" width="58" height="16" rx="2"/>' +
        '<rect x="174" y="18" width="70" height="118" rx="3"/><path d="M180 24h58v52h-58zM180 82h58v48h-58zM180 50h58"/>' +
        '<path d="M8 138h246" stroke-width="3"/></g>' +
        '<g fill="currentColor"><circle cx="49" cy="88" r="2.4"/><circle cx="57" cy="88" r="2.4"/><rect x="124" y="80" width="14" height="2.6" rx="1.3"/><rect x="124" y="101" width="14" height="2.6" rx="1.3"/><rect x="124" y="121" width="14" height="2.6" rx="1.3"/></g>' +
      '</svg>' +
      '<div class="hero-txt"><p class="hero-k">' + esc(t('Welcome to PanelPro')) + '</p>' +
        '<h2>' + esc(hello) + (first ? ', <span>' + esc(first) + '</span>' : '') + '!</h2>' +
        '<p class="hero-line">' + esc(t(line)) + '</p>' +
        '<p class="hero-stats"><b>' + sites.length + '</b> ' + esc(sites.length === 1 ? t('project') : t('projects')) + ' · <b>' + mods + '</b> ' + esc(t('modules')) + '</p>' +
        '<div class="hero-acts"><button type="button" class="btn hero-go" id="heroNew">' + esc(t('Get started on a new project')) + ' <span aria-hidden="true">→</span></button>' +
        '<button type="button" class="btn hero-alt" id="heroOpen">' + esc(t('Open a project file')) + '</button></div></div></section>';
  }
  function avatarHtml(cloud) {
    var u = cloud && cloud.user ? cloud.user() : null;
    if (u && u.photoURL) { return '<img alt="" src="' + esc(u.photoURL) + '" referrerpolicy="no-referrer">'; }
    if (u) { return '<i>' + esc(String(u.displayName || u.email || '?').charAt(0).toUpperCase()) + '</i>'; }
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8.5" r="3.6"/><path d="M4.8 19.5c1.4-3.3 4-4.8 7.2-4.8s5.8 1.5 7.2 4.8"/></svg>';
  }
  function renderHome() {
    var cloud = window.PPCloud && window.PPCloud.on ? window.PPCloud : null;
    var recent = sites.slice().sort(function (a, b) { return a.updated < b.updated ? 1 : -1; }).slice(0, 8);
    show(
      '<header class="top"><h1>' + esc(t('Dashboard')) + (cloud && !desk() ? '<button type="button" class="space-chip" id="spaceBtn">' + esc(cloud.space().name) + ' ▾</button>' : '') + '</h1>' +
      (desk() ? '' : '<button type="button" class="text-btn" id="langBtn" aria-label="' + esc(t('Language')) + '">' + (lang === 'es' ? 'EN' : 'ES') + '</button>') +
      '<button type="button" class="avatar-btn" id="moreBtn" aria-label="' + esc(t('Account')) + '">' + avatarHtml(cloud) + '</button></header>' +
      '<div class="page page-wide dash">' + heroHtml(cloud) + (cloud ? cloud.invitesHtml() : '') +
      '<div class="dash-cards" id="dashCards">' + dashCards() + '</div>' +
      '<div class="dash-h"><h2>' + esc(t('Recent projects')) + '</h2><a href="#/projects">' + esc(t('All projects')) + ' ›</a></div>' +
      (recent.length ? '<div class="list dash-recent">' + recent.map(siteCardHtml).join('') + '</div>'
        : '<div class="empty"><h2>' + esc(t('No sites yet')) + '</h2><p>' + esc(t('Start one for the room you are measuring.')) + '</p></div>') +
      '</div>'
    );
    function wireCards() {
      $('#dAddMat').onclick = function () { if (window.PPMaterials && PPMaterials.newMaterial) { PPMaterials.newMaterial(); } else { go('#/materials'); } };
      $('#dCatalog').onclick = function () { go('#/catalog'); };
      $('#dAddHw').onclick = function () { go('#/hardware/new'); };
      var imgs = Array.prototype.slice.call(document.querySelectorAll('#dashCards img[data-pk]'));
      imgs.forEach(function (img) { var url = presetThumb(img.getAttribute('data-pk')); if (url) { img.src = url; } });
    }
    wireCards();
    wireSiteCards();
    $('#heroNew').onclick = function () { renderNewSite(); };
    $('#heroOpen').onclick = function () { pickFile(null); };
    if ($('#langBtn')) { $('#langBtn').onclick = function () { setLang(lang === 'es' ? 'en' : 'es'); route(); }; }
    if (cloud) { if ($('#spaceBtn')) { $('#spaceBtn').onclick = cloud.spaceMenu; } cloud.wireInvites(); }
    $('#moreBtn').onclick = function () {
      menu(cloud ? cloud.user().email : null, [
        cloud ? { label: cloud.t('Account') + ' · ' + cloud.planLine(), icon: 'user', run: function () { go('#/account'); } } : null,
        cloud ? { label: cloud.t('Companies'), icon: 'building', run: function () { go('#/companies'); } } : null,
        { label: t('All projects'), icon: 'file', run: function () { go('#/projects'); } },
        { label: t('Open a project file'), icon: 'file', run: function () { pickFile(null); } },
        { label: window.PPMaterials ? window.PPMaterials.t('Materials') : 'Materials', icon: 'materials', run: function () { go('#/materials'); } },
        { label: t('Accessories'), icon: 'materials', run: function () { go('#/hardware'); } },
        { label: t('Settings'), icon: 'settings', run: function () { go('#/settings'); } }
      ].filter(Boolean));
    };
    // the numbers of every project (not only the 8 shown), then the cards again
    fillStats(function () { var el = $('#dashCards'); if (el) { el.innerHTML = dashCards(); wireCards(); } }, true);
  }

  // ------------------------------------------------------------------ screens: hardware list
  // Your hardware (hinges, slides, pulls, legs…): name, type, brand / code, price, unit, photo.
  // The dashboard counts the hardware your projects use; a listed item shows its price and photo.
  var HW_KEY = 'panelpro.web.hardware.v1';
  var HW_TYPES = [['hinge', 'Hinge'], ['slide', 'Drawer slide'], ['pull', 'Pull / handle'], ['lift', 'Lift-up / flap fitting'], ['leg', 'Leg / plinth'], ['support', 'Shelf support'], ['rail', 'Hanging rail'], ['other', 'Other']];
  // group headings on the Accessories page, in this order
  var HW_GROUPS = { hinge: 'Hinges', slide: 'Drawer slides & systems', pull: 'Pulls & handles', lift: 'Lift-ups & flap stays', leg: 'Legs & plinth', support: 'Supports & brackets', rail: 'Wardrobe rails', other: 'Other' };
  // which kind of accessory a module's hardware line is (from its name)
  function hwTypeOf(name) {
    var n = String(name || '');
    if (/lift-up|flap stay|aventos|abatible/i.test(n)) { return 'lift'; }
    if (/hinge|bisagra/i.test(n)) { return 'hinge'; }
    if (/slide|runner|drawer set|gallery rail|corredera|gaveta/i.test(n)) { return 'slide'; }
    if (/pull|handle|jaladera|tirador/i.test(n)) { return 'pull'; }
    if (/\bleg\b|toe.?kick|pata|z[oó]calo/i.test(n)) { return 'leg'; }
    if (/wardrobe rail|hanging rail|tubo/i.test(n)) { return 'rail'; }
    if (/shelf pin|cleat|bracket|support|soporte/i.test(n)) { return 'support'; }
    return 'other';
  }
  var SVG0 = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">';
  var HW_ICONS = {
    // cup hinge: round cup, arm, mounting plate
    hinge: SVG0 + '<circle cx="6.5" cy="12" r="3.6"/><path d="M10 10.6h6.5M10 13.4h6.5"/><rect x="16.5" y="8" width="4.5" height="8" rx="1"/><circle cx="18.75" cy="10.2" r=".6"/><circle cx="18.75" cy="13.8" r=".6"/></svg>',
    plate: SVG0 + '<rect x="4" y="8" width="16" height="8" rx="1.6"/><circle cx="7.5" cy="12" r="1"/><circle cx="16.5" cy="12" r="1"/><path d="M10.5 12h3"/></svg>',
    // ball-bearing slide: two rails, balls between
    slide: SVG0 + '<path d="M2.5 8.5h19M2.5 15.5h15"/><circle cx="6" cy="12" r="1.3"/><circle cx="10" cy="12" r="1.3"/><circle cx="14" cy="12" r="1.3"/><path d="M17.5 13.5v4M21.5 6.5v4"/></svg>',
    // bar pull
    pull: SVG0 + '<path d="M3 10h18"/><path d="M6 10v4.5M18 10v4.5"/><rect x="4.8" y="14.5" width="2.4" height="3" rx=".6"/><rect x="16.8" y="14.5" width="2.4" height="3" rx=".6"/></svg>',
    // lift-up: cabinet top, door swung up, gas arm
    lift: SVG0 + '<path d="M3 20V9h14"/><path d="M17 9l4-5"/><path d="M5 18l9-6.5"/><circle cx="5" cy="18" r="1"/><circle cx="14" cy="11.5" r="1"/></svg>',
    // adjustable leg
    leg: SVG0 + '<rect x="6" y="3" width="12" height="3" rx="1"/><path d="M9.5 6v9M14.5 6v9"/><path d="M9.5 9h5M9.5 12h5"/><path d="M7.5 15h9l-1.5 4.5h-6z"/></svg>',
    // shelf pin
    support: SVG0 + '<path d="M3 6h7v12H3"/><circle cx="6.5" cy="12" r="1.4"/><path d="M10 10.5h6.5l3.5-2v7l-3.5-2H10"/></svg>',
    // wardrobe rail with two end supports
    rail: SVG0 + '<path d="M3 4v8M21 4v8"/><path d="M3 9h18"/><path d="M8 9c0 3 4 3 4 6.5a2 2 0 1 1-4 0"/></svg>',
    other: HW_ICON
  };
  function hwIcon(type, name) { return /mounting plate|base de bisagra/i.test(name || '') ? HW_ICONS.plate : (HW_ICONS[type] || HW_ICON); }
  var HW_UNITS = [['pc', 'piece'], ['pair', 'pair'], ['set', 'set'], ['m', 'metre']];
  var hwData = load(HW_KEY, { list: [] });
  function hwSave() { save(HW_KEY, hwData); }
  function hwKey(n) { return String(n || '').trim().toLowerCase(); }
  function hwFind(name) { var k = hwKey(name); return hwData.list.find(function (x) { return hwKey(x.name) === k; }) || null; }
  // the catalog item that supplies a hardware item the modules use (linked with "Used for")
  // the starter list (first run): the basics, no prices yet. "match" links an item to what the modules ask
  // for without picking it by hand (a hand link in "Used for" wins).
  var HW_SEED = [
    ['Full-extension slide, soft-close', 'slide', '', 'Bolas, extensión total, cierre suave', 'pair', 'ball-bearing slide pair, soft-close'],
    ['Full-extension slide, push to open', 'slide', '', 'Push to open', 'pair', ''],
    ['Full-extension slide, regular', 'slide', '', 'Bolas, extensión total', 'pair', ''],
    ['Concealed hinge, full overlay', 'hinge', '', 'Parche completo', 'pc', 'concealed hinge.*full-overlay|face-frame overlay'],
    ['Concealed hinge, half overlay', 'hinge', '', 'Medio parche', 'pc', 'concealed hinge.*half-overlay'],
    ['Concealed hinge, no overlay (inset)', 'hinge', '', 'Embutida', 'pc', 'concealed hinge.*inset'],
    ['T-bar pull', 'pull', '', 'Barra', 'pc', '^T-bar pull'],
    ['Face pull', 'pull', '', 'Botón / pomo', 'pc', ''],
    ['Edge pull', 'pull', '', 'Uñero', 'pc', '^Edge \\(wedge\\) pull'],
    ['Shelf pin', 'support', '', 'Soporte de entrepaño 5 mm', 'pc', '^Shelf pin'],
    ['MERIVOBOX M (91 mm)', 'slide', 'Blum', 'Caja metálica', 'set', 'MERIVOBOX drawer set, height M\\b'],
    ['MERIVOBOX E (192 mm)', 'slide', 'Blum', 'Caja metálica', 'set', 'MERIVOBOX drawer set, height E\\b']
  ];
  if (!hwData.seeded) {
    if (!hwData.list.length) {
      HW_SEED.forEach(function (r, i) {
        hwData.list.push({ id: 'seed' + i, name: t(r[0]), type: r[1], brand: r[2], kind: r[3], code: '', size: '', color: '', price: 0, unit: r[4], photo: '', for: '', match: r[5] });
      });
    }
    hwData.seeded = 1; hwSave();
  }
  function hwFor(id) {
    var it = hwData.list.find(function (x) { return x.for === id; });
    if (it) { return it; }
    // auto link, unless that need was linked by hand to another item
    return hwData.list.find(function (x) { if (!x.match) { return false; } try { return new RegExp(x.match, 'i').test(id); } catch (e) { return false; } }) || null;
  }
  function hwStamp() { return hwData.list.map(function (x) { return (x.for || '') + ':' + (x.price || 0); }).join(',').length + '-' + hwData.list.length; }
  // the hardware of a project, priced from the catalog (only linked items count)
  function hwCost(hw) {
    var c = 0;
    Object.keys(hw || {}).forEach(function (id) { var it = hwFor(id); if (it && it.price && Array.isArray(hw[id])) { c += it.price * hw[id][1]; } });
    return c;
  }
  function renderHwList() {
    var U0 = usage(), used = U0.hwAll;
    var list = hwData.list.slice().sort(function (a, b) { return a.name.localeCompare(b.name); });
    var typeL = function (k) { var x = HW_TYPES.find(function (y) { return y[0] === k; }); return t(x ? x[1] : 'Other'); };
    // one heading per kind (hinges, slides, pulls…), each with its own grid
    var grouped = function (items, typeOf, row) {
      return HW_TYPES.map(function (ty) {
        var g = items.filter(function (x) { return (typeOf(x) || 'other') === ty[0]; });
        return g.length ? '<h4 class="hw-grp">' + hwIcon(ty[0]) + '<span>' + esc(t(HW_GROUPS[ty[0]])) + '</span><small>' + g.length + '</small></h4><div class="list">' + g.map(row).join('') + '</div>' : '';
      }).join('');
    };
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(t('Accessories')) + '</h1></header>' +
      '<div class="page page-wide">' +
      (list.length ? grouped(list, function (h) { return h.type; }, function (h) {
        return '<button type="button" class="row-card hw-row" data-hw="' + esc(h.id) + '"><i class="dhw">' + (h.photo ? '<img alt="" src="' + esc(h.photo) + '">' : hwIcon(h.type, h.name)) + '</i>' +
          '<span class="grow"><span class="t1">' + esc(h.name) + '</span><span class="t2">' + esc([typeL(h.type), h.brand, h.kind, h.size ? h.size + (/^\d+$/.test(h.size) ? ' mm' : '') : '', h.color, h.code].filter(Boolean).join(' · ')) + '</span></span>' +
          '<b class="hw-price">' + (h.price ? esc(money(h.price)) + ' <small>/ ' + esc(t((HW_UNITS.find(function (u) { return u[0] === h.unit; }) || HW_UNITS[0])[1])) + '</small>' : '—') + '</b></button>';
      }) : '<div class="empty"><h2>' + esc(t('No hardware listed yet')) + '</h2><p>' + esc(t('Add the hinges, slides and pulls you buy, with their price.')) + '</p></div>') +
      (used.length ? '<h3 class="grp" style="margin-top:22px">' + esc(t('Used in your projects')) + '</h3><p class="meta-line">' + esc(t('Link each one to an item of your catalog: its price then goes into the project estimate.')) + '</p>' +
        grouped(used, function (x) { return hwTypeOf(x[0]); }, function (x) {
          var it = hwFor(x[0]), nm = U0.hwName[x[0]] || x[0];
          return '<div class="row-card hw-row"><i class="dhw">' + (it && it.photo ? '<img alt="" src="' + esc(it.photo) + '">' : hwIcon(hwTypeOf(x[0]), x[0])) + '</i><span class="grow"><span class="t1" title="' + esc(nm) + '">' + esc(nm) + '</span><span class="t2">' + x[1] + ' ' + esc(t('units')) +
            (it ? ' · ✓ ' + esc(it.name) + (it.price ? ' · ' + esc(money(it.price)) : '') : '') + '</span></span>' +
            (it ? '' : '<button type="button" class="btn small ghost" data-hwadd="' + esc(x[0]) + '">+ ' + esc(t('Add')) + '</button>') + '</div>';
        }) : '') +
      '</div><div class="dock"><button type="button" class="btn primary" id="hwNew">+ ' + esc(t('Quick add hardware')) + '</button></div>'
    );
    $('#back').onclick = function () { history.back(); };
    $('#hwNew').onclick = function () { go('#/hardware/new'); };
    // projects not counted yet: count them, then show what they use
    fillStats(function () { if (location.hash === '#/hardware') { renderHwList(); } }, true);
    screen.querySelectorAll('[data-hw]').forEach(function (b) { b.onclick = function () { go('#/hardware/' + encodeURIComponent(b.getAttribute('data-hw'))); }; });
    screen.querySelectorAll('[data-hwadd]').forEach(function (b) { b.onclick = function () { go('#/hardware/new?' + encodeURIComponent(b.getAttribute('data-hwadd'))); }; });
  }
  function renderHwEdit(id) {
    var preset = '', U0 = usage();
    if (/^new\?/.test(id)) { preset = decodeURIComponent(id.slice(4)); id = 'new'; }
    var presetName = preset ? (U0.hwName[preset] || preset) : '';
    var h = id === 'new' ? null : hwData.list.find(function (x) { return x.id === id; });
    if (id !== 'new' && !h) { return renderHwList(); }
    var v = h || { name: presetName, for: preset, type: hwTypeOf(preset || presetName), brand: '', code: '', price: 0, unit: /par|pair/i.test(presetName) ? 'pair' : 'pc', photo: '' };
    // "Used for": the hardware the modules ask for (from your projects); free items stay unlinked
    var forOpts = [['', t(v.match ? '— automatic (matching hardware)' : '— (not linked)')]].concat(U0.hwAll.map(function (x) { return [x[0], U0.hwName[x[0]] || x[0]]; }));
    if (v.for && !forOpts.some(function (o) { return o[0] === v.for; })) { forOpts.push([v.for, v.for]); }
    var opt = function (list, cur) { return list.map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === cur ? ' selected' : '') + '>' + esc(t(o[1])) + '</option>'; }).join(''); };
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(h ? h.name : t('New hardware')) + '</h1></header>' +
      '<div class="page">' +
      '<div class="hw-photo"><button type="button" id="hwPic" class="dhw big">' + (v.photo ? '<img alt="" src="' + esc(v.photo) + '">' : hwIcon(v.type, v.name)) + '</button><small>' + esc(t('Photo (optional)')) + '</small><input type="file" accept="image/*" id="hwFile" hidden></div>' +
      '<label class="field"><span>' + esc(t('Name')) + '</span><input class="text-in" id="hwName" value="' + esc(v.name) + '" placeholder="Bisagra cazoleta 110° cierre suave"></label>' +
      '<label class="field"><span>' + esc(t('Type')) + '</span><select class="sel" id="hwType">' + opt(HW_TYPES, v.type) + '</select></label>' +
      '<label class="field"><span>' + esc(t('Used for (what the modules ask for)')) + '</span><select class="sel" id="hwFor">' + forOpts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === (v.for || '') ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join('') + '</select></label>' +
      '<label class="field"><span>' + esc(t('Brand')) + '</span><input class="text-in" id="hwBrand" list="hwBrands" value="' + esc(v.brand || '') + '" placeholder="Blum, Hettich, Grass…"></label>' +
      '<datalist id="hwBrands">' + ['Blum', 'Hettich', 'Grass', 'Salice', 'Häfele', 'Hafele', 'Accuride', 'King Slide', 'Emuca', 'FGV', 'Herrajes Hobi'].map(function (b) { return '<option value="' + b + '">'; }).join('') + '</datalist>' +
      // per type: hinges — type; slides — type and length; pulls — type, size and colour
      '<label class="field hwx" data-for="hinge slide pull lift leg support rail other"><span id="hwKindL"></span><input class="text-in" id="hwKind" list="hwKinds" value="' + esc(v.kind || '') + '"></label><datalist id="hwKinds"></datalist>' +
      '<label class="field hwx" data-for="slide pull leg rail"><span id="hwSizeL"></span><input class="text-in" id="hwSize" value="' + esc(v.size || '') + '"></label>' +
      '<label class="field hwx" data-for="pull hinge leg rail"><span>' + esc(t('Colour / finish')) + '</span><input class="text-in" id="hwColor" list="hwColors" value="' + esc(v.color || '') + '"></label>' +
      '<datalist id="hwColors">' + ['Negro mate', 'Acero inoxidable', 'Aluminio', 'Níquel', 'Oro cepillado', 'Blanco', 'Bronce'].map(function (c) { return '<option value="' + c + '">'; }).join('') + '</datalist>' +
      '<label class="field"><span>' + esc(t('Code')) + '</span><input class="text-in" id="hwCode" value="' + esc(v.code || '') + '"></label>' +
      '<div class="two-col"><label class="field"><span>' + esc(t('Price')) + ' (' + esc((prefs.opt && prefs.opt.currency) || '') + ')</span><input class="text-in" id="hwPrice" inputmode="decimal" value="' + (v.price || '') + '"></label>' +
      '<label class="field"><span>' + esc(t('Per')) + '</span><select class="sel" id="hwUnit">' + opt(HW_UNITS, v.unit) + '</select></label></div>' +
      (h ? '<button type="button" class="btn ghost danger" id="hwDel" style="margin-top:14px">' + esc(t('Delete')) + '</button>' : '') +
      '</div><div class="dock"><button type="button" class="btn primary" id="hwSave">' + esc(t('Save')) + '</button></div>'
    );
    var photo = v.photo || '';
    var KINDS = {
      hinge: ['Cazoleta 35 mm, 110°', 'Cazoleta 35 mm, 165°', 'Cierre suave (BLUMOTION)', 'Parche completo', 'Medio parche', 'Embutida', 'Para puerta de aluminio'],
      slide: ['Bolas, extensión total', 'Bolas, extensión total, cierre suave', 'Oculta (undermount), cierre suave', 'Caja metálica (MERIVOBOX, InnoTech…)', 'Push to open'],
      pull: ['Barra', 'Botón / pomo', 'Perfil de aluminio', 'Gola', 'Uñero', 'Push to open'],
      leg: ['Pata regulable 100 mm', 'Pata regulable 150 mm', 'Zócalo PVC'], support: ['Soporte de entrepaño 5 mm', 'Soporte con seguro'], rail: ['Tubo ovalado', 'Tubo redondo 25 mm', 'Tubo abatible'], lift: ['Pistón a gas', 'Compás de tapa, cierre suave', 'Abatible (AVENTOS HK / HF / HL)'], other: []
    };
    var KIND_L = { lift: 'Type', hinge: 'Hinge type', slide: 'Slide type', pull: 'Pull type', leg: 'Type', support: 'Type', rail: 'Type', other: 'Type / model' };
    var SIZE_L = { slide: 'Length (mm)', pull: 'Size / hole centres (mm)', leg: 'Height (mm)', rail: 'Length (mm)' };
    function typeFields() {
      var ty = $('#hwType').value;
      screen.querySelectorAll('.hwx').forEach(function (f) { f.hidden = f.getAttribute('data-for').split(' ').indexOf(ty) < 0; });
      $('#hwKindL').textContent = t(KIND_L[ty] || 'Type / model');
      $('#hwSizeL').textContent = t(SIZE_L[ty] || 'Size');
      $('#hwKinds').innerHTML = (KINDS[ty] || []).map(function (k) { return '<option value="' + esc(k) + '">'; }).join('');
    }
    $('#hwType').onchange = function () { typeFields(); var du = { slide: 'pair', rail: 'm' }[$('#hwType').value]; if (!v.price) { $('#hwUnit').value = du || 'pc'; } };
    typeFields();
    $('#back').onclick = function () { history.back(); };
    $('#hwPic').onclick = function () { $('#hwFile').click(); };
    $('#hwFile').onchange = function () {
      var f = this.files && this.files[0];
      if (!f) { return; }
      var img = new Image(), url = URL.createObjectURL(f);
      img.onload = function () {
        var c = document.createElement('canvas'), k = Math.min(1, 256 / Math.max(img.width, img.height));
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        photo = c.toDataURL('image/jpeg', 0.82);
        $('#hwPic').innerHTML = '<img alt="" src="' + photo + '">';
        URL.revokeObjectURL(url);
      };
      img.src = url;
    };
    if (!h) { setTimeout(function () { $('#hwName').focus(); }, 50); }
    $('#hwSave').onclick = function () {
      var name = $('#hwName').value.trim();
      if (!name) { toast(t('Enter a name')); return; }
      var rec = h || { id: uid() };
      rec.name = name; rec.type = $('#hwType').value; rec.brand = $('#hwBrand').value.trim(); rec.code = $('#hwCode').value.trim();
      rec.price = parseFloat(String($('#hwPrice').value).replace(/,/g, '')) || 0; rec.unit = $('#hwUnit').value; rec.photo = photo;
      rec.for = $('#hwFor').value || '';
      ['kind', 'size', 'color'].forEach(function (k) { var el = $('#hw' + k[0].toUpperCase() + k.slice(1)); rec[k] = el && !el.closest('.hwx').hidden ? el.value.trim() : ''; });
      if (rec.for) { hwData.list.forEach(function (x) { if (x !== rec && x.for === rec.for) { x.for = ''; } }); }   // one catalog item per hardware need
      if (!h) { hwData.list.push(rec); }
      hwSave(); toast(t('Saved'));
      go('#/hardware', true);
    };
    if ($('#hwDel')) {
      $('#hwDel').onclick = function () {
        ask({ title: t('Delete') + ' ' + h.name + '?', ok: t('Delete'), danger: true }).then(function (ok) {
          if (ok) { hwData.list = hwData.list.filter(function (x) { return x !== h; }); hwSave(); go('#/hardware', true); }
        });
      };
    }
  }

  // The app's own "are you sure?" box (instead of the browser's): Promise of true / false.
  // o: { title, text, ok (button label), danger (red button), cancel }
  function ask(o) {
    o = typeof o === 'string' ? { title: o } : (o || {});
    return new Promise(function (done) {
      var m = document.createElement('div'), prev = document.activeElement;
      m.className = 'ask';
      m.innerHTML = '<div class="ask-box" role="alertdialog" aria-modal="true" aria-labelledby="askT">' +
        (o.danger ? '<div class="ask-ico danger">' + menuIcon('trash') + '</div>' : '') +
        '<h2 id="askT">' + esc(o.title || t('Are you sure?')) + '</h2>' + (o.text ? '<p>' + esc(o.text) + '</p>' : '') +
        '<div class="ask-btns"><button type="button" class="btn" data-a="0">' + esc(o.cancel || t('Cancel')) + '</button>' +
        '<button type="button" class="btn ' + (o.danger ? 'danger' : 'primary') + '" data-a="1">' + esc(o.ok || t('OK')) + '</button></div></div>';
      document.body.appendChild(m);
      requestAnimationFrame(function () { m.classList.add('on'); });
      var go1 = m.querySelector('[data-a="1"]');
      go1.focus();
      function close(v) {
        document.removeEventListener('keydown', key, true);
        m.classList.remove('on');
        setTimeout(function () { m.remove(); }, 160);
        if (prev && prev.focus) { try { prev.focus(); } catch (e) { /* */ } }
        done(v);
      }
      function key(e) {
        if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(false); }
        else if (e.key === 'Enter') { e.preventDefault(); e.stopPropagation(); close(true); }
        else if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === go1 ? m.querySelector('[data-a="0"]') : go1).focus(); }
      }
      document.addEventListener('keydown', key, true);
      m.addEventListener('mousedown', function (e) { if (e.target === m) { close(false); } });
      m.querySelectorAll('[data-a]').forEach(function (b) { b.onclick = function () { close(b.getAttribute('data-a') === '1'); }; });
    });
  }
  // Delete a project (after asking); then(): what to show next
  function deleteSite(s, then) {
    if (!s) { return; }
    ask({ title: t('Delete this site and its modules?'), text: s.name, ok: t('Delete'), danger: true }).then(function (ok) {
      if (!ok) { return; }
      sites = sites.filter(function (x) { return x !== s; }); persist(); toast(t('Deleted'));
      if (then) { then(); }
    });
  }
  // the project list's row buttons: icons, with their name shown on hover
  function rowBtns(s) {
    return '<span class="rowbtns"><button type="button" class="icon-btn dupbtn" data-dup="' + esc(s.id) + '" aria-label="' + esc(t('Duplicate')) + '" data-tip="' + esc(t('Duplicate')) + '">' + menuIcon('copy') + '</button>' +
      '<button type="button" class="icon-btn delbtn" data-del="' + esc(s.id) + '" aria-label="' + esc(t('Delete site')) + '" data-tip="' + esc(t('Delete site')) + '">' + menuIcon('trash') + '</button></span>';
  }
  // "Duplicate": a copy of the project with new ids (same modules, codes and notes)
  function duplicateSite(s) {
    var c = clone(s);
    c.id = uid(); c.name = s.name + ' (' + t('copy') + ')'; c.created = now(); c.updated = now();
    c.modules.forEach(function (m) { m.id = uid(); });
    delete c.cloud; delete c.remote; delete c.shared;
    sites.push(c); persist();
    toast(t('Project duplicated.'));
    route();
  }

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
      (sites.length ? '<table class="dk-table"><thead><tr><th class="th-pic"></th>' + th('name', DT('Name') + ' · ' + DT('Client')) +
          '<th class="th-plain">' + esc(t('Totals')) + '</th>' + th('updated', DT('Updated'), 'n') + '<th></th></tr></thead><tbody>' +
          (list.length ? list.map(function (s) {
            return '<tr data-site="' + esc(s.id) + '" tabindex="0"><td class="td-pic"><img alt="" data-sthumb="' + esc(s.id) + '"></td>' +
              '<td class="td-name"><b>' + esc(s.name) + '</b>' + (s.client ? '<small class="cli">' + esc(s.client) + '</small>' : '') + '</td>' +
              '<td>' + statsHtml(s) + '</td><td class="n">' + esc(new Date(s.updated).toLocaleDateString(lang)) + '</td>' +
              '<td class="n">' + rowBtns(s) + '</td></tr>';
          }).join('') : '<tr><td colspan="5" class="muted">' + esc(DT('No projects match.')) + '</td></tr>') + '</tbody></table>'
        : '<div class="empty"><h2>' + esc(t('No sites yet')) + '</h2><p>' + esc(t('Start one for the room you are measuring.')) + '</p></div>') +
      '<p class="meta-line" style="margin-top:20px">PanelPro Web ' + esc(VERSION) + ' · ' + esc(t('Engine')) + ' ' + esc(Engine.version || '') + '</p>' +
      '</div><div class="dock"><button type="button" class="btn primary" id="newSite">+ ' + esc(t('New site')) + '</button></div>'
    );
    if (cloud) { cloud.wireInvites(); }
    screen.querySelectorAll('tr[data-site]').forEach(function (r) {
      var open = function () { go('#/site/' + encodeURIComponent(r.getAttribute('data-site'))); };
      r.onclick = function (e) { if (e.target.closest('[data-dup],[data-del]')) { return; } open(); };
      r.onkeydown = function (e) { if (e.key === 'Enter') { open(); } };
    });
    screen.querySelectorAll('[data-dup]').forEach(function (b) { b.onclick = function () { duplicateSite(site(b.getAttribute('data-dup'))); }; });
    screen.querySelectorAll('[data-del]').forEach(function (b) { b.onclick = function () { deleteSite(site(b.getAttribute('data-del')), function () { route(); }); }; });
    setTimeout(fillStats, 200);
    screen.querySelectorAll('[data-sort]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-sort');
        deskSort = { k: k, d: deskSort.k === k ? -deskSort.d : (k === 'updated' || k === 'modules' ? -1 : 1) };
        save('panelpro.web.sort', deskSort); renderSitesDesk(cloud);
      };
    });
    var qi = $('#dkQ');
    qi.oninput = function () { deskQuery = qi.value; var pos = qi.selectionStart; renderSitesDesk(cloud); var n = $('#dkQ'); n.focus(); n.setSelectionRange(pos, pos); };
    $('#newSite').onclick = function () { renderNewSite(); };
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
      '<header class="top"><button type="button" class="icon-btn" id="homeBack" aria-label="' + esc(t('Dashboard')) + '">‹</button><h1>' + esc(t('Sites')) + (cloud ? '<button type="button" class="space-chip" id="spaceBtn">' + esc(cloud.space().name) + ' ▾</button>' : '') + '</h1>' +
      '<button type="button" class="text-btn" id="langBtn" aria-label="' + esc(t('Language')) + '">' + (lang === 'es' ? 'EN' : 'ES') + '</button>' +
      '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(t('More')) + '">⋯</button></header>' +
      '<div class="page page-wide">' + (cloud ? cloud.invitesHtml() : '') +
      (list.length ? '<div class="list">' + list.map(function (s) {
        var n = s.modules.length;
        return siteCardHtml(s);
      }).join('') + '</div>'
        : '<div class="empty"><h2>' + esc(t('No sites yet')) + '</h2><p>' + esc(t('Start one for the room you are measuring.')) + '</p></div>') +
      '<p class="meta-line" style="margin-top:28px;text-align:center">PanelPro Web ' + esc(VERSION) + ' · ' + esc(t('Engine')) + ' ' + esc(Engine.version || '') + '</p>' +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="newSite">' + esc(t('New site')) + '</button></div>'
    );
    wireSiteCards();
    setTimeout(fillStats, 200);
    $('#homeBack').onclick = function () { go('#/'); };
    $('#newSite').onclick = function () { renderNewSite(); };
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

  // New site / Rename site: a dialog over the current screen (✕, click outside or Esc closes it).
  function renderNewSite(s) {
    var editing = !!s, prev = document.activeElement;
    var m = document.createElement('div');
    m.className = 'ask site-ask';
    m.innerHTML = '<form class="ask-box site-box" role="dialog" aria-modal="true" aria-labelledby="siteT" novalidate>' +
      '<button type="button" class="site-x" aria-label="' + esc(t('Close')) + '">✕</button>' +
      (editing ? '' : '<div class="site-ico" aria-hidden="true">+</div>') +
      '<h2 id="siteT">' + esc(editing ? t('Rename site') : t('New site')) + '</h2>' +
      '<label class="field"><span>' + esc(t('Site name')) + '</span><input class="text-in" id="sName" autocomplete="off" value="' + esc(s ? s.name : '') + '" placeholder="Kitchen, 12 Ocean Drive"></label>' +
      '<label class="field"><span>' + esc(t('Client')) + '</span><input class="text-in" id="sClient" autocomplete="off" value="' + esc(s ? s.client : '') + '"></label>' +
      '<label class="field"><span>' + esc(t('Notes')) + '</span><input class="text-in" id="sNotes" autocomplete="off" value="' + esc(s ? s.notes : '') + '"></label>' +
      '<div class="ask-btns"><button type="button" class="btn" data-a="0">' + esc(t('Cancel')) + '</button>' +
      '<button type="submit" class="btn primary">' + esc(editing ? t('Save changes') : t('Create site')) + '</button></div></form>';
    document.body.appendChild(m);
    requestAnimationFrame(function () { m.classList.add('on'); });
    var name = m.querySelector('#sName');
    setTimeout(function () { name.focus(); if (editing) { name.select(); } }, 60);
    function close() {
      document.removeEventListener('keydown', key, true);
      m.classList.remove('on');
      setTimeout(function () { m.remove(); }, 160);
      if (prev && prev.focus && prev.isConnected) { try { prev.focus(); } catch (e) { /* */ } }
    }
    function key(e) { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); } }
    document.addEventListener('keydown', key, true);
    m.addEventListener('mousedown', function (e) { if (e.target === m) { close(); } });
    m.querySelector('.site-x').onclick = close;
    m.querySelector('[data-a="0"]').onclick = close;
    m.querySelector('form').onsubmit = function (e) {
      e.preventDefault();
      var nm = name.value.trim() || (t('Site') + ' ' + (sites.length + 1));
      var client = m.querySelector('#sClient').value.trim(), notes = m.querySelector('#sNotes').value.trim();
      close();
      if (editing) {
        s.name = nm; s.client = client; s.notes = notes; touch(s); persist();
        route();
        return;
      }
      var ns = { id: uid(), name: nm, client: client, notes: notes,
                 created: now(), updated: now(), next_order: 1, codes_state: null, modules: [] };
      sites.push(ns); persist();
      go('#/site/' + encodeURIComponent(ns.id));
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
        var to = '#/site/' + encodeURIComponent(s.id) + '/m/' + encodeURIComponent(b.getAttribute('data-wsmod'));
        if (E && E.dirty && (E.mod || E.presetKey)) {
          ask({ title: t('Discard your changes?'), ok: t('Discard'), danger: true }).then(function (ok) { if (ok) { E = null; go(to); } });
          return;
        }
        E = null;
        go(to);
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
    $('#back').onclick = function () { go('#/projects'); };
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
      // project tools: icon tiles with a one-line label (the full name on hover / for screen readers)
      '<div class="tool-tiles">' + [['compBtn', 'layout', 'Composition', 'Composition'], ['cutBtn', 'cut', lang === 'es' ? 'Corte' : 'Cut list', 'Cut list'],
        ['galBtn', 'camera', 'Renders', 'Renders'], ['shareBtn', 'share', 'Share', 'Share project file']].map(function (b) {
        return '<button type="button" class="tool-tile" id="' + b[0] + '" title="' + esc(t(b[3])) + '" aria-label="' + esc(t(b[3])) + '">' +
          menuIcon(b[1]) + '<span>' + esc(t(b[2])) + '</span></button>';
      }).join('') + '</div>'
        : '<div class="empty"><h2>' + esc(t('No modules yet')) + '</h2><p>' + esc(t('Add the first module for this site.')) + '</p></div>') +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="addMod">' + esc(t('Add module')) + '</button></div>'
    );
    $('#back').onclick = function () { go('#/projects'); };
    $('#addMod').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/pick'); };
    if ($('#cutBtn')) { $('#cutBtn').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/cut'); }; }
    if ($('#compBtn')) { $('#compBtn').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/compose'); }; }
    if ($('#galBtn')) { $('#galBtn').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/renders'); }; }
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
        { label: t('Project manual'), icon: 'doc', run: function () { makeManual(s); } },
        { label: t('Share project file'), icon: 'share', run: function () { shareSite(s); } },
        { label: t('Rename site'), icon: 'edit', run: function () { renderNewSite(s); } },
        window.PPCloud && window.PPCloud.on && (window.PPCloud.hasCompanies() || window.PPCloud.space().kind === 'company') ? { label: window.PPCloud.t('Move to a company…'), icon: 'move', run: function () { window.PPCloud.moveSite(s); } } : null,
        { label: t('Delete site'), icon: 'trash', danger: true, run: function () { deleteSite(s, function () { go('#/projects', true); }); } }
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
  // The module picker: one accordion section per category (only one open at a time; the last one
  // used opens again). Pictures are drawn only for the open section.
  function renderPick(s) {
    var cats = [];
    info.presets.forEach(function (p) { if (cats.indexOf(p.category) < 0) { cats.push(p.category); } });
    var mine = Engine.call('presets_list', { book: prefs.book });
    function card(key, nm, dims) {
      return '<button type="button" class="mcard" data-key="' + esc(key) + '"><img class="pic wait" alt="" data-pk="' + esc(key) + '">' +
        '<span class="nm">' + esc(nm) + '</span><span class="sz">' + esc(dims || '') + '</span></button>';
    }
    function section(id, title, n, inner) {
      return '<section class="acc" data-acc="' + esc(id) + '"><button type="button" class="acc-h" data-acch="' + esc(id) + '" aria-expanded="false">' +
        '<span class="acc-t">' + esc(title) + '</span><small class="acc-n">' + n + '</small><i class="acc-i">›</i></button>' +
        '<div class="acc-b"><div class="acc-in"><div class="cards">' + inner + '</div></div></div></section>';
    }
    var html = '';
    if (mine.length) {
      var mc = [];
      mine.forEach(function (p) { if (mc.indexOf(p.category) < 0) { mc.push(p.category); } });
      mc.forEach(function (c) {
        var list = mine.filter(function (p) { return p.category === c; });
        html += section('mine:' + c, t('My presets') + ' — ' + t(c), list.length, list.map(function (p) {
          var pp = prefs.book[p.key] || {};
          return card('user:' + p.key, p.label, pp.width ? dimsOf(pp) : '');
        }).join(''));
      });
    }
    var G = window.PPCloud && window.PPCloud.on ? window.PPCloud : null;
    if (G) { html += section('gallery', G.t('Public gallery'), '…', '<p class="meta-line">…</p>').replace('<div class="cards">', '<div class="cards" id="galCards">'); }
    html += cats.map(function (c) {
      var list = info.presets.filter(function (p) { return p.category === c; });
      return section('cat:' + c, t(c), list.length, list.map(function (p) {
        var full = t(p.label), nm = full.indexOf(' — ') > 0 ? full.split(' — ').slice(1).join(' — ') : full;
        return card(p.key, nm, p.pp ? dimsOf(p.pp) : '');
      }).join(''));
    }).join('');
    show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(t('Back')) + '">‹</button><h1>' + esc(s ? t('Pick a module') : t('Module catalog')) + '</h1></header>' +
      '<div class="page page-wide picker">' + html + '</div>'
    );
    // pictures of the open section, one at a time (keeps the phone responsive)
    var drawQ = [];
    function drawPics(sec) {
      drawQ = Array.prototype.slice.call(sec.querySelectorAll('img.wait[data-pk]'));
      (function next() {
        var img = drawQ.shift();
        if (!img || !img.isConnected) { return; }
        var url = presetThumb(img.getAttribute('data-pk'));
        if (url) { img.src = url; img.classList.remove('wait'); }
        setTimeout(next, 0);
      })();
    }
    function openSec(id, scroll) {
      screen.querySelectorAll('.acc').forEach(function (sec) {
        var on = sec.getAttribute('data-acc') === id;
        sec.classList.toggle('open', on);
        sec.querySelector('.acc-h').setAttribute('aria-expanded', String(on));
        if (on) {
          drawPics(sec);
          if (scroll) { setTimeout(function () { var r = sec.getBoundingClientRect(); window.scrollTo({ top: window.scrollY + r.top - 64, behavior: 'smooth' }); }, 280); }
        }
      });
      save('panelpro.web.pickOpen', id || '');
    }
    screen.querySelectorAll('[data-acch]').forEach(function (h) {
      h.onclick = function () {
        if (h.disabled) { return; }
        var id = h.getAttribute('data-acch');
        openSec(h.parentNode.classList.contains('open') ? null : id, true);
      };
    });
    var last = load('panelpro.web.pickOpen', '');
    if (last && screen.querySelector('[data-acc="' + last.replace(/"/g, '\\"') + '"]')) { openSec(last, false); }
    if (G) {
      (G.gallery.cached('modules') ? Promise.resolve(G.gallery.cached('modules')) : G.gallery.load('modules')).then(function (list) {
        var el = $('#galCards'); if (!el) { return; }
        var sec = el.closest('.acc'), hd = sec.querySelector('.acc-h');
        sec.querySelector('.acc-n').textContent = list.length ? String(list.length) : G.t('Nothing shared yet.');
        if (!list.length) { hd.disabled = true; sec.classList.add('empty'); sec.classList.remove('open'); return; }
        el.innerHTML = list.map(function (g) {
          return '<div class="mcard gcard"><button type="button" class="gpick" data-gal="' + esc(g.id) + '"><img class="pic" alt="" loading="lazy" src="' + esc(g.thumb || '') + '">' +
            '<span class="nm">' + (g.official ? '<b class="badge">' + esc(G.t('Official')) + '</b> ' : '') + esc(g.name) + '</span>' +
            '<span class="sz">' + esc(G.t('Shared by: ') + (g.author && g.author.name || '')) + '</span></button>' +
            (G.gallery.admin('modules', g, function () { renderPick(s); }) ? '<button type="button" class="gmore" data-gmore="' + esc(g.id) + '" aria-label="⋯">⋯</button>' : '') + '</div>';
        }).join('');
        el.querySelectorAll('[data-gal]').forEach(function (b) {
          b.onclick = function () { if (!s) { toast(t('Open a project first')); return; } go('#/site/' + encodeURIComponent(s.id) + '/new/' + encodeURIComponent('gal:' + b.getAttribute('data-gal'))); };
        });
        el.querySelectorAll('[data-gmore]').forEach(function (b) {
          b.onclick = function () { var g = list.find(function (x) { return x.id === b.getAttribute('data-gmore'); }); G.gallery.admin('modules', g, function () { renderPick(s); })(); };
        });
      }, function () { var el = $('#galCards'); if (el) { el.closest('.acc').remove(); } });
    }
    $('#back').onclick = function () { history.back(); };
    screen.querySelectorAll('[data-key]').forEach(function (b) {
      b.onclick = function () {
        var key = b.getAttribute('data-key');
        if (s) { go('#/site/' + encodeURIComponent(s.id) + '/new/' + encodeURIComponent(key)); return; }
        // the catalog on its own (dashboard): which project does it go into?
        var recent = sites.slice().sort(function (a, c) { return a.updated < c.updated ? 1 : -1; }).slice(0, 8);
        menu(t('Add to which project?'), recent.map(function (x) {
          return { label: x.name + (x.client ? ' · ' + x.client : ''), icon: 'file', run: function () { go('#/site/' + encodeURIComponent(x.id) + '/new/' + encodeURIComponent(key)); } };
        }).concat([{ label: '+ ' + t('New site'), icon: 'file', run: function () { renderNewSite(); } }]));
      };
    });
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
      // a new module goes step by step through the tabs (Save & next); an edited one saves in place
      E = { site: s, mod: mod, presetKey: mod ? mod.preset || null : presetKey, params: params, dirty: !mod, changed: {}, wizard: !mod };
      E.hist = [JSON.stringify(params)]; E.hi = 0;   // undo / redo (Ctrl+Z, Ctrl+Shift+Z / Ctrl+Y, the ↶ ↷ buttons)
      if (!mod) { editTab = 'box'; }
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
      '<span class="view-hint" id="viewHint"></span><div class="dimchips" id="dimChips"></div>' +
      '<div class="side-bar" id="sideBar" role="tablist">' + SIDES.map(function (k) { return '<button type="button" data-side="' + k + '">' + esc(sideLabel(k)) + '</button>'; }).join('') + '</div>' +
      '<div class="view-tools"><button type="button" id="dimBtn" class="vt vt-txt" data-label="2D / 3D" aria-label="2D / 3D">' + (view.mode === '3d' ? '2D' : '3D') + '</button>' +
      vtBtn('dimsBtn', 'sizes', t('Sizes'), ' aria-pressed="' + dimsShown() + '"') + vtBtn('viewBtn', 'view', t('View')) +
      vtBtn('openAll', 'open', t('Open all'), ' aria-pressed="false"') + diagBtn() + vtBtn('manualV', 'doc', t('Module manual')) + vtBtn('undoV', 'undo', t('Undo') + ' (Ctrl+Z)') + vtBtn('redoV', 'redo', t('Redo') + ' (Ctrl+Shift+Z)') + vtBtn('renderV', 'render', t('Render (AI)')) + vtBtn('fitBtn', 'fit', t('Fit')) + '</div></div>' +
      '<div class="edit-side"><div class="page" id="editBody"></div>' +
      '<div class="dock"><span class="steps" id="steps"></span><button type="button" class="btn primary" id="saveMod">' + esc(mod ? t('Save') : t('Add to site')) + '</button></div></div>' +
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
      if (E.dirty && E.mod && !this.asked) {
        var me = this;
        ask({ title: t('Discard your changes?'), ok: t('Discard'), danger: true }).then(function (ok) { if (ok) { me.asked = true; me.click(); me.asked = false; } });
        return;
      }
      if (E.mod && !mod) { var sid = s.id; E = null; go('#/site/' + encodeURIComponent(sid), true); return; }   // a new module, saved step by step
      E = null;
      if (desk()) { go(mod ? '#/' : '#/site/' + encodeURIComponent(s.id)); } else { history.back(); }
    };
    $('#dimBtn').onclick = function () { setViewMode(view.mode === '3d' ? '2d' : '3d'); };
    $('#fitBtn').onclick = function () { if (has3d && view.mode === '3d') { P3D.zoomExtents(); } };
    wireDiag();
    $('#manualV').onclick = function () { makeManual(s, { id: mod ? mod.id : '__new', params: E.params }); };
    $('#undoV').onclick = function () { histGo(-1); };
    $('#redoV').onclick = function () { histGo(1); };
    undoState();
    $('#renderV').onclick = function () { if (view.mode !== '3d') { setViewMode('3d'); } openRender(s, (E.params.name || t('Module')) + ' · ' + s.name, [E.params], function () {
      var b = E.res && E.res.bbox;
      return b ? { w: b[1][0] - b[0][0], h: b[1][2] - b[0][2], d: b[1][1] - b[0][1] } : { w: E.params.width, h: E.params.height, d: E.params.depth };
    }); };
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
    if (mod) { items.unshift({ label: t('Manual for this module'), icon: 'doc', run: function () { makeManual(s, { id: mod.id, params: E.params }); } }); }
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
        ask({ title: t('Delete this module?'), text: E.params.name || '', ok: t('Delete'), danger: true }).then(function (ok) {
          if (!ok) { return; }
          s.modules = s.modules.filter(function (x) { return x !== mod; }); if (window.PPCompose) { window.PPCompose.refresh(s); } touch(s); persist();
          E = null; toast(t('Deleted')); go('#/site/' + encodeURIComponent(s.id), true);
        });
      } });
    }
    menu(title, items);
  }

  var CATS = ['Kitchen', 'Closet', 'Bath', 'Furniture', 'Bed', 'Other'];
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

  // 2D view: which side (front / right / back / left / top), drawn like the module manual
  var SIDES = ['front', 'right', 'back', 'left', 'top'];
  var SIDE_L = { front: ['Front', 'Frente'], right: ['Right', 'Derecha'], back: ['Back', 'Atrás'], left: ['Left', 'Izquierda'], top: ['Top', 'Arriba'] };
  function sideLabel(k) { return SIDE_L[k][lang === 'es' ? 1 : 0]; }
  function setViewMode(mode, quiet) {
    view.mode = has3d ? mode : '2d'; saveView();
    var host = $('#v3d');
    if (!host) { return; }
    host.classList.toggle('is2d', view.mode === '2d');
    $('#dimBtn').textContent = view.mode === '3d' ? '2D' : '3D';
    $('#dimBtn').hidden = !has3d;
    var vh = $('#viewHint');
    vh.classList.remove('gone'); clearTimeout(hintT); hintT = setTimeout(function () { vh.classList.add('gone'); }, 4000);
    var sb = $('#sideBar');
    if (sb) {
      sb.hidden = view.mode !== '2d';
      sb.querySelectorAll('[data-side]').forEach(function (b) {
        b.setAttribute('aria-pressed', String((view.side || 'front') === b.getAttribute('data-side')));
        b.onclick = function () { view.side = b.getAttribute('data-side'); saveView(); setViewMode('2d', true); };
      });
    }
    vh.textContent = view.mode === '2d' ? sideLabel(view.side || 'front') : t(finePointer() ? 'Drag to turn · scroll to zoom · click a door · right-click a panel for its material' : 'Drag to turn · pinch to zoom · tap a door · hold a panel for its material');
    if (view.mode === '3d') { P3D.resize(); }
    draw3d(!quiet || true);
  }

  // a bed: floor clearance and side-rail height, the frame, and the height with the mattress
  function bedHeights(r) {
    var b = r && r.bed;
    if (!b) { return null; }
    var out = [];
    if (b.clear > 0) { out.push([0, b.clear, 1]); }
    out.push([b.clear, b.top, 1]);
    out.push([0, b.top, 2]);
    if (E.params && E.params.bed_mattress) { out.push([0, b.height, 3]); }
    if (b.headboard) { out.push([0, b.headboard[2], 4]); }   // the headboard
    return out;
  }
  // the rows' heights as a second dimension line (floor → top: base, each row, top panels)
  function rowHeights(r) {
    return r && r.row_dims ? r.row_dims.map(function (z) { return [z[0], z[1], 1]; }) : null;
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
      var e = (window.PPManual && window.PPManual.sideView && parts.length ?
        window.PPManual.sideView(parts, view.side || 'front', { t: t, show: L, esc: esc }, { params: E.params, bed: r.bed }) : null) ||
        window.PPReports.elevation(parts.length ? parts : [{ shape: 'prism', axis: 'y', pos: 0, thk: 1, pts: [[0, 0], [1, 0], [1, 1], [0, 1]], role: 'carcass' }]);
      var svg = $('#elev');
      if (svg) { svg.setAttribute('viewBox', e.viewBox); svg.innerHTML = e.html; }
      return;
    }
    P3D.setSoft(E.params ? E.params.soft_close : true);
    P3D.setHeights(bedHeights(r) || rowHeights(r));
    // a headboard wider than the bed: the bed's width as well as the headboard's
    var hbw = r.bed && r.bed.headboard;
    P3D.setWidths(hbw && hbw[1] - hbw[0] > r.bed.width + 0.5 ? [[0, r.bed.width, 1], [hbw[0], hbw[1], 2]] : null);
    P3D.update(parts, matInfo, r.movers);
    if (reset || firstDraw) { P3D.reset('iso'); firstDraw = false; }
  }
  function changed(reset3d) {
    E.dirty = true;
    histPush();
    rebuild();
    draw3d(reset3d);
    renderEditBody();
    liveThumb();
  }

  // ------------------------------------------------------------------ undo / redo (module editor)
  function histPush() {
    if (!E || !E.hist) { return; }
    var j = JSON.stringify(E.params);
    if (j === E.hist[E.hi]) { return; }
    E.hist = E.hist.slice(0, E.hi + 1);
    E.hist.push(j);
    if (E.hist.length > 150) { E.hist.shift(); }
    E.hi = E.hist.length - 1;
    undoState();
  }
  function histGo(d) {
    if (!E || !E.hist) { return; }
    var i = E.hi + d;
    if (i < 0 || i >= E.hist.length) { return; }
    E.hi = i;
    E.params = JSON.parse(E.hist[i]);
    E.dirty = true;
    rebuild(); draw3d(false); renderEditBody(); liveThumb();
    undoState();
    toast(t(d < 0 ? 'Undone' : 'Redone'));
  }
  function undoState() {
    var u = $('#undoV'), r = $('#redoV');
    if (u) { u.disabled = !E || !E.hist || E.hi <= 0; }
    if (r) { r.disabled = !E || !E.hist || E.hi >= E.hist.length - 1; }
  }

  // Press and hold (or right-click) a panel in the 3D view: change its material, for every
  // panel of its kind or this panel only (the engine decides: core Builder.change_mat).
  function matGroupLabel(k) {
    var row = ((F().SECTIONS || {}).materials || []).filter(function (x) { return x[0] === k; })[0];
    return row ? t(row[1]) : k;
  }
  function partMatMenu(p) {
    if (!E || !E.params || !$('#editBody') || !window.PPMaterials) { return; }
    var panel = !!E.params.panel, key = panel ? 'panel_mat' : p.mkey;
    function apply(scope, name) {
      try {
        E.params = Engine.call('change_mat', { params: E.params, pid: p.pid, mkey: key, mat: name || '', scope: scope });
      } catch (er) { toast(er.message); return; }
      changed(false);
      if (name) { toast(t('Material: ') + name); }
    }
    function choose(scope) {
      // "All panels of…" can also follow the carcass / fronts (as the material rows do)
      var cur = F().matLink(E.params, key);
      var links = scope === 'group' && !panel ? (F().MAT_LINKS[key] || []).map(function (l) {
        return { id: l, label: t(F().LINK_LABEL[l]), mat: E.params[F().LINK_KEY[l]], on: cur === l };
      }) : [];
      window.PPMaterials.pick(p.mat, function (name, ln) {
        if (ln) { F().setMatLink(E.params, key, ln); changed(false); return; }
        apply(scope, name);
      }, { links: links });
    }
    var kin = {};
    ((E.res && E.res.parts) || []).forEach(function (x) { if (x.mkey === p.mkey) { kin[x.pid] = true; } });
    var only = Object.keys(kin).length <= 1 && !p.mat_own;   // the only panel of its kind: just change its row
    var items = panel || only ? [{ label: t('Change material…') + (panel ? '' : ' (' + matGroupLabel(key) + ')'), icon: 'palette', run: function () { choose('group'); } }] : [
      { label: t('All panels of: ') + matGroupLabel(key), icon: 'palette', run: function () { choose('group'); } },
      { label: t('This panel only'), icon: 'palette', run: function () { choose('part'); } }
    ];
    if (p.mat_own) { items.push({ label: t('Back to the material of: ') + matGroupLabel(key), icon: 'refresh', run: function () { apply('reset'); } }); }
    if (P3D.highlight) {
      P3D.highlight(p.pid);
      setTimeout(function () {
        document.addEventListener('click', function off() { document.removeEventListener('click', off, true); setTimeout(function () { P3D.highlight(null); }, 400); }, true);
      }, 0);
    }
    menu(t(p.name) + (p.mat ? ' · ' + p.mat : ''), items);
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
      return '<button type="button" class="' + (extraCls || '') + '" data-v="' + esc(c[0]) + '" aria-pressed="' + (String(value) === String(c[0])) + '">' +
        (extraCls === 'tile' ? '<i class="fi fi-' + esc(c[0]) + '"></i>' : '') + '<span>' + esc(t(c[1])) + '</span></button>';
    }).join('') + '</div>';
  }

  // ---- full editor: the plugin's Configurator settings (ui/fields.js, shared), drawn for touch
  // A tab lists whole sections of ui/fields.js, or a slice of one: { sec, from, until } (group titles).
  var DECO_TITLE = 'Decorative panels', ENDS_TITLE = 'Visible end panels', CUT_TITLE = 'Cut list';
  var KICK_TITLE = 'Base / toe kick';   // its own step after Box
  var TABS = [['box', 'Box', [{ sec: 'box', until: KICK_TITLE }]], ['layout', 'Layout', ['layout']], ['module', 'Module', ['module']],
              ['kick', 'Toe kick', [{ sec: 'box', from: KICK_TITLE, until: DECO_TITLE }, { defs: [['elevation', 'Off the floor', 'len', null, 'here']] }]],
              ['panels', 'Decorative panels', [{ sec: 'box', from: DECO_TITLE }, { sec: 'materials', from: ENDS_TITLE, until: CUT_TITLE }]],
              ['fronts', 'Fronts', ['fronts', 'frame', 'pulls', 'motion']], ['drawers', 'Drawers', ['drawers']],
              ['materials', 'Materials', [{ sec: 'materials', until: ENDS_TITLE }, { sec: 'materials', from: CUT_TITLE }]]];
  function sectionDefs(spec) {
    if (typeof spec === 'string') { return F().SECTIONS[spec] || []; }
    if (spec.defs) { return spec.defs; }
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
  var HINGE_CH = [['L', 'Hinge left'], ['R', 'Hinge right'], ['T', 'Lift up'], ['B', 'Drop down']];
  var INTERIOR_CH = [['none', 'Empty'], ['shelves', 'Shelves'], ['hang', 'Hang rail'], ['inner_drawers', 'Inner drawers'], ['shoe_pullout', 'Shoe pull-outs'], ['shoe_rack', 'Shoe rack']];
  var COUNT_L = { shelves: 'Shelves', inner_drawers: 'Drawers', shoe_pullout: 'Pull-outs', shoe_rack: 'Racks' };
  var editTab = load('panelpro.web.tab', 'box');

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
    var c = d[3] === null ? function (q) { return !q.bed && !q.panel && !q.slab; } : F().condOf(d);
    // shown elsewhere on the web: the name over the sizes, the inner width in the width keypad,
    // the height off the floor in the Toe kick tab (loose panels / stone pieces keep it here)
    if (key === 'name' || key === 'inner_w' || (key === 'elevation' && d[4] !== 'here' && !p.panel && !p.slab)) { return ''; }
    if (key === 'elevation' && d[4] === 'here') { label = t(p.kick_type === 'none' ? 'Height from the floor' : 'Raised off the floor (besides the toe kick)'); }
    if (key === '#') { return F().cond(d[2])(p) ? '<h3 class="grp">' + esc(label) + '</h3>' : ''; }
    if (SKIP[key] || !c(p) || (p.panel && key === 'inner_w')) { return ''; }
    if (type === 'info') {
      var ik = window.PPReports.INFO_KEYS[key], txt = ik ? window.PPReports.info[ik](p, rctx()) : '';
      return txt ? '<div class="readout">' + window.PPReports.readoutHtml(txt) + '</div>' : '';
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
      // texture tile (tap: the picker, with "Same as carcass / fronts" as its first cards) beside
      // the name and the material box; a row that follows another material says so
      var link = F().matLink(p, key);
      var sw = window.PPMaterials ? window.PPMaterials.swatchCss(p[key], (matInfo(p[key]) || {}).color) : 'background:' + ((matInfo(p[key]) || {}).color || '#ddd');
      // one list row: tile · name · its material (or what it follows) · › — tap: the picker
      var box = '<small class="matval">' + (link ? '🔗 ' + esc(t(F().LINK_LABEL[link])) : esc(p[key] || '—')) + '</small>';
      // panels of this kind with a material of their own (right-click / hold › This panel only)
      var seen = {}, own = ((E && E.res && E.res.parts) || []).filter(function (x) {
        if (!x.mat_own || x.mkey !== key || seen[x.pid]) { return false; }
        seen[x.pid] = true; return true;
      });
      var owns = own.length ? '<div class="ownmats">' + own.map(function (x) {
        var c = window.PPMaterials ? window.PPMaterials.swatchCss(x.mat, (matInfo(x.mat) || {}).color) : 'background:#ddd';
        return '<button type="button" class="ownmat" data-ownreset="' + esc(x.pid) + '" title="' + esc(t('Back to the material of: ') + label) + '"><i style="' + esc(c) + '"></i>' +
          '<span><b>' + esc(t(x.name)) + '</b> ' + esc(x.mat) + '</span><em>✕</em></button>';
      }).join('') + '</div>' : '';
      // first row: Reset materials · Copy materials from… (another module of this site)
      var tools = key === 'mat_carcass' || (p.panel && key === 'panel_mat') ? '<div class="mattools"><button type="button" class="btn small ghost" data-matreset="1">↺ ' + esc(t('Reset materials')) + '</button>' +
        '<button type="button" class="btn small ghost" data-matcopy="1">⧉ ' + esc(t('Copy materials from…')) + '</button></div>' : '';
      return tools + '<div class="matrow"><button type="button" class="matbtn" data-matpick="' + key + '"><span class="mattile' + (link ? ' linked' : '') + '" style="' + esc(sw) + '"></span>' +
        '<span class="matcol"><span class="flbl">' + esc(label) + '</span>' + box + '</span><span class="chev">›</span></button>' + owns + '</div>';
    } else {
      ctl = '<input class="text-in" data-text="' + key + '" value="' + esc(p[key] == null ? '' : p[key]) + '" autocomplete="off">';
      return '<div class="frow-f stack"><span class="flbl">' + esc(label) + '</span>' + ctl + '</div>';
    }
    var picks = '';
    if (F().PICKS[key]) {
      var mk = F().MODE_KEYS[key], active = mk && F().tMult(p[mk]) ? p[mk] : null;
      picks = '<span class="seg picks">' + F().PICKS[key].map(function (x) {
        var on = active ? String(x) === active : (typeof x === 'number' && Math.abs(x - p[key]) < 0.01);
        return '<button type="button" class="num-chip" data-pick="' + key + '" data-v="' + x + '" aria-pressed="' + on + '">' + esc(x === 0 ? t('Flush') : String(x)) + '</button>';
      }).join('') + '</span>';
    }
    // every tab the same way: the title on top, its value and quick picks under it on the left
    // (on / off switches stay beside their title)
    if (type === 'bool') { return '<div class="frow-f"><span class="flbl">' + esc(label) + '</span>' + ctl + '</div>'; }
    return '<div class="frow-f stack"><span class="flbl">' + esc(label) + '</span><div class="vrow">' + ctl + picks + '</div></div>';
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
    var h = '<div class="seg seg-sw lmode" data-lmode="1">' + [['cols', 'Columns and rows'], ['nooks', 'NOOKS']].map(function (o) {
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
        '<div class="seg seg-sw colkind">' + [['normal', 'Cabinet section'], ['kneehole', 'Leg space']].map(function (o) {
          return '<button type="button" data-colkind="' + ci + '" data-v="' + o[0] + '" aria-pressed="' + (col.kind === o[0]) + '">' + esc(t(o[1])) + '</button>';
        }).join('') + '</div>';
      if (col.kind === 'kneehole') { h += '<p class="meta-line">' + esc(t('Open kneehole — no bottom, back or fronts; adjacent partitions become pedestal sides.')) + '</p></div>'; return; }
      (col.rows || []).forEach(function (row, ri) {
        var front = row.front.replace(/^glass_/, ''), door = front === 'door', drawer = front === 'drawer';
        var rh = (LY.rows || [])[ri];
        // front = the category (one joined control); hinge and interior = its details, set apart below
        var details = (door ? '<div class="opt-l">' + esc(t('Hinge')) + '</div>' + seg('hinge:' + ci + ',' + ri, HINGE_CH, row.hinge || 'L', 'chip', 'seg-grid g4') : '') +
          (!drawer ? '<div class="opt-l">' + esc(t('Inside')) + '</div>' + seg('interior:' + ci + ',' + ri, INTERIOR_CH, row.interior || 'none', 'chip', 'seg-grid g3') : '') +
          (!drawer && COUNT_L[row.interior] ? '<div class="stepper"><span>' + esc(t(COUNT_L[row.interior])) + '</span>' +
            '<button type="button" data-shelf="' + ci + ',' + ri + ',-1" aria-label="Fewer shelves">−</button><b>' + (row.shelves || 0) + '</b>' +
            '<button type="button" data-shelf="' + ci + ',' + ri + ',1" aria-label="More shelves">+</button></div>' : '');
        h += '<div class="frow"><div class="frow-head"><span class="rlbl">' + esc(t('Row')) + ' ' + (ri + 1) + '</span>' +
          sizeCtl('rowh', ci + ',' + ri, row.h, rh) + '<span class="grow"></span>' +
          (col.rows.length > 1 ? '<button type="button" class="xbtn" data-rowmv="' + ci + ',' + ri + ',-1" aria-label="' + esc(t('Move up')) + '"' + (ri === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button type="button" class="xbtn" data-rowmv="' + ci + ',' + ri + ',1" aria-label="' + esc(t('Move down')) + '"' + (ri === col.rows.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button type="button" class="xbtn del" data-rowx="' + ci + ',' + ri + '" aria-label="Remove row">✕</button>' : '') + '</div>' +
          '<div class="opt-l">' + esc(t('Front')) + '</div>' + seg('front:' + ci + ',' + ri, FRONT_CHOICES, front, 'tile', 'seg-tiles') +
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

  // Loose panel sizes: [role, param, label]. The thickness is panel_t (and the size across it).
  function panelDims(p) {
    var k = p.panel_kind;
    if (k === 'top' || k === 'bottom') { return [['len', 'width', 'Length ↔ grain'], ['wid', 'depth', 'Width'], ['thk', 'height', 'Thickness']]; }
    if (k === 'side') { return [['len', 'height', 'Length ↔ grain'], ['wid', 'depth', 'Width'], ['thk', 'width', 'Thickness']]; }
    return [['len', 'width', 'Length ↔ grain'], ['wid', 'height', 'Width'], ['thk', 'depth', 'Thickness']];
  }
  var hintT = null;
  // The sizes as chips on the 3D view (phone): tap one = its keypad (the size box below, hidden)
  // a bed is sized by its mattress (W × L) and its overall height (floor → top of the mattress)
  // a stone piece (made by a composition) by its length and its depth (top) or height (backsplash / trim)
  function dimKeys(p) { return p.bed ? ['bed_mw', 'bed_ml', 'height'] : p.slab ? ['slab_l', 'slab_w'] : ['width', 'height', 'depth']; }
  function dimLabel(k) {
    var sl = E.params && E.params.slab;
    return t({ bed_mw: 'Mattress width', bed_ml: 'Mattress length', height: E.params && E.params.bed ? 'Overall height' : 'Height',
               slab_l: 'Length', slab_w: sl && E.params.slab_kind !== 'top' ? 'Height' : 'Depth' }[k] || (k[0].toUpperCase() + k.slice(1)));
  }
  function fillDimChips(p) {
    var host = $('#dimChips');
    if (!host) { return; }
    var list = p.panel ? panelDims(p).map(function (d) { return ['pdim', d[0], d[1], d[0] === 'len' ? 'L' : d[0] === 'wid' ? t('W') : t('T')]; })
      : p.bed ? [['dim', 'bed_mw', 'bed_mw', t('Mattress W')], ['dim', 'bed_ml', 'bed_ml', t('Mattress L')], ['dim', 'height', 'height', t('H')]]
      : p.slab ? [['dim', 'slab_l', 'slab_l', 'L'], ['dim', 'slab_w', 'slab_w', p.slab_kind === 'top' ? t('D') : t('H')]]
      : [['dim', 'width', 'width', t('W')], ['dim', 'height', 'height', t('H')], ['dim', 'depth', 'depth', t('D')]];
    host.innerHTML = list.map(function (d) {
      return '<button type="button" data-chip="' + d[0] + ':' + d[1] + '"' + (E.changed[d[2]] ? ' class="changed"' : '') + '><small>' + esc(d[3]) + '</small>' + L(p[d[2]]) + '</button>';
    }).join('');
    host.onclick = function (e) {
      var b = e.target.closest('[data-chip]');
      if (!b) { return; }
      var a = b.getAttribute('data-chip').split(':');
      var tgt = document.querySelector('#editBody [data-' + a[0] + '="' + a[1] + '"]');
      if (tgt) { tgt.click(); }
    };
  }
  function renderEditBody() {
    var body = $('#editBody');
    if (!body) { return; }
    var p = E.params;
    var scrollY = body.scrollTop;
    var html = '<input class="ed-name" data-text="name" value="' + esc(p.name || '') + '" placeholder="' + esc(t('Module name')) + '" autocomplete="off" aria-label="' + esc(t('Name')) + '">' +
      '<div class="measure">' + (p.panel ? panelDims(p).map(function (d) {
      // a loose panel: Length (the grain) × Width × Thickness, whichever way it stands
      return '<button type="button" data-pdim="' + d[0] + '" class="' + (E.changed[d[1]] ? 'changed' : '') + '"><span class="lbl">' + esc(t(d[2])) + '</span>' +
        '<span class="num">' + L(p[d[1]]) + '</span><span class="unit">' + U() + '</span></button>';
    }) : dimKeys(p).map(function (k) {
      return '<button type="button" data-dim="' + k + '" class="' + (E.changed[k] ? 'changed' : '') + '"><span class="lbl">' + esc(dimLabel(k)) + '</span>' +
        '<span class="num">' + L(p[k]) + '</span><span class="unit">' + U() + '</span></button>';
    })).join('') + '</div>';
    if (E.error) {
      html += '<div class="warn err"><p><b>' + esc(t('This module cannot be built:')) + '</b></p><p>' + esc(E.error) + '</p></div>';
    } else if (E.res && E.res.warnings && E.res.warnings.length) {
      html += '<div class="warn">' + E.res.warnings.map(function (w) { return '<p>' + esc(w) + '</p>'; }).join('') + '</div>';
    }
    // a loose panel has no box, fronts or drawers: only its own settings and materials; other tabs
    // show only when something in them applies to this module (Layout and Materials always)
    var tabs = p.slab ? TABS.filter(function (x) { return x[0] === 'module'; })
      : p.panel || p.bed ? TABS.filter(function (x) { return x[0] === 'module' || x[0] === 'materials'; })
      : TABS.filter(function (x) { return x[0] === 'layout' || x[0] === 'materials' || tabFields(x, p) !== ''; });   // Module only when something is left in it (corner, fridge…)
    var tab = tabs.find(function (x) { return x[0] === editTab; }) || tabs[0];
    var ti = tabs.indexOf(tab);
    html += '<div class="etabs-w"><button type="button" class="et-nav" data-tabgo="-1" aria-label="' + esc(t('Previous')) + '"' + (ti <= 0 ? ' disabled' : '') + '>‹</button>' +
      '<nav class="etabs" role="tablist">' + tabs.map(function (tb) {
      return '<button type="button" role="tab" data-tab="' + tb[0] + '" aria-selected="' + (tab[0] === tb[0]) + '">' + esc(t(tb[1])) + '</button>';
    }).join('') + '</nav><button type="button" class="et-nav" data-tabgo="1" aria-label="' + esc(t('Next')) + '"' + (ti >= tabs.length - 1 ? ' disabled' : '') + '>›</button></div>';
    html += '<div class="tabbody">';
    if (tab[0] === 'layout') { html += layoutHtml(p); }
    var fields = tabFields(tab, p);
    if (fields) { html += '<div class="box fields">' + fields + '</div>'; }
    html += '</div>';
    if (E.res) { html += '<p class="meta-line">' + E.res.parts.filter(function (x) { return x.cut; }).length + ' ' + esc(t('parts')) + '</p>'; }
    body.innerHTML = html;
    body.scrollTop = scrollY;
    E.tabs = tabs.map(function (x) { return x[0]; });
    E.tab = tab[0];
    var nav = body.querySelector('.etabs'), on = nav && nav.querySelector('[aria-selected="true"]');
    if (on) { nav.scrollTo({ left: Math.max(0, on.offsetLeft - (nav.clientWidth - on.offsetWidth) / 2), behavior: 'instant' }); }
    fillDimChips(p);
    dockState();
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
      if (b.getAttribute('data-matreset')) {
        E.params = Engine.call('reset_materials', { params: p });
        changed(false); toast(t('Materials reset.')); return;
      }
      if (b.getAttribute('data-matcopy')) {
        var cs = codesOf(E.site), others = E.site.modules.filter(function (m) { return !E.mod || m.id !== E.mod.id; });
        if (!others.length) { toast(t('No other module in this site yet.')); return; }
        menu(t('Copy materials from…'), others.map(function (m) {
          return { label: (cs[m.id] ? cs[m.id] + ' · ' : '') + (m.params.name || presetLabel(m.params.type)) + ' — ' + (m.params.mat_front || m.params.mat_carcass || ''), icon: 'palette', run: function () {
            E.params = Engine.call('copy_materials', { params: E.params, source: m.params });
            changed(false); toast(t('Materials copied.'));
          } };
        }));
        return;
      }
      if ((a = b.getAttribute('data-ownreset'))) {
        E.params = Engine.call('change_mat', { params: p, pid: a, mkey: '', mat: '', scope: 'reset' });
        changed(false); return;
      }
      if ((a = b.getAttribute('data-matpick')) && window.PPMaterials) {
        var mk = a, cur = F().matLink(p, mk);
        var links = (p.panel ? [] : F().MAT_LINKS[mk] || []).map(function (l) {
          return { id: l, label: t(F().LINK_LABEL[l]), mat: p[F().LINK_KEY[l]], on: cur === l };
        });
        window.PPMaterials.pick(cur ? null : p[mk], function (name, ln) {
          F().setMatLink(p, mk, ln || null, name);
          changed(false);
        }, { links: links });
        return;
      }
      if ((a = b.getAttribute('data-tabgo'))) {
        var ix = E.tabs.indexOf(E.tab) + Number(a);
        if (ix < 0 || ix >= E.tabs.length) { return; }
        var nv0 = $('#editBody .etabs'), from = nv0 ? nv0.scrollLeft : 0;
        editTab = E.tabs[ix]; save('panelpro.web.tab', editTab); renderEditBody(); $('#editBody').scrollTop = 0;
        // slide the strip to the new tab
        var nv = $('#editBody .etabs'), on2 = nv && nv.querySelector('[aria-selected="true"]');
        if (on2) {
          var to = Math.max(0, on2.offsetLeft - (nv.clientWidth - on2.offsetWidth) / 2);
          nv.scrollTo({ left: from, behavior: 'instant' });
          requestAnimationFrame(function () { nv.scrollTo({ left: to, behavior: 'smooth' }); });
        }
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
      if ((a = b.getAttribute('data-pdim'))) {
        var pd = panelDims(p).find(function (d) { return d[0] === a; });
        openPad({ label: t(pd[2]), value: p[pd[1]], done: function (v) {
          E.params[pd[1]] = v; E.changed[pd[1]] = true;
          if (a === 'thk') { E.params.panel_t = v; E.params.panel_t_same = false; }
          changed(true);
        } });
        return;
      }
      if ((a = b.getAttribute('data-dim'))) {
        var wm = a === 'width' && !p.bed && !p.slab && !p.panel ? { list: [['outer', t('Outside')], ['inner', t('Between the sides')]], value: 'outer',
          values: { outer: p.width, inner: Math.round((p.width - F().innerExtra(p)) * 1000) / 1000 } } : null;
        openPad({ label: dimLabel(a), value: p[a], chips: p.bed || p.slab ? undefined : CHIPS[a], modes: wm, done: function (v, mode) {
          if (mode === 'inner') { setP('inner_w', v); changed(true); return; }
          E.params[a] = v; E.changed[a] = true;
          if (E.params.bed) {
            if (a === 'height') { E.params.bed_height = v; }
            if (a === 'bed_mw' || a === 'bed_ml') { E.params.bed_size = 'custom'; }
          }
          changed(true);
        } });
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
      } else if ((a = el.getAttribute('data-text'))) {
        p[a] = el.value.trim();
        if (/^mat_/.test(a)) { F().followMats(p); }
        if (a === 'name') { E.dirty = true; return; }
        changed(false);
      }
    };
  }

  // Undo / redo keys: Ctrl+Z (⌘Z), Ctrl+Shift+Z or Ctrl+Y — in the module editor and the composition.
  // Inside a text box the browser's own undo of the typing stays.
  document.addEventListener('keydown', function (e) {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) { return; }
    var k = e.key.toLowerCase();
    if (k !== 'z' && k !== 'y') { return; }
    if (/INPUT|TEXTAREA/.test((document.activeElement || {}).tagName || '') || document.querySelector('.menu, .dpad-wrap, .docview, .ask, .rd-sheet, .rp-sheet, #pad:not([hidden])')) { return; }
    var redo = k === 'y' || e.shiftKey;
    if (E && /\/(m|new)\//.test(location.hash)) { e.preventDefault(); histGo(redo ? 1 : -1); }
    else if (/\/compose$/.test(location.hash) && window.PPCompose && window.PPCompose.undo) { e.preventDefault(); window.PPCompose.undo(redo ? 1 : -1); }
  });

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
      var s = E.site, m = E.mod;
      ask({ title: t('Delete this module?'), text: E.params.name || '', ok: t('Delete'), danger: true }).then(function (ok) {
        if (!ok || !E || E.mod !== m) { return; }
        s.modules = s.modules.filter(function (x) { return x !== m; }); if (window.PPCompose) { window.PPCompose.refresh(s); } touch(s); persist();
        E = null; toast(t('Deleted')); go('#/site/' + encodeURIComponent(s.id), true);
      });
    }
  });
  // The dock: new module → "Save & next: <tab> ›" (last: "Save & finish ✓") and "Step n of N";
  // editing → "Save" (stays on the tab).
  function dockState() {
    var b = $('#saveMod'), st = $('#steps');
    if (!b || !E) { return; }
    if (E.wizard && E.tabs && E.tabs.length) {
      var i = Math.max(0, E.tabs.indexOf(E.tab)), next = E.tabs[i + 1];
      var lbl = next ? (TABS.find(function (x) { return x[0] === next; }) || [0, next])[1] : null;
      b.textContent = next ? t('Save & next: ') + t(lbl) + ' ›' : t('Save & finish') + ' ✓';
      if (st) { st.textContent = t('Step ') + (i + 1) + t(' of ') + E.tabs.length; st.hidden = false; }
    } else {
      b.textContent = t('Save');
      if (st) { st.hidden = true; }
    }
  }
  // Put the module in the site (new) or update it; returns its id.
  function storeModule() {
    var s = E.site;
    var nameIn = document.querySelector('[data-text="name"]');
    if (nameIn) { E.params.name = nameIn.value.trim(); }
    if (E.mod) {
      if (E.mod.params && E.mod.params.edges) { E.params.edges = clone(E.mod.params.edges); } else { delete E.params.edges; }
      E.mod.params = clone(E.params); E.mod.updated = now();
      if (window.PPCompose && s.comps && s.comps.length) { window.PPCompose.refresh(s); }   // its composition's pieces follow
    } else {
      E.mod = { id: uid(), order: s.next_order++, created: now(), updated: now(), params: clone(E.params), preset: E.presetKey || null };
      s.modules.push(E.mod);
      // the address follows (without leaving the editor)
      try { history.replaceState(null, '', '#/site/' + encodeURIComponent(s.id) + '/m/' + encodeURIComponent(E.mod.id)); } catch (e) { /* */ }
    }
    touch(s); persist();
    E.dirty = false;
    E.changed = {};
    if (desk()) {
      var side = screen.querySelector('.ws-mods');
      if (side) {
        var tmp = document.createElement('div');
        tmp.innerHTML = deskModsHtml(s, E.mod.id);
        side.parentNode.replaceChild(tmp.firstChild, side);
        wireDeskMods(s);
      }
    }
    return E.mod.id;
  }
  function saveModule() {
    if (E.wizard) {
      var i = E.tabs ? E.tabs.indexOf(E.tab) : -1, next = E.tabs && E.tabs[i + 1];
      var first = !E.mod;
      storeModule();
      if (next) {
        toast(first ? t('Added to the site') : t('Saved'));
        editTab = next; save('panelpro.web.tab', next);
        renderEditBody();
        $('#editBody').scrollTop = 0;
        return;
      }
      E.wizard = false;
      toast(t('Saved'));
      var s0 = E.site, id0 = E.mod.id;
      E = null;
      go('#/site/' + encodeURIComponent(s0.id) + (desk() ? '/m/' + encodeURIComponent(id0) : ''), true);
      return;
    }
    // editing: save, stay on this tab
    storeModule();
    toast(t('Saved'));
    renderEditBody();
  }
  // Split module → one module per box, in the box's place (composition / room), replacing it.
  function separateModule() {
    var s = E.site, mod = E.mod, src = clone(E.params), boxes;
    if (mod && mod.params && mod.params.edges) { src.edges = clone(mod.params.edges); }
    try { boxes = Engine.call('build', { params: src, lang: lang }).boxes || []; } catch (e) { toast(e.message); return; }
    if (boxes.length < 2) { toast(t('This module has no splits.')); return; }
    ask({ title: t('Separate into modules') + ': ' + boxes.length + '?', ok: t('Separate into modules') }).then(function (ok) { if (ok) { separateNow(s, mod, boxes); } });
  }
  function separateNow(s, mod, boxes) {
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
      // desktop: the sidebar has the cutting plan, and the manual goes in the title bar
      (desk() ? '' : '<div class="actions-row"><button type="button" class="btn small" id="manualBtn">' + esc(t('Module manual')) + '</button>' +
      '<button type="button" class="btn small" id="optBtn">' + esc(t('Optimize sheets')) + '</button></div>') +
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
      '<div class="dock">' + (desk() ? '<button type="button" class="btn ghost" id="manualBtn">' + esc(t('Module manual')) + '</button>' : '') +
      '<button type="button" class="btn primary" id="sharePdf">' + esc(t(finePointer() || desk() ? 'Save PDF' : 'Share PDF')) + '</button>' +
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
    if ($('#optBtn')) { $('#optBtn').onclick = function () { go('#/site/' + encodeURIComponent(s.id) + '/opt'); }; }
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
  // Documents (manuals, cutting plan) open in a large window over the app; ✕, Esc or a click
  // outside closes it. onClose runs after it closes.
  function showDoc(html, title, onClose) {
    var ov = document.createElement('div');
    ov.className = 'docview';
    ov.innerHTML = '<div class="doc-modal" role="dialog" aria-modal="true" aria-label="' + esc(title) + '">' +
      '<header class="doc-h"><h1>' + esc(title) + '</h1><button type="button" class="btn small primary" data-print>' + esc(t('Print / save PDF')) + '</button>' +
      '<button type="button" class="icon-btn doc-x" data-close aria-label="' + esc(t('Close')) + '">✕</button></header>' +
      '<iframe title="' + esc(title) + '"></iframe></div>';
    document.body.appendChild(ov);
    var fr = ov.querySelector('iframe');
    fr.srcdoc = html.replace(/<div class="np">[\s\S]*?<\/div>/, '');
    var close = function () {
      if (!ov.isConnected) { return; }
      ov.remove(); document.removeEventListener('keydown', key, true); window.removeEventListener('hashchange', away);
      if (onClose) { onClose(); }
    };
    var key = function (e) { if (e.key === 'Escape') { e.preventDefault(); close(); } };
    // going to another screen (sidebar, back) closes it, without running onClose's own navigation
    var away = function () { onClose = null; close(); };
    document.addEventListener('keydown', key, true);
    setTimeout(function () { window.addEventListener('hashchange', away); }, 0);
    ov.querySelector('[data-close]').onclick = close;
    ov.onclick = function (e) { if (e.target === ov) { close(); } };
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
  // The manual: the whole project, or one module (one: { id, params } — the editor's current settings)
  function makeManual(s, one, onClose) {
    var d, code = '';
    try {
      if (one) {
        var mods = s.modules.map(function (m) { return m.id === one.id ? Object.assign({}, m, { params: one.params }) : m; });
        if (!s.modules.some(function (m) { return m.id === one.id; })) { mods.push({ id: one.id, order: 9999, params: one.params }); }   // not added yet
        var full = Engine.call('project', { modules: mods, codes_state: s.codes_state || null, lang: lang, names: prefs.names, opt: prefs.opt, with_parts: true });
        code = (full.codes || {})[one.id] || '';
        d = full.manual_doc;
        d.modules = (d.modules || []).filter(function (x) { return x.code === code; });
        var only = d.modules[0];
        d.count = only ? (only.qty || 1) : 0;
        d.totals = only ? (only.hardware_l || []) : [];
        d.kick = [];
        d.scope = 'one';
      } else {
        d = projectData(s, true).manual_doc;
        d.scope = 'all';
        d.room = roomDoc(s);
      }
    } catch (e) { toast(e.message); return; }
    d.title = s.name + (s.client ? ' — ' + s.client : '');
    d.date = new Date().toISOString().slice(0, 10);
    // the materials pages: brand, name, type and texture of every material these modules use
    // (after the board catalog has loaded)
    var PM = window.PPMaterials;
    if (PM && PM.ready && !makeManual.waited) {
      makeManual.waited = true;
      PM.ready().then(function () { makeManual(s, one, onClose); makeManual.waited = false; });
      return;
    }
    d.materials = {};
    (d.modules || []).forEach(function (m) {
      (m.parts || []).forEach(function (q) {
        if (q.mat && !d.materials[q.mat] && window.PPMaterials && window.PPMaterials.meta) {
          var mm = window.PPMaterials.meta(q.mat);
          if (mm) { d.materials[q.mat] = mm; }
        }
      });
    });
    var html;
    try { html = window.PPManual.build(d, { t: t, show: L, units: U(), esc: esc, mats: matInfo }); }
    catch (e) { toast(t('Could not make the manual: ') + e.message); return; }
    showDoc(html, one ? t('Module manual') + (code ? ' — ' + code : '') : t('Project manual'), onClose);
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
          return '<figure class="sheet">' + R.sheetSvg(g, sh, false) + '<figcaption>' + esc(t('Sheet') + ' ' + sh.n + ' / ' + g.sheets.length + ' · ' + sh.pieces.length + ' ' + t('parts') + ' · ' + t('waste') + ' ' + sh.waste_pct + ' %' + (sh.offcut ? ' · ' + t('offcut') + ' ' + Math.round(sh.offcut[0]) + ' × ' + Math.round(sh.offcut[1]) : '')) + '</figcaption></figure>';
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
      (desk() ? '' : '<div class="box fields"><h3 class="grp">' + esc(t('App version')) + '</h3>' +   // on a computer: under the user in the side bar
        '<p class="app-ver"><b>PanelPro Web ' + esc(VERSION) + '</b> · ' + esc(t('build')) + ' ' + esc(BUILD) + ' · ' + esc(t('Engine')) + ' ' + esc(Engine.version || '') + '</p>' +
        '<button type="button" class="btn small" id="updBtn" style="width:100%">' + esc(t('Check for updates')) + '</button></div>') +
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
    if ($('#updBtn')) { $('#updBtn').onclick = function () { checkUpdate(this); }; }
    screen.querySelectorAll('[data-pname]').forEach(function (inp) {
      inp.onchange = function () {
        var m = prefs.names[lang] = prefs.names[lang] || {};
        if (inp.value.trim()) { m[inp.getAttribute('data-pname')] = inp.value.trim(); } else { delete m[inp.getAttribute('data-pname')]; }
        savePrefs();
      };
    });
    screen.querySelectorAll('[data-delpreset]').forEach(function (b) {
      b.onclick = function () {
        ask({ title: t('Delete this preset?'), ok: t('Delete'), danger: true }).then(function (ok) {
          if (ok) { prefs.book = Engine.call('presets_delete', { book: prefs.book, key: b.getAttribute('data-delpreset') }).book; savePrefs(); renderSettings(); }
        });
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
      var add = function () {
        if (old) { sites = sites.filter(function (x) { return x !== old; }); }
        s.updated = s.updated || now();
        sites.push(s); persist();
        toast(t('Opened') + ': ' + s.name);
        go('#/site/' + encodeURIComponent(s.id));
      };
      if (old) { ask({ title: t('This site is already on the phone. Replace it with the file?'), text: s.name, ok: t('Replace') }).then(function (ok) { if (ok) { add(); } }); } else { add(); }
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
    viewer: ensureViewer, has3d: function () { ensureViewer(); return has3d; }, dimsShown: dimsShown, openRender: openRender,
    loadPref: load, savePref: save, uid: uid, menuItemHtml: menuItemHtml, version: VERSION, build: BUILD, checkUpdate: checkUpdate, ask: ask, vtBtn: vtBtn, setOpenBtn: setOpenBtn, diagBtn: diagBtn, wireDiag: wireDiag, lang: function () { return lang; }, site: site, uk: uk,
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
