const { response } = require("express");
const Categoria = require('../models/categoria');


require('colors')


//Obtengo todas las categorias
// ObtenerCategorias - paginado - total -poputale
const ObtenerCategorias=async (req, res=response) => {

    const {limite=115, desde=0}=req.query;
    
    const query={estado:true};
    
    const[total, categorias]=await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        categorias
    })
}

// obtenerCategoria por id- populate{}
const ObtenerCategoria=async(req, res=response) =>{
    const {id}=req.params;
    const categoria=await Categoria.findById(id).populate('usuario','nombre')
    res.json(categoria);
}



//actualizarCategoria
const actualizarCategoria =  async (req, res) =>{
                                                              
    const {id}=req.params;                     //Obtengo el ID del enlace, ya está validado
    const {estado, usuario, ...data}=req.body; //No piodemos actualizar el esatado ni el usuario. Solo la categoría                                                          
    
    data.nombre=data.nombre.toUpperCase();     //Nombre de la categoría en mayusculas
    data.usuario=req.usuario._id;              //Actualizo la categoría de dicho ID

    const categoria=await Categoria.findByIdAndUpdate(id, data, {new:true});

    res.json(categoria);

}


const crearCategoria= async (req, res=response) => {

    console.log('estoy en crear categoría'.blue)

    let nombre = req.body.nombre.toUpperCase();                   // Recibo nombre de la categoría
    console.log('categoria que quiero guardar'.green,nombre)


   /*
    const categoriaDb = await Categoria.findOne({nombre})
    console.log('categoriaDb  ', categoriaDb )
    if(categoriaDb){               
        console.log(`La categoría ${categoriaDb.nombre}, ya existe`)                            // Mensaje cuando la categoría existe
        return res.status(400).json({
            msg: `La categoría ${categoriaDb.nombre}, ya existe`
        });
    }
    */


    const data={                                                    // Objeto con categoría y ID usuario
        nombre,
        usuario:req.usuario._id
    }
    const categoria=new Categoria(data);

    await categoria.save();

    res.status(201).json(categoria);
}


//borrar categoría - estado:false
const categoriasDelete = async (req, res) =>{

    const {id} = req.params;
    
    const usuarioAutenticado=req.usuario;
    //No se recomienda porque se borra de manera permanente
    //const usuiario = await Usuario.findByIdAndDelete(id)

    //Cambio estado a false, por ende en el get no se retorna
    console.log('voy a borrar id'.red, id)
    const categoria=await Categoria.findByIdAndUpdate(id,{estado:false}) 
    res.json({categoria,usuarioAutenticado});
}

module.exports={
    crearCategoria,
    ObtenerCategorias,
    ObtenerCategoria,
    actualizarCategoria,
    categoriasDelete
}