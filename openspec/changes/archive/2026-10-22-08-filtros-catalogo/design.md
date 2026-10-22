# Design — Change 08: Más variantes de filtro en el catálogo

## Context

El buscador del catálogo tiene **un solo campo**: una consulta de texto que se compara con el título de cada libro. La comparación ignora mayúsculas y minúsculas, busca coincidencias parciales y recorta los espacios de los extremos; con la consulta vacía se muestra el catálogo completo, y sin coincidencias aparece el mensaje de búsqueda sin resultados.

Todo eso vive en `js/catalogo.js` (`normalizarConsulta()` y `filtrarPorTitulo()`), y el markup está en `index.html`, dentro del formulario `#catalogo-form-busqueda`.

El modelo ya tiene todo lo que hace falta y no hay que tocarlo: cada libro tiene `autorIds` (una lista), `generoId`, `editorialId` y `precio`, y el conjunto local tiene las colecciones `autores`, `generos` y `editoriales` con sus nombres.

La devolución del docente pide «más variantes de filtro en el catálogo para mejorar la usabilidad». No hay ningún comportamiento roto: es una mejora posterior a la entrega.

## Goals / Non-Goals

**Goals:**

- Que se pueda buscar por **título, autor, género o editorial**, eligiendo el criterio.
- Que se pueda **acotar por precio** con un mínimo y un máximo.
- Que los filtros **se acumulen** y se puedan quitar.
- Que la búsqueda por título **no cambie** de comportamiento: sigue siendo el criterio por defecto, con las mismas reglas y los mismos estados.
- Que el filtro sea coherente con el resto de la aplicación: sus opciones salen del conjunto local.

**Non-Goals:**

- **No se agregan campos al modelo**: los libros ya traen autor, género, editorial y precio.
- **No se toca el CSS**: los controles nuevos reutilizan las clases existentes.
- **No cambia el resto de las vistas**: el filtro es del catálogo.
- **No se agregan búsquedas por texto libre en el historial ni en las ventas**.
- **No se persisten los filtros**: son estado de la vista, como la venta en curso. Queda anotado como pregunta abierta.

## Decisions

### D-A — Un selector de criterio y un campo de consulta, más un rango de precio aparte

El buscador quedaría así:

```
[ Título ▾ ]  [ consultar… ]   Precio: [ desde ] [ hasta ]   [ Quitar filtros ]
```

El selector elige **qué campo** se compara con la consulta. Los dos campos numéricos acotan el precio y **se aplican siempre**, se haya elegido criterio o no.

**Por qué así.** Una sola caja de consulta que se interpreta según el criterio evita tener un formulario con seis campos, que es lo que hace confuso un buscador. Y separar el precio tiene sentido porque no es una búsqueda de texto: es un rango.

**Alternativas consideradas.**

- *Un formulario con un campo por cada campo* (autor, género, editorial, título…): más abarrotada, y obliga a replantear cómo se combinan. Descartada.
- *Un solo campo de texto que entienda «autor:xxx»*: ingenioso, pero no es una interfaz discoverable y no se puede validar. Descartada.

### D-B — Los criterios salen del conjunto local, no de una lista fija

Las opciones del selector de criterio son los nombres de los **autores, géneros y editoriales que existen en el conjunto local**, ordenados alfabéticamente, más «Título». No hay una lista escrita a mano en el código.

**Por qué.** Es la misma regla que ya sigue el resto de la aplicación: las opciones de editorial, género y autores del formulario de libros se generan a partir del conjunto local. Un filtro con una lista fija quedaría desactualizado en cuanto el conjunto cambie.

**Consecuencia.** El selector de criterio **no es un `<select>` de opciones fijas** sino un control cuyo contenido se arma con JavaScript, como los selectores de la vista Libros.

### D-C — Un libro coincide con el filtro de autor si tiene **alguno** de sus autores

**Por qué.** Un libro puede tener varios autores (el caso de `Freakonomics`, con dos). Filtrar por uno de ellos tiene que mostrarlo: la pregunta de quien busca es «libros de este autor», no «libros de este autor y ningún otro».

### D-E — El rango de precio incluye los extremos

