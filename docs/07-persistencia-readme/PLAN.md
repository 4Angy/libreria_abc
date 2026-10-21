# PLAN — Change 07: Persistencia, verificación y documentación

| Campo | Valor |
|---|---|
| Change | 07 — Persistencia, verificación y documentación (Ejercicio 6 · 10 puntos) |
| Fase | PLAN (Fase 2) |
| Versión | v1 |
| Estado | **Implementado y verificado** el 20/10/2026 - **39 de 39 tareas cerradas**. Comprobaciones: 27 de la capa de persistencia (Node), 34 en el navegador, 8 casos manuales de la consigna, 190 de regresion de los changes 03, 05 y 06 y 13 de restricciones e integridad. El unico fallo de la regresion es un control del guion de auditoria del Change 06 que **falla igual sin la persistencia** |
| Fecha | 20/10/2026 |
| Especificación | `docs/07-persistencia-readme/SPEC.md` v1 — **en revisión** (la persona usuaria confirmó por adelantado las decisiones D-01, D-02 y D-10) |
| Entrega | `js/persistencia.js` nuevo; `js/datos.js` y `js/inicio.js` modificados; `README.md` nuevo en la raiz; los cinco HTML con una etiqueta `<script>` mas (desvio D-A). `js/datos-iniciales.js`, `js/catalogo.js`, `js/altas.js`, `js/ventas.js`, `js/historial.js`, `js/validaciones.js`, `css/estilos.css` y `logo.png` **sin cambios** |
| Change de OpenSpec | `openspec/changes/07-persistencia-readme/` (esquema `spec-driven`) — `proposal.md`, `design.md`, `tasks.md` y cuatro delta specs: `persistencia-localstorage` y `documentacion-entrega` (nuevas), `altas-libros-clientes` y `ventas-e-historial` (reemplazo `REMOVED` + `ADDED`) |
| Fuentes | `docs/Consigna Primer Parcial.pdf` p. 5 (Ejercicio 6 y casos manuales), p. 6 (criterios y formato de entrega) |

---

## 1. Estrategia de ejecución

El trabajo se ordena por capas, y **cada capa se comprueba sola antes de pasar a la siguiente**:

1. **persistencia** → **hidratación** → **guardado** → **navegador** → **`file://`** → **README** → **casos manuales** → **cierre**.
2. El HTML **no se toca en ninguna fase**: la persistencia no necesita un control nuevo, y agregar un contenedor de error global rompería el contrato del Change 01.
3. Cada tarea se cierra con una comprobación concreta. Las comprobaciones que no se puedan ejecutar **no se marcan como aprobadas**.
4. El plan **no exige cambiar la especificación**. Si al implementar aparece una contradicción, se consulta antes de continuar (SPEC § 9.4 y § 7).

### Verificaciones disponibles y dónde viven

| Verificación | Ubicación | Entrega |
|---|---|---|
| Capa de persistencia, con un `localStorage` simulado | Script Node, `%TEMP%\opencode\arnes05\verify_persistencia.js` | No |
| Comportamiento en navegador | Arnés headless (Chromium/Edge) sobre una **copia** del proyecto servida por HTTP | No |
| Apertura directa con `file://` | Edge 155.0.4283.62, con el conductor por protocolo DevTools (`arnes05/cdp.js`) | No |
| Casos manuales de la consigna | El navegador del entorno, sobre la copia del proyecto | No |
| Restricciones técnicas | Búsquedas de patrones sobre los archivos del proyecto | No |
| Regresión de las otras vistas | Los guiones de los changes 03, 05 y 06 | No |

Ninguna de estas herramientas forma parte de la entrega: el parcial se entrega como HTML, CSS, JavaScript, la imagen y el `README.md`.

---

## 2. Checklist de tareas

### Fase 1 — Preparación

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-01** | Quedan anotados los hashes de los archivos que no deben cambiar: `css/estilos.css`, `js/catalogo.js`, `js/altas.js`, `js/ventas.js`, `js/historial.js`, `js/validaciones.js`, `js/datos-iniciales.js` y `logo.png`; y los de los cinco HTML, como linea base | R-06 | - | - | Nueve hashes SHA-256 anotados (los ocho que no cambian y la linea base de los cinco HTML) |
| **T-02** | El instrumental sirve una copia del proyecto y abre URLs `file://` | R-05 | `%TEMP%\opencode\arnes05\` | T-01 | El arnés devuelve el número de libros del catálogo; el conductor devuelve el origen `file://` |
| **T-03** | El guion de Node ejercita la capa de persistencia sin navegador | R-04 | `%TEMP%\opencode\arnes05\verify_persistencia.js` | T-01 | Corre con Node y termina con 0 fallos, informando el número de comprobaciones |

### Fase 2 — Capa de persistencia

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-04** | `js/persistencia.js` existe con las tres claves | R-02 | `js/persistencia.js` | T-03 | Las constantes valen `libreriaABC.libros`, `libreriaABC.clientes` y `libreriaABC.ventas` |
| **T-05** | `almacenamientoDisponible()` informa sin lanzar | R-05 | `js/persistencia.js` | T-04 | `true` con almacenamiento, `false` sin él; nunca lanza |
| **T-06** | `leerGuardado(clave)` devuelve la lista o `null`, nunca lanza | R-03, R-05 | `js/persistencia.js` | T-05 | El guion cubre clave ausente, JSON inválido, valor que no es lista, elemento sin campo y lista válida |
| **T-07** | `escribirGuardado(clave, valor)` informa si pudo escribir, nunca lanza | R-05 | `js/persistencia.js` | T-05 | El guion cubre la escritura correcta y el fallo de cuota |
| **T-08** | El guardado por colección escribe **una sola** clave | R-02 | `js/persistencia.js` | T-06, T-07 | El guion comprueba que guardar libros deja intactas las otras dos claves |

### Fase 3 — Hidratación del estado

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-09** | `iniciarDatos()` recupera lo guardado y siembra lo que falta | R-01, R-03 | `js/datos.js` | T-08 | Con el almacenamiento vacío: 9/4/2. Con el almacenamiento lleno: el conjunto guardado |
| **T-10** | Al abrir se escriben **solo** las claves que faltaban | R-01, R-03 | `js/datos.js` | T-09 | Tras el primer inicio las tres claves existen; tras el segundo, su contenido es idéntico |
| **T-11** | La semilla no se muta y las colecciones auxiliares no se guardan | R-06 | `js/datos.js` | T-09 | El JSON de `DATOS_INICIALES` antes y después es idéntico; no hay claves de editoriales, géneros ni autores |

### Fase 4 — Guardado en las mutaciones

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-12** | `agregarLibro()` guarda la clave de libros | R-01, R-03 | `js/datos.js` | T-10 | Tras un alta, la clave de libros tiene el libro y las otras dos no cambiaron |
| **T-13** | `agregarCliente()` guarda la clave de clientes | R-01, R-03 | `js/datos.js` | T-12 | Ídem, con el cliente registrado |
| **T-14** | `agregarVenta()` guarda la clave de ventas, con el precio congelado | R-01, R-03 | `js/datos.js` | T-13 | Ídem, y el detalle de la venta recuperada muestra el precio confirmado |

### Fase 5 — Comprobación de la persistencia en el navegador

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-15** | Recargar no duplica nada | R-01, R-03 | — | T-14 | Tres recargas: los mismos conteos de libros, clientes y ventas |
| **T-16** | Las cinco vistas ven el mismo conjunto de datos | R-01 | — | T-15 | El libro nuevo aparece en el catálogo y en el selector de venta; el cliente, en su listado y en el selector; la venta, en el historial con su detalle |
| **T-17** | El precio editado a mano en el catálogo sobrevive a una venta y a una recarga | R-03 | — | T-16 | El precio sigue editado después de confirmar una venta y recargar |
| **T-18** | Un almacenamiento no disponible o un JSON inválido no rompen la aplicación | R-05 | — | T-16 | La vista se dibuja, la operación se completa y no hay excepción en la consola |

### Fase 6 — Apertura directa con `file://`

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-19** | La aplicación persiste y recupera con `file://`, sin servidor | R-05 | — | T-18 | Las tres claves se leen con el conductor de DevTools tras recargar, y el catálogo dibuja los datos |

