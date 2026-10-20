# SPEC — Change 02: Presentación con CSS y uso adaptable

| Campo | Valor |
|---|---|
| Change | 02 — Presentación con CSS y uso adaptable (Ejercicio 2 · 20 puntos) |
| Fase | SPEC (Fase 1) |
| Versión | v2 |
| Estado | **Implementado, verificado y archivado** el 20/10/2026 (`openspec/changes/archive/2026-10-20-02-css-adaptable/`). T-27 (capturas) y T-32 (recorrido con teclado) **ejecutados y verificados** el 20/10/2026; queda T-33 (revisión visual) |
| Registro | La implementación se desvió del plan en 9 puntos, documentados en la sección «Desvíos de la implementación» de `design.md` y anotados en cada tarea afectada. |
| Fecha | 19/10/2026 |
| Proyecto | Parcial 1 de Programación III — frontend de una librería (UTN) |
| Depende de | Change 01 (estructura HTML) — implementado y verificado |
| Ruta del documento | `docs/02-css-adaptable/SPEC.md` (propuesta a confirmar) |
| Entrega prevista | `css/estilos.css` + enlaces en los 5 HTML + ajustes mínimos de clases/contenedores + `logo.png` decorativo en la marca de la cabecera |
| Fuentes | `prompts/PROMPT-02-css-adaptable.md` (10.350 bytes) + `docs/Consigna Primer Parcial.pdf` p. 2 (Ej. 2) y p. 6 (criterios) |

---

## 1. Problema, objetivo y resultado esperado

**Problema.** La interfaz funciona pero se ve con los estilos por defecto del navegador: no tiene identidad visual, los formularios y tablas se desbordan a 320 px, el foco depende del navegador y no hay una jerarquía visual que distinga tarjetas, formularios y acciones. El Ejercicio 2 evalúa precisamente eso (20 puntos: coherencia y organización 8, adaptación 8, accesibilidad básica 4) y hoy no hay nada que evaluar.

**Objetivo de esta entrega.** Aplicar una identidad visual propia y coherente a las cinco vistas, con CSS en archivos externos y clases reutilizables, layout con Flexbox y Grid, comportamiento correcto de 320 px a 1280 px, tablas que se desplazan dentro de su propio contenedor, foco visible, recorrido por teclado y mensajes de error que no dependan solo del color.

**Resultado esperado.** Al abrir `index.html` sin servidor:

1. las cinco vistas comparten colores, tipografía, espaciado, tarjetas, formularios y botones;
2. no hay desplazamiento horizontal de la página a 320 px ni a 1280 px; las tablas anchas se desplazan dentro de su contenedor;
3. todos los controles tienen foco visible y se recorren con el teclado;
4. los estados de error y de éxito se distinguen por texto además de por color;
5. no hay estilos en línea ni recursos externos.

**Fuera del resultado:** cualquier cambio de estructura de vistas, JavaScript, datos, validaciones o persistencia.

---

## 2. Contexto verificado y fuentes

### 2.1 Estado actual (verificado en esta sesión)

| Dato | Valor | Cómo se verificó |
|---|---|---|
| HTML del Change 01 | **Existen** `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` en la raíz | Listado de archivos |
| Hojas de estilo | **No existe** `css/` ni ningún `.css` | Listado de archivos |
| `<link>`, `<style>`, `style=` en los HTML | **0 coincidencias** | Búsqueda de patrones |
| Tablas | **6** (Catálogo, Libros, Clientes, Ventas, Historial, detalle de Historial) | Búsqueda de `<table` |
| Envoltorios de tabla | **0** (`tabla-desplazable` no existe) | Búsqueda de patrón |
| Clases existentes | **Una sola**: `marca-libreria` | Extracción de `class="..."` |
| Imágenes | **`logo.png`** (397×402 px, PNG RGBA, 117.612 bytes, 0 % de píxeles transparentes) aportada por el usuario el 19/10/2026; antes del Change 02 no había ninguna | Listado de archivos + cabecera PNG + muestreo de píxeles |
| JavaScript | **Ninguno** | Listado + búsqueda |
| Fuentes de requisitos | `prompts/PROMPT-02-css-adaptable.md` y PDF p. 2 / p. 6 | Archivos leídos |
| Reorganización detectada | Los prompts se movieron a `prompts/` (antes en la raíz) | Listado de archivos |

