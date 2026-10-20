# Proposal

## Why

El Ejercicio 1 (20 puntos) dejó las cinco vistas del frontend de la librería construidas y verificadas, pero sin una sola regla de estilo: hoy la interfaz se ve con los estilos por defecto del navegador, no tiene identidad visual, los formularios y las tablas se desbordan a 320 px, el foco depende del navegador y no hay jerarquía visual que distinga tarjetas, formularios y acciones.

El Ejercicio 2 (20 puntos) evalúa exactamente eso —coherencia y organización (8), adaptación (8) y accesibilidad básica (4)— y hoy no hay nada que evaluar. Sin esta entrega, los ejercicios 3 a 6 se aplican sobre una interfaz sin identidad y la nota de presentación no existe.

## What Changes

- Se crea la hoja de estilos externa `css/estilos.css` con la identidad visual de la paleta C «Minimal natural» (fondo `#FAFAF8`, superficie `#FFFFFF`, texto `#22262A`, primario verde `#2F5D50`, acento `#C2A25A` solo decorativo), declarada como variables CSS en `:root`.
- Se enlaza esa hoja desde el `<head>` de las cinco vistas con `<link rel="stylesheet" href="css/estilos.css">` y ruta relativa.
- Se agregan a los cinco HTML las clases reutilizables de la taxonomía acordada (`.contenedor`, `.cabecera`, `.navegacion`, `.contenido`, `.tarjeta`, `.formulario`, `.campo`, `.boton`/`.boton--primario`/`.boton--secundario`, `.tabla`, `.tabla-desplazable`, `.mensaje`/`.mensaje--error`/`.mensaje--exito`, `.estado-vacio`) y los envoltorios `<div class="tabla-desplazable">` alrededor de las seis tablas.
- Se organiza el layout con **Flexbox** (cabecera y navegación) y **Grid** (contenido principal y conjuntos de campos), con base mobile-first de 320 px y mejoras progresivas por `min-width` hasta 1280 px.
- Se hace que las tablas anchas se desplacen **dentro de su propio contenedor**, de modo que la página nunca tenga desplazamiento horizontal.
- Se define el foco visible con `:focus-visible` (contorno de 3 px, desplazamiento de 2 px) y se garantiza que ningún control lo elimine, junto con el refuerzo no cromático de los estados (subrayado en la navegación).
- Se distinguen los mensajes de error y de éxito por texto, borde marcado y peso tipográfico además del color, sin modificar el texto ya escrito en el HTML.
- Se incorpora `logo.png` (imagen local ya aportada) como imagen **decorativa** con `alt=""` en la marca de la cabecera de las cinco vistas, sobre la superficie blanca para que su fondo opaco no se perciba como un parche.
- Se respetan las restricciones de la consigna: CSS externo, sin estilos en línea, sin frameworks, sin CDNs, sin fuentes externas, sin `@import` remoto, sin npm ni preprocesadores, y funcionamiento directo por `file://` sin servidor.
- **No** se incluye JavaScript, datos, validaciones, persistencia, modo oscuro ni estilos de impresión: pertenecen a los ejercicios 3 a 6 o no fueron pedidos.

## Capabilities

### New Capabilities

- `presentacion-css`: identidad visual, tokens de diseño, taxonomía de clases reutilizadas, layout con Flexbox y Grid, adaptación del ancho de pantalla entre 320 y 1280 px, tablas con desplazamiento propio, foco visible y navegable por teclado, mensajes de estado distinguibles sin depender del color, tratamiento de la imagen decorativa y operación sin servidor ni recursos externos.

### Modified Capabilities

- `libreria-frontend`: se aclara el requirement «Separación entre estructura, estilos y comportamiento» para admitir el enlace local a la hoja de estilos del proyecto. No cambia ningún otro comportamiento: la estructura de las vistas, los identificadores, los textos visibles y el contrato de estados quedan intactos.

## Alcance

| Incluido | Detalle |
|---|---|
| Hoja de estilos | `css/estilos.css` (un solo archivo, secciones comentadas) con tokens, base, layout, componentes, adaptación y movimiento reducido |
| Enlace | `<link rel="stylesheet" href="css/estilos.css">` en el `<head>` de los cinco HTML |
| Clases | Aplicación de la taxonomía de clases acordada en los cinco HTML, sin cambiar la estructura de vistas ni los textos visibles |
| Envoltorios | `<div class="tabla-desplazable">` alrededor de las seis tablas |
| Imagen | `logo.png` decorativo (`alt=""`) dentro de `.marca-libreria` en las cinco cabeceras |
| Adaptación | Base a 320 px y mejoras por `min-width` (640 px, 1024 px) hasta 1280 px, sin desplazamiento horizontal de página |
| Accesibilidad | Foco visible, contraste AA en todos los pares de texto, mensajes distinguibles por texto/borde/peso, `prefers-reduced-motion` |

