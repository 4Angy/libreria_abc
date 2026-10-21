# ventas-e-historial Specification

## Purpose
Definir la venta simulada de la librería: la composición de una venta con su cliente y sus renglones, el cálculo de sus importes, la confirmación que congela el precio unitario como valor histórico, y el historial consultable de las ventas registradas.

## Requirements

### Requirement: Composición de una venta

La vista Ventas SHALL permitir elegir un cliente existente, elegir un libro existente, escribir una cantidad y agregar un renglón a la venta en curso. La venta en curso SHALL admitir uno o más renglones, cada uno con un libro y una cantidad.

#### Scenario: Agregar el primer renglón

- **WHEN** la persona usuaria elige un libro, escribe una cantidad y agrega un renglón
- **THEN** el renglón aparece en el resumen de la venta con su libro y su cantidad

#### Scenario: Agregar un segundo renglón

- **WHEN** la persona usuaria agrega un renglón de un libro distinto del primero
- **THEN** el resumen muestra los dos renglones, en el orden en que se agregaron

#### Scenario: Agregar un renglón sin haber elegido cliente

- **WHEN** la persona usuaria agrega un renglón sin haber elegido un cliente
- **THEN** el renglón se agrega y la venta en curso queda a la espera de un cliente

### Requirement: El resumen muestra los importes de la venta

Cada renglón del resumen SHALL mostrar el libro, la cantidad, el precio unitario y el subtotal, y el resumen SHALL mostrar el total de la venta. El subtotal SHALL ser el producto de la cantidad por el precio unitario, y el total SHALL ser la suma de los subtotales. Los importes SHALL presentarse con dos decimales.

#### Scenario: Los importes de una venta con dos renglones

- **WHEN** la venta en curso tiene un renglón de 2 unidades a 1500 y otro de 1 unidad a 2000
- **THEN** los subtotales son 3000,00 y 2000,00 y el total es 5000,00

#### Scenario: El total sigue a los subtotales

- **WHEN** la venta en curso tiene varios renglones
- **THEN** el total es la suma de sus subtotales

#### Scenario: El formato de los importes

- **WHEN** se muestra cualquier importe de la venta
- **THEN** se presenta con dos decimales y en el mismo formato de moneda que el catálogo

#### Scenario: La venta en curso sin renglones

- **WHEN** la venta en curso no tiene ningún renglón
- **THEN** el resumen muestra un mensaje de lista vacía

### Requirement: Los renglones se pueden modificar antes de confirmar

Antes de confirmar, la cantidad de cada renglón SHALL poder editarse y cada renglón SHALL poder quitarse del resumen. Un cambio de cantidad o una eliminación SHALL recalcular el subtotal del renglón y el total de la venta.

#### Scenario: Editar la cantidad de un renglón

- **WHEN** la persona usuaria cambia la cantidad de un renglón
- **THEN** el subtotal de ese renglón y el total de la venta se recalculan

#### Scenario: Quitar un renglón

- **WHEN** la persona usuaria quita un renglón del resumen
- **THEN** el renglón desaparece y el total se recalcula

#### Scenario: Quitar el último renglón

- **WHEN** la persona usuaria quita el único renglón de la venta
- **THEN** el resumen vuelve a mostrar el mensaje de lista vacía

#### Scenario: Una cantidad editada que no es válida

- **WHEN** la persona usuaria edita la cantidad de un renglón a un valor que no es un entero mayor que cero
- **THEN** ese renglón queda marcado como inválido, su subtotal no muestra un importe y la venta no se puede confirmar

#### Scenario: Volver a una cantidad válida

- **WHEN** la persona usuaria edita la cantidad inválida a un entero mayor que cero
- **THEN** el renglón vuelve a estar válido y el subtotal y el total se recalculan

### Requirement: Un libro repetido no crea un segundo renglón

