# Proposal — Change 07: Persistencia, verificación y documentación

## Why

La librería funciona, pero todo lo que la persona usuaria registra **se pierde al recargar** y **no se comparte entre las cinco vistas**: `iniciarDatos()` (`js/datos.js:24`) copia siempre la semilla y la reemplaza en el estado vivo, de modo que un libro dado de alta en `libros.html` no aparece en el catálogo de `index.html`, ni en el selector de venta de `ventas.html`, y una venta confirmada en `ventas.html` no aparece en el historial de `historial.html`.

Es la última pieza del parcial (10 puntos: «Persistencia: 4; pruebas manuales registradas: 3; documentación y entrega: 3») y la que cierra las deudas que dejaron los changes anteriores: el Ejercicio 5 escribió en su spec que «en el Ejercicio 6 lo estará» y el Ejercicio 4 escribió que «en esta etapa el registro no se persiste». Sin este change, la aplicación **no tiene README**, y el formato de entrega de la consigna (p. 6) lo exige.

## What Changes

- Se conserva **libros, clientes y ventas** en `localStorage`, en **tres claves** —`libreriaABC.libros`, `libreriaABC.clientes`, `libreriaABC.ventas`— y en el **primer inicio** se cargan los ejemplos (9 libros, 4 clientes, 2 ventas).
- En los inicios posteriores **se recuperan los registros guardados sin duplicar los ejemplos ni las ventas**: la ausencia de una clave significa «primer inicio de esa colección», y la presencia significa «recuperar». No hay contador ni marca de tiempo.
- **El mismo conjunto de datos se ve en las cinco vistas**: un libro dado de alta aparece en el catálogo y en el selector de venta; un cliente, en su listado y en el selector de cliente; una venta confirmada, en el historial con sus renglones.
- **Cada mutación escribe solo su colección**: un alta de venta no reescribe el catálogo, de modo que la edición manual de un precio sobrevive a la venta siguiente — que es lo que necesita la comprobación guiada del precio histórico.
- La **venta guardada conserva el precio unitario, los subtotales y el total** aunque el precio del catálogo guardado cambie: el historial sigue derivando sus importes de lo guardado, nunca del catálogo.
- La capa de persistencia es **un archivo nuevo**, `js/persistencia.js`, único punto del proyecto que habla con `localStorage`. Sus funciones **nunca lanzan excepciones**: un almacenamiento no disponible, un JSON mal escrito o una cuota excedida dejan la aplicación funcionando en memoria, con un aviso en la consola.
- Se entrega un **`README.md` en la raíz** con las secciones que exige el formato de entrega: integrantes —con el reparto del trabajo por ejercicio—, cómo abrir `index.html` sin npm, navegación entre vistas, funcionalidades implementadas y pendientes, ubicación de los datos iniciales, funcionamiento y **límites** de `localStorage`, la guía de la comprobación del precio histórico, el **resultado observado de los ocho casos manuales** y la procedencia de las imágenes ajenas.
- Se **modifican dos escenarios de specs vivas** que describen hoy, en negativo, el comportamiento que este change elimina.

## Capabilities

### New Capabilities

- `persistencia-localstorage`: la conservación de libros, clientes y ventas en el almacenamiento del navegador, la hidratación del estado al abrir cada vista, el guardado por colección, y los límites que esa persistencia tiene y no puede resolver.
- `documentacion-entrega`: la documentación de la entrega —el `README.md` de la raíz—, con la identificación de quienes realizan el trabajo, la ubicación de los datos iniciales, el funcionamiento y los límites del almacenamiento, la guía para reproducir la comprobación del precio histórico, y el registro del resultado observado de los casos manuales.

### Modified Capabilities

- `altas-libros-clientes`: el requirement «El envío se controla sin recargar la página» —que fijaba que el conjunto local se actualizaba solo en memoria y que el registro no se persistía— se **reemplaza** por «El alta se controla sin recargar la página y el registro se guarda», con el escenario «El estado en memoria no sobrevive a la recarga» sustituido por «El estado guardado sobrevive a la recarga».
- `ventas-e-historial`: el requirement «El historial lista las ventas registradas» —con un escenario que afirmaba que la venta recién confirmada no se veía desde otra vista— se **reemplaza** por «El historial lista las ventas guardadas y las recuperadas del almacenamiento», con el escenario «El historial de otra vista muestra la venta recién confirmada».

En las dos capabilities el reemplazo se expresa como `REMOVED` + `ADDED`, no como `MODIFIED`: el validador exige que un requirement `MODIFIED` conserve exactamente los mismos escenarios, y los dos escenarios que hay que invertir afirman comportamientos que dejan de existir. Con `REMOVED` + `ADDED` el spec archivado queda con un texto verdadero, y el motivo del reemplazo queda escrito en el propio delta.

## Impact

- `js/persistencia.js` — **nuevo**: las tres claves, la lectura, la escritura, la siembra y la detección de disponibilidad del almacenamiento.
- `js/datos.js` — **modificado**: `iniciarDatos()` hidrata desde lo guardado y siembra lo que falta; `agregarLibro()`, `agregarCliente()` y `agregarVenta()` guardan su colección.
- `js/inicio.js` — **modificado**: solo el encabezado de comentarios, que registra el change. El arranque no cambia: `iniciarDatos()` sigue siendo el punto de hidratación.
- `README.md` — **nuevo**, en la raíz del proyecto.
- `docs/07-persistencia-readme/SPEC.md` y `PLAN.md` — **nuevos**: la especificación y el plan que dan origen a este change.
- `js/datos-iniciales.js`, `js/catalogo.js`, `js/altas.js`, `js/ventas.js`, `js/historial.js`, `js/validaciones.js`, los **cinco HTML**, `css/estilos.css` y `logo.png` - **sin cambios**: la persistencia no necesita HTML nuevo, ni estilos nuevos, ni tocar la semilla. El `logo.png` se mantiene y **no se reemplaza**: es una imagen ajena al equipo —obra de Chetsadakorn Nakhammoon, ilustración «ID 220305499» de Dreamstime, descargada por María de los Angeles Zalazar, a cargo del Ejercicio 1, con su cuenta— y su procedencia, su autor, su enlace y su licencia quedan **declarados en el README**, que es lo que pide el formato de entrega.
- **Sin dependencias**: ni `package.json`, ni `node_modules`, ni npm, ni herramientas de compilación, ni recursos externos. La aplicación sigue funcionando abriendo `index.html` con `file://`.
- **Riesgo de alcance**: la semilla `DATOS_INICIALES` no se muta, la venta en curso no se persiste y no se agrega ninguna pantalla nueva — las tres cosas quedan declaradas como límites en el README, no implementadas.