### Fase 7 — El README

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-20** | El README tiene las secciones de integrantes, apertura sin npm, navegación, funcionalidades y datos iniciales | R-06 | `README.md` | T-19 | Las seis secciones existen con su contenido, y la sección de integrantes nombra a **María de los Ángeles Zalazar** (ejercicios 1 a 3) y a **Julieta Cecilia Herrera** (ejercicios 4 a 6), con el reparto por ejercicio |
| **T-21** | El README explica la persistencia y sus límites medidos | R-02, R-05 | `README.md` | T-20 | Los límites nombran navegador, perfil y ubicación de apertura, y la guía dice que una copia abierta con `file://` ve los mismos registros |
| **T-22** | El README permite reproducir la comprobación del precio histórico | R-02 | `README.md` | T-21 | Siguiendo la guía se repite la comprobación sin ayuda externa |
| **T-23** | El README registra el resultado observado de los ocho casos | R-04 | `README.md` | T-22 | Una fila por caso, con lo que se hizo y lo que se vio |
| **T-24** | El README declara la procedencia de la imagen y el contenido de la entrega | R-06 | `README.md` | T-20 | La procedencia de `logo.png` queda declarada con los cuatro datos —obra, autor, enlace y licencia— y con la línea de crédito «ID 220305499 © Chetsadakorn Nakhammoon \| Dreamstime.com», deixando constancia de que la imagen no es obra del equipo; la sección de la entrega dice que no hay dependencias instaladas ni herramientas de compilación |

### Fase 8 — Los casos manuales de la consigna

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-25** | Caso 1 ejecutado y registrado | R-04 | `README.md` | T-23 | La fila del caso 1 tiene el resultado observado |
| **T-26** | Caso 2 ejecutado y registrado | R-04 | `README.md` | T-25 | La fila del caso 2 tiene el resultado observado |
| **T-27** | Caso 3 ejecutado y registrado | R-04 | `README.md` | T-26 | La fila del caso 3 tiene el resultado observado |
| **T-28** | Caso 4 ejecutado y registrado | R-04 | `README.md` | T-27 | La fila del caso 4 tiene el resultado observado |
| **T-29** | Caso 5 ejecutado y registrado | R-04 | `README.md` | T-28 | La fila del caso 5 tiene subtotales 3000 y 2000 y total 5000 |
| **T-30** | Caso 6 ejecutado y registrado, en una copia de prueba | R-03, R-04 | `README.md` | T-29 | La fila del caso 6 tiene el resultado y el detalle conserva precio, subtotales y total |
| **T-31** | Caso 7 ejecutado y registrado | R-01, R-04 | `README.md` | T-30 | La fila del caso 7 tiene el resultado y no hay duplicados |
| **T-32** | Caso 8 ejecutado y registrado | R-04 | `README.md` | T-31 | La fila del caso 8 tiene el resultado |
| **T-33** | Ningún caso no ejecutado figura como aprobado | R-04 | `README.md` | T-32 | La revisión queda anotada en el informe de comprobaciones |

### Fase 9 — Restricciones, regresión y cierre

| Tarea | Resultado esperado | Requisito | Archivos | Depende de | Comprobación concreta |
|---|---|---|---|---|---|
| **T-34** | Se cumplen las restricciones técnicas | R-06 | — | T-33 | Búsquedas de `fetch(`, `http://`, `cdn`, `import `, `require(` → 0 coincidencias; sin `package.json` ni `node_modules`; sin estilos en línea ni atributos `on*` |
| **T-35** | Los hashes de T-01 no cambiaron, y los cinco HTML difieren **solo** en la etiqueta `<script>` | R-06 | - | T-34 | Los ocho hashes coinciden; y quitando la linea `<script>` de cada HTML, su hash vuelve a ser el de la linea base |
| **T-36** | Las otras vistas siguen funcionando | R-05 | — | T-35 | Los guiones de los changes 03, 05 y 06 pasan |
| **T-37** | El estado del SPEC y del PLAN refleja la realidad | R-04 | `docs/07-persistencia-readme/SPEC.md`, `PLAN.md` | T-36 | Los controles aprobados, fallidos, omitidos y pendientes quedan distinguidos; ninguno no ejecutado aparece como aprobado |
| **T-38** | El change queda archivado y las specs sincronizadas | — | `openspec/` | T-37 | `openspec archive` informa las capabilities actualizadas; `openspec list --specs` incluye `persistencia-localstorage` y `documentacion-entrega`; `openspec validate --strict` sigue pasando |
| **T-39** | El trabajo queda registrado en el repositorio | — | todos | T-38 | `git status` queda limpio y `git log` muestra el commit |

