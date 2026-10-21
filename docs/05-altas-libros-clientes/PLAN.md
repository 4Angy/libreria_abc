# PLAN — Change 05: Alta de libros y clientes

| Campo | Valor |
|---|---|
| Change | 05 — Alta de libros y clientes (Ejercicio 4 · 15 puntos) |
| Fase | PLAN (Fase 2) |
| Versión | v1 |
| Estado | **Implementado, verificado y archivado** el 20/10/2026 (`openspec/changes/archive/2026-10-20-05-altas-libros-clientes/`) — 37 de 37 tareas cerradas. Comprobaciones ejecutadas: **54** de reglas de validación (Node), **35** del modelo de datos (Node), **23** escenarios de la vista Libros y **10** de la vista Clientes (arnés headless sobre Chromium 152), **2** de la vista Ventas y **6** de regresión del catálogo, **4** comprobaciones de `file://` en Edge 155.0.4283.62 (alta de libro, alta de cliente, limpieza del formulario, y renderizado inicial), **10** comprobaciones de las restricciones técnicas, **5** de hashes y **3** de integridad de la semilla. **Ningún control quedó pendiente de ejecución.** El cruce de datos entre páginas queda **pendiente para el Ejercicio 6**, declarado y no aprobado |
| Fecha | 20/10/2026 |
| Especificación | `docs/05-altas-libros-clientes/SPEC.md` v1 — **aprobada el 20/10/2026** |
| Entrega | `js/validaciones.js` y `js/altas.js` nuevos; `js/datos.js`, `js/inicio.js` y `css/estilos.css` modificados; `libros.html`, `clientes.html` y `ventas.html` modificados. `js/catalogo.js`, `index.html` e `historial.html` **sin cambios** |
| Change de OpenSpec | `openspec/changes/05-altas-libros-clientes/` (esquema `spec-driven`) — `openspec validate --strict` sin observaciones |
| Fuentes | `docs/Consigna Primer Parcial.pdf` p. 3 (Ejercicio 4), p. 5 (casos manuales) y p. 6 (criterios) |

---

## 1. Estrategia de ejecución

El trabajo se ordena por capas, y **cada capa se comprueba sola antes de pasar a la siguiente**:

1. **Reglas** → **modelo** → **DOM** → **arranque** → **marcado** → **verificación**.
2. Las reglas y el modelo se comprueban **con Node**, sin navegador: son funciones puras y eso las hace verificables cheaply.
3. El DOM se comprueba **con el arnés**, sobre una copia del proyecto en la que las etiquetas `<script>` están inyectadas. Así los grupos 4 a 6 se pueden verificar antes de que el marcado real cambie.
4. El marcado se toca **al final**, en el grupo 7. Recién entonces el grupo 8 verifica las páginas reales y con `file://`.
5. Cada tarea se cierra con una comprobación concreta. Las comprobaciones que no se puedan ejecutar **no se marcan como aprobadas**.
6. El plan **no exige cambiar la especificación**. Si al implementar aparece una contradicción, se consulta antes de continuar (SPEC § 9.4 y § 7).

### Verificaciones disponibles y dónde viven

| Verificación | Ubicación | Entrega |
|---|---|---|
| Reglas de validación | Script Node, `%TEMP%\opencode\verify_validaciones.js` | No |
| Modelo de datos | Script Node, `%TEMP%\opencode\verify_datos.js` | No |
| Comportamiento en navegador | Arnés headless (Edge) sobre una **copia** del proyecto en `%TEMP%`, con los scripts inyectados | No |
| Restricciones técnicas | Búsquedas de patrones sobre los archivos del proyecto | No |
| Regresión de las otras vistas | Comparación de hashes de los cinco archivos que no deben cambiar | No |

Ninguna de estas herramientas forma parte de la entrega: el parcial se entrega como HTML, CSS, JavaScript y la imagen.

---

## 2. Checklist de tareas