**Conclusión:** los HTML existen y están verificados, pero **no tienen ningún gancho de estilo salvo `marca-libreria`**. Todo el trabajo de presentación está por hacerse y exige agregar clases y contenedores mínimos, además del `<link>` a la hoja de estilos.

### 2.2 Entorno verificado

| Dato | Valor |
|---|---|
| Microsoft Edge | **155.0.4283.62** (verificado; se usó headless en Change 01) |
| Mozilla Firefox | **158.0** (verificado) |
| Google Chrome | No instalado |
| Servidor / npm | No requeridos (`file://`) |
| Herramientas de medición | Edge headless: `--dump-dom`, `--screenshot`, `--window-size` (probado en Change 01) |
| Control de versiones | Git no inicializado |

### 2.3 Criterios de la consigna que condicionan este change (p. 2 y p. 6)

- Identidad visual propia y coherente: colores, tipografía, espaciado, tarjetas, formularios y botones.
- CSS en archivos externos; clases reutilizadas para elementos equivalentes.
- Flexbox o Grid para organizar el contenido.
- Comprobación a **320 px** y **1280 px**: legibilidad y ausencia de desplazamiento horizontal de toda la página.
- Si una tabla necesita más espacio, se desplaza **dentro de su propio contenedor**.
- Foco visible y recorrido por teclado.
- Errores expresados con texto, no solo con color.
- Imágenes informativas con `alt`; decorativas sin repetir información.
- Puntaje: coherencia y organización 8; adaptación 8; accesibilidad básica 4.

---

## 3. Alcance

### 3.1 Incluido

1. Hoja(s) de estilo externa(s) en `css/`, enlazada(s) desde los cinco HTML.
2. Identidad visual: paleta, tipografía, espaciado, tarjetas, formularios, botones y estados.
3. Variables CSS (custom properties) para colores, espaciado, radios, sombras y tipografía.
4. Layout con **Flexbox** (cabecera y navegación) y **Grid** (contenido y formularios).
5. Clases reutilizables para elementos equivalentes (botones, campos, tarjetas, tablas, mensajes).
6. Envoltorio desplazable para las seis tablas (`.tabla-desplazable`).
7. Reglas de adaptación: base para 320 px y mejoras progresivas por `min-width`.
8. Foco visible con `:focus-visible`; estados hover/active; foco que no se elimina.
9. Estilos de error y éxito con texto + recursos no cromáticos (borde, peso, fondo).
10. Estilos de estados vacíos y de detalle del historial.
11. Preferencia `prefers-reduced-motion` para desactivar transiciones.
12. Ajustes mínimos de HTML: `<link>` en el `<head>`, atributos `class`, contenedores `<div class="tabla-desplazable">` alrededor de las tablas y un `<img class="marca-imagen" src="logo.png" alt="">` dentro de `.marca-libreria`. **No se cambia la estructura de vistas ni el texto visible.**

### 3.2 Excluido

| Exclusión | Motivo |
|---|---|
| JavaScript, datos, filtros, altas, ventas, `localStorage` | Ejercicios 3 a 6 |
| Cambios en la estructura de vistas (secciones, orden, campos, ids, textos) | Fuera de alcance; solo clases y contenedores justificados |
| Librerías, frameworks CSS, CDNs, fuentes externas, `@import` remoto | Prohibido por la consigna |
| npm, bundlers, preprocesadores (Sass, PostCSS) | Prohibido por la consigna |
| README y registro de casos manuales | Ejercicio 6 |
| Modo oscuro (`prefers-color-scheme`) | No pedido; se documenta como propuesta |
| Estilos de impresión | No pedido |
| Animaciones complejas | No pedidas |
| Imágenes distintas de `logo.png` | D-02 resuelto: una sola imagen decorativa local ya aportada; no se incorporan otras |
| Cambios en `openspec/`, `.opencode/`, `.agents/`, `docs/01-*` | Fuera de alcance |

---

## 4. Requisitos, escenarios y casos límite

### 4.1 Requisitos

