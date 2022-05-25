const jwt = require('jsonwebtoken');
require('colors')

const Usuario = require('../models/usuario');

const validarJWT= async (req,res,next)=>{
    const token=req.header('c-token');
    console.log('token: ',token);

    if(!token){
         return res.status(401).json({
             msg:'No hay token en la petición'
         });
    }
    try{ 
        console.log('Estoy en el try validar-jwt.js');     
        //en el payload del token está el uid del usuairo, vamos a extraerlo
        const {uid}= jwt.verify(token,process.env.SECRETOPRIVATEKEY); //Verificar jwt correcto

        console.log('uid ......',uid);
        const usuario=await Usuario.findById(uid);
        
        console.log('usuario'.red,usuario)
        console.log('estado del usuario'.red,usuario.estado)
        
        if(!usuario){ // validar si el usuario existe, no solo es false, es que no esté en la base de datos
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BD'
            })
        }        
        if(!usuario.estado){ //validar si el usuario ya fue eliminado
            return res.status(401).json({
                msg: 'Token no válido - usuario ya fue eliminado'
            })
        }
        
        req.usuario=usuario;
        req.uid=uid; //agrego al request el uid
        next()
    }catch(error){
        console.log('estoy en el error'.green)
        console.log(error);
        res.status(401).json({
            msg:'Token no válido'
        })
        console.log('sigo en el error'.green)
    }
}

module.exports={
    validarJWT
}