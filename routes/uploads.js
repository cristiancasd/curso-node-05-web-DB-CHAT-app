require('express-validator')
const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { validarCampos } =         require('../middlewares');
const { validarArchivoSubir } =   require('../middlewares/validar-archivo');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router=Router();

router.post('/',[             //Subir un archivo
    validarArchivoSubir],     //Valido que exista un archivo en el body
cargarArchivo);               //Ejecuto metodo que sube archivo         

router.put('/:coleccion/:id', [                              //Editar, recibo la colección y el ID
    check('id','El id debe de ser de mongo').isMongoId(),    //Valido ID mongo
    check('coleccion').custom(
        c=>coleccionesPermitidas(c,['usuarios','productos'])),//Valido si las colecciones son permitidas
    validarArchivoSubir,                                      //Valido archivo en el body
    validarCampos
    ],actualizarImagenCloudinary)
//], actualizarImagen);                                         //Guardo la imagén y borro la anterior

router.get('/:coleccion/:id',[                                //Obtener la imagén
    check('id','El id debe de ser de mongo').isMongoId(),      
    check('coleccion').custom(
        c=>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImagen)                                             

module.exports= router;
