# Design — Change 05: Alta de libros y clientes

## Context

El proyecto tiene cinco vistas HTML, una hoja de estilos propia y un modelo de datos local con un catálogo que se dibuja desde la semilla. La única vista con JavaScript es `index.html`. Las otras cuatro —Libros, Clientes, Ventas e Historial— no tienen ni una etiqueta `<script>`, y el HTML de las dos primeras ya trae los formularios completos con sus campos, sus selectores y sus contenedores de estado.

Tres restricciones del entorno condicionan toda la solución:

1. **Sin servidor y sin módulos ES.** Con `file://` el origen es `null` y Chrome/Edge bloquean el `import`. Los scripts son clásicos y comparten globales por responsabilidad.
2. **Sin persistencia.** `localStorage` está reservado para el Ejercicio 6. El estado vivo es una variable global del documento, así que no cruza de una página a otra.
3. **La consigna manda sobre la validación del navegador.** El p. 3 pide «se muestran errores cerca del formulario», y el p. 6 premia «código legible, nombres comprensibles, funciones acotadas y separación entre estructura, estilos y comportamiento».

A esto se suma una comprobación empírica que conviene tener presente antes de elegir el diseño: **en Chromium 152, un `input[type=email]` con un valor mal formado cancela el envío y el evento `submit` nunca se dispara** (`validity.typeMismatch = true`). Con la validación nativa activa, el mensaje de error propio que pide la consigna no llegaría a verse nunca. Y `input[type=number]` con el `step` por defecto marca `1500.50` como `stepMismatch`, con lo que un precio con centavos bloquearía el envío.

El detalle de las sondas está en el SPEC § 2.4 y el detalle de las decisiones, en el SPEC § 9.2.

## Goals / Non-Goals

**Goals:**

- Que el alta de un libro o un cliente sea una operación completa: valida, agrega y actualiza la pantalla sin recargar.
- Que toda regla de validación rechace su caso con un mensaje de texto propio, en español y junto al formulario.
- Que la lógica de validación sea legible y comprobable por separado de la manipulación del DOM.
- Que la solución no rompa ningún contrato ya archivado y no exija tocar la hoja de estilos.

**Non-Goals:**

- Que un alta hecha en una página aparezca en otra. No hay canal posible sin persistencia, y el ejercicio que la introduce es el 6.
- Validar el formato, la longitud o el dígito de control del ISBN: la consigna exonera del dígito de control y R-03 no pide lo demás.
- Marcar visualmente el campo que falló: haría falta CSS nuevo y una decisión de diseño que la consigna no pide.
- Cualquier cosa propia del Ejercicio 5: renglones, subtotales, total, confirmación e historial.

## Decisions

### D-A — Cinco páginas y un único estado; el cruce entre páginas es del Ejercicio 6

R-01 pide que el libro nuevo aparezca «en el catálogo y en la selección de venta», y que el cliente nuevo aparezca «en la selección de venta». El catálogo está en `index.html` y la selección de venta en `ventas.html`: son documentos distintos de donde se hace el alta, y `estado` es una variable global del documento. Sin `localStorage` ni servidor, **ese cruce es imposible**.

La consigna resuelve la contradicción por su propia cronología: el caso manual que exige «el válido aparece en catálogo y selección de venta» está en la p. 5, dentro del **Ejercicio 6 · Persistencia**, mientras que el Ejercicio 4 (p. 3) solo promete «el listado y las opciones relacionadas se actualizan sin recargar la página».

**Alternativas descartadas:**

| Alternativa | Por qué se descartó |
|---|---|
| Consolidar las cinco vistas en una sola página con secciones y cambio de vista por JavaScript | Cumple R-01 al pie de la letra, pero deshace el trabajo archivado de los changes 01, 03 y 04 y arriesga el CSS y la legibilidad a 320 px ya verificados. La consigna lo permite («secciones de una misma página», p. 2), pero es una reforma, no un ejercicio |
| `sessionStorage` para cruzar páginas | Funciona bajo `file://` y cumple R-01 hoy, pero es persistencia: la consigna reserva esa tarea para el Ejercicio 6 y un docente podría leerlo como adelantar ese trabajo |

**Lo que hace que la decisión no sea accidental:** `estado` queda como la única fuente de verdad y `iniciarDatos()` como el único punto que lo siembra. Todas las vistas dibujan a partir de ese mismo estado. Cuando el Ejercicio 6 cambie la *fuente* de `estado` —de la semilla al almacenamiento—, el cruce entre páginas aparece sin tocar ninguna vista. Este change entrega la mecánica; el Ejercicio 6 entrega la observación.

