# 🟨 Curso Completo de JavaScript — De Cero Absoluto a Experto

> **Módulo 4 — `this`, prototipos, clases y objetos avanzados**
>
> Última actualización: 2026-11-13
> Nivel: intermedio
> Requisitos: Módulos 1, 2 y 3 completados

---

## 📋 Índice del módulo

1. [Qué es `this` y por qué existe](#41--qué-es-this-y-por-qué-existe)
2. [`this` según la forma de llamada](#42--this-según-la-forma-de-llamada)
3. [`call`, `apply` y `bind`](#43--call-apply-y-bind)
4. [Patrones para no perder `this`](#44--patrones-para-no-perder-this)
5. [Prototipos](#45--prototipos)
6. [Constructores y `new`](#46--constructores-y-new)
7. [Clases](#47--clases)
8. [Getters, setters y descriptores](#48--getters-setters-y-descriptores)
9. [Herencia vs composición](#49--herencia-vs-composición)
10. [`instanceof`, duck typing y comprobaciones](#410--instanceof-duck-typing-y-comprobaciones)
11. [Patrones y anti-patrones](#411--patrones-y-anti-patrones)
12. [Retos con solución explicada](#412--retos-con-solución-explicada)
13. [Errores, glosario y autoevaluación](#413--errores-glosario-y-autoevaluación)

---

## Convención pedagógica

Este módulo solo usa conceptos **ya explicados**. Este es el inventario exacto antes de empezar.

**Ya sabes (Módulos 1, 2 y 3):**

- Variables, tipos, operadores, `typeof`, `in`, ternario, `===`.
- `if/else`, `switch`, `for`, `while`, `for...of`, `for...in`.
- Funciones: declaración, expresión, arrow, defaults, rest, scope, closures, recursión, HOF y callbacks **sincrónicos**.
- Arrays y objetos: literales, índices, propiedades, `length`.
- Métodos de array: `map`, `filter`, `reduce`, `find`, `some`, `every`, `sort`, `slice`, `splice`, etc.
- `Object.keys/values/entries/fromEntries/assign/hasOwn/freeze/seal`, `structuredClone`.
- Destructuring, spread/rest, `?.`, `??`.
- `Map`, `Set`, `WeakMap`, `WeakSet` y `new` con esos constructores incorporados.
- `const`/`let`, TDZ, modo estricto, paso por valor y por referencia.

**Nuevo en este módulo (se explica antes de usarse):**

| Concepto | Sección |
|---|---|
| `this` y sus reglas de llamada | 4.1 y 4.2 |
| `globalThis` | 4.2.7 |
| `call`, `apply`, `bind` | 4.3 |
| `[[Prototype]]`, `Object.getPrototypeOf`, `Object.setPrototypeOf` | 4.5 |
| `Object.create` y `Object.create(null)` | 4.5 |
| `Object.getOwnPropertyNames`, `isPrototypeOf`, `propertyIsEnumerable`, `__proto__` | 4.5 |
| Constructores propios y los 4 pasos de `new` | 4.6 |
| `new.target` | 4.6.7 |
| Clases: `class`, `extends`, `super`, `static`, campos privados `#` | 4.7 |
| Getters, setters y descriptores de propiedad | 4.8 |
| `Object.defineProperty`, `Object.defineProperties`, `Object.getOwnPropertyDescriptor(s)` | 4.8 |
| `Object.isFrozen`, `Object.isSealed`, `Object.isExtensible` | 4.8.8 |
| Mixins y composición | 4.9 |
| `instanceof`, `Symbol.hasInstance`, brand checks `#x in obj` | 4.10 |
| `Symbol.toStringTag`, `Reflect.apply` | 4.3.8 y 4.10.4 |

**Lo que NO usaremos todavía:**

| Concepto | Módulo |
|---|---|
| Promesas, `async/await`, `setTimeout` | Módulo 5 |
| `try/catch` y `throw` básicos | Módulo 5 |
| DOM, eventos, `localStorage` | Módulo 6 |
| `import`/`export`, `fetch`, JSON, regex, manejo de errores avanzado | Módulo 7 |
| `Date`, `Intl`, `Proxy`, `Reflect` avanzado | Más adelante |

> 📌 Si ves algo que no está en la lista de “ya sabes” ni en la de “nuevo”, es un error del material. Avísame y lo corrijo.

**Al terminar este módulo podrás:**

- Predecir el valor de `this` en cualquier llamada.
- Explicar qué hace `new` paso a paso.
- Leer y escribir clases con herencia, `super`, `static` y campos privados.
- Entender la cadena de prototipos y por qué `instanceof` funciona.
- Decidir entre clase, fábrica, closure, `WeakMap` o composición.
- Evitar los bugs clásicos de `this` en callbacks y métodos desacoplados.

---

## 4.1 — Qué es `this` y por qué existe

### 4.1.1 Definición

`this` es una **palabra clave** que hace referencia a un valor especial llamado **contexto de ejecución**. Ese valor **no se decide donde se escribe la función**, sino **donde se llama**.

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    return "Hola, " + this.nombre;
  },
};

console.log(usuario.saludar()); // "Hola, Ana"
```

En `usuario.saludar()`, el `this` de `saludar` es `usuario`. Por eso `this.nombre` es `"Ana"`.

**Modelo mental:** cuando escribes `objeto.metodo()`, JavaScript interpreta que el objeto de la izquierda es el contexto. `this` es la respuesta a la pregunta **“¿quién está llamando?”**.

```js
const otro = {
  nombre: "Luis",
  saludar: usuario.saludar, // la misma función, otro objeto
};

console.log(otro.saludar()); // "Hola, Luis"
```

La función es **la misma**, pero el resultado cambia porque el objeto de la izquierda cambió.

### 4.1.2 `this` no es la función ni el ámbito

Dos confusiones muy comunes:

```js
function ejemplo() {
  console.log(this === ejemplo); // false
  console.log(typeof this); // "object" en modo no estricto
}

ejemplo();
```

- `this` **no** apunta a la función `ejemplo`.
- `this` **no** es una variable de scope como las de un closure.
- `this` es un enlace que el motor asigna en cada llamada.

Tampoco tiene nada que ver con dónde está escrita la función:

```js
const objeto = {
  nombre: "Ana",
  saludar: function () {
    return this.nombre;
  },
};

const saludar = objeto.saludar;
console.log(saludar()); // "undefined" en modo no estricto ⚠️
```

La función se escribió dentro de `objeto`, pero al llamarla suelta ya no hay objeto a la izquierda. En modo no estricto, `this` pasa a ser el objeto global; en modo estricto, `undefined`.

### 4.1.3 Las cinco formas de llamada

Estas son las únicas reglas que necesitas. El resto es consecuencia de ellas.

| Forma de llamada | Ejemplo | Valor de `this` |
|---|---|---|
| Llamada simple | `fn()` | `undefined` en estricto; objeto global en no estricto |
| Llamada como método | `obj.fn()` | `obj` |
| Llamada con `new` | `new Fn()` | el objeto recién creado |
| Llamada explícita | `fn.call(x)`, `fn.apply(x)`, `fn.bind(x)()` | `x` |
| Arrow function | `(() => this)()` | el `this` del ámbito donde se creó |

> 🧠 **Regla de oro:** para una función normal, mira **cómo se llama**, no dónde se define. Para una arrow, mira **dónde se define**.

### 4.1.4 El bug de perder `this`

El error más frecuente de todo JavaScript:

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    return "Hola, " + this.nombre;
  },
};

const boton = {
  alHacerClic: usuario.saludar,
};

console.log(boton.alHacerClic()); // "Hola, undefined" ⚠️
```

Aquí `this` es `boton`, no `usuario`, porque la llamada es `boton.alHacerClic()`. `boton` no tiene `nombre`, así que `this.nombre` es `undefined`.

**La solución** es una de estas tres:

```js
// 1. Llamar siempre como método del objeto correcto
console.log(usuario.saludar()); // "Hola, Ana"

// 2. Fijar el contexto con bind
const saludarAna = usuario.saludar.bind(usuario);
console.log(saludarAna()); // "Hola, Ana"

// 3. Usar una arrow que capture el this externo
const saludarConArrow = () => usuario.saludar();
console.log(saludarConArrow()); // "Hola, Ana"
```

En 4.3 y 4.4 verás cada técnica en detalle.

### ✅ Haz esto / ❌ Evita esto (4.1)

```js
// ✅ Llama al método desde el objeto que tiene los datos
usuario.saludar();

// ✅ Si vas a pasar el método como callback, fija el contexto
const callback = usuario.saludar.bind(usuario);

// ✅ Usa arrow cuando quieras heredar el this externo
const arrow = () => usuario.saludar();

// ❌ Guardar un método y llamarlo suelto
const suelto = usuario.saludar;
suelto(); // pierde this

// ❌ Suponer que this es la función
function f() {
  // this !== f
}

// ❌ Suponer que this depende del lugar donde se escribió la función
// (solo las arrows funcionan así)
```

---

## 4.2 — `this` según la forma de llamada

### 4.2.1 Llamada simple

Una llamada simple es `fn()`: no hay objeto a la izquierda, ni `new`, ni `call`.

```js
function quienSoy() {
  "use strict";
  return this;
}

console.log(quienSoy()); // undefined
```

En **modo estricto**, `this` es `undefined`.

```js
function quienSoy() {
  return this;
}

console.log(typeof quienSoy()); // "object" (modo no estricto)
```

En **modo no estricto**, `this` es el **objeto global**.

> ⚠️ Este es el motivo por el que un método desacoplado “funciona” a medias en código antiguo: `this` se convierte en el objeto global y las propiedades no existen, pero no lanza error.

**¿Cuándo importa?** En funciones que no son métodos, `this` casi nunca debería usarse. Si necesitas datos, recíbelos por parámetro o usa un closure.

```js
// ✅ Una función normal no necesita this
function sumar(a, b) {
  return a + b;
}

// ❌ Función normal que depende de this sin un objeto claro
function saludar() {
  return "Hola, " + this.nombre; // ¿quién es this?
}
```

### 4.2.2 Llamada como método

Cuando llamas `objeto.metodo()`, `this` es `objeto`.

```js
const coche = {
  marca: "Toyota",
  describir: function () {
    return "Marca: " + this.marca;
  },
};

console.log(coche.describir()); // "Marca: Toyota"
```

Funciona igual con corchetes:

```js
console.log(coche["describir"]()); // "Marca: Toyota"
```

Y con propiedades anidadas:

```js
const tienda = {
  nombre: "Central",
  empleado: {
    nombre: "Luis",
    presentarse: function () {
      return "Soy " + this.nombre;
    },
  },
};

console.log(tienda.empleado.presentarse()); // "Soy Luis"
```

`this` es el objeto **inmediatamente a la izquierda del punto**, no el objeto más externo. Aquí es `tienda.empleado`, no `tienda`.

```js
console.log(tienda.empleado.presentarse()); // "Soy Luis"
console.log(tienda.nombre); // "Central"
```

### 4.2.3 Método desacoplado

Si guardas el método en otra variable, dejas de tener una llamada como método.

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    "use strict";
    return "Hola, " + this.nombre;
  },
};

const saludar = usuario.saludar;

console.log(usuario.saludar()); // "Hola, Ana" ✅

// saludar(); // ❌ TypeError: Cannot read properties of undefined (reading 'nombre')
```

En modo no estricto no lanza error, pero el resultado es incorrecto:

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    return "Hola, " + this.nombre;
  },
};

const saludar = usuario.saludar;
console.log(saludar()); // "Hola, undefined" ⚠️
```

**Lo mismo ocurre al pasar el método como callback:**

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    return "Hola, " + this.nombre;
  },
};

function ejecutar(fn) {
  return fn();
}

console.log(ejecutar(usuario.saludar)); // "Hola, undefined" ⚠️
```

Dentro de `ejecutar`, la llamada es `fn()`, una llamada simple. Ya no hay objeto a la izquierda.

**Arreglo:**

```js
console.log(ejecutar(usuario.saludar.bind(usuario))); // "Hola, Ana" ✅
```

### 4.2.4 `this` en funciones anidadas

Una función normal anidada **no hereda** el `this` de la función que la contiene. Cada llamada decide su propio `this`.

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    function interna() {
      "use strict";
      return this; // undefined: llamada simple
    }

    return interna();
  },
};

console.log(usuario.saludar()); // undefined ⚠️
```

La llamada `interna()` es simple, así que su `this` es `undefined` (estricto) o el global (no estricto). No es `usuario`.

**Tres soluciones:**

```js
const usuario = {
  nombre: "Ana",

  // 1. Guardar this en una variable
  saludar1: function () {
    const self = this;
    function interna() {
      return self.nombre;
    }
    return interna();
  },

  // 2. Fijar this con bind
  saludar2: function () {
    function interna() {
      return this.nombre;
    }
    return interna.bind(this)();
  },

  // 3. Usar una arrow (hereda this)
  saludar3: function () {
    const interna = () => this.nombre;
    return interna();
  },
};

console.log(usuario.saludar1()); // "Ana"
console.log(usuario.saludar2()); // "Ana"
console.log(usuario.saludar3()); // "Ana"
```

> 🧠 `const self = this` fue el patrón estándar durante años. Hoy se prefiere arrow o `bind`.

### 4.2.5 Arrow functions

Una **arrow function** no tiene `this` propio. Usa el `this` del **ámbito léxico** donde fue creada.

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    const interna = () => this.nombre;
    return interna();
  },
};

console.log(usuario.saludar()); // "Ana" ✅
```

Aquí `interna` se creó dentro de `saludar`, así que su `this` es el mismo que el de `saludar` en esa llamada: `usuario`.

**Si la arrow se usa como método del objeto, no funciona:**

```js
const usuario = {
  nombre: "Ana",
  saludar: () => this.nombre,
};

console.log(usuario.saludar()); // undefined ⚠️
```

La arrow se creó en el ámbito exterior (el módulo o el script), no en `usuario`. Su `this` es el de ese ámbito, no el objeto.

**Las arrows ignoran `call`, `apply` y `bind`:**

```js
const contexto = { x: 1 };
const flecha = () => this;

console.log(flecha.call(contexto) === contexto); // false
console.log(flecha.apply(contexto) === contexto); // false
console.log(flecha.bind(contexto)() === contexto); // false
```

**Las arrows no tienen `arguments` propio:**

```js
function externa() {
  const interna = () => arguments[0];
  return interna();
}

console.log(externa("hola")); // "hola"
```

`interna` usa el `arguments` de `externa`.

**Las arrows no se pueden usar con `new`:**

```js
const Flecha = () => {};

// new Flecha(); // ❌ TypeError: Flecha is not a constructor
```

**Resumen de limitaciones de las arrows:**

- No tienen `this` propio.
- No tienen `arguments` propio.
- No tienen `super` propio.
- No se pueden usar con `new`.
- No sirven como métodos que dependan del objeto.

### 4.2.6 `this` en callbacks

Los callbacks son el lugar donde más se pierde `this`.

**Caso correcto: llamar al método dentro del callback.**

```js
const contador = {
  total: 0,
  sumar: function (n) {
    this.total += n;
  },
};

[1, 2, 3].forEach(function (n) {
  contador.sumar(n);
});

console.log(contador.total); // 6 ✅
```

**Caso incorrecto: pasar el método suelto.**

```js
const contador = {
  total: 0,
  sumar: function (n) {
    this.total += n;
  },
};

[1, 2, 3].forEach(contador.sumar);

console.log(contador.total); // 0 ⚠️
```

`forEach` llama al callback como `callback(elemento, índice, array)`, sin objeto a la izquierda. `this` no es `contador`.

En modo estricto, además, lanzaría un `TypeError` al intentar leer `this.total`.

**Tres arreglos:**

```js
const contador = {
  total: 0,
  sumar: function (n) {
    this.total += n;
  },
};

// 1. bind
[1, 2, 3].forEach(contador.sumar.bind(contador));
console.log(contador.total); // 6

// 2. arrow que llama al método
const contador2 = { total: 0, sumar: function (n) { this.total += n; } };
[1, 2, 3].forEach((n) => contador2.sumar(n));
console.log(contador2.total); // 6

// 3. arrow dentro del método que captura this
const contador3 = {
  total: 0,
  sumarTodos: function (numeros) {
    numeros.forEach((n) => {
      this.total += n;
    });
  },
};
contador3.sumarTodos([1, 2, 3]);
console.log(contador3.total); // 6
```

La opción 3 es la más elegante cuando el método ya tiene el `this` correcto.

### 4.2.7 `this` en el nivel superior y `globalThis`

El **objeto global** tiene una referencia estándar llamada `globalThis`. Sirve para acceder a él sin depender del entorno.

`this` en el nivel superior depende del entorno:

```js
console.log(typeof globalThis); // "object"
```

- En un **script clásico del navegador**: `this === window === globalThis`.
- En **Node con CommonJS** (el `.js` por defecto): `this` es el objeto de exportaciones del archivo, no `globalThis` (lo verás en el Módulo 7).
- En un **módulo ES** (`import`/`export`): `this === undefined`.

Como el curso todavía no usa módulos (Módulo 7), no dependas de `this` en el nivel superior. Usa `globalThis` cuando necesites el objeto global de forma explícita.

```js
globalThis.miVariableGlobal = "hola";
console.log(globalThis.miVariableGlobal); // "hola"
```

> ⚠️ Crear variables globales es una mala práctica en aplicaciones grandes. `globalThis` existe más para interoperabilidad y para acceder a APIs del entorno que para guardar datos.

### 4.2.8 Modo estricto

El modo estricto cambia el valor de `this` en llamadas simples:

```js
function estricta() {
  "use strict";
  return this;
}

function noEstricta() {
  return this;
}

console.log(estricta()); // undefined
console.log(noEstricta() === globalThis); // true
```

También cambia el comportamiento de `call`/`apply` con `null`, `undefined` y primitivos:

```js
function estricta() {
  "use strict";
  return this;
}

console.log(estricta.call(null)); // null
console.log(estricta.call(5)); // 5

function noEstricta() {
  return typeof this;
}

console.log(noEstricta.call(null)); // "object" (this es globalThis)
console.log(noEstricta.call(5)); // "object" (this es Number envuelto)
```

En modo no estricto, `null` y `undefined` se convierten en el objeto global, y los primitivos se **envuelven** en su objeto correspondiente. En estricto se pasan tal cual.

> 📌 Las clases son **siempre estrictas** por dentro, aunque el archivo no lo sea. Lo verás en 4.7.

### 4.2.9 `this` en getters y setters (vista previa)

Los getters y setters también reciben `this` según cómo se acceda a la propiedad:

```js
const persona = {
  nombre: "Ana",
  get saludo() {
    return "Hola, " + this.nombre;
  },
};

console.log(persona.saludo); // "Hola, Ana"
```

Aquí `this` es `persona` porque el acceso es `persona.saludo`. Los verás a fondo en 4.8.

### ✅ Haz esto / ❌ Evita esto (4.2)

```js
// ✅ Método llamado desde su objeto
usuario.saludar();

// ✅ Arrow dentro del método para heredar this
const interna = () => this.nombre;

// ✅ bind al pasar un método como callback
lista.forEach(objeto.metodo.bind(objeto));

// ✅ Función normal sin this para lógica pura
function sumar(a, b) { return a + b; }

// ❌ Método guardado y llamado suelto
const f = usuario.saludar;
f();

// ❌ Arrow como método que usa this
const obj = { nombre: "Ana", saludar: () => this.nombre };

// ❌ Función anidada normal esperando heredar this
function internaNormal() { return this.nombre; }

// ❌ Pasar método suelto a forEach/map/filter
lista.forEach(objeto.metodo);

// ❌ Depender de this en el nivel superior
```

---

## 4.3 — `call`, `apply` y `bind`

Los tres métodos viven en `Function.prototype`, así que **toda función normal** los tiene. Sirven para **decidir el `this`** de una llamada.

### 4.3.1 `call`

`fn.call(thisArg, arg1, arg2, ...)` llama a `fn` con `thisArg` como `this` y los argumentos **separados por comas**.

```js
function presentar(saludo, signo) {
  return saludo + ", " + this.nombre + signo;
}

const ana = { nombre: "Ana" };

console.log(presentar.call(ana, "Hola", "!")); // "Hola, Ana!"
```

Sin `call`, `presentar("Hola", "!")` tendría `this` global o `undefined` y fallaría.

**También sirve para reutilizar una función con varios objetos:**

```js
const luis = { nombre: "Luis" };

console.log(presentar.call(luis, "Hey", ".")); // "Hey, Luis."
```

### 4.3.2 `apply`

`fn.apply(thisArg, [args])` hace lo mismo, pero recibe los argumentos en un **array** (o array-like).

```js
console.log(presentar.apply(ana, ["Buenas", "?"])); // "Buenas, Ana?"
```

**Caso clásico: `Math.max` con un array.**

```js
const numeros = [3, 1, 5, 2];

console.log(Math.max.apply(null, numeros)); // 5
console.log(Math.min.apply(null, numeros)); // 1
```

Hoy es más idiomático usar spread:

```js
console.log(Math.max(...numeros)); // 5
```

Pero `apply` sigue apareciendo en código antiguo y en librerías.

**`apply` con array-like:**

```js
function sumarTres(a, b, c) {
  return a + b + c;
}

const arrayLike = { 0: 1, 1: 2, 2: 3, length: 3 };

console.log(sumarTres.apply(null, arrayLike)); // 6
```

`apply` no exige un array real: le basta un objeto con índices y `length`.

### 4.3.3 `bind`

`fn.bind(thisArg, arg1, ...)` **no llama** a la función. Devuelve una **función nueva** con el `this` fijado y, opcionalmente, algunos argumentos prefijados.

```js
function presentar(saludo) {
  return saludo + ", " + this.nombre;
}

const ana = { nombre: "Ana" };
const saludarAna = presentar.bind(ana);

console.log(saludarAna("Hola")); // "Hola, Ana"
console.log(saludarAna("Buenas")); // "Buenas, Ana"
```

**El `this` queda fijado para siempre:**

```js
function quienSoy() {
  return this.n;
}

const uno = quienSoy.bind({ n: 1 });
const dos = uno.bind({ n: 2 });

console.log(dos()); // 1 ⚠️ el segundo bind no cambia el this
```

Una función ya vinculada **no se puede re-vincular** con `bind`, `call` ni `apply` (aunque `call`/`apply` sí pueden pasar argumentos; el `this` se ignora).

```js
console.log(uno.call({ n: 99 })); // 1
console.log(uno.apply({ n: 99 })); // 1
```

**Diferencia entre `call`, `apply` y `bind`:**

| Método | ¿Llama ya? | Argumentos | Devuelve |
|---|---|---|---|
| `call` | Sí | separados por comas | resultado de la función |
| `apply` | Sí | array o array-like | resultado de la función |
| `bind` | No | separados por comas | función nueva |

### 4.3.4 Préstamo de métodos

Puedes usar un método de un tipo con un objeto de otro tipo. Esto se llama **method borrowing**.

**Ejemplo: `slice` sobre un array-like.**

```js
const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };

const real = Array.prototype.slice.call(arrayLike);

console.log(real); // ["a", "b", "c"]
console.log(Array.isArray(real)); // true
```

- `Array.prototype.slice` es la función `slice` que comparten todos los arrays.
- `.call(arrayLike)` la ejecuta con `this = arrayLike`.
- Como `arrayLike` tiene índices y `length`, `slice` puede recorrerlo.

Hoy usarías `Array.from(arrayLike)`, que ya conoces:

```js
console.log(Array.from(arrayLike)); // ["a", "b", "c"]
```

**Ejemplo: `Object.prototype.toString.call` para detectar tipos.**

```js
console.log(Object.prototype.toString.call([])); // "[object Array]"
console.log(Object.prototype.toString.call(null)); // "[object Null]"
console.log(Object.prototype.toString.call(new Map())); // "[object Map]"
console.log(Object.prototype.toString.call("hola")); // "[object String]"
```

Esto funciona porque `Object.prototype.toString` mira una etiqueta interna del valor, no el `this` que le pases.

> 📌 En 4.10 verás por qué esto es más fiable que `typeof` en algunos casos.

**Ejemplo: pedir prestado `hasOwnProperty`.**

Antes de `Object.hasOwn` (Módulo 3), se escribía así:

```js
const objeto = { nombre: "Ana" };

console.log(Object.prototype.hasOwnProperty.call(objeto, "nombre")); // true
```

Hoy usa `Object.hasOwn(objeto, "nombre")`. El préstamo sigue siendo útil si el objeto tiene su propia propiedad `hasOwnProperty`:

```js
const raro = { hasOwnProperty: "no soy una función", nombre: "Ana" };

console.log(Object.hasOwn(raro, "nombre")); // true ✅
```

### 4.3.5 Aplicación parcial con `bind`

`bind` permite **prefijar argumentos**. Esto se llama **aplicación parcial**.

```js
function multiplicar(a, b) {
  return a * b;
}

const doble = multiplicar.bind(null, 2);
const triple = multiplicar.bind(null, 3);

console.log(doble(5)); // 10
console.log(triple(5)); // 15
```

El `null` significa “no me importa el `this`”, porque `multiplicar` no lo usa.

**Con varios argumentos:**

```js
function etiquetar(etiqueta, texto) {
  return `[${etiqueta}] ${texto}`;
}

const error = etiquetar.bind(null, "ERROR");
const info = etiquetar.bind(null, "INFO");

console.log(error("algo falló")); // "[ERROR] algo falló"
console.log(info("todo bien")); // "[INFO] todo bien"
```

**`length` de una función vinculada:** indica cuántos argumentos **faltan** por recibir.

```js
function f(a, b, c) {
  return a + b + c;
}

console.log(f.length); // 3
console.log(f.bind(null, 1).length); // 2
console.log(f.bind(null, 1, 2).length); // 1
```

### 4.3.6 `bind` y `new`

Si usas `new` con una función vinculada, **el `this` del `bind` se ignora** y se usa el objeto nuevo. Los argumentos prefijados sí se aplican.

```js
function Punto(x) {
  this.x = x;
}

const Punto5 = Punto.bind({ x: 99 }, 5);
const punto = new Punto5();

console.log(punto.x); // 5 ✅ (no 99)
console.log(punto instanceof Punto); // true
```

Esto es una curiosidad avanzada; en código normal no mezclarás `bind` con `new`.

### 4.3.7 Errores comunes

**1. Creer que `bind` llama a la función:**

```js
function saludar() {
  return "hola";
}

const vinculada = saludar.bind(null);

console.log(typeof vinculada); // "function" (no "hola")
console.log(vinculada()); // "hola"
```

**2. Usar `call` con un array en vez de `apply`:**

```js
function sumar(a, b) {
  return a + b;
}

const args = [1, 2];

console.log(sumar.apply(null, args)); // 3 ✅
// console.log(sumar.call(null, args)); // "1,2undefined" ⚠️
```

Con `call`, el array se pasa como **un solo argumento**.

**3. Intentar cambiar el `this` de una arrow:**

```js
const flecha = () => this;
const contexto = { x: 1 };

console.log(flecha.call(contexto) === contexto); // false
```

**4. Pasar `null` esperando `this` null en modo no estricto:**

```js
function f() {
  return this;
}

console.log(f.call(null) === globalThis); // true en modo no estricto
```

**5. Usar `bind` dentro de un bucle o render sin necesidad:** crea una función nueva cada vez. Si el callback es el mismo siempre, créalo una vez.

```js
// ⚠️ Crea una función nueva en cada iteración
for (const item of items) {
  boton.addEventListener("click", item.handle.bind(item)); // DOM: Módulo 6
}

// ✅ Mejor: crear el callback una vez por item
for (const item of items) {
  const handler = item.handle.bind(item);
  boton.addEventListener("click", handler);
}
```

> 📌 El ejemplo del DOM es una vista previa del Módulo 6; lo importante aquí es el coste de `bind`.

### 4.3.8 `Reflect.apply` (nota avanzada)

`Reflect.apply(fn, thisArg, args)` hace lo mismo que `fn.apply(thisArg, args)`, pero como función estática. Es útil cuando `fn.apply` podría haber sido sobrescrito.

```js
console.log(Reflect.apply(Math.max, null, [1, 9, 3])); // 9
```

No lo necesitas para el día a día. `Reflect` se estudia más adelante.

### ✅ Haz esto / ❌ Evita esto (4.3)

```js
// ✅ call para argumentos separados
fn.call(objeto, a, b);

// ✅ apply para un array de argumentos
fn.apply(objeto, args);

// ✅ bind para fijar this o prefijar argumentos
const doble = multiplicar.bind(null, 2);

// ✅ Array.from en vez de préstamo de slice
const real = Array.from(arrayLike);

// ✅ Object.hasOwn en vez de préstamo de hasOwnProperty
Object.hasOwn(objeto, "clave");

// ❌ Creer que bind ejecuta la función
const resultado = fn.bind(obj); // es una función, no el resultado

// ❌ Pasar un array a call
fn.call(obj, [1, 2]); // un solo argumento

// ❌ Intentar re-vincular una función con bind
const otra = fn.bind(a).bind(b); // gana a

// ❌ Usar call/apply/bind con arrows esperando cambiar this
flecha.call(obj); // se ignora

// ❌ bind dentro de bucles sin necesidad
```

---

## 4.4 — Patrones para no perder `this`

Ya conoces las reglas. Ahora veamos las técnicas concretas, con sus ventajas y desventajas.

### 4.4.1 `const self = this`

El patrón más antiguo. Guarda `this` en una variable del closure.

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    const self = this;

    function interna() {
      return "Hola, " + self.nombre;
    }

    return interna();
  },
};

console.log(usuario.saludar()); // "Hola, Ana"
```

**Ventajas:** funciona en cualquier versión de JavaScript.  
**Desventajas:** ruido visual, fácil de olvidar, se multiplica con funciones anidadas.

También verás `const that = this` o `const _this = this`. Es el mismo patrón.

### 4.4.2 Arrow function

La solución moderna cuando necesitas heredar el `this` del método.

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    const interna = () => "Hola, " + this.nombre;
    return interna();
  },
};

console.log(usuario.saludar()); // "Hola, Ana"
```

**Ventajas:** corto, legible, sin variables extra.  
**Desventajas:** no sirve si necesitas un `this` distinto; las arrows no tienen `arguments` ni `super` propios.

### 4.4.3 `bind`

Fija el contexto en el momento de crear la función.

```js
const usuario = {
  nombre: "Ana",
  saludar: function () {
    return "Hola, " + this.nombre;
  },
};

const saludarAna = usuario.saludar.bind(usuario);

console.log(saludarAna()); // "Hola, Ana"
```

**Ventajas:** el contexto queda garantizado; ideal para callbacks que se pasan a otras APIs.  
**Desventajas:** crea una función nueva; si se hace en cada render o iteración, cuesta memoria.

### 4.4.4 Método que devuelve una arrow

Patrón muy usado en clases y objetos: el método crea y devuelve una función que ya captura el `this` correcto.

```js
const contador = {
  total: 0,
  crearSumador: function () {
    return (n) => {
      this.total += n;
    };
  },
};

const sumar = contador.crearSumador();
sumar(5);
sumar(10);

console.log(contador.total); // 15
```

La arrow se creó dentro de `crearSumador`, así que su `this` es `contador` en esa llamada.

**Uso típico:** crear handlers, callbacks de temporizadores (Módulo 5) o funciones que se guardan para después.

### 4.4.5 `bind` en el constructor

En clases y constructores, un patrón habitual es vincular los métodos que se van a pasar como callbacks.

```js
function Boton(texto) {
  this.texto = texto;
  this.alHacerClic = this.alHacerClic.bind(this);
}

Boton.prototype.alHacerClic = function () {
  return "Clic en " + this.texto;
};

const boton = new Boton("Guardar");
const handler = boton.alHacerClic;

console.log(handler()); // "Clic en Guardar" ✅
```

Sin el `bind` del constructor, `handler()` perdería el `this`.

En clases modernas se prefiere un **campo de clase con arrow**:

```js
class Boton {
  constructor(texto) {
    this.texto = texto;
  }

  alHacerClic = () => {
    return "Clic en " + this.texto;
  };
}

const boton = new Boton("Guardar");
const handler = boton.alHacerClic;

console.log(handler()); // "Clic en Guardar" ✅
```

> 📌 Los campos de clase con arrow se explican en 4.7.4. Aquí es una vista previa.

### 4.4.6 Cuándo no usar `this`

`this` no es obligatorio. Si una función no necesita un contexto dinámico, **no lo uses**.

```js
// ❌ this innecesario
const calculadora = {
  iva: 0.21,
  calcular: function (base) {
    return base * (1 + this.iva);
  },
};

// ✅ closure: más simple y sin this
function crearCalculadora(iva) {
  return function (base) {
    return base * (1 + iva);
  };
}

const calcular = crearCalculadora(0.21);
console.log(calcular(100)); // 121
```

**Usa `this` cuando:**

- El objeto tiene estado y comportamiento que debe operar sobre ese estado.
- Varias instancias comparten métodos y cada una tiene sus datos.
- Una API o framework espera un método con `this` (por ejemplo, clases).

**Evita `this` cuando:**

- La función es pura y solo depende de sus parámetros.
- Puedes resolverlo con un closure.
- El contexto sería ambiguo para quien lee el código.

### ✅ Haz esto / ❌ Evita esto (4.4)

```js
// ✅ Arrow para heredar this en callbacks internos
const interna = () => this.nombre;

// ✅ bind al pasar un método como callback
elemento.addEventListener("click", this.handleClick.bind(this)); // DOM: Módulo 6

// ✅ Campo de clase con arrow para handlers
handleClick = () => { /* this correcto */ };

// ✅ Closure cuando this no aporta nada
function crearSaludo(nombre) {
  return () => "Hola, " + nombre;
}

// ❌ const self = this repartido por todas partes
// ❌ bind dentro de un bucle sin necesidad
// ❌ this en funciones que no son métodos
// ❌ arrow como método que depende del objeto
```

---

## 4.5 — Prototipos

Los prototipos son el mecanismo con el que JavaScript comparte propiedades y métodos entre objetos. Las clases (4.7) son azúcar sintáctico sobre este mecanismo; entenderlo primero evita muchas confusiones.

### 4.5.1 La propiedad interna `[[Prototype]]`

Todo objeto tiene una propiedad interna llamada `[[Prototype]]`. Su valor es **otro objeto** o **`null`**.

No se accede directamente con un nombre normal; se lee con `Object.getPrototypeOf`.

```js
const objeto = { nombre: "Ana" };

console.log(Object.getPrototypeOf(objeto) === Object.prototype); // true
console.log(Object.getPrototypeOf([]) === Array.prototype); // true
console.log(Object.getPrototypeOf(function () {}) === Function.prototype); // true
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

**Modelo mental:** cada objeto tiene una “flecha” interna que apunta a otro objeto. Esa flecha es su prototipo.

```text
objeto  ──[[Prototype]]──▶  Object.prototype  ──[[Prototype]]──▶  null
```

Un array tiene una cadena más larga:

```text
[]  ──▶  Array.prototype  ──▶  Object.prototype  ──▶  null
```

> ⚠️ No confundas `[[Prototype]]` (la flecha interna de un objeto) con `Fn.prototype` (una propiedad normal de las funciones constructoras). Se parecen, pero son cosas distintas. Lo verás en 4.6.

### 4.5.2 Cadena de prototipos

Cuando lees una propiedad, JavaScript la busca en este orden:

1. En el objeto mismo (propiedad **propia**).
2. En su prototipo.
3. En el prototipo del prototipo.
4. Así hasta llegar a `null`.
5. Si no aparece, devuelve `undefined`.

```js
const abuelo = { a: 1 };

const padre = Object.create(abuelo);
padre.b = 2;

const hijo = Object.create(padre);
hijo.c = 3;

console.log(hijo.a); // 1 ← en el abuelo
console.log(hijo.b); // 2 ← en el padre
console.log(hijo.c); // 3 ← propio
console.log(hijo.z); // undefined ← no está en la cadena
```

La cadena es:

```text
hijo ──▶ padre ──▶ abuelo ──▶ Object.prototype ──▶ null
```

**Consecuencia importante:** los métodos no se copian en cada objeto. Viven una sola vez en el prototipo y todos los objetos de la cadena los comparten.

```js
const a = [1, 2];
const b = [3, 4];

console.log(a.map === b.map); // true ✅ el mismo método compartido
console.log(a.hasOwnProperty("map")); // false ← no es propio
```

### 4.5.3 `Object.getPrototypeOf` y `Object.setPrototypeOf`

`Object.getPrototypeOf(objeto)` lee el prototipo. Es seguro y rápido.

```js
const proto = { saludo: "hola" };
const obj = Object.create(proto);

console.log(Object.getPrototypeOf(obj) === proto); // true
```

`Object.setPrototypeOf(objeto, nuevoProto)` cambia el prototipo **después** de crear el objeto.

```js
const proto = { saludar: function () { return "hola"; } };
const obj = {};

Object.setPrototypeOf(obj, proto);

console.log(obj.saludar()); // "hola"
console.log(Object.getPrototypeOf(obj) === proto); // true
```

> ⚠️ `Object.setPrototypeOf` puede ser **muy lento**, porque obliga al motor a reorganizar la búsqueda de propiedades. Úsalo solo si no hay alternativa. Lo normal es crear el objeto ya con el prototipo correcto usando `Object.create`.

**`__proto__` (legado):** muchos objetos tienen un accesor llamado `__proto__` que permite leer y escribir el prototipo.

```js
const proto = { saludo: "hola" };
const obj = {};

obj.__proto__ = proto; // funciona, pero es legado ⚠️

console.log(obj.saludo); // "hola"
```

No lo uses en código nuevo. Usa `Object.getPrototypeOf` y `Object.create`. `__proto__` es un accesor que vive en `Object.prototype`, no una propiedad real de cada objeto.

### 4.5.4 `Object.create`

`Object.create(proto)` crea un objeto **nuevo** cuyo prototipo es `proto`.

```js
const animal = {
  describir: function () {
    return "Soy un " + this.tipo;
  },
};

const perro = Object.create(animal);
perro.tipo = "perro";

console.log(perro.describir()); // "Soy un perro"
console.log(Object.getPrototypeOf(perro) === animal); // true
console.log(animal.isPrototypeOf(perro)); // true (se explica en 4.5.8)
```

**Sin prototipo:**

```js
const diccionario = Object.create(null);

diccionario.nombre = "Ana";

console.log(diccionario.nombre); // "Ana"
console.log(diccionario.toString); // undefined ✅ no hereda nada
console.log(Object.getPrototypeOf(diccionario)); // null
```

**Equivalencias:**

```js
const a = {};
const b = Object.create(Object.prototype);

console.log(Object.getPrototypeOf(a) === Object.getPrototypeOf(b)); // true
```

`{}` es equivalente a `Object.create(Object.prototype)`.

**Con descriptores (avanzado, 4.8):** `Object.create` acepta un segundo argumento con descriptores de propiedades.

```js
const obj = Object.create(Object.prototype, {
  nombre: {
    value: "Ana",
    writable: true,
    enumerable: true,
    configurable: true,
  },
});

console.log(obj.nombre); // "Ana"
```

### 4.5.5 El final de la cadena: `Object.prototype`

Casi todos los objetos heredan de `Object.prototype`. Allí viven métodos que usas todo el tiempo:

```js
const obj = { nombre: "Ana" };

console.log(obj.toString()); // "[object Object]"
console.log(obj.hasOwnProperty("nombre")); // true
console.log(obj.valueOf() === obj); // true
```

Otros métodos de `Object.prototype`:

- `toString()`
- `toLocaleString()`
- `valueOf()`
- `hasOwnProperty()`
- `isPrototypeOf()`
- `propertyIsEnumerable()`

```js
const proto = { a: 1 };
const obj = Object.create(proto);

console.log(proto.isPrototypeOf(obj)); // true
console.log(obj.propertyIsEnumerable("a")); // false (a es heredada)
```

`propertyIsEnumerable(clave)` devuelve `true` solo si la propiedad es **propia** y **enumerable**.

**Sobrescribir `toString`:**

```js
const persona = {
  nombre: "Ana",
  toString: function () {
    return "Persona: " + this.nombre;
  },
};

console.log(String(persona)); // "Persona: Ana"
console.log(persona.toString()); // "Persona: Ana"
```

> 🧠 `String(obj)` llama a `obj.toString()` si existe. Es una convención del lenguaje, no magia.

**El final:**

```js
console.log(Object.getPrototypeOf(Object.prototype)); // null
```

Ese `null` es lo que detiene la búsqueda.

### 4.5.6 Propiedades propias vs heredadas

- **Propia:** está en el objeto mismo.
- **Heredada:** está en algún punto de su cadena de prototipos.

```js
const proto = { heredada: true };
const obj = Object.create(proto);
obj.propia = true;

console.log(obj.propia); // true
console.log(obj.heredada); // true

console.log(Object.hasOwn(obj, "propia")); // true
console.log(Object.hasOwn(obj, "heredada")); // false
```

**`in` mira toda la cadena:**

```js
console.log("propia" in obj); // true
console.log("heredada" in obj); // true
console.log("toString" in obj); // true ← heredada de Object.prototype
```

**`Object.keys` solo devuelve propias y enumerables:**

```js
console.log(Object.keys(obj)); // ["propia"]
```

**`for...in` incluye heredadas enumerables:**

```js
for (const clave in obj) {
  console.log(clave); // "propia", "heredada"
}
```

Por eso en el Módulo 3 te recomendé evitar `for...in` salvo en casos controlados.

### 4.5.7 Shadowing

Si un objeto define una propiedad con el mismo nombre que una heredada, la propia **oculta** (hace *shadow*) a la heredada.

```js
const proto = { color: "rojo" };
const obj = Object.create(proto);

console.log(obj.color); // "rojo" (heredada)

obj.color = "azul"; // crea una propiedad propia
console.log(obj.color); // "azul" ✅

console.log(Object.hasOwn(obj, "color")); // true
console.log(proto.color); // "rojo" ✅ el prototipo no cambió
```

Si eliminas la propia, vuelve a verse la heredada:

```js
delete obj.color;
console.log(obj.color); // "rojo"
```

**Shadowing de métodos:**

```js
const proto = {
  saludar: function () {
    return "Hola desde el prototipo";
  },
};

const obj = Object.create(proto);

console.log(obj.saludar()); // "Hola desde el prototipo"

obj.saludar = function () {
  return "Hola desde el objeto";
};

console.log(obj.saludar()); // "Hola desde el objeto"
console.log(proto.saludar()); // "Hola desde el prototipo" ✅
```

### 4.5.8 `isPrototypeOf` y `Object.hasOwn`

`proto.isPrototypeOf(obj)` devuelve `true` si `proto` está en la cadena de `obj`.

```js
const abuelo = {};
const padre = Object.create(abuelo);
const hijo = Object.create(padre);

console.log(abuelo.isPrototypeOf(hijo)); // true
console.log(padre.isPrototypeOf(hijo)); // true
console.log(hijo.isPrototypeOf(padre)); // false
```

`Object.hasOwn(obj, clave)` comprueba solo propiedades propias (Módulo 3).

```js
const proto = { a: 1 };
const obj = Object.create(proto);
obj.b = 2;

console.log(Object.hasOwn(obj, "a")); // false
console.log(Object.hasOwn(obj, "b")); // true
```

**Diferencia con `instanceof` (vista previa de 4.6.5):** `instanceof` comprueba si `Fn.prototype` está en la cadena; `isPrototypeOf` comprueba si un objeto cualquiera está en la cadena.

### 4.5.9 `Object.create(null)`

Un objeto sin prototipo es un **diccionario puro**: no hereda `toString`, `hasOwnProperty`, `constructor` ni nada.

```js
const diccionario = Object.create(null);

diccionario.apple = 1;
diccionario["toString"] = "valor normal";

console.log(diccionario.toString); // "valor normal" ✅
console.log("hasOwnProperty" in diccionario); // false
console.log(Object.hasOwn(diccionario, "apple")); // true
```

**¿Para qué sirve?**

- Guardar datos con claves arbitrarias sin colisiones con el prototipo.
- Evitar *prototype pollution* al fusionar datos externos.
- Implementar mapas antes de que existiera `Map`.

```js
// ⚠️ Con un objeto normal, "constructor" puede chocar
const normal = {};
normal["constructor"] = "algo";
console.log(normal.constructor); // "algo" (propia), pero antes era una función

// ✅ Con Object.create(null) no hay herencia
const limpio = Object.create(null);
limpio["constructor"] = "algo";
console.log(limpio.constructor); // "algo"
```

> 📌 En el Módulo 3 viste `Map` como alternativa moderna. `Object.create(null)` sigue siendo útil cuando una API espera un objeto normal y las claves pueden ser arbitrarias.

### 4.5.10 `__proto__` y *prototype pollution*

`__proto__` es un accesor heredado de `Object.prototype`. Leerlo o asignarlo cambia el prototipo.

```js
const usuario = {};

usuario["__proto__"] = { admin: true };

console.log(usuario.admin); // true ⚠️
console.log(Object.getPrototypeOf(usuario) === Object.prototype); // false
```

Esto es peligroso cuando se fusionan datos que vienen de fuera. Un atacante puede enviar un objeto con una clave `__proto__` y modificar el prototipo de todos los objetos.

```js
// ❌ Fusión ingenua de datos externos
function fusionar(destino, fuente) {
  for (const clave in fuente) {
    destino[clave] = fuente[clave];
  }
  return destino;
}

const config = {};
const entrada = Object.create(null);
entrada["__proto__"] = { admin: true };

fusionar(config, entrada);
console.log(config.admin); // true ⚠️ prototype pollution
```

**Defensas:**

- No fusiones objetos de fuentes no confiables con bucles ingenuos.
- Usa `Object.hasOwn` para copiar solo propiedades propias.
- Usa `Object.create(null)` para diccionarios.
- Evita `__proto__` en el código.

```js
// ✅ Copia solo propiedades propias y enumerables
function fusionarSeguro(destino, fuente) {
  for (const clave of Object.keys(fuente)) {
    if (clave === "__proto__") continue;
    destino[clave] = fuente[clave];
  }
  return destino;
}

const config = {};
const entrada = Object.create(null);
entrada["__proto__"] = { admin: true };

fusionarSeguro(config, entrada);
console.log(config.admin); // undefined ✅
```

> 📌 El spread `{ ...fuente }` crea una propiedad propia llamada `__proto__` y **no** contamina el prototipo. `Object.assign`, en cambio, usa la asignación normal y **sí** puede disparar el setter de `__proto__`. La regla sigue siendo: **no confíes en datos externos**.

### 4.5.11 `for...in` vs `Object.keys`

| Herramienta | Propias | Heredadas | Enumerables | Devuelve |
|---|---|---|---|---|
| `for...in` | Sí | Sí | Solo enumerables | Claves |
| `Object.keys` | Sí | No | Solo enumerables | Array de claves |
| `Object.getOwnPropertyNames` | Sí | No | Todas | Array de claves |
| `Object.entries` | Sí | No | Solo enumerables | Array de pares |

```js
const proto = { heredada: true };
const obj = Object.create(proto);
obj.propia = true;

console.log(Object.keys(obj)); // ["propia"]
console.log(Object.getOwnPropertyNames(obj)); // ["propia"]

for (const clave in obj) {
  console.log(clave); // "propia", "heredada"
}
```

**Regla:** usa `Object.keys/values/entries` y `Object.hasOwn`. Reserva `for...in` para casos muy controlados.

`Object.getOwnPropertyNames(obj)` es como `Object.keys`, pero incluye también las propiedades **no enumerables**. Por eso en una clase devuelve `constructor` y los métodos del prototipo.

### 4.5.12 Rendimiento y buenas prácticas

- **No cambies el prototipo después de crear el objeto.** `Object.setPrototypeOf` es lento.
- **Cadenas largas son más lentas.** Cada propiedad que no está en el objeto recorre la cadena.
- **Los métodos compartidos ahorran memoria.** Definirlos en el prototipo evita una copia por instancia.
- **No modifiques prototipos nativos.** `Array.prototype.miMetodo = ...` afecta a todo el programa y puede romper librerías.
- **Usa `Object.create(null)` para diccionarios.**
- **Prefiere `Object.hasOwn` a `obj.hasOwnProperty`.**

```js
// ❌ Nunca hagas esto en una aplicación
Array.prototype.ultimo = function () {
  return this[this.length - 1];
};

// ✅ Mejor: una función normal
function ultimo(array) {
  return array[array.length - 1];
}
```

> 📌 Modificar prototipos nativos se llama *monkey patching*. Puede ser tentador, pero contamina el entorno global y causa conflictos entre librerías.

### ✅ Haz esto / ❌ Evita esto (4.5)

```js
// ✅ Object.getPrototypeOf para leer el prototipo
Object.getPrototypeOf(obj);

// ✅ Object.create para crear con un prototipo concreto
const hijo = Object.create(padre);

// ✅ Object.create(null) para diccionarios
const dict = Object.create(null);

// ✅ Object.hasOwn para propiedades propias
Object.hasOwn(obj, "clave");

// ✅ Object.keys/entries para recorrer objetos
for (const [clave, valor] of Object.entries(obj)) { /* ... */ }

// ❌ Cambiar el prototipo después de crear el objeto
Object.setPrototypeOf(obj, otro); // lento

// ❌ Usar __proto__ en código nuevo
obj.__proto__ = otro;

// ❌ Fusionar datos externos con for...in
for (const k in externo) destino[k] = externo[k];

// ❌ Modificar prototipos nativos
Array.prototype.miMetodo = function () {};

// ❌ Confundir propiedades propias con heredadas
obj.toString; // existe, pero no es propia
```

---

## 4.6 — Constructores y `new`

### 4.6.1 Función constructora

Cualquier función normal puede usarse como **constructora** con `new`. Por convención, su nombre empieza con mayúscula.

```js
function Persona(nombre, edad) {
  this.nombre = nombre;
  this.edad = edad;
}

const ana = new Persona("Ana", 30);

console.log(ana.nombre); // "Ana"
console.log(ana.edad); // 30
```

`new Persona("Ana", 30)` crea un objeto nuevo, y dentro de `Persona` ese objeto es `this`. Las asignaciones `this.nombre = ...` crean propiedades propias del objeto.

```js
console.log(Object.hasOwn(ana, "nombre")); // true
console.log(ana instanceof Persona); // true
```

### 4.6.2 Los cuatro pasos de `new`

Cuando ejecutas `new Fn(args)`, JavaScript hace esto:

1. **Crea un objeto vacío.**
2. **Le asigna como prototipo `Fn.prototype`.**
3. **Ejecuta `Fn` con `this` = ese objeto** y le pasa los argumentos.
4. **Devuelve ese objeto**, salvo que `Fn` devuelva otro objeto.

Puedes simularlo a mano:

```js
function Persona(nombre) {
  this.nombre = nombre;
}

Persona.prototype.saludar = function () {
  return "Hola, " + this.nombre;
};

function crearConNew(Fn, ...args) {
  // 1. Objeto vacío con el prototipo de Fn
  const obj = Object.create(Fn.prototype);

  // 2. Ejecutar Fn con this = obj
  const resultado = Fn.apply(obj, args);

  // 3. Devolver el objeto, salvo que Fn devuelva otro objeto o función
  if (
    (typeof resultado === "object" && resultado !== null) ||
    typeof resultado === "function"
  ) {
    return resultado;
  }

  return obj;
}

const ana = crearConNew(Persona, "Ana");

console.log(ana.nombre); // "Ana"
console.log(ana.saludar()); // "Hola, Ana"
console.log(ana instanceof Persona); // true
```

Esta simulación es exactamente lo que hace `new` (con matices de `new.target` y funciones especiales).

### 4.6.3 `prototype` y `constructor`

Toda función normal tiene una propiedad llamada `prototype`, que es un objeto.

```js
function Persona(nombre) {
  this.nombre = nombre;
}

console.log(typeof Persona.prototype); // "object"
console.log(Persona.prototype.constructor === Persona); // true
```

- `Persona.prototype` es el objeto que será el prototipo de las instancias.
- `Persona.prototype.constructor` apunta de vuelta a `Persona`.
- La instancia **no** tiene una propiedad `constructor` propia; la hereda.

```js
const ana = new Persona("Ana");

console.log(Object.getPrototypeOf(ana) === Persona.prototype); // true
console.log(ana.constructor === Persona); // true (heredado)
console.log(Object.hasOwn(ana, "constructor")); // false
```

**`constructor` no es magia:** es una propiedad normal que puede sobrescribirse o perderse.

```js
function Otra() {}

Otra.prototype = {
  saludar: function () { return "hola"; },
};

console.log(Otra.prototype.constructor === Otra); // false ⚠️
```

Al reemplazar todo el objeto `prototype`, la propiedad `constructor` desaparece. Si la necesitas, vuelve a asignarla:

```js
Otra.prototype.constructor = Otra;
```

> 🧠 En código moderno casi nunca usarás `constructor` para lógica. Es útil para depuración y para algunas librerías.

### 4.6.4 Métodos compartidos

**Mal:** definir métodos dentro del constructor crea una función nueva por cada instancia.

```js
function Persona(nombre) {
  this.nombre = nombre;

  this.saludar = function () {
    return "Hola, " + this.nombre;
  };
}

const a = new Persona("Ana");
const b = new Persona("Luis");

console.log(a.saludar === b.saludar); // false ⚠️ dos funciones distintas
```

**Bien:** definir el método una vez en `prototype`.

```js
function Persona(nombre) {
  this.nombre = nombre;
}

Persona.prototype.saludar = function () {
  return "Hola, " + this.nombre;
};

const a = new Persona("Ana");
const b = new Persona("Luis");

console.log(a.saludar === b.saludar); // true ✅ la misma función
console.log(a.saludar()); // "Hola, Ana"
console.log(b.saludar()); // "Hola, Luis"
```

**Propiedades propias vs métodos heredados:**

```js
console.log(Object.keys(a)); // ["nombre"] ← solo datos propios
console.log(Object.hasOwn(a, "saludar")); // false ← el método es heredado
console.log("saludar" in a); // true
```

**Métodos enumerables:** al asignar con `=` en `prototype`, el método queda **enumerable** y aparece en `for...in`.

```js
for (const clave in a) {
  console.log(clave); // "nombre", "saludar"
}
```

Si no quieres que aparezca, usa `Object.defineProperty` (4.8) o una clase (4.7), cuyos métodos son no enumerables.

### 4.6.5 `instanceof`

`objeto instanceof Fn` devuelve `true` si `Fn.prototype` está en la cadena de prototipos de `objeto`.

```js
function Animal(nombre) {
  this.nombre = nombre;
}

const perro = new Animal("Toby");

console.log(perro instanceof Animal); // true
console.log(perro instanceof Object); // true
console.log(perro instanceof Array); // false
```

**Cómo funciona por dentro (simplificado):**

```js
function esInstancia(obj, Fn) {
  let proto = Object.getPrototypeOf(obj);

  while (proto !== null) {
    if (proto === Fn.prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }

  return false;
}

console.log(esInstancia(perro, Animal)); // true
console.log(esInstancia(perro, Array)); // false
```

**Con `Object.create`:**

```js
function F() {}

const obj = Object.create(F.prototype);

console.log(obj instanceof F); // true ✅ aunque no se llamó a new
```

**Limitaciones:**

- No funciona con primitivos: `"hola" instanceof String` es `false`.
- Puede fallar entre *realms* (por ejemplo, un iframe con otro `Array.prototype`).
- Si reasignas `Fn.prototype`, las instancias antiguas dejan de ser `instanceof`.

```js
function F() {}
const viejo = new F();

F.prototype = {};

console.log(viejo instanceof F); // false ⚠️
```

### 4.6.6 Qué devuelve `new`

Si el constructor devuelve un **primitivo**, se ignora y se devuelve el objeto nuevo.

```js
function Persona(nombre) {
  this.nombre = nombre;
  return 42; // ignorado
}

const ana = new Persona("Ana");
console.log(ana.nombre); // "Ana"
console.log(ana instanceof Persona); // true
```

Si devuelve un **objeto**, ese objeto reemplaza al nuevo.

```js
function Persona(nombre) {
  this.nombre = nombre;
  return { otro: true };
}

const resultado = new Persona("Ana");

console.log(resultado.nombre); // undefined ⚠️
console.log(resultado.otro); // true
console.log(resultado instanceof Persona); // false
```

**Regla:** no devuelvas objetos desde un constructor salvo que sepas exactamente lo que haces. Devuelve `this` o nada.

### 4.6.7 `new.target`

`new.target` es una expresión especial que vale la función que se está construyendo si se llamó con `new`, y `undefined` si se llamó sin `new`.

```js
function Persona(nombre) {
  if (!new.target) {
    return new Persona(nombre); // corrige el olvido de new
  }

  this.nombre = nombre;
}

const a = Persona("Ana"); // sin new
const b = new Persona("Luis"); // con new

console.log(a.nombre); // "Ana"
console.log(b.nombre); // "Luis"
console.log(a instanceof Persona); // true
```

**En clases**, `new.target` permite saber si se está construyendo una subclase:

```js
class Animal {
  constructor() {
    console.log("Construyendo:", new.target.name);
  }
}

class Perro extends Animal {}

new Animal(); // "Construyendo: Animal"
new Perro(); // "Construyendo: Perro"
```

`new.target` es la forma estándar de detectar si una función se usó como constructora.

### 4.6.8 Errores comunes

**1. Olvidar `new`:**

```js
function Persona(nombre) {
  this.nombre = nombre;
}

// En modo estricto:
// Persona("Ana"); // ❌ TypeError: Cannot set properties of undefined

// En modo no estricto: contamina el objeto global
Persona("Ana");
console.log(globalThis.nombre); // "Ana" ⚠️
```

**2. Definir métodos dentro del constructor:** crea una función por instancia (4.6.4).

**3. Reasignar `prototype` después de crear instancias:**

```js
function F() {}
const viejo = new F();

F.prototype = { nuevo: true };
const nuevo = new F();

console.log(viejo.nuevo); // undefined ⚠️
console.log(nuevo.nuevo); // true
```

**4. Usar una arrow como constructora:**

```js
const Persona = () => {};

// new Persona(); // ❌ TypeError: Persona is not a constructor
```

**5. Usar un método abreviado como constructora:**

```js
const metodos = {
  crear: function () {},
};

// new metodos.crear(); // funciona (es función normal)
// Pero un método abreviado no:
const obj = {
  crear() {},
};

// new obj.crear(); // ❌ TypeError: obj.crear is not a constructor
```

**6. Perder la propiedad `constructor` al reasignar `prototype`** (4.6.3).

**7. Usar `new` con funciones incorporadas que no lo necesitan:**

```js
// ❌ new String crea un objeto, no un string primitivo
const s = new String("hola");
console.log(typeof s); // "object" ⚠️
console.log(s === "hola"); // false

// ✅
const s2 = String("hola");
console.log(typeof s2); // "string"
```

### 4.6.9 Fábrica vs constructor

Una **fábrica** es una función que devuelve un objeto, sin `new` ni `this`.

```js
function crearPersona(nombre, edad) {
  return {
    nombre: nombre,
    edad: edad,
    saludar: function () {
      return "Hola, " + nombre; // closure, no this
    },
  };
}

const ana = crearPersona("Ana", 30);

console.log(ana.saludar()); // "Hola, Ana"
```

**Ventajas de la fábrica:**

- No hay que recordar `new`.
- No hay `this` que perder.
- Privacidad fácil con closures.
- Composición sencilla.

**Desventajas:**

- Cada objeto tiene su propia copia de los métodos (más memoria).
- No hay `instanceof` útil.
- No encaja con APIs que esperan clases.

**Constructor/clase:**

```js
function Persona(nombre, edad) {
  this.nombre = nombre;
  this.edad = edad;
}

Persona.prototype.saludar = function () {
  return "Hola, " + this.nombre;
};

const ana = new Persona("Ana", 30);
```

**Ventajas:**

- Métodos compartidos en el prototipo.
- `instanceof` funciona.
- Encaja con frameworks y con `extends`.

**Desventajas:**

- `this` puede perderse.
- `new` puede olvidarse.
- Más ceremonia.

**Tabla comparativa:**

| Criterio | Fábrica | Constructor / clase |
|---|---|---|
| `new` | No | Sí |
| `this` | No | Sí |
| Métodos compartidos | No (salvo que los pongas fuera) | Sí (prototype) |
| `instanceof` | No | Sí |
| Privacidad | Closure | `#` o `WeakMap` |
| Memoria | Más por instancia | Menos |
| Composición | Muy fácil | Posible, más ceremonia |

**Regla práctica:**

- Datos + comportamiento con identidad y herencia → clase.
- Objetos simples, configuraciones, utilidades → fábrica u objeto literal.
- Privacidad y composición → closure o fábrica.

### ✅ Haz esto / ❌ Evita esto (4.6)

```js
// ✅ Métodos en el prototipo
function Persona(nombre) {
  this.nombre = nombre;
}

Persona.prototype.saludar = function () {
  return "Hola, " + this.nombre;
};

// ✅ new.target para detectar el olvido de new
function PersonaSegura(nombre) {
  if (!new.target) {
    return new PersonaSegura(nombre);
  }
  this.nombre = nombre;
}

// ✅ Fábrica cuando no necesitas instanceof
function crearUsuario(nombre) {
  return { nombre };
}

// ✅ Clase cuando hay estado y herencia
class Usuario {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

// ❌ Métodos dentro del constructor (una función por instancia)
function PersonaMala(nombre) {
  this.nombre = nombre;
  this.saludar = function () {
    return "Hola, " + this.nombre;
  };
}

// ❌ Olvidar new en modo estricto
// Persona("Ana"); // TypeError en modo estricto

// ❌ Reasignar prototype después de crear instancias
function F() {}
const vieja = new F();
F.prototype = {};

// ❌ Arrow como constructora
const Flecha = () => {};

// ❌ Devolver un objeto desde el constructor sin querer
function ConstructorRaro() {
  this.x = 1;
  return { otro: true };
}

// ❌ new String / new Number / new Boolean
const textoEnvoltorio = new String("hola");
```

---

## 4.7 — Clases

Las clases son la forma moderna de crear constructores y jerarquías. Por dentro usan prototipos, pero la sintaxis es más clara y segura.

### 4.7.1 Sintaxis

```js
class Persona {
  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
  }

  saludar() {
    return "Hola, " + this.nombre;
  }
}

const ana = new Persona("Ana", 30);

console.log(ana.saludar()); // "Hola, Ana"
console.log(ana instanceof Persona); // true
console.log(typeof Persona); // "function"
```

**Detalles importantes:**

- Una clase **no se puede llamar sin `new`**.
- Las clases **no se hoistean** como las funciones: hay una zona muerta temporal (TDZ).
- El cuerpo de una clase es **siempre estricto**, aunque el archivo no lo sea.
- Los métodos son **no enumerables**.

```js
// console.log(new Antes()); // ❌ ReferenceError (TDZ)
class Antes {}

// Persona("Ana"); // ❌ TypeError: Class constructor Persona cannot be invoked without 'new'
```

**Expresión de clase:**

```js
const Persona = class {
  constructor(nombre) {
    this.nombre = nombre;
  }
};

console.log(new Persona("Ana").nombre); // "Ana"
```

**Nombre interno:**

```js
const P = class Persona {
  quienSoy() {
    return Persona.name; // el nombre existe dentro de la clase
  }
};

console.log(new P().quienSoy()); // "Persona"
// console.log(Persona); // ❌ ReferenceError fuera de la clase
```

### 4.7.2 Constructor

El método `constructor` se ejecuta al usar `new`.

```js
class Producto {
  constructor(nombre, precio) {
    this.nombre = nombre;
    this.precio = precio;
  }
}

const teclado = new Producto("Teclado", 50);

console.log(teclado.nombre); // "Teclado"
console.log(teclado.precio); // 50
```

Si no defines `constructor`, se usa uno vacío implícito.

```js
class Vacia {}

const v = new Vacia();
console.log(v instanceof Vacia); // true
```

**No puedes llamar al constructor como función:**

```js
class Persona {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

// Persona("Ana"); // ❌ TypeError
```

### 4.7.3 Métodos de instancia

Los métodos definidos en el cuerpo de la clase viven en `Clase.prototype`, no en cada instancia.

```js
class Persona {
  constructor(nombre) {
    this.nombre = nombre;
  }

  saludar() {
    return "Hola, " + this.nombre;
  }
}

const a = new Persona("Ana");
const b = new Persona("Luis");

console.log(a.saludar === b.saludar); // true ✅ compartido
console.log(Object.hasOwn(a, "saludar")); // false ✅ heredado
console.log(Object.getPrototypeOf(a) === Persona.prototype); // true
```

**Los métodos son no enumerables:**

```js
console.log(Object.keys(Persona.prototype)); // []
console.log(Object.getOwnPropertyNames(Persona.prototype)); // ["constructor", "saludar"]
```

Esto evita que `for...in` recorra métodos, a diferencia de asignarlos a mano en `prototype`.

**`this` en los métodos:**

```js
const saludar = a.saludar;

// saludar(); // ❌ TypeError: Cannot read properties of undefined
```

Los métodos de clase también pierden `this` si se desacoplan. Se arregla con `bind` o con un campo arrow (4.7.4).

### 4.7.4 Campos de instancia

Puedes declarar campos directamente en el cuerpo de la clase. Se inicializan **por instancia**.

```js
class Contador {
  total = 0;
  activo = true;

  incrementar() {
    this.total += 1;
    return this.total;
  }
}

const c1 = new Contador();
const c2 = new Contador();

c1.incrementar();

console.log(c1.total); // 1
console.log(c2.total); // 0 ✅ cada instancia tiene su campo
console.log(Object.hasOwn(c1, "total")); // true
```

**Campos con arrow capturan `this`:**

```js
class Boton {
  constructor(texto) {
    this.texto = texto;
  }

  alHacerClic = () => {
    return "Clic en " + this.texto;
  };
}

const boton = new Boton("Guardar");
const handler = boton.alHacerClic;

console.log(handler()); // "Clic en Guardar" ✅
```

El campo arrow se crea **por instancia** y captura el `this` de esa instancia. Es la forma moderna de tener handlers sin `bind`.

> ⚠️ Cada instancia tiene su propia función arrow, así que gasta más memoria que un método normal. Úsalo solo para métodos que se pasan como callback.

**Campos sin inicializador:**

```js
class Usuario {
  nombre;
  edad;
}

const u = new Usuario();
console.log(u.nombre); // undefined
console.log(Object.hasOwn(u, "nombre")); // true
```

El campo existe con valor `undefined`, a diferencia de no declararlo.

### 4.7.5 `static`

Los miembros `static` pertenecen a la **clase**, no a las instancias.

```js
class Matematicas {
  static PI = 3.1416;

  static sumar(a, b) {
    return a + b;
  }
}

console.log(Matematicas.sumar(2, 3)); // 5
console.log(Matematicas.PI); // 3.1416

const m = new Matematicas();
console.log(m.sumar); // undefined ⚠️
```

**`this` en un método estático es la clase:**

```js
class Fabrica {
  static crear(nombre) {
    return new this(nombre);
  }

  constructor(nombre) {
    this.nombre = nombre;
  }
}

console.log(Fabrica.crear("Ana").nombre); // "Ana"
```

`new this(...)` usa la clase que llamó al método. Si una subclase hereda `crear`, `this` será la subclase.

**Los estáticos se heredan:**

```js
class Animal {
  static reino() {
    return "Animalia";
  }
}

class Perro extends Animal {}

console.log(Perro.reino()); // "Animalia" ✅
```

**`this` en estáticos heredados apunta a la subclase:**

```js
class A {
  static quien() {
    return this.name;
  }
}

class B extends A {}

console.log(A.quien()); // "A"
console.log(B.quien()); // "B" ✅
```

**Métodos estáticos como utilidades:**

```js
class Validador {
  static esEmail(texto) {
    return texto.includes("@") && texto.includes(".");
  }

  static esNumero(valor) {
    return typeof valor === "number" && Number.isFinite(valor);
  }
}

console.log(Validador.esEmail("ana@mail.com")); // true
console.log(Validador.esNumero(42)); // true
```

### 4.7.6 Campos y métodos privados `#`

Un campo declarado con `#` es **realmente privado**: no se puede leer ni escribir desde fuera de la clase.

```js
class Cuenta {
  #saldo = 0;

  constructor(saldoInicial) {
    this.#saldo = saldoInicial;
  }

  get saldo() {
    return this.#saldo;
  }

  depositar(monto) {
    this.#saldo += monto;
    return this;
  }
}

const cuenta = new Cuenta(100);

console.log(cuenta.saldo); // 100
console.log(cuenta.depositar(50).saldo); // 150
// console.log(cuenta.#saldo); // ❌ SyntaxError: Private field '#saldo' must be declared in an enclosing class
```

**Métodos privados:**

```js
class Validador {
  #esPositivo(n) {
    return n > 0;
  }

  validar(n) {
    return this.#esPositivo(n);
  }
}

const v = new Validador();
console.log(v.validar(5)); // true
// v.#esPositivo(5); // ❌ SyntaxError
```

**Campos estáticos privados:**

```js
class Id {
  static #siguiente = 1;

  static generar() {
    return Id.#siguiente++;
  }
}

console.log(Id.generar()); // 1
console.log(Id.generar()); // 2
// console.log(Id.#siguiente); // ❌ SyntaxError
```

**Los privados no aparecen en `Object.keys` ni en `for...in`:**

```js
class Persona {
  #secreto = "1234";
  nombre = "Ana";
}

const p = new Persona();
console.log(Object.keys(p)); // ["nombre"]
```

**Brand check: `#campo in objeto` (ES2022)**

Sirve para comprobar si un objeto tiene ese campo privado, sin acceder a su valor.

```js
class Marca {
  #x = 1;

  static tiene(obj) {
    return #x in obj;
  }
}

console.log(Marca.tiene(new Marca())); // true
console.log(Marca.tiene({})); // false
```

**Privacidad con `#` vs `WeakMap` vs `_`:**

| Técnica | Privacidad real | Iterable | Memoria | Uso |
|---|---|---|---|---|
| `#campo` | Sí | No | En el objeto | Clases modernas |
| `WeakMap` | Sí | No | Fuera del objeto | Datos privados sin clases |
| `_campo` | No (convención) | Sí | En el objeto | Código antiguo |

```js
// ❌ _nombre es solo una convención
class Usuario {
  constructor(nombre) {
    this._nombre = nombre;
  }
}

const u = new Usuario("Ana");
console.log(u._nombre); // "Ana" ⚠️ accesible
```

> 📌 En el Módulo 3 usaste `WeakMap` para privacidad sin clases. Con clases, `#` es más directo.

### 4.7.7 Getters y setters en clases

```js
class Temperatura {
  #celsius = 0;

  constructor(celsius) {
    this.celsius = celsius; // usa el setter
  }

  get celsius() {
    return this.#celsius;
  }

  set celsius(valor) {
    if (typeof valor !== "number" || Number.isNaN(valor)) {
      return; // ignora valores inválidos
    }
    this.#celsius = valor;
  }

  get fahrenheit() {
    return this.#celsius * 9 / 5 + 32;
  }

  set fahrenheit(valor) {
    this.#celsius = (valor - 32) * 5 / 9;
  }
}

const t = new Temperatura(25);

console.log(t.celsius); // 25
console.log(t.fahrenheit); // 77

t.fahrenheit = 212;
console.log(t.celsius); // 100

t.celsius = "hola"; // ignorado
console.log(t.celsius); // 100
```

**Ventajas:**

- Validación centralizada.
- Propiedades calculadas.
- API más limpia que métodos `getX`/`setX`.

**Cuidado:** un getter no debería tener efectos secundarios costosos ni modificar el estado.

### 4.7.8 `extends` y `super`

Una clase puede heredar de otra con `extends`.

```js
class Animal {
  constructor(nombre) {
    this.nombre = nombre;
  }

  hablar() {
    return this.nombre + " hace un sonido";
  }
}

class Perro extends Animal {
  constructor(nombre, raza) {
    super(nombre); // llama al constructor del padre
    this.raza = raza;
  }

  hablar() {
    return super.hablar() + " (guau)";
  }
}

const toby = new Perro("Toby", "Labrador");

console.log(toby.hablar()); // "Toby hace un sonido (guau)"
console.log(toby.raza); // "Labrador"
console.log(toby instanceof Perro); // true
console.log(toby instanceof Animal); // true
```

**Reglas de `super`:**

- En una clase derivada, debes llamar a `super()` **antes de usar `this`**.
- Si no defines constructor en la subclase, se llama automáticamente al del padre con los mismos argumentos.
- `super.metodo()` llama al método del padre con el `this` actual.

```js
class Base {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

class Derivada extends Base {
  constructor(nombre) {
    // this.nombre = nombre; // ❌ ReferenceError: Must call super before accessing 'this'
    super(nombre);
    this.extra = true;
  }
}
```

**Constructor implícito:**

```js
class A {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

class B extends A {}

console.log(new B("Ana").nombre); // "Ana" ✅
```

**`super` en métodos estáticos:**

```js
class Animal {
  static reino() {
    return "Animalia";
  }
}

class Perro extends Animal {
  static reino() {
    return super.reino() + " / Canis";
  }
}

console.log(Perro.reino()); // "Animalia / Canis"
```

**`super` en un objeto literal:**

```js
const base = {
  saludar() {
    return "Hola desde base";
  },
};

const hijo = {
  saludar() {
    return super.saludar() + " y desde hijo";
  },
};

Object.setPrototypeOf(hijo, base);

console.log(hijo.saludar()); // "Hola desde base y desde hijo"
```

`super` en objetos literales funciona si el objeto tiene un prototipo. Es una técnica avanzada; en clases es donde más lo usarás.

### 4.7.9 Sobrescritura y `super.metodo()`

Una subclase puede reemplazar un método del padre.

```js
class Vehiculo {
  describir() {
    return "Soy un vehículo";
  }
}

class Coche extends Vehiculo {
  describir() {
    return "Soy un coche";
  }
}

console.log(new Coche().describir()); // "Soy un coche"
```

**Para extender en vez de reemplazar, usa `super`:**

```js
class Coche extends Vehiculo {
  describir() {
    return super.describir() + " de cuatro ruedas";
  }
}

console.log(new Coche().describir()); // "Soy un vehículo de cuatro ruedas"
```

**No uses `Vehiculo.prototype.describir.call(this)` en clases.** `super.describir()` es más claro y respeta la cadena.

```js
// ❌ Estilo antiguo
class Coche extends Vehiculo {
  describir() {
    return Vehiculo.prototype.describir.call(this) + " de cuatro ruedas";
  }
}

// ✅ Estilo moderno
class Coche2 extends Vehiculo {
  describir() {
    return super.describir() + " de cuatro ruedas";
  }
}
```

### 4.7.10 Orden de inicialización

El orden exacto importa cuando hay campos y herencia:

1. Se inicializan los campos de la clase base.
2. Se ejecuta el constructor de la base.
3. Se inicializan los campos de la clase derivada.
4. Se ejecuta el constructor de la derivada.

```js
const orden = [];

class Base {
  campoBase = (orden.push("campo base"), 1);

  constructor() {
    orden.push("constructor base");
  }
}

class Derivada extends Base {
  campoDerivada = (orden.push("campo derivada"), 2);

  constructor() {
    super();
    orden.push("constructor derivada");
  }
}

new Derivada();

console.log(orden);
// ["campo base", "constructor base", "campo derivada", "constructor derivada"]
```

**Consecuencia:** los campos de la derivada **no existen** hasta después de `super()`.

```js
class Base {
  constructor() {
    console.log(this.campoDerivada); // undefined ⚠️ todavía no se inicializó
  }
}

class Derivada extends Base {
  campoDerivada = 42;
}

new Derivada(); // undefined
```

No llames a métodos que dependan de campos de la subclase desde el constructor de la base.

### 4.7.11 Bloques estáticos

Un bloque `static { ... }` se ejecuta **una vez**, cuando se define la clase. Sirve para inicializaciones complejas de miembros estáticos.

```js
class Config {
  static modo = "dev";
  static debug;

  static {
    this.debug = this.modo !== "produccion";
  }
}

console.log(Config.debug); // true
```

**Orden:** los campos y bloques estáticos se ejecutan en el orden en que aparecen.

```js
class Orden {
  static primero = 1;

  static {
    console.log("bloque 1:", this.primero); // 1
    this.segundo = 2;
  }

  static tercero = 3;

  static {
    console.log("bloque 2:", this.segundo, this.tercero); // 2 3
  }
}

console.log(Orden.segundo); // 2
console.log(Orden.tercero); // 3
```

**Acceso a privados estáticos:**

```js
class Id {
  static #contador = 0;

  static {
    Id.#contador = 100;
  }

  static siguiente() {
    return Id.#contador++;
  }
}

console.log(Id.siguiente()); // 100
console.log(Id.siguiente()); // 101
```

### 4.7.12 Clases vs funciones constructoras

| Característica | Función constructora | Clase |
|---|---|---|
| Hoisting | Sí (como función) | No (TDZ) |
| Llamar sin `new` | Permitido (peligroso) | `TypeError` |
| Modo estricto interno | No por defecto | Sí siempre |
| Métodos en prototype | Enumerables si se asignan con `=` | No enumerables |
| `super` | No | Sí |
| Campos privados `#` | No | Sí |
| Campos de instancia | Manual en constructor | Declarativos |
| Bloques estáticos | No | Sí |
| `new.target` | Sí | Sí |
| `extends` | Manual con `Object.create` | Nativo |

**Ejemplo equivalente con función constructora:**

```js
function Persona(nombre) {
  this.nombre = nombre;
}

Persona.prototype.saludar = function () {
  return "Hola, " + this.nombre;
};

Persona.crear = function (nombre) {
  return new Persona(nombre);
};
```

**Con clase:**

```js
class Persona {
  constructor(nombre) {
    this.nombre = nombre;
  }

  saludar() {
    return "Hola, " + this.nombre;
  }

  static crear(nombre) {
    return new Persona(nombre);
  }
}
```

La clase es más clara y segura. Usa funciones constructoras solo si mantienes código antiguo.

### 4.7.13 Errores comunes con clases

**1. Olvidar `new`:**

```js
class Persona {}

// Persona(); // ❌ TypeError
```

**2. Usar `this` antes de `super()`:**

```js
class A {
  constructor() {}
}

class B extends A {
  constructor() {
    // this.x = 1; // ❌ ReferenceError
    super();
    this.x = 1;
  }
}
```

**3. Poner una arrow como método de prototipo esperando compartirla:**

```js
class Persona {
  // ❌ Esto es un campo, no un método de prototipo
  saludar = () => {
    return "Hola";
  };
}

const a = new Persona();
const b = new Persona();

console.log(a.saludar === b.saludar); // false ⚠️ cada instancia tiene la suya
```

**4. Acceder a un privado desde fuera:**

```js
class Cuenta {
  #saldo = 100;
}

const c = new Cuenta();
// console.log(c.#saldo); // ❌ SyntaxError
```

**5. Perder `this` al pasar un método como callback:**

```js
class Boton {
  constructor(texto) {
    this.texto = texto;
  }

  alHacerClic() {
    return this.texto;
  }
}

const b = new Boton("Guardar");
const handler = b.alHacerClic;

// handler(); // ❌ TypeError
```

**6. Usar `super` fuera de una clase o de un objeto con prototipo:**

```js
function f() {
  // super.metodo(); // ❌ SyntaxError
}
```

**7. Confundir `static` con campos de instancia:**

```js
class A {
  static valor = 1;
}

console.log(A.valor); // 1
console.log(new A().valor); // undefined ⚠️
```

**8. Extender clases incorporadas sin conocer sus peculiaridades:**

```js
class MiArray extends Array {}

const m = new MiArray(1, 2, 3);

console.log(m.length); // 3
console.log(m instanceof MiArray); // true
console.log(m instanceof Array); // true
```

Funciona, pero algunos métodos como `map` devuelven una instancia de `MiArray` por el mecanismo de *species*. Es un tema avanzado; no lo necesitas para este módulo.

### ✅ Haz esto / ❌ Evita esto (4.7)

```js
// ✅ Métodos normales para compartir en prototype
class Persona {
  saludar() {
    return this.nombre;
  }
}

// ✅ Campos privados # para estado interno
class Cuenta {
  #saldo = 0;
}

// ✅ static para utilidades y fábricas
// static crear(nombre) { return new this(nombre); }

// ✅ super() antes de this en clases derivadas
// super(nombre);

// ✅ super.metodo() para extender comportamiento
// return super.hablar() + "!";

// ✅ Campo arrow solo para handlers que se pasan como callback
// handleClick = () => { /* ... */ };

// ❌ Llamar a una clase sin new
Persona();

// ❌ Usar this antes de super
this.x = 1; // antes de super()

// ❌ Métodos dentro del constructor
this.saludar = function () {};

// ❌ Confundir static con instancia
A.valor; // static
new A().valor; // undefined

// ❌ Usar _campo creyendo que es privado
this._secreto = "1234";
```

---

## 4.8 — Getters, setters y descriptores

Hasta ahora has creado propiedades con `=`. Pero cada propiedad de un objeto tiene, además de su valor, una **ficha técnica** llamada **descriptor**. Los getters y setters son una forma de descriptor.

### 4.8.1 Getters y setters en objetos literales

Un **getter** es una función que se ejecuta al **leer** una propiedad. Un **setter** es una función que se ejecuta al **escribirla**.

```js
const persona = {
  nombre: "Ana",

  get saludo() {
    return "Hola, " + this.nombre;
  },

  set saludo(texto) {
    this.nombre = texto.replace("Hola, ", "");
  },
};

console.log(persona.saludo); // "Hola, Ana"

persona.saludo = "Hola, Luis";
console.log(persona.nombre); // "Luis"
```

Puntos clave:

- Se accede **como una propiedad normal**, sin paréntesis: `persona.saludo`, no `persona.saludo()`.
- El getter y el setter comparten el mismo nombre.
- `this` dentro del getter es el objeto desde el que se accede, igual que en un método.
- Puedes tener solo getter, solo setter, o ambos.

```js
const soloLectura = {
  get valor() {
    return 42;
  },
};

console.log(soloLectura.valor); // 42

// soloLectura.valor = 10; // en modo estricto: TypeError; en no estricto: se ignora
```

> ⚠️ Si defines solo un getter, la propiedad es de **solo lectura**. Si defines solo un setter, leerla devuelve `undefined`.

```js
const soloEscritura = {
  set dato(v) {
    this._dato = v;
  },
};

soloEscritura.dato = 5;

console.log(soloEscritura._dato); // 5
console.log(soloEscritura.dato); // undefined ⚠️ no hay getter
```

### 4.8.2 Propiedades calculadas

Un getter puede calcular su valor a partir de otras propiedades. El valor **no se guarda**: se recalcula en cada lectura.

```js
const rectangulo = {
  ancho: 4,
  alto: 3,

  get area() {
    return this.ancho * this.alto;
  },

  get perimetro() {
    return 2 * (this.ancho + this.alto);
  },
};

console.log(rectangulo.area); // 12
console.log(rectangulo.perimetro); // 14

rectangulo.ancho = 10;

console.log(rectangulo.area); // 30 ✅ se recalculó
```

Esto es útil cuando el valor derivado debe estar siempre coherente con el estado. No hay dos fuentes de verdad.

**Cuidado con el coste:** si el cálculo es caro (recorrer mil elementos, ordenar), un getter lo repite en cada acceso. En ese caso conviene un método explícito o guardar el resultado y recalcularlo solo cuando cambie el estado.

```js
// ⚠️ Getter caro: se ejecuta en cada lectura
const lista = {
  datos: [5, 1, 9, 3],
  get ordenados() {
    return Array.from(this.datos).sort((a, b) => a - b);
  },
};

console.log(lista.ordenados); // [1, 3, 5, 9]
console.log(lista.ordenados); // [1, 3, 5, 9] ← vuelve a ordenar
```

```js
// ✅ Método explícito: deja claro que hay trabajo
const lista2 = {
  datos: [5, 1, 9, 3],
  ordenar() {
    return Array.from(this.datos).sort((a, b) => a - b);
  },
};
```

> 🧠 Regla: un getter debe ser **barato y sin efectos secundarios**. Si tarda o modifica algo, no debería ser un getter.

### 4.8.3 Getters y setters con validación

El uso más valioso de un setter es **centralizar la validación**. Así ningún código externo puede dejar el objeto en un estado inválido.

```js
const cuenta = {
  _saldo: 0,

  get saldo() {
    return this._saldo;
  },

  set saldo(valor) {
    if (typeof valor !== "number" || Number.isNaN(valor)) {
      return; // ignora valores que no son números
    }
    if (valor < 0) {
      return; // ignora negativos
    }
    this._saldo = valor;
  },
};

cuenta.saldo = 100;
console.log(cuenta.saldo); // 100

cuenta.saldo = -50;
console.log(cuenta.saldo); // 100 ✅ no cambió

cuenta.saldo = "mucho";
console.log(cuenta.saldo); // 100 ✅ no cambió
```

**Alternativa: lanzar un error.** En el Módulo 5 verás `throw` y `try/catch` básicos; el Módulo 7 profundiza en el manejo de errores. Por ahora, ignorar el valor inválido es suficiente para practicar.

**El guion bajo `_saldo` es una convención**, no privacidad real. Cualquiera puede leer `cuenta._saldo` desde fuera. En 4.7.6 viste que `#saldo` en clases sí es privado.

```js
console.log(cuenta._saldo); // 100 ⚠️ accesible: el guion bajo solo avisa
```

### 4.8.4 Descriptores de propiedad

Cada propiedad propia tiene un **descriptor**: un objeto que describe cómo se comporta.

```js
const persona = { nombre: "Ana" };

console.log(Object.getOwnPropertyDescriptor(persona, "nombre"));
// { value: "Ana", writable: true, enumerable: true, configurable: true }
```

Los cuatro atributos:

| Atributo | Significado |
|---|---|
| `value` | El valor de la propiedad |
| `writable` | ¿Se puede cambiar con `=`? |
| `enumerable` | ¿Aparece en `Object.keys`, `for...in` y spread? |
| `configurable` | ¿Se puede borrar o redefinir? |

Cuando creas una propiedad con `=`, los tres atributos booleanos son `true`.

```js
const obj = { a: 1 };

const descriptor = Object.getOwnPropertyDescriptor(obj, "a");

console.log(descriptor.value); // 1
console.log(descriptor.writable); // true
console.log(descriptor.enumerable); // true
console.log(descriptor.configurable); // true
```

**Los getters y setters usan otro tipo de descriptor**, llamado **accessor descriptor**, con `get` y `set` en lugar de `value` y `writable`.

```js
const obj = {
  get x() {
    return 1;
  },
};

const descriptor = Object.getOwnPropertyDescriptor(obj, "x");

console.log(typeof descriptor.get); // "function"
console.log(descriptor.set); // undefined
console.log(descriptor.enumerable); // true
console.log(descriptor.configurable); // true
console.log("value" in descriptor); // false
```

### 4.8.5 `Object.defineProperty`

`Object.defineProperty(objeto, clave, descriptor)` crea o redefine una propiedad con control total.

```js
const usuario = {};

Object.defineProperty(usuario, "id", {
  value: 42,
  writable: false,
  enumerable: true,
  configurable: false,
});

console.log(usuario.id); // 42

usuario.id = 99; // ignorado (en estricto: TypeError)
console.log(usuario.id); // 42 ✅
```

**Los valores por defecto de `defineProperty` son `false`**, no `true`. Esto sorprende a mucha gente.

```js
const obj = {};

Object.defineProperty(obj, "x", { value: 1 });

console.log(Object.getOwnPropertyDescriptor(obj, "x"));
// { value: 1, writable: false, enumerable: false, configurable: false }
```

Consecuencias:

```js
const obj = {};

Object.defineProperty(obj, "oculto", { value: 1 });
obj.visible = 2;

console.log(obj.oculto); // 1 ✅ se puede leer
console.log(Object.keys(obj)); // ["visible"] ← no aparece
console.log("oculto" in obj); // true ← sí existe

for (const clave in obj) {
  console.log(clave); // solo "visible"
}

const copia = { ...obj };
console.log(copia); // { visible: 2 } ← el spread no copia no enumerables
```

> ⚠️ `enumerable: false` **no es privacidad**. La propiedad sigue siendo accesible; solo se oculta de ciertas operaciones de recorrido.

**`configurable: false` impide borrar o redefinir:**

```js
const obj = {};

Object.defineProperty(obj, "fijo", {
  value: 1,
  configurable: false,
});

delete obj.fijo; // ignorado (en estricto: TypeError)
console.log(obj.fijo); // 1 ✅

// Object.defineProperty(obj, "fijo", { value: 2 }); // ❌ TypeError: Cannot redefine property
```

La única excepción: si `writable` es `true` y `configurable` es `false`, sí puedes cambiar `value` y poner `writable: false`.

```js
const obj = {};

Object.defineProperty(obj, "x", {
  value: 1,
  writable: true,
  configurable: false,
});

obj.x = 2; // ✅ permitido porque writable es true
console.log(obj.x); // 2

Object.defineProperty(obj, "x", { writable: false }); // ✅ permitido una vez
console.log(Object.getOwnPropertyDescriptor(obj, "x").writable); // false
```

### 4.8.6 Definir getters y setters con `defineProperty`

También puedes crear accesores desde cero:

```js
const temperatura = {
  _celsius: 0,
};

Object.defineProperty(temperatura, "celsius", {
  get() {
    return this._celsius;
  },
  set(valor) {
    if (typeof valor === "number" && !Number.isNaN(valor)) {
      this._celsius = valor;
    }
  },
  enumerable: true,
  configurable: true,
});

temperatura.celsius = 25;

console.log(temperatura.celsius); // 25
console.log(temperatura._celsius); // 25
```

Y `Object.defineProperties` permite definir varias a la vez:

```js
const producto = {};

Object.defineProperties(producto, {
  nombre: { value: "Teclado", writable: true, enumerable: true },
  precio: { value: 50, writable: true, enumerable: true },
  codigo: { value: "TEC-001", enumerable: false },
});

console.log(producto.nombre); // "Teclado"
console.log(Object.keys(producto)); // ["nombre", "precio"]
```

### 4.8.7 Copiar descriptores

El spread y `Object.assign` copian **valores**, no descriptores. Si una propiedad es un getter, el spread lo **ejecuta** y guarda el resultado.

```js
const original = {
  _n: 2,
  get doble() {
    return this._n * 2;
  },
};

const copia = { ...original };

console.log(copia.doble); // 4
console.log(Object.getOwnPropertyDescriptor(copia, "doble").get); // undefined ⚠️ ya no es getter
console.log(Object.hasOwn(copia, "_n")); // true
```

Para copiar descriptores de verdad:

```js
const original = {
  _n: 2,
  get doble() {
    return this._n * 2;
  },
};

const copia = Object.defineProperties(
  {},
  Object.getOwnPropertyDescriptors(original)
);

console.log(Object.getOwnPropertyDescriptor(copia, "doble").get !== undefined); // true ✅
console.log(copia.doble); // 4
```

**Ojo con `this` en el getter copiado:** el getter se ejecutará con el `this` del objeto donde se lee. Si la copia no tiene `_n`, el resultado cambia.

```js
const copia2 = Object.defineProperties(
  {},
  Object.getOwnPropertyDescriptors(original)
);

console.log(copia2.doble); // NaN ⚠️ copia2._n es undefined
```

> 📌 Esto es avanzado y poco frecuente. Lo importante: **spread no preserva getters ni atributos**.

### 4.8.8 `freeze`, `seal` y `preventExtensions`

Estos tres métodos congelan el objeto en distintos grados.

| Método | Añadir propiedades | Borrar propiedades | Modificar valores | Redefinir descriptores |
|---|---|---|---|---|
| `Object.preventExtensions` | No | Sí | Sí | Sí |
| `Object.seal` | No | No | Sí | No |
| `Object.freeze` | No | No | No | No |

```js
const congelado = { a: 1 };

Object.freeze(congelado);

congelado.a = 2; // ignorado (estricto: TypeError)
congelado.b = 3; // ignorado
delete congelado.a; // ignorado

console.log(congelado.a); // 1 ✅
console.log(congelado.b); // undefined
console.log(Object.isFrozen(congelado)); // true
```

```js
const sellado = { a: 1 };

Object.seal(sellado);

sellado.a = 2; // ✅ permitido
sellado.b = 3; // ignorado
delete sellado.a; // ignorado

console.log(sellado.a); // 2
console.log(sellado.b); // undefined
console.log(Object.isSealed(sellado)); // true
```

```js
const noExtensible = { a: 1 };

Object.preventExtensions(noExtensible);

noExtensible.b = 2; // ignorado
delete noExtensible.a; // ✅ permitido

console.log(noExtensible.a); // undefined
console.log(noExtensible.b); // undefined
console.log(Object.isExtensible(noExtensible)); // false
```

**`freeze` es superficial:** congela las propiedades del objeto, pero no los objetos anidados.

```js
const usuario = {
  nombre: "Ana",
  direccion: { ciudad: "Madrid" },
};

Object.freeze(usuario);

usuario.nombre = "Luis"; // ignorado
usuario.direccion.ciudad = "Bogotá"; // ✅ permitido ⚠️

console.log(usuario.nombre); // "Ana"
console.log(usuario.direccion.ciudad); // "Bogotá"
```

Para congelar en profundidad necesitas recorrer el árbol:

```js
function congelarProfundo(valor) {
  if (valor === null || typeof valor !== "object") {
    return valor;
  }

  for (const clave of Object.keys(valor)) {
    congelarProfundo(valor[clave]);
  }

  return Object.freeze(valor);
}

const config = congelarProfundo({
  modo: "dev",
  red: { puerto: 3000 },
});

config.red.puerto = 8080;

console.log(config.red.puerto); // 3000 ✅
```

> ⚠️ `congelarProfundo` no maneja ciclos (un objeto que se referencia a sí mismo). En el Módulo 7 verás cómo detectarlos con `Set`.

### 4.8.9 Getters en clases: repaso

Ya los viste en 4.7.7. La diferencia con un objeto literal es que en una clase el getter vive en `Clase.prototype` y es **no enumerable**.

```js
class Circulo {
  #radio;

  constructor(radio) {
    this.#radio = radio;
  }

  get radio() {
    return this.#radio;
  }

  set radio(valor) {
    if (valor > 0) {
      this.#radio = valor;
    }
  }

  get area() {
    return Math.PI * this.#radio ** 2;
  }
}

const c = new Circulo(2);

console.log(c.area.toFixed(2)); // "12.57"

c.radio = 3;
console.log(c.area.toFixed(2)); // "28.27"

c.radio = -1;
console.log(c.radio); // 3 ✅ no cambió
```

**`toFixed(2)`** devuelve un string con dos decimales. Ya lo usaste en el Módulo 3.

**Los getters de clase no aparecen en `Object.keys` de la instancia:**

```js
console.log(Object.keys(c)); // [] ← #radio no es enumerable y area es del prototipo
console.log(Object.getOwnPropertyNames(Circulo.prototype)); // ["constructor", "radio", "area"]
```

### 4.8.10 Errores comunes

**1. Llamar al getter con paréntesis:**

```js
const obj = {
  get valor() {
    return 42;
  },
};

console.log(obj.valor); // 42 ✅
// console.log(obj.valor()); // ❌ TypeError: obj.valor is not a function
```

**2. Recursión infinita en un getter:**

```js
// ❌ El getter se llama a sí mismo
const malo = {
  _n: 1,
  get n() {
    return this.n; // RangeError: Maximum call stack size exceeded
  },
};
```

El getter debe leer **otra** propiedad, normalmente con guion bajo o un campo privado.

```js
// ✅
const bueno = {
  _n: 1,
  get n() {
    return this._n;
  },
};
```

**3. Getter que modifica estado:**

```js
// ❌ Un getter no debería cambiar nada
const malo = {
  _contador: 0,
  get siguiente() {
    this._contador += 1;
    return this._contador;
  },
};

console.log(malo.siguiente); // 1
console.log(malo.siguiente); // 2 ⚠️ leer cambió el estado
```

Si necesitas eso, usa un método con nombre de acción: `siguiente()`.

**4. Confundir `enumerable: false` con privacidad:**

```js
const obj = {};
Object.defineProperty(obj, "secreto", { value: "1234", enumerable: false });

console.log(obj.secreto); // "1234" ⚠️ totalmente accesible
```

**5. Esperar que `freeze` sea profundo:**

```js
const obj = Object.freeze({ interno: { x: 1 } });
obj.interno.x = 2;
console.log(obj.interno.x); // 2 ⚠️
```

**6. Definir un setter sin getter y leer la propiedad:**

```js
const obj = {
  set x(v) {
    this._x = v;
  },
};

obj.x = 5;
console.log(obj.x); // undefined ⚠️
```

### ✅ Haz esto / ❌ Evita esto (4.8)

```js
// ✅ Getter para valores derivados baratos
const rectangulo = {
  get area() {
    return this.ancho * this.alto;
  },
};

// ✅ Setter para validar en un solo lugar
const persona = {
  set edad(v) {
    if (v >= 0) this._edad = v;
  },
};

// ✅ defineProperty cuando necesitas atributos concretos
Object.defineProperty(obj, "id", { value: 1, writable: false });

// ✅ Object.getOwnPropertyDescriptor para inspeccionar
Object.getOwnPropertyDescriptor(obj, "clave");

// ✅ freeze para constantes de configuración
const CONFIG = Object.freeze({ modo: "dev" });

// ✅ Método explícito si el cálculo es caro
// ordenar() { /* ... */ }

// ❌ Llamar al getter como función
obj.valor();

// ❌ Getter que se llama a sí mismo
// get n() { return this.n; }

// ❌ Getter con efectos secundarios
// get siguiente() { this._contador += 1; return this._contador; }

// ❌ Creer que enumerable: false es privacidad
Object.defineProperty(obj, "secreto", { value: 1 });

// ❌ Creer que freeze es profundo
Object.freeze({ interno: { x: 1 } });

// ❌ Setter sin getter y luego leer la propiedad
```

---

## 4.9 — Herencia vs composición

Ya sabes crear jerarquías con `extends`. La pregunta importante no es **cómo** heredar, sino **cuándo**. La herencia es una herramienta, no la forma por defecto de reutilizar código.

### 4.9.1 Qué es herencia

La herencia crea una relación **“es un”**: un `Perro` **es un** `Animal`. La subclase recibe el estado y el comportamiento del padre y puede añadir o sobrescribir.

```js
class Animal {
  constructor(nombre) {
    this.nombre = nombre;
  }

  comer() {
    return this.nombre + " come";
  }

  dormir() {
    return this.nombre + " duerme";
  }
}

class Perro extends Animal {
  ladrar() {
    return this.nombre + " ladra";
  }
}

const toby = new Perro("Toby");

console.log(toby.comer()); // "Toby come"
console.log(toby.dormir()); // "Toby duerme"
console.log(toby.ladrar()); // "Toby ladra"
```

La relación “es un” se cumple: todo `Perro` es un `Animal`. Tiene sentido.

### 4.9.2 Cuándo la herencia se rompe

La herencia se vuelve problemática cuando la relación **no es realmente “es un”**, sino **“tiene un”** o **“puede hacer”**.

**Ejemplo clásico: `Ave` y `Pinguino`.**

```js
class Ave {
  volar() {
    return "Estoy volando";
  }
}

class Pinguino extends Ave {
  // Hereda volar(), pero un pingüino no vuela ❌
}

console.log(new Pinguino().volar()); // "Estoy volando" ⚠️ mentira
```

El problema no es JavaScript: es el modelo. Un pingüino **es un** ave, pero **no puede** volar. La herencia obliga a heredar comportamiento que no corresponde.

**Solución con composición:** separar “ser ave” de “poder volar”.

```js
class Ave {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

const puedeVolar = {
  volar() {
    return this.nombre + " vuela";
  },
};

const puedeNadar = {
  nadar() {
    return this.nombre + " nada";
  },
};

class Pinguino extends Ave {}

Object.assign(Pinguino.prototype, puedeNadar);

class Aguila extends Ave {}

Object.assign(Aguila.prototype, puedeVolar, puedeNadar);

console.log(new Pinguino("Pingu").nadar()); // "Pingu nada"
console.log(new Aguila("Aquila").volar()); // "Aquila vuela"
```

Ahora cada clase recibe **solo** las capacidades que le corresponden.

> 📌 `Object.assign` sobre `prototype` añade métodos **enumerables**. Es aceptable para ejemplos, pero en producción se prefieren mixins con clases (4.9.4), que no tienen ese problema.

**Otro problema: jerarquías profundas.**

```js
class A {}
class B extends A {}
class C extends B {}
class D extends C {}
class E extends D {}
```

Cuando algo falla en `E`, tienes que revisar cinco niveles. Los métodos se dispersan, los nombres se pisan y cualquier cambio en `A` puede romper `E`.

**Regla práctica:** si la jerarquía supera dos o tres niveles, probablemente necesitas composición.

### 4.9.3 Composición

La composición construye objetos **combinando piezas**. La relación es **“tiene un”** o **“puede hacer”**.

```js
function crearVolador(nombre) {
  return {
    volar() {
      return nombre + " vuela";
    },
  };
}

function crearNadador(nombre) {
  return {
    nadar() {
      return nombre + " nada";
    },
  };
}

function crearPato(nombre) {
  return {
    nombre,
    ...crearVolador(nombre),
    ...crearNadador(nombre),
  };
}

const pato = crearPato("Lucas");

console.log(pato.volar()); // "Lucas vuela"
console.log(pato.nadar()); // "Lucas nada"
```

Cada pieza es independiente y testeable. El pato elige qué capacidades tiene.

**Ventajas:**

- No hay jerarquías rígidas.
- Cada capacidad se prueba por separado.
- Puedes combinar cualquier conjunto.
- No hay colisiones de `this` entre niveles.

**Desventajas:**

- No hay `instanceof` útil.
- Cada objeto puede tener copias de funciones (si las creas dentro).
- El código puede volverse difícil de rastrear si hay demasiadas piezas.

### 4.9.4 Mixins con clases

Un **mixin** es una función que recibe una clase base y devuelve una clase nueva con capacidades añadidas.

```js
const conVuelo = (Base) =>
  class extends Base {
    volar() {
      return this.nombre + " vuela";
    }
  };

const conNado = (Base) =>
  class extends Base {
    nadar() {
      return this.nombre + " nada";
    }
  };

class Animal {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

class Pato extends conNado(conVuelo(Animal)) {}

const pato = new Pato("Lucas");

console.log(pato.volar()); // "Lucas vuela"
console.log(pato.nadar()); // "Lucas nada"
console.log(pato instanceof Animal); // true ✅ conserva la cadena
console.log(pato instanceof Pato); // true
```

**Cómo funciona:** `conVuelo(Animal)` devuelve una clase anónima que extiende `Animal`. `conNado(...)` devuelve otra que extiende la anterior. La cadena queda:

```text
Pato.prototype ──▶ (conNado) ──▶ (conVuelo) ──▶ Animal.prototype ──▶ Object.prototype
```

**Ventaja frente a `Object.assign`:** los métodos del mixin son **no enumerables** y la cadena de prototipos es explícita.

**Limitación:** si dos mixins definen el mismo método, gana el último aplicado. No hay fusión automática.

```js
const conA = (Base) => class extends Base { hablar() { return "A"; } };
const conB = (Base) => class extends Base { hablar() { return "B"; } };

class Base {}

class Hijo extends conB(conA(Base)) {}

console.log(new Hijo().hablar()); // "B" ← el último gana
```

**Mixins con estado:** pueden añadir campos, pero cuidado con el orden de inicialización (4.7.10).

```js
const conId = (Base) =>
  class extends Base {
    id = Math.random().toString(36).slice(2, 8);
  };

class Entidad {}

class Usuario extends conId(Entidad) {
  constructor(nombre) {
    super();
    this.nombre = nombre;
  }
}

const u = new Usuario("Ana");
console.log(typeof u.id); // "string"
console.log(u.id.length); // 6
```

> 📌 `Math.random().toString(36).slice(2, 8)` genera un identificador corto. No es criptográficamente seguro; para IDs reales usa `crypto.randomUUID()` (Módulo 7).

### 4.9.5 Delegación con `Object.create`

La **delegación** es composición sin copiar: un objeto delega en otro a través del prototipo.

```js
const base = {
  saludar() {
    return "Hola, " + this.nombre;
  },
  despedir() {
    return "Adiós, " + this.nombre;
  },
};

const usuario = Object.create(base);
usuario.nombre = "Ana";

console.log(usuario.saludar()); // "Hola, Ana"
console.log(usuario.despedir()); // "Adiós, Ana"
console.log(Object.hasOwn(usuario, "saludar")); // false ✅ no se copió
```

**Ventaja:** los métodos se comparten de verdad; no hay copias por objeto.

**Desventaja:** si cambias `base` en tiempo de ejecución, todos los objetos que delegan en él cambian.

```js
base.saludar = function () {
  return "Hey, " + this.nombre;
};

console.log(usuario.saludar()); // "Hey, Ana" ⚠️ cambió para todos
```

Esto puede ser una feature (actualización central) o un bug (efecto colateral). Decide conscientemente.

**Delegación con varias fuentes:** JavaScript solo tiene **un** prototipo por objeto. Para combinar varias fuentes, usa `Object.assign` o mixins.

```js
const volador = { volar() { return this.nombre + " vuela"; } };
const nadador = { nadar() { return this.nombre + " nada"; } };

const pato = Object.assign({ nombre: "Lucas" }, volador, nadador);
```

Aquí sí se copian las funciones al objeto. Es composición por copia, no por delegación.

### 4.9.6 Fábricas con closures

Una fábrica puede usar closures para tener estado privado sin clases ni `#`.

```js
function crearContador(inicial) {
  let total = inicial; // privado por closure

  return {
    incrementar() {
      total += 1;
      return total;
    },
    decrementar() {
      total -= 1;
      return total;
    },
    valor() {
      return total;
    },
  };
}

const c = crearContador(10);

c.incrementar();
c.incrementar();

console.log(c.valor()); // 12
console.log("total" in c); // false ✅ inaccesible desde fuera
```

**Ventajas:**

- Privacidad real sin `#`.
- No hay `this` que perder: los métodos llaman a la variable del closure.
- Cada fábrica puede tener su propia lógica.

**Desventajas:**

- Cada instancia tiene sus propias funciones (más memoria).
- No hay `instanceof`.
- No se puede inspeccionar el estado privado ni siquiera para depurar.

**Desacoplar un método de una fábrica sí funciona:**

```js
const incrementar = c.incrementar;

console.log(incrementar()); // 13 ✅ no depende de this
```

Esto es una gran ventaja frente a los métodos con `this`.

### 4.9.7 Estrategia: composición de comportamiento

El patrón **estrategia** guarda funciones en un objeto y elige una en tiempo de ejecución.

```js
const estrategiasDescuento = {
  ninguna: (precio) => precio,
  empleado: (precio) => precio * 0.9,
  vip: (precio) => precio * 0.8,
};

function calcularTotal(precio, tipo) {
  const estrategia = estrategiasDescuento[tipo];

  if (!estrategia) {
    return precio;
  }

  return estrategia(precio);
}

console.log(calcularTotal(100, "ninguna")); // 100
console.log(calcularTotal(100, "empleado")); // 90
console.log(calcularTotal(100, "vip")); // 80
console.log(calcularTotal(100, "otro")); // 100
```

**Ventaja:** añadir una estrategia es añadir una propiedad, no modificar una jerarquía de clases.

**Versión con clases** (cuando la estrategia tiene estado):

```js
class DescuentoFijo {
  constructor(monto) {
    this.monto = monto;
  }

  aplicar(precio) {
    return Math.max(0, precio - this.monto);
  }
}

class DescuentoPorcentaje {
  constructor(porcentaje) {
    this.porcentaje = porcentaje;
  }

  aplicar(precio) {
    return precio * (1 - this.porcentaje / 100);
  }
}

const estrategias = {
  fijo: new DescuentoFijo(15),
  porcentaje: new DescuentoPorcentaje(20),
};

console.log(estrategias.fijo.aplicar(100)); // 85
console.log(estrategias.porcentaje.aplicar(100)); // 80
```

> 🧠 La clave es que el código que calcula el total **no sabe** qué estrategia usa. Solo llama a `aplicar`.

### 4.9.8 Tabla de decisión

| Necesitas | Usa |
|---|---|
| Relación “es un” clara y estable | `class extends` |
| Varias capacidades combinables | Mixins o composición |
| Estado privado sin clases | Fábrica con closure o `WeakMap` |
| Compartir métodos sin copiar | `Object.create` o `prototype` |
| Elegir comportamiento en tiempo de ejecución | Estrategia (objeto de funciones) |
| Datos inmutables con operaciones | Objetos congelados + funciones puras |
| API que espera `instanceof` | Clase |
| Jerarquía de más de 3 niveles | Replantea con composición |

**Preguntas guía antes de heredar:**

1. ¿La subclase **es realmente** un caso del padre? ¿Siempre?
2. ¿Puede necesitar una capacidad que el padre no tiene y otra subclase sí?
3. ¿Voy a necesitar combinar capacidades de dos ramas?
4. ¿El padre tiene métodos que la subclase no debería tener?

Si alguna respuesta te incomoda, prueba composición.

### 4.9.9 Refactor: de herencia a composición

**Antes:**

```js
class Empleado {
  constructor(nombre, salario) {
    this.nombre = nombre;
    this.salario = salario;
  }

  calcularPago() {
    return this.salario;
  }
}

class EmpleadoConBono extends Empleado {
  constructor(nombre, salario, bono) {
    super(nombre, salario);
    this.bono = bono;
  }

  calcularPago() {
    return this.salario + this.bono;
  }
}

class EmpleadoConComision extends Empleado {
  constructor(nombre, salario, porcentaje) {
    super(nombre, salario);
    this.porcentaje = porcentaje;
  }

  calcularPago() {
    return this.salario * (1 + this.porcentaje / 100);
  }
}
```

¿Qué pasa si un empleado tiene **bono y comisión**? Tendrías que crear `EmpleadoConBonoYComision`. Y si mañana hay bonos por objetivos, la explosión de clases es inevitable.

**Después, con composición:**

```js
function crearEmpleado(nombre, salario, extras = []) {
  return {
    nombre,
    salario,
    calcularPago() {
      return extras.reduce(
        (total, extra) => extra(total),
        salario
      );
    },
  };
}

const bono = (monto) => (total) => total + monto;
const comision = (porcentaje) => (total) => total * (1 + porcentaje / 100);

const ana = crearEmpleado("Ana", 1000, [bono(200), comision(10)]);
const luis = crearEmpleado("Luis", 1000, [comision(5)]);

console.log(ana.calcularPago()); // 1320
console.log(luis.calcularPago()); // 1050
```

Cada extra es una función independiente. Se combinan sin crear clases nuevas.

> 📌 `reduce` con valor inicial `salario` aplica cada extra en orden: `1000 → 1200 → 1320`.

### ✅ Haz esto / ❌ Evita esto (4.9)

```js
// ✅ Herencia para relaciones "es un" estables
class Perro extends Animal {}

// ✅ Mixins para capacidades combinables
class Pato extends conNado(conVuelo(Animal)) {}

// ✅ Composición para combinar piezas independientes
const pato = { ...crearVolador(n), ...crearNadador(n) };

// ✅ Estrategia para elegir comportamiento en ejecución
estrategias[tipo](precio);

// ✅ Fábrica con closure para estado privado
function crearContador() { let total = 0; /* ... */ }

// ✅ Delegación para compartir métodos sin copiar
const obj = Object.create(base);

// ❌ Herencia solo para reutilizar código
class Pinguino extends Ave {}

// ❌ Jerarquías de 5 niveles
class E extends D {}

// ❌ Clases explosivas por combinaciones
class EmpleadoConBonoYComisionYPlus {}

// ❌ Mixins que se pisan sin control
class X extends conB(conA(Base)) {}

// ❌ Copiar métodos con Object.assign esperando privacidad
Object.assign(obj, metodos);
```

---

## 4.10 — `instanceof`, duck typing y comprobaciones

JavaScript tiene varias formas de preguntar “¿qué es esto?”. Ninguna es perfecta; cada una responde una pregunta distinta.

### 4.10.1 `instanceof` en profundidad

`objeto instanceof Constructor` comprueba si `Constructor.prototype` está en la cadena de prototipos del objeto.

```js
class Animal {}
class Perro extends Animal {}

const toby = new Perro();

console.log(toby instanceof Perro); // true
console.log(toby instanceof Animal); // true ✅ por la cadena
console.log(toby instanceof Object); // true
console.log(toby instanceof Array); // false
```

**Funciona con la cadena, no con el nombre.** Si dos clases se llaman igual en ámbitos distintos, no hay confusión.

```js
function crearClase() {
  return class Temporal {};
}

const A = crearClase();
const B = crearClase();

const a = new A();

console.log(a instanceof A); // true
console.log(a instanceof B); // false ✅ aunque ambas se llamen "Temporal"
```

**No funciona con primitivos:**

```js
console.log("hola" instanceof String); // false
console.log(42 instanceof Number); // false
console.log(true instanceof Boolean); // false
```

Para primitivos usa `typeof`.

**Puede fallar entre *realms*:** un array creado en un iframe tiene otro `Array.prototype`, así que `instanceof Array` puede dar `false`. Por eso existe `Array.isArray`.

```js
// En el mismo realm:
console.log([] instanceof Array); // true
console.log(Array.isArray([])); // true ✅ más fiable
```

**Si reasignas `prototype`, las instancias antiguas dejan de ser `instanceof`:**

```js
function F() {}

const viejo = new F();

F.prototype = {};

console.log(viejo instanceof F); // false ⚠️
```

### 4.10.2 `Symbol.hasInstance`

`instanceof` llama internamente al método `[Symbol.hasInstance]` del constructor. Puedes sobrescribirlo para definir tu propia lógica.

```js
class SoloPares {
  static [Symbol.hasInstance](valor) {
    return typeof valor === "number" && valor % 2 === 0;
  }
}

console.log(2 instanceof SoloPares); // true
console.log(3 instanceof SoloPares); // false
console.log(4 instanceof SoloPares); // true
```

Esto es útil para **marcas** o validaciones, pero puede confundir: `instanceof` deja de significar “está en la cadena de prototipos”.

**Uso real: detectar si un objeto viene de otra copia de la librería.**

```js
class MiLibreria {
  static [Symbol.hasInstance](obj) {
    return obj !== null && typeof obj === "object" && obj._marcaLibreria === true;
  }
}

const objeto = { _marcaLibreria: true };

console.log(objeto instanceof MiLibreria); // true
```

> ⚠️ No abuses. La mayoría de las veces `instanceof` normal es más claro.

### 4.10.3 `typeof`

`typeof` devuelve un string con el tipo básico.

```js
console.log(typeof "hola"); // "string"
console.log(typeof 42); // "number"
console.log(typeof true); // "boolean"
console.log(typeof undefined); // "undefined"
console.log(typeof Symbol("x")); // "symbol"
console.log(typeof 10n); // "bigint"
console.log(typeof function () {}); // "function"
console.log(typeof {}); // "object"
console.log(typeof []); // "object" ⚠️
console.log(typeof null); // "object" ⚠️ bug histórico
```

**Limitaciones:**

- No distingue arrays de objetos.
- `typeof null` es `"object"` por un bug de la primera versión que nunca se corrigió.
- No distingue `Map`, `Set`, `Date` ni clases de instancia.

**Comprobaciones correctas:**

```js
const valor = null;

console.log(valor === null); // true ✅ para null
console.log(Array.isArray([])); // true ✅ para arrays
console.log(typeof function () {} === "function"); // true ✅
console.log(Number.isNaN(NaN)); // true ✅ para NaN
```

**`NaN` es el único valor distinto de sí mismo:**

```js
console.log(NaN === NaN); // false ⚠️
console.log(Number.isNaN(NaN)); // true ✅
console.log(Object.is(NaN, NaN)); // true ✅
```

### 4.10.4 `Object.prototype.toString.call`

Devuelve una etiqueta interna del valor, entre corchetes.

```js
console.log(Object.prototype.toString.call([])); // "[object Array]"
console.log(Object.prototype.toString.call({})); // "[object Object]"
console.log(Object.prototype.toString.call(null)); // "[object Null]"
console.log(Object.prototype.toString.call(undefined)); // "[object Undefined]"
console.log(Object.prototype.toString.call("hola")); // "[object String]"
console.log(Object.prototype.toString.call(42)); // "[object Number]"
console.log(Object.prototype.toString.call(new Map())); // "[object Map]"
console.log(Object.prototype.toString.call(new Set())); // "[object Set]"
console.log(Object.prototype.toString.call(function () {})); // "[object Function]"
```

**Ventaja:** funciona con `null`, `undefined` y valores de otros realms.

**Desventaja:** es verboso y se puede falsear con `Symbol.toStringTag`.

```js
const falso = {
  get [Symbol.toStringTag]() {
    return "Array";
  },
};

console.log(Object.prototype.toString.call(falso)); // "[object Array]" ⚠️
```

> 📌 `Symbol.toStringTag` es una etiqueta personalizable. `Map`, `Set` y otros la usan. No la necesitas en el día a día.

**Función auxiliar:**

```js
function tipoReal(valor) {
  return Object.prototype.toString.call(valor).slice(8, -1);
}

console.log(tipoReal([])); // "Array"
console.log(tipoReal(null)); // "Null"
console.log(tipoReal(new Map())); // "Map"
console.log(tipoReal(42)); // "Number"
```

`.slice(8, -1)` quita `"[object "` y `"]"`.

### 4.10.5 Duck typing

“Si camina como un pato y grazna como un pato, es un pato.” En JavaScript no necesitas que un objeto sea de una clase concreta: basta con que **tenga los métodos o propiedades que usas**.

```js
function hacerVolar(animal) {
  if (typeof animal.volar === "function") {
    return animal.volar();
  }

  return "No puede volar";
}

console.log(hacerVolar({ volar: () => "Estoy volando" })); // "Estoy volando"
console.log(hacerVolar({})); // "No puede volar"
```

**Ventaja:** no acoplas el código a una jerarquía. Cualquier objeto con `volar` sirve.

**Desventaja:** un objeto puede tener el método pero comportarse mal, o tenerlo con otra firma. El tipado no te protege.

**Duck typing con validación de firma:**

```js
function procesar(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter((item) => typeof item.precio === "number")
    .map((item) => item.precio);
}

console.log(procesar([{ precio: 10 }, { precio: "20" }, { precio: 30 }])); // [10, 30]
```

**Duck typing vs `instanceof`:**

| Criterio | `instanceof` | Duck typing |
|---|---|---|
| Pregunta | ¿De qué clase es? | ¿Qué sabe hacer? |
| Acoplamiento | Alto (necesita la clase) | Bajo |
| Seguridad | Media | Baja |
| Flexibilidad | Baja | Alta |
| Falla si… | Otra copia de la clase | Falta el método |

**Regla:** usa `instanceof` cuando la identidad importa (por ejemplo, para un `Error` concreto). Usa duck typing cuando solo te importa la capacidad.

### 4.10.6 Brand checks con `#campo in objeto`

Los campos privados no se pueden leer desde fuera, pero **sí se puede comprobar su existencia** con `#campo in objeto`.

```js
class Cuenta {
  #saldo = 0;

  static esCuenta(valor) {
    if (valor === null || typeof valor !== "object") {
      return false;
    }

    return #saldo in valor;
  }
}

console.log(Cuenta.esCuenta(new Cuenta())); // true
console.log(Cuenta.esCuenta({ saldo: 100 })); // false
console.log(Cuenta.esCuenta(null)); // false ✅ no lanza error
console.log(Cuenta.esCuenta(42)); // false ✅ no lanza error
```

**Ventaja:** es la comprobación más fiable que existe. Nadie puede falsearla sin acceso a la clase.

**Uso típico:** validar argumentos en un método que recibe objetos de la misma clase.

```js
class Punto {
  #x;
  #y;

  constructor(x, y) {
    this.#x = x;
    this.#y = y;
  }

  sumar(otro) {
    if (otro === null || typeof otro !== "object" || !(#x in otro)) {
      return null; // o lanzar un error en el Módulo 5
    }

    return new Punto(this.#x + otro.#x, this.#y + otro.#y);
  }

  toString() {
    return `(${this.#x}, ${this.#y})`;
  }
}

const a = new Punto(1, 2);
const b = new Punto(3, 4);

console.log(a.sumar(b).toString()); // "(4, 6)"
console.log(a.sumar({ x: 9, y: 9 })); // null ✅
```

> 📌 `#x in otro` no accede al valor; solo comprueba la marca. Es la única forma de validar privados sin exponerlos.

### 4.10.7 Errores comunes

**1. Usar `typeof` para arrays:**

```js
console.log(typeof []); // "object" ⚠️
console.log(Array.isArray([])); // true ✅
```

**2. Comparar con `null` usando `typeof`:**

```js
const valor = null;

console.log(typeof null); // "object" ⚠️
console.log(valor === null); // true ✅
```

**3. Usar `instanceof` con primitivos:**

```js
console.log("hola" instanceof String); // false ⚠️
console.log(typeof "hola" === "string"); // true ✅
```

**4. Confiar en `constructor.name`:**

```js
function F() {}
const f = new F();

console.log(f.constructor.name); // "F"

Object.defineProperty(F, "name", { value: "Otra" });
console.log(f.constructor.name); // "Otra" ⚠️ el nombre se puede cambiar
```

El nombre se puede cambiar y las herramientas que acortan el código para producción pueden renombrarlo. No lo uses para lógica.

**5. Usar `instanceof` con objetos de otro realm:**

```js
// En un iframe: nuevoArray instanceof Array === false ⚠️
// Solución: Array.isArray(nuevoArray)
```

**6. Duck typing sin validar:**

```js
function ejecutar(obj) {
  return obj.correr(); // ❌ falla si no existe
}

function ejecutarSeguro(obj) {
  if (typeof obj?.correr === "function") {
    return obj.correr();
  }
  return null;
}
```

`obj?.correr` usa optional chaining (Módulo 3). Si `obj` es `null` o `undefined`, devuelve `undefined` en vez de lanzar error.

### ✅ Haz esto / ❌ Evita esto (4.10)

```js
// ✅ Array.isArray para arrays
Array.isArray(valor);

// ✅ valor === null para null
valor === null;

// ✅ typeof para primitivos y funciones
typeof valor === "string";

// ✅ Number.isNaN para NaN
Number.isNaN(valor);

// ✅ instanceof para identidad de clase
error instanceof TypeError;

// ✅ #campo in obj para marcas privadas
class Cuenta {
  #saldo = 0;

  static esCuenta(valor) {
    return #saldo in valor;
  }
}

// ✅ Duck typing con validación
typeof obj.volar === "function";

// ❌ typeof para arrays
typeof [] === "array";

// ❌ typeof null
typeof valor === "null";

// ❌ instanceof con primitivos
"hola" instanceof String;

// ❌ constructor.name para lógica
obj.constructor.name === "Array";

// ❌ instanceof entre realms
arrayDeIframe instanceof Array;

// ❌ Duck typing sin comprobar
obj.metodo();
```

---

## 4.11 — Patrones y anti-patrones

Esta sección reúne los patrones que usarás una y otra vez, con el criterio de cuándo aplicar cada uno.

### 4.11.1 Objeto literal con métodos

El patrón más simple y el más infravalorado. Para un objeto único con estado y comportamiento, no necesitas clases.

```js
const carrito = {
  items: [],

  agregar(nombre, precio) {
    this.items.push({ nombre, precio });
    return this;
  },

  total() {
    return this.items.reduce((suma, item) => suma + item.precio, 0);
  },

  vaciar() {
    this.items = [];
    return this;
  },
};

carrito.agregar("Teclado", 50).agregar("Mouse", 20);

console.log(carrito.total()); // 70
```

**Ventajas:** cero ceremonia, legible, fácil de depurar.  
**Desventajas:** un solo objeto; no hay instancias ni `instanceof`.  
**Cuándo:** configuración, utilidades, estado global controlado, prototipos rápidos.

> ⚠️ `return this` permite encadenar llamadas (*method chaining*). Es cómodo, pero no lo añadas si no aporta.

### 4.11.2 Patrón módulo (IIFE)

Antes de los módulos ES, el patrón módulo usaba una función autoejecutable para crear ámbito privado.

```js
const contador = (function () {
  let total = 0; // privado

  function incrementar() {
    total += 1;
    return total;
  }

  function valor() {
    return total;
  }

  return {
    incrementar,
    valor,
  };
})();

contador.incrementar();
contador.incrementar();

console.log(contador.valor()); // 2
console.log("total" in contador); // false ✅ privado
```

**Cómo funciona:**

1. La función se ejecuta inmediatamente.
2. `total` vive en su ámbito y no se expone.
3. Se devuelve un objeto con las funciones públicas.

**Hoy:** los módulos ES (`import`/`export`, Módulo 7) sustituyen este patrón para código entre archivos. El patrón módulo sigue siendo útil para encapsular un bloque dentro de un archivo.

### 4.11.3 Fábrica de objetos

```js
function crearProducto(nombre, precio) {
  return {
    nombre,
    precio,

    conDescuento(porcentaje) {
      return crearProducto(nombre, precio * (1 - porcentaje / 100));
    },

    describir() {
      return `${nombre}: ${precio}`;
    },
  };
}

const teclado = crearProducto("Teclado", 50);
const rebajado = teclado.conDescuento(10);

console.log(teclado.describir()); // "Teclado: 50"
console.log(rebajado.describir()); // "Teclado: 45"
```

**Ventaja:** inmutable por convención; cada operación devuelve un objeto nuevo.  
**Desventaja:** cada objeto tiene sus propias funciones.

### 4.11.4 Clase

```js
class Producto {
  #precio;

  constructor(nombre, precio) {
    this.nombre = nombre;
    this.#precio = precio;
  }

  get precio() {
    return this.#precio;
  }

  conDescuento(porcentaje) {
    return new Producto(this.nombre, this.#precio * (1 - porcentaje / 100));
  }

  describir() {
    return `${this.nombre}: ${this.#precio}`;
  }
}

const teclado = new Producto("Teclado", 50);

console.log(teclado.describir()); // "Teclado: 50"
console.log(teclado.conDescuento(10).describir()); // "Teclado: 45"
```

**Ventaja:** métodos compartidos, privacidad real, `instanceof`.  
**Desventaja:** más ceremonia; `this` puede perderse en callbacks.

### 4.11.5 Singleton: úsalo con cuidado

Un **singleton** garantiza que solo exista una instancia.

```js
class Configuracion {
  static #instancia = null;

  static obtener() {
    if (Configuracion.#instancia === null) {
      Configuracion.#instancia = new Configuracion();
    }

    return Configuracion.#instancia;
  }

  constructor() {
    this.modo = "dev";
  }
}

const a = Configuracion.obtener();
const b = Configuracion.obtener();

console.log(a === b); // true ✅ misma instancia
```

**Problemas del singleton:**

- Es **estado global** disfrazado: difícil de testear.
- Oculta dependencias: cualquier módulo puede acceder sin recibirla.
- Dificulta el paralelismo y el aislamiento.

**Alternativa:** crea la instancia una vez y **pásala** como parámetro (inyección de dependencias).

```js
function crearApp(config) {
  return {
    iniciar() {
      return "Iniciando en modo " + config.modo;
    },
  };
}

const config = { modo: "dev" };
const app = crearApp(config);

console.log(app.iniciar()); // "Iniciando en modo dev"
```

> 📌 Un objeto literal exportado también es un singleton de facto. Si lo usas, que sea **inmutable** o con una API muy controlada.

### 4.11.6 Objetos de valor inmutables

Un **objeto de valor** representa un dato por su contenido, no por su identidad. Sus operaciones devuelven copias nuevas.

```js
function crearPunto(x, y) {
  return Object.freeze({
    x,
    y,

    mover(dx, dy) {
      return crearPunto(x + dx, y + dy);
    },

    describir() {
      return `(${x}, ${y})`;
    },
  });
}

const p1 = crearPunto(1, 2);
const p2 = p1.mover(2, 3);

console.log(p1.describir()); // "(1, 2)"
console.log(p2.describir()); // "(3, 5)"
console.log(Object.isFrozen(p1)); // true
```

**Ventajas:** sin efectos colaterales, fácil de comparar, seguro para compartir.  
**Desventaja:** más asignaciones de memoria.

### 4.11.7 Anti-patrón: clase que hace demasiado

Una clase con 20 métodos y 15 responsabilidades es difícil de testear y de cambiar. Divide por responsabilidad.

```js
// ❌ Dios objeto
class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
  }

  validarEmail() {}
  guardarEnBaseDeDatos() {}
  enviarEmailBienvenida() {}
  generarFactura() {}
  calcularImpuestos() {}
  renderizarHTML() {}
  registrarEnAnalytics() {}
}
```

```js
// ✅ Responsabilidades separadas
class Usuario {
  constructor(nombre, email) {
    this.nombre = nombre;
    this.email = email;
  }
}