---

## 3. Orden y paralelismo

```
  FASE 1  Preparación
     │  T-01 hashes ─┬─▶ T-02 arnés ──▶ T-03 guion Node
     │               └────────────────────────────────────┐
     ▼                                                 │
  FASE 2  Persistencia  ◀────────────────────────────────┘
     │  T-04 claves ▶ T-05 disponible ▶ T-06 leer ▶ T-07 escribir ▶ T-08 por colección
     ▼
  FASE 3  Hidratación
     │  T-09 recuperar/sembrar ▶ T-10 escribir lo que falta ▶ T-11 semilla intacta
     ▼
  FASE 4  Guardado
     │  T-12 libro ▶ T-13 cliente ▶ T-14 venta
     ▼
  FASE 5  Navegador
     │  T-15 no duplica ▶ T-16 cinco vistas ▶ T-17 precio editado ▶ T-18 fallos
     ▼
  FASE 6  file://
     │  T-19 apertura directa
     ▼
  FASE 7  README
     │  T-20 base ▶ T-21 persistencia ▶ T-22 guía del caso 6 ▶ T-23 tabla ▶ T-24 imágenes
     ▼
  FASE 8  Casos manuales
     │  T-25 ▶ T-26 ▶ T-27 ▶ T-28 ▶ T-29 ▶ T-30 ▶ T-31 ▶ T-32 ▶ T-33
     ▼
  FASE 9  Cierre
        T-34 restricciones ▶ T-35 hashes ▶ T-36 regresión ▶ T-37 estados ▶ T-38 archivo ▶ T-39 commit
```

**Paralelismo posible:** dentro de la Fase 2, T-05 es independiente de T-06 y T-07; T-08 depende de las dos. En la Fase 7, T-24 puede escribirse en paralelo con T-21 y T-22. En la Fase 8, los casos 1 a 5 y el 8 no dependen entre sí: se ejecutan en paralelo y se registran por separado; el caso 6 y el 7 sí dependen de la persistencia, no del resto.

**Lo que no se puede paralelizar:** las Fases 3 y 4 dependen del resultado de la Fase 2, y toda la Fase 8 depende de que la Fase 4 esté cerrada, porque los casos 6 y 7 no tienen sentido sin la persistencia.

---

## 4. Riesgos del plan

| Riesgo | Mitigación |
|---|---|
| Que la hidratación se escriba mal y duplique los ejemplos al recargar | La regla es una sola: la ausencia de una clave es un primer inicio, la presencia es recuperar. T-10 comprueba que las claves existentes no se reescriben, y T-15 que tres recargas no duplican |
| Que el JSON mal escrito rompa la aplicación | La colección se valida por forma antes de usarse; si no cuadra, se usa la semilla y la clave no se sobrescribe. T-06 y T-18 lo comprueban |
| Que guardar una venta pise el precio que el docente editó a mano | El guardado es por colección: una venta escribe solo `libreriaABC.ventas`. T-17 lo comprueba |
| Que el `README.md` afirme límites que nadie midió | Los límites del README salen de lo medido en el SPEC § 2.4, no de documentación genérica |
| Que un caso manual quede como aprobado sin ejecutarse | T-33 revisa la tabla contra el informe de comprobaciones. Ningún caso no ejecutado figura como aprobado |
| Que la procedencia de la imagen quede incompleta en el README | La sección de imágenes declara los cuatro datos —obra, autor, enlace y licencia— con la línea de crédito de la agencia, y deja constancia de que la imagen no es obra del equipo (D-11) |
| Que la validación del divisor del `REMOVED` + `ADDED` de las dos specs rechace el archivo | `openspec validate --strict` ya pasa con el delta actual. Se vuelve a correr en T-38, antes del archivo |
| Que la copia del proyecto abierta con `file://` confuse al docente | El README lo dice en la guía del caso 6, con la alternativa de servir la copia por HTTP en otro puerto |

