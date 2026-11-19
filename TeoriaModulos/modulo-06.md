# 🟨 Curso Completo de JavaScript — De Cero Absoluto a Experto

> **Módulo 6 — El navegador: DOM, eventos, formularios y almacenamiento**
>
> Última actualización: 2026-11-13
> Nivel: intermedio
> Requisitos: Módulos 1, 2, 3, 4 y 5 completados

---

## 📋 Índice del módulo

1. [Del lenguaje al navegador](#61--del-lenguaje-al-navegador)
2. [Selección de elementos](#62--selección-de-elementos)
3. [Lectura y manipulación del DOM](#63--lectura-y-manipulación-del-dom)
4. [Eventos](#64--eventos)
5. [Formularios y validación](#65--formularios-y-validación)
6. [Almacenamiento en el navegador](#66--almacenamiento-en-el-navegador)
7. [Animación y rendimiento](#67--animación-y-rendimiento)
8. [Organización del código del navegador](#68--organización-del-código-del-navegador)
9. [Retos con solución explicada](#69--retos-con-solución-explicada)
10. [Errores, glosario y autoevaluación](#610--errores-glosario-y-autoevaluación)

---

## Convención pedagógica

Este módulo solo usa conceptos **ya explicados**. Este es el inventario exacto antes de empezar.

**Ya sabes (Módulos 1 a 5):**

- Variables, tipos, operadores, `typeof`, `in`, ternario, `===`.
- `if/else`, `switch`, `for`, `while`, `for...of`, `for...in`.
- Funciones: declaración, expresión, arrow, defaults, rest, scope, closures, recursión, HOF y callbacks.
- Arrays y objetos: literales, índices, propiedades, `length`.
- Métodos de array: `map`, `filter`, `reduce`, `find`, `some`, `every`, `sort`, `slice`, `splice`, etc.
- `Object.keys/values/entries/fromEntries/assign/hasOwn/freeze/seal`, `structuredClone`.
- Destructuring, spread/rest, `?.`, `??`.
- `Map`, `Set`, `WeakMap`, `WeakSet`.
- `this`, `call`, `apply`, `bind`, prototipos, constructores, `new`, clases, `extends`, `super`, `static`, campos privados `#`.
- Getters, setters, descriptores, `Object.create`, `Object.defineProperty`.
- `instanceof`, duck typing, mixins y composición.
- Call Stack, Event Loop, microtareas, macrotareas, timers.
- Callbacks, promesas, `async/await`, `throw`/`try/catch`, errores personalizados.
- `Promise.all`, `allSettled`, `race`, `any`, `withResolvers`.
- Patrones de concurrencia: límites, reintentos, timeouts, cancelación y deduplicación.

**Nuevo en este módulo (se explica antes de usarse):**

| Concepto | Sección |
|---|---|
| Navegador, motor de render, hilo principal | 6.1.1 |
| DOM, nodos, árbol de documentos | 6.1.2 |
| `<script>`, `defer`, `async`, `type="module"` (vista previa) | 6.1.4 |
| DevTools: Elements, Console, Sources, Application, Performance | 6.1.5 |
| `window`, `document`, `globalThis` en el navegador | 6.1.6 |
| `getElementById`, `querySelector`, `querySelectorAll` | 6.2 |
| `NodeList`, `HTMLCollection`, `children`, `childNodes` | 6.2.4 |
| `matches`, `closest`, navegación del árbol | 6.2.5 y 6.2.9 |
| `textContent`, `innerText`, `innerHTML`, `outerHTML` | 6.3 |
| Atributos, `dataset`, propiedades vs atributos | 6.3.5 y 6.3.6 |
| `classList`, `style`, `setProperty` | 6.3.7 y 6.3.8 |
| `createElement`, `append`, `prepend`, `before`, `after`, `remove` | 6.3.9 |
| `cloneNode`, `DocumentFragment`, `<template>` | 6.3.10 a 6.3.12 |
| `addEventListener`, `Event`, burbujeo, captura, delegación | 6.4 |
| `preventDefault`, `stopPropagation`, `stopImmediatePropagation` | 6.4.4 |
| Opciones `once`, `passive`, `capture`, `signal` | 6.4.9 |
| `AbortController` y `AbortSignal` en eventos | 6.4.10 |
| `CustomEvent` y `dispatchEvent` | 6.4.11 |
| `DOMContentLoaded`, `load`, `beforeunload`, `pagehide` | 6.4.13 |
| `FormData`, `submit`, `requestSubmit` | 6.5 |
| Validación HTML5 y Constraint Validation API | 6.5.6 y 6.5.7 |
| `localStorage`, `sessionStorage`, cookies | 6.6 |
| `JSON.stringify` y `JSON.parse` (vista previa de Módulo 7) | 6.6.4 |
| IndexedDB y Cache Storage (vista previa) | 6.6.6 y 6.6.7 |
| `requestAnimationFrame`, `cancelAnimationFrame` | 6.7.1 |
| Reflow, repaint, layout thrashing | 6.7.3 y 6.7.4 |
| `IntersectionObserver`, `ResizeObserver` (vista previa) | 6.7.6 y 6.7.7 |
| `debounce` y `throttle` | 6.7.8 |
| `visibilitychange`, `document.hidden` | 6.7.9 |
| Patrones de organización: IIFE, módulo, estado + render | 6.8 |
| `window.onerror`, `error`, `unhandledrejection` | 6.8.8 |
| Accesibilidad: `label`, `aria-*`, foco, teclado | 6.5.9 y 6.8.10 |

**Lo que NO usaremos todavía:**

| Concepto | Módulo |
|---|---|
| `fetch`, Axios, HTTP real, JSON a fondo, regex | Módulo 7 |
| `import`/`export` y módulos ES | Módulo 7 |
| Frameworks (React, Vue, Svelte) | Después |
| Web Components, Shadow DOM, templates avanzados | Más adelante |
| IndexedDB a fondo, Service Workers, PWA | Más adelante |
| WebSockets, Server-Sent Events | Más adelante |
| `Proxy`, `Reflect` avanzado, `Intl` | Más adelante |

> 📌 Si ves algo que no está en la lista de “ya sabes” ni en la de “nuevo”, es un error del material. Avísame y lo corrijo.

**Al terminar este módulo podrás:**

- Explicar qué es el DOM y cómo se relaciona con el HTML.
- Seleccionar, crear, modificar y eliminar elementos con seguridad.
- Manejar eventos, burbujeo, delegación y limpieza de listeners.
- Validar formularios con HTML5 y con JavaScript.
- Guardar datos en `localStorage`, `sessionStorage` y cookies con criterio.
- Animar con `requestAnimationFrame` sin bloquear el hilo.
- Organizar el código del navegador en módulos, estado y render.
- Detectar los errores clásicos: `innerHTML` con datos del usuario, listeners duplicados, consultas al DOM en bucles y `this` perdido.

---

## 6.1 — Del lenguaje al navegador

### 6.1.1 Qué es un navegador

Un navegador es mucho más que un programa que muestra páginas. Es un **host** de JavaScript: un entorno que ejecuta tu código y le ofrece APIs que el lenguaje por sí solo no tiene.

Dentro de un navegador conviven varias piezas:

| Pieza | Qué hace | Ejemplos |
|---|---|---|
| **Motor de JavaScript** | Interpreta y ejecuta el código | V8 (Chrome, Edge), SpiderMonkey (Firefox), JavaScriptCore (Safari) |
| **Motor de render** | Convierte HTML y CSS en píxeles | Blink (Chrome), Gecko (Firefox), WebKit (Safari) |
| **APIs del host** | Ofrecen DOM, eventos, almacenamiento, red | `document`, `addEventListener`, `localStorage`, `fetch` |
| **Hilo principal** | Ejecuta JS, calcula estilos, layout y parte del pintado | El mismo hilo para todo lo importante |
| **Hilos auxiliares** | Tareas pesadas fuera del hilo principal | Web Workers, compositor, red |

El **hilo principal** (main thread) es el recurso más valioso. Allí se ejecuta tu JavaScript, se calculan los estilos, se hace el layout y se pinta la página. Si tu código bloquea ese hilo, la interfaz se congela. Es la misma idea que viste en el Módulo 5: JavaScript es de un solo hilo y la asincronía delega lo lento al host.

```js
// El hilo principal ejecuta esto de forma secuencial
console.log("empieza");

// Una operación lenta bloquea todo: no hay render, no hay clics
const inicio = Date.now();
while (Date.now() - inicio < 2000) {
  // espera activa de 2 segundos
}

console.log("termina");
```

Durante esos dos segundos, el navegador no puede responder a clics, no puede repintar y no puede ejecutar otros scripts. En el Módulo 5 aprendiste a delegar operaciones lentas; en este módulo aprenderás a no bloquear el hilo mientras manipulas la interfaz.

> 🧠 **Modelo mental:** el navegador es el host; el motor de JavaScript es el invitado. El motor ejecuta tu código, pero el DOM, los eventos y el almacenamiento son APIs que el host pone a tu disposición.

### 6.1.2 Qué es el DOM

El **DOM** (Document Object Model) es la representación en memoria de un documento HTML. Cuando el navegador carga una página, lee el HTML, lo analiza y construye un **árbol de nodos**. Ese árbol es el DOM.

No es una copia del texto HTML: es una estructura viva que puedes leer y modificar con JavaScript. Cada etiqueta, cada texto y cada comentario es un **nodo**.

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Mi página</title>
  </head>
  <body>
    <h1 id="titulo">Hola</h1>
    <p class="intro">Primer párrafo</p>
    <ul>
      <li>Uno</li>
      <li>Dos</li>
    </ul>
  </body>
</html>
```

El árbol simplificado sería:

```text
document
└── html
    ├── head
    │   ├── meta
    │   └── title
    │       └── "Mi página"
    └── body
        ├── h1#titulo
        │   └── "Hola"
        ├── p.intro
        │   └── "Primer párrafo"
        └── ul
            ├── li
            │   └── "Uno"
            └── li
                └── "Dos"
```

Cada caja es un nodo. Los nodos pueden ser de varios tipos:

| Tipo | `nodeType` | Ejemplo | Qué representa |
|---|---|---|---|
| `Document` | 9 | `document` | El documento completo |
| `Element` | 1 | `<h1>`, `<p>`, `<li>` | Una etiqueta HTML |
| `Text` | 3 | `"Hola"` | Texto dentro de un elemento |
| `Comment` | 8 | `<!-- nota -->` | Un comentario HTML |
| `DocumentFragment` | 11 | `document.createDocumentFragment()` | Un contenedor temporal sin padre |

```js
console.log(document.nodeType); // 9
console.log(document.documentElement.nodeName); // "HTML"
console.log(document.body.nodeType); // 1

const titulo = document.querySelector("#titulo");
console.log(titulo.nodeType); // 1
console.log(titulo.tagName); // "H1"
console.log(titulo.firstChild.nodeType); // 3
console.log(titulo.firstChild.textContent); // "Hola"
```

**El DOM es una API, no un lenguaje.** Está definido por el estándar del W3C y el WHATWG. Los navegadores lo implementan; JavaScript es el lenguaje que usas para acceder a él. Podrías manipular el DOM desde otros lenguajes, pero en la web se hace con JavaScript.

### 6.1.3 El DOM no es HTML

Esta distinción parece menor, pero explica muchos bugs.

- **HTML** es texto: el archivo que escribes.
- **DOM** es el árbol en memoria que el navegador construye a partir de ese texto.
- El DOM puede diferir del HTML: el navegador corrige errores, cierra etiquetas y normaliza la estructura.

```html
<p>Hola
<div>Mundo</div>
```

Aunque el HTML esté mal cerrado, el navegador construye un DOM válido. El `<p>` se cierra automáticamente antes del `<div>`.

```js
console.log(document.body.innerHTML);
// "<p>Hola</p><div>Mundo</div>"
```

El HTML original no cambió en el servidor; el DOM sí se normalizó en memoria. Por eso `innerHTML` no siempre devuelve exactamente lo que escribiste.

También puedes modificar el DOM sin tocar el archivo HTML:

```js
const parrafo = document.querySelector("p");
parrafo.textContent = "Texto cambiado con JavaScript";
```

El archivo sigue igual. El cambio vive solo en la pestaña actual y desaparece al recargar, salvo que lo guardes en almacenamiento (6.6).

> ⚠️ **No confundas “ver el código fuente” con “ver el DOM”.** “Ver código fuente” muestra el HTML original. El panel Elements de DevTools muestra el DOM actual, después de que JavaScript lo haya modificado.

### 6.1.4 Cómo cargar JavaScript en HTML

Para que tu JavaScript se ejecute en una página, el HTML debe incluirlo. Hay varias formas.

**Forma 1: script al final del body.**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Mi página</title>
  </head>
  <body>
    <h1 id="titulo">Hola</h1>

    <script src="app.js"></script>
  </body>
</html>
```

El script se carga y ejecuta cuando el navegador ya leyó todo el HTML anterior. Por eso `document.querySelector("#titulo")` funciona.

**Forma 2: script en el head con `defer`.**

```html
<head>
  <meta charset="utf-8" />
  <title>Mi página</title>
  <script src="app.js" defer></script>
</head>
```

`defer` le dice al navegador: descarga el archivo en paralelo, pero ejecútalo **después** de parsear el HTML y **en el orden** en que aparecen los scripts. Es la forma recomendada para la mayoría de los casos.

**Forma 3: script en el head con `async`.**

```html
<head>
  <script src="analytics.js" async></script>
</head>
```

`async` descarga en paralelo y ejecuta **en cuanto esté listo**, sin esperar al HTML ni respetar el orden de otros scripts. Sirve para scripts independientes, como analítica o publicidad. No lo uses si el script necesita el DOM.

**Forma 4: script en línea.**

```html
<script>
  console.log("Hola desde un script en línea");
</script>
```

Se ejecuta en el punto donde aparece. Útil para pruebas pequeñas, pero difícil de mantener en proyectos grandes.

**Comparación:**

| Forma | Espera al HTML | Respeta orden | Cuándo usarla |
|---|---|---|---|
| `<script>` al final del body | Sí | Sí | Proyectos simples |
| `<script defer>` en el head | Sí | Sí | Recomendado por defecto |
| `<script async>` en el head | No | No | Scripts independientes |
| `<script type="module">` | Sí (como defer) | Sí | Módulos ES (Módulo 7) |

**Vista previa de módulos:** `<script type="module" src="app.js"></script>` se comporta como `defer`, ejecuta en modo estricto y tiene su propio ámbito. Los módulos ES se explican en el Módulo 7. Por ahora usaremos `defer` o el script al final del body.

> 🧠 **Regla práctica:** si tu script necesita el DOM, usa `defer` o colócalo al final del body. Nunca asumas que un `<script>` normal en el head encontrará los elementos.

### 6.1.5 DevTools: tu taller

Las **DevTools** (herramientas de desarrollo) son parte del navegador y son imprescindibles. Se abren con `F12`, `Ctrl+Shift+I` (Windows/Linux) o `Cmd+Option+I` (macOS).

| Panel | Para qué sirve |
|---|---|
| **Elements** | Ver y editar el DOM y los estilos |
| **Console** | Ejecutar JavaScript y ver errores |
| **Sources** | Ver archivos, poner breakpoints y depurar |
| **Network** | Ver peticiones, tiempos y respuestas |
| **Application** | Ver `localStorage`, `sessionStorage`, cookies, IndexedDB |
| **Performance** | Grabar y analizar el rendimiento |
| **Lighthouse** | Auditar accesibilidad, rendimiento y buenas prácticas |

**La consola** es tu mejor amiga. Puedes escribir JavaScript directamente y ver el resultado.

```js
document.title; // el título de la página
document.querySelectorAll("li").length; // cuántos elementos li hay
```

**Atajos útiles de la consola:**

| Atajo | Qué hace |
|---|---|
| `$0` | El elemento seleccionado en el panel Elements |
| `$("selector")` | Atajo de `document.querySelector` (solo en DevTools) |
| `$$("selector")` | Atajo de `document.querySelectorAll` (solo en DevTools) |
| `copy(objeto)` | Copia el objeto al portapapeles (solo en DevTools) |
| `clear()` | Limpia la consola |

**Métodos de consola que vale la pena conocer:**

```js
console.log("mensaje normal");
console.warn("advertencia");
console.error("error");

console.table([
  { nombre: "Ana", edad: 30 },
  { nombre: "Luis", edad: 25 },
]);

console.dir(document.body); // muestra el objeto DOM con propiedades
```

`console.table` y `console.dir` son especialmente útiles con arrays de objetos y nodos del DOM.

**Breakpoints:** en el panel Sources puedes hacer clic en el número de línea para pausar la ejecución. También puedes escribir `debugger;` en tu código. Cuando el navegador llegue ahí, se pausará y podrás inspeccionar variables.

```js
function calcularTotal(precios) {
  debugger; // el navegador se pausa aquí si DevTools está abierto
  return precios.reduce((total, precio) => total + precio, 0);
}
```

> ⚠️ **No dejes `debugger` en producción.** Pausa la ejecución y confunde a los usuarios. Úsalo solo mientras depuras.

### 6.1.6 `window`, `document` y `globalThis`

En el navegador, el **objeto global** es `window`.

```js
console.log(globalThis === window); // true
console.log(window.document === document); // true
```

- `window` es el objeto global del navegador. Contiene APIs como `setTimeout`, `localStorage`, `fetch`, `location`, `history`.
- `document` es la entrada al DOM. Es una propiedad de `window`.
- `globalThis` es una forma estándar de referirse al objeto global, sin importar el entorno. En Node apunta a `global`; en el navegador, a `window`.

```js
var nombre = "Ana";
console.log(window.nombre); // "Ana"

let edad = 30;
console.log(window.edad); // undefined
```

`var` y las funciones declaradas en el ámbito global se convierten en propiedades de `window`. `let` y `const` no. Esto es una razón más para preferir `let`/`const` y no contaminar el objeto global.

```js
// ❌ Contamina el ámbito global
var contador = 0;
function incrementar() {
  contador += 1;
}

// ✅ Mantén todo dentro de un módulo o una función
function crearContador() {
  let contador = 0;

  return function incrementar() {
    contador += 1;
    return contador;
  };
}

const siguiente = crearContador();
console.log(siguiente()); // 1
console.log(siguiente()); // 2
```

> 🧠 **Regla:** usa `window` solo cuando necesites una API global del navegador. Para tu propio código, prefiere variables locales, closures o módulos.

### 6.1.7 El DOM no existe en Node

Si intentas ejecutar `document.querySelector` en Node, obtendrás un error:

```js
// En Node:
// ReferenceError: document is not defined
console.log(document);
```

Node no tiene DOM porque no es un navegador. Tiene otras APIs (archivos, procesos, red), pero no una página que renderizar.

Para probar código de DOM fuera del navegador existen entornos simulados como **jsdom** o **happy-dom**, que implementan una parte del DOM. Los verás más adelante. En este módulo, todos los ejemplos se ejecutan en el navegador.

**Cómo probar los ejemplos:**

1. Crea una carpeta para el módulo.
2. Crea `index.html` con la estructura de 6.1.4.
3. Crea `app.js` con el código.
4. Abre `index.html` en el navegador.
5. Abre DevTools y mira la consola.

También puedes pegar fragmentos en la consola de DevTools, pero recuerda que al recargar la página se pierde todo.

### 6.1.8 Primer programa: leer y cambiar el DOM

Vamos a hacer algo pequeño pero completo. Este HTML tiene un título, un párrafo y un botón:

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Mi primera página dinámica</title>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1 id="titulo">Bienvenido</h1>
    <p id="mensaje">Este texto lo cambia JavaScript.</p>
    <button id="boton">Cambiar mensaje</button>
  </body>
</html>
```

Y este JavaScript:

```js
const titulo = document.querySelector("#titulo");
const mensaje = document.querySelector("#mensaje");
const boton = document.querySelector("#boton");

console.log("Título:", titulo.textContent);

boton.addEventListener("click", () => {
  mensaje.textContent = "¡Has hecho clic!";
  titulo.classList.add("destacado");
});
```

Al abrir la página, la consola muestra el título. Al hacer clic en el botón, el párrafo cambia y el título recibe la clase `destacado`.

**Qué está pasando, paso a paso:**

1. `document.querySelector("#titulo")` busca el primer elemento cuyo `id` sea `titulo`.
2. `textContent` lee el texto del elemento.
3. `addEventListener("click", ...)` registra una función que se ejecutará cuando el usuario haga clic.
4. Dentro del listener, `mensaje.textContent = ...` cambia el texto.
5. `classList.add("destacado")` añade una clase CSS.

Para que el cambio se vea, añade un poco de CSS:

```html
<style>
  .destacado {
    color: #b45309;
  }
</style>
```

**Versión con `defer` y buenas prácticas:**

```js
// app.js
function iniciar() {
  const titulo = document.querySelector("#titulo");
  const mensaje = document.querySelector("#mensaje");
  const boton = document.querySelector("#boton");

  if (!titulo || !mensaje || !boton) {
    console.error("Faltan elementos en el HTML");
    return;
  }

  boton.addEventListener("click", () => {
    mensaje.textContent = "¡Has hecho clic!";
    titulo.classList.add("destacado");
  });
}

iniciar();
```

La comprobación `if (!titulo || ...)` evita errores si el HTML cambia. En 6.2.6 veremos esto en detalle.

### ✅ Haz esto / ❌ Evita esto (6.1)

```js
// ✅ Usa defer o coloca el script al final del body
// <script src="app.js" defer></script>

// ✅ Comprueba que los elementos existen antes de usarlos
const boton = document.querySelector("#boton");
if (boton) {
  boton.addEventListener("click", manejarClic);
}

// ✅ Mantén tu código en funciones y evita globals
function iniciar() {
  // ...
}

iniciar();

// ❌ Ejecutar el script en el head sin defer y buscar elementos
// <script src="app.js"></script> <!-- el DOM aún no existe -->

// ❌ Asumir que querySelector siempre encuentra algo
document.querySelector("#no-existe").textContent = "boom"; // TypeError

// ❌ Usar var para todo y contaminar window
var estado = {};
```

---

## 6.2 — Selección de elementos

Antes de modificar algo, necesitas encontrarlo. El DOM ofrece varias formas de seleccionar elementos. No todas son iguales: algunas devuelven un elemento, otras una lista, y algunas son más rápidas o más flexibles.

### 6.2.1 `getElementById`

`document.getElementById(id)` busca un elemento por su atributo `id`. Devuelve el elemento o `null` si no existe.

```html
<h1 id="titulo">Hola</h1>
```

```js
const titulo = document.getElementById("titulo");
console.log(titulo.textContent); // "Hola"
```

Es el método más directo y uno de los más rápidos, porque los navegadores mantienen un índice de IDs. Pero solo sirve para IDs, y los IDs deben ser únicos en la página.

```js
// ❌ No hace falta el "#"
const mal = document.getElementById("#titulo"); // null

// ✅ Sin almohadilla
const bien = document.getElementById("titulo");
```

**Cuándo usarlo:** cuando ya tienes un `id` claro y único. Para todo lo demás, `querySelector` es más flexible.

### 6.2.2 `querySelector`

`document.querySelector(selector)` acepta cualquier selector CSS válido y devuelve **el primer elemento** que coincide, o `null`.

```html
<h1 class="titulo">Hola</h1>
<p class="intro">Primer párrafo</p>
<p class="intro">Segundo párrafo</p>
```

```js
const titulo = document.querySelector(".titulo");
const primerIntro = document.querySelector(".intro");

console.log(titulo.textContent); // "Hola"
console.log(primerIntro.textContent); // "Primer párrafo"
```

**Selectores CSS básicos que puedes usar:**

| Selector | Significado | Ejemplo |
|---|---|---|
| `#id` | Por ID | `querySelector("#titulo")` |
| `.clase` | Por clase | `querySelector(".intro")` |
| `etiqueta` | Por etiqueta | `querySelector("h1")` |
| `[atributo]` | Por atributo | `querySelector("[data-id]")` |
| `[atributo="valor"]` | Atributo con valor | `querySelector('[type="email"]')` |
| `padre hijo` | Descendiente | `querySelector("ul li")` |
| `padre > hijo` | Hijo directo | `querySelector("ul > li")` |
| `:first-child` | Primer hijo | `querySelector("li:first-child")` |
| `:nth-child(2)` | Segundo hijo | `querySelector("li:nth-child(2)")` |
| `:not(.activo)` | Que no tenga la clase | `querySelector("li:not(.activo)")` |

```js
// El primer li dentro de ul
const primerItem = document.querySelector("ul li");

// El input de tipo email
const email = document.querySelector('input[type="email"]');

// El primer enlace con target="_blank"
const externo = document.querySelector('a[target="_blank"]');

// El primer li que no está activo
const inactivo = document.querySelector("li:not(.activo)");
```

**Importante:** `querySelector` devuelve solo el primero. Si hay varios, necesitas `querySelectorAll`.

### 6.2.3 `querySelectorAll`

`document.querySelectorAll(selector)` devuelve **todos** los elementos que coinciden, en un `NodeList`.

```html
<ul>
  <li class="item">Uno</li>
  <li class="item">Dos</li>
  <li class="item">Tres</li>
</ul>
```

```js
const items = document.querySelectorAll(".item");

console.log(items.length); // 3
console.log(items[0].textContent); // "Uno"

items.forEach((item) => {
  console.log(item.textContent);
});
```

Un `NodeList` no es un array, pero tiene `forEach` y `length`. No tiene `map`, `filter` ni `reduce`. Para usar métodos de array, conviértelo:

```js
const items = document.querySelectorAll(".item");

// ✅ Convertir a array
const textos = Array.from(items).map((item) => item.textContent);
console.log(textos); // ["Uno", "Dos", "Tres"]

// ✅ También con spread
const textos2 = [...items].map((item) => item.textContent);
```

**`NodeList` estático:** `querySelectorAll` devuelve una lista **estática**. Si el DOM cambia después, la lista no se actualiza.

```js
const items = document.querySelectorAll(".item");
console.log(items.length); // 3

const nuevo = document.createElement("li");
nuevo.className = "item";
nuevo.textContent = "Cuatro";
document.querySelector("ul").append(nuevo);

console.log(items.length); // 3 (la lista no cambió)
console.log(document.querySelectorAll(".item").length); // 4
```

Esto es importante: si añades elementos, vuelve a consultar o usa delegación de eventos (6.4.6).

### 6.2.4 `NodeList` vs `HTMLCollection` vs Array

No todos los métodos devuelven lo mismo. Esta tabla evita confusiones:

| Método | Devuelve | ¿Vivo? | ¿Tiene `forEach`? | ¿Tiene `map`? |
|---|---|---|---|---|
| `querySelectorAll` | `NodeList` | No (estático) | Sí | No |
| `getElementsByClassName` | `HTMLCollection` | Sí | No | No |
| `getElementsByTagName` | `HTMLCollection` | Sí | No | No |
| `element.children` | `HTMLCollection` | Sí | No | No |
| `element.childNodes` | `NodeList` | Sí | Sí | No |
| `Array.from(...)` | `Array` | No | Sí | Sí |

**`HTMLCollection` vivo:** se actualiza automáticamente cuando el DOM cambia.

```html
<ul id="lista">
  <li>Uno</li>
  <li>Dos</li>
</ul>
```

```js
const lista = document.getElementById("lista");
const itemsVivos = lista.getElementsByTagName("li");
const itemsEstaticos = lista.querySelectorAll("li");

console.log(itemsVivos.length); // 2
console.log(itemsEstaticos.length); // 2

const nuevo = document.createElement("li");
nuevo.textContent = "Tres";
lista.append(nuevo);

console.log(itemsVivos.length); // 3 (vivo)
console.log(itemsEstaticos.length); // 2 (estático)
```

**`childNodes` vs `children`:**

- `childNodes` incluye **todos** los nodos: elementos, texto y comentarios.
- `children` incluye solo **elementos**.

```html
<ul id="lista">
  <li>Uno</li>
  <li>Dos</li>
</ul>
```

```js
const lista = document.getElementById("lista");

console.log(lista.childNodes.length); // 5 (incluye saltos de línea)
console.log(lista.children.length); // 2 (solo li)

console.log(lista.childNodes[0].nodeType); // 3 (texto)
console.log(lista.children[0].tagName); // "LI"
```

En HTML con saltos de línea, `childNodes` suele incluir nodos de texto que representan los espacios. Casi siempre querrás `children` o `querySelectorAll`.

**Convertir a array:**

```js
const coleccion = document.getElementsByClassName("item");

// ✅
const array = Array.from(coleccion);
const array2 = [...coleccion];

// ❌ HTMLCollection no tiene map
// coleccion.map(...) // TypeError
```

### 6.2.5 `matches` y `closest`

`element.matches(selector)` comprueba si el elemento coincide con un selector.

```html
<button class="boton primario">Guardar</button>
```

```js
const boton = document.querySelector(".boton");

console.log(boton.matches(".primario")); // true
console.log(boton.matches("button")); // true
console.log(boton.matches(".secundario")); // false
```

`element.closest(selector)` busca el elemento actual o su ancestro más cercano que coincida. Si no encuentra ninguno, devuelve `null`.

```html
<ul id="lista">
  <li class="item" data-id="1">
    <button class="eliminar">Eliminar</button>
  </li>
</ul>
```

```js
const boton = document.querySelector(".eliminar");

const item = boton.closest(".item");
console.log(item.dataset.id); // "1"

const lista = boton.closest("ul");
console.log(lista.id); // "lista"

console.log(boton.closest(".no-existe")); // null
```

`closest` es la base de la delegación de eventos (6.4.6). Cuando un clic ocurre en un hijo, puedes subir hasta el contenedor que te interesa.

### 6.2.6 Cuando no existe: `null`

Todos los métodos de selección devuelven `null` si no encuentran nada (excepto los que devuelven listas, que devuelven una lista vacía). Si intentas acceder a una propiedad de `null`, obtienes un `TypeError`.

```js
const noExiste = document.querySelector("#no-existe");
console.log(noExiste); // null

// ❌ TypeError: Cannot read properties of null
// console.log(noExiste.textContent);
```

**Comprobación básica:**

```js
const titulo = document.querySelector("#titulo");

if (titulo) {
  titulo.textContent = "Nuevo título";
}
```

**Con optional chaining (Módulo 1):**

```js
const titulo = document.querySelector("#titulo");
titulo?.classList.add("activo");
```

**Con `console.assert`:**

```js
const titulo = document.querySelector("#titulo");
console.assert(titulo !== null, "Falta el elemento #titulo");
```

`console.assert` no detiene la ejecución; solo muestra un error en la consola si la condición es falsa. Es útil para detectar HTML incompleto durante el desarrollo.

> 🧠 **Regla:** después de una selección, pregúntate siempre: “¿y si no existe?”. Si el elemento es obligatorio, falla pronto con un mensaje claro; si es opcional, usa `?.` o un `if`.

### 6.2.7 Selección desde un elemento

No siempre necesitas buscar en todo el documento. Puedes buscar dentro de un elemento:

```html
<section id="productos">
  <h2>Productos</h2>
  <ul>
    <li>Camisa</li>
    <li>Pantalón</li>
  </ul>
</section>

<section id="usuarios">
  <h2>Usuarios</h2>
  <ul>
    <li>Ana</li>
    <li>Luis</li>
  </ul>
</section>
```

```js
const productos = document.querySelector("#productos");
const itemsProductos = productos.querySelectorAll("li");

console.log(itemsProductos.length); // 2
console.log(itemsProductos[0].textContent); // "Camisa"
```

Buscar desde un elemento es más eficiente y más seguro: evita seleccionar elementos de otra sección con la misma clase.

```js
// ❌ Selecciona el primero de toda la página
const primero = document.querySelector(".item");

// ✅ Selecciona solo dentro de la sección
const seccion = document.querySelector("#productos");
const primeroDeProductos = seccion.querySelector(".item");
```

### 6.2.8 Rendimiento y caché de selecciones

Consultar el DOM tiene un costo. No es enorme, pero se nota si lo haces miles de veces en un bucle o en un evento que se dispara muchas veces.

```js
// ❌ Consulta el DOM en cada iteración
for (let i = 0; i < 1000; i++) {
  document.querySelector("#contador").textContent = i;
}

// ✅ Guarda la referencia una vez
const contador = document.querySelector("#contador");

for (let i = 0; i < 1000; i++) {
  contador.textContent = i;
}
```

**Cuándo cachear:**

- Dentro de una función que se ejecuta muchas veces.
- En un listener que se dispara con frecuencia (`scroll`, `input`, `mousemove`).
- Cuando el elemento no se va a reemplazar.

**Cuándo no cachear:**

- Si el elemento puede desaparecer y ser reemplazado por otro. Una referencia cacheada puede quedar obsoleta.
- Si el costo de la consulta es irrelevante y el código queda más claro.

```js
// Si el DOM se reemplaza, la referencia antigua ya no está en el documento
const contenedor = document.querySelector("#contenedor");
contenedor.innerHTML = "<p>Nuevo contenido</p>";

// ✅ Vuelve a consultar si necesitas el nuevo elemento
const nuevoParrafo = document.querySelector("#contenedor p");
```

### 6.2.9 Navegación del árbol

Además de seleccionar, puedes moverte por el árbol usando propiedades de los nodos.

| Propiedad | Qué devuelve |
|---|---|
| `parentElement` | El elemento padre (o `null`) |
| `parentNode` | El nodo padre (puede ser `document`) |
| `children` | `HTMLCollection` de hijos elementos |
| `childNodes` | `NodeList` de todos los hijos (incluye texto) |
| `firstElementChild` | Primer hijo elemento |
| `lastElementChild` | Último hijo elemento |
| `nextElementSibling` | Siguiente hermano elemento |
| `previousElementSibling` | Hermano elemento anterior |
| `nextSibling` | Siguiente nodo (puede ser texto) |
| `previousSibling` | Nodo anterior (puede ser texto) |

```html
<ul id="lista">
  <li id="uno">Uno</li>
  <li id="dos">Dos</li>
  <li id="tres">Tres</li>
</ul>
```

```js
const dos = document.querySelector("#dos");

console.log(dos.parentElement.id); // "lista"
console.log(dos.previousElementSibling.id); // "uno"
console.log(dos.nextElementSibling.id); // "tres"

const lista = document.querySelector("#lista");
console.log(lista.firstElementChild.id); // "uno"
console.log(lista.lastElementChild.id); // "tres"
console.log(lista.children.length); // 3
```

**Cuidado con los nodos de texto:**

```js
console.log(dos.nextSibling); // puede ser un nodo de texto (salto de línea)
console.log(dos.nextElementSibling); // siempre un elemento
```

Casi siempre querrás las propiedades `*Element*` para evitar nodos de texto inesperados.

### ✅ Haz esto / ❌ Evita esto (6.2)

```js
// ✅ Usa querySelector para un elemento y querySelectorAll para varios
const boton = document.querySelector("#guardar");
const items = document.querySelectorAll(".item");

// ✅ Convierte NodeList a array si necesitas map/filter/reduce
const textos = Array.from(items).map((item) => item.textContent);

// ✅ Busca dentro de un contenedor cuando sea posible
const lista = document.querySelector("#lista");
const itemsDeLista = lista.querySelectorAll("li");

// ✅ Comprueba null antes de usar el resultado
if (boton) {
  boton.disabled = true;
}

// ✅ Cachea referencias que uses muchas veces
const contador = document.querySelector("#contador");
function actualizar(valor) {
  contador.textContent = valor;
}

// ❌ Consultar el DOM dentro de un bucle
for (let i = 0; i < 100; i++) {
  document.querySelector("#contador").textContent = i;
}

// ❌ Usar getElementById con "#"
document.getElementById("#titulo"); // null

// ❌ Asumir que querySelectorAll es un array
const items2 = document.querySelectorAll(".item");
items2.map((item) => item.textContent); // TypeError

// ❌ Usar childNodes cuando quieres solo elementos
lista.childNodes.forEach((nodo) => {
  nodo.classList.add("activo"); // falla en nodos de texto
});
```

---

## 6.3 — Lectura y manipulación del DOM

Ya sabes encontrar elementos. Ahora vas a leer su contenido, cambiarlo, crear nodos y eliminarlos. Esta es la parte que convierte una página estática en una aplicación.

### 6.3.1 `textContent`

`textContent` lee o escribe el texto de un nodo y de todos sus descendientes. Es la forma más segura de trabajar con texto.

```html
<p id="mensaje">Hola <strong>mundo</strong></p>
```

```js
const mensaje = document.querySelector("#mensaje");

console.log(mensaje.textContent); // "Hola mundo"

mensaje.textContent = "Texto nuevo";
console.log(mensaje.innerHTML); // "Texto nuevo"
```

Al asignar `textContent`, **todo** el contenido anterior se reemplaza por un nodo de texto. Las etiquetas HTML que escribas se muestran como texto literal, no se interpretan:

```js
mensaje.textContent = "<strong>No soy negrita</strong>";
console.log(mensaje.innerHTML); // "&lt;strong&gt;No soy negrita&lt;/strong&gt;"
```

Esto es exactamente lo que quieres cuando el contenido viene del usuario: no se ejecuta HTML ni scripts.

**Leer solo el texto de un hijo:**

```html
<div id="tarjeta">
  <h2>Título</h2>
  <p>Descripción</p>
</div>
```

```js
const tarjeta = document.querySelector("#tarjeta");
console.log(tarjeta.textContent);
// "TítuloDescripción" (sin espacios si el HTML no los tiene)
```

`textContent` incluye el texto de todos los descendientes, pero no añade espacios entre ellos. Si necesitas preservar la estructura, recorre los hijos o usa `innerText`.

### 6.3.2 `innerText` vs `textContent`

`innerText` también lee y escribe texto, pero tiene en cuenta el **renderizado**: respeta `display: none`, los saltos de línea visuales y los estilos.

```html
<p id="parrafo">
  Hola
  <span style="display: none">oculto</span>
  mundo
</p>
```

```js
const parrafo = document.querySelector("#parrafo");

console.log(parrafo.textContent); // "Hola oculto mundo"
console.log(parrafo.innerText); // "Hola mundo" (sin lo oculto)
```

| Propiedad | Incluye texto oculto | Respeta saltos visuales | Costo | Uso recomendado |
|---|---|---|---|---|
| `textContent` | Sí | No | Bajo | Leer/escribir texto por defecto |
| `innerText` | No | Sí | Alto (fuerza layout) | Cuando necesitas el texto visible |

**Regla:** usa `textContent` por defecto. `innerText` obliga al navegador a calcular estilos y layout, lo que puede ser lento si lo usas en bucles o eventos frecuentes.

```js
// ❌ Puede provocar reflow en cada lectura
for (const item of items) {
  console.log(item.innerText);
}

// ✅
for (const item of items) {
  console.log(item.textContent);
}
```

### 6.3.3 `innerHTML`

`innerHTML` lee o escribe el HTML interno de un elemento. Al asignar, el navegador **parsea** la cadena y crea nodos.

```html
<div id="contenedor"></div>
```

```js
const contenedor = document.querySelector("#contenedor");

contenedor.innerHTML = "<p>Hola <strong>mundo</strong></p>";
console.log(contenedor.textContent); // "Hola mundo"
```

Es cómodo para construir HTML, pero peligroso si el contenido viene del usuario. También puede ser lento si se usa repetidamente, porque vuelve a parsear y reconstruir el árbol.

```js
// ✅ HTML controlado por ti
contenedor.innerHTML = "<p>Mensaje del sistema</p>";

// ❌ HTML que viene del usuario
contenedor.innerHTML = `<p>${comentario}</p>`; // XSS
```

`outerHTML` lee o reemplaza el elemento completo, incluida su propia etiqueta:

```js
const parrafo = document.querySelector("#mensaje");
console.log(parrafo.outerHTML); // "<p id="mensaje">...</p>"

parrafo.outerHTML = "<div>Ahora soy un div</div>";
```

> ⚠️ `outerHTML` reemplaza el nodo en el DOM. La variable `parrafo` sigue apuntando al nodo antiguo, que ya no está en el documento.

### 6.3.4 XSS: nunca confíes en el usuario

**XSS** (Cross-Site Scripting) es una vulnerabilidad que permite inyectar código malicioso en una página. Ocurre cuando insertas datos no confiables como HTML.

```js
// ❌ Vulnerable
const comentario = '<img src="x" onerror="alert(\'XSS\')">';
document.querySelector("#comentarios").innerHTML = comentario;
```

El navegador crea una imagen, falla al cargarla y ejecuta `onerror`. El atacante puede robar cookies, enviar datos o manipular la página.

**Formas seguras:**

```js
// ✅ 1. textContent para texto
const comentario = '<img src="x" onerror="alert(1)">';
document.querySelector("#comentarios").textContent = comentario;

// ✅ 2. createElement + textContent
const parrafo = document.createElement("p");
parrafo.textContent = comentario;
document.querySelector("#comentarios").append(parrafo);

// ✅ 3. Escapar si de verdad necesitas construir HTML
function escaparHTML(texto) {
  return texto
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const seguro = escaparHTML(comentario);
document.querySelector("#comentarios").innerHTML = `<p>${seguro}</p>`;
```

**Regla de oro:** si el dato viene de un usuario, una URL, una API o `localStorage`, no lo insertes con `innerHTML`. Usa `textContent` o crea nodos.

```js
// ❌ También es peligroso
elemento.insertAdjacentHTML("beforeend", comentario);
elemento.outerHTML = comentario;
elemento.setAttribute("onclick", comentario);

// ✅
elemento.textContent = comentario;
elemento.append(document.createTextNode(comentario));
```

En el Módulo 7 verás `fetch` y APIs reales. La regla se mantiene: **trata toda respuesta externa como no confiable**.

### 6.3.5 Atributos

Los atributos HTML se leen y escriben con métodos específicos.

```html
<a id="enlace" href="/inicio" target="_blank" data-id="42">Inicio</a>
```

```js
const enlace = document.querySelector("#enlace");

console.log(enlace.getAttribute("href")); // "/inicio"
console.log(enlace.hasAttribute("target")); // true

enlace.setAttribute("href", "/dashboard");
enlace.setAttribute("rel", "noopener");
enlace.removeAttribute("target");

console.log(enlace.getAttribute("rel")); // "noopener"
console.log(enlace.hasAttribute("target")); // false
```

**`dataset` para atributos `data-*`:**

Los atributos que empiezan por `data-` se acceden con `element.dataset`. El nombre se convierte a camelCase.

```html
<div id="producto" data-id="7" data-precio="19.99" data-categoria="ropa"></div>
```

```js
const producto = document.querySelector("#producto");

console.log(producto.dataset.id); // "7"
console.log(producto.dataset.precio); // "19.99"
console.log(producto.dataset.categoria); // "ropa"

producto.dataset.stock = "10";
console.log(producto.getAttribute("data-stock")); // "10"

delete producto.dataset.categoria;
console.log(producto.hasAttribute("data-categoria")); // false
```

`dataset` siempre devuelve strings. Si necesitas números, conviértelos:

```js
const precio = Number(producto.dataset.precio);
console.log(typeof precio); // "number"
```

**`toggleAttribute`:**

```js
const boton = document.querySelector("#boton");

boton.toggleAttribute("disabled");
console.log(boton.hasAttribute("disabled")); // true

boton.toggleAttribute("disabled");
console.log(boton.hasAttribute("disabled")); // false
```

### 6.3.6 Propiedades vs atributos

Esta es una de las confusiones más comunes. Un atributo es lo que está escrito en el HTML. Una propiedad es lo que el objeto DOM tiene en memoria. A veces coinciden; a veces no.

```html
<input id="nombre" type="text" value="Ana" />
```

```js
const input = document.querySelector("#nombre");

console.log(input.getAttribute("value")); // "Ana" (atributo inicial)
console.log(input.value); // "Ana" (valor actual)

input.value = "Luis";

console.log(input.getAttribute("value")); // "Ana" (no cambió)
console.log(input.value); // "Luis" (sí cambió)
```

El atributo `value` es el valor **inicial** (default). La propiedad `value` es el valor **actual**. Si el usuario escribe, la propiedad cambia, pero el atributo no.

Lo mismo ocurre con `checked`:

```html
<input id="acepto" type="checkbox" checked />
```

```js
const checkbox = document.querySelector("#acepto");

console.log(checkbox.checked); // true
console.log(checkbox.getAttribute("checked")); // "" (atributo booleano)

checkbox.checked = false;
console.log(checkbox.checked); // false
console.log(checkbox.hasAttribute("checked")); // true (el atributo sigue)
```

| Concepto | Atributo | Propiedad |
|---|---|---|
| `value` de un input | Valor inicial | Valor actual |
| `checked` | Estado inicial | Estado actual |
| `disabled` | Presente o no | Booleano actual |
| `href` | Texto tal cual | URL absoluta resuelta |
| `class` | Cadena de clases | `className` / `classList` |
| `style` | Texto CSS | Objeto `CSSStyleDeclaration` |

```js
const enlace = document.querySelector("a");
console.log(enlace.getAttribute("href")); // "/inicio"
console.log(enlace.href); // "https://ejemplo.com/inicio"
```

**Regla:** para estados interactivos (`value`, `checked`, `selected`, `disabled`), usa la propiedad. Para atributos que no tienen propiedad equivalente o que necesitas tal cual están en el HTML, usa `getAttribute`/`setAttribute`.

```js
// ✅
input.value = "Nuevo";
checkbox.checked = true;
boton.disabled = true;

// ✅
enlace.setAttribute("aria-label", "Inicio");
imagen.setAttribute("alt", "Descripción");

// ❌
input.setAttribute("value", "Nuevo"); // cambia el default, no el valor actual
```

### 6.3.7 `classList`

`classList` es la forma limpia de manipular clases CSS. Evita concatenar strings con `className`.

```html
<div id="caja" class="caja"></div>
```

```js
const caja = document.querySelector("#caja");

caja.classList.add("activa");
caja.classList.add("grande", "roja"); // varias a la vez

console.log(caja.classList.contains("activa")); // true

caja.classList.remove("roja");
caja.classList.toggle("activa"); // la quita porque ya estaba
caja.classList.toggle("activa"); // la pone de nuevo

caja.classList.replace("grande", "pequena");
console.log(caja.className); // "caja activa pequena"
```

**Métodos:**

| Método | Qué hace |
|---|---|
| `add(...clases)` | Añade una o varias clases |
| `remove(...clases)` | Quita una o varias clases |
| `toggle(clase, force?)` | Añade si no está, quita si está. `force` obliga |
| `contains(clase)` | Devuelve `true` o `false` |
| `replace(vieja, nueva)` | Reemplaza una clase por otra |
| `item(indice)` | Devuelve la clase en esa posición |
| `length` | Número de clases |

```js
// toggle con force
caja.classList.toggle("activa", true); // siempre añade
caja.classList.toggle("activa", false); // siempre quita
```

**`className` vs `classList`:**

```js
// ❌ Difícil de mantener y propenso a errores
caja.className = caja.className + " activa";

// ✅
caja.classList.add("activa");

// ⚠️ className reemplaza todas las clases
caja.className = "nueva"; // borra las anteriores
```

> 🧠 **Regla:** usa `classList` para añadir, quitar o alternar. Usa `className` solo cuando quieras reemplazar todas las clases de golpe.

### 6.3.8 `style`

`element.style` permite leer y escribir estilos en línea. Las propiedades CSS con guion se escriben en camelCase.

```html
<div id="caja">Contenido</div>
```

```js
const caja = document.querySelector("#caja");

caja.style.backgroundColor = "tomato";
caja.style.padding = "16px";
caja.style.borderRadius = "8px";

console.log(caja.style.backgroundColor); // "tomato"
```

**Propiedades con guion:**

```js
// ❌ La propiedad con guion no es válida como identificador
// caja.style.background-color = "red"; // SyntaxError

// ✅ camelCase
caja.style.backgroundColor = "red";

// ✅ O con setProperty
caja.style.setProperty("background-color", "red");
console.log(caja.style.getPropertyValue("background-color")); // "red"
```

**Variables CSS:**

```js
caja.style.setProperty("--color-principal", "#2563eb");
```

```css
.caja {
  color: var(--color-principal);
}
```

**`cssText`:**

```js
caja.style.cssText = "color: white; background: black; padding: 10px;";
```

`cssText` reemplaza todos los estilos en línea. Es útil para aplicar un bloque completo, pero puede borrar estilos que ya tenías.

**Leer estilos calculados:**

`element.style` solo lee estilos en línea, no los de una hoja CSS. Para leer el estilo final calculado:

```js
const estilos = getComputedStyle(caja);
console.log(estilos.backgroundColor);
console.log(estilos.fontSize);
```

**Regla:** para cambios visuales reutilizables, usa clases CSS. Reserva `style` para valores dinámicos que no puedes expresar con una clase.

```js
// ✅ Clase para un estado
caja.classList.add("oculta");

// ✅ Estilo dinámico para una posición calculada
caja.style.transform = `translateX(${x}px)`;

// ❌ Mezclar muchos estilos en línea
caja.style.color = "red";
caja.style.background = "blue";
caja.style.padding = "10px";
```

### 6.3.9 Crear e insertar nodos

Para crear contenido de forma segura, construye nodos con `createElement` y `createTextNode`.

```js
const parrafo = document.createElement("p");
parrafo.textContent = "Hola desde JavaScript";

const texto = document.createTextNode("Texto suelto");

document.body.append(parrafo);
document.body.append(texto);
```

**Métodos de inserción modernos:**

| Método | Dónde inserta |
|---|---|
| `padre.append(nodo)` | Al final de `padre` |
| `padre.prepend(nodo)` | Al principio de `padre` |
| `nodo.before(otro)` | Antes de `nodo` |
| `nodo.after(otro)` | Después de `nodo` |
| `nodo.replaceWith(otro)` | Reemplaza `nodo` |
| `nodo.remove()` | Elimina `nodo` |

```html
<ul id="lista">
  <li id="segundo">Segundo</li>
</ul>
```

```js
const lista = document.querySelector("#lista");
const segundo = document.querySelector("#segundo");

const primero = document.createElement("li");
primero.textContent = "Primero";
segundo.before(primero);

const tercero = document.createElement("li");
tercero.textContent = "Tercero";
segundo.after(tercero);

const ultimo = document.createElement("li");
ultimo.textContent = "Último";
lista.append(ultimo);

const nuevoPrimero = document.createElement("li");
nuevoPrimero.textContent = "Nuevo primero";
lista.prepend(nuevoPrimero);

console.log(lista.textContent);
// "Nuevo primeroPrimeroSegundoTerceroÚltimo"
```

**`append` vs `appendChild`:**

- `append` acepta varios nodos y también strings.
- `appendChild` acepta un solo nodo y devuelve el nodo insertado.

```js
const p = document.createElement("p");
p.append("Hola ", document.createElement("strong"), " mundo");
// El strong queda vacío; para darle texto, asígnalo antes.

const strong = document.createElement("strong");
strong.textContent = "mundo";
p.append("Hola ", strong);
```

**Insertar texto:**

```js
const p = document.createElement("p");
p.append("Texto seguro"); // crea un nodo de texto
```

**Eliminar:**

```js
const item = document.querySelector("#segundo");
item.remove();

// Alternativa antigua
// item.parentElement.removeChild(item);
```

> ⚠️ `append`, `prepend`, `before`, `after` y `replaceWith` aceptan strings, pero los insertan como texto. No interpretan HTML. Para HTML controlado existe `insertAdjacentHTML` (6.3.13), pero recuerda el riesgo de XSS.

### 6.3.10 `cloneNode`

`cloneNode` copia un nodo. Con `true` copia también todos sus descendientes (copia profunda).

```html
<div id="original">
  <h2>Título</h2>
  <p>Descripción</p>
</div>
```

```js
const original = document.querySelector("#original");

const superficial = original.cloneNode(false);
console.log(superficial.children.length); // 0

const profundo = original.cloneNode(true);
console.log(profundo.children.length); // 2

document.body.append(profundo);
```

**Cuidado con los IDs:** una copia profunda conserva los `id`, y los IDs deben ser únicos.

```js
const copia = original.cloneNode(true);
copia.id = "copia";
copia.querySelectorAll("[id]").forEach((el) => {
  el.id = `${el.id}-copia`;
});
```

**Caso típico: clonar una plantilla.**

```html
<template id="plantilla-item">
  <li class="item">
    <span class="nombre"></span>
    <button class="eliminar">Eliminar</button>
  </li>
</template>
```

```js
const plantilla = document.querySelector("#plantilla-item");
const lista = document.querySelector("#lista");

const clon = plantilla.content.cloneNode(true);
clon.querySelector(".nombre").textContent = "Nuevo item";
lista.append(clon);
```

### 6.3.11 `DocumentFragment`

Un `DocumentFragment` es un contenedor temporal que no está en el DOM. Puedes añadirle nodos y luego insertarlo de una vez. Esto reduce la cantidad de operaciones sobre el documento.

```js
const fragmento = document.createDocumentFragment();

for (let i = 1; i <= 100; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragmento.append(li);
}

document.querySelector("#lista").append(fragmento);
```

Sin fragmento, cada `append` al DOM real puede provocar trabajo de layout. Con fragmento, construyes todo fuera y haces una sola inserción.

```js
// ❌ 100 inserciones al DOM
for (let i = 1; i <= 100; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  document.querySelector("#lista").append(li);
}

// ✅ 1 inserción al DOM
const fragmento = document.createDocumentFragment();
for (let i = 1; i <= 100; i++) {
  const li = document.createElement("li");
  li.textContent = `Item ${i}`;
  fragmento.append(li);
}
document.querySelector("#lista").append(fragmento);
```

> 🧠 **Modelo mental:** el fragmento es una caja de cartón. Metes todo dentro y luego vuelcas la caja en el DOM de una sola vez.

### 6.3.12 `<template>`

La etiqueta `<template>` guarda HTML que no se renderiza hasta que lo clonas. Es ideal para crear filas, tarjetas o elementos repetidos.

```html
<template id="plantilla-tarjeta">
  <article class="tarjeta">
    <h3 class="titulo"></h3>
    <p class="descripcion"></p>
  </article>
</template>

<div id="contenedor"></div>
```

```js
const plantilla = document.querySelector("#plantilla-tarjeta");
const contenedor = document.querySelector("#contenedor");

const datos = [
  { titulo: "Primero", descripcion: "Descripción del primero" },
  { titulo: "Segundo", descripcion: "Descripción del segundo" },
];

for (const dato of datos) {
  const clon = plantilla.content.cloneNode(true);
  clon.querySelector(".titulo").textContent = dato.titulo;
  clon.querySelector(".descripcion").textContent = dato.descripcion;
  contenedor.append(clon);
}
```

**Ventajas:**

- El HTML de la plantilla queda fuera del flujo de render.
- Se clona de forma profunda con `content.cloneNode(true)`.
- Evita construir HTML con strings y `innerHTML`.

**Diferencia con `DocumentFragment`:** `<template>` es una etiqueta HTML con contenido inerte; `DocumentFragment` es un nodo temporal creado en JS. Puedes combinar ambos: clonar la plantilla y añadir los clones a un fragmento antes de insertarlos.

### 6.3.13 `insertAdjacentHTML`, `insertAdjacentElement`, `insertAdjacentText`

Estos métodos insertan contenido en posiciones relativas a un elemento.

| Posición | Dónde |
|---|---|
| `"beforebegin"` | Antes del elemento |
| `"afterbegin"` | Dentro, al principio |
| `"beforeend"` | Dentro, al final |
| `"afterend"` | Después del elemento |

```html
<div id="caja"><p>Contenido</p></div>
```

```js
const caja = document.querySelector("#caja");

caja.insertAdjacentHTML("beforebegin", "<p>Antes</p>");
caja.insertAdjacentHTML("afterbegin", "<p>Al principio</p>");
caja.insertAdjacentHTML("beforeend", "<p>Al final</p>");
caja.insertAdjacentHTML("afterend", "<p>Después</p>");
```

**`insertAdjacentElement`** inserta un nodo ya creado:

```js
const nuevo = document.createElement("p");
nuevo.textContent = "Nuevo";
caja.insertAdjacentElement("beforeend", nuevo);
```

**`insertAdjacentText`** inserta texto seguro:

```js
caja.insertAdjacentText("beforeend", "<strong>Esto es texto</strong>");
```

> ⚠️ `insertAdjacentHTML` interpreta HTML. Si el contenido viene del usuario, usa `insertAdjacentText` o `textContent`.

### 6.3.14 Renderizado por lotes y reflow

Cada cambio en el DOM puede obligar al navegador a recalcular estilos, layout y pintado. Si haces muchos cambios seguidos, el navegador intenta agruparlos, pero no siempre puede.

**Reflow (layout):** el navegador recalcula posiciones y tamaños.
**Repaint (pintado):** el navegador vuelve a dibujar píxeles.

Ciertas operaciones fuerzan un reflow inmediato porque necesitan medidas actualizadas:

```js
const caja = document.querySelector("#caja");

// ❌ Lee, escribe, lee, escribe... fuerza layout en cada paso
caja.style.width = "100px";
console.log(caja.offsetWidth); // fuerza layout
caja.style.width = "200px";
console.log(caja.offsetWidth); // fuerza layout otra vez
```

**Layout thrashing:** alternar lecturas y escrituras de layout en un bucle. Es uno de los problemas de rendimiento más comunes.

```js
// ❌ Layout thrashing
for (const item of items) {
  const ancho = item.offsetWidth; // lectura (fuerza layout)
  item.style.width = ancho + 10 + "px"; // escritura
}
```

**Solución: separar lecturas y escrituras.**

```js
// ✅ Primero todas las lecturas
const anchos = items.map((item) => item.offsetWidth);

// ✅ Después todas las escrituras
items.forEach((item, i) => {
  item.style.width = anchos[i] + 10 + "px";
});
```

**Otras técnicas:**

- Usa `DocumentFragment` para insertar muchos nodos de una vez.
- Usa `classList` en lugar de cambiar muchos estilos individuales.
- Agrupa cambios en `requestAnimationFrame` (6.7.1).
- Evita leer `offsetWidth`, `offsetHeight`, `getBoundingClientRect` dentro de bucles de escritura.

```js
// ✅ Agrupar en el siguiente frame
requestAnimationFrame(() => {
  caja.style.width = "200px";
  caja.style.height = "100px";
});
```

> 🧠 **Regla:** lee todo lo que necesites medir, luego escribe todos los cambios. No mezcles lecturas y escrituras en el mismo bucle.

### ✅ Haz esto / ❌ Evita esto (6.3)

```js
// ✅ Usa textContent para datos del usuario
elemento.textContent = comentario;

// ✅ Usa createElement y append para construir estructuras
const p = document.createElement("p");
p.textContent = "Hola";
contenedor.append(p);

// ✅ Usa classList para estados visuales
caja.classList.add("activa");
caja.classList.toggle("oculta", estaOculto);

// ✅ Usa DocumentFragment para muchas inserciones
const fragmento = document.createDocumentFragment();
for (const dato of datos) {
  const li = document.createElement("li");
  li.textContent = dato;
  fragmento.append(li);
}
lista.append(fragmento);

// ✅ Separa lecturas y escrituras de layout
const anchos = items.map((item) => item.offsetWidth);
items.forEach((item, i) => {
  item.style.width = anchos[i] + "px";
});

// ❌ Insertar datos del usuario con innerHTML
contenedor.innerHTML = `<p>${comentario}</p>`; // XSS

// ❌ Concatenar clases con className
caja.className += " activa"; // puede duplicar y borrar

// ❌ Consultar el DOM y escribir en cada iteración
for (const item of items) {
  document.querySelector("#total").textContent += item.precio;
}

// ❌ Mezclar lectura y escritura de layout
for (const item of items) {
  item.style.width = item.offsetWidth + 10 + "px";
}
```

---

## 6.4 — Eventos

El DOM sería inútil si no pudieras reaccionar a lo que hace el usuario. Los **eventos** son la forma en que el navegador te avisa de que algo ocurrió: un clic, una tecla, un envío de formulario, un cambio de tamaño, un error de red.

### 6.4.1 Qué es un evento

Un evento es un objeto que representa algo que ocurrió. El navegador lo crea, lo asocia a un elemento y lo entrega a las funciones que se hayan registrado para escucharlo.

```js
const boton = document.querySelector("#boton");

boton.addEventListener("click", (evento) => {
  console.log("Ocurrió un clic");
  console.log(evento.type); // "click"
});
```

**Anatomía de un evento:**

| Parte | Qué es |
|---|---|
| **Tipo** | El nombre del evento: `"click"`, `"input"`, `"submit"` |
| **Target** | El elemento donde ocurrió originalmente |
| **CurrentTarget** | El elemento que tiene el listener actual |
| **Listener** | La función que se ejecuta |
| **Fase** | Captura, objetivo o burbujeo (6.4.5) |

**Modelo mental:** el navegador es un presentador que grita “¡clic!”. Los elementos que se han suscrito a ese grito ejecutan su función. El evento lleva información sobre qué pasó y dónde.

### 6.4.2 `addEventListener`

La forma moderna y recomendada de escuchar eventos es `addEventListener`.

```js
elemento.addEventListener(tipo, listener, opciones);
```

```js
const boton = document.querySelector("#boton");

function manejarClic(evento) {
  console.log("Clic en", evento.currentTarget);
}

boton.addEventListener("click", manejarClic);
```

**Ventajas frente a `onclick`:**

- Puedes añadir varios listeners al mismo evento.
- Puedes quitar un listener con `removeEventListener`.
- Puedes controlar la fase (captura o burbujeo) y opciones como `once` o `passive`.

```js
// ✅ Varios listeners
boton.addEventListener("click", () => console.log("Primero"));
boton.addEventListener("click", () => console.log("Segundo"));

// ❌ onclick sobrescribe el anterior
boton.onclick = () => console.log("Primero");
boton.onclick = () => console.log("Segundo"); // solo queda este
```

**Quitar un listener:**

`removeEventListener` necesita la **misma referencia** a la función y las mismas opciones de captura.

```js
function manejarClic() {
  console.log("clic");
}

boton.addEventListener("click", manejarClic);
boton.removeEventListener("click", manejarClic); // ✅

// ❌ No funciona: es otra función
boton.addEventListener("click", () => console.log("clic"));
boton.removeEventListener("click", () => console.log("clic"));
```

```js
// ✅ Guarda la referencia si necesitas quitarla después
const manejarClic = () => {
  console.log("clic");
};

boton.addEventListener("click", manejarClic);

// Más tarde...
boton.removeEventListener("click", manejarClic);
```

**Escuchar varios eventos:**

```js
["click", "mouseenter", "mouseleave"].forEach((tipo) => {
  boton.addEventListener(tipo, () => console.log(tipo));
});
```

### 6.4.3 El objeto `Event`

El listener recibe un objeto con información sobre el evento.

```js
const enlace = document.querySelector("#enlace");

enlace.addEventListener("click", (evento) => {
  console.log(evento.type); // "click"
  console.log(evento.target); // el elemento clicado
  console.log(evento.currentTarget); // el elemento con el listener
  console.log(evento.timeStamp); // milisegundos desde el inicio
  console.log(evento.defaultPrevented); // false
});
```

**Propiedades importantes:**

| Propiedad | Qué indica |
|---|---|
| `type` | Nombre del evento |
| `target` | Elemento donde se originó |
| `currentTarget` | Elemento que tiene el listener actual |
| `timeStamp` | Momento del evento |
| `defaultPrevented` | Si se llamó a `preventDefault` |
| `bubbles` | Si el evento burbujea |
| `cancelable` | Si se puede cancelar |
| `isTrusted` | Si lo generó el usuario (no `dispatchEvent`) |

**Métodos importantes:**

| Método | Qué hace |
|---|---|
| `preventDefault()` | Cancela la acción por defecto |
| `stopPropagation()` | Detiene la propagación |
| `stopImmediatePropagation()` | Detiene la propagación y otros listeners del mismo elemento |

```js
document.querySelector("form").addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita que la página se recargue
  console.log("Formulario interceptado");
});
```

### 6.4.4 `preventDefault` vs `stopPropagation`

Son dos cosas distintas y se confunden todo el tiempo.

- **`preventDefault()`** cancela la **acción por defecto** del navegador: seguir un enlace, enviar un formulario, marcar un checkbox.
- **`stopPropagation()`** detiene la **propagación del evento** hacia otros elementos.

```html
<a id="enlace" href="https://ejemplo.com">Ir a ejemplo</a>
```

```js
const enlace = document.querySelector("#enlace");

enlace.addEventListener("click", (evento) => {
  evento.preventDefault(); // no navega
  console.log("Clic interceptado");
});
```

```html
<div id="padre">
  <button id="hijo">Clic</button>
</div>
```

```js
const padre = document.querySelector("#padre");
const hijo = document.querySelector("#hijo");

padre.addEventListener("click", () => console.log("padre"));
hijo.addEventListener("click", (evento) => {
  evento.stopPropagation();
  console.log("hijo");
});

// Al hacer clic en el botón: solo "hijo".
// Sin stopPropagation: "hijo" y luego "padre".
```

**`stopImmediatePropagation`:**

```js
hijo.addEventListener("click", (evento) => {
  evento.stopImmediatePropagation();
  console.log("primer listener");
});

hijo.addEventListener("click", () => {
  console.log("segundo listener"); // no se ejecuta
});
```

**Cuándo usar cada uno:**

| Situación | Método |
|---|---|
| Evitar que un enlace navegue | `preventDefault` |
| Evitar que un formulario recargue la página | `preventDefault` |
| Evitar que un clic en un hijo active el padre | `stopPropagation` |
| Evitar que otros listeners del mismo elemento se ejecuten | `stopImmediatePropagation` |

> ⚠️ **No abuses de `stopPropagation`.** Rompe la delegación de eventos y hace que otros componentes no se enteren. Úsalo solo cuando sea necesario.

### 6.4.5 Burbujeo y captura

Cuando ocurre un evento, el navegador lo propaga en tres fases:

1. **Captura:** desde `document` hacia el elemento objetivo.
2. **Objetivo:** en el elemento que originó el evento.
3. **Burbujeo:** desde el elemento objetivo hacia `document`.

```text
document
  └── html
      └── body
          └── div#padre
              └── button#hijo   ← clic aquí

Captura: document → html → body → div → button
Objetivo: button
Burbujeo: button → div → body → html → document
```

Por defecto, `addEventListener` escucha en la fase de **burbujeo**. Para escuchar en captura, pasa `true` como tercer argumento (o `{ capture: true }`).

```html
<div id="abuelo">
  <div id="padre">
    <button id="hijo">Clic</button>
  </div>
</div>
```

```js
const abuelo = document.querySelector("#abuelo");
const padre = document.querySelector("#padre");
const hijo = document.querySelector("#hijo");

abuelo.addEventListener("click", () => console.log("abuelo captura"), true);
padre.addEventListener("click", () => console.log("padre captura"), true);
hijo.addEventListener("click", () => console.log("hijo"));

hijo.addEventListener("click", () => console.log("hijo burbujeo"));
padre.addEventListener("click", () => console.log("padre burbujeo"));
abuelo.addEventListener("click", () => console.log("abuelo burbujeo"));

// Al hacer clic en el botón:
// abuelo captura
// padre captura
// hijo
// hijo burbujeo
// padre burbujeo
// abuelo burbujeo
```

**`event.eventPhase`:**

| Valor | Fase |
|---|---|
| 1 | Captura |
| 2 | Objetivo |
| 3 | Burbujeo |

```js
hijo.addEventListener("click", (evento) => {
  console.log(evento.eventPhase); // 2
});
```

**¿Para qué sirve la captura?** Para interceptar eventos antes de que lleguen al objetivo. Se usa en casos avanzados: cerrar menús al hacer clic fuera, medir interacciones, implementar delegación en captura.

### 6.4.6 Delegación de eventos

La **delegación** consiste en poner un solo listener en un contenedor padre y usar `event.target` para saber qué hijo recibió el evento. Es uno de los patrones más importantes del DOM.

**Sin delegación:**

```html
<ul id="lista">
  <li><button class="eliminar">Eliminar 1</button></li>
  <li><button class="eliminar">Eliminar 2</button></li>
</ul>
```

```js
// ❌ Un listener por cada botón
document.querySelectorAll(".eliminar").forEach((boton) => {
  boton.addEventListener("click", () => {
    boton.closest("li").remove();
  });
});
```

Problemas:

- Si añades un nuevo `<li>`, el botón nuevo no tiene listener.
- Si hay cientos de elementos, hay cientos de listeners.
- Al eliminar elementos, los listeners pueden quedar en memoria.

**Con delegación:**

```js
const lista = document.querySelector("#lista");

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".eliminar");
  if (!boton) return;

  boton.closest("li").remove();
});
```

Un solo listener en `#lista`. Funciona para elementos actuales y futuros. Si el clic no viene de un `.eliminar`, `closest` devuelve `null` y salimos.

**Ejemplo completo con datos:**

```html
<ul id="tareas">
  <li data-id="1">
    Comprar pan
    <button class="completar">Completar</button>
    <button class="eliminar">Eliminar</button>
  </li>
  <li data-id="2">
    Estudiar
    <button class="completar">Completar</button>
    <button class="eliminar">Eliminar</button>
  </li>
</ul>
```

```js
const tareas = document.querySelector("#tareas");

tareas.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");
  if (!boton) return;

  const item = boton.closest("li");
  const id = item.dataset.id;

  if (boton.classList.contains("completar")) {
    item.classList.toggle("completada");
  }

  if (boton.classList.contains("eliminar")) {
    item.remove();
    console.log("Eliminada la tarea", id);
  }
});
```

**Ventajas:**

- Menos listeners y menos memoria.
- Funciona con elementos añadidos después.
- Centraliza la lógica.

**Desventajas:**

- El evento debe burbujear. Algunos eventos no lo hacen (6.4.12).
- `event.target` puede ser un hijo interno; usa `closest` para encontrar el elemento que te interesa.
- No puedes usar `stopPropagation` a la ligera, porque rompe la delegación.

**Regla:** si tienes una lista o un contenedor con elementos repetidos, usa delegación.

### 6.4.7 Eventos comunes

Hay decenas de eventos. Estos son los que usarás el 90% del tiempo.

**Ratón:**

| Evento | Cuándo |
|---|---|
| `click` | Clic completo (mousedown + mouseup) |
| `dblclick` | Doble clic |
| `mousedown` / `mouseup` | Botón presionado / liberado |
| `mousemove` | Movimiento del ratón |
| `mouseenter` / `mouseleave` | Entra/sale del elemento (no burbujea) |
| `mouseover` / `mouseout` | Entra/sale (burbujea, incluye hijos) |
| `contextmenu` | Clic derecho |

```js
const caja = document.querySelector("#caja");

caja.addEventListener("mouseenter", () => {
  caja.classList.add("resaltada");
});

caja.addEventListener("mouseleave", () => {
  caja.classList.remove("resaltada");
});
```

**Teclado:**

| Evento | Cuándo |
|---|---|
| `keydown` | Tecla presionada |
| `keyup` | Tecla liberada |
| `keypress` | Obsoleto; evítalo |

```js
document.addEventListener("keydown", (evento) => {
  console.log(evento.key); // "a", "Enter", "Escape", "ArrowUp"
  console.log(evento.code); // "KeyA", "Enter", "Escape", "ArrowUp"
  console.log(evento.ctrlKey, evento.shiftKey, evento.altKey, evento.metaKey);

  if (evento.key === "Escape") {
    cerrarModal();
  }
});
```

**Formularios:**

| Evento | Cuándo |
|---|---|
| `input` | Cada cambio en un input (mientras escribes) |
| `change` | Cambio confirmado (al salir del input o elegir opción) |
| `submit` | Envío de formulario |
| `reset` | Reset de formulario |
| `focus` / `blur` | Entra/sale de foco (no burbujea) |
| `focusin` / `focusout` | Entra/sale de foco (burbujea) |

```js
const input = document.querySelector("#nombre");

input.addEventListener("input", (evento) => {
  console.log("Valor actual:", evento.target.value);
});

input.addEventListener("change", (evento) => {
  console.log("Valor confirmado:", evento.target.value);
});
```

**Documento y ventana:**

| Evento | Cuándo |
|---|---|
| `DOMContentLoaded` | El HTML se parseó (en `document`) |
| `load` | Todo cargó, incluidos recursos (en `window`) |
| `beforeunload` | Antes de salir de la página |
| `pagehide` | La página se oculta o se descarga |
| `resize` | Cambia el tamaño de la ventana |
| `scroll` | Se desplaza la página o un elemento |
| `visibilitychange` | Cambia la visibilidad de la pestaña |

```js
window.addEventListener("resize", () => {
  console.log(window.innerWidth, window.innerHeight);
});

document.addEventListener("visibilitychange", () => {
  console.log(document.visibilityState); // "visible" o "hidden"
});
```

**Puntero y táctil (vista previa):**

| Evento | Cuándo |
|---|---|
| `pointerdown` / `pointerup` | Cualquier puntero (ratón, dedo, lápiz) |
| `pointermove` | Movimiento del puntero |
| `touchstart` / `touchend` | Toque en pantallas táctiles |

Los eventos de puntero unifican ratón y táctil. Los verás con más detalle cuando trabajes con gestos.

### 6.4.8 `this`, `currentTarget` y `target`

Dentro de un listener normal, `this` es el elemento que tiene el listener (`currentTarget`). En una arrow function, `this` se hereda del ámbito externo.

```js
const boton = document.querySelector("#boton");

boton.addEventListener("click", function (evento) {
  console.log(this === evento.currentTarget); // true
  console.log(this === boton); // true
});

boton.addEventListener("click", (evento) => {
  console.log(this === evento.currentTarget); // false (this externo)
  console.log(evento.currentTarget === boton); // true
});
```

**`target` vs `currentTarget`:**

- `target`: el elemento donde se originó el evento (puede ser un hijo).
- `currentTarget`: el elemento que tiene el listener.

```html
<button id="boton">
  <span id="texto">Guardar</span>
</button>
```

```js
const boton = document.querySelector("#boton");

boton.addEventListener("click", (evento) => {
  console.log(evento.target.id); // "texto" si clicas el span
  console.log(evento.currentTarget.id); // "boton"
});
```

**Regla:** en delegación y en callbacks asíncronos, usa `event.currentTarget`, no `this`. Es más explícito y no se pierde.

```js
// ❌ this puede cambiar si el listener es async o se pasa como referencia
boton.addEventListener("click", async function () {
  await esperar(100);
  console.log(this); // puede no ser el botón
});

// ✅
boton.addEventListener("click", async (evento) => {
  const boton = evento.currentTarget;
  await esperar(100);
  console.log(boton);
});
```

### 6.4.9 Opciones de `addEventListener`

El tercer argumento puede ser un booleano (`true` para captura) o un objeto con opciones.

```js
elemento.addEventListener("click", listener, {
  capture: false,
  once: false,
  passive: false,
  signal: undefined,
});
```

| Opción | Qué hace |
|---|---|
| `capture` | Escucha en fase de captura |
| `once` | El listener se ejecuta una sola vez y se elimina |
| `passive` | Promete que no llamarás a `preventDefault`; mejora el rendimiento en scroll/touch |
| `signal` | Un `AbortSignal` que permite quitar el listener |

**`once`:**

```js
const boton = document.querySelector("#boton");

boton.addEventListener(
  "click",
  () => {
    console.log("Solo una vez");
  },
  { once: true }
);
```

**`passive`:**

```js
window.addEventListener(
  "scroll",
  () => {
    console.log("scroll");
  },
  { passive: true }
);
```

En eventos de scroll y touch, el navegador debe esperar a ver si llamas a `preventDefault` antes de desplazarse. `passive: true` le dice que no lo harás, y permite desplazarse sin esperar. Es una mejora de rendimiento importante.

**`capture`:**

```js
document.addEventListener(
  "click",
  () => {
    console.log("captura");
  },
  { capture: true }
);
```

**`signal`:** lo veremos en 6.4.10.

### 6.4.10 `AbortController` para quitar listeners

`AbortController` permite cancelar operaciones. En eventos, se usa para quitar uno o varios listeners de una vez.

```js
const controller = new AbortController();
const { signal } = controller;

const boton = document.querySelector("#boton");

boton.addEventListener(
  "click",
  () => {
    console.log("clic");
  },
  { signal }
);

// Más tarde...
controller.abort();
```

Después de `abort()`, el listener se elimina. Si el evento vuelve a ocurrir, la función no se ejecuta.

**Varios listeners con la misma señal:**

```js
const controller = new AbortController();
const { signal } = controller;

boton.addEventListener("click", manejarClic, { signal });
boton.addEventListener("mouseenter", manejarEntrada, { signal });
window.addEventListener("resize", manejarResize, { signal });

// Quita los tres a la vez
controller.abort();
```

**Comprobar si está cancelado:**

```js
console.log(signal.aborted); // false
controller.abort();
console.log(signal.aborted); // true
```

**Caso típico: componentes que se destruyen.**

```js
function crearComponente(elemento) {
  const controller = new AbortController();
  const { signal } = controller;

  elemento.addEventListener("click", manejarClic, { signal });
  elemento.addEventListener("keydown", manejarTecla, { signal });

  return {
    destruir() {
      controller.abort();
    },
  };
}

const componente = crearComponente(document.querySelector("#app"));

// Cuando el componente ya no se necesita:
componente.destruir();
```

**Por qué es mejor que `removeEventListener`:**

- No necesitas guardar cada referencia de función.
- Puedes cancelar varios listeners con una sola llamada.
- Evita fugas de memoria cuando se recrean componentes.

> 📌 En el Módulo 7 verás `AbortController` con `fetch` para cancelar peticiones HTTP. La misma señal sirve para eventos y para red.

### 6.4.11 `CustomEvent`

Puedes crear tus propios eventos con `CustomEvent`. Sirven para comunicar componentes sin acoplarlos.

```js
const evento = new CustomEvent("producto-agregado", {
  detail: { id: 7, nombre: "Camisa" },
  bubbles: true,
  cancelable: true,
});

document.querySelector("#carrito").dispatchEvent(evento);
```

**Escuchar el evento personalizado:**

```js
document.addEventListener("producto-agregado", (evento) => {
  console.log("Producto:", evento.detail.nombre);
  console.log("ID:", evento.detail.id);
});
```

**`detail`** es donde va la información. Puede ser cualquier valor: un objeto, un array, un número.

**`bubbles: true`** permite que el evento suba por el árbol y pueda escucharse en un ancestro. **`cancelable: true`** permite llamar a `preventDefault`.

```js
// Emisor
function agregarAlCarrito(producto) {
  const evento = new CustomEvent("agregar", {
    detail: producto,
    bubbles: true,
    cancelable: true,
  });

  const cancelado = !document.querySelector("#carrito").dispatchEvent(evento);
  if (cancelado) {
    console.log("Un listener canceló la operación");
    return;
  }

  console.log("Producto agregado");
}

// Receptor
document.querySelector("#carrito").addEventListener("agregar", (evento) => {
  console.log("Recibido:", evento.detail);
});
```

**`dispatchEvent` devuelve `false`** si algún listener llamó a `preventDefault` y el evento es cancelable.

**Cuándo usarlo:**

- Comunicar un componente hijo con un padre.
- Notificar cambios de estado a otras partes de la página.
- Integrar código antiguo con código nuevo.

**Cuándo no usarlo:**

- Para todo. Si dos funciones están en el mismo archivo, una llamada directa es más simple.
- Para reemplazar el estado global sin necesidad.

### 6.4.12 Eventos que no burbujean

No todos los eventos burbujean. Si intentas delegar en un padre, algunos no llegarán.

| Evento | ¿Burbujea? | Alternativa |
|---|---|---|
| `click` | Sí | — |
| `input` | Sí | — |
| `change` | Sí | — |
| `submit` | Sí | — |
| `focus` | No | `focusin` |
| `blur` | No | `focusout` |
| `mouseenter` | No | `mouseover` |
| `mouseleave` | No | `mouseout` |
| `load` | No | — |
| `scroll` | No (en elementos) | Escuchar en el elemento o en `window` |

```js
// ❌ No funciona para delegar focus
document.querySelector("#formulario").addEventListener("focus", () => {
  console.log("focus");
});

// ✅ focusin sí burbujea
document.querySelector("#formulario").addEventListener("focusin", (evento) => {
  console.log("focus en", evento.target);
});
```

**`mouseenter` vs `mouseover`:**

- `mouseenter` no burbujea y no se dispara al pasar por hijos.
- `mouseover` burbujea y se dispara al pasar por hijos.

```js
// ✅ Para resaltar el elemento sin parpadeos
caja.addEventListener("mouseenter", resaltar);
caja.addEventListener("mouseleave", quitarResaltado);

// ⚠️ mouseover se dispara muchas veces al moverte por hijos
caja.addEventListener("mouseover", resaltar);
```

### 6.4.13 `DOMContentLoaded`, `load` y ciclo de vida

El documento pasa por varias etapas. Saber cuándo ejecutar tu código evita errores.

| Evento | Se dispara cuando | Dónde escucharlo |
|---|---|---|
| `DOMContentLoaded` | El HTML se parseó y el DOM está listo | `document` |
| `load` | Todos los recursos (imágenes, CSS) cargaron | `window` |
| `beforeunload` | Antes de salir de la página | `window` |
| `pagehide` | La página se oculta o se descarga | `window` |
| `pageshow` | La página se muestra (incluida caché) | `window` |

```js
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM listo");
});

window.addEventListener("load", () => {
  console.log("Todo cargó");
});
```

**`document.readyState`:**

| Valor | Significado |
|---|---|
| `"loading"` | El documento se está cargando |
| `"interactive"` | El HTML se parseó, pero faltan recursos |
| `"complete"` | Todo cargó |

```js
console.log(document.readyState);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", iniciar);
} else {
  iniciar();
}
```

Este patrón es útil si tu script puede ejecutarse antes o después de `DOMContentLoaded`.

**`beforeunload`:**

```js
window.addEventListener("beforeunload", (evento) => {
  if (hayCambiosSinGuardar) {
    evento.preventDefault();
    evento.returnValue = ""; // algunos navegadores lo requieren
  }
});
```

> ⚠️ Los navegadores modernos no permiten personalizar el mensaje de `beforeunload` por seguridad. Solo muestran un diálogo genérico. Úsalo solo si de verdad hay datos sin guardar.

**`pagehide` es más confiable que `beforeunload`** en móviles y cuando la página entra en la caché de retroceso. Úsalo para limpiar timers o guardar estado.

### 6.4.14 Rendimiento de eventos

Los listeners se ejecutan en el hilo principal. Si tardan, bloquean la interfaz.

**Buenas prácticas:**

- No hagas trabajo pesado dentro de un listener que se dispara muchas veces (`scroll`, `mousemove`, `input`).
- Usa `debounce` o `throttle` (6.7.8).
- Usa `passive: true` en scroll y touch si no necesitas `preventDefault`.
- Usa delegación para reducir el número de listeners.
- Quita listeners cuando ya no se necesitan (`AbortController`).
- No consultes el DOM repetidamente dentro del listener; cachea referencias.

```js
// ❌ Trabajo pesado en cada scroll
window.addEventListener("scroll", () => {
  const items = document.querySelectorAll(".item");
  items.forEach((item) => {
    item.style.opacity = calcularOpacidad(item);
  });
});

// ✅ Throttle + referencias cacheadas
const items = document.querySelectorAll(".item");

const actualizar = throttle(() => {
  items.forEach((item) => {
    item.style.opacity = calcularOpacidad(item);
  });
}, 100);

window.addEventListener("scroll", actualizar, { passive: true });
```

**`requestAnimationFrame` para animaciones:** no uses `scroll` o `mousemove` para animar directamente. Actualiza el estado y pinta en el siguiente frame (6.7.1).

```js
let ultimoEvento = null;

window.addEventListener("mousemove", (evento) => {
  ultimoEvento = evento;
});

function animar() {
  if (ultimoEvento) {
    // usar ultimoEvento.clientX / clientY
    ultimoEvento = null;
  }
  requestAnimationFrame(animar);
}

requestAnimationFrame(animar);
```

### ✅ Haz esto / ❌ Evita esto (6.4)

```js
// ✅ Usa addEventListener, no onclick
boton.addEventListener("click", manejarClic);

// ✅ Guarda la referencia si vas a quitar el listener
const manejarClic = () => { /* ... */ };
boton.addEventListener("click", manejarClic);
boton.removeEventListener("click", manejarClic);

// ✅ Usa delegación para listas
lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest(".eliminar");
  if (!boton) return;
  boton.closest("li").remove();
});

// ✅ Usa AbortController para limpiar varios listeners
const controller = new AbortController();
boton.addEventListener("click", manejarClic, { signal: controller.signal });
controller.abort();

// ✅ Usa passive en scroll/touch
window.addEventListener("scroll", manejarScroll, { passive: true });

// ✅ Comprueba target y currentTarget en delegación
lista.addEventListener("click", (evento) => {
  console.log(evento.target); // hijo real
  console.log(evento.currentTarget); // lista
});

// ❌ Asignar onclick y sobrescribir listeners
boton.onclick = manejarClic;
boton.onclick = otroManejador; // pierde el anterior

// ❌ Quitar un listener con una función distinta
boton.addEventListener("click", () => console.log("clic"));
boton.removeEventListener("click", () => console.log("clic")); // no funciona

// ❌ Abusar de stopPropagation
hijo.addEventListener("click", (evento) => {
  evento.stopPropagation(); // rompe la delegación del padre
});

// ❌ Hacer trabajo pesado en cada input
input.addEventListener("input", () => {
  const items = document.querySelectorAll(".item");
  items.forEach((item) => filtrar(item));
});

// ❌ Escuchar focus/blur en un padre para delegar
padre.addEventListener("focus", manejarFocus); // no burbujea
```

---

## 6.5 — Formularios y validación

Los formularios son la principal forma de entrada de datos en la web. Un formulario mal hecho pierde datos, confunde al usuario y abre agujeros de seguridad. En esta sección verás cómo leerlo, validarlo y dar buenos mensajes de error.

### 6.5.1 Estructura de un formulario

Un formulario básico tiene un `<form>`, campos con `name`, etiquetas `<label>` y un botón de envío.

```html
<form id="registro" action="/registrar" method="post">
  <div class="campo">
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" type="text" required />
  </div>

  <div class="campo">
    <label for="email">Email</label>
    <input id="email" name="email" type="email" required />
  </div>

  <button type="submit">Registrarme</button>
</form>
```

**Por qué importa cada parte:**

| Parte | Para qué |
|---|---|
| `<form>` | Agrupa campos y gestiona el envío |
| `action` | URL a la que se envía (si no usas JS) |
| `method` | `get` o `post` |
| `name` | Clave con la que el dato llega al servidor o a `FormData` |
| `id` + `for` | Conecta la etiqueta con el campo |
| `type` | Comportamiento y validación del campo |
| `required` | Validación HTML5 |
| `button type="submit"` | Envía el formulario |

**Sin `name`, el campo no se envía.** Es uno de los errores más comunes.

```html
<!-- ❌ No llega al servidor ni a FormData -->
<input id="telefono" type="tel" />

<!-- ✅ -->
<input id="telefono" name="telefono" type="tel" />
```

**Accesibilidad:** siempre usa `<label>`. No uses el placeholder como única etiqueta: desaparece al escribir y no lo leen bien los lectores de pantalla.

```html
<!-- ❌ -->
<input placeholder="Email" />

<!-- ✅ -->
<label for="email">Email</label>
<input id="email" name="email" type="email" placeholder="tu@email.com" />
```

### 6.5.2 `submit` y `preventDefault`

Por defecto, al enviar un formulario el navegador navega a la URL de `action` y recarga la página. En una aplicación con JavaScript, normalmente quieres interceptar el envío.

```js
const form = document.querySelector("#registro");

form.addEventListener("submit", (evento) => {
  evento.preventDefault(); // evita la navegación

  console.log("Formulario interceptado");
});
```

**Leer los datos:**

```js
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const formData = new FormData(form);
  const nombre = formData.get("nombre");
  const email = formData.get("email");

  console.log({ nombre, email });
});
```

**`requestSubmit` vs `submit`:**

- `form.requestSubmit()` dispara el evento `submit` y ejecuta la validación HTML5.
- `form.submit()` envía directamente, **sin** disparar `submit` ni validar.

```js
// ✅ Dispara submit y validación
form.requestSubmit();

// ⚠️ Envía sin pasar por tu listener ni por la validación
form.submit();
```

**Botones dentro del formulario:**

```html
<form id="formulario">
  <input name="busqueda" type="search" />
  <button type="submit">Buscar</button>
  <button type="button" id="limpiar">Limpiar</button>
</form>
```

```js
document.querySelector("#limpiar").addEventListener("click", () => {
  document.querySelector("#formulario").reset();
});
```

Si un botón dentro de un formulario no tiene `type`, su valor por defecto es `"submit"`. Un botón para limpiar debe ser `type="button"`.

### 6.5.3 `FormData`

`FormData` recoge los campos de un formulario en una estructura clave-valor. Es la forma más cómoda de leer un formulario completo.

```html
<form id="pedido">
  <input name="nombre" value="Ana" />
  <input name="email" value="ana@ejemplo.com" />
  <select name="pais">
    <option value="es">España</option>
    <option value="mx">México</option>
  </select>
  <input type="checkbox" name="acepto" checked />
  <button type="submit">Enviar</button>
</form>
```

```js
const form = document.querySelector("#pedido");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const datos = new FormData(form);

  console.log(datos.get("nombre")); // "Ana"
  console.log(datos.get("email")); // "ana@ejemplo.com"
  console.log(datos.get("pais")); // "es"
  console.log(datos.get("acepto")); // "on" si está marcado, null si no

  for (const [clave, valor] of datos.entries()) {
    console.log(clave, valor);
  }
});
```

**Métodos de `FormData`:**

| Método | Qué hace |
|---|---|
| `get(name)` | Devuelve el primer valor o `null` |
| `getAll(name)` | Devuelve todos los valores de un campo múltiple |
| `has(name)` | Comprueba si existe |
| `set(name, value)` | Reemplaza el valor |
| `append(name, value)` | Añade otro valor |
| `delete(name)` | Elimina el campo |
| `entries()` | Itera pares `[clave, valor]` |
| `keys()` / `values()` | Itera claves o valores |

```js
const datos = new FormData();

datos.append("nombre", "Ana");
datos.append("intereses", "musica");
datos.append("intereses", "deporte");

console.log(datos.getAll("intereses")); // ["musica", "deporte"]

datos.set("nombre", "Luis");
console.log(datos.get("nombre")); // "Luis"

datos.delete("intereses");
console.log(datos.has("intereses")); // false
```

**Checkboxes y radios:**

- Un checkbox marcado envía su `value` (o `"on"` si no tiene).
- Un checkbox no marcado **no se envía**.
- Un grupo de radios envía el valor del seleccionado.

```html
<input type="checkbox" name="newsletter" value="si" />
<input type="radio" name="plan" value="basico" checked />
<input type="radio" name="plan" value="pro" />
```

```js
const datos = new FormData(form);
console.log(datos.get("newsletter")); // null si no está marcado
console.log(datos.get("plan")); // "basico"
```

**Archivos:**

```html
<input type="file" name="avatar" accept="image/*" />
```

```js
const datos = new FormData(form);
const archivo = datos.get("avatar");

if (archivo instanceof File) {
  console.log(archivo.name, archivo.size, archivo.type);
}
```

`FormData` se puede enviar con `fetch` (Módulo 7) sin convertirlo manualmente.

### 6.5.4 Tipos de input

El atributo `type` cambia el comportamiento, el teclado en móvil y la validación.

| Tipo | Para qué | Propiedad clave |
|---|---|---|
| `text` | Texto libre | `value` |
| `email` | Email | `value`, validación |
| `password` | Contraseña | `value` |
| `number` | Números | `value`, `valueAsNumber` |
| `range` | Deslizador | `value` |
| `date` | Fecha | `value` (YYYY-MM-DD) |
| `time` | Hora | `value` (HH:MM) |
| `checkbox` | Sí/no o múltiple | `checked` |
| `radio` | Una opción entre varias | `checked` |
| `file` | Archivo | `files` |
| `hidden` | Dato oculto | `value` |
| `search` | Búsqueda | `value` |
| `color` | Color | `value` (#rrggbb) |

```html
<label for="edad">Edad</label>
<input id="edad" name="edad" type="number" min="0" max="120" step="1" />

<label for="fecha">Fecha</label>
<input id="fecha" name="fecha" type="date" />

<label for="nivel">Nivel</label>
<input id="nivel" name="nivel" type="range" min="1" max="10" value="5" />

<label for="color">Color favorito</label>
<input id="color" name="color" type="color" value="#2563eb" />
```

**`select`:**

```html
<label for="pais">País</label>
<select id="pais" name="pais">
  <option value="">Elige uno</option>
  <option value="es">España</option>
  <option value="mx">México</option>
</select>
```

```js
const select = document.querySelector("#pais");
console.log(select.value); // ""
console.log(select.selectedIndex); // 0
console.log(select.options[1].text); // "España"
```

**`textarea`:**

```html
<label for="mensaje">Mensaje</label>
<textarea id="mensaje" name="mensaje" rows="4"></textarea>
```

```js
const textarea = document.querySelector("#mensaje");
console.log(textarea.value);
```

**`number` y `valueAsNumber`:**

```js
const edad = document.querySelector("#edad");
console.log(edad.value); // "30" (string)
console.log(edad.valueAsNumber); // 30 (number)
```

### 6.5.5 `value` vs `defaultValue`

Igual que con `value` y el atributo `value` (6.3.6), los inputs tienen `defaultValue`, que representa el valor inicial.

```html
<input id="nombre" name="nombre" value="Ana" />
```

```js
const input = document.querySelector("#nombre");

console.log(input.value); // "Ana"
console.log(input.defaultValue); // "Ana"

input.value = "Luis";

console.log(input.value); // "Luis"
console.log(input.defaultValue); // "Ana"
```

**`reset()` vuelve al `defaultValue`:**

```js
input.value = "Luis";
form.reset();
console.log(input.value); // "Ana"
```

Lo mismo con `checked` y `defaultChecked`:

```js
console.log(checkbox.checked); // true
console.log(checkbox.defaultChecked); // true

checkbox.checked = false;
console.log(checkbox.checked); // false
console.log(checkbox.defaultChecked); // true
```

> 🧠 **Regla:** `value` y `checked` son el estado actual; `defaultValue` y `defaultChecked` son el estado inicial. `reset()` restaura los iniciales.

### 6.5.6 Validación HTML5

HTML5 incluye validación declarativa. No necesitas JavaScript para lo básico.

```html
<form id="registro">
  <label for="nombre">Nombre</label>
  <input id="nombre" name="nombre" type="text" required minlength="2" maxlength="40" />

  <label for="email">Email</label>
  <input id="email" name="email" type="email" required />

  <label for="edad">Edad</label>
  <input id="edad" name="edad" type="number" min="18" max="120" step="1" required />

  <label for="web">Web</label>
  <input id="web" name="web" type="url" />

  <label for="codigo">Código</label>
  <input id="codigo" name="codigo" type="text" pattern="[A-Z]{3}[0-9]{3}" />

  <button type="submit">Enviar</button>
</form>
```

**Atributos de validación:**

| Atributo | Qué valida |
|---|---|
| `required` | Campo obligatorio |
| `type="email"` | Formato de email |
| `type="url"` | Formato de URL |
| `type="number"` | Número |
| `min` / `max` | Rango numérico o de fecha |
| `step` | Incremento permitido |
| `minlength` / `maxlength` | Longitud del texto |
| `pattern` | Expresión regular (vista previa de regex, Módulo 7) |
| `accept` | Tipos de archivo permitidos |

**`novalidate`:**

```html
<form id="registro" novalidate>
```

Desactiva la validación automática del navegador para que tú la controles con JavaScript. Útil cuando quieres mensajes personalizados.

```js
const form = document.querySelector("#registro");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity(); // muestra los mensajes nativos
    return;
  }

  // enviar
});
```

**Estilos con `:invalid` y `:valid`:**

```css
input:invalid {
  border-color: #dc2626;
}

input:valid {
  border-color: #16a34a;
}

input:focus:invalid {
  outline-color: #dc2626;
}
```

> ⚠️ `:invalid` se aplica desde el inicio, incluso antes de que el usuario escriba. Para no mostrar errores prematuros, combínalo con una clase como `.tocado` que añadas en el evento `blur`.

### 6.5.7 Constraint Validation API

El navegador expone una API para consultar y personalizar la validación.

```js
const input = document.querySelector("#email");

console.log(input.checkValidity()); // true o false
console.log(input.validity.valid); // true o false
console.log(input.validationMessage); // mensaje del navegador
```

**Propiedades de `validity`:**

| Propiedad | `true` cuando... |
|---|---|
| `valid` | Todo está bien |
| `valueMissing` | Falta un campo `required` |
| `typeMismatch` | El tipo no coincide (`email`, `url`) |
| `patternMismatch` | No cumple el `pattern` |
| `tooShort` / `tooLong` | Longitud fuera de rango |
| `rangeUnderflow` / `rangeOverflow` | Fuera de `min`/`max` |
| `stepMismatch` | No cumple el `step` |
| `badInput` | El navegador no puede interpretar el valor |
| `customError` | Hay un error personalizado |

```js
const edad = document.querySelector("#edad");

if (edad.validity.valueMissing) {
  console.log("La edad es obligatoria");
} else if (edad.validity.rangeUnderflow) {
  console.log("Debes ser mayor de 18");
} else if (edad.validity.rangeOverflow) {
  console.log("La edad máxima es 120");
}
```

**`setCustomValidity`:**

```js
const usuario = document.querySelector("#usuario");

usuario.addEventListener("input", () => {
  if (usuario.value.includes(" ")) {
    usuario.setCustomValidity("El usuario no puede tener espacios");
  } else {
    usuario.setCustomValidity(""); // limpia el error
  }
});
```

`setCustomValidity("")` es obligatorio para limpiar el error. Si no lo haces, el campo queda inválido para siempre.

**`reportValidity`:**

```js
form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  if (!form.checkValidity()) {
    form.reportValidity(); // muestra el primer error y enfoca el campo
    return;
  }

  console.log("Formulario válido");
});
```

**Validación cruzada:**

```js
const password = document.querySelector("#password");
const confirmar = document.querySelector("#confirmar");

function validarConfirmacion() {
  if (confirmar.value !== password.value) {
    confirmar.setCustomValidity("Las contraseñas no coinciden");
  } else {
    confirmar.setCustomValidity("");
  }
}

password.addEventListener("input", validarConfirmacion);
confirmar.addEventListener("input", validarConfirmacion);
```

### 6.5.8 Validación en JavaScript

La validación HTML5 es útil, pero no suficiente. Necesitas reglas de negocio, mensajes claros y validación en el servidor.

**Reglas típicas:**

- Recortar espacios con `trim()`.
- Comprobar longitud.
- Validar formato con expresiones regulares (Módulo 7).
- Comparar campos.
- Comprobar que un valor está en una lista.
- Validar en el servidor también: el cliente puede ser manipulado.

```js
function validarRegistro(datos) {
  const errores = {};

  const nombre = datos.nombre.trim();
  if (nombre.length < 2) {
    errores.nombre = "El nombre debe tener al menos 2 caracteres";
  }

  const email = datos.email.trim();
  if (!email.includes("@")) {
    errores.email = "El email no es válido";
  }

  const edad = Number(datos.edad);
  if (!Number.isInteger(edad) || edad < 18) {
    errores.edad = "Debes ser mayor de edad";
  }

  if (datos.password !== datos.confirmar) {
    errores.confirmar = "Las contraseñas no coinciden";
  }

  return errores;
}
```

**Mostrar errores en el DOM:**

```html
<form id="registro" novalidate>
  <div class="campo">
    <label for="nombre">Nombre</label>
    <input id="nombre" name="nombre" />
    <p class="error" id="error-nombre" role="alert"></p>
  </div>

  <button type="submit">Enviar</button>
</form>
```

```js
const form = document.querySelector("#registro");
const errorNombre = document.querySelector("#error-nombre");
const inputNombre = document.querySelector("#nombre");

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const datos = Object.fromEntries(new FormData(form));
  const errores = validarRegistro(datos);

  errorNombre.textContent = errores.nombre ?? "";
  inputNombre.setAttribute("aria-invalid", String(Boolean(errores.nombre)));

  if (Object.keys(errores).length > 0) {
    inputNombre.focus();
    return;
  }

  console.log("Enviar", datos);
});
```

`Object.fromEntries(new FormData(form))` convierte el formulario en un objeto plano. Es una combinación muy útil.

> ⚠️ **Nunca confíes solo en la validación del cliente.** Un usuario puede desactivar JavaScript o modificar la petición. El servidor debe validar de nuevo.

### 6.5.9 Accesibilidad y mensajes de error

Un formulario accesible se puede usar con teclado y con lector de pantalla.

**Buenas prácticas:**

- Usa `<label for="...">` para cada campo.
- Marca los campos obligatorios con texto, no solo con color.
- Asocia los mensajes de error con `aria-describedby`.
- Usa `role="alert"` para errores importantes.
- Marca el campo inválido con `aria-invalid="true"`.
- Mueve el foco al primer error.
- No uses solo el color para indicar errores.

```html
<label for="email">Email *</label>
<input
  id="email"
  name="email"
  type="email"
  required
  aria-describedby="error-email"
  aria-invalid="false"
/>
<p id="error-email" class="error" role="alert"></p>
```

```js
function mostrarError(input, mensaje) {
  const error = document.querySelector(`#error-${input.id}`);
  error.textContent = mensaje;
  input.setAttribute("aria-invalid", mensaje ? "true" : "false");
}
```

**Foco:**

```js
input.focus();
```

Para llevar al usuario al campo con error. También puedes usar `scrollIntoView()` si el campo está fuera de la vista.

```js
input.scrollIntoView({ behavior: "smooth", block: "center" });
input.focus();
```

**No uses `placeholder` como etiqueta.** El placeholder desaparece al escribir y no siempre lo leen los lectores de pantalla.

### 6.5.10 Reset y limpieza

`form.reset()` restaura los valores iniciales y limpia los estados de validación personalizados.

```js
form.reset();
```

Pero `reset()` no limpia los mensajes de error que hayas puesto en el DOM. Tienes que hacerlo tú.

```js
function limpiarFormulario(form) {
  form.reset();

  form.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";
  });

  form.querySelectorAll("[aria-invalid]").forEach((input) => {
    input.setAttribute("aria-invalid", "false");
  });
}
```

**Cuidado con `reset()` y `setCustomValidity`:** si un campo tenía un error personalizado, `reset()` puede no limpiarlo. Llama a `setCustomValidity("")` explícitamente.

```js
form.querySelectorAll("input").forEach((input) => {
  input.setCustomValidity("");
});
```

### 6.5.11 Formularios controlados

En frameworks como React se habla de “componentes controlados”: el estado de JavaScript manda sobre el valor del input. En JavaScript puro puedes aplicar la misma idea.

```html
<form id="formulario">
  <input id="nombre" name="nombre" />
  <p id="vista-previa"></p>
</form>
```

```js
const estado = {
  nombre: "",
};

const input = document.querySelector("#nombre");
const vistaPrevia = document.querySelector("#vista-previa");

function render() {
  input.value = estado.nombre;
  vistaPrevia.textContent = `Hola, ${estado.nombre || "invitado"}`;
}

input.addEventListener("input", (evento) => {
  estado.nombre = evento.target.value;
  render();
});

render();
```

**Ventajas:**

- Una sola fuente de verdad.
- Fácil de sincronizar con otros componentes.
- Fácil de guardar y restaurar.

**Desventajas:**

- Más código.
- Cuidado con el cursor: si reasignas `input.value` en cada tecla, puede saltar al final. En la mayoría de los casos no reasignes el valor si ya coincide.

```js
// ✅ Evita reasignar si no cambió
if (input.value !== estado.nombre) {
  input.value = estado.nombre;
}
```

En este curso no usamos frameworks, pero el patrón estado → render → eventos es la base de todos ellos.

### ✅ Haz esto / ❌ Evita esto (6.5)

```js
// ✅ Usa label y name
// <label for="email">Email</label>
// <input id="email" name="email" type="email" required />

// ✅ Intercepta submit con preventDefault
form.addEventListener("submit", (evento) => {
  evento.preventDefault();
  // ...
});

// ✅ Usa FormData para leer el formulario completo
const datos = Object.fromEntries(new FormData(form));

// ✅ Valida en el cliente y en el servidor
if (!form.checkValidity()) {
  form.reportValidity();
  return;
}

// ✅ Muestra errores asociados al campo
input.setAttribute("aria-invalid", "true");
error.textContent = "El email no es válido";

// ✅ Limpia setCustomValidity cuando el error desaparece
input.setCustomValidity("");

// ❌ Usar placeholder como única etiqueta
// <input placeholder="Email" />

// ❌ Olvidar name: el campo no llega a FormData
// <input id="email" type="email" />

// ❌ Validar solo con HTML5 y confiar en el cliente
// El servidor debe validar de nuevo.

// ❌ Usar type="button" para enviar
// <button type="button">Enviar</button> <!-- no envía -->

// ❌ Mostrar el error solo con color rojo
input.style.borderColor = "red"; // no accesible

// ❌ Reasignar input.value en cada tecla sin comprobar
input.value = estado.nombre; // puede mover el cursor
```

---

## 6.6 — Almacenamiento en el navegador

El navegador ofrece varias formas de guardar datos. Cada una tiene un propósito, una capacidad y un nivel de seguridad diferente. Elegir mal puede provocar pérdida de datos, problemas de rendimiento o vulnerabilidades.

### 6.6.1 Tipos de almacenamiento

| Tecnología | Capacidad | Persistencia | Sincronía | Se envía al servidor |
|---|---|---|---|---|
| **Cookies** | ~4 KB por cookie | Configurable | Sincrónica | Sí, en cada petición |
| **`localStorage`** | ~5-10 MB por origen | Hasta que se borre | Sincrónica | No |
| **`sessionStorage`** | ~5-10 MB por origen | Hasta cerrar la pestaña | Sincrónica | No |
| **IndexedDB** | Cientos de MB o más | Hasta que se borre | Asíncrona | No |
| **Cache Storage** | Depende del navegador | Hasta que se borre | Asíncrona | No |

**Origen:** el almacenamiento está aislado por **origen**, es decir, por combinación de protocolo, dominio y puerto. `https://ejemplo.com` y `http://ejemplo.com` son orígenes distintos. `https://ejemplo.com:8080` también.

```text
https://ejemplo.com/app     → origen https://ejemplo.com
https://ejemplo.com/otra    → mismo origen
http://ejemplo.com          → otro origen (http)
https://sub.ejemplo.com     → otro origen (subdominio)
```

**Qué usar según el caso:**

| Necesitas... | Usa... |
|---|---|
| Preferencias pequeñas (tema, idioma) | `localStorage` |
| Datos temporales de una pestaña | `sessionStorage` |
| Sesión autenticada | Cookie `HttpOnly` + `Secure` (servidor) |
| Muchos datos estructurados | IndexedDB |
| Archivos para offline | Cache Storage + Service Worker |
| Datos que deben viajar al servidor en cada petición | Cookies |

### 6.6.2 `localStorage`

`localStorage` guarda pares clave-valor de forma persistente en el origen actual. Los datos sobreviven a recargas y al cierre del navegador.

```js
localStorage.setItem("tema", "oscuro");
console.log(localStorage.getItem("tema")); // "oscuro"

localStorage.removeItem("tema");
console.log(localStorage.getItem("tema")); // null

localStorage.clear(); // borra todo el origen
```

**API:**

| Método / propiedad | Qué hace |
|---|---|
| `setItem(clave, valor)` | Guarda un string |
| `getItem(clave)` | Devuelve el string o `null` |
| `removeItem(clave)` | Elimina una clave |
| `clear()` | Borra todo el almacenamiento del origen |
| `key(indice)` | Devuelve la clave en esa posición |
| `length` | Número de claves |

```js
localStorage.setItem("usuario", "Ana");
localStorage.setItem("idioma", "es");

console.log(localStorage.length); // 2
console.log(localStorage.key(0)); // "usuario" (el orden no está garantizado)

for (let i = 0; i < localStorage.length; i++) {
  const clave = localStorage.key(i);
  console.log(clave, localStorage.getItem(clave));
}
```

**Solo guarda strings.** Si guardas un número, se convierte a string:

```js
localStorage.setItem("contador", 42);
console.log(localStorage.getItem("contador")); // "42"
console.log(typeof localStorage.getItem("contador")); // "string"

const contador = Number(localStorage.getItem("contador"));
```

**Sincrónico:** cada operación bloquea el hilo principal. No guardes megabytes en un bucle.

```js
// ❌ Bloquea el hilo
for (let i = 0; i < 10000; i++) {
  localStorage.setItem(`item-${i}`, JSON.stringify({ i }));
}

// ✅ Guarda un solo bloque o usa IndexedDB para datos grandes
```

**Errores de cuota:**

```js
try {
  localStorage.setItem("datos", "x".repeat(10_000_000));
} catch (error) {
  if (error.name === "QuotaExceededError") {
    console.error("No hay espacio en localStorage");
  }
}
```

### 6.6.3 `sessionStorage`

`sessionStorage` es igual que `localStorage`, pero los datos se borran al cerrar la pestaña. Cada pestaña tiene su propio `sessionStorage`.

```js
sessionStorage.setItem("paso", "2");
console.log(sessionStorage.getItem("paso")); // "2"
```

**Cuándo usarlo:**

- Datos de un formulario multi-paso.
- Estado temporal de una pestaña.
- Borradores que no deben persistir para siempre.

```js
// Guardar el paso actual de un formulario
sessionStorage.setItem("pasoFormulario", "3");

// Al recargar, restaurar
const paso = Number(sessionStorage.getItem("pasoFormulario")) || 1;
console.log("Paso actual:", paso);
```

**Diferencia clave:**

```js
localStorage.setItem("persistente", "sobrevive");
sessionStorage.setItem("temporal", "se borra al cerrar la pestaña");
```

Si abres la misma página en otra pestaña, `sessionStorage` estará vacío en la nueva pestaña. `localStorage` se comparte entre pestañas del mismo origen.

### 6.6.4 JSON: guardar objetos

`localStorage` solo guarda strings. Para guardar objetos o arrays, conviértelos a JSON.

> 📌 **Vista previa:** JSON se profundiza en el Módulo 7. Aquí usamos solo `JSON.stringify` y `JSON.parse` para serializar datos.

```js
const usuario = {
  nombre: "Ana",
  edad: 30,
  intereses: ["música", "deporte"],
};

localStorage.setItem("usuario", JSON.stringify(usuario));

const guardado = localStorage.getItem("usuario");
const recuperado = JSON.parse(guardado);

console.log(recuperado.nombre); // "Ana"
console.log(recuperado.intereses); // ["música", "deporte"]
```

**`JSON.stringify`** convierte un valor en un string JSON.
**`JSON.parse`** convierte un string JSON en un valor de JavaScript.

```js
console.log(JSON.stringify({ a: 1, b: [2, 3] })); // '{"a":1,"b":[2,3]}'
console.log(JSON.parse('{"a":1,"b":[2,3]}')); // { a: 1, b: [2, 3] }
```

**Manejo de datos corruptos:**

```js
function leerJSON(clave, valorPorDefecto) {
  const texto = localStorage.getItem(clave);

  if (texto === null) {
    return valorPorDefecto;
  }

  try {
    return JSON.parse(texto);
  } catch (error) {
    console.error(`Datos corruptos en "${clave}"`, error);
    return valorPorDefecto;
  }
}

const usuario = leerJSON("usuario", { nombre: "Invitado" });
```

**Lo que JSON no puede representar:**

- Funciones.
- `undefined` (se omite en objetos, se convierte en `null` en arrays).
- `Map`, `Set`, `WeakMap`, `WeakSet`.
- Fechas (se convierten en strings ISO).
- Referencias circulares (lanza error).

```js
const datos = {
  funcion: () => {},
  indefinido: undefined,
  mapa: new Map([["a", 1]]),
  fecha: new Date(),
};

console.log(JSON.stringify(datos));
// '{"fecha":"2026-11-13T..."}' — el resto se pierde
```

Para datos complejos, usa `structuredClone` (Módulo 3) en memoria o IndexedDB para persistencia.

### 6.6.5 Cookies

Las cookies son pequeños fragmentos de texto que el navegador envía al servidor en cada petición HTTP al mismo dominio. Se usan para sesiones, preferencias y seguimiento.

**Leer cookies:**

```js
console.log(document.cookie);
// "tema=oscuro; idioma=es"
```

`document.cookie` devuelve todas las cookies no `HttpOnly` como un string separado por `; `.

**Escribir una cookie:**

```js
document.cookie = "tema=oscuro";
document.cookie = "idioma=es; max-age=31536000; path=/";
```

Escribir una cookie **no reemplaza** las demás; añade o actualiza la cookie con ese nombre.

**Atributos:**

| Atributo | Qué hace |
|---|---|
| `path=/` | Disponible en todo el sitio |
| `max-age=segundos` | Duración en segundos |
| `expires=fecha` | Fecha de expiración |
| `secure` | Solo se envía por HTTPS |
| `samesite=strict` / `lax` / `none` | Controla el envío en peticiones cruzadas |
| `HttpOnly` | No accesible desde JavaScript (solo servidor) |
| `domain` | Dominio al que pertenece |

```js
// Cookie de sesión (se borra al cerrar el navegador)
document.cookie = "tema=oscuro; path=/";

// Cookie persistente por un año
document.cookie = "idioma=es; max-age=31536000; path=/; secure; samesite=lax";
```

**Borrar una cookie:**

```js
document.cookie = "tema=; max-age=0; path=/";
```

**`HttpOnly`:**

```text
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Lax
```

Una cookie `HttpOnly` no aparece en `document.cookie` y no puede ser leída por JavaScript. Es la opción correcta para tokens de sesión, porque protege contra XSS.

**Cookies vs `localStorage`:**

| Aspecto | Cookies | `localStorage` |
|---|---|---|
| Se envían al servidor | Sí, en cada petición | No |
| Capacidad | ~4 KB | ~5-10 MB |
| Accesibles desde JS | Sí, salvo `HttpOnly` | Sí |
| Expiración | Configurable | Hasta borrar |
| Uso típico | Sesión, preferencias del servidor | Preferencias del cliente |

> ⚠️ **No guardes tokens de sesión en `localStorage`.** Cualquier XSS puede leerlos. Usa cookies `HttpOnly`, `Secure` y `SameSite`.

**Parsear cookies:**

```js
function leerCookie(nombre) {
  const cookies = document.cookie.split("; ");
  const encontrada = cookies.find((cookie) => cookie.startsWith(`${nombre}=`));

  if (!encontrada) return null;

  return decodeURIComponent(encontrada.split("=")[1]);
}

console.log(leerCookie("tema")); // "oscuro"
```

### 6.6.6 IndexedDB (vista previa)

**IndexedDB** es una base de datos NoSQL en el navegador. Guarda objetos estructurados, archivos y grandes volúmenes de datos. Es asíncrona y usa transacciones.

```js
// Vista previa: IndexedDB se profundiza más adelante.
const solicitud = indexedDB.open("miBase", 1);

solicitud.onupgradeneeded = () => {
  const db = solicitud.result;
  db.createObjectStore("usuarios", { keyPath: "id" });
};

solicitud.onsuccess = () => {
  const db = solicitud.result;
  const transaccion = db.transaction("usuarios", "readwrite");
  const store = transaccion.objectStore("usuarios");

  store.add({ id: 1, nombre: "Ana" });

  transaccion.oncomplete = () => {
    console.log("Guardado en IndexedDB");
    db.close();
  };
};

solicitud.onerror = () => {
  console.error("Error al abrir IndexedDB", solicitud.error);
};
```

**Cuándo usarlo:**

- Muchos datos (miles de registros).
- Archivos o blobs.
- Datos que necesitan índices y consultas.
- Aplicaciones offline.

**Cuándo no usarlo:**

- Preferencias pequeñas: `localStorage` es más simple.
- Datos de sesión: cookies.

### 6.6.7 Cache Storage y Service Workers (vista previa)

**Cache Storage** guarda respuestas HTTP y archivos para que la aplicación funcione offline. Se usa junto con **Service Workers**, que interceptan peticiones de red.

```js
// Vista previa: requiere un Service Worker registrado.
caches.open("mi-app-v1").then((cache) => {
  return cache.addAll(["/", "/app.js", "/estilos.css"]);
});
```

**Service Worker** es un script que se ejecuta en segundo plano, separado de la página. Puede interceptar `fetch`, servir desde caché y sincronizar datos.

```js
// Vista previa: se registra desde la página.
navigator.serviceWorker.register("/sw.js");
```

Los verás en un módulo avanzado de PWA. Por ahora basta con saber que existen y que son la base de las aplicaciones offline.

### 6.6.8 Seguridad y límites

**Nunca guardes en `localStorage`:**

- Contraseñas.
- Tokens de sesión.
- Datos personales sensibles.
- Claves privadas.
- Información de tarjetas.

Cualquier script que se ejecute en tu origen (incluido un XSS) puede leer `localStorage`.

```js
// ❌ Nunca
localStorage.setItem("token", "eyJhbGciOi...");

// ✅ Para preferencias no sensibles
localStorage.setItem("tema", "oscuro");
```

**Cuotas y errores:**

```js
try {
  localStorage.setItem("datos", JSON.stringify(datosGrandes));
} catch (error) {
  if (error.name === "QuotaExceededError") {
    console.error("Almacenamiento lleno");
  } else {
    throw error;
  }
}
```

**Borrar al cerrar sesión:**

```js
function cerrarSesion() {
  localStorage.removeItem("usuario");
  sessionStorage.clear();
  // Las cookies de sesión las borra el servidor
}
```

**Datos compartidos entre pestañas:** `localStorage` se comparte. Si dos pestañas escriben a la vez, la última gana. Usa el evento `storage` (6.6.10) para sincronizar.

### 6.6.9 Patrón de almacenamiento seguro

Envolver `localStorage` en funciones evita repetir `JSON.parse`, manejar errores y cambiar de tecnología después.

```js
function crearAlmacen(clave, valorPorDefecto) {
  return {
    leer() {
      const texto = localStorage.getItem(clave);
      if (texto === null) return valorPorDefecto;

      try {
        return JSON.parse(texto);
      } catch (error) {
        console.error(`Datos corruptos en "${clave}"`, error);
        return valorPorDefecto;
      }
    },

    guardar(valor) {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
      } catch (error) {
        console.error(`No se pudo guardar "${clave}"`, error);
        return false;
      }
    },

    borrar() {
      localStorage.removeItem(clave);
    },
  };
}

const almacenTema = crearAlmacen("tema", "claro");

console.log(almacenTema.leer()); // "claro"
almacenTema.guardar("oscuro");
console.log(almacenTema.leer()); // "oscuro"
almacenTema.borrar();
```

**Versionado:**

Si cambias la estructura de los datos, versiona la clave para no romper datos antiguos.

```js
const almacen = crearAlmacen("usuario:v2", null);

// Migración desde v1
const antiguo = localStorage.getItem("usuario:v1");
if (antiguo && !almacen.leer()) {
  almacen.guardar(JSON.parse(antiguo));
  localStorage.removeItem("usuario:v1");
}
```

**Namespace:**

```js
const almacen = crearAlmacen("miApp:config", { tema: "claro" });
```

Usa un prefijo para evitar colisiones con otras aplicaciones del mismo origen.

### 6.6.10 Evento `storage`

El evento `storage` se dispara en **otras pestañas** del mismo origen cuando `localStorage` o `sessionStorage` cambian. Es la forma de sincronizar pestañas.

```js
window.addEventListener("storage", (evento) => {
  console.log("Clave:", evento.key);
  console.log("Valor anterior:", evento.oldValue);
  console.log("Valor nuevo:", evento.newValue);
  console.log("Área:", evento.storageArea);
  console.log("URL:", evento.url);
});
```

**Importante:** el evento no se dispara en la pestaña que hizo el cambio, solo en las demás. Esto evita bucles.

```js
// Pestaña A
localStorage.setItem("tema", "oscuro");

// Pestaña B recibe:
// key: "tema", oldValue: "claro", newValue: "oscuro"
```

**Sincronizar el tema entre pestañas:**

```js
window.addEventListener("storage", (evento) => {
  if (evento.key === "tema") {
    document.documentElement.dataset.tema = evento.newValue;
  }
});
```

**`evento.storageArea`** permite distinguir entre `localStorage` y `sessionStorage`.

### ✅ Haz esto / ❌ Evita esto (6.6)

```js
// ✅ Guarda strings o serializa con JSON
const usuarioGuardado = { nombre: "Ana" };
localStorage.setItem("usuario", JSON.stringify(usuarioGuardado));
const usuario = JSON.parse(localStorage.getItem("usuario"));

// ✅ Maneja datos corruptos con try/catch
try {
  const datos = JSON.parse(localStorage.getItem("datos"));
  console.log(datos);
} catch (error) {
  console.error("Datos corruptos", error);
}

// ✅ Usa un prefijo para tus claves
localStorage.setItem("miApp:tema", "oscuro");

// ✅ Borra datos sensibles al cerrar sesión
localStorage.removeItem("usuario");

// ✅ Usa cookies HttpOnly para sesiones
// Set-Cookie: session=abc; HttpOnly; Secure; SameSite=Lax

// ✅ Escucha storage para sincronizar pestañas
window.addEventListener("storage", sincronizar);

// ❌ Guardar objetos directamente
localStorage.setItem("usuario", usuario); // "[object Object]"

// ❌ Guardar tokens en localStorage
localStorage.setItem("token", token); // vulnerable a XSS

// ❌ Asumir que localStorage siempre funciona
localStorage.setItem("datos", JSON.stringify(datosGrandes)); // puede lanzar QuotaExceededError

// ❌ Usar cookies para datos grandes
document.cookie = `datos=${JSON.stringify(datosGrandes)}`; // límite ~4 KB

// ❌ Confiar en datos de localStorage sin validar
const usuarioSinValidar = JSON.parse(localStorage.getItem("usuario")); // puede ser null o corrupto

// ❌ Guardar en un bucle sin control
for (let i = 0; i < 100000; i++) {
  localStorage.setItem(`item-${i}`, i); // bloquea el hilo
}
```

---

## 6.7 — Animación y rendimiento

Una interfaz rápida se siente mejor que una interfaz bonita. En esta sección verás cómo animar sin bloquear el hilo, cómo evitar trabajo innecesario y cómo medir el rendimiento.

### 6.7.1 `requestAnimationFrame`

`requestAnimationFrame` (rAF) pide al navegador que ejecute una función **antes del siguiente repintado**. Es la forma correcta de animar.

```js
function animar(timestamp) {
  console.log("Frame en", timestamp);

  requestAnimationFrame(animar);
}

requestAnimationFrame(animar);
```

**`timestamp`** es el tiempo en milisegundos desde el inicio de la página. Te permite calcular movimientos suaves independientes de la velocidad del dispositivo.

```html
<div id="caja" style="width: 50px; height: 50px; background: tomato; position: absolute;"></div>
```

```js
const caja = document.querySelector("#caja");
let x = 0;

function animar(timestamp) {
  x += 2;
  caja.style.transform = `translateX(${x}px)`;

  if (x < 300) {
    requestAnimationFrame(animar);
  }
}

requestAnimationFrame(animar);
```

**Cancelar una animación:**

```js
let idAnimacion;

function animar() {
  // ...
  idAnimacion = requestAnimationFrame(animar);
}

function detener() {
  cancelAnimationFrame(idAnimacion);
}
```

**rAF no existe en Node.** Es una API del navegador. En Node usarías timers, pero no hay render.

**rAF se pausa en pestañas ocultas.** Esto ahorra batería. Si necesitas seguir calculando en segundo plano, usa timers o Web Workers (avanzado).

### 6.7.2 Timers vs `requestAnimationFrame`

| Aspecto | `setTimeout` / `setInterval` | `requestAnimationFrame` |
|---|---|---|
| Sincronizado con el repintado | No | Sí |
| Se pausa en pestañas ocultas | No | Sí |
| Precisión | Baja | Alta para animación |
| Uso típico | Retrasos, polling | Animaciones, transiciones |
| Disponible en Node | Sí | No |

```js
// ❌ Animación con setInterval: puede desincronizarse del render
setInterval(() => {
  x += 2;
  caja.style.transform = `translateX(${x}px)`;
}, 16);

// ✅ Animación con rAF
function animar() {
  x += 2;
  caja.style.transform = `translateX(${x}px)`;
  if (x < 300) requestAnimationFrame(animar);
}

requestAnimationFrame(animar);
```

**Regla:** usa `setTimeout` para “hacer algo después de X ms”. Usa `requestAnimationFrame` para “actualizar la pantalla en el próximo frame”.

### 6.7.3 El ciclo de render

El navegador no pinta cada cambio inmediatamente. Agrupa el trabajo en un ciclo:

1. **JavaScript:** ejecuta tu código.
2. **Style:** calcula qué estilos aplican a cada elemento.
3. **Layout:** calcula posiciones y tamaños.
4. **Paint:** genera las capas de píxeles.
5. **Composite:** combina las capas en la pantalla.

A 60 Hz, tienes unos **16,67 ms** por frame. Si tu JavaScript tarda más, se pierden frames y la animación se ve entrecortada.

```js
const inicio = performance.now();

// Trabajo pesado
for (let i = 0; i < 1_000_000; i++) {
  // ...
}

const fin = performance.now();
console.log(`Tardó ${fin - inicio} ms`);
```

`performance.now()` es una API de alta precisión. Es más adecuada que `Date.now()` para medir rendimiento. La verás con más detalle en el Módulo 7.

**Long tasks:** tareas de más de 50 ms. Bloquean el hilo y afectan la interactividad. Si una tarea tarda 200 ms, el usuario siente el retraso.

**Cómo reducir trabajo por frame:**

- Anima solo propiedades baratas (`transform`, `opacity`).
- Evita leer layout dentro de la animación.
- Usa `requestAnimationFrame` para agrupar cambios.
- Divide tareas largas en trozos (o usa Web Workers, avanzado).

### 6.7.4 Reflow y repaint

**Reflow (layout):** recalcular posiciones y tamaños. Ocurre cuando cambias `width`, `height`, `margin`, `padding`, `font-size`, o cuando insertas/eliminas nodos.

**Repaint:** volver a dibujar píxeles. Ocurre cuando cambias `color`, `background`, `visibility`, `box-shadow`.

**Layout thrashing:** alternar lecturas y escrituras de layout. El navegador se ve obligado a recalcular una y otra vez.

```js
// ❌ Layout thrashing
for (const item of items) {
  const alto = item.offsetHeight; // lectura
  item.style.height = alto + 10 + "px"; // escritura
}

// ✅ Separar fases
const altos = items.map((item) => item.offsetHeight);
items.forEach((item, i) => {
  item.style.height = altos[i] + 10 + "px";
});
```

**Propiedades que fuerzan layout al leerse:**

- `offsetWidth`, `offsetHeight`, `offsetTop`, `offsetLeft`.
- `clientWidth`, `clientHeight`.
- `scrollWidth`, `scrollHeight`, `scrollTop`, `scrollLeft`.
- `getBoundingClientRect()`.
- `getComputedStyle()` (en algunos casos).

**Cómo evitar layout thrashing:**

- Lee todo primero, escribe después.
- Usa `requestAnimationFrame` para agrupar escrituras.
- Usa `transform` en lugar de `top`/`left` para animar.
- Evita consultar medidas dentro de bucles de escritura.

```js
// ✅ Agrupar en un frame
requestAnimationFrame(() => {
  items.forEach((item) => {
    item.style.transform = "translateX(10px)";
  });
});
```

### 6.7.5 Transformaciones y `will-change`

No todas las propiedades CSS cuestan lo mismo.

| Propiedad | Costo | Por qué |
|---|---|---|
| `transform` | Bajo | Se puede hacer en la GPU |
| `opacity` | Bajo | Se puede hacer en la GPU |
| `width`, `height` | Alto | Provoca layout |
| `top`, `left` | Alto | Provoca layout |
| `margin`, `padding` | Alto | Provoca layout |
| `box-shadow` | Medio-alto | Provoca repaint |
| `background-color` | Medio | Provoca repaint |

```css
/* ✅ Barato */
.caja {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.caja:hover {
  transform: translateY(-4px) scale(1.02);
  opacity: 0.9;
}

/* ❌ Caro */
.caja-lenta {
  transition: width 0.2s ease, top 0.2s ease;
}
```

**`will-change`** avisa al navegador de que una propiedad va a cambiar. Úsalo con moderación: crear capas de más consume memoria.

```css
.caja {
  will-change: transform;
}

/* Mejor: añadirlo solo cuando la animación va a empezar */
.caja.animando {
  will-change: transform;
}
```

```js
caja.classList.add("animando");
// ... animar ...
caja.addEventListener("transitionend", () => {
  caja.classList.remove("animando");
}, { once: true });
```

> ⚠️ No pongas `will-change` en todos los elementos. Puede empeorar el rendimiento por el uso excesivo de memoria.

### 6.7.6 `IntersectionObserver` (vista previa)

`IntersectionObserver` avisa cuando un elemento entra o sale del viewport (o de otro contenedor). Es ideal para lazy loading, animaciones al hacer scroll y scroll infinito.

```js
const observador = new IntersectionObserver(
  (entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        console.log("Visible:", entrada.target);
        entrada.target.classList.add("visible");
        observador.unobserve(entrada.target); // dejar de observar
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll(".animar-al-scroll").forEach((elemento) => {
  observador.observe(elemento);
});
```

**Opciones:**

| Opción | Qué hace |
|---|---|
| `root` | Contenedor de referencia (`null` = viewport) |
| `rootMargin` | Margen alrededor del root |
| `threshold` | Porcentaje visible para disparar (0 a 1 o array) |

```js
const observador = new IntersectionObserver(callback, {
  root: null,
  rootMargin: "0px 0px -100px 0px",
  threshold: [0, 0.25, 0.5, 1],
});
```

**Ventaja:** no tienes que escuchar `scroll` ni calcular posiciones manualmente. El navegador optimiza el trabajo.

### 6.7.7 `ResizeObserver` (vista previa)

`ResizeObserver` avisa cuando cambia el tamaño de un elemento. Es útil para gráficos, mapas y layouts que dependen del contenedor.

```js
const observador = new ResizeObserver((entradas) => {
  for (const entrada of entradas) {
    const { width, height } = entrada.contentRect;
    console.log("Nuevo tamaño:", width, height);
  }
});

observador.observe(document.querySelector("#grafico"));
```

**Diferencia con `window.resize`:** `window.resize` solo avisa cuando cambia la ventana. `ResizeObserver` avisa cuando cambia un elemento concreto, aunque la ventana no cambie.

### 6.7.8 `debounce` y `throttle`

Dos técnicas para limitar la frecuencia con la que se ejecuta una función.

**Debounce:** espera a que dejen de ocurrir eventos durante un tiempo. Se usa cuando solo importa el último valor (búsqueda mientras escribes).

```js
function debounce(funcion, espera) {
  let temporizador;

  return function (...args) {
    clearTimeout(temporizador);

    temporizador = setTimeout(() => {
      funcion.apply(this, args);
    }, espera);
  };
}

const buscar = debounce((texto) => {
  console.log("Buscar:", texto);
}, 300);

input.addEventListener("input", (evento) => {
  buscar(evento.target.value);
});
```

**Throttle:** ejecuta la función como máximo una vez cada X ms. Se usa cuando quieres actualizaciones periódicas (scroll, resize, mousemove).

```js
function throttle(funcion, espera) {
  let ultimaEjecucion = 0;
  let temporizador = null;

  return function (...args) {
    const ahora = Date.now();
    const restante = espera - (ahora - ultimaEjecucion);

    if (restante <= 0) {
      clearTimeout(temporizador);
      temporizador = null;
      ultimaEjecucion = ahora;
      funcion.apply(this, args);
    } else if (!temporizador) {
      temporizador = setTimeout(() => {
        ultimaEjecucion = Date.now();
        temporizador = null;
        funcion.apply(this, args);
      }, restante);
    }
  };
}

const actualizar = throttle(() => {
  console.log("Scroll");
}, 100);

window.addEventListener("scroll", actualizar, { passive: true });
```

**Comparación:**

| Técnica | Comportamiento | Caso típico |
|---|---|---|
| Debounce | Espera a que pare el evento | Buscador, validación mientras escribes |
| Throttle | Ejecuta cada X ms | Scroll, resize, mousemove |

```js
// Debounce: solo busca cuando el usuario deja de escribir
const buscar = debounce(consultarAPI, 300);

// Throttle: actualiza como máximo cada 100 ms
const actualizar = throttle(calcularPosicion, 100);
```

**Implementación con `AbortController`:** si el debounce lanza una petición, puedes cancelar la anterior (Módulo 7). Por ahora, limpiar el timer es suficiente.

### 6.7.9 Visibilidad y rendimiento

Cuando la pestaña está oculta, el navegador pausa rAF y reduce timers. Puedes detectarlo con `document.visibilityState`.

```js
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    console.log("Pestaña oculta: pausar animaciones");
    pausar();
  } else {
    console.log("Pestaña visible: reanudar");
    reanudar();
  }
});
```

**`document.hidden`** es un booleano equivalente:

```js
if (document.hidden) {
  // ...
}
```

**Cuándo usarlo:**

- Pausar animaciones y timers.
- Detener polling.
- Guardar estado antes de que la pestaña se oculte.
- Evitar trabajo innecesario en segundo plano.

```js
let intervalo;

function iniciar() {
  intervalo = setInterval(actualizarDatos, 5000);
}

function pausar() {
  clearInterval(intervalo);
}

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    pausar();
  } else {
    iniciar();
  }
});
```

### ✅ Haz esto / ❌ Evita esto (6.7)

```js
// ✅ Usa rAF para animar
function animar() {
  caja.style.transform = `translateX(${x}px)`;
  if (x < 300) requestAnimationFrame(animar);
}
requestAnimationFrame(animar);

// ✅ Anima transform y opacity
caja.style.transform = "translateX(100px)";
caja.style.opacity = "0.5";

// ✅ Separa lecturas y escrituras de layout
const altos = items.map((item) => item.offsetHeight);
items.forEach((item, i) => {
  item.style.height = altos[i] + "px";
});

// ✅ Usa debounce para búsquedas
const buscar = debounce(consultar, 300);
input.addEventListener("input", (e) => buscar(e.target.value));

// ✅ Usa throttle para scroll
const actualizar = throttle(calcular, 100);
window.addEventListener("scroll", actualizar, { passive: true });

// ✅ Pausa animaciones en pestañas ocultas
document.addEventListener("visibilitychange", () => {
  if (document.hidden) pausar();
});

// ❌ Animar width, height, top o left
caja.style.width = "200px"; // provoca layout

// ❌ Layout thrashing
for (const item of items) {
  item.style.width = item.offsetWidth + 10 + "px";
}

// ❌ Escuchar scroll sin throttle ni passive
window.addEventListener("scroll", () => {
  // trabajo pesado
});

// ❌ Usar setInterval para animar
setInterval(() => {
  caja.style.left = x++ + "px";
}, 16);

// ❌ Abusar de will-change
// * { will-change: transform; }
```

---

## 6.8 — Organización del código del navegador

A medida que una página crece, el código se desordena: variables globales, listeners duplicados, estado disperso. Esta sección trata de mantener el código del navegador predecible.

### 6.8.1 Scripts vs módulos

Un `<script>` normal se ejecuta en el ámbito global. Un `<script type="module">` tiene su propio ámbito, se ejecuta en modo estricto y se comporta como `defer`.

```html
<!-- Script normal: comparte el ámbito global -->
<script src="app.js"></script>

<!-- Módulo: ámbito propio, modo estricto, defer -->
<script type="module" src="app.js"></script>
```

```js
// app.js como script normal
var contador = 0; // se convierte en window.contador
```

```js
// app.js como módulo
const contador = 0; // no contamina window
export { contador }; // requiere Módulo 7
```

| Aspecto | Script normal | Módulo |
|---|---|---|
| Ámbito | Global | Propio |
| Modo estricto | No por defecto | Sí |
| `defer` implícito | No | Sí |
| `import`/`export` | No | Sí |
| `this` en el nivel superior | `window` | `undefined` |

Los módulos ES se explican en el Módulo 7. Mientras tanto, puedes organizar el código con funciones, IIFE y el patrón módulo.

### 6.8.2 IIFE y namespaces

Una **IIFE** (Immediately Invoked Function Expression) es una función que se ejecuta inmediatamente. Sirve para crear un ámbito privado y no contaminar el global.

```js
(function () {
  const contador = 0;

  function incrementar() {
    // ...
  }

  console.log("Dentro de la IIFE");
})();

// console.log(contador); // ReferenceError
```

**IIFE con retorno (patrón módulo):**

```js
const miModulo = (function () {
  let contador = 0;

  function incrementar() {
    contador += 1;
    return contador;
  }

  function obtener() {
    return contador;
  }

  return {
    incrementar,
    obtener,
  };
})();

console.log(miModulo.incrementar()); // 1
console.log(miModulo.obtener()); // 1
console.log(miModulo.contador); // undefined
```

**Namespaces con objetos:**

```js
const App = {
  ui: {},
  datos: {},
  utilidades: {},
};

App.ui.mostrarMensaje = function (texto) {
  console.log(texto);
};
```

Los namespaces son una convención, no una característica del lenguaje. Los módulos ES los reemplazan en proyectos modernos.

### 6.8.3 Patrón módulo

El patrón módulo encapsula estado y expone solo lo necesario. Es la base de muchas bibliotecas.

```js
const carrito = (function () {
  const items = [];

  function agregar(producto) {
    items.push(producto);
  }

  function quitar(id) {
    const indice = items.findIndex((item) => item.id === id);
    if (indice !== -1) items.splice(indice, 1);
  }

  function total() {
    return items.reduce((suma, item) => suma + item.precio, 0);
  }

  function listar() {
    return items.map((item) => ({ ...item }));
  }

  return {
    agregar,
    quitar,
    total,
    listar,
  };
})();

carrito.agregar({ id: 1, nombre: "Camisa", precio: 20 });
carrito.agregar({ id: 2, nombre: "Pantalón", precio: 30 });

console.log(carrito.total()); // 50
console.log(carrito.listar()); // [{...}, {...}]
```

**Ventajas:**

- Estado privado.
- API clara.
- Fácil de probar.

**Desventaja:** un solo archivo puede volverse grande. Los módulos ES resuelven eso en el Módulo 7.

### 6.8.4 Separar estado, DOM y lógica

El error más común en código de navegador es mezclar todo: leer el DOM, calcular, modificar el DOM y guardar en el mismo lugar. Separa tres capas:

1. **Estado:** los datos de la aplicación.
2. **Lógica:** las funciones que transforman el estado.
3. **Render:** las funciones que reflejan el estado en el DOM.

```js
// 1. Estado
const estado = {
  tareas: [],
  filtro: "todas",
};

// 2. Lógica
function agregarTarea(texto) {
  estado.tareas.push({
    id: Date.now(),
    texto,
    completada: false,
  });
  render();
}

function toggleTarea(id) {
  const tarea = estado.tareas.find((t) => t.id === id);
  if (tarea) tarea.completada = !tarea.completada;
  render();
}

function eliminarTarea(id) {
  estado.tareas = estado.tareas.filter((t) => t.id !== id);
  render();
}

// 3. Render
function render() {
  const lista = document.querySelector("#lista");
  lista.textContent = "";

  const filtradas = estado.tareas.filter((tarea) => {
    if (estado.filtro === "activas") return !tarea.completada;
    if (estado.filtro === "completadas") return tarea.completada;
    return true;
  });

  const fragmento = document.createDocumentFragment();

  for (const tarea of filtradas) {
    const li = document.createElement("li");
    li.dataset.id = tarea.id;
    li.textContent = tarea.texto;

    if (tarea.completada) {
      li.classList.add("completada");
    }

    fragmento.append(li);
  }

  lista.append(fragmento);
}
```

**Ventajas:**

- El estado es la fuente de verdad.
- El render es una función pura del estado (no lee el DOM para decidir).
- Es más fácil de depurar: inspeccionas `estado`.

**Regla:** si necesitas saber algo, léelo del estado, no del DOM. El DOM es una representación, no la fuente de verdad.

### 6.8.5 Renderizado declarativo vs imperativo

**Imperativo:** le dices al navegador paso a paso qué cambiar.

```js
// Imperativo
const titulo = document.querySelector("#titulo");
titulo.textContent = "Nuevo título";
titulo.classList.add("activo");
```

**Declarativo:** describes cómo debería verse la interfaz para un estado, y una función se encarga de aplicarlo.

```js
// Declarativo
function renderTitulo(estado) {
  const titulo = document.querySelector("#titulo");
  titulo.textContent = estado.titulo;
  titulo.classList.toggle("activo", estado.activo);
}

renderTitulo({ titulo: "Nuevo título", activo: true });
```

En JavaScript puro, el render declarativo se implementa con funciones que reciben el estado. En frameworks como React, el framework hace el diff. Aquí hacemos una versión simple.

**Comparación:**

| Imperativo | Declarativo |
|---|---|
| “Cambia este texto y añade esta clase” | “Así debe verse la interfaz con este estado” |
| Más código repetido | Menos duplicación |
| Fácil de romper si el estado cambia | El render siempre refleja el estado |

```js
// ❌ Imperativo disperso
if (usuario) {
  document.querySelector("#login").hidden = true;
  document.querySelector("#perfil").hidden = false;
  document.querySelector("#nombre").textContent = usuario.nombre;
}

// ✅ Declarativo
function renderUsuario(usuario) {
  document.querySelector("#login").hidden = Boolean(usuario);
  document.querySelector("#perfil").hidden = !usuario;
  document.querySelector("#nombre").textContent = usuario?.nombre ?? "";
}

renderUsuario(usuario);
```

### 6.8.6 Componentes con funciones

Un componente es una pieza de interfaz con su propio estado, render y limpieza. En JavaScript puro puedes crear una fábrica de componentes.

```js
function crearContador(contenedor) {
  let valor = 0;

  const display = document.createElement("span");
  const boton = document.createElement("button");
  boton.textContent = "+1";

  contenedor.append(display, boton);

  function render() {
    display.textContent = String(valor);
  }

  function incrementar() {
    valor += 1;
    render();
  }

  boton.addEventListener("click", incrementar);

  render();

  return {
    incrementar,
    obtenerValor: () => valor,
    destruir() {
      boton.removeEventListener("click", incrementar);
      display.remove();
      boton.remove();
    },
  };
}

const contador = crearContador(document.querySelector("#app"));
contador.incrementar();
console.log(contador.obtenerValor()); // 1
```

**Con `AbortController`:**

```js
function crearContador(contenedor) {
  let valor = 0;
  const controller = new AbortController();
  const { signal } = controller;

  const display = document.createElement("span");
  const boton = document.createElement("button");
  boton.textContent = "+1";

  contenedor.append(display, boton);

  function render() {
    display.textContent = String(valor);
  }

  boton.addEventListener(
    "click",
    () => {
      valor += 1;
      render();
    },
    { signal }
  );

  render();

  return {
    destruir() {
      controller.abort();
      display.remove();
      boton.remove();
    },
  };
}
```

**Regla:** un componente debe poder destruirse sin dejar listeners, timers ni referencias.

### 6.8.7 Estado simple con suscriptores

Puedes crear un pequeño store con `Set` de suscriptores. Es una versión mínima de lo que hacen las bibliotecas de estado.

```js
function crearStore(estadoInicial) {
  let estado = estadoInicial;
  const suscriptores = new Set();

  function obtener() {
    return estado;
  }

  function actualizar(cambios) {
    estado = { ...estado, ...cambios };
    suscriptores.forEach((suscriptor) => suscriptor(estado));
  }

  function suscribir(suscriptor) {
    suscriptores.add(suscriptor);
    suscriptor(estado);

    return function desuscribir() {
      suscriptores.delete(suscriptor);
    };
  }

  return { obtener, actualizar, suscribir };
}

const store = crearStore({ contador: 0 });

const desuscribir = store.suscribir((estado) => {
  document.querySelector("#contador").textContent = String(estado.contador);
});

document.querySelector("#sumar").addEventListener("click", () => {
  store.actualizar({ contador: store.obtener().contador + 1 });
});

// Más tarde:
// desuscribir();
```

**Cuándo usarlo:** cuando varios componentes necesitan el mismo estado. **Cuándo no:** si solo hay un componente, una variable local es más simple.

### 6.8.8 Errores globales

Los errores no capturados pueden romper la aplicación. Puedes escucharlos globalmente para registrar y mostrar un mensaje.

```js
window.addEventListener("error", (evento) => {
  console.error("Error no capturado:", evento.error);
  console.error("Archivo:", evento.filename);
  console.error("Línea:", evento.lineno, "Columna:", evento.colno);
});

window.addEventListener("unhandledrejection", (evento) => {
  console.error("Promesa rechazada sin manejar:", evento.reason);
  evento.preventDefault(); // evita el mensaje por defecto en algunos navegadores
});
```

**Errores de recursos:**

```js
window.addEventListener(
  "error",
  (evento) => {
    if (evento.target instanceof HTMLImageElement) {
      console.warn("No se pudo cargar la imagen:", evento.target.src);
    }
  },
  true
);
```

Los errores de carga de recursos no burbujean; hay que escucharlos en captura (`true`).

**`window.onerror`:**

```js
window.onerror = function (mensaje, archivo, linea, columna, error) {
  console.error("Error:", mensaje);
  return true; // evita el log por defecto
};
```

`addEventListener("error")` es más flexible y permite varios listeners.

> ⚠️ Un manejador global es una red de seguridad, no una excusa para no usar `try/catch`. Captura lo que puedas manejar; deja que lo demás se registre.

### 6.8.9 Depuración

**Herramientas:**

- `console.log`, `console.warn`, `console.error`.
- `console.table` para arrays de objetos.
- `console.dir` para nodos y objetos complejos.
- `console.time` / `console.timeEnd` para medir.
- `debugger` para pausar.
- Breakpoints en Sources.
- `$0` en DevTools para el elemento seleccionado.
- Panel Network para peticiones.
- Panel Application para almacenamiento.
- Panel Performance para grabaciones.

```js
console.time("calcular");
const resultado = calcularAlgo();
console.timeEnd("calcular"); // "calcular: 12.3ms"

console.table([
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" },
]);
```

**Depurar un evento:**

```js
boton.addEventListener("click", (evento) => {
  console.log("target:", evento.target);
  console.log("currentTarget:", evento.currentTarget);
  debugger;
});
```

**Depurar el DOM:**

```js
const elemento = document.querySelector("#caja");
console.log(elemento);
console.dir(elemento);
```

**No dejes logs en producción:**

```js
// ❌ Ruido en la consola
console.log("debug 1");
console.log("debug 2");

// ✅ Usa un logger condicional
const DEBUG = false;

function log(...args) {
  if (DEBUG) console.log(...args);
}
```

### 6.8.10 Accesibilidad y semántica

La accesibilidad no es un extra: es parte de hacer una interfaz correcta. Usa HTML semántico y teclado.

**Buenas prácticas:**

- Usa `<button>` para acciones, `<a>` para navegación.
- Usa `<label>` para campos.
- Usa `<h1>`–`<h6>` en orden.
- Asegura que todo se pueda usar con teclado.
- No elimines el foco (`outline: none`) sin reemplazarlo.
- Usa `aria-*` solo cuando el HTML semántico no alcanza.
- Prueba con lector de pantalla y zoom.

```html
<!-- ❌ Div clicable sin semántica -->
<div onclick="guardar()">Guardar</div>

<!-- ✅ Botón real -->
<button type="button" onclick="guardar()">Guardar</button>
```

```html
<!-- ❌ Enlace que no navega -->
<a href="#" onclick="abrirModal()">Abrir</a>

<!-- ✅ Botón -->
<button type="button" onclick="abrirModal()">Abrir</button>
```

**Foco visible:**

```css
/* ❌ */
button:focus {
  outline: none;
}

/* ✅ */
button:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
```

**Teclado:**

```js
document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") {
    cerrarModal();
  }
});
```

**`aria-expanded` para menús:**

```html
<button id="menu-boton" aria-expanded="false" aria-controls="menu">
  Menú
</button>
<ul id="menu" hidden>
  <li><a href="/perfil">Perfil</a></li>
  <li><a href="/salir">Salir</a></li>
</ul>
```

```js
const boton = document.querySelector("#menu-boton");
const menu = document.querySelector("#menu");

boton.addEventListener("click", () => {
  const abierto = boton.getAttribute("aria-expanded") === "true";
  boton.setAttribute("aria-expanded", String(!abierto));
  menu.hidden = abierto;
});
```

**Regla:** si funciona con ratón, debe funcionar con teclado. Si se ve, debe poder leerse con un lector de pantalla.

### ✅ Haz esto / ❌ Evita esto (6.8)

```js
// ✅ Encapsula el estado en un módulo o closure
const app = (function () {
  let estado = {};
  return { obtener: () => estado };
})();

// ✅ Separa estado, lógica y render
function render() {
  // refleja el estado
}

// ✅ Usa componentes con destrucción
const componente = crearComponente(contenedor);
componente.destruir();

// ✅ Escucha errores globales
window.addEventListener("error", manejarError);
window.addEventListener("unhandledrejection", manejarRechazo);

// ✅ Usa HTML semántico
// <button type="button">Guardar</button>

// ✅ Mantén el foco visible
// button:focus-visible { outline: 2px solid blue; }

// ❌ Variables globales para todo
var estado = {};
var usuario = {};
var carrito = [];

// ❌ Mezclar DOM, lógica y almacenamiento en un solo listener
boton.addEventListener("click", () => {
  const valor = document.querySelector("#input").value;
  const datos = JSON.parse(localStorage.getItem("datos"));
  datos.push(valor);
  localStorage.setItem("datos", JSON.stringify(datos));
  document.querySelector("#lista").innerHTML += `<li>${valor}</li>`;
});

// ❌ Componentes que no se pueden destruir
function crear() {
  window.addEventListener("resize", () => {});
}

// ❌ Usar divs para todo
// <div class="boton">Guardar</div>

// ❌ Quitar el outline sin reemplazo
// *:focus { outline: none; }

// ❌ Dejar debugger y logs en producción
debugger;
console.log("debug");
```

---

## 6.9 — Retos con solución explicada

Once retos que cubren todo el módulo. El último es un capstone opcional. Intenta resolverlos **antes** de leer la solución.

**Cómo trabajar cada reto:**

1. Crea una carpeta por reto.
2. Crea `index.html` con el HTML que se indica.
3. Crea `app.js` con tu intento.
4. Abre `index.html` en el navegador y revisa la consola.
5. Solo después compara con la solución.

Los retos de este módulo se ejecutan en el navegador. Si abres el archivo directamente con `file://` y tu navegador bloquea `localStorage`, usa un servidor local sencillo (por ejemplo, la extensión Live Server de tu editor). Los retos 1 a 4 funcionan sin almacenamiento.

> 📌 Cada solución usa solo conceptos de los Módulos 1 a 6. Cuando aparece algo de un módulo posterior, está marcado como vista previa.

---

### Reto 1 — Panel de perfil

**Conceptos:** 6.2.1, 6.2.2, 6.3.1, 6.3.7, 6.3.9, 6.4.2, 6.4.6.

Construye un panel de perfil que:

- Muestre un nombre, un rol y una lista de habilidades.
- Tenga un botón **Destacar perfil** que alterne una clase `destacado` y actualice su propio texto y `aria-pressed`.
- Tenga un botón **Añadir habilidad** que cree un `<li>` nuevo con `createElement` y `textContent`.
- Permita eliminar una habilidad con doble clic sobre ella.
- Limite la lista a 6 habilidades y desactive el botón al llegar al máximo.
- Anuncie cada cambio en un párrafo con `role="status"`.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Panel de perfil</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 40rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      .destacado {
        color: #b45309;
        text-decoration: underline;
      }

      li {
        margin: 0.25rem 0;
        cursor: pointer;
      }

      #estado {
        min-height: 1.5rem;
        color: #475569;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <main id="perfil">
      <h1 id="nombre">Ana García</h1>
      <p id="rol">Desarrolladora web</p>

      <h2>Habilidades</h2>
      <ul id="habilidades">
        <li>HTML</li>
        <li>CSS</li>
      </ul>

      <button id="destacar" type="button" aria-pressed="false">
        Destacar perfil
      </button>
      <button id="agregar" type="button">Añadir habilidad</button>

      <p id="estado" role="status"></p>
    </main>
  </body>
</html>
```

#### Solución

```js
// app.js
const nombre = document.querySelector("#nombre");
const rol = document.querySelector("#rol");
const habilidades = document.querySelector("#habilidades");
const botonDestacar = document.querySelector("#destacar");
const botonAgregar = document.querySelector("#agregar");
const estado = document.querySelector("#estado");

if (
  !nombre ||
  !rol ||
  !habilidades ||
  !botonDestacar ||
  !botonAgregar ||
  !estado
) {
  console.error("Faltan elementos obligatorios en el HTML");
} else {
  iniciar();
}

function iniciar() {
  const MAX_HABILIDADES = 6;
  let destacado = false;

  botonDestacar.addEventListener("click", () => {
    destacado = !destacado;

    nombre.classList.toggle("destacado", destacado);
    botonDestacar.setAttribute("aria-pressed", String(destacado));
    botonDestacar.textContent = destacado
      ? "Quitar destacado"
      : "Destacar perfil";

    anunciar(destacado ? "Perfil destacado" : "Destacado eliminado");
  });

  botonAgregar.addEventListener("click", () => {
    const total = habilidades.children.length;

    if (total >= MAX_HABILIDADES) {
      anunciar(`Máximo ${MAX_HABILIDADES} habilidades`);
      botonAgregar.disabled = true;
      return;
    }

    const li = document.createElement("li");
    li.textContent = `Habilidad ${total + 1}`;
    habilidades.append(li);

    anunciar(`Habilidad añadida. Total: ${total + 1}`);

    if (habilidades.children.length >= MAX_HABILIDADES) {
      botonAgregar.disabled = true;
    }
  });

  habilidades.addEventListener("dblclick", (evento) => {
    const li = evento.target.closest("li");
    if (!li) return;

    li.remove();
    botonAgregar.disabled = false;
    anunciar("Habilidad eliminada");
  });

  function anunciar(mensaje) {
    estado.textContent = mensaje;
  }
}
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | Selecciona los seis elementos con `querySelector` | Necesitas referencias estables para no consultar el DOM en cada evento |
| 2 | Comprueba `if (!nombre || ...)` | Si falta un elemento, `null.addEventListener` lanzaría `TypeError`. Mejor fallar con un mensaje claro |
| 3 | Llama a `iniciar()` solo si todo existe | Evita ejecutar lógica sobre un HTML incompleto |
| 4 | Declara `MAX_HABILIDADES` y `destacado` dentro de `iniciar` | Son estado privado del componente; no contaminan el ámbito global |
| 5 | `destacado = !destacado` | Alterna el estado booleano |
| 6 | `classList.toggle("destacado", destacado)` | El segundo argumento obliga a añadir o quitar según el booleano, sin alternar por accidente |
| 7 | `setAttribute("aria-pressed", String(destacado))` | Comunica el estado del botón a lectores de pantalla. `aria-pressed` espera `"true"` o `"false"` |
| 8 | `textContent = destacado ? ... : ...` | El texto del botón debe describir la acción siguiente, no el estado actual |
| 9 | `habilidades.children.length` | `children` cuenta solo elementos `<li>`, no nodos de texto |
| 10 | Comprueba el máximo antes de crear | Evita crear un nodo que luego tendrías que eliminar |
| 11 | `document.createElement("li")` | Crea un nodo nuevo, todavía fuera del documento |
| 12 | `li.textContent = ...` | Inserta texto seguro. Si usaras `innerHTML`, un texto con `<` podría interpretarse como HTML |
| 13 | `habilidades.append(li)` | Inserta el nodo al final del `<ul>` |
| 14 | `botonAgregar.disabled = true` | Desactiva el botón al llegar al límite. Un botón desactivado no dispara `click` |
| 15 | `evento.target.closest("li")` | El doble clic puede caer en el `<li>` o en un hijo. `closest` sube hasta el `<li>` más cercano |
| 16 | `if (!li) return` | Si el doble clic ocurre fuera de un `<li>`, no hacemos nada |
| 17 | `li.remove()` | Elimina el nodo del DOM |
| 18 | `botonAgregar.disabled = false` | Al liberar espacio, el botón vuelve a estar disponible |
| 19 | `anunciar(...)` | Centraliza la escritura del mensaje de estado en un solo lugar |

**Por qué el listener de `dblclick` está en `#habilidades`:** es delegación. Un solo listener atiende a todos los `<li>`, incluidos los que se crean después. Si pusieras un listener por `<li>`, tendrías que añadirlo también a cada habilidad nueva.

**Errores típicos:**

- Usar `innerHTML += "<li>..."` para añadir: vuelve a parsear toda la lista y puede destruir listeners existentes.
- Alternar la clase con `if (nombre.classList.contains(...))` en lugar de `toggle(clase, force)`: más código y más fácil de equivocar.
- No comprobar `null` después de `querySelector`.

---

### Reto 2 — Lista de tareas con estado y render

**Conceptos:** 6.3.9, 6.3.11, 6.4.2, 6.4.6, 6.8.4.

Crea una lista de tareas que:

- Añada tareas desde un formulario.
- Marque y desmarque tareas como completadas.
- Elimine tareas.
- Muestre cuántas quedan pendientes.
- Muestre un mensaje cuando la lista esté vacía.
- Use un objeto `estado` como fuente de verdad y una función `render()` que refleje ese estado.

No uses almacenamiento todavía: eso es el Reto 5.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Lista de tareas</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 36rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      form {
        display: flex;
        gap: 0.5rem;
      }

      input {
        flex: 1;
        padding: 0.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e2e8f0;
      }

      li span {
        flex: 1;
      }

      li.completada span {
        text-decoration: line-through;
        color: #64748b;
      }

      #vacio {
        color: #64748b;
        font-style: italic;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Tareas</h1>

    <form id="form-tarea">
      <label for="nueva-tarea" class="sr-only">Nueva tarea</label>
      <input
        id="nueva-tarea"
        name="nueva-tarea"
        type="text"
        placeholder="Escribe una tarea"
        autocomplete="off"
      />
      <button type="submit">Añadir</button>
    </form>

    <p id="contador"></p>
    <p id="vacio" hidden>No hay tareas. Añade la primera.</p>
    <ul id="lista-tareas"></ul>
  </body>
</html>
```

#### Solución

```js
// app.js
const form = document.querySelector("#form-tarea");
const input = document.querySelector("#nueva-tarea");
const lista = document.querySelector("#lista-tareas");
const contador = document.querySelector("#contador");
const vacio = document.querySelector("#vacio");

const estado = {
  tareas: [
    { id: 1, texto: "Repasar el Módulo 6", completada: false },
    { id: 2, texto: "Practicar delegación", completada: true },
  ],
  siguienteId: 3,
};

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const texto = input.value.trim();

  if (texto === "") {
    input.focus();
    return;
  }

  estado.tareas.push({
    id: estado.siguienteId,
    texto,
    completada: false,
  });

  estado.siguienteId += 1;
  input.value = "";
  input.focus();
  render();
});

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button");
  if (!boton) return;

  const li = boton.closest("li");
  const id = Number(li.dataset.id);

  if (boton.dataset.accion === "alternar") {
    const tarea = estado.tareas.find((t) => t.id === id);
    if (tarea) tarea.completada = !tarea.completada;
  }

  if (boton.dataset.accion === "eliminar") {
    estado.tareas = estado.tareas.filter((t) => t.id !== id);
  }

  render();
});

function render() {
  lista.textContent = "";
  const fragmento = document.createDocumentFragment();

  for (const tarea of estado.tareas) {
    const li = document.createElement("li");
    li.dataset.id = String(tarea.id);
    li.classList.toggle("completada", tarea.completada);

    const texto = document.createElement("span");
    texto.textContent = tarea.texto;

    const alternar = document.createElement("button");
    alternar.type = "button";
    alternar.dataset.accion = "alternar";
    alternar.textContent = tarea.completada ? "Deshacer" : "Completar";
    alternar.setAttribute("aria-pressed", String(tarea.completada));

    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.dataset.accion = "eliminar";
    eliminar.textContent = "Eliminar";

    li.append(texto, alternar, eliminar);
    fragmento.append(li);
  }

  lista.append(fragmento);

  const pendientes = estado.tareas.filter((t) => !t.completada).length;
  contador.textContent = `${pendientes} pendiente${pendientes === 1 ? "" : "s"}`;
  vacio.hidden = estado.tareas.length > 0;
}

render();
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `estado` contiene `tareas` y `siguienteId` | El estado es la fuente de verdad. El DOM solo lo representa |
| 2 | `submit` con `preventDefault()` | Evita que el formulario recargue la página |
| 3 | `input.value.trim()` | Elimina espacios al inicio y al final. Un texto de solo espacios no es una tarea válida |
| 4 | `if (texto === "")` | Validación mínima. Devuelve el foco al campo para que el usuario escriba |
| 5 | `estado.tareas.push({...})` | Añade la tarea al estado, no al DOM |
| 6 | `estado.siguienteId += 1` | Genera IDs únicos y estables. `Date.now()` puede repetirse si se crean dos tareas en el mismo milisegundo |
| 7 | `input.value = ""` y `input.focus()` | Limpia el campo y deja el cursor listo para la siguiente tarea |
| 8 | `render()` | Vuelve a dibujar la interfaz a partir del estado |
| 9 | `evento.target.closest("button")` | Delegación: un solo listener en `<ul>` atiende todos los botones, incluso los nuevos |
| 10 | `if (!boton) return` | Si el clic no fue en un botón, no hay nada que hacer |
| 11 | `boton.closest("li")` y `Number(li.dataset.id)` | Recupera la tarea afectada. `dataset` devuelve strings; conviértelo a número para comparar con `t.id` |
| 12 | `boton.dataset.accion` | Distingue la acción sin mirar el texto del botón ni su posición |
| 13 | `estado.tareas.find(...)` | Busca la tarea por ID. Si no existe, `if (tarea)` evita un `TypeError` |
| 14 | `estado.tareas = estado.tareas.filter(...)` | Crea un array nuevo sin la tarea eliminada. Es más claro que `splice` con índice |
| 15 | `lista.textContent = ""` | Vacía la lista de forma segura y rápida. No uses `innerHTML = ""` por costumbre; `textContent` expresa mejor la intención |
| 16 | `document.createDocumentFragment()` | Construye todos los `<li>` fuera del DOM y los inserta de una sola vez |
| 17 | `li.dataset.id = String(tarea.id)` | Guarda el ID en el HTML para recuperarlo en el listener |
| 18 | `classList.toggle("completada", tarea.completada)` | Sincroniza la clase con el estado, sin alternar a ciegas |
| 19 | `alternar.setAttribute("aria-pressed", ...)` | El botón comunica si la tarea está completada |
| 20 | `li.append(texto, alternar, eliminar)` | `append` acepta varios nodos en una sola llamada |
| 21 | `fragmento.append(li)` | Acumula los nodos en el fragmento |
| 22 | `lista.append(fragmento)` | Una sola inserción al DOM |
| 23 | `filter(...).length` | Cuenta pendientes sin modificar el array original |
| 24 | `vacio.hidden = estado.tareas.length > 0` | `hidden` oculta el párrafo cuando hay tareas y lo muestra cuando no hay |
| 25 | `render()` al final | Pinta el estado inicial. Sin esta llamada, las tareas de ejemplo no aparecerían |

**Por qué el render reconstruye toda la lista:** es la forma más simple de garantizar que el DOM coincida con el estado. Para listas pequeñas es perfectamente válido. En listas enormes se optimiza actualizando solo lo que cambió, pero esa optimización se aprende después.

**Errores típicos:**

- Leer el estado desde el DOM (`li.classList.contains("completada")`) en lugar del objeto `estado`.
- Guardar el índice en `dataset` y usarlo después de eliminar: los índices cambian. Usa IDs estables.
- Olvidar `type="button"` en los botones dentro de un formulario: se comportarían como `submit`.

---

### Reto 3 — Delegación de eventos en una tabla

**Conceptos:** 6.2.5, 6.3.5, 6.3.9, 6.4.3, 6.4.6, 6.4.10.

Crea una tabla de inventario con productos. Cada fila debe tener botones para sumar stock, restar stock y eliminar el producto. Requisitos:

- Un **solo** listener en el `<tbody>` para todos los botones.
- Usa `data-accion` y `data-id`.
- Muestra un resumen con el total de unidades.
- Añade un botón **Desactivar tabla** que elimine todos los listeners con `AbortController`.
- Comprueba en la consola la diferencia entre `event.target` y `event.currentTarget`.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Inventario</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 42rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      table {
        width: 100%;
        border-collapse: collapse;
      }

      th,
      td {
        padding: 0.5rem;
        border-bottom: 1px solid #e2e8f0;
        text-align: left;
      }

      td:last-child {
        display: flex;
        gap: 0.25rem;
      }

      .agotado {
        color: #b91c1c;
        font-weight: 600;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Inventario</h1>

    <table id="inventario">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="cuerpo"></tbody>
    </table>

    <p id="resumen"></p>
    <button id="desactivar" type="button">Desactivar tabla</button>
  </body>
</html>
```

#### Solución

```js
// app.js
const cuerpo = document.querySelector("#cuerpo");
const resumen = document.querySelector("#resumen");
const botonDesactivar = document.querySelector("#desactivar");

const productos = [
  { id: 1, nombre: "Camisa", stock: 4 },
  { id: 2, nombre: "Pantalón", stock: 0 },
  { id: 3, nombre: "Gorra", stock: 2 },
];

const controller = new AbortController();
const { signal } = controller;

cuerpo.addEventListener("click", manejarClic, { signal });
botonDesactivar.addEventListener("click", desactivar, { signal });

function manejarClic(evento) {
  const boton = evento.target.closest("button[data-accion]");

  if (!boton || !cuerpo.contains(boton)) return;

  const fila = boton.closest("tr");
  const id = Number(fila.dataset.id);
  const producto = productos.find((p) => p.id === id);

  if (!producto) return;

  const accion = boton.dataset.accion;

  if (accion === "sumar") {
    producto.stock += 1;
  }

  if (accion === "restar") {
    producto.stock = Math.max(0, producto.stock - 1);
  }

  if (accion === "eliminar") {
    const indice = productos.findIndex((p) => p.id === id);
    if (indice !== -1) productos.splice(indice, 1);
  }

  console.log("target:", evento.target.tagName);
  console.log("currentTarget:", evento.currentTarget.id);
  console.log("boton:", boton.textContent.trim());

  render();
}

function render() {
  cuerpo.textContent = "";
  const fragmento = document.createDocumentFragment();

  for (const producto of productos) {
    const fila = document.createElement("tr");
    fila.dataset.id = String(producto.id);

    const nombre = document.createElement("td");
    nombre.textContent = producto.nombre;

    const stock = document.createElement("td");
    stock.textContent = String(producto.stock);

    if (producto.stock === 0) {
      stock.classList.add("agotado");
      stock.textContent = "Agotado";
    }

    const acciones = document.createElement("td");

    const sumar = document.createElement("button");
    sumar.type = "button";
    sumar.dataset.accion = "sumar";
    sumar.textContent = "+1";
    sumar.setAttribute("aria-label", `Sumar stock de ${producto.nombre}`);

    const restar = document.createElement("button");
    restar.type = "button";
    restar.dataset.accion = "restar";
    restar.textContent = "−1";
    restar.setAttribute("aria-label", `Restar stock de ${producto.nombre}`);

    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.dataset.accion = "eliminar";
    eliminar.textContent = "Eliminar";
    eliminar.setAttribute("aria-label", `Eliminar ${producto.nombre}`);

    acciones.append(sumar, restar, eliminar);
    fila.append(nombre, stock, acciones);
    fragmento.append(fila);
  }

  cuerpo.append(fragmento);

  const totalUnidades = productos.reduce((total, p) => total + p.stock, 0);
  resumen.textContent = `${productos.length} producto${
    productos.length === 1 ? "" : "s"
  }, ${totalUnidades} unidad${totalUnidades === 1 ? "" : "es"} en total`;
}

function desactivar() {
  controller.abort();
  cuerpo.textContent = "";
  resumen.textContent = "Tabla desactivada";
  botonDesactivar.disabled = true;
  console.log("Listeners eliminados");
}

render();
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `new AbortController()` y `const { signal } = controller` | Crea una señal reutilizable para varios listeners |
| 2 | `cuerpo.addEventListener("click", manejarClic, { signal })` | Un solo listener para toda la tabla. La señal permite quitarlo después |
| 3 | `evento.target.closest("button[data-accion]")` | El clic puede caer en el texto del botón; `closest` sube hasta el botón con acción |
| 4 | `!cuerpo.contains(boton)` | Comprueba que el botón pertenece a esta tabla. Protege si el evento viniera de otra estructura |
| 5 | `boton.closest("tr")` | Encuentra la fila del producto |
| 6 | `Number(fila.dataset.id)` | `data-id` es un string; conviértelo para comparar con `producto.id` |
| 7 | `productos.find(...)` | Recupera el producto por ID. No confíes en el orden de las filas |
| 8 | `Math.max(0, producto.stock - 1)` | Evita stocks negativos sin necesidad de un `if` |
| 9 | `findIndex` + `splice` | Elimina el producto del array. `splice` modifica el array original |
| 10 | `evento.target.tagName` | Muestra el elemento exacto que recibió el clic (puede ser el `<button>`) |
| 11 | `evento.currentTarget.id` | Muestra el elemento que tiene el listener: siempre `"cuerpo"` |
| 12 | `render()` al final del manejador | Refleja el nuevo estado en la tabla |
| 13 | `cuerpo.textContent = ""` | Vacía la tabla antes de reconstruirla. El listener vive en `cuerpo`, no en las filas, así que sobrevive |
| 14 | `fila.dataset.id = String(producto.id)` | Cada fila lleva su ID en el DOM |
| 15 | `stock.classList.add("agotado")` | Estado visual derivado del stock |
| 16 | `aria-label` en cada botón | “+1” y “−1” no dicen de qué producto son. El `aria-label` da contexto a lectores de pantalla |
| 17 | `acciones.append(sumar, restar, eliminar)` | Añade los tres botones a la celda |
| 18 | `reduce` | Suma todas las unidades para el resumen |
| 19 | `controller.abort()` | Elimina de golpe los dos listeners registrados con la señal |
| 20 | `botonDesactivar.disabled = true` | Evita volver a pulsar un botón que ya no hace nada |

**Por qué la delegación sobrevive al render:** el listener está en `<tbody>`, que nunca se reemplaza. Solo se reemplazan sus hijos. Por eso los botones nuevos siguen funcionando sin volver a registrar nada.

**Qué demuestra la consola:**

```text
target: BUTTON
currentTarget: cuerpo
boton: +1
```

`target` es el botón concreto; `currentTarget` es siempre el `<tbody>`, porque ahí está registrado el listener.

**Errores típicos:**

- Poner el listener en cada botón dentro de `render()`: se acumulan listeners y se pierden referencias.
- Usar `evento.target.dataset.accion` sin `closest`: si el clic cae en un hijo del botón, `dataset` sería `undefined`.
- Llamar a `controller.abort()` y luego intentar seguir usando la misma señal: una señal abortada no se puede reutilizar.

---

### Reto 4 — Formulario de registro validado

**Conceptos:** 6.5.2, 6.5.3, 6.5.6, 6.5.7, 6.5.8, 6.5.9, 6.5.10.

Crea un formulario de registro con:

- Nombre, email, edad, contraseña, confirmación y aceptación de términos.
- Validación en JavaScript con mensajes claros por campo.
- `aria-invalid` y `aria-describedby` en cada campo.
- Un resumen de errores con `role="alert"`.
- Foco automático en el primer campo inválido.
- Mensaje de éxito y limpieza del formulario cuando todo es válido.
- `novalidate` para controlar tú los mensajes.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Registro</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 32rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      .campo {
        margin-bottom: 1rem;
      }

      label {
        display: block;
        margin-bottom: 0.25rem;
        font-weight: 600;
      }

      input {
        width: 100%;
        padding: 0.5rem;
        box-sizing: border-box;
      }

      input[aria-invalid="true"] {
        border: 2px solid #b91c1c;
      }

      .error {
        min-height: 1.25rem;
        margin: 0.25rem 0 0;
        color: #b91c1c;
        font-size: 0.875rem;
      }

      .resumen {
        padding: 0.75rem;
        background: #fee2e2;
        border: 1px solid #b91c1c;
        color: #7f1d1d;
      }

      .exito {
        padding: 0.75rem;
        background: #dcfce7;
        border: 1px solid #16a34a;
        color: #14532d;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Crear cuenta</h1>

    <p id="resumen-errores" class="resumen" role="alert" hidden></p>
    <p id="exito" class="exito" role="status" hidden></p>

    <form id="registro" novalidate>
      <div class="campo">
        <label for="nombre">Nombre *</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          autocomplete="name"
          aria-describedby="error-nombre"
          aria-invalid="false"
        />
        <p id="error-nombre" class="error"></p>
      </div>

      <div class="campo">
        <label for="email">Email *</label>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          aria-describedby="error-email"
          aria-invalid="false"
        />
        <p id="error-email" class="error"></p>
      </div>

      <div class="campo">
        <label for="edad">Edad *</label>
        <input
          id="edad"
          name="edad"
          type="number"
          min="18"
          max="120"
          aria-describedby="error-edad"
          aria-invalid="false"
        />
        <p id="error-edad" class="error"></p>
      </div>

      <div class="campo">
        <label for="password">Contraseña *</label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="new-password"
          aria-describedby="error-password"
          aria-invalid="false"
        />
        <p id="error-password" class="error"></p>
      </div>

      <div class="campo">
        <label for="confirmar">Confirmar contraseña *</label>
        <input
          id="confirmar"
          name="confirmar"
          type="password"
          autocomplete="new-password"
          aria-describedby="error-confirmar"
          aria-invalid="false"
        />
        <p id="error-confirmar" class="error"></p>
      </div>

      <div class="campo">
        <label>
          <input id="terminos" name="terminos" type="checkbox" />
          Acepto los términos *
        </label>
        <p id="error-terminos" class="error"></p>
      </div>

      <button type="submit">Crear cuenta</button>
      <button type="reset">Limpiar</button>
    </form>
  </body>
</html>
```

#### Solución

```js
// app.js
const form = document.querySelector("#registro");
const resumen = document.querySelector("#resumen-errores");
const exito = document.querySelector("#exito");

const campos = {
  nombre: document.querySelector("#nombre"),
  email: document.querySelector("#email"),
  edad: document.querySelector("#edad"),
  password: document.querySelector("#password"),
  confirmar: document.querySelector("#confirmar"),
  terminos: document.querySelector("#terminos"),
};

const ORDEN = ["nombre", "email", "edad", "password", "confirmar", "terminos"];

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const datos = Object.fromEntries(new FormData(form));
  const errores = validar(datos);

  mostrarErrores(errores);

  if (Object.keys(errores).length > 0) {
    exito.hidden = true;
    enfocarPrimerError(errores);
    return;
  }

  form.reset();
  mostrarErrores({});

  exito.hidden = false;
  exito.textContent = `Registro correcto para ${datos.nombre.trim()}`;
});

form.addEventListener("reset", () => {
  mostrarErrores({});
  exito.hidden = true;
});

function validar(datos) {
  const errores = {};

  const nombre = (datos.nombre ?? "").trim();
  const email = (datos.email ?? "").trim();
  const edad = Number(datos.edad);
  const password = datos.password ?? "";
  const confirmar = datos.confirmar ?? "";

  if (nombre.length < 2) {
    errores.nombre = "Escribe al menos 2 caracteres.";
  }

  if (!email.includes("@") || email.startsWith("@") || email.endsWith("@")) {
    errores.email = "El email no parece válido.";
  }

  if (!Number.isInteger(edad) || edad < 18 || edad > 120) {
    errores.edad = "La edad debe ser un entero entre 18 y 120.";
  }

  if (password.length < 8) {
    errores.password = "La contraseña debe tener al menos 8 caracteres.";
  }

  if (confirmar !== password) {
    errores.confirmar = "Las contraseñas no coinciden.";
  }

  if (!datos.terminos) {
    errores.terminos = "Debes aceptar los términos.";
  }

  return errores;
}

function mostrarErrores(errores) {
  for (const clave of ORDEN) {
    const campo = campos[clave];
    const salida = document.querySelector(`#error-${clave}`);
    const mensaje = errores[clave] ?? "";

    if (salida) salida.textContent = mensaje;
    campo.setAttribute("aria-invalid", mensaje ? "true" : "false");
  }

  const cantidad = Object.keys(errores).length;

  resumen.hidden = cantidad === 0;
  resumen.textContent =
    cantidad === 0
      ? ""
      : `Hay ${cantidad} error${cantidad === 1 ? "" : "es"} en el formulario.`;
}

function enfocarPrimerError(errores) {
  const primero = ORDEN.find((clave) => errores[clave]);
  if (!primero) return;

  campos[primero].focus();
}
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `novalidate` en el HTML | Desactiva los globos nativos del navegador para mostrar tus propios mensajes |
| 2 | `new FormData(form)` | Recoge todos los campos con `name` en una estructura clave-valor |
| 3 | `Object.fromEntries(...)` | Convierte `FormData` en un objeto plano. Muy útil para validar y para enviar |
| 4 | `validar(datos)` | Separa la validación de la interfaz. La función no toca el DOM |
| 5 | `datos.nombre ?? ""` | Si el campo no existe o viene `null`, evita `undefined.trim()` |
| 6 | `Number(datos.edad)` | Convierte el string del input a número. Un campo vacío da `0` |
| 7 | `Number.isInteger(edad)` | Rechaza decimales y `NaN` |
| 8 | `password.length < 8` | Regla de longitud mínima. No valida “fuerza”: eso depende del producto |
| 9 | `confirmar !== password` | Validación cruzada entre dos campos |
| 10 | `!datos.terminos` | Un checkbox no marcado no aparece en `FormData`, así que `datos.terminos` es `undefined` |
| 11 | `errores` como objeto | Cada clave es un campo; cada valor, un mensaje. Fácil de recorrer y mostrar |
| 12 | `mostrarErrores(errores)` | Sincroniza los mensajes y `aria-invalid` con el resultado |
| 13 | `Object.keys(errores).length > 0` | Si hay al menos una clave, hay errores |
| 14 | `exito.hidden = true` | Oculta un mensaje de éxito anterior |
| 15 | `enfocarPrimerError(errores)` | Lleva el foco al primer campo inválido en el orden visual |
| 16 | `form.reset()` | Restaura los valores iniciales y limpia checkboxes |
| 17 | `mostrarErrores({})` | Borra todos los mensajes después del reset |
| 18 | `form.addEventListener("reset", ...)` | El botón `type="reset"` dispara `reset`; limpia también los mensajes |
| 19 | `campo.setAttribute("aria-invalid", ...)` | Los lectores de pantalla anuncian el campo como inválido |
| 20 | `aria-describedby="error-nombre"` | Asocia el campo con su mensaje de error |
| 21 | `resumen.hidden = cantidad === 0` | El resumen solo aparece cuando hay errores |
| 22 | `role="alert"` | Hace que el resumen se anuncie en cuanto aparece |
| 23 | `ORDEN.find(...)` | `find` devuelve la primera clave con error, respetando el orden del formulario |
| 24 | `campos[primero].focus()` | Mueve el foco. El usuario no tiene que buscar el error |

**Por qué el mensaje de éxito se asigna después de `form.reset()`:** el evento `reset` oculta el mensaje de éxito. Si lo mostraras antes de resetear, el listener de `reset` lo volvería a ocultar.

**Por qué no basta con HTML5:** HTML5 valida formato, pero no reglas como “las contraseñas coinciden” ni mensajes adaptados a tu producto. Además, el usuario puede desactivar JavaScript o modificar la petición. **El servidor debe validar de nuevo.**

**Errores típicos:**

- Mostrar errores antes de que el usuario interactúe: espera al `submit` o al `blur`.
- Usar solo color para indicar el error: añade texto y `aria-invalid`.
- Olvidar `name` en los campos: `FormData` no los recoge.
- No limpiar los mensajes tras un `reset`.
- Validar con `parseInt` sin comprobar `NaN`: `Number` + `Number.isInteger` es más predecible.

---

### Reto 5 — Persistencia de tareas con `localStorage`

**Conceptos:** 6.6.2, 6.6.4, 6.6.8, 6.6.9, 6.8.4.

Amplía la lista de tareas del Reto 2 para que:

- Se guarde en `localStorage` después de cada cambio.
- Se cargue al abrir la página.
- Resista datos corruptos sin romperse.
- Use una clave versionada (`tareas:v1`).
- Maneje el error de cuota.
- Permita borrar todas las tareas.

> 📌 `JSON.stringify` y `JSON.parse` se usan aquí como vista previa de serialización. En el Módulo 7 verás JSON a fondo.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Tareas persistentes</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 36rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      form {
        display: flex;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      input {
        flex: 1;
        padding: 0.5rem;
      }

      ul {
        list-style: none;
        padding: 0;
      }

      li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #e2e8f0;
      }

      li span {
        flex: 1;
      }

      li.completada span {
        text-decoration: line-through;
        color: #64748b;
      }

      #aviso {
        min-height: 1.5rem;
        color: #b91c1c;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Tareas persistentes</h1>

    <form id="form-tarea">
      <label for="nueva-tarea">Nueva tarea</label>
      <input id="nueva-tarea" name="nueva-tarea" type="text" autocomplete="off" />
      <button type="submit">Añadir</button>
    </form>

    <p id="contador"></p>
    <p id="vacio" hidden>No hay tareas.</p>
    <p id="aviso" role="alert"></p>

    <ul id="lista-tareas"></ul>

    <button id="borrar-todo" type="button">Borrar todas</button>
  </body>
</html>
```

#### Solución

```js
// app.js
const form = document.querySelector("#form-tarea");
const input = document.querySelector("#nueva-tarea");
const lista = document.querySelector("#lista-tareas");
const contador = document.querySelector("#contador");
const vacio = document.querySelector("#vacio");
const aviso = document.querySelector("#aviso");
const botonBorrar = document.querySelector("#borrar-todo");

const CLAVE = "tareas:v1";

function crearAlmacen(clave, valorPorDefecto) {
  return {
    leer() {
      const texto = localStorage.getItem(clave);

      if (texto === null) return valorPorDefecto;

      try {
        return JSON.parse(texto);
      } catch (error) {
        console.error(`Datos corruptos en "${clave}"`, error);
        return valorPorDefecto;
      }
    },

    guardar(valor) {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
      } catch (error) {
        console.error(`No se pudo guardar "${clave}"`, error);
        return false;
      }
    },

    borrar() {
      localStorage.removeItem(clave);
    },
  };
}

function normalizarEstado(valor) {
  if (!valor || !Array.isArray(valor.tareas)) {
    return { tareas: [], siguienteId: 1 };
  }

  const tareas = valor.tareas
    .filter((tarea) => {
      return (
        tarea &&
        typeof tarea.id === "number" &&
        typeof tarea.texto === "string"
      );
    })
    .map((tarea) => ({
      id: tarea.id,
      texto: tarea.texto,
      completada: Boolean(tarea.completada),
    }));

  const maxId = tareas.reduce((max, tarea) => Math.max(max, tarea.id), 0);
  const siguienteId = Math.max(Number(valor.siguienteId) || 1, maxId + 1);

  return { tareas, siguienteId };
}

const almacen = crearAlmacen(CLAVE, {
  tareas: [{ id: 1, texto: "Repasar el Módulo 6", completada: false }],
  siguienteId: 2,
});

let estado = normalizarEstado(almacen.leer());

form.addEventListener("submit", (evento) => {
  evento.preventDefault();

  const texto = input.value.trim();

  if (texto === "") {
    input.focus();
    return;
  }

  estado.tareas.push({
    id: estado.siguienteId,
    texto,
    completada: false,
  });

  estado.siguienteId += 1;
  input.value = "";
  input.focus();

  guardarYRenderizar();
});

lista.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.closest("li").dataset.id);
  const accion = boton.dataset.accion;

  if (accion === "alternar") {
    const tarea = estado.tareas.find((t) => t.id === id);
    if (tarea) tarea.completada = !tarea.completada;
  }

  if (accion === "eliminar") {
    estado.tareas = estado.tareas.filter((t) => t.id !== id);
  }

  guardarYRenderizar();
});

