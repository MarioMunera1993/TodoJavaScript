//se ejecuta almenos una vez

//Ideal para menús y validaciones

let opcion;

do {
  opcion = prompt("Elige 1, 2 o 3 (0 para salir):");
  console.log(`Elegiste: ${opcion}`);
} while (opcion !== "0");

console.log("Programa terminado");