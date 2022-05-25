const { response } = require("express");
const {ObjectId}=require('mongoose').Types;
const Usuario=require('../models/usuario')
const Categoria=require('../models/categoria')
const Producto=require('../models/producto')


const coleccionesPermitidas=[
    'categorias',
    'productos',
    'roles',
    'usuarios'
];
const buscarUsuarios=async(termino='', res=response	)=>{
    console.log('estoy en buscarUsuario');
    let esMongoID=ObjectId.isValid(termino);
    console.log(esMongoID)
    if (esMongoID){
        const usuario=await Usuario.findById(termino);
        return res.json({
            results:(usuario) ? [usuario] : []
        })
    }
    // i es de insensible
    // Trae todos los resultados con termino similar
    const regex = new RegExp(termino,'i');    
    //const usuario=await Usuario.find({nombre:regex}) //solo buscar nombres
    const usuario=await Usuario.find({
        $or: [{nombre:regex},{correo:regex}], //varias opciones de busqueda
        $and: [{estado:true}]
    });

    //busca el termino exacto como se busque
    //const usuario=await Usuario.find({nombre:termino})
    console.log(usuario)
    res.json({
        results:usuario
    })
}
const buscarCategorias=async(termino='', res=response)=>{
    console.log('estoy en buscarCategoria');
    let esMongoID=ObjectId.isValid(termino);
    console.log(esMongoID)
    if (esMongoID){
        console.log('mongoID es ..'.yellow,termino)
        const categoria=await Categoria.findById(termino);
        console.log('categoria es ..'.yellow,categoria)
        return res.json({
            results:(categoria) ? [categoria] : []
        })
    }  
    const regex = new RegExp(termino,'i');    
    const categoria=await Categoria.find({
        $or: [{nombre:regex}], //varias opciones de busqueda
        $and: [{estado:true}]
    });
    console.log(categoria)
    res.json({
        results:categoria
    })
}
const buscarProductos=async(termino='', res=response)=>{
    console.log('estoy en buscarProductos');
    let esMongoID=ObjectId.isValid(termino);
    console.log(esMongoID)
    if (esMongoID){
        const producto=await Producto.findById(termino)
                            .populate('categoria','nombre');
        return res.json({
            results:(producto) ? [producto] : []
        })
    }  
    const regex = new RegExp(termino,'i');    
    const producto=await Producto.find({
        $or: [{nombre:regex}], //varias opciones de busqueda
        $and: [{estado:true}]
    })
    .populate('categoria','nombre');
    console.log(producto)
    res.json({
        results:producto
    })
}
const buscar=async (req,res=response)=>{   
    const {coleccion,termino}=req.params;
    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    switch(coleccion){
        case 'usuarios':
            buscarUsuarios(termino,res);
        break;
        case 'categorias':
            buscarCategorias(termino,res)
        break;
        case 'productos':
            buscarProductos(termino,res)
        break;
        default:
            res.status(500).json({  //status 500 es un problema del servidor-backend
                msg:'Se le olvidó hacer esta busqueda'
            })
    }
}
module.exports={
    buscar
}