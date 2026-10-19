# PLAN — Change 01: Estructura y pantallas HTML

| Campo | Valor |
|---|---|
| Change | 01 — Estructura y pantallas HTML (Ejercicio 1 · 20 puntos) |
| Fase | PLAN (Fase 2) |
| Estado | **Pendiente de autorización para implementar** — no se escribe código hasta la Fase 3 |
| Fecha | 19/10/2026 |
| SPEC aprobada | `docs/01-estructura-html/SPEC.md` v2 (aprobada el 19/10/2026) |
| Entregable | 5 archivos HTML en la raíz del proyecto + registro de comprobaciones |
| Alcance | Estricto según SPEC §3; sin CSS, sin JS, sin datos, sin validaciones |

---

## 1. Objetivo del plan

Convertir la SPEC v2 aprobada en cinco archivos HTML verificables, en el orden que minimiza retrabajo: primero el patrón común y la vista Catálogo (que define `header`, `nav`, `main` y el contrato de estados), después las cuatro vistas restantes reutilizando ese patrón, y al final las comprobaciones transversales (navegación, semántica, estados, restricciones) con evidencia registrada.

**El plan no modifica la SPEC.** No se detectó ninguna contradicción entre SPEC y consigna que exija un ajuste.

---

## 2. Condiciones de ejecución

1. **No se implementa nada hasta la autorización explícita** del usuario para iniciar la Fase 3.
2. Se crean **solo** archivos `.html`. No se crean `css/`, `js/`, `img/`, `README.md` ni repositorio Git.
3. No se agregan datos, filas, opciones de `select` (salvo las estáticas indicadas: «Seleccioná…» y «Sin clasificar») ni textos de ejemplo.
4. No se agregan atributos de validación ni comportamiento.
5. Cada tarea se cierra con su comprobación anotada; si una comprobación falla, se corrige antes de avanzar.
6. La verificación visual final en Edge 155 / Firefox 158 la confirma el usuario; el agente solo puede aportar evidencia estática y capturas headless. **No se declarará «aprobado» ningún control que no se haya ejecutado.**

---

## 3. Orden y dependencias

```
T-01 (index.html: base común + Catálogo)
  ├── T-02 (libros.html)
  ├── T-03 (clientes.html)
  ├── T-04 (ventas.html)
  └── T-05 (historial.html)
        ↓
T-06 (navegación cruzada)  ─┐
T-07 (semántica y labels)   │
T-08 (estados e ids)        ├── dependen de T-01…T-05
T-09 (restricciones)        │
T-10 (file:// + headless)   ┘
        ↓
T-11 (registro de evidencia y resumen)
```

- T-02 a T-05 son **independientes entre sí** una vez creado el patrón de T-01; pueden ejecutarse en cualquier orden o en paralelo.
- T-06 a T-10 requieren las cinco páginas terminadas.
- T-11 requiere todas las comprobaciones ejecutadas.

---

## 4. Tareas

### T-01 — Crear `index.html` con la base común y la vista Catálogo

| Campo | Detalle |
|---|---|
| **Resultado esperado** | `index.html` abre por `file://` y muestra: `header` con marca «Librería ABC», `nav` con cinco enlaces, `main` con `h1` «Catálogo», región de éxito oculta, buscador por título, tabla de catálogo con seis encabezados, cuerpo vacío y los dos mensajes de estado ocultos. |
| **Cubre** | R-01 (estructura de navegación), R-02 (Catálogo), R-03 (vacío y sin resultados), R-04 (semántica/labels/tabla), CA-02, CA-03 (parcial), CA-04 |
| **Archivos** | Crear `index.html` |
| **Dependencias** | Ninguna |
| **Comprobación** | 1) Existe `index.html` en la raíz. 2) Al abrirlo no hay recursos externos. 3) `header`, `nav`, `main`, `h1`, `form role="search"`, `table` con `caption` y 6 `th scope="col"`. 4) El `input type="search"` tiene `label for`. 5) `catalogo-estado-vacio` y `catalogo-estado-sin-resultados` existen con `hidden`. 6) `mensaje-exito` existe con `role="status"` y `hidden`. 7) El enlace «Catálogo» lleva `aria-current="page"`. |

