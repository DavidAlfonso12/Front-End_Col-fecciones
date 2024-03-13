var userName = localStorage.getItem('nameUser');

if(userName){
  document.getElementById("adminName").textContent = userName;
}

