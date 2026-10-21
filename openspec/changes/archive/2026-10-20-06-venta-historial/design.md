# Design — Change 06: Venta simulada e historial

## Context

El HTML de las dos vistas ya está completo desde el Change 01 y es **más rico de lo que suponía el enunciado**: `ventas.html` tiene el formulario con sus dos selectores, el campo de cantidad, la acción de agregar renglón, la tabla de resumen con las columnas *Libro · Cantidad · Precio unitario · Subtotal · Acciones*, el total y la acción de registrar; y `historial.html` tiene el listado de ventas con una columna de *Acciones* y un bloque de detalle **oculto** con sus datos y su tabla de renglones.

El Change 05 ya **`js/altas.js`** puebla los dos selectores de la vista Ventas desde el conjunto local, así que el punto de partida es mejor que una pantalla en blanco: falta el comportamiento, no la estructura.

Dos specs vivas gobiernan este ejercicio y **ninguna hay que modificarla**:

- `libreria-frontend` → «Composición de una venta»: «cada renglón expone **su cantidad como valor editable** y una acción para quitarlo del resumen».
- `libreria-frontend` → «Validaciones diferidas»: «Los formularios de alta **SHALL** desactivar la validación de restricciones del navegador».

Y hay un dato del modelo que conviene no redescubrir: **la forma de la venta ya está diseñada en la semilla**. `{ id, fecha, clienteId, clienteNombre, renglones[{ libroId, titulo, cantidad, precioUnitario }], total }`. Tres cosas se deducen de ahí y condicionan el diseño: el renglón **no guarda el subtotal**, la venta **guarda el total**, y existen **copias descriptivas** del nombre del cliente y del título de cada libro.

La consigna (p. 4) pide que «el precio unitario se copia al renglón como valor histórico, de modo que no se obtiene nuevamente desde el precio actual del catálogo al consultar el historial». Esa es la línea que separa este ejercicio del anterior, y de ella sale casi todo el diseño.

## Goals / Non-Goals

**Goals:**

- Que la venta se componga, se modifique y se confirme con una sola validación de entrada, la cantidad.
- Que el precio unitario quede **congelado** en el momento de la confirmación, y que el historial sea immune a los cambios del catálogo.
- Que el código que calcula importes y el que dibuja el DOM estén separados, como en el Change 05.
- Que el HTML y el CSS archivados no se toquen.

**Non-Goals:**

- Persistir la venta en curso o las ventas confirmadas. Es el Ejercicio 6, y el diseño deja el punto de conexión listo.
- Cualquier forma de edición de una venta confirmada.
- Reorganizar el código ya verificado: `js/altas.js` y `js/catalogo.js` se reutilizan tal cual.

## Decisions

### D-A — Dos módulos nuevos, uno por documento

`js/ventas.js` para la vista Ventas y `js/historial.js` para la vista Historial. Cada archivo carga en una página distinta, igual que `js/catalogo.js` (Catálogo) y `js/altas.js` (Libros y Clientes) están separados por responsabilidad.

**Alternativa descartada:** un solo `js/ventas.js` con las dos vistas, más corto de escribir. Pero `historial.html` tendría que cargar un módulo con código de venta que no usa, y cualquier cambio en la venta tocaría el archivo del historial.

### D-B — La venta en curso vive en `js/ventas.js`, no en `estado`

`estado` es el modelo de la aplicación: libros, clientes y ventas confirmadas. La venta que se está componiendo no es un registro: es el estado de un formulario. Vive en una variable del módulo y se pierde al recargar, que es el comportamiento correcto sin persistencia.

**Alternativa descartada:** `estado.ventaEnCurso`. Mezclaría el modelo con el estado transitorio y obligaría a `iniciarDatos()` a decidir qué hacer con esa parte.

### D-C — El precio se copia al confirmar, no al agregar

Mientras se compone, el renglón muestra el **precio vigente** del catálogo —que es lo que el vendedor espera ver— y al confirmar se congela el valor. La consigna lo dice en la misma frase que el registro de la venta: «Al confirmar, se registra un identificador, fecha, cliente, renglones y total. El precio unitario se copia al renglón como valor histórico».

**Alternativa descartada:** copiar el precio al agregar el renglón. Habría que guardarlo en la venta en curso, y si el catálogo cambiara antes de confirmar, la venta registraría un precio viejo: el cliente pagaría un precio que ya no es el del catálogo.

### D-D — El renglón en curso guarda solo `{ libroId, cantidad }`

El título y el precio se leen del catálogo cada vez que se dibuja el resumen. Así el renglón en curso es mínimo y el resumen muestra siempre el precio vigente.

**Alternativa descartada:** guardar el título y el precio en el renglón en curso. Duplicaría el estado y haría que el resumen mostrara un precio viejo sin avisar.

### D-E — El renglón congelado no guarda el subtotal