---

## 5. Fuera de este plan

- **Cualquier implementación de la Fase 3** empieza únicamente con la autorización explícita de la persona usuaria, después de aprobar el SPEC y este PLAN.
- **Una pantalla para editar precios**, un botón de «restaurar datos», exportar/importar, y persistir la venta en curso: son propuestas pendientes (P-01 a P-06 del SPEC), **no** tareas.
- **Cambios en el modelo de datos, en el CSS, en el HTML o en la semilla**: fuera de alcance.
- **La pantalla de edición de precios** que la consigna descarta explícitamente.

---

## 6. Resultado de las comprobaciones

Todas las comprobaciones se ejecutaron el 20/10/2026. Ningún control figura como aprobado sin haberse ejecutado.

### 6.1 Comprobaciones de la Fase 1 y la Fase 2 — la capa de persistencia

`%TEMP%\opencode\arnes07\verify_persistencia.js`, con un `localStorage` simulado: **27 comprobaciones, 0 fallos, 6 avisos por consola**. Cubre las tres claves, la disponibilidad del almacenamiento (con y sin), la lectura (clave ausente, JSON inválido, contenido que no es una lista, elemento sin campo, renglón sin campo, lista válida), la escritura (correcta y con la cuota llena), el guardado por colección —que deja intactas las otras dos claves— y `hayGuardado()`.

### 6.2 Comprobaciones de la Fase 3 a la Fase 6 — en el navegador

`%TEMP%\opencode\arnes07\auditoria_persistencia.js`, sobre una copia del proyecto servida por HTTP y sobre el proyecto real abierto con `file://`, en Edge 155.0.4283.62: **34 comprobaciones, 0 fallos**.

| Comprobación | Resultado |
|---|---|
| El primer inicio escribe las tres claves con 9 libros, 4 clientes y 2 ventas | Correcto |
| No se guarda ninguna clave de las colecciones auxiliares | Correcto |
| Al volver a abrir, el contenido de las tres claves es idéntico byte a byte | Correcto |
| Tres recargas seguidas: los conteos no cambian | Correcto |
| Las cinco vistas ven el mismo conjunto (catálogo, listados, selectores e historial) | Correcto |
| El detalle de la venta recuperada muestra sus renglones | Correcto |
| El precio editado a mano en el catálogo sobrevive a una venta confirmada | Correcto |
| La venta guardada conserva su total, que no sigue al catálogo | Correcto |
| Un JSON inválido: la app dibuja los ejemplos y **no** sobrescribe la clave | Correcto |
| Un almacenamiento no disponible: la vista se dibuja igual | Correcto |
| La semilla no se muta (9 libros, 4 clientes, 2 ventas, sin el libro de prueba) | Correcto |
| Con `file://`: origen `file://`, el catálogo se dibuja, se escriben las tres claves y se recuperan al volver a abrir | Correcto |

### 6.3 Los ocho casos manuales de la consigna

`%TEMP%\opencode\arnes07\casos_manuales.js`: **8 casos, 0 fallos**. El resultado observado de cada uno está en la sección 9 del `README.md`.

| Caso | Estado |
|---|---|
| 1 · Búsqueda | **Aprobado** |
| 2 · Alta de libro | **Aprobado** |
| 3 · Alta de cliente | **Aprobado** |
| 4 · Venta inválida y libro repetido | **Aprobado** |
| 5 · Venta válida de 2 × 1500 y 1 × 2000 | **Aprobado** |
| 6 · Precio histórico en una copia de prueba | **Aprobado** |
| 7 · Recarga después de altas y venta | **Aprobado** |
| 8 · Teclado y anchos de 320 px y 1280 px | **Aprobado** |

Ningún caso quedó pendiente ni omitido.

### 6.4 Regresión de los changes 03, 05 y 06

