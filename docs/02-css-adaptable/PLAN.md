# PLAN — Change 02: Presentación con CSS y uso adaptable

| Campo | Valor |
|---|---|
| Change | 02 — Presentación con CSS y uso adaptable (Ejercicio 2 · 20 puntos) |
| Fase | PLAN (Fase 2) |
| Estado | **Ejecutado y archivado** el 20/10/2026 — 34 de 35 tareas cerradas y 157/157 comprobaciones en verde; T-27 y T-32 ejecutados y verificados el 20/10/2026; el change quedó archivado (`openspec/changes/archive/2026-10-20-02-css-adaptable/`) |
| Registro | La implementación se desvió del plan en 9 puntos, documentados en la sección «Desvíos de la implementación» de `design.md` y anotados en cada tarea afectada. |
| Fecha | 19/10/2026 |
| SPEC aprobada | `docs/02-css-adaptable/SPEC.md` v2 (D-01 paleta C y D-02 imagen decorativa resueltas el 19/10/2026) |
| Entregable | `css/estilos.css` + `<link>` y clases en los 5 HTML + envoltorios `.tabla-desplazable` + `logo.png` decorativo en la marca |
| Alcance | Estricto según SPEC §3; sin JavaScript, sin datos, sin validaciones, sin modo oscuro |
| Artefactos OpenSpec | `openspec/changes/02-css-adaptable/{proposal.md, design.md, specs/presentacion-css/spec.md, tasks.md}` |
| Navegador de referencia | Edge 155 (headless verificado) · Firefox 158 como alternativa |

---

## 1. Objetivo del plan

Convertir la SPEC v2 aprobada en una capa de presentación verificable, en el orden que minimiza retrabajo: primero los tokens y la base (que definen la identidad de la que depende todo lo demás), después el layout y los componentes (que los consumen), luego la imagen decorativa y la cabecera (que dependen de la superficie ya definida), después los tramos de adaptación (que solo ajustan lo anterior) y, por último, la verificación transversal con evidencia registrada.

**El plan no modifica la SPEC.** No se detectó ninguna contradicción entre SPEC v2 y consigna que exija un ajuste; las ambigüedades menores se resolvieron de forma conservadora y quedaron registradas como supuestos A-01 a A-07 en `design.md`.

---

## 2. Condiciones de ejecución

1. **No se implementa nada hasta la autorización explícita** del usuario para iniciar la Fase 3.
2. Se crea **solo** `css/estilos.css`. No se crean `js/`, `img/`, `README.md` ni repositorio Git.
3. Se modifica **solo** lo previsto en la SPEC §5.2: `<link>` en el `<head>`, atributos `class`, envoltorios `<div class="tabla-desplazable">` y el `<img>` decorativo en la marca. **No** se cambian `id`, etiquetas visibles, orden de campos, textos de contenido ni estructura de secciones.
4. No se agregan scripts, datos, validaciones, fuentes externas, `@import` remoto, frameworks ni herramientas de compilación.
5. El JavaScript de medición, si se usa, vive **fuera del proyecto** (en `%TEMP%`), sobre copias descartables: no se entrega ni se enlaza.
6. Cada tarea se cierra con su comprobación anotada; si una comprobación falla, se corrige antes de avanzar.
7. La **verificación visual final en Edge 155 / Firefox 158** y el **recorrido por teclado** los confirma el usuario; el agente solo aporta evidencia estática y capturas headless. **No se declarará «aprobado» ningún control que no se haya ejecutado.**

---

## 3. Fases

| Fase | Contenido | Estado |
|---|---|---|
| 1 · SPEC | `docs/02-css-adaptable/SPEC.md` v2 con D-01 y D-02 resueltas | **Hecha** (19/10/2026) |
| 2 · PLAN | Este documento + artefactos OpenSpec del change | **Hecha** (19/10/2026) |
| 3 · Implementación | `css/estilos.css` + ajustes mínimos en los 5 HTML (T-01…T-24) | **Pendiente de autorización** |
| 4 · Verificación y cierre | Arnés, capturas, restricciones, controles del usuario y resumen (T-25…T-35) | **Pendiente** |

---

## 4. Orden y dependencias

