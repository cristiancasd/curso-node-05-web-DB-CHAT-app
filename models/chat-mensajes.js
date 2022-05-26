class Mensaje{
    //constructor(uid, nombre, mensaje, sala){
    constructor(uid, nombre, mensaje, sala){
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
        this.sala    = sala;
        //this.sala    = sala;
    }
}

class ChatMensajes{
    constructor(){
        this.mensajes = [];
        this.usuarios = {};
        this.salas = {};  

    }

    get ultimos10(){ //Se usa cargar los chats
        this.mensajes = this.mensajes.splice(0,10);
        return this.mensajes;
    }

    get ultimos10Sala(){ //Se usa cargar los chats        
        return this.salas;
    }

    get usuariosArr(){ //Se usa para ver los usuarios conectados al chat
        return Object.values(this.usuarios)
    }

    enviarMensaje(uid, nombre, mensaje,salat=''){//Creo mensaje
        
        if(salat==''){
                this.mensajes.unshift(
                new Mensaje(uid, nombre, mensaje,salat)
            )

        }else{ 
            if(this.salas[salat]){
                this.salas[salat]=[new Mensaje(uid, nombre, mensaje, salat),...this.salas[salat]]
                this.salas[salat] = this.salas[salat].splice(0,10);
                //console.log('if',this.salas)
            }else{
                this.salas[salat]=[new Mensaje(uid, nombre, mensaje, salat)]
                this.salas[salat] = this.salas[salat].splice(0,10);
                //console.log('else',this.salas)
            }
        }        
    }

    conectarUsuario({usuario,salat}){//Agrego usuario conectado al arreglo
        //console.log('============modelo=====================')
        //console.log(usuario)
        
        this.usuarios[usuario.id] = {usuario,salat}
        //console.log('estoy en conectar usuario',salat)
        //console.log(this.usuarios)
        this.salas[salat]=this.salas[salat];
        //console.log(this.salas);
    }

    desconectarUsuario(id){//Elimino del arreglo el usuario que se desconecta
        console.log('Estoy en desconectar usuario', id)
        delete this.usuarios[id];
    }
}

// No se exporta la clase Mensajes ya que solo se usa aquí, es decir es una clase privada
module.exports= ChatMensajes