botonBorrar.addEventListener("click", () => {
  estado = { tareas: [], siguienteId: 1 };
  almacen.borrar();
  guardarYRenderizar();
});

function guardarYRenderizar() {
  const guardado = almacen.guardar(estado);

  aviso.textContent = guardado
    ? ""
    : "No se pudieron guardar los cambios. El almacenamiento está lleno o bloqueado.";

  render();
}

function render() {
  lista.textContent = "";
  const fragmento = document.createDocumentFragment();

  for (const tarea of estado.tareas) {
    const li = document.createElement("li");
    li.dataset.id = String(tarea.id);
    li.classList.toggle("completada", tarea.completada);

    const texto = document.createElement("span");
    texto.textContent = tarea.texto;

    const alternar = document.createElement("button");
    alternar.type = "button";
    alternar.dataset.accion = "alternar";
    alternar.textContent = tarea.completada ? "Deshacer" : "Completar";

    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.dataset.accion = "eliminar";
    eliminar.textContent = "Eliminar";

    li.append(texto, alternar, eliminar);
    fragmento.append(li);
  }

  lista.append(fragmento);

  const pendientes = estado.tareas.filter((t) => !t.completada).length;
  contador.textContent = `${pendientes} pendiente${pendientes === 1 ? "" : "s"}`;
  vacio.hidden = estado.tareas.length > 0;
}

