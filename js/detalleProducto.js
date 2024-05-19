let idProducto = localStorage.getItem('idProductoSeleccionado');
let productoSeleccionado;
obtenerDetalleProducto(idProducto);

function obtenerDetalleProducto(idProducto) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/productos/' + idProducto,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response != null) {
                productoSeleccionado = response;
                document.getElementById('nombreProducto').textContent = response.producto_nombre;
                document.getElementById('precioProducto').textContent = "$ " + response.producto_precio;
                document.getElementById('descripcionProducto').textContent = response.producto_descripcion;
                document.getElementById('categoriaProducto').textContent = response.categoria.categoria_nombre;
                document.getElementById('product-quantity').value = response.cantidad_disponible;
                document.getElementById('empresaVendedor').textContent = response.usuario.usuario_empresa;
                document.getElementById('nombreVendedor').textContent = response.usuario.usuario_nombre + ' ' + response.usuario.usuario_apellido;
                document.getElementById('descripcionVendedor').textContent = response.usuario.usuario_descripcion;
                mostrarImagen(response);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener datos de estados:', error);
        }
    });
}


function mostrarImagen(producto) {
    let divImgContainer = document.getElementById("imagenProductoDetalle");
    for (let imagen of producto.imagenes) {
        let img = new Image();

        img.width = 80;
        img.classList.add('imgDetalleProducto');
        img.src = imagen.imagen_base64;

        divImgContainer.appendChild(img);
    }
}

function comprarProducto() {
    if (localStorage.getItem('user')) {
        document.getElementById("contactarVendedor").href = `https://wa.me/57${productoSeleccionado.usuario.usuario_telefono}?text=Buen día estoy interesado en el siguiente producto: ${productoSeleccionado.producto_nombre}, que vi en la plataforma de ColFecciones.`;
    } else {
        window.location.href = '../login.html';
    }
}