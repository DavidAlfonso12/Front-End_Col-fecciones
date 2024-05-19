let estadoProducto;
let categoriaProducto;
let productoAEditar;
let fechaRegistro;
let productosMostrados;

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

function guardarImagen(productoNuevo, base64Imagen, idImagen) {
    let campos = {};
    if (idImagen && idImagen > 0) {
        campos.idImagen = idImagen;
    }

    campos.producto = productoNuevo;
    campos.imagen_base64 = base64Imagen;

    $.ajax({
        url: 'http://localhost:8080/api/v1/imagenes',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            idImagen = 0;
            closeFormUpdateProduct();
            obtenerProductosVendedor(user.idUsuario);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            // Puedes mostrar un mensaje de error al usuario aquí
        }
    });
}

function convertirBase64(producto, idImagen) {
    let inputImagen = document.getElementById('productImage');
    let inputUpdateImagen = document.getElementById('producto_imagen');

    if (inputImagen.files && inputImagen.files[0]) {

        const lector = new FileReader();
        lector.onload = function(e) {
            let base64Imagen = e.target.result;
            guardarImagen(producto, base64Imagen);
        }
        lector.readAsDataURL(inputImagen.files[0]);

        alert('Producto registrado');
        closeFormAddProducto();
        obtenerProductosVendedor(user.idUsuario);
    } else {
        alert('Producto registrado');
        closeFormAddProducto();
        obtenerProductosVendedor(user.idUsuario);
    }


    if (inputUpdateImagen.files && inputUpdateImagen.files[0]) {
        const lector = new FileReader();
        lector.onload = function(e) {
            let base64Imagen = e.target.result;
            guardarImagen(producto, base64Imagen, idImagen);
        }
        lector.readAsDataURL(inputUpdateImagen.files[0]);

    }
}

function obtenerEstadosProductos() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/estados',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response != null) {
                $('#estadoProducto').empty();
                response.forEach(function(estado) {
                    if (estado.idEstado == estadoProducto.idEstado) {
                        var opcion = $('<option>', {
                            value: estado.idEstado,
                            text: estado.estado_descripcion,
                            selected: true
                        });
                    } else {
                        var opcion = $('<option>', {
                            value: estado.idEstado,
                            text: estado.estado_descripcion
                        });
                    }
                    $('#estadoProducto').append(opcion);
                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener datos de estados:', error);
        }
    });
}

function obtenerCategoriasProductos() {
    $.ajax({
        url: 'http://localhost:8080/api/v1/categorias',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response != null) {
                $('#categoriaProducto').empty();
                response.forEach(function(categoria) {
                    if (categoria.idCategoria == categoriaProducto.idCategoria) {
                        var opcion = $('<option>', {
                            value: categoria.idCategoria,
                            text: categoria.categoria_nombre,
                            selected: true
                        });
                    } else {
                        var opcion = $('<option>', {
                            value: categoria.idCategoria,
                            text: categoria.categoria_nombre
                        });
                    }
                    $('#categoriaProducto').append(opcion);

                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener datos de estados:', error);
        }
    });
}
let idImagen = 0;

function openFormUpdateProduct(id) {
    document.getElementById("formEditarProductoContainer").style.display = "block";
    //cargar datos del vendedor
    $.ajax({
        url: 'http://localhost:8080/api/v1/productos/' + id,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            $('#producto_nombre').val(response.producto_nombre);
            $('#producto_precio').val(response.producto_precio);
            $('#producto_cant_disponible').val(response.cantidad_disponible);
            $('#producto_cant_vendido').val(response.cantidad_vendidos);
            $('#producto_descripcion').val(response.producto_descripcion);
            estadoProducto = response.estado;
            categoriaProducto = response.categoria;
            productoAEditar = response;
            fechaRegistro = response.fecha_registro;
            if (response.imagenes.length > 0) {
                idImagen = response.imagenes[0].idImagen;
            }
            obtenerEstadosProductos();
            obtenerCategoriasProductos();
        }
    });
}

function closeFormUpdateProduct() {
    document.getElementById("formEditarProductoContainer").style.display = "none";
    document.getElementById("producto_imagen").value = '';
}

