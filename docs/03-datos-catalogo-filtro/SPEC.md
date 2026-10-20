# SPEC — Change 03: Datos locales, catálogo y filtro

| Campo | Valor |
|---|---|
| Change | 03 — Datos locales, catálogo y filtro (Ejercicio 3 · 15 puntos) |
| Fase | Fase 1 — SPEC |
| Versión | v2 |
| Estado | **Implementado, verificado y archivado** el 20/10/2026 (`openspec/changes/archive/2026-10-20-03-datos-catalogo-filtro/`). T-23 (recorrido con teclado) **ejecutado y verificado** el 20/10/2026 con pulsaciones reales de Tab y Enter |
| Registro | El change de OpenSpec se registró **antes** de la implementación, con los cuatro artefactos (proposal, specs, design, tasks) revisados junto con el PLAN. La implementación se desvió del plan en 3 puntos, documentados en la sección «Desvíos de la implementación» de `design.md`. |
| Fecha | 20/10/2026 |
| Proyecto | Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN) |
| Ubicación | `C:\Users\zalaz\OneDrive\Desktop\libreria` (verificada) |
| Ruta del documento | `docs/03-datos-catalogo-filtro/SPEC.md` — **ruta propuesta, a confirmar (D-04)** |
| Depende de | Change 01 (HTML, archivado) y Change 02 (CSS, archivado) |
| Fuentes de requisitos | `docs/Consigna Primer Parcial.pdf` p. 3 (Ejercicio 3), p. 6 (criterios y caso manual) |

---

## 1. Problema, objetivo y resultado esperado

**Problema.** La interfaz está terminada en estructura e identidad visual, pero no muestra información: el `<tbody id="catalogo-listado">` de `index.html` está vacío y el buscador no hace nada. El Ejercicio 3 es el primero que introduce JavaScript y el modelo de datos, y vale 15 de los 100 puntos del parcial (criterio «3. Datos y catálogo»: modelo y ejemplos 5, renderizado 5, filtro y estados 5).

**Objetivo de esta entrega.** Definir el conjunto de datos local del catálogo —libros, editoriales, géneros, autores y clientes— con identificadores estables y relaciones válidas; generar el catálogo con JavaScript a partir de ese conjunto; y filtrarlo por título de forma insensible a mayúsculas y minúsculas, con coincidencias parciales.

**Resultado esperado.** Al abrir `index.html` sin servidor:

1. el catálogo se dibuja con los libros del conjunto local, con título, ISBN, editorial, género, autores y precio;
2. un libro sin género se muestra con el texto «Sin clasificar»;
3. el buscador filtra por título: `cien`, `CIEN` y `  años  ` devuelven el mismo resultado;
4. una búsqueda vacía vuelve a mostrar el catálogo completo;
5. una búsqueda sin coincidencias muestra un mensaje claro y no deja filas residuales;
6. las otras cuatro vistas no cambian.

**Fuera del resultado:** altas de libros y clientes (Ejercicio 4), ventas e historial (Ejercicio 5), persistencia en `localStorage` (Ejercicio 6) y README (Ejercicio 6).

---

## 2. Contexto verificado y fuentes consultadas

### 2.1 Estado actual del proyecto (verificado el 20/10/2026)

| Dato | Valor | Cómo se verificó |
|---|---|---|
| Vistas HTML | `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` en la raíz | Listado de archivos |
| Hoja de estilos | `css/estilos.css` (Change 02, archivado) | Listado de archivos |
| Imagen | `logo.png` (397×402 px, fondo blanco opaco) | Listado + cabecera PNG |
| JavaScript en el proyecto | `datos-iniciales.js` (6.532 bytes) | Listado de archivos |
| `<script>` en los HTML | **0** | Búsqueda de `<script` en los 5 archivos |
| Tabla del catálogo | `table#catalogo-tabla` con `<thead>` de 6 columnas (Título, ISBN, Editorial, Género, Autores, Precio) y `<tbody id="catalogo-listado">` **vacío** | Lectura de `index.html` |
| Formulario de búsqueda | `form#catalogo-form-busqueda` (`role="search"`), `input#catalogo-busqueda` (`type="search"`), `button#catalogo-boton-buscar` (`type="submit"`) | Lectura de `index.html` |
| Estados previstos | `p#catalogo-estado-vacio` y `p#catalogo-estado-sin-resultados`, ambos con `hidden` | Lectura de `index.html` |
| Datos iniciales | `datos-iniciales.js` con 9 libros, 7 editoriales, 5 géneros, 10 autores, 4 clientes y 2 ventas | Verificación con Node: **36 comprobaciones en verde** |
| Scripts bajo `file://` | Un `<script src="datos-iniciales.js">` clásico expone `DATOS_INICIALES` correctamente | Edge headless sobre `file://` |
| Módulos ES bajo `file://` | **No usables**: Chrome y Edge bloquean el `import` desde el origen `null` por CORS | Restricción documentada; verificada la alternativa clásica |
| Navegadores | Edge **155.0.4283.62**, Firefox **158.0** | Versión de los binarios instalados |
| Node | **v24.19.0**, presente en el sistema | `node --version` |
| Git | El proyecto **es** un repositorio, con un commit (`agrego change 01`); los cambios de este ejercicio están sin commitear | `git log` y `git status` |
| Changes de OpenSpec | `2026-10-19-01-estructura-html` y `2026-10-20-02-css-adaptable` (archivados) | `openspec list` |
| Specs vivas | `libreria-frontend` (12 requirements), `presentacion-css` (10 requirements) | `openspec list --specs` |

