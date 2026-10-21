/* ============================================================================
   Librería ABC — capa DOM de las altas
   Change 05 · Ejercicio 4: alta de libros y clientes

   Responsabilidad: hablar con el DOM de las vistas Libros, Clientes y Ventas.
   Genera las opciones de los selectores a partir del conjunto local, dibuja
   los listados, atiende el envío de los formularios y muestra el resultado.

   Las reglas viven en `js/validaciones.js`; este archivo solo las consulta y
   traduce su resultado a mensajes. La fila de un libro la construye
   `js/catalogo.js`, que ya la usa para el catálogo.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/* --- Opciones de los selectores -------------------------------------------- */

/** Agrega una opción a un selector, con su texto y su valor. */
function agregarOpcion(select, texto, valor) {
  const opcion = document.createElement("option");
  opcion.textContent = texto;
  opcion.value = valor;
  select.appendChild(opcion);
}

/** Vacía un selector de sus opciones y conserva la opción fija del marcado. */
function vaciarSelector(select) {
  const fija = select.querySelector('option[value=""]');
  select.replaceChildren();
  if (fija) {
    select.appendChild(fija);
  }
}

/** Llena el selector de editorial con las editoriales del conjunto local. */
function pintarOpcionesEditoriales() {
  const select = document.getElementById("libro-editorial");
  if (!select) {
    return;
  }
  vaciarSelector(select);
  obtenerEditoriales().forEach((editorial) => {
    agregarOpcion(select, editorial.nombre, editorial.id);
  });
}

/** Llena el selector de género con los géneros del conjunto local. */
function pintarOpcionesGeneros() {
  const select = document.getElementById("libro-genero");
  if (!select) {
    return;
  }
  vaciarSelector(select);
  obtenerGeneros().forEach((genero) => {
    agregarOpcion(select, genero.nombre, genero.id);
  });
}

/** Llena el selector de autores con los autores del conjunto local. */
function pintarOpcionesAutores() {
  const select = document.getElementById("libro-autores");
  if (!select) {
    return;
  }
  vaciarSelector(select);
  obtenerAutoresDisponibles().forEach((autor) => {
    agregarOpcion(select, autor.nombre, autor.id);
  });
}

/** Llena el selector de cliente de la vista Ventas. */
function pintarOpcionesClienteVenta() {
  const select = document.getElementById("venta-cliente");
  if (!select) {
    return;
  }
  vaciarSelector(select);
  obtenerClientes().forEach((cliente) => {
    agregarOpcion(select, cliente.nombre, cliente.id);
  });
}

/** Llena el selector de libro de la vista Ventas, con su precio. */
function pintarOpcionesLibroVenta() {
  const select = document.getElementById("venta-libro");
  if (!select) {
    return;
  }
  vaciarSelector(select);
  obtenerLibros().forEach((libro) => {
    agregarOpcion(select, libro.titulo + " — " + formatearPrecio(libro.precio), libro.id);
  });
}

/* --- Listados --------------------------------------------------------------- */

/** Construye la fila de un cliente, con una celda por columna del encabezado. */
function crearFilaCliente(cliente) {
  const fila = document.createElement("tr");
  [cliente.nombre, cliente.email].forEach((texto) => {
    const celda = document.createElement("td");
    celda.textContent = texto;
    fila.appendChild(celda);
  });
  return fila;
}

/** Dibuja el listado de libros registrados y alterna su estado vacío. */
function pintarListadoLibros() {
  const cuerpo = document.getElementById("libros-listado");
  if (!cuerpo) {
    return;
  }
  const libros = obtenerLibros();
  cuerpo.replaceChildren();
  libros.forEach((libro) => {
    cuerpo.appendChild(crearFilaLibro(libro));
  });
  const estadoVacio = document.getElementById("libros-estado-vacio");
  if (estadoVacio) {
    estadoVacio.hidden = libros.length > 0;
  }
}

/** Dibuja el listado de clientes registrados y alterna su estado vacío. */
function pintarListadoClientes() {
  const cuerpo = document.getElementById("clientes-listado");
  if (!cuerpo) {
    return;
  }
  const clientes = obtenerClientes();
  cuerpo.replaceChildren();
  clientes.forEach((cliente) => {
    cuerpo.appendChild(crearFilaCliente(cliente));
  });
  const estadoVacio = document.getElementById("clientes-estado-vacio");
  if (estadoVacio) {
    estadoVacio.hidden = clientes.length > 0;
  }
}

