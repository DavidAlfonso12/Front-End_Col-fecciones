//Get Vendedores
let listaVendedoresMostrados;
let vendedorModificado = false;
let estadoVendedor;
if (validarAdministrador()) {
    obtenerVendedores();
    var modal = new bootstrap.Modal(document.getElementById('staticBackdrop'));
}

function obtenerVendedores() {
    document.getElementById("vendedoresRender").innerHTML = '';
    $.ajax({
        url: `${URL_SERVICE}usuarios/rol/2`,
        method: 'GET',
        success: function(response) {
            let vendedores = response;
            //Respuesta exitosa
            if (vendedores != null) {
                let contentVendedores = "";
                for (let i of vendedores) {
                    let vend = `
                    <div class="col-md-6" id="usuario_${i.idUsuario}">
                    <div class="dashboard-wrapper user-dashboard">
                      <div class="media">
                        <div class="pull-left">
                          
                        </div>
                        <div class="media-body">
                          <p><h2 class="media-heading">${i.usuario_nombre} ${i.usuario_apellido}</h2></p>       
                        </div>
                      </div>
                      <div class="total-order mt-20">
                        <h4>Datos del Aliado</h4>
                        <div class="table-responsive">
                          <table class="table">
                            <thead>
                              <tr>
                                <th>ID</th>
                                <th>Documento</th>
                                <th>Email</th>
                                <th>Telefono</th>
                                <th>Descripcion</th>
                                <th>Estado</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>${i.idUsuario}</td>
                                <td>${i.usuario_documento}</td>
                                <td>${i.usuario_email}</td>
                                <td>${i.usuario_telefono}</td>
                                <td>${i.usuario_descripcion}</td>
                                <td>${i.estado.estado_descripcion}</td>
                              </tr>
                              
                            </tbody>
                            </table>
                            <button onClick="editar(${i.idUsuario})" type="button" class="btn btn-main text-center btn-actualizar-usuario" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Actualizar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                    `;
                    contentVendedores += vend;
                }
                listaVendedoresMostrados = vendedores;
                document.getElementById("vendedoresRender").innerHTML = contentVendedores;

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
    //cargar datos del vendedor
    $.ajax({
        url: `${URL_SERVICE}usuarios/` + id,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            $('#actualVendedor_nombres').val(response.usuario_nombre);
            $('#actualVendedor_documento').val(response.usuario_documento);
            $('#actualVendedor_apellidos').val(response.usuario_apellido);
            $('#actualVendedor_direccion').val(response.usuario_direccion);
            $('#actualVendedor_telefono').val(response.usuario_telefono);
            $('#actualVendedor_email').val(response.usuario_email);
            $('#actualVendedor_nombre_empresa').val(response.usuario_empresa);
            $('#actualVendedor_password').val(response.usuario_password);
            $('#actualVendedor_descripcion').val(response.usuario_descripcion);
            estadoVendedor = response.estado;
            vendedorAEditar = response;
            if (validarAdministrador()) {
                obtenerEstados();
            }
        }
    });
}

function obtenerEstados() {
    $.ajax({
        url: `${URL_SERVICE}estados`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response != null) {
                response.forEach(function(estado) {
                    if (estado.idEstado == estadoVendedor.idEstado) {
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
$('#actualizarVendedor').submit(function(event) {
    event.preventDefault();


    let campos = {};

    campos.idUsuario = vendedorAEditar.idUsuario;
    campos.usuario_nombre = document.getElementById("actualVendedor_nombres").value;
    campos.usuario_apellido = document.getElementById("actualVendedor_apellidos").value;
    campos.usuario_telefono = document.getElementById("actualVendedor_telefono").value;
    campos.usuario_email = document.getElementById("actualVendedor_email").value;

    let password = document.getElementById("actualVendedor_password").value;
    let mensaje = document.getElementById('mensaje');
    let mayusculas = /[A-Z]/.test(password);
    let minusculas = /[a-z]/.test(password);
    let numeros = /[0-9]/.test(password);
    let minCaracteres = password.length >= 6;

    campos.usuario_empresa = document.getElementById("actualVendedor_nombre_empresa").value;
    campos.usuario_direccion = document.getElementById("actualVendedor_direccion").value;
    campos.usuario_descripcion = document.getElementById("actualVendedor_descripcion").value;
    campos.usuario_foto = "foto.png";
    campos.usuario_ventas = 0;
    campos.usuario_compras = 0;
    if (validarAdministrador()) {
        campos.usuario_documento = document.getElementById("actualVendedor_documento").value;

        let rol = {};
        rol.idRol = 2;
        campos.rol = rol;

        let estado = {};
        estado.idEstado = document.getElementById("estadoSelect").value;
        campos.estado = estado;
    } else {
        campos.estado = user.estado;
        campos.rol = user.rol;
    }

    if (!mayusculas) {
        mensaje.textContent = 'La contraseña debe contener al menos una letra mayúscula.';
        mensaje.style.color = 'red';
    } else if (!minusculas) {
        mensaje.textContent = 'La contraseña debe contener al menos una letra minúscula.';
        mensaje.style.color = 'red';
    } else if (!numeros) {
        mensaje.textContent = 'La contraseña debe contener al menos un número.';
        mensaje.style.color = 'red';
    } else if (!minCaracteres) {
        mensaje.textContent = `La contraseña debe tener al menos 6 caracteres.`;
        mensaje.style.color = 'red';
    } else {
        campos.usuario_password = password;
        $.ajax({
            url: `${URL_SERVICE}usuarios`,
            method: 'POST',
            data: JSON.stringify(campos),
            contentType: 'application/json',
            success: function(response) {
                if (response != null) {
                    if (validarAdministrador()) {
                        obtenerVendedores();
                        modal.hide();
                    } else {
                        CrearUsuarioLocal(response);
                        document.getElementById("nombreVendedor").textContent = response.usuario_nombre;
                        closeForm();
                    }
                    alert("vendedor actualizado");
                } else {
                    alert("No se pudo actualizar")
                }
                console.log('Respuesta del servicio:', response);
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            }
        });
    }
});

function resetForm() {
    document.getElementById('estadoSelect').selectedIndex = -1;
}

// buscador
function buscador() {
    let buscador = document.getElementById('buscadorVendedor');

    buscador.addEventListener("input", function() {
        let textBuscador = buscador.value.toLowerCase();
        let listVendedores = listaVendedoresMostrados;

        for (let i of listVendedores) {
            const usuario = i.usuario_nombre.toLowerCase();
            if (usuario.includes(textBuscador)) {
                document.getElementById("usuario_" + i.idUsuario).style.display = "block";
            } else {
                document.getElementById("usuario_" + i.idUsuario).style.display = "none";
            }
        }
    });
}