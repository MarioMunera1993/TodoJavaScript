# Módulo 7 — Módulos, programación funcional, errores, `fetch` y Axios

> **Requisito:** haber completado los Módulos 1 a 6. Este módulo asume que ya manejas funciones, closures, arrays, objetos, clases, promesas, `async`/`await`, el DOM, eventos y `localStorage`.
>
> **Entorno:** Node.js 26 (probado con v26.13.1) y un navegador moderno. Todos los ejemplos indican dónde se ejecutan.

Hasta ahora todo tu código vivía en un archivo. En el Módulo 6 aprendiste a organizarlo con funciones, closures y el patrón módulo. Eso funciona hasta que el archivo pasa de 500 líneas, dos personas lo editan a la vez o necesitas reutilizar una parte en otra página.

Este módulo resuelve tres problemas que aparecen exactamente en ese momento:

1. **Cómo dividir el código en archivos** que se importan entre sí sin contaminar el ámbito global (módulos ES).
2. **Cómo escribir lógica predecible** que no mute datos por sorpresa (programación funcional).
3. **Cómo hablar con un servidor** y qué hacer cuando algo falla (errores, HTTP, `fetch`, Axios).

Y tres herramientas transversales que usarás en cada proyecto real: **JSON** para intercambiar datos, **expresiones regulares** para buscar y validar texto, e **`Intl`** para mostrar números y fechas correctamente.

---

## 🎯 Qué vas a saber al terminar

- Dividir una aplicación en módulos con `export` e `import`, y entender por qué el navegador exige `type="module"`.
- Escribir funciones puras, componerlas con `pipe` y `compose`, y evitar la mutación accidental.
- Diseñar una jerarquía de errores propia, propagarlos y decidir entre `throw` y un valor de resultado.
- Hacer peticiones HTTP con `fetch`, leer la respuesta correctamente y distinguir un error de red de un `404`.
- Cancelar peticiones con `AbortController`, poner timeouts y reintentar con espera creciente.
- Usar Axios y saber cuándo conviene frente a `fetch`.
- Serializar y validar JSON sin perder datos ni abrir agujeros de seguridad.
- Escribir expresiones regulares legibles y reconocer cuándo **no** debes usarlas.
- Formatear monedas, fechas, listas y plurales con `Intl` sin reinventarlo.
- Integrar todo en una arquitectura por capas: cliente HTTP → servicio → estado → render.

---

## 📋 Índice del módulo

- [7.1 — Módulos ES](#71--módulos-es)
- [7.2 — Programación funcional](#72--programación-funcional)
- [7.3 — Errores a fondo](#73--errores-a-fondo)
- [7.4 — HTTP y `fetch`](#74--http-y-fetch)
- [7.5 — `fetch` en producción y Axios](#75--fetch-en-producción-y-axios)
- [7.6 — JSON a fondo](#76--json-a-fondo)
- [7.7 — Expresiones regulares](#77--expresiones-regulares)
- [7.8 — `Intl`, fechas y números](#78--intl-fechas-y-números)
- [7.9 — Arquitectura de una app con datos remotos](#79--arquitectura-de-una-app-con-datos-remotos)
- [7.10 — Retos con solución explicada](#710--retos-con-solución-explicada)
- [7.11 — Errores, glosario y autoevaluación](#711--errores-glosario-y-autoevaluación)

---

## Convención pedagógica

Igual que en los módulos anteriores:

| Icono | Significado |
|---|---|
| 📄 | Nombre del archivo del ejemplo. Cada bloque es un archivo distinto |
| ✅ | Forma recomendada |
| ❌ | Antipatrón, con la razón del fallo |
| 🧠 | Regla mental para recordar |
| ⚠️ | Trampa frecuente |
| 📌 | Vista previa de un módulo posterior |
| 🔬 | Detalle técnico opcional, no necesario para seguir |

**Regla de oro:** todo lo que aparece aquí se explica antes de usarse. Si algo pertenece al Módulo 8, está marcado con 📌 y **nunca** es necesario para resolver un reto.

### Cómo ejecutar los ejemplos

Los módulos ES son archivos. Node decide cómo interpretarlos por la extensión:

| Extensión | Node lo trata como | Uso en este módulo |
|---|---|---|
| `.mjs` | Módulo ES, siempre | Ejemplos de Node |
| `.js` | CommonJS, salvo que un `package.json` diga otra cosa | Ejemplos de navegador |
| `.cjs` | CommonJS, siempre | Vista previa del Módulo 8 |

```bash
node app.mjs
```

En el navegador, el archivo debe cargarse con `type="module"` y **servirse por HTTP**:

```html
<script type="module" src="./app.js"></script>
```

> ⚠️ Abrir un HTML con `file://` y módulos falla por CORS. Necesitas un servidor local. En el Módulo 6 ya usaste Live Server; sirve igual aquí. `python3 -m http.server` también funciona, pero debes usar la extensión `.js` para los módulos del navegador: ese servidor no siempre envía `text/javascript` para `.mjs`, y el navegador rechaza el módulo por tipo MIME incorrecto.

---

## 7.1 — Módulos ES

### 7.1.1 El problema de los scripts globales

Antes de 2015, JavaScript no tenía módulos en el lenguaje. Se cargaban varios archivos con etiquetas `<script>` y todos compartían **el mismo ámbito global**.

```html
<!-- ❌ Orden frágil y ámbito compartido -->
<script src="utilidades.js"></script>
<script src="contador.js"></script>
<script src="app.js"></script>
```

```js
// 📄 utilidades.js
var total = 0;

function sumar(n) {
  total += n;
  return total;
}
```

```js
// 📄 app.js
var total = "otro valor"; // pisa la variable del archivo anterior, sin avisar
console.log(sumar(5)); // NaN
```

Tres problemas en nueve líneas:

1. **Colisión de nombres.** `var total` en `app.js` sobrescribe `var total` de `utilidades.js`. Nadie avisa.
2. **Dependencia de orden.** Si `app.js` se carga antes que `utilidades.js`, `sumar` no existe y obtienes `TypeError: sumar is not a function`.
3. **Dependencias invisibles.** Leyendo `app.js` no sabes qué necesita. Solo lo descubres cuando falla.

La solución de la época fue el **IIFE** (Immediately Invoked Function Expression), que ya conoces del Módulo 6:

```js
// ✅ IIFE: ámbito privado, se expone solo lo necesario
const utilidades = (function () {
  let total = 0;

  function sumar(n) {
    total += n;
    return total;
  }

  return { sumar };
})();

console.log(utilidades.sumar(5)); // 5
```

El IIFE resuelve la colisión, pero **no** resuelve las dependencias: sigues dependiendo del orden de los `<script>`, sigues cargando todo siempre y no hay forma de que una herramienta sepa qué usa qué.

Los módulos ES resuelven las tres cosas a la vez:

```js
// 📄 app.js (módulo)
import { sumar } from "./utilidades.js"; // dependencia declarada y explícita

console.log(sumar(5)); // 5
```

El `import` dice **qué** necesitas y **de dónde**. El navegador (o Node) carga ese archivo antes de ejecutar `app.js`, sin que tú ordenes las etiquetas.

> 🧠 **Regla:** si un archivo necesita algo de otro, lo declara con `import`. Las dependencias dejan de ser implícitas y pasan a ser parte del código.

**Cronología mínima:**

| Año | Hito |
|---|---|
| 2009 | CommonJS: `require`/`module.exports` en Node |
| 2010 | AMD: módulos asíncronos para navegador (RequireJS) |
| 2011 | UMD: formato que servía para ambos mundos |
| 2015 | ES2015 estandariza `import`/`export` |
| 2017–2018 | Los navegadores implementan módulos nativos |
| 2019–2020 | Node estabiliza ESM (`--experimental-modules` → estable) |

### 7.1.2 Un módulo es un archivo con su propio ámbito

Un módulo ES no es una sintaxis decorativa: cambia las reglas del archivo.

```js
// 📄 contador.mjs
let total = 0;

export function sumar(n) {
  total += n;
  return total;
}

export function leer() {
  return total;
}
```

```js
// 📄 app.mjs
import { sumar, leer } from "./contador.mjs";

console.log(sumar(5)); // 5
console.log(leer()); // 5
```

`total` **no** existe en `app.mjs`. No es global. Es privado del módulo. Solo lo que lleva `export` cruza la frontera.

Propiedades que todo módulo ES cumple:

| Propiedad | Qué significa |
|---|---|
| **Ámbito propio** | Las variables del módulo no son globales |
| **Modo estricto automático** | No hace falta `"use strict"`; siempre es estricto |
| **`this` es `undefined`** en el nivel superior | No hay objeto global implícito |
| **Se evalúa una sola vez** | Aunque diez archivos lo importen, se ejecuta una vez |
| **Enlaces vivos** | Lo importado refleja el valor actual del exportado |
| **Estático** | `import`/`export` se analizan antes de ejecutar |
| **Diferido en el navegador** | El HTML termina de parsearse antes de ejecutarse |

Comprobemos el modo estricto y el `this`:

```js
// 📄 estricto.mjs
console.log(this); // undefined

try {
  accidental = 1; // sin declarar
} catch (error) {
  console.log(error.name); // ReferenceError
}
```

En un script clásico, `accidental = 1` habría creado una variable global silenciosamente. En un módulo lanza `ReferenceError`. Esa es una de las mejores razones para usar módulos: los errores aparecen en vez de esconderse.

**Se evalúa una sola vez:**

```js
// 📄 config.mjs
console.log("config.mjs se evaluó");
export const VERSION = "1.0.0";
```

```js
// 📄 a.mjs
import { VERSION } from "./config.mjs";
console.log("a.mjs", VERSION);
```

```js
// 📄 b.mjs
import { VERSION } from "./config.mjs";
console.log("b.mjs", VERSION);
```

```js
// 📄 principal.mjs
import "./a.mjs";
import "./b.mjs";
```

Salida:

```text
config.mjs se evaluó
a.mjs 1.0.0
b.mjs 1.0.0
```

`config.mjs se evaluó` aparece **una vez**, no dos. El módulo se cachea por su URL resuelta. Esa caché es lo que permite que un módulo mantenga estado compartido de forma controlada (lo verás en 7.1.12).

**Enlaces vivos:**

```js
// 📄 reloj.mjs
export let segundos = 0;

export function tick() {
  segundos += 1;
}
```

```js
// 📄 ver.mjs
import { segundos, tick } from "./reloj.mjs";

console.log(segundos); // 0
tick();
console.log(segundos); // 1

// segundos = 10; // ❌ TypeError: Assignment to constant variable.
```

Lo importado **no es una copia**. Es una referencia viva al binding del módulo original. Por eso `segundos` cambia cuando `tick()` lo modifica. Pero el importador no puede reasignarlo: solo el módulo dueño puede.

> 🧠 **Regla:** importas una **vista** del valor, no una copia. Puedes leer el valor actual, no escribir el original.

Esto sorprende a quien viene de CommonJS, donde `require` devuelve una copia del valor en el momento de la importación.

### 7.1.3 `export` con nombre

Hay dos formas de exportar con nombre: marcar la declaración o agrupar al final.

```js
// 📄 matematicas.mjs
export const PI = 3.14159;

export function areaCirculo(radio) {
  return PI * radio ** 2;
}

export function perimetroCirculo(radio) {
  return 2 * PI * radio;
}
```

```js
// 📄 texto.mjs
function limpiar(s) {
  return s.trim();
}

function gritar(s) {
  return s.toUpperCase();
}

// Exportación agrupada al final
export { limpiar, gritar };

// Renombrar al exportar
export { limpiar as normalizar };
```

Las dos formas son equivalentes. La agrupada tiene dos ventajas:

- Deja claro de un vistazo **qué es público** del módulo.
- Permite exportar funciones declaradas arriba sin tocar su definición.

Renombrar al exportar sirve para dar un nombre más claro fuera que dentro:

```js
// 📄 api.mjs
function _fetchInterno(url) {
  return `datos de ${url}`;
}

export { _fetchInterno as obtenerDatos };
```

```js
// 📄 uso.mjs
import { obtenerDatos } from "./api.mjs";
console.log(obtenerDatos("/usuarios")); // "datos de /usuarios"
```

**Un módulo puede exportar tantos nombres como quiera.** No hay límite. Lo que **no** puede es tener dos exports con el mismo nombre:

```js
// ❌ SyntaxError: Duplicate export of 'sumar'
export function sumar() {}

// export function sumar() {} // el mismo nombre otra vez: SyntaxError
```

**Se puede exportar casi cualquier declaración:** `const`, `let`, `var`, `function`, `class`, y también expresiones ya asignadas:

```js
// 📄 constantes.mjs
const IVA = 0.21;
const NOMBRE_APP = "Tienda";

export { IVA, NOMBRE_APP };
export const MONEDA = "EUR";
```

**Lo que no se puede exportar directamente:** una variable sin declarar, o un valor literal suelto.

```js
// ❌ SyntaxError: Unexpected token 'export'
// export 42;
// export "hola";
```

Para exportar un valor literal hay que darle un nombre:

```js
// ✅
const RESPUESTA = 42;
export { RESPUESTA };
```

**Los exports son estáticos.** El nombre se decide al analizar el archivo, no en tiempo de ejecución. Esto es lo que permite a las herramientas saber qué se usa y qué no (tree shaking, 📌 Módulo 8).

```js
// ❌ No se puede exportar un nombre calculado en tiempo de ejecución
const nombre = "sumar";
// export { [nombre]: function () {} }; // SyntaxError
```

### 7.1.4 `export default`

`export default` exporta **un** valor principal. No tiene nombre obligatorio: el importador elige el nombre local.

```js
// 📄 formateador.mjs
export default function formatearPrecio(valor) {
  return `${valor.toFixed(2)} €`;
}
```

```js
// 📄 app.mjs
import formatearPrecio from "./formateador.mjs";
import loQueSea from "./formateador.mjs"; // el mismo módulo, otro nombre local

console.log(formatearPrecio(19.9)); // "19.90 €"
console.log(loQueSea(19.9)); // "19.90 €"
```

`export default` es azúcar para `export { algo as default }`. Por eso el nombre del importador es libre: el nombre real del export es `default`.

Se puede combinar con exports nombrados:

```js
// 📄 cliente.mjs
export default function crearCliente(baseUrl) {
  return {
    baseUrl,
    estado: "inactivo",
  };
}

export const VERSION = "2.0.0";
export function ayuda() {
  return "Usa crearCliente(baseUrl)";
}
```

```js
// 📄 uso.mjs
import crearCliente, { VERSION, ayuda } from "./cliente.mjs";

console.log(crearCliente("/api").baseUrl); // "/api"
console.log(VERSION); // "2.0.0"
console.log(ayuda());
```

**¿Default o nombrado?** La comunidad se inclina por **nombrados** en código de aplicación:

| Criterio | Nombrado | Default |
|---|---|---|
| Autocompletado | El editor sabe el nombre real | El editor adivina |
| Renombrar | Refactor automático seguro | Puede romperse en silencio |
| Buscar usos | Encuentra `import { sumar }` | Cada archivo lo llama distinto |
| Varios exports | Natural | Necesita mezclar con nombrados |
| Archivo con “una cosa” | Correcto | Correcto y más corto |

> 🧠 **Regla práctica:** default para el archivo que exporta **una sola cosa evidente** (un componente, una clase principal). Nombrados para todo lo demás. En un proyecto grande, los nombrados ahorran horas de búsqueda.

⚠️ **Trampa:** un default anónimo pierde su nombre en las trazas de error.

```js
// ❌ En la pila verás "(anonymous)"
export default function () {
  throw new Error("algo falló");
}
```

```js
// ✅ El nombre aparece en la pila
export default function procesarPago() {
  throw new Error("algo falló");
}
```

⚠️ **Trampa peor:** importar el default con el nombre equivocado no da error.

```js
// 📄 usuario.mjs
export default function validarUsuario() {}

// 📄 app.mjs
import validarPedido from "./usuario.mjs"; // nombre incorrecto, sin aviso
validarPedido(); // funciona, pero el código miente
```

Con un export nombrado, ese error es imposible: el nombre debe coincidir.

### 7.1.5 `import`

Formas de importar:

```js
// 📄 formas.mjs
import { sumar, restar } from "./matematicas.mjs";        // nombrados
import { sumar as add } from "./matematicas.mjs";          // renombrado
import * as mat from "./matematicas.mjs";                  // espacio de nombres
import formatear from "./formateador.mjs";                 // default
import crearCliente, { VERSION } from "./cliente.mjs";     // default + nombrados
import "./efectos.mjs";                                    // solo por efecto secundario
```

**Espacio de nombres:** agrupa todo bajo un objeto.

```js
// 📄 espacio.mjs
import * as mat from "./matematicas.mjs";

console.log(mat.PI); // 3.14159
console.log(mat.areaCirculo(2)); // 12.56636
```

Un namespace es útil cuando importas muchas cosas o cuando el nombre del módulo ya da contexto. No es un objeto normal: es un objeto de módulo, con propiedades de solo lectura.

```js
// ❌ TypeError: Cannot assign to read only property
mat.PI = 3;
```

**Import solo por efecto secundario:** ejecuta el módulo sin traer nombres. Se usa para polyfills, hojas de estilo en JS o registros.

```js
// 📄 registro.mjs
console.log("Módulo de registro cargado");
```

```js
// 📄 app.mjs
import "./registro.mjs"; // se ejecuta, no importa nada
```

**Reglas estrictas de `import`:**

1. **Solo en el nivel superior del módulo.** No dentro de funciones, `if` o `try`.
2. **Se hoistea.** Se ejecuta antes que el resto del archivo, aunque esté escrito al final.
3. **Es estático.** El especificador (`"./x.mjs"`) debe ser un string literal.

```js
// ❌ SyntaxError: 'import' and 'export' may only appear at the top level
if (entorno === "produccion") {
  // import { logger } from "./logger.mjs";
}
```

Para cargar condicionalmente existe `import()` (7.1.8).

```js
// ❌ SyntaxError: import specifier must be a string literal
const ruta = "./matematicas.mjs";
// import { sumar } from ruta;
```

**Hoisting en la práctica:**

```js
// 📄 orden.mjs
console.log("primera línea del archivo");

import { VERSION } from "./config.mjs";

console.log("VERSION:", VERSION);
```

Salida:

```text
config.mjs se evaluó
primera línea del archivo
VERSION: 1.0.0
```

Aunque el `import` esté en la línea 3, `config.mjs` se evalúa **antes** de la línea 1. Las dependencias se resuelven primero, siempre. Esto permite usar una importación antes de la línea donde está escrita:

```js
// 📄 valido.mjs
console.log(sumar(1, 2)); // 3 — funciona aunque el import esté abajo

import { sumar } from "./matematicas.mjs";
```

Es válido, pero se considera mala práctica: oculta de dónde viene cada cosa. Mantén los `import` al principio.

### 7.1.6 Rutas, extensiones y resolución

Un módulo se identifica por una **URL**. Todo lo demás son atajos que el entorno resuelve.

```js
// 📄 rutas.mjs
import { a } from "./hermano.mjs";              // mismo directorio
import { b } from "../padre.mjs";               // un nivel arriba
import { c } from "/compartido/util.mjs";       // raíz del servidor
import { d } from "https://cdn.example.com/x.mjs"; // URL absoluta
import _ from "lodash";                          // bare specifier
```

| Tipo | Ejemplo | Quién lo resuelve |
|---|---|---|
| Relativa | `./x.mjs`, `../y.mjs` | El propio entorno, contra la URL del módulo actual |
| Absoluta de servidor | `/x.mjs` | El navegador, contra el origen |
| URL completa | `https://...` | El navegador |
| Bare | `"lodash"`, `"node:fs"` | Node (`node_modules`, prefijos) o un *import map* en el navegador |

**La extensión es obligatoria.** A diferencia de `require`, ESM no prueba `.js`, `.json` ni `index.js`.

```js
// ❌ ERR_MODULE_NOT_FOUND en Node, 404 en el navegador
// import { sumar } from "./matematicas";

// ✅
import { sumar } from "./matematicas.mjs";
```

**Un directorio no se resuelve a su `index`.**

```js
// ❌ No busca ./utils/index.mjs
// import { formatear } from "./utils";

// ✅
import { formatear } from "./utils/index.mjs";
```

¿Por qué tan estricto? Porque un módulo es una URL. El navegador hace una petición HTTP por URL; no puede “adivinar” variantes sin pedir varias veces. La regla única y predecible es más barata y más segura.

**Bare specifiers en el navegador:** `import _ from "lodash"` falla, porque el navegador no sabe qué es `lodash`. Necesita un **import map** (📌 se configura en el HTML y lo verás con detalle en el Módulo 8):

```html
<!-- 📌 Vista previa: import map -->
<script type="importmap">
  {
    "imports": {
      "lodash": "https://cdn.example.com/lodash-es.js"
    }
  }
</script>
```

**`import.meta`:** metadatos del módulo actual.

```js
// 📄 meta.mjs
console.log(import.meta.url);
// file:///home/ana/proyecto/meta.mjs en Node
// https://miweb.com/js/meta.js en el navegador
```

`import.meta` solo existe en módulos. En un script clásico es un error de sintaxis. Lo usarás para construir rutas relativas al archivo:

```js
// 📄 recursos.mjs
const base = new URL("./datos/", import.meta.url);
console.log(base.href); // .../datos/
```

> 🔬 `new URL(ruta, base)` construye una URL absoluta resolviendo `ruta` contra `base`. Lo verás a fondo en 7.4.

### 7.1.7 `type="module"` en el navegador

Para que el navegador trate un archivo como módulo, la etiqueta debe declararlo:

```html
<script type="module" src="./app.js"></script>
```

Eso activa todas las reglas anteriores **y** tres comportamientos extra:

| Comportamiento | Detalle |
|---|---|
| **Diferido por defecto** | El HTML se parsea completo antes de ejecutar el módulo. Equivale a `defer` |
| **Ámbito propio** | Las variables no van a `window` |
| **CORS obligatorio** | El módulo se pide con credenciales de origen; `file://` no cumple |
| **MIME correcto** | El servidor debe responder `text/javascript` |
| **Se ejecuta una vez** | Si incluyes el mismo `src` dos veces, se evalúa una sola vez |

**El error de `file://`:**

```text
Access to script at 'file:///.../app.js' from origin 'null'
has been blocked by CORS policy
```

No es un bug del navegador: los módulos usan `fetch` internamente, y `fetch` no permite `file://`. Solución: servir por HTTP.

**El error de MIME:**

```text
Failed to load module script: Expected a JavaScript module script
but the server responded with a MIME type of "text/plain"
```

El servidor envió el archivo como texto plano. Configura el servidor o usa la extensión que ya asocie a JavaScript.

**Orden de ejecución:** los módulos se ejecutan después de parsear el HTML, en orden de dependencias, no en orden de etiquetas.

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <title>Módulos</title>
    <script type="module" src="./app.js"></script>
  </head>
  <body>
    <h1 id="titulo">Cargando…</h1>
  </body>
</html>
```

```js
// 📄 app.js
const titulo = document.querySelector("#titulo");
titulo.textContent = "Cargado desde un módulo";
```

El módulo puede buscar `#titulo` sin esperar a `DOMContentLoaded`, porque ya se ejecutó después del parseo. Es la misma garantía que `defer` (Módulo 6), pero automática.

> ⚠️ Si necesitas ejecutar antes del parseo (raro y peligroso), existe `async` en la etiqueta. No lo uses para lógica que toca el DOM.

### 7.1.8 `import()` dinámico

La importación estática ocurre siempre. La dinámica ocurre cuando tú decides, y devuelve una **promesa** (Módulo 5).

```js
// 📄 app.mjs
async function cargarGraficos() {
  try {
    const modulo = await import("./graficos.mjs");
    modulo.dibujar();
  } catch (error) {
    console.error("No se pudo cargar el módulo de gráficos", error);
  }
}

cargarGraficos();
```

```js
// 📄 graficos.mjs
export function dibujar() {
  console.log("Dibujando…");
}
```

Casos de uso reales:

| Caso | Por qué dinámico |
|---|---|
| Editor de texto que solo algunos usuarios abren | No cargues 300 KB para todos |
| Funcionalidad según el plan del usuario | Carga condicional |
| Polyfill según el navegador | Solo si hace falta |
| Módulo que falla al importarse | Puedes capturar el error |
| Código que depende de un valor en tiempo de ejecución | La ruta se calcula |

**Carga condicional:**

```js
// 📄 panel.mjs
const usuario = { plan: "premium" };

async function abrirInformes() {
  if (usuario.plan !== "premium") {
    console.log("Los informes son solo para premium");
    return;
  }

  const { generarInforme } = await import("./informes.mjs");
  generarInforme();
}

abrirInformes();
```

**Diferencia clave:**

```js
// Estático: el archivo se descarga siempre, antes de ejecutar nada
import { a } from "./a.mjs";

// Dinámico: el archivo se descarga cuando esta línea se ejecuta
const modulo = await import("./a.mjs");
console.log(modulo.a);
```

⚠️ El `import()` dinámico devuelve un **objeto de módulo**, no el default directamente:

```js
// 📄 saludo.mjs
export default function saludar() {
  return "hola";
}

// 📄 uso.mjs
const modulo = await import("./saludo.mjs");
console.log(typeof modulo.default); // "function"
console.log(modulo.default()); // "hola"
```

### 7.1.9 Top-level `await`

En un módulo puedes usar `await` en el nivel superior, sin función `async`.

```js
// 📄 arranque.mjs
const datos = await new Promise((resolve) => {
  setTimeout(() => resolve({ ok: true, items: [1, 2, 3] }), 100);
});

console.log(datos.ok); // true
console.log(datos.items.length); // 3
```

Esto **retrasa la evaluación** del módulo y de todos los que lo importen. Es útil en el punto de entrada:

```js
// 📄 main.mjs
const config = await cargarConfig();

iniciarApp(config);

async function cargarConfig() {
  // simulación de lectura remota
  return { idioma: "es", tema: "claro" };
}

function iniciarApp(config) {
  console.log("Iniciando con", config.idioma);
}
```

⚠️ **No lo uses en bibliotecas.** Si un módulo de utilidades hace `await` en el nivel superior, cualquiera que lo importe hereda la espera, incluso si no necesita esos datos. Mantén las esperas en funciones `async` y deja el top-level `await` para el arranque.

⚠️ En el navegador, top-level `await` funciona en módulos, pero bloquea la ejecución de los módulos que dependen de él. Si el `await` nunca resuelve, la app no arranca.

### 7.1.10 Dependencias circulares

Dos módulos que se importan mutuamente forman un ciclo.

```js
// 📄 a.mjs
import { saludarDesdeB } from "./b.mjs";

export const nombre = "A";

export function saludarDesdeA() {
  return "Hola desde A";
}

console.log(saludarDesdeB());
```

```js
// 📄 b.mjs
import { nombre, saludarDesdeA } from "./a.mjs";

export function saludarDesdeB() {
  return `Hola desde B, que ve a ${nombre}`;
}
```

Al ejecutar `a.mjs`:

```text
ReferenceError: Cannot access 'nombre' before initialization
```

**Por qué falla:** `a.mjs` empieza a evaluarse, encuentra el `import` de `b.mjs`, y `b.mjs` importa `nombre` de `a.mjs`. Pero `a.mjs` todavía no ejecutó `export const nombre = "A"`. El binding existe, pero está en la **zona muerta temporal** (TDZ, Módulo 2). Acceder a él lanza `ReferenceError`.

**Cómo detectarlo:** el error menciona un identificador que sí está exportado. Si lo ves, sospecha de un ciclo.

**Soluciones, de mejor a peor:**

1. **Extrae lo compartido a un tercer módulo.**

```js
// 📄 compartido.mjs
export const nombre = "A";
```

```js
// 📄 a.mjs
import { nombre } from "./compartido.mjs";
import { saludarDesdeB } from "./b.mjs";

export function saludarDesdeA() {
  return "Hola desde A";
}

console.log(nombre, saludarDesdeB());
```

```js
// 📄 b.mjs
import { nombre } from "./compartido.mjs";

export function saludarDesdeB() {
  return `Hola desde B, que ve a ${nombre}`;
}
```

2. **Rompe el ciclo con `import()` dinámico**, que se ejecuta después.

```js
// 📄 a.mjs
export const nombre = "A";

export async function saludarDesdeA() {
  const { saludarDesdeB } = await import("./b.mjs");
  return saludarDesdeB();
}
```

3. **Invierte la dependencia:** pasa el dato como argumento en lugar de importarlo.

```js
// 📄 b.mjs
export function saludarDesdeB(nombre) {
  return `Hola desde B, que ve a ${nombre}`;
}
```

La tercera es la más limpia: si `b` necesita un dato de `a`, no lo importes; recíbelo. Un módulo que recibe lo que necesita es más fácil de probar.

> 🧠 **Regla:** un ciclo casi siempre indica que dos módulos deberían depender de un tercero, o que uno debería recibir datos en vez de importarlos.

### 7.1.11 Re-exportar y archivos barril

Un módulo puede re-exportar lo de otro sin importarlo localmente.

```js
// 📄 utils/index.mjs
export { formatearPrecio } from "./precio.mjs";
export { formatearFecha } from "./fecha.mjs";
export { validarEmail } from "./validacion.mjs";
export * from "./texto.mjs";
```

```js
// 📄 app.mjs
import { formatearPrecio, formatearFecha } from "./utils/index.mjs";
```

Esto se llama **archivo barril** (barrel file). Ventaja: una sola ruta de importación para un grupo de utilidades.

⚠️ **Coste:** el barril obliga a cargar y evaluar todos los módulos que re-exporta, aunque solo uses uno. En proyectos grandes puede romper el tree shaking y crear ciclos invisibles.

```js
// ❌ Barril gigante: importar una función arrastra todo el paquete
export * from "./graficos.mjs";
export * from "./editor.mjs";
export * from "./informes.mjs";
```

```js
// ✅ Importa el archivo concreto cuando el paquete es grande
import { formatearPrecio } from "./utils/precio.mjs";
```

**Regla práctica:** barril para grupos pequeños y estables (un puñado de utilidades). Importaciones directas para módulos grandes o con efectos secundarios.

**Re-export con renombrado:**

```js
// 📄 publico.mjs
export { validarEmail as esEmailValido } from "./validacion.mjs";
```

**Re-export de todo:**

```js
// 📄 todo.mjs
export * from "./matematicas.mjs";
```

`export *` **no** re-exporta el default. Para eso:

```js
// 📄 conDefault.mjs
export { default } from "./formateador.mjs";
export { default as formatearPrecio } from "./formateador.mjs";
```

### 7.1.12 Patrón módulo: estado privado y API mínima

Un módulo ES ya es un ámbito privado. No necesitas IIFE para encapsular.

```js
// 📄 carrito.mjs
const items = []; // privado: no se exporta

export function agregar(producto) {
  items.push(producto);
  return items.length;
}

export function total() {
  return items.reduce((suma, p) => suma + p.precio, 0);
}

export function listar() {
  return items.map((p) => ({ ...p })); // copia defensiva
}
```

```js
// 📄 app.mjs
import { agregar, total, listar } from "./carrito.mjs";

agregar({ nombre: "Camisa", precio: 20 });
agregar({ nombre: "Gorra", precio: 12.5 });

console.log(total()); // 32.5
console.log(listar().length); // 2
```

Nadie puede hacer `items.push(...)` desde fuera: `items` no está exportado. La única puerta es la API pública.

**Copia defensiva:** `listar()` devuelve copias, no los objetos originales.

```js
// ❌ Sin copia, el exterior puede mutar el estado interno
function listarSinCopia() {
  return items;
}

// ✅ Con copia, el estado queda protegido
function listarConCopia() {
  return items.map((p) => ({ ...p }));
}
```

Sin la copia:

```js
const lista = listar();
lista[0].precio = 0; // muta el objeto interno del módulo
```

Ese es exactamente el tipo de bug que la programación funcional del 7.2 previene por diseño.

**Módulo con estado compartido:** como el módulo se evalúa una vez, su estado es único para toda la aplicación.

```js
// 📄 sesion.mjs
let usuario = null;

export function iniciarSesion(datos) {
  usuario = datos;
}

export function cerrarSesion() {
  usuario = null;
}

export function usuarioActual() {
  return usuario;
}
```

```js
// 📄 a.mjs
import { iniciarSesion, usuarioActual } from "./sesion.mjs";

iniciarSesion({ nombre: "Ana" });
console.log(usuarioActual().nombre); // "Ana"
```

```js
// 📄 b.mjs
import { usuarioActual } from "./sesion.mjs";

console.log(usuarioActual().nombre); // "Ana" — mismo estado
```

Esto es un **singleton** de facto. Es cómodo y peligroso: el estado global complica las pruebas. Úsalo para cosas realmente globales (sesión, tema, configuración) y prefiere pasar dependencias cuando puedas.

### 7.1.13 CommonJS frente a ESM (vista previa del Módulo 8)

Node tuvo módulos antes que el lenguaje. Ese sistema se llama **CommonJS**.

```js
// 📄 suma.cjs — CommonJS
const IVA = 0.21;

function conIva(precio) {
  return precio * (1 + IVA);
}

module.exports = { conIva };
```

```js
// 📄 app.cjs — CommonJS
const { conIva } = require("./suma.cjs");

console.log(conIva(100)); // 121
```

| Aspecto | CommonJS | ESM |
|---|---|---|
| Palabras | `require`, `module.exports` | `import`, `export` |
| Cuándo carga | Al ejecutar la línea | Antes de ejecutar, estático |
| ¿Condicional? | Sí | No (usa `import()`) |
| Enlaces | Copia del valor | Vivos |
| `this` arriba | `module.exports` | `undefined` |
| Navegador | No nativo | Nativo |
| Top-level await | No | Sí |
| Extensión en Node | `.cjs` o `.js` por defecto | `.mjs` o `.js` con `"type": "module"` |

📌 `"type": "module"` en `package.json`, `require` de ESM, `__dirname` y la interoperabilidad son temas del Módulo 8. Por ahora quédate con: **`.mjs` es módulo ES, `.cjs` es CommonJS, y en el navegador siempre ESM.**

### ✅ Haz esto / ❌ Evita esto (7.1)

```js
// ✅ Una responsabilidad por módulo
// 📄 precio.mjs
export const IVA = 0.21;

export function conIva(precio) {
  return precio * (1 + IVA);
}

// ✅ Importa solo lo que usas (en otro archivo)
// import { conIva } from "./precio.mjs";

// ✅ Nombres de archivo en minúsculas y descriptivos
// carrito.mjs, validacion-email.mjs

// ✅ Extensiones explícitas (en otro archivo)
// import { formatear } from "./utils/formato.mjs";
```

```js
// ❌ Un archivo de 3.000 líneas con 40 exports
// app.mjs

// ❌ Dependencias circulares
// a.mjs importa b.mjs y b.mjs importa a.mjs

// ❌ Estado global mutable escondido en un módulo
let cache = {};
export function limpiar() {
  cache = {};
}

// ❌ Importar dentro de una función con sintaxis estática
function cargar() {
  // import { x } from "./x.mjs"; // SyntaxError
}

// ❌ Confiar en la extensión implícita
// import { x } from "./x"; // falla en ESM
```

> 🧠 **Regla final de 7.1:** un módulo es un archivo con una responsabilidad, una API pública pequeña y dependencias declaradas arriba. Si puedes borrar el archivo y saber qué se rompe mirando solo los `import`, lo estás haciendo bien.

---

## 7.2 — Programación funcional

La **programación funcional** (PF) es un estilo donde construyes el programa combinando **funciones puras** y evitando el estado mutable compartido. No es una librería ni una moda: es un conjunto de restricciones que hacen el código más fácil de leer, probar y razonar.

JavaScript no es un lenguaje funcional puro como Haskell. Es **multiparadigma**: permite objetos, clases, mutación y efectos. Eso significa que la PF en JS es una decisión de diseño, no una imposición. Justamente por eso conviene entender qué ganas y qué cuesta.

### 7.2.1 De dónde viene y por qué importa

| Año | Hito |
|---|---|
| 1930s | Cálculo lambda (Alonzo Church): funciones como base de la computación |
| 1958 | Lisp: primer lenguaje funcional |
| 1990 | Haskell: pureza y tipos |
| 2006 | jQuery populariza `map`/`filter` en JS |
| 2009 | ES5 estandariza `map`, `filter`, `reduce`, `forEach` |
| 2015 | Arrow functions, `const`, spread: la PF se vuelve cómoda en JS |
| 2019+ | React con hooks y estados inmutables populariza la PF en la industria |
| 2023 | `toSorted`, `toReversed`, `with`: inmutabilidad nativa en arrays |

La razón práctica es simple: **el código se lee muchas más veces de las que se escribe**, y el 80 % de los bugs difíciles vienen de estado que cambió donde nadie esperaba. La PF reduce esa superficie.

### 7.2.2 Funciones puras

Una función es **pura** si cumple dos condiciones:

1. **Determinista:** con las mismas entradas, siempre devuelve la misma salida.
2. **Sin efectos secundarios:** no modifica nada fuera de sí misma.

```js
// ✅ Pura: solo depende de sus argumentos
function sumar(a, b) {
  return a + b;
}

console.log(sumar(2, 3)); // 5
console.log(sumar(2, 3)); // 5, siempre
```

```js
// ❌ Impura: depende de una variable externa que puede cambiar
let contador = 0;

function siguiente() {
  contador += 1; // efecto secundario: muta el exterior
  return contador;
}

console.log(siguiente()); // 1
console.log(siguiente()); // 2 — misma entrada, distinta salida
```

```js
// ❌ Impura: depende del reloj
function esDeDia() {
  const hora = new Date().getHours();
  return hora >= 6 && hora < 20;
}
```

`esDeDia()` no recibe argumentos y puede devolver `true` o `false` según cuándo se llame. Imposible de testear sin simular el reloj.

```js
// ✅ Pura: la hora entra como argumento
function esDeDia(hora) {
  return hora >= 6 && hora < 20;
}

console.log(esDeDia(10)); // true
console.log(esDeDia(23)); // false
```

**Beneficios concretos:**

| Beneficio | Por qué |
|---|---|
| Testeable | No necesitas preparar el mundo, solo pasar argumentos |
| Cacheable | Misma entrada, misma salida: puedes guardar el resultado (7.2.10) |
| Paralelizable | Sin estado compartido no hay condiciones de carrera |
| Refactorizable | Puedes mover la función sin miedo a romper otra cosa |
| Legible | La firma dice todo lo que la función necesita |

⚠️ **Trampa frecuente:** una función puede parecer pura y no serlo.

```js
// ❌ Parece pura, pero muta el array recibido
function agregarUno(numeros) {
  for (let i = 0; i < numeros.length; i++) {
    numeros[i] += 1;
  }
  return numeros;
}

const original = [1, 2, 3];
const resultado = agregarUno(original);

console.log(original); // [2, 3, 4] — ¡cambió!
console.log(resultado === original); // true — es el mismo array
```

La pureza incluye **no mutar los argumentos**. Si recibes un array u objeto y lo modificas, la función es impura aunque no toque nada más.

```js
// ✅ Pura: crea un array nuevo
function agregarUno(numeros) {
  return numeros.map((n) => n + 1);
}

const original = [1, 2, 3];
const resultado = agregarUno(original);

console.log(original); // [1, 2, 3]
console.log(resultado); // [2, 3, 4]
console.log(resultado === original); // false
```

> 🧠 **Regla:** si tu función necesita `let` para acumular sobre un argumento, probablemente debería devolver una copia nueva.

### 7.2.3 Efectos secundarios: no se eliminan, se confinan

Una aplicación real **necesita** efectos secundarios: pintar el DOM, escribir en `localStorage`, hacer una petición HTTP, mostrar un `console.log`. La PF no dice “no los uses”. Dice: **no los mezcles con la lógica**.

El patrón se llama **núcleo puro, borde impuro**:

```js
// 📄 carrito.mjs — núcleo puro: no toca el DOM ni la red
export function calcularTotal(items) {
  return items.reduce((suma, item) => suma + item.precio * item.cantidad, 0);
}

export function aplicarDescuento(total, porcentaje) {
  return total - total * (porcentaje / 100);
}
```

```js
// 📄 app.mjs — borde impuro: lee el DOM y escribe el resultado
import { calcularTotal, aplicarDescuento } from "./carrito.mjs";

const items = [
  { nombre: "Camisa", precio: 20, cantidad: 2 },
  { nombre: "Gorra", precio: 12.5, cantidad: 1 },
];

const total = calcularTotal(items); // 52.5
const final = aplicarDescuento(total, 10); // 47.25

document.querySelector("#total").textContent = final.toFixed(2); // efecto
```

Ventajas de esta separación:

- `calcularTotal` se prueba en Node sin DOM.
- El cálculo se reutiliza en el servidor, en un PDF, en un test.
- El borde es pequeño y fácil de inspeccionar.

**Tabla de efectos y dónde ponerlos:**

| Efecto | Dónde va |
|---|---|
| Cálculos, validaciones, transformaciones | Núcleo puro |
| `document.*`, `localStorage`, `fetch` | Borde impuro |
| `console.log` de depuración | Borde, y se quita en producción |
| `Math.random()`, `Date.now()` | Se inyectan como argumento para poder testear |

```js
// ❌ Difícil de testear: el azar está dentro
function elegirColor() {
  const colores = ["rojo", "verde", "azul"];
  return colores[Math.floor(Math.random() * colores.length)];
}
```

```js
// ✅ Testeable: el azar entra como número entre 0 y 1
function elegirColor(aleatorio) {
  const colores = ["rojo", "verde", "azul"];
  return colores[Math.floor(aleatorio * colores.length)];
}

console.log(elegirColor(0)); // "rojo"
console.log(elegirColor(0.5)); // "verde"
console.log(elegirColor(0.99)); // "azul"
```

Esto se llama **inyección de dependencias**: en vez de que la función busque lo que necesita, se lo pasas. Lo usarás constantemente con `fetch` en 7.5.

### 7.2.4 Inmutabilidad

**Inmutable** significa que un valor no cambia después de crearse. En JavaScript, `const` **no** hace inmutable un objeto: solo impide reasignar la variable.

```js
const usuario = { nombre: "Ana", edad: 30 };

usuario.edad = 31; // ✅ permitido: muta el objeto
console.log(usuario.edad); // 31

// usuario = {}; // ❌ TypeError: Assignment to constant variable
```

`const` protege **la referencia**, no el contenido. Para el contenido existe `Object.freeze`.

```js
const usuario = Object.freeze({ nombre: "Ana", edad: 30 });

usuario.edad = 31; // falla silenciosamente en modo no estricto
console.log(usuario.edad); // 30

// En un módulo (siempre estricto):
// TypeError: Cannot assign to read only property 'edad'
```

⚠️ **`Object.freeze` es superficial.**

```js
const config = Object.freeze({
  tema: "claro",
  colores: { fondo: "#fff" },
});

config.tema = "oscuro"; // bloqueado
config.colores.fondo = "#000"; // ✅ permitido: el objeto anidado no está congelado

console.log(config.colores.fondo); // "#000"
```

Para congelar en profundidad haría falta recorrer el árbol. Es una operación cara y rara vez necesaria si trabajas con copias.

**Copias superficiales** (un nivel):

```js
const original = { nombre: "Ana", edad: 30 };

const copia1 = { ...original };            // spread
const copia2 = Object.assign({}, original);
const copia3 = Object.fromEntries(Object.entries(original));

console.log(copia1 === original); // false
console.log(copia1.nombre === original.nombre); // true
```

```js
const numeros = [1, 2, 3];

const copiaA = [...numeros];
const copiaB = numeros.slice();
const copiaC = numeros.map((n) => n);
const copiaD = Array.from(numeros);

console.log(copiaA === numeros); // false
```

**El problema de la copia superficial:**

```js
const original = {
  nombre: "Ana",
  direccion: { ciudad: "Madrid" },
};

const copia = { ...original };
copia.direccion.ciudad = "Barcelona";

console.log(original.direccion.ciudad); // "Barcelona" — ¡también cambió!
```

`copia.direccion` apunta al **mismo objeto** que `original.direccion`. La copia fue solo del primer nivel.

**Copias profundas:**

```js
const original = {
  nombre: "Ana",
  direccion: { ciudad: "Madrid" },
  etiquetas: ["cliente", "vip"],
};

const copia = structuredClone(original);
copia.direccion.ciudad = "Barcelona";
copia.etiquetas.push("nuevo");

console.log(original.direccion.ciudad); // "Madrid"
console.log(original.etiquetas); // ["cliente", "vip"]
```

`structuredClone` es una función global moderna (Node 17+, navegadores actuales). Copia objetos, arrays, `Map`, `Set`, `Date`, `RegExp`, `ArrayBuffer` y maneja referencias circulares.

⚠️ **Lo que `structuredClone` no copia:** funciones, clases con métodos (pierde el prototipo), nodos del DOM, `WeakMap`, `WeakSet`, promesas. Lanza `DataCloneError` si encuentra algo no clonable.

⚠️ **La trampa clásica: `JSON.parse(JSON.stringify(x))`.**

```js
const original = {
  fecha: new Date("2026-01-01"),
  funcion: () => "hola",
  indefinido: undefined,
  numero: NaN,
  mapa: new Map([["a", 1]]),
};

const copia = JSON.parse(JSON.stringify(original));

console.log(copia.fecha); // "2026-01-01T00:00:00.000Z" — string, no Date
console.log(copia.funcion); // undefined — se perdió
console.log("indefinido" in copia); // false — se perdió la clave
console.log(copia.numero); // null — NaN no es JSON válido
console.log(copia.mapa); // {} — Map no es serializable
```

JSON solo entiende objetos, arrays, strings, números finitos, booleanos y `null`. Todo lo demás se transforma o desaparece. Lo verás a fondo en 7.6. Para copiar en memoria usa `structuredClone`.

**Alternativa manual para actualizaciones inmutables:**

```js
const usuario = {
  nombre: "Ana",
  direccion: { ciudad: "Madrid", cp: "28001" },
};

const actualizado = {
  ...usuario,
  direccion: {
    ...usuario.direccion,
    ciudad: "Barcelona",
  },
};

console.log(usuario.direccion.ciudad); // "Madrid"
console.log(actualizado.direccion.ciudad); // "Barcelona"
```

Copias solo la rama que cambia. Es más eficiente que clonar todo y es el patrón que usan React, Redux y las librerías de estado modernas.

> 🧠 **Regla:** copia el camino hasta el valor que cambias, no el árbol entero.

### 7.2.5 Métodos que mutan y métodos que devuelven copia

Esta tabla es la fuente de la mayoría de los bugs de “mi array cambió sin querer”.

| Muta el original | Devuelve nuevo |
|---|---|
| `push`, `pop`, `shift`, `unshift` | `concat`, `slice` |
| `splice` | `toSpliced` (ES2023) |
| `sort` | `toSorted` (ES2023) |
| `reverse` | `toReversed` (ES2023) |
| `fill`, `copyWithin` | `map`, `filter`, `flat`, `flatMap` |
| `arr[i] = x` | `with(i, x)` (ES2023) |

```js
const numeros = [3, 1, 2];

const ordenados = numeros.sort((a, b) => a - b);

console.log(ordenados); // [1, 2, 3]
console.log(numeros); // [1, 2, 3] — ¡mutó el original!
console.log(ordenados === numeros); // true
```

```js
const numeros = [3, 1, 2];

const ordenados = numeros.toSorted((a, b) => a - b);

console.log(ordenados); // [1, 2, 3]
console.log(numeros); // [3, 1, 2]
console.log(ordenados === numeros); // false
```

**`with`:** reemplaza un índice sin mutar.

```js
const tareas = ["comprar", "estudiar", "descansar"];

const actualizadas = tareas.with(1, "repasar módulo 7");

console.log(tareas); // ["comprar", "estudiar", "descansar"]
console.log(actualizadas); // ["comprar", "repasar módulo 7", "descansar"]
```

**`toSpliced`:** como `splice`, pero devuelve copia.

```js
const letras = ["a", "b", "c", "d"];

const sinB = letras.toSpliced(1, 1);
console.log(sinB); // ["a", "c", "d"]
console.log(letras); // ["a", "b", "c", "d"]
```

**`toReversed`:**

```js
const orden = [1, 2, 3];
const inverso = orden.toReversed();

console.log(orden); // [1, 2, 3]
console.log(inverso); // [3, 2, 1]
```

⚠️ **Compatibilidad:** `toSorted`, `toReversed`, `toSpliced` y `with` son ES2023. Node 20+ y navegadores de 2023 en adelante los tienen. Si necesitas navegadores antiguos, usa `[...arr].sort(...)`.

```js
// Equivalente inmutable sin ES2023
const ordenados = [...numeros].sort((a, b) => a - b);
```

### 7.2.6 Funciones de orden superior

Una **función de orden superior** es la que recibe o devuelve otra función. `map`, `filter` y `reduce` lo son. Ya las usas desde el Módulo 3; aquí las verás como base de composición.

**Recordatorio rápido:**

```js
const productos = [
  { nombre: "Camisa", precio: 20, stock: 5 },
  { nombre: "Pantalón", precio: 35, stock: 0 },
  { nombre: "Gorra", precio: 12.5, stock: 8 },
];

const disponibles = productos.filter((p) => p.stock > 0);
const nombres = disponibles.map((p) => p.nombre);
const valorInventario = productos.reduce(
  (total, p) => total + p.precio * p.stock,
  0
);

console.log(nombres); // ["Camisa", "Gorra"]
console.log(valorInventario); // 200
```

**`flatMap`:** mapea y aplana un nivel.

```js
const pedidos = [
  { id: 1, items: ["camisa", "gorra"] },
  { id: 2, items: ["pantalón"] },
];

const todos = pedidos.flatMap((p) => p.items);
console.log(todos); // ["camisa", "gorra", "pantalón"]
```

Sin `flatMap`:

```js
const todos = pedidos.map((p) => p.items).flat();
```

**`some`, `every`, `find`, `findIndex`:**

```js
const edades = [22, 17, 30, 15];

console.log(edades.some((e) => e < 18)); // true
console.log(edades.every((e) => e < 18)); // false
console.log(edades.find((e) => e >= 18)); // 22
console.log(edades.findIndex((e) => e >= 18)); // 0
```

**`sort` con comparador:** sin comparador, ordena como texto.

```js
const numeros = [10, 2, 33, 4];

console.log([...numeros].sort()); // [10, 2, 33, 4] — orden lexicográfico
console.log([...numeros].sort((a, b) => a - b)); // [2, 4, 10, 33]
```

`sort` espera un número negativo, cero o positivo. `a - b` ordena ascendente; `b - a`, descendente.

⚠️ `sort` **no es estable por contrato en el pasado**, aunque desde ES2019 se garantiza estabilidad. Aun así, no dependas de ella si puedes usar un desempate explícito.

**Ordenar objetos:**

```js
const personas = [
  { nombre: "Ana", edad: 30 },
  { nombre: "Luis", edad: 25 },
  { nombre: "Marta", edad: 30 },
];

const ordenadas = personas.toSorted((a, b) => {
  if (a.edad !== b.edad) return a.edad - b.edad;
  return a.nombre.localeCompare(b.nombre);
});

console.log(ordenadas.map((p) => p.nombre)); // ["Luis", "Ana", "Marta"]
```

`localeCompare` compara texto respetando el idioma. Lo verás a fondo con `Intl.Collator` en 7.8.

**`Object.groupBy`** (ES2024): agrupa sin `reduce` manual.

```js
const personas = [
  { nombre: "Ana", rol: "admin" },
  { nombre: "Luis", rol: "user" },
  { nombre: "Marta", rol: "admin" },
];

const porRol = Object.groupBy(personas, (p) => p.rol);

console.log(porRol.admin.map((p) => p.nombre)); // ["Ana", "Marta"]
console.log(porRol.user.map((p) => p.nombre)); // ["Luis"]
```

El resultado es un objeto **sin prototipo**, pensado para evitar colisiones con `__proto__`, `constructor`, etc. Si necesitas claves que no sean strings, existe `Map.groupBy`.

```js
const porEdad = Map.groupBy(
  [
    { nombre: "Ana", edad: 30 },
    { nombre: "Luis", edad: 25 },
  ],
  (p) => p.edad
);

console.log(porEdad.get(30).map((p) => p.nombre)); // ["Ana"]
```

**Pasar funciones como argumento** es lo que permite parametrizar comportamiento:

```js
function aplicarATodos(items, transformar) {
  return items.map(transformar);
}

const nombres = ["ana", "luis"];
console.log(aplicarATodos(nombres, (n) => n.toUpperCase())); // ["ANA", "LUIS"]
console.log(aplicarATodos(nombres, (n) => n.length)); // [3, 4]
```

`aplicarATodos` no sabe qué transformación se aplicará. Recibe la decisión como argumento. Eso es **inversión de control**.

### 7.2.7 Composición: `pipe` y `compose`

Componer es encadenar funciones donde la salida de una es la entrada de la siguiente.

```js
// 📄 texto.mjs
const limpiar = (s) => s.trim();
const minusculas = (s) => s.toLowerCase();
const reemplazarEspacios = (s) => s.replaceAll(" ", "-");
const quitarAcentos = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const slug = (titulo) =>
  quitarAcentos(reemplazarEspacios(minusculas(limpiar(titulo))));

console.log(slug("  Módulo 7: Fetch y Axios  "));
// "modulo-7:-fetch-y-axios"
```

Funciona, pero se lee de dentro hacia fuera y crece hacia la izquierda. Con `pipe` se lee de arriba abajo:

```js
// 📄 pipe.mjs
function pipe(...funciones) {
  return function (valorInicial) {
    return funciones.reduce((valor, funcion) => funcion(valor), valorInicial);
  };
}

const limpiar = (s) => s.trim();
const minusculas = (s) => s.toLowerCase();
const reemplazarEspacios = (s) => s.replaceAll(" ", "-");
const quitarAcentos = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

const slug = pipe(limpiar, minusculas, quitarAcentos, reemplazarEspacios);

console.log(slug("  Módulo 7: Fetch y Axios  "));
// "modulo-7:-fetch-y-axios"
```

**Cómo funciona `pipe`:**

| Paso | Qué ocurre |
|---|---|
| 1 | `pipe` recibe funciones y devuelve una función nueva |
| 2 | Esa función recibe `valorInicial` |
| 3 | `reduce` aplica cada función al valor acumulado |
| 4 | El resultado final es la salida de la última función |

```js
const doble = (n) => n * 2;
const masUno = (n) => n + 1;

const calcular = pipe(doble, masUno);

console.log(calcular(5)); // 11  → 5*2 = 10, luego +1
```

**`compose` es lo mismo en orden inverso:**

```js
function compose(...funciones) {
  return pipe(...funciones.toReversed());
}

const calcular = compose(doble, masUno);
console.log(calcular(5)); // 12 → primero +1, luego *2
```

⚠️ **Confusión clásica:** `pipe(f, g)(x)` es `g(f(x))`, mientras que `compose(f, g)(x)` es `f(g(x))`. Elige una y sé consistente en todo el proyecto. La mayoría de librerías modernas prefieren `pipe`.

**Composición con métodos de array:**

```js
const pedidos = [
  { id: 1, total: 100, estado: "pagado" },
  { id: 2, total: 50, estado: "pendiente" },
  { id: 3, total: 200, estado: "pagado" },
];

const totalPagado = pipe(
  (lista) => lista.filter((p) => p.estado === "pagado"),
  (lista) => lista.map((p) => p.total),
  (totales) => totales.reduce((suma, t) => suma + t, 0)
);

console.log(totalPagado(pedidos)); // 300
```

Cada paso es una función pequeña y testeable. El `pipe` dice el orden. Si algo falla, sabes exactamente en qué etapa mirar.

> 🧠 **Regla:** si una función tiene más de tres pasos de transformación, conviértelos en funciones con nombre y compón. Los nombres documentan el proceso.

### 7.2.8 Currying y aplicación parcial

**Currying** convierte una función de varios argumentos en una cadena de funciones de un argumento.

```js
// Versión normal
function sumar(a, b, c) {
  return a + b + c;
}

// Versión currificada
function sumarCurry(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

console.log(sumar(1, 2, 3)); // 6
console.log(sumarCurry(1)(2)(3)); // 6
```

Con arrow functions se ve más claro:

```js
const sumar = (a) => (b) => (c) => a + b + c;

console.log(sumar(1)(2)(3)); // 6
```

**¿Para qué sirve?** Para crear funciones especializadas reutilizables.

```js
const multiplicar = (factor) => (numero) => numero * factor;

const doble = multiplicar(2);
const triple = multiplicar(3);

console.log([1, 2, 3].map(doble)); // [2, 4, 6]
console.log([1, 2, 3].map(triple)); // [3, 6, 9]
```

**Aplicación parcial:** fijar algunos argumentos y dejar el resto para después.

```js
function parcial(funcion, ...fijados) {
  return function (...restantes) {
    return funcion(...fijados, ...restantes);
  };
}

function crearUrl(protocolo, dominio, ruta) {
  return `${protocolo}://${dominio}${ruta}`;
}

const urlApi = parcial(crearUrl, "https", "api.ejemplo.com");

console.log(urlApi("/usuarios")); // "https://api.ejemplo.com/usuarios"
console.log(urlApi("/pedidos")); // "https://api.ejemplo.com/pedidos"
```

**Curry genérico:** convierte cualquier función en currificable.

```js
function curry(funcion) {
  return function currificada(...args) {
    if (args.length >= funcion.length) {
      return funcion(...args);
    }
    return (...masArgs) => currificada(...args, ...masArgs);
  };
}

function formatearPrecio(moneda, valor, decimales) {
  return `${valor.toFixed(decimales)} ${moneda}`;
}

const precioEur = curry(formatearPrecio)("EUR");

console.log(precioEur(19.9, 2)); // "19.90 EUR"
console.log(precioEur(5, 0)); // "5 EUR"
```

⚠️ `funcion.length` cuenta solo los parámetros **sin valor por defecto y antes del primer resto**. Si usas parámetros por defecto, el curry genérico se comporta raro.

```js
function ejemplo(a, b = 2, c) {
  return a + b + c;
}

console.log(ejemplo.length); // 1 — no 3
```

**Uso real:** configurar funciones para `map`/`filter` sin flechas inline.

```js
const usuarios = [
  { nombre: "Ana", activo: true },
  { nombre: "Luis", activo: false },
];

const estaActivo = (u) => u.activo;
const obtenerNombre = (u) => u.nombre;

const activos = usuarios.filter(estaActivo).map(obtenerNombre);
console.log(activos); // ["Ana"]
```

Esto es más legible que dos flechas anidadas y reutiliza las funciones.

### 7.2.9 Recursión

Una función recursiva se llama a sí misma y necesita **caso base** (cuándo parar) y **caso recursivo** (avanzar hacia la base).

```js
function factorial(n) {
  if (n <= 1) return 1; // caso base
  return n * factorial(n - 1); // caso recursivo
}

console.log(factorial(5)); // 120
```

Sin caso base:

```js
// ❌ RangeError: Maximum call stack size exceeded
function infinito(n) {
  return infinito(n + 1);
}
```

**Recursión sobre estructuras de árbol** es donde brilla:

```js
const arbol = {
  nombre: "raíz",
  hijos: [
    { nombre: "a", hijos: [{ nombre: "a1", hijos: [] }] },
    { nombre: "b", hijos: [] },
  ],
};

function contarNodos(nodo) {
  return 1 + nodo.hijos.reduce((total, hijo) => total + contarNodos(hijo), 0);
}

console.log(contarNodos(arbol)); // 4
```

Un `for` también podría, pero necesitaría una pila explícita. La recursión expresa la forma del dato.

**Recursión de cola:** algunos lenguajes optimizan la llamada en posición final. **V8 no lo hace.**

```js
// ❌ "Recursión de cola" en JS: sigue consumiendo pila
function sumaCola(n, acumulado = 0) {
  if (n === 0) return acumulado;
  return sumaCola(n - 1, acumulado + n);
}

console.log(sumaCola(10000)); // 50005000
// console.log(sumaCola(100000)); // RangeError en muchos entornos
```

Para números grandes, usa iteración o `reduce`:

```js
function suma(n) {
  let total = 0;
  for (let i = 1; i <= n; i++) total += i;
  return total;
}

console.log(suma(100000)); // 5000050000
```

⚠️ **Cuándo evitar la recursión:** profundidad grande, datos lineales, o cuando un `map`/`filter`/`reduce` expresa mejor la intención. La recursión es para árboles y estructuras naturalmente recursivas.

### 7.2.10 Memoización

**Memoizar** es guardar el resultado de una función pura para no recalcularlo.

```js
function memoizar(funcion) {
  const cache = new Map();

  return function (argumento) {
    if (cache.has(argumento)) {
      return cache.get(argumento);
    }

    const resultado = funcion(argumento);
    cache.set(argumento, resultado);
    return resultado;
  };
}

function lento(n) {
  let total = 0;
  for (let i = 0; i < n; i++) total += i;
  return total;
}

const lentoMemo = memoizar(lento);

console.time("primera");
console.log(lentoMemo(1000000));
console.timeEnd("primera");

console.time("segunda");
console.log(lentoMemo(1000000));
console.timeEnd("segunda");
```

La segunda llamada devuelve el valor guardado casi instantáneamente.

**Requisitos para memoizar:**

| Requisito | Por qué |
|---|---|
| Función pura | Si depende del exterior, la caché miente |
| Argumentos comparables por identidad o valor | `Map` usa `===` para objetos: dos objetos iguales son claves distintas |
| Pocas claves distintas | Si cada llamada usa un argumento nuevo, la caché solo consume memoria |
| Resultado estable | Si el resultado debe cambiar con el tiempo, no lo guardes |

**Memoización con varios argumentos:**

```js
function memoizarArgs(funcion) {
  const cache = new Map();

  return function (...args) {
    const clave = JSON.stringify(args);

    if (cache.has(clave)) return cache.get(clave);

    const resultado = funcion(...args);
    cache.set(clave, resultado);
    return resultado;
  };
}

const sumar = memoizarArgs((a, b) => a + b);
console.log(sumar(2, 3)); // 5
console.log(sumar(2, 3)); // 5 desde caché
```

⚠️ `JSON.stringify` como clave falla con `undefined`, funciones, objetos con orden distinto de claves o referencias circulares. Para producción, usa una clave construida a mano o una librería.

**Fuga de memoria:** una caché sin límite crece para siempre.

```js
function memoizarConLimite(funcion, maximo = 100) {
  const cache = new Map();

  return function (argumento) {
    if (cache.has(argumento)) return cache.get(argumento);

    const resultado = funcion(argumento);

    if (cache.size >= maximo) {
      const primeraClave = cache.keys().next().value;
      cache.delete(primeraClave);
    }

    cache.set(argumento, resultado);
    return resultado;
  };
}
```

Esto es una política **FIFO** (el primero que entró sale primero). Para cachés serias se usa **LRU** (least recently used), que además reordena al acceder. Lo importante es que toda caché tenga una política de expulsión.

> 🧠 **Regla:** memoiza solo funciones puras y caras, y ponle límite. Si no sabes cuántas claves distintas habrá, no memoices.

### 7.2.11 Actualizaciones inmutables en la práctica

El caso más común: actualizar un elemento de un array de objetos por `id`.

```js
const tareas = [
  { id: 1, texto: "Estudiar", completada: false },
  { id: 2, texto: "Descansar", completada: false },
];

// ✅ Devuelve un array nuevo, con una tarea nueva
function alternarTarea(tareas, id) {
  return tareas.map((tarea) =>
    tarea.id === id ? { ...tarea, completada: !tarea.completada } : tarea
  );
}

const actualizadas = alternarTarea(tareas, 1);

console.log(tareas[0].completada); // false
console.log(actualizadas[0].completada); // true
```

Fíjate en que las tareas no afectadas **conservan la misma referencia**. Eso es intencional: permite comparar rápido (`tarea === otraTarea`) y ahorra memoria. Se llama **actualización estructural**.

```js
console.log(actualizadas[1] === tareas[1]); // true — no se tocó
console.log(actualizadas[0] === tareas[0]); // false — es una copia nueva
```

**Añadir:**

```js
function agregarTarea(tareas, texto) {
  const nuevoId = tareas.reduce((max, t) => Math.max(max, t.id), 0) + 1;
  return [...tareas, { id: nuevoId, texto, completada: false }];
}
```

**Eliminar:**

```js
function eliminarTarea(tareas, id) {
  return tareas.filter((tarea) => tarea.id !== id);
}
```

**Ordenar sin mutar:**

```js
function ordenarPorTexto(tareas) {
  return tareas.toSorted((a, b) => a.texto.localeCompare(b.texto));
}
```

**Actualizar un objeto anidado:**

```js
const estado = {
  usuario: { nombre: "Ana", preferencias: { tema: "claro" } },
  carrito: [],
};

const nuevoEstado = {
  ...estado,
  usuario: {
    ...estado.usuario,
    preferencias: {
      ...estado.usuario.preferencias,
      tema: "oscuro",
    },
  },
};

console.log(estado.usuario.preferencias.tema); // "claro"
console.log(nuevoEstado.usuario.preferencias.tema); // "oscuro"
```

Es verboso. Por eso existen helpers:

```js
function actualizarEn(ruta, valor, objeto) {
  if (ruta.length === 0) return valor;

  const [clave, ...resto] = ruta;

  return {
    ...objeto,
    [clave]: actualizarEn(resto, valor, objeto[clave]),
  };
}

const nuevoEstado = actualizarEn(["usuario", "preferencias", "tema"], "oscuro", estado);

console.log(nuevoEstado.usuario.preferencias.tema); // "oscuro"
console.log(estado.usuario.preferencias.tema); // "claro"
```

Esta función es pura y recursiva: recorre el camino creando copias solo donde hace falta. Es la idea que hay detrás de `immutable.js`, Immer y los reducers de Redux.

⚠️ **No abuses de la inmutabilidad profunda.** Clonar un árbol enorme en cada tecla es caro. Copia solo la rama afectada, como hace `actualizarEn`.

### 7.2.12 Declarativo frente a imperativo

El mismo problema en tres estilos:

**Imperativo:** dices *cómo*.

```js
const numeros = [1, 2, 3, 4, 5, 6];
const paresAlCuadrado = [];

for (let i = 0; i < numeros.length; i++) {
  if (numeros[i] % 2 === 0) {
    paresAlCuadrado.push(numeros[i] * numeros[i]);
  }
}

console.log(paresAlCuadrado); // [4, 16, 36]
```

**Funcional (declarativo):** dices *qué*.

```js
const numeros = [1, 2, 3, 4, 5, 6];

const paresAlCuadrado = numeros
  .filter((n) => n % 2 === 0)
  .map((n) => n * n);

console.log(paresAlCuadrado); // [4, 16, 36]
```

**Intermedio:** `reduce` explícito, útil cuando necesitas una sola pasada.

```js
const numeros = [1, 2, 3, 4, 5, 6];

const paresAlCuadrado = numeros.reduce((acc, n) => {
  if (n % 2 === 0) acc.push(n * n);
  return acc;
}, []);

console.log(paresAlCuadrado); // [4, 16, 36]
```

| Estilo | Ventaja | Cuándo usarlo |
|---|---|---|
| Imperativo | Control total, máximo rendimiento | Bucles con `break`, algoritmos con estado complejo |
| Encadenado | Legible, expresa intención | Transformaciones de datos |
| `reduce` | Una sola pasada | Rendimiento con listas grandes |
| Recursivo | Natural para árboles | Estructuras anidadas |

⚠️ **El encadenado crea arrays intermedios.** Para 10 000 elementos no importa. Para 10 millones, `reduce` en una pasada evita dos arrays temporales. Mide antes de optimizar.

```js
// Cada paso crea un array nuevo
const resultado = datos
  .filter(condicion)   // array 1
  .map(transformar)    // array 2
  .slice(0, 10);       // array 3
```

> 🧠 **Regla:** escribe primero la versión declarativa. Si el perfilador dice que ese bucle es el cuello de botella, bájalo a imperativo. Casi nunca lo será.

### ✅ Haz esto / ❌ Evita esto (7.2)

```js
// ✅ Devuelve valores nuevos
function agregar(items, item) {
  return [...items, item];
}

// ✅ Recibe lo que necesita como argumento
function formatear(fecha, locale) {
  return fecha.toLocaleDateString(locale);
}

// ✅ Funciones pequeñas con nombre
const esAdulto = (persona) => persona.edad >= 18;
const nombreDe = (persona) => persona.nombre;

const adultos = personas.filter(esAdulto).map(nombreDe);

// ✅ Copia la rama que cambia
const nuevo = { ...viejo, perfil: { ...viejo.perfil, nombre: "Ana" } };

// ✅ structuredClone para copias profundas en memoria
const copia = structuredClone(original);
```

```js
// ❌ Mutar argumentos
function ordenar(items) {
  return items.sort(); // muta el array del llamador
}

// ❌ Depender del exterior
let iva = 0.21;
function conIva(precio) {
  return precio * (1 + iva);
}

// ❌ Mezclar cálculo y DOM
function calcularYMostrar(items) {
  const total = items.reduce((s, i) => s + i.precio, 0);
  document.querySelector("#total").textContent = total;
}

// ❌ Copia profunda con JSON
const copia = JSON.parse(JSON.stringify(objeto)); // pierde Date, Map, undefined

// ❌ Memoizar una función impura
const memo = memoizar(() => Math.random());
```

---

## 7.3 — Errores a fondo

En el Módulo 2 viste `try`/`catch` por encima. Aquí lo verás como sistema de diseño: qué es un error, cómo se propaga, cómo se modela y cómo se decide qué hacer con él.

Un programa correcto no es el que nunca falla. Es el que **falla de forma predecible y deja el sistema en un estado coherente**.

### 7.3.1 Qué es un error en JavaScript

En JS, un error es un **valor** que se lanza con `throw` y se captura con `catch`. Casi siempre es una instancia de `Error` o de una subclase, pero el lenguaje permite lanzar cualquier cosa.

```js
const error = new Error("No se pudo conectar");

console.log(error.message); // "No se pudo conectar"
console.log(error.name); // "Error"
console.log(error instanceof Error); // true
console.log(typeof error.stack); // "string"
```

`stack` es una cadena con la traza: dónde se creó el error y qué funciones estaban activas. Es la herramienta más valiosa para depurar.

```js
function a() {
  b();
}

function b() {
  throw new Error("fallo en b");
}

try {
  a();
} catch (error) {
  console.log(error.stack);
}
```

Salida aproximada:

```text
Error: fallo en b
    at b (file:///.../app.mjs:7:9)
    at a (file:///.../app.mjs:3:3)
    at file:///.../app.mjs:11:3
```

Se lee de abajo arriba: la línea 11 llamó a `a`, `a` llamó a `b`, y `b` lanzó.

> 🔬 El formato exacto del `stack` no está estandarizado. Varía entre V8 (Node, Chrome), SpiderMonkey (Firefox) y JavaScriptCore (Safari). No lo parsees en producción.

**`Error` sin `new` también funciona:**

```js
const e1 = new Error("con new");
const e2 = Error("sin new");

console.log(e1.message); // "con new"
console.log(e2.message); // "sin new"
console.log(e1 instanceof Error); // true
console.log(e2 instanceof Error); // true
```

Aun así, usa `new`: es más explícito y consistente con las subclases.

**`toString()`** concatena nombre y mensaje:

```js
const error = new TypeError("valor inesperado");
console.log(error.toString()); // "TypeError: valor inesperado"
console.log(String(error)); // "TypeError: valor inesperado"
```

### 7.3.2 Los tipos nativos de error

JavaScript trae varios tipos, cada uno para una familia de fallos.

| Tipo | Cuándo aparece | Ejemplo |
|---|---|---|
| `Error` | Genérico | `throw new Error("algo")` |
| `TypeError` | Operación sobre un tipo incorrecto | `null.nombre`, `noEsFuncion()` |
| `ReferenceError` | Identificador inexistente | `console.log(noExiste)` |
| `RangeError` | Valor fuera de rango | `new Array(-1)`, recursión infinita |
| `SyntaxError` | Código inválido | `JSON.parse("{roto")` |
| `URIError` | URI mal formada | `decodeURIComponent("%")` |
| `EvalError` | Uso incorrecto de `eval` | Prácticamente obsoleto |
| `AggregateError` | Varios errores a la vez | `Promise.any` con todos fallidos |

```js
try {
  null.nombre;
} catch (error) {
  console.log(error.name); // "TypeError"
  console.log(error.message); // "Cannot read properties of null (reading 'nombre')"
}
```

```js
try {
  console.log(noExiste);
} catch (error) {
  console.log(error.name); // "ReferenceError"
}
```

```js
try {
  new Array(-1);
} catch (error) {
  console.log(error.name); // "RangeError"
}
```

```js
try {
  JSON.parse("{roto");
} catch (error) {
  console.log(error.name); // "SyntaxError"
}
```

```js
try {
  decodeURIComponent("%");
} catch (error) {
  console.log(error.name); // "URIError"
}
```

> 🧠 **Regla:** el `name` te dice **qué familia** de problema es. El `message`, qué pasó concretamente. Nunca compares mensajes: cambian entre versiones y motores. Compara `name`, `code` o `instanceof`.

⚠️ **`SyntaxError` de `JSON.parse` no es el mismo que un error de sintaxis del lenguaje.** El del lenguaje ocurre al parsear el archivo y no se puede capturar; el de `JSON.parse` ocurre en tiempo de ejecución y sí.

### 7.3.3 `throw` de cualquier valor

Puedes lanzar strings, números, objetos planos o `null`.

```js
throw "algo salió mal"; // válido, pero mala idea
```

```js
try {
  throw "texto";
} catch (valor) {
  console.log(typeof valor); // "string"
  console.log(valor.stack); // undefined — no hay traza
}
```

**Por qué no hacerlo:**

| Problema | Consecuencia |
|---|---|
| No hay `stack` | No sabes dónde se originó |
| No hay `name` | No puedes distinguir familias |
| No hay `instanceof` | No puedes filtrar por tipo |
| Rompe convenciones | Otras herramientas asumen `Error` |

```js
// ❌ Objeto plano: parece error, pero no lo es
throw { codigo: 404, mensaje: "No encontrado" };

// ✅ Error con datos adjuntos
const error = new Error("No encontrado");
error.codigo = 404;
throw error;
```

La segunda forma conserva la traza y añade información. Es la práctica estándar.

### 7.3.4 `try` / `catch` / `finally`

```js
try {
  // código que puede fallar
} catch (error) {
  // se ejecuta solo si algo falló
} finally {
  // se ejecuta siempre
}
```

**Flujo completo:**

```js
function procesar() {
  try {
    console.log("1. intento");
    throw new Error("fallo");
    // console.log("nunca se ejecuta");
  } catch (error) {
    console.log("2. capturado:", error.message);
  } finally {
    console.log("3. finally");
  }

  console.log("4. después del bloque");
}

procesar();
```

Salida:

```text
1. intento
2. capturado: fallo
3. finally
4. después del bloque
```

**`finally` se ejecuta incluso con `return`:**

```js
function conFinally() {
  try {
    return "desde try";
  } finally {
    console.log("finally se ejecuta igual");
  }
}

console.log(conFinally());
```

Salida:

```text
finally se ejecuta igual
desde try
```

⚠️ **Un `return` dentro de `finally` sobrescribe el del `try`.** Es una de las trampas más silenciosas del lenguaje.

```js
function peligroso() {
  try {
    return "resultado bueno";
  } finally {
    return "resultado del finally"; // pisa el anterior
  }
}

console.log(peligroso()); // "resultado del finally"
```

```js
// ✅ finally para limpiar, nunca para decidir el retorno
function seguro() {
  try {
    return "resultado bueno";
  } finally {
    console.log("limpieza");
  }
}
```

**`catch` sin binding** (ES2019): si no usas el error.

```js
try {
  JSON.parse("{roto");
} catch {
  console.log("JSON inválido");
}
```

Úsalo solo cuando de verdad no necesitas el detalle. Si vas a registrar el error, necesitas la variable.

**`try`/`catch` no captura errores asíncronos que ocurren después:**

```js
try {
  setTimeout(() => {
    throw new Error("esto no lo captura el try");
  }, 0);
} catch (error) {
  console.log("nunca llega aquí");
}
```

El `try` termina antes de que el callback se ejecute. El error se convierte en un error no capturado (7.3.9).

```js
// ✅ Captura dentro del callback
setTimeout(() => {
  try {
    throw new Error("ahora sí");
  } catch (error) {
    console.log("capturado:", error.message);
  }
}, 0);
```

### 7.3.5 Capturar o propagar

Una función tiene dos opciones ante un error:

1. **Capturarlo** y resolverlo (o convertirlo en otro).
2. **Dejarlo propagar** para que lo maneje alguien que sepa qué hacer.

La regla: **captura donde puedas hacer algo útil**. Si no puedes, propaga.

```js
// ✅ Propaga: no sabe qué hacer con un fallo de red
async function obtenerUsuario(id) {
  const respuesta = await fetch(`/api/usuarios/${id}`);

  if (!respuesta.ok) {
    throw new Error(`No se pudo obtener el usuario ${id}`);
  }

  return respuesta.json();
}
```

```js
// ✅ Captura en el borde: aquí sí hay una decisión de interfaz
async function mostrarUsuario(id) {
  try {
    const usuario = await obtenerUsuario(id);
    renderizar(usuario);
  } catch (error) {
    mostrarMensaje("No se pudo cargar el perfil. Inténtalo de nuevo.");
    console.error(error);
  }
}
```

**El antipatrón más común:**

```js
// ❌ Silencia el error: el bug se vuelve invisible
try {
  procesarPago();
} catch (error) {
  // nada
}
```

```js
// ❌ Peor: lo convierte en un mensaje sin información
try {
  procesarPago();
} catch (error) {
  console.log("error");
}
```

```js
// ✅ Al menos registra el detalle
try {
  procesarPago();
} catch (error) {
  console.error("Falló el pago", error);
  throw error; // y decide si debe propagarse
}
```

⚠️ **No captures errores que no entiendes.** Un `catch` que se traga todo oculta bugs de programación (`TypeError` por un `null`) mezclados con fallos esperados (red caída).

```js
// ✅ Distingue lo esperado de lo inesperado
function leerJson(texto) {
  try {
    return JSON.parse(texto);
  } catch (error) {
    if (error instanceof SyntaxError) {
      return null; // dato corrupto: esperado
    }
    throw error; // cualquier otra cosa: no la escondas
  }
}

console.log(leerJson("{roto")); // null
```

> 🧠 **Regla:** un `catch` debe hacer una de tres cosas: resolver el problema, añadir contexto y relanzar, o registrar y relanzar. Nunca ignorar en silencio.

### 7.3.6 Errores personalizados

Cuando tu dominio tiene fallos propios, modelarlos con clases hace el código expresivo y filtrable.

```js
// 📄 errores.mjs
export class ErrorDeValidacion extends Error {
  constructor(campo, mensaje) {
    super(mensaje);
    this.name = "ErrorDeValidacion";
    this.campo = campo;
  }
}

export class ErrorDeRed extends Error {
  constructor(mensaje, opciones) {
    super(mensaje, opciones);
    this.name = "ErrorDeRed";
  }
}

export class ErrorNoEncontrado extends Error {
  constructor(recurso) {
    super(`No se encontró: ${recurso}`);
    this.name = "ErrorNoEncontrado";
    this.recurso = recurso;
  }
}
```

```js
// 📄 app.mjs
import { ErrorDeValidacion, ErrorNoEncontrado } from "./errores.mjs";

function validarEdad(edad) {
  if (!Number.isInteger(edad)) {
    throw new ErrorDeValidacion("edad", "La edad debe ser un entero");
  }
  if (edad < 18) {
    throw new ErrorDeValidacion("edad", "Debes ser mayor de edad");
  }
  return edad;
}

try {
  validarEdad(15);
} catch (error) {
  if (error instanceof ErrorDeValidacion) {
    console.log("Campo:", error.campo);
    console.log("Mensaje:", error.message);
  } else {
    throw error;
  }
}
```

Salida:

```text
Campo: edad
Mensaje: Debes ser mayor de edad
```

**Qué hace cada línea del constructor:**

| Línea | Por qué |
|---|---|
| `super(mensaje)` | Inicializa `message` y `stack` en `Error` |
| `this.name = "ErrorDeValidacion"` | Sin esto, `name` sería `"Error"` |
| `this.campo = campo` | Añade datos del dominio para quien capture |

⚠️ **`instanceof` falla si transpilas a ES5 sin cuidado.** El prototipo de la subclase no se enlaza correctamente. Si tu build apunta a navegadores muy antiguos, añade:

```js
Object.setPrototypeOf(this, ErrorDeValidacion.prototype);
```

Hoy casi nadie transpila clases a ES5, pero si ves que `instanceof` devuelve `false` con una subclase, ese es el motivo.

**Jerarquía de errores de dominio:**

```js
// 📄 errores-tienda.mjs
export class ErrorTienda extends Error {
  constructor(mensaje, opciones) {
    super(mensaje, opciones);
    this.name = "ErrorTienda";
  }
}

export class ErrorStock extends ErrorTienda {
  constructor(producto) {
    super(`Sin stock de ${producto}`);
    this.name = "ErrorStock";
    this.producto = producto;
  }
}

export class ErrorPago extends ErrorTienda {
  constructor(motivo, opciones) {
    super(`Pago rechazado: ${motivo}`, opciones);
    this.name = "ErrorPago";
    this.motivo = motivo;
  }
}
```

```js
// 📄 uso.mjs
import { ErrorTienda, ErrorStock } from "./errores-tienda.mjs";

function comprar(producto) {
  throw new ErrorStock(producto);
}

try {
  comprar("Camisa");
} catch (error) {
  if (error instanceof ErrorStock) {
    console.log("Aviso al usuario:", error.message);
  } else if (error instanceof ErrorTienda) {
    console.log("Error de tienda:", error.message);
  } else {
    throw error;
  }
}
```

`instanceof` recorre la cadena de prototipos: `ErrorStock` es también `ErrorTienda` y `Error`. Puedes capturar en el nivel que te interese.

> 🧠 **Regla:** una clase de error por **decisión distinta** que deba tomar quien capture. No crees `ErrorDeCampoVacio`, `ErrorDeCampoMuyLargo` y `ErrorDeCampoInvalido`: un `ErrorDeValidacion` con `campo` y `codigo` cubre los tres.

### 7.3.7 `cause`: encadenar errores

Cuando un error de bajo nivel se convierte en uno de dominio, no pierdas el original.

```js
// ❌ Se pierde la causa
try {
  JSON.parse(texto);
} catch (error) {
  throw new Error("No se pudo leer la configuración");
}
```

```js
// ✅ Se conserva la causa
try {
  JSON.parse(texto);
} catch (error) {
  throw new Error("No se pudo leer la configuración", { cause: error });
}
```

```js
try {
  throw new Error("No se pudo leer la configuración", {
    cause: new SyntaxError("JSON inválido"),
  });
} catch (error) {
  console.log(error.message); // "No se pudo leer la configuración"
  console.log(error.cause.message); // "JSON inválido"
}
```

**Por qué importa:** el mensaje de arriba es para el usuario o para el contexto; la causa es para quien depura.

```js
// 📄 api.mjs
export async function cargarUsuarios() {
  try {
    const respuesta = await fetch("/api/usuarios");

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    return await respuesta.json();
  } catch (error) {
    throw new Error("No se pudieron cargar los usuarios", { cause: error });
  }
}
```

Al registrar:

```js
try {
  await cargarUsuarios();
} catch (error) {
  console.error(error.message);
  console.error("Causa:", error.cause);
}
```

⚠️ `cause` no se muestra automáticamente en `console.error(error)`. Algunos entornos lo imprimen; no dependas de ello. Regístralo explícitamente si lo necesitas.

**Recorrer una cadena de causas:**

```js
function imprimirCadena(error, nivel = 0) {
  const sangria = "  ".repeat(nivel);
  console.log(`${sangria}${error.name}: ${error.message}`);

  if (error.cause instanceof Error) {
    imprimirCadena(error.cause, nivel + 1);
  }
}

try {
  throw new Error("Error de alto nivel", {
    cause: new Error("Error intermedio", {
      cause: new Error("Error original"),
    }),
  });
} catch (error) {
  imprimirCadena(error);
}
```

Salida:

```text
Error: Error de alto nivel
  Error: Error intermedio
    Error: Error original
```

### 7.3.8 `AggregateError` y errores múltiples

Cuando varias operaciones fallan a la vez, `AggregateError` agrupa los errores.

```js
const error = new AggregateError(
  [new Error("fallo 1"), new Error("fallo 2")],
  "Varias operaciones fallaron"
);

console.log(error.message); // "Varias operaciones fallaron"
console.log(error.errors.length); // 2
console.log(error.errors[0].message); // "fallo 1"
```

**`Promise.any` lo usa cuando todas las promesas fallan:**

```js
const promesas = [
  Promise.reject(new Error("servidor A caído")),
  Promise.reject(new Error("servidor B caído")),
];

try {
  await Promise.any(promesas);
} catch (error) {
  console.log(error instanceof AggregateError); // true
  console.log(error.errors.map((e) => e.message));
  // ["servidor A caído", "servidor B caído"]
}
```

**`Promise.allSettled` no lanza; devuelve el estado de cada promesa:**

```js
const resultados = await Promise.allSettled([
  Promise.resolve("ok 1"),
  Promise.reject(new Error("fallo 2")),
  Promise.resolve("ok 3"),
]);

for (const resultado of resultados) {
  if (resultado.status === "fulfilled") {
    console.log("Éxito:", resultado.value);
  } else {
    console.log("Fallo:", resultado.reason.message);
  }
}
```

Salida:

```text
Éxito: ok 1
Fallo: fallo 2
Éxito: ok 3
```

| Método | Si una falla | Resultado |
|---|---|---|
| `Promise.all` | Rechaza con el primer error | Solo valores si todas bien |
| `Promise.allSettled` | Nunca rechaza | Array con `status` por promesa |
| `Promise.any` | Rechaza con `AggregateError` si todas fallan | Primer valor exitoso |
| `Promise.race` | Rechaza si la primera en terminar falla | Primer resultado, bueno o malo |

⚠️ **`Promise.all` cancela lógicamente el resto, pero no detiene las operaciones.** Las demás promesas siguen ejecutándose; simplemente ya no esperas su resultado. Para detener trabajo real necesitas `AbortController` (7.4).

### 7.3.9 Errores en código asíncrono

Con `async`/`await`, `try`/`catch` funciona de forma natural:

```js
async function cargar() {
  try {
    const respuesta = await fetch("/api/datos");
    const datos = await respuesta.json();
    return datos;
  } catch (error) {
    console.error("Falló la carga", error);
    throw error;
  }
}
```

⚠️ **Olvidar `await` rompe el `try`:**

```js
// ❌ El error ocurre después; el try ya terminó
try {
  cargar(); // falta await
} catch (error) {
  console.log("no se captura");
}
```

```js
// ✅
try {
  await cargar();
} catch (error) {
  console.log("capturado");
}
```

**Con `.then`, el `catch` va al final de la cadena:**

```js
cargar()
  .then((datos) => console.log(datos))
  .catch((error) => console.error("Falló", error));
```

⚠️ Un `catch` intermedio no captura errores de un `then` posterior:

```js
// ❌ El error del segundo then no lo captura el catch del primero
cargar()
  .catch((error) => console.log("catch 1"))
  .then((datos) => {
    throw new Error("fallo en el then");
  });
```

Coloca `.catch` al final o usa `await` dentro de `try`.

**Errores no capturados en el navegador:**

```js
// 📄 app.js
window.addEventListener("unhandledrejection", (evento) => {
  console.error("Promesa rechazada sin catch:", evento.reason);
});

window.addEventListener("error", (evento) => {
  console.error("Error no capturado:", evento.error);
});

Promise.reject(new Error("sin manejar"));
```

**En Node:**

```js
process.on("unhandledRejection", (motivo) => {
  console.error("Promesa rechazada sin manejar:", motivo);
});

Promise.reject(new Error("sin manejar"));
```

📌 `process` es la API de Node; la verás a fondo en el Módulo 8. Aquí solo importa la idea: **siempre debe haber una red de seguridad que registre lo que nadie capturó.**

⚠️ Registrar no es resolver. Un `unhandledrejection` indica un bug: alguien olvidó un `catch`.

### 7.3.10 El patrón `Result`

No todos los fallos son excepcionales. Una validación que falla es parte del flujo normal. Para esos casos, devolver un resultado explícito suele ser mejor que lanzar.

```js
// 📄 resultado.mjs
export function ok(valor) {
  return { ok: true, valor };
}

export function fallo(error) {
  return { ok: false, error };
}
```

```js
// 📄 validar.mjs
import { ok, fallo } from "./resultado.mjs";

export function validarEdad(edad) {
  if (!Number.isInteger(edad)) {
    return fallo(new Error("La edad debe ser un número entero"));
  }

  if (edad < 18) {
    return fallo(new Error("Debes ser mayor de edad"));
  }

  return ok(edad);
}
```

```js
// 📄 app.mjs
import { validarEdad } from "./validar.mjs";

const resultado = validarEdad(15);

if (resultado.ok) {
  console.log("Edad válida:", resultado.valor);
} else {
  console.log("Error:", resultado.error.message);
}
```

**`throw` frente a `Result`:**

| Criterio | `throw` | `Result` |
|---|---|---|
| El fallo es excepcional | ✅ | — |
| El fallo es parte del flujo | — | ✅ |
| Quieres obligar a manejarlo | — | ✅ El tipo lo recuerda |
| El llamador puede olvidarlo | ✅ (puede no capturar) | — |
| Composición con `map`/`filter` | Incómoda | Natural |
| Trazas de error | ✅ | Solo si guardas el `Error` |
| Código más verboso | Menos | Más |

**Composición de resultados:**

```js
function mapResultado(resultado, funcion) {
  return resultado.ok ? ok(funcion(resultado.valor)) : resultado;
}

const resultado = validarEdad(20);
const conDescuento = mapResultado(resultado, (edad) => edad - 2);

console.log(conDescuento); // { ok: true, valor: 18 }
```

**Cuándo elegir cada uno:**

```js
// ✅ throw: fallo inesperado, no hay valor válido que devolver
function dividir(a, b) {
  if (b === 0) throw new RangeError("No se puede dividir por cero");
  return a / b;
}

// ✅ Result: validación de formulario, el fallo es esperado
function validarEmail(email) {
  if (!email.includes("@")) return fallo(new Error("Email inválido"));
  return ok(email);
}
```

> 🧠 **Regla:** si el llamador **debe** decidir algo cuando falla, usa `Result`. Si el fallo es un bug o una situación excepcional, usa `throw`.

⚠️ No mezcles ambos estilos en la misma capa sin criterio. Un equipo que a veces lanza y a veces devuelve `{ ok }` obliga a recordar cuál es cuál.

### 7.3.11 Reintentos con espera creciente

Los fallos de red suelen ser temporales. Reintentar con espera creciente (**backoff exponencial**) evita saturar un servidor que ya está sufriendo.

```js
// 📄 reintentos.mjs
export async function conReintentos(operacion, opciones = {}) {
  const { intentos = 3, esperaBase = 300 } = opciones;
  let ultimoError;

  for (let intento = 1; intento <= intentos; intento++) {
    try {
      return await operacion();
    } catch (error) {
      ultimoError = error;

      if (intento === intentos) break;

      const espera = esperaBase * 2 ** (intento - 1);
      console.log(`Intento ${intento} falló. Reintento en ${espera} ms`);
      await new Promise((resolve) => setTimeout(resolve, espera));
    }
  }

  throw new Error(`Falló tras ${intentos} intentos`, { cause: ultimoError });
}
```

```js
// 📄 uso.mjs
import { conReintentos } from "./reintentos.mjs";

let llamadas = 0;

async function operacionInestable() {
  llamadas += 1;

  if (llamadas < 3) {
    throw new Error("servidor ocupado");
  }

  return "éxito";
}

const resultado = await conReintentos(operacionInestable, {
  intentos: 4,
  esperaBase: 100,
});

console.log(resultado); // "éxito"
console.log("Llamadas:", llamadas); // 3
```

Salida:

```text
Intento 1 falló. Reintento en 100 ms
Intento 2 falló. Reintento en 200 ms
éxito
Llamadas: 3
```

**Qué NO reintentar:**

| Situación | ¿Reintentar? |
|---|---|
| Timeout de red | ✅ |
| `500`, `502`, `503`, `504` | ✅ |
| `429` (demasiadas peticiones) | ✅ respetando `Retry-After` |
| `400`, `422` (datos inválidos) | ❌ el dato no va a mejorar |
| `401`, `403` (sin permiso) | ❌ salvo que renueves credenciales |
| `404` | ❌ |
| Error de validación local | ❌ |

⚠️ **Sin límite ni espera, un reintento es un ataque.** Reintentar 100 veces en un bucle aprieta el servidor y empeora el problema. Siempre: máximo de intentos, espera creciente y, si es posible, **jitter** (pequeña variación aleatoria para que muchos clientes no reintenten a la vez).

```js
function esperaConJitter(base) {
  return base + Math.random() * base * 0.3;
}
```

Lo aplicarás con `fetch` en 7.5.

### 7.3.12 Errores esperados frente a inesperados

Esta distinción decide cómo manejas cada fallo.

| Categoría | Ejemplos | Qué hacer |
|---|---|---|
| **Esperado** | Validación, `404`, sin conexión, datos corruptos | Mostrar mensaje, ofrecer alternativa |
| **Inesperado** | `TypeError` por `null`, bug de lógica | Registrar con detalle, no ocultar, corregir |

```js
// ✅ Esperado: el usuario no existe
function manejarRespuesta(respuesta) {
  if (!respuesta.ok && respuesta.status === 404) {
    mostrarVacio("No encontramos ese perfil");
    return;
  }

  // ✅ Inesperado: algo se rompió
  if (!respuesta.ok) {
    throw new Error(`Respuesta inesperada: ${respuesta.status}`);
  }

  return respuesta.json();
}
```

⚠️ **No uses excepciones para control de flujo normal.** Si una función devuelve “no encontrado” lanzando, obligas a un `try` en cada llamada.

```js
// ❌ Excepción como valor de retorno
function buscar(items, id) {
  const item = items.find((i) => i.id === id);
  if (!item) throw new Error("no encontrado");
  return item;
}
```

```js
// ✅ Devuelve un valor que expresa la ausencia
function buscar(items, id) {
  return items.find((i) => i.id === id) ?? null;
}
```

`find` ya devuelve `undefined`; `?? null` lo hace explícito. El llamador decide si eso es un error.

### 7.3.13 Registrar errores con contexto

Un log útil responde: **qué** falló, **dónde**, **con qué datos** y **qué se intentaba**.

```js
// ❌ Poco útil
console.error("error");

// ❌ Mejor, pero incompleto
console.error("Falló la carga de usuarios");

// ✅ Útil
console.error("Falló la carga de usuarios", {
  url: "/api/usuarios",
  metodo: "GET",
  status: 503,
  intento: 2,
  error,
});
```

**Nunca registres datos sensibles:**

```js
// ❌ Contraseña y token en los logs
console.error("Login fallido", { email, password, token });

// ✅ Solo lo necesario
console.error("Login fallido", { email, motivo: "credenciales" });
```

**Contexto sin contaminar el mensaje:**

```js
function conContexto(error, contexto) {
  const nuevo = new Error(error.message, { cause: error });
  nuevo.name = error.name;
  nuevo.contexto = contexto;
  return nuevo;
}

try {
  await cargarUsuarios();
} catch (error) {
  throw conContexto(error, { pantalla: "perfil", usuarioId: 42 });
}
```

**Bordes de la aplicación:** en una app grande, los errores no capturados deberían llegar a un solo lugar.

```js
// 📄 borde.js
window.addEventListener("error", (evento) => {
  enviarAlServidor({
    tipo: "error",
    mensaje: evento.message,
    archivo: evento.filename,
    linea: evento.lineno,
  });
});
```

📌 En el Módulo 8 verás cómo estructurar esto en un proyecto Node real, con logs y entornos.

### ✅ Haz esto / ❌ Evita esto (7.3)

```js
// ✅ Lanza Error (o subclases), nunca strings
throw new Error("No se pudo guardar");

// ✅ Añade contexto con cause
throw new Error("No se pudo guardar el pedido", { cause: error });

// ✅ Distingue tipos
function esErrorDeSintaxis(error) {
  return error instanceof SyntaxError;
}

// ✅ finally para limpiar recursos
try {
  abrir();
  trabajar();
} finally {
  cerrar();
}

// ✅ Captura en el borde y muestra un mensaje útil
try {
  await guardar();
} catch (error) {
  console.error(error);
  mostrar("No se pudo guardar. Revisa tu conexión.");
}
```

```js
// ❌ Lanzar strings u objetos planos
throw "error";

// ❌ Catch vacío
try {
  guardar();
} catch (error) {}

// ❌ Capturar y no hacer nada con el error
// catch (error) {
//   console.log("ups");
// }

// ❌ Usar excepciones para el flujo normal
function existe(id) {
  if (!buscar(id)) throw new Error("no existe");
  return true;
}

// ❌ `return` dentro de `finally`
// finally {
//   return false;
// }

// ❌ Comparar mensajes de error
if (error.message === "Not found") {
}

// ❌ Reintentar sin límite
while (true) {
  try {
    await pedir();
    break;
  } catch {}
}
```

---

## 7.4 — HTTP y `fetch`

Todo lo que has hecho hasta ahora ocurre en una sola máquina. A partir de aquí, tu código habla con un servidor.

Antes de escribir `fetch(...)`, necesitas entender qué viaja por el cable. Sin ese modelo mental, los errores de CORS, los `404` que “no son errores” y los `body` que no se pueden leer dos veces parecen magia.

### 7.4.1 Qué ocurre cuando pides una URL

Escribes `https://api.ejemplo.com/usuarios?page=2`. Ocurre esto:

| Paso | Qué pasa |
|---|---|
| 1. DNS | El dominio se traduce a una IP (`93.184.216.34`) |
| 2. TCP | Se abre una conexión al puerto (443 para HTTPS) |
| 3. TLS | Se negocia el cifrado y se verifica el certificado |
| 4. Petición | Se envía el método, la ruta, las cabeceras y, si hay, el cuerpo |
| 5. Servidor | Procesa y responde con estado, cabeceras y cuerpo |
| 6. Cierre | La conexión se reutiliza o se cierra |

**Una petición HTTP en texto** se parece a esto:

```text
GET /usuarios?page=2 HTTP/1.1
Host: api.ejemplo.com
Accept: application/json
Authorization: Bearer abc123

```

**Y la respuesta:**

```text
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: max-age=60

[{"id":1,"nombre":"Ana"},{"id":2,"nombre":"Luis"}]
```

`fetch` construye y envía eso por ti. Pero todo lo que ves ahí sigue existiendo, y muchas veces necesitarás controlarlo.

> 🔬 HTTP/2 y HTTP/3 cambian el formato en el cable (binario, multiplexado), pero el modelo mental —método, ruta, cabeceras, estado, cuerpo— se mantiene.

### 7.4.2 Métodos HTTP

El método dice **qué quieres hacer** con el recurso.

| Método | Uso | Tiene cuerpo | Seguro | Idempotente |
|---|---|---|---|---|
| `GET` | Leer | No | Sí | Sí |
| `HEAD` | Leer solo cabeceras | No | Sí | Sí |
| `POST` | Crear / acción | Sí | No | No |
| `PUT` | Reemplazar completo | Sí | No | Sí |
| `PATCH` | Modificar parcial | Sí | No | No |
| `DELETE` | Borrar | A veces | No | Sí |
| `OPTIONS` | Consultar capacidades (CORS) | No | Sí | Sí |

- **Seguro:** no cambia el estado del servidor. `GET` no debería crear nada.
- **Idempotente:** repetirlo produce el mismo resultado. `DELETE /usuarios/1` dos veces deja el mismo estado final (aunque la segunda devuelva `404`).

⚠️ **Nunca uses `GET` para modificar datos.** Un `GET` puede ser cacheado, precargado por el navegador o repetido por un proxy. Si tu enlace “borra” algo, un crawler puede borrar tu base de datos.

```js
// ❌ GET que modifica
fetch("/api/borrar?id=1");

// ✅ DELETE
fetch("/api/productos/1", { method: "DELETE" });
```

**PUT frente a PATCH:**

```js
// PUT: reemplaza el recurso completo. Los campos ausentes se pierden.
fetch("/api/usuarios/1", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nombre: "Ana", email: "ana@ejemplo.com" }),
});

// PATCH: solo cambia lo enviado. El resto se conserva.
fetch("/api/usuarios/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email: "nuevo@ejemplo.com" }),
});
```

En la práctica, muchos servidores implementan `PATCH` como “actualización parcial” y `PUT` como “reemplazo”. Confirma el contrato de tu API; no lo asumas.

### 7.4.3 Códigos de estado

El **status** es un número de tres cifras. La primera cifra indica la familia.

| Rango | Significado | Quién tiene la culpa |
|---|---|---|
| `1xx` | Informativo | — |
| `2xx` | Éxito | — |
| `3xx` | Redirección | — |
| `4xx` | Error del cliente | Tú (la petición) |
| `5xx` | Error del servidor | El servidor |

Los que verás todos los días:

| Código | Nombre | Cuándo |
|---|---|---|
| `200` | OK | Todo bien |
| `201` | Created | Recurso creado (POST) |
| `204` | No Content | Éxito sin cuerpo (DELETE) |
| `301` | Moved Permanently | URL antigua |
| `304` | Not Modified | Caché válida |
| `400` | Bad Request | Petición mal formada |
| `401` | Unauthorized | Falta autenticación |
| `403` | Forbidden | Autenticado, sin permiso |
| `404` | Not Found | No existe |
| `409` | Conflict | Conflicto de estado (email duplicado) |
| `422` | Unprocessable Entity | Datos inválidos |
| `429` | Too Many Requests | Límite de peticiones |
| `500` | Internal Server Error | Bug del servidor |
| `502` | Bad Gateway | Un proxy no pudo hablar con el origen |
| `503` | Service Unavailable | Servidor caído o sobrecargado |
| `504` | Gateway Timeout | El origen tardó demasiado |

```js
function explicar(status) {
  if (status >= 200 && status < 300) return "éxito";
  if (status >= 300 && status < 400) return "redirección";
  if (status >= 400 && status < 500) return "error del cliente";
  if (status >= 500) return "error del servidor";
  return "desconocido";
}

console.log(explicar(200)); // "éxito"
console.log(explicar(404)); // "error del cliente"
console.log(explicar(503)); // "error del servidor"
```

> 🧠 **Regla:** `4xx` significa “revisa tu petición”; `5xx` significa “el servidor tiene un problema, quizá reintentar”. No reintentes un `400`; sí un `503`.

### 7.4.4 `URL` y `URLSearchParams`

`fetch` acepta un string o un objeto `URL`. Construir la URL con `URL` evita errores de codificación.

```js
const url = new URL("https://api.ejemplo.com/usuarios");

url.pathname = "/productos";
url.searchParams.set("page", "2");
url.searchParams.set("orden", "precio");
url.searchParams.append("etiqueta", "oferta");
url.searchParams.append("etiqueta", "nuevo");

console.log(url.toString());
// "https://api.ejemplo.com/productos?page=2&orden=precio&etiqueta=oferta&etiqueta=nuevo"
```

| Parte | Propiedad | Ejemplo |
|---|---|---|
| Protocolo | `url.protocol` | `"https:"` |
| Host | `url.host` | `"api.ejemplo.com"` |
| Puerto | `url.port` | `"443"` o `""` |
| Ruta | `url.pathname` | `"/productos"` |
| Query | `url.search` | `"?page=2"` |
| Hash | `url.hash` | `"#top"` |
| Origen | `url.origin` | `"https://api.ejemplo.com"` |

**`URLSearchParams`** maneja la codificación:

```js
const params = new URLSearchParams({
  q: "camisa azul",
  page: 2,
  activo: true,
});

console.log(params.toString()); // "q=camisa+azul&page=2&activo=true"
```

El espacio se convierte en `+`, y los caracteres especiales se codifican (`%20`, `%C3%B1`…). Si construyeras la URL a mano con `"q=" + texto`, un `&` o un `#` en el texto rompería la petición.

```js
// ❌ Si el usuario escribe "a&b", la URL se rompe
const urlRota = `/api/buscar?q=${texto}`;

// ✅
const urlSegura = `/api/buscar?${new URLSearchParams({ q: texto })}`;
```

**Leer parámetros:**

```js
const url = new URL("https://ejemplo.com/buscar?q=libro&page=2");

console.log(url.searchParams.get("q")); // "libro"
console.log(url.searchParams.get("page")); // "2" — siempre string
console.log(url.searchParams.get("noexiste")); // null
console.log(url.searchParams.has("page")); // true
```

**Rutas relativas:**

```js
const base = "https://api.ejemplo.com/v1/";
const url = new URL("usuarios/42", base);

console.log(url.href); // "https://api.ejemplo.com/v1/usuarios/42"
```

Esto es útil para construir endpoints sin concatenar strings.

### 7.4.5 `fetch` básico

`fetch` devuelve una **promesa** que se resuelve con un objeto `Response`.

```js
const respuesta = await fetch("https://api.ejemplo.com/usuarios");

console.log(respuesta.status); // 200
console.log(respuesta.ok); // true
console.log(respuesta.headers.get("content-type")); // "application/json"
```

⚠️ **`fetch` no rechaza en un `404` ni en un `500`.** Solo rechaza si la petición **no pudo completarse**: DNS, red caída, CORS, cancelación.

```js
// ❌ Esto NO captura un 404
try {
  const respuesta = await fetch("/api/no-existe");
  const datos = await respuesta.json(); // falla al parsear el HTML del 404
} catch (error) {
  console.log("Error de red"); // no entra aquí por el 404
}
```

```js
// ✅ Comprueba `ok` a mano
const respuesta = await fetch("/api/no-existe");

if (!respuesta.ok) {
  throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
}

const datos = await respuesta.json();
```

| Situación | ¿`fetch` rechaza? | Cómo detectarlo |
|---|---|---|
| Red caída | ✅ | `catch` |
| DNS inexistente | ✅ | `catch` |
| CORS bloqueado | ✅ (error de tipo) | `catch`, pero sin detalle |
| `404`, `500` | ❌ | `respuesta.ok === false` |
| Timeout propio | ✅ si usas `signal` | `catch` con `AbortError` |

**Leer el cuerpo:** solo se puede consumir **una vez**.

```js
const respuesta = await fetch("/api/datos");

const texto = await respuesta.text();
// const datos = await respuesta.json(); // ❌ TypeError: body already used
```

```js
// ✅ Elige un formato
const respuesta = await fetch("/api/datos");

if (respuesta.headers.get("content-type")?.includes("application/json")) {
  const datos = await respuesta.json();
  console.log(datos);
} else {
  const texto = await respuesta.text();
  console.log(texto);
}
```

Si necesitas leer dos veces, clona antes de consumir:

```js
const respuesta = await fetch("/api/datos");
const copia = respuesta.clone();

const datos = await respuesta.json();
const texto = await copia.text();

console.log(typeof datos, typeof texto); // "object" "string"
```

⚠️ `clone()` duplica el cuerpo en memoria. Para respuestas enormes, evítalo.

#### Servidor de pruebas

Para que todos los ejemplos de este módulo funcionen sin depender de internet, usaremos un servidor local.

```js
// 📄 servidor.mjs
// Servidor de pruebas. No necesitas entenderlo todavía:
// usa la API de Node (`node:http`), que verás en el Módulo 8.
import { createServer } from "node:http";

let productos = [
  { id: 1, nombre: "Camisa", precio: 20, stock: 5 },
  { id: 2, nombre: "Pantalón", precio: 35, stock: 3 },
  { id: 3, nombre: "Gorra", precio: 12.5, stock: 8 },
];

let siguienteId = 4;

function json(res, status, datos) {
  const cuerpo = JSON.stringify(datos);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(cuerpo);
}

function leerCuerpo(req) {
  return new Promise((resolve, reject) => {
    let datos = "";
    req.on("data", (trozo) => {
      datos += trozo;
    });
    req.on("end", () => {
      try {
        resolve(datos ? JSON.parse(datos) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:3000");
  const ruta = url.pathname;
  const metodo = req.method;

  if (metodo === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    });
    res.end();
    return;
  }

  if (ruta === "/api/productos" && metodo === "GET") {
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const filtrados = q
      ? productos.filter((p) => p.nombre.toLowerCase().includes(q))
      : productos;

    json(res, 200, filtrados);
    return;
  }

  const coincidencia = ruta.match(/^\/api\/productos\/(\d+)$/);

  if (coincidencia) {
    const id = Number(coincidencia[1]);
    const indice = productos.findIndex((p) => p.id === id);

    if (indice === -1) {
      json(res, 404, { error: "Producto no encontrado" });
      return;
    }

    if (metodo === "GET") {
      json(res, 200, productos[indice]);
      return;
    }

    if (metodo === "PATCH") {
      const cambios = await leerCuerpo(req);
      productos[indice] = { ...productos[indice], ...cambios, id };
      json(res, 200, productos[indice]);
      return;
    }

    if (metodo === "DELETE") {
      productos.splice(indice, 1);
      res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
      res.end();
      return;
    }
  }

  if (ruta === "/api/productos" && metodo === "POST") {
    const datos = await leerCuerpo(req);

    if (typeof datos.nombre !== "string" || typeof datos.precio !== "number") {
      json(res, 422, { error: "Datos inválidos" });
      return;
    }

    const nuevo = {
      id: siguienteId,
      nombre: datos.nombre,
      precio: datos.precio,
      stock: datos.stock ?? 0,
    };

    siguienteId += 1;
    productos.push(nuevo);
    json(res, 201, nuevo);
    return;
  }

  if (ruta === "/api/lento") {
    const ms = Number(url.searchParams.get("ms") ?? 1000);
    setTimeout(() => json(res, 200, { esperado: ms }), ms);
    return;
  }

  if (ruta.startsWith("/api/error/")) {
    const status = Number(ruta.split("/").pop());
    json(res, status, { error: `Error simulado ${status}` });
    return;
  }

  json(res, 404, { error: "Ruta no encontrada" });
});

servidor.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
```

```bash
node servidor.mjs
```

Desde otra terminal:

```bash
curl http://localhost:3000/api/productos
```

> 📌 `node:http`, `createServer` y los streams de Node son del Módulo 8. Este archivo es una herramienta de pruebas: cópialo, ejecútalo y no te preocupes por su implementación.

### 7.4.6 Enviar datos

**POST con JSON:**

```js
const nuevo = {
  nombre: "Calcetines",
  precio: 6,
  stock: 10,
};

const respuesta = await fetch("http://localhost:3000/api/productos", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(nuevo),
});

if (!respuesta.ok) {
  throw new Error(`No se pudo crear: HTTP ${respuesta.status}`);
}

const creado = await respuesta.json();
console.log(creado.id); // 4
```

⚠️ **Sin `Content-Type: application/json`, muchos servidores no parsean el cuerpo.** No basta con enviar JSON: hay que anunciarlo.

```js
// ❌ El servidor recibe texto y no sabe interpretarlo
fetch("/api/productos", {
  method: "POST",
  body: JSON.stringify(nuevo),
});
```

**`FormData`:** para formularios y archivos. El navegador pone el `Content-Type` con el `boundary` correcto; **no lo escribas tú**.

```js
// 📄 app.js (navegador)
const formulario = document.querySelector("#form-producto");
const datos = new FormData(formulario);
datos.append("origen", "web");

const respuesta = await fetch("/api/productos", {
  method: "POST",
  body: datos, // sin Content-Type manual
});

console.log(respuesta.status);
```

```js
// ❌ Rompe el boundary
fetch("/api/productos", {
  method: "POST",
  headers: { "Content-Type": "multipart/form-data" },
  body: datos,
});
```

**PUT y PATCH:**

```js
const cambios = { precio: 22 };

const respuesta = await fetch("http://localhost:3000/api/productos/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(cambios),
});

const actualizado = await respuesta.json();
console.log(actualizado.precio); // 22
```

**DELETE:**

```js
const respuesta = await fetch("http://localhost:3000/api/productos/2", {
  method: "DELETE",
});

console.log(respuesta.status); // 204
console.log(respuesta.ok); // true

if (respuesta.status !== 204) {
  const datos = await respuesta.json();
  console.log(datos);
}
```

⚠️ Un `204` **no tiene cuerpo**. Llamar `respuesta.json()` lanza `SyntaxError`.

```js
// ❌ SyntaxError: Unexpected end of JSON input
const datos = await respuesta.json();
```

```js
// ✅ Solo parsea si hay contenido
const datos = respuesta.status === 204 ? null : await respuesta.json();
```

### 7.4.7 Leer la respuesta con criterio

```js
async function pedirJson(url, opciones) {
  const respuesta = await fetch(url, opciones);

  if (!respuesta.ok) {
    let detalle = respuesta.statusText;

    try {
      const cuerpo = await respuesta.json();
      detalle = cuerpo.error ?? detalle;
    } catch {
      // el cuerpo no era JSON; nos quedamos con statusText
    }

    throw new Error(`HTTP ${respuesta.status}: ${detalle}`);
  }

  return respuesta.json();
}

const productos = await pedirJson("http://localhost:3000/api/productos");
console.log(productos.length); // 3
```

Esta función es el germen de un **cliente HTTP**: centraliza el manejo de errores y el parseo. La pulirás en 7.5.

**Cabeceras útiles:**

```js
const respuesta = await fetch("http://localhost:3000/api/productos");

console.log(respuesta.headers.get("content-type"));
// "application/json; charset=utf-8"

console.log(respuesta.headers.has("cache-control")); // false en este servidor
console.log(respuesta.url); // "http://localhost:3000/api/productos"
console.log(respuesta.redirected); // false
console.log(respuesta.type); // "basic" (mismo origen) o "cors"
```

`headers` no es un objeto plano: es un `Headers`. No puedes hacer `respuesta.headers["content-type"]`.

```js
// ❌ undefined
console.log(respuesta.headers["content-type"]);

// ✅
console.log(respuesta.headers.get("content-type"));
```

**Recorrer cabeceras:**

```js
for (const [nombre, valor] of respuesta.headers) {
  console.log(nombre, valor);
}
```

### 7.4.8 Cabeceras propias y autenticación

```js
const respuesta = await fetch("http://localhost:3000/api/productos", {
  headers: {
    Accept: "application/json",
    Authorization: "Bearer token-de-ejemplo",
    "X-Cliente": "curso-js",
  },
});
```

⚠️ **Los nombres de cabecera no distinguen mayúsculas.** `Content-Type` y `content-type` son la misma.

⚠️ **No puedes enviar cualquier cabecera desde el navegador.** Algunas están prohibidas (`Host`, `Cookie`, `Origin`…) porque las controla el navegador. Y las personalizadas disparan un **preflight** CORS (7.4.9).

**Token en memoria, no en `localStorage`:**

```js
// ❌ Un XSS puede leer el token
localStorage.setItem("token", token);

// ✅ Guárdalo en memoria o en una cookie HttpOnly puesta por el servidor
let tokenEnMemoria = token;
```

Esto ya lo viste en el Módulo 6. La razón se refuerza aquí: cualquier script inyectado puede leer `localStorage` y exfiltrar el token. Una cookie `HttpOnly` no es accesible desde JavaScript.

### 7.4.9 CORS: por qué falla y qué significa

**Origen** = protocolo + dominio + puerto. `http://localhost:3000` y `http://localhost:5173` son orígenes distintos.

La **política de mismo origen** impide que una página de `https://malicioso.com` lea respuestas de `https://banco.com`. CORS es el mecanismo que permite excepciones controladas.

**Cómo funciona:**

1. El navegador envía la petición con `Origin: https://miweb.com`.
2. El servidor responde con `Access-Control-Allow-Origin: https://miweb.com` (o `*`).
3. Si el origen no está permitido, el navegador **bloquea la lectura** de la respuesta.

```text
Access to fetch at 'http://localhost:3000/api/productos' from origin
'http://localhost:5173' has been blocked by CORS policy:
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

**Datos clave:**

| Hecho | Consecuencia |
|---|---|
| CORS lo aplica el **navegador**, no el servidor | `curl` y Node no tienen CORS |
| La petición puede llegar al servidor | El servidor ejecutó el `POST`, pero tú no puedes leer la respuesta |
| El error en JS es genérico | No puedes saber el motivo exacto por seguridad |
| `*` no vale con credenciales | Con cookies necesitas el origen exacto |

**Preflight:** si la petición no es “simple” (método distinto de GET/POST/HEAD, o `Content-Type` distinto de los tres permitidos, o cabeceras personalizadas), el navegador envía primero un `OPTIONS`.

```text
OPTIONS /api/productos HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: DELETE
Access-Control-Request-Headers: authorization
```

El servidor debe responder qué permite. Nuestro `servidor.mjs` ya lo hace.

```js
// ❌ "Arreglarlo" con no-cors: obtienes una respuesta opaca, sin datos
fetch("http://otro-origen.com/api", { mode: "no-cors" });
// respuesta.type === "opaque", status === 0, body vacío
```

⚠️ **`no-cors` no es una solución.** Solo sirve para enviar peticiones que no necesitan leer la respuesta (por ejemplo, un `POST` a un servicio de analítica). Si necesitas los datos, el servidor debe permitir tu origen.

```js
// ✅ CORS se arregla en el servidor
// Access-Control-Allow-Origin: https://miweb.com
```

**En desarrollo**, la solución habitual es un **proxy**: tu servidor de desarrollo reenvía `/api` al backend, y así todo es mismo origen. 📌 Lo verás con bundlers en el Módulo 8.

### 7.4.10 Cookies y credenciales

Por defecto, `fetch` **no** envía cookies en peticiones cross-origin.

```js
// ✅ Envía cookies (same-origin por defecto)
fetch("/api/perfil");

// ✅ Envía cookies también cross-origin
fetch("https://api.ejemplo.com/perfil", {
  credentials: "include",
});
```

| Valor | Comportamiento |
|---|---|
| `"same-origin"` (por defecto) | Cookies solo si el destino es el mismo origen |
| `"include"` | Cookies siempre (el servidor debe permitirlo) |
| `"omit"` | Nunca |

Con `"include"`, el servidor **no** puede responder `Access-Control-Allow-Origin: *`. Debe indicar el origen exacto y añadir `Access-Control-Allow-Credentials: true`.

⚠️ **Las cookies `HttpOnly` no son legibles por JavaScript**, pero el navegador las envía igual si el servidor las puso. Esa es su ventaja: un XSS no puede robarlas.

```js
// ❌ No puedes leer una cookie HttpOnly
console.log(document.cookie); // no aparece

// ✅ El navegador la envía automáticamente
await fetch("/api/perfil", { credentials: "include" });
```

### 7.4.11 Cancelar peticiones con `AbortController`

Una petición puede tardar. Si el usuario cambia de pantalla, no tiene sentido esperar la respuesta.

```js
const controller = new AbortController();

const promesa = fetch("http://localhost:3000/api/lento?ms=5000", {
  signal: controller.signal,
});

setTimeout(() => controller.abort(), 500);

try {
  const respuesta = await promesa;
  console.log(respuesta.status);
} catch (error) {
  console.log(error.name); // "AbortError"
}
```

`abort()` hace que la promesa se rechace con un `DOMException` de nombre `AbortError`. La conexión se cierra.

**Timeout nativo:**

```js
const respuesta = await fetch("http://localhost:3000/api/lento?ms=5000", {
  signal: AbortSignal.timeout(1000),
});

// AbortError: The operation was aborted due to timeout
```

`AbortSignal.timeout(ms)` crea una señal que se aborta sola. Es la forma más corta de poner un límite.

**Combinar señales:** cancelación del usuario + timeout.

```js
const controller = new AbortController();

const signal = AbortSignal.any([
  controller.signal,
  AbortSignal.timeout(3000),
]);

try {
  await fetch("http://localhost:3000/api/lento?ms=5000", { signal });
} catch (error) {
  if (error.name === "AbortError") {
    console.log("Cancelada o fuera de tiempo");
  }
}
```

**Distinguir cancelación de error real:**

```js
async function cargar(url, signal) {
  try {
    return await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") {
      return null; // intencional: no es un fallo
    }
    throw error; // esto sí es un problema
  }
}
```

⚠️ **Una señal abortada no se reutiliza.** Crea un `AbortController` nuevo por operación.

```js
// ❌ La segunda petición falla de inmediato
controller.abort();
await fetch(url1, { signal: controller.signal });
await fetch(url2, { signal: controller.signal }); // AbortError
```

**Cancelar al salir de la página:**

```js
// 📄 app.js
const controller = new AbortController();

window.addEventListener("pagehide", () => controller.abort());

const respuesta = await fetch("/api/datos", { signal: controller.signal });
```

### 7.4.12 Timeouts, reintentos y red lenta

`fetch` no tiene opción `timeout`. Usa una señal.

```js
async function fetchConTimeout(url, ms, opciones = {}) {
  const signal = AbortSignal.timeout(ms);

  try {
    return await fetch(url, { ...opciones, signal });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`La petición tardó más de ${ms} ms`, { cause: error });
    }
    throw error;
  }
}
```

```js
try {
  const respuesta = await fetchConTimeout(
    "http://localhost:3000/api/lento?ms=3000",
    1000
  );
  console.log(respuesta.status);
} catch (error) {
  console.log(error.message); // "La petición tardó más de 1000 ms"
}
```

**Combinar con reintentos (7.3.11):**

```js
// 📄 http.mjs
export async function pedir(url, opciones = {}) {
  const { intentos = 3, timeout = 5000, ...resto } = opciones;
  let ultimoError;

  for (let intento = 1; intento <= intentos; intento++) {
    try {
      const signal = AbortSignal.timeout(timeout);
      const respuesta = await fetch(url, { ...resto, signal });

      if (respuesta.status >= 500) {
        throw new Error(`HTTP ${respuesta.status}`);
      }

      return respuesta;
    } catch (error) {
      ultimoError = error;

      if (intento === intentos) break;

      const espera = 300 * 2 ** (intento - 1);
      await new Promise((resolve) => setTimeout(resolve, espera));
    }
  }

  throw new Error("La petición falló", { cause: ultimoError });
}
```

⚠️ **No reintentes `4xx`.** Este ejemplo solo reintenta errores de red y `5xx`. Un `422` no mejora por repetirlo.

⚠️ **No reintentes un `POST` no idempotente sin cuidado.** Puedes crear el recurso dos veces. Si el servidor soporta claves de idempotencia, envíalas en una cabecera.

### 7.4.13 Caché HTTP

El navegador y los proxies cachean respuestas. Tú puedes influir.

| Cabecera | Efecto |
|---|---|
| `Cache-Control: max-age=60` | Válida 60 segundos |
| `Cache-Control: no-store` | No guardar nunca |
| `ETag: "abc"` | Identificador de versión |
| `If-None-Match: "abc"` | Pregunta si sigue vigente |
| `304 Not Modified` | “Sigue vigente, usa tu copia” |

```js
// Fuerza revalidación
const respuesta = await fetch("/api/productos", {
  cache: "no-cache",
});
```

| Opción `cache` | Comportamiento |
|---|---|
| `"default"` | Usa la caché si es válida |
| `"no-store"` | Ignora y no guarda |
| `"no-cache"` | Revalida con el servidor |
| `"force-cache"` | Usa la copia aunque esté vieja |
| `"reload"` | Pide de nuevo y actualiza la caché |

📌 Los detalles de `ETag` y `304` se configuran en el servidor; los verás en un backend real. Aquí basta con saber que **una respuesta cacheada no siempre llega al servidor**.

### 7.4.14 Subir archivos y descargar blobs

**Subir con `FormData`:**

```html
<form id="subida">
  <input type="file" name="archivo" />
  <button type="submit">Subir</button>
</form>
```

```js
// 📄 app.js
const form = document.querySelector("#subida");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const datos = new FormData(form);

  const respuesta = await fetch("/api/subir", {
    method: "POST",
    body: datos,
  });

  if (!respuesta.ok) {
    console.error("Falló la subida");
    return;
  }

  console.log("Subido");
});
```

**Descargar un archivo:**

```js
const respuesta = await fetch("/api/informe.pdf");

if (!respuesta.ok) {
  throw new Error(`HTTP ${respuesta.status}`);
}

const blob = await respuesta.blob();
console.log(blob.type); // "application/pdf"
console.log(blob.size); // tamaño en bytes
```

📌 Para guardarlo en el disco del usuario se usa `URL.createObjectURL` y un enlace temporal. Es una API del navegador que verás cuando trabajes con descargas reales.

⚠️ **`fetch` no informa el progreso de subida.** Para barras de progreso se usa `XMLHttpRequest` o la API `fetch` con streams (experimental en algunos entornos). No es un límite de tu código: `fetch` no expone ese evento.

### ✅ Haz esto / ❌ Evita esto (7.4)

```js
// ✅ Comprueba `ok`
const respuesta = await fetch(url);
if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

// ✅ Anuncia el JSON
fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(datos),
});

// ✅ Construye URLs con URL y URLSearchParams
const url = new URL("/api/buscar", "https://ejemplo.com");
url.searchParams.set("q", texto);

// ✅ Timeout
fetch(url, { signal: AbortSignal.timeout(5000) });

// ✅ Distingue cancelación de fallo
async function cargar(url, signal) {
  try {
    return await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") return null;
    throw error;
  }
}

// ✅ 204 sin cuerpo
const datos = respuesta.status === 204 ? null : await respuesta.json();
```

```js
// ❌ Asumir que fetch rechaza en 404
try {
  const r = await fetch("/api/x"); // 404 no lanza
} catch {}

// ❌ Leer el cuerpo dos veces
// await respuesta.json();
// await respuesta.text(); // TypeError

// ❌ Concatenar query strings a mano
fetch(`/api/buscar?q=${texto}`); // se rompe con & o #

// ❌ Content-Type manual con FormData
fetch(url, { body: formData, headers: { "Content-Type": "multipart/form-data" } });

// ❌ Reutilizar una señal abortada
controller.abort();
fetch(url2, { signal: controller.signal });

// ❌ Resolver CORS con no-cors
fetch(url, { mode: "no-cors" }); // respuesta opaca

// ❌ Guardar el token en localStorage
localStorage.setItem("token", token);
```

---

## 7.5 — `fetch` en producción y Axios

Saber llamar a `fetch` no es lo mismo que construir una capa de datos que funcione en una aplicación real. En producción aparecen preguntas que un ejemplo de tres líneas no responde:

- ¿Dónde pongo la URL base y las cabeceras comunes?
- ¿Cómo distingo un `404` de un fallo de red?
- ¿Qué muestro mientras carga? ¿Y si no hay resultados?
- ¿Qué pasa si el usuario escribe rápido y llegan respuestas desordenadas?
- ¿Cuántas veces reintento y con qué espera?
- ¿Uso `fetch` o Axios?

Esta sección responde esas preguntas con código que puedes llevar a un proyecto.

### 7.5.1 De `fetch` suelto a un cliente HTTP

Si cada componente llama a `fetch` por su cuenta, terminas con esto repartido por toda la app:

```js
// ❌ Repetido en diez archivos, con diez variantes distintas
const respuesta = await fetch("http://localhost:3000/api/productos");
const datos = await respuesta.json();
```

Problemas:

| Problema | Consecuencia |
|---|---|
| URL base repetida | Cambiar el dominio obliga a buscar y reemplazar |
| Sin `ok` comprobado | Un `500` se trata como éxito |
| Sin timeout | Una petición colgada bloquea la interfaz |
| Sin cabeceras comunes | Cada archivo inventa las suyas |
| Sin errores tipados | No puedes distinguir `404` de red caída |

La solución es una **capa**: un módulo que centraliza cómo se habla con el servidor. Los componentes piden datos; no saben de HTTP.

```text
componente  →  servicio  →  cliente HTTP  →  fetch
   UI           dominio        transporte      red
```

### 7.5.2 Un cliente HTTP completo

```js
// 📄 http.mjs
export class HttpError extends Error {
  constructor(status, mensaje, cuerpo) {
    super(mensaje);
    this.name = "HttpError";
    this.status = status;
    this.cuerpo = cuerpo;
  }
}

export class ErrorDeRed extends Error {
  constructor(mensaje, opciones) {
    super(mensaje, opciones);
    this.name = "ErrorDeRed";
  }
}

export function crearCliente({ baseUrl, headers = {}, timeout = 8000 }) {
  async function pedir(ruta, opciones = {}) {
    const url = new URL(ruta, baseUrl);
    const signal = opciones.signal ?? AbortSignal.timeout(timeout);

    let respuesta;

    try {
      respuesta = await fetch(url, {
        ...opciones,
        signal,
        headers: {
          Accept: "application/json",
          ...headers,
          ...opciones.headers,
        },
      });
    } catch (error) {
      if (error.name === "AbortError") throw error;

      throw new ErrorDeRed(`No se pudo conectar con ${url.href}`, {
        cause: error,
      });
    }

    if (!respuesta.ok) {
      let cuerpo = null;

      try {
        cuerpo = await respuesta.json();
      } catch {
        // la respuesta de error no era JSON
      }

      throw new HttpError(
        respuesta.status,
        cuerpo?.error ?? `HTTP ${respuesta.status}`,
        cuerpo
      );
    }

    if (respuesta.status === 204) return null;

    return respuesta.json();
  }

  return {
    get: (ruta, opciones) => pedir(ruta, { ...opciones, method: "GET" }),
    post: (ruta, cuerpo, opciones) =>
      pedir(ruta, {
        ...opciones,
        method: "POST",
        headers: { "Content-Type": "application/json", ...opciones?.headers },
        body: JSON.stringify(cuerpo),
      }),
    patch: (ruta, cuerpo, opciones) =>
      pedir(ruta, {
        ...opciones,
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...opciones?.headers },
        body: JSON.stringify(cuerpo),
      }),
    delete: (ruta, opciones) => pedir(ruta, { ...opciones, method: "DELETE" }),
  };
}
```

```js
// 📄 api.mjs
import { crearCliente } from "./http.mjs";

const cliente = crearCliente({
  baseUrl: "http://localhost:3000/api/",
  headers: { "X-Cliente": "curso-js" },
});

export const api = {
  productos: () => cliente.get("productos"),
  producto: (id) => cliente.get(`productos/${id}`),
  crearProducto: (datos) => cliente.post("productos", datos),
  actualizarProducto: (id, datos) => cliente.patch(`productos/${id}`, datos),
  borrarProducto: (id) => cliente.delete(`productos/${id}`),
};
```

```js
// 📄 app.mjs
import { api } from "./api.mjs";
import { HttpError, ErrorDeRed } from "./http.mjs";

try {
  const productos = await api.productos();
  console.log(productos.length);
} catch (error) {
  if (error instanceof HttpError && error.status === 404) {
    console.log("No existe");
  } else if (error instanceof ErrorDeRed) {
    console.log("Sin conexión");
  } else if (error.name === "AbortError") {
    console.log("Cancelado");
  } else {
    throw error;
  }
}
```

**Qué has ganado:**

| Antes | Ahora |
|---|---|
| URL repetida | `baseUrl` en un sitio |
| `ok` olvidado | Siempre comprobado |
| Errores genéricos | `HttpError` con `status` |
| Sin timeout | 8 s por defecto |
| Cabeceras dispersas | Centralizadas |

> 🧠 **Regla:** la interfaz no debería saber qué es un `status` HTTP. El servicio traduce `404` a “no encontrado” y el componente decide qué pintar.

### 7.5.3 Estados de una petición: carga, éxito, error y vacío

Toda pantalla que depende de datos tiene al menos cuatro estados.

| Estado | Qué muestra |
|---|---|
| `idle` | Nada aún (o el estado anterior) |
| `loading` | Esqueleto, spinner o “Cargando…” |
| `success` | Los datos |
| `error` | Mensaje y opción de reintentar |
| `empty` | “No hay resultados” (es un éxito sin datos) |

```js
// 📄 estado.mjs
export function estadoInicial() {
  return { tipo: "idle", datos: [], error: null };
}

export function cargando() {
  return { tipo: "loading", datos: [], error: null };
}

export function exito(datos) {
  return {
    tipo: datos.length === 0 ? "empty" : "success",
    datos,
    error: null,
  };
}

export function fallo(error) {
  return { tipo: "error", datos: [], error };
}
```

```js
// 📄 app.js
import { estadoInicial, cargando, exito, fallo } from "./estado.js";

const contenedor = document.querySelector("#productos");
const mensaje = document.querySelector("#mensaje");

let estado = estadoInicial();

function render() {
  contenedor.textContent = "";
  mensaje.textContent = "";

  if (estado.tipo === "loading") {
    mensaje.textContent = "Cargando…";
    return;
  }

  if (estado.tipo === "error") {
    mensaje.textContent = "No se pudieron cargar los productos.";
    return;
  }

  if (estado.tipo === "empty") {
    mensaje.textContent = "Todavía no hay productos.";
    return;
  }

  const fragmento = document.createDocumentFragment();

  for (const producto of estado.datos) {
    const articulo = document.createElement("article");
    const titulo = document.createElement("h2");
    titulo.textContent = producto.nombre;
    const precio = document.createElement("p");
    precio.textContent = `${producto.precio.toFixed(2)} €`;
    articulo.append(titulo, precio);
    fragmento.append(articulo);
  }

  contenedor.append(fragmento);
}

async function cargar() {
  estado = cargando();
  render();

  try {
    const productos = await api.productos();
    estado = exito(productos);
  } catch (error) {
    estado = fallo(error);
  }

  render();
}

cargar();
```

⚠️ **`empty` no es `error`.** Un array vacío es una respuesta válida. Mostrar “error” cuando no hay datos confunde al usuario y esconde el problema real.

⚠️ **No borres los datos anteriores al recargar** si quieres evitar parpadeos. Puedes mantener `datos` y mostrar un indicador pequeño. Es una decisión de producto.

### 7.5.4 Búsqueda con cancelación: evitar respuestas desordenadas

Escenario clásico: el usuario escribe “ca”, luego “cam”, luego “cami”. Se lanzan tres peticiones. La de “ca” puede llegar **después** de la de “cami” y sobrescribir la lista con resultados viejos. Es una **condición de carrera**.

**Solución en dos capas:**

1. **Cancelar** la petición anterior con `AbortController` (ahorra red).
2. **Verificar** que la respuesta sigue siendo la última solicitada (protege aunque la cancelación llegue tarde).

```js
// 📄 buscador.js
const input = document.querySelector("#busqueda");
const lista = document.querySelector("#resultados");
const estadoTexto = document.querySelector("#estado");

let controller = null;
let ultimaPeticion = 0;

function debounce(funcion, espera) {
  let id = null;

  return function (...args) {
    clearTimeout(id);
    id = setTimeout(() => funcion.apply(this, args), espera);
  };
}

async function buscar(texto) {
  if (controller) controller.abort();

  controller = new AbortController();
  const signal = controller.signal;

  ultimaPeticion += 1;
  const numeroPeticion = ultimaPeticion;

  estadoTexto.textContent = "Buscando…";

  try {
    const url = new URL("/api/productos", location.origin);
    url.searchParams.set("q", texto);

    const respuesta = await fetch(url, { signal });

    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

    const datos = await respuesta.json();

    if (numeroPeticion !== ultimaPeticion) return;

    render(datos);
    estadoTexto.textContent = `${datos.length} resultado(s)`;
  } catch (error) {
    if (error.name === "AbortError") return;

    if (numeroPeticion !== ultimaPeticion) return;

    estadoTexto.textContent = "No se pudo buscar";
    console.error(error);
  }
}

const buscarConEspera = debounce((texto) => buscar(texto), 300);

input.addEventListener("input", (evento) => {
  buscarConEspera(evento.target.value.trim());
});

function render(datos) {
  lista.textContent = "";
  const fragmento = document.createDocumentFragment();

  for (const producto of datos) {
    const li = document.createElement("li");
    li.textContent = `${producto.nombre} — ${producto.precio.toFixed(2)} €`;
    fragmento.append(li);
  }

  lista.append(fragmento);
}
```

**Por qué hacen falta las dos capas:**

| Solo `abort` | Solo verificación | Ambas |
|---|---|---|
| Ahorra red | No ahorra red | ✅ |
| Si la respuesta ya llegó, no la detiene | Evita pintar datos viejos | ✅ |
| Puede dejar `catch` ruidosos | Puede ejecutar trabajo inútil | ✅ |

⚠️ **Comprueba `numeroPeticion !== ultimaPeticion` también en el `catch`.** Un error de una petición vieja no debe pisar el mensaje de la nueva.

### 7.5.5 Deduplicar y cachear en memoria

Si dos componentes piden lo mismo al mismo tiempo, se hacen dos peticiones. Puedes compartir la promesa en curso.

```js
// 📄 cache.mjs
export function crearCache(ttlMs = 30_000) {
  const entradas = new Map();

  return {
    async obtener(clave, cargar) {
      const ahora = Date.now();
      const existente = entradas.get(clave);

      if (existente && ahora - existente.tiempo < ttlMs) {
        return existente.promesa;
      }

      const promesa = cargar().catch((error) => {
        entradas.delete(clave); // no cachees fallos
        throw error;
      });

      entradas.set(clave, { promesa, tiempo: ahora });
      return promesa;
    },

    invalidar(clave) {
      entradas.delete(clave);
    },

    limpiar() {
      entradas.clear();
    },
  };
}
```

```js
// 📄 uso.mjs
import { crearCache } from "./cache.mjs";

const cache = crearCache(10_000);

async function obtenerProductos() {
  return cache.obtener("productos", async () => {
    const respuesta = await fetch("http://localhost:3000/api/productos");
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
    return respuesta.json();
  });
}

const [a, b] = await Promise.all([obtenerProductos(), obtenerProductos()]);
console.log(a === b); // true — misma promesa, una sola petición
```

**Claves del diseño:**

| Decisión | Por qué |
|---|---|
| Guardar la **promesa**, no el resultado | Deduplica peticiones simultáneas |
| Borrar en caso de error | Un fallo no debe quedarse cacheado 30 s |
| TTL | Los datos cambian; la caché debe caducar |
| `invalidar` | Tras un `POST`/`PATCH`, los datos viejos sobran |

⚠️ **Invalida después de mutar.**

```js
await api.crearProducto(datos);
cache.invalidar("productos"); // la próxima lectura pide de nuevo
```

⚠️ **Una caché sin TTL es una fuente de bugs.** En el Módulo 6 viste lo mismo con `localStorage`: guardar no es el problema; no saber cuándo caduca, sí.

### 7.5.6 Paginación

Las APIs devuelven datos por páginas. Hay dos estilos comunes.

**Offset/limit:**

```json
{
  "items": [{ "id": 1 }],
  "total": 120,
  "page": 1,
  "pageSize": 20
}
```

**Cursor:**

```json
{
  "items": [{ "id": 21 }],
  "siguiente": "cursor_abc123"
}
```

```js
// 📄 paginacion.mjs
export function crearPaginador(cargarPagina, { tamano = 20 } = {}) {
  let pagina = 1;
  let items = [];
  let terminado = false;
  let cargando = false;

  return {
    get items() {
      return items;
    },

    get terminado() {
      return terminado;
    },

    async siguiente() {
      if (cargando || terminado) return items;

      cargando = true;

      try {
        const datos = await cargarPagina({ pagina, tamano });

        items = [...items, ...datos.items];
        terminado = datos.items.length < tamano;
        pagina += 1;

        return items;
      } finally {
        cargando = false;
      }
    },

    reiniciar() {
      pagina = 1;
      items = [];
      terminado = false;
    },
  };
}
```

```js
// 📄 uso.mjs
import { crearPaginador } from "./paginacion.mjs";

const paginador = crearPaginador(async ({ pagina, tamano }) => {
  const url = new URL("http://localhost:3000/api/productos");
  url.searchParams.set("page", String(pagina));
  url.searchParams.set("pageSize", String(tamano));

  const respuesta = await fetch(url);
  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);
  return respuesta.json();
});

await paginador.siguiente();
console.log(paginador.items.length);
```

⚠️ **La guarda `cargando` evita dobles cargas.** Sin ella, dos scrolls rápidos pueden disparar la misma página dos veces y duplicar elementos.

⚠️ **`terminado` debe basarse en el tamaño recibido**, no en un total que puede cambiar mientras paginas.

### 7.5.7 Reintentos aplicados

Ya tienes `conReintentos` de 7.3.11. Aplícalo solo a lo que tiene sentido:

```js
// 📄 api-reintentos.mjs
import { conReintentos } from "./reintentos.mjs";
import { HttpError, ErrorDeRed } from "./http.mjs";

export async function cargarConReintentos(operacion) {
  return conReintentos(operacion, {
    intentos: 3,
    esperaBase: 400,
  });
}

export function esReintentable(error) {
  if (error instanceof ErrorDeRed) return true;
  if (error instanceof HttpError) {
    return error.status === 429 || error.status >= 500;
  }
  return false;
}
```

```js
// 📄 uso.mjs
import { cargarConReintentos, esReintentable } from "./api-reintentos.mjs";

async function obtener() {
  try {
    return await cargarConReintentos(() => api.productos());
  } catch (error) {
    if (!esReintentable(error.cause ?? error)) {
      throw error;
    }
    throw error;
  }
}
```

⚠️ **Reintentar un `POST` puede duplicar.** Si el servidor no garantiza idempotencia, no lo hagas. Para pagos, usa una **clave de idempotencia** acordada con el backend.

### 7.5.8 Axios

**Axios** es una librería HTTP que funciona en navegador y Node. Durante años fue la opción por defecto porque `fetch` no existía o era incómodo. Hoy `fetch` cubre casi todo, pero Axios sigue teniendo ventajas concretas.

📌 En el navegador puedes cargarlo desde un CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

📌 Con un proyecto y `npm` (Módulo 8) sería:

```bash
npm install axios
```

```js
// 📌 Con bundler (Módulo 8)
import axios from "axios";
```

**Uso básico:**

```js
// 📄 app.js (con Axios cargado por CDN)
const respuesta = await axios.get("http://localhost:3000/api/productos");

console.log(respuesta.status); // 200
console.log(respuesta.data.length); // 3
```

Fíjate en la diferencia: Axios **ya parsea el JSON** y lo pone en `data`. No hay `await respuesta.json()`.

| `fetch` | Axios |
|---|---|
| `respuesta.json()` | `respuesta.data` |
| `respuesta.ok` | Rechaza en `4xx`/`5xx` |
| `respuesta.status` | `respuesta.status` |
| `JSON.stringify(body)` + header | `axios.post(url, objeto)` |
| `?a=1&b=2` a mano | `{ params: { a: 1, b: 2 } }` |

**Configuración por defecto:**

```js
const api = axios.create({
  baseURL: "http://localhost:3000/api",
  timeout: 8000,
  headers: { "X-Cliente": "curso-js" },
});

const productos = await api.get("/productos");
console.log(productos.data);
```

**Enviar datos:**

```js
const nuevo = await api.post("/productos", {
  nombre: "Calcetines",
  precio: 6,
  stock: 10,
});

console.log(nuevo.status); // 201
console.log(nuevo.data.id); // 4
```

**Parámetros de consulta:**

```js
const respuesta = await api.get("/productos", {
  params: { q: "camisa", page: 2 },
});

console.log(respuesta.config.url);
// "/productos" — Axios añade la query al enviar
```

**Errores:**

```js
try {
  await api.get("/productos/999");
} catch (error) {
  if (axios.isAxiosError(error)) {
    console.log(error.response?.status); // 404
    console.log(error.response?.data); // { error: "Producto no encontrado" }
    console.log(error.code); // "ERR_BAD_REQUEST"
  }
}
```

⚠️ **Sin respuesta, `error.response` es `undefined`.** Ocurre con fallos de red, timeout o cancelación.

```js
// Dentro del catch:
// if (!error.response) {
//   console.log("Sin respuesta del servidor");
// }
```

**No lanzar en ciertos estados:**

```js
const respuesta = await api.get("/productos/999", {
  validateStatus: (status) => status < 500,
});

console.log(respuesta.status); // 404, sin excepción
```

Esto es útil cuando un `404` es un resultado esperado, no un fallo.

**Interceptores:** funciones que se ejecutan antes de cada petición o después de cada respuesta.

```js
api.interceptors.request.use((config) => {
  const token = obtenerTokenEnMemoria();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (respuesta) => respuesta,
  (error) => {
    if (error.response?.status === 401) {
      cerrarSesion();
    }

    return Promise.reject(error);
  }
);
```

**Para qué sirven:**

| Interceptor | Uso típico |
|---|---|
| Request | Añadir token, idioma, correlation id |
| Request | Registrar duración |
| Response | Refrescar token en `401` |
| Response | Convertir errores a tu clase |
| Response | Mostrar notificación global |

⚠️ **Un interceptor mal usado esconde lógica.** No metas reglas de negocio ahí: un `401` que cierra sesión está bien; un `401` que además borra el carrito y redirige según el rol, no.

**Cancelación:**

```js
const controller = new AbortController();

const promesa = api.get("/lento", { signal: controller.signal });
controller.abort();

try {
  await promesa;
} catch (error) {
  if (axios.isCancel(error)) {
    console.log("Cancelada");
  }
}
```

Axios acepta `signal` estándar. Las versiones antiguas usaban `CancelToken`; hoy se prefiere `AbortController`.

⚠️ **Axios y `fetch` no comparten la misma forma de error.** Si migras, revisa todos los `catch`.

### 7.5.9 `fetch` o Axios

| Criterio | `fetch` | Axios |
|---|---|---|
| Nativo | ✅ Sin dependencias | ❌ Hay que instalarlo |
| Tamaño | 0 KB | ~13 KB minificado |
| Parseo JSON | Manual | Automático en `data` |
| Rechaza en `4xx` | ❌ | ✅ |
| Interceptores | ❌ (los escribes tú) | ✅ |
| Progreso de subida | ❌ | ✅ en navegador |
| Timeout | `AbortSignal.timeout` | `timeout` |
| Cancelación | `AbortController` | `AbortController` |
| Node y navegador | ✅ | ✅ |
| Control total | ✅ | Menos |

**Recomendación:**

- **`fetch`** si quieres cero dependencias, control fino o trabajas en un entorno moderno.
- **Axios** si tu equipo ya lo usa, necesitas interceptores, progreso de subida o una API uniforme en muchos proyectos.
- **Nunca ambos** en la misma capa sin motivo. Dos formas de pedir datos duplican el manejo de errores.

> 🧠 **Regla:** elige uno y envuélvelo en tu propio cliente. Así el resto de la app no depende de la librería y puedes cambiarla sin tocar cien archivos.

### ✅ Haz esto / ❌ Evita esto (7.5)

```js
// ✅ Un cliente con baseUrl, timeout y errores tipados
const api = crearCliente({ baseUrl: "/api/" });

// ✅ Comprueba `ok` una sola vez, en el cliente
if (!respuesta.ok) {
  throw new HttpError(respuesta.status, `HTTP ${respuesta.status}`, null);
}

// ✅ Modela los estados de la interfaz
estado = exito(datos); // distingue success de empty

// ✅ Cancela la búsqueda anterior
controller?.abort();
controller = new AbortController();

// ✅ Verifica que la respuesta es la última
// if (numeroPeticion !== ultimaPeticion) return;

// ✅ Invalida la caché tras mutar
await api.crearProducto(datos);
cache.invalidar("productos");

// ✅ Reintenta solo 5xx, 429 y fallos de red
```

```js
// ❌ `fetch` repartido por todos los componentes
const r = await fetch("/api/productos");

// ❌ Tratar un 500 como éxito
const datos = await respuesta.json();

// ❌ Mostrar "error" cuando la lista está vacía
if (datos.length === 0) mostrarError();

// ❌ Lanzar peticiones sin cancelar al escribir
input.addEventListener("input", () => buscar(valor));

// ❌ Cachear para siempre
cache.set("productos", datos); // sin TTL ni invalidación

// ❌ Reintentar un POST no idempotente
conReintentos(() => api.crearPedido(pedido), { intentos: 5 });

// ❌ Mezclar fetch y Axios en la misma capa
```

---

## 7.6 — JSON a fondo

**JSON** (JavaScript Object Notation) es un formato de texto para representar datos. Nació en 2001 como alternativa a XML y hoy es el idioma común de las APIs, los archivos de configuración y el almacenamiento del navegador.

No es JavaScript. Es un subconjunto con reglas propias. Confundirlos es el origen de la mitad de los bugs de serialización.

### 7.6.1 Qué es y qué no es JSON

```json
{
  "id": 1,
  "nombre": "Camisa",
  "precio": 20.5,
  "disponible": true,
  "etiquetas": ["oferta", "nuevo"],
  "dimensiones": { "ancho": 30, "alto": 40 },
  "descuento": null
}
```

**Tipos permitidos:**

| Tipo JSON | Ejemplo |
|---|---|
| Objeto | `{ "a": 1 }` |
| Array | `[1, 2, 3]` |
| String | `"hola"` (siempre comillas dobles) |
| Número | `42`, `-3.5`, `1e10` |
| Booleano | `true`, `false` |
| `null` | `null` |

**Lo que JSON no permite:**

```json
{
  "comentario": "esto no es JSON válido",
  "comillas": 'simples',
  "sinComillas": valor,
  "undefined": undefined,
  "funcion": function () {},
  "fecha": new Date(),
  "nan": NaN,
  "infinito": Infinity,
  "hex": 0xFF,
  "trailing": [1, 2, 3,],
}
```

Nada de eso es JSON. Es “parecido a JavaScript”, que es justo la trampa.

| JavaScript | JSON |
|---|---|
| `'texto'` o `"texto"` | Solo `"texto"` |
| `{ a: 1 }` | `{ "a": 1 }` (claves con comillas) |
| Comentarios `//` | No existen |
| `undefined` | No existe (se omite) |
| `NaN`, `Infinity` | No existen (se convierten en `null`) |
| Fechas, `Map`, `Set` | No existen como tipo |
| Coma final | Prohibida |

> 🧠 **Regla:** si no lo puedes escribir en un archivo `.json` y que un validador lo acepte, no es JSON.

### 7.6.2 `JSON.stringify`

Convierte un valor de JavaScript en texto JSON.

```js
const producto = {
  id: 1,
  nombre: "Camisa",
  precio: 20.5,
  etiquetas: ["oferta"],
};

const texto = JSON.stringify(producto);
console.log(texto);
// '{"id":1,"nombre":"Camisa","precio":20.5,"etiquetas":["oferta"]}'
```

**Tercer argumento: indentación.**

```js
console.log(JSON.stringify(producto, null, 2));
```

```json
{
  "id": 1,
  "nombre": "Camisa",
  "precio": 20.5,
  "etiquetas": ["oferta"]
}
```

| Valor de `space` | Efecto |
|---|---|
| `0` o ausente | Sin espacios (compacto) |
| `2` | Dos espacios por nivel |
| `"\t"` | Tabulaciones |
| `> 10` | Se recorta a 10 |

La versión compacta pesa menos y es la que se envía por red. La indentada es para leer y depurar.

**Segundo argumento: `replacer` como array.** Filtra qué claves se incluyen.

```js
const usuario = {
  id: 1,
  nombre: "Ana",
  password: "secreto",
  token: "abc123",
};

const seguro = JSON.stringify(usuario, ["id", "nombre"]);
console.log(seguro); // '{"id":1,"nombre":"Ana"}'
```

**`replacer` como función.** Decide caso por caso.

```js
const usuario = {
  id: 1,
  nombre: "Ana",
  password: "secreto",
};

const texto = JSON.stringify(usuario, (clave, valor) => {
  if (clave === "password") return undefined; // se omite
  return valor;
});

console.log(texto); // '{"id":1,"nombre":"Ana"}'
```

⚠️ Devolver `undefined` **omite la clave**. Devolver `null` la incluye con `null`.

```js
JSON.stringify({ a: 1, b: 2 }, (clave, valor) => (clave === "b" ? null : valor));
// '{"a":1,"b":null}'
```

**`toJSON`:** un objeto puede definir cómo se serializa.

```js
const pedido = {
  id: 7,
  fecha: new Date("2026-03-01T10:00:00Z"),
  total: 99.9,

  toJSON() {
    return {
      id: this.id,
      fecha: this.fecha.toISOString(),
      total: this.total,
    };
  },
};

console.log(JSON.stringify(pedido));
// '{"id":7,"fecha":"2026-03-01T10:00:00.000Z","total":99.9}'
```

`Date` ya trae su propio `toJSON`, por eso se serializa como string ISO. Es la razón por la que una fecha “sobrevive” al `stringify` pero vuelve como string al parsear.

**Claves omitidas:**

```js
const objeto = {
  a: 1,
  b: undefined,
  c: () => {},
  d: Symbol("x"),
};

console.log(JSON.stringify(objeto)); // '{"a":1}'
```

En arrays, en cambio, esos valores se convierten en `null` para no romper los índices:

```js
console.log(JSON.stringify([1, undefined, () => {}, Symbol("x")]));
// '[1,null,null,null]'
```

**Orden de las claves:** JSON no garantiza orden semántico, pero `stringify` respeta el orden de inserción, salvo las claves numéricas, que van primero y ordenadas.

```js
const obj = { b: 1, 2: "dos", a: 2, 1: "uno" };
console.log(JSON.stringify(obj)); // '{"1":"uno","2":"dos","b":1,"a":2}'
```

⚠️ **No dependas del orden para comparar.** Dos objetos con las mismas claves en distinto orden producen strings distintos.

```js
console.log(JSON.stringify({ a: 1, b: 2 }) === JSON.stringify({ b: 2, a: 1 }));
// false
```

**Referencias circulares:** `stringify` lanza `TypeError`.

```js
const a = { nombre: "a" };
const b = { nombre: "b", a };
a.b = b;

try {
  JSON.stringify(a);
} catch (error) {
  console.log(error.name); // "TypeError"
  console.log(error.message); // "Converting circular structure to JSON"
}
```

Para serializar un grafo con ciclos necesitas un formato propio o una librería. `structuredClone` sí maneja ciclos, pero no produce texto.

### 7.6.3 `JSON.parse`

Convierte texto JSON en valores de JavaScript.

```js
const texto = '{"id":1,"nombre":"Camisa","precio":20.5}';
const producto = JSON.parse(texto);

console.log(producto.nombre); // "Camisa"
console.log(typeof producto.precio); // "number"
```

**Errores de sintaxis:**

```js
try {
  JSON.parse("{nombre: 'Camisa'}");
} catch (error) {
  console.log(error.name); // "SyntaxError"
  console.log(error.message);
  // 'Expected property name or '}' in JSON at position 1'
}
```

⚠️ **El mensaje cambia entre motores y versiones.** No lo parsees ni lo muestres tal cual al usuario. Comprueba `error instanceof SyntaxError`.

**Segundo argumento: `reviver`.** Transforma valores mientras se parsean.

```js
const texto = '{"fecha":"2026-03-01T10:00:00.000Z","total":99.9}';

const pedido = JSON.parse(texto, (clave, valor) => {
  if (clave === "fecha") return new Date(valor);
  return valor;
});

console.log(pedido.fecha instanceof Date); // true
console.log(pedido.fecha.getFullYear()); // 2026
```

⚠️ **El `reviver` se ejecuta de abajo arriba** (primero los valores hoja) y también recibe la raíz con clave `""`.

```js
JSON.parse('{"a":{"b":1}}', (clave, valor) => {
  console.log("clave:", JSON.stringify(clave));
  return valor;
});
```

Salida:

```text
clave: "b"
clave: "a"
clave: ""
```

**Números grandes:** JSON no distingue enteros de decimales; todos son `number` (doble precisión).

```js
const texto = '{"id":9007199254740993}';
const dato = JSON.parse(texto);

console.log(dato.id); // 9007199254740992 — perdió precisión
console.log(Number.isSafeInteger(dato.id)); // false
```

Los IDs de bases de datos grandes (por encima de `2^53 - 1`) se corrompen. Soluciones:

| Solución | Cuándo |
|---|---|
| Enviar el ID como string | Lo más común en APIs |
| `BigInt` + parser propio | Si necesitas aritmética |
| Librería con `JSON.parse` de precisión arbitraria | Casos extremos |

```js
// ✅ El servidor envía strings para IDs grandes
const texto = '{"id":"9007199254740993"}';
const dato = JSON.parse(texto);
console.log(dato.id); // "9007199254740993"
```

### 7.6.4 Qué se pierde al serializar

Esta tabla deberías tenerla pegada al monitor.

| Valor original | `JSON.stringify` | Al parsear |
|---|---|---|
| `undefined` (en objeto) | Se omite la clave | No existe |
| `undefined` (en array) | `null` | `null` |
| Función | Se omite / `null` en array | No existe |
| `Symbol` | Se omite / `null` en array | No existe |
| `NaN` | `null` | `null` |
| `Infinity` | `null` | `null` |
| `-Infinity` | `null` | `null` |
| `Date` | String ISO | String, no `Date` |
| `Map` | `{}` | `{}` |
| `Set` | `{}` | `{}` |
| `RegExp` | `{}` | `{}` |
| `Error` | `{}` (o `{ name, message }` si defines `toJSON`) | `{}` |
| Instancia de clase | Solo propiedades propias | Objeto plano, sin prototipo |
| `BigInt` | `TypeError` | — |
| Referencia circular | `TypeError` | — |
| `-0` | `0` | `0` |

```js
const original = {
  indefinido: undefined,
  nulo: null,
  nan: NaN,
  fecha: new Date("2026-01-01T00:00:00Z"),
  mapa: new Map([["a", 1]]),
  set: new Set([1, 2]),
  regex: /abc/g,
  error: new Error("fallo"),
};

console.log(JSON.stringify(original, null, 2));
```

```json
{
  "nulo": null,
  "nan": null,
  "fecha": "2026-01-01T00:00:00.000Z",
  "mapa": {},
  "set": {},
  "regex": {},
  "error": {}
}
```

**Instancias de clase:** pierden el prototipo y los métodos.

```js
class Usuario {
  constructor(nombre) {
    this.nombre = nombre;
  }

  saludar() {
    return `Hola, ${this.nombre}`;
  }
}

const usuario = new Usuario("Ana");
const texto = JSON.stringify(usuario);
const recuperado = JSON.parse(texto);

console.log(recuperado); // { nombre: "Ana" }
console.log(recuperado instanceof Usuario); // false
console.log(typeof recuperado.saludar); // "undefined"
```

Si necesitas reconstruir la clase, hazlo explícitamente:

```js
const recuperado = new Usuario(JSON.parse(texto).nombre);
console.log(recuperado.saludar()); // "Hola, Ana"
```

**`BigInt`:**

```js
try {
  JSON.stringify({ id: 10n });
} catch (error) {
  console.log(error.name); // "TypeError"
  console.log(error.message); // "Do not know how to serialize a BigInt"
}
```

Solución: convertirlo a string en un `replacer`.

```js
const texto = JSON.stringify({ id: 10n }, (clave, valor) =>
  typeof valor === "bigint" ? valor.toString() : valor
);

console.log(texto); // '{"id":"10"}'
```

### 7.6.5 `structuredClone` frente a JSON

Para **copiar en memoria**, `structuredClone` es casi siempre mejor.

```js
const original = {
  fecha: new Date("2026-01-01T00:00:00Z"),
  mapa: new Map([["a", 1]]),
  set: new Set([1, 2]),
  regex: /abc/g,
  indefinido: undefined,
  nan: NaN,
};

const copia = structuredClone(original);

console.log(copia.fecha instanceof Date); // true
console.log(copia.mapa.get("a")); // 1
console.log(copia.set.has(2)); // true
console.log(copia.regex instanceof RegExp); // true
console.log(copia.indefinido); // undefined
console.log(Number.isNaN(copia.nan)); // true
```

| Necesitas | Usa |
|---|---|
| Copiar en memoria, mismo proceso | `structuredClone` |
| Enviar por red o guardar en texto | `JSON.stringify` |
| Guardar en `localStorage` | `JSON.stringify` + validación |
| Copiar con funciones o prototipos | Copia manual o librería |
| Compatibilidad con navegadores antiguos | `structuredClone` no existe antes de 2022; usa un fallback |

⚠️ `structuredClone` **no copia funciones**. Lanza `DataCloneError`.

```js
try {
  structuredClone({ fn: () => {} });
} catch (error) {
  console.log(error.name); // "DataCloneError"
}
```

⚠️ `structuredClone` **no copia el prototipo de una clase**: devuelve un objeto plano.

```js
class Punto {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  distancia() {
    return Math.hypot(this.x, this.y);
  }
}

const copia = structuredClone(new Punto(3, 4));
console.log(copia instanceof Punto); // false
console.log(copia.distancia); // undefined
```

### 7.6.6 Validar datos externos

Todo JSON que viene de fuera —una API, `localStorage`, un archivo— es **no confiable**. Parsear no es validar.

```js
// ❌ Parsear y confiar
const datos = JSON.parse(texto);
console.log(datos.usuario.nombre.toUpperCase()); // puede romper
```

```js
// ✅ Parsear, validar y normalizar
function normalizarUsuario(valor) {
  if (!valor || typeof valor !== "object" || Array.isArray(valor)) {
    return null;
  }

  if (typeof valor.id !== "number") return null;
  if (typeof valor.nombre !== "string") return null;

  return {
    id: valor.id,
    nombre: valor.nombre.trim(),
    email: typeof valor.email === "string" ? valor.email.trim() : "",
    activo: Boolean(valor.activo),
  };
}
```

**Comprobaciones que casi siempre necesitas:**

| Comprobación | Ejemplo |
|---|---|
| Es un objeto y no `null` | `typeof v === "object" && v !== null` |
| No es un array donde esperas objeto | `!Array.isArray(v)` |
| La clave existe | `Object.hasOwn(v, "id")` |
| El tipo es correcto | `typeof v.id === "number"` |
| El array contiene lo esperado | `Array.isArray(v.items)` |
| El valor está en un rango | `v.edad >= 0 && v.edad <= 120` |
| El string no está vacío | `v.nombre.trim() !== ""` |

⚠️ **`Object.hasOwn` frente a `in`:** `in` mira la cadena de prototipos; `hasOwn` solo las propias.

```js
const objeto = { a: 1 };

console.log("toString" in objeto); // true — heredado
console.log(Object.hasOwn(objeto, "toString")); // false
```

**Validar un array:**

```js
function normalizarProductos(valor) {
  if (!Array.isArray(valor)) return [];

  return valor
    .filter((p) => p && typeof p === "object")
    .filter((p) => typeof p.id === "number" && typeof p.nombre === "string")
    .map((p) => ({
      id: p.id,
      nombre: p.nombre.trim(),
      precio: typeof p.precio === "number" && p.precio >= 0 ? p.precio : 0,
      stock: Number.isInteger(p.stock) && p.stock >= 0 ? p.stock : 0,
    }));
}
```

```js
const entrada = [
  { id: 1, nombre: "Camisa", precio: 20, stock: 5 },
  { id: "2", nombre: "Pantalón", precio: 35 },
  { nombre: "Sin id" },
  null,
];

console.log(normalizarProductos(entrada));
// [{ id: 1, nombre: "Camisa", precio: 20, stock: 5 }]
```

**Un validador devuelve errores, no `console.log`:**

```js
function validarProducto(valor) {
  const errores = [];

  if (!valor || typeof valor !== "object") {
    return ["El producto debe ser un objeto"];
  }

  if (!Number.isInteger(valor.id)) errores.push("id debe ser entero");
  if (typeof valor.nombre !== "string") errores.push("nombre debe ser texto");
  if (typeof valor.precio !== "number") errores.push("precio debe ser número");

  return errores;
}

console.log(validarProducto({ id: 1, nombre: "Camisa", precio: 20 })); // []
console.log(validarProducto({ id: "1" }));
// ["id debe ser entero", "nombre debe ser texto", "precio debe ser número"]
```

📌 Para esquemas complejos existen librerías como Zod o Valibot. Las verás cuando trabajes con un proyecto real; aquí lo importante es el hábito: **valida la forma antes de usar el dato.**

### 7.6.7 Versionar y migrar datos guardados

Cuando guardas JSON en `localStorage` o en un archivo, el formato cambiará. Si no lo versionas, los datos viejos romperán la app nueva.

```json
{
  "version": 2,
  "datos": {
    "tareas": [{ "id": 1, "texto": "Estudiar", "hecha": false }]
  }
}
```

```js
// 📄 migracion.mjs
const VERSION_ACTUAL = 2;

function migrarV1(datos) {
  return {
    tareas: (datos.tareas ?? []).map((t) => ({
      id: t.id,
      texto: t.texto,
      hecha: Boolean(t.completada), // v1 usaba "completada"
    })),
  };
}

export function cargarEstado(texto) {
  if (texto === null) return { tareas: [] };

  let bruto;

  try {
    bruto = JSON.parse(texto);
  } catch {
    return { tareas: [] };
  }

  // Formato antiguo: un array suelto, sin versión
  if (Array.isArray(bruto)) {
    return migrarV1({ tareas: bruto });
  }

  if (!bruto || typeof bruto !== "object") return { tareas: [] };

  let datos = bruto.datos ?? {};
  let version = Number(bruto.version) || 1;

  if (version === 1) {
    datos = migrarV1(datos);
    version = 2;
  }

  if (version !== VERSION_ACTUAL) return { tareas: [] };

  return { tareas: Array.isArray(datos.tareas) ? datos.tareas : [] };
}

export function guardarEstado(estado) {
  return JSON.stringify({ version: VERSION_ACTUAL, datos: estado });
}
```

```js
// 📄 uso.mjs
import { cargarEstado, guardarEstado } from "./migracion.mjs";

const viejo = JSON.stringify([
  { id: 1, texto: "Estudiar", completada: true },
]);

const estado = cargarEstado(viejo);
console.log(estado.tareas[0].hecha); // true

const nuevo = guardarEstado(estado);
console.log(JSON.parse(nuevo).version); // 2
```

**Reglas de migración:**

| Regla | Por qué |
|---|---|
| Guarda siempre un número de versión | Sabes qué formato estás leyendo |
| Migra paso a paso (v1→v2→v3) | No escribas un salto que nadie probó |
| Si no puedes migrar, descarta con aviso | Mejor vacío que corrupto |
| Nunca borres datos del usuario sin avisar | Se pierde la confianza |
| Prueba con datos reales viejos | Los casos raros son los que rompen |

> 🧠 **Regla:** todo dato persistido es una API pública con tu yo del futuro. Versiónalo desde el primer día.

### 7.6.8 JSON en el mundo real

| Archivo | Para qué |
|---|---|
| `package.json` | Dependencias, scripts y metadatos de un proyecto Node |
| `tsconfig.json` | Configuración de TypeScript |
| `.eslintrc.json` | Reglas de lint |
| `manifest.json` | Extensiones de navegador |
| `data.json` | Datos estáticos |

📌 `package.json` y el ecosistema de Node son del Módulo 8.

**JSON Lines (JSONL):** un JSON por línea. Útil para logs y datasets grandes porque se puede procesar línea a línea sin cargar todo en memoria.

```text
{"id":1,"evento":"login","ts":"2026-01-01T10:00:00Z"}
{"id":2,"evento":"compra","ts":"2026-01-01T10:05:00Z"}
```

```js
const lineas = [
  '{"id":1,"evento":"login"}',
  '{"id":2,"evento":"compra"}',
];

const eventos = lineas.map((linea) => JSON.parse(linea));
console.log(eventos.map((e) => e.evento)); // ["login", "compra"]
```

**Content-Type:** al recibir una respuesta, comprueba que realmente sea JSON.

```js
async function pedirJson(url) {
  const respuesta = await fetch(url);
  const tipo = respuesta.headers.get("content-type") ?? "";

  if (!tipo.includes("application/json")) {
    throw new Error(`Se esperaba JSON y llegó "${tipo}"`);
  }

  return respuesta.json();
}
```

⚠️ Un servidor mal configurado puede devolver HTML con estado `200`. Sin comprobar el `Content-Type`, tu `respuesta.json()` fallará con un `SyntaxError` confuso.

### 7.6.9 Seguridad al parsear JSON

**1. Tamaño.** Un JSON enorme puede agotar memoria.

```js
// ❌ Sin límite
const datos = JSON.parse(textoDeVariosGB);
```

En el navegador, el límite práctico lo pone el navegador; en Node, tu proceso. Valida `texto.length` antes de parsear si el dato viene de fuera.

**2. Profundidad.** Un JSON muy anidado puede provocar desbordamiento de pila en validadores recursivos.

```js
function profundidad(valor) {
  if (valor === null || typeof valor !== "object") return 0;

  let max = 0;

  for (const clave of Object.keys(valor)) {
    max = Math.max(max, profundidad(valor[clave]));
  }

  return 1 + max;
}

console.log(profundidad({ a: { b: { c: 1 } } })); // 3
```

**3. Prototype pollution.** Un JSON con `"__proto__"` puede contaminar objetos si lo fusionas sin cuidado.

```js
const malicioso = JSON.parse('{"__proto__":{"admin":true}}');

const destino = {};
Object.assign(destino, malicioso);

console.log({}.admin); // true — ¡se contaminó Object.prototype!
```

```js
// ✅ Copia solo claves propias y bloquea las peligrosas
function fusionarSeguro(destino, origen) {
  const prohibidas = new Set(["__proto__", "constructor", "prototype"]);

  for (const clave of Object.keys(origen)) {
    if (prohibidas.has(clave)) continue;
    destino[clave] = origen[clave];
  }

  return destino;
}

const limpio = fusionarSeguro({}, malicioso);
console.log(limpio.admin); // undefined
console.log({}.admin); // undefined
```

⚠️ `JSON.parse` por sí solo **no** contamina: el problema aparece al fusionar el resultado en un objeto existente. Aun así, filtra siempre.

**4. Nunca uses `eval` para parsear JSON.**

```js
// ❌ Ejecuta código arbitrario
const datosInseguros = eval("(" + texto + ")");

// ✅
const datos = JSON.parse(texto);
```

**5. No confíes en el `Content-Type` del cliente.** Si eres el servidor, valida el cuerpo con un esquema. Si eres el cliente, valida la forma.

### ✅ Haz esto / ❌ Evita esto (7.6)

```js
// ✅ Serializa con intención
function serializar(datos) {
  return JSON.stringify(datos);
}

// ✅ Omite campos sensibles
JSON.stringify(usuario, ["id", "nombre"]);

// ✅ Fechas explícitas
JSON.stringify({ fecha: fecha.toISOString() });

// ✅ Parsea con try/catch
function parsear(texto) {
  try {
    return JSON.parse(texto);
  } catch {
    return null;
  }
}

// ✅ Valida la forma antes de usar
function aceptar(datos) {
  if (!esProductoValido(datos)) return null;
  return datos;
}

// ✅ Versiona lo persistido
JSON.stringify({ version: 2, datos });

// ✅ structuredClone para copiar en memoria
const copia = structuredClone(objeto);
```

```js
// ❌ Copiar con JSON y perder tipos
const copia = JSON.parse(JSON.stringify(objeto));

// ❌ Confiar en el JSON de la API
const datos = await respuesta.json();
datos.usuario.nombre.toUpperCase();

// ❌ Comparar objetos por su JSON
if (JSON.stringify(a) === JSON.stringify(b)) {}

// ❌ IDs grandes como number
// const malo = { "id": 9007199254740993 };

// ❌ Fusionar JSON externo sin filtrar claves
Object.assign(config, JSON.parse(texto));

// ❌ Parsear sin try/catch
const sinRed = JSON.parse(localStorage.getItem("datos"));
```

---

## 7.7 — Expresiones regulares

Una **expresión regular** (regex) es un patrón de texto. Lo usas para responder preguntas como: ¿este string tiene la forma de un email?, ¿qué partes de esta línea son números?, ¿cómo reemplazo todas las fechas por otro formato?

Ya las has usado sin formalizarlas: `replaceAll`, `split`, `match` en el servidor de pruebas, `normalize("NFD").replace(/[\u0300-\u036f]/g, "")` en 7.2. Aquí las aprenderás desde cero.

> ⚠️ **Advertencia honesta:** las regex son potentes y peligrosas. Un patrón mal escrito puede ser ilegible, aceptar datos inválidos o congelar el navegador (7.7.14). La meta no es escribir regex crípticas, sino saber cuándo usarlas y cuándo no.

### 7.7.1 Qué es y de dónde viene

| Año | Hito |
|---|---|
| 1951 | Stephen Kleene describe las “regular expressions” en teoría de autómatas |
| 1968 | Ken Thompson las implementa en el editor `ed` |
| 1973 | `grep` las populariza en Unix |
| 1987 | Perl las convierte en parte del lenguaje |
| 1999 | ECMAScript 3 estandariza `RegExp` en JavaScript |
| 2015 | ES6 añade el flag `u` (Unicode) y `y` (sticky) |
| 2018 | Grupos nombrados, lookbehind y `s` (dotAll) |
| 2022 | Flag `d` (índices de captura) |
| 2024 | Flag `v` (conjuntos Unicode) |

Una regex no “entiende” el texto. Es un **autómata**: recorre la cadena carácter a carácter intentando encajar el patrón. Cuando lo consigue, devuelve la posición y las capturas; cuando no, devuelve `null` o `false`.

```js
const patron = /gato/;

console.log(patron.test("tengo un gato")); // true
console.log(patron.test("tengo un perro")); // false
console.log(patron.test("GATO")); // false — distingue mayúsculas
```

> 🧠 **Modelo mental:** una regex es un **programa de búsqueda**, no un validador mágico. Si el patrón no describe exactamente lo que quieres, aceptará o rechazará lo que no esperas.

### 7.7.2 Crear una expresión regular

Hay dos formas:

```js
// Literal: se compila una vez, al cargar el archivo
const literal = /hola/gi;

// Constructor: se compila en tiempo de ejecución
const construida = new RegExp("hola", "gi");

console.log(literal.source); // "hola"
console.log(literal.flags); // "gi"
console.log(construida.source); // "hola"
console.log(construida.flags); // "gi"
```

| Forma | Cuándo usarla |
|---|---|
| `/patrón/flags` | Patrón fijo, conocido al escribir el código |
| `new RegExp("patrón", "flags")` | Patrón dinámico (viene de un input, de una config) |

**El literal es más rápido y más legible.** El constructor solo es necesario cuando el patrón se construye con datos:

```js
function buscarPalabra(texto, palabra) {
  const patron = new RegExp(palabra, "gi");
  return texto.match(patron) ?? [];
}

console.log(buscarPalabra("La casa de la playa", "la")); // ["La", "la"]
```

⚠️ **Trampa del constructor:** los backslashes se escriben dobles, porque primero los interpreta el string.

```js
// ❌ "\d" en un string es solo "d"
const malo = new RegExp("\d+");
console.log(malo.source); // "d+"

// ✅ Doble barra
const bueno = new RegExp("\\d+");
console.log(bueno.source); // "\d+"
console.log(bueno.test("abc123")); // true
```

**Propiedades de una regex:**

```js
const re = /a.b/gimsuy;

console.log(re.source); // "a.b"
console.log(re.flags); // "gimsuy"
console.log(re.global); // true
console.log(re.ignoreCase); // true
console.log(re.multiline); // true
console.log(re.dotAll); // true
console.log(re.unicode); // true
console.log(re.sticky); // true
```

⚠️ **Una regex literal con `g` conserva estado entre llamadas.** Es la fuente del bug más común de esta sección; lo verás en 7.7.10.

### 7.7.3 Caracteres literales y metacaracteres

La mayoría de caracteres se representan a sí mismos:

```js
console.log(/mundo/.test("hola mundo")); // true
console.log(/123/.test("abc123xyz")); // true
console.log(/a b/.test("a b")); // true — el espacio es literal
```

Pero doce caracteres tienen significado especial:

| Metacarácter | Significado |
|---|---|
| `.` | Cualquier carácter (salvo salto de línea, sin `s`) |
| `*` | Cero o más |
| `+` | Uno o más |
| `?` | Cero o uno / hace perezoso al cuantificador |
| `^` | Inicio de cadena (o de línea con `m`) |
| `$` | Fin de cadena (o de línea con `m`) |
| `\|` | Alternancia (“o”) |
| `(` `)` | Agrupar |
| `[` `]` | Clase de caracteres |
| `{` `}` | Cuantificador explícito |
| `\` | Escape |

Para buscar uno de ellos como texto literal, escápalo con `\`:

```js
console.log(/a\.b/.test("a.b")); // true
console.log(/a\.b/.test("axb")); // false

console.log(/\$/.test("precio: 20$")); // true
console.log(/1\+1/.test("1+1")); // true
console.log(/\(hola\)/.test("(hola)")); // true
```

⚠️ La barra `/` también debe escaparse dentro de un literal, porque cierra el patrón:

```js
// ❌ Sin escapar, la barra cierra el patrón antes de tiempo
// const ruta = /\/api/usuarios/; // SyntaxError

// ✅
const ruta = /\/api\/usuarios/;
console.log(ruta.test("/api/usuarios")); // true
```

(Sí: el ejemplo “malo” está comentado porque ni siquiera se puede escribir. Esa es la prueba de que el `/` es especial.)

**Alternativa más legible:** usa `new RegExp` cuando el patrón tiene muchas barras.

```js
const ruta = new RegExp("/api/usuarios");
console.log(ruta.test("/api/usuarios")); // true
```

### 7.7.4 Clases de caracteres

Una **clase** define un conjunto de caracteres aceptables en una posición.

```js
console.log(/[abc]/.test("b")); // true
console.log(/[abc]/.test("d")); // false
console.log(/[aeiou]/.test("hola")); // true
```

**Rangos:**

```js
console.log(/[a-z]/.test("m")); // true
console.log(/[A-Z]/.test("m")); // false
console.log(/[0-9]/.test("7")); // true
console.log(/[a-zA-Z0-9_]/.test("_")); // true
```

**Negación con `^` al inicio:**

```js
console.log(/[^0-9]/.test("a")); // true
console.log(/[^0-9]/.test("5")); // false
console.log(/[^aeiou]/.test("e")); // false
```

⚠️ El `^` solo niega si es el **primer** carácter de la clase. En cualquier otra posición es literal.

```js
console.log(/[a^]/.test("^")); // true — literal
console.log(/[^a]/.test("^")); // true — negación
```

⚠️ El guion `-` define rangos. Para usarlo literal, ponlo al inicio o al final, o escápalo.

```js
console.log(/[a-z]/.test("-")); // false — es un rango
console.log(/[-a-z]/.test("-")); // true — guion literal al inicio
console.log(/[a-z-]/.test("-")); // true — guion literal al final
console.log(/[a\-z]/.test("-")); // true — escapado
```

**Clases predefinidas:**

| Clase | Significa | Equivale a |
|---|---|---|
| `\d` | Dígito | `[0-9]` |
| `\D` | No dígito | `[^0-9]` |
| `\w` | Carácter de palabra | `[A-Za-z0-9_]` |
| `\W` | No palabra | `[^A-Za-z0-9_]` |
| `\s` | Espacio en blanco | espacio, `\t`, `\n`, `\r`, `\f`, `\v` |
| `\S` | No espacio | lo contrario |
| `.` | Cualquier carácter | salvo `\n`, `\r`, `\u2028`, `\u2029` |

```js
console.log(/\d/.test("a1")); // true
console.log(/\d/.test("a")); // false
console.log(/\s/.test("a b")); // true
console.log(/\s/.test("ab")); // false
console.log(/\w/.test("_")); // true
```

```js
console.log("a1 b2".match(/\d/g)); // ["1", "2"]
console.log("a1 b2".match(/\D/g)); // ["a", " ", "b"]
console.log("a1 b2".match(/\w/g)); // ["a", "1", "b", "2"]
console.log("a1 b2".match(/\s/g)); // [" "]
```

⚠️ **`\w` y `\d` son ASCII.** No incluyen `ñ`, `á`, `ü`, ni dígitos de otros alfabetos.

```js
console.log("año".match(/\w+/g)); // ["a", "o"] — la ñ se pierde
console.log("año".match(/\p{L}+/gu)); // ["año"] — con Unicode (7.7.17)
```

**Dentro de una clase, las clases predefinidas se pueden combinar:**

```js
console.log(/[\d.]/.test("5")); // true
console.log(/[\d.]/.test(".")); // true
console.log(/[\d.]/.test("a")); // false

console.log(/[\w-]+/.test("mi-variable_1")); // true
```

⚠️ **El punto dentro de una clase es literal**, no “cualquier carácter”:

```js
console.log(/./.test("x")); // true — cualquier carácter
console.log(/[.]/.test("x")); // false — solo un punto
console.log(/[.]/.test(".")); // true
```

> 🧠 **Regla:** dentro de `[...]`, casi todo es literal salvo `\`, `]`, `^` (al inicio) y `-` (entre caracteres). Fuera de `[...]`, los metacaracteres mandan.

### 7.7.5 Cuantificadores

Un cuantificador dice **cuántas veces** se repite lo anterior.

| Cuantificador | Significa |
|---|---|
| `?` | Cero o una vez |
| `*` | Cero o más veces |
| `+` | Una o más veces |
| `{n}` | Exactamente `n` veces |
| `{n,}` | Al menos `n` veces |
| `{n,m}` | Entre `n` y `m` veces |

```js
console.log(/^ab?$/.test("a")); // true
console.log(/^ab?$/.test("ab")); // true
console.log(/^ab?$/.test("abb")); // false

console.log(/^ab*$/.test("a")); // true
console.log(/^ab*$/.test("abbb")); // true

console.log(/^ab+$/.test("a")); // false — exige al menos una b
console.log(/^ab+$/.test("abbb")); // true

console.log(/^a{3}$/.test("aaa")); // true
console.log(/^a{2,4}$/.test("aaa")); // true
console.log(/^a{2,4}$/.test("aaaaa")); // false
```

⚠️ **El cuantificador se aplica al elemento inmediatamente anterior**, no a toda la secuencia.

```js
console.log(/^ab+$/.test("abab")); // false — es "a" seguido de una o más "b"
console.log(/^(ab)+$/.test("abab")); // true — el grupo se repite
```

**Greedy (codicioso) frente a lazy (perezoso):** por defecto, `*`, `+` y `{n,m}` intentan comer **todo** lo posible y luego retroceden.

```js
const html = "<b>hola</b>";

console.log(html.match(/<.+>/)[0]); // "<b>hola</b>" — greedy
console.log(html.match(/<.+?>/)[0]); // "<b>" — lazy
```

Añadir `?` después del cuantificador lo hace perezoso:

| Greedy | Lazy | Comportamiento |
|---|---|---|
| `*` | `*?` | Lo mínimo posible |
| `+` | `+?` | Lo mínimo posible |
| `?` | `??` | Prefiere cero |
| `{2,4}` | `{2,4}?` | Empieza por 2 |

```js
console.log("aaaa".match(/a{2,4}/)[0]); // "aaaa"
console.log("aaaa".match(/a{2,4}?/)[0]); // "aa"
```

⚠️ **Lazy no significa “no coincide”.** Sigue siendo una coincidencia; solo cambia cuánto abarca.

**Cuantificadores anidados:** pueden ser válidos, pero suelen ser lentos o ambiguos.

```js
// Válido: uno o más grupos de "ab"
console.log(/^(?:ab)+$/.test("ababab")); // true
```

Los cuantificadores anidados sobre el mismo carácter son el origen de ReDoS (7.7.14).

### 7.7.6 Anclas y límites

Sin anclas, una regex busca **en cualquier parte** de la cadena.

```js
console.log(/gato/.test("mi gato duerme")); // true
console.log(/gato/.test("mi perro duerme")); // false
```

Con anclas, exiges posición:

| Ancla | Significa |
|---|---|
| `^` | Inicio de la cadena (o de línea con `m`) |
| `$` | Fin de la cadena (o de línea con `m`) |
| `\b` | Límite de palabra |
| `\B` | Donde **no** hay límite de palabra |

```js
console.log(/^gato$/.test("gato")); // true
console.log(/^gato$/.test("mi gato")); // false
console.log(/^gato$/.test("gato mío")); // false
```

⚠️ **Validar sin anclas es un error clásico.** `/^\d{3}$/` acepta exactamente tres dígitos; `/\d{3}/` acepta “abc123def”.

```js
// ❌ Acepta cualquier cosa que contenga 3 dígitos
console.log(/\d{3}/.test("abc123def")); // true

// ✅ Exige exactamente 3 dígitos
console.log(/^\d{3}$/.test("abc123def")); // false
console.log(/^\d{3}$/.test("123")); // true
```

**`\b`** marca la frontera entre un carácter de palabra (`\w`) y uno que no lo es.

```js
console.log(/\bgato\b/.test("mi gato duerme")); // true
console.log(/\bgato\b/.test("mi gatote")); // false
console.log(/\bgato\b/.test("megato")); // false
console.log(/\Bato\B/.test("gato")); // true — "ato" está en medio
```

⚠️ **`\b` es ASCII.** Con letras acentuadas da resultados sorprendentes:

```js
console.log(/\büber\b/.test("über")); // false — ü no es \w
console.log(/\bano\b/.test("año")); // false — ñ no es \w
```

Para texto con acentos, usa lookarounds con Unicode (7.7.11) o normaliza antes (7.7.17).

**El flag `m` cambia `^` y `$` para que actúen por línea:**

```js
const texto = "uno\ndos\ntres";

console.log(texto.match(/^\w+$/g)); // null — sin m, no hay línea completa
console.log(texto.match(/^\w+$/gm)); // ["uno", "dos", "tres"]
```

⚠️ En JavaScript, `$` **sin `m` no coincide antes de un salto de línea final** (a diferencia de otros lenguajes):

```js
console.log(/a$/.test("a\n")); // false
console.log(/a$/m.test("a\n")); // true
```

### 7.7.7 Grupos y alternancia

**Paréntesis de captura `(...)`:** agrupan y guardan lo que coincide.

```js
const re = /(\d{4})-(\d{2})-(\d{2})/;
const resultado = re.exec("Fecha: 2026-03-01");

console.log(resultado[0]); // "2026-03-01" — coincidencia completa
console.log(resultado[1]); // "2026" — primer grupo
console.log(resultado[2]); // "03"
console.log(resultado[3]); // "01"
console.log(resultado.index); // 7 — posición donde empieza
console.log(resultado.input); // "Fecha: 2026-03-01"
```

**Grupos opcionales:** si no participan, valen `undefined`.

```js
const re = /^(\d{2})(?:-(\d{2}))?$/;

console.log(re.exec("12-34")); // ["12-34", "12", "34"]
console.log(re.exec("12")); // ["12", "12", undefined]
```

**Grupos de no captura `(?:...)`:** agrupan sin guardar. Sirven para aplicar cuantificadores sin crear capturas innecesarias.

```js
const conCaptura = /^(ab)+$/;
const sinCaptura = /^(?:ab)+$/;

console.log(conCaptura.exec("abab")[1]); // "ab" — solo el último
console.log(sinCaptura.exec("abab")[1]); // undefined — no hay grupo 1
```

**Grupos nombrados `(?<nombre>...)`:** la forma legible de acceder a una captura.

```js
const re = /(?<anio>\d{4})-(?<mes>\d{2})-(?<dia>\d{2})/;
const { groups } = re.exec("2026-03-01");

console.log(groups.anio); // "2026"
console.log(groups.mes); // "03"
console.log(groups.dia); // "01"
```

Ventajas: no dependes del orden, y el código dice qué es cada cosa.

⚠️ **Un grupo nombrado y uno numerado comparten numeración.** El nombre es un alias, no un grupo aparte.

```js
const re = /(?<a>x)(y)/;
const m = re.exec("xy");

console.log(m[1], m[2]); // "x" "y"
console.log(m.groups.a); // "x"
```

**Alternancia `|`:** significa “o”. Tiene la precedencia más baja, así que agrupa si quieres limitarla.

```js
console.log(/^(gato|perro)$/.test("perro")); // true
console.log(/^(gato|perro)$/.test("gato")); // true
console.log(/^(gato|perro)$/.test("gato perro")); // false

// Sin grupo, el ancla solo afecta al primer término
console.log(/^gato|perro$/.test("perro salvaje")); // true — es (^gato)|(perro$)
```

⚠️ **El orden de la alternancia importa** cuando los términos se solapan: el motor prefiere el primero que permite una coincidencia.

```js
console.log(/(a|ab)/.exec("ab")[0]); // "a" — se queda con la primera alternativa
console.log(/(ab|a)/.exec("ab")[0]); // "ab" — la primera alternativa ya cubre más
```

Si el patrón completo exige más texto, el motor retrocede y prueba la siguiente alternativa. Por eso, cuando los términos se solapan, pon primero el más específico: evita capturas inesperadas y backtracking.

**Grupos anidados:** se numeran por el orden en que abre el paréntesis.

```js
const re = /((\d{4})-(\d{2}))-(\d{2})/;
const m = re.exec("2026-03-01");

console.log(m[1]); // "2026-03"
console.log(m[2]); // "2026"
console.log(m[3]); // "03"
console.log(m[4]); // "01"
```

### 7.7.8 Flags

| Flag | Nombre | Efecto |
|---|---|---|
| `g` | global | Busca todas las coincidencias, no solo la primera |
| `i` | ignoreCase | Ignora mayúsculas y minúsculas |
| `m` | multiline | `^` y `$` actúan por línea |
| `s` | dotAll | `.` también coincide con saltos de línea |
| `u` | unicode | Trata la cadena como puntos de código Unicode |
| `y` | sticky | Busca solo en `lastIndex`, sin avanzar |
| `d` | hasIndices | Añade `.indices` con posiciones de cada grupo |
| `v` | unicodeSets | Conjuntos Unicode avanzados (2024) |

```js
console.log(/gato/i.test("GATO")); // true
console.log(/a.b/s.test("a\nb")); // true — sin s sería false
console.log(/^b/m.test("a\nb")); // true
console.log("a1b2".match(/\d/g)); // ["1", "2"]
```

**`y` (sticky):** exige que la coincidencia empiece exactamente en `lastIndex`.

```js
const re = /\d/y;
re.lastIndex = 2;

console.log(re.test("ab12")); // true — empieza en el índice 2
console.log(re.lastIndex); // 3

re.lastIndex = 1;
console.log(re.test("ab12")); // false — en el índice 1 hay "b"
```

Se usa en lexers y parsers para consumir un texto de izquierda a derecha sin saltos.

**`d` (índices):** te dice dónde empieza y termina cada grupo.

```js
const m = /(?<mes>\d{2})/d.exec("2026-03-01");
console.log(m.indices[0]); // [5, 7]
console.log(m.indices.groups.mes); // [5, 7]
```

📌 El flag `v` (ES2024) permite restas e intersecciones de conjuntos: `[\p{L}--[aeiou]]`. Es una vista previa; no lo necesitas en este curso.

⚠️ **`u` no es opcional en código moderno.** Sin `u`, los emojis y caracteres fuera del plano básico se tratan como dos unidades y los escapes Unicode estrictos fallan. Lo verás en 7.7.17.

### 7.7.9 Los métodos: `test`, `exec`, `match`, `replace`, `split`

**`regex.test(texto)`** devuelve un booleano. Es lo que quieres para validar.

```js
console.log(/\d+/.test("abc123")); // true
console.log(/^\d+$/.test("abc123")); // false
```

**`regex.exec(texto)`** devuelve un array con la coincidencia y las capturas, o `null`.

```js
const m = /(\w+)@(\w+)\.com/.exec("ana@ejemplo.com");

console.log(m[0]); // "ana@ejemplo.com"
console.log(m[1]); // "ana"
console.log(m[2]); // "ejemplo"
console.log(m.index); // 0
```

Con `g`, `exec` avanza `lastIndex` y puedes iterar:

```js
const re = /(\w+)=(\w+)/g;
const texto = "a=1 b=2 c=3";
let m;

while ((m = re.exec(texto)) !== null) {
  console.log(m[1], "→", m[2]);
}
```

Salida:

```text
a → 1
b → 2
c → 3
```

**`string.match(regex)`**:

| Sin `g` | Con `g` |
|---|---|
| Devuelve como `exec` (con grupos) | Devuelve array de coincidencias **sin grupos** |
| `null` si no hay | `null` si no hay |

```js
console.log("2026-03-01".match(/(\d{4})-(\d{2})-(\d{2})/));
// ["2026-03-01", "2026", "03", "01", index: 0, ...]

console.log("2026-03-01".match(/\d+/g));
// ["2026", "03", "01"] — sin grupos, solo coincidencias
```

⚠️ **Con `g` pierdes los grupos.** Si necesitas ambos, usa `matchAll`.

**`string.matchAll(regex)`** devuelve un iterador de coincidencias completas. Exige `g`.

```js
const texto = "a=1 b=2";

for (const m of texto.matchAll(/(\w+)=(\w+)/g)) {
  console.log(m[1], m[2]);
}
```

Salida:

```text
a 1
b 2
```

```js
// ❌ TypeError: String.prototype.matchAll called with a non-global RegExp
"a=1".matchAll(/(\w+)=(\w+)/);
```

**`string.replace(regex, reemplazo)`** sustituye la primera coincidencia (o todas con `g`).

```js
console.log("2026-03-01".replace(/-/g, "/")); // "2026/03/01"
console.log("hola".replace(/l/, "L")); // "hoLa"
console.log("hola".replace(/l/g, "L")); // "hoLa" — solo hay una l
```

En el reemplazo puedes usar referencias:

| Símbolo | Significa |
|---|---|
| `$&` | La coincidencia completa |
| `` $` `` | Todo lo anterior a la coincidencia |
| `$'` | Todo lo posterior |
| `$1`, `$2` | Grupo numerado |
| `$<nombre>` | Grupo nombrado |
| `$$` | Un `$` literal |

```js
console.log("2026-03-01".replace(/(\d{4})-(\d{2})-(\d{2})/, "$3/$2/$1"));
// "01/03/2026"

console.log(
  "Ana García".replace(
    /(?<nombre>\p{L}+)\s(?<apellido>\p{L}+)/u,
    "$<apellido>, $<nombre>"
  )
);
// "García, Ana"

console.log("precio".replace(/precio/, "[$&]")); // "[precio]"
```

**Con función de reemplazo:** recibes la coincidencia, los grupos, la posición y el texto.

```js
const resultado = "2026-03-01".replace(
  /(\d{4})-(\d{2})-(\d{2})/,
  (coincidencia, anio, mes, dia) => `${dia}.${mes}.${anio}`
);

console.log(resultado); // "01.03.2026"
```

```js
const precios = "10€ 25€ 40€";

const conIva = precios.replace(/(\d+)€/g, (_, valor) => {
  return `${(Number(valor) * 1.21).toFixed(2)}€`;
});

console.log(conIva); // "12.10€ 30.25€ 48.40€"
```

**`string.replaceAll`** exige `g` si le pasas una regex:

```js
console.log("a-b-c".replaceAll("-", "_")); // "a_b_c"
console.log("a-b-c".replaceAll(/-/g, "_")); // "a_b_c"

// ❌ TypeError: replaceAll must be called with a global RegExp
"a-b-c".replaceAll(/-/, "_");
```

**`string.search(regex)`** devuelve el índice de la primera coincidencia o `-1`. Ignora `g` y `lastIndex`.

```js
console.log("abc123".search(/\d/)); // 3
console.log("abc".search(/\d/)); // -1
```

**`string.split(separador)`** acepta regex. Si el separador tiene grupos de captura, **los incluye** en el resultado.

```js
console.log("Ana, Luis,  Marta".split(/,\s*/)); // ["Ana", "Luis", "Marta"]
console.log("a-b-c".split(/-/)); // ["a", "b", "c"]
console.log("a-b-c".split(/(-)/)); // ["a", "-", "b", "-", "c"]
```

**Tabla resumen:**

| Necesitas | Usa | Devuelve |
|---|---|---|
| ¿Coincide? | `test` | `boolean` |
| Una coincidencia con grupos | `exec` / `match` sin `g` | Array o `null` |
| Todas las coincidencias con grupos | `matchAll` | Iterador |
| Todas sin grupos | `match` con `g` | Array de strings |
| Reemplazar | `replace` / `replaceAll` | String |
| Posición | `search` | Número o `-1` |
| Dividir | `split` | Array |

### 7.7.10 `lastIndex` y el flag `g`: el bug clásico

Una regex con `g` es **stateful**. Guarda en `lastIndex` dónde terminó la última búsqueda.

```js
const re = /\d/g;

console.log(re.lastIndex); // 0
console.log(re.test("a1b2")); // true
console.log(re.lastIndex); // 2
console.log(re.test("a1b2")); // true
console.log(re.lastIndex); // 4
console.log(re.test("a1b2")); // false
console.log(re.lastIndex); // 0 — se reinicia al fallar
```

Ese estado es útil para iterar, pero **venenoso** si compartes la regex entre llamadas.

```js
// ❌ El mismo patrón, dos validaciones: la segunda puede fallar
const tieneNumero = /\d/g;

function validar(valor) {
  return tieneNumero.test(valor);
}

console.log(validar("abc1")); // true
console.log(validar("abc1")); // false — ¡la misma entrada!
```

**Por qué:** la primera llamada deja `lastIndex = 4`; la segunda empieza a buscar desde el final.

**Soluciones:**

```js
// ✅ 1. No uses g si solo validas
const tieneNumero = /\d/;

// ✅ 2. Crea la regex dentro de la función
function validar(valor) {
  return /\d/g.test(valor);
}

// ✅ 3. Reinicia lastIndex
tieneNumero.lastIndex = 0;
```

⚠️ Lo mismo pasa con `exec` en un bucle infinito si no avanzas o si reinicias mal:

```js
// ❌ Bucle infinito: exec devuelve la misma coincidencia una y otra vez
const re = /a/g;
re.lastIndex = 0;
// while (re.exec("aaa")) {}
```

Con `g`, `exec` avanza sola; el bucle termina cuando devuelve `null`. El peligro real es reiniciar `lastIndex` dentro del bucle.

⚠️ **`match` con `g` no usa `lastIndex`** (lo ignora y devuelve todo), pero `test` y `exec` sí. No asumas que todas las APIs se comportan igual.

> 🧠 **Regla:** una regex con `g` es un cursor. Si no la estás recorriendo, quítale la `g`.

### 7.7.11 Lookahead y lookbehind

Los **lookarounds** comprueban qué hay antes o después **sin consumirlo**.

| Sintaxis | Nombre | Significa |
|---|---|---|
| `(?=...)` | Lookahead positivo | Seguido de |
| `(?!...)` | Lookahead negativo | No seguido de |
| `(?<=...)` | Lookbehind positivo | Precedido de |
| `(?<!...)` | Lookbehind negativo | No precedido de |

```js
// Precio seguido de " €"
console.log(/\d+(?= €)/.exec("20 € y 30 $")[0]); // "20"

// Número precedido de "$"
console.log(/(?<=\$)\d+/.exec("20 € y $30")[0]); // "30"

// Palabra que no es "admin"
console.log(/^(?!admin$)\w+$/.test("ana")); // true
console.log(/^(?!admin$)\w+$/.test("admin")); // false

// Números no precedidos de "#"
console.log("#1 2".match(/(?<!#)\b\d+/g)); // ["2"]
```

**Reemplazar solo si no va seguido de algo:**

```js
console.log("foo1 foo2".replace(/foo(?!1)/g, "bar")); // "foo1 bar2"
```

**Validar contraseña con varias condiciones:**

```js
function validarPassword(valor) {
  const errores = [];

  if (valor.length < 12) errores.push("Al menos 12 caracteres");
  if (!/[a-z]/.test(valor)) errores.push("Una minúscula");
  if (!/[A-Z]/.test(valor)) errores.push("Una mayúscula");
  if (!/\d/.test(valor)) errores.push("Un número");
  if (!/[^\p{L}\p{N}]/u.test(valor)) errores.push("Un símbolo");
  if (/\s/.test(valor)) errores.push("Sin espacios");

  return errores;
}

console.log(validarPassword("Corta1!")); // ["Al menos 12 caracteres"]
console.log(validarPassword("ClaveSegura2026!")); // []
```

⚠️ **Los lookarounds no capturan.** Si necesitas el valor, envuélvelo en un grupo normal: `(?=(\d+))` captura dentro del lookahead.

⚠️ **Compatibilidad:** lookbehind funciona en Node 9+ y en navegadores modernos (Safari lo añadió en 16.4). Si necesitas navegadores antiguos, evítalo.

### 7.7.12 Retro-referencias

Una **retro-referencia** exige que el texto coincida con lo que capturó un grupo anterior.

| Sintaxis | Significa |
|---|---|
| `\1`, `\2` | Igual que el grupo 1, 2… |
| `\k<nombre>` | Igual que el grupo nombrado |

```js
// Dos letras iguales seguidas
console.log(/(\w)\1/.test("letter")); // true — "tt"
console.log(/(\w)\1/.test("hola")); // false

// Comillas coherentes: empieza y termina con la misma
console.log(/^(['"]).*\1$/.test('"hola"')); // true
console.log(/^(['"]).*\1$/.test("'hola'")); // true
console.log(/^(['"]).*\1$/.test('"hola\'')); // false
```

**Eliminar palabras duplicadas:**

```js
const texto = "hola hola mundo mundo de verdad";
const limpio = texto.replace(/\b(\w+)\s+\1\b/gi, "$1");

console.log(limpio); // "hola mundo de verdad"
```

**Con grupos nombrados:**

```js
const re = /(?<tag>\w+)>.*<\/\k<tag>>/;

console.log(re.test("<b>hola</b>")); // true
console.log(re.test("<b>hola</i>")); // false
```

⚠️ **No uses regex para parsear HTML.** Este ejemplo solo muestra la sintaxis; un HTML real tiene anidamiento, comentarios y atributos que una regex no maneja. Usa `DOMParser` (Módulo 6) o una librería.

⚠️ Una retro-referencia a un grupo que no participó **no coincide**. Si el grupo es opcional y no está, `\1` no puede igualar nada.

### 7.7.13 Validación práctica

**Email:** la especificación completa (RFC 5322) es tan compleja que una regex “correcta” tiene miles de caracteres y aun así no dice si el buzón existe. Usa una comprobación pragmática:

```js
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

console.log(EMAIL.test("ana@ejemplo.com")); // true
console.log(EMAIL.test("ana@ejemplo")); // false
console.log(EMAIL.test("ana @ejemplo.com")); // false
console.log(EMAIL.test("a@b.co")); // true
```

Después de aceptar, **confirma el email** enviando un enlace. Es la única validación real.

**Teléfono español:**

```js
const TELEFONO = /^(\+34|0034)?[ -]?[6789]\d{8}$/;

console.log(TELEFONO.test("+34 612345678")); // true
console.log(TELEFONO.test("612345678")); // true
console.log(TELEFONO.test("912 345 678")); // false — el espacio está mal colocado
console.log(TELEFONO.test("123456789")); // false — no empieza por 6, 7, 8 o 9
```

**Slug:**

```js
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

console.log(SLUG.test("modulo-7")); // true
console.log(SLUG.test("modulo--7")); // false — guiones dobles
console.log(SLUG.test("Modulo-7")); // false — mayúscula
console.log(SLUG.test("7-modulo")); // true
```

**Fecha ISO con comprobación real:**

```js
function esFechaISO(texto) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto);
  if (!m) return false;

  const anio = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);

  const fecha = new Date(Date.UTC(anio, mes - 1, dia));

  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

console.log(esFechaISO("2026-03-01")); // true
console.log(esFechaISO("2026-02-30")); // false — febrero no tiene 30
console.log(esFechaISO("2026-13-01")); // false — no existe el mes 13
```

**Por qué no basta la regex:** `\d{2}` acepta `99` como mes. La regex valida **forma**; el `Date` valida **existencia**.

**URL:** no la valides con regex. Usa `new URL` y comprueba el protocolo.

```js
function esUrlValida(texto) {
  try {
    const url = new URL(texto);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

console.log(esUrlValida("https://ejemplo.com/ruta?x=1")); // true
console.log(esUrlValida("javascript:alert(1)")); // false
console.log(esUrlValida("no es una url")); // false
```

**Código postal, DNI, IBAN:** cada uno tiene su algoritmo de verificación (letra del DNI, dígito de control del IBAN). La regex valida el formato; el algoritmo valida el contenido.

> 🧠 **Regla:** una regex comprueba **forma**, no **verdad**. Todo lo que tenga reglas matemáticas (fechas, DNI, IBAN, tarjetas) necesita código además del patrón.

### 7.7.14 ReDoS: cuando una regex cuelga el programa

**ReDoS** (Regular Expression Denial of Service) es un ataque que aprovecha el **backtracking** para que una regex tarde años en fallar.

```js
// ⚠️ Patrón vulnerable: cuantificadores anidados sobre lo mismo
const vulnerable = /^(a+)+$/;

// Con "aaaa!" (pocas a), tarda poco.
// Con 30 "a" y un "!", el número de caminos es exponencial.
```

**Qué ocurre:** el motor prueba todas las formas de repartir las `a` entre el grupo interno y el `+` externo. Si al final hay un carácter que no encaja, retrocede por cada combinación posible: `2^n`.

```js
// ❌ No ejecutes esto con entradas largas
function medir(entrada) {
  const inicio = performance.now();
  /^(a+)+$/.test(entrada);
  return performance.now() - inicio;
}

console.log(medir("aaaaaaaaaa!")); // pequeño
// console.log(medir("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!")); // puede colgar
```

**Cómo evitarlo:**

| Medida | Ejemplo |
|---|---|
| Evita cuantificadores anidados | `(a+)+` → `a+` |
| Ancla el patrón | `^...$` reduce búsquedas, no backtracking |
| Limita la longitud antes | `if (texto.length > 200) return false` |
| Usa alternativas más específicas | `(?:ab)+` en vez de `(?:a\|ab)+` |
| Prefiere validadores con código | Email, URL, fechas |
| Usa un motor sin backtracking | `re2` (📌 dependencia externa) |

```js
// ✅ Limita la entrada y simplifica
function validar(entrada) {
  if (typeof entrada !== "string" || entrada.length > 200) return false;
  return /^a+$/.test(entrada);
}
```

⚠️ **JavaScript no tiene timeout de regex.** Una regex catastrófica bloquea el hilo principal y ni siquiera puedes cancelarla. Si aceptas patrones de usuario, ejecútalos en un Web Worker o usa una librería segura.

⚠️ **El peligro no siempre es obvio.** `/(\w+\s?)*$/` o `/^(\d+)*$/` también pueden explotar. Cualquier grupo con `+` o `*` dentro de otro `+` o `*` es sospechoso.

### 7.7.15 Cuándo **no** usar expresiones regulares

Las regex son para **texto regular**: formatos planos, líneas, tokens simples. No para estructuras anidadas.

| Tarea | ¿Regex? | Alternativa |
|---|---|---|
| Validar un email de forma pragmática | ✅ | — |
| Validar un email según RFC completa | ❌ | Librería + confirmación |
| Parsear HTML | ❌ | `DOMParser`, una librería |
| Parsear JSON | ❌ | `JSON.parse` |
| Parsear CSV con comillas y comas dentro | ❌ | Parser de CSV |
| Contar palabras | ✅ | — |
| Extraer fechas de un log | ✅ | — |
| Reemplazar un patrón simple | ✅ | — |
| Validar una URL | ❌ | `new URL` |
| Comprobar si un IBAN es real | ❌ | Algoritmo módulo 97 |
| Analizar código fuente | ❌ | Parser (AST) |

**El caso HTML:**

```js
// ❌ Falla con atributos, comentarios, anidamiento y saltos de línea
const titulo = /<h1>(.*?)<\/h1>/.exec(html)?.[1];
```

```js
// ✅ El navegador ya tiene un parser
const doc = new DOMParser().parseFromString(html, "text/html");
const titulo = doc.querySelector("h1")?.textContent;
```

**El caso “necesito dos regex y luego un `if`”:** si tu patrón crece hasta volverse un programa, escríbelo como programa.

```js
// ❌ Ilegible e imposible de depurar
const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;

// ✅ Cada regla por separado, con mensajes distintos
function validarPassword(valor) {
  const errores = [];
  if (valor.length < 12) errores.push("Mínimo 12 caracteres");
  if (!/[a-z]/.test(valor)) errores.push("Falta minúscula");
  if (!/[A-Z]/.test(valor)) errores.push("Falta mayúscula");
  if (!/\d/.test(valor)) errores.push("Falta número");
  return errores;
}
```

La segunda versión dice **qué** falta. La primera solo dice “no”.

> 🧠 **Regla:** si no puedes explicar tu regex en una frase, divídela o no la uses.

### 7.7.16 Legibilidad y depuración

**1. Nombra el patrón.**

```js
// ❌ Un literal suelto en medio de la lógica
if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valor)) {}

// ✅
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
if (EMAIL.test(valor)) {}
```

**2. Construye patrones complejos por piezas.**

```js
const ANIO = "\\d{4}";
const MES = "(0[1-9]|1[0-2])";
const DIA = "(0[1-9]|[12]\\d|3[01])";

const FECHA = new RegExp(`^${ANIO}-${MES}-${DIA}$`);

console.log(FECHA.test("2026-03-01")); // true
console.log(FECHA.test("2026-13-01")); // false
```

Cada pieza tiene nombre y se puede probar por separado.

**3. Escapa los datos dinámicos.** Si el patrón incluye texto del usuario, un `.` o un `*` cambiará el significado.

```js
function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const busqueda = "precio: 20.5";
const patron = new RegExp(escaparRegex(busqueda), "g");

console.log(patron.test("El precio: 20.5 €")); // true
```

📌 ES2025 añade `RegExp.escape(texto)`, que hace esto por ti. En Node 24+ y navegadores recientes ya existe:

```js
if (typeof RegExp.escape === "function") {
  console.log(RegExp.escape("a.b")); // \x61\.b
}
```

**4. Prueba con casos límite.** Una regex sin tests es una bomba de relojería.

```js
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const casos = [
  ["modulo-7", true],
  ["", false],
  ["-modulo", false],
  ["modulo-", false],
  ["modulo--7", false],
  ["Módulo-7", false],
  ["7", true],
];

for (const [entrada, esperado] of casos) {
  const obtenido = SLUG.test(entrada);
  if (obtenido !== esperado) {
    console.log("FALLO:", entrada, "esperado", esperado, "obtenido", obtenido);
  }
}

console.log("Casos comprobados:", casos.length);
```

**5. Usa herramientas visuales.** [regex101](https://regex101.com) muestra cada paso del motor, explica los tokens y te deja probar entradas. Es la forma más rápida de entender una regex ajena.

**6. Comenta lo no obvio:**

```js
// Año-mes-día con guiones, sin validar si el día existe
const FORMATO_FECHA = /^\d{4}-\d{2}-\d{2}$/;
```

**7. No optimices prematuramente.** Una regex legible que tarda 0,1 ms es mejor que una críptica que tarda 0,05 ms. Mide antes de cambiar legibilidad por velocidad.

### 7.7.17 Unicode

Sin el flag `u`, JavaScript trata la cadena como unidades de 16 bits (UTF-16). Un emoji o un carácter fuera del plano básico ocupa dos unidades y las cosas se rompen.

```js
const emoji = "😀";

console.log(emoji.length); // 2 — dos unidades UTF-16
console.log(/^.$/.test(emoji)); // false — "." ve dos unidades
console.log(/^.$/u.test(emoji)); // true — con u, un punto de código
```

**Propiedades Unicode `\p{...}`:** solo con `u` (o `v`).

| Propiedad | Significa |
|---|---|
| `\p{L}` | Cualquier letra |
| `\p{N}` | Cualquier número |
| `\p{M}` | Marca diacrítica (tildes separadas) |
| `\p{P}` | Puntuación |
| `\p{Z}` | Separador (espacios) |
| `\p{Emoji}` | Emoji |

```js
console.log("año".match(/\w+/g)); // ["a", "o"]
console.log("año".match(/\p{L}+/gu)); // ["año"]
console.log("año2026".match(/\p{L}+/gu)); // ["año"]
console.log("año2026".match(/\p{N}+/gu)); // ["2026"]
console.log("😀🎉".match(/\p{Emoji}/gu)); // ["😀", "🎉"]
```

**Búsqueda sin acentos:** normaliza a NFD, elimina las marcas y compara.

```js
function normalizar(texto) {
  return texto
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase();
}

console.log(normalizar("Café")); // "cafe"
console.log(normalizar("CAFÉ")); // "cafe"
console.log(normalizar("Año")); // "ano"
```

Así puedes buscar “cafe” y encontrar “Café”.

```js
const productos = ["Café con leche", "Té verde", "Año nuevo"];

function buscar(texto, consulta) {
  const q = normalizar(consulta);
  return productos.filter((p) => normalizar(p).includes(q));
}

console.log(buscar(productos, "cafe")); // ["Café con leche"]
console.log(buscar(productos, "ANO")); // ["Año nuevo"]
```

**`\b` con acentos:** como viste, `\b` usa `\w` ASCII. Para texto Unicode, define tus propios límites:

```js
const INICIO_PALABRA = /(?<![\p{L}\p{N}])/u;
const FIN_PALABRA = /(?![\p{L}\p{N}])/u;

const patron = new RegExp(`${INICIO_PALABRA.source}año${FIN_PALABRA.source}`, "u");

console.log(patron.test("el año nuevo")); // true
console.log(patron.test("el añoñuevo")); // false
```

Es más verboso, pero correcto para cualquier alfabeto.

**Comparar texto:** `localeCompare` y `Intl.Collator` (7.8) respetan el idioma mejor que una regex.

```js
console.log("año".localeCompare("ano")); // distinto de 0 en español
```

⚠️ **No normalices datos que guardas.** Normaliza solo para comparar o buscar. Si guardas `"ano"` en lugar de `"año"`, pierdes información.

### ✅ Haz esto / ❌ Evita esto (7.7)

```js
// ✅ Ancla cuando validas
const DNI = /^\d{8}[A-Z]$/;

// ✅ Nombra el patrón
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// ✅ Sin g si solo validas
const TIENE_DIGITO = /\d/;

// ✅ Usa matchAll si necesitas grupos y todas las coincidencias
for (const m of texto.matchAll(/(\w+)=(\w+)/g)) {
  console.log(m[1], m[2]);
}

// ✅ Escapa datos dinámicos
const patron = new RegExp(escaparRegex(texto), "g");

// ✅ Divide reglas complejas en comprobaciones con nombre
if (!/[A-Z]/.test(password)) errores.push("Falta mayúscula");

// ✅ Usa new URL para URLs y JSON.parse para JSON
```

```js
// ❌ Validar sin anclas
/\d{3}/.test("abc123"); // true, pero no querías eso

// ❌ Compartir una regex con g entre validaciones
const re = /\d/g;
re.test("a1"); // true
re.test("a1"); // false

// ❌ Usar match con g y esperar grupos
"a=1".match(/(\w+)=(\w+)/g); // ["a=1"], sin grupos

// ❌ Concatenar input del usuario a una regex sin escapar
new RegExp(texto); // un "." o "*" cambia el patrón

// ❌ Regex para HTML, JSON o CSV
/<div>(.*?)<\/div>/s.test(html);

// ❌ Cuantificadores anidados sobre lo mismo
/^(a+)+$/.test(entrada);

// ❌ Una regex de 200 caracteres sin comentarios ni tests
const reLarga = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{12,}$/;
```

> 🧠 **Regla final de 7.7:** una regex es una herramienta de precisión para texto plano. Si el problema tiene estructura (HTML, JSON, fechas reales, URLs), usa un parser. Si el patrón no cabe en tu cabeza, pártelo. Y si lleva `g`, pregúntate quién es el dueño de `lastIndex`.

---

## 7.8 — `Intl`, fechas y números

Formatear datos parece trivial hasta que tu aplicación la usa gente de tres países. `1234.5` no significa lo mismo en todas partes: en España se escribe `1.234,5` y en Estados Unidos `1,234.5`. Una fecha `03/04/2026` es el 3 de abril en España y el 4 de marzo en Estados Unidos.

`Intl` es el conjunto de APIs nativas de JavaScript para **internacionalización**: números, monedas, fechas, listas, plurales, ordenación alfabética y segmentación de texto. No necesitas librerías para lo básico.

### 7.8.1 Por qué no formatear a mano

```js
// ❌ Formato inventado, incorrecto fuera de tu país
function precio(valor) {
  return valor.toFixed(2) + " €";
}

console.log(precio(1234.5)); // "1234.50 €"
// En español se espera "1234,50 €" (coma decimal y separador de miles)
```

```js
// ✅ El motor conoce las reglas del idioma
const formatoEuro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

console.log(formatoEuro.format(1234.5)); // "1234,50 €"
```

**Lo que `Intl` resuelve por ti:**

| Problema | Sin `Intl` | Con `Intl` |
|---|---|---|
| Separador decimal | `,` o `.` según el país | Automático |
| Separador de miles | `.` o `,` | Automático |
| Símbolo de moneda | Lo pones tú | Según la moneda y el locale |
| Plurales | `if (n === 1)` | `Intl.PluralRules` |
| Orden alfabético | `sort()` compara códigos | `Intl.Collator` |
| Fechas | Concatenas partes | `Intl.DateTimeFormat` |
| Zonas horarias | Cálculos manuales | `timeZone` |

⚠️ **`Intl` no traduce tu interfaz.** Traduce el **formato** de los datos. Los textos (“Guardar”, “Cancelar”) siguen siendo tu responsabilidad.

### 7.8.2 Locales

Un **locale** es un identificador de idioma y región: `"es"`, `"es-ES"`, `"es-MX"`, `"en-US"`, `"pt-BR"`.

```js
const valor = 1234.5;

console.log(new Intl.NumberFormat("es-ES").format(valor)); // "1234,5"
console.log(new Intl.NumberFormat("en-US").format(valor)); // "1,234.5"
console.log(new Intl.NumberFormat("de-DE").format(valor)); // "1.234,5"
console.log(new Intl.NumberFormat("es-MX").format(valor)); // "1234.5"
```

**El locale puede ser una lista de preferencias.** El motor usa la primera que soporta.

```js
const formato = new Intl.NumberFormat(["xx-YY", "es-ES"]);

console.log(formato.format(1234.5)); // "1234,5" — cae en español
```

**Comprobar qué soporta el entorno:**

```js
console.log(Intl.NumberFormat.supportedLocalesOf(["es-ES", "xx-YY"]));
// ["es-ES"]
```

**En el navegador**, el locale del usuario suele estar en `navigator.language`:

```js
// 📄 app.js
const locale = navigator.language; // "es-ES", "en-US"…
console.log(locale);
```

⚠️ **No asumas que `navigator.language` es el idioma que el usuario quiere para tu app.** Si tu interfaz está en español, formatea en español aunque el sistema esté en inglés. Mezclar interfaz en un idioma y fechas en otro confunde.

```js
// ✅ Un solo idioma para toda la interfaz
const LOCALE = "es-ES";
```

📌 En el Módulo 8 verás cómo servir varios idiomas con un sistema de traducciones.

### 7.8.3 Números

```js
const nf = new Intl.NumberFormat("es-ES");

console.log(nf.format(1234567.891)); // "1.234.567,891"
console.log(nf.format(-42)); // "-42"
console.log(nf.format(0.5)); // "0,5"
```

**Opciones de dígitos:**

| Opción | Efecto |
|---|---|
| `minimumIntegerDigits` | Mínimo de dígitos enteros (rellena con ceros) |
| `minimumFractionDigits` | Mínimo de decimales |
| `maximumFractionDigits` | Máximo de decimales |
| `minimumSignificantDigits` | Mínimo de cifras significativas |
| `maximumSignificantDigits` | Máximo de cifras significativas |

```js
console.log(new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(5)); // "5,00"

console.log(new Intl.NumberFormat("es-ES", {
  maximumSignificantDigits: 3,
}).format(1234.5678)); // "1230"
```

⚠️ **No uses `toFixed` para mostrar dinero.** `toFixed` siempre usa punto decimal y no agrupa miles.

```js
console.log((1234.5).toFixed(2)); // "1234.50" — punto, sin separador de miles

console.log(new Intl.NumberFormat("es-ES", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}).format(1234.5)); // "1234,50"
```

**Porcentajes:**

```js
const porcentaje = new Intl.NumberFormat("es-ES", { style: "percent" });

console.log(porcentaje.format(0.256)); // "26 %"
console.log(porcentaje.format(1)); // "100 %"
```

`0.256` es `25,6 %`; el formateador redondea a entero por defecto. Si quieres decimales, configúralos:

```js
console.log(new Intl.NumberFormat("es-ES", {
  style: "percent",
  minimumFractionDigits: 1,
}).format(0.256)); // "25,6 %"
```

⚠️ En español, el `%` va separado por un espacio duro (no separable). En otros locales va pegado (`25.6%`). No lo concatenes a mano.

**Unidades:**

```js
const km = new Intl.NumberFormat("es-ES", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "short",
});

console.log(km.format(12)); // "12 km"

console.log(new Intl.NumberFormat("en-US", {
  style: "unit",
  unit: "kilometer",
  unitDisplay: "long",
}).format(12)); // "12 kilometers"
```

**Notación compacta** (ideal para contadores y resúmenes):

```js
const compacto = new Intl.NumberFormat("es-ES", { notation: "compact" });

console.log(compacto.format(1234)); // "1,2 mil"
console.log(compacto.format(1234567)); // "1,2 M"
```

**Signo explícito:**

```js
const conSigno = new Intl.NumberFormat("es-ES", { signDisplay: "always" });

console.log(conSigno.format(5)); // "+5"
console.log(conSigno.format(-5)); // "-5"
console.log(conSigno.format(0)); // "+0"
```

### 7.8.4 Monedas

```js
function formatearMoneda(valor, moneda, locale = "es-ES") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: moneda,
  }).format(valor);
}

console.log(formatearMoneda(1234.5, "EUR")); // "1234,50 €"
console.log(formatearMoneda(1234.5, "USD")); // "1234,50 US$"
console.log(formatearMoneda(1234.5, "USD", "en-US")); // "$1,234.50"
console.log(formatearMoneda(1234.5, "JPY", "ja-JP")); // "￥1,235" — el yen no usa decimales
```

⚠️ **La moneda no es solo un símbolo.** `JPY` no tiene decimales, `KWD` tiene tres. `Intl` lo sabe; tu `toFixed(2)` no.

**Mostrar el código en vez del símbolo:**

```js
console.log(new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
  currencyDisplay: "code",
}).format(1234.5)); // "1234,50 EUR"
```

| `currencyDisplay` | Resultado |
|---|---|
| `"symbol"` (por defecto) | `"1234,50 €"` |
| `"narrowSymbol"` | `"1234,50 €"` |
| `"code"` | `"1234,50 EUR"` |
| `"name"` | `"1234,50 euros"` |

⚠️ **Nunca hagas conversión de moneda con `Intl`.** Solo formatea el número que le das. Convertir EUR a USD requiere un tipo de cambio real y una decisión de negocio.

### 7.8.5 `Intl.Collator`: ordenar texto

`sort()` sin comparador ordena por código UTF-16. Eso pone `"Z"` antes que `"a"` y rompe con acentos.

```js
const palabras = ["ñandú", "nube", "Ávila", "zorro", "abeja"];

console.log([...palabras].sort());
// ["Ávila", "abeja", "nube", "zorro", "ñandú"] — orden por código
```

`Intl.Collator` ordena según las reglas del idioma:

```js
const ordenar = new Intl.Collator("es").compare;

console.log([...palabras].sort(ordenar));
// ["abeja", "Ávila", "nube", "ñandú", "zorro"]
```

**Opciones útiles:**

```js
// Ignorar acentos y mayúsculas al comparar
const base = new Intl.Collator("es", { sensitivity: "base" });

console.log(base.compare("cafe", "café")); // 0 — equivalentes
console.log(new Intl.Collator("es").compare("cafe", "café")); // -1 — distintos

// Ordenar "archivo2" antes que "archivo10"
const numerico = new Intl.Collator("es", { numeric: true });

console.log(["archivo10", "archivo2", "archivo1"].sort(numerico.compare));
// ["archivo1", "archivo2", "archivo10"]
```

**El idioma cambia el orden.** En alemán, `ä` se ordena como `a`; en sueco, va después de `z`:

```js
const letras = ["ä", "z", "a"];

console.log([...letras].sort(new Intl.Collator("de").compare));
// ["a", "ä", "z"]

console.log([...letras].sort(new Intl.Collator("sv").compare));
// ["a", "z", "ä"]
```

⚠️ **`localeCompare` es equivalente pero crea un collator cada vez.** Para ordenar muchos elementos, crea el collator una vez.

```js
// ❌ Crea un collator por comparación
palabras.sort((a, b) => a.localeCompare(b, "es"));

// ✅ Un collator reutilizado
const collator = new Intl.Collator("es");
palabras.sort(collator.compare);
```

### 7.8.6 `Intl.PluralRules`: plurales

En español, “1 producto” y “2 productos”. En otros idiomas hay más categorías (cero, dos, pocos, muchos).

```js
const plural = new Intl.PluralRules("es");

console.log(plural.select(0)); // "other"
console.log(plural.select(1)); // "one"
console.log(plural.select(2)); // "other"
```

**Uso típico:**

```js
function contarProductos(n) {
  const regla = new Intl.PluralRules("es").select(n);
  const palabra = regla === "one" ? "producto" : "productos";
  return `${n} ${palabra}`;
}

console.log(contarProductos(1)); // "1 producto"
console.log(contarProductos(5)); // "5 productos"
```

En inglés es igual de simple, pero en árabe o polaco hay cinco formas:

```js
const arabe = new Intl.PluralRules("ar");

console.log([0, 1, 2, 3, 11].map((n) => arabe.select(n)));
// ["zero", "one", "two", "few", "many"]
```

⚠️ **No traduzcas concatenando.** `"${n} producto" + (n === 1 ? "" : "s")` funciona en español y falla en casi todo lo demás.

### 7.8.7 `Intl.ListFormat`: listas naturales

```js
const lista = new Intl.ListFormat("es", {
  style: "long",
  type: "conjunction",
});

console.log(lista.format(["Ana", "Luis", "Marta"])); // "Ana, Luis y Marta"
console.log(lista.format(["Ana"])); // "Ana"
console.log(lista.format(["Ana", "Luis"])); // "Ana y Luis"
```

**Disyunción (“o”):**

```js
const o = new Intl.ListFormat("es", { type: "disjunction" });

console.log(o.format(["Ana", "Luis", "Marta"])); // "Ana, Luis o Marta"
```

| `type` | Resultado |
|---|---|
| `"conjunction"` | y / and |
| `"disjunction"` | o / or |
| `"unit"` | para unidades (`3 kg, 2 m`) |

⚠️ **No uses `join(", ")` para texto visible.** Produciría “Ana, Luis, Marta”, que en español suena incompleto.

### 7.8.8 `Intl.RelativeTimeFormat`: tiempo relativo

```js
const relativo = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

console.log(relativo.format(-1, "day")); // "ayer"
console.log(relativo.format(-3, "day")); // "hace 3 días"
console.log(relativo.format(2, "hour")); // "dentro de 2 horas"
console.log(relativo.format(1, "day")); // "mañana"
```

Con `numeric: "always"` no usa palabras especiales:

```js
const siempre = new Intl.RelativeTimeFormat("es", { numeric: "always" });

console.log(siempre.format(-1, "day")); // "hace 1 día"
```

**Unidades aceptadas:** `"year"`, `"quarter"`, `"month"`, `"week"`, `"day"`, `"hour"`, `"minute"`, `"second"`.

**Helper para fechas:**

```js
function haceCuanto(fecha, ahora = new Date()) {
  const segundos = Math.round((fecha - ahora) / 1000);
  const formato = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  const unidades = [
    ["year", 60 * 60 * 24 * 365],
    ["month", 60 * 60 * 24 * 30],
    ["day", 60 * 60 * 24],
    ["hour", 60 * 60],
    ["minute", 60],
    ["second", 1],
  ];

  for (const [unidad, tamano] of unidades) {
    if (Math.abs(segundos) >= tamano || unidad === "second") {
      return formato.format(Math.round(segundos / tamano), unidad);
    }
  }
}

const ahora = new Date("2026-03-10T12:00:00Z");

console.log(haceCuanto(new Date("2026-03-07T12:00:00Z"), ahora)); // "hace 3 días"
console.log(haceCuanto(new Date("2026-03-10T14:00:00Z"), ahora)); // "dentro de 2 horas"
```

⚠️ Es una aproximación: un mes no tiene 30 días siempre. Para cálculos exactos, usa días y deja los meses para la interfaz.

### 7.8.9 `Intl.DateTimeFormat`: fechas

```js
const fecha = new Date("2026-03-01T10:30:00Z");

const formato = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "long",
  timeZone: "UTC",
});

console.log(formato.format(fecha)); // "1 de marzo de 2026"
```

**Estilos predefinidos:**

| Opción | Resultado |
|---|---|
| `dateStyle: "short"` | `"1/3/26"` |
| `dateStyle: "medium"` | `"1 mar 2026"` |
| `dateStyle: "long"` | `"1 de marzo de 2026"` |
| `dateStyle: "full"` | `"domingo, 1 de marzo de 2026"` |
| `timeStyle: "short"` | `"10:30"` |
| `timeStyle: "medium"` | `"10:30:00"` |
| `timeStyle: "full"` | `"10:30:00 (tiempo universal coordinado)"` |

```js
console.log(new Intl.DateTimeFormat("es-ES", {
  dateStyle: "full",
  timeZone: "UTC",
}).format(fecha)); // "domingo, 1 de marzo de 2026"

console.log(new Intl.DateTimeFormat("es-ES", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "UTC",
}).format(fecha)); // "1/3/26, 10:30"
```

**Componentes sueltos:**

```js
const partes = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

console.log(partes.format(fecha)); // "1 de marzo de 2026"
```

| Componente | Valores |
|---|---|
| `weekday` | `"long"`, `"short"`, `"narrow"` |
| `year` | `"numeric"`, `"2-digit"` |
| `month` | `"numeric"`, `"2-digit"`, `"long"`, `"short"`, `"narrow"` |
| `day` | `"numeric"`, `"2-digit"` |
| `hour`, `minute`, `second` | `"numeric"`, `"2-digit"` |
| `hour12` | `true` / `false` |

```js
console.log(new Intl.DateTimeFormat("es-ES", {
  weekday: "long",
  timeZone: "UTC",
}).format(fecha)); // "domingo"

console.log(new Intl.DateTimeFormat("es-ES", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: "UTC",
}).format(new Date("2026-03-01T13:05:00Z"))); // "01:05 p. m."
```

⚠️ **`dateStyle`/`timeStyle` no se mezclan con componentes sueltos.** Lanza `TypeError`.

```js
// ❌ TypeError: dateStyle y year no se pueden combinar
new Intl.DateTimeFormat("es", { dateStyle: "long", year: "numeric" });
```

**`formatToParts`:** separa el texto en piezas. Útil para maquetar partes distintas (por ejemplo, el mes en negrita).

```js
const piezas = new Intl.DateTimeFormat("es-ES", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
}).formatToParts(fecha);

console.log(piezas);
```

Salida:

```text
[
  { type: "day", value: "1" },
  { type: "literal", value: " de " },
  { type: "month", value: "marzo" },
  { type: "literal", value: " de " },
  { type: "year", value: "2026" }
]
```

**Fechas inválidas:** `Intl` lanza `RangeError`.

```js
const invalida = new Date("no es una fecha");

console.log(Number.isNaN(invalida.getTime())); // true
// new Intl.DateTimeFormat("es").format(invalida); // RangeError
```

### 7.8.10 `Intl.Segmenter`: contar texto de verdad

`"👨‍👩‍👧‍👦".length` no es 1. `.length` cuenta unidades UTF-16, no caracteres visibles.

```js
const familia = "👨‍👩‍👧‍👦";

console.log(familia.length); // 11 — unidades UTF-16
console.log([...familia].length); // 7 — puntos de código
```

`Intl.Segmenter` con `granularity: "grapheme"` cuenta **lo que el usuario ve**:

```js
const grafemas = new Intl.Segmenter("es", { granularity: "grapheme" });

console.log([...grafemas.segment(familia)].length); // 1
console.log([...grafemas.segment("año")].length); // 3
```

**Contar palabras:**

```js
const palabras = new Intl.Segmenter("es", { granularity: "word" });

const texto = "Hola, mundo. ¿Qué tal?";

const lista = [...palabras.segment(texto)]
  .filter((parte) => parte.isWordLike)
  .map((parte) => parte.segment);

console.log(lista); // ["Hola", "mundo", "Qué", "tal"]
```

| Granularidad | Cuenta |
|---|---|
| `"grapheme"` | Caracteres visibles |
| `"word"` | Palabras |
| `"sentence"` | Frases |

⚠️ **`maxlength` de un `<input>` cuenta UTF-16, no grafemas.** Un límite de 10 puede cortar un emoji por la mitad. Para límites estrictos, valida con `Segmenter`.

📌 `Intl.Segmenter` no existe en navegadores muy antiguos. Comprueba `typeof Intl.Segmenter !== "undefined"` si necesitas soporte amplio.

### 7.8.11 `Date` por dentro

Un `Date` es **un número**: milisegundos desde el 1 de enero de 1970 UTC (la *epoch*).

```js
const fecha = new Date("2026-03-01T10:30:00Z");

console.log(fecha.getTime()); // 1772361000000
console.log(new Date(1772361000000).toISOString()); // "2026-03-01T10:30:00.000Z"
console.log(Date.now() > 1772361000000); // true (hoy es posterior)
```

**Formas de crearlo:**

```js
new Date();                                  // ahora
new Date(0);                                 // epoch
new Date("2026-03-01T10:30:00Z");            // ISO 8601
new Date(2026, 2, 1, 10, 30);                // local: año, mes, día, hora, minuto
Date.UTC(2026, 2, 1, 10, 30);                // milisegundos UTC
```

⚠️ **El mes empieza en 0.** Enero es `0`, diciembre es `11`. Es una de las trampas más antiguas del lenguaje.

```js
console.log(new Date(2026, 0, 1).getMonth()); // 0 — enero
console.log(new Date(2026, 11, 1).getMonth()); // 11 — diciembre
```

**Getters locales frente a UTC:**

| Local | UTC |
|---|---|
| `getFullYear()` | `getUTCFullYear()` |
| `getMonth()` | `getUTCMonth()` |
| `getDate()` | `getUTCDate()` |
| `getDay()` | `getUTCDay()` |
| `getHours()` | `getUTCHours()` |
| `getTimezoneOffset()` | — |

```js
const fecha = new Date("2026-03-01T23:30:00Z");

console.log(fecha.getUTCDate()); // 1
console.log(fecha.getUTCHours()); // 23
// getDate() y getHours() dependen de la zona del entorno
```

⚠️ **`getDay()` devuelve 0 para domingo**, no 1 para lunes.

```js
console.log(new Date("2026-03-01T00:00:00Z").getUTCDay()); // 0 — domingo
```

**Mutabilidad:** casi todos los `set*` modifican el objeto.

```js
const fecha = new Date("2026-03-01T00:00:00Z");
const copia = fecha;

copia.setUTCFullYear(2027);

console.log(fecha.getUTCFullYear()); // 2027 — es el mismo objeto
```

```js
// ✅ Copia si vas a modificar
const original = new Date("2026-03-01T00:00:00Z");
const modificada = new Date(original.getTime());
modificada.setUTCFullYear(2027);

console.log(original.getUTCFullYear()); // 2026
console.log(modificada.getUTCFullYear()); // 2027
```

**Desbordamiento de componentes:** `Date` normaliza valores fuera de rango en lugar de lanzar.

```js
const d = new Date(Date.UTC(2026, 0, 31));
d.setUTCMonth(1); // febrero

console.log(d.toISOString()); // "2026-03-03T00:00:00.000Z" — febrero no tiene 31
```

Eso es útil para “sumar un mes”, pero también esconde errores de validación.

**Fechas inválidas:** no lanzan al crearse; se detectan con `Number.isNaN(fecha.getTime())`.

```js
const mala = new Date("2026-02-30");

console.log(mala.toISOString()); // puede desbordarse a marzo, según el motor
console.log(Number.isNaN(new Date("no").getTime())); // true
```

⚠️ **El parseo de strings no ISO es dependiente del motor.** `"03/04/2026"` es marzo o abril según el entorno. Usa siempre ISO 8601 (`"2026-03-04"`).

```js
// ❌ Ambiguo
new Date("03/04/2026");

// ✅ ISO
new Date("2026-03-04T00:00:00Z");
```

**`toISOString()` lanza `RangeError` con una fecha inválida:**

```js
try {
  new Date("no").toISOString();
} catch (error) {
  console.log(error.name); // "RangeError"
}
```

### 7.8.12 Zonas horarias y UTC

**Regla de oro: guarda en UTC, muestra en la zona del usuario.**

```js
const ahora = new Date();

// Guardar
const paraGuardar = ahora.toISOString();
console.log(paraGuardar); // "2026-11-17T...Z"

// Mostrar
const paraMostrar = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "long",
  timeStyle: "short",
}).format(ahora);

console.log(paraMostrar);
```

**¿Por qué no guardar la hora local como string?** Porque pierdes la zona. Un usuario en Madrid y otro en Bogotá verían el mismo texto sin saber a qué hora real corresponde.

```js
// ❌ Sin zona: imposible reconstruir el instante
const malo = "2026-03-01 10:30";

// ✅ ISO con Z
const bueno = "2026-03-01T10:30:00.000Z";
```

**Mostrar en una zona concreta:**

```js
const fecha = new Date("2026-03-01T10:30:00Z");

const madrid = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "Europe/Madrid",
});

const bogota = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "short",
  timeStyle: "short",
  timeZone: "America/Bogota",
});

console.log(madrid.format(fecha)); // "1/3/26, 11:30"
console.log(bogota.format(fecha)); // "1/3/26, 5:30"
```

**La zona del entorno:**

```js
console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
// "Europe/Madrid", "America/Bogota"…
```

**`getTimezoneOffset()`** devuelve los minutos de diferencia con UTC, con el signo invertido: Bogotá (UTC−5) devuelve `300`.

```js
console.log(new Date().getTimezoneOffset()); // 300 en Bogotá, -60 en Madrid
```

⚠️ **Sumar 24 horas no siempre suma un día.** En el cambio de horario de verano, un día puede tener 23 o 25 horas.

```js
// ❌ Puede desviarse una hora en el cambio de horario
const manana = new Date(fecha.getTime() + 24 * 60 * 60 * 1000);

// ✅ Suma días de calendario
const d = new Date(fecha.getTime());
d.setUTCDate(d.getUTCDate() + 1);
```

**Comparar fechas:** con `getTime()` o restando.

```js
const a = new Date("2026-03-01T00:00:00Z");
const b = new Date("2026-03-10T00:00:00Z");

console.log(b > a); // true
console.log(b - a); // 777600000 — milisegundos
console.log((b - a) / 86400000); // 9 — días
```

⚠️ `b - a` funciona por conversión a número, pero es implícito. `b.getTime() - a.getTime()` es más claro.

### 7.8.13 Duraciones

No hay un tipo `Duration` estándar en `Date`. Se calcula con milisegundos.

```js
function duracionEntre(inicio, fin) {
  const ms = fin.getTime() - inicio.getTime();

  const dias = Math.floor(ms / 86400000);
  const horas = Math.floor((ms % 86400000) / 3600000);
  const minutos = Math.floor((ms % 3600000) / 60000);

  return { dias, horas, minutos };
}

const inicio = new Date("2026-03-01T08:00:00Z");
const fin = new Date("2026-03-03T11:30:00Z");

console.log(duracionEntre(inicio, fin)); // { dias: 2, horas: 3, minutos: 30 }
```

📌 `Intl.DurationFormat` (ES2025) formatea duraciones directamente. Está en Node 24+ y navegadores recientes:

```js
if (typeof Intl.DurationFormat === "function") {
  const formato = new Intl.DurationFormat("es", { style: "long" });
  console.log(formato.format({ days: 2, hours: 3, minutes: 30 }));
  // "2 días, 3 horas y 30 minutos"
}
```

### 7.8.14 Rendimiento: cachea los formateadores

Crear un `Intl.NumberFormat` es caro. En una lista de 1.000 precios, crear uno por elemento multiplica el coste.

```js
// ❌ Crea 1.000 formateadores
const textos = productos.map((p) =>
  new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
  }).format(p.precio)
);
```

```js
// ✅ Uno solo, reutilizado
const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const textos = productos.map((p) => euro.format(p.precio));
```

**Caché por configuración:**

```js
const cache = new Map();

function obtenerFormatoMoneda(moneda, locale = "es-ES") {
  const clave = `${locale}|${moneda}`;

  if (!cache.has(clave)) {
    cache.set(
      clave,
      new Intl.NumberFormat(locale, {
        style: "currency",
        currency: moneda,
      })
    );
  }

  return cache.get(clave);
}
```

⚠️ **No crees formateadores dentro de un `render` que se ejecuta en cada tecla.** Muévelos al ámbito del módulo.

### 7.8.15 `Temporal`: el futuro de las fechas

📌 `Date` arrastra decisiones de 1995: mes 0-indexado, mutable, sin tipo de duración ni de zona. **`Temporal`** es la API que lo reemplaza. Node 26 ya la incluye; en navegadores está llegando.

```js
if (typeof Temporal !== "undefined") {
  const fecha = Temporal.PlainDate.from("2026-03-01");
  console.log(fecha.toString()); // "2026-03-01"
  console.log(fecha.add({ months: 1 }).toString()); // "2026-04-01"

  const instante = Temporal.Instant.from("2026-03-01T10:30:00Z");
  console.log(instante.toString()); // "2026-03-01T10:30:00Z"

  const duracion = Temporal.PlainDate.from("2026-03-01")
    .until("2026-03-10");
  console.log(duracion.days); // 9
}
```

| `Date` | `Temporal` |
|---|---|
| Mes 0-indexado | Mes 1-indexado |
| Mutable | Inmutable |
| Sin duración | `Temporal.Duration` |
| Sin fecha sin hora | `PlainDate` |
| Zonas limitadas | `ZonedDateTime` |
| Parseo ambiguo | Métodos explícitos |

📌 No lo uses en producción todavía sin comprobar soporte. En el Módulo 8 verás cómo elegir dependencias y polyfills.

### ✅ Haz esto / ❌ Evita esto (7.8)

```js
// ✅ Un locale decidido por la app
const LOCALE = "es-ES";

// ✅ Formateadores reutilizados
const euro = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
});

// ✅ Fechas en ISO con zona al guardar
const guardar = fecha.toISOString();

// ✅ Mostrar con Intl y timeZone explícita
new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "long",
  timeZone: "Europe/Madrid",
}).format(fecha);

// ✅ Collator para ordenar texto
const collator = new Intl.Collator(LOCALE);
palabras.sort(collator.compare);

// ✅ Plurales con Intl.PluralRules
const regla = new Intl.PluralRules(LOCALE).select(n);

// ✅ Segmenter para contar grafemas
const grafemas = [...new Intl.Segmenter(LOCALE).segment(texto)].length;
```

```js
// ❌ toFixed para dinero
precio.toFixed(2) + " €";

// ❌ Formatear fechas concatenando
`${dia}/${mes}/${anio}`; // ambiguo entre países

// ❌ Guardar hora local sin zona
"2026-03-01 10:30";

// ❌ sort() sin comparador para texto
nombres.sort();

// ❌ Crear un formateador por elemento en un bucle
items.map((i) => new Intl.NumberFormat("es-ES").format(i.precio));

// ❌ Sumar 24 h para avanzar un día
new Date(fecha.getTime() + 86400000);

// ❌ Asumir que el mes de Date empieza en 1
new Date(2026, 3, 1); // es abril, no marzo
```

> 🧠 **Regla final de 7.8:** guarda instantes en UTC, formatea con `Intl` y el locale de tu interfaz, y reutiliza los formateadores. Todo lo demás son bugs esperando a que alguien cruce una frontera.

---

## 7.9 — Arquitectura de una app con datos remotos

Ya tienes todas las piezas: módulos, funciones puras, errores tipados, `fetch` con timeout y cancelación, JSON, regex e `Intl`. El problema ahora es **dónde poner cada pieza**.

Una aplicación pequeña puede vivir en un archivo. Una aplicación real, no. Cuando mezclas la petición HTTP, el cálculo del carrito y el `innerHTML` en el mismo lugar, aparecen los mismos síntomas en todos los proyectos:

- No puedes probar el cálculo sin arrancar un navegador.
- Cambiar la URL del backend obliga a tocar diez sitios.
- Un `404` se muestra como “error de red”.
- El total del carrito se calcula en tres lugares y los tres dan resultados distintos.
- Un cambio de diseño rompe la lógica.
- Nadie sabe qué archivo importa a cuál.

Este apartado construye, archivo por archivo, una tienda pequeña pero **con la estructura que usarías en producción**. No es la única arquitectura posible; es una que puedes defender en una entrevista y mantener dentro de un año.

### 7.9.1 El problema: todo en un archivo

Así empieza casi todo el mundo. Funciona, y por eso engaña.

```js
// ❌ Todo mezclado: red, estado, negocio y DOM en el mismo lugar
const app = document.querySelector("#app");
let productos = [];
let carrito = [];
let filtro = "";

async function iniciar() {
  app.innerHTML = "Cargando…";

  try {
    const respuesta = await fetch("http://localhost:3000/api/productos");
    productos = await respuesta.json();
  } catch (error) {
    app.innerHTML = "Error";
    return;
  }

  pintar();
}

function pintar() {
  const visibles = productos.filter((p) =>
    p.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  app.innerHTML = visibles
    .map(
      (p) => `
        <article>
          <h3>${p.nombre}</h3>
          <p>${(p.precio * 1.21).toFixed(2)} €</p>
          <button onclick="agregar(${p.id})">Añadir</button>
        </article>
      `
    )
    .join("");

  const total = carrito.reduce((suma, linea) => {
    const producto = productos.find((p) => p.id === linea.id);
    return suma + producto.precio * linea.cantidad;
  }, 0);

  app.insertAdjacentHTML("beforeend", `<p>Total: ${total} €</p>`);
}

function agregar(id) {
  const linea = carrito.find((l) => l.id === id);
  if (linea) linea.cantidad += 1;
  else carrito.push({ id, cantidad: 1 });
  pintar();
}

iniciar();
```

Enumera los problemas:

1. **La red está dentro de la vista.** Si mañana cambias `fetch` por Axios, tocas el render.
2. **La regla de negocio está en el render.** El IVA está escrito a mano y el total se recalcula en cada pintado.
3. **El estado es global y mutable.** `linea.cantidad += 1` puede ocurrir en cualquier parte.
4. **No hay estados.** “Cargando”, “vacío” y “error” son strings sueltos; no puedes distinguirlos ni testearlos.
5. **`innerHTML` interpola datos del servidor.** Un producto llamado `<img onerror=...>` ejecuta código (XSS, Módulo 6).
6. **Nada es testeable sin navegador.** La lógica no se puede importar sin `document`.

La solución no es “más carpetas”. Es **separar responsabilidades y fijar la dirección de las dependencias**.

### 7.9.2 Capas y reglas de dependencia

| Capa | Archivo | Sabe de | **No** sabe de |
|---|---|---|---|
| Configuración | `config.js` | URL base, locale, timeout | DOM, `fetch`, productos |
| Transporte | `http.js` | `fetch`, HTTP, errores de red | productos, DOM |
| API | `api.js` | rutas, verbos, cuerpos | DOM, estado |
| Dominio | `dominio.js` | reglas puras: filtrar, ordenar, sumar | `fetch`, DOM, estado global |
| Estado | `estado.js` | acciones, reducer, suscriptores | DOM, `fetch` |
| Vista | `vista.js` | DOM, eventos, formato | `fetch`, reglas de negocio |
| Composición | `main.js` | todas, para conectarlas | lógica propia |

**Las cuatro reglas:**

1. **Las dependencias apuntan hacia dentro.** La vista puede importar el dominio; el dominio **nunca** importa la vista.
2. **Solo `http.js` conoce `fetch`.** Si mañana cambias de librería, hay un único archivo que tocar.
3. **Solo `vista.js` toca `document`.** El resto se puede ejecutar en Node.
4. **`main.js` es el único que compone.** Es el “cableado”; no contiene reglas.

Diagrama de dependencias (una flecha significa “importa”):

```text
config.js ◄── http.js ◄── api.js ◄── main.js
                                      │
dominio.js ◄── estado.js ◄────────────┤
     ▲                                │
     └──────────── vista.js ◄─────────┘
```

`dominio.js` no importa nada. `estado.js` importa el dominio solo si lo necesita (aquí no). `vista.js` importa el dominio para calcular lo que muestra. `main.js` importa todo y lo une.

⚠️ **Una dependencia circular es una señal de diseño, no un problema de herramientas.** Si `api.js` importa `vista.js` para mostrar un error, la capa está mal. El error se **devuelve** o se **lanza**; alguien de arriba decide cómo mostrarlo.

### 7.9.3 El flujo de una acción

Cargar productos:

```text
main.js                 estado.js              api.js            http.js           servidor
   │                        │                     │                 │                 │
   │ despachar(cargar/inicio)                     │                 │                 │
   │───────────────────────►│                     │                 │                 │
   │                        │ fase = "loading"    │                 │                 │
   │ api.productos(signal)  │                     │                 │                 │
   │─────────────────────────────────────────────►│                 │                 │
   │                        │                     │ pedir("productos")                │
   │                        │                     │────────────────►│                 │
   │                        │                     │                 │ fetch(...)      │
   │                        │                     │                 │────────────────►│
   │                        │                     │                 │◄────────────────│
   │                        │                     │◄────────────────│                 │
   │◄─────────────────────────────────────────────│                 │                 │
   │ despachar(cargar/exito, productos)           │                 │                 │
   │───────────────────────►│                     │                 │                 │
   │                        │ nuevo estado        │                 │                 │
   │◄───────────────────────│ (suscriptores)      │                 │                 │
   │ vista.render(estado)   │                     │                 │                 │
```

Añadir al carrito:

```text
click → vista.alAgregar(id) → main despacha → reducer calcula nuevo estado → suscriptor → vista.render
```

Fíjate en lo que **no** ocurre: la vista no modifica el carrito, el reducer no toca el DOM y `main` no sabe sumar precios. Cada paso tiene un dueño.

### 7.9.4 `config.js`: un solo lugar para lo configurable

```js
// 📄 config.js
export const CONFIG = Object.freeze({
  baseUrl: "http://localhost:3000/api/",
  locale: "es-ES",
  moneda: "EUR",
  timeout: 8000,
});
```

Tres decisiones deliberadas:

- **`baseUrl` termina en `/`.** Así `new URL("productos", baseUrl)` produce `.../api/productos` sin concatenar strings a mano. Si no termina en barra, la última parte se reemplaza y la URL sale mal.
- **`Object.freeze`** evita que alguien haga `CONFIG.baseUrl = "..."` por accidente. Es superficial: congela las propiedades, no objetos anidados (Módulo 3).
- **`locale` y `moneda` viven aquí.** La vista los usa para `Intl`; no están dispersos por el código.

📌 En el Módulo 8 verás variables de entorno y archivos `.env` para no hardcodear la URL de producción. Aquí basta con una constante.

### 7.9.5 `http.js`: el transporte

```js
// 📄 http.js
import { CONFIG } from "./config.js";

export class HttpError extends Error {
  constructor(status, mensaje, cuerpo) {
    super(mensaje);
    this.name = "HttpError";
    this.status = status;
    this.cuerpo = cuerpo;
  }
}

export class ErrorDeRed extends Error {
  constructor(mensaje, opciones) {
    super(mensaje, opciones);
    this.name = "ErrorDeRed";
  }
}

export async function pedir(ruta, opciones = {}) {
  const url = new URL(ruta, CONFIG.baseUrl);
  const signal = opciones.signal ?? AbortSignal.timeout(CONFIG.timeout);

  let respuesta;

  try {
    respuesta = await fetch(url, {
      ...opciones,
      signal,
      headers: {
        Accept: "application/json",
        ...opciones.headers,
      },
    });
  } catch (error) {
    if (error.name === "AbortError") throw error;

    throw new ErrorDeRed(`No se pudo conectar con ${url.href}`, {
      cause: error,
    });
  }

  if (!respuesta.ok) {
    let cuerpo = null;

    try {
      cuerpo = await respuesta.json();
    } catch {
      // la respuesta de error no era JSON
    }

    throw new HttpError(
      respuesta.status,
      cuerpo?.error ?? `HTTP ${respuesta.status}`,
      cuerpo
    );
  }

  if (respuesta.status === 204) return null;

  return respuesta.json();
}
```

Paso a paso:

**1. `new URL(ruta, CONFIG.baseUrl)`** resuelve rutas relativas contra la base. También codifica caracteres raros en los parámetros y evita el clásico `base + "/" + ruta` con dobles barras.

**2. El `signal`.** Si quien llama pasa uno (por ejemplo, para cancelar al cambiar de filtro), se respeta. Si no, `AbortSignal.timeout(CONFIG.timeout)` corta a los 8 segundos. Sin timeout, una petición colgada deja la interfaz en “Cargando…” para siempre.

**3. `try/catch` alrededor de `fetch`.** Aquí solo se capturan **fallos de red** (DNS, conexión rechazada, CORS, timeout). Un `404` **no** entra en el `catch`: `fetch` resuelve con `ok: false`.

**4. `AbortError` se relanza tal cual.** Cancelar no es un error que deba mostrarse: es una acción deliberada. `main.js` lo detecta y no pinta nada.

**5. `ErrorDeRed` envuelve el error original con `cause`.** Conservas el detalle técnico y añades contexto. El mensaje incluye la URL, que es lo que necesitas para depurar.

**6. `!respuesta.ok` lanza `HttpError`.** Intenta leer el cuerpo del error (muchas APIs devuelven `{ error: "..." }`), pero si no es JSON no falla por eso: usa un mensaje genérico.

**7. `204 No Content` devuelve `null`.** Un `DELETE` exitoso no tiene cuerpo; llamar a `.json()` lanzaría `SyntaxError`.

**8. El resto se parsea como JSON.** Si el servidor devuelve HTML o JSON roto, `respuesta.json()` lanza `SyntaxError`. Es un error real y debe propagarse: significa que el contrato se rompió.

⚠️ **`HttpError` y `ErrorDeRed` son clases distintas a propósito.** Permiten decisiones distintas: un `HttpError` con `status` se traduce a un mensaje de negocio; un `ErrorDeRed` sugiere revisar la conexión.

### 7.9.6 `api.js`: el contrato con el backend

```js
// 📄 api.js
import { pedir } from "./http.js";

const json = { "Content-Type": "application/json" };

export const api = {
  productos: (signal) => pedir("productos", { signal }),

  producto: (id) => pedir(`productos/${id}`),

  crear: (datos) =>
    pedir("productos", {
      method: "POST",
      headers: json,
      body: JSON.stringify(datos),
    }),

  actualizar: (id, cambios) =>
    pedir(`productos/${id}`, {
      method: "PATCH",
      headers: json,
      body: JSON.stringify(cambios),
    }),

  borrar: (id) => pedir(`productos/${id}`, { method: "DELETE" }),
};
```

Esta capa es **fina a propósito**. Solo traduce nombres de negocio a rutas y verbos:

| Función | Petición |
|---|---|
| `api.productos(signal)` | `GET /api/productos` |
| `api.producto(id)` | `GET /api/productos/:id` |
| `api.crear(datos)` | `POST /api/productos` |
| `api.actualizar(id, cambios)` | `PATCH /api/productos/:id` |
| `api.borrar(id)` | `DELETE /api/productos/:id` |

Ventajas:

- Si el backend cambia `/productos` por `/items`, se toca **una** línea.
- La vista nunca construye URLs ni conoce verbos HTTP.
- Puedes sustituir `api` por un doble de prueba sin red.

⚠️ **No pongas lógica aquí.** Validar que el precio sea positivo, calcular el IVA o decidir qué hacer con un error son responsabilidades del dominio o de `main`, no del contrato HTTP.

### 7.9.7 `dominio.js`: las reglas, sin efectos

```js
// 📄 dominio.js
function normalizar(texto) {
  return String(texto).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function filtrarPorTexto(productos, texto) {
  const q = normalizar(texto).trim();
  if (q === "") return productos;
  return productos.filter((p) => normalizar(p.nombre).includes(q));
}

export function ordenarProductos(productos, criterio) {
  const copia = [...productos];

  if (criterio === "precio-asc") {
    return copia.sort((a, b) => a.precio - b.precio);
  }

  if (criterio === "precio-desc") {
    return copia.sort((a, b) => b.precio - a.precio);
  }

  return copia.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

export function productosVisibles(estado) {
  return ordenarProductos(
    filtrarPorTexto(estado.productos, estado.filtro),
    estado.orden
  );
}

export function lineasCarrito(estado) {
  return estado.carrito
    .map((linea) => {
      const producto = estado.productos.find((p) => p.id === linea.id);
      if (!producto) return null;

      return {
        ...producto,
        cantidad: linea.cantidad,
        subtotal: producto.precio * linea.cantidad,
      };
    })
    .filter(Boolean);
}

export function totalCarrito(estado) {
  return lineasCarrito(estado).reduce((suma, l) => suma + l.subtotal, 0);
}

export function cantidadTotal(estado) {
  return estado.carrito.reduce((suma, l) => suma + l.cantidad, 0);
}
```

Este archivo es el corazón de la aplicación y **no importa nada**. Todo son funciones puras: reciben datos, devuelven datos.

**`normalizar`** elimina acentos y pasa a minúsculas. Así “cafe” encuentra “Café” (lo viste en 7.7.17). Es privada: no se exporta porque es un detalle de implementación.

**`filtrarPorTexto`** devuelve el array original si la búsqueda está vacía. No copia innecesariamente y no muta.

**`ordenarProductos`** copia con `[...productos]` **antes** de ordenar. `sort` muta; el estado nunca debe cambiar por una lectura.

**`productosVisibles`** compone filtrar y ordenar. La vista llama a esta función y no repite reglas.

**`lineasCarrito`** une el carrito (que solo guarda `id` y `cantidad`) con los productos (que tienen nombre y precio). Si un producto desapareció del catálogo, la línea se descarta con `null` y `filter(Boolean)`.

**`totalCarrito` y `cantidadTotal`** son **derivados**: se calculan a partir del estado, no se guardan. Guardar el total es la receta para que se desincronice.

> 🧠 **Regla:** si un dato se puede calcular a partir de otro, no lo guardes. Calcúlalo.

### 7.9.8 `estado.js`: un estado, acciones, reducer

```js
// 📄 estado.js
export const estadoInicial = Object.freeze({
  productos: [],
  filtro: "",
  orden: "nombre",
  carrito: [],
  fase: "idle",
  error: null,
});

export function reducir(estado, accion) {
  switch (accion.tipo) {
    case "cargar/inicio":
      return { ...estado, fase: "loading", error: null };

    case "cargar/exito":
      return {
        ...estado,
        productos: accion.productos,
        fase: accion.productos.length === 0 ? "empty" : "success",
        error: null,
      };

    case "cargar/error":
      return { ...estado, fase: "error", error: accion.error };

    case "filtro/cambiar":
      return { ...estado, filtro: accion.texto };

    case "orden/cambiar":
      return { ...estado, orden: accion.orden };

    case "carrito/agregar": {
      const producto = estado.productos.find((p) => p.id === accion.id);
      if (!producto) return estado;

      const linea = estado.carrito.find((l) => l.id === accion.id);
      const cantidad = linea?.cantidad ?? 0;

      if (cantidad >= producto.stock) return estado;

      const carrito = linea
        ? estado.carrito.map((l) =>
            l.id === accion.id ? { ...l, cantidad: l.cantidad + 1 } : l
          )
        : [...estado.carrito, { id: accion.id, cantidad: 1 }];

      return { ...estado, carrito };
    }

    case "carrito/quitar": {
      const linea = estado.carrito.find((l) => l.id === accion.id);
      if (!linea) return estado;

      const carrito =
        linea.cantidad <= 1
          ? estado.carrito.filter((l) => l.id !== accion.id)
          : estado.carrito.map((l) =>
              l.id === accion.id ? { ...l, cantidad: l.cantidad - 1 } : l
            );

      return { ...estado, carrito };
    }

    case "carrito/vaciar":
      return { ...estado, carrito: [] };

    default:
      return estado;
  }
}

export function crearStore(reducer, inicial) {
  let estado = inicial;
  const oyentes = new Set();

  return {
    get estado() {
      return estado;
    },

    despachar(accion) {
      const siguiente = reducer(estado, accion);
      if (siguiente === estado) return;

      estado = siguiente;
      for (const oyente of oyentes) oyente(estado);
    },

    suscribir(oyente) {
      oyentes.add(oyente);
      return () => oyentes.delete(oyente);
    },
  };
}
```

**La forma del estado:**

| Campo | Tipo | Significado |
|---|---|---|
| `productos` | `Producto[]` | Lo que devolvió el servidor |
| `filtro` | `string` | Texto de búsqueda |
| `orden` | `"nombre" \| "precio-asc" \| "precio-desc"` | Criterio |
| `carrito` | `{ id, cantidad }[]` | Solo referencias y cantidades |
| `fase` | `"idle" \| "loading" \| "success" \| "empty" \| "error"` | Estado de la carga |
| `error` | `Error \| null` | El error tipado, no un string |

**Las acciones** son objetos con una propiedad `tipo`. Son datos: se pueden registrar, reproducir y testear.

| Acción | Efecto |
|---|---|
| `cargar/inicio` | `fase = "loading"`, limpia el error |
| `cargar/exito` | guarda productos; `fase = "success"` o `"empty"` |
| `cargar/error` | `fase = "error"`, guarda el error |
| `filtro/cambiar` | cambia el texto |
| `orden/cambiar` | cambia el criterio |
| `carrito/agregar` | suma una unidad si hay stock |
| `carrito/quitar` | resta una unidad o elimina la línea |
| `carrito/vaciar` | deja el carrito vacío |

**El reducer** es una función pura `(estado, accion) => nuevoEstado`. Nunca modifica `estado`; devuelve objetos nuevos con spread. Si la acción no cambia nada (por ejemplo, agregar sin stock), devuelve **el mismo objeto**. Eso permite al store saber que no debe notificar.

**El store** es la única pieza con estado mutable, y lo encapsula:

- `get estado` expone una lectura.
- `despachar` calcula el siguiente estado y avisa a los suscriptores **solo si cambió**.
- `suscribir` registra un oyente y devuelve una función para darse de baja. Sin esa función, una vista que se destruye seguiría recibiendo actualizaciones: fuga de memoria.

⚠️ **`Object.freeze` en `estadoInicial` es superficial.** `productos` y `carrito` son arrays que podrían mutarse. La protección real es la disciplina del reducer: siempre crear arrays y objetos nuevos.

⚠️ **El reducer no puede hacer `fetch`, `localStorage` ni `console.log`.** Si lo hace, deja de ser puro, deja de ser testeable y las acciones dejan de ser reproducibles.

### 7.9.9 `vista.js`: render y eventos

```js
// 📄 vista.js
import {
  cantidadTotal,
  lineasCarrito,
  productosVisibles,
  totalCarrito,
} from "./dominio.js";

const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function crearVista(raiz, acciones) {
  raiz.innerHTML = `
    <section class="barra">
      <input id="filtro" type="search" placeholder="Buscar producto" aria-label="Buscar producto" />
      <select id="orden" aria-label="Ordenar por">
        <option value="nombre">Nombre</option>
        <option value="precio-asc">Precio: menor a mayor</option>
        <option value="precio-desc">Precio: mayor a menor</option>
      </select>
      <button id="reintentar" type="button" hidden>Reintentar</button>
      <span id="estado" role="status"></span>
    </section>

    <section id="productos" aria-live="polite"></section>

    <aside>
      <h2>Carrito (<span id="cantidad">0</span>)</h2>
      <ul id="carrito"></ul>
      <p>Total: <strong id="total"></strong></p>
      <button id="vaciar" type="button">Vaciar</button>
    </aside>
  `;

  const filtro = raiz.querySelector("#filtro");
  const orden = raiz.querySelector("#orden");
  const reintentar = raiz.querySelector("#reintentar");
  const estadoTexto = raiz.querySelector("#estado");
  const contenedor = raiz.querySelector("#productos");
  const carrito = raiz.querySelector("#carrito");
  const cantidad = raiz.querySelector("#cantidad");
  const total = raiz.querySelector("#total");
  const vaciar = raiz.querySelector("#vaciar");

  const controller = new AbortController();
  const { signal } = controller;

  filtro.addEventListener(
    "input",
    (evento) => acciones.alFiltrar(evento.target.value),
    { signal }
  );

  orden.addEventListener(
    "change",
    (evento) => acciones.alOrdenar(evento.target.value),
    { signal }
  );

  reintentar.addEventListener("click", acciones.alReintentar, { signal });
  vaciar.addEventListener("click", acciones.alVaciar, { signal });

  contenedor.addEventListener(
    "click",
    (evento) => {
      const boton = evento.target.closest("[data-agregar]");
      if (!boton) return;
      acciones.alAgregar(Number(boton.dataset.agregar));
    },
    { signal }
  );

  carrito.addEventListener(
    "click",
    (evento) => {
      const boton = evento.target.closest("[data-quitar]");
      if (!boton) return;
      acciones.alQuitar(Number(boton.dataset.quitar));
    },
    { signal }
  );

  function render(estado) {
    if (document.activeElement !== filtro) filtro.value = estado.filtro;

    orden.value = estado.orden;
    reintentar.hidden = estado.fase !== "error";
    vaciar.disabled = estado.carrito.length === 0;
    estadoTexto.textContent = mensajeDeEstado(estado);

    renderProductos(estado);
    renderCarrito(estado);
  }

  function renderProductos(estado) {
    contenedor.replaceChildren();

    if (estado.fase === "idle" || estado.fase === "loading") {
      contenedor.textContent = "Cargando…";
      return;
    }

    if (estado.fase === "error") {
      contenedor.textContent = mensajeDeError(estado.error);
      return;
    }

    const visibles = productosVisibles(estado);

    if (visibles.length === 0) {
      contenedor.textContent = estado.filtro
        ? "No hay productos que coincidan."
        : "Todavía no hay productos.";
      return;
    }

    const fragmento = document.createDocumentFragment();

    for (const producto of visibles) {
      const linea = estado.carrito.find((l) => l.id === producto.id);
      const enCarrito = linea?.cantidad ?? 0;

      const articulo = document.createElement("article");
      articulo.className = "producto";

      const titulo = document.createElement("h3");
      titulo.textContent = producto.nombre;

      const precio = document.createElement("p");
      precio.textContent = euro.format(producto.precio);

      const stock = document.createElement("p");
      stock.textContent = `${producto.stock} en stock`;

      const boton = document.createElement("button");
      boton.type = "button";
      boton.dataset.agregar = String(producto.id);
      boton.disabled = producto.stock === 0 || enCarrito >= producto.stock;
      boton.textContent =
        producto.stock === 0
          ? "Sin stock"
          : enCarrito > 0
            ? `Añadir (${enCarrito})`
            : "Añadir";

      articulo.append(titulo, precio, stock, boton);
      fragmento.append(articulo);
    }

    contenedor.append(fragmento);
  }

  function renderCarrito(estado) {
    carrito.replaceChildren();

    const fragmento = document.createDocumentFragment();

    for (const linea of lineasCarrito(estado)) {
      const li = document.createElement("li");

      const texto = document.createElement("span");
      texto.textContent = `${linea.nombre} × ${linea.cantidad} — ${euro.format(linea.subtotal)}`;

      const quitar = document.createElement("button");
      quitar.type = "button";
      quitar.textContent = "Quitar";
      quitar.dataset.quitar = String(linea.id);
      quitar.setAttribute("aria-label", `Quitar una unidad de ${linea.nombre}`);

      li.append(texto, quitar);
      fragmento.append(li);
    }

    carrito.append(fragmento);
    cantidad.textContent = String(cantidadTotal(estado));
    total.textContent = euro.format(totalCarrito(estado));
  }

  return {
    render,
    destruir() {
      controller.abort();
      raiz.replaceChildren();
    },
  };
}

function mensajeDeEstado(estado) {
  if (estado.fase === "loading") return "Cargando productos…";
  if (estado.fase === "error") return "Error de carga";
  if (estado.fase === "empty") return "Sin productos";
  if (estado.fase === "success") {
    return `${productosVisibles(estado).length} producto(s)`;
  }
  return "";
}

function mensajeDeError(error) {
  if (error?.name === "HttpError") {
    if (error.status === 404) return "No encontramos los productos.";
    if (error.status === 429) return "Demasiadas peticiones. Espera un momento.";
    if (error.status >= 500) return "El servidor no responde. Inténtalo de nuevo.";
  }

  if (error?.name === "ErrorDeRed") {
    return "Sin conexión. Revisa tu red e inténtalo de nuevo.";
  }

  return "Algo salió mal. Inténtalo de nuevo.";
}
```

La vista tiene tres responsabilidades y ninguna más: **crear la estructura**, **escuchar eventos** y **pintar el estado**.

**1. La plantilla estática usa `innerHTML` una sola vez.** No interpola datos: los campos se rellenan después con `textContent`. Es la diferencia entre una plantilla segura y un XSS. En el Módulo 6 viste por qué.

**2. Delegación de eventos.** En lugar de un `addEventListener` por botón (que se pierde al repintar), hay **un** oyente en el contenedor. `evento.target.closest("[data-agregar]")` encuentra el botón aunque el clic caiga en el texto. Los datos viajan en `data-*`, no en `onclick` inline.

**3. `AbortController` para los oyentes.** Todos los `addEventListener` reciben `{ signal }`. `destruir()` llama a `controller.abort()` y desregistra todo de golpe. Es el mismo mecanismo que usaste para cancelar `fetch`, aplicado a eventos.

**4. `render` no decide reglas.** Pregunta al dominio (`productosVisibles`, `lineasCarrito`, `totalCarrito`) y escribe el resultado. No suma precios ni filtra.

**5. Los cinco estados se pintan distinto.** `idle`/`loading` muestran “Cargando…”, `error` muestra el mensaje traducido, `empty` distingue “no hay productos” de “tu filtro no coincide”, `success` pinta la lista.

**6. Detalles de usabilidad que evitan bugs:**

- `if (document.activeElement !== filtro) filtro.value = estado.filtro;` no roba el cursor mientras escribes.
- El botón de añadir se deshabilita cuando `stock === 0` o cuando ya tienes todas las unidades disponibles.
- `role="status"` y `aria-live="polite"` anuncian los cambios a lectores de pantalla.
- El formateador de moneda se crea **una vez**, fuera de `render` (7.8.14).

**7. `mensajeDeError` traduce tipos, no strings.** Comprueba `error.name` y `error.status`. Si mañana el backend añade un `409`, se añade un caso; no hay que buscar textos por el código.

⚠️ **`replaceChildren()` vacía el contenedor sin `innerHTML = ""`.** Es más rápido, no reinterpreta HTML y no destruye referencias de forma innecesaria.

### 7.9.10 `main.js`: el cableado

```js
// 📄 main.js
import { api } from "./api.js";
import { crearStore, estadoInicial, reducir } from "./estado.js";
import { crearVista } from "./vista.js";

const raiz = document.querySelector("#app");

const store = crearStore(reducir, estadoInicial);

const vista = crearVista(raiz, {
  alFiltrar: (texto) => store.despachar({ tipo: "filtro/cambiar", texto }),
  alOrdenar: (orden) => store.despachar({ tipo: "orden/cambiar", orden }),
  alAgregar: (id) => store.despachar({ tipo: "carrito/agregar", id }),
  alQuitar: (id) => store.despachar({ tipo: "carrito/quitar", id }),
  alVaciar: () => store.despachar({ tipo: "carrito/vaciar" }),
  alReintentar: () => cargar(),
});

store.suscribir((estado) => vista.render(estado));

let controller = null;

async function cargar() {
  controller?.abort();
  controller = new AbortController();

  store.despachar({ tipo: "cargar/inicio" });

  try {
    const productos = await api.productos(controller.signal);
    store.despachar({ tipo: "cargar/exito", productos });
  } catch (error) {
    if (error.name === "AbortError") return;
    store.despachar({ tipo: "cargar/error", error });
  }
}

cargar();
```

`main.js` hace exactamente cuatro cosas:

1. Crea el store con el reducer y el estado inicial.
2. Crea la vista y le pasa **acciones**: funciones que despachan. La vista no conoce el store.
3. Se suscribe: cada cambio de estado repinta.
4. Carga los datos iniciales.

**La carga con cancelación:**

- `controller?.abort()` cancela una carga anterior si el usuario pulsa “Reintentar” dos veces.
- Se crea un `AbortController` nuevo por carga.
- Si el error es `AbortError`, se ignora: no es un fallo, es una cancelación.
- Cualquier otro error se despacha como `cargar/error` y la vista decide cómo mostrarlo.

⚠️ **No llames a `vista.render` directamente después de `despachar`.** El suscriptor ya lo hace. Hacerlo dos veces pinta dos veces y, en apps grandes, causa parpadeos y pérdida de foco.

### 7.9.11 `index.html`

```html
<!-- 📄 index.html -->
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Tienda</title>
    <style>
      body { font-family: system-ui, sans-serif; max-width: 60rem; margin: 2rem auto; padding: 0 1rem; }
      .barra { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 1rem; }
      #productos { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr)); }
      .producto { border: 1px solid #ccc; border-radius: .5rem; padding: 1rem; }
      .producto h3 { margin: 0 0 .5rem; }
      aside { margin-top: 2rem; border-top: 1px solid #ccc; padding-top: 1rem; }
      #carrito { list-style: none; padding: 0; }
      #carrito li { display: flex; gap: .5rem; align-items: center; margin-bottom: .5rem; }
    </style>
  </head>
  <body>
    <h1>Tienda</h1>
    <main id="app"></main>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

El HTML es mínimo: un `<main id="app">` y un módulo. Todo lo demás lo construye la vista.

- `lang="es"` ayuda a lectores de pantalla y al corrector.
- `type="module"` es obligatorio para `import` (7.1.7).
- Los estilos están inline para que el ejemplo sea autocontenido; en un proyecto real irían a un `.css`.

### 7.9.12 Cómo ejecutarlo

Necesitas **dos terminales**.

Terminal 1 — la API de pruebas (el `servidor.mjs` de 7.4.5):

```bash
node servidor.mjs
```

Debe imprimir `Servidor en http://localhost:3000`.

Terminal 2 — los archivos estáticos:

```bash
cd tienda
python3 -m http.server 8080
```

Abre `http://localhost:8080/index.html`.

⚠️ **No abras `index.html` con `file://`.** Los módulos se bloquean por CORS. Necesitas HTTP, aunque sea local.

⚠️ **Los puertos deben coincidir.** `CONFIG.baseUrl` apunta a `http://localhost:3000/api/`. Si cambias el puerto del servidor, cambia la configuración.

El servidor de pruebas ya envía `Access-Control-Allow-Origin: *`, así que el navegador acepta las peticiones desde `localhost:8080`. En producción, ese `*` se sustituye por el dominio real (7.4.9).

### 7.9.13 Probar la capa pura

La recompensa de la arquitectura: **puedes probar las reglas sin navegador y sin red**.

```js
// 📄 pruebas.mjs
import { estadoInicial, reducir } from "./estado.js";
import { cantidadTotal, productosVisibles, totalCarrito } from "./dominio.js";

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

const productos = [
  { id: 1, nombre: "Camisa", precio: 20, stock: 2 },
  { id: 2, nombre: "Pantalón", precio: 35, stock: 0 },
  { id: 3, nombre: "Gorra", precio: 12.5, stock: 5 },
];

let estado = { ...estadoInicial, productos };

estado = reducir(estado, { tipo: "carrito/agregar", id: 1 });
estado = reducir(estado, { tipo: "carrito/agregar", id: 1 });
estado = reducir(estado, { tipo: "carrito/agregar", id: 1 });

assert(estado.carrito[0].cantidad === 2, "respeta el stock");
assert(totalCarrito(estado) === 40, "total del carrito");
assert(cantidadTotal(estado) === 2, "cantidad total");

const antes = estado;
estado = reducir(estado, { tipo: "filtro/cambiar", texto: "go" });

assert(estado !== antes, "devuelve un estado nuevo");
assert(antes.filtro === "", "no muta el estado anterior");
assert(
  productosVisibles(estado).map((p) => p.id).join(",") === "3",
  "filtra sin acentos"
);

estado = reducir(estado, { tipo: "carrito/quitar", id: 1 });
assert(cantidadTotal(estado) === 1, "quitar una unidad");

estado = reducir(estado, { tipo: "carrito/vaciar" });
assert(estado.carrito.length === 0, "vaciar");

console.log("Pruebas OK");
```

`pruebas.mjs` importa `estado.js` y `dominio.js`. Ninguno toca `document` ni `fetch`, así que Node los ejecuta sin problemas.

```bash
node pruebas.mjs
```

Salida:

```text
Pruebas OK
```

Qué se comprueba:

| Prueba | Regla |
|---|---|
| Tres `agregar` con stock 2 | El carrito se detiene en 2 |
| `totalCarrito` | 2 × 20 = 40 |
| `cantidadTotal` | Suma cantidades, no líneas |
| `reducir` devuelve objeto nuevo | Inmutabilidad |
| El estado anterior no cambia | Sin mutación |
| `productosVisibles` con “go” | Filtra sin acentos |
| `carrito/quitar` | Resta una unidad |
| `carrito/vaciar` | Deja el carrito vacío |

No hay framework: `assert` lanza y el proceso termina con error. Para este curso es suficiente. 📌 En el Módulo 8 verás herramientas de test reales.

**Por qué importa:** si mañana cambias el diseño del carrito, estas pruebas siguen protegiendo la lógica. Si el cálculo viviera dentro de `vista.js`, necesitarías un navegador, un DOM y una API para comprobar una suma.

### 7.9.14 Del error técnico al mensaje

| Situación | Tipo | `status` | Mensaje al usuario |
|---|---|---|---|
| Sin conexión, DNS, CORS | `ErrorDeRed` | — | “Sin conexión. Revisa tu red…” |
| Timeout | `AbortError` | — | No se muestra (se ignora o se reintenta) |
| No encontrado | `HttpError` | 404 | “No encontramos los productos.” |
| Demasiadas peticiones | `HttpError` | 429 | “Demasiadas peticiones. Espera…” |
| Fallo del servidor | `HttpError` | 500+ | “El servidor no responde…” |
| Validación | `HttpError` | 422 | Se muestra el mensaje del cuerpo |
| JSON inválido | `SyntaxError` | 200 | “Algo salió mal.” |
| Cualquier otro | `Error` | — | “Algo salió mal.” |

Dos principios:

1. **El usuario no ve códigos.** Ve qué pasó y qué puede hacer.
2. **El registro técnico sí los ve.** `HttpError` conserva `status` y `cuerpo` para el `console.error` o el servicio de errores (7.3.13).

### 7.9.15 Checklist de estados de interfaz

Antes de dar una pantalla por terminada, comprueba:

- [ ] **Cargando:** hay un mensaje visible, no una pantalla en blanco.
- [ ] **Éxito con datos:** se pinta la lista.
- [ ] **Éxito vacío:** “Todavía no hay productos.”
- [ ] **Filtro sin resultados:** “No hay productos que coincidan.” (distinto del anterior)
- [ ] **Error de red:** mensaje claro y botón de reintentar.
- [ ] **Error del servidor:** mensaje distinto del de red.
- [ ] **Reintento:** vuelve a cargar y limpia el error.
- [ ] **Doble clic en reintentar:** no lanza dos peticiones a la vez.
- [ ] **Carrito vacío:** el botón “Vaciar” está deshabilitado.
- [ ] **Sin stock:** el botón está deshabilitado y lo dice.
- [ ] **Límite de stock:** no se puede añadir más de lo disponible.
- [ ] **Teclado:** todo se puede usar sin ratón.
- [ ] **Lector de pantalla:** los cambios de estado se anuncian.

Esta lista es la diferencia entre “funciona en mi máquina” y “funciona”.

### 7.9.16 Errores de arquitectura frecuentes

**1. La vista hace `fetch`.**

```js
// ❌ La vista conoce la red
async function render() {
  const productos = await fetch("/api/productos").then((r) => r.json());
  // ...
}
```

Si la vista hace `fetch`, no puedes cambiar el transporte, no puedes cachear y no puedes testear el render con datos fijos.

**2. Guardar datos derivados.**

```js
// ❌ El total se guarda y se desincroniza
estado.total = 40;

// ✅ Se calcula
const total = totalCarrito(estado);
```

**3. El reducer tiene efectos.**

```js
// ❌ El reducer no es puro
function reducir(estado, accion) {
  if (accion.tipo === "carrito/agregar") {
    localStorage.setItem("carrito", JSON.stringify(estado.carrito));
  }
  // ...
}
```

Persistir es un efecto: va en un suscriptor o en `main`, no en el reducer.

**4. Duplicar el estado en la vista.**

```js
// ❌ Dos fuentes de verdad
let carritoLocal = [];
store.suscribir((estado) => {
  carritoLocal = estado.carrito;
});
```

La vista lee `estado.carrito` en cada render. No guarda copia.

**5. Importar la vista desde el dominio.**

```js
// ❌ dominio.js
import { mostrarError } from "./vista.js";
```

El dominio lanza o devuelve; no sabe que existe una pantalla.

**6. Usar strings como errores.**

```js
// ❌ Se pierde el status y el tipo
throw "No se pudo cargar";
```

**7. No cancelar peticiones obsoletas.**

Si el usuario escribe “ca” y luego “cam”, la respuesta de “ca” puede llegar después y sobrescribir la de “cam”. Solución: `AbortController` (7.5.4).

**8. Repintar todo y perder el foco.**

Si `render` reescribe el `<input>` en cada tecla, el cursor salta al final. La guarda `document.activeElement !== filtro` lo evita. En apps grandes se usan actualizaciones por partes o librerías reactivas.

**9. Un archivo “utils” gigante.**

`utils.js` con 40 funciones sin relación es una capa mentirosa. Si no sabes nombrar el archivo, probablemente son dos.

### 7.9.17 Ejercicio guiado: “solo disponibles”

**Enunciado:** añade una casilla “Solo con stock” que, al marcarse, oculte los productos con `stock === 0`. Debe combinarse con el filtro de texto y con el orden, y sobrevivir a los repintados.

**Paso 1 — estado.** Añade el campo y la acción.

```js
// 📄 estado.js (fragmento)
export const estadoInicial = Object.freeze({
  productos: [],
  filtro: "",
  orden: "nombre",
  soloDisponibles: false,
  carrito: [],
  fase: "idle",
  error: null,
});

function aplicar(estado, accion) {
  switch (accion.tipo) {
    case "disponibles/cambiar":
      return { ...estado, soloDisponibles: accion.activo };
    default:
      return estado;
  }
}
```

**Paso 2 — dominio.** Filtra después del texto y antes de ordenar.

```js
// 📄 dominio.js (fragmento)
export function productosVisibles(estado) {
  const porTexto = filtrarPorTexto(estado.productos, estado.filtro);
  const disponibles = estado.soloDisponibles
    ? porTexto.filter((p) => p.stock > 0)
    : porTexto;

  return ordenarProductos(disponibles, estado.orden);
}
```

**Paso 3 — vista.** Añade la casilla a la plantilla y escúchala.

```html
<!-- dentro de la plantilla de crearVista -->
<label>
  <input id="disponibles" type="checkbox" />
  Solo con stock
</label>
```

```js
// 📄 vista.js (fragmento)
const disponibles = raiz.querySelector("#disponibles");

disponibles.addEventListener(
  "change",
  (evento) => acciones.alCambiarDisponibles(evento.target.checked),
  { signal }
);

// dentro de render:
disponibles.checked = estado.soloDisponibles;
```

**Paso 4 — main.** Conecta la acción.

```js
// 📄 main.js (fragmento)
const vista = crearVista(raiz, {
  // ...
  alCambiarDisponibles: (activo) =>
    store.despachar({ tipo: "disponibles/cambiar", activo }),
});
```

**Por qué funciona:**

- El estado guarda **una** verdad (`soloDisponibles`).
- El dominio compone los tres criterios en un solo lugar.
- La vista solo refleja el valor; no decide qué está disponible.
- Al repintar, `disponibles.checked = estado.soloDisponibles` mantiene la casilla sincronizada.
- La prueba se puede añadir a `pruebas.mjs` sin DOM:

```js
// 📄 pruebas.mjs (fragmento)
estado = { ...estado, soloDisponibles: true };
assert(
  productosVisibles(estado).every((p) => p.stock > 0),
  "solo disponibles"
);
```

**Y el caso límite:** si todos los productos tienen stock 0 y la casilla está marcada, `productosVisibles` devuelve `[]`. La vista debe mostrar “No hay productos que coincidan.”, no “Todavía no hay productos.”, porque sí hay datos: el filtro es lo que no deja verlos. Ese matiz es exactamente el tipo de detalle que separa una demo de una aplicación.

### ✅ Haz esto / ❌ Evita esto (7.9)

```js
// ✅ Una sola dirección de dependencias
// main → vista → dominio
// main → estado → dominio
// main → api → http → config

// ✅ El dominio no importa nada
export function totalCarrito(estado) { /* ... */ }

// ✅ Errores tipados con status
throw new HttpError(respuesta.status, mensaje, cuerpo);

// ✅ Estados explícitos
const FASES = ["idle", "loading", "success", "empty", "error"];

// ✅ Datos derivados calculados
const total = totalCarrito(estado);

// ✅ Cancelar lo obsoleto
controller?.abort();
controller = new AbortController();

// ✅ Suscripción con baja
const dejarDeEscuchar = store.suscribir(render);
// ...
dejarDeEscuchar();
```

```js
// ❌ fetch dentro de la vista
async function render() { await fetch("/api/productos"); }

// ❌ Reglas de negocio en el HTML
`<p>${(precio * 1.21).toFixed(2)} €</p>`;

// ❌ Estado duplicado
let carrito = [];
let total = 0;

// ❌ Reducer con efectos
localStorage.setItem("carrito", JSON.stringify(estado.carrito));

// ❌ Errores como strings
throw "Error";

// ❌ Importar vista desde dominio o api
import { mostrarError } from "./vista.js";

// ❌ Un solo archivo de 800 líneas
// app.js

// ❌ innerHTML con datos del servidor
app.innerHTML = `<h3>${producto.nombre}</h3>`;
```

> 🧠 **Regla final de 7.9:** cada archivo debe poder explicarse en una frase y no debe saber más de lo que necesita. Si la vista sabe HTTP, si el dominio toca el DOM o si el estado se guarda dos veces, la arquitectura ya está rota aunque la app “funcione”.

---

## 7.10 — Retos con solución explicada

Once retos. Cada uno usa lo aprendido en este módulo y **nada que no se haya explicado antes**. Los retos 4, 5, 6, 7, 10 y 11 necesitan el servidor de pruebas; el resto funciona sin red.

**Cómo trabajarlos:**

1. Lee el enunciado y escribe tu versión **antes** de mirar la solución.
2. Ejecuta tu archivo. Si falla, lee el error completo: nombre, mensaje y línea.
3. Compara con la solución solo después. La diferencia entre tu intento y la solución es la lección.
4. Cambia algo y vuelve a ejecutar. Un reto que solo se lee no se aprende.

### Preparación

Crea una carpeta `retos/` y guarda allí este servidor. Es la versión ampliada del de 7.4.5: añade pedidos, búsqueda con retardo, un endpoint inestable para probar reintentos y una subida de archivos.

```js
// 📄 servidor.mjs
// Servidor de pruebas para los retos del Módulo 7.
// No necesitas entender su implementación: usa `node:http`, que verás en el Módulo 8.
import { createServer } from "node:http";

let productos = [
  { id: 1, nombre: "Camisa", precio: 20, stock: 5 },
  { id: 2, nombre: "Pantalón", precio: 35, stock: 3 },
  { id: 3, nombre: "Gorra", precio: 12.5, stock: 8 },
];

let siguienteId = 4;

let pedidos = [
  {
    id: 1001,
    cliente: "Ana Ruiz",
    fecha: "2026-11-10T09:15:00Z",
    estado: "pagado",
    lineas: [
      { producto: "Camisa", cantidad: 2, precio: 20 },
      { producto: "Gorra", cantidad: 1, precio: 12.5 },
    ],
  },
  {
    id: 1002,
    cliente: "Luis Pérez",
    fecha: "2026-11-12T14:40:00Z",
    estado: "enviado",
    lineas: [{ producto: "Pantalón", cantidad: 1, precio: 35 }],
  },
  {
    id: 1003,
    cliente: "Marta Díaz",
    fecha: "2026-11-14T08:05:00Z",
    estado: "pendiente",
    lineas: [
      { producto: "Camisa", cantidad: 1, precio: 20 },
      { producto: "Pantalón", cantidad: 2, precio: 35 },
    ],
  },
  {
    id: 1004,
    cliente: "Ángel Soto",
    fecha: "2026-11-15T19:30:00Z",
    estado: "cancelado",
    lineas: [{ producto: "Gorra", cantidad: 3, precio: 12.5 }],
  },
  {
    id: 1005,
    cliente: "Sofía Molina",
    fecha: "2026-11-16T11:00:00Z",
    estado: "pagado",
    lineas: [{ producto: "Pantalón", cantidad: 1, precio: 35 }],
  },
  {
    id: 1006,
    cliente: "Diego Ramos",
    fecha: "2026-11-16T17:45:00Z",
    estado: "pendiente",
    lineas: [
      { producto: "Camisa", cantidad: 3, precio: 20 },
      { producto: "Gorra", cantidad: 2, precio: 12.5 },
    ],
  },
  {
    id: 1007,
    cliente: "Elena Vidal",
    fecha: "2026-11-17T07:20:00Z",
    estado: "enviado",
    lineas: [{ producto: "Gorra", cantidad: 1, precio: 12.5 }],
  },
];

let inestable = 0;

function json(res, status, datos) {
  const cuerpo = JSON.stringify(datos);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
  });
  res.end(cuerpo);
}

function leerTexto(req) {
  return new Promise((resolve, reject) => {
    let datos = "";
    req.on("data", (trozo) => {
      datos += trozo;
    });
    req.on("end", () => resolve(datos));
    req.on("error", reject);
  });
}

function leerBytes(req) {
  return new Promise((resolve, reject) => {
    const trozos = [];
    let total = 0;

    req.on("data", (trozo) => {
      total += trozo.length;
      if (total <= 1_000_000) trozos.push(trozo);
    });

    req.on("end", () => resolve({ bytes: total, excedido: total > 1_000_000 }));
    req.on("error", reject);
  });
}

const servidor = createServer(async (req, res) => {
  const url = new URL(req.url, "http://localhost:3000");
  const ruta = url.pathname;
  const metodo = req.method;

  if (metodo === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    });
    res.end();
    return;
  }

  if (ruta === "/api/productos" && metodo === "GET") {
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const filtrados = q
      ? productos.filter((p) => p.nombre.toLowerCase().includes(q))
      : productos;

    json(res, 200, filtrados);
    return;
  }

  if (ruta === "/api/productos" && metodo === "POST") {
    const texto = await leerTexto(req);
    let datos;

    try {
      datos = JSON.parse(texto);
    } catch {
      json(res, 400, { error: "JSON inválido" });
      return;
    }

    if (typeof datos.nombre !== "string" || typeof datos.precio !== "number") {
      json(res, 422, { error: "Datos inválidos" });
      return;
    }

    const nuevo = {
      id: siguienteId,
      nombre: datos.nombre,
      precio: datos.precio,
      stock: datos.stock ?? 0,
    };

    siguienteId += 1;
    productos.push(nuevo);
    json(res, 201, nuevo);
    return;
  }

  const coincidencia = ruta.match(/^\/api\/productos\/(\d+)$/);

  if (coincidencia) {
    const id = Number(coincidencia[1]);
    const indice = productos.findIndex((p) => p.id === id);

    if (indice === -1) {
      json(res, 404, { error: "Producto no encontrado" });
      return;
    }

    if (metodo === "GET") {
      json(res, 200, productos[indice]);
      return;
    }

    if (metodo === "PATCH") {
      const texto = await leerTexto(req);
      let cambios;

      try {
        cambios = JSON.parse(texto);
      } catch {
        json(res, 400, { error: "JSON inválido" });
        return;
      }

      productos[indice] = { ...productos[indice], ...cambios, id };
      json(res, 200, productos[indice]);
      return;
    }

    if (metodo === "DELETE") {
      productos.splice(indice, 1);
      res.writeHead(204, { "Access-Control-Allow-Origin": "*" });
      res.end();
      return;
    }
  }

  if (ruta === "/api/pedidos" && metodo === "GET") {
    const estado = url.searchParams.get("estado");
    const lista = estado ? pedidos.filter((p) => p.estado === estado) : pedidos;
    json(res, 200, lista);
    return;
  }

  if (ruta === "/api/buscar" && metodo === "GET") {
    const q = (url.searchParams.get("q") ?? "").toLowerCase();
    const ms = Number(url.searchParams.get("ms") ?? 300);
    const resultados = productos.filter((p) =>
      p.nombre.toLowerCase().includes(q)
    );

    setTimeout(() => json(res, 200, { q, ms, resultados }), ms);
    return;
  }

  if (ruta === "/api/inestable" && metodo === "GET") {
    if (url.searchParams.get("reset") === "1") {
      inestable = 0;
      json(res, 200, { reiniciado: true });
      return;
    }

    inestable += 1;

    if (inestable <= 2) {
      json(res, 503, { error: "Servicio temporalmente no disponible" });
      return;
    }

    json(res, 200, { intento: inestable, mensaje: "Ahora sí" });
    return;
  }

  if (ruta === "/api/subir" && metodo === "POST") {
    const { bytes, excedido } = await leerBytes(req);
    const ms = Number(url.searchParams.get("ms") ?? 0);

    const responder = () => {
      if (excedido) {
        json(res, 413, { error: "El archivo supera 1 MB" });
        return;
      }

      json(res, 201, {
        bytes,
        tipo: req.headers["content-type"] ?? "desconocido",
      });
    };

    if (ms > 0) setTimeout(responder, ms);
    else responder();

    return;
  }

  if (ruta === "/api/eco" && metodo === "POST") {
    const texto = await leerTexto(req);
    let datos;

    try {
      datos = texto ? JSON.parse(texto) : null;
    } catch {
      json(res, 400, { error: "JSON inválido" });
      return;
    }

    json(res, 200, { metodo, recibido: datos });
    return;
  }

  if (ruta === "/api/lento") {
    const ms = Number(url.searchParams.get("ms") ?? 1000);
    setTimeout(() => json(res, 200, { esperado: ms }), ms);
    return;
  }

  if (ruta.startsWith("/api/error/")) {
    const status = Number(ruta.split("/").pop());
    json(res, status, { error: `Error simulado ${status}` });
    return;
  }

  json(res, 404, { error: "Ruta no encontrada" });
});

servidor.listen(3000, () => {
  console.log("Servidor en http://localhost:3000");
});
```

Arráncalo en una terminal:

```bash
node servidor.mjs
```

Debe imprimir `Servidor en http://localhost:3000`. Déjalo abierto mientras resuelves los retos con red.

| Reto | Tema | Necesita servidor |
|---|---|---|
| 1 | Dividir un monolito en módulos | No |
| 2 | Utilidades funcionales | No |
| 3 | Jerarquía de errores y `Result` | No |
| 4 | Cliente HTTP con timeout y reintentos | Sí |
| 5 | Búsqueda con debounce y cancelación | Sí |
| 6 | CRUD completo | Sí |
| 7 | Subida con `FormData` | Sí |
| 8 | JSON versionado, migración y validación | No |
| 9 | Validadores y extractores con regex | No |
| 10 | Panel de pedidos con `Intl` | Sí |
| 11 | Capstone: informe de pedidos | Sí |

---

### Reto 1 — Dividir un monolito en módulos

**Objetivo:** separar cálculo, operaciones de carrito, formato y composición en archivos con una sola responsabilidad.

**Enunciado:** este archivo funciona, pero mezcla cuatro responsabilidades. Divídelo en `precios.mjs`, `carrito.mjs`, `formato.mjs` y `app.mjs`. El resultado impreso debe ser **idéntico**. `precios.mjs` no puede imprimir; `formato.mjs` no puede calcular; `app.mjs` no puede contener reglas.

```js
// 📄 monolito.mjs
// Todo el cálculo, el formato y la impresión en un solo archivo.

const lineas = [
  { nombre: "Camisa", precio: 20, cantidad: 2 },
  { nombre: "Pantalón", precio: 35, cantidad: 1 },
  { nombre: "Gorra", precio: 12.5, cantidad: 3 },
];

const IVA = 0.21;
const ENVIO = 4.95;
const ENVIO_GRATIS = 50;
const DESCUENTO = 0.1;
const DESCUENTO_MINIMO = 100;

let subtotal = 0;

for (const linea of lineas) {
  subtotal += linea.precio * linea.cantidad;
}

subtotal = Math.round(subtotal * 100) / 100;

const iva = Math.round(subtotal * IVA * 100) / 100;
const conIva = Math.round((subtotal + iva) * 100) / 100;

const descuento =
  conIva >= DESCUENTO_MINIMO
    ? Math.round(conIva * DESCUENTO * 100) / 100
    : 0;

const base = Math.round((conIva - descuento) * 100) / 100;
const envio = base >= ENVIO_GRATIS ? 0 : ENVIO;
const total = Math.round((base + envio) * 100) / 100;

const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

console.log("TICKET");
console.log("------");

for (const linea of lineas) {
  const importe = linea.precio * linea.cantidad;
  console.log(`${linea.nombre} x${linea.cantidad}: ${euro.format(importe)}`);
}

console.log("------");
console.log(`Subtotal: ${euro.format(subtotal)}`);
console.log(`IVA (21 %): ${euro.format(iva)}`);
console.log(`Descuento: -${euro.format(descuento)}`);
console.log(`Envío: ${euro.format(envio)}`);
console.log(`TOTAL: ${euro.format(total)}`);
```

**Pistas:**

- Los importes se redondean a céntimos en cada paso monetario.
- `carrito.mjs` debe ser puro: recibir líneas y devolver líneas nuevas.
- `formato.mjs` solo debe formatear.
- `app.mjs` crea los datos, llama y muestra.

**Solución.**

```js
// 📄 precios.mjs
// Reglas de dinero. No sabe imprimir ni de dónde vienen las líneas.

const IVA = 0.21;
const ENVIO = 4.95;
const ENVIO_GRATIS = 50;
const DESCUENTO = 0.1;
const DESCUENTO_MINIMO = 100;

export function redondear(valor) {
  return Math.round(valor * 100) / 100;
}

export function subtotal(lineas) {
  return redondear(
    lineas.reduce((suma, linea) => suma + linea.precio * linea.cantidad, 0)
  );
}

export function calcularTotales(lineas) {
  const base = subtotal(lineas);
  const iva = redondear(base * IVA);
  const conIva = redondear(base + iva);
  const descuento =
    conIva >= DESCUENTO_MINIMO ? redondear(conIva * DESCUENTO) : 0;
  const antesDeEnvio = redondear(conIva - descuento);
  const envio = antesDeEnvio >= ENVIO_GRATIS ? 0 : ENVIO;
  const total = redondear(antesDeEnvio + envio);

  return { base, iva, descuento, envio, total };
}
```

```js
// 📄 carrito.mjs
// Operaciones puras sobre líneas: { nombre, precio, cantidad }.

export function agregar(lineas, producto, cantidad = 1) {
  const existente = lineas.find((linea) => linea.nombre === producto.nombre);

  if (!existente) {
    return [...lineas, { ...producto, cantidad }];
  }

  return lineas.map((linea) =>
    linea.nombre === producto.nombre
      ? { ...linea, cantidad: linea.cantidad + cantidad }
      : linea
  );
}

export function quitar(lineas, nombre, cantidad = 1) {
  return lineas
    .map((linea) =>
      linea.nombre === nombre
        ? { ...linea, cantidad: linea.cantidad - cantidad }
        : linea
    )
    .filter((linea) => linea.cantidad > 0);
}

export function unidades(lineas) {
  return lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
}
```

```js
// 📄 formato.mjs
// Solo presentación: convierte números y líneas en texto.

const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatearEuros(valor) {
  return euro.format(valor);
}

export function formatearLinea(linea) {
  const importe = linea.precio * linea.cantidad;
  return `${linea.nombre} x${linea.cantidad}: ${euro.format(importe)}`;
}

export function formatearTicket(lineas, totales) {
  const filas = lineas.map(formatearLinea);

  return [
    "TICKET",
    "------",
    ...filas,
    "------",
    `Subtotal: ${euro.format(totales.base)}`,
    `IVA (21 %): ${euro.format(totales.iva)}`,
    `Descuento: -${euro.format(totales.descuento)}`,
    `Envío: ${euro.format(totales.envio)}`,
    `TOTAL: ${euro.format(totales.total)}`,
  ].join("\n");
}
```

```js
// 📄 app.mjs
// Composición: datos de entrada, llamadas y salida por consola.
import { calcularTotales } from "./precios.mjs";
import { agregar, unidades } from "./carrito.mjs";
import { formatearTicket } from "./formato.mjs";

let lineas = [];

lineas = agregar(lineas, { nombre: "Camisa", precio: 20 }, 2);
lineas = agregar(lineas, { nombre: "Pantalón", precio: 35 }, 1);
lineas = agregar(lineas, { nombre: "Gorra", precio: 12.5 }, 3);

const totales = calcularTotales(lineas);

console.log(formatearTicket(lineas, totales));
console.log(`Unidades: ${unidades(lineas)}`);
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `const IVA = 0.21` | Tipos y umbrales en constantes | Un número mágico repetido es un bug esperando |
| `redondear(valor)` | `Math.round(valor * 100) / 100` | El dinero se maneja en céntimos; redondear al final de cada paso evita arrastrar fracciones |
| `subtotal(lineas)` | Multiplica precio por cantidad y suma | Es una función pura: no lee ni escribe fuera |
| `calcularTotales` | Encadena base, IVA, descuento, envío y total | Cada paso tiene nombre; se puede probar por separado |
| `conIva >= DESCUENTO_MINIMO` | Aplica el descuento sobre el total con IVA | La regla está en un solo sitio y documentada por el nombre |
| `antesDeEnvio >= ENVIO_GRATIS` | Envío gratis a partir de 50 € | El umbral se compara con la base, no con el subtotal |
| `return { base, iva, ... }` | Devuelve un objeto con todos los importes | La vista no recalcula nada |
| `agregar(lineas, producto, cantidad)` | Busca, copia y suma | No muta el array original: `[...lineas]` y `map` |
| `quitar(...)` | Resta y elimina líneas con cantidad 0 | `filter` después de `map` deja el carrito limpio |
| `unidades(lineas)` | Suma cantidades | Es distinto del número de líneas |
| `new Intl.NumberFormat` | Se crea una vez, fuera de las funciones | Crear un formateador por línea es caro (7.8.14) |
| `formatearTicket` | Junta filas con `join("\n")` | Formato y cálculo quedan separados |
| `app.mjs` | Crea líneas con `agregar` y llama a las capas | Es el único archivo que conoce a todos |
| `console.log` | Solo en `app.mjs` | Las capas inferiores no imprimen |

**Salida esperada:**

```text
TICKET
------
Camisa x2: 40,00 €
Pantalón x1: 35,00 €
Gorra x3: 37,50 €
------
Subtotal: 112,50 €
IVA (21 %): 23,63 €
Descuento: -13,61 €
Envío: 0,00 €
TOTAL: 122,52 €
Unidades: 6
```

**Comprobación:** ejecuta `node monolito.mjs` y `node app.mjs`; deben imprimir exactamente lo mismo (salvo la última línea `Unidades`).

**Qué aprendiste:** dividir no es copiar y pegar en archivos. Es decidir qué sabe cada archivo y qué no.

---

### Reto 2 — Utilidades funcionales desde cero

**Objetivo:** implementar `pipe`, `compose`, `curry`, `memoize`, `actualizarEn` y `agruparPor` sin librerías, y probarlas.

**Enunciado:** crea `reto02.mjs` con esas seis funciones y una batería de `assert`. `memoize` debe exponer su caché en `.cache`. `agruparPor` debe devolver un `Map`, no un objeto. `actualizarEn` no puede mutar el array original.

```js
// 📄 reto02.mjs
// Utilidades funcionales implementadas desde cero y probadas.

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

// 1. pipe: de izquierda a derecha
export function pipe(...fns) {
  return (valor) => fns.reduce((actual, fn) => fn(actual), valor);
}

// 2. compose: de derecha a izquierda
export function compose(...fns) {
  return pipe(...fns.toReversed());
}

// 3. curry: permite llamadas parciales
export function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...resto) => curried(...args, ...resto);
  };
}

// 4. memoize: cachea por argumentos
export function memoize(fn, clave = (...args) => JSON.stringify(args)) {
  const cache = new Map();

  const memo = (...args) => {
    const k = clave(...args);
    if (!cache.has(k)) cache.set(k, fn(...args));
    return cache.get(k);
  };

  memo.cache = cache;
  return memo;
}

// 5. actualizarEn: actualización inmutable por índice
export function actualizarEn(array, indice, cambios) {
  if (indice < 0 || indice >= array.length) return array;

  return array.map((elemento, i) =>
    i === indice ? { ...elemento, ...cambios } : elemento
  );
}

// 6. agruparPor: devuelve un Map
export function agruparPor(array, obtenerClave) {
  const grupos = new Map();

  for (const elemento of array) {
    const clave = obtenerClave(elemento);
    const grupo = grupos.get(clave) ?? [];
    grupos.set(clave, [...grupo, elemento]);
  }

  return grupos;
}

// --- Pruebas ---

const doblar = (n) => n * 2;
const sumarUno = (n) => n + 1;

assert(pipe(sumarUno, doblar)(3) === 8, "pipe va de izquierda a derecha");
assert(compose(sumarUno, doblar)(3) === 7, "compose va de derecha a izquierda");

const sumar = curry((a, b) => a + b);
assert(sumar(2)(3) === 5, "curry con dos llamadas");
assert(sumar(2, 3) === 5, "curry con una llamada");
assert(sumar(2)(3) === sumar(2, 3), "curry es equivalente");

const sumarTres = curry((a, b, c) => a + b + c);
assert(sumarTres(1)(2)(3) === 6, "curry de tres argumentos");
assert(sumarTres(1, 2)(3) === 6, "curry mixto");

let llamadas = 0;
const lento = memoize((n) => {
  llamadas += 1;
  return n * n;
});

assert(lento(4) === 16, "memoize devuelve el valor");
assert(lento(4) === 16, "memoize reutiliza");
assert(llamadas === 1, "solo se ejecutó una vez");
assert(lento.cache.size === 1, "la caché tiene una entrada");
lento(5);
assert(llamadas === 2, "otro argumento ejecuta otra vez");

const productos = [
  { id: 1, nombre: "Camisa", precio: 20 },
  { id: 2, nombre: "Pantalón", precio: 35 },
  { id: 3, nombre: "Gorra", precio: 12.5 },
];

const caros = actualizarEn(productos, 1, { precio: 40 });
assert(caros[1].precio === 40, "actualiza el elemento");
assert(productos[1].precio === 35, "no muta el original");
assert(caros !== productos, "devuelve un array nuevo");
assert(actualizarEn(productos, 99, { precio: 0 }) === productos, "índice fuera de rango");

const grupos = agruparPor(productos, (p) => (p.precio >= 20 ? "caro" : "barato"));
assert(grupos instanceof Map, "agruparPor devuelve un Map");
assert(grupos.get("caro").length === 2, "grupo caro");
assert(grupos.get("barato").length === 1, "grupo barato");

const numeros = [1, 2, 3, 4];
const sumarTodos = (lista) => lista.reduce((a, b) => a + b, 0);
const soloPares = (lista) => lista.filter((n) => n % 2 === 0);

assert(pipe(soloPares, sumarTodos)(numeros) === 6, "composición con arrays");

console.log("Reto 2 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `assert` | Lanza si la condición es falsa | Sin framework, es suficiente para el curso |
| `pipe(...fns)` | Devuelve una función que aplica las `fns` de izquierda a derecha | `reduce` acumula el valor; se lee en el orden en que ocurre |
| `compose(...fns)` | Invierte y reutiliza `pipe` | No duplica la lógica; `toReversed` no muta |
| `curry(fn)` | Si faltan argumentos, devuelve otra función | `fn.length` cuenta los parámetros declarados |
| `args.length >= fn.length` | ¿Ya hay suficientes? | Permite `sumar(2)(3)` y `sumar(2, 3)` |
| `memoize(fn, clave)` | Guarda resultados en un `Map` | La clave por defecto usa `JSON.stringify` |
| `if (!cache.has(k))` | Solo ejecuta si no está | `cache.get` no distingue “no existe” de `undefined` |
| `memo.cache = cache` | Expone la caché | Permite inspeccionar y limpiar en pruebas |
| `actualizarEn(array, indice, cambios)` | Copia el array y reemplaza un elemento | `map` + spread; el original queda intacto |
| `if (indice < 0 ...) return array` | Índice fuera de rango | Devuelve el mismo array en vez de romper |
| `agruparPor(array, fn)` | Crea un `Map` de clave → array | Evita colisiones con `__proto__` de un objeto |
| `grupos.get(clave) ?? []` | Grupo existente o vacío | `??` solo cae con `null`/`undefined` |
| `[...grupo, elemento]` | Añade sin mutar | Cada grupo es un array nuevo |
| Las pruebas | Verifican orden, currying, caché, inmutabilidad | Una utilidad sin tests es una promesa |

**Salida esperada:**

```text
Reto 2 OK
```

**Detalles que suelen fallar:**

- `pipe()` sin funciones debe devolver el valor tal cual. Con `reduce` y valor inicial, funciona.
- `compose` con `toReversed()` no muta el array de funciones.
- `curry` con parámetros por defecto (`fn.length` no los cuenta) se comporta distinto. No lo necesitas aquí.
- `memoize` con objetos como argumentos depende del orden de claves de `JSON.stringify`. Para producción, usa una clave explícita.
- La caché de `memoize` crece sin límite. En un servidor de larga vida, añade un límite o usa un `WeakMap` cuando la clave sea un objeto.

**Ampliación:** añade `once(fn)`, que solo permite una ejecución, y pruébala.

---

### Reto 3 — Jerarquía de errores y patrón `Result`

**Objetivo:** modelar errores de negocio con clases y usarlos tanto con `throw` como con valores de resultado.

**Enunciado:** crea `ErrorDeAplicacion`, `ErrorDeValidacion`, `ErrorNoEncontrado` y `ErrorDeConflicto`. Implementa `ok`, `err`, `map`, `flatMap`, `unwrapOr` e `intentar`. Valida productos y detecta duplicados sin lanzar en el camino feliz.

```js
// 📄 reto03.mjs
// Jerarquía de errores + patrón Result, con pruebas.

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

// --- Jerarquía ---

export class ErrorDeAplicacion extends Error {
  constructor(mensaje, opciones) {
    super(mensaje, opciones);
    this.name = new.target.name;
  }
}

export class ErrorDeValidacion extends ErrorDeAplicacion {
  constructor(detalles) {
    super(`Datos inválidos: ${detalles.join(", ")}`);
    this.detalles = detalles;
  }
}

export class ErrorNoEncontrado extends ErrorDeAplicacion {
  constructor(recurso, id) {
    super(`${recurso} con id ${id} no encontrado`);
    this.recurso = recurso;
    this.id = id;
  }
}

export class ErrorDeConflicto extends ErrorDeAplicacion {
  constructor(mensaje) {
    super(mensaje);
    this.codigo = "CONFLICTO";
  }
}

// --- Result ---

export const ok = (valor) => ({ ok: true, valor });
export const err = (error) => ({ ok: false, error });

export function map(resultado, fn) {
  return resultado.ok ? ok(fn(resultado.valor)) : resultado;
}

export function flatMap(resultado, fn) {
  return resultado.ok ? fn(resultado.valor) : resultado;
}

export function unwrapOr(resultado, valorPorDefecto) {
  return resultado.ok ? resultado.valor : valorPorDefecto;
}

export function intentar(fn) {
  try {
    return ok(fn());
  } catch (error) {
    return err(error);
  }
}

// --- Dominio ---

export function validarProducto(datos) {
  const detalles = [];

  if (typeof datos.nombre !== "string" || datos.nombre.trim() === "") {
    detalles.push("nombre obligatorio");
  } else if (datos.nombre.length > 40) {
    detalles.push("nombre demasiado largo");
  }

  if (typeof datos.precio !== "number" || !Number.isFinite(datos.precio)) {
    detalles.push("precio debe ser un número");
  } else if (datos.precio <= 0) {
    detalles.push("precio debe ser mayor que 0");
  }

  if (!Number.isInteger(datos.stock) || datos.stock < 0) {
    detalles.push("stock debe ser un entero no negativo");
  }

  if (detalles.length > 0) return err(new ErrorDeValidacion(detalles));

  return ok({ ...datos, nombre: datos.nombre.trim() });
}

export function crearProducto(datos, existentes) {
  const validado = validarProducto(datos);

  if (!validado.ok) return validado;

  const repetido = existentes.some(
    (p) => p.nombre.toLowerCase() === validado.valor.nombre.toLowerCase()
  );

  if (repetido) {
    return err(
      new ErrorDeConflicto(`Ya existe un producto llamado ${validado.valor.nombre}`)
    );
  }

  return ok({ id: existentes.length + 1, ...validado.valor });
}

export function buscarProducto(productos, id) {
  const producto = productos.find((p) => p.id === id);
  return producto ? ok(producto) : err(new ErrorNoEncontrado("Producto", id));
}

// --- Pruebas ---

const valido = validarProducto({ nombre: "  Camisa  ", precio: 20, stock: 5 });
assert(valido.ok, "producto válido");
assert(valido.valor.nombre === "Camisa", "recorta espacios");

const invalido = validarProducto({ nombre: "", precio: -1, stock: 1.5 });
assert(!invalido.ok, "producto inválido");
assert(invalido.error instanceof ErrorDeValidacion, "tipo de error");
assert(invalido.error instanceof ErrorDeAplicacion, "hereda de la base");
assert(invalido.error.detalles.length === 3, "tres detalles");
assert(invalido.error.name === "ErrorDeValidacion", "nombre del error");

const productos = [{ id: 1, nombre: "Camisa", precio: 20, stock: 5 }];

const nuevo = crearProducto({ nombre: "Gorra", precio: 12.5, stock: 3 }, productos);
assert(nuevo.ok && nuevo.valor.id === 2, "crea el producto");

const repetido = crearProducto({ nombre: "camisa", precio: 10, stock: 1 }, productos);
assert(!repetido.ok, "detecta duplicado");
assert(repetido.error instanceof ErrorDeConflicto, "error de conflicto");
assert(repetido.error.codigo === "CONFLICTO", "código de conflicto");

const encontrado = buscarProducto(productos, 1);
assert(encontrado.ok && encontrado.valor.nombre === "Camisa", "encuentra");

const perdido = buscarProducto(productos, 99);
assert(!perdido.ok && perdido.error instanceof ErrorNoEncontrado, "no encuentra");

const doble = map(ok(2), (n) => n * 2);
assert(doble.ok && doble.valor === 4, "map sobre ok");

const conError = map(err(new Error("x")), (n) => n * 2);
assert(!conError.ok, "map no toca el error");

const encadenado = flatMap(ok(2), (n) => ok(n + 1));
assert(encadenado.valor === 3, "flatMap");

assert(unwrapOr(ok(5), 0) === 5, "unwrapOr con valor");
assert(unwrapOr(err(new Error("x")), 0) === 0, "unwrapOr con error");

const capturado = intentar(() => {
  throw new ErrorDeConflicto("No se puede borrar");
});
assert(!capturado.ok && capturado.error.codigo === "CONFLICTO", "intentar captura");

const causa = new ErrorDeAplicacion("No se pudo guardar", {
  cause: new Error("ECONNRESET"),
});
assert(causa.cause.message === "ECONNRESET", "cause se conserva");

console.log("Reto 3 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `extends Error` | Hereda mensaje, stack y `cause` | No reinventes el error nativo |
| `new.target.name` | Asigna el nombre de la subclase | `error.name` sale correcto sin repetirlo en cada clase |
| `ErrorDeValidacion(detalles)` | Guarda la lista de fallos | Un mensaje agregado no basta para pintar campos |
| `ErrorNoEncontrado(recurso, id)` | Guarda qué falta y con qué id | Permite construir un 404 preciso |
| `ErrorDeConflicto` + `codigo` | Marca un conflicto de negocio | El código es estable; el mensaje puede cambiar |
| `ok(valor)` / `err(error)` | Crean el resultado | Son objetos planos, fáciles de serializar y testear |
| `map(resultado, fn)` | Transforma solo el éxito | Si hay error, lo devuelve intacto |
| `flatMap` | Encadena operaciones que ya devuelven `Result` | Evita `Result<Result<T>>` |
| `unwrapOr` | Saca el valor o un defecto | Útil en la interfaz, nunca para ocultar errores |
| `intentar(fn)` | Convierte `throw` en `err` | Frontera entre código que lanza y código que devuelve |
| `validarProducto` | Acumula **todos** los errores | El usuario prefiere ver tres fallos a la vez |
| `detalles.length > 0` | Devuelve `err` | No lanza: el llamador decide |
| `crearProducto` | Valida y comprueba duplicados | Combina dos reglas con `Result` |
| `buscarProducto` | Devuelve `ok` o `err` | Un “no encontrado” no es una excepción |
| Pruebas de `instanceof` | Comprueban la jerarquía | `ErrorDeValidacion` **es** `ErrorDeAplicacion` |
| `causa.cause` | Conserva el error original | Depuración sin perder información (7.3.7) |

**Salida esperada:**

```text
Reto 3 OK
```

**`Result` o `throw`:** usa `Result` para lo que el llamador **espera** que pueda fallar (validación, búsqueda, reglas de negocio). Usa `throw` para lo **inesperado** (un bug, una invariante rota, un fallo de infraestructura). No mezcles ambos en la misma función sin un motivo.

**Ampliación:** añade `mapError(resultado, fn)` y `unwrap(resultado)` que lanza el error.

---

### Reto 4 — Cliente HTTP con timeout y reintentos

**Objetivo:** construir un cliente que distinga error de red, error HTTP, timeout y cancelación, y que reintente solo lo que tiene sentido.

**Enunciado:** implementa `pedir(ruta, opciones)` con `timeout`, `reintentos`, `espera` exponencial y un hook `alReintentar`. Debe reintentar fallos de red, timeouts y respuestas `5xx`; **no** debe reintentar un `404`, un `4xx` ni una cancelación del usuario. Pruébalo contra `/api/inestable`, `/api/error/503`, `/api/error/404`, `/api/lento` y una cancelación manual.

```js
// 📄 reto04.mjs
// Cliente HTTP con timeout, reintentos y espera exponencial.

const BASE = "http://localhost:3000/api/";

export class ErrorHttp extends Error {
  constructor(status, cuerpo) {
    super(cuerpo?.error ?? `HTTP ${status}`);
    this.name = "ErrorHttp";
    this.status = status;
    this.cuerpo = cuerpo;
  }
}

export class ErrorRed extends Error {
  constructor(mensaje, opciones) {
    super(mensaje, opciones);
    this.name = "ErrorRed";
  }
}

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function intentar(ruta, { timeout, signal }) {
  const senal = signal
    ? AbortSignal.any([signal, AbortSignal.timeout(timeout)])
    : AbortSignal.timeout(timeout);

  let respuesta;

  try {
    respuesta = await fetch(new URL(ruta, BASE), { signal: senal });
  } catch (error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") throw error;

    throw new ErrorRed(`No se pudo conectar con ${ruta}`, { cause: error });
  }

  const texto = await respuesta.text();
  let cuerpo = null;

  if (texto) {
    try {
      cuerpo = JSON.parse(texto);
    } catch {
      cuerpo = texto;
    }
  }

  if (!respuesta.ok) throw new ErrorHttp(respuesta.status, cuerpo);

  return cuerpo;
}

export async function pedir(ruta, opciones = {}) {
  const {
    timeout = 1500,
    reintentos = 2,
    espera = 300,
    signal,
    alReintentar = () => {},
  } = opciones;

  let ultimoError;

  for (let numero = 0; numero <= reintentos; numero += 1) {
    try {
      return await intentar(ruta, { timeout, signal });
    } catch (error) {
      ultimoError = error;

      if (error.name === "AbortError") throw error;

      const reintentable =
        error instanceof ErrorRed ||
        error.name === "TimeoutError" ||
        (error instanceof ErrorHttp && error.status >= 500);

      if (!reintentable || numero === reintentos) throw error;

      const pausa = espera * 2 ** numero;
      alReintentar({ intento: numero + 1, error, pausa });
      await dormir(pausa);
    }
  }

  throw ultimoError;
}

// --- Pruebas ---

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

const reinicio = await pedir("inestable?reset=1");
assert(reinicio.reiniciado === true, "reinicia el contador");

const intentos = [];
const resultado = await pedir("inestable", {
  reintentos: 3,
  espera: 20,
  alReintentar: ({ intento, error }) => intentos.push(`${intento}:${error.status}`),
});

assert(resultado.intento === 3, "triunfa al tercer intento");
assert(intentos.join(",") === "1:503,2:503", "reintenta dos veces");

let agoto = 0;

try {
  await pedir("error/503", {
    reintentos: 2,
    espera: 10,
    alReintentar: () => {
      agoto += 1;
    },
  });
  assert(false, "debería fallar");
} catch (error) {
  assert(error instanceof ErrorHttp, "error HTTP");
  assert(error.status === 503, "status 503");
  assert(agoto === 2, "reintentó exactamente dos veces");
}

try {
  await pedir("error/404", { reintentos: 3, espera: 10 });
  assert(false, "debería fallar");
} catch (error) {
  assert(error.status === 404, "404 no se reintenta");
}

const inicio = Date.now();

try {
  await pedir("lento?ms=3000", { timeout: 150, reintentos: 1, espera: 10 });
  assert(false, "debería expirar");
} catch (error) {
  assert(error.name === "TimeoutError", "timeout");
  assert(Date.now() - inicio < 1500, "no espera los 3 segundos");
}

const control = new AbortController();
setTimeout(() => control.abort(), 50);

try {
  await pedir("lento?ms=3000", {
    timeout: 5000,
    reintentos: 5,
    signal: control.signal,
    alReintentar: () => assert(false, "no debe reintentar una cancelación"),
  });
  assert(false, "debería cancelarse");
} catch (error) {
  assert(error.name === "AbortError", "cancelación del usuario");
}

const productos = await pedir("productos", { timeout: 1000 });
assert(Array.isArray(productos) && productos.length >= 3, "GET normal");

console.log("Reto 4 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `ErrorHttp(status, cuerpo)` | Guarda el código y el cuerpo | La vista decide según `status` |
| `ErrorRed(mensaje, { cause })` | Envuelve fallos de conexión | Distinto de un error del servidor |
| `dormir(ms)` | Promesa con `setTimeout` | Base de la espera entre reintentos |
| `AbortSignal.any([...])` | Combina cancelación externa y timeout | Se cancela por lo primero que ocurra |
| `fetch(new URL(ruta, BASE))` | Resuelve la ruta | Nada de concatenar barras |
| `catch` de `fetch` | Solo atrapa red/timeout/cancelación | Un `500` no lanza aquí |
| `error.name === "AbortError"` | Cancelación del usuario | No se reintenta |
| `respuesta.text()` + `JSON.parse` | Lee cuerpo una vez | `json()` fallaría con respuestas vacías |
| `if (!respuesta.ok) throw ErrorHttp` | Convierte 4xx/5xx en error tipado | `fetch` no lo hace |
| Bucle `for numero <= reintentos` | Intenta `reintentos + 1` veces | “2 reintentos” = 3 intentos |
| `reintentable` | Red, timeout o `5xx` | Un 404 no mejora reintentando |
| `espera * 2 ** numero` | 300, 600, 1200 ms… | Evita martillear un servidor caído |
| `alReintentar` | Notifica el reintento | Permite registrar y medir |
| `throw error` al agotar | Devuelve el último error | No lo convierte en `undefined` |

**Salida esperada:**

```text
Reto 4 OK
```

**Por qué `TimeoutError` sí y `AbortError` no:** un timeout es una condición del entorno que puede mejorar; una cancelación es una decisión del usuario que no debe deshacerse. Si reintentas una cancelación, gastas red y puedes pintar datos que el usuario ya no quiere.

**Cuidado con el tiempo total:** `reintentos: 5` con timeout de 2 s y espera exponencial puede tardar más de un minuto. En una interfaz, limita la suma total o usa un presupuesto global.

**Ampliación:** añade `jitter` (una variación aleatoria de la espera) para evitar que mil clientes reintenten a la vez.

---

### Reto 5 — Búsqueda con debounce y cancelación

**Objetivo:** evitar peticiones por cada tecla y garantizar que una respuesta vieja no sobrescriba a una nueva.

**Enunciado:** implementa `crearBuscador({ consultar, alResultado, alError, espera })`. Debe esperar `espera` ms desde la última llamada, cancelar la petición anterior y descartar respuestas de turnos viejos. Inyecta `consultar` para poder probarlo sin red y pruébalo también contra `/api/buscar`.

```js
// 📄 reto05.mjs
// Búsqueda con debounce, cancelación y protección contra respuestas viejas.

const BASE = "http://localhost:3000/api/";

export function crearBuscador({
  consultar,
  alResultado,
  alError = () => {},
  espera = 200,
}) {
  let temporizador = null;
  let controller = null;
  let turno = 0;

  function cancelar() {
    clearTimeout(temporizador);
    temporizador = null;
    controller?.abort();
    controller = null;
  }

  function buscar(texto) {
    cancelar();

    const miTurno = ++turno;

    temporizador = setTimeout(async () => {
      controller = new AbortController();

      try {
        const datos = await consultar(texto, controller.signal);
        if (miTurno === turno) alResultado(texto, datos);
      } catch (error) {
        if (error.name === "AbortError") return;
        if (miTurno === turno) alError(error);
      }
    }, espera);
  }

  return { buscar, cancelar };
}

export async function consultarProductos(texto, signal) {
  const url = new URL("buscar", BASE);
  url.searchParams.set("q", texto);
  url.searchParams.set("ms", "30");

  const respuesta = await fetch(url, { signal });

  if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

  const datos = await respuesta.json();
  return datos.resultados;
}

// --- Pruebas ---

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 1. Debounce: varias llamadas seguidas producen una sola consulta
let consultas = 0;

const resultados = [];
const errores = [];

const buscador = crearBuscador({
  espera: 40,
  consultar: async (texto) => {
    consultas += 1;
    return [texto];
  },
  alResultado: (texto, datos) => resultados.push([texto, datos]),
  alError: (error) => errores.push(error),
});

buscador.buscar("c");
buscador.buscar("ca");
buscador.buscar("cam");
await dormir(100);

assert(consultas === 1, "solo una consulta por ráfaga");
assert(resultados.length === 1 && resultados[0][0] === "cam", "gana la última");

// 2. Cancelación: una respuesta lenta no pisa a la nueva
const abortos = [];
const recibidos = [];

const lento = crearBuscador({
  espera: 20,
  consultar: (texto, signal) =>
    new Promise((resolve, reject) => {
      const t = setTimeout(
        () => resolve([texto]),
        texto === "ca" ? 300 : 20
      );

      signal.addEventListener("abort", () => {
        abortos.push(texto);
        clearTimeout(t);
        reject(new DOMException("Cancelado", "AbortError"));
      });
    }),
  alResultado: (texto) => recibidos.push(texto),
});

lento.buscar("ca");
await dormir(60);
lento.buscar("cam");
await dormir(400);

assert(abortos.includes("ca"), "se aborta la consulta vieja");
assert(recibidos.join(",") === "cam", "solo llega la consulta nueva");

// 3. cancelar() evita cualquier resultado pendiente
const pendientes = [];

const cancelable = crearBuscador({
  espera: 20,
  consultar: async (texto) => [texto],
  alResultado: (texto) => pendientes.push(texto),
});

cancelable.buscar("gorra");
cancelable.cancelar();
await dormir(100);

assert(pendientes.length === 0, "cancelar detiene el debounce");

// 4. Los errores reales llegan a alError
const capturados = [];

const fallido = crearBuscador({
  espera: 10,
  consultar: async () => {
    throw new Error("Servidor caído");
  },
  alResultado: () => assert(false, "no debería haber resultado"),
  alError: (error) => capturados.push(error.message),
});

fallido.buscar("x");
await dormir(60);

assert(capturados.join(",") === "Servidor caído", "propaga el error");

// 5. Integración con la API real
let encontrados = null;

const real = crearBuscador({
  espera: 10,
  consultar: consultarProductos,
  alResultado: (texto, datos) => {
    encontrados = datos;
  },
});

real.buscar("go");
await dormir(300);

assert(Array.isArray(encontrados), "la API responde");
assert(encontrados.some((p) => p.nombre === "Gorra"), "encuentra Gorra");

console.log("Reto 5 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `crearBuscador({...})` | Fábrica con dependencias inyectadas | `consultar` se puede sustituir en pruebas |
| `temporizador` | Guarda el `setTimeout` pendiente | `clearTimeout` cancela el debounce |
| `controller` | Guarda el `AbortController` en vuelo | Permite abortar la petición anterior |
| `turno` | Número creciente por búsqueda | Identifica la búsqueda “vigente” |
| `cancelar()` | Limpia timer y aborta | Una sola función para ambos recursos |
| `const miTurno = ++turno` | Captura el turno actual | Cada cierre recuerda su número |
| `setTimeout(async () => {...})` | Ejecuta tras la pausa | Si llega otra tecla, se cancela |
| `controller = new AbortController()` | Nueva señal por petición | No se reutiliza una señal abortada |
| `await consultar(texto, signal)` | Pasa la señal a la capa de red | La cancelación viaja hasta `fetch` |
| `if (miTurno === turno)` | Solo el turno vigente publica | Protección contra respuestas desordenadas |
| `error.name === "AbortError"` | Ignora cancelaciones | No son errores para el usuario |
| `consultarProductos` | Implementación real con `fetch` | `URLSearchParams` codifica la consulta |
| `buscador.buscar("c")...` | Ráfaga de llamadas | Solo debe ejecutarse la última |
| `lento.buscar("ca")` + espera + `"cam"` | Simula respuesta lenta | Verifica que “ca” se aborta |
| `cancelable.cancelar()` | Cancela antes de que dispare | No debe llegar ningún resultado |

**Salida esperada:**

```text
Reto 5 OK
```

**El bug que evita:** sin `miTurno`, la respuesta de “ca” (300 ms) llegaría después de la de “cam” (20 ms) y pintaría resultados viejos. Sin `AbortController`, la petición vieja seguiría consumiendo red y el servidor seguiría trabajando.

**En una interfaz real:** llama a `buscar` en el evento `input`, no en `keyup` (no cubre pegar con el ratón). Muestra un indicador de carga y desactívalo cuando llegue el turno vigente.

**Ampliación:** añade un `flush()` que ejecute inmediatamente la búsqueda pendiente (útil al pulsar Enter).

---

### Reto 6 — CRUD completo

**Objetivo:** crear, leer, actualizar y borrar recursos con validación previa, errores tipados y limpieza.

**Enunciado:** implementa `crud.listar`, `crud.obtener`, `crud.crear`, `crud.actualizar` y `crud.borrar`. Valida antes de enviar: nombre obligatorio, precio positivo, stock entero no negativo, sin duplicados. Al terminar las pruebas, el servidor debe quedar con los tres productos iniciales.

```js
// 📄 reto06.mjs
// CRUD completo con validación, errores tipados y limpieza.

const BASE = "http://localhost:3000/api/";

export class ErrorHttp extends Error {
  constructor(status, cuerpo) {
    super(cuerpo?.error ?? `HTTP ${status}`);
    this.name = "ErrorHttp";
    this.status = status;
    this.cuerpo = cuerpo;
  }
}

export class ErrorDeValidacion extends Error {
  constructor(detalles) {
    super(`Datos inválidos: ${detalles.join(", ")}`);
    this.name = "ErrorDeValidacion";
    this.detalles = detalles;
  }
}

export class ErrorDeConflicto extends Error {
  constructor(mensaje) {
    super(mensaje);
    this.name = "ErrorDeConflicto";
  }
}

async function pedir(ruta, opciones = {}) {
  const respuesta = await fetch(new URL(ruta, BASE), {
    ...opciones,
    headers: { Accept: "application/json", ...opciones.headers },
    signal: AbortSignal.timeout(3000),
  });

  if (respuesta.status === 204) return null;

  const texto = await respuesta.text();
  const cuerpo = texto ? JSON.parse(texto) : null;

  if (!respuesta.ok) throw new ErrorHttp(respuesta.status, cuerpo);

  return cuerpo;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

export function validarProducto(datos, existentes = []) {
  const detalles = [];

  if (typeof datos.nombre !== "string" || datos.nombre.trim() === "") {
    detalles.push("nombre obligatorio");
  }

  if (typeof datos.precio !== "number" || !Number.isFinite(datos.precio)) {
    detalles.push("precio numérico");
  } else if (datos.precio <= 0) {
    detalles.push("precio mayor que 0");
  }

  if (!Number.isInteger(datos.stock) || datos.stock < 0) {
    detalles.push("stock entero no negativo");
  }

  if (detalles.length > 0) throw new ErrorDeValidacion(detalles);

  const nombre = datos.nombre.trim();
  const repetido = existentes.some(
    (p) => p.nombre.toLowerCase() === nombre.toLowerCase()
  );

  if (repetido) throw new ErrorDeConflicto(`Ya existe ${nombre}`);

  return { ...datos, nombre };
}

export const crud = {
  listar: () => pedir("productos"),

  obtener: (id) => pedir(`productos/${id}`),

  crear: async (datos) => {
    const existentes = await pedir("productos");
    const limpio = validarProducto(datos, existentes);

    return pedir("productos", {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(limpio),
    });
  },

  actualizar: async (id, cambios) => {
    if (cambios.precio !== undefined) {
      if (typeof cambios.precio !== "number" || cambios.precio <= 0) {
        throw new ErrorDeValidacion(["precio mayor que 0"]);
      }
    }

    return pedir(`productos/${id}`, {
      method: "PATCH",
      headers: JSON_HEADERS,
      body: JSON.stringify(cambios),
    });
  },

  borrar: (id) => pedir(`productos/${id}`, { method: "DELETE" }),
};

// --- Pruebas ---

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const inicial = await crud.listar();
assert(inicial.length === 3, "tres productos al inicio");

const nuevo = await crud.crear({ nombre: "  Bufanda  ", precio: 9.5, stock: 2 });
assert(nuevo.id === 4, "id asignado por el servidor");
assert(nuevo.nombre === "Bufanda", "nombre recortado");

const leido = await crud.obtener(nuevo.id);
assert(leido.nombre === "Bufanda", "GET por id");

const cambiado = await crud.actualizar(nuevo.id, { precio: 11, stock: 4 });
assert(cambiado.precio === 11, "PATCH actualiza el precio");
assert(cambiado.nombre === "Bufanda", "PATCH conserva el resto");

const borrado = await crud.borrar(nuevo.id);
assert(borrado === null, "DELETE devuelve null");

try {
  await crud.obtener(nuevo.id);
  assert(false, "debería ser 404");
} catch (error) {
  assert(error instanceof ErrorHttp && error.status === 404, "404 tras borrar");
}

try {
  await crud.crear({ nombre: "", precio: -1, stock: 1.5 });
  assert(false, "debería validar");
} catch (error) {
  assert(error instanceof ErrorDeValidacion, "error de validación");
  assert(error.detalles.length === 3, "tres detalles");
}

try {
  await crud.crear({ nombre: "camisa", precio: 10, stock: 1 });
  assert(false, "debería detectar duplicado");
} catch (error) {
  assert(error instanceof ErrorDeConflicto, "conflicto de nombre");
}

try {
  await crud.actualizar(1, { precio: 0 });
  assert(false, "debería validar el precio");
} catch (error) {
  assert(error instanceof ErrorDeValidacion, "precio inválido");
}

const final = await crud.listar();
assert(final.length === 3, "el servidor queda limpio");

console.log("Productos finales:");
for (const p of final) {
  console.log(`- ${p.nombre}: ${euro.format(p.precio)} (${p.stock} uds.)`);
}

console.log("Reto 6 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `pedir` | Cliente mínimo con timeout | Cada reto es independiente |
| `respuesta.status === 204` | Devuelve `null` | `DELETE` no trae cuerpo |
| `respuesta.text()` + `JSON.parse` | Lee una sola vez | Evita `json()` sobre un cuerpo vacío |
| `if (!respuesta.ok)` | Lanza `ErrorHttp` | El llamador recibe tipo y status |
| `JSON_HEADERS` | `Content-Type: application/json` | Sin él, el servidor no sabe parsear |
| `validarProducto(datos, existentes)` | Acumula errores y comprueba duplicado | La validación ocurre **antes** de la red |
| `datos.nombre.trim()` | Normaliza espacios | Evita “ Camisa” y “Camisa” como distintos |
| `Number.isFinite` | Rechaza `NaN` e `Infinity` | `typeof NaN === "number"` |
| `Number.isInteger(stock)` | Rechaza 1.5 | El stock es discreto |
| `throw new ErrorDeValidacion` | Falla rápido | No se envía una petición inválida |
| `crud.crear` | Lista, valida y hace POST | El servidor no valida duplicados; el cliente sí |
| `crud.actualizar` | Valida el precio si viene | PATCH parcial: solo se valida lo enviado |
| `crud.borrar` | DELETE y `null` | 204 |
| Pruebas | Crean, leen, actualizan y borran | El ciclo completo |
| `final.length === 3` | Comprueba la limpieza | Un test que ensucia el entorno no es repetible |
| Tabla final | Formatea con `Intl` | La salida también se cuida |

**Salida esperada:**

```text
Productos finales:
- Camisa: 20,00 € (5 uds.)
- Pantalón: 35,00 € (3 uds.)
- Gorra: 12,50 € (8 uds.)
Reto 6 OK
```

**Detalles importantes:**

- **El `id` lo pone el servidor.** Si lo envías tú, el servidor lo ignora (`...cambios, id`).
- **PATCH no es PUT.** PATCH cambia solo los campos enviados; PUT reemplaza el recurso completo.
- **Borrar dos veces:** la segunda da `404`. Decide si eso es un error o un éxito idempotente; aquí es un error y se prueba.
- **Condiciones de carrera:** entre el `GET` de duplicados y el `POST` puede crearse otro igual. En producción, el servidor debe imponer la unicidad.

**Ampliación:** añade paginación (`?pagina=1&limite=10`) y un `crud.buscar(texto)`.

---

### Reto 7 — Subida de archivos con `FormData`

**Objetivo:** enviar un archivo binario sin romper el `Content-Type`, controlar el tamaño y manejar `413` y timeouts.

**Enunciado:** implementa `subirArchivo(blob, nombre, { timeout, ms })`. Debe usar `FormData`, añadir una descripción, no fijar `Content-Type` a mano y devolver `{ bytes, tipo }`. Prueba un archivo pequeño, uno de 100 KB, uno de 1,1 MB (debe dar `413`) y un timeout.

```js
// 📄 reto07.mjs
// Subida de archivos con FormData, timeout y manejo de 413.

const BASE = "http://localhost:3000/api/";

export class ErrorHttp extends Error {
  constructor(status, cuerpo) {
    super(cuerpo?.error ?? `HTTP ${status}`);
    this.name = "ErrorHttp";
    this.status = status;
    this.cuerpo = cuerpo;
  }
}

export class ErrorRed extends Error {
  constructor(mensaje, opciones) {
    super(mensaje, opciones);
    this.name = "ErrorRed";
  }
}

export async function subirArchivo(blob, nombre, opciones = {}) {
  const { timeout = 3000, ms = 0 } = opciones;

  const datos = new FormData();
  datos.append("archivo", blob, nombre);
  datos.append("descripcion", "Archivo de prueba");

  const url = new URL("subir", BASE);
  if (ms > 0) url.searchParams.set("ms", String(ms));

  let respuesta;

  try {
    respuesta = await fetch(url, {
      method: "POST",
      body: datos,
      signal: AbortSignal.timeout(timeout),
    });
  } catch (error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") throw error;
    throw new ErrorRed("No se pudo subir el archivo", { cause: error });
  }

  let cuerpo = null;

  try {
    cuerpo = await respuesta.json();
  } catch {
    cuerpo = null;
  }

  if (!respuesta.ok) throw new ErrorHttp(respuesta.status, cuerpo);

  return cuerpo;
}

// --- Pruebas ---

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

const texto = new Blob(["hola mundo"], { type: "text/plain" });
const pequeno = await subirArchivo(texto, "nota.txt");

assert(pequeno.bytes > texto.size, "el multipart añade cabeceras");
assert(
  pequeno.tipo.startsWith("multipart/form-data"),
  "Content-Type con boundary"
);
assert(pequeno.tipo.includes("boundary="), "el boundary viaja en la cabecera");

const mediano = new Blob([new Uint8Array(100_000)], {
  type: "application/octet-stream",
});
const subida = await subirArchivo(mediano, "datos.bin");
assert(subida.bytes > 100_000, "sube 100 KB");

const grande = new Blob([new Uint8Array(1_100_000)], {
  type: "application/octet-stream",
});

try {
  await subirArchivo(grande, "grande.bin");
  assert(false, "debería rechazar por tamaño");
} catch (error) {
  assert(error instanceof ErrorHttp, "error HTTP");
  assert(error.status === 413, "status 413");
}

try {
  await subirArchivo(texto, "lento.txt", { ms: 800, timeout: 150 });
  assert(false, "debería expirar");
} catch (error) {
  assert(error.name === "TimeoutError", "timeout de subida");
}

console.log("Reto 7 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `new FormData()` | Construye el cuerpo multipart | Es la forma estándar de subir archivos |
| `datos.append("archivo", blob, nombre)` | Añade el archivo con nombre | El tercer argumento fija el `filename` |
| `datos.append("descripcion", ...)` | Añade un campo de texto | Los campos y archivos viajan juntos |
| `fetch(url, { body: datos })` | Envía el multipart | **No** pongas `Content-Type` manualmente |
| `AbortSignal.timeout(timeout)` | Corta la subida | Sin límite, una subida colgada bloquea la UI |
| `catch` + `AbortError`/`TimeoutError` | Distingue cancelación de fallo | No se envuelven como error de red |
| `ErrorRed` con `cause` | Fallo de conexión | Conserva el detalle original |
| `await respuesta.json()` en `try` | El error también puede ser JSON | Si no lo es, `cuerpo` queda `null` |
| `if (!respuesta.ok)` | Lanza `ErrorHttp` | Incluye `413` |
| `pequeno.bytes > texto.size` | El multipart añade cabeceras | El tamaño enviado no es el del archivo |
| `tipo.startsWith("multipart/form-data")` | Verifica la cabecera | El navegador/Node añade el `boundary` |
| `new Blob([new Uint8Array(100_000)])` | Genera 100 KB | No necesitas un archivo real |
| `new Blob([new Uint8Array(1_100_000)])` | Supera el límite del servidor | Prueba el `413` |
| `{ ms: 800, timeout: 150 }` | Servidor lento + timeout corto | Prueba la cancelación |

**Salida esperada:**

```text
Reto 7 OK
```

**Por qué no fijar `Content-Type`:** el cuerpo multipart necesita un `boundary` único que separa las partes. Si escribes `"multipart/form-data"` a mano, el servidor no puede parsearlo. Al pasar un `FormData`, `fetch` genera la cabecera completa.

**Sobre el progreso:** `fetch` **no** expone el progreso de subida. Si lo necesitas, usa `XMLHttpRequest` (`xhr.upload.onprogress`) o una librería. 📌 Es una vista previa; no hace falta para este curso.

**En el navegador:** un `<input type="file">` te da un `File`, que es un `Blob` con nombre. Puedes pasarlo directamente:

```js
// 📄 navegador.js
const input = document.querySelector("#archivo");
const archivo = input.files[0];
await subirArchivo(archivo, archivo.name);
```

**Ampliación:** valida el tipo MIME y el tamaño **antes** de enviar, y muestra un mensaje distinto para cada caso.

---

### Reto 8 — JSON versionado: migrar, validar y proteger

**Objetivo:** guardar y recuperar estado sin perder datos, sin romper versiones antiguas y sin abrir agujeros de seguridad.

**Enunciado:** implementa `serializar`, `deserializar`, `migrar` y `validarLineas`. El formato actual es la versión 3. Debes aceptar la versión 1 (`{ items: [{ id, qty }] }`), la 2 (`{ version: 2, lineas: [{ productoId, cantidad }] }`) y la 3. Cualquier JSON corrupto, versión desconocida o línea inválida debe devolver un `Result` con error, nunca lanzar.

```js
// 📄 reto08.mjs
// JSON versionado: serializar, migrar, validar y proteger.

const CATALOGO = new Map([
  [1, { nombre: "Camisa", precio: 20 }],
  [2, { nombre: "Pantalón", precio: 35 }],
  [3, { nombre: "Gorra", precio: 12.5 }],
]);

const ok = (valor) => ({ ok: true, valor });
const err = (error) => ({ ok: false, error });

// --- Validación ---

export function validarLineas(lineas) {
  if (!Array.isArray(lineas)) return ["lineas debe ser un array"];

  const errores = [];

  lineas.forEach((linea, i) => {
    if (!Number.isInteger(linea.productoId) || linea.productoId <= 0) {
      errores.push(`linea ${i}: productoId inválido`);
    }

    if (!Number.isInteger(linea.cantidad) || linea.cantidad <= 0) {
      errores.push(`linea ${i}: cantidad inválida`);
    }

    if (typeof linea.precioUnitario !== "number" || linea.precioUnitario < 0) {
      errores.push(`linea ${i}: precio inválido`);
    }
  });

  return errores;
}

// --- Migración ---

export function migrar(datos) {
  if (datos === null || typeof datos !== "object") {
    return err(new Error("El guardado no es un objeto"));
  }

  if (datos.version === 3) return ok(datos);

  if (datos.version === 2) {
    const lineas = datos.lineas.map((linea) => {
      const producto = CATALOGO.get(linea.productoId);

      if (!producto) throw new Error(`Producto ${linea.productoId} desconocido`);

      return {
        productoId: linea.productoId,
        cantidad: linea.cantidad,
        precioUnitario: producto.precio,
      };
    });

    return ok({
      version: 3,
      actualizado: new Date().toISOString(),
      lineas,
    });
  }

  if (!datos.version && Array.isArray(datos.items)) {
    const lineas = datos.items.map((item) => {
      const producto = CATALOGO.get(item.id);

      if (!producto) throw new Error(`Producto ${item.id} desconocido`);

      return {
        productoId: item.id,
        cantidad: item.qty,
        precioUnitario: producto.precio,
      };
    });

    return ok({
      version: 3,
      actualizado: new Date().toISOString(),
      lineas,
    });
  }

  return err(new Error(`Versión desconocida: ${datos.version}`));
}

// --- Serialización ---

export function serializar(estado) {
  return JSON.stringify(
    {
      version: 3,
      actualizado: new Date().toISOString(),
      lineas: estado.lineas,
    },
    (clave, valor) => (valor === undefined ? null : valor)
  );
}

export function deserializar(texto) {
  let datos;

  try {
    datos = JSON.parse(texto);
  } catch (error) {
    return err(new SyntaxError("JSON corrupto", { cause: error }));
  }

  let migrado;

  try {
    migrado = migrar(datos);
  } catch (error) {
    return err(error);
  }

  if (!migrado.ok) return migrado;

  const errores = validarLineas(migrado.valor.lineas);

  if (errores.length > 0) return err(new Error(errores.join("; ")));

  return migrado;
}

// --- Utilidades de seguridad ---

export function fusionarSeguro(destino, origen) {
  const limpio = {};

  for (const [clave, valor] of Object.entries(origen)) {
    if (clave === "__proto__" || clave === "constructor" || clave === "prototype") {
      continue;
    }

    limpio[clave] = valor;
  }

  return { ...destino, ...limpio };
}

// --- Pruebas ---

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

const v1 = { items: [{ id: 1, qty: 2 }, { id: 3, qty: 1 }] };
const deV1 = deserializar(JSON.stringify(v1));

assert(deV1.ok, "migra v1");
assert(deV1.valor.version === 3, "sube a v3");
assert(deV1.valor.lineas[0].productoId === 1, "renombra id");
assert(deV1.valor.lineas[0].cantidad === 2, "renombra qty");
assert(deV1.valor.lineas[0].precioUnitario === 20, "añade precio");

const v2 = { version: 2, lineas: [{ productoId: 2, cantidad: 3 }] };
const deV2 = deserializar(JSON.stringify(v2));
assert(deV2.ok && deV2.valor.version === 3, "migra v2");

const v3 = {
  version: 3,
  actualizado: "2026-11-17T10:00:00.000Z",
  lineas: [{ productoId: 1, cantidad: 1, precioUnitario: 20 }],
};
const deV3 = deserializar(JSON.stringify(v3));
assert(deV3.ok, "acepta v3");

const corrupto = deserializar("{esto no es json");
assert(!corrupto.ok && corrupto.error instanceof SyntaxError, "JSON corrupto");

const desconocida = deserializar(JSON.stringify({ version: 99 }));
assert(!desconocida.ok, "versión desconocida");

const malaCantidad = deserializar(
  JSON.stringify({ version: 3, lineas: [{ productoId: 1, cantidad: 0, precioUnitario: 20 }] })
);
assert(!malaCantidad.ok, "cantidad inválida");

const desconocido = deserializar(JSON.stringify({ items: [{ id: 99, qty: 1 }] }));
assert(!desconocido.ok, "producto desconocido en migración");

const texto = serializar({ lineas: v3.lineas });
const vuelta = deserializar(texto);
assert(vuelta.ok, "ida y vuelta");
assert(texto.includes('"version":3'), "el JSON guarda la versión");

const conUndefined = serializar({ lineas: [{ productoId: 1, cantidad: 1, precioUnitario: undefined }] });
assert(conUndefined.includes("null"), "el replacer convierte undefined en null");

const objeto = { fecha: new Date("2026-03-01T00:00:00Z"), nombre: "Camisa" };
const porJson = JSON.parse(JSON.stringify(objeto));
const porClone = structuredClone(objeto);

assert(typeof porJson.fecha === "string", "JSON convierte Date en texto");
assert(porClone.fecha instanceof Date, "structuredClone conserva Date");

let errorBigInt = null;

try {
  JSON.stringify({ id: 10n });
} catch (error) {
  errorBigInt = error;
}

assert(errorBigInt instanceof TypeError, "BigInt no se puede serializar");

const malicioso = JSON.parse('{"__proto__":{"admin":true},"nombre":"x"}');
const fusionado = fusionarSeguro({}, malicioso);

assert(fusionado.nombre === "x", "copia los campos legítimos");
assert(fusionado.admin === undefined, "no contamina el prototipo");
assert({}.admin === undefined, "Object.prototype intacto");

console.log("Reto 8 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `CATALOGO` | Precio de cada producto | La migración necesita completar datos que la v1 no tenía |
| `ok` / `err` | Resultados | Todo el reto devuelve valores, no lanza |
| `validarLineas` | Comprueba tipos y rangos | Un JSON válido no implica datos válidos |
| `Number.isInteger(...) && > 0` | Ids y cantidades | Rechaza strings, `NaN` y negativos |
| `migrar(datos)` | Detecta la versión | `version` ausente + `items` = v1 |
| `datos.version === 3` | Ya está al día | No se toca |
| `datos.version === 2` | Añade precios desde el catálogo | La v2 no guardaba el precio unitario |
| `!datos.version && Array.isArray(datos.items)` | Detecta v1 | El formato antiguo no tenía `version` |
| `throw new Error(...)` dentro de `migrar` | Producto desconocido | `deserializar` lo convierte en `err` |
| `serializar` | Añade versión y fecha | El guardado se describe a sí mismo |
| Replacer de `JSON.stringify` | `undefined` → `null` | Evita propiedades que desaparecen sin avisar |
| `deserializar` | `try/catch` de `JSON.parse` | Un texto corrupto no debe tumbar la app |
| Segundo `try/catch` | Alrededor de `migrar` | La migración puede fallar por datos |
| `validarLineas` después de migrar | Valida el resultado final | La migración puede producir datos raros |
| `fusionarSeguro` | Filtra `__proto__`, `constructor`, `prototype` | Evita contaminación de prototipos |
| `Object.entries` + `continue` | Copia solo claves seguras | No uses `Object.assign` con JSON externo |
| Pruebas v1/v2/v3 | Verifican cada camino | La compatibilidad se prueba, no se supone |
| `JSON.parse(JSON.stringify(objeto))` | Fecha → string | JSON no tiene tipo fecha |
| `structuredClone(objeto)` | Conserva `Date` | Para copias en memoria, no para persistir |
| `JSON.stringify({ id: 10n })` | Lanza `TypeError` | BigInt no es serializable; guárdalo como string |

**Salida esperada:**

```text
Reto 8 OK
```

**Reglas de oro al persistir:**

1. **Versión siempre.** Sin `version`, mañana no sabrás qué formato estás leyendo.
2. **Valida al leer, no solo al escribir.** El almacenamiento puede haber sido modificado por otra pestaña, una versión vieja o un usuario curioso.
3. **Migra en cadena.** v1 → v2 → v3 es más fácil de mantener que v1 → v3 y v2 → v3 por separado.
4. **Nunca `eval`.** `JSON.parse` no ejecuta código; `eval` sí.
5. **No guardes secretos.** `localStorage` es accesible desde cualquier script del origen.

**Ampliación:** añade una versión 4 que guarde `moneda` y `locale`, y migra desde la 3 sin perder líneas.

---

### Reto 9 — Validadores y extractores con regex

**Objetivo:** escribir expresiones regulares legibles, ancladas y probadas, y reconocer sus límites.

**Enunciado:** implementa `validarEmail`, `validarTelefono`, `validarPassword`, `extraerFechas`, `slugify`, `mascararTarjeta`, `extraerHashtags` y `contieneLiteral`. Prueba casos válidos, inválidos y límites. `extraerFechas` debe descartar fechas imposibles como `2026-02-30`.

```js
// 📄 reto09.mjs
// Validadores y extractores con expresiones regulares, con casos límite.

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const TELEFONO = /^(\+34|0034)?[ -]?[6789]\d{8}$/;
const FECHA_ISO = /\b(\d{4})-(\d{2})-(\d{2})\b/g;
const HASHTAG = /#[\p{L}\p{N}_]+/gu;
const TARJETA = /^\d{13,19}$/;

export function validarEmail(texto) {
  return typeof texto === "string" && EMAIL.test(texto);
}

export function validarTelefono(texto) {
  return typeof texto === "string" && TELEFONO.test(texto);
}

export function validarPassword(valor) {
  const errores = [];

  if (typeof valor !== "string" || valor.length < 12) {
    errores.push("Al menos 12 caracteres");
  }

  if (!/[a-z]/.test(valor)) errores.push("Una minúscula");
  if (!/[A-Z]/.test(valor)) errores.push("Una mayúscula");
  if (!/\d/.test(valor)) errores.push("Un número");
  if (!/[^\p{L}\p{N}]/u.test(valor)) errores.push("Un símbolo");
  if (/\s/.test(valor)) errores.push("Sin espacios");

  return errores;
}

export function esFechaReal(anio, mes, dia) {
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));

  return (
    fecha.getUTCFullYear() === anio &&
    fecha.getUTCMonth() === mes - 1 &&
    fecha.getUTCDate() === dia
  );
}

export function extraerFechas(texto) {
  const encontradas = [];

  for (const coincidencia of texto.matchAll(FECHA_ISO)) {
    const [completa, anio, mes, dia] = coincidencia;

    if (esFechaReal(Number(anio), Number(mes), Number(dia))) {
      encontradas.push(completa);
    }
  }

  return encontradas;
}

export function normalizar(texto) {
  return texto.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}

export function slugify(texto) {
  return normalizar(texto)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function mascararTarjeta(numero) {
  const digitos = String(numero).replace(/[\s-]/g, "");

  if (!TARJETA.test(digitos)) return null;

  const ultimos = digitos.slice(-4);
  return `**** **** **** ${ultimos}`;
}

export function extraerHashtags(texto) {
  return texto.match(HASHTAG) ?? [];
}

export function escaparRegex(texto) {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function contieneLiteral(texto, busqueda) {
  return new RegExp(escaparRegex(busqueda), "g").test(texto);
}

// --- Pruebas ---

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

const emails = [
  ["ana@ejemplo.com", true],
  ["ana@ejemplo", false],
  ["ana @ejemplo.com", false],
  ["a@b.co", true],
  ["", false],
];

for (const [entrada, esperado] of emails) {
  assert(validarEmail(entrada) === esperado, `email ${entrada}`);
}

const telefonos = [
  ["+34 612345678", true],
  ["612345678", true],
  ["0034 712345678", true],
  ["912 345 678", false],
  ["123456789", false],
];

for (const [entrada, esperado] of telefonos) {
  assert(validarTelefono(entrada) === esperado, `teléfono ${entrada}`);
}

assert(validarPassword("Corta1!").length === 1, "contraseña corta");
assert(validarPassword("ClaveSegura2026!").length === 0, "contraseña válida");
assert(validarPassword("clavesegura2026!").includes("Una mayúscula"), "sin mayúscula");
assert(validarPassword("Clave Segura2026!").includes("Sin espacios"), "con espacio");

const fechas = extraerFechas(
  "Entregado 2026-03-01, devuelto 2026-02-30 y pedido 2026-13-01. También 2025-12-31."
);
assert(fechas.join(",") === "2026-03-01,2025-12-31", "solo fechas reales");

assert(slugify("¡Hola, Mundo!") === "hola-mundo", "slug simple");
assert(slugify("  Café  con   leche ") === "cafe-con-leche", "slug con acentos");
assert(slugify("Año 2026") === "ano-2026", "slug con ñ");
assert(slugify("---") === "", "slug vacío");

assert(mascararTarjeta("4111 1111 1111 1234") === "**** **** **** 1234", "tarjeta");
assert(mascararTarjeta("4111-1111-1111-1234") === "**** **** **** 1234", "tarjeta con guiones");
assert(mascararTarjeta("1234") === null, "tarjeta inválida");

const etiquetas = extraerHashtags("Hoy #JavaScript y #año_2026, sin más");
assert(etiquetas.join(",") === "#JavaScript,#año_2026", "hashtags Unicode");

assert(contieneLiteral("El precio es 20.5 €", "20.5"), "escape de punto");
assert(!contieneLiteral("El precio es 205 €", "20.5"), "el punto no es comodín");

assert(validarEmail("ana@ejemplo.com"), "sin estado global");
assert(validarEmail("ana@ejemplo.com"), "repetible");

console.log("Reto 9 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `EMAIL` | Una `@`, un punto y 2+ caracteres finales | Validación pragmática; la RFC completa no garantiza que el buzón exista |
| `TELEFONO` | Prefijo opcional y móvil/fijo español | `[6789]` excluye números inventados |
| `FECHA_ISO` con `g` | Busca todas las fechas | `matchAll` exige `g` |
| `HASHTAG` con `u` | Letras y números Unicode | `\w` no incluye `ñ` ni `á` |
| `TARJETA` | 13 a 19 dígitos | Solo forma; el dígito de control es otro algoritmo |
| `validarEmail` | `typeof` + `test` | Rechaza números y `null` sin lanzar |
| `validarTelefono` | Igual | Evita `TypeError` con entradas no string |
| `validarPassword` | Comprueba cada regla por separado | Devuelve mensajes distintos, no un “no válido” |
| `/[^\p{L}\p{N}]/u` | Busca un símbolo | `\p{L}` y `\p{N}` cubren Unicode |
| `esFechaReal` | Compara componentes con `Date.UTC` | `2026-02-30` se desborda a marzo en V8 |
| `matchAll(FECHA_ISO)` | Itera coincidencias | No depende de `lastIndex` manual |
| `const [completa, anio, mes, dia]` | Desestructura grupos | El primer elemento es la coincidencia completa |
| `normalizar` | NFD + quita marcas + minúsculas | Búsqueda sin acentos |
| `slugify` | Todo lo no alfanumérico → `-` | Luego recorta guiones de los extremos |
| `mascararTarjeta` | Limpia espacios y guiones | Acepta formatos de entrada distintos |
| `digitos.slice(-4)` | Conserva los últimos 4 | Nunca muestres el número completo |
| `extraerHashtags` | `match` con `g` | Devuelve `null` si no hay; `?? []` lo normaliza |
| `escaparRegex` | Escapa metacaracteres | Sin esto, un `.` del usuario sería comodín |
| `contieneLiteral` | Construye el patrón escapado | `20.5` no debe coincidir con `205` |
| Pruebas repetidas | `validarEmail` dos veces | Detecta el bug de `lastIndex` si hubiera `g` |

**Salida esperada:**

```text
Reto 9 OK
```

**Lo que este reto demuestra:**

- Una regex valida **forma**; la existencia de una fecha, un DNI o una tarjeta necesita código.
- Los patrones deben estar **anclados** (`^...$`) cuando validan.
- `\w`, `\d` y `\b` son ASCII; para texto real usa `\p{...}` con `u`.
- Una regex compartida con `g` tiene estado. Si solo validas, quítale la `g`.
- Escapa siempre el texto del usuario antes de meterlo en `new RegExp`.

**Ampliación:** añade `validarIBAN` con el algoritmo módulo 97. La regex sola no basta.

---

### Reto 10 — Panel de pedidos con `Intl`

**Objetivo:** formatear moneda, fechas, relativos, plurales, listas y orden alfabético sin concatenar strings a mano.

**Enunciado:** descarga los pedidos de `/api/pedidos`, calcula totales y unidades, y muestra un panel con ingresos, ticket medio, pedidos por estado, clientes ordenados, fechas largas en `Europe/Madrid`, tiempos relativos respecto a `2026-11-17T12:00:00Z` y plurales correctos.

```js
// 📄 reto10.mjs
// Panel de pedidos formateado con Intl: moneda, fechas, relativos y plurales.

const BASE = "http://localhost:3000/api/";
const LOCALE = "es-ES";
const ZONA = "Europe/Madrid";
const AHORA = new Date("2026-11-17T12:00:00Z");

const euro = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
});

const fechaLarga = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "long",
  timeZone: ZONA,
});

const relativo = new Intl.RelativeTimeFormat(LOCALE, { numeric: "auto" });
const plural = new Intl.PluralRules(LOCALE);
const lista = new Intl.ListFormat(LOCALE, {
  style: "long",
  type: "conjunction",
});
const collator = new Intl.Collator(LOCALE);

export function totalPedido(pedido) {
  return pedido.lineas.reduce(
    (suma, linea) => suma + linea.precio * linea.cantidad,
    0
  );
}

export function unidadesPedido(pedido) {
  return pedido.lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
}

export function haceCuanto(fecha, ahora = AHORA) {
  const horas = Math.round((fecha.getTime() - ahora.getTime()) / 3_600_000);

  if (Math.abs(horas) >= 24) {
    return relativo.format(Math.round(horas / 24), "day");
  }

  return relativo.format(horas, "hour");
}

export function contarPedidos(n) {
  const forma = plural.select(n);
  return `${n} ${forma === "one" ? "pedido" : "pedidos"}`;
}

export function resumen(pedidos) {
  const validos = pedidos.filter((p) => p.estado !== "cancelado");
  const ingresos = validos.reduce((suma, p) => suma + totalPedido(p), 0);
  const unidades = validos.reduce((suma, p) => suma + unidadesPedido(p), 0);

  const porEstado = new Map();

  for (const pedido of pedidos) {
    porEstado.set(pedido.estado, (porEstado.get(pedido.estado) ?? 0) + 1);
  }

  return {
    pedidos: pedidos.length,
    validos: validos.length,
    ingresos,
    ticketMedio: validos.length > 0 ? ingresos / validos.length : 0,
    unidades,
    porEstado,
  };
}

export function filaPedido(pedido) {
  return {
    id: pedido.id,
    cliente: pedido.cliente,
    fecha: fechaLarga.format(new Date(pedido.fecha)),
    cuando: haceCuanto(new Date(pedido.fecha)),
    estado: pedido.estado,
    unidades: unidadesPedido(pedido),
    total: euro.format(totalPedido(pedido)),
  };
}

export function imprimirPanel(pedidos) {
  const datos = resumen(pedidos);

  console.log("PANEL DE PEDIDOS");
  console.log("================");
  console.log(`Pedidos: ${contarPedidos(datos.pedidos)}`);
  console.log(`Válidos: ${datos.validos}`);
  console.log(`Ingresos: ${euro.format(datos.ingresos)}`);
  console.log(`Ticket medio: ${euro.format(datos.ticketMedio)}`);
  console.log(`Unidades vendidas: ${datos.unidades}`);
  console.log("");

  console.log("Por estado:");
  for (const [estado, cantidad] of datos.porEstado) {
    console.log(`- ${estado}: ${contarPedidos(cantidad)}`);
  }

  console.log("");
  console.log("Clientes:");
  const clientes = pedidos
    .map((p) => p.cliente)
    .toSorted(collator.compare);
  console.log(lista.format(clientes));

  console.log("");
  console.log("Detalle:");

  const filas = pedidos
    .toSorted((a, b) => totalPedido(b) - totalPedido(a))
    .map(filaPedido);

  const anchos = {
    id: 6,
    cliente: 16,
    fecha: 24,
    cuando: 16,
    estado: 11,
    unidades: 8,
    total: 11,
  };

  const cabecera = [
    "ID".padEnd(anchos.id),
    "CLIENTE".padEnd(anchos.cliente),
    "FECHA".padEnd(anchos.fecha),
    "CUÁNDO".padEnd(anchos.cuando),
    "ESTADO".padEnd(anchos.estado),
    "UDS".padStart(anchos.unidades),
    "TOTAL".padStart(anchos.total),
  ].join(" | ");

  console.log(cabecera);
  console.log("-".repeat(cabecera.length));

  for (const fila of filas) {
    console.log(
      [
        String(fila.id).padEnd(anchos.id),
        fila.cliente.padEnd(anchos.cliente),
        fila.fecha.padEnd(anchos.fecha),
        fila.cuando.padEnd(anchos.cuando),
        fila.estado.padEnd(anchos.estado),
        String(fila.unidades).padStart(anchos.unidades),
        fila.total.padStart(anchos.total),
      ].join(" | ")
    );
  }
}

// --- Pruebas ---

function assert(condicion, mensaje) {
  if (!condicion) throw new Error(`Fallo: ${mensaje}`);
}

const respuesta = await fetch(new URL("pedidos", BASE));

if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}`);

const pedidos = await respuesta.json();

assert(pedidos.length === 7, "siete pedidos");
assert(totalPedido(pedidos[0]) === 52.5, "total del pedido 1001");
assert(unidadesPedido(pedidos[0]) === 3, "unidades del pedido 1001");

const datos = resumen(pedidos);
assert(datos.validos === 6, "seis válidos");
assert(datos.ingresos === 310, "ingresos sin cancelados");
assert(Math.abs(datos.ticketMedio - 51.666666) < 0.001, "ticket medio");
assert(datos.unidades === 14, "unidades sin cancelados");
assert(datos.porEstado.get("pagado") === 2, "dos pagados");

assert(haceCuanto(new Date("2026-11-10T12:00:00Z")) === "hace 7 días", "relativo días");
assert(haceCuanto(new Date("2026-11-17T07:00:00Z")) === "hace 5 horas", "relativo horas");
assert(haceCuanto(new Date("2026-11-16T12:00:00Z")) === "ayer", "relativo ayer");

assert(contarPedidos(1) === "1 pedido", "singular");
assert(contarPedidos(7) === "7 pedidos", "plural");

const fila = filaPedido(pedidos[0]);
assert(fila.fecha === "10 de noviembre de 2026", "fecha larga");
assert(fila.total.replace(/[\u00a0\u202f]/g, " ") === "52,50 €", "total formateado");

const ordenados = pedidos.map((p) => p.cliente).toSorted(collator.compare);
assert(ordenados[0] === "Ana Ruiz", "orden alfabético español");
assert(ordenados[1] === "Ángel Soto", "acentos ordenados");

imprimirPanel(pedidos);
console.log("");
console.log("Reto 10 OK");
```

**Explicación línea a línea.**

| Línea / bloque | Qué hace | Por qué |
|---|---|---|
| `LOCALE`, `ZONA`, `AHORA` | Configuración explícita | Resultados reproducibles |
| `euro` | Formateador de moneda | Se crea una vez (7.8.14) |
| `fechaLarga` | `dateStyle: "long"` con zona | “10 de noviembre de 2026” |
| `relativo` | `numeric: "auto"` | “ayer” en vez de “hace 1 día” |
| `plural` | `Intl.PluralRules` | “1 pedido” / “7 pedidos” |
| `lista` | `Intl.ListFormat` | “Ana, Luis y Marta” |
| `collator` | Orden alfabético español | `Ángel` va después de `Ana` |
| `totalPedido` | Suma líneas | Regla pura, sin formato |
| `unidadesPedido` | Suma cantidades | No es lo mismo que líneas |
| `haceCuanto` | Horas o días según magnitud | Redondea y elige unidad |
| `contarPedidos` | Plural con `select` | No concatena “s” |
| `resumen` | Ingresos, media, unidades y estados | Excluye cancelados de los ingresos |
| `porEstado` | `Map` estado → cantidad | Orden de inserción predecible |
| `filaPedido` | Objeto listo para imprimir | Separa cálculo y presentación |
| `imprimirPanel` | Cabecera y filas alineadas | `padEnd`/`padStart` para columnas |
| `toSorted(collator.compare)` | Ordena sin mutar | `sort` mutaría el array |
| `toSorted((a,b) => total(b) - total(a))` | Orden por total descendente | Comparador numérico |
| Pruebas | Verifican totales y formatos | La salida se comprueba, no se supone |
| `replace(/[\u00a0\u202f]/g, " ")` en el assert | Normaliza espacios duros | `Intl` usa espacio no separable antes de `€` |

**Salida esperada (extracto):**

```text
PANEL DE PEDIDOS
================
Pedidos: 7 pedidos
Válidos: 6
Ingresos: 310,00 €
Ticket medio: 51,67 €
Unidades vendidas: 14

Por estado:
- pagado: 2 pedidos
- enviado: 2 pedidos
- pendiente: 2 pedidos
- cancelado: 1 pedido

Clientes:
Ana Ruiz, Ángel Soto, Diego Ramos, Elena Vidal, Luis Pérez, Marta Díaz y Sofía Molina
```

Después imprime el detalle con `ID`, `CLIENTE`, `FECHA`, `CUÁNDO`, `ESTADO`, `UDS` y `TOTAL`.

**Detalles que hacen la diferencia:**

- **El espacio antes de `€` no es un espacio normal.** Es `U+00A0` (o `U+202F`). Si comparas strings en tests, normaliza.
- **`Europe/Madrid` no es la zona del servidor.** `Intl` convierte el instante a esa zona; no cambies la hora del `Date`.
- **“Anteayer” existe.** `numeric: "auto"` usa palabras cuando el idioma las tiene.
- **Los cancelados no suman ingresos, pero sí aparecen en el conteo por estado.** Son dos preguntas distintas.

**Ampliación:** añade un selector de zona horaria y comprueba cómo cambia la columna `FECHA` sin cambiar los instantes.

---

### Reto 11 — Capstone: informe de pedidos

**Objetivo:** unir módulos, red, errores, validación, funciones puras, JSON e `Intl` en un programa completo.

**Enunciado:** crea `reto11.mjs` que:

1. Descargue pedidos y productos con timeout y reintentos.
2. Valide la forma de cada elemento y descarte los inválidos con un aviso.
3. Filtre pedidos no cancelados entre `2026-11-12` y `2026-11-17`.
4. Calcule KPIs, ventas por día, top productos y top clientes.
5. Imprima un informe formateado y un resumen JSON exportable.
6. Si la red falla, muestre un mensaje claro y termine con código de error.

```js
// 📄 reto11.mjs
// Capstone: panel de pedidos con red, validación, agregación e Intl.

const BASE = "http://localhost:3000/api/";
const LOCALE = "es-ES";
const ZONA = "UTC";
const DESDE = "2026-11-12";
const HASTA = "2026-11-17";

const ESTADOS = new Set(["pendiente", "pagado", "enviado", "cancelado"]);

const euro = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "EUR",
});

const fechaLarga = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: "long",
  timeZone: ZONA,
});

const diaCorto = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  timeZone: ZONA,
});

const plural = new Intl.PluralRules(LOCALE);

// --- Cliente HTTP ---

export class ErrorHttp extends Error {
  constructor(status, cuerpo) {
    super(cuerpo?.error ?? `HTTP ${status}`);
    this.name = "ErrorHttp";
    this.status = status;
  }
}

const dormir = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function pedir(ruta, { timeout = 2000, reintentos = 1 } = {}) {
  let ultimo;

  for (let intento = 0; intento <= reintentos; intento += 1) {
    try {
      const respuesta = await fetch(new URL(ruta, BASE), {
        signal: AbortSignal.timeout(timeout),
      });

      if (respuesta.status === 204) return null;

      const texto = await respuesta.text();
      const cuerpo = texto ? JSON.parse(texto) : null;

      if (!respuesta.ok) throw new ErrorHttp(respuesta.status, cuerpo);

      return cuerpo;
    } catch (error) {
      ultimo = error;

      const reintentable =
        error.name === "TimeoutError" ||
        error instanceof TypeError ||
        (error instanceof ErrorHttp && error.status >= 500);

      if (!reintentable || intento === reintentos) throw error;

      await dormir(150 * 2 ** intento);
    }
  }

  throw ultimo;
}

// --- Validación ---

export function esPedido(valor) {
  if (valor === null || typeof valor !== "object") return false;
  if (!Number.isInteger(valor.id)) return false;
  if (typeof valor.cliente !== "string" || valor.cliente.trim() === "") return false;
  if (typeof valor.fecha !== "string") return false;
  if (Number.isNaN(new Date(valor.fecha).getTime())) return false;
  if (!ESTADOS.has(valor.estado)) return false;
  if (!Array.isArray(valor.lineas) || valor.lineas.length === 0) return false;

  return valor.lineas.every(
    (linea) =>
      typeof linea.producto === "string" &&
      Number.isInteger(linea.cantidad) &&
      linea.cantidad > 0 &&
      typeof linea.precio === "number" &&
      linea.precio >= 0
  );
}

export function esProducto(valor) {
  return (
    valor !== null &&
    typeof valor === "object" &&
    Number.isInteger(valor.id) &&
    typeof valor.nombre === "string" &&
    typeof valor.precio === "number" &&
    valor.precio > 0 &&
    Number.isInteger(valor.stock) &&
    valor.stock >= 0
  );
}

// --- Dominio ---

export function totalPedido(pedido) {
  return pedido.lineas.reduce(
    (suma, linea) => suma + linea.precio * linea.cantidad,
    0
  );
}

export function unidadesPedido(pedido) {
  return pedido.lineas.reduce((suma, linea) => suma + linea.cantidad, 0);
}

export function dentroDeRango(pedido, desde = DESDE, hasta = HASTA) {
  const dia = pedido.fecha.slice(0, 10);
  return dia >= desde && dia <= hasta;
}

export function filtrarPedidos(pedidos, desde = DESDE, hasta = HASTA) {
  return pedidos.filter(
    (pedido) =>
      pedido.estado !== "cancelado" && dentroDeRango(pedido, desde, hasta)
  );
}

export function contarPedidos(n) {
  return `${n} ${plural.select(n) === "one" ? "pedido" : "pedidos"}`;
}

export function agruparPorDia(pedidos) {
  const dias = new Map();

  for (const pedido of pedidos) {
    const dia = pedido.fecha.slice(0, 10);
    const acumulado = dias.get(dia) ?? { pedidos: 0, total: 0 };
    dias.set(dia, {
      pedidos: acumulado.pedidos + 1,
      total: acumulado.total + totalPedido(pedido),
    });
  }

  return new Map([...dias.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

export function productosVendidos(pedidos) {
  const acumulado = new Map();

  for (const pedido of pedidos) {
    for (const linea of pedido.lineas) {
      const actual = acumulado.get(linea.producto) ?? {
        unidades: 0,
        ingresos: 0,
      };

      acumulado.set(linea.producto, {
        unidades: actual.unidades + linea.cantidad,
        ingresos: actual.ingresos + linea.cantidad * linea.precio,
      });
    }
  }

  return [...acumulado.entries()]
    .map(([producto, datos]) => ({ producto, ...datos }))
    .sort((a, b) => b.ingresos - a.ingresos || b.unidades - a.unidades);
}

export function mejoresClientes(pedidos) {
  const acumulado = new Map();

  for (const pedido of pedidos) {
    const total = totalPedido(pedido);
    const actual = acumulado.get(pedido.cliente) ?? { pedidos: 0, total: 0 };

    acumulado.set(pedido.cliente, {
      pedidos: actual.pedidos + 1,
      total: actual.total + total,
    });
  }

  return [...acumulado.entries()]
    .map(([cliente, datos]) => ({ cliente, ...datos }))
    .sort((a, b) => b.total - a.total || b.pedidos - a.pedidos);
}

export function crearResumen(pedidos) {
  const validos = filtrarPedidos(pedidos);
  const ingresos = validos.reduce((suma, p) => suma + totalPedido(p), 0);
  const unidades = validos.reduce((suma, p) => suma + unidadesPedido(p), 0);
  const porDia = agruparPorDia(validos);
  const productos = productosVendidos(validos);
  const clientes = mejoresClientes(validos);

  return {
    generado: new Date().toISOString(),
    rango: { desde: DESDE, hasta: HASTA },
    kpis: {
      pedidos: validos.length,
      ingresos,
      ticketMedio: validos.length > 0 ? ingresos / validos.length : 0,
      unidades,
      diasConVentas: porDia.size,
    },
    porDia: [...porDia.entries()].map(([dia, datos]) => ({ dia, ...datos })),
    topProductos: productos.slice(0, 3),
    topClientes: clientes.slice(0, 3),
  };
}

// --- Presentación ---

export function formatearDia(dia) {
  return diaCorto.format(new Date(`${dia}T12:00:00Z`));
}

export function imprimir(resumen) {
  const { kpis } = resumen;

  console.log("INFORME DE PEDIDOS");
  console.log(`Del ${fechaLarga.format(new Date(`${DESDE}T12:00:00Z`))} al ${fechaLarga.format(new Date(`${HASTA}T12:00:00Z`))}`);
  console.log("========================================");
  console.log(`Pedidos válidos: ${contarPedidos(kpis.pedidos)}`);
  console.log(`Ingresos: ${euro.format(kpis.ingresos)}`);
  console.log(`Ticket medio: ${euro.format(kpis.ticketMedio)}`);
  console.log(`Unidades: ${kpis.unidades}`);
  console.log(`Días con ventas: ${kpis.diasConVentas}`);

  console.log("");
  console.log("Por día:");
  for (const fila of resumen.porDia) {
    console.log(
      `- ${formatearDia(fila.dia)}: ${contarPedidos(fila.pedidos)}, ${euro.format(fila.total)}`
    );
  }

  console.log("");
  console.log("Top productos:");
  for (const fila of resumen.topProductos) {
    console.log(
      `- ${fila.producto}: ${fila.unidades} uds., ${euro.format(fila.ingresos)}`
    );
  }

  console.log("");
  console.log("Top clientes:");
  for (const fila of resumen.topClientes) {
    console.log(
      `- ${fila.cliente}: ${contarPedidos(fila.pedidos)}, ${euro.format(fila.total)}`
    );
  }

  console.log("");
  console.log("JSON exportable:");
  console.log(JSON.stringify(resumen, null, 2));
}

// --- Programa ---

async function main() {
  const [pedidosBrutos, productosBrutos] = await Promise.all([
    pedir("pedidos"),
    pedir("productos"),
  ]);

  const pedidosValidos = pedidosBrutos.filter(esPedido);
  const productosValidos = productosBrutos.filter(esProducto);
  const descartados = pedidosBrutos.length - pedidosValidos.length;

  if (descartados > 0) {
    console.warn(`⚠️ ${descartados} pedido(s) con forma inválida: se omiten.`);
  }

  if (productosValidos.length !== productosBrutos.length) {
    console.warn("⚠️ Algunos productos no tienen la forma esperada.");
  }

  const resumen = crearResumen(pedidosValidos);

  imprimir(resumen);

  // Pruebas de la lógica (no dependen de la consola)
  function assert(condicion, mensaje) {
    if (!condicion) throw new Error(`Fallo: ${mensaje}`);
  }

  assert(pedidosValidos.length === 7, "siete pedidos válidos");
  assert(productosValidos.length === 3, "tres productos válidos");
  assert(resumen.kpis.pedidos === 5, "cinco pedidos en rango");
  assert(resumen.kpis.ingresos === 257.5, "ingresos en rango");
  assert(resumen.kpis.unidades === 11, "unidades en rango");
  assert(resumen.kpis.diasConVentas === 4, "cuatro días con ventas");
  assert(resumen.topProductos[0].producto === "Pantalón", "top por ingresos");
  assert(resumen.topClientes[0].cliente === "Marta Díaz", "mejor cliente");
  assert(formatearDia("2026-11-12") === "12 nov", "día corto");
  assert(esPedido({ id: 1 }) === false, "rechaza pedido incompleto");
  assert(esProducto({ id: 1, nombre: "X", precio: 0, stock: 1 }) === false, "rechaza precio 0");

  const json = JSON.stringify(resumen);
  const vuelta = JSON.parse(json);
  assert(vuelta.kpis.pedidos === 5, "JSON ida y vuelta");

  console.log("");
  console.log("Reto 11 OK");
}

main().catch((error) => {
  if (error instanceof ErrorHttp) {
    console.error(`Error del servidor (${error.status}): ${error.message}`);
  } else if (error.name === "TimeoutError") {
    console.error("El servidor tardó demasiado.");
  } else if (error instanceof TypeError) {
    console.error("No se pudo conectar. ¿Está el servidor en el puerto 3000?");
  } else {
    console.error("Error inesperado:", error.message);
  }

  process.exitCode = 1;
});
```

**Explicación por bloques.**

| Bloque | Qué hace | Por qué |
|---|---|---|
| Constantes `BASE`, `LOCALE`, `ZONA`, `DESDE`, `HASTA` | Configuración | Un cambio, un sitio |
| `ESTADOS` como `Set` | Lista blanca de estados | Validación en O(1) |
| Formateadores `Intl` | Moneda, fecha larga, día corto, plural | Se crean una vez |
| `ErrorHttp` | Error con status | Permite distinguir 4xx/5xx |
| `pedir` | `fetch` + timeout + reintentos | Red tolerante a fallos |
| `AbortSignal.timeout` | Límite por intento | No deja la app colgada |
| `JSON.parse` dentro de `try` | Cuerpo inválido | Se propaga como error |
| `reintentable` | Timeout, red o 5xx | No reintenta 4xx |
| `esPedido` | Valida todos los campos y líneas | Un JSON válido puede tener basura |
| `esProducto` | Valida id, nombre, precio, stock | Contrato del backend |
| `totalPedido` / `unidadesPedido` | Derivados | No se guardan |
| `dentroDeRango` | Compara `YYYY-MM-DD` | Las fechas ISO se comparan lexicográficamente |
| `filtrarPedidos` | Excluye cancelados y fuera de rango | Una sola definición de “válido” |
| `agruparPorDia` | `Map` día → pedidos/total | Ordena las claves al final |
| `productosVendidos` | Agrega unidades e ingresos | Ordena por ingresos y desempata por unidades |
| `mejoresClientes` | Agrega por cliente | Top 3 |
| `crearResumen` | Objeto exportable | Separado de la impresión |
| `formatearDia` | `12 nov` | `T12:00:00Z` evita saltos de zona |
| `imprimir` | Informe legible | `Intl` en toda la salida |
| `Promise.all` | Pedidos y productos en paralelo | Menos latencia que secuencial |
| `filter(esPedido)` | Descarta inválidos | Y cuenta cuántos |
| `console.warn` | Aviso de descartes | Visible sin romper la salida |
| `crearResumen(pedidosValidos)` | Pipeline completo | Funciones puras al final |
| `assert` finales | Verifican las cifras | El reto se autocomprueba |
| `main().catch(...)` | Errores de red y timeout | Mensajes distintos según el tipo |
| `process.exitCode = 1` | Falla en scripts y CI | Un error no debe parecer éxito |

**Salida esperada (extracto):**

```text
INFORME DE PEDIDOS
Del 12 de noviembre de 2026 al 17 de noviembre de 2026
========================================
Pedidos válidos: 5 pedidos
Ingresos: 257,50 €
Ticket medio: 51,50 €
Unidades: 11
Días con ventas: 4

Por día:
- 12 nov: 1 pedido, 35,00 €
- 14 nov: 1 pedido, 90,00 €
- 16 nov: 2 pedidos, 120,00 €
- 17 nov: 1 pedido, 12,50 €

Top productos:
- Pantalón: 4 uds., 140,00 €
- Camisa: 4 uds., 80,00 €
- Gorra: 3 uds., 37,50 €

Top clientes:
- Marta Díaz: 1 pedido, 90,00 €
- Diego Ramos: 1 pedido, 85,00 €
- Luis Pérez: 1 pedido, 35,00 €
```

Al final imprime el JSON exportable y `Reto 11 OK`.

**Decisiones que puedes defender en una entrevista:**

- **El rango se compara en UTC.** Si el negocio usa otra zona, convierte antes de filtrar y documenta la decisión.
- **Los cancelados se excluyen de ingresos y unidades**, pero se cuentan en el total de pedidos. Son métricas distintas.
- **La validación descarta, no rompe.** Un pedido malformado no debe impedir el informe de los demás.
- **El JSON es el contrato de salida.** Otro sistema puede consumirlo sin parsear la tabla.
- **Los errores tienen mensajes de usuario y código de salida.** El log técnico no se mezcla con la presentación.

**Ampliación:** añade argumentos de línea de comandos para `desde`, `hasta` y `estado`. 📌 `process.argv` y los scripts de Node son del Módulo 8.

---

### Cómo comprobar los once retos

Con el servidor en marcha:

```bash
node reto01/app.mjs
node reto02.mjs
node reto03.mjs
node reto04.mjs
node reto05.mjs
node reto06.mjs
node reto07.mjs
node reto08.mjs
node reto09.mjs
node reto10.mjs
node reto11.mjs
```

Los retos 2, 3, 4, 5, 6, 7, 8, 9, 10 y 11 terminan con `Reto N OK`. El reto 1 imprime el ticket.

Si el servidor no está corriendo, los retos con red fallan con un mensaje claro. Eso también es parte de la lección: **un error de infraestructura no debe parecer un error de lógica**.

| Reto | Si lo resuelves, sabes… |
|---|---|
| 1 | Separar responsabilidades sin duplicar lógica |
| 2 | Escribir y probar utilidades funcionales |
| 3 | Modelar fallos esperados sin abusar de `throw` |
| 4 | Construir un cliente HTTP que no se cuelga |
| 5 | Evitar carreras y peticiones innecesarias |
| 6 | Hacer CRUD con validación y limpieza |
| 7 | Subir archivos sin romper el multipart |
| 8 | Persistir datos que sobrevivan a versiones |
| 9 | Validar y extraer texto con criterio |
| 10 | Mostrar datos como los espera el usuario |
| 11 | Integrar todo en un programa mantenible |

---

## 7.11 — Errores, glosario y autoevaluación

Este apartado es el mapa de los fallos que más se repiten en el módulo. No es una lista para memorizar: es una lista para **consultar cuando algo no funcione**. Cada fila tiene un síntoma que puedes buscar en Google o en la consola, la causa real y la corrección.

### 7.11.1 Errores frecuentes

#### Módulos ES

| Síntoma | Causa | Solución |
|---|---|---|
| `Cannot use import statement outside a module` | El archivo se carga como script clásico o como CommonJS | `<script type="module">`, extensión `.mjs` o `"type": "module"` en `package.json` |
| `Failed to resolve module specifier "utilidades"` | Falta `./`, `../` o la extensión | `import { x } from "./utilidades.js"` |
| `Failed to fetch dynamically imported module` | La ruta no existe o el servidor devuelve un `404` | Revisa mayúsculas, extensión y la pestaña Red |
| `does not provide an export named 'y'` | El nombre no coincide, o es un `export default` | Revisa el `export`; `default` se importa **sin** llaves |
| `Identifier 'x' has already been declared` | Importaste `x` y además declaraste `const x` | Renombra con `as` o elimina la declaración |
| `Cannot access 'x' before initialization` | Dependencia circular o uso antes de la declaración | Reordena, extrae a un tercer módulo o envuelve en una función |
| `require is not defined` / `exports is not defined` | Código CommonJS dentro de un módulo ES | Usa `import`/`export`, o ejecuta el archivo como CJS |
| `Unexpected token 'export'` | El navegador cargó el archivo como script clásico | Añade `type="module"` |
| `MIME type of "text/html"` al cargar el módulo | El servidor devolvió la página `404` en vez del `.js` | Corrige la ruta; sirve `.mjs` como `text/javascript` |
| `Blocked by CORS policy` al abrir con `file://` | Los módulos exigen HTTP | Usa un servidor local |
| `import` dentro de una función lanza error | El `import` estático solo vive en el nivel superior | Usa `await import("./x.js")` |
| `await` en el nivel superior no funciona | El archivo no es un módulo | `.mjs`, `type="module"` o `"type": "module"` |

#### Programación funcional

| Síntoma | Causa | Solución |
|---|---|---|
| El array original cambia de orden | `sort` muta y devuelve la misma referencia | `toSorted` o `[...array].sort(...)` |
| `reverse`, `splice`, `push` alteran el estado | Son métodos mutables | `toReversed`, `toSpliced`, spread |
| `map` devuelve `[undefined, ...]` | El callback usa llaves sin `return` | Devuelve el valor o quita las llaves |
| El estado cambia “solo” | Se mutó un objeto anidado | Copia en cada nivel: `{ ...obj, anidado: { ...obj.anidado } }` |
| `Object.freeze` no protege | Es superficial | Congela cada nivel o no mutes |
| `Reduce of empty array with no initial value` | `reduce` sin valor inicial sobre `[]` | Pasa el inicial: `0`, `[]`, `{}` |
| `memoize` devuelve valores equivocados | La clave por `JSON.stringify` cambia con el orden de claves | Clave explícita o `WeakMap` para objetos |
| `forEach` con `async` no espera | `forEach` ignora la promesa que devuelve el callback | `for...of` con `await` o `Promise.all(map)` |
| `JSON.parse(JSON.stringify(x))` pierde datos | JSON no tiene `Date`, `Map`, `undefined` | `structuredClone` o copia manual |
| `Maximum call stack size exceeded` | Recursión sin caso base o demasiado profunda | Caso base y versión iterativa |

#### Errores

| Síntoma | Causa | Solución |
|---|---|---|
| `e.message` es `undefined` | Se lanzó un string | Lanza siempre un `Error` |
| Se pierde el stack original | `throw new Error(e.message)` | `throw new Error("contexto", { cause: e })` |
| El `catch` no captura nada | El fallo ocurre en otro tick (`setTimeout`, promesa no esperada) | Espera la promesa o captura dentro del callback |
| El error desaparece | `return` dentro de `finally` | No retornes en `finally` |
| `instanceof` da `false` | Otro realm (iframe) o código transpilado | Comprueba `name` o un `code` propio |
| `JSON.stringify(error)` da `{}` | `message` y `stack` no son enumerables | Serializa `{ name, message, stack, cause }` |
| `UnhandledPromiseRejection` | Promesa rechazada sin `catch` | `try`/`await` o `.catch` |
| El `catch` vacío oculta bugs | `catch {}` | Registra, degrada o relanza |
| `try` envuelve cincuenta líneas | No sabes qué falló | Envuelve solo la operación que puede fallar |
| El reintento duplica un pedido | Se reintentó un `POST` no idempotente | Reintenta solo lo idempotente o usa una clave de idempotencia |

#### Red y `fetch`

| Síntoma | Causa | Solución |
|---|---|---|
| Un `404` se trata como éxito | `fetch` solo rechaza por fallo de red | Comprueba `respuesta.ok` |
| `Body is unusable: Body has already been read` | Leíste el cuerpo dos veces | Lee una vez: `text()` y luego `JSON.parse` |
| `Unexpected end of JSON input` | Respuesta `204` o cuerpo vacío | Comprueba `status === 204` o el texto vacío |
| `Failed to fetch` | DNS, conexión rechazada, CORS o `file://` | Mira la pestaña Red y el `Origin` |
| El preflight falla | Faltan `Access-Control-Allow-Headers`/`Methods` | Configura el servidor, no el cliente |
| La respuesta es `opaque` | `mode: "no-cors"` | No uses `no-cors` si necesitas leer el cuerpo |
| Las cookies no viajan | Falta `credentials: "include"` | Añádelo y configura CORS con origen explícito |
| El multipart no se parsea | Fijaste `Content-Type: multipart/form-data` a mano | Deja que `fetch` genere el `boundary` |
| `Request with GET/HEAD method cannot have body` | Enviaste `body` en un `GET` | Usa la query string |
| La URL sale con doble barra | Concatenaste strings | `new URL(ruta, baseConBarraFinal)` |
| Se pintan resultados viejos | Respuestas desordenadas | `AbortController` + número de turno |
| Se reintenta un `404` | Se reintenta todo | Reintenta solo red, timeout y `5xx` |
| La app queda en “Cargando…” | Sin timeout | `AbortSignal.timeout(ms)` |
| `AbortError` se muestra al usuario | Cancelación tratada como fallo | Ignora `AbortError` |
| `TimeoutError` y `AbortError` se confunden | Los dos son `DOMException` | Distingue por `name` |

#### JSON

| Síntoma | Causa | Solución |
|---|---|---|
| `Unexpected token '` in JSON | Comillas simples, comas finales o comentarios | JSON exige `"` y no admite nada de eso |
| `JSON.parse` recibe un objeto | Espera un string | Serializa antes o valida el tipo |
| Desaparecen propiedades | Eran `undefined`, funciones o símbolos | Conviértelas o usa un `replacer` |
| `null` donde había `NaN` | JSON no tiene `NaN` ni `Infinity` | Guarda un string o un centinela |
| La fecha vuelve como string | JSON no tiene `Date` | `new Date(texto)` al leer |
| `TypeError` con `BigInt` | No es serializable | Guárdalo como string |
| `Converting circular structure to JSON` | Referencia circular | Rompe el ciclo o usa `structuredClone` |
| El orden de claves cambió | Las claves enteras se ordenan primero | No dependas del orden |
| Contaminación de prototipo | Fusionaste JSON externo con `Object.assign` o `obj[clave] = valor` | Filtra `__proto__`, `constructor` y `prototype` |
| `structuredClone` falla | Función, nodo DOM o `Proxy` | Clona solo datos |
| `localStorage` devuelve basura | No validaste al leer | Valida forma y versión |

#### Expresiones regulares

| Síntoma | Causa | Solución |
|---|---|---|
| `test` funciona una vez y luego no | Flag `g` con `lastIndex` | Quita `g` para validar o reinicia `lastIndex` |
| `matchAll` lanza `TypeError` | Falta el flag `g` | `/\d+/g` |
| `\d` no encuentra `٣` | `\d` es ASCII | `\p{Nd}` con `u` |
| `.` no cruza líneas | `.` excluye terminadores | Flag `s` o `[\s\S]` |
| `^...$` acepta `"abc\n"` | `$` también coincide antes del salto final | Aplica `trim()` o compara la coincidencia completa |
| `[a-z]` no acepta `á` | Rango ASCII | `\p{L}` con `u` |
| `\b` falla con acentos | `\b` se basa en `\w`, que es ASCII | Lookarounds con `\p{L}` |
| `new RegExp("\d")` no funciona | En un string hay que duplicar la barra | `"\\d"` |
| Un punto del usuario actúa de comodín | No escapaste el texto | `RegExp.escape` o escapa metacaracteres |
| `replace` imprime `$&` literal | No usaste el patrón especial | `$&`, `$1`, `$$` |
| `split` devuelve elementos extra | El patrón tiene grupos de captura | Usa grupos no capturantes `(?:...)` |
| `match` sin `g` no da todas | Sin `g` devuelve la primera y sus grupos | `g` o `matchAll` |
| La app se cuelga con una entrada | ReDoS por cuantificadores anidados | Simplifica, limita la entrada y ancla |
| `\p{L}` sin `u` no funciona | Sin `u` se lee como texto literal | Añade `u` |

#### `Intl` y fechas

| Síntoma | Causa | Solución |
|---|---|---|
| El formato cambia entre máquinas | `toLocaleString()` sin locale | Pasa `"es-ES"` explícito |
| Los tests fallan por un espacio | `Intl` usa `U+00A0`/`U+202F` antes de `€` | Normaliza antes de comparar |
| La fecha se muestra un día antes | Se interpretó como UTC y se pintó en local | Construye con hora local o fija `timeZone` |
| `getMonth()` devuelve `1` para febrero | Los meses van de 0 a 11 | Suma 1 al mostrar |
| `setMonth` salta de mes | Desbordamiento de días (31 de enero + 1 mes) | Ajusta el día o usa `Temporal` |
| El servidor muestra otra hora | `DateTimeFormat` sin `timeZone` usa la del runtime | Fija `timeZone` |
| `"2026-02-30"` se acepta | `Date` desborda a marzo | Compara componentes (7.7.13) |
| El orden alfabético es raro | Se usó `<` o `sort()` por defecto | `Intl.Collator` |
| “1 pedidos” | Plural concatenado | `Intl.PluralRules` |
| “ayer” no aparece | `numeric: "always"` | `numeric: "auto"` |
| Un emoji cuenta como 2 | `.length` cuenta unidades UTF-16 | `Intl.Segmenter` o `[...texto].length` |
| La lista va lenta al pintar | Formateadores creados en cada render | Créalos una vez (7.8.14) |

#### Arquitectura

| Síntoma | Causa | Solución |
|---|---|---|
| No puedes probar la lógica sin navegador | La red o el DOM están dentro del cálculo | Separa dominio, transporte y vista (7.9.2) |
| El total se desincroniza | Se guardó un dato derivado | Calcúlalo al leer |
| Cambiar la URL obliga a tocar diez archivos | No hay capa `api` ni configuración | `config.js` + `api.js` |
| El reducer rompe las pruebas | Tiene efectos (`fetch`, `localStorage`) | Efectos fuera del reducer |
| La vista y el estado discrepan | Dos fuentes de verdad | Una sola, en el store |
| Un `404` se muestra como “sin conexión” | Se comprobó `name` en vez de `status` | Traduce por tipo y código (7.9.14) |
| Llegan datos de una búsqueda anterior | No se canceló lo obsoleto | `AbortController` + turno |
| `utils.js` tiene 40 funciones | No es una capa, es un cajón | Divide por responsabilidad |

### 7.11.2 Los seis fallos que más cuestan

Estos no son errores de sintaxis: son errores **silenciosos**. El código se ejecuta, no lanza nada y produce un resultado incorrecto. Son los que más tiempo cuestan en producción.

**1. Creer que `fetch` lanza en `4xx` y `5xx`.**

```js
// ❌ Se pinta el cuerpo del error como si fueran datos
const respuesta = await fetch("http://localhost:3000/api/productos/999");
const datos = await respuesta.json();
console.log(respuesta.ok); // false
console.log(datos); // { error: "Producto no encontrado" }

// ✅ Comprueba antes de parsear como éxito
const respuesta2 = await fetch("http://localhost:3000/api/productos/999");

if (!respuesta2.ok) {
  throw new Error(`HTTP ${respuesta2.status}`);
}
```

`fetch` solo rechaza cuando **no hubo respuesta**: DNS, conexión rechazada, CORS o cancelación. Un `500` es una respuesta perfectamente válida.

**2. Leer el cuerpo dos veces.**

```js
const respuesta = await fetch("http://localhost:3000/api/productos");
const texto = await respuesta.text();

// ❌ TypeError: Body is unusable: Body has already been read
// const datos = await respuesta.json();

// ✅ Parsea el texto que ya leíste
const datos = JSON.parse(texto);
console.log(Array.isArray(datos)); // true
```

El cuerpo es un **stream**: se consume una vez. Si necesitas el texto para depurar y los datos para trabajar, lee `text()` y parsea tú.

**3. Mutar el estado con `sort`.**

```js
const porPrecio = (a, b) => a.precio - b.precio;
const productos = [
  { nombre: "Camisa", precio: 20 },
  { nombre: "Gorra", precio: 12.5 },
];

// ❌ sort muta y devuelve la misma referencia
const ordenados = productos.sort(porPrecio);
console.log(ordenados === productos); // true

// ✅ toSorted devuelve un array nuevo
const copia = productos.toSorted(porPrecio);
console.log(copia === productos); // false
console.log(productos.map((p) => p.nombre)); // ["Camisa", "Gorra"]
```

Un `sort` dentro de un `render` reordena el estado en cada pintado. El bug aparece cuando otra parte del código esperaba el orden original.

**4. Reutilizar una regex con `g` para validar.**

```js
const PATRON = /\d+/g;

console.log(PATRON.test("12")); // true
console.log(PATRON.test("12")); // false  ← el mismo texto, distinto resultado
console.log(PATRON.lastIndex); // 2

PATRON.lastIndex = 0;
console.log(PATRON.test("12")); // true
```

`test` con `g` avanza `lastIndex`. Para validar, el patrón no debe llevar `g`; para recorrer todas las coincidencias, usa `matchAll`.

**5. Formatear sin locale ni zona.**

```js
const precio = 1234.5;
const fecha = new Date("2026-03-01T00:00:00Z");

// ❌ Depende del entorno donde se ejecute
console.log(precio.toLocaleString());
console.log(fecha.toLocaleDateString());

// ✅ Explícito y reproducible
const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

const dia = new Intl.DateTimeFormat("es-ES", {
  dateStyle: "long",
  timeZone: "UTC",
});

console.log(euro.format(precio)); // "1234,50 €"
console.log(dia.format(fecha)); // "1 de marzo de 2026"
```

El mismo código imprime `1,234.5` en un servidor con locale inglés y `1234,5` en uno español. Los tests que comparan strings fallan según la máquina. Especifica siempre locale y zona.

**6. Esperar que `forEach` espere.**

```js
const numeros = [1, 2, 3];
const guardar = (n) =>
  new Promise((resolve) => setTimeout(() => resolve(n * 2), 10));

// ❌ forEach ignora la promesa del callback
numeros.forEach(async (n) => {
  await guardar(n);
});
console.log("forEach: terminado"); // se imprime antes de las promesas

// ✅ map devuelve promesas y Promise.all las espera
const resultados = await Promise.all(numeros.map((n) => guardar(n)));
console.log("Promise.all:", resultados); // [2, 4, 6]
```

Si además el callback lanza, tendrás un `UnhandledPromiseRejection` que no puedes capturar desde fuera. `forEach` sirve para efectos síncronos, no para esperar.

### 7.11.3 Glosario

| Término | Definición |
|---|---|
| **Módulo ES (ESM)** | Archivo con su propio ámbito que declara dependencias con `import` y su API con `export` |
| **Especificador** | Texto que identifica el módulo en un `import` (`"./x.js"`, `"node:fs"`) |
| **Export nombrado** | Export vinculado a un nombre; se importa con llaves |
| **Export default** | Export único sin nombre; se importa sin llaves y con el nombre que quieras |
| **Binding vivo** | El import refleja los cambios del export original, no una copia |
| **Hoisting de imports** | Los `import` se evalúan antes que el cuerpo del módulo |
| **Import dinámico** | `import()` devuelve una promesa y permite cargar código bajo demanda |
| **Top-level `await`** | `await` en el nivel superior de un módulo; retrasa su evaluación |
| **Dependencia circular** | Dos módulos que se importan entre sí |
| **Archivo barril** | Módulo que reexporta otros para centralizar la API |
| **CommonJS (CJS)** | Sistema de módulos de Node con `require` y `module.exports` |
| **`import.meta`** | Objeto con metadatos del módulo, como `import.meta.url` |
| **Función pura** | Devuelve siempre lo mismo para las mismas entradas y no tiene efectos observables |
| **Efecto secundario** | Cualquier cambio fuera de la función: red, DOM, disco, consola, reloj, azar |
| **Transparencia referencial** | Una expresión puede sustituirse por su valor sin cambiar el programa |
| **Inmutabilidad** | No modificar datos existentes; crear versiones nuevas |
| **Mutación** | Cambiar un objeto o array en su lugar |
| **Copia superficial** | Copia el primer nivel; los objetos anidados se comparten |
| **Copia profunda** | Copia todos los niveles |
| **Función de orden superior** | Recibe o devuelve funciones |
| **Composición** | Combinar funciones para construir una nueva |
| **`pipe`** | Compone de izquierda a derecha |
| **`compose`** | Compone de derecha a izquierda |
| **Currying** | Convertir una función de varios argumentos en una cadena de funciones de uno |
| **Aplicación parcial** | Fijar algunos argumentos y dejar el resto para después |
| **Aridad** | Número de argumentos que declara o espera una función |
| **Memoización** | Cachear resultados según los argumentos |
| **Recursión** | Función que se llama a sí misma |
| **Caso base** | Condición que detiene la recursión |
| **Declarativo** | Describir el resultado, no los pasos |
| **Imperativo** | Describir los pasos |
| **Reducer** | Función `(estado, acción) => nuevoEstado` |
| **Excepción** | Situación anómala que interrumpe el flujo normal |
| **`throw`** | Lanza un valor y desvía la ejecución al `catch` más cercano |
| **Stack trace** | Rastro de llamadas que llevaron al error |
| **Propagación** | Dejar que un error suba a quien sepa manejarlo |
| **Error esperado** | Fallo previsible que forma parte del flujo (validación, no encontrado) |
| **Error inesperado** | Bug o fallo de infraestructura que no debería ocurrir |
| **Error personalizado** | Clase que hereda de `Error` y añade datos del dominio |
| **`cause`** | Propiedad que encadena el error original |
| **`AggregateError`** | Error que agrupa varios en `.errors` |
| **`Result`** | Objeto `{ ok, valor }` o `{ ok, error }` que modela el fallo como dato |
| **Reintento** | Volver a intentar una operación que falló |
| **Backoff exponencial** | Espera creciente entre reintentos |
| **Jitter** | Variación aleatoria de la espera para evitar sincronización |
| **Idempotencia** | Repetir la operación produce el mismo estado final |
| **HTTP** | Protocolo de petición-respuesta sobre el que viaja la web |
| **Método HTTP** | Verbo de la petición: `GET`, `POST`, `PUT`, `PATCH`, `DELETE` |
| **Código de estado** | Número que resume el resultado: `200`, `201`, `204`, `404`, `500` |
| **Cabecera** | Metadato de la petición o respuesta (`Content-Type`, `Authorization`) |
| **Cuerpo** | Contenido de la petición o respuesta |
| **Query string** | Parámetros después de `?` en la URL |
| **Origen** | Combinación de esquema, dominio y puerto |
| **CORS** | Reglas del navegador para permitir respuestas de otro origen |
| **Preflight** | Petición `OPTIONS` que el navegador hace antes de una petición no simple |
| **Credenciales** | Cookies y cabeceras de autenticación enviadas con la petición |
| **`AbortController`** | Objeto que crea una señal para cancelar operaciones |
| **`AbortSignal`** | Señal que avisa de la cancelación |
| **Timeout** | Límite de tiempo tras el cual se cancela |
| **Caché HTTP** | Reutilización de respuestas según cabeceras como `Cache-Control` y `ETag` |
| **MIME type** | Tipo de contenido (`application/json`, `text/html`) |
| **Multipart** | Formato que separa partes de un cuerpo con un `boundary` |
| **`FormData`** | Estructura clave-valor para enviar campos y archivos |
| **`Blob`** | Datos binarios inmutables con tipo MIME |
| **Axios** | Librería HTTP que envuelve `fetch`/XHR con instancias e interceptores |
| **Instancia de Axios** | Cliente con `baseURL`, cabeceras y timeout propios |
| **Interceptor** | Función que transforma peticiones o respuestas de forma global |
| **JSON** | Formato de texto para datos: objetos, arrays, strings, números, booleanos y `null` |
| **Serializar** | Convertir datos en texto (`JSON.stringify`) |
| **Deserializar** | Convertir texto en datos (`JSON.parse`) |
| **`replacer`** | Función o lista que filtra qué se serializa |
| **`reviver`** | Función que transforma valores al deserializar |
| **Migración** | Convertir datos de una versión antigua al formato actual |
| **Contaminación de prototipo** | Alterar `Object.prototype` a través de claves como `__proto__` |
| **`structuredClone`** | Copia profunda nativa que conserva `Date`, `Map` y `Set` |
| **Expresión regular** | Patrón que describe un conjunto de cadenas |
| **Metacarácter** | Carácter con significado especial en una regex (`.`, `*`, `+`, `?`) |
| **Clase de caracteres** | Conjunto entre corchetes: `[a-z]`, `\d`, `\p{L}` |
| **Cuantificador** | Indica repetición: `*`, `+`, `?`, `{n,m}` |
| **Greedy / lazy** | Codicioso consume lo máximo; lazy (`*?`) lo mínimo |
| **Ancla** | Posición fija: `^`, `$`, `\b` |
| **Grupo de captura** | Paréntesis cuyo contenido se guarda |
| **Grupo no capturante** | `(?:...)`, agrupa sin guardar |
| **Alternancia** | `\|` para elegir entre opciones |
| **Flag** | Modificador: `g`, `i`, `m`, `s`, `u`, `y` |
| **`lastIndex`** | Posición desde la que continúa la próxima búsqueda con `g` |
| **Lookahead / lookbehind** | Comprueban lo que sigue o precede sin consumirlo |
| **Retro-referencia** | `\1` que repite lo capturado por un grupo |
| **ReDoS** | Ataque que cuelga el motor con un patrón costoso |
| **Property escape** | `\p{L}`, `\p{N}`; requiere `u` |
| **Normalización Unicode** | NFD separa acentos; NFC los compone |
| **Slug** | Versión de un texto apta para URL |
| **Locale** | Identificador de idioma y región, como `es-ES` o `en-US` |
| **Zona horaria** | Regla de desplazamiento respecto a UTC, como `Europe/Madrid` |
| **UTC** | Tiempo universal coordinado, sin zonas ni horario de verano |
| **Epoch** | Instante de referencia: 1 de enero de 1970 a las 00:00 UTC |
| **ISO 8601** | Formato de fecha y hora `2026-11-17T12:00:00Z` |
| **`Intl`** | API nativa de internacionalización |
| **`Intl.Collator`** | Comparador que ordena según las reglas de un idioma |
| **`Intl.PluralRules`** | Categorías de plural (`one`, `other`, `many`) |
| **`Intl.ListFormat`** | Listas naturales con “y” u “o” |
| **`Intl.RelativeTimeFormat`** | “ayer”, “hace 3 días”, “dentro de 2 horas” |
| **`Intl.Segmenter`** | Divide texto en grafemas, palabras o frases |
| **Grafema** | Carácter percibido por el usuario; puede ocupar varios code points |
| **`Temporal`** | API moderna de fechas, con tipos explícitos de fecha, hora y zona |
| **Capa** | Grupo de archivos con una responsabilidad y una dirección de dependencia |
| **Acoplamiento** | Grado en que un módulo depende de otro |
| **Cohesión** | Grado en que lo que hay en un módulo pertenece junto |
| **Contrato** | Acuerdo de entrada y salida entre dos capas |
| **Dominio** | Reglas del negocio, sin infraestructura |
| **Transporte** | Capa que habla con la red |
| **Acción** | Objeto que describe un cambio solicitado al estado |
| **Store** | Objeto que guarda el estado y notifica a los suscriptores |
| **Suscriptor** | Función que se ejecuta cuando cambia el estado |
| **Estado derivado** | Dato calculado a partir de otro; no se guarda |
| **Inyección de dependencias** | Pasar las dependencias desde fuera en vez de crearlas dentro |
| **Fuente única de verdad** | Un solo lugar guarda cada dato |

### 7.11.4 Autoevaluación

Marca lo que puedas explicar o hacer **sin mirar el material**.

**Módulos**

- [ ] Explico qué problema resuelven los módulos frente a los scripts globales.
- [ ] Distingo `export` nombrado de `export default` y sé importarlos.
- [ ] Sé por qué `import` se evalúa antes que el cuerpo del módulo.
- [ ] Uso `import()` para cargar código bajo demanda.
- [ ] Sé cuándo un módulo puede usar `await` en el nivel superior.
- [ ] Reconozco una dependencia circular y sé cómo romperla.
- [ ] Sé qué extensión y qué `type` necesita Node y qué necesita el navegador.
- [ ] Entiendo por qué `file://` no sirve para módulos.

**Programación funcional**

- [ ] Distingo función pura de función con efectos.
- [ ] Sé qué métodos mutan y cuáles devuelven copia.
- [ ] Actualizo objetos y arrays anidados sin mutar.
- [ ] Explico por qué `Object.freeze` es superficial.
- [ ] Escribo `pipe` y `compose` desde cero.
- [ ] Explico currying y aplicación parcial con un ejemplo.
- [ ] Implemento `memoize` y sé cuándo la clave falla.
- [ ] Reconozco cuándo la recursión necesita un caso base y cuándo conviene iterar.
- [ ] Justifico cuándo el estilo declarativo es más claro que el imperativo.

**Errores**

- [ ] Distingo error esperado de error inesperado.
- [ ] Sé cuándo capturar, cuándo propagar y cuándo no hacer nada.
- [ ] Creo una jerarquía de errores con `name` y datos propios.
- [ ] Encadeno errores con `cause` sin perder el stack.
- [ ] Uso `finally` sin comerme el error.
- [ ] Explico el patrón `Result` y cuándo preferirlo a `throw`.
- [ ] Diseño reintentos que no repiten efectos no idempotentes.
- [ ] Registro un error con contexto útil, sin secretos.

**Red**

- [ ] Explico el viaje completo de una URL hasta la respuesta.
- [ ] Distingo `2xx`, `3xx`, `4xx` y `5xx` y sé qué hacer con cada uno.
- [ ] Compruebo `respuesta.ok` antes de tratar el cuerpo como éxito.
- [ ] Leo el cuerpo una sola vez y manejo `204`.
- [ ] Construyo URLs con `URL` y `URLSearchParams`.
- [ ] Envío JSON con las cabeceras correctas.
- [ ] Explico CORS, preflight y por qué el error aparece en el navegador y no en `curl`.
- [ ] Cancelo con `AbortController` y distingo `AbortError` de `TimeoutError`.
- [ ] Implemento timeout, reintento con backoff y cancelación juntos.
- [ ] Subo un archivo con `FormData` sin fijar el `Content-Type`.
- [ ] Sé cuándo usar `fetch` y cuándo Axios, y qué aporta cada uno.

**Datos**

- [ ] Explico qué tipos soporta JSON y qué se pierde al serializar.
- [ ] Uso `replacer` y `reviver` con un propósito concreto.
- [ ] Valido datos externos antes de confiar en ellos.
- [ ] Versiono y migro datos guardados.
- [ ] Reconozco un intento de contaminación de prototipo.
- [ ] Escribo una regex anclada y la pruebo con casos límite.
- [ ] Explico `lastIndex` y el bug de `g` al validar.
- [ ] Evito ReDoS y sé cuándo una regex no es la herramienta.
- [ ] Formateo moneda, fecha, plural y lista con `Intl` y locale explícito.
- [ ] Distingo fecha, instante y zona horaria.

**Arquitectura**

- [ ] Dibujo las capas de una app con datos remotos y la dirección de sus dependencias.
- [ ] Sé qué archivo conoce `fetch` y cuál conoce `document`.
- [ ] Distingo estado guardado de estado derivado.
- [ ] Escribo un reducer puro y un store con suscriptores.
- [ ] Pinto los estados de carga, éxito, vacío y error.
- [ ] Traduzco un error técnico a un mensaje de usuario.
- [ ] Cancelo peticiones obsoletas al cambiar un filtro.
- [ ] Pruebo la lógica pura sin navegador ni red.

Si fallas en algún punto, vuelve a la sección correspondiente antes de seguir. Un “no” honesto vale más que un “sí” superficial.

### 7.11.5 Qué sigue

En el **Módulo 8** verás lo que convierte código que funciona en código que un equipo puede mantener:

- **Código limpio:** nombres, funciones pequeñas, límites, comentarios que aportan, manejo de la complejidad.
- **Revisión de código:** qué mirar, cómo comentar, qué no bloquear.
- **ESLint:** reglas, configuración plana, integración con el editor, errores frente a avisos.
- **Prettier:** formato automático, conflictos con ESLint, `.editorconfig`.
- **Node.js como plataforma:** `package.json`, `"type": "module"`, interoperabilidad con CommonJS.
- **npm:** instalación, dependencias de producción y desarrollo, `package-lock.json`, semver, scripts, `npx`.
- **Bundlers y transpilación:** Vite, esbuild, Rollup, webpack; qué hace cada uno y cuándo no necesitas ninguno.
- **Entornos:** variables de entorno, configuración por entorno, build de producción y despliegue.
- **Calidad automatizada:** formato y lint en el editor, en el script y en la integración continua.

Todo lo de este módulo —módulos, funciones puras, errores tipados, `fetch`, JSON, regex, `Intl` y capas— es la materia prima. El Módulo 8 es el taller donde se pule y se automatiza.

---

## ✅ Resumen del Módulo 7

| Área | Lo esencial |
|---|---|
| **Módulos** | Un archivo, un ámbito. `export`/`import`, rutas con extensión, `type="module"` |
| **Carga dinámica** | `import()` para código bajo demanda; top-level `await` en módulos |
| **Dependencias** | Sin globals; una dirección clara; las circulares se rompen con diseño |
| **Funciones puras** | Mismas entradas, misma salida, sin efectos observables |
| **Inmutabilidad** | Copia en cada nivel; `toSorted`, `toReversed`, `toSpliced`, `with` |
| **Composición** | `pipe`, `compose`, currying, memoización, recursión con caso base |
| **Errores** | `Error` siempre; jerarquías con `name`; `cause` para el contexto |
| **`Result`** | Fallos esperados como datos; `throw` para lo inesperado |
| **Reintentos** | Solo lo reintentable; backoff y jitter; no repitas efectos |
| **HTTP** | Métodos, estados, cabeceras, cuerpo, caché; `URL` en vez de concatenar |
| **`fetch`** | No lanza en `4xx`/`5xx`; cuerpo de un solo uso; `ok` primero |
| **CORS** | Regla del navegador; el servidor concede; el preflight se configura allí |
| **Cancelación** | `AbortController`, `AbortSignal.timeout`, `AbortSignal.any` |
| **Producción** | Cliente HTTP único, timeout, reintento, deduplicación, paginación |
| **Axios** | Instancias, interceptores, `validateStatus`; comodidad frente a estándar |
| **JSON** | Solo datos; `Date`, `Map`, `undefined` y `BigInt` se pierden o fallan |
| **Persistencia** | Versión, validación al leer, migración en cadena, sin secretos |
| **Seguridad** | `textContent`, filtrado de `__proto__`, nada de `eval` |
| **Regex** | Anclas, clases, cuantificadores, grupos, flags, `lastIndex`, ReDoS |
| **Unicode** | `u` + `\p{...}`; `\w` y `\d` son ASCII; normaliza para buscar sin acentos |
| **`Intl`** | Locale y zona explícitos; moneda, fecha, plural, lista, orden, relativos |
| **Fechas** | Instante frente a fecha civil; meses 0–11; `Date` desborda; `Temporal` llega |
| **Arquitectura** | `config → http → api`; `dominio` puro; `estado` con reducer; `vista` solo DOM |
| **Pruebas** | La capa pura se prueba en Node sin navegador ni red |

**La idea central:** un programa real es un sistema de fronteras. Los módulos separan archivos; las funciones puras separan cálculo de efecto; los errores tipados separan lo esperado de lo inesperado; las capas separan red, dominio y presentación. Cuando esas fronteras están bien puestas, cada pieza se puede entender, probar y cambiar sola.

---

> **Fin del Módulo 7.**
>
> Cuando quieras, continuamos con el **Módulo 8: código limpio, ESLint, Prettier, Node.js, npm y bundlers**.
