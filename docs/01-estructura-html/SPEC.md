# SPEC — Change 01: Estructura y pantallas HTML

| Campo | Valor |
|---|---|
| Change | 01 — Estructura y pantallas HTML (Ejercicio 1 · 20 puntos) |
| Fase | SPEC (Fase 1) |
| Versión | **v2** — incorpora el PDF de la consigna y las decisiones D-01/D-02 |
| Estado | **Implementado, verificado y archivado** el 19/10/2026 (`openspec/changes/archive/2026-10-19-01-estructura-html/`). Pendiente de la persona usuaria: recorrido por teclado y confirmación visual en Edge 155 |
| Registro | El change de OpenSpec se registró **después** de la implementación, como reconstrucción a posteriori. La especificación y el plan de este documento sí precedieron al código. |
| Fecha | 19/10/2026 |
| Proyecto | Parcial 1 de Programación III — frontend de una librería (UTN, Tecnicatura Universitaria en Programación) |
| Nombre de la librería | **Librería ABC** |
| Ruta del documento | `docs/01-estructura-html/SPEC.md` (confirmada) |
| Ubicación de los HTML | Raíz del proyecto (confirmada) |
| Fuentes | `prompts/PROMPT-01-estructura-html.md` + `docs/Consigna Primer Parcial.pdf` (6 páginas) |

---

## 1. Problema, objetivo y resultado esperado

**Problema.** El frontend de la librería no existe como producto: el proyecto no contiene todavía ningún archivo HTML, CSS ni JavaScript. Sin una estructura de pantallas definida, los ejercicios siguientes (estilos, datos locales, validaciones, ventas, persistencia) no tienen sobre qué apoyarse ni un contrato de identificadores estable que puedan consumir.

**Objetivo de esta entrega.** Construir la estructura HTML de las cinco vistas del sistema —Catálogo, Libros, Clientes, Ventas e Historial— con navegación clara entre ellas, HTML5 semántico, formularios accesibles, tablas con encabezados y contenedores de estado (vacío, sin resultados, éxito, rechazo) listos para ser manipulados por JavaScript en ejercicios posteriores.

**Resultado esperado.** Cinco archivos HTML que se abren directamente en el navegador (`file://`), sin servidor ni npm, en los que:

1. se llega a las cinco vistas desde `index.html`;
2. cada vista expone exactamente los elementos que pide la consigna;
3. todos los campos tienen `label` asociado, los botones describen su acción y las tablas tienen `th`;
4. existe un contrato explícito y estable de `id`s/contenedores para que los Ejercicios 3, 4, 5 y 6 conecten datos y comportamiento sin reestructurar el HTML.

**Fuera del resultado de esta entrega:** cualquier estilo propio, cualquier JavaScript, cualquier dato, cualquier validación y cualquier persistencia (ver §3).

---

## 2. Contexto verificado y fuentes consultadas

### 2.1 Inspección del estado actual (verificada)

| Ruta | Estado | Observación |
|---|---|---|
| `prompts/PROMPT-01-estructura-html.md` | Existe (10.674 bytes) | Requisitos y alcance de este change. Coincide con el prompt recibido. |
| `docs/Consigna Primer Parcial.pdf` | Existe (336.215 bytes, 6 páginas) | Consigna oficial. **Leída** y usada para corregir esta SPEC. |
| `openspec/config.yaml` | Existe | Scaffolding de OpenSpec; no se modifica. |
| `openspec/specs/`, `openspec/changes/archive/` | Existen, vacíos | Sin specs ni changes previos. |
| `.agents/skills/openspec-*`, `.opencode/skills/openspec-*`, `.opencode/commands/opsx-*.md` | Existen | Scaffolding de herramientas; no es producto. |
| `.active-orchestrator-state.json` | Existe | `step: "kb"` — fundación pausada para ejecutar este change. |
| `index.html` y demás HTML | **No existen** | No hay punto de entrada ni pantallas. |
| `*.css`, `*.js` de producto | **No existen** | No hay código previo que preservar. |
| Repositorio Git | **No inicializado** | Verificado; no se inicializa en este change. |

**Conclusión:** no hay producto previo. Esta entrega crea la estructura desde cero.

### 2.2 Fuentes de requisitos

| Fuente | Acceso | Uso |
|---|---|---|
| `prompts/PROMPT-01-estructura-html.md` | Leída | Requisitos R-01…R-06, alcance, exclusiones, CA-01…CA-04. |
| `docs/Consigna Primer Parcial.pdf`, p. 2 (Ej. 1) | **Leída** | Vistas, navegación, semántica, formularios, estados. |
| `docs/Consigna Primer Parcial.pdf`, p. 3 (Ej. 3 y 4) | **Leída** | Tipos de control de Libros y campos reales de Cliente. |
| `docs/Consigna Primer Parcial.pdf`, p. 4 (Ej. 5) | **Leída** | Composición de renglones, edición de cantidades, quitar renglones, detalle del historial. |
| `docs/Consigna Primer Parcial.pdf`, p. 6 | **Leída** | Puntaje del Ej. 1 (vistas y navegación: 10; semántica, formularios y estados: 10) y formato de entrega. |

> El PDF no puede ser leído directamente por el modelo; su texto se extrajo localmente con `pypdf 6.19.0` (6 páginas, 12.252 caracteres). La extracción es la fuente citada en esta SPEC.

### 2.3 Entorno verificado

| Dato | Valor | Cómo se verificó |
|---|---|---|
| Sistema operativo | Windows (build 10.0.26200) | Entorno de ejecución |
| Microsoft Edge | **155.0.4283.62** (instalado) | Versión de archivo `msedge.exe` |
| Mozilla Firefox | **158.0** (instalado) | Versión de archivo `firefox.exe` |
| Google Chrome | **No instalado** | Búsqueda en rutas estándar |
| Servidor / npm | No requeridos | Restricción del change: apertura por `file://` |
| Control de versiones | Git no inicializado | Verificado; ver PD-04 |

**Navegador de referencia:** Microsoft Edge 155 (D-05).

---

## 3. Alcance

### 3.1 Incluido

1. `index.html` como punto de entrada (vista Catálogo) y navegación clara hacia las otras cuatro vistas.
2. **Catálogo:** título de la librería (marca en el encabezado), buscador por título y tabla de libros con título, ISBN, editorial, género, autores y precio; regla registrada para mostrar «Sin clasificar» cuando no hay género.
3. **Libros:** formulario de alta y listado de libros registrados.
4. **Clientes:** formulario de alta y listado de clientes registrados.
5. **Ventas:** selección de cliente, composición de renglones y resumen de la venta.
6. **Historial:** listado de ventas (identificador, fecha, cliente, total) con acceso al detalle de cada venta.
7. Etiquetas semánticas (`header`, `nav`, `main`, `section`, `fieldset`, `legend`, `table`, `caption`, `thead`, `tbody`, `tfoot`, `th`, `label`, `dl`).
8. Una etiqueta asociada por campo; botones con texto descriptivo; tablas con encabezados.
9. Contenedores y mensajes para: lista vacía, búsqueda sin resultados, operación correcta y operación rechazada, con los identificadores y estados que consumirá JavaScript.
10. Contrato documentado de `id`s, clases estables y atributos de estado (`hidden`, `aria-current`, `aria-live`, `aria-current`) para los ejercicios siguientes.
11. Tipos de control de Libros alineados con el Ejercicio 4 (`select` de editorial, `select` de género con «Sin clasificar», selector múltiple de autores), para no reestructurar el formulario después.

### 3.2 Excluido (no se implementa en este change)

| Exclusión | Ejercicio que la cubre |
|---|---|
| Estilos visuales propios y adaptación responsive | Ejercicio 2 |
| Datos locales, renderizado dinámico, filtro y lógica de eventos | Ejercicio 3 |
| Validaciones y altas (persistencia en memoria) | Ejercicio 4 |
| Lógica de ventas (cálculos, alta de venta) | Ejercicio 5 |
| `localStorage`, README y casos manuales | Ejercicio 6 |
| Librerías, frameworks, CDNs, npm, bundlers | Excluido en todo el parcial |
| API, base de datos, servidor, backend, inicio de sesión real | Excluido en todo el parcial |
| `<style>`, `style=""`, `<link rel="stylesheet">`, `<script>`, atributos `on*` | Excluido por R-06 |
| Atributos de validación (`required`, `pattern`, `min`, `max`, `step`) | Ejercicio 4 — **no deben adelantarse** |
| Datos de ejemplo dentro del HTML, filas precargadas, opciones de `select` precargadas | Ejercicio 3 |
| `README.md`, casos de prueba manuales | Ejercicio 6 |
| Carpetas `css/`, `js/`, `img/` y recursos | Ejercicios 2, 3 y 6 |
| Enlace «Saltar al contenido», botón «Limpiar búsqueda», pie de página | No los pide la consigna; se descartan para respetar el alcance |
| Creación de un repositorio Git | Fuera del alcance pedido |

**Regla de contención:** si durante el PLAN o la implementación aparece una necesidad fuera de esta lista, se registra como propuesta en §9 y **no se implementa** sin autorización explícita.

---

## 4. Requisitos y escenarios observables

### 4.1 Requisitos

| ID | Grupo | Requisito verificable | Cómo se observa en esta entrega |
|---|---|---|---|
| R-01 | Funcional | Desde `index.html` se llega a las cinco vistas con navegación clara. | `nav` con cinco enlaces; cada enlace abre su vista; la vista actual se marca con `aria-current="page"`. |
| R-02 | Estructura e interfaces | Cada vista contiene los elementos de la consigna. | Inventario de §5.3, elemento por elemento. |
| R-03 | Datos y estados | Existen mensajes para lista vacía, búsqueda sin resultados y operación correcta/rechazada; hay contenedores para datos locales. | Contenedores `hidden` + `tbody` y `select` vacíos listos para poblar. |
| R-04 | Calidad | `header`, `nav`, `main` y demás etiquetas semánticas; `label` por campo; botones descriptivos; `th` en tablas. | Inspección del marcado. |
| R-05 | Compatibilidad | Funciona al abrir `index.html` sin servidor ni npm. | Rutas relativas, sin módulos, sin `fetch`; prueba con `file://`. |
| R-06 | Convenciones | Nombres comprensibles; estructura separada de estilos y comportamiento. | Sin CSS ni JS en línea ni vinculados; kebab-case en español. |

### 4.2 Escenarios observables (verificables en este change)

| ID | Escenario | Resultado observable | Cubre |
|---|---|---|---|
| S-01 | Abro `index.html` con doble clic. | Se muestra la vista Catálogo con encabezado, navegación y contenido principal. | R-01, R-05 |
| S-02 | Desde cualquier vista uso la navegación. | Llego a las otras cuatro; el enlace activo tiene `aria-current="page"`. | R-01 |
| S-03 | Recorro el Catálogo. | Existen título de la librería, buscador con `label` y tabla con encabezados Título/ISBN/Editorial/Género/Autores/Precio. | R-02, R-04 |
| S-04 | Recorro Libros y Clientes. | Cada uno tiene formulario de alta (campos con `label`) y tabla de listado con `th`. | R-02, R-04 |
| S-05 | Recorro Ventas. | Existen selector de cliente, selector de libro, cantidad, botón «Agregar renglón», tabla de resumen con Total y botón «Registrar venta». | R-02 |
| S-06 | Recorro Historial. | Existe tabla con Identificador/Fecha/Cliente/Total y un contenedor de detalle accesible. | R-02 |
| S-07 | Busco contenedores de estado. | Existen, ocultos por defecto: lista vacía de cada listado, búsqueda sin resultados, mensaje de éxito y mensajes de error junto a cada formulario. | R-03 |
| S-08 | Inspecciono el código fuente de los HTML. | No hay `<style>`, `style=""`, `<script>`, `on*` ni `<link rel="stylesheet">`. | R-06 |
| S-09 | Navego por teclado. | Todos los controles son alcanzables con Tab y los `label` están asociados por `for`/`id`. | R-04 |

### 4.3 Casos límite y reglas registradas

| ID | Caso | Regla esperada | ¿Verificable en Change 01? |
|---|---|---|---|
| E-01 | Catálogo sin libros. | Mensaje de lista vacía; la tabla no se presenta como si tuviera datos. | Estructura sí; visibilidad **no** (Ej. 3). |
| E-02 | Búsqueda sin coincidencias. | Mensaje de «sin resultados», **distinto** del de lista vacía. | Estructura sí; visibilidad no (Ej. 3). |
| E-03 | Búsqueda con término vacío. | Equivale a no filtrar; **no** muestra «sin resultados». | Contrato registrado; lógica Ej. 3. |
| E-04 | Libro sin género. | Se muestra «Sin clasificar» en la celda de género. | Regla registrada; render Ej. 3. |
| E-05 | Listado de Libros o Clientes vacío. | Mensaje de lista vacía propio de cada vista. | Estructura sí. |
| E-06 | Venta sin renglones. | El resumen muestra su mensaje de vacío; el total queda como contenedor. | Estructura sí; formato del total Ej. 5. |
| E-07 | Venta sin cliente, sin renglones o con cantidades inválidas. | Mensaje de operación rechazada junto al formulario. | Contenedor sí; disparo Ej. 5. |
| E-08 | Historial vacío. | Mensaje de lista vacía. | Estructura sí. |
| E-09 | Detalle de venta no abierto. | El bloque de detalle está oculto y no anuncia contenido inexistente. | Sí (atributo `hidden`). |
| E-10 | Formularios con campos vacíos. | **No** se agregan validaciones en este change. | Sí (ausencia de atributos de validación). |
| E-11 | Vista actual. | Su enlace lleva `aria-current="page"`; el resto no. | Sí. |
| E-12 | Alta de libro: editorial, género y autores. | Los controles son `select`, `select` con «Sin clasificar» y selector múltiple, aunque en Change 01 estén sin opciones de datos. | Sí (tipos de control). |

---

## 5. Solución propuesta: estructura, componentes e interfaces

### 5.1 Inventario de vistas y archivos

**D-01 resuelta: multi-página.** Cinco archivos en la raíz del proyecto:

| # | Vista | Archivo | Contenido mínimo exigido |
|---|---|---|---|
| 1 | Catálogo | `index.html` | Título de la librería, buscador por título, listado |
| 2 | Libros | `libros.html` | Alta + listado |
| 3 | Clientes | `clientes.html` | Alta + listado |
| 4 | Ventas | `ventas.html` | Selección de cliente, renglones, resumen |
| 5 | Historial | `historial.html` | Listado de ventas + detalle |

