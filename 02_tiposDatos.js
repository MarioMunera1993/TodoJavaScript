//Tipos de datos en JS

/**
    Tipo	    Ejemplo	                Notas
 
    string	    "hola", 'hola', `hola`	Inmutable, secuencia UTF-16
    number	    42, 3.14, -0, NaN,      Infinity	Siempre coma flotante de 64 bits (IEEE 754)
    boolean	    true, false	
    undefined	undefined	            "No tiene valor asignado" (lo pone JS)
    null	    null	                "Ausencia intencional de valor" (lo pones tú)
    bigint	    9007199254740993n	    Enteros de precisión arbitraria (ES2020)
    symbol	    Symbol("id")	        Identificador único e inmutable (ES6)

    Todo lo demás es un objeto: arrays, funciones, fechas, mapas, promesas, null (¡el famoso bug!).
*/

typeof 42;              // "number"
typeof "hola";          // "string"
typeof true;            // "boolean"
typeof undefined;       // "undefined"
typeof null;            // "object"   ⚠️ BUG HISTÓRICO de 1995, nunca corregido por compatibilidad
typeof Symbol("id");    // "symbol"
typeof 10n;             // "bigint"
typeof {};              // "object"
typeof [];              // "object"   (los arrays son objetos)
typeof function () {};  // "function" (caso especial, aunque técnicamente es objeto)

//Ejemplos de tipos de datos

//String
const nombre = "Mario";
console.log(typeof nombre);

//number
const numero1 = 1000;
console.log(typeof numero1);

const numero2 = 4.5;
console.log(typeof numero2);
// Nota en js todos no hay un tipo de dato coma flotante todo es number


//object
const objeto = {
    nombre : "Juan",
    apellido : "Perez",
    telefono : "55443322"
}

console.log(typeof objeto);


//boolean
var esCasado = true
console.log(typeof esCasado);

//function
function miFuncion() {};
console.log(typeof miFuncion);

//class es una function
class Persona{
    constructor(nombre, apellido){
        this.nombre = nombre;
        this.apellido = apellido;
    }
}
console.log(typeof Persona);

//Symbol
var simbolo = Symbol("mi simbolo");
console.log(typeof simbolo);

//undefined
var x;
console.log(typeof x);

//null = ausencia de valor
var y = null;
console.log(typeof y);








