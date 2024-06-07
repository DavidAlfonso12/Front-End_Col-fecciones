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
                mostrarImagen(response);
                verVendedor();
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener datos de estados:', error);
        }
    });
}


function verVendedor() {
    let contenidoVendedor = `
    <li class="media " style="padding: 0 2rem;">
        <div class="media-body ">
            <div class="comment-info">
                <h4 class="comment-author">
                    <a id="empresaVendedor">${productoSeleccionado.usuario.usuario_empresa}</a>
                </h4>
                <a class="comment-button" id="nombreVendedor">${productoSeleccionado.usuario.usuario_nombre + ' ' + productoSeleccionado.usuario.usuario_apellido}</a>
            </div>
            <p class="mt-5" id="descripcionVendedor">${productoSeleccionado.usuario.usuario_descripcion}</p>
        </div>
        <a target="_blank" class="btn btn-main" id="contactarVendedorProduct" onclick="contactarVendedor()">Contactar</a>
    </li>`;
    document.getElementById('contenidoAdicionalProducto').innerHTML = contenidoVendedor;
}

function formatearFecha(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function verComentarios() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/calificaciones/producto/' + productoSeleccionado.idProducto,
        method: 'GET',
        contentType: 'application/json',
        success: function(response) {
            if (response != null) {
                if (response.length == 0) {
                    document.getElementById('contenidoAdicionalProducto').innerHTML = "";
                    let comentario = `
                        <li class="media" style="padding: 0 2rem; ">
                            
                        <div class="media-body " style="margin:0 2rem;">
                            <h4 class="comment-author">
                                <a id="usuarioQueComento">No se encontraron comentarios de este producto</a>
                            </h4>
                        </div>
                        </li>`;
                    document.getElementById('contenidoAdicionalProducto').innerHTML += comentario;
                } else {
                    document.getElementById('contenidoAdicionalProducto').innerHTML = "";
                    let contenidoComentario;
                    for (let i of response) {
                        let comentario = `
                            <li class="media" style="padding: 0 2rem; ">
                                
                                <div class="media-body " style="margin:0 2rem;">
                                    <div class="comment-info">
                                        <h4 class="comment-author">
                                            <a id="usuarioQueComento">${i.usuario.usuario_nombre + " " + i.usuario.usuario_apellido}</a>
                                        </h4>
                                        <p style="margin:0 1rem;" id="fechaComentario">${formatearFecha(i.fecha)}</p>
                                    </div>
                                    <span class="mt-5" id="Comentario">${i.comentario}</span>
                                </div>
                                <hr style="border:1px solid #959595;">
                            </li>`;
                        document.getElementById('contenidoAdicionalProducto').innerHTML += comentario;
                    }

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
        window.location.href = '../checkout.html';
    } else {
        window.location.href = '../login.html';
    }
}

function contactarVendedor() {
    if (localStorage.getItem('user')) {
        document.getElementById("contactarVendedorProduct").href = `https://wa.me/57${productoSeleccionado.usuario.usuario_telefono}?text=Buen día estoy interesado en el siguiente producto: ${productoSeleccionado.producto_nombre}, que vi en la plataforma de ColFecciones.`;
    } else {
        window.location.href = '../login.html';
    }
}