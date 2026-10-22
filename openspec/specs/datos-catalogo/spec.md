# datos-catalogo Specification

## Purpose
Define el modelo de datos local del frontend de la librería —libros, editoriales, géneros, autores y clientes— con identificadores estables y relaciones válidas, y la capa que dibuja el catálogo a partir de ese modelo con un filtro por título y los estados de resultado, sin depender de un servidor.

## Requirements

### Requirement: Conjunto de datos local con identificadores estables

El sistema SHALL representar los datos locales mediante arrays y objetos, con un identificador estable y único por elemento para las colecciones de libros, editoriales, géneros, autores y clientes. El conjunto inicial SHALL incluir al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes ficticios.

#### Scenario: El conjunto inicial cumple los mínimos de la consigna

- **WHEN** se inspecciona el conjunto de datos inicial
- **THEN** hay al menos seis libros, dos editoriales, dos géneros, tres autores y tres clientes, y ningún identificador se repite dentro de una misma colección

#### Scenario: Cada elemento tiene identificador propio

- **WHEN** se recorre cualquiera de las colecciones
- **THEN** cada elemento expone un identificador no vacío, distinto del de todos los demás elementos de su colección

### Requirement: Relaciones válidas entre libros, editoriales, géneros y autores

Cada libro SHALL relacionarse con una editorial existente y con uno o más autores existentes. El género SHALL ser opcional y, cuando se asigne, SHALL corresponder a un género existente.

#### Scenario: Las relaciones del libro apuntan a registros que existen

- **WHEN** se recorre el conjunto de libros
- **THEN** la editorial referenciada existe, todos los autores referenciados existen y hay al menos un autor

#### Scenario: Un libro puede no tener género

- **WHEN** se encuentra un libro cuyo género no está asignado
- **THEN** el modelo lo representa sin género y la vista lo muestra con el texto «Sin clasificar»

### Requirement: El catálogo se genera desde el conjunto de libros

El catálogo SHALL construirse con JavaScript a partir del conjunto de libros, sin filas escritas en el HTML. La generación SHALL producir una fila por libro y una celda por cada columna declarada en el encabezado de la tabla.

#### Scenario: El catálogo se dibuja al abrir la vista

- **WHEN** se abre la vista Catálogo
- **THEN** el cuerpo de la tabla contiene una fila por cada libro del conjunto local

#### Scenario: Las celdas siguen el orden del encabezado

- **WHEN** se inspecciona una fila del catálogo
- **THEN** sus celdas son título, ISBN, editorial, género, autores y precio, en ese orden

### Requirement: Cada fila muestra los datos del libro

Cada fila SHALL mostrar el título, el ISBN, la editorial, el género, los autores y el precio del libro. Los datos que no existan SHALL presentarse con un texto legible, nunca con una celda vacía.

#### Scenario: Un libro con editorial, género y autores

- **WHEN** se lee una fila de un libro completo
- **THEN** muestra el nombre de su editorial, el nombre de su género y los nombres de sus autores

#### Scenario: Un libro con dos autores

- **WHEN** se lee la celda de autores de un libro con dos autores
- **THEN** aparecen los dos nombres separados de forma legible

#### Scenario: Un libro sin género

- **WHEN** se lee la celda de género de un libro sin género asignado
- **THEN** dice «Sin clasificar»

### Requirement: El filtro por título normaliza la consulta

El filtro por título SHALL ignorar las diferencias entre mayúsculas y minúsculas, SHALL buscar coincidencias parciales y SHALL recortar los espacios sobrantes de los extremos de la consulta. Una consulta vacía SHALL mostrar el catálogo completo. El título SHALL ser el criterio por defecto: mientras no se elija otro criterio, la consulta se compara con el título del libro.

#### Scenario: Búsqueda con una parte del título en minúsculas

- **WHEN** se busca una parte del título en minúsculas
- **THEN** aparece el libro que la contiene

#### Scenario: Búsqueda con una parte del título en mayúsculas

- **WHEN** se busca la misma parte del título en mayúsculas
- **THEN** aparece el mismo libro, porque el filtro no distingue mayúsculas de minúsculas

#### Scenario: Búsqueda con espacios sobrantes en los extremos

- **WHEN** se busca con espacios al principio y al final
- **THEN** el resultado es el mismo que con la consulta sin esos espacios

#### Scenario: Búsqueda vacía

- **WHEN** se busca con el campo vacío
- **THEN** se muestra el catálogo completo

### Requirement: El catálogo se puede filtrar por otros campos

El buscador del catálogo SHALL ofrecer elegir el campo por el que se compara la consulta: título, autor, género o editorial. La comparación de texto SHALL ignorar las diferencias entre mayúsculas y minúsculas y recortar los espacios sobrantes de los extremos, como en el filtro por título. Una consulta vacía SHALL mostrar el catálogo completo, cualquiera que sea el criterio elegido. El catálogo SHALL poder acotarse además por un rango de precio, con un mínimo y un máximo, y el filtro de precio SHALL incluir los extremos del rango.

