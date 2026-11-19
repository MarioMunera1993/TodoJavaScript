//Todos los números son doubles de 64 bits. No hay int ni float separados.

console.log(0.1 + 0.2); // 0.30000000000000004 😱
console.log(0.1 + 0.2 === 0.3); //false


Number.MAX_SAFE_INTEGER;      // 9007199254740991 (2^53 - 1)
Number.MAX_SAFE_INTEGER + 1;  // 9007199254740992
Number.MAX_SAFE_INTEGER + 2;  // 9007199254740992 ⚠️ ¡se repite!
Number.isSafeInteger(2 ** 53); // false (comprueba si el entero es exactamente representable)

Infinity;                     // Infinity
-Infinity;                    // -Infinity
1 / 0;                        // Infinity
-1 / 0;                       // -Infinity
0 / 0;                        // NaN

NaN === NaN;                  // false ⚠️ (NaN no es igual a nada, ni a sí mismo)
Number.isNaN(NaN);            // true ✅ (no coacciona)
isNaN("hola");                // true ⚠️ (coacciona: "hola" → NaN)
Number.isFinite(42);          // true
Number.isInteger(42.0);       // true

/*
Math es un objeto incorporado con funciones matemáticas: 
Math.abs(-5) → 5, Math.floor(3.9) → 3, Math.round(3.5) → 4, Math.max(1, 5, 3) → 5.
*/

//Comparar flotantes correctamente:

const a = 0.1 + 0.2;
const b = 0.3;

// ❌ if (a === b)
// ✅ comparar con tolerancia
// Math.abs devuelve el valor absoluto; Number.EPSILON es la diferencia
// mínima representable entre 1 y el siguiente número.
const sonIguales = Math.abs(a - b) < Number.EPSILON;
console.log(sonIguales); // true

// Para dinero: trabaja en centavos (enteros)
const precio = 1999; // 19.99 € en céntimos


//BigInt (ES2020) para enteros gigantes:

const grande = 9007199254740993n;   // sufijo n
grande + 1n;                        // 9007199254740994n
console.log(typeof grande); // "bigint
// ⚠️ No se mezcla con number: 1n + 1 → TypeError

//Notación numérica:

1_000_000;      // separador de miles (ES2021)
0xff;           // hexadecimal → 255
0b1010;         // binario → 10
0o17;           // octal → 15
1e3;            // 1000