const { response } = require("express");
const Producto = require('../models/producto');
const Categoria = require('../models/categoria');


require('colors')


//Obtengo todas las categorias
// ObtenerCategorias - paginado - total -poputale
const ObtenerProductos=async (req, res=response) => {

    const {limite=115, desde=0}=req.query;
    
    const query={estado:true};
    
    const[total, productos]=await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('categoria','nombre')
            .populate('usuario','nombre')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })
}

// obtenerCategoria por id- populate{}
const ObtenerProductoID=async(req, res=response) =>{
    const {id}=req.params;
    const producto=await Producto.findById(id).populate('usuario','nombre')
    res.json(producto);
}

//actualizarCategoria
const actualizarProducto =  async (req, res) =>{
                                                              
    const {id}=req.params;                     //Obtengo el ID del enlace, ya está validado
    const {estado, usuario, ...data}=req.body; //No piodemos actualizar el esatado ni el usuario. Solo la categoría                                                          
    
    data.nombre=data.nombre.toUpperCase();     //Nombre de la categoría en mayusculas
    data.usuario=req.usuario._id;              //Actualizo la categoría de dicho ID

    const producto=await Producto.findByIdAndUpdate(id, data, {new:true});

    res.json(producto);

}

const crearProducto= async (req, res=response) => {

    console.log('estoy en crear producto'.blue)

    //
    let  {estado, usuario, nombre, categoria, ...resto}=req.body
    
     nombre = nombre.toUpperCase();                   // Recibo nombre de la categoría
     categoria = categoria.toUpperCase();    
                   // Recibo nombre de la categoría
       
    console.log('Producto que quiero guardar'.green,nombre)

    console.log('voy a buscar la categoria '.green,categoria)
    const categoriaDb = await Categoria.findOne({nombre:categoria})

    console.log('categoriaDb  ', categoriaDb )
 
    const data={          
                                                  // Objeto con categoría y ID usuario
        nombre,
        ...resto,
        usuario:req.usuario._id,
        categoria:categoriaDb
    }


    const producto=new Producto(data);

    await producto.save();

    res.status(201).json(producto);
}

//borrar producto - estado:false
const ProductoDelete = async (req, res) =>{

    const {id} = req.params;
    
    const usuarioAutenticado=req.usuario;
    //No se recomienda porque se borra de manera permanente
    //const usuiario = await Usuario.findByIdAndDelete(id)

    //Cambio estado a false, por ende en el get no se retorna
    console.log('voy a borrar id'.red, id)
    const producto=await Producto.findByIdAndUpdate(id,{estado:false}) 
    res.json({producto,usuarioAutenticado});
}

module.exports={
    ObtenerProductos,
    ObtenerProductoID,
    actualizarProducto,
    crearProducto,
    ProductoDelete
}