### T-02 — Crear `libros.html`

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Vista Libros con el patrón común, `h1` «Libros», sección de alta con `fieldset`/`legend` y seis controles etiquetados, dos botones, mensaje de error junto al formulario, y sección de listado con tabla de seis encabezados, cuerpo vacío y mensaje de lista vacía. |
| **Cubre** | R-02 (Libros), R-03, R-04, E-12 (tipos de control), CA-02, CA-03, CA-04 |
| **Archivos** | Crear `libros.html` |
| **Dependencias** | T-01 (patrón común) |
| **Comprobación** | 1) Seis controles: `libro-titulo` (text), `libro-isbn` (text), `libro-editorial` (`select`), `libro-genero` (`select` con `<option value="">Sin clasificar</option>`), `libro-autores` (`select multiple`), `libro-precio` (`number`). 2) Cada control tiene `label for` con el mismo `id`. 3) Botones «Registrar libro» (`submit`) y «Limpiar formulario» (`reset`). 4) `libros-mensaje-error` con `role="alert"` y `hidden`. 5) Tabla `libros-tabla` con 6 `th` y `tbody#libros-listado` vacío. 6) `libros-estado-vacio` oculto. 7) Ningún `select` tiene opciones de datos (solo la de género). 8) Sin `required`/`pattern`/`min`/`max`/`step`. |

### T-03 — Crear `clientes.html`

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Vista Clientes con el patrón común, `h1` «Clientes», alta con nombre completo y email etiquetados, dos botones, mensaje de error junto al formulario, listado con dos encabezados, cuerpo vacío y mensaje de lista vacía. |
| **Cubre** | R-02 (Clientes), R-03, R-04, CA-02, CA-03, CA-04 |
| **Archivos** | Crear `clientes.html` |
| **Dependencias** | T-01 |
| **Comprobación** | 1) `cliente-nombre` (`text`) y `cliente-email` (`email`), cada uno con `label for`. 2) Botones «Registrar cliente» / «Limpiar formulario». 3) `clientes-mensaje-error` oculto con `role="alert"`. 4) Tabla con `th` «Nombre completo» y «Correo electrónico». 5) `tbody#clientes-listado` vacío. 6) `clientes-estado-vacio` oculto. 7) Sin `required`/`pattern`. |

### T-04 — Crear `ventas.html`

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Vista Ventas con el patrón común, `h1` «Ventas», formulario con selector de cliente, selector de libro, cantidad y botón «Agregar renglón», resumen con cinco encabezados y pie de total, mensajes de venta vacía y de error, y botón «Registrar venta». |
| **Cubre** | R-02 (Ventas), R-03, R-04, E-06, E-07, CA-02, CA-03, CA-04 |
| **Archivos** | Crear `ventas.html` |
| **Dependencias** | T-01 |
| **Comprobación** | 1) `venta-cliente` y `venta-libro` son `select` con opción inicial `value=""`. 2) `venta-cantidad` es `input type="number"` con `label`. 3) `venta-boton-agregar` es `button type="button"` con texto «Agregar renglón». 4) Tabla con `th` Libro, Cantidad, Precio unitario, Subtotal, Acciones. 5) `tbody#venta-renglones` vacío. 6) `tfoot` con `th scope="row"` «Total» y `td#venta-total`. 7) `venta-estado-vacio` y `ventas-mensaje-error` ocultos. 8) `venta-boton-confirmar` es `submit` con texto «Registrar venta». |

### T-05 — Crear `historial.html`

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Vista Historial con el patrón común, `h1` «Historial», tabla de ventas con cinco encabezados, cuerpo vacío, mensaje de lista vacía y bloque de detalle oculto con `dl` de cuatro datos, tabla de renglones y botón «Cerrar detalle». |
| **Cubre** | R-02 (Historial y detalle), R-03, R-04, E-08, E-09, CA-02, CA-03, CA-04 |
| **Archivos** | Crear `historial.html` |
| **Dependencias** | T-01 |
| **Comprobación** | 1) Tabla `historial-tabla` con `th` Identificador, Fecha, Cliente, Total, Acciones. 2) `tbody#historial-listado` vacío. 3) `historial-estado-vacio` oculto. 4) `section#historial-detalle` con `hidden` y un `h2`. 5) `dl` con `dt`/`dd` para identificador, fecha, cliente y total (`historial-detalle-*`). 6) Tabla de renglones con `th` Libro, Cantidad, Precio unitario, Subtotal y `tbody#historial-detalle-renglones` vacío. 7) `button type="button"` «Cerrar detalle». |

