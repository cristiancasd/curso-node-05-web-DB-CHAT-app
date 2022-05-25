const {Schema,model}=require('mongoose');

const ProductoSchema= Schema({
    nombre:{
        type:String,
        required:[true,'el Nombre es obligatorio'],
        unique:true
    },
    estado:{
        type:Boolean,
        default:true,
        required:true
    },    
    precio:{
        type: Number,
        default:0
    },
    descripcion:{
        type:String,
        default:""
    },
    disponible:{
        type:String,
        default:true
    },
    img:{
        type:String
    },    
    categoria:{ //Necesito saber que usuario creó la categoría
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required:true
    },

    usuario:{ //Necesito saber que usuario creó la categoría
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true
    }
});

ProductoSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}

module.exports=model('Producto', ProductoSchema);


