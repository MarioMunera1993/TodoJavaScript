# 🟨 Curso Completo de JavaScript — De Cero Absoluto a Experto

> **Módulo 5 — Asincronía: Event Loop, callbacks, promesas y `async/await`**
>
> Última actualización: 2026-11-13
> Nivel: intermedio-avanzado
> Requisitos: Módulos 1, 2, 3 y 4 completados

---

## 📋 Índice del módulo

1. [Por qué existe la asincronía](#51--por-qué-existe-la-asincronía)
2. [Call Stack, colas y Event Loop](#52--call-stack-colas-y-event-loop)
3. [Temporizadores](#53--temporizadores)
4. [Callbacks](#54--callbacks)
5. [Promesas: fundamentos](#55--promesas-fundamentos)
6. [Encadenamiento y propagación de errores](#56--encadenamiento-y-propagación-de-errores)
7. [Utilidades estáticas de `Promise`](#57--utilidades-estáticas-de-promise)
8. [`async/await`](#58--asyncawait)
9. [Errores: `throw`, `try/catch` y errores personalizados](#59--errores-throw-trycatch-y-errores-personalizados)
10. [Microtareas vs macrotareas](#510--microtareas-vs-macrotareas)
11. [Patrones de concurrencia](#511--patrones-de-concurrencia)
12. [Retos con solución explicada](#512--retos-con-solución-explicada)
13. [Errores, glosario y autoevaluación](#513--errores-glosario-y-autoevaluación)

---

## Convención pedagógica

Este módulo solo usa conceptos **ya explicados**. Este es el inventario exacto antes de empezar.

**Ya sabes (Módulos 1 a 4):**

- Variables, tipos, operadores, `typeof`, `in`, ternario, `===`.
- `if/else`, `switch`, `for`, `while`, `for...of`, `for...in`.
- Funciones: declaración, expresión, arrow, defaults, rest, scope, closures, recursión, HOF y callbacks **sincrónicos**.
- Arrays y objetos: literales, índices, propiedades, `length`.
- Métodos de array: `map`, `filter`, `reduce`, `find`, `some`, `every`, `sort`, `slice`, `splice`, etc.
- `Object.keys/values/entries/fromEntries/assign/hasOwn/freeze/seal`, `structuredClone`.
- Destructuring, spread/rest, `?.`, `??`.
- `Map`, `Set`, `WeakMap`, `WeakSet`.
- `this`, `call`, `apply`, `bind`, prototipos, constructores, `new`, clases, `extends`, `super`, `static`, campos privados `#`.
- Getters, setters, descriptores, `Object.create`, `Object.defineProperty`.
- `instanceof`, duck typing, mixins y composición.

**Nuevo en este módulo (se explica antes de usarse):**

| Concepto | Sección |
|---|---|
| `Date.now()` para medir intervalos | 5.1.1 |
| `throw`, `try/catch/finally` (bases) | 5.1.7 |
| Call Stack, Task Queue, Microtask Queue, Event Loop | 5.2 |
| `setTimeout`, `clearTimeout`, `setInterval`, `clearInterval` | 5.3 |
| `console.error` y `console.warn` | 5.4.3 |
| Callbacks asíncronos y error-first callbacks | 5.4 |
| `Promise`, `new Promise`, `resolve`, `reject` | 5.5 |
| `then`, `catch`, `finally`, encadenamiento | 5.5 y 5.6 |
| `Promise.resolve/reject/all/allSettled/race/any/withResolvers` | 5.7 |
| `async` y `await` | 5.8 |
| Errores personalizados, `cause`, `AggregateError` | 5.9 |
| `process.nextTick`, `setImmediate`, `Error.captureStackTrace` (solo Node, opcionales) | 5.2.10 y 5.9.4 |
| `queueMicrotask` y microtareas | 5.10 |
| Patrones de concurrencia, reintentos, timeout, límite | 5.11 |

**Lo que NO usaremos todavía:**

| Concepto | Módulo |
|---|---|
| DOM, eventos del navegador, `localStorage`, `requestAnimationFrame` | Módulo 6 |
| `import`/`export`, `fetch`, Axios, JSON, regex | Módulo 7 |
| `async` iterators, generadores, `for await...of` | Más adelante |
| Web Workers, `SharedArrayBuffer`, hilos | Más adelante |
| `AbortController` en peticiones reales | Módulo 7 (aquí solo se menciona) |

> 📌 Si ves algo que no está en la lista de “ya sabes” ni en la de “nuevo”, es un error del material. Avísame y lo corrijo.

**Al terminar este módulo podrás:**

- Explicar con un dibujo qué pasa cuando llamas a `setTimeout`, a una promesa y a `await`.
- Predecir el orden de ejecución de código síncrono, microtareas y macrotareas.
- Convertir callbacks en promesas y promesas en `async/await`.
- Manejar errores asíncronos sin perder información ni dejar rechazos sin capturar.
- Elegir entre `Promise.all`, `allSettled`, `race` y `any` con criterio.
- Escribir reintentos, timeouts, límites de concurrencia y deduplicación de peticiones.
- Detectar los errores clásicos: `forEach` con `async`, `return` olvidado, `await` secuencial innecesario, rechazos sin manejar.

---

## 5.1 — Por qué existe la asincronía

### 5.1.1 El problema: una sola tarea a la vez

JavaScript se ejecuta, por diseño, en **un solo hilo** por contexto. Eso significa que, en un momento dado, solo se está ejecutando **una** instrucción de tu código.

```js
function tareaA() {
  console.log("A: empieza");
  console.log("A: termina");
}

function tareaB() {
  console.log("B: empieza");
  console.log("B: termina");
}

tareaA();
tareaB();

// A: empieza
// A: termina
// B: empieza
// B: termina
```

Esto es **síncrono**: cada función termina antes de que empiece la siguiente. El hilo avanza en línea recta.

El problema aparece cuando una tarea **tarda**. Si una operación síncrona tarda dos segundos, durante esos dos segundos el hilo está ocupado y **nada más puede ejecutarse**. Ni clics, ni teclas, ni animaciones, ni otras funciones.

```js
function bloquear(ms) {
  const inicio = Date.now();
  while (Date.now() - inicio < ms) {
    // espera activa: consume el hilo sin hacer nada útil
  }
}

console.log("antes");
bloquear(2000); // el hilo queda atrapado 2 segundos
console.log("después");
```

> 📌 `Date.now()` devuelve los milisegundos transcurridos desde el 1 de enero de 1970. Lo usamos solo para medir intervalos de tiempo; no necesitas conocer `Date` a fondo para los ejercicios (se profundiza más adelante).

En un navegador, ese `while` congela la pestaña: no se puede hacer clic, no se desplaza, no se repinta. En Node, bloquea el proceso entero: no atiende conexiones ni temporizadores.

**La asincronía existe para resolver exactamente eso:** permitir que el hilo haga otras cosas mientras una operación lenta está en curso.

### 5.1.2 Qué operaciones son lentas

No todas las operaciones tardan lo mismo. Podemos clasificarlas en dos grupos.

**Rápidas (microsegundos o menos):**

- Sumar dos números.
- Recorrer un array de mil elementos.
- Leer una propiedad de un objeto.
- Llamar a una función.

**Lentas (milisegundos, segundos o más):**

- Leer un archivo del disco.
- Hacer una petición HTTP.
- Consultar una base de datos.
- Esperar la respuesta de una API.
- Esperar a que el usuario haga clic.
- Esperar a que pase el tiempo.

Las operaciones lentas tienen algo en común: **dependen de algo externo al procesador**. El disco, la red, el usuario o el reloj no responden a la velocidad de una instrucción de CPU.

```js
// Operación rápida: no necesita asincronía
const suma = 2 + 3;
console.log(suma); // 5

// Operación lenta simulada: necesita asincronía
// (setTimeout se explica en 5.3; aquí solo lo nombramos)
setTimeout(() => {
  console.log("respuesta que llegó después");
}, 1000);

console.log("el hilo sigue libre");
```

Salida:

```text
el hilo sigue libre
respuesta que llegó después
```

La clave es que `setTimeout` **no espera**. Registra la tarea y devuelve el control inmediatamente. El `console.log("el hilo sigue libre")` se ejecuta mucho antes de que pase el segundo.

### 5.1.3 Bloqueante vs no bloqueante

**Bloqueante:** el hilo se queda esperando hasta que la operación termina. Nada más ocurre mientras tanto.

**No bloqueante:** la operación se registra, el hilo sigue trabajando y, cuando la operación termina, se avisa para continuar.

Una analogía habitual es la cafetería:

- **Bloqueante:** pides un café, te quedas plantado en la barra mirando al barista y no dejas que nadie más pida hasta que te lo entregue.
- **No bloqueante:** pides un café, te dan un número, te sientas, y el barista te llama cuando está listo. Mientras tanto, otras personas piden y el barista trabaja.

```js
// Bloqueante (mal): espera activa
function esperarBloqueante(ms) {
  const fin = Date.now() + ms;
  while (Date.now() < fin) {}
}

// No bloqueante (bien): registra y sigue
function esperarNoBloqueante(ms, callback) {
  setTimeout(callback, ms);
}

console.log("1");
esperarNoBloqueante(50, () => console.log("3"));
console.log("2");

// 1
// 2
// 3
```

La versión no bloqueante no es “más rápida”: el callback sigue ocurriendo a los 50 ms. Lo que cambia es que **el hilo queda libre** para hacer otras cosas durante esos 50 ms.

### 5.1.4 Concurrencia no es paralelismo

Estos dos términos se confunden constantemente. No son lo mismo.

| Término | Significado | Ejemplo |
|---|---|---|
| **Concurrente** | Varias tareas progresan en el mismo periodo, turnándose | Un camarero atiende varias mesas |
| **Paralelo** | Varias tareas se ejecutan exactamente a la vez, en núcleos distintos | Dos camareros, dos mesas |

JavaScript en el navegador es **concurrente, no paralelo** en tu código: hay un solo hilo, pero las tareas se turnan. Las operaciones lentas (red, disco) sí pueden ocurrir en paralelo **fuera** del hilo de JavaScript, en el sistema operativo o en el host.

```text
Tu código JS:      [tarea A] [tarea B] [tarea A] [tarea C]
                        ^         ^         ^
                        |         |         |
                    turnos del Event Loop (un solo hilo)

Fuera del hilo:    [red] [disco] [red]   <- pueden solaparse
```

Cuando decimos “JavaScript es single-threaded”, nos referimos al **hilo de ejecución de tu código**, no a todo el proceso. El navegador y Node tienen otros hilos para red, disco, timers y demás. Tu código solo ve los resultados cuando el Event Loop le devuelve el control.

### 5.1.5 La historia: callbacks, promesas, `async/await`

La asincronía en JavaScript ha pasado por tres grandes etapas.

**Etapa 1 — Callbacks (años 90 y 2000).**

Una función recibe otra función y la llama cuando termina.

```js
function obtenerDatos(callback) {
  setTimeout(() => {
    callback("datos");
  }, 100);
}

obtenerDatos((datos) => {
  console.log(datos); // "datos"
});
```

Funciona, pero cuando encadenas varias operaciones el código se anida y se vuelve difícil de leer. Es el famoso **callback hell** (5.4.3).

**Etapa 2 — Promesas (ES2015, estandarizadas en ES6).**

Una promesa es un objeto que representa un valor que **estará disponible ahora o en el futuro**. Tiene métodos para encadenar operaciones sin anidar.

```js
// Vista previa: las promesas se explican en 5.5; console.error, en 5.4.3
obtenerDatosPromesa()
  .then((datos) => console.log(datos))
  .catch((error) => console.error(error));
```

**Etapa 3 — `async/await` (ES2017).**

Permite escribir código asíncrono con la forma visual del código síncrono.

```js
// Vista previa: async/await se explica en 5.8
async function main() {
  const datos = await obtenerDatosPromesa();
  console.log(datos);
}
```

Las tres etapas no se sustituyen por completo: los callbacks siguen existiendo debajo de las promesas, y las promesas siguen existiendo debajo de `async/await`. Entender las tres es lo que te permite depurar de verdad.

### 5.1.6 El modelo mental correcto

Guarda esta idea:

> **JavaScript ejecuta tu código en un solo hilo, pero puede delegar operaciones lentas al host y recuperar el control cuando terminan.**

El host es el entorno que rodea al motor: el navegador o Node. El motor (V8, SpiderMonkey, JavaScriptCore) solo entiende JavaScript; no sabe leer archivos ni abrir conexiones. Es el host quien ofrece esas capacidades.

```text
+---------------------------------------------------+
|  Tu código JavaScript                             |
|  (un solo hilo, run-to-completion)                |
+------------------------+--------------------------+
                         |
                         | pide operación lenta
                         v
+---------------------------------------------------+
|  Host: navegador o Node                           |
|  - timers                                         |
|  - red                                            |
|  - disco                                          |
|  - eventos del usuario                            |
|  (puede usar varios hilos internamente)           |
+------------------------+--------------------------+
                         |
                         | avisa cuando termina
                         v
+---------------------------------------------------+
|  Colas + Event Loop                               |
|  devuelve el control a tu código                  |
+---------------------------------------------------+
```

Este dibujo es la base de todo el módulo. En 5.2 lo desarrollamos pieza por pieza.

### 5.1.7 Cómo falla el código: `throw` y `try/catch` (bases)

Antes de seguir necesitamos una herramienta para hablar de errores. Hasta ahora has visto errores que lanza JavaScript automáticamente (`TypeError`, `ReferenceError`). También puedes lanzarlos tú con `throw`.

```js
function dividir(a, b) {
  if (b === 0) {
    throw new Error("No se puede dividir entre cero");
  }
  return a / b;
}

console.log(dividir(10, 2)); // 5
```

Si llamas a `dividir(10, 0)` sin capturar el error, el programa se detiene y muestra el error:

```js
function dividir(a, b) {
  if (b === 0) {
    throw new Error("No se puede dividir entre cero");
  }
  return a / b;
}

dividir(10, 0);

// Error: No se puede dividir entre cero
//     at dividir (...)
```

Para capturarlo y decidir qué hacer, usas `try/catch`:

```js
function dividir(a, b) {
  if (b === 0) {
    throw new Error("No se puede dividir entre cero");
  }
  return a / b;
}

try {
  const resultado = dividir(10, 0);
  console.log(resultado); // no se ejecuta
} catch (error) {
  console.log("Capturado:", error.message);
}

// Capturado: No se puede dividir entre cero
```

Anatomía:

| Parte | Qué hace |
|---|---|
| `throw valor` | Interrumpe la ejecución y lanza un valor como error |
| `try { ... }` | Bloque que puede lanzar |
| `catch (error) { ... }` | Se ejecuta solo si algo del `try` lanzó |
| `finally { ... }` | Se ejecuta **siempre**, haya error o no |

```js
function dividir(a, b) {
  if (b === 0) throw new Error("división por cero");
  return a / b;
}

try {
  console.log("resultado:", dividir(8, 2));
} catch (error) {
  console.log("error:", error.message);
} finally {
  console.log("finally: siempre se ejecuta");
}

// resultado: 4
// finally: siempre se ejecuta
```

**Importante:** `throw` no es lo mismo que `return`. `return` devuelve un valor normal; `throw` señala que algo salió mal y salta directamente al `catch` más cercano. Si no hay `catch`, el error sube hasta el nivel superior y el programa termina.

```js
function a() {
  throw new Error("fallo en a");
}

function b() {
  a(); // el error sube
}

function c() {
  b(); // el error sube
}

try {
  c();
} catch (error) {
  console.log("capturado en c:", error.message);
}

// capturado en c: fallo en a
```

En 5.9 profundizamos: errores personalizados, `cause`, `finally` con `return`, errores asíncronos y patrones de recuperación. Por ahora basta con que sepas lanzar y capturar.

> 📌 `Error` es el tipo estándar de error. Tiene al menos `message` y `stack`. En 5.9 verás `name`, `cause` y cómo crear tus propias clases de error.

### ✅ Haz esto / ❌ Evita esto (5.1)

**✅ Haz esto: delega lo lento.**

```js
// ✅ La operación lenta se delega; el hilo sigue libre
setTimeout(() => {
  console.log("datos listos");
}, 100);

console.log("mientras tanto, hago otras cosas");
```

**❌ Evita esto: bloquear el hilo con esperas activas.**

```js
// ❌ El hilo queda atrapado; nada más puede ejecutarse
const fin = Date.now() + 100;
while (Date.now() < fin) {}
console.log("datos listos");
```

**✅ Haz esto: lanza errores con información útil.**

```js
function validarEdad(edad) {
  if (typeof edad !== "number" || Number.isNaN(edad)) {
    throw new TypeError("La edad debe ser un número");
  }
  if (edad < 0) {
    throw new RangeError("La edad no puede ser negativa");
  }
  return true;
}
```

**❌ Evita esto: lanzar strings o valores sin contexto.**

```js
// ❌ Difícil de identificar y de depurar
throw "algo salió mal";
```

**✅ Haz esto: captura solo lo que sabes manejar.**

```js
try {
  const edad = Number(texto);
  if (Number.isNaN(edad)) {
    throw new TypeError("El texto no contenía un número");
  }
  console.log("Edad:", edad);
} catch (error) {
  console.log("No se pudo interpretar la edad:", error.message);
}
```

**❌ Evita esto: un `catch` vacío que oculta el problema.**

```js
// ❌ El error desaparece sin dejar rastro
try {
  operacionRiesgosa();
} catch (error) {}
```

---

## 5.2 — Call Stack, colas y Event Loop

> 📌 En esta sección usaremos `setTimeout` como ejemplo de API del host. Su API completa se explica en 5.3; aquí solo necesitas saber que registra una función para ejecutarse más tarde.

### 5.2.1 El Call Stack

El **Call Stack** (pila de llamadas) es la estructura donde JavaScript apunta qué función se está ejecutando y desde dónde fue llamada.

Funciona como una pila de platos:

- Cuando llamas a una función, se **apila** un frame.
- Cuando la función termina, se **desapila**.
- Solo se ejecuta la función que está arriba.

```js
function primera() {
  console.log("primera: empieza");
  segunda();
  console.log("primera: termina");
}

function segunda() {
  console.log("segunda: empieza");
  tercera();
  console.log("segunda: termina");
}

function tercera() {
  console.log("tercera");
}

primera();

// primera: empieza
// segunda: empieza
// tercera
// segunda: termina
// primera: termina
```

Traza de la pila:

```text
1. llamada a primera()        -> [primera]
2. primera llama a segunda()  -> [primera, segunda]
3. segunda llama a tercera()  -> [primera, segunda, tercera]
4. tercera termina            -> [primera, segunda]
5. segunda termina            -> [primera]
6. primera termina            -> []
```

El Call Stack es **LIFO** (last in, first out): el último en entrar es el primero en salir.

### 5.2.2 Stack overflow

La pila tiene un tamaño limitado. Si acumulas demasiadas llamadas sin desapilar, se desborda y obtienes un `RangeError`.

```js
function contar(n) {
  return contar(n + 1); // nunca hay caso base
}

contar(1);

// RangeError: Maximum call stack size exceeded
```

Esto también puede pasar con recursión mal escrita:

```js
function factorial(n) {
  return n * factorial(n - 1); // falta el caso base
}
```

La versión correcta incluye una condición de parada:

```js
function factorial(n) {
  if (n <= 1) return 1; // caso base
  return n * factorial(n - 1);
}

console.log(factorial(5)); // 120
```

> 📌 El tamaño exacto de la pila depende del motor y del entorno. No escribas código que dependa de un número concreto de llamadas.

### 5.2.3 Motor vs host

Es fundamental separar dos capas:

| Capa | Qué es | Ejemplos |
|---|---|---|
| **Motor** | Interpreta y ejecuta JavaScript | V8 (Chrome, Node), SpiderMonkey (Firefox), JavaScriptCore (Safari) |
| **Host** | Entorno que ofrece APIs externas | Navegador, Node.js, Deno, Bun |

El motor entiende `function`, `const`, `if`, objetos, arrays. **No** entiende `setTimeout`, `fetch`, `document` ni `localStorage`. Esas son APIs del host, escritas en C++ u otro lenguaje, que el motor expone a tu código.

```js
// Lenguaje puro: lo entiende cualquier motor
const numeros = [1, 2, 3];
const dobles = numeros.map((n) => n * 2);
console.log(dobles); // [2, 4, 6]

// API del host: depende del entorno
setTimeout(() => console.log("timer"), 100); // navegador y Node
```

`setTimeout` no forma parte del lenguaje JavaScript. Está definido por el host. Por eso puede comportarse distinto en el navegador y en Node (5.3.9).

### 5.2.4 Las APIs del host

Cuando llamas a una API asíncrona, el motor hace tres cosas:

1. Ejecuta la llamada y le pasa la operación al host.
2. El host realiza la operación (o espera el tiempo).
3. Cuando termina, el host coloca el callback en una cola.

```js
console.log("1: antes");

setTimeout(() => {
  console.log("3: callback del timer");
}, 0);

console.log("2: después");

// 1: antes
// 2: después
// 3: callback del timer
```

Aunque el tiempo sea `0`, el callback **no** se ejecuta inmediatamente. `setTimeout` lo entrega al host, y el host lo pondrá en la cola cuando corresponda. El código síncrono que queda (`console.log("2")`) se ejecuta primero.

Este es el primer concepto que sorprende a todo el mundo:

> **`setTimeout(fn, 0)` no significa “ejecuta `fn` ahora”. Significa “ejecuta `fn` en el próximo turno del Event Loop, después de que el código síncrono actual termine”.**

### 5.2.5 La Task Queue (cola de macrotareas)

La **Task Queue** (también llamada macrotask queue o simplemente task queue) guarda las tareas que están listas para ejecutarse: callbacks de timers, eventos, mensajes, etc.

```text
Task Queue:  [ callback A ][ callback B ][ callback C ]
```

Cada vuelta del Event Loop toma **una** tarea de esta cola y la ejecuta completa.

```js
setTimeout(() => console.log("tarea A"), 0);
setTimeout(() => console.log("tarea B"), 0);
setTimeout(() => console.log("tarea C"), 0);

// tarea A
// tarea B
// tarea C
```

Se ejecutan en el orden en que fueron encoladas (FIFO: first in, first out), aunque el tiempo sea el mismo.

> 📌 En el navegador, la Task Queue no es una sola cola global para todo; el estándar habla de **task sources** (timers, eventos, red, etc.) y el host elige de cuál tomar. Para el 99 % de tu código, el modelo mental de “una cola FIFO de macrotareas” es suficiente.

### 5.2.6 La Microtask Queue

La **Microtask Queue** es una cola aparte, con **prioridad sobre la Task Queue**. Guarda tareas que deben ejecutarse “justo después del código actual, antes de cualquier otra macrotarea”.

¿Qué genera microtareas?

- Los callbacks de promesas (`.then`, `.catch`, `.finally`).
- `queueMicrotask`.
- `await` (cuando la promesa se resuelve).
- `MutationObserver` en el navegador (lo verás en el Módulo 6).

> 📌 **Vista previa:** las promesas (`.then`), `queueMicrotask` y `await` se explican a fondo en 5.5, 5.10 y 5.8. Aquí los usamos solo para mostrar el orden de las colas; no necesitas dominarlos todavía.

```js
console.log("1: síncrono");

Promise.resolve().then(() => {
  console.log("3: microtarea");
});

setTimeout(() => {
  console.log("4: macrotarea");
}, 0);

console.log("2: síncrono");

// 1: síncrono
// 2: síncrono
// 3: microtarea
// 4: macrotarea
```

La microtarea se ejecuta **antes** que el timer, aunque el timer se haya registrado primero.

**Regla de oro:**

> Después de cada macrotarea, el Event Loop **vacía por completo** la Microtask Queue antes de pasar a la siguiente macrotarea.

Y si una microtarea crea otra microtarea, la nueva también se ejecuta en la misma tanda. Esto puede causar inanición (5.2.11).

```js
console.log("inicio");

Promise.resolve().then(() => {
  console.log("micro 1");
  Promise.resolve().then(() => {
    console.log("micro 2");
    Promise.resolve().then(() => {
      console.log("micro 3");
    });
  });
});

setTimeout(() => console.log("timer"), 0);

console.log("fin");

// inicio
// fin
// micro 1
// micro 2
// micro 3
// timer
```

Aunque el timer se registró antes que las microtas internas, todas las microtas se vacían primero.

### 5.2.7 El Event Loop paso a paso

El **Event Loop** es el bucle que coordina todo. Una versión simplificada:

```text
mientras (haya trabajo) {
  1. Toma UNA tarea de la Task Queue (si hay).
  2. Ejecútala hasta el final (run-to-completion).
  3. Vacía COMPLETAMENTE la Microtask Queue.
  4. Si toca renderizar, renderiza.
  5. Vuelve al paso 1.
}
```

En pseudocódigo:

```text
while (true) {
  const tarea = taskQueue.tomarUna();
  if (tarea) ejecutar(tarea);
  while (microtaskQueue.noEsteVacia()) {
    ejecutar(microtaskQueue.tomarUna());
  }
  if (esMomentoDeRenderizar()) renderizar();
}
```

**Run-to-completion** significa que una tarea no se interrumpe a la mitad. Si una macrotarea tarda 500 ms, el render y las demás tareas esperan 500 ms. Por eso bloquear el hilo es tan grave.

### 5.2.8 Ejemplo completo, paso a paso

Veamos un ejemplo con todos los elementos. Intenta predecir el orden antes de leer la explicación.

```js
console.log("A: síncrono 1");

setTimeout(() => {
  console.log("F: timeout");
}, 0);

Promise.resolve().then(() => {
  console.log("D: promesa 1");
});

queueMicrotask(() => {
  console.log("E: queueMicrotask");
});

console.log("B: síncrono 2");

Promise.resolve().then(() => {
  console.log("C: promesa 2");
});
```

Salida real en Node:

```text
A: síncrono 1
B: síncrono 2
D: promesa 1
E: queueMicrotask
C: promesa 2
F: timeout
```

Paso a paso:

| Paso | Qué pasa | Cola resultante |
|---|---|---|
| 1 | Se ejecuta `A` | — |
| 2 | `setTimeout` encola `F` en la Task Queue | Task: `[F]` |
| 3 | `.then` encola `D` en la Microtask Queue | Micro: `[D]` |
| 4 | `queueMicrotask` encola `E` | Micro: `[D, E]` |
| 5 | Se ejecuta `B` | — |
| 6 | `.then` encola `C` | Micro: `[D, E, C]` |
| 7 | Termina el código síncrono; el Event Loop vacía microtas | Se ejecutan `D`, `E`, `C` |
| 8 | No hay más microtas; toma la siguiente macrotarea | Se ejecuta `F` |

**Orden:** síncrono → microtareas (en orden de registro) → macrotareas.

### 5.2.9 Renderizado y `requestAnimationFrame` (vista previa)

En el navegador, el Event Loop también se ocupa de **renderizar**: recalcular estilos, layout y pintar. El render ocurre entre macrotareas, después de vaciar las microtareas, y solo si el navegador decide que toca (normalmente unas 60 veces por segundo).

`requestAnimationFrame` (rAF) permite ejecutar código **antes** del siguiente repintado. Es la herramienta correcta para animaciones.

```js
// Vista previa de Módulo 6: no lo necesitas para los ejercicios
function animar() {
  console.log("antes del siguiente repintado");
  requestAnimationFrame(animar);
}

// requestAnimationFrame(animar);
```

> ⚠️ `requestAnimationFrame` no existe en Node. Es una API exclusiva del navegador. No lo uses en los ejercicios de este módulo.

La regla práctica: si actualizas el DOM muchas veces en un bucle, el navegador no repinta en cada cambio; agrupa y repinta una vez al final. Esto se relaciona con el concepto de **batching** que verás en el Módulo 6.

### 5.2.10 El Event Loop en Node (nota avanzada)

Node usa el mismo concepto, pero con fases internas. Una versión simplificada:

```text
   ┌───────────────────────────┐
┌─>│           timers          │  setTimeout / setInterval
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │     pending callbacks     │  callbacks de I/O diferidos
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │       idle, prepare       │  uso interno
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           poll            │  espera y procesa I/O
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │           check           │  setImmediate
│  └─────────────┬─────────────┘
│  ┌─────────────┴─────────────┐
│  │      close callbacks      │  cierre de sockets, etc.
│  └─────────────┬─────────────┘
└────────────────┘
```

Además, Node tiene `process.nextTick`, que se ejecuta **antes** que las promesas en cada vuelta. Es una cola aparte, más prioritaria que la Microtask Queue.

```js
// Solo Node
console.log("inicio");

process.nextTick(() => console.log("nextTick"));
Promise.resolve().then(() => console.log("promesa"));
queueMicrotask(() => console.log("queueMicrotask"));

console.log("fin");

// inicio
// fin
// nextTick
// promesa
// queueMicrotask
```

> 📌 `process.nextTick` y `setImmediate` son específicos de Node. No los uses en código que deba correr en el navegador. En este curso no son obligatorios.

Para el resto del módulo usaremos el modelo simplificado: **síncrono → microtareas → macrotareas**. Es suficiente para el 99 % de los bugs reales.

### 5.2.11 Inanición (starvation)

Si las microtareas no dejan de crear nuevas microtareas, la Microtask Queue nunca se vacía y el Event Loop no puede pasar a la siguiente macrotarea. El navegador no renderiza; Node no atiende temporizadores ni I/O.

```js
function bucleInfinitoDeMicrotareas() {
  Promise.resolve().then(bucleInfinitoDeMicrotareas);
}

// ⚠️ NO ejecutes esto: congela el proceso
// bucleInfinitoDeMicrotareas();
```

Lo mismo con `queueMicrotask`:

```js
// ⚠️ NO ejecutes esto
function repetir() {
  queueMicrotask(repetir);
}
// repetir();
```

Un bucle `while` infinito bloquea el hilo de forma evidente. Un bucle de microtareas también lo bloquea, pero es más difícil de detectar porque el código “parece” asíncrono.

**Regla práctica:** una microtarea debe ser corta y no debe reprogramarse indefinidamente. Para trabajo repetido en el tiempo, usa timers o `requestAnimationFrame`, no microtareas.

### ✅ Haz esto / ❌ Evita esto (5.2)

**✅ Haz esto: recuerda que el código síncrono va primero.**

```js
// ✅ Predecible: primero lo síncrono, luego las microtareas
console.log("A");
Promise.resolve().then(() => console.log("C"));
console.log("B");

// A
// B
// C
```

**❌ Evita esto: asumir que una promesa se ejecuta “ya”.**

```js
// ❌ El orden no es el que parece
let valor = "inicial";

Promise.resolve().then(() => {
  valor = "cambió";
});

console.log(valor); // "inicial", no "cambió"
```

**✅ Haz esto: usa `queueMicrotask` para diferir sin timer.**

```js
// ✅ Se ejecuta antes que cualquier setTimeout
queueMicrotask(() => console.log("micro"));
setTimeout(() => console.log("timer"), 0);
```

**❌ Evita esto: bloquear el hilo con bucles largos.**

```js
// ❌ Congela la interfaz y retrasa todos los timers
for (let i = 0; i < 1_000_000_000; i++) {
  // trabajo pesado
}
```

**✅ Haz esto: divide el trabajo pesado en trozos.**

```js
// ✅ Cede el control entre trozos
function procesarPorTrozos(items, tamano, callback) {
  let indice = 0;

  function siguiente() {
    const fin = Math.min(indice + tamano, items.length);
    for (; indice < fin; indice++) {
      // procesar items[indice]
    }
    if (indice < items.length) {
      setTimeout(siguiente, 0);
    } else {
      callback();
    }
  }

  siguiente();
}
```

**❌ Evita esto: crear microtareas recursivas sin fin.**

```js
// ❌ Nunca deja pasar a las macrotareas
function repetir() {
  Promise.resolve().then(repetir);
}
```

---

## 5.3 — Temporizadores

### 5.3.1 `setTimeout`

`setTimeout` programa una función para que se ejecute **una vez**, después de un tiempo mínimo.

```js
setTimeout(() => {
  console.log("pasaron 100 ms (como mínimo)");
}, 100);
```

Firma:

```text
setTimeout(callback, milisegundos, ...argumentos)
```

| Parámetro | Qué es |
|---|---|
| `callback` | Función que se ejecutará |
| `milisegundos` | Tiempo mínimo de espera (0 si se omite) |
| `...argumentos` | Valores que se pasarán al callback |

```js
setTimeout(
  (nombre, edad) => {
    console.log(`Hola, ${nombre} (${edad})`);
  },
  100,
  "Ana",
  30
);

// Hola, Ana (30)
```

`setTimeout` devuelve un identificador que puedes usar para cancelar el timer.

```js
const id = setTimeout(() => {
  console.log("esto se ejecutará");
}, 100);

console.log(typeof id); // "object" en Node, "number" en el navegador
```

> 📌 El tipo del identificador **no** es portable. En el navegador es un número; en Node es un objeto `Timeout`. No escribas código que dependa de su tipo. Solo guárdalo y pásalo a `clearTimeout`.

### 5.3.2 `clearTimeout`

`clearTimeout(id)` cancela un timer que todavía no se ha ejecutado.

```js
const id = setTimeout(() => {
  console.log("nunca se ejecuta");
}, 1000);

clearTimeout(id);
console.log("timer cancelado");
```

Si el timer ya se ejecutó, `clearTimeout` no hace nada y no lanza error.

```js
const id = setTimeout(() => {
  console.log("se ejecutó");
}, 10);

setTimeout(() => {
  clearTimeout(id); // demasiado tarde: no tiene efecto
  console.log("intento de cancelar tarde");
}, 50);
```

**Patrón típico: cancelar al desmontar.** En el navegador, cuando un componente desaparece, debes cancelar sus timers para que no sigan ejecutándose sobre elementos que ya no existen. Lo verás en el Módulo 6.

```js
// Patrón conceptual (sin DOM)
function crearContador() {
  let id = null;
  let n = 0;

  return {
    iniciar() {
      if (id !== null) return;
      id = setInterval(() => {
        n++;
        console.log("n:", n);
      }, 1000);
    },
    detener() {
      if (id !== null) {
        clearInterval(id);
        id = null;
      }
    },
  };
}
```

### 5.3.3 `setTimeout` no garantiza el tiempo exacto

El tiempo que pasas es un **mínimo**, no una promesa. El callback se ejecutará cuando:

1. Haya pasado al menos ese tiempo.
2. El hilo esté libre.
3. El Event Loop llegue a la Task Queue.

Si el hilo está ocupado, el timer se retrasa.

```js
const inicio = Date.now();

setTimeout(() => {
  console.log("retraso real:", Date.now() - inicio, "ms");
}, 100);

// Bloqueamos el hilo 300 ms
const fin = Date.now() + 300;
while (Date.now() < fin) {}

// retraso real: ~300 ms (no 100)
```

Esto no es un bug: es el modelo de ejecución. `setTimeout` no puede interrumpir código en ejecución.

**Consecuencias prácticas:**

- No uses timers para medir tiempo con precisión.
- No uses timers para sincronizar animaciones (usa `requestAnimationFrame`).
- No asumas que dos timers de 100 ms se ejecutan en el mismo instante.
- Los navegadores aplican *clamping*: en pestañas inactivas, los timers pueden limitarse a 1 segundo o más.

### 5.3.4 `setInterval`

`setInterval` programa una función para que se ejecute **repetidamente**, cada cierto tiempo mínimo.

```js
let n = 0;

const id = setInterval(() => {
  n++;
  console.log("tick", n);

  if (n === 3) {
    clearInterval(id);
  }
}, 100);

// tick 1
// tick 2
// tick 3
```

Firma:

```text
setInterval(callback, milisegundos, ...argumentos)
```

Igual que `setTimeout`, el tiempo es un mínimo y el callback recibe los argumentos extra.

```js
const id = setInterval(
  (etiqueta) => {
    console.log(etiqueta);
    clearInterval(id);
  },
  50,
  "una sola vez"
);
```

### 5.3.5 `clearInterval`

`clearInterval(id)` detiene un intervalo.

```js
let n = 0;

const id = setInterval(() => {
  n++;
  console.log(n);

  if (n >= 5) {
    clearInterval(id);
    console.log("detenido");
  }
}, 10);
```

**Error clásico:** olvidar `clearInterval` y dejar un intervalo corriendo para siempre. En Node, eso mantiene el proceso vivo aunque no haya nada más que hacer. En el navegador, consume CPU y batería.

```js
// ❌ Esto nunca termina por sí solo
setInterval(() => {
  console.log("sigo vivo");
}, 1000);
```

### 5.3.6 Deriva (drift) y el patrón recursivo

`setInterval` no garantiza que el intervalo se mantenga exacto. Si el callback tarda más que el intervalo, los ticks se acumulan o se saltan.

```js
// El callback tarda 80 ms y el intervalo es de 50 ms
setInterval(() => {
  const inicio = Date.now();
  while (Date.now() - inicio < 80) {}
  console.log("tick");
}, 50);
```

El intervalo no puede ejecutar dos callbacks a la vez. El siguiente tick se retrasa.

Para trabajo que debe esperar **después** de terminar el anterior, usa `setTimeout` recursivo:

```js
let n = 0;

function tick() {
  n++;
  console.log("tick", n);

  if (n < 3) {
    setTimeout(tick, 100); // el siguiente empieza después de este
  }
}

setTimeout(tick, 100);

// tick 1
// tick 2
// tick 3
```

Diferencia clave:

| `setInterval` | `setTimeout` recursivo |
|---|---|
| Programa el siguiente tick sin esperar al anterior | Programa el siguiente cuando termina el anterior |
| Puede solaparse si el callback tarda | Nunca se solapa |
| Deriva acumulativa | Deriva no acumulativa |
| Más simple para tareas cortas | Más seguro para tareas variables |

**Regla práctica:** si el callback hace trabajo de duración impredecible, usa `setTimeout` recursivo.

### 5.3.7 `setTimeout(fn, 0)` no es cero

Ya lo vimos: `setTimeout(fn, 0)` significa “lo antes posible, después del código síncrono actual”. El mínimo real depende del entorno.

```js
console.log("1");

setTimeout(() => console.log("3"), 0);

console.log("2");

// 1
// 2
// 3
```

En navegadores, los timers anidados más de 5 niveles tienen un mínimo de 4 ms. En Node, el mínimo es 1 ms. No son valores en los que debas basar tu lógica.

```js
let nivel = 0;

function repetir() {
  nivel++;
  console.log("nivel", nivel);

  if (nivel < 5) {
    setTimeout(repetir, 0);
  }
}

setTimeout(repetir, 0);
```

**Alternativa moderna:** si solo quieres diferir hasta después del código actual, `queueMicrotask` es más directo y no pasa por la Task Queue (5.10).

```js
console.log("A");

queueMicrotask(() => console.log("C"));

console.log("B");

// A
// B
// C
```

### 5.3.8 Pasar argumentos al callback

Los argumentos extra de `setTimeout` se pasan al callback. Es más limpio que crear un closure cuando los valores ya están disponibles.

```js
function saludar(nombre, saludo) {
  console.log(`${saludo}, ${nombre}`);
}

setTimeout(saludar, 50, "Ana", "Hola");

// Hola, Ana
```

También puedes usar un closure:

```js
const nombre = "Ana";
const saludo = "Hola";

setTimeout(() => {
  saludar(nombre, saludo);
}, 50);
```

**Ventaja de los argumentos extra:** evitas capturar variables que podrían cambiar antes de que se ejecute el callback.

```js
// ⚠️ El closure captura la variable, no el valor
let valor = "primero";

setTimeout(() => {
  console.log(valor); // "segundo"
}, 10);

valor = "segundo";
```

```js
// ✅ El argumento captura el valor en el momento de registrar
let valor = "primero";

setTimeout((v) => {
  console.log(v); // "primero"
}, 10, valor);

valor = "segundo";
```

### 5.3.9 Timers en Node vs navegador

| Aspecto | Navegador | Node |
|---|---|---|
| Valor devuelto | `number` | Objeto `Timeout` |
| `setTimeout` global | `window.setTimeout` | `globalThis.setTimeout` |
| Mínimo para `0` | ~4 ms en timers anidados | ~1 ms |
| Pestañas inactivas | Timers ralentizados | No aplica |
| `setImmediate` | No existe | Sí |
| `process.nextTick` | No existe | Sí |
| `requestAnimationFrame` | Sí | No |

Código portable:

```js
// ✅ Guarda el id sin asumir su tipo
const id = setTimeout(() => {
  console.log("funciona en ambos");
}, 10);

clearTimeout(id);
```

Código **no** portable:

```js
// ❌ En Node, id es un objeto; esto no tiene sentido
const id = setTimeout(() => {}, 10);
if (id > 0) {
  console.log("asume número");
}
```

### 5.3.10 `this` dentro de un timer

Un callback de timer es una llamada normal, no un método. Si usas una función tradicional, `this` **no** es el objeto donde registraste el timer.

```js
const usuario = {
  nombre: "Ana",

  saludarTarde() {
    setTimeout(function () {
      console.log(this.nombre); // undefined
    }, 10);
  },

  saludarBien() {
    setTimeout(() => {
      console.log(this.nombre); // "Ana"
    }, 10);
  },
};

usuario.saludarTarde();
usuario.saludarBien();
```

Esto conecta directamente con el Módulo 4: usa una arrow si quieres conservar el `this` del método, o guarda el valor en una variable.

```js
const usuario = {
  nombre: "Ana",

  saludar() {
    const nombre = this.nombre; // captura el valor
    setTimeout(function () {
      console.log(nombre); // "Ana"
    }, 10);
  },
};
```

### 5.3.11 Debounce y throttle

Dos patrones clásicos con timers, muy usados en eventos del navegador (scroll, input, resize). Aquí los implementamos sin DOM.

**Debounce:** espera a que pase un tiempo **sin** nuevas llamadas. Si llega otra llamada, reinicia el timer.

```js
function debounce(fn, ms) {
  let id = null;

  return function (...args) {
    if (id !== null) {
      clearTimeout(id);
    }

    id = setTimeout(() => {
      id = null;
      fn.apply(this, args);
    }, ms);
  };
}

const guardar = debounce((texto) => {
  console.log("guardando:", texto);
}, 100);

guardar("a");
guardar("ab");
guardar("abc");

// Solo se imprime "guardando: abc" (tras 100 ms sin llamadas)
```

**Throttle:** ejecuta como máximo una vez cada intervalo, aunque lleguen muchas llamadas.

```js
function throttle(fn, ms) {
  let ultima = 0;

  return function (...args) {
    const ahora = Date.now();

    if (ahora - ultima >= ms) {
      ultima = ahora;
      fn.apply(this, args);
    }
  };
}

const registrar = throttle((n) => {
  console.log("registrado:", n);
}, 100);

registrar(1); // se ejecuta
registrar(2); // se ignora
registrar(3); // se ignora
```

> 📌 `fn.apply(this, args)` usa `apply`, que ya conoces del Módulo 4. Aquí conserva el `this` de la llamada original.

**Diferencia:**

| Patrón | Comportamiento | Caso típico |
|---|---|---|
| Debounce | Espera a que pare la ráfaga | Buscar mientras se escribe |
| Throttle | Ejecuta a intervalos regulares | Scroll, resize, mousemove |

### 5.3.12 Limpieza y fugas de memoria

Un timer que sigue vivo mantiene vivas las variables que captura. Si el callback referencia un objeto grande, ese objeto no se libera hasta que el timer se ejecute o se cancele.

```js
function crearProceso() {
  const datosGrandes = new Array(1_000_000).fill("x");

  const id = setInterval(() => {
    console.log(datosGrandes.length); // mantiene vivo el array
  }, 1000);

  return id;
}

const id = crearProceso();
// El array sigue en memoria mientras el intervalo no se cancele
clearInterval(id);
```

**Buenas prácticas:**

- Guarda siempre el id de cada timer.
- Cancela en el momento en que el trabajo ya no sea necesario.
- No dejes intervalos sin condición de salida.
- En el navegador, cancela al desmontar componentes.
- En Node, usa `timer.unref()` si no quieres que el timer mantenga vivo el proceso (avanzado, específico de Node).

### ✅ Haz esto / ❌ Evita esto (5.3)

**✅ Haz esto: guarda el id y cancela.**

```js
const id = setTimeout(() => {
  console.log("tarea");
}, 1000);

clearTimeout(id);
```

**❌ Evita esto: crear timers que nadie puede cancelar.**

```js
// ❌ No hay forma de detenerlo desde fuera
setInterval(() => {
  sincronizar();
}, 5000);
```

**✅ Haz esto: usa `setTimeout` recursivo para trabajo variable.**

```js
function tick() {
  hacerTrabajo();
  setTimeout(tick, 1000);
}
```

**❌ Evita esto: asumir precisión milimétrica.**

```js
// ❌ No garantiza 16 ms exactos
setInterval(pintar, 16);
```

**✅ Haz esto: usa argumentos extra para capturar valores.**

```js
setTimeout((nombre) => console.log(nombre), 100, "Ana");
```

**❌ Evita esto: confiar en `this` dentro de un callback tradicional.**

```js
// ❌ this no es el objeto
objeto.metodo = function () {
  setTimeout(function () {
    console.log(this.nombre);
  }, 100);
};
```

**✅ Haz esto: limpia al terminar.**

```js
function iniciar() {
  const id = setInterval(() => {
    if (terminado()) clearInterval(id);
  }, 100);

  return () => clearInterval(id);
}
```

---

## 5.4 — Callbacks

### 5.4.1 Qué es un callback (repaso)

Un **callback** es una función que se pasa como argumento a otra función para que esta la llame más tarde. Ya los usaste en los Módulos 2 y 3 con métodos de array:

```js
const numeros = [1, 2, 3];

const dobles = numeros.map(function (n) {
  return n * 2;
});

console.log(dobles); // [2, 4, 6]
```

Aquí el callback se ejecuta **de forma síncrona**: `map` lo llama inmediatamente, uno por uno, y no devuelve el control hasta terminar.

```js
console.log("antes");

[1, 2, 3].forEach(function (n) {
  console.log("callback", n);
});

console.log("después");

// antes
// callback 1
// callback 2
// callback 3
// después
```

Ese es un callback **síncrono**. El concepto de callback no es exclusivo de la asincronía. Lo nuevo en este módulo es el callback **asíncrono**: una función que se guarda y se llama más tarde, cuando una operación lenta termina.

```js
console.log("antes");

setTimeout(function () {
  console.log("callback asíncrono");
}, 100);

console.log("después");

// antes
// después
// callback asíncrono
```

La diferencia no está en la sintaxis, sino en **quién llama y cuándo**:

| Callback síncrono | Callback asíncrono |
|---|---|
| Se ejecuta dentro de la misma llamada | Se ejecuta en un turno posterior |
| El llamador espera | El llamador sigue |
| `map`, `filter`, `forEach` | `setTimeout`, eventos, I/O |

### 5.4.2 Callbacks asíncronos

Un callback asíncrono permite que una función inicie una operación y te avise cuando termine.

```js
function obtenerSaludo(nombre, callback) {
  setTimeout(() => {
    callback(`Hola, ${nombre}`);
  }, 100);
}

console.log("1: pido el saludo");

obtenerSaludo("Ana", (saludo) => {
  console.log("3:", saludo);
});

console.log("2: sigo con otras cosas");

// 1: pido el saludo
// 2: sigo con otras cosas
// 3: Hola, Ana
```

La función `obtenerSaludo` **no devuelve** el saludo. Devuelve `undefined`. El resultado llega por el callback.

```js
const resultado = obtenerSaludo("Ana", (saludo) => {
  console.log(saludo);
});

console.log(resultado); // undefined
```

Esto es una diferencia fundamental con las funciones síncronas:

```js
function sumar(a, b) {
  return a + b;
}

const total = sumar(2, 3); // el valor está aquí, ahora
console.log(total); // 5
```

Con un callback, el valor **no está** cuando la función retorna. Está disponible solo dentro del callback.

> 📌 Esta es la razón por la que las promesas existen: devolver un objeto que representa el valor futuro, en lugar de no devolver nada.

### 5.4.3 Error-first callbacks

La convención más extendida en Node es el **error-first callback**: el callback recibe el error como **primer** argumento y el resultado como **segundo**.

```text
callback(error, resultado)
```

- Si todo va bien: `callback(null, resultado)`.
- Si algo falla: `callback(error)` o `callback(error, undefined)`.

```js
function leerConfiguracion(callback) {
  setTimeout(() => {
    const exito = Math.random() > 0.3;

    if (!exito) {
      callback(new Error("No se pudo leer la configuración"));
      return;
    }

    callback(null, { tema: "oscuro", idioma: "es" });
  }, 100);
}

leerConfiguracion((error, configuracion) => {
  if (error) {
    console.error("Falló:", error.message);
    return;
  }

  console.log("Configuración:", configuracion);
});
```

Reglas de la convención:

1. El error va **primero**.
2. Si no hay error, el primer argumento es `null` (o `undefined`).
3. El resultado va **segundo**.
4. Se comprueba `if (error)` antes de usar el resultado.
5. Se hace `return` después de manejar el error para no seguir ejecutando.

```js
// ✅ Correcto
function procesar(callback) {
  setTimeout(() => {
    callback(null, "resultado");
  }, 10);
}

procesar((error, resultado) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(resultado);
});
```

**¿Por qué el error primero?** Porque permite ignorar el resultado cuando hay error y porque es fácil olvidar comprobarlo si va al final. Al ponerlo primero, el `if (error)` aparece de inmediato en el código.

> ⚠️ `console.error` es como `console.log`, pero escribe en el canal de errores. En Node va a `stderr`; en el navegador aparece resaltado en rojo. Úsalo para problemas, no para salida normal. `console.warn` hace lo mismo con el canal de advertencias: úsalo para situaciones recuperables o avisos.

### 5.4.4 El infierno de callbacks

Cuando necesitas varias operaciones asíncronas **en secuencia**, cada una depende de la anterior, y los callbacks se anidan.

Supongamos que queremos:

1. Obtener un usuario.
2. Obtener sus pedidos.
3. Obtener el detalle del primer pedido.
4. Calcular el total.

Con callbacks:

```js
function obtenerUsuario(id, callback) {
  setTimeout(() => callback(null, { id, nombre: "Ana" }), 50);
}

function obtenerPedidos(usuarioId, callback) {
  setTimeout(() => callback(null, [{ id: 101 }, { id: 102 }]), 50);
}

function obtenerDetallePedido(pedidoId, callback) {
  setTimeout(() => callback(null, { id: pedidoId, total: 49.9 }), 50);
}

obtenerUsuario(1, (errorUsuario, usuario) => {
  if (errorUsuario) {
    console.error(errorUsuario);
    return;
  }

  obtenerPedidos(usuario.id, (errorPedidos, pedidos) => {
    if (errorPedidos) {
      console.error(errorPedidos);
      return;
    }

    obtenerDetallePedido(pedidos[0].id, (errorDetalle, detalle) => {
      if (errorDetalle) {
        console.error(errorDetalle);
        return;
      }

      console.log("Total:", detalle.total);
    });
  });
});

// Total: 49.9
```

Funciona, pero tiene problemas:

- **Anidación:** cada paso añade un nivel de indentación.
- **Manejo de errores repetido:** el mismo `if (error)` en cada nivel.
- **Difícil de leer:** el flujo va de dentro hacia fuera.
- **Difícil de reutilizar:** no puedes extraer un paso sin romper el contexto.
- **Difícil de paralelizar:** si dos pasos son independientes, el anidamiento sugiere secuencia.

Esto se conoce como **callback hell** o **pirámide de la perdición**.

```text
paso1(() => {
  paso2(() => {
    paso3(() => {
      paso4(() => {
        paso5(() => {
          // ...
        });
      });
    });
  });
});
```

La solución no es “indentar mejor”. La solución es cambiar el modelo: promesas y `async/await`.

### 5.4.5 Inversión de control

Con callbacks, entregas tu función a otro código y confías en que la llame bien. Eso es la **inversión de control**: tú controlas lo que hace el callback, pero no **cuándo**, **cuántas veces** ni **con qué argumentos** lo llama el otro.

```js
function procesarPago(pedido, callback) {
  // Imagina que este código es de un tercero
  setTimeout(() => {
    callback(null, { pagado: true });
    callback(null, { pagado: true }); // ⚠️ lo llama dos veces
  }, 50);
}

procesarPago({ id: 1 }, (error, resultado) => {
  if (error) {
    console.error(error);
    return;
  }

  console.log("Procesado:", resultado.pagado);
});

// Procesado: true
// Procesado: true  ⚠️ dos veces
```

Problemas posibles de un callback entregado a terceros:

| Problema | Qué pasa |
|---|---|
| Se llama dos veces | El efecto se duplica |
| Nunca se llama | La operación queda colgada |
| Se llama con error y resultado | Debes decidir cuál manda |
| Se llama síncrono a veces y asíncrono otras | El orden cambia (Zalgo) |
| Lanza una excepción | El llamador no puede capturarla |

Puedes protegerte parcialmente con un guardián:

```js
function unaSolaVez(fn) {
  let llamada = false;

  return function (...args) {
    if (llamada) return;
    llamada = true;
    fn.apply(this, args);
  };
}

const callbackSeguro = unaSolaVez((error, resultado) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log("Procesado:", resultado.pagado);
});

procesarPago({ id: 1 }, callbackSeguro);

// Procesado: true  (solo una vez)
```

Pero esto es un parche. Las promesas resuelven el problema de raíz: una promesa **solo puede asentarse una vez**, y siempre notifica de forma asíncrona.

### 5.4.6 Zalgo: a veces síncrono, a veces asíncrono

Un callback es “Zalgo” cuando a veces se ejecuta de forma síncrona y a veces de forma asíncrona, según el caso. Esto rompe todas las suposiciones del llamador.

```js
let cache = null;

function obtener(id, callback) {
  if (cache !== null) {
    callback(null, cache); // síncrono
    return;
  }

  setTimeout(() => {
    cache = { id };
    callback(null, cache); // asíncrono
  }, 10);
}

console.log("antes de la primera");
obtener(1, (error, valor) => console.log("primera:", valor.id));
console.log("después de la primera");

setTimeout(() => {
  console.log("antes de la segunda");
  obtener(1, (error, valor) => console.log("segunda:", valor.id));
  console.log("después de la segunda");
}, 50);

// antes de la primera
// después de la primera
// primera: 1
// antes de la segunda
// segunda: 1          ⚠️ se ejecuta antes del "después"
// después de la segunda
```

La primera llamada es asíncrona; la segunda es síncrona. El mismo código produce órdenes distintos. Esto causa bugs intermitentes y muy difíciles de reproducir.

**Regla:** si una función acepta un callback, debe llamarlo **siempre de forma asíncrona** o **siempre de forma síncrona**, nunca según el caso. La convención de Node es siempre asíncrona.

```js
// ✅ Siempre asíncrono, incluso si el valor está en caché
function obtenerBien(id, callback) {
  setTimeout(() => {
    if (cache !== null) {
      callback(null, cache);
      return;
    }

    cache = { id };
    callback(null, cache);
  }, 0);
}
```

> 📌 “Zalgo” es el nombre humorístico que dio Isaac Z. Schlueter a este fenómeno. La frase clásica es “releasing Zalgo”: liberar el caos en el orden de ejecución.

### 5.4.7 Callbacks que se llaman dos veces o nunca

Un callback mal implementado puede:

- Llamarse dos veces (efecto duplicado).
- No llamarse nunca (operación colgada).
- Llamarse después de un timeout (respuesta obsoleta).

Protección básica para el caso “dos veces”:

```js
function unaSolaVez(fn) {
  let ejecutada = false;

  return function (...args) {
    if (ejecutada) return;
    ejecutada = true;
    fn.apply(this, args);
  };
}
```

Para el caso “nunca”, necesitas un timeout:

```js
function conLimite(fn, ms) {
  const callbackSeguro = unaSolaVez(fn);

  const id = setTimeout(() => {
    callbackSeguro(new Error("Tiempo de espera agotado"));
  }, ms);

  return function (...args) {
    clearTimeout(id);
    callbackSeguro(...args);
  };
}

const responder = conLimite((error, datos) => {
  if (error) {
    console.error(error.message);
    return;
  }
  console.log(datos);
}, 100);

// Si nadie llama a responder en 100 ms, se reporta el timeout
```

> 📌 Los `...args` y `fn.apply` ya los conoces de los Módulos 2 y 4. Aquí solo los combinamos con timers.

### 5.4.8 Callbacks con nombre y limpieza

Un callback con nombre es más fácil de depurar, reutilizar y cancelar.

```js
// ❌ Difícil de identificar en una traza de pila
setTimeout(function () {
  console.log("listo");
}, 100);

// ✅ Nombre descriptivo
function alTerminarCarga() {
  console.log("listo");
}

setTimeout(alTerminarCarga, 100);
```

También puedes cancelar si guardas la referencia:

```js
function alTerminarCarga() {
  console.log("listo");
}

const id = setTimeout(alTerminarCarga, 1000);

// más tarde
clearTimeout(id);
```

En eventos del navegador (Módulo 6) ocurre lo mismo: para quitar un listener necesitas la **misma referencia** de función.

```js
// Vista previa de Módulo 6
// element.addEventListener("click", alHacerClic);
// element.removeEventListener("click", alHacerClic);
```

### 5.4.9 Cuándo siguen siendo útiles los callbacks

Los callbacks no están obsoletos. Siguen siendo la interfaz natural en muchos lugares:

- Métodos de array: `map`, `filter`, `reduce`, `forEach`.
- Eventos: `addEventListener`.
- Timers: `setTimeout`, `setInterval`.
- APIs antiguas de Node.
- Funciones que se ejecutan “cuando termine algo” y no necesitan composición.

La regla práctica:

| Situación | Herramienta |
|---|---|
| Una operación asíncrona simple | Callback o promesa |
| Varias operaciones encadenadas | Promesa o `async/await` |
| Operaciones en paralelo | `Promise.all` |
| Recorrer un array | Callback (métodos de array) |
| Eventos repetidos | Callback (listener) |

> 📌 Las promesas se construyen **sobre** callbacks. `then` recibe callbacks. Entender callbacks es entender la base.

### ✅ Haz esto / ❌ Evita esto (5.4)

**✅ Haz esto: usa error-first y retorna tras el error.**

```js
operacion((error, datos) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(datos);
});
```

**❌ Evita esto: ignorar el error y usar datos indefinidos.**

```js
// ❌ Si hay error, datos es undefined y esto falla
operacion((error, datos) => {
  console.log(datos.nombre);
});
```

**✅ Haz esto: mantén un orden consistente (siempre asíncrono).**

```js
function obtener(id, callback) {
  setTimeout(() => callback(null, { id }), 0);
}
```

**❌ Evita esto: mezclar síncrono y asíncrono según la caché.**

```js
// ❌ Zalgo
function obtener(id, callback) {
  if (cache[id]) {
    callback(null, cache[id]);
    return;
  }
  setTimeout(() => callback(null, { id }), 10);
}
```

**✅ Haz esto: protege callbacks que podrían llamarse dos veces.**

```js
const responder = unaSolaVez((error, datos) => {
  if (error) return console.error(error);
  console.log(datos);
});
```

**❌ Evita esto: anidar cinco callbacks.**

```js
// ❌ Pirámide de la perdición
paso1(() => {
  paso2(() => {
    paso3(() => {
      paso4(() => {
        paso5(() => {});
      });
    });
  });
});
```

**✅ Haz esto: usa nombres descriptivos.**

```js
function alGuardar(error) {
  if (error) console.error(error);
}

guardar(alGuardar);
```

**❌ Evita esto: callbacks anónimos gigantes.**

```js
// ❌ Difícil de leer y de depurar
guardar(function (error) {
  if (error) {
    // 40 líneas...
  }
});
```

---

## 5.5 — Promesas: fundamentos

### 5.5.1 Qué problema resuelven

Una **promesa** es un objeto que representa el resultado **futuro** de una operación asíncrona. Puede estar:

- **Pendiente** (`pending`): la operación aún no terminó.
- **Cumplida** (`fulfilled`): terminó bien y tiene un valor.
- **Rechazada** (`rejected`): terminó mal y tiene una razón (normalmente un error).

```text
                    ┌─────────────┐
                    │   pending   │
                    └──────┬──────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              v                         v
      ┌─────────────┐           ┌─────────────┐
      │  fulfilled  │           │  rejected   │
      │  (valor)    │           │  (razón)    │
      └─────────────┘           └─────────────┘
```

Una promesa resuelve varios problemas de los callbacks:

| Problema del callback | Solución de la promesa |
|---|---|
| El valor no se devuelve | La promesa **es** el valor futuro |
| Anidación | `.then` devuelve una nueva promesa y permite encadenar |
| Error repetido en cada nivel | `.catch` captura errores de toda la cadena |
| Se puede llamar dos veces | Solo se asienta una vez |
| Orden inconsistente (Zalgo) | Los callbacks siempre son microtareas |
| Difícil de componer | `all`, `allSettled`, `race`, `any` |

### 5.5.2 Anatomía de una promesa

```js
const promesa = new Promise((resolve, reject) => {
  // ejecutor
});
```

| Parte | Qué es |
|---|---|
| `new Promise(...)` | Crea una promesa |
| `resolve` | Función para cumplirla con un valor |
| `reject` | Función para rechazarla con una razón |
| Ejecutor | Función que se ejecuta inmediatamente |

El **ejecutor** recibe dos funciones que el motor te da: `resolve` y `reject`. Tú decides cuándo llamarlas.

```js
const promesa = new Promise((resolve, reject) => {
  const exito = true;

  if (exito) {
    resolve("todo bien");
  } else {
    reject(new Error("algo falló"));
  }
});
```

### 5.5.3 El ejecutor es síncrono

Este es el primer detalle que sorprende: la función que pasas a `new Promise` se ejecuta **inmediatamente**, de forma síncrona. Lo que es asíncrono son los callbacks de `.then`, no el ejecutor.

```js
console.log("1: antes");

const promesa = new Promise((resolve) => {
  console.log("2: dentro del ejecutor");
  resolve("valor");
});

console.log("3: después del constructor");

promesa.then((valor) => {
  console.log("4: then", valor);
});

console.log("5: final");

// 1: antes
// 2: dentro del ejecutor
// 3: después del constructor
// 5: final
// 4: then valor
```

Esto significa que si el ejecutor hace trabajo pesado, bloquea el hilo igual que cualquier otra función.

```js
// ❌ El ejecutor bloquea
const promesa = new Promise((resolve) => {
  const fin = Date.now() + 1000;
  while (Date.now() < fin) {}
  resolve("listo");
});
```

**Regla:** el ejecutor debe iniciar la operación asíncrona y registrar los callbacks. No debe hacer trabajo pesado.

### 5.5.4 `resolve` y `reject`

`resolve(valor)` cumple la promesa con un valor.

```js
const promesa = new Promise((resolve) => {
  setTimeout(() => {
    resolve(42);
  }, 100);
});

promesa.then((valor) => {
  console.log(valor); // 42
});
```

`reject(razón)` rechaza la promesa. La razón debería ser un `Error`, no un string.

```js
const promesa = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error("no se pudo conectar"));
  }, 100);
});

promesa.catch((error) => {
  console.log(error.message); // "no se pudo conectar"
});
```

**`resolve` y `reject` no detienen la ejecución.** Si llamas a `resolve` y luego sigues ejecutando código, ese código se ejecuta igual.

```js
new Promise((resolve) => {
  resolve("primero");
  console.log("esto también se ejecuta");
}).then((valor) => {
  console.log("valor:", valor);
});

// esto también se ejecuta
// valor: primero
```

Si quieres detenerte, usa `return`:

```js
new Promise((resolve, reject) => {
  if (!condicion) {
    reject(new Error("condición no cumplida"));
    return; // sale del ejecutor
  }

  resolve("ok");
});
```

**`resolve` con una promesa la adopta.** Si resuelves con otra promesa, la promesa exterior espera a la interior.

```js
const interior = new Promise((resolve) => {
  setTimeout(() => resolve("valor interior"), 50);
});

const exterior = new Promise((resolve) => {
  resolve(interior);
});

exterior.then((valor) => {
  console.log(valor); // "valor interior"
});
```

Esto es útil para envolver APIs y para aplanar cadenas.

### 5.5.5 Una promesa se asienta una sola vez

Una vez que una promesa se cumple o se rechaza, su estado es **inmutable**. Las llamadas posteriores a `resolve` o `reject` se ignoran.

```js
const promesa = new Promise((resolve, reject) => {
  resolve("primero");
  resolve("segundo");
  reject(new Error("tercero"));
});

promesa.then((valor) => {
  console.log(valor); // "primero"
});
```

Esto resuelve el problema del callback llamado dos veces. La promesa garantiza **un solo resultado**.

```js
// Aunque el código sea caótico, solo cuenta la primera
new Promise((resolve, reject) => {
  reject(new Error("fallo"));
  resolve("éxito"); // ignorado
}).catch((error) => {
  console.log(error.message); // "fallo"
});
```

> 📌 “Asentada” (`settled`) significa cumplida **o** rechazada. `Promise` no tiene una propiedad pública `state`; el estado es interno. Lo observas a través de `then`/`catch`/`finally`.

### 5.5.6 `then`

`then` registra callbacks para cuando la promesa se asiente.

```js
promesa.then(
  (valor) => {
    // se ejecuta si se cumple
  },
  (error) => {
    // se ejecuta si se rechaza
  }
);
```

Firma:

```text
promesa.then(onFulfilled, onRejected)
```

- `onFulfilled` recibe el valor.
- `onRejected` recibe la razón.
- Ambos son opcionales.
- `then` devuelve **una nueva promesa**.

```js
const promesa = Promise.resolve("Hola");

promesa.then((valor) => {
  console.log("cumplida:", valor);
});

promesa.then(null, (error) => {
  console.log("rechazada:", error);
});

// cumplida: Hola
```

**Los callbacks de `then` siempre se ejecutan de forma asíncrona**, incluso si la promesa ya está resuelta.

```js
console.log("antes");

Promise.resolve("ya resuelta").then((valor) => {
  console.log("then:", valor);
});

console.log("después");

// antes
// después
// then: ya resuelta
```

Esto evita el problema de Zalgo: el orden es siempre el mismo.

### 5.5.7 `catch`

`catch` es azúcar para `then(undefined, onRejected)`. Captura el rechazo.

```js
const promesa = Promise.reject(new Error("fallo"));

promesa.catch((error) => {
  console.log("capturado:", error.message);
});

// capturado: fallo
```

También puedes usar el segundo argumento de `then`:

```js
promesa.then(
  (valor) => console.log("valor:", valor),
  (error) => console.log("error:", error.message)
);
```

**Diferencia importante:** `.catch` captura también los errores que ocurren **dentro** del `then` anterior. El segundo argumento de `then` no captura errores del primer argumento.

```js
// ✅ catch captura el error del then
Promise.resolve("ok")
  .then((valor) => {
    throw new Error("error dentro del then");
  })
  .catch((error) => {
    console.log("catch:", error.message);
  });

// catch: error dentro del then
```

```js
// ⚠️ El segundo argumento NO captura el error del primero
Promise.resolve("ok").then(
  (valor) => {
    throw new Error("error dentro del then");
  },
  (error) => {
    console.log("no se ejecuta");
  }
);

// Error no capturado
```

Por eso la recomendación es usar `.catch` al final de la cadena, no el segundo argumento de `then`.

### 5.5.8 `finally`

`finally` ejecuta un callback cuando la promesa se asienta, **haya éxito o error**. No recibe argumentos.

```js
Promise.resolve("ok")
  .finally(() => {
    console.log("finally: siempre");
  })
  .then((valor) => {
    console.log("valor:", valor);
  });

// finally: siempre
// valor: ok
```

```js
Promise.reject(new Error("fallo"))
  .finally(() => {
    console.log("finally: siempre");
  })
  .catch((error) => {
    console.log("catch:", error.message);
  });

// finally: siempre
// catch: fallo
```

`finally` es útil para limpieza: cerrar un indicador de carga, liberar un recurso, registrar una métrica.

```js
function conIndicador(promesa) {
  console.log("mostrar indicador");

  return promesa.finally(() => {
    console.log("ocultar indicador");
  });
}

conIndicador(Promise.resolve("datos")).then((datos) => {
  console.log("datos:", datos);
});

// mostrar indicador
// ocultar indicador
// datos: datos
```

**El valor de retorno de `finally` se ignora**, salvo que sea una promesa rechazada, que reemplaza el resultado.

```js
Promise.resolve("original")
  .finally(() => "otro valor")
  .then((valor) => console.log(valor));

// original
```

```js
Promise.resolve("original")
  .finally(() => Promise.reject(new Error("fallo en finally")))
  .catch((error) => console.log("catch:", error.message));

// catch: fallo en finally
```

**`finally` no recibe el valor ni el error.** Si los necesitas, usa `then` o `catch`.

```js
// ❌ finally no recibe argumentos
Promise.resolve("valor").finally((valor) => {
  console.log(valor); // undefined
});
```

### 5.5.9 `then` devuelve una nueva promesa

Este es el concepto que hace posible el encadenamiento.

```js
const p1 = Promise.resolve(1);
const p2 = p1.then((valor) => valor + 1);
const p3 = p2.then((valor) => valor * 10);

p3.then((valor) => console.log(valor)); // 20
```

Cada `then` devuelve una promesa nueva. El valor que devuelve el callback se usa para resolver esa nueva promesa.

```text
p1 (1)
  │
  └─ then(v => v + 1) ──> p2 (2)
                            │
                            └─ then(v => v * 10) ──> p3 (20)
```

Si el callback devuelve otra promesa, la nueva promesa la adopta y espera.

```js
Promise.resolve("a")
  .then((valor) => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(valor + "b"), 50);
    });
  })
  .then((valor) => {
    console.log(valor); // "ab"
  });
```

Esto es lo que permite reemplazar el callback hell por una cadena plana.

```js
// ✅ Cadena plana
obtenerUsuario(1)
  .then((usuario) => obtenerPedidos(usuario.id))
  .then((pedidos) => obtenerDetallePedido(pedidos[0].id))
  .then((detalle) => {
    console.log("Total:", detalle.total);
  })
  .catch((error) => {
    console.error(error);
  });
```

Compara con la versión anidada de 5.4.4. El flujo se lee de arriba abajo y un solo `catch` cubre todos los pasos.

### 5.5.10 Thenables

Un **thenable** es cualquier objeto con un método `then`. No tiene que ser una instancia de `Promise`.

```js
const thenable = {
  then(resolve) {
    resolve("valor del thenable");
  },
};

Promise.resolve(thenable).then((valor) => {
  console.log(valor); // "valor del thenable"
});
```

Las promesas aceptan thenables porque el protocolo es **estructural**: si tiene `then`, se puede tratar como promesa.

```js
const thenable = {
  then(resolve, reject) {
    setTimeout(() => {
      resolve("asíncrono");
    }, 50);
  },
};

new Promise((resolve) => {
  resolve(thenable);
}).then((valor) => {
  console.log(valor); // "asíncrono"
});
```

**Cuidado:** un objeto con una propiedad `then` que no sea una función se trata como valor normal.

```js
const objeto = { then: "no soy una función" };

Promise.resolve(objeto).then((valor) => {
  console.log(valor.then); // "no soy una función"
});
```

> 📌 Los thenables son la base de interoperabilidad entre librerías. Muchas APIs devuelven objetos “parecidos a promesas” que puedes envolver con `Promise.resolve`.

### 5.5.11 `Promise.resolve` y `Promise.reject`

`Promise.resolve(valor)` crea una promesa ya cumplida.

```js
Promise.resolve(42).then((valor) => {
  console.log(valor); // 42
});
```

- Si el valor es una promesa, la devuelve tal cual.
- Si el valor es un thenable, lo adopta.
- Si es un valor normal, lo envuelve.

```js
const original = Promise.resolve("original");
const misma = Promise.resolve(original);

console.log(original === misma); // true
```

`Promise.reject(razón)` crea una promesa ya rechazada.

```js
Promise.reject(new Error("fallo")).catch((error) => {
  console.log(error.message); // "fallo"
});
```

**`Promise.reject` no adopta promesas.** Si le pasas una promesa, la usa como razón del rechazo.

```js
const interior = Promise.resolve("interior");

Promise.reject(interior).catch((razon) => {
  console.log(razon === interior); // true
});
```

> ⚠️ `Promise.reject` crea un rechazo inmediato. Si no lo capturas en el mismo turno, Node puede terminar el proceso (5.6.6).

### 5.5.12 Promesas ya resueltas y microtareas

Aunque una promesa ya esté resuelta, su `then` no se ejecuta de inmediato. Se encola como microtarea.

```js
console.log("1");

Promise.resolve("ya").then((valor) => {
  console.log("3:", valor);
});

console.log("2");

// 1
// 2
// 3: ya
```

Esto es intencional: garantiza un orden consistente y evita que el código dependa de si la promesa estaba resuelta o no.

```js
// ✅ El orden es el mismo aunque la promesa tarde
function obtener(valor, ms) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

obtener("rápido", 0).then((v) => console.log("A", v));
obtener("lento", 50).then((v) => console.log("B", v));

// A rápido
// B lento
```

### 5.5.13 Errores comunes al crear promesas

**Error 1: anidar promesas en lugar de devolverlas.**

```js
// ❌ Anidada: el then exterior no espera la interior
Promise.resolve("a").then((valor) => {
  Promise.resolve(valor + "b").then((resultado) => {
    console.log("interno:", resultado);
  });
  return "algo más";
});

// ⚠️ El flujo se pierde
```

```js
// ✅ Devuelve la promesa
Promise.resolve("a")
  .then((valor) => {
    return Promise.resolve(valor + "b");
  })
  .then((resultado) => {
    console.log("cadena:", resultado); // "ab"
  });
```

**Error 2: olvidar `return` dentro de un `then`.**

```js
// ❌ Sin return: el siguiente then recibe undefined
Promise.resolve(1)
  .then((valor) => {
    valor + 1; // falta return
  })
  .then((valor) => {
    console.log(valor); // undefined
  });
```

```js
// ✅ Con return
Promise.resolve(1)
  .then((valor) => {
    return valor + 1;
  })
  .then((valor) => {
    console.log(valor); // 2
  });
```

**Error 3: usar `new Promise` cuando ya tienes una promesa.**

```js
// ❌ Envoltorio innecesario
function obtenerDatos() {
  return new Promise((resolve, reject) => {
    fetchDatos().then(resolve).catch(reject); // fetchDatos ya devuelve promesa
  });
}
```

```js
// ✅ Devuelve la promesa directamente
function obtenerDatos() {
  return fetchDatos();
}
```

**Error 4: lanzar dentro del ejecutor después de resolver.**

```js
// ⚠️ El throw se ignora porque la promesa ya está resuelta
new Promise((resolve) => {
  resolve("ok");
  throw new Error("ignorado");
}).then((valor) => console.log(valor));

// ok
```

**Error 5: usar `reject` con un string.**

```js
// ❌ Pierdes stack y tipo
reject("fallo");
```

```js
// ✅ Usa Error
reject(new Error("fallo"));
```

### 5.5.14 Promesa vs callback: comparación

| Aspecto | Callback | Promesa |
|---|---|---|
| Valor de retorno | `undefined` | Objeto con el valor futuro |
| Encadenamiento | Anidación | `.then` plano |
| Errores | Repetir `if (error)` | `.catch` centralizado |
| Múltiples consumidores | Hay que gestionarlo | `.then` se puede llamar varias veces |
| Cancelación | Manual | Manual (no nativa) |
| Composición | Difícil | `all`, `race`, `any` |
| Orden | Puede ser Zalgo | Siempre microtarea |

**Múltiples consumidores:** una promesa puede tener varios `.then`. Todos reciben el mismo valor.

```js
const promesa = Promise.resolve("compartido");

promesa.then((valor) => console.log("A:", valor));
promesa.then((valor) => console.log("B:", valor));

// A: compartido
// B: compartido
```

Con un callback, tendrías que guardar el valor y llamar a cada callback manualmente.

### ✅ Haz esto / ❌ Evita esto (5.5)

**✅ Haz esto: devuelve la promesa para encadenar.**

```js
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!id) {
        reject(new Error("id inválido"));
        return;
      }
      resolve({ id, nombre: "Ana" });
    }, 50);
  });
}
```

**❌ Evita esto: crear una promesa y no devolverla.**

```js
// ❌ El llamador no puede esperar
function obtenerUsuario(id) {
  new Promise((resolve) => {
    setTimeout(() => resolve({ id }), 50);
  });
}
```

**✅ Haz esto: rechaza con `Error`.**

```js
reject(new Error("No se pudo cargar"));
```

**❌ Evita esto: rechazar con strings o números.**

```js
reject("No se pudo cargar");
```

**✅ Haz esto: usa `finally` para limpieza.**

```js
cargar()
  .then(mostrar)
  .catch(mostrarError)
  .finally(ocultarIndicador);
```

**❌ Evita esto: poner la limpieza solo en el camino feliz.**

```js
// ❌ Si falla, el indicador queda visible
cargar().then((datos) => {
  mostrar(datos);
  ocultarIndicador();
});
```

**✅ Haz esto: usa `return` dentro de `then`.**

```js
promesa.then((valor) => {
  return transformar(valor);
});
```

**❌ Evita esto: olvidar `return`.**

```js
promesa.then((valor) => {
  transformar(valor); // el resultado se pierde
});
```

**✅ Haz esto: captura al final de la cadena.**

```js
paso1()
  .then(paso2)
  .then(paso3)
  .catch((error) => console.error(error));
```

**❌ Evita esto: dejar un rechazo sin capturar.**

```js
// ❌ Node puede terminar el proceso
Promise.reject(new Error("sin capturar"));
```

---

## 5.6 — Encadenamiento y propagación de errores

### 5.6.1 La cadena como un pipeline

Una cadena de promesas es un **pipeline**: cada paso recibe el resultado del anterior, lo transforma y pasa el nuevo valor al siguiente.

```js
Promise.resolve(2)
  .then((n) => n * 3)   // 6
  .then((n) => n + 4)   // 10
  .then((n) => n / 2)   // 5
  .then((n) => console.log(n)); // 5
```

Visualmente:

```text
valor inicial: 2
      │
      v
  then(n => n * 3)  ──> 6
      │
      v
  then(n => n + 4)  ──> 10
      │
      v
  then(n => n / 2)  ──> 5
      │
      v
  then(console.log) ──> imprime 5
```

Cada `then` crea una nueva promesa. Si un paso devuelve un valor normal, la nueva promesa se cumple con ese valor. Si devuelve una promesa, la nueva promesa espera a que esa promesa se asiente.

### 5.6.2 Transformar valores

```js
function obtenerPrecio() {
  return Promise.resolve(100);
}

function aplicarDescuento(precio) {
  return precio * 0.9;
}

function aplicarImpuesto(precio) {
  return precio * 1.21;
}

obtenerPrecio()
  .then(aplicarDescuento)
  .then(aplicarImpuesto)
  .then((total) => {
    console.log(total.toFixed(2)); // "108.90"
  });
```

Puedes pasar funciones directamente a `then` si reciben un solo argumento y devuelven el siguiente valor. Es más legible que una arrow que solo delega.

```js
// ✅ Más legible
promesa.then(transformar).then(mostrar);

// ⚠️ Ruido innecesario
promesa.then((valor) => transformar(valor)).then((valor) => mostrar(valor));
```

> 📌 Cuidado con funciones que reciben más de un argumento. `then` pasa **un solo** valor. Si pasas `parseInt` directamente, recibirá el índice como segundo argumento y puede dar resultados inesperados. Usa una arrow cuando haya duda.

```js
// ❌ parseInt recibe (valor, índice) y el índice se usa como base
["10", "10", "10"].map(parseInt); // [10, NaN, 2]

// ✅ Arrow explícita
["10", "10", "10"].map((valor) => parseInt(valor, 10)); // [10, 10, 10]
```

### 5.6.3 Devolver valores vs devolver promesas

Dentro de un `then` puedes devolver:

1. Un valor normal → la promesa se cumple con ese valor.
2. Una promesa → la promesa se adopta y se espera.
3. Un thenable → se adopta.
4. Nada (`undefined`) → la promesa se cumple con `undefined`.

```js
Promise.resolve("inicio")
  .then(() => "valor normal")
  .then((valor) => {
    console.log("1:", valor); // "valor normal"
    return Promise.resolve("valor de promesa");
  })
  .then((valor) => {
    console.log("2:", valor); // "valor de promesa"
    // sin return
  })
  .then((valor) => {
    console.log("3:", valor); // undefined
  });
```

**La diferencia clave con los callbacks:** si devuelves una promesa, la cadena **espera**. Si no la devuelves, la cadena sigue sin esperar.

```js
// ❌ No espera: la promesa interna no se devuelve
Promise.resolve()
  .then(() => {
    new Promise((resolve) => {
      setTimeout(() => {
        console.log("interno");
        resolve();
      }, 10);
    });

    return "siguiente";
  })
  .then((valor) => console.log(valor));

// siguiente
// interno
```

```js
// ✅ Espera: se devuelve la promesa
Promise.resolve()
  .then(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("interno");
        resolve();
      }, 10);
    });
  })
  .then((valor) => console.log("siguiente:", valor));

// interno
// siguiente: undefined
```

### 5.6.4 Propagación de errores

Un rechazo viaja por la cadena hasta que encuentra un `catch`. Los `then` intermedios se **saltan**.

```js
Promise.resolve("inicio")
  .then((valor) => {
    console.log("paso 1:", valor);
    throw new Error("fallo en paso 1");
  })
  .then(() => {
    console.log("paso 2: no se ejecuta");
  })
  .then(() => {
    console.log("paso 3: no se ejecuta");
  })
  .catch((error) => {
    console.log("catch:", error.message);
  });

// paso 1: inicio
// catch: fallo en paso 1
```

Esto es una gran ventaja: **no necesitas comprobar errores en cada paso**. Un solo `catch` al final captura cualquier fallo de la cadena.

```js
obtenerUsuario(1)
  .then((usuario) => obtenerPedidos(usuario.id))
  .then((pedidos) => obtenerDetalle(pedidos[0].id))
  .then((detalle) => mostrar(detalle))
  .catch((error) => {
    console.error("Algo falló:", error.message);
  });
```

Si `obtenerUsuario`, `obtenerPedidos` u `obtenerDetalle` rechazan, el `catch` lo captura.

### 5.6.5 `catch` intermedio y recuperación

Un `catch` puede **recuperar** la cadena devolviendo un valor normal. La cadena continúa cumplida.

```js
Promise.reject(new Error("fallo"))
  .catch((error) => {
    console.log("recuperando de:", error.message);
    return "valor de respaldo";
  })
  .then((valor) => {
    console.log("la cadena sigue:", valor);
  });

// recuperando de: fallo
// la cadena sigue: valor de respaldo
```

También puedes relanzar el error para que lo maneje un `catch` posterior:

```js
Promise.reject(new Error("original"))
  .catch((error) => {
    console.log("primer catch:", error.message);
    throw new Error("transformado");
  })
  .catch((error) => {
    console.log("segundo catch:", error.message);
  });

// primer catch: original
// segundo catch: transformado
```

Y puedes devolver una promesa desde el `catch`:

```js
Promise.reject(new Error("fallo"))
  .catch(() => {
    return new Promise((resolve) => {
      setTimeout(() => resolve("recuperado tras esperar"), 50);
    });
  })
  .then((valor) => console.log(valor));

// recuperado tras esperar
```

**Un `catch` que no relanza ni devuelve nada convierte el rechazo en `undefined`.** Eso puede ocultar el error.

```js
// ⚠️ El error se pierde
Promise.reject(new Error("importante"))
  .catch((error) => {
    console.log("ignorado");
    // no return, no throw
  })
  .then((valor) => {
    console.log(valor); // undefined
  });
```

### 5.6.6 `finally` en la cadena

`finally` se ejecuta tanto si la cadena se cumple como si se rechaza. No cambia el valor ni la razón (salvo que lance o devuelva una promesa rechazada).

```js
function cargar() {
  return new Promise((resolve) => {
    setTimeout(() => resolve("datos"), 50);
  });
}

cargar()
  .then((datos) => {
    console.log("datos:", datos);
    return datos;
  })
  .catch((error) => {
    console.error("error:", error.message);
  })
  .finally(() => {
    console.log("limpieza");
  });

// datos: datos
// limpieza
```

Uso típico: ocultar un spinner, cerrar una conexión, liberar un recurso.

```js
function conRecurso(recurso, tarea) {
  console.log("abrir recurso");

  return tarea(recurso).finally(() => {
    console.log("cerrar recurso");
  });
}
```

### 5.6.7 Rechazos no manejados

Si una promesa se rechaza y nadie la captura, tienes un **unhandled rejection**.

En Node (versión 15 en adelante), un rechazo no manejado **termina el proceso** con un error. En el navegador, se dispara el evento `unhandledrejection` y se muestra un error en la consola, pero la página puede seguir viva.

```js
// ⚠️ NO ejecutes esto en Node sin un manejador global
Promise.reject(new Error("nadie me captura"));
```

Salida típica en Node:

```text
Error: nadie me captura
    at ...
Node.js v26.13.1
```

**Formas correctas de manejarlo:**

```js
// ✅ Captura inmediata
Promise.reject(new Error("fallo")).catch((error) => {
  console.error(error.message);
});
```

```js
// ✅ Devuelve o espera la promesa
async function main() {
  try {
    await Promise.reject(new Error("fallo"));
  } catch (error) {
    console.error(error.message);
  }
}

main();
```

```js
// ✅ Captura global (último recurso, no sustituye al manejo local)
process.on("unhandledRejection", (error) => {
  console.error("Rechazo no manejado:", error);
});
```

> 📌 `process.on("unhandledRejection", ...)` es específico de Node. En el navegador se usa `window.addEventListener("unhandledrejection", ...)`, que verás en el Módulo 6. Un manejador global es una red de seguridad, no una excusa para no capturar.

**Cuidado con los rechazos “tardíos”:** si creas una promesa rechazada y la capturas en un turno posterior, Node puede considerar que no está manejada antes de que llegue el `catch`.

```js
// ⚠️ El catch llega demasiado tarde
const promesa = Promise.reject(new Error("tarde"));

setTimeout(() => {
  promesa.catch((error) => console.log(error.message));
}, 0);
```

La solución es capturar en el mismo turno o envolver la creación para que el rechazo no se propague sin manejador.

### 5.6.8 Ciclo de encadenamiento

Si un `then` devuelve la misma promesa que está creando, se produce un ciclo y JavaScript lanza un `TypeError`.

```js
const promesa = Promise.resolve(1);

const ciclo = promesa.then(() => ciclo);

ciclo.catch((error) => {
  console.log(error.constructor.name); // TypeError
  console.log(error.message); // Chaining cycle detected...
});
```

Esto casi nunca se hace a propósito, pero aparece al reutilizar variables por error.

```js
// ❌ El then devuelve la promesa que está construyendo
let resultado;

resultado = Promise.resolve("a").then(() => resultado);
```

**Solución:** devuelve una promesa distinta o un valor.

```js
// ✅ Devuelve un valor
const resultado = Promise.resolve("a").then(() => "b");
```

### 5.6.9 Callbacks dentro de `then`

Un `then` puede recibir una función que a su vez use callbacks. El problema es que el `then` no espera callbacks que no devuelven promesas.

```js
// ❌ El then no espera al setTimeout
Promise.resolve("inicio")
  .then((valor) => {
    setTimeout(() => {
      console.log("callback interno");
    }, 50);
    return "fin";
  })
  .then((valor) => console.log(valor));

// fin
// callback interno
```

**Solución:** envuelve el callback en una promesa y devuélvela.

```js
// ✅ Espera al timer
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

Promise.resolve("inicio")
  .then((valor) => {
    return esperar(50, "callback convertido");
  })
  .then((valor) => console.log(valor));

// callback convertido
```

### 5.6.10 Convertir callbacks a promesas

El patrón se llama **promisify**: tomar una función que usa error-first callback y devolver una versión que devuelve una promesa.

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (error, resultado) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(resultado);
      });
    });
  };
}
```

Uso:

```js
function leerArchivo(nombre, callback) {
  setTimeout(() => {
    if (nombre === "no-existe") {
      callback(new Error("Archivo no encontrado"));
      return;
    }
    callback(null, `contenido de ${nombre}`);
  }, 50);
}

const leerArchivoPromesa = promisify(leerArchivo);

leerArchivoPromesa("datos.txt")
  .then((contenido) => console.log(contenido))
  .catch((error) => console.error(error.message));

// contenido de datos.txt
```

Con `async/await` (5.8) queda aún más limpio:

```js
async function main() {
  try {
    const contenido = await leerArchivoPromesa("datos.txt");
    console.log(contenido);
  } catch (error) {
    console.error(error.message);
  }
}

main();
```

**Detalles importantes de `promisify`:**

- `fn.call(this, ...args, callback)` conserva el `this` original (Módulo 4).
- El callback debe seguir la convención error-first.
- Si `fn` lanza de forma síncrona, el `new Promise` lo convierte en rechazo automáticamente.
- Si `fn` llama al callback dos veces, la promesa solo toma la primera (5.5.5).

> 📌 Node tiene `util.promisify`, que hace esto mismo. Lo verás en el Módulo 7. Aquí lo implementamos para entender el mecanismo.

### 5.6.11 Ejemplo completo: pipeline de pedidos

Juntemos todo con un flujo realista.

```js
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error("Usuario inválido"));
        return;
      }
      resolve({ id, nombre: "Ana" });
    }, 30);
  });
}