### Fase 1 — Preparación

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-01** | Quedan anotados los hashes de los archivos que no deben cambiar | — | — | — | Cinco hashes SHA-256 anotados |
| **T-02** | Arnés headless que sirve una copia del proyecto con los scripts inyectados | R-05 | `%TEMP%\opencode\arnes05\` | T-01 | El arnés corre y devuelve el número de filas del catálogo |

### Fase 2 — Reglas de validación

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-03** | `normalizarIsbn()` y `normalizarEmail()` quitan lo que hay que quitar | R-03, R-06 | `js/validaciones.js` | — | `" 978-030-7474728 "` → `"9780307474728"`; `"  ANA@Example.COM "` → `"ana@example.com"` |
| **T-04** | `esEmailValido()` aplica la regla estricta | R-03 | `js/validaciones.js` | T-03 | La tabla de 7 entradas del SPEC § 5.5 se resuelve entera |
| **T-05** | `validarLibro()` aplica las diez reglas y arma un mensaje por cada una | R-03 | `js/validaciones.js` | T-03, T-04 | Los 10 rechazos dan `ok: false` con al menos un error; un libro válido da `ok: true` sin errores |
| **T-06** | `validarCliente()` aplica las cuatro reglas | R-03 | `js/validaciones.js` | T-03, T-04 | Los 4 rechazos dan `ok: false`; un cliente válido da `ok: true` |
| **T-07** | Script de Node que ejercita las reglas | R-03, R-06 | `%TEMP%\opencode\verify_validaciones.js` | T-04, T-05, T-06 | Corre con Node y termina con 0 fallos, informando el número de comprobaciones |

### Fase 3 — Modelo de datos

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-08** | Las consultas que faltaban existen y devuelven el conjunto local | R-02 | `js/datos.js` | T-01 | 4 clientes, 7 editoriales, 5 géneros, 10 autores; los autores llegan como `{ id, nombre }` |
| **T-09** | `existeIsbn()` y `existeEmail()` comparan normalizados | R-03 | `js/datos.js` | T-03, T-08 | ISBN existente con guiones → `true`; ISBN nuevo → `false`; email existente en mayúsculas → `true` |
| **T-10** | `generarId()` arma identificadores legibles y únicos | R-03 | `js/datos.js` | T-08 | «Cien años de soledad» → `li-cien-anos-de-soledad`; ante un repetido, `-2`; dos títulos iguales, identificadores distintos |
| **T-11** | `agregarLibro()` y `agregarCliente()` crean el registro y lo incorporan al estado vivo | R-01 | `js/datos.js` | T-08, T-10 | El conjunto crece en un registro, el registro cumple las relaciones y la semilla queda idéntica |
| **T-12** | Script de Node que ejercita el modelo ampliado | R-01, R-03 | `%TEMP%\opencode\verify_datos.js` | T-08, T-09, T-10, T-11 | Corre con Node y termina con 0 fallos |
| **T-13** | Los nombres nuevos son descriptivos y en español | R-06 | `js/datos.js`, `js/validaciones.js` | T-08, T-09, T-10, T-11 | Revisión: sin nombres de una letra ni abreviaturas opacas |

### Fase 4 — Opciones y listados

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-14** | Los selectores de editorial, género y autores se llenan desde el conjunto local, conservando las opciones de texto fijo | R-02 | `js/altas.js` | T-08, T-13, T-02 | En el arnés: 8, 6 y 10 opciones respectivamente, y «Sin clasificar» sigue primera |
| **T-15** | El listado de libros se dibuja con la fila del catálogo, sin duplicar código | R-01 | `js/altas.js` | T-14 | 9 filas de 6 celdas; el mensaje de estado vacío oculto |
| **T-16** | El listado de clientes se dibuja con sus dos celdas | R-01 | `js/altas.js` | T-14 | 4 filas de 2 celdas; el mensaje de estado vacío oculto |
| **T-17** | Los selectores de la vista Ventas se llenan desde el mismo estado local | R-01, R-02 | `js/altas.js` | T-14 | 5 opciones de cliente y 10 de libro, con el precio en la opción de libro |
| **T-18** | Todo se inserta como texto | R-04 | `js/altas.js` | T-14, T-15, T-16, T-17 | Búsqueda de `innerHTML` en `js/` → 0 coincidencias |

### Fase 5 — Formularios de alta

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-19** | Los mensajes se muestran y se ocultan alternando `hidden`, con el motivo detrás de la frase del Change 01 | R-03 | `js/altas.js` | T-14 | Tras un rechazo: error visible con el motivo, éxito oculto. Tras un alta: al revés |
| **T-20** | `alRegistrarLibro()` valida, agrega solo si todo pasa y refresca el listado | R-01, R-03 | `js/altas.js` | T-05, T-11, T-15, T-19 | Libro válido → 10 filas. Libro inválido → 9 filas y el motivo visible |
| **T-21** | `alRegistrarCliente()` valida, agrega solo si todo pasa y refresca el listado | R-01, R-03 | `js/altas.js` | T-06, T-11, T-16, T-19 | Cliente válido → 5 filas. Cliente inválido → 4 filas y el motivo visible |
| **T-22** | El envío no recarga la página y el formulario conserva lo escrito | R-04, R-05 | `js/altas.js` | T-20, T-21 | La URL no cambia; tras un rechazo los valores siguen en el formulario |

### Fase 6 — Arranque

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-23** | `js/inicio.js` detecta la vista y conecta solo lo que existe | R-05 | `js/inicio.js` | T-14, T-15, T-16, T-17, T-20, T-21 | Las cuatro vistas abren sin un solo error en la consola |
| **T-24** | El catálogo sigue funcionando sin cambios | R-05 | — | T-23 | `cien` → 1 fila; `zzz` → 0 filas y el mensaje de sin resultados visible |

### Fase 7 — Integración en el marcado

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-25** | `libros.html` queda con la validación desactivada, el precio como texto, la nota de uso y los seis scripts | R-05, R-06 | `libros.html` | T-23, T-02 | Búsquedas de `novalidate`, `inputmode="decimal"`, `type="text"`; seis `<script>` en el orden del SPEC § 5.3 |
| **T-26** | `clientes.html` queda con la validación desactivada y los seis scripts | R-05 | `clientes.html` | T-23 | Seis `<script>` en el orden del SPEC § 5.3 |
| **T-27** | `ventas.html` queda con los seis scripts | R-05 | `ventas.html` | T-17, T-23 | Seis `<script>` en el orden del SPEC § 5.3 |
| **T-28** | No se tocó ningún `id`, clase ni texto visible ya escrito, salvo lo previsto | R-06 | `libros.html`, `clientes.html`, `ventas.html` | T-25, T-26, T-27 | Comparación línea por línea con la versión previa: solo las tres diferencias esperadas, justificadas |

### Fase 8 — Verificación integral

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-29** | Los 28 escenarios del SPEC están ejecutados, con resultado real | R-01 a R-06 | — | T-28 | Tabla de 28 escenarios, cada uno aprobado, fallido o pendiente; ninguno no ejecutado aprobado |
| **T-30** | Todo funciona con `file://`, sin servidor | R-05 | — | T-29 | Registro de la apertura de `libros.html` y `clientes.html` con `file://` y del alta de un libro y de un cliente |
| **T-31** | Los dos casos manuales de la consigna de este ejercicio quedan registrados | R-01, R-03 | — | T-29 | Cada caso con su resultado observado; la parte que exige ver el libro en el catálogo y en la selección de venta queda **pendiente para el Ejercicio 6**, con su motivo, y no como aprobada |

