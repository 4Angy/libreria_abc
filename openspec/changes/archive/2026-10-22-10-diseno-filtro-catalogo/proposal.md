# Proposal — Change 10: Diseño del filtro del catálogo antes de implementar

## Why

Antes de implementar los filtros del catálogo con variantes (camino del change `08-filtros-catalogo`), la exploración del 22/10/2026 detectó **dos decisiones de diseño pendientes** que el `design.md` del change anterior no había cerrado del todo, y que condicionan la forma más liviana de implementar:

1. **Estrategia de distribución de los controles del buscador.** El design propuso agregar criterio, consulta, rango de precio y acción «Quitar filtros», y afirmó que no hacía falta ninguna regla nueva de CSS porque `.campo select` ya está estilizado y `.formulario fieldset` ya existe. Sin embargo, reutilizar `p.campo--busqueda` tal cual (flex con label full-width, input flexible y botón) no está pensado para alojar un `<select>` adicional, y usar fieldset u otra reestructuración cambia el HTML de la vista del Ejercicio 1.

2. **Comportamiento del label según el criterio.** El label está estático: «Buscar por título». Con criterios dinámicos (autor, género, editorial) el texto debe acompañar al control correcto; sugiere actualizar el `textContent` vía JS sin tocar el HTML.

Resolver estas dos decisiones antes de escribir tareas de implementación evita retoques innecesarios de HTML/CSS y evita implementar la vista del buscador a ciegas.

## What Changes

- Registrar la **estrategia de layout** de los controles del buscador: reutilizar `p.campo--busqueda`, usar `.formulario fieldset` (regla existente) o reestructurar el bloque.
- Registrar el **comportamiento del label** según el criterio elegido (actualización vía JS sin cambios de HTML).
- Registrar ambas decisiones en `design.md`, con alternativas consideradas y su relación con el change `08-filtros-catalogo`.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

Ninguna. El cambio **no altera ningún comportamiento observable**: son decisiones de diseño previas a la implementación que ya lleva su propio delta en el change `08-filtros-catalogo`.

## Impact

- `index.html` — vista Catálogo: posibles cambios de marcado para la distribución de controles (a decisión de diseño).
- `css/estilos.css` — estilos del buscador (a decisión de diseño; hoy solo se usan reglas existentes).
- `js/inicio.js` / `js/catalogo.js` — eventos y filtro del buscador (sin cambios de comportamiento).
- Sin dependencias, sin recursos externos, sin cambios de datos ni de persistencia.