### 2.2 Requisitos citados de la consigna (p. 3, Ejercicio 3)

> «Se representan libros, editoriales, géneros, autores y clientes mediante arrays y objetos con identificadores estables. El conjunto inicial incluye al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes ficticios. Cada libro se relaciona con una editorial existente y uno o más autores existentes. El género es opcional; si se asigna, corresponde a un género existente.»

> «JavaScript genera el catálogo a partir del array de libros. El filtro por título ignora diferencias entre mayúsculas y minúsculas, busca coincidencias parciales y elimina espacios sobrantes en los extremos de la búsqueda. Una búsqueda vacía muestra todo el catálogo; una búsqueda sin coincidencias muestra un mensaje claro.»

> «Se utilizan eventos y funciones con responsabilidades reconocibles. Los datos escritos por usuarios se insertan como texto en el DOM. No se requiere traer datos con fetch ni administrar altas, bajas y modificaciones de editoriales, géneros o autores.»

### 2.3 Criterio de evaluación (p. 6)

| Ejercicio | Puntos | Desglose |
|---|---|---|
| 3. Datos y catálogo | 15 | Modelo y ejemplos: 5 · Renderizado: 5 · Filtro y estados: 5 |

### 2.4 Caso manual que la consigna exige registrar (p. 6, a documentar en el Ejercicio 6)

> «Búsqueda con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente» → «Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados.»

Este caso es la columna vertebral de la verificación de este change.

### 2.5 Contratos heredados que este change no puede romper

- `libreria-frontend`: los `<tbody>` existen con id; los mensajes de estado existen y se alternan con `hidden`; los identificadores y los textos visibles no se modifican.
- `presentacion-css`: la tabla y los estados vacíos ya tienen estilo; **no se agregan estilos en línea** ni se modifican las clases existentes sin necesidad.

---

## 3. Alcance

### 3.1 Incluido

| # | Alcance |
|---|---|
| 1 | Conjunto de datos local con arrays y objetos de identificador estable para libros, editoriales, géneros, autores y clientes (`datos-iniciales.js`, ya escrito y verificado) |
| 2 | Módulo de datos: expone el estado en memoria y las consultas que el renderizado necesita (editorial de un libro, género de un libro, autores de un libro) |
| 3 | Renderizado del catálogo a partir del array de libros, con las 6 columnas del `<thead>` existente |
| 4 | Filtro por título: normalización, coincidencia parcial, búsqueda vacía y búsqueda sin resultados |
| 5 | Alternancia de los dos estados previstos (`hidden`) |
| 6 | Scripts del proyecto enlazados desde `index.html` |

### 3.2 Excluido (explícito)

| Exclusión | Motivo |
|---|---|
| `localStorage` | Reservado al Ejercicio 6 por la consigna |
| Formularios de alta de libros y clientes | Ejercicio 4 |
| Ventas, renglones, historial | Ejercicio 5 |
| Renderizado de las listas de clientes, ventas e historial | Sus ejercicios (4 y 5) |
| `fetch`, API, base de datos, servidor | Excluido por la consigna y por el requisito de funcionar sin servidor |
| Altas, bajas y modificaciones de editoriales, géneros o autores | La consigna dice que no se administran |
| npm, bundlers, transpiladores, librerías, frameworks, CDN | Excluido por la consigna |
| README y registro de casos manuales | Ejercicio 6 |
| Paginación, ordenamiento, búsqueda por ISBN o autor, filtros combinados | No pedidos: el filtro es por título |
| Cambios en `docs/01-*`, `docs/02-*`, en las specs de otras capabilities, en `css/estilos.css` | Fuera de alcance |

