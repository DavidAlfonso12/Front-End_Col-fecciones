function obtenerProductosVendidos(idVendedor) {
    if (idVendedor) {
        $.ajax({
            url: `${URL_SERVICE}detalleFactura/FacturasVendedor/` + idVendedor,
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
        document.getElementById('filtrarFechas').style.display = "block";
        document.getElementById("tablaVendedor").innerHTML = '';
        $.ajax({
            url: `${URL_SERVICE}detalleFactura/FacturasVendedor/` + user.idUsuario,
            method: 'GET',
            success: function(response) {
                //Respuesta exitosa
                if (response != null) {
                    tablaProductos(response);
                    document.getElementById('fechaInicio').value = "";
                    document.getElementById('fechaFin').value = "";
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

function obtenerProductosVendidosFechas() {
    let idUsuario = user.idUsuario;
    let fechaInicio = document.getElementById('fechaInicio').value;
    let fechaFin = document.getElementById('fechaFin').value;

    $.ajax({
        url: `${URL_SERVICE}detalleFactura/FacturasFechasUsuario?idUsuario=${idUsuario}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`,
        method: 'GET',
        success: function(response) {
            //Respuesta exitosa
            if (response != null) {
                tablaProductos(response);
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

function tablaProductos(listaProductos) {
    document.getElementById("tablaVendedor").innerHTML = '';
    let contentproductos = "";

    let headerTabla = `<thead>
                <tr>
                  <th class="text-center">idFactura</th>
                  <th class="text-center">Nombre Del Producto</th>
                  <th class="text-center">Fecha Venta</th>
                  <th class="text-center">Cantidad Vendida</th>
                  <th class="text-center">Precio Unitario</th>
                  <th class="text-center">Total Venta</th>
                </tr>
              </thead>`;
    let tablaVacia = `<tbody>
                <tr>
                  <div class="text-center">No se encontrarón ventas</div>
                </tr>
              </tbody>`;
    contentproductos += headerTabla;
    if (listaProductos.length == 0) {
        contentproductos += tablaVacia;
    } else {
        for (let i of listaProductos) {
            let vend = `
                    <tbody>
                      <tr>
                        <td class="text-center" style="padding:0;">${i.factura.id}</td>
                        <td class="text-center" style="padding:0;">${i.producto.producto_nombre}</td>
                        <td class="text-center" style="padding:0;">${formatDateToDDMMYYYY(i.factura.fecha)}</td>
                        <td class="text-center" style="padding:0;">${i.cantidadComprado}</td>
                        <td class="text-center" style="padding:0;">$ ${i.valorUnidadCompra}</td>
                        <td class="text-center" style="padding:0;">$ ${i.valorUnidadCompra * i.cantidadComprado}</td>
                      </tr>
                    </tbody>
                `;
            contentproductos += vend;
        }
    }

    document.getElementById("tablaVendedor").innerHTML = contentproductos;
}

function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}