document.getElementById("usuarioNombre").textContent = user.usuario_nombre;

obtenerProductosRegistrados();

function obtenerProductosRegistrados() {
    document.getElementById("productosRegistrados").innerHTML = '';
    $.ajax({
        url: 'http://localhost:8080/api/v1/productos',
        method: 'GET',
        success: function(response) {
            let productos = response;
            //Respuesta exitosa
            if (productos != null) {
                let contentProductos = "";
                for (let i of productos) {

                    let producto = `
                    <div class="col-md-4" >
                            <div class="product-item " >
                                <div class="product-thumb">
                                    <span class="bage">Sale</span>
                                    <div id="imagenProducto_${i.idProducto}" class="contentImagenProducto"></div>
                                    <div class="preview-meta">
                                        <ul>
                                            <li>
                                                <span data-toggle="modal" data-target="#product-modal">
																								<i class="tf-ion-ios-search-strong" ></i>
																								</span>
                                            </li>
                                            <li>
                                                <a href="#!"><i class="tf-ion-ios-heart"></i></a>
                                            </li>
                                            <li>
                                                <a href="#!"><i class="tf-ion-android-cart"></i></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="product-content">
                                    <h4>${i.producto_nombre}</h4>
                                    <p class="price">$${i.producto_precio}</p>
                                </div>
                            </div>
                        </div>
                  `;
                    contentProductos += producto;
                }

                document.getElementById("productosRegistrados").innerHTML = contentProductos;
                mostrarImagenes(response);

            } else {
                let nullProductos = `
                  <p>No se encontraron Productos de este vendedor</p>
              `;
                contentProductos += nullProductos;
                //alert("No se encontraron Productos de este vendedor");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
}

function mostrarImagenes(productos) {
    for (let producto of productos) {
        let divImgContainer = document.getElementById("imagenProducto_" + producto.idProducto);
        for (let imagen of producto.imagenes) {
            let img = new Image();

            img.width = 80;
            img.src = imagen.imagen_base64;

            divImgContainer.appendChild(img);
        }
    }

}