El subtotal se deriva como `cantidad × precioUnitario` a partir de los dos valores guardados. Es la forma de la semilla y tiene una ventaja concreta: **el detalle no puede desincronizarse del total**, porque ninguno de los dos se guarda.

**Alternativa descartada:** guardar el subtotal en el renglón. Habría que mantenerlo coherente con el total, y cualquier cambio de precio entre la congelación y la lectura rompería esa coherencia.

### D-F — La cantidad se edita con un `<input type="number">` dentro de la celda

La celda de Cantidad de cada fila contiene un control editable, y la celda de Acciones lleva la acción de quitar. La spec viva ya lo exige así.

El `<input>` se crea **dentro de una `td`**, fuera de cualquier `.campo`, así que **no** recibe `width: 100%`, `padding` ni `border` de `.campo input`: un campo de formulario dentro de una celda se vería desproporcionado. No hace falta CSS nuevo.

**Alternativa descartada:** un botón «Cambiar cantidad» que pidiera el dato por separado. Serían dos pasos para lo más frecuente, y la spec viva no lo contempla.

### D-G — `novalidate` en el formulario de venta

Sin esto, escribir «1.5» en la cantidad dispara el `stepMismatch` del navegador, que **cancela el envío**: el `submit` no se dispara y el mensaje de error propio nunca se ve. Es el mismo motivo por el que el Change 05 lo puso en los dos formularios de alta, y la spec viva «Validaciones diferidas» ya lo exige.

**Alternativa descartada:** dejarlo activo y apoyarse en la validación del navegador. El control `type="number"` tampoco puede declarar `step`, porque la spec prohíbe los atributos de validación: sin `novalidate` no hay forma de que la aplicación vea el caso decimal.

### D-H — El identificador es `vt-YYYY-NNNN`, con la secuencia por año

`generarIdVenta(fecha)` toma el año de la fecha y el siguiente número del **máximo** de los identificadores de ese año, con cuatro dígitos. La semilla aporta `vt-2026-0001` y `vt-2026-0002`, así que la primera venta nueva es `vt-2026-0003`.

Se usa el **máximo** y no la cantidad de ventas: si una venta se borrara —que no puede pasar desde la interfaz, pero el modelo no lo prohíbe— la numeración no se repetiría.

**Alternativa descartada:** un contador global sin año. Se aparta de la convención de la semilla y mezcla años distintos en la misma serie.

### D-I — La fecha se arma con las partes de la fecha local

`nueva Date()` más `getFullYear()`, `getMonth()` y `getDate()`. **Nunca** `toISOString()`, que devuelve UTC y en Argentina podría dejar el día anterior.

**Alternativa descartada:** `toISOString().slice(0, 10)`. Es una línea, pero es una línea que puede registrar la venta del día equivocado una cantidad de días al año.

### D-J — Los importes reutilizan `formatearPrecio()`

`js/catalogo.js` ya tiene el formateador `es-AR` con dos decimales. El resumen y el historial lo usan, con lo que la aplicación tiene **una sola convención de precios**.

**Alternativa descartada:** un formateador propio en el módulo de ventas. Habría dos formatos de moneda conviviendo, y el docente vería «$ 24.500,00» en el catálogo y «43.800,00» en el historial.

### D-K — Un renglón con cantidad inválida muestra «—» y queda fuera del total

Mostrar «0» en el subtotal sería mentir. La fila inválida se reconoce en pantalla, el total excluye esa fila y la confirmación se bloquea nombrando el renglón.

**Alternativa descartada:** conservar el último subtotal válido. El total mostraría una cifra que no corresponde a la fila, y el error quedaría oculto.

### D-L — El historial se lista de la más reciente a la más antigua

La venta recién confirmada aparece arriba, que es lo que el docente quiere ver al abrir el historial. La semilla queda en orden inverso al actual, lo que no rompe ningún requisito.

**Alternativa descartada:** el orden de inserción, como en la semilla. La venta que se acaba de confirmar quedaría al final de la tabla, más abajo de un historial que ya puede tener varias filas.

### D-M — La venta en curso no se persiste

No hay `localStorage` en este ejercicio. La venta en curso y las ventas confirmadas se pierden al recargar, y eso queda declarado como comportamiento esperado, no como omisión.

**Alternativa descartada:** `sessionStorage`, que cruzaría páginas dentro de la sesión. Es persistencia, que la consigna reserva para el Ejercicio 6.

### D-N — `js/altas.js` y `js/catalogo.js` no se tocan

Los dos pintores de los selectores de venta ya viven en `js/altas.js` y `formatearPrecio()` y `crearFilaLibro()` en `js/catalogo.js`. Se reutilizan tal cual, aunque los pintores de venta ya no pertenezcan a un módulo de altas.