---

## 4. Requisitos, escenarios y casos límite

### 4.1 Requisitos (del prompt, con el detalle de verificación)

| ID | Grupo | Requisito | Verificación prevista |
|---|---|---|---|
| R-01 | Funcional | El filtro por título ignora mayúsculas/minúsculas, admite coincidencias parciales y recorta espacios en los extremos. | Casos S-03 a S-05 |
| R-02 | Estructura e interfaces | El catálogo se genera desde el array de libros con JavaScript; las funciones de datos, renderizado y eventos tienen responsabilidades separadas. | Estructura de archivos + `<tbody>` vacío en el HTML y con filas en ejecución |
| R-03 | Datos y estados | Datos iniciales con las cantidades mínimas y relaciones válidas; búsqueda vacía muestra todo el catálogo; sin coincidencias muestra mensaje claro; libro sin género muestra «Sin clasificar». | Verificación de datos + casos S-02, S-06, S-07 |
| R-04 | Calidad | El contenido proveniente de datos se inserta como texto, sin interpretarlo como HTML. | Búsqueda de `innerHTML` en el código + caso S-09 |
| R-05 | Compatibilidad | Funciona al abrir `index.html` sin servidor. | Apertura con `file://` en Edge headless |
| R-06 | Convenciones | Identificadores estables y nombres comprensibles; código legible con funciones acotadas. | Revisión de nombres + límite de 15 líneas por función propuesto |

### 4.2 Escenarios observables

| ID | Escenario | Resultado esperado | Cubre |
|---|---|---|---|
| S-01 | Abro `index.html` sin servidor. | El catálogo aparece con las 9 filas del conjunto local. | R-02, R-05 |
| S-02 | Miro una fila y busco el libro sin género. | La celda de género dice «Sin clasificar», nunca vacía. | R-03 |
| S-03 | Busco `cien`. | Aparece «Cien años de soledad». | R-01 |
| S-04 | Busco `CIEN`. | Aparece el mismo libro: el filtro no distingue mayúsculas. | R-01 |
| S-05 | Busco `  años  ` (espacios en los extremos). | Aparece el mismo libro: los extremos se recortan. | R-01 |
| S-06 | Busco `zzz`. | No quedan filas y aparece «No se encontraron libros para la búsqueda.». | R-03 |
| S-07 | Borro el buscador y busco de nuevo. | Vuelve el catálogo completo. | R-03 |
| S-08 | Busco `h` y después `rayuela`. | La segunda búsqueda muestra solo ese libro, sin filas de la anterior. | R-01, R-03 |
| S-09 | Un título contuviera `<b>rojo</b>`. | Se muestra el texto literal, no una negrita. | R-04 |
| S-10 | Abro las otras cuatro vistas. | Siguen idénticas a antes de este change. | R-05 |
| S-11 | Presiono Enter en el buscador sin escribir nada. | Se muestra el catálogo completo, sin error. | R-01, R-03 |

### 4.3 Casos límite

| ID | Caso | Regla esperada |
|---|---|---|
| E-01 | Búsqueda con espacios al principio y al final | Se recortan antes de comparar |
| E-02 | Búsqueda con espacios dobles o tabuladores internos | Se comparan tal cual; la coincidencia parcial sigue funcionando |
| E-03 | Búsqueda con tildes frente a títulos con tildes | Comparación literal salvo mayúsculas: **no** se normalizan acentos (la consigna no lo pide) |
| E-04 | Búsqueda de un solo carácter | Coincide con todos los títulos que lo contengan |
| E-05 | Búsqueda de un espacio únicamente | equivale a búsqueda vacía: muestra todo |
| E-06 | Conjunto de libros vacío | Se muestra «No hay libros en el catálogo.», no una tabla vacía sin explicación |
| E-07 | Un libro con dos autores | La celda los separa de forma legible |
| E-08 | Un libro cuyo autor no estuviera en el conjunto | La celda no queda vacía: se documenta un valor por defecto legible |
| E-09 | Dos búsquedas seguidas, la segunda sin coincidencias | La tabla queda vacía y el mensaje de «sin resultados» visible, no ambos mensajes a la vez |

---

## 5. Estructura, componentes e interfaces propuestas

### 5.1 Archivos

