(function($) {
    'use strict';

    // Preloader
    $(window).on('load', function() {
        $('#preloader').fadeOut('slow', function() {
            $(this).remove();
        });
    });


    // Instagram Feed
    if (($('#instafeed').length) !== 0) {
        var accessToken = $('#instafeed').attr('data-accessToken');
        var userFeed = new Instafeed({
            get: 'user',
            resolution: 'low_resolution',
            accessToken: accessToken,
            template: '<a href="{{link}}"><img src="{{image}}" alt="instagram-image"></a>'
        });
        userFeed.run();
    }

    setTimeout(function() {
        $('.instagram-slider').slick({
            dots: false,
            speed: 300,
            // autoplay: true,
            arrows: false,
            slidesToShow: 6,
            slidesToScroll: 1,
            responsive: [{
                    breakpoint: 1024,
                    settings: {
                        slidesToShow: 4
                    }
                },
                {
                    breakpoint: 600,
                    settings: {
                        slidesToShow: 3
                    }
                },
                {
                    breakpoint: 480,
                    settings: {
                        slidesToShow: 2
                    }
                }
            ]
        });
    }, 1500);


    // e-commerce touchspin
    $('input[name=\'product-quantity\']').TouchSpin();


    // Video Lightbox
    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });


    // Count Down JS
    $('#simple-timer').syotimer({
        year: 2022,
        month: 5,
        day: 9,
        hour: 20,
        minute: 30
    });

    //Hero Slider
    $('.hero-slider').slick({
        // autoplay: true,
        infinite: true,
        arrows: true,
        prevArrow: '<button type=\'button\' class=\'heroSliderArrow prevArrow tf-ion-chevron-left\'></button>',
        nextArrow: '<button type=\'button\' class=\'heroSliderArrow nextArrow tf-ion-chevron-right\'></button>',
        dots: true,
        autoplaySpeed: 7000,
        pauseOnFocus: false,
        pauseOnHover: false
    });
    $('.hero-slider').slickAnimation();

})(jQuery);
// Validiacion de rol para mensaje de bienvenida
if (localStorage.getItem('loggedIn') && user.rol.idRol != 2 && user.rol.idRol != 3) {
    MensajeBienvenida();
}

//Validacion de que no ha iniciado session para mensaje de bienvenida
// if (Object.keys(localStorage).length === 0) {
//     MensajeBienvenida();
// }
if (!localStorage.getItem('user')) {
    MensajeBienvenida();
}

// Borrar valiable de localstorage si no coincide la url
let urlActual = window.location.href;
if (urlActual.indexOf("product-single") === -1 && urlActual.indexOf("login") === -1) {
    localStorage.removeItem('idProductoSeleccionado');
}
//Mensaje bienvenida
function MensajeBienvenida() {
    let span = document.getElementById("nombreBienvenida");
    if (localStorage.getItem('loggedIn')) {
        span.innerText = user.usuario_nombre;
        document.getElementById('botonIniciarSesion').style.display = "none";
    } else {
        if (document.getElementById('botonCerrarSesion')) {

            span.innerText = 'Bienvenido';
            document.getElementById('botonCerrarSesion').style.display = "none";
        }
    }
}

//api

$('#registerVendedor').submit(function(event) {
    event.preventDefault();
    //Consumir api

    let rol = {};
    rol.idRol = 2;
    let estado = {};
    estado.idEstado = 1;
    let campos = {};

    campos.usuario_nombre = document.getElementById("ali_nombres").value;
    campos.usuario_apellido = document.getElementById("ali_apellidos").value;
    campos.usuario_telefono = document.getElementById("ali_telefono").value;
    campos.usuario_email = document.getElementById("ali_email").value;
    campos.usuario_password = document.getElementById("ali_password").value;
    campos.usuario_documento = document.getElementById("ali_documento").value;
    campos.usuario_empresa = document.getElementById("ali_nombre_empresa").value;
    campos.usuario_direccion = document.getElementById("ali_direccion").value;
    campos.usuario_descripcion = document.getElementById("ali_descripcion").value;
    campos.usuario_foto = "foto.png";
    campos.usuario_ventas = 0;
    campos.usuario_compras = 0;
    campos.estado = estado;
    campos.rol = rol;

    console.log(campos);

    $.ajax({
        url: 'http://localhost:8080/api/v1/usuarios',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            // Manejar la respuesta exitosa
            if (response != null) {
                alert("vendedor registrado");
            } else {
                alert("No se pudo registrar")
            }
            console.log('Respuesta del servicio:', response);
            // Puedes actualizar el DOM o mostrar un mensaje de éxito aquí
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            // Puedes mostrar un mensaje de error al usuario aquí
        }
    });
});


//Registrar usuario
$('#registerUsuario').submit(function(event) {
    event.preventDefault();

    let rol = {};
    rol.idRol = 1;
    let estado = {};
    estado.idEstado = 1;
    let campos = {};

    campos.usuario_nombre = document.getElementById("user_nombres").value;
    campos.usuario_apellido = document.getElementById("user_apellidos").value;
    campos.usuario_telefono = document.getElementById("user_telefono").value;
    campos.usuario_email = document.getElementById("user_email").value;
    campos.usuario_password = document.getElementById("user_password").value;
    campos.usuario_compras = 0;
    campos.estado = estado;
    campos.rol = rol;
    $.ajax({
        url: 'http://localhost:8080/api/v1/usuarios',
        method: 'POST',
        data: JSON.stringify(campos),
        contentType: 'application/json',
        success: function(response) {
            // Manejar la respuesta exitosa
            if (response != null) {
                alert("usuario registrado");
            } else {
                alert("No se pudo registrar")
            }
            console.log('Respuesta del servicio:', response);
            // Puedes actualizar el DOM o mostrar un mensaje de éxito aquí
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Manejar errores de la solicitud
            console.error('Error al realizar la solicitud:', textStatus, errorThrown);
            // Puedes mostrar un mensaje de error al usuario aquí
        }
    });
});

//============= Formulario para editar el perfil del vendedor ================ \\
function openForm() {
    document.getElementById("formContainer").style.display = "block";
}

function closeForm() {
    document.getElementById("formContainer").style.display = "none";
}
document.getElementById("openFormButton").addEventListener("click", openForm);


//============= Formulario para editar el producto del vendedor ================ \\



//============= Formulario para agregar productos del vendedor ================ \\
function openFormAddProducto() {
    document.getElementById('formAddProducto').style.display = "block";
}

function closeFormAddProducto() {
    document.getElementById('formAddProducto').style.display = "none";
}


document.getElementById("openFormAddProducto").addEventListener("click", openFormAddProducto);