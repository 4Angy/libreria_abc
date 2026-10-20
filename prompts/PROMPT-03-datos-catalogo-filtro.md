# Prompt — Change 03: Datos locales, catálogo y filtro (Ejercicio 3 · 15 puntos)

---

## Rol

Actuá como desarrollador/a frontend web, con experiencia en JavaScript nativo, manipulación segura del DOM y modelado de datos con arrays y objetos, y responsabilidad sobre el modelo de datos local, el renderizado del catálogo y el filtro por título.

## Metodología

- Metodología a utilizar: desarrollo guiado por especificación (SPEC → PLAN → IMPLEMENTACIÓN), un change por ejercicio del parcial.
- Herramientas y convenciones: {{DATO_PENDIENTE: herramientas autorizadas (editor, navegador, consola)}}. Convenciones: JavaScript nativo, funciones acotadas con responsabilidades reconocibles, nombres comprensibles, separación entre estructura, estilos y comportamiento.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN).
- Propósito y usuarios: catálogo de una librería con datos ficticios simulados en el navegador; evaluado por el docente (Prof. Matías Torres).
- Ubicación o repositorio: {{DATO_PENDIENTE: ruta de la carpeta del proyecto}}.
- Estado actual verificado: {{DATO_PENDIENTE: inspeccionar en la Fase 1; se espera la estructura HTML del Change 01, pero no debe asumirse}}.
- Fuentes de requisitos: consigna "Parcial 1: frontend de una librería" (PDF), Ejercicio 3 y criterios de evaluación.
- Tecnologías y dependencias permitidas: HTML, CSS y JavaScript nativos.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs; `fetch`, API, base de datos, servidor; `localStorage` (reservado al Ejercicio 6); npm y herramientas de compilación.
- Punto de entrada o componente afectado: archivo(s) JavaScript enlazados desde `index.html`, vista Catálogo. {{DATO_PENDIENTE: nombres de archivos JS}}.
- Condiciones del entorno: apertura de `index.html` en el navegador sin servidor. {{DATO_PENDIENTE: navegador y versión de referencia}}.

## Alcance estricto

### Objetivo de esta entrega

Contar con datos locales (libros, editoriales, géneros, autores, clientes) con identificadores estables, un catálogo generado por JavaScript y un filtro por título correcto.

### Incluido

- Representación con arrays y objetos con identificadores estables de libros, editoriales, géneros, autores y clientes.
- Conjunto inicial de al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios; cada libro con una editorial existente y uno o más autores existentes; género opcional, y si se asigna, existente.
- Generación del catálogo desde el array de libros (título, ISBN, editorial, género o «Sin clasificar», autores, precio).
- Filtro por título: sin distinguir mayúsculas, coincidencia parcial, `trim` en los extremos; búsqueda vacía muestra todo; sin coincidencias muestra mensaje claro.
- Eventos y funciones con responsabilidades reconocibles; datos escritos por usuarios insertados como texto en el DOM.

### Excluido

- Uso de `fetch`.
- Altas, bajas y modificaciones de editoriales, géneros o autores.
- Formularios de alta de libros y clientes (Ejercicio 4) y ventas (Ejercicio 5).
- Persistencia en `localStorage` (Ejercicio 6).

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Funcional | El filtro por título ignora mayúsculas/minúsculas, admite coincidencias parciales y recorta espacios en los extremos. |
| R-02 | Estructura e interfaces | El catálogo se genera desde el array de libros con JavaScript; las funciones de datos, renderizado y eventos tienen responsabilidades separadas. |
| R-03 | Datos y estados | Datos iniciales con las cantidades mínimas y relaciones válidas; búsqueda vacía muestra todo el catálogo; sin coincidencias muestra mensaje claro; libro sin género muestra «Sin clasificar». |
| R-04 | Calidad | El contenido proveniente de datos se inserta como texto (por ejemplo `textContent`), sin interpretarlo como HTML. |
| R-05 | Compatibilidad | Funciona al abrir `index.html` sin servidor. |
| R-06 | Convenciones | Identificadores estables y nombres comprensibles; código legible con funciones acotadas. |

Datos de ejemplo: mínimo 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes ficticios; identificalos como ejemplos. Propuesta (a confirmar): que al menos un libro no tenga género para que «Sin clasificar» sea observable. {{DATO_PENDIENTE: títulos, nombres y precios de los datos ficticios}}.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `docs/03-datos-catalogo-filtro/SPEC.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance.
6. Estados y manejo de errores aplicables.
7. Restricciones técnicas y convenciones que condicionan la solución.
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Decisión que requiere mi respuesta: formato de los identificadores y datos ficticios concretos. Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `docs/03-datos-catalogo-filtro/PLAN.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá JavaScript nativo legible, funciones acotadas y nombres comprensibles; sin HTML interpolado con datos de usuario.
- Respetá la política de comprobaciones: {{DATO_PENDIENTE: no se definió TDD; verificación manual del caso "búsqueda con parte del título en mayúsculas, búsqueda vacía y texto inexistente"}}.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos JavaScript en {{DATO_PENDIENTE: ubicación dentro del proyecto}} junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

- [ ] CA-01 — Existen los datos iniciales mínimos con relaciones válidas (R-03).
- [ ] CA-02 — El catálogo se genera desde el array y muestra todos los campos, con «Sin clasificar» cuando corresponde (R-02, R-03).
- [ ] CA-03 — El filtro cubre mayúsculas, coincidencia parcial y espacios; vacío muestra todo; sin coincidencias muestra mensaje (R-01, R-03).
- [ ] CA-04 — Los datos de usuario se insertan como texto y el código tiene funciones acotadas (R-04, R-06).
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
