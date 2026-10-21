# Tasks

## 1. Preparación

- [x] 1.1 T-01 - Calcular y anotar los hashes SHA-256 de `index.html`, `historial.html`, `css/estilos.css`, `js/catalogo.js` y `js/datos-iniciales.js`, que no deben cambiar en este change. **Verificación:** los cinco hashes quedan anotados en el informe de comprobaciones.
- [x] 1.2 T-02 - Disponer del arnés de navegador headless, fuera del proyecto, que sirve una **copia** del proyecto en la que las etiquetas `<script>` quedan inyectadas, abre una vista y devuelve el estado del DOM. **Verificación:** el arnés corre contra la copia y devuelve el número de filas del catálogo.

## 2. Reglas de validación

- [x] 2.1 T-03 - Crear `js/validaciones.js` con `normalizarIsbn()`, que quita todos los espacios y guiones, y `normalizarEmail()`, que recorta los extremos y pasa a minúsculas. **Verificación:** casos concretos: `" 978-030-7474728 "` → `"9780307474728"`; `"  ANA@Example.COM "` → `"ana@example.com"`.
- [x] 2.2 T-04 - Implementar `esEmailValido()` con la expresión regular estricta, que exige una arroba, ausencia de espacios, texto antes y después y al menos un punto en el dominio. **Verificación:** la tabla de entradas del SPEC § 5.5 se resuelve entera: `ana@example.com` verdadera; `ana@example`, `ana@`, `ana`, `ana@@example.com`, `ana@ex ample.com` y `ana example.com` falsas.
- [x] 2.3 T-05 - Implementar `validarLibro()`, que devuelve `{ ok, errores }` con un mensaje completo por cada regla incumplida: título, ISBN, ISBN duplicado, precio ausente, precio no numérico, precio no mayor que cero, editorial no elegida o inexistente, ausencia de autores, autor inexistente y género inexistente. **Verificación:** los diez escenarios de rechazo del SPEC § 4.2 producen al menos un error y `ok` en `false`; un libro completamente válido produce `ok` en `true` y ningún error.
- [x] 2.4 T-06 - Implementar `validarCliente()`, con las cuatro reglas: nombre vacío, email vacío, formato inválido y email duplicado. **Verificación:** los cuatro escenarios de rechazo producen al menos un error; un cliente válido produce `ok` en `true` y ningún error.
- [x] 2.5 T-07 - Escribir un script de Node, fuera del proyecto, que ejercite `js/validaciones.js` con los casos del SPEC. **Verificación:** corre con Node y termina con 0 fallos, informando el número de comprobaciones.

## 3. Modelo de datos

- [x] 3.1 T-08 - Agregar a `js/datos.js` las consultas que faltan: `obtenerClientes()`, `obtenerEditoriales()`, `obtenerGeneros()` y `obtenerAutoresDisponibles()`, esta última con nombre propio para no chocar con la existente `obtenerAutores(ids)`. **Verificación:** el script de Node comprueba 4 clientes, 7 editoriales, 5 géneros y 10 autores, y que `obtenerAutoresDisponibles()` devuelve objetos `{ id, nombre }`.
- [x] 3.2 T-09 - Implementar las comparaciones de existencia sobre el conjunto local: `existeIsbnEn(libros, isbn)` e `existeEmailEn(clientes, email)`, que comparan el ISBN normalizado y el email normalizado. **Verificación:** el script de Node comprueba que un ISBN existente con guiones da `true`, uno nuevo da `false`, y que un email existente en mayúsculas da `true`. *Desvío del SPEC § 5.3: estas comparaciones quedaron en `js/validaciones.js` y reciben la colección, en vez de vivir en `js/datos.js` y leer el estado. Ver «Desvíos de la implementación» en `design.md`.*
- [x] 3.3 T-10 - Implementar `generarId(prefijo, texto, coleccion)`, que arma un identificador legible con guion a partir del texto, agrega un sufijo numérico si ya existe y recurre a un identificador de reserva cuando el texto no deja caracteres alfanuméricos. **Verificación:** el script de Node comprueba que «Cien años de soledad» con prefijo `li` produce `li-cien-anos-de-soledad`, que ante un identificador repetido se agrega `-2` y que dos libros con el mismo título reciben identificadores distintos.
- [x] 3.4 T-11 - Implementar `agregarLibro()` y `agregarCliente()`, que crean el registro con identificador nuevo y lo incorporan al estado vivo. **Verificación:** el script de Node comprueba que tras el alta el conjunto creció en un registro, que el registro nuevo cumple las relaciones (editorial existente, al menos un autor existente, género existente o nulo) y que la semilla `DATOS_INICIALES` quedó idéntica.
- [x] 3.5 T-12 - Escribir el script de Node, fuera del proyecto, que ejercita el modelo de datos ampliado: consultas, comprobaciones de existencia, unicidad de los identificadores y no mutación de la semilla. **Verificación:** corre con Node y termina con 0 fallos, informando el número de comprobaciones.
- [x] 3.6 T-13 - Revisar los nombres de las funciones y variables nuevas: descriptivos, en español y sin abreviaturas opacas. **Verificación:** revisión manual; no hay nombres de una letra ni siglas sin definir.

