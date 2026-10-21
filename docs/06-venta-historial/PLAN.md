# PLAN — Change 06: Venta simulada e historial

| Campo | Valor |
|---|---|
| Change | 06 — Venta simulada e historial (Ejercicio 5 · 20 puntos) |
| Fase | PLAN (Fase 2) |
| Versión | v1 |
| Estado | **Implementado y verificado** el 20/10/2026 — 37 de 37 tareas cerradas. Comprobaciones ejecutadas: **37** del modelo y la regla de la cantidad (Node), **22** escenarios de la vista Ventas y **13** de la vista Historial (arnés headless sobre Chromium 152), **9** comprobaciones con `file://` en Edge 155.0.4283.62, **6** de regresión de las otras tres vistas (30 de libros, 18 de clientes y 6 del catálogo), **13** de restricciones técnicas, **7** de hashes y **3** de integridad de la semilla. **Ningún control quedó pendiente de ejecución.** El cruce entre páginas queda **pendiente para el Ejercicio 6**, declarado y no aprobado |
| Fecha | 20/10/2026 |
| Especificación | `docs/06-venta-historial/SPEC.md` v1 — **aprobada el 20/10/2026** |
| Entrega | `js/ventas.js` y `js/historial.js` nuevos; `js/datos.js`, `js/validaciones.js` y `js/inicio.js` modificados; `ventas.html` y `historial.html` modificados. `js/catalogo.js`, `js/altas.js`, `index.html`, `libros.html`, `clientes.html`, `css/estilos.css` y la semilla **sin cambios** |
| Change de OpenSpec | `openspec/changes/06-venta-historial/` (esquema `spec-driven`) — `openspec validate --strict` sin observaciones |
| Fuentes | `docs/Consigna Primer Parcial.pdf` p. 4 (Ejercicio 5), p. 5 (casos manuales) y p. 6 (criterios) |

---

## 1. Estrategia de ejecución

El trabajo se ordena por capas, y **cada capa se comprueba sola antes de pasar a la siguiente**:

1. **Modelo** → **regla pura** → **composición** → **cálculos** → **render** → **confirmación** → **eventos** → **historial** → **marcado** → **verificación**.
2. El HTML **no se toca hasta el grupo 8**: mientras tanto, la vista Ventas sigue inerte y el Historial sigue vacío, y ambos siguen siendo legibles.
3. Cada tarea se cierra con una comprobación concreta. Las comprobaciones que no se puedan ejecutar **no se marcan como aprobadas**.
4. El plan **no exige cambiar la especificación**. Si al implementar aparece una contradicción, se consulta antes de continuar (SPEC § 9.4 y § 7).

### Verificaciones disponibles y dónde viven

| Verificación | Ubicación | Entrega |
|---|---|---|
| Modelo de datos y regla de la cantidad | Script Node, `%TEMP%\opencode\arnes05\verify_ventas.js` | No |
| Comportamiento en navegador | Arnés headless (Chromium/Edge) sobre una **copia** del proyecto en `%TEMP%` | No |
| Apertura directa con `file://` | Edge 155.0.4283.62, con el conductor por protocolo DevTools | No |
| Restricciones técnicas | Búsquedas de patrones sobre los archivos del proyecto | No |
| Regresión de las otras vistas | Los guiones de los changes 03 y 05, corridos sobre las mismas vistas | No |

Ninguna de estas herramientas forma parte de la entrega: el parcial se entrega como HTML, CSS, JavaScript y la imagen.

---

## 2. Checklist de tareas

### Fase 1 — Preparación

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-01** | Quedan anotados los hashes de los siete archivos que no deben cambiar | — | — | — | Siete hashes SHA-256 anotados |
| **T-02** | Arnés headless y script Node disponibles | — | `%TEMP%\opencode\arnes05\` | T-01 | El arnés devuelve el número de ventas del historial; el script Node termina con 0 fallos |

### Fase 2 — Modelo de datos

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-03** | `obtenerVentas()` devuelve las ventas del estado vivo | R-01 | `js/datos.js` | T-01 | Devuelve 2 ventas de la semilla; la primera es `vt-2026-0001` |
| **T-04** | `generarIdVenta(fecha)` arma `vt-YYYY-NNNN` correlativo por año | R-01 | `js/datos.js` | T-03 | `vt-2026-0003`; tras registrar una, `vt-2026-0004`; un año nuevo arranca en `vt-2027-0001` |
| **T-05** | `agregarVenta(datos)` registra la venta con la forma de la semilla | R-01, R-03 | `js/datos.js` | T-03, T-04 | La venta tiene `{ id, fecha, clienteId, clienteNombre, renglones, total }`; el renglón no tiene subtotal; el total es la suma de los subtotales |
| **T-06** | Script Node que ejercita el modelo ampliado | R-01, R-03 | `%TEMP%\opencode\arnes05\verify_ventas.js` | T-03, T-04, T-05 | Corre con Node y termina con 0 fallos, informando el número de comprobaciones |

### Fase 3 — Regla de la cantidad

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-07** | `leerCantidad(texto)` devuelve el entero o `null` | R-03 | `js/validaciones.js` | T-06 | «2» y « 2 » → 2; «0», «-2», «1.5», «abc» y «» → `null` |
| **T-08** | El script Node cubre la regla | R-03 | `%TEMP%\opencode\arnes05\verify_ventas.js` | T-07 | Corre con Node y termina con 0 fallos |

### Fase 4 — Composición de la venta

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-09** | `js/ventas.js` existe con el estado de la venta en curso | R-01 | `js/ventas.js` | T-07 | La venta en curso arranca vacía y el resumen muestra el estado vacío |
| **T-10** | `agregarRenglon()` suma la cantidad al renglón existente y avisa | R-03 | `js/ventas.js` | T-09 | Agregar dos veces el mismo libro deja **un** renglón con la cantidad sumada y un aviso visible |
| **T-11** | `cambiarCantidad()` y `quitarRenglon()` | R-03 | `js/ventas.js` | T-10 | Cambiar la cantidad actualiza el renglón; quitarlo lo saca de la tabla |
| **T-12** | `recalcular()` calcula subtotales y total, excluyendo los renglones inválidos | R-02, R-04 | `js/ventas.js` | T-11 | Con 2 × 1500 y 1 × 2000: subtotales 3000 y 2000, total 5000 |
| **T-13** | `pintarFilaRenglon()` construye la fila con la cantidad editable y la acción de quitar | R-02, R-03 | `js/ventas.js` | T-12 | La fila tiene 5 celdas; la de Cantidad contiene un `input` y la de Acciones un botón |
| **T-14** | `pintarResumen()` dibuja la tabla y el total, y alterna el estado vacío | R-02, R-04 | `js/ventas.js` | T-13 | Con dos renglones: dos filas, `#venta-total` con dos decimales y `#venta-estado-vacio` oculto |

### Fase 5 — Confirmación

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-15** | `validarComposicion()` rechaza sin cliente, sin renglones o con cantidades inválidas | R-03 | `js/ventas.js` | T-14 | Los tres casos devuelven un motivo; una venta válida devuelve `null` |
| **T-16** | `alConfirmarVenta()` previene el envío, valida, registra con el precio congelado, limpia y avisa | R-01, R-03, R-04 | `js/ventas.js` | T-15 | Tras una confirmación válida hay una venta más, el renglón guardado tiene el precio del momento, el formulario quedó limpio y el mensaje está visible |
| **T-17** | La fecha de la venta es la local, en `YYYY-MM-DD` | R-01 | `js/ventas.js` | T-16 | La fecha registrada es la del día local de la confirmación |

### Fase 6 — Eventos de la venta

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-18** | `alAgregarRenglon()` lee libro y cantidad, valida y agrega | R-01, R-03 | `js/ventas.js` | T-14, T-16 | Agregar con una cantidad inválida no crea el renglón y muestra el motivo |
| **T-19** | `alCambiarCantidad()` y `alQuitarRenglon()` recalculan y repintan | R-03, R-04 | `js/ventas.js` | T-18 | Editar la cantidad recalcula el subtotal y el total en el momento |
| **T-20** | `js/inicio.js` registra el `submit` y los eventos, y llama al render | R-01, R-05 | `js/inicio.js` | T-19 | La vista Ventas abre sin un error en la consola y el resumen aparece vacío |