```
Fase 3 — Implementación
  T-01 tokens (:root)  →  T-02 valores paleta C
        ↓
  T-03 base/reset  →  T-04 :focus-visible  →  T-05 uso de tokens
        ↓
  T-06 contenedor  →  T-07 cabecera  →  T-08 navegación  →  T-09 contenido (Grid)
        ↓
  T-10 formulario (Grid + fila de botones)
        ↓
  T-11 tarjetas  →  T-12 botones  →  T-13 campos  →  T-14 controles
        ↓
  T-15 .tabla  →  T-16 envoltorios .tabla-desplazable
        ↓
  T-17 mensajes y estados vacíos
        ↓
  T-18 markup de la imagen  →  T-19 estilos de la marca  →  T-20 fondo de la cabecera
        ↓
  T-21 base 320  →  T-22 tramo 640  →  T-23 tramo 1024  →  T-24 adaptación medida
        ↓
Fase 4 — Verificación y cierre
  T-25 arnés  →  T-26 medición  →  T-27 capturas  →  T-28 restricciones
  →  T-29 file://  →  T-30 contraste  →  T-31 reduced-motion
  →  T-32 teclado (USUARIA)  →  T-33 revisión visual (USUARIA)
  →  T-34 evidencia  →  T-35 cierre
```

- T-02 a T-05 dependen de T-01; T-07 a T-10 dependen de T-03 (base) y de T-06.
- T-11 a T-17 son independientes entre sí una vez fijada la base: pueden ejecutarse en cualquier orden o en paralelo.
- T-18 a T-20 dependen de T-07 (la cabecera ya pintada con `--color-superficie`).
- T-21 a T-24 dependen de todos los componentes: solo ajustan lo ya construido.
- T-25 a T-31 y T-34 son independientes entre sí; T-32 y T-33 dependen de la persona usuaria; T-35 depende de todas las comprobaciones.

---

## 5. Tareas

### Fase 3 · Implementación