const validador = {
  email(valor) {
    return valor.includes("@") && valor.includes(".");
  },
};

const repositorio = {
  guardar(usuario) {
    return "Guardado: " + usuario.nombre;
  },
};

const notificaciones = {
  bienvenida(usuario) {
    return "Bienvenida, " + usuario.nombre;
  },
};
```

> 🧠 Principio de responsabilidad única: una clase o función debe tener **una razón para cambiar**.

### 4.11.8 Anti-patrón: herencia para reutilizar

```js
// ❌ Hereda solo para no repetir tres líneas
class Logger {
  log(mensaje) {
    console.log(mensaje);
  }
}

class ServicioUsuarios extends Logger {
  crear(nombre) {
    this.log("Creando " + nombre);
  }
}
```

Un servicio de usuarios **no es un** logger. **Tiene un** logger.

```js
// ✅ Composición
const logger = {
  log(mensaje) {
    console.log(mensaje);
  },
};

function crearServicioUsuarios(log) {
  return {
    crear(nombre) {
      log.log("Creando " + nombre);
      return nombre;
    },
  };
}

const servicio = crearServicioUsuarios(logger);
```

### 4.11.9 Anti-patrón: modificar prototipos nativos

```js
// ❌ Contamina todo el programa
Array.prototype.ultimo = function () {
  return this[this.length - 1];
};

