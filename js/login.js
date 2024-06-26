$('#loginForm').submit(function(event) {
    event.preventDefault();

    // Obtener los datos del formulario
    var formData = $(this).serialize();
    $.ajax({
        url: URL_SERVICE + 'usuarios/login?' + formData,
        method: 'GET',
        success: function(response) {
            // Manejar la respuesta exitosa

            if (response != null) {

                localStorage.setItem('loggedIn', 'true');
                CrearUsuarioLocal(response);

                if (response.estado.estado_descripcion !== "Activo") {
                    alert("Tu estado actual es: " + response.estado.estado_descripcion + " para cambiarlo comunicate con un administrador");
                } else {
                    if (response.rol.rolNombre === "Administrador") {
                        window.location.href = '../admin/administrador.html';
                    } else if (response.rol.rolNombre === "aliado") {
                        window.location.href = '../admin/aliado.html';
                    } else if (response.rol.rolNombre === "usuario" && localStorage.getItem('idProductoSeleccionado')) {
                        window.location.href = '../product-single.html';
                    } else if (response.rol.rolNombre === "usuario") {
                        window.location.href = '../index.html';
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