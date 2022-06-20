require('express-validator')

const { Router } = require("express");
const { check } = require('express-validator');
const { ventasGet, ventasPost ,actualizarVenta} = require("../controllers/ventas");
const { esRoleValido, existeVentaId, existeUsuarioId,diaExiste } = require('../helpers/db-validators');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jws');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');


const Role = require('../models/role');

const router=Router();


//con Express validator, cada una va llenando la información en request, y al final te pasa un objeto con todos los errores
// Solo ejecuto el controlador si pasa todos los middelwares.

router.get('/',[
    validarJWT,
    //check('rol').custom(esRoleValido),
    tieneRole('ADMIN_ROLE','VENTAS_ROL')
],
ventasGet);                               //Solicitud para mostrar los usuarios


router.post('/',[
    validarJWT,
    check('arregloVentas', 'El vector es obligatorio').not().isEmpty(),
    check('dia', 'El dia es obligatorio').not().isEmpty(),
    check('fecha', 'El fecha es obligatorio').not().isEmpty(),
    check('dia').custom(diaExiste),
    check('rol').custom(esRoleValido),    //es lo mismo que lo de abajo
    tieneRole('ADMIN_ROLE','VENTAS_ROL'),
    validarCampos
] ,ventasPost );

router.put('/:id',[
    validarJWT,    
    check('arregloVentas', 'El vector es obligatorio').not().isEmpty(),
    //check('dia', 'El dia es obligatorio').not().isEmpty(),
    //check('rol').custom(esRoleValido),    //es lo mismo que lo de abajo
    tieneRole('ADMIN_ROLE','VENTAS_ROL'),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeVentaId), 
    validarCampos
],
actualizarVenta);

module.exports= router