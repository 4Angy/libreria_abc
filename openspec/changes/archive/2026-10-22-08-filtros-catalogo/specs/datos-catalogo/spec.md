# Spec Delta

## MODIFIED Requirements

### Requirement: El filtro por título normaliza la consulta

El filtro por título SHALL ignorar las diferencias entre mayúsculas y minúsculas, SHALL buscar coincidencias parciales y SHALL recortar los espacios sobrantes en los extremos de la consulta. Una consulta vacía SHALL mostrar el catálogo completo. El título SHALL ser el criterio por defecto: mientras no se elija otro criterio, la consulta se compara con el título del libro.

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

## ADDED Requirements

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
