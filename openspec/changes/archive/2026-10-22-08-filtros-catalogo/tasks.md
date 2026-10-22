# Tasks

## 1. Preparación

- [x] 1.1 T-01 - Acordar con las dos integrantes si se ejecuta este change y cómo se reparte, dado que `index.html` es del Ejercicio 1, a cargo de María de los Ángeles Zalazar, y `js/catalogo.js` del Ejercicio 3. **Verificación:** el acuerdo queda anotado en el informe de comprobaciones, con el reparto de tareas de cada una.
- [x] 1.2 T-02 - Capturar la línea de base: el comportamiento actual del filtro por título, y los ocho casos manuales de la auditoría del cambio 07 que cubren la búsqueda. **Verificación:** el informe anota el resultado actual de cada caso antes de cualquier cambio.

## 2. La búsqueda por título no cambia

- [x] 2.1 T-03 - Reservar el criterio por defecto como búsqueda por título: la función que compara la consulta con los campos del libro se vuelve genérica sobre el criterio, y la búsqueda por título pasa a ser el caso por defecto. **Verificación:** el comportamiento con criterio «Título» es exactamente el actual, y el código conserva el nombre y las reglas de normalización.

## 3. Los nuevos filtros

- [x] 3.1 T-04 - En `js/catalogo.js`: armar las opciones del criterio desde el conjunto local (los autores, géneros y editoriales con su nombre) ordenados alfabéticamente, junto con «Título». **Verificación:** no hay lista fija en el código y las opciones salen del conjunto.
- [x] 3.2 T-05 - En `js/catalogo.js`: comparar la consulta normalizada contra autor, género o editorial según el criterio elegido, y tratar un libro con varios autores como coincidente si alguno de sus autores coincide. **Verificación:** la regla se anota en el diseño (D-C).
- [x] 3.3 T-06 - En `js/catalogo.js`: aplicar el rango de precio (mínimo y máximo, inclusive, con los valores que no se pueden interpretar como número tratados como ausentes). **Verificación:** la regla se anota en el diseño (D-E).
- [x] 3.4 T-07 - En `index.html`: agregar el selector de criterio, el campo de consulta, los dos campos de precio y la acción «Quitar filtros», marcando los controles nuevos con las clases y el patrón de los ya existentes. **Verificación:** no se agrega ninguna regla al CSS.
- [x] 3.5 T-08 - En `js/catalogo.js`: acumular los filtros activos y devolver al catálogo completo al usar «Quitar filtros». **Verificación:** la acción vacía consulta, criterio y precio.

## 4. Verificación

- [x] 4.1 T-09 - Correr la auditoría de persistencia y los ocho casos manuales de la auditoría del cambio 07: la búsqueda por título debe seguir dando exactamente los mismos resultados. **Verificación:** no hay regresiones.
- [x] 4.2 T-10 - Ejecutar los casos nuevos: filtro por autor, por género, por editorial, por rango de precio, por autor con varios autores, consulta vacía con criterio elegido, acumulación y quitar filtros. **Verificación:** cada caso pasa con el arnés y los casos manuales del proyecto.

## 5. Cierre

- [x] 5.1 T-11 - Documentar el filtro nuevo en la sección de funcionalidades del README. **Verificación:** el README enumera los criterios y el rango de precio.
- [x] 5.2 T-12 - Validar con `openspec validate` y confirmar que solo se modifican `index.html` y `js/catalogo.js`, además de la documentación. **Verificación:** el cambio no toca el modelo ni el CSS.