/* --- Mensajes --------------------------------------------------------------- */

/* Los textos que el marcado ya escribió en los mensajes. Se recuerdan al
   cargar el script, antes de que nada pueda cambiarlos, para poder agregar el
   motivo sin perder la frase original. */
const TEXTOS_BASE = {};

["libros-mensaje-error", "clientes-mensaje-error", "mensaje-exito"].forEach((id) => {
  const elemento = document.getElementById(id);
  if (elemento) {
    TEXTOS_BASE[id] = elemento.textContent.trim();
  }
});

/** Devuelve el texto que el marcado ya escribía en un mensaje. */
function textoBase(elemento) {
  if (!(elemento.id in TEXTOS_BASE)) {
    TEXTOS_BASE[elemento.id] = elemento.textContent.trim();
  }
  return TEXTOS_BASE[elemento.id];
}

/** Muestra un mensaje de error junto al formulario, con los motivos. */
function mostrarError(elemento, motivos) {
  const base = textoBase(elemento);
  elemento.textContent = motivos.length > 0 ? base + " " + motivos.join(" ") : base;
  elemento.hidden = false;
}

/** Muestra un mensaje de operación correcta junto al formulario. */
function mostrarExito(elemento, detalle) {
  const base = textoBase(elemento);
  elemento.textContent = detalle ? base + " " + detalle : base;
  elemento.hidden = false;
}

/** Vuelve a ocultar un mensaje. */
function ocultarMensaje(elemento) {
  elemento.hidden = true;
}

/* --- Envíos ----------------------------------------------------------------- */

/** Devuelve los identificadores de los autores marcados en el selector. */
function autorIdsSeleccionados() {
  const select = document.getElementById("libro-autores");
  if (!select) {
    return [];
  }
  return Array.from(select.selectedOptions).map((opcion) => opcion.value);
}

/** Atiende el envío del formulario de libros. */
function alRegistrarLibro(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const mensajeError = document.getElementById("libros-mensaje-error");
  const mensajeExito = document.getElementById("mensaje-exito");

  const datos = {
    titulo: document.getElementById("libro-titulo").value,
    isbn: document.getElementById("libro-isbn").value,
    precio: document.getElementById("libro-precio").value,
    editorialId: document.getElementById("libro-editorial").value,
    generoId: document.getElementById("libro-genero").value,
    autorIds: autorIdsSeleccionados()
  };

  const resultado = validarLibro(datos, obtenerContextoDeAltas());
  if (!resultado.ok) {
    ocultarMensaje(mensajeExito);
    mostrarError(mensajeError, resultado.errores);
    return;
  }

  const libro = agregarLibro({
    titulo: datos.titulo.trim(),
    isbn: datos.isbn.trim(),
    precio: leerPrecio(datos.precio),
    editorialId: datos.editorialId,
    generoId: datos.generoId,
    autorIds: datos.autorIds
  });

  pintarListadoLibros();
  ocultarMensaje(mensajeError);
  mostrarExito(mensajeExito, "Se registró el libro «" + libro.titulo + "».");
  formulario.reset();
}

/** Atiende el envío del formulario de clientes. */
function alRegistrarCliente(evento) {
  evento.preventDefault();
  const formulario = evento.currentTarget;
  const mensajeError = document.getElementById("clientes-mensaje-error");
  const mensajeExito = document.getElementById("mensaje-exito");

  const datos = {
    nombre: document.getElementById("cliente-nombre").value,
    email: document.getElementById("cliente-email").value
  };

  const resultado = validarCliente(datos, obtenerContextoDeAltas());
  if (!resultado.ok) {
    ocultarMensaje(mensajeExito);
    mostrarError(mensajeError, resultado.errores);
    return;
  }

  const cliente = agregarCliente({
    nombre: datos.nombre.trim(),
    email: datos.email.trim()
  });

  pintarListadoClientes();
  ocultarMensaje(mensajeError);
  mostrarExito(mensajeExito, "Se registró el cliente «" + cliente.nombre + "».");
  formulario.reset();
}
