# Tasks

## 1. Preparación

- [x] 1.1 T-01 - Calcular y anotar los hashes SHA-256 de los archivos que no deben cambiar: `index.html`, `libros.html`, `clientes.html`, `css/estilos.css`, `js/catalogo.js`, `js/altas.js` y `js/datos-iniciales.js`. **Verificación:** los siete hashes quedan anotados en el informe de comprobaciones.
- [x] 1.2 T-02 - Disponer del arnés de navegador headless, fuera del proyecto, que sirve una copia con las etiquetas `<script>` inyectadas, y del script Node que ejercita el modelo y las reglas puras. **Verificación:** el arnés corre contra la copia y devuelve el número de ventas del historial; el script Node termina con 0 fallos.

## 2. Modelo de datos

- [x] 2.1 T-03 - Agregar a `js/datos.js` la consulta `obtenerVentas()`, que devuelve las ventas del estado vivo. **Verificación:** el script Node comprueba que devuelve 2 ventas de la semilla y que la primera es `vt-2026-0001`.
- [x] 2.2 T-04 - Implementar `generarIdVenta(fecha)`, que arma `vt-` + año + número correlativo de cuatro dígitos, tomando el máximo existente de ese año. **Verificación:** el script Node comprueba que la primera venta nueva es `vt-2026-0003`, que tras registrar una el siguiente es `vt-2026-0004` y que la serie de un año nuevo arranca en `vt-2027-0001`.
- [x] 2.3 T-05 - Implementar `agregarVenta(datos)`, que crea la venta con su identificador y su total y la incorpora al estado vivo, conservando la forma de la semilla. **Verificación:** el script Node comprueba que tras el alta hay una venta más, que su forma es `{ id, fecha, clienteId, clienteNombre, renglones, total }`, que el renglón tiene `{ libroId, titulo, cantidad, precioUnitario }` **sin** subtotal y que el total es la suma de los subtotales.
- [x] 2.4 T-06 - Escribir el script de Node, fuera del proyecto, que ejercita el modelo de datos ampliado. **Verificación:** corre con Node y termina con 0 fallos, informando el número de comprobaciones.

## 3. Regla de la cantidad

- [x] 3.1 T-07 - Agregar a `js/validaciones.js` la función pura `leerCantidad(texto)`, que devuelve el entero cuando el texto es un entero mayor que cero y `null` en cualquier otro caso. **Verificación:** el script Node comprueba que «2» y « 2 » devuelven 2, y que «0», «-2», «1.5», «abc» y «» devuelven `null`.
- [x] 3.2 T-08 - Extender el script de Node para que cubra `leerCantidad()`. **Verificación:** corre con Node y termina con 0 fallos.

## 4. Composición de la venta

- [x] 4.1 T-09 - Crear `js/ventas.js` con el estado de la venta en curso: una lista de renglones `{ libroId, cantidad }` y la función que la devuelve. **Verificación:** en el arnés, la venta en curso arranca vacía y `pintarResumen()` muestra el mensaje de lista vacía.
- [x] 4.2 T-10 - Implementar `agregarRenglon(libroId, cantidad)`, que agrega un renglón y, si el libro ya está en la venta, **suma** la cantidad al renglón existente y devuelve un aviso en lugar de crear otro. **Verificación:** en el arnés, agregar dos veces el mismo libro deja **un** renglón con la cantidad sumada y un aviso visible.
- [x] 4.3 T-11 - Implementar `cambiarCantidad(libroId, cantidad)` y `quitarRenglon(libroId)`. **Verificación:** en el arnés, cambiar la cantidad de un renglón lo actualiza y quitarlo lo desaparece de la tabla.
- [x] 4.4 T-12 - Implementar `recalcular()`, que calcula el subtotal de cada renglón como `cantidad × precio unitario` y el total como la suma de los subtotales, dejando fuera los renglones con cantidad inválida. **Verificación:** en el arnés, con 2 unidades a 1500 y 1 a 2000, los subtotales son 3000 y 2000 y el total 5000.
- [x] 4.5 T-13 - Implementar `pintarFilaRenglon(renglon)`, que construye la fila con el libro, la cantidad, el precio unitario y el subtotal, con la cantidad en un `<input type="number">` editable y una acción para quitar el renglón. **Verificación:** en el arnés, la fila tiene 5 celdas, la de Cantidad contiene un `input` y la de Acciones un botón.
- [x] 4.6 T-14 - Implementar `pintarResumen()`, que dibuja la tabla de renglones y el total, y alterna el estado vacío. **Verificación:** en el arnés, con dos renglones la tabla tiene dos filas, `#venta-total` muestra el total con dos decimales y `#venta-estado-vacio` queda oculto.

