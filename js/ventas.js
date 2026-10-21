/* ============================================================================
   Librería ABC — composición de la venta
   Change 06 · Ejercicio 5: venta simulada e historial

   Responsabilidad: la venta en curso y la vista de Ventas. Agrega renglones,
   los modifica, calcula los importes, dibuja el resumen y confirma la venta.

   El precio unitario se lee vivo del catálogo mientras se compone y se
   congela al confirmar: el renglón registrado guarda su precio y el historial
   nunca vuelve a leerlo del catálogo.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/* --- La venta en curso ------------------------------------------------------ */

/* Los renglones de la venta que se está componiendo. Guardan el identificador
   del libro y la cantidad; el título y el precio se leen del catálogo. */
let renglonesVenta = [];

/** Devuelve los renglones de la venta en curso. */
function renglonesEnCurso() {
  return renglonesVenta;
}

/* --- Consultas del catálogo -------------------------------------------------- */

/** Devuelve el libro con ese identificador, o null si no existe. */
function libroPorId(libroId) {
  return obtenerLibros().find((libro) => libro.id === libroId) || null;
}

/** Devuelve el título del libro, o un texto legible si no existe. */
function tituloDeLibro(libroId) {
  const libro = libroPorId(libroId);
  return libro ? libro.titulo : "Libro desconocido";
}

/** Devuelve el precio actual del libro, o cero si no existe. */
function precioDeLibro(libroId) {
  const libro = libroPorId(libroId);
  return libro ? libro.precio : 0;
}

/* --- Composición ------------------------------------------------------------ */

/**
 * Agrega un renglón a la venta en curso.
 * Si el libro ya está en la venta, NO se crea otro renglón: se suma la
 * cantidad al existente y se avisa.
 */
function agregarRenglon(libroId, cantidad) {
  const existente = renglonesVenta.find((renglon) => renglon.libroId === libroId);
  if (existente) {
    const previa = leerCantidad(existente.cantidad) || 0;
    const nueva = previa + cantidad;
    existente.cantidad = String(nueva);
    return {
      renglon: existente,
      repetido: true,
      mensaje: "Se agregaron " + cantidad + " unidades más de «" + tituloDeLibro(libroId) +
        "»; el renglón queda con " + nueva + "."
    };
  }
  const renglon = { libroId: libroId, cantidad: String(cantidad) };
  renglonesVenta.push(renglon);
  return {
    renglon: renglon,
    repetido: false,
    mensaje: "Se agregó «" + tituloDeLibro(libroId) + "» a la venta."
  };
}

/** Cambia la cantidad de un renglón. La cantidad puede quedar inválida. */
function cambiarCantidad(libroId, cantidad) {
  const renglon = renglonesVenta.find((candidato) => candidato.libroId === libroId);
  if (renglon) {
    renglon.cantidad = cantidad;
  }
}

/** Quita un renglón de la venta en curso. */
function quitarRenglon(libroId) {
  renglonesVenta = renglonesVenta.filter((renglon) => renglon.libroId !== libroId);
}

/* --- Cálculos ---------------------------------------------------------------- */

/**
 * Calcula el subtotal de cada renglón y el total de la venta en curso.
 * Un renglón con cantidad inválida no tiene subtotal y queda fuera del total.
 */
function recalcular() {
  const subtotales = new Map();
  let total = 0;
  renglonesVenta.forEach((renglon) => {
    const cantidad = leerCantidad(renglon.cantidad);
    if (cantidad === null) {
      subtotales.set(renglon.libroId, null);
      return;
    }
    const subtotal = calcularSubtotal(cantidad, precioDeLibro(renglon.libroId));
    subtotales.set(renglon.libroId, subtotal);
    total = total + subtotal;
  });
  return { subtotales: subtotales, total: total };
}

/* --- Render del resumen ------------------------------------------------------ */

/**
 * Construye la fila de un renglón: libro, cantidad editable, precio unitario,
 * subtotal y la acción de quitarlo.
 *
 * El control de la cantidad nace dentro de una celda, fuera de cualquier
 * `.campo`, así que no recibe los estilos de los campos de formulario.
 */
function pintarFilaRenglon(renglon, subtotal) {
  const fila = document.createElement("tr");

  const celdaLibro = document.createElement("td");
  celdaLibro.textContent = tituloDeLibro(renglon.libroId);
  fila.appendChild(celdaLibro);

  const celdaCantidad = document.createElement("td");
  const entrada = document.createElement("input");
  entrada.type = "number";
  entrada.value = renglon.cantidad;
  entrada.dataset.libroId = renglon.libroId;
  celdaCantidad.appendChild(entrada);
  fila.appendChild(celdaCantidad);

  const celdaPrecio = document.createElement("td");
  celdaPrecio.classList.add("celda-atomica");
  celdaPrecio.textContent = formatearPrecio(precioDeLibro(renglon.libroId));
  fila.appendChild(celdaPrecio);

  const celdaSubtotal = document.createElement("td");
  celdaSubtotal.classList.add("celda-atomica");
  celdaSubtotal.textContent = subtotal === null ? "—" : formatearPrecio(subtotal);
  fila.appendChild(celdaSubtotal);

  const celdaAcciones = document.createElement("td");
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton boton--secundario";
  boton.textContent = "Quitar";
  boton.dataset.libroId = renglon.libroId;
  celdaAcciones.appendChild(boton);
  fila.appendChild(celdaAcciones);

  return fila;
}