Cuando se agregue a la venta en curso un libro que ya tenga un renglón, el sistema SHALL NOT crear un segundo renglón para ese libro: SHALL sumar la cantidad al renglón existente e informar el resultado con un mensaje visible.

#### Scenario: Agregar un libro que ya está en la venta

- **WHEN** la persona usuaria agrega un libro que ya tiene un renglón en la venta
- **THEN** el número de renglones no cambia, la cantidad del renglón existente suma la nueva y un mensaje informa cuántas unidades quedan

#### Scenario: Agregar dos veces el mismo libro con la misma cantidad

- **WHEN** la persona usuaria agrega dos veces el mismo libro con la misma cantidad
- **THEN** el renglón existente queda con el doble de la cantidad y sigue siendo un solo renglón

### Requirement: La confirmación exige una venta válida

La confirmación de una venta SHALL ser rechazada, sin registrar ninguna venta, cuando no haya un cliente elegido, cuando la venta en curso no tenga renglones, o cuando algún renglón tenga una cantidad que no sea un entero mayor que cero. El motivo del rechazo SHALL mostrarse en un mensaje de texto visible junto al formulario, y la venta en curso SHALL conservarse.

#### Scenario: Confirmar sin cliente

- **WHEN** la persona usuaria confirma una venta sin haber elegido cliente
- **THEN** no se registra ninguna venta y el motivo aparece junto al formulario

#### Scenario: Confirmar sin renglones

- **WHEN** la persona usuaria confirma una venta sin renglones
- **THEN** no se registra ninguna venta y el motivo aparece junto al formulario

#### Scenario: Confirmar con una cantidad inválida

- **WHEN** la persona usuaria confirma una venta con un renglón cuya cantidad no es un entero mayor que cero
- **THEN** no se registra ninguna venta y el motivo nombra el renglón problemático

#### Scenario: Confirmar con una cantidad cero, negativa o decimal

- **WHEN** la persona usuaria confirma una venta con una cantidad cero, negativa o decimal
- **THEN** no se registra ninguna venta y el motivo explica que la cantidad debe ser un entero mayor que cero

### Requirement: La venta confirmada conserva el precio histórico

Al confirmar una venta, el sistema SHALL copiar a cada renglón el precio unitario vigente en ese momento, junto con el título del libro y el nombre del cliente. El subtotal de un renglón SHALL derivarse de esos valores guardados y NO SHALL obtenerse del precio actual del catálogo.

#### Scenario: El precio queda congelado en el renglón

- **WHEN** la persona usuaria confirma una venta
- **THEN** cada renglón registrado guarda el precio unitario que tenía el libro en el momento de la confirmación

#### Scenario: El historial no sigue al catálogo

- **WHEN** se confirma una venta y luego cambia el precio del libro en el catálogo
- **THEN** el detalle de la venta sigue mostrando el precio unitario confirmado, y sus subtotales y su total no cambian

#### Scenario: El subtotal se deriva de lo guardado

- **WHEN** se consulta el detalle de una venta
- **THEN** el subtotal de cada renglón es el producto de su cantidad por su precio unitario guardado, y no por el precio actual del libro

### Requirement: La venta confirmada tiene identificador y fecha propios

Al confirmar una venta, el sistema SHALL registrar su identificador y su fecha. El identificador SHALL seguir el patrón `vt-YYYY-NNNN`, con el año de la venta y un número correlativo de cuatro dígitos dentro de ese año, y no SHALL repetir el de ninguna venta existente. La fecha SHALL ser la de la confirmación, en formato `YYYY-MM-DD`, y SHALL corresponder a la fecha local.

#### Scenario: La primera venta nueva

- **WHEN** la persona usuaria confirma su primera venta en un año que ya tiene ventas registradas
- **THEN** la venta recibe el identificador correlativo siguiente al último de ese año

#### Scenario: La fecha de la venta

- **WHEN** la persona usuaria confirma una venta
- **THEN** la venta queda con la fecha de ese día, en formato `YYYY-MM-DD`