## 4. Opciones y listados

- [x] 4.1 T-14 - Crear `js/altas.js` con `pintarOpcionesEditoriales()`, `pintarOpcionesGeneros()` y `pintarOpcionesAutores()`, que agregan una `<option>` por registro conservando las opciones de texto fijo ya presentes en el HTML. **Verificación:** en el arnés, `#libro-editorial` queda con 8 opciones (la de texto fijo más 7), `#libro-genero` con 6 (la «Sin clasificar» más 5) y `#libro-autores` con 10.
- [x] 4.2 T-15 - Implementar `pintarListadoLibros()`, que vacía `#libros-listado` y dibuja una fila por libro reutilizando `crearFilaLibro()` de `js/catalogo.js`, y alterna `#libros-estado-vacio`. **Verificación:** en el arnés, el listado tiene 9 filas con 6 celdas cada una, y el mensaje de estado vacío queda oculto.
- [x] 4.3 T-16 - Implementar `pintarListadoClientes()`, que vacía `#clientes-listado` y dibuja una fila por cliente con dos celdas, y alterna `#clientes-estado-vacio`. **Verificación:** en el arnés, el listado tiene 4 filas con 2 celdas cada una, y el mensaje de estado vacío queda oculto.
- [x] 4.4 T-17 - Implementar `pintarOpcionesClienteVenta()` y `pintarOpcionesLibroVenta()`, que pueben `#venta-cliente` y `#venta-libro` desde el mismo estado local, mostrando el precio en la opción de libro. **Verificación:** en el arnés, `#venta-cliente` queda con 5 opciones (la de texto fijo más 4) y `#venta-libro` con 10 (la de texto fijo más 9).
- [x] 4.5 T-18 - Revisar que todas las opciones y celdas se construyen con `document.createElement` y `textContent`, sin `innerHTML`. **Verificación:** búsqueda de `innerHTML` en `js/` → 0 coincidencias.

## 5. Formularios de alta

- [x] 5.1 T-19 - Implementar `mostrarError()`, `mostrarExito()` y `ocultarMensaje()`, que escriben el texto del mensaje y alternan el atributo `hidden`, conservando las frases ya escritas en el HTML y agregando detrás los motivos concretos. **Verificación:** en el arnés, tras un rechazo el mensaje de error queda visible con el motivo y el de éxito oculto; tras un alta correcta, al revés.
- [x] 5.2 T-20 - Implementar `alRegistrarLibro()`, que previene el envío, lee los seis campos, valida, y solo cuando todas las reglas pasan agrega el libro, refresca el listado, muestra el resultado y limpia el formulario. **Verificación:** en el arnés, un libro válido deja el listado con 10 filas; un libro inválido lo deja con 9 y muestra el motivo.
- [x] 5.3 T-21 - Implementar `alRegistrarCliente()`, con el mismo comportamiento para el formulario de clientes. **Verificación:** en el arnés, un cliente válido deja el listado con 5 filas; un cliente inválido lo deja con 4 y muestra el motivo.
- [x] 5.4 T-22 - Comprobar que un envío no cambia la dirección de la página y que el formulario conserva lo escrito cuando el alta se rechaza. **Verificación:** en el arnés, la URL antes y después del envío coincide, y los valores del formulario siguen presentes tras un rechazo.

## 6. Arranque

- [x] 6.1 T-23 - Modificar `js/inicio.js` para que detecte la vista abierta por presencia de sus contenedores, inicialice los datos, registre los eventos de los formularios presentes y llame al render correspondiente. **Verificación:** abrir cada una de las cuatro vistas en el arnés y comprobar que ninguna produce un error en la consola.
- [x] 6.2 T-24 - Comprobar que el catálogo de `index.html` sigue funcionando sin cambios: 9 filas, filtro y estados. **Verificación:** en el arnés, la búsqueda `cien` deja 1 fila, `zzz` deja 0 y muestra el mensaje de sin resultados.

