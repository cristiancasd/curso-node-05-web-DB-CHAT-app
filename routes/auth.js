require('express-validator')
const { Router } = require("express");
const { check } = require('express-validator');
const { login, googleSignIn, renovarToken } = require("../controllers/auth");
const { validarJWT } = require("../middlewares");
const { validarCampos} = require("../middlewares/validar-campos");

const router=Router();

//SOCKETS
router.get('/', validarJWT,renovarToken)

 
router.post('/login',[
    check('correo','El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),      
    validarCampos
] ,login );//Si el correo y contraseña son datos correctos a login
                                          
router.post('/google',[
    check('id_token','id_token de google es necesario').not().isEmpty(),
     validarCampos
], googleSignIn) //Le pasamos el id_token de google, ya lo tenemos en nuestro backend, en nuestra req






module.exports= router