$('#updateFormProduct').submit(function(event) {
    event.preventDefault();

    let campos = {};
    campos.idProducto = productoAEditar.idProducto;
    campos.producto_nombre = document.getElementById("producto_nombre").value;
    campos.producto_descripcion = document.getElementById("producto_descripcion").value;
    campos.producto_precio = document.getElementById("producto_precio").value;
    campos.cantidad_disponible = document.getElementById("producto_cant_disponible").value;
    campos.cantidad_vendidos = document.getElementById("producto_cant_vendido").value;
    campos.fecha_registro = fechaRegistro;

    let usuario = {};
    usuario.idUsuario = user.idUsuario;
    campos.usuario = usuario;

    let estado = {};
    estado.idEstado = document.getElementById("estadoProducto").value;
    campos.estado = estado;

    let categoria = {};
    categoria.idCategoria = document.getElementById("categoriaProducto").value;
    campos.categoria = categoria;


    $.ajax({
        url: 'http://localhost:8080/api/v1/productos',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            if (response != null) {
                convertirBase64(response, idImagen);
                alert("producto actualizado");
                closeFormUpdateProduct();
                obtenerProductosVendedor(user.idUsuario);
            } else {
                alert("No se pudo actualizar");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
});

function eliminarProducto(idProducto) {
    $.ajax({
        url: 'http://localhost:8080/api/v1/productos/' + idProducto,
        method: 'DELETE',
        success: function(response) {
            if (response != null) {
                alert("Producto Eliminado");
            } else {
                alert("No se pudo actualizar");
            }
            obtenerProductosVendedor(user.idUsuario);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
}

obtenerProductosVendedor(user.idUsuario);


function obtenerProductosVendedor(idVendedor) {
    document.getElementById("productosVendedor").innerHTML = '';
    $.ajax({
        url: 'http://localhost:8080/api/v1/productos/vendedor/' + idVendedor,
        method: 'GET',
        success: function(response) {
            let productos = response;
            //Respuesta exitosa
            if (productos != null) {
                console.log(productos);

                let contentProductos = "";
                for (let i of productos) {
                    let producto = `
                    <tr id="producto_${i.idProducto}">
                        <td class="product-thumb" >
                        <div width="80px" height="auto" id="imagenProducto_${i.idProducto}"></div>
                            </td>
                        <td class="product-details">
                            <h3 class="title">${i.producto_nombre}</h3>
                            <span><strong>Publicado: </strong><time>${i.fecha_registro}</time> </span>
                            <span class="status active"><strong>Estado:</strong>${i.estado.estado_descripcion}</span>
                            <span class="location"><strong>Disponibles:</strong>${i.cantidad_disponible}</span>
                            <span class="location"><strong>Precio:</strong>${i.producto_precio}</span>
                            <span class="location"><strong>Vendidos:</strong>${i.cantidad_vendidos}</span>
                        </td>
                        <td class="product-category"><span class="categories">${i.categoria.categoria_nombre}</span></td>
                        <td class="action" data-title="Action">
                            <div>
                                <ul class="list-inline justify-content-center">
                                    <li class="list-inline-item">
                                        <a class="edit" data-toggle="tooltip" data-placement="top" title="Edit">
                                            <i onclick="openFormUpdateProduct(${i.idProducto})" class="fa fa-pencil"></i>
                                        </a>
                                    </li>
                                    <li class="list-inline-item">
                                        <a class="delete" data-toggle="tooltip" data-placement="top" title="Delete" href="aliado.html">
                                            <i onclick="eliminarProducto(${i.idProducto})" class="fa fa-trash"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </td>
                    </tr>`;
                    contentProductos += producto;
                }
                productosMostrados = productos;

                document.getElementById("productosVendedor").innerHTML = contentProductos;
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

function buscadorProductVendedor() {
    let buscador = document.getElementById('buscadorProductVendedor');

    buscador.addEventListener("input", function() {
        let textBuscador = buscador.value.toLowerCase();
        let listProductos = productosMostrados;

        for (let i of listProductos) {
            const producto = i.producto_nombre.toLowerCase();
            if (producto.includes(textBuscador)) {
                document.getElementById("producto_" + i.idProducto).hidden = false;
            } else {
                document.getElementById("producto_" + i.idProducto).hidden = true;
            }
        }
    });
}