let listaProductosMostrados;
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
                    <div class="col-md-4" id="producto_${i.idProducto}">
                            <div class="product-item " data-search="${i.producto_nombre}">
                                <div class="product-thumb ">
                                    <span class="bage">Sale</span>
                                    <div id="imagenProducto_${i.idProducto}" class="contentImagenProducto"></div>
                                    <div class="preview-meta">
                                        <ul>
                                            <li>
                                                <a onclick="verDetalle(${i.idProducto})"><i class="tf-ion-ios-search-strong" ></i></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div class="product-content">
                                    <h4 class="listaProducto">${i.producto_nombre}</h4>
                                    <p class="price">$${i.producto_precio}</p>
                                </div>
                            </div>
                        </div>`;
                    contentProductos += producto;

                }
                if (contentProductos === "") {
                    contentProductos = `<h2 class="nullProductos">No se encontrarón productos registrados</h2>`;
                }
                listaProductosMostrados = productosActivos;
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

function verDetalle(idProducto) {
    window.location.href = '../product-single.html';
    localStorage.setItem('idProductoSeleccionado', idProducto);
}

//filtrar lista
function obtenerProductosFiltrados(listaProductos, idCategoria, idVendedor) {
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
                        css:{
                            cursor: 'pointer'
                        },
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
    if (listaVendedores != "") {
        let listaDesplegableVendedores = `<div class="panel-heading" role="tab" id="headingTwo">
        <h4 class="panel-title">
            <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">Vendedores</a>
        </h4>
    </div>
    <div id="collapseTwo" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
        <div class="panel-body">
            <ul id="vendedorFiltro">
            </ul>
        </div>
    </div>`;

        document.getElementById('listaVendedores').innerHTML = listaDesplegableVendedores;
    }
    listaVendedores.forEach(function(vendedor) {
        var filtro = $('<a>', {
            text: vendedor.usuario_nombre + " " + vendedor.usuario_apellido,
            css:{
                cursor: 'pointer'
            },
            click: function() {
                obtenerProductosRegistrados(idCategoriaSelecionada, vendedor.idUsuario);
            }
        });

        var opcion = $('<li>').append(filtro);

        $('#vendedorFiltro').append(opcion);
    });
}


// buscador
function buscador() {
    let buscador = document.getElementById('buscadorProductos');

    buscador.addEventListener("input", function() {
        let textBuscador = buscador.value.toLowerCase();
        let listProductos = listaProductosMostrados;

        for (let i of listProductos) {

            const producto = i.producto_nombre.toLowerCase();
            if (producto.includes(textBuscador)) {
                document.getElementById("producto_" + i.idProducto).style.display = "block";
            } else {
                document.getElementById("producto_" + i.idProducto).style.display = "none";
            }
        }
    });
}