# SPEC — Change 06: Venta simulada e historial

| Campo | Valor |
|---|---|
| Change | 06 — Venta simulada e historial (Ejercicio 5 · 20 puntos) |
| Fase | Fase 1 — SPEC |
| Versión | v1 |
| Estado | **Implementado y verificado** el 20/10/2026. El PLAN v1 y el change de OpenSpec `06-venta-historial` se revisaron en la Fase 2. Tres desvíos de la implementación quedan documentados en «Desvíos de la implementación» de `design.md`; el más relevante es un **escenario mal enunciado en este SPEC** (S-16, el cruce entre páginas) que se corrigió aquí y en la delta de la spec. |
| Fecha | 20/10/2026 |
| Proyecto | Parcial 1 de Programación III — frontend de una librería (Tecnicatura Universitaria en Programación, UTN) |
| Ubicación | `C:\Users\Cara Palida\Documents\projects\libreria_abc` (verificada el 20/10/2026) |
| Ruta del documento | `docs/06-venta-historial/SPEC.md` — **ruta propuesta, a confirmar (D-03)** |
| Depende de | Change 01 (HTML), Change 02 y 04 (CSS), Change 03 (datos y catálogo), Change 05 (altas de libros y clientes) |
| Fuentes de requisitos | `docs/Consigna Primer Parcial.pdf` p. 4 (Ejercicio 5), p. 5 (casos manuales), p. 6 (criterios de evaluación) |
| Change de OpenSpec | Se creará en la Fase 2, junto con el PLAN (convención del proyecto, D-07 del SPEC-05) |

---

## 1. Problema, objetivo y resultado esperado

**Problema.** La vista Ventas carga JavaScript desde el Change 05 y sus dos selectores se pueblan desde el conjunto local, pero **el formulario de venta es inerte**: el botón «Agregar renglón» es un `type="button"` sin manejador, el botón «Registrar venta» es un `type="submit"` sin `preventDefault`, de modo que el navegador hace un `GET` nativo y recarga la página; y la vista Historial no tiene ni una etiqueta `<script>`, así que el listado de ventas queda vacío y el bloque de detalle nunca se muestra.

El Ejercicio 5 es **el más pesado del parcial**: 20 de los 100 puntos, con el reparto «Composición y validaciones: 8; cálculos: 5; confirmación e historial inmutable: 7».

**Objetivo de esta entrega.** Permitir componer una venta a partir de un cliente existente y uno o más renglones, ver el subtotal de cada renglón y el total de la venta, modificarla antes de confirmarla, y confirmarla dejando un registro **congelado** en el historial: con su identificador, su fecha, su cliente, sus renglones y su total, y con el precio unitario copiado como valor histórico que no se vuelve a leer del catálogo.

**Resultado esperado.** Al abrir `ventas.html` o `historial.html` sin servidor:

1. se puede elegir un cliente y un libro, escribir una cantidad y agregar un renglón;
2. cada renglón muestra libro, cantidad, precio unitario y subtotal, y el resumen muestra el total, con dos decimales;
3. se puede cambiar la cantidad de un renglón y quitar renglones antes de confirmar;
4. agregar un libro que ya está en la venta **no crea un segundo renglón**: suma la cantidad al existente y lo informa;
5. no se puede confirmar sin cliente, sin renglones o con cantidades inválidas, y el motivo aparece en un mensaje junto al formulario;
6. al confirmar, la venta queda registrada con identificador y fecha propios, con el precio unitario copiado, y el formulario queda limpio con un mensaje de resultado;
7. el historial lista las ventas con identificador, fecha, cliente y total, y permite consultar el detalle de cada una con sus renglones;
8. las ventas confirmadas no se editan ni se eliminan desde la interfaz.

**Fuera del resultado:** persistencia en `localStorage` (Ejercicio 6), gestión de stock, cobros y facturación fiscal, edición o eliminación de ventas confirmadas, y cualquier pantalla para editar precios.

### 1.1 La congelación del precio: el corazón de este ejercicio

El requisito que separa al Ejercicio 5 del 4 es que **el precio unitario se copia al renglón como valor histórico** (consigna p. 4). De eso se deriva todo lo demás:

```
   CATALOGO (estado.libros)               VENTA EN CURSO (formulario)
   precioUnitario: 21900                 renglones: [{ libroId, cantidad }]
          |                                       |
          |  "Agregar renglón"                    |  CONFIRMAR: se congela
          |  (el precio se lee vivo)              |  - precioUnitario <- catálogo
          |                                       |  - titulo         <- catálogo
          v                                       |  - clienteNombre  <- catálogo
   ┌──────────────────────────────────────────┐  v
   │  VENTA REGISTRADA (estado.ventas)       │  total = suma de subtotales
   │  renglones: [{ libroId, titulo,          │  ──────────────────────────────
   │                cantidad, precioUnitario }]│
   │  clienteId, clienteNombre, fecha, total   │  el HISTORIAL lee de acá
   └──────────────────────────────────────────┘  y NUNCA vuelve al catálogo
```

El precio se **lee vivo** mientras se compone la venta —que es lo que el vendedor espera ver— y **se congela al confirmar**. Si el catálogo cambiara de precio entre medias, la venta registra el precio vigente en el momento de la confirmación, y el historial muestra ese valor para siempre.

El renglón congelado **no guarda el subtotal**: se deriva como `cantidad × precioUnitario` a partir de los valores guardados. Es la forma de la semilla (§ 2.2) y lo que hace que el detalle no pueda desincronizarse del total.

---

## 2. Contexto verificado y fuentes consultadas

### 2.1 Estado actual del proyecto (verificado el 20/10/2026)

