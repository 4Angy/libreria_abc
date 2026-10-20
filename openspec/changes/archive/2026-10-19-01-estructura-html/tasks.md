# Tasks

## 1. Base común y vista Catálogo

- [x] 1.1 Crear `index.html` con el esqueleto común (`lang="es"`, `charset`, `viewport`, `title`), marca «Librería ABC», `nav` con los cinco enlaces y `aria-current` en Catálogo.
- [x] 1.2 Agregar `main` con `h1`, región de éxito oculta (`role="status"`, `aria-live="polite"`, `hidden`).
- [x] 1.3 Agregar el buscador (`form role="search"`, `input type="search"` con etiqueta, botón «Buscar»).
- [x] 1.4 Agregar la tabla del catálogo con `caption` y seis `th scope="col"` (título, ISBN, editorial, género, autores, precio) y `tbody` vacío.
- [x] 1.5 Agregar los contenedores ocultos de lista vacía y de búsqueda sin resultados del catálogo.

## 2. Vistas restantes

- [x] 2.1 Crear `libros.html`: alta con seis campos etiquetados (editorial `select`, género `select` con «Sin clasificar», autores `select multiple`, precio `number`), botones, error junto al formulario, listado con seis encabezados y estado vacío.
- [x] 2.2 Crear `clientes.html`: alta con nombre completo y correo electrónico, botones, error junto al formulario, listado con dos encabezados y estado vacío.
- [x] 2.3 Crear `ventas.html`: selección de cliente, selección de libro, cantidad, acción «Agregar renglón», resumen con cinco encabezados y total en el pie, mensajes de venta vacía y de error, acción «Registrar venta».
- [x] 2.4 Crear `historial.html`: listado de ventas con cinco encabezados, estado vacío y bloque de detalle oculto con `dl`, tabla de renglones y acción de cierre.

## 3. Verificación

- [x] 3.1 Verificar navegación cruzada: cinco enlaces por archivo, destinos existentes, un solo `aria-current` correcto por vista, sin rutas absolutas.
- [x] 3.2 Verificar semántica: un `header`, `nav`, `main` y `h1` por vista; doce etiquetas asociadas a doce controles; toda tabla con `caption`, `thead` y `th` con `scope`; botones con texto.
- [x] 3.3 Verificar estados e identificadores: los once contenedores de estado existen y están ocultos, roles correctos, sin `id` duplicados, sin filas ni opciones precargadas.
- [x] 3.4 Verificar restricciones: cero coincidencias de estilos, scripts, eventos en atributos, validaciones y recursos externos; ausencia de archivos y carpetas de CSS y JavaScript.
- [x] 3.5 Verificar apertura por `file://` con Edge en modo headless en las cinco vistas y obtener capturas de evidencia a 1280×800 y 320×800.

## 4. Cierre

- [x] 4.1 Registrar el resultado de cada comprobación con su estado real (aprobado, fallido, omitido o pendiente), distinguiendo los controles que requieren confirmación manual de la persona usuaria.
- [x] 4.2 Informar alcance entregado, limitaciones conocidas y pendientes.
