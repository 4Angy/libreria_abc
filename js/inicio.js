/* ============================================================================
   Librería ABC — arranque y eventos
   Change 03 · Ejercicio 3: datos locales, catálogo y filtro
   Change 05 · Ejercicio 4: alta de libros y clientes
   Change 06 · Ejercicio 5: venta simulada e historial
   Change 07 · Ejercicio 6: persistencia, verificación y documentación

   Responsabilidad: poner en marcha la vista abierta y atender los eventos.
   Cada vista se dibuja según los contenedores que existen en ella, de modo
   que un solo arranque sirve para las cinco. Los eventos se registran con
   `addEventListener`: el marcado no lleva manejadores en línea.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/** Prepara los datos y dibuja la vista abierta. */
function alCargar() {
  iniciarDatos();
  pintarVistaActual();
}

/** Dibuja la vista que está abierta, según los contenedores que existen. */
function pintarVistaActual() {
  if (document.getElementById("catalogo-listado")) {
    pintarCatalogo(obtenerLibros());
  }
  if (document.getElementById("libro-editorial")) {
    pintarOpcionesEditoriales();
  }
  if (document.getElementById("libro-genero")) {
    pintarOpcionesGeneros();
  }
  if (document.getElementById("libro-autores")) {
    pintarOpcionesAutores();
  }
  if (document.getElementById("libros-listado")) {
    pintarListadoLibros();
  }
  if (document.getElementById("clientes-listado")) {
    pintarListadoClientes();
  }
  if (document.getElementById("venta-cliente")) {
    pintarOpcionesClienteVenta();
  }
  if (document.getElementById("venta-libro")) {
    pintarOpcionesLibroVenta();
  }
  if (document.getElementById("venta-renglones")) {
    pintarResumen();
  }
  if (document.getElementById("historial-listado")) {
    renderizarHistorial();
  }
}

/** Atiende el envío del buscador: filtra por el criterio, consulta y rango de
    precio indicados, y repinta. */
function alBuscar(evento) {
  evento.preventDefault();
  const criterio = document.getElementById("catalogo-criterio").value || "titulo";
  const consulta = document.getElementById("catalogo-busqueda").value;
  const precioMin = document.getElementById("catalogo-precio-min").value;
  const precioMax = document.getElementById("catalogo-precio-max").value;
  pintarCatalogo(filtrarPorCriterio(criterio, consulta, precioMin, precioMax));
}

/** Quita los filtros activos y vuelve a mostrar el catálogo completo. */
function alQuitarFiltros() {
  const criterio = document.getElementById("catalogo-criterio");
  if (criterio) {
    criterio.value = "titulo";
  }
  const campoBusqueda = document.getElementById("catalogo-busqueda");
  if (campoBusqueda) {
    campoBusqueda.value = "";
  }
  const precioMin = document.getElementById("catalogo-precio-min");
  const precioMax = document.getElementById("catalogo-precio-max");
  if (precioMin) {
    precioMin.value = "";
  }
  if (precioMax) {
    precioMax.value = "";
  }
  pintarCatalogo(filtrarPorCriterio("titulo", ""));
}

/** Registra los eventos de la vista abierta. */
function registrarEventos() {
  const formularioBusqueda = document.getElementById("catalogo-form-busqueda");
  if (formularioBusqueda) {
    formularioBusqueda.addEventListener("submit", alBuscar);
  }
  const botonQuitar = document.getElementById("catalogo-boton-quitar");
  if (botonQuitar) {
    botonQuitar.addEventListener("click", alQuitarFiltros);
  }
  const formularioLibro = document.getElementById("libros-form-alta");
  if (formularioLibro) {
    formularioLibro.addEventListener("submit", alRegistrarLibro);
  }
  const formularioCliente = document.getElementById("clientes-form-alta");
  if (formularioCliente) {
    formularioCliente.addEventListener("submit", alRegistrarCliente);
  }

  const formularioVenta = document.getElementById("ventas-form-venta");
  if (formularioVenta) {
    formularioVenta.addEventListener("submit", alConfirmarVenta);
  }
  const botonAgregar = document.getElementById("venta-boton-agregar");
  if (botonAgregar) {
    botonAgregar.addEventListener("click", alAgregarRenglon);
  }
  const cuerpoRenglones = document.getElementById("venta-renglones");
  if (cuerpoRenglones) {
    cuerpoRenglones.addEventListener("click", alQuitarRenglon);
    cuerpoRenglones.addEventListener("change", alCambiarCantidad);
  }

  const cuerpoHistorial = document.getElementById("historial-listado");
  if (cuerpoHistorial) {
    cuerpoHistorial.addEventListener("click", alVerDetalle);
  }
  const botonCerrar = document.getElementById("historial-detalle-cerrar");
  if (botonCerrar) {
    botonCerrar.addEventListener("click", cerrarDetalle);
  }
}

/** Arranca la vista cuando el documento está listo. */
function iniciar() {
  registrarEventos();
  alCargar();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}
