# Librería ABC

Frontend de una librería — Parcial 1 de Programación III, Unidad «HTML, CSS y JavaScript».
Tecnicatura Universitaria en Programación, UTN. Revisor de la unidad: Prof. Matías Torres.

La aplicación muestra el catálogo de una librería, permite registrar libros y clientes,
compone ventas simuladas con sus importes, conserva un historial consultable de las ventas
y **guarda los registros en el navegador**, de modo que sobreviven a la recarga.

---

## 1. Integrantes

| Integrante | Ejercicios | Qué hizo |
|---|---|---|
| **María de los Ángeles Zalazar** | 1, 2 y 3 | Estructura HTML y navegación, CSS adaptable, datos locales, catálogo y filtro por título |
| **Julieta Cecilia Herrera** | 4, 5 y 6 | Alta de libros y clientes, venta simulada e historial, persistencia en `localStorage` y documentación de la entrega |

---

## 2. Cómo abrir el proyecto (sin npm)

No hay nada que instalar, compilar ni servir. La aplicación es HTML, CSS y JavaScript nativos.

1. Descargar o descomprimir la carpeta del proyecto.
2. **Hacer doble clic en `index.html`**: se abre en el navegador con la dirección `file:///…/index.html`.
3. Listo. La navegación del menú lleva a las otras cuatro vistas.

> Si el navegador no muestra nada al abrir el archivo, probá con otro navegador (Edge, Chrome o Firefox). No hace falta ningún comando, ni `npm install`, ni un servidor local.

También funciona servida por HTTP (por ejemplo, con cualquier servidor estático), pero **la forma de uso que se entrega y se documenta es la apertura directa del archivo**.

---

## 3. Navegación entre las vistas

La cabecera de las cinco vistas tiene el mismo menú, y el enlace de la vista abierta queda marcado.

| Vista | Archivo | Qué se ve |
|---|---|---|
| **Catálogo** | `index.html` | La marca de la librería, el buscador con criterio (título, autor, género o editorial), rango de precio y acción «Quitar filtros», y la tabla de libros con título, ISBN, editorial, género, autores y precio |
| **Libros** | `libros.html` | El formulario de alta de libros y el listado de los libros registrados |
| **Clientes** | `clientes.html` | El formulario de alta de clientes y el listado de los clientes registrados |
| **Ventas** | `ventas.html` | La composición de la venta: selector de cliente, selector de libro, cantidad, renglones y total |
| **Historial** | `historial.html` | El listado de ventas y el detalle de cada una, con sus renglones |

---

## 4. Funcionalidades implementadas

| # | Funcionalidad | Dónde |
|---|---|---|
| 1 | Catálogo generado con JavaScript a partir del conjunto local, con identificadores estables y relaciones por `id` | `js/datos-iniciales.js`, `js/datos.js`, `js/catalogo.js` |
| 2 | **Filtro del catálogo** por criterio —título, autor, género o editorial— que ignora mayúsculas y minúsculas, busca coincidencias parciales y recorta los espacios; un libro con varios autores coincide si alguno de sus autores coincide. Se acumula con un **rango de precio** mínimo y máximo, inclusivo, y los extremos que no son números se tratan como ausentes. Con búsqueda vacía muestra todo; una búsqueda sin resultados muestra un mensaje; «Quitar filtros» vacía criterio, consulta y precio y devuelve el catálogo completo | `index.html`, `js/catalogo.js`, `js/inicio.js` |
| 3 | Identidad visual propia con CSS externo: tokens de color, tipografía, espaciado, tarjetas, formularios y botones; Flexbox y Grid | `css/estilos.css` |
| 4 | Diseño adaptable sin desplazamiento horizontal de la página a 320 px ni a 1280 px; las tablas anchas se desplazan dentro de su propio contenedor | `css/estilos.css` |
| 5 | Foco visible al recorrer los controles con el teclado, y mensajes de error que dependen del texto y no solo del color | `css/estilos.css` |
| 6 | Alta de libros con título, ISBN, precio, editorial, género y autores; las opciones salen del conjunto local; el ISBN se compara sin espacios ni guiones y no puede repetirse; el precio tiene que ser numérico y mayor que cero | `js/validaciones.js`, `js/altas.js` |
| 7 | Alta de clientes con nombre completo y correo electrónico; el correo se valida por formato y no puede repetirse, comparado sin espacios exteriores y sin distinguir mayúsculas | `js/validaciones.js`, `js/altas.js` |
| 8 | Venta simulada: un cliente, uno o más renglones, cantidades editables y renglones que se pueden quitar; un libro repetido **no** crea un segundo renglón, suma la cantidad al existente y lo informa | `js/ventas.js` |
| 9 | Cálculo de importes: subtotal = cantidad × precio unitario, total = suma de los subtotales, con dos decimales; no se puede confirmar una venta sin cliente, sin renglones o con cantidades inválidas | `js/ventas.js`, `js/datos.js` |
| 10 | Al confirmar, la venta queda con identificador `vt-YYYY-NNNN`, fecha, cliente, renglones y total, y **el precio unitario se copia al renglón como valor histórico** | `js/datos.js` |
| 11 | Historial consultable: listado con identificador, fecha, cliente y total, y detalle de cada venta con sus renglones. Las ventas confirmadas no se editan ni se eliminan | `js/historial.js` |
| 12 | **Persistencia en `localStorage`**: libros, clientes y ventas se guardan y se recuperan al abrir la aplicación, y son el mismo conjunto de datos en las cinco vistas | `js/persistencia.js`, `js/datos.js` |

---

## 5. Funcionalidades pendientes

| Pendiente | Por qué no está |
|---|---|
| Pantalla para editar precios | La consigna no la exige: el precio se cambia a mano, con las herramientas de almacenamiento del navegador (§ 8) |
| Seguridad o integridad garantizada por un servidor | La consigna dice que el almacenamiento «sirve para la práctica; no representa seguridad ni integridad garantizada por un servidor». Los datos son del navegador y cualquiera que abra la aplicación en ese origen puede leerlos y cambiarlos |
| Gestión de stock, cobros o facturación fiscal | La consigna dice que la venta «registra cantidades y precios para obtener un total simulado, sin gestionar stock, cobros ni facturación fiscal» |
| Un botón para «restaurar los datos de ejemplo» | No lo pide la consigna. Se puede hacer a mano, borrando las tres claves con las herramientas del navegador (§ 7.4) |
| Exportar o importar los datos | No lo pide la consigna |
| Guardar la venta a medio componer | La venta en curso es estado de un formulario, no un registro: se pierde al recargar o al cambiar de vista. Los libros, los clientes y las ventas ya registrados **no** se pierden |
| Sincronizar los datos entre equipos u otros navegadores | El almacenamiento es local a un navegador y a un perfil. No hay servidor |
| Un aviso en pantalla cuando el navegador no permite guardar | La aplicación sigue funcionando en memoria y lo explica por la consola del navegador (§ 7.5) |

---

## 6. Los datos iniciales

Están en **`js/datos-iniciales.js`**, en el objeto `DATOS_INICIALES`, que se carga **antes** que el resto de los scripts.

| Colección | Cuántos | Qué son |
|---|---|---|
| Editoriales | 7 | Reales |
| Géneros | 5 | Reales |
| Autores | 10 | Reales |
| **Libros** | **9** | Títulos, ISBN, editoriales, géneros y autores reales; **los precios son ficticios**, entre 13.900 y 32.900 pesos |
| **Clientes** | **4** | Ficticios |
| **Ventas** | **2** | Ficticias (`vt-2026-0001` y `vt-2026-0002`) |

