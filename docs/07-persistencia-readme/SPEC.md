# SPEC — Change 07: Persistencia, verificación y documentación

| Campo | Valor |
|---|---|
| Change | 07 — Persistencia, verificación y documentación (Ejercicio 6 · 10 puntos) |
| Fase | Fase 1 — SPEC |
| Versión | v1 |
| Estado | **Implementado y verificado** el 20/10/2026. 39 de 39 tareas cerradas. Comprobaciones ejecutadas: **27** de la capa de persistencia (Node), **34** en el navegador (arnÃ©s headless sobre Chromium/Edge 152 y Edge 155.0.4283.62 con `file://`), **8** casos manuales de la consigna, **190** de regresiÃ³n de los changes 03, 05 y 06 y **13** de restricciones e integridad. El Ãºnico fallo de la regresiÃ³n (un control de la auditoria del Change 06) **falla igual sin la persistencia**: es del guion, no del producto. Los ocho casos manuales quedaron aprobados. Cuatro desvios de la implementacion quedan documentados en Â«Desvios de la implementacionÂ» de `design.md`; el mas relevante es que los cinco HTML ganan una etiqueta `<script>` |
| Fecha | 20/10/2026 |
| Proyecto | Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN) |
| Ubicación | `C:\Users\Cara Palida\Documents\projects\libreria_abc` (verificada el 20/10/2026) |
| Ruta del documento | `docs/07-persistencia-readme/SPEC.md` (decisión D-01) |
| Depende de | Change 01 (HTML), 02 y 04 (CSS), 03 (datos y catálogo), 05 (altas), 06 (ventas e historial) |
| Fuentes de requisitos | `docs/Consigna Primer Parcial.pdf` p. 5 (Ejercicio 6 y casos manuales), p. 6 (criterios de evaluación y formato de entrega) |
| Change de OpenSpec | Se creará en la Fase 2, junto con el PLAN (convención del proyecto, igual que en el Change 06) |
| Decisiones tomadas | D-01 (numeración 07), D-02 (tres claves), D-10 (los casos los ejecuta el agente), confirmadas el 20/10/2026 |

---

## 1. Problema, objetivo y resultado esperado

**Problema.** La librería funciona, pero **todo lo que la persona usuaria registra se pierde al recargar**. Hoy `iniciarDatos()` (`js/datos.js:24`) copia siempre la semilla `DATOS_INICIALES` y la reemplaza en el estado vivo: el catálogo, los clientes, las altas de libros y clientes y las ventas confirmadas existen únicamente en la memoria de la página abierta. Peor todavía, cada vista es un documento HTML distinto (`index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html`) y **no hay nada compartido entre ellas**: un libro dado de alta en la vista Libros no aparece en el catálogo de `index.html`, ni en el selector de libro de `ventas.html`; una venta confirmada en `ventas.html` no aparece en el historial de `historial.html`.

Esta es la última pieza del parcial y la que cierra el circuito de la consigna: el Ejercicio 5 dejó escrito en su propia spec que «en el Ejercicio 6 lo estará», y el Ejercicio 4 dejó escrito que «en esta etapa el registro no se persiste». El Ejercicio 6 (10 puntos, «Persistencia: 4; pruebas manuales registradas: 3; documentación y entrega: 3») es el que paga esa deuda.

**Objetivo de esta entrega.** Tres cosas, en este orden:

1. **Persistir** libros, clientes y ventas en `localStorage`, de modo que lo registrado sobreviva a la recarga y **sea el mismo conjunto de datos en las cinco vistas**.
2. **Verificar** el comportamiento con los ocho casos manuales de la consigna y **registrar en el README el resultado realmente observado**, sin dar por aprobado nada que no se haya ejecutado.
3. **Documentar** la entrega: un `README.md` en la raíz con las secciones que exige el formato de entrega, la ubicación de los datos iniciales, el funcionamiento y los límites de `localStorage`, y la procedencia de las imágenes.

**Resultado esperado.** Al abrir `index.html` (o cualquiera de las otras cuatro vistas) desde el sistema de archivos, sin servidor:

1. en el **primer inicio** se cargan los datos de ejemplo: 9 libros, 4 clientes y 2 ventas;
2. al **volver a abrir**, se recuperan los registros guardados —los de ejemplo y los que la persona usuaria haya agregado— **sin duplicar ni los ejemplos ni las ventas**;
3. un libro dado de alta en `libros.html` aparece en el catálogo de `index.html` y en el selector de libro de `ventas.html`; un cliente dado de alta aparece en `clientes.html` y en el selector de cliente de `ventas.html`; una venta confirmada en `ventas.html` aparece en el historial de `historial.html`, con sus renglones;
4. la venta guardada **conserva el precio unitario, los subtotales y el total** aunque el precio del catálogo guardado cambie: el historial deriva sus importes de lo guardado, nunca del catálogo;
5. el `README.md` de la raíz documenta las claves y la estructura del almacenamiento, los límites de `localStorage`, y el resultado observado de los ocho casos manuales.

**Fuera del resultado:** una pantalla para editar precios, seguridad o integridad garantizada por un servidor, cualquier funcionalidad nueva de los ejercicios 1 a 5 que no sea el ajuste mínimo para integrar la persistencia, y dependencies, librerías o herramientas de compilación.

### 1.1 El recorrido de un dato, antes y después

Hoy, un libro registrado recorre esto y muere en la última flecha:

```
   ALTA (libros.html)                 APERTURA (index.html)
   ┌───────────────────┐              ┌──────────────────────┐
   │ agregarLibro()    │              │ iniciarDatos()       │
   │  estado.libros    │  ── ✗ ──▶    │  DATOS_INICIALES     │
   │  +1 libro         │  se pierde  │  (9 libros de nuevo) │
   └───────────────────┘              └──────────────────────┘
```

Después de este change, el mismo recorrido termina en el almacenamiento y vuelve a entrar por la otra punta:

```
   ALTA (libros.html)                 APERTURA (index.html)
   ┌───────────────────┐              ┌──────────────────────────────┐
   │ agregarLibro()    │              │ iniciarDatos()               │
   │  estado.libros    │  ──▶        │  localStorage                │
   │  +1 libro         │  guardarLibros()   │  "libreriaABC.libros"      │
   └───────┬───────────┘              │         │                    │
           │                          │         v                    │
           │                          │  estado.libros = 10 libros   │
           │                          │  (9 de ejemplo + 1 nuevo)    │
           │                          └──────────────────────────────┘
           ▼
   ┌──────────────────────────────────────────┐
   │ localStorage                              │
   │   "libreriaABC.libros"   -> 10 libros     │
   │   "libreriaABC.clientes" ->  4 clientes   │
   │   "libreriaABC.ventas"   ->  3 ventas     │
   └──────────────────────────────────────────┘
```

Y el precio histórico es la razón por la que `ventas` se guarda **separada** de `libros`:

```
   CATALOGO GUARDADO (el docente edita el precio)     VENTA GUARDADA
   ┌──────────────────────────────┐                   ┌────────────────────────┐
   │ "libreriaABC.libros"         │                   │ "libreriaABC.ventas"   │
   │  { id:"li-hobbit",            │   NUNCA se        │  { id:"vt-2026-0003",   │
   │    precio: 21900  ◀── el      │   leen entre     │    renglones:[{        │
   │    docente lo cambia a 25000  │   sí             │      cantidad:2,        │
   │  }                            │                   │      precioUnitario:    │
   └──────────────────────────────┘                   │        21900 }]  ◀──   │
                                                      │    total: 43800 }      │
                                                      └────────────────────────┘
                                                            el detalle muestra 21900
```

---

## 2. Contexto verificado y fuentes consultadas

### 2.1 Estado actual del proyecto (verificado el 20/10/2026)

