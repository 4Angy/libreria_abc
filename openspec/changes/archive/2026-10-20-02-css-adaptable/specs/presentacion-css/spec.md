# Spec Delta

## Purpose

Define la capa de presentación del frontend de la librería —identidad visual, tokens de diseño, clases reutilizadas, layout con Flexbox y Grid, adaptación del ancho de pantalla, foco visible, estados distinguibles sin depender del color, tratamiento de la imagen decorativa y operación sin servidor— aplicada de forma coherente a las cinco vistas ya construidas.

## ADDED Requirements

### Requirement: Identidad visual coherente entre las cinco vistas

El sistema SHALL presentar las cinco vistas —Catálogo, Libros, Clientes, Ventas e Historial— con una única identidad visual, sostenida por los mismos tokens de color, tipografía, escala de espaciado, radios y sombras, y por las mismas clases en los elementos equivalentes. La presentación SHALL obtenerse de una hoja de estilos externa, sin styles embebidos en el marcado.

#### Scenario: Presentación unificada de las cinco vistas

- **WHEN** se abren las cinco vistas a 1280 px de ancho
- **THEN** las cinco comparten paleta, tipografía, espaciado, tarjetas, formularios y botones, y el contenido se ve centrado con un ancho máximo

#### Scenario: Elementos equivalentes reutilizan las mismas clases

- **WHEN** se comparan los botones, los campos de formulario, las tarjetas y las tablas de dos vistas distintas
- **THEN** comparten las mismas clases y los mismos tokens, sin reglas de estilo duplicadas por vista

#### Scenario: Estilos ausentes dejan la página utilizable

- **WHEN** la hoja de estilos no está disponible
- **THEN** el contenido sigue siendo legible y navegable, y ninguna sección de contenido queda oculta

### Requirement: Hoja de estilos externa sin recursos externos

El sistema SHALL enlazar una única hoja de estilos local y relativa desde el encabezado de cada una de las cinco vistas. El marcado SHALL NOT contener atributos de estilo en línea, bloques de estilo, imports remotos, tipografías externas ni referencias a recursos alojados en otro origen.

#### Scenario: Enlace local a la hoja de estilos

- **WHEN** se inspecciona el encabezado de cualquiera de las cinco vistas
- **THEN** se encuentra un enlace a la hoja de estilos local con ruta relativa, y no hay ninguna otra fuente de estilos

#### Scenario: Ausencia de estilos en línea y de recursos remotos

- **WHEN** se busca en el código fuente de las cinco vistas y en la hoja de estilos
- **THEN** no hay coincidencias de estilos en línea, de bloques de estilo, de imports remotos, de tipografías externas ni de direcciones de red

#### Scenario: Estilización por clase y no por identificador

- **WHEN** se revisan los selectores de la hoja de estilos
- **THEN** todos apuntan a clases o a elementos y ninguno apunta a un identificador del marcado

### Requirement: Organización del contenido con Flexbox y Grid

El sistema SHALL organizar la cabecera y la navegación principal con Flexbox, y el contenido principal y los conjuntos de campos de formulario con Grid, de modo que la disposición se resuelva con el CSS y sin scripting.

#### Scenario: Cabecera y navegación flexibles

- **WHEN** se inspecciona la hoja de estilos
- **THEN** la cabecera y la lista de la navegación se organizan con Flexbox, con envoltura de elementos y separación uniforme

#### Scenario: Contenido y formularios en rejilla

- **WHEN** se inspecciona la hoja de estilos
- **THEN** el contenido principal y los conjuntos de campos de formulario se organizan con Grid, con separación y columnas definidas

#### Scenario: La disposición se adapta al ancho disponible

- **WHEN** el viewport tiene 320 px de ancho
- **THEN** la cabecera y la navegación pasan a ocupar varias filas alineadas al inicio, sin exceder el ancho de la pantalla

### Requirement: Paleta y tokens de la identidad visual

El sistema SHALL definir en un bloque de variables los colores de la identidad visual elegida: fondo `#FAFAF8`, superficie `#FFFFFF`, texto `#22262A`, texto suave `#5B625E`, primario `#2F5D50`, primario en hover `#234A3F`, acento `#C2A25A`, error `#A33A2B` sobre fondo `#F7EAE7`, éxito `#2C6B4F` sobre fondo `#E8F2ED` y foco `#0B57D0`. Los demás valores de color, de tipografía, de espaciado, de radio y de sombra SHALL consumirse a través de esas variables.

#### Scenario: Valores de la paleta disponibles como variables

- **WHEN** se inspecciona el bloque de variables de la hoja de estilos
- **THEN** están declarados los colores de fondo, superficie, texto, texto suave, primario, primario en hover, acento, error, fondo de error, éxito, fondo de éxito, foco y borde, junto con las escalas de tipografía, espaciado y radio

#### Scenario: El color de acento es solo decorativo

- **WHEN** se revisan las reglas que usan el color de acento
- **THEN** el acento se aplica únicamente a bordes, detalles y decoración, y nunca al color de un texto

#### Scenario: Contraste suficiente de los pares de texto

- **WHEN** se calculan las relaciones de contraste entre cada color de texto y su fondo
- **THEN** todas alcanzan al menos 4,5:1, y el indicador de foco alcanza al menos 3:1 contra el fondo y contra la superficie

### Requirement: Adaptación del ancho de pantalla sin desplazamiento horizontal de la página

El sistema SHALL presentar su contenido de forma legible entre 320 px y 1280 px de ancho de ventana, sin provocar desplazamiento horizontal de la página en ningún momento. El contenido SHALL estar centrado y con un ancho máximo en las pantallas anchas.