### Fase 9 — Restricciones y regresión

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-32** | Se cumplen las restricciones técnicas | R-05, R-06 | — | T-29 | Búsquedas de `fetch(`, `localStorage`, `sessionStorage`, `innerHTML`, `on*=`, `http://` → 0 coincidencias; ningún archivo ajeno al proyecto |
| **T-33** | Los cinco archivos que no debían cambiar no cambiaron | R-05 | — | T-01, T-29 | Los hashes SHA-256 de T-01 coinciden |
| **T-34** | El estado vivo y la semilla siguen separados | R-01 | — | T-29 | El JSON de `DATOS_INICIALES` antes y después de una sesión con altas es idéntico |

### Fase 10 — Cierre

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-35** | Los desvíos de la implementación quedan documentados | R-06 | `design.md` | T-30, T-31, T-32, T-33, T-34 | Sección «Desvíos de la implementación» con la razón de cada diferencia, o la constancia de que no hubo desvíos |
| **T-36** | El `Estado` del SPEC y del PLAN refleja la realidad | — | `docs/05-altas-libros-clientes/SPEC.md`, `PLAN.md` | T-35 | Ambos declaran el estado real y ninguna comprobación no ejecutada aparece como aprobada |
| **T-37** | El change queda archivado y la spec sincronizada | — | `openspec/` | T-36 | `openspec archive` informa las specs actualizadas; `openspec list` no muestra changes activos; `openspec list --specs` incluye `altas-libros-clientes` |