| Dato | Valor | Cómo se verificó |
|---|---|---|
| Vistas HTML | `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` | Listado de archivos |
| Scripts por vista | 4 en `index.html` y `historial.html`; 6 en `libros.html`, `clientes.html` y `ventas.html` | Lectura de los 5 archivos |
| `js/` | `datos-iniciales.js`, `datos.js`, `validaciones.js`, `catalogo.js`, `altas.js`, `ventas.js`, `historial.js`, `inicio.js` | Listado de archivos |
| **`localStorage` en el proyecto** | **0 coincidencias** en `js/`, `*.html` y `css/` | Búsqueda de `localStorage\|sessionStorage` |
| **`README.md` en la raíz** | **No existe** | Listado de archivos |
| `package.json` / `node_modules` | **No existen**: la entrega ya cumple el formato sin dependencias | Listado de archivos |
| `iniciarDatos()` | `js/datos.js:24` — copia **siempre** la semilla y reemplaza `estado` | Lectura del archivo |
| Semilla `DATOS_INICIALES` | 7 editoriales, 5 géneros, 10 autores, **9 libros**, **4 clientes**, **2 ventas** (`vt-2026-0001`, `vt-2026-0002`) | Lectura de `js/datos-iniciales.js` |
| Precios de la semilla | Entre 13.900 y 32.900 pesos. **No hay ningún libro de precio 1500 ni 2000** | Lectura de `js/datos-iniciales.js` |
| Mutaciones del estado | `agregarLibro()` (`js/datos.js:180`), `agregarCliente()` (`:195`), `agregarVenta()` (`:251`) — son los **tres únicos** caminos que agregan un registro | Lectura del archivo |
| Forma de una venta guardada | `{ id, fecha, clienteId, clienteNombre, renglones:[{ libroId, titulo, cantidad, precioUnitario }], total }` — el renglón **no** guarda el subtotal | `js/datos.js:64` y `js/datos-iniciales.js:174` |
| Forma de un libro | `{ id, titulo, isbn, editorialId, generoId, autorIds:[], precio }` | `js/datos.js:36` |
| Forma de un cliente | `{ id, nombre, email }` | `js/datos.js:60` |
| Precio de la venta | Se **congela al confirmar**: `congelarVenta()` copia `precioUnitario` del catálogo (`js/ventas.js:215`) | Lectura del archivo |
| El historial lee lo guardado | `crearFilaRenglonDetalle()` deriva el subtotal de `renglon.precioUnitario`, **nunca** del catálogo (`js/historial.js:80`) | Lectura del archivo |
| Contenedor de error global | **No existe.** `#mensaje-exito` es el único contenedor común de las cinco vistas | Lectura de los 5 archivos |
| `formatearPrecio()` | `Intl.NumberFormat("es-AR", { style:"currency", currency:"ARS" })` → «$ 24.500,00» | `js/catalogo.js:55` |
| Navegador y herramientas | Edge **155.0.4283.62**, Node **v24.19.0**, Python **3.14.0** | Versión de los binarios |
| Arnés de verificación | `arnes05/cdp.js` y `arnes05/arnes.py` (fuera del proyecto) — Edge headless por CDP, admite `file://` | Lectura del instrumental |
| Cambios de OpenSpec | **0** activos; 6 archivados (`01` a `06`) | `openspec list --json` |
| Specs vivas | `libreria-frontend` (12), `datos-catalogo` (9), `presentacion-css` (10), `altas-libros-clientes` (10), `ventas-e-historial` (13) | `openspec list --specs --json` |
| Git | 4 commits; los changes 05 y 06 están **sin commitear** | `git log`, `git status` |
| `logo.png` | 117.612 bytes — clipart de libros apilados con la palabra «BOOK». **Es una imagen ajena al equipo, que no fue creada por ninguna de las personas del trabajo**: la obra es de **Chetsadakorn Nakhammoon** (ilustración «ID 220305499» de [Dreamstime](https://www.dreamstime.com/book-in-hand-drawn-style-isolated-illustration-hand-drawn-objects-for-presentation-didactic-material-or-other-image220305499)), y fue **descargada** de esa página por **María de los Angeles Zalazar**, a cargo del Ejercicio 1, usando su cuenta. No hay ninguna nota de origen en el repositorio | Lectura de la imagen, del proyecto y de la ficha del producto |

### 2.2 Qué pide la consigna (p. 5, Ejercicio 6)

Texto de la consigna, verbatim:

> Se utiliza localStorage para conservar libros, clientes y ventas. En el primer inicio se cargan los ejemplos; al volver a abrir se recuperan los registros guardados sin duplicar los datos iniciales. El README explica que el almacenamiento depende del navegador, del perfil y de la ubicación de apertura, y que no comparte información entre usuarios.

> Se registra en el README el resultado observado de estos casos manuales: […]

> La comprobación del precio histórico se realiza de forma guiada por el docente en una copia del proyecto y con datos de prueba. Se confirma una venta y se anotan sus importes. Con las herramientas de almacenamiento del navegador, se modifica únicamente el precio del libro dentro del catálogo guardado en localStorage, sin modificar ni borrar las ventas guardadas. Se recarga la página y se consulta el detalle de la venta anterior. No se exige una pantalla para editar precios. La ubicación y estructura del catálogo guardado se identifican en el README para reproducir esta comprobación.

> Si un caso falla o una funcionalidad queda pendiente, se registra el comportamiento real. No se indica una prueba como aprobada sin ejecutarla.

Y el formato de entrega (p. 6):

> Se entrega una carpeta o archivo comprimido con index.html, los demás HTML si corresponden, carpetas de CSS, JavaScript y recursos locales, y un README.md. No se incluyen dependencias instaladas ni herramientas de compilación.

> El README identifica a quienes realizan el trabajo y contiene: pasos para abrir index.html en el navegador sin npm; navegación entre vistas; funcionalidades implementadas y pendientes; ubicación de los datos iniciales; funcionamiento y límites de localStorage; resultados de los casos manuales y procedencia de imágenes ajenas, si existen.

### 2.3 Los ocho casos manuales de la consigna (p. 5), con el estado verificado hoy

| # | Caso (texto de la consigna) | Resultado esperado (texto de la consigna) | Estado verificado el 20/10/2026 |
|---|---|---|---|
| 1 | Búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados | **Ejecutado ✅** — «HOBBIT» → 1 fila («El Hobbit»); búsqueda vacía y solo espacios → 9 filas; «zzz-no-existe» → 0 filas + «No se encontraron libros para la búsqueda.» |
| 2 | Alta de libro con ISBN existente y luego con ISBN nuevo | El duplicado se rechaza; el válido aparece en catálogo y selección de venta | **Ejecutado ✅** — ISBN `9780307474728` → «Ya existe un libro con ese ISBN.», el listado queda en 9 filas; ISBN `9780000000001` → «Se registró el libro «Cien años de prueba».», el listado pasa a 10 filas |
| 3 | Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección | **Ejecutado ✅** — «no-es-un-email» → «El correo electrónico no tiene un formato válido.»; «MARTINA.FERREYRA@EXAMPLE.COM» → «Ya existe un cliente con ese correo electrónico.»; «cliente.nuevo@example.com» → aceptado, 5 filas |
| 4 | Venta sin cliente, cantidad cero, negativa o decimal; libro repetido | No se confirma; el duplicado no crea otro renglón | **Ejecutado ✅** — cantidad 0, −2 y 1,5 rechazadas («Ingresá una cantidad entera mayor que cero.»), 0 renglones; libro repetido → **un** renglón con 2+3=5 y aviso «Se agregaron 3 unidades más de «Cien años de soledad»; el renglón queda con 5.»; confirmar sin cliente → «Elegí un cliente para la venta.», la lista de ventas no crece |
| 5 | Venta válida: dos unidades a 1500 y una a 2000 | Subtotales 3000 y 2000; total 5000; detalle conservado en el historial | **Ejecutado ✅** — con dos libros de prueba a 1500 y 2000: subtotales «$ 3.000,00» y «$ 2.000,00», total «$ 5.000,00», venta `vt-2026-0003` con `precioUnitario` congelado y formulario limpio |
| 6 | Venta confirmada y cambio exclusivo del precio de catálogo guardado, en una copia de prueba del proyecto | Al consultar nuevamente el historial después de recargar, el precio unitario, los subtotales y el total de esa venta conservan los valores confirmados | **No ejecutable ⏳** — depende de la persistencia, que es lo que este change implementa |
| 7 | Recarga después de altas y venta | Se recuperan datos sin duplicar ejemplos ni ventas | **No ejecutable ⏳** — ídem |
| 8 | Navegación por teclado y anchos de 320 px y 1280 px | Foco visible, controles utilizables y tabla con desplazamiento propio si lo necesita | **Ejecutado ✅** — a 320 px y a 1280 px, ninguna de las cinco vistas produce scroll horizontal de página (`scrollWidth == clientWidth`); las tablas anchas se desplazan dentro de `.tabla-desplazable` (`overflow-x:auto`, `min-width:760px`); la navegación por teclado recorre enlaces → buscador → botón con foco visible (`outline: solid 2.4px`) |

Los casos 1 a 5 y el 8 se ejecutaron con la aplicación **servida por HTTP** en Chromium (herramienta de navegador del entorno), con los guiones de la consigna. Los casos 6 y 7 se ejecutarán **después** de implementar la persistencia, y el caso 6 además lo repite el docente guiado, en una copia del proyecto.

### 2.4 Lo que el navegador hace con `localStorage`: medido, no supuesto

El README tiene que explicar los límites de `localStorage`. Esos límites se **midieron** en esta máquina, con Edge 155.0.4283.62 headless por CDP (`arnes05/cdp.js`) y con el navegador del entorno:

| Medida | Resultado | Cómo |
|---|---|---|
| ¿`localStorage` funciona con `file://`? | **Sí.** El origen es `file://`; escribe y lee sin error | `arnes05/expr_file_localstorage.js`: `setItem` → `getItem` → «ok», y el catálogo dibuja 9 filas con `file://` |
| ¿Dos rutas `file://` distintas comparten el almacenamiento? | **Sí.** Una clave escrita en el proyecto original se leyó en una **copia** del proyecto located en `%TEMP%` | `arnes05/cdp_file.js`, con el mismo `--user-data-dir` en las dos pestañas |
| ¿Dos orígenes HTTP distintos lo comparten? | **No.** `http://127.0.0.1:8765` y `http://localhost:8765` tienen almacenamientos **separados** | Navegador del entorno: la clave escrita en el primero no existe en el segundo |
| ¿La app dibuja el catálogo con `file://`? | **Sí**, 9 filas | `arnes05/expr_file_localstorage.js` |

La segunda fila tiene una consecuencia directa sobre el caso 6: **la consigna pide que el docente haga la comprobación «en una copia del proyecto»**. Si esa copia se abre con `file://`, **ve el mismo almacenamiento que el original** (mismo origen `file://`): no es un error, pero hay que decirlo, porque si no el docente puede concluir que la copia «no funciona» o, peor, que está mirando los datos de otra sesión. Si la copia se sirve por HTTP en otro puerto, tiene su propio almacenamiento y arranca con los datos de ejemplo.

### 2.5 Las specs vivas que este change modifica

Dos escenarios de specs vivas describen, **en negativo**, el comportamiento que este change elimina. No se pueden dejar como están: pasarían a ser falsos el día que la persistencia exista. Los dos escenarios tienen la forma de una deuda declarada por el propio change anterior.

| Spec | Requirement | Escenario que hay que modificar | Texto actual | Texto que corresponde |
|---|---|---|---|---|
| `altas-libros-clientes` | «El envío se controla sin recargar la página» (`spec.md:172`) | «El estado en memoria no sobrevive a la recarga» (`spec.md:186`) | «…el conjunto de datos vuelve al estado inicial, porque en esta etapa el registro no se persiste» | «…el conjunto de datos guardado se recupera, sin duplicar los registros de ejemplo» |
| `ventas-e-historial` | «El historial lista las ventas registradas» (`spec.md:170`) | «El historial de otra vista no muestra la venta recién confirmada» (`spec.md:189`) | «…la venta no está en el listado, porque el estado no se persiste entre páginas; en el Ejercicio 6 lo estará» | «…la venta **sí** está en el listado, porque el registro se conserva entre páginas» |

El escenario de `altas-libros-clientes` se deforma en su nombre además de su texto: de «El estado en memoria no sobrevive a la recarga» pasa a «El estado guardado sobrevive a la recarga».

**Cómo se expresa el cambio en el delta de OpenSpec.** El validador (`openspec validate --strict`) exige que un requirement `MODIFIED` conserve **exactamente** los mismos escenarios: no admite renombrar uno ni agregar otro. Como los dos escenarios que hay que invertir afirman comportamientos que dejan de existir —dejarlos con su nombre actual pondría en la spec una afirmación falsa—, el delta se expresa como **`REMOVED` + `ADDED`** con un título nuevo por requirement:

| Capability | `REMOVED` | `ADDED` |
|---|---|---|
| `altas-libros-clientes` | «El envío se controla sin recargar la página» | «El alta se controla sin recargar la página y el registro se guarda» |
| `ventas-e-historial` | «El historial lista las ventas registradas» | «El historial lista las ventas guardadas y las recuperadas del almacenamiento» |

El motivo y el camino de migración de cada reemplazo quedan escritos en el propio delta, y el spec archivado queda con un texto verdadero.

El resto de las specs vivas (`libreria-frontend`, `datos-catalogo`, `presentacion-css`) **no se modifican**: ninguna menciona la persistencia, y ninguna prohíbe el uso de `localStorage`. La restricción equivalente que sí existió («Sin `localStorage` en este change», SPEC-06 § 7, punto 3) era una restricción **de ese change**, no un requisito vivo, y el propio SPEC-06 la dejó vencer con este ejercicio.

### 2.6 Contratos heredados que este change no puede romper

| # | Contrato | Dónde vive |
|---|---|---|
| 1 | Los scripts son clásicos, no módulos ES: con `file://` el `import` está bloqueado | `libreria-frontend`, «Operación local sin dependencias» |
| 2 | Sin recursos de otro origen, sin `fetch`, sin red | `libreria-frontend`, «Operación local sin dependencias» |
| 3 | Los datos del modelo se insertan en el DOM como texto | `datos-catalogo`, «Los datos se insertan en el DOM como texto» |
| 4 | Las validaciones son las de la aplicación, no las del navegador | `libreria-frontend`, «Validaciones diferidas» |
| 5 | Las ventas confirmadas no se editan ni se eliminan desde la interfaz | `ventas-e-historial`, «Las ventas confirmadas no se editan ni se eliminan» |
| 6 | El precio unitario se congela al confirmar y el historial no vuelve al catálogo | `ventas-e-historial`, «La venta confirmada conserva el precio histórico» |
| 7 | La semilla `DATOS_INICIALES` no se muta | `datos-catalogo` (A-03 del SPEC-06) |
| 8 | Los `id`, clases y textos visibles del HTML no se modifican | Contrato del Change 01 (SPEC-06, § 7 punto 10) |

---

## 3. Alcance

### 3.1 Incluido

1. **Un módulo de persistencia** (`js/persistencia.js`) que es la **única** capa del proyecto que habla con `localStorage`: leer, escribir y sembrar.
2. **Tres claves**: `libreriaABC.libros`, `libreriaABC.clientes`, `libreriaABC.ventas` (D-02).
3. **Hidratación del estado** al abrir cada vista: si la clave existe, se recupera; si no existe, se siembra con la semilla y se escribe.
4. **Guardado en el momento de la mutación**, por colección: un alta de libro escribe solo la clave de libros; un alta de cliente, solo la de clientes; una venta confirmada, solo la de ventas (D-05, D-07).
5. **Manejo de errores** de lectura y de escritura: JSON inválido, almacenamiento no disponible, cuota excedida. La aplicación **no se rompe** en ningún caso: sigue funcionando en memoria (E-01 a E-03).
6. **`README.md` en la raíz**, con las secciones que exige el formato de entrega (§ 5.7).
7. **El registro de los ocho casos manuales** en el README, con el resultado realmente observado, incluidos los que fallen o queden pendientes.
8. **La guía de la comprobación del precio histórico** en el README: dónde está la clave, qué forma tiene y qué se modifica (CA-02).
9. **La declaración de la procedencia de `logo.png`** en el README: la obra, su autor, el enlace a la fuente y la licencia bajo la que se usa, con la línea de crédito que la agencia pide, dejando constancia de que la imagen **no es propia del equipo** (D-15).
10. La **actualización de las dos specs vivas** con los escenarios del § 2.5, en la Fase 2, como delta del change.

### 3.2 Excluido (explícito)

| # | Exclusión | Por qué |
|---|---|---|
| 1 | Pantalla para editar precios | La consigna lo dice: «No se exige una pantalla para editar precios» (p. 5). El precio se cambia a mano, con las herramientas del navegador |
| 2 | Seguridad o integridad garantizada por un servidor | La consigna (p. 1) dice que el almacenamiento «sirve para la práctica; no representa seguridad ni integridad garantizada por un servidor» |
| 3 | Cualquier funcionalidad nueva de los ejercicios 1 a 5 | Solo se permite «los ajustes mínimos necesarios para integrar la persistencia» |
| 4 | Botón de «restaurar los datos de ejemplo» o de «borrar todo» | No lo pide la consigna. Queda como propuesta pendiente (P-02) |
| 5 | Exportar o importar los datos (JSON) | No lo pide la consigna. Queda como propuesta pendiente (P-03) |
| 6 | Persistir la venta **en curso** | No es un registro de la aplicación, es estado de un formulario. Ya está declarado como límite en P-04 del SPEC-06. Queda como P-04 |
| 7 | Persistir editoriales, géneros y autores | La consigna pide «libros, clientes y ventas». Además no hay interfaz para darlos de alta: son catálogos de referencia fijos (D-03) |
| 8 | Persistir la **vista** actual (búsqueda, scroll, pestaña) | No lo pide la consigna |
| 9 | Cifrado, autenticación, sincronización entre equipos | Fuera del alcance técnico: sin API, sin servidor |
| 10 | Dependencias, librerías, frameworks, CDN, npm, herramientas de compilación | La consigna los excluye (p. 1 y p. 6) |
| 11 | Un aviso visible en pantalla cuando el almacenamiento no está disponible | Habría que agregar un contenedor de error a las cinco vistas y romper el contrato del Change 01. Queda como propuesta pendiente (P-05) |

---

## 4. Requisitos, escenarios y casos límite

### 4.1 Requisitos

| ID | Grupo | Requisito verificable | Verificación |
|---|---|---|---|
| **R-01** | Funcional | Tras altas y una venta, al recargar se recuperan libros, clientes y ventas **sin duplicar los ejemplos ni las ventas** | Contar registros antes y después de la recarga; los de ejemplo aparecen una sola vez |
| **R-02** | Estructura e interfaces | Los datos de libros, clientes y ventas se guardan en `localStorage` con **claves y estructura documentadas en el README** | Leer el README y contrastar con lo que hay en el almacenamiento del navegador |
| **R-03** | Datos y estados | En el primer inicio (sin datos guardados) se cargan los ejemplos; en inicios posteriores **no se vuelven a cargar**; las ventas guardadas **conservan precio unitario, subtotales y total** aunque cambie el precio del catálogo guardado | Vaciar el almacenamiento y abrir; volver a abrir; editar el precio guardado y recargar |
| **R-04** | Calidad | Cada caso manual registra el **resultado realmente observado**; ningún caso no ejecutado figura como aprobado; los fallos y pendientes se registran con su comportamiento real | Tabla de los 8 casos en el README, contrastada con la ejecución |
| **R-05** | Compatibilidad | Funciona al abrir `index.html` **sin npm ni servidor**; el README advierte los límites de `localStorage` por **navegador, perfil y ubicación de apertura** | Abrir con `file://` en Edge 155; leer la sección de límites del README |
| **R-06** | Convenciones | `README.md` en la raíz con **todas** las secciones exigidas por el formato de entrega; entrega **sin dependencias instaladas ni herramientas de compilación** | Checklist de secciones contra la consigna p. 6; listado de la raíz del proyecto |

### 4.2 Escenarios observables

**Persistencia**

| ID | Escenario | Verificación |
|---|---|---|
| S-01 | El primer inicio carga los datos de ejemplo | Con el almacenamiento vacío: 9 libros, 4 clientes, 2 ventas |
| S-02 | El primer inicio **escribe** los ejemplos en el almacenamiento | Las tres claves existen con el contenido de la semilla |
| S-03 | El segundo inicio **recupera** lo guardado, sin volver a sembrar | 9 libros, 4 clientes, 2 ventas; la semilla no se reescribe |
| S-04 | Un libro dado de alta sobrevive a la recarga | 10 libros: los 9 de ejemplo + el nuevo, **una sola vez cada uno** |
| S-05 | Un cliente dado de alta sobrevive a la recarga | 5 clientes: los 4 de ejemplo + el nuevo |
| S-06 | Una venta confirmada sobrevive a la recarga | 3 ventas: las 2 de ejemplo + la nueva, **sin duplicar la nueva** |
| S-07 | El libro nuevo **aparece en el catálogo** de otra vista | `index.html` lista 10 filas |
| S-08 | El libro nuevo **aparece en el selector de venta** de otra vista | `ventas.html` ofrece 11 opciones (10 libros + la fija) |
| S-09 | El cliente nuevo **aparece en el selector de venta** | `ventas.html` ofrece 6 opciones (5 clientes + la fija) |
| S-10 | La venta nueva **aparece en el historial** de otra vista | `historial.html` lista 3 ventas |
| S-11 | El detalle de la venta recuperada conserva sus renglones | El bloque de detalle muestra libro, cantidad, precio unitario y subtotal |
| S-12 | **No se duplican** los ejemplos al recargar varias veces | 3 recargas seguidas → 9 libros, 4 clientes, 2 ventas de ejemplo, siempre |
| S-13 | Un ejemplo con el **mismo título** que uno nuevo conviven | El catálogo muestra las dos filas; el identificador del nuevo lleva sufijo (`li-…-2`) |
| S-14 | El correlativo de las ventas sigue al último del año | Tras recuperar 2 ventas de 2026, la primera venta nueva es `vt-2026-0003` |
| S-15 | La venta guardada conserva el **precio unitario** aunque el catálogo guardado cambie | Editar el precio en `libreriaABC.libros`, recargar: el detalle muestra el precio confirmado |
| S-16 | La venta guardada conserva el **total** aunque el catálogo guardado cambie | El total del historial es el mismo antes y después del cambio |
| S-17 | El **subtotal** del detalle se deriva del precio guardado | El subtotal es `cantidad × precioUnitario` guardado, no el precio actual del catálogo |
| S-18 | Lo que se guarda es exactamente el modelo, sin envoltorio | `JSON.parse(clave)` devuelve un **array** de objetos con la forma de la semilla |
| S-19 | Las ventas guardadas **no se editan ni se eliminan** desde la interfaz | El historial ofrece solo «Ver detalle» |
| S-20 | La semilla `DATOS_INICIALES` **no se muta** | El JSON de la semilla antes y después de una sesión con altas es idéntico |
| S-21 | La aplicación **funciona sin almacenamiento** | Con el almacenamiento bloqueado, la app opera en memoria y no lanza error |
| S-22 | Un JSON mal escrito **no rompe** la aplicación | Editar una clave con un JSON inválido: la app arranca con la semilla de esa colección y avisa en la consola |
| S-23 | Borrar una clave desde las herramientas **re-siembra** solo esa colección | Borrar `libreriaABC.clientes` y recargar: vuelven los 4 clientes de ejemplo; libros y ventas intactos |
| S-24 | La app sigue funcionando abriendo **otra copia** del proyecto con `file://` | La copia ve el mismo almacenamiento (mismo origen) |

**Documentación**

| ID | Escenario | Verificación |
|---|---|---|
| S-25 | El README nombra a **quienes realizan el trabajo** | Sección «Integrantes» |
| S-26 | El README explica **cómo abrir `index.html` sin npm** | Sección «Cómo abrir el proyecto» |
| S-27 | El README describe la **navegación entre las cinco vistas** | Sección «Navegación» |
| S-28 | El README separa **funcionalidades implementadas y pendientes** | Dos secciones distintas |
| S-29 | El README dice **dónde están los datos iniciales** | Sección «Los datos iniciales» con la ruta y el conteo |
| S-30 | El README explica **cómo funciona `localStorage`** y **cuáles son sus límites** | Sección «La persistencia» con los límites medidos |
| S-31 | El README identifica **la clave y la estructura** del catálogo guardado | Sección «La comprobación del precio histórico» |
| S-32 | El README registra el **resultado de los ocho casos** | Tabla de ocho filas con el resultado observado |
| S-33 | El README declara la **procedencia de las imágenes ajenas** | Sección «Imágenes» |
| S-34 | El README no afirma **ningún caso no ejecutado** como aprobado | Revisión de la tabla de casos |

### 4.3 Casos límite

| ID | Caso | Comportamiento esperado | Por qué importa |
|---|---|---|---|
| E-01 | La clave de libros contiene un **JSON inválido** | `JSON.parse` falla → la app usa la semilla de esa colección en memoria, **no** sobrescribe la clave rota, y deja un aviso en la consola | El docente edita el JSON a mano; un error de tipeo no puede romper la app |
| E-02 | El navegador **no permite** `localStorage` (modo privado estricto, política de la organización) | La app **no se rompe**: opera en memoria, avisa en la consola y el README lo dice | R-05 exige que la app funcione al abrir el archivo |
| E-03 | Se **excede la cuota** (~5 MB por origen) | `setItem` lanza `QuotaExceededError` → la app sigue en memoria y avisa en la consola | Con estos volúmenes es improbable, pero el fallo no puede ser silencioso |
| E-04 | La persona usuaria **borra los datos del navegador** | Todo vuelve al primer inicio: 9 libros, 4 clientes, 2 ventas | Es el comportamiento esperado y hay que documentarlo |
| E-05 | Hay **dos pestañas abiertas** al mismo tiempo y en una se registra algo | La última escritura gana: la otra pestaña puede perder el registro nuevo al guardar | Es inherente a `localStorage`; se documenta como límite |
| E-06 | Se **recarga** con una venta a medio componer | La venta en curso se pierde; el cliente y los libros ya registrados **no** | La venta en curso es estado de formulario (P-04) |
| E-07 | Se borra solo la clave de **ventas** | Se re-siembran las 2 ventas de ejemplo y el correlativo vuelve a `vt-2026-0003` | Consecuencia de la regla «la ausencia de una clave es un primer inicio de esa colección» |
| E-08 | La app se abre por **`http://localhost`** y luego con **`file://`** | Son orígenes distintos: cada uno tiene su almacenamiento | Es el límite «depende de la ubicación de apertura» |
| E-09 | La **copia del proyecto** se abre con `file://` | Ve el mismo almacenamiento que el original (mismo origen `file://`) | Es lo que va a pasar en el caso 6; hay que anticiparlo en el README |
| E-10 | El docente edita el precio y **no** toca las ventas | La venta conserva precio, subtotales y total | Es exactamente el caso 6 de la consigna |

---

## 5. Estructura, componentes e interfaces propuestas

### 5.1 Archivos

| Archivo | Acción | Contenido |
|---|---|---|
| `js/persistencia.js` | **Nuevo** | La única capa que habla con `localStorage`: claves, lectura, escritura, siembra y detección de disponibilidad |
| `js/datos.js` | **Modificado** | `iniciarDatos()` hidrata desde lo guardado; `agregarLibro()`, `agregarCliente()` y `agregarVenta()` guardan su colección |
| `js/inicio.js` | **Modificado** | Solo el encabezado de comentarios (línea de change) — el arranque no cambia: `iniciarDatos()` sigue siendo el punto de hidratación |
| `js/datos-iniciales.js` | **Sin cambios** | La semilla no se muta |
| `js/catalogo.js`, `js/altas.js`, `js/ventas.js`, `js/historial.js`, `js/validaciones.js` | **Sin cambios** | No les corresponde la persistencia |
| Los 5 archivos HTML | **Modificados**: una etiqueta `<script src="js/persistencia.js"></script>` por vista, y nada más (desvío D-A del `design.md`) | Ninguna vista necesita un control nuevo ni cambia un `id`, una clase o un texto visible |
| `css/estilos.css` | **Sin cambios** | La persistencia no cambia la presentación |
| `README.md` | **Nuevo** | En la raíz del proyecto |
| `docs/07-persistencia-readme/SPEC.md` | **Nuevo** | Este documento |
| `docs/07-persistencia-readme/PLAN.md` | **Nuevo** (Fase 2) | Checklist de tareas atómicas |
| `openspec/changes/07-persistencia-readme/` | **Nuevo** (Fase 2) | `proposal.md`, `design.md`, `tasks.md` y las delta specs |

### 5.2 Mapa de módulos

```
  js/datos-iniciales.js        la SEMILLA: 9 libros, 4 clientes, 2 ventas (no se muta)
          │
          v
  js/persistencia.js   ◀── NUEVO ── la única capa que habla con localStorage
    │  CLAVE_LIBROS / CLAVE_CLIENTES / CLAVE_VENTAS
    │  leerGuardado(clave) · escribirGuardado(clave, valor)
    │  hayGuardado(clave) · guardarColeccion(clave, valor)
    │  almacenamientoDisponible()
          │
          v
  js/datos.js          el MODELO: `estado` vivo, consultas, altas, ventas
    │  iniciarDatos()   -> hidrata desde lo guardado, siembra lo que falta
    │  agregarLibro()   -> estado.libros   + guardarLibros()
    │  agregarCliente() -> estado.clientes + guardarClientes()
    │  agregarVenta()   -> estado.ventas   + guardarVentas()
          │
          v
  js/catalogo.js · js/altas.js · js/ventas.js · js/historial.js   (sin cambios)
          │
          v
  js/inicio.js         el ARRANQUE: `alCargar()` -> `iniciarDatos()` + `pintarVistaActual()`
```

La dependencia va **en un solo sentido**: `datos.js` conoce `persistencia.js`; `persistencia.js` no conoce el modelo ni el DOM. Es la misma disciplina de separación que ya usa el proyecto (la semilla, el modelo, el render, el arranque y las reglas puras están en archivos separados).

### 5.3 Interfaces

`js/persistencia.js` expone:

| Función | Contrato |
|---|---|
| `CLAVE_LIBROS` | La constante `"libreriaABC.libros"` |
| `CLAVE_CLIENTES` | La constante `"libreriaABC.clientes"` |
| `CLAVE_VENTAS` | La constante `"libreriaABC.ventas"` |
| `almacenamientoDisponible()` | `true` si `window.localStorage` existe y se puede escribir; `false` en caso contrario. Nunca lanza |
| `leerGuardado(clave)` | Devuelve el valor leído y **`null`** si no hay nada, si el JSON está mal escrito o si el almacenamiento no está disponible. **Nunca lanza** |
| `escribirGuardado(clave, valor)` | Escribe el valor serializado. Devuelve `true` si se escribió, `false` si no se pudo. **Nunca lanza** |
| `hayGuardado(clave)` | `true` si la clave existe (aunque su contenido sea inválido: la clave existe, el contenido no) |
| `guardarLibros()` / `guardarClientes()` / `guardarVentas()` | Escriben la colección correspondiente del `estado` vivo |

Y `js/datos.js` cambia en dos puntos:

```
  iniciarDatos()                                  agregarLibro() / agregarCliente() / agregarVenta()
  ┌──────────────────────────┐                    ┌───────────────────────────────────────┐
  │ por cada colección:      │                    │  ... la mutación sobre `estado` ...    │
  │   si hayGuardado(clave)  │                    │                                       │
  │     estado.x = leer(...) │                    │  guardarLibros()   // o guardarClientes()
  │   si no                  │                    │  guardarVentas()   // o guardarVentas()
  │     estado.x = semilla   │                    │                                       │
  │     y se escribe         │                    │  -> escribe SOLO su clave               │
  └──────────────────────────┘                    └───────────────────────────────────────┘
```

### 5.4 Forma de los datos guardados

Cada clave guarda **un array JSON**, con los mismos objetos que ya usa el modelo. Sin envoltorio, sin metadatos, sin versión.

```
  localStorage["libreriaABC.libros"] = JSON.stringify([ ... 9 o 10 libros ... ])
  localStorage["libreriaABC.clientes"] = JSON.stringify([ ... 4 o 5 clientes ... ])
  localStorage["libreriaABC.ventas"] = JSON.stringify([ ... 2 o 3 ventas ... ])
```

La forma de cada elemento es **exactamente** la del modelo, que ya es la de la semilla:

```js
// libreriaABC.libros — un elemento
{
  "id": "li-hobbit",
  "titulo": "El Hobbit",
  "isbn": "9789507324786",
  "editorialId": "ed-planeta",
  "generoId": "gen-fantasia",
  "autorIds": ["au-tolkien"],
  "precio": 21900
}

// libreriaABC.clientes — un elemento
{ "id": "cl-martina-ferreyra", "nombre": "Martina Ferreyra", "email": "martina.ferreyra@example.com" }

// libreriaABC.ventas — un elemento
{
  "id": "vt-2026-0003",
  "fecha": "2026-10-20",
  "clienteId": "cl-martina-ferreyra",
  "clienteNombre": "Martina Ferreyra",
  "renglones": [
    { "libroId": "li-hobbit", "titulo": "El Hobbit", "cantidad": 2, "precioUnitario": 21900 }
  ],
  "total": 43800
}
```

Tres propiedades de esta forma que importan:

- **El renglón no guarda el subtotal**: se deriva como `cantidad × precioUnitario`, igual que en la semilla. Así el detalle no puede desincronizarse del total.
- **La venta guarda el precio congelado**: es lo que hace posible el caso 6.
- **La venta guarda copias descriptivas** (`titulo`, `clienteNombre`): el historial se puede leer aunque el catálogo cambie.

**Lo que NO se guarda**: `editorialId`, `generoId` y `autorIds` apuntan a las colecciones de la semilla, que se rehidratan siempre desde `DATOS_INICIALES` (D-03). Como esas tres colecciones no cambian, las referencias siguen válidas.

### 5.5 Cuándo se guarda

| Momento | Qué se escribe | Qué NO se escribe |
|---|---|---|
| Apertura de una vista, **solo si falta** una clave | Esa colección, sembrada con la semilla | Las colecciones que ya existían |
| Alta de libro aceptada | `libreriaABC.libros` | Las otras dos |
| Alta de cliente aceptada | `libreriaABC.clientes` | Las otras dos |
| Venta confirmada | `libreriaABC.ventas` | Las otras dos |
| Búsqueda, navegación, edición de la venta en curso | Nada | — |

**Por qué una clave por colección y no una sola** (D-02, D-05): el caso 6 exige que el docente modifique «únicamente el precio del libro dentro del catálogo guardado, **sin modificar ni borrar las ventas guardadas**». Con claves separadas, la edición es sobre un array plano de 9-10 libros y las ventas quedan intactas. Además, con claves separadas, un alta de venta **no** reescribe el catálogo: la edición manual del precio sobrevive a la venta siguiente.

### 5.6 La hidratación, paso a paso

```
  abrir index.html
        │
        v
  iniciarDatos()
        │
        ├─ hayGuardado("libreriaABC.libros")?     ── sí ──▶  estado.libros   = leerGuardado(...)
        │                                                      (null si el JSON está roto → semilla)
        │                                            ── no ──▶  estado.libros   = semilla
        │                                                      y guardarLibros()   ← siembra
        ├─ idem con clientes
        └─ idem con ventas
        │
        v
  estado = { libros, editoriales, generos, autores, clientes, ventas }
        │        (editoriales, generos y autores: SIEMPRE de la semilla)
        v
  pintarVistaActual()  →  el catálogo dibuja lo que hay en `estado`
```

**La regla que evita el duplicado** es una sola: *la ausencia de una clave significa «primer inicio de esa colección», y la presencia significa «recuperar»*. No hay ningún contador, ninguna marca de tiempo y ninguna bandera en el almacenamiento. Por eso recargar tres veces seguidas no duplica nada (S-12): la segunda vez la clave ya existe.

### 5.7 Estructura del `README.md`

El README tiene que contener **todas** las secciones que el formato de entrega exige (consigna p. 6) y, además, lo que este prompt pide. Estructura propuesta:

| # | Sección | Contenido | Origen de la exigencia |
|---|---|---|---|
| 1 | **Integrantes** | Quiénes realizan el trabajo y qué parte del parcial hizo cada una: **Julieta Cecilia Herrera** — ejercicios 4, 5 y 6 (altas de libros y clientes, venta simulada e historial, persistencia y documentación); **María de los Angeles Zalazar** — ejercicios 1, 2 y 3 (estructura HTML y navegación, CSS adaptable, datos locales, catálogo y filtro) | Consigna p. 6 |
| 2 | **Cómo abrir el proyecto** | Pasos para abrir `index.html` en el navegador sin npm: doble clic en `index.html`, o elegir «Abrir con» un navegador. Nota de que **no hace falta** servidor, npm ni compilación | Consigna p. 6 |
| 3 | **Navegación entre las vistas** | Las cinco vistas y cómo se llega a cada una | Consigna p. 6 |
| 4 | **Funcionalidades implementadas** | Lo que hace la aplicación, ejercicio por ejercicio | Consigna p. 6 |
| 5 | **Funcionalidades pendientes** | Lo que **no** se hizo, y por qué | Consigna p. 6 |
| 6 | **Los datos iniciales** | Dónde están (`js/datos-iniciales.js`), qué contienen (9 libros, 4 clientes, 2 ventas) y que son ficticios | Consigna p. 6 |
| 7 | **La persistencia** | Qué se guarda, en qué claves, con qué forma, cuándo se escribe, y **los límites**: navegador, perfil, ubicación de apertura, cuota, borrado, dos pestañas | Consigna p. 5 y p. 6 |
| 8 | **La comprobación del precio histórico** | La guía paso a paso para repetir el caso 6: dónde abrir las herramientas de almacenamiento, qué clave editar, qué campo cambiar, qué no tocar, qué se espera ver | Consigna p. 5 (CA-02) |
| 9 | **Casos manuales** | La tabla de los ocho casos con el **resultado observado** | Consigna p. 5 (R-04) |
| 10 | **Imágenes** | La procedencia de `logo.png` | Consigna p. 6 |
| 11 | **La entrega** | Qué contiene la carpeta entregada y la ausencia de dependencias y de herramientas de compilación | Consigna p. 6 |
| 12 | **Tecnologías y estructura** | HTML, CSS y JavaScript nativos; el árbol de archivos | Consigna p. 1 y p. 6 |

La sección 7 incluye los límites **medidos** (§ 2.4), no los de manual:

- **depende del navegador**: cada navegador decide su cuota y sus políticas; en modo privado estricto puede negarse;
- **depende del perfil**: los datos son del perfil del navegador y del sistema operativo, no de la aplicación;
- **depende de la ubicación de apertura**: `file://` y `http://localhost` son orígenes distintos, y cada uno tiene su almacenamiento; con `file://`, **todas las rutas locales comparten el mismo origen**, así que una copia del proyecto abierta con `file://` ve los mismos datos que el original;
- **no comparte información entre usuarios**: otra persona, con otro perfil del mismo navegador o en incógnito, ve la aplicación sin los datos registrados;
- **se puede borrar** desde las herramientas del navegador o al limpiar los datos de navegación;
- **la cuota es de unos 5 MB por origen**: con estos volúmenes no es un problema;
- **no hay seguridad**: cualquiera que abra la aplicación en ese origen puede leer y escribir los datos.

### 5.8 Reglas de la implementación

1. JavaScript nativo, en el estilo del proyecto: `"use strict"`, `const`/`let`, funciones declaradas con nombre, `var` nunca, punto y coma siempre, comentarios en español que explican el porqué.
2. **Scripts clásicos**, nunca módulos ES: con `file://` el `import` está bloqueado.
3. **Una responsabilidad por archivo**: `js/persistencia.js` solo habla con el almacenamiento; no toca el DOM ni conoce el modelo.
4. **Ninguna función de la capa de persistencia lanza excepciones**: todo error se captura y se traduce en un valor de retorno.
5. Los datos recuperados del almacenamiento **se insertan en el DOM como texto**, como todo lo demás.
6. Los datos guardados **se validan por forma antes de usarse**: si un libro guardado no tiene `id` o `precio`, la colección se descarta y se usa la semilla. Un almacenamiento manipulado a mano no puede romper la aplicación.
7. No se agregan dependencias, recursos externos, estilos en línea ni manejadores en atributos.
8. No se modifica ningún `id`, clase ni texto visible del HTML.
9. La semilla `DATOS_INICIALES` no se muta.
10. Los mensajes que ve la persona usuaria son los que ya existen: `#mensaje-exito` para el resultado de una operación y los `#*-mensaje-error` de cada vista para los rechazos. **La persistencia no agrega mensajes**: si el almacenamiento falla, la app sigue funcionando y el aviso va a la consola.

---

## 6. Estados y manejo de errores

### 6.1 Al leer

| Situación | Qué hace la aplicación | Qué ve la persona usuaria |
|---|---|---|
| La clave no existe | Se usa la semilla de esa colección y se escribe la clave | Los datos de ejemplo, como siempre |
| La clave existe y su JSON es válido | Se usa lo guardado | Los datos guardados |
| La clave existe pero su JSON está mal escrito | Se usa la semilla de esa colección, **la clave no se sobrescribe**, y se avisa en la consola con el nombre de la clave y el error | Los datos de ejemplo; el aviso está en la consola |
| La clave existe pero su contenido no tiene la forma de la colección (no es un array, o a un elemento le falta un campo obligatorio) | Igual que el caso anterior | Ídem |
| El almacenamiento no está disponible | Se usa la semilla, la app opera en memoria y se avisa en la consola | La app funciona, sin persistencia |

### 6.2 Al escribir

| Situación | Qué hace la aplicación | Qué ve la persona usuaria |
|---|---|---|
| La escritura funciona | Se guarda | El mensaje de éxito de la operación |
| `QuotaExceededError` (cuota excedida) | La app sigue en memoria, avisa en la consola y **no interrumpe** la operación | El mensaje de éxito normal: el registro está en pantalla, pero no quedó guardado |
| El almacenamiento no está disponible | Ídem | Ídem |
| El valor no se puede serializar (ciclo en los datos) | Se avisa en la consola y no se escribe | Ídem |

**La decisión de fondo**: un fallo del almacenamiento **nunca** interrumpe la operación ni muestra un error al usuario. La aplicación es una simulación local: si el navegador no quiere guardar, la app sigue funcionando y el README explica por qué. La otra alternativa —mostrar un error— sería más ruidosa y, en el caso de un almacenamiento bloqueado por política, dejaría la aplicación inutilizable (R-05 exige que funcione al abrir el archivo).

### 6.3 Qué se avisa y dónde

| Canal | Cuándo | Contenido |
|---|---|---|
| Consola del navegador (`console.warn`) | Fallo de lectura, de escritura o almacenamiento no disponible | La clave involucrada y el motivo, en texto legible |
| `#mensaje-exito` / `#*-mensaje-error` | **Nunca** por un problema de almacenamiento | — |

No se agrega un contenedor de error a las cinco vistas: eso rompería el contrato del Change 01 (ningún `id` nuevo ni texto visible nuevo) sin que la consigna lo pida. Queda anotado como propuesta pendiente (P-05).

### 6.4 Lo que **no** es un error

- **Borrar los datos del navegador** y volver a abrir: es un primer inicio, no un fallo.
- **Recargar con la venta en curso**: la venta en curso se pierde (P-04), y es lo esperado.
- **Ver la aplicación sin datos** en el perfil de otra persona: es el comportamiento normal de un almacenamiento local.

---

## 7. Restricciones técnicas y convenciones

| # | Restricción | Origen |
|---|---|---|
| 1 | HTML, CSS y JavaScript nativos. Sin librerías, frameworks ni CDN | Prompt, consigna p. 1 y p. 6 |
| 2 | Sin `fetch`, API, base de datos ni servidor | Prompt, consigna p. 1 |
| 3 | Sin npm ni herramientas de compilación | Prompt, consigna p. 6 |
| 4 | Debe funcionar abriendo los archivos con `file://` | Prompt, consigna p. 6 |
| 5 | Los scripts **no pueden ser módulos ES**: con `file://` el `import` está bloqueado | Verificado en Edge headless en el Change 03 |
| 6 | `localStorage` **sí** se usa en este change | Prompt, consigna p. 5 (es el objeto del Ejercicio 6) |
| 7 | Los datos del modelo se insertan en el DOM como texto | Consigna p. 3 |
| 8 | Sin estilos en línea, sin `<style>`, sin atributos `on*` | Contrato del Change 02 |
| 9 | Funciones acotadas, con una responsabilidad y nombres comprensibles | Consigna p. 6 |
| 10 | Los identificadores existentes del HTML no se modifican | Contrato del Change 01 |
| 11 | El `README.md` va en la **raíz** del proyecto | Consigna p. 6 |
| 12 | La entrega no incluye dependencias instaladas ni herramientas de compilación | Consigna p. 6 |
| 13 | Ningún caso de prueba se declara aprobado sin haberlo ejecutado | Consigna p. 5, prompt (R-04) |

---

## 8. Criterios de aceptación

| ID | Criterio | Requisitos | Verificación |
|---|---|---|---|
| **CA-01** | **Primer inicio:** se cargan los ejemplos; **recarga posterior:** se recuperan los datos sin duplicar ejemplos ni ventas | R-01, R-03 | Vaciar el almacenamiento y abrir → 9 libros, 4 clientes, 2 ventas. Dar de alta un libro, un cliente y una venta, recargar → 10, 5 y 3. Recargar tres veces más → los mismos 10, 5 y 3 |
| **CA-02** | Las **claves y la estructura** de `localStorage` están identificadas en el README y permiten reproducir la comprobación del precio histórico | R-02 | Leer la sección 8 del README y seguirla al pie de la letra: editar `libreriaABC.libros`, cambiar `precio` de un elemento, recargar y ver el detalle de la venta |
| **CA-03** | La venta confirmada conserva **precio unitario, subtotales y total** tras modificar el precio del catálogo guardado y recargar | R-03 | Con una venta de 2 × 1500 y 1 × 2000 (total 5000): editar el precio del libro en `libreriaABC.libros`, recargar, consultar el detalle → 1500, 2000, subtotales 3000 y 2000, total 5000 |
| **CA-04** | El README contiene **todas** las secciones exigidas y los resultados observados de los casos manuales, con los fallos y pendientes registrados tal cual | R-04, R-06 | Checklist de las 12 secciones del § 5.7 contra el README; tabla de los 8 casos con el resultado real |
| **CA-05** | El mismo conjunto de datos se ve **en las cinco vistas** | R-01 | Tras dar de alta un libro, un cliente y una venta: el catálogo muestra el libro, el selector de venta lo ofrece, el selector de clientes lo ofrece y el historial muestra la venta con su detalle |
| **CA-06** | La aplicación **funciona con `file://`**, sin servidor, y el README advierte los límites de `localStorage` | R-05 | Edge 155.0.4283.62 con `file://`: las tres claves se escriben y se recuperan; la sección de límites del README nombra navegador, perfil y ubicación de apertura |
| **CA-07** | Un almacenamiento **no disponible o corrupto** no rompe la aplicación | R-05 | Con el almacenamiento bloqueado y con un JSON inválido: la app abre, dibuja y opera, sin excepción en la consola |
| **CA-08** | La entrega no incorpora trabajo excluido y no tiene dependencias | R-06 | Búsquedas de `fetch(`, `http://`, `cdn`, `import `, `require(` en el proyecto → 0 coincidencias; sin `package.json` ni `node_modules`; `logo.png` sin cambios |
| **CA-09** | Ningún control no ejecutado se presenta como aprobado | R-04 | Revisión de la tabla de casos del README contra el informe de comprobaciones: cada fila tiene un resultado real o un motivo de pendiente |

Además, con lo pedido por el prompt: los controles **aprobados, fallidos, omitidos y pendientes** se distinguen en el informe de la Fase 3, y **ningún control no ejecutado se presenta como aprobado**.

---

## 9. Supuestos, información pendiente y decisiones

### 9.1 Supuestos

| ID | Supuesto | Si fuera falso |
|---|---|---|
| A-01 | El HTML de las cinco vistas no necesita cambios: no hay que agregar contenedores ni controles | Habría que revisar el contrato del Change 01 y justificar cada cambio |
| A-02 | La semilla `DATOS_INICIALES` no se muta y sigue siendo la fuente de los datos de ejemplo | El Ejercicio 6 perdería la semilla original |
| A-03 | El volumen es pequeño (9 libros, 4 clientes, 2 ventas): la cuota de `localStorage` no es un problema | Habría que revisar el caso E-03 |
| A-04 | El docente va a repetir la comprobación del precio histórico en una copia del proyecto, como dice la consigna | Si la repite sobre el proyecto original, la edición del precio queda en el almacenamiento del original |
| A-05 | El JSON del almacenamiento se puede editar a mano y puede quedar mal escrito | Habría que revisar el comportamiento de E-01 |
| A-06 | Cada vista es un documento separado: la hidratación ocurre al abrir cada una | Habría que revisar el comportamiento de dos pestañas (E-05) |
| A-07 | El docente abre la aplicación con `file://` o con un servidor local; en los dos casos `localStorage` está disponible | Habría que revisar el caso E-02 |
| A-08 | La imagen `logo.png` es de terceros y su procedencia no está documentada en el repositorio | Habría que corregir la sección de imágenes del README |

### 9.2 Decisiones

| ID | Decisión | Respuesta | Consecuencia en esta entrega |
|---|---|---|---|
| **D-01** | Numeración del change y de los documentos | **07** | El prompt pide «Change 06» porque su numeración sigue a los ejercicios del parcial, pero el `06` ya lo ocupa `06-venta-historial`. Misma decisión que se tomó en el Change 06 (D-03) y en el Change 05 (D-07). **Confirmada por la persona usuaria el 20/10/2026** |
| **D-02** | Nombres de las claves de `localStorage` | **`libreriaABC.libros`, `libreriaABC.clientes`, `libreriaABC.ventas`** | Tres claves, una por colección. El prefijo `libreriaABC.` evita colisiones con otras aplicaciones del mismo origen. **Confirmada el 20/10/2026** |
| **D-03** | Qué colecciones se guardan | **Libros, clientes y ventas. No editoriales, géneros ni autores** | Es lo que pide la consigna. Los otros tres catálogos son de referencia, no tienen interfaz de alta, y se rehidratan siempre desde la semilla |
| **D-04** | Dónde vive la persistencia | **En un archivo nuevo, `js/persistencia.js`**, que es la única capa que habla con `localStorage` | Una responsabilidad por archivo, como en el resto del proyecto. `datos.js` llama a `persistencia.js`; la dependencia va en un solo sentido |
| **D-05** | Cuándo y qué se guarda | **En el momento de la mutación, y solo la colección afectada** | Un alta de venta no reescribe el catálogo: la edición manual del precio sobrevive a la venta siguiente, que es justo lo que hace el caso 6 |
| **D-06** | Qué significa «primer inicio» | **La ausencia de una clave**, colección por colección | No hace falta contador ni marca de tiempo. Si falta una clave, se siembra esa colección; si existe, se recupera. Por eso recargar no duplica nada |
| **D-07** | Dónde se dispara el guardado | **Dentro del modelo**: `agregarLibro()`, `agregarCliente()` y `agregarVenta()` guardan su colección | El estado guardado no puede divergir del estado vivo: no hay ningún camino de alta que «se olvide» de guardar. Son los tres únicos caminos de mutación |
| **D-08** | Formato de lo guardado | **Un array JSON por clave, con la forma exacta del modelo** | Sin envoltorio ni metadatos: lo que se lee es lo que hay en el modelo, y el docente puede leerlo y editarlo a mano |
| **D-09** | Numeración del change de OpenSpec | **`07-persistencia-readme`** | Sigue la convención del archivo: `01`…`06` ya están archivados |
| **D-10** | Quién ejecuta los casos manuales | **El agente los ejecuta y registra los resultados reales** | Los casos 1 a 5 y el 8 ya están ejecutados y verificados (§ 2.3). Los casos 6 y 7 se ejecutarán tras implementar. **Confirmada el 20/10/2026** |
| **D-11** | Cómo se declara la procedencia de `logo.png` | **Se declara en el README como imagen ajena al equipo, con su autor, su enlace y su licencia** | Es lo que exige la consigna. La obra es de **Chetsadakorn Nakhammoon** (ilustración «ID 220305499» de Dreamstime), descargada de esa página por **María de los Angeles Zalazar**, a cargo del Ejercicio 1, con su cuenta. El README declara los cuatro datos y la línea de crédito «ID 220305499 © Chetsadakorn Nakhammoon \| Dreamstime.com», y deja constancia de que la imagen no es obra del equipo |
| **D-12** | La venta en curso **no** se persiste | **Se pierde al recargar** | Es estado de un formulario, no un registro. Ya declarado como límite en P-04 del SPEC-06. El README lo dice entre los límites |
| **D-13** | El README **no** ofrece un botón de «restaurar datos» | **No se implementa** | No lo pide la consigna. Queda como propuesta pendiente (P-02) |
| **D-14** | Un fallo del almacenamiento **no** interrumpe la operación | **La app sigue en memoria y avisa en la consola** | R-05 exige que la app funcione al abrir el archivo. Un error visible dejaría la aplicación inutilizable si el navegador bloquea el almacenamiento (P-05) |

| **D-15** | Si se reemplaza `logo.png` por un recurso propio | **No: la imagen se mantiene y se documenta** | La licencia Libre de Derechos de Dreamstime cubre el uso educativo, la descarga la hizo **María de los Angeles Zalazar** —a cargo del Ejercicio 1— con su cuenta, y la imagen es parte de ese ejercicio. Sustituirla ampliaría el alcance de este change sin que la consigna lo pida: obligaría a tocar los cinco HTML y a modificar la spec `presentacion-css`, cuyo requirement nombra `logo.png`. Queda como propuesta para una versión posterior (P-07) |
| **D-16** | Cómo se reparten las firmas en el README | **Por ejercicio**: la sección de integrantes dice qué parte del parcial hizo cada persona | El trabajo es de dos personas: **Julieta Cecilia Herrera** a cargo de los ejercicios 4 a 6 (altas, ventas e historial, persistencia y documentación) y **María de los Angeles Zalazar** a cargo de los ejercicios 1 a 3 (HTML, CSS, catálogo y filtro). La consigna pide identificar a quienes realizan el trabajo; el reparto por ejercicio documenta un trabajo compartido |

### 9.3 Información pendiente

| ID | Dato | Efecto | Estado |
|---|---|---|---|
| PD-01 | ~~**Nombres de los integrantes del trabajo**~~ | **Resuelto el 20/10/2026**: **Julieta Cecilia Herrera** (ejercicios 4 a 6) y **María de los Angeles Zalazar** (ejercicios 1 a 3) | Ya no bloquea la sección 1 del README. El reparto por ejercicio queda escrito en § 5.7 y en D-16 |
| PD-02 | ~~**Procedencia de `logo.png`**~~ | **Resuelto el 20/10/2026**: obra de Chetsadakorn Nakhammoon, ilustración «ID 220305499» de Dreamstime, descargada por la coautora a cargo del Ejercicio 1 con su cuenta; uso educativo cubierto por la licencia Libre de Derechos de la agencia | Ya no bloquea la sección de imágenes del README: la sección 10 se escribe con los cuatro datos (D-11, D-15) |
| PD-03 | Navegador de referencia del docente | Edge 155.0.4283.62 es el que hay instalado; Firefox no está | No bloquea: se verifica en Edge y se declara en el README |
| PD-04 | Modalidad y canal de entrega | «El docente comunica por separado las fechas, el canal de entrega y la modalidad de trabajo» (consigna p. 6) | No bloquea: la sección 11 del README describe el contenido de la carpeta entregada |

### 9.4 Lo que este SPEC no decide

- El contenido línea por línea de cada función: es implementación, no contrato.
- El nombre exacto de las funciones internas de `js/persistencia.js`: el contrato (qué devuelven, qué no lanzan) está en § 5.3; los nombres, no.
- Si el aviso de consola del almacenamiento usa `console.warn` o `console.error`: es un detalle de implementación, con la condición de que sea texto legible.
- Si la semilla se escribe en las tres claves al abrir la primera vista o solo en la que falta: la consecuencia observable es la misma; se decide en el PLAN.
- Cómo se comporta la aplicación si el docente **agrega** una clave nueva con un nombre inventado: se ignora, sin efecto. No hay decisión que tomar.

### 9.5 Propuestas pendientes (detectadas y **no** implementadas)

| ID | Propuesta | Dónde | Por qué no se implementa |
|---|---|---|---|
| P-01 | Reemplazar `logo.png` por un recurso propio —por ejemplo, un SVG de un libro abierto en la paleta del proyecto, con fondo transparente y de menos de 1 KB— que además dejaría de usar una imagen ajena | `logo.png`, los cinco HTML, `presentacion-css` | Resuelto **en contra** por D-15: la imagen se mantiene y se documenta. Se deja anotada por si el docente pidiera una marca propia en una versión posterior |
| P-02 | Un botón «Restaurar los datos de ejemplo» que borre las tres claves y vuelva a sembrar | `js/persistencia.js` | No lo pide la consigna. El docente puede borrar las claves con las herramientas del navegador |
| P-03 | Exportar e importar los datos en un archivo JSON | `js/persistencia.js` | No lo pide la consigna |
| P-04 | La venta en curso se pierde al recargar o al cambiar de vista | `js/ventas.js` | Es estado de un formulario. Con `localStorage` se podría persistir, pero no está en el alcance de la consigna |
| P-05 | Un aviso **visible** cuando el almacenamiento no está disponible o el JSON está roto | Las cinco vistas | Exigiría un contenedor nuevo en cada vista y rompería el contrato del Change 01 |
| P-06 | Registrar en `localStorage` la fecha de la última modificación, para poder mostrar «Última actualización: …» | `js/persistencia.js` | No lo pide la consigna, y agregaría una clave que el docente tendría que ignorar al editar el catálogo |
| P-07 | Quitarle el fondo blanco a `logo.png` —la imagen tiene fondo opaco y la cabecera es `#FAFAF8`— para que no se perciba como un parche | `logo.png` | La licencia de Dreamstime permite modificar el medio, así que es lícito. No se hace en este change: el `logo.png` es del Ejercicio 1, a cargo de **María de los Angeles Zalazar**, y tocarlo sin consultarla sería decidir sobre el trabajo de otra persona. Queda anotado por si el equipo lo acuerda |

---

## 10. Trazabilidad

| Requisito | Elementos del SPEC |
|---|---|
| R-01 | §1 (resultado esperado, puntos 1-4), §3.1 (1-5), §4.2 (S-01 a S-14), §5.6, §8 (CA-01, CA-05) |
| R-02 | §3.1 (6, 8), §4.2 (S-18, S-31), §5.4, §5.5, §5.7 (secciones 7 y 8), §8 (CA-02) |
| R-03 | §3.1 (1, 3), §4.2 (S-01 a S-03, S-12, S-14 a S-17), §4.3 (E-07, E-10), §5.4, §5.6, §8 (CA-01, CA-03) |
| R-04 | §2.3, §3.1 (7), §4.2 (S-32, S-34), §5.7 (sección 9), §8 (CA-04, CA-09) |
| R-05 | §1 (resultado esperado, punto 5), §2.4, §3.1 (5), §4.2 (S-21 a S-24), §4.3 (E-01 a E-03, E-08, E-09), §6, §7, §8 (CA-06, CA-07) |
| R-06 | §3.1 (6, 9, 10), §4.2 (S-25 a S-34), §5.7, §7, §8 (CA-04, CA-08) |

---

> **Estado:** este SPEC v1 se presenta para revisión. Habilita el PLAN (Fase 2) y, con la autorización posterior de la persona usuaria, la implementación (Fase 3). **Ninguna línea de código del producto se modificó al escribir este documento.**
