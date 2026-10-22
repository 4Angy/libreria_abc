# Design — Change 10: Diseño del filtro del catálogo antes de implementar

## Context

El buscador del catálogo (`form#catalogo-form-busqueda`) tiene hoy un único bloque:

```html
<form id="catalogo-form-busqueda" class="formulario tarjeta" role="search">
  <p class="campo campo--busqueda">
    <label for="catalogo-busqueda">Buscar por título</label>
    <input type="search" id="catalogo-busqueda" name="titulo">
    <button type="submit" id="catalogo-boton-buscar" class="boton boton--primario">Buscar</button>
  </p>
</form>
```

Y el CSS ya contempla casi todo lo necesario para los controles que el change `08-filtros-catalogo` quiere agregar: `.campo select` (línea 240), `.campo select[multiple]` (252), `.campo--busqueda` como flex con label full-width e input flexible (263–277), y `.formulario fieldset` con grid columnal (205–220).

La exploración detectó que **ninguno de esos estilos resuelve la combinación que se quiere**: criterio + consulta + rango de precio + botón en una sola fila flexible no está pensado; el fieldset sí da un layout columnal sin reglas nuevas; y el label es estático.

## Goals / Non-Goals

**Goals:**

- Tener cerrada, en este change, la estrategia de layout del buscador con criterio, consulta, precio y acción de quitar.
- Tener cerrada la estrategia de label/placeholder según el criterio.

**Non-Goals:**

- No implementar los filtros (eso es el change `08-filtros-catalogo`, ya completo y pendiente de apply).
- No agregar reglas nuevas de CSS si se puede evitarlo; si se necesita, es una decisión explícita aquí.

## Decisions

### D-A — Estrategia de layout del buscador

**Decisión propuesta:** usar un contenedor `fieldset` dentro del `form.formulario` (regla existente: grid columnal, `gap: var(--espacio-4)`), con los controles distribuidos como bloques. Sin reglas nuevas de CSS.

**Alternativas consideradas:**

- *Reutilizar `p.campo--busqueda` con el `<select>` añadido:* descartada como estrategia principal, porque el flex actual (label full / input flexible / botón) no contempla criterio+consulta+precio con buena separación visual, y forzaría un retoque de CSS.
- *Reestructurar el `p.campo--busqueda` actual:* viable, pero mezcla semántica (p.campo) con layout de búsqueda; requiere más cambios de marcado.

**Regla acordada (por proponer):** si el criterio se elige con `<select>` fijo, la consulta con `input[type=search]`, el rango con dos inputs numéricos y la acción «Quitar filtros» con botón, todo dentro de un `fieldset` del form.

### D-B — Label según criterio

**Decisión propuesta:** mantener el control único `input#catalogo-busqueda` asociado a `<label for="catalogo-busqueda">`, y actualizar el texto del label vía JS (`label[for="catalogo-busqueda"]`) cuando el criterio cambie (título / autor / género / editorial). Sin cambios de HTML.

**Alternativa considerada:** label estático «Buscar por…» o placeholder dinámico. Descartada como principal por accesibilidad (el label debe describir el control correcto en todo momento).

### D-C — Lo que NO se decide aquí (queda abierto / ya decidido en el change 08)

- Conjunto final de criterios: título, autor, género, editorial (precio ya tratado como rango).
- Semántica de acumulación: texto + precio (ya fijada en el spec delta del change 08).

## Risks / Trade-offs

| Riesgo | Mitigación |
|---|---|
| Que la decisión de layout (D-A) cambie después | Es la primera tarea del change; el implementador del change 08 debe respetarla |
| Que el label (D-B) se resuelva mal | Se decide en este change antes de tocar código |

## Migration Plan

Ninguna: no hay datos ni estados que migrar. Las decisiones se incorporan al diseño del change `08-filtros-catalogo` al momento de su apply.

## Open Questions

Ninguna que bloquee la planificación de este change. Dos decisiones de diseño se resolverán al implementar según lo decidido aquí.
