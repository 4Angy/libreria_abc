# Prompt — Change 05: Venta simulada e historial (Ejercicio 5 · 20 puntos)

---

## Rol

Actuá como desarrollador/a frontend web, con experiencia en JavaScript nativo, manejo de estado en memoria y cálculo de importes, y responsabilidad sobre la composición de ventas simuladas, su confirmación y el historial inmutable.

## Metodología

- Metodología a utilizar: desarrollo guiado por especificación (SPEC → PLAN → IMPLEMENTACIÓN), un change por ejercicio del parcial.
- Herramientas y convenciones: {{DATO_PENDIENTE: herramientas autorizadas (editor, navegador, consola)}}. Convenciones: JavaScript nativo, funciones acotadas (agregar renglón, recalcular, confirmar, renderizar historial), nombres comprensibles.
- Respetá las fases SPEC → PLAN → IMPLEMENTACIÓN descritas abajo, adaptando sus entregables a la metodología elegida.
- No escribas código ni modifiques el producto antes de completar la especificación y obtener mi aprobación explícita de ella. La creación de los documentos SPEC y PLAN solicitados sí forma parte del trabajo autorizado.
- Si las herramientas o convenciones indicadas no están disponibles, informalo y proponé una alternativa antes de depender de ella.

## Contexto del proyecto

- Nombre o identificador: Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN).
- Propósito y usuarios: simular ventas (cantidades y precios para un total simulado) y consultar su historial; evaluado por el docente (Prof. Matías Torres). No se gestiona stock, cobros ni facturación fiscal.
- Ubicación o repositorio: {{DATO_PENDIENTE: ruta de la carpeta del proyecto}}.
- Estado actual verificado: {{DATO_PENDIENTE: inspeccionar en la Fase 1; se esperan estructura HTML, datos locales y altas (Changes 01, 03 y 04), pero no debe asumirse}}.
- Fuentes de requisitos: consigna "Parcial 1: frontend de una librería" (PDF), Ejercicio 5 y criterios de evaluación.
- Tecnologías y dependencias permitidas: HTML, CSS y JavaScript nativos.
- Tecnologías y dependencias excluidas: librerías, frameworks y CDNs; `fetch`, API, servidor, inicio de sesión real; `localStorage` (reservado al Ejercicio 6); npm y herramientas de compilación.
- Punto de entrada o componente afectado: vistas Ventas e Historial. {{DATO_PENDIENTE: nombres de archivos JS}}.
- Condiciones del entorno: apertura de `index.html` en el navegador sin servidor. {{DATO_PENDIENTE: navegador y versión de referencia}}.

## Alcance estricto

### Objetivo de esta entrega

Poder componer una venta (cliente + renglones), ver subtotales y total, confirmarla con validaciones y consultarla en un historial cuyos valores no cambian.

### Incluido

- Selección de un cliente existente y al menos un renglón con libro existente y cantidad entera mayor que cero.
- Sin libros repetidos en una venta: se modifica la cantidad del renglón existente o se informa el duplicado.
- Cambio de cantidades y eliminación de renglones antes de confirmar.
- Renglón con libro, cantidad, precio unitario y subtotal; total como suma de subtotales; importes con dos decimales.
- Bloqueo de confirmación sin cliente, sin renglones o con cantidades inválidas.
- Al confirmar: registro de identificador, fecha, cliente, renglones y total; precio unitario copiado al renglón como valor histórico; datos descriptivos necesarios para leer la venta (por ejemplo título del libro y nombre del cliente).
- Historial con identificador, fecha, cliente y total, y consulta de renglones; ventas sin edición ni eliminación desde la interfaz.
- Limpieza del formulario tras confirmar y mensaje de resultado.

### Excluido

- Gestión de stock, cobros y facturación fiscal.
- Edición o eliminación de ventas confirmadas.
- Pantalla para editar precios.
- Persistencia en `localStorage` (Ejercicio 6).
- Cualquier librería, framework o CDN.

No agregues funcionalidades, dependencias, integraciones ni refactorizaciones ajenas a esta entrega. Si detectás una necesidad fuera de alcance, describila como propuesta pendiente; no la implementes sin autorización.

## Requisitos

