# Proposal — Change 06: Venta simulada e historial

## Why

El formulario de venta es inerte: el botón «Agregar renglón» es un `type="button"` sin manejador, el botón «Registrar venta» es un `type="submit"` sin `preventDefault` —el navegador hace un `GET` nativo y recarga la página— y la vista Historial no tiene ni una etiqueta `<script>`, así que el listado de ventas queda vacío y el bloque de detalle nunca se muestra. El Ejercicio 5 es **el más pesado del parcial**: 20 de los 100 puntos, con el reparto «Composición y validaciones: 8; cálculos: 5; confirmación e historial inmutable: 7».

## What Changes

- Se compone una venta: se elige un cliente existente, se elige un libro, se escribe una cantidad y se agrega un renglón.
- Cada renglón muestra **libro, cantidad, precio unitario y subtotal**; el resumen muestra el **total**, con dos decimales y en el mismo formato de moneda que el catálogo.
- La cantidad de cada renglón se puede **editar en línea** y cada renglón se puede **quitar**, antes de confirmar.
- Agregar un libro que ya está en la venta **no crea un segundo renglón**: suma la cantidad al existente y lo informa con un mensaje visible.
- No se puede confirmar sin cliente, sin renglones o con cantidades inválidas (cero, negativa o decimal); el motivo se muestra en un mensaje junto al formulario.
- Al confirmar se registra la venta con **identificador** `vt-YYYY-NNNN`, **fecha** `YYYY-MM-DD`, cliente, renglones y total; y **el precio unitario se copia al renglón como valor histórico**, de modo que el historial no vuelve a leer el catálogo.
- El historial lista las ventas con identificador, fecha, cliente y total, y permite **consultar el detalle** de cada una con sus renglones; el bloque de detalle permanece oculto, y con sus campos vacíos, hasta que se solicita.
- Las ventas confirmadas **no se editan ni se eliminan** desde la interfaz.
- Tras confirmar, el formulario queda limpio y se muestra un mensaje de resultado.

## Capabilities

### New Capabilities

- `ventas-e-historial`: la composición de una venta simulada, sus cálculos, su confirmación con el precio congelado, y el historial consultable de las ventas registradas.

### Modified Capabilities

- Ninguna. `libreria-frontend` ya exige que cada renglón exponga «su cantidad como valor editable y una acción para quitarlo del resumen», que el bloque de detalle «permanezca oculto y sus campos no anuncien contenido inexistente», y que «los formularios de alta SHALL desactivar la validación de restricciones del navegador». `datos-catalogo` y `altas-libros-clientes` no mencionan ventas, renglones ni historial. Este change no cambia el comportamiento de ninguna spec viva: solo agrega la capacidad nueva.

## Impact

- `openspec/specs/ventas-e-historial/spec.md` — capability nueva con los requisitos del Ejercicio 5.
- `js/ventas.js` — nuevo: la venta en curso, los cálculos, la confirmación y la vista de Ventas.
- `js/historial.js` — nuevo: la vista del historial y del detalle.
- `js/datos.js` — modificado: `obtenerVentas()`, `agregarVenta()` y `generarIdVenta()`.
- `js/validaciones.js` — modificado: la regla pura que interpreta la cantidad.
- `js/inicio.js` — modificado: registra los eventos de la venta y del historial.
- `ventas.html` — modificado: `novalidate` y las etiquetas `<script>`.
- `historial.html` — modificado: las etiquetas `<script>`.
- `js/catalogo.js`, `js/altas.js`, `index.html`, `libros.html`, `clientes.html`, `css/estilos.css` y la semilla `DATOS_INICIALES` — **sin cambios**: se reutilizan `formatearPrecio()`, `crearFilaLibro()` y los dos pintores de los selectores de venta.
- `docs/06-venta-historial/SPEC.md` y `PLAN.md` — la especificación y el plan que dan origen a este change.

## Acceptance criteria

1. Una venta válida de **2 × 1500 y 1 × 2000** muestra subtotales 3000,00 y 2000,00 y total 5000,00, y queda en el historial con sus renglones.
2. No se confirma sin cliente, sin renglones, con cantidad cero, negativa o decimal.
3. Un libro repetido no crea otro renglón: el existente suma la cantidad.
4. El historial conserva precio unitario, subtotales y total aunque cambie el precio del catálogo; las ventas no se editan ni se eliminan.
5. Tras confirmar se limpia el formulario y se muestra un mensaje de resultado.
6. El bloque de detalle del historial permanece oculto y con sus campos vacíos hasta que se solicita.
7. Los datos ingresados se insertan como texto, sin interpretarlos como HTML.
8. No hay `fetch`, `localStorage`, `sessionStorage`, recursos externos ni dependencias: el proyecto sigue funcionando con `file://`.

## Risks

| Riesgo | Mitigación |
|---|---|
| Con la validación nativa activa, escribir «1.5» en la cantidad dispara el `stepMismatch` del navegador, que cancela el envío y deja al docente sin el mensaje de error | El formulario lleva `novalidate`, como ya exige la spec viva «Validaciones diferidas» |
| Que el historial vuelva a leer el precio del catálogo y los importes cambien | El renglón congelado guarda su `precioUnitario`; el historial deriva el subtotal de los valores guardados, nunca del catálogo |
| La fecha de la venta se corra un día por construirse en UTC | Se arma con las partes de la fecha **local** |
| Que «1.500» se lea como 1500 o como 1.5 | La cantidad solo admite enteros: se rechaza con un motivo que nombra la regla |
| El caso manual de la consigna usa precios de 1500 y 2000 que la semilla no tiene | Se ejecuta con **datos de prueba**, tal como la propia consigna prescribe, sin tocar la semilla |
| Que la venta en curso y las ventas confirmadas se pierdan al recargar | Es el límite del Ejercicio 5; el Ejercicio 6 lo resuelve con `localStorage` |
| Agregar las etiquetas `<script>` a `historial.html` rompa la vista | Se verifica la vista con `file://` en Edge, como en los changes anteriores |
