# documentacion-entrega Specification

## Purpose
Definir la documentación de la entrega: el `README.md` de la raíz del proyecto, con la identificación de quienes realizan el trabajo, los pasos para abrir la aplicación sin npm, la descripción de las vistas y de las funcionalidades, la ubicación de los datos iniciales, el funcionamiento y los límites del almacenamiento del navegador, la guía para reproducir la comprobación del precio histórico, el resultado observado de los casos manuales y la procedencia de las imágenes ajenas.

## Requirements

### Requirement: La entrega se documenta en un README en la raíz

El proyecto SHALL tener un archivo `README.md` en su raíz, escrito en Markdown, que documente la entrega. El README SHALL contener las secciones de: quienes realizan el trabajo; los pasos para abrir `index.html` en el navegador sin npm; la navegación entre las vistas; las funcionalidades implementadas; las funcionalidades pendientes; la ubicación de los datos iniciales; el funcionamiento y los límites del almacenamiento del navegador; los resultados de los casos manuales; y la procedencia de las imágenes ajenas, si existen.

#### Scenario: El README está en la raíz

- **WHEN** se abre la carpeta del proyecto
- **THEN** hay un archivo `README.md` junto a `index.html`

#### Scenario: El README tiene todas las secciones exigidas

- **WHEN** se recorre el README
- **THEN** aparecen las secciones de integrantes, apertura sin npm, navegación, funcionalidades implementadas, funcionalidades pendientes, datos iniciales, almacenamiento del navegador, casos manuales, procedencia de las imágenes y contenido de la entrega

#### Scenario: Las funcionalidades pendientes están separadas de las implementadas

- **WHEN** se recorre el README
- **THEN** hay dos secciones distintas, una con lo que la aplicación hace y otra con lo que no hace, y en la segunda se explica por qué

#### Scenario: El reparto del trabajo queda documentado

- **WHEN** el trabajo lo realizan varias personas
- **THEN** la sección de integrantes dice qué parte del parcial hizo cada una

### Requirement: El README explica cómo abrir la aplicación sin npm

El README SHALL indicar los pasos para abrir `index.html` directamente en el navegador, sin instalar dependencias, sin usar npm y sin levantar un servidor, y SHALL dejar claro que la aplicación no necesita compilación.

#### Scenario: Los pasos son ejecutables por una persona

- **WHEN** una persona que nunca abrió el proyecto sigue los pasos del README
- **THEN** llega a ver la aplicación funcionando en el navegador, sin instalar nada

#### Scenario: El README aclara que no hay compilación

- **WHEN** se busca en el README la mención de npm o de la compilación
- **THEN** dice que no hacen falta

### Requirement: El README describe la navegación y las funcionalidades

El README SHALL describir las cinco vistas de la aplicación —Catálogo, Libros, Clientes, Ventas e Historial— y cómo se llega a cada una, y SHALL resumir qué hace la aplicación.

#### Scenario: Las cinco vistas están documentadas

- **WHEN** se recorre el README
- **THEN** las cinco vistas aparecen nombradas, con su función y con el camino para llegar a cada una

#### Scenario: Las funcionalidades están resumidas por ejercicio

- **WHEN** se recorre el README
- **THEN** el resumen de funcionalidades menciona el catálogo con su filtro, el alta de libros y de clientes, la venta simulada, el historial y la persistencia

### Requirement: El README identifica los datos iniciales

El README SHALL indicar en qué archivo están los datos de ejemplo, qué colecciones contiene, cuántas registros trae y que son ficticios.

#### Scenario: La ubicación de los datos iniciales es exacta

- **WHEN** se busca en el README la ubicación de los datos iniciales
- **THEN** dice el nombre del archivo que los contiene, dentro de la carpeta de JavaScript

#### Scenario: El contenido de los datos iniciales está contado

- **WHEN** se lee esa sección del README
- **THEN** dice cuántos libros, clientes y ventas de ejemplo trae, y que sus precios y las ventas son ficticios

### Requirement: El README explica el funcionamiento y los límites del almacenamiento del navegador

El README SHALL explicar qué se guarda, en qué claves, con qué forma, en qué momento se escribe y qué se hace al abrir la aplicación por primera vez. SHALL además advertir los límites: que el almacenamiento depende del navegador, del perfil de la persona usuaria y de la ubicación de apertura, que no comparte información entre personas usuarias, que se puede borrar, y que no ofrece seguridad ni integridad garantizada por un servidor.

#### Scenario: Los tres límites de dependencia están nombrados

- **WHEN** se busca en el README la sección del almacenamiento del navegador
- **THEN** dice que depende del navegador, del perfil y de la ubicación de apertura