| ID | Grupo | Requisito | Verificación prevista |
|---|---|---|---|
| R-01 | Funcional | Las cinco vistas presentan identidad visual coherente. | Revisión visual + uso de los mismos tokens/clases |
| R-02 | Estructura | CSS externo; clases reutilizadas; layout con Flexbox o Grid. | Inspección del CSS y búsqueda de `display:flex`/`grid` |
| R-03 | Estados | Error y éxito se distinguen con texto y no solo con color. | HTML (texto presente) + CSS con borde/peso/fondo |
| R-04 | Calidad | 320/1280 legibles, sin scroll horizontal de página; tablas con scroll propio; foco visible; teclado. | Medición headless + capturas + prueba manual |
| R-05 | Compatibilidad | `file://` sin servidor. | Apertura de `index.html` |
| R-06 | Convenciones | Sin estilos en línea; clases comprensibles; `alt` correcto. | Búsqueda de `style=` + revisión de imágenes |

### 4.2 Escenarios observables

| ID | Escenario | Resultado esperado | Cubre |
|---|---|---|---|
| S-01 | Abro las cinco vistas a 1280 px. | Misma identidad; contenido centrado con ancho máximo; tarjetas y formularios consistentes. | R-01 |
| S-02 | Abro las cinco vistas a 320 px. | Textos legibles; controles utilizables; **sin scroll horizontal de la página**. | R-04 |
| S-03 | En 320 px miro una tabla ancha. | La tabla se desplaza dentro de su contenedor; la página no. | R-04 |
| S-04 | Recorro con Tab. | Cada control muestra un foco visible y el orden es lógico. | R-04 |
| S-05 | Fuerzo un mensaje de error visible (inspección). | Se distingue por texto, borde y peso, no solo por color. | R-03 |
| S-06 | Inspecciono el HTML. | No hay `style=""` ni `<style>`; el CSS está enlazado desde `css/`. | R-02, R-06 |
| S-07 | Inspecciono el CSS. | Hay variables y clases reutilizadas; Flexbox y Grid presentes. | R-01, R-02 |
| S-08 | Busco imágenes. | Una sola: `logo.png`, local, decorativa, con `alt=""` y procedencia registrada. | R-06 |
| S-09 | Abro con `file://`. | Todo carga sin servidor ni recursos externos. | R-05 |

### 4.3 Casos límite

| ID | Caso | Regla esperada |
|---|---|---|
| E-01 | Tabla de 6 columnas a 320 px | Scroll solo en `.tabla-desplazable`; `body` sin scroll horizontal |
| E-02 | Títulos, emails o ISBN largos | `overflow-wrap: anywhere` en celdas y textos; nada se sale del contenedor |
| E-03 | Muchas filas | La página crece verticalmente; el ancho no se altera |
| E-04 | Mensaje de error visible | No desplaza el layout de forma brusca; conserva texto y borde |
| E-05 | Mensajes ocultos | `hidden` sigue ocultándolos; no ocupan espacio |
| E-06 | Zoom 200 % | Legible; sin scroll horizontal (se verifica si el navegador lo permite) |
| E-07 | `prefers-reduced-motion: reduce` | Sin transiciones |
| E-08 | Contraste del texto | ≥ 4.5:1 para texto normal; ≥ 3:1 para texto grande |
| E-09 | Foco sobre botón primario y sobre fondo | Outline contrastante respecto del fondo (≥ 3:1) |
| E-10 | Imagen con fondo blanco opaco (`logo.png`) | Se muestra sobre la superficie blanca (`#FFFFFF`), donde su fondo no se percibe como parche sobre `--fondo` (`#FAFAF8`) |

---

## 5. Solución propuesta

### 5.1 Archivos

| Archivo | Acción |
|---|---|
| `css/estilos.css` | **Crear** — tokens, base, layout, componentes, adaptación |
| `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` | **Modificar** — `<link>` + clases + envoltorios de tabla + `<img>` decorativo en la marca |
| `logo.png` | **Usar** (ya existe) — imagen decorativa local; no se modifica ni se recorta |

**Organización del CSS (propuesta):** un solo archivo con secciones comentadas:

```
1. Tokens (:root)
2. Reset y base
3. Layout (contenedor, cabecera, navegación)
4. Tarjetas
5. Formularios
6. Botones
7. Tablas
8. Mensajes y estados
9. Adaptación (@media)
10. Movimiento reducido
```

