# Prompt — Change 04: Alta de libros y clientes (Ejercicio 4 · 15 puntos)

---

## Rol

Actuá como desarrollador/a frontend web, con experiencia en formularios, validación de entradas en JavaScript nativo y actualización dinámica del DOM, y responsabilidad sobre las altas de libros y clientes con sus validaciones.

## Metodología

- Metodología a utilizar: desarrollo guiado por especificación (SPEC → PLAN → IMPLEMENTACIÓN), un change por ejercicio del parcial.
- Herramientas y convenciones: {{DATO_PENDIENTE: herramientas autorizadas (editor, navegador, consola)}}. Convenciones: JavaScript nativo, funciones acotadas (validar, normalizar, agregar, renderizar), nombres comprensibles.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN).
- Propósito y usuarios: registrar libros y clientes en datos locales simulados en el navegador; evaluado por el docente (Prof. Matías Torres).
- Ubicación o repositorio: {{DATO_PENDIENTE: ruta de la carpeta del proyecto}}.
- Estado actual verificado: {{DATO_PENDIENTE: inspeccionar en la Fase 1; se esperan la estructura HTML (Change 01) y los datos locales (Change 03), pero no debe asumirse}}.
- Fuentes de requisitos: consigna "Parcial 1: frontend de una librería" (PDF), Ejercicio 4 y criterios de evaluación.
- Tecnologías y dependencias permitidas: HTML, CSS y JavaScript nativos.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs; `fetch`, API, servidor; `localStorage` (reservado al Ejercicio 6); npm y herramientas de compilación.
- Punto de entrada o componente afectado: formularios y listados de las vistas Libros y Clientes, y las listas de opciones relacionadas. {{DATO_PENDIENTE: nombres de archivos JS}}.
- Condiciones del entorno: apertura de `index.html` en el navegador sin servidor. {{DATO_PENDIENTE: navegador y versión de referencia}}.

## Alcance estricto

### Objetivo de esta entrega

Permitir registrar libros y clientes con validaciones completas, mostrando errores cerca del formulario y actualizando listados y opciones sin recargar la página.

### Incluido

- Formulario de libros: título, ISBN, precio, editorial y género (selectores) y autores (selector múltiple o controles equivalentes), con opciones generadas desde los datos locales; el género incluye «Sin clasificar».
- Validaciones de libro: título e ISBN no vacíos; ISBN inexistente en el conjunto local (comparado sin espacios ni guiones); precio numérico y mayor que cero; editorial y autores existentes; al menos un autor; género opcional pero existente si se asigna. Sin dígito de control.
- Formulario de clientes: nombre completo y email (sin campo de apellido separado), con validaciones: no vacíos, formato de email válido, email no repetido (sin espacios exteriores y sin distinguir mayúsculas).
- Envío controlado con `preventDefault`; errores cerca del formulario; el registro se agrega solo si todo pasa.
- Tras un alta correcta, actualización del listado y de las opciones relacionadas sin recargar.

### Excluido

- Edición y eliminación de registros.
- Altas, bajas y modificaciones de editoriales, géneros o autores.
- Dígito de control del ISBN.
- Ventas (Ejercicio 5) y persistencia en `localStorage` (Ejercicio 6).

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Funcional | Un libro o cliente válido se agrega y aparece en su listado (y, para libros, en el catálogo y en la selección de venta; para clientes, en la selección de venta). |
| R-02 | Estructura e interfaces | Los selectores de editorial, género y autores se generan desde los datos locales; el género incluye «Sin clasificar». |
| R-03 | Datos y estados | Se rechazan: título/ISBN vacíos, ISBN duplicado (normalizado), precio no numérico o ≤ 0, sin autor, editorial/autor/género inexistentes, nombre/email vacíos, email inválido o duplicado (sin distinguir mayúsculas). Cada rechazo muestra un mensaje de texto cerca del formulario. |
| R-04 | Calidad | Los datos ingresados se insertan como texto en el DOM; el envío usa `preventDefault`. |
| R-05 | Compatibilidad | Funciona al abrir `index.html` sin servidor, sin recargar la página tras el alta. |
| R-06 | Convenciones | Funciones acotadas y nombres comprensibles; normalización de ISBN y email en funciones reutilizables. |

Datos de ejemplo: los casos de prueba del Ejercicio 6 (ISBN existente y nuevo; email inválido, existente en mayúsculas y nuevo) sirven como escenarios; usá datos ficticios y señalalos como ejemplos.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `docs/04-altas-libros-clientes/SPEC.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance.
6. Estados y manejo de errores aplicables.
7. Restricciones técnicas y convenciones que condicionan la solución.
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Decisión que requiere mi respuesta: criterio exacto de formato de email válido y control de autores (selector múltiple o casillas). Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `docs/04-altas-libros-clientes/PLAN.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá JavaScript nativo legible, funciones acotadas y nombres comprensibles.
- Respetá la política de comprobaciones: {{DATO_PENDIENTE: no se definió TDD; verificación manual de los casos de alta de libro y de cliente del Ejercicio 6}}.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos modificados en {{DATO_PENDIENTE: ubicación dentro del proyecto}} junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

- [ ] CA-01 — Un libro válido aparece en listado, catálogo y selección de venta; un cliente válido aparece en listado y selección de venta, sin recargar (R-01, R-05).
- [ ] CA-02 — Editorial, género (con «Sin clasificar») y autores se generan desde datos locales (R-02).
- [ ] CA-03 — Cada regla de validación rechaza su caso con un mensaje de texto cerca del formulario y no agrega el registro (R-03).
- [ ] CA-04 — ISBN se compara sin espacios ni guiones y email sin espacios exteriores ni distinción de mayúsculas (R-03, R-06).
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
