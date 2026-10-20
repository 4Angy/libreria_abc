# Spec Delta

## MODIFIED Requirements

### Requirement: Tablas con desplazamiento propio

El sistema SHALL envolver cada tabla de la interfaz en un contenedor con desplazamiento horizontal propio, de modo que una tabla más ancha que el espacio disponible se desplace dentro de su contenedor y nunca desplace la página completa. La tabla SHALL declarar un ancho mínimo suficiente para que el contenido de sus columnas se lea sin partir palabras, y los valores que no admiten cortes —como el ISBN y el importe— SHALL permanecer en una sola línea.

#### Scenario: Tabla más ancha que su contenedor

- **WHEN** una tabla no entra en el ancho disponible
- **THEN** su contenedor ofrece desplazamiento horizontal y el ancho del documento no cambia

#### Scenario: Tabla que entra en el ancho disponible

- **WHEN** la tabla entra holgadamente en el ancho disponible
- **THEN** no aparece ninguna barra de desplazamiento horizontal en su contenedor y las columnas se reparten con legibilidad

#### Scenario: Contenedor de tabla acotado

- **WHEN** se inspecciona el estilo del contenedor de una tabla
- **THEN** su ancho máximo está limitado al de su bloque padre, de modo que no pueda ensanchar la página

#### Scenario: Valores que no se parten en varias líneas

- **WHEN** se lee una celda con un ISBN o con un importe
- **THEN** el valor se muestra completo en una sola línea, sin partirse

#### Scenario: Columnas legibles en una ventana angosta

- **WHEN** se abre una tabla en una ventana de 320 px
- **THEN** ninguna palabra de una celda queda partida a la mitad y cada columna tiene el ancho suficiente para su contenido
