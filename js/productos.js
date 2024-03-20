function obtenerCategorias() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/categorias',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response != null) {
                $('#productCategoria').empty();

                response.forEach(function(categoria) {
                    var opciones = $('<option>', {
                        value: categoria.idCategoria,
                        text: categoria.categoria_nombre
                    });
                    $('#productCategoria').append(opciones);
                });
            };
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener datos de estados:', error);
        }
    });
}

$('#addProductForm').submit(function(event) {
    event.preventDefault();
    let fechaHoraActual = new Date();
    let campos = {};

    let categoria = {};
    categoria.idCategoria = document.getElementById("productCategoria").value;

    let usuario = {};
    usuario.idUsuario = user.idUsuario;

    let estado = {};
    estado.idEstado = 1;

    campos.producto_nombre = document.getElementById('productName').value;
    campos.producto_descripcion = document.getElementById('productDescription').value;
    campos.producto_precio = document.getElementById('productPrice').value;
    campos.fecha_registro = convertirFecha(fechaHoraActual);
    campos.cantidad_disponible = document.getElementById('productCantidad').value;
    campos.cantidad_vendidos = 0;
    campos.usuario = usuario;
    campos.categoria = categoria;
    campos.estado = estado;

    $.ajax({
        url: 'http://localhost:8080/api/v1/productos',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            if (response != null) {
                convertirBase64(response);
            } else {
                alert("No se pudo registrar");
            }
            console.log('Respuesta del servicio:', response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            // Puedes mostrar un mensaje de error al usuario aquí
        }
    });

});

function guardarImagen(productoNuevo, base64Imagen) {
    let campos = {};
    campos.producto = productoNuevo;
    campos.imagen_base64 = base64Imagen;
    console.log(campos);
    $.ajax({
        url: 'http://localhost:8080/api/v1/imagenes',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {},
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            // Puedes mostrar un mensaje de error al usuario aquí
        }
    });
}

function convertirBase64(producto) {
    let inputImagen = document.getElementById('productImage');

    if (inputImagen.files && inputImagen.files[0]) {

        const lector = new FileReader();
        lector.onload = function(e) {
            let base64Imagen = e.target.result;
            guardarImagen(producto, base64Imagen);
        }
        lector.readAsDataURL(inputImagen.files[0]);
    }
    alert("Producto registrado");
    closeFormAddProducto();
}