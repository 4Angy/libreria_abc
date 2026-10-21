/* ============================================================================
   Librería ABC — modelo de datos
   Change 03 · Ejercicio 3: datos locales, catálogo y filtro
   Change 05 · Ejercicio 4: altas de libros y clientes
   Change 06 · Ejercicio 5: venta simulada e historial
   Change 07 · Ejercicio 6: persistencia, verificación y documentación

   Responsabilidad: conservar el estado vivo de la aplicación y resolver las
   consultas que necesita el renderizado. La semilla `DATOS_INICIALES` nunca
   se modifica: acá se trabaja sobre una copia.

   El estado se hidrata del almacenamiento del navegador —que es lo que hace
   `js/persistencia.js`— y se vuelve a guardar en cada alta, para que lo
   registrado sobreviva a la recarga y sea el mismo en las cinco vistas.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/* Estado vivo de la aplicación. Lo reemplaza `iniciarDatos()`. */
let estado = null;

/* --- Ciclo de vida del estado --------------------------------------------- */

/**
 * Recupera una colección del almacenamiento del navegador.
 *
 * Si la clave no existe, es el primer inicio de esa colección: se usa la
 * semilla y se escribe, para que el ejemplo quede guardado una sola vez.
 *
 * Si la clave existe pero su contenido no es válido, se usa la semilla
 * **sin tocar la clave**: si alguien está corrigiendo a mano el contenido,
 * sobrescribirlo borraría su intento.
 */
function recuperarColeccion(clave, semilla, copiar) {
  if (!hayGuardado(clave)) {
    const coleccion = semilla.map(copiar);
    escribirGuardado(clave, coleccion);
    return coleccion;
  }
  const guardada = leerGuardado(clave);
  if (guardada === null) {
    return semilla.map(copiar);
  }
  return guardada;
}

/**
 * Prepara los datos de la aplicación: los que están guardados si los hay, y
 * los de ejemplo si todavía no se guardó ninguno.
 */
function iniciarDatos() {
  estado = {
    libros: recuperarColeccion(CLAVE_LIBROS, DATOS_INICIALES.libros, copiarLibro),
    clientes: recuperarColeccion(CLAVE_CLIENTES, DATOS_INICIALES.clientes, copiarCliente),
    ventas: recuperarColeccion(CLAVE_VENTAS, DATOS_INICIALES.ventas, copiarVenta),
    editoriales: DATOS_INICIALES.editoriales.map(copiarEditorial),
    generos: DATOS_INICIALES.generos.map(copiarGenero),
    autores: DATOS_INICIALES.autores.map(copiarAutor)
  };
  return estado;
}

function copiarLibro(libro) {
  return {
    id: libro.id,
    titulo: libro.titulo,
    isbn: libro.isbn,
    editorialId: libro.editorialId,
    generoId: libro.generoId,
    autorIds: libro.autorIds.slice(),
    precio: libro.precio
  };
}

function copiarEditorial(editorial) {
  return { id: editorial.id, nombre: editorial.nombre };
}

function copiarGenero(genero) {
  return { id: genero.id, nombre: genero.nombre };
}

function copiarAutor(autor) {
  return { id: autor.id, nombre: autor.nombre };
}

function copiarCliente(cliente) {
  return { id: cliente.id, nombre: cliente.nombre, email: cliente.email };
}

function copiarVenta(venta) {
  return {
    id: venta.id,
    fecha: venta.fecha,
    clienteId: venta.clienteId,
    clienteNombre: venta.clienteNombre,
    renglones: venta.renglones.map(copiarRenglon),
    total: venta.total
  };
}

function copiarRenglon(renglon) {
  return {
    libroId: renglon.libroId,
    titulo: renglon.titulo,
    cantidad: renglon.cantidad,
    precioUnitario: renglon.precioUnitario
  };
}

/* --- Consultas ------------------------------------------------------------- */

/** Devuelve la lista de libros del estado vivo. */
function obtenerLibros() {
  return estado.libros;
}

/** Devuelve el nombre de la editorial, o un texto legible si no existe. */
function obtenerEditorial(idEditorial) {
  const editorial = estado.editoriales.find((candidato) => candidato.id === idEditorial);
  return editorial ? editorial.nombre : "Editorial desconocida";
}

/** Devuelve el nombre del género, o `null` si el libro no tiene género asignado. */
function obtenerGenero(idGenero) {
  if (!idGenero) {
    return null;
  }
  const genero = estado.generos.find((candidato) => candidato.id === idGenero);
  return genero ? genero.nombre : null;
}

/** Devuelve los nombres de los autores, separados por coma. */
function obtenerAutores(idsAutores) {
  const nombres = idsAutores
    .map((idAutor) => {
      const autor = estado.autores.find((candidato) => candidato.id === idAutor);
      return autor ? autor.nombre : null;
    })
    .filter((nombre) => nombre !== null);
  return nombres.length > 0 ? nombres.join(", ") : "Sin autores";
}

