verCompras(user.idUsuario);

function verCompras(idUsuario) {
    let contenedorCompras = document.getElementById('contenedorCompras');
    $.ajax({
        url: 'http://localhost:8080/api/v1/detalleFactura/usuario/' + idUsuario,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            if (response.length === 0) {
                let itemElemento = document.createElement('div');
                itemElemento.className = "row row-content";

                let noCompras = `<div class="row text-center">
                    <div class="block">
                        <div style="height: 25%" class="product-list">
                            <h3>No has realizado ninguna compra aún.</h3>
                        </div>
                    </div>
                </div>`;
                itemElemento.innerHTML = noCompras;
                contenedorCompras.appendChild(itemElemento);
            }
            if (response != null) {
                for (let i of response) {
                    let itemElemento = document.createElement('div');
                    itemElemento.className = "row row-content";

                    let fechaISO = i.fecha;
                    let fecha = new Date(fechaISO);

                    const dia = fecha.getUTCDate();
                    const mes = fecha.getUTCMonth() + 1;
                    const year = fecha.getFullYear();

                    let fechaFormateada = `${dia} del mes ${mes} del año ${year}`
                    let span = document.createElement('span');
                    span.textContent = fechaFormateada;
                    span.className = "padding-fecha";
                    itemElemento.appendChild(span);

                    let ul = document.createElement('ul');
                    ul.id = 'factura_' + i.id;
                    itemElemento.appendChild(ul);
                    for (let p of i.productos) {
                        ul.innerHTML += `<li>
                      <div class="row" style="margin-bottom: 2rem; ">
                          <div class="block">
                              <div style="height: 25%" class="product-list">
                                  <div class="product-info col-md-1">
                                      <img style="width: 100%;" src="${p.imagenes[0].imagen_base64}" alt="">
                                  </div>
                                  <div class="col-md-6">
                                      <h4>${p.producto_nombre}</h4>
                                      <p>Cantidad comprada</p>
                                  </div>
                                  <div class="col-md-5 text-center">
                                      <button class="btn btn-main">Calificar Producto</button>
                                  </div>
                              </div>
                          </div>
                      </div>
                      <hr style="border-top: 1px solid #333; width: 100%;">
                  </li>`;
                    }
                    contenedorCompras.appendChild(itemElemento);
                }
            }
        },
        error: function(xhr, status, error) {
            console.error('Error al obtener datos de categorias:', error);
        }
    });
}