| Dato | Valor | Cómo se verificó |
|---|---|---|
| Ubicación del proyecto | `C:\Users\Cara Palida\Documents\projects\libreria_abc` | Listado de archivos |
| Vistas HTML | `index.html`, `libros.html`, `clientes.html`, `ventas.html`, `historial.html` | Listado de archivos |
| `<script>` por vista | `index.html`, `libros.html`, `clientes.html` y `ventas.html` tienen 6 etiquetas cada uno; **`historial.html` no tiene ninguna** | Lectura de los 5 archivos |
| `js/` | `datos-iniciales.js`, `datos.js`, `validaciones.js`, `catalogo.js`, `altas.js`, `inicio.js` | Listado de archivos |
| API de `js/datos.js` | `estado`, `iniciarDatos()`, `copiar*()`, `obtenerLibros()`, `obtenerEditorial()`, `obtenerGenero()`, `obtenerAutores()`, `obtenerClientes()`, `obtenerEditoriales()`, `obtenerGeneros()`, `obtenerAutoresDisponibles()`, `obtenerContextoDeAltas()`, `generarSlug()`, `generarId()`, `agregarLibro()`, `agregarCliente()` | Lectura del archivo |
| API de `js/datos.js` **relacionada con ventas** | **Solo** `copiarVenta()` y `copiarRenglon()`, que copian la semilla. **No existen** `obtenerVentas()`, `agregarVenta()` ni generación de identificador de venta | Lectura del archivo |
| API de `js/altas.js` | `pintarOpcionesClienteVenta()` y `pintarOpcionesLibroVenta()` — los dos selectores de la vista Ventas ya se pueblan desde el conjunto local. **Nada más** de la venta | Lectura del archivo |
| API de `js/inicio.js` | Detecta la vista por presencia de contenedores y registra el `submit` del buscador y de los dos formularios de alta. **No registra** nada del formulario de venta ni de la vista Historial | Lectura del archivo |
| Formulario de venta | `form#ventas-form-venta` con `p#ventas-mensaje-error` (**dentro** del `<form>`), `select#venta-cliente`, `select#venta-libro`, `input#venta-cantidad` (**`type="number"`**), `button#venta-boton-agregar` (`type="button"`), `section` con `table#venta-resumen-tabla` y `tbody#venta-renglones` (Libro, Cantidad, Precio unitario, Subtotal, **Acciones**), `td#venta-total`, `p#venta-estado-vacio` y `button#venta-boton-confirmar` (`type="submit"`) | Lectura de `ventas.html` |
| Vista Historial | `p#historial-estado-vacio`, `table#historial-tabla` con `tbody#historial-listado` (Identificador, Fecha, Cliente, Total, **Acciones**), `section#historial-detalle` (**`hidden`**) con `dl.lista-detalle` de `dd#historial-detalle-identificador`, `-fecha`, `-cliente`, `-total`, `tbody#historial-detalle-renglones` (Libro, Cantidad, Precio unitario, Subtotal) y `button#historial-detalle-cerrar` (`type="button"`) | Lectura de `historial.html` |
| Contenedor de error del Historial | **No existe.** `historial.html` no tiene `p#*-mensaje-error`; la vista no necesita rechazar nada | Lectura de `historial.html` |
| `#mensaje-exito` | Presente en las cinco vistas, con el texto «Operación realizada correctamente.» | Lectura de los 5 archivos |
| CSS disponible | `.tabla`, `.tabla--compacta` (usada por la tabla de renglones del detalle), `.tabla-desplazable`, `.celda-atomica`, `.lista-detalle` (`dt`/`dd`), `.estado-vacio`, `.mensaje`, `.mensaje--error`, `.mensaje--exito`, `.boton`, `.boton--primario`, `.boton--secundario` | Lectura de `css/estilos.css` |
| `formatearPrecio()` | Existe en `js/catalogo.js`: `Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" })` → «$ 24.500,00» | Lectura del archivo |
| Precios de la semilla | Todos entre 13.900 y 32.900 pesos. **No existe ningún libro de precio 1500 ni 2000** | Lectura de `datos-iniciales.js` |
| Semilla de ventas | 2 ventas ficticias: `vt-2026-0001` (2026-03-14, total 53700) y `vt-2026-0002` (2026-04-02, total 89900) | Lectura de `datos-iniciales.js` |
| Navegador | Edge **155.0.4283.62**. Node **v24.19.0**. Python **3.14.0**. Firefox ya no está instalado | Versión de los binarios |
| Cambios de OpenSpec | **0** activos; 5 archivados | `openspec list --json` |
| Specs vivas | `libreria-frontend` (12), `datos-catalogo` (9), `presentacion-css` (10), `altas-libros-clientes` (10) | `openspec list --specs --json` |
| Git | 3 commits; los cambios del Change 05 están sin commitear | `git log`, `git status` |

### 2.2 La forma de la venta ya está diseñada en la semilla

`js/datos-iniciales.js` trae las dos ventas iniciales con esta forma, que **es exactamente la que la consigna pide guardar**:

```js
{
  id: "vt-2026-0001",
  fecha: "2026-03-14",
  clienteId: "cl-martina-ferreyra",
  clienteNombre: "Martina Ferreyra",          // copia descriptiva del cliente
  renglones: [
    {
      libroId: "li-quijote-de-la-mancha",
      titulo: "Don Quijote de la Mancha",      // copia descriptiva del libro
      cantidad: 2,
      precioUnitario: 15900.0                 // precio histórico
    }
  ],
  total: 53700.0
}
```

Tres consecuencias que este change respeta en lugar de reinventar:

- El **renglón congelado no guarda el subtotal**: se deriva como `cantidad × precioUnitario`.
- La **venta guarda el total**, calculado al confirmar.
- La venta guarda **copias descriptivas** del nombre del cliente y del título de cada libro, para poder leerla aunque el catálogo cambie.

### 2.3 Requisitos citados de la consigna (p. 4, Ejercicio 5)

> «Se selecciona un cliente existente y se agrega al menos un renglón con un libro existente y una cantidad entera mayor que cero. No se admiten libros repetidos dentro de la misma venta: se modifica la cantidad del renglón existente o se informa el duplicado. Antes de confirmar, se permite cambiar cantidades y quitar renglones.»

> «Cada renglón muestra libro, cantidad, precio unitario y subtotal. Se calcula subtotal como cantidad por precio y total como suma de subtotales; los importes se presentan con dos decimales. Se impide confirmar una venta sin cliente, sin renglones o con cantidades inválidas.»

> «Al confirmar, se registra un identificador, fecha, cliente, renglones y total. El precio unitario se copia al renglón como valor histórico, de modo que no se obtiene nuevamente desde el precio actual del catálogo al consultar el historial. Se conservan también los datos descriptivos necesarios para leer esa venta.»

> «El historial muestra identificador, fecha, cliente y total, y permite consultar los renglones. Las ventas confirmadas no se editan ni se eliminan desde la interfaz. La confirmación limpia el formulario para una nueva venta y muestra un mensaje de resultado.»

### 2.4 Los casos manuales de la consigna (p. 5) que caen en este ejercicio

| Caso | Resultado esperado |
|---|---|
| «Venta sin cliente, cantidad cero, negativa o decimal; libro repetido» | «No se confirma; el duplicado no crea otro renglón.» |
| «Venta válida: dos unidades a 1500 y una a 2000» | «Subtotales 3000 y 2000; total 5000; detalle conservado en el historial.» |
| «Venta confirmada y cambio exclusivo del precio de catálogo guardado, en una copia de prueba del proyecto» | «Al consultar nuevamente el historial después de recargar, el precio unitario, los subtotales y el total de esa venta conservan los valores confirmados.» |

> **Hallazgo importante sobre el segundo caso.** La consigna usa **1500 y 2000** como precios, y **el catálogo de la semilla no tiene ningún libro con esos precios** (van de 13.900 a 32.900). El caso, entonces, **no se puede reproducir tal cual con los datos de la entrega**. La consigna lo resuelve ella misma: la comprobación del precio histórico «se realiza de forma guiada por el docente en una copia del proyecto **y con datos de prueba**» (p. 5-6). Este SPEC adopta el mismo criterio: el caso se ejecuta en el arnés de verificación **fijando a 1500 y 2000 los precios de dos libros de prueba**, sin tocar la semilla ni la entrega. La aplicación, en cambio, muestra los precios que tiene.

### 2.5 La comprobación guiada del precio histórico (p. 5-6)

La consigna pide que el docente, en una copia del proyecto y con datos de prueba, confirme una venta, anote sus importes, **modifique únicamente el precio del libro dentro del catálogo guardado** con las herramientas de almacenamiento del navegador, **sin modificar ni borrar las ventas guardadas**, recargue y consulte el detalle de la venta anterior.

En el Ejercicio 5, sin `localStorage`, la comprobación equivalente en memoria es: confirmar una venta, cambiar el precio del libro en `estado.libros` —que es exactamente lo que el docente hace en las herramientas de almacenamiento— y comprobar que el historial **no cambia**. El renglón congelado no vuelve a leer el catálogo, así que el resultado no se altera. La versión con almacenamiento y recarga es la del Ejercicio 6.