**Justificación de un solo archivo:** el proyecto tiene cinco páginas y una única identidad; un archivo con secciones claras es más fácil de revisar y de entregar que tres archivos con reglas entrelazadas. *(D-03, no bloqueante.)*

### 5.2 Cambios mínimos en el HTML (justificados)

| Cambio | Dónde | Justificación |
|---|---|---|
| `<link rel="stylesheet" href="css/estilos.css">` | `<head>` de los 5 HTML | Requisito de CSS externo (R-02) |
| `class="cabecera"` | `header` | Punto de estilo del layout superior |
| `class="navegacion"` | `nav` | Flexbox de la navegación |
| `class="contenido"` | `main` | Contenedor y grid del contenido |
| `class="formulario"` | los 4 `form` | Estilos compartidos |
| `class="campo"` | cada `<p>` que envuelve `label` + control (12) | Grid de formularios |
| `class="boton boton--primario"` / `boton--secundario` | 8 botones | Reutilización de botones (R-02) |
| `class="tarjeta"` | 7 `section` + formulario de búsqueda del Catálogo | Identidad de tarjetas |
| `class="tabla"` | 6 `table` | Estilo único de tablas |
| `<div class="tabla-desplazable">` | alrededor de las 6 tablas | Scroll propio (R-04) |
| `class="mensaje mensaje--exito"` / `mensaje--error` | 4 mensajes | Estados no dependientes del color |
| `class="estado-vacio"` | 6 mensajes de lista vacía | Estilo de estado vacío |
| `class="tabla-desplazable tarjeta"` | envoltorio de la tabla del Catálogo | Tarjeta contenedora |

**No se modifican** ids, etiquetas visibles, orden de campos, textos de contenido ni estructura de secciones.

### 5.3 Tokens y paleta

Tokens obligatorios en `:root`:

```css
--color-fondo, --color-superficie, --color-texto, --color-texto-suave,
--color-primario, --color-primario-hover, --color-acento,
--color-borde, --color-error, --color-error-fondo,
--color-exito, --color-exito-fondo, --color-foco

--fuente-base, --fuente-titulos
--texto-xs, --texto-sm, --texto-base, --texto-lg, --texto-xl, --texto-2xl
--espacio-1 … --espacio-6
--radio-sm, --radio-md, --radio-lg
--sombra-suave
```

**D-01 — RESUELTO: paleta C «Minimal natural»** (elegida por el usuario el 19/10/2026). Contrastes calculados de las tres propuestas:

| Rol | A · Librería clásica | B · Editorial moderno | C · Minimal natural |
|---|---|---|---|
| Fondo | `#FBF7F0` | `#F7F8FA` | `#FAFAF8` |
| Superficie | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| Texto | `#221E1B` | `#1B2430` | `#22262A` |
| Texto suave | `#5A514A` | `#55606E` | `#5B625E` |
| Primario | `#6B2230` | `#1F3A5F` | `#2F5D50` |
| Primario hover | `#521A25` | `#16293F` | `#234A3F` |
| Acento | `#A36A1F` | `#C65D3B` | `#C2A25A` |
| Error | `#A32222` | `#A32626` | `#A33A2B` |
| Error fondo | `#FBEAEA` | `#FBE9E9` | `#F7EAE7` |
| Éxito | `#1E6B3A` | `#1F6B45` | `#2C6B4F` |
| Éxito fondo | `#EAF4EE` | `#E9F3ED` | `#E8F2ED` |
| Foco | `#0B57D0` | `#0B57D0` | `#0B57D0` |

**Contrastes calculados (WCAG 2.x):**

| Par | A | B | C |
|---|---|---|---|
| Texto / fondo | 15,49 | 14,73 | 14,58 |
| Texto suave / fondo | 7,25 | 6,02 | 5,99 |
| Primario / fondo | 10,37 | 10,81 | 7,17 |
| Blanco / primario (botón) | 11,07 | 11,48 | 7,49 |
| Error / fondo | 7,00 | 6,90 | 6,28 |
| Error / error-fondo | 6,43 | 6,27 | 5,59 |
| Éxito / fondo | 6,11 | 6,09 | 6,05 |
| Éxito / éxito-fondo | 5,80 | 5,70 | 5,52 |
| Foco / fondo | 5,98 | 6,01 | 6,11 |
| Acento / fondo | 4,24 (solo decorativo) | 3,93 (solo decorativo) | 2,33 (solo decorativo) |