function obtenerPedidos(usuarioId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, total: 30 },
        { id: 102, total: 20 },
      ]);
    }, 30);
  });
}

function calcularTotal(pedidos) {
  return pedidos.reduce((suma, pedido) => suma + pedido.total, 0);
}

obtenerUsuario(1)
  .then((usuario) => {
    console.log("Usuario:", usuario.nombre);
    return obtenerPedidos(usuario.id);
  })
  .then((pedidos) => {
    console.log("Pedidos:", pedidos.length);
    return calcularTotal(pedidos);
  })
  .then((total) => {
    console.log("Total:", total);
  })
  .catch((error) => {
    console.error("Error:", error.message);
  })
  .finally(() => {
    console.log("Proceso terminado");
  });

// Usuario: Ana
// Pedidos: 2
// Total: 50
// Proceso terminado
```

Observa:

- No hay anidación.
- Un solo `catch` cubre todos los pasos.
- `finally` se ejecuta siempre.
- Cada paso devuelve el valor que necesita el siguiente.

### ✅ Haz esto / ❌ Evita esto (5.6)

**✅ Haz esto: devuelve la promesa para que la cadena espere.**

```js
promesa.then((usuario) => {
  return obtenerPedidos(usuario.id);
});
```

**❌ Evita esto: no devolverla.**

```js
promesa.then((usuario) => {
  obtenerPedidos(usuario.id); // la cadena no espera
});
```

**✅ Haz esto: un `catch` al final.**

```js
paso1().then(paso2).then(paso3).catch(manejarError);
```

**❌ Evita esto: `catch` vacíos que ocultan fallos.**

```js
paso1().then(paso2).catch(() => {});
```

**✅ Haz esto: recupera con un valor de respaldo.**

```js
promesa.catch((error) => {
  console.error(error);
  return { datos: [], error: true };
});
```

**❌ Evita esto: relanzar sin contexto.**

```js
promesa.catch((error) => {
  throw error; // no añade información
});
```

**✅ Haz esto: usa `finally` para limpieza.**

```js
cargar().then(mostrar).catch(mostrarError).finally(limpiar);
```

**❌ Evita esto: limpiar solo en el éxito.**

```js
cargar().then((datos) => {
  mostrar(datos);
  limpiar();
});
```

**✅ Haz esto: convierte callbacks con `promisify`.**

```js
const leerPromesa = promisify(leer);