### 5.2 Estructura común a toda vista (landmarks)

```html
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{VISTA}} — Librería ABC</title>
</head>
<body>
  <header id="encabezado-sitio">
    <p class="marca-libreria">Librería ABC</p>
    <nav id="navegacion-principal" aria-label="Navegación principal">
      <ul>
        <li><a href="index.html" aria-current="page">Catálogo</a></li>
        <li><a href="libros.html">Libros</a></li>
        <li><a href="clientes.html">Clientes</a></li>
        <li><a href="ventas.html">Ventas</a></li>
        <li><a href="historial.html">Historial</a></li>
      </ul>
    </nav>
  </header>

  <main id="contenido-principal">
    <p id="mensaje-exito" role="status" aria-live="polite" hidden></p>

    <h1>{{VISTA}}</h1>
    <!-- contenido de la vista -->
  </main>
</body>
</html>
```

**Decisiones de semántica:**

- Un solo `h1` por página (nombre de la vista). El nombre de la librería va en `header` como párrafo de marca; en `index.html` ese encabezado cumple el requisito «Catálogo: título de la librería».
- `nav` con `aria-label`; enlaces en `ul`/`li`; `aria-current="page"` en el archivo correspondiente.
- `main` único por página; `section` con `h2` para agrupar alta y listado.
- Formularios de alta con `fieldset` + `legend`.
- Mensajes de estado controlados con el atributo global `hidden` (sin CSS): ese es el contrato para el Ejercicio 3.

### 5.3 Contrato de elementos e identificadores

#### 5.3.1 Catálogo (`index.html`)

| Elemento | id | Tipo / etiqueta | Etiqueta visible o contenido |
|---|---|---|---|
| Título de la librería | — | `p.marca-libreria` en `header` | «Librería ABC» |
| Buscador | `catalogo-form-busqueda` | `form` `role="search"` | — |
| Campo de búsqueda | `catalogo-busqueda` | `input type="search"` | «Buscar por título» |
| Botón buscar | `catalogo-boton-buscar` | `button type="submit"` | «Buscar» |
| Tabla | `catalogo-tabla` | `table` + `caption` | «Libros del catálogo» |
| Cuerpo | `catalogo-listado` | `tbody` | Vacío; lo puebla el Ej. 3 |
| Encabezados | — | `th scope="col"` | Título, ISBN, Editorial, Género, Autores, Precio |
| Lista vacía | `catalogo-estado-vacio` | `p hidden` | «No hay libros en el catálogo.» |
| Sin resultados | `catalogo-estado-sin-resultados` | `p hidden` | «No se encontraron libros para la búsqueda.» |

#### 5.3.2 Libros (`libros.html`)

Tipos de control fijados por la consigna (p. 3, Ej. 4): editorial por selector, género por selector con «Sin clasificar», autores por selector múltiple.

| Elemento | id | Tipo | Etiqueta |
|---|---|---|---|
| Formulario | `libros-form-alta` | `form` + `fieldset`/`legend` | «Alta de libro» |
| Título | `libro-titulo` | `input type="text"` | «Título» |
| ISBN | `libro-isbn` | `input type="text"` | «ISBN» |
| Editorial | `libro-editorial` | `select` | «Editorial» (opción inicial «Seleccioná una editorial», `value=""`) |
| Género | `libro-genero` | `select` | «Género» (opción estática `<option value="">Sin clasificar</option>`) |
| Autores | `libro-autores` | `select multiple` | «Autores» |
| Precio | `libro-precio` | `input type="number"` | «Precio» |
| Registrar | `libros-boton-registrar` | `button type="submit"` | «Registrar libro» |
| Limpiar | `libros-boton-limpiar` | `button type="reset"` | «Limpiar formulario» |
| Errores del formulario | `libros-mensaje-error` | `p role="alert" hidden` | Se completa en Ej. 4, junto al formulario |
| Tabla | `libros-tabla` | `table` + `caption` | «Libros registrados» |
| Cuerpo | `libros-listado` | `tbody` | Vacío hasta Ej. 3/4 |
| Encabezados | — | `th scope="col"` | Título, ISBN, Editorial, Género, Autores, Precio |
| Lista vacía | `libros-estado-vacio` | `p hidden` | «No hay libros registrados.» |

> Los `select` de editorial y autores no llevan opciones de datos en este change; se generan en el Ejercicio 3/4. El de género sí lleva la opción estática «Sin clasificar» porque la consigna la exige y representa la ausencia de género.
>
> `libro-precio` es `type="number"` porque el Ejercicio 4 exige precio numérico; **no** se agregan `min`, `step` ni `required`.
>
> Si en el Ejercicio 4 se optara por casillas en lugar de `select multiple` para autores, el `id="libro-autores"` se traslada al contenedor de casillas. Es la única variante prevista para ese control.

