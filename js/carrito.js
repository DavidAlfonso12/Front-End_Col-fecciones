//cart

let productosEnElCarrito = [];

function addCarrito(idProducto) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/productos/' + idProducto,
        method: 'GET',
        success: function(response) {
            let producto = response;

            //Respuesta exitosa
            if (producto != null) {
                console.log(producto);

                const nombreProducto = producto.producto_nombre;
                const precioProducto = producto.producto_precio;
                const product = {
                    id: producto.idProducto,
                    nombre: nombreProducto,
                    precio: precioProducto,
                    cantidad: 1
                }

                const existeProducto = productosEnElCarrito.find(item => item.id == producto.idProducto);

                if (existeProducto) {
                    existeProducto.cantidad++;
                } else {
                    productosEnElCarrito.push(product);
                }

                actualizarCarrito();
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });


}

function actualizarCarrito() {
    const contenedorDeProductos = document.getElementById('productosDelCarrito');


    contenedorDeProductos.innerHTML = '';

    let total = 0;

    productosEnElCarrito.forEach(item => {
        let itemElemento = document.createElement('div');
        itemElemento.className = 'media';
        itemElemento.innerHTML = `
        <a class="pull-left" href="#!">
                                        <img class="media-object" src="../../images/shop/cart/cart-1.jpg" alt="image" />
                                    </a>
                                    <div class="media-body">
                                        <h4 class="media-heading"><a href="#!">${item.nombre}</a></h4>
                                        <div class="cart-price">
                                            <span>${item.cantidad} x</span>
                                            <span>${item.precio}</span>
                                        </div>
                                        <h5><strong>$ ${item.precio * item.cantidad}</strong></h5>
                                    </div>
                                    <a class="remove" onclick="eliminarDelCarrito(${item.id})"><i class="tf-ion-close"></i></a>`;

        contenedorDeProductos.appendChild(itemElemento);

        total = item.precio * item.cantidad;
    });

    document.getElementById('totalCarrito').innerText = total.toFixed(2);
}

function eliminarDelCarrito(idProducto) {
    const productoIndex = productosEnElCarrito.findIndex(item => item.id === idProducto);

    if (productoIndex !== -1) {
        productosEnElCarrito[productoIndex].cantidad--;

        if (productosEnElCarrito[productoIndex].cantidad === 0) {
            productosEnElCarrito.splice(productoIndex, 1);
        }
    }

    actualizarCarrito();
}