leerPromesa("datos.txt").then((contenido) => {
  console.log(contenido);
});
```

**❌ Evita esto: mezclar callbacks y promesas sin necesidad.**

```js
// ❌ Doble modelo mental
leer("datos.txt", (error, contenido) => {
  if (error) return console.error(error);
  procesar(contenido).then(mostrar);
});
```

---

## 5.7 — Utilidades estáticas de `Promise`

### 5.7.1 `Promise.resolve` y `Promise.reject` (repaso)

Ya los viste en 5.5.11. Los resumimos porque son la base de las demás utilidades.

```js
Promise.resolve(1).then((v) => console.log(v)); // 1
Promise.reject(new Error("x")).catch((e) => console.log(e.message)); // "x"
```

**Uso principal:** normalizar valores que pueden o no ser promesas.

```js
function normalizar(valor) {
  return Promise.resolve(valor);
}

normalizar(5).then((v) => console.log(v)); // 5
normalizar(Promise.resolve(5)).then((v) => console.log(v)); // 5
```

### 5.7.2 `Promise.all`

`Promise.all(iterable)` espera a que **todas** las promesas se cumplan y devuelve un array con los resultados **en el mismo orden** que el iterable.

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

Promise.all([
  esperar(30, "a"),
  esperar(5, "b"),
  esperar(15, "c"),
]).then((resultados) => {
  console.log(resultados); // ["a", "b", "c"]
});
```