render();
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `const CLAVE = "tareas:v1"` | El sufijo `:v1` permite cambiar el formato en el futuro sin romper datos antiguos |
| 2 | `crearAlmacen` devuelve `{ leer, guardar, borrar }` | Encapsula `localStorage`, `JSON` y el manejo de errores en un solo lugar |
| 3 | `localStorage.getItem(clave)` | Devuelve `null` si la clave no existe |
| 4 | `if (texto === null) return valorPorDefecto` | Distingue “no hay datos” de “datos vacíos o corruptos” |
| 5 | `try { return JSON.parse(texto) }` | Si el string no es JSON válido, lanza `SyntaxError` |
| 6 | `catch` devuelve el valor por defecto | La aplicación sigue funcionando aunque el dato esté corrupto |
| 7 | `JSON.stringify(valor)` | Convierte el objeto en un string que `localStorage` puede guardar |
| 8 | `return true` / `return false` | `guardar` informa si tuvo éxito; el llamador decide qué mostrar |
| 9 | `catch` en `guardar` | `localStorage.setItem` puede lanzar `QuotaExceededError` o fallar si está bloqueado |
| 10 | `normalizarEstado(valor)` | Valida la forma del dato antes de confiar en él |
| 11 | `!Array.isArray(valor.tareas)` | Si el JSON guardado no tiene la forma esperada, se descarta |
| 12 | `.filter(...)` sobre las tareas | Elimina entradas que no tengan `id` numérico y `texto` string |
| 13 | `.map(...)` reconstruye cada tarea | Normaliza `completada` a booleano y descarta propiedades extra |
| 14 | `Math.max(...)` con `maxId` | Calcula el ID más alto para que `siguienteId` nunca colisione |
| 15 | `Number(valor.siguienteId) || 1` | Si el valor guardado no es un número válido, usa 1 |
| 16 | `Math.max(..., maxId + 1)` | Garantiza que el siguiente ID sea mayor que cualquier ID existente |
| 17 | `let estado = normalizarEstado(almacen.leer())` | Carga y sanea los datos al arrancar |
| 18 | `guardarYRenderizar()` | Guarda primero y renderiza después. Si el guardado falla, el estado en memoria sigue siendo válido |
| 19 | `almacen.borrar()` | Elimina la clave. No uses `localStorage.clear()`: borraría datos de otras aplicaciones del mismo origen |
| 20 | `estado = { tareas: [], siguienteId: 1 }` | Reemplaza el objeto completo. No muta el anterior |
| 21 | `aviso.textContent = ...` | Informa al usuario si el guardado falló. Sin esto, creería que sus datos están a salvo |
| 22 | `render()` al final | Pinta el estado cargado desde `localStorage` |