#### Scenario: Un año nuevo

- **WHEN** se confirma la primera venta de un año que todavía no tiene ventas
- **THEN** su identificador reinicia la numeración de ese año

### Requirement: Tras confirmar, el formulario queda limpio

Al confirmar una venta válida, el sistema SHALL vaciar la venta en curso, reiniciar los controles del formulario y mostrar un mensaje de resultado que identifique la venta registrada y su total.

#### Scenario: El resultado de la confirmación

- **WHEN** la persona usuaria confirma una venta válida
- **THEN** aparece un mensaje con el identificador y el total de la venta registrada

#### Scenario: El formulario limpio

- **WHEN** la persona usuaria confirma una venta válida
- **THEN** el selector de cliente, el de libro y el campo de cantidad vuelven a su estado inicial, y el resumen vuelve a mostrar el mensaje de lista vacía

### Requirement: El detalle permanece oculto hasta que se solicita

El bloque de detalle de una venta SHALL permanecer oculto, y con sus campos vacíos, mientras no se haya solicitado. Al solicitarlo, SHALL mostrar el identificador, la fecha, el cliente, el total y los renglones de esa venta, con el libro, la cantidad, el precio unitario y el subtotal de cada renglón. Al cerrarlo, el bloque SHALL volver a ocultarse y sus campos SHALL quedar vacíos.

#### Scenario: El detalle antes de solicitarlo

- **WHEN** la persona usuaria abre la vista Historial sin pedir ningún detalle
- **THEN** el bloque de detalle está oculto y sus campos están vacíos

#### Scenario: Consultar el detalle de una venta

- **WHEN** la persona usuaria pide el detalle de una venta
- **THEN** se muestran el identificador, la fecha, el cliente, el total y la tabla de renglones de esa venta

#### Scenario: Cerrar el detalle

- **WHEN** la persona usuaria cierra el detalle
- **THEN** el bloque se oculta y sus campos quedan vacíos

### Requirement: Las ventas confirmadas no se editan ni se eliminan

Desde la interfaz, el historial SHALL NOT ofrecer ninguna acción que modifique o elimine una venta registrada. La única acción disponible sobre una venta registrada SHALL ser consultar su detalle.

#### Scenario: El historial solo consulta

- **WHEN** la persona usuaria recorre el listado del historial
- **THEN** la única acción disponible es la de consultar el detalle; no hay ninguna para editar ni para eliminar

#### Scenario: Los importes de una venta no se recalculan

- **WHEN** cambia el precio de un libro del catálogo
- **THEN** ninguna venta registrada cambia de importe

### Requirement: El envío se controla sin recargar la página

El formulario de venta SHALL controlar el envío, de modo que la página no se recargue, no navegue y no modifique su dirección al agregar un renglón o al confirmar una venta.

#### Scenario: Agregar un renglón no recarga la página

- **WHEN** la persona usuaria agrega un renglón
- **THEN** la dirección de la página no cambia y la página no se recarga

#### Scenario: Confirmar no recarga la página

- **WHEN** la persona usuaria confirma una venta
- **THEN** la dirección de la página no cambia y la página no se recarga

### Requirement: Los datos escritos por la persona usuaria se insertan como texto

Los valores que la persona usuaria escriba en el formulario de venta SHALL insertarse en el DOM como texto, sin interpretarse como HTML, y lo mismo SHALL ocurrir con los datos descriptivos que la venta registra.

#### Scenario: Un título con marcado en su interior

- **WHEN** se registra una venta con un libro cuyo título contiene etiquetas de marcado
- **THEN** el historial muestra el texto literal, sin interpretarlo como negrita ni como ningún otro elemento

#### Scenario: Un cliente con marcado en su nombre

- **WHEN** se registra una venta con un cliente cuyo nombre contiene etiquetas de marcado
- **THEN** el historial y el detalle muestran el texto literal

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