## 5. Confirmación

- [x] 5.1 T-15 - Implementar `validarComposicion()`, que rechaza la confirmación cuando no hay cliente, cuando no hay renglones o cuando alguna cantidad no es un entero mayor que cero, y devuelve el motivo. **Verificación:** en el arnés, los tres casos devuelven un motivo y una venta válida devuelve `null`.
- [x] 5.2 T-16 - Implementar `alConfirmarVenta(evento)`, que previene el envío, valida la composición, y solo cuando es válida registra la venta con el precio unitario, el título y el nombre del cliente **congelados**, limpia el formulario y muestra el resultado. **Verificación:** en el arnés, tras una confirmación válida hay una venta más, el renglón guardado tiene el precio del momento, y el formulario quedó limpio con el mensaje visible.
- [x] 5.3 T-17 - Implementar la fecha local de la confirmación, con el formato `YYYY-MM-DD`, sin usar UTC. **Verificación:** en el arnés, la fecha de la venta registrada es la del día local de la confirmación.

## 6. Eventos de la venta

- [x] 6.1 T-18 - Implementar `alAgregarRenglon()`, que lee el libro y la cantidad elegida, valida la cantidad y agrega el renglón. **Verificación:** en el arnés, agregar con una cantidad inválida no crea el renglón y muestra el motivo.
- [x] 6.2 T-19 - Implementar `alCambiarCantidad()` y `alQuitarRenglon()`, que recalculan el resumen y repintan la tabla. **Verificación:** en el arnés, editar la cantidad de un renglón recalcula su subtotal y el total en el momento.
- [x] 6.3 T-20 - Registrar en `js/inicio.js` el `submit` del formulario de venta y los eventos de agregar, cambiar y quitar renglón, y llamar al render de la vista. **Verificación:** en el arnés, la vista Ventas abre sin un solo error en la consola y el resumen aparece vacío.

## 7. Vista del historial

- [x] 7.1 T-21 - Crear `js/historial.js` con `renderizarHistorial()`, que dibuja una fila por venta con identificador, fecha, cliente y total, más la acción de consultar el detalle, y alterna el estado vacío. **Verificación:** en el arnés, la vista Historial muestra 2 filas de la semilla y `#historial-estado-vacio` queda oculto.
- [x] 7.2 T-22 - Implementar `mostrarDetalle(venta)` y `cerrarDetalle()`, que muestran el bloque con los datos de la venta y sus renglones, y que lo ocultan dejando sus campos vacíos. **Verificación:** en el arnés, antes de pedir un detalle el bloque está oculto y sus `<dd>` vacíos; después de cerrarlo, vuelve a ese estado.
- [x] 7.3 T-23 - Implementar `alVerDetalle()` y registrarlo en `js/inicio.js`, junto con el clic en «Cerrar detalle». **Verificación:** en el arnés, pedir el detalle muestra el bloque con sus cuatro datos y la tabla de renglones.

## 8. Integración en el marcado

- [x] 8.1 T-24 - En `ventas.html`, desactivar la validación de restricciones del formulario y enlazar los scripts en el orden fijado. **Verificación:** el formulario tiene `novalidate` y las etiquetas `<script>` están en el orden del SPEC § 5.8.
- [x] 8.2 T-25 - En `historial.html`, enlazar los scripts en el orden fijado. **Verificación:** las etiquetas `<script>` están en el orden del SPEC § 5.8.
- [x] 8.3 T-26 - Comprobar que ningún `id`, ninguna clase y ningún texto visible ya escrito en el HTML se modificaron. **Verificación:** comparación de los cinco HTML con la versión previa, línea por línea, con solo las diferencias esperadas justificadas.
- [x] 8.4 T-27 - Revisar que no hace falta tocar `css/estilos.css`: el `<input>` de la cantidad nace fuera de `.campo` y el resto usa clases existentes. **Verificación:** el hash de `css/estilos.css` sigue igual y el hash de `js/altas.js` también.

