# altas-libros-clientes Specification

## Purpose
Definir el registro de libros y clientes en la librería: las validaciones que rechaza cada alta, la generación de las opciones de los selectores desde el conjunto local, y la actualización de los listados y de las listas de opciones sin recargar la página.

## Requirements

### Requirement: Alta de un libro con datos válidos

La aplicación SHALL permitir registrar un libro a partir del formulario de la vista Libros cuando el título, el ISBN, el precio, la editorial y al menos un autor son válidos. El registro SHALL incorporarse al conjunto de datos local y SHALL aparecer en el listado de libros registrados con su título, su ISBN, su editorial, su género, sus autores y su precio.

#### Scenario: Libro válido registrado

- **WHEN** la persona usuaria completa el formulario de libro con un título, un ISBN nuevo, un precio mayor que cero, una editorial existente, al menos un autor existente y, opcionalmente, un género existente
- **THEN** el libro queda registrado y aparece en el listado de libros registrados

#### Scenario: El libro registrado conserva sus relaciones

- **WHEN** se registra un libro con dos autores y sin género asignado
- **THEN** el listado muestra ambos autores y muestra «Sin clasificar» en la columna de género

#### Scenario: El ISBN se guarda tal como se escribió

- **WHEN** se registra un libro con el ISBN «978-030-7474728»
- **THEN** el listado muestra ese mismo texto, con sus guiones

### Requirement: Rechazo de los datos inválidos en el alta de libro

La aplicación SHALL rechazar el alta de un libro cuando cualquiera de estas condiciones se cumpla, y SHALL NOT incorporarlo al conjunto de datos local: el título o el ISBN están vacíos; el ISBN ya existe en el conjunto local; el precio está ausente, no es numérico o no es mayor que cero; la editorial no fue elegida o no existe; no se seleccionó ningún autor; alguno de los autores seleccionados no existe; o se asignó un género que no existe. El género MAY quedar sin asignar.

#### Scenario: Título vacío

- **WHEN** se envía el formulario de libro con el título vacío
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: ISBN vacío

- **WHEN** se envía el formulario de libro con el ISBN vacío
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: ISBN ya existente

- **WHEN** se envía el formulario de libro con un ISBN que ya pertenece a un libro del conjunto local
- **THEN** el libro no se registra y se informa que el ISBN ya existe

#### Scenario: Precio ausente

- **WHEN** se envía el formulario de libro con el precio vacío
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: Precio no numérico

- **WHEN** se envía el formulario de libro con un precio que no es un número
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: Precio que no supera el cero

- **WHEN** se envía el formulario de libro con un precio igual a cero o negativo
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: Editorial no elegida o inexistente

- **WHEN** se envía el formulario de libro sin elegir editorial, o con una editorial que no pertenece al conjunto local
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: Ningún autor seleccionado

- **WHEN** se envía el formulario de libro sin ningún autor seleccionado
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: Autor que no existe

- **WHEN** se envía el formulario de libro con un autor que no pertenece al conjunto local
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: Género que no existe

- **WHEN** se envía el formulario de libro con un género que no pertenece al conjunto local
- **THEN** el libro no se registra y se informa el motivo junto al formulario

#### Scenario: El género puede quedar sin asignar

- **WHEN** se envía el formulario de libro con la opción «Sin clasificar» elegida
- **THEN** el libro se registra y queda sin género asignado

### Requirement: Alta de un cliente con datos válidos

La aplicación SHALL permitir registrar un cliente a partir del formulario de la vista Clientes cuando el nombre completo y el correo electrónico son válidos. El registro SHALL incorporarse al conjunto de datos local y SHALL aparecer en el listado de clientes registrados con su nombre y su correo electrónico.

#### Scenario: Cliente válido registrado

- **WHEN** la persona usuaria completa el formulario de cliente con un nombre completo y un correo electrónico con formato válido que no pertenece a ningún cliente del conjunto local
- **THEN** el cliente queda registrado y aparece en el listado de clientes registrados

#### Scenario: Dos clientes pueden compartir el nombre

- **WHEN** se registra un cliente cuyo nombre coincide con el de otro cliente, con un correo electrónico distinto
- **THEN** el cliente se registra y ambos conviven en el listado

### Requirement: Rechazo de los datos inválidos en el alta de cliente

La aplicación SHALL rechazar el alta de un cliente cuando el nombre completo o el correo electrónico están vacíos, cuando el correo electrónico no tiene un formato válido, o cuando ya existe un cliente con ese correo electrónico, y SHALL NOT incorporarlo al conjunto de datos local.

#### Scenario: Nombre vacío

- **WHEN** se envía el formulario de cliente con el nombre vacío
- **THEN** el cliente no se registra y se informa el motivo junto al formulario

#### Scenario: Correo electrónico vacío

- **WHEN** se envía el formulario de cliente con el correo electrónico vacío
- **THEN** el cliente no se registra y se informa el motivo junto al formulario

#### Scenario: Correo electrónico con formato inválido

- **WHEN** se envía el formulario de cliente con un correo electrónico al que le falta la arroba, al que le falta el punto del dominio o que contiene espacios
- **THEN** el cliente no se registra y se informa el motivo junto al formulario