Un libro cuyo precio es exactamente el mínimo o exactamente el máximo **aparece**. Un rango con solo el mínimo, o solo el máximo, se interpreta como «sin límite por ese lado». Un campo de precio que no se puede interpretar como número se trata como ausente, y no deja el catálogo vacío.

### D-F — Los filtros se acumulan y hay una acción para quitarlos

Un libro aparece si cumple **todos** los filtros activos. Y hay un botón **«Quitar filtros»** que vacía la consulta, restablece el criterio a «Título» y borra el rango de precio, dejando el catálogo completo.

**Por qué la acción.** Sin ella, quien se equivoca al escribir tiene que vaciar los campos a mano, uno por uno. Es la misma lógica del mensaje de estado vacío: el catálogo tiene que poder volver a su estado inicial sin recargar.

### D-G — El filtro es estado de la vista y no se persiste

Los filtros se aplican al conjunto local en memoria, como la venta en curso: se pierden al recargar o al cambiar de vista.

**Por qué.** La consigna pide que `localStorage` conserve **libros, clientes y ventas**; el filtro no es un registro. Guardarlo agregaría una clave más, que el docente tendría que ignorar al editar el catálogo a mano, y el estado del filtro no es información que el usuario quiera conservar entre sesiones.

**Pregunta abierta** en la sección final: si alguien lo quiere, es un cambio chico, pero no entra en este change.

### D-H — Los controles nuevos reutilizan las clases existentes: **el CSS no se toca**

El selector de criterio y los dos campos de precio se markean dentro de `p.campo`, y el botón de quitar filtros con las clases `.boton` y `.boton--secundario` que ya existen. Con eso, **no hace falta ninguna regla nueva** en `css/estilos.css`.

**Por qué.** Una hoja de estilos nueva significa más superficie que revisar, y el CSS es del Ejercicio 2, a cargo de María. Reutilizar lo que hay evita tocar ese archivo y evita el riesgo de desajustar una pantalla que hoy funciona.

### D-I — Los estados que ya existen se reutilizan

El catálogo sigue alternando entre sus dos mensajes —«no hay libros» y «no se encontraron libros para la búsqueda»— y no se agrega un tercero. Un filtro que no arroja resultados muestra el mismo mensaje de búsqueda sin resultados.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| Que el filtro por precio deje el catálogo vacío ante un valor mal escrito | Un valor que no se puede interpretar como número se trata como ausente (D-E), y los campos numéricos rechazan el texto no numérico |
| Que el filtro por autor dé un resultado ambiguo con varios autores | Se documenta la regla: coincide con alguno de sus autores (D-C) |
| Que los controles nuevos no entren bien en la barra de búsqueda a 320 px | Se reutiliza `.campo--busqueda`, que ya está pensada para la barra; y la comprobación de anchos del Change 07 se vuelve a correr |
| Que el criterio elegido se pierda al cambiar de vista | Es el comportamiento esperado de un filtro de vista (D-G), y no hay estado guardado que limpiar |
| Que tocar el `index.html` afecte al Ejercicio 1, que es de María | La ejecución de este change requiere el acuerdo de las dos; está anotado en la última sección |

## Migration Plan

No hay migración: el filtro es una función nueva y el modelo no cambia.

**Rollback.** Quitar los controles del buscador y volver a la versión anterior de `filtrarPorTitulo()` deja la aplicación como estaba. La búsqueda por título original queda intacta durante todo el trabajo, así que el rollback es limpio.

## Open Questions

Ninguna que bloquee la planificación. Dos decisiones que se resuelven al ejecutar:

- **¿Qué criterios exactos entran?** La propuesta es título, autor, género y editorial. Se pueden quitar algunos, pero el conjunto propuesto ya cubre todo lo que el modelo ofrece.
- **¿Se quisiera recordar el filtro entre sesiones?** Este change lo deja sin persistir (D-G). Si se quiere, es un añadido aparte.

## Nota sobre el reparto del trabajo

`index.html` es del Ejercicio 1 y `js/catalogo.js` del Ejercicio 3, los dos a cargo de María de los Ángeles Zalazar. Este change **propone** el trabajo; la decisión de ejecutarlo y de repartirlo es de las dos integrantes.
