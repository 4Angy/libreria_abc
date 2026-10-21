# Tasks

## 1. Preparación

- [x] 1.1 T-01 - Calcular y anotar los hashes SHA-256 de los archivos que este change no debe modificar: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`, `css/estilos.css`, `js/catalogo.js`, `js/altas.js`, `js/ventas.js`, `js/historial.js`, `js/validaciones.js`, `js/datos-iniciales.js` y `logo.png`. **Verificación:** los trece hashes quedan anotados en el informe de comprobaciones.
- [x] 1.2 T-02 - Preparar el instrumental, fuera del proyecto: la copia del proyecto servida por HTTP y el conductor de Edge por el protocolo DevTools, que admite URLs `file://`. **Verificación:** el arnés devuelve el número de libros del catálogo y abre una URL `file://` devolviendo el origen `file://`.
- [x] 1.3 T-03 - Escribir el guion de Node que ejercita la capa de persistencia contra un `localStorage` simulado, para poder probarla sin navegador. **Verificación:** corre con Node y termina con 0 fallos, informando el número de comprobaciones.

## 2. Capa de persistencia

- [x] 2.1 T-04 - Crear `js/persistencia.js` con las tres claves como constantes: `CLAVE_LIBROS`, `CLAVE_CLIENTES` y `CLAVE_VENTAS`. **Verificación:** el archivo existe y las constantes valen `libreriaABC.libros`, `libreriaABC.clientes` y `libreriaABC.ventas`.
- [x] 2.2 T-05 - Implementar `almacenamientoDisponible()`, que informa si el almacenamiento local se puede usar. **Verificación:** el guion de Node comprueba que devuelve `true` con un almacenamiento disponible y `false` cuando no lo hay, y que nunca lanza.
- [x] 2.3 T-06 - Implementar `leerGuardado(clave)`: lee el valor, lo interpreta como JSON, valida que sea una lista y que cada elemento tenga los campos del modelo, y devuelve `null` ante cualquier problema, sin lanzar. **Verificación:** el guion de Node cubre la clave ausente, el JSON inválido, un valor que no es una lista, un elemento sin un campo obligatorio y la lista válida.
- [x] 2.4 T-07 - Implementar `escribirGuardado(clave, valor)`: serializa y escribe, y devuelve si pudo hacerlo, sin lanzar. **Verificación:** el guion de Node comprueba la escritura correcta y el fallo de cuota.
- [x] 2.5 T-08 - Implementar `hayGuardado(clave)` y las tres funciones de guardado por colección. **Verificación:** el guion de Node comprueba que guardar la colección de libros escribe **solo** la clave de libros y deja las otras dos intactas.

## 3. Hidratación del estado

- [x] 3.1 T-09 - Modificar `iniciarDatos()` en `js/datos.js` para que, por cada colección, recupere lo guardado cuando la clave existe y use la semilla cuando no. **Verificación:** con el almacenamiento vacío hay 9 libros, 4 clientes y 2 ventas; con el almacenamiento lleno, el conjunto es el guardado.
- [x] 3.2 T-10 - Escribir al abrir la vista **solo** las claves que faltaban, y no volver a escribir las que ya existían. **Verificación:** tras el primer inicio las tres claves existen; tras el segundo inicio, su contenido es idéntico byte a byte.
- [x] 3.3 T-11 - Rehidratar siempre las colecciones auxiliares desde la semilla, sin guardarlas. **Verificación:** el JSON de `DATOS_INICIALES` antes y después de una sesión con altas y ventas es idéntico.

## 4. Guardado en las mutaciones

- [x] 4.1 T-12 - Hacer que `agregarLibro()` guarde la clave de libros. **Verificación:** en el arnés, tras un alta la clave de libros contiene el libro y las otras dos claves no cambiaron.
- [x] 4.2 T-13 - Hacer que `agregarCliente()` guarde la clave de clientes. **Verificación:** ídem, con el cliente registrado.
- [x] 4.3 T-14 - Hacer que `agregarVenta()` guarde la clave de ventas, con el renglón y su precio congelado. **Verificación:** ídem, y el detalle de la venta recuperada muestra el precio confirmado.

## 5. Comprobación de la persistencia en el navegador

- [x] 5.1 T-15 - Comprobar que recargar no duplica nada: tres recargas seguidas conservan los mismos conteos de libros, clientes y ventas. **Verificación:** los conteos son idénticos antes y después de la tercera recarga.
- [x] 5.2 T-16 - Comprobar que las cinco vistas ven el mismo conjunto de datos: el libro nuevo en el catálogo y en el selector de venta, el cliente nuevo en su listado y en el selector, la venta en el historial con su detalle. **Verificación:** el guion del arnés informa los conteos de las cinco vistas.
- [x] 5.3 T-17 - Comprobar que el precio editado a mano en la clave del catálogo sobrevive a una venta confirmada y a una recarga. **Verificación:** el precio sigue editado después de confirmar una venta y recargar.
- [x] 5.4 T-18 - Comprobar que un almacenamiento no disponible o un JSON mal escrito no rompen la aplicación. **Verificación:** la vista se dibuja, la operación se completa y no hay ninguna excepción en la consola.

## 6. Apertura directa con `file://`

- [x] 6.1 T-19 - Verificar con `file://` en Edge 155.0.4283.62 que las tres claves se escriben y se recuperan, y que el catálogo dibuja los datos. **Verificación:** la lectura de las claves por el conductor de DevTools devuelve los registros esperados tras recargar.

