require('express-validator')
const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, actualizarProducto, ProductoDelete, ObtenerProductos, ObtenerProductoID } = require('../controllers/productos');
const { existeCategoria, categoriaOK, existeProducto, existeProductoPorID } = require('../helpers/db-validators');
const { validarCampos, validarJWT, tieneRole, esAdminRole } = require("../middlewares");

const router=Router();

//Obtener las categorías público
router.get('/',ObtenerProductos);

//Obtener una por id categoría público, Mongo ID, existencia de ID
router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorID),  
    validarCampos   
],
ObtenerProductoID);

//Crear Producto - Validar token, nombre obligatorio, categoria obligatoria
//categoriaOk, not existeProducto
router.post('/',[
    validarJWT,  
    esAdminRole,  
    check('nombre','EL nombre es obligatorio').not().isEmpty(),
    check('categoria','la categoria es obligatorio').not().isEmpty(),
    check('categoria').custom(categoriaOK),
    check('nombre').custom(existeProducto),
    validarCampos
], crearProducto);

//Actualizar - validar token, nombre obligatorio, ID mongo, que exista el id
router.put('/:id',[
    validarJWT,  
    esAdminRole,  
    check('nombre','el nomre es obligatario').not().isEmpty(),
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorID), 
    validarCampos
],
actualizarProducto);

// Validad JWT, adminRole, ID mongo, existe producto ID
router.delete('/:id',[ 
    validarJWT,                                      //Es la primera que se valida, que el token sea correcto
    esAdminRole,                                   //Solo un rol permitido
    //tieneRole('ADMIN_ROLE', 'USER_ROLE','VENTAS_ROL'),             //Escoger el rol permitido
    check('id','No es un ID mongo válido').isMongoId(),    //Revisa que sea un tipo mongo, no revisa si existe en mongo
    check('id').custom(existeProductoPorID),
    validarCampos                                    //No continua a la ruta si hay un error en los checks
],ProductoDelete);

module.exports= router;

