# PLAN — Change 04: Legibilidad de la tabla del catálogo a 320 px

| Campo | Valor |
|---|---|
| Change | 04 — Legibilidad de la tabla del catálogo a 320 px |
| Fase | PLAN (Fase 2) |
| Versión | v1 |
| Estado | **Ejecutado y archivado** el 20/10/2026 — 11 de 11 tareas cerradas y verificadas |
| Especificación | `docs/04-legibilidad-tabla-320/SPEC.md` v1 |
| Entrega | 2 reglas en `css/estilos.css` + el marcado de dos celdas en `js/catalogo.js` |

---

## 1. Tareas

| # | Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|---|
| 1 | T-01 | `.tabla` declara un ancho mínimo suficiente para sus columnas | R-01 | `css/estilos.css` | — | La tabla del catálogo mide 760 px a 320 px de viewport |
| 2 | T-02 | La clase `celda-atomica` impide partir los valores atómicos | R-02 | `css/estilos.css` | T-01 | ISBN e importe ocupan 1 línea en la medición |
| 3 | T-03 | `overflow-wrap: anywhere` sigue presente | R-05 | `css/estilos.css` | T-01 | La regla está en la hoja de estilos |
| 4 | T-04 | Las celdas de ISBN e importe se marcan al crear la fila | R-02 | `js/catalogo.js` | T-02 | La primera fila tiene 2 celdas con `celda-atomica` |
| 5 | T-05 | Ninguna otra celda queda marcada | R-02 | `js/catalogo.js` | T-04 | Las celdas de título, editorial, género y autores no llevan la clase |
| 6 | T-06 | Se miden las líneas de cada celda a 320 px | R-02, R-03 | arnés de medición | T-05 | ISBN e importe en 1 línea; ninguna palabra partida a la mitad |
| 7 | T-07 | Regresión del Change 02 | R-04 | arnés existente | T-06 | 157/157 comprobaciones |
| 8 | T-08 | Regresión del Change 03 | R-04 | arnés existente | T-06 | 16/16 comprobaciones |
| 9 | T-09 | A 1280 px la tabla entra holgadamente | R-01 | arnés existente | T-06 | El contenedor de la tabla no desborda a 1280 px |
| 10 | T-10 | Tareas y desvíos registrados | — | `tasks.md`, `design.md` | T-09 | Cada tarea con su estado; los desvíos documentados |
| 11 | T-11 | `Estado` actualizado y change archivado | — | `docs/04-*`, `openspec/` | T-10 | Los documentos reflejan el estado real; `openspec list` sin changes activos |

## 2. Orden

```
T-01 → T-02 → T-03
              ↓
            T-04 → T-05 → T-06 → T-07, T-08, T-09 → T-10 → T-11
```

## 3. Verificación ejecutada

| Arnés | Resultado |
|---|---|
| Medición de celdas a 320 px | ISBN e importe en 1 línea; 0 palabras partidas a la mitad |
| Regresión del Change 02 | 157/157 |
| Regresión del Change 03 | 16/16 |
| Restricciones y regresión de archivos | TODO OK |
| Datos del modelo (Node) | 36/36 |

## 4. Desvíos

Ninguno respecto de este plan.

**Ajuste de línea base:** la regresión de archivos del Change 03 comparaba el hash de `css/estilos.css` contra el valor previo a este change; se re-tomó la línea base porque el cambio de estilo es el objeto de este change. El arnés del Change 02 prohibía cualquier `<script>` en el HTML: se ajustó para admitir los scripts propios del proyecto y seguir prohibiendo los manejadores en línea y los scripts ajenos.

## 5. Fuera de este plan

- Aplicar `celda-atomica` a las tablas de las otras cuatro vistas: se renderizan en los Ejercicios 4 y 5.
- Modo oscuro, estilos de impresión y cualquier otro ajuste visual.