```
   esta entrega (Change 05)                 el Ejercicio 06
   -------------------------                 ---------------
   iniciarDatos()  <-- semilla               iniciarDatos()  <-- localStorage
          |                                          |
          v                                          v
       estado  <--------- una sola variable, la misma en todas las vistas
          |
          +--> index.html    catalogo
          +--> libros.html   listado de libros
          +--> clientes.html listado de clientes
          +--> ventas.html   seleccion de venta
```

### D-B — `novalidate` en los dos formularios

Con la validación nativa activa, un email mal formado cancela el envío y el `submit` no se dispara: el mensaje propio de la consigna no se vería. `novalidate` desactiva la validación de restricciones del navegador y deja la aplicación como única autoridad sobre los mensajes.

**Alternativas descartadas:**

| Alternativa | Por qué se descartó |
|---|---|
| Dejar la validación nativa activa | Un email inválido nunca llega al manejador; el requisito de mostrar errores cerca del formulario es inobservable |
| Escuchar el evento `invalid` y cancelarlo | Cancelarlo impide el envío igual: habría que reejecutar toda la validación desde ese manejador, con el doble de código y un flujo difícil de leer |
| Cambiar el campo a `type="text"` | `type="email"` da el teclado con arroba en el celular y no cuesta nada mantenerlo. El problema no es el tipo, es la validación activada |

El atributo va en el `<form>`, no en los controles, de modo que la spec viva «Validaciones diferidas» —que prohíbe `required`, `pattern`, `min`, `max` y `step` en los controles— sigue cumpliéndose.

### D-C — El precio pasa a `type="text"` con `inputmode="decimal"`

Con `type="number"`, el navegador descarta lo que no es un número flotante **antes** de que el JavaScript lo vea: el valor queda en `""` y `validity.badInput` sigue en `false`. Es decir, «no numérico» y «vacío» son el mismo evento para el DOM, y la regla de R-03 «precio no numérico» quedaría sin poder distinguirse.

Hay un segundo motivo, más serio: `Number("1.500")` es `1.5`. Con `type="number"` y una lectura permisiva, un libro de $1500 se registraría en silencio como $1.50.

**Alternativas descartadas:**

| Alternativa | Por qué se descartó |
|---|---|
| `type="number"` con `step="any"` | Sigue sin distinguir «no numérico» de «vacío», y no arregla el separador de miles |
| `type="number"` con `step="0.01"` | Acepta centavos, pero el `step` sigue siendo del navegador y el sanitizado de la coma decimal no se resuelve |
| Mantener `type="number"` y tratar «vacío» y «no numérico» como el mismo caso | Cumple la consigna en sustancia, pero deja sin cobertura una regla que R-03 enumera explícitamente |

`type="text"` con `inputmode="decimal"` conserva el teclado numérico en el celular, conserva el estilo visual (`.campo input` se aplica igual) y deja el texto crudo en manos de la aplicación.

### D-D — El precio admite un entero, o un entero con una parte decimal de una o dos cifras, separada por punto o por coma

La forma aceptada es `^-?\d+(?:[.,]\d{1,2})?$`. El separador de miles se **rechaza**, y no por descuido: la app muestra los precios en `es-AR` («$ 1.500,00»), así que es natural que alguien escriba «1.500»; pero `Number("1.500")` es `1.5`, y aceptarlo en silencio convertiría un error de tipeo en un precio engañoso. Rechazarlo con un mensaje que declara el formato esperado es un fallo visible y recuperable.

El tope de dos decimales es lo que produce ese rechazo: un precio en pesos tiene como máximo centavos, y `1.500` tiene tres cifras decimales. El signo negativo sí se admite, para que un precio negativo caiga en la regla de «mayor que cero» y no en la de «no es un número».

**Alternativa descartada:** admitir el separador de miles con una regla del tipo `^\d{1,3}(?:\.\d{3})+$`. Es ambigua: «1.500» podría ser mil quinientos o uno con medio. Se descartó por ambigua, no por incorrecta.

### D-E — `js/validaciones.js` separado de `js/altas.js`