| Tarea | Resultado esperado | Cubre | Dependencias | Comprobación |
|---|---|---|---|---|
| **T-01** | `css/estilos.css` creado con el bloque `:root` y los 14 tokens de color, 2 de fuente, 6 de texto, 6 de espaciado, 3 de radio y 1 de sombra. | R-01, R-02 | — | El archivo existe y cada token declarado devuelve una única coincidencia. |
| **T-02** | Los valores de la paleta C quedan fijados en `:root` con los hexadecimales exactos. | R-01 | T-01 | Cada valor aparece una vez dentro de `:root` y ninguna vez fuera. |
| **T-03** | Sección «Reset y base»: `box-sizing`, `body`, imágenes y `overflow-wrap: anywhere`. | R-01, R-04 | T-01 | La base se aplica a las cinco vistas sin generar desplazamiento horizontal. |
| **T-04** | Regla global `:focus-visible` con contorno de 3 px y desplazamiento de 2 px. | R-04 | T-01 | `outline: none` / `outline: 0` devuelven 0 coincidencias en el CSS. |
| **T-05** | El resto del CSS consume tokens; no quedan literales de color ni de tamaño de fuente. | R-01, R-06 | T-01 | Fuera de `:root`, 0 colores hexadecimales y 0 tamaños en píxeles. |
| **T-06** | `.contenedor` con ancho máximo 1100 px, centrado y con padding; aplicado en las cinco vistas. | R-04 | T-03 | A 1280 px queda centrado; a 320 px no excede la ventana. |
| **T-07** | `.cabecera` con Flexbox, fondo `--color-superficie` y borde inferior; aplicada en las cinco vistas. | R-01, R-02 | T-03, T-06 | Fila a 1280 px, envoltura a 320 px, sin desbordes. |
| **T-08** | `.navegacion` y su `ul` en Flexbox con envoltura y subrayado permanente en los enlaces. | R-01, R-02, R-04 | T-07 | Una fila a 1280 px, varias filas a 320 px, sin barra horizontal. |
| **T-09** | `.contenido` como Grid de una columna con `gap`, aplicado al `main` de las cinco vistas. | R-02 | T-06 | Alineación a retícula y sin desplazamiento horizontal. |
| **T-10** | `.formulario` y `fieldset` como Grid de una columna; botones alineados en fila Flexbox sin envoltorio nuevo. | R-02, R-04 | T-09 | 4 formularios y 8 botones distribuidos, sin superposición a 320 px. |
| **T-11** | `.tarjeta` (superficie, borde, radio, sombra, padding) aplicada a las 7 `section` y al bloque de búsqueda del Catálogo. | R-01 | T-03 | 8 tarjetas distinguibles del fondo y sin texto desbordado. |
| **T-12** | `.boton`, `.boton--primario`, `.boton--secundario` con `:hover` y `:active`, aplicados a los 8 botones. | R-01, R-04 | T-05, T-04 | 3 primarios y 5 secundarios, con foco visible conservado. |
| **T-13** | `.campo` como Grid `label` + control, aplicado a los 12 `p` de campo, sin tocar el texto de las etiquetas. | R-01, R-04 | T-10 | 12 campos alineados, etiqueta asociada, sin desborde a 320 px. |
| **T-14** | Controles de formulario con borde `--color-borde`, radio, relleno y fondo de superficie; `legend` destacado. | R-01, R-04 | T-05 | Borde ≥ 3:1 contra la superficie; controles utilizables a 320 px. |
| **T-15** | `.tabla` con `border-collapse`, encabezados destacados y `caption` secundario, aplicada a las 6 `table`. | R-01, R-04 | T-05 | Aspecto uniforme en las 6 tablas; encabezados distinguibles por peso y color. |
| **T-16** | `.tabla-desplazable` (`overflow-x: auto`, `max-width: 100%`) y envoltorios alrededor de las 6 tablas. | R-04 | T-15 | 6 tablas, 6 envoltorios; cada tabla dentro de un contenedor desplazable. |
| **T-17** | `.mensaje`, `.mensaje--error`, `.mensaje--exito` y `.estado-vacio` con texto, borde, peso y fondo. | R-03 | T-05 | 4 mensajes y 6 estados vacíos distinguibles sin depender del color; los `hidden` no ocupan espacio. |
| **T-18** | Markup de la marca en las 5 cabeceras: `<img class="marca-imagen" src="logo.png" alt="" width="397" height="402">` + `<span class="marca-nombre">Librería ABC</span>`. | R-06 | T-07 | 5 coincidencias de `marca-imagen`, 5 de `alt=""`; texto visible intacto. |
| **T-19** | `.marca-libreria` en Flexbox, `.marca-imagen` a 3 rem de alto con `width: auto`, `.marca-nombre` con peso y color de marca. | R-01, R-06 | T-18 | Proporción 397×402 conservada, sin recorte ni deformación. |
| **T-20** | Cabecera pintada con `--color-superficie` (`#FFFFFF`), idéntico al fondo opaco del PNG. | R-01 | T-19 | La captura a 1280 px no muestra un parche blanco en la marca. |
| **T-21** | Base mobile-first: una columna en `.contenido`, `.campo` y `fieldset`; cabecera y navegación con envoltura. | R-04 | T-10, T-17 | A 320 px, 0 reglas producen `overflow-x` en `html`/`body`. |
| **T-22** | Tramo `min-width: 640px`: `.campo` y `fieldset` a 2 columnas, navegación en una fila, `.contenido` en 2 columnas. | R-04 | T-21 | A 640 y 1280 px, etiquetas y controles en dos columnas, sin desbordes. |
| **T-23** | Tramo `min-width: 1024px`: ancho máximo 1100 px, espaciado mayor y tabla del Catálogo sin barra de scroll. | R-04 | T-22 | A 1280 px la tabla del Catálogo entra y el contenido queda centrado. |
| **T-24** | Adaptación medida de 320 a 1280 px en las cinco vistas. | R-04 | T-21…T-23 | `scrollWidth <= innerWidth` en las 5 vistas a 320 y 1280 px; alguna `.tabla-desplazable` con `scrollWidth > clientWidth` y `overflow-x: auto` a 320 px. |

### Fase 4 · Verificación y cierre

