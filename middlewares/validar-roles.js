const esAdminRole = (req,res,next)=>{
    if (!req.usuario){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin el token'
        })
    }
    const {rol,nombre}=req.usuario;
    if (rol!=='ADMIN_ROLE'){
        return res.status(401).json({
            msg: ('El usuario no es es administador' )
        })
    }
    req.usuario;
    next();
}


const tieneRole = (...roles)=>{                             //...roles, crea un arreglo con nombre role de todas las entradas
    return(req,res,next)=>{                                 
        if (!req.usuario){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin el token'
            })
        }
        if(!roles.includes(req.usuario.rol)){
            return res.status(401).json({
                msg:`El Role ${req.usuario.rol} no es autorizado, debe de de ser ${roles} `
            })
        }
        next()
    }
}
module.exports={
    esAdminRole,
    tieneRole
}


