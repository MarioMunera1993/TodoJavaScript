//Variables Let Var const
/*
Una variable es un nombre simbólico asociado a un espacio en memoria (o a una referencia) 
que puede contener un valor. En JS, el nombre se declara una vez 
y el valor se puede asignar, reasignar o mutar (si es un objeto).
*/

let edad;          // declaración (sin valor → undefined)
edad = 25;         // asignación (inicialización)
edad = 26;         // reasignación

//sintaxis basica de variables
var nombre = "Juan"; //esta ya no se usa mucho
const PI = 3.1416;//esta es la forma de declarar una constante, no se puede cambiar su valor Debe inicializarse en la declaración.

let a = 10, b = 20, c = 30; //declarar varias variables en una sola linea

let d, e, f; //declarar varias variables sin asignarles valor (sin inicializar)

d = 40;
e = 50;
f = 60;

//buenas practicas de nombrar variables
const nombreCompleto = "Juan Perez";
const edadPersona = 30;
const alturaPersona = 1.75;

/**
 * Regla profesional: usa const por defecto; cambia a let solo cuando necesites reasignar. 
 * var: nunca. Esto no es estética: reduce bugs y comunica intención ("esto no cambia").
 */