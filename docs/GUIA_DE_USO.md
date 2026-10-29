# CSPARTNERS PANEL PRO — Guía de uso

Gabinetes de cocina, closets, vanitorios, cómodas, escritorios y muebles de TV paramétricos para SketchUp.
Cada módulo se construye con tableros reales (espesores verdaderos), sigue siendo editable y te da la lista
de corte, la distribución en tableros y el plan de corte.

**English:** [User guide](USER_GUIDE.md)

---

## 1. Instalar y actualizar
1. Descarga el `.rbz` más reciente desde la [página de versiones](../README.md).
2. SketchUp › **Extensiones › Administrador de extensiones › Instalar extensión…**, elige el archivo y reinicia SketchUp.
3. Aparecen la barra **CSPARTNERS PANEL PRO** y el menú **Extensiones › CSPARTNERS PANEL PRO**.

**Actualizaciones:** PANEL PRO busca nuevas versiones por sí mismo (como máximo una vez al día) y ofrece instalarlas.
O usa **Extensiones › CSPARTNERS PANEL PRO › Buscar actualizaciones…**. Después de instalar, reinicia SketchUp.
**Novedades…** en el mismo menú lista todos los cambios.

## 2. El configurador PanelPro
Ábrelo desde la barra o **Extensiones › CSPARTNERS PANEL PRO › PanelPro Configurator**.

- **Cabecera:** versión (clic para ver novedades), mm / cm, ⚙ Ajustes.
- **Vista previa:** 2D o 3D (se navega como en SketchUp: botón central orbita, Mayús+central desplaza, rueda zoom).
  *Puertas / Frentes / Cajas* muestran u ocultan esas piezas; *Abrir puertas / gavetas* las anima.
- **Pestañas:** Módulo · Caja · Base · Distribución · Frentes · Gavetas · Materiales · Lista de corte.
- **Pestaña Módulo:** *Ancho interior (entre costados)* debajo de Ancho — escribe cualquiera de los dos. **Pestaña Distribución:** los anchos y altos en auto muestran su resultado.
- **Campos numéricos** aceptan una operación: `330-18`, `600/2`, `(720-2*18)/3`, `2x18` — se calcula al salir del campo.

### Colocar un módulo
1. Pestaña **Módulo**: elige un preajuste (se carga al momento) y fija ancho, alto y fondo.
   *La medida del módulo es la caja*: puertas, frentes de gaveta y la tapa decorativa quedan fuera.
2. Ajusta las demás pestañas.
3. **Colocar nuevo** y haz clic en el modelo (← / → gira 90°, ↑ / ↓ voltea, Esc cancela). El punto de clic es la esquina frontal izquierda inferior.

### Editar un módulo
Selecciona un módulo: el configurador pasa a **Editando**. Cambia lo que quieras y pulsa **Aplicar a selección**
(o marca *Actualizar en vivo*). Clic derecho en un módulo: *Editar, Reconstruir, Quitar pintura a mano, Lista de corte*.

### Estirar
Selecciona un módulo y usa la herramienta **Escala** de SketchUp. Al soltar se reconstruye con la nueva medida y
espesores verdaderos. Un Deshacer lo revierte.

## 3. Caja, base y distribución
- **Caja:** construcción (sin marco / con marco), uniones, fondo (embutido, ranurado, aplicado), techo de la caja
  (travesaños o tablero completo).
- **Paneles decorativos:** **tapa decorativa** (con vuelos) y **costados decorativos izquierdo / derecho**
  ("doble costado"). Los costados quedan dentro del ancho salvo que marques *Sumar los costados decorativos al ancho*.
  Se muestra la medida de la caja y la total.
- **Base:** patas regulables, costados con muesca, zócalo o ninguna; alto y retranqueo del zócalo.
- **Distribución:** columnas de izquierda a derecha, filas de arriba abajo: puerta, par de puertas, gaveta, frente
  falso o abierto; entrepaños o tubo de colgar; hueco para escritorios.
- **Regla de espesor:** todas las piezas usan el espesor principal salvo que desmarques *Igual al espesor del tablero*.
  Tableros más gruesos quitan espacio interior; el módulo nunca crece.

