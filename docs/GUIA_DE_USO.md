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
(forman una L). Desde la esquina: un **panel ciego** fijo (tan ancho como el fondo del otro módulo más su frente), un
**relleno de holgura** (50 mm por defecto) para que frentes y tiradores no choquen, y luego la(s) puerta(s) y gavetas.
Un **montante de bisagras** (70 mm de fondo) va detrás del borde de la puerta, desde el piso hasta el techo de la caja;
la puerta se abisagra en él. Ajusta *Fondo del módulo de la otra pared* a ese módulo.

## 4. Frentes y gavetas
Sobrepuestos o embutidos, holguras, frentes lisos / shaker / ranurados, lado de bisagra (Izq., Der., Arriba, Abajo),
ángulos de apertura, cierre suave, holgura de cubierta. Gavetas: caja, correderas laterales o sistemas metálicos;
numeradas de arriba abajo.

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
