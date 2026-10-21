/* ============================================================================
   Librería ABC — reglas de validación
   Change 05 · Ejercicio 4: alta de libros y clientes
   Change 06 · Ejercicio 5: venta simulada e historial

   Responsabilidad: las reglas puras de la aplicación. Cada función recibe lo
   que se leyó del formulario y el contexto contra el cual comparar, y
   devuelve si los datos son válidos y qué reglas no se cumplieron.

   Este archivo no toca el DOM ni el estado vivo, y no depende de ningún otro
   módulo: se puede ejercitar con Node pasándole colecciones a mano.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/* --- Formatos admitidos ---------------------------------------------------- */

/* Exige una arroba, sin espacios, texto antes y después, y al menos un punto
   en el dominio. */
const EXPRESION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* Un entero, con signo opcional, y una parte decimal opcional de una o dos
   cifras, separada por punto o por coma. Un precio en pesos tiene como máximo
   dos decimales, y ese tope es además lo que rechaza el separador de miles:
   "1.500" tiene tres decimales y no es un precio admisible, mientras que
   "1.500" interpretado como número sería 1.5, mil veces menor. */
const EXPRESION_PRECIO = /^-?\d+(?:[.,]\d{1,2})?$/;

/* Una cantidad es un entero, sin signo y mayor que cero. El signo se excluye
   para que "-2" se rechace por no ser mayor que cero y no por formato. */
const EXPRESION_CANTIDAD = /^\d+$/;

/* --- Utilidades ------------------------------------------------------------ */

/** Devuelve el texto de un valor cualquiera; null y undefined se vuelven "". */
function textoDe(valor) {
  return valor === null || valor === undefined ? "" : String(valor);
}

/* --- Normalización --------------------------------------------------------- */

/** Quita todos los espacios y guiones de un ISBN, para poder compararlo. */
function normalizarIsbn(texto) {
  return textoDe(texto).replace(/[\s-]/g, "");
}

/** Recorta los extremos de un email y lo pasa a minúsculas, para compararlo. */
function normalizarEmail(texto) {
  return textoDe(texto).trim().toLowerCase();
}

/* --- Comprobaciones de formato --------------------------------------------- */

/** Indica si un correo electrónico tiene un formato válido. */
function esEmailValido(email) {
  return EXPRESION_EMAIL.test(textoDe(email).trim());
}

/**
 * Interpreta el texto de una cantidad: devuelve el entero cuando es un entero
 * mayor que cero, y null en cualquier otro caso.
 *
 * El control es de tipo number, de modo que el navegador ya descartó lo que
 * no es un número: el texto vacío y el texto no numérico son indistinguibles
 * y los dos se rechazan.
 */
function leerCantidad(texto) {
  const limpio = textoDe(texto).trim();
  if (!EXPRESION_CANTIDAD.test(limpio)) {
    return null;
  }
  const cantidad = Number(limpio);
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    return null;
  }
  return cantidad;
}

/**
 * Convierte el texto de un precio en un número.
 * Devuelve null cuando el texto no es un precio admisible.
 */
function leerPrecio(texto) {
  const limpio = textoDe(texto).trim();
  if (!EXPRESION_PRECIO.test(limpio)) {
    return null;
  }
  return Number(limpio.replace(",", "."));
}

/* --- Comparaciones con el conjunto local ----------------------------------- */

/** Indica si ya existe un libro con ese ISBN, comparado sin espacios ni guiones. */
function existeIsbnEn(libros, isbn) {
  const buscado = normalizarIsbn(isbn);
  return (libros || []).some((libro) => normalizarIsbn(libro.isbn) === buscado);
}

/** Indica si ya existe un cliente con ese email, comparado sin espacios ni mayúsculas. */
function existeEmailEn(clientes, email) {
  const buscado = normalizarEmail(email);
  return (clientes || []).some((cliente) => normalizarEmail(cliente.email) === buscado);
}

