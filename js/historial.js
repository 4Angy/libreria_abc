/* ============================================================================
   Librería ABC — vista del historial de ventas
   Change 06 · Ejercicio 5: venta simulada e historial

   Responsabilidad: dibujar el listado de ventas registradas y el detalle de
   una venta. El detalle solo se muestra cuando se pide, y al cerrarlo sus
   campos quedan vacíos.

   Los importes se derivan de los valores guardados en la venta: el precio
   unitario es el que se copió al confirmar, nunca el del catálogo.

   Script clásico (no módulo ES): los `import` desde `file://` están bloqueados
   por la política de origen de Chrome y Edge, y el parcial debe funcionar
   abriendo los archivos directamente, sin servidor.
   ========================================================================== */

"use strict";

/* --- Listado ------------------------------------------------------------------ */

/** Compara dos ventas de la más reciente a la más antigua. */
function compararVentas(primera, segunda) {
  if (primera.fecha !== segunda.fecha) {
    return primera.fecha < segunda.fecha ? 1 : -1;
  }
  return primera.id < segunda.id ? 1 : -1;
}

/** Construye la fila de una venta con su acción de consultar el detalle. */
function crearFilaVenta(venta) {
  const fila = document.createElement("tr");
  [
    { texto: venta.id, atomica: true },
    { texto: venta.fecha, atomica: true },
    { texto: venta.clienteNombre, atomica: false },
    { texto: formatearPrecio(venta.total), atomica: true }
  ].forEach((valor) => {
    const celda = document.createElement("td");
    if (valor.atomica) {
      celda.classList.add("celda-atomica");
    }
    celda.textContent = valor.texto;
    fila.appendChild(celda);
  });

  const celdaAcciones = document.createElement("td");
  const boton = document.createElement("button");
  boton.type = "button";
  boton.className = "boton boton--secundario";
  boton.textContent = "Ver detalle";
  boton.dataset.ventaId = venta.id;
  celdaAcciones.appendChild(boton);
  fila.appendChild(celdaAcciones);

  return fila;
}

/** Dibuja el listado de ventas y alterna su estado vacío. */
function renderizarHistorial() {
  const cuerpo = document.getElementById("historial-listado");
  if (!cuerpo) {
    return;
  }
  const ventas = obtenerVentas();
  cuerpo.replaceChildren();
  ventas.slice().sort(compararVentas).forEach((venta) => {
    cuerpo.appendChild(crearFilaVenta(venta));
  });
  const estadoVacio = document.getElementById("historial-estado-vacio");
  if (estadoVacio) {
    estadoVacio.hidden = ventas.length > 0;
  }
}

/* --- Detalle ------------------------------------------------------------------ */

/** Construye la fila de un renglón del detalle de una venta. */
function crearFilaRenglonDetalle(renglon) {
  const fila = document.createElement("tr");
  const subtotal = calcularSubtotal(renglon.cantidad, renglon.precioUnitario);
  [
    { texto: renglon.titulo, atomica: false },
    { texto: String(renglon.cantidad), atomica: true },
    { texto: formatearPrecio(renglon.precioUnitario), atomica: true },
    { texto: formatearPrecio(subtotal), atomica: true }
  ].forEach((valor) => {
    const celda = document.createElement("td");
    if (valor.atomica) {
      celda.classList.add("celda-atomica");
    }
    celda.textContent = valor.texto;
    fila.appendChild(celda);
  });
  return fila;
}

/** Muestra el bloque de detalle con los datos de la venta y sus renglones. */
function mostrarDetalle(venta) {
  document.getElementById("historial-detalle").hidden = false;
  document.getElementById("historial-detalle-identificador").textContent = venta.id;
  document.getElementById("historial-detalle-fecha").textContent = venta.fecha;
  document.getElementById("historial-detalle-cliente").textContent = venta.clienteNombre;
  document.getElementById("historial-detalle-total").textContent = formatearPrecio(venta.total);

  const cuerpo = document.getElementById("historial-detalle-renglones");
  cuerpo.replaceChildren();
  venta.renglones.forEach((renglon) => {
    cuerpo.appendChild(crearFilaRenglonDetalle(renglon));
  });
}

/** Oculta el bloque de detalle y deja sus campos vacíos. */
function cerrarDetalle() {
  document.getElementById("historial-detalle").hidden = true;
  [
    "historial-detalle-identificador",
    "historial-detalle-fecha",
    "historial-detalle-cliente",
    "historial-detalle-total"
  ].forEach((id) => {
    document.getElementById(id).textContent = "";
  });
  document.getElementById("historial-detalle-renglones").replaceChildren();
}

/* --- Eventos ------------------------------------------------------------------ */

/** Atiende el clic en «Ver detalle». */
function alVerDetalle(evento) {
  const boton = evento.target;
  if (!boton.dataset || !boton.dataset.ventaId) {
    return;
  }
  const venta = obtenerVentas().find((candidato) => candidato.id === boton.dataset.ventaId);
  if (venta) {
    mostrarDetalle(venta);
  }
}
