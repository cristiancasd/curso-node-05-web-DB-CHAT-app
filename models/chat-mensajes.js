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

    get ultimos10(){
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get usuariosArr(){
        return Object.values(this.usuarios)
    }

    enviarMensaje(uid, nombre, mensaje){
        this.mensajes.unshift(
            new Mensaje(uid, nombre, mensaje)
        )
    }

    conectarUsuario(usuario){
        this.usuarios[usuario.id] = usuario
    }

    desconectarUsuario(id){
        console.log('Estoy en desconectar usuario', id)
        delete this.usuarios[id];
    }
}

// No se exporta la clase Mensajes ya que solo se usa aquí, es decir es una clase privada
module.exports= ChatMensajes