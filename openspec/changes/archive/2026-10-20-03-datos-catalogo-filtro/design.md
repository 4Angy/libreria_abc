# Design — Change 03: Datos locales, catálogo y filtro

## Context

El proyecto ya tiene las cinco vistas con HTML semántico y una hoja de estilos verificada. Falta lo que convierte al frontend en una aplicación: un modelo de datos y la lógica que dibuja el catálogo a partir de él.

Restricciones que mandan:

- **La consigna**: arrays y objetos con identificadores estables; conjunto inicial de al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios; catálogo generado por JavaScript; filtro por título insensible a mayúsculas, con coincidencias parciales y recortando espacios; datos insertados como texto; eventos y funciones con responsabilidades reconocibles; sin `fetch` ni administración de editoriales, géneros o autores.
- **El parcial se abre con `file://`**: nada de servidor, nada de red, nada de dependencias.
- **Los contratos verificados**: los `<tbody>` tienen id, los dos estados existen con `hidden`, y el CSS ya estiliza la tabla y los estados vacíos. No se agregan estilos en línea ni se modifican las clases.

## Goals / Non-Goals

**Goals:**

- Un modelo de datos con relaciones válidas e identificadores estables, entregado como semilla separada.
- Un catálogo que se dibuja desde el modelo y un filtro por título con el comportamiento exacto de la consigna.
- Inserción de datos en el DOM exclusivamente como texto.
- Código con responsabilidades reconocibles, preparado para que los ejercicios 4 y 5 agreguen comportamiento sin reescribir lo hecho.

**Non-Goals:**

- Persistencia en `localStorage` (Ejercicio 6), altas (4), ventas e historial (5), README (6).
- Renderizar las listas de clientes, ventas o historial.
- Paginación, ordenamiento, búsqueda por ISBN o autor, filtros combinados.
- Cualquier framework, bundler, transpilador o dependencia externa.

## Decisiones

### D-A · Scripts clásicos, no módulos ES

Los scripts son clásicos y se comunican por variables de alcance global. Un `<script type="module">` cargado desde `file://` es bloqueado por la política de origen de Chrome y Edge (origen `null`); verificado con Edge headless que un script clásico expone `DATOS_INICIALES` sin problema.

**Consecuencia:** el orden de los `<script>` importa y queda fijado en el SPEC §5.5.

### D-B · La semilla y el estado vivo están separados

`js/datos-iniciales.js` es la semilla: no se muta. `js/datos.js` la copia al estado vivo, que es lo que el Ejercicio 6 serializará a `localStorage`. Así el Ejercicio 6 no necesita reescribir el modelo.

**Consecuencia:** las consultas de `js/datos.js` devuelven siempre el estado vivo, nunca la semilla.

### D-C · Un archivo por responsabilidad

| Archivo | Responsabilidad | Contenido |
|---|---|---|
| `js/datos-iniciales.js` | La semilla | `DATOS_INICIALES` |
| `js/datos.js` | Estado y consultas del modelo | `iniciarDatos()`, `obtenerLibros()`, `obtenerEditorial()`, `obtenerGenero()`, `obtenerAutores()` |
| `js/catalogo.js` | Dibujar y filtrar | `pintarCatalogo()`, `crearFilaLibro()`, `filtrarPorTitulo()`, `normalizarConsulta()`, `mostrarEstadoVacio()`, `mostrarEstadoSinResultados()` |
| `js/inicio.js` | Arranque y eventos | `alCargar()`, `alBuscar()`, `registrarEventos()` |

**Por qué cuatro archivos:** la consigna pide responsabilidades reconocibles, y separar la semilla, el modelo, el renderizado y el arranque deja los ejercicios 4 y 5 sin reescribir lo hecho. La semilla va en su propio archivo para que sea obvio qué es dato de ejemplo y qué es estado.

### D-D · El filtro normaliza la consulta, no el título

La comparación es `titulo.toLowerCase().includes(consulta.trim().toLowerCase())`. No se quitan tildes ni se colapsan espacios internos: la consigna no lo pide y hacerlo cambiaría el resultado de búsquedas reales («Señor» frente a «Senor»).

**Consecuencia:** el caso E-03 queda como comportamiento esperado, documentado y no como error.

### D-E · Cada renderizado vacía el `<tbody>` antes de escribir

`pintarCatalogo()` hace `tbody.replaceChildren()` y después agrega las filas. Así no quedan filas residuales entre búsquedas y el mismo camino de código sirve para el catálogo completo y para un resultado filtrado.

### D-F · Los datos se insertan como texto

Cada celda se crea con `document.createElement` y se completa con `textContent`. No hay `innerHTML` en el proyecto, ni siquiera para texto fijo.

### D-G · El evento es `submit`, no `input`

El buscador usa el `submit` del formulario, que el HTML ya define (`role="search"`, botón `type="submit"`): funciona con Enter y con el botón.

**Alternativa descartada:** filtrar en vivo con `input`. La consigna no lo pide, y con `submit` el estado visible de la vista es siempre el de la última búsqueda confirmada.