### Fase 7 — Vista del historial

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-21** | `renderizarHistorial()` dibuja las ventas y alterna el estado vacío | R-02 | `js/historial.js` | T-20 | 2 filas de la semilla y `#historial-estado-vacio` oculto |
| **T-22** | `mostrarDetalle()` y `cerrarDetalle()` muestran y ocultan el bloque, vaciando sus campos | R-02 | `js/historial.js` | T-21 | Antes de pedir un detalle el bloque está oculto y sus `<dd>` vacíos; tras cerrarlo, vuelve a ese estado |
| **T-23** | `alVerDetalle()` y el registro de los clics | R-02 | `js/historial.js`, `js/inicio.js` | T-22 | Pedir el detalle muestra los cuatro datos y la tabla de renglones |

### Fase 8 — Integración en el marcado

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-24** | `ventas.html` con `novalidate` y los scripts en orden | R-05 | `ventas.html` | T-23 | El formulario tiene `novalidate`; los `<script>` en el orden del SPEC § 5.8 |
| **T-25** | `historial.html` con los scripts en orden | R-05 | `historial.html` | T-23 | Los `<script>` en el orden del SPEC § 5.8 |
| **T-26** | Ningún `id`, clase ni texto visible del HTML se modificó | R-06 | los 5 HTML | T-24, T-25 | Comparación línea por línea con la versión previa: solo las diferencias esperadas, justificadas |
| **T-27** | No hace falta tocar el CSS ni `js/altas.js` | R-06 | — | T-26 | Los hashes de `css/estilos.css` y `js/altas.js` siguen iguales |

### Fase 9 — Verificación integral

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-28** | Los 32 escenarios del SPEC están ejecutados | R-01 a R-06 | — | T-27 | Tabla de 32 escenarios, cada uno aprobado, fallido o pendiente; ninguno no ejecutado aprobado |
| **T-29** | El caso de la consigna con datos de prueba | R-01, R-02, R-04 | `%TEMP%\opencode\arnes05\` | T-28 | Con 2 × 1500 y 1 × 2000: subtotales 3000,00 y 2000,00, total 5000,00, y la venta en el historial con su detalle |
| **T-30** | El precio histórico sobrevive al cambio del catálogo | R-03, R-04 | — | T-28 | Tras cambiar el precio del libro, el precio unitario, los subtotales y el total del historial son los mismos |
| **T-31** | Funciona con `file://` y sin recargar | R-05 | — | T-28 | Registro de la apertura de `ventas.html` y `historial.html` con `file://`, de un alta completa y de la URL sin cambios |
| **T-32** | Los casos manuales de la consigna están registrados | R-01, R-03 | — | T-28 | Cada caso con su resultado observado; la parte del cruce entre páginas **pendiente para el Ejercicio 6**, con su motivo, y no como aprobada |

### Fase 10 — Restricciones y regresión

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-33** | Se cumplen las restricciones técnicas | R-05, R-06 | — | T-32 | Búsquedas de `fetch(`, `localStorage`, `sessionStorage`, `innerHTML`, `on*=`, `http://` → 0 coincidencias; ningún archivo ajeno al proyecto |
| **T-34** | Los siete archivos de T-01 no cambiaron | R-05 | — | T-32 | Los hashes SHA-256 coinciden |
| **T-35** | La semilla no se muta | R-01 | — | T-32 | El JSON de `DATOS_INICIALES` antes y después de una sesión con ventas es idéntico |
| **T-36** | Las otras vistas siguen funcionando | R-05 | — | T-32 | Los guiones de los changes 03 y 05 corren sobre el catálogo y las altas: todos pasan |