## 7. Integración en el marcado

- [x] 7.1 T-25 - En `libros.html`, desactivar la validación de restricciones del formulario, cambiar el campo de precio a texto con teclado decimal, agregar la nota de uso del selector de autores y enlazar los seis scripts en el orden fijado. **Verificación:** búsquedas de `novalidate`, `inputmode="decimal"` y `type="text"` en `#libro-precio`; las seis etiquetas `<script>` están en el orden del SPEC § 5.3.
- [x] 7.2 T-26 - En `clientes.html`, desactivar la validación de restricciones del formulario y enlazar los seis scripts en el mismo orden. **Verificación:** las seis etiquetas `<script>` están en el orden del SPEC § 5.3.
- [x] 7.3 T-27 - En `ventas.html`, enlazar los seis scripts en el mismo orden. **Verificación:** las seis etiquetas `<script>` están en el orden del SPEC § 5.3.
- [x] 7.4 T-28 - Comprobar que ningún `id`, ninguna clase y ningún texto visible ya escrito en el HTML se modificaron, salvo el atributo del campo de precio y el texto nuevo de la nota de uso. **Verificación:** comparación de los HTML con la versión previa, línea por línea, con las tres diferencias esperadas justificadas.

## 8. Verificación integral

- [x] 8.1 T-29 - Ejecutar los 28 escenarios del SPEC § 4.2 en las páginas reales y registrar el resultado de cada uno. **Verificación:** tabla con los 28 escenarios, cada uno aprobado, fallido o pendiente; ningún escenario no ejecutado se presenta como aprobado.
- [x] 8.2 T-30 - Verificar el funcionamiento con `file://` en Edge 155.0.4283.62, sin servidor. **Verificación:** registro de la apertura de `libros.html` y `clientes.html` con `file://` y del alta de un libro y de un cliente, con su resultado.
- [x] 8.3 T-31 - Ejecutar los dos casos manuales de la consigna que corresponden a este ejercicio: «alta de libro con ISBN existente y luego con ISBN nuevo» y «alta de cliente con email inválido, email existente en mayúsculas y email nuevo». **Verificación:** cada caso queda registrado con su resultado observado; la parte del primer caso que exige ver el libro en el catálogo y en la selección de venta **queda anotada como pendiente para el Ejercicio 6**, con su motivo, y no como aprobada.

## 9. Restricciones y regresión

- [x] 9.1 T-32 - Comprobar que se cumplen las restricciones técnicas: sin `fetch`, sin `localStorage`, sin `sessionStorage`, sin `innerHTML`, sin atributos `on*`, sin recursos externos y sin dependencias. **Verificación:** búsquedas de cada patrón en todos los archivos del proyecto → 0 coincidencias; ningún archivo ajeno al proyecto.
- [x] 9.2 T-33 - Comprobar que `index.html`, `historial.html`, `css/estilos.css`, `js/catalogo.js` y `js/datos-iniciales.js` no cambiaron. **Verificación:** los hashes SHA-256 de T-01 coinciden.
- [x] 9.3 T-34 - Comprobar que el estado vivo y la semilla siguen separados: la aplicación trabaja sobre una copia y `DATOS_INICIALES` no se muta. **Verificación:** comparación del JSON de `DATOS_INICIALES` antes y después de una sesión con altas: idéntico.

## 10. Cierre

- [x] 10.1 T-35 - Registrar los desvíos de la implementación respecto de este plan, si los hay, con su razón. **Verificación:** sección «Desvíos de la implementación» en `design.md`; si no hubo desvíos, se dice explícitamente.
- [x] 10.2 T-36 - Actualizar el `Estado` del SPEC y del PLAN para que reflejen la realidad, con la fecha y el número de tareas cerradas. **Verificación:** ambos documentos declaran el estado real y ninguna comprobación no ejecutada aparece como aprobada.
- [x] 10.3 T-37 - Archivar el change de OpenSpec y sincronizar las specs. **Verificación:** `openspec archive` informa las specs actualizadas; `openspec list` no muestra changes activos; `openspec list --specs` incluye la capability `altas-libros-clientes` con los requisitos del Ejercicio 4.