### Módulos de esquina (esquinas ciegas)
Preajustes *Cocina — Bajo esquinero (ciego)* y *Alacena esquinera (ciega)*, o **Distribución › Módulo de esquina** en
cualquier módulo: *Ciega a la izquierda / derecha*. El lado cerrado se junta con el costado del módulo de la otra pared
(forman una L). Desde la esquina: un **panel ciego** fijo y luego la(s) puerta(s) y gavetas. Un **montante de bisagras**
(70 mm de fondo) va detrás del borde de la puerta, desde el piso hasta el techo de la caja; la puerta se abisagra en él.
Un **relleno de holgura** (50 mm por defecto) va perpendicular al panel ciego, en el borde de la caja del módulo de la
otra pared: ese módulo se apoya en él y queda separado, así puertas y tiradores no chocan.
*Ancho del lado ciego*: según el otro módulo (su fondo + su frente + la holgura), un ancho de panel ciego que escribes o
un ancho de puerta que escribes. Ajusta *Fondo del módulo de la otra pared* a ese módulo.

### Mueble de nevera
Preajuste *Cocina — Mueble de nevera*. Dos **costados altos** van sobre el piso, a todo el alto y el fondo. Entre ellos,
arriba, va un **módulo superior** que es un módulo propio (sus costados, piso, techo y respaldo), con el frente al ras
del borde delantero de los costados altos; sus puertas, distribución y tiradores salen de las pestañas Frentes y
Distribución. Pestaña **Módulo** › *Mueble de nevera*: respaldo detrás de la nevera (completo, del piso arriba — o
ninguno, solo el respaldo del módulo superior), alto (400) y fondo (350) del módulo superior, holgura a cada lado de la
nevera (15) y encima (50). La línea de información muestra el hueco y la nevera más grande que cabe. Se dimensiona de
dos maneras: escribe ancho / alto / fondo del módulo, o escribe las medidas de la nevera en *Medidas de la nevera* y
pulsa **Ajustar el módulo a la nevera**; luego afina.

## 4. Frentes y gavetas
Sobrepuestos o embutidos, holguras, frentes lisos / shaker / ranurados, lado de bisagra (Izq., Der., Arriba, Abajo),
ángulos de apertura, cierre suave, holgura de cubierta. Gavetas: caja, correderas laterales o sistemas metálicos;
numeradas de arriba abajo.

### Tiradores
**Frentes › Tiradores** — por separado para puertas y gavetas: *Barra en la cara*, *Cuña en un canto* o *Perfil a todo
lo largo en un canto*; acabado negro, inoxidable, aluminio o dorado. Las posiciones usan las esquinas de la puerta,
nombradas desde la bisagra: **A** arriba lado bisagra, **B** arriba lado apertura, **C** abajo lado bisagra, **D** abajo
lado apertura (se reflejan en puertas izquierdas / derechas y pares). Gavetas: A arriba izquierda, B arriba derecha,
C abajo izquierda, D abajo derecha, o *Centrado*. Cuñas y perfiles van en el canto superior/inferior o lateral de esa
esquina; las distancias son el espacio libre desde el canto hasta donde empieza el tirador. El perfil se descuenta del
tablero (tablero + perfil = el frente). Los tiradores aparecen en la lista de herrajes.

**Medidas rápidas:** ancho de travesaño, retranqueo del fondo, alto y retranqueo del zócalo y el relleno de esquina tienen
botones (p. ej. 50 · 70 · 100 · Personalizado). 1T / 2T siguen el espesor del tablero.

### Cajas de gaveta
Pestaña **Gavetas**. Cajas de madera: el fondo va *encajado* entre los lados, a ras por debajo (por defecto), o *en
ranuras* de 6 mm y elevado 10 mm. Sistemas de caja metálica: elige **Blum MERIVOBOX** o **LEGRABOX** y la altura del
sistema; la altura del lateral, el fondo (MERIVOBOX LW − 51 × NL − 26) y el respaldo (LW − 51 × lateral − 8) se
completan solos. *Barandillas* añade barandillas sobre lados bajos y un respaldo alto (160 / 192 / 224 / 256). Con
tablero de 18 mm la lista de corte indica rebajar a 16 mm los cantos izquierdo y derecho del fondo por debajo, y los
extremos del respaldo por la cara trasera. *Escribir las medidas a mano* para cualquier otro sistema.

### Modelos de herrajes
Las correderas laterales y las bisagras de puertas batientes se dibujan con modelos reales (cerrado / abierto, se
cambian al abrir la gaveta o la puerta). Varias gavetas o puertas se abren una tras otra: gavetas de arriba abajo,
puertas de izquierda a derecha.

