# Spec Delta

## Purpose

Define la estructura HTML de las cinco vistas del frontend de la librería —catálogo, libros, clientes, ventas e historial—, su navegación, sus formularios y listados, y los contenedores de estado y de datos locales que consumen los ejercicios posteriores del parcial.

## ADDED Requirements

### Requirement: Navegación entre las cinco vistas

El sistema SHALL exponer cinco vistas —Catálogo, Libros, Clientes, Ventas e Historial— y SHALL permitir llegar a todas ellas desde `index.html` mediante una navegación clara y siempre visible. La vista abierta SHALL indicarse de forma programática y no solo visual.

#### Scenario: Acceso a las cinco vistas desde el catálogo

- **WHEN** la persona usuaria abre `index.html` y recorre los enlaces de la navegación principal
- **THEN** alcanza las cinco vistas, cada una con su propio documento HTML

#### Scenario: Vista actual marcada

- **WHEN** se abre cualquiera de las cinco vistas
- **THEN** el enlace de navegación correspondiente a esa vista está marcado con `aria-current="page"` y los demás no

### Requirement: Contenido de la vista Catálogo

La vista Catálogo SHALL mostrar el título de la librería, un buscador por título y el listado de libros con título, ISBN, editorial, género, autores y precio. Cuando un libro no tenga género asignado, el listado SHALL mostrar el texto «Sin clasificar» en lugar de un valor vacío.

#### Scenario: Estructura del catálogo

- **WHEN** se abre la vista Catálogo
- **THEN** se muestran el título de la librería, el buscador con su etiqueta asociada y una tabla de libros con encabezados de título, ISBN, editorial, género, autores y precio

#### Scenario: Libro sin género

- **WHEN** el listado presenta un libro que no tiene género asignado
- **THEN** la celda de género muestra el texto «Sin clasificar»

### Requirement: Alta y listado de libros

La vista Libros SHALL ofrecer un formulario de alta y el listado de los libros registrados. El formulario SHALL permitir registrar título, ISBN, editorial, género, autores y precio, con editorial y género como selectores, la opción «Sin clasificar» disponible en género, y autores mediante selección múltiple o controles equivalentes.

#### Scenario: Elementos de la vista Libros

- **WHEN** se abre la vista Libros
- **THEN** se muestran el formulario de alta con sus seis campos etiquetados y el listado de libros registrados con sus encabezados

#### Scenario: Opción de género sin clasificar

- **WHEN** se inspecciona el selector de género del formulario de alta
- **THEN** incluye la opción «Sin clasificar», que representa la ausencia de género

### Requirement: Alta y listado de clientes

La vista Clientes SHALL ofrecer un formulario de alta y el listado de los clientes registrados. El formulario SHALL permitir registrar nombre completo y correo electrónico.

#### Scenario: Elementos de la vista Clientes

- **WHEN** se abre la vista Clientes
- **THEN** se muestran el formulario de alta con los campos de nombre completo y correo electrónico etiquetados, y el listado de clientes registrados con sus encabezados

### Requirement: Composición de una venta

La vista Ventas SHALL permitir seleccionar un cliente existente, elegir un libro y una cantidad, agregar renglones y consultar el resumen de la venta. El resumen SHALL exponer los renglones con libro, cantidad, precio unitario y subtotal, y el total de la venta.

#### Scenario: Elementos de la vista Ventas

- **WHEN** se abre la vista Ventas
- **THEN** se muestran el selector de cliente, el selector de libro, el campo de cantidad, la acción de agregar renglón, la tabla de resumen con sus encabezados y el total, y la acción de registrar la venta

#### Scenario: Renglones modificables antes de confirmar

- **WHEN** la venta tiene renglones cargados
- **THEN** cada renglón expone su cantidad como valor editable y una acción para quitarlo del resumen

### Requirement: Historial de ventas y acceso al detalle

La vista Historial SHALL listar las ventas registradas con identificador, fecha, cliente y total, y SHALL permitir consultar el detalle de cada venta, incluidos sus renglones.

#### Scenario: Elementos de la vista Historial

- **WHEN** se abre la vista Historial
- **THEN** se muestran el listado de ventas con encabezados de identificador, fecha, cliente y total, y el acceso al detalle de cada venta

#### Scenario: Detalle no visible hasta que se solicita

- **WHEN** se abre la vista Historial sin solicitar ningún detalle
- **THEN** el bloque de detalle permanece oculto y sus campos no anuncian contenido inexistente

