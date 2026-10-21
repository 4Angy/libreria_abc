# Design — Change 07: Persistencia, verificación y documentación

## Context

La aplicación es un frontend estático de cinco documentos HTML (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`) que comparten un modelo de datos en memoria. Hoy `js/datos.js` mantiene ese modelo en una variable global `estado`, y `iniciarDatos()` la inicializa **siempre** copiando la semilla `DATOS_INICIALES` (`js/datos-iniciales.js`). Como cada vista es un documento distinto, no hay nada que comparta estado entre ellas: un alta hecha en `libros.html` no existe para `index.html` ni para `ventas.html`.

El proyecto tiene un contrato de arquitectura ya establecido, que este change respeta y no reorganiza:

- **scripts clásicos**, no módulos ES, porque con `file://` el `import` está bloqueado (verificado en Edge headless en el Change 03);
- **una responsabilidad por archivo**: la semilla, el modelo, las reglas puras, el render, el arranque;
- **dependencias en un solo sentido** y **funciones acotadas**;
- **sin dependencias externas**: ni npm, ni framework, ni CDN, ni servidor.

Las restricciones que condicionan el diseño, y que no son negociables:

| # | Restricción | Consecuencia técnica |
|---|---|---|
| 1 | Debe funcionar abriendo `index.html` con `file://` | `localStorage` tiene que estar disponible en el origen `file://` — **verificado en Edge 155.0.4283.62**: funciona, y el origen es `file://` |
| 2 | El docente va a **editar el JSON a mano** con las herramientas de almacenamiento del navegador | Lo guardado tiene que ser **legible y editable**: una lista JSON por colección, con los campos del modelo y nada más |
| 3 | La comprobación guiada modifica «únicamente el precio del libro dentro del catálogo guardado, **sin modificar ni borrar las ventas guardadas**» | El catálogo y las ventas **no pueden vivir en la misma clave**, y guardar una venta **no puede reescribir el catálogo** |
| 4 | La consigna exige «funciones acotadas y separación entre estructura, estilos y comportamiento» | La persistencia va en un archivo propio, y ese archivo no toca el DOM |
| 5 | `localStorage` es un API del navegador que **puede fallar** (modo privado estricto, cuota, JSON corrupto) | Ninguna función de la capa de persistencia puede lanzar una excepción sin capturar |
| 6 | El HTML es un contrato cerrado (Change 01) | No se puede agregar un contenedor de error global sin romperlo |

El detalle que define la forma del almacenamiento está en el requisito 3 y se verificó midiendo el comportamiento real del navegador: **con `file://`, todas las rutas locales comparten el mismo origen**, así que una copia del proyecto abierta desde el disco ve los mismos registros que el original; con `http://`, cada origen tiene su almacenamiento. La guía del caso 6 del README tiene que decirlo, o el docente concluye que la copia está rota.

## Goals / Non-Goals

**Goals:**

- Que lo registrado sobreviva a la recarga y sea **el mismo conjunto de datos en las cinco vistas**.
- Que recargar **no duplique** los datos de ejemplo ni las ventas: la regla tiene que ser una sola y no depender de contadores ni de marcas de tiempo.
- Que el catálogo guardado sea **editable a mano** por el docente, en una clave que no contenga las ventas.
- Que un fallo del almacenamiento **no rompa** la aplicación ni interrumpa la operación que la persona usuaria pidió.
- Que la entrega quede documentada en un `README.md` que permita **reproducir la comprobación guiada** y **registrar el resultado observado** de los ocho casos manuales.
- Que el spec archivado diga la verdad: ningún requirement Describe un comportamiento que el sistema ya no tiene.

**Non-Goals:**

- Seguridad, cifrado, autenticación o sincronización entre equipos: la consigna dice que el almacenamiento «sirve para la práctica; no representa seguridad ni integridad garantizada por un servidor».
- Una pantalla para editar precios: la consigna dice «No se exige una pantalla para editar precios».
- Persistir la venta en curso: es estado de un formulario, no un registro.
- Persistir editoriales, géneros y autores: no tienen interfaz de alta y la consigna solo pide libros, clientes y ventas.
- Botón de «restaurar datos», exportar/importar, o cualquier otra funcionalidad nueva: quedan como propuestas pendientes, no implementadas.
- Cambiar el modelo de datos, el CSS, el HTML o la semilla.
- **Reemplazar `logo.png` o modificarlo**: es una imagen ajena al equipo y además es del Ejercicio 1, a cargo de otra coautora. La consigna pide declarar su procedencia, no cambiarla (D-L).

## Decisions

### D-A — Tres claves, una por colección

`libreriaABC.libros`, `libreriaABC.clientes`, `libreriaABC.ventas`.

**Por qué.** El requisito 3 de la tabla de contexto es literal: el docente tiene que poder cambiar el precio de un libro **sin tocar las ventas guardadas**. Con una clave única, `libreriaABC.datos`, el catálogo sería una parte de un objeto y el docente tendría que editar un JSON grande con el riesgo de pisar las ventas; además, cualquier escritura reescribiría el objeto entero.

El prefijo `libreriaABC.` evita colisiones con otras aplicaciones que compartan origen en el mismo navegador, y deja las claves legibles en la lista del almacenamiento.

**Alternativa considerada.** Una sola clave con las tres colecciones: más simple de contar, pero peor para la comprobación guiada y peor para la edición a mano. Descartada.

### D-B — Un archivo nuevo, `js/persistencia.js`, y nada más habla con `localStorage`

La capa de persistencia expone las claves, la lectura, la escritura, la siembra y la detección de disponibilidad. No toca el DOM, no conoce el modelo y no lanza excepciones.

**Por qué.** El proyecto ya separa por responsabilidad: la semilla, el modelo, las reglas puras, el render, el arranque. Meter el `localStorage` dentro de `js/datos.js` mezclaría dos responsabilidades en un archivo que hoy es el modelo puro.

**Alternativa considerada.** Que `js/datos.js` hable directamente de `localStorage`: menos archivos, pero el modelo dejaría de ser independiente del navegador y las pruebas del modelo en Node (las que usa el arnés del Change 06) se romperían. Descartada.

### D-C — El guardado se dispara desde el modelo, y escribe solo su colección

`agregarLibro()` escribe la clave de libros; `agregarCliente()`, la de clientes; `agregarVenta()`, la de ventas. Son los tres únicos caminos que agregan un registro.

**Por qué.** Dos razones que apuntan en la misma dirección.

La primera es que **el estado guardado no pueda divergir del estado vivo**: si el guardado viviera en la capa de eventos (`altas.js`, `ventas.js`), un camino de alta nuevo podría no persistir, y nadie se enteraría hasta que la persona usuaria recargara.

La segunda es el requisito 3: con el guardado por colección, **una venta no reescribe el catálogo**. Si el docente cambió a mano el precio de un libro en `libreriaABC.libros` y después se registra una venta, la edición sobrevive. Con un guardado de todo junto, la venta siguiente pisaría el precio editado y la comprobación guiada fallaría sin explicación.

**Alternativa considerada.** Guardar en la capa de eventos: más explícito, pero con el riesgo del camino olvidado. Descartada.

### D-D — La ausencia de una clave significa «primer inicio de esa colección»

Al abrir una vista, para cada colección: si la clave existe, se recupera; si no, se usa la semilla y **se escribe esa clave**.

**Por qué.** Es la única regla que evita duplicados sin estado extra. No hay contador, ni marca de tiempo, ni bandera de «ya sembré»: la presencia de la clave **es** la evidencia de que ya se sembró. Por eso recargar tres veces seguidas no duplica nada, y por eso borrar una clave con las herramientas del navegador re-siembra exactamente esa colección.

**Alternativa considerada.** Una marca de tiempo de siembra o un `flag` en el almacenamiento: más código y una fuente más de desincronización. Descartada.

### D-E — Lo guardado es una lista JSON con la forma del modelo, sin envoltorio

Cada clave guarda `JSON.stringify(coleccion)`, y cada elemento tiene exactamente los campos que ya usa el modelo (y que ya tienen la forma de la semilla).

**Por qué.** Es lo que la consigna pide —«la ubicación y estructura del catálogo guardado se identifican en el README para reproducir esta comprobación»— y lo que hace posible que el docente edite el precio a mano y entienda lo que ve. Un envoltorio con metadatos o con una versión obligaría al docente a atravesarlo.

Además, el renglón de una venta **no guarda el subtotal**: se deriva como `cantidad × precioUnitario`, igual que en la semilla. Así el detalle no puede desincronizarse del total.

**Alternativa considerada.** Guardar un objeto con metadatos de versión para poder migrar el formato en el futuro: es una necesidad hipotética de un parcial que se entrega una vez. La migración se resuelve, si alguna vez hace falta, leyendo la forma. Descartada.

### D-F — Los datos recuperados se validan por forma antes de usarse

Al leer, cada colección se valida: tiene que ser una lista y cada elemento tiene que tener los campos que el modelo necesita. Si algo no cuadra, la colección se descarta, se usa la semilla y **la clave no se sobrescribe**.

**Por qué.** El contenido guardado puede venir de dos sitios: la aplicación, que lo escribe bien, y la mano del docente, que puede escribir un JSON mal formado. Un `JSON.parse` que falla, o un elemento sin `id` o sin `precio`, no puede romper la aplicación: en el peor de los casos, la vista dibuja datos de ejemplo y la consola explica qué pasó.

Dejar la clave sin sobrescribir es deliberado: si el docente escribió mal el JSON, **sobrescribirlo borraría su intento** y el error pasaría inadvertido.

**Alternativa considerada.** Confiar en que el JSON siempre es válido: el fallo aparecería como una vista en blanco, sin explicación. Descartada.

### D-G — Ningún fallo del almacenamiento interrumpe a la persona usuaria

Si el almacenamiento no está disponible, o no se puede escribir, la aplicación **sigue funcionando en memoria** y deja un aviso en la consola. La operación que la persona usuaria pidió se completa y muestra su mensaje de resultado normal.

**Por qué.** R-05 exige que la aplicación funcione al abrir el archivo. Un error visible por un problema del almacenamiento dejaría la aplicación inutilizable justo en el caso en que el navegador la bloquea, y además sería un mensaje técnico en una interfaz que no tiene dónde mostrarlo: **no hay un contenedor de error global** en las cinco vistas, y agregarlo rompería el contrato del Change 01.

El aviso va a la consola porque ahí es donde el docente va a mirar si algo falla, y porque es el único canal que no exige tocar el HTML.

**Alternativa considerada.** Mostrar un aviso en pantalla: exige un contenedor nuevo en las cinco vistas. Queda como propuesta pendiente, no implementada.

### D-H — La venta en curso no se persiste

**Por qué.** Es estado de un formulario, no un registro de la aplicación. Persistirla obligaría a guardar, en cada renglón, la cantidad como texto editable y a decidir qué hacer con una venta a medio componer. El Exercise 5 ya lo declaró como límite, y el README lo declara como tal.

### D-I — El README es un documento de entrega, no una nota técnica

Doce secciones, en el orden que las pide el formato de entrega: integrantes, apertura sin npm, navegación, funcionalidades implementadas, funcionalidades pendientes, datos iniciales, el almacenamiento y sus límites, la guía de la comprobación del precio histórico, los casos manuales, las imágenes, la entrega y las tecnologías.

La sección de límites **no se.copy de manual**: se escribe con lo medido (§ 4 del SPEC), porque son los límites que el docente va a encontrar de verdad —el del origen `file://` compartido y el de la copia del proyecto— los que no aparecen en ninguna documentación genérica.

### D-J — Los casos manuales se ejecutan y se registran con su resultado real

Los ocho casos de la consigna se ejecutan en el navegador y el README registra lo observado. Un caso que no se ejecutó queda como pendiente, con su motivo; un caso que falla queda con su comportamiento real.

**Por qué.** La consigna es explícita: «Si un caso falla o una funcionalidad queda pendiente, se registra el comportamiento real. No se indica una prueba como aprobada sin ejecutarla».

### D-K — El delta de las dos capabilities existentes es `REMOVED` + `ADDED`, no `MODIFIED`

**Por qué.** `openspec validate --strict` exige que un requirement `MODIFIED` conserve **exactamente** el mismo conjunto de escenarios: no admite renombrar uno ni agregar otro. Los dos escenarios que hay que invertir —«El estado en memoria no sobrevive a la recarga» y «El historial de otra vista no muestra la venta recién confirmada»— afirman comportamientos que dejan de existir, así que no pueden quedarse con su título.

La alternativa sería conservar los títulos y reescribirles el `THEN`, pero dejaría en la spec un escenario titulado «el historial de otra vista **no** muestra la venta» con un `THEN` que dice que sí la muestra: una contradicción dentro de la propia spec.

`REMOVED` + `ADDED` deja el spec archivado con un texto verdadero, y obliga a escribir el motivo y el camino de migración, que es información que el docente y el propio proyecto necesitan.

**Consecuencia aceptada.** Los dos requirements quedan con un título nuevo y se reubican al final de su spec, porque el merge del CLI conserva el orden de los requirements que sobreviven y agrega al final los nuevos. Es un costo menor contra una spec que miente.

### D-L — El logo se mantiene y su procedencia se declara en el README

**Por qué.** La imagen de la cabecera (`logo.png`) **no es obra del equipo**: es una ilustración de Dreamstime —«ID 220305499», de Chetsadakorn Nakhammoon— descargada de esa página por **María de los Angeles Zalazar**, a cargo del Ejercicio 1, usando su cuenta. La licencia Libre de Derechos de Dreamstime cubre el uso educativo, y la atribución que la agencia pide tiene una forma fija, así que documentarla es un dato, no un trámite.

Sustituirla por un recurso propio se evaluó y se descartó: obligaría a tocar los cinco HTML y a modificar el requirement de `presentacion-css`, que nombra `logo.png` y cuyo escenario exige que el fondo de la imagen «no se perciba como un parche». Eso ampliaría el alcance de un change que es de persistencia y documentación, y el recurso es del Ejercicio 1, a cargo de otra persona del equipo.

Lo que sí se hace —y lo que el formato de entrega pide— es **declarar la procedencia**: la obra, el autor, el enlace a la fuente, la licencia y la línea de crédito «ID 220305499 © Chetsadakorn Nakhammoon | Dreamstime.com», dejando constancia de que la imagen no es propia del equipo.

**Alternativas consideradas.** (a) Declararla sin más, sin la línea de crédito: es el mínimo, pero deja al docente sin el crédito que la agencia pide. (b) Reemplazarla por un SVG propio de un libro abierto: resuelve la procedencia, pesa un kilobyte y es nítido a cualquier tamaño, pero amplía el alcance y toca trabajo de otra persona del equipo. (c) Quitarle el fondo blanco, que la licencia permite: mejora la integración visual, pero el archivo es de María de los Angeles Zalazar y no corresponde modificarlo sin consultarla (P-07).

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| El docente edita el JSON y lo deja mal escrito | La colección se valida por forma; si no cuadra, se usa la semilla, **la clave no se sobrescribe** y la consola explica el problema (D-F) |
| El docente edita el precio, registra una venta y la venta pisa el catálogo | El guardado es por colección: una venta solo escribe `libreriaABC.ventas` (D-C) |
| La persona usuaria abre dos vistas a la vez y una pisa a la otra | Es un límite de `localStorage` (última escritura gana). Se documenta en el README; el proyecto no tiene forma de resolverlo sin servidor |
| El almacenamiento no está disponible (modo privado estricto, política de la organización) | La aplicación sigue funcionando en memoria y avisa en la consola (D-G) |
| La cuota del origen se agota | `setItem` falla, la operación se completa igual y la consola lo explica (D-G). Con 9 libros, 4 clientes y 2 ventas la cuota es irrelevante |
| Recargar no duplica, pero **borrar** una clave re-siembra esa colección | Es la regla de D-D, y es el comportamiento esperado: borrar el almacenamiento es «volver al primer inicio». Se documenta en el README |
| La copia del proyecto abierta con `file://` ve los datos del original | Es la consecuencia de que `file://` sea un único origen. Se explica en la guía del caso 6, con la alternativa de servir la copia por HTTP en otro puerto |
| El spec archivado reordena dos requirements | Costo menor del reemplazo `REMOVED` + `ADDED` (D-K) |
| Los datos guardados son editables por cualquiera que abra la aplicación en ese origen | Es el límite que la consigna acepta explícitamente: el almacenamiento «no representa seguridad ni integridad garantizada por un servidor». Se declara en el README |

## Migration Plan

No hay migración: **la aplicación no tiene datos que migrar**. El almacenamiento es nuevo y su primer uso siembra los datos de ejemplo.

El único caso que merece una nota es el de una persona que ya venía usando la aplicación antes de este change: no tenía registros guardados, así que no hay nada que conservar ni nada que convertir.

**Rollback.** Sacar `js/persistencia.js`, deshacer los cambios en `js/datos.js` y borrar el `README.md` devuelve la aplicación a su estado anterior. Las claves que queden en el almacenamiento no interfieren: sin código que las lea, son datos inertes. Para volver a empezar desde cero, basta con borrarlas con las herramientas del navegador.

## Open Questions

Ninguna que bloquee la implementación. Los dos datos que estaban abiertos en el SPEC se resolvieron el 20/10/2026, y ambos eran de **documentación**, no de diseño:

- **Nombres de los integrantes** (`PD-01`, resuelto): **Julieta Cecilia Herrera** (ejercicios 4 a 6) y **María de los Angeles Zalazar** (ejercicios 1 a 3). La sección 1 del README los nombra y reparte el trabajo por ejercicio.
- **Procedencia de `logo.png`** (`PD-02`, resuelto): la obra es de Chetsadakorn Nakhammoon (ilustración «ID 220305499» de Dreamstime), descargada por María de los Angeles Zalazar con su cuenta. La sección de imágenes del README declara obra, autor, enlace, licencia y línea de crédito (D-11, D-L).

Quedan dos detalles menores, que no cambian ni las specs ni el plan:

- **Navegador de referencia del docente** (`PD-03`): la verificación se hace en Edge 155.0.4283.62, el único instalado. Si el docente usa otro, la diferencia se documenta en el README.
- **Modalidad y canal de entrega** (`PD-04`): la consigna dice que el docente lo comunica por separado. La sección de la entrega describe el contenido de la carpeta, que es lo que el README puede documentar.

## Desvíos de la implementación

### D-A — Los cinco HTML incorporan una etiqueta `<script>`

**Qué se decidió.** El SPEC y el PLAN decían que los cinco HTML quedaban «sin cambios».

**Qué se hizo.** Cada vista ganó una línea:

```html
  <script src="js/datos-iniciales.js"></script>
+ <script src="js/persistencia.js"></script>
  <script src="js/datos.js"></script>
```

**Por qué fue inevitable.** Un archivo nuevo tiene que ser referenciado por alguien para que el navegador lo cargue, y las vistas son lo único que referencia los scripts. La alternativa —meter la persistencia dentro de `js/datos.js`— contradecía la decisión D-B de tener una capa propia.

**Por qué no rompe nada.** No se modifica ningún `id`, ninguna clase ni ningún texto visible; el script es del propio proyecto, con ruta relativa, y se carga en el orden de dependencia. Ninguna spec viva prohíbe agregar un script del proyecto: `libreria-frontend` solo exige que no haya recursos de otro origen, y `datos-catalogo` exige que el orden de carga respete las dependencias. La verificación de T-35 comprueba que, quitando esa única línea, los cinco archivos vuelven a su hash original.

### D-B — Las funciones de guardado reciben la colección

**Qué se decidió.** El SPEC (§ 5.3) describía `guardarLibros()`, `guardarClientes()` y `guardarVentas()` como funciones que escriben «la colección correspondiente del `estado` vivo».

**Qué se hizo.** Reciben la colección como parámetro: `guardarLibros(estado.libros)`.

**Por qué.** La decisión D-B dice que la capa de persistencia «no conoce el modelo». Si las funciones leyeran el `estado` global —que se declara en `js/datos.js`—, la dependencia iría en los dos sentidos: `datos.js` usa a `persistencia.js` y `persistencia.js` usaría a `datos.js`. Con el parámetro, la dependencia va en un solo sentido y las dos capas siguen siendo independientes. El comportamiento observable es exactamente el que pedía el SPEC.

### D-C — El instrumental de los changes anteriores hubo que ajustarlo

Los guiones de regresión de los changes 03, 05 y 06 viven fuera del proyecto y cargan `js/datos.js` en un entorno de Node. Como `iniciarDatos()` ahora hidrata desde el almacenamiento, esos guiones tienen que cargar también `js/persistencia.js` y proveerse de un almacenamiento simulado. Se ajustaron en el instrumental del change 07; **no se tocó ningún archivo de la entrega** ni el instrumental de los changes anteriores.

### D-D — Un control de la auditoría del Change 06 falla, y ya fallaba antes

La auditoría `auditoria-ventas-extra.js` del Change 06 tiene un control —«Una venta recién confirmada en el historial»— que **falla igual sin la persistencia**: se comprobó ejecutando la misma auditoría contra una copia del proyecto con la capa de persistencia desactivada, y el resultado es idéntico (6 de 7). La causa es del guion, no del producto: el control necesita un contenedor `#historial-listado` que solo existe en la vista Historial, y la auditoría corre en la vista Ventas. No es una regresión de este change y no se modificó el producto para acomodarlo.

No hay ningún otro desvío.