Aunque `b` termina primero, el resultado conserva el orden del array de entrada: `["a", "b", "c"]`.

**Si una sola promesa rechaza, `Promise.all` rechaza inmediatamente** con esa razón. Las demás siguen ejecutándose, pero sus resultados se ignoran.

```js
Promise.all([
  esperar(50, "lento"),
  Promise.reject(new Error("fallo inmediato")),
])
  .then((resultados) => console.log(resultados))
  .catch((error) => console.log("catch:", error.message));

// catch: fallo inmediato
```

Esto se llama **fail-fast**. Es útil cuando todas las piezas son necesarias: si falta una, el resultado completo no sirve.

**Acepta valores que no son promesas:**

```js
Promise.all([1, Promise.resolve(2), 3]).then((resultados) => {
  console.log(resultados); // [1, 2, 3]
});
```

**Array vacío:**

```js
Promise.all([]).then((resultados) => {
  console.log(resultados); // []
});
```

**Cuándo usarlo:**

- Necesitas **todos** los resultados.
- Si falta uno, la operación completa falla.
- Las operaciones son independientes y pueden ir en paralelo.

```js
// ✅ Tres peticiones en paralelo, no en secuencia
Promise.all([
  obtenerUsuario(1),
  obtenerPedidos(1),
  obtenerNotificaciones(1),
]).then(([usuario, pedidos, notificaciones]) => {
  console.log(usuario, pedidos, notificaciones);
});
```

> 📌 El destructuring de arrays `([a, b, c])` ya lo conoces del Módulo 3.

### 5.7.3 `Promise.allSettled`

`Promise.allSettled(iterable)` espera a que **todas** terminen, sin importar si se cumplen o se rechazan. **Nunca rechaza** por el rechazo de una de las promesas.

Devuelve un array de objetos con esta forma:

```js
const resultados = [
  { status: "fulfilled", value: valor },
  { status: "rejected", reason: error },
];
```

```js
Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error("fallo")),
  Promise.resolve(3),
]).then((resultados) => {
  console.log(resultados);

  // [
  //   { status: "fulfilled", value: 1 },
  //   { status: "rejected", reason: Error: fallo },
  //   { status: "fulfilled", value: 3 }
  // ]
});
```

Puedes procesar los resultados:

```js
Promise.allSettled([cargarA(), cargarB(), cargarC()]).then((resultados) => {
  const exitosos = resultados
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  const fallidos = resultados
    .filter((r) => r.status === "rejected")
    .map((r) => r.reason);

  console.log("Éxitos:", exitosos);
  console.log("Fallos:", fallidos);
});
```

**Cuándo usarlo:**

- Quieres saber el resultado de **cada** operación.
- Un fallo no debe impedir que las demás terminen.
- Estás agregando datos de varias fuentes y toleras fallos parciales.

```js
// ✅ Tolerancia a fallos parciales
Promise.allSettled([
  obtenerPrecio("A"),
  obtenerPrecio("B"),
  obtenerPrecio("C"),
]).then((resultados) => {
  const precios = resultados
    .filter((r) => r.status === "fulfilled")
    .map((r) => r.value);

  console.log("Precios disponibles:", precios);
});
```

**Diferencia clave con `all`:**

| `Promise.all` | `Promise.allSettled` |
|---|---|
| Falla si una falla | Nunca falla por rechazos |
| Devuelve valores | Devuelve objetos `status` |
| Rápido si todo va bien | Espera siempre a todas |
| Ideal si todo es necesario | Ideal si toleras fallos |

### 5.7.4 `Promise.race`

`Promise.race(iterable)` devuelve una promesa que se asienta con la **primera** promesa que se asiente, sea cumplida o rechazada.

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

Promise.race([esperar(30, "lento"), esperar(5, "rápido")]).then((valor) => {
  console.log(valor); // "rápido"
});
```

Si la primera en asentarse es un rechazo, `race` rechaza:

```js
Promise.race([
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("fallo rápido")), 5);
  }),
  esperar(50, "lento"),
])
  .then((valor) => console.log(valor))
  .catch((error) => console.log("catch:", error.message));

// catch: fallo rápido
```

**Uso típico: timeout.** Ya lo veremos en 5.11.4.

```js
function conTimeout(promesa, ms) {
  const limite = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("Timeout")), ms);
  });

  return Promise.race([promesa, limite]);
}
```

**Caso límite:** `Promise.race([])` queda **pendiente para siempre**, porque no hay ninguna promesa que se asiente.

```js
// ⚠️ Nunca se resuelve
Promise.race([]).then((valor) => {
  console.log("nunca");
});
```

### 5.7.5 `Promise.any`

`Promise.any(iterable)` devuelve una promesa que se cumple con la **primera** promesa que se **cumpla**. Ignora los rechazos.

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

Promise.any([
  Promise.reject(new Error("fallo 1")),
  esperar(10, "ganadora"),
  esperar(20, "tarde"),
]).then((valor) => {
  console.log(valor); // "ganadora"
});
```

Si **todas** se rechazan, `Promise.any` rechaza con un `AggregateError`, que tiene una propiedad `errors` con todos los rechazos (lo verás en 5.9.6).

```js
Promise.any([
  Promise.reject(new Error("a")),
  Promise.reject(new Error("b")),
]).catch((error) => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors.map((e) => e.message)); // ["a", "b"]
});
```

**Caso límite:** `Promise.any([])` rechaza inmediatamente con un `AggregateError` vacío.

```js
Promise.any([]).catch((error) => {
  console.log(error.constructor.name); // AggregateError
  console.log(error.errors.length); // 0
});
```

**Diferencia clave entre `race` y `any`:**

| `Promise.race` | `Promise.any` |
|---|---|
| Se asienta con la primera, éxito o error | Se cumple con la primera que **funcione** |
| Un rechazo rápido gana | Los rechazos se ignoran |
| Útil para timeout | Útil para réplicas o espejos |

```js
// ✅ any: prueba varios servidores y usa el primero que responda bien
Promise.any([
  consultarServidor("https://espejo-1.example"),
  consultarServidor("https://espejo-2.example"),
  consultarServidor("https://espejo-3.example"),
]).then((respuesta) => {
  console.log("Respuesta de algún servidor:", respuesta);
});
```

> 📌 `consultarServidor` es una función ficticia. Las peticiones reales con `fetch` se verán en el Módulo 7.

### 5.7.6 `Promise.withResolvers`

`Promise.withResolvers()` crea una promesa y devuelve `{ promise, resolve, reject }` en un solo paso. Es útil cuando necesitas controlar la resolución desde fuera del ejecutor.

```js
const { promise, resolve, reject } = Promise.withResolvers();

promise.then((valor) => {
  console.log("valor:", valor);
});

resolve(42);

// valor: 42
```

Sin `withResolvers`, tendrías que declarar las funciones fuera:

```js
let resolver;
let rechazar;

const promesa = new Promise((resolve, reject) => {
  resolver = resolve;
  rechazar = reject;
});

resolver("valor");
```

`withResolvers` evita ese patrón torpe. Es especialmente útil para envolver APIs basadas en eventos.

```js
function crearEspera() {
  const { promise, resolve, reject } = Promise.withResolvers();

  return {
    promesa: promise,
    terminar: resolve,
    fallar: reject,
  };
}

const espera = crearEspera();

espera.promesa.then((valor) => console.log("terminó:", valor));

setTimeout(() => {
  espera.terminar("listo");
}, 50);

// terminó: listo
```

> 📌 `Promise.withResolvers` es relativamente reciente (ES2024). Node 22+ y navegadores modernos lo incluyen. Si trabajas con entornos antiguos, usa el patrón manual.

### 5.7.7 Tabla comparativa

| Utilidad | Espera a | Si hay rechazo | Devuelve | Uso típico |
|---|---|---|---|---|
| `Promise.all` | Todas | Rechaza al primero | Array de valores | Todo es necesario |
| `Promise.allSettled` | Todas | Nunca rechaza | Array de `{status, ...}` | Tolerar fallos |
| `Promise.race` | La primera | Rechaza si la primera falla | Valor o error | Timeout, carrera |
| `Promise.any` | La primera cumplida | `AggregateError` si todas fallan | Primer valor | Réplicas, alternativas |
| `Promise.resolve` | — | — | Promesa cumplida | Normalizar |
| `Promise.reject` | — | — | Promesa rechazada | Simular error |
| `Promise.withResolvers` | — | — | `{promise, resolve, reject}` | Control externo |

**Regla de decisión:**

```text
¿Necesito todos los resultados?
├── Sí, y un fallo invalida todo  -> Promise.all
└── Sí, y tolero fallos parciales -> Promise.allSettled

¿Solo necesito el primero?
├── El primero que termine, aunque falle -> Promise.race
└── El primero que funcione              -> Promise.any
```

### 5.7.8 Errores comunes con las utilidades

**Error 1: usar `Promise.all` cuando un fallo no debería cancelar todo.**

```js
// ❌ Si una falla, pierdes las demás
Promise.all([cargarA(), cargarB(), cargarC()]).then(mostrar);
```

```js
// ✅ Tolerancia a fallos
Promise.allSettled([cargarA(), cargarB(), cargarC()]).then(procesar);
```

**Error 2: olvidar que `race` también rechaza.**

```js
// ❌ Un rechazo rápido puede romper el flujo
Promise.race([peticion(), timeout()]).then(mostrar);
```

```js
// ✅ Captura el rechazo
Promise.race([peticion(), timeout()])
  .then(mostrar)
  .catch(manejarError);
```

**Error 3: esperar que `any` espere a todas.**

```js
// ❌ any se cumple con la primera, no espera a las demás
Promise.any([rapida(), lenta()]).then((valor) => {
  console.log(valor); // el de rapida
});
```

**Error 4: pasar un array vacío sin pensar.**

```js
Promise.all([]).then((r) => console.log(r)); // []
Promise.allSettled([]).then((r) => console.log(r)); // []
// Promise.race([]) queda pendiente para siempre
// Promise.any([]) rechaza con AggregateError
```

**Error 5: no manejar el `AggregateError` de `any`.**

> 📌 `AggregateError` se explica a fondo en 5.9.6. Aquí solo comprobamos su tipo y su propiedad `errors`.

```js
Promise.any([fallaA(), fallaB()]).catch((error) => {
  if (error instanceof AggregateError) {
    console.log("Todos fallaron:", error.errors);
  }
});
```

### ✅ Haz esto / ❌ Evita esto (5.7)

**✅ Haz esto: usa `all` para datos que se necesitan juntos.**

```js
Promise.all([obtenerUsuario(1), obtenerPedidos(1)]).then(
  ([usuario, pedidos]) => {
    console.log(usuario, pedidos);
  }
);
```

**❌ Evita esto: hacer en serie lo que puede ir en paralelo.**

```js
// ❌ El doble de lento sin necesidad
obtenerUsuario(1).then((usuario) => {
  return obtenerPedidos(1).then((pedidos) => {
    console.log(usuario, pedidos);
  });
});
```

**✅ Haz esto: usa `allSettled` para tolerar fallos.**

```js
Promise.allSettled([a(), b(), c()]).then((resultados) => {
  console.log(resultados);
});
```

**❌ Evita esto: usar `all` y perder los éxitos si uno falla.**

```js
// ❌ Un fallo tira todo
Promise.all([a(), b(), c()]).catch((error) => {
  console.error(error);
});
```

**✅ Haz esto: captura el rechazo de `race`.**

```js
Promise.race([peticion(), limite()])
  .then(manejar)
  .catch(manejarError);
```

**❌ Evita esto: usar `race` sin timeout en la otra punta.**

```js
// ❌ Si la petición nunca termina, esto tampoco
Promise.race([peticion()]);
```

**✅ Haz esto: usa `any` para alternativas.**

```js
Promise.any([espejo1(), espejo2()]).then((respuesta) => {
  console.log(respuesta);
});
```

**❌ Evita esto: usar `any` si necesitas todos los resultados.**

```js
// ❌ Solo obtienes el primero
Promise.any([a(), b(), c()]).then((unico) => {
  console.log(unico);
});
```

---

## 5.8 — `async/await`

### 5.8.1 `async`

`async` es una palabra clave que se pone antes de una función. Hace dos cosas:

1. La función **siempre devuelve una promesa**.
2. Permite usar `await` dentro de ella.

```js
async function saludar() {
  return "Hola";
}

const resultado = saludar();

console.log(resultado instanceof Promise); // true

resultado.then((valor) => {
  console.log(valor); // "Hola"
});
```

Aunque devuelvas un valor normal, la función lo envuelve en una promesa cumplida.

```js
async function sumar(a, b) {
  return a + b;
}

sumar(2, 3).then((total) => {
  console.log(total); // 5
});
```

Si la función lanza un error, la promesa se rechaza:

```js
async function fallar() {
  throw new Error("fallo dentro de async");
}

fallar().catch((error) => {
  console.log(error.message); // "fallo dentro de async"
});
```

**Formas de declarar una función async:**

```js
// Declaración
async function a() {}

// Expresión
const b = async function () {};

// Arrow
const c = async () => {};

// Método
const objeto = {
  async metodo() {},
};

// Método de clase
class Servicio {
  async cargar() {}
}
```

### 5.8.2 `await`

`await` **pausa la función async** hasta que la promesa se asiente. No bloquea el hilo: mientras espera, el Event Loop sigue ejecutando otras tareas.

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

async function main() {
  console.log("1: antes");

  const valor = await esperar(100, "resultado");

  console.log("3:", valor);
}

console.log("0: inicio");
main();
console.log("2: después de llamar a main");

// 0: inicio
// 1: antes
// 2: después de llamar a main
// 3: resultado
```

Observa el orden:

1. `main()` empieza y ejecuta hasta el `await`.
2. `await` suspende `main` y devuelve el control al llamador.
3. El código síncrono sigue (`console.log("2")`).
4. Cuando la promesa se resuelve, `main` continúa en una microtarea.

**`await` no bloquea el hilo.** Si bloqueara, `console.log("2")` no se ejecutaría hasta después del resultado.

```js
// ❌ Esto sí bloquea el hilo (espera activa)
function bloquear(ms) {
  const fin = Date.now() + ms;
  while (Date.now() < fin) {}
}

// ✅ Esto no bloquea: suspende la función, no el hilo
async function esperarBien(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
```

**`await` convierte valores normales en promesas:**

```js
async function main() {
  const a = await 5;
  const b = await { x: 1 };
  const c = await Promise.resolve("promesa");

  console.log(a, b, c); // 5 { x: 1 } "promesa"
}

main();
```

**`await` con thenables:**

```js
const thenable = {
  then(resolve) {
    setTimeout(() => resolve("desde thenable"), 10);
  },
};

async function main() {
  console.log(await thenable); // "desde thenable"
}

main();
```

### 5.8.3 `async` siempre devuelve una promesa

Esto tiene consecuencias importantes:

```js
async function obtenerValor() {
  return 42;
}

// ✅ Puedes usar then
obtenerValor().then((v) => console.log(v));

// ✅ Puedes usar await
async function main() {
  const v = await obtenerValor();
  console.log(v);
}

main();
```

También significa que **no puedes usar el valor directamente**:

```js
// ❌ valor es una promesa, no 42
const valor = obtenerValor();
console.log(valor); // Promise { 42 }
```

```js
async function ejemplo() {
  // ✅ Espera
  const valor = await obtenerValor();
  console.log(valor); // 42
}
```

Y significa que una función async **nunca lanza de forma síncrona** hacia el llamador. Siempre devuelve una promesa rechazada.

```js
async function fallar() {
  throw new Error("fallo");
}

// ❌ El try/catch síncrono no captura el error
try {
  fallar();
} catch (error) {
  console.log("no se ejecuta");
}

// ✅ Captura con catch
fallar().catch((error) => console.log("catch:", error.message));
```

### 5.8.4 `await` en el nivel superior (vista previa)

`await` solo se puede usar dentro de una función `async` en scripts normales. En **módulos ES** (Módulo 7), puedes usar `await` en el nivel superior.

```js
// Vista previa de Módulo 7: solo funciona en módulos
// const datos = await obtenerDatos();
// console.log(datos);
```

En Node con CommonJS o en un script normal, esto lanza un `SyntaxError`:

```text
SyntaxError: await is only valid in async functions and the top level bodies of modules
```

Por ahora, envuelve todo en una función `async`:

```js
async function main() {
  const datos = await obtenerDatos();
  console.log(datos);
}

main().catch((error) => console.error(error));
```

> 📌 El patrón `main().catch(...)` es importante: si `main` rechaza y no lo capturas, tienes un unhandled rejection.

### 5.8.5 `try/catch` con `await`

La gran ventaja de `async/await` es que puedes usar `try/catch` normal para errores asíncronos.

```js
function fallar() {
  return Promise.reject(new Error("fallo asíncrono"));
}

async function main() {
  try {
    await fallar();
    console.log("no se ejecuta");
  } catch (error) {
    console.log("capturado:", error.message);
  }
}

main();

// capturado: fallo asíncrono
```

Esto es mucho más legible que `.catch` en cadenas largas.

```js
async function cargarPerfil(id) {
  try {
    const usuario = await obtenerUsuario(id);
    const pedidos = await obtenerPedidos(usuario.id);
    const detalle = await obtenerDetalle(pedidos[0].id);

    return detalle;
  } catch (error) {
    console.error("No se pudo cargar el perfil:", error.message);
    return null;
  }
}
```

**Puedes capturar tipos específicos:**

```js
async function main() {
  try {
    await operacion();
  } catch (error) {
    if (error instanceof TypeError) {
      console.log("Error de tipo");
    } else if (error instanceof RangeError) {
      console.log("Error de rango");
    } else {
      console.log("Otro error:", error.message);
    }
  }
}
```

**Cuidado:** un `try/catch` alrededor de un `await` solo captura errores de esa promesa y del código que sigue dentro del `try`. No captura errores de callbacks que se ejecutan fuera.

```js
// ❌ El catch no captura el error del setTimeout
async function main() {
  try {
    setTimeout(() => {
      throw new Error("error en timer");
    }, 10);
  } catch (error) {
    console.log("no se ejecuta");
  }
}
```

```js
// ✅ Envuelve el timer en una promesa
function esperarYFallar(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error("error en timer")), ms);
  });
}

