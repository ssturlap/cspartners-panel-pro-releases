/* PanelPro Web — material list (interface + storage; the costing itself is core/costing.rb).
 *
 * One entry per decor: name (the same text typed in a module's material boxes), texture image,
 * sheet size, and per thickness: price per sheet, edge tape roll price and roll length.
 * The list lives on this phone (localStorage); texture images in IndexedDB (too big for
 * localStorage). Export / import moves the list, images included, to another phone.
 */
(function () {
  'use strict';
  var A = window.PPApp;
  var KEY = 'panelpro.web.materials.v1';
  var FORMAT = 'panelpro_materials';
  var DB = { name: 'panelpro-web', store: 'tex' };

  var ES = {
    'Materials': 'Materiales', 'Material list': 'Lista de materiales', 'New material': 'Material nuevo',
    'No materials yet': 'Aún no hay materiales',
    'Add the boards you buy: texture, sheet size, thicknesses, price per sheet and edge tape rolls. Type the same name in a module’s material boxes to use it.':
      'Agregue los tableros que compra: textura, tamaño, espesores, precio por tablero y rollos de canto. Escriba el mismo nombre en los materiales de un módulo para usarlo.',
    'Brand': 'Marca', 'Texture': 'Textura', 'Choose image': 'Elegir imagen', 'Change image': 'Cambiar imagen', 'Remove image': 'Quitar imagen',
    'Colour': 'Color', 'Sheet': 'Tablero', 'Sheet length': 'Largo del tablero', 'Sheet width': 'Ancho del tablero',
    'Image covers (along the grain)': 'La imagen cubre (a lo largo de la veta)', 'Image covers (across)': 'La imagen cubre (a lo ancho)',
    'Thicknesses': 'Espesores', 'Thickness': 'Espesor', '+ Thickness': '+ Espesor', 'Price per sheet': 'Precio por tablero',
    'Edge tape roll price': 'Precio del rollo de canto', 'Roll length': 'Largo del rollo',
    'Edge tape is costed in whole rolls: 1 m over a roll buys another roll.': 'El canto se cuesta en rollos completos: 1 m más que un rollo compra otro rollo.',
    'Delete material': 'Eliminar material', 'Delete this material?': '¿Eliminar este material?',
    'Export materials…': 'Exportar materiales…', 'Import materials…': 'Importar materiales…',
    'Default edge tape roll': 'Rollo de canto por defecto',
    'For materials or thicknesses with no roll in the list.': 'Para materiales o espesores sin rollo en la lista.',
    'Imported materials: ': 'Materiales importados: ', 'This file is not a PanelPro materials file.': 'Este archivo no es un archivo de materiales de PanelPro.',
    'Could not read this image.': 'No se pudo leer esta imagen.', 'Could not save the image on this phone.': 'No se pudo guardar la imagen en este teléfono.',
    'Same name as another material': 'Mismo nombre que otro material', 'no price': 'sin precio', 'Edit material': 'Editar material',
    'roll': 'rollo', 'rolls': 'rollos', 'uses': 'usa', 'left': 'sobran', 'no roll length set': 'sin largo de rollo',
    'Add to the material list': 'Agregar a la lista de materiales',
    'Used in modules by name. Change it here and in the modules together.': 'Los módulos lo usan por el nombre. Si lo cambia aquí, cámbielo también en los módulos.'
  };
  function t(s) { return A.lang() === 'es' && ES[s] ? ES[s] : A.t(s); }
  var esc = A.esc, fmt = A.fmt;

  // ------------------------------------------------------------------ storage
  var data = { list: [], tape: { roll_price: 0, roll_m: 0 } };
  var TEX = {}; // id → data URL
  var stamp = 0;  // changes whenever the list changes (cutting plan cache)
  function loadList() {
    var d = A.loadPref(KEY, null);
    if (d && Array.isArray(d.list)) { data = d; }
    data.tape = data.tape || { roll_price: 0, roll_m: 0 };
  }
  function cloud() { return window.PPCloud && window.PPCloud.on ? window.PPCloud : null; }
  function saveList() {
    stamp++;
    data.list.sort(function (a, b) { return a.name.localeCompare(b.name); });
    if (cloud()) { cloud().materialsChanged(data.list); cloud().prefsChanged(A.prefs()); }
    else if (!A.savePref(KEY, data)) { A.toast(A.t('Could not save the site on this phone.')); }
    fillDatalist();
  }

  var dbp = null;
  function db() {
    if (dbp) { return dbp; }
    dbp = new Promise(function (ok, bad) {
      if (!window.indexedDB) { bad(new Error('no IndexedDB')); return; }
      var r = indexedDB.open(DB.name, 1);
      r.onupgradeneeded = function () { r.result.createObjectStore(DB.store); };
      r.onsuccess = function () { ok(r.result); };
      r.onerror = function () { bad(r.error); };
    });
    return dbp;
  }
  function tx(mode, fn) {
    return db().then(function (d) {
      return new Promise(function (ok, bad) {
        var x = d.transaction(DB.store, mode), st = x.objectStore(DB.store), out = fn(st);
        x.oncomplete = function () { ok(out && out.result); };
        x.onerror = function () { bad(x.error); };
      });
    });
  }
  function texPut(id, url) {
    TEX[id] = url; stamp++;
    if (cloud()) { return cloud().texturePut(id, url); }
    return tx('readwrite', function (st) { st.put(url, id); });
  }
  function texDel(id) {
    delete TEX[id]; stamp++;
    if (cloud()) { return cloud().textureDel(id); }
    return tx('readwrite', function (st) { st.delete(id); }).catch(function () {});
  }
  function texLoadAll() {
    return tx('readonly', function (st) {
      var req = st.openCursor();
      req.onsuccess = function () { var c = req.result; if (c) { TEX[c.key] = c.value; c.continue(); } };
    }).catch(function () {});
  }

  // ------------------------------------------------------------------ lookups (used by the module screens)
  function keyOf(n) { return String(n || '').trim().toLowerCase().replace(/\s+/g, ' '); }
  function find(name) {
    var k = keyOf(name);
    if (!k) { return null; }
    for (var i = 0; i < data.list.length; i++) { if (keyOf(data.list[i].name) === k) { return data.list[i]; } }
    return null;
  }
  function byId(id) { return data.list.find(function (e) { return e.id === id; }) || null; }
  // 3D colour / texture for a material name, or null when it isn't in the list.
  function info(name) {
    var e = find(name);
    if (!e) { return null; }
    var url = TEX[e.id];
    if (url) { return { color: '#ffffff', alpha: 1, thumb: url, tex_w: e.tex_w || e.sheet_l || 2440, tex_h: e.tex_h || e.sheet_w || 1220 }; }
    return { color: e.color || '#d8d2c4', alpha: 1 };
  }
  // What the engine needs (no images).
  function engineList() {
    return data.list.map(function (e) {
      return { name: e.name, sheet_l: e.sheet_l || 0, sheet_w: e.sheet_w || 0, thick: e.thick || [] };
    });
  }
  function costDefaults(prices) { return { roll_price: data.tape.roll_price || 0, roll_m: data.tape.roll_m || 0, prices: prices || {} }; }
  // Price per sheet typed on the cutting plan: kept in the list (adds the material / thickness).
  function setPrice(name, T, price) {
    var e = find(name) || addEntry(name);
    var th = thick(e, T, true);
    th.price = price;
    e.updated = new Date().toISOString();
    saveList();
    return e;
  }
  function thick(e, T, create) {
    e.thick = e.thick || [];
    var th = e.thick.find(function (x) { return Math.abs(Number(x.t) - Number(T)) < 0.01; });
    if (!th && create) { th = { t: Number(T), price: 0, roll_price: 0, roll_m: 0 }; e.thick.push(th); e.thick.sort(function (a, b) { return a.t - b.t; }); }
    return th || null;
  }
  function addEntry(name) {
    var e = { id: A.uid(), name: String(name || '').trim() || t('New material'), brand: '', color: '#d8d2c4',
              sheet_l: A.prefsOpt().sheet_l || 2440, sheet_w: A.prefsOpt().sheet_w || 1220, tex_w: 0, tex_h: 0,
              thick: [], updated: new Date().toISOString() };
    data.list.push(e);
    saveList();
    return e;
  }

  // Suggestions for the material boxes in the module editor.
  function fillDatalist() {
    var dl = document.getElementById('ppMatList');
    if (!dl) { dl = document.createElement('datalist'); dl.id = 'ppMatList'; document.body.appendChild(dl); }
    dl.innerHTML = data.list.map(function (e) { return '<option value="' + esc(e.name) + '">' + esc(e.brand || '') + '</option>'; }).join('');
  }
  // CSS background for a swatch (texture image or colour).
  function swatchCss(name, fallback) {
    var e = find(name);
    if (e && TEX[e.id]) { return 'background:#ccc url(' + TEX[e.id] + ') center/cover'; }
    return 'background:' + ((e && e.color) || fallback || '#ddd');
  }

  // ------------------------------------------------------------------ images
  // Phone photos are big: scale to 1024 px and JPEG, enough for the 3D view.
  function readImage(file) {
    return new Promise(function (ok, bad) {
      var url = URL.createObjectURL(file), img = new Image();
      img.onload = function () {
        var s = Math.min(1, 1024 / Math.max(img.width, img.height));
        var c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        ok(c.toDataURL('image/jpeg', 0.82));
      };
      img.onerror = function () { URL.revokeObjectURL(url); bad(new Error('image')); };
      img.src = url;
    });
  }
  function pickImage(done) {
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = function () { if (inp.files[0]) { done(inp.files[0]); } };
    inp.click();
  }

  // ------------------------------------------------------------------ screens
  function money(v) { return (A.prefsOpt().currency || '') + ' ' + fmt(v || 0); }
  function len(v) { return A.LU(v); }
  function thicksTxt(e) {
    return (e.thick || []).map(function (x) { return fmt(x.t) + ' mm' + (x.price ? ' · ' + money(x.price) : ''); }).join('  |  ');
  }

  function renderList() {
    A.show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(A.t('Back')) + '">‹</button><h1>' + esc(t('Materials')) + '</h1>' +
      '<button type="button" class="icon-btn" id="moreBtn" aria-label="' + esc(A.t('More')) + '">⋯</button></header>' +
      '<div class="page page-wide">' + tabs('mine') +
      (data.list.length ? '<div class="list">' + data.list.map(function (e) {
        return '<button type="button" class="row-card" data-mat="' + esc(e.id) + '"><i class="mat-thumb" style="' + esc(swatchCss(e.name)) + '"></i>' +
          '<span class="grow"><span class="t1">' + esc(e.name) + (e.brand ? ' <small class="muted">' + esc(e.brand) + '</small>' : '') + '</span>' +
          '<span class="t2">' + esc(len(e.sheet_l) + ' × ' + len(e.sheet_w)) + (thicksTxt(e) ? ' · ' + esc(thicksTxt(e)) : '') + '</span></span>' +
          '<span class="chev" aria-hidden="true">›</span></button>';
      }).join('') + '</div>'
        : '<div class="empty"><h2>' + esc(t('No materials yet')) + '</h2><p>' + esc(t('Add the boards you buy: texture, sheet size, thicknesses, price per sheet and edge tape rolls. Type the same name in a module’s material boxes to use it.')) + '</p></div>') +
      '<div class="box fields" style="margin-top:16px"><h3 class="grp">' + esc(t('Default edge tape roll')) + '</h3>' +
        '<p class="meta-line">' + esc(t('For materials or thicknesses with no roll in the list.')) + ' ' + esc(t('Edge tape is costed in whole rolls: 1 m over a roll buys another roll.')) + '</p>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Edge tape roll price')) + '</span><button type="button" class="valbtn" data-tape="roll_price">' + esc(money(data.tape.roll_price)) + '</button></div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Roll length')) + '</span><button type="button" class="valbtn" data-tape="roll_m">' + esc(fmt(data.tape.roll_m || 0) + ' m') + '</button></div></div>' +
      '</div>' +
      '<div class="dock"><button type="button" class="btn primary" id="newMat">' + esc(t('New material')) + '</button></div>'
    );
    document.getElementById('back').onclick = function () { history.back(); };
    document.getElementById('newMat').onclick = function () {
      var e = addEntry('');
      e.name = ''; e.thick.push({ t: 18, price: 0, roll_price: 0, roll_m: 0 }); saveList();
      A.go('#/materials/' + encodeURIComponent(e.id));
    };
    document.querySelectorAll('[data-mat]').forEach(function (b) {
      b.onclick = function () { A.go('#/materials/' + encodeURIComponent(b.getAttribute('data-mat'))); };
    });
    document.querySelectorAll('[data-tape]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-tape');
        A.openPad({ label: t(k === 'roll_m' ? 'Roll length' : 'Edge tape roll price'), value: data.tape[k] || 0, allowZero: true,
                    unit: k === 'roll_m' ? 'm' : (A.prefsOpt().currency || '$'), done: function (v) { data.tape[k] = v; saveList(); renderList(); } });
      };
    });
    document.getElementById('moreBtn').onclick = function () {
      A.menu(null, [
        { label: t('Export materials…'), run: exportList },
        readOnly() ? null : { label: t('Import materials…'), run: function () { A.pickFile(importList); } }
      ].filter(Boolean));
    };
    wireTabs();
    lockIfReadOnly();
  }

  // ------------------------------------------------------------------ account features (cloud.js)
  // Company members see the company list; only admins change it.
  function readOnly() { return !!(cloud() && !cloud().canEdit()); }
  function lockIfReadOnly() {
    if (!readOnly()) { return; }
    var page = document.querySelector('.page');
    page.insertAdjacentHTML('afterbegin', '<p class="warn-line">' + esc(cloud().t('Only admins change company materials and settings.')) + '</p>');
    page.querySelectorAll('.valbtn, .xbtn, input, #mImg, #mImgDel, #mAddT, #mDel, #mShare').forEach(function (el) { el.disabled = true; });
    var nm = document.getElementById('newMat'); if (nm) { nm.disabled = true; }
  }
  function tabs(on) {
    if (!cloud()) { return ''; }
    return '<div class="seg mat-tabs"><button type="button" data-mt="mine" class="' + (on === 'mine' ? 'on' : '') + '">' + esc(cloud().t('My list')) + '</button>' +
      '<button type="button" data-mt="gal" class="' + (on === 'gal' ? 'on' : '') + '">' + esc(cloud().t('Public gallery')) + '</button></div>';
  }
  function wireTabs() {
    document.querySelectorAll('[data-mt]').forEach(function (b) {
      b.onclick = function () { if (b.getAttribute('data-mt') === 'gal') { renderGallery(); } else { renderList(); } };
    });
  }
  function renderGallery() {
    var G = cloud();
    A.show('<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(A.t('Back')) + '">‹</button><h1>' + esc(t('Materials')) + '</h1></header>' +
      '<div class="page page-wide">' + tabs('gal') + '<p class="meta-line">' + esc(G.t('Prices stay private: only the texture, sheet size and thicknesses are shared.')) + '</p><div class="list" id="galList"><p class="meta-line">…</p></div></div>');
    document.getElementById('back').onclick = function () { history.back(); };
    wireTabs();
    G.gallery.load('materials').then(function (list) {
      var el = document.getElementById('galList'); if (!el) { return; }
      el.innerHTML = list.length ? list.map(function (g) {
        var have = !!find(g.name);
        return '<div class="row-card"><i class="mat-thumb" style="' + esc(g.texture ? 'background:#ccc url(' + g.texture + ') center/cover' : 'background:' + (g.color || '#ddd')) + '"></i>' +
          '<span class="grow"><span class="t1">' + (g.official ? '<b class="badge">' + esc(G.t('Official')) + '</b> ' : '') + esc(g.name) + (g.brand ? ' <small class="muted">' + esc(g.brand) + '</small>' : '') + '</span>' +
          '<span class="t2">' + esc(len(g.sheet_l) + ' × ' + len(g.sheet_w) + ' · ' + (g.thick || []).map(function (x) { return fmt(x.t) + ' mm'; }).join(', ')) + '</span>' +
          '<span class="t2">' + esc(G.t('Shared by: ') + (g.author && g.author.name || '')) + '</span></span>' +
          (readOnly() || have ? '' : '<button type="button" class="btn small" data-gadd="' + esc(g.id) + '">' + esc(G.t('Add to my list')) + '</button>') +
          (G.gallery.admin('materials', g, renderGallery) ? '<button type="button" class="xbtn" data-gm="' + esc(g.id) + '">⋯</button>' : '') + '</div>';
      }).join('') : '<p class="meta-line">' + esc(G.t('Nothing shared yet.')) + '</p>';
      el.querySelectorAll('[data-gadd]').forEach(function (b) {
        b.onclick = function () {
          var g = list.find(function (x) { return x.id === b.getAttribute('data-gadd'); });
          var e = addEntry(g.name);
          Object.assign(e, { brand: g.brand || '', color: g.color || e.color, sheet_l: g.sheet_l || e.sheet_l, sheet_w: g.sheet_w || e.sheet_w,
                             tex_w: g.tex_w || 0, tex_h: g.tex_h || 0, from_gallery: g.id,
                             thick: (g.thick || []).map(function (x) { return { t: Number(x.t), price: 0, roll_price: 0, roll_m: 0 }; }) });
          saveList();
          (g.texture ? texPut(e.id, g.texture) : Promise.resolve()).then(function () { A.toast(G.t('Added to your list')); renderGallery(); });
        };
      });
      el.querySelectorAll('[data-gm]').forEach(function (b) {
        b.onclick = function () { var g = list.find(function (x) { return x.id === b.getAttribute('data-gm'); }); G.gallery.admin('materials', g, renderGallery)(); };
      });
    }, function (e) { var el = document.getElementById('galList'); if (el) { el.innerHTML = '<p class="warn-line">' + esc(e.code || e.message) + '</p>'; } });
  }

  function renderEdit(e) {
    var hasTex = !!TEX[e.id];
    var dup = data.list.some(function (x) { return x !== e && keyOf(x.name) === keyOf(e.name) && keyOf(e.name); });
    function vb(attr, val, txt) { return '<button type="button" class="valbtn" ' + attr + '="' + val + '">' + esc(txt) + '</button>'; }
    A.show(
      '<header class="top"><button type="button" class="icon-btn" id="back" aria-label="' + esc(A.t('Back')) + '">‹</button>' +
      '<h1>' + esc(e.name || t('New material')) + '<span class="sub">' + esc(t('Material list')) + '</span></h1></header>' +
      '<div class="page">' +
      '<div class="box fields">' +
        '<div class="frow-f stack"><span class="flbl">' + esc(A.t('Name')) + '</span><input class="text-in" id="mName" autocomplete="off" value="' + esc(e.name) + '" placeholder="Grey Bardolino Oak">' +
          (dup ? '<p class="warn-line">' + esc(t('Same name as another material')) + '</p>' : '') +
          '<p class="meta-line">' + esc(t('Used in modules by name. Change it here and in the modules together.')) + '</p></div>' +
        '<div class="frow-f stack"><span class="flbl">' + esc(t('Brand')) + '</span><input class="text-in" id="mBrand" autocomplete="off" value="' + esc(e.brand || '') + '" placeholder="EGGER"></div>' +
      '</div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Texture')) + '</h3>' +
        '<div class="mat-tex" style="' + esc(swatchCss(e.name)) + '"></div>' +
        '<div style="display:flex;gap:8px;margin:8px 0 4px"><button type="button" class="btn small" id="mImg" style="flex:1">' + esc(t(hasTex ? 'Change image' : 'Choose image')) + '</button>' +
          (hasTex ? '<button type="button" class="btn small" id="mImgDel" style="flex:1">' + esc(t('Remove image')) + '</button>'
                  : '<label class="btn small mat-color" style="flex:1">' + esc(t('Colour')) + ' <input type="color" id="mColor" value="' + esc(e.color || '#d8d2c4') + '"></label>') + '</div>' +
        (hasTex ? '<div class="frow-f"><span class="flbl">' + esc(t('Image covers (along the grain)')) + '</span>' + vb('data-len', 'tex_w', len(e.tex_w || e.sheet_l)) + '</div>' +
                  '<div class="frow-f"><span class="flbl">' + esc(t('Image covers (across)')) + '</span>' + vb('data-len', 'tex_h', len(e.tex_h || e.sheet_w)) + '</div>' : '') +
      '</div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Sheet')) + '</h3>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Sheet length')) + '</span>' + vb('data-len', 'sheet_l', len(e.sheet_l)) + '</div>' +
        '<div class="frow-f"><span class="flbl">' + esc(t('Sheet width')) + '</span>' + vb('data-len', 'sheet_w', len(e.sheet_w)) + '</div>' +
      '</div>' +
      '<div class="box fields"><h3 class="grp">' + esc(t('Thicknesses')) + '</h3>' +
        '<p class="meta-line">' + esc(t('Edge tape is costed in whole rolls: 1 m over a roll buys another roll.')) + '</p>' +
        (e.thick || []).map(function (x, i) {
          return '<div class="mat-thick">' +
            '<div class="frow-f"><span class="flbl"><b>' + esc(t('Thickness')) + '</b></span>' + vb('data-th', i + ':t', fmt(x.t) + ' mm') +
              '<button type="button" class="xbtn" data-thdel="' + i + '" aria-label="' + esc(A.t('Delete')) + '">✕</button></div>' +
            '<div class="frow-f"><span class="flbl">' + esc(t('Price per sheet')) + '</span>' + vb('data-th', i + ':price', money(x.price)) + '</div>' +
            '<div class="frow-f"><span class="flbl">' + esc(t('Edge tape roll price')) + '</span>' + vb('data-th', i + ':roll_price', money(x.roll_price)) + '</div>' +
            '<div class="frow-f"><span class="flbl">' + esc(t('Roll length')) + '</span>' + vb('data-th', i + ':roll_m', fmt(x.roll_m || 0) + ' m') + '</div></div>';
        }).join('') +
        '<button type="button" class="btn small" id="mAddT" style="width:100%;margin-top:8px">' + esc(t('+ Thickness')) + '</button>' +
      '</div>' +
      (cloud() ? '<button type="button" class="btn small" id="mShare" style="width:100%;margin-top:8px">' + esc(cloud().t(e.gallery_id ? 'Remove from public gallery' : 'Share to public gallery')) + '</button>' +
                 '<p class="meta-line">' + esc(cloud().t('Prices stay private: only the texture, sheet size and thicknesses are shared.')) + '</p>' : '') +
      '<button type="button" class="btn danger" id="mDel" style="width:100%;margin:8px 0 24px">' + esc(t('Delete material')) + '</button>' +
      '</div>'
    );
    function touch() { e.updated = new Date().toISOString(); saveList(); }
    document.getElementById('back').onclick = function () { history.back(); };
    document.getElementById('mName').onchange = function () { e.name = this.value.trim(); touch(); renderEdit(e); };
    document.getElementById('mBrand').onchange = function () { e.brand = this.value.trim(); touch(); };
    var col = document.getElementById('mColor');
    if (col) { col.oninput = function () { e.color = col.value; document.querySelector('.mat-tex').style.background = col.value; }; col.onchange = function () { touch(); }; }
    document.getElementById('mImg').onclick = function () {
      pickImage(function (f) {
        readImage(f).then(function (url) {
          return texPut(e.id, url).then(function () { touch(); renderEdit(e); }, function () { A.toast(t('Could not save the image on this phone.')); });
        }, function () { A.toast(t('Could not read this image.')); });
      });
    };
    var del = document.getElementById('mImgDel');
    if (del) { del.onclick = function () { texDel(e.id).then(function () { touch(); renderEdit(e); }); }; }
    document.querySelectorAll('[data-len]').forEach(function (b) {
      b.onclick = function () {
        var k = b.getAttribute('data-len');
        A.openPad({ label: b.parentNode.querySelector('.flbl').textContent, value: e[k] || (k === 'tex_w' ? e.sheet_l : k === 'tex_h' ? e.sheet_w : 0),
                    done: function (v) { e[k] = v; touch(); renderEdit(e); } });
      };
    });
    document.querySelectorAll('[data-th]').forEach(function (b) {
      b.onclick = function () {
        var a = b.getAttribute('data-th').split(':'), x = e.thick[+a[0]], k = a[1];
        var unit = k === 't' ? 'mm' : k === 'roll_m' ? 'm' : (A.prefsOpt().currency || '$');
        A.openPad({ label: b.parentNode.querySelector('.flbl').textContent + (k !== 't' ? ' · ' + fmt(x.t) + ' mm' : ''), value: x[k] || 0,
                    allowZero: k !== 't', unit: unit, done: function (v) {
          x[k] = v;
          if (k === 't') { e.thick.sort(function (p, q) { return p.t - q.t; }); }
          touch(); renderEdit(e);
        } });
      };
    });
    document.querySelectorAll('[data-thdel]').forEach(function (b) {
      b.onclick = function () { e.thick.splice(+b.getAttribute('data-thdel'), 1); touch(); renderEdit(e); };
    });
    document.getElementById('mAddT').onclick = function () {
      var last = e.thick[e.thick.length - 1];
      A.openPad({ label: t('Thickness'), value: null, unit: 'mm', chips: [9, 12, 15, 16, 18, 25, 36], done: function (v) {
        if (!thick(e, v)) { var th = thick(e, v, true); if (last) { th.roll_m = last.roll_m; } }
        touch(); renderEdit(e);
      } });
    };
    var sh = document.getElementById('mShare');
    if (sh) {
      sh.onclick = function () {
        var G = cloud();
        if (e.gallery_id) {
          G.gallery.unshareMaterial(e.gallery_id).then(function () { delete e.gallery_id; touch(); A.toast(G.t('Removed from the public gallery')); renderEdit(e); }, function (x) { A.toast(x.code || x.message); });
        } else {
          if (!e.name) { document.getElementById('mName').focus(); return; }
          G.gallery.shareMaterial(e, TEX[e.id]).then(function (id) { e.gallery_id = id; touch(); A.toast(G.t('Shared to the public gallery')); renderEdit(e); }, function (x) { A.toast(x.code || x.message); });
        }
      };
    }
    lockIfReadOnly();
    document.getElementById('mDel').onclick = function () {
      if (!confirm(t('Delete this material?'))) { return; }
      data.list = data.list.filter(function (x) { return x !== e; });
      texDel(e.id); saveList();
      A.go('#/materials', true);
    };
  }

  // ------------------------------------------------------------------ files
  function exportList() {
    var out = { panelpro_materials: 1, tape: data.tape, materials: data.list.map(function (e) {
      var c = JSON.parse(JSON.stringify(e));
      if (TEX[e.id]) { c.texture = TEX[e.id]; }
      return c;
    }) };
    A.shareFile('PanelPro materials.json', JSON.stringify(out), 'application/json');
  }
  // Same name → replaced; new names → added.
  function importList(text) {
    var d;
    try { d = JSON.parse(text); } catch (err) { d = null; }
    if (!d || d[FORMAT] !== 1 || !Array.isArray(d.materials)) { A.toast(t('This file is not a PanelPro materials file.')); return; }
    var n = 0, jobs = [];
    d.materials.forEach(function (m) {
      if (!m || !m.name) { return; }
      var old = find(m.name), e = old || { id: A.uid() };
      ['name', 'brand', 'color', 'sheet_l', 'sheet_w', 'tex_w', 'tex_h', 'thick', 'updated'].forEach(function (k) { if (m[k] != null) { e[k] = m[k]; } });
      e.thick = Array.isArray(e.thick) ? e.thick : [];
      if (!old) { data.list.push(e); }
      if (typeof m.texture === 'string' && m.texture.indexOf('data:image/') === 0) { jobs.push(texPut(e.id, m.texture)); }
      n++;
    });
    if (d.tape && !(data.tape.roll_m > 0)) { data.tape = d.tape; }
    saveList();
    Promise.all(jobs).catch(function () {}).then(function () {
      A.toast(t('Imported materials: ') + n);
      if (/^#\/materials/.test(location.hash)) { renderList(); }
    });
  }

  // ------------------------------------------------------------------ public
  // The phone's own list (first sign-in copies it into the account).
  function localData() {
    var d = A.loadPref(KEY, null) || { list: [], tape: {} };
    return { list: d.list || [], tape: d.tape || {}, textures: function () {
      var out = {};
      return tx('readonly', function (st) {
        var req = st.openCursor();
        req.onsuccess = function () { var c = req.result; if (c) { out[c.key] = c.value; c.continue(); } };
      }).then(function () { return out; }, function () { return out; });
    } };
  }
  window.PPMaterials = {
    init: function () {
      if (cloud()) { fillDatalist(); return Promise.resolve(); }
      loadList(); fillDatalist(); return texLoadAll();
    },
    localData: localData,
    cloudReset: function () { data = { list: [], tape: { roll_price: 0, roll_m: 0 } }; TEX = {}; stamp++; fillDatalist(); },
    cloudList: function (list) { data.list = list.sort(function (a, b) { return a.name.localeCompare(b.name); }); stamp++; fillDatalist(); },
    cloudTexture: function (id, url) { if (url) { TEX[id] = url; } else { delete TEX[id]; } stamp++; },
    cloudTape: function (tp) { data.tape = Object.assign({ roll_price: 0, roll_m: 0 }, tp); stamp++; },
    tape: function () { return data.tape; },
    route: function (p) {
      if (p[1] === 'gallery' && cloud()) { return renderGallery(); }
      if (p[1]) { var e = byId(p[1]); if (e) { return renderEdit(e); } }
      return renderList();
    },
    find: find, info: info, swatchCss: swatchCss, engineList: engineList, costDefaults: costDefaults, setPrice: setPrice,
    stamp: function () { return stamp; },
    // open the list entry for a cut-list group (added if missing, with its thickness)
    openFor: function (name, T) {
      var e = find(name) || addEntry(name);
      thick(e, T, true); saveList();
      A.go('#/materials/' + encodeURIComponent(e.id));
    },
    t: t
  };
})();
