let productosAComprar = [];
cargarProductosAComprar();

$('#formularioCompra').submit(function(event) {
    event.preventDefault();

    let campos = {};
    campos.idUsuario = user.idUsuario;
    campos.productos = productosAComprar;

    $.ajax({
        url: 'http://localhost:8080/api/v1/detalleFactura',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            // Manejar la respuesta exitosa
            if (response != null) {
                localStorage.getItem('productosEnElCarrito', JSON.stringify([]));
                location.href = "../confirmation.html";
                actualizarCarrito();
            } else {
                alert("No se pudo registrar");
            }
            console.log('Respuesta del servicio:', response);
            // Puedes actualizar el DOM o mostrar un mensaje de éxito aquí
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            // Puedes mostrar un mensaje de error al usuario aquí
        }
    });
});

function cargarProductosAComprar() {
    let contenedorDeProductos = document.getElementById('productosComprar');
    let totalCompra = 0;
    contenedorDeProductos.innerHTML = '';
    let producto = {};
    obtenerLista().forEach(item => {
        let itemElemento = document.createElement('div');
        itemElemento.innerHTML = `<a class="pull-left" style="width:30%;" href="product-single.html">
        <img class="media-object"  src="${item.imagen}" alt="Image" />
    </a>
    <div class="media-body">
        <h4 class="media-heading"><a href="product-single.html">${item.nombre}</a></h4>
        <p class="price">${item.cantidad} x $${item.precio} = $${item.precio * item.cantidad}</p>
        <span class="remove" onclick="eliminarDelCarrito(${item.id}); reload();">Eliminar</span>
    </div>`;
        producto.id = item.id;
        producto.cantidad = item.cantidad;
        producto.precio = item.precio;
        productosAComprar.push(producto);
        contenedorDeProductos.appendChild(itemElemento);
        producto = {};
        let totalProducto = item.cantidad * item.precio;
        totalCompra = totalCompra + totalProducto;
    });
    document.getElementById('full_name').value = user.usuario_nombre;
    document.getElementById('totalCompra').innerText = '$ ' + totalCompra.toFixed(1);
}

function reload() {
    location.reload();
}