### 2.6 Las specs vivas que gobiernan esta entrega

| Spec | Requisito | Consecuencia en este change |
|---|---|---|
| `libreria-frontend` | «Composición de una venta» — «cada renglón expone **su cantidad como valor editable** y una acción para quitarlo del resumen» | La cantidad se edita **en línea**, dentro de la celda, y la columna Acciones lleva la acción de quitar. No es una invención: ya está especificado |
| `libreria-frontend` | «Historial de ventas y acceso al detalle» — «el bloque de detalle permanece oculto **y sus campos no anuncian contenido inexistente**» | Al abrir la vista, `#historial-detalle` está oculto **y sus `<dd>` están vacíos**. Al cerrar un detalle, se oculta y se vacía |
| `libreria-frontend` | «Validaciones diferidas» — «Los formularios de alta **SHALL desactivar la validación de restricciones del navegador**», y los controles no declaran `required`, `pattern`, `min`, `max` ni `step` | `#ventas-form-venta` lleva `novalidate`. Es lo que exige el texto vigente de la spec — y sin eso, escribir «1.5» en `#venta-cantidad` dispara el `stepMismatch` del navegador, cancela el envío y el mensaje de R-03 no llega a verse. **No hace falta modificar la spec** |
| `datos-catalogo` | No menciona ventas, renglones ni el historial | **No hay requisitos que modificar** en esta capability |
| `altas-libros-clientes` | No menciona ventas | **No hay requisitos que modificar** en esta capability |

**Conclusión:** este change **no modifica ninguna spec viva**. La capacidad nueva `ventas-e-historial` recoge el comportamiento propio del ejercicio, y el resto ya estaba especificado.

### 2.7 Contratos heredados que este change no puede romper

- `libreria-frontend`: los `<tbody>` existen con id; los mensajes de estado existen y se alternan con `hidden`; **los identificadores, las clases y los textos visibles ya escritos no se modifican**.
- `presentacion-css`: no se agregan estilos en línea ni se modifican las clases existentes.
- Change 05: la semilla `DATOS_INICIALES` **no se muta**; todo se inserta como texto; `innerHTML` está prohibido; los scripts son clásicos, no módulos ES; `js/catalogo.js` **no se toca**.

---

## 3. Alcance

### 3.1 Incluido

| # | Alcance | Dónde |
|---|---|---|
| 1 | Composición de una venta: elegir cliente, elegir libro, escribir cantidad y agregar renglón | `ventas.html` |
| 2 | Agregar un libro que ya está en la venta **suma** la cantidad al renglón existente, sin crear otro, y lo informa | `ventas.html` |
| 3 | Edición en línea de la cantidad de un renglón y acción para quitarlo | `ventas.html` |
| 4 | Resumen con libro, cantidad, precio unitario y subtotal por renglón, y total de la venta, con dos decimales | `ventas.html` |
| 5 | Validación de la composición: cliente elegido, al menos un renglón, cantidades enteras mayores que cero | `ventas.html` |
| 6 | Confirmación: genera identificador y fecha, congela el precio unitario, el título y el nombre del cliente, calcula y guarda el total, limpia el formulario y muestra el resultado | `ventas.html` |
| 7 | Listado del historial con identificador, fecha, cliente, total y la acción de consultar el detalle | `historial.html` |
| 8 | Bloque de detalle con los datos de la venta y sus renglones, con precio unitario y subtotal derivados de los valores guardados | `historial.html` |
| 9 | Consultas y mutaciones del modelo para las ventas: listar, registrar y generar el identificador | `js/datos.js` |
| 10 | Regla pura de análisis de la cantidad | `js/validaciones.js` |

### 3.2 Excluido (explícito)

| Exclusión | Motivo |
|---|---|
| `localStorage` y cualquier otra persistencia | Reservado al Ejercicio 6 por la consigna |
| Editar o eliminar ventas confirmadas | «Las ventas confirmadas no se editan ni se eliminan desde la interfaz» |
| Pantalla para editar precios | «No se exige una pantalla para editar precios» (p. 5-6) |
| Gestión de stock, cobros y facturación fiscal | «No se gestiona stock, cobros ni facturación» (p. 1) |
| Inicio de sesión | «No se requiere … inicio de sesión real» (p. 1) |
| Validar que haya existencias del libro | No hay stock en el modelo; la consigna no lo pide |
| Marcar visualmente el renglón inválido con una clase nueva | Requeriría CSS nuevo; se declara en § 9.4 |
| `fetch`, API, base de datos, servidor | Excluido por la consigna |
| npm, bundlers, transpiladores, librerías, frameworks, CDN | Excluido por la consigna y por p. 6 |
| Cambios en `css/estilos.css` | No hace falta ninguno (§ 5.7) |
| Cambios en `index.html`, `libros.html` o `clientes.html` | Ningún elemento de la venta vive en esas vistas |
| Cambios en `js/catalogo.js` y `js/altas.js` | Sus funciones ya sirven; se reutilizan |
| Cambios en la semilla `DATOS_INICIALES` | El Ejercicio 5 no agrega datos de ejemplo; el caso de 1500 y 2000 se resuelve con datos de prueba (§ 2.4) |
| README | Ejercicio 6 |

---

## 4. Requisitos, escenarios y casos límite

### 4.1 Requisitos (del prompt, con el detalle de verificación)

| ID | Grupo | Requisito | Verificación prevista |
|---|---|---|---|
| R-01 | Funcional | Se puede componer, modificar y confirmar una venta con cliente y renglones válidos; la confirmación genera un registro en el historial. | S-01 a S-18, S-26 |
| R-02 | Estructura e interfaces | Cada renglón muestra libro, cantidad, precio unitario y subtotal; el resumen muestra el total; el historial muestra identificador, fecha, cliente y total con acceso a los renglones. | S-01 a S-06, S-19 a S-22 |
| R-03 | Datos y estados | Se rechaza confirmar sin cliente, sin renglones o con cantidad cero, negativa o decimal; un libro repetido no crea otro renglón; el precio unitario guardado es el de la confirmación. | S-07, S-11 a S-14, S-17, S-26, S-27 |
| R-04 | Calidad | Subtotal = cantidad × precio; total = suma de subtotales; importes con dos decimales; ventas confirmadas inmutables desde la interfaz. | S-05, S-06, S-22, S-24, S-25, S-26, S-27 |
| R-05 | Compatibilidad | Funciona al abrir `index.html` sin servidor. | S-29, S-30 |
| R-06 | Convenciones | Funciones acotadas y nombres comprensibles; datos de usuario insertados como texto en el DOM. | S-17, S-28 + revisión de nombres |

### 4.2 Escenarios observables

