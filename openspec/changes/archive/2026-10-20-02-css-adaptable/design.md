# Design

## Context

El estado actual está verificado: existen los cinco HTML del Change 01 en la raíz (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`), y **no existe ningún archivo `.css`**, ningún `<link>`, ningún `<style>` ni ningún atributo `style=` en ellos. La única clase presente en el marcado es `marca-libreria` (en la marca de la cabecera de las cinco vistas). Hay **6 tablas**, **0 envoltorios** de tabla y **12 controles etiquetados** que reciben etiquetas (`label for`).

Restricciones que moldean el diseño (consigna del parcial + SPEC v2 §7):

- La consigna prohíbe frameworks CSS, CDNs, fuentes externas, `@import` remoto, npm y preprocesadores. El CSS tiene que ser plano y local.
- El sitio se abre por `file://` sin servidor: no hay *includes*, no hay preprocessing y todas las rutas son relativas.
- No hay JavaScript en el producto: el comportamiento de la interfaz (foco, hover, scroll) tiene que resolverlo el CSS.
- Mobile-first: la consigna evalúa legibilidad y ausencia de desplazamiento horizontal a **320 px** y a **1280 px**.
- El navegador de referencia es **Edge 155** (verificado, con `--headless=new --dump-dom` y `--screenshot=`); **Firefox 158** queda como alternativa.

Decisiones ya resueltas por la persona usuaria (no se reabren): **D-01 paleta C «Minimal natural»** y **D-02 imagen decorativa `logo.png` con `alt=""`**. Este documento explica cómo se implementan, no las vuelve a discutir.

## Goals / Non-Goals

**Goals:**

- Una identidad visual única para las cinco vistas, sostenida por tokens declarados una sola vez en `:root`.
- Una taxonomía de clases reutilizables, aplicada sin alterar la estructura de vistas ni los textos visibles del Change 01.
- Un layout con Flexbox y Grid que funcione de 320 a 1280 px sin desplazamiento horizontal de página.
- Foco visible, contraste AA y mensajes de estado distinguibles sin depender del color.
- Una única imagen decorativa local que no rompa la coherencia visual de la cabecera.
- Verificable de forma estática y headless, sin introducir JavaScript en el producto.

**Non-Goals:**

- Reestructurar el HTML más allá de clases, envoltorios de tabla y el `<img>` decorativo (SPEC v2 §3.2).
- JavaScript, datos, validaciones, persistencia y README (Ejercicios 3 a 6).
- Modo oscuro, estilos de impresión, animaciones complejas (no pedidos).
- Incorporar imágenes o tipografías distintas de las ya decididas.
- Proveer herramientas de construcción, empaquetado o normalización de CSS.

## Tokens de diseño

Todos los tokens viven en `:root` de `css/estilos.css` y se consumen por nombre. No se permiten valores hexadecimales sueltos fuera de ese bloque.

**Color (paleta C «Minimal natural»):**

| Token | Valor | Rol |
|---|---|---|
| `--color-fondo` | `#FAFAF8` | Fondo de la página |
| `--color-superficie` | `#FFFFFF` | Tarjetas, cabecera, tablas, controles |
| `--color-texto` | `#22262A` | Texto principal |
| `--color-texto-suave` | `#5B625E` | Texto secundario, estados vacíos, `caption` |
| `--color-primario` | `#2F5D50` | Botón primario, enlaces, títulos de marca |
| `--color-primario-hover` | `#234A3F` | Estado hover del primario |
| `--color-acento` | `#C2A25A` | **Solo decorativo**: bordes y detalles, nunca texto |
| `--color-error` | `#A33A2B` | Texto y borde del mensaje de error |
| `--color-error-fondo` | `#F7EAE7` | Fondo del mensaje de error |
| `--color-exito` | `#2C6B4F` | Texto y borde del mensaje de éxito |
| `--color-exito-fondo` | `#E8F2ED` | Fondo del mensaje de éxito |
| `--color-foco` | `#0B57D0` | Contorno de foco visible |
| `--color-borde` | `#949494` | Bordes de controles de formulario (≥ 3:1 contra `#FFFFFF`) |
| `--color-borde-suave` | `#E3E4E0` | Separadores de tarjeta, filas de tabla y `caption` |

**Tipografía (sin CDN, sin `@font-face`):**

| Token | Valor |
|---|---|
| `--fuente-base` | `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` |
| `--fuente-titulos` | la misma pila sans que `--fuente-base` (la paleta C no usa serif) |

**Escalas:** `--texto-xs` `0.75rem` · `--texto-sm` `0.875rem` · `--texto-base` `1rem` · `--texto-lg` `1.125rem` · `--texto-xl` `1.25rem` · `--texto-2xl` `1.75rem` · `--espacio-1` `0.25rem` · `--espacio-2` `0.5rem` · `--espacio-3` `0.75rem` · `--espacio-4` `1rem` · `--espacio-5` `1.5rem` · `--espacio-6` `2rem` · `--radio-sm` `4px` · `--radio-md` `8px` · `--radio-lg` `12px` · `--sombra-suave` `0 1px 2px rgba(34,38,42,.08), 0 1px 3px rgba(34,38,42,.06)`.

**Contraste (WCAG 2.x, cálculo sobre la paleta C):** texto/fondo 14,58:1 · texto suave/fondo 5,99:1 · primario/fondo 7,17:1 · blanco/primario 7,49:1 · error/error-fondo 5,59:1 · éxito/éxito-fondo 5,52:1 · foco/fondo 6,11:1 · foco/superficie 6,39:1 · borde/superficie 3,03:1. El acento, con 2,33:1, **nunca se usa para texto**.

## Taxonomía de clases

Se estiliza por clase; los `id` no se usan como selectores (SPEC v2 A-05). Nombres en español, kebab-case.

| Clase | Se aplica a | Comportamiento |
|---|---|---|
| `.contenedor` | envuelve el contenido de cada vista | Ancho máximo 1100 px, centrado, padding lateral |
| `.cabecera` | `header` | Flexbox fila, se envuelve en pantallas chicas |
| `.marca-libreria` | `p` de la marca | Flexbox con imagen + nombre |
| `.marca-imagen` | `img` de la marca | Escala decorativa, 3 rem de alto |
| `.marca-nombre` | `span` del nombre | Peso y color de marca |
| `.navegacion` | `nav` | Bloque con lista Flexbox envuelta |
| `.contenido` | `main` | Grid de una columna, se abre a 2 columnas a 640 px |
| `.tarjeta` | `section` y el bloque de búsqueda del Catálogo | Superficie con borde, radio, sombra y padding |
| `.formulario` | los 4 `form` | Agrupa controles y organiza los botones |
| `.campo` | cada `p` que envuelve `label` + control (12) | Grid label/control, una columna a 320 px, dos a 640 px |
| `.boton` | los 8 `button` | Base común de los botones |
| `.boton--primario` | 3 botones principales | Fondo primario, texto blanco |
| `.boton--secundario` | 5 botones secundarios | Borde y texto primario, fondo superficie |
| `.tabla` | las 6 `table` | `border-collapse`, encabezados y celdas |
| `.tabla-desplazable` | envoltorio de las 6 tablas | `overflow-x: auto` |
| `.mensaje` | 4 mensajes de estado | Base de los mensajes |
| `.mensaje--error` | 3 mensajes de error | Fondo, borde de 4 px, texto y peso 600 |
| `.mensaje--exito` | 1 mensaje de éxito | Fondo, borde de 4 px, texto y peso 600 |
| `.estado-vacio` | 6 mensajes de lista vacía | Texto suave, borde punteado, padding |

**Regla de aplicación:** todo elemento equivalente comparte clase. No hay reglas duplicadas por vista.

## Estructura de `css/estilos.css`

Un solo archivo, con diez secciones comentadas y en este orden. La sección 1 es la única que declara valores literales; el resto consume tokens.

```
1. Tokens (:root)
2. Reset y base
3. Layout (contenedor, cabecera, navegación, contenido)
4. Tarjetas
5. Formularios
6. Botones
7. Tablas
8. Mensajes y estados
9. Adaptación (@media min-width)
10. Movimiento reducido (prefers-reduced-motion)
```

## Layout y adaptación responsiva

**Base mobile-first (320 px):**

- `body`: fondo `--color-fondo`, color `--color-texto`, `--fuente-base`, `margin: 0`, `line-height: 1.5`.
- `*`: `box-sizing: border-box`; `img { max-width: 100%; height: auto; }`; los textos largos parten con `overflow-wrap: anywhere`.
- `.contenedor`: `width: min(100% - 2rem, 1100px)`, `margin-inline: auto`.
- `.cabecera`: `display: flex`, `flex-wrap: wrap`, `justify-content: space-between`, `align-items: center`, `gap: var(--espacio-4)`, fondo `--color-superficie`, borde inferior `--color-borde-suave`.
- `.navegacion ul`: `display: flex`, `flex-wrap: wrap`, `gap: var(--espacio-2) var(--espacio-4)`, `list-style: none`, `padding: 0`.
- `.contenido`: `display: grid`, `gap: var(--espacio-5)`, `grid-template-columns: 1fr`.
- `.campo`: `display: grid`, `gap: var(--espacio-2)`, `grid-template-columns: 1fr`.
- `.formulario fieldset`: `display: grid`, `gap: var(--espacio-4)`, `grid-template-columns: 1fr`.
- Botones: `.formulario > button` es una fila Flexbox con `flex-wrap: wrap` y `gap: var(--espacio-3)`, sin necesidad de un envoltorio nuevo en el HTML.
- `.tabla-desplazable`: `overflow-x: auto`, `max-width: 100%`.
- `.tabla`: `width: 100%`, `min-width: 560px` (la tabla de renglones del detalle: `min-width: 480px`).

**Mejoras progresivas:**

| Breakpoint | Cambios |
|---|---|
| `min-width: 640px` | `.campo` a 2 columnas (label + control), `fieldset` a 2 columnas, `.contenido` a 2 columnas donde el contenido lo permita, `.navegacion` en una sola fila |
| `min-width: 1024px` | Ancho máximo 1100 px, `--espacio-5` en el grid del contenido, la tabla del Catálogo entra sin barra de scroll |

**Regla dura:** ninguna regla puede producir `overflow-x` en `html`/`body`. El único desplazamiento horizontal permitido es el de `.tabla-desplazable`.

## Foco visible y navegación por teclado

```css
:focus-visible {
  outline: 3px solid var(--color-foco);
  outline-offset: 2px;
}
```

- No hay ninguna regla que aplique `outline: none` sin sustituirlo por otro indicador visible.
- El foco no se elimina en ningún estado de los componentes (`.boton` incluido).
- Los enlaces de navegación llevan subrayado permanente como refuerzo no cromático del estado de enlace y del enlace activo.
- El orden de tabulación es el del DOM: no se agregan `tabindex` positivos ni negativos, así que la secuencia es la que espera la persona usuaria.
- `prefers-reduced-motion: reduce` desactiva transiciones y animaciones.

## Estrategia de tablas con desplazamiento propio

Cada una de las 6 tablas se envuelve en un `<div class="tabla-desplazable">`:

- El envoltorio es el único elemento con `overflow-x: auto`; su `max-width: 100%` impide que la tabla ensanche la página.
- La tabla declara `min-width` (560 px; 480 px para la tabla de renglones del detalle) para que las columnas conserven legibilidad en lugar de aplastarse.
- Las celdas usan `overflow-wrap: anywhere` para que un título, un email o un ISBN largos se partan dentro de la celda.
- En el bloque de detalle de Historial, el envoltorio de la tabla de renglones también lleva `.tarjeta` para separarlo del `dl` (SPEC §5.7).
- El desplazamiento del envoltorio es alcanzable con el teclado porque el propio contenedor queda enfocable por el navegador en Edge y Firefox, sin necesidad de JavaScript.

## Imagen decorativa en la cabecera

Markup (idéntico en las cinco vistas):

```html
<p class="marca-libreria">
  <img class="marca-imagen" src="logo.png" alt="" width="397" height="402">
  <span class="marca-nombre">Librería ABC</span>
</p>
```

- `logo.png` mide 397×402 px, es PNG RGBA y tiene **fondo blanco opaco** (0 % de píxeles transparentes).
- Para que ese fondo no se perciba como un parche, la **cabecera se pinta con `--color-superficie` (`#FFFFFF`)**, que coincide exactamente con el fondo de la imagen.
- `.marca-imagen` se escala a `height: 3rem; width: auto`; los atributos `width`/`height` del marcado declaran la proporción intrínseca y evitan el salto de layout. La imagen no se recorta ni se edita.
- `alt=""` porque es decorativa: la información ya está en el texto contiguo `.marca-nombre` («Librería ABC»), y un `alt` con el mismo texto duplicaría la información para un lector de pantalla.
- La procedencia y licencia de `logo.png` quedan como pendiente **PD-05**: no bloquea la implementación y se documentará en el README del Ejercicio 6.

## Compromisos de accesibilidad

| Compromiso | Cómo se cumple | Cómo se verifica |
|---|---|---|
| Contraste AA | Todos los pares de texto ≥ 4,5:1; borde de control 3,03:1; foco 6,11:1 | Cálculo documentado + revisión de que el acento no se usa en texto |
| Foco visible | `:focus-visible` con contorno de 3 px y desplazamiento de 2 px, nunca eliminado | Recorrido por teclado (Edge 155) — lo confirma la persona usuaria |
| Recorrido por teclado | Orden natural del DOM, sin `tabindex` | Recorrido por teclado — lo confirma la persona usuaria |
| Mensajes no dependientes del color | Texto propio + borde de 4 px + peso 600 + fondo | Revisión de las reglas `.mensaje--error` y `.mensaje--exito` |
| Imágenes | Una sola imagen, local y decorativa con `alt=""` | Inspección de las cinco cabeceras |
| Movimiento | Transiciones de 120 ms solo de color/foco, desactivadas con `prefers-reduced-motion` | Emulación de la preferencia en Edge |
| Semántica heredada | El HTML del Change 01 no se modifica en su estructura: un `h1` por vista, `label` por control, `caption` y `th` en las tablas | Revisión del marcado tras aplicar las clases |
| Progresive enhancement | Si la hoja de estilos no carga, el HTML sigue siendo legible y navegable | Revisión del orden de las clases en el CSS: primero la base, después los componentes |

## Supuestos y ambigüedades resueltas

| ID | Ambigüedad de la SPEC v2 | Resolución adoptada | Justificación |
|---|---|---|---|
| **A-01** | El requisito «Ausencia de recursos externos» de la capability `libreria-frontend` dice que el marcado «no contiene referencias a hojas de estilo», pero este change agrega un `<link>` a una hoja local. | Se interpreta «recursos externos» como *alojados en otro origen*: la hoja es local y relativa. La capability `libreria-frontend` **no se modifica** en este change; el comportamiento nuevo queda en `presentacion-css`. | Es la lectura coherente con el propósito del requisito (no hay red ni dependencias) y con la instrucción de no tocar la spec viva. Si al archivar se quiere cerrar la ambigüedad, se puede *MODIFICAR* ese requirement en un change posterior, sin efectos de código. |
| **A-02** | La SPEC §5.5 menciona una clase `.acciones-formulario` para alinear los botones, pero el HTML del Change 01 deja los botones como hijos directos del `form` y §3.2 excluye agregar envoltorios. | Los botones se alinean con `.formulario > button { display: flex; flex-wrap: wrap; gap: … }`, sin envoltorio nuevo. | Evita una modificación de estructura prohibida; el resultado visual es el mismo. |
| **A-03** | La SPEC §5.3 exige el token `--color-borde` pero la tabla de paletas no le asigna valor. | `--color-borde: #949494` (3,03:1 contra `#FFFFFF`, cumple el contraste de bordes de controles) y `--color-borde-suave: #E3E4E0` para separadores decorativos de tarjeta y tabla. | El borde de un control de formulario necesita 3:1 (WCAG 1.4.11); un gris claro no lo alcanzaría. |
| **A-04** | La SPEC no define el ancho de la tabla de renglones del detalle de Historial. | `min-width: 480px` (SPEC §5.5 lo menciona entre paréntesis sin número para «detalle»). | Mantiene el criterio de la SPEC sin contradecirla. |
| **A-05** | No se define el comportamiento del contenido de `.tabla` en pantallas muy angostas. | Las celdas conservan `min-width` de la tabla y parten el texto con `overflow-wrap: anywhere`; no hay reducir tipografía por columna. | Evita decisiones responsive fragile y respeta E-02. |
| **A-06** | La SPEC no dice si el `caption` de las tablas se oculta o se muestra. | El `caption` se muestra, con `--texto-sm` y `--color-texto-suave`; es texto informativo y debe seguir visible. | El `caption` es parte de la semántica de la tabla del Change 01. |
| **A-07** | La SPEC no define la separación entre las tarjetas. | `gap: var(--espacio-5)` en `.contenido` y `padding: var(--espacio-5)` en `.tarjeta`, con `--espacio-6` en el `padding` de las cabeceras de tabla. | Escala de espaciado coherente con los tokens ya definidos. |

## Risks / Trade-offs

- **Una regla de layout produce `overflow-x` accidental** → se mide con el arnés temporal (`document.documentElement.scrollWidth <= window.innerWidth`) en las 5 vistas a 320 y 1280 px antes de cerrar el change.
- **Un `min-width` de tabla demasiado alto vuelve incómoda la tabla a 320 px** → se revisa el ancho mínimo en la captura de 320 px y se ajusta dentro de los valores de la SPEC (560 px / 480 px).
- **El fondo opaco del PNG se percibe como parche** → la cabecera se pinta con `--color-superficie` (`#FFFFFF`), idéntico al fondo de la imagen; se confirma con captura a 1280 px.
- **El acento `#C2A25A` (2,33:1) se usa por error para texto** → el acento queda documentado como decorativo y su uso se revisa en la comprobación de contraste.
- **Bordes de control con contraste insuficiente** → `--color-borde` a `#949494` (3,03:1) en lugar de un gris claro.
- **El CSS crece sin estructura y se vuelve difícil de revisar** → un solo archivo, diez secciones comentadas, tokens al principio y valores literales únicamente en `:root`.
- **Reapertura de D-01 o D-02 durante la implementación** → ambas están resueltas; cualquier cambio de paleta o de imagen requiere autorización explícita y actualización de la SPEC v2.
- **No se puede verificar el foco real sin una persona** → el recorrido por teclado y la revisión visual quedan registrados como **pendientes de la persona usuaria**, nunca como aprobados.
- **La procedencia de `logo.png` sigue sin documentar** → no bloquea este change; queda como PD-05 para el README del Ejercicio 6.

## Migration Plan

No hay migración de datos ni despliegue: es un frontend estático abierto por `file://`.

1. **Orden reversible:** crear `css/estilos.css` vacío o parcial, enlazarlo y aplicar clases vista por vista. Si algo falla, se retira el `<link>` y el sitio vuelve al estado legible del Change 01.
2. **Rollback:** eliminar el `<link rel="stylesheet" href="css/estilos.css">` de los cinco HTML. Las clases y los envoltorios `.tabla-desplazable` son inocuos sin hoja de estilos (un `div` no altera la lectura lineal de la tabla).
3. **Verificación de no regresión:** el contrato de `id`, los textos visibles y la semántica del Change 01 se comparan antes y después; cualquier diferencia se corrige antes de avanzar.

## Open Questions

Ninguna que bloquee. Las decisiones D-01 (paleta C) y D-02 (imagen decorativa) ya están resueltas y las ambigüedades menores quedaron registradas como supuestos A-01 a A-07, que se pueden ajustar sin cambiar la especificación ni el desglose de tareas.

---

## Desvíos de la implementación

Detectados al implementar y verificar con el arnés. Cada uno responde a una
razón concreta; ninguno contradice la SPEC v2 ni los requisitos de la delta
spec `presentacion-css`.

| ID | Plan original | Implementación | Por qué |
|---|---|---|---|
| **D-1** | `.cabecera` es el contenedor Flexbox. | La flexión vive en el `.contenedor` interno del `header`; el `header` aporta fondo y borde. | Si el `header` fuera el flexbox, su `.contenedor` interno quedaría como ítem flex y el contenido no se centraría a 1100 px. |
| **D-2** | `.formulario` es un Grid de una columna y los botones se alinean aparte. | `.formulario` es un flex con envoltura; el Grid de una columna es el `fieldset` y los botones fluyen en la fila siguiente. | Con Grid, los botones caían cada uno en su propia fila. El flex con envoltura los deja en una fila sin agregar envoltorios al HTML. |
| **D-3** | `.contenido` se abre a 2 columnas a partir de 640 px. | `.contenido` queda en una columna en todos los anchos. | En el Catálogo, `main` contiene el `h1`, el formulario y la tabla: en dos columnas el `h1` quedaba al lado del formulario y la tabla quedaba en media columna. |
| **D-4** | La navegación pasa a una sola fila a 640 px. | La navegación conserva el envoltura en todos los anchos. | Con cinco enlaces, forzar una fila a 640 px acercaba demasiado los rótulos; el envoltura mantiene separación legible. |
| **D-5** | 3 botones primarios y 5 secundarios. | 4 primarios y 4 secundarios. | Las acciones principales de cada vista son *Buscar*, *Registrar libro*, *Registrar cliente* y *Registrar venta*: son cuatro, no tres. |
| **D-6** | `.mensaje` se aplica a 4 mensajes. | Se aplica a 8: los 5 `mensaje-exito` (uno por vista) y los 3 mensajes de error. | El `mensaje-exito` existe en las cinco cabeceras de vista; el plan lo contaba una sola vez. |
| **D-7** | `.tarjeta` en las `section`, en el bloque de búsqueda y en dos envoltorios de tabla. | `.tarjeta` en las 7 `section` y en el formulario de búsqueda; los envoltorios de tabla no la llevan. | La tabla ya aporta su propia superficie blanca; con `.tarjeta` encima se duplicaba el borde y la sombra. |
| **D-8** | Taxonomía cerrada de 20 clases. | Se agregan `.campo--busqueda` (label + control + botón del catálogo en una fila), `.lista-detalle` (la `dl` del detalle de venta) y `.tabla--compacta` (ancho mínimo de 480 px de la tabla de renglones, ya previsto en el plan de tablas). | `.campo--busqueda` y `.lista-detalle` no existían en la taxonomía y no tenían reglas posibles sin ellas. `.tabla--compacta` ya estaba prevista en la sección de tablas. |
| **D-9** | Un bloque `.contenedor` por vista. | `.contenedor` se aplica al `main` y a un `div` interno del `header`. | La cabecera necesita fondo de superficie completo (para que el PNG blanco se funda) y, a la vez, contenido limitado a 1100 px. |

### Clases agregadas

| Clase | Se aplica a | Comportamiento |
|---|---|---|
| `.campo--busqueda` | `p` del bloque de búsqueda del Catálogo | Flexbox con envoltura: etiqueta a una línea, control y botón en la misma fila |
| `.lista-detalle` | `dl` del detalle de la venta | Rejilla etiqueta/valor; a 640 px pasa a dos columnas |
| `.tabla--compacta` | tabla de renglones del detalle | Ancho mínimo de 480 px en lugar de 560 px |