### T-06 — Verificar navegación cruzada

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Las cinco vistas se alcanzan desde `index.html` y cada una marca su enlace con `aria-current="page"`. |
| **Cubre** | R-01, R-05, CA-01 |
| **Archivos** | Sin cambios (verificación de T-01…T-05) |
| **Dependencias** | T-01…T-05 |
| **Comprobación** | 1) Los cinco `href` existen como archivos. 2) Cada archivo tiene exactamente cinco enlaces de navegación con los mismos destinos. 3) Exactamente un `aria-current="page"` por archivo, en el enlace correcto. 4) No hay rutas absolutas ni `http`. |

### T-07 — Verificar semántica, etiquetas y tablas

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Cada página cumple R-04: un `h1`, landmarks únicos, una `label` por campo, botones con texto y tablas con `caption` y `th scope`. |
| **Cubre** | R-04, CA-04 |
| **Archivos** | Sin cambios (verificación) |
| **Dependencias** | T-01…T-05 |
| **Comprobación** | 1) Exactamente un `header`, un `nav`, un `main` y un `h1` por archivo. 2) Cantidad de `label for` igual a cantidad de controles en cada formulario (Catálogo 1; Libros 6; Clientes 2; Ventas 3). 3) Todos los `label` apuntan a un `id` existente y único. 4) Toda `table` tiene `caption` y al menos un `thead` con `th`. 5) Todo `button` tiene texto no vacío. 6) Navegación por teclado: recorrido manual de los controles de cada vista (evidencia del usuario o captura). |

### T-08 — Verificar estados, ids y contrato

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Todos los contenedores de estado de la SPEC existen, están ocultos y usan los `id` acordados; no hay `id` duplicados dentro de un archivo. |
| **Cubre** | R-03, CA-03, CA-09 |
| **Archivos** | Sin cambios (verificación) |
| **Dependencias** | T-01…T-05 |
| **Comprobación** | 1) Existen los 11 contenedores de estado de SPEC §6.1. 2) Todos tienen `hidden`. 3) `mensaje-exito` tiene `role="status"` y `aria-live="polite"`; los tres errores tienen `role="alert"`. 4) Los `id` del HTML coinciden uno a uno con SPEC §5.3. 5) Ningún `id` repetido dentro del mismo archivo. 6) Ningún contenedor de datos tiene filas u opciones precargadas. |

### T-09 — Verificar restricciones tecnológicas

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Cero CSS/JS, cero dependencias, cero validaciones adelantadas. |
| **Cubre** | R-06, CA-06 |
| **Archivos** | Sin cambios (verificación) |
| **Dependencias** | T-01…T-05 |
| **Comprobación** | Búsqueda de patrones en los cinco HTML; cada una debe devolver **0 coincidencias**: `<style`, `style=`, `<script`, `on[a-z]+=`, `<link`, `required`, `pattern=`, `min=`, `max=`, `step=`, `http://`, `https://`, `fetch(`, `localStorage`. Además: no existen archivos `.css` ni `.js` ni carpetas `css/`, `js/`. |

### T-10 — Comprobar apertura por `file://`

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Las cinco páginas se cargan sin servidor; el DOM renderizado contiene los elementos esperados. |
| **Cubre** | R-05, CA-01, CA-06 |
| **Archivos** | Sin cambios (verificación) |
| **Dependencias** | T-01…T-05 |
| **Comprobación** | 1) `msedge --headless=new --dump-dom "file:///.../index.html"` devuelve el DOM sin errores y con `header`/`nav`/`main`. 2) Ídem para las cuatro páginas restantes. 3) Captura headless de `index.html` a 1280×800 y a 320×800 como evidencia (sin evaluar estilo, solo estructura). 4) **Confirmación visual del usuario** en Edge 155: abrir `index.html`, recorrer los cinco enlaces. Este punto queda **pendiente del usuario** y se registra como tal si no se ejecuta. |

### T-11 — Registrar evidencia y resumen de implementación

| Campo | Detalle |
|---|---|
| **Resultado esperado** | Tabla de comprobaciones con estado explícito (aprobado / fallido / omitido / pendiente), limitaciones, supuestos y pendientes. |
| **Cubre** | CA-07, CA-08, CA-09 |
| **Archivos** | Sin archivos nuevos; el registro se entrega en el resumen de la Fase 3. |
| **Dependencias** | T-06…T-10 |
| **Comprobación** | 1) Cada control de T-06…T-10 figura con su resultado real. 2) Ningún control no ejecutado figura como aprobado. 3) Se listan las limitaciones de SPEC §9.5. 4) Se informa el alcance exacto implementado. |

---

## 5. Inventario esperado (base de verificación)

