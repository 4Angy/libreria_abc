# Proposal — Change 09: Tokens de diseño para toda la hoja de estilos

## Why

La devolución del Parcial 1 —**100/100**, con el criterio de cierre en 10/10— deja dos recomendaciones. Esta es la segunda: *«Integrar más variables globales en el CSS para optimizar la adaptabilidad a pantallas aun más complejas»*.

Detrás de la recomendación hay algo más concreto, y es un **incumplimiento de nuestra propia spec**: el requirement «Paleta y tokens de la identidad visual» de la spec viva `presentacion-css` dice que «los demás valores de color, de tipografía, de espaciado, de radio y de sombra SHALL consumirse a través de esas variables». El proyecto define 34 tokens, pero el diagnóstico del 22/10/2026 encuentra **26 líneas con valores literales fuera del bloque `:root`**, entre ellas seis medidas de espaciado en `rem` (`2rem`, `3rem`, `7rem`, `10rem`, `12rem`, `16rem`) que incumplen esa regla.

Al mismo tiempo, la hoja de estilos es el archivo donde el docente vio «disposición adaptable impecable sin scroll de página». Tokenizarlo **no debe cambiar ni un píxel**: es un refactor, no un rediseño.

## What Changes

- Se agregan tokens para los valores literales que quedan fuera: grosores de borde, duraciones de transición, anchos de contenido y tamaños concretos.
- Se reemplazan los literales por esos tokens, **sin cambiar el resultado visual**.
- Se documenta en el README la lista completa de tokens de diseño.
- **No se tokenizan los dos puntos de quiebre de las media queries**: CSS no admite `var()` en la condición de `@media`. Queda documentado el motivo y el valor se mantiene literal.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

Ninguna. El cambio **no altera ningún comportamiento observable**: es un refactor puro que hace cumplir una regla que la spec viva `presentacion-css` ya exige, y por eso el change declara `skip_specs: true` en su `.openspec.yaml`.

## Impact

- `css/estilos.css` — **único archivo de la entrega que se toca**: se agregan tokens al bloque `:root` y se reemplazan los literales. No cambia ninguna declaración más allá del valor.
- `README.md` — se agrega a la sección de tecnologías la lista de tokens, que hasta ahora no estaba.
- `openspec/specs/presentacion-css/spec.md` — **sin cambios**: el requirement ya exige lo que este change viene a cumplir.
- **El CSS es del Ejercicio 2, a cargo de María de los Ángeles Zalazar.** Este change propone el trabajo; su ejecución requiere que las dos integrantes lo acuerden. Está anotado también en el `design.md`.
- Sin dependencias, sin recursos externos y sin cambios de comportamiento: la aplicación sigue funcionando igual con `file://`.
