# Design — Change 04: Legibilidad de la tabla del catálogo a 320 px

## Context

La revisión visual del 20/10/2026 encontró el defecto y lo midió: a 320 px, con la tabla declarando `min-width: 560px`, las seis columnas se reparten en 75–110 px y el `overflow-wrap: anywhere` termina partiendo valores que no admiten cortes.

Medición de partida (viewport emulado de 320 px, tabla de 560 px, envoltura visible de 273 px):

| Columna | Contenido | Líneas |
|---|---|---|
| Título | Cien años de soledad | 2 |
| ISBN | 9780307474728 | **3** |
| Editorial | Editorial Sudamericana | **3** |
| Género | Realismo Mágico | 2 |
| Autores | Gabriel García Márquez | **3** |
| Precio | $ 24.500,00 | **2** |

## Decisions

### D-A · Un ancho mínimo mayor, no menos

`.tabla` pasa de `min-width: 560px` a `min-width: 760px`.

**Por qué:** el problema no es que el texto se parta, sino que la tabla le da a cada columna demasiado poco. Con 760 px y seis columnas, cada una ronda los 126 px: «Sudamericana» (90 px) entra sin partirse y «Editorial Sudamericana» pasa a dos líneas que cortan en el espacio, no en mitad de palabra.

**Alternativa descartada:** reducir el `padding` de las celdas o achicar la tipografía. Ambas cosas empeoran la legibilidad para resolver un problema de espacio.

### D-B · Los valores atómicos no se parten

El ISBN y el importe se marcan con la clase `celda-atomica` y reciben `white-space: nowrap`.

**Por qué:** son valores, no prosa. Un ISBN partido en tres líneas no se puede leer ni copiar, y un importe partido entre el símbolo y las cifras pierde su sentido.

**Por qué una clase y no un selector por posición:** las tablas del proyecto no comparten la misma cantidad ni el mismo orden de columnas (la de Historial tiene cinco, la de Ventas coloca el precio unitario en la tercera). Un `nth-child` aplicaría la regla a columnas equivocadas según la vista. La clase acompaña al dato, no a la posición.

**Cómo se aplica:** el catálogo se renderiza desde JavaScript, así que las celdas de ISBN e importe se marcan al crearlas, en `js/catalogo.js`. Las tablas de las otras cuatro vistas siguen vacías hasta los Ejercicios 4 y 5: cuando se rendericen, las mismas columnas deberán llevar la clase.

### D-C · `overflow-wrap: anywhere` se queda

La regla que permite partir textos largos no se toca: es la red de seguridad del caso E-02 (un título o un correo muy largo dentro de una celda). La excepción es acotada a las celdas atómicas.

### D-D · La página no se desplaza

El contenedor de la tabla conserva `overflow-x: auto` y `min-width: 0`, de modo que una tabla más ancha sigue desplazándose dentro de su bloque y el documento no se ensancha. A 1280 px, la tabla entra holgadamente y no cambia nada de lo que ya se vio.

## Verificación

1. **Medición de celdas** (arnés en `%TEMP%`, fuera de la entrega): con el viewport emulado de 320 px, contar las líneas de cada celda de la primera fila con `Range.getClientRects()`.
   - Criterio: ISBN e importe en **1 línea**; ninguna celda con una palabra partida a la mitad.
2. **Regresión del Change 02** (arnés existente): 157/157 comprobaciones, incluida la de «sin scroll horizontal de la página» a 320 y 1280 px.
3. **Regresión del Change 03** (arnés existente): 16/16 comprobaciones de comportamiento del catálogo.
4. **Restricciones**: sigue sin haber `innerHTML`, estilos en línea ni recursos externos.

## Risks

| Riesgo | Mitigación |
|---|---|
| Más scroll horizontal a 320 px | Es lo previsto: el scroll ocurre dentro del contenedor, nunca en la página |
| La clase no llega a las tablas de los ejercicios 4 y 5 | Queda documentada acá; los cambios siguientes la aplican al renderizar |
| Un título enorme vuelve a desbordar | `overflow-wrap: anywhere` se mantiene |

## Migration

Ninguna: es una corrección de estilo sobre lo ya entregado. No cambia el comportamiento ni los datos.

## Open Questions

Ninguna. La corrección fue indicada por la persona usuaria el 20/10/2026 sobre la base de la revisión visual.