Ese archivo **no se modifica nunca**: la aplicación trabaja sobre una copia. Los datos iniciales son la semilla que se carga la primera vez; después, lo que manda es lo que está guardado (§ 7).

---

## 7. La persistencia

### 7.1 Qué se guarda

Tres colecciones, y solo tres: **libros, clientes y ventas**. Las editoriales, los géneros y los autores no se guardan: son catálogos de referencia, no tienen interfaz de alta y siempre se rehidratan desde la semilla.

### 7.2 Las claves y la estructura

Cada colección tiene su propia clave, y cada clave guarda **una lista JSON** con los mismos objetos que usa la aplicación en memoria:

| Clave | Contenido |
|---|---|
| `libreriaABC.libros` | Lista de libros |
| `libreriaABC.clientes` | Lista de clientes |
| `libreriaABC.ventas` | Lista de ventas |

El prefijo `libreriaABC.` evita que las claves colisionen con otras aplicaciones que compartan origen en el mismo navegador.

**Un libro guardado** (un elemento de la lista):

```json
{
  "id": "li-hobbit",
  "titulo": "El Hobbit",
  "isbn": "9789507324786",
  "editorialId": "ed-planeta",
  "generoId": "gen-fantasia",
  "autorIds": ["au-tolkien"],
  "precio": 21900
}
```

**Un cliente guardado**:

```json
{ "id": "cl-martina-ferreyra", "nombre": "Martina Ferreyra", "email": "martina.ferreyra@example.com" }
```

**Una venta guardada**:

```json
{
  "id": "vt-2026-0003",
  "fecha": "2026-10-20",
  "clienteId": "cl-martina-ferreyra",
  "clienteNombre": "Martina Ferreyra",
  "renglones": [
    {
      "libroId": "li-libro-de-prueba-1500",
      "titulo": "Libro de prueba 1500",
      "cantidad": 2,
      "precioUnitario": 1500
    }
  ],
  "total": 3000
}
```

Tres cosas para tener a mano:

- El renglón **no guarda el subtotal**: se deriva de `cantidad × precioUnitario`.
- La venta guarda el **precio congelado** del momento de la confirmación, y copias del título del libro y del nombre del cliente, para que se pueda leer aunque el catálogo cambie.
- La venta guarda el **total** ya calculado.

### 7.3 Cuándo se escribe

| Momento | Qué se escribe |
|---|---|
| La primera vez que se abre la aplicación | Las tres claves, con los datos de ejemplo |
| Al registrar un libro | Solo `libreriaABC.libros` |
| Al registrar un cliente | Solo `libreriaABC.clientes` |
| Al confirmar una venta | Solo `libreriaABC.ventas` |
| Al recargar, o al abrir otra vista | **Nada**: lo que hay se recupera |

Que cada alta escriba **solo su colección** tiene una consecuencia útil: la comprobación de § 8. Si el precio de un libro se editó a mano en `libreriaABC.libros` y después se registra una venta, la venta escribe `libreriaABC.ventas` y **no pisa el catálogo**.

**Por qué recargar no duplica nada:** la regla es una sola. Si la clave **no existe**, es el primer inicio de esa colección: se carga la semilla y se escribe. Si la clave **existe**, se recupera. No hay ningún contador ni ninguna marca de tiempo. Por eso tres recargas seguidas dejan exactamente los mismos registros.

### 7.4 Los límites de `localStorage`

Estos límites se **midieron** en el navegador, no se copiaron de documentación:

| Límite | Qué significa en la práctica |
|---|---|
| **Depende del navegador** | Cada navegador decide su cuota y sus políticas. En el modo privado estricto, algunos navegadores negan el acceso a escritura |
| **Depende del perfil** | Los datos son del perfil del navegador y del sistema operativo. Otro perfil del mismo equipo ve la aplicación **sin** los datos registrados |
| **Depende de la ubicación de apertura** | `file://` y `http://localhost:8080` son **orígenes distintos**, y cada uno tiene su almacenamiento. Con `file://`, **todas las rutas locales del disco comparten el mismo origen**: abrir una copia del proyecto con `file://` muestra los mismos registros que el original. Con HTTP, cada puerto es un almacenamiento distinto |
| **No comparte información entre personas usuarias** | Otra persona, con otro perfil o en incógnito, abre la aplicación y ve los datos de ejemplo, no los registrados |
| **Se puede borrar** | Con las herramientas de almacenamiento del navegador, o al limpiar los datos de navegación. Si se borra una clave, esa colección vuelve a sembrarse con los datos de ejemplo; las otras dos no se tocan |
| **La cuota es de unos 5 MB por origen** | Con este volumen de datos no es un problema |
| **No hay seguridad** | Los datos no están cifrados y cualquiera que abra la aplicación en ese origen puede leerlos y cambiarlos. Sirve para la práctica, no representa seguridad ni integridad garantizada por un servidor |
| **Dos pestañas abiertas a la vez** | La última escritura gana: si se registra algo en una pestaña, lo que registró la otra puede perderse. Es un límite del almacenamiento del navegador |
| **No es una base de datos** | No hay consultas, ni índices, ni transacciones. Es un almacén de clave y valor |

### 7.5 Qué pasa cuando algo falla

La aplicación **no se rompe nunca** por un problema del almacenamiento:

- **Si el navegador no permite usar el almacenamiento** (modo privado estricto, política de la organización): la aplicación funciona igual, con los datos de ejemplo, y lo explica por la consola del navegador. Los registros que se hagan no quedan guardados.
- **Si el contenido guardado está mal escrito** —un JSON inválido, o una lista a la que le falta un campo—: la aplicación usa los datos de ejemplo de esa colección, **no sobrescribe la clave** (para no borrar lo que se estuviera por corregir) y lo explica por la consola.
- **Si no se puede guardar** —por ejemplo, por cuota—: la operación que se pidió se completa y muestra su mensaje de resultado, y la consola explica que el registro no quedó guardado.

La consola del navegador (F12 → pestaña *Consola*) es donde aparecen estos avisos.

---

## 8. La comprobación del precio histórico

Es la comprobación guiada que hace el docente: **una venta conserva sus importes aunque el precio del catálogo cambie**. Se puede repetir con estos pasos, en una copia del proyecto y con datos de prueba.

**1. Registrar un libro de prueba con un precio que se note.** En la vista Libros, con el ISBN `9780000001500` y el precio `1500`. Queda con el identificador `li-libro-de-prueba-1500`.

**2. Confirmar una venta y anotar sus importes.** En la vista Ventas: elegí un cliente, agregá **2** unidades del libro de prueba y confirmá. Anotá el **precio unitario** (`$ 1.500,00`), el **subtotal** (`$ 3.000,00`) y el **total** (`$ 3.000,00`). La venta queda registrada con un identificador `vt-…`.

**3. Cambiar el precio del catálogo guardado, a mano.** Abrí las herramientas de desarrollo (F12) y andá a **Aplicación / Application → Storage → Local Storage**. Elegí el origen desde el que abriste la aplicación (`file://` o `http://localhost:…`) y editá la clave **`libreriaABC.libros`**.

Es una lista JSON. Buscá el elemento con el `"id"` del libro de prueba y cambiale el campo `"precio"`: de `1500` a `9999`, por ejemplo.

> **No toques la clave `libreriaABC.ventas`.** La idea es cambiar **solo** el precio del libro del catálogo guardado, sin modificar ni borrar las ventas.

**4. Recargar la página** (F5).

**5. Consultar el detalle de la venta.** En la vista Historial, la venta aparece en el listado; pulsá **«Ver detalle»**.

**Lo que hay que ver:** el detalle sigue mostrando el **precio unitario `$ 1.500,00`**, el **subtotal `$ 3.000,00`** y el **total `$ 3.000,00`** — los mismos valores que anotaste en el paso 2, aunque el libro ahora cueste 9999 en el catálogo. Y en el catálogo, el libro de prueba aparece con el precio nuevo.

**Por qué funciona:** al confirmar, el precio unitario se **copia** al renglón y queda guardado con la venta. El historial deriva el subtotal de ese valor guardado, y nunca vuelve a leer el precio del catálogo.

> **Atención con la copia del proyecto:** si la copia se abre con `file://`, ve **los mismos registros** que el original, porque todas las rutas locales con `file://` comparten el origen de almacenamiento. Si la copia se sirve por HTTP en otro puerto, tiene su propio almacenamiento y arranca con los datos de ejemplo. Para hacer la comprobación con datos de prueba y sin mezclarlos con los del proyecto, conviene servir la copia por HTTP.

---

## 9. Los casos manuales

Los ocho casos de la consigna, ejecutados en el navegador (Microsoft Edge 155.0.4283.62) y con el **resultado observado**. Los datos con nombres «de prueba» son ficticios y sirven solo para las comprobaciones.

| # | Caso | Resultado observado | Estado |
|---|---|---|---|
| 1 | **Búsqueda** con una parte del título en mayúsculas; luego búsqueda vacía y texto inexistente | «HOBBIT» devuelve 1 resultado: «El Hobbit». La búsqueda vacía devuelve los 9 libros del catálogo; la de solo espacios, también. «zzz-no-existe» devuelve 0 resultados y el mensaje «No se encontraron libros para la búsqueda.» | **Aprobado** |
| 2 | **Alta de libro** con ISBN existente y luego con ISBN nuevo | Con el ISBN `9780307474728`, que ya existe: «No se pudo registrar el libro. Ya existe un libro con ese ISBN.» y el listado sigue con 9 filas. Con el ISBN `9780000000001`: «Se registró el libro «Libro nuevo de prueba».» y el listado pasa a 10 filas | **Aprobado** |
| 3 | **Alta de cliente** con email inválido, email existente en mayúsculas y email nuevo | «no-es-un-email» → «El correo electrónico no tiene un formato válido.», 4 filas. «MARTINA.FERREYRA@EXAMPLE.COM» → «Ya existe un cliente con ese correo electrónico.», 4 filas. «cliente.nuevo@example.com» → «Se registró el cliente «Cliente nuevo».», 5 filas | **Aprobado** |
| 4 | **Venta** sin cliente, cantidad cero, negativa o decimal; libro repetido | Cantidad 0, −2 y 1,5 → «Ingresá una cantidad entera mayor que cero.» y ningún renglón. El mismo libro dos veces → **un** renglón, con la cantidad sumada (5) y el aviso «Se agregaron 3 unidades más de «Cien años de soledad»; el renglón queda con 5.». Confirmar sin cliente → «Elegí un cliente para la venta.» y las ventas registradas siguen siendo 2 | **Aprobado** |
| 5 | **Venta válida**: dos unidades a 1500 y una a 2000 | Renglón «Libro de prueba 1500» · 2 · `$ 1.500,00` · subtotal `$ 3.000,00`. Renglón «Libro de prueba 2000» · 1 · `$ 2.000,00` · subtotal `$ 2.000,00`. Total `$ 5.000,00`. Queda registrada como `vt-2026-0003` y el historial muestra su detalle | **Aprobado** |
| 6 | **Venta confirmada y cambio exclusivo del precio de catálogo guardado**, en una copia de prueba | En la copia de prueba se confirmó `vt-2026-0003` (2 × 1500: precio unitario 1500, subtotal 3000, total 3000) y se cambió a mano el precio de un libro del catálogo guardado (1500 → 9999), sin tocar las ventas guardadas (siguen siendo 3). Tras recargar y consultar el detalle, la venta sigue con precio unitario `$ 1.500,00` y total `$ 3.000,00` | **Aprobado** |
| 7 | **Recarga** después de altas y venta | Tras recargar: 12 libros en el catálogo (los 9 de ejemplo, una sola vez cada uno, más 3 de prueba), 12 en el almacenamiento, 5 clientes y 3 ventas. No se duplica ni un ejemplo ni una venta | **Aprobado** |
| 8 | **Teclado y anchos** de 320 px y 1280 px | Con Tab: «Catálogo» → «Libros» → «Clientes» → «Ventas» → «Historial» → el buscador → el botón «Buscar», con `:focus-visible` verdadero y contorno `solid 3px` en todos. A 320 px la página mide 305 px de contenido sobre 305 px de ventana, y la tabla se desplaza dentro de su propio contenedor. A 1280 px, 1265 px sobre 1265 px, sin desplazamiento propio | **Aprobado** |

Ningún caso quedó pendiente ni fallido. El caso 6 lo repite el docente de forma guiada, con los pasos de § 8.

---

## 10. Imágenes

El proyecto incluye **una única imagen**: `logo.png`, en la marca de la cabecera de las cinco vistas. Se usa como elemento **decorativo**, con el texto alternativo vacío, porque la información que transmite ya está en el texto contiguo («Librería ABC»).

| | |
|---|---|
| **Obra** | Ilustración de libros apilados, «ID 220305499» |
| **Autora** | Chetsadakorn Nakhammoon |
| **Fuente** | [Dreamstime](https://www.dreamstime.com/book-in-hand-drawn-style-isolated-illustration-hand-drawn-objects-for-presentation-didactic-material-or-other-image220305499) |
| **Licencia** | Libre de Derechos (Royalty-Free) de Dreamstime, que permite el uso educativo |
| **Línea de crédito** | `ID 220305499 © Chetsadakorn Nakhammoon | Dreamstime.com` |

**La imagen no es obra del equipo**: se descargó de esa página y se usa con la licencia indicada. La aplicación no usa ninguna otra imagen, ni de fondo, ni en el contenido.

---

## 11. La entrega

La carpeta del proyecto contiene:

```
index.html          libros.html       clientes.html      ventas.html     historial.html
css/estilos.css
js/  datos-iniciales.js  datos.js  persistencia.js  validaciones.js
     catalogo.js  altas.js  ventas.js  historial.js  inicio.js
logo.png
README.md
docs/         la especificación y el plan de cada ejercicio
prompts/      los enunciados de los ejercicios
openspec/     las especificaciones del proyecto y el historial de cambios
```

**No incluye** dependencias instaladas, ni `package.json`, ni `node_modules`, ni herramientas de compilación, ni recursos de otro origen: todo lo que la aplicación usa está dentro de la carpeta.

---

## 12. Tecnologías y estructura

**HTML, CSS y JavaScript nativos.** Sin librerías, sin frameworks, sin CDN, sin `fetch`, sin servidor, sin base de datos y sin proceso de compilación.

| Archivo | Responsabilidad |
|---|---|
| `js/datos-iniciales.js` | La semilla: los datos de ejemplo. No se modifica nunca |
| `js/persistencia.js` | La única capa que habla con `localStorage`: claves, lectura, escritura y detección de disponibilidad. Nunca lanza excepciones |
| `js/datos.js` | El modelo: el estado vivo, las consultas y las altas. Hidrata el estado desde el almacenamiento y lo vuelve a guardar en cada alta |
| `js/validaciones.js` | Las reglas puras de validación, sin DOM ni estado |
| `js/catalogo.js` | El renderizado del catálogo, el filtro y el formato de los importes |
| `js/altas.js` | La capa DOM de las vistas Libros y Clientes, y los selectores de la vista Ventas |
| `js/ventas.js` | La venta en curso: composición, cálculos, validación y confirmación |
| `js/historial.js` | La vista del historial y el detalle de cada venta |
| `js/inicio.js` | El arranque: prepara los datos y dibuja la vista abierta, según los contenedores que existen en ella |

Los scripts son **clásicos**, no módulos ES: con `file://` el `import` está bloqueado por la política de origen de Chrome y Edge, y la aplicación tiene que poder abrirse con un doble clic.

### Los tokens de diseño

La hoja de estilos define **todos sus valores en el bloque `:root`** —49 tokens— y el resto del archivo solo los consume con `var(...)`: ninguna medida, color, borde o duración está escrita a mano en el cuerpo de la hoja, con la única excepción de los puntos de quiebre (más abajo).

| Familia | Tokens y valor | Qué fijan |
|---|---|---|
| **Color** (14) | `--color-fondo` #FAFAF8, `--color-superficie` #FFFFFF, `--color-texto` #22262A, `--color-texto-suave` #5B625E, `--color-primario` #2F5D50, `--color-primario-hover` #234A3F, `--color-acento` #C2A25A, `--color-error` #A33A2B, `--color-error-fondo` #F7EAE7, `--color-exito` #2C6B4F, `--color-exito-fondo` #E8F2ED, `--color-foco` #0B57D0, `--color-borde` #949494, `--color-borde-suave` #E3E4E0 | La paleta «Minimal natural», con contraste AA en todos los pares de texto |
| **Tipografía** (2) | `--fuente-base`, `--fuente-titulos` | Las pilas del sistema, sin fuentes externas |
| **Escala de texto** (6) | `--texto-xs` 0.75rem, `--texto-sm` 0.875rem, `--texto-base` 1rem, `--texto-lg` 1.125rem, `--texto-xl` 1.25rem, `--texto-2xl` 1.75rem | Los tamaños de letra |
| **Espaciado** (6) | `--espacio-1` 0.25rem, `--espacio-2` 0.5rem, `--espacio-3` 0.75rem, `--espacio-4` 1rem, `--espacio-5` 1.5rem, `--espacio-6` 2rem | La escala de separación |
| **Radio** (3) | `--radio-sm` 4px, `--radio-md` 8px, `--radio-lg` 12px | Las esquinas redondeadas |
| **Sombra** (1) | `--sombra-suave` | La sombra suave de las tarjetas |
| **Borde** (4) | `--borde-fino` 1px, `--borde-medio` 2px, `--borde-destacado` 3px, `--borde-grueso` 4px | Los grosores de borde: separadores, tabla, filete de acento y borde del mensaje de error |
| **Duración** (2) | `--duracion-transicion` 120ms, `--duracion-reducida` 0.01ms | La transición de los componentes, y su anulación cuando se pidió menos movimiento |
| **Ancho** (7) | `--espacio-contenedor` 2rem, `--ancho-contenido` 1100px, `--ancho-tabla` 760px, `--ancho-tabla-compacta` 480px, `--ancho-minimo-columna` 12rem, `--ancho-columna-min` 10rem, `--ancho-columna-max` 16rem | El margen y el ancho máximo del contenedor, las dos tablas y las columnas de los formularios |
| **Alto** (2) | `--alto-marca` 3rem, `--alto-minimo-tarjeta` 7rem | La imagen de la marca y el alto mínimo de las tarjetas de estado |
| **Foco** (2) | `--grosor-foco` 3px, `--desplazamiento-foco` 2px | El contorno del foco visible y su desplazamiento |

**La única excepción: los puntos de quiebre de las media queries.** Las condiciones de un `@media` **no admiten `var()`**: `@media (min-width: var(--ancho-md))` es inválido y el navegador descarta la hoja de estilos entera. Por eso los dos puntos de quiebre —**640 px** y **1024 px**— quedan escritos en su lugar, cada uno con un comentario al lado que explica el motivo. Es una limitación del lenguaje, no una decisión de estilo: si algún día se agregan más media queries, el valor se escribe literal y se comenta de la misma manera.
