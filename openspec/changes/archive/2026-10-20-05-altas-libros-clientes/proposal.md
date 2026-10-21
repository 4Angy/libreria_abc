# Proposal — Change 05: Alta de libros y clientes

## Why

Las vistas donde se registran libros y clientes no tienen **una sola línea de JavaScript**: los formularios existen en el marcado desde el Change 01, pero se envían por `GET`, la página se recarga con los valores en la URL y el registro se pierde; los selectores de editorial, género y autores están vacíos y los dos `<select>` de `ventas.html` no tienen ni una opción. El Ejercicio 4 del parcial introduce la entrada de datos con validaciones y vale 15 de los 100 puntos (criterio «4. Altas»: libros y selectores 6, clientes 4, validación y actualización 5).

## What Changes

- El formulario de libros valida **seis** reglas —título e ISBN no vacíos, ISBN no duplicado, precio numérico y mayor que cero, editorial existente, al menos un autor y género existente si se asigna— y solo agrega el registro si todas pasan.
- El formulario de clientes valida **cuatro** reglas —nombre y email no vacíos, formato de email válido y email no repetido sin distinguir mayúsculas— y solo agrega el registro si todas pasan.
- El ISBN se compara **sin espacios ni guiones**; el email, **sin espacios exteriores y sin distinguir mayúsculas**, tal como pide la consigna (p. 3).
- Los selectores de editorial, género y autores se generan desde los datos locales; el de género conserva la opción «Sin clasificar», que representa la ausencia de género.
- Tras un alta correcta, el listado correspondiente **se actualiza sin recargar la página** y las listas de opciones quedan al día.
- Los selectores de cliente y de libro de la vista Ventas se pueblan desde el mismo estado local, de modo que la selección de venta consuma exactamente los mismos registros que el catálogo.
- El envío se controla con `preventDefault` y los datos ingresados se insertan en el DOM **como texto**.
- La validación nativa del navegador se desactiva en los dos formularios, para que los mensajes de error sean los de la aplicación, en español y junto al formulario.

## Scope

**Incluido:** validación y alta de libros, validación y alta de clientes, generación de las opciones desde los datos locales, refresco de los listados sin recarga, poblado de los selectores de la vista Ventas, y las consultas y mutaciones del modelo que todo eso necesita.

**Excluido:** `localStorage` y cualquier otra persistencia (Ejercicio 6), el cruce de datos entre páginas, ventas e historial (Ejercicio 5), edición y eliminación de registros, altas de editoriales, géneros o autores, el dígito de control del ISBN, `fetch` o servidor, npm o herramientas de compilación, y cualquier cambio en `css/estilos.css`.

## Capabilities

### New Capabilities

- `altas-libros-clientes`: el registro de libros y clientes con sus validaciones, la generación de las opciones desde los datos locales y la actualización de los listados sin recargar la página.

### Modified Capabilities

- `libreria-frontend`: tres requisitos cambian de comportamiento.
  - **Separación entre estructura, estilos y comportamiento** — el marcado ya no puede prohibir las etiquetas `<script>`: `index.html` enlaza cuatro scripts desde el Change 03 y este change enlaza los suyos en `libros.html`, `clientes.html` y `ventas.html`. La prohibición se acota a los estilos en línea, los bloques de estilo y los manejadores en atributos, y se exige que todo script referenciado sea local.
  - **Contenedores de datos locales** — los selectores de editorial, género y autores pasarán a contener opciones generadas en ejecución a partir del conjunto local. El requisito pasa a exigir que el *marcado* no traiga opciones de datos y que las que aparecen en pantalla provengan del modelo.
  - **Validaciones diferidas** — se precisa que los formularios desactivan la validación de restricciones del navegador, de modo que la única validación activa sea la de la aplicación.

## Impact

- `openspec/specs/altas-libros-clientes/spec.md` — capability nueva con los requisitos del Ejercicio 4.
- `openspec/specs/libreria-frontend/spec.md` — delta con los tres requisitos modificados.
- `js/validaciones.js` — nuevo: las reglas puras, sin DOM.
- `js/altas.js` — nuevo: la capa DOM de las vistas de alta.
- `js/datos.js` — modificado: consultas que faltan, comprobaciones de existencia, mutaciones y generación de identificadores.
- `js/inicio.js` — modificado: detecta la vista abierta y conecta solo lo que existe.
- `libros.html`, `clientes.html`, `ventas.html` — modificados: `novalidate`, el campo de precio como texto, la nota de uso de autores y las etiquetas `<script>`.
- `js/catalogo.js`, `index.html`, `historial.html` y `css/estilos.css` — **sin cambios**.
- `docs/05-altas-libros-clientes/SPEC.md` y `PLAN.md` — la especificación y el plan aprobados que dan origen a este change.

## Acceptance criteria

1. Un libro válido aparece en el listado de libros registrados y un cliente válido en el de clientes registrados, y en ninguno de los dos casos se recarga la página.
2. Los selectores de editorial, género y autores muestran las opciones del conjunto local, y el de género incluye «Sin clasificar».
3. Cada una de las diez reglas de validación rechaza su caso con un mensaje de texto junto al formulario, y el registro no se agrega.
4. El ISBN se rechaza como duplicado aunque se escriba con guiones y espacios; el email se rechaza como duplicado aunque se escriba en mayúsculas.
5. Un precio escrito como `1.500` se rechaza por formato, y no se convierte en 1.5.
6. Los selectores de la vista Ventas se pueblan con los clientes y los libros del conjunto local.
7. Los datos ingresados se insertan como texto: un nombre con `<b>` se muestra literal.
8. No hay `fetch`, `localStorage`, `sessionStorage`, recursos externos ni dependencias: el proyecto sigue funcionando con `file://`.

## Risks

| Riesgo | Mitigación |
|---|---|
| Con la validación nativa activa, un email mal formado nunca dispara el `submit` y el mensaje de error propio no llegaría a verse | Verificado en Chromium 152: `typeMismatch` cancela el envío. Los formularios llevan `novalidate` |
| Con `type="number"` y el `step` por defecto, un precio con centavos se marca como inválido y bloquea el envío | El campo pasa a `type="text"` con `inputmode="decimal"`, y el formato lo valida la aplicación |
| Una interpretación permisiva del precio registraría en silencio un libro de $1500 como $1.50 | El formato admitido es `^\d+(?:[.,]\d+)?$`; `1.500` se rechaza con un mensaje que declara el formato esperado |
| El estado vive en el documento: un alta de `libros.html` no aparece en `index.html` | Aceptado y declarado: sin persistencia no hay canal entre páginas. El Ejercicio 6 cambia la fuente del estado y el cruce aparece sin tocar las vistas |
| Agregar `<script>` a tres vistas contradice la spec viva `libreria-frontend` | El delta de este change corrige el requisito, que quedó desactualizado en el Change 03 |
| El selector múltiple de autores no es obvio para quien no lo conoce | Se conserva el control que ya traía el Change 01 y se le agrega una nota de uso visible |
