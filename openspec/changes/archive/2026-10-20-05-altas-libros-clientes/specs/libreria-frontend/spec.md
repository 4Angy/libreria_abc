# Spec Delta

## MODIFIED Requirements

### Requirement: Separación entre estructura, estilos y comportamiento

El marcado SHALL contener únicamente estructura. NO SHALL incluir estilos en línea, bloques de estilo ni manejadores de eventos en atributos. La única referencia a la presentación SHALL ser el enlace a la hoja de estilos propia del proyecto, con ruta relativa y sin recursos de otros orígenes. Los scripts que el proyecto enlace SHALL ser archivos del propio proyecto, referenciados con ruta relativa, y SHALL NOT provenir de otro origen.

#### Scenario: Marcado sin estilos ni comportamiento

- **WHEN** se inspecciona el código fuente de las cinco vistas
- **THEN** no se encuentran atributos de estilo, bloques de estilo ni atributos de evento

#### Scenario: Hoja de estilos externa y local

- **WHEN** se inspecciona el encabezado de las cinco vistas
- **THEN** cada una enlaza la hoja de estilos del proyecto con una ruta relativa y ningún recurso de presentación proviene de otro origen

#### Scenario: Scripts locales y sin recursos externos

- **WHEN** se inspeccionan las etiquetas de script de las cinco vistas
- **THEN** cada una referencia un archivo JavaScript del propio proyecto con ruta relativa, y ninguna vista enlaza un recurso de otro origen

#### Scenario: Nombres comprensibles

- **WHEN** se revisan los identificadores y clases del marcado
- **THEN** usan nombres en español, en minúsculas y con guiones, sin abreviaturas opacas ni numeración secuencial

### Requirement: Contenedores de datos locales

El sistema SHALL incluir, para cada listado, un cuerpo de tabla vacío listo para recibir los registros locales, y para cada selector dependiente de datos, un control vacío listo para recibir sus opciones. El marcado SHALL NOT incluir datos de ejemplo, filas precargadas ni opciones inventadas. Las filas y las opciones que aparezcan en ejecución SHALL generarse a partir del conjunto de datos local.

#### Scenario: Cuerpos de tabla vacíos

- **WHEN** se abre cualquier listado antes de cargar datos locales
- **THEN** su cuerpo de tabla existe vacío y el mensaje de lista vacía está disponible para mostrarse

#### Scenario: Selectores sin datos

- **WHEN** se inspecciona el marcado de los selectores de editorial, género y autores del formulario de libros
- **THEN** no contienen opciones de datos, salvo la opción «Sin clasificar» del género

#### Scenario: Las opciones en ejecución provienen del conjunto local

- **WHEN** se cargan los datos locales
- **THEN** cada selector dependiente de datos muestra una opción por registro del conjunto local, y ninguna opción corresponde a un registro inexistente

### Requirement: Validaciones diferidas

El sistema NO SHALL adelantar validaciones de datos: los controles no SHALL declarar restricciones de obligatoriedad, formato, rango ni paso. Los formularios de alta SHALL desactivar la validación de restricciones del navegador, de modo que la única validación activa sea la de la aplicación y los mensajes mostrados sean los de la propia aplicación.

#### Scenario: Sin atributos de validación

- **WHEN** se inspeccionan los controles de los formularios
- **THEN** no declaran atributos de obligatoriedad, patrón, mínimo, máximo ni paso

#### Scenario: La validación del navegador no intercepta el envío

- **WHEN** se envía un formulario de alta con un valor que el navegador consideraría inválido
- **THEN** el navegador no impide el envío ni muestra su propia advertencia, y la aplicación decide si lo acepta
