/* ============================================================================
   Librería ABC — renderizado y filtro del catálogo
   Change 03 · Ejercicio 3: datos locales, catálogo y filtro

   Responsabilidad: dibujar el catálogo a partir del modelo y resolver el
   filtro por título. Todos los datos se insertan en el DOM como texto: se
   crean elementos y se les asigna texto, nunca se interpreta HTML.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/* Texto que se muestra cuando el libro no tiene género asignado.
   Es el mismo texto que el HTML ya usa para ese caso. */
const TEXTO_SIN_GENERO = "Sin clasificar";

/* --- Renderizado ----------------------------------------------------------- */

/** Dibuja el catálogo: vacía el cuerpo de la tabla y agrega una fila por libro. */
function pintarCatalogo(libros) {
  const cuerpo = document.getElementById("catalogo-listado");
  cuerpo.replaceChildren();
  libros.forEach((libro) => {
    cuerpo.appendChild(crearFilaLibro(libro));
  });
  actualizarEstados(libros.length);
}

/** Construye la fila de un libro, con una celda por columna del encabezado. */
function crearFilaLibro(libro) {
  const fila = document.createElement("tr");
  const valores = [
    { texto: libro.titulo, atomica: false },
    { texto: libro.isbn, atomica: true },
    { texto: obtenerEditorial(libro.editorialId), atomica: false },
    { texto: obtenerGenero(libro.generoId) || TEXTO_SIN_GENERO, atomica: false },
    { texto: obtenerAutores(libro.autorIds), atomica: false },
    { texto: formatearPrecio(libro.precio), atomica: true }
  ];
  valores.forEach((valor) => {
    const celda = document.createElement("td");
    if (valor.atomica) {
      celda.classList.add("celda-atomica");
    }
    celda.textContent = valor.texto;
    fila.appendChild(celda);
  });
  return fila;
}

/** Presenta un importe con dos decimales y formato local. */
function formatearPrecio(precio) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS"
  }).format(precio);
}

/* --- Filtro ---------------------------------------------------------------- */

/** Recorta los espacios de los extremos y pasa la consulta a minúsculas. */
function normalizarConsulta(texto) {
  return texto.trim().toLowerCase();
}

/** Devuelve los libros cuyo título coincide con la consulta, en forma parcial.
    Una consulta vacía devuelve el catálogo completo. */
function filtrarPorTitulo(consulta) {
  const libros = obtenerLibros();
  const consultaNormalizada = normalizarConsulta(consulta);
  if (consultaNormalizada === "") {
    return libros;
  }
  return libros.filter((libro) => {
    return libro.titulo.toLowerCase().includes(consultaNormalizada);
  });
}

/* --- Estados --------------------------------------------------------------- */

/** Muestra u oculta el mensaje de catálogo vacío. */
function mostrarEstadoVacio(visible) {
  document.getElementById("catalogo-estado-vacio").hidden = !visible;
}

/** Muestra u oculta el mensaje de búsqueda sin resultados. */
function mostrarEstadoSinResultados(visible) {
  document.getElementById("catalogo-estado-sin-resultados").hidden = !visible;
}

/** Deja visible como máximo un mensaje, según el resultado de la búsqueda. */
function actualizarEstados(cantidadMostrada) {
  const hayLibros = obtenerLibros().length > 0;
  mostrarEstadoVacio(!hayLibros);
  mostrarEstadoSinResultados(hayLibros && cantidadMostrada === 0);
}
