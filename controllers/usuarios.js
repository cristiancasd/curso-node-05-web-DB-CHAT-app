const bcryptjs=require('bcryptjs');
const { query } = require('express');
const { validationResult } = require('express-validator');
const Usuario=require('../models/usuario');
require('colors')

//const Usuario = require('../models/usuario');

const usuariosGet = async (req, res) =>{
    
    const{limite=5000, desde=0}=req.query;                   //recibo los parametros en el enlace
    
    /*
    const usuarios = await Usuario.find({estado:true}) //La condición retorna solo los que esten en true
        .skip(Number(desde))   //Metodo ya incluido
        .limit(Number(limite)) //Metodo ya incluido
    const total= await Usuario.countDocuments({estado:true});
    */

    //Es más optimo ya que se hacen los procesos paralelos
    const [total,usuarios] = await Promise.all([
        Usuario.countDocuments({estado:true}),
        Usuario.find({estado:true})                         //La condición retorna solo los que esten en true
            .skip(Number(desde))                             //Metodo ya incluido
            .limit(Number(limite))                           //Metodo ya incluido
    ]);
    
    res.json({                                                //La respuesta es una colección de dos respustas
        total,
        usuarios
    });
};

const usuariosPut =  async (req, res) =>{
                                                              
    const {id}=req.params;                                  //http://localhost:8080/api/usuarios/12  //id va a ser 12 
        
    const {_id, password, google,correo, ...resto}=req.body; //no podemos recibir _id nuevo ya que este no se puede actualizar, resto no contiene los datos ahí establecidos                                                           
    
    if (password){                                          //Encriptar contraseña       
        const salt = bcryptjs.genSaltSync();
        resto.password=bcryptjs.hashSync(password,salt)     //resto ahora incluye el password encriptado
    }    
    
    const usuario=await Usuario.findByIdAndUpdate(id,resto) //Actualiza los datos del id establecido

    res.json({    
        usuario
    });
}

const usuariosPost = async (req, res) =>{

    //Es ineficiente tener que pegar este códigp en todo lado para 
    //evitar erorres, vamos a optimizarlo
    //Este condicional lo vamos a hacer por medio del middlewest
    /*
    const errors=validationResult(req);    
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }*/ 

    //En postman en el body creo un objeto con nombre,edad
    //destructuro el body solo la información que me interesa
    //const body=req.body;

    console.log('voy a crar un usuario');
    const {nombre,correo,password, rol} = req.body
    const usuario=new Usuario({nombre,correo,password, rol});
    

    /*
    //Comprobar si el correo existe
    const existeEmail=await Usuario.findOne({correo});
    if(existeEmail){
        return res.status(400).json({
            msg:'El correo ya está registrado'
        })
    }
    */
    //Encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password=bcryptjs.hashSync(password, salt)
    console.log('contaseña encriptada');
    await usuario.save();
    console.log('Usuario salvado');
    
    res.json({
        msg:'post API',
        usuario
    });
    
    //Se puede destructurar
    /*const {nombre,edad}=req.body;
    res.json({
        msg:'post API',
        nombre,
        edad
    });*/
} 

const usuariosDelete = async (req, res) =>{

    const {id} = req.params;
    const uid=req.uid;
    const usuarioAutenticado=req.usuario;
    //No se recomienda porque se borra de manera permanente
    //const usuiario = await Usuario.findByIdAndDelete(id)

    //Cambio estado a false, por ende en el get no se retorna
    console.log('voy a borrar id'.red, id)
    const usuario=await Usuario.findByIdAndUpdate(id,{estado:false}) 
    res.json({usuario,usuarioAutenticado});
}

module.exports={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}