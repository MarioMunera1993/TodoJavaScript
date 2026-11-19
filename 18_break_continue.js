for (let i = 0; i < 10; i++) {
  if (i === 3) continue; // salta esta iteración
  if (i === 7) break;    // termina el bucle
  console.log(i);        // 0 1 2 4 5 6
}