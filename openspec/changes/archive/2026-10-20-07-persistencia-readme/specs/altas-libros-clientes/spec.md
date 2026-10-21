# Spec Delta

## REMOVED Requirements

### Requirement: El envío se controla sin recargar la página

**Reason**: Este requirement fijaba que el conjunto de datos local se actualizaba **solo en memoria**, y su último escenario afirmaba que el registro no se persistía. El Ejercicio 6 conserva el registro en el almacenamiento del navegador, así que ese escenario describe un comportamiento que deja de ser cierto y no puede permanecer en la spec.

**Migration**: El requisito equivalente queda en «El alta se controla sin recargar la página y el registro se guarda», dentro de esta misma capability. Lo que no cambia: el envío sigue controlado con `preventDefault`, la página no se recarga, la dirección no cambia y el foco permanece en el documento.

## ADDED Requirements

### Requirement: El alta se controla sin recargar la página y el registro se guarda

Los formularios de alta SHALL controlar el envío, de modo que la página no se recargue, no navegue y no modifique su dirección al registrar. El conjunto de datos local SHALL actualizarse en memoria, SHALL guardarse en el almacenamiento del navegador y los listados SHALL redibujarse a partir de ese conjunto.

#### Scenario: El alta no recarga la página

- **WHEN** la persona usuaria registra un libro o un cliente
- **THEN** la dirección de la página no cambia, la página no se recarga y el foco permanece en el documento

#### Scenario: El listado refleja el alta de inmediato

- **WHEN** la persona usuaria registra un libro
- **THEN** la tabla de libros registrados muestra una fila más sin que haya que recargar la página

#### Scenario: El estado guardado sobrevive a la recarga

- **WHEN** la persona usuaria recarga la página después de un alta
- **THEN** el conjunto de datos se recupera del almacenamiento del navegador, con el libro o el cliente registrado, y los registros de ejemplo no aparecen duplicados
