/* PanelPro Web — cut list as an Excel workbook (.xlsx, via JSZip) or a PDF (Letter, via pdf-lib).
 * Interface only: every number comes from the shared engine's project data (Engine.call('project')).
 *
 *   PPExport.xlsx(d, meta) → Promise<Blob>      PPExport.pdf(d, meta) → Promise<Blob>
 *   meta: { site, client, notes, date, version, t(text), head: [CSV column titles from the engine] }
 */
(function () {
  'use strict';

  function num(v) { var n = Number(v); return isFinite(n) ? Math.round(n * 10) / 10 : v; }
  function fmt(v) { return String(num(v)); }
  function dimsOf(m) { return m ? fmt(m.width) + ' × ' + fmt(m.height) + ' × ' + fmt(m.depth) + ' mm' : ''; }
  function byCode(d) {
    var groups = [], idx = {};
    d.cutlist.rows.forEach(function (r) {
      if (!idx[r.code]) { idx[r.code] = { code: r.code, name: r.module, rows: [] }; groups.push(idx[r.code]); }
      idx[r.code].rows.push(r);
    });
    var man = {};
    (d.manual || []).forEach(function (m) { man[m.code] = m; });
    groups.forEach(function (g) { g.dims = dimsOf(man[g.code]); });
    return groups;
  }
  function kickLines(d, t) {
    var out = [];
    (d.kick || []).forEach(function (k) {
      out.push([fmt(k.h) + ' mm: ' + k.pieces + ' ' + t('pieces') + ', ' + fmt(k.metres) + ' m', k.bars.length + ' ' + t(k.bars.length === 1 ? 'bar' : 'bars')]);
      k.bars.forEach(function (b, i) {
        out.push(['  ' + t('Bar') + ' ' + (i + 1) + ': ' + b.cuts.map(function (c) { return fmt(c.len) + (c.code ? ' (' + c.code + ')' : ''); }).join(' + '),
                  t('offcut') + ' ' + fmt(b.offcut)]);
      });
    });
    return out;
  }

  // ---------------------------------------------------------------- Excel
  function xmlEsc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; })
      .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '');
  }
  function col(i) { var s = ''; i += 1; while (i > 0) { var r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = Math.floor((i - 1) / 26); } return s; }
  // rows: arrays of values or { v, s } (s = style: 1 bold, 2 header)
  function sheetXml(rows, widths, freeze) {
    var x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">';
    if (freeze) { x += '<sheetViews><sheetView workbookViewId="0"><pane ySplit="' + freeze + '" topLeftCell="A' + (freeze + 1) + '" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>'; }
    x += '<cols>' + widths.map(function (w, i) { return '<col min="' + (i + 1) + '" max="' + (i + 1) + '" width="' + w + '" customWidth="1"/>'; }).join('') + '</cols><sheetData>';
    rows.forEach(function (row, ri) {
      x += '<row r="' + (ri + 1) + '">';
      row.forEach(function (cell, ci) {
        if (cell == null || cell === '') { return; }
        var v = cell, s = 0;
        if (typeof cell === 'object') { v = cell.v; s = cell.s || 0; }
        var ref = col(ci) + (ri + 1), st = s ? ' s="' + s + '"' : '';
        if (typeof v === 'number' && isFinite(v)) { x += '<c r="' + ref + '"' + st + '><v>' + v + '</v></c>'; }
        else { x += '<c r="' + ref + '"' + st + ' t="inlineStr"><is><t xml:space="preserve">' + xmlEsc(v) + '</t></is></c>'; }
      });
      x += '</row>';
    });
    return x + '</sheetData></worksheet>';
  }

  function xlsx(d, meta) {
    var t = meta.t, head = meta.head, cut = d.cutlist;
    var H = function (s) { return { v: s, s: 2 }; }, B = function (s) { return { v: s, s: 1 }; };
    // Sheet 1: the cut list as one plain table from A1 (ready to copy into the saw software)
    var rows1 = [head.map(H)];
    cut.rows.forEach(function (r) {
      var e = r.edges || {};
      rows1.push([r.code, r.module, r.part, r.qty, num(r.L), num(r.W), num(r.T),
                  e.L1 ? 'X' : '', e.L2 ? 'X' : '', e.W1 ? 'X' : '', e.W2 ? 'X' : '', r.mat, r.note || '']);
    });
    // Sheet 2: site + totals
    var rows2 = [[B(meta.site)], [meta.client || ''], [meta.date + ' · PanelPro Web ' + meta.version], []];
    if (meta.notes) { rows2.splice(2, 0, [meta.notes]); }
    function block(title, cols, list) {
      if (!list.length) { return; }
      rows2.push(cols ? [H(title)].concat(cols.map(H)) : [H(title)]);
      list.forEach(function (r) { rows2.push(r); });
      rows2.push([]);
    }
    block(t('Hardware'), [head[3]], cut.hardware.map(function (h) { return [h.item, h.qty]; }));
    block(t('Edge banding'), ['m'], cut.banding.map(function (b) { return [b.mat, num(b.m)]; }));
    block(t('Sheets (estimate incl. 15% waste)'), [head[6], 'm²', t('Sheet size'), t('Sheets')],
          cut.sheets.map(function (s) { return [s.mat, num(s.T), num(s.m2), s.size, s.sheets]; }));
    block(t('Toe kick bars (4 m)'), [''], kickLines(d, t));
    var warn = (cut.warnings || []).concat((d.errors || []).map(function (e) { return e.code + ': ' + e.error; }));
    block(t('Warnings'), null, warn.map(function (w) { return [w]; }));

    var zip = new JSZip();
    zip.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
      '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
      '<Default Extension="xml" ContentType="application/xml"/>' +
      '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/worksheets/sheet2.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
      '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
      '</Types>');
    zip.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    var name1 = xmlEsc(t('Cut list').slice(0, 31)), name2 = xmlEsc(t('Summary').slice(0, 31));
    zip.file('xl/workbook.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
      '<sheets><sheet name="' + name1 + '" sheetId="1" r:id="rId1"/><sheet name="' + name2 + '" sheetId="2" r:id="rId2"/></sheets></workbook>');
    zip.file('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
      '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' +
      '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet2.xml"/>' +
      '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>');
    zip.file('xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
      '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
      '<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>' +
      '<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill>' +
      '<fill><patternFill patternType="solid"><fgColor rgb="FFF3C623"/><bgColor indexed="64"/></patternFill></fill></fills>' +
      '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>' +
      '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' +
      '<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
      '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
      '<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/></cellXfs>' +
      '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>');
    zip.file('xl/worksheets/sheet1.xml', sheetXml(rows1, [7, 22, 26, 6, 16, 11, 13, 5, 5, 5, 5, 22, 50], 1));
    zip.file('xl/worksheets/sheet2.xml', sheetXml(rows2, [58, 12, 10, 14, 10], 0));
    return zip.generateAsync({ type: 'blob', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', compression: 'DEFLATE' });
  }

  // ---------------------------------------------------------------- PDF
  function pdf(d, meta) {
    var P = window.PDFLib, t = meta.t, head = meta.head, cut = d.cutlist;
    var INK = P.rgb(0.114, 0.165, 0.188), TAPE = P.rgb(0.953, 0.776, 0.137), GREY = P.rgb(0.36, 0.42, 0.44),
        LINE = P.rgb(0.80, 0.83, 0.84), BAND = P.rgb(0.965, 0.972, 0.976), WHITE = P.rgb(1, 1, 1), WARN = P.rgb(0.54, 0.29, 0);
    var W = 612, Hh = 792, M = 36;
    return P.PDFDocument.create().then(function (doc) {
      doc.setTitle(t('Cut list') + ' — ' + meta.site);
      doc.setCreator('PanelPro Web ' + meta.version);
      return Promise.all([doc.embedFont(P.StandardFonts.Helvetica), doc.embedFont(P.StandardFonts.HelveticaBold)]).then(function (f) {
        var R = f[0], Bd = f[1], ok = {};
        // Standard PDF fonts cover Western European text; anything else prints as '?'
        function safe(s, font) {
          s = String(s == null ? '' : s).replace(/[−]/g, '-').replace(/[   ]/g, ' ');
          var out = '';
          for (var i = 0; i < s.length; i++) {
            var ch = s[i], k = (font === Bd ? 'b' : 'r') + ch;
            if (ok[k] === undefined) { try { font.widthOfTextAtSize(ch, 10); ok[k] = true; } catch (e) { ok[k] = false; } }
            out += ok[k] ? ch : '?';
          }
          return out;
        }
        function width(s, font, size) { return font.widthOfTextAtSize(safe(s, font), size); }
        function wrap(s, font, size, w) {
          var words = safe(s, font).split(/\s+/), lines = [], cur = '';
          words.forEach(function (wd) {
            var next = cur ? cur + ' ' + wd : wd;
            if (cur && font.widthOfTextAtSize(next, size) > w) { lines.push(cur); cur = wd; } else { cur = next; }
          });
          if (cur) { lines.push(cur); }
          return lines.length ? lines : [''];
        }
        var page, y;
        function newPage() { page = doc.addPage([W, Hh]); y = Hh - M; }
        function text(s, x, yy, size, font, color) { page.drawText(safe(s, font), { x: x, y: yy, size: size, font: font, color: color || INK }); }
        function rtext(s, xr, yy, size, font, color) { text(s, xr - width(s, font, size), yy, size, font, color); }
        function need(h) { if (y - h < M + 24) { newPage(); return true; } return false; }

        newPage();
        text(t('Cut list'), M, y - 22, 22, Bd);
        y -= 46;
        text(meta.site, M, y, 14, Bd); y -= 18;
        var sub = [meta.client, meta.date, (d.manual || []).length + ' ' + t('modules')].filter(Boolean).join('  ·  ');
        text(sub, M, y, 10, R, GREY); y -= 14;
        if (meta.notes) { wrap(meta.notes, R, 10, W - 2 * M).forEach(function (l) { text(l, M, y, 10, R, GREY); y -= 13; }); }
        y -= 10;

        var warns = (cut.warnings || []).concat((d.errors || []).map(function (e) { return e.code + ': ' + e.error; }));
        warns.forEach(function (w) {
          wrap(w, R, 9, W - 2 * M).forEach(function (l) { need(12); text(l, M, y, 9, R, WARN); y -= 12; });
        });
        if (warns.length) { y -= 8; }

        // columns: qty | part (+ edges) | length | width | thickness | material / notes (sizes in mm, one column each)
        var cQ = M + 6, cP = M + 34, cL = M + 262, cW = M + 316, cT = M + 356, cN = M + 368, wP = 150, wN = W - M - cN - 4;
        function colHead() {
          text(head[3], cQ, y, 7.5, Bd, GREY); text(head[2], cP, y, 7.5, Bd, GREY);
          rtext(head[4], cL, y, 7.5, Bd, GREY); rtext(head[5], cW, y, 7.5, Bd, GREY);
          rtext(/^Esp/i.test(head[6]) ? 'Esp. mm' : 'Thick. mm', cT, y, 7.5, Bd, GREY);
          text(head[11] + ' / ' + head[12], cN, y, 7.5, Bd, GREY);
          page.drawLine({ start: { x: M, y: y - 4 }, end: { x: W - M, y: y - 4 }, thickness: 0.5, color: LINE });
          y -= 17;
        }
        function band(g, cont) {
          need(54);
          page.drawRectangle({ x: M, y: y - 24, width: W - 2 * M, height: 26, color: INK });
          var cw = Math.max(26, width(g.code, Bd, 12) + 14);
          page.drawRectangle({ x: M + 5, y: y - 20, width: cw, height: 18, color: TAPE });
          text(g.code, M + 5 + (cw - width(g.code, Bd, 12)) / 2, y - 15, 12, Bd, INK);
          text(g.name + (cont ? ' (' + t('cont.') + ')' : ''), M + 5 + cw + 10, y - 15, 11.5, Bd, WHITE);
          if (g.dims) { rtext(g.dims, W - M - 8, y - 15, 10, R, WHITE); }
          y -= 38;
          colHead();
        }
        byCode(d).forEach(function (g) {
          band(g, false);
          g.rows.forEach(function (r, i) {
            var part = wrap(r.part, R, 9.5, wP);
            var noteTxt = [r.mat, r.note].filter(Boolean).join(' · ');
            var notes = wrap(noteTxt, R, 8, wN);
            var lines = Math.max(part.length + (r.eb ? 1 : 0), notes.length);
            var h = lines * 11 + 7;
            if (need(h)) { band(g, true); }
            if (i % 2 === 0) { page.drawRectangle({ x: M, y: y - h + 9, width: W - 2 * M, height: h, color: BAND }); }
            var yy = y;
            text(r.qty + '×', cQ, yy, 9.5, Bd);
            part.forEach(function (l, k) { text(l, cP, yy - k * 11, 9.5, R); });
            if (r.eb) { text(t('Edge') + ' ' + r.eb, cP, yy - part.length * 11, 7.5, R, GREY); }
            rtext(fmt(r.L), cL, yy, 10, Bd);
            rtext(fmt(r.W), cW, yy, 10, Bd);
            rtext(fmt(r.T), cT, yy, 9, R);
            notes.forEach(function (l, k) { text(l, cN, yy - k * 11, 8, R, GREY); });
            y -= h;
          });
          y -= 12;
        });

        function table(title, rows) {
          if (!rows.length) { return; }
          need(40);
          text(title, M, y, 12, Bd); y -= 8;
          page.drawLine({ start: { x: M, y: y }, end: { x: W - M, y: y }, thickness: 1, color: INK }); y -= 14;
          rows.forEach(function (r) {
            var ls = wrap(r[0], R, 9.5, W - 2 * M - 110);
            need(ls.length * 12 + 4);
            ls.forEach(function (l, k) { text(l, M, y - k * 12, 9.5, R); });
            rtext(String(r[1]), W - M, y, 9.5, Bd);
            y -= ls.length * 12 + 2;
            page.drawLine({ start: { x: M, y: y + 7 }, end: { x: W - M, y: y + 7 }, thickness: 0.5, color: LINE });
            y -= 4;
          });
          y -= 12;
        }
        table(t('Hardware'), cut.hardware.map(function (h) { return [h.item, h.qty]; }));
        table(t('Toe kick bars (4 m)'), kickLines(d, t));
        table(t('Edge banding'), cut.banding.map(function (b) { return [b.mat, fmt(b.m) + ' m']; }));
        table(t('Sheets (estimate incl. 15% waste)'), cut.sheets.map(function (s) {
          return [s.mat + ' · ' + fmt(s.T) + ' mm · ' + s.size + ' · ' + fmt(s.m2) + ' m²', s.sheets];
        }));

        var pages = doc.getPages();
        pages.forEach(function (pg, i) {
          var foot = meta.site + '  ·  PanelPro Web ' + meta.version;
          pg.drawText(safe(foot, R), { x: M, y: 20, size: 8, font: R, color: GREY });
          var pn = (i + 1) + ' / ' + pages.length;
          pg.drawText(pn, { x: W - M - R.widthOfTextAtSize(pn, 8), y: 20, size: 8, font: R, color: GREY });
        });
        return doc.save().then(function (bytes) { return new Blob([bytes], { type: 'application/pdf' }); });
      });
    });
  }

  window.PPExport = { xlsx: xlsx, pdf: pdf };
})();