#### 5.3.3 Clientes (`clientes.html`)

Campos confirmados por la consigna (p. 3, Ej. 4): **nombre completo** y **email**. No se requiere apellido separado.

| Elemento | id | Tipo | Etiqueta |
|---|---|---|---|
| Formulario | `clientes-form-alta` | `form` + `fieldset`/`legend` | «Alta de cliente» |
| Nombre completo | `cliente-nombre` | `input type="text"` | «Nombre completo» |
| Correo electrónico | `cliente-email` | `input type="email"` | «Correo electrónico» |
| Registrar | `clientes-boton-registrar` | `button type="submit"` | «Registrar cliente» |
| Limpiar | `clientes-boton-limpiar` | `button type="reset"` | «Limpiar formulario» |
| Errores del formulario | `clientes-mensaje-error` | `p role="alert" hidden` | Se completa en Ej. 4, junto al formulario |
| Tabla | `clientes-tabla` | `table` + `caption` | «Clientes registrados» |
| Cuerpo | `clientes-listado` | `tbody` | Vacío hasta Ej. 3/4 |
| Encabezados | — | `th scope="col"` | Nombre completo, Correo electrónico |
| Lista vacía | `clientes-estado-vacio` | `p hidden` | «No hay clientes registrados.» |

> `type="email"` es un tipo de entrada, **no** una validación agregada; no incluye `required` ni `pattern`.

#### 5.3.4 Ventas (`ventas.html`)

La consigna (p. 4, Ej. 5) exige cambiar cantidades y quitar renglones antes de confirmar. La estructura contempla esas acciones en cada fila del resumen.

| Elemento | id | Tipo | Etiqueta |
|---|---|---|---|
| Formulario | `ventas-form-venta` | `form` + `fieldset`/`legend` | «Nueva venta» |
| Cliente | `venta-cliente` | `select` | «Cliente» (opción inicial «Seleccioná un cliente», `value=""`) |
| Libro | `venta-libro` | `select` | «Libro» (opción inicial «Seleccioná un libro», `value=""`) |
| Cantidad | `venta-cantidad` | `input type="number"` | «Cantidad» |
| Agregar renglón | `venta-boton-agregar` | `button type="button"` | «Agregar renglón» |
| Tabla resumen | `venta-resumen-tabla` | `table` + `caption` | «Resumen de la venta» |
| Cuerpo | `venta-renglones` | `tbody` | Vacío; lo puebla el Ej. 5 |
| Encabezados | — | `th scope="col"` | Libro, Cantidad, Precio unitario, Subtotal, Acciones |
| Total | `venta-total` | `tfoot` → `th scope="row"` «Total» + `td` | Contenedor vacío hasta Ej. 5 |
| Vacío | `venta-estado-vacio` | `p hidden` | «No hay renglones en la venta.» |
| Errores de la venta | `ventas-mensaje-error` | `p role="alert" hidden` | Se completa en Ej. 5, junto al formulario |
| Confirmar | `venta-boton-confirmar` | `button type="submit"` | «Registrar venta» |

**Contrato de fila de renglón** (la genera el Ejercicio 5): celda de libro con texto descriptivo, celda de cantidad con `input type="number"` (sin `min`/`step` en este change), celda de precio unitario, celda de subtotal y celda de acciones con `button type="button"` «Quitar renglón». No se incluye una fila de ejemplo.

#### 5.3.5 Historial (`historial.html`)

| Elemento | id | Tipo | Etiqueta / contenido |
|---|---|---|---|
| Tabla | `historial-tabla` | `table` + `caption` | «Ventas registradas» |
| Cuerpo | `historial-listado` | `tbody` | Vacío; lo puebla el Ej. 5/6 |
| Encabezados | — | `th scope="col"` | Identificador, Fecha, Cliente, Total, Acciones |
| Botón de detalle | — (clase `boton-ver-detalle`, `data-venta-id`) | `button type="button"` | «Ver detalle» (por fila, generado por JS) |
| Vacío | `historial-estado-vacio` | `p hidden` | «No hay ventas registradas.» |
| Detalle | `historial-detalle` | `section hidden` + `h2` | «Detalle de la venta» |
| Datos de la venta | — | `dl` con `dt`/`dd` | Identificador, Fecha, Cliente, Total |
| Identificador | `historial-detalle-identificador` | `dd` | Vacío hasta Ej. 5 |
| Fecha | `historial-detalle-fecha` | `dd` | Vacío hasta Ej. 5 |
| Cliente | `historial-detalle-cliente` | `dd` | Vacío hasta Ej. 5 |
| Total | `historial-detalle-total` | `dd` | Vacío hasta Ej. 5 |
| Renglones | `historial-detalle-renglones` | `tbody` | `th`: Libro, Cantidad, Precio unitario, Subtotal |
| Cerrar | `historial-detalle-cerrar` | `button type="button"` | «Cerrar detalle» |

