// operadores Aritmeticos


// Suma
let a = 10;
let b = 5;
let suma = a + b;
console.log("La suma es: " + suma);

// Resta
let resta = a - b;
console.log("La resta es: " + resta);

// Multiplicación
let multiplicacion = a * b;
console.log("La multiplicación es: " + multiplicacion);

// División
let division = a / b;
console.log("La división es: " + division);

// Módulo
let modulo = a % b;
console.log("El módulo es: " + modulo);

// Incremento
a++;
console.log("El valor de a después del incremento es: " + a);

// Decremento
b--;
console.log("El valor de b después del decremento es: " + b);

let n = 5;
n++;   // post-incremento: usa 5, luego n = 6
n--;   // post-decremento
++n;   // pre-incremento: primero suma, luego usa
--n;

let i = 1;
console.log(i++); // 1  (devuelve el valor ANTES de incrementar)
console.log(i);   // 2
console.log(++i); // 3  (incrementa y devuelve el nuevo valor)

// Potenciación o exponenciación
let potencia = a ** b;
console.log("La potenciación es: " + potencia);

/*
    1. ()  []  .           agrupación, acceso
    2. ++ -- ! typeof       unarios
    3. **                   exponenciación (derecha)
    4. * / %                multiplicativos
    5. + -                  aditivos
    6. < <= > >=            relacionales
    7. == != === !==        igualdad
    8. &&                   AND lógico
    9. || ??                OR / nullish
    10. ? :                 ternario
    11. = += -= ...         asignación (derecha)
    12. ,                   coma
*/