| Guion | Comprobaciones | Fallos |
|---|---|---|
| `verify_datos.js` (modelo de datos) | 35 | 0 |
| `verify_validaciones.js` (reglas de validación) | 54 | 0 |
| `verify_ventas.js` (modelo de ventas y regla de la cantidad) | 37 | 0 |
| `auditoria-libros.js` | 30 | 0 |
| `auditoria-clientes.js` | 18 | 0 |
| `auditoria-ventas.js` | 7 | 0 |
| `auditoria-ventas-extra.js` | 7 | **1** |
| `auditoria-historial-extra.js` | 2 | 0 |
| **Total** | **190** | **1** |

El único fallo es el control «Una venta recién confirmada en el historial» de `auditoria-ventas-extra.js`. **Se comprobó que falla igual sin la persistencia**: se corrió la misma auditoría contra una copia del proyecto con la capa de persistencia desactivada y el resultado fue idéntico (6 de 7). La causa es del guion, que necesita un contenedor `#historial-listado` que solo existe en la vista Historial mientras la auditoría corre en la vista Ventas. **No es una regresión de este change** (desvío D-D del `design.md`).

Los guiones de regresión de los changes 03, 05 y 06 se ajustaron en el instrumental —fuera del proyecto— para cargar la nueva capa y simular un almacenamiento (desvío D-C del `design.md`). Ningún archivo de la entrega se modificó por eso.

### 6.5 Restricciones técnicas e integridad

| Comprobación | Resultado |
|---|---|
| `fetch(`, `http://`, `https://`, `cdn.`, `import`, `require(`, `style=` y atributos `on*` en los HTML, el CSS y el JavaScript | **0 coincidencias** en los siete patrones |
| `<style>` o `style=` en el marcado | 0 coincidencias |
| `package.json` o `node_modules` en el proyecto | No existen |
| Los ocho archivos que no debían cambiar (`css/estilos.css`, `js/catalogo.js`, `js/altas.js`, `js/ventas.js`, `js/historial.js`, `js/validaciones.js`, `js/datos-iniciales.js`, `logo.png`) | Los ocho hashes SHA-256 coinciden con los de T-01 |
| Los cinco HTML | La **única** diferencia es la línea `<script src="js/persistencia.js"></script>`: quitando esa línea, cada archivo vuelve a su hash original (desvío D-A del `design.md`) |

### 6.6 Especificaciones de OpenSpec

| Comprobación | Resultado |
|---|---|
| `openspec validate 07-persistencia-readme --strict` | **Aprobado**: «Change '07-persistencia-readme' is valid» |
| `openspec validate --specs --strict` | **Aprobado**: 5 specs, 0 fallos |

### 6.7 Lo que queda pendiente

Nada de la Fase 3. Quedan **propuestas, no implementadas**, y anotadas como tales en el SPEC § 9.5: un botón de «restaurar los datos de ejemplo» (P-02), exportar e importar los datos (P-03), un aviso visible cuando el almacenamiento no está disponible (P-05), registrar la fecha de la última modificación (P-06) y quitarle el fondo blanco al logo (P-07).

El apartado anterior del SPEC (los casos 6 y 7, «pendientes») quedó **resuelto**: ambos se ejecutaron y aprobaron, y su resultado está en la sección 9 del `README.md`.

---|---|---|
| Comprobaciones de la Fase 1 a la Fase 9 (39 tareas) | **Pendiente de ejecución** | — |
| Casos manuales 1 a 5 y 8 | **Ejecutados el 20/10/2026** sobre el código previo a este change, en el navegador del entorno | Registrados en el SPEC § 2.3 |
| Casos manuales 6 y 7 | **Pendientes** | Requieren la persistencia, que es lo que este change implementa |
| `openspec validate --strict` del change | **Aprobado** el 20/10/2026 | «Change '07-persistencia-readme' is valid» |
| `openspec validate --specs --strict` de las specs vivas | **Aprobado** el 20/10/2026 | 5 specs, 0 fallos |

---

> **Estado:** este PLAN v1 se presenta para revisión, junto con el SPEC v1. Habilita la implementación (Fase 3) **únicamente** con la autorización explícita de la persona usuaria. **Ninguna línea de código del producto se modificó al escribir este documento.**
