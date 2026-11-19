# 🟨 Curso Completo de JavaScript — De Cero Absoluto a Experto

> **Módulo 3 — Arrays, Objetos y Estructuras de Datos**
>
> Última actualización: 2026-11-13
> Nivel: intermedio inicial
> Requisitos: Módulos 1 y 2 completados

---

## 📋 Índice del módulo

1. [Arrays a fondo](#31--arrays-a-fondo)
2. [Métodos de array: mutadores](#32--métodos-de-array-mutadores)
3. [Métodos de array: no mutadores y búsqueda](#33--métodos-de-array-no-mutadores-y-búsqueda)
4. [Iteración y transformación](#34--iteración-y-transformación)
5. [Objetos a fondo](#35--objetos-a-fondo)
6. [Destructuring](#36--destructuring)
7. [Spread y rest](#37--spread-y-rest)
8. [Optional chaining y nullish coalescing](#38--optional-chaining-y-nullish-coalescing)
9. [Map, Set, WeakMap y WeakSet](#39--map-set-weakmap-y-weakset)
10. [Patrones con colecciones](#310--patrones-con-colecciones)
11. [Buenas prácticas y anti-patrones](#311--buenas-prácticas-y-anti-patrones)
12. [Retos con solución explicada](#312--retos-con-solución-explicada)
13. [Errores comunes, glosario y autoevaluación](#313--errores-comunes-glosario-y-autoevaluación)

---

## Convención pedagógica

Este módulo solo usa conceptos **ya explicados**. Este es el inventario exacto antes de empezar.

**Ya sabes (Módulos 1 y 2):**

- Variables, tipos, operadores, `typeof`, `in`, ternario.
- `if/else`, `switch`, `for`, `while`, `do...while`, `for...of`, `for...in`.
- Strings y números: `length`, `trim`, `toUpperCase`, `split`, `includes`, `repeat`, `padStart`, `Number()`, `toFixed`, etc.
- Funciones: declaración, expresión, arrow, defaults, rest, scope, hoisting, closures, recursión, HOF y callbacks **sincrónicos**.
- Arrays y objetos **básicos**: literales, índices, propiedades, `length`.
- `const`/`let`, TDZ, modo estricto, paso por valor y por referencia.

**Nuevo en este módulo (se explica antes de usarse):**

| Concepto | Sección |
|---|---|
| Métodos de array (mutadores y no mutadores) | 3.2 y 3.3 |
| `map`, `filter`, `reduce`, `some`, `every`, `find` | 3.4 |
| `Object.keys/values/entries/fromEntries/assign/hasOwn/freeze` | 3.5 |
| Destructuring de arrays y objetos | 3.6 |
| Spread y rest en arrays, objetos y llamadas | 3.7 |
| `?.` y `??` | 3.8 |
| `new` con constructores incorporados | 3.9 |
| `Map`, `Set`, `WeakMap`, `WeakSet` | 3.9 |
| `localeCompare`, `structuredClone`, `Object.groupBy` | 3.2, 3.5 y 3.10 |

**Lo que NO usaremos todavía:**

| Concepto | Módulo |
|---|---|
| `this`, `call/apply/bind`, getters/setters, clases, prototipos propios | Módulo 4 |
| Promesas, `async/await`, `setTimeout` | Módulo 5 |
| DOM, eventos, `localStorage` | Módulo 6 |
| `import`/`export`, `try/catch`, `fetch`, JSON, regex | Módulo 7 |
| `Date`, `Intl` | Más adelante |

> 📌 Si ves algo que no está en la lista de "ya sabes" ni en la de "nuevo", es un error del material. Avísame y lo corrijo.

**Al terminar este módulo podrás:**

- Elegir el método de array correcto sin memorizar listas.
- Transformar, filtrar, agrupar, ordenar y buscar datos reales.
- Copiar y actualizar estructuras sin mutar las originales por accidente.
- Entender cuándo un objeto es mejor que un `Map` y cuándo un `Set` resuelve el problema.
- Leer código profesional lleno de `map`, `filter`, `reduce`, `...` y `?.` sin miedo.

---

## 3.1 — Arrays a fondo

### 3.1.1 Qué es realmente un array

Un **array** es una colección **ordenada** de valores. Cada valor tiene una **posición numérica** llamada **índice**, que empieza en `0`.

```js
const lenguajes = ["JavaScript", "Python", "Rust"];

console.log(lenguajes[0]);      // "JavaScript"
console.log(lenguajes[2]);      // "Rust"
console.log(lenguajes.length);  // 3
```

Pero hay un detalle que sorprende a todos: **un array no es un tipo primitivo**. Es un objeto especializado.

```js
console.log(typeof []);          // "object" ⚠️
console.log(Array.isArray([]));  // true ✅
console.log(Array.isArray({}));  // false
```

`typeof` no distingue un array de un objeto normal. Para eso existe `Array.isArray`, que es la única comprobación fiable.

**Modelo mental:** un array es un objeto cuyas claves son números (`0`, `1`, `2`...) y que además mantiene automáticamente una propiedad `length`.

```js
const arr = ["a", "b"];
arr[0];        // "a"
arr["0"];      // "a"  ← los índices son strings por dentro
arr.length;    // 2
```

> 🧠 Esto explica dos cosas: por qué `arr[0]` y `arr["0"]` son lo mismo, y por qué `typeof []` es `"object"`.

### 3.1.2 Crear arrays

**1. Literal (el 99 % de las veces):**

```js
const vacio = [];
const numeros = [1, 2, 3];
const mixto = [1, "dos", true, null]; // permitido, pero suele ser mala idea
```

**2. `Array.of(...)`: crea un array con los argumentos dados.**

```js
console.log(Array.of(3));       // [3]  ✅ un array con un 3
console.log(Array.of(1, 2, 3)); // [1, 2, 3]
```

**3. `Array.from(...)`: convierte en array real algo que se puede recorrer (un string, un array-like).**

```js
console.log(Array.from("hola"));            // ["h", "o", "l", "a"]
console.log(Array.from([1, 2, 3]));         // [1, 2, 3] (copia)
console.log(Array.from({ length: 3 }, function (_, i) {
  return i + 1;
}));                                        // [1, 2, 3]
```

El segundo argumento de `Array.from` es una función de transformación, igual que el callback de `map` (lo verás en 3.4).

**4. `Array(n)`: crea un array **vacío** de longitud `n`.**

```js
const huecos = Array(3);
console.log(huecos.length);  // 3
console.log(huecos);         // [ <3 empty items> ] ⚠️ no contiene undefined
console.log(0 in huecos);    // false
```

> ⚠️ `Array(3)` **no** crea `[3]` ni `[undefined, undefined, undefined]`. Crea un array con **huecos**. Si quieres valores, usa `Array.from({ length: 3 }, fn)` o un literal.

**5. Spread (se explica en 3.7):**

```js
// Vista previa: lo verás a fondo en 3.7
const numeros = [1, 2, 3];
const copia = [...numeros];

console.log(copia); // [1, 2, 3]
```

### 3.1.3 Índices, `length` y huecos

**Acceso fuera de rango devuelve `undefined`, no un error:**

```js
const letras = ["a", "b"];
console.log(letras[5]);   // undefined
console.log(letras[-1]);  // undefined ⚠️ los índices negativos no existen
```

Para el último elemento hay dos formas:

```js
console.log(letras[letras.length - 1]); // "b" (funciona en cualquier versión)
console.log(letras.at(-1));             // "b" ✅ (ES2022, se ve en 3.3)
```

**`length` es escribible y muta el array:**

```js
const arr = [1, 2, 3];
arr.length = 1;
console.log(arr);          // [1]  ← truncó el resto

arr.length = 3;
console.log(arr);          // [1, <2 empty items>] ⚠️ aparecen huecos
console.log(arr[2]);       // undefined
```

**Huecos (*holes*):** un índice que no existe. No es lo mismo que un índice con valor `undefined`.

```js
const conHueco = [1, , 3];       // ojo: dos comas seguidas
console.log(conHueco.length);    // 3
console.log(conHueco[1]);        // undefined
console.log(1 in conHueco);      // false ← el índice 1 NO existe

const conUndefined = [1, undefined, 3];
console.log(1 in conUndefined);  // true ← el índice 1 SÍ existe
```

**Consecuencias de los huecos:**

- `for...of` los trata como `undefined`.
- Los métodos de array que verás en 3.4 (`map`, `filter`, `forEach`, `reduce`) **saltan** los huecos.
- `JSON.stringify` los convierte en `null` (lo verás en el Módulo 7).

```js
const h = [1, , 3];

for (const valor of h) {
  console.log(valor); // 1, undefined, 3
}
```

> 📌 **Vista previa (3.4):** cuando llegues a `map` y `filter`, recuerda que ambos saltan los huecos. No necesitas entenderlos todavía.

```js
// Vista previa: map y filter se explican en 3.4
const h = [1, , 3];
console.log(h.map(function (n) { return n * 2; }));   // [2, <1 empty item>, 6]
console.log(h.filter(function () { return true; }));  // [1, 3] ⚠️ saltó el hueco
```

**Buenas prácticas con huecos:**

```js
// ✅ Crea arrays completos desde el principio
const notas = [0, 0, 0];

// ✅ Si necesitas rellenar, usa fill (3.2)
const ceros = [0, 0, 0];

// ❌ Evita [1, , 3] y Array(5) si vas a iterar
```

**`delete` en arrays deja huecos:**

```js
const nums = [10, 20, 30];
delete nums[1];
console.log(nums);        // [10, <1 empty item>, 30]
console.log(nums.length); // 3 ⚠️ la longitud no cambia
```

Para eliminar de verdad usa `splice` (3.2) o crea un array nuevo con `filter` (3.4).

### 3.1.4 Arrays multidimensionales

Un array puede contener otros arrays. Eso permite representar matrices, tableros y listas de listas.

```js
const matriz = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

console.log(matriz[1][2]); // 6  ← fila 1, columna 2
console.log(matriz.length); // 3
```

**Recorrer una matriz:**

```js
for (const fila of matriz) {
  let linea = "";
  for (const valor of fila) {
    linea += valor + " ";
  }
  console.log(linea);
}
// 1 2 3
// 4 5 6
// 7 8 9
```

**Cuidado con las copias:** una copia superficial de la matriz comparte las filas.

```js
const copia = Array.from(matriz); // copia superficial (Array.from, 3.1.2)
copia[0][0] = 99;
console.log(matriz[0][0]); // 99 ⚠️ se modificó el original
```

Para copiar de verdad necesitas copiar cada fila (o usar `structuredClone`, que veremos en 3.5).

### 3.1.5 Referencia vs copia

Este es **el** concepto que más bugs causa con arrays y objetos.

```js
const original = [1, 2, 3];
const alias = original;     // NO copia: apunta al mismo array

alias[0] = 99;
console.log(original[0]);   // 99 ⚠️
console.log(alias === original); // true
```

`===` compara **referencias** (direcciones de memoria), no contenidos:

```js
console.log([1, 2] === [1, 2]); // false ⚠️ son dos arrays distintos
```

**Copia superficial correcta:**

```js
const original = [1, 2, 3];
const copia = Array.from(original); // copia superficial (3.1.2)

copia[0] = 99;
console.log(original[0]); // 1 ✅
console.log(copia[0]);    // 99
```

**Pero la copia es superficial:** si los elementos son objetos, se comparten.

```js
const personas = [{ nombre: "Ana" }];
const copia = Array.from(personas);

copia[0].nombre = "Luis";
console.log(personas[0].nombre); // "Luis" ⚠️ mismo objeto dentro
```

> 🧠 **Regla:** `Array.from` (y más adelante `slice` en 3.3 y el spread en 3.7) copian **el array**, no lo que hay dentro.

### 3.1.6 `const` no significa inmutable

`const` impide **reasignar la variable**, no modificar el contenido.

```js
const numeros = [1, 2, 3];

numeros[0] = 99;      // ✅ permitido: mutas el contenido
numeros.length = 1;   // ✅ permitido
// numeros = [];      // ❌ TypeError: Assignment to constant variable
```

Si quieres bloquear la mutación, necesitas `Object.freeze` (3.5), sabiendo que es **superficial**.

### 3.1.7 Comprobaciones básicas

```js
const valor = [1, 2, 3];

Array.isArray(valor);   // true ✅
Array.isArray("abc");   // false
Array.isArray({ 0: "a", length: 1 }); // false ← no es un array real

valor.length === 0;     // false → ¿está vacío?
```

**Array-like (parecido a un array):** objetos con `length` e índices, como `arguments` (Módulo 2) o el resultado de algunos APIs del DOM (Módulo 6). No tienen métodos de array.

```js
function convertir() {
  // arguments es array-like, no array
  console.log(Array.isArray(arguments)); // false
  const real = Array.from(arguments);
  console.log(Array.isArray(real));      // true
  return real;
}

console.log(convertir("a", "b")); // ["a", "b"]
```

### ✅ Haz esto / ❌ Evita esto (3.1)

```js
// ✅ Literales para datos conocidos
const dias = ["lunes", "martes", "miércoles"];

// ✅ Array.isArray para comprobar
if (Array.isArray(datos)) { /* ... */ }

// ✅ Copia explícita cuando vas a modificar
const copia = Array.from(original);

// ✅ Comprueba el último elemento con length o at
const ultimo = dias[dias.length - 1];

// ❌ Alias sin darte cuenta
const alias = original;
alias[0] = 1; // muta el original

// ❌ Array(3) esperando [3] o [undefined, undefined, undefined]
const mal = Array(3);

// ❌ Índices negativos
console.log(dias[-1]); // undefined

// ❌ delete para quitar elementos
delete dias[0]; // deja un hueco
```

---

## 3.2 — Métodos de array: mutadores

Los métodos se dividen en dos familias:

- **Mutadores:** modifican el array original.
- **No mutadores:** devuelven un array nuevo (o un valor) sin tocar el original.

> ⚠️ Confundir ambas familias es la causa número uno de bugs con arrays. Memoriza esta sección.

### 3.2.1 `push` y `pop`: el final del array

**`push(...elementos)`** añade al final y devuelve la **nueva longitud**.

```js
const pila = ["a", "b"];
const nuevaLongitud = pila.push("c");

console.log(nuevaLongitud); // 3
console.log(pila);          // ["a", "b", "c"]
```

**`pop()`** elimina el último y devuelve el **elemento eliminado**.

```js
const pila = ["a", "b", "c"];
const eliminado = pila.pop();

console.log(eliminado); // "c"
console.log(pila);      // ["a", "b"]
```

Con `push` y `pop` implementas una **pila** (LIFO: último en entrar, primero en salir).

```js
const historial = [];

historial.push("página 1");
historial.push("página 2");
historial.push("página 3");

console.log(historial.pop()); // "página 3" ← el botón "atrás"
console.log(historial);       // ["página 1", "página 2"]
```

### 3.2.2 `shift` y `unshift`: el principio del array

**`shift()`** elimina el primero y lo devuelve.

```js
const cola = ["a", "b", "c"];
console.log(cola.shift()); // "a"
console.log(cola);         // ["b", "c"]
```

**`unshift(...elementos)`** añade al principio y devuelve la nueva longitud.

```js
const cola = ["b", "c"];
console.log(cola.unshift("a")); // 3
console.log(cola);              // ["a", "b", "c"]
```

Con `push` y `shift` implementas una **cola** (FIFO: primero en entrar, primero en salir).

```js
const turnos = ["Ana", "Luis"];
turnos.push("Eva");        // llega Eva
console.log(turnos.shift()); // "Ana" ← se atiende al primero
console.log(turnos);         // ["Luis", "Eva"]
```

> ⚠️ **Coste:** `shift` y `unshift` tienen que **desplazar todos los índices**, así que son `O(n)`. Con arrays de miles de elementos en un bucle, esto se nota. `push` y `pop` son `O(1)`.

### 3.2.3 `splice`: insertar y eliminar en cualquier posición

`splice(inicio, cantidadAEliminar, ...elementosAInsertar)` es el método más potente y el más fácil de usar mal.

- **Muta** el array.
- Devuelve un array con los elementos **eliminados**.

**Eliminar:**

```js
const meses = ["Ene", "Feb", "Mar", "Abr"];
const eliminados = meses.splice(1, 2);

console.log(eliminados); // ["Feb", "Mar"]
console.log(meses);      // ["Ene", "Abr"]
```

**Insertar sin eliminar:**

```js
const meses = ["Ene", "Mar", "Abr"];
const nada = meses.splice(1, 0, "Feb");

console.log(nada);  // [] ← no eliminó nada
console.log(meses); // ["Ene", "Feb", "Mar", "Abr"]
```

**Reemplazar:**

```js
const colores = ["rojo", "verde", "azul"];
const viejos = colores.splice(1, 1, "amarillo");

console.log(viejos);  // ["verde"]
console.log(colores); // ["rojo", "amarillo", "azul"]
```

**Índices negativos:** cuentan desde el final.

```js
const nums = [1, 2, 3, 4];
nums.splice(-2, 1); // elimina el 3
console.log(nums);  // [1, 2, 4]
```

**Error clásico:** creer que `splice` devuelve el array modificado.

```js
const arr = [1, 2, 3];
const resultado = arr.splice(1, 1);

console.log(resultado); // [2] ⚠️ son los eliminados, no el array
console.log(arr);       // [1, 3]
```

> 🧠 **Truco para recordar:** `splice` **corta y pega** en el original; lo que devuelve son los **trozos cortados**.

### 3.2.4 `sort`: ordenar (y sus trampas)

`sort()` **muta** el array y, por defecto, ordena **convirtiendo cada elemento a string**.

```js
const numeros = [10, 9, 1, 100];
numeros.sort();
console.log(numeros); // [1, 10, 100, 9] ⚠️ orden lexicográfico
```

¿Por qué? Porque compara `"10" < "9"` carácter a carácter: `"1"` va antes que `"9"`.

**Para números, usa un comparador:**

```js
const numeros = [10, 9, 1, 100];

numeros.sort(function (a, b) {
  return a - b;
});
console.log(numeros); // [1, 9, 10, 100] ✅ ascendente

numeros.sort(function (a, b) {
  return b - a;
});
console.log(numeros); // [100, 10, 9, 1] ✅ descendente
```

**Cómo funciona el comparador:** debe devolver un número.

| Resultado | Significado |
|---|---|
| negativo | `a` va antes que `b` |
| `0` | mismo orden (se conserva el orden original) |
| positivo | `a` va después que `b` |

```js
[3, 1, 2].sort(function (a, b) { return a - b; }); // [1, 2, 3]
```

**Error clásico:** devolver un booleano.

```js
// ❌ a > b devuelve true/false → se convierte en 1/0, nunca en negativo
const mal = [3, 1, 2].sort(function (a, b) {
  return a > b;
});
console.log(mal); // [3, 1, 2] ⚠️ no ordena

// ✅ Devuelve una resta
const bien = [3, 1, 2].sort(function (a, b) {
  return a - b;
});
```

**Strings y acentos:** el orden por defecto es por código UTF-16, no alfabético humano.

```js
const palabras = ["Zorro", "árbol", "abeja"];
palabras.sort();
console.log(palabras); // ["Zorro", "abeja", "árbol"] ⚠️
```

`"Z"` (90) va antes que `"a"` (97), y `"á"` (225) va después de `"z"` (122). Para ordenar texto real usa `localeCompare`:

```js
const palabras = ["Zorro", "árbol", "abeja"];

palabras.sort(function (a, b) {
  return a.localeCompare(b, "es");
});
console.log(palabras); // ["abeja", "árbol", "Zorro"] ✅
```

`localeCompare` compara según las reglas de un idioma: ignora mayúsculas/minúsculas de forma natural y coloca las tildes donde corresponden. El segundo argumento es el código del idioma (`"es"`).

**Ordenar objetos por una propiedad:**

```js
const usuarios = [
  { nombre: "Luis", edad: 32 },
  { nombre: "Ana", edad: 25 },
  { nombre: "Eva", edad: 40 },
];

usuarios.sort(function (a, b) {
  return a.edad - b.edad;
});

console.log(usuarios[0].nombre); // "Ana"
console.log(usuarios[1].nombre); // "Luis"
console.log(usuarios[2].nombre); // "Eva"
```

**Ordenar por texto:**

```js
usuarios.sort(function (a, b) {
  return a.nombre.localeCompare(b.nombre, "es");
});
console.log(usuarios[0].nombre); // "Ana"
```

**Estabilidad:** desde ES2019, `sort` es **estable**: si dos elementos empatan, conservan su orden original. Esto permite ordenar por varios criterios en pasadas sucesivas:

```js
// Primero por edad; si empatan, por nombre
usuarios.sort(function (a, b) {
  return a.nombre.localeCompare(b.nombre, "es");
});
usuarios.sort(function (a, b) {
  return a.edad - b.edad;
});
```

**No ordenes el original si lo necesitas intacto:**

```js
const edades = [3, 1, 2];
const ordenadas = Array.from(edades).sort(function (a, b) {
  return a - b;
});

console.log(edades);    // [3, 1, 2] ✅ intacto
console.log(ordenadas); // [1, 2, 3]
```

En 3.3 verás `slice()` (otra forma de copiar) y `toSorted`, que ordena sin mutar en un solo paso.

### 3.2.5 `reverse`: invertir

**Muta** el array y devuelve la misma referencia.

```js
const letras = ["a", "b", "c"];
letras.reverse();
console.log(letras); // ["c", "b", "a"]
```

**Error clásico:** usar `reverse` como si copiara.

```js
const original = [1, 2, 3];
const invertido = original.reverse();

console.log(invertido); // [3, 2, 1]
console.log(original);  // [3, 2, 1] ⚠️ el original también cambió
```

### 3.2.6 `fill`: rellenar

`fill(valor, inicio, fin)` rellena desde `inicio` (incluido) hasta `fin` (excluido).

```js
const ceros = [1, 2, 3, 4];
ceros.fill(0, 1, 3);
console.log(ceros); // [1, 0, 0, 4]
```

Sin índices, rellena todo:

```js
const todo = [1, 2, 3];
todo.fill("x");
console.log(todo); // ["x", "x", "x"]
```

> ⚠️ **Cuidado con objetos:** `fill` guarda **la misma referencia** en todas las posiciones.

```js
const filas = [0, 0, 0];
filas.fill({ activo: false });

filas[0].activo = true;
console.log(filas[1].activo); // true ⚠️ es el mismo objeto
```

### 3.2.7 `copyWithin` (menos común)

Copia una parte del array sobre otra parte **del mismo array**, sin cambiar la longitud.

```js
const nums = [1, 2, 3, 4, 5];
nums.copyWithin(0, 3);
console.log(nums); // [4, 5, 3, 4, 5]
```

Se usa en buffers y algoritmos de bajo nivel. En código de negocio casi nunca lo necesitarás.

### 3.2.8 Coste y cuándo evitar mutadores

| Operación | Coste | Motivo |
|---|---|---|
| `push` / `pop` | `O(1)` | Solo tocan el final |
| `shift` / `unshift` | `O(n)` | Desplazan todos los índices |
| `splice` | `O(n)` | Desplaza desde el punto de corte |
| `sort` | `O(n log n)` | Comparaciones y reordenación |
| `reverse` | `O(n)` | Recorre todo |
| `fill` | `O(n)` | Recorre el rango |

**Cómo leer esa notación:** es la **complejidad temporal**, una forma de describir cómo crece el trabajo cuando crece el array (`n` es el número de elementos).

- `O(1)`: tiempo **constante**, no depende del tamaño.
- `O(n)`: tiempo **proporcional** al tamaño. Con 10 000 elementos, `shift` mueve 10 000 posiciones.
- `O(n log n)`: algo más que proporcional; es el coste típico de ordenar.
- `O(n²)`: el trabajo crece con el **cuadrado** del tamaño; aparece cuando recorres el array dentro de otro recorrido.

**Regla práctica:**

- Si construyes una lista, `push` es perfecto.
- Si necesitas quitar el primero muchas veces, usa un índice que avance o una estructura de cola adecuada (ver `Map` en 3.9).
- No uses `splice` dentro de un bucle sobre el mismo array sin pensar: los índices cambian.

```js
// ❌ Eliminar mientras recorres: te saltas elementos
const nums = [1, 2, 4, 3];
for (let i = 0; i < nums.length; i++) {
  if (nums[i] % 2 === 0) {
    nums.splice(i, 1); // al borrar, el siguiente se desplaza a i
  }
}
console.log(nums); // [1, 4, 3] ⚠️ el 4 se saltó

// ✅ Construye un array nuevo sin tocar el original
const numeros = [1, 2, 3, 4];
const soloImpares = [];

for (const n of numeros) {
  if (n % 2 !== 0) {
    soloImpares.push(n);
  }
}

console.log(soloImpares); // [1, 3]
console.log(numeros);     // [1, 2, 3, 4] ✅ intacto
```

### ✅ Haz esto / ❌ Evita esto (3.2)

```js
// ✅ Usa push/pop para pilas
pila.push(x);
const ultimo = pila.pop();

// ✅ Comparador numérico explícito
notas.sort((a, b) => a - b);

// ✅ localeCompare para texto
nombres.sort((a, b) => a.localeCompare(b, "es"));

// ✅ Copia antes de ordenar si necesitas el original
const ordenado = Array.from(datos).sort(comparar);

// ❌ sort() sin comparador en números
[10, 9, 1].sort(); // [1, 10, 9]

// ❌ Comparador booleano
datos.sort((a, b) => a > b);

// ❌ Creer que splice devuelve el array modificado
const arr = [1, 2, 3];
const eliminados = arr.splice(1, 1); // [2], no [1, 3]

// ❌ fill con objetos compartidos
Array(3).fill({}); // los tres apuntan al mismo objeto

// ❌ reverse pensando que copia
const invertido = original.reverse(); // muta original
```

---

## 3.3 — Métodos de array: no mutadores y búsqueda

### 3.3.1 `slice`: extraer una porción

`slice(inicio, fin)` devuelve un **array nuevo** con los elementos desde `inicio` (incluido) hasta `fin` (excluido). **No muta.**

```js
const letras = ["a", "b", "c", "d"];

console.log(letras.slice(1, 3)); // ["b", "c"]
console.log(letras.slice(2));    // ["c", "d"]
console.log(letras.slice(-2));   // ["c", "d"] ← desde el final
console.log(letras.slice());     // ["a", "b", "c", "d"] ← copia completa
console.log(letras);             // ["a", "b", "c", "d"] ✅ intacto
```

**Casos límite:**

```js
[1, 2, 3].slice(5);      // []
[1, 2, 3].slice(2, 1);   // []
[1, 2, 3].slice(-10);    // [1, 2, 3] ← se ajusta al inicio
```

**Diferencia clave con `splice`:**

```js
const arr = [1, 2, 3, 4];

const trozo = arr.slice(1, 3); // [2, 3]  no muta
const quitados = arr.splice(1, 2); // [2, 3]  SÍ muta

console.log(arr); // tras slice: [1, 2, 3, 4]
                  // tras splice: [1, 4]
```

> 🧠 **Regla mnemotécnica:** `slice` = **cortar una copia**; `splice` = **empalmar en el original**.

### 3.3.2 `concat`: unir arrays

Devuelve un array nuevo con los elementos añadidos al final.

```js
const a = [1, 2];
const b = [3, 4];

console.log(a.concat(b));        // [1, 2, 3, 4]
console.log(a.concat(b, [5, 6]));// [1, 2, 3, 4, 5, 6]
console.log(a.concat(3, 4));     // [1, 2, 3, 4]
console.log(a);                  // [1, 2] ✅ intacto
```

**No aplana en profundidad**, solo un nivel:

```js
console.log([1].concat([2, [3, 4]])); // [1, 2, [3, 4]] ⚠️
```

Para aplanar de verdad, `flat` (3.3.6).

### 3.3.3 `join`: convertir a string

```js
const partes = ["2026", "11", "13"];

console.log(partes.join("-"));  // "2026-11-13"
console.log(partes.join(""));   // "20261113"
console.log(partes.join());     // "2026,11,13" ← coma por defecto
console.log([].join("-"));      // ""
```

**`null` y `undefined` se convierten en vacío:**

```js
console.log([1, null, 2, undefined, 3].join("-")); // "1--2--3"
```

Esto es útil para construir texto, pero **no** para guardar datos: al hacer `join` pierdes la estructura.

### 3.3.4 `indexOf`, `lastIndexOf` e `includes`

**`indexOf(valor, desde)`** devuelve el primer índice o `-1` si no está.

```js
const nums = [10, 20, 30, 20];

console.log(nums.indexOf(20));      // 1
console.log(nums.indexOf(20, 2));   // 3 ← empieza a buscar en el índice 2
console.log(nums.indexOf(99));      // -1
```

**`lastIndexOf`** busca desde el final:

```js
console.log(nums.lastIndexOf(20)); // 3
```

**`includes(valor)`** devuelve un booleano:

```js
console.log(nums.includes(30)); // true
console.log(nums.includes(99)); // false
```

**Diferencia importante con `NaN`:**

```js
const conNaN = [1, NaN, 3];

console.log(conNaN.indexOf(NaN));   // -1 ⚠️ indexOf usa ===
console.log(conNaN.includes(NaN));  // true ✅ includes usa SameValueZero
```

`SameValueZero` es la comparación que trata `NaN` como igual a `NaN` (y `0` como igual a `-0`). La usan `includes`, y también `Set` y `Map` (3.9).

**`includes` en strings vs arrays:** el método existe en ambos, pero en strings busca subcadenas.

```js
"JavaScript".includes("Script"); // true
["JavaScript"].includes("Script"); // false (busca el elemento completo)
```

### 3.3.5 `at`: índices negativos

```js
const letras = ["a", "b", "c"];

console.log(letras.at(0));   // "a"
console.log(letras.at(-1));  // "c" ✅ último
console.log(letras.at(-2));  // "b"
console.log(letras.at(99));  // undefined
```

También funciona en strings:

```js
console.log("hola".at(-1)); // "a"
```

> 📌 `at` es ES2022. En entornos muy antiguos se usa `arr[arr.length - 1]`.

### 3.3.6 `flat` y `flatMap`: aplanar

**`flat(profundidad)`** aplana arrays anidados. Por defecto, un nivel.

```js
const anidado = [1, [2, 3], [4, [5, 6]]];

console.log(anidado.flat());          // [1, 2, 3, 4, [5, 6]]
console.log(anidado.flat(2));         // [1, 2, 3, 4, 5, 6]
console.log(anidado.flat(Infinity));  // [1, 2, 3, 4, 5, 6]
console.log(anidado);                 // intacto ✅
```

`flat` también **elimina huecos**:

```js
console.log([1, , 3].flat()); // [1, 3]
```

**`flatMap(fn)`** es como `map` seguido de `flat(1)` (`map` se explica en 3.4; aquí basta con ver el resultado). Muy útil cuando cada elemento produce varios.

```js
const frases = ["hola mundo", "adios"];

const palabras = frases.flatMap(function (frase) {
  return frase.split(" ");
});

console.log(palabras); // ["hola", "mundo", "adios"]
```

> 📌 **Vista previa (3.4):** el equivalente con `map` + `flat` es:

```js
const palabras2 = frases
  .map(function (frase) { return frase.split(" "); })
  .flat();

console.log(palabras2); // ["hola", "mundo", "adios"]
```

**Diferencia con `map` (3.4):**

```js
frases.map(function (f) { return f.split(" "); });
// [["hola", "mundo"], ["adios"]]

frases.flatMap(function (f) { return f.split(" "); });
// ["hola", "mundo", "adios"]
```

### 3.3.7 `keys`, `values` y `entries`

Devuelven **iteradores**, no arrays. Un **iterador** es un objeto con un método `next()` que devuelve `{ value, done }`. Y un **iterable** es un objeto que puede producir un iterador y, por tanto, recorrerse con `for...of` (por ahora: arrays y strings; en 3.9 añadiremos `Map` y `Set`).

```js
const letras = ["a", "b"];

const iterador = letras.entries();

console.log(iterador.next()); // { value: [0, "a"], done: false }
console.log(iterador.next()); // { value: [1, "b"], done: false }
console.log(iterador.next()); // { value: undefined, done: true }
```

**`keys()`** da índices:

```js
const indices = letras.keys();
console.log(indices.next().value); // 0
console.log(indices.next().value); // 1
```

**`values()`** da valores:

```js
const valores = letras.values();
console.log(valores.next().value); // "a"
```

**Consumir un iterador con `for...of`:**

```js
for (const indice of letras.keys()) {
  console.log(indice); // 0, 1
}

for (const valor of letras.values()) {
  console.log(valor); // "a", "b"
}

for (const par of letras.entries()) {
  console.log(par[0], par[1]); // 0 "a" / 1 "b"
}
```

> 📌 En 3.6 verás cómo escribir `for (const [indice, valor] of letras.entries())`, que es la forma idiomática.

**Convertir el iterador en array:**

```js
console.log(Array.from(letras.keys()));   // [0, 1]
console.log(Array.from(letras.values())); // ["a", "b"]
console.log(Array.from(letras.entries()));// [[0, "a"], [1, "b"]]
```

**Los iteradores se agotan:**

```js
const it = letras.values();
console.log(it.next().value); // "a"
console.log(it.next().value); // "b"
console.log(it.next().done);  // true
console.log(it.next().value); // undefined ← ya no hay más
```

### 3.3.8 Métodos de copia (ES2023)

Estos métodos hacen lo mismo que sus versiones mutadoras, pero **devuelven una copia** y dejan el original intacto.

**`toSorted(comparador)`:**

```js
const edades = [3, 1, 2];

const ordenadas = edades.toSorted(function (a, b) {
  return a - b;
});

console.log(ordenadas); // [1, 2, 3]
console.log(edades);    // [3, 1, 2] ✅ intacto
```

**`toReversed()`:**

```js
const letras = ["a", "b", "c"];
console.log(letras.toReversed()); // ["c", "b", "a"]
console.log(letras);              // ["a", "b", "c"] ✅
```

**`toSpliced(inicio, cantidad, ...elementos)`:**

```js
const meses = ["Ene", "Feb", "Mar"];
const nuevos = meses.toSpliced(1, 1, "Febrero");

console.log(nuevos); // ["Ene", "Febrero", "Mar"]
console.log(meses);  // ["Ene", "Feb", "Mar"] ✅
```

**`with(indice, valor)`:** reemplaza una posición.

```js
const nums = [10, 20, 30];

console.log(nums.with(1, 99));  // [10, 99, 30]
console.log(nums.with(-1, 0));  // [10, 20, 0]
console.log(nums);              // [10, 20, 30] ✅
```

> 📌 Disponibles en Node 20+ y navegadores modernos. Si necesitas compatibilidad antigua, usa `slice().sort()`, `slice().reverse()`, etc.

### ✅ Haz esto / ❌ Evita esto (3.3)

```js
// ✅ slice para copiar o extraer
const copia = datos.slice();
const primerosTres = datos.slice(0, 3);

// ✅ includes para saber si existe
if (permisos.includes("admin")) { /* ... */ }

// ✅ at(-1) para el último
const ultimo = cola.at(-1);

// ✅ flatMap cuando cada elemento genera varios
const palabras = frases.flatMap((f) => f.split(" "));

// ✅ toSorted si no quieres mutar
const ordenado = datos.toSorted(comparar);

// ❌ slice(-1) esperando el último elemento
datos.slice(-1); // [ultimo], no ultimo

// ❌ indexOf para NaN
[NaN].indexOf(NaN); // -1

// ❌ join para "guardar" datos
const guardado = usuarios.join(","); // pierdes la estructura

// ❌ confundir slice y splice
datos.slice(1, 2);  // no muta
datos.splice(1, 2); // muta
```

---

## 3.4 — Iteración y transformación

Esta es la sección más importante del módulo. Estos métodos son el vocabulario diario de JavaScript profesional.

### 3.4.1 La firma del callback

Casi todos reciben una función con hasta tres argumentos:

```js
array.metodo(function (valor, indice, arrayCompleto) {
  // ...
});
```

- **`valor`:** el elemento actual.
- **`indice`:** su posición.
- **`arrayCompleto`:** el array sobre el que se iteró.

Casi siempre usarás solo el primero; los otros dos existen si los necesitas.

```js
const letras = ["a", "b"];

letras.forEach(function (valor, indice) {
  console.log(indice, valor);
});
// 0 "a"
// 1 "b"
```

> ⚠️ El callback **no** debe modificar el array mientras se recorre. Los resultados se vuelven impredecibles.

### 3.4.2 `forEach`: ejecutar algo por cada elemento

```js
const precios = [10, 20, 30];

precios.forEach(function (precio) {
  console.log(precio * 1.21);
});
// 12.1
// 24.2
// 36.3
```

**Características:**

- Devuelve **siempre `undefined`**.
- **No se puede `break`** ni `continue`.
- Se usa para **efectos secundarios** (imprimir, guardar, llamar a otra función).

```js
const resultado = precios.forEach(function (p) { return p * 2; });
console.log(resultado); // undefined ⚠️
```

Si necesitas un array nuevo, usa `map`. Si necesitas cortar, usa `for...of`.

```js
// ✅ break con for...of
for (const precio of precios) {
  if (precio > 15) break;
  console.log(precio);
}
```

### 3.4.3 `map`: transformar cada elemento

`map` devuelve un **array nuevo** de la **misma longitud**, con el resultado de aplicar la función a cada elemento.

```js
const numeros = [1, 2, 3];

const dobles = numeros.map(function (n) {
  return n * 2;
});

console.log(dobles);  // [2, 4, 6]
console.log(numeros); // [1, 2, 3] ✅ intacto
```

Con arrow (lo normal hoy):

```js
const dobles = numeros.map((n) => n * 2);
```

**Transformar objetos:**

```js
const usuarios = [
  { nombre: "Ana", edad: 25 },
  { nombre: "Luis", edad: 32 },
];

const nombres = usuarios.map((usuario) => usuario.nombre);
console.log(nombres); // ["Ana", "Luis"]

const mayores = usuarios.map((usuario) => usuario.edad >= 30);
console.log(mayores); // [false, true]
```

**Usar el índice:**

```js
const letras = ["a", "b", "c"];
const numeradas = letras.map((letra, i) => `${i + 1}. ${letra}`);

console.log(numeradas); // ["1. a", "2. b", "3. c"]
```

**Error clásico: `map` sin `return`.**

```js
// ❌ Devuelve [undefined, undefined, undefined]
const mal = [1, 2, 3].map((n) => {
  n * 2;
});

// ✅ Sin llaves (return implícito) o con return
const bien = [1, 2, 3].map((n) => n * 2);
```

**Error clásico: usar `map` solo por efectos secundarios.**

```js
// ❌ map para imprimir: creas un array inútil
[1, 2, 3].map((n) => console.log(n));

// ✅ forEach para efectos secundarios
[1, 2, 3].forEach((n) => console.log(n));
```

### 3.4.4 `filter`: quedarse con algunos

`filter` devuelve un **array nuevo** con los elementos para los que la función devuelve un valor **verdadero**.

```js
const numeros = [1, 2, 3, 4, 5, 6];

const pares = numeros.filter((n) => n % 2 === 0);
console.log(pares);   // [2, 4, 6]
console.log(numeros); // [1, 2, 3, 4, 5, 6] ✅
```

**Filtrar objetos:**

```js
const productos = [
  { nombre: "Teclado", precio: 50, stock: 3 },
  { nombre: "Ratón", precio: 20, stock: 0 },
  { nombre: "Monitor", precio: 200, stock: 2 },
];

const disponibles = productos.filter((p) => p.stock > 0);
console.log(disponibles.length); // 2
console.log(disponibles[0].nombre); // "Teclado"
```

**La función debe devolver un booleano (o algo convertible):**

```js
// ✅ Explícito
productos.filter((p) => p.precio > 100);

// ⚠️ Funciona, pero es menos legible
productos.filter((p) => p.precio);
```

**Trampa de `filter(Boolean)`:**

```js
const valores = [0, 1, "", "a", null, undefined, false, NaN];

console.log(valores.filter(Boolean)); // [1, "a"]
```

`Boolean` convierte a booleano, así que elimina `0`, `""`, `null`, `undefined`, `false` y `NaN`. A veces es lo que quieres; muchas veces no (por ejemplo, si `0` es un dato válido).

**Filtrar y transformar:** encadena `filter` y `map` (3.4.8).

### 3.4.5 `reduce`: reducir a un solo valor

`reduce` es el método más potente y el que más cuesta entender. Recorre el array acumulando un resultado.

```js
const numeros = [1, 2, 3, 4];

const suma = numeros.reduce(function (acumulador, valor) {
  return acumulador + valor;
}, 0);

console.log(suma); // 10
```

**Anatomía:**

```text
[1, 2, 3, 4].reduce(fn, 0)

Paso 1: acumulador = 0,  valor = 1  → 1
Paso 2: acumulador = 1,  valor = 2  → 3
Paso 3: acumulador = 3,  valor = 3  → 6
Paso 4: acumulador = 6,  valor = 4  → 10
Resultado: 10
```

- **`acumulador`:** el valor que se va construyendo.
- **`valor`:** el elemento actual.
- **Segundo argumento de `reduce`:** el valor inicial del acumulador.

**Sin valor inicial**, usa el primer elemento como acumulador y empieza en el segundo:

```js
const suma = [1, 2, 3, 4].reduce(function (acc, n) {
  return acc + n;
});

console.log(suma); // 10 (1 + 2 + 3 + 4)
```

**⚠️ Sin valor inicial en un array vacío lanza `TypeError`:**

```js
// [].reduce((acc, n) => acc + n);
// ❌ TypeError: Reduce of empty array with no initial value
```

Por eso, **casi siempre pasa el valor inicial**. Es más seguro y más legible.

**Casos de uso reales:**

**1. Sumar una propiedad:**

```js
const carrito = [
  { precio: 20, cantidad: 2 },
  { precio: 5, cantidad: 3 },
];

const total = carrito.reduce(function (acc, item) {
  return acc + item.precio * item.cantidad;
}, 0);

console.log(total); // 55
```

**2. Encontrar el máximo:**

```js
const notas = [7, 9, 4, 10, 6];

const maxima = notas.reduce(function (max, nota) {
  return nota > max ? nota : max;
}, notas[0]);

console.log(maxima); // 10
```

**3. Contar frecuencias:**

```js
const frutas = ["manzana", "pera", "manzana", "kiwi", "pera", "manzana"];

const conteo = frutas.reduce(function (acc, fruta) {
  if (acc[fruta] === undefined) {
    acc[fruta] = 1;
  } else {
    acc[fruta] = acc[fruta] + 1;
  }
  return acc;
}, {});

console.log(conteo); // { manzana: 3, pera: 2, kiwi: 1 }
```

**4. Aplanar un nivel:**

```js
const listas = [[1, 2], [3, 4], [5]];

const plana = listas.reduce(function (acc, lista) {
  return acc.concat(lista);
}, []);

console.log(plana); // [1, 2, 3, 4, 5]
```

**5. Agrupar por una propiedad:**

```js
const personas = [
  { nombre: "Ana", ciudad: "Madrid" },
  { nombre: "Luis", ciudad: "Bogotá" },
  { nombre: "Eva", ciudad: "Madrid" },
];

const porCiudad = personas.reduce(function (acc, persona) {
  const ciudad = persona.ciudad;

  if (acc[ciudad] === undefined) {
    acc[ciudad] = [];
  }

  acc[ciudad].push(persona);
  return acc;
}, {});

console.log(porCiudad["Madrid"].length); // 2
console.log(porCiudad["Bogotá"].length); // 1
```

> 📌 En 3.10 verás este patrón como función reutilizable y la alternativa moderna `Object.groupBy`.

**6. Construir un objeto índice:**

```js
const usuarios = [
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" },
];

const porId = usuarios.reduce(function (acc, usuario) {
  acc[usuario.id] = usuario;
  return acc;
}, {});

console.log(porId[2].nombre); // "Luis"
```

**Cuándo NO usar `reduce`:**

```js
// ❌ Ilegible: ¿qué hace esto?
const r = datos.reduce((a, b) => (b.activo ? a + b.valor : a), 0);

// ✅ Mejor: filter + reduce, cada paso se lee
const activos = datos.filter((d) => d.activo);
const total = activos.reduce((acc, d) => acc + d.valor, 0);
```

> 🧠 **Regla:** usa `reduce` cuando el resultado sea **un solo valor** (número, string, objeto, array). Si necesitas dos pasos claros, encadena `filter` y `reduce`.

### 3.4.6 `some` y `every`: comprobar condiciones

**`some`** devuelve `true` si **al menos uno** cumple.

```js
const edades = [12, 17, 22];

console.log(edades.some((edad) => edad >= 18)); // true
console.log([1, 3, 5].some((n) => n % 2 === 0)); // false
```

**`every`** devuelve `true` si **todos** cumplen.

```js
console.log(edades.every((edad) => edad >= 18)); // false
console.log([20, 30, 40].every((edad) => edad >= 18)); // true
```

**Comportamiento con arrays vacíos (importante):**

```js
console.log([].some((n) => n > 0));  // false
console.log([].every((n) => n > 0)); // true ⚠️ "todos" es vacuamente cierto
```

**Cortocircuito:** ambos paran en cuanto pueden decidir.

```js
const nums = [1, 2, 3];

nums.some(function (n) {
  console.log("some revisa", n);
  return n === 2;
});
// some revisa 1
// some revisa 2  ← ya no revisa el 3

nums.every(function (n) {
  console.log("every revisa", n);
  return n < 2;
});
// every revisa 1
// every revisa 2  ← para al fallar
```

**Uso típico:**

```js
const usuarios = [
  { nombre: "Ana", admin: false },
  { nombre: "Luis", admin: true },
];

const hayAdmin = usuarios.some((u) => u.admin);       // true
const todosAdmin = usuarios.every((u) => u.admin);    // false
```

### 3.4.7 `find`, `findIndex`, `findLast`, `findLastIndex`

**`find`** devuelve el **primer elemento** que cumple, o `undefined`.

```js
const usuarios = [
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" },
];

const encontrado = usuarios.find((u) => u.id === 2);
console.log(encontrado.nombre); // "Luis"

const noExiste = usuarios.find((u) => u.id === 99);
console.log(noExiste); // undefined
```

**`findIndex`** devuelve el índice o `-1`.

```js
console.log(usuarios.findIndex((u) => u.id === 2));  // 1
console.log(usuarios.findIndex((u) => u.id === 99)); // -1
```

**`findLast` y `findLastIndex`** buscan desde el final (ES2023):

```js
const nums = [1, 2, 3, 4, 5];

console.log(nums.findLast((n) => n % 2 === 0));      // 4
console.log(nums.findLastIndex((n) => n % 2 === 0)); // 3
```

**`find` vs `filter`:**

```js
// ✅ Quieres UNO
const uno = usuarios.find((u) => u.id === 2);

// ✅ Quieres TODOS los que cumplen
const varios = usuarios.filter((u) => u.id > 1);
```

**Error clásico:** `filter(...)[0]` en vez de `find`.

```js
// ❌ Recorre todo y crea un array para quedarte con uno
const mal = usuarios.filter((u) => u.id === 2)[0];

// ✅ Se detiene en el primero
const bien = usuarios.find((u) => u.id === 2);
```

### 3.4.8 Encadenar métodos

La verdadera potencia aparece al combinar métodos. Cada uno devuelve un array nuevo, así que puedes seguir operando.

```js
const productos = [
  { nombre: "Teclado", precio: 50, stock: 3, categoria: "periféricos" },
  { nombre: "Ratón", precio: 20, stock: 0, categoria: "periféricos" },
  { nombre: "Monitor", precio: 200, stock: 2, categoria: "pantallas" },
  { nombre: "Cable", precio: 10, stock: 10, categoria: "accesorios" },
];

const totalDisponible = productos
  .filter((p) => p.stock > 0)          // 1. solo disponibles
  .map((p) => p.precio * p.stock)      // 2. valor de cada uno
  .reduce((acc, valor) => acc + valor, 0); // 3. total

console.log(totalDisponible); // 50*3 + 200*2 + 10*10 = 650
```

**Leer una cadena:** de arriba abajo, como una receta.

```js
const nombresCaros = productos
  .filter((p) => p.precio >= 50)
  .map((p) => p.nombre);

console.log(nombresCaros); // ["Teclado", "Monitor"]
```

**No encadenes demasiado.** Si hay más de 3 o 4 pasos, divídelo en variables con nombre:

```js
// ✅ Cada paso tiene nombre
const disponibles = productos.filter((p) => p.stock > 0);
const valores = disponibles.map((p) => p.precio * p.stock);
const total = valores.reduce((acc, v) => acc + v, 0);
```

**Orden de los pasos importa:**

```js
// ✅ Primero filtra (menos elementos), luego transforma
productos.filter((p) => p.stock > 0).map((p) => p.precio);

// ⚠️ Transforma todos y luego filtra: más trabajo
productos.map((p) => p.precio).filter((precio) => precio > 0);
```

### 3.4.9 Cuándo usar un bucle clásico

Los métodos son más declarativos, pero no siempre son la mejor opción.

**Usa `for...of` o `for` cuando:**

- Necesitas `break` o `continue`.
- Necesitas modificar el array mientras lo recorres.
- Necesitas acceder al índice anterior o siguiente.
- El rendimiento es crítico y quieres evitar crear arrays intermedios.

```js
// ✅ break no existe en forEach/map/filter
for (const producto of productos) {
  if (producto.precio > 1000) {
    console.log("Demasiado caro, abortando");
    break;
  }
}
```

**Usa métodos cuando:**

- Transformas datos (`map`).
- Filtras (`filter`).
- Buscas uno (`find`).
- Compruebas condiciones (`some`/`every`).
- Acumulas un valor (`reduce`).

### 3.4.10 Tabla resumen

| Método | Devuelve | Muta | Se detiene antes | Uso típico |
|---|---|---|---|---|
| `forEach` | `undefined` | No | No | Efectos secundarios |
| `map` | Array nuevo (misma longitud) | No | No | Transformar |
| `filter` | Array nuevo (≤ longitud) | No | No | Seleccionar |
| `reduce` | Un valor cualquiera | No | No | Acumular |
| `some` | Booleano | No | Sí (al `true`) | ¿Alguno cumple? |
| `every` | Booleano | No | Sí (al `false`) | ¿Todos cumplen? |
| `find` | Elemento o `undefined` | No | Sí | Buscar uno |
| `findIndex` | Índice o `-1` | No | Sí | Buscar posición |
| `sort` | El mismo array | **Sí** | No | Ordenar |
| `toSorted` | Array nuevo | No | No | Ordenar sin mutar |

### ✅ Haz esto / ❌ Evita esto (3.4)

```js
// ✅ map para transformar
const preciosConIva = precios.map((p) => p * 1.21);

// ✅ filter para seleccionar
const caros = precios.filter((p) => p > 100);

// ✅ find para uno
const usuario = usuarios.find((u) => u.id === id);

// ✅ some para "¿existe alguno?"
const hayStock = productos.some((p) => p.stock > 0);

// ✅ reduce con valor inicial
const total = precios.reduce((acc, p) => acc + p, 0);

// ✅ for...of si necesitas break
for (const p of productos) {
  if (p.stock === 0) break;
}

// ❌ map sin return
[1, 2].map((n) => { n * 2; }); // [undefined, undefined]

// ❌ map para efectos secundarios
[1, 2].map((n) => console.log(n));

// ❌ filter(...)[0] en vez de find
usuarios.filter((u) => u.id === 1)[0];

// ❌ reduce sin valor inicial en arrays que pueden estar vacíos
[].reduce((a, b) => a + b); // TypeError

// ❌ encadenar 6 métodos sin nombres intermedios
```

---

## 3.5 — Objetos a fondo

### 3.5.1 Qué es un objeto

Un **objeto** es una colección de **pares clave-valor**. La clave es un string (o un `Symbol`) y el valor puede ser cualquier cosa: un número, un string, un array, una función u otro objeto.

```js
const persona = {
  nombre: "Ana",
  edad: 30,
  activa: true,
};
```

- `nombre`, `edad` y `activa` son **propiedades**.
- `"Ana"`, `30` y `true` son sus **valores**.
- El orden de las propiedades casi nunca importa (con matices, ver 3.5.11).

**Diferencia con un array:** un array se accede por **posición numérica**; un objeto, por **nombre**.

```js
const array = ["Ana", 30];
console.log(array[0]); // "Ana" ← posición

const objeto = { nombre: "Ana", edad: 30 };
console.log(objeto.nombre); // "Ana" ← nombre
```

### 3.5.2 Crear objetos

**1. Literal (lo normal):**

```js
const vacio = {};
const usuario = { nombre: "Ana", edad: 30 };
```

**2. Propiedades abreviadas (*shorthand*):** si la variable se llama igual que la propiedad, no repitas el nombre.

```js
const nombre = "Ana";
const edad = 30;

// ❌ Repetitivo
const usuario1 = { nombre: nombre, edad: edad };

// ✅ Shorthand
const usuario2 = { nombre, edad };

console.log(usuario2); // { nombre: "Ana", edad: 30 }
```

**3. Propiedades calculadas (*computed properties*):** el nombre de la propiedad se decide en tiempo de ejecución.

```js
const clave = "email";
const valor = "ana@example.com";

const usuario = {
  nombre: "Ana",
  [clave]: valor, // la clave es el VALOR de la variable clave
};

console.log(usuario.email); // "ana@example.com"
console.log(usuario.clave); // undefined ⚠️ no se llamó "clave"
```

**4. Métodos:** una función dentro de un objeto.

```js
const saludador = {
  nombre: "Ana",
  saludar: function () {
    return "Hola";
  },
};

console.log(saludador.saludar()); // "Hola"
```

**Sintaxis abreviada de método** (equivale a lo anterior):

```js
const saludador = {
  nombre: "Ana",
  saludar() {
    return "Hola";
  },
};

console.log(saludador.saludar()); // "Hola"
```

> 📌 Los métodos que usan `this` se estudian en el Módulo 4. Por ahora escribe métodos que usen sus propios parámetros o closures.

**5. `Object.fromEntries`:** convierte una lista de pares en un objeto (3.5.5).

### 3.5.3 Acceder a las propiedades

**Notación de punto:** para nombres fijos y válidos.

```js
const usuario = { nombre: "Ana", edad: 30 };

console.log(usuario.nombre); // "Ana"
console.log(usuario.edad);   // 30
console.log(usuario.email);  // undefined (no lanza error)
```

**Notación de corchetes:** para nombres dinámicos, con espacios o con guiones.

```js
const usuario = { "nombre completo": "Ana López", edad: 30 };

console.log(usuario["nombre completo"]); // "Ana López"

const clave = "edad";
console.log(usuario[clave]); // 30 ✅ usa el valor de la variable

console.log(usuario.clave);  // undefined ⚠️ busca la propiedad "clave"
```

**Asignar y crear propiedades:**

```js
const usuario = { nombre: "Ana" };

usuario.edad = 30;            // crea la propiedad
usuario["activo"] = true;     // también
console.log(usuario);         // { nombre: "Ana", edad: 30, activo: true }
```

**`const` no impide modificar propiedades:**

```js
const config = { modo: "dev" };
config.modo = "prod";      // ✅ permitido
config.puerto = 3000;      // ✅ permitido
// config = {};            // ❌ TypeError
```

**Acceso encadenado:** cada nivel debe existir o tendrás un error.

```js
const pedido = {
  cliente: { nombre: "Ana" },
};

console.log(pedido.cliente.nombre); // "Ana"
// console.log(pedido.direccion.ciudad);
// ❌ TypeError: Cannot read properties of undefined (reading 'ciudad')
```

Ese error se resuelve con optional chaining en 3.8.

### 3.5.4 `Object.keys`, `Object.values` y `Object.entries`

Devuelven **arrays** con las propiedades **propias y enumerables** del objeto.

```js
const usuario = { nombre: "Ana", edad: 30, activo: true };

console.log(Object.keys(usuario));   // ["nombre", "edad", "activo"]
console.log(Object.values(usuario)); // ["Ana", 30, true]
console.log(Object.entries(usuario));
// [["nombre", "Ana"], ["edad", 30], ["activo", true]]
```

**Recorrer un objeto con `entries`:**

```js
const precios = { teclado: 50, raton: 20, monitor: 200 };

for (const par of Object.entries(precios)) {
  console.log(par[0], par[1]);
}
// teclado 50
// raton 20
// monitor 200
```

> 📌 En 3.6 verás la versión con destructuring: `for (const [producto, precio] of Object.entries(precios))`.

**Transformar valores:**

```js
const precios = { teclado: 50, raton: 20 };

const conIva = Object.fromEntries(
  Object.entries(precios).map(function (par) {
    return [par[0], par[1] * 1.21];
  })
);

console.log(conIva); // { teclado: 60.5, raton: 24.2 }
```

**Sumar valores:**

```js
const ventas = { enero: 100, febrero: 200, marzo: 150 };

const total = Object.values(ventas).reduce(function (acc, v) {
  return acc + v;
}, 0);

console.log(total); // 450
```

**`Object.keys` vs `for...in`:**

```js
const usuario = { nombre: "Ana", edad: 30 };

for (const clave in usuario) {
  console.log(clave); // "nombre", "edad"
}

console.log(Object.keys(usuario)); // ["nombre", "edad"]
```

`for...in` también recorre propiedades **heredadas**; `Object.keys` solo las propias. Como aún no has visto prototipos (Módulo 4), la regla es: **usa `Object.keys/values/entries`** y evita `for...in` salvo en casos muy controlados.

### 3.5.5 `Object.fromEntries`: de pares a objeto

Es la operación inversa de `Object.entries`.

```js
const pares = [["nombre", "Ana"], ["edad", 30]];

const usuario = Object.fromEntries(pares);
console.log(usuario); // { nombre: "Ana", edad: 30 }
```

**Ida y vuelta:**

```js
const original = { a: 1, b: 2 };
const copia = Object.fromEntries(Object.entries(original));

console.log(copia); // { a: 1, b: 2 }
console.log(copia === original); // false ✅ es otro objeto
```

**Filtrar propiedades:**

```js
const usuario = { nombre: "Ana", password: "secreto", edad: 30 };

const publico = Object.fromEntries(
  Object.entries(usuario).filter(function (par) {
    return par[0] !== "password";
  })
);

console.log(publico); // { nombre: "Ana", edad: 30 }
```

> 📌 En 3.9 verás que `Object.fromEntries` también convierte un `Map` en objeto.

### 3.5.6 `Object.assign`: copiar y fusionar

`Object.assign(destino, ...fuentes)` copia las propiedades de las fuentes al destino y devuelve el destino.

```js
const base = { nombre: "Ana" };
const extra = { edad: 30 };

const resultado = Object.assign({}, base, extra);
console.log(resultado); // { nombre: "Ana", edad: 30 }
```

**El primer argumento se muta.** Por eso se pasa `{}` si quieres un objeto nuevo:

```js
const base = { nombre: "Ana" };

// ❌ Muta base
Object.assign(base, { edad: 30 });
console.log(base); // { nombre: "Ana", edad: 30 }

// ✅ Crea uno nuevo
const nuevo = Object.assign({}, base, { activo: true });
console.log(nuevo); // { nombre: "Ana", edad: 30, activo: true }
```

**Las fuentes posteriores sobrescriben:**

```js
const defaults = { tema: "claro", idioma: "es", notificaciones: true };
const preferencias = { tema: "oscuro" };

const config = Object.assign({}, defaults, preferencias);
console.log(config);
// { tema: "oscuro", idioma: "es", notificaciones: true }
```

**La copia es superficial** (3.5.7).

> 📌 El spread de objetos (`{ ...a, ...b }`, sección 3.7) hace lo mismo y hoy es más habitual. `Object.assign` sigue siendo útil cuando el destino ya existe.

### 3.5.7 Referencia vs copia (superficial y profunda)

Igual que los arrays, los objetos se comparan y se asignan por **referencia**.

```js
const original = { nombre: "Ana" };
const alias = original;

alias.nombre = "Luis";
console.log(original.nombre); // "Luis" ⚠️

const otro = { nombre: "Ana" };
console.log(original === otro); // false (contenido igual, referencia distinta)
```

**Copia superficial:**

```js
const original = { nombre: "Ana", edad: 30 };
const copia = Object.assign({}, original);

copia.nombre = "Luis";
console.log(original.nombre); // "Ana" ✅
```

**Pero los objetos anidados se comparten:**

```js
const original = {
  nombre: "Ana",
  direccion: { ciudad: "Madrid" },
};

const copia = Object.assign({}, original);

copia.nombre = "Luis";                    // propiedad primitiva
copia.direccion.ciudad = "Barcelona";     // objeto compartido

console.log(original.nombre);            // "Ana" ✅
console.log(original.direccion.ciudad);  // "Barcelona" ⚠️
```

**Copia profunda con `structuredClone`:**

```js
const original = {
  nombre: "Ana",
  direccion: { ciudad: "Madrid" },
  hobbies: ["leer", "correr"],
};

const profunda = structuredClone(original);

profunda.direccion.ciudad = "Lima";
profunda.hobbies.push("nadar");

console.log(original.direccion.ciudad); // "Madrid" ✅
console.log(original.hobbies);          // ["leer", "correr"] ✅
```

`structuredClone` es una **API del entorno** (Node 17+ y navegadores modernos), no parte del lenguaje. Copia arrays, objetos, `Map`, `Set` (3.9) y fechas, pero **no funciones** ni referencias a nodos del DOM (Módulo 6).

```js
// ❌ structuredClone no puede copiar funciones
const conFuncion = { saludar: function () { return "hola"; } };
// structuredClone(conFuncion); // DataCloneError
```

**Alternativa manual (solo para estructuras simples):**

```js
function copiarProfundo(valor) {
  if (Array.isArray(valor)) {
    return valor.map(copiarProfundo);
  }
  if (valor !== null && typeof valor === "object") {
    const copia = {};
    for (const clave of Object.keys(valor)) {
      copia[clave] = copiarProfundo(valor[clave]);
    }
    return copia;
  }
  return valor;
}
```

> 🧠 **Regla:** copia superficial para cambiar propiedades del primer nivel; copia profunda cuando vayas a modificar estructuras anidadas.

### 3.5.8 `Object.hasOwn` vs el operador `in`

**`"clave" in objeto`** comprueba si la propiedad existe, **incluidas las heredadas**.

```js
const usuario = { nombre: "Ana" };

console.log("nombre" in usuario);   // true
console.log("toString" in usuario); // true ⚠️ heredada del prototipo
```

**`Object.hasOwn(objeto, "clave")`** comprueba solo las propiedades **propias** (ES2022).

```js
console.log(Object.hasOwn(usuario, "nombre"));   // true
console.log(Object.hasOwn(usuario, "toString")); // false ✅
```

**Uso típico:** saber si una clave existe antes de leerla, sin confundir `undefined` con ausencia.

```js
const datos = { intentos: 0 };

console.log(datos.intentos);                 // 0
console.log("intentos" in datos);            // true
console.log(datos.otraCosa);                 // undefined
console.log("otraCosa" in datos);            // false
```

> 📌 No uses `obj.clave !== undefined` para comprobar existencia: falla si la propiedad existe con valor `undefined`.

```js
const obj = { valor: undefined };

console.log(obj.valor !== undefined);          // false ⚠️
console.log(Object.hasOwn(obj, "valor"));      // true ✅
```

### 3.5.9 `delete`: eliminar propiedades

```js
const usuario = { nombre: "Ana", edad: 30 };

delete usuario.edad;
console.log(usuario);            // { nombre: "Ana" }
console.log("edad" in usuario);  // false
```

**Detalles:**

- Devuelve `true` aunque la propiedad no existiera.
- No funciona con propiedades protegidas, como las de un objeto congelado con `Object.freeze` (3.5.10).
- En arrays deja un **hueco**; para arrays usa `splice` o `filter`.
- Eliminar propiedades cambia la "forma" interna del objeto y puede afectar al rendimiento en bucles muy calientes. En código normal no te preocupes.

```js
// ❌ En arrays
const nums = [1, 2, 3];
delete nums[1]; // [1, <1 empty item>, 3]

// ✅ En arrays
const sinElSegundo = nums.filter(function (_, i) { return i !== 1; });
console.log(sinElSegundo); // [1, 3]
```

### 3.5.10 `Object.freeze` y `Object.seal`

**`Object.freeze(objeto)`** impide añadir, eliminar y modificar propiedades.

```js
const config = Object.freeze({ modo: "produccion", debug: false });

config.modo = "desarrollo"; // falla en silencio (modo no estricto)
config.nueva = true;        // también falla
delete config.debug;        // también falla

console.log(config); // { modo: "produccion", debug: false }
console.log(Object.isFrozen(config)); // true ← comprueba si está congelado
```

En **modo estricto**, esos intentos lanzan `TypeError`:

```js
"use strict";

const config = Object.freeze({ modo: "produccion" });
// config.modo = "desarrollo"; // ❌ TypeError
```

**La congelación es superficial:**

```js
const config = Object.freeze({
  modo: "produccion",
  servidor: { puerto: 3000 },
});

config.servidor.puerto = 4000; // ✅ permitido ⚠️
console.log(config.servidor.puerto); // 4000
```

Para congelar en profundidad hay que recorrer y congelar cada nivel:

```js
function congelarProfundo(objeto) {
  Object.freeze(objeto);

  for (const clave of Object.keys(objeto)) {
    const valor = objeto[clave];
    if (valor !== null && typeof valor === "object" && !Object.isFrozen(valor)) {
      congelarProfundo(valor);
    }
  }

  return objeto;
}
```

**`Object.seal(objeto)`** es más suave: impide añadir y eliminar, pero **permite modificar** valores existentes.

```js
const usuario = Object.seal({ nombre: "Ana" });

usuario.nombre = "Luis"; // ✅ permitido
usuario.edad = 30;       // ❌ no se añade
delete usuario.nombre;   // ❌ no se elimina

console.log(usuario); // { nombre: "Luis" }
```

### 3.5.11 Orden de las propiedades

El orden de `Object.keys` no es exactamente el de inserción. JavaScript sigue esta regla:

1. **Claves enteras** (como `"1"`, `"2"`, `"10"`) en orden **numérico ascendente**.
2. **Claves string** en orden de **inserción**.
3. **Símbolos** en orden de inserción (no aparecen en `Object.keys`).

```js
const objeto = {
  b: "b",
  2: "dos",
  a: "a",
  1: "uno",
};

console.log(Object.keys(objeto)); // ["1", "2", "b", "a"]
```

**Consecuencia:** no dependas del orden si mezclas claves numéricas y strings. Si el orden importa, usa un array o un `Map` (3.9).

### 3.5.12 Propiedades con `Symbol`

Un `Symbol` es un valor único e irrepetible (Módulo 1). Como clave, sirve para propiedades "privadas" o metadatos.

```js
const id = Symbol("id");

const usuario = {
  nombre: "Ana",
  [id]: 123,
};

console.log(usuario[id]);              // 123
console.log(usuario.id);               // undefined ⚠️
console.log(Object.keys(usuario));     // ["nombre"] ← el símbolo no aparece
console.log(Object.getOwnPropertySymbols(usuario)); // [Symbol(id)]
```

**Uso real:** claves internas de librerías y protocolos del lenguaje (`Symbol.iterator`, que hace posible `for...of` y el spread).

> 📌 No son privados de verdad: quien tenga el símbolo puede leer la propiedad. La privacidad real llega con closures (Módulo 2) y `WeakMap` (3.9).

### 3.5.13 Arrays de objetos: la estructura reina

En el mundo real, casi todos los datos son **arrays de objetos**.

```js
const empleados = [
  { id: 1, nombre: "Ana", departamento: "Ingeniería", salario: 3200 },
  { id: 2, nombre: "Luis", departamento: "Ventas", salario: 2500 },
  { id: 3, nombre: "Eva", departamento: "Ingeniería", salario: 3800 },
];
```

**Acceso:**

```js
console.log(empleados[0].nombre); // "Ana"
console.log(empleados.length);    // 3
```

**Recorrido:**

```js
for (const empleado of empleados) {
  console.log(`${empleado.nombre} — ${empleado.departamento}`);
}
```

**Transformación (3.4):**

```js
const nombres = empleados.map((e) => e.nombre);
const ingenieros = empleados.filter((e) => e.departamento === "Ingeniería");
const nomina = empleados.reduce((acc, e) => acc + e.salario, 0);

console.log(nombres);    // ["Ana", "Luis", "Eva"]
console.log(nomina);     // 9500
console.log(ingenieros.length); // 2
```

**Actualizar un elemento:** con mutación directa (válido si el array es tuyo) o de forma inmutable (3.7).

```js
// Mutación directa
empleados[1].salario = 2700;

// Búsqueda + actualización
const empleado = empleados.find((e) => e.id === 2);
if (empleado) {
  empleado.salario = 2800;
}
```

> 📌 En 3.10 verás patrones completos: indexar por `id`, agrupar, ordenar y actualizar sin mutar.

### ✅ Haz esto / ❌ Evita esto (3.5)

```js
// ✅ Shorthand cuando el nombre coincide
const usuario = { nombre, edad };

// ✅ Corchetes para claves dinámicas
const clave = "email";
const datos = { [clave]: "ana@example.com" };

// ✅ Object.entries para recorrer
for (const par of Object.entries(precios)) {
  console.log(par[0], par[1]);
}

// ✅ Object.hasOwn para existencia real
if (Object.hasOwn(usuario, "email")) { /* ... */ }

// ✅ structuredClone para copia profunda
const copia = structuredClone(original);

// ❌ Confundir alias con copia
const alias = original;

// ❌ Copiar con Object.assign y creer que es profundo
const copia = Object.assign({}, original); // anidados compartidos

// ❌ for...in sin control (incluye heredadas)
for (const clave in usuario) { /* ... */ }

// ❌ delete en arrays
delete nums[1];

// ❌ Comparar objetos con === esperando comparar contenido
{ a: 1 } === { a: 1 }; // false
```

---

## 3.6 — Destructuring

**Destructuring** (desestructuración) es una sintaxis que permite **extraer valores** de arrays y objetos en variables, de forma compacta.

### 3.6.1 Destructuring de arrays

```js
const coordenadas = [10, 20];

const [x, y] = coordenadas;
console.log(x); // 10
console.log(y); // 20
```

**Saltarse elementos:** deja un hueco con una coma.

```js
const [primero, , tercero] = ["a", "b", "c"];
console.log(primero); // "a"
console.log(tercero); // "c"
```

**Resto con `...` (vista previa de 3.7.5):** el `...` recoge los elementos que sobran en un array nuevo. En el Módulo 2 ya viste `...` en parámetros; aquí aparece en destructuring y lo estudiarás a fondo en 3.7.

```js
const [cabeza, ...cola] = [1, 2, 3, 4];
console.log(cabeza); // 1
console.log(cola);   // [2, 3, 4] ✅ array real
```

**Valores por defecto:**

```js
const [a = 1, b = 2] = [10];
console.log(a); // 10
console.log(b); // 2

const [c = 1] = [undefined];
console.log(c); // 1 ✅ el default aplica con undefined

const [d = 1] = [null];
console.log(d); // null ⚠️ el default NO aplica con null
```

**Intercambiar variables sin variable temporal:**

```js
let a = 1;
let b = 2;

[a, b] = [b, a];

console.log(a); // 2
console.log(b); // 1
```

**Funciona con cualquier iterable** (por ahora, strings; `Map` y `Set` llegan en 3.9):

```js
const [primeraLetra, segundaLetra] = "hola";
console.log(primeraLetra); // "h"
console.log(segundaLetra); // "o"
```

> 📌 `Map` y `Set` se explican en 3.9, pero ya puedes usar destructuring con ellos porque son iterables.

### 3.6.2 Destructuring de objetos

```js
const usuario = { nombre: "Ana", edad: 30 };

const { nombre, edad } = usuario;
console.log(nombre); // "Ana"
console.log(edad);   // 30
```

**El nombre de la variable debe coincidir con la clave**, salvo que renombres.

### 3.6.3 Renombrar

```js
const usuario = { nombre: "Ana", edad: 30 };

const { nombre: nombreCompleto, edad: años } = usuario;

console.log(nombreCompleto); // "Ana"
console.log(años);           // 30
```

Se lee: "toma la propiedad `nombre` y guárdala en `nombreCompleto`".

**Error clásico:** confundir el orden.

```js
// ❌ Sintaxis inválida
// const { nombreCompleto: nombre } = usuario;

// ✅ clave: nuevaVariable
const { nombre: nombreCompleto } = usuario;
```

### 3.6.4 Defaults en objetos

```js
const usuario = { nombre: "Ana" };

const { nombre, rol = "user" } = usuario;

console.log(nombre); // "Ana"
console.log(rol);    // "user"
```

**Renombrar + default:**

```js
const { nombre: nombreCompleto = "Anónimo" } = {};
console.log(nombreCompleto); // "Anónimo"
```

### 3.6.5 Destructuring anidado

```js
const pedido = {
  id: 1,
  cliente: {
    nombre: "Ana",
    direccion: { ciudad: "Madrid", cp: "28001" },
  },
};

const {
  cliente: {
    nombre,
    direccion: { ciudad },
  },
} = pedido;

console.log(nombre);  // "Ana"
console.log(ciudad);  // "Madrid"
```

**Con arrays dentro de objetos:**

```js
const respuesta = {
  usuario: { nombre: "Ana" },
  roles: ["admin", "editor"],
};

const {
  usuario: { nombre },
  roles: [rolPrincipal],
} = respuesta;

console.log(nombre);       // "Ana"
console.log(rolPrincipal); // "admin"
```

> ⚠️ El destructuring anidado **exige que los niveles existan**. Si `cliente` es `undefined`, lanza `TypeError`. Si el dato puede faltar, usa `?.` (3.8) o valores por defecto en cada nivel.

### 3.6.6 Destructuring en parámetros de función

Es una de las aplicaciones más útiles: funciones con muchas opciones.

```js
function crearUsuario({ nombre, edad, rol = "user" }) {
  return `${nombre} (${edad}) — ${rol}`;
}

console.log(crearUsuario({ nombre: "Ana", edad: 30 }));
// "Ana (30) — user"

console.log(crearUsuario({ nombre: "Luis", edad: 25, rol: "admin" }));
// "Luis (25) — admin"
```

**Problema:** si llamas sin argumento, falla.

```js
// crearUsuario(); // ❌ TypeError: Cannot destructure property 'nombre' of 'undefined'
```

**Solución:** default `= {}` en el parámetro.

```js
function crearUsuario({ nombre = "Anónimo", rol = "user" } = {}) {
  return `${nombre} — ${rol}`;
}

console.log(crearUsuario()); // "Anónimo — user" ✅
```

**Con arrays:**

```js
function suma([a, b]) {
  return a + b;
}

console.log(suma([2, 3])); // 5
```

### 3.6.7 Destructuring en bucles

**Arrays con índice y valor:**

```js
const letras = ["a", "b", "c"];

for (const [indice, letra] of letras.entries()) {
  console.log(indice, letra);
}
// 0 "a"
// 1 "b"
// 2 "c"
```

**Objetos:**

```js
const precios = { teclado: 50, raton: 20 };

for (const [producto, precio] of Object.entries(precios)) {
  console.log(`${producto}: ${precio} €`);
}
// "teclado: 50 €"
// "raton: 20 €"
```

**Arrays de objetos:**

```js
const usuarios = [
  { nombre: "Ana", edad: 30 },
  { nombre: "Luis", edad: 25 },
];

for (const { nombre, edad } of usuarios) {
  console.log(nombre, edad);
}
```

### 3.6.8 Destructuring de valores devueltos

Una función solo puede devolver un valor, pero ese valor puede ser un objeto o un array. El destructuring lo desempaqueta al instante.

```js
function calcularTotales(subtotal, iva) {
  return {
    subtotal: subtotal,
    impuestos: subtotal * iva,
    total: subtotal * (1 + iva),
  };
}

const { total, impuestos } = calcularTotales(100, 0.21);

console.log(impuestos); // 21
console.log(total);     // 121
```

**Con arrays:**

```js
function minMax(numeros) {
  let min = numeros[0];
  let max = numeros[0];

  for (const n of numeros) {
    if (n < min) min = n;
    if (n > max) max = n;
  }

  return [min, max];
}

const [minimo, maximo] = minMax([3, 9, 1, 7]);

console.log(minimo); // 1
console.log(maximo); // 9
```

### 3.6.9 Asignar a variables ya declaradas

Si las variables ya existen, necesitas paréntesis alrededor del destructuring de objeto.

```js
let nombre;
let edad;

const usuario = { nombre: "Ana", edad: 30 };

// ❌ SyntaxError: las llaves se interpretan como bloque
// { nombre, edad } = usuario;

// ✅ Paréntesis
({ nombre, edad } = usuario);

console.log(nombre); // "Ana"
```

Con arrays no hace falta:

```js
let a;
let b;

[a, b] = [1, 2];
```

### 3.6.10 Errores comunes

**1. Destructuring de `null` o `undefined`:**

```js
// const { nombre } = null;
// ❌ TypeError: Cannot destructure property 'nombre' of 'null'
```

**2. Confundir default con valor real:**

```js
const { activo = true } = { activo: false };
console.log(activo); // false ✅ el default solo aplica con undefined
```

**3. Olvidar el default del parámetro completo:**

```js
// ❌ Falla si no pasas nada
function f({ a }) { return a; }

// ✅
function f2({ a } = {}) { return a; }
```

**4. Anidar demasiado:**

```js
// ❌ Difícil de leer
const { a: { b: { c: { d } } } } = datos;

// ✅ Paso a paso
const { a } = datos;
const { b } = a;
const { c } = b;
const { d } = c;
```

### ✅ Haz esto / ❌ Evita esto (3.6)

```js
// ✅ Extrae solo lo que necesitas
const { nombre, edad } = usuario;

// ✅ Renombra si hay colisión
const { nombre: nombreUsuario } = usuario;

// ✅ Defaults para datos opcionales
const { rol = "user" } = usuario;

// ✅ Default del objeto completo en parámetros
function crear({ nombre, rol = "user" } = {}) { /* ... */ }

// ✅ Destructuring en bucles
for (const [clave, valor] of Object.entries(datos)) { /* ... */ }

// ❌ Destructurar datos que pueden ser null sin comprobar
const { nombre } = usuarioPosiblementeNull;

// ❌ Anidar cuatro niveles
const { a: { b: { c } } } = datos;

// ❌ Olvidar los paréntesis al reasignar
{ nombre } = usuario; // SyntaxError

// ❌ Confundir default con validación
const { edad = 18 } = { edad: null }; // edad es null
```

---

## 3.7 — Spread y rest

El símbolo `...` tiene dos usos opuestos:

- **Spread (expansión):** saca los elementos de un iterable o las propiedades de un objeto.
- **Rest (agrupación):** recoge el resto en un array o un objeto.

Ya viste **rest en parámetros** en el Módulo 2 (`function f(...args)`). Aquí verás el resto de usos.

### 3.7.1 Spread en arrays

**Copiar:**

```js
const original = [1, 2, 3];
const copia = [...original];

copia[0] = 99;
console.log(original[0]); // 1 ✅
console.log(copia[0]);    // 99
```

**Concatenar:**

```js
const a = [1, 2];
const b = [3, 4];

console.log([...a, ...b]); // [1, 2, 3, 4]
```

**Añadir elementos en cualquier posición:**

```js
const nums = [2, 3];

console.log([1, ...nums, 4]); // [1, 2, 3, 4]
```

**Convertir un iterable en array:**

```js
console.log([..."hola"]); // ["h", "o", "l", "a"]
```

> 📌 También funciona con `Map`, `Set` y cualquier iterable (3.9).

**Error clásico:** spread de algo que no es iterable.

```js
// [...{}] // ❌ TypeError: {} is not iterable
// [...5]   // ❌ TypeError: 5 is not iterable
```

### 3.7.2 Spread en llamadas a funciones

Expande un array en argumentos individuales.

```js
const numeros = [3, 1, 5, 2];

console.log(Math.max(...numeros)); // 5
console.log(Math.min(...numeros)); // 1
```

Sin spread tendrías que usar `apply` (Módulo 4) o escribir los números a mano.

**Pasar un array a una función con parámetros normales:**

```js
function sumar(a, b, c) {
  return a + b + c;
}

const valores = [1, 2, 3];
console.log(sumar(...valores)); // 6
```

**Combinar con argumentos normales:**

```js
console.log(sumar(0, ...[2, 3])); // 5
```

**Cuidado con arrays muy grandes:** hay un límite de argumentos en el motor. Para miles de elementos, usa `reduce`.

### 3.7.3 Spread en objetos

Copia las propiedades **propias y enumerables**.

```js
const usuario = { nombre: "Ana", edad: 30 };
const copia = { ...usuario };

console.log(copia);            // { nombre: "Ana", edad: 30 }
console.log(copia === usuario); // false ✅
```

**Fusionar:**

```js
const base = { tema: "claro", idioma: "es" };
const preferencias = { tema: "oscuro" };

const config = { ...base, ...preferencias };

console.log(config); // { tema: "oscuro", idioma: "es" }
```

**El orden importa:** lo que va después sobrescribe.

```js
console.log({ ...preferencias, ...base }); // { tema: "claro", idioma: "es" }
```

**Añadir o sobrescribir propiedades:**

```js
const usuario = { nombre: "Ana", edad: 30 };

const actualizado = { ...usuario, edad: 31 };
console.log(actualizado); // { nombre: "Ana", edad: 31 }
console.log(usuario);     // { nombre: "Ana", edad: 30 } ✅
```

**Spread de `null` o `undefined` no falla:**

```js
console.log({ ...null, ...undefined }); // {}
```

**Pero spread de un array en un objeto copia los índices:**

```js
console.log({ ...["a", "b"] }); // { 0: "a", 1: "b" }
```

Casi nunca es lo que quieres.

### 3.7.4 Actualización inmutable

Combinar spread con destructuring permite actualizar y eliminar propiedades sin mutar.

**Actualizar:**

```js
const usuario = { id: 1, nombre: "Ana", edad: 30 };

const actualizado = { ...usuario, edad: 31 };

console.log(usuario);     // { id: 1, nombre: "Ana", edad: 30 }
console.log(actualizado); // { id: 1, nombre: "Ana", edad: 31 }
```

**Eliminar:**

```js
const usuario = { id: 1, nombre: "Ana", password: "secreto" };

const { password, ...publico } = usuario;

console.log(publico);           // { id: 1, nombre: "Ana" } ✅ sin password
console.log(usuario.password);  // "secreto" ← el original no cambió
```

**Actualizar un elemento de un array de objetos:**

```js
const usuarios = [
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" },
];

const actualizados = usuarios.map(function (u) {
  if (u.id === 2) {
    return { ...u, nombre: "Luis Pérez" };
  }
  return u;
});

console.log(actualizados[1].nombre); // "Luis Pérez"
console.log(usuarios[1].nombre);     // "Luis" ✅ intacto
```

**Añadir a un array sin mutar:**

```js
const nuevos = [...usuarios, { id: 3, nombre: "Eva" }];
```

**Eliminar de un array sin mutar:**

```js
const sinLuis = usuarios.filter((u) => u.id !== 2);
```

### 3.7.5 Rest en destructuring

**Arrays:**

```js
const [primero, ...resto] = [1, 2, 3, 4];

console.log(primero); // 1
console.log(resto);   // [2, 3, 4]
```

**Objetos:**

```js
const usuario = { id: 1, nombre: "Ana", password: "secreto" };

const { password, ...datosPublicos } = usuario;

console.log(datosPublicos); // { id: 1, nombre: "Ana" }
```

**Reglas:**

- El rest debe ir **al final**.
- En arrays produce un array; en objetos, un objeto.
- En objetos solo copia propiedades propias y enumerables.

```js
// ❌ SyntaxError: rest no puede ir en medio
// const [...resto, ultimo] = [1, 2, 3];

// ✅
const [...todos] = [1, 2, 3]; // todos = [1, 2, 3]
```

### 3.7.6 Rest vs spread: el mismo símbolo, distinto papel

| Contexto | Nombre | Qué hace | Ejemplo |
|---|---|---|---|
| Llamada a función | Spread | Expande un array en argumentos | `f(...arr)` |
| Array literal | Spread | Expande elementos | `[...a, ...b]` |
| Objeto literal | Spread | Copia propiedades | `{ ...obj }` |
| Parámetros | Rest | Recoge argumentos en array | `function f(...args)` |
| Destructuring de array | Rest | Recoge el resto en array | `const [a, ...resto] = arr` |
| Destructuring de objeto | Rest | Recoge el resto en objeto | `const { a, ...resto } = obj` |

**Regla para distinguirlos:** si `...` está **a la derecha** de una asignación o dentro de una llamada, **expande**. Si está **a la izquierda** (parámetros o destructuring), **recoge**.

### 3.7.7 Advertencia: spread es superficial

```js
const original = {
  nombre: "Ana",
  direccion: { ciudad: "Madrid" },
};

const copia = { ...original };
copia.direccion.ciudad = "Barcelona";

console.log(original.direccion.ciudad); // "Barcelona" ⚠️
```

Para copia profunda, `structuredClone` (3.5.7).

**Tampoco copia propiedades heredadas ni no enumerables.** El spread solo ve las propiedades **propias y enumerables**. Las heredadas vienen del prototipo (Módulo 4) y las no enumerables se crean con APIs avanzadas; ninguna de las dos aparece con `...`. En la práctica, con objetos literales creados por ti, todas las propiedades son propias y enumerables, así que el spread las copia todas.

### 3.7.8 Spread en strings y arrays de caracteres

```js
const palabra = "hola";

console.log([...palabra]);        // ["h", "o", "l", "a"]
console.log(palabra.split(""));   // ["h", "o", "l", "a"] (alternativa)
```

**Diferencia con emojis:** internamente, JavaScript guarda el texto en unidades de 16 bits (UTF-16). Un emoji como `😀` ocupa **dos** de esas unidades. `split("")` corta por unidad y parte el emoji por la mitad; el spread recorre el texto por **caracteres completos** (code points) y lo mantiene entero.

```js
console.log("😀".split("")); // ["�", "�"] ⚠️
console.log([..."😀"]);      // ["😀"] ✅
```

### ✅ Haz esto / ❌ Evita esto (3.7)

```js
// ✅ Copia de array
const copia = [...original];

// ✅ Fusionar objetos con override
const config = { ...defaults, ...preferencias };

// ✅ Actualización inmutable
const actualizado = { ...usuario, edad: 31 };

// ✅ Eliminar propiedad con rest
const { password, ...publico } = usuario;

// ✅ Spread en llamadas
Math.max(...numeros);

// ❌ Spread para copia profunda
const copia = { ...original }; // anidados compartidos

// ❌ Spread de no iterables
// [...{}]

// ❌ Rest en medio
// const [...resto, ultimo] = arr;

// ❌ Confundir spread con rest
function f(...args) { /* args es un array */ }
```

---

## 3.8 — Optional chaining y nullish coalescing

Dos operadores de ES2020 que eliminan montañas de comprobaciones.

### 3.8.1 El problema

```js
const pedido = {
  cliente: { nombre: "Ana" },
};

console.log(pedido.cliente.nombre); // "Ana"

// console.log(pedido.direccion.ciudad);
// ❌ TypeError: Cannot read properties of undefined (reading 'ciudad')
```

Antes de ES2020 se escribía así:

```js
const ciudad =
  pedido.direccion && pedido.direccion.ciudad
    ? pedido.direccion.ciudad
    : "Sin ciudad";
```

Funciona, pero es ruidoso y fácil de equivocar.

### 3.8.2 `?.` para propiedades

`objeto?.propiedad` devuelve `undefined` si `objeto` es `null` o `undefined`, en lugar de lanzar un error.

```js
const pedido = { cliente: { nombre: "Ana" } };

console.log(pedido.cliente?.nombre);  // "Ana"
console.log(pedido.direccion?.ciudad); // undefined ✅
```

**Encadenar:**

```js
console.log(pedido?.cliente?.direccion?.ciudad); // undefined ✅
```

**Cuidado con dónde pones el `?.`:**

```js
const pedido = null;

console.log(pedido?.cliente.nombre); // undefined ✅ (todo el acceso se corta)
// console.log(pedido.cliente?.nombre);
// ❌ TypeError: pedido es null
```

> 🧠 **Regla:** el `?.` protege el acceso **inmediatamente anterior**. Si el que puede faltar es `pedido`, ponlo ahí.

### 3.8.3 `?.[]` para claves dinámicas

```js
const datos = { usuario: { nombre: "Ana" } };
const clave = "usuario";

console.log(datos?.[clave]?.nombre); // "Ana"
console.log(datos?.["otra"]);        // undefined
```

**Con arrays:**

```js
const lista = [10, 20, 30];

console.log(lista?.[0]);  // 10
console.log(lista?.[99]); // undefined
console.log(lista?.[-1]); // undefined
```

### 3.8.4 `?.()` para llamadas

Solo llama si el valor no es `null` ni `undefined`.

```js
const obj = {
  saludar: function () {
    return "Hola";
  },
};

console.log(obj.saludar?.());     // "Hola"
console.log(obj.despedir?.());    // undefined ✅

const sinMetodo = null;
console.log(sinMetodo?.());       // undefined ✅
```

> ⚠️ `?.()` **no comprueba que sea una función**. Si existe pero no es invocable, lanza `TypeError`.

```js
const obj = { saludar: "no soy función" };
// obj.saludar?.(); // ❌ TypeError: obj.saludar is not a function
```

### 3.8.5 Cortocircuito

Si la parte izquierda es `null` o `undefined`, **no se evalúa nada a la derecha**.

```js
const usuario = null;

function costosa() {
  console.log("¡Se ejecutó!");
  return "resultado";
}

console.log(usuario?.metodo(costosa()));
// undefined, y NO imprime "¡Se ejecutó!"
```

Esto también significa que `?.` **no** sirve para asignar:

```js
// usuario?.nombre = "Ana"; // ❌ SyntaxError
```

Para asignar con protección, usa un `if` o `??=` (3.8.8).

### 3.8.6 Cuándo NO usar `?.`

**No lo uses si el dato es obligatorio.** Si falta, quieres enterarte.

```js
// ❌ Oculta un bug: la API debía devolver cliente
const nombre = respuesta?.cliente?.nombre;

// ✅ Falla rápido si el contrato se rompe
const nombre = respuesta.cliente.nombre;
```

**No lo uses para "arreglar" un diseño confuso.** Si tienes `a?.b?.c?.d?.e`, probablemente el modelo de datos necesita simplificarse.

### 3.8.7 `??`: valor por defecto para `null` y `undefined`

`izquierda ?? derecha` devuelve la derecha **solo si la izquierda es `null` o `undefined`**.

```js
console.log(null ?? "por defecto");      // "por defecto"
console.log(undefined ?? "por defecto"); // "por defecto"

console.log(0 ?? 5);        // 0 ✅
console.log("" ?? "texto"); // "" ✅
console.log(false ?? true); // false ✅
console.log(NaN ?? 5);      // NaN ✅
```

**Caso de uso real:** configuración donde `0` o `""` son valores válidos.

```js
function crearPerfil(nombre, edad) {
  return {
    nombre: nombre ?? "Anónimo",
    edad: edad ?? 18,
  };
}

console.log(crearPerfil(undefined, 0)); // { nombre: "Anónimo", edad: 0 }
```

### 3.8.8 `??` vs `||`

`||` devuelve la derecha si la izquierda es **falsy** (`0`, `""`, `false`, `NaN`, `null`, `undefined`).

```js
const cantidad = 0;

console.log(cantidad || 10); // 10 ⚠️
console.log(cantidad ?? 10); // 0 ✅
```

**Error clásico:**

```js
// ❌ Si el usuario elige 0, se convierte en 10
const limite = opciones.limite || 10;

// ✅ Solo usa 10 si no hay valor
const limite = opciones.limite ?? 10;
```

**Tabla comparativa:**

| Valor | `v \|\| "x"` | `v ?? "x"` |
|---|---|---|
| `undefined` | `"x"` | `"x"` |
| `null` | `"x"` | `"x"` |
| `0` | `"x"` | `0` |
| `""` | `"x"` | `""` |
| `false` | `"x"` | `false` |
| `NaN` | `"x"` | `NaN` |
| `"hola"` | `"hola"` | `"hola"` |

### 3.8.9 Asignación lógica (ES2021)

Combinan asignación y operador lógico.

```js
let a = null;
a ??= "valor";
console.log(a); // "valor" ✅ solo asigna si era null/undefined

let b = 0;
b ??= 10;
console.log(b); // 0 ✅

let c = "";
c ||= "texto";
console.log(c); // "texto" (||= también reemplaza falsy)

let d = true;
d &&= false;
console.log(d); // false (&&= asigna solo si era truthy)
```

**Uso típico:** inicializar opciones.

```js
const opciones = {};

opciones.tema ??= "claro";
opciones.limite ??= 10;

console.log(opciones); // { tema: "claro", limite: 10 }
```

### 3.8.10 Paréntesis obligatorios al mezclar

`??` no se puede mezclar con `&&` o `||` sin paréntesis: es un `SyntaxError`.

```js
// ❌ SyntaxError
// const valor = a ?? b || c;

// ✅
const valor = a ?? (b || c);
```

**Motivo:** el lenguaje obliga a ser explícito porque la precedencia sería ambigua para quien lee.

### ✅ Haz esto / ❌ Evita esto (3.8)

```js
// ✅ Optional chaining para datos opcionales
const ciudad = pedido.cliente?.direccion?.ciudad;

// ✅ ?.[] con claves dinámicas
const valor = datos?.[clave];

// ✅ ?.() para callbacks opcionales
callback?.();

// ✅ ?? para defaults que respetan 0 y ""
const limite = opciones.limite ?? 10;

// ✅ ??= para inicializar
config.tema ??= "claro";

// ❌ ?. en datos obligatorios
const nombre = respuesta?.cliente?.nombre; // oculta el error

// ❌ ?? mezclado con || sin paréntesis
// const x = a ?? b || c; // SyntaxError

// ❌ || para defaults numéricos
const limite = opciones.limite || 10; // 0 se pierde

// ❌ ?. para asignar
// usuario?.nombre = "Ana"; // SyntaxError
```

---

## 3.9 — Map, Set, WeakMap y WeakSet

Arrays y objetos resuelven el 90 % de los casos. Estas cuatro estructuras resuelven el otro 10 %, y cada una tiene una razón de existir muy concreta.

### 3.9.1 La palabra `new` (lo mínimo)

Para crear un `Map` necesitas la palabra `new`:

```js
const mapa = new Map();
const conjunto = new Set();
```

`new` llama a un **constructor**: una función que crea un objeto nuevo y lo inicializa. `Map` y `Set` son constructores **incorporados** del lenguaje.

```js
// ❌ Sin new, estos constructores lanzan TypeError
// Map(); // TypeError: Constructor Map requires 'new'
```

> 📌 Aquí solo usamos `new` con `Map`, `Set`, `WeakMap` y `WeakSet`. Los constructores propios, las clases y los prototipos se estudian en el **Módulo 4**. No los necesitas para nada de este módulo.

### 3.9.2 `Map` vs objeto

Un `Map` es una colección de pares clave-valor, como un objeto, pero con reglas distintas.

| Característica | Objeto | `Map` |
|---|---|---|
| Tipo de claves | Solo string y `Symbol` | **Cualquier valor** (objetos, números, `NaN`) |
| Orden | Reglas especiales (3.5.11) | **Orden de inserción** siempre |
| Tamaño | `Object.keys(obj).length` | `mapa.size` |
| Iteración | `Object.entries` | Directa (`for...of`) |
| Colisiones con el prototipo | Sí (`toString`, `constructor`...) | No |
| Añadir/eliminar muchas veces | Costoso | Diseñado para eso |
| Guardar como JSON (Módulo 7) | Directo | Requiere conversión |

**Cuándo usar `Map`:**

- Claves que no son strings (objetos, números, `NaN`).
- Muchas inserciones y eliminaciones.
- Necesitas el tamaño con frecuencia.
- Necesitas orden de inserción garantizado.
- Índices y cachés.

**Cuándo usar objeto:**

- Registros con claves fijas y conocidas.
- Configuración.
- Datos que van a viajar como JSON (Módulo 7).

### 3.9.3 API de `Map`

```js
const edades = new Map();

// set(clave, valor) → añade o sobrescribe
edades.set("Ana", 30);
edades.set("Luis", 25);
edades.set("Eva", 40);

// get(clave) → valor o undefined
console.log(edades.get("Ana"));   // 30
console.log(edades.get("Pedro")); // undefined

// has(clave) → booleano
console.log(edades.has("Luis"));  // true
console.log(edades.has("Pedro")); // false

// size → número de pares
console.log(edades.size); // 3

// delete(clave) → true si existía
console.log(edades.delete("Luis")); // true
console.log(edades.size);           // 2

// clear() → vacía el mapa
edades.clear();
console.log(edades.size); // 0
```

**`set` devuelve el propio mapa**, así que se puede encadenar:

```js
const config = new Map()
  .set("tema", "oscuro")
  .set("idioma", "es")
  .set("limite", 10);

console.log(config.get("tema")); // "oscuro"
```

**Crear desde pares:**

```js
const pares = [["a", 1], ["b", 2]];
const mapa = new Map(pares);

console.log(mapa.get("a")); // 1
console.log(mapa.size);     // 2
```

**Claves que son objetos:**

```js
const ana = { nombre: "Ana" };
const luis = { nombre: "Luis" };

const salarios = new Map();
salarios.set(ana, 3000);
salarios.set(luis, 2500);

console.log(salarios.get(ana)); // 3000 ✅

// ⚠️ Un objeto distinto con el mismo contenido NO es la misma clave
console.log(salarios.get({ nombre: "Ana" })); // undefined
```

Las claves se comparan por **referencia** (o por `SameValueZero` para primitivos), no por contenido.

**Claves especiales:**

```js
const mapa = new Map();

mapa.set(NaN, "no es un número");
console.log(mapa.get(NaN)); // "no es un número" ✅

mapa.set(0, "cero");
console.log(mapa.get(-0)); // "cero" ✅ 0 y -0 son la misma clave

mapa.set(undefined, "sin valor");
console.log(mapa.get(undefined)); // "sin valor"
```

### 3.9.4 Iterar un `Map`

Un `Map` es **iterable** y respeta el orden de inserción.

```js
const precios = new Map([
  ["teclado", 50],
  ["raton", 20],
  ["monitor", 200],
]);

for (const [producto, precio] of precios) {
  console.log(`${producto}: ${precio} €`);
}
// teclado: 50 €
// raton: 20 €
// monitor: 200 €
```

**`keys`, `values` y `entries`:**

```js
console.log(Array.from(precios.keys()));   // ["teclado", "raton", "monitor"]
console.log(Array.from(precios.values())); // [50, 20, 200]
console.log(Array.from(precios.entries()));
// [["teclado", 50], ["raton", 20], ["monitor", 200]]
```

**`forEach`:** ojo al orden de los argumentos. En un `Map` es **valor, clave** (al revés que en un array, donde el primero es el valor y el segundo el índice).

```js
precios.forEach(function (valor, clave) {
  console.log(clave, valor);
});
// teclado 50
// raton 20
// monitor 200
```

**Spread:**

```js
console.log([...precios]);
// [["teclado", 50], ["raton", 20], ["monitor", 200]]

console.log([...precios.keys()]); // ["teclado", "raton", "monitor"]
```

### 3.9.5 Conversiones entre `Map`, objeto y array

**Objeto → `Map`:**

```js
const precios = { teclado: 50, raton: 20 };

const mapa = new Map(Object.entries(precios));

console.log(mapa.get("teclado")); // 50
```

**`Map` → objeto:**

```js
const mapa = new Map([
  ["a", 1],
  ["b", 2],
]);

const objeto = Object.fromEntries(mapa);

console.log(objeto); // { a: 1, b: 2 }
```

**`Map` → array de pares:**

```js
const pares = [...mapa];
console.log(pares); // [["a", 1], ["b", 2]]
```

**Array de pares → `Map`:**

```js
const mapa2 = new Map(pares);
console.log(mapa2.get("b")); // 2
```

> ⚠️ Si conviertes un `Map` a objeto, las claves que no sean string o `Symbol` se convierten a string. Un `Map` con claves objeto no se puede representar fielmente como objeto.

### 3.9.6 `Set`: valores únicos

Un `Set` es una colección de valores **sin duplicados**. No tiene índices ni claves: solo valores.

```js
const numeros = new Set([1, 2, 2, 3, 3, 3]);

console.log(numeros.size); // 3
console.log(numeros.has(2)); // true
console.log(numeros.has(99)); // false
```

**API:**

```js
const letras = new Set();

letras.add("a");
letras.add("b");
letras.add("a"); // ignorado: ya existe

console.log(letras.size); // 2
console.log(letras.has("a")); // true

letras.delete("a");
console.log(letras.size); // 1

letras.clear();
console.log(letras.size); // 0
```

`add` devuelve el propio `Set`, así que se puede encadenar:

```js
const set = new Set().add(1).add(2).add(3);
console.log(set.size); // 3
```

**Eliminar duplicados de un array:**

```js
const repetidos = [1, 2, 2, 3, 1, 4];

const unicos = [...new Set(repetidos)];
console.log(unicos); // [1, 2, 3, 4]

// Alternativa
const unicos2 = Array.from(new Set(repetidos));
```

**`Set` usa `SameValueZero`:**

```js
const set = new Set([NaN, NaN, 0, -0]);

console.log(set.size); // 2 ✅ NaN una vez, 0 y -0 juntos
console.log(set.has(NaN)); // true
```

**Los objetos se comparan por referencia:**

```js
const set = new Set();

set.add({ id: 1 });
set.add({ id: 1 });

console.log(set.size); // 2 ⚠️ son dos objetos distintos

const ana = { id: 1 };
set.add(ana);
set.add(ana); // el mismo objeto
console.log(set.size); // 3
```

**Iterar:**

```js
const frutas = new Set(["manzana", "pera", "kiwi"]);

for (const fruta of frutas) {
  console.log(fruta);
}
// manzana
// pera
// kiwi
```

**No hay acceso por índice:**

```js
const set = new Set(["a", "b"]);

// set[0] → undefined ⚠️
console.log([...set][0]); // "a" ✅ conviértelo a array
```

**Rendimiento:** `set.has(valor)` es mucho más rápido que `array.includes(valor)` en listas grandes. Si compruebas pertenencia muchas veces, convierte el array a `Set`.

### 3.9.7 Operaciones de conjuntos

Con `Set` puedes implementar las operaciones matemáticas básicas.

```js
const a = new Set([1, 2, 3, 4]);
const b = new Set([3, 4, 5, 6]);

// Unión: todos los elementos
const union = new Set([...a, ...b]);
console.log([...union]); // [1, 2, 3, 4, 5, 6]

// Intersección: los que están en ambos
const interseccion = new Set(
  [...a].filter((x) => b.has(x))
);
console.log([...interseccion]); // [3, 4]

// Diferencia: los de a que no están en b
const diferencia = new Set(
  [...a].filter((x) => !b.has(x))
);
console.log([...diferencia]); // [1, 2]

// Diferencia simétrica: los que están en uno pero no en ambos
const simetrica = new Set([
  ...[...a].filter((x) => !b.has(x)),
  ...[...b].filter((x) => !a.has(x)),
]);
console.log([...simetrica]); // [1, 2, 5, 6]
```

> 📌 Los motores más recientes (ES2025) añaden `union`, `intersection`, `difference` y `symmetricDifference` como métodos nativos. Si tu entorno no los tiene, las versiones manuales de arriba funcionan en cualquier parte.

### 3.9.8 `WeakMap`: referencias débiles

Un `WeakMap` es como un `Map`, con tres diferencias clave:

1. Las claves deben ser **objetos** (no strings ni números).
2. **No es iterable**: no puedes listar sus claves.
3. **No tiene `size` ni `clear`**.

```js
const datos = new WeakMap();

const usuario = { nombre: "Ana" };

datos.set(usuario, { rol: "admin" });
console.log(datos.get(usuario)); // { rol: "admin" }
console.log(datos.has(usuario)); // true

datos.delete(usuario);
console.log(datos.has(usuario)); // false
```

**¿Por qué "weak" (débil)?** Porque el `WeakMap` **no impide que el recolector de basura libere la clave**. Si el objeto clave deja de usarse en el resto del programa, se libera junto con su valor, aunque siga en el `WeakMap`.

```js
let usuario = { nombre: "Ana" };
const cache = new WeakMap();

cache.set(usuario, "datos pesados");

usuario = null; // ya no hay referencias al objeto
// El recolector puede liberar el objeto y su entrada en cache
```

Esto evita **fugas de memoria** en cachés y metadatos asociados a objetos.

**Caso 1: datos privados sin `this`**

```js
function crearUsuario(nombre) {
  const privado = new WeakMap();

  const usuario = {};

  privado.set(usuario, {
    nombre: nombre,
    activo: true,
  });

  usuario.obtenerNombre = function () {
    return privado.get(usuario).nombre;
  };

  usuario.desactivar = function () {
    privado.get(usuario).activo = false;
  };

  usuario.estaActivo = function () {
    return privado.get(usuario).activo;
  };

  return usuario;
}

const ana = crearUsuario("Ana");

console.log(ana.obtenerNombre()); // "Ana"
console.log(ana.estaActivo());   // true
ana.desactivar();
console.log(ana.estaActivo());   // false
console.log(ana.nombre);         // undefined ✅ no es accesible
```

**Caso 2: caché por objeto**

```js
const cache = new WeakMap();

function contarPropiedades(objeto) {
  if (cache.has(objeto)) {
    return cache.get(objeto);
  }

  const total = Object.keys(objeto).length;
  cache.set(objeto, total);
  return total;
}

const config = { tema: "oscuro", idioma: "es" };

console.log(contarPropiedades(config)); // 2
console.log(contarPropiedades(config)); // 2 (desde caché)
```

**Errores típicos:**

```js
const wm = new WeakMap();

// wm.set("clave", 1); // ❌ TypeError: Invalid value used as weak map key
// wm.size;           // undefined ⚠️ no existe
// for (const x of wm) {} // ❌ TypeError: wm is not iterable
```

### 3.9.9 `WeakSet`: marcar objetos

Un `WeakSet` es un conjunto de objetos con referencias débiles.

- Solo acepta objetos.
- No es iterable.
- No tiene `size`.

```js
const visitados = new WeakSet();

const nodo = { id: 1 };

visitados.add(nodo);
console.log(visitados.has(nodo)); // true

visitados.delete(nodo);
console.log(visitados.has(nodo)); // false
```

**Caso de uso: evitar procesar dos veces el mismo objeto sin modificar el objeto.**

```js
const procesados = new WeakSet();

function procesar(nodo) {
  if (procesados.has(nodo)) {
    console.log("Ya procesado, se ignora");
    return;
  }

  procesados.add(nodo);
  console.log(`Procesando nodo ${nodo.id}`);
}

const a = { id: 1 };

procesar(a); // "Procesando nodo 1"
procesar(a); // "Ya procesado, se ignora"
```

Si `a` deja de usarse, el `WeakSet` no impide que se libere.

### 3.9.10 Cuándo usar cada estructura

| Necesitas... | Usa |
|---|---|
| Lista ordenada, con duplicados, acceso por posición | Array |
| Registro con claves fijas, JSON | Objeto |
| Claves de cualquier tipo, orden de inserción, `size` | `Map` |
| Valores únicos, pertenencia rápida | `Set` |
| Datos privados o caché asociada a un objeto | `WeakMap` |
| Marcar objetos sin mutarlos | `WeakSet` |

### ✅ Haz esto / ❌ Evita esto (3.9)

```js
// ✅ Set para deduplicar
const unicos = [...new Set(lista)];

// ✅ Set para pertenencia repetida
const permitidos = new Set(["admin", "editor"]);
if (permitidos.has(rol)) { /* ... */ }

// ✅ Map para claves que no son strings
const porObjeto = new Map();
porObjeto.set(usuario, datos);

// ✅ Map para índices
const porId = new Map(usuarios.map((u) => [u.id, u]));

// ✅ WeakMap para datos privados
const privado = new WeakMap();

// ❌ Objeto con claves dinámicas que podrían chocar con el prototipo
const mal = {};
mal["toString"] = "algo"; // peligroso

// ❌ Set para datos que necesitan índice
const set = new Set([1, 2]);
// set[0] → undefined

// ❌ WeakMap con claves primitivas
// new WeakMap().set("a", 1); // TypeError

// ❌ Iterar un WeakMap
// for (const x of new WeakMap()) {} // TypeError

// ❌ Convertir un Map con claves objeto a objeto
Object.fromEntries(new Map([[{}, 1]])); // claves "[object Object]"
```

---

## 3.10 — Patrones con colecciones

Estos patrones aparecen una y otra vez en aplicaciones reales. Apréndelos como bloques reutilizables.

### 3.10.1 Indexar por `id`

**Problema:** buscar en un array con `find` es `O(n)`. Si haces miles de búsquedas, es lento.

**Solución:** construir un índice una vez y consultar en `O(1)`.

```js
function indexarPorId(items) {
  return items.reduce(function (acc, item) {
    acc[item.id] = item;
    return acc;
  }, {});
}

const usuarios = [
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" },
  { id: 3, nombre: "Eva" },
];

const porId = indexarPorId(usuarios);

console.log(porId[2].nombre); // "Luis"
console.log(porId[99]);       // undefined
```

**Versión con `Map`** (permite cualquier tipo de clave y evita colisiones):

```js
function indexarPor(items, clave) {
  const indice = new Map();

  for (const item of items) {
    indice.set(item[clave], item);
  }

  return indice;
}

const porIdMap = indexarPor(usuarios, "id");
console.log(porIdMap.get(3).nombre); // "Eva"
```

**Cuándo usarlo:** listas que se consultan muchas veces, relaciones entre entidades, cachés.

### 3.10.2 Agrupar por una propiedad

```js
function agruparPor(items, clave) {
  return items.reduce(function (acc, item) {
    const grupo = item[clave];

    if (acc[grupo] === undefined) {
      acc[grupo] = [];
    }

    acc[grupo].push(item);
    return acc;
  }, {});
}

const empleados = [
  { nombre: "Ana", departamento: "Ingeniería" },
  { nombre: "Luis", departamento: "Ventas" },
  { nombre: "Eva", departamento: "Ingeniería" },
];

const porDepartamento = agruparPor(empleados, "departamento");

console.log(porDepartamento["Ingeniería"].length); // 2
console.log(porDepartamento["Ventas"].length);     // 1
```

**Alternativa moderna (`Object.groupBy`, ES2024):**

```js
const porDepartamento2 = Object.groupBy(empleados, function (empleado) {
  return empleado.departamento;
});

console.log(porDepartamento2["Ingeniería"].length); // 2
```

> 📌 `Object.groupBy` está en Node 21+ y navegadores recientes. Devuelve un objeto especial; para comprobar si una clave existe, usa `Object.hasOwn`. En los retos usaremos la versión con `reduce` porque funciona en cualquier entorno.

**Agrupar y resumir** (contar y sumar a la vez):

```js
function resumirPor(items, claveGrupo, claveValor) {
  return items.reduce(function (acc, item) {
    const grupo = item[claveGrupo];

    if (acc[grupo] === undefined) {
      acc[grupo] = { cantidad: 0, total: 0 };
    }

    acc[grupo].cantidad += 1;
    acc[grupo].total += item[claveValor];
    return acc;
  }, {});
}

const ventas = [
  { categoria: "A", importe: 100 },
  { categoria: "B", importe: 50 },
  { categoria: "A", importe: 30 },
];

console.log(resumirPor(ventas, "categoria", "importe"));
// { A: { cantidad: 2, total: 130 }, B: { cantidad: 1, total: 50 } }
```

### 3.10.3 Ordenar por criterio

```js
function ordenarPor(items, clave, ascendente = true) {
  const copia = items.slice();

  copia.sort(function (a, b) {
    const va = a[clave];
    const vb = b[clave];

    if (typeof va === "string") {
      return ascendente
        ? va.localeCompare(vb, "es")
        : vb.localeCompare(va, "es");
    }

    return ascendente ? va - vb : vb - va;
  });

  return copia;
}

const productos = [
  { nombre: "Teclado", precio: 50 },
  { nombre: "Monitor", precio: 200 },
  { nombre: "Ratón", precio: 20 },
];

console.log(ordenarPor(productos, "precio", false)[0].nombre); // "Monitor"
console.log(productos[0].nombre); // "Teclado" ✅ intacto
```

**Ordenar por varios criterios:** usa `||` para encadenar comparadores. Si el primero devuelve `0` (empate), se evalúa el segundo.

```js
const personas = [
  { nombre: "Luis", apellido: "Gómez" },
  { nombre: "Ana", apellido: "Gómez" },
  { nombre: "Eva", apellido: "Alonso" },
];

personas.sort(function (a, b) {
  return (
    a.apellido.localeCompare(b.apellido, "es") ||
    a.nombre.localeCompare(b.nombre, "es")
  );
});

console.log(personas.map((p) => p.nombre)); // ["Eva", "Ana", "Luis"]
```

**No ordenes mezclando tipos** (números y strings) sin definir una regla: el resultado es impredecible.

### 3.10.4 Deduplicar

**Valores primitivos:**

```js
const emails = ["a@x.com", "b@x.com", "a@x.com"];
const unicos = [...new Set(emails)];

console.log(unicos); // ["a@x.com", "b@x.com"]
```

**Objetos por una propiedad:**

```js
function unicosPor(items, clave) {
  const vistos = new Map();

  for (const item of items) {
    if (!vistos.has(item[clave])) {
      vistos.set(item[clave], item);
    }
  }

  return [...vistos.values()];
}

const usuarios = [
  { id: 1, nombre: "Ana" },
  { id: 2, nombre: "Luis" },
  { id: 1, nombre: "Ana (duplicada)" },
];

console.log(unicosPor(usuarios, "id").length); // 2
```

**Quedarse con el último:**

```js
function unicosPorUltimo(items, clave) {
  const vistos = new Map();

  for (const item of items) {
    vistos.set(item[clave], item); // sobrescribe
  }

  return [...vistos.values()];
}
```

### 3.10.5 Contar frecuencias

**Con `Map` (recomendado):**

```js
function contar(items) {
  const conteo = new Map();

  for (const item of items) {
    const actual = conteo.get(item) ?? 0;
    conteo.set(item, actual + 1);
  }

  return conteo;
}

const palabras = ["hola", "mundo", "hola", "js", "hola"];

console.log(contar(palabras).get("hola")); // 3
console.log(contar(palabras).get("js"));   // 1
```

**Con objeto:**

```js
const conteo = palabras.reduce(function (acc, palabra) {
  acc[palabra] = (acc[palabra] ?? 0) + 1;
  return acc;
}, {});

console.log(conteo); // { hola: 3, mundo: 1, js: 1 }
```

> ⚠️ Con objeto, una palabra como `"constructor"` o `"toString"` puede chocar con propiedades heredadas. Con `Map` no hay ese problema. Si usas objeto, comprueba con `Object.hasOwn` antes de leer.

### 3.10.6 Actualizar y eliminar sin mutar

**Actualizar por `id`:**

```js
function actualizarPorId(items, id, cambios) {
  return items.map(function (item) {
    if (item.id === id) {
      return { ...item, ...cambios };
    }
    return item;
  });
}

const usuarios = [
  { id: 1, nombre: "Ana", activo: true },
  { id: 2, nombre: "Luis", activo: true },
];

const actualizados = actualizarPorId(usuarios, 2, { activo: false });

console.log(actualizados[1]); // { id: 2, nombre: "Luis", activo: false }
console.log(usuarios[1].activo); // true ✅
```

**Eliminar por `id`:**

```js
function eliminarPorId(items, id) {
  return items.filter(function (item) {
    return item.id !== id;
  });
}
```

**Añadir:**

```js
const nuevos = [...usuarios, { id: 3, nombre: "Eva", activo: true }];
```

**Actualizar un array anidado dentro de un objeto** (dos niveles):

```js
const estado = {
  usuario: { id: 1, nombre: "Ana" },
  tareas: [
    { id: 10, titulo: "Estudiar", hecha: false },
    { id: 11, titulo: "Practicar", hecha: false },
  ],
};

const nuevoEstado = {
  ...estado,
  tareas: estado.tareas.map(function (tarea) {
    return tarea.id === 10 ? { ...tarea, hecha: true } : tarea;
  }),
};

console.log(nuevoEstado.tareas[0].hecha); // true
console.log(estado.tareas[0].hecha);     // false ✅
```

### 3.10.7 Pipeline de datos

Un **pipeline** es una cadena de transformaciones donde la salida de una es la entrada de la siguiente.

```js
const pedidos = [
  { id: 1, estado: "pagado", importe: 100 },
  { id: 2, estado: "pendiente", importe: 50 },
  { id: 3, estado: "pagado", importe: 200 },
  { id: 4, estado: "cancelado", importe: 80 },
];

function esPagado(pedido) {
  return pedido.estado === "pagado";
}

function importeConIva(pedido) {
  return pedido.importe * 1.21;
}

const totalPagado = pedidos
  .filter(esPagado)
  .map(importeConIva)
  .reduce(function (acc, importe) {
    return acc + importe;
  }, 0);

console.log(totalPagado); // 363
```

**Ventajas de nombrar cada paso:** se lee como una frase y cada función se puede probar por separado.

```js
const pagados = pedidos.filter(esPagado);
const importes = pagados.map(importeConIva);
const total = importes.reduce((acc, i) => acc + i, 0);
```

### 3.10.8 Top N

```js
function topN(items, clave, n) {
  return items
    .slice()
    .sort(function (a, b) {
      return b[clave] - a[clave];
    })
    .slice(0, n);
}

const jugadores = [
  { nombre: "Ana", puntos: 30 },
  { nombre: "Luis", puntos: 50 },
  { nombre: "Eva", puntos: 20 },
  { nombre: "Mario", puntos: 40 },
];

console.log(topN(jugadores, "puntos", 2).map((j) => j.nombre));
// ["Luis", "Mario"]
```

**Notas:**

- `slice()` antes de `sort` evita mutar el original.
- `slice(0, n)` devuelve como máximo `n` elementos (si hay menos, no falla).
- Si hay empates, `sort` es estable desde ES2019 y conserva el orden original.

### 3.10.9 Búsqueda eficiente

```js
// ❌ O(n) por búsqueda, repetido muchas veces
function buscarLento(usuarios, id) {
  return usuarios.find((u) => u.id === id);
}

// ✅ O(1) por búsqueda tras construir el índice una vez
const indice = new Map(usuarios.map((u) => [u.id, u]));

function buscarRapido(id) {
  return indice.get(id);
}
```

**Regla:** si buscas una vez, `find` es perfecto. Si buscas cientos de veces, construye un índice.

### 3.10.10 Resumen de patrones

| Patrón | Herramienta | Complejidad |
|---|---|---|
| Indexar por id | `reduce` + objeto / `Map` | `O(n)` construir, `O(1)` consultar |
| Agrupar | `reduce` / `Object.groupBy` | `O(n)` |
| Ordenar por criterio | `slice().sort()` / `toSorted` | `O(n log n)` |
| Deduplicar primitivos | `Set` | `O(n)` |
| Deduplicar por propiedad | `Map` | `O(n)` |
| Contar frecuencias | `Map` / `reduce` | `O(n)` |
| Actualizar sin mutar | `map` + spread | `O(n)` |
| Eliminar sin mutar | `filter` | `O(n)` |
| Top N | `sort` + `slice` | `O(n log n)` |
| Pipeline | `filter` + `map` + `reduce` | `O(n)` por paso |

### ✅ Haz esto / ❌ Evita esto (3.10)

```js
// ✅ Índice para búsquedas repetidas
const porId = new Map(usuarios.map((u) => [u.id, u]));

// ✅ Agrupar con una función reutilizable
const porCategoria = agruparPor(productos, "categoria");

// ✅ Ordenar sobre una copia
const ordenados = productos.slice().sort(comparar);

// ✅ Deduplicar con Set
const unicos = [...new Set(valores)];

// ✅ Nombrar los pasos del pipeline
const pagados = pedidos.filter(esPagado);

// ❌ find dentro de un bucle para cada id
for (const id of ids) {
  usuarios.find((u) => u.id === id); // O(n²)
}

// ❌ sort sobre el array original si lo necesitas después
productos.sort(comparar);

// ❌ filter(...)[0]
usuarios.filter((u) => u.id === 1)[0];

// ❌ Contar con objeto y claves arbitrarias sin comprobar
conteo["toString"]; // puede devolver una función heredada

// ❌ Encadenar métodos que mutan y no mutan sin saber cuál es cuál
datos.sort(comparar).filter(esActivo); // sort mutó datos
```

---

## 3.11 — Buenas prácticas y anti-patrones

### ✅ Haz esto

```js
// 1. Usa el método que expresa la intención
const activos = usuarios.filter((u) => u.activo);
const nombres = activos.map((u) => u.nombre);
const total = precios.reduce((acc, p) => acc + p, 0);
const encontrado = usuarios.find((u) => u.id === id);
const hayAdmin = usuarios.some((u) => u.rol === "admin");

// 2. Copia antes de mutar si el original importa
const ordenados = datos.slice().sort(comparar);

// 3. Valores por defecto que respetan 0 y ""
const limite = opciones.limite ?? 10;

// 4. Optional chaining solo para datos realmente opcionales
const ciudad = pedido.cliente?.direccion?.ciudad;

// 5. Destructuring para dejar claro qué usas
function crearUsuario({ nombre, rol = "user" } = {}) {
  return { nombre, rol };
}

// 6. Spread para actualizaciones inmutables
const actualizado = { ...usuario, activo: false };

// 7. Set para pertenencia y unicidad
const permitidos = new Set(["admin", "editor"]);
const unicos = [...new Set(emails)];

// 8. Map para índices y claves no string
const porId = new Map(usuarios.map((u) => [u.id, u]));

// 9. Object.hasOwn para comprobar propiedades propias
if (Object.hasOwn(usuario, "email")) { /* ... */ }

// 10. Nombra los pasos intermedios si la cadena se alarga
const disponibles = productos.filter((p) => p.stock > 0);
const valores = disponibles.map((p) => p.precio * p.stock);
const totalInventario = valores.reduce((acc, v) => acc + v, 0);
```

### ❌ Evita esto

```js
// 1. Usar map para efectos secundarios
usuarios.map((u) => console.log(u.nombre)); // usa forEach

// 2. map sin return
const mal = precios.map((p) => { p * 1.21; }); // [undefined, ...]

// 3. Filtrar y quedarte con el primero
const usuario = usuarios.filter((u) => u.id === id)[0]; // usa find

// 4. Mutar el array original sin darte cuenta
datos.sort(comparar); // usa slice().sort() o toSorted

// 5. Reduce sin valor inicial en arrays posiblemente vacíos
const total = precios.reduce((a, b) => a + b); // TypeError si []

// 6. Defaults con || para valores que pueden ser 0 o ""
const limite = opciones.limite || 10;

// 7. Optional chaining en datos obligatorios
const nombre = respuesta?.cliente?.nombre; // oculta errores

// 8. Copias superficiales creyendo que son profundas
const copia = { ...original }; // anidados compartidos

// 9. for...in para arrays
for (const i in array) { /* ... */ } // usa for...of o métodos

// 10. delete en arrays
delete array[1]; // deja un hueco

// 11. Comparar arrays u objetos con ===
[1, 2] === [1, 2]; // false

// 12. Anidar seis métodos sin nombres
datos.filter(a).map(b).filter(c).map(d).reduce(e, 0);
```

---

## 3.12 — Retos con solución explicada

> 🧭 **Metodología:** intenta resolver cada reto **antes** de leer la solución. Si te bloqueas 15 minutos, mira solo el enunciado desglosado. Todos los retos usan **solo** conceptos de los Módulos 1, 2 y 3.

---

### 🥊 Reto 1 — Análisis de ventas

**Enunciado:** dado un array de ventas, calcula:

1. El ingreso total.
2. Las unidades totales vendidas.
3. El producto más vendido por unidades.
4. El ingreso agrupado por categoría.
5. La lista de categorías únicas.

```js
const ventas = [
  { producto: "Teclado", unidades: 3, precio: 50, categoria: "Periféricos" },
  { producto: "Ratón", unidades: 10, precio: 20, categoria: "Periféricos" },
  { producto: "Monitor", unidades: 2, precio: 200, categoria: "Pantallas" },
  { producto: "Cable", unidades: 15, precio: 10, categoria: "Accesorios" },
];

// 1. Ingreso total: suma de unidades × precio.
const ingresoTotal = ventas.reduce(function (acc, venta) {
  return acc + venta.unidades * venta.precio;
}, 0);

// 2. Unidades totales.
const unidadesTotales = ventas.reduce(function (acc, venta) {
  return acc + venta.unidades;
}, 0);

// 3. Producto con más unidades.
const masVendido = ventas.reduce(function (max, venta) {
  return venta.unidades > max.unidades ? venta : max;
}, ventas[0]);

// 4. Ingreso por categoría.
const ingresoPorCategoria = ventas.reduce(function (acc, venta) {
  const categoria = venta.categoria;
  const ingreso = venta.unidades * venta.precio;

  acc[categoria] = (acc[categoria] ?? 0) + ingreso;
  return acc;
}, {});

// 5. Categorías únicas.
const categorias = [...new Set(ventas.map((venta) => venta.categoria))];

console.log(ingresoTotal);        // 900
console.log(unidadesTotales);     // 30
console.log(masVendido.producto); // "Cable"
console.log(ingresoPorCategoria);
// { Periféricos: 350, Pantallas: 400, Accesorios: 150 }
console.log(categorias);
// ["Periféricos", "Pantallas", "Accesorios"]
```

**Explicación línea por línea:**

1. `reduce` recorre las ventas acumulando `unidades * precio` en `acc`. El `0` inicial garantiza que funcione incluso con un array vacío.
2. El mismo patrón, pero acumulando solo `unidades`. Separar los cálculos hace cada uno legible y comprobable.
3. `reduce` compara cada venta con la máxima conocida. El valor inicial es `ventas[0]`; si el array pudiera estar vacío, habría que comprobarlo antes.
4. Por cada venta se calcula su ingreso y se suma a la categoría. `acc[categoria] ?? 0` usa `0` solo si la categoría aún no existe; `??` evita el problema de `||` con valores `0`.
5. `map` extrae las categorías (con duplicados), `new Set(...)` elimina los repetidos y `[...]` lo convierte de nuevo en array.

**Variante con `Map` para el paso 4:**

```js
const porCategoria = new Map();

for (const venta of ventas) {
  const actual = porCategoria.get(venta.categoria) ?? 0;
  porCategoria.set(venta.categoria, actual + venta.unidades * venta.precio);
}

console.log(porCategoria.get("Pantallas")); // 400
```

---

### 🥊 Reto 2 — Carrito de compra con cupón

**Enunciado:** calcula subtotal, descuento, base imponible, IVA (21 %) y total. El cupón es opcional; si no existe o no es válido, el descuento es 0. Devuelve un objeto con todos los importes.

```js
const carrito = [
  { nombre: "Teclado", precio: 50, cantidad: 2 },
  { nombre: "Ratón", precio: 20, cantidad: 1 },
  { nombre: "Monitor", precio: 200, cantidad: 1 },
];

// 1. Tabla de cupones. Un Map evita colisiones con propiedades del objeto.
const CUPONES = new Map([
  ["VERANO10", 0.10],
  ["VIP20", 0.20],
]);

function calcularCompra(items, cupon) {
  // 2. Subtotal: suma de precio × cantidad.
  const subtotal = items.reduce(function (acc, item) {
    return acc + item.precio * item.cantidad;
  }, 0);

  // 3. Porcentaje de descuento: 0 si el cupón no existe.
  const porcentaje = CUPONES.get(cupon) ?? 0;

  // 4. Importes.
  const descuento = subtotal * porcentaje;
  const base = subtotal - descuento;
  const iva = base * 0.21;
  const total = base + iva;

  // 5. Devolvemos un objeto (shorthand).
  return { subtotal, descuento, base, iva, total };
}

const resultado = calcularCompra(carrito, "VERANO10");

console.log(resultado.subtotal);        // 320
console.log(resultado.descuento);       // 32
console.log(resultado.base);            // 288
console.log(resultado.iva);             // 60.48
console.log(resultado.total);           // 348.48
console.log(resultado.total.toFixed(2)); // "348.48"

console.log(calcularCompra(carrito, "NOEXISTE").descuento); // 0
console.log(calcularCompra(carrito).descuento);             // 0
```

**Explicación línea por línea:**

1. `new Map([...])` crea el mapa a partir de pares. Con un objeto, `CUPONES["constructor"]` devolvería una función heredada; con `Map`, `get("constructor")` devuelve `undefined`.
2. `reduce` suma `precio * cantidad`. Es el mismo patrón del Reto 1.
3. `CUPONES.get(cupon)` devuelve el porcentaje o `undefined`. `?? 0` convierte `undefined` en `0`, pero **respeta** un descuento de `0` si existiera.
4. Los cuatro importes se calculan en pasos nombrados. `base` es lo que queda tras el descuento; el IVA se aplica sobre la base, no sobre el subtotal.
5. `return { subtotal, descuento, base, iva, total }` usa propiedad abreviada: cada nombre de variable se convierte en clave.
6. `toFixed(2)` se usa **solo al mostrar**. Seguir calculando con el string perdería precisión.

> 🧠 Para dinero real, trabaja en céntimos enteros y divide al final; el ejemplo usa euros con decimales para que veas el flujo.

---

### 🥊 Reto 3 — Limpieza y deduplicación de registros

**Enunciado:** normaliza nombres y emails (sin espacios sobrantes, en minúsculas), descarta los emails inválidos y elimina duplicados por email conservando el primero. Sin usar regex.

```js
const registros = [
  { nombre: " Ana ", email: " ANA@MAIL.COM " },
  { nombre: "Luis", email: "luis@mail.com" },
  { nombre: "Eva", email: "eva@mail" },
  { nombre: "Ana Duplicada", email: "ana@mail.com" },
  { nombre: "Sin correo", email: "" },
];

// 1. Normalizar sin mutar los originales.
function normalizar(registro) {
  return {
    nombre: registro.nombre.trim(),
    email: registro.email.trim().toLowerCase(),
  };
}

// 2. Validación básica: una @, un punto después de la @ y nada de punto final.
function esEmailValido(email) {
  const arroba = email.indexOf("@");
  const punto = email.indexOf(".", arroba + 1);

  return (
    arroba > 0 &&
    punto > arroba + 1 &&
    punto < email.length - 1 &&
    email[email.length - 1] !== "."
  );
}

// 3. Deduplicar por email conservando el primero.
function unicosPorEmail(items) {
  const vistos = new Map();

  for (const item of items) {
    if (!vistos.has(item.email)) {
      vistos.set(item.email, item);
    }
  }

  return [...vistos.values()];
}

const limpios = registros
  .map(normalizar)
  .filter((registro) => esEmailValido(registro.email));

const unicos = unicosPorEmail(limpios);

console.log(unicos);
// [
//   { nombre: "Ana", email: "ana@mail.com" },
//   { nombre: "Luis", email: "luis@mail.com" }
// ]
```

**Explicación línea por línea:**

1. `normalizar` devuelve un objeto **nuevo**. `trim()` quita espacios de los extremos; `toLowerCase()` unifica mayúsculas. No mutamos los registros originales.
2. `indexOf("@")` da la posición de la arroba o `-1`. `indexOf(".", arroba + 1)` busca el primer punto **después** de la arroba. Las condiciones exigen: algo antes de la arroba, algo entre la arroba y el punto, algo después del punto y que el email no termine en punto.
3. `Map` guarda el primer registro de cada email. `has` comprueba existencia; si ya está, se ignora el duplicado. `values()` devuelve los registros y `[...]` los convierte en array.
4. `map` normaliza; `filter` descarta inválidos. El orden importa: se valida sobre el email ya limpio.
5. `unicosPorEmail` recibe solo los válidos y conserva el primero de cada email (`"Ana"`, no `"Ana Duplicada"`).

**Casos límite:**

```js
console.log(esEmailValido("a@b.c"));   // true
console.log(esEmailValido("@b.c"));    // false
console.log(esEmailValido("a@bc"));    // false
console.log(esEmailValido("a@.c"));    // false
console.log(esEmailValido("a@b.c."));  // false
```

> 📌 Esta validación es deliberadamente simple. Una validación real de emails es más compleja y se apoya en regex o librerías (Módulo 7).

---

### 🥊 Reto 4 — Biblioteca: ordenar, buscar y comprobar

**Enunciado:** con un array de libros:

1. Ordénalos por año ascendente sin mutar el original.
2. Busca un libro por título (sin distinguir mayúsculas).
3. Comprueba si hay alguno con más de 500 páginas.
4. Comprueba si todos son anteriores a 2000.
5. Obtén los 2 más largos.

```js
const libros = [
  { titulo: "Cien años de soledad", autor: "García Márquez", anio: 1967, paginas: 471 },
  { titulo: "El Quijote", autor: "Cervantes", anio: 1605, paginas: 863 },
  { titulo: "Ficciones", autor: "Borges", anio: 1944, paginas: 174 },
  { titulo: "La casa de los espíritus", autor: "Allende", anio: 1982, paginas: 433 },
];

// 1. Copia + orden por año.
const porAnio = libros.slice().sort(function (a, b) {
  return a.anio - b.anio;
});

console.log(porAnio.map((libro) => libro.titulo));
// ["El Quijote", "Ficciones", "Cien años de soledad", "La casa de los espíritus"]

// 2. Búsqueda por título normalizado.
function buscarPorTitulo(titulo) {
  const buscado = titulo.trim().toLowerCase();

  return libros.find(function (libro) {
    return libro.titulo.toLowerCase() === buscado;
  });
}

console.log(buscarPorTitulo("ficciones").autor); // "Borges"
console.log(buscarPorTitulo("  EL QUIJOTE  ").autor); // "Cervantes"
console.log(buscarPorTitulo("no existe")); // undefined

// 3. ¿Alguno largo?
const hayLargos = libros.some((libro) => libro.paginas > 500);
console.log(hayLargos); // true

// 4. ¿Todos anteriores a 2000?
const todosAntiguos = libros.every((libro) => libro.anio < 2000);
console.log(todosAntiguos); // true

// 5. Top 2 por páginas.
const top2 = libros
  .slice()
  .sort(function (a, b) {
    return b.paginas - a.paginas;
  })
  .slice(0, 2);

console.log(top2.map((libro) => libro.titulo));
// ["El Quijote", "Cien años de soledad"]
```

**Explicación línea por línea:**

1. `slice()` copia antes de `sort`, porque `sort` muta. El comparador `a.anio - b.anio` ordena números de forma ascendente.
2. `trim().toLowerCase()` normaliza la búsqueda. `find` devuelve el primer libro cuyo título coincide; si no hay, `undefined`.
3. `some` se detiene en cuanto encuentra uno que cumple. Con `false` significaría que ninguno supera 500 páginas.
4. `every` exige que todos cumplan. En un array vacío devolvería `true` (ver 3.4.6).
5. La segunda copia evita mutar `libros` otra vez. `sort` descendente por páginas y `slice(0, 2)` toma los dos primeros.

**Alternativa moderna para el paso 1:**

```js
const porAnio2 = libros.toSorted((a, b) => a.anio - b.anio);
```

---

### 🥊 Reto 5 — Configuración con defaults y merge anidado

**Enunciado:** combina una configuración por defecto con las preferencias del usuario. El merge debe conservar las notificaciones no especificadas. Después lee un valor opcional con `?.` y `??`.

```js
const defaults = {
  tema: "claro",
  idioma: "es",
  notificaciones: { email: true, push: false },
  limite: 10,
};

const preferencias = {
  tema: "oscuro",
  notificaciones: { push: true },
};

// 1. Merge en dos niveles.
function crearConfig(base, usuario) {
  return {
    ...base,
    ...usuario,
    notificaciones: {
      ...base.notificaciones,
      ...(usuario.notificaciones ?? {}),
    },
  };
}

const config = crearConfig(defaults, preferencias);

console.log(config);
// {
//   tema: "oscuro",
//   idioma: "es",
//   notificaciones: { email: true, push: true },
//   limite: 10
// }

// 2. Lectura segura de un valor opcional.
const sms = config.notificaciones?.sms ?? false;
console.log(sms); // false

// 3. El original no se mutó.
console.log(defaults.tema);        // "claro"
console.log(preferencias.tema);    // "oscuro"
```

**Explicación línea por línea:**

1. El primer spread copia todos los defaults. El segundo sobrescribe con las preferencias (`tema: "oscuro"`).
2. Si solo hiciéramos `{ ...base, ...usuario }`, `notificaciones` se reemplazaría entera y perderíamos `email: true`. Por eso se construye un objeto nuevo mezclando **las dos** notificaciones.
3. `usuario.notificaciones ?? {}` evita que el spread reciba `undefined`. Aunque `{ ...undefined }` no falla, el `??` deja la intención explícita.
4. `config.notificaciones?.sms` devuelve `undefined` porque `sms` no existe; `?? false` aplica el valor por defecto. `??` respeta `false` como valor válido.
5. Ningún objeto original se modifica: todo son copias superficiales de primer y segundo nivel.

> ⚠️ Si la configuración tuviera tres niveles, este merge manual se volvería tedioso. Ahí es donde una función de merge profundo (o `structuredClone` + asignación controlada) empieza a tener sentido.

---

### 🥊 Reto 6 — Conversiones entre estructuras

**Enunciado:** partiendo de un objeto de precios:

1. Conviértelo en array de pares.
2. Filtra los que cuestan más de 30.
3. Vuelve a convertirlo en objeto.
4. Crea un `Map`, añade un producto y vuelve a objeto.
5. Crea un `Set` con las claves.

```js
const precios = { teclado: 50, raton: 20, monitor: 200, cable: 10 };

// 1. Objeto → array de pares.
const entradas = Object.entries(precios);
console.log(entradas);
// [["teclado", 50], ["raton", 20], ["monitor", 200], ["cable", 10]]

// 2. Filtrar por precio. [, precio] se salta la clave.
const caros = entradas.filter(function (par) {
  const precio = par[1];
  return precio > 30;
});
console.log(caros); // [["teclado", 50], ["monitor", 200]]

// 3. Array de pares → objeto.
const carosObj = Object.fromEntries(caros);
console.log(carosObj); // { teclado: 50, monitor: 200 }

// 4. Objeto → Map → objeto.
const mapa = new Map(entradas);
mapa.set("webcam", 80);

console.log(mapa.size); // 5
console.log(mapa.get("webcam")); // 80

const deNuevo = Object.fromEntries(mapa);
console.log(deNuevo); // { teclado: 50, raton: 20, monitor: 200, cable: 10, webcam: 80 }

// 5. Set de claves.
const claves = new Set(Object.keys(precios));

console.log(claves.has("raton")); // true
console.log(claves.size);         // 4
```

**Explicación línea por línea:**

1. `Object.entries` devuelve un array de pares `[clave, valor]`. Es la puerta entre el mundo objeto y el mundo array.
2. `filter` recibe cada par; `par[1]` es el precio. Se puede escribir con destructuring: `filter(([, precio]) => precio > 30)`.
3. `Object.fromEntries` hace la operación inversa: pares → objeto.
4. `new Map(entradas)` construye el mapa desde los pares. `set` añade o sobrescribe; `size` cuenta los pares. `Object.fromEntries(mapa)` convierte el mapa de vuelta a objeto.
5. `Object.keys` da las claves; `new Set(...)` las deduplica (aquí no hay duplicados, pero el patrón es el mismo). `has` comprueba pertenencia.

> ⚠️ Al convertir un `Map` a objeto, las claves se convierten a string. Si el `Map` tuviera claves objeto, se perdería información.

---

### 🥊 Reto 7 — Agrupar y resumir por categoría

**Enunciado:** agrupa las ventas por categoría y calcula, para cada una, cuántos productos hay y cuántas unidades se vendieron. Usa `reduce`. Después compara con `Object.groupBy`.

```js
const ventas = [
  { producto: "Teclado", unidades: 3, categoria: "Periféricos" },
  { producto: "Ratón", unidades: 10, categoria: "Periféricos" },
  { producto: "Monitor", unidades: 2, categoria: "Pantallas" },
  { producto: "Cable", unidades: 15, categoria: "Accesorios" },
];

// 1. Agrupar y resumir en una sola pasada.
function resumirPorCategoria(items) {
  return items.reduce(function (acc, item) {
    const grupo = item.categoria;

    if (acc[grupo] === undefined) {
      acc[grupo] = { cantidad: 0, totalUnidades: 0 };
    }

    acc[grupo].cantidad += 1;
    acc[grupo].totalUnidades += item.unidades;
    return acc;
  }, {});
}

const resumen = resumirPorCategoria(ventas);

console.log(resumen);
// {
//   Periféricos: { cantidad: 2, totalUnidades: 13 },
//   Pantallas: { cantidad: 1, totalUnidades: 2 },
//   Accesorios: { cantidad: 1, totalUnidades: 15 }
// }

// 2. Alternativa moderna: solo agrupa, no resume.
const grupos = Object.groupBy(ventas, function (venta) {
  return venta.categoria;
});

console.log(Object.keys(grupos));
// ["Periféricos", "Pantallas", "Accesorios"]

console.log(grupos["Periféricos"].length); // 2
```

**Explicación línea por línea:**

1. `reduce` recorre una sola vez. `grupo` es la categoría de la venta actual.
2. Si es la primera vez que aparece la categoría, se crea un objeto con contadores a cero.
3. `cantidad += 1` cuenta productos; `totalUnidades += item.unidades` suma unidades.
4. Se devuelve `acc` en cada paso; si se olvida, el acumulador se convierte en `undefined` y todo falla.
5. `Object.groupBy` agrupa en un solo paso, pero no suma. Para obtener totales habría que recorrer cada grupo después.

**Variante con `Map`:**

```js
function resumirConMap(items) {
  const resumen = new Map();

  for (const item of items) {
    const actual = resumen.get(item.categoria) ?? { cantidad: 0, totalUnidades: 0 };
    actual.cantidad += 1;
    actual.totalUnidades += item.unidades;
    resumen.set(item.categoria, actual);
  }

  return resumen;
}

console.log(resumirConMap(ventas).get("Periféricos"));
// { cantidad: 2, totalUnidades: 13 }
```

---

### 🥊 Reto 8 — Memoización con `Map`

**Enunciado:** crea `memoizar(fn)` que cachee resultados en un `Map`. Debe distinguir un resultado `undefined` de "no calculado". Pruébalo con una función que imprime cada vez que calcula.

```js
// 1. Fábrica de funciones memoizadas.
function memoizar(fn) {
  const cache = new Map();

  return function (arg) {
    // 2. has distingue "no existe" de "existe con valor undefined".
    if (cache.has(arg)) {
      return cache.get(arg);
    }

    // 3. Solo calcula si no está en caché.
    const resultado = fn(arg);
    cache.set(arg, resultado);
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
console.log(cuadrado(6)); // 36
```

**Explicación línea por línea:**

1. `memoizar` recibe una función y devuelve otra. El `Map` vive en el closure: cada función memoizada tiene su propia caché.
2. `cache.has(arg)` comprueba si la clave existe. Es distinto de `cache.get(arg) !== undefined`: si el resultado legítimo fuera `undefined`, esa comprobación fallaría y recalcularía siempre.
3. `fn(arg)` solo se ejecuta la primera vez. El resultado se guarda con `set` y se devuelve.
4. En las llamadas siguientes, `get` devuelve el valor guardado sin ejecutar `fn`.

**¿Por qué `Map` y no un objeto?**

```js
const cacheObjeto = {};
cacheObjeto["toString"]; // función heredada ⚠️
```

Con un objeto, una clave como `"toString"` o `"constructor"` puede devolver propiedades heredadas. `Map` no tiene ese problema y además acepta claves que no son strings.

---

### 🥊 Reto 9 — Datos privados con `WeakMap`

**Enunciado:** crea una cuenta bancaria cuyo saldo sea inaccesible desde fuera. Usa un `WeakMap` y closures. Debe permitir depositar, retirar y consultar, validando importes.

```js
function crearCuenta(saldoInicial) {
  // 1. Estado privado asociado al objeto cuenta.
  const estado = new WeakMap();
  const cuenta = {};

  estado.set(cuenta, { saldo: saldoInicial });

  // 2. Depositar.
  cuenta.depositar = function (monto) {
    if (!Number.isFinite(monto) || monto <= 0) {
      return null;
    }

    const datos = estado.get(cuenta);
    datos.saldo += monto;
    return datos.saldo;
  };

  // 3. Retirar.
  cuenta.retirar = function (monto) {
    if (!Number.isFinite(monto) || monto <= 0) {
      return null;
    }

    const datos = estado.get(cuenta);
    if (monto > datos.saldo) {
      return null;
    }

    datos.saldo -= monto;
    return datos.saldo;
  };

  // 4. Consultar.
  cuenta.consultar = function () {
    return estado.get(cuenta).saldo;
  };

  return cuenta;
}

const cuenta = crearCuenta(100);

console.log(cuenta.consultar());   // 100
console.log(cuenta.depositar(50)); // 150
console.log(cuenta.retirar(200));  // null
console.log(cuenta.retirar(30));   // 120
console.log(cuenta.consultar());   // 120
console.log(cuenta.saldo);         // undefined ✅ inaccesible
```

**Explicación línea por línea:**

1. `estado` es un `WeakMap` que asocia el objeto `cuenta` con un objeto interno `{ saldo }`. Ese objeto interno no es accesible desde fuera.
2. `depositar` valida con `Number.isFinite` (descarta `NaN`, `Infinity`, strings) y exige `monto > 0`. Devuelve `null` si el importe no es válido.
3. `retirar` añade la comprobación de fondos: si `monto > saldo`, no modifica nada y devuelve `null`.
4. `consultar` lee el saldo a través del `WeakMap`.
5. `cuenta.saldo` es `undefined` porque el saldo nunca se guarda como propiedad del objeto. La privacidad se apoya en el closure + `WeakMap`, sin `this` y sin clases.

**¿Por qué `WeakMap` y no una variable del closure?**

Con una variable normal (`let saldo = saldoInicial`) también sería privada: cada llamada a `crearCuenta` crea su propia variable. La diferencia es que el `WeakMap` asocia el estado **al objeto cuenta**, no al closure. Eso permite tener varias cuentas creadas por la misma función y que el estado se libere automáticamente cuando la cuenta deja de usarse. Con un closure simple, el estado quedaría atado a la función y no a la identidad del objeto.

---

### 🥊 Reto 10 (integrador) — Refactorizar un procesador de pedidos

**Enunciado:** descompón esta función monolítica en funciones pequeñas con una responsabilidad cada una. Usa `filter`, `map` y `reduce`.

```js
// ❌ Versión monolítica
function procesarPedidosMal(pedidos) {
  let total = 0;
  const resumen = {};

  for (const pedido of pedidos) {
    if (pedido.estado === "pagado") {
      const importe = pedido.precio * pedido.cantidad;
      total += importe;

      if (resumen[pedido.categoria] === undefined) {
        resumen[pedido.categoria] = 0;
      }

      resumen[pedido.categoria] += importe;
    }
  }

  console.log("Total:", total);
  return { total: total, resumen: resumen };
}
```

**Solución refactorizada:**

```js
const pedidos = [
  { id: 1, estado: "pagado", precio: 100, cantidad: 2, categoria: "libros" },
  { id: 2, estado: "pendiente", precio: 50, cantidad: 1, categoria: "libros" },
  { id: 3, estado: "pagado", precio: 200, cantidad: 1, categoria: "tech" },
  { id: 4, estado: "pagado", precio: 20, cantidad: 5, categoria: "tech" },
];

// 1. Predicado (función que devuelve verdadero o falso): ¿está pagado?
function esPagado(pedido) {
  return pedido.estado === "pagado";
}

// 2. Cálculo del importe de un pedido.
function calcularImporte(pedido) {
  return pedido.precio * pedido.cantidad;
}

// 3. Suma de dos números (para pasarla a reduce).
function sumar(acc, valor) {
  return acc + valor;
}

// 4. Resumen por categoría.
function resumirPorCategoria(pedidosPagados) {
  return pedidosPagados.reduce(function (acc, pedido) {
    const categoria = pedido.categoria;
    acc[categoria] = (acc[categoria] ?? 0) + calcularImporte(pedido);
    return acc;
  }, {});
}

// 5. Orquestación: se lee como una frase.
function procesarPedidos(pedidos) {
  const pagados = pedidos.filter(esPagado);
  const importes = pagados.map(calcularImporte);
  const total = importes.reduce(sumar, 0);
  const resumen = resumirPorCategoria(pagados);

  console.log(`Total: ${total} €`);
  return { total, resumen };
}

const resultado = procesarPedidos(pedidos);

console.log(resultado.total);   // 500
console.log(resultado.resumen); // { libros: 200, tech: 300 }
```

**Explicación línea por línea:**

1. `esPagado` expresa una regla de negocio en una función con nombre. Se puede probar y reutilizar.
2. `calcularImporte` aísla la fórmula. Si mañana cambia (descuentos, impuestos), se toca en un solo lugar.
3. `sumar` existe para que `reduce` se lea como `importes.reduce(sumar, 0)`.
4. `resumirPorCategoria` agrupa y suma en una pasada. `?? 0` cubre la primera aparición de cada categoría.
5. `procesarPedidos` solo coordina: filtrar → transformar → reducir → resumir. No mezcla cálculo, formato y salida.
6. El `console.log` está en la función de orquestación, no enterrado en el bucle. En una aplicación real, la salida se haría fuera y la función solo devolvería datos.

**Beneficios:**

- Cada función se puede probar por separado.
- `esPagado` y `calcularImporte` se reutilizan en otros informes.
- El flujo principal se lee de un vistazo.
- Cambiar la definición de "pagado" no obliga a tocar el cálculo del total.

---

### 🥊 Reto 11 — Laboratorio de predicción

Predice el resultado **antes** de ejecutar. Cada caso es independiente.

**Caso 1 — Referencia:**

```js
const a = [1, 2];
const b = a;
b.push(3);
console.log(a.length);
```

**Respuesta:** `3`. `b` es un alias de `a`; `push` muta el mismo array.

**Caso 2 — Copia superficial:**

```js
const a = [1, 2];
const b = a.slice();
b.push(3);
console.log(a.length);
```

**Respuesta:** `2`. `slice()` crea un array nuevo; `push` solo afecta a `b`.

**Caso 3 — `sort` muta y devuelve la misma referencia:**

```js
const a = [3, 1, 2];
const b = a.sort();
console.log(a === b, a);
```

**Respuesta:** `true [1, 2, 3]`. `sort` ordena en el sitio y devuelve el mismo array.

**Caso 4 — Spread superficial:**

```js
const a = { x: 1, y: { z: 2 } };
const b = { ...a };
b.y.z = 99;
console.log(a.y.z);
```

**Respuesta:** `99`. El spread copia la referencia de `y`, no el objeto anidado.

**Caso 5 — Default con `null`:**

```js
const { activo = true } = { activo: null };
console.log(activo);
```

**Respuesta:** `null`. El valor por defecto solo se aplica cuando el valor es `undefined`.

**Caso 6 — `||` vs `??`:**

```js
const v = 0;
console.log(v || 10, v ?? 10);
```

**Respuesta:** `10 0`. `||` reemplaza cualquier valor falsy; `??` solo `null` y `undefined`.

**Caso 7 — Optional chaining:**

```js
const user = { nombre: "Ana" };
console.log(user.direccion?.ciudad, user.nombre?.length);
```

**Respuesta:** `undefined 3`. `user.direccion` es `undefined`, así que `?.ciudad` se cortocircuita. `user.nombre` existe y tiene longitud 3.

**Caso 8 — Claves de `Map` por referencia:**

```js
const o = { id: 1 };
const m = new Map();
m.set(o, "ok");
console.log(m.get({ id: 1 }), m.get(o));
```

**Respuesta:** `undefined "ok"`. El objeto literal nuevo es otra referencia.

**Caso 9 — `Set` y `NaN`:**

```js
const s = new Set([NaN, NaN, 1, 1]);
console.log(s.size);
```

**Respuesta:** `2`. `Set` usa `SameValueZero`, que considera `NaN` igual a `NaN`.

**Caso 10 — Orden de claves:**

```js
const o = { b: 1, 2: 2, a: 3, 1: 4 };
console.log(Object.keys(o));
```

**Respuesta:** `["1", "2", "b", "a"]`. Las claves enteras van primero, en orden numérico; después las strings en orden de inserción.

---

## 3.13 — Errores comunes, glosario y autoevaluación

### 3.13.1 Los 16 errores más frecuentes de este nivel

| Error | Ejemplo | Solución |
|---|---|---|
| `sort` sin comparador en números | `[10, 9].sort()` | `sort((a, b) => a - b)` |
| `map` sin `return` | `map((n) => { n * 2; })` | `map((n) => n * 2)` |
| `filter(...)[0]` | `filter((u) => u.id === 1)[0]` | `find((u) => u.id === 1)` |
| `slice(-1)` esperando el elemento | `arr.slice(-1)` | `arr.at(-1)` |
| Confundir `slice` y `splice` | `arr.splice(1, 1)` | `slice` no muta; `splice` sí |
| Creer que `splice` devuelve el array | `const x = arr.splice(1, 1)` | Devuelve los eliminados |
| Alias en vez de copia | `const b = a` | `const b = a.slice()` / `[...a]` |
| Copia superficial creyendo profunda | `{ ...obj }` | `structuredClone(obj)` |
| `\|\|` para defaults numéricos | `limite \|\| 10` | `limite ?? 10` |
| Mezclar `??` con `\|\|` | `a ?? b \|\| c` | `a ?? (b \|\| c)` |
| `?.` en datos obligatorios | `respuesta?.cliente?.nombre` | `respuesta.cliente.nombre` |
| Destructurar `null` | `const { a } = null` | Comprobar antes o usar `?.` |
| `for...in` en arrays | `for (const i in arr)` | `for...of` o métodos |
| `delete` en arrays | `delete arr[1]` | `filter` / `splice` |
| `reduce` sin inicial en array vacío | `[].reduce((a, b) => a + b)` | Pasar `0` como inicial |
| Claves de `Map`/`Set` por contenido | `set.add({ id: 1 })` dos veces | Guardar la misma referencia |

### 3.13.2 Glosario del módulo

- **Acumulador:** valor que `reduce` va construyendo en cada paso.
- **Array:** colección ordenada con índices numéricos y `length`.
- **Array-like:** objeto con `length` e índices que no es un array real.
- **Callback:** función que se pasa a otra para que la ejecute.
- **Copia profunda:** duplica también los objetos anidados.
- **Copia superficial:** duplica el primer nivel; los anidados se comparten.
- **Destructuring:** sintaxis para extraer valores de arrays y objetos.
- **Hueco (*hole*):** índice que no existe en un array.
- **Iterable:** objeto que se puede recorrer con `for...of` (arrays, strings, `Map`, `Set`).
- **Iterador:** objeto con `next()` que devuelve `{ value, done }`.
- **`Map`:** colección de pares clave-valor con claves de cualquier tipo.
- **Memoización:** cachear resultados para no recalcular.
- **Mutador:** método que modifica el array original.
- **No mutador:** método que devuelve una copia o un valor sin modificar el original.
- **Optional chaining (`?.`):** acceso seguro que devuelve `undefined` si falta un nivel.
- **Nullish coalescing (`??`):** valor por defecto solo para `null` y `undefined`.
- **Pipeline:** cadena de transformaciones de datos.
- **Rest (`...`):** agrupa el resto en un array u objeto.
- **`SameValueZero`:** comparación de `Set`/`Map`; como `===`, pero `NaN` es igual a `NaN`.
- **`Set`:** colección de valores únicos.
- **Spread (`...`):** expande elementos o propiedades.
- **`WeakMap`:** mapa con claves objeto y referencias débiles; no iterable.
- **`WeakSet`:** conjunto de objetos con referencias débiles; no iterable.

### 3.13.3 Autoevaluación (responde sin mirar)

1. ¿Por qué `typeof []` es `"object"` y cómo se comprueba un array de verdad?
2. ¿Qué diferencia hay entre `slice` y `splice`?
3. ¿Por qué `[10, 9, 1].sort()` da `[1, 10, 9]`?
4. ¿Qué devuelve `map` si el callback no tiene `return`?
5. ¿Cuándo usar `find` en vez de `filter`?
6. ¿Qué pasa si llamas a `reduce` sin valor inicial en un array vacío?
7. ¿Qué diferencia hay entre `some` y `every` en un array vacío?
8. ¿Qué copia `{ ...objeto }` y qué no copia?
9. ¿Cuándo se aplica un valor por defecto en destructuring: con `null` o con `undefined`?
10. ¿Qué diferencia hay entre `||` y `??`?
11. ¿Qué ventajas tiene `Map` sobre un objeto?
12. ¿Por qué `WeakMap` no tiene `size` ni se puede iterar?

> Si respondes 9 de 12 con seguridad, estás listo para el Módulo 4. Si fallas en copias, `reduce` o `Map`, relee las secciones 3.4, 3.5 y 3.9: son las que más se usan en el día a día.

---

## 🎯 Cierre del Módulo 3

Has aprendido:

- Cómo funcionan los arrays por dentro: índices, `length`, huecos y referencias.
- La diferencia entre métodos mutadores y no mutadores, y cuándo usar cada uno.
- `map`, `filter`, `reduce`, `some`, `every`, `find` y cómo encadenarlos.
- Objetos a fondo: claves dinámicas, `Object.keys/values/entries`, `fromEntries`, `assign`, `hasOwn`, `freeze`.
- Destructuring de arrays, objetos, parámetros y bucles.
- Spread y rest en arrays, objetos y llamadas.
- `?.` y `??` para datos opcionales y defaults correctos.
- `Map`, `Set`, `WeakMap` y `WeakSet`, con sus casos de uso reales.
- Patrones profesionales: indexar, agrupar, ordenar, deduplicar, contar, actualizar sin mutar y construir pipelines.

**En el Módulo 4** entrarás en el corazón del modelo de objetos de JavaScript:

- `this`: qué es, cómo se decide y por qué cambia según cómo llames a la función.
- `call`, `apply` y `bind`.
- Prototipos y cadena de prototipos.
- Clases, `new`, constructores y métodos.
- Getters y setters.
- Composición frente a herencia.

Todo lo que has aprendido aquí (objetos, `Map`, closures, HOF) se conecta directamente con esos temas.

---

## ✅ Checklist de dominio del Módulo 3

- [ ] Sé explicar qué es un array por dentro y por qué `typeof []` es `"object"`.
- [ ] Distingo mutadores de no mutadores y sé qué devuelve cada uno.
- [ ] Uso `sort` con comparador numérico y `localeCompare` para texto.
- [ ] Sé cuándo usar `slice` y cuándo `splice`.
- [ ] Uso `map`, `filter`, `reduce`, `some`, `every` y `find` sin dudar.
- [ ] Sé encadenar métodos y nombrar pasos intermedios.
- [ ] Entiendo la diferencia entre referencia, copia superficial y copia profunda.
- [ ] Sé recorrer objetos con `Object.entries` y reconstruirlos con `fromEntries`.
- [ ] Uso `Object.hasOwn` para comprobar propiedades propias.
- [ ] Sé destructurar arrays, objetos, parámetros y bucles.
- [ ] Distingo spread de rest y sé cuándo se usa cada uno.
- [ ] Uso `?.` solo para datos realmente opcionales.
- [ ] Uso `??` en vez de `||` cuando `0` o `""` son válidos.
- [ ] Sé cuándo usar `Map` en vez de objeto.
- [ ] Sé deduplicar con `Set` y con `Map` por propiedad.
- [ ] Entiendo qué es un `WeakMap` y por qué no se puede iterar.
- [ ] Resolví los 11 retos sin mirar la solución.