| Tarea | Resultado esperado | Cubre | Dependencias | Comprobación |
|---|---|---|---|---|
| **T-25** | Arnés temporal **fuera del proyecto** (`%TEMP%`): copia de cada vista con un `<script>` que informa `document.documentElement.scrollWidth`, `window.innerWidth` y, por cada `.tabla-desplazable`, `scrollWidth`, `clientWidth` y `overflow-x`. | R-04 | T-24 | El arnés corre sobre las 5 copias; no queda nada dentro del proyecto ni enlazado. |
| **T-26** | Medición del arnés en las cinco vistas a 320×800 y 1280×800, con resultados registrados. | R-04 | T-25 | 10 ejecuciones sin `scrollWidth > innerWidth`; en las tablas anchas, `scrollWidth > clientWidth` y `overflow-x: auto`. |
| **T-27** | 10 capturas headless de Edge 155 (5 vistas × 2 anchos) como evidencia visual. | R-01, R-04 | T-23 | Las 10 capturas existen y contrastan con la identidad esperada. |
| **T-28** | Verificación de restricciones y convenciones sobre los 5 HTML y el CSS. | R-02, R-05, R-06 | T-24 | 0 coincidencias de `style=`, `<style`, `@import`, `http://`, `https://`, `<script`, `!important` y de selectores por `id`; sin `.js` ni `js/`. |
| **T-29** | Apertura por `file://` de las cinco vistas con `msedge --headless=new --dump-dom`. | R-05 | T-27 | DOM con `header`, `nav`, `main` y elementos esperados; hoja aplicada sin red. |
| **T-30** | Verificación estática de los compromisos de contraste. | R-01, R-04 | T-28 | Pares de texto ≥ 4,5:1, borde de control ≥ 3:1, foco ≥ 3:1 y 0 usos del acento como color de texto. |
| **T-31** | Verificación de `prefers-reduced-motion` con la emulación de Edge. | R-04 | T-28 | Con la preferencia activada, ninguna transición queda activa. |
| **T-32** | **PENDIENTE DEL USUARIO** — Recorrido por teclado en Edge 155 sobre los controles de las cinco vistas. | R-04 | T-27 | Se registra como **pendiente** hasta que el usuario lo ejecute y confirme; nunca como aprobado. |
| **T-33** | **PENDIENTE DEL USUARIO** — Revisión visual en Edge 155: identidad compartida a 1280 y 320 px e integración de la imagen de la marca. | R-01, R-06 | T-27, T-20 | Se registra como **pendiente** hasta que el usuario lo ejecute y confirme; nunca como aprobado. |
| **T-34** | Registro de evidencia: tabla de comprobaciones con estado real (aprobado / fallido / omitido / pendiente), alcance implementado, limitaciones y pendientes. | R-01…R-06 | T-25…T-33 | Cada control de T-01 a T-33 figura con su resultado real; ningún control no ejecutado aparece como aprobado. |
| **T-35** | Cierre del change: tareas actualizadas y lista de supuestos A-01…A-07 y del pendiente PD-05 (procedencia de `logo.png`). | R-05, R-06 | T-34 | El resumen final menciona los supuestos y marca PD-05 como bloqueante solo del README del Ejercicio 6. |

---

## 6. Inventario esperado (base de verificación)

| Archivo | `<link>` | Clases a aplicar | Tablas envueltas | Imagen decorativa | Mensajes |
|---|---|---|---|---|---|
| `index.html` | 1 | `contenido`, `cabecera`, `navegacion`, `tarjeta`, `campo`, `boton`, `tabla`, `tabla-desplazable`, `mensaje--exito`, `estado-vacio` | 1 (Catálogo) | 1 (`marca-imagen`) | 1 éxito + 2 vacíos |
| `libros.html` | 1 | + `formulario`, `boton--primario`, `boton--secundario`, `mensaje--error` | 1 (Libros) | 1 | 1 éxito + 1 error + 1 vacío |
| `clientes.html` | 1 | ídem | 1 (Clientes) | 1 | 1 éxito + 1 error + 1 vacío |
| `ventas.html` | 1 | ídem | 1 (Resumen) | 1 | 1 éxito + 1 error + 1 vacío |
| `historial.html` | 1 | ídem + `dl` de detalle | 2 (Historial + renglones) | 1 | 1 éxito + 1 vacío |

**Totales esperados:** 5 `<link>` · 6 `<div class="tabla-desplazable">` · 6 `class="tabla"` · 5 `class="marca-imagen"` con `alt=""` · 12 `class="campo"` · 8 `class="boton"` (3 primarios + 5 secundarios) · 4 `class="mensaje"` · 6 `class="estado-vacio"` · 1 archivo nuevo (`css/estilos.css`).

---

## 7. Matriz tarea → requisito / criterio