> Se usa `section` y no `dialog` porque `dialog` requiere JavaScript para abrirse y esta entrega no incluye comportamiento.

#### 5.3.6 Estados globales y por formulario

| Elemento | id | Tipo | Ubicación | Uso |
|---|---|---|---|---|
| Éxito | `mensaje-exito` | `p role="status" aria-live="polite" hidden` | Inicio de `main` de cada vista | Alta o venta correcta (lo dispara el JS de Ej. 3-5) |
| Error de libro | `libros-mensaje-error` | `p role="alert" hidden` | Junto al formulario de Libros | Alta rechazada (Ej. 4) |
| Error de cliente | `clientes-mensaje-error` | `p role="alert" hidden` | Junto al formulario de Clientes | Alta rechazada (Ej. 4) |
| Error de venta | `ventas-mensaje-error` | `p role="alert" hidden` | Junto al formulario de Ventas | Venta rechazada (Ej. 5) |

> La consigna pide que los errores se muestren **cerca del formulario**; por eso hay un contenedor por formulario y no un único mensaje global de error. El mensaje de éxito sí es global por vista.

### 5.4 Datos necesarios (contrato para ejercicios posteriores)

No se cargan datos en este change. Se declara la forma que el HTML debe poder representar.

| Entidad | Campos | Origen |
|---|---|---|
| Libro | `titulo`, `isbn`, `editorial`, `genero` (opcional), `autores[]`, `precio` | Consigna p. 2 y p. 3 |
| Cliente | `nombreCompleto`, `email` | Consigna p. 3 |
| Venta | `identificador`, `fecha`, `cliente`, `renglones[]`, `total` | Consigna p. 4 |
| Renglón | `libro`, `cantidad`, `precioUnitario` (histórico), `subtotal` | Consigna p. 4 |
| Género | `descripcion`; ausencia = «Sin clasificar» | Consigna p. 2 y p. 3 |
| Editorial / Autor | `id`, `nombre` (relaciones por identificador) | Consigna p. 3 |

### 5.5 Convenciones de nombres

- `id` y `class` en **kebab-case**, en español, con prefijo de vista (`catalogo-`, `libros-`, `clientes-`, `ventas-`, `historial-`) o de entidad (`libro-`, `cliente-`, `venta-`).
- `name` de los campos: singular (`titulo`, `isbn`, `editorial`, `genero`, `autores`, `precio`, `nombre`, `email`).
- Clases solo para elementos repetibles generados por JS (`boton-ver-detalle`) y la marca (`marca-libreria`).
- Sin abreviaturas opacas ni numeración secuencial (`div1`, `campo2`).

---

## 6. Estados y manejo de errores

### 6.1 Estados definidos

| Estado | Contenedor | Estado inicial en Change 01 | Quién lo activa |
|---|---|---|---|
| Lista vacía (Catálogo) | `catalogo-estado-vacio` | `hidden` | Ej. 3 |
| Sin resultados (Catálogo) | `catalogo-estado-sin-resultados` | `hidden` | Ej. 3 |
| Lista vacía (Libros) | `libros-estado-vacio` | `hidden` | Ej. 3 |
| Lista vacía (Clientes) | `clientes-estado-vacio` | `hidden` | Ej. 3 |
| Venta sin renglones | `venta-estado-vacio` | `hidden` | Ej. 5 |
| Lista vacía (Historial) | `historial-estado-vacio` | `hidden` | Ej. 5/6 |
| Operación correcta | `mensaje-exito` | `hidden` | Ej. 3-5 |
| Error de alta de libro | `libros-mensaje-error` | `hidden` | Ej. 4 |
| Error de alta de cliente | `clientes-mensaje-error` | `hidden` | Ej. 4 |
| Error de venta | `ventas-mensaje-error` | `hidden` | Ej. 5 |
| Detalle cerrado | `historial-detalle` | `hidden` | Ej. 5 |

### 6.2 Reglas de estado

1. **Un solo mecanismo:** visibilidad mediante `hidden`. No se usan clases de visibilidad ni CSS.
2. **Exclusividad:** «lista vacía» y «sin resultados» son mutuamente excluyentes; nunca se muestran juntos (lo garantiza el Ej. 3).
3. **No inventar contenido:** en Change 01 los contenedores de datos están vacíos; no se agregan filas, opciones de `select` ni valores ficticios.
4. **Mensajes con texto legible** desde ya (no `lorem ipsum`), para verificar su existencia en el DOM.
5. **Errores junto al formulario** correspondiente; el éxito, en el inicio de `main`.
6. **El texto definitivo** de cada mensaje se ajusta en Ej. 3-5 sin cambiar el contenedor.

### 6.3 Lo que no se maneja en este change