**Qué ocurre al recargar:** `almacen.leer()` recupera el string, `JSON.parse` lo convierte en objeto, `normalizarEstado` lo valida y `render` lo pinta. Los cambios sobreviven porque cada mutación llama a `guardarYRenderizar`.

**Prueba de datos corruptos:** abre DevTools → Application → Local Storage, edita `tareas:v1` y escribe `{roto`. Recarga. La aplicación debe mostrar la lista vacía y un error en consola, sin romperse.

**Prueba de cuota:** en la consola, intenta guardar un string gigante. Verás `QuotaExceededError`. La interfaz muestra el aviso.

**Errores típicos:**

- Guardar el objeto directamente: `localStorage.setItem(clave, estado)` produce `"[object Object]"`.
- Confiar en el JSON sin validar la forma: un array en lugar de un objeto rompe `valor.tareas`.
- Usar `localStorage.clear()` para borrar tus tareas: elimina todo el origen.
- Guardar en cada tecla del input: escribe cientos de veces. Guarda cuando el estado cambia de verdad.

---

### Reto 6 — Tema claro/oscuro persistente

**Conceptos:** 6.3.5, 6.3.7, 6.4.2, 6.6.2, 6.6.10, 6.8.4.

Crea un selector de tema que:

- Alterne entre tema claro y oscuro.
- Guarde la preferencia en `localStorage`.
- Aplique el tema al cargar la página, antes de que se pinte el contenido.
- Actualice `aria-pressed` y el texto del botón.
- Sincronice el tema entre pestañas con el evento `storage`.