| Tarea | R-01 | R-02 | R-03 | R-04 | R-05 | R-06 | CA-01 | CA-02 | CA-03 | CA-04 | CA-05 | CA-06 | CA-07 | CA-08 | CA-09 | CA-10 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T-01, T-02 | ● | | | | | ● | ● | | ● | | | | | | | ● |
| T-03, T-05 | ● | | | ● | | ● | ● | | | | | | | ● | | |
| T-04 | | | | ● | | | | | | | ● | | | | | | |
| T-06, T-07, T-08 | ● | ● | | ● | | | | ● | | | | | | | | |
| T-09, T-10 | | ● | | ● | | | | | ● | | | | | | | | |
| T-11, T-12, T-13, T-14, T-15 | ● | | | ● | | | ● | | | ● | | | | | | |
| T-16, T-21, T-22, T-23, T-24 | | | | ● | | | | | | | ● | | | | | | |
| T-17 | | | ● | | | | | | | | ● | | | | | | |
| T-18, T-19, T-20 | ● | | | | | ● | | | | | ● | | | | | ● |
| T-25, T-26, T-27, T-32, T-33 | ● | | | ● | | | | ● | | | ● | | | | | |
| T-28, T-29 | | ● | | | ● | ● | | ● | | | | ● | ● | | | |
| T-30, T-31 | ● | | | ● | | | | | | | ● | | | | | |
| T-34, T-35 | | | | | | | ● | | | | | | | ● | ● | ● | |

● cubre · CA-0x según la tabla de criterios de aceptación de `proposal.md`.

---

## 8. Criterios de aceptación

| ID | Criterio | Evidencia | Tareas |
|---|---|---|---|
| CA-01 | Las cinco vistas comparten identidad y reutilizan clases y tokens. | Capturas de las 5 vistas a 1280 y 320 + revisión de clases | T-01…T-03, T-11…T-15, T-19, T-27 |
| CA-02 | CSS externo, sin estilos en línea, con Flexbox y Grid. | 0 `<style>`/`style=`; `display:flex` y `display:grid` presentes | T-04…T-10, T-28 |
| CA-03 | Errores y éxitos distinguibles por texto, borde y peso. | Texto presente en el HTML + reglas de borde, fondo y peso | T-17 |
| CA-04 | 320/1280 sin scroll horizontal; tablas con scroll propio; foco visible; teclado. | Arnés + capturas + prueba manual | T-16, T-21…T-27, T-31, T-32 |
| CA-05 | Alcance completo, sin trabajo excluido. | Contraste del inventario (§6) contra SPEC §3.2 | T-28, T-34 |
| CA-06 | Convenciones y tecnologías de la consigna. | Búsqueda de patrones + apertura `file://` | T-28, T-29 |
| CA-07 | Comprobaciones ejecutadas con evidencia. | Tabla de resultados | T-25…T-31, T-34 |
| CA-08 | Estados aprobado/fallido/omitido/pendiente diferenciados. | Tabla con estado real | T-34 |
| CA-09 | Supuestos, placeholders y limitaciones identificados. | A-01…A-07 y PD-05 | T-35 |
| CA-10 | Imagen local y decorativa con `alt=""` y procedencia registrada. | Inspección de las 5 cabeceras + registro de PD-05 | T-18, T-33, T-35 |

---

## 9. Tabla de comprobaciones (estado actual)

| Control | Tarea | Cómo se verifica | Estado |
|---|---|---|---|
| Tokens y paleta C completos | T-01, T-02 | Búsqueda de tokens y hexadecimales | **Pendiente** (no implementado) |
| Base sin desplazamiento horizontal | T-03, T-21 | Arnés a 320 px | **Pendiente** (no implementado) |
| Foco visible declarado y no anulado | T-04 | Búsqueda de `outline: none` | **Pendiente** (no implementado) |
| Layout Flexbox/Grid presente | T-07…T-10 | Inspección del CSS | **Pendiente** (no implementado) |
| Componentes con clases reutilizadas | T-11…T-17 | Revisión de clases en los 5 HTML | **Pendiente** (no implementado) |
| Imagen decorativa integrada | T-18, T-19, T-20 | Inspección del marcado + captura | **Pendiente** (no implementado) |
| Adaptación 320/1280 medida | T-24, T-26 | Arnés temporal | **Pendiente** (no implementado) |
| Capturas de evidencia | T-27 | Edge headless `--screenshot` | **Pendiente** (no implementado) |
| Restricciones y convenciones | T-28 | Búsqueda de patrones | **Pendiente** (no implementado) |
| Apertura por `file://` | T-29 | `msedge --headless=new --dump-dom` | **Pendiente** (no implementado) |
| Contraste y movimiento reducido | T-30, T-31 | Cálculo de contraste + emulación | **Pendiente** (no implementado) |
| Recorrido por teclado | T-32 | Revisión manual en Edge 155 | **Pendiente del usuario** |
| Revisión visual en Edge 155 | T-33 | Revisión manual en Edge 155 | **Pendiente del usuario** |
| Registro de evidencia y cierre | T-34, T-35 | Resumen de implementación | **Pendiente** |

