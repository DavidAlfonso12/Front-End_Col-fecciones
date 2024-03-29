if (!window.location.href.includes('login.html') && !localStorage.getItem('loggedIn')) {
    window.location.href = '../../login.html';
}

function cerrarSesion() {

    localStorage.removeItem('loggedIn');
    localStorage.removeItem('nameUser');
    localStorage.removeItem('emailUser');
    localStorage.removeItem('rol');

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

if (window.location.href.includes('administrador.html') && user.rol.idRol != 4) {
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