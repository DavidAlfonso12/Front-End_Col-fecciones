function obtenerProductosVendidos() {
    document.getElementById("tablaVendedor").innerHTML = '';
    $.ajax({
        url: 'http://localhost:8080/api/v1/detalleFactura/FacturasVendedor/' + user.idUsuario,
        method: 'GET',
        success: function(response) {
            let productos = response;
            //Respuesta exitosa
            if (productos != null) {
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
                contentproductos += headerTabla;
                for (let i of productos) {
                    let vend = `
                    <tbody>
                      <tr>
                        <td class="text-center" style="padding:0;">${i.factura.id}</td>
                        <td class="text-center" style="padding:0;">${i.producto.producto_nombre}</td>
                        <td class="text-center" style="padding:0;">${formatDateToDDMMYYYY(i.factura.fecha)}</td>
                        <td class="text-center" style="padding:0;">${i.cantidadComprado}</td>
                        <td class="text-center" style="padding:0;">${i.valorUnidadCompra}</td>
                        <td class="text-center" style="padding:0;">${i.valorUnidadCompra * i.cantidadComprado}</td>
                      </tr>
                    </tbody>
                `;
                    contentproductos += vend;
                }
                document.getElementById("tablaVendedor").innerHTML = contentproductos;

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

function formatDateToDDMMYYYY(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}