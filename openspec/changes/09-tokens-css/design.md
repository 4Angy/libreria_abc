# Design — Change 09: Tokens de diseño para toda la hoja de estilos

## Context

La hoja de estilos tiene un bloque `:root` con **34 tokens**: doce colores (`--color-fondo` … `--color-foco`, más `--color-borde` y `--color-borde-suave`), dos familias tipográficas (`--fuente-base`, `--fuente-titulos`), seis escalas de texto (`--texto-xs` … `--texto-2xl`), seis de espaciado (`--espacio-1` … `--espacio-6`), tres de radio (`--radio-sm` … `--radio-lg`) y una de sombra (`--sombra-suave`).

Sobre ese bloque hay **26 líneas con valores literales**, que el diagnóstico del 22/10/2026 localiza así:

| Línea | Literal | Para qué está |
|---|---|---|
| 108 | `2rem`, `1100px` | Margen lateral y ancho máximo del contenedor |
| 114, 187, 218, 248, 291, 356, 385, 408 | `1px` | Bordes finos: separadores, contenedores de campo, botones, tabla y mensaje tachado |
| 140 | `3rem` | Alto de la imagen de la marca |
| 169 | `3px` | Filete de acento de la tabla |
| 253 | `7rem` | Alto mínimo de las tarjetas de estado |
| 275 | `12rem` | Ancho mínimo de la columna de los formularios |
| 294 | `120ms` ×3 | Duración de las transiciones |
| 335 | `760px` | Ancho mínimo de la tabla del catálogo |
| 341 | `480px` | Ancho mínimo de la tabla compacta |
| 368, 375 | `2px` | Bordes de la tabla |
| 386 | `4px` | Borde izquierdo del mensaje de error |
| 436, 437 | `3px`, `2px` | Grosor y desplazamiento del contorno de foco |
| 443 | `640px` | **Punto de quiebre de `@media`** |
| 445 | `10rem`, `16rem` | Columnas del grid de la cabecera |
| 462 | `1024px` | **Punto de quiebre de `@media`** |
| 481, 482 | `0.01ms` ×2 | Duración mínima en `prefers-reduced-motion` |

**De 26 líneas, 24 son tokenizables.** Las dos que no lo son son los puntos de quiebre de las media queries.

## Goals / Non-Goals

**Goals:**

- Que ningún valor de espaciado, tamaño, borde o duración quede escrito a mano en el cuerpo de la hoja de estilos.
- Que **el render no cambie ni un píxel**: el HTML, el JavaScript y el comportamiento quedan intactos.
- Que la lista de tokens esté documentada en el README, que hasta ahora no la detailed.
- Que el incumplimiento del requirement «Paleta y tokens de la identidad visual» quede cerrado.

**Non-Goals:**

- **No se rediseña nada**: ni colores, ni tipografías, ni espaciados, ni la identidad visual.
- **No se tokenizan los puntos de quiebre de las media queries**: no es técnicamente posible (ver D-B).
- **No se cambia la cantidad de tokens existentes**: los 34 se quedan; se agregan, no se reorganizan.
- **No se toca el HTML ni el JavaScript**: este change es de una sola hoja de estilos.
- **No se agregan filtros ni ninguna otra funcionalidad**: eso vive en el Change 08.

## Decisions

### D-A — Los tokens nuevos siguen la convención de nombres del proyecto

El proyecto ya usa `--color-*`, `--espacio-*`, `--radio-*`, `--texto-*`, `--fuente-*`. Los tokens nuevos respetan ese patrón y dicen **qué miden**, no dónde se usan: `--borde-fino`, `--borde-medio`, `--borde-destacado`, `--duracion-transicion`, `--duracion-reducida`, `--ancho-contenido`, `--ancho-tabla`, `--ancho-tabla-compacta`, `--alto-marca`, `--alto-minimo-tarjeta`, `--ancho-minimo-columna`, `--ancho-columna-min`, `--ancho-columna-max`, `--grosor-foco`, `--desplazamiento-foco`, `--espacio-contenedor`.