#### Scenario: Filtrar por autor

- **WHEN** se elige el criterio de autor y se busca el nombre de un autor
- **THEN** aparecen los libros que tienen a ese autor entre sus autores

#### Scenario: Filtrar por género

- **WHEN** se elige el criterio de género y se busca un género
- **THEN** aparecen los libros de ese género

#### Scenario: Filtrar por editorial

- **WHEN** se elige el criterio de editorial y se busca una editorial
- **THEN** aparecen los libros de esa editorial

#### Scenario: Un libro con varios autores

- **WHEN** se elige el criterio de autor y se busca el nombre de uno de los autores de un libro
- **THEN** ese libro aparece en el listado, porque tiene a ese autor entre los suyos

#### Scenario: Filtrar por un rango de precio

- **WHEN** se indica un precio mínimo y uno máximo
- **THEN** aparecen los libros cuyo precio está entre los dos valores, incluidos los que tienen exactamente el mínimo o el máximo

#### Scenario: La consulta vacía con un criterio elegido

- **WHEN** se elige un criterio y la consulta queda vacía
- **THEN** se muestra el catálogo completo

### Requirement: Los filtros se acumulan y se pueden quitar

Los filtros de texto y de precio SHALL poder aplicarse juntos: un libro SHALL aparecer en el listado solo si cumple todos los filtros activos. La vista SHALL ofrecer una acción para quitar todos los filtros, y al usarla SHALL volver a mostrarse el catálogo completo.

#### Scenario: Dos filtros a la vez

- **WHEN** se busca un autor y además se acota el precio
- **THEN** aparecen solo los libros de ese autor cuyo precio está en el rango

#### Scenario: Quitar los filtros

- **WHEN** se usa la acción de quitar los filtros
- **THEN** el catálogo vuelve a mostrar todos los libros y los controles quedan en su estado inicial

### Requirement: Los estados del catálogo reflejan el resultado

El catálogo SHALL alternar sus dos estados según el resultado: un mensaje cuando el conjunto no tiene libros y un mensaje cuando la búsqueda no arroja coincidencias. En todo momento SHALL haber como máximo un mensaje visible.

#### Scenario: Búsqueda sin coincidencias

- **WHEN** se busca un texto que ningún título contiene
- **THEN** el cuerpo de la tabla queda vacío y se muestra el mensaje de búsqueda sin resultados

#### Scenario: Búsqueda con coincidencias

- **WHEN** se busca un texto que algún título contiene
- **THEN** se muestran las filas y ninguno de los dos mensajes queda visible

#### Scenario: Conjunto de libros vacío

- **WHEN** el conjunto local no tiene libros
- **THEN** se muestra el mensaje de catálogo vacío y no el de búsqueda sin resultados

#### Scenario: Búsqueda successive

- **WHEN** se realiza una búsqueda con coincidencias y luego una sin coincidencias
- **THEN** la segunda búsqueda no deja filas de la primera y muestra un único mensaje

### Requirement: Los datos se insertan en el DOM como texto

El contenido proveniente del conjunto de datos SHALL insertarse en el DOM como texto, sin interpretarse como HTML. El proyecto SHALL NOT usar la asignación de HTML interno para insertar datos.

#### Scenario: Un título con marcado en su interior

- **WHEN** un título contiene etiquetas de marcado
- **THEN** se muestra el texto literal, sin interpretar el marcado

#### Scenario: El código no interpreta datos como HTML

- **WHEN** se revisa el código de la aplicación
- **THEN** no hay ninguna asignación que interprete HTML para insertar datos del conjunto local

### Requirement: El catálogo funciona sin servidor

La vista de Catálogo SHALL funcionar al abrir el archivo HTML directamente, sin servidor, sin recursos externos y sin dependencias. Los scripts SHALL cargarse en el orden en que dependen unos de otros.

#### Scenario: Apertura directa del archivo

- **WHEN** se abre el archivo de la vista Catálogo directamente en el navegador
- **THEN** el catálogo se dibuja con el mismo contenido que al servirlo

#### Scenario: Orden de carga de los scripts

- **WHEN** se revisa el encabezado de la vista Catálogo
- **THEN** los scripts del proyecto se cargan con rutas relativas y en el orden de dependencia

### Requirement: Estructura del código con responsabilidades separadas

El código SHALL separar las responsabilidades de datos, renderizado y eventos, con funciones acotadas y nombres comprensibles. Los eventos SHALL registrarse sin atributos en línea.

#### Scenario: Responsabilidades en archivos distintos

- **WHEN** se revisa la estructura de archivos del proyecto
- **THEN** la semilla, el modelo, el renderizado y el arranque están en archivos separados

#### Scenario: Los eventos no usan atributos en línea

- **WHEN** se revisa el marcado de las cinco vistas
- **THEN** no hay manejadores de eventos escritos como atributos