| Archivo | Acción | Nota |
|---|---|---|
| `js/datos-iniciales.js` | **Existe** en la raíz; se traslada a `js/` | Decisión D-03, resuelta |
| `js/datos.js` | Crear | Modelo: estado y consultas |
| `js/catalogo.js` | Crear | Renderizado y filtro |
| `js/inicio.js` | Crear | Arranque y eventos |
| `index.html` | Modificar | Agregar los `<script>` al final del `<body>` |
| `css/estilos.css` | **Sin cambios** | Los estilos de tabla y de estado ya existen |

### 5.2 Interfaces (propuestas, a ajustar en PLAN)

**`js/datos.js`** — estado y consultas del modelo:

| Función | Responsabilidad |
|---|---|
| `iniciarDatos()` | Copia la semilla al estado vivo; devuelve el estado |
| `obtenerLibros()` | Lista de libros del estado |
| `obtenerEditorial(idEditorial)` | Nombre de la editorial, o un valor por defecto legible |
| `obtenerGenero(idGenero)` | Nombre del género, o `null` |
| `obtenerAutores(idsAutores)` | Nombres de los autores, en el orden pedido |

**`js/catalogo.js`** — renderizado y filtro:

| Función | Responsabilidad |
|---|---|
| `pintarCatalogo(libros)` | Vacía el `<tbody>` y dibuja una fila por libro |
| `crearFilaLibro(libro)` | Construye la fila con 6 celdas, siempre como texto |
| `filtrarPorTitulo(consulta)` | Devuelve los libros que coinciden con la consulta |
| `normalizarConsulta(texto)` | Recorta los extremos y pasa a minúsculas |
| `mostrarEstadoVacio(visible)` | Alterna `hidden` en `#catalogo-estado-vacio` |
| `mostrarEstadoSinResultados(visible)` | Alterna `hidden` en `#catalogo-estado-sin-resultados` |

**`js/inicio.js`** — arranque y eventos:

| Función | Responsabilidad |
|---|---|
| `alCargar()` | Inicia los datos y pinta el catálogo completo |
| `alBuscar(evento)` | Previene el envío, lee la consulta, filtra y repinta |
| `registrarEventos()` | Registra el `submit` del formulario con `addEventListener` |

### 5.3 Forma de los datos (ya materializada en `datos-iniciales.js`)

| Colección | Forma de un elemento | Relaciones |
|---|---|---|
| `editoriales` | `{ id, nombre }` | — |
| `generos` | `{ id, nombre }` | — |
| `autores` | `{ id, nombre }` | — |
| `libros` | `{ id, titulo, isbn, editorialId, generoId, autorIds[], precio }` | `editorialId` → editorial; `autorIds[]` → autores; `generoId` → género o `null` |
| `clientes` | `{ id, nombre, email }` | — |
| `ventas` | `{ id, fecha, clienteId, clienteNombre, renglones[], total }` | `clienteId` → cliente; cada renglón guarda `libroId`, `titulo`, `cantidad`, `precioUnitario` |

La colección `ventas` **no se usa en este change**: se entrega ahora porque forma parte de la semilla que el Ejercicio 6 persistirá, y porque ya está verificada. Se documenta para que no se confunda con trabajo de este ejercicio.

### 5.4 Contrato con el DOM existente

| Elemento existente | Uso en este change |
|---|---|
| `form#catalogo-form-busqueda` | Se escucha el `submit`; se llama a `preventDefault()` |
| `input#catalogo-busqueda` | Se lee su `value` como consulta |
| `tbody#catalogo-listado` | Destino de las filas; se vacía con `replaceChildren()` antes de cada renderizado |
| `p#catalogo-estado-vacio` | Se muestra cuando el conjunto de libros está vacío |
| `p#catalogo-estado-sin-resultados` | Se muestra cuando la búsqueda no arroja coincidencias |
| `table#catalogo-tabla` | No se modifica: se le agregan las 6 celdas que ya declara su `<thead>` |

**No se agrega ni se quita ningún `id`, ninguna clase y ningún texto visible.**

### 5.5 Reglas de la implementación

| Regla | Detalle |
|---|---|
| Inserción de datos | `document.createElement` + `textContent`. **Prohibido `innerHTML`** en todo el proyecto, incluso con texto fijo. |
| Eventos | `addEventListener`. **Prohibidos los atributos `on*`** en el HTML. |
| Estado | Una sola variable con el estado vivo. La semilla `DATOS_INICIALES` **no se muta**: se copia al iniciar. |
| Precio | Se presenta con dos decimales y formato local (`es-AR`), con el mismo criterio que la consigna exige para los importes de las ventas. |
| Estilo | No se agregan estilos en línea ni se modifican las clases existentes. |
| Orden de los `<script>` | `js/datos-iniciales.js` → `js/datos.js` → `js/catalogo.js` → `js/inicio.js`: los scripts son clásicos y el orden importa. |

