const URL_PATH = "http://localhost:8080/api/v1/detalleFactura/usuario";
const URL_PATH_RATING = "http://localhost:8080/api/v1/calificaciones/producto/";
let productoCalificar = {};

function verCompras(idUsuario, repetir = false) {
    const contenedorCompras = document.getElementById('contenedorCompras');
    $.ajax({
        url: `${URL_PATH}/${idUsuario}`,
        method: 'GET',
        dataType: 'json',
        success: function(response) {
            contenedorCompras.innerHTML = ''; // Limpiar el contenedor antes de agregar contenido nuevo

            if (!response || response.length === 0) {
                contenedorCompras.innerHTML = mostrarDescripcion("No has realizado ninguna compra aún.");
                return;
            }

            response.forEach(i => {
                const fecha = new Date(i.fecha);
                const fechaFormateada = `${fecha.getUTCDate()} del mes ${fecha.getUTCMonth() + 1} del año ${fecha.getFullYear()}`;

                let itemElemento = document.createElement('div');
                itemElemento.className = "row row-content";
                itemElemento.innerHTML = `
                    <span class="padding-fecha">${fechaFormateada}</span>
                    <ul id="factura_${i.id}"></ul>
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