### Fase 11 — Cierre

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-37** | Los desvíos quedan documentados | R-06 | `design.md` | T-33 a T-36 | Sección «Desvíos de la implementación» con la razón de cada diferencia, o la constancia de que no hubo desvíos |
| **T-38** | El `Estado` del SPEC y del PLAN refleja la realidad | — | `docs/06-venta-historial/SPEC.md`, `PLAN.md` | T-37 | Ambos declaran el estado real y ninguna comprobación no ejecutada aparece como aprobada |
| **T-39** | El change queda archivado y la spec sincronizada | — | `openspec/` | T-38 | `openspec archive` informa las specs actualizadas; `openspec list` no muestra changes activos; `openspec list --specs` incluye `ventas-e-historial` |

---

## 3. Orden y paralelismo

```
T-01 --> T-02
          |
          +--> T-03 --> T-04 --> T-05 --> T-06 --> T-07 --> T-08
                                    |                        |
                                    +------> T-09 <----------+
                                           |
                                           v
                                      T-10 --> T-11 --> T-12 --> T-13 --> T-14
                                                                        |
                                                                        v
                                                                   T-15 --> T-16 --> T-17
                                                                        |
                                                                        v
                                           T-09 <--------------------- T-18 --> T-19 --> T-20
                                                                            |
                                                                            v
                                                                           T-21 --> T-22 --> T-23
                                                                            |
                                                                            v
                                                            T-24, T-25 --> T-26 --> T-27
                                                                            |
                                                                            v
                                                            T-28 --> T-29, T-30, T-31, T-32
                                                                            |
                                                                            v
                                                            T-33, T-34, T-35, T-36 --> T-37 --> T-38 --> T-39
```

- T-01 y T-02 pueden ejecutarse en cualquier momento; no dependen de nada.
- T-24 y T-25 son paralelizables entre sí, y T-29 a T-32 también, una vez hecho T-28.
- T-33 a T-36 son paralelizables entre sí.

---

## 4. Riesgos del plan

| Riesgo | Tarea afectada | Mitigación |
|---|---|---|
| Que la validación nativa del navegador cancele el envío de una cantidad decimal | T-24 | `novalidate` en el formulario (design D-G), verificado en Chromium 152 |
| Que el historial vuelva a leer el precio del catálogo | T-21, T-30 | El renglón congelado guarda su `precioUnitario` y el subtotal se deriva de los valores guardados (design D-E) |
| Que un identificador de venta se repita | T-04 | Se toma el máximo existente del año, no la cantidad de ventas (design D-H) |
| Que la fecha de la venta se corra un día | T-17 | Se usa la fecha local, nunca UTC (design D-I) |
| Que el `<input>` de la celda quede desproporcionado | T-13 | Nace fuera de `.campo`, así que no recibe los estilos de los campos de formulario (design D-F) |
| Que agregar `<script>` a `historial.html` rompa la vista | T-25, T-31 | Se verifica con `file://` en Edge |
| Que el caso de 1500 y 2000 no se pueda reproducir con la semilla | T-29 | Se ejecuta con datos de prueba en la copia de verificación, tal como la consigna prescribe (SPEC § 2.4) |
| Que la venta en curso y las ventas confirmadas se pierdan al recargar | T-31, T-32 | Comportamiento declarado y verificado, no una omisión (design D-M) |

---

## 5. Fuera de este plan

- Persistencia con `localStorage`, el README y el registro de casos manuales (Ejercicio 6).
- Gestión de stock, cobros y facturación fiscal.
- Editar o eliminar ventas confirmadas.
- Cualquier pantalla para editar precios.
- Altas, bajas y modificaciones de libros, clientes, editoriales, géneros o autores.
- Validar existencias de stock.
- Marcar visualmente el renglón inválido con una clase nueva.
- Cualquier modificación de `css/estilos.css`, de `js/catalogo.js`, de `js/altas.js`, de `index.html`, de `libros.html`, de `clientes.html` o de la semilla `DATOS_INICIALES`.

---

## 6. Resultado de las comprobaciones

Todas las comprobaciones se ejecutaron. Ninguna quedó pendiente.

### 6.1 Modelo de datos y regla de la cantidad — Node (`%TEMP%\opencode\arnes05\verify_ventas.js`)