#### HTML

```html
<!doctype html>
<html lang="es" data-tema="claro">
  <head>
    <meta charset="utf-8" />
    <title>Tema persistente</title>
    <script>
      // Se ejecuta antes de pintar para evitar el parpadeo del tema incorrecto.
      try {
        const guardado = localStorage.getItem("tema");
        if (guardado === "claro" || guardado === "oscuro") {
          document.documentElement.dataset.tema = guardado;
        }
      } catch (error) {
        // Si localStorage está bloqueado, se usa el tema por defecto.
      }
    </script>
    <style>
      :root[data-tema="claro"] {
        --fondo: #f8fafc;
        --texto: #0f172a;
        --tarjeta: #ffffff;
        --borde: #cbd5e1;
        --acento: #2563eb;
      }

      :root[data-tema="oscuro"] {
        --fondo: #0f172a;
        --texto: #e2e8f0;
        --tarjeta: #1e293b;
        --borde: #334155;
        --acento: #60a5fa;
      }

      body {
        margin: 0;
        min-height: 100vh;
        font-family: system-ui, sans-serif;
        background: var(--fondo);
        color: var(--texto);
        transition: background-color 0.2s ease, color 0.2s ease;
      }

      main {
        max-width: 36rem;
        margin: 2rem auto;
        padding: 1.5rem;
        background: var(--tarjeta);
        border: 1px solid var(--borde);
        border-radius: 0.5rem;
      }

      button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--borde);
        border-radius: 0.375rem;
        background: var(--acento);
        color: white;
        cursor: pointer;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <main>
      <h1>Tema persistente</h1>
      <p>
        Este tema se guarda en <code>localStorage</code> y se sincroniza entre
        pestañas del mismo origen.
      </p>
      <button id="tema" type="button" aria-pressed="false">
        Activar tema oscuro
      </button>
    </main>
  </body>
</html>
```

