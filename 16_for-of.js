//Recorre valores de cualquier iterable

const lenguajes = ["JS", "Python", "Rust"];

for (const lenguaje of lenguajes) {
  console.log(lenguaje);
}

// Si necesitas el índice, usa el for clásico (ya visto)
for (let indice = 0; indice < lenguajes.length; indice++) {
  console.log(indice, lenguajes[indice]);
}