---

## 6. Estados y manejo de errores

| Situación | Comportamiento esperado |
|---|---|
| Catálogo completo | Filas dibujadas; los dos mensajes con `hidden` |
| Filtro con coincidencias | Solo las filas que coinciden; los dos mensajes con `hidden` |
| Filtro sin coincidencias | Sin filas; `#catalogo-estado-sin-resultados` visible; el de «vacío» oculto |
| Conjunto de libros vacío | Sin filas; `#catalogo-estado-vacio` visible; el de «sin resultados» oculto |
| Consulta vacía o con espacios | Equivale a no filtrar: catálogo completo |
| Envío del formulario | `preventDefault()`; la página no se recarga ni cambia la URL |
| Referencia rota en los datos | Valor por defecto legible en la celda affected; nunca una celda vacía ni un error en consola |
| Error de JavaScript | La página sigue siendo legible: el HTML no depende del script para mostrar su contenido |

**No hay mensajes de error nuevos:** la consigna no los pide y el HTML ya define los dos estados previstos. Agregar un tercero implicaría modificar el `index.html` verificado en el Change 01.

---

## 7. Restricciones técnicas y convenciones

| # | Restricción | Origen |
|---|---|---|
| 1 | HTML, CSS y JavaScript nativos. Sin librerías, frameworks ni CDN. | Prompt y consigna |
| 2 | Sin `fetch`, API, base de datos ni servidor. | Prompt y consigna |
| 3 | Sin `localStorage` en este change. | Prompt (reservado al Ejercicio 6) |
| 4 | Sin npm ni herramientas de compilación. | Prompt |
| 5 | Debe funcionar abriendo `index.html` con `file://`. | Prompt y consigna |
| 6 | Los scripts **no pueden ser módulos ES**: con `file://` el origen es `null` y Chrome/Edge bloquean los `import`. Se usan scripts clásicos con variables globales por responsabilidad. | Verificado en Edge headless |
| 7 | Los datos del modelo se insertan como texto, nunca como HTML. | Consigna y R-04 |
| 8 | Sin estilos en línea, sin `<style>`, sin atributos `on*`. | Contrato del Change 02 |
| 9 | Funciones acotadas con una responsabilidad y nombres comprensibles. | Consigna y R-06 |
| 10 | Los identificadores existentes del HTML no se modifican. | Contrato del Change 01 |

---

## 8. Criterios de aceptación

| ID | Criterio | Requisitos | Verificación |
|---|---|---|---|
| CA-01 | Existen los datos iniciales mínimos con relaciones válidas. | R-03 | Script de verificación de datos (Node, fuera del proyecto): 36 comprobaciones |
| CA-02 | El catálogo se genera desde el array y muestra todos los campos, con «Sin clasificar» cuando corresponde. | R-02, R-03 | `<tbody>` vacío en el HTML y con 9 filas en ejecución; presencia del texto «Sin clasificar» |
| CA-03 | El filtro cubre mayúsculas, coincidencia parcial y espacios; vacío muestra todo; sin coincidencias muestra mensaje. | R-01, R-03 | Casos S-03 a S-08 sobre el navegador |
| CA-04 | Los datos se insertan como texto y el código tiene funciones acotadas. | R-04, R-06 | Búsqueda de `innerHTML` y de `on*=` → 0 coincidencias; revisión de nombres |
| CA-05 | Funciona con `file://`, sin servidor. | R-05 | Apertura en Edge headless con `file://` |
| CA-06 | No se incorpora trabajo excluido. | — | Búsqueda de `fetch(`, `localStorage`, `http://` → 0 coincidencias |
| CA-07 | Las otras cuatro vistas no cambian. | — | Comparación del HTML antes y después |

Además, con lo pedido por el prompt: los controles **aprobados, fallidos, omitidos y pendientes** se distinguen en el informe, y **ningún control no ejecutado se presenta como aprobado**.

---

## 9. Supuestos, información pendiente y decisiones que requieren respuesta

### 9.1 Supuestos

