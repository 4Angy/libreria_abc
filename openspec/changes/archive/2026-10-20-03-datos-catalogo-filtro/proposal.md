# Proposal — Change 03: Datos locales, catálogo y filtro

## Why

El frontend ya tiene estructura semántica (Change 01) e identidad visual (Change 02), pero no muestra información: el `<tbody id="catalogo-listado">` de `index.html` está vacío y el buscador no hace nada. El Ejercicio 3 del parcial introduce el modelo de datos local, el renderizado del catálogo y el filtro por título, y vale 15 de los 100 puntos (criterio «3. Datos y catálogo»: modelo y ejemplos 5, renderizado 5, filtro y estados 5).

## What changes

- Se define el conjunto de datos local —libros, editoriales, géneros, autores y clientes— con arrays, objetos e identificadores estables, entregado en `js/datos-iniciales.js`.
- El catálogo se dibuja con JavaScript a partir de ese conjunto, con las seis columnas que ya declara el `<thead>`.
- El filtro por título ignora mayúsculas y minúsculas, admite coincidencias parciales y recorta los espacios de los extremos.
- Una búsqueda vacía muestra el catálogo completo; una búsqueda sin coincidencias muestra un mensaje claro y no deja filas residuales.
- Un libro sin género se muestra con el texto «Sin clasificar».
- Los datos se insertan en el DOM como texto, sin interpretarlos como HTML.
- Se enlazan los scripts desde `index.html`.

## Scope

**Incluido:** modelo de datos, módulo de consultas, renderizado del catálogo, filtro por título, alternancia de los dos estados previstos, y los cuatro scripts del proyecto.

**Excluido:** `localStorage` (Ejercicio 6), altas de libros y clientes (Ejercicio 4), ventas e historial (Ejercicio 5), renderizado de las otras listas, `fetch` o servidor, administración de editoriales, géneros o autores, README (Ejercicio 6), npm o herramientas de compilación, y cualquier cambio en el CSS o en las otras cuatro vistas.

## Capabilities

### New Capabilities

- `datos-catalogo`: el modelo de datos local del proyecto y la capa que dibuja el catálogo a partir de él, con el filtro por título y los estados de resultado.

### Modified Capabilities

- Ninguna. `libreria-frontend` y `presentacion-css` no cambian de comportamiento: este change solo agrega comportamiento de datos y renderizado sobre el HTML y el CSS ya verificados.

## Impact

- `openspec/specs/datos-catalogo/spec.md` — capability nueva con los requisitos del Ejercicio 3.
- `js/datos-iniciales.js` — la semilla, trasladada desde la raíz del proyecto.
- `js/datos.js`, `js/catalogo.js`, `js/inicio.js` — nuevos.
- `index.html` — se le agregan cuatro `<script>` al final del `<body>`.
- Sin cambios en `css/estilos.css`, en las otras cuatro vistas ni en las specs de otras capabilities.

## Acceptance criteria

1. El conjunto inicial cumple los mínimos de la consigna (6 libros, 2 editoriales, 2 géneros, 3 autores, 3 clientes ficticios) y todas sus relaciones apuntan a registros existentes.
2. Al abrir `index.html` con `file://` el catálogo se dibuja desde el conjunto local: nueve filas con título, ISBN, editorial, género, autores y precio.
3. El libro sin género muestra «Sin clasificar».
4. El filtro responde igual a `cien`, `CIEN` y `  años  `; con la consulta vacía vuelve el catálogo completo; con `zzz` no quedan filas y aparece el mensaje.
5. Los datos se insertan como texto: no hay `innerHTML` con datos ni atributos `on*`.
6. No hay `fetch`, `localStorage`, recursos externos ni dependencias: el proyecto sigue funcionando con `file://`.
7. Las otras cuatro vistas y la hoja de estilos no cambian.

## Risks

| Riesgo | Mitigación |
|---|---|
| Los módulos ES no funcionan con `file://` (CORS bloquea el origen `null`) | Los scripts son clásicos, con una variable global por responsabilidad; verificado en Edge headless |
| Interpretar datos como HTML abriría la puerta a inyección | El SPEC lo prohíbe y la verificación busca `innerHTML` en el código |
| Mezclar el estado vivo con la semilla | La aplicación trabaja sobre una copia; la semilla no se muta |
| El filtro deja filas residuales entre búsquedas | Cada renderizado vacía el `<tbody>` antes de escribir; un escenario lo cubre |
| El orden de los `<script>` importa | Está fijado en el SPEC y se comprueba por búsqueda |
| La búsqueda de la consigna exige el caso `2 × 1500 + 1 × 2000 = 5000` | El modelo de renglón ya lo reproduce; la implementación de ventas es del Ejercicio 5 |