---

## 3. Orden y paralelismo

```
T-01, T-02
  |
  +--> T-03 --> T-04 --> T-05, T-06 --> T-07
  |
  +--> T-08 --> T-09, T-10 --> T-11 --> T-12 --> T-13
                   |                  |
                   |                  +--> T-14 --> T-15, T-16, T-17 --> T-18
                   |                                    |
                   |        T-05, T-06, T-11 ------------+--> T-19
                   |                                          |
                   |                              T-15 ------+--> T-20 --> T-21 --> T-22
                   |                              T-16 ---------> T-21
                   |
                   +--> T-14, T-15, T-16, T-17, T-20, T-21 --> T-23 --> T-24
                                                                            |
                        T-25, T-26, T-27 <---------------------------------+
                              |
                              +--> T-28 --> T-29 --> T-30, T-31
                                                |
                                                +--> T-32, T-33, T-34 --> T-35 --> T-36 --> T-37
```

- T-01 y T-02 pueden ejecutarse en cualquier momento; no dependen de nada.
- T-07 y T-12 pueden anticiparse: los scripts de Node no dependen del producto.
- T-05 y T-06 son paralelizables entre sí: dependen de T-03 y T-04, no una de otra.
- T-15, T-16 y T-17 son paralelizables entre sí: dependen de T-14 y no una de otra.
- T-25, T-26 y T-27 son paralelizables entre sí, una vez hecho T-23.

---

## 4. Riesgos del plan

| Riesgo | Tarea afectada | Mitigación |
|---|---|---|
| La validación nativa del navegador cancela el envío y el mensaje propio nunca se ve | T-25, T-26 | `novalidate` en los dos formularios; verificado en Chromium 152 que con `novalidate` el `submit` se dispara (SPEC § 2.4) |
| Un precio con centavos queda bloqueado por el `step` por defecto de `type="number"` | T-25 | El campo pasa a `type="text"` con `inputmode="decimal"`; el formato lo valida la aplicación (D-04) |
| Un precio escrito con separador de miles se convierte en un valor cien veces menor | T-05, T-25 | El formato admitido rechaza el separador de miles y el mensaje declara el formato esperado (D-05) |
| Que el estado vivo se mezcle con la semilla | T-11, T-34 | La aplicación trabaja sobre una copia; la comparación del JSON de la semilla lo comprueba |
| Que `existeIsbn()` duplique la normalización en vez de reutilizarla | T-09 | El modelo llama a `normalizarIsbn()` de `js/validaciones.js`; el grafo de dependencias queda en un solo sentido (design.md, D-E) |
| Que la fila del listado de libros se duplique en vez de reutilizarse | T-15 | `pintarListadoLibros()` llama a `crearFilaLibro()` de `js/catalogo.js`; `js/catalogo.js` no se toca |
| Un `<script>` mal ordenado rompe el arranque | T-25, T-26, T-27 | El orden está fijado en el SPEC § 5.3 y se comprueba por búsqueda |
| Que el selector múltiple de autores no se entienda | T-25 | Se agrega la nota de uso visible acordada en D-03 |
| Que la spec viva `libreria-frontend` quede contradiciendo el código otra vez | T-37 | El delta de este change corrige los tres requisitos afectados, y `openspec validate --strict` pasa |

---

## 5. Fuera de este plan

- Persistencia con `localStorage`, el README y el registro de casos manuales (Ejercicio 6).
- Renglones, subtotales, total, confirmación de la venta e historial (Ejercicio 5).
- Edición y eliminación de registros.
- Altas, bajas y modificaciones de editoriales, géneros o autores.
- El dígito de control del ISBN, y la validación de su formato y su longitud.
- La marca visual del campo inválido (`.campo--error`, `aria-invalid`).
- Cualquier modificación de `index.html`, de `historial.html` o de `js/catalogo.js`.

