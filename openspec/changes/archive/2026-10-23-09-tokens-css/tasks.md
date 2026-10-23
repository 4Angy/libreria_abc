# Tasks

## 1. Acuerdo y línea de base

- [x] 1.1 T-01 - Acordar con las dos integrantes si se ejecuta este change y cómo se reparte, dado que `css/estilos.css` es del Ejercicio 2, a cargo de María de los Ángeles Zalazar. **Verificación:** el acuerdo queda anotado en el informe de comprobaciones, con el reparto de tareas de cada una.
- [x] 1.2 T-02 - Capturar la línea de base: las cinco vistas a 320 px y a 1280 px, antes de tocar la hoja de estilos, y anotar los hashes del archivo. **Verificación:** las diez capturas y el hash quedan en el instrumental; el hash se anota en el informe.
- [x] 1.3 T-03 - Anotar el diagnóstico: las 26 líneas con valores literales fuera del bloque `:root` y su valor actual. **Verificación:** el informe lista las 26 líneas con su literal, igual que el diagnóstico del 22/10/2026.

## 2. Los tokens nuevos

- [x] 2.1 T-04 - Declarar en el bloque `:root` los tokens de borde: `--borde-fino` (1px), `--borde-medio` (2px), `--borde-destacado` (3px) y `--borde-grueso` (4px). **Verificación:** los cuatro tokens existen con esos valores y sustituyen a los literales de las líneas 114, 169, 187, 218, 248, 291, 356, 368, 375, 385, 386 y 408.
- [x] 2.2 T-05 - Declarar los tokens de duración: `--duracion-transicion` (120ms) y `--duracion-reducida` (0.01ms), con un comentario que explique para qué sirve el segundo. **Verificación:** los dos tokens existen y sustituyen a los literales de las líneas 294, 481 y 482.
- [x] 2.3 T-06 - Declarar los tokens de ancho: `--espacio-contenedor` (2rem), `--ancho-contenido` (1100px), `--ancho-tabla` (760px), `--ancho-tabla-compacta` (480px), `--ancho-minimo-columna` (12rem), `--ancho-columna-min` (10rem) y `--ancho-columna-max` (16rem). **Verificación:** los siete tokens existen y sustituyen a los literales de las líneas 108, 275, 335, 341 y 445.
- [x] 2.4 T-07 - Declarar los tokens de alto: `--alto-marca` (3rem) y `--alto-minimo-tarjeta` (7rem). **Verificación:** los dos tokens existen y sustituyen a los literales de las líneas 140 y 253.
- [x] 2.5 T-08 - Declarar los tokens del foco: `--grosor-foco` (3px) y `--desplazamiento-foco` (2px). **Verificación:** los dos tokens existen y sustituyen a los literales de las líneas 436 y 437.
- [x] 2.6 T-09 - Dejar los puntos de quiebre de las media queries **escritos** en su lugar, con un comentario al lado de cada uno que explique que CSS no admite `var()` en la condición de `@media`. **Verificación:** las líneas 443 y 462 conservan `640px` y `1024px`, cada una con su comentario **al lado** —sin poner la cifra en una línea propia, porque el diagnóstico también lee los comentarios—; el total sigue en 26 líneas, porque el reemplazo de literales lo hace T-10.

## 3. El reemplazo en la hoja de estilos

- [x] 3.1 T-10 - Reemplazar los 24 literales por sus tokens, sin cambiar ninguna otra declaración. **Verificación:** el diagnóstico de literales da 0 coincidencias fuera de los dos puntos de quiebre —de 26 líneas con literales quedan solo 2, las de los breakpoints—; y el diff del archivo muestra **solo** sustituciones de valor por `var(...)`, sin declaraciones nuevas ni quitadas.
- [x] 3.2 T-11 - Comprobar que el render no cambió: capturar las cinco vistas a 320 px y a 1280 px y compararlas con las de la línea de base. **Verificación:** las diez capturas son idénticas a las de T-02.
- [x] 3.3 T-12 - Comprobar que el `file://` sigue funcionando y que la aplicación no cambió de comportamiento. **Verificación:** la auditoría de persistencia y los ocho casos manuales de la consigna pasan igual que antes del change.

## 4. Documentación

- [x] 4.1 T-13 - Agregar al README la lista de tokens de diseño, con su valor y su significado, y la nota de que los puntos de quiebre de las media queries quedan literales porque CSS no admite `var()` en su condición. **Verificación:** la sección de tecnologías del README enumera los tokens y la excepción queda explicada.
- [x] 4.2 T-14 - Anotar en el informe de comprobaciones que el requirement «Paleta y tokens de la identidad visual» de la spec `presentacion-css` queda cumplido, y que la spec no cambia. **Verificación:** el informe dice qué requirement se cierra y por qué la spec no se modifica.

## 5. Cierre

- [x] 5.1 T-15 - Revisar que el change no introduce trabajo fuera de su alcance: el HTML, el JavaScript, el modelo de datos y el comportamiento quedan intactos. **Verificación:** `git diff --stat` muestra un solo archivo de la entrega modificado —`css/estilos.css`— más el README; los hashes del HTML y del JavaScript no cambian.
- [x] 5.2 T-16 - Archivar el change y confirmar que la spec `presentacion-css` sigue sin cambios y validando. **Verificación:** `openspec archive` termina sin observaciones y `openspec validate --specs --strict` sigue pasando con 7 specs y 0 fallos.
