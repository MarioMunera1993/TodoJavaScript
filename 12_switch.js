//compara con igualdad stricta (===) es necesario usar break

const dia = 8;
let nombreDia;

switch (dia) {
    case 1:
        nombreDia = "Lunes";
        break;
    case 2:
        nombreDia = "Martes";
        break;
    case 3:
        nombreDia = "Miercoles";
        break;
    case 4:
        nombreDia = "Jueves";
        break;
    case 5:
        nombreDia = "Viernes";
        break;
    /*Se pone junto solo para mostrar que los case sepueden agrupar */
    case 6:
    case 7:
        nombreDia = "Fin de semana";
        break;
    default:
        nombreDia = "debe ingresar un dia entre 1 / 7"
        break;
}

console.log(nombreDia);
