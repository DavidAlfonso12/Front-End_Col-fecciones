// Función para manejar el envío del formulario
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

function guardarCalificacion() {
    let fechaActual = new Date()
    let campos = {};
    campos.calificacion = document.getElementById('calificacion').value;
    campos.comentario = document.getElementById('comentario').value;
    campos.fecha = convertirFecha(fechaActual);
    if (localStorage.getItem('idCalificacion') != null) {
        campos.id = localStorage.getItem('idCalificacion');
    }
    let usuario = {
        idUsuario: user.idUsuario
    }
    campos.usuario = usuario;

    let productoSelected = {
        idProducto: productoCalificar.idProducto
    }
    campos.producto = productoSelected;
    $.ajax({
        url: 'http://localhost:8080/api/v1/calificaciones',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            if (response != null) {
                alert("comentario enviado Gracias.");
                modal.style.display = 'none';
            } else {
                alert("No se pudo enviar el comentario");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
}


// Cerrar el modal después de enviar los datos

// ver calificaciones de producto\

function verCalificaciones(producto) {
    let sumaCalificaciones = 0;
    let promedioCalificacion = 0;
    $.ajax({
        url: 'http://localhost:8080/api/v1/calificaciones/producto/' + producto.idProducto,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            if (response != null) {
                for (let i of response) {
                    sumaCalificaciones = sumaCalificaciones + i.calificacion;
                }
                promedioCalificacion = sumaCalificaciones / response.length
                document.getElementById(`calificacionProducto_${producto.idProducto}`).innerText = promedioCalificacion.toFixed(1) + " ( " + response.length + " )";
            } else {
                alert("No se encontraron calificaciones");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
}

if (localStorage.getItem('idProductoSeleccionado')) {
    let sumaCalificaciones = 0;
    let promedioCalificacion = 0;
    $.ajax({
        url: 'http://localhost:8080/api/v1/calificaciones/producto/' + localStorage.getItem('idProductoSeleccionado'),
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            if (response != null) {
                for (let i of response) {
                    sumaCalificaciones = sumaCalificaciones + i.calificacion;
                }
                promedioCalificacion = sumaCalificaciones / response.length

                for (let s = 1; s <= promedioCalificacion; s++) {
                    let stars = `<i class="fa-solid fa-star" style="color: #FFD43B; font-size:2rem;"></i>`;
                    document.getElementById(`calificacionProducto`).innerHTML += stars;
                }
                if (response.length == 0) {
                    document.getElementById(`calificacionProducto`).display = "none";
                } else {
                    document.getElementById(`calificacionProducto`).innerHTML += " " + promedioCalificacion.toFixed(1) + ` (${response.length})`;
                }
            } else {
                alert("No se encontraron calificaciones");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
}