#### Solución

```js
// app.js
const boton = document.querySelector("#tema");
const raiz = document.documentElement;
const CLAVE = "tema";

function temaActual() {
  return raiz.dataset.tema === "oscuro" ? "oscuro" : "claro";
}

function aplicarTema(tema, guardar) {
  raiz.dataset.tema = tema;

  const esOscuro = tema === "oscuro";
  boton.setAttribute("aria-pressed", String(esOscuro));
  boton.textContent = esOscuro
    ? "Activar tema claro"
    : "Activar tema oscuro";

  if (!guardar) return;

  try {
    localStorage.setItem(CLAVE, tema);
  } catch (error) {
    console.error("No se pudo guardar el tema", error);
  }
}

boton.addEventListener("click", () => {
  const siguiente = temaActual() === "oscuro" ? "claro" : "oscuro";
  aplicarTema(siguiente, true);
});

window.addEventListener("storage", (evento) => {
  if (evento.key !== CLAVE) return;

  const nuevo = evento.newValue === "oscuro" ? "oscuro" : "claro";
  aplicarTema(nuevo, false);
});

aplicarTema(temaActual(), false);
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `data-tema="claro"` en `<html>` | El tema por defecto está en el HTML, así que la página nunca queda sin estilos |
| 2 | Script en línea en el `<head>` | Se ejecuta antes del primer pintado. Evita que se vea el tema claro durante un instante antes de aplicar el oscuro |
| 3 | `try/catch` alrededor de `localStorage.getItem` | En algunos contextos (modo privado, políticas del navegador) `localStorage` puede lanzar al acceder |
| 4 | `document.documentElement.dataset.tema` | `documentElement` es `<html>`; `dataset.tema` escribe el atributo `data-tema` |
| 5 | `:root[data-tema="oscuro"]` en CSS | Cambia las variables CSS según el atributo. Todo lo demás se adapta solo |
| 6 | `temaActual()` | Lee el tema desde el DOM, que es la representación aplicada |
| 7 | `aplicarTema(tema, guardar)` | Centraliza el cambio visual, el estado del botón y el guardado |
| 8 | `raiz.dataset.tema = tema` | Aplica el tema. Un solo atributo cambia todas las variables |
| 9 | `aria-pressed` | Indica si el botón está “activado”. Aquí significa “tema oscuro activo” |
| 10 | `textContent = esOscuro ? ... : ...` | El texto describe la acción siguiente, no el estado actual |
| 11 | `if (!guardar) return` | Al sincronizar desde otra pestaña no vuelvas a escribir en `localStorage`: causaría un bucle |
| 12 | `localStorage.setItem(CLAVE, tema)` | Guarda la preferencia. `tema` ya es un string |
| 13 | `catch` en el guardado | Si el almacenamiento está lleno o bloqueado, el tema visual sigue funcionando |
| 14 | `siguiente = temaActual() === "oscuro" ? "claro" : "oscuro"` | Alterna explícitamente entre los dos valores permitidos |
| 15 | `window.addEventListener("storage", ...)` | El evento llega a las **otras** pestañas del mismo origen |
| 16 | `if (evento.key !== CLAVE) return` | Ignora cambios de otras claves |
| 17 | `evento.newValue === "oscuro" ? ... : ...` | Normaliza el valor recibido. Si es `null` (clave borrada), vuelve a claro |
| 18 | `aplicarTema(nuevo, false)` | Aplica el tema sin volver a guardar |
| 19 | `aplicarTema(temaActual(), false)` al final | Sincroniza el texto y `aria-pressed` del botón con el tema que ya aplicó el script del `<head>` |

**Por qué el script del `<head>` va antes del CSS:** el navegador puede pintar en cuanto tiene HTML y CSS. Si esperas a `app.js` (que tiene `defer`), el usuario podría ver un destello del tema claro. El script en línea se ejecuta antes de continuar el parseo.

**Prueba entre pestañas:** abre la página en dos pestañas. Cambia el tema en una. La otra debe cambiar sin recargar. El evento `storage` no se dispara en la pestaña que hizo el cambio.

**Errores típicos:**

- Guardar el tema pero no aplicarlo al cargar: el usuario tendría que volver a pulsar el botón en cada visita.
- Usar `localStorage` sin `try/catch` en el script de arranque: si falla, se rompe el resto del script.
- Escuchar `storage` y volver a guardar: bucle infinito entre pestañas.
- Cambiar solo el fondo y no el texto: contraste insuficiente e ilegible.
- Usar `innerHTML` para el texto del botón: innecesario y arriesgado. `textContent` es suficiente.

---

### Reto 7 — Buscador con `debounce`

**Conceptos:** 6.4.7, 6.4.14, 6.7.8, 6.8.4.

Crea un buscador que filtre una lista de cursos mientras el usuario escribe. Requisitos:

- Escucha el evento `input`.
- Espera 300 ms desde la última tecla antes de filtrar (`debounce`).
- Busca por título y por tema, sin distinguir mayúsculas.
- Muestra cuántos resultados hay.
- Muestra un mensaje cuando no hay coincidencias.
- Reconstruye la lista con `DocumentFragment`.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Buscador de cursos</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 40rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      input {
        width: 100%;
        padding: 0.6rem;
        box-sizing: border-box;
        font-size: 1rem;
      }

      ul {
        padding-left: 1.25rem;
      }

      li {
        margin: 0.5rem 0;
      }

      .tema {
        display: inline-block;
        margin-left: 0.5rem;
        padding: 0.1rem 0.4rem;
        background: #e2e8f0;
        border-radius: 0.25rem;
        font-size: 0.8rem;
      }

      #vacio {
        color: #64748b;
        font-style: italic;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Cursos</h1>

    <label for="busqueda">Buscar por título o tema</label>
    <input id="busqueda" type="search" placeholder="Ej.: funciones" autocomplete="off" />

    <p id="contador"></p>
    <p id="vacio" hidden>No hay resultados para esa búsqueda.</p>
    <ul id="resultados"></ul>
  </body>
</html>
```

