const {Schema,model}=require('mongoose');

const CategoriaSchema= Schema({
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
    usuario:{ //Necesito saber que usuario creó la categoría
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required:true
    }
});

CategoriaSchema.methods.toJSON = function() {
    const { __v, estado, ...data  } = this.toObject();
    return data;
}

module.exports=model('Categoria',CategoriaSchema);

