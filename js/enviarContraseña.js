$('#recuperarContraseña').submit(function(event) {
    event.preventDefault();
    document.getElementById('emailEnviado').style.display = "block";

    let campos = {};
    campos.destinatario = document.getElementById('emailRecuperar').value;
    campos.asunto = "Recuperar contrasena Col-fecciones";
    campos.mensaje = "Estimado usuario su contraseña es: ";
    $.ajax({
        url: `http://localhost:8080/api/v1/emailPassword`,
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            //Respuesta exitosa
            if (response != null) {
                setTimeout(() => {
                    document.getElementById('emailEnviado').style.display = "none";
                }, 5000);
                document.getElementById('emailRecuperar').value = "";
            } else {
                alert("No se encontro el email");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            setTimeout(() => {
                document.getElementById('emailEnviado').style.display = "none";
            }, 5000);
        }
    });
})