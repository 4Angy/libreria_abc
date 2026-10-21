# SPEC — Change 05: Alta de libros y clientes

| Campo | Valor |
|---|---|
| Change | 05 — Alta de libros y clientes (Ejercicio 4 · 15 puntos) |
| Fase | Fase 1 — SPEC |
| Versión | v1 |
| Estado | **Implementado, verificado y archivado** el 20/10/2026 (`openspec/changes/archive/2026-10-20-05-altas-libros-clientes/`). Las 37 tareas del PLAN v1 están cerradas y ninguna comprobación quedó sin ejecutar. Siete desvíos de la implementación quedan documentados en «Desvíos de la implementación» de `design.md`; el más relevante es una **expresión regular del precio que estaba mal en este SPEC** (§ 5.5) y se corrigió aquí. |
| Fecha | 20/10/2026 |
| Proyecto | Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN) |
| Ubicación | `C:\Users\Cara Palida\Documents\projects\libreria_abc` (verificada el 20/10/2026) |
| Ruta del documento | `docs/05-altas-libros-clientes/SPEC.md` — **ruta propuesta, a confirmar (D-07)** |
| Depende de | Change 01 (HTML, archivado), Change 02 (CSS, archivado), Change 03 (datos y catálogo, archivado), Change 04 (legibilidad a 320 px, archivado) |
| Fuentes de requisitos | `docs/Consigna Primer Parcial.pdf` p. 3 (Ejercicio 4), p. 5 (casos manuales del Ejercicio 6), p. 6 (criterios de evaluación) |
| Change de OpenSpec | Se creará en la Fase 2, junto con el PLAN (convención del proyecto, D-07 de SPEC-03) |

---

## 1. Problema, objetivo y resultado esperado

**Problema.** Los formularios de alta existen en el marcado desde el Change 01 y el modelo de datos local existe desde el Change 03, pero **no hay una sola línea de JavaScript en las vistas Libros, Clientes y Ventas**. `libros.html` y `clientes.html` no tienen ni un `<script>`: el formulario se envía con el método `GET` por defecto, la página se recarga con los valores en la URL y el registro se pierde. Los selectores de editorial, género y autores están vacíos. Los dos `<select>` de `ventas.html` no tienen ni una opción.

El Ejercicio 4 es el primero que exige comportamiento de entrada de datos y vale 15 de los 100 puntos del parcial (criterio «4. Altas»: libros y selectores 6, clientes 4, validación y actualización 5).

**Objetivo de esta entrega.** Permitir registrar libros y clientes en el estado vivo de la aplicación, con validaciones completas que rechacen los casos inválidos con un mensaje de texto cerca del formulario, y sin agregar el registro mientras alguna comprobación falle. Al completarse un alta, el listado correspondiente y las listas de opciones se actualizan en el mismo documento, sin recargar la página.

**Resultado esperado.** Al abrir `libros.html` o `clientes.html` sin servidor:

1. los selectores de editorial, género y autores muestran las opciones generadas desde los datos locales, y el de género incluye «Sin clasificar»;
2. un libro válido aparece en el listado de libros registrados, con las mismas seis columnas del catálogo, y **no** recarga la página;
3. un cliente válido aparece en el listado de clientes registrados, y **no** recarga la página;
4. cada regla de validación rechaza su caso con un mensaje de texto visible junto al formulario, y el registro no se agrega;
5. el ISBN se compara sin espacios ni guiones, y el email sin espacios exteriores ni distinción de mayúsculas;
6. los selectores de cliente y de libro de `ventas.html` quedan poblados desde el mismo estado local.

**Fuera del resultado:** persistencia en `localStorage` (Ejercicio 6), ventas e historial (Ejercicio 5), edición y eliminación de registros, altas de editoriales, géneros o autores, y el dígito de control del ISBN.

### 1.1 Una tensión del enunciado, y cómo se resuelve

R-01 pide que el libro nuevo aparezca, además de en su listado, «en el catálogo y en la selección de venta», y que el cliente nuevo aparezca «en la selección de venta». El catálogo vive en `index.html` y la selección de venta en `ventas.html`: **son documentos distintos de donde se hace el alta**.

`js/datos.js` define el estado vivo como una variable global del documento (`let estado`). Al navegar a otra página el documento se recarga entero, `iniciarDatos()` vuelve a copiar la semilla y el registro nuevo desaparece. Sin `localStorage` —reservado al Ejercicio 6 por la consigna— ni servidor, **no existe ningún canal entre documentos**.

La consigna resuelve la aparente contradicción en su propia cronología: el caso manual que exige «el válido aparece en catálogo y selección de venta» está en la p. 5, dentro del **Ejercicio 6 · Persistencia, verificación y documentación**, mientras que el Ejercicio 4 (p. 3) solo promete «el listado y las opciones relacionadas se actualizan sin recargar la página».

La decisión D-01 que sigue hace que esa lectura sea correcta en lugar de accidental: **`estado` es la única fuente de verdad y `iniciarDatos()` es el único punto que lo siembra.** Todas las vistas —el catálogo, los dos listados y los dos selectores de venta— dibujan a partir de ese mismo estado. Cuando el Ejercicio 6 cambie la *fuente* de `estado` (de la semilla al almacenamiento), el cruce entre páginas aparece sin tocar ninguna vista. El alcance de este change es, por lo tanto, la **mecánica**; la **observación** entre páginas es del Ejercicio 6.

---

## 2. Contexto verificado y fuentes consultadas

### 2.1 Estado actual del proyecto (verificado el 20/10/2026)