| ID | Escenario | Resultado esperado | Cubre |
|---|---|---|---|
| S-01 | Abro `ventas.html`. | Aparecen el selector de cliente, el de libro, el campo de cantidad, la acción de agregar renglón, la tabla de resumen con sus encabezados, el total y la acción de registrar la venta. | R-02, R-05 |
| S-02 | Miro los dos selectores. | El de cliente lista los clientes del conjunto local; el de libro lista los libros con su precio. | R-02 |
| S-03 | Elijo un libro, escribo 2 y agrego un renglón. | Aparece una fila con libro, cantidad 2, precio unitario y subtotal. | R-01, R-02 |
| S-04 | Agrego un segundo renglón de otro libro. | La tabla muestra dos renglones, en el orden en que se agregaron. | R-01, R-02 |
| S-05 | Miro el total con dos renglones. | Es la suma de los subtotales. | R-04 |
| S-06 | Miro cualquier importe. | Se presenta con dos decimales, con el mismo formato de moneda que el catálogo. | R-04 |
| S-07 | Agrego un libro que ya está en la venta. | **No** se crea un segundo renglón: el existente suma la cantidad y un mensaje informa cuántos Exemplares quedan. | R-03 |
| S-08 | Abro `ventas.html` sin haber agregado nada. | Se muestra «No hay renglones en la venta.» | R-02 |
| S-09 | Cambio la cantidad de un renglón. | El subtotal de esa fila y el total se recalculan al instante. | R-01, R-04 |
| S-10 | Quito un renglón. | Desaparece de la tabla y el total se recalcula. | R-01 |
| S-11 | Pongo una cantidad inválida en un renglón (cero, negativa o decimal). | El renglón queda inválido, su subtotal muestra «—», y la confirmación queda bloqueada con un motivo. | R-03 |
| S-12 | Intento confirmar sin elegir cliente. | No se registra ninguna venta y el motivo aparece junto al formulario. | R-03 |
| S-13 | Intento confirmar sin renglones. | No se registra ninguna venta y el motivo aparece junto al formulario. | R-03 |
| S-14 | Intento confirmar con una cantidad inválida en un renglón. | No se registra ninguna venta y el motivo aparece junto al formulario. | R-03 |
| S-15 | Confirmo una venta válida. | Aparece un mensaje de resultado con el identificador y el total; el formulario queda limpio y la tabla de renglones vacía. | R-01 |
| S-16 | Confirmo una venta y se dibuja el historial. | La venta está en el listado, con su identificador, su fecha, su cliente y su total. La **otra** vista del historial, abierta desde el menú, **no** la muestra: el estado no se persiste entre páginas (§ 9.5, P-02) | R-01, R-02 |
| S-17 | Consulto el detalle de la venta. | El renglón muestra el **precio unitario congelado** y el subtotal derivado; el cliente aparece con su nombre copiado. | R-03, R-06 |
| S-18 | Un libro o un cliente con marcado en su nombre. | Se muestra el texto literal en la tabla y en el detalle, sin interpretarlo como HTML. | R-06 |
| S-19 | Abro `historial.html`. | El listado muestra las ventas con encabezados de identificador, fecha, cliente y total, y la acción de consultar el detalle de cada una. | R-02 |
| S-20 | Abro `historial.html` sin pedir ningún detalle. | El bloque de detalle permanece oculto **y sus campos están vacíos**. | R-02 |
| S-21 | Hago clic en «Ver detalle» de una venta. | Se muestra el bloque con identificador, fecha, cliente, total y la tabla de renglones. | R-02 |
| S-22 | Miro los renglones del detalle. | Cada uno muestra libro, cantidad, precio unitario y subtotal. | R-02, R-04 |
| S-23 | Hago clic en «Cerrar detalle». | El bloque se oculta y sus campos quedan vacíos. | R-02 |
| S-24 | Intento editar o eliminar una venta desde el historial. | No hay ninguna acción posible: el historial solo consulta. | R-04 |
| S-25 | No hay ventas registradas. | Se muestra «No hay ventas registradas.» | R-02 |
| S-26 | Confirmo una venta, **cambio el precio del libro en el catálogo** y vuelvo al historial. | El detalle sigue mostrando el precio unitario confirmado, y el subtotal y el total no cambian. | R-03, R-04 |
| S-27 | Los renglones del historial no se vuelven a leer del catálogo. | Cambiar el precio del catálogo no altera ni un solo importe del historial. | R-03, R-04 |
| S-28 | Registro un libro y un cliente con marcado en el nombre y confirmo. | El historial muestra el texto literal. | R-06 |
| S-29 | Abro `ventas.html` o `historial.html` con `file://`. | Todo funciona sin servidor. | R-05 |
| S-30 | Agrego un renglón o confirmo una venta. | La página **no** se recarga y la URL no cambia. | R-05 |
| S-31 | Confirmo una venta y recargo la página. | La venta confirmada **no** está: en este ejercicio no hay persistencia. Es el límite declarado (§ 9.5) | R-05 |
| S-32 | Miro la fecha y el identificador de la venta confirmada. | La fecha es la de la confirmación, en `YYYY-MM-DD`; el identificador sigue el patrón `vt-YYYY-NNNN` y es correlativo dentro del año. | R-01 |

### 4.3 Casos límite

| ID | Caso | Regla esperada |
|---|---|---|
| E-01 | Cantidad con espacios al principio o al final (« 2 ») | Se recortan y valen 2 |
| E-02 | Cantidad decimal («1.5») | Rechazada: no es un número entero |
| E-03 | Cantidad negativa («-2») | Rechazada: no es mayor que cero |
| E-04 | Cantidad cero | Rechazada: no es mayor que cero |
| E-05 | Cantidad vacía | Rechazada: falta la cantidad |
| E-06 | Cantidad no numérica («abc») | `type="number"` descarta el texto y deja el valor vacío: el mensaje es el de la cantidad vacía. No se puede distinguir del vacío, y la consigna no pide distinguirla |
| E-07 | El mismo libro agregado dos veces con cantidades distintas | La segunda suma: el renglón queda con la suma y se informa |
| E-08 | El mismo libro agregado dos veces con la misma cantidad | También suma: el renglón queda con el doble |
| E-09 | Se agrega un renglón **sin** haber elegido cliente | Se permite: el cliente se valida al confirmar, no al agregar |
| E-10 | Se quita el último renglón | La tabla queda vacía y vuelve a mostrarse «No hay renglones en la venta.» |
| E-11 | Se edita una cantidad a un valor inválido | La fila queda inválida, su subtotal muestra «—», el total excluye esa fila y la confirmación se bloquea |
| E-12 | Se vuelve a poner una cantidad válida | La fila vuelve a estar bien: el subtotal y el total se recalculan |
| E-13 | El precio del libro cambia **mientras** se compone la venta | Al confirmar se congela el precio **vigente en ese momento** |
| E-14 | Se recarga la página con una venta en curso | La venta en curso se pierde: no hay persistencia (Ejercicio 6) |
| E-15 | La primera venta nueva del ejercicio | Recibe el identificador correlativo siguiente al de la semilla: `vt-2026-0003` |
| E-16 | Se cruza el cambio de año | La secuencia del identificador se reinicia por año: `vt-2027-0001` |
| E-17 | La fecha se arma con la hora del navegador | Se usa la fecha **local**, no la de UTC: `toISOString()` podría dejar un día atrás |
| E-18 | Un libro agregado a la venta cambia de título en el catálogo | El renglón congelado conserva el título del momento de la confirmación |

---

## 5. Estructura, componentes e interfaces propuestas

### 5.1 Archivos

