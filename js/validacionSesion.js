urlActual = window.location.href;

function cerrarSesion() {
    localStorage.clear();
    window.location.href = '../../../login.html';
}


var user = JSON.parse(localStorage.getItem('user'));

function validarAdministrador() {
    return user.rol.idRol == 4;
}

function CrearUsuarioLocal(usuario) {
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(usuario));
}
if (urlActual.includes('administrador.html') && !user) {
    cerrarSesion();
    alert('No tienes permiso para acceder a este sitio');
} else if (urlActual.includes('administrador.html') && user.rol.idRol != 4) {
    cerrarSesion();
    alert('No tienes permiso para acceder a este sitio');
}
if (urlActual.includes('administradorali.html') && !user) {
    cerrarSesion();
} else if (urlActual.includes('administradorusu.html') && user.rol.idRol != 4) {
    cerrarSesion();
}

if (window.location.href.includes('aliado.html') && !user) {
    cerrarSesion();
    alert('No tienes permiso para acceder a este sitio');
} else if (window.location.href.includes('aliado.html') && user.rol.idRol != 2) {
    cerrarSesion();
    alert('No tienes permiso para acceder a este sitio');
}

if (window.location.href.includes('usuario.html') && !user) {
    cerrarSesion();
    alert('No tienes permiso para acceder a este sitio');
} else if (window.location.href.includes('usuario.html') && user.rol.idRol != 1) {
    cerrarSesion();
    alert('No tienes permiso para acceder a este sitio');
}

function convertirFecha(fecha) {
    // Obtener los componentes de la fecha y hora
    var año = fecha.getFullYear();
    var mes = fecha.getMonth() + 1; // Los meses en JavaScript van de 0 a 11, por lo que se suma 1
    var dia = fecha.getDate();
    var hora = fecha.getHours();
    var minuto = fecha.getMinutes();
    var segundo = fecha.getSeconds();

    // Formatear la fecha y hora en el formato java.time.LocalDateTime
    return año + '-' + pad(mes) + '-' + pad(dia) + 'T' + pad(hora) + ':' + pad(minuto) + ':' + pad(segundo);
};
// Función para añadir un cero delante de números menores de 10 (para mantener el formato)
function pad(num) {
    return (num < 10 ? '0' : '') + num;
}

let carrito = document.getElementById('carrito');

if (!user) {
    if (carrito) {

        carrito.style.display = "none";
    }
}