### D-H · Identificadores de cadenas legibles

`li-cien-anos-de-soledad`, `ed-sudamericana`, `au-tolkien`, `cl-martina-ferreyra`. Son estables, legibles y ordenables, y no dependen de la posición en el array. **Decisión de la persona usuaria (D-01), ratificada el 20/10/2026.**

### D-I · El precio se presenta con formato local

`Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })`. La consigna pide dos decimales en los importes de las ventas (Ejercicio 5); aplicar el mismo criterio en el catálogo evita que un número aparezca de dos maneras distintas en la misma aplicación.

### D-J · Los valores ausentes tienen un texto legible

Una editorial o un autor que no existieran en el conjunto no dejan la celda vacía: muestran un valor por defecto legible («Editorial desconocida», «Sin autores»). Una celda vacía se confunde con un dato faltante.

## Estrategia de renderizado

| Columna | Origen | Valor ausente |
|---|---|---|
| Título | `libro.titulo` | — |
| ISBN | `libro.isbn` | — |
| Editorial | `editorial.nombre` | «Editorial desconocida» |
| Género | `genero.nombre` | «Sin clasificar» |
| Autores | `autor.nombre`, separados por «, » | «Sin autores» |
| Precio | `libro.precio` | — |

El texto «Sin clasificar» es el que el Change 01 ya fijó como contrato del catálogo: el renderizado no introduce un texto nuevo.

## Estados

| Situación | Resultado |
|---|---|
| Catálogo completo | Filas + ambos estados ocultos |
| Filtro con coincidencias | Filas + ambos estados ocultos |
| Filtro sin coincidencias | Sin filas + `#catalogo-estado-sin-resultados` visible |
| Conjunto de libros vacío | Sin filas + `#catalogo-estado-vacio` visible |

Los dos mensajes existen en el HTML desde el Change 01 y solo se alterna el atributo `hidden`. No se propone un tercer mensaje: agregarlo implicaría modificar el HTML ya verificado.

## Verificación

1. **Datos** (Node, fuera del proyecto): mínimos, integridad referencial, unicidad de identificadores, ISBN y email, totales de venta. 36 comprobaciones en verde.
2. **Navegador** (Edge headless, arnés fuera del proyecto): sobre una copia de `index.html` con los scripts, se comprueba el número de filas para los escenarios S-01 a S-11, la presencia de «Sin clasificar», la alternancia de estados y que el DOM no contiene HTML interpretable desde los datos.
3. **Restricciones**: búsqueda de `fetch(`, `localStorage`, `http://`, `innerHTML`, `on*=` y de archivos ajenos al proyecto: 0 coincidencias.
4. **Regresión**: hashes de las otras cuatro vistas y de la hoja de estilos sin cambios.
5. **Control manual de la persona usuaria**: recorrer el buscador con el teclado y confirmar la aparición y desaparición del mensaje. Se registra como pendiente, nunca como aprobado.

## Riesgos

| Riesgo | Mitigación |
|---|---|
| Los módulos ES rompen `file://` | D-A: scripts clásicos, verificado en Edge |
| `innerHTML` introduce inyección | D-F: prohibido y buscado en la verificación |
| La semilla se muta por accidente | D-B: la aplicación trabaja sobre una copia |
| Filas residuales entre búsquedas | D-E: `replaceChildren()` en cada renderizado |
| El filtro difiere de lo que espera la persona usuaria | D-D documentado: no se normalizan tildes |
| Filtrado con acentos | E-03: comportamiento esperado y documentado |
| El orden de los scripts | D-A: orden fijado y comprobado por búsqueda |

## Migración

No hay migración: es el primer change con JavaScript. Los HTML siguen funcionando sin los scripts (el `<tbody>` queda vacío), lo que preserva la degradación elegante del Change 02.

## Open Questions

Ninguna: D-01 a D-07 fueron resueltas por la persona usuaria el 20/10/2026.

---

## Desvíos de la implementación

Detectados al implementar y verificar. Ninguno contradice la consigna ni los
requisitos de la delta spec `datos-catalogo`.

| ID | Plan original | Implementación | Por qué |
|---|---|---|---|
| **D-1** | `design.md` nombraba `copiarDatosIniciales()` para preparar el estado. | La función se llama `iniciarDatos()`, como en el SPEC §5.2. | El SPEC es el contrato de la interfaz; el `design.md` anticipaba un nombre distinto. Gana el SPEC. |
| **D-2** | `js/datos.js` expone 5 funciones (SPEC §5.2). | Expone esas 5 más 7 auxiliares de copia: `copiarLibro`, `copiarEditorial`, `copiarGenero`, `copiarAutor`, `copiarCliente`, `copiarVenta`, `copiarRenglon`. | La copia del estado se hace registro por registro, sin repetir la forma de cada colección ni serializar a texto. |
| **D-3** | — | Se implementó `obtenerClientes()` y se quitó antes de cerrar. | No está en la interfaz del SPEC ni se usa en este change: el catálogo es la única vista que se renderiza. Se agregará en el Ejercicio 4, cuando haga falta. |