/** Indica si la editorial indicada existe en el conjunto local. */
function existeEditorialEn(editoriales, idEditorial) {
  if (!idEditorial) {
    return false;
  }
  return (editoriales || []).some((editorial) => editorial.id === idEditorial);
}

/** Indica si el género indicado existe en el conjunto local. */
function existeGeneroEn(generos, idGenero) {
  if (!idGenero) {
    return false;
  }
  return (generos || []).some((genero) => genero.id === idGenero);
}

/** Indica si el autor indicado existe en el conjunto local. */
function existeAutorEn(autores, idAutor) {
  return (autores || []).some((autor) => autor.id === idAutor);
}

/* --- Validación del alta de libro ------------------------------------------ */

/**
 * Comprueba los datos de un libro contra las reglas del Ejercicio 4.
 *
 * `datos` trae lo que se leyó del formulario: título, ISBN, precio (texto),
 * editorial, género y los ids de los autores elegidos.
 * `contexto` trae las colecciones locales contra las que comparar.
 *
 * Devuelve `{ ok, errores }`, con un mensaje completo por cada regla
 * incumplida. Todas las reglas se evalúan: se informan todos los motivos.
 */
function validarLibro(datos, contexto) {
  const errores = [];
  const valores = datos || {};
  const conjunto = contexto || {};

  if (textoDe(valores.titulo).trim() === "") {
    errores.push("Ingresá el título del libro.");
  }

  const isbn = textoDe(valores.isbn).trim();
  if (isbn === "") {
    errores.push("Ingresá el ISBN del libro.");
  } else if (existeIsbnEn(conjunto.libros, isbn)) {
    errores.push("Ya existe un libro con ese ISBN.");
  }

  const textoPrecio = textoDe(valores.precio).trim();
  if (textoPrecio === "") {
    errores.push("Ingresá el precio del libro.");
  } else {
    const precio = leerPrecio(textoPrecio);
    if (precio === null) {
      errores.push("El precio debe ser un número, por ejemplo 1500 o 1500.50, sin separador de miles.");
    } else if (precio <= 0) {
      errores.push("El precio debe ser mayor que cero.");
    }
  }

  if (!existeEditorialEn(conjunto.editoriales, valores.editorialId)) {
    errores.push("Elegí una editorial de la lista.");
  }

  const autorIds = Array.isArray(valores.autorIds) ? valores.autorIds : [];
  if (autorIds.length === 0) {
    errores.push("Elegí al menos un autor.");
  } else if (!autorIds.every((idAutor) => existeAutorEn(conjunto.autores, idAutor))) {
    errores.push("Uno de los autores seleccionados no existe.");
  }

  const generoId = textoDe(valores.generoId);
  if (generoId !== "" && !existeGeneroEn(conjunto.generos, generoId)) {
    errores.push("Elegí un género de la lista.");
  }

  return { ok: errores.length === 0, errores: errores };
}

/* --- Validación del alta de cliente ---------------------------------------- */

/**
 * Comprueba los datos de un cliente contra las reglas del Ejercicio 4.
 *
 * `datos` trae el nombre y el email leídos del formulario.
 * `contexto` trae la colección local de clientes.
 *
 * Devuelve `{ ok, errores }`, con un mensaje completo por cada regla
 * incumplida.
 */
function validarCliente(datos, contexto) {
  const errores = [];
  const valores = datos || {};
  const conjunto = contexto || {};

  if (textoDe(valores.nombre).trim() === "") {
    errores.push("Ingresá el nombre completo del cliente.");
  }

  const email = textoDe(valores.email).trim();
  if (email === "") {
    errores.push("Ingresá el correo electrónico del cliente.");
  } else if (!esEmailValido(email)) {
    errores.push("El correo electrónico no tiene un formato válido.");
  } else if (existeEmailEn(conjunto.clientes, email)) {
    errores.push("Ya existe un cliente con ese correo electrónico.");
  }

  return { ok: errores.length === 0, errores: errores };
}
