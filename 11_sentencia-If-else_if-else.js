const temperatura = 28;

if (temperatura > 30) {
  console.log("Hace mucho calor");
} else if (temperatura >= 20) {
  console.log("Clima agradable");
} else if (temperatura >= 10) {
  console.log("Hace fresco");
} else {
  console.log("Hace frío");
}

//A tener en cuenta
// ❌ Anidamiento profundo (pirámide de la perdición)
function puedeComprar(usuario) {
  if (usuario) {
    if (usuario.activo) {
      if (usuario.saldo > 0) {
        return true;
      }
    }
  }
  return false;
}

// ✅ Guard clauses
function puedeComprar2(usuario) {
  if (!usuario) return false;
  if (!usuario.activo) return false;
  if (usuario.saldo <= 0) return false;
  return true;
}

//Siempre usa llaves {}, incluso para una línea. 
//Evita el bug clásico de goto fail: