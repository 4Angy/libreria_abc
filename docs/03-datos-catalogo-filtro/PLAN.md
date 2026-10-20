# PLAN — Change 03: Datos locales, catálogo y filtro

| Campo | Valor |
|---|---|
| Change | 03 — Datos locales, catálogo y filtro (Ejercicio 3 · 15 puntos) |
| Fase | PLAN (Fase 2) |
| Versión | v1 |
| Estado | **Ejecutado y archivado** el 20/10/2026 — 27 de 27 tareas cerradas; 16/16 comprobaciones de comportamiento en navegador, 36/36 de datos, 18/18 de restricciones y regresión, y 14/14 del recorrido con teclado (T-23) |
| Registro | El change de OpenSpec se registró **antes** de la implementación, con los cuatro artefactos (proposal, specs, design, tasks) revisados junto con este PLAN. La implementación se desvió del plan en 3 puntos, documentados en la sección «Desvíos de la implementación» de `design.md`. |
| Fecha | 20/10/2026 |
| Especificación | `docs/03-datos-catalogo-filtro/SPEC.md` v2 — aprobada el 20/10/2026 |
| Entrega | `js/datos-iniciales.js`, `js/datos.js`, `js/catalogo.js`, `js/inicio.js` + los `<script>` en `index.html` |
| Change de OpenSpec | `openspec/changes/03-datos-catalogo-filtro/` (esquema `spec-driven`) |
| Fuentes | `docs/Consigna Primer Parcial.pdf` p. 3 (Ejercicio 3) y p. 6 (criterios y caso manual) |

---

## 1. Estrategia de ejecución

El trabajo se ordena por capas para que cada tarea se pueda comprobar sola:

1. **Datos** → **modelo** → **render** → **filtro** → **eventos** → **integración** → **verificación**.
2. El HTML **no se toca hasta el final**: mientras tanto, el `<tbody>` sigue vacío y la página sigue siendo legible (degradación elegante, ya prevista en el SPEC).
3. Cada tarea se cierra con una comprobación concreta. Las comprobaciones que no se puedan ejecutar (las manuales de la persona usuaria) **no se marcan como aprobadas**.
4. El plan **no exige cambiar la especificación**. Si al implementar aparece una contradicción, se consulta antes de continuar (SPEC §9.4 y §7).

### Verificaciones disponibles y dónde viven

| Verificación | Ubicación | Entrega |
|---|---|---|
| Datos del modelo | Script Node, `%TEMP%\opencode\verify_datos.js` | No |
| Comportamiento en navegador | Arnés headless (Edge) sobre una **copia** del proyecto en `%TEMP%` | No |
| Restricciones técnicas | Búsquedas de patrones sobre los archivos del proyecto | No |
| Regresión de las otras vistas | Comparación de hashes de los cuatro HTML | No |

Ninguna de estas herramientas forma parte de la entrega: el parcial se entrega como HTML, CSS, JavaScript y la imagen.

---

## 2. Checklist de tareas

### Fase 1 — Preparación

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-01** | La semilla queda en `js/datos-iniciales.js` y fuera de la raíz | D-03 | `datos-iniciales.js` → `js/datos-iniciales.js` | — | El archivo existe en `js/` y no queda en la raíz; el contenido no cambia salvo el comentario de cabecera |
| **T-02** | Script de verificación de datos ejecutable | R-03 | `%TEMP%\opencode\verify_datos.js` | T-01 | Corre con Node y termina con 0 fallos, informando el número de comprobaciones |

### Fase 2 — Modelo de datos

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-03** | El estado vivo es una copia de la semilla y la semilla no se muta | R-02, R-03 | `js/datos.js` | T-01 | Comparar el JSON de `DATOS_INICIALES` antes y después de la ejecución: idéntico |
| **T-04** | Las consultas del modelo devuelven lo que el renderizado necesita, con valor por defecto legible | R-03 | `js/datos.js` | T-03 | Consultar desde el arnés: editorial de un libro, género de un libro sin género, autores de un libro con dos autores |
| **T-05** | Los nombres de las funciones y variables son descriptivos y en español | R-06 | `js/datos.js` | T-04 | Revisión: sin nombres de una letra ni abreviaturas |

### Fase 3 — Renderizado

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-06** | `crearFilaLibro()` construye una fila con las 6 celdas del `<thead>` | R-02 | `js/catalogo.js` | T-04 | La fila tiene 6 celdas de texto con el orden del `<thead>` |
| **T-07** | Los datos se insertan como texto, nunca como HTML | R-04 | `js/catalogo.js` | T-06 | Búsqueda de `innerHTML` en todo el proyecto → 0 coincidencias; un título con `<b>` se muestra literal (S-09) |
| **T-08** | `pintarCatalogo()` vacía el `<tbody>` y dibuja una fila por libro | R-02 | `js/catalogo.js` | T-07 | Conteo de filas = 9 tras pintar el catálogo completo (S-01) |
| **T-09** | Los dos estados se alternan con el atributo `hidden` | R-03 | `js/catalogo.js` | T-08 | En cada situación, exactamente un estado visible y el otro oculto (E-09) |

### Fase 4 — Filtro

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-10** | `normalizarConsulta()` recorta los extremos y pasa a minúsculas | R-01 | `js/catalogo.js` | T-09 | Casos: `"  AÑOS  "` → `"años"`; `""` → `""`; `"   "` → `""` (E-01, E-05) |
| **T-11** | `filtrarPorTitulo()` devuelve coincidencias parciales; con la consulta vacía devuelve todo | R-01 | `js/catalogo.js` | T-10 | Conteos: `cien` → 1, `CIEN` → 1, `  años  ` → 1, `""` → 9, `zzz` → 0 (S-03 a S-07) |
| **T-12** | Sin coincidencias, la tabla queda vacía y aparece el mensaje | R-03 | `js/catalogo.js` | T-11 | Caso S-06: 0 filas y `#catalogo-estado-sin-resultados` visible |

