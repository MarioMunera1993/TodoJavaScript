//Recorre claves (strings) de un objeto

const persona = { nombre: "Ana", edad: 30 };

for (const clave in persona) {
  console.log(`${clave}: ${persona[clave]}`);
}