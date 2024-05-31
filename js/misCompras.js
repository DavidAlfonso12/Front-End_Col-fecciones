const URL_PATH = "http://localhost:8080/api/v1/detalleFactura/usuario";
let productoCalificar;

function verCompras(idUsuario, repetir = false) {
    const contenedorCompras = document.getElementById('contenedorCompras');
    $.ajax({
        url: `${URL_PATH}/${idUsuario}`,
        method: 'GET',
        dataType: 'json',
        success: function (response) {
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
                    console.log(p);
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
                                            <button type="button" data-nombre="${p.producto_nombre}" data-imagen="${p.imagenes[0].imagen_base64}" data-descripcion="${p.producto_descripcion}" data-nombre-usuario="${p.imagenes[0].producto.usuario.usuario_empresa}" class="btn btn-main text-center btn-actualizar-usuario openModalBtn">Calificar Producto</button>
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
                
                btn.addEventListener('click', () =>{
                    let product = {
                        nombre: btn.getAttribute('data-nombre'),
                        descripcion: btn.getAttribute('data-descripcion'),
                        imagen: btn.getAttribute('data-imagen'),
                        vendedor: btn.getAttribute('data-nombre-usuario')
                    }
                    openModal(product.nombre, product.descripcion, product.imagen, product.vendedor);
                });
            });
        },
        error: function (xhr, status, error) {
            contenedorCompras.innerHTML = mostrarDescripcion("Error al traer los datos");
        }
    });
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
function openModal(nombreProducto, descripcion, imagen, vendedor) {
    document.getElementById('modalCalificacion').style.display = 'block';
    document.getElementById('nombreProductoCalificar').innerText = nombreProducto;
    document.getElementById('descripcionProductoCalificar').innerText = descripcion;
    document.getElementById('imagenProductoCalificar').src = imagen;
    document.getElementById('vendedorProductoComentado').innerText = vendedor;
}

// Obtener el modal
const modal = document.getElementById('modalCalificacion');

// Obtener el elemento <span> que cierra el modal
const span = document.getElementsByClassName('close')[0];

// Cuando el usuario haga clic en <span> (x), cerrar el modal
span.onclick = function() {
    modal.style.display = 'none';
}

// Cuando el usuario haga clic fuera del modal, cerrarlo
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Función para manejar el envío del formulario
function submitCalificacion() {
    const calificacion = document.getElementById('calificacion').value;
    const comentario = document.getElementById('comentario').value;

    // Aquí puedes hacer lo que necesites con los datos, como enviarlos a un servidor
    console.log('Calificación:', calificacion);
    console.log('Comentario:', comentario);
    console.log(document);

    // Cerrar el modal después de enviar los datos
    modal.style.display = 'none';
}

// Llamada inicial
verCompras(user.idUsuario, true);