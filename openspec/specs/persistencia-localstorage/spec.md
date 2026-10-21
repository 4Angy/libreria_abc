# persistencia-localstorage Specification

## Purpose
Definir cómo la librería conserva los registros que la persona usuaria crea —libros, clientes y ventas— en el almacenamiento del navegador: qué se guarda y con qué forma, en qué momento se escribe, cómo se recupera al abrir cada vista, y qué pasa cuando ese almacenamiento no está disponible o no es válido.

## Requirements

### Requirement: Los registros se conservan en el almacenamiento del navegador

La aplicación SHALL guardar los libros, los clientes y las ventas en el almacenamiento del navegador, en una clave propia para cada colección, con la misma forma de objetos que usa en memoria: un libro con su identificador, título, ISBN, editorial, género, autores y precio; un cliente con su identificador, nombre y correo electrónico; una venta con su identificador, fecha, cliente, renglones y total. El valor de cada clave SHALL ser una lista JSON legible, sin envoltorio ni metadatos, y SHALL NOT incluir datos de otras colecciones.

#### Scenario: Un libro registrado queda guardado

- **WHEN** la persona usuaria registra un libro
- **THEN** el almacenamiento del navegador contiene una lista con ese libro, con su identificador, su título, su ISBN, su editorial, su género, sus autores y su precio

#### Scenario: Un cliente registrado queda guardado

- **WHEN** la persona usuaria registra un cliente
- **THEN** el almacenamiento del navegador contiene una lista con ese cliente, con su identificador, su nombre y su correo electrónico

#### Scenario: Una venta confirmada queda guardada

- **WHEN** la persona usuaria confirma una venta
- **THEN** el almacenamiento del navegador contiene una lista con esa venta, con su identificador, su fecha, su cliente, sus renglones y su total

#### Scenario: El contenido guardado es legible y editable

- **WHEN** se lee el valor de la clave del catálogo guardado
- **THEN** es una lista JSON cuyos elementos tienen exactamente los campos del modelo, sin campos adicionales ni envoltorio alrededor de la lista

#### Scenario: Cada colección tiene su propia clave

- **WHEN** se inspecciona el almacenamiento del navegador
- **THEN** hay una clave para los libros, una para los clientes y una para las ventas, y cada una contiene únicamente su propia colección

### Requirement: El primer inicio carga los ejemplos y los inicios posteriores no los vuelven a cargar

La aplicación SHALL cargar los datos de ejemplo en el primer inicio, es decir, cuando el almacenamiento todavía no tiene los registros, y SHALL NOT volver a cargarlos en los inicios posteriores. La ausencia de los registros guardados SHALL significar «primer inicio» y su presencia SHALL significar «recuperar». Al recuperar, los registros de ejemplo y los registrados por la persona usuaria SHALL aparecer **una sola vez cada uno**.

#### Scenario: El primer inicio muestra los datos de ejemplo

- **WHEN** se abre la aplicación con el almacenamiento vacío
- **THEN** el catálogo muestra los nueve libros de ejemplo, el listado de clientes muestra los cuatro clientes de ejemplo y el historial muestra las dos ventas de ejemplo

#### Scenario: El primer inicio escribe los ejemplos

- **WHEN** se abre la aplicación con el almacenamiento vacío
- **THEN** las tres claves quedan escritas con los datos de ejemplo

#### Scenario: Al reabrir se recuperan los registros guardados

- **WHEN** se abre la aplicación con registros guardados
- **THEN** el conjunto de datos es el guardado, y los datos de ejemplo no se vuelven a cargar ni se duplican

#### Scenario: Recargar varias veces no duplica nada

- **WHEN** se registra un libro, un cliente y una venta, y luego se recarga la página tres veces
- **THEN** el número de libros, de clientes y de ventas es siempre el mismo, sin repeticiones

#### Scenario: Un registro con el mismo nombre que uno de ejemplo conviven

- **WHEN** la persona usuaria registra un libro cuyo título coincide con el de un libro de ejemplo
- **THEN** ambos aparecen en el catálogo, con identificadores distintos, y ninguno reemplaza al otro

### Requirement: El conjunto de datos guardado es el mismo en todas las vistas

Los registros guardados SHALL alimentar **todas** las vistas: el catálogo, el listado de libros, el listado de clientes, los selectores de la vista Ventas y el historial. La aplicación SHALL NOT mantener un conjunto de datos distinto en cada vista.

#### Scenario: Un libro nuevo aparece en el catálogo

- **WHEN** la persona usuaria registra un libro en la vista Libros y abre el catálogo
- **THEN** el catálogo muestra ese libro junto con los de ejemplo

#### Scenario: Un libro nuevo aparece en el selector de venta

- **WHEN** la persona usuaria registra un libro en la vista Libros y abre la vista Ventas
- **THEN** el selector de libro ofrece ese libro, con su título y su precio

#### Scenario: Un cliente nuevo aparece en su listado y en el selector de venta

- **WHEN** la persona usuaria registra un cliente en la vista Clientes y abre la vista Ventas
- **THEN** el listado de clientes muestra ese cliente y el selector de cliente de la venta lo ofrece

#### Scenario: Una venta nueva aparece en el historial

- **WHEN** la persona usuaria confirma una venta en la vista Ventas y abre la vista Historial
- **THEN** el historial lista esa venta con su identificador, su fecha, su cliente y su total, y permite consultar su detalle con sus renglones

### Requirement: Cada registro se guarda en su propia clave