async function main() {
  try {
    await esperarYFallar(10);
  } catch (error) {
    console.log("capturado:", error.message);
  }
}
```

### 5.8.6 `finally` con `async/await`

`finally` funciona igual que en las promesas: se ejecuta siempre.

```js
async function main() {
  try {
    console.log("cargando");
    await esperar(50);
    console.log("éxito");
  } catch (error) {
    console.log("error:", error.message);
  } finally {
    console.log("limpieza");
  }
}

main();

// cargando
// éxito
// limpieza
```

También puedes usar `finally` sin `catch`:

```js
async function main() {
  try {
    return await operacion();
  } finally {
    console.log("siempre");
  }
}
```

**Cuidado con `return` dentro de `finally`:** sobrescribe el valor o el error anterior.

```js
function ejemplo() {
  try {
    return "try";
  } finally {
    return "finally";
  }
}

console.log(ejemplo()); // "finally"
```

```js
function ejemplo() {
  try {
    throw new Error("original");
  } finally {
    throw new Error("nuevo");
  }
}

try {
  ejemplo();
} catch (error) {
  console.log(error.message); // "nuevo"
}
```

**Regla:** no uses `return` ni `throw` dentro de `finally` salvo que sepas exactamente lo que haces. El `finally` debe limpiar, no decidir el resultado.

### 5.8.7 `await` secuencial vs paralelo

Este es uno de los errores de rendimiento más comunes.

**Secuencial:** cada `await` espera al anterior.

```js
async function secuencial() {
  console.log("inicio");

  const a = await esperar(30, "a");
  console.log("a:", a);

  const b = await esperar(30, "b");
  console.log("b:", b);

  const c = await esperar(30, "c");
  console.log("c:", c);

  return [a, b, c];
}

// inicio
// a: a       (tras 30 ms)
// b: b       (tras 60 ms)
// c: c       (tras 90 ms)
```

**Paralelo:** lanzas todas las promesas y esperas con `Promise.all`.

```js
async function paralelo() {
  console.log("inicio");

  const [a, b, c] = await Promise.all([
    esperar(30, "a"),
    esperar(30, "b"),
    esperar(30, "c"),
  ]);

  console.log(a, b, c);
  return [a, b, c];
}

// inicio
// a b c      (tras 30 ms)
```

Visualmente:

```text
Secuencial:
  [a 30ms][b 30ms][c 30ms]  = 90 ms

Paralelo:
  [a 30ms]
  [b 30ms]                  = 30 ms
  [c 30ms]
```

**Regla:** si las operaciones son independientes, usa `Promise.all`. Si una depende del resultado de la anterior, usa `await` secuencial.

```js
async function cargar() {
  // ✅ Dependencia real: el segundo necesita el id del primero
  const usuario = await obtenerUsuario(1);
  const pedidos = await obtenerPedidos(usuario.id);

  // ✅ Independencia: pueden ir en paralelo
  const [perfil, configuracion] = await Promise.all([
    obtenerUsuario(1),
    obtenerConfiguracion(),
  ]);

  return { usuario, pedidos, perfil, configuracion };
}
```

### 5.8.8 `await` en bucles

**`for...of` con `await`:** espera en cada iteración. Es secuencial.

```js
async function procesarSecuencial(items) {
  const resultados = [];

  for (const item of items) {
    console.log("inicio", item);
    const resultado = await esperar(10, item * 2);
    console.log("fin", item);
    resultados.push(resultado);
  }

  return resultados;
}

procesarSecuencial([1, 2, 3]).then((r) => console.log(r));

// inicio 1
// fin 1
// inicio 2
// fin 2
// inicio 3
// fin 3
// [2, 4, 6]
```

**`for...of` con `Promise.all`:** lanza todas y espera al final.

```js
async function procesarParalelo(items) {
  const promesas = items.map((item) => {
    console.log("inicio", item);
    return esperar(10, item * 2);
  });

  const resultados = await Promise.all(promesas);
  console.log("todos terminaron");
  return resultados;
}

procesarParalelo([1, 2, 3]).then((r) => console.log(r));

// inicio 1
// inicio 2
// inicio 3
// todos terminaron
// [2, 4, 6]
```

**`while` con `await`:** útil para reintentos o paginación.

```js
async function reintentarHasta(condicion, max) {
  let intento = 0;

  while (intento < max) {
    intento++;
    const exito = await condicion();

    if (exito) return true;

    await esperar(100);
  }

  return false;
}
```

### 5.8.9 `forEach` con `async`: el error clásico

`forEach` **no espera** a que los callbacks async terminen. No devuelve una promesa. El `await` exterior no espera nada.

```js
async function main() {
  console.log("antes");

  [1, 2, 3].forEach(async (n) => {
    await esperar(10);
    console.log("procesado", n);
  });

  console.log("después");
}

main();

// antes
// después
// procesado 1
// procesado 2
// procesado 3
```

Esto casi nunca es lo que quieres. El `main` termina antes de que los callbacks terminen.

**Soluciones:**

```js
// ✅ for...of: secuencial
async function secuencial() {
  for (const n of [1, 2, 3]) {
    await esperar(10);
    console.log("procesado", n);
  }
  console.log("fin");
}
```

```js
// ✅ Promise.all + map: paralelo
async function paralelo() {
  await Promise.all(
    [1, 2, 3].map(async (n) => {
      await esperar(10);
      console.log("procesado", n);
    })
  );
  console.log("fin");
}
```

```js
// ✅ for await...of (vista previa, más adelante)
// for await (const n of iterableAsync) { ... }
```

**Regla:** nunca uses `forEach` con un callback `async` si necesitas esperar. Usa `for...of` o `Promise.all(map(...))`.

### 5.8.10 `return await` vs `return`

Dentro de una función `async`, `return promesa` y `return await promesa` parecen equivalentes, pero no lo son en un `try/catch`.

```js
async function sinAwait() {
  try {
    return Promise.reject(new Error("sin await"));
  } catch (error) {
    return "capturado sin await";
  }
}

async function conAwait() {
  try {
    return await Promise.reject(new Error("con await"));
  } catch (error) {
    return "capturado con await";
  }
}

sinAwait()
  .then((valor) => console.log("sinAwait:", valor))
  .catch((error) => console.log("sinAwait rechazo:", error.message));

conAwait()
  .then((valor) => console.log("conAwait:", valor))
  .catch((error) => console.log("conAwait rechazo:", error.message));

// conAwait: capturado con await
// sinAwait rechazo: sin await
```

**¿Por qué?** Con `return promesa`, la función devuelve la promesa y el `try/catch` ya terminó; el rechazo ocurre fuera. Con `return await promesa`, el `await` ocurre **dentro** del `try`, así que el `catch` lo captura.

**Regla:**

- Usa `return await` si necesitas capturar el error localmente con `try/catch`.
- Usa `return` si no necesitas capturarlo y quieres evitar un microtask extra.
- En la mayoría del código, la diferencia es mínima; la claridad manda.

```js
// ✅ Captura local
async function cargar() {
  try {
    return await obtenerDatos();
  } catch (error) {
    console.error(error);
    return null;
  }
}
```

```js
// ✅ Delegación sin captura local
async function cargar() {
  return obtenerDatos();
}
```

### 5.8.11 Errores comunes con `async/await`

**Error 1: olvidar `await`.**

```js
// ❌ datos es una promesa
async function main() {
  const datos = obtenerDatos();
  console.log(datos); // Promise { ... }
}
```

```js
// ✅
async function main() {
  const datos = await obtenerDatos();
  console.log(datos);
}
```

**Error 2: no capturar el rechazo de una función async llamada sin `await`.**

```js
// ❌ Si falla, rechazo no manejado
async function main() {
  cargar(); // falta await
}

main();
```

```js
// ✅
async function main() {
  await cargar();
}

main().catch((error) => console.error(error));
```

**Error 3: usar `await` dentro de `forEach`.**

```js
// ❌ No espera
[1, 2, 3].forEach(async (n) => {
  await procesar(n);
});
```

**Error 4: hacer secuencial lo que puede ser paralelo.**

```js
async function ejemplo() {
  // ❌ 90 ms
  const a = await tareaA();
  const b = await tareaB();
  const c = await tareaC();
}
```

```js
async function ejemplo() {
  // ✅ 30 ms
  const [a, b, c] = await Promise.all([tareaA(), tareaB(), tareaC()]);
}
```

**Error 5: `try/catch` que se traga el error.**

```js
async function ejemplo() {
  // ❌ El error desaparece
  try {
    await operacion();
  } catch (error) {}
}
```

**Error 6: usar `async` sin necesidad.**

```js
// ❌ No hay await; la promesa es innecesaria
async function sumar(a, b) {
  return a + b;
}
```

```js
// ✅
function sumar(a, b) {
  return a + b;
}
```

### ✅ Haz esto / ❌ Evita esto (5.8)

**✅ Haz esto: envuelve el punto de entrada y captura.**

```js
async function main() {
  try {
    await ejecutar();
  } catch (error) {
    console.error(error);
  }
}

main();
```

**❌ Evita esto: llamar a `main()` sin manejar su rechazo.**

```js
async function main() {
  await ejecutar();
}

main(); // si falla, unhandled rejection
```

**✅ Haz esto: usa `Promise.all` para independientes.**

```js
async function ejemplo() {
  const [a, b] = await Promise.all([tareaA(), tareaB()]);
}
```

**❌ Evita esto: esperar en serie sin dependencia.**

```js
async function ejemplo() {
  const a = await tareaA();
  const b = await tareaB();
}
```

**✅ Haz esto: usa `for...of` para secuencial.**

```js
async function ejemplo() {
  for (const item of items) {
    await procesar(item);
  }
}
```

**❌ Evita esto: `forEach` con `async`.**

```js
items.forEach(async (item) => {
  await procesar(item);
});
```

**✅ Haz esto: captura con `try/catch`.**

```js
async function ejemplo() {
  try {
    await operacion();
  } catch (error) {
    console.error(error);
  }
}
```

**❌ Evita esto: `catch` vacío.**

```js
async function ejemplo() {
  try {
    await operacion();
  } catch (error) {}
}
```

**✅ Haz esto: usa `return await` si capturas localmente.**

```js
async function ejemplo() {
  try {
    return await operacion();
  } catch (error) {
    return null;
  }
}
```

**❌ Evita esto: creer que `return promesa` dentro de `try` captura el rechazo.**

```js
async function ejemplo() {
  try {
    return operacion(); // el catch no lo captura
  } catch (error) {
    return null;
  }
}
```

---

## 5.9 — Errores: `throw`, `try/catch` y errores personalizados

### 5.9.1 `throw` en profundidad

`throw` interrumpe el flujo normal y lanza un valor. Ese valor puede ser cualquier cosa, pero **debería ser un `Error`**.

```js
function validarEdad(edad) {
  if (typeof edad !== "number") {
    throw new TypeError("La edad debe ser un número");
  }

  if (edad < 0) {
    throw new RangeError("La edad no puede ser negativa");
  }

  return edad;
}

console.log(validarEdad(30)); // 30
```

Cuando algo lanza, la ejecución **no continúa** en esa función. Sube por la pila de llamadas hasta encontrar un `try/catch` o hasta el nivel superior.

```js
function a() {
  throw new Error("fallo en a");
}

function b() {
  a();
  console.log("esto no se ejecuta");
}

function c() {
  b();
  console.log("esto tampoco");
}

try {
  c();
} catch (error) {
  console.log("capturado:", error.message);
}

// capturado: fallo en a
```

**No lances valores primitivos:**

```js
// ❌ Sin stack, sin tipo, sin información
throw "algo salió mal";
throw 404;
throw null;
```

```js
// ✅ Con stack y tipo
throw new Error("algo salió mal");
```

Si lanzas un primitivo, el `catch` lo recibe tal cual y pierdes la traza:

```js
try {
  throw "texto";
} catch (error) {
  console.log(typeof error); // "string"
  console.log(error.stack); // undefined
}
```

**`throw` vs `return`:**

| `return` | `throw` |
|---|---|
| Devuelve un valor normal | Señala una condición excepcional |
| El llamador decide si lo usa | El llamador debe capturarlo o propagarlo |
| No interrumpe la pila | Sube por la pila hasta un `catch` |

### 5.9.2 Tipos de error nativos

JavaScript incluye varios tipos de error. Todos heredan de `Error`.

| Tipo | Cuándo aparece | Ejemplo |
|---|---|---|
| `Error` | Error genérico | `throw new Error("fallo")` |
| `TypeError` | Valor de tipo incorrecto | `null.nombre`, `noEsFuncion()` |
| `RangeError` | Valor fuera de rango | `new Array(-1)`, recursión infinita |
| `ReferenceError` | Variable no definida | `console.log(noExiste)` |
| `SyntaxError` | Sintaxis inválida | Código mal escrito, `JSON.parse` (M7) |
| `URIError` | URI mal formada | `decodeURIComponent("%")` |
| `AggregateError` | Varios errores agrupados | `Promise.any` con todos rechazados |
| `EvalError` | Uso incorrecto de `eval` | Legado, casi nunca se usa |

```js
try {
  null.nombre;
} catch (error) {
  console.log(error.constructor.name); // TypeError
  console.log(error.message); // Cannot read properties of null...
}
```

```js
try {
  const numeros = new Array(-1);
} catch (error) {
  console.log(error.constructor.name); // RangeError
}
```

```js
try {
  console.log(variableQueNoExiste);
} catch (error) {
  console.log(error.constructor.name); // ReferenceError
}
```

**Todos son `instanceof Error`:**

```js
const errores = [
  new Error("x"),
  new TypeError("x"),
  new RangeError("x"),
  new ReferenceError("x"),
];

for (const error of errores) {
  console.log(error.name, error instanceof Error);
}

// Error true
// TypeError true
// RangeError true
// ReferenceError true
```

> 📌 `error.name` es el nombre del tipo. `error.message` es la descripción. `error.stack` es la traza (no estándar, pero ampliamente disponible).

### 5.9.3 `try/catch/finally`

Estructura completa:

```js
try {
  // código que puede lanzar
} catch (error) {
  // manejo del error
} finally {
  // limpieza: se ejecuta siempre
}
```

**`finally` se ejecuta incluso si hay `return`:**

```js
function ejemplo() {
  try {
    return "resultado";
  } finally {
    console.log("finally");
  }
}

console.log(ejemplo());

// finally
// resultado
```

**`finally` se ejecuta incluso si hay `throw`:**

```js
function ejemplo() {
  try {
    throw new Error("fallo");
  } finally {
    console.log("finally");
  }
}

try {
  ejemplo();
} catch (error) {
  console.log("catch externo:", error.message);
}

// finally
// catch externo: fallo
```

**`catch` sin variable (ES2019):**

Si no necesitas el error, puedes omitir la variable:

```js
try {
  operacion();
} catch {
  console.log("algo falló");
}
```

> ⚠️ Omitir la variable no significa ignorar el error. Si no puedes hacer nada útil, al menos regístralo.

**`finally` que sobrescribe el resultado:**

```js
function ejemplo() {
  try {
    return "try";
  } finally {
    return "finally";
  }
}

console.log(ejemplo()); // "finally"
```

```js
function ejemplo() {
  try {
    throw new Error("original");
  } finally {
    throw new Error("nuevo");
  }
}

try {
  ejemplo();
} catch (error) {
  console.log(error.message); // "nuevo"
}
```

**Regla:** no uses `return` ni `throw` en `finally` salvo que sea intencional. El `finally` debe limpiar, no cambiar el resultado.

**`finally` con recursos:** el patrón básico de limpieza.

```js
function conRecurso(recurso, tarea) {
  try {
    return tarea(recurso);
  } finally {
    recurso.cerrar();
  }
}
```

### 5.9.4 Errores personalizados

Para errores de dominio (validación, negocio, red) conviene crear clases propias. Así puedes distinguirlos con `instanceof` y añadir propiedades.

```js
class ErrorValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
    this.campo = campo;
  }
}

const error = new ErrorValidacion("email", "El email no es válido");

console.log(error.name); // "ErrorValidacion"
console.log(error.message); // "El email no es válido"
console.log(error.campo); // "email"
console.log(error instanceof ErrorValidacion); // true
console.log(error instanceof Error); // true
```

Uso:

```js
function validarUsuario(usuario) {
  if (!usuario.email) {
    throw new ErrorValidacion("email", "El email es obligatorio");
  }

  if (!usuario.email.includes("@")) {
    throw new ErrorValidacion("email", "El email no es válido");
  }

  return true;
}

try {
  validarUsuario({ email: "ana" });
} catch (error) {
  if (error instanceof ErrorValidacion) {
    console.log("Campo:", error.campo);
    console.log("Mensaje:", error.message);
  } else {
    throw error; // no es un error que sepamos manejar
  }
}

// Campo: email
// Mensaje: El email no es válido
```

**Detalles importantes:**

1. `extends Error` es necesario para heredar `message`, `stack` e `instanceof Error`.
2. `super(mensaje)` llama al constructor de `Error`.
3. `this.name` debe asignarse explícitamente; por defecto sería `"Error"`.
4. Puedes añadir propiedades propias (`campo`, `codigo`, `status`).
5. No olvides `return` después de lanzar si estás en un bloque que podría seguir.

**Jerarquía de errores:**

```js
class ErrorApp extends Error {
  constructor(mensaje, options) {
    super(mensaje, options);
    this.name = "ErrorApp";
  }
}

class ErrorRed extends ErrorApp {
  constructor(mensaje, options) {
    super(mensaje, options);
    this.name = "ErrorRed";
  }
}

class ErrorTimeout extends ErrorRed {
  constructor(mensaje, options) {
    super(mensaje, options);
    this.name = "ErrorTimeout";
  }
}

const error = new ErrorTimeout("La petición tardó demasiado");

console.log(error instanceof ErrorTimeout); // true
console.log(error instanceof ErrorRed); // true
console.log(error instanceof ErrorApp); // true
console.log(error instanceof Error); // true
```

Esto permite capturar por categoría:

```js
async function ejemplo() {
  try {
    await operacion();
  } catch (error) {
    if (error instanceof ErrorTimeout) {
      console.log("Reintentar más tarde");
    } else if (error instanceof ErrorRed) {
      console.log("Problema de conexión");
    } else {
      throw error;
    }
  }
}
```

**`Error.captureStackTrace` (solo Node):**

Por defecto, la traza incluye el constructor del error. Puedes ocultarlo:

```js
class ErrorValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
    this.campo = campo;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorValidacion);
    }
  }
}
```

> 📌 `Error.captureStackTrace` es específico de V8/Node. En el navegador no existe; el `if` evita el error.

### 5.9.5 `cause`: conservar el error original

Cuando envuelves un error en otro, puedes conservar el original con la opción `cause`.

```js
function cargarUsuario(id) {
  try {
    throw new Error("conexión rechazada");
  } catch (error) {
    throw new Error("No se pudo cargar el usuario " + id, { cause: error });
  }
}

try {
  cargarUsuario(1);
} catch (error) {
  console.log(error.message); // "No se pudo cargar el usuario 1"
  console.log(error.cause.message); // "conexión rechazada"
}
```

Sin `cause`, perderías el error original:

```js
// ❌ Se pierde la causa
try {
  operacion();
} catch (error) {
  throw new Error("Falló la operación");
}
```

```js
// ✅ Se conserva
try {
  operacion();
} catch (error) {
  throw new Error("Falló la operación", { cause: error });
}
```

`cause` es especialmente útil en capas:

```js
class ErrorCapa extends Error {
  constructor(mensaje, causa) {
    super(mensaje, { cause: causa });
    this.name = "ErrorCapa";
  }
}

try {
  try {
    throw new Error("error de bajo nivel");
  } catch (error) {
    throw new ErrorCapa("error de alto nivel", error);
  }
} catch (error) {
  console.log(error.message);
  console.log(error.cause.message);
}
```

> 📌 `cause` es ES2022. Node 16.9+ y navegadores modernos lo soportan. Si trabajas con entornos antiguos, guarda la causa en una propiedad propia.

### 5.9.6 `AggregateError`

`AggregateError` agrupa varios errores en uno. Es el tipo que usa `Promise.any` cuando todas las promesas fallan.

```js
const error = new AggregateError(
  [new Error("fallo 1"), new Error("fallo 2")],
  "Varias operaciones fallaron"
);

console.log(error.name); // "AggregateError"
console.log(error.message); // "Varias operaciones fallaron"
console.log(error.errors.length); // 2
console.log(error.errors[0].message); // "fallo 1"
console.log(error instanceof Error); // true
```

Uso típico: ejecutar varias operaciones y reportar todos los fallos juntos.

```js
function validarTodo(usuarios) {
  const errores = [];

  usuarios.forEach((usuario, indice) => {
    if (!usuario.email) {
      errores.push(new Error(`Usuario ${indice}: falta email`));
    }
  });

  if (errores.length > 0) {
    throw new AggregateError(errores, "Hay usuarios inválidos");
  }

  return true;
}

try {
  validarTodo([{ email: "a@b.com" }, {}, {}]);
} catch (error) {
  if (error instanceof AggregateError) {
    error.errors.forEach((e) => console.log(e.message));
  }
}

// Usuario 1: falta email
// Usuario 2: falta email
```

### 5.9.7 Errores asíncronos: dónde se pierden

Los errores asíncronos no siguen la pila normal. Un `try/catch` solo captura lo que ocurre **dentro** de su ejecución síncrona o de un `await`.

**Caso 1: `throw` dentro de un timer.**

```js
try {
  setTimeout(() => {
    throw new Error("error en timer");
  }, 10);
} catch (error) {
  console.log("no se ejecuta");
}

// Error no capturado: error en timer
```

El `try` ya terminó cuando el timer se ejecuta. El error va al nivel superior.

**Solución:** envuelve el timer en una promesa y usa `await` o `.catch`.

```js
function esperarYFallar(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error("error en timer"));
    }, ms);
  });
}

async function main() {
  try {
    await esperarYFallar(10);
  } catch (error) {
    console.log("capturado:", error.message);
  }
}

main();
```

**Caso 2: `throw` dentro de un callback de evento (navegador).**

```js
// Vista previa de Módulo 6
// boton.addEventListener("click", () => {
//   throw new Error("error en el handler");
// });
```

El `try/catch` que rodea `addEventListener` no captura el error del handler, porque el handler se ejecuta mucho después.

**Caso 3: promesa rechazada sin `catch`.**

```js
// ❌ Rechazo no manejado
Promise.reject(new Error("sin catch"));
```

**Caso 4: `async` sin `await`.**

```js
async function fallar() {
  throw new Error("fallo");
}

// ❌ La promesa rechazada se ignora
fallar();
```

**Caso 5: `forEach` con `async`.**

```js
// ❌ Los errores de los callbacks no se propagan al exterior
[1, 2, 3].forEach(async (n) => {
  if (n === 2) throw new Error("fallo en " + n);
});
```

**Caso 6: error dentro de `finally`.**

```js
Promise.resolve("ok")
  .finally(() => {
    throw new Error("fallo en finally");
  })
  .catch((error) => {
    console.log("catch:", error.message);
  });

// catch: fallo en finally
```

**Regla general:**

> Todo error asíncrono debe terminar en un `catch`, en un `try/catch` con `await`, o en un manejador global. Si no, se pierde (o tumba el proceso).

### 5.9.8 No tragar errores

Un `catch` vacío es una de las peores prácticas. El error desaparece y el bug se vuelve invisible.

```js
// ❌ El error se pierde
try {
  guardarDatos();
} catch (error) {}
```

**Qué hacer en su lugar:**

1. **Manejar y recuperar** si sabes cómo.
2. **Registrar con contexto** si no puedes recuperar.
3. **Relanzar** si no es tu responsabilidad.
4. **Convertir** en un error de dominio si estás en una capa.

```js
// ✅ Registrar con contexto
try {
  guardarDatos(usuario);
} catch (error) {
  console.error("No se pudo guardar el usuario", {
    usuarioId: usuario.id,
    error,
  });
  throw error; // que decida la capa superior
}
```

```js
// ✅ Recuperar con un valor de respaldo
async function cargar() {
  try {
    return await cargarConfiguracion();
  } catch (error) {
    console.error("Usando configuración por defecto", error);
    return configuracionPorDefecto;
  }
}
```

```js
async function ejemplo() {
  // ✅ Convertir en error de dominio
  try {
    await guardarEnBaseDeDatos(datos);
  } catch (error) {
    throw new Error("No se pudo guardar", { cause: error });
  }
}
```

**No registres datos sensibles:** contraseñas, tokens, números de tarjeta. Registra identificadores y mensajes, no el objeto completo si puede contener secretos.

```js
// ❌ Puede filtrar la contraseña
console.error("Falló el login", usuario);

// ✅ Solo lo necesario
console.error("Falló el login", { usuarioId: usuario.id });
```

### 5.9.9 Patrones de recuperación

**1. Valor de respaldo (fallback).**

```js
async function cargarTema() {
  try {
    return await obtenerTemaDelServidor();
  } catch (error) {
    console.error("Usando tema por defecto");
    return "claro";
  }
}
```

**2. Reintento.**

```js
async function conReintentos(fn, max) {
  let ultimoError;

  for (let intento = 1; intento <= max; intento++) {
    try {
      return await fn();
    } catch (error) {
      ultimoError = error;
      console.warn(`Intento ${intento} falló:`, error.message);
    }
  }

  throw ultimoError;
}
```

**3. Degradación gradual.**

```js
async function cargarPerfil(id) {
  try {
    return await cargarPerfilCompleto(id);
  } catch (error) {
    console.warn("Perfil completo no disponible, usando versión mínima");
    return await cargarPerfilMinimo(id);
  }
}
```

**4. Fallar rápido.**

Si el error es irrecuperable, no lo ocultes: falla y avisa.

```js
function validarConfiguracion(config) {
  if (!config.apiUrl) {
    throw new Error("Falta apiUrl en la configuración");
  }
  return config;
}
```

**5. Circuit breaker (concepto).**

Si un servicio falla repetidamente, deja de llamarlo durante un tiempo para no empeorar la situación. Lo implementamos en 5.11.9.

### 5.9.10 `error.stack` y depuración

`error.stack` es una cadena con la traza de llamadas. No forma parte del estándar, pero V8, SpiderMonkey y JavaScriptCore la incluyen.

```js
function nivel3() {
  throw new Error("fallo");
}

function nivel2() {
  nivel3();
}

function nivel1() {
  nivel2();
}

try {
  nivel1();
} catch (error) {
  console.log(error.stack);
}

