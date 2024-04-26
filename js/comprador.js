obtenerProductosRegistrados();

//Funcion para mostrar productos que se encuentras registrados y con estado activo
function obtenerProductosRegistrados(idCategoria, idVendedor) {
    document.getElementById("productosRegistrados").innerHTML = '';
    $.ajax({
        url: 'http://localhost:8080/api/v1/productos',
        method: 'GET',
        success: function(response) {
            let productos = response;

            //Respuesta exitosa
            if (productos != null) {
                let productosActivos = obtenerProductosFiltrados(productos, idCategoria, idVendedor);
                let contentProductos = "";

                for (let i of productosActivos) {
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
                                                <i class="tf-ion-ios-search-strong" ></i></span>
                                            </li>
                                            <li>
                                                <a href="#!"><i class="tf-ion-ios-heart"></i></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="product-content">
                                    <h4>${i.producto_nombre}</h4>
                                    <p class="price">$${i.producto_precio}</p>
                                </div>
                            </div>
                        </div>`;
                    contentProductos += producto;

                }
                document.getElementById("productosRegistrados").innerHTML = contentProductos;
                mostrarImagenes(productosActivos);
                if (idCategoriaSelecionada > 0 && !idVendedor > 0) {
                    mostrarVendedoresConCategorias(productosActivos);
                }
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
}

//filtrar lista
function obtenerProductosFiltrados(listaProductos, idCategoria, idVendedor) {
    console.log(listaProductos.length + ' ca: ' + idCategoria + ' idV: ' + idVendedor);
    let productosActivos = [];
    for (let i of listaProductos) {
        if (idVendedor > 0) {
            if (i.estado.idEstado === 1 && i.categoria.idCategoria === idCategoria && i.usuario.idUsuario === idVendedor) {
                productosActivos.push(i);
            }
        } else if (idCategoria > 0) {
            if (i.estado.idEstado === 1 && i.categoria.idCategoria === idCategoria) {
                productosActivos.push(i);
            }
        } else if (i.estado.idEstado === 1) {
            productosActivos.push(i);
        }
    }
    return productosActivos;
}



let idCategoriaSelecionada = 0;
//Funcion para mostrar productos con estado activo y de la categoria deseada
function obtenerProductosCategoria(idCategoria) {
    idCategoriaSelecionada = idCategoria;
    obtenerProductosRegistrados(idCategoriaSelecionada, 0);
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

categoriasProductosFiltros();

function categoriasProductosFiltros() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/categorias',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response != null) {
                $('#categoriasFiltro').empty();
                response.forEach(function(categoria) {
                    var filtro = $('<a>', {
                        text: categoria.categoria_nombre,
                        click: function() {
                            obtenerProductosCategoria(categoria.idCategoria);
                        }
                    });

                    var opcion = $('<li>').append(filtro);

                    $('#categoriasFiltro').append(opcion);
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener datos de categorias:', error);
        }
    });
}

function mostrarVendedoresConCategorias(listaProductos) {
    let listaUsuarios = [];
    let listaUsuariosSinRepetir = [];
    for (let i of listaProductos) {
        listaUsuarios.push(i.usuario);
    }

    listaUsuariosSinRepetir = listaUsuarios.filter((objeto, index, self) =>
        index === self.findIndex((t) => (
            t.idUsuario === objeto.idUsuario
        ))
    );
    filtrarVendedor(listaUsuariosSinRepetir);
}



function filtrarVendedor(listaVendedores) {
    $('#vendedorFiltro').empty();
    console.log(listaVendedores);
    listaVendedores.forEach(function(vendedor) {
        var filtro = $('<a>', {
            text: vendedor.usuario_nombre + " " + vendedor.usuario_apellido,
            click: function() {
                obtenerProductosRegistrados(idCategoriaSelecionada, vendedor.idUsuario);
            }
        });

        var opcion = $('<li>').append(filtro);

        $('#vendedorFiltro').append(opcion);
    });
}