El sistema SHALL escribir únicamente la clave de la colección que cambió. Un alta de libro SHALL NOT reescribir los clientes ni las ventas; un alta de cliente SHALL NOT reescribir los libros ni las ventas; una venta confirmada SHALL NOT reescribir los libros ni los clientes.

#### Scenario: Un alta de libro no toca las otras colecciones

- **WHEN** la persona usuaria registra un libro
- **THEN** el contenido guardado de clientes y de ventas es exactamente el que estaba antes del alta

#### Scenario: Una venta no reescribe el catálogo

- **WHEN** el precio de un libro del catálogo guardado fue modificado con las herramientas de almacenamiento del navegador y luego la persona usuaria confirma una venta
- **THEN** el catálogo guardado conserva el precio modificado, porque la venta solo escribió la clave de ventas

### Requirement: La venta guardada conserva el precio histórico

Los registros guardados de una venta SHALL conservar el precio unitario de cada renglón tal como se copió al confirmar, junto con el título del libro y el nombre del cliente. El subtotal de un renglón SHALL derivarse del precio unitario guardado, y el total SHALL derivarse de esos subtotales. Ningún importe de una venta guardada SHALL obtenerse del precio actual del catálogo.

#### Scenario: El precio del catálogo guardado cambia

- **WHEN** se modifica con las herramientas de almacenamiento del navegador el precio de un libro del catálogo guardado, sin tocar las ventas guardadas, y se recarga la página
- **THEN** el detalle de la venta sigue mostrando el precio unitario confirmado, y sus subtotales y su total no cambian

#### Scenario: El subtotal sale del precio guardado

- **WHEN** se consulta el detalle de una venta guardada
- **THEN** el subtotal de cada renglón es el producto de su cantidad por su precio unitario guardado, y no por el precio actual del libro

#### Scenario: El total sale de los subtotales guardados

- **WHEN** se consulta el detalle de una venta guardada
- **THEN** el total de la venta es la suma de los subtotales guardados

### Requirement: Un almacenamiento no disponible o inválido no interrumpe la aplicación

La aplicación SHALL NOT dejar de funcionar cuando el almacenamiento del navegador no se pueda usar. Si el almacenamiento no está disponible, o si su contenido no se puede leer, la aplicación SHALL operar con los datos de ejemplo en memoria y SHALL avisar el problema por la consola del navegador. Si el contenido guardado no es válido, la aplicación SHALL usar los datos de ejemplo de esa colección, SHALL NOT sobrescribir el contenido guardado inválido y SHALL avisar el problema por la consola. Un fallo al guardar SHALL NOT interrumpir la operación que la persona usuaria pidió.

#### Scenario: El almacenamiento no está disponible

- **WHEN** el navegador no permite usar el almacenamiento local
- **THEN** la aplicación abre, dibuja sus vistas y registra lo que la persona usuaria pide, sin lanzar ningún error

#### Scenario: El contenido guardado está mal escrito

- **WHEN** una clave del almacenamiento contiene un texto que no es una lista JSON válida
- **THEN** la aplicación abre con los datos de ejemplo de esa colección, deja intacto el contenido escrito y deja un aviso en la consola

#### Scenario: El contenido guardado no tiene la forma esperada

- **WHEN** una clave del almacenamiento contiene una lista cuyos elementos no tienen los campos del modelo
- **THEN** la aplicación abre con los datos de ejemplo de esa colección, en lugar de fallar al dibujar las vistas

#### Scenario: No se puede guardar

- **WHEN** la escritura en el almacenamiento falla
- **THEN** la operación que la persona usuaria pidió se completa y muestra su mensaje de resultado, y la consola explica que el registro no quedó guardado

#### Scenario: El fallo se informa en la consola y no interrumpe

- **WHEN** ocurre cualquiera de los fallos anteriores
- **THEN** ninguna vista queda en blanco y ninguna operación muestra un mensaje de error al usuario por un problema del almacenamiento

### Requirement: El almacenamiento pertenece al origen desde el que se abrió la aplicación

La aplicación SHALL usar el almacenamiento del origen —el navegador, el perfil y la ubicación de apertura— desde el que se abrió, y SHALL NOT compartir registros con ninguna otra ubicación de apertura. La aplicación SHALL NOT intentar leer ni escribir los registros de otro origen.

#### Scenario: Otra ubicación de apertura tiene su propio almacenamiento

- **WHEN** la aplicación se abre desde una ubicación de apertura distinta de la anterior, en el mismo navegador y el mismo perfil
- **THEN** esa ubicación no encuentra los registros de la anterior y la aplicación carga los datos de ejemplo

#### Scenario: Una copia del proyecto abierta desde el disco ve los mismos registros

- **WHEN** la aplicación se abre desde una copia del proyecto located en el disco, abierta con el mismo protocolo que el original
- **THEN** esa copia ve los mismos registros, porque comparte origen de almacenamiento con el original

### Requirement: La venta en curso no se guarda

La aplicación SHALL NOT guardar la venta que se está componiendo. La venta en curso es estado de un formulario y SHALL perderse al recargar la página o al cambiar de vista. Los registros ya confirmados o aceptados SHALL NOT perderse por esto.

#### Scenario: Se recarga con una venta a medio componer

- **WHEN** la persona usuaria recarga la página con renglones en la venta en curso y sin confirmarla
- **THEN** la venta en curso se pierde, y los libros, los clientes y las ventas ya registrados siguen guardados

#### Scenario: Cambiar de vista con una venta a medio componer

- **WHEN** la persona usuaria navega a otra vista con renglones en la venta en curso y sin confirmarla
- **THEN** la venta en curso se pierde, y el resto de los registros sigue guardado
