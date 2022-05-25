const  validaCampos  = require('../middlewares/validar-campos');
const  validaJWT  = require('../middlewares/validar-jws');
const  validaRoles = require('../middlewares/validar-roles');

module.exports={
    ...validaCampos,
    ...validaJWT,
    ...validaRoles
}