**37 comprobaciones, 0 fallos.** Cubren `obtenerVentas()`, `generarIdVenta()` (la primera nueva es `vt-2026-0003`, la siguiente `vt-2026-0004`, y un año nuevo reinicia en `vt-2027-0001`), `calcularSubtotal()` y `calcularTotal()` con el redondeo a dos decimales, `agregarVenta()` (la forma de la venta, el renglón **sin** subtotal, el total como suma), el precio histórico frente a un cambio del catálogo, que la semilla no se muta, y `leerCantidad()` con sus nueve casos.

### 6.2 Comportamiento en navegador — arnés headless (Chromium 152)

| Vista | Comprobaciones | Resultado |
|---|---|---|
| Ventas | 22 | **22/22** — S-01 a S-18, S-30, S-32, y los dos casos de la consigna |
| Historial | 13 | **13/13** — S-19 a S-25, S-26, S-27 y S-28 |

**Lo que la batería confirmó por primera vez:**

- El libro repetido **no** crea un segundo renglón: el existente suma y el mensaje lo dice.
- Una cantidad inválida muestra «—» en el subtotal, **queda fuera del total** y bloquea la confirmación nombrando el renglón.
- El formulario **conserva lo escrito** tras un rechazo, y el renglón sobrevive.
- El bloque de detalle del historial está oculto **y con sus `<dd>` vacíos** antes de pedirlo, y vuelve a ese estado al cerrarlo.
- El historial **no ofrece** ninguna acción de editar o eliminar: solo la de consultar el detalle.
- El historial **no sigue al catálogo**: cambiar el precio de los libros deja el historial intacto.

### 6.3 Apertura directa con `file://` — Edge 155.0.4283.62

| Comprobación | Resultado |
|---|---|
| `ventas.html` se dibuja | 5 opciones de cliente, 10 de libro, el estado vacío visible, total «$ 0,00» |
| Alta de un renglón | Una fila y el total «$ 43.800,00» |
| Confirmación | La venta `vt-2026-0003`, con fecha `2026-10-20` y total 43800; el formulario quedó limpio; la página **no** se recargó y la URL no cambió |
| `historial.html` se dibuja | 2 ventas, la más reciente primero; el detalle oculto y vacío |
| Consultar el detalle | Se muestran los cuatro datos y los 2 renglones de la venta |
| Cerrar el detalle | Se oculta y sus campos quedan vacíos |
| El cruce entre páginas | `ventas.html` quedó con 3 ventas y `historial.html` con 2: el estado no se persiste entre documentos. Es el límite declarado (P-02) |

### 6.4 Los casos manuales de la consigna

| Caso | Resultado observado |
|---|---|
| «Venta sin cliente, cantidad cero, negativa o decimal; libro repetido» | **Rechazada**, con el motivo junto al formulario. El duplicado **no crea otro renglón**: el existente suma la cantidad y el mensaje lo informa. Se verificó en los tres rechazos y en el caso del duplicado |
| «Venta válida: dos unidades a 1500 y una a 2000» | Con **datos de prueba** (§ 2.4 del SPEC): subtotales «$ 3.000,00» y «$ 2.000,00», total «$ 5.000,00», y la venta queda registrada con su detalle. La venta recién confirmada **no** aparece en el historial de la otra vista, porque el estado no se persiste entre páginas: el caso se registra con su resultado en el README del Ejercicio 6, con la persistencia funcionando |

### 6.5 Restricciones, regresión e integridad

| Comprobación | Resultado |
|---|---|
| `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` | 0 coincidencias en todo el proyecto |
| `localStorage`, `sessionStorage`, `fetch(`, `http://`, `https://`, `@import` | 0 coincidencias |
| Manejadores `on*`, atributos `style=`, bloques `<style>` | 0 coincidencias |
| Controles con `required`, `pattern`, `min`, `max` o `step` | 0 coincidencias |
| Hashes de `index.html`, `libros.html`, `clientes.html`, `css/estilos.css`, `js/catalogo.js`, `js/altas.js` y `js/datos-iniciales.js` | **7/7 idénticos** a los del inicio del change |
| `DATOS_INICIALES` después de una sesión con ventas | Idéntico byte a byte |
| Regresión de las otras vistas | Libros **30/30**, clientes **18/18**, catálogo **6/6** (9 filas; `cien` → 1, `CIEN` → 1, `  años  ` → 1, vacío → 9, `zzz` → 0 con el mensaje) |
| Consola del navegador | 0 mensajes en las cinco vistas |

