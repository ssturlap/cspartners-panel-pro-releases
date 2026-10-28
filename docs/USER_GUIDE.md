# CSPARTNERS PANEL PRO — User guide

Parametric kitchen cabinets, closets, vanities, dressers, desks and TV units for SketchUp.
Every module is built from real panels (true thicknesses), stays editable, and gives you a cut list,
a sheet layout and a cutting plan.

**Spanish:** [Guía de uso](GUIA_DE_USO.md)

---

## 1. Install and update
1. Download the latest `.rbz` from the [releases page](../README.md).
2. SketchUp › **Extensions › Extension Manager › Install Extension…**, pick the file, restart SketchUp.
3. You get the **CSPARTNERS PANEL PRO** toolbar and the menu **Extensions › CSPARTNERS PANEL PRO**.

**Updates:** PANEL PRO checks for new versions by itself (at most once a day) and offers to install them.
Or use **Extensions › CSPARTNERS PANEL PRO › Check for updates…**. After installing, restart SketchUp.
**What's new…** in the same menu lists every change.

## 2. The PanelPro Configurator
Open it from the toolbar or **Extensions › CSPARTNERS PANEL PRO › PanelPro Configurator**.

- **Header:** version (click for what's new), mm / cm, ⚙ Settings.
- **Preview:** 2D or 3D (navigate like SketchUp: middle-drag orbit, Shift+middle pan, wheel zoom).
  *Doors / Fronts / Boxes* show or hide those parts; *Open doors / drawers* animates them.
- **Tabs:** Module · Box · Base · Layout · Fronts · Drawers · Materials · Cut list.

### Place a module
1. **Module** tab: pick a preset (it loads at once) and set width, height, depth.
   *The module size is the carcass*: doors, drawer fronts and the decorative top sit outside it.
2. Adjust the other tabs.
3. **Place new**, then click in the model (← / → rotate 90°, ↑ / ↓ flip, Esc cancels). The click point is the front-left-bottom corner.

### Edit a module
Select one module: the Configurator switches to **Editing**. Change anything, then **Apply to selected**
(or tick *Live update*). Right-click a module for *Edit, Rebuild, Clear hand paint, Cut list*.

### Stretch
Select a module and use SketchUp's **Scale** tool. On release it rebuilds at the new size with true
thicknesses. One Undo reverts it.

## 3. Box, base and layout
- **Box:** construction (frameless / face frame), joints, back panel (inset, grooved, applied), carcass top
  (stretchers or full panel).
- **Decorative panels:** a **top decorative panel** (with overhangs) and **left / right decorative side panels**
  ("double skin"). Side panels sit inside the module width unless you tick *Add side panels to the module width*.
  A readout shows carcass and overall size.
- **Base:** adjustable legs, notched sides, plinth or none; toe-kick height and setback.
- **Layout:** columns left → right, rows top → bottom: door, door pair, drawer, false front or open;
  shelves or hanging rail; kneehole for desks.
- **Thickness rule:** every panel uses the main panel thickness unless you untick *Same as panel thickness*.
  Thicker boards take space from the inside; the module never grows.

### Corner modules (blind corners)
Presets *Kitchen — Base corner (blind)* and *Wall corner (blind)*, or **Layout › Corner module** on any module:
*Blind on the left / right*. The closed side meets the side panel of the module on the other wall (an L).
From the corner outwards: a fixed **blind panel** (as deep as the other module plus its front), a **clearance
strip** (filler, 50 mm by default) so fronts and handles don't clash, then the door(s) and drawers. A **hinge
divider** (70 mm deep) stands behind the door edge, from the bottom to the top of the carcass; the door hinges
on it. Set *Depth of the module on the other wall* to match that module.

## 4. Fronts and drawers
Overlay or inset, reveals and gaps, slab / shaker / grooved fronts, hinge side (L, R, Top, Bottom),
opening angles, soft-close, countertop clearance. Drawers: box, side-mount or metal box systems;
numbered top to bottom.

## 5. Materials
- Every material field has a swatch list (▾), an **eyedropper** (click a face in the model) and **Use current**.
- **Same as carcass:** all panels follow the carcass material unless unticked.
- **Visible end panels:** tick *Left / Right side is visible* to give that side its own material
  (the fronts' material by default).
- **Finish sets:** save the materials of a module under a name (e.g. *Kitchen A*) and apply them to any
  module with one pick. Stored with your presets (share the presets folder to share them).
- **Board library:** choose the folder with your texture files named
  `BRAND - Name - 2070x2700mm - 18mm.jpg` (optional `… NORMAL MAP.png`). Decors appear in every ▾ list with
  their sheet size and thicknesses. *Wood grain in the images runs* tells PanelPro whether your images have the
  grain left–right or top–bottom, so the texture follows each part's length.
- **Hand paint:** parts painted with SketchUp's paint bucket keep their paint through rebuilds until you change
  that part's material in the Configurator.

## 6. Panels edited by hand
You can change parts inside a module in SketchUp (double-click into the module, then into the part):
make it shorter, move it, cut a hole or notch. When you open one part for editing, PanelPro makes it unique
first, so its identical copies don't change.

PanelPro detects edited parts and shows them in **Module › Manual edits** (orange in the preview):

| Rule | When the module changes… |
|---|---|
| **Keep the difference** (default) | the part stays e.g. 30 mm shorter than the standard part |
| **Keep the proportion** | the part stays e.g. 95 % of the standard part |
| **Keep fixed** | the part does not change (it may leave a gap or overlap) |
| **Reset to standard** | the part goes back to what the Configurator draws |

Cut-outs keep their size and their distance from the nearest edge. Before Configurator changes are applied
you confirm the rule for each edited part. After a Scale stretch the stored rules are used — to use others,
Undo, change the rules, stretch again. **Select** shows the part in the model. The cut list uses the real
size and notes *edited by hand*.

## 7. Cut list, optimizer and cutting plan
- **Cut list** tab: *Selected modules* or *Whole model*. Columns: Code (A, A1, A2… per identical module),
  Module, Panel, Qty, Length (grain), Width, Thickness, L1 L2 W1 W2 (X = edge banded), Material, Notes.
  **Export CSV** opens in Excel. Sizes are finished sizes including the edge tape.
- **Optimize sheets:** lays the panels on sheets like a beam saw (full-length strips, then cross-cuts),
  per material and thickness, grain along the sheet length. Shows sheets, waste %, edge tape and — with
  prices — the cost. Tick *Plain board (no grain)* to let parts turn. Enter a *Price per sheet* per decor;
  set the tape price and currency in Settings.
- **Print / save PDF…** opens the cutting plan in your browser: a summary page, then one page per sheet.
- Each run is saved with the model (last 20).

## 8. Settings (⚙)
Language (English / Español), presets folder (e.g. a shared Google Drive folder), part names,
and the sheet optimizer: saw kerf (4.4 mm), edge trim (10 mm), default sheet, edge tape allowance (10 %),
tape price, currency.

## 9. Tips and troubleshooting
- **Tags:** PanelPro Carcass, Fronts, Drawers, Hardware… hide them in the Tags panel or with the toolbar buttons.
- **Old modules:** select and *Rebuild* once to get the newest features.
- **Texture looks rotated:** change *Wood grain in the images runs* in the Board library.