| Archivo | Acción | Nota |
|---|---|---|
| `js/ventas.js` | **Crear** | Composición de la venta, cálculos, confirmación y vista de Ventas |
| `js/historial.js` | **Crear** | Vista del historial y del detalle |
| `js/datos.js` | **Modificar** | `obtenerVentas()`, `agregarVenta()`, `generarIdVenta()` |
| `js/validaciones.js` | **Modificar** | Regla pura de análisis de la cantidad |
| `js/inicio.js` | **Modificar** | Registra los eventos de la venta y del historial, y llama a sus renders |
| `ventas.html` | **Modificar** | `novalidate` y las etiquetas `<script>` |
| `historial.html` | **Modificar** | Las etiquetas `<script>` |
| `js/catalogo.js`, `js/altas.js` | **Sin cambios** | Se reutilizan `formatearPrecio()`, `crearFilaLibro()` y los dos pintores de opciones |
| `index.html`, `libros.html`, `clientes.html` | **Sin cambios** | Ningún elemento de la venta vive en esas vistas |
| `css/estilos.css` | **Sin cambios** | § 5.7 |
| `docs/06-venta-historial/SPEC.md` | **Crear** | Este documento |
| `docs/06-venta-historial/PLAN.md` | **Crear en la Fase 2** | Pendiente de aprobación |

### 5.2 Mapa de módulos

```
   datos-iniciales.js          semilla  (nunca se muta)
          |
          v
   datos.js        estado vivo + consultas + mutaciones
          |        obtenerVentas() / agregarVenta() / generarIdVenta()
          |
          +---> validaciones.js   reglas puras, sin DOM
          |       (de las altas) + leerCantidad()
          |
          +---> catalogo.js       formatearPrecio()  (se reutiliza)
          |
          +---> altas.js          pintarOpcionesClienteVenta() / LibroVenta()
          |                       (se reutilizan, sin cambios)
          |
          +---> ventas.js         la venta en curso y la vista Ventas
          |       agregarRenglon() / cambiarCantidad() / quitarRenglon()
          |       recalcular() / confirmarVenta() / renderizarResumen()
          |
          +---> historial.js      la vista Historial
          |       renderizarHistorial() / mostrarDetalle() / cerrarDetalle()
          v
   inicio.js      arranque: detecta la vista y conecta lo que existe
```

`js/ventas.js` y `js/historial.js` quedan separados porque viven en **documentos distintos**: `ventas.html` carga el primero y `historial.html` el segundo. Es el mismo criterio que ya separa `js/catalogo.js` (Catálogo) de `js/altas.js` (Libros y Clientes).

### 5.3 Interfaces

**`js/validaciones.js`** — agrega una regla pura al archivo que ya existe:

| Función | Responsabilidad | Devuelve |
|---|---|---|
| `leerCantidad(texto)` | Interpreta el texto de una cantidad: entero mayor que cero, o `null` si no lo es | `number \| null` |

**`js/datos.js`** — agrega al modelo:

| Función | Responsabilidad |
|---|---|
| `obtenerVentas()` | Lista de ventas del estado vivo, en el orden en que se registraron |
| `generarIdVenta(fecha)` | Identificador correlativo del año de la venta: `vt-YYYY-NNNN` |
| `agregarVenta(datos)` | Crea la venta con su identificador y su total, y la incorpora al estado vivo |

**`js/ventas.js`** — la venta en curso y la vista:

| Función | Responsabilidad |
|---|---|
| `renglonesEnCurso()` | Renglones de la venta que se está componiendo: `{ libroId, cantidad }` |
| `agregarRenglon(libroId, cantidad)` | Agrega un renglón; si el libro ya está, **suma** la cantidad y devuelve un aviso |
| `cambiarCantidad(libroId, cantidad)` | Cambia la cantidad de un renglón |
| `quitarRenglon(libroId)` | Quita un renglón |
| `recalcular()` | Recalcula los subtotales y el total de la venta en curso |
| `pintarResumen()` | Dibuja la tabla de renglones y el total |
| `alAgregarRenglon(evento)` | Atiende el clic en «Agregar renglón» |
| `alCambiarCantidad(evento)` | Atiende el cambio de la cantidad de un renglón |
| `alQuitarRenglon(evento)` | Atiende el clic en «Quitar» |
| `alConfirmarVenta(evento)` | Previene el envío, valida la composición, registra la venta y limpia el formulario |
| `validarComposicion()` | Revisa cliente, renglones y cantidades antes de confirmar |

**`js/historial.js`** — la vista del historial:

| Función | Responsabilidad |
|---|---|
| `renderizarHistorial()` | Dibuja el listado de ventas y alterna su estado vacío |
| `mostrarDetalle(venta)` | Muestra el bloque de detalle con los datos de la venta y sus renglones |
| `cerrarDetalle()` | Oculta el bloque y vacía sus campos |
| `alVerDetalle(evento)` | Atiende el clic en «Ver detalle» |

### 5.4 Forma de los datos

**La venta en curso** — estado transitorio del formulario, que **no** es parte del modelo:

```js
{ libroId: "li-hobbit", cantidad: 2 }
```

Solo guarda el identificador del libro y la cantidad. El título y el precio se **leen del catálogo** mientras se compone, para que la tabla del resumen muestre siempre el precio vigente.

**La venta registrada** — la forma de la semilla, sin cambios:

```js
{
  id: "vt-2026-0003",
  fecha: "2026-10-20",
  clienteId: "cl-martina-ferreyra",
  clienteNombre: "Martina Ferreyra",
  renglones: [
    { libroId: "li-hobbit", titulo: "El Hobbit", cantidad: 2, precioUnitario: 21900.0 }
  ],
  total: 43800.0
}
```

| Registro | Campo | Origen |
|---|---|---|
| Venta | `id` | `generarIdVenta(fecha)`: `vt-` + año + número correlativo de 4 dígitos |
| Venta | `fecha` | La fecha **local** de la confirmación, en `YYYY-MM-DD` |
| Venta | `clienteId` | El `value` del selector de cliente |
| Venta | `clienteNombre` | Copia del nombre del cliente en el momento de confirmar |
| Venta | `renglones[]` | Copia congelada de los renglones de la venta en curso |
| Venta | `renglones[].libroId` | Identificador del libro |
| Venta | `renglones[].titulo` | Copia del título del libro en el momento de confirmar |
| Venta | `renglones[].cantidad` | La cantidad de la venta en curso |
| Venta | `renglones[].precioUnitario` | Copia del precio **vigente en el momento de confirmar** |
| Venta | `total` | La suma de los subtotales, calculada al confirmar |

El renglón **no guarda el subtotal**: se deriva como `cantidad × precioUnitario` a partir de los valores guardados, de modo que el detalle no pueda desincronizarse del total.

### 5.5 Reglas de cálculo y validación, en detalle

**Cantidad.** `leerCantidad(texto)` recorta los espacios y acepta únicamente un entero mayor que cero:

| Entrada | Resultado |
|---|---|
| «2» | 2 |
| « 2 » | 2 |
| «0» | `null` — no es mayor que cero |
| «-2» | `null` — no es mayor que cero |
| «1.5» | `null` — no es un número entero |
| «1,5» | `null` — el `type="number"` descarta la coma y deja el valor vacío |
| «abc» | `null` — el `type="number"` descarta el texto y deja el valor vacío |
| «» | `null` — falta la cantidad |

Los tres motivos que la consigna enumera —cero, negativa y decimal— tienen **mensajes distintos**; la cantidad vacía y la no numérica comparten uno, porque el control `type="number"` las hace indistinguibles (E-06).

