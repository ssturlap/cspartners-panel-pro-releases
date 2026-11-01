/* CSPARTNERS PANEL PRO — 3D module preview (three.js r149, bundled in ui/vendor).
 *
 * Coordinates are the builder's millimetres: x = width (left → right),
 * y = depth (front y = 0 → back), z = up. The viewer stands at −y.
 *
 * Navigation follows SketchUp:
 *   middle-drag orbit · Shift + middle-drag pan · wheel zoom toward cursor ·
 *   double-click middle = centre on point · O / H / Z pick the left-drag tool ·
 *   Shift+Z zoom extents · Esc back to orbit. Left-drag orbits by default
 *   (trackpads); Shift + left-drag pans.
 */
(function () {
  'use strict';
  var T = window.THREE;
  var P3D = { ok: !!T };
  window.P3D = P3D;
  if (!T) { return; }

  var host, renderer, scene, persp, ortho, root, lightDir;
  var target = new T.Vector3(), useOrtho = false, orthoHalf = 500;
  var dirty = true, hover = false, leftTool = 'orbit', drag = null;
  var matCache = {}, texCache = {};
  var FOV = 35;
  var bbox = new T.Box3();
  var hasView = false;
  // doors / drawers: id → { data, group, f (0 closed … 1 open), anim }
  var MOV = {}, soft = true;
  var OPEN_MS = 450, CLOSE_MS = 750, QUICK_MS = 350;

  // ------------------------------------------------------------------ setup
  P3D.init = function (el) {
    host = el;
    try {
      renderer = new T.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
    } catch (e) { P3D.ok = false; return false; }
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setClearColor(0xffffff, 1);
    host.appendChild(renderer.domElement);
    scene = new T.Scene();
    persp = new T.PerspectiveCamera(FOV, 1, 1, 100000);
    ortho = new T.OrthographicCamera(-1, 1, 1, -1, -100000, 100000);
    persp.up.set(0, 0, 1); ortho.up.set(0, 0, 1);
    scene.add(new T.HemisphereLight(0xffffff, 0xb9b2a6, 0.75));
    lightDir = new T.DirectionalLight(0xffffff, 0.55);
    lightDir.position.set(-0.6, -1, 1.3);
    scene.add(lightDir);
    root = new T.Group();
    scene.add(root);
    wire(renderer.domElement);
    P3D.resize();
    loop();
    return true;
  };

  P3D.resize = function () {
    if (!renderer || !host) { return; }
    var w = host.clientWidth || 300, h = host.clientHeight || 200;
    renderer.setSize(w, h, false);
    renderer.domElement.style.width = w + 'px';
    renderer.domElement.style.height = h + 'px';
    persp.aspect = w / h;
    persp.updateProjectionMatrix();
    sizeLabels();
    dirty = true;
  };

  function cam() { return useOrtho ? ortho : persp; }

  function syncOrtho() {
    var w = host.clientWidth || 300, h = host.clientHeight || 200, a = w / h;
    ortho.left = -orthoHalf * a; ortho.right = orthoHalf * a; ortho.top = orthoHalf; ortho.bottom = -orthoHalf;
    ortho.position.copy(persp.position);
    ortho.quaternion.copy(persp.quaternion);
    ortho.updateProjectionMatrix();
  }

  function loop() {
    requestAnimationFrame(loop);
    if (animate()) { dirty = true; }
    if (!dirty || !renderer) { return; }
    dirty = false;
    persp.lookAt(target);
    if (useOrtho) { syncOrtho(); }
    renderer.render(scene, cam());
  }

  // ------------------------------------------------------------------ materials
  function hashColor(name) {
    var h = 7;
    for (var i = 0; i < name.length; i++) { h = (h * 31 + name.charCodeAt(i)) % 16777216; }
    return 'rgb(' + (120 + h % 120) + ',' + (120 + Math.floor(h / 256) % 120) + ',' + (120 + Math.floor(h / 65536) % 120) + ')';
  }

  // info: { color, alpha, thumb, tex_w, tex_h } or null
  function material(name, info) {
    var key = name + '|' + (info ? [info.color, info.alpha, info.thumb ? info.thumb.length : 0, info.tex_w].join(',') : '');
    if (matCache[key]) { return matCache[key]; }
    var m = new T.MeshLambertMaterial({ color: info ? info.color : hashColor(name), side: T.DoubleSide,
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
    if (name === 'PanelPro Glass' && (!info || info.alpha >= 1)) { info = { color: info ? info.color : '#8c643e', alpha: 0.45 }; m.color.set(info.color); }
    if (info && info.alpha < 1) { m.transparent = true; m.opacity = Math.max(0.15, info.alpha); m.depthWrite = false; }
    if (info && info.thumb && info.tex_w) {
      var tex = texCache[info.thumb];
      if (!tex) {
        tex = new T.TextureLoader().load(info.thumb, function () { dirty = true; });
        tex.wrapS = tex.wrapT = T.RepeatWrapping;
        texCache[info.thumb] = tex;
      }
      m.map = tex;
      m.color.set(0xffffff);
      m.userData.texmm = [info.tex_w, info.tex_h || info.tex_w];
    }
    matCache[key] = m;
    return m;
  }

  // ------------------------------------------------------------------ geometry
  function to3(axis, w, u, v) {
    if (axis === 'x') { return [w, u, v]; }
    if (axis === 'y') { return [u, w, v]; }
    return [u, v, w];
  }
  var PLANE = { x: ['y', 'z'], y: ['x', 'z'], z: ['x', 'y'] };

  function prismGeometry(p, texmm) {
    var a = p.axis, w0 = p.pos, w1 = p.pos + p.thk, pts = p.pts, n = pts.length;
    var pos = [], uv = [];
    var tu = texmm ? texmm[0] : 1000, tv = texmm ? texmm[1] : 1000;
    var grainIsV = PLANE[a][1] === p.grain;
    function capUV(q) { return grainIsV ? [q[1] / tu, q[0] / tv] : [q[0] / tu, q[1] / tv]; }
    var contour = pts.map(function (q) { return new T.Vector2(q[0], q[1]); });
    var tris = T.ShapeUtils.triangulateShape(contour, []);
    [[w0, true], [w1, false]].forEach(function (cap) {
      tris.forEach(function (t) {
        var idx = cap[1] ? [t[0], t[2], t[1]] : t;
        idx.forEach(function (i) { pos.push.apply(pos, to3(a, cap[0], pts[i][0], pts[i][1])); uv.push.apply(uv, capUV(pts[i])); });
      });
    });
    var s = 0;
    for (var i = 0; i < n; i++) {
      var A = pts[i], B = pts[(i + 1) % n];
      var len = Math.sqrt((B[0] - A[0]) * (B[0] - A[0]) + (B[1] - A[1]) * (B[1] - A[1]));
      var quad = [[A, w0, s], [B, w0, s + len], [B, w1, s + len], [A, w1, s]];
      [0, 1, 2, 0, 2, 3].forEach(function (k) {
        var q = quad[k];
        pos.push.apply(pos, to3(a, q[1], q[0][0], q[0][1]));
        uv.push(q[2] / tu, (q[1] - w0) / tv);
      });
      s += len;
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setAttribute('uv', new T.Float32BufferAttribute(uv, 2));
    g.computeVertexNormals();
    return g;
  }

  function cylGeometry(p) {
    var g = new T.CylinderGeometry(p.r, p.r, p.len, 18);
    if (p.axis === 'z') { g.rotateX(Math.PI / 2); }
    else if (p.axis === 'x') { g.rotateZ(-Math.PI / 2); }
    var c = p.center, h = p.len / 2;
    var off = p.axis === 'x' ? [h, 0, 0] : p.axis === 'y' ? [0, h, 0] : [0, 0, h];
    g.translate(c[0] + off[0], c[1] + off[1], c[2] + off[2]);
    return g;
  }

  // ------------------------------------------------------------------ doors & drawers
  function easeOpen(t) { return 1 - Math.pow(1 - t, 3); }
  function easeSoft(t) { // steady, then the damper settles the last ~12 %
    if (t < 0.65) { return 0.88 * (t / 0.65); }
    var s = (t - 0.65) / 0.35;
    return 0.88 + 0.12 * (1 - Math.pow(1 - s, 4));
  }
  function easeInOut(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  function place(m) {
    var d = m.data, g = m.group, f = m.f;
    g.matrixAutoUpdate = false;
    if (d.kind === 'drawer') {
      g.matrix.makeTranslation(0, -(d.travel || 0) * f, 0);
    } else {
      var p = d.pivot || [0, 0, 0];
      var ax = d.axis === 'x' ? new T.Vector3(1, 0, 0) : new T.Vector3(0, 0, 1);
      var r = new T.Matrix4().makeRotationAxis(ax, T.MathUtils.degToRad(d.angle * f));
      g.matrix.makeTranslation(p[0], p[1], p[2]).multiply(r).multiply(new T.Matrix4().makeTranslation(-p[0], -p[1], -p[2]));
    }
    g.matrixWorldNeedsUpdate = true;
  }

  // returns true while something is moving
  function animate() {
    var now = performance.now(), busy = false;
    Object.keys(MOV).forEach(function (id) {
      var m = MOV[id], a = m.anim;
      if (!a) { return; }
      if (now < a.t0) { busy = true; return; }   // waiting for its turn
      var t = Math.min(1, (now - a.t0) / a.ms);
      var e = a.to > a.from ? easeOpen(t) : (a.soft ? easeSoft(t) : easeInOut(t));
      m.f = a.from + (a.to - a.from) * e;
      place(m);
      if (t >= 1) { m.anim = null; m.f = a.to; } else { busy = true; }
    });
    return busy;
  }

  // delay (ms): start later than now — used to run several one after another.
  function moveTo(m, to, delay) {
    var from = m.f;
    if (Math.abs(from - to) < 1e-6 && !m.anim) { return 0; }
    var opening = to > from;
    var ms = opening ? OPEN_MS : (soft ? CLOSE_MS : QUICK_MS);
    m.anim = { from: from, to: to, t0: performance.now() + (delay || 0), soft: !opening && soft, ms: ms };
    return ms;
  }

  // Drawers top to bottom, doors left to right; each starts a quarter of the way into the one before.
  function moveAll(list, to) {
    ['drawer', 'door'].forEach(function (kind) {
      var mine = list.filter(function (m) { return m.data.kind === kind; });
      mine.sort(function (a, b) {
        var p = a.data.at || [0, 0], q = b.data.at || [0, 0];
        return kind === 'drawer' ? (q[1] - p[1]) || (p[0] - q[0]) : (p[0] - q[0]) || (q[1] - p[1]);
      });
      var delay = 0;
      mine.forEach(function (m) { delay += moveTo(m, to, delay) / 4; });
    });
  }

  function goal(m) { return m.anim ? m.anim.to : m.f; }

  // kind: 'door' | 'drawer' | 'all'. Opens all of that kind if any is closed, else closes them.
  P3D.toggle = function (kind) {
    var list = Object.keys(MOV).map(function (k) { return MOV[k]; })
      .filter(function (m) { return kind === 'all' || m.data.kind === kind; });
    if (!list.length) { return null; }
    var open = list.some(function (m) { return goal(m) < 0.5; });
    moveAll(list, open ? 1 : 0);
    return open;
  };
  P3D.isOpen = function (kind) {
    var list = Object.keys(MOV).map(function (k) { return MOV[k]; })
      .filter(function (m) { return kind === 'all' || m.data.kind === kind; });
    return list.length > 0 && list.every(function (m) { return goal(m) > 0.5; });
  };
  P3D.count = function (kind) {
    return Object.keys(MOV).filter(function (k) { return kind === 'all' || MOV[k].data.kind === kind; }).length;
  };
  P3D.setSoft = function (v) { soft = v !== false; };

  var EDGE = new T.LineBasicMaterial({ color: 0x2a2723, transparent: true, opacity: 0.55 });

  // parts: builder parts (already filtered for visibility); mats: name → info
  // movers: builder movers [{id, kind, pivot, axis, angle, travel}]; open state
  // (and any motion in progress) carries over when the module is rebuilt.
  P3D.update = function (parts, mats, movers) {
    if (!renderer) { return; }
    function dispose(o) {
      o.children.slice().forEach(dispose);
      if (o.geometry) { o.geometry.dispose(); }
    }
    root.children.slice().forEach(function (o) { root.remove(o); dispose(o); });
    bbox.makeEmpty();
    var old = MOV;
    MOV = {};
    (movers || []).forEach(function (d) {
      var g = new T.Group();
      g.userData.moverId = d.id;
      root.add(g);
      var o = old[d.id];
      MOV[d.id] = { data: d, group: g, f: o ? o.f : 0, anim: o ? o.anim : null };
      place(MOV[d.id]);
    });
    parts.forEach(function (p) {
      var info = mats(p.mat);
      var m = material(p.mat || '', info);
      var g = p.shape === 'cyl' ? cylGeometry(p) : prismGeometry(p, m.userData.texmm);
      var parent = p.mover && MOV[p.mover] ? MOV[p.mover].group : root;
      var mesh = new T.Mesh(g, m);
      parent.add(mesh);
      if (p.shape !== 'cyl') { parent.add(new T.LineSegments(new T.EdgesGeometry(g, 25), EDGE)); }
      g.computeBoundingBox();
      bbox.union(g.boundingBox);
    });
    buildDims();
    if (!hasView && !bbox.isEmpty()) { P3D.reset('iso'); hasView = true; }
    dirty = true;
  };

  // ------------------------------------------------------------------ overall dimension lines
  // Width, height and depth of everything drawn (doors, top, legs included; doors closed), as
  // dimension lines beside the module with the size in mm. Off unless the app turns it on.
  var dimsOn = false, dimsGroup = null;
  var DIM_LINE = new T.LineBasicMaterial({ color: 0x1d2a30 });
  function dimLabel(txt, h) {
    var c = document.createElement('canvas'), x = c.getContext('2d');
    var fs = 64;
    x.font = '700 ' + fs + 'px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    var tw = Math.ceil(x.measureText(txt).width);
    c.width = tw + 36; c.height = fs + 28;
    x.font = '700 ' + fs + 'px system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    x.fillStyle = 'rgba(255,255,255,0.92)';
    var r = 14, w = c.width, hh = c.height;
    x.beginPath(); x.moveTo(r, 0); x.lineTo(w - r, 0); x.quadraticCurveTo(w, 0, w, r); x.lineTo(w, hh - r);
    x.quadraticCurveTo(w, hh, w - r, hh); x.lineTo(r, hh); x.quadraticCurveTo(0, hh, 0, hh - r); x.lineTo(0, r);
    x.quadraticCurveTo(0, 0, r, 0); x.fill();
    x.strokeStyle = 'rgba(29,42,48,0.35)'; x.lineWidth = 3; x.stroke();
    x.fillStyle = '#1d2a30'; x.textBaseline = 'middle'; x.textAlign = 'center';
    x.fillText(txt, w / 2, hh / 2 + 2);
    var tex = new T.CanvasTexture(c);
    var sp = new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false, depthWrite: false, transparent: true, sizeAttenuation: false }));
    sp.userData.aspect = w / hh;
    sp.renderOrder = 10;
    return sp;
  }
  function buildDims() {
    if (dimsGroup) {
      scene.remove(dimsGroup);
      dimsGroup.traverse(function (o) {
        if (o.geometry) { o.geometry.dispose(); }
        if (o.material && o.material.map) { o.material.map.dispose(); o.material.dispose(); }
      });
      dimsGroup = null;
    }
    if (!dimsOn || bbox.isEmpty()) { return; }
    var mn = bbox.min, mx = bbox.max, size = bbox.getSize(new T.Vector3());
    var big = Math.max(size.x, size.y, size.z);
    var off = Math.max(60, big * 0.09), tick = Math.max(12, big * 0.018), lh = Math.max(40, big * 0.055);
    var pts = [];
    dimsGroup = new T.Group();
    function seg(a, b) { pts.push(a.x, a.y, a.z, b.x, b.y, b.z); }
    // a → b measured, drawn moved out along o (unit vector)
    function dim(a, b, o, value) {
      var o1 = o.clone().multiplyScalar(off), gap = o.clone().multiplyScalar(off * 0.15), over = o.clone().multiplyScalar(off * 1.12);
      var A = a.clone().add(o1), B = b.clone().add(o1);
      seg(a.clone().add(gap), a.clone().add(over));
      seg(b.clone().add(gap), b.clone().add(over));
      seg(A, B);
      var dir = B.clone().sub(A).normalize();
      var tk = dir.clone().add(o).normalize().multiplyScalar(tick / 2);
      seg(A.clone().sub(tk), A.clone().add(tk));
      seg(B.clone().sub(tk), B.clone().add(tk));
      var lbl = dimLabel(String(Math.round(value * 10) / 10), lh);
      lbl.position.copy(A).add(B).multiplyScalar(0.5).add(o.clone().multiplyScalar(lh * 0.75));
      dimsGroup.add(lbl);
    }
    var V = function (x, y, z) { return new T.Vector3(x, y, z); };
    dim(V(mn.x, mn.y, mn.z), V(mx.x, mn.y, mn.z), V(0, -1, 0), size.x);   // width, along the front at the floor
    dim(V(mn.x, mx.y, mn.z), V(mn.x, mx.y, mx.z), V(-1, 0, 0), size.z);   // height, up the back-left edge (clear of the side)
    dim(V(mx.x, mn.y, mn.z), V(mx.x, mx.y, mn.z), V(1, 0, 0), size.y);    // depth, along the right side
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pts, 3));
    dimsGroup.add(new T.LineSegments(g, DIM_LINE));
    scene.add(dimsGroup);
    sizeLabels();
  }
  // Labels keep the same size on screen (about 20 px tall) at any zoom and on any screen.
  function sizeLabels() {
    if (!dimsGroup || !host) { return; }
    var k = 20 / (host.clientHeight || 300) * 2 * Math.tan(T.MathUtils.degToRad(FOV) / 2);
    dimsGroup.children.forEach(function (o) { if (o.isSprite) { o.scale.set(k * o.userData.aspect, k, 1); } });
  }
  // Turn the overall dimension lines on / off (PanelPro Web shows them; the plugin leaves them off).
  P3D.setDims = function (on) {
    dimsOn = !!on;
    if (renderer) { buildDims(); dirty = true; }
  };
  P3D.dimsOn = function () { return dimsOn; };
  function viewBox() {
    var b = bbox.clone();
    if (dimsGroup) { b.union(new T.Box3().setFromObject(dimsGroup)); }
    return b;
  }

  // ------------------------------------------------------------------ still pictures
  // Draw a module on a hidden canvas and return it as a JPEG data URL (module manual).
  // opts: { open: true → doors / drawers at their open position, w, h, dir: [x, y, z] }
  var snapR = null;
  P3D.snapshot = function (parts, mats, movers, opts) {
    opts = opts || {};
    var w = opts.w || 900, h = opts.h || 700;
    try {
      if (!snapR) {
        snapR = new T.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: true });
        snapR.setClearColor(0xffffff, 1);
      }
      snapR.setPixelRatio(1);
      snapR.setSize(w, h, false);
    } catch (e) { return null; }
    var sc = new T.Scene();
    sc.add(new T.HemisphereLight(0xffffff, 0xb9b2a6, 0.75));
    var dl = new T.DirectionalLight(0xffffff, 0.55);
    dl.position.set(-0.6, -1, 1.3);
    sc.add(dl);
    var groups = {}, box = new T.Box3(), geos = [];
    (movers || []).forEach(function (d) {
      var g = new T.Group();
      sc.add(g);
      place({ data: d, group: g, f: opts.open ? 1 : 0 });
      groups[d.id] = g;
    });
    parts.forEach(function (p) {
      var info = mats(p.mat);
      if (info && info.thumb) { info = { color: info.color, alpha: info.alpha }; } // no texture loading for stills
      var m = material(p.mat || '', info);
      var g = p.shape === 'cyl' ? cylGeometry(p) : prismGeometry(p, null);
      geos.push(g);
      var parent = p.mover && groups[p.mover] ? groups[p.mover] : sc;
      parent.add(new T.Mesh(g, m));
      if (p.shape !== 'cyl') { var eg = new T.EdgesGeometry(g, 25); geos.push(eg); parent.add(new T.LineSegments(eg, EDGE)); }
    });
    sc.updateMatrixWorld(true);
    box.setFromObject(sc);
    if (box.isEmpty()) { return null; }
    var cam = new T.PerspectiveCamera(FOV, w / h, 1, 100000);
    cam.up.set(0, 0, 1);
    var dir = new T.Vector3().fromArray(opts.dir || [-1, -1.35, 0.9]).normalize();
    var c = box.getCenter(new T.Vector3()), r = box.getBoundingSphere(new T.Sphere()).radius;
    var fov = T.MathUtils.degToRad(FOV) / 2, fit = Math.min(fov, Math.atan(Math.tan(fov) * w / h));
    cam.position.copy(c).addScaledVector(dir, r / Math.sin(fit) * 1.02);
    cam.lookAt(c);
    snapR.render(sc, cam);
    var url = snapR.domElement.toDataURL('image/jpeg', 0.88);
    geos.forEach(function (g) { g.dispose(); });
    return url;
  };

  // ------------------------------------------------------------------ views
  function fit(dir, keepDir) {
    if (bbox.isEmpty()) { return; }
    var vb = viewBox();
    var c = vb.getCenter(new T.Vector3());
    var sphere = vb.getBoundingSphere(new T.Sphere());
    var d = keepDir ? persp.position.clone().sub(target).normalize() : dir.clone().normalize();
    var dist = sphere.radius / Math.sin(T.MathUtils.degToRad(FOV) / 2) * 1.02;
    target.copy(c);
    persp.position.copy(c).addScaledVector(d, dist);
    var size = vb.getSize(new T.Vector3());
    var a = (host.clientWidth || 300) / (host.clientHeight || 200);
    orthoHalf = Math.max(size.z / 2, size.x / 2 / a, size.y / 2 / a) * 1.12;
    if (!keepDir) { orthoHalf = Math.max(size.z / 2, size.x / 2 / a) * 1.12; }
    dirty = true;
  }

  // 'front' = straight-on parallel projection; 'iso' = 3D view from front-left, above.
  P3D.reset = function (mode) {
    if (mode === 'front') { useOrtho = true; fit(new T.Vector3(0, -1, 0)); }
    else { useOrtho = false; fit(new T.Vector3(-1, -1.35, 0.9)); }
    dirty = true;
  };

  P3D.zoomExtents = function () { fit(null, true); };

  // ------------------------------------------------------------------ navigation
  function viewH() { return host.clientHeight || 200; }
  function worldPerPixel() {
    if (useOrtho) { return (2 * orthoHalf) / viewH(); }
    var dist = persp.position.distanceTo(target);
    return 2 * dist * Math.tan(T.MathUtils.degToRad(FOV) / 2) / viewH();
  }

  // leaving the parallel Front view: put the perspective camera where it shows the same area
  function toPerspective() {
    if (!useOrtho) { return; }
    var d = persp.position.clone().sub(target).normalize();
    var dist = orthoHalf / Math.tan(T.MathUtils.degToRad(FOV) / 2);
    persp.position.copy(target).addScaledVector(d, dist);
    useOrtho = false;
  }

  function orbit(dx, dy) {
    toPerspective();
    var off = persp.position.clone().sub(target);
    off.applyAxisAngle(new T.Vector3(0, 0, 1), -dx * 0.008);
    var right = new T.Vector3().crossVectors(off, new T.Vector3(0, 0, 1)).normalize();
    var test = off.clone().applyAxisAngle(right, -dy * 0.008);
    var ang = test.angleTo(new T.Vector3(0, 0, 1));
    if (ang > 0.03 && ang < Math.PI - 0.03) { off = test; }
    persp.position.copy(target).add(off);
    dirty = true;
  }

  function pan(dx, dy) {
    var k = worldPerPixel();
    persp.lookAt(target);
    persp.updateMatrixWorld();
    var right = new T.Vector3().setFromMatrixColumn(persp.matrixWorld, 0);
    var up = new T.Vector3().setFromMatrixColumn(persp.matrixWorld, 1);
    var move = right.multiplyScalar(-dx * k).add(up.multiplyScalar(dy * k));
    persp.position.add(move);
    target.add(move);
    dirty = true;
  }

  function ndc(ev) {
    var r = renderer.domElement.getBoundingClientRect();
    return new T.Vector2(((ev.clientX - r.left) / r.width) * 2 - 1, -((ev.clientY - r.top) / r.height) * 2 + 1);
  }

  // Point under the cursor: on the model if hit, else on the plane through the target.
  function pointAt(ev) {
    var c = cam();
    persp.lookAt(target);
    if (useOrtho) { syncOrtho(); }
    c.updateMatrixWorld();
    var rc = new T.Raycaster();
    rc.setFromCamera(ndc(ev), c);
    var hits = rc.intersectObjects(meshes(), false);
    if (hits.length) { return hits[0].point; }
    var n = persp.position.clone().sub(target).normalize();
    var plane = new T.Plane().setFromNormalAndCoplanarPoint(n, target);
    var p = new T.Vector3();
    return rc.ray.intersectPlane(plane, p) ? p : target.clone();
  }

  function meshes() {
    var out = [];
    root.traverse(function (o) { if (o.isMesh) { out.push(o); } });
    return out;
  }

  // Door / drawer under the cursor (or null).
  function moverAt(ev) {
    var c = cam();
    persp.lookAt(target);
    if (useOrtho) { syncOrtho(); }
    c.updateMatrixWorld();
    root.updateMatrixWorld(true);
    var rc = new T.Raycaster();
    rc.setFromCamera(ndc(ev), c);
    var hits = rc.intersectObjects(meshes(), false);
    if (!hits.length) { return null; }
    var o = hits[0].object;
    while (o && o !== root) { if (o.userData.moverId) { return MOV[o.userData.moverId]; } o = o.parent; }
    return null;
  }

  function zoom(factor, ev) {
    var p = ev ? pointAt(ev) : target.clone();
    if (useOrtho) {
      orthoHalf = Math.max(5, orthoHalf * factor);
      var shift = target.clone().sub(p).multiplyScalar(factor - 1);
      target.add(shift); persp.position.add(shift);
    } else {
      var np = p.clone().add(persp.position.clone().sub(p).multiplyScalar(factor));
      var nt = p.clone().add(target.clone().sub(p).multiplyScalar(factor));
      if (np.distanceTo(nt) > 5) { persp.position.copy(np); target.copy(nt); }
    }
    dirty = true;
  }

  function wire(el) {
    el.tabIndex = 0;
    el.addEventListener('mouseenter', function () { hover = true; });
    el.addEventListener('mouseleave', function () { hover = false; });
    el.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    el.addEventListener('mousedown', function (e) {
      if (e.button === 1) { e.preventDefault(); } // no autoscroll
      if (e.button !== 0 && e.button !== 1) { return; }
      var mode;
      if (e.button === 1) { mode = e.shiftKey ? 'pan' : 'orbit'; }
      else { mode = e.shiftKey ? 'pan' : leftTool; }
      drag = { x: e.clientX, y: e.clientY, x0: e.clientX, y0: e.clientY, mode: mode, button: e.button };
      el.focus();
    });
    // a left click without dragging opens / closes the door or drawer under the cursor
    el.addEventListener('mouseup', function (e) {
      if (e.button !== 0 || !drag || drag.button !== 0) { return; }
      if (Math.abs(e.clientX - drag.x0) + Math.abs(e.clientY - drag.y0) > 4) { return; }
      var m = moverAt(e);
      if (m) { moveTo(m, goal(m) > 0.5 ? 0 : 1); dirty = true; if (P3D.onMotion) { P3D.onMotion(); } }
    });
    el.addEventListener('mousemove', function (e) {
      if (drag) { return; }
      el.style.cursor = moverAt(e) ? 'pointer' : '';
    });
    window.addEventListener('mousemove', function (e) {
      if (!drag) { return; }
      var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      drag.x = e.clientX; drag.y = e.clientY;
      if (drag.mode === 'orbit') { orbit(dx, dy); }
      else if (drag.mode === 'pan') { pan(dx, dy); }
      else if (drag.mode === 'zoom') { zoom(Math.exp(dy * 0.006), null); }
    });
    window.addEventListener('mouseup', function () { drag = null; });
    el.addEventListener('wheel', function (e) {
      e.preventDefault();
      var dy = e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;
      zoom(Math.exp(dy * 0.0015), e);
    }, { passive: false });
    // double-click middle button: centre on that point
    var lastMid = 0;
    el.addEventListener('mouseup', function (e) {
      if (e.button !== 1) { return; }
      var now = Date.now();
      if (now - lastMid < 350) {
        var p = pointAt(e);
        var shift = p.clone().sub(target);
        target.add(shift); persp.position.add(shift);
        dirty = true;
      }
      lastMid = now;
    });
    el.addEventListener('auxclick', function (e) { if (e.button === 1) { e.preventDefault(); } });
    document.addEventListener('keydown', function (e) {
      if (!hover || !host || host.offsetParent === null) { return; }
      var tag = (document.activeElement && document.activeElement.tagName) || '';
      if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') { return; }
      var k = e.key.toLowerCase();
      if (k === 'z' && e.shiftKey) { P3D.zoomExtents(); }
      else if (k === 'o') { leftTool = 'orbit'; }
      else if (k === 'h') { leftTool = 'pan'; }
      else if (k === 'z') { leftTool = 'zoom'; }
      else if (k === 'escape') { leftTool = 'orbit'; }
      else { return; }
      if (P3D.onTool) { P3D.onTool(leftTool); }
      e.preventDefault();
    });
    wireTouch(el);
    if (window.ResizeObserver) { new ResizeObserver(function () { P3D.resize(); }).observe(host); }
    else { window.addEventListener('resize', function () { P3D.resize(); }); }
  }

  // Touch screens (PanelPro Web on a phone): one finger turns, two fingers pinch to zoom
  // and drag to pan, a tap opens / closes the door or drawer under it, a double tap fits
  // the module to the view. Mouse handling above is unchanged.
  function wireTouch(el) {
    el.style.touchAction = 'none';
    var t = null; // { x, y, x0, y0, time, moved, dist, mx, my }
    var lastTap = 0;
    function pt(touch) { return { clientX: touch.clientX, clientY: touch.clientY }; }
    function two(e) {
      var a = e.touches[0], b = e.touches[1];
      return { dist: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY),
               mx: (a.clientX + b.clientX) / 2, my: (a.clientY + b.clientY) / 2 };
    }
    el.addEventListener('touchstart', function (e) {
      e.preventDefault();
      if (e.touches.length === 1) {
        var p = e.touches[0];
        t = { x: p.clientX, y: p.clientY, x0: p.clientX, y0: p.clientY, time: Date.now(), moved: false };
      } else if (e.touches.length === 2) {
        var g = two(e);
        t = { pinch: true, dist: g.dist, mx: g.mx, my: g.my, moved: true };
      }
    }, { passive: false });
    el.addEventListener('touchmove', function (e) {
      e.preventDefault();
      if (!t) { return; }
      if (e.touches.length === 2) {
        var g = two(e);
        if (!t.pinch) { t = { pinch: true, dist: g.dist, mx: g.mx, my: g.my, moved: true }; return; }
        if (g.dist > 0 && t.dist > 0) { zoom(t.dist / g.dist, { clientX: g.mx, clientY: g.my }); }
        pan(g.mx - t.mx, g.my - t.my);
        t.dist = g.dist; t.mx = g.mx; t.my = g.my;
      } else if (e.touches.length === 1 && !t.pinch) {
        var p = e.touches[0];
        var dx = p.clientX - t.x, dy = p.clientY - t.y;
        t.x = p.clientX; t.y = p.clientY;
        if (Math.abs(p.clientX - t.x0) + Math.abs(p.clientY - t.y0) > 8) { t.moved = true; }
        if (t.moved) { orbit(dx, dy); }
      }
    }, { passive: false });
    el.addEventListener('touchend', function (e) {
      e.preventDefault();
      if (!t) { return; }
      if (e.touches.length > 0) { // one finger of a pinch lifted: carry on turning with the other
        if (t.pinch && e.touches.length === 1) {
          var q = e.touches[0];
          t = { x: q.clientX, y: q.clientY, x0: q.clientX, y0: q.clientY, time: Date.now(), moved: true };
        }
        return;
      }
      if (!t.moved && Date.now() - t.time < 400) {
        var now = Date.now();
        var m = moverAt(pt(e.changedTouches[0]));
        if (m) {
          moveTo(m, goal(m) > 0.5 ? 0 : 1); dirty = true;
          if (P3D.onMotion) { P3D.onMotion(); }
        } else if (now - lastTap < 350) {
          P3D.zoomExtents();
        }
        lastTap = now;
      }
      t = null;
    }, { passive: false });
    el.addEventListener('touchcancel', function () { t = null; });
  }

  P3D.tool = function () { return leftTool; };
  P3D.redraw = function () { dirty = true; };
})();
