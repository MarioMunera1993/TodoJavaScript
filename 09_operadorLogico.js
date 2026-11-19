//Operadores Logicos

let x = true;
let y = false;

// AND
// El operador AND (&&) devuelve true si ambos operandos son verdaderos, de lo contrario devuelve false.
console.log(x && y); // false

// OR
// El operador OR (||) devuelve true si al menos uno de los operandos es verdadero, de lo contrario devuelve false.
console.log(x || y); // true

// NOT
// El operador NOT (!) devuelve true si el operando es false, y false si el operando es true.
console.log(!x); // false

//Comparando valores booleanos
let z = 5;
let w = 10;

// AND con comparación
console.log(z < w && x != y); // true