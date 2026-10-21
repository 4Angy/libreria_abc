/* ============================================================================
   Librería ABC — capa de persistencia
   Change 07 · Ejercicio 6: persistencia, verificación y documentación

   Responsabilidad: hablar con el almacenamiento del navegador. Es la única
   capa del proyecto que usa `localStorage`: guarda y recupera las tres
   colecciones, y avisa por la consola cuando algo falla.

   Ninguna función de este archivo lanza una excepción: todo problema se
   traduce en un valor de retorno, para que la aplicación siga funcionando
   aunque el navegador no permita usar el almacenamiento.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen en Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/* --- Las claves ------------------------------------------------------------ */

/* Una clave por colección. El prefijo evita que colisionen con otras
   aplicaciones que compartan origen en el mismo navegador. */
const CLAVE_LIBROS = "libreriaABC.libros";
const CLAVE_CLIENTES = "libreriaABC.clientes";
const CLAVE_VENTAS = "libreriaABC.ventas";

/* --- La forma que se espera de cada colección ------------------------------- */

/* Los campos que cada elemento tiene que tener para que la aplicación pueda
   usarlo. Si a un elemento de la lista le falta alguno, la colección entera
   se descarta: un almacenamiento editado a mano no puede romper la aplicación.

   `generoId` puede venir vacío, pero tiene que estar presente: su ausencia
   significaría un formato distinto. */
const CAMPOS_POR_CLAVE = {
  [CLAVE_LIBROS]: ["id", "titulo", "isbn", "editorialId", "generoId", "autorIds", "precio"],
  [CLAVE_CLIENTES]: ["id", "nombre", "email"],
  [CLAVE_VENTAS]: ["id", "fecha", "clienteId", "clienteNombre", "renglones", "total"]
};

/* Los campos que cada renglón de una venta tiene que tener. El renglón no
   guarda el subtotal: se deriva de la cantidad y del precio unitario. */
const CAMPOS_RENGLON = ["libroId", "titulo", "cantidad", "precioUnitario"];

/* --- Avisos ---------------------------------------------------------------- */

/* Informa un problema del almacenamiento por la consola del navegador. El
   aviso va a la consola y no a la pantalla: la aplicación no tiene un
   contenedor de error común en las cinco vistas, y un fallo del
   almacenamiento no debe interrumpir la operación que la persona pidió. */
function avisarDeAlmacenamiento(mensaje) {
  if (typeof console !== "undefined" && typeof console.warn === "function") {
    console.warn("Librería ABC: " + mensaje);
  }
}

/* --- El almacenamiento ------------------------------------------------------ */

/** Devuelve el almacenamiento local del navegador, o null si no se puede usar. */
function obtenerAlmacenamiento() {
  try {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    return window.localStorage;
  } catch (error) {
    /* Algunos navegadores lanzan al leer la propia propiedad `localStorage`. */
    return null;
  }
}

/**
 * Indica si el almacenamiento local se puede usar.
 * La prueba es de escritura: en el modo privado estricto leer funciona y
 * escribir falla, y lo que importa es poder guardar.
 */
function almacenamientoDisponible() {
  const almacen = obtenerAlmacenamiento();
  if (almacen === null) {
    return false;
  }
  const clave = "__libreria_abc_prueba__";
  try {
    almacen.setItem(clave, "1");
    almacen.removeItem(clave);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Indica si la clave existe en el almacenamiento.
 * La clave puede existir y su contenido no ser válido: eso se decide al leer.
 */
function hayGuardado(clave) {
  const almacen = obtenerAlmacenamiento();
  if (almacen === null) {
    return false;
  }
  try {
    return almacen.getItem(clave) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Indica si la colección tiene la forma que la aplicación espera.
 * Una clave que la aplicación no reconoce no se puede usar.
 */
function tieneLaFormaEsperada(clave, coleccion) {
  if (!Array.isArray(coleccion)) {
    return false;
  }
  const campos = CAMPOS_POR_CLAVE[clave];
  if (!campos) {
    return false;
  }
  return coleccion.every((elemento) => {
    if (!elemento || typeof elemento !== "object") {
      return false;
    }
    if (!campos.every((campo) => Object.prototype.hasOwnProperty.call(elemento, campo))) {
      return false;
    }
    if (clave === CLAVE_VENTAS) {
      return elemento.renglones.every((renglon) => {
        if (!renglon || typeof renglon !== "object") {
          return false;
        }
        return CAMPOS_RENGLON.every((campo) => Object.prototype.hasOwnProperty.call(renglon, campo));
      });
    }
    return true;
  });
}

/**
 * Lee una colección del almacenamiento.
 * Devuelve la lista guardada, o null si no hay nada guardado, si el contenido
 * no se puede interpretar o si no tiene la forma esperada.
 * Nunca lanza una excepción.
 */
function leerGuardado(clave) {
  const almacen = obtenerAlmacenamiento();
  if (almacen === null) {
    return null;
  }
  let texto = null;
  try {
    texto = almacen.getItem(clave);
  } catch (error) {
    avisarDeAlmacenamiento("no se pudo leer la clave «" + clave + "»: " + error.message);
    return null;
  }
  if (texto === null) {
    return null;
  }
  let coleccion = null;
  try {
    coleccion = JSON.parse(texto);
  } catch (error) {
    avisarDeAlmacenamiento("el contenido de «" + clave + "» no es un JSON válido: se usan los datos de ejemplo y la clave no se modifica.");
    return null;
  }
  if (!tieneLaFormaEsperada(clave, coleccion)) {
    avisarDeAlmacenamiento("el contenido de «" + clave + "» no tiene la forma esperada: se usan los datos de ejemplo y la clave no se modifica.");
    return null;
  }
  return coleccion;
}

/**
 * Escribe una colección en el almacenamiento.
 * Devuelve si se pudo escribir. Nunca lanza una excepción.
 */
function escribirGuardado(clave, valor) {
  const almacen = obtenerAlmacenamiento();
  if (almacen === null) {
    avisarDeAlmacenamiento("el almacenamiento del navegador no está disponible: los registros no se guardan.");
    return false;
  }
  let texto = null;
  try {
    texto = JSON.stringify(valor);
  } catch (error) {
    avisarDeAlmacenamiento("no se pudo preparar el contenido de «" + clave + "»: " + error.message);
    return false;
  }
  try {
    almacen.setItem(clave, texto);
    return true;
  } catch (error) {
    avisarDeAlmacenamiento("no se pudo guardar «" + clave + "»: " + error.message + " Los registros siguen en pantalla, pero no quedan guardados.");
    return false;
  }
}

/* --- El guardado por colección ---------------------------------------------- */

/** Guarda la colección de libros. */
function guardarLibros(coleccion) {
  return escribirGuardado(CLAVE_LIBROS, coleccion);
}

/** Guarda la colección de clientes. */
function guardarClientes(coleccion) {
  return escribirGuardado(CLAVE_CLIENTES, coleccion);
}

/** Guarda la colección de ventas. */
function guardarVentas(coleccion) {
  return escribirGuardado(CLAVE_VENTAS, coleccion);
}