> Ningún control figura como aprobado: en esta fase solo se planificó.

---

## 10. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Una regla de layout produce `overflow-x` accidental | Media | Alto | T-24 y T-26 miden `scrollWidth` en las 5 vistas a 320 y 1280 px antes de cerrar el change. |
| `min-width` de tabla demasiado alto a 320 px | Media | Medio | Revisión en la captura de 320 px; ajuste dentro de los valores de la SPEC (560 px / 480 px). |
| El fondo opaco del PNG se percibe como parche | Media | Medio | T-20: la cabecera se pinta con `--color-superficie` (`#FFFFFF`), idéntico al fondo de la imagen. |
| Uso accidental del acento `#C2A25A` como color de texto | Media | Medio | El acento queda documentado como decorativo y T-30 revisa que no se use en texto. |
| Borde de control con contraste insuficiente | Media | Medio | `--color-borde: #949494` (3,03:1 contra `#FFFFFF`) en lugar de un gris claro (supuesto A-03). |
| El CSS crece sin estructura y es difícil de revisar | Media | Medio | Un solo archivo, diez secciones comentadas y valores literales solo en `:root` (T-01, T-05). |
| Agregar envoltorios o markup no previstos | Media | Alto | La SPEC §3.2 y la condición 3 acotan el HTML a `<link>`, clases, envoltorios de tabla y el `<img>`; T-28 audita el marcado. |
| No poder verificar el foco y la vista final sin una persona | Alta | Bajo | Se aporta evidencia estática y capturas; T-32 y T-33 quedan como pendientes del usuario. |
| Reapertura de D-01 o D-02 durante la implementación | Baja | Alto | Ambas están resueltas: cualquier cambio de paleta o de imagen exige autorización y actualización de la SPEC v2. |
| Que la procedencia de `logo.png` quede sin documentar | Media | Bajo | No bloquea este change: queda como PD-05, bloqueante solo del README del Ejercicio 6 (T-35). |

---

## 11. Definición de terminado

El change se considera terminado cuando:

1. existe `css/estilos.css` y es el único archivo de producto nuevo;
2. los 5 HTML tienen `<link>`, las clases de la taxonomía, los 6 envoltorios `.tabla-desplazable` y la imagen decorativa con `alt=""`, sin cambios de `id`, de texto visible ni de estructura de vistas;
3. T-24 a T-31 y T-34 devuelven lo esperado con evidencia registrada;
4. T-32 y T-33 están ejecutados por la persona usuaria o quedan registrados como pendientes con su motivo;
5. la tabla de comprobaciones presenta estados reales y ningún control no ejecutado figura como aprobado;
6. los supuestos A-01 a A-07 y el pendiente PD-05 están documentados;
7. el usuario revisa el resumen y no pide ajustes.

**No se declara terminado** si queda un criterio de aceptación sin verificar; en ese caso se enumera como pendiente con su motivo.

---

## 12. Fuera de alcance de este plan

- JavaScript, datos, filtros, altas, ventas, `localStorage` (Ejercicios 3 a 6).
- Validaciones (Ejercicio 4) y README (Ejercicio 6).
- Modo oscuro, estilos de impresión y animaciones complejas.
- Imágenes o tipografías distintas de `logo.png` y de la pila sans del sistema.
- Cambios en la estructura de las vistas, en los `id` o en los textos visibles.
- Inicializar Git.
- Modificar `openspec/specs/libreria-frontend/`, `docs/01-estructura-html/`, `.opencode/`, `.agents/` o `.active-orchestrator-state.json`.

---

## 13. Autorización requerida

Este plan **no ejecuta** ninguna tarea. Para iniciar la Fase 3 (implementación) se necesita tu autorización explícita («implementá» / «dale, ejecutá el plan»). Si querés ajustar el orden, el alcance o alguna comprobación, decilo antes de autorizar.
