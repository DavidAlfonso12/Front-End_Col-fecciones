const URL_PATH = "http://localhost:8080/api/v1/detalleFactura/usuario/";
const URL_PATH_RATING = "http://localhost:8080/api/v1/calificaciones/producto/";
let productoCalificar = {};
let facturas = [];

function verCompras(idUsuario, repetir = false) {
    const contenedorCompras = document.getElementById('contenedorCompras');
    $.ajax({
        url: `${URL_PATH}${idUsuario}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            contenedorCompras.innerHTML = ''; // Limpiar el contenedor antes de agregar contenido nuevo
            console.log(response);
            if (!response || response.length === 0) {
                contenedorCompras.innerHTML = mostrarDescripcion("No has realizado ninguna compra aún.");
                return;
            }
            facturas = response;
            response.forEach(i => {
                if (i.productos.length > 0) {
                    const fecha = new Date(i.fecha);
                    const fechaFormateada = `${fecha.getUTCDate()} del mes ${fecha.getUTCMonth() + 1} del año ${fecha.getFullYear()}`;

                    let itemElemento = document.createElement('div');
                    itemElemento.className = "row row-content";
                    itemElemento.innerHTML = `
                    <span class="padding-fecha">${fechaFormateada}</span>
                    <ul id="factura_${i.id}"></ul>
                    <a class="descargarFactura" onclick="generatePDF('${encodeURIComponent(JSON.stringify(i))}')"><strong>Descargar factura</strong></a>
                `;

                    const ul = itemElemento.querySelector(`#factura_${i.id}`);
                    i.productos.forEach(p => {
                        ul.innerHTML += `
                        <li>
                            <div class="row" style="margin-bottom: 2rem;">
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
                                            <button type="button" data-nombre="${p.producto_nombre}" data-imagen="${p.imagenes[0].imagen_base64}" data-nombre-usuario="${p.imagenes[0].producto.usuario.usuario_empresa}" onclick="ptc('${encodeURIComponent(JSON.stringify(p))}')" class="btn btn-main text-center btn-actualizar-usuario openModalBtn">Calificar Producto</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr style="border-top: 1px solid #333; width: 100%;">
                        </li>`;
                    });
                    contenedorCompras.appendChild(itemElemento);
                }


            });

            // Agregar eventos a los botones de abrir modal
            document.querySelectorAll('.openModalBtn').forEach(btn => {

                btn.addEventListener('click', () => {
                    let product = {
                        nombre: btn.getAttribute('data-nombre'),
                        imagen: btn.getAttribute('data-imagen'),
                        vendedor: btn.getAttribute('data-nombre-usuario')
                    }
                    openModal(product.nombre, product.imagen, product.vendedor);
                });
            });
        },
        error: function(xhr, status, error) {
            contenedorCompras.innerHTML = mostrarDescripcion("Error al traer los datos");
        }
    });
}

function ptc(encodedProduct) {
    let product = JSON.parse(decodeURIComponent(encodedProduct));
    productoCalificar.nombre = product.producto_nombre;
    productoCalificar.idProducto = product.idProducto;
    productoCalificar.imagen = product.imagenes[0].imagen_base64;
    productoCalificar.descripcion = product.producto_descripcion;
    productoCalificar.imagenes = product.imagenes;
}

function mostrarDescripcion(mensaje) {
    return `
        <div class="row row-content">
            <div class="row text-center">
                <div class="block">
                    <div style="height: 25%" class="product-list">
                        <h3>${mensaje}</h3>
                    </div>
                </div>
            </div>
        </div>`;
}

// Función para abrir el modal
function openModal(nombreProducto, imagen, vendedor) {
    document.getElementById('modalCalificacion').style.display = 'block';
    document.getElementById('nombreProductoCalificar').innerText = nombreProducto;
    document.getElementById('imagenProductoCalificar').src = imagen;
    document.getElementById('vendedorProductoComentado').innerText = vendedor;

    $.ajax({
        url: `${URL_PATH_RATING}${productoCalificar.idProducto}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            let calificacion = document.getElementById("calificacion");
            let comentario = document.getElementById("comentario");
            let found = false;

            response.forEach(i => {
                if (i.usuario.idUsuario == user.idUsuario) {
                    calificacion.value = i.calificacion;
                    comentario.value = i.comentario;
                    localStorage.setItem("idCalificacion", i.id);
                    found = true;
                    return false;
                }
            });

            if (!found) {
                localStorage.setItem("idCalificacion", null);
            }
        },
        error: function(xhr, status, error) {
            contenedorCompras.innerHTML = mostrarDescripcion("Error al traer los datos");
        }
    });
}

// Obtener el modal
const modal = document.getElementById('modalCalificacion');

// Obtener el elemento <span> que cierra el modal
const span = document.getElementsByClassName('close')[0];

// Cuando el usuario haga clic en <span> (x), cerrar el modal
span.onclick = function() {
    modal.style.display = 'none';
    document.getElementById('formCalificacion').reset();
}

// Cuando el usuario haga clic fuera del modal, cerrarlo
window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.getElementById('formCalificacion').reset();
        }
    }
    // Llamada inicial
verCompras(user.idUsuario, true);

function generatePDF(factura) {
    let facturaSeleccionada = JSON.parse(decodeURIComponent(factura));
    let total = 0;
    document.getElementById('fecha').innerText = formatearFecha(facturaSeleccionada.fecha);
    document.getElementById('numeroFactura').innerText = "Numero Factura: " + facturaSeleccionada.id;
    document.getElementById('nombreCliente').innerText = user.usuario_nombre + " " + user.usuario_apellido;
    document.getElementById('telefonoCliente').innerText = user.usuario_telefono;
    document.getElementById('direccion').innerText = facturaSeleccionada.direccion;

    let tabla = document.getElementById('bodyTablaFactura');
    let contenidoProductos = "";
    facturaSeleccionada.productos.forEach(producto => {
        let valorProducto = 0;
        let productoAgregarTabla = `<tr><td style="border: 1px solid black;">${producto.cantidad_vendidos}</td>
        <td style="border: 1px solid black;">${producto.producto_nombre}</td>
        <td style="border: 1px solid black;">$${producto.producto_precio}</td>
        <td style="border: 1px solid black;">$${producto.cantidad_vendidos * producto.producto_precio}</td></tr>`;
        contenidoProductos += productoAgregarTabla;
        valorProducto += producto.cantidad_vendidos * producto.producto_precio
        total += valorProducto;
    });
    tabla.innerHTML = contenidoProductos;

    document.getElementById('totalFactura').innerText = " $" + total;
    document.getElementById('factura').style.background = "#F8EDE3";
    const opt = {
        margin: 1,
        filename: 'factura.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf()
        .from(document.getElementById('factura'))
        .set(opt)
        .save('factura.pdf');
}

function formatearFecha(dateString) {
    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}