// ✅ Función independiente
function ultimo(array) {
  return array[array.length - 1];
}
```

Puede parecer cómodo, pero rompe librerías, colisiona con futuras versiones del lenguaje y hace que `for...in` muestre propiedades inesperadas.

### 4.11.10 Anti-patrón: `this` en callbacks sin protección

Ya lo viste en 4.2.6. El resumen:

```js
// ❌
lista.forEach(objeto.metodo);

// ✅
lista.forEach((item) => objeto.metodo(item));
```

La arrow es la solución más legible en la mayoría de los casos.

### 4.11.11 Anti-patrón: getters con efectos secundarios

```js
// ❌ Leer cambia el estado
const malo = {
  get siguiente() {
    this._contador += 1;
    return this._contador;
  },
};

// ✅ Método con verbo
const bueno = {
  siguiente() {
    this._contador += 1;
    return this._contador;
  },
};
```

### 4.11.12 Anti-patrón: `new` olvidado

```js
function Persona(nombre) {
  this.nombre = nombre;
}

// ❌ En modo no estricto contamina el global
Persona("Ana");

// ✅ Protección con new.target
function Persona2(nombre) {
  if (!new.target) {
    return new Persona2(nombre);
  }
  this.nombre = nombre;
}
```

En clases el problema no existe: llamar sin `new` lanza `TypeError`.

### 4.11.13 Anti-patrón: estado compartido en el prototipo

Los valores mutables en el prototipo se comparten entre todas las instancias.

```js
// ❌ El array vive en el prototipo
class Carrito {
  items = [];
}