- No hay recuperación de errores de red (no hay red).
- No hay validación de campos (Ej. 4).
- No hay control de stock, duplicados, cantidades ni totales (Ej. 5).
- No hay persistencia (Ej. 6).

---

## 7. Restricciones técnicas y convenciones

| Restricción | Implicancia | Verificación |
|---|---|---|
| HTML5, CSS y JS nativos | Solo archivos `.html` en esta entrega | Inspección |
| Sin frameworks, librerías ni CDNs | Cero recursos externos | Inspección |
| Sin API, backend, servidor, login | Sin `fetch`, sin `action` real | Inspección |
| Sin npm ni compilación | Archivos estáticos por `file://` | Abrir `index.html` |
| Sin CSS ni JS en línea | Sin `<style>`, `style=""`, `<script>`, `on*`, `<link rel="stylesheet">` | Búsqueda de patrones |
| Sin validaciones | Sin `required`, `pattern`, `min`, `max`, `step` | Búsqueda de patrones |
| Codificación | UTF-8; `lang="es"`; tildes y «» correctos | Inspección |
| Rutas | Relativas, minúsculas, sin rutas absolutas | Inspección + `file://` |
| Accesibilidad mínima | `label for`, `th scope`, `caption`, `aria-current`, `role=status/alert` | Inspección + teclado |
| Herramientas | Editor (este entorno); Edge 155 / Firefox 158; sin control de versiones | §2.3 |
| Comprobaciones | No hay TDD: verificación manual + búsqueda de patrones prohibidos | §8 |

**Sobre la validación de HTML:** no hay validador local instalado y npm está excluido. Se adopta **validación manual por inspección**. La validación con W3C Nu Validator implicaría enviar el código a un tercero y no se autoriza en este change.

---

## 8. Criterios de aceptación

| CA | Criterio | Requisito | Evidencia prevista |
|---|---|---|---|
| CA-01 | Las cinco vistas son alcanzables desde `index.html` con navegación clara. | R-01 | Recorrido de los cinco enlaces desde `index.html`. |
| CA-02 | Cada vista incluye los elementos exigidos por la consigna. | R-02 | Checklist §5.3 elemento por elemento. |
| CA-03 | Existen mensajes para lista vacía, búsqueda sin resultados y operación correcta/rechazada. | R-03 | Inspección de los contenedores de estado. |
| CA-04 | Hay encabezado, navegación y contenido principal semánticos; todos los campos tienen etiqueta; los botones describen su acción; las tablas tienen encabezados. | R-04 | Inspección + navegación por teclado. |
| CA-05 | Se cubre todo el alcance aprobado y no se incorpora trabajo excluido. | §3 | Diff de archivos creados contra §3.2. |
| CA-06 | Se respetan tecnologías, dependencias y convenciones. | R-05, R-06 | Búsqueda de `<style>`, `style=`, `script`, `on*`, `required`, `pattern` + apertura `file://`. |
| CA-07 | Las comprobaciones exigidas se ejecutaron y sus resultados se informan con evidencia. | §7 | Registro de comprobaciones en el resumen de implementación. |
| CA-08 | Se distinguen controles aprobados, fallidos, omitidos y pendientes; ninguno no ejecutado se presenta como aprobado. | §7 | Tabla de comprobaciones con estado explícito. |
| CA-09 | Supuestos, placeholders y limitaciones quedan identificados. | §9 | Este documento + resumen final. |

**Correspondencia con el puntaje del Ejercicio 1** (consigna p. 6): vistas y navegación (10) → CA-01/CA-02; semántica, formularios y estados (10) → CA-03/CA-04.

---

## 9. Supuestos, información pendiente y decisiones

### 9.1 Decisiones resueltas

| ID | Decisión | Resolución | Fuente |
|---|---|---|---|
| D-01 | Navegación | **Multi-página**: `index.html` (Catálogo) + `libros.html`, `clientes.html`, `ventas.html`, `historial.html` | Usuario |
| D-02 | Campos de Cliente | **Nombre completo + email** (sin apellido separado) | PDF p. 3 |
| D-03 | Nombre de la librería | **Librería ABC** | Usuario |
| D-04 | Ruta del SPEC | `docs/01-estructura-html/SPEC.md` | Usuario |
| D-05 | Navegador de referencia | **Edge 155.0.4283.62** (Firefox 158 disponible para verificación cruzada) | Usuario + §2.3 |
| D-06 | Fuente de requisitos | PDF leído; corrige campos de Cliente y tipos de control de Libros | PDF |
| D-07 | Validación de HTML | Manual por inspección; sin envío a W3C | Decisión adoptada |
| PD-05 | Ubicación de los HTML | **Raíz del proyecto** | Usuario |

### 9.2 Propuestas menores (resueltas)