## 7. El README

- [x] 7.1 T-20 - Crear `README.md` en la raíz con las secciones de integrantes, apertura sin npm, navegación entre las vistas, funcionalidades implementadas y funcionalidades pendientes, y ubicación de los datos iniciales. **Verificación:** las seis secciones existen, con su contenido, y el README no dice que falte ninguna; la sección de integrantes nombra a **Julieta Cecilia Herrera** —ejercicios 4 a 6— y a **María de los Ángeles Zalazar** —ejercicios 1 a 3—, con el reparto por ejercicio.
- [x] 7.2 T-21 - Agregar al README la sección de la persistencia: qué se guarda, las tres claves, la forma del contenido, cuándo se escribe y los límites medidos del almacenamiento. **Verificación:** los límites nombran el navegador, el perfil y la ubicación de apertura, y la guía dice que una copia abierta con `file://` ve los mismos registros que el original.
- [x] 7.3 T-22 - Agregar al README la guía de la comprobación del precio histórico, con la clave, la estructura, qué modificar, qué no tocar y qué se espera ver. **Verificación:** siguiendo la guía se puede repetir la comprobación sin ayuda externa.
- [x] 7.4 T-23 - Agregar al README la sección de los ocho casos manuales con el resultado observado de cada uno. **Verificación:** hay una fila por caso, con lo que se hizo y lo que se vio.
- [x] 7.5 T-24 - Agregar al README las secciones de procedencia de la imagen, contenido de la entrega y tecnologías. **Verificación:** la procedencia de `logo.png` queda declarada con los cuatro datos —obra, autor, enlace y licencia— y con la línea de crédito «ID 220305499 © Chetsadakorn Nakhammoon | Dreamstime.com», deixando constancia de que la imagen no es obra del equipo; la sección de la entrega dice que no hay dependencias instaladas ni herramientas de compilación.

## 8. Los casos manuales de la consigna

- [x] 8.1 T-25 - Ejecutar el caso 1 —búsqueda con parte del título en mayúsculas, búsqueda vacía y texto inexistente— y registrar el resultado. **Verificación:** el resultado está en la tabla del README.
- [x] 8.2 T-26 - Ejecutar el caso 2 —alta de libro con ISBN existente y luego con ISBN nuevo— y registrar el resultado. **Verificación:** el resultado está en la tabla del README.
- [x] 8.3 T-27 - Ejecutar el caso 3 —alta de cliente con email inválido, email existente en mayúsculas y email nuevo— y registrar el resultado. **Verificación:** el resultado está en la tabla del README.
- [x] 8.4 T-28 - Ejecutar el caso 4 —venta sin cliente, cantidad cero, negativa o decimal, y libro repetido— y registrar el resultado. **Verificación:** el resultado está en la tabla del README.
- [x] 8.5 T-29 - Ejecutar el caso 5 —venta válida de dos unidades a 1500 y una a 2000— y registrar el resultado. **Verificación:** el resultado está en la tabla del README, con los subtotales 3000 y 2000 y el total 5000.
- [x] 8.6 T-30 - Ejecutar el caso 6 —venta confirmada y cambio exclusivo del precio del catálogo guardado, en una copia de prueba del proyecto— y registrar el resultado. **Verificación:** el resultado está en la tabla del README y el detalle conserva el precio unitario, los subtotales y el total.
- [x] 8.7 T-31 - Ejecutar el caso 7 —recarga después de altas y venta— y registrar el resultado. **Verificación:** el resultado está en la tabla del README y no hay ejemplos ni ventas duplicados.
- [x] 8.8 T-32 - Ejecutar el caso 8 —navegación por teclado y anchos de 320 px y 1280 px— y registrar el resultado. **Verificación:** el resultado está en la tabla del README.
- [x] 8.9 T-33 - Revisar la tabla de casos: ningún caso no ejecutado figura como aprobado, y los fallos y pendientes están registrados con su comportamiento real. **Verificación:** la revisión queda anotada en el informe de comprobaciones.

## 9. Restricciones, regresión y cierre

- [x] 9.1 T-34 - Verificar que se respetan las restricciones técnicas: sin `fetch`, sin recursos externos, sin CDN, sin `import` de módulos ES, sin dependencias, sin estilos en línea y sin manejadores en atributos. **Verificación:** las búsquedas de los patrones prohibidos dan 0 coincidencias, y no hay `package.json` ni `node_modules`.
- [x] 9.2 T-35 - Verificar que los trece hashes de T-01 siguen iguales. **Verificación:** los hashes coinciden.
- [x] 9.3 T-36 - Ejecutar los guiones de regresión de los changes 03, 05 y 06 sobre el catálogo, las altas y las ventas. **Verificación:** todos los guiones pasan.
- [x] 9.4 T-37 - Actualizar el estado del SPEC y del PLAN para que refleje lo realmente hecho, con los controles aprobados, fallidos, omitidos y pendientes distinguidos. **Verificación:** ninguno de los dos documentos presenta como aprobado un control no ejecutado.
- [x] 9.5 T-38 - Archivar el change y sincronizar las specs: `openspec archive` informa las capabilities actualizadas y `openspec list --specs` incluye `persistencia-localstorage` y `documentacion-entrega`. **Verificación:** el archive termina sin observaciones y `openspec validate --strict` sigue pasando.
- [x] 9.6 T-39 - Registrar el commit con los archivos de la entrega, la documentación y el change archivado. **Verificación:** `git status` queda limpio y `git log` muestra el commit.
