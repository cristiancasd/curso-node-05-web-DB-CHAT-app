const Role=require('../models/role');
const Usuario=require('../models/usuario');
const Categoria=require('../models/categoria');
const Producto=require('../models/producto');

require('colors')

const esRoleValido=async(rol='')=>{  
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(' El rol no está registrado en la BD')
    }
}
const emailExiste=async(correo='')=>{
    //Comprobar si el correo existe
  const existeEmail=await Usuario.findOne({correo});
  console.log('correo ----'.green,correo);
  console.log('existeEmail ----'.green,existeEmail)
  if(existeEmail){
    throw new Error('Ya se está usando el correo')
  }
}
const existeUsuarioId=async(id)=>{
  const existeUsuario = await Usuario.findById(id);
  if (!existeUsuario){
    throw new Error('El id no existe')
  }
}
const categoriaOK=async(categoria)=>{

  let categoriaDb = await Categoria.find({categoria});
  let n=0;
  let cate='0';
  
  while (n < (categoriaDb.length) && cate=='0') {
    if(categoriaDb[n].nombre==categoria.toUpperCase()){
      cate=categoria.toUpperCase();
    } 
    n++;
  }

  if(cate=='0'){
    throw new Error(`Helper... La categoría ${cate}, No existe`) 
  }
}
const existeCategoria=async(categoria)=>{

  let categoriaDb = await Categoria.find({categoria});
  let n=0;
  let cate='0';

  while (n < (categoriaDb.length) && cate=='0') {
    if(categoriaDb[n].nombre==categoria.toUpperCase()){
      cate=categoria.toUpperCase();
    } 
    n++;
  }

  if(cate!='0'){
    throw new Error(`Helper... La categoría ${cate}, ya existe`) 
  }


  
  /*
  let cat_may=categoria.toUpperCase()
  categoriaDb = await Categoria.findOne({cat_may});
  console.log(cat_may,'ultima prueba'.red,categoriaDb)

  if(categoriaDb){
    console.log(`Helper... La categoría ${categoriaDb.nombre}, ya existe`.yellow)
    throw new Error(`Helper... La categoría ${categoriaDb.nombre}, ya existe`)  
  }*/


}
const existeCategoriaPorID=async(id)=>{
  const existeCate = await Categoria.findById(id);
  if (!existeCate){
    throw new Error('El id no existe')
  }
}
const existeProducto=async(producto)=>{

  console.log('estoy en existeProducto'.yellow)
  
  let product=producto.toUpperCase();

  const query = { nombre: product };
  console.log('Buscar si ya exite el producto'.yellow, query)

  let productoDb = await Producto.findOne(query);
  console.log('productoDb es'.red, productoDb);

  if(productoDb){
    console.log('condicional')
    console.log(`Helper... El producto ${producto}, ya existe`.yellow)
    throw new Error(`Helper... El producto ${producto}, ya existe`)  
  }

  console.log(`Helper... El producto ${producto}, No existe vamos a crearlo`.yellow)

  /*
    let n=0;
  let cate='0';
  while (n < (productoDb.length) && cate=='0') {
    if(productoDb[n].nombre==producto.toUpperCase()){
      cate=producto.toUpperCase();
    } 
    n++;
  }

  if(cate!='0'){
    throw new Error(`Helper... El producto ${cate}, ya existe`) 
  }
*/

  
  /*
  let cat_may=categoria.toUpperCase()
  categoriaDb = await Categoria.findOne({cat_may});
  console.log(cat_may,'ultima prueba'.red,categoriaDb)

  if(categoriaDb){
    console.log(`Helper... La categoría ${categoriaDb.nombre}, ya existe`.yellow)
    throw new Error(`Helper... La categoría ${categoriaDb.nombre}, ya existe`)  
  }*/


}
const existeProductoPorID=async(id)=>{
  const existeProd = await Producto.findById(id);
  if (!existeProd){
    throw new Error('El id no existe en la base de datos')
  }
}

const coleccionesPermitidas=(coleccion='',colecciones=[])=>{
  console.log('estoy en coleccionesPermitidas')
  const incluida = colecciones.includes(coleccion);
  if(!incluida){
    throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
  }
  return true;
}

module.exports={
    esRoleValido, 
    existeUsuarioId,
    emailExiste,
    existeCategoria,
    existeCategoriaPorID,
    categoriaOK,
    existeProducto,
    existeProductoPorID,
    coleccionesPermitidas
}
