# Design

## Context

El proyecto arranca sin producto: solo existen el scaffolding de OpenSpec, las consignas (`prompts/`, `docs/Consigna Primer Parcial.pdf`) y las especificaciones de trabajo en `docs/01-estructura-html/`. La consigna exige HTML, CSS y JavaScript nativos, apertura directa de `index.html` sin servidor, y prohíbe librerías, frameworks, CDNs, npm y herramientas de compilación.

Restricciones que moldean el diseño:

- Sin servidor no hay *includes*: el encabezado y la navegación deben repetirse en cada archivo.
- Sin CSS ni JavaScript en esta etapa, la separación entre vistas no puede resolverse con mostrar/ocultar secciones.
- Los ejercicios 2 a 6 van a consumir esta estructura, así que los tipos de control y los `id` deben quedar alineados con lo que la consigna exige más adelante (por ejemplo, editorial y género como selectores, autores con selección múltiple, errores junto al formulario).

## Goals / Non-Goals

**Goals:**

- Que las cinco vistas existan, se alcancen desde `index.html` y contengan exactamente los elementos que pide la consigna.
- Que el marcado sea semántico y accesible de forma verificable: un `header`, un `nav`, un `main`, un `h1` por página, una etiqueta por campo, botones con texto, tablas con `caption` y `th`.
- Que existan los contenedores de estado (lista vacía, sin resultados, éxito, rechazo) y el contrato de `id` que usarán los ejercicios siguientes.
- Que el HTML funcione abierto por `file://`, sin dependencias.

**Non-Goals:**

- Estilos, adaptación y accesibilidad visual (Ejercicio 2).
- Datos locales, renderizado, filtros y eventos (Ejercicio 3).
- Validaciones y altas (Ejercicio 4).
- Lógica de ventas (Ejercicio 5).
- Persistencia, README y casos manuales (Ejercicio 6).

## Decisions

**D-01 · Navegación multi-página (cinco archivos), y no una sola página con secciones.**
Alternativa considerada: una única página con cinco `section`. Se descartó porque, sin CSS ni JavaScript, las cinco secciones se apilan verticalmente y dejan de ser cinco pantallas; separarlas requeriría adelantar trabajo de los Ejercicios 2 y 3. Costo aceptado: el `header` y el `nav` se repiten en los cinco archivos, porque sin servidor no existen *includes*.

**D-02 · El Catálogo es una tabla, no tarjetas.**
Alternativa considerada: tarjetas por libro. Se descartó para mantener coherencia con los demás listados y para cumplir el requisito de tablas con encabezados. Las «tarjetas» como elemento de identidad visual se aplicarán sobre secciones y bloques en el Ejercicio 2, sin cambiar esta estructura.

**D-03 · Los estados se controlan con el atributo `hidden`.**
Alternativa considerada: clases de visibilidad. Se descartó en esta etapa porque no hay CSS; `hidden` es HTML nativo y deja un contrato explícito para el Ejercicio 3.

**D-04 · Un contenedor de error por formulario y un mensaje de éxito global.**
La consigna del Ejercicio 4 exige mostrar los errores cerca del formulario; un único mensaje global obligaría a reestructurar después. El éxito es transversal a las vistas, así que va al inicio del `main`.

**D-05 · Tipos de control de Libros alineados con el Ejercicio 4.**
Editorial como `select`, género como `select` con la opción estática «Sin clasificar» y autores como `select multiple`. El Ejercicio 1 exige que la estructura contemple los campos que usa JavaScript; definir hoy controles de texto obligaría a reescribir el formulario en el Ejercicio 4.

**D-06 · El detalle de la venta es una `section` oculta, no un `dialog`.**
`dialog` necesita JavaScript para abrirse y esta entrega no incluye comportamiento; una `section` con `hidden` es verificable de forma estática.

**D-07 · Cliente con nombre completo y email.**
La consigna (p. 3, Ejercicio 4) pide nombre completo y email y aclara que no se requiere apellido separado. El `id` y las columnas se definieron con esa forma.

**D-08 · Nombres en kebab-case español, con prefijo de vista o entidad.**
Facilita que el Ejercicio 2 estilice por clase y que el Ejercicio 3 encuentre los contenedores por `id`, sin colisiones entre vistas.

## Risks / Trade-offs

- **Duplicación del encabezado y la navegación en cinco archivos**: cualquier cambio de navegación exige tocar los cinco. Mitigación: el `nav` se escribió idéntico salvo `aria-current`, y la verificación compara los cinco.
- **Contrato de `id` rígido**: los ejercicios siguientes deben respetarlo o actualizar la especificación. Mitigación: el contrato quedó documentado y verificado uno a uno.
- **Formularios sin validación**: puede confundirse con un olvido. Mitigación: se declaró explícitamente que las validaciones son del Ejercicio 4 y se evitó agregar atributos como `required`.
- **Selectores vacíos** (editorial, autores): se ven como controles vacíos hasta el Ejercicio 3. Es intencional: no se inventan datos.
