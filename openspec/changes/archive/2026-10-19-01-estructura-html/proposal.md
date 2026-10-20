# Proposal

## Why

El parcial 1 de Programación III exige construir el frontend de una librería con HTML, CSS y JavaScript nativos, evaluado en seis ejercicios acumulativos. Antes de escribir estilos, datos o lógica, el Ejercicio 1 (20 puntos) exige que exista la estructura de pantallas: sin ella, los ejercicios 2 a 6 no tienen sobre qué trabajar y no hay un contrato de identificadores estable para conectar los datos locales.

Hasta ahora el proyecto solo tenía el scaffolding de OpenSpec y las consignas; no existía ningún archivo HTML de producto.

## What Changes

- Se crean las cinco vistas del sistema en la raíz del proyecto: `index.html` (Catálogo), `libros.html`, `clientes.html`, `ventas.html` e `historial.html`, con navegación clara entre ellas.
- Cada vista incorpora los elementos que pide la consigna: buscador de catálogo con listado, alta y listado de libros, alta y listado de clientes, composición de venta con resumen, y listado de ventas con acceso al detalle.
- Se agrega estructura semántica (`header`, `nav`, `main`, `section`, `fieldset`, tablas con `caption` y `th`), etiqueta asociada por campo, botones con texto descriptivo y contenedores de estado ocultos.
- Se define un contrato estable de identificadores para que los ejercicios 3 a 6 conecten datos y comportamiento sin reestructurar el HTML.
- **No** se incluye CSS, JavaScript, datos, validaciones ni persistencia: pertenecen a los ejercicios 2 a 6.

## Capabilities

### New Capabilities

- `libreria-frontend`: estructura HTML de las cinco vistas del frontend de la librería, su navegación, sus formularios y listados, los contenedores de estado y el contrato de identificadores que consumen los ejercicios posteriores.

### Modified Capabilities

- Ninguna. No existían especificaciones previas en `openspec/specs/`.

## Impact

- **Archivos nuevos**: `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` (raíz del proyecto).
- **Documentación del parcial**: `docs/01-estructura-html/SPEC.md` (especificación detallada) y `docs/01-estructura-html/PLAN.md` (plan de tareas).
- **Sin cambios** en `openspec/`, `.opencode/`, `.agents/` ni en la configuración del proyecto.
- **Sin dependencias**: HTML5 nativo, sin librerías, frameworks, CDNs, npm ni servidor.