// Error: fallo
//     at nivel3 (...)
//     at nivel2 (...)
//     at nivel1 (...)
//     at ...
```

**Buenas prácticas:**

- Registra `error.stack` en el servidor, no en la interfaz de usuario.
- No muestres stacks al usuario: revelan rutas y detalles internos.
- Usa `error.message` para el usuario y `error.stack` para el desarrollador.
- En Node, `Error.captureStackTrace` permite recortar la traza.

```js
async function ejemplo() {
  // ✅ Mensaje para el usuario, stack para el log
  try {
    await procesarPago(pago);
  } catch (error) {
    mostrarAlUsuario("No se pudo procesar el pago");
    console.error("Error de pago", {
      pagoId: pago.id,
      stack: error.stack,
    });
  }
}
```

### ✅ Haz esto / ❌ Evita esto (5.9)

**✅ Haz esto: lanza `Error` con mensaje claro.**

```js
throw new Error("No se pudo conectar con el servidor");
```

**❌ Evita esto: lanzar strings.**

```js
throw "No se pudo conectar";
```

**✅ Haz esto: usa errores personalizados para el dominio.**

```js
throw new ErrorValidacion("email", "Email inválido");
```

**❌ Evita esto: un solo `Error` para todo.**

```js
throw new Error("algo falló");
```

**✅ Haz esto: conserva la causa.**

```js
throw new Error("No se pudo guardar", { cause: error });
```

**❌ Evita esto: perder el error original.**

```js
try {
  operacion();
} catch (error) {
  throw new Error("Falló");
}
```

**✅ Haz esto: registra con contexto.**

```js
console.error("Error al guardar", { usuarioId, error });
```

**❌ Evita esto: `catch` vacío.**

```js
try { guardar(); } catch (error) {}
```

**✅ Haz esto: captura errores asíncronos con `await`.**

```js
async function ejemplo() {
  try {
    await operacion();
  } catch (error) {
    console.error(error);
  }
}
```

**❌ Evita esto: confiar en un `try/catch` externo para un timer.**

```js
try {
  setTimeout(() => { throw new Error("x"); }, 10);
} catch (error) {
  // nunca se ejecuta
}
```

**✅ Haz esto: limpia en `finally`.**

```js
async function ejemplo() {
  try {
    await tarea();
  } finally {
    cerrarRecurso();
  }
}
```

**❌ Evita esto: cambiar el resultado en `finally`.**

```js
try {
  return "try";
} finally {
  return "finally"; // lo sobrescribe
}
```

---

## 5.10 — Microtareas vs macrotareas

### 5.10.1 Definiciones

| Concepto | Qué es | Ejemplos |
|---|---|---|
| **Macrotarea** (task) | Trabajo que el Event Loop toma de una cola | `setTimeout`, `setInterval`, eventos, I/O |
| **Microtarea** | Trabajo que se ejecuta antes de la siguiente macrotarea | callbacks de promesas, `queueMicrotask`, `await` |

La diferencia práctica:

- Las macrotareas se ejecutan **una por vuelta** del Event Loop.
- Las microtareas se ejecutan **todas** después de cada macrotarea (y después del código síncrono), antes de la siguiente macrotarea.

```text
Vuelta del Event Loop:
  1. Toma una macrotarea.
  2. Ejecútala.
  3. Vacía la cola de microtareas (incluidas las nuevas).
  4. Renderiza si toca.
  5. Siguiente vuelta.
```

### 5.10.2 El orden canónico

```js
console.log("1: síncrono");

setTimeout(() => {
  console.log("5: macrotarea");
}, 0);

Promise.resolve().then(() => {
  console.log("3: microtarea");
});

queueMicrotask(() => {
  console.log("4: microtarea");
});

console.log("2: síncrono");

// 1: síncrono
// 2: síncrono
// 3: microtarea
// 4: microtarea
// 5: macrotarea
```

**Regla mnemotécnica:**

> Primero lo síncrono, luego **todas** las microtareas, luego **una** macrotarea, y se repite.

### 5.10.3 `queueMicrotask`

`queueMicrotask(fn)` encola una función en la Microtask Queue. Es la forma explícita de crear una microtarea sin una promesa.

```js
console.log("antes");

queueMicrotask(() => {
  console.log("microtarea");
});

console.log("después");

// antes
// después
// microtarea
```

**¿Cuándo usarlo?**

- Para diferir código hasta después del turno actual, sin pasar por un timer.
- Para garantizar que una actualización ocurra después de que el código actual termine.
- Para evitar el coste de `setTimeout(fn, 0)`.

```js
// ✅ Se ejecuta antes que cualquier timer
queueMicrotask(() => console.log("micro"));
setTimeout(() => console.log("timer"), 0);

// micro
// timer
```

**Cuidado con los errores:** si una microtarea lanza, el error no lo captura un `try/catch` externo.

```js
// ❌ El catch no captura el error de la microtarea
try {
  queueMicrotask(() => {
    throw new Error("fallo en microtarea");
  });
} catch (error) {
  console.log("no se ejecuta");
}
```

La microtarea se ejecuta después de que el `try` termine. El error va al nivel superior.

### 5.10.4 Las promesas son microtareas

Cada callback de `.then`, `.catch` y `.finally` se ejecuta como microtarea.

```js
console.log("1");

Promise.resolve().then(() => console.log("3"));
Promise.resolve().then(() => console.log("4"));

console.log("2");

// 1
// 2
// 3
// 4
```

Se ejecutan en el orden en que fueron registradas, después del código síncrono.

**Incluso si la promesa ya está resuelta:**

```js
console.log("antes");

Promise.resolve("ya").then(() => console.log("después"));

console.log("fin");

// antes
// fin
// después
```

**Incluso si el `then` se registra después de resolver:**

```js
const promesa = Promise.resolve("valor");

setTimeout(() => {
  promesa.then((valor) => console.log("then tardío:", valor));
  console.log("timer");
}, 0);

// timer
// then tardío: valor
```

El `then` siempre se encola como microtarea, aunque la promesa ya esté resuelta.

### 5.10.5 `await` y microtareas

`await` suspende la función async y programa su continuación como microtarea.

```js
async function a() {
  console.log("a1");
  await null;
  console.log("a2");
}

a();
Promise.resolve().then(() => console.log("p"));
console.log("síncrono");

// a1
// síncrono
// a2
// p
```

Orden:

1. `a()` ejecuta `a1`.
2. `await null` suspende `a` y encola su continuación (`a2`).
3. Se registra el `then` (`p`).
4. Se ejecuta el código síncrono.
5. Se vacía la Microtask Queue: `a2`, luego `p`.

**Cada `await` añade una microtarea.** Esto importa en bucles grandes:

```js
async function procesar(items) {
  for (const item of items) {
    await null; // una microtarea por iteración
    console.log(item);
  }
}
```

No es un problema para cientos de elementos, pero puede serlo para millones. En ese caso, procesa por lotes o usa bucles síncronos.

### 5.10.6 Inanición de microtareas

Si una microtarea crea otra microtarea indefinidamente, la cola nunca se vacía y las macrotareas no se ejecutan.

```js
// ⚠️ NO ejecutes esto: congela el proceso
function repetir() {
  Promise.resolve().then(repetir);
}
// repetir();
```

El navegador no renderiza; Node no atiende timers ni I/O. Es equivalente a un bucle infinito, pero más difícil de detectar.

```js
// ⚠️ Tampoco ejecutes esto
function repetir() {
  queueMicrotask(repetir);
}
// repetir();
```

**Regla:** una microtarea debe terminar. Si necesitas repetir trabajo en el tiempo, usa `setTimeout` o `requestAnimationFrame`.

### 5.10.7 Ejemplos de entrevista

**Ejemplo 1:**

```js
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");

// A
// D
// C
// B
```

**Ejemplo 2:**

```js
setTimeout(() => {
  console.log("timeout 1");
  Promise.resolve().then(() => console.log("micro dentro de timeout"));
}, 0);

setTimeout(() => console.log("timeout 2"), 0);

// timeout 1
// micro dentro de timeout
// timeout 2
```

La microtarea creada dentro de `timeout 1` se ejecuta **antes** de `timeout 2`, porque las microtareas se vacían después de cada macrotarea.

**Ejemplo 3:**

```js
Promise.resolve()
  .then(() => console.log("then 1"))
  .then(() => console.log("then 2"));

Promise.resolve()
  .then(() => console.log("then 3"))
  .then(() => console.log("then 4"));

// then 1
// then 3
// then 2
// then 4
```

Las cadenas avanzan por turnos: primero los primeros `then` de cada cadena, luego los segundos.

**Ejemplo 4:**

```js
async function uno() {
  console.log("uno 1");
  await dos();
  console.log("uno 2");
}

async function dos() {
  console.log("dos");
}

uno();
console.log("síncrono");

// uno 1
// dos
// síncrono
// uno 2
```

`dos()` se ejecuta hasta su primer `await` (no tiene), devuelve una promesa resuelta; `await` suspende `uno` y su continuación va a la cola de microtareas.

### 5.10.8 Por qué importa en la práctica

**1. Actualizaciones de UI por lotes.**

Si actualizas el DOM varias veces, el navegador no repinta en cada cambio. Las microtareas permiten agrupar lógica antes del repintado. Lo verás en el Módulo 6.

**2. Orden de inicialización.**

Si una librería usa `Promise.resolve().then(init)`, su inicialización ocurre después del código actual pero antes de los timers.

**3. Tests.**

Un test que espera un timer puede fallar si la lógica real ocurre en una microtarea. Conocer el orden evita `sleep` innecesarios.

**4. Depuración.**

Un `console.log` dentro de un `then` aparece después de todo el código síncrono, aunque esté escrito antes. Saber esto evita confusiones.

### ✅ Haz esto / ❌ Evita esto (5.10)

**✅ Haz esto: usa `queueMicrotask` para diferir sin timer.**

```js
queueMicrotask(() => actualizarEstado());
```

**❌ Evita esto: usar `setTimeout(fn, 0)` solo para diferir.**

```js
setTimeout(() => actualizarEstado(), 0); // pasa por la cola de macrotareas
```

**✅ Haz esto: recuerda que `then` es microtarea.**

```js
console.log("A");
Promise.resolve().then(() => console.log("C"));
console.log("B"); // A, B, C
```

**❌ Evita esto: asumir que `then` se ejecuta antes del código síncrono.**

```js
let listo = false;
Promise.resolve().then(() => { listo = true; });
console.log(listo); // false
```

**✅ Haz esto: vacía las microtareas antes de medir.**

```js
async function ejemplo() {
  let listo = false;
  Promise.resolve().then(() => { listo = true; });

  await Promise.resolve(); // deja correr las microtareas pendientes
  console.log(listo); // true
}
```

**❌ Evita esto: crear microtareas recursivas.**

```js
function repetir() {
  Promise.resolve().then(repetir);
}
```

---

## 5.11 — Patrones de concurrencia

### 5.11.1 Secuencial vs paralelo

Ya lo vimos en 5.8.7. Lo resumimos porque es la base de todos los patrones.

```js
async function ejemplo() {
  // Secuencial: una tras otra
  const a = await tareaA();
  const b = await tareaB();
  const c = await tareaC();

  // Paralelo: todas a la vez
  const [x, y, z] = await Promise.all([tareaA(), tareaB(), tareaC()]);

  return { a, b, c, x, y, z };
}
```

**Regla:** paralelo solo si las tareas son independientes. Si una necesita el resultado de otra, secuencial.

```js
async function ejemplo() {
  // ✅ Dependencia: el usuario primero
  const usuario = await obtenerUsuario(1);
  const pedidos = await obtenerPedidos(usuario.id);

  // ✅ Independencia: en paralelo
  const [perfil, configuracion] = await Promise.all([
    obtenerUsuario(1),
    obtenerConfiguracion(),
  ]);

  return { usuario, pedidos, perfil, configuracion };
}
```

### 5.11.2 Limitar la concurrencia

Lanzar 1.000 peticiones a la vez puede saturar la red, el servidor o la memoria. Un **límite de concurrencia** ejecuta como máximo N tareas simultáneas.

```js
function crearLimite(max) {
  const pendientes = [];
  let activas = 0;

  function siguiente() {
    if (activas >= max || pendientes.length === 0) return;

    const { tarea, resolve, reject } = pendientes.shift();
    activas++;

    Promise.resolve()
      .then(tarea)
      .then(resolve, reject)
      .finally(() => {
        activas--;
        siguiente();
      });
  }

  return function ejecutar(tarea) {
    return new Promise((resolve, reject) => {
      pendientes.push({ tarea, resolve, reject });
      siguiente();
    });
  };
}
```

Uso:

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

async function main() {
  const limite = crearLimite(2);

  const tareas = [1, 2, 3, 4].map((n) => {
    return () => {
      console.log("inicio", n);
      return esperar(10 * n, n * 10).then((valor) => {
        console.log("fin", n);
        return valor;
      });
    };
  });

  const resultados = await Promise.all(tareas.map(limite));
  console.log(resultados);
}

main();

// inicio 1
// inicio 2
// fin 2
// inicio 3
// fin 1
// inicio 4
// fin 3
// fin 4
// [10, 20, 30, 40]
```

Visualmente:

```text
max = 2

tiempo →
tarea 1: [====]
tarea 2: [==]
tarea 3:      [===]
tarea 4:          [=]
```

**Detalles de implementación:**

- `activas` cuenta las tareas en curso.
- `pendientes` es una cola FIFO.
- `siguiente()` arranca tareas mientras haya hueco.
- `finally` libera el hueco y arranca la siguiente.
- `Promise.resolve().then(tarea)` normaliza tareas síncronas y asíncronas.

**Alternativa con `Promise.all` por lotes:**

```js
async function porLotes(items, tamano, fn) {
  const resultados = [];

  for (let i = 0; i < items.length; i += tamano) {
    const lote = items.slice(i, i + tamano);
    const resultadosLote = await Promise.all(lote.map(fn));
    resultados.push(...resultadosLote);
  }

  return resultados;
}
```

La diferencia: `porLotes` espera a que termine **todo** el lote antes de empezar el siguiente. `crearLimite` arranca una nueva tarea en cuanto hay un hueco. El límite dinámico es más eficiente si las tareas tienen duraciones distintas.

### 5.11.3 Reintentos con backoff exponencial

Cuando una operación falla por una causa temporal (red, servidor ocupado), reintentar puede ayudar. Pero reintentar inmediatamente y sin límite empeora el problema.

**Backoff exponencial:** espera cada vez más entre intentos.

```js
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function conReintentos(fn, opciones = {}) {
  const {
    max = 3,
    base = 100,
    maxEspera = 5000,
  } = opciones;

  let ultimoError;

  for (let intento = 1; intento <= max; intento++) {
    try {
      return await fn();
    } catch (error) {
      ultimoError = error;

      if (intento === max) break;

      const espera = Math.min(base * 2 ** (intento - 1), maxEspera);
      console.warn(`Intento ${intento} falló. Reintentando en ${espera} ms`);
      await esperar(espera);
    }
  }

  throw ultimoError;
}
```

Uso:

```js
let intentos = 0;

async function inestable() {
  intentos++;

  if (intentos < 3) {
    throw new Error("fallo temporal " + intentos);
  }

  return "éxito";
}

conReintentos(inestable, { max: 5, base: 10 })
  .then((resultado) => console.log(resultado))
  .catch((error) => console.error(error.message));

// Intento 1 falló. Reintentando en 10 ms
// Intento 2 falló. Reintentando en 20 ms
// éxito
```

**Jitter:** añadir aleatoriedad evita que muchos clientes reintenten al mismo tiempo (efecto estampida).

```js
function esperaConJitter(base, intento) {
  const exponencial = base * 2 ** (intento - 1);
  const jitter = Math.random() * exponencial * 0.5;
  return Math.min(exponencial + jitter, 5000);
}
```

**Cuándo reintentar:**

- Errores de red transitorios.
- Timeouts.
- Respuestas 5xx (servidor).
- Bloqueos temporales.

**Cuándo NO reintentar:**

- Errores de validación (4xx).
- Errores de programación (`TypeError`).
- Operaciones no idempotentes sin protección (cobrar dos veces).
- Después de agotar el límite.

> 📌 Una operación **idempotente** puede repetirse sin cambiar el resultado. Un `GET` suele serlo; un `POST` que crea un pedido no. Si reintentas un `POST`, usa una clave de idempotencia.

### 5.11.4 Timeout

Un timeout evita esperar indefinidamente. Se implementa con `Promise.race`.

```js
function conTimeout(promesa, ms) {
  const limite = new Promise((resolve, reject) => {
    const id = setTimeout(() => {
      reject(new Error(`Timeout de ${ms} ms`));
    }, ms);

    // Limpieza: si la promesa termina antes, cancelamos el timer
    promesa.then(
      () => clearTimeout(id),
      () => clearTimeout(id)
    );
  });

  return Promise.race([promesa, limite]);
}
```

Uso:

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

async function main() {
  try {
    const resultado = await conTimeout(esperar(100, "datos"), 20);
    console.log(resultado);
  } catch (error) {
    console.log(error.message); // "Timeout de 20 ms"
  }

  const rapido = await conTimeout(esperar(5, "rápido"), 50);
  console.log(rapido); // "rápido"
}

main();
```

**Importante:** `Promise.race` no cancela la promesa perdedora. La operación lenta sigue ejecutándose en segundo plano. Para cancelarla de verdad necesitas un mecanismo de cancelación (5.11.5).

```js
async function ejemplo() {
  // ⚠️ La petición sigue viva aunque el timeout gane
  await conTimeout(peticionLenta(), 1000);
}
```

**Timeout con limpieza del timer:**

Si no limpias el timer, puede quedar vivo hasta que se cumpla, manteniendo el proceso de Node abierto o consumiendo recursos.

```js
// ✅ Limpia el timer cuando la promesa termina
function conTimeout(promesa, ms) {
  let id;

  const limite = new Promise((resolve, reject) => {
    id = setTimeout(() => reject(new Error("Timeout")), ms);
  });

  return Promise.race([promesa, limite]).finally(() => clearTimeout(id));
}
```

> 📌 En el Módulo 7 verás `AbortSignal.timeout(ms)`, que combina timeout y cancelación en una sola API para `fetch`.

### 5.11.5 Cancelación

Las promesas **no se pueden cancelar** de forma nativa. Puedes simularlo con un **token de cancelación**.

```js
function crearToken() {
  let cancelado = false;
  const callbacks = [];

  return {
    get cancelado() {
      return cancelado;
    },

    alCancelar(fn) {
      if (cancelado) {
        fn();
        return;
      }
      callbacks.push(fn);
    },

    cancelar() {
      if (cancelado) return;
      cancelado = true;

      for (const fn of callbacks) {
        fn();
      }

      callbacks.length = 0;
    },
  };
}
```

Uso con un timer:

```js
function esperarCancelable(ms, token) {
  return new Promise((resolve, reject) => {
    if (token.cancelado) {
      reject(new Error("Cancelado antes de empezar"));
      return;
    }

    const id = setTimeout(() => {
      resolve("completado");
    }, ms);

    token.alCancelar(() => {
      clearTimeout(id);
      reject(new Error("Cancelado"));
    });
  });
}

async function main() {
  const token = crearToken();

  setTimeout(() => token.cancelar(), 10);

  try {
    const resultado = await esperarCancelable(50, token);
    console.log(resultado);
  } catch (error) {
    console.log(error.message); // "Cancelado"
  }
}

main();
```

**Patrón de cancelación en operaciones reales:**

1. Comprueba `token.cancelado` antes de empezar.
2. Registra una limpieza con `token.alCancelar`.
3. En la limpieza, cancela timers, peticiones o suscripciones.
4. Rechaza con un error de cancelación.

**`AbortController` (vista previa de Módulo 7):**

El estándar moderno para cancelar operaciones es `AbortController` y su `AbortSignal`.

```js
// Vista previa: se usa con fetch en el Módulo 7
// const controller = new AbortController();
// fetch(url, { signal: controller.signal });
// controller.abort();
```

`AbortController` funciona con `fetch`, `addEventListener` y varias APIs modernas. Aquí solo lo mencionamos; el token manual te ayuda a entender el concepto.

### 5.11.6 Deduplicación de peticiones en vuelo

Si varios componentes piden lo mismo al mismo tiempo, puedes reutilizar la misma promesa en lugar de lanzar varias peticiones.

```js
function crearDeduplicador(fn) {
  const enVuelo = new Map();

  return function (clave, ...args) {
    if (enVuelo.has(clave)) {
      return enVuelo.get(clave);
    }

    const promesa = Promise.resolve()
      .then(() => fn(clave, ...args))
      .finally(() => {
        enVuelo.delete(clave);
      });

    enVuelo.set(clave, promesa);
    return promesa;
  };
}
```

Uso:

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

const cargarUsuario = crearDeduplicador(async (id) => {
  console.log("petición real para", id);
  await esperar(20);
  return { id, nombre: "Ana" };
});

async function main() {
  const [a, b] = await Promise.all([
    cargarUsuario(1),
    cargarUsuario(1),
  ]);

  console.log(a === b); // true: misma promesa, mismo objeto

  await cargarUsuario(1); // nueva petición, ya se liberó
}

main();

// petición real para 1
// true
// petición real para 1
```

**Detalles:**

- La clave debe identificar la petición (URL, id, combinación de filtros).
- La entrada se elimina cuando la promesa termina, para permitir refrescar.
- Si la promesa rechaza, también se elimina; el siguiente intento puede reintentar.
- No dedupliques peticiones con efectos secundarios (POST) salvo que sepas lo que haces.

**Variante con caché temporal:**

```js
function crearCache(fn, ttl) {
  const cache = new Map();

  return function (clave, ...args) {
    const ahora = Date.now();
    const entrada = cache.get(clave);

    if (entrada && ahora - entrada.tiempo < ttl) {
      return Promise.resolve(entrada.valor);
    }

    return Promise.resolve()
      .then(() => fn(clave, ...args))
      .then((valor) => {
        cache.set(clave, { valor, tiempo: ahora });
        return valor;
      });
  };
}
```

> 📌 Una caché con TTL (time to live) caduca después de un tiempo. Es diferente de la deduplicación, que solo comparte peticiones **en vuelo**.

### 5.11.7 Cola de tareas

Una cola ejecuta tareas en orden, una tras otra, aunque se encolen en momentos distintos. Es útil para operaciones que no deben solaparse (escrituras, migraciones, impresión).

```js
function crearCola() {
  let cola = Promise.resolve();

  return function encolar(tarea) {
    const resultado = cola.then(tarea);
    // Evita que un rechazo rompa la cola para siempre
    cola = resultado.catch(() => {});
    return resultado;
  };
}
```

Uso:

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

const encolar = crearCola();

encolar(() => esperar(30, "A")).then((v) => console.log(v));
encolar(() => esperar(10, "B")).then((v) => console.log(v));
encolar(() => esperar(5, "C")).then((v) => console.log(v));

// A (tras 30 ms)
// B (tras 40 ms)
// C (tras 45 ms)
```

Aunque `B` y `C` son más rápidas, esperan su turno. La cola garantiza el orden.

**Manejo de errores en la cola:**

```js
const encolar = crearCola();

encolar(async () => {
  throw new Error("fallo en A");
}).catch((error) => console.error(error.message));

encolar(async () => {
  console.log("B se ejecuta igual");
});
```

Gracias a `cola = resultado.catch(() => {})`, un fallo en una tarea no impide las siguientes. El error se propaga al llamador de esa tarea, pero la cola interna sigue viva.

### 5.11.8 Límite de concurrencia con resultados ordenados

El patrón `crearLimite` de 5.11.2 devuelve los resultados en el orden en que se **completan**, no en el orden de entrada. Si necesitas el orden original, guarda los resultados por índice.

```js
async function limitarConOrden(tareas, max) {
  const resultados = new Array(tareas.length);
  let indice = 0;

  async function trabajador() {
    while (indice < tareas.length) {
      const i = indice++;
      resultados[i] = await tareas[i]();
    }
  }

  const trabajadores = Array.from(
    { length: Math.min(max, tareas.length) },
    () => trabajador()
  );

  await Promise.all(trabajadores);
  return resultados;
}
```

Uso:

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

async function main() {
  const tareas = [
    () => esperar(30, "A"),
    () => esperar(10, "B"),
    () => esperar(20, "C"),
  ];

  const resultados = await limitarConOrden(tareas, 2);
  console.log(resultados); // ["A", "B", "C"]
}

main();
```

**Diferencia con `crearLimite`:**

| `crearLimite` | `limitarConOrden` |
|---|---|
| Devuelve en orden de finalización | Devuelve en orden de entrada |
| Cada tarea es independiente | Los resultados se indexan |
| Más simple | Más útil para pipelines |

### 5.11.9 Circuit breaker

Un **circuit breaker** (interruptor de circuito) deja de llamar a un servicio que está fallando, para no saturarlo y para fallar rápido.

Estados:

- **Cerrado:** las llamadas pasan normalmente.
- **Abierto:** las llamadas fallan inmediatamente sin intentar.
- **Semiabierto:** tras un tiempo, se permite una llamada de prueba; si funciona, se cierra; si falla, se vuelve a abrir.

```js
function crearCircuito(fn, opciones = {}) {
  const { umbral = 3, espera = 1000 } = opciones;

  let fallos = 0;
  let abiertoHasta = 0;

  return async function (...args) {
    if (Date.now() < abiertoHasta) {
      throw new Error("Circuito abierto");
    }

    try {
      const resultado = await fn(...args);
      fallos = 0; // se recupera
      return resultado;
    } catch (error) {
      fallos++;

      if (fallos >= umbral) {
        abiertoHasta = Date.now() + espera;
        fallos = 0;
      }

      throw error;
    }
  };
}
```

Uso:

```js
let llamadas = 0;

const inestable = crearCircuito(async () => {
  llamadas++;

  if (llamadas <= 2) {
    throw new Error("fallo " + llamadas);
  }

  return "ok";
}, { umbral: 2, espera: 50 });

async function main() {
  for (let i = 1; i <= 4; i++) {
    try {
      console.log(i, await inestable());
    } catch (error) {
      console.log(i, error.message);
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 60));
  console.log("tras esperar:", await inestable());
}

main();

// 1 fallo 1
// 2 fallo 2
// 3 Circuito abierto
// 4 Circuito abierto
// tras esperar: ok
```

**Cuándo usarlo:**

- Dependencias externas que pueden caer.
- Servicios con latencia alta.
- Protección contra tormentas de reintentos.

**Cuándo no usarlo:**

- Errores de validación (no son fallos del servicio).
- Operaciones críticas que deben intentarse siempre.
- Sistemas donde un fallo rápido es peor que esperar.

### 5.11.10 Errores comunes en concurrencia

**Error 1: lanzar todo a la vez sin límite.**

```js
async function ejemplo() {
  // ❌ 10.000 peticiones simultáneas
  await Promise.all(urls.map((url) => peticion(url)));
}
```

```js
async function ejemplo() {
  // ✅ Con límite
  const limite = crearLimite(10);
  await Promise.all(urls.map((url) => limite(() => peticion(url))));
}
```

> 📌 `peticion` es una función ficticia que representa cualquier operación asíncrona. Las peticiones reales con `fetch` se verán en el Módulo 7.

**Error 2: reintentar errores no recuperables.**

```js
async function ejemplo() {
  // ❌ Reintentar un 400 no sirve
  await conReintentos(() => peticionConDatosInvalidos());
}
```

**Error 3: timeout sin cancelación.**

```js
async function ejemplo() {
  // ⚠️ La operación sigue viva
  await conTimeout(peticionLenta(), 1000);
}
```

**Error 4: deduplicar sin clave adecuada.**

```js
async function ejemplo() {
  // ❌ Distintos filtros comparten la misma promesa
  const cargar = crearDeduplicador(fn);
  await cargar("usuarios"); // sin filtro
  await cargar("usuarios"); // con otro filtro, pero misma clave
}
```

**Error 5: cola que se rompe con un rechazo.**

```js
// ❌ Un fallo impide las siguientes tareas
let cola = Promise.resolve();
function encolar(tarea) {
  cola = cola.then(tarea);
  return cola;
}
```

```js
// ✅ La cola sobrevive
function crearCola() {
  let cola = Promise.resolve();
  return (tarea) => {
    const resultado = cola.then(tarea);
    cola = resultado.catch(() => {});
    return resultado;
  };
}
```

**Error 6: olvidar limpiar timers de timeout.**

```js
// ❌ El timer sigue vivo
function conTimeout(promesa, ms) {
  return Promise.race([
    promesa,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms)),
  ]);
}
```

### ✅ Haz esto / ❌ Evita esto (5.11)

**✅ Haz esto: limita la concurrencia.**

```js
async function ejemplo() {
  const limite = crearLimite(5);
  await Promise.all(tareas.map((t) => limite(t)));
}
```

**❌ Evita esto: lanzar miles de operaciones a la vez.**

```js
async function ejemplo() {
  await Promise.all(tareas.map((t) => t()));
}
```

**✅ Haz esto: reintenta con backoff y límite.**

```js
async function ejemplo() {
  await conReintentos(operacion, { max: 3, base: 100 });
}
```

**❌ Evita esto: reintentar en un bucle infinito.**

```js
async function ejemplo() {
  while (true) {
    try { await operacion(); break; } catch (e) {}
  }
}
```