#### Solución

```js
// app.js
const input = document.querySelector("#busqueda");
const lista = document.querySelector("#resultados");
const contador = document.querySelector("#contador");
const vacio = document.querySelector("#vacio");

const cursos = [
  {
    id: 1,
    titulo: "JavaScript desde cero",
    temas: ["variables", "tipos", "operadores"],
  },
  {
    id: 2,
    titulo: "Funciones y closures",
    temas: ["funciones", "scope", "callbacks"],
  },
  {
    id: 3,
    titulo: "Arrays y objetos",
    temas: ["map", "filter", "reduce"],
  },
  {
    id: 4,
    titulo: "Asincronía en JavaScript",
    temas: ["promesas", "async/await", "event loop"],
  },
  {
    id: 5,
    titulo: "El navegador y el DOM",
    temas: ["eventos", "formularios", "localStorage"],
  },
];

function debounce(funcion, espera) {
  let temporizador;

  return function (...args) {
    clearTimeout(temporizador);

    temporizador = setTimeout(() => {
      funcion.apply(this, args);
    }, espera);
  };
}

function filtrar(consulta) {
  const texto = consulta.trim().toLowerCase();

  if (texto === "") return cursos;

  return cursos.filter((curso) => {
    const coincideTitulo = curso.titulo.toLowerCase().includes(texto);
    const coincideTema = curso.temas.some((tema) =>
      tema.toLowerCase().includes(texto)
    );

    return coincideTitulo || coincideTema;
  });
}

function render(resultados) {
  lista.textContent = "";
  const fragmento = document.createDocumentFragment();

  for (const curso of resultados) {
    const li = document.createElement("li");

    const titulo = document.createElement("strong");
    titulo.textContent = curso.titulo;

    li.append(titulo);

    for (const tema of curso.temas) {
      const etiqueta = document.createElement("span");
      etiqueta.className = "tema";
      etiqueta.textContent = tema;
      li.append(etiqueta);
    }

    fragmento.append(li);
  }

  lista.append(fragmento);

  contador.textContent = `${resultados.length} resultado${
    resultados.length === 1 ? "" : "s"
  }`;

  vacio.hidden = resultados.length > 0;
}

const buscar = debounce((valor) => {
  render(filtrar(valor));
}, 300);

input.addEventListener("input", (evento) => {
  buscar(evento.target.value);
});

render(cursos);
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `debounce(funcion, espera)` | Devuelve una función que pospone la ejecución hasta que pasen `espera` ms sin llamadas |
| 2 | `let temporizador` dentro de `debounce` | El closure conserva el ID del timer entre llamadas |
| 3 | `clearTimeout(temporizador)` | Cancela la ejecución pendiente de la tecla anterior |
| 4 | `setTimeout(..., espera)` | Programa la nueva ejecución. Solo la última tecla sobrevive |
| 5 | `funcion.apply(this, args)` | Conserva el `this` y los argumentos originales. En este caso `this` es `undefined`, pero el patrón es reutilizable |
| 6 | `consulta.trim().toLowerCase()` | Normaliza espacios y mayúsculas |
| 7 | `if (texto === "") return cursos` | Sin búsqueda, muestra todos los cursos |
| 8 | `curso.titulo.toLowerCase().includes(texto)` | Búsqueda parcial, sin distinguir mayúsculas |
| 9 | `curso.temas.some(...)` | `some` devuelve `true` si al menos un tema coincide |
| 10 | `return coincideTitulo || coincideTema` | Basta con que coincida el título o algún tema |
| 11 | `render(resultados)` | Separa el filtrado del dibujado. `filtrar` no toca el DOM |
| 12 | `lista.textContent = ""` | Vacía la lista anterior |
| 13 | `document.createDocumentFragment()` | Agrupa todos los `<li>` para una sola inserción |
| 14 | `document.createElement("strong")` | Crea el título en negrita |
| 15 | `etiqueta.className = "tema"` | Asigna una clase. Para una sola clase, `className` es directo; `classList.add` también sería válido |
| 16 | `fragmento.append(li)` | Acumula el resultado |
| 17 | `lista.append(fragmento)` | Inserta todo de una vez |
| 18 | `resultados.length === 1 ? "" : "s"` | Pluraliza correctamente |
| 19 | `vacio.hidden = resultados.length > 0` | El mensaje de “sin resultados” solo se muestra cuando la lista está vacía |
| 20 | `const buscar = debounce(...)` | Crea **una sola** función con su temporizador. Si la crearas dentro del listener, cada tecla tendría su propio timer y el debounce no funcionaría |
| 21 | `input.addEventListener("input", ...)` | `input` se dispara en cada cambio, incluido pegar texto o borrar |
| 22 | `buscar(evento.target.value)` | Pasa el valor actual a la función con debounce |
| 23 | `render(cursos)` al final | Pinta la lista completa al cargar |

**Por qué `input` y no `change`:** `change` solo se dispara al confirmar (por ejemplo, al salir del campo). `input` se dispara en cada tecla, que es lo que necesita un buscador en vivo.

**Por qué 300 ms:** es un equilibrio. Menos tiempo se siente reactivo pero ejecuta más trabajo; más tiempo se siente lento. Ajusta según el costo de la búsqueda. Si la búsqueda hiciera una petición de red, 300–500 ms es habitual.

**Errores típicos:**

- Crear el debounce dentro del listener: pierdes el temporizador compartido.
- Filtrar en cada tecla sin debounce: con listas grandes o peticiones de red, se nota.
- Usar `change` en lugar de `input`: el filtrado no se actualiza mientras escribes.
- Modificar el array original con `splice` al filtrar: destruirías los datos.

---

### Reto 8 — Galería con cancelación

**Conceptos:** 6.3.9, 6.4.10, 6.4.14, 6.8.6, 5.8, 5.9.

Crea una galería con varias categorías. Al pulsar una categoría:

- Se muestra un estado de “Cargando…”.
- Se simula una carga de 600 ms con una promesa.
- Si el usuario pulsa otra categoría antes de que termine, se **cancela** la carga anterior con `AbortController`.
- Solo se renderiza la última categoría solicitada.
- Al salir de la página, se cancela cualquier carga pendiente.

> 📌 La carga es simulada con `setTimeout` y una promesa. En el Módulo 7 harás lo mismo con `fetch`, usando la misma señal.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Galería</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 44rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      .categorias {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
        margin-bottom: 1rem;
      }

      button {
        padding: 0.5rem 0.9rem;
        cursor: pointer;
      }

      #galeria {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(8rem, 1fr));
        gap: 0.75rem;
      }

      .tarjeta {
        display: flex;
        align-items: flex-end;
        min-height: 7rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 600;
        box-sizing: border-box;
      }

      #estado {
        min-height: 1.5rem;
        color: #475569;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Galería</h1>

    <div class="categorias">
      <button type="button" data-categoria="naturaleza">Naturaleza</button>
      <button type="button" data-categoria="ciudad">Ciudad</button>
      <button type="button" data-categoria="abstracto">Abstracto</button>
    </div>

    <p id="estado" role="status"></p>
    <div id="galeria"></div>
  </body>
</html>
```

#### Solución

```js
// app.js
const botones = document.querySelectorAll("[data-categoria]");
const galeria = document.querySelector("#galeria");
const estado = document.querySelector("#estado");

const DATOS = {
  naturaleza: [
    { titulo: "Bosque", color: "#166534" },
    { titulo: "Montaña", color: "#3f6212" },
    { titulo: "Río", color: "#0e7490" },
  ],
  ciudad: [
    { titulo: "Avenida", color: "#334155" },
    { titulo: "Puente", color: "#475569" },
    { titulo: "Plaza", color: "#52525b" },
  ],
  abstracto: [
    { titulo: "Ondas", color: "#7c3aed" },
    { titulo: "Círculos", color: "#be185d" },
    { titulo: "Líneas", color: "#c2410c" },
  ],
};

let controller = null;

function esperar(ms, signal) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Cancelado", "AbortError"));
      return;
    }

    const id = setTimeout(() => {
      signal.removeEventListener("abort", alCancelar);
      resolve();
    }, ms);

    function alCancelar() {
      clearTimeout(id);
      reject(new DOMException("Cancelado", "AbortError"));
    }

    signal.addEventListener("abort", alCancelar, { once: true });
  });
}

function render(items) {
  galeria.textContent = "";
  const fragmento = document.createDocumentFragment();

  for (const item of items) {
    const tarjeta = document.createElement("div");
    tarjeta.className = "tarjeta";
    tarjeta.style.background = item.color;
    tarjeta.textContent = item.titulo;
    fragmento.append(tarjeta);
  }

  galeria.append(fragmento);
}

async function cargar(categoria) {
  if (controller) controller.abort();

  controller = new AbortController();
  const { signal } = controller;

  galeria.textContent = "";
  estado.textContent = "Cargando…";

  try {
    await esperar(600, signal);

    const items = DATOS[categoria] ?? [];
    render(items);
    estado.textContent = `${items.length} imágenes de ${categoria}`;
  } catch (error) {
    if (error.name === "AbortError") {
      console.log(`Carga cancelada: ${categoria}`);
      return;
    }

    estado.textContent = "No se pudo cargar la galería";
    console.error(error);
  }
}

botones.forEach((boton) => {
  boton.addEventListener("click", () => {
    cargar(boton.dataset.categoria);
  });
});

window.addEventListener("pagehide", () => {
  if (controller) controller.abort();
});

cargar("naturaleza");
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `let controller = null` | Guarda el controlador de la carga actual para poder cancelarla |
| 2 | `esperar(ms, signal)` | Envuelve `setTimeout` en una promesa cancelable |
| 3 | `if (signal.aborted)` | Si la señal ya estaba cancelada, rechaza de inmediato. Evita registrar un timer inútil |
| 4 | `new DOMException("Cancelado", "AbortError")` | Crea un error con `name === "AbortError"`, el mismo que usan las APIs del navegador al cancelar |
| 5 | `setTimeout(...)` | Simula la carga |
| 6 | `signal.removeEventListener("abort", alCancelar)` | Si el timer termina normalmente, quita el listener de cancelación para no dejar referencias |
| 7 | `alCancelar` | Limpia el timer y rechaza la promesa |
| 8 | `{ once: true }` | El listener de cancelación se ejecuta una sola vez |
| 9 | `if (controller) controller.abort()` | Cancela la carga anterior antes de empezar la nueva |
| 10 | `controller = new AbortController()` | Crea una señal nueva. Una señal cancelada no se puede reutilizar |
| 11 | `const { signal } = controller` | Extrae la señal para pasarla a `esperar` |
| 12 | `galeria.textContent = ""` | Limpia la galería anterior mientras carga |
| 13 | `estado.textContent = "Cargando…"` | Informa al usuario. `role="status"` lo anuncia |
| 14 | `await esperar(600, signal)` | Espera la carga o lanza `AbortError` si se cancela |
| 15 | `DATOS[categoria] ?? []` | Si la categoría no existe, usa un array vacío en lugar de `undefined` |
| 16 | `render(items)` | Dibuja las tarjetas |
| 17 | `catch (error)` | Captura tanto la cancelación como errores inesperados |
| 18 | `error.name === "AbortError"` | Distingue cancelación de error real. Una cancelación no es un fallo |
| 19 | `return` dentro del `catch` | Sale sin mostrar mensaje de error |
| 20 | `controller.abort()` en `pagehide` | Libera timers y listeners cuando la página se oculta o se descarga |
| 21 | `cargar("naturaleza")` | Carga inicial |

**Qué ocurre al pulsar rápido tres categorías:**

1. Se crea el controlador A y se espera 600 ms.
2. Al pulsar otra, `controller.abort()` cancela A. Su promesa rechaza con `AbortError` y el `catch` sale sin renderizar.
3. Se crea el controlador B y se espera de nuevo.
4. Solo la última carga llega a `render`.

Sin cancelación, las tres cargas terminarían y la última en completarse ganaría, aunque no fuera la última solicitada. Ese es el clásico **race condition** de interfaz.

**Errores típicos:**

- Reutilizar una señal cancelada: no vuelve a funcionar. Crea un `AbortController` por operación.
- Tratar `AbortError` como un error visible: no es un fallo, es una cancelación intencional.
- No limpiar el listener de `abort` cuando la operación termina: dejas referencias innecesarias.
- Renderizar sin comprobar si la respuesta sigue siendo la vigente.

---

### Reto 9 — Animación con `requestAnimationFrame`

**Conceptos:** 6.7.1, 6.7.2, 6.7.3, 6.7.4, 6.7.9.

Crea una animación que mueva una caja 240 px a la derecha en 1,2 segundos. Requisitos:

- Usa `requestAnimationFrame`, no `setInterval`.
- Calcula el progreso con el `timestamp`, no contando frames.
- Usa una función de easing para que el movimiento sea suave.
- Permite iniciar, pausar y reiniciar.
- Anima solo `transform`.
- Se detiene correctamente al ocultar la pestaña y no salta al volver.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Animación</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 36rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      #pista {
        position: relative;
        height: 80px;
        margin: 1rem 0;
        background: #f1f5f9;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
        overflow: hidden;
      }

      #caja {
        position: absolute;
        top: 15px;
        left: 10px;
        width: 50px;
        height: 50px;
        background: #2563eb;
        border-radius: 0.5rem;
        will-change: transform;
      }

      .acciones {
        display: flex;
        gap: 0.5rem;
      }

      button {
        padding: 0.5rem 1rem;
        cursor: pointer;
      }

      #estado {
        min-height: 1.5rem;
        color: #475569;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Animación con rAF</h1>

    <div id="pista">
      <div id="caja"></div>
    </div>

    <div class="acciones">
      <button id="iniciar" type="button">Iniciar</button>
      <button id="pausar" type="button">Pausar</button>
      <button id="reiniciar" type="button">Reiniciar</button>
    </div>

    <p id="estado" role="status"></p>
  </body>
</html>
```

#### Solución

```js
// app.js
const caja = document.querySelector("#caja");
const botonIniciar = document.querySelector("#iniciar");
const botonPausar = document.querySelector("#pausar");
const botonReiniciar = document.querySelector("#reiniciar");
const estado = document.querySelector("#estado");

const DISTANCIA = 240;
const DURACION = 1200;

let idAnimacion = null;
let anterior = null;
let progreso = 0;
let animando = false;

function suavizar(t) {
  return 1 - Math.pow(1 - t, 3);
}

function pintar(valor) {
  const suave = suavizar(valor);
  caja.style.transform = `translateX(${suave * DISTANCIA}px)`;
  estado.textContent = `${Math.round(valor * 100)} %`;
}

function frame(timestamp) {
  if (anterior === null) anterior = timestamp;

  const delta = timestamp - anterior;
  anterior = timestamp;

  progreso = Math.min(progreso + delta / DURACION, 1);
  pintar(progreso);

  if (progreso < 1 && animando) {
    idAnimacion = requestAnimationFrame(frame);
  } else {
    animando = false;
    idAnimacion = null;
    estado.textContent = "Animación terminada";
  }
}

function iniciar() {
  if (animando) return;

  if (progreso >= 1) {
    progreso = 0;
    anterior = null;
  }

  animando = true;
  anterior = null;
  idAnimacion = requestAnimationFrame(frame);
}

function pausar() {
  if (!animando) return;

  animando = false;

  if (idAnimacion !== null) {
    cancelAnimationFrame(idAnimacion);
    idAnimacion = null;
  }

  estado.textContent = `Pausada en ${Math.round(progreso * 100)} %`;
}

function reiniciar() {
  if (idAnimacion !== null) {
    cancelAnimationFrame(idAnimacion);
    idAnimacion = null;
  }

  animando = false;
  progreso = 0;
  anterior = null;
  pintar(0);
  estado.textContent = "Lista para iniciar";
}

botonIniciar.addEventListener("click", iniciar);
botonPausar.addEventListener("click", pausar);
botonReiniciar.addEventListener("click", reiniciar);

document.addEventListener("visibilitychange", () => {
  anterior = null;

  if (!document.hidden && animando && idAnimacion === null) {
    idAnimacion = requestAnimationFrame(frame);
  }
});

pintar(0);
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `DISTANCIA` y `DURACION` como constantes | Separar configuración de lógica facilita ajustar la animación |
| 2 | `idAnimacion` | Guarda el ID que devuelve `requestAnimationFrame` para poder cancelar |
| 3 | `anterior` | Guarda el timestamp del frame previo para calcular el delta |
| 4 | `progreso` | Valor entre 0 y 1. No cuenta frames, mide tiempo |
| 5 | `suavizar(t)` | Easing cúbico: empieza rápido y desacelera. `1 - (1 - t)^3` |
| 6 | `pintar(valor)` | Aplica `transform: translateX(...)` y actualiza el porcentaje |
| 7 | `caja.style.transform` | Animar `transform` no provoca layout; es barato para el navegador |
| 8 | `if (anterior === null) anterior = timestamp` | En el primer frame no hay delta; se usa el timestamp actual |
| 9 | `delta = timestamp - anterior` | Tiempo real transcurrido desde el frame anterior |
| 10 | `progreso + delta / DURACION` | Convierte milisegundos en fracción de la duración total |
| 11 | `Math.min(..., 1)` | Evita pasarse de 1 si un frame llega tarde |
| 12 | `pintar(progreso)` | Dibuja el estado actual |
| 13 | `if (progreso < 1 && animando)` | Solo pide otro frame si no terminó y sigue activa |
| 14 | `requestAnimationFrame(frame)` | Programa el siguiente frame antes del repintado |
| 15 | `animando = false` y `idAnimacion = null` | Marca el final y limpia la referencia |
| 16 | `if (animando) return` en `iniciar` | Evita arrancar dos bucles de animación a la vez |
| 17 | `if (progreso >= 1)` | Si terminó, reinicia desde cero al volver a pulsar Iniciar |
| 18 | `anterior = null` | El primer frame después de reanudar no debe contar el tiempo pausado |
| 19 | `cancelAnimationFrame(idAnimacion)` | Cancela el frame pendiente al pausar |
| 20 | `pausar` conserva `progreso` | Al reanudar, continúa desde donde estaba |
| 21 | `reiniciar` pone `progreso = 0` | Vuelve al estado inicial y repinta |
| 22 | `visibilitychange` con `anterior = null` | Al volver de una pestaña oculta, el timestamp puede haber avanzado mucho. Reiniciar `anterior` evita un salto |
| 23 | `if (!document.hidden && animando && idAnimacion === null)` | Si el navegador canceló el frame al ocultar, lo vuelve a pedir al mostrarse |
| 24 | `pintar(0)` al final | Deja la caja en su posición inicial y el estado en “0 %” |

**Por qué no usar `setInterval`:** `setInterval` no está sincronizado con el repintado. Puede ejecutarse dos veces entre frames o ninguna, y produce saltos. `requestAnimationFrame` se ejecuta justo antes de pintar y se pausa cuando la pestaña no es visible.

**Por qué calcular con tiempo y no con frames:** no todos los dispositivos van a 60 Hz. Si sumas “2 px por frame”, en una pantalla de 120 Hz la animación dura la mitad. Con tiempo, la duración es la misma en cualquier dispositivo.

**Errores típicos:**

- Animar `left` o `width`: provoca layout en cada frame.
- Sumar una cantidad fija por frame: la velocidad depende del dispositivo.
- No cancelar el frame al pausar: siguen ejecutándose callbacks.
- No reiniciar `anterior` tras una pausa larga: la animación salta al final.
- Usar `will-change` de forma permanente en muchos elementos: consume memoria.

---

### Reto 10 — Pestañas accesibles

**Conceptos:** 6.3.5, 6.3.7, 6.4.6, 6.4.7, 6.8.4, 6.8.10.

Crea un componente de pestañas con tres paneles. Requisitos:

- Usa roles ARIA: `tablist`, `tab`, `tabpanel`.
- Solo la pestaña activa tiene `aria-selected="true"` y `tabindex="0"`; las demás, `tabindex="-1"`.
- El panel activo se muestra; los demás tienen `hidden`.
- Clic para activar.
- Teclado: flechas izquierda/derecha, `Home` y `End`.
- Al cambiar con teclado, el foco se mueve a la nueva pestaña.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Pestañas</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 40rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      [role="tablist"] {
        display: flex;
        gap: 0.25rem;
        border-bottom: 2px solid #cbd5e1;
      }

      [role="tab"] {
        padding: 0.6rem 1rem;
        border: none;
        border-bottom: 3px solid transparent;
        background: transparent;
        font: inherit;
        cursor: pointer;
      }

      [role="tab"][aria-selected="true"] {
        border-bottom-color: #2563eb;
        color: #1d4ed8;
        font-weight: 700;
      }

      [role="tab"]:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: -2px;
      }

      [role="tabpanel"] {
        padding: 1rem 0;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Pestañas accesibles</h1>

    <div role="tablist" aria-label="Secciones del curso">
      <button
        id="tab-html"
        role="tab"
        type="button"
        aria-selected="true"
        aria-controls="panel-html"
        tabindex="0"
      >
        HTML
      </button>
      <button
        id="tab-css"
        role="tab"
        type="button"
        aria-selected="false"
        aria-controls="panel-css"
        tabindex="-1"
      >
        CSS
      </button>
      <button
        id="tab-js"
        role="tab"
        type="button"
        aria-selected="false"
        aria-controls="panel-js"
        tabindex="-1"
      >
        JavaScript
      </button>
    </div>

    <section id="panel-html" role="tabpanel" aria-labelledby="tab-html">
      <h2>HTML</h2>
      <p>Estructura y significado del contenido.</p>
    </section>

    <section id="panel-css" role="tabpanel" aria-labelledby="tab-css" hidden>
      <h2>CSS</h2>
      <p>Presentación, layout y adaptación a pantallas.</p>
    </section>

    <section id="panel-js" role="tabpanel" aria-labelledby="tab-js" hidden>
      <h2>JavaScript</h2>
      <p>Comportamiento, interactividad y lógica.</p>
    </section>
  </body>
</html>
```

#### Solución

```js
// app.js
const tablist = document.querySelector('[role="tablist"]');
const tabs = [...tablist.querySelectorAll('[role="tab"]')];

function activar(tab, moverFoco) {
  for (const candidata of tabs) {
    const seleccionada = candidata === tab;
    const panel = document.querySelector(
      `#${candidata.getAttribute("aria-controls")}`
    );

    candidata.setAttribute("aria-selected", String(seleccionada));
    candidata.tabIndex = seleccionada ? 0 : -1;

    if (panel) panel.hidden = !seleccionada;
  }

  if (moverFoco) tab.focus();
}

tablist.addEventListener("click", (evento) => {
  const tab = evento.target.closest('[role="tab"]');
  if (!tab || !tablist.contains(tab)) return;

  activar(tab, false);
});

tablist.addEventListener("keydown", (evento) => {
  const actual = evento.target.closest('[role="tab"]');
  if (!actual) return;

  const indice = tabs.indexOf(actual);
  let siguiente = null;

  if (evento.key === "ArrowRight") {
    siguiente = tabs[(indice + 1) % tabs.length];
  }

  if (evento.key === "ArrowLeft") {
    siguiente = tabs[(indice - 1 + tabs.length) % tabs.length];
  }

  if (evento.key === "Home") {
    siguiente = tabs[0];
  }

  if (evento.key === "End") {
    siguiente = tabs[tabs.length - 1];
  }

  if (!siguiente) return;

  evento.preventDefault();
  activar(siguiente, true);
});

activar(tabs[0], false);
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `[...tablist.querySelectorAll(...)]` | Convierte el `NodeList` en array para usar `indexOf` |
| 2 | `activar(tab, moverFoco)` | Centraliza el cambio de pestaña y panel |
| 3 | `candidata === tab` | Solo una pestaña está activa |
| 4 | `document.querySelector("#" + aria-controls)` | Encuentra el panel asociado por ID |
| 5 | `aria-selected` | Comunica a lectores de pantalla cuál está seleccionada |
| 6 | `tabIndex = seleccionada ? 0 : -1` | Solo la activa entra en el orden de tabulación. Las demás se alcanzan con flechas |
| 7 | `panel.hidden = !seleccionada` | Muestra el panel activo y oculta los demás |
| 8 | `if (moverFoco) tab.focus()` | Al navegar con teclado, el foco sigue a la pestaña activa. Con clic no hace falta moverlo |
| 9 | `evento.target.closest('[role="tab"]')` | Delegación: el clic puede caer en el texto del botón |
| 10 | `!tablist.contains(tab)` | Se asegura de que la pestaña pertenece a esta lista |
| 11 | `tabs.indexOf(actual)` | Posición de la pestaña actual |
| 12 | `(indice + 1) % tabs.length` | Avanza y vuelve al inicio al llegar al final |
| 13 | `(indice - 1 + tabs.length) % tabs.length` | Retrocede y vuelve al final. El `+ tabs.length` evita índices negativos |
| 14 | `Home` / `End` | Atajos estándar para la primera y la última pestaña |
| 15 | `evento.preventDefault()` | Evita que las flechas desplacen la página |
| 16 | `activar(siguiente, true)` | Activa y mueve el foco en una sola llamada |
| 17 | `activar(tabs[0], false)` | Estado inicial coherente con el HTML |

**Por qué `tabindex="-1"`:** las pestañas inactivas no deben recibir foco con `Tab`, porque el usuario tendría que pasar por todas antes de salir del componente. El patrón ARIA indica que se navega con flechas dentro del `tablist`.

**Por qué usar `hidden` y no `display: none` desde JS:** `hidden` es el atributo estándar para ocultar contenido y los lectores de pantalla lo respetan. El CSS puede sobrescribirlo, así que evita reglas que fuercen `display` en `[hidden]`.

**Errores típicos:**

- Poner `aria-selected="true"` en varias pestañas.
- No actualizar `tabindex`: el teclado se vuelve impredecible.
- Mover el foco con clic: el foco debe quedarse donde el usuario hizo clic, salvo que sea teclado.
- Usar solo clases CSS para el estado y olvidar ARIA.
- No asociar panel y pestaña con `aria-controls` / `aria-labelledby`.

---

### Reto 11 — Capstone: carrito de compra

**Conceptos:** todos los del módulo, especialmente 6.3, 6.4.6, 6.4.10, 6.6.2, 6.6.4, 6.6.9, 6.7.8, 6.8.4, 6.8.10.

Construye un carrito de compra con:

- Catálogo de productos con precio y stock.
- Añadir al carrito.
- Cambiar cantidad con `+` y `−`.
- Eliminar líneas.
- Total calculado a partir del estado.
- Límite por stock.
- Persistencia del carrito en `localStorage`.
- Datos corruptos tolerados.
- Botón **Vaciar carrito** y **Finalizar compra**.
- Anuncios accesibles con `role="status"`.
- Delegación de eventos en catálogo y carrito.

#### HTML

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Carrito de compra</title>
    <style>
      body {
        font-family: system-ui, sans-serif;
        max-width: 60rem;
        margin: 2rem auto;
        padding: 0 1rem;
      }

      .layout {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
      }

      @media (max-width: 700px) {
        .layout {
          grid-template-columns: 1fr;
        }
      }

      .productos,
      .carrito {
        display: grid;
        gap: 0.75rem;
      }

      .producto,
      .linea {
        padding: 0.75rem;
        border: 1px solid #cbd5e1;
        border-radius: 0.5rem;
      }

      .producto h3,
      .linea h3 {
        margin: 0 0 0.25rem;
        font-size: 1rem;
      }

      .fila {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 0.5rem;
        margin-top: 0.5rem;
      }

      button {
        padding: 0.35rem 0.7rem;
        cursor: pointer;
      }

      button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      #total {
        font-size: 1.25rem;
        font-weight: 700;
      }

      #aviso {
        min-height: 1.5rem;
        color: #1d4ed8;
      }

      #vacio {
        color: #64748b;
        font-style: italic;
      }
    </style>
    <script src="app.js" defer></script>
  </head>
  <body>
    <h1>Tienda</h1>

    <p id="aviso" role="status"></p>

    <div class="layout">
      <section>
        <h2>Productos</h2>
        <div id="catalogo" class="productos"></div>
      </section>

      <section>
        <h2>Carrito</h2>
        <p id="vacio">El carrito está vacío.</p>
        <div id="carrito" class="carrito"></div>

        <p>Total: <span id="total">0.00</span> €</p>

        <div class="fila">
          <button id="vaciar" type="button">Vaciar carrito</button>
          <button id="finalizar" type="button">Finalizar compra</button>
        </div>
      </section>
    </div>
  </body>
</html>
```

#### Solución

```js
// app.js
const catalogo = document.querySelector("#catalogo");
const carrito = document.querySelector("#carrito");
const total = document.querySelector("#total");
const vacio = document.querySelector("#vacio");
const aviso = document.querySelector("#aviso");
const botonVaciar = document.querySelector("#vaciar");
const botonFinalizar = document.querySelector("#finalizar");

const PRODUCTOS = [
  { id: 1, nombre: "Camisa", precio: 20, stock: 5 },
  { id: 2, nombre: "Pantalón", precio: 35, stock: 3 },
  { id: 3, nombre: "Gorra", precio: 12.5, stock: 8 },
  { id: 4, nombre: "Calcetines", precio: 6, stock: 10 },
];

const CLAVE = "carrito:v1";

function crearAlmacen(clave, valorPorDefecto) {
  return {
    leer() {
      const texto = localStorage.getItem(clave);
      if (texto === null) return valorPorDefecto;

      try {
        return JSON.parse(texto);
      } catch (error) {
        console.error(`Datos corruptos en "${clave}"`, error);
        return valorPorDefecto;
      }
    },

    guardar(valor) {
      try {
        localStorage.setItem(clave, JSON.stringify(valor));
        return true;
      } catch (error) {
        console.error(`No se pudo guardar "${clave}"`, error);
        return false;
      }
    },

    borrar() {
      localStorage.removeItem(clave);
    },
  };
}

const almacen = crearAlmacen(CLAVE, []);

function normalizarCarrito(valor) {
  if (!Array.isArray(valor)) return [];

  return valor
    .filter((linea) => {
      return (
        linea &&
        typeof linea.id === "number" &&
        Number.isInteger(linea.cantidad) &&
        linea.cantidad > 0
      );
    })
    .map((linea) => {
      const producto = PRODUCTOS.find((p) => p.id === linea.id);
      const cantidad = Math.min(linea.cantidad, producto ? producto.stock : 0);

      return producto && cantidad > 0
        ? { id: producto.id, cantidad }
        : null;
    })
    .filter((linea) => linea !== null);
}

const estado = {
  carrito: normalizarCarrito(almacen.leer()),
};

function productoPorId(id) {
  return PRODUCTOS.find((p) => p.id === id) ?? null;
}

function cantidadEnCarrito(id) {
  const linea = estado.carrito.find((l) => l.id === id);
  return linea ? linea.cantidad : 0;
}

function agregar(id) {
  const producto = productoPorId(id);
  if (!producto) return;

  const cantidad = cantidadEnCarrito(id);

  if (cantidad >= producto.stock) {
    anunciar(`No hay más stock de ${producto.nombre}`);
    return;
  }

  const linea = estado.carrito.find((l) => l.id === id);

  if (linea) {
    linea.cantidad += 1;
  } else {
    estado.carrito.push({ id, cantidad: 1 });
  }

  anunciar(`${producto.nombre} se añadió al carrito`);
  guardarYRenderizar();
}

function cambiarCantidad(id, delta) {
  const producto = productoPorId(id);
  const linea = estado.carrito.find((l) => l.id === id);

  if (!producto || !linea) return;

  const nueva = linea.cantidad + delta;

  if (nueva > producto.stock) {
    anunciar(`Solo quedan ${producto.stock} unidades de ${producto.nombre}`);
    return;
  }

  if (nueva <= 0) {
    eliminar(id);
    return;
  }

  linea.cantidad = nueva;
  guardarYRenderizar();
}

function eliminar(id) {
  estado.carrito = estado.carrito.filter((l) => l.id !== id);
  guardarYRenderizar();
}

function totalCarrito() {
  return estado.carrito.reduce((suma, linea) => {
    const producto = productoPorId(linea.id);
    return producto ? suma + producto.precio * linea.cantidad : suma;
  }, 0);
}

function anunciar(mensaje) {
  aviso.textContent = mensaje;
}

function guardarYRenderizar() {
  const guardado = almacen.guardar(estado.carrito);

  if (!guardado) {
    anunciar("No se pudo guardar el carrito. El almacenamiento está lleno o bloqueado.");
  }

  render();
}

function renderCatalogo() {
  catalogo.textContent = "";
  const fragmento = document.createDocumentFragment();

  for (const producto of PRODUCTOS) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "producto";

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    const precio = document.createElement("p");
    precio.textContent = `${producto.precio.toFixed(2)} € · stock: ${producto.stock}`;

    const boton = document.createElement("button");
    boton.type = "button";
    boton.dataset.accion = "agregar";
    boton.dataset.id = String(producto.id);
    boton.textContent = "Añadir";
    boton.disabled = cantidadEnCarrito(producto.id) >= producto.stock;

    tarjeta.append(nombre, precio, boton);
    fragmento.append(tarjeta);
  }

  catalogo.append(fragmento);
}

function renderCarrito() {
  carrito.textContent = "";
  const fragmento = document.createDocumentFragment();

  for (const linea of estado.carrito) {
    const producto = productoPorId(linea.id);
    if (!producto) continue;

    const fila = document.createElement("article");
    fila.className = "linea";

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    const detalle = document.createElement("p");
    detalle.textContent = `${linea.cantidad} × ${producto.precio.toFixed(2)} € = ${(
      producto.precio * linea.cantidad
    ).toFixed(2)} €`;

    const acciones = document.createElement("div");
    acciones.className = "fila";

    const restar = document.createElement("button");
    restar.type = "button";
    restar.dataset.accion = "restar";
    restar.dataset.id = String(producto.id);
    restar.textContent = "−1";
    restar.setAttribute("aria-label", `Quitar una unidad de ${producto.nombre}`);

    const sumar = document.createElement("button");
    sumar.type = "button";
    sumar.dataset.accion = "sumar";
    sumar.dataset.id = String(producto.id);
    sumar.textContent = "+1";
    sumar.setAttribute("aria-label", `Añadir una unidad de ${producto.nombre}`);
    sumar.disabled = linea.cantidad >= producto.stock;

    const quitar = document.createElement("button");
    quitar.type = "button";
    quitar.dataset.accion = "eliminar";
    quitar.dataset.id = String(producto.id);
    quitar.textContent = "Eliminar";
    quitar.setAttribute("aria-label", `Eliminar ${producto.nombre} del carrito`);

    acciones.append(restar, sumar, quitar);
    fila.append(nombre, detalle, acciones);
    fragmento.append(fila);
  }

  carrito.append(fragmento);

  total.textContent = totalCarrito().toFixed(2);
  vacio.hidden = estado.carrito.length > 0;
  botonVaciar.disabled = estado.carrito.length === 0;
  botonFinalizar.disabled = estado.carrito.length === 0;
}

function render() {
  renderCatalogo();
  renderCarrito();
}

catalogo.addEventListener("click", (evento) => {
  const boton = evento.target.closest('button[data-accion="agregar"]');
  if (!boton) return;

  agregar(Number(boton.dataset.id));
});

carrito.addEventListener("click", (evento) => {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;

  if (accion === "sumar") cambiarCantidad(id, 1);
  if (accion === "restar") cambiarCantidad(id, -1);
  if (accion === "eliminar") eliminar(id);
});

botonVaciar.addEventListener("click", () => {
  estado.carrito = [];
  almacen.borrar();
  anunciar("Carrito vaciado");
  render();
});

botonFinalizar.addEventListener("click", () => {
  if (estado.carrito.length === 0) {
    anunciar("El carrito está vacío");
    return;
  }

  const importe = totalCarrito().toFixed(2);
  estado.carrito = [];
  almacen.borrar();
  anunciar(`Compra simulada por ${importe} €`);
  render();
});

render();
```

#### Explicación línea por línea

| Paso | Qué hace el código | Por qué |
|---|---|---|
| 1 | `PRODUCTOS` como catálogo | Datos de referencia. El carrito solo guarda `{ id, cantidad }` |
| 2 | `normalizarCarrito(valor)` | Valida y sanea lo que venga de `localStorage` |
| 3 | `Array.isArray(valor)` | Si el JSON no es un array, se descarta |
| 4 | `Number.isInteger(linea.cantidad)` | Rechaza cantidades `NaN`, decimales o strings |
| 5 | `producto ? producto.stock : 0` | Evita `undefined.stock` si el producto ya no existe |
| 6 | `Math.min(linea.cantidad, stock)` | Corrige cantidades mayores que el stock actual |
| 7 | `.filter((linea) => linea !== null)` | Elimina líneas inválidas después del `map` |
| 8 | `estado.carrito` | Única fuente de verdad del carrito |
| 9 | `productoPorId(id)` | Centraliza la búsqueda y evita repetir `find` |
| 10 | `cantidadEnCarrito(id)` | Devuelve 0 si no hay línea. Simplifica comparaciones |
| 11 | `if (cantidad >= producto.stock)` | Respeta el stock antes de añadir |
| 12 | `linea.cantidad += 1` o `push` | Actualiza la línea existente o crea una nueva |
| 13 | `guardarYRenderizar()` | Guarda y pinta tras cada mutación |
| 14 | `cambiarCantidad(id, delta)` | Unifica sumar y restar con un solo parámetro |
| 15 | `if (nueva <= 0) eliminar(id)` | Al llegar a cero, la línea desaparece |
| 16 | `totalCarrito()` | Calcula el total desde el estado, no desde el DOM |
| 17 | `reduce` con `producto ? ... : suma` | Ignora líneas de productos que ya no existen |
| 18 | `guardarYRenderizar` | Guarda el array, no el objeto `estado` completo. El carrito es lo único persistente |
| 19 | `renderCatalogo` | Reconstruye el catálogo y desactiva botones sin stock |
| 20 | `boton.disabled = cantidadEnCarrito(...) >= stock` | Evita añadir más de lo disponible |
| 21 | `renderCarrito` | Reconstruye las líneas del carrito |
| 22 | `linea.cantidad >= producto.stock` en `sumar.disabled` | Desactiva `+1` cuando no queda stock |
| 23 | `total.textContent = totalCarrito().toFixed(2)` | Muestra dos decimales |
| 24 | `vacio.hidden = estado.carrito.length > 0` | Muestra el mensaje solo con carrito vacío |
| 25 | `botonVaciar.disabled = ...` | Desactiva acciones sin sentido cuando no hay líneas |
| 26 | Delegación en `catalogo` | Un solo listener para todos los botones “Añadir” |
| 27 | Delegación en `carrito` | Un solo listener para sumar, restar y eliminar |
| 28 | `botonVaciar` | Vacía el estado y borra la clave de `localStorage` |
| 29 | `botonFinalizar` | Simula la compra, muestra el importe y limpia |
| 30 | `render()` al final | Carga el carrito persistido al abrir la página |

**Por qué el carrito guarda solo `{ id, cantidad }`:** el nombre y el precio viven en `PRODUCTOS`. Si guardaras una copia completa, un cambio de precio dejaría el carrito con datos obsoletos. Guarda la referencia y resuelve los datos actuales al renderizar.

**Prueba de persistencia:** añade productos, recarga la página y comprueba que el carrito y el total se mantienen.

**Prueba de corrupción:** en DevTools, edita `carrito:v1` y escribe `[{"id":99,"cantidad":-3}]`. Recarga: el carrito debe quedar vacío, sin errores visibles.

**Prueba de stock:** añade 5 camisas. El botón “Añadir” del catálogo se desactiva y `+1` en el carrito también.

**Mejoras opcionales:**

- Filtrar el catálogo con el buscador del Reto 7.
- Guardar también el tema del Reto 6.
- Añadir un contador de artículos en el título.
- Sincronizar el carrito entre pestañas con el evento `storage`.

---

## 6.10 — Errores, glosario y autoevaluación

### 6.10.1 Errores frecuentes

| Error | Causa | Solución |
|---|---|---|
| `Cannot read properties of null` | `querySelector` no encontró el elemento | Comprueba el selector y el momento de ejecución; usa `if` o `?.` |
| El script no encuentra el DOM | `<script>` en el `<head>` sin `defer` | Usa `defer` o coloca el script al final del `<body>` |
| El formulario recarga la página | Falta `preventDefault()` en `submit` | Añade `evento.preventDefault()` |
| Los campos no llegan a `FormData` | Falta el atributo `name` | Añade `name` a cada campo |
| `removeEventListener` no quita nada | Se pasa una función distinta o cambian las opciones | Guarda la referencia y usa las mismas opciones; o usa `AbortController` |
| Los listeners nuevos no funcionan tras renderizar | Se registraron sobre nodos que ya no existen | Usa delegación en un contenedor estable |
| El clic en un hijo no activa la delegación | Se usa `event.target` sin `closest` | Usa `evento.target.closest("selector")` |
| `focus`/`blur` no se delegan | No burbujean | Usa `focusin`/`focusout` |
| `innerHTML` con datos del usuario | XSS | Usa `textContent` o `createElement` |
| `localStorage` guarda `[object Object]` | Se guardó un objeto sin serializar | Usa `JSON.stringify` y `JSON.parse` |
| `JSON.parse` rompe la página | Datos corruptos o `null` | Envuelve en `try/catch` y valida la forma |
| `localStorage` lanza `QuotaExceededError` | Se superó la cuota | Captura el error y ofrece alternativa |
| El tema parpadea al cargar | Se aplica después del primer pintado | Aplica el tema en un script en el `<head>` |
| La animación va a saltos | Se usa `setInterval` o se anima `left`/`width` | Usa `requestAnimationFrame` y `transform` |
| La animación se acelera en pantallas de 120 Hz | Se suma una cantidad fija por frame | Calcula con `timestamp` y duración |
| Layout thrashing | Se alternan lecturas y escrituras de layout | Lee todo primero, escribe después |
| El debounce no funciona | Se crea dentro del listener | Crea la función una sola vez, fuera |
| Los IDs se duplican al clonar | `cloneNode(true)` copia los `id` | Cambia los IDs de la copia |
| `NodeList` no tiene `map` | No es un array | Usa `Array.from` o spread |
| `getElementById` devuelve `null` | Se pasó `"#id"` con almohadilla | Pasa solo el ID |
| El botón dentro del formulario envía sin querer | Su `type` por defecto es `submit` | Usa `type="button"` |
| El foco se pierde al re-renderizar | Se reemplaza el nodo enfocado | Conserva el nodo o restaura el foco después |
| El evento `storage` no se dispara en la misma pestaña | Es su comportamiento estándar | Actualiza también el estado local |
| El carrito muestra datos viejos | Se guardó una copia completa del producto | Guarda solo `id` y resuelve los datos actuales |

### 6.10.2 Glosario

| Término | Definición |
|---|---|
| **DOM** | Representación en memoria del documento HTML como árbol de nodos |
| **Nodo** | Unidad del DOM: elemento, texto, comentario o documento |
| **Elemento** | Nodo de tipo etiqueta HTML, como `<p>` o `<li>` |
| **Selector** | Patrón CSS que identifica elementos (`#id`, `.clase`, `ul > li`) |
| **`NodeList`** | Lista de nodos. Puede ser estática o viva; tiene `forEach`, no `map` |
| **`HTMLCollection`** | Colección viva de elementos; no tiene `forEach` |
| **Atributo** | Valor escrito en el HTML (`value`, `href`, `data-id`) |
| **Propiedad** | Valor en memoria del objeto DOM (`input.value`, `checkbox.checked`) |
| **`dataset`** | Acceso a atributos `data-*` en camelCase |
| **Evento** | Objeto que representa algo que ocurrió y se entrega a los listeners |
| **Listener** | Función registrada para responder a un evento |
| **Burbujeo** | Propagación del evento desde el objetivo hacia sus ancestros |
| **Captura** | Propagación del evento desde `document` hacia el objetivo |
| **Delegación** | Técnica de escuchar en un ancestro y usar `closest` para identificar el origen |
| **`preventDefault`** | Cancela la acción por defecto del navegador |
| **`stopPropagation`** | Detiene la propagación del evento |
| **`AbortController`** | Mecanismo para cancelar operaciones y quitar listeners con una señal |
| **`CustomEvent`** | Evento personalizado con datos en `detail` |
| **Reflow / layout** | Recálculo de posiciones y tamaños |
| **Repaint** | Redibujado de píxeles sin cambiar layout |
| **Layout thrashing** | Alternancia repetida de lecturas y escrituras de layout |
| **`requestAnimationFrame`** | API que ejecuta una función antes del siguiente repintado |
| **Debounce** | Espera a que cesen los eventos antes de ejecutar |
| **Throttle** | Ejecuta como máximo una vez cada intervalo |
| **`localStorage`** | Almacenamiento persistente por origen, solo strings, sincrónico |
| **`sessionStorage`** | Como `localStorage`, pero por pestaña y hasta cerrarla |
| **Origen** | Combinación de protocolo, dominio y puerto |
| **Cookie** | Pequeño dato que el navegador envía al servidor en cada petición |
| **`HttpOnly`** | Cookie inaccesible desde JavaScript |
| **XSS** | Inyección de código malicioso a través de contenido no confiable |
| **`FormData`** | Estructura clave-valor con los campos de un formulario |
| **Constraint Validation API** | API para consultar y personalizar la validación de campos |
| **`aria-*`** | Atributos que describen semántica y estado para tecnologías de asistencia |
| **`hidden`** | Atributo que oculta un elemento a la vista y a lectores de pantalla |
| **IIFE** | Función que se ejecuta inmediatamente y crea un ámbito privado |
| **Patrón módulo** | Encapsular estado y exponer solo una API pública |
| **Render declarativo** | Describir la interfaz a partir del estado y reconstruirla |

### 6.10.3 Autoevaluación

Marca lo que puedas explicar o hacer **sin mirar el material**:

- [ ] Explico qué es el DOM y en qué se diferencia del HTML.
- [ ] Sé cuándo usar `getElementById`, `querySelector` y `querySelectorAll`.
- [ ] Distingo `NodeList` de `HTMLCollection` y sé cuándo convertir a array.
- [ ] Compruebo `null` después de una selección.
- [ ] Uso `textContent` por defecto y sé por qué `innerHTML` es peligroso.
- [ ] Distingo atributo de propiedad (`value` vs `getAttribute("value")`).
- [ ] Uso `classList` y `dataset` con soltura.
- [ ] Creo nodos con `createElement`, los inserto con `append` y los elimino con `remove`.
- [ ] Uso `DocumentFragment` para inserciones múltiples.
- [ ] Explico burbujeo, captura y delegación.
- [ ] Distingo `event.target` de `event.currentTarget`.
- [ ] Sé cuándo usar `preventDefault` y cuándo `stopPropagation`.
- [ ] Quito listeners con la misma referencia o con `AbortController`.
- [ ] Leo un formulario con `FormData` y `Object.fromEntries`.
- [ ] Valido campos con mensajes accesibles y foco en el primer error.
- [ ] Explico `localStorage` vs `sessionStorage` vs cookies.
- [ ] Serializo objetos y tolero datos corruptos con `try/catch`.
- [ ] Sé qué no guardar en `localStorage`.
- [ ] Animo con `requestAnimationFrame` y cálculo por tiempo.
- [ ] Evito layout thrashing separando lecturas y escrituras.
- [ ] Implemento `debounce` y `throttle`.
- [ ] Organizo el código en estado, lógica y render.
- [ ] Separo componentes y los destruyo sin dejar listeners.
- [ ] Uso HTML semántico, `label`, foco visible y teclado.

Si fallas en algún punto, vuelve a la sección correspondiente antes de seguir.

### 6.10.4 Qué sigue

En el **Módulo 7** verás:

- Módulos ES: `import` y `export`.
- Programación funcional aplicada: composición, inmutabilidad, funciones puras.
- Errores a fondo y estrategias de recuperación.
- HTTP, `fetch`, `AbortController` en peticiones reales, Axios.
- JSON a fondo y validación de respuestas.
- Expresiones regulares.
- `Intl` para fechas, números y monedas.
- Manejo de estados de carga, error y vacío en interfaces reales.

Todo lo que construiste en este módulo —estado, render, delegación, almacenamiento, cancelación— se reutiliza allí con datos que vienen de un servidor.

---

## ✅ Resumen del Módulo 6

| Área | Lo esencial |
|---|---|
| **DOM** | Es un árbol de nodos en memoria, no el HTML original |
| **Selección** | `querySelector` para uno, `querySelectorAll` para varios; comprueba `null` |
| **Texto seguro** | `textContent` por defecto; `innerHTML` solo con HTML controlado |
| **Nodos** | `createElement` + `append` + `remove`; `DocumentFragment` para lotes |
| **Atributos** | `getAttribute`/`setAttribute`; `dataset` para `data-*`; propiedades para estado interactivo |
| **Eventos** | `addEventListener`, burbujeo, delegación con `closest` |
| **Limpieza** | `removeEventListener` con la misma referencia o `AbortController` |
| **Formularios** | `name`, `FormData`, `preventDefault`, validación en cliente y servidor |
| **Accesibilidad** | `label`, `aria-*`, foco, teclado, mensajes con `role="alert"` |
| **Almacenamiento** | `localStorage` para preferencias; cookies `HttpOnly` para sesión; IndexedDB para volumen |
| **Serialización** | `JSON.stringify` / `JSON.parse` con `try/catch` y validación de forma |
| **Rendimiento** | `requestAnimationFrame`, `transform`, separar lecturas y escrituras |
| **Frecuencia** | `debounce` para esperar; `throttle` para limitar |
| **Organización** | Estado → lógica → render; componentes con destrucción |
| **Seguridad** | Nunca insertar datos no confiables como HTML; no guardar secretos en `localStorage` |

**La idea central:** el DOM es una representación. Tu estado es la fuente de verdad. Los eventos modifican el estado, y una función de render lo refleja en la interfaz. Si mantienes esa dirección —estado → render— el código del navegador se vuelve predecible, aunque la interfaz crezca.

---

> **Fin del Módulo 6.**
>
> Cuando quieras, continuamos con el **Módulo 7: módulos, programación funcional, errores, `fetch` y Axios**.
