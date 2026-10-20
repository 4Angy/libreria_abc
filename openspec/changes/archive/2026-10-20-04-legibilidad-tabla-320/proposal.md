# Proposal — Change 04: Legibilidad de la tabla del catálogo a 320 px

## Why

La revisión visual del 20/10/2026 (la única que quedaba pendiente, T-33 del Change 02) encontró un defecto real: a 320 px las seis columnas de la tabla del catálogo parten su contenido. El ISBN aparece como «97803 / 07474 / 728» y el precio como «$ / 24.500,00».

La causa está medida: la tabla declara `min-width: 560px`, así que sus seis columnas se reparten en 75–110 px, y el `overflow-wrap: anywhere` que el SPEC exige para textos largos termina partiendo también los valores que no admiten cortes.

El ejercicio 2 vale 20 puntos y dentro de ellos hay 8 de «adaptación», con el requisito explícito de que a 320 px los textos «resultan legibles». Partir un ISBN por la mitad no es legible.

## What changes

- La tabla del catálogo pasa a declarar un ancho mínimo suficiente para que sus columnas conserven legibilidad.
- Los valores que no admiten cortes (ISBN e importe) se marcan con una clase y se muestran siempre en una sola línea.
- La regla `overflow-wrap: anywhere` se mantiene como red de seguridad para títulos o correos realmente largos.

## Scope

**Incluido:** la regla de ancho mínimo de la tabla, la clase `celda-atomica` y su aplicación a las celdas de ISBN e importe del catálogo, y la verificación asociada.

**Excluido:** cualquier otro cambio de estilo, el layout de las otras tablas (siguen vacías hasta los Ejercicios 4 y 5), el resto del CSS, y el HTML de las cinco vistas.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `presentacion-css`: se aclara el requirement «Tablas con desplazamiento propio» para que el ancho mínimo de la tabla sea el necesario para la legibilidad de sus columnas y para que los valores que no admiten cortes no se partan.

## Impact

- `css/estilos.css`: ancho mínimo de `.tabla` y una regla nueva para `.celda-atomica`.
- `js/catalogo.js`: las celdas de ISBN e importe se marcan con esa clase.
- `openspec/specs/presentacion-css/spec.md`: un requirement aclarado.
- Sin cambios en los cinco HTML, ni en `js/datos.js`, `js/datos-iniciales.js` ni `js/inicio.js`.

## Acceptance criteria

1. A 320 px, ningún valor queda partido: el ISBN y el precio se muestran en una sola línea.
2. A 320 px, ninguna palabra de una celda queda partida a la mitad.
3. La tabla sigue desplazándose dentro de su contenedor y la página no desplaza horizontalmente.
4. A 1280 px nada cambia: la tabla entra holgadamente y se ve igual que antes.
5. El `overflow-wrap: anywhere` sigue presente como red de seguridad.

## Risks

| Riesgo | Mitigación |
|---|---|
| Una tabla más ancha exige más scroll horizontal a 320 px | Es el comportamiento previsto: la tabla se desplaza dentro de su contenedor, nunca la página |
| La regla por clase no cubre las tablas que se agreguen en los Ejercicios 4 y 5 | La clase se aplica al renderizar; queda documentada en el `design.md` para los cambios siguientes |
| Romper el `overflow-wrap` y que un título enorme desborde | Se mantiene la regla; solo se exceptúan las celdas atómicas |
