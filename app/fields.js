/* CSPARTNERS PANEL PRO — the Configurator's field list, shared by the SketchUp Configurator
 * (ui/panel.js) and PanelPro Web (web/app.js): every setting, its label, its kind and when it
 * shows. Add a setting here once and both apps get it; each app draws it its own way.
 *   [key, label, kind, (choices,) condition]   kinds: len deg pct text sel bool mat info btn, '#' = group title
 */
(function () {
  'use strict';
  var YES = function () { return true; };
  var SKIN = function (p) { return !!(p.skin_l || p.skin_r); };
  var DECO = function (p) { return !!(p.skin_l || p.skin_r || p.skin_b || p.add_top); };
  var SKINB = function (p) { return !!(p.skin_l || p.skin_r || p.skin_b); };   // side or back decorative panels
  var FRIDGE = function (p) { return !!p.fridge; };
  var PANEL = function (p) { return !!p.panel; };

  // ---- what the module actually has (from its layout). A setting tied to one of these shows only
  // when the module has that thing — unless "Show all settings" is on (PPFields.showAll).
  function nookLeaves(n, out) {
    if (!n) { return out; }
    if (n.parts) { n.parts.forEach(function (q) { nookLeaves(q, out); }); } else { out.push(n); }
    return out;
  }
  function rowsOf(p) {
    if (p.layout_mode === 'nooks' && p.nooks) { return nookLeaves(p.nooks, []); }
    var out = [];
    (p.columns || []).forEach(function (c) { if (c.kind !== 'kneehole') { (c.rows || []).forEach(function (r) { out.push(r); }); } });
    return out;
  }
  function frontOf(r) { return String(r.front || '').replace(/^glass_/, ''); }
  function anyRow(p, f) { return rowsOf(p).some(f); }
  var HAS = {
    door: function (p) { return anyRow(p, function (r) { return frontOf(r) === 'door' || frontOf(r) === 'door_pair'; }); },
    sideDoor: function (p) { return anyRow(p, function (r) { return frontOf(r) === 'door_pair' || (frontOf(r) === 'door' && (r.hinge || 'L') !== 'T' && r.hinge !== 'B'); }); },
    lift: function (p) { return anyRow(p, function (r) { return frontOf(r) === 'door' && r.hinge === 'T'; }); },
    flap: function (p) { return anyRow(p, function (r) { return frontOf(r) === 'door' && r.hinge === 'B'; }); },
    drawer: function (p) { return anyRow(p, function (r) { return frontOf(r) === 'drawer'; }); },
    drawerFace: function (p) { return anyRow(p, function (r) { return frontOf(r) === 'drawer' || frontOf(r) === 'false_front'; }); },
    front: function (p) { return anyRow(p, function (r) { return frontOf(r) !== 'none' && frontOf(r) !== ''; }); },
    shelves: function (p) { return anyRow(p, function (r) { return frontOf(r) !== 'drawer' && r.interior === 'shelves' && (r.shelves || 0) > 0; }); },
    hang: function (p) { return anyRow(p, function (r) { return frontOf(r) !== 'drawer' && r.interior === 'hang'; }); },
    knee: function (p) { return p.layout_mode !== 'nooks' && (p.columns || []).some(function (c) { return c.kind === 'kneehole'; }); },
    rows2: function (p) { return p.layout_mode !== 'nooks' && (p.columns || []).some(function (c) { return c.kind !== 'kneehole' && (c.rows || []).length > 1; }); },
    corner: function (p) { return !!p.corner && p.corner !== 'none'; },
    box: function (p) { return !p.panel; }
  };
  var F_ = { showAll: false };
  // ctx(has, extra): shows when the module has it (or Show all), and the extra rule holds
  function ctx(has, extra) {
    return function (p) { return (F_.showAll || has(p)) && (!extra || extra(p)); };
  }
  var DOOR = ctx(HAS.door), DRAWER = ctx(HAS.drawer), FRONT = ctx(HAS.front), CORNER = ctx(HAS.corner);
  var DPULL = DOOR, WPULL = ctx(HAS.drawerFace);
  // a countertop sits on floor-standing modules with fronts (not wall cabinets)
  var ONFLOOR = ctx(function (p) { return HAS.front(p) && !(Number(p.elevation) > 0); });
  var SECTIONS = {
    module: [
      ['name', 'Name', 'text'],
      ['width', 'Width', 'len'],
      ['inner_w', 'Inner width (between the sides)', 'len'],
      ['height', 'Height (carcass)', 'len'],
      ['depth', 'Depth (box, without fronts)', 'len'],
      ['elevation', 'Insert height above pick point', 'len'],
      ['#', 'Corner module', CORNER],
      ['corner', 'Blind corner', 'sel', [['none', 'No (regular module)'], ['left', 'Blind on the left'], ['right', 'Blind on the right']], CORNER],
      ['corner_info', '', 'info', ctx(HAS.corner, function (p) { return p.corner && p.corner !== 'none'; })],
      ['corner_size', 'Blind side width', 'sel', [['auto', 'From the other module (depth + front + clearance)'], ['blind', 'Blind panel width'], ['door', 'Door width (blind side takes the rest)']], ctx(HAS.corner, function (p) { return p.corner && p.corner !== 'none'; })],
      ['corner_blind_w', 'Blind panel width', 'len', ctx(HAS.corner, function (p) { return p.corner && p.corner !== 'none' && p.corner_size === 'blind'; })],
      ['corner_door_w', 'Door width', 'len', ctx(HAS.corner, function (p) { return p.corner && p.corner !== 'none' && p.corner_size === 'door'; })],
      ['corner_nb_depth', 'Depth of the module on the other wall', 'len', ctx(HAS.corner, function (p) { return p.corner && p.corner !== 'none'; })],
      ['corner_clear', 'Clearance strip (holds the other module away)', 'len', ctx(HAS.corner, function (p) { return p.corner && p.corner !== 'none'; })],
      ['corner_div_w', 'Hinge divider depth', 'len', ctx(HAS.corner, function (p) { return p.corner && p.corner !== 'none'; })],
      ['#', 'Fridge enclosure', FRIDGE],
      ['fridge_info', '', 'info', FRIDGE],
      ['fridge_back', 'Back behind the fridge', 'sel', [['full', 'Full back (floor to top)'], ['none', 'None (only the top cabinet back)']], FRIDGE],
      ['fridge_top_h', 'Top cabinet height', 'len', FRIDGE],
      ['fridge_top_d', 'Top cabinet depth (front flush with the sides)', 'len', FRIDGE],
      ['fridge_gap_side', 'Gap at each side of the fridge', 'len', FRIDGE],
      ['fridge_gap_top', 'Gap above the fridge', 'len', FRIDGE],
      ['#', 'Fridge size', FRIDGE],
      ['fridge_w', 'Fridge width', 'len', FRIDGE],
      ['fridge_h', 'Fridge height', 'len', FRIDGE],
      ['fridge_d', 'Fridge depth', 'len', FRIDGE],
      ['fridge_fit', 'Fit module to fridge', 'btn', FRIDGE],
      ['#', 'Panel', PANEL],
      ['panel_kind', 'Kind of panel', 'sel', [['top', 'Top / overpanel (lies flat over modules)'], ['bottom', 'Underpanel (lies flat under wall cabinets)'], ['side', 'End panel (stands at the side)'], ['filler', 'Filler (closes a gap at the front)'], ['crown', 'Crown (strip on edge on top, up to the ceiling)'], ['back', 'Back cover']], PANEL],
      ['panel_info', '', 'info', PANEL],
      ['panel_t_same', 'Same as panel thickness', 'bool', PANEL],
      ['panel_t', 'Thickness', 'len', function (p) { return p.panel && !p.panel_t_same; }],
      ['panel_eb', 'Edge banding', 'sel', [['front', 'One long edge (the one in view)'], ['long', 'Both long edges'], ['all', 'All four edges'], ['none', 'None']], PANEL]
    ],
    box: [
      ['#', 'Construction'],
      ['construction', 'Construction type', 'sel', [['frameless', 'Frameless (European)'], ['face_frame', 'Face frame']]],
      ['joint', 'Carcass joint', 'cards', [
        ['sides_full', 'Sides full height', 'Top and bottom between the sides (standard)', 'M0 0h6v44H0zM34 0h6v44h-6z|M6 0h28v6H6zM6 38h28v6H6z'],
        ['top_full', 'Top full width', 'Top over the sides · bottom between the sides', 'M0 6h6v38H0zM34 6h6v38h-6z|M0 0h40v6H0zM6 38h28v6H6z'],
        ['bottom_full', 'Bottom full width', 'Bottom under the sides · top between the sides', 'M0 0h6v38H0zM34 0h6v38h-6z|M6 0h28v6H6zM0 38h40v6H0z'],
        ['top_bottom_full', 'Top and bottom full width', 'Both over the sides', 'M0 6h6v32H0zM34 6h6v32h-6z|M0 0h40v6H0zM0 38h40v6H0z']]],
      ['t', 'Panel thickness', 'len'],
      ['#', 'Back'],
      ['back_mount', 'Back panel (respaldo)', 'cards', [
        ['inset', 'Inside (set in)', 'Set in between the sides', 'M0 0h6v40H0zM34 0h6v40h-6z|M6 30h28v5H6z'],
        ['applied', 'Outside (applied)', 'Applied to the rear', 'M0 0h6v40H0zM34 0h6v40h-6z|M0 40h40v5H0z']]],
      ['back_slot', 'Slotted into grooves', 'bool', function (p) { return p.back_mount === 'inset'; }],
      ['back_floor', 'Back: down to the floor', 'bool', function (p) { return p.back_mount === 'applied'; }],
      ['back_hset', 'Back: height of its own', 'bool', function (p) { return p.back_mount === 'applied'; }],
      ['back_h', 'Back height', 'len', function (p) { return p.back_mount === 'applied' && p.back_hset; }],
      ['back_over', 'Back: may go past the module height', 'bool', function (p) { return p.back_mount === 'applied' && p.back_hset; }],
      ['back_t_same', 'Same thickness as carcass panels', 'bool'],
      ['back_t', 'Back thickness', 'len', function (p) { return !p.back_t_same; }],
      ['back_recess', 'Back recess from rear edge', 'len', function (p) { return p.back_mount === 'inset'; }],
      ['groove_depth', 'Groove depth', 'len', function (p) { return p.back_mount === 'inset' && p.back_slot; }],
      ['back_groove_w', 'Groove width (thicker backs get a rebated tongue)', 'len', function (p) { return p.back_mount === 'inset' && p.back_slot; }],
      ['#', 'Top'],
      ['top_type', 'Carcass top', 'sel', [['stretchers', 'Stretchers (rails)'], ['full_panel', 'Full panel']]],
      ['front_stretcher_orient', 'Front stretcher', 'sel', [['flat', 'Flat'], ['on_edge', 'On edge (vertical)']], function (p) { return p.top_type === 'stretchers'; }],
      ['stretcher_w', 'Front stretcher width', 'len', function (p) { return p.top_type === 'stretchers'; }],
      ['stretcher_drop', 'Front stretcher drop from top', 'len', function (p) { return p.top_type === 'stretchers'; }],
      ['stretcher_setback', 'Front stretcher setback', 'len', function (p) { return p.top_type === 'stretchers'; }],
      ['rear_stretcher', 'Rear stretcher', 'bool', function (p) { return p.top_type === 'stretchers'; }],
      ['rear_stretcher_orient', 'Rear stretcher orientation', 'sel', [['flat', 'Flat'], ['on_edge', 'On edge (vertical)']], function (p) { return p.top_type === 'stretchers' && p.rear_stretcher; }],
      ['rear_stretcher_w', 'Rear stretcher width', 'len', function (p) { return p.top_type === 'stretchers' && p.rear_stretcher; }],
      ['#', 'Base / toe kick'],
      ['kick_type', 'Base type', 'sel', [['legs', 'Adjustable legs (toe kick bought, not cut)'], ['integral', 'Notched sides (integral kick)'], ['plinth', 'Separate plinth frame'], ['none', 'None (sits on floor / wall-hung)']]],
      ['kick_h', 'Toe kick height', 'len', function (p) { return p.kick_type !== 'none'; }],
      ['kick_setback', 'Toe kick setback (0 = flush plinth)', 'len', function (p) { return p.kick_type !== 'none'; }],
      ['#', 'Decorative panels'],
      ['deco_info', '', 'info', DECO],
      ['add_top', 'Top decorative panel', 'bool'],
      ['top_t_same', 'Same as panel thickness', 'bool', function (p) { return p.add_top; }],
      ['top_t', 'Top panel thickness', 'len', function (p) { return p.add_top && !p.top_t_same; }],
      ['top_oh_front', 'Top panel overhang — front', 'len', function (p) { return p.add_top; }],
      ['top_oh_sides', 'Top panel overhang — each side', 'len', function (p) { return p.add_top; }],
      ['top_oh_back', 'Top panel overhang — back', 'len', function (p) { return p.add_top; }],
      ['skin_l', 'Left decorative panel', 'bool'],
      ['skin_r', 'Right decorative panel', 'bool'],
      ['skin_b', 'Back decorative panel', 'bool'],
      ['skin_add', 'Add side panels to the module width', 'bool', SKIN],
      ['skin_t_same', 'Same as panel thickness', 'bool', SKINB],
      ['skin_t', 'Side panel thickness', 'len', function (p) { return SKINB(p) && !p.skin_t_same; }],
      ['skin_front_flush', 'Front: flush with the fronts', 'bool', SKIN],
      ['skin_front', 'Front projection', 'len', function (p) { return SKIN(p) && !p.skin_front_flush; }],
      ['skin_back', 'Back projection', 'len', SKIN],
      ['top_skin_mode', 'Top panel', 'sel', [['over', 'Over the side panels'], ['between', 'Between the side panels']], function (p) { return SKIN(p) && p.add_top; }],
      ['skin_top_flush', 'Side panels: flush with the top panel', 'bool', function (p) { return SKIN(p) && p.add_top && p.top_skin_mode === 'between'; }],
      ['skin_top', 'Top projection', 'len', function (p) { return SKINB(p) && !(p.add_top && p.top_skin_mode === 'over') && !(p.add_top && p.skin_top_flush); }],
      ['skin_floor', 'Bottom: to the floor', 'bool', SKINB],
      ['skin_bottom', 'Bottom projection', 'len', function (p) { return SKINB(p) && !p.skin_floor; }]
    ],
    base: [],
    layout: [
      ['#', 'From your layout'],
      ['row_divider', 'Between rows', 'sel', [['none', 'Nothing (fronts only)'], ['fixed_shelf', 'Fixed shelf']], ctx(HAS.rows2)],
      ['shelf_setback', 'Adjustable shelf setback', 'len', ctx(HAS.shelves)],
      ['rod_drop', 'Hanging rail below top', 'len', ctx(HAS.hang)],
      ['hangers', 'Clothes hangers (look only)', 'sel', [['normal', 'Normal'], ['half', 'A few'], ['full', 'Full rail'], ['off', 'None']], ctx(HAS.hang)],
      ['modesty_h', 'Kneehole modesty panel height', 'len', ctx(HAS.knee)],
      ['knee_sides', 'Kneehole sides to the floor', 'sel', [['end', 'End panel only'], ['all', 'End panel and pedestal sides']], ctx(HAS.knee)]
    ],
    fronts: [
      ['#', 'Fronts', FRONT],
      ['overlay', 'Door mounting', 'sel', [['full', 'Full overlay'], ['half', 'Half overlay'], ['inset', 'Inset']], FRONT],
      ['front_t_same', 'Same as panel thickness', 'bool', FRONT],
      ['front_t', 'Front thickness', 'len', ctx(HAS.front, function (p) { return !p.front_t_same; })],
      ['gap', 'Gap between fronts', 'len', FRONT],
      ['reveal', 'Outer reveal (full overlay)', 'len', ctx(HAS.front, function (p) { return p.construction === 'frameless' && p.overlay === 'full'; })],
      ['#', 'Style', FRONT],
      ['front_style', 'Front style', 'sel', [['slab', 'Flat slab'], ['shaker', 'Shaker (5-piece)'], ['plank', 'Planks (separate boards)'], ['grooved', 'Plank look (V-grooved slab)'], ['glass', 'Glass (black aluminium frame) — doors only']], FRONT],
      ['plank_w', 'Plank width (target)', 'len', ctx(HAS.front, function (p) { return p.front_style === 'plank' || p.front_style === 'grooved'; })],
      ['plank_gap', 'Gap between planks', 'len', ctx(HAS.front, function (p) { return p.front_style === 'plank'; })],
      ['plank_dir', 'Plank direction', 'sel', [['vertical', 'Vertical'], ['horizontal', 'Horizontal']], ctx(HAS.front, function (p) { return p.front_style === 'plank' || p.front_style === 'grooved'; })],
      ['shaker_w', 'Shaker stile/rail width', 'len', ctx(HAS.front, function (p) { return p.front_style === 'shaker'; })],
      ['shaker_panel_t', 'Shaker panel thickness', 'len', ctx(HAS.front, function (p) { return p.front_style === 'shaker'; })]
    ],
    pulls: [
      ['#', 'Pulls', FRONT],
      ['pull_finish', 'Pull finish', 'sel', [['black', 'Black'], ['stainless', 'Stainless steel'], ['aluminium', 'Aluminium'], ['gold', 'Gold / brass']], function (p) { return (DPULL(p) && p.door_pull !== 'none') || (WPULL(p) && p.drawer_pull !== 'none'); }],
      ['door_pull', 'Door pull', 'sel', [['none', 'None'], ['tbar', 'T-bar on the face'], ['wedge', 'Wedge on an edge'], ['profile', 'Full-length profile on an edge']], DOOR],
      ['door_pull_corner', 'Door: corner (A–D, from the hinge)', 'sel', [['A', 'A — top, hinge side'], ['B', 'B — top, opening side'], ['C', 'C — bottom, hinge side'], ['D', 'D — bottom, opening side']], function (p) { return DPULL(p) && (p.door_pull !== 'none'); }],
      ['door_pull_edge', 'Door: edge at that corner', 'sel', [['h', 'Top / bottom edge'], ['v', 'Side edge']], function (p) { return DPULL(p) && (p.door_pull === 'wedge' || p.door_pull === 'profile'); }],
      ['door_pull_gap', 'Door: gap from the corner', 'len', function (p) { return DPULL(p) && (p.door_pull === 'wedge'); }],
      ['door_pull_orient', 'Door: T-bar direction', 'sel', [['v', 'Vertical'], ['h', 'Horizontal']], function (p) { return DPULL(p) && (p.door_pull === 'tbar'); }],
      ['door_pull_gx', 'Door: gap from the side edge', 'len', function (p) { return DPULL(p) && (p.door_pull === 'tbar'); }],
      ['door_pull_gy', 'Door: gap from the top / bottom edge', 'len', function (p) { return DPULL(p) && (p.door_pull === 'tbar'); }],
      ['drawer_pull', 'Drawer pull', 'sel', [['none', 'None'], ['tbar', 'T-bar on the face'], ['wedge', 'Wedge on an edge'], ['profile', 'Full-length profile on an edge']], ctx(HAS.drawerFace)],
      ['drawer_pull_corner', 'Drawer: position', 'sel', [['center', 'Centred'], ['A', 'A — top left'], ['B', 'B — top right'], ['C', 'C — bottom left'], ['D', 'D — bottom right']], function (p) { return WPULL(p) && (p.drawer_pull !== 'none'); }],
      ['drawer_pull_edge', 'Drawer: edge at that corner', 'sel', [['h', 'Top / bottom edge'], ['v', 'Side edge']], function (p) { return WPULL(p) && ((p.drawer_pull === 'wedge' || p.drawer_pull === 'profile') && p.drawer_pull_corner !== 'center'); }],
      ['drawer_pull_gap', 'Drawer: gap from the corner', 'len', function (p) { return WPULL(p) && (p.drawer_pull === 'wedge' && p.drawer_pull_corner !== 'center'); }],
      ['drawer_pull_orient', 'Drawer: T-bar direction', 'sel', [['h', 'Horizontal'], ['v', 'Vertical']], function (p) { return WPULL(p) && (p.drawer_pull === 'tbar' && p.drawer_pull_corner !== 'center'); }],
      ['drawer_pull_gx', 'Drawer: gap from the side edge', 'len', function (p) { return WPULL(p) && (p.drawer_pull === 'tbar' && p.drawer_pull_corner !== 'center'); }],
      ['drawer_pull_gy', 'Drawer: gap from the top / bottom edge', 'len', function (p) { return WPULL(p) && (p.drawer_pull === 'tbar' && p.drawer_pull_corner !== 'center'); }],
      ['#', 'Pull sizes', function (p) { return (DPULL(p) && p.door_pull !== 'none') || (WPULL(p) && p.drawer_pull !== 'none'); }],
      ['tbar_cc', 'T-bar hole spacing', 'len', function (p) { return (DPULL(p) && p.door_pull === 'tbar') || (WPULL(p) && p.drawer_pull === 'tbar'); }],
      ['tbar_len', 'T-bar length', 'len', function (p) { return (DPULL(p) && p.door_pull === 'tbar') || (WPULL(p) && p.drawer_pull === 'tbar'); }],
      ['tbar_d', 'T-bar diameter', 'len', function (p) { return (DPULL(p) && p.door_pull === 'tbar') || (WPULL(p) && p.drawer_pull === 'tbar'); }],
      ['tbar_off', 'T-bar projection from the face', 'len', function (p) { return (DPULL(p) && p.door_pull === 'tbar') || (WPULL(p) && p.drawer_pull === 'tbar'); }],
      ['wedge_len', 'Wedge length', 'len', function (p) { return (DPULL(p) && p.door_pull === 'wedge') || (WPULL(p) && p.drawer_pull === 'wedge'); }],
      ['wedge_depth', 'Wedge depth on the edge', 'len', function (p) { return (DPULL(p) && p.door_pull === 'wedge') || (WPULL(p) && p.drawer_pull === 'wedge'); }],
      ['wedge_lip', 'Wedge lip over the face', 'len', function (p) { return (DPULL(p) && p.door_pull === 'wedge') || (WPULL(p) && p.drawer_pull === 'wedge'); }],
      ['profile_h', 'Profile height (taken off the panel)', 'len', function (p) { return (DPULL(p) && p.door_pull === 'profile') || (WPULL(p) && p.drawer_pull === 'profile'); }],
      ['profile_grip', 'Profile finger grip', 'len', function (p) { return (DPULL(p) && p.door_pull === 'profile') || (WPULL(p) && p.drawer_pull === 'profile'); }]
    ],
    motion: [
      ['#', 'Open / close in the model', function (p) { return DOOR(p) || DRAWER(p); }],
      ['door_angle', 'Side-hinged door opening angle', 'deg', ctx(HAS.sideDoor)],
      ['lift_angle', 'Lift-up door (hinged top) angle', 'deg', ctx(HAS.lift)],
      ['flap_angle', 'Drop-down flap (hinged bottom) angle', 'deg', ctx(HAS.flap)],
      ['drawer_open', 'Drawers open', 'sel', [['staircase', 'Staircase — top least, lower ones further (for show)'], ['full', 'All the way']], DRAWER],
      ['drawer_ext', 'Drawer pull-out (100 = full extension)', 'pct', DRAWER],
      ['soft_close', 'Soft-close motion when closing', 'bool', function (p) { return DOOR(p) || DRAWER(p); }],
      ['#', 'Countertop', ONFLOOR],
      ['ct_clear', 'Countertop clearance (double bullnose or dropped edge)', 'bool', ONFLOOR],
      ['ct_clear_mm', 'Top fronts stop lower by', 'len', function (p) { return ONFLOOR(p) && p.ct_clear; }]
    ],
    frame: [
      ['#', 'Face frame', function (p) { return p.construction === 'face_frame'; }],
      ['ff_t_same', 'Same as panel thickness', 'bool', 'ff'],
      ['ff_t', 'Frame thickness', 'len', function (p) { return p.construction === 'face_frame' && !p.ff_t_same; }],
      ['ff_stile', 'Outer stile width', 'len', 'ff'],
      ['ff_rail', 'Top / bottom rail width', 'len', 'ff'],
      ['ff_mid', 'Mid stile / mid rail width', 'len', 'ff'],
      ['ff_overhang', 'Frame overhang past sides', 'len', 'ff'],
      ['ff_overlay', 'Front overlay on frame', 'len', function (p) { return p.construction === 'face_frame' && p.overlay !== 'inset'; }],
      ['ff_inset_gap', 'Inset gap in frame', 'len', function (p) { return p.construction === 'face_frame' && p.overlay === 'inset'; }]
    ],
    drawers: [
      ['#', 'Drawer system', DRAWER],
      ['drawer_system', 'Runners', 'sel', [['undermount', 'Undermount, soft-close, full ext.'], ['side_mount', 'Side-mount ball-bearing, full ext.'], ['box_system', 'Box system (Blum Merivobox / Legrabox type)']], DRAWER],
      ['slide_lengths', 'Available runner lengths (NL)', 'text', DRAWER],
      ['db_clear_bottom', 'Clearance below box', 'len', DRAWER],
      ['db_clear_top', 'Clearance above box', 'len', DRAWER],
      ['#', 'Wood box', function (p) { return DRAWER(p) && (p.drawer_system !== 'box_system'); }],
      ['db_t_same', 'Box sides: same as panel thickness', 'bool', function (p) { return DRAWER(p) && (p.drawer_system !== 'box_system'); }],
      ['db_t', 'Box side thickness', 'len', function (p) { return DRAWER(p) && (p.drawer_system !== 'box_system' && !p.db_t_same); }],
      ['db_bottom_fit', 'Box bottom', 'sel', [['nested', 'Nested between the sides (flush underneath)'], ['slotted', 'Slotted into grooves (6 mm, raised 10 mm)']], function (p) { return DRAWER(p) && (p.drawer_system !== 'box_system'); }],
      ['db_bottom_t_same', 'Box bottom: same as panel thickness', 'bool', function (p) { return DRAWER(p) && (p.drawer_system !== 'box_system'); }],
      ['db_bottom_t', 'Box bottom thickness', 'len', function (p) { return DRAWER(p) && (p.drawer_system !== 'box_system' && !p.db_bottom_t_same); }],
      ['#', 'Metal box system', function (p) { return DRAWER(p) && (p.drawer_system === 'box_system'); }],
      ['bx_brand', 'System', 'sel', [['merivobox', 'Blum MERIVOBOX'], ['legrabox', 'Blum LEGRABOX']], function (p) { return DRAWER(p) && NAMED_COND.bxStd(p); }],
      ['bx_height', 'System height', 'sel', [['N', 'N — low'], ['M', 'M'], ['K', 'K'], ['E', 'E — tall (MERIVOBOX)'], ['C', 'C (LEGRABOX)'], ['F', 'F — tall (LEGRABOX)']], function (p) { return DRAWER(p) && NAMED_COND.bxStd(p); }],
      ['bx_gallery', 'Gallery rails (tall back on low sides)', 'bool', function (p) { return DRAWER(p) && NAMED_COND.bxStd(p); }],
      ['bx_gallery_back', 'Gallery back height', 'len', function (p) { return DRAWER(p) && (p.drawer_system === 'box_system' && !p.bx_custom && p.bx_gallery); }],
      ['bx_info', '', 'info', function (p) { return DRAWER(p) && NAMED_COND.bx(p); }],
      ['bx_bottom_t_same', 'Bottom & back: same as panel thickness', 'bool', function (p) { return DRAWER(p) && NAMED_COND.bx(p); }],
      ['bx_bottom_t', 'Bottom & back thickness', 'len', function (p) { return DRAWER(p) && (p.drawer_system === 'box_system' && !p.bx_bottom_t_same); }],
      ['bx_custom', 'Enter the sizes by hand', 'bool', function (p) { return DRAWER(p) && NAMED_COND.bx(p); }],
      ['bx_side_h', 'Metal side height', 'len', function (p) { return DRAWER(p) && NAMED_COND.bxCustom(p); }],
      ['bx_bottom_w_deduct', 'Bottom width = opening −', 'len', function (p) { return DRAWER(p) && NAMED_COND.bxCustom(p); }],
      ['bx_bottom_d_deduct', 'Bottom depth = NL −', 'len', function (p) { return DRAWER(p) && NAMED_COND.bxCustom(p); }],
      ['bx_back_w_deduct', 'Back width = opening −', 'len', function (p) { return DRAWER(p) && NAMED_COND.bxCustom(p); }],
      ['bx_back_h', 'Back height', 'len', function (p) { return DRAWER(p) && NAMED_COND.bxCustom(p); }]
    ],
    materials: [
      ['#', 'Materials'],
      ['mat_carcass', 'Carcass, shelves', 'mat'],
      ['mat_back', 'Back', 'mat'],
      ['mat_front', 'Fronts', 'mat', function (p) { return FRONT(p) || p.end_l || p.end_r || p.end_top || p.end_bottom || p.end_back; }],
      ['mat_frame', 'Face frame', 'mat', function (p) { return F_.showAll || p.construction === 'face_frame'; }],
      ['mat_drawer', 'Drawer boxes', 'mat', DRAWER],
      ['mat_top', 'Decorative top', 'mat', function (p) { return F_.showAll || !!p.add_top; }],
      ['mat_kick', 'Toe kick / plinth', 'mat', function (p) { return p.kick_type === 'integral' || p.kick_type === 'plinth'; }],
      ['mat_skin', 'Decorative side panels', 'mat', function (p) { return F_.showAll || SKINB(p); }],
      ['#', 'Visible end panels'],
      ['end_l', 'Left side is visible', 'bool'],
      ['end_r', 'Right side is visible', 'bool'],
      ['end_top', 'Top is visible', 'bool', function (p) { return F_.showAll || !p.panel; }],
      ['end_bottom', 'Bottom is visible', 'bool', function (p) { return F_.showAll || !p.panel; }],
      ['end_back', 'Back is visible', 'bool', function (p) { return F_.showAll || !p.panel; }],
      ['mat_end', 'Visible end panels', 'mat', function (p) { return p.end_l || p.end_r || p.end_top || p.end_bottom || p.end_back; }],
      ['#', 'Cut list'],
      ['grain_rule', 'Length (L) in the cut list', 'sel', [['longest', 'Longest side (box parts; fronts keep grain)'], ['design', 'Designed grain direction']]]
    ]
  };
  var NAMED_COND = {
    ff: function (p) { return p.construction === 'face_frame'; },
    bx: function (p) { return p.drawer_system === 'box_system'; },
    bxStd: function (p) { return p.drawer_system === 'box_system' && !p.bx_custom; },
    bxCustom: function (p) { return p.drawer_system === 'box_system' && p.bx_custom; }
  };

  var FRONTS = [['door', 'Door'], ['door_pair', 'Door pair'], ['drawer', 'Drawer'], ['false_front', 'False front'], ['none', 'Open']];
  // rows saved as glass in 0.3.21–0.3.23 still show (glass is now a Front style)
  var OLD_FRONTS = [['glass_door', 'Glass door'], ['glass_door_pair', 'Glass door pair']];
  var INTERIORS = [['none', '—'], ['shelves', 'Shelves'], ['hang', 'Hang rail']];
  var HINGES = [['L', 'L'], ['R', 'R'], ['T', 'Top'], ['B', 'Bot']];


  // Picture-card choices: [value, title, subtitle, 'sides path|top-bottom path'] in a 40 × 45 box
  // (front view for joints, plan view for the back). Both apps draw them with this.
  function cardSvg(c) {
    var d = String(c[3] || '').split('|');
    return '<svg viewBox="-2 -2 44 49" aria-hidden="true"><rect x="0" y="0" width="40" height="45" fill="#f6efe4"/>' +
      '<path d="' + (d[0] || '') + '" fill="#e2c9a4" stroke="#8a6a44" stroke-width="1"/>' +
      '<path d="' + (d[1] || '') + '" fill="#c79c66" stroke="#8a6a44" stroke-width="1"/></svg>';
  }

  function cond(spec) {
    if (typeof spec === 'function') { return spec; }
    if (typeof spec === 'string') { return NAMED_COND[spec]; }
    return YES;
  }

  // ------------------------------------------------------------------ quick-pick sizes
  // Numbers are mm; '1T' / '2T' follow the panel thickness (kept in <key>_mode).
  var PICKS = {
    stretcher_w: [50, 70, 100], rear_stretcher_w: [50, 70, 100], back_recess: [0, '1T', '2T'],
    bx_gallery_back: [160, 192, 224, 256], kick_h: [70, 100, 150], kick_setback: ['1T', '2T', 50, 60], corner_clear: [50, 70]
  };
  var MODE_KEYS = { back_recess: 'back_recess_mode', kick_setback: 'kick_setback_mode' };
  function tMult(v) { return v === '1T' ? 1 : v === '2T' ? 2 : 0; }
  // Metal box systems (same table as Params::BOX_SYSTEMS): fill the sizes from system + height.
  var BOXSYS = {
    merivobox: { heights: { N: 68.5, M: 91, K: 129, E: 192 }, bw: 51, bd: 26, kw: 51, off: 8, check: false },
    legrabox: { heights: { N: 66.5, M: 90.5, K: 128.5, C: 177, F: 241 }, bw: 35, bd: 10, kw: 38, off: 8, check: true }
  };
  function applyBox(p) {
    if (!p || p.bx_custom) { return; }
    var b = BOXSYS[p.bx_brand] || BOXSYS.merivobox;
    if (!b.heights[p.bx_height]) { p.bx_height = 'M'; }
    var side = b.heights[p.bx_height];
    p.bx_side_h = side; p.bx_bottom_w_deduct = b.bw; p.bx_bottom_d_deduct = b.bd; p.bx_back_w_deduct = b.kw;
    p.bx_back_h = p.bx_gallery ? p.bx_gallery_back : side - b.off;
  }
  // Width taken by the sides (and decorative side panels fitted inside the width).
  function innerExtra(p) {
    var x = 2 * p.t;
    if (!p.fridge && p.skin_fit !== 'add') { x += (p.skin_l ? skinT(p) : 0) + (p.skin_r ? skinT(p) : 0); }
    return x;
  }
  function skinT(p) { return p.skin_t_same !== false ? p.t : p.skin_t; }

  window.PPFields = {
    SECTIONS: SECTIONS, NAMED_COND: NAMED_COND, cond: cond, YES: YES, SKIN: SKIN, DECO: DECO, FRIDGE: FRIDGE, PANEL: PANEL,
    FRONTS: FRONTS, OLD_FRONTS: OLD_FRONTS, INTERIORS: INTERIORS, HINGES: HINGES,
    PICKS: PICKS, MODE_KEYS: MODE_KEYS, tMult: tMult, BOXSYS: BOXSYS, applyBox: applyBox,
    innerExtra: innerExtra, skinT: skinT, HAS: HAS, ctx: ctx, cardSvg: cardSvg,
    // where a setting's show-condition sits: after the choices for 'sel' and 'cards'
    condOf: function (d) { return cond(d[2] === 'sel' || d[2] === 'cards' ? d[4] : d[3]); }
  };
  // "Show all settings": both apps set PPFields.showAll; the context rules read it here
  Object.defineProperty(window.PPFields, 'showAll', { get: function () { return F_.showAll; }, set: function (v) { F_.showAll = !!v; } });
})();
