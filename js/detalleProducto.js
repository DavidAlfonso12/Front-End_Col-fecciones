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
                document.getElementById('product-quantity').value = 1;
                document.getElementById('product-quantity').max = response.cantidad_disponible;
                document.getElementById('product-quantity').min = 1;
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
        let lista = obtenerLista();
        const product = {
            imagen: productoSeleccionado.imagenes[0].imagen_base64,
            id: productoSeleccionado.idProducto,
            nombre: productoSeleccionado.producto_nombre,
            precio: productoSeleccionado.producto_precio,
            cantidad_disponible: productoSeleccionado.cantidad_disponible,
            cantidad: document.getElementById('product-quantity').value
        }

        lista.push(product);
        guardarLista(lista);
        //document.getElementById("contactarVendedor").href = `https://wa.me/57${productoSeleccionado.usuario.usuario_telefono}?text=Buen día estoy interesado en el siguiente producto: ${productoSeleccionado.producto_nombre}, que vi en la plataforma de ColFecciones.`;
        window.location.href = '../checkout.html';
    } else {
        window.location.href = '../login.html';
    }
}