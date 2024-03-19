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

if(window.location.href.includes('administrador.html') && user.rol.idRol != 4){
    cerrarSesion();
    alert('No tienes permiso para acceder a este sitio');
}