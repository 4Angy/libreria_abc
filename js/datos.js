/* ============================================================================
   Librería ABC — modelo de datos
   Change 03 · Ejercicio 3: datos locales, catálogo y filtro

   Responsabilidad: conservar el estado vivo de la aplicación y resolver las
   consultas que necesita el renderizado. La semilla `DATOS_INICIALES` nunca
   se modifica: acá se trabaja sobre una copia.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/* Estado vivo de la aplicación. Lo reemplaza `iniciarDatos()`. */
let estado = null;

/* --- Ciclo de vida del estado --------------------------------------------- */

/** Copia la semilla de `datos-iniciales.js` al estado vivo de la aplicación. */
function iniciarDatos() {
  estado = {
    libros: DATOS_INICIALES.libros.map(copiarLibro),
    editoriales: DATOS_INICIALES.editoriales.map(copiarEditorial),
    generos: DATOS_INICIALES.generos.map(copiarGenero),
    autores: DATOS_INICIALES.autores.map(copiarAutor),
    clientes: DATOS_INICIALES.clientes.map(copiarCliente),
    ventas: DATOS_INICIALES.ventas.map(copiarVenta)
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