---

## 6. Resultado de las comprobaciones

Todas las comprobaciones se ejecutaron. Ninguna quedó pendiente.

### 6.1 Reglas de validación — Node (`%TEMP%\opencode\arnes05\verify_validaciones.js`)

**54 comprobaciones, 0 fallos.** Cubren la normalización de ISBN y de email, la tabla completa de emails válidos e inválidos, el análisis del precio (entero, decimales con punto y con coma, cero, negativo, separador de miles, tres decimales, texto) y las diez reglas del alta de libro y las cuatro del alta de cliente, con el caso de que se informen todos los motivos a la vez.

### 6.2 Modelo de datos — Node (`%TEMP%\opencode\arnes05\verify_datos.js`)

**35 comprobaciones, 0 fallos.** Cubren el estado inicial (9 libros, 4 clientes, 7 editoriales, 5 géneros, 10 autores), las consultas nuevas, el contexto de las altas, los identificadores (slug sin tildes, prefijo, sufijo numérico ante un repetido, reserva cuando el texto no tiene letras), las comparaciones de ISBN y email, el alta de libros y de clientes, y que la semilla `DATOS_INICIALES` quede idéntica.

### 6.3 Comportamiento en navegador — arnés headless (Chromium 152) sobre una copia del proyecto

| Vista | Comprobaciones | Resultado |
|---|---|---|
| Libros | 23 | **23/23** — S-03, S-09 a S-13, S-14 a S-22, S-23, S-24, S-25, S-26, y E-12 |
| Clientes | 10 | **10/10** — S-04, los cuatro rechazos de cliente, el duplicado en mayúsculas, dos clientes con el mismo nombre, el nombre con marcado y la falta de recarga |
| Ventas | 2 | **2/2** — 5 opciones de cliente y 10 de libro, con el precio en cada opción |
| Catálogo (regresión) | 6 | **6/6** — 9 filas; `cien` → 1, `CIEN` → 1, `  años  ` → 1, vacío → 9, `zzz` → 0 con el mensaje visible |

Consola del navegador: **0 mensajes** en las cuatro vistas.

### 6.4 Apertura directa con `file://` — Edge 155.0.4283.62

| Comprobación | Resultado |
|---|---|
| `libros.html` se dibuja | 9 filas de 6 celdas, 8 opciones de editorial, 6 de género, 10 de autores, la nota de uso presente, el precio como texto |
| Alta de libro | 9 → 10 filas, mensaje de éxito, la página **no** se recarga y la URL no cambia |
| Precio con coma decimal | Fila nueva con «$ 1.500,50» |
| ISBN duplicado | Rechazado, con el motivo en el mensaje; las filas no cambian |
| Limpieza del formulario tras el alta | Título, ISBN y precio vacíos; editorial y género en su opción inicial; ningún autor marcado |
| `clientes.html` se dibuja | 4 filas de 2 celdas, mensajes ocultos |
| Alta de cliente | 4 → 5 filas, mensaje de éxito, sin recarga |
| Email duplicado en mayúsculas | Rechazado, con el motivo en el mensaje |
| Email con formato inválido | Rechazado, con el motivo en el mensaje |

### 6.5 Restricciones técnicas, regresión e integridad de la semilla

| Comprobación | Resultado |
|---|---|
| `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write` | 0 coincidencias en todo el proyecto |
| `localStorage`, `sessionStorage` | 0 coincidencias |
| `fetch(`, `http://`, `https://`, `@import` | 0 coincidencias |
| Manejadores `on*` en el HTML, atributos `style=`, bloques `<style>` | 0 coincidencias |
| Archivos ajenos al proyecto | Ninguno: la raíz tiene solo los cinco HTML, el logo y el estado del orquestador |
| Hashes de `index.html`, `historial.html`, `js/catalogo.js` y `js/datos-iniciales.js` | **4/4 idénticos** a los del inicio del change |
| Hash de `css/estilos.css` | **Cambió a propósito**: una única regla `.campo small { grid-column: 1 / -1; }` (§ 6.7) |
| `DATOS_INICIALES` tras tres altas | Idéntico byte a byte; el estado vivo sí creció de 9 a 12 libros |

### 6.6 Revisión visual

