require('express-validator')

const { Router } = require("express");
const { check } = require('express-validator');
const { usuariosGet, usuariosDelete, usuariosPost, usuariosPut } = require("../controllers/usuarios");
const { esRoleValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jws');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');
/*
const {
    validarCampos,
    validarJWT,
    esAdminRole,
    tieneRole
}= require('../middlewares/index');
*/

const Role = require('../models/role');

const router=Router();


//con Express validator, cada una va llenando la información en request, y al final te pasa un objeto con todos los errores
// Solo ejecuto el controlador si pasa todos los middelwares.

router.get('/', usuariosGet);                               //Solicitud para mostrar los usuarios


router.put('/:id',[
    validarJWT, 
    check('id','No es un ID válido').isMongoId(),        //Revisa que sea un tipo mongo, no revisa si existe en mongo
    check('id').custom(existeUsuarioId),                 //Ejecuto función verificar existencia del usuario
    check('rol').custom(esRoleValido),                   //Verificar un rol permitido
    validarCampos                                        //No continua a la ruta si hay un error en los checks
], usuariosPut );


router.post('/',[
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password debe tener mínimo 5 caracteres').isLength(6,100),
    check('correo','El correo no es valido').isEmail(),
    check('correo').custom(emailExiste), 
    //check('rol','Rol no permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('rol').custom(esRoleValido),    //es lo mismo que lo de abajo
    //check('rol').custom((rol)=>esRoleValido(rol)), 
    validarCampos
] ,usuariosPost );


router.delete('/:id',[ 
    validarJWT,                                      //Es la primera que se valida, que el token sea correcto
    //esAdminRole,                                   //Solo un rol permitido
    tieneRole('ADMIN_ROLE'),             //Escoger el rol permitido
    check('id','No es un ID válido').isMongoId(),    //Revisa que sea un tipo mongo, no revisa si existe en mongo
    check('id').custom(existeUsuarioId),
    validarCampos                                    //No continua a la ruta si hay un error en los checks
],usuariosDelete);


module.exports= router