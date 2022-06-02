const { validationResult } = require("express-validator");


const validarCampos=(req,res,next)=>{               //Recoge los errores y los manifiesta o deja pasar en caso que no haya errores
    console.log('estoy en validar campos')
    const errors=validationResult(req);    
    if (!errors.isEmpty()){
        return res.status(400).json(errors);
    }
    next();         
}

module.exports={
    validarCampos
}
    
    
