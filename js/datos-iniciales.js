/* ============================================================================
   Librería ABC — datos iniciales
   Ubicación: js/datos-iniciales.js (se carga antes que el resto de los scripts)
   Change 03 · Ejercicio 3: datos locales, catálogo y filtro

   Script clásico (no módulo ES): los módulos cargados por `file://` están
   bloqueados por la política de origen en Chrome y Edge, y el parcial debe
   funcionar abriendo los archivos directamente, sin servidor.

   Estructura: un único objeto `DATOS_INICIALES` con arrays paralelos y
   relaciones por identificador estable (nunca por posición en el array).

   - Títulos, autores, editoriales y géneros: reales.
   - ISBN: valores de referencia; el parcial no exige validar el dígito de
     control, solo comparar el ISBN sin espacios ni guiones.
   - Precios: ficticios, en pesos.
   - Clientes y ventas: ficticios.

   La aplicación copia estos datos antes de modificarlos: este objeto es la
   semilla, no el estado vivo.
   ========================================================================== */

"use strict";

const DATOS_INICIALES = {
  /* --- Editoriales ------------------------------------------------------- */
  editoriales: [
    { id: "ed-sudamericana", nombre: "Editorial Sudamericana" },
    { id: "ed-planeta", nombre: "Editorial Planeta" },
    { id: "ed-salamandra", nombre: "Salamandra" },
    { id: "ed-lumen", nombre: "Lumen" },
    { id: "ed-seixbarral", nombre: "Seix Barral" },
    { id: "ed-critica", nombre: "Crítica" },
    { id: "ed-alfaguara", nombre: "Alfaguara" }
  ],

  /* --- Géneros ----------------------------------------------------------- */
  generos: [
    { id: "gen-realismo-magico", nombre: "Realismo Mágico" },
    { id: "gen-fantasia", nombre: "Fantasía" },
    { id: "gen-misterio", nombre: "Misterio" },
    { id: "gen-novela", nombre: "Novela" },
    { id: "gen-ensayo", nombre: "Ensayo" }
  ],

  /* --- Autores ----------------------------------------------------------- */
  autores: [
    { id: "au-gabriel-garcia-marquez", nombre: "Gabriel García Márquez" },
    { id: "au-tolkien", nombre: "J. R. R. Tolkien" },
    { id: "au-rowling", nombre: "J. K. Rowling" },
    { id: "au-eco", nombre: "Umberto Eco" },
    { id: "au-cortazar", nombre: "Julio Cortázar" },
    { id: "au-harari", nombre: "Yuval Noah Harari" },
    { id: "au-cervantes", nombre: "Miguel de Cervantes" },
    { id: "au-neruda", nombre: "Pablo Neruda" },
    { id: "au-levitt", nombre: "Steven Levitt" },
    { id: "au-dubner", nombre: "Stephen Dubner" }
  ],

  /* --- Libros ------------------------------------------------------------ */
  libros: [
    {
      id: "li-cien-anos-de-soledad",
      titulo: "Cien años de soledad",
      isbn: "9780307474728",
      editorialId: "ed-sudamericana",
      generoId: "gen-realismo-magico",
      autorIds: ["au-gabriel-garcia-marquez"],
      precio: 24500.0
    },
    {
      id: "li-hobbit",
      titulo: "El Hobbit",
      isbn: "9789507324786",
      editorialId: "ed-planeta",
      generoId: "gen-fantasia",
      autorIds: ["au-tolkien"],
      precio: 21900.0
    },
    {
      id: "li-piedra-filosofal",
      titulo: "Harry Potter y la piedra filosofal",
      isbn: "9788498922228",
      editorialId: "ed-salamandra",
      generoId: "gen-fantasia",
      autorIds: ["au-rowling"],
      precio: 28500.0
    },
    {
      id: "li-nombre-de-la-rosa",
      titulo: "El nombre de la rosa",
      isbn: "9788499890524",
      editorialId: "ed-lumen",
      generoId: "gen-misterio",
      autorIds: ["au-eco"],
      precio: 19900.0
    },
    {
      id: "li-rayuela",
      titulo: "Rayuela",
      isbn: "9788437604576",
      editorialId: "ed-seixbarral",
      generoId: "gen-novela",
      autorIds: ["au-cortazar"],
      precio: 17900.0
    },
    {
      id: "li-sapiens",
      titulo: "Sapiens: De animales a dioses",
      isbn: "9788499926223",
      editorialId: "ed-critica",
      generoId: "gen-ensayo",
      autorIds: ["au-harari"],
      precio: 32900.0
    },
    {
      id: "li-quijote-de-la-mancha",
      titulo: "Don Quijote de la Mancha",
      isbn: "9788467034451",
      editorialId: "ed-planeta",
      generoId: "gen-novela",
      autorIds: ["au-cervantes"],
      precio: 15900.0
    },
    {
      id: "li-veinte-poemas-de-amor",
      titulo: "Veinte poemas de amor",
      isbn: "9788478886680",
      editorialId: "ed-alfaguara",
      generoId: null,
      autorIds: ["au-neruda"],
      precio: 13900.0
    },
    {
      id: "li-freakonomics",
      titulo: "Freakonomics",
      isbn: "9788499922223",
      editorialId: "ed-critica",
      generoId: "gen-ensayo",
      autorIds: ["au-levitt", "au-dubner"],
      precio: 25900.0
    }
  ],

  /* --- Clientes (ficticios) ---------------------------------------------- */
  clientes: [
    {
      id: "cl-martina-ferreyra",
      nombre: "Martina Ferreyra",
      email: "martina.ferreyra@example.com"
    },
    {
      id: "cl-diego-sosa",
      nombre: "Diego Sosa",
      email: "diego.sosa@example.com"
    },
    {
      id: "cl-lucia-bianchi",
      nombre: "Lucía Bianchi",
      email: "lucia.bianchi@example.com"
    },
    {
      id: "cl-nicolas-ferreyra",
      nombre: "Nicolás Ferreyra",
      email: "nicolas.ferreyra@example.com"
    }
  ],

  /* --- Ventas iniciales (ficticias) -------------------------------------- */
  /* Cada renglón guarda el precio unitario como valor histórico: al leer el
     historial no se vuelve a consultar el precio actual del catálogo. */
  ventas: [
    {
      id: "vt-2026-0001",
      fecha: "2026-03-14",
      clienteId: "cl-martina-ferreyra",
      clienteNombre: "Martina Ferreyra",
      renglones: [
        {
          libroId: "li-quijote-de-la-mancha",
          titulo: "Don Quijote de la Mancha",
          cantidad: 2,
          precioUnitario: 15900.0
        },
        {
          libroId: "li-hobbit",
          titulo: "El Hobbit",
          cantidad: 1,
          precioUnitario: 21900.0
        }
      ],
      total: 53700.0
    },
    {
      id: "vt-2026-0002",
      fecha: "2026-04-02",
      clienteId: "cl-diego-sosa",
      clienteNombre: "Diego Sosa",
      renglones: [
        {
          libroId: "li-sapiens",
          titulo: "Sapiens: De animales a dioses",
          cantidad: 1,
          precioUnitario: 32900.0
        },
        {
          libroId: "li-piedra-filosofal",
          titulo: "Harry Potter y la piedra filosofal",
          cantidad: 2,
          precioUnitario: 28500.0
        }
      ],
      total: 89900.0
    }
  ]
};