#### Scenario: El límite entre personas usuarias está nombrado

- **WHEN** se busca en el README la sección del almacenamiento del navegador
- **THEN** dice que no comparte información entre personas usuarias y que otra persona con otro perfil ve la aplicación sin los datos registrados

#### Scenario: El límite de la ubicación de apertura está explicado

- **WHEN** se lee la sección del almacenamiento del navegador
- **THEN** explica que una ubicación de apertura distinta tiene su propio almacenamiento, y que todas las rutas locales abiertas con el mismo protocolo comparten el mismo

#### Scenario: El README no promete seguridad

- **WHEN** se busca en el README la sección del almacenamiento del navegador
- **THEN** dice que el almacenamiento sirve para la práctica y no representa seguridad ni integridad garantizada por un servidor

### Requirement: El README permite reproducir la comprobación del precio histórico

El README SHALL identificar la clave del catálogo guardado y la estructura de su contenido, SHALL explicar con qué herramienta editar el precio de un libro sin tocar las ventas guardadas, y SHALL describir qué se espera ver al recargar y consultar el detalle de la venta.

#### Scenario: La clave y la estructura están identificadas

- **WHEN** se busca en el README la comprobación del precio histórico
- **THEN** dice el nombre exacto de la clave del catálogo guardado y la forma de su contenido, con los campos de cada elemento

#### Scenario: La guía dice qué no tocar

- **WHEN** se lee la guía de la comprobación del precio histórico
- **THEN** dice que las ventas guardadas no se modifican ni se borran, y que solo se cambia el precio del libro dentro del catálogo

#### Scenario: La guía dice qué se espera ver

- **WHEN** se lee la guía
- **THEN** dice que, tras recargar, el detalle de la venta conserva el precio unitario, los subtotales y el total confirmados

### Requirement: El README registra el resultado observado de cada caso manual

El README SHALL registrar, para cada uno de los casos manuales de la consigna, el resultado **realmente observado** al ejecutarlo. Ningún caso SHALL figurar como aprobado si no se ejecutó, y todo caso fallido o pendiente SHALL quedar registrado con su comportamiento real y el motivo de su estado.

#### Scenario: Los ocho casos están en el README

- **WHEN** se busca en el README la tabla de casos manuales
- **THEN** hay una fila por cada caso manual de la consigna, con lo que se hizo y lo que se observó

#### Scenario: Ningún caso no ejecutado aparece como aprobado

- **WHEN** se revisa la tabla de casos manuales
- **THEN** los casos que no se ejecutaron están marcados como pendientes, con el motivo, y ninguno aparece como aprobado

#### Scenario: Los fallos quedan registrados

- **WHEN** un caso manual falla o una funcionalidad queda pendiente
- **THEN** el README dice qué se observó, en lugar de omitirlo o de presentarlo como correcto

### Requirement: El README declara la procedencia de las imágenes ajenas

Si el proyecto incluye imágenes que no son propias, el README SHALL declarar su procedencia: la obra, su autor, el enlace a la fuente y la licencia bajo la que se usan, con la línea de crédito que la fuente pide, y SHALL dejar constancia de que la imagen no es obra del equipo. Si no hay imágenes ajenas, el README SHALL decirlo.

#### Scenario: Hay una imagen de terceros

- **WHEN** el proyecto incluye una imagen que no es propia
- **THEN** el README declara la obra, el autor, el enlace a la fuente y la licencia, incluye la línea de crédito que la fuente pide, y dice que la imagen no es obra del equipo

#### Scenario: Una procedencia que no se conoce

- **WHEN** no se conoce el origen o la licencia de una imagen
- **THEN** el README lo declara así, en lugar de atribuirle un origen que no se conoce

#### Scenario: No hay imágenes ajenas

- **WHEN** el proyecto no incluye imágenes de terceros
- **THEN** el README dice que no hay imágenes ajenas

### Requirement: La entrega no incluye dependencias instaladas ni herramientas de compilación

El proyecto entregado SHALL NOT incluir dependencias instaladas, ni archivos de gestión de paquetes, ni procesos de compilación. La aplicación SHALL consistir en los archivos HTML, CSS y JavaScript del proyecto, sus recursos locales y el `README.md`.

#### Scenario: No hay dependencias en la carpeta

- **WHEN** se revisa el contenido de la carpeta del proyecto
- **THEN** no hay carpeta de dependencias instaladas ni archivo de gestión de paquetes

#### Scenario: El README lo declara

- **WHEN** se lee la sección de la entrega del README
- **THEN** dice qué contiene la carpeta y que no incluye dependencias instaladas ni herramientas de compilación
