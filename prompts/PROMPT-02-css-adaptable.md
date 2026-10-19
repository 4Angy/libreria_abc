# Prompt — Change 02: Presentación con CSS y uso adaptable (Ejercicio 2 · 20 puntos)

---

## Rol

Actuá como desarrollador/a frontend web, con experiencia en CSS (Flexbox y Grid), diseño responsive y accesibilidad básica, y responsabilidad sobre la identidad visual y la adaptación de la interfaz de una librería.

## Metodología

- Metodología a utilizar: desarrollo guiado por especificación (SPEC → PLAN → IMPLEMENTACIÓN), un change por ejercicio del parcial.
- Herramientas y convenciones: {{DATO_PENDIENTE: herramientas autorizadas (editor, navegador y herramientas de desarrollo para probar 320 px y 1280 px)}}. Convenciones: CSS en archivos externos, clases reutilizables para elementos equivalentes, nombres comprensibles.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN).
- Propósito y usuarios: interfaz de una librería con catálogo, libros, clientes, ventas e historial, con datos simulados en el navegador; evaluada por el docente (Prof. Matías Torres).
- Ubicación o repositorio: {{DATO_PENDIENTE: ruta de la carpeta del proyecto}}.
- Estado actual verificado: {{DATO_PENDIENTE: inspeccionar en la Fase 1; se espera que exista la estructura HTML del Change 01, pero no debe asumirse}}.
- Fuentes de requisitos: consigna "Parcial 1: frontend de una librería" (PDF), Ejercicio 2 y criterios de evaluación.
- Tecnologías y dependencias permitidas: HTML, CSS y JavaScript nativos.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs de CSS o JavaScript (incluye frameworks CSS y fuentes por CDN); npm y herramientas de compilación.
- Punto de entrada o componente afectado: hojas de estilo externas enlazadas desde `index.html` y demás HTML.
- Condiciones del entorno: apertura de `index.html` en el navegador sin servidor; verificación a 320 px y 1280 px de ancho. {{DATO_PENDIENTE: navegador y versión de referencia}}.

## Alcance estricto

### Objetivo de esta entrega

Aplicar una identidad visual propia y coherente, adaptable de 320 px a 1280 px, con foco visible, errores no dependientes solo del color y textos alternativos correctos.

### Incluido

- Identidad visual: colores, tipografía, espaciado, tarjetas, formularios y botones.
- CSS en archivos externos, con clases reutilizadas para elementos equivalentes.
- Organización del contenido con Flexbox o Grid.
- Comprobación de legibilidad y ausencia de desplazamiento horizontal de la página a 320 px y 1280 px; las tablas anchas se desplazan dentro de su propio contenedor.
- Foco visible y recorrido con teclado; mensajes de error expresados con texto además de color.
- Texto alternativo en imágenes informativas; imágenes decorativas sin información repetida.

### Excluido

- Cambios en la estructura de vistas definida en el Change 01, salvo ajustes mínimos de clases o contenedores justificados.
- Lógica JavaScript, datos locales, validaciones y persistencia (Ejercicios 3 a 6).
- Librerías, frameworks, CDNs y fuentes externas.
- Registro de resultados en el README (Ejercicio 6).

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Funcional | Las cinco vistas presentan una identidad visual coherente (colores, tipografía, espaciado, tarjetas, formularios, botones). |
| R-02 | Estructura e interfaces | El CSS está en archivos externos y los elementos equivalentes reutilizan las mismas clases; el layout usa Flexbox o Grid. |
| R-03 | Datos y estados | Los estados de error y de operación correcta/rechazada se distinguen con texto y no solo con color. |
| R-04 | Calidad | A 320 px y 1280 px los textos y controles son legibles y la página no tiene desplazamiento horizontal; las tablas anchas se desplazan en su contenedor; todos los controles tienen foco visible y se recorren con el teclado. |
| R-05 | Compatibilidad | Funciona al abrir `index.html` en el navegador sin servidor. |
| R-06 | Convenciones | Sin estilos en línea; nombres de clases comprensibles; imágenes informativas con `alt`, decorativas con `alt` vacío. |

Datos de ejemplo: no se necesitan en este change. Si se incorporan imágenes, deben ser locales y su procedencia debe quedar registrada para el README: {{DATO_PENDIENTE: definir si se usarán imágenes}}.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `docs/02-css-adaptable/SPEC.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance.
6. Estados y manejo de errores aplicables.
7. Restricciones técnicas y convenciones que condicionan la solución.
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Decisiones que requieren mi respuesta: paleta y estilo visual deseados, y si se usarán imágenes. Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `docs/02-css-adaptable/PLAN.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá CSS organizado (variables, clases reutilizables), indentación consistente y nombres comprensibles.
- Respetá la política de comprobaciones: {{DATO_PENDIENTE: no se definió TDD; verificación manual a 320 px y 1280 px y con teclado}}.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos CSS en {{DATO_PENDIENTE: ubicación dentro del proyecto}} junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

- [ ] CA-01 — Las cinco vistas comparten identidad visual coherente y reutilizan clases (R-01, R-02).
- [ ] CA-02 — El CSS está en archivos externos y el layout usa Flexbox o Grid (R-02, R-06).
- [ ] CA-03 — Los errores se comunican con texto, no solo con color (R-03).
- [ ] CA-04 — A 320 px y 1280 px no hay desplazamiento horizontal de la página; las tablas anchas se desplazan en su contenedor; el foco es visible y el teclado recorre los controles (R-04).
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
