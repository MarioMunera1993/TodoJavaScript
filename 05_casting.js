//Explícita vs implícita

/*
Conversión explícita (casting): tú la pides con Number(), String(), Boolean(), parseInt(), etc.
Coerción implícita: JS la hace sola al operar con tipos distintos ("5" * 2).
*/

// Explícita
Number("42");       // 42
String(42);         // "42"
Boolean(0);         // false

// Implícita
"5" * 2;            // 10
1 + "2";            // "12"

//Convertir de string a numero

let numeroString = "123";
let numero = Number(numeroString);

console.log("El número es: " + numero);
console.log("Tipo de dato: " + typeof numero);

//Convertir de string a numero usando parseInt
let numeroString2 = "456";
let numero2 = parseInt(numeroString2);  
console.log("El número es: " + numero2);
console.log("Tipo de dato: " + typeof numero2);

/*
la diferencia entre Number() y parseInt() es que Number() convierte el string a un número de punto flotante, 
mientras que parseInt() convierte el string a un número entero.
*/