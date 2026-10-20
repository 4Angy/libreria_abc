# Tasks

> Estado real: las 11 tareas están implementadas y verificadas. Comprobaciones: medición de celdas a 320 px (ISBN e importe en una sola línea, ninguna palabra partida), regresión del Change 02 157/157, regresión del Change 03 16/16, restricciones y regresión de archivos en verde, y datos 36/36.

## 1. Estilos

- [x] 1.1 T-01 — Elevar el ancho mínimo de `.tabla` para que sus columnas conserven legibilidad a 320 px. **Verificación:** la tabla del catálogo mide al menos 720 px de ancho y ninguna palabra de una celda queda partida a la mitad.
- [x] 1.2 T-02 — Declarar la clase `celda-atomica` con `white-space: nowrap`, para los valores que no admiten cortes. **Verificación:** el ISBN y el importe se muestran en una sola línea.
- [x] 1.3 T-03 — Mantener `overflow-wrap: anywhere` como red de seguridad para los textos largos. **Verificación:** la regla sigue presente en la hoja de estilos.

## 2. Renderizado

- [x] 2.1 T-04 — Marcar con `celda-atomica` las celdas de ISBN e importe al crear la fila del catálogo. **Verificación:** la primera fila del catálogo tiene dos celdas con esa clase, correspondientes al ISBN y al importe.
- [x] 2.2 T-05 — Ninguna otra celda queda marcada. **Verificación:** las celdas de título, editorial, género y autores no llevan la clase.

## 3. Verificación

- [x] 3.1 T-06 — Medir las líneas de cada celda de la primera fila a 320 px con el arnés de medición. **Verificación:** el ISBN y el importe ocupan una sola línea y ninguna celda parte una palabra a la mitad.  **Ejecutado: ISBN e importe en 1 línea; ninguna palabra partida a la mitad.**
- [x] 3.2 T-07 — Reejecutar el arnés de regresión del Change 02. **Verificación:** 157/157 comprobaciones en verde, incluida la ausencia de scroll horizontal de la página a 320 y 1280 px.  **Ejecutado: 157/157.**
- [x] 3.3 T-08 — Reejecutar el arnés de comportamiento del Change 03. **Verificación:** 16/16 comprobaciones en verde.  **Ejecutado: 16/16.**
- [x] 3.4 T-09 — Comprobar que a 1280 px la tabla entra holgadamente y no hay barra de desplazamiento. **Verificación:** el contenedor de la tabla no desborda a 1280 px.

## 4. Cierre

- [x] 4.1 T-10 — Marcar las tareas con su estado real y registrar los desvíos. **Verificación:** cada tarea tiene su estado; las no ejecutadas siguen sin marcar.
- [x] 4.2 T-11 — Actualizar el campo `Estado` del SPEC y del PLAN, y archivar el change. **Verificación:** los documentos reflejan que el change está implementado, verificado y archivado.