## Fuera de alcance

| Excluido | Motivo |
|---|---|
| JavaScript, datos, filtros, altas, ventas, `localStorage` | Ejercicios 3 a 6 |
| Cambios en la estructura de vistas (secciones, orden, campos, `id`, textos visibles) | Fuera de alcance según la SPEC v2 §3.2; solo clases y envoltorios justificados |
| Frameworks CSS, CDNs, fuentes externas, `@import` remoto, npm, bundlers, preprocesadores | Prohibido por la consigna |
| Modo oscuro (`prefers-color-scheme`) y estilos de impresión | No pedidos; quedan como propuesta documentada |
| Animaciones complejas | No pedidas; solo transiciones cortas de color/foco |
| Imágenes distintas de `logo.png` | D-02 resuelto: una sola imagen decorativa local ya aportada |
| `README.md` y registro de casos manuales | Ejercicio 6 |
| Procedencia y licencia de `logo.png` | Pendiente PD-05; no bloquea la implementación, bloquea el README del Ejercicio 6 |
| Modificaciones en `docs/01-*`, `.opencode/`, `.agents/` | Fuera de alcance |

## Criterios de aceptación

| ID | Criterio | Evidencia prevista |
|---|---|---|
| CA-01 | Las cinco vistas comparten identidad visual y reutilizan las mismas clases y tokens. | Capturas de las 5 vistas a 1280 px y 320 px + revisión de clases |
| CA-02 | El CSS es externo; no hay estilos en línea; el layout usa Flexbox y Grid. | Inspección: 0 `<style>`/`style=`; `display:flex` y `display:grid` presentes en `css/estilos.css` |
| CA-03 | Errores y éxitos se distinguen por texto, borde y peso, no solo por color. | Texto presente en el HTML + reglas de borde, fondo y peso en el CSS |
| CA-04 | A 320 px y 1280 px no hay desplazamiento horizontal de la página; las tablas anchas se desplazan dentro de su contenedor. | Medición headless con el arnés temporal: `document.documentElement.scrollWidth <= window.innerWidth` en las 5 vistas a ambos anchos |
| CA-05 | Foco visible en todos los controles y recorrido lógico por teclado. | Prueba manual de teclado en Edge 155 — la confirma el usuario |
| CA-06 | Funcionamiento por `file://` sin servidor ni recursos externos. | Apertura directa + 0 coincidencias de `http://`, `https://`, `@import` remoto |
| CA-07 | Alcance completo y sin trabajo excluido. | Contraste de la tabla de inventario contra la SPEC v2 §3.2 |
| CA-08 | Convenciones respetadas: clases en español, sin selectores por `id`, sin `!important` sin justificación, UTF-8 sin BOM. | Búsqueda de patrones en el CSS y en los HTML |
| CA-09 | Comprobaciones ejecutadas con evidencia y con estado real (aprobado / fallido / omitido / pendiente). | Tabla de comprobaciones en el PLAN y en el resumen de implementación |
| CA-10 | La única imagen del producto es local y decorativa, con `alt=""` y su procedencia registrada como pendiente. | Inspección de las cinco cabeceras + registro de PD-05 |

## Impact

- **Archivos nuevos**: `css/estilos.css` (único archivo de producto nuevo).
- **Archivos modificados**: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` — solo `<link>` en el `<head>`, atributos `class`, envoltorios `.tabla-desplazable` y el `<img>` decorativo en la marca. No se cambian `id`, etiquetas visibles, orden de campos ni textos de contenido.
- **Archivos de planificación**: `docs/02-css-adaptable/PLAN.md` (plan de entrega) y los artefactos de OpenSpec de este change (`proposal.md`, `design.md`, `specs/presentacion-css/spec.md`, `tasks.md`).
- **Sin dependencias**: CSS plano, sin frameworks, sin CDNs, sin fuentes externas, sin npm, sin servidor; rutas relativas para operar por `file://`.
- **Con cambio acotado** en `openspec/specs/libreria-frontend/`: al archivar, un requirement se aclara (admite el `<link>` local a la hoja de estilos). Sin cambios en `docs/01-estructura-html/`, `.opencode/`, `.agents/` ni en la configuración del proyecto.
- **Impacto sobre el Ejercicio 3 en adelante**: las clases agregadas quedan disponibles como ganchos de estilo para los datos locales; los `id` y el contrato de estados quedan intactos, así que ningún ejercicio posterior requiere rework.
