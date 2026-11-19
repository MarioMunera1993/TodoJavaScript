# 🟨 Curso Completo de JavaScript — De Cero Absoluto a Experto

> **Módulo 2 — Funciones y Alcance (Scope)**
>
> Última actualización: 2026-11-13
> Nivel: principiante con bases del Módulo 1
> Requisitos: haber completado el Módulo 1

---

## 📋 Índice del módulo

1. [Qué es una función](#21--qué-es-una-función)
2. [Formas de declarar funciones](#22--formas-de-declarar-funciones)
3. [Parámetros y argumentos](#23--parámetros-y-argumentos)
4. [Scope: el ámbito de las variables](#24--scope-el-ámbito-de-las-variables)
5. [Hoisting a fondo](#25--hoisting-a-fondo)
6. [Closures](#26--closures)
7. [Recursión](#27--recursión)
8. [Funciones de orden superior y callbacks](#28--funciones-de-orden-superior-y-callbacks-sincrónicos)
9. [Buenas prácticas y anti-patrones](#29--buenas-prácticas-y-anti-patrones)
10. [Retos con solución explicada](#210--retos-con-solución-explicada)
11. [Errores comunes, glosario y autoevaluación](#211--errores-comunes-glosario-y-autoevaluación)

---

## Convención pedagógica

Este módulo solo usa conceptos **ya explicados**. Antes de empezar, este es el inventario exacto:

**Ya sabes usar (Módulo 1):**

- Variables: `const`, `let`, `var` (y por qué evitamos `var`).
- Tipos: `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`, objetos y arrays básicos.
- Operadores: aritméticos, comparación estricta, lógicos, ternario, `typeof`, `in`.
- Control de flujo: `if/else`, `switch`, `for`, `while`, `do...while`, `for...of`, `for...in`.
- Strings: `length`, índices, `trim`, `toUpperCase`, `toLowerCase`, `includes`, `repeat`, `padStart`, `split`.
- Números: `Number()`, `Number.isFinite`, `Number.isNaN`, `Number.isInteger`, `toFixed`.
- Funciones **como herramienta**: ya las has usado en ejemplos y retos, pero aún no las has estudiado formalmente. Eso es exactamente lo que haremos aquí.

**Lo que NO usaremos todavía (y por qué):**

| Concepto | Módulo donde se estudia |
|---|---|
| `this`, `call`, `apply`, `bind` | Módulo 4 |
| Clases, `new`, prototipos | Módulo 4 |
| Destructuring, spread, `Map`, `Set` | Módulo 3 |
| `map`, `filter`, `reduce`, `sort` | Módulo 3 |
| `?.`, `??` en código nuevo | Módulo 3 |
| Promesas, `async/await`, `setTimeout` | Módulo 5 |
| DOM, eventos | Módulo 6 |
| `import`/`export`, `try/catch`, JSON | Módulo 7 |

> 📌 Si en algún ejemplo ves algo que no está en la lista de "ya sabes", es un error del material. Avísame y lo corrijo.

---

## 2.1 — Qué es una función

### 2.1.1 Definición

Una **función** es un bloque de código con nombre que:

1. Recibe **datos de entrada** (parámetros).
2. Ejecuta una tarea.
3. Devuelve **un resultado** (opcionalmente).

```js
function sumar(a, b) {
  return a + b;
}

const resultado = sumar(2, 3);
console.log(resultado); // 5
```

**Anatomía:**

```text
function  sumar  (a, b)  {  return a + b;  }
   │        │     │  │          │
   │        │     │  │          └── cuerpo: lo que hace
   │        │     │  └───────────── parámetro 2
   │        │     └──────────────── parámetro 1
   │        └────────────────────── nombre
   └─────────────────────────────── palabra clave
```

- **Parámetros:** los nombres que aparecen en la definición (`a`, `b`).
- **Argumentos:** los valores reales que pasas al llamar (`2`, `3`).
- **Cuerpo:** las instrucciones entre `{ }`.
- **`return`:** devuelve un valor y **termina** la función inmediatamente.

### 2.1.2 Por qué existen las funciones

Sin funciones, un programa es una lista interminable de instrucciones repetidas. Las funciones aportan:

| Beneficio | Explicación |
|---|---|
| **Abstracción** | Le pones nombre a una tarea y dejas de pensar en sus detalles |
| **Reutilización** | Escribes una vez, usas mil |
| **Legibilidad** | `calcularTotal(...)` se entiende mejor que 10 líneas de aritmética |
| **Mantenimiento** | Cambias la lógica en un solo lugar |
| **Testabilidad** | Puedes probar cada función por separado |
| **Depuración** | El *stack trace* (la lista de llamadas que el motor imprime al fallar) te dice exactamente qué función falló |

### 2.1.3 `return`: la pieza que más se olvida

```js
// ❌ No devuelve nada: solo imprime
function sumarMal(a, b) {
  console.log(a + b);
}

const r1 = sumarMal(2, 3); // imprime 5
console.log(r1);           // undefined ⚠️

// ✅ Devuelve el valor para que quien llama decida qué hacer
function sumarBien(a, b) {
  return a + b;
}

const r2 = sumarBien(2, 3);
console.log(r2);           // 5
```

**Reglas de `return`:**

1. Si no hay `return`, la función devuelve `undefined`.
2. `return` **corta** la ejecución: lo que esté después no se ejecuta.
3. `return` sin valor devuelve `undefined`.
4. Solo se puede devolver **un valor** (si necesitas varios, devuelve un array o un objeto; ambos ya los conoces).

```js
function clasificar(edad) {
  if (edad < 0) {
    return "inválida";     // corta aquí
  }
  if (edad < 18) {
    return "menor";        // corta aquí
  }
  return "adulto";         // último caso
}
```

### 2.1.4 Funciones como valores

En JavaScript las funciones son **valores**: se pueden guardar en variables, pasar como argumentos y devolver desde otras funciones.

```js
function saludar() {
  return "Hola";
}

const otraReferencia = saludar; // NO se llama: se copia la referencia
console.log(typeof saludar);    // "function"
console.log(otraReferencia());  // "Hola"
```

**Diferencia crucial:**

```js
console.log(saludar);   // muestra la función (su representación)
console.log(saludar()); // ejecuta la función y muestra "Hola"
```

Los paréntesis **ejecutan**. Sin paréntesis, solo estás usando la función como valor.

### 2.1.5 Efectos secundarios

Una función tiene **efecto secundario** cuando modifica algo fuera de ella: imprime, cambia una variable global, muta un objeto recibido, escribe en un archivo, etc.

```js
// ✅ Devuelve un valor, no modifica nada externo
function calcularDoble(numero) {
  return numero * 2;
}

// ⚠️ Efecto secundario: modifica el array recibido
function agregarElemento(lista, elemento) {
  lista[lista.length] = elemento;
}
```

Los efectos secundarios no son "malos" por sí mismos (imprimir o guardar datos son efectos necesarios), pero deben ser **intencionales y visibles**. El estudio formal de funciones puras llega en el Módulo 7.

---

## 2.2 — Formas de declarar funciones

Hay tres formas principales. Las tres crean funciones, pero **no se comportan igual**.

### 2.2.1 Declaración de función (*function declaration*)

```js
function sumar(a, b) {
  return a + b;
}
```

- Tiene nombre obligatorio.
- Se **iza completa**: puedes llamarla antes de la línea donde está escrita.
- Es la forma más legible para funciones principales.

```js
console.log(sumar(2, 3)); // 5 ✅ funciona aunque esté definida después

function sumar(a, b) {
  return a + b;
}
```

### 2.2.2 Expresión de función (*function expression*)

```js
const sumar = function (a, b) {
  return a + b;
};
```

- La función se asigna a una variable.
- Puede ser anónima (sin nombre) o nombrada.
- **No** puedes llamarla antes de la asignación: la variable sigue las reglas de `const`/`let`/`var`.

```js
console.log(sumar(2, 3)); // ❌ ReferenceError: Cannot access 'sumar' before initialization

const sumar = function (a, b) {
  return a + b;
};
```

Con `var`, el error cambia:

```js
console.log(sumar(2, 3)); // ❌ TypeError: sumar is not a function

var sumar = function (a, b) {
  return a + b;
};
```

¿Por qué? Porque `var sumar` se iza e inicializa con `undefined`; `undefined(2, 3)` no es una función. Es otra razón para no usar `var`.

**Expresión nombrada** (útil para depurar, el nombre solo existe dentro de la función):

```js
const factorial = function calcular(n) {
  if (n <= 1) return 1;
  return n * calcular(n - 1);
};
```

### 2.2.3 Arrow function (*función flecha*, ES6)

```js
const sumar = (a, b) => {
  return a + b;
};
```

Sintaxis compacta. Reglas:

**1. Si el cuerpo es una sola expresión, el `return` es implícito:**

```js
const sumar = (a, b) => a + b;
const cuadrado = (n) => n * n;
const saludar = () => "Hola";
```

**2. Con un solo parámetro, los paréntesis son opcionales:**

```js
const cuadrado = n => n * n;
```

**3. Si el cuerpo lleva llaves `{ }`, necesitas `return` explícito:**

```js
const sumar = (a, b) => {
  const resultado = a + b;
  return resultado;
};
```

**4. Para devolver un objeto literal, envuélvelo en paréntesis:**

```js
// ❌ Las llaves se interpretan como bloque de código → devuelve undefined
const crearUsuarioMal = () => { nombre: "Ana" };

// ✅ Paréntesis que envuelven el objeto
const crearUsuarioBien = () => ({ nombre: "Ana" });

console.log(crearUsuarioBien()); // { nombre: 'Ana' }
```

**5. No tienen su propio `this`, ni `arguments`, ni se pueden usar con `new`.**

> 📌 `this` y `new` se estudian en el Módulo 4. Por ahora quédate con la regla práctica: **no uses arrow functions como métodos de objeto**; para eso usa una función normal.

### 2.2.4 Tabla comparativa

| Característica | Declaración | Expresión | Arrow |
|---|---|---|---|
| Se iza completa | ✅ Sí | ❌ No | ❌ No |
| Nombre obligatorio | ✅ Sí | ❌ Opcional | ❌ No |
| `return` implícito | ❌ No | ❌ No | ✅ Si no hay llaves |
| Tiene su propio `this` | ✅ Sí | ✅ Sí | ❌ No (Módulo 4) |
| Tiene `arguments` | ✅ Sí | ✅ Sí | ❌ No |
| Se puede usar con `new` | ✅ Sí | ✅ Sí | ❌ No (Módulo 4) |
| Legibilidad para funciones grandes | ✅ Alta | ⚠️ Media | ⚠️ Baja |

### 2.2.5 ¿Cuál uso?

```js
// ✅ Declaración: funciones principales, con nombre y posible hoisting
function calcularTotal(subtotal, iva) {
  return subtotal * (1 + iva);
}

// ✅ Expresión: cuando la función es un valor que asignas o pasas
const formatearEuros = function (cantidad) {
  return `${cantidad.toFixed(2)} €`;
};

// ✅ Arrow: operaciones cortas, callbacks y funciones de una línea
const duplicar = (n) => n * 2;
```

> 🧠 **Regla práctica:** usa declaraciones para lo importante y arrows para lo breve. No hay una "mejor" universal; hay contexto.

### 2.2.6 Anti-patrón: arrow con llaves que no devuelve nada

```js
// ❌ Se espera que devuelva el doble, pero las llaves crean un bloque sin return
const duplicarMal = (n) => {
  n * 2;
};

console.log(duplicarMal(5)); // undefined ⚠️

// ✅ Sin llaves: return implícito
const duplicarBien = (n) => n * 2;

// ✅ O con llaves y return explícito
const duplicarBien2 = (n) => {
  return n * 2;
};
```

### 2.2.7 IIFE: una función que se ejecuta al definirse

Una **IIFE** (*Immediately Invoked Function Expression*, "expresión de función invocada inmediatamente") es una función que se crea y se ejecuta en la misma expresión.

```js
(function () {
  const mensaje = "solo existo aquí dentro";
  console.log(mensaje); // "solo existo aquí dentro"
})();

console.log(typeof mensaje); // ❌ ReferenceError: mensaje is not defined
```

**Cómo se lee:**

- Los paréntesis que envuelven `function () { ... }` la convierten en una **expresión**. Sin ellos, el motor espera un nombre y lanza `SyntaxError`.
- Los paréntesis finales `()` la **ejecutan** en ese mismo instante.
- Las variables declaradas dentro no salen al exterior: la función crea su propio scope.

**Versión con arrow (la más habitual hoy):**

```js
(() => {
  console.log("También funciona con arrow");
})();
```

> 🛑 **Hoy casi nunca la necesitas.** Su utilidad histórica era crear un scope privado cuando solo existía `var` (que ignora los bloques). Con `let` y `const`, un bloque `{ }` ya aísla variables. La encontrarás en código antiguo y en librerías; para aislar todo un archivo se usan los módulos (Módulo 7).

---

## 2.3 — Parámetros y argumentos

### 2.3.1 Diferencia entre parámetro y argumento

```js
function saludar(nombre) {  // "nombre" es el PARÁMETRO
  return `Hola, ${nombre}`;
}

saludar("Ana");             // "Ana" es el ARGUMENTO
```

- **Parámetro:** variable declarada en la definición.
- **Argumento:** valor concreto que se pasa en la llamada.

### 2.3.2 Argumentos de menos y de más

```js
function mostrar(a, b) {
  console.log(a);
  console.log(b);
}

mostrar(1);        // 1, undefined  (falta el segundo)
mostrar(1, 2);     // 1, 2
mostrar(1, 2, 3);  // 1, 2  (el tercero se ignora)
```

JavaScript **no lanza error** por aridad incorrecta. Es tu responsabilidad validar.

### 2.3.3 Parámetros por defecto (ES6)

```js
function saludar(nombre = "invitado") {
  return `Hola, ${nombre}`;
}

console.log(saludar());            // "Hola, invitado"
console.log(saludar("Ana"));       // "Hola, Ana"
console.log(saludar(undefined));   // "Hola, invitado"
console.log(saludar(null));        // "Hola, null" ⚠️
```

**El default solo se aplica cuando el argumento es `undefined`**, no cuando es `null`, `0`, `""` o `false`.

```js
function configurar(opciones = {}) {
  return opciones;
}

configurar();        // {}
configurar(null);    // null ⚠️
```

**El valor por defecto se evalúa en cada llamada** y puede usar parámetros anteriores:

```js
function crearRango(inicio, fin = inicio + 10) {
  return `${inicio} → ${fin}`;
}

console.log(crearRango(5));      // "5 → 15"
console.log(crearRango(5, 20));  // "5 → 20"
```

**Anti-patrón clásico:**

```js
// ❌ `||` reemplaza también 0, "", false
function saludarMal(nombre) {
  nombre = nombre || "invitado";
  return `Hola, ${nombre}`;
}

// ✅ Default solo para undefined
function saludarBien(nombre = "invitado") {
  return `Hola, ${nombre}`;
}
```

### 2.3.4 Parámetro rest (`...`)

Recoge **todos los argumentos restantes** en un **array real**:

```js
function sumarTodos(...numeros) {
  let total = 0;
  for (const numero of numeros) {
    total += numero;
  }
  return total;
}

console.log(sumarTodos(1, 2));       // 3
console.log(sumarTodos(1, 2, 3, 4)); // 10
console.log(sumarTodos());           // 0
```

Reglas:

- Debe ser el **último** parámetro.
- Solo puede haber **uno**.
- `numeros` es un array de verdad: tiene `length`, índices y funciona con `for...of`.

```js
function presentar(titulo, ...nombres) {
  return `${titulo}: ${nombres.length} persona(s)`;
}

console.log(presentar("Equipo", "Ana", "Luis", "Eva")); // "Equipo: 3 persona(s)"
```

> 📌 El mismo símbolo `...` tiene otro uso llamado **spread** (expandir un array en elementos). Ese uso se estudia en el Módulo 3. Aquí solo usamos **rest**, que es el de la lista de parámetros.

### 2.3.5 El objeto `arguments` (legado)

Dentro de una función normal existe `arguments`, un objeto **parecido a un array** con todos los argumentos:

```js
function sumaAntigua() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log(sumaAntigua(1, 2, 3)); // 6
```

Problemas:

- **No es un array real**: no tiene `for...of` ni los métodos de array.
- No existe en arrow functions.
- Es menos claro que los parámetros con nombre o que `...rest`.

> 🛑 **Recomendación:** no lo uses en código nuevo. Existe por compatibilidad con ES5. Usa parámetros con nombre o rest.

### 2.3.6 Paso por valor vs paso por referencia

**Primitivos:** se pasa una **copia del valor**. Cambiar el parámetro no afecta a la variable original.

```js
function cambiarNumero(n) {
  n = 100;
}

let numero = 1;
cambiarNumero(numero);
console.log(numero); // 1 ✅
```

**Objetos y arrays:** se pasa una **copia de la referencia**. La función puede **mutar** el objeto original, pero si reasigna el parámetro, no cambia la referencia externa.

```js
function cambiarPropiedad(objeto) {
  objeto.valor = 100;   // muta el objeto original
}

const objeto = { valor: 1 };
cambiarPropiedad(objeto);
console.log(objeto.valor); // 100 ⚠️

function reasignarObjeto(objeto) {
  objeto = { valor: 999 }; // solo cambia la referencia local
}

const objeto2 = { valor: 1 };
reasignarObjeto(objeto2);
console.log(objeto2.valor); // 1 ✅
```

**Consecuencia profesional:** si no quieres que una función mute tus datos, no le pases el objeto original o no lo modifiques dentro. La inmutabilidad formal se estudia en los Módulos 3 y 7.

### 2.3.7 Propiedades `length` y `name` de una función

```js
function ejemplo(a, b, c = 1) {
  return a + b + c;
}

console.log(ejemplo.length); // 2 (los parámetros con default no cuentan)
console.log(ejemplo.name);   // "ejemplo"
```

- `length`: número de parámetros **sin** default y **sin** contar el rest.
- `name`: nombre de la función (útil en depuración y en los mensajes de error).

### 2.3.8 Demasiados parámetros

```js
// ❌ Difícil de leer y de llamar sin equivocarse
function crearUsuario(nombre, apellido, edad, email, telefono, pais) {
  // ...
}

// ✅ Agrupa en un objeto (los objetos básicos ya los conoces)
function crearUsuario2(datos) {
  return `${datos.nombre} ${datos.apellido}`;
}

console.log(crearUsuario2({ nombre: "Ana", apellido: "López" }));
```

> 📌 La desestructuración de parámetros (`function f({ nombre })`) llega en el Módulo 3. Por ahora accede con `datos.nombre`.

---

## 2.4 — Scope: el ámbito de las variables

### 2.4.1 Definición

El **scope** (ámbito) es la **zona del código donde un nombre es visible**. Fuera de ella, la variable no existe para ti.

JavaScript tiene tres ámbitos principales:

1. **Global:** visible en todo el programa.
2. **De función:** visible dentro de la función (incluidas las funciones anidadas).
3. **De bloque:** visible dentro de `{ }` (solo `let` y `const`).

### 2.4.2 Scope global

```js
const nombreApp = "Mi App"; // global

function mostrarApp() {
  console.log(nombreApp);   // accesible
}

mostrarApp();               // "Mi App"
console.log(nombreApp);     // "Mi App"
```

Problemas del scope global:

- Colisiones de nombres.
- Cualquier parte del programa puede modificarlo.
- Dificulta el testing y la depuración.

> 🛡️ **Regla:** declara las variables lo más cerca posible de donde se usan. El global debe ser la excepción, no la norma.

### 2.4.3 Scope de función

Cada función crea su propio ámbito. Los parámetros y las variables declaradas dentro **no existen fuera**:

```js
function calcular() {
  const resultado = 42;
  console.log(resultado); // 42
}

calcular();
console.log(resultado); // ❌ ReferenceError: resultado is not defined
```

### 2.4.4 Scope de bloque

`let` y `const` viven dentro de cualquier bloque `{ }`, no solo de funciones:

```js
{
  const mensaje = "dentro";
  console.log(mensaje); // "dentro"
}

console.log(mensaje); // ❌ ReferenceError
```

```js
if (true) {
  let x = 10;
  const y = 20;
  var z = 30; // ⚠️ var ignora el bloque
}

console.log(z); // 30
console.log(x); // ❌ ReferenceError
console.log(y); // ❌ ReferenceError
```

### 2.4.5 Scope léxico (lexical scope)

**El scope se decide por dónde está escrito el código, no por dónde se llama la función.**

```js
const mensaje = "global";

function crearFuncion() {
  const mensaje = "local";

  return function () {
    return mensaje; // busca en el lugar donde fue ESCRITA: "local"
  };
}

const funcion = crearFuncion();
console.log(funcion()); // "local" ✅
```

Aunque la función se ejecute desde el scope global, recuerda el scope donde nació. Esta es la base de los **closures** (sección 2.6).

### 2.4.6 Cadena de scope (*scope chain*)

Cuando usas una variable, JavaScript la busca en este orden:

1. El scope actual.
2. El scope de la función que la contiene.
3. Hacia arriba, función por función.
4. El scope global.
5. Si no la encuentra: `ReferenceError`.

```js
const global = "global";

function externa() {
  const externaVar = "externa";

  function interna() {
    const internaVar = "interna";

    console.log(internaVar); // 1. actual
    console.log(externaVar); // 2. padre
    console.log(global);     // 3. global
  }

  interna();
}

externa();
```

### 2.4.7 Shadowing (sombreado)

Una variable interna con el mismo nombre **oculta** a la externa:

```js
const nombre = "global";

function mostrar() {
  const nombre = "local";
  console.log(nombre); // "local"
}

mostrar();
console.log(nombre); // "global"
```

> ⚠️ **Cuidado:** el shadowing puede ser intencional, pero también puede hacer que uses la variable equivocada. Si necesitas el mismo nombre, pregúntate si de verdad quieres ocultar el externo.

### 2.4.8 Variables globales accidentales

En modo no estricto, asignar sin declarar crea una global:

```js
function crearGlobal() {
  accidental = "ups"; // ❌ sin const/let/var
}

crearGlobal();
console.log(accidental); // "ups"
```

En **modo estricto** (módulos y clases lo son por defecto), esto lanza `ReferenceError`. La solución es simple: **declara siempre con `const` o `let`**.

---

## 2.5 — Hoisting a fondo

### 2.5.1 Las dos fases

Cuando JavaScript ejecuta un scope (global o de función), lo hace en dos fases:

1. **Fase de creación:** registra las declaraciones (variables y funciones) y reserva espacio.
2. **Fase de ejecución:** asigna valores y ejecuta las instrucciones línea por línea.

El **hoisting** es el resultado de la fase de creación: las declaraciones "suben" conceptualmente al inicio del scope.

### 2.5.2 Qué se iza y cómo

| Declaración | Se iza | Valor antes de la línea | ¿Se puede llamar antes? |
|---|---|---|---|
| `function f() {}` | ✅ Completa | La función | ✅ Sí |
| `var f = function () {}` | ✅ Solo la variable | `undefined` | ❌ TypeError |
| `let f = function () {}` | ✅ Solo la variable | TDZ | ❌ ReferenceError |
| `const f = function () {}` | ✅ Solo la variable | TDZ | ❌ ReferenceError |
| `var x` | ✅ | `undefined` | — |
| `let x` / `const x` | ✅ | TDZ | — |

### 2.5.3 Declaración de función: se iza completa

```js
console.log(sumar(2, 3)); // 5 ✅

function sumar(a, b) {
  return a + b;
}
```

El motor registra la función completa en la fase de creación. Por eso puedes llamarla antes.

### 2.5.4 Expresión de función: solo se iza la variable

```js
console.log(restar(5, 2)); // ❌ ReferenceError (TDZ de const)

const restar = function (a, b) {
  return a - b;
};
```

Con `var`:

```js
console.log(restar(5, 2)); // ❌ TypeError: restar is not a function

var restar = function (a, b) {
  return a - b;
};
```

La variable `restar` existe desde el inicio, pero vale `undefined` hasta la asignación.

### 2.5.5 Arrow functions: mismas reglas que la variable

```js
console.log(multiplicar(2, 3)); // ❌ ReferenceError (TDZ)

const multiplicar = (a, b) => a * b;
```

### 2.5.6 `var` vs `let`/`const` en bloques

```js
function ejemplo() {
  if (true) {
    var conVar = "var";
    let conLet = "let";
    const conConst = "const";
  }

  console.log(conVar);   // "var" ⚠️ escapó del bloque
  console.log(conLet);   // ❌ ReferenceError
  console.log(conConst); // ❌ ReferenceError
}
```

### 2.5.7 Modelo mental

```text
FASE DE CREACIÓN
┌─────────────────────────────────────┐
│ function sumar → función completa   │
│ var x          → undefined          │
│ let y          → TDZ                │
│ const z        → TDZ                │
└─────────────────────────────────────┘
                 │
                 ▼
FASE DE EJECUCIÓN
┌─────────────────────────────────────┐
│ x = 10                              │
│ y = 20                              │
│ z = 30                              │
└─────────────────────────────────────┘
```

> 🧠 **No memorices "el hoisting sube el código".** Memoriza esto: *las declaraciones se registran antes de ejecutar; las inicializaciones ocurren en su línea*. Es más preciso y explica todos los casos.

### 2.5.8 Buena práctica

Aunque puedas llamar a una función antes de declararla, **declara primero y usa después**. El hoisting es una herramienta del lenguaje, no una excusa para escribir código difícil de seguir.

---

## 2.6 — Closures

### 2.6.1 Definición

Un **closure** (clausura) es una función que **recuerda el ámbito donde fue creada**, incluso cuando se ejecuta fuera de él.

Dicho de otra forma: una función interna **captura** las variables de su función externa y las mantiene vivas.

```js
function crearSaludo(saludo) {
  return function (nombre) {
    return `${saludo}, ${nombre}`;
  };
}

const saludarFormal = crearSaludo("Buenos días");
const saludarInformal = crearSaludo("Hey");

console.log(saludarFormal("Ana"));    // "Buenos días, Ana"
console.log(saludarInformal("Luis")); // "Hey, Luis"
```

`crearSaludo` ya terminó, pero las funciones devueltas siguen recordando `saludo`. Eso es un closure.

### 2.6.2 Cómo funciona en memoria

Cuando se llama a `crearSaludo("Buenos días")`:

1. Se crea un **entorno** (environment) con la variable `saludo = "Buenos días"`.
2. Se crea la función interna.
3. La función interna guarda una **referencia** a ese entorno.
4. `crearSaludo` termina, pero el entorno **no se destruye** porque la función interna aún lo referencia.
5. El recolector de basura (GC) solo lo libera cuando ya no hay ninguna referencia a la función.

```text
crearSaludo("Buenos días")
        │
        ▼
┌──────────────────────────┐
│ Entorno de crearSaludo   │
│ saludo = "Buenos días"   │◀──────┐
└──────────────────────────┘       │
        │                          │
        ▼                          │
┌──────────────────────────┐       │
│ function (nombre) {      │───────┘
│   return saludo + nombre │
│ }                        │
└──────────────────────────┘
```

**Consecuencia:** cada llamada a la fábrica crea un entorno **independiente**:

```js
const contadorA = crearContador();
const contadorB = crearContador();

contadorA.incrementar(); // 1
contadorA.incrementar(); // 2
contadorB.incrementar(); // 1 ✅ independiente
```

### 2.6.3 Caso 1: contador con estado privado

```js
function crearContador(inicial = 0) {
  let cuenta = inicial;

  return {
    incrementar: function () {
      cuenta++;
      return cuenta;
    },
    decrementar: function () {
      cuenta--;
      return cuenta;
    },
    reiniciar: function () {
      cuenta = inicial;
      return cuenta;
    },
    valor: function () {
      return cuenta;
    },
  };
}

const contador = crearContador(10);

console.log(contador.valor());       // 10
console.log(contador.incrementar()); // 11
console.log(contador.incrementar()); // 12
console.log(contador.decrementar()); // 11
console.log(contador.reiniciar());   // 10
```

**Claves:**

- `cuenta` **no es accesible desde fuera**: no existe `contador.cuenta`.
- Las cuatro funciones comparten el mismo entorno y, por tanto, la misma `cuenta`.
- No hemos usado `this`: cada método accede a `cuenta` por closure. `this` se estudia en el Módulo 4.

### 2.6.4 Caso 2: fábrica de funciones

```js
function crearMultiplicador(factor) {
  return function (numero) {
    return numero * factor;
  };
}

const duplicar = crearMultiplicador(2);
const triplicar = crearMultiplicador(3);

console.log(duplicar(5));  // 10
console.log(triplicar(5)); // 15
```

### 2.6.5 Caso 3: estado privado de una cuenta bancaria

```js
function crearCuentaBancaria(saldoInicial) {
  let saldo = saldoInicial;

  return {
    depositar: function (monto) {
      if (!Number.isFinite(monto) || monto <= 0) {
        return null;
      }
      saldo += monto;
      return saldo;
    },
    retirar: function (monto) {
      if (!Number.isFinite(monto) || monto <= 0 || monto > saldo) {
        return null;
      }
      saldo -= monto;
      return saldo;
    },
    consultar: function () {
      return saldo;
    },
  };
}

const cuenta = crearCuentaBancaria(100);

console.log(cuenta.consultar()); // 100
console.log(cuenta.depositar(50)); // 150
console.log(cuenta.retirar(200));  // null (fondos insuficientes)
console.log(cuenta.consultar());   // 150
```

### 2.6.6 Caso 4: el bucle clásico `var` vs `let`

Este es **el** ejemplo que demuestra por qué `let` existe.

```js
const funcionesVar = [];

for (var i = 0; i < 3; i++) {
  funcionesVar[i] = function () {
    return i;
  };
}

console.log(funcionesVar[0]()); // 3 ⚠️
console.log(funcionesVar[1]()); // 3 ⚠️
console.log(funcionesVar[2]()); // 3 ⚠️
```

**Por qué:** `var i` es **una sola variable** para todo el bucle. Las tres funciones capturan **la misma** `i`. Cuando se ejecutan, el bucle ya terminó y `i` vale 3.

```js
const funcionesLet = [];

for (let j = 0; j < 3; j++) {
  funcionesLet[j] = function () {
    return j;
  };
}

console.log(funcionesLet[0]()); // 0 ✅
console.log(funcionesLet[1]()); // 1 ✅
console.log(funcionesLet[2]()); // 2 ✅
```

**Por qué:** con `let`, cada iteración crea un **binding nuevo**. Cada función captura su propia `j`.

### 2.6.7 Caso 5: ejecutar solo una vez

```js
function unaVez(fn) {
  let ejecutada = false;
  let resultado;

  return function (valor) {
    if (!ejecutada) {
      ejecutada = true;
      resultado = fn(valor);
    }
    return resultado;
  };
}

const inicializar = unaVez(function (nombre) {
  console.log("Inicializando...");
  return `Listo para ${nombre}`;
});

console.log(inicializar("Ana"));  // "Inicializando..." → "Listo para Ana"
console.log(inicializar("Luis")); // "Listo para Ana" (no vuelve a ejecutar)
```

### 2.6.8 Caso 6: memoización

**Memoizar** es guardar resultados ya calculados para no repetir trabajo.

```js
function memoizar(fn) {
  const cache = {};

  return function (n) {
    // `in` comprueba si la propiedad existe en el objeto
    if (n in cache) {
      return cache[n];
    }

    const resultado = fn(n);
    cache[n] = resultado;
    return resultado;
  };
}

function cuadradoLento(n) {
  console.log(`Calculando ${n}...`);
  return n * n;
}

const cuadrado = memoizar(cuadradoLento);

console.log(cuadrado(5)); // "Calculando 5..." → 25
console.log(cuadrado(5)); // 25 (sin volver a calcular)
console.log(cuadrado(6)); // "Calculando 6..." → 36
```

> 📌 Las claves de un objeto son strings. Al usar `cache[n]` con un número, JavaScript lo convierte a string automáticamente. Para este caso no importa, pero tenlo en cuenta.

### 2.6.9 Closures y memoria

- Cada closure mantiene vivo su entorno. Si captura un objeto grande, ese objeto **no se libera** mientras la función exista.
- Crear closures innecesarios dentro de bucles muy grandes puede aumentar el uso de memoria.
- Si ya no necesitas la función, elimina la referencia (`funcion = null`) para que el GC pueda liberar el entorno.

```js
let saludar = crearSaludo("Hola");
saludar("Ana");

saludar = null; // ahora el entorno puede ser recolectado
```

### 2.6.10 Errores típicos con closures

| Error | Ejemplo | Solución |
|---|---|---|
| Esperar valores independientes con `var` | Bucle con `var` | Usa `let` |
| Compartir estado sin querer | Dos contadores que comparten variable | Crea entornos separados (fábrica) |
| Creer que el closure copia el valor | `let x = 1; const f = () => x; x = 2;` | El closure **referencia**, no copia |
| Fugas de memoria | Guardar closures que capturan objetos grandes | Libera referencias cuando no uses |

```js
let x = 1;
const leerX = function () {
  return x;
};
x = 2;
console.log(leerX()); // 2 ✅ (referencia, no copia)
```

---

## 2.7 — Recursión

### 2.7.1 Definición

Una función **recursiva** es una función que **se llama a sí misma** para resolver un problema más pequeño.

Toda recursión necesita dos partes:

1. **Caso base:** la condición que detiene la recursión.
2. **Caso recursivo:** la llamada a sí misma con un problema reducido.

Sin caso base, la recursión es infinita y desborda la pila.

### 2.7.2 Factorial

```js
function factorial(n) {
  if (n < 0) {
    return null; // entrada inválida
  }
  if (n === 0 || n === 1) {
    return 1; // caso base
  }
  return n * factorial(n - 1); // caso recursivo
}

console.log(factorial(0)); // 1
console.log(factorial(1)); // 1
console.log(factorial(5)); // 120
console.log(factorial(-3)); // null
```

**Traza de `factorial(4)`:**

```text
factorial(4)
= 4 * factorial(3)
= 4 * 3 * factorial(2)
= 4 * 3 * 2 * factorial(1)
= 4 * 3 * 2 * 1
= 24
```

**Pila de llamadas:**

```text
[ factorial(4) ]
[ factorial(4), factorial(3) ]
[ factorial(4), factorial(3), factorial(2) ]
[ factorial(4), factorial(3), factorial(2), factorial(1) ]
... se resuelven de arriba hacia abajo ...
```

### 2.7.3 Sumar un array

```js
function sumarArray(numeros, indice = 0) {
  if (indice === numeros.length) {
    return 0; // caso base: no quedan elementos
  }
  return numeros[indice] + sumarArray(numeros, indice + 1);
}

console.log(sumarArray([1, 2, 3, 4])); // 10
console.log(sumarArray([]));           // 0
```

### 2.7.4 Invertir un string

```js
function invertir(texto, indice = texto.length - 1) {
  if (indice < 0) {
    return ""; // caso base
  }
  return texto[indice] + invertir(texto, indice - 1);
}

console.log(invertir("hola")); // "aloh"
```

### 2.7.5 Fibonacci

```js
function fibonacci(n) {
  if (n < 0) {
    return null;
  }
  if (n < 2) {
    return n; // caso base: 0 → 0, 1 → 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(0)); // 0
console.log(fibonacci(1)); // 1
console.log(fibonacci(7)); // 13
```

**Problema:** esta versión recalcula muchísimo. `fibonacci(35)` hace millones de llamadas. La solución es **memoizar** con un closure:

```js
function crearFibonacciMemo() {
  const cache = {};

  function fib(n) {
    if (n < 2) {
      return n;
    }
    if (n in cache) {
      return cache[n];
    }
    const resultado = fib(n - 1) + fib(n - 2);
    cache[n] = resultado;
    return resultado;
  }

  return fib;
}

const fibonacciRapido = crearFibonacciMemo();
console.log(fibonacciRapido(35)); // 9227465
```

### 2.7.6 Desbordamiento de pila

```js
function infinita() {
  return infinita();
}

infinita(); // ❌ RangeError: Maximum call stack size exceeded
```

Cada llamada añade un marco a la pila. Si no hay caso base, la pila se llena. El límite depende del motor y del tamaño de los marcos.

### 2.7.7 Recursión vs iteración

| Criterio | Recursión | Iteración |
|---|---|---|
| Legibilidad en problemas jerárquicos | ✅ Alta | ⚠️ Baja |
| Rendimiento | ⚠️ Coste de llamadas | ✅ Generalmente mejor |
| Riesgo de desbordar la pila | ✅ Sí | ❌ No |
| Casos típicos | Árboles, factorial, división y conquista | Contadores, recorridos lineales |

> 🧠 **Regla:** usa recursión cuando el problema sea **naturalmente recursivo** (se define en términos de sí mismo). Si un bucle es más claro, usa el bucle.

---

## 2.8 — Funciones de orden superior y callbacks (sincrónicos)

### 2.8.1 Funciones como valores

Ya viste que una función se puede guardar en una variable. Eso permite:

```js
function saludar() {
  return "Hola";
}

function despedir() {
  return "Adiós";
}

let accion = saludar;
console.log(accion()); // "Hola"

accion = despedir;
console.log(accion()); // "Adiós"
```

### 2.8.2 Función de orden superior (HOF)

Una **función de orden superior** es la que cumple al menos una de estas condiciones:

1. Recibe una función como argumento.
2. Devuelve una función.

```js
// Recibe una función
function aplicar(valor, operacion) {
  return operacion(valor);
}

function duplicar(n) {
  return n * 2;
}

console.log(aplicar(5, duplicar)); // 10

// Devuelve una función
function crearMultiplicador(factor) {
  return function (numero) {
    return numero * factor;
  };
}

const triple = crearMultiplicador(3);
console.log(triple(4)); // 12
```

### 2.8.3 Callback

Un **callback** es una función que se pasa a otra para que la ejecute.

```js
function ejecutarDosVeces(fn) {
  fn();
  fn();
}

ejecutarDosVeces(function () {
  console.log("Hola");
});
// "Hola"
// "Hola"
```

**Callback con argumentos:**

```js
function procesar(numero, callback) {
  const resultado = numero * 2;
  callback(resultado);
}

procesar(5, function (resultado) {
  console.log(`El resultado es ${resultado}`); // "El resultado es 10"
});
```

> 📌 Los callbacks **asíncronos** (los que se ejecutan después, como los de `setTimeout` o las peticiones de red) se estudian en el Módulo 5. Aquí los callbacks son **sincrónicos**: se ejecutan inmediatamente.

### 2.8.4 Callbacks con nombre vs anónimos

```js
// ✅ Callback con nombre: más fácil de depurar
function mostrarResultado(valor) {
  console.log(`Resultado: ${valor}`);
}

procesar(10, mostrarResultado);

// ✅ Callback anónimo: útil si solo se usa una vez
procesar(10, function (valor) {
  console.log(`Resultado: ${valor}`);
});
```

### 2.8.5 Fábrica de validadores

```js
function crearValidador(minimo, maximo) {
  return function (valor) {
    return valor >= minimo && valor <= maximo;
  };
}

const esEdadValida = crearValidador(0, 120);

console.log(esEdadValida(25));  // true
console.log(esEdadValida(-5));  // false
console.log(esEdadValida(150)); // false
```

### 2.8.6 Por qué esto importa

Las HOF y los callbacks son la base de:

- Los métodos de array (`map`, `filter`, `reduce`) → Módulo 3.
- Los eventos del DOM (`addEventListener`) → Módulo 6.
- Las promesas y `async/await` → Módulo 5.
- Los patrones de composición → Módulo 7.

Entenderlos ahora te ahorra meses de copiar y pegar sin comprender.

---

## 2.9 — Buenas prácticas y anti-patrones

### ✅ Haz esto

```js
// 1. Una función, una responsabilidad
function calcularSubtotal(items) {
  let subtotal = 0;
  for (const item of items) {
    subtotal += item.precio * item.cantidad;
  }
  return subtotal;
}

// 2. Nombre que describe la acción
function calcularTotalConIva(subtotal, iva = 0.21) {
  return subtotal * (1 + iva);
}

// 3. Return temprano (guard clauses)
function dividir(a, b) {
  if (b === 0) return null;
  return a / b;
}

// 4. Parámetros con default en vez de `||`
function saludar(nombre = "invitado") {
  return `Hola, ${nombre}`;
}

// 5. Rest para argumentos variables
function sumarTodos(...numeros) {
  let total = 0;
  for (const n of numeros) total += n;
  return total;
}

// 6. Devuelve siempre el mismo tipo
function buscarPrecio(id) {
  if (id !== 1) return null; // "no encontrado"
  return 99;                 // número
}

// 7. Funciones pequeñas y con nombre claro
const esPar = (n) => n % 2 === 0;

// 8. Documenta el porqué, no el qué
// Usamos 0.21 porque es el IVA general en España en 2026
const IVA_GENERAL = 0.21;
```

### ❌ Evita esto

```js
// 1. Olvidar el return
function sumarMal(a, b) {
  a + b;
}

// 2. Arrow con llaves sin return
const duplicarMal = (n) => {
  n * 2;
};

// 3. Mutar los parámetros sin avisar
function agregarMal(item, lista) {
  lista[lista.length] = item;
}

// 4. Demasiados parámetros posicionales
function crearUsuarioMal(nombre, apellido, edad, email, telefono, pais) {
  // ...
}

// 5. Función que hace demasiadas cosas
function procesarTodoMal(datos) {
  // valida, calcula, formatea, imprime y guarda
}

// 6. Usar `arguments` en código nuevo
function viejo() {
  return arguments.length;
}

// 7. Confundir la función con su resultado
console.log(sumarMal);   // muestra la función
console.log(sumarMal()); // ejecuta

// 8. Depender del hoisting por comodidad
console.log(restar(5, 2));
const restar = (a, b) => a - b; // ❌ ReferenceError

// 9. Estado global mutable
let contadorGlobal = 0;
function incrementarGlobal() {
  contadorGlobal++;
}

// 10. Capturar variables de bucle con `var`
for (var i = 0; i < 3; i++) {
  // closures que comparten la misma i
}
```

---

## 2.10 — Retos con solución explicada

> 🧭 Intenta resolver cada reto antes de leer la solución. Todos usan **solo** conceptos de los Módulos 1 y 2.

---

### 🥊 Reto 1 — Funciones básicas con validación

**Enunciado:** crea `saludar(nombre)` con valor por defecto `"invitado"` y `esMayorDeEdad(edad)` que devuelva `true`, `false` o `null` si la edad no es un número válido.

```js
function saludar(nombre = "invitado") {
  // 1. El default solo se aplica si nombre es undefined.
  return `Hola, ${nombre}`;
}

function esMayorDeEdad(edad) {
  // 2. Validamos tipo y finitud antes de comparar.
  if (typeof edad !== "number" || !Number.isFinite(edad)) {
    return null;
  }
  // 3. Comparamos con >= para incluir exactamente 18.
  return edad >= 18;
}

console.log(saludar());          // "Hola, invitado"
console.log(saludar("Ana"));     // "Hola, Ana"
console.log(esMayorDeEdad(18));  // true
console.log(esMayorDeEdad(17));  // false
console.log(esMayorDeEdad("18"));// null
```

**Explicación línea por línea:**

1. `nombre = "invitado"` es un parámetro por defecto; se evalúa en cada llamada.
2. `typeof edad !== "number"` descarta strings, `null`, arrays y objetos; `!Number.isFinite(edad)` descarta `NaN`, `Infinity` y `-Infinity`.
3. `>= 18` incluye los 18 años; `> 18` los excluiría por error.

---

### 🥊 Reto 2 — Calculadora con funciones

**Enunciado:** crea una función por operación y una función `calcular(a, b, operacion)` que las use. Valida que `a` y `b` sean números finitos. Devuelve `null` si algo es inválido o si se divide por cero.

```js
function sumar(a, b) {
  return a + b;
}

function restar(a, b) {
  return a - b;
}

function multiplicar(a, b) {
  return a * b;
}

function dividir(a, b) {
  if (b === 0) return null; // evita Infinity
  return a / b;
}

function calcular(a, b, operacion) {
  // 1. Validación centralizada: no repetimos en cada operación.
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    return null;
  }

  // 2. switch con igualdad estricta sobre el nombre de la operación.
  switch (operacion) {
    case "sumar":
      return sumar(a, b);
    case "restar":
      return restar(a, b);
    case "multiplicar":
      return multiplicar(a, b);
    case "dividir":
      return dividir(a, b);
    default:
      return null;
  }
}

console.log(calcular(8, 2, "sumar"));       // 10
console.log(calcular(8, 2, "restar"));      // 6
console.log(calcular(8, 2, "multiplicar")); // 16
console.log(calcular(8, 2, "dividir"));     // 4
console.log(calcular(8, 0, "dividir"));     // null
console.log(calcular("8", 2, "sumar"));     // null
```

**Puntos clave:**

- Cada operación tiene su propia función: se puede probar y reutilizar.
- La validación está en `calcular`, no repetida cuatro veces.
- `switch` compara con `===`, así que `"sumar"` no es lo mismo que `"SUMMAR"`.
- `default` cubre operaciones desconocidas.

---

### 🥊 Reto 3 — Contador con closure

**Enunciado:** crea `crearContador(inicial)` que devuelva un objeto con `incrementar`, `decrementar`, `reiniciar` y `valor`. El estado debe ser privado.

```js
function crearContador(inicial = 0) {
  // 1. Variable capturada por las cuatro funciones.
  let cuenta = inicial;

  return {
    incrementar: function () {
      cuenta++;
      return cuenta;
    },
    decrementar: function () {
      cuenta--;
      return cuenta;
    },
    reiniciar: function () {
      cuenta = inicial;
      return cuenta;
    },
    valor: function () {
      return cuenta;
    },
  };
}

const c1 = crearContador(10);
const c2 = crearContador();

console.log(c1.valor());       // 10
console.log(c1.incrementar()); // 11
console.log(c1.incrementar()); // 12
console.log(c1.decrementar()); // 11
console.log(c1.reiniciar());   // 10

console.log(c2.incrementar()); // 1
console.log(c2.valor());       // 1
console.log(c1.valor());       // 10 ✅ independientes
```

**Por qué funciona:**

- `cuenta` vive en el entorno de `crearContador`.
- Las cuatro funciones se crean dentro de ese entorno y lo capturan.
- Cada llamada a `crearContador` crea un entorno nuevo → contadores independientes.
- No se usa `this`; por eso podemos llamar a los métodos sin perder el contexto (lo verás en el Módulo 4).

---

### 🥊 Reto 4 — Fábrica de multiplicadores

**Enunciado:** crea `crearMultiplicador(factor)` que devuelva una función. Usa closures.

```js
function crearMultiplicador(factor) {
  return function (numero) {
    return numero * factor;
  };
}

const duplicar = crearMultiplicador(2);
const triplicar = crearMultiplicador(3);
const porDiez = crearMultiplicador(10);

console.log(duplicar(7));  // 14
console.log(triplicar(7)); // 21
console.log(porDiez(7));   // 70
```

**Explicación:** `factor` queda capturado en el entorno de cada llamada. `duplicar` recuerda `2`; `triplicar`, `3`; `porDiez`, `10`.

---

### 🥊 Reto 5 — `unaVez`

**Enunciado:** crea `unaVez(fn)` que devuelva una función que solo ejecute `fn` la primera vez. Las siguientes llamadas devuelven el mismo resultado sin volver a ejecutar.

```js
function unaVez(fn) {
  let ejecutada = false;
  let resultado;

  return function (valor) {
    // 1. Solo entra la primera vez.
    if (!ejecutada) {
      ejecutada = true;
      resultado = fn(valor);
    }
    // 2. Devuelve el resultado guardado.
    return resultado;
  };
}

const inicializar = unaVez(function (nombre) {
  console.log("Inicializando...");
  return `Listo para ${nombre}`;
});

console.log(inicializar("Ana"));  // "Inicializando..." → "Listo para Ana"
console.log(inicializar("Luis")); // "Listo para Ana"
```

**Limitación:** esta versión acepta **un** argumento. Generalizarla para cualquier número de argumentos requiere `...` en la llamada (spread), que se estudia en el Módulo 3.

---

### 🥊 Reto 6 — Memoización

**Enunciado:** crea `memoizar(fn)` para una función de un solo argumento numérico. Debe cachear los resultados en un objeto.

```js
function memoizar(fn) {
  const cache = {};

  return function (n) {
    // 1. `in` comprueba si la clave ya existe.
    if (n in cache) {
      return cache[n];
    }

    // 2. Solo calcula si no está en caché.
    const resultado = fn(n);
    cache[n] = resultado;
    return resultado;
  };
}

function cuadradoLento(n) {
  console.log(`Calculando ${n}...`);
  return n * n;
}

const cuadrado = memoizar(cuadradoLento);

console.log(cuadrado(5)); // "Calculando 5..." → 25
console.log(cuadrado(5)); // 25
console.log(cuadrado(6)); // "Calculando 6..." → 36
console.log(cuadrado(6)); // 36
```

**Por qué `in` y no `cache[n] !== undefined`:** si el resultado legítimo fuera `undefined`, la comprobación con `!== undefined` fallaría. `in` comprueba la **existencia de la propiedad**, no su valor.

---

### 🥊 Reto 7 — Recursión

**Enunciado:** implementa recursivamente `factorial(n)`, `sumarArray(numeros)` e `invertir(texto)`.

```js
function factorial(n) {
  // 1. Validación y caso base.
  if (n < 0) return null;
  if (n === 0 || n === 1) return 1;

  // 2. Caso recursivo: reduce n en 1.
  return n * factorial(n - 1);
}

function sumarArray(numeros, indice = 0) {
  // 3. Caso base: índice fuera del array.
  if (indice === numeros.length) return 0;

  // 4. Suma el actual y delega el resto.
  return numeros[indice] + sumarArray(numeros, indice + 1);
}

function invertir(texto, indice = texto.length - 1) {
  // 5. Caso base: índice negativo.
  if (indice < 0) return "";

  // 6. Toma el último carácter y delega el resto.
  return texto[indice] + invertir(texto, indice - 1);
}

console.log(factorial(5));        // 120
console.log(sumarArray([1, 2, 3])); // 6
console.log(invertir("hola"));    // "aloh"
```

**Claves:**

- Cada función tiene un caso base **alcanzable**.
- Cada llamada recursiva reduce el problema (n-1, índice+1, índice-1).
- `indice = 0` y `indice = texto.length - 1` son parámetros por defecto que permiten llamar a la función con un solo argumento.

---

### 🥊 Reto 8 — Función de orden superior

**Enunciado:** crea `aplicarOperacion(a, b, operacion)` y `crearValidador(min, max)`. La primera recibe una función; la segunda la devuelve.

```js
function aplicarOperacion(a, b, operacion) {
  // 1. `operacion` es un callback: se ejecuta con a y b.
  return operacion(a, b);
}

function sumar(a, b) {
  return a + b;
}

function multiplicar(a, b) {
  return a * b;
}

console.log(aplicarOperacion(3, 4, sumar));       // 7
console.log(aplicarOperacion(3, 4, multiplicar)); // 12

function crearValidador(minimo, maximo) {
  // 2. Devuelve una función que captura minimo y maximo.
  return function (valor) {
    return valor >= minimo && valor <= maximo;
  };
}

const esNotaValida = crearValidador(0, 10);

console.log(esNotaValida(7));  // true
console.log(esNotaValida(11)); // false
console.log(esNotaValida(-1)); // false
```

---

### 🥊 Reto 9 — Laboratorio de scope y hoisting

Predice el resultado antes de ejecutar. Cada caso es independiente.

**Caso 1:**

```js
console.log(a);
var a = 1;
```

**Respuesta:** `undefined`. `var a` se iza e inicializa con `undefined`.

**Caso 2:**

```js
console.log(b);
let b = 2;
```

**Respuesta:** `ReferenceError`. `let b` está en TDZ hasta su inicialización.

**Caso 3:**

```js
console.log(sumar(2, 3));
function sumar(a, b) {
  return a + b;
}
```

**Respuesta:** `5`. La declaración de función se iza completa.

**Caso 4:**

```js
console.log(restar(5, 2));
const restar = function (a, b) {
  return a - b;
};
```

**Respuesta:** `ReferenceError` por TDZ. La variable existe, pero no puede usarse antes de la línea de declaración.

**Caso 5:**

```js
const nombre = "global";

function mostrar() {
  const nombre = "local";
  console.log(nombre);
}

mostrar();
console.log(nombre);
```

**Respuesta:** `"local"` y luego `"global"`. El shadowing solo afecta dentro de la función.

**Caso 6:**

```js
function crear() {
  let n = 0;
  return function () {
    n++;
    return n;
  };
}

const f1 = crear();
const f2 = crear();

console.log(f1()); // 1
console.log(f1()); // 2
console.log(f2()); // 1
```

**Respuesta:** `1`, `2`, `1`. Cada llamada a `crear` crea un entorno independiente.

---

### 🥊 Reto 10 (integrador) — Refactorizar una función monolítica

**Enunciado:** descompón esta función en funciones pequeñas con una sola responsabilidad.

```js
// ❌ Versión monolítica
function procesarCompra(productos, esVip) {
  let subtotal = 0;
  for (const producto of productos) {
    subtotal += producto.precio * producto.cantidad;
  }

  let descuento = 0;
  if (esVip) {
    descuento = subtotal * 0.1;
  }

  const total = (subtotal - descuento) * 1.21;
  console.log(`Total: ${total.toFixed(2)} €`);
  return total;
}
```

**Solución refactorizada:**

```js
// 1. Calcula el subtotal.
function calcularSubtotal(productos) {
  let subtotal = 0;
  for (const producto of productos) {
    subtotal += producto.precio * producto.cantidad;
  }
  return subtotal;
}

// 2. Calcula el descuento según el tipo de cliente.
function calcularDescuento(subtotal, esVip) {
  if (!esVip) return 0;
  return subtotal * 0.1;
}

// 3. Aplica el IVA.
function calcularTotal(subtotal, descuento, iva = 0.21) {
  return (subtotal - descuento) * (1 + iva);
}

// 4. Formatea para mostrar.
function formatearEuros(cantidad) {
  return `${cantidad.toFixed(2)} €`;
}

// 5. Orquesta: se lee como una frase.
function procesarCompra(productos, esVip) {
  const subtotal = calcularSubtotal(productos);
  const descuento = calcularDescuento(subtotal, esVip);
  const total = calcularTotal(subtotal, descuento);
  console.log(`Total: ${formatearEuros(total)}`);
  return total;
}

const carrito = [
  { precio: 20, cantidad: 2 },
  { precio: 5, cantidad: 3 },
];

console.log(procesarCompra(carrito, true));  // Total: 59.89 € → 59.894999999999996
console.log(procesarCompra(carrito, false)); // Total: 66.55 € → 66.55
```

> 🧠 **Detalle de precisión:** el total con descuento es `59.894999999999996`, no `59.895` exacto (es el mismo fenómeno de coma flotante del Módulo 1). `toFixed(2)` lo muestra como `"59.89"`. Para dinero real se trabaja en céntimos enteros, como ya viste.

**Beneficios:**

- `calcularSubtotal` se puede probar con un array vacío, con un solo producto, etc.
- `calcularDescuento` se puede cambiar sin tocar el IVA.
- `formatearEuros` se reutiliza en toda la aplicación.
- `procesarCompra` solo coordina; no mezcla cálculo, formato y salida.

---

## 2.11 — Errores comunes, glosario y autoevaluación

### 2.11.1 Los 12 errores más frecuentes de este nivel

| Error | Ejemplo | Solución |
|---|---|---|
| Olvidar `return` | `function f(a){ a*2; }` | `return a * 2;` |
| Arrow con llaves sin `return` | `(n) => { n * 2; }` | `(n) => n * 2` |
| Confundir función con llamada | `console.log(f)` | `console.log(f())` |
| Llamar una expresión antes de definirla | `f(); const f = ...` | Define antes o usa declaración |
| Default con `null` | `f(null)` esperando el default | El default solo aplica a `undefined` |
| Rest no al final | `function f(...a, b){}` | `function f(a, ...resto){}` |
| Mutar parámetros sin avisar | `lista[lista.length] = x` | Devuelve una copia o documenta |
| `arguments` en arrow | `() => arguments[0]` | Usa rest o parámetros con nombre |
| Closure con `var` en bucle | `for (var i...)` | Usa `let` |
| Recursión sin caso base | `function f(){ return f(); }` | Añade un caso base |
| Shadowing accidental | `const nombre = ...` dentro de una función | Renombra o elimina la interna |
| Demasiados parámetros | `f(a,b,c,d,e,f)` | Agrupa en un objeto |

### 2.11.2 Glosario del módulo

- **Aridad:** número de argumentos que acepta una función.
- **Callback:** función que se pasa a otra para que la ejecute.
- **Caso base:** condición que detiene una recursión.
- **Closure:** función que recuerda el entorno donde fue creada.
- **Efecto secundario:** modificación de estado externo a la función.
- **Expresión de función:** función asignada a una variable.
- **Función de orden superior (HOF):** recibe o devuelve una función.
- **Hoisting:** registro de declaraciones antes de la ejecución.
- **IIFE:** función que se define y se ejecuta inmediatamente.
- **Memoización:** cachear resultados para evitar recalcular.
- **Parámetro:** nombre en la definición de la función.
- **Argumento:** valor concreto en la llamada.
- **Recursión:** función que se llama a sí misma.
- **Scope:** zona donde un nombre es visible.
- **Scope chain:** cadena de búsqueda de variables.
- **Shadowing:** ocultar una variable externa con otra interna.
- **TDZ:** zona temporal muerta de `let`/`const`.

### 2.11.3 Autoevaluación (responde sin mirar)

1. ¿Cuál es la diferencia entre parámetro y argumento?
2. ¿Qué devuelve una función sin `return`?
3. ¿Por qué una declaración de función se puede llamar antes y una expresión no?
4. ¿Qué diferencia hay entre `function f(){}` y `const f = function(){}`?
5. ¿Cuándo se aplica un parámetro por defecto: con `null` o con `undefined`?
6. ¿Qué hace el parámetro rest y qué restricción tiene?
7. ¿Qué es el scope léxico?
8. ¿Qué es un closure y por qué mantiene viva una variable?
9. ¿Por qué `var` en un bucle con closures da resultados inesperados?
10. ¿Qué necesita toda función recursiva para no desbordar la pila?
11. ¿Qué es una función de orden superior?
12. ¿Qué diferencia hay entre pasar un primitivo y pasar un objeto a una función?

> Si respondes 9 de 12 con seguridad, estás listo para el Módulo 3. Si fallas en closures o scope, relee las secciones 2.4, 2.5 y 2.6: son la base de la programación avanzada en JavaScript.

---

## 🎯 Cierre del Módulo 2

Has aprendido:

- Qué es una función y cómo se compone.
- Las tres formas de declararla y cuándo usar cada una.
- Parámetros, argumentos, defaults, rest y el legado `arguments`.
- Scope global, de función, de bloque, scope léxico y shadowing.
- Hoisting con precisión: qué se iza, qué no y por qué.
- Closures: qué son, cómo viven en memoria y cómo usarlos para estado privado.
- Recursión con caso base y análisis de pila.
- Funciones de orden superior y callbacks sincrónicos.

**En el Módulo 3** entrarás en las estructuras de datos: arrays y objetos a fondo, métodos de transformación (`map`, `filter`, `reduce`), destructuring, `Map`, `Set`, `WeakMap` y `WeakSet`. Ahí los closures y las HOF que acabas de aprender se van a multiplicar.

---

## ✅ Checklist de dominio del Módulo 2

- [ ] Sé explicar qué es una función y para qué sirve `return`.
- [ ] Distingo declaración, expresión y arrow function.
- [ ] Sé cuándo una función se iza y cuándo no.
- [ ] Entiendo la diferencia entre parámetro y argumento.
- [ ] Uso parámetros por defecto correctamente (solo `undefined`).
- [ ] Sé usar rest y explicar por qué no es lo mismo que spread.
- [ ] Entiendo el scope global, de función y de bloque.
- [ ] Sé trazar la cadena de scope y detectar shadowing.
- [ ] Puedo explicar el hoisting sin decir "el código sube".
- [ ] Sé qué es un closure y puedo escribir un contador con estado privado.
- [ ] Entiendo por qué `var` falla en closures dentro de bucles.
- [ ] Sé escribir una función recursiva con caso base.
- [ ] Distingo recursión de iteración y sé cuándo usar cada una.
- [ ] Sé qué es una HOF y un callback.
- [ ] Puedo refactorizar una función monolítica en funciones pequeñas.
- [ ] Resolví los 10 retos sin mirar la solución.
