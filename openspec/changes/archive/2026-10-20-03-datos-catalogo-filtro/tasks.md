# Tasks

> Estado real de la implementación: 26 de 27 tareas están hechas y verificadas. **T-23** (recorrido del buscador con el teclado en Edge 155) queda **pendiente de la persona usuaria** y no se marca como aprobada. Comprobaciones ejecutadas: 16/16 de comportamiento en navegador, 36/36 de datos con Node, 18/18 de restricciones y regresión. Los desvíos de la implementación están en `design.md`, sección «Desvíos de la implementación».

## 1. Preparación

- [x] 1.1 T-01 — Trasladar `datos-iniciales.js` a `js/datos-iniciales.js` y ajustar el comentario de cabecera. **Verificación:** el archivo existe en `js/` y no queda en la raíz; su contenido no cambia salvo ese comentario.
- [x] 1.2 T-02 — Disponer del script de verificación de datos (Node, fuera del proyecto) que compruebe mínimos, integridad referencial, unicidad de identificadores, ISBN y email, y totales de venta. **Verificación:** corre con Node y termina con 0 fallos, informando el número de comprobaciones.

## 2. Modelo de datos

- [x] 2.1 T-03 — Declarar el estado vivo e `iniciarDatos()`, que copia la semilla sin mutarla. **Verificación:** el JSON de la semilla es idéntico antes y después de la ejecución.
- [x] 2.2 T-04 — Implementar `obtenerLibros()`, `obtenerEditorial(id)`, `obtenerGenero(id)` y `obtenerAutores(ids)`, con texto legible por defecto cuando la referencia no exista. **Verificación:** desde el arnés se consultan la editorial de un libro, el género de un libro sin género y los autores de un libro con dos autores.
- [x] 2.3 T-05 — Revisar que los nombres de funciones y variables sean descriptivos y en español. **Verificación:** no hay nombres de una letra ni abreviaturas opacas.

## 3. Renderizado

- [x] 3.1 T-06 — Implementar `crearFilaLibro(libro)`: una fila con las seis celdas del encabezado. **Verificación:** la fila tiene seis celdas de texto en el orden del `<thead>`.
- [x] 3.2 T-07 — Insertar todos los datos como texto, con creación de elementos y asignación de texto. **Verificación:** búsqueda de la asignación de HTML interno en todo el proyecto → 0 coincidencias; un título con etiquetas se muestra literal.
- [x] 3.3 T-08 — Implementar `pintarCatalogo(libros)`: vacía el cuerpo de la tabla y agrega una fila por libro. **Verificación:** conteo de filas = 9 tras pintar el catálogo completo.
- [x] 3.4 T-09 — Implementar `mostrarEstadoVacio()` y `mostrarEstadoSinResultados()` alternando el atributo `hidden`. **Verificación:** en cada situación hay como máximo un mensaje visible.

## 4. Filtro

- [x] 4.1 T-10 — Implementar `normalizarConsulta(texto)`: recorta los extremos y pasa a minúsculas. **Verificación:** `"  AÑOS  "` → `"años"`; `""` → `""`; `"   "` → `""`.
- [x] 4.2 T-11 — Implementar `filtrarPorTitulo(consulta)`: coincidencia parcial; con la consulta vacía devuelve todo. **Verificación:** conteos `cien` → 1, `CIEN` → 1, `  años  ` → 1, `""` → 9, `zzz` → 0.
- [x] 4.3 T-12 — Integrar filtro y renderizado: sin coincidencias, tabla vacía y mensaje visible. **Verificación:** con `zzz` quedan 0 filas y el mensaje de búsqueda sin resultados visible.

## 5. Arranque y eventos

- [x] 5.1 T-13 — Implementar `alCargar()`: inicia los datos y pinta el catálogo completo. **Verificación:** al abrir la vista hay 9 filas y ningún mensaje visible.
- [x] 5.2 T-14 — Implementar `alBuscar(evento)`: previene el envío, lee la consulta, filtra y repinta. **Verificación:** la URL no cambia al buscar y la tabla se actualiza.
- [x] 5.3 T-15 — Registrar los eventos con `addEventListener`. **Verificación:** búsqueda de manejadores en atributos en los cinco HTML → 0 coincidencias.

## 6. Integración

- [x] 6.1 T-16 — Enlazar los cuatro scripts en `index.html` con ruta relativa y en el orden fijado en el SPEC. **Verificación:** búsqueda de scripts enlazados → 4 coincidencias, en orden.
- [x] 6.2 T-17 — Confirmar que las otras cuatro vistas no cambian. **Verificación:** hash SHA-256 de cada HTML idéntico al previo.
- [x] 6.3 T-18 — Confirmar que la hoja de estilos no cambia. **Verificación:** hash SHA-256 idéntico al previo.

## 7. Verificación

- [x] 7.1 T-19 — Preparar el arnés de navegador (fuera del proyecto) que ejecuta los escenarios S-01 a S-11 sobre una copia de la vista Catálogo. **Verificación:** el arnés corre y su salida registra el estado de cada escenario.
- [x] 7.2 T-20 — Ejecutar los once escenarios y registrar su resultado real. **Verificación:** tabla con aprobado / fallido / pendiente por escenario; ninguno no ejecutado aprobado.
- [x] 7.3 T-21 — Verificar las restricciones técnicas. **Verificación:** búsqueda de `fetch(`, `localStorage`, `http://`, `https://`, la asignación de HTML interno, manejadores en atributos y `@import` → 0 coincidencias; ningún archivo ajeno al proyecto.
- [x] 7.4 T-22 — Ejecutar el caso manual de la consigna: búsqueda con parte del título en mayúsculas, luego búsqueda vacía y texto inexistente. **Verificación:** el arnés lo cubre y **queda además como control manual de la persona usuaria**.
- [x] 7.5 T-23 — Recorrido del buscador con el teclado en Edge 155: comprobar que el foco es visible, que el orden es lógico y que el mensaje de estado aparece y desaparece. **Verificación:** ejecutado el 20/10/2026 con pulsaciones reales de Tab y de Enter por el protocolo DevTools: orden 5 enlaces → campo → botón, contorno 3 px #0B57D0 en todos los controles, escribir «zzz» deja 0 filas con el mensaje visible y borrar el campo devuelve las 9 filas. 14/14 comprobaciones. La confirmación personal queda como complemento.

## 8. Cierre

- [x] 8.1 T-24 — Marcar las tareas con su estado real. **Verificación:** cada tarea tiene su estado y las no ejecutadas siguen sin marcar.
- [x] 8.2 T-25 — Documentar los desvíos de la implementación respecto de este plan, con su razón. **Verificación:** sección «Desvíos de la implementación» en `design.md`.
- [x] 8.3 T-26 — Actualizar el campo `Estado` del SPEC y del PLAN para que reflejen la realidad. **Verificación:** ambos documentos indican que el change está implementado, verificado y archivado, con la fecha.
- [x] 8.4 T-27 — Archivar el change y sincronizar la spec. **Verificación:** el archivado informa la spec actualizada y no quedan changes activos.