**✅ Haz esto: añade timeout.**

```js
async function ejemplo() {
  await conTimeout(operacion(), 5000);
}
```

**❌ Evita esto: esperar para siempre.**

```js
async function ejemplo() {
  await operacion(); // sin límite de tiempo
}
```

**✅ Haz esto: cancela lo que ya no necesitas.**

```js
token.cancelar();
```

**❌ Evita esto: dejar operaciones huérfanas.**

```js
setTimeout(() => token.cancelar(), 10);
// pero la operación original sigue viva
```

**✅ Haz esto: deduplica peticiones en vuelo.**

```js
async function ejemplo() {
  const usuario = await cargarUsuario(1);
}
```

**❌ Evita esto: lanzar la misma petición cinco veces.**

```js
async function ejemplo() {
  await Promise.all([
    cargarUsuario(1),
    cargarUsuario(1),
    cargarUsuario(1),
  ]);
}
```

**✅ Haz esto: usa una cola para orden.**

```js
encolar(() => guardarA());
encolar(() => guardarB());
```

**❌ Evita esto: asumir que las promesas se ejecutan en orden de llamada.**

```js
guardarA();
guardarB(); // no hay garantía de orden
```

---

## 5.12 — Retos con solución explicada

Once retos que cubren todo el módulo. El último es un capstone opcional. Intenta resolverlos **antes** de leer la solución. Cada uno indica qué conceptos pone a prueba.

---

### Reto 1 — Predicción del Event Loop

**Conceptos:** 5.2, 5.5, 5.8, 5.10.

Predice el orden exacto de los `console.log` **sin ejecutar** el código. Después compáralo con la solución.

```js
console.log("1");

setTimeout(() => {
  console.log("2");
  Promise.resolve().then(() => console.log("3"));
}, 0);

Promise.resolve()
  .then(() => {
    console.log("4");
    return Promise.resolve().then(() => console.log("5"));
  })
  .then(() => console.log("6"));

queueMicrotask(() => console.log("7"));

(async () => {
  console.log("8");
  await null;
  console.log("9");
})();

console.log("10");
```

**Pistas:**

- Separa el código en tres grupos: síncrono, microtareas y macrotareas.
- `await null` también programa una microtarea.
- El `then` que devuelve una promesa espera a que esa promesa termine.
- La microtarea creada dentro del `setTimeout` se ejecuta antes del siguiente timer.

#### Solución

Salida real en Node:

```text
1
8
10
4
7
9
5
6
2
3
```

**Línea por línea:**

| Paso | Qué ocurre | Cola después del paso |
|---|---|---|
| 1 | Se ejecuta `console.log("1")` | — |
| 2 | `setTimeout` registra la macrotarea `T` | Task: `[T]` |
| 3 | El primer `.then` registra la microtarea `M1` | Micro: `[M1]` |
| 4 | `queueMicrotask` registra `M2` | Micro: `[M1, M2]` |
| 5 | La IIFE async ejecuta `console.log("8")` | — |
| 6 | `await null` suspende la IIFE y registra `M3` | Micro: `[M1, M2, M3]` |
| 7 | Se ejecuta `console.log("10")`; termina lo síncrono | — |
| 8 | Se ejecuta `M1`: imprime `4` y devuelve una promesa que registra `M4` | Micro: `[M2, M3, M4]` |
| 9 | Se ejecuta `M2`: imprime `7` | Micro: `[M3, M4]` |
| 10 | Se ejecuta `M3`: imprime `9` | Micro: `[M4]` |
| 11 | Se ejecuta `M4`: imprime `5`; se resuelve la promesa devuelta por `M1` y se registra `M5` | Micro: `[M5]` |
| 12 | Se ejecuta `M5`: imprime `6` | Micro: vacía |
| 13 | Se ejecuta la macrotarea `T`: imprime `2` y registra `M6` | Micro: `[M6]` |
| 14 | Se ejecuta `M6`: imprime `3` | — |

**Por qué `5` va antes que `6`:** el primer `then` devuelve `Promise.resolve().then(() => console.log("5"))`. La cadena espera esa promesa; cuando se resuelve, recién entonces se ejecuta el `then` que imprime `6`.

**Por qué `2` y `3` van al final:** el `setTimeout` es una macrotarea. Todas las microtareas (incluidas las que crean otras microtareas) se vacían antes de tomarla.

**Error típico:** creer que `2` va antes que `4` porque el timer se registró primero. El orden no depende de cuándo se **registra**, sino de la **cola** a la que pertenece.

---

### Reto 2 — Convertir callbacks a promesas

**Conceptos:** 5.4, 5.5, 5.6, 5.8.

Implementa `promisify(fn)` para convertir una función con error-first callback en una función que devuelve una promesa. Úsala para leer una configuración y manejar el error con `async/await`.

```js
function leerConfiguracion(clave, callback) {
  setTimeout(() => {
    if (clave === "inexistente") {
      callback(new Error("Clave no encontrada"));
      return;
    }

    callback(null, { clave, valor: 42 });
  }, 20);
}
```

**Pistas:**

- La función convertida debe devolver `new Promise((resolve, reject) => ...)`.
- El callback original recibe `(error, resultado)`.
- Si hay error, llama a `reject`; si no, a `resolve`.
- Conserva `this` y los argumentos con `fn.call(this, ...args, callback)`.

#### Solución

```js
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (error, resultado) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(resultado);
      });
    });
  };
}

const leerConfiguracionPromesa = promisify(leerConfiguracion);

async function main() {
  const config = await leerConfiguracionPromesa("tema");
  console.log(config);

  try {
    await leerConfiguracionPromesa("inexistente");
  } catch (error) {
    console.log("error:", error.message);
  }
}

main();
```

Salida:

```text
{ clave: 'tema', valor: 42 }
error: Clave no encontrada
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `return function (...args)` | Crea una función que acepta los mismos argumentos que la original, sin el callback |
| `new Promise((resolve, reject) => ...)` | Crea la promesa que se devolverá |
| `fn.call(this, ...args, callback)` | Llama a la función original con el `this` correcto, los argumentos y un callback nuevo |
| `if (error) { reject(error); return; }` | Convierte el error del callback en rechazo |
| `resolve(resultado)` | Convierte el resultado en cumplimiento |
| `await leerConfiguracionPromesa("tema")` | Espera la promesa y obtiene el valor |
| `try/catch` | Captura el rechazo de la clave inexistente |

**Por qué `fn.call(this, ...)`:** si la función original usa `this` (por ejemplo, un método de un objeto), perderlo rompería el código. `call` conserva el contexto (Módulo 4).

**Por qué `return` después de `reject`:** `reject` no detiene la ejecución del callback. Sin `return`, se ejecutaría `resolve` con `undefined` y la promesa ya estaría rechazada; no cambia el resultado, pero es una mala práctica.

**Variante:** podrías usar `Promise.withResolvers` para separar las funciones, pero `new Promise` es más directo aquí.

---

### Reto 3 — Cadena con recuperación

**Conceptos:** 5.5, 5.6.

Completa `cargarPerfil(id)` para que:

1. Obtenga el usuario.
2. Obtenga sus pedidos.
3. Calcule el total.
4. Registre el error si algo falla y devuelva `null`.
5. Registre `"Proceso terminado"` siempre.

```js
function obtenerUsuario(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id <= 0) {
        reject(new Error("Usuario inválido"));
        return;
      }
      resolve({ id, nombre: "Ana" });
    }, 10);
  });
}

function obtenerPedidos(usuarioId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 101, total: 30 },
        { id: 102, total: 20 },
      ]);
    }, 10);
  });
}

function calcularTotal(pedidos) {
  return pedidos.reduce((suma, pedido) => suma + pedido.total, 0);
}
```

**Pistas:**

- Devuelve la promesa de `obtenerPedidos` para que la cadena espere.
- Usa un solo `catch` al final.
- Usa `finally` para el mensaje final.
- Guarda el usuario para devolverlo junto con el total.

#### Solución

```js
function cargarPerfil(id) {
  let usuario;

  return obtenerUsuario(id)
    .then((u) => {
      usuario = u;
      console.log("Usuario:", u.nombre);
      return obtenerPedidos(u.id);
    })
    .then((pedidos) => {
      console.log("Pedidos:", pedidos.length);
      return calcularTotal(pedidos);
    })
    .then((total) => {
      console.log("Total:", total);
      return { usuario, total };
    })
    .catch((error) => {
      console.error("Error:", error.message);
      return null;
    })
    .finally(() => {
      console.log("Proceso terminado");
    });
}

async function main() {
  console.log("--- caso válido ---");
  console.log("resultado:", await cargarPerfil(1));

  console.log("--- caso inválido ---");
  console.log("resultado:", await cargarPerfil(0));
}

main();
```

Salida:

```text
--- caso válido ---
Usuario: Ana
Pedidos: 2
Total: 50
Proceso terminado
resultado: { usuario: { id: 1, nombre: 'Ana' }, total: 50 }
--- caso inválido ---
Error: Usuario inválido
Proceso terminado
resultado: null
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `let usuario` | Guarda el usuario para usarlo al final de la cadena |
| `obtenerUsuario(id)` | Inicia la cadena con una promesa |
| `.then((u) => { usuario = u; ... })` | Guarda el usuario y devuelve la promesa de pedidos |
| `return obtenerPedidos(u.id)` | **Devuelve** la promesa; sin `return`, la cadena no esperaría |
| `.then((pedidos) => ...)` | Recibe los pedidos y devuelve el total calculado |
| `.then((total) => ...)` | Recibe el total y devuelve el objeto final |
| `.catch((error) => ...)` | Captura cualquier rechazo de los pasos anteriores |
| `return null` | Recupera la cadena con un valor de respaldo |
| `.finally(...)` | Se ejecuta haya éxito o error |

**Por qué el `catch` devuelve `null`:** convierte el rechazo en un valor normal. La promesa resultante se cumple con `null`, así que `await cargarPerfil(0)` no lanza; devuelve `null`. Eso es útil si el llamador quiere decidir, pero puede ocultar el error si no se registra. Aquí se registra con `console.error`.

**Alternativa con `async/await`:**

```js
async function cargarPerfil(id) {
  try {
    const usuario = await obtenerUsuario(id);
    console.log("Usuario:", usuario.nombre);

    const pedidos = await obtenerPedidos(usuario.id);
    console.log("Pedidos:", pedidos.length);

    const total = calcularTotal(pedidos);
    console.log("Total:", total);

    return { usuario, total };
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  } finally {
    console.log("Proceso terminado");
  }
}
```

Es la misma lógica con otra sintaxis. La versión `async/await` suele ser más legible cuando hay muchos pasos.

---

### Reto 4 — `all` vs `allSettled`

**Conceptos:** 5.7.

Tienes tres fuentes de datos: usuario, pedidos y notificaciones. La fuente de pedidos falla. Ejecuta las tres en paralelo y muestra:

1. Qué pasa con `Promise.all`.
2. Cómo obtener los resultados parciales con `Promise.allSettled`.

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

function falla(ms, mensaje) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error(mensaje)), ms);
  });
}
```

**Pistas:**

- `Promise.all` rechaza con el primer fallo.
- `Promise.allSettled` devuelve objetos `{ status, value }` o `{ status, reason }`.
- Conserva el orden de las fuentes.

#### Solución

```js
async function main() {
  try {
    const todos = await Promise.all([
      esperar(20, "usuario"),
      falla(10, "pedidos caídos"),
      esperar(5, "notificaciones"),
    ]);

    console.log("all:", todos);
  } catch (error) {
    console.log("all falló:", error.message);
  }

  const resultados = await Promise.allSettled([
    esperar(20, "usuario"),
    falla(10, "pedidos caídos"),
    esperar(5, "notificaciones"),
  ]);

  console.log(
    resultados.map((resultado) => {
      return resultado.status === "fulfilled"
        ? resultado.value
        : "ERROR: " + resultado.reason.message;
    })
  );
}

main();
```

Salida:

```text
all falló: pedidos caídos
[ 'usuario', 'ERROR: pedidos caídos', 'notificaciones' ]
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `Promise.all([...])` | Lanza las tres promesas en paralelo |
| `falla(10, ...)` | Rechaza a los 10 ms, antes que las otras |
| `catch (error)` | Captura el rechazo de `all` |
| `console.log("all falló:", ...)` | Muestra que un solo fallo cancela el resultado completo |
| `Promise.allSettled([...])` | Lanza otras tres promesas y espera a todas |
| `resultado.status === "fulfilled"` | Distingue éxito de fallo |
| `resultado.value` | Valor de la promesa cumplida |
| `resultado.reason.message` | Razón de la promesa rechazada |

**Por qué se crean promesas nuevas para `allSettled`:** una promesa rechazada sigue rechazada. Si reutilizaras las mismas, `allSettled` también las vería rechazadas (lo cual está bien), pero el ejemplo sería menos claro porque los timers ya habrían pasado. Crear nuevas hace explícito el paralelismo.

**Resultado clave:** `all` es “todo o nada”; `allSettled` es “dame lo que puedas”. Elige según si un fallo parcial invalida el resultado.

**Variante:** si quieres distinguir los fallos y quedarte solo con los éxitos:

```js
const exitosos = resultados
  .filter((r) => r.status === "fulfilled")
  .map((r) => r.value);

const errores = resultados
  .filter((r) => r.status === "rejected")
  .map((r) => r.reason);
```

---

### Reto 5 — Timeout con `race` y limpieza

**Conceptos:** 5.7, 5.11.

Implementa `conTimeout(promesa, ms)` para que rechace si la promesa tarda más de `ms`. Debe:

1. Resolver con el valor si llega a tiempo.
2. Rechazar con un `Error` si se agota el tiempo.
3. Cancelar el timer cuando la promesa termine antes.
4. Explicar por qué la operación lenta sigue ejecutándose.

**Pistas:**

- Usa `Promise.race` entre la promesa original y una promesa de timeout.
- Guarda el id del timer para limpiarlo.
- `race` no cancela la promesa perdedora.

#### Solución

```js
function conTimeout(promesa, ms) {
  let id;

  const limite = new Promise((resolve, reject) => {
    id = setTimeout(() => {
      reject(new Error(`Timeout de ${ms} ms`));
    }, ms);
  });

  return Promise.race([promesa, limite]).finally(() => {
    clearTimeout(id);
  });
}
```

Prueba:

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

async function main() {
  try {
    await conTimeout(esperar(100, "lento"), 20);
  } catch (error) {
    console.log("1:", error.message);
  }

  console.log("2:", await conTimeout(esperar(5, "rápido"), 50));

  let termino = false;

  const lenta = esperar(50, "lenta").then((valor) => {
    termino = true;
    return valor;
  });

  try {
    await conTimeout(lenta, 10);
  } catch (error) {
    console.log("3:", error.message);
  }

  await esperar(60);
  console.log("4: ¿la operación lenta terminó?", termino);
}

main();
```

Salida:

```text
1: Timeout de 20 ms
2: rápido
3: Timeout de 10 ms
4: ¿la operación lenta terminó? true
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `let id` | Guarda el identificador del timer para limpiarlo |
| `new Promise((resolve, reject) => ...)` | Crea la promesa de timeout |
| `id = setTimeout(...)` | Programa el rechazo |
| `reject(new Error(...))` | Rechaza con un mensaje claro |
| `Promise.race([promesa, limite])` | La primera que se asiente gana |
| `.finally(() => clearTimeout(id))` | Limpia el timer cuando cualquiera gane |
| `await conTimeout(esperar(100), 20)` | El timeout gana a los 20 ms |
| `await conTimeout(esperar(5), 50)` | La promesa gana a los 5 ms |
| `termino = true` | Marca que la operación lenta terminó después |
| `await esperar(60)` | Espera para comprobar que la operación sigue viva |

**Por qué la operación lenta sigue:** `Promise.race` solo decide qué resultado se usa; no cancela la otra promesa. Si la operación es una petición HTTP, sigue consumiendo red y servidor. Para cancelarla de verdad necesitas `AbortController` (Módulo 7) o un token de cancelación (5.11.5).

**Por qué limpiar el timer:** si la promesa gana, el timer seguiría vivo hasta `ms`. En Node, eso puede mantener el proceso abierto; en el navegador, consume recursos innecesariamente.

**Variante con `AbortSignal.timeout` (Módulo 7):**

```js
// Vista previa: fetch con timeout nativo
// const respuesta = await fetch(url, {
//   signal: AbortSignal.timeout(5000),
// });
```

---

### Reto 6 — Reintentos con backoff exponencial

**Conceptos:** 5.9, 5.11.

Implementa `conReintentos(fn, { max, base })` para ejecutar `fn` hasta `max` veces. Entre intentos, espera `base * 2 ** (intento - 1)` milisegundos. Si todos fallan, lanza el último error.

**Pistas:**

- Usa un `for` con `try/catch`.
- Guarda el último error.
- Si es el último intento, no esperes; lanza.
- `2 ** (intento - 1)` produce 1, 2, 4, 8...

#### Solución

```js
function esperar(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function conReintentos(fn, { max = 3, base = 10 } = {}) {
  let ultimoError;

  for (let intento = 1; intento <= max; intento++) {
    try {
      return await fn();
    } catch (error) {
      ultimoError = error;

      if (intento === max) {
        break;
      }

      const espera = base * 2 ** (intento - 1);
      console.log(`reintento ${intento} en ${espera} ms`);
      await esperar(espera);
    }
  }

  throw ultimoError;
}
```

Prueba:

```js
let intentos = 0;

async function inestable() {
  intentos++;
  console.log("intento", intentos);

  if (intentos < 3) {
    throw new Error("fallo " + intentos);
  }

  return "ok";
}

async function main() {
  const resultado = await conReintentos(inestable, { max: 5, base: 10 });
  console.log("resultado:", resultado);
}

main();
```

Salida:

```text
intento 1
reintento 1 en 10 ms
intento 2
reintento 2 en 20 ms
intento 3
resultado: ok
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `let ultimoError` | Guarda el error del último intento |
| `for (let intento = 1; intento <= max; intento++)` | Controla el número de intentos |
| `return await fn()` | Si funciona, devuelve el valor inmediatamente |
| `catch (error)` | Captura el fallo del intento |
| `ultimoError = error` | Lo guarda por si se agotan los intentos |
| `if (intento === max) break` | No espera después del último intento |
| `base * 2 ** (intento - 1)` | Backoff exponencial: 10, 20, 40... |
| `await esperar(espera)` | Espera antes del siguiente intento |
| `throw ultimoError` | Si todos fallan, propaga el último error |

**Por qué no esperar en el último intento:** no hay un siguiente intento; esperar solo retrasa el error.

**Por qué backoff exponencial:** si el servidor está saturado, reintentar inmediatamente empeora la saturación. Esperar cada vez más da tiempo a recuperarse.

**Jitter:** en sistemas distribuidos, muchos clientes reintentan al mismo tiempo. Añade aleatoriedad:

```js
function esperaConJitter(base, intento) {
  const exponencial = base * 2 ** (intento - 1);
  const jitter = Math.random() * exponencial * 0.5;
  return Math.min(exponencial + jitter, 5000);
}
```

**Cuándo no reintentar:** errores de validación, errores de programación y operaciones no idempotentes sin clave de idempotencia.

---
### Reto 7 — Límite de concurrencia

**Conceptos:** 5.11.

Implementa `crearLimite(max)` para ejecutar como máximo `max` tareas a la vez. Debe devolver una función que reciba una tarea (una función que devuelve una promesa) y devuelva una promesa con su resultado.

**Pistas:**

- Mantén una cola de tareas pendientes.
- Cuenta las tareas activas.
- Cuando una termina, decrementa el contador y arranca la siguiente.
- Usa `Promise.resolve().then(tarea)` para aceptar tareas síncronas o asíncronas.

#### Solución

```js
function crearLimite(max) {
  const pendientes = [];
  let activas = 0;

  function siguiente() {
    if (activas >= max || pendientes.length === 0) {
      return;
    }

    const { tarea, resolve, reject } = pendientes.shift();
    activas++;

    Promise.resolve()
      .then(tarea)
      .then(resolve, reject)
      .finally(() => {
        activas--;
        siguiente();
      });
  }

  return function ejecutar(tarea) {
    return new Promise((resolve, reject) => {
      pendientes.push({ tarea, resolve, reject });
      siguiente();
    });
  };
}
```

Prueba:

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

async function main() {
  const limite = crearLimite(2);

  let activas = 0;
  let maxVisto = 0;

  const tarea = (n, ms) => async () => {
    activas++;
    maxVisto = Math.max(maxVisto, activas);
    console.log("inicio", n, "activas", activas);

    await esperar(ms);

    activas--;
    console.log("fin", n);
    return n;
  };

  const resultados = await Promise.all([
    limite(tarea(1, 30)),
    limite(tarea(2, 10)),
    limite(tarea(3, 20)),
    limite(tarea(4, 5)),
  ]);

  console.log("resultados", resultados, "maxVisto", maxVisto);
}

main();
```

Salida:

```text
inicio 1 activas 1
inicio 2 activas 2
fin 2
inicio 3 activas 2
fin 1
inicio 4 activas 2
fin 3
fin 4
resultados [ 1, 2, 3, 4 ] maxVisto 2
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `const pendientes = []` | Cola FIFO de tareas esperando turno |
| `let activas = 0` | Número de tareas en ejecución |
| `if (activas >= max || pendientes.length === 0) return` | No arranca si no hay hueco o no hay tareas |
| `pendientes.shift()` | Toma la primera tarea de la cola |
| `activas++` | Ocupa un hueco |
| `Promise.resolve().then(tarea)` | Normaliza la tarea: si es síncrona, la convierte en promesa |
| `.then(resolve, reject)` | Conecta el resultado con la promesa que devolvimos |
| `.finally(() => { activas--; siguiente(); })` | Libera el hueco y arranca la siguiente |
| `pendientes.push({ tarea, resolve, reject })` | Encola la tarea y sus funciones de control |
| `siguiente()` | Intenta arrancar de inmediato |

**Por qué `maxVisto` es 2:** en ningún momento hay más de dos tareas activas. La tercera espera a que la segunda termine; la cuarta espera a que la primera termine.

**Por qué los resultados están en orden:** `Promise.all` conserva el orden de las promesas de entrada, aunque las tareas terminen en otro orden. Los resultados son `[1, 2, 3, 4]`, no el orden de finalización.

**Alternativa por lotes:**

```js
async function porLotes(items, tamano, fn) {
  const resultados = [];

  for (let i = 0; i < items.length; i += tamano) {
    const lote = items.slice(i, i + tamano);
    const resultadosLote = await Promise.all(lote.map(fn));
    resultados.push(...resultadosLote);
  }

  return resultados;
}
```

`porLotes` espera a que termine todo el lote antes de empezar el siguiente. `crearLimite` arranca una nueva tarea en cuanto hay un hueco, lo cual es más eficiente si las duraciones son desiguales.

---

### Reto 8 — `async/await` en bucles

**Conceptos:** 5.8.

Dado `items = [1, 2, 3]`, procesa cada elemento con una función asíncrona que tarda 10 ms y devuelve `n * 2`. Hazlo de tres formas:

1. Secuencial con `for...of`.
2. Paralelo con `Promise.all` y `map`.
3. Con `forEach` y `async`, y explica por qué está mal.

**Pistas:**

- `for...of` con `await` espera en cada iteración.
- `map` devuelve un array de promesas; `Promise.all` las espera.
- `forEach` no devuelve nada y no espera a los callbacks async.

#### Solución

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

const items = [1, 2, 3];

async function secuencial() {
  const resultados = [];

  for (const n of items) {
    console.log("sec inicio", n);
    resultados.push(await esperar(10, n * 2));
    console.log("sec fin", n);
  }

  return resultados;
}

async function paralelo() {
  return Promise.all(
    items.map(async (n) => {
      console.log("par inicio", n);
      const valor = await esperar(10, n * 2);
      console.log("par fin", n);
      return valor;
    })
  );
}

async function conForEachRoto() {
  items.forEach(async (n) => {
    await esperar(10);
    console.log("forEach", n);
  });

  console.log("forEach terminó (mentira)");
}
```

Prueba:

```js
async function main() {
  console.log("--- secuencial ---");
  console.log(await secuencial());

  console.log("--- paralelo ---");
  console.log(await paralelo());

  console.log("--- forEach ---");
  await conForEachRoto();
  await esperar(30);
}

main();
```

Salida:

```text
--- secuencial ---
sec inicio 1
sec fin 1
sec inicio 2
sec fin 2
sec inicio 3
sec fin 3
[ 2, 4, 6 ]
--- paralelo ---
par inicio 1
par inicio 2
par inicio 3
par fin 1
par fin 2
par fin 3
[ 2, 4, 6 ]
--- forEach ---
forEach terminó (mentira)
forEach 1
forEach 2
forEach 3
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `for (const n of items)` | Recorre en orden |
| `await esperar(10, n * 2)` | Espera antes de pasar al siguiente |
| `resultados.push(...)` | Acumula el resultado |
| `items.map(async (n) => ...)` | Crea una promesa por elemento |
| `Promise.all(...)` | Espera a que todas terminen |
| `items.forEach(async (n) => ...)` | Crea callbacks async, pero `forEach` no los espera |
| `console.log("forEach terminó (mentira)")` | Se ejecuta antes de que los callbacks terminen |
| `await esperar(30)` | Da tiempo a que los callbacks del `forEach` terminen |

**Diferencia de tiempos:**

- Secuencial: 10 + 10 + 10 = 30 ms.
- Paralelo: 10 ms (las tres a la vez).

**Por qué `forEach` está mal:** `forEach` está diseñado para efectos secundarios síncronos. No devuelve una promesa y no puede esperar a un callback async. El `await` dentro del callback solo pausa ese callback, no el `forEach`.

**Soluciones correctas:**

```js
async function ejemplo() {
  // ✅ Secuencial
  for (const n of items) {
    await procesar(n);
  }

  // ✅ Paralelo
  await Promise.all(items.map((n) => procesar(n)));
}
```

**Regla:** nunca uses `forEach` con `async` si necesitas esperar. Usa `for...of` o `Promise.all(map(...))`.

---

### Reto 9 — Errores personalizados y `cause`

**Conceptos:** 5.9.

Crea un sistema de validación de usuarios:

1. `ErrorValidacion` con propiedad `campo`.
2. `validarUsuario` que acumule todos los errores en un `AggregateError`.
3. `guardarUsuario` que envuelva el `AggregateError` en un `Error` con `cause` y una propiedad `detalle`.
4. Captura y muestra el mensaje, el detalle, la causa y el tipo.

**Pistas:**

- `class ErrorValidacion extends Error`.
- `super(mensaje)` y `this.name = "ErrorValidacion"`.
- `throw new AggregateError(errores, "mensaje")`.
- `new Error("mensaje", { cause: error })`.

#### Solución

```js
class ErrorValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
    this.campo = campo;
  }
}

function validarUsuario(usuario) {
  const errores = [];

  if (!usuario.nombre) {
    errores.push(
      new ErrorValidacion("nombre", "El nombre es obligatorio")
    );
  }

  if (!usuario.email || !usuario.email.includes("@")) {
    errores.push(
      new ErrorValidacion("email", "El email no es válido")
    );
  }

  if (errores.length > 0) {
    throw new AggregateError(errores, "Usuario inválido");
  }

  return true;
}

async function guardarUsuario(usuario) {
  try {
    validarUsuario(usuario);
    return { ok: true };
  } catch (error) {
    if (error instanceof AggregateError) {
      const detalle = error.errors.map((e) => {
        return `${e.campo}: ${e.message}`;
      });

      const nuevo = new Error("No se pudo guardar el usuario", {
        cause: error,
      });

      nuevo.detalle = detalle;
      throw nuevo;
    }

    throw error;
  }
}
```

Prueba:

```js
async function main() {
  try {
    await guardarUsuario({});
  } catch (error) {
    console.log("mensaje:", error.message);
    console.log("detalle:", error.detalle);
    console.log("causa es AggregateError:", error.cause instanceof AggregateError);
    console.log(
      "primer error es ErrorValidacion:",
      error.cause.errors[0] instanceof ErrorValidacion
    );
    console.log("campo:", error.cause.errors[0].campo);
  }

  console.log(
    "válido:",
    await guardarUsuario({ nombre: "Ana", email: "ana@example.com" })
  );
}