## 9. Verificación integral

- [x] 9.1 T-28 - Ejecutar los 32 escenarios del SPEC § 4.2 y registrar el resultado de cada uno. **Verificación:** tabla con los 32 escenarios, cada uno aprobado, fallido o pendiente; ningún escenario no ejecutado se presenta como aprobado.
- [x] 9.2 T-29 - Ejecutar el caso de la consigna **2 × 1500 y 1 × 2000** con datos de prueba: fijar esos precios en dos libros de la copia de verificación. **Verificación:** los subtotales son 3000,00 y 2000,00, el total es 5000,00 y la venta queda en el historial con su detalle.
- [x] 9.3 T-30 - Verificar el precio histórico: confirmar una venta, **cambiar el precio del libro en el catálogo** y comprobar que el historial no se altera. **Verificación:** el precio unitario, los subtotales y el total del historial son los mismos antes y después del cambio.
- [x] 9.4 T-31 - Verificar el funcionamiento con `file://` en Edge 155.0.4283.62, sin servidor, y que ni agregar un renglón ni confirmar recarguen la página. **Verificación:** registro de la apertura de `ventas.html` y `historial.html` con `file://`, de un alta completa y de la URL sin cambios.
- [x] 9.5 T-32 - Ejecutar los casos manuales de la consigna que corresponden a este ejercicio: «Venta sin cliente, cantidad cero, negativa o decimal; libro repetido» y «Venta válida». **Verificación:** cada caso queda registrado con su resultado observado; la parte del cruce entre páginas **queda anotada como pendiente para el Ejercicio 6**, con su motivo, y no como aprobada.

## 10. Restricciones y regresión

- [x] 10.1 T-33 - Comprobar que se cumplen las restricciones técnicas: sin `fetch`, sin `localStorage`, sin `sessionStorage`, sin `innerHTML`, sin atributos `on*`, sin recursos externos y sin dependencias. **Verificación:** búsquedas de cada patrón en todos los archivos del proyecto → 0 coincidencias; ningún archivo ajeno al proyecto.
- [x] 10.2 T-34 - Comprobar que los siete archivos de T-01 no cambiaron. **Verificación:** los hashes SHA-256 coinciden.
- [x] 10.3 T-35 - Comprobar que el estado vivo y la semilla siguen separados: la aplicación trabaja sobre una copia y `DATOS_INICIALES` no se muta. **Verificación:** comparación del JSON de `DATOS_INICIALES` antes y después de una sesión con ventas: idéntico.
- [x] 10.4 T-36 - Comprobar que las otras vistas siguen funcionando: catálogo, altas de libros y de clientes. **Verificación:** el arnés corre los escenarios de los changes 03 y 05 sobre las vistas correspondientes y todos pasan.

## 11. Cierre

- [x] - [ ] 11.1 T-37 - Registrar los desvíos de la implementación respecto de este plan, si los hay, con su razón. **Verificación:** sección «Desvíos de la implementación» en `design.md`; si no hubo desvíos, se dice explícitamente.
- [x] - [ ] 11.2 T-38 - Actualizar el `Estado` del SPEC y del PLAN para que reflejen la realidad, con la fecha y el número de tareas cerradas. **Verificación:** ambos documentos declaran el estado real y ninguna comprobación no ejecutada aparece como aprobada.
- [x] - [ ] 11.3 T-39 - Archivar el change de OpenSpec y sincronizar las specs. **Verificación:** `openspec archive` informa las specs actualizadas; `openspec list` no muestra changes activos; `openspec list --specs` incluye la capability `ventas-e-historial` con los requisitos del Ejercicio 5.