const a = new Carrito();
const b = new Carrito();

a.items.push("Teclado");

console.log(b.items); // [] ✅ en este caso NO se comparte
```

Espera. Con **campos de clase**, cada instancia recibe su propio array. El problema aparece cuando asignas el array al `prototype` a mano:

```js
// ❌ Array compartido en el prototipo
function Carrito() {}

Carrito.prototype.items = [];

const a = new Carrito();
const b = new Carrito();

a.items.push("Teclado");

console.log(b.items); // ["Teclado"] ⚠️ mismo array
```

**Regla:** los datos mutables van en el constructor o en campos de instancia; los métodos y constantes van en el prototipo.

### 4.11.14 Anti-patrón: comparar objetos con `===`

Dos objetos con el mismo contenido **no** son iguales si son instancias distintas.

```js
console.log({ a: 1 } === { a: 1 }); // false ⚠️
console.log([] === []); // false ⚠️

const p1 = { x: 1 };
const p2 = p1;

console.log(p1 === p2); // true ✅ misma referencia
```

Para comparar contenido, escribe una función de igualdad.

```js
function mismosDatos(a, b) {
  const clavesA = Object.keys(a);
  const clavesB = Object.keys(b);

  if (clavesA.length !== clavesB.length) {
    return false;
  }

  return clavesA.every(
    (clave) => Object.hasOwn(b, clave) && a[clave] === b[clave]
  );
}