> **Regla:** el color de acento **no se usa para texto** en ninguna paleta; solo para bordes, detalles y decoración. Todos los pares de texto cumplen AA (≥ 4,5:1).

**Tipografía (sin CDN):**

| Rol | Fuente |
|---|---|
| Base | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| Títulos | A: `Georgia, "Times New Roman", serif` · B y C: la misma pila sans |

**D-02 — imágenes:** ver §9.1. Si D-02 = A, no se usa ninguna imagen y el requisito de `alt` queda N/A.

### 5.4 Clases (taxonomía)

| Clase | Uso |
|---|---|
| `.contenedor` | Ancho máximo y padding lateral |
| `.cabecera` | Barra superior (Flexbox) |
| `.marca-libreria` | Marca (ya existente) |
| `.navegacion` | `<nav>`; `ul`/`a` se estilan por descendencia |
| `.contenido` | `<main>` con Grid |
| `.tarjeta` | Superficie con borde, radio, sombra y padding |
| `.formulario` | Agrupación de campos |
| `.campo` | `label` + control en Grid |
| `.boton` | Base común |
| `.boton--primario` | Acción principal |
| `.boton--secundario` | Acción secundaria |
| `.tabla-desplazable` | Contenedor con `overflow-x:auto` |
| `.tabla` | Tabla con `border-collapse`, celdas y encabezados |
| `.mensaje` | Base de mensajes de estado |
| `.mensaje--error` / `.mensaje--exito` | Variantes |
| `.estado-vacio` | Lista vacía |

**Convención:** se estiliza por **clase**; los `id` no se usan como selectores salvo excepción documentada. Nombres en español, kebab-case, sin abreviaturas opacas.

### 5.5 Layout y adaptación

**Base (320 px, mobile-first):**

- `body`: fondo, tipografía, color, `margin: 0`.
- `.contenedor`: `width: min(100% - 2rem, 1100px)`, centrado.
- `.cabecera`: `display:flex`, `flex-wrap:wrap`, `gap`, `justify-content:space-between`, `align-items:center`.
- `.navegacion ul`: `display:flex`, `flex-wrap:wrap`, `gap`.
- `.contenido`: `display:grid`, `gap: 1.5rem`.
- `.formulario fieldset`: `display:grid`, `gap`, una columna.
- `.acciones-formulario`: `display:flex`, `flex-wrap:wrap`, `gap`.
- `.tabla-desplazable`: `overflow-x:auto`.
- `.tabla`: `width:100%`, `min-width: 560px` (detalle: 480 px).
- Textos: `overflow-wrap: anywhere`.

**Mejoras progresivas:**

| Breakpoint | Cambios |
|---|---|
| `min-width: 640px` | `.contenido` con 2 columnas donde corresponda; `fieldset` a 2 columnas; cabecera en fila |
| `min-width: 1024px` | Ancho máximo 1100 px; mayor espaciado; tabla del catálogo sin scroll (si entra) |

**Regla dura:** ninguna regla debe producir `overflow-x` en `html`/`body`. El único scroll horizontal permitido es el de `.tabla-desplazable`.

### 5.6 Foco y teclado

```css
:focus-visible {
  outline: 3px solid var(--color-foco);
  outline-offset: 2px;
}
```

- Prohibido `outline: none` sin reemplazo visible.
- Los botones y enlaces conservan `:hover` y `:active` con cambios de color y, opcionalmente, subrayado; **no** se depende solo del color para indicar estado (se agrega subrayado en enlaces de navegación).
- Orden de tabulación: el del DOM actual (sin `tabindex` positivos).

### 5.7 Mensajes y estados

| Estado | Clase | Tratamiento |
|---|---|---|
| Éxito | `.mensaje--exito` | Fondo verde claro, borde izquierdo verde de 4 px, texto verde oscuro, peso 600 |
| Error | `.mensaje--error` | Fondo rojo claro, borde izquierdo rojo de 4 px, texto rojo oscuro, peso 600 |
| Vacío | `.estado-vacio` | Texto suave, padding, borde punteado |
| Detalle | `.tarjeta` en `#historial-detalle` | Tarjeta con separación del listado |

