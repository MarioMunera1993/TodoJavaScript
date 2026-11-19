//Se usa cuando no sabes cuántas iteraciones harás

let intentos = 0;
const maxIntentos = 3;

while (intentos < maxIntentos) {
  console.log(`Intento ${intentos + 1}`);
  intentos++;
}

//Riesgo: si la condición nunca se vuelve falsa, tienes un bucle infinito que congela el navegador