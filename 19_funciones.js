/**
 * Una función es un bloque de código con nombre que:
    1. Recibe datos de entrada (parámetros).
    2. Ejecuta una tarea.
    3. Devuelve un resultado (opcionalmente).
 */

//lo que recibe la funcion se llama parametros
function sumar(a , b){
    return a + b
}


//lo que se le manda a la funcion se llama argumerntos
let resultado = sumar(3, 5);
console.log(resultado);

//hay tres formas de declarar funciones
//(function declaration)
function sumar2(a, b) {
  return a + b;
}

//(function expression)
const sumar3 = function(a,b){
    return a + b;
}

console.log(sumar3(5,15));


//Arrow function
const sumar4 = (a,b)=>{
    return a + b;
}

console.log(sumar4(2,8));