Son las dos caras de la consigna: *«Se comprueba que…»* (regla) y *«se muestran errores cerca del formulario»* (presentación). Separarlas deja las reglas como funciones puras —sin `document`, sin estado— que se pueden ejercitar sin navegador, y deja `js/altas.js` con una sola preocupación.

**Alternativa descartada:** un único archivo con las reglas y el DOM mezclados. Es el camino corto, pero mezcla dos responsabilidades que la consigna separa explícitamente, y hace que las reglas no se puedan leer sin imaginarse el DOM.

**Dirección de las dependencias.** `js/validaciones.js` no depende de nada: son funciones puras. `js/datos.js` la usa para sus propias comparaciones —`existeIsbn()` normaliza con `normalizarIsbn()` y `existeEmail()` con `normalizarEmail()`, en lugar de duplicar la normalización, que R-06 exige que sea reutilizable—, de modo que el grafo queda acíclico y en un solo sentido:

```
   validaciones.js  <----  datos.js  <----  catalogo.js  <----  altas.js  <----  inicio.js
```

El orden de carga de los `<script>` no importa para estas llamadas: todas ocurren en tiempo de ejecución, cuando los seis archivos ya están cargados.

### D-F — El listado de libros reutiliza la fila del catálogo

`libros.html` declara las mismas seis columnas que el catálogo, y `crearFilaLibro()` ya construye exactamente esa fila. `js/altas.js` la reutiliza y **`js/catalogo.js` no se modifica en absoluto**. No hay una sola línea duplicada.

**Alternativa descartada:** escribir un segundo constructor de fila para el listado de libros. Habría que mantener dos copias de la misma forma de fila, con el riesgo de que se desincronicen.

### D-G — `js/inicio.js` detecta la vista por presencia de elementos

Un solo punto de arranque para las cuatro páginas: comprueba qué contenedores existen y conecta solo eso. Se descartó la alternativa de un archivo de arranque por vista (`inicio-libros.js`, `inicio-clientes.js`, …): serían cuatro archivos casi idénticos, y el orden de los `<script>` se repetiría cuatro veces con el riesgo de que se desincronicen.

### D-H — El mismo bloque de `<script>` en las cuatro páginas

```
   datos-iniciales.js  ->  datos.js  ->  validaciones.js  ->  catalogo.js  ->  altas.js  ->  inicio.js
```

Es el mismo orden en todas partes, con una sola lista mental. `datos-iniciales.js` va primero porque es la semilla. `catalogo.js` se carga también en las vistas que no muestran el catálogo porque `altas.js` necesita de él la fila de libro y el formateador de precio.

**Alternativa descartada:** cargar en cada página solo los scripts que usa. Es más prolijo en apariencia, pero `clientes.html` no usa `catalogo.js` y `ventas.html` no usa `validaciones.js`, así que la lista se vuelve asimétrica y el orden deja de ser obviousio de un vistazo.

### D-I — Todos los motivos en un solo párrafo, con las frases del Change 01 adelante

El HTML ya trae `p#libros-mensaje-error` («No se pudo registrar el libro.») y `p#clientes-mensaje-error`. Esas frases se conservan y los motivos concretos se agregan detrás. Un párrafo no puede contener legalmente una lista, así que los motivos se unen como prosa, cada uno una oración completa.

Se informan **todas** las reglas incumplidas, no solo la primera: quien equivoca tres campos ve los tres motivos de una vez.

**Alternativa descartada:** un mensaje por campo, con un contenedor junto a cada control. Es mejor de leer, pero el HTML no tiene esos contenedores y crearlos exigiría CSS nuevo para distinguirlos del resto.

### D-J — `form.reset()` tras un alta correcta

Evita que un segundo envío por inercia duplique el registro, y `reset()` devuelve los selectores a su estado inicial: «Seleccioná una editorial», «Sin clasificar» y ninguna opción de autor marcada, porque las opciones las genera el JavaScript sin atributo `selected`.

### D-K — Identificadores legibles con guion

La convención del Change 03 es `li-cien-anos-de-soledad`, `au-tolkien`, `cl-martina-ferreyra`. El identificador nuevo es el prefijo más el texto convertido en *slug*, con un sufijo numérico si ya existe. «Cien años de soledad» produce `li-cien-anos-de-soledad`, idéntico al de la semilla. Se descartó el identificador por marca de tiempo: no es legible y rompe la convención.

### D-L — El delta de `libreria-frontend` corrige una spec que quedó desactualizada