| ID | Grupo | Requisito verificable |
| --- | --- | --- |
| R-01 | Funcional | Se puede componer, modificar y confirmar una venta con cliente y renglones válidos; la confirmación genera un registro en el historial. |
| R-02 | Estructura e interfaces | Cada renglón muestra libro, cantidad, precio unitario y subtotal; el resumen muestra el total; el historial muestra identificador, fecha, cliente y total con acceso a los renglones. |
| R-03 | Datos y estados | Se rechaza confirmar sin cliente, sin renglones o con cantidad cero, negativa o decimal; un libro repetido no crea otro renglón (se informa o se suma); el precio unitario guardado es el de la confirmación. |
| R-04 | Calidad | Subtotal = cantidad × precio; total = suma de subtotales; importes con dos decimales; ventas confirmadas inmutables desde la interfaz. |
| R-05 | Compatibilidad | Funciona al abrir `index.html` sin servidor. |
| R-06 | Convenciones | Funciones acotadas y nombres comprensibles; datos de usuario insertados como texto en el DOM. |

Datos de ejemplo: caso de la consigna — dos unidades a 1500 y una a 2000 → subtotales 3000 y 2000, total 5000. Identificalo como ejemplo.

## Fase 1 — SPEC

Hacé esta fase primero. Inspeccioná las fuentes y el estado existente dentro del alcance autorizado antes de definir la solución.

Generá `docs/05-venta-historial/SPEC.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con:

1. Problema, objetivo y resultado esperado.
2. Contexto verificado y referencias concretas a las fuentes consultadas.
3. Alcance incluido y exclusiones explícitas.
4. Requisitos identificados y escenarios observables, incluidos los casos límite relevantes.
5. Estructura o componentes propuestos, interfaces y datos necesarios, con el detalle proporcional al alcance.
6. Estados y manejo de errores aplicables.
7. Restricciones técnicas y convenciones que condicionan la solución.
8. Criterios de aceptación vinculados a los requisitos.
9. Supuestos declarados, información pendiente y decisiones que requieren mi respuesta.

Decisiones que requieren mi respuesta: ante un libro repetido, ¿se suma/modifica la cantidad del renglón existente o se informa el duplicado y se rechaza?; formato del identificador y de la fecha de la venta. Si falta una decisión que impide especificar correctamente, formulá una pregunta concreta y esperá la respuesta. No cierres esa decisión por tu cuenta.

Al terminar, presentá la especificación para revisión y detenete. No avances a PLAN ni IMPLEMENTACIÓN en esta primera respuesta.

## Fase 2 — PLAN

Cuando autorice avanzar, generá `docs/05-venta-historial/PLAN.md` {{DATO_PENDIENTE: confirmar ruta propuesta}} con un checklist de tareas atómicas. Para cada tarea indicá:

- Identificador y resultado esperado.
- Requisito o criterio de aceptación que cubre.
- Archivos, componentes o entregables a crear o modificar.
- Dependencias y orden de ejecución.
- Comprobación concreta que permitirá darla por terminada.

Incluí solo trabajo dentro del alcance. Respetá la estructura existente y justificá los cambios estructurales necesarios. Si el plan exige cambiar la especificación, proponé el ajuste y obtené su aprobación antes de implementar.

## Fase 3 — IMPLEMENTACIÓN

Iniciá esta fase únicamente después de mi aprobación explícita de la especificación y mi autorización para implementar.

- Ejecutá las tareas del plan dentro del alcance aprobado.
- Aplicá JavaScript nativo legible, funciones acotadas y nombres comprensibles; copiá el precio unitario al renglón al agregar/confirmar y no lo vuelvas a leer del catálogo en el historial.
- Respetá la política de comprobaciones: {{DATO_PENDIENTE: no se definió TDD; verificación manual de los casos de venta del Ejercicio 6}}.
- Usá solo las tecnologías, dependencias e integraciones autorizadas.
- No implementes las etapas futuras ni las funcionalidades excluidas.
- Verificá cada resultado con los controles aplicables y registrá su evidencia.
- Si aparece un impedimento o una contradicción que cambie la solución aprobada, informalo y consultame antes de ampliar el alcance.

Entregá los archivos modificados en {{DATO_PENDIENTE: ubicación dentro del proyecto}} junto con un resumen de cambios, comprobaciones realizadas, limitaciones y pendientes.

## Criterios de aceptación

- [ ] CA-01 — Una venta válida (2 × 1500 y 1 × 2000) muestra subtotales 3000,00 y 2000,00 y total 5000,00, y queda en el historial con sus renglones (R-01, R-02, R-04).
- [ ] CA-02 — No se confirma sin cliente, sin renglones, con cantidad cero, negativa o decimal (R-03).
- [ ] CA-03 — Un libro repetido no crea otro renglón (R-03).
- [ ] CA-04 — El historial conserva precio unitario, subtotales y total aun si cambia el precio del catálogo; las ventas no se editan ni eliminan desde la interfaz (R-03, R-04).
- [ ] Tras confirmar se limpia el formulario y se muestra un mensaje de resultado (R-01).
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
