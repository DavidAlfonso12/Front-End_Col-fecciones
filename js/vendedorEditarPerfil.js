let idEditar;

function editar(id){
  //console.log(vendedor);
  idEditar = id;
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
          if (estado.idEstado == estadoVendedor.idEstado) {
            var opcion = $('<option>', {
              value: estado.idEstado,
              text: estado.estado_descripcion,
              selected: true
            });
        }else{
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