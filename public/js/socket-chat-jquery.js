//Funciones para renderizar usuarios

var params = new URLSearchParams(window.location.search);
var nombre = params.get('nombre')
var sala = params.get('sala')
//referencias de JQUERY

var divUsaurios = $('#divUsuarios')
var divChatbox = $('#divChatbox')
var formEnviar  = $('#formEnviar')
var txtMensaje  = $('#txtMensaje')

function renderizarUsuarios  (personas ){
    console.log ('renderizando ', personas)
    var html = ''
    html += '<li>';
    html +='    <a href="javascript:void(0)" class="active"> Chat de <span> '
    html += params.get('sala') + ' </span></a>';
    html +='</li>';

    for (i=0; i<personas.length; i++){
        var persona = personas [i];
        html += '<li>'
        html += '    <a data-id = "'+ persona.id + '" href="javascript:void(0)"><img src="assets/images/users/' + (i+1) + '.jpg" alt="user-img" class="img-circle"> <span>' + persona.nombre + ' <small class="text-success">online</small></span></a>'
        html += '</li>'
    }

    divUsaurios.html(html)

}


function renderizarMensajes (mensaje, from = 'other'){
    console.log ('renderizando mensaje')
    var chatRow = ''
    var fecha = new Date (mensaje.fecha)
    var hour = `${fecha.getHours()}:${fecha.getMinutes()}`
    if (mensaje.nombre === 'Administrador'){
        chatRow+= '<li class="animated fadeIn">'
        chatRow+= '    <div class="chat-content">'
        chatRow+= '        <h5>' +mensaje.nombre + '</h5>'
        chatRow+= '<div class="box bg-light-danger"> ' 
        chatRow+=           mensaje.mensaje + '</div>'
        chatRow+= '    </div>'
        chatRow+= '    <div class="chat-time">' + hour +'</div>'
        chatRow+= '</li>'
    }else{
        chatRow+= from == 'other' ? '<li class="animated fadeIn">' : '<li class="reverse" class="animated fadeIn">'
        chatRow+= '    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>'
        chatRow+= '    <div class="chat-content">'
        chatRow+= '        <h5>' +mensaje.nombre + '</h5>'
        chatRow+= from == 'other' ? '<div class="box bg-light-info"> '  : '<div class="box bg-light-inverse">' 
        chatRow+=           mensaje.mensaje + '</div>'
        chatRow+= '    </div>'
        chatRow+= '    <div class="chat-time">' + hour +'</div>'
        chatRow+= '</li>'
    }

    divChatbox.append(chatRow)
    scrollBottom()
}

//listeners 

divUsaurios.on('click','a', function (){
    var id = $(this).data('id')
    console.log (id)
})

 
formEnviar.on('submit', function (e){
    e.preventDefault()
    var text = txtMensaje.val().trim();
    console.log (text)
    if (text.length== 0){
        return
    }
    // Enviar información
    socket.emit('crearMensaje', {
        nombre: nombre,
        mensaje: text
    }, function(mensaje) {
        console.log('respuesta server: ', mensaje);
        txtMensaje.val('').focus()
        renderizarMensajes(mensaje, 'me')
    });

})

//scroll
function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    
    var clientHeight = divChatbox.prop('clientHeight');1
    console.log ('clientHeigth',clientHeight)
    var scrollTop = divChatbox.prop('scrollTop');
    console.log ('scrollTop', scrollTop)
    var scrollHeight = divChatbox.prop('scrollHeight');
    console.log ('scrollHeight', scrollHeight)
    var newMessageHeight = newMessage.innerHeight();
    console.log ('newMessageHeight', newMessageHeight)
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;
    console.log ('lastMessageHeight', lastMessageHeight)

    var sum = clientHeight + scrollTop + newMessageHeight + lastMessageHeight;
    console.log ("sum",sum)
    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}