**Subtotal y total.** El subtotal es `cantidad × precioUnitario`; el total es la suma de los subtotales. Los importes se presentan con `formatearPrecio()`, que ya existe en `js/catalogo.js` y da el formato de moneda `es-AR` con dos decimales: «$ 43.800,00». Es **el mismo formato que muestra el catálogo**, de modo que el docente no ve dos convenciones de precios distintas en la misma aplicación.

**Identificador.** `generarIdVenta(fecha)` toma el año de la fecha y el siguiente correlativo entre las ventas de ese año, con cuatro dígitos: `vt-2026-0003`, `vt-2026-0004`… La semilla aporta `vt-2026-0001` y `vt-2026-0002`.

**Fecha.** La fecha **local** de la confirmación, en `YYYY-MM-DD`. Se arma con las partes de la fecha local, nunca con `toISOString()`, que devuelve UTC y podría dejar un día atrás (E-17).

**Renglón repetido.** Al agregar un libro que ya está en la venta, **se suma** la cantidad al renglón existente y se informa con un mensaje visible; **nunca** se crea un segundo renglón (E-07, E-08, S-07).

**Confirmación.** Se bloquea, con un motivo visible junto al formulario, cuando:

| Motivo | Mensaje |
|---|---|
| No hay cliente elegido | «Elegí un cliente para la venta.» |
| No hay renglones | «Agregá al menos un renglón a la venta.» |
| Algún renglón tiene una cantidad inválida | «La cantidad de «El Hobbit» debe ser un número entero mayor que cero.» |

### 5.6 Contrato con el DOM existente

| Elemento existente | Uso en este change |
|---|---|
| `form#ventas-form-venta` | Se escucha el `submit`; se llama a `preventDefault()` |
| `p#ventas-mensaje-error` | Destino de los motivos de rechazo. **Está dentro del `<form>`**, así que queda pegado al formulario |
| `p#mensaje-exito` | Destino del resultado: renglón agregado, duplicado combinado y venta confirmada |
| `select#venta-cliente` | Se lee su `value` al confirmar; su opciones ya las puebla `js/altas.js` |
| `select#venta-libro` | Se lee su `value` al agregar un renglón; sus opciones ya las puebla `js/altas.js` |
| `input#venta-cantidad` | Se lee su `value`; el texto se analiza con `leerCantidad()` |
| `button#venta-boton-agregar` | Se escucha su `click`; es `type="button"`, así que no dispara el envío del formulario |
| `tbody#venta-renglones` | Destino de las filas de renglones |
| `td#venta-total` | Destino del total de la venta en curso |
| `p#venta-estado-vacio` | Se alterna con `hidden` según haya renglones o no |
| `button#venta-boton-confirmar` | Es `type="submit"`: el `submit` del formulario lo dispara, y el manejador llama a `preventDefault()` |
| `tbody#historial-listado` | Destino de las filas de ventas |
| `p#historial-estado-vacio` | Se alterna con `hidden` según haya ventas o no |
| `section#historial-detalle` | Se muestra y se oculta; sus `<dd>` se llenan y se vacían |
| `tbody#historial-detalle-renglones` | Destino de las filas de renglones del detalle |
| `button#historial-detalle-cerrar` | Se escucha su `click` para ocultar y vaciar el detalle |
| `table#historial-tabla`, `table#venta-resumen-tabla` | No se modifican: se les agregan las celdas que ya declaran su `<thead>` |

**No se agrega ni se quita ningún `id`, ninguna clase y ningún texto visible ya escrito.** Los únicos elementos nuevos son las filas que el JavaScript dibuja y los `<input type="number">` de la cantidad editable, que se crean en tiempo de ejecución.

### 5.7 Por qué `css/estilos.css` no se toca

| Necesidad | Clase existente | Nota |
|---|---|---|
| Tabla de renglones y tabla del historial | `.tabla`, `.tabla-desplazable` | Ya aplicadas |
| Tabla de renglones del detalle | `.tabla.tabla--compacta` | **Ya aplicada** en el marcado del Historial |
| Columnas que no se parten (ISBN, precios) | `.tabla .celda-atomica` | La usa `crearFilaLibro()`; los importes nuevos la usan igual |
| Datos del detalle | `.lista-detalle` con `dt`/`dd` | **Ya aplicada** en el marcado del Historial |
| Listado vacío | `.estado-vacio` | Ya aplicado a los dos `p` de estado |
| Mensajes | `.mensaje`, `.mensaje--error`, `.mensaje--exito` | Ya aplicados |
| Botones de las acciones de fila | `.boton.boton--secundario` | La usan «Quitar» y «Ver detalle»; el tamaño de la tabla y el contraste ya están resueltos por el CSS de `.boton` |
| La celda de cantidad editable | `.campo input` | **No aplica**: el `<input>` de la fila vive dentro de una `td`, no dentro de un `.campo`, así que no recibe el ancho completo ni el padding de los campos de formulario. Hereda el tamaño de fuente del cuerpo y se lee bien |

> **Nota sobre la celda editable.** El `<input type="number">` de la cantidad se crea dentro de una `td`, fuera de cualquier `.campo`. Por lo tanto **no** recibe `width: 100%`, `padding` ni el `border` de `.campo input`, y eso es lo correcto: un campo de formulario dentro de una celda de tabla se vería desproporcionado. El tamaño de la celda lo fija la tabla.

### 5.8 Reglas de la implementación

| Regla | Detalle |
|---|---|
| Inserción de datos | `document.createElement` + `textContent`. **Prohibido `innerHTML`** en todo el proyecto, incluso con texto fijo |
| Eventos | `addEventListener`. **Prohibidos los atributos `on*`** en el HTML |
| Estado | Una sola variable con el estado vivo. La semilla `DATOS_INICIALES` **no se muta** |
| La venta en curso | Vive en `js/ventas.js`, como estado del formulario. **No** se guarda en `estado`: no es un registro de la aplicación, es una composición en curso |
| Precio unitario | Se **lee vivo** del catálogo mientras se compone y se **copia** al renglón al confirmar. El historial nunca lo vuelve a leer |
| Estilo | No se agregan estilos en línea ni se modifican las clases existentes |
| Orden de los `<script>` | `datos-iniciales.js` → `datos.js` → `validaciones.js` → `catalogo.js` → `altas.js` → `ventas.js` / `historial.js` → `inicio.js` |
| Numérico | `libroId` y `cantidad` de los renglones en curso se guardan como el `value` del `<option>` (texto) y como entero |

---

## 6. Estados y manejo de errores

| Situación | Comportamiento esperado |
|---|---|
| Venta en curso sin renglones | La tabla vacía y «No hay renglones en la venta.» visible |
| Renglón agregado | Una fila nueva, el subtotal y el total recalculados, y un mensaje con el resultado |
| Libro repetido | **No** se crea una fila: la cantidad del renglón existente suma y un mensaje informa el nuevo total de esa fila |
| Renglón con cantidad inválida | La fila queda inválida: su subtotal muestra «—», el total excluye esa fila y la confirmación se bloquea |
| Renglón quitado | La fila desaparece y el total se recalcula |
| Confirmación sin cliente | No se registra ninguna venta; el motivo aparece en `#ventas-mensaje-error`; la venta en curso **se conserva** |
| Confirmación sin renglones | Ídem |
| Confirmación con cantidades inválidas | Ídem |
| Confirmación válida | La venta se registra, `#mensaje-exito` muestra el identificador y el total, el formulario se limpia y la venta en curso queda vacía |
| Historial sin ventas | «No hay ventas registradas.» visible |
| Historial con ventas | Una fila por venta, con la acción de consultar el detalle |
| Detalle no solicitado | `#historial-detalle` oculto y sus `<dd>` vacíos |
| Detalle solicitado | El bloque se muestra con los datos de la venta y sus renglones |
| Detalle cerrado | El bloque se oculta y sus `<dd>` quedan vacíos |
| Error de JavaScript | La página sigue siendo legible: el HTML no depende del script para mostrar su contenido |