El texto de los mensajes ya existe en el HTML del Change 01; **no se cambia el contenido**. La distinción no cromática es borde + peso + (si se quiere) prefijo textual ya presente.

### 5.8 Imágenes — D-02 RESUELTO: opción B (decorativa), en formato PNG

| Opción | Estado | Efecto | `alt` |
|---|---|---|---|
| A · Sin imágenes | Descartada | — | — |
| **B · Imagen local decorativa** | **Elegida** | `logo.png` (raíz) dentro de `.marca-libreria`, en la cabecera de las cinco vistas | `alt=""` (decorativa: no repite «Librería ABC») |
| C · Imagen local informativa | Descartada | Reemplazaría la marca textual del Change 01 | `alt="Librería ABC"` |

**Datos verificados de `logo.png`:** 397×402 px, PNG RGBA, 117.612 bytes, **0 % de píxeles transparentes** (las cuatro esquinas son blanco opaco `255,255,255,255`). Es una ilustración de libros apilados, sin texto de marca.

**Consecuencia de diseño (E-10):** el fondo blanco del PNG coincide exactamente con `--superficie` (`#FFFFFF`) de la paleta C. La cabecera se pinta con `--superficie`, de modo que el fondo de la imagen **no se percibe como un parche** sobre `--fondo` (`#FAFAF8`). La imagen no se edita ni se recorta.

**Markup previsto (idéntico en los cinco HTML):**

```html
<p class="marca-libreria">
  <img class="marca-imagen" src="logo.png" alt="" width="397" height="402">
  <span class="marca-nombre">Librería ABC</span>
</p>
```

El texto visible **no cambia**: pasa de texto suelto a `<span class="marca-nombre">` con el mismo contenido. Los atributos `width`/`height` declaran la proporción intrínseca para evitar salto de layout; el CSS la escala a `height: 3rem; width: auto`.

**Accesibilidad:** al ser decorativa y estar junto a la marca textual «Librería ABC», lleva `alt=""` (no duplica información). La procedencia (origen y licencia) queda registrada en §9.4 como **PD-05** y se documentará en el README del Ejercicio 6.

---

## 6. Estados y manejo de errores (CSS)

| Situación | Comportamiento esperado |
|---|---|
| Mensaje oculto (`hidden`) | No ocupa espacio; sigue sin ser focusable |
| Mensaje visible | Se muestra con texto, borde y peso; no desplaza horizontalmente |
| Tabla más ancha que el viewport | Scroll dentro de `.tabla-desplazable`; la página no se mueve |
| Texto largo sin espacios | Se parte dentro de la celda (`overflow-wrap: anywhere`) |
| Foco por teclado | Visible; nunca se elimina |
| Hover/active | Cambio de color + refuerzo no cromático |
| `prefers-reduced-motion` | Sin transiciones |
| Sin CSS (falla la hoja) | El HTML sigue siendo legible y navegable (progressive enhancement) |

---

## 7. Restricciones técnicas

| Restricción | Implicancia |
|---|---|
| CSS externo | `<link rel="stylesheet" href="css/estilos.css">`; sin `<style>` ni `style=""` |
| Sin frameworks/CDNs/fuentes externas | Cero `@import` remoto, cero `@font-face` con URL |
| Sin npm/preprocesadores | CSS plano |
| `file://` | Rutas relativas; sin rutas absolutas |
| UTF-8 | Sin caracteres raros; comentarios en español |
| Mobile-first | Base 320 px; `min-width` para crecer |
| Variables | Tokens en `:root`; sin valores mágicos repetidos |
| Clases reutilizables | Elementos equivalentes comparten clases |
| Sin `!important` salvo justificación documentada | Evitar deuda |
| Sin selectores por `id` para estilos | Excepción: ninguna prevista |
| Compatibilidad | Edge 155, Firefox 158 (ambos verificados) |

---

## 8. Criterios de aceptación y método de verificación