/** Dibuja la tabla de renglones y el total, y alterna el estado vacío. */
function pintarResumen() {
  const cuerpo = document.getElementById("venta-renglones");
  if (!cuerpo) {
    return;
  }
  const calculo = recalcular();
  cuerpo.replaceChildren();
  renglonesVenta.forEach((renglon) => {
    cuerpo.appendChild(pintarFilaRenglon(renglon, calculo.subtotales.get(renglon.libroId)));
  });
  const celdaTotal = document.getElementById("venta-total");
  if (celdaTotal) {
    celdaTotal.textContent = formatearPrecio(calculo.total);
  }
  const estadoVacio = document.getElementById("venta-estado-vacio");
  if (estadoVacio) {
    estadoVacio.hidden = renglonesVenta.length > 0;
  }
}

/* --- Validación y confirmación ------------------------------------------------ */

/**
 * Revisa la venta en curso antes de confirmarla.
 * Devuelve el motivo del rechazo, o null si la venta se puede confirmar.
 */
function validarComposicion() {
  if (!document.getElementById("venta-cliente").value) {
    return "Elegí un cliente para la venta.";
  }
  if (renglonesVenta.length === 0) {
    return "Agregá al menos un renglón a la venta.";
  }
  for (const renglon of renglonesVenta) {
    if (leerCantidad(renglon.cantidad) === null) {
      return "La cantidad de «" + tituloDeLibro(renglon.libroId) +
        "» debe ser un número entero mayor que cero.";
    }
  }
  return null;
}

/** Devuelve la fecha local de hoy, en formato `YYYY-MM-DD`. Nunca usa UTC. */
function fechaLocal() {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return anio + "-" + mes + "-" + dia;
}

/**
 * Congela la venta en curso: copia el precio unitario, el título del libro y
 * el nombre del cliente, que quedan congelados en el registro.
 */
function congelarVenta() {
  const clienteId = document.getElementById("venta-cliente").value;
  const cliente = obtenerClientes().find((candidato) => candidato.id === clienteId);
  return {
    fecha: fechaLocal(),
    clienteId: clienteId,
    clienteNombre: cliente ? cliente.nombre : "",
    renglones: renglonesVenta.map((renglon) => {
      const libro = libroPorId(renglon.libroId);
      return {
        libroId: renglon.libroId,
        titulo: libro ? libro.titulo : "Libro desconocido",
        cantidad: leerCantidad(renglon.cantidad),
        precioUnitario: libro ? libro.precio : 0
      };
    })
  };
}

/** Vacía la venta en curso y reinicia los controles del formulario. */
function limpiarFormularioVenta() {
  renglonesVenta = [];
  document.getElementById("ventas-form-venta").reset();
}

/** Atiende el envío del formulario de venta. */
function alConfirmarVenta(evento) {
  evento.preventDefault();
  const mensajeError = document.getElementById("ventas-mensaje-error");
  const mensajeExito = document.getElementById("mensaje-exito");

  const motivo = validarComposicion();
  if (motivo !== null) {
    ocultarMensaje(mensajeExito);
    mostrarError(mensajeError, [motivo]);
    return;
  }

  const venta = agregarVenta(congelarVenta());

  limpiarFormularioVenta();
  pintarResumen();
  ocultarMensaje(mensajeError);
  mostrarExito(mensajeExito, "Se registró la venta " + venta.id + " por " + formatearPrecio(venta.total) + ".");
}

/* --- Eventos ------------------------------------------------------------------ */

/** Atiende el clic en «Agregar renglón». */
function alAgregarRenglon() {
  const mensajeError = document.getElementById("ventas-mensaje-error");
  const mensajeExito = document.getElementById("mensaje-exito");

  const libroId = document.getElementById("venta-libro").value;
  if (!libroId) {
    ocultarMensaje(mensajeExito);
    mostrarError(mensajeError, ["Elegí un libro para el renglón."]);
    return;
  }

  const cantidad = leerCantidad(document.getElementById("venta-cantidad").value);
  if (cantidad === null) {
    ocultarMensaje(mensajeExito);
    mostrarError(mensajeError, ["Ingresá una cantidad entera mayor que cero."]);
    return;
  }

  const resultado = agregarRenglon(libroId, cantidad);

  document.getElementById("venta-cantidad").value = "";
  pintarResumen();
  ocultarMensaje(mensajeError);
  mostrarExito(mensajeExito, resultado.mensaje);
}

/** Atiende el cambio de la cantidad de un renglón. */
function alCambiarCantidad(evento) {
  const entrada = evento.target;
  if (!entrada.dataset || !entrada.dataset.libroId) {
    return;
  }
  const libroId = entrada.dataset.libroId;
  cambiarCantidad(libroId, entrada.value);
  pintarResumen();
  enfocarCantidad(libroId);
}

/** Atiende el clic en «Quitar». */
function alQuitarRenglon(evento) {
  const boton = evento.target;
  if (!boton.dataset || !boton.dataset.libroId) {
    return;
  }
  quitarRenglon(boton.dataset.libroId);
  pintarResumen();
}

/** Devuelve el foco al campo de cantidad del renglón, que se acaba de redibujar. */
function enfocarCantidad(libroId) {
  const entradas = document.getElementById("venta-renglones").querySelectorAll("input[data-libro-id]");
  for (const entrada of entradas) {
    if (entrada.dataset.libroId === libroId) {
      entrada.focus();
      return;
    }
  }
}