### 6.1 Forma de los mensajes

Los textos de error ya escritos en el Change 01 —«No se pudo registrar la venta.»— se **conservan** y los motivos concretos se **agregan** detrás:

```
   No se pudo registrar la venta. Agregá al menos un renglón a la venta.
```

Los mensajes de resultado, en `#mensaje-exito`:

```
   Operación realizada correctamente. Se registró la venta vt-2026-0003 por $ 43.800,00.
   Operación realizada correctamente. Se agregó «El Hobbit» a la venta.
   Operación realizada correctamente. Se agregaron 2 unidades más de «El Hobbit»; el renglón queda con 3.
```

El texto de los libros y del cliente se inserta con `textContent`, de modo que un nombre con marcado se muestra literal (S-18, S-28).

### 6.2 Limpieza tras confirmar

Al confirmar, el formulario queda limpio: el selector de cliente vuelve a su primera opción, el de libro también, el campo de cantidad queda vacío, la venta en curso se vacía y la tabla de renglones vuelve a su estado vacío. Es lo que pide la consigna: «La confirmación limpia el formulario para una nueva venta».

---

## 7. Restricciones técnicas y convenciones

| # | Restricción | Origen |
|---|---|---|
| 1 | HTML, CSS y JavaScript nativos. Sin librerías, frameworks ni CDN | Prompt, consigna p. 1 y p. 6 |
| 2 | Sin `fetch`, API, base de datos ni servidor | Prompt, consigna p. 1 |
| 3 | Sin `localStorage` en este change | Prompt (reservado al Ejercicio 6) |
| 4 | Sin npm ni herramientas de compilación | Prompt |
| 5 | Debe funcionar abriendo los archivos con `file://` | Prompt, consigna |
| 6 | Los scripts **no pueden ser módulos ES**: con `file://` el origen es `null` y Chrome/Edge bloquean los `import` | Verificado en Edge headless en el Change 03 |
| 7 | Los datos del modelo se insertan como texto, nunca como HTML | Consigna p. 3, R-04 |
| 8 | Sin estilos en línea, sin `<style>`, sin atributos `on*` | Contrato del Change 02 |
| 9 | Funciones acotadas con una responsabilidad y nombres comprensibles | Consigna p. 6, R-06 |
| 10 | Los identificadores existentes del HTML no se modifican | Contrato del Change 01 |
| 11 | Los formularios de alta desactivan la validación del navegador | Spec viva `libreria-frontend` («Validaciones diferidas»), ya vigente desde el Change 05 |
| 12 | Los controles no declaran `required`, `pattern`, `min`, `max` ni `step` | Spec viva `libreria-frontend` («Validaciones diferidas») |

---

## 8. Criterios de aceptación

| ID | Criterio | Requisitos | Verificación |
|---|---|---|---|
| CA-01 | Una venta válida de **2 × 1500 y 1 × 2000** muestra subtotales 3000,00 y 2000,00 y total 5000,00, y queda en el historial con sus renglones | R-01, R-02, R-04 | En el arnés, con **datos de prueba**: se fijan 1500 y 2000 como precios de dos libros (§ 2.4) y se comprueban los tres importes y la presencia en el historial |
| CA-02 | No se confirma sin cliente, sin renglones, con cantidad cero, negativa o decimal | R-03 | S-12, S-13, S-14, E-02, E-03, E-04: en cada caso, la lista de ventas no crece y el motivo es visible |
| CA-03 | Un libro repetido no crea otro renglón | R-03 | S-07, E-07, E-08: el número de filas no cambia y la cantidad del renglón existente suma |
| CA-04 | El historial conserva precio unitario, subtotales y total aunque cambie el precio del catálogo; las ventas no se editan ni se eliminan | R-03, R-04 | S-25, S-26, S-27: se cambia el precio en `estado.libros` y el historial no se altera; el historial no ofrece acciones de edición ni eliminación |
| CA-05 | Tras confirmar se limpia el formulario y se muestra un mensaje de resultado | R-01 | S-15: `#mensaje-exito` visible con el identificador, el formulario limpio y la tabla de renglones vacía |
| CA-06 | El bloque de detalle permanece oculto y vacío hasta que se solicita | R-02 | S-20, S-23: `#historial-detalle` oculto y sus `<dd>` vacíos al abrir la vista y tras cerrar un detalle |
| CA-07 | Los importes se presentan con dos decimales y con el mismo formato que el catálogo | R-04 | S-06: comparación con el texto de `formatearPrecio()` |
| CA-08 | Los datos escritos por la persona usuaria se insertan como texto | R-06 | S-18, S-28: un título y un nombre con marcado se muestran literales; búsqueda de `innerHTML` → 0 coincidencias |
| CA-09 | Funciona con `file://`, sin servidor, y sin recargar tras agregar o confirmar | R-05 | S-29, S-30 en Edge 155.0.4283.62 con `file://` |
| CA-10 | No se incorpora trabajo excluido | — | Búsquedas de `fetch(`, `localStorage`, `sessionStorage`, `innerHTML`, `on*=`, `http://` → 0 coincidencias; `js/catalogo.js`, `js/altas.js`, `index.html`, `libros.html`, `clientes.html`, `css/estilos.css` y la semilla con sus hashes intactos |
| CA-11 | La venta en curso no se persiste y la venta confirmada no sobrevive a la recarga | R-05 | S-31, E-14: comportamiento declarado y verificado, no una omisión |

Además, con lo pedido por el prompt: los controles **aprobados, fallidos, omitidos y pendientes** se distinguen en el informe, y **ningún control no ejecutado se presenta como aprobado**.

---

## 9. Supuestos, información pendiente y decisiones

### 9.1 Supuestos

| ID | Supuesto | Si fuera falso |
|---|---|---|
| A-01 | La estructura HTML del Change 01 se mantiene: no se agregan ni se cambian `id`, clases ni textos visibles | Cambiaría el alcance y el contrato con el Change 01 |
| A-02 | Los estilos existentes alcanzan para la tabla de renglones, el detalle y los botones de fila | Habría que tocar `css/estilos.css`, hoy fuera de alcance |
| A-03 | La semilla `DATOS_INICIALES` no se muta: la aplicación trabaja sobre una copia | El Ejercicio 6 perdería la semilla original |
| A-04 | El precio se muestra con el mismo formato de moneda que el catálogo (`es-AR`, dos decimales) | Cambiaría solo la presentación de una celda |
| A-05 | El caso manual de 1500 y 2000 se ejecuta con **datos de prueba**, no con la semilla | Habría que agregar dos libros con esos precios a la semilla, que es del Change 03 |
| A-06 | La venta en curso es estado del formulario y se pierde al recargar | Cambiaría el alcance: sin persistencia no hay más opción |
| A-07 | Se puede agregar un renglón antes de elegir cliente; el cliente se valida al confirmar | Habría que bloquear el alta de renglones sin cliente, que la consigna no pide |
| A-08 | Los scripts se cargan en orden y comparten variables globales por responsabilidad | Habría que revisar el orden de los `<script>` |