### Fase 5 — Arranque y eventos

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-13** | `alCargar()` inicia los datos y pinta el catálogo completo | R-02 | `js/inicio.js` | T-12 | Al abrir `index.html`: 9 filas y ningún mensaje visible (S-01) |
| **T-14** | `alBuscar()` previene el envío, lee la consulta, filtra y repinta | R-01, R-03 | `js/inicio.js` | T-13 | La URL no cambia al buscar y la tabla se actualiza (S-11) |
| **T-15** | Los eventos se registran con `addEventListener` | R-06 | `js/inicio.js` | T-14 | Búsqueda de `on` + `=` en los atributos de los 5 HTML → 0 coincidencias |

### Fase 6 — Integración

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-16** | `index.html` enlaza los 4 scripts con ruta relativa y en orden | R-05 | `index.html` | T-15 | Búsqueda de `<script src=` → 4 coincidencias, en el orden del SPEC §5.5 |
| **T-17** | Las otras cuatro vistas no cambian | R-05 | — | T-16 | Hash SHA-256 de `libros.html`, `clientes.html`, `ventas.html`, `historial.html` idéntico al previo |
| **T-18** | `css/estilos.css` no cambia | R-05 | — | T-16 | Hash SHA-256 idéntico al previo |

### Fase 7 — Verificación

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-19** | Arnés de navegador que ejecuta los escenarios S-01 a S-11 sobre una copia del proyecto | R-01 a R-05 | `%TEMP%\opencode\verify03.py` | T-16 | El arnés corre sobre la copia y su salida registra el estado de cada escenario |
| **T-20** | Los 11 escenarios están ejecutados y con resultado real | R-01 a R-05 | — | T-19 | Tabla de escenarios: cada uno aprobado, fallido o pendiente; ninguno no ejecutado aprobado |
| **T-21** | Las restricciones técnicas se cumplen | R-05, R-06 | — | T-19 | Búsquedas de `fetch(`, `localStorage`, `http://`, `https://`, `innerHTML`, `on*=`, `@import` → 0 coincidencias; ningún archivo `.js` o `.css` ajeno al proyecto |
| **T-22** | El caso manual de la consigna queda preparado | R-01 | — | T-20 | El caso «búsqueda con parte del título en mayúsculas; luego búsqueda vacía y texto inexistente» está ejecutado por el arnés y **queda además como control manual de la persona usuaria** |
| **T-23** | El control manual de la persona usuaria está registrado como pendiente | R-01 | `tasks.md` | T-22 | La tarea figura con estado pendiente y su motivo; nunca como aprobada |

### Fase 8 — Cierre

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-24** | Las tareas quedan marcadas con su estado real | — | `tasks.md` | T-23 | Cada tarea tiene su estado; las no ejecutadas siguen sin marcar |
| **T-25** | Los desvíos de la implementación quedan documentados | R-06 | `design.md` | T-24 | Sección «Desvíos de la implementación» con la razón de cada diferencia |
| **T-26** | El `Estado` del SPEC y del PLAN reflejan la realidad | — | `docs/03-datos-catalogo-filtro/SPEC.md`, `PLAN.md` | T-25 | Ambos documentos dicen «Implementado, verificado y archivado» con la fecha |
| **T-27** | El change queda archivado y la spec sincronizada | — | `openspec/` | T-26 | `openspec archive` informa la spec actualizada; `openspec list` no muestra changes activos |

---

## 3. Orden y paralelismo

```
T-01 → T-02
  └── T-03 → T-04 → T-05
                └── T-06 → T-07 → T-08 → T-09
                              └── T-10 → T-11 → T-12
                                            └── T-13 → T-14 → T-15
                                                          └── T-16 → T-17, T-18
                                                                    └── T-19 → T-20 → T-21
                                                                              └── T-22 → T-23 → T-24 → T-25 → T-26 → T-27
```

- T-17 y T-18 pueden ejecutarse en cualquier momento tras T-16.
- T-02 puede anticiparse: el script de verificación de datos no depende del producto.

## 4. Riesgos del plan

| Riesgo | Tarea afectada | Mitigación |
|---|---|---|
| Filtrar mientras se escribe en vez de al enviar | T-14 | El evento es `submit` (SPEC §9.1, A-06). Si al implementar resulta más usable filtrar en vivo, se consulta antes de cambiarlo |
| Dejar filas de una búsqueda anterior | T-08, T-12 | `replaceChildren()` en cada renderizado; caso S-08 lo comprueba |
| Un `<script>` mal ordenado rompe todo | T-16 | El orden está fijado en el SPEC §5.5 y se comprueba por búsqueda |
| Acoplar el catálogo a la semilla | T-03 | El estado vivo es una copia; la semilla no se muta |
| Que el traslado de `datos-iniciales.js` rompa una ruta | T-01, T-16 | El traslado ocurre antes de enlazar; no hay referencias previas en el HTML |

## 5. Fuera de este plan

- Formularios de alta de libros y clientes (Ejercicio 4).
- Ventas, renglones e historial (Ejercicio 5).
- `localStorage` y el README (Ejercicio 6).
- Cualquier modificación de `css/estilos.css`, de las otras cuatro vistas o de las specs de otras capabilities.