console.log(mismosDatos({ a: 1 }, { a: 1 })); // true ✅
console.log(mismosDatos({ a: 1 }, { a: 2 })); // false
```

Esta comparación es **superficial**: no entra en objetos anidados. Para estructuras profundas necesitas una función recursiva (Reto 8).

### ✅ Haz esto / ❌ Evita esto (4.11)

```js
// ✅ Objeto literal para un objeto único
const carrito = {
  items: [],
  total() {
    return this.items.length;
  },
};

// ✅ Patrón módulo para encapsular
const modulo = (() => {
  let privado = 0;
  return { valor: () => privado };
})();

// ✅ Clase para instancias con identidad
class Producto {}

// ✅ Composición para capacidades
function crearVolador(nombre) {
  return { volar: () => nombre + " vuela" };
}

function crearNadador(nombre) {
  return { nadar: () => nombre + " nada" };
}

const pato = { ...crearVolador("Pato"), ...crearNadador("Pato") };

// ✅ Inmutabilidad para valores
const punto = Object.freeze({ x: 1, y: 2 });

// ✅ Responsabilidad única
class Usuario {}
const repositorio = { guardar(usuario) { return usuario; } };

// ❌ Clase con 20 responsabilidades
class UsuarioGigante {
  guardar() {}
  facturar() {}
  renderizar() {}
}

