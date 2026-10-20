# Spec Delta

## MODIFIED Requirements

### Requirement: Separación entre estructura, estilos y comportamiento

El marcado SHALL contener únicamente estructura. NO SHALL incluir estilos en línea, bloques de estilo, scripts ni manejadores de eventos en atributos. La única referencia a la presentación SHALL ser el enlace a la hoja de estilos propia del proyecto, con ruta relativa y sin recursos de otros orígenes.

#### Scenario: Marcado sin estilos ni comportamiento

- **WHEN** se inspecciona el código fuente de las cinco vistas
- **THEN** no se encuentran atributos de estilo, bloques de estilo, etiquetas de script ni atributos de evento

#### Scenario: Hoja de estilos externa y local

- **WHEN** se inspecciona el encabezado de las cinco vistas
- **THEN** cada una enlaza la hoja de estilos del proyecto con una ruta relativa y ningún recurso de presentación proviene de otro origen

#### Scenario: Nombres comprensibles

- **WHEN** se revisan los identificadores y clases del marcado
- **THEN** usan nombres en español, en minúsculas y con guiones, sin abreviaturas opacas ni numeración secuencial
