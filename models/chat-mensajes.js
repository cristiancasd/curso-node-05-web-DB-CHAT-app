class Mensaje{
    constructor(uid, nombre, mensaje){
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
    }
}

class ChatMensajes{
    constructor(){
        this.mensajes = [];
        this.usuarios = {}
    }

    get ultimos10(){ //Se usa cargar los chats
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usuariosArr(){ //Se usa para ver los usuarios conectados al chat
        return Object.values(this.usuarios)
    }

    enviarMensaje(uid, nombre, mensaje){//Creo mensaje
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
        )
    }

    conectarUsuario(usuario){//Agrego usuario conectado al arreglo
        this.usuarios[usuario.id] = usuario
    }

    desconectarUsuario(id){//Elimino del arreglo el usuario que se desconecta
        console.log('Estoy en desconectar usuario', id)
        delete this.usuarios[id];
    }
}

// No se exporta la clase Mensajes ya que solo se usa aquí, es decir es una clase privada
module.exports= ChatMensajes