| Dato | Valor | Cómo se verificó |
|---|---|---|
| Ubicación del proyecto | `C:\Users\Cara Palida\Documents\projects\libreria_abc` | Listado de archivos. **Nota:** el SPEC-03 registra la ruta anterior `C:\Users\zalaz\OneDrive\Desktop\libreria`; el proyecto se movió. |
| Vistas HTML | `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` | Listado de archivos |
| `<script>` por vista | **Solo `index.html`** (4 etiquetas: `datos-iniciales.js`, `datos.js`, `catalogo.js`, `inicio.js`). `libros.html`, `clientes.html`, `ventas.html` e `historial.html` no tienen **ninguna** | Lectura de los 5 archivos |
| Scripts en `js/` | `datos-iniciales.js`, `datos.js`, `catalogo.js`, `inicio.js` | Listado de archivos |
| API de `js/datos.js` | `estado`, `iniciarDatos()`, `copiarLibro()`, `copiarEditorial()`, `copiarGenero()`, `copiarAutor()`, `copiarCliente()`, `copiarVenta()`, `copiarRenglon()`, `obtenerLibros()`, `obtenerEditorial(id)`, `obtenerGenero(id)`, `obtenerAutores(ids)` | Lectura del archivo |
| Consultas que **faltan** | No existen `obtenerClientes()`, `obtenerEditoriales()`, `obtenerGeneros()` ni una lista de autores: `obtenerAutores(ids)` ya está ocupado y devuelve **nombres unidos por coma** | Lectura del archivo |
| Semilla (`datos-iniciales.js`) | 9 libros, 7 editoriales, 5 géneros, 10 autores, 4 clientes, 2 ventas | Lectura del archivo |
| Libro sin género | `li-veinte-poemas-de-amor` tiene `generoId: null` | Lectura del archivo |
| ISBN de la semilla | Todos de 13 dígitos, sin guiones ni espacios | Lectura del archivo |
| Precios de la semilla | Números enteros con `.0` (24500.0, 21900.0, …) | Lectura del archivo |
| Formulario de libros | `form#libros-form-alta` con `input#libro-titulo` (text), `input#libro-isbn` (text), `select#libro-editorial`, `select#libro-genero`, `select#libro-autores` (**multiple**), `input#libro-precio` (**number**) | Lectura de `libros.html` |
| Formulario de clientes | `form#clientes-form-alta` con `input#cliente-nombre` (text) e `input#cliente-email` (**email**) | Lectura de `clientes.html` |
| Mensajes ya previstos | `p#libros-mensaje-error` («No se pudo registrar el libro.»), `p#clientes-mensaje-error` («No se pudo registrar el cliente.»), `p#mensaje-exito` («Operación realizada correctamente.»), `p#libros-estado-vacio`, `p#clientes-estado-vacio`. Todos con `hidden` | Lectura de los HTML |
| Placeholders de los selectores | `#libro-editorial` ya trae `<option value="">Seleccioná una editorial</option>`; `#libro-genero` ya trae `<option value="">Sin clasificar</option>`; `#libro-autores` está **vacío** | Lectura de `libros.html` |
| Selectores de venta | `select#venta-cliente` y `select#venta-libro` existen, **sin ninguna opción** | Lectura de `ventas.html` |
| Tablas | `libros.html` declara las mismas 6 columnas que el catálogo: Título, ISBN, Editorial, Género, Autores, Precio. `clientes.html`: Nombre completo, Correo electrónico | Lectura de los HTML |
| CSS relevante | `.mensaje`, `.mensaje--error`, `.mensaje--exito`, `.campo`, `.campo--busqueda`, `.campo select[multiple] { min-height: 7rem }`, `.campo input { width: 100%; padding: …; border: … }`, `.tabla { min-width: 760px }`, `.tabla--compacta { min-width: 480px }` (usada solo por `historial.html`), `.tabla .celda-atomica { white-space: nowrap }` | Lectura de `css/estilos.css` |
| CSS que **no** existe | No hay `.campo--error` ni estilo para `aria-invalid` | Búsqueda en `css/estilos.css` |
| Utilidades | `.tabla-desplazable { overflow-x: auto }` evita el scroll horizontal de la página | Lectura de `css/estilos.css` |
| Cambios de OpenSpec | **0** changes activos; 4 archivados (`01-estructura-html`, `02-css-adaptable`, `03-datos-catalogo-filtro`, `04-legibilidad-tabla-320`) | `openspec list --json` |
| Specs vivas | `libreria-frontend` (12 requirements), `datos-catalogo` (9), `presentacion-css` (10) | `openspec list --specs --json` |
| Requisito vivo afectado | `libreria-frontend` § «Alta y listado de libros» ya declara «autores mediante selección múltiple **o controles equivalentes**» y la opción «Sin clasificar»: **el texto del requisito es agnóstico respecto de la implementación elegida** | `openspec show libreria-frontend` |
| Navegador | Edge **155.0.4283.62** instalado. **Firefox no está instalado** en las rutas estándar (el SPEC-03 registraba 158.0) | Versión de los binarios |
| Node / Python | Node **v24.19.0**, Python **3.14.0** | `--version` |
| Git | Repositorio con 3 commits (`fbaafe9 agrego changes 02, 03 y 04`). `prompts/PROMPT-04-altas-libros-clientes.md` está sin versionar | `git log`, `git status` |
| Texto de la consigna | Extraído con un script propio de biblioteca estándar (el PDF usa fuentes *subset* con codificación propia; el espacio es un glifo real y hay que decodificar con el *ToUnicode CMap*). **6 páginas** | `docs/Consigna Primer Parcial.pdf` |

### 2.2 Requisitos citados de la consigna (p. 3, Ejercicio 4)

> «El formulario de libros permite registrar título, ISBN, precio y las relaciones con editorial, género y autores. Las opciones se generan a partir de los datos locales: editorial y género mediante selectores, y autores mediante un selector múltiple o controles de selección equivalentes. El selector de género incluye la opción «Sin clasificar», que representa la ausencia de género.»

> «Se comprueba que el título y el ISBN no estén vacíos, que el ISBN no exista en el conjunto local, que el precio sea numérico y mayor que cero y que la editorial y todos los autores seleccionados existan en los datos locales. Se selecciona al menos un autor. El género puede quedar sin asignar; si se asigna, se verifica que exista en los datos locales. Para este parcial, el ISBN se compara sin espacios ni guiones; no se requiere implementar su dígito de control.»

> «El formulario de clientes permite registrar nombre completo y email. No se requiere un campo de apellido separado. Se comprueba que el nombre completo y el email no estén vacíos, que el email tenga un formato válido y que no exista otro cliente con el mismo email, comparado sin espacios exteriores y sin distinguir mayúsculas de minúsculas. Se controla el envío con `preventDefault`, se muestran errores cerca del formulario y solo se agrega el registro si todas las comprobaciones pasan. Tras un alta correcta, el listado y las opciones relacionadas se actualizan sin recargar la página. No se exige editar ni eliminar registros.»

### 2.3 Otras citas de la consigna que condicionan el diseño

| Fuente | Cita | Consecuencia en este change |
|---|---|---|
| p. 2, Ejercicio 1 | «Se permite usar varias páginas o secciones de una misma página, siempre que exista navegación clara entre las siguientes vistas.» | La arquitectura multi-página ya elegida en el Change 01 es válida; no hace falta consolidar. |
| p. 2, Ejercicio 1 | «Ventas: selección de cliente, composición de renglones y resumen de la venta.» | La **selección** es del Ejercicio 5, pero R-01 la nombra: se incluye solo el poblado de los dos selectores (§ 3.1, punto 8). |
| p. 2, Ejercicio 1 | «Cada campo posee una etiqueta asociada» | Los seis campos del formulario de libros y los dos de clientes ya la tienen. |
| p. 3, Ejercicio 3 | «Los datos escritos por usuarios se insertan como texto en el DOM.» | Todo lo que provenga del formulario se inserta con `textContent`. |
| p. 5, Ejercicio 6 | «Alta de libro con ISBN existente y luego con ISBN nuevo» → «El duplicado se rechaza; el válido aparece en catálogo y selección de venta.» | Escenario de verificación **del Ejercicio 6**. En este change se resuelve la causa raíz (§ 1.1), no la observación. |
| p. 5, Ejercicio 6 | «Alta de cliente con email inválido, email existente en mayúsculas y email nuevo» → «Se rechazan los dos primeros; el nuevo aparece en listado y selección.» | Los tres casos son verificables **en este change** contra el listado de la propia vista. |
| p. 6, Criterios | «4. Altas: 15 → Libros y selectores: 6; clientes: 4; validación y actualización: 5.» | Reparto de esfuerzo de § 4. |
| p. 6, Criterios | «Se valora código legible, nombres comprensibles, funciones acotadas y separación entre estructura, estilos y comportamiento.» | Justifica el módulo `js/validaciones.js` separado del DOM. |
| p. 6, Criterios | «El uso de librerías o frameworks incumple el alcance técnico y se informa en la evaluación.» | Prohibición explícita de dependencias. |
| p. 6, Entrega | «El README identifica… funcionalidades implementadas y pendientes… resultados de los casos manuales» | La limitación del cruce entre páginas se documentará en el README del Ejercicio 6. |

### 2.4 Comprobaciones empíricas del navegador (Chromium 152, 20/10/2026)

Se probó el HTML real del proyecto, servido por HTTP local solo para la sonda (la validación de restricciones es estándar del navegador y no depende del esquema; la verificación final se hará en Edge 155.0.4283.62, R-05).

