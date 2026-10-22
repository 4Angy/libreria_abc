# Proposal — Change 08: Más variantes de filtro en el catálogo

## Why

La devolución del Parcial 1 —**100/100**— deja dos recomendaciones. Esta es la primera: *«Considerar la implementación de más variantes de filtro en el catálogo para mejorar la usabilidad»*.

El filtro actual cumple lo que pedía la consigna y lo que el docente califica con 5/5: busca por título, ignora mayúsculas y minúsculas, recorta los espacios y distingue entre «no hay coincidencias» y «no hay libros». Pero es **un solo campo**: quien quiere encontrar un libro de un autor o de un género tiene que recorrer la tabla, y a la larga el catálogo se vuelve largo.

La recomendación apunta a la usabilidad, no a un defecto: no hay ningún comportamiento roto. Por eso este change es **una mejora posterior a la entrega**, no una corrección, y no altera el parcial ya evaluado.

## What Changes

- El buscador del catálogo ofrece **elegir el campo por el que se busca**: título, autor, género o editorial.
- Se agregan **dos campos numéricos** para acotar por precio, que se aplican junto con el criterio elegido.
- Los filtros **se acumulan**: un libro aparece solo si cumple todos los filtros activos.
- Se agrega una **acción para quitar los filtros** y volver al catálogo completo.
- Los criterios se generan **a partir del conjunto local**, como el resto de las opciones de la aplicación.
- La búsqueda por título **no cambia**: sigue siendo el criterio por defecto, con las mismas reglas y los mismos estados.

## Capabilities

### New Capabilities

Ninguna: es una ampliación de una capacidad existente.

### Modified Capabilities

- `datos-catalogo`: el requirement «El filtro por título normaliza la consulta» pasa a decir que el título es el criterio **por defecto** mientras no se elija otro, y se agregan dos requirements nuevos: uno sobre el filtrado por los demás campos y otro sobre la acumulación de filtros y su quita.

## Impact

- `js/catalogo.js` — el filtro: un criterio más, la comparación por autor, género y editorial, el rango de precio, la acumulación y la acción de quitar.
- `index.html` — **modificado**: el buscador gana un selector de criterio y dos campos de precio. Es el Ejercicio 1, a cargo de María de los Ángeles Zalazar, así que su ejecución requiere el acuerdo de las dos integrantes.
- `css/estilos.css` — **sin cambios**: los controles nuevos usan las clases que ya existen (`.campo`, `.campo--busqueda`), de modo que no hace falta ninguna regla nueva. Es la decisión D-H del `design.md`.
- `js/datos.js` — **sin cambios**: el modelo ya tiene `autorIds`, `generoId`, `editorialId` y `precio` en cada libro; el filtro solo los lee.
- `README.md` — se documenta el filtro nuevo en la sección de funcionalidades.
- Sin dependencias, sin recursos externos y sin cambios en las otras cuatro vistas.
