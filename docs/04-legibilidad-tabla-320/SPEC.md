# SPEC — Change 04: Legibilidad de la tabla del catálogo a 320 px

| Campo | Valor |
|---|---|
| Change | 04 — Legibilidad de la tabla del catálogo a 320 px (corrección del Ejercicio 2) |
| Fase | SPEC (Fase 1) |
| Versión | v1 |
| Estado | **Implementado, verificado y archivado** el 20/10/2026 (`openspec/changes/archive/2026-10-20-04-legibilidad-tabla-320/`) |
| Fecha | 20/10/2026 |
| Depende de | Change 02 (CSS, archivado) y Change 03 (catálogo, archivado) |
| Origen | Corrección indicada por la persona usuaria el 20/10/2026, sobre la base de la revisión visual pendiente (T-33 del Change 02) |
| Change de OpenSpec | `openspec/changes/04-legibilidad-tabla-320/` |

---

## 1. Problema

La revisión visual de las 10 capturas del 20/10/2026 encontró un defecto real: a 320 px las seis columnas de la tabla del catálogo parten su contenido. El ISBN aparecía como «97803 / 07474 / 728» y el precio como «$ / 24.500,00».

**Medición de partida** (viewport emulado de 320 px, tabla de 560 px, envoltura visible de 273 px):

| Columna | Contenido | Líneas |
|---|---|---|
| Título | Cien años de soledad | 2 |
| ISBN | 9780307474728 | **3** |
| Editorial | Editorial Sudamericana | **3** |
| Género | Realismo Mágico | 2 |
| Autores | Gabriel García Márquez | **3** |
| Precio | $ 24.500,00 | **2** |

**Causa:** la tabla declara `min-width: 560px`, así que sus seis columnas se reparten en 75–110 px, y el `overflow-wrap: anywhere` termina partiendo también los valores que no admiten cortes.

**Por qué importa:** el Ejercicio 2 vale 20 puntos, 8 de ellos de «adaptación», y el criterio es que a 320 px los textos «resultan legibles». Un ISBN partido por la mitad no es legible.

## 2. Objetivo y resultado esperado

Que a 320 px ningún valor quede partido y ninguna palabra se corte a la mitad, sin que la página desplace horizontalmente ni se pierda la regla que permite partir textos realmente largos.

## 3. Alcance

**Incluido:** el ancho mínimo de `.tabla`, una clase para los valores que no admiten cortes y su aplicación en el renderizado del catálogo, y la verificación asociada.

**Excluido:** cualquier otro cambio de estilo, el layout de las otras tablas (siguen vacías hasta los Ejercicios 4 y 5), los cinco HTML, y el resto de los archivos de JavaScript.

## 4. Requisitos

| ID | Requisito | Verificación |
|---|---|---|
| R-01 | La tabla declara un ancho mínimo suficiente para que sus columnas conserven legibilidad | La tabla mide al menos 720 px de ancho |
| R-02 | Los valores que no admiten cortes (ISBN, importe) se muestran en una sola línea | Medición de líneas por celda a 320 px |
| R-03 | Ninguna palabra de una celda queda partida a la mitad | La cantidad de líneas no supera la cantidad de palabras de la celda |
| R-04 | La tabla se sigue desplazando dentro de su contenedor y la página no se desplaza | 157/157 comprobaciones del arnés del Change 02 |
| R-05 | `overflow-wrap: anywhere` se mantiene como red de seguridad | La regla sigue presente en la hoja de estilos |

## 5. Solución

| Elemento | Cambio |
|---|---|
| `css/estilos.css` | `.tabla { min-width: 760px }` (antes 560 px) y `.tabla .celda-atomica { white-space: nowrap }` |
| `js/catalogo.js` | Las celdas de ISBN e importe se marcan con `celda-atomica` al crear la fila |

**Por qué una clase y no un selector por posición:** las tablas del proyecto no comparten cantidad ni orden de columnas (Historial tiene cinco, Ventas coloca el precio unitario en la tercera). Un `nth-child` aplicaría la regla a columnas equivocadas según la vista; la clase acompaña al dato.

## 6. Verificación

| Arnés | Resultado |
|---|---|
| Medición de celdas a 320 px | ISBN e importe en 1 línea; ninguna palabra partida a la mitad |
| Regresión del Change 02 | 157/157 |
| Regresión del Change 03 | 16/16 |
| Restricciones y regresión de archivos | TODO OK |
| Datos del modelo (Node) | 36/36 |

## 7. Supuestos y pendientes

| ID | Supuesto o pendiente | Efecto |
|---|---|---|
| A-01 | Las tablas de las otras cuatro vistas, cuando se rendericen en los Ejercicios 4 y 5, deberán marcar con `celda-atomica` sus valores atómicos | Si se olvidan, el defecto vuelve en esas tablas |
| A-02 | 760 px es un ancho mínimo que funciona con seis columnas | Con más columnas habría que ajustarlo |
| PD-01 | La confirmación visual de la persona usuaria (T-33 del Change 02) sigue pendiente | No bloquea: el defecto fue detectado, corregido y medido |
