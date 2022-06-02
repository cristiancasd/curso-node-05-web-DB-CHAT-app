const { response } = require("express");


const validarArchivoSubir=(req,res=response, next)=>{
    
    console.log('Estoy en validarArchivoSubir')
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        //console.log('request es .. ',req)
        
        res.status(400).json({msg:'No hay archivos que subir-validarArchivoSubir'});
        console.log('retorno por error')
      return;
    }
    next()//para que siga con el siguiente middlewares
}
module.exports={
    validarArchivoSubir
}