// ❌ Heredar solo para reutilizar
class Logger {}
class Servicio extends Logger {}

// ❌ Modificar prototipos nativos
Array.prototype.ultimo = function () {
  return this[this.length - 1];
};

// ❌ Getter con efectos secundarios
const malo = {
  get siguiente() {
    this._contador += 1;
    return this._contador;
  },
};

// ❌ Array mutable en prototype
function Carrito() {}
Carrito.prototype.items = [];

// ❌ Comparar objetos con ===
const igual = { a: 1 } === { a: 1 };

// ❌ Singleton como estado global
const configuracion = { modo: "dev" };
configuracion.modo = "prod";
```

---

## 4.12 — Retos con solución explicada

Once retos que cubren todo el módulo (el último es opcional). Intenta resolverlos **antes** de leer la solución. Cada uno indica qué conceptos pone a prueba.

---

### Reto 1 — Laboratorio de predicción de `this`

**Conceptos:** 4.1, 4.2, 4.5.

Predice el resultado de cada `console.log` **sin ejecutar** el código. Después compáralo con la solución.

```js
const usuario = {
  nombre: "Ana",
  saludar() {
    return this.nombre;
  },
};

const saludar = usuario.saludar;

const otro = {
  nombre: "Luis",
  saludar: usuario.saludar,
};

const objetoArrow = {
  nombre: "Eva",
  crear() {
    return () => this.nombre;
  },
};

const crearArrow = objetoArrow.crear;

console.log(usuario.saludar()); // A
console.log(otro.saludar()); // B
console.log(saludar()); // C
console.log(saludar.call({ nombre: "Eva" })); // D
console.log(saludar.bind({ nombre: "Eva" })()); // E
console.log(objetoArrow.crear()()); // F
console.log(crearArrow()()); // G
console.log(
  (function () {
    "use strict";
    return this;
  })()
); // H
```

**Pistas:**

- Pregunta siempre: ¿hay un objeto a la izquierda del punto?
- En `G`, `crearArrow()` es una llamada simple; la arrow captura **ese** `this`, no el de `objetoArrow`.
- En `H`, el modo estricto cambia la regla de la llamada simple.

#### Solución

Sobre el código del enunciado:

```js
console.log(usuario.saludar()); // "Ana"
console.log(otro.saludar()); // "Luis"
console.log(saludar()); // undefined
console.log(saludar.call({ nombre: "Eva" })); // "Eva"
console.log(saludar.bind({ nombre: "Eva" })()); // "Eva"
console.log(objetoArrow.crear()()); // "Eva"
console.log(crearArrow()()); // undefined
console.log(
  (function () {
    "use strict";
    return this;
  })()
); // undefined
```

**Línea por línea:**

| Línea | Llamada | `this` | Resultado |
|---|---|---|---|
| A | `usuario.saludar()` | `usuario` | `"Ana"` |
| B | `otro.saludar()` | `otro` | `"Luis"` |
| C | `saludar()` | `globalThis` (no estricto) | `this.nombre` es `undefined` |
| D | `saludar.call({nombre:"Eva"})` | el objeto pasado | `"Eva"` |
| E | `saludar.bind(...)()` | el objeto fijado | `"Eva"` |
| F | `objetoArrow.crear()()` | `objetoArrow` (arrow captura el `this` de `crear`) | `"Eva"` |
| G | `crearArrow()()` | `crearArrow()` pierde el `this`; la arrow captura ese `this` sin `nombre` | `undefined` |
| H | llamada simple en estricto | `undefined` | `undefined` |

**Por qué C no lanza error:** el código no está en modo estricto, así que `this` es el objeto global. `globalThis.nombre` no existe y devuelve `undefined`. Si añadieras `"use strict"` al archivo, lanzaría `TypeError`.

**Por qué G es `undefined` y no `"Eva"`:** la arrow no guarda el objeto donde se creó, sino el **valor de `this`** en el momento de crearse. `crearArrow()` se llamó como función suelta, así que dentro de `crear` el `this` ya no era `objetoArrow`.

---

### Reto 2 — Arreglar `this` en callbacks

**Conceptos:** 4.2.6, 4.3.3, 4.4.

El siguiente código debería sumar `1 + 2 + 3` en `contador.total`, pero no lo hace. Corrígelo de **tres formas distintas** y explica cuál prefieres.

```js
const contador = {
  total: 0,
  sumar(n) {
    this.total += n;
  },
};

[1, 2, 3].forEach(contador.sumar);

console.log(contador.total); // 0 ⚠️
```

#### Solución

```js
const contador = {
  total: 0,
  sumar(n) {
    this.total += n;
  },
};

// Forma 1: bind
[1, 2, 3].forEach(contador.sumar.bind(contador));

console.log(contador.total); // 6
```

```js
const contador = {
  total: 0,
  sumar(n) {
    this.total += n;
  },
};

// Forma 2: arrow que llama al método
[1, 2, 3].forEach((n) => contador.sumar(n));

console.log(contador.total); // 6
```

```js
const contador = {
  total: 0,
  sumar(n) {
    this.total += n;
  },

  // Forma 3: método que usa una arrow interna
  sumarTodos(numeros) {
    numeros.forEach((n) => {
      this.total += n;
    });
    return this.total;
  },
};

console.log(contador.sumarTodos([1, 2, 3])); // 6
```

**Línea por línea (forma 1):**

1. `contador.sumar.bind(contador)` crea una **función nueva** con `this` fijado a `contador`.
2. `forEach` llama a esa función con `(elemento, índice, array)`.
3. El primer parámetro `n` recibe el elemento.
4. `this.total += n` suma correctamente.

**Línea por línea (forma 3):**

1. `sumarTodos` se llama como método: `this` es `contador`.
2. La arrow se crea dentro de `sumarTodos`, así que captura ese `this`.
3. `forEach` llama a la arrow; la arrow ignora el `this` de `forEach`.
4. `this.total` sigue siendo el de `contador`.

**¿Cuál prefiero?** La forma 3 cuando el método ya existe y se va a usar varias veces; la forma 2 cuando el callback es puntual y quieres máxima legibilidad. La forma 1 es útil si necesitas pasar el callback a una API externa que no controlas.

---

### Reto 3 — Aplicación parcial con `bind`

**Conceptos:** 4.3.5.

Crea una función `etiqueta(prefijo, texto)` y, a partir de ella, dos funciones `error` e `info` que solo reciban el texto. Después crea `doble` y `triple` a partir de `multiplicar(a, b)`.

**Requisitos:**

- No dupliques la lógica de `etiqueta` ni de `multiplicar`.
- Comprueba `error.length` y `doble.length`.

#### Solución

```js
function etiqueta(prefijo, texto) {
  return `[${prefijo}] ${texto}`;
}

const error = etiqueta.bind(null, "ERROR");
const info = etiqueta.bind(null, "INFO");

console.log(error("algo falló")); // "[ERROR] algo falló"
console.log(info("todo bien")); // "[INFO] todo bien"
console.log(error.length); // 1

function multiplicar(a, b) {
  return a * b;
}

const doble = multiplicar.bind(null, 2);
const triple = multiplicar.bind(null, 3);

console.log(doble(5)); // 10
console.log(triple(5)); // 15
console.log(doble.length); // 1
```

**Línea por línea:**

1. `etiqueta` recibe dos argumentos.
2. `etiqueta.bind(null, "ERROR")` devuelve una función con el primer argumento ya fijado a `"ERROR"`. El `null` indica que `this` no importa.
3. `error("algo falló")` solo pasa el segundo argumento; el primero ya está.
4. `error.length` es `1` porque falta **un** argumento por recibir.
5. `multiplicar.bind(null, 2)` fija `a = 2`.
6. `doble(5)` llama con `b = 5` → `2 * 5`.
7. `doble.length` es `1`.

**Alternativa sin `bind`:** una función que devuelve otra función.

```js
function crearEtiqueta(prefijo) {
  return (texto) => `[${prefijo}] ${texto}`;
}

const error = crearEtiqueta("ERROR");

console.log(error("algo falló")); // "[ERROR] algo falló"
```

Esta versión es más explícita y no depende de `this`. Para aplicación parcial pura, suele ser preferible.

---

### Reto 4 — Herencia con funciones constructoras

**Conceptos:** 4.5, 4.6.

Sin usar `class`, crea:

- `Vehiculo(marca)` con un método `describir()` en el prototipo.
- `Coche(marca, puertas)` que herede de `Vehiculo`, llame al constructor padre y sobrescriba `describir()` añadiendo el número de puertas.

**Requisitos:**

- `coche instanceof Coche` y `coche instanceof Vehiculo` deben ser `true`.
- `Coche.prototype.constructor` debe apuntar a `Coche`.
- `describir` no debe ser una propiedad propia de la instancia.

#### Solución

```js
function Vehiculo(marca) {
  this.marca = marca;
}

Vehiculo.prototype.describir = function () {
  return "Vehículo " + this.marca;
};

function Coche(marca, puertas) {
  Vehiculo.call(this, marca); // ejecuta el constructor padre con este this
  this.puertas = puertas;
}

Coche.prototype = Object.create(Vehiculo.prototype);
Coche.prototype.constructor = Coche;

Coche.prototype.describir = function () {
  return Vehiculo.prototype.describir.call(this) + " con " + this.puertas + " puertas";
};

const coche = new Coche("Toyota", 4);

console.log(coche.describir()); // "Vehículo Toyota con 4 puertas"
console.log(coche instanceof Coche); // true
console.log(coche instanceof Vehiculo); // true
console.log(Object.hasOwn(coche, "describir")); // false
console.log(Object.getPrototypeOf(coche) === Coche.prototype); // true
console.log(Coche.prototype.constructor === Coche); // true
```

**Línea por línea:**

1. `Vehiculo` asigna `marca` al objeto que `new` creó.
2. `Vehiculo.prototype.describir` define el método una sola vez, compartido.
3. `Coche` recibe dos parámetros.
4. `Vehiculo.call(this, marca)` ejecuta el constructor padre con el `this` del coche. Sin esto, `marca` no se asignaría.
5. `this.puertas = puertas` añade la propiedad propia.
6. `Object.create(Vehiculo.prototype)` crea un objeto cuyo prototipo es el de `Vehiculo`.
7. `Coche.prototype = ...` hace que las instancias de `Coche` hereden de ese objeto.
8. `Coche.prototype.constructor = Coche` restaura la propiedad `constructor`, que se perdió al reasignar `prototype`.
9. `Coche.prototype.describir` sobrescribe el método heredado.
10. `Vehiculo.prototype.describir.call(this)` reutiliza la lógica del padre con el `this` actual.
11. `new Coche(...)` crea el objeto, le pone `Coche.prototype` como prototipo y ejecuta el constructor.
12. `instanceof` recorre la cadena y encuentra ambos prototipos.

**Equivalente con clase:**

```js
class Vehiculo {
  constructor(marca) {
    this.marca = marca;
  }

  describir() {
    return "Vehículo " + this.marca;
  }
}

class Coche extends Vehiculo {
  constructor(marca, puertas) {
    super(marca);
    this.puertas = puertas;
  }

  describir() {
    return super.describir() + " con " + this.puertas + " puertas";
  }
}
```

La clase hace lo mismo con menos pasos manuales y sin riesgo de olvidar `constructor`.

---

### Reto 5 — Constructor seguro con `new.target`

**Conceptos:** 4.6.6, 4.6.7.

Crea `Rango(inicio, fin)` que:

- Funcione con o sin `new`.
- Intercambie los límites si `fin < inicio`.
- Tenga `contiene(n)` y `describir()` en el prototipo.

#### Solución

```js
function Rango(inicio, fin) {
  if (!new.target) {
    return new Rango(inicio, fin);
  }

  if (fin < inicio) {
    const temporal = inicio;
    inicio = fin;
    fin = temporal;
  }

  this.inicio = inicio;
  this.fin = fin;
}

Rango.prototype.contiene = function (n) {
  return n >= this.inicio && n <= this.fin;
};

Rango.prototype.describir = function () {
  return `[${this.inicio}, ${this.fin}]`;
};

const r1 = Rango(10, 3); // sin new
const r2 = new Rango(1, 5); // con new

console.log(r1.describir()); // "[3, 10]"
console.log(r1 instanceof Rango); // true
console.log(r2.contiene(3)); // true
console.log(r2.contiene(9)); // false
console.log(Rango.length); // 2
```

**Línea por línea:**

1. `if (!new.target)` detecta que se llamó sin `new`.
2. `return new Rango(inicio, fin)` vuelve a llamar correctamente y devuelve el objeto.
3. El intercambio usa una variable temporal para no perder `inicio`.
4. `this.inicio` y `this.fin` son propiedades propias.
5. `contiene` compara con los límites.
6. `describir` usa template literals (Módulo 1).
7. `Rango(10, 3)` entra por la rama sin `new`, se re-invoca y devuelve un `Rango`.
8. `r1 instanceof Rango` es `true` porque el objeto se creó con `new` en la segunda llamada.
9. `Rango.length` es `2` porque la función declara dos parámetros.

**¿Por qué no usar `this instanceof Rango`?** Funciona en este caso, pero falla si alguien hace `Object.create(Rango.prototype)` y llama a la función. `new.target` es la comprobación oficial.

---

### Reto 6 — Cuenta bancaria con campos privados

**Conceptos:** 4.7.4, 4.7.5, 4.7.6, 4.7.7.

Crea `CuentaBancaria` con:

- Campos privados `#saldo` y `#movimientos`.
- Un contador estático privado de cuentas creadas.
- Getter `saldo` y `movimientos`.
- `depositar(monto)` y `retirar(monto)` que ignoren montos inválidos y devuelvan `this`.
- Un método estático `esCuenta(obj)` con brand check.

#### Solución

```js
class CuentaBancaria {
  #saldo = 0;
  #movimientos = 0;

  static #cuentas = 0;

  constructor(titular, saldoInicial = 0) {
    this.titular = titular;
    this.#saldo = saldoInicial > 0 ? saldoInicial : 0;
    CuentaBancaria.#cuentas += 1;
  }

  get saldo() {
    return this.#saldo;
  }

  get movimientos() {
    return this.#movimientos;
  }

  depositar(monto) {
    if (typeof monto !== "number" || Number.isNaN(monto) || monto <= 0) {
      return this;
    }

    this.#saldo += monto;
    this.#movimientos += 1;
    return this;
  }

  retirar(monto) {
    if (typeof monto !== "number" || Number.isNaN(monto) || monto <= 0) {
      return this;
    }

    if (monto > this.#saldo) {
      return this;
    }

    this.#saldo -= monto;
    this.#movimientos += 1;
    return this;
  }

  static get cuentas() {
    return CuentaBancaria.#cuentas;
  }

  static esCuenta(objeto) {
    if (objeto === null || typeof objeto !== "object") {
      return false;
    }

    return #saldo in objeto;
  }
}

const cuenta = new CuentaBancaria("Ana", 100);

cuenta.depositar(50).retirar(30).retirar(1000).depositar(-5);

console.log(cuenta.saldo); // 120
console.log(cuenta.movimientos); // 2
console.log(CuentaBancaria.cuentas); // 1
console.log(CuentaBancaria.esCuenta(cuenta)); // true
console.log(CuentaBancaria.esCuenta({})); // false
console.log(Object.keys(cuenta)); // ["titular"]
```

**Línea por línea:**

1. `#saldo = 0` declara un campo privado con valor inicial.
2. `static #cuentas = 0` es un contador compartido por la clase, inaccesible desde fuera.
3. El constructor asigna el titular (público) y normaliza el saldo inicial.
4. `CuentaBancaria.#cuentas += 1` incrementa el contador estático.
5. `get saldo()` expone el saldo en **solo lectura**.
6. `depositar` valida tipo, `NaN` y positividad antes de modificar.
7. `return this` permite encadenar.
8. `retirar` añade la comprobación de saldo suficiente.
9. `static get cuentas()` expone el contador.
10. `static esCuenta(objeto)` comprueba primero que sea un objeto y luego usa `#saldo in objeto` para verificar la marca privada sin acceder al valor.
11. La cadena `depositar(50).retirar(30).retirar(1000).depositar(-5)` solo aplica las dos primeras operaciones.
12. `Object.keys(cuenta)` solo muestra `"titular"`: los privados no son enumerables.

**Salida esperada:** `120`, `2`, `1`, `true`, `false`, `["titular"]`.

**Variante:** añade un historial privado `#historial` con `{ tipo, monto }` y un getter que devuelva una **copia** para que nadie pueda mutarlo desde fuera.

```js
class CuentaConHistorial {
  #saldo = 0;
  #historial = [];

  constructor(saldoInicial = 0) {
    this.#saldo = saldoInicial;
  }

  depositar(monto) {
    if (monto <= 0) return this;
    this.#saldo += monto;
    this.#historial.push({ tipo: "deposito", monto });
    return this;
  }

  get historial() {
    return this.#historial.map((movimiento) => ({ ...movimiento }));
  }
}

const c = new CuentaConHistorial(10);
c.depositar(5);

const copia = c.historial;
copia[0].monto = 999;

console.log(c.historial[0].monto); // 5 ✅ el original no cambió
```

---

### Reto 7 — Jerarquía de figuras con getters

**Conceptos:** 4.7.7, 4.7.8, 4.7.9.

Crea:

- `Figura` con `nombre`, getters `area` y `perimetro` que devuelvan `0`, y `describir()`.
- `Rectangulo(ancho, alto)` que calcule área y perímetro.
- `Circulo(radio)` con `#radio`, que calcule área y perímetro y **extienda** `describir()` con `super`.

#### Solución

```js
class Figura {
  constructor(nombre) {
    this.nombre = nombre;
  }

  get area() {
    return 0;
  }

  get perimetro() {
    return 0;
  }

  describir() {
    return `${this.nombre} con área ${this.area.toFixed(2)}`;
  }
}

class Rectangulo extends Figura {
  constructor(ancho, alto) {
    super("Rectángulo");
    this.ancho = ancho;
    this.alto = alto;
  }

  get area() {
    return this.ancho * this.alto;
  }

  get perimetro() {
    return 2 * (this.ancho + this.alto);
  }
}

class Circulo extends Figura {
  #radio;

  constructor(radio) {
    super("Círculo");
    this.#radio = radio;
  }

  get radio() {
    return this.#radio;
  }

  get area() {
    return Math.PI * this.#radio ** 2;
  }

  get perimetro() {
    return 2 * Math.PI * this.#radio;
  }

  describir() {
    return super.describir() + ` (radio ${this.#radio})`;
  }
}

const figuras = [new Rectangulo(3, 4), new Circulo(2)];

console.log(figuras.map((figura) => figura.describir()));
// ["Rectángulo con área 12.00", "Círculo con área 12.57 (radio 2)"]

console.log(figuras[0].perimetro); // 14
console.log(figuras[1].perimetro.toFixed(2)); // "12.57"
console.log(figuras[1] instanceof Figura); // true
```

**Línea por línea:**

1. `Figura` define la interfaz común: `nombre`, `area`, `perimetro`, `describir`.
2. Los getters base devuelven `0` como valor por defecto.
3. `describir` usa `this.area`, que se resuelve dinámicamente según la subclase.
4. `Rectangulo` llama a `super("Rectángulo")` antes de usar `this`.
5. Sus getters calculan con las propiedades propias.
6. `Circulo` guarda el radio en un campo privado.
7. `super.describir()` ejecuta el método del padre con el `this` del círculo.
8. `Math.PI * this.#radio ** 2` aplica la fórmula del área.
9. `figuras.map(...)` llama a `describir` en cada figura; el método correcto se elige por la cadena de prototipos.
10. `instanceof Figura` es `true` para el círculo porque `Circulo.prototype` hereda de `Figura.prototype`.

**Por qué `describir` en `Figura` funciona con subclases:** `this.area` no se resuelve en `Figura`, se resuelve en el objeto real. Si el objeto es un `Circulo`, se usa el getter de `Circulo`. Esto se llama **despacho dinámico**.

---

### Reto 8 — De herencia a composición

**Conceptos:** 4.9.

El siguiente código modela empleados con herencia. Tiene un problema: un empleado con bono **y** comisión necesita una clase nueva. Refactorízalo con composición para que los extras se combinen libremente.

```js
class Empleado {
  constructor(nombre, salario) {
    this.nombre = nombre;
    this.salario = salario;
  }

  calcularPago() {
    return this.salario;
  }
}

class EmpleadoConBono extends Empleado {
  constructor(nombre, salario, bono) {
    super(nombre, salario);
    this.bono = bono;
  }

  calcularPago() {
    return this.salario + this.bono;
  }
}

class EmpleadoConComision extends Empleado {
  constructor(nombre, salario, porcentaje) {
    super(nombre, salario);
    this.porcentaje = porcentaje;
  }

  calcularPago() {
    return this.salario * (1 + this.porcentaje / 100);
  }
}
```

**Requisitos:**

- `crearEmpleado(nombre, salario, extras)`.
- Cada extra es una función `(total) => nuevoTotal`.
- `calcularPago()` aplica los extras en orden.
- Ana: salario 1000, bono 200 y comisión 10% → 1320.
- Luis: salario 1000, comisión 5% y descuento 100 → 950.

#### Solución

```js
function crearEmpleado(nombre, salario, extras = []) {
  return {
    nombre,
    salario,

    calcularPago() {
      return extras.reduce((total, extra) => extra(total), salario);
    },

    resumen() {
      return `${nombre}: ${this.calcularPago()}`;
    },
  };
}

const bono = (monto) => (total) => total + monto;
const comision = (porcentaje) => (total) => total * (1 + porcentaje / 100);
const descuento = (monto) => (total) => Math.max(0, total - monto);

const ana = crearEmpleado("Ana", 1000, [bono(200), comision(10)]);
const luis = crearEmpleado("Luis", 1000, [comision(5), descuento(100)]);

console.log(ana.calcularPago()); // 1320
console.log(luis.calcularPago()); // 950
console.log(ana.resumen()); // "Ana: 1320"
```

**Línea por línea:**

1. `crearEmpleado` recibe los datos y un array de extras.
2. `extras = []` evita el error si no se pasan extras.
3. `calcularPago` usa `reduce` con `salario` como valor inicial.
4. Cada `extra` recibe el total acumulado y devuelve uno nuevo.
5. `bono(200)` devuelve una función que suma 200.
6. `comision(10)` devuelve una función que multiplica por `1.10`.
7. `descuento(100)` devuelve una función que resta 100 sin bajar de 0.
8. Ana: `1000 → 1200 → 1320`.
9. Luis: `1000 → 1050 → 950`.
10. `resumen` usa `this.calcularPago()`, así que funciona con cualquier combinación de extras.