| CA | Criterio | Requisito | Evidencia prevista |
|---|---|---|---|
| CA-01 | Las cinco vistas comparten identidad y reutilizan clases. | R-01, R-02 | Capturas de las 5 vistas a 1280 y 320 + revisión de clases |
| CA-02 | CSS externo; layout con Flexbox o Grid. | R-02, R-06 | Inspección: 0 `<style>`/`style=`; `display:flex` y `display:grid` presentes |
| CA-03 | Errores con texto, no solo color. | R-03 | HTML con texto + CSS con borde/peso/fondo |
| CA-04 | 320/1280 sin scroll horizontal; tablas con scroll propio; foco visible; teclado. | R-04 | Medición automatizada + capturas + prueba manual |
| CA-05 | Alcance completo, sin trabajo excluido. | §3 | Diff de archivos contra §3.2 |
| CA-06 | Tecnologías y convenciones. | R-05, R-06 | Búsqueda de patrones + apertura `file://` |
| CA-07 | Comprobaciones ejecutadas con evidencia. | §7 | Tabla de resultados |
| CA-08 | Estados aprobado/fallido/omitido/pendiente diferenciados. | §7 | Tabla con estado real |
| CA-09 | Supuestos, placeholders y limitaciones identificados. | §9 | Este documento + resumen |

**Método de medición de overflow (propuesto):**

1. Capturas headless a `320×800` y `1280×800` de las cinco vistas (evidencia visual).
2. Arnés temporal **fuera del proyecto** (copia de la página en `%TEMP%` con un `<script>` de medición inyectado, que no forma parte de la entrega): reporta `document.documentElement.scrollWidth`, `window.innerWidth`, y para cada `.tabla-desplazable` `scrollWidth`/`clientWidth` y `overflow-x`.
3. Prueba manual de teclado en Edge 155 (foco visible y orden): **la confirma el usuario**; se registra como pendiente si no se ejecuta.
4. Zoom 200 %: manual, opcional (E-06).

> El arnés temporal no viola la exclusión de JavaScript: no se entrega ni se enlaza desde el producto; solo mide en una copia descartable.

---

## 9. Decisiones, supuestos y pendientes

### 9.1 Decisiones que requieren tu respuesta

| ID | Decisión | Bloqueante | Opciones | Recomendación |
|---|---|---|---|---|
| **D-01** | **Paleta y estilo visual** | **Resuelto 19/10/2026** | **A** Librería clásica · **B** Editorial moderno · **C** Minimal natural | **→ C «Minimal natural»** |
| **D-02** | **¿Se usan imágenes?** | **Resuelto 19/10/2026** | **A** sin imágenes · **B** imagen local decorativa (`alt=""`) · **C** imagen local informativa (`alt="Librería ABC"`) | **→ B, con `logo.png` (PNG, no SVG)** |
| D-03 | Organización del CSS | No | 1 archivo `css/estilos.css` / 3 archivos por capa | 1 archivo |
| D-04 | Ruta del SPEC | No | `docs/02-css-adaptable/SPEC.md` (actual) / otra | La actual |
| D-05 | Navegador de referencia | No | Edge 155 (verificado) / Firefox 158 | Edge 155 |
| D-06 | Herramientas | No | Editor + Edge headless (medición/capturas) + prueba manual | Las disponibles |

**Sobre D-01:** las tres paletas cumplen contraste AA en todos los pares de texto; la diferencia es de carácter. **A** (papel cálido, borgoña, títulos serif) es la que mejor representa una librería y la que más se distingue de una interfaz genérica. **B** es más corporativa y neutra. **C** es la más sobria y la de menor contraste de acento.

**Resolución (19/10/2026):** el usuario eligió **C «Minimal natural»**. Consecuencias para la implementación: primario verde profundo `#2F5D50` (hover `#234A3F`), fondo `#FAFAF8`, superficies `#FFFFFF`, texto `#22262A`, texto suave `#5B625E`, error `#A33A2B` sobre `#F7EAE7`, éxito `#2C6B4F` sobre `#E8F2ED`, foco `#0B57D0`; tipografía **sans del sistema en todo el sitio** (C no usa serif) y acento `#C2A25A` **exclusivamente decorativo** (contraste 2,33:1, nunca para texto).

