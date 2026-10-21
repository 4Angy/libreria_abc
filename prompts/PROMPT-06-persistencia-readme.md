# Prompt — Change 06: Persistencia, verificación y documentación (Ejercicio 6 · 10 puntos)

---

## Rol

Actuá como desarrollador/a frontend web, con experiencia en `localStorage`, verificación manual reproducible y documentación técnica, y responsabilidad sobre la persistencia de libros, clientes y ventas, el registro de casos manuales y el README de entrega.

## Metodología

- Metodología a utilizar: desarrollo guiado por especificación (SPEC → PLAN → IMPLEMENTACIÓN), un change por ejercicio del parcial.
- Herramientas y convenciones: {{DATO_PENDIENTE: herramientas autorizadas (editor, navegador y sus herramientas de desarrollo para inspeccionar `localStorage`)}}. Convenciones: JavaScript nativo, README en Markdown, nombres comprensibles.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN).
- Propósito y usuarios: conservar datos entre recargas y documentar la entrega; evaluado por el docente (Prof. Matías Torres).
- Ubicación o repositorio: {{DATO_PENDIENTE: ruta de la carpeta del proyecto}}.
- Estado actual verificado: {{DATO_PENDIENTE: inspeccionar en la Fase 1; se espera funcionalidad de los Changes 01 a 05, pero no debe asumirse}}.
- Fuentes de requisitos: consigna "Parcial 1: frontend de una librería" (PDF), Ejercicio 6, criterios de evaluación y formato de entrega.
- Tecnologías y dependencias permitidas: HTML, CSS y JavaScript nativos; `localStorage`.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs; API, base de datos, servidor; npm y herramientas de compilación.
- Punto de entrada o componente afectado: capa de datos/persistencia en JavaScript y `README.md`. {{DATO_PENDIENTE: nombres de archivos}}.
- Condiciones del entorno: apertura de `index.html` en el navegador sin servidor; capturas a 320 px y 1280 px para los casos manuales. {{DATO_PENDIENTE: navegador y versión de referencia}}.

## Alcance estricto

### Objetivo de esta entrega

Persistir libros, clientes y ventas en `localStorage` sin duplicar los datos iniciales, y entregar un README completo con casos manuales cuyos resultados reflejen lo realmente observado.

### Incluido

- Uso de `localStorage` para libros, clientes y ventas: en el primer inicio se cargan los ejemplos; al reabrir se recuperan los registros guardados sin duplicar ejemplos ni ventas.
- README con: integrantes que realizan el trabajo; pasos para abrir `index.html` sin npm; navegación entre vistas; funcionalidades implementadas y pendientes; ubicación de los datos iniciales; funcionamiento y límites de `localStorage` (depende del navegador, del perfil y de la ubicación de apertura; no comparte información entre usuarios); procedencia de imágenes ajenas, si existen.
- Registro en el README del resultado observado de los ocho casos manuales de la consigna (búsqueda; alta de libro; alta de cliente; venta inválida y duplicado; venta válida; precio histórico tras modificar el catálogo guardado en una copia de prueba; recarga; teclado y anchos 320/1280 px).
- Identificación en el README de la ubicación (clave) y estructura del catálogo guardado en `localStorage`, para reproducir la comprobación del precio histórico (guiada por el docente, en una copia del proyecto y con datos de prueba).
- Registro del comportamiento real si un caso falla o una funcionalidad queda pendiente.

### Excluido

- Pantalla para editar precios.
- Seguridad o integridad garantizada por servidor.
- Funcionalidad nueva de los ejercicios 1 a 5, salvo los ajustes mínimos necesarios para integrar la persistencia.
- Incluir dependencias instaladas o herramientas de compilación en la entrega.

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Funcional | Tras altas y una venta, al recargar se recuperan libros, clientes y ventas sin duplicar los ejemplos ni las ventas. |
| R-02 | Estructura e interfaces | Los datos de libros, clientes y ventas se guardan en `localStorage` con claves y estructura documentadas en el README. |
| R-03 | Datos y estados | En el primer inicio (sin datos guardados) se cargan los ejemplos; en inicios posteriores no se vuelven a cargar; las ventas guardadas conservan precio unitario, subtotales y total aunque cambie el precio del catálogo guardado. |
| R-04 | Calidad | Cada caso manual registra el resultado realmente observado; ningún caso no ejecutado figura como aprobado; los fallos y pendientes se registran con su comportamiento real. |
| R-05 | Compatibilidad | Funciona al abrir `index.html` sin npm ni servidor; el README advierte los límites de `localStorage` por navegador, perfil y ubicación de apertura. |
| R-06 | Convenciones | `README.md` en la raíz con todas las secciones exigidas por el formato de entrega; entrega sin dependencias instaladas ni herramientas de compilación. |

Datos de ejemplo: los casos manuales usan datos ficticios (por ejemplo, la venta 2 × 1500 y 1 × 2000); identificalos como ejemplos. {{DATO_PENDIENTE: nombres de los integrantes del trabajo}}.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `docs/06-persistencia-readme/SPEC.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance.
6. Estados y manejo de errores aplicables.
7. Restricciones técnicas y convenciones que condicionan la solución.
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Decisiones que requieren mi respuesta: nombres de las claves de `localStorage`, nombres de los integrantes para el README y quién ejecutará los casos manuales en el navegador (si no podés ejecutarlos, los resultados deben quedar como pendientes). Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `docs/06-persistencia-readme/PLAN.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá JavaScript nativo legible, funciones acotadas (cargar, guardar, inicializar) y README claro en Markdown.
- Respetá la política de comprobaciones: {{DATO_PENDIENTE: no se definió TDD; ejecución manual de los casos de la consigna y registro del resultado observado}}.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá `README.md` y los archivos de persistencia en {{DATO_PENDIENTE: ubicación dentro del proyecto}} junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

- [ ] CA-01 — Primer inicio: se cargan los ejemplos; recarga posterior: se recuperan los datos sin duplicar ejemplos ni ventas (R-01, R-03).
- [ ] CA-02 — Las claves y la estructura de `localStorage` están identificadas en el README y permiten reproducir la comprobación del precio histórico (R-02).
- [ ] CA-03 — La venta confirmada conserva precio unitario, subtotales y total tras modificar el precio del catálogo guardado y recargar (R-03).
- [ ] CA-04 — El README contiene todas las secciones exigidas y los resultados observados de los casos manuales, con fallos y pendientes registrados tal cual (R-04, R-06).
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