| Archivo | `h1` | Formularios | Controles etiquetados | Tablas (con `th`) | Contenedores de estado |
|---|---|---|---|---|---|
| `index.html` | Catálogo | 1 (`search`) | 1 | 1 (6 `th`) | `catalogo-estado-vacio`, `catalogo-estado-sin-resultados`, `mensaje-exito` |
| `libros.html` | Libros | 1 | 6 | 1 (6 `th`) | `libros-estado-vacio`, `libros-mensaje-error`, `mensaje-exito` |
| `clientes.html` | Clientes | 1 | 2 | 1 (2 `th`) | `clientes-estado-vacio`, `clientes-mensaje-error`, `mensaje-exito` |
| `ventas.html` | Ventas | 1 | 3 | 1 (5 `th`) + `tfoot` total | `venta-estado-vacio`, `ventas-mensaje-error`, `mensaje-exito` |
| `historial.html` | Historial | 0 | 0 | 2 (5 y 4 `th`) | `historial-estado-vacio`, `historial-detalle` |

**Total de `label` esperadas:** 1 + 6 + 2 + 3 = **12**.
**Total de archivos creados:** **5** (todos en la raíz).

---

## 6. Matriz tarea → requisito / criterio

| Tarea | R-01 | R-02 | R-03 | R-04 | R-05 | R-06 | CA-01 | CA-02 | CA-03 | CA-04 | CA-05 | CA-06 | CA-07 | CA-08 | CA-09 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| T-01 | ● | ● | ● | ● | | | ● | ● | ◐ | ● | | | | | |
| T-02 | | ● | ● | ● | | | | ● | ● | ● | | | | | |
| T-03 | | ● | ● | ● | | | | ● | ● | ● | | | | | |
| T-04 | | ● | ● | ● | | | | ● | ● | ● | | | | | |
| T-05 | | ● | ● | ● | | | | ● | ● | ● | | | | | |
| T-06 | ● | | | | ● | | ● | | | | | | | | |
| T-07 | | | | ● | | | | | | ● | | | | | |
| T-08 | | | ● | | | | | | ● | | | | | | ● |
| T-09 | | | | | | ● | | | | | ● | ● | | | |
| T-10 | | | | | ● | | ● | | | | | ● | | | |
| T-11 | | | | | | | | | | | ● | | ● | ● | ● |

● cubre · ◐ parcial (completa en T-06/T-08)

---

## 7. Riesgos y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| Duplicar `header`/`nav` con diferencias entre páginas | Media | Medio | T-01 define el patrón; T-02…T-05 lo copian literalmente y T-06 compara los cinco. |
| Adelantar selectores/opciones de datos (Ej. 3/4) | Media | Alto | T-02 limita las opciones a las dos estáticas; T-08 verifica que no haya datos. |
| Agregar validaciones por costumbre (`required`) | Media | Alto | T-09 busca los atributos prohibidos. |
| `id` inconsistentes con la SPEC | Media | Medio | T-08 compara el contrato completo. |
| No poder verificar visualmente | Alta | Bajo | Se usa `--dump-dom` y capturas headless; la confirmación visual final se registra como pendiente del usuario. |
| Cambios de alcance a mitad de implementación | Baja | Alto | Regla de contención: se propone y se espera autorización. |

---

## 8. Definición de terminado

El change se considera terminado cuando:

1. existen los cinco HTML en la raíz y no existe ningún otro archivo creado;
2. T-06 a T-09 devuelven lo esperado;
3. T-10 tiene evidencia estática y la confirmación visual está ejecutada o registrada como pendiente;
4. T-11 presenta la tabla de comprobaciones con estados reales;
5. el usuario revisa el resumen y no pide ajustes.

**No se declara terminado** si queda un criterio de aceptación sin verificar; en ese caso se enumera como pendiente con su motivo.

---

## 9. Fuera de alcance de este plan

- Escribir CSS o JavaScript (Ej. 2, 3, 4, 5, 6).
- Crear `README.md` (Ej. 6).
- Cargar datos de ejemplo (Ej. 3).
- Implementar validaciones (Ej. 4).
- Inicializar Git.
- Modificar `openspec/`, `.opencode/`, `.agents/` o `.active-orchestrator-state.json`.

---

## 10. Autorización requerida

Este plan **no ejecuta** ninguna tarea. Para iniciar la Fase 3 se necesita tu autorización explícita («implementá» / «dale, ejecutá el plan»). Si querés ajustar el orden, el alcance o alguna comprobación, decilo antes de autorizar.
