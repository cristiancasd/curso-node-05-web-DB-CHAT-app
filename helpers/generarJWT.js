const jwt = require("jsonwebtoken");    //Paquete generar JWT
const Usuario=require('../models/usuario');
const generarJWT = (uid='') => {
    return new Promise((resolve, reject)=>{
        const payload={uid};
        //llave secreta que si alguien la conoce puede firmar tokens como si ustedes liohubieran creado en su backend
        //Por ende lo creo en mi .env

        //Instrucción para crear un JWT
        jwt.sign(payload,process.env.SECRETOPRIVATEKEY,{
            expiresIn: '4h'     // Escoger cuanto dura el JWT
        }, (err,token)=>{
            if(err){
                console.log(err)
                reject('NO se pudo generar el token')
            }else{
                resolve(token);
            }
        })
    })
}


//SOCKETS
const comprobarJWT = async(token='') => {
    //console.log('estoy en comprobar JWT'.yellow)
    //console.log('token ',token)
    try{
        if(token.length<10){
            return null;
        }
        const {uid}=jwt.verify(token,process.env.SECRETOPRIVATEKEY)
        //console.log('uid ',uid)
        const usuario       = await Usuario.findById(uid);
        //console.log('desde el helper');
       // console.log(usuario);
        if (usuario){
            if (usuario.estado){
                return usuario
            }else{ return null;}        
        }else{ return null;}

    }catch(err){
        return null;
    }
}

module.exports={
    generarJWT,
    comprobarJWT
}