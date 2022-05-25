const { Socket } = require("socket.io")
const { comprobarJWT } = require("../helpers/generarJWT")
const {ChatMensajes} = require("../models")

const chatMensajes= new ChatMensajes();
 

const socketController=async (socket=new Socket())=>{
    
    //Obtendo el usuario del token
    const token= socket.handshake.headers['c-token'] //c-token lo envío el front
    const usuario=await comprobarJWT(token)//Traigo usuario autenticado
    if(!usuario){//desconecto si no hay usuario
        return socket.disconnect(); 
    }

    //Agregar el usuario conectado
    chatMensajes.conectarUsuario(usuario);//modelo, agrego mi usuario al modelo
    socket.emit('usuarios-activos',chatMensajes.usuariosArr)//Emito usuarios conectados
    socket.broadcast.emit('usuarios-activos',chatMensajes.usuariosArr)
    socket.emit('recibir-mensajes', chatMensajes.ultimos10)//Emito arrelgo de chats

    //conectarlo a una sala especial
    socket.join(usuario.id) //Es una sala independiente, cada usuario va a tener la sala global y una privada con su id
    
    //Recibir mensaje y enviarlo a todos o privado
    socket.on('enviar-mensaje',({uid ,mensaje})=>{
        if(uid){    // Es un mensaje privado
            socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje})
        }else{
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje)//Agrego al arreglo el mensaje
            socket.emit('recibir-mensajes',chatMensajes.ultimos10)  //emito nuevo arreglo con el mensaje
            socket.broadcast.emit('recibir-mensajes',chatMensajes.ultimos10)
        }
    })

    // Limpiar cuando alguien se desconecta
    socket.on('disconnect',()=>{
        chatMensajes.desconectarUsuario(usuario.id);//Borro en el modelo el usuario
        socket.emit('usuarios-activos',chatMensajes.usuariosArr) //Emito nuevo arreglo
        socket.broadcast.emit('usuarios-activos',chatMensajes.usuariosArr)
    })

}

module.exports={
    socketController
}