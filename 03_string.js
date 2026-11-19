//Los strings son inmutables: ningún método los modifica; devuelven uno nuevo.
let saludo = "Hola";
saludo[0] = "J";        // ❌ no hace nada (en strict mode lanza error)
console.log(saludo);    // "Hola"

const mayus = saludo.toUpperCase(); // devuelve un NUEVO string
console.log(mayus);     // "HOLA"
console.log(saludo);    // "Hola"

//Comillas y template literals (ES6):
const nombre = "Ana";
const edad = 30;

// ❌ Concatenación clásica (funciona, pero se vuelve ilegible)
const msg1 = "Hola, " + nombre + ". Tienes " + edad + " años.";

// ✅ Template literal: interpolación + multilínea
const msg2 = `Hola, ${nombre}. Tienes ${edad} años.
Puedes usar "comillas" y 'apóstrofes' sin escapar.`;

// ✅ Expresiones dentro de ${}
console.log(`El doble de tu edad es ${edad * 2}`);


const letras = "a,b,c"
const conEspacios = " Hola Mundo "
const stringNumero = "5"

//
console.log(nombre.length); //3
console.log(nombre[1]); //n
console.log(nombre.at(-1)); // "a" (ES2022, acepta negativos)
console.log(letras.split(",")); // ["a", "b", "c"]
console.log(conEspacios.trim()); //quita espacios iniciales y finales
console.log(conEspacios.includes("Mun")); //true pero hay que tener en cuenta las mayusculas y minusculas
console.log(nombre.startsWith("An")); //true
console.log(conEspacios.replace("o", 0)); // "H0la" (solo la primera)
console.log(conEspacios.replaceAll("o", 0)); //H0la Mund0 remplaza todas las coincidencias
console.log(nombre.repeat(3)); //AnaAnaAna
console.log(stringNumero.padStart(3, "0"));  //rellena a la izquierda 005
console.log(stringNumero.padEnd(3,"0")); //rellena a la derecha 500