main();
```

Salida:

```text
mensaje: No se pudo guardar el usuario
detalle: [ 'nombre: El nombre es obligatorio', 'email: El email no es válido' ]
causa es AggregateError: true
primer error es ErrorValidacion: true
campo: nombre
válido: { ok: true }
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `class ErrorValidacion extends Error` | Hereda de `Error` para tener `message`, `stack` e `instanceof` |
| `super(mensaje)` | Llama al constructor de `Error` |
| `this.name = "ErrorValidacion"` | Cambia el nombre que aparece en la traza |
| `this.campo = campo` | Añade información de dominio |
| `const errores = []` | Acumula todos los problemas, no solo el primero |
| `errores.push(new ErrorValidacion(...))` | Crea un error por campo inválido |
| `throw new AggregateError(errores, "Usuario inválido")` | Agrupa todos los errores |
| `error instanceof AggregateError` | Distingue el error de validación de otros |
| `error.errors.map(...)` | Recorre los errores agrupados |
| `new Error("No se pudo guardar", { cause: error })` | Conserva el error original |
| `nuevo.detalle = detalle` | Añade información para la capa superior |
| `throw nuevo` | Propaga el error enriquecido |
| `throw error` | Si no es de validación, no lo transforma |

**Por qué acumular errores:** si validas campo por campo y lanzas al primer fallo, el usuario tiene que corregir uno, volver a enviar, corregir otro... Acumular permite mostrar todos los problemas a la vez.

**Por qué `cause`:** la capa superior recibe un mensaje entendible, pero el desarrollador puede inspeccionar la causa original con `error.cause`. Sin `cause`, esa información se perdería.

**Por qué `instanceof AggregateError`:** permite manejar específicamente los errores de validación y relanzar cualquier otro sin transformarlo.

**Variante con `Error.captureStackTrace`:**

```js
class ErrorValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorValidacion";
    this.campo = campo;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorValidacion);
    }
  }
}
```

Esto oculta el frame del constructor en la traza de Node.

---

### Reto 10 — Deduplicación de peticiones

**Conceptos:** 5.7, 5.11.

Implementa `crearDeduplicador(fn)` para que, si se pide la misma clave mientras una petición está en vuelo, se reutilice la misma promesa en lugar de lanzar otra petición. Cuando la promesa termina, la clave debe liberarse.

**Pistas:**

- Usa un `Map` de promesas en vuelo.
- Si la clave existe, devuelve la promesa guardada.
- Si no, crea la promesa y guárdala.
- Usa `finally` para eliminar la clave al terminar.

#### Solución

```js
function crearDeduplicador(fn) {
  const enVuelo = new Map();

  return function (clave, ...args) {
    if (enVuelo.has(clave)) {
      console.log("reutiliza", clave);
      return enVuelo.get(clave);
    }

    console.log("inicia", clave);

    const promesa = Promise.resolve()
      .then(() => fn(clave, ...args))
      .finally(() => {
        enVuelo.delete(clave);
        console.log("libera", clave);
      });

    enVuelo.set(clave, promesa);
    return promesa;
  };
}
```

Prueba:

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

let peticiones = 0;

const cargar = crearDeduplicador(async (id) => {
  peticiones++;
  console.log("petición real", id);
  await esperar(20);
  return { id, nombre: "Usuario " + id };
});

async function main() {
  const [a, b] = await Promise.all([cargar(1), cargar(1)]);
  console.log("mismo objeto:", a === b, "peticiones:", peticiones);

  await cargar(1);
  console.log("peticiones tras liberar:", peticiones);
}

main();
```

Salida:

```text
inicia 1
reutiliza 1
petición real 1
libera 1
mismo objeto: true peticiones: 1
inicia 1
petición real 1
libera 1
peticiones tras liberar: 2
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `const enVuelo = new Map()` | Guarda las promesas por clave |
| `if (enVuelo.has(clave))` | Detecta una petición ya en curso |
| `return enVuelo.get(clave)` | Devuelve la misma promesa |
| `Promise.resolve().then(() => fn(...))` | Normaliza la llamada y captura errores síncronos |
| `.finally(() => enVuelo.delete(clave))` | Libera la clave cuando termina |
| `enVuelo.set(clave, promesa)` | Registra la promesa antes de devolverla |
| `Promise.all([cargar(1), cargar(1)])` | Las dos llamadas comparten la promesa |
| `a === b` | Es `true` porque es el mismo objeto resultado |
| `await cargar(1)` | Después de liberar, lanza una nueva petición |

**Por qué guardar la promesa y no el valor:** la segunda llamada llega **antes** de que la primera termine. No hay valor todavía; lo que se comparte es la promesa.

**Por qué `finally` y no `then`:** `finally` se ejecuta tanto si la petición se cumple como si falla. Así la clave se libera en ambos casos.

**Cuidado con las claves:** deben incluir todos los parámetros que afectan al resultado. Si dos peticiones con filtros distintos comparten la misma clave, recibirán datos incorrectos.

```js
// ❌ Clave incompleta
const claveIncompleta = "usuarios";

// ✅ Clave completa
const claveCompleta = `usuarios:${filtro}:${pagina}`;
```

**Diferencia con caché:** la deduplicación comparte solo peticiones **en vuelo**. Una caché conserva el resultado después de terminar, durante un tiempo (TTL).

---

### Reto 11 — Dashboard resiliente (capstone, opcional)

**Conceptos:** todos los del módulo.

Implementa `cargarDashboard(id)` para cargar un usuario, sus pedidos y sus notificaciones. Debe:

1. Ejecutar las tres cargas en paralelo.
2. Reintentar cada carga hasta 2 veces.
3. Aplicar un timeout de 100 ms a cada una.
4. Tolerar fallos parciales con `Promise.allSettled`.
5. Deduplicar las peticiones de usuario.
6. Devolver `{ usuario, pedidos, notificaciones, errores }`.

**Pistas:**

- Combina `crearDeduplicador`, `conTimeout`, `conReintentos` y `Promise.allSettled`.
- Cada fuente debe tener su propio pipeline.
- `allSettled` te da el estado de cada una sin cancelar las demás.
- Los errores deben ser mensajes legibles.

#### Solución

```js
function esperar(ms, valor) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(valor), ms);
  });
}

function crearDeduplicador(fn) {
  const enVuelo = new Map();

  return function (clave, ...args) {
    if (enVuelo.has(clave)) {
      return enVuelo.get(clave);
    }

    const promesa = Promise.resolve()
      .then(() => fn(clave, ...args))
      .finally(() => enVuelo.delete(clave));

    enVuelo.set(clave, promesa);
    return promesa;
  };
}

function conTimeout(promesa, ms) {
  let id;

  const limite = new Promise((resolve, reject) => {
    id = setTimeout(() => {
      reject(new Error(`Timeout de ${ms} ms`));
    }, ms);
  });

  return Promise.race([promesa, limite]).finally(() => {
    clearTimeout(id);
  });
}

async function conReintentos(fn, { max = 2, base = 5 } = {}) {
  let ultimoError;

  for (let intento = 1; intento <= max; intento++) {
    try {
      return await fn();
    } catch (error) {
      ultimoError = error;

      if (intento === max) {
        break;
      }

      await esperar(base * 2 ** (intento - 1));
    }
  }

  throw ultimoError;
}
```

Fuentes de datos:

```js
let peticionesUsuario = 0;

const cargarUsuario = crearDeduplicador(async (id) => {
  peticionesUsuario++;
  console.log("petición usuario", id);
  await esperar(15);

  if (id <= 0) {
    throw new Error("Usuario inválido");
  }

  return { id, nombre: "Ana" };
});

async function cargarPedidos(id) {
  await esperar(10);

  if (id === 2) {
    throw new Error("Pedidos no disponibles");
  }

  return [{ id: 101, total: 30 }];
}

async function cargarNotificaciones(id) {
  await esperar(5);
  return ["bienvenida"];
}
```

Dashboard:

```js
async function cargarDashboard(id) {
  const usuarioP = conTimeout(
    conReintentos(() => cargarUsuario(id), { max: 2, base: 5 }),
    100
  );

  const pedidosP = conTimeout(
    conReintentos(() => cargarPedidos(id), { max: 2, base: 5 }),
    100
  );

  const notificacionesP = conTimeout(
    conReintentos(() => cargarNotificaciones(id), { max: 2, base: 5 }),
    100
  );

  const [usuario, pedidos, notificaciones] = await Promise.allSettled([
    usuarioP,
    pedidosP,
    notificacionesP,
  ]);

  return {
    usuario: usuario.status === "fulfilled" ? usuario.value : null,
    pedidos: pedidos.status === "fulfilled" ? pedidos.value : [],
    notificaciones:
      notificaciones.status === "fulfilled" ? notificaciones.value : [],
    errores: [usuario, pedidos, notificaciones]
      .filter((resultado) => resultado.status === "rejected")
      .map((resultado) => resultado.reason.message),
  };
}
```

Prueba:

```js
async function main() {
  console.log("--- dashboard 1, dos veces a la vez ---");

  const [d1, d2] = await Promise.all([
    cargarDashboard(1),
    cargarDashboard(1),
  ]);

  console.log(d1);
  console.log("peticiones usuario:", peticionesUsuario);
  console.log("mismo usuario:", d1.usuario === d2.usuario);

  console.log("--- dashboard 2 ---");
  console.log(await cargarDashboard(2));
}

main();
```

Salida:

```text
--- dashboard 1, dos veces a la vez ---
petición usuario 1
{
  usuario: { id: 1, nombre: 'Ana' },
  pedidos: [ { id: 101, total: 30 } ],
  notificaciones: [ 'bienvenida' ],
  errores: []
}
peticiones usuario: 1
mismo usuario: true
--- dashboard 2 ---
petición usuario 2
{
  usuario: { id: 2, nombre: 'Ana' },
  pedidos: [],
  notificaciones: [ 'bienvenida' ],
  errores: [ 'Pedidos no disponibles' ]
}
```

**Línea por línea:**

| Línea | Qué hace |
|---|---|
| `crearDeduplicador` | Comparte la petición de usuario entre dashboards simultáneos |
| `conTimeout(..., 100)` | Limita cada fuente a 100 ms |
| `conReintentos(..., { max: 2, base: 5 })` | Reintenta una vez tras 5 ms |
| `Promise.allSettled([...])` | Espera a las tres sin cancelar por un fallo |
| `usuario.status === "fulfilled"` | Decide si hay valor o `null` |
| `pedidos.status === "fulfilled"` | Si falla, devuelve `[]` |
| `notificaciones.status === "fulfilled"` | Si falla, devuelve `[]` |
| `.filter(...).map(...)` | Recoge solo los mensajes de error |
| `Promise.all([cargarDashboard(1), cargarDashboard(1)])` | Dos dashboards a la vez |
| `peticionesUsuario` | Comprueba que la deduplicación funcionó |
| `d1.usuario === d2.usuario` | Ambos comparten el mismo objeto |

**Por qué `allSettled` y no `all`:** si los pedidos fallan, el dashboard todavía puede mostrar el usuario y las notificaciones. `all` descartaría todo.

**Por qué la deduplicación funciona:** las dos llamadas a `cargarDashboard(1)` ocurren en el mismo turno, antes de que la primera petición de usuario termine. La segunda encuentra la promesa en `enVuelo` y la reutiliza.

**Por qué los errores son un array:** el dashboard puede fallar parcialmente. Devolver los mensajes permite a la interfaz mostrar avisos sin romper toda la página.

**Mejoras posibles:**

- Añadir un límite de concurrencia si hay muchas fuentes.
- Añadir jitter al backoff.
- Distinguir errores recuperables de irrecuperables.
- Añadir `AbortController` para cancelar de verdad.
- Cachear resultados con TTL.

Este reto integra todo el módulo: promesas, `async/await`, errores, utilidades estáticas y patrones de concurrencia.

---

## 5.13 — Errores, glosario y autoevaluación

### 5.13.1 Los 18 errores más frecuentes

| # | Error | Qué pasa | Solución |
|---|---|---|---|
| 1 | Creer que `setTimeout(fn, 0)` es inmediato | Se ejecuta después del código síncrono y las microtareas | Usa `queueMicrotask` si solo quieres diferir |
| 2 | Olvidar `return` dentro de un `then` | El siguiente paso recibe `undefined` | Devuelve el valor o la promesa |
| 3 | Usar `forEach` con `async` | No espera a los callbacks | `for...of` o `Promise.all(map(...))` |
| 4 | No capturar un rechazo | Node termina el proceso; el navegador avisa | `.catch` o `try/catch` con `await` |
| 5 | `await` secuencial innecesario | Todo tarda la suma de los tiempos | `Promise.all` si son independientes |
| 6 | Creer que `await` bloquea el hilo | El Event Loop sigue funcionando | Es una pausa de la función, no del hilo |
| 7 | Usar `new Promise` cuando ya hay una promesa | Envoltorio innecesario y errores duplicados | Devuelve la promesa original |
| 8 | Seguir ejecutando después de `resolve` | Código muerto o efectos inesperados | `return` después de resolver/rechazar |
| 9 | Rechazar con strings | Pierdes tipo, stack y `instanceof` | Rechaza con `Error` |
| 10 | `catch` vacío | El error desaparece | Registra, recupera o relanza |
| 11 | No limpiar timers | Recursos retenidos y procesos vivos | `clearTimeout`/`clearInterval` |
| 12 | Creer que `race` cancela la perdedora | La operación sigue ejecutándose | Token de cancelación o `AbortController` |
| 13 | Confundir `all` con `allSettled` | Un fallo tira todos los resultados | `allSettled` si toleras fallos |
| 14 | Confundir `race` con `any` | `race` rechaza si la primera falla | `any` si buscas el primero que funcione |
| 15 | Perder el error original | La depuración se vuelve imposible | `{ cause: error }` |
| 16 | Medir tiempo con `setTimeout` | El tiempo real depende de la carga | Usa `Date.now()` para medir intervalos |
| 17 | Microtareas recursivas | Inanición del Event Loop | Usa timers para trabajo repetido |
| 18 | No esperar una función async | Rechazo no manejado o resultado perdido | `await` o `.catch` |

### 5.13.2 Errores que verás en la consola

| Mensaje | Causa | Solución |
|---|---|---|
| `UnhandledPromiseRejection` / `Error: ...` | Promesa rechazada sin `catch` | Captura con `.catch` o `try/catch` |
| `TypeError: Cannot read properties of undefined (reading 'then')` | Esperabas una promesa y recibiste `undefined` | Revisa el `return` de la función |
| `SyntaxError: await is only valid in async functions...` | `await` fuera de una función `async` | Envuelve en `async` o usa un módulo |
| `TypeError: Chaining cycle detected for promise` | Un `then` devuelve la promesa que lo contiene | Devuelve otra promesa o un valor |
| `AggregateError: ...` | `Promise.any` falló en todas | Revisa `error.errors` |
| `RangeError: Maximum call stack size exceeded` | Recursión infinita | Añade caso base |
| `Timeout de X ms` | Tu propio timeout | Aumenta el límite o revisa la operación |
| `Promise { <pending> }` | Imprimiste una promesa sin esperar | Usa `await` o `.then` |
| `undefined` inesperado | Falta un `return` | Devuelve el valor |
| `[object Promise]` en un string | Concatenaste una promesa | Espera el valor antes de interpolar |
| `TypeError: fn is not a function` | Callback mal pasado o `this` perdido | Revisa la referencia |
| `Error: Circuito abierto` | Circuit breaker activo | Espera o revisa el servicio |

### 5.13.3 Glosario del módulo

| Término | Definición |
|---|---|
| **Asincronía** | Capacidad de iniciar una operación y continuar sin esperar su resultado |
| **Síncrono** | Código que se ejecuta en orden, una instrucción tras otra |
| **Bloqueante** | Operación que impide que el hilo haga otra cosa mientras espera |
| **No bloqueante** | Operación que delega la espera y devuelve el control |
| **Concurrencia** | Varias tareas progresan turnándose en el mismo hilo |
| **Paralelismo** | Varias tareas se ejecutan exactamente a la vez |
| **Call Stack** | Pila de llamadas en ejecución |
| **Frame** | Entrada de la pila que representa una llamada |
| **Stack overflow** | Desbordamiento de la pila por demasiadas llamadas |
| **Motor** | Programa que interpreta y ejecuta JavaScript (V8, SpiderMonkey...) |
| **Host** | Entorno que ofrece APIs externas (navegador, Node) |
| **API del host** | Función del entorno, no del lenguaje (`setTimeout`, `fetch`) |
| **Task Queue** | Cola de macrotareas |
| **Microtask Queue** | Cola de microtareas, prioritaria sobre la Task Queue |
| **Event Loop** | Bucle que coordina tareas, microtareas y renderizado |
| **Macrotarea** | Tarea que se ejecuta una por vuelta del Event Loop |
| **Microtarea** | Tarea que se ejecuta antes de la siguiente macrotarea |
| **Run-to-completion** | Una tarea no se interrumpe hasta terminar |
| **Starvation** | Una cola no deja avanzar a las demás |
| **Timer** | Mecanismo para ejecutar código después de un tiempo |
| **`setTimeout`** | Ejecuta una función una vez tras un tiempo mínimo |
| **`setInterval`** | Ejecuta una función repetidamente cada intervalo mínimo |
| **`clearTimeout`** | Cancela un `setTimeout` |
| **`clearInterval`** | Cancela un `setInterval` |
| **Drift** | Desviación acumulada de un intervalo |
| **Debounce** | Espera a que pare una ráfaga de llamadas |
| **Throttle** | Ejecuta como máximo una vez por intervalo |
| **Callback** | Función pasada a otra para que la llame después |
| **Callback hell** | Anidación excesiva de callbacks |
| **Error-first callback** | Convención `callback(error, resultado)` |
| **Inversión de control** | Entregas tu callback a código que decide cuándo llamarlo |
| **Zalgo** | Callback que a veces es síncrono y a veces asíncrono |
| **Promesa** | Objeto que representa un valor futuro |
| **`pending`** | Estado inicial de una promesa |
| **`fulfilled`** | Estado de una promesa cumplida |
| **`rejected`** | Estado de una promesa rechazada |
| **`settled`** | Cumplida o rechazada; ya no cambia |
| **Ejecutor** | Función que recibe `resolve` y `reject` en `new Promise` |
| **`resolve`** | Cumple una promesa con un valor |
| **`reject`** | Rechaza una promesa con una razón |
| **`then`** | Registra callbacks y devuelve una nueva promesa |
| **`catch`** | Captura rechazos de la cadena |
| **`finally`** | Ejecuta limpieza haya éxito o error |
| **Encadenamiento** | Composición de promesas con `then` |
| **Thenable** | Objeto con un método `then` |
| **Unhandled rejection** | Rechazo sin manejador |
| **`Promise.all`** | Espera todas; falla si una falla |
| **`Promise.allSettled`** | Espera todas; nunca falla por rechazos |
| **`Promise.race`** | Se asienta con la primera |
| **`Promise.any`** | Se cumple con la primera que funcione |
| **`Promise.withResolvers`** | Devuelve promesa y funciones de control |
| **`AggregateError`** | Error que agrupa varios errores |
| **`async`** | Declara una función que devuelve una promesa |
| **`await`** | Pausa la función async hasta que la promesa se asiente |
| **Top-level await** | `await` en el nivel superior de un módulo |
| **Microtask checkpoint** | Punto en que se vacía la cola de microtareas |
| **Backoff** | Espera creciente entre reintentos |
| **Jitter** | Aleatoriedad añadida al backoff |
| **Timeout** | Límite de tiempo para una operación |
| **Token de cancelación** | Objeto que permite cancelar una operación |
| **Circuit breaker** | Interruptor que deja de llamar a un servicio que falla |
| **Deduplicación** | Compartir una operación en vuelo para la misma clave |
| **TTL** | Tiempo de vida de una entrada de caché |
| **Idempotencia** | Propiedad de repetir una operación sin cambiar el resultado |
| **Límite de concurrencia** | Máximo de tareas simultáneas |
| **Cola de tareas** | Estructura que ejecuta tareas en orden |
| **`AbortController`** | API estándar para cancelar operaciones (Módulo 7) |

### 5.13.4 Autoevaluación

Responde sin mirar el módulo. Si fallas alguna, vuelve a la sección indicada.

1. ¿Qué diferencia hay entre concurrencia y paralelismo? *(5.1.4)*
2. ¿Qué es el Call Stack y qué estructura usa? *(5.2.1)*
3. ¿Qué hace el Event Loop paso a paso? *(5.2.7)*
4. ¿Qué se ejecuta primero: una microtarea o un `setTimeout(fn, 0)`? *(5.2.6)*
5. ¿Por qué `setTimeout(fn, 0)` no es inmediato? *(5.3.7)*
6. ¿Qué diferencia hay entre `setInterval` y `setTimeout` recursivo? *(5.3.6)*
7. ¿Qué es un error-first callback? *(5.4.3)*
8. ¿Qué es el callback hell y cómo se evita? *(5.4.4)*
9. ¿Qué es Zalgo? *(5.4.6)*
10. ¿Cuáles son los tres estados de una promesa? *(5.5.1)*
11. ¿El ejecutor de `new Promise` es síncrono o asíncrono? *(5.5.3)*
12. ¿Qué devuelve `then`? *(5.5.9)*
13. ¿Qué diferencia hay entre `catch` y el segundo argumento de `then`? *(5.5.7)*
14. ¿Qué hace `finally` y qué pasa si devuelve una promesa rechazada? *(5.5.8)*
15. ¿Qué diferencia hay entre `Promise.all` y `Promise.allSettled`? *(5.7.2, 5.7.3)*
16. ¿Qué diferencia hay entre `Promise.race` y `Promise.any`? *(5.7.4, 5.7.5)*
17. ¿Qué hace `async` y qué devuelve siempre? *(5.8.1)*
18. ¿Por qué `forEach` con `async` no espera? *(5.8.9)*
19. ¿Cuándo usar `return await` en lugar de `return`? *(5.8.10)*
20. ¿Qué es un rechazo no manejado y cómo se evita? *(5.6.7)*

**Respuestas breves:**

1. Concurrencia es turnarse en un hilo; paralelismo es ejecutar a la vez en varios.
2. Es la pila de llamadas en ejecución; usa LIFO.
3. Toma una macrotarea, la ejecuta, vacía las microtareas, renderiza si toca y repite.
4. La microtarea.
5. Porque el callback se encola y el código síncrono actual termina primero.
6. `setInterval` programa sin esperar al callback; el recursivo espera a que termine y evita solapamientos.
7. Un callback que recibe `(error, resultado)` y comprueba el error primero.
8. Anidación excesiva de callbacks; se evita con promesas o `async/await`.
9. Un callback que a veces se ejecuta síncrono y a veces asíncrono.
10. `pending`, `fulfilled` y `rejected`.
11. Síncrono.
12. Una nueva promesa.
13. `catch` captura también errores del `then` anterior; el segundo argumento no.
14. Ejecuta limpieza siempre; si devuelve una promesa rechazada, reemplaza el resultado.
15. `all` falla si una falla; `allSettled` espera todas y devuelve el estado de cada una.
16. `race` se asienta con la primera, éxito o error; `any` se cumple con la primera que funcione.
17. Declara una función async; siempre devuelve una promesa.
18. Porque `forEach` no devuelve una promesa ni espera a los callbacks.
19. Cuando necesitas capturar el rechazo localmente con `try/catch`.
20. Una promesa rechazada sin `catch`; se evita capturando o usando `try/catch` con `await`.

### 5.13.5 Checklist de dominio

Marca cada punto solo si puedes explicarlo **y** escribirlo sin mirar:

- [ ] Explico la diferencia entre síncrono, asíncrono, concurrente y paralelo.
- [ ] Dibujo el Call Stack, la Task Queue, la Microtask Queue y el Event Loop.
- [ ] Predigo el orden de ejecución de código síncrono, promesas y timers.
- [ ] Explico por qué `setTimeout(fn, 0)` no es inmediato.
- [ ] Uso `setTimeout`, `clearTimeout`, `setInterval` y `clearInterval` correctamente.
- [ ] Implemento debounce y throttle con timers.
- [ ] Escribo callbacks error-first y explico la inversión de control.
- [ ] Reconozco y evito el callback hell.
- [ ] Explico qué es Zalgo y cómo evitarlo.
- [ ] Creo promesas con `new Promise` y entiendo el ejecutor síncrono.
- [ ] Explico los estados de una promesa y qué significa “asentada”.
- [ ] Encadeno `then`, capturo con `catch` y limpio con `finally`.
- [ ] Evito olvidar `return` dentro de un `then`.
- [ ] Convierto callbacks a promesas con `promisify`.
- [ ] Uso `Promise.all`, `allSettled`, `race`, `any` y `withResolvers` según el caso.
- [ ] Escribo funciones `async` y uso `await` sin bloquear el hilo.
- [ ] Distingo `await` secuencial de paralelo y elijo bien.
- [ ] Evito `forEach` con `async`.
- [ ] Capturo errores asíncronos con `try/catch` y `cause`.
- [ ] Creo errores personalizados con `class extends Error`.
- [ ] Explico las microtareas y la inanición.
- [ ] Implemento reintentos con backoff y jitter.
- [ ] Implemento timeout con `race` y limpieza.
- [ ] Implemento un límite de concurrencia.
- [ ] Deduplico peticiones en vuelo.
- [ ] Explico qué es un circuit breaker.
- [ ] Evito los 18 errores de la sección 5.13.1.

### 5.13.6 Qué viene en el Módulo 6

El Módulo 6 cubre **el navegador y el DOM**:

- Qué es el DOM y cómo se representa el HTML.
- Selección de elementos: `querySelector`, `querySelectorAll`, `getElementById`.
- Manipulación: `textContent`, `innerHTML`, `classList`, `style`, atributos.
- Creación e inserción de nodos.
- Eventos: `addEventListener`, burbujeo, captura, delegación.
- Formularios y validación.
- `localStorage`, `sessionStorage` y cookies.
- `requestAnimationFrame` y rendimiento.
- `AbortController` en eventos.
- Patrones de organización del código del navegador.

Todo lo aprendido aquí se usa allí: los eventos son macrotareas, los handlers pueden ser async, y la cancelación con `AbortController` conecta directamente con 5.11.5.

---

## 🧭 Resumen del Módulo 5

| Sección | Idea clave |
|---|---|
| 5.1 | JavaScript es de un solo hilo; la asincronía delega operaciones lentas al host |
| 5.2 | El Event Loop ejecuta macrotareas y vacía microtareas entre ellas |
| 5.3 | Los timers garantizan un mínimo, no una precisión exacta |
| 5.4 | Los callbacks son la base; el error-first y el orden consistente evitan bugs |
| 5.5 | Una promesa representa un valor futuro y se asienta una sola vez |
| 5.6 | `then` encadena, `catch` centraliza errores y `finally` limpia |
| 5.7 | `all`, `allSettled`, `race` y `any` resuelven composición de promesas |
| 5.8 | `async/await` es azúcar sobre promesas; no bloquea el hilo |
| 5.9 | Lanza `Error`, captura con contexto y conserva la causa |
| 5.10 | Las microtareas se ejecutan antes de la siguiente macrotarea |
| 5.11 | Límites, reintentos, timeouts, cancelación y deduplicación hacen código resiliente |
| 5.12 | Once retos integran todos los conceptos |
| 5.13 | Errores, glosario, autoevaluación y checklist |

---

> **Fin del Módulo 5.**
>
> Guarda este archivo y practica los retos en Node antes de pasar al Módulo 6.
> Si algo no cuadra con lo explicado, es un error del material: avísame y lo corrijo.