**Alternativa descartada:** mover los pintores de la venta a `js/ventas.js`. Sería más coherente por nombre de módulo, pero toca código ya verificado y archivado a cambio de nada observable.

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| El navegador bloquea el envío de una cantidad decimal antes de que la aplicación la vea | `novalidate` en el formulario (D-G), verificado en Chromium 152 |
| El historial vuelve a leer el precio del catálogo y los importes se desincronizan | El renglón congelado guarda su `precioUnitario` y el subtotal se deriva de los valores guardados (D-E) |
| Un identificador de venta se repite | Se usa el máximo existente del año, no la cantidad de ventas (D-H) |
| La fecha de la venta se corre un día | Se usa la fecha local, nunca UTC (D-I) |
| `type="number"` hace que «abc» y «1,5» lleguen al JavaScript como cadena vacía | Es indistinguible del vacío y la consigna no pide distinguirlo; el SPEC lo declara (E-06) |
| La venta en curso se pierde al recargar | Declarado como comportamiento del ejercicio (D-M); el Ejercicio 6 lo resuelve |
| El `<input>` de la celda queda desproporcionado | Nace fuera de `.campo`, así que no recibe los estilos de los campos de formulario (D-F) |
| Agregar `<script>` a `historial.html` rompe la vista | Se verifica la vista con `file://` en Edge, como en los changes anteriores |

## Migration Plan

No hay migración: el proyecto no tiene datos persistidos, no hay usuarios ni versiones en producción, y el estado se reconstruye desde la semilla en cada carga.

**Reversión:** este change no toca `css/estilos.css`, ni `index.html`, ni `libros.html`, ni `clientes.html`, ni `js/catalogo.js`, ni `js/altas.js`, ni la semilla. Revertirlo es borrar los dos módulos nuevos, sacar las etiquetas `<script>` de `ventas.html` y `historial.html`, quitar el `novalidate` del formulario de venta y deshacer los cambios de `js/datos.js`, `js/validaciones.js` y `js/inicio.js`.

## Open Questions

Estas tres no cambian las specs, ni el enfoque, ni el desglose de tareas: se resuelven al preparar el arnés de verificación.

| # | Pregunta | Por qué puede esperar |
|---|---|---|
| PD-01 | ¿Qué editor y qué consola de referencia autoriza el docente? | Afecta al informe de comprobaciones, no al código |
| PD-02 | ¿Se mantiene el arnés headless fuera del proyecto, como en el D-06 del SPEC-05? | Afecta al instrumental, no a la entrega |
| PD-03 | ¿Se instala Firefox para una segunda verificación? | Edge 155.0.4283.62 está disponible y cubre la verificación |

## Desvíos de la implementación

La implementación se desvió del SPEC y del PLAN en tres puntos, ninguno de los cuales cambia el comportamiento que el SPEC exige.

| # | Desvío | Por qué |
|---|---|---|
| 1 | **El escenario «la venta recién confirmada aparece en el historial» estaba mal enunciado** y se corrigió en el SPEC § 4.2 (S-16) y en la delta de `ventas-e-historial`. Decía que, al abrir el historial después de confirmar, la venta estaba en el listado. Pero el historial es **otra página**: al navegar, el documento se recarga y el estado se reconstruye desde la semilla, así que la venta recién confirmada **no** aparece. Es la misma razón por la que la consigna agenda el caso manual «el detalle conservado en el historial» para el **Ejercicio 6**, donde la persistencia ya funciona | El defecto estaba en el artefacto aprobado, no en el código. La implementación no podía cumplir un escenario que la arquitectura de páginas hace imposible. Se corrigió el enunciado y se agregó el escenario que declara la realidad: el historial de otra vista no muestra la venta recién confirmada |
| 2 | **La cantidad del renglón en curso se guarda como texto**, no como número | El SPEC § 5.4 no fija el tipo. Guardar el texto crudo es lo que permite que una cantidad editada a un valor inválido **persista** en el renglón: si se guardara el número, el estado inválido no se podría representar y la fila no podría mostrar el «—» que la decisión D-K exige. Al confirmar, el texto se convierte en entero |
| 3 | **La fila de renglón del historial se llama `crearFilaRenglonDetalle()`**, y no `crearFilaRenglon()` | El nombre `crearFilaRenglon()` ya lo usa `js/ventas.js` para la fila editable de la venta en curso. Como los dos módulos son scripts clásicos con alcance global, el mismo nombre en los dos archivos se pisaría. El SPEC § 5.3 no nombraba a esta función |

### Lo que no se desvió

- `js/catalogo.js`, `js/altas.js`, `index.html`, `libros.html`, `clientes.html`, `css/estilos.css` y la semilla `DATOS_INICIALES` **no se tocaron**: sus hashes SHA-256 son los mismos que antes del change.
- No se agregó `localStorage`, `sessionStorage`, `fetch`, `innerHTML`, manejadores en línea, recursos externos ni dependencias.
- La confirmation limpia el formulario, congela el precio y muestra el resultado tal como los especificaba el plan.