#### Scenario: Correo electrónico ya existente

- **WHEN** se envía el formulario de cliente con un correo electrónico que ya pertenece a un cliente del conjunto local
- **THEN** el cliente no se registra y se informa que el correo ya existe

### Requirement: La comparación del ISBN y del correo electrónico ignora espacios y mayúsculas

La comparación de un ISBN contra los libros existentes SHALL eliminar los espacios y los guiones antes de comparar. La comparación de un correo electrónico contra los clientes existentes SHALL recortar los espacios exteriores y SHALL ignorar las diferencias entre mayúsculas y minúsculas antes de comparar.

#### Scenario: ISBN duplicado escrito con guiones y espacios

- **WHEN** se envía el formulario de libro con un ISBN existente escrito con guiones y espacios intercalados
- **THEN** el libro se rechaza por ISBN duplicado

#### Scenario: ISBN nuevo escrito con guiones y espacios

- **WHEN** se envía el formulario de libro con un ISBN que no existe, escrito con guiones y espacios intercalados
- **THEN** el libro se registra, porque el ISBN no existe con esa forma normalizada

#### Scenario: Correo duplicado escrito en mayúsculas

- **WHEN** se envía el formulario de cliente con el correo de un cliente existente, escrito en mayúsculas y con espacios exteriores
- **THEN** el cliente se rechaza por correo duplicado

### Requirement: Los motivos del rechazo se muestran junto al formulario

Cuando un alta se rechaza, la aplicación SHALL mostrar un mensaje de texto visible junto al formulario que explique qué se debe corregir. El mensaje SHALL nombrar cada regla que no se cumplió, y el formulario SHALL conservar lo que la persona usuaria escribió. El mensaje de error y el de operación correcta SHALL NOT verse visibles al mismo tiempo.

#### Scenario: El motivo es visible y está junto al formulario

- **WHEN** se envía un formulario que incumple una regla
- **THEN** aparece un mensaje de texto junto al formulario que nombra esa regla, en lugar de un aviso genérico o de un aviso que dependa solo del color

#### Scenario: Se informan todos los motivos

- **WHEN** se envía un formulario que incumple varias reglas a la vez
- **THEN** el mensaje nombra todas las reglas incumplidas, no solo la primera

#### Scenario: El formulario conserva lo escrito

- **WHEN** se envía un formulario que incumple una regla
- **THEN** los valores escritos por la persona usuaria siguen en el formulario

#### Scenario: Los mensajes de error y de éxito no se mezclan

- **WHEN** un alta es rechazada después de un alta correcta
- **THEN** solo queda visible el mensaje de error

#### Scenario: El alta correcta informa el resultado

- **WHEN** un alta se completa sin errores
- **THEN** aparece un mensaje de operación correcta junto al formulario

### Requirement: Las opciones de los selectores provienen del conjunto local

Las opciones de los selectores de editorial, género y autores del formulario de libro SHALL generarse a partir del conjunto de datos local, de modo que exista exactamente una opción por registro existente y ninguna por un registro inexistente. El selector de género SHALL incluir la opción «Sin clasificar», que representa la ausencia de género. La selección de editorial SHALL ser obligatoria y la de autor SHALL admitir más de una elección.

#### Scenario: Una opción por registro existente

- **WHEN** se carga la vista Libros
- **THEN** el selector de editorial ofrece una opción por cada editorial del conjunto local, el de género una por cada género, y el de autores una por cada autor

#### Scenario: El género ofrece «Sin clasificar»

- **WHEN** se carga la vista Libros
- **THEN** el selector de género incluye «Sin clasificar», y esa opción representa la ausencia de género

#### Scenario: Se pueden elegir varios autores

- **WHEN** la persona usuaria elige más de un autor en el selector de autores
- **THEN** las elecciones quedan marcadas al mismo tiempo

#### Scenario: No hay opciones de registros inexistentes

- **WHEN** se cargan los datos locales
- **THEN** ninguna de las opciones generadas corresponde a un registro que no está en el conjunto local

### Requirement: La selección de venta consume el mismo conjunto local

Los selectores de cliente y de libro de la vista Ventas SHALL poblarse a partir del mismo conjunto de datos local que alimenta el catálogo y los listados de libros y clientes.

#### Scenario: Los selectores de la venta se pueblan

- **WHEN** se carga la vista Ventas
- **THEN** el selector de cliente ofrece una opción por cada cliente del conjunto local, y el de libro una por cada libro

#### Scenario: Las opciones de libro muestran su precio

- **WHEN** se carga la vista Ventas
- **THEN** cada opción de libro muestra el título del libro junto con su precio

### Requirement: Los datos escritos por la persona usuaria se insertan como texto

Los valores que la persona usuaria escriba en los formularios SHALL insertarse en el DOM como texto, sin interpretarse como HTML.

#### Scenario: Un nombre con marcado en su interior

- **WHEN** se registra un cliente cuyo nombre contiene etiquetas de marcado
- **THEN** el listado muestra el texto literal, sin interpretarlo como negrita ni como ningún otro elemento

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