| ID | Supuesto | Si fuera falso |
|---|---|---|
| A-01 | La estructura HTML del Change 01 se mantiene: no se agregan ni se cambian `id`, clases ni textos. | Cambiaría el alcance y el contrato con el Change 01 |
| A-02 | Los estilos de la tabla y de los estados vacíos del Change 02 alcanzan para el catálogo generado. | Habría que tocar `css/estilos.css`, que hoy está fuera de alcance |
| A-03 | La semilla `datos-iniciales.js` no se muta: la aplicación trabaja sobre una copia. | El Ejercicio 6 perdería la semilla original |
| A-04 | El precio se muestra con formato de moneda local. | Cambiaría solo la presentación de una celda |
| A-05 | Los scripts se cargan en orden y comparten variables globales por responsabilidad. | Habría que revisar el orden de los `<script>` |
| A-06 | El filtro responde al `submit` del formulario (Enter o botón), no a cada tecla. | El filtrado en vivo es un cambio de comportamiento, no un detalle |

### 9.2 Decisiones resueltas (20/10/2026)

| ID | Decisión | Respuesta | Consecuencia en esta entrega |
|---|---|---|---|
| **D-01** | Formato de los identificadores | **Se mantiene** | Cadenas legibles con guion: `li-cien-anos-de-soledad`, `ed-sudamericana`, `au-tolkien`, `cl-martina-ferreyra`. `datos-iniciales.js` no se modifica en este aspecto. |
| **D-02** | Datos ficticios concretos | **Se mantienen** | 9 libros populares con autores, editoriales y géneros reales; 4 clientes y 2 ventas ficticios; precios en pesos; `li-veinte-poemas-de-amor` sin género, para que «Sin clasificar» sea observable. |
| **D-03** | Nombres y ubicación de los archivos JavaScript | **Aceptada** | `js/datos-iniciales.js` (traslado desde la raíz), `js/datos.js`, `js/catalogo.js`, `js/inicio.js`. |
| **D-04** | Ruta de los documentos | **Aceptada** | `docs/03-datos-catalogo-filtro/SPEC.md` y `docs/03-datos-catalogo-filtro/PLAN.md`. |
| **D-05** | Herramientas autorizadas | **Sí** | Node v24.19.0 se autoriza para los scripts de comprobación, **siempre fuera de la entrega**. En el navegador: Edge 155.0.4283.62 y Firefox 158.0. |
| **D-06** | Política de comprobaciones | **Sí** | Arnés headless automatizado **fuera del proyecto** más los casos manuales de la consigna. Ningún control sin ejecutar se presenta como aprobado. |
| **D-07** | Encuadre del cambio en OpenSpec | **Igual que los changes anteriores** | Los cuatro artefactos (`proposal`, `specs`, `design`, `tasks`) se escriben junto con el PLAN y se revisan en un mismo momento, como en el Change 02. |

### 9.3 Información pendiente no bloqueante

| ID | Dato | Efecto | Estado |
|---|---|---|---|
| PD-01 | Herramientas autorizadas por el docente | **Resuelto** | Node autorizado solo para verificación, fuera de la entrega (D-05) |
| PD-02 | Control de versiones | No bloquea: el proyecto **es** un repositorio Git (commit `agrego change 01`); los cambios de este ejercicio quedan sin commitear, a criterio de la persona usuaria | Fuera de alcance |

### 9.4 Lo que este SPEC no decide

- El contenido línea por línea de cada función: es implementación, no contrato.
- Los nombres de los archivos, ya resueltos por D-03.
- Cualquier cambio en las otras cuatro vistas, en el CSS o en las specs de otras capabilities.
- `localStorage`, altas, ventas, historial y README.

---

## 10. Trazabilidad

| Requisito | Elementos del SPEC |
|---|---|
| R-01 | §4.1, §4.2 (S-03 a S-05, S-08, S-11), §4.3 (E-01 a E-05), §5.2 (`filtrarPorTitulo`, `normalizarConsulta`) |
| R-02 | §5.1, §5.2, §5.4, §6 |
| R-03 | §2.1, §4.2 (S-01, S-02, S-06, S-07), §4.3 (E-06, E-09), §5.3, §6 |
| R-04 | §4.2 (S-09), §5.5, §8 (CA-04) |
| R-05 | §2.1, §4.2 (S-01, S-10), §7 (restricción 6), §8 (CA-05) |
| R-06 | §4.3, §5.2, §5.5, §8 (CA-04) |

> **Aprobación:** la persona usuaria resolvió D-01 a D-07 el 20/10/2026. Este SPEC v2 habilita el PLAN y, con su autorización posterior, la implementación.
