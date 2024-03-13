//Get Vendedores
let vendedorModificado = false;
let estadoVendedor;
obtenerVendedores();
function obtenerVendedores(){
  $.ajax({
    url: 'http://localhost:8080/api/v1/usuarios/rol/2',
    method: 'GET',
    success: function(response){
      let vendedores = response;
      //Respuesta exitosa
      if(vendedores != null){
        let contentVendedores = "";
        for(let i of vendedores){
          let vend = `
          <div class="col-md-6">
          <div class="dashboard-wrapper user-dashboard">
            <div class="media">
              <div class="pull-left">
                
              </div>
              <div class="media-body">
                <p>Nombre: <h2 class="media-heading">${i.usuario_nombre}</h2></p>
                <p>Apellido: <h2 class="media-heading">${i.usuario_apellido}</h2></p>
                
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
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${i.idUsuario}</td>
                      <td>${i.usuario_documento}</td>
                      <td>${i.usuario_email}</td>
                      <td>${i.usuario_telefono}</td>
                      <td>${i.estado.estado_descripcion}</td>
                    </tr>
                    
                  </tbody>
                  </table>
                  <button onClick="editar(${i.idUsuario})" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Perfil</button>
              </div>
            </div>
          </div>
        </div>
          `;
  
          contentVendedores += vend;
        }
  
        document.getElementById("vendedoresRender").innerHTML = contentVendedores;
  
      }else{
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

function editar(id){
  //console.log(vendedor);
  idEditar = id;
  let estado;
  //cargar datos del vendedor
  $.ajax({
    url: 'http://localhost:8080/api/v1/usuarios/'+idEditar,
    method: 'GET',
    dataType: 'json',
    success: function(response){
      $('#actualVendedor_nombres').val(response.usuario_nombre);
      $('#actualVendedor_documento').val(response.usuario_documento);
      $('#actualVendedor_apellidos').val(response.usuario_apellido);
      $('#actualVendedor_direccion').val(response.usuario_direccion);
      $('#actualVendedor_telefono').val(response.usuario_telefono);
      $('#actualVendedor_email').val(response.usuario_email);
      $('#actualVendedor_nombre_empresa').val(response.usuario_empresa);
      $('#actualVendedor_password').val(response.usuario_password);
      estadoVendedor = response.estado;
      vendedorAEditar = response;
    }
    
  });
  
  //consultar estados
  $.ajax({
    url: 'http://localhost:8080/api/v1/estados',
    method: 'GET',
    dataType: 'json',
    success: function(response){
      console.log(response);
      console.log(estadoVendedor);
      if(response != null){

        $('#estadoSelect').empty();
        
        response.forEach(function(estado) {
          var opcion = $('<option>', {
            value: estado.idEstado,
            text: estado.estado_descripcion
        });
        if (estado.idEstado == estadoVendedor.idEstado) {
          opcion.prop('selected', true);
        }

        $('#estadoSelect').append(opcion);
          
        });
      }
    },
    error: function(xhr, status, error) {
        console.error('Error al obtener datos de estados:', error);
    }
  });

  //Enviar formulario
  $('#actualizarVendedor').submit(function(event) {
    event.preventDefault();
  
    let rol = {};
    rol.idRol = 2;
    let estado = {};
    estado.idEstado = document.getElementById("estadoSelect").value;
    let campos = {};
    
    campos.idUsuario = vendedorAEditar.idUsuario;
    campos.usuario_nombre = document.getElementById("actualVendedor_nombres").value;
    campos.usuario_apellido = document.getElementById("actualVendedor_apellidos").value;
    campos.usuario_telefono = document.getElementById("actualVendedor_telefono").value;
    campos.usuario_email = document.getElementById("actualVendedor_email").value;
    campos.usuario_password = document.getElementById("actualVendedor_password").value;
    campos.usuario_documento = document.getElementById("actualVendedor_documento").value;
    campos.usuario_empresa = document.getElementById("actualVendedor_nombre_empresa").value;
    campos.usuario_direccion = document.getElementById("actualVendedor_direccion").value;
    campos.usuario_foto = "foto.png";
    campos.usuario_ventas = 0;
    campos.usuario_compras = 0;
    campos.estado = estado;
    campos.rol = rol;
    
    $.ajax({
      url: 'http://localhost:8080/api/v1/usuarios',
      method: 'POST',
      data: JSON.stringify(campos),
      contentType: 'application/json',
      success: function(response) {
        if(response != null){
          document.getElementById("vendedoresRender").innerHTML = '';
          obtenerVendedores();
          alert("vendedor actualizado");
        }else{
          alert("No se pudo actualizar")
        }
        console.log('Respuesta del servicio:', response);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error('Error al realizar la solicitud:', textStatus, errorThrown);
      }
    });
  });

}

function reload(){
  if (vendedorModificado == true) {
    location.reload();
    vendedorModificado = false;
  }
}