/** Devuelve la lista de clientes del estado vivo. */
function obtenerClientes() {
  return estado.clientes;
}

/** Devuelve la lista de editoriales del estado vivo, con su id y su nombre. */
function obtenerEditoriales() {
  return estado.editoriales;
}

/** Devuelve la lista de géneros del estado vivo, con su id y su nombre. */
function obtenerGeneros() {
  return estado.generos;
}

/** Devuelve la lista de autores disponibles, con su id y su nombre. */
function obtenerAutoresDisponibles() {
  return estado.autores;
}

/** Devuelve las colecciones contra las que se validan las altas. */
function obtenerContextoDeAltas() {
  return {
    libros: estado.libros,
    editoriales: estado.editoriales,
    generos: estado.generos,
    autores: estado.autores,
    clientes: estado.clientes
  };
}

/* --- Altas ----------------------------------------------------------------- */

/** Convierte un texto en un identificador legible con guiones. */
function generarSlug(texto) {
  const base = texto === null || texto === undefined ? "" : String(texto);
  return base
    .normalize("NFD")
    .replace(/[\u0300-\u036F]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Arma un identificador único y legible a partir de un texto.
 * Si el identificador ya está en la colección, le agrega un sufijo numérico.
 */
function generarId(prefijo, texto, coleccion) {
  const slug = generarSlug(texto) || "nuevo-" + (coleccion.length + 1);
  let id = prefijo + "-" + slug;
  let intento = 2;
  while (coleccion.some((registro) => registro.id === id)) {
    id = prefijo + "-" + slug + "-" + intento;
    intento += 1;
  }
  return id;
}

/**
 * Registra un libro en el estado vivo y devuelve el libro creado.
 * El género sin asignar se guarda como null, nunca como texto vacío.
 */
function agregarLibro(datos) {
  const libro = {
    id: generarId("li", datos.titulo, estado.libros),
    titulo: datos.titulo,
    isbn: datos.isbn,
    editorialId: datos.editorialId,
    generoId: datos.generoId ? datos.generoId : null,
    autorIds: datos.autorIds.slice(),
    precio: datos.precio
  };
  estado.libros.push(libro);
  guardarLibros(estado.libros);
  return libro;
}

/** Registra un cliente en el estado vivo y devuelve el cliente creado. */
function agregarCliente(datos) {
  const cliente = {
    id: generarId("cl", datos.nombre, estado.clientes),
    nombre: datos.nombre,
    email: datos.email
  };
  estado.clientes.push(cliente);
  guardarClientes(estado.clientes);
  return cliente;
}

/* --- Ventas ---------------------------------------------------------------- */

/** Devuelve la lista de ventas del estado vivo, en el orden en que se registraron. */
function obtenerVentas() {
  return estado.ventas;
}

/**
 * Arma el identificador de una venta: `vt-` + el año de la fecha + el número
 * correlativo de cuatro dígitos de ese año. Toma el máximo existente, no la
 * cantidad de ventas, para que la numeración nunca se repita.
 */
function generarIdVenta(fecha) {
  const anio = String(fecha).slice(0, 4);
  const prefijo = "vt-" + anio + "-";
  let mayor = 0;
  estado.ventas.forEach((venta) => {
    if (venta.id.indexOf(prefijo) === 0) {
      const numero = parseInt(venta.id.slice(prefijo.length), 10);
      if (Number.isFinite(numero) && numero > mayor) {
        mayor = numero;
      }
    }
  });
  return prefijo + String(mayor + 1).padStart(4, "0");
}

/** Devuelve el subtotal de una cantidad y un precio, con dos decimales. */
function calcularSubtotal(cantidad, precioUnitario) {
  return Math.round(cantidad * precioUnitario * 100) / 100;
}

/** Devuelve la suma de los subtotales de una lista de renglones. */
function calcularTotal(renglones) {
  return renglones.reduce(
    (suma, renglon) => suma + calcularSubtotal(renglon.cantidad, renglon.precioUnitario),
    0
  );
}

/**
 * Registra una venta en el estado vivo y devuelve la venta creada.
 * Los renglones se copian con el precio unitario ya congelado y sin subtotal:
 * el subtotal se deriva de los valores guardados, de modo que el detalle no
 * pueda desincronizarse del total.
 */
function agregarVenta(datos) {
  const renglones = datos.renglones.map((renglon) => ({
    libroId: renglon.libroId,
    titulo: renglon.titulo,
    cantidad: renglon.cantidad,
    precioUnitario: renglon.precioUnitario
  }));
  const venta = {
    id: generarIdVenta(datos.fecha),
    fecha: datos.fecha,
    clienteId: datos.clienteId,
    clienteNombre: datos.clienteNombre,
    renglones: renglones,
    total: calcularTotal(renglones)
  };
  estado.ventas.push(venta);
  guardarVentas(estado.ventas);
  return venta;
}