**Alternativa considerada.** Nombres por ubicación (`--borde-tarjeta`, `--alto-logo`): descartada, porque un token por ubicación se multiplica en cuanto el diseño se mueve, que es justo lo que la recomendación quiere evitar.

### D-B — Los puntos de quiebre de las media queries no se tokenizan

**Por qué no.** La condición de un `@media` no admite `var()`: `@media (min-width: var(--ancho-md))` es inválido y la hoja de estilos se descarta. Es una limitación del lenguaje, no una decisión de estilo.

**Qué se hace.** Los valores `640px` y `1024px` se dejan escritos en su lugar y se comenta al lado de cada uno, con el motivo. Es la única excepción, y queda anotada en el README para que nadie la «corrija» después.

**Alternativa considerada.** Mover los breakpoints a un archivo de constantes en el JavaScript: agregaría acoplamiento entre la hoja de estilos y el código, y la consigna exige que la presentación se obtenga de la hoja de estilos externa. Descartada.

### D-C — El valor `0.01ms` sí se tokeniza

Aunque parece un valor técnico, es un valor como cualquier otro y lo que hace es dejar la transición o la animación instantánea cuando la persona pidió menos movimiento. Se declara como `--duracion-reducida: 0.01ms`, con un comentario que explica para qué está, para que nadie lo «corrija» a `0s`.

### D-E — La verificación es de que nada cambia, no de que algo mejora

Un refactor de tokens se verifica **comparando el render antes y después**, no mirando el CSS.

La comprobación es: capturar las cinco vistas a 320 px y a 1280 px antes del cambio y después, y compararlas. Como el cambio solo mueve valores literales a variables con el mismo valor, **las capturas tienen que ser idénticas**. Si alguna se diferencia, el cambio está mal.

Esto usa el instrumental que ya existe (`arnes07/captura.js` y el arnés headless) y no requiere nada nuevo.

### D-F — El trabajo es de María, y hace falta el acuerdo de las dos

`css/estilos.css` es del Ejercicio 2, a cargo de María de los Ángeles Zalazar, y su implementación es una de las tres fortalezas que el evaluador destaca. Este change **propone** el trabajo; la decisión de ejecutarlo, y de repartirlo, es de las dos integrantes.

Queda anotado como pregunta abierta en este documento, y la primera tarea del `tasks.md` es obtener ese acuerdo antes de tocar una línea.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| Que un token mal escrito rompa una regla entera | La verificación compara capturas antes y después: cualquier diferencia aparece de inmediato (D-E) |
| Que al tokenizar se introduzca un valor por error y el render cambie | Cada token se declara con **el mismo valor** que tenía el literal, y la comparación de capturas lo detecta |
| Que alguien intente tokenizar los breakpoints | Está documentado en el código, en el README y en D-B, con el motivo técnico |
| Que este change se tome como una corrección del parcial ya aprobado | No lo es: es una mejora posterior a la devolución, en un change aparte, y no altera el entregable evaluado |
| Que el trabajo se haga sin el acuerdo de María | Es la primera tarea del plan, y está anotado en D-F |

## Migration Plan

No hay migración: no hay datos ni estados que migrar.

**Rollback.** Revertir el commit del change deja la hoja de estilos como estaba. El único efecto de deshacerlo sería perder la documentación de los tokens en el README.

## Open Questions

Ninguna que bloquee la planificación. Dos decisiones que se resuelven al ejecutar, y que no cambian el enfoque:

- **¿Cómo se reparten las tareas?** El CSS es del Ejercicio 2, de María. Puede hacerlo ella, o repartirse por líneas. Es una decisión de las dos, no del change.
- **¿Se agregan tokens para los valores que no son de diseño?** Por ejemplo, `0.01ms` es un valor de implementación, no de diseño. Este change lo tokeniza igual, por no dejar literales sueltos; si se prefiere dejarlo, es cambiar una línea del `tasks.md`.