#### Scenario: Vista estrecha sin desplazamiento de página

- **WHEN** se abre cualquiera de las cinco vistas con el ancho de ventana en 320 px
- **THEN** el ancho total del documento no supera el ancho de la ventana y todos los textos y controles quedan visibles y utilizables

#### Scenario: Vista ancha sin desplazamiento de página

- **WHEN** se abre cualquiera de las cinco vistas con el ancho de ventana en 1280 px
- **THEN** el contenido aparece centrado con un ancho máximo y el documento no se desplaza horizontalmente

#### Scenario: Contenido que no entra en el ancho disponible

- **WHEN** una celda contiene un texto largo sin espacios o un control tiene un valor largo
- **THEN** el texto se parte dentro de su celda o control y ningún elemento sobresale del ancho de la ventana

### Requirement: Tablas con desplazamiento propio

El sistema SHALL envolver cada tabla de la interfaz en un contenedor con desplazamiento horizontal propio, de modo que una tabla más ancha que el espacio disponible se desplace dentro de su contenedor y nunca desplace la página completa.

#### Scenario: Tabla más ancha que su contenedor

- **WHEN** una tabla no entra en el ancho disponible
- **THEN** su contenedor ofrece desplazamiento horizontal y el ancho del documento no cambia

#### Scenario: Tabla que entra en el ancho disponible

- **WHEN** la tabla entra holgadamente en el ancho disponible
- **THEN** no aparece ninguna barra de desplazamiento horizontal en su contenedor y las columnas se reparten con legibilidad

#### Scenario: Contenedor de tabla acotado

- **WHEN** se inspecciona el estilo del contenedor de una tabla
- **THEN** su ancho máximo está limitado al de su bloque padre, de modo que no pueda ensanchar la página

### Requirement: Foco visible y recorrido por teclado

El sistema SHALL mostrar un foco visible en todos los controles interactivos al recorrerlos con el teclado, y SHALL NOT suprimir ese foco sin reemplazarlo por otro indicador visible. El orden de recorrido SHALL ser el del documento, sin saltos mediante atributos de tabulación.

#### Scenario: Foco visible durante la navegación por teclado

- **WHEN** se recorren los controles de una vista con la tecla de tabulación
- **THEN** cada control que recibe el foco muestra un contorno visible y contrastante respecto del fondo

#### Scenario: El foco no se elimina

- **WHEN** se revisan las reglas de estilo de los botones, los enlaces y los controles de formulario
- **THEN** ninguna de ellas suprime el indicador de foco sin ofrecer un indicador equivalente

#### Scenario: Orden de tabulación lógico

- **WHEN** se recorren los controles de una vista con la teclado
- **THEN** el foco avanza en el orden en que aparecen en el documento, sin saltos ni retrocesos

#### Scenario: Preferencia de movimiento reducido

- **WHEN** el sistema declara la preferencia de movimiento reducido
- **THEN** las transiciones y animaciones quedan desactivadas

### Requirement: Mensajes de error y éxito distinguibles sin depender del color

El sistema SHALL distinguir visualmente los mensajes de error y los mensajes de operación correcta mediante el texto del propio mensaje, un borde marcado y un peso tipográfico reforzado, además del color, sin modificar el texto ya presente en el marcado.

#### Scenario: Mensaje de error identificable

- **WHEN** se muestra un mensaje de operación rechazada
- **THEN** se reconoce por su texto, por un borde marcado y por un peso tipográfico mayor, y no solo por su color

#### Scenario: Mensaje de éxito identificable

- **WHEN** se muestra un mensaje de operación correcta
- **THEN** se reconoce por su texto, por un borde marcado y por un peso tipográfico mayor, y no solo por su color

#### Scenario: Mensaje oculto no ocupa espacio

- **WHEN** un contenedor de mensaje mantiene su atributo de ocultamiento
- **THEN** no ocupa espacio, no desplaza la composición y no queda visible

### Requirement: Imagen decorativa local con texto alternativo vacío

El sistema SHALL incluir una única imagen en la interfaz: el archivo local `logo.png`, presente en la marca de la cabecera de las cinco vistas y con texto alternativo vacío por ser decorativa, ya que la información que transmite está disponible en el texto contiguo.

#### Scenario: Imagen decorativa en la marca

- **WHEN** se inspecciona la cabecera de cualquiera de las cinco vistas
- **THEN** la marca contiene la imagen local con texto alternativo vacío y, a su lado, el nombre visible de la librería

#### Scenario: Imagen local y sin duplicar información

- **WHEN** se revisan todas las imágenes del producto
- **THEN** hay una sola imagen, es local, no está alojada en otro origen y su texto alternativo no repite el nombre de la librería

#### Scenario: Integración visual de la imagen

- **WHEN** se renderiza la cabecera
- **THEN** la imagen se apoya sobre la superficie de la cabecera, de modo que su fondo opaco no se perciba como un parche ni desentonice con el fondo de la página

### Requirement: Apertura directa sin servidor

El sistema SHALL funcionar al abrirse directamente desde el sistema de archivos, sin servidor, sin proceso de compilación y sin dependencias externas, con la hoja de estilos aplicada y todas las rutas referenciadas de forma relativa.

#### Scenario: Apertura directa de cualquier vista

- **WHEN** se abre cualquiera de las cinco vistas desde el sistema de archivos
- **THEN** la página se muestra con su hoja de estilos aplicada, sin necesidad de un servidor local

#### Scenario: Ausencia de dependencias de red

- **WHEN** se inspecciona la carga de recursos de cualquier vista
- **THEN** no hay peticiones de red, ni bibliotecas, ni tipografías descargadas, ni herramientas de compilación implicadas