Esta comprobación se hizo **fuera del checklist**, al revisar el resultado a ojo. Ninguna comprobación automática la reemplaza: un texto puede ser legible y aun así estar mal colocado.

| Vista | Ancho | Resultado |
|---|---|---|
| Libros | 1280 px | **Defecto encontrado y corregido**: la nota de uso de los autores caía en la columna de la etiqueta, de 10 rem de ancho, y se partía en tres líneas |
| Libros | 1280 px (corregido) | La nota ocupa los 383 px del campo, debajo del control, en dos líneas |
| Libros | 320 px | Una sola columna; la nota queda bajo el control y no hay desplazamiento horizontal de la página |
| Clientes | 1280 px | Correcto |
| Ventas | 1280 px | Correcto; los dos selectores muestran el marcador de posición porque no hay nada elegido |

**La corrección** fue una regla de tres líneas en `css/estilos.css`:

```css
.campo small {
  grid-column: 1 / -1;
}
```

El selector `.campo small` no existe en ninguna otra vista, de modo que los otros cuatro HTML y la tabla del catálogo no se ven afectados. El SPEC § 5.7 queda actualizado con esta corrección.

### 6.7 Auditoría de conformidad con la spec archivada

Comprobación posterior al archivado: se recorrió **escenario por escenario** la spec archivada `altas-libros-clientes` (10 requisitos, 38 escenarios) y los tres requisitos modificados de `libreria-frontend` (9 escenarios), y se verificó cada uno contra la implementación real.

| Bloque | Escenarios | Resultado |
|---|---|---|
| Vista Libros — requisitos 1, 2, 5, 6, 7, 8 y 10 | 30 | **30/30** |
| Vista Clientes — requisitos 3, 4, 5, 6, 7 y 10 | 18 | **18/18** |
| Vista Ventas — requisito 9 | 7 | **7/7** |
| Recarga de página — requisito 7 | 1 | **1/1** |
| `libreria-frontend` — requisitos modificados | 9 | **9/9** |
| **Total** | **65** | **65/65** |

**Lo que la auditoría confirmó por primera vez**, más allá de las comprobaciones anteriores:

- «El libro registrado conserva sus relaciones» con **dos autores y sin género en la misma alta**: la fila muestra a ambos autores y «Sin clasificar».
- «Los mensajes de error y de éxito no se mezclan», en los dos sentidos: tras un alta correcta queda visible solo el de éxito, y tras un rechazo solo el de error.
- «El estado en memoria **no** sobrevive a la recarga»: con 10 filas tras el alta, al recargar vuelve a 9 y el libro nuevo desaparece.
- «El formulario conserva lo escrito» se comprobó **campo por campo** —título, ISBN, precio, editorial, género y autores—, no solo el conjunto.
- «Las opciones en ejecución provienen del conjunto local»: cada `<option>` corresponde a un registro del modelo, por identificador.

Durante la auditoría aparecieron **cinco falsos positivos** de los guiones de comprobación —un ISBN que en realidad ya existía, un `r.despues` escrito `r.despes`, opciones inyectadas contadas como si fueran del modelo, una expresión regular sobre el signo de dólar mal escapada y los modificadores BEM con doble guion rechazados por un patrón demasiado estricto—. Los cinco se corrigieron en el instrumental, no en el producto: **ningún fallo del Change 05**.

### 6.8 Lo que queda pendiente

| ID | Qué | Por qué |
|---|---|---|
| P-01 | Ver el libro nuevo en el catálogo de `index.html` y en la selección de venta de `ventas.html` | El estado vive en el documento y no cruza de página. Sin `localStorage` —reservado al Ejercicio 6— no hay canal. La mecánica está: `estado` es la única fuente de verdad y `iniciarDatos()` el único punto que lo siembra, de modo que el Ejercicio 6 solo cambia la fuente y las vistas no se tocan |

---

> **Estado:** este PLAN se ejecutó por completo el 20/10/2026. Los 37 puntos del checklist están cerrados, los resultados de las comprobaciones están en § 6 —incluida la revisión visual de § 6.6— y los desvíos de la implementación, en «Desvíos de la implementación» de `design.md`. El change de OpenSpec `05-altas-libros-clientes` está archivado.

---