### Requirement: Estructura semántica y formularios accesibles

El sistema SHALL usar etiquetas semánticas de HTML5 para el encabezado, la navegación y el contenido principal. Cada campo de formulario SHALL tener una etiqueta asociada, cada botón SHALL tener un texto que describa su acción y cada tabla SHALL tener un título y encabezados de columna.

#### Scenario: Marcado semántico por vista

- **WHEN** se inspecciona cualquiera de las cinco vistas
- **THEN** contiene un `header`, un `nav`, un `main` y un único `h1`

#### Scenario: Campos y botones etiquetados

- **WHEN** se recorren los controles de un formulario
- **THEN** cada control tiene una etiqueta asociada por `for`/`id` y cada botón tiene texto descriptivo de su acción

#### Scenario: Tablas con encabezados

- **WHEN** se inspecciona cualquier tabla de la interfaz
- **THEN** tiene `caption` y sus celdas de encabezado usan `th` con `scope`

### Requirement: Contenedores de estado

El sistema SHALL incluir contenedores para los estados de lista vacía, búsqueda sin resultados, operación correcta y operación rechazada. Los contenedores SHALL estar definidos en el marcado, ocultos por defecto, con texto legible y con los identificadores y atributos de estado que consumirán los ejercicios posteriores.

#### Scenario: Estados presentes y ocultos

- **WHEN** se inspecciona el marcado de las vistas
- **THEN** existen los contenedores de lista vacía de cada listado, el de búsqueda sin resultados, el de operación correcta y los de operación rechazada, todos ocultos por defecto

#### Scenario: Distinción entre lista vacía y búsqueda sin resultados

- **WHEN** se comparan los contenedores de estado del catálogo
- **THEN** el mensaje de lista vacía y el de búsqueda sin resultados son contenedores distintos con textos distintos

#### Scenario: Anuncio de resultados de operación

- **WHEN** se inspeccionan los contenedores de operación correcta y rechazada
- **THEN** el primero declara un rol de estado con anuncio cortés y los segundos declaran rol de alerta

### Requirement: Contenedores de datos locales

El sistema SHALL incluir, para cada listado, un cuerpo de tabla vacío listo para recibir los registros locales, y para cada selector dependiente de datos, un control vacío listo para recibir sus opciones. El sistema NO SHALL incluir datos de ejemplo, filas precargadas ni opciones inventadas.

#### Scenario: Cuerpos de tabla vacíos

- **WHEN** se abre cualquier listado antes de cargar datos locales
- **THEN** su cuerpo de tabla existe vacío y el mensaje de lista vacía está disponible para mostrarse

#### Scenario: Selectores sin datos

- **WHEN** se inspeccionan los selectores de editorial, género y autores del formulario de libros
- **THEN** no contienen opciones de datos, salvo la opción «Sin clasificar» del género

### Requirement: Operación local sin dependencias

El sistema SHALL funcionar al abrirse directamente desde el sistema de archivos, sin servidor, sin proceso de compilación y sin dependencias externas.

#### Scenario: Apertura directa

- **WHEN** se abre `index.html` desde el sistema de archivos
- **THEN** la vista se muestra sin solicitar recursos de red ni ejecutar un servidor

#### Scenario: Ausencia de recursos externos

- **WHEN** se inspecciona el marcado de las cinco vistas
- **THEN** no contiene referencias a hojas de estilo, scripts ni recursos alojados en otro origen

### Requirement: Separación entre estructura, estilos y comportamiento

El marcado SHALL contener únicamente estructura. NO SHALL incluir estilos en línea, bloques de estilo, scripts ni manejadores de eventos en atributos.

#### Scenario: Marcado sin estilos ni comportamiento

- **WHEN** se inspecciona el código fuente de las cinco vistas
- **THEN** no se encuentran atributos de estilo, bloques de estilo, etiquetas de script ni atributos de evento

#### Scenario: Nombres comprensibles

- **WHEN** se revisan los identificadores y clases del marcado
- **THEN** usan nombres en español, en minúsculas y con guiones, sin abreviaturas opacas ni numeración secuencial

### Requirement: Validaciones diferidas

El sistema NO SHALL adelantar validaciones de datos: los controles no SHALL declarar restricciones de obligatoriedad, formato, rango ni paso.

#### Scenario: Sin atributos de validación

- **WHEN** se inspeccionan los controles de los formularios
- **THEN** no declaran atributos de obligatoriedad, patrón, mínimo, máximo ni paso
