const { io } = require('../server');
const { Usuarios} = require ('../classes/usuarios')
const { crearMensaje} = require ('../utilidades/utilidades')

const usuarios =  new Usuarios ();

io.on('connection', (client) => {

    client.on('disconnect', () => {
        let persona = usuarios.borrarPersona(client.id)
        client.broadcast.to(persona.sala).emit('crearMensaje',crearMensaje('Administrador', `${persona.nombre} Abandonó el chat`))
        client.broadcast.to(persona.sala).emit('listaPersonas', usuarios.getPersonasPorSala(persona.sala))
    })

    client.on ('entrarChat', (usuario,callback) =>{
        if (!usuario.nombre || !usuario.sala){
            return callback ({
                error: true,
                mensaje : 'El nombre y la sala son necesarios'
            })
        }
        let sala = usuario.sala;
        usuarios.agregarPersona (client.id, usuario.nombre,sala)
        let personas = usuarios.getPersonasPorSala(sala);
        client.join(sala)
        client.broadcast.to(sala).emit('listaPersonas', personas)
        client.broadcast.to(sala).emit('crearMensaje',crearMensaje('Administrador', `${usuario.nombre} se unió el chat`))
        return callback ({
            error : false,
            personas
        })
    })

    client.on ('crearMensaje', (data, callback) =>{
        let persona = usuarios.getPersona(client.id)
        let mensaje = crearMensaje(persona.nombre, data.mensaje)
        client.broadcast.to(persona.sala).emit ('crearMensaje', mensaje)
        callback (mensaje)
    })

    //mensajes privados
    client.on ('mensajePrivado', (data, callback) =>{
        let persona     = usuarios.getPersona( client.id)
        client.broadcast.to(data.para).emit( 'mensajePrivado',crearMensaje(persona.nombre, data.mensaje) )
    })

});