| ID | Propuesta | Resolución |
|---|---|---|
| P-06 | Detalle de Historial como `section` oculta | **Adoptada** (verificable sin JS). |
| P-07 | Catálogo en tabla | **Adoptada** (la consigna pide listado y R-04 pide tablas con encabezados). |
| P-03 | Enlace «Saltar al contenido» | **Descartada** (no la pide la consigna; fuera de alcance). |
| P-04 | Botón «Limpiar búsqueda» | **Descartada** (no la pide la consigna; fuera de alcance). |
| P-05 | Género texto libre / autores separados por coma | **Reemplazada** por el PDF: género `select` con «Sin clasificar»; autores selector múltiple. |

### 9.3 Supuestos declarados

| ID | Supuesto | Impacto si es falso |
|---|---|---|
| A-01 | Una sola librería, sin sucursales ni login. | Cambiaría el `header` y el alcance del Historial. |
| A-02 | Cinco vistas; no hay vista de detalle de libro ni de cliente. | Agregaría archivos. |
| A-03 | Los formularios son de alta (no de edición ni baja). | Agregaría acciones y columnas. |
| A-04 | El detalle de una venta se muestra dentro de Historial. | Agregaría un archivo o cambiaría `href`. |
| A-05 | Los importes se formatean en Ej. 2/3/5; en Change 01 no hay formato. | Sin impacto estructural. |
| A-06 | No se requiere pie de página. | Se agregaría `footer` si se pidiera. |
| A-07 | Las rutas de archivos son relativas y en minúsculas. | Sin impacto. |
| A-08 | El texto de los mensajes de estado es provisional. | Sin impacto estructural. |
| A-09 | Se escribe «Librería ABC» con tilde según ortografía; el pedido se recibió como «Libreria ABC». | Se ajusta en una línea si se prefiere literal. |

### 9.4 Información pendiente

| ID | Dato faltante | Efecto | Placeholder |
|---|---|---|---|
| PD-04 | Herramientas autorizadas / control de versiones | Git no está inicializado; no se crea en este change | `{{DATO_PENDIENTE: herramientas autorizadas}}` |
| PD-06 | Política de comprobaciones | Define el rigor de verificación | `{{DATO_PENDIENTE: no hay TDD; verificación manual}}` |

> PD-04 y PD-06 **no bloquean** la implementación: se adopta edición local + verificación manual, y se informa como limitación. Si el docente exige entrega versionada, se resuelve antes de la entrega del Ejercicio 6, no en este change.

### 9.5 Limitaciones conocidas de esta entrega

1. El `header`/`nav` se repite en los cinco archivos: sin servidor ni includes no hay forma de evitarlo.
2. Los formularios no rechazan nada todavía: no hay validación ni JavaScript.
3. Los listados aparecen vacíos, pero sus mensajes de «vacío» están ocultos hasta que el Ejercicio 3 los active.
4. No hay estilos: la apariencia es la del navegador.
5. La navegación funciona por enlaces entre archivos; no hay resaltado visual de la vista activa más allá de `aria-current`.

---

## 10. Trazabilidad requisito → elemento

| Requisito | Elementos que lo satisfacen |
|---|---|
| R-01 | `nav#navegacion-principal` + cinco `a` + `aria-current` |
| R-02 | §5.3.1 a §5.3.5 completos |
| R-03 | `catalogo-estado-vacio`, `catalogo-estado-sin-resultados`, `libros-estado-vacio`, `clientes-estado-vacio`, `venta-estado-vacio`, `historial-estado-vacio`, `mensaje-exito`, `libros-mensaje-error`, `clientes-mensaje-error`, `ventas-mensaje-error` + `tbody`/`select` vacíos |
| R-04 | `header`, `nav`, `main`, `section`, `fieldset`/`legend`, `table`/`caption`/`thead`/`th`, `label for`, botones con texto |
| R-05 | Rutas relativas + ausencia de dependencias |
| R-06 | Ausencia de `<style>`, `style=""`, `<script>`, `on*`, `<link rel="stylesheet">`; kebab-case |

---

## 11. Cambios respecto de la v1

| Cambio | Motivo |
|---|---|
| D-01 resuelta: multi-página, 5 archivos en la raíz | Decisión del usuario |
| Cliente: de 5 campos propuestos a **nombre completo + email** | Consigna p. 3 (Ej. 4) |
| Libros: editorial y género pasan de texto a **`select`**; autores a **selector múltiple** | Consigna p. 3 fija esos controles para Ej. 4; el Ej. 1 debe contemplar los campos que usa JS |
| Género incluye la opción estática **«Sin clasificar»** | Consigna p. 2 y p. 3 |
| Ventas: se agrega columna **Acciones** al resumen y contrato de fila con cantidad editable y «Quitar renglón» | Consigna p. 4 (Ej. 5) |
| Mensajes de error **por formulario**, junto a cada uno; éxito global | Consigna p. 3 («errores cerca del formulario») |
| Se descartan «Saltar al contenido» y «Limpiar búsqueda» | No los pide la consigna; alcance estricto |
| Nombre, rutas y ubicación resueltos | Respuesta del usuario |
