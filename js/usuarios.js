//Get Vendedores
let usuarioModificado = false;
let estadoUsuario;
if (validarAdministrador()) {
    obtenerUsuarios();
    var modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
}

function obtenerUsuarios() {
    document.getElementById("usuariosRender").innerHTML = '';
    $.ajax({
        url: 'http://localhost:8080/api/v1/usuarios/rol/1',
        method: 'GET',
        success: function(response) {
            let usuarios = response;
            //Respuesta exitosa
            if (usuarios != null) {
                let contentUsuarios = "";
                for (let i of usuarios) {
                    let usuario = `
            <div class="col-md-6">
                <div class="dashboard-wrapper user-dashboard">
                <div class="media">
                <div class="pull-left">
                </div>
                <div class="media-body">
                    <h2 class="media-heading">${i.usuario_nombre} ${i.usuario_apellido}</h2>
                </div>
                </div>
                <div class="total-order mt-20">
                <h4>Datos del Usuario</h4>
                <div class="table-responsive">
                    <table class="table">
                    <thead>
                        <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Telefono</th>
                        <th>Correo</th>
                        <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                        <td>${i.idUsuario}</td>
                        <td>${i.usuario_nombre}</td>
                        <td>${i.usuario_apellido}</td>
                        <td>${i.usuario_telefono}</td>
                        <td>${i.usuario_email}</td>
                        <td>${i.estado.estado_descripcion}</td>
                        </tr>
                    </tbody>
                    </table>
                    <button onClick="editar(${i.idUsuario})" type="button" class="btn btn-main text-center btn-actualizar-usuario" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Actualizar</button>
                </div>
                </div>
                </div>
                </div>`;
                    contentUsuarios += usuario;
                }
                document.getElementById("usuariosRender").innerHTML = contentUsuarios;

            } else {
                alert("No se encontraron usuarios con este rol");
            }

        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
}


//Actualizar vendedor
let idEditar;

function editar(id) {
    //console.log(vendedor);
    idEditar = id;
    //cargar datos del vendedor
    $.ajax({
        url: 'http://localhost:8080/api/v1/usuarios/' + idEditar,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            $('#actualUsuario_nombres').val(response.usuario_nombre);
            $('#actualUsuario_apellidos').val(response.usuario_apellido);
            $('#actualUsuario_telefono').val(response.usuario_telefono);
            $('#actualUsuario_email').val(response.usuario_email);
            $('#actualUsuario_password').val(response.usuario_password);
            estadoUsuario = response.estado;
            usuarioAEditar = response;
            if (validarAdministrador()) {
                obtenerEstados();
            }
        }

    });
}

function obtenerEstados() {

    //consultar estados
    $.ajax({
        url: 'http://localhost:8080/api/v1/estados',
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            console.log(response);
            console.log(estadoUsuario);
            if (response != null) {

                $('#estadoSelect').empty();

                response.forEach(function(estado) {
                    if (estado.idEstado == estadoUsuario.idEstado) {
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
                    $('#estadoSelect').append(opcion);

                });
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener datos de estados:', error);
        }
    });
}

//Enviar formulario
$('#actualizarUsuario').submit(function(event) {
    event.preventDefault();

    let campos = {};
    campos.idUsuario = usuarioAEditar.idUsuario;
    campos.usuario_nombre = document.getElementById("actualUsuario_nombres").value;
    campos.usuario_apellido = document.getElementById("actualUsuario_apellidos").value;
    campos.usuario_telefono = document.getElementById("actualUsuario_telefono").value;
    campos.usuario_email = document.getElementById("actualUsuario_email").value;
    campos.usuario_password = document.getElementById("actualUsuario_password").value;
    campos.usuario_foto = "foto.png";
    campos.usuario_ventas = 0;
    campos.usuario_compras = 0;
    if (validarAdministrador()) {
        let rol = {};
        rol.idRol = 1;
        campos.rol = rol;

        let estado = {};
        estado.idEstado = document.getElementById("estadoSelect").value;
        campos.estado = estado;
    } else {
        campos.estado = user.estado;
        campos.rol = user.rol;
    }

    $.ajax({
        url: 'http://localhost:8080/api/v1/usuarios',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            if (response != null) {
                if (validarAdministrador()) {
                    obtenerUsuarios();
                    modal.hide();
                } else {
                    CrearUsuarioLocal(response);
                    closeForm();
                }

                alert("usuario actualizado");
            } else {
                alert("No se pudo actualizar");
            }
            console.log('Respuesta del servicio:', response);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
});

function resetForm() {
    document.getElementById('estadoSelect').selectedIndex = -1;
}

// buscador
function buscador() {
    let buscador = document.getElementById('buscadorVendedor');

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