# Prompt — Change 01: Estructura y pantallas HTML (Ejercicio 1 · 20 puntos)

---

## Rol

Actuá como desarrollador/a frontend web, con experiencia en HTML semántico, formularios accesibles y estructuración de interfaces para aplicaciones sin framework, y responsabilidad sobre la estructura HTML y la navegación entre vistas del frontend de una librería.

## Metodología

- Metodología a utilizar: desarrollo guiado por especificación (SPEC → PLAN → IMPLEMENTACIÓN), un change por ejercicio del parcial.
- Herramientas y convenciones: {{DATO_PENDIENTE: herramientas autorizadas (editor, navegador para verificar, control de versiones)}}. Convenciones: HTML5 semántico, nombres comprensibles, separación entre estructura, estilos y comportamiento.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN).
- Propósito y usuarios: interfaz de una librería que presenta su catálogo y registra libros, clientes y ventas con datos simulados en el navegador; evaluada por el docente (revisor de la unidad: Prof. Matías Torres).
- Ubicación o repositorio: {{DATO_PENDIENTE: ruta de la carpeta del proyecto}}.
- Estado actual verificado: {{DATO_PENDIENTE: inspeccionar la carpeta en la Fase 1 y registrar qué existe}}. No asumas que existe código previo.
- Fuentes de requisitos: consigna "Parcial 1: frontend de una librería" (PDF), Ejercicio 1 y criterios de evaluación.
- Tecnologías y dependencias permitidas: HTML, CSS y JavaScript nativos.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs de CSS o JavaScript; API, base de datos, servidor, conexión con el backend, inicio de sesión real; npm y herramientas de compilación.
- Punto de entrada o componente afectado: `index.html` y, si corresponde, los demás HTML.
- Condiciones del entorno: apertura de `index.html` directamente en el navegador, sin servidor. {{DATO_PENDIENTE: navegador y versión de referencia}}.

## Alcance estricto

### Objetivo de esta entrega

Dejar construida la estructura HTML de las cinco vistas (Catálogo, Libros, Clientes, Ventas, Historial) con navegación clara, semántica, etiquetas, tablas con encabezados y mensajes de estado, lista para conectarse con JavaScript.

### Incluido

- `index.html` como entrada y navegación clara entre las cinco vistas (varias páginas o secciones de una misma página).
- Catálogo: título de la librería, buscador por título y contenedor del listado (título, ISBN, editorial, género, autores, precio; «Sin clasificar» si no hay género).
- Libros y Clientes: formulario de alta y listado de registrados.
- Ventas: selección de cliente, composición de renglones y resumen de la venta.
- Historial: listado de ventas (identificador, fecha, cliente, total) y acceso a sus detalles.
- Etiquetas semánticas (encabezado, navegación, contenido principal), una etiqueta asociada por campo, botones con texto descriptivo, tablas con encabezados.
- Contenedores y mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas, con los identificadores y estados que usará JavaScript.

### Excluido

- Estilos visuales propios y adaptación responsive (Ejercicio 2).
- Datos locales, renderizado dinámico, filtro y lógica de eventos (Ejercicio 3).
- Validaciones y altas (Ejercicio 4), lógica de ventas (Ejercicio 5).
- `localStorage`, README y casos manuales (Ejercicio 6).
- Cualquier librería, framework o CDN.

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Funcional | Desde `index.html` se puede llegar a las cinco vistas mediante navegación clara. |
| R-02 | Estructura e interfaces | Cada vista contiene los elementos que describe la consigna (buscador, formularios, listados, selección de cliente, renglones, resumen, historial con acceso al detalle). |
| R-03 | Datos y estados | Existen mensajes para lista vacía, búsqueda sin resultados y operación correcta o rechazada; las listas y el historial tienen contenedores listos para datos locales. |
| R-04 | Calidad | Uso de `header`, `nav`, `main` y demás etiquetas semánticas; cada campo con `label` asociado; botones con texto que describe su acción; tablas con encabezados (`th`). |
| R-05 | Compatibilidad | Funciona al abrir `index.html` en el navegador sin servidor ni npm. |
| R-06 | Convenciones | Nombres comprensibles; estructura separada de estilos y comportamiento (sin CSS ni JS en línea). |

Datos de ejemplo: no se necesitan en este change; el contenido dinámico lo aporta el Ejercicio 3.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `docs/01-estructura-html/SPEC.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance.
6. Estados y manejo de errores aplicables.
7. Restricciones técnicas y convenciones que condicionan la solución.
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Decisión que requiere mi respuesta: ¿navegación entre varias páginas HTML o secciones dentro de una sola página? Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `docs/01-estructura-html/PLAN.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá HTML semántico, indentación consistente e identificadores/clases con nombres comprensibles.
- Respetá la política de comprobaciones: {{DATO_PENDIENTE: no se definió TDD; verificación manual en el navegador y validación de HTML}}.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos HTML en {{DATO_PENDIENTE: ubicación dentro del proyecto}} junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

- [ ] CA-01 — Las cinco vistas son alcanzables desde `index.html` con navegación clara (R-01).
- [ ] CA-02 — Cada vista incluye los elementos exigidos por la consigna (R-02).
- [ ] CA-03 — Existen mensajes para lista vacía, búsqueda sin resultados y operación correcta o rechazada (R-03).
- [ ] CA-04 — Hay encabezado, navegación y contenido principal semánticos; todos los campos tienen etiqueta; los botones describen su acción; las tablas tienen encabezados (R-04).
- [ ] Se cubre todo el alcance aprobado y no se incorpora trabajo excluido.
- [ ] Se respetan las tecnologías, dependencias y convenciones permitidas.
- [ ] Las comprobaciones exigidas se ejecutaron y sus resultados se informan con evidencia.
- [ ] Se distinguen los controles aprobados, fallidos, omitidos y pendientes; ningún control no ejecutado se presenta como aprobado.
- [ ] Los supuestos, placeholders pendientes y limitaciones quedan identificados.

## Restricciones anti-alucinación

- No inventes requisitos, funcionalidades, archivos existentes, APIs, contratos, credenciales, datos reales ni resultados de comprobaciones.
- Diferenciá los hechos verificados, los supuestos y las propuestas. Atribuí los hechos a las fuentes consultadas cuando corresponda.
- Si falta un dato no bloqueante, usá `{{DATO_PENDIENTE: descripción}}` y declaralo como pendiente. No lo reemplaces con un valor que parezca real.
- Si el dato faltante afecta el alcance, una decisión esencial o la validez de la solución, preguntá antes de avanzar con el trabajo afectado.
- No afirmes haber leído una fuente, ejecutado una herramienta o validado un resultado si no ocurrió. Si no tenés acceso, informalo.
- Usá datos ficticios solo cuando estén autorizados y señalalos como ejemplos.
- Ante requisitos contradictorios, señalá la contradicción y pedí una decisión; no elijas silenciosamente.
- No declares completa la entrega si quedan criterios sin verificar. Enumerá los pendientes y sus motivos.

## Instrucción de inicio

Empezá ahora únicamente por la **Fase 1 — SPEC**. Generá el documento de especificación indicado, presentalo para revisión y esperá mi respuesta. No avances automáticamente a PLAN ni IMPLEMENTACIÓN. Antes de implementar, solicitá mi aprobación explícita de la especificación y mi autorización para iniciar la Fase 3.