**Sobre D-02:** **A** mantiene el alcance estricto y evita el trabajo de procedencia de imágenes; el requisito de `alt` queda N/A y así se documenta. **B** permite mostrar el manejo de imágenes decorativas sin duplicar información, con arte propio. **C** demuestra `alt` informativo, pero reemplaza la marca textual del Change 01 (cambio de contenido que habría que justificar).

**Resolución (19/10/2026):** el usuario eligió **B** y aportó el archivo `logo.png` (397×402, fondo blanco opaco). Se usa como imagen decorativa con `alt=""` en la marca de la cabecera. Queda pendiente registrar la procedencia del archivo (PD-05).

### 9.2 Propuestas (no bloqueantes)

| ID | Propuesta | Estado |
|---|---|---|
| P-01 | «Tarjetas» se aplican a las secciones y bloques, no a las filas del catálogo (que sigue siendo tabla) | Propuesta; evita cambiar la estructura del Change 01 |
| P-02 | Envolver las 6 tablas en `.tabla-desplazable` | Necesario para R-04 |
| P-03 | Un solo archivo CSS con secciones | D-03 |
| P-04 | Sin modo oscuro ni estilos de impresión | Fuera de alcance |
| P-05 | Subrayado permanente en enlaces de navegación | Refuerzo no cromático |
| P-06 | Transiciones de 120 ms solo en color/foco, desactivadas con `prefers-reduced-motion` | Detalle de calidad |

### 9.3 Supuestos

| ID | Supuesto | Impacto si es falso |
|---|---|---|
| A-01 | La estructura HTML del Change 01 se mantiene. | Cambiaría el alcance y el PLAN |
| A-02 | La tipografía se resuelve con pilas del sistema (sin CDN). | Si se exigiera una fuente, habría que alojarla localmente |
| A-03 | Solo existe `logo.png` (decorativa); no se incorporan más imágenes. | Habría que revisar R-06 y la procedencia |
| A-04 | El contenido textual no cambia. | Cambiaría el HTML más allá de clases |
| A-05 | Se estiliza por clase, no por `id`. | Sin impacto funcional |
| A-06 | El ancho de referencia del contenedor es 1100 px. | Ajustable sin impacto |
| A-07 | No se requiere soporte de navegadores antiguos. | Cambiaría el uso de `:focus-visible`, `clamp()` y custom properties |

### 9.4 Información pendiente

| ID | Dato | Efecto | Placeholder |
|---|---|---|---|
| PD-01 | Paleta elegida | **Resuelto: C «Minimal natural»** | — |
| PD-02 | Uso de imágenes | **Resuelto: B, `logo.png` decorativa con `alt=""`** | — |
| PD-03 | Herramientas autorizadas por el docente | No bloquea: se usan editor + navegador | `{{DATO_PENDIENTE: herramientas autorizadas}}` |
| PD-04 | Control de versiones | El proyecto es un repositorio Git; los commits los decide la persona usuaria | `{{DATO_PENDIENTE: control de versiones}}` |
| PD-05 | Procedencia de `logo.png` (origen y licencia) | No bloquea la implementación; bloquea el README del Ejercicio 6 | `{{DATO_PENDIENTE: procedencia de logo.png}}` |

---

## 10. Trazabilidad

| Requisito | Elementos |
|---|---|
| R-01 | Tokens + `.tarjeta` + `.boton` + `.campo` + `.tabla` en las 5 vistas |
| R-02 | `<link>` externo + clases reutilizadas + `display:flex` (cabecera/nav) + `display:grid` (contenido/formularios) |
| R-03 | Texto ya presente + `.mensaje--error` con borde, peso y fondo |
| R-04 | `.contenedor`, `.tabla-desplazable`, `.tabla`, `:focus-visible`, media queries |
| R-05 | Rutas relativas + ausencia de dependencias |
| R-06 | Sin `style=`/`<style>`; clases en español; `logo.png` con `alt=""` (decorativa) |

---

## 11. Lo que este SPEC no decide

- ~~La paleta (D-01) y el uso de imágenes (D-02)~~ — **resueltos el 19/10/2026**: paleta **C «Minimal natural»** y una única imagen decorativa `logo.png` con `alt=""` en la marca de la cabecera.
- El contenido de los mensajes: no se modifica.
- Cualquier cambio de estructura más allá de clases y envoltorios de tabla.
- JavaScript, datos, validaciones, persistencia o README.
