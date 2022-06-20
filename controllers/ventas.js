const bcryptjs=require('bcryptjs');
const { query } = require('express');
const { validationResult } = require('express-validator');
const Venta=require('../models/venta');
require('colors')


const ventasGet = async (req, res) =>{
    console.log('estoy en ventasGet')

    const{limite=5000, desde=0}=req.query;                   //recibo los parametros en el enlace

    //Es más optimo ya que se hacen los procesos paralelos
    const [total,ventas] = await Promise.all([
        Venta.countDocuments({estado:true}),
        Venta.find({estado:true})                         //La condición retorna solo los que esten en true
            
    ]);

    
    
    res.json({                                                //La respuesta es una colección de dos respustas
        total,
        ventas
    });
};

const ventasPost = async (req, res) =>{

    

    //En postman en el body creo un objeto con nombre,edad
    //destructuro el body solo la información que me interesa
    //const body=req.body;

    console.log('voy a crar un arreglo de ventas');
    

    const {dia,arregloVentas,fecha,estado} = req.body

    console.log(dia,arregloVentas,fecha)

    const venta= new Venta({dia,arregloVentas,fecha});
    

    await venta.save();
    console.log('venta salvado');
    res.json({
        msg:'post API',
        venta
    });
    
} 


const actualizarVenta =  async (req, res) =>{
    console.log('recibo el request ..',req.params)                                                     
    const {id}=req.params;                     //Obtengo el ID del enlace, ya está validado
    const {estado, dia, fecha, ...data}=req.body; //No piodemos actualizar el esatado ni el usuario. Solo la categoría                                                          
    console.log('lo que guardo es  el request ..'.green,id, data, {new:true})     
    const venta=await Venta.findByIdAndUpdate(id, data, {new:true});
    res.json(venta);
}



module.exports={
    ventasGet,
    ventasPost  ,
    actualizarVenta  
}