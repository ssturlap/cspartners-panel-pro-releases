/* CSPARTNERS PANEL PRO Web — runs the shared module engine (the plugin's core/*.rb, unchanged)
 * inside the browser with ruby.wasm. No server: everything happens on the phone.
 *
 *   await Engine.start(onProgress)        // once; ~5 MB download the first time, then cached offline
 *   Engine.call('build', { params, lang }) // → data, or throws Error(message)
 */
(function () {
  'use strict';
  var Engine = { ready: false, version: null };
  window.Engine = Engine;
  var vm = null;

  function fetchWithProgress(url, onProgress, label) {
    return fetch(url).then(function (r) {
      if (!r.ok) { throw new Error(url + ': ' + r.status); }
      var total = +(r.headers.get('content-length') || 0);
      if (!r.body || !total || !onProgress) { return r.arrayBuffer(); }
      var reader = r.body.getReader(), got = 0, chunks = [];
      function pump() {
        return reader.read().then(function (s) {
          if (s.done) {
            var out = new Uint8Array(got), o = 0;
            chunks.forEach(function (c) { out.set(c, o); o += c.length; });
            return out.buffer;
          }
          chunks.push(s.value); got += s.value.length;
          onProgress(label, Math.min(1, got / total));
          return pump();
        });
      }
      return pump();
    });
  }

  // { 'json/common.rb': '…' } → nested WASI directories
  function tree(files) {
    var W = window['ruby-wasm-wasi'], enc = new TextEncoder();
    var root = new Map();
    Object.keys(files).forEach(function (path) {
      var parts = path.split('/'), dir = root;
      for (var i = 0; i < parts.length - 1; i++) {
        var d = dir.get(parts[i]);
        if (!d) { d = new W.Directory(new Map()); dir.set(parts[i], d); }
        dir = d.contents;
      }
      dir.set(parts[parts.length - 1], new W.WasiFile(enc.encode(files[path])));
    });
    return root;
  }

  Engine.start = function (onProgress) {
    if (Engine._starting) { return Engine._starting; }
    var W = window['ruby-wasm-wasi'];
    Engine._starting = Promise.all([
      fetchWithProgress('engine/ruby.wasm', onProgress, 'engine').then(function (b) { return WebAssembly.compile(b); }),
      fetch('engine/lib.json').then(function (r) { return r.json(); })
    ]).then(function (got) {
      var mod = got[0], lib = got[1];
      var files = Object.assign({}, lib.stdlib, lib.app);
      var wasi = new W.WASI([], [], [
        new W.OpenFile(new W.WasiFile([])), new W.OpenFile(new W.WasiFile([])), new W.OpenFile(new W.WasiFile([])),
        new W.PreopenDirectory('/lib', tree(files))
      ], { debug: false });
      var printer = W.consolePrinter();
      return W.RubyVM.instantiateModule({
        module: mod, wasip1: wasi,
        args: ['ruby.wasm', '-EUTF-8', '--disable-gems', '-I/lib', '-e_=0'],
        addToImports: function (imp) { printer.addToImports(imp); },
        setMemory: function (m) { printer.setMemory(m); }
      }).then(function (r) {
        vm = r.vm;
        Engine._mem = r.instance.exports.memory; Engine._vm = vm;
        // the shared core, in the plugin's load order, then the web bridge
        lib.load.forEach(function (f) { vm.eval('require ' + JSON.stringify(f)); });
        Engine.ready = true;
        Engine.version = lib.version;
        return Engine;
      });
    });
    return Engine._starting;
  };

  function rubyString(s) { return "'" + s.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'"; }

  // Synchronous call into Ruby (the engine is fast: a module builds in a few ms).
  Engine.call = function (method, arg) {
    if (!vm) { throw new Error('engine not started'); }
    var out = vm.eval('CSPartners::PanelPro::Web.call(' + rubyString(method) + ', ' +
                      rubyString(JSON.stringify(arg || {})) + ')').toString();
    var res = JSON.parse(out);
    if (!res.ok) { var e = new Error(res.error); e.build = !!res.build; e.where = res.where; throw e; }
    return res.data;
  };
})();
