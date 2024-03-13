var userName = localStorage.getItem('nameUser');

if(userName){
  document.getElementById("adminName").textContent = userName;
}

//cierre sesion


function cerrarSesion(){

  localStorage.removeItem('loggedIn');
  localStorage.removeItem('nameUser');
  localStorage.removeItem('emailUser');

  window.location.href = '../../../login.html';
}