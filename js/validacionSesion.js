if (!localStorage.getItem('loggedIn')) {
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