function verVentasRegistradas() {
    document.getElementById('contenedorTablaVentas').style.display = "block";
    document.getElementById('usuariosAdmin').style.display = "none";
    obtenerVentasPorVendedor();
    $.ajax({
        url: `http://localhost:8080/api/v1/detalleFactura`,
        method: 'GET',
        success: function(response) {
            //Respuesta exitosa
            if (response != null) {
                mostrarVentasPorUsuario(response);
                document.getElementById('fechaInicioAdm').value = "";
                document.getElementById('fechaFinAdm').value = "";
            } else {
                alert("No se encontraron facturas");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
        }
    });
}

function mostrarVentasPorUsuario(ventas) {
    let contenedor = document.getElementById('tablaVentas');
    let contenidoVentas = "";
    for (let i of ventas) {
        let vend = `<tr>
                      <td class="text-center" style="padding:0;">${i.factura.id}</td>
                      <td class="text-center" style="padding:0;">${i.producto.usuario.usuario_empresa}</td>
                      <td class="text-center" style="padding:0;">${i.producto.producto_nombre}</td>
                      <td class="text-center" style="padding:0;">${formatDateToDDMMYYYY(i.factura.fecha)}</td>
                      <td class="text-center" style="padding:0;">${i.cantidadComprado}</td>
                      <td class="text-center" style="padding:0;">$ ${i.valorUnidadCompra}</td>
                      <td class="text-center" style="padding:0;">$ ${i.valorUnidadCompra * i.cantidadComprado}</td>
                    </tr>`;
        contenidoVentas += vend;
    }
    contenedor.innerHTML = contenidoVentas;
}

function consultarProductosPorVendedoYFecha() {
    let fechaInicio = document.getElementById('fechaInicioAdm').value;
    let fechaFin = document.getElementById('fechaFinAdm').value;
    let usuarioSelected = document.getElementById('vendedoresSelect').value;

    if (usuarioSelected > 0) {
        $.ajax({
            url: `http://localhost:8080/api/v1/detalleFactura/FacturasFechasUsuario?idUsuario=${usuarioSelected}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
            method: 'GET',
            success: function(response) {
                //Respuesta exitosa
                if (response != null) {
                    mostrarVentasPorUsuario(response);
                } else {
                    alert("No se encontraron facturas");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Manejar errores de la solicitud
                console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            }
        });
    } else {
        $.ajax({
            url: `http://localhost:8080/api/v1/detalleFactura/FacturasFecha?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
            method: 'GET',
            success: function(response) {
                //Respuesta exitosa
                if (response != null) {
                    mostrarVentasPorUsuario(response);
                } else {
                    alert("No se encontraron facturas");
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                // Manejar errores de la solicitud
                console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            }
        });
    }

}

function obtenerVentasPorVendedor() {
    let selectVendedores = document.getElementById("vendedoresSelect");
    selectVendedores.innerHTML = "";
    let nuevaOpcion = document.createElement('option');
    nuevaOpcion.value = 0;
    nuevaOpcion.text = "Selecciona un vendedor";
    selectVendedores.add(nuevaOpcion);
    $.ajax({
        url: 'http://localhost:8080/api/v1/usuarios/rol/2',
        method: 'GET',
        success: function(response) {
            let vendedores = response;
            //Respuesta exitosa
            if (vendedores != null) {
                for (let i of vendedores) {
                    let nuevaOpcion = document.createElement('option');
                    nuevaOpcion.value = i.idUsuario;
                    nuevaOpcion.text = i.usuario_empresa;
                    selectVendedores.add(nuevaOpcion);
                }
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

function consultarProductosPorVendedor() {
    let select = document.getElementById('vendedoresSelect');
    let idSeleccionado = select.options[select.selectedIndex].value;
    console.log(idSeleccionado);
    if (idSeleccionado > 0) {
        obtenerProductosVendidos(idSeleccionado)
    };
}


function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

function botonBienvenida() {
    document.getElementById('contenedorTablaVentas').style.display = "none";
    document.getElementById('usuariosAdmin').style.display = "block";
}