| Sonda | Resultado |
|---|---|
| `input[type=email]` con valor `abc` → `form.requestSubmit()` | **El evento `submit` NO se dispara.** `validity.typeMismatch = true`. El navegador muestra su propia burbuja y cancela el envío. |
| `input[type=email]` con valor vacío | `submit` **sí** se dispara (no hay atributo `required`). |
| `input[type=email]` con valor `ana@example.com` | `submit` **sí** se dispara. |
| `input[type=number]` con valor `1500.50` | `value` = `"1500.50"`, pero `validity.stepMismatch = true` y `validity.valid = false`: el `step` por defecto es `1`. |
| `input[type=number]` con valor `abc` | `value` = `""` y `validity.badInput` = `false`: el navegador descarta lo inválido **antes** de que el JavaScript lo vea. |
| `input[type=number]` con valor `1500,50` (coma decimal) | `value` = `""`: la coma no es separador decimal válido para un `number`. |
| `form.noValidate = true` y email inválido | `submit` **sí** se dispara. |
| `select[multiple]` con dos opciones marcadas | `selectedOptions` devuelve las dos. |
| `formatearPrecio(24500)` con `Intl.NumberFormat("es-AR", {style:"currency", currency:"ARS"})` | `"$ 24.500,00"`; `formatearPrecio(1500.5)` → `"$ 1.500,50"`. |

**Consecuencias directas, y por qué el diseño es el que es:**

1. La sonda 1 **rompe R-03**: con la validación nativa activa, un email mal formado nunca llega al `submit`, y el mensaje de error del requisito —«un mensaje de texto cerca del formulario»— nunca aparecería. De ahí D-06 (`novalidate`).
2. La sonda 4 hace que **`type="number"` con el `step` por defecto rechace precios con centavos**, que en una librería son normales. De ahí D-06 y D-04.
3. Las sondas 5 y 6 muestran que con `type="number"` el JavaScript **no puede distinguir «no numérico» de «vacío»**: la única salida honesta sería un mensaje que cubre ambos. De ahí D-04 (`type="text"` + `inputmode="decimal"`), que además habilita D-05.
4. Con `type="text"`, `Number("1.500")` es `1.5`: un precio escrito con separador de miles se convertiría **en silencio** en un precio 1000 veces menor. De ahí D-05 (formato estricto con un mensaje que declara el formato esperado).

### 2.5 Contratos heredados que este change no puede romper

- `libreria-frontend`: los `<tbody>` existen con id; los mensajes de estado existen y se alternan con `hidden`; **los identificadores, las clases y los textos visibles ya escritos no se modifican**.
- `presentacion-css`: la tabla y los estados vacíos ya tienen estilo; **no se agregan estilos en línea** ni se modifican las clases existentes.
- Change 03: la semilla `DATOS_INICIALES` **no se muta**; la aplicación trabaja sobre una copia; todo se inserta como texto; `innerHTML` está prohibido en todo el proyecto, incluso con texto fijo; los scripts son clásicos, no módulos ES.

---

## 3. Alcance

### 3.1 Incluido

| # | Alcance | Dónde |
|---|---|---|
| 1 | Formulario de libros operativo: valida, agrega al estado vivo y actualiza el listado sin recargar | `libros.html` |
| 2 | Formulario de clientes operativo: valida, agrega al estado vivo y actualiza el listado sin recargar | `clientes.html` |
| 3 | Generación de las opciones de editorial, género y autores desde los datos locales; «Sin clasificar» en género | `libros.html` |
| 4 | Listado de libros registrados, con las 6 columnas del `<thead>` ya declarado | `libros.html` |
| 5 | Listado de clientes registrados, con las 2 columnas del `<thead>` ya declarado | `clientes.html` |
| 6 | Mensajes de resultado de la operación junto al formulario (error y éxito) | `libros.html`, `clientes.html` |
| 7 | Consultas de datos que faltan: clientes, editoriales, géneros y la lista de autores | `js/datos.js` |
| 8 | Poblado de los selectores `#venta-cliente` y `#venta-libro` desde el mismo estado local | `ventas.html` |
| 9 | Normalización reutilizable de ISBN y de email | `js/validaciones.js` |
| 10 | Nota de uso del selector múltiple de autores | `libros.html` |

El punto 8 es el límite exacto de lo que R-01 hace posible sin almacenamiento: **las opciones de la venta se generan con el mismo código y el mismo estado que alimentan el catálogo**, de modo que el día que el estado sobreviva a la recarga, el libro nuevo aparezca allí sin tocar esa vista. Lo que el Ejercicio 5 agrega —renglones, subtotales, total y confirmación— queda fuera.

### 3.2 Excluido (explícito)

| Exclusión | Motivo |
|---|---|
| `localStorage` y cualquier otra persistencia | Reservado al Ejercicio 6 por la consigna |
| Cruce de datos entre páginas (el libro de `libros.html` en `index.html`) | Sin persistencia no hay canal; se resuelve en el Ejercicio 6 (§ 1.1) |
| Ventas: renglones, subtotales, total, confirmación e historial | Ejercicio 5 |
| Edición y eliminación de registros | «No se exige editar ni eliminar registros» (p. 3) |
| Altas, bajas y modificaciones de editoriales, géneros o autores | «No se requiere … administrar altas, bajas y modificaciones de editoriales, géneros o autores» (p. 3) |
| Dígito de control del ISBN | «No se requiere implementar su dígito de control» (p. 3) |
| Validación de formato o longitud del ISBN | R-03 no la pide; se declara en § 9.4 |
| Marca visual del campo inválido (`.campo--error`, `aria-invalid`) | Requeriría CSS nuevo; se declara en § 9.4 |
| `fetch`, API, base de datos, servidor | Excluido por la consigna |
| npm, bundlers, transpiladores, librerías, frameworks, CDN | Excluido por la consigna y por p. 6 |
| Cambios en `css/estilos.css` | **Una regla de tres líneas** (§ 5.7), añadida tras la revisión visual |
| Cambios en `index.html` | Ya renderiza desde `estado`; no hay nada que hacer |
| Cambios en `historial.html` | Ejercicio 5 |
| README | Ejercicio 6 |

---

## 4. Requisitos, escenarios y casos límite

### 4.1 Requisitos (del prompt, con el detalle de verificación)

| ID | Grupo | Requisito | Verificación prevista |
|---|---|---|---|
| R-01 | Funcional | Un libro o cliente válido se agrega y aparece en su listado; para libros, además, en el catálogo y en la selección de venta; para clientes, en la selección de venta. | S-01 a S-06, S-12. **Ver § 1.1: la parte entre páginas solo es observable en el Ejercicio 6.** |
| R-02 | Estructura e interfaces | Los selectores de editorial, género y autores se generan desde los datos locales; el género incluye «Sin clasificar». | S-07, S-08 |
| R-03 | Datos y estados | Se rechazan: título/ISBN vacíos, ISBN duplicado (normalizado), precio no numérico o ≤ 0, sin autor, editorial/autor/género inexistentes, nombre/email vacíos, email inválido o duplicado (sin distinguir mayúsculas). Cada rechazo muestra un mensaje de texto cerca del formulario. | S-09 a S-24 |
| R-04 | Calidad | Los datos ingresados se insertan como texto en el DOM; el envío usa `preventDefault`. | S-25, S-26 + búsqueda de `innerHTML` |
| R-05 | Compatibilidad | Funciona al abrir `index.html` sin servidor, sin recargar la página tras el alta. | S-27, S-28 en Edge 155.0.4283.62 con `file://` |
| R-06 | Convenciones | Funciones acotadas y nombres comprensibles; normalización de ISBN y email en funciones reutilizables. | Revisión de nombres + § 5 |

### 4.2 Escenarios observables

