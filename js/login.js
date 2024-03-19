$('#loginForm').submit(function(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    var formData = $(this).serialize();
    $.ajax({
        url: 'http://localhost:8080/api/v1/usuarios/login?' + formData,
        method: 'GET',
        success: function(response) {
            // Manejar la respuesta exitosa

            if (response != null) {

                localStorage.setItem('loggedIn', 'true');
                CrearUsuarioLocal(response);

                if(response.estado.estado_descripcion !== "Activo"){
                    alert("Tu estado actual es: " + response.estado.estado_descripcion + " para cambiarlo comunicate con un administrador");
                }else{        
                    if (response.rol.rolNombre === "Administrador") {
                        window.location.href = '../php/login/administrador.html';
                    } else if (response.rol.rolNombre === "aliado") {
                        window.location.href = '../php/login/aliado.html';
                    } else if (response.rol.rolNombre === "usuario") {
                        window.location.href = '../php/login/usuario.html';
                    }; 
                }
            } else {
                alert("usuario no registrado");
            }
            //console.log('Respuesta del servicio:', response);
            // Puedes actualizar el DOM o mostrar un mensaje de éxito aquí
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            // Puedes mostrar un mensaje de error al usuario aquí
        }
    });
});