Al revisar las specs vivas antes de redactar la propuesta apareció una inconsistencia **preexistente**: el Change 03 declaró «Ninguna» capability modificada, pero `index.html` enlaza cuatro scripts desde ese change, y la spec viva todavía dice que el marcado «NO SHALL incluir … scripts». La misma spec exige que los selectores de editorial, género y autores «no contengan opciones de datos», cuando la consigna exige lo contrario desde el Ejercicio 3.

Este change no puede dejar esa contradicción viva: agregaría `<script>` a tres vistas más y llenaría esos selectores con opciones. El delta modifica los tres requisitos afectados y les pone un escenario que describe el comportamiento real.

**Alternativa descartada:** declarar la capability como no modificada, como hizo el Change 03. Habría dejado la spec mintiendo sobre el código, y el error se habría acumulado.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| Un email mal formado nunca llega al manejador si queda activa la validación nativa | `novalidate` en los dos formularios; verificado en Chromium 152 que con `novalidate` el `submit` se dispara |
| Un precio con centavos queda bloqueado por el `step` por defecto de `type="number"` | El campo pasa a `type="text"`; la aplicación valida el formato |
| Un precio escrito con separador de miles se convierte en un valor cien veces menor | El formato admitido rechaza el separador de miles, con un mensaje que declara el formato esperado |
| El estado no cruza páginas: un alta de `libros.html` no aparece en `index.html` | Aceptado y declarado. El Ejercicio 6 cambia la fuente del estado y el cruce aparece sin tocar las vistas |
| La spec viva `libreria-frontend` contradice la implementación desde el Change 03 | El delta de este change la pone al día en los tres requisitos afectados |
| El selector múltiple de autores no es obvio para quien no lo conoce | Se conserva el control que ya traía el Change 01 y se le agrega una nota de uso visible |
| Varias reglas pueden fallar a la vez y el mensaje puede quedar largo | Se informan todos los motivos, pero cada uno es una oración breve; el mensaje se muestra en un párrafo con la misma tipografía del resto de la interfaz |
| La verificación depende de un navegador concreto | La comprobación final se hace en Edge 155.0.4283.62 con `file://`; Firefox ya no está instalado y queda como verificación pendiente declarada |

## Migration Plan

No hay migración: el proyecto no tiene datos persistidos, no hay usuarios ni versiones en producción, y el estado se reconstruye desde la semilla en cada carga.

**Reversión:** este change no toca `css/estilos.css`, ni `index.html`, ni `historial.html`, ni `js/catalogo.js`. Revertirlo es sacar los `<script>` de los tres HTML modificados y restaurar los dos archivos JavaScript tocados.

## Open Questions

Estas tres no cambian las specs, ni el enfoque, ni el desglose de tareas: se resuelven al preparar el arnés de verificación.

| # | Pregunta | Por qué puede esperar |
|---|---|---|
| PD-01 | ¿Qué editor y qué consola de referencia autoriza el docente? | Afecta al informe de comprobaciones, no al código |
| PD-02 | ¿Se mantiene el arnés headless fuera del proyecto, como en el D-06 del SPEC-03? | Afecta al instrumental, no a la entrega |
| PD-03 | ¿Se instala Firefox para una segunda verificación? | Edge 155.0.4283.62 está disponible y cubre la verificación |

## Desvíos de la implementación

La implementación se desvió del SPEC y del design en siete puntos, ninguno de los cuales cambia el comportamiento observable que el SPEC exige. Quedan anotados con su razón, como pide el PLAN (T-35).