### 6.6 Revisión visual

Capturas a 1280 px y a 320 px de las dos vistas, con la venta en curso y con un rechazo. Los `<input>` de cantidad quedan con un tamaño razonable —no reciben el ancho completo de los campos de formulario, porque nacen dentro de una celda y fuera de `.campo`— y la tabla se desplaza horizontalmente a 320 px sin arrastrar la página. **Sin defectos.** La revisión visual del Change 05 había encontrado uno que ninguna comprobación automática detectaba, por eso el arnés ahora la incluye.

### 6.7 Auditoría de conformidad con la spec archivada

Después del archivado se recorrió **escenario por escenario** la spec `ventas-e-historial` (13 requisitos, 39 escenarios) y se confrontó cada uno con la implementación real. La primera batería de la implementación cubría 30 escenarios; los 9 restantes se cerraron con una segunda tanda.

| Requisito | Escenarios | Verificados en | Resultado |
|---|---|---|---|
| Composición de una venta | 3 | arnés (Ventas) | 3/3 |
| El resumen muestra los importes | 4 | arnés (Ventas) | 4/4 |
| Los renglones se pueden modificar | 5 | arnés (Ventas) | 5/5 |
| Un libro repetido no crea un segundo renglón | 2 | arnés (Ventas) | 2/2 |
| La confirmación exige una venta válida | 4 | arnés (Ventas) | 4/4 |
| La venta conserva el precio histórico | 3 | arnés (Ventas e Historial) | 3/3 |
| Identificador y fecha propios | 3 | arnés (Node) y `file://` | 3/3 |
| Tras confirmar el formulario queda limpio | 2 | arnés (Ventas) | 2/2 |
| El historial lista las ventas registradas | 4 | arnés (Historial) | 4/4 |
| El detalle permanece oculto hasta que se solicita | 3 | arnés (Historial) | 3/3 |
| Las ventas confirmadas no se editan ni se eliminan | 2 | arnés (Historial) | 2/2 |
| El envío se controla sin recargar la página | 2 | arnés (Ventas) y `file://` | 2/2 |
| Los datos escritos se insertan como texto | 2 | arnés (Historial) | 2/2 |
| **Total** | **39** | | **39/39** |

**Escenarios que la primera tanda no cubría y se cerraron después:**

- «Agregar un renglón sin haber elegido cliente»: se permite; el cliente se valida al confirmar.
- «Quitar el último renglón»: la tabla queda vacía y vuelve el estado vacío.
- «Volver a una cantidad válida»: la fila recupera su subtotal y el total.
- «Agregar dos veces el mismo libro con la misma cantidad»: queda **un** renglón con el doble.
- «Confirmar con una cantidad cero, negativa o decimal»: ninguno de los tres registra la venta.
- «El subtotal se deriva de lo guardado»: sigue siendo el de la venta, no el del catálogo.
- «Una venta recién confirmada en el historial»: el historial lista la venta registrada en su estado, con su identificador, su fecha, su cliente y su total.
- «El historial de otra vista no muestra la venta recién confirmada»: con `file://`, `ventas.html` queda con 3 ventas y `historial.html` con 2.

### 6.8 Lo que queda pendiente

| ID | Qué | Por qué |
|---|---|---|
| P-01 | Ver la venta recién confirmada en el **historial de otra vista** | El estado vive en el documento y no cruza de páginas. Sin `localStorage` —reservado al Ejercicio 6— no hay canal. La mecánica está: `estado` es la única fuente de verdad y `iniciarDatos()` el único punto que lo siembra, de modo que el Ejercicio 6 solo cambia la fuente y las vistas no se tocan |

---

> **Estado:** este PLAN se ejecutó por completo el 20/10/2026. Los 39 puntos del checklist están cerrados, los resultados de las comprobaciones están en § 6 y los desvíos de la implementación, en «Desvíos de la implementación» de `design.md`. El change de OpenSpec `06-venta-historial` queda listo para archivarse.

