/* ============================================================================
   Librería ABC — arranque y eventos del catálogo
   Change 03 · Ejercicio 3: datos locales, catálogo y filtro

   Responsabilidad: poner en marcha la vista de Catálogo y atender los
   eventos. Los eventos se registran con `addEventListener`: el marcado no
   lleva manejadores en línea.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/** Prepara los datos y dibuja el catálogo completo. */
function alCargar() {
  iniciarDatos();
  pintarCatalogo(obtenerLibros());
}

/** Atiende el envío del buscador: filtra por título y repinta. */
function alBuscar(evento) {
  evento.preventDefault();
  const consulta = document.getElementById("catalogo-busqueda").value;
  pintarCatalogo(filtrarPorTitulo(consulta));
}

/** Registra los eventos de la vista. */
function registrarEventos() {
  document
    .getElementById("catalogo-form-busqueda")
    .addEventListener("submit", alBuscar);
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