### 9.2 Decisiones resueltas (20/10/2026)

| ID | Decisión | Respuesta | Consecuencia en esta entrega |
|---|---|---|---|
| **D-01** | Qué pasa cuando se agrega un libro que ya está en la venta | **Se suma la cantidad al renglón existente, con un mensaje visible que lo informa** | No se crea nunca un segundo renglón. El aviso evita que la suma pase inadvertida. La consigna permite las dos opciones (p. 4) y el prompt no cerraba la decisión |
| **D-02** | Formato del identificador y de la fecha | **`vt-YYYY-NNNN` y `YYYY-MM-DD`** | Es la convención de la semilla: `vt-2026-0001` con fecha `2026-03-14`. La primera venta nueva sería `vt-2026-0003` |
| **D-03** | Numeración del change y de los documentos | **06** | El prompt pide «Change 05» porque su numeración sigue a los ejercicios del parcial, pero el `05` ya lo ocupa `05-altas-libros-clientes`. Es la misma decisión que se tomó en el Change 05 (D-07) |
| **D-04** | Cuándo se copia el precio unitario | **Al confirmar, no al agregar** | La consigna lo dice en la misma frase que el registro de la venta: «Al confirmar, se registra… El precio unitario se copia al renglón como valor histórico». Mientras se compone, el renglón muestra el precio **vigente**, que es lo que el vendedor espera ver; el precio congelado es el del momento de confirmar (E-13) |
| **D-05** | Dónde vive la venta en curso | **En `js/ventas.js`, como estado del formulario** | No es un registro de la aplicación sino una composición en curso. `estado` sigue siendo el modelo: libros, clientes y ventas confirmadas |
| **D-06** | Formato de los importes | **Se reutiliza `formatearPrecio()`** | El resumen y el historial muestran «$ 43.800,00», el mismo formato que el catálogo. Dos decimales, como pide la consigna, y una sola convención de precios en toda la aplicación |
| **D-07** | Cómo se edita la cantidad de un renglón | **En línea, con un `<input type="number">` en la celda de Cantidad** | No es una invención: la spec viva de `libreria-frontend` ya exige que «cada renglón expone su cantidad como valor editable». El control queda fuera de `.campo`, así que no necesita CSS |
| **D-08** | `novalidate` en el formulario de venta | **Sí** | Sin esto, escribir «1.5» dispara el `stepMismatch` del navegador, que cancela el envío: el mensaje de R-03 no llegaría a verse. La spec viva «Validaciones diferidas» ya lo exige para todo formulario de alta |
| **D-09** | Un renglón con cantidad inválida | **Su subtotal muestra «—», el total excluye esa fila y la confirmación se bloquea** | Mostrar «0» sería mentir. La fila inválida se ve en pantalla y el motivo se nombra al confirmar |
| **D-10** | Orden de las ventas en el historial | **De la más reciente a la más antigua** | La venta recién confirmada aparece arriba, que es lo que el docente quiere ver al abrir el historial. La semilla queda en orden inverso al actual, lo que no rompe ningún requisito |
| **D-11** | Mensaje de resultado al agregar un renglón | **En `#mensaje-exito`, con el texto de la operación** | Es el mismo patrón del Change 05, donde `#mensaje-exito` dice «Se registró el libro «X».» detrás de la frase del Change 01 |

### 9.3 Información pendiente

| ID | Dato | Efecto | Estado |
|---|---|---|---|
| PD-01 | Herramientas autorizadas por el docente | `{{DATO_PENDIENTE: confirmar el editor y la consola de referencia}}` | Bloquea el informe de comprobaciones del PLAN. En esta máquina: Edge 155.0.4283.62, Node v24.19.0, Python 3.14.0 |
| PD-02 | Arnés de verificación automatizado | `{{DATO_PENDIENTE: confirmar si se mantiene el arnés headless fuera del proyecto, como en el D-06 del SPEC-05}}` | No bloquea el SPEC; se define en el PLAN |
| PD-03 | Navegador de referencia adicional | Firefox ya no está instalado | Se verificará en Edge 155.0.4283.62 |

### 9.4 Lo que este SPEC no decide

- El contenido línea por línea de cada función: es implementación, no contrato.
- Si el historial usa `#mensaje-exito` para avisar que se abrió un detalle. La propuesta es **no usarlo**: el bloque de detalle ya muestra el identificador de la venta, y un mensaje sería redundante. El elemento existe en las cinco vistas como parte del armazón común.
- La marca visual del renglón inválido (una clase nueva, un `aria-invalid`): requeriría CSS nuevo. La consigna no lo pide y la fila inválida ya se distingue por el «—» del subtotal y por el bloqueo de la confirmación.
- La marca visual del botón «Quitar» dentro de la celda de acciones.

### 9.5 Propuestas pendientes (detectadas y **no** implementadas)

| ID | Propuesta | Dónde |
|---|---|---|
| P-01 | El caso manual de la consigna usa precios de 1500 y 2000 que la semilla no tiene. Podría evaluarse si el catálogo tuviera algún libro barato, o si los precios de la venta en curso se pudieran forzar desde la interfaz. En este ejercicio se resuelve con datos de prueba (§ 2.4) | Consigna p. 5 |
| P-02 | La venta en curso y las ventas confirmadas se pierden al recargar. Es el límite del Ejercicio 5; el Ejercicio 6 lo resuelve | `js/datos.js` |
| P-03 | El historial no tiene un contenedor de error, a diferencia de las otras vistas. No hace falta: la vista no rechaza nada | `historial.html` |
| P-04 | La venta en curso no sobrevive a un cambio de vista a mitad de composición. Con `localStorage` (Ejercicio 6) se podría persistir | `js/ventas.js` |

---

## 10. Trazabilidad

| Requisito | Elementos del SPEC |
|---|---|
| R-01 | §1, §3.1 (puntos 1-6), §4.2 (S-01 a S-04, S-09, S-10, S-15, S-16, S-32), §8 (CA-01, CA-05) |
| R-02 | §3.1 (puntos 1, 4, 7, 8), §4.2 (S-01 a S-06, S-19 a S-22), §5.6, §8 (CA-01, CA-06) |
| R-03 | §4.1, §4.2 (S-07, S-11 a S-14, S-17, S-26, S-27), §4.3 (E-02 a E-13), §5.5, §6, §8 (CA-02, CA-03, CA-04) |
| R-04 | §4.2 (S-05, S-06, S-22, S-24 a S-27), §4.3 (E-11, E-12), §5.4, §5.5, §8 (CA-01, CA-04, CA-07) |
| R-05 | §4.2 (S-29 a S-31), §4.3 (E-14), §7, §8 (CA-09, CA-11) |
| R-06 | §4.2 (S-18, S-28), §5.3, §5.8, §8 (CA-08) |

---

> **Estado:** este SPEC v1 se presenta para revisión. Habilita el PLAN (Fase 2) y, con la autorización posterior de la persona usuaria, la implementación (Fase 3). **Ninguna línea de código del producto se modificó al escribir este documento.**
