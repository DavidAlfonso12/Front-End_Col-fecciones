actualizarCarrito();

function guardarLista(listaObjetos) {
    localStorage.setItem('productosEnElCarrito', JSON.stringify(listaObjetos));
}

function obtenerLista() {
    return JSON.parse(localStorage.getItem('productosEnElCarrito')) || [];
}

function addCarrito(idProducto) {
    let lista = obtenerLista();
    $.ajax({
        url: 'http://localhost:8080/api/v1/productos/' + idProducto,
        method: 'GET',
        success: function(response) {
            let producto = response;
            console.log(producto);
            //Respuesta exitosa
            if (producto != null) {

                const nombreProducto = producto.producto_nombre;
                const precioProducto = producto.producto_precio;
                const product = {
                    imagen: producto.imagenes[0].imagen_base64,
                    id: producto.idProducto,
                    nombre: nombreProducto,
                    precio: precioProducto,
                    cantidad_disponible: producto.cantidad_disponible,
                    cantidad: 1
                }
                console.log(product)
                const existeProducto = lista.find(item => item.id == producto.idProducto);

                if (existeProducto) {
                    const productoIndex = lista.findIndex(item => item.id === idProducto);
                    if (lista[productoIndex].cantidad <= product.cantidad_disponible) {
                        lista[productoIndex].cantidad++;
                        guardarLista(lista);
                    }
                } else {
                    lista.push(product);
                    guardarLista(lista);
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
    let valorPorProducto = 0;
    let total = 0;

    obtenerLista().forEach(item => {
        let itemElemento = document.createElement('div');
        itemElemento.className = 'media';
        itemElemento.innerHTML = `
        <a class="pull-left" href="#!">
                                        <img class="media-object" src="${item.imagen}" alt="image" />
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
        valorPorProducto = item.precio * item.cantidad;
        total = total + valorPorProducto;
    });

    document.getElementById('totalCarrito').innerText = total.toFixed(2);
    cambairTextCarrito();
    listarProductos();
}

function cambairTextCarrito() {
    let spanCarrito = document.getElementById('carrito_txt');
    if (obtenerLista().length > 0) {
        spanCarrito.style.color = 'red';
        spanCarrito.textContent = '' + obtenerLista().length;
    } else {
        spanCarrito.textContent = '';
    }
}

function eliminarDelCarrito(idProducto) {
    let lista = obtenerLista();
    const productoIndex = lista.findIndex(item => item.id === idProducto);

    if (productoIndex !== -1) {
        lista[productoIndex].cantidad--;

        if (lista[productoIndex].cantidad === 0) {
            lista.splice(productoIndex, 1);
        }
    }
    guardarLista(lista);

    actualizarCarrito();
}

function reload() {
    location.reload();
}

function listarProductos() {
    let contenidoDetalleCarrito = "";
    let totalValorCarrito = 0;
    let valorPorProducto = 0;
    for (let i of obtenerLista()) {
        let producto = `
                    <tr>
                        <td>
                            <div class="product-info">
                                <img width="80" src="${i.imagen}" alt="" />
                            </div>
                        </td>
                        <td>
                            <a>${i.nombre}</a>
                        </td>
                        <td>$ ${i.precio}</td>
                        <td><input type="number" style="width:30%; background-color:transparent; border:1px solid #6666;" value="${i.cantidad}"></input> </td>
                        <td>
                            <a class="product-remove" style="cursor: pointer;" onclick="eliminarDelCarrito(${i.id}); reload();">Eliminar</a>
                        </td>
                    </tr>`;
        contenidoDetalleCarrito += producto;
        valorPorProducto = i.precio * i.cantidad;
        totalValorCarrito = totalValorCarrito + valorPorProducto;
    }
    if (contenidoDetalleCarrito === "") {
        contenidoDetalleCarrito = `<h4 class="nullProductos">No se encontrarón productos en el carrito</h4>`;
    }
    document.getElementById("productosDetalleCarrito").innerHTML = contenidoDetalleCarrito;
    document.getElementById("totalDetalleCarrito").innerText = totalValorCarrito.toFixed(1);
}