**Ventaja:** añadir un extra nuevo (`plusTransporte`, `bonoObjetivos`) no requiere tocar `crearEmpleado` ni crear clases.

**Cuándo seguirías usando clases:** si los extras tuvieran estado complejo, identidad propia o necesitaras `instanceof` para guardar o enviar los datos. En ese caso, composición de objetos con clases pequeñas.

---

### Reto 9 — Configuración a prueba de balas con descriptores

**Conceptos:** 4.8.4, 4.8.5, 4.8.8.

Crea `crearConfiguracion(datos)` que devuelva un objeto:

- Con `version` y `entorno` de **solo lectura** y enumerables.
- Con `_interno` legible pero **no enumerable**.
- Congelado.

Comprueba que no se puede cambiar `version` ni `entorno`.

#### Solución

```js
function crearConfiguracion(datos) {
  const config = {};

  Object.defineProperties(config, {
    version: {
      value: "1.0.0",
      writable: false,
      enumerable: true,
      configurable: false,
    },
    entorno: {
      value: datos.entorno,
      writable: false,
      enumerable: true,
      configurable: false,
    },
    _interno: {
      value: datos.interno,
      writable: true,
      enumerable: false,
      configurable: false,
    },
  });

  return Object.freeze(config);
}

const config = crearConfiguracion({ entorno: "dev", interno: 42 });

config.version = "2.0.0"; // ignorado
config.entorno = "prod"; // ignorado

console.log(config.version); // "1.0.0"
console.log(config.entorno); // "dev"
console.log(config._interno); // 42
console.log(Object.keys(config)); // ["version", "entorno"]
console.log(Object.isFrozen(config)); // true
console.log(Object.getOwnPropertyDescriptor(config, "version").writable); // false
```

**Línea por línea:**

1. `crearConfiguracion` recibe los datos variables.
2. `Object.defineProperties` define varias propiedades a la vez.
3. `version` es fija, enumerable y no configurable.
4. `entorno` toma el valor recibido, también de solo lectura.
5. `_interno` es legible, pero no aparece en `Object.keys`; el `freeze` posterior lo vuelve no modificable.
6. `Object.freeze` impide añadir o quitar propiedades y refuerza la inmutabilidad.
7. Las asignaciones a `version` y `entorno` se ignoran (en modo estricto lanzarían `TypeError`).
8. `Object.keys` solo muestra las enumerables.
9. `Object.isFrozen` confirma el congelado.
10. El descriptor confirma `writable: false`.

**¿Por qué definimos `_interno` con `writable: true` si luego congelamos el objeto?** Porque el descriptor original describe la intención, pero `Object.freeze` lo refuerza cambiando `writable` a `false` en todas las propiedades de datos. Si quieres que `_interno` sea modificable, no congeles el objeto entero: usa solo `defineProperties` y `preventExtensions`.

```js
function crearConfiguracionAbierta(datos) {
  const config = {};

  Object.defineProperties(config, {
    version: { value: "1.0.0", writable: false, enumerable: true },
    _interno: { value: datos.interno, writable: true, enumerable: false },
  });

  Object.preventExtensions(config);

  return config;
}

const c = crearConfiguracionAbierta({ interno: 1 });
c._interno = 2;

console.log(c._interno); // 2 ✅
console.log(c.version); // "1.0.0"
```

> ⚠️ Un objeto con `_interno` “privado” sigue siendo accesible desde fuera. Si necesitas privacidad real, usa `#` en una clase o un closure.

---

### Reto 10 — Inspector de valores

**Conceptos:** 4.10, 4.5.6, 4.11.14.

Crea tres funciones:

1. `tipoReal(valor)` que devuelva `"Array"`, `"Null"`, `"Map"`, etc.
2. `mismosDatos(a, b)` que compare objetos y arrays **en profundidad**.
3. `puedeHacer(objeto, metodo)` que compruebe duck typing sin lanzar error con `null` o `undefined`.

#### Solución

```js
function tipoReal(valor) {
  return Object.prototype.toString.call(valor).slice(8, -1);
}

function mismosDatos(a, b) {
  if (Object.is(a, b)) {
    return true;
  }

  if (a === null || b === null) {
    return false;
  }

  if (typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  if (Array.isArray(a) !== Array.isArray(b)) {
    return false;
  }

  const clavesA = Object.keys(a);
  const clavesB = Object.keys(b);

  if (clavesA.length !== clavesB.length) {
    return false;
  }

  return clavesA.every(
    (clave) => Object.hasOwn(b, clave) && mismosDatos(a[clave], b[clave])
  );
}

function puedeHacer(objeto, metodo) {
  if (objeto === null || objeto === undefined) {
    return false;
  }

  return typeof objeto[metodo] === "function";
}

console.log(tipoReal([])); // "Array"
console.log(tipoReal(null)); // "Null"
console.log(tipoReal(new Map())); // "Map"
console.log(tipoReal(undefined)); // "Undefined"
console.log(tipoReal("x")); // "String"

console.log(mismosDatos({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })); // true
console.log(mismosDatos({ a: 1 }, { a: 2 })); // false
console.log(mismosDatos([1, [2]], [1, [2]])); // true
console.log(mismosDatos([1], [{ 0: 1 }])); // false
console.log(mismosDatos(NaN, NaN)); // true

console.log(puedeHacer({ volar() { return "vuela"; } }, "volar")); // true
console.log(puedeHacer({}, "volar")); // false
console.log(puedeHacer(null, "volar")); // false
```

**Línea por línea de `tipoReal`:**

1. `Object.prototype.toString.call(valor)` obtiene la etiqueta interna.
2. `.slice(8, -1)` quita `"[object "` (8 caracteres) y `"]"` (el último).

**Línea por línea de `mismosDatos`:**

1. `Object.is(a, b)` cubre el caso de la misma referencia y también `NaN`.
2. Si alguno es `null`, no son iguales (salvo que ambos lo fueran, ya cubierto por `Object.is`).
3. Si alguno no es objeto, no son iguales (los primitivos distintos ya fallaron en el paso 1).
4. Si uno es array y el otro no, no son iguales.
5. Se obtienen las claves propias enumerables de ambos.
6. Si el número de claves difiere, no son iguales.
7. `every` comprueba que cada clave de `a` exista en `b` y que sus valores sean iguales recursivamente.
8. `Object.hasOwn(b, clave)` evita aceptar propiedades heredadas.

**Línea por línea de `puedeHacer`:**

1. Si el objeto es `null` o `undefined`, devuelve `false` sin intentar acceder a la propiedad.
2. `typeof objeto[metodo] === "function"` comprueba la capacidad.

**Limitaciones de `mismosDatos`:**

- No compara `Map`, `Set` ni `Date`.
- No detecta ciclos: un objeto que se referencia a sí mismo provoca recursión infinita.
- Solo compara propiedades enumerables propias.
- `Object.is(NaN, NaN)` es `true`, lo cual es deseable aquí.

**Versión con detección de ciclos (avanzada, usa `Set` del Módulo 3):**

```js
function mismosDatosSeguro(a, b, vistos = new Set()) {
  if (Object.is(a, b)) return true;

  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }

  if (vistos.has(a)) {
    return true; // ya comparamos este par; evita el ciclo infinito
  }

  vistos.add(a);

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  const clavesA = Object.keys(a);
  const clavesB = Object.keys(b);

  if (clavesA.length !== clavesB.length) return false;

  return clavesA.every(
    (clave) => Object.hasOwn(b, clave) && mismosDatosSeguro(a[clave], b[clave], vistos)
  );
}
```

> 📌 Esta versión es una simplificación: `vistos` debería rastrear **pares**, no solo `a`. Para producción usa una librería de igualdad profunda o `structuredClone` combinado con comparación. Lo importante aquí es entender el problema del ciclo.

---

### Reto 11 (opcional) — Mini librería de objetos

**Conceptos:** todo el módulo.

Diseña un pequeño módulo con:

- `crearCuenta(titular, saldo)` con privacidad por closure.
- `transferir(origen, destino, monto)` que valide y devuelva un booleano.
- `resumen(cuenta)` que devuelva `"titular: saldo"`.

**Restricciones:** sin clases, sin `#`, sin `this` en los métodos públicos.

#### Solución

```js
function crearCuenta(titular, saldoInicial = 0) {
  let saldo = saldoInicial > 0 ? saldoInicial : 0;

  return {
    titular,

    getSaldo() {
      return saldo;
    },

    depositar(monto) {
      if (typeof monto !== "number" || Number.isNaN(monto) || monto <= 0) {
        return false;
      }
      saldo += monto;
      return true;
    },

    retirar(monto) {
      if (typeof monto !== "number" || Number.isNaN(monto) || monto <= 0) {
        return false;
      }
      if (monto > saldo) {
        return false;
      }
      saldo -= monto;
      return true;
    },
  };
}

function transferir(origen, destino, monto) {
  if (!origen.retirar(monto)) {
    return false;
  }

  if (!destino.depositar(monto)) {
    origen.depositar(monto); // revierte
    return false;
  }

  return true;
}

function resumen(cuenta) {
  return `${cuenta.titular}: ${cuenta.getSaldo()}`;
}

const ana = crearCuenta("Ana", 100);
const luis = crearCuenta("Luis", 50);

console.log(transferir(ana, luis, 30)); // true
console.log(resumen(ana)); // "Ana: 70"
console.log(resumen(luis)); // "Luis: 80"

console.log(transferir(ana, luis, 1000)); // false
console.log(resumen(ana)); // "Ana: 70"

console.log("saldo" in ana); // false ✅ privado
```

**Línea por línea:**

1. `saldo` es una variable del closure, no una propiedad.
2. Cada método accede a `saldo` directamente, sin `this`.
3. `getSaldo` es la única forma de leerlo.
4. `depositar` valida y modifica el closure.
5. `retirar` valida y comprueba fondos.
6. `transferir` primero retira del origen.
7. Si el depósito en destino falla, revierte devolviendo el monto al origen.
8. `resumen` usa la API pública, no el estado interno.
9. `"saldo" in ana` es `false` porque el estado vive en el closure.

**Ventaja:** los métodos se pueden desacoplar sin perder el estado.

```js
const getSaldo = ana.getSaldo;
console.log(getSaldo()); // 70 ✅
```

**Desventaja:** no hay `instanceof`, y cada cuenta tiene sus propias funciones.

---

## 4.13 — Errores, glosario y autoevaluación

### 4.13.1 Los 15 errores más frecuentes

| # | Error | Qué pasa | Solución |
|---|---|---|---|
| 1 | Pasar un método suelto como callback | `this` se pierde | `bind`, arrow o llamada explícita |
| 2 | Usar una arrow como método | `this` no es el objeto | Usar método normal |
| 3 | Esperar que una función anidada herede `this` | `this` es global/`undefined` | `self`, `bind` o arrow |
| 4 | Creer que `bind` ejecuta la función | Devuelve otra función | Llamar al resultado |
| 5 | Re-vincular una función ya vinculada | El segundo `bind` no cambia `this` | Crear desde la función original |
| 6 | Olvidar `new` en un constructor | Contamina el global o lanza error | `new.target` o clase |
| 7 | Definir métodos dentro del constructor | Una función por instancia | Ponerlos en `prototype` |
| 8 | Reasignar `prototype` y perder `constructor` | `instanceof` y `constructor` fallan | Restaurar `constructor` |
| 9 | Usar `this` antes de `super()` | `ReferenceError` | Llamar a `super()` primero |
| 10 | Confundir `static` con instancia | `undefined` en la instancia | Acceder desde la clase |
| 11 | Creer que `#campo` se hereda entre clases | Las subclases no acceden a privados del padre | Métodos protegidos en el padre |
| 12 | Creer que `freeze` es profundo | Los objetos anidados siguen mutables | Congelado recursivo |
| 13 | Confundir `enumerable: false` con privacidad | La propiedad sigue accesible | `#` o closure |
| 14 | Heredar solo para reutilizar código | Jerarquías rígidas | Composición |
| 15 | Comparar objetos con `===` | Compara referencias | Función de igualdad profunda |

### 4.13.2 Errores que verás en la consola

| Mensaje | Causa | Solución |
|---|---|---|
| `TypeError: Cannot read properties of undefined (reading 'x')` | `this` es `undefined` | Revisar cómo se llamó la función |
| `TypeError: Cannot set properties of undefined` | `this` es `undefined` en una asignación | Igual que arriba |
| `TypeError: Class constructor X cannot be invoked without 'new'` | Llamaste a una clase sin `new` | Añadir `new` |
| `ReferenceError: Must call super constructor...` | Usaste `this` antes de `super()` | Mover `super()` arriba |
| `ReferenceError: Cannot access 'X' before initialization` | TDZ de una clase | Definir antes de usar |
| `TypeError: X is not a constructor` | Arrow o método abreviado con `new` | Usar función normal o clase |
| `TypeError: Cannot redefine property: x` | `configurable: false` | No redefinir |
| `RangeError: Maximum call stack size exceeded` | Getter recursivo o recursión infinita | Revisar la propiedad que se lee |
| `SyntaxError: Private field '#x' must be declared in an enclosing class` | Acceso a privado desde fuera | Usar un método público |
| `TypeError: Cannot add property x, object is not extensible` | `preventExtensions`/`freeze` | No añadir propiedades |

### 4.13.3 Glosario del módulo

| Término | Definición |
|---|---|
| `this` | Contexto de ejecución asignado en cada llamada |
| `globalThis` | Referencia estándar al objeto global |
| `call` | Llama a una función con `this` y argumentos separados |
| `apply` | Llama a una función con `this` y argumentos en array |
| `bind` | Devuelve una función con `this` y argumentos prefijados |
| Aplicación parcial | Fijar algunos argumentos de una función |
| `[[Prototype]]` | Enlace interno al prototipo de un objeto |
| Cadena de prototipos | Secuencia de prototipos que se recorre al buscar propiedades |
| `prototype` | Propiedad de las funciones que será el prototipo de las instancias |
| `constructor` | Propiedad que apunta a la función que creó el objeto |
| Herencia | Relación “es un” entre clases |
| Composición | Construir objetos combinando piezas |
| Mixin | Función que añade capacidades a una clase |
| Delegación | Un objeto usa métodos de otro a través del prototipo |
| `new` | Operador que crea un objeto y ejecuta un constructor |
| `new.target` | Función que se está construyendo, o `undefined` |
| Instancia | Objeto creado a partir de un constructor o clase |
| Clase | Sintaxis para definir constructores y jerarquías |
| `extends` | Declara herencia entre clases |
| `super` | Acceso al constructor o métodos del padre |
| `static` | Miembro que pertenece a la clase, no a la instancia |
| Campo privado | Propiedad `#` inaccesible desde fuera de la clase |
| Brand check | Comprobar la existencia de un campo privado con `#x in obj` |
| Getter | Función que se ejecuta al leer una propiedad |
| Setter | Función que se ejecuta al escribir una propiedad |
| Descriptor | Ficha técnica de una propiedad |
| `writable` | Si el valor se puede cambiar |
| `enumerable` | Si la propiedad aparece en recorridos |
| `configurable` | Si la propiedad se puede borrar o redefinir |
| `Object.freeze` | Congela un objeto superficialmente |
| `instanceof` | Comprueba si un prototipo está en la cadena |
| Duck typing | Usar un objeto por lo que sabe hacer, no por su clase |
| `Symbol.hasInstance` | Personaliza el comportamiento de `instanceof` |
| `Symbol.toStringTag` | Personaliza la etiqueta de `Object.prototype.toString` |
| Singleton | Instancia única compartida |
| Objeto de valor | Objeto inmutable definido por su contenido |
| Estrategia | Patrón que elige un algoritmo en tiempo de ejecución |
| Despacho dinámico | Elegir el método según el objeto real en tiempo de ejecución |

### 4.13.4 Autoevaluación

Responde sin mirar el módulo. Si fallas alguna, vuelve a la sección indicada.

1. ¿Qué valor tiene `this` en `obj.metodo()`? *(4.2.2)*
2. ¿Qué valor tiene `this` en una llamada simple en modo estricto? *(4.2.1)*
3. ¿Por qué una arrow no sirve como método que usa `this`? *(4.2.5)*
4. ¿Qué devuelve `bind`? *(4.3.3)*
5. ¿Qué diferencia hay entre `call` y `apply`? *(4.3.1, 4.3.2)*
6. ¿Qué hace `new` paso a paso? *(4.6.2)*
7. ¿Qué es `Fn.prototype` y qué relación tiene con las instancias? *(4.6.3)*
8. ¿Por qué los métodos deben ir en el prototipo? *(4.6.4)*
9. ¿Qué comprueba exactamente `instanceof`? *(4.10.1)*
10. ¿Qué diferencia hay entre un campo `#x` y una propiedad `_x`? *(4.7.6)*
11. ¿Qué hace `super()` y cuándo es obligatorio? *(4.7.8)*
12. ¿Cuál es el orden de inicialización de campos y constructores con herencia? *(4.7.10)*
13. ¿Qué diferencia hay entre `Object.freeze` y `Object.seal`? *(4.8.8)*
14. ¿Por qué el spread no conserva un getter? *(4.8.7)*
15. ¿Cuándo usarías composición en vez de herencia? *(4.9.8)*
16. ¿Qué es un mixin? *(4.9.4)*
17. ¿Qué ventaja tiene un brand check sobre `instanceof`? *(4.10.6)*
18. ¿Por qué `typeof null` es `"object"`? *(4.10.3)*
19. ¿Qué es duck typing? *(4.10.5)*
20. ¿Por qué comparar objetos con `===` no compara su contenido? *(4.11.14)*

**Respuestas breves:**

1. `obj`.
2. `undefined`.
3. Porque captura el `this` del ámbito donde se creó, no el del objeto desde el que se llama.
4. Una función nueva con el `this` (y argumentos) fijados.
5. `call` recibe argumentos separados; `apply` los recibe en un array o array-like.
6. Crea un objeto, le asigna `Fn.prototype`, ejecuta `Fn` con ese `this` y devuelve el objeto salvo que `Fn` devuelva otro objeto.
7. Es el objeto que será el prototipo de las instancias creadas con `new Fn()`.
8. Para compartir una sola copia entre todas las instancias y ahorrar memoria.
9. Si `Constructor.prototype` está en la cadena de prototipos del objeto.
10. `#x` es privacidad real; `_x` es solo una convención accesible desde fuera.
11. Llama al constructor del padre. Es obligatorio en clases derivadas antes de usar `this`.
12. Campos base → constructor base → campos derivada → constructor derivada.
13. `freeze` impide modificar valores; `seal` permite modificar valores existentes pero no añadir ni borrar.
14. Porque el spread copia valores, y para obtener el valor de un getter lo ejecuta.
15. Cuando la relación no es “es un”, cuando necesitas combinar capacidades o cuando la jerarquía crece demasiado.
16. Una función que recibe una clase y devuelve otra con capacidades añadidas.
17. No se puede falsear desde fuera y no depende de la cadena de prototipos.
18. Es un bug histórico de la primera implementación que se mantuvo por compatibilidad.
19. Usar un objeto según los métodos o propiedades que tiene, sin comprobar su clase.
20. Porque `===` compara referencias, no contenido.

### 4.13.5 Checklist de dominio

Marca cada punto solo si puedes explicarlo **y** escribirlo sin mirar:

- [ ] Predigo el valor de `this` en llamadas simples, métodos, `new`, `call`, `apply`, `bind` y arrows.
- [ ] Explico por qué se pierde `this` en un callback y lo arreglo de tres formas.
- [ ] Uso `bind` para aplicación parcial y explico `length`.
- [ ] Dibujo la cadena de prototipos de un objeto creado con `Object.create`.
- [ ] Explico los cuatro pasos de `new` y los simulo con `Object.create` + `apply`.
- [ ] Escribo una jerarquía con funciones constructoras y con clases.
- [ ] Uso `new.target` para detectar el olvido de `new`.
- [ ] Defino campos privados, métodos privados y estáticos privados.
- [ ] Uso `super()` y `super.metodo()` correctamente.
- [ ] Explico el orden de inicialización con campos y herencia.
- [ ] Creo getters y setters con validación.
- [ ] Inspecciono y defino propiedades con descriptores.
- [ ] Explico la diferencia entre `freeze`, `seal` y `preventExtensions`.
- [ ] Decido entre herencia, mixins, composición y fábrica con criterio.
- [ ] Implemento una estrategia configurable sin `if/else` gigantes.
- [ ] Uso `instanceof`, `Array.isArray`, `typeof`, `Object.prototype.toString.call` y brand checks según el caso.
- [ ] Escribo una igualdad profunda recursiva y explico sus límites.
- [ ] Evito los anti-patrones de la sección 4.11.

### 4.13.6 Qué viene en el Módulo 5

El Módulo 5 cubre **asincronía**:

- Call Stack, Web APIs, Task Queue y Event Loop.
- `setTimeout`, `setInterval` y temporizadores.
- Callbacks y el infierno de callbacks.
- Promesas: estados, `then`, `catch`, `finally`, encadenamiento.
- `async/await`, `try/catch` y manejo de errores asíncronos.
- `Promise.all`, `allSettled`, `race`, `any`.
- Microtareas vs macrotareas.
- Patrones de concurrencia y cancelación.

Todo lo que has aprendido aquí se usa allí: las promesas son objetos con métodos que dependen de `this`, y los callbacks asíncronos son el escenario donde más se pierde el contexto.

---

## 🧭 Resumen del Módulo 4

| Sección | Idea clave |
|---|---|
| 4.1 | `this` depende de **cómo** se llama la función, no de dónde se escribe |
| 4.2 | Cinco formas de llamada; las arrows usan el `this` léxico |
| 4.3 | `call`, `apply` y `bind` controlan el contexto y los argumentos |
| 4.4 | `self`, arrow, `bind` y campos arrow evitan perder `this` |
| 4.5 | Los objetos se enlazan por una cadena de prototipos |
| 4.6 | `new` crea un objeto, le pone el prototipo, ejecuta el constructor y lo devuelve |
| 4.7 | Las clases son azúcar sobre prototipos, con privacidad y `super` |
| 4.8 | Los descriptores controlan escritura, enumeración y configuración |
| 4.9 | Herencia para “es un”; composición para capacidades |
| 4.10 | Cada comprobación de tipo responde una pregunta distinta |
| 4.11 | Patrones simples y anti-patrones que debes reconocer |
| 4.12 | Once retos que integran todo el módulo |
| 4.13 | Errores, glosario, autoevaluación y checklist |

---

> **Fin del Módulo 4.**
>
> Guarda este archivo y practica los retos en Node antes de pasar al Módulo 5.
> Si algo no cuadra con lo explicado, es un error del material: avísame y lo corrijo.
