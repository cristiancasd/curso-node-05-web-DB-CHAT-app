
const {Schema,model} = require('mongoose');

//Objetos con las caracteristicas del usuario
const VentaSchema = Schema({
    
    dia:{
        type:String,
        required:[true, 'la fecha es obligatorio'] 
    },
    fecha:{
        type:String,
        required:[true, 'la fecha es obligatorio'] 
    },

    arregloVentas:{
        type:Array,
        required:[true, 'El Vector es obligatorio']    
    },
    
    estado:{ //Cuando cree un usuario va a estar activado
        type:Boolean, 
        default:true// cuando se elimina el usuario pasa a false
    },
    
    
});

//Ocultar la clave y la versión de la respuesta del backend
//retornamos es información si se necesita
VentaSchema.methods.toJSON = function() {
    const {__v,_id, ...venta}=this.toObject();      //Retiramos el id , password, _v de la variable venta
    venta.uid=_id;                                            //renombro _id a uid
    return venta;
}

//MOnggole por defecto coloca por defecto a la colección
//una S ... es decir será Ventas
module.exports=model('Venta',VentaSchema);