| ID | Escenario | Resultado esperado | Cubre |
|---|---|---|---|
| S-01 | Abro `libros.html` sin servidor. | El formulario aparece con los selectores de editorial, género y autores ya poblados desde los datos locales, y el listado muestra los 9 libros de la semilla. | R-02, R-05 |
| S-02 | Miro el selector de género. | La primera opción dice «Sin clasificar» y las siguientes son los 5 géneros. | R-02 |
| S-03 | Registro un libro válido. | Aparece una fila nueva al final del listado; el mensaje de éxito se muestra; **la página no se recarga** (la URL no cambia y el foco no se pierde). | R-01, R-05 |
| S-04 | Registro un cliente válido. | Aparece una fila nueva en el listado de clientes; mensaje de éxito; sin recarga. | R-01, R-05 |
| S-05 | Tras un alta de libro, el listado de libros muestra el nuevo. | La fila tiene las 6 celdas con el mismo formato que el catálogo, y «Sin clasificar» si no se eligió género. | R-01 |
| S-06 | Abro `ventas.html`. | `#venta-cliente` tiene una opción por cliente y `#venta-libro` una por libro, con su precio. | R-01, R-02 |
| S-07 | El generador de opciones corre sobre datos modificados. | Si un autor o un género no estuviera en el conjunto local, no habría opción que lo representara. | R-02 |
| S-08 | El valor de «Sin clasificar» se persiste en el libro. | `generoId` queda en `null`, no en `""`. | R-02 |
| S-09 | Envío el formulario de libros con el título vacío. | Mensaje de error junto al formulario; **no** se agrega el libro. | R-03 |
| S-10 | Envío con el ISBN vacío. | Mensaje de error; no se agrega. | R-03 |
| S-11 | Envío con el ISBN de un libro existente, con guiones y espacios («978-030-7474728»). | Mensaje de error por duplicado; no se agrega. | R-03, R-06 |
| S-12 | Envío con el ISBN «9780307474728» (existente, sin guiones). | Mismo rechazo: la comparación es normalizada. | R-03 |
| S-13 | Envío con un ISBN nuevo. | Se agrega; el listado muestra el ISBN tal como se escribió. | R-01 |
| S-14 | Envío con el precio vacío. | Mensaje de error; no se agrega. | R-03 |
| S-15 | Envío con el precio «abc». | Mensaje de error de precio no numérico; no se agrega. | R-03 |
| S-16 | Envío con el precio «0». | Mensaje de error; no se agrega. | R-03 |
| S-17 | Envío con el precio «-5». | Mensaje de error; no se agrega. | R-03 |
| S-18 | Envío con el precio «1500,50». | Se acepta como 1500.5 y el listado muestra «$ 1.500,50». | R-03 |
| S-19 | Envío con el precio «1.500». | Mensaje de error de formato, **no** un precio de 1.5. | R-03 |
| S-20 | Envío sin elegir editorial. | Mensaje de error; no se agrega. | R-03 |
| S-21 | Envío sin elegir ningún autor. | Mensaje de error; no se agrega. | R-03 |
| S-22 | Envío con dos autores marcados. | Se agrega con los dos; el listado los separa con coma. | R-03 |
| S-23 | Envío con un género inexistente (manipulando el DOM). | Mensaje de error; no se agrega. | R-03 |
| S-24 | Envío el formulario de clientes con el email `ANA@EXAMPLE.COM` cuando existe `ana@example.com`. | Mensaje de error por duplicado; no se agrega. | R-03, R-06 |
| S-25 | Registro un cliente cuyo nombre es `<b>rojo</b>`. | El listado muestra el texto literal, no una negrita. | R-04 |
| S-26 | Presiono el botón «Registrar». | La URL no cambia y no aparece ninguna recarga: la página no navega. | R-04, R-05 |
| S-27 | Abro `libros.html` con `file://` en Edge. | Todo lo anterior funciona sin servidor. | R-05 |
| S-28 | Después de un alta, recargo la página con F5. | Vuelve la semilla: el registro perdido es la limitación declarada en § 1.1, no un defecto. | R-05, § 1.1 |

### 4.3 Casos límite

| ID | Caso | Regla esperada |
|---|---|---|
| E-01 | Título con espacios al principio y al final | Se recortan antes de comprobar que no esté vacío; se guarda recortado |
| E-02 | ISBN con guiones, espacios internos o mezcla de ambos | Se comparan normalizados; el valor guardado es el que se escribió |
| E-03 | ISBN existente escrito en minúsculas o con letras | No aplica: el ISBN no distingue mayúsculas y no se valida su formato (§ 9.4) |
| E-04 | Email con espacios exteriores | Se recortan antes de validar y antes de comparar |
| E-05 | Email existente con distinta capitalización | Se rechaza: la comparación es sin distinguir mayúsculas |
| E-06 | Email con dos arrobas o sin arroba | Se rechaza por formato |
| E-07 | Precio con espacios al principio y al final | Se recortan antes de comprobar el formato |
| E-08 | Precio «0,00» | Se rechaza: es numérico, pero no mayor que cero |
| E-09 | Precio con tres decimales («1500.555») | Se rechaza por formato (la expresión admite una sola parte decimal) |
| E-10 | Dos libros con el mismo título pero ISBN distintos | Ambos se registran; el segundo recibe un identificador distinto (§ 5.4) |
| E-11 | Un título que al convertirlo en identificador no deja letras ni números | Se genera un identificador de reserva numérico (§ 5.4) |
| E-12 | Varias reglas fallan a la vez | Se informan **todas** en el mismo mensaje, no solo la primera (§ 6) |
| E-13 | Un cliente con el mismo nombre que otro, distinto email | Se registra: la unicidad es del email, no del nombre |
| E-14 | Se envía el formulario dos veces seguidas con los mismos datos | El segundo envío se rechaza por ISBN o email duplicado (§ 4.2, S-11 y S-24) |
| E-15 | El conjunto de libros queda vacío | Se muestra «No hay libros registrados.» y no una tabla vacía sin explicación |
| E-16 | El conjunto de clientes queda vacío | Se muestra «No hay clientes registrados.» |

---

## 5. Estructura, componentes e interfaces propuestas

### 5.1 Archivos

| Archivo | Acción | Nota |
|---|---|---|
| `js/datos.js` | **Modificar** | Consultas que faltan, comprobaciones de existencia, mutaciones y generación de identificadores |
| `js/validaciones.js` | **Crear** | Reglas puras, sin DOM |
| `js/altas.js` | **Crear** | Capa DOM de las vistas nuevas; incluye `pintarListadoLibros()` y `pintarListadoClientes()` |
| `js/catalogo.js` | **Sin cambios** | Sus `crearFilaLibro` y `formatearPrecio` los reutiliza `js/altas.js` |
| `js/inicio.js` | **Modificar** | Detecta la vista abierta y conecta solo lo que existe |
| `libros.html` | **Modificar** | `novalidate`, `precio` → `type="text" inputmode="decimal"`, nota de uso de autores, etiquetas `<script>` |
| `clientes.html` | **Modificar** | `novalidate`, etiquetas `<script>` |
| `ventas.html` | **Modificar** | Etiquetas `<script>` |
| `index.html` | **Sin cambios** | Ya renderiza desde `estado` |
| `historial.html` | **Sin cambios** | Ejercicio 5 |
| `css/estilos.css` | **Modificado** | Una regla `.campo small { grid-column: 1 / -1; }` (§ 5.7) |
| `docs/05-altas-libros-clientes/SPEC.md` | **Crear** | Este documento |
| `docs/05-altas-libros-clientes/PLAN.md` | **Crear en la Fase 2** | Pendiente de aprobación |

### 5.2 Mapa de módulos

```
   datos-iniciales.js          semilla  (nunca se muta)
          |
          v
   datos.js        estado vivo + consultas + mutaciones
          |
          +---> validaciones.js   reglas puras, sin DOM
          |       normalizarIsbn / normalizarEmail
          |       esEmailValido / validarLibro / validarCliente
          |
          +---> catalogo.js       fila de 6 columnas + filtro
          |       crearFilaLibro / formatearPrecio  (reutilizados
          |       por el listado de libros registrados)
          |
          +---> altas.js          vistas Libros, Clientes y la
          |                       selección de venta
          |       pintarOpciones* / pintarListado* / alRegistrar*
          v
   inicio.js      arranque: detecta la vista y conecta lo que existe
```

**Por qué `validaciones.js` está separado de `altas.js`.** Son las dos caras de la consigna: *«Se comprueba que…»* (regla) y *«se muestran errores cerca del formulario»* (presentación). Separarlas deja las reglas como funciones puras —sin `document`, sin estado— que se pueden ejercitar sin navegador, y deja `altas.js` con una sola preocupación: hablar con el DOM. La consigna premia explícitamente «código legible, nombres comprensibles, funciones acotadas y separación entre estructura, estilos y comportamiento» (p. 6).

### 5.3 Interfaces

**`js/validaciones.js`** — reglas puras. Ninguna toca el DOM ni el estado vivo.

| Función | Responsabilidad | Devuelve |
|---|---|---|
| `normalizarIsbn(texto)` | Quita **todos** los espacios y guiones | `string` |
| `normalizarEmail(texto)` | Recorta los extremos y pasa a minúsculas | `string` |
| `esEmailValido(email)` | Aplica la expresión regular estricta | `boolean` |
| `validarLibro(datos)` | Aplica todas las reglas de libro y arma los mensajes | `{ ok: boolean, errores: string[] }` |
| `validarCliente(datos)` | Aplica todas las reglas de cliente y arma los mensajes | `{ ok: boolean, errores: string[] }` |

`datos` es un objeto plano con lo que se leyó del formulario: `{ titulo, isbn, precio, editorialId, generoId, autorIds }` y `{ nombre, email }`. Cada entrada de `errores` es una **oración completa** en segunda persona, lista para mostrar.

**`js/datos.js`** — el modelo. Se le agregan:

| Función | Responsabilidad |
|---|---|
| `obtenerClientes()` | Lista de clientes del estado vivo |
| `obtenerEditoriales()` | Lista de `{ id, nombre }` de editoriales |
| `obtenerGeneros()` | Lista de `{ id, nombre }` de géneros |
| `obtenerAutoresDisponibles()` | Lista de `{ id, nombre }` de autores. **Nombre nuevo a propósito:** `obtenerAutores(ids)` ya existe y devuelve nombres unidos por coma |
| `existeIsbn(isbn)` | Compara el ISBN normalizado contra todos los libros |
| `existeEmail(email)` | Compara el email normalizado contra todos los clientes |
| `agregarLibro(datos)` | Crea el libro con identificador nuevo y lo agrega al estado vivo; devuelve el libro creado |
| `agregarCliente(datos)` | Ídem para clientes |
| `generarId(prefijo, texto, coleccion)` | Construye un identificador único con la convención de D-01 |

El nombre `obtenerAutoresDisponibles` evita una colisión con la función existente. Es una decisión de legibilidad, no un capricho: el nombre debe decir qué devuelve.

**`js/altas.js`** — la capa DOM.

| Función | Responsabilidad |
|---|---|
| `pintarOpcionesEditoriales()` | Agrega una `<option>` por editorial a `#libro-editorial`, conservando la opción «Seleccioná una editorial» ya presente |
| `pintarOpcionesGeneros()` | Agrega una `<option>` por género a `#libro-genero`, conservando la opción «Sin clasificar» ya presente |
| `pintarOpcionesAutores()` | Agrega una `<option>` por autor a `#libro-autores` |
| `pintarOpcionesClienteVenta()` | Agrega una `<option>` por cliente a `#venta-cliente` |
| `pintarOpcionesLibroVenta()` | Agrega una `<option>` por libro a `#venta-libro` |
| `pintarListadoLibros()` | Vacía `#libros-listado` y dibuja una fila por libro con `crearFilaLibro`; alterna `#libros-estado-vacio` |
| `pintarListadoClientes()` | Vacía `#clientes-listado` y dibuja una fila por cliente; alterna `#clientes-estado-vacio` |
| `alRegistrarLibro(evento)` | `preventDefault`, lee, valida, agrega o muestra el error, y refresca el listado |
| `alRegistrarCliente(evento)` | Ídem para clientes |
| `mostrarError(elemento, mensajes)` | Escribe el texto del error y quita `hidden` |
| `mostrarExito(texto)` | Escribe el texto de éxito y quita `hidden` |
| `ocultarMensaje(elemento)` | Vuelve a poner `hidden` |

**`js/catalogo.js`** — **no se modifica en absoluto.** Sus dos funciones `crearFilaLibro` y `formatearPrecio` ya son exactamente lo que necesita la tabla de libros registrados: `libros.html` declara las mismas seis columnas que el catálogo. `js/altas.js` las **reutiliza**; no hay una sola línea duplicada.

**`js/inicio.js`** — el arranque, detección de vista por presencia de elementos:

| Función | Responsabilidad |
|---|---|
| `alCargar()` | `iniciarDatos()` y `pintarVistaActual()` |
| `pintarVistaActual()` | Llama a la función de render de la vista abierta, si existe |
| `registrarEventos()` | Registra el `submit` de cada formulario presente, con `addEventListener` |
| `iniciar()` | `registrarEventos()` y `alCargar()` |

El orden de los `<script>` es el mismo en las cuatro páginas, y `js/datos-iniciales.js` va primero:

```html
<script src="js/datos-iniciales.js"></script>
<script src="js/datos.js"></script>
<script src="js/validaciones.js"></script>
<script src="js/catalogo.js"></script>
<script src="js/altas.js"></script>
<script src="js/inicio.js"></script>
```

### 5.4 Forma de los datos y generación de identificadores

La forma de los registros no cambia: los libros siguen siendo `{ id, titulo, isbn, editorialId, generoId, autorIds[], precio }` y los clientes `{ id, nombre, email }`. Un alta respeta exactamente las relaciones que el Change 03 ya garantiza.

| Registro | Campo | Origen |
|---|---|---|
| Libro | `titulo` | El texto del formulario, recortado |
| Libro | `isbn` | El texto del formulario, recortado. **Se guarda tal como se escribió**; la normalización solo se usa para comparar (E-02) |
| Libro | `precio` | `Number` del texto normalizado (§ 5.5) |
| Libro | `editorialId` | El `value` de la opción elegida |
| Libro | `generoId` | El `value` de la opción elegida, o **`null`** si se eligió «Sin clasificar» (S-08) |
| Libro | `autorIds` | Los `value` de las opciones marcadas, en el orden de las opciones |
| Cliente | `nombre` | El texto del formulario, recortado |
| Cliente | `email` | El texto del formulario, recortado. **Se guarda tal como se escribió**; la normalización solo se usa para comparar (E-04) |

**Identificadores.** La convención D-01 del Change 03 es una cadena legible con guion: `li-cien-anos-de-soledad`, `ed-sudamericana`, `au-tolkien`, `cl-martina-ferreyra`. `generarId` la continúa:

1. `prefijo` (`li` para libros, `cl` para clientes) + el texto convertido en *slug*: minúsculas, sin tildes, con las secuencias de caracteres no alfanuméricos reemplazadas por un guion.
2. Si el identificador ya existe en la colección, se le agrega `-2`, `-3`, … hasta quedar libre.
3. Si el texto no deja ningún carácter alfanumérico, se usa un identificador de reserva numérico (`li-nuevo-10`).

«Cien años de soledad» produce `li-cien-anos-de-soledad`, exactamente igual que en la semilla.

### 5.5 Reglas de normalización y validación, en detalle

**ISBN** (`normalizarIsbn`): se eliminan todos los espacios y todos los guiones. `«978-030-7474728»` → `«9780307474728»`. La comparación contra la semilla usa el mismo criterio sobre el ISBN almacenado. **No se valida el formato, la longitud ni el dígito de control** (§ 9.4).

**Email** (`normalizarEmail`): se recorta y se pasa a minúsculas. `«  ANA@Example.COM  »` → `«ana@example.com»`. Es el criterio exacto de la consigna: «comparado sin espacios exteriores y sin distinguir mayúsculas de minúsculas».

**Formato de email** (`esEmailValido`): `^[^\s@]+@[^\s@]+\.[^\s@]+$`. Exige una arroba, que no haya espacios, texto antes y después, y al menos un punto en el dominio.

| Entrada | Resultado |
|---|---|
| `ana@example.com` | Válido |
| `ana.b+libro@sub.dominio.com.ar` | Válido |
| `ana@example` | Inválido — sin punto en el dominio |
| `ana@` | Inválido |
| `ana` | Inválido |
| `ana@@example.com` | Inválido |
| `ana@ex ample.com` | Inválido |
| `ana example.com` | Inválido |

**Precio.** Con `type="text"` el JavaScript lee el texto crudo. La forma aceptada es un entero, con signo opcional, y una parte decimal de una o dos cifras separada por punto o por coma:

```
   ^-?\d+(?:[.,]\d{1,2})?$
```

| Entrada | Resultado |
|---|---|
| `1500` | 1500 |
| `1500.50` | 1500.5 |
| `1500,50` | 1500.5 (la coma se convierte en punto) |
| `0` | 0 → rechazado por «mayor que cero» |
| `-5` | -5 → rechazado por «mayor que cero» |
| `1.500` | **Rechazado por formato** |
| `1500.555` | Rechazado por formato: tres decimales |
| `1500,50,00` | Inválido por formato |
| `abc` | Inválido por formato |

El rechazo de `1.500` es deliberado (§ 2.4, sonda 4 y la consecuencia 4): `Number("1.500")` es `1.5`, de modo que una interpretación permisiva registraría en silencio un libro de $1500 a $1.50. Un rechazo con un mensaje que declara el formato esperado es un fallo visible y recuperable; un precio equivocado, no.

El tope de **dos decimales** es lo que produce ese rechazo: un precio en pesos tiene como máximo centavos, y `1.500` tiene tres cifras decimales. El tope también resuelve el caso límite E-09 (`1500.555`), que una expresión sin límite de decimales habría aceptado.

> **Corrección 20/10/2026 (Fase 3).** La primera versión de este SPEC documentaba la expresión `^\d+(?:[.,]\d+)?$`, que **acepta** `1.500`: el `\d+` inicial tomaba el `1` y el grupo `[.,]\d+` tomaba el `.500`. Esa expresión contradecía su propia regla de rechazar el separador de miles y el caso límite E-09. La forma corregida es la de arriba. La corrección no cambia ningún comportamiento observable: `1.500` y `1500.555` se rechazan, como el SPEC ya exigía. Queda registrada en «Desvíos de la implementación» de `design.md`.


**Autores.** Se leen con `select.selectedOptions`, que devuelve la lista de opciones marcadas en el orden del documento. La comprobación «al menos un autor» usa la longitud de esa lista; la comprobación «todos existen» busca cada `value` en el conjunto local de autores.

### 5.6 Contrato con el DOM existente

| Elemento existente | Uso en este change |
|---|---|
| `form#libros-form-alta` | Se escucha el `submit`; se llama a `preventDefault()` |
| `form#clientes-form-alta` | Ídem |
| `input#libro-titulo` | Se lee su `value` |
| `input#libro-isbn` | Se lee su `value` |
| `input#libro-precio` | Se lee su `value`; cambia de `type="number"` a `type="text"` con `inputmode="decimal"` (D-04) |
| `select#libro-editorial` | Se le agregan `<option>`; se lee su `value` |
| `select#libro-genero` | Se le agregan `<option>`; se lee su `value`; `""` significa sin género |
| `select#libro-autores` | Se le agregan `<option>`; se leen sus `selectedOptions` |
| `input#cliente-nombre` | Se lee su `value` |
| `input#cliente-email` | Se lee su `value` |
| `p#libros-mensaje-error` | Destino del mensaje de error del formulario de libros |
| `p#clientes-mensaje-error` | Destino del mensaje de error del formulario de clientes |
| `p#mensaje-exito` | Destino del mensaje de éxito |
| `p#libros-estado-vacio` | Se alterna con `hidden` según haya libros o no |
| `p#clientes-estado-vacio` | Se alterna con `hidden` según haya clientes o no |
| `tbody#libros-listado` | Destino de las filas; se vacía con `replaceChildren()` |
| `tbody#clientes-listado` | Ídem |
| `select#venta-cliente` | Se le agregan `<option>` con los clientes |
| `select#venta-libro` | Se le agregan `<option>` con los libros y su precio |
| `table#libros-tabla` | No se modifica: se le agregan las 6 celdas que ya declara su `<thead>` |
| `table#clientes-tabla` | No se modifica: se le agregan las 2 celdas que ya declara su `<thead>` |

**No se agrega ni se quita ningún `id`, ninguna clase y ningún texto visible ya escrito.** Los únicos elementos nuevos son un `<small>` de ayuda en el campo de autores y las etiquetas `<script>`.

### 5.7 Qué necesita `css/estilos.css` y qué no

Todo lo que se agrega encaja en las clases existentes, con **una sola excepción**:

| Necesidad | Clase existente | Nota |
|---|---|---|
| Mensaje de error | `.mensaje.mensaje--error` | Ya aplicado a `p#libros-mensaje-error` y `p#clientes-mensaje-error` |
| Mensaje de éxito | `.mensaje.mensaje--exito` | Ya aplicado a `p#mensaje-exito` |
| Listado vacío | `.estado-vacio` | Ya aplicado a los dos `p` de estado |
| Tablas | `.tabla`, `.tabla-desplazable` | Ya aplicadas |
| Columnas que no se parten | `.tabla .celda-atomica` | La usa `crearFilaLibro` para ISBN y precio |
| Fila del listado de clientes | — | Se construye con `textContent` sobre `td`; **sin** `celda-atomica`, para que un email largo pueda partirse en lugar de desbordar |
| Selectores | `.campo select`, `.campo select[multiple]` | Ya aplicadas |
| Botones | `.boton.boton--primario`, `.boton.boton--secundario` | Ya aplicados |
| **Nota de uso de autores** | **`.campo small` (regla nueva)** | **Única excepción: ver abajo** |

El texto de la nota de uso será: *«Podés seleccionar más de un autor. En computadora, mantené presionado Ctrl o Shift para sumar más de uno.»*

> **Corrección 20/10/2026 (Fase 3, después del archivado).** Esta sección afirmaba que `css/estilos.css` no necesitaba cambios, y la afirmación era **falsa**: a partir de 640 px, `.campo` pasa a `grid-template-columns: minmax(10rem, 16rem) minmax(0, 1fr)` —etiqueta | control—, de modo que el `<small>` de la nota quedaba en la **columna de la etiqueta** y se estrujaba en 10 rem, en tres líneas. La revisión visual lo detectó; ninguna comprobación automática lo hacía, porque el texto era legible.
>
> La corrección es una regla de tres líneas, acotada al selector que solo existe en `libros.html`:
>
> ```css
> .campo small {
>   grid-column: 1 / -1;
> }
> ```
>
> Con ella la nota ocupa todo el ancho del campo y queda **debajo del control**. A 320 px no cambia nada: `.campo` tiene una sola columna y `1 / -1` es esa misma columna. El selector `.campo small` no existe en ninguna otra vista, así que los otros cuatro HTML y la tabla del catálogo no se ven afectados.


### 5.8 Reglas de la implementación

| Regla | Detalle |
|---|---|
| Inserción de datos | `document.createElement` + `textContent`. **Prohibido `innerHTML`** en todo el proyecto, incluso con texto fijo |
| Eventos | `addEventListener`. **Prohibidos los atributos `on*`** en el HTML |
| Estado | Una sola variable con el estado vivo. La semilla `DATOS_INICIALES` **no se muta**: se copia al iniciar |
| Opciones | Se construyen con `document.createElement("option")` y `textContent`, nunca con `innerHTML` |
| Validación | Las reglas viven en `js/validaciones.js`, sin DOM. `js/altas.js` traduce el resultado a mensajes y los muestra |
| Estilo | No se agregan estilos en línea ni se modifican las clases existentes |
| Orden de los `<script>` | `datos-iniciales.js` → `datos.js` → `validaciones.js` → `catalogo.js` → `altas.js` → `inicio.js` |
| Paneles de error y éxito | Solo se alterna `hidden`; el texto se reemplaza por el motivo concreto |

---

## 6. Estados y manejo de errores

| Situación | Comportamiento esperado |
|---|---|
| Formulario completo y válido | Se agrega el registro, se refresca el listado, se muestra el mensaje de éxito y se limpia el formulario |
| Una o varias reglas fallan | Se **no** agrega nada, se muestran todos los motivos en el mensaje de error y el formulario **conserva** lo que el usuario escribió |
| Mensaje de error visible | Se oculta el mensaje de éxito, para que no se muestren los dos a la vez |
| Mensaje de éxito visible | Se oculta el mensaje de error |
| Listado con registros | Filas dibujadas; el mensaje de «vacío» con `hidden` |
| Listado sin registros | Sin filas; el mensaje de «vacío» visible |
| Envío del formulario | `preventDefault()`; la página no se recarga ni cambia la URL |
| Opción de género «Sin clasificar» | Se guarda `generoId: null` y el listado muestra «Sin clasificar» |
| Referencia rota en los datos | La fila muestra «Editorial desconocida» (comportamiento ya existente de `obtenerEditorial`) |
| Error de JavaScript | La página sigue siendo legible: el HTML no depende del script para mostrar su contenido |

### 6.1 Forma de los mensajes

Los textos de error ya escritos en el Change 01 se **conservan** y los motivos concretos se **agregan** detrás:

```
   No se pudo registrar el libro. Ingresá el ISBN del libro. Ya existe un libro con ese ISBN.
```

Lo mismo para el cliente:

```
   No se pudo registrar el cliente. El correo electrónico no tiene un formato válido.
```

Y el mensaje de éxito:

```
   Operación realizada correctamente. Se registró el libro «Cien años de soledad».
```

El título y el nombre se insertan con `textContent`, de modo que un título con `<b>rojo</b>` se muestra literal (S-25).

**Todas las reglas que fallan se informan, no solo la primera** (E-12). Cada motivo es una oración completa y se unen con un espacio.

### 6.2 Limpieza del formulario tras un alta correcta

Tras un alta exitosa se ejecuta `form.reset()`. Es la forma de evitar que un segundo envío por inercia duplique el registro (E-14), y `reset()` devuelve los selectores a su estado inicial: «Seleccioná una editorial», «Sin clasificar» y ninguna opción de autor marcada, porque las opciones las genera el JavaScript sin atributo `selected`.

---

## 7. Restricciones técnicas y convenciones

| # | Restricción | Origen |
|---|---|---|
| 1 | HTML, CSS y JavaScript nativos. Sin librerías, frameworks ni CDN | Prompt, consigna p. 1 y p. 6 |
| 2 | Sin `fetch`, API, base de datos ni servidor | Prompt, consigna p. 1 |
| 3 | Sin `localStorage` en este change | Prompt (reservado al Ejercicio 6) |
| 4 | Sin npm ni herramientas de compilación | Prompt |
| 5 | Debe funcionar abriendo los archivos con `file://` | Prompt, consigna |
| 6 | Los scripts **no pueden ser módulos ES**: con `file://` el origen es `null` y Chrome/Edge bloquean los `import` | Verificado en Edge headless en el Change 03 |
| 7 | Los datos del modelo se insertan como texto, nunca como HTML | Consigna p. 3, R-04 |
| 8 | Sin estilos en línea, sin `<style>`, sin atributos `on*` | Contrato del Change 02 |
| 9 | Funciones acotadas con una responsabilidad y nombres comprensibles | Consigna p. 6, R-06 |
| 10 | Los identificadores existentes del HTML no se modifican | Contrato del Change 01 |
| 11 | `novalidate` en los dos formularios: la validación es responsabilidad del JavaScript y los mensajes son propios y en español | D-06, § 2.4 |

---

## 8. Criterios de aceptación

| ID | Criterio | Requisitos | Verificación |
|---|---|---|---|
| CA-01 | Un libro válido aparece en el listado, sin recargar. | R-01, R-05 | S-03, S-05; la URL no cambia tras el envío |
| CA-02 | Un cliente válido aparece en el listado, sin recargar. | R-01, R-05 | S-04 |
| CA-03 | Editorial, género (con «Sin clasificar») y autores se generan desde los datos locales. | R-02 | S-01, S-02, S-06; conteo de `<option>` contra la semilla |
| CA-04 | Cada regla de validación rechaza su caso con un mensaje de texto cerca del formulario y no agrega el registro. | R-03 | S-09 a S-24; en cada caso: mensaje visible **y** el conteo del listado sin cambios |
| CA-05 | El ISBN se compara sin espacios ni guiones; el email, sin espacios exteriores ni distinción de mayúsculas. | R-03, R-06 | S-11, S-12, S-24 |
| CA-06 | Los datos se insertan como texto y el envío usa `preventDefault`. | R-04 | Búsqueda de `innerHTML` y de `on*=` → 0 coincidencias; S-25 |
| CA-07 | Funciona con `file://`, sin servidor, y sin recargar tras el alta. | R-05 | S-26, S-27 en Edge 155.0.4283.62 |
| CA-08 | No se incorpora trabajo excluido. | — | Búsqueda de `fetch(`, `localStorage`, `sessionStorage`, `http://` → 0 coincidencias |
| CA-09 | Las otras vistas no cambian fuera de lo previsto. | — | `index.html` sin cambios; `historial.html` sin cambios; `css/estilos.css` sin cambios |
| CA-10 | Los selectores de la selección de venta se pueblan desde el estado local. | R-01, R-02 | S-06 |

Además, con lo pedido por el prompt: los controles **aprobados, fallidos, omitidos y pendientes** se distinguen en el informe, y **ningún control no ejecutado se presenta como aprobado**.

---

## 9. Supuestos, información pendiente y decisiones

### 9.1 Supuestos

| ID | Supuesto | Si fuera falso |
|---|---|---|
| A-01 | La estructura HTML del Change 01 se mantiene: no se agregan ni se cambian `id`, clases ni textos visibles ya escritos | Cambiaría el alcance y el contrato con el Change 01 |
| A-02 | Los estilos existentes alcanzan para el mensaje de error, el mensaje de éxito, los estados vacíos y las tablas | La única excepción resulto ser la nota de uso del campo de autores, que necesita una regla propia (§ 5.7) |
| A-03 | La semilla `datos-iniciales.js` no se muta: la aplicación trabaja sobre una copia | El Ejercicio 6 perdería la semilla original |
| A-04 | El precio se sigue presentando con formato de moneda local `es-AR` | Cambiaría solo la presentación de una celda |
| A-05 | Los scripts se cargan en orden y comparten variables globales por responsabilidad | Habría que revisar el orden de los `<script>` |
| A-06 | La nota de uso de los autores se resuelve con un `<small>` dentro del `.campo` existente, sin clase ni CSS nuevos | Habría que agregar una regla de estilo |
| A-07 | El `step` implícito de `input[type=number]` no aporta nada útil aquí: los precios no son enteros y el campo pasa a `type="text"` | Si los precios fueran siempre enteros, `type="number"` con `step="1"` bastaría y no haría falta `inputmode` |
| A-08 | Firefox ya no está instalado en esta máquina (el SPEC-03 lo registraba en 158.0); la verificación se hace en Edge 155.0.4283.62 | Habría que instalar Firefox para una segunda verificación |

### 9.2 Decisiones resueltas (20/10/2026)

| ID | Decisión | Respuesta | Consecuencia en esta entrega |
|---|---|---|---|
| **D-01** | Alcance de R-01 frente a la imposibilidad del cruce entre páginas | **5 páginas, estado único** | `estado` es la única fuente de verdad; `iniciarDatos()` es el único punto que lo siembra. El cruce entre páginas es del Ejercicio 6 (§ 1.1) |
| **D-02** | Criterio de email válido | **Estricto con dominio punteado** | `^[^\s@]+@[^\s@]+\.[^\s@]+$` (§ 5.5) |
| **D-03** | Control de autores | **Select multiple + nota de uso** | Se conserva el `<select id="libro-autores" multiple>` del Change 01 y se le agrega un `<small>` (§ 5.7) |
| **D-04** | Tipo del campo de precio | **`type="text"` con `inputmode="decimal"`** | Permite distinguir «no numérico» de «vacío» y aceptar la coma decimal es-AR (§ 2.4) |
| **D-05** | Formato del precio aceptado | **Entero con signo opcional, y una parte decimal de una o dos cifras separada por punto o coma** | `1.500` y `1500.555` se rechazan: tres decimales no son un precio en pesos. Ver la corrección del 20/10/2026 en § 5.5 |
| **D-06** | Validación nativa del navegador | **`novalidate` en los dos formularios** | El JavaScript es la única autoridad sobre los mensajes; sin esto un email inválido nunca dispararía el `submit` (§ 2.4) |
| **D-07** | Ruta de los documentos y nombre del change | **`docs/05-altas-libros-clientes/` y change `05-altas-libros-clientes`** | El prefijo `04` ya lo ocupa el change archivado `04-legibilidad-tabla-320`; el `04` del prompt corresponde al **Ejercicio 4** del parcial, no al quinto change de la serie |
| **D-08** | Nombres y ubicación de los archivos JavaScript | **`js/validaciones.js` y `js/altas.js` nuevos; `js/datos.js` y `js/inicio.js` modificados; `js/catalogo.js` sin cambios** | `js/catalogo.js` no se toca: su `crearFilaLibro` ya sirve para las dos tablas de libros |
| **D-09** | Forma de los mensajes de error | **Se conservan las frases del Change 01 y se agregan los motivos detrás; se informan todas las reglas que fallan** | § 6.1 |
| **D-10** | Limpieza del formulario tras un alta correcta | **`form.reset()`** | Evita el reenvío por inercia; `reset()` devuelve los selectores a su estado inicial (§ 6.2) |
| **D-11** | Identificadores de los registros nuevos | **Slug legible con guion, más sufijo numérico si ya existe** | Continúa la convención D-01 del Change 03 (§ 5.4) |
| **D-12** | Alcance de la selección de venta | **Se pueblan `#venta-cliente` y `#venta-libro`; nada más** | R-01 lo nombra; los renglones, el total y la confirmación son del Ejercicio 5 |

### 9.3 Información pendiente

| ID | Dato | Efecto | Estado |
|---|---|---|---|
| PD-01 | Herramientas autorizadas por el docente | `{{DATO_PENDIENTE: confirmar el editor y la consola de referencia}}` | Bloquea el informe de comprobaciones del PLAN. En esta máquina: Edge 155.0.4283.62, Node v24.19.0, Python 3.14.0. El editor no está determinado en el repositorio. |
| PD-02 | Arnés de verificación automatizado | `{{DATO_PENDIENTE: confirmar si se mantiene el arnés headless fuera del proyecto, como en D-06 del SPEC-03}}` | No bloquea el SPEC; se define en el PLAN |
| PD-03 | Navegador de referencia adicional | Firefox no está instalado (A-08) | Se verificará en Edge 155.0.4283.62. La segunda verificación queda pendiente salvo que se instale Firefox. |

### 9.4 Lo que este SPEC no decide

- El contenido línea por línea de cada función: es implementación, no contrato.
- El nombre de la variable que recibe el resultado de `validarLibro` y `validarCliente`.
- La **validación del formato, la longitud y el dígito de control del ISBN**: R-03 solo pide «vacío» y «duplicado», y la consigna exonera explícitamente del dígito de control. El ISBN se acepta tal como se escribe.
- La **marca visual del campo inválido** (`.campo--error`, `aria-invalid`): requeriría CSS nuevo y una decisión de diseño que la consigna no pide. El mensaje junto al formulario cumple R-03.
- El **doble clic** sobre el botón «Registrar»: no hay un mecanismo adicional de bloqueo, pero el segundo envío se rechaza por ISBN o email duplicado (E-14).
- La persistencia, las ventas, el historial y el README.

### 9.5 Propuestas pendientes (detectadas y **no** implementadas)

| ID | Propuesta | Dónde |
|---|---|---|
| P-01 | La tabla de clientes registrados usa `.tabla` (`min-width: 760px`) con solo 2 columnas, mientras que `historial.html` usa `.tabla--compacta` (`min-width: 480px`) para una tabla de 4 columnas. Con 2 columnas, 760 px quedan holgados y a 320 px la tabla se desplaza más de lo necesario. | `clientes.html` |
| P-02 | No hay estilo para `aria-invalid` ni para marcar el campo que falló. Si el docente lo pide, se puede sumar una clase sin tocar la estructura. | `css/estilos.css` |
| P-03 | El precio se **muestra** con separador de miles («$ 1.500,00») y se **carga** sin él. Alinear las dos convenciones exigiría admitir el separador de miles, con el riesgo de convertir en silencio `1.500` en `1.5`. | Decisión D-05 |

---

## 10. Trazabilidad

| Requisito | Elementos del SPEC |
|---|---|
| R-01 | §1.1, §3.1 (puntos 1, 2, 4, 5, 8), §4.2 (S-03, S-04, S-05, S-06), §8 (CA-01, CA-02, CA-10) |
| R-02 | §3.1 (puntos 3, 8), §4.2 (S-01, S-02, S-06, S-07, S-08), §5.3, §8 (CA-03) |
| R-03 | §4.1, §4.2 (S-09 a S-24), §4.3 (E-01 a E-14), §5.5, §6, §8 (CA-04, CA-05) |
| R-04 | §2.5, §4.2 (S-25, S-26), §5.8, §8 (CA-06) |
| R-05 | §1.1, §4.2 (S-01, S-03, S-04, S-26, S-27, S-28), §7, §8 (CA-01, CA-02, CA-07) |
| R-06 | §4.2 (S-11, S-24), §5.3, §5.4, §5.5, §5.8, §8 (CA-05) |

---

> **Estado:** este SPEC v1 se presenta para revisión. Habilita el PLAN (Fase 2) y, con la autorización posterior de la persona usuaria, la implementación (Fase 3). **Ninguna línea de código del producto se modificó al escribir este documento.**