| # | Desvío | Por qué |
|---|---|---|
| 1 | **La expresión regular del precio era incorrecta en el SPEC.** Se documentaba `^\d+(?:[.,]\d+)?$`, que **acepta** `1.500`: el `\d+` inicial toma el `1` y el grupo `[.,]\d+` toma el `.500`. Es decir, la expresión no cumplía su propia regla de rechazar el separador de miles, ni el caso límite E-09 (`1500.555`). Se implementó `^-?\d+(?:[.,]\d{1,2})?$`: el tope de dos decimales es lo que rechaza `1.500` y `1500.555` —un precio en pesos tiene como máximo centavos— y el signo admitido hace que un precio negativo caiga en la regla de «mayor que cero» y no en la de «no es un número». **El SPEC § 5.5 y la decisión D-05 se corrigieron.** El comportamiento observable no cambia: `1.500` y `1500.555` se rechazan, como el SPEC ya exigía | El bug estaba en el artefacto aprobado, no en el código. Lo detectó el script de verificación de T-07 antes de escribir la implementación |
| 2 | **`existeIsbn()` y `existeEmail()` no viven en `js/datos.js`** sino en `js/validaciones.js`, y reciben la colección: `existeIsbnEn(libros, isbn)` y `existeEmailEn(clientes, email)`. El SPEC § 5.3 las preveía en el modelo | Para que `js/validaciones.js` siga sin depender de nada y el grafo siga acíclico, y para no duplicar la regla de comparación en dos módulos. La regla vive donde está la normalización que usa |
| 3 | **`validarLibro()` y `validarCliente()` reciben un segundo parámetro**, `contexto`, con las colecciones contra las que se compara | El SPEC § 5.3 las describía como `validarLibro(datos)`. Con el contexto, el módulo de reglas sigue siendo puro y se puede ejercitar con Node pasándole arrays a mano, sin cargar el modelo |
| 4 | **Se agregó `obtenerContextoDeAltas()` a `js/datos.js`** y `leerPrecio()` a `js/validaciones.js` | `obtenerContextoDeAltas()` entrega las cinco colecciones de una vez; `leerPrecio()` separa el análisis del texto de precio de la validación que lo usa |
| 5 | **El bloque de `<script>` se aplicó a tres vistas, no a cuatro.** `index.html` conserva sus cuatro scripts | El SPEC § 5.1 y la tarea T-33 exigen que `index.html` no cambie, y la vista Catálogo no necesita el módulo de altas. La decisión D-H decía «las cuatro páginas»; se corrige a «las tres vistas que este change modifica» |
| 6 | **El texto base de los mensajes se captura al cargar el script**, no en el primer uso | La primera versión lo capturaba en el primer uso: si algo vaciaba el mensaje antes, la frase original del Change 01 se perdía y quedaba « Se registró el libro…» en lugar de «Operación realizada correctamente. Se registró el libro…». Capturarlo al cargar lo hace inmune a eso |
| 7 | **El mensaje de precio no numérico aclara el formato**: «El precio debe ser un número, por ejemplo 1500 o 1500.50, sin separador de miles.» | El SPEC no fija los textos de los mensajes. La aclaración evita que quien escribió `1.500` repita el mismo error |

### Lo que no se desvió

- `js/catalogo.js` **no se tocó**: su `crearFilaLibro()` ya servía para las dos tablas de libros, como decide D-F.
- `index.html`, `historial.html` y `js/datos-iniciales.js` **no se tocaron**: sus hashes SHA-256 son los mismos que antes del change.
- No se agregó `localStorage`, `sessionStorage`, `fetch`, `innerHTML`, manejadores en línea, recursos externos ni dependencias.

## Addendum posterior al archivado (20/10/2026)

Este change se archivó con 37 de 37 tareas cerradas. Después del archivado, la **revisión visual** —que ninguna comprobación automática hace— encontró un defecto de presentación que la implementación había dejado pasar:

| # | Desvío | Por qué |
|---|---|---|
| 8 | **`css/estilos.css` sí necesitó un cambio.** La nota de uso del selector de autores, un `<small>` dentro del `.campo`, quedaba en la **columna de la etiqueta** y no debajo del control. A partir de 640 px, `.campo` es una grilla de dos columnas —`minmax(10rem, 16rem) minmax(0, 1fr)`— y el elemento tercero cae en la primera pista, de 10 rem: la nota se partía en tres líneas y quedaba descolgada del control al que se refiere. La corrección es una regla de tres líneas, `.campo small { grid-column: 1 / -1; }`, que la hace ocupar todo el ancho del campo y quedar bajo el control | El SPEC § 5.7 afirmaba que no hacía falta tocar el CSS, y la afirmación era falsa. Un texto puede ser perfectamente legible y aun así estar mal colocado: ninguna comprobación automática lo detecta, porque el texto no se corta ni se pierde. El selector `.campo small` no existe en ninguna otra vista, así que los otros cuatro HTML no se ven afectados |

La corrección quedó registrada en el SPEC § 5.7 y en el PLAN § 6.6, y el hash de `css/estilos.css` cambió a propósito: los cuatro archivos que sí debían quedar intactos —`index.html`, `historial.html`, `js/catalogo.js` y `js/datos-iniciales.js`— mantienen su hash original.


