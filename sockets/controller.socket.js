const { Socket } = require("socket.io")
const { comprobarJWT } = require("../helpers/generarJWT")
const {ChatMensajes} = require("../models")

const chatMensajes= new ChatMensajes();

const socketController=async (socket=new Socket())=>{
    //console.log('cliente conectado',socket.id)
    const token= socket.handshake.headers['c-token']
    //console.log('voy a comprobar token desde el backend')
    const usuario=await comprobarJWT(token)
    //console.log('voy a comprobar usuario desde el backend',usuario)
    if(!usuario){       
        return socket.disconnect();
    }

    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);
    socket.emit('usuarios-activos',chatMensajes.usuariosArr)
    socket.broadcast.emit('usuarios-activos',chatMensajes.usuariosArr)
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)

    //conectarlo a una sala especial
    socket.join(usuario.id) //Es una sala independiente, cada usuario va a tener la sala global y una privada con su id


    // Limpiar cuando alguien se desconecta
    socket.on('disconnect',()=>{
        chatMensajes.desconectarUsuario(usuario.id);
        socket.emit('usuarios-activos',chatMensajes.usuariosArr)
        socket.broadcast.emit('usuarios-activos',chatMensajes.usuariosArr)
    })
    


    socket.on('enviar-mensaje',({uid ,mensaje})=>{
        console.log('en controller, enviar mensaje');
        console.log(mensaje);

        if(uid){    // Es un mensaje privado
            socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje})
        }else{
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)
            socket.emit('recibir-mensajes',chatMensajes.ultimos10)    
            socket.broadcast.emit('recibir-mensajes',chatMensajes.ultimos10)
        }
    })

}

module.exports={
    socketController
}