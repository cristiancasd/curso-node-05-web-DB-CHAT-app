const { Socket } = require("socket.io")
const { comprobarJWT } = require("../helpers/generarJWT")
const {ChatMensajes} = require("../models")

const chatMensajes= new ChatMensajes();
 

const socketController=async (socket=new Socket())=>{
     
    //Obtendo el usuario del token
    const token= socket.handshake.headers['c-token'] //c-token lo envío el front
    let salat= socket.handshake.headers['salat'] //sala del front


    const usuario=await comprobarJWT(token)//Traigo usuario autenticado
    if(!usuario){//desconecto si no hay usuario
        return socket.disconnect(); 
    }

    

    
    //Agregar el usuario conectado
    chatMensajes.conectarUsuario({usuario,salat});//modelo, agrego mi usuario al modelo    
    
    //conectarlo a una sala especial
    socket.join(usuario.id) //Es una sala independiente, cada usuario va a tener la sala global y una privada con su id
    
    //Creo sala
    if(salat!=''){
        console.log('Condicional, estoy en sala',salat)
        socket.join(salat)        
        //Cambio la sala donde está conectado el usuario en el objeto Usuario
        chatMensajes.conectarUsuario({usuario,salat}); 
        //console.log('chatMensajes.usuariosArr',chatMensajes.usuariosArr)
        socket.emit('usuarios-activos',chatMensajes.usuariosArr)//Emito usuarios conectados a sala
        socket.broadcast.emit('usuarios-activos',chatMensajes.usuariosArr)
        
        try{//Emito los ultimos 10 mensajes de la sala
                
                if(chatMensajes.ultimos10Sala[salat] ){
                    socket.emit('recibir-mensajes',chatMensajes.ultimos10Sala[salat])  //emito nuevo arreglo con el mensaje
                }else{
                    socket.emit('recibir-mensajes',[{nombre:'',mensaje:'',sala:''}])  //emito nuevo arreglo con el mensaje
                }                
            

        }catch(err){ //Si no hay mensajes previos
            socket.emit('recibir-mensajes',[])  //emito nuevo arreglo con el mensaje
        }       

    }else{        
        socket.emit('usuarios-activos',chatMensajes.usuariosArr)//Emito usuarios conectados
        socket.broadcast.emit('usuarios-activos',chatMensajes.usuariosArr)
        socket.emit('recibir-mensajes', chatMensajes.ultimos10)//Emito arrelgo de chats
    }
     
    //Recibir mensaje y enviarlo a todos o privado
    socket.on('enviar-mensaje',({uid ,mensaje,salat})=>{
        if(uid){    // Es un mensaje privado
            //socket.to(uid).emit('mensaje-privado',{de: usuario.nombre, mensaje})
            socket.to(uid).emit('mensaje-privado',{usuario, mensaje})

        }else{
            
            chatMensajes.enviarMensaje(usuario.id, usuario.nombre, mensaje,salat)//Agrego al arreglo el mensaje
            console.log('la sala en enviar mensaje es ', salat)
            if(salat==''){ //Sala General
                socket.emit('recibir-mensajes',chatMensajes.ultimos10)  //emito nuevo arreglo con el mensaje
                //socket.broadcast.to(salat).emit('recibir-mensajes',chatMensajes.ultimos10)
                socket.broadcast.emit('recibir-mensajes',chatMensajes.ultimos10)
            }else{ // Es una sala diferente
                socket.broadcast.to(salat).emit('recibir-mensajes',chatMensajes.ultimos10Sala[salat])  //emito nuevo arreglo con el mensaje
                socket.emit('recibir-mensajes',chatMensajes.ultimos10Sala[salat])  //emito nuevo arreglo con el mensaje
            }
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