# Spec Delta

## REMOVED Requirements

### Requirement: El historial lista las ventas registradas

**Reason**: Este requirement exigía listar las ventas de la sesión, y su último escenario afirmaba que la venta recién confirmada **no** aparecía en el historial de otra vista porque el estado no se persistía entre páginas. El Ejercicio 6 conserva las ventas en el almacenamiento del navegador, así que ese escenario afirma lo contrario de lo que hace el sistema y no puede permanecer en la spec.

**Migration**: El requisito equivalente queda en «El historial lista las ventas guardadas y las recuperadas del almacenamiento», dentro de esta misma capability. Lo que no cambia: el listado sigue mostrando identificador, fecha, cliente y total, sigue ofreciendo la acción de consultar el detalle y sigue alternando su estado vacío.

## ADDED Requirements

### Requirement: El historial lista las ventas guardadas y las recuperadas del almacenamiento

La vista Historial SHALL listar las ventas registradas —las confirmadas en la sesión actual y las recuperadas del almacenamiento del navegador— con su identificador, su fecha, su cliente y su total, y SHALL ofrecer una acción para consultar el detalle de cada una. El listado SHALL alternar su estado vacío según tenga o no ventas.

#### Scenario: El listado del historial

- **WHEN** la persona usuaria abre la vista Historial
- **THEN** ve una fila por venta registrada con su identificador, su fecha, su cliente y su total, y la acción de consultar el detalle

#### Scenario: El historial sin ventas

- **WHEN** no hay ninguna venta registrada
- **THEN** la vista muestra un mensaje de lista vacía

#### Scenario: Una venta recién confirmada en el historial

- **WHEN** la persona usuaria confirma una venta y se dibuja el historial
- **THEN** la venta aparece en el listado con su identificador, su fecha, su cliente y su total

#### Scenario: El historial de otra vista muestra la venta recién confirmada

- **WHEN** la persona usuaria confirma una venta en la vista Ventas y abre la vista Historial desde el menú
- **THEN** la venta está en el listado, porque el registro se conserva entre páginas