## 5. Materiales
- Cada campo de material tiene lista de muestras (▾), **cuentagotas** (clic en una cara del modelo) y **Usar actual**.
- **Igual que la caja:** todas las piezas siguen el material de la caja salvo que lo desmarques.
- **Costados vistos:** marca *El costado izquierdo / derecho es visto* para darle su propio material
  (por defecto el de los frentes).
- **Juegos de acabados:** guarda los materiales de un módulo con un nombre (p. ej. *Cocina A*) y aplícalos a cualquier
  módulo con un clic. Se guardan con tus preajustes (comparte la carpeta de preajustes para compartirlos).
- **Biblioteca de tableros:** elige la carpeta con tus texturas con nombre
  `MARCA - Nombre - 2070x2700mm - 18mm.jpg` (opcional `… NORMAL MAP.png`). Los decores aparecen en cada lista ▾ con
  su tamaño de tablero y espesores. *La veta de las imágenes va* indica si la veta de tus imágenes va de izquierda a
  derecha o de arriba abajo, para que la textura siga el largo de cada pieza.
- **Pintura a mano:** las piezas pintadas con el bote de pintura de SketchUp conservan la pintura al reconstruir,
  hasta que cambies el material de esa pieza en el configurador.

## 6. Piezas editadas a mano
Puedes cambiar piezas dentro de un módulo en SketchUp (doble clic en el módulo y luego en la pieza): acortarla,
moverla, hacer un hueco o una muesca. Al abrir una pieza para editarla, PanelPro la hace única primero, así sus
copias idénticas no cambian.

PanelPro detecta las piezas editadas y las muestra en **Módulo › Ediciones a mano** (naranja en la vista previa):

| Regla | Cuando cambia el módulo… |
|---|---|
| **Mantener la diferencia** (por defecto) | la pieza sigue p. ej. 30 mm más corta que la estándar |
| **Mantener la proporción** | la pieza sigue siendo p. ej. el 95 % de la estándar |
| **Mantener fija** | la pieza no cambia (puede dejar un hueco o un solape) |
| **Restablecer** | la pieza vuelve a lo que dibuja el configurador |

Los recortes conservan su tamaño y su distancia al borde más cercano. Antes de aplicar cambios del configurador
confirmas la regla de cada pieza editada. Tras estirar con Escala se usan las reglas guardadas; para usar otras,
Deshacer, cambia las reglas y vuelve a estirar. **Seleccionar** muestra la pieza en el modelo. La lista de corte usa la
medida real y anota *editada a mano*.

## 7. Lista de corte, optimizador y plan de corte
- Pestaña **Lista de corte**: *Módulos seleccionados* o *Todo el modelo*. Columnas: Código (A, A1, A2… por módulo
  idéntico), Módulo, Pieza, Cant., Largo (veta), Ancho, Espesor, L1 L2 W1 W2 (X = con canto), Material, Notas.
  **Exportar CSV** abre en Excel. Medidas finales con el canto incluido.
- **Optimizar tableros:** distribuye las piezas como una seccionadora (tiras a todo lo largo, luego cortes
  transversales), por material y espesor, con la veta a lo largo del tablero. Muestra tableros, % de desperdicio,
  canto y, con precios, el costo. Marca *Tablero liso (sin veta)* para permitir girar piezas. Escribe el
  *Precio por tablero* de cada decor; el precio del canto y la moneda van en Ajustes.
- **Imprimir / guardar PDF…** abre el plan de corte en el navegador: una página de resumen y luego una por tablero.
- Cada optimización se guarda en el modelo (las últimas 20).

## 8. Ajustes (⚙)
Idioma (inglés / español), carpeta de preajustes (p. ej. una carpeta compartida de Google Drive), nombres de piezas
y el optimizador: corte de sierra (4,4 mm), refilado (10 mm), tablero por defecto, margen de canto (10 %),
precio del canto, moneda.

## 9. Consejos y problemas
- **Etiquetas:** PanelPro Carcass, Fronts, Drawers, Hardware… ocúltalas en el panel Etiquetas o con los botones de la barra.
- **Módulos antiguos:** selecciónalos y *Reconstruir* una vez para tener lo más nuevo.
- **La textura se ve girada:** cambia *La veta de las imágenes va* en la biblioteca de tableros.
