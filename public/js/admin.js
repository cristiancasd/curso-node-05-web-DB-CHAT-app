
let usuario = null;

const divBuscar = document.querySelector('#divBuscar');


const noRoles     = document.querySelector('#noRoles');
const rolUsuarios     = document.querySelector('#rolUsuarios');
const divCategoria     = document.querySelector('#divCategoria');
const divProducto     = document.querySelector('#divProducto');
const verDivSelectUsuarios     = document.querySelector('#verDivSelectUsuarios');
const divEditarProductos     = document.querySelector('#divEditarProductos');

const button_search     = document.querySelector('#button_search');
const formBuscar     = document.querySelector('#formBuscar');
const buscar     = document.querySelector('#buscar');
const buscarInput     = document.querySelector('#buscarInput');
const resultadoBusqueda     = document.querySelector('#resultadoBusqueda');





//Traigo los elementos del erditarPerfil html
const formFuncion     = document.querySelector('#formFuncion');
const formSubirImagen     = document.querySelector('#formSubirImagen');
const divFormImg     = document.querySelector('#divFormImg');
const divFormDatos     = document.querySelector('#divFormDatos');
const divUsuarios     = document.querySelector('#divUsuarios');

const divSelectUsuarios     = document.querySelector('#divSelectUsuarios');

const divCateProd     = document.querySelector('#divCateProd');



const formCambiarDatos     = document.querySelector('#formCambiarDatos');
const fileupload     = document.querySelector('#fileupload');
const fotoUser       = document.querySelector('#fotoUser');


const nombre     = document.querySelector('#nombre');
const password = document.querySelector('#password');
const password2 = document.querySelector('#password2');
const correo     = document.querySelector('#correo');
const rol     = document.querySelector('#rol');
const estado     = document.querySelector('#estado');

const usarContraseña     = document.querySelector('#usarContraseña');

const upload_button = document.querySelector('#upload_button');
const change_button = document.querySelector('#change_button');

const selectButton = document.querySelector('#selectButton');
const seleccion = document.querySelector("#seleccion")

const id_user = document.querySelector("#id_user")
const estoyEn = document.querySelector('#estoyEn');


// Variables de Crear y Editar Producto-Usuario
const divFormImgP       = document.querySelector('#divFormImgP');
const formCambiarDatosP = document.querySelector('#formCambiarDatosP');
const formSubirImagenP  = document.querySelector('#formSubirImagenP');
const fotoUserP         = document.querySelector('#fotoUserP');
const fileuploadP       = document.querySelector('#fileuploadP');
const upload_buttonP    = document.querySelector('#upload_buttonP');
const divFormDatosP     = document.querySelector('#divFormDatosP');
const nombreProducto    = document.querySelector('#nombreProducto');

const label_nombreProducto    = document.querySelector('#label_nombreProducto');
const label_precio    = document.querySelector('#label_precio');
const label_descripcion    = document.querySelector('#label_descripcion');


const categoria         = document.querySelector('#categoria');
const precio            = document.querySelector('#precio');
const descripcion       = document.querySelector('#descripcion');
const disponible        = document.querySelector('#disponible');
const change_buttonP	= document.querySelector('#change_buttonP	');
const estadoCategoria	= document.querySelector('#estadoCategoria	');




const enlace='/api/auth/' 
const enlaceSubir='/api/uploads/usuarios/' 
const enlaceAssets="../../assets/goku.png"
const enlaceEditar='/api/usuarios/' 
const enlaceCategoria='/api/categorias/' 
const enlaceProducto='/api/productos/'      

const enlaceSubirPC='/api/uploads/' 

const enlaceUser='/api/usuarios/' 


const enlaceBuser='/api/buscar/usuarios/'  
var nombre_imagen='';


let funcionActual='';
let usuarioEdit={}

// Validar el JWT en el frontEND
const validarJWT = async() => {

    console.log('el select es -..',seleccion.value)
    console.log('voy a validar token')
    //Traemos el token de localStorage
    const token = localStorage.getItem('token')||'';

    if (token.length <= 10){ //No hay token
        window.location='index.html' //redireccionamiento
        throw new Error('No hay token en el eservidor')
    }

    //hago la petición get y para renovar token
    const resp = await fetch(enlace,{   
        headers:{'c-token':token}
    });

    //la respuesta de la petición tiene estos dos valores y los clono
    const {usuario: userDb, token:tokenDB}= await resp.json(); 
    localStorage.setItem('token',tokenDB) //Renuevo el JWT
    usuario=userDb;
    
    if(userDb.rol!='ADMIN_ROLE') window.location='index.html'
    
    document.title = 'ADMIN '+usuario.nombre; //El texto de la pestaña de chat.html
    fotoUser.src='/js/goku.png'

    parametrosIniciales(seleccion.value) //parametrosUsuario();

} 
const parametrosIniciales=async(accion)=>{

    estado.style.display='none';
    estadoCategoria.style.display='none';
    divBuscar.style.display='none';
    divProducto.style.display='none';
    //verDivSelectUsuarios.style.display='none';

    divMostrarBusqueda.style.display='none';

    
    
    
    console.log('addEventListener',seleccion.value)
    switch(accion){
        
        case 'nuevoUser'  :
        case 'editarUser' :
        case 'eliminarUser' :

            estoyEn.innerHTML= 'CREAR NUEVO USUARIO'

            if(accion=='nuevoUser'){
                password.value='';
                password2.value=''; 
            }

            nombre.disabled=false;
            rol.disabled=false;

            divFormDatosP.style.display ='none';            
            divFormImgP.style.display='none';

            divCateProd.style.display ='none';
            divUsuarios.style.display ='none';  
            divFormDatos.style.display ='block';            
            divFormImg.style.display='none';
            selectButton.disabled=false;
            id_user.value='';
            id_user.disabled=true;
            funcionActual='nuevoUser';
            nombre.value='';
            correo.value='';
            rol.value='USER_ROLE';
            estado.value=true;
            fotoUser.src='/js/goku.png';
            usarContraseña.style.display ='none'; 
            change_button.innerHTML='Crear Usuario';

            await actualizarusuarios()

            if(seleccion.value=='editarUser'||seleccion.value=='eliminarUser'){

                estoyEn.innerHTML= 'EDITAR USUARIO';
                (userObj[divSelectUsuarios.value].img) 
                    ? fotoUser.src= userObj[divSelectUsuarios.value].img
                    : fotoUser.src='/js/goku.png';
                change_button.innerHTML='Editar Usuario';
                funcionActual='editarUser';

                divFormImg.style.display='block';
                usarContraseña.style.display ='block'; 
                
                correo.disabled=false
                id_user.value   =   userObj[divSelectUsuarios.value].uid          
                nombre.value    =   userObj[divSelectUsuarios.value].nombre
                correo.value    =   userObj[divSelectUsuarios.value].correo
                rol.value       =   userObj[divSelectUsuarios.value].rol
                password.disabled=true;
                password2.disabled=true;
                correo.disabled=true;

                
                    
                    nombre.requided=true;
                    upload_button.style.display='block'
                    fileupload.style.display='block'

                if(seleccion.value=='eliminarUser'){
                    estoyEn.innerHTML= 'ELIMINAR USUARIO'
                    funcionActual='eliminarUser';
                    usarContraseña.style.display ='none'; 
                    nombre.disabled=true;
                    rol.disabled=true;
                    nombre.requided=false;
                    change_button.innerHTML='ELIMINAR Usuario';
                    upload_button.style.display='none'
                    fileupload.style.display='none'
                }
            }
            
            break;     

        case 'nuevoProd'  :
        case 'editarProd' :
        case 'eliminarProd' :

            await actualizarCategorias()
            await actualizarProductos()

            divEditarProductos.style.display='block';
            
            divEditarProductos.style.backgroundColor='black';
            //verDivSelectUsuarios.style.display='block';
            divProducto.style.display='block';
            estoyEn.innerHTML= 'CREAR NUEVO PRODUCTO';
            disponible.required=false;
            disponible.disabled=false;

            nombreProducto.disabled=false;
            divCategoria.disabled=false;

            precio.disabled=false; 
            descripcion.disabled=false;   
                  
            upload_buttonP.style.display='block'
            fileuploadP.style.display='block'


            divFormDatosP.style.display ='block';            
            divFormImgP.style.display='none';
        
            divCateProd.style.display ='none';
            divUsuarios.style.display ='none';  
            divFormDatos.style.display ='none';            
            divFormImg.style.display='none';
        
            label_nombreProducto.style.display='none';
            label_precio.style.display='none';
            label_descripcion.style.display='none';
        
                
                id_user.value='';
                id_user.disabled=true;
                funcionActual='nuevoProd';
        
                nombreProducto.value='';
                categoria.value='';        
                estadoCategoria.value=true;
                disponible.value=true;
                precio.value=0;
                descripcion.value='';
                //fotoUserP.src='/js/goku.png';
        
                label_nombreProducto.style.display='block';
                label_precio.style.display='block';
                label_descripcion.style.display='block';
        
                nombreProducto.style.display ='block';
                disponible.style.display ='none';
                precio.style.display ='block';
                descripcion.style.display ='block';
                estadoCategoria.style.display='none';
                change_buttonP.innerHTML='Crear Producto';
                nombreProducto.required=true;
                divCategoria.style.display='block';
                categoria.style.display='none';
                categoria.required=false;
        
                
                console.log('prodObj[divProducto.value] ..',prodObj[divProducto.value])
                console.log('img..',prodObj[divProducto.value].img)
                
                
                
                if(seleccion.value=='editarProd'||seleccion.value=='eliminarProd'){
                    estoyEn.innerHTML= 'EDITAR PRODUCTO';

                    (prodObj[divProducto.value].img) 
                            ? fotoUserP.src= prodObj[divProducto.value].img
                            : fotoUserP.src='/js/goku.png';
                    divFormImgP.style.display='block';
                    change_buttonP.innerHTML='Editar Producto';
                    funcionActual='editarProd';
                    disponible.style.display ='block'; 
        
                    nombreProducto.value    =   divProducto.value
                    categoria.value         =   prodObj[divProducto.value].categoria
                    precio.value            =   prodObj[divProducto.value].precio
                    descripcion.value       =   prodObj[divProducto.value].descripcion
                    disponible.value        =   prodObj[divProducto.value].disponible
                    id_user.value=prodObj[divProducto.value]._id


                    if(seleccion.value=='eliminarProd'){
                        estoyEn.innerHTML= 'ELIMINAR PRODUCTO';

                        funcionActual='eliminarProd';     

                        nombreProducto.required=false;
                        nombreProducto.disabled=true;

                        divCategoria.required=false;
                        divCategoria.disabled=true;

                        disponible.required=false;
                        disponible.disabled=true;

                        precio.disabled=true; 
                        descripcion.disabled=true;   

                        change_buttonP.innerHTML='ELIMINAR Producto';
                        upload_buttonP.style.display='none'
                        fileuploadP.style.display='none'
                    }
                }
                
            break;

        
        case 'verUser':

            estoyEn.innerHTML= 'MOSTRAR USUARIOS';


            divFormDatosP.style.display ='none';            
            divFormImgP.style.display='none';
            divCateProd.style.display ='none';
            divUsuarios.style.display ='block';  
            divFormDatos.style.display ='none';            
            divFormImg.style.display='none';
            selectButton.disabled=false;
            id_user.value='';
            id_user.disabled=true;
            mostrar()
            break;   
        case 'verCateg':
            estoyEn.innerHTML= 'MOSTRAR PRODUCTOS Y CATEGORÍAS';

            divFormDatosP.style.display ='none';            
            divFormImgP.style.display='none';
            divCateProd.style.display ='block';
            divUsuarios.style.display ='none';  
            divFormDatos.style.display ='none';            
            divFormImg.style.display='none';
                selectButton.disabled=false;
                id_user.value='';
                id_user.disabled=true;
                mostrarCP();
        
            break;         
        
               

        case 'nuevaCateg':
        case 'editarCateg':
        case 'eliminarCateg':

            await actualizarCategorias()
            estoyEn.innerHTML= 'CREAR NUEVA CATEGORÍA';
            divEditarProductos.style.display='block';

            divFormDatosP.style.display ='block';            
            divFormImgP.style.display='none';
            divCateProd.style.display ='none';
            divUsuarios.style.display ='none';  
            divFormDatos.style.display ='none';            
            divFormImg.style.display='none';
        
            categoria.disabled=false ;
                id_user.value='';
                id_user.disabled=true;
                funcionActual='nuevaCateg';
        
                nombreProducto.value='';
                categoria.value='';        
                estadoCategoria.value=true;
                disponible.value=true;
                precio.value=0;
                descripcion.value='';
                //fotoUserP.src='/js/goku.png';
                label_nombreProducto.style.display='none';
                label_precio.style.display='none';
                label_descripcion.style.display='none';
                nombreProducto.style.display ='none';
                disponible.style.display ='none';
                precio.style.display ='none';
                descripcion.style.display ='none';
                estadoCategoria.style.display='none';
                change_buttonP.innerHTML='Crear Categoria';
                nombreProducto.required=false;
                divCategoria.display='none';
                categoria.style.display='block';
                categoria.required=true;

                if(accion=='editarCateg'||accion=='eliminarCateg'){
                    estoyEn.innerHTML= 'EDITAR CATEGORÍA';
                    id_user.value='';
                    id_user.disabled=true;
                    funcionActual='editarCateg';
                    categoria.value=divCategoria.value;
                    id_user.value=cateObj[divCategoria.value];
                    change_buttonP.innerHTML='Editar Categoria';   
                    if (accion=='eliminarCateg') {
                        funcionActual='eliminarCateg';
                        change_buttonP.innerHTML='Eliminar Categoria'; 
                        categoria.disabled=true ;
                    }          
                }


                


            break;
        
        
                   
        

        case 'buscar':
            id_user.value='';
            divCateProd.style.display='none';   
            divUsuarios.style.display='none';            
            divEditarProductos.style.display='none';
            divFormImg.style.display='none';
            divFormDatos.style.display='none';
            divBuscar.style.display='block';

            break;

        default:
            estoyEn.innerHTML= 'FUNCIÓN NO ESTABLECIDA';
            return console.log('accion es ',accion);
      }
    
}
//Selector de función
seleccion.addEventListener("change", async ev=>{
    parametrosIniciales(seleccion.value)
})
//submit Funcion (editar con ID)
 formFuncion.addEventListener('submit',  async (ev)=>{
    ev.preventDefault();
    parametrosIniciales(seleccion.value)
})







//*******************************     MOSTRAR     ******************************************** */

const mostrarBusqueda=async(arreglo,buscar)=>{
    
    console.log('arreglo que llega',arreglo)
    console.log('buscar que llega',buscar)

    divMostrarBusqueda.style.display='block';

    
    let disponibleP=''
    let imagen=''
    
    busquedaHtml=''
    arreglo.forEach((valor,i)=>{

        console.log('valor del for ..',valor)
        busquedaHtml+=`          
                
        <div
        style="                      
        background-color:white;                                       
        border:1px  solid black; 
        width:30%;
        height:500px;
        margin:0px auto;
        float:left;
        margin:10px
        "
        >`
            
        
        if( buscar=='/api/buscar/usuarios/'  ){
                
            console.log('estoy en buscar ususarios');
            (valor.img)
                ? imagen=valor.img                     
                : imagen='/js/goku.png';

            busquedaHtml+=` <div class="d-grid" style="justify-content: center" >
                        <h5 >${valor.nombre}</h5> 
                        <img src="${imagen}" width="200" height="200" style="margin: 0 auto;"> 
                        <p>Correo: $${valor.correo}</p>
                        <p>estado: $${valor.estado}</p>
                        <p>uid: $${valor.uid}</p>
                        <p>rol: $${valor.rol}</p>
                        <p>google: $${valor.google}</p>
                    </div>
                </div>                        
        `

        }  

        if( buscar=='/api/buscar/productos/'){
                


                console.log('estoy en buscar productos');

                (valor.img)
                    ? imagen=data.img                     
                    : imagen='/js/goku.png';
                    
                (valor.disponible)
                    ? disponibleP='Disponible: SI'                     
                    : disponibleP='Disponible: NO';

                busquedaHtml+=` <div class="d-grid" style="justify-content: center" >
                            <h5 >${valor.nombre}</h5> 
                            <img src="${imagen}" width="200" height="200" style="margin: 0 auto;"> 
                            <p>precio: $${valor.precio}</p>
                            <p>disponible: ${disponibleP}</p>
                            <p>categoría: ${valor.categoria.nombre}</p>
                            <p>Creado por: ${userObj[valor.usuario].nombre}</p>
                            <p>Descripción: ${valor.descripcion}</p>
                            <p>ID producto: ${valor._id}</p>
                        </div>
                    </div>                        
            `

        }

        if( buscar=='/api/buscar/categorias/'){
                
            console.log('estoy en buscar categorias');

            busquedaHtml+=` <div class="d-grid" style="justify-content: center" >
                        <h5 >${valor.nombre}</h5> 
                        <p>Creado por: ${userObj[valor.usuario].nombre}</p>
                        <p>ID Categoría: ${valor._id}</p>
                    </div>
                </div>                        
        `
        }
      
    })
    console.log('arreglo.length',arreglo.length);
    (arreglo.length!=0)
        ? resultadoBusqueda.innerHTML=busquedaHtml
        : resultadoBusqueda.innerHTML=`<h5 >No hay resultados en la busqueda</h5> ` ;



}
const mostrar=async()=>{
    const resp = await fetch(enlaceEditar,{});
    const {usuarios}= await resp.json(); 
    const roles=['ADMIN_ROLE','USER_ROLE', 'VENTAS_ROL']
    let rolHtml='';
    let arregloRolObj={};
    roles.forEach((valor)=>{      
        arregloRolObj[valor]=[]        
        rolHtml+=`
        <li>
            <p>
                <a href="#${valor}" class="text-success">${valor}</h5>                
            </p>
        </li>
        `
    })

    //Separo usuarios por rol
    usuarios.forEach((data)=>{
        roles.forEach((valor,i)=>{
            if(valor==data.rol){
                arregloRolObj[valor].push(data)
            }
        })
    })

    console.log('arregloRolObj',arregloRolObj)

    noRoles.innerHTML=rolHtml;

    let imgProducto='';
    let disponibleP='';
    
    usuariosHtml=''
    roles.forEach((valor,i)=>{
        usuariosHtml+=`<h5 id="${valor}"class="text-success" style="
        background-color:blue; 
        ">${valor}</h5>
                        
                        <section style="
                        border:1px solid green;   
                        background-color:black;
                        overflow:hidden; 
                        "
                        >   
        `
        arregloRolObj[valor].forEach((data)=>{

            (data.img)
                ? imgProducto=data.img                     
                : imgProducto='/js/goku.png';

            (data.disponible)
                ? disponibleP='Disponible: SI'                     
                : disponibleP='Disponible: NO';

                usuariosHtml+=`           
                
                    <div
                    style="                      
                    background-color:white;                                       
                    border:1px  solid black; 
                    width:30%;
                    height:500px;
                    margin:0px auto;
                    float:left;
                    margin:10px
                    
                    "
                    >
                        <div class="d-grid" style="justify-content: center" >
                            <h5 >${data.nombre}</h5> 
                            <img src="${imgProducto}" width="200" height="200" style="margin: 0 auto;"> 
                            <p>Correo: $${data.correo}</p>
                            <p>estado: $${data.estado}</p>
                            <p>uid: $${data.uid}</p>
                            <p>rol: $${data.rol}</p>
                            <p>google: $${data.google}</p>

                                                  
                        
                        </div>
                    </div>
                        
            `
        })
        usuariosHtml+=`</section>`
            
    })

    
    rolUsuarios.innerHTML=usuariosHtml



}
const mostrarCP = async() =>{


    const resp = await fetch(enlaceCategoria,{});
    const {total, categorias}= await resp.json(); 

    const resp2 = await fetch(enlaceProducto,{});
    const {total:totalP, productos}= await resp2.json(); 

    let cateHtml='';
    let cateProdHtml='';
    let arregloCate=[];
    let arregloCateObj={};

    categorias.forEach(({nombre})=>{
        arregloCate.push(nombre);
        arregloCateObj[nombre]=[]        
        cateHtml+=`
        <li>
            <p>
                <a href="#${nombre}" class="text-success">${nombre}</h5>                
            </p>
        </li>
        `
    })

    //Separo productos por categoria
    productos.forEach((data)=>{
        arregloCate.forEach((valor,i)=>{
            if(valor==data.categoria.nombre){
                arregloCateObj[valor].push(data)
            }
        })
    })

    let imgProducto='';
    let disponibleP='';
    
    categorias.forEach((valor,i)=>{
        cateProdHtml+=`<h5 id="${valor.nombre}"class="text-success" style="
        background-color:blue; 
        ">${valor.nombre}</h5>
                        
                        <section style="
                        border:1px solid green;   
                        background-color:black;
                        overflow:hidden; 
                        "
                        >   
        `
        arregloCateObj[valor.nombre].forEach((data)=>{

            (data.img)
                ? imgProducto=data.img                     
                : imgProducto='/js/goku.png';

            (data.disponible=="true")
                ? disponibleP='Disponible: SI'                     
                : disponibleP='Disponible: NO';

            cateProdHtml+=`           
                
                    <div
                    style="                      
                    background-color:white;                                       
                    border:1px  solid black; 
                    width:30%;
                    height:400px;
                    margin:0px auto;
                    float:left;
                    margin:10px
                    
                    "
                    >
                        <div class="d-grid" style="justify-content: center" >
                            <h5 >${data.nombre}</h5> 
                            <img src="${imgProducto}" width="200" height="200" style="margin: 0 auto;"> 
                            <p>Descripcion:</p>
                            <p>${data.descripcion}</p>
                            <p>Precio: $${data.precio}</p>
                            <p>${disponibleP}</p>                        
                        
                        </div>
                    </div>
                        
            `
        })
        cateProdHtml+=`</section>`
            
    })



    categoriasTodas.innerHTML=cateHtml
    cateProductos.innerHTML=cateProdHtml

    
}



//********************************  Crear editar USUARIOS   ************************************************************ */
formCambiarDatos.addEventListener('submit', ev=>{
  
    ev.preventDefault();        //No recargar página    

    if(funcionActual=='editarUser'){

        if (usarContraseña.checked){
            if(password.value!=password2.value|| password.value.length<=5){
                
                (password.value.length<=5)
                    ? window.alert('Debe tener mínimo 6 caracteres')
                    : window.alert('Las contraseñas no son iguales')
            }else{
                console.log('voy a entrar a editarUsuario')
                crearEditarUsuario(funcionActual,id_user.value);           
            }   
        }else{
            crearEditarUsuario(funcionActual,id_user.value);   
        }

    }

    if(funcionActual=='nuevoUser'){
        if(password.value!=password2.value|| password.value.length<=5){
            (password.value.length<=5)
                ? window.alert('Debe tener mínimo 6 caracteres')
                : window.alert('Las contraseñas no son iguales')
        }else{
            console.log('voy a entrar a editarUsuario')
            crearEditarUsuario(funcionActual,id_user.value);           
        }

    if(funcionActual=='eliminarUser') crearEditarUsuario(funcionActual,id_user.value)

    


    }

    if(funcionActual=='eliminarUser') crearEditarUsuario(funcionActual,id_user.value); 

})
const crearEditarUsuario=async (accion,id_editar)=>{
    let formData={};     
    let enlace='';
    let crud='POST'

   
    if(accion=='nuevoUser'){
        

        formData['nombre']=nombre.value;
        formData['rol']=rol.value;
        formData['password']=password.value;
        formData['correo']=correo.value;
        formData['img']='';       
        enlace=enlaceUser;
        crud='POST'
    }

    if(accion=='editarUser'){
        enlace=enlaceUser+id_editar;
        formData['nombre']=nombre.value;
        formData['rol']=rol.value;
        formData['estado']=estado.value;

        if(usarContraseña.checked){
            formData['password']=password.value;
        }
        crud='PUT'
    }

    if(accion=='eliminarUser'){
        enlace=enlaceUser+id_editar;
        crud='DELETE'
    }

       
    console.log('formData es ',formData)
    console.log('el enlace es ',enlace)
    
    await fetch(enlace,{
        method: crud,
        body: JSON.stringify(formData),//Contiene correo y password
        headers:{
            'Content-Type':'application/json',
            'c-token':localStorage.getItem('token')
        }
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then( async (resp)=> {
        console.log('la respuesta de la petición es');
        console.log(resp)
        if(!resp.nombre&&!resp.usuario){
            return console.error('error');
        } 
        //divFormDatos.style.display ='none';
        //divFormImg.style.display='block';
        
        console.log('crud es ',crud)
        if(crud=='DELETE'){
            console.log('resp.usuario',resp.usuario);
            id_user.value='';        
            change_button.style.backgroundColor= "red";    
            change_button.style.color= '#3d3d3d';
        }else{
            id_user.value=resp._id; 
            if(accion=='nuevoUser')    id_user.value=resp.usuario.uid; 
            change_button.style.backgroundColor= "#89ff5c";    
            change_button.style.color= '#3d3d3d';
        }       
        

        setTimeout(function(){
            console.log('estoy en el temporizador')
            change_button.style.backgroundColor= "blue";    
            change_button.style.color= 'white';
            }, 1200);
        
        if(accion=='eliminarUser') {
            await actualizarusuarios();
            id_user.value   =   userObj[divSelectUsuarios.value].uid 
            parametrosIniciales(accion)
        }

        if(accion=='editarUser' || accion=='nuevoUser'){ 
            actualizarusuarios();
            
            if(accion=='nuevoUser'){
                fotoUser.src='/js/goku.png';
                divFormDatos.style.display ='none';
                divFormImg.style.display='block';
            } 
        }
    })
    .catch(err=>{
        console.log(err) 
    })
}




//************************************  Subir fotos ******************************************************** */

formSubirImagen.addEventListener('submit', ev=>{
    ev.preventDefault();//permite cancelar el evento sin detener el funcionamiento       
    
    //creating form data object and append file into that form data
    let formData = new FormData(); 
   
    formData.append('archivo', fileupload.files[0]);
  
    fetch(enlaceSubir+id_user.value, { 
        method: "PUT", 
        body: formData
    })    
    .then(response => response.json())
    .then(response=>{ //Grabo el token en localstorage
        
        if(!response.img){
            console.log('está super malo todo')
            return console.error(data.msg);
        }

        if(funcionActual=='editarUser'){
            upload_button.style.backgroundColor= "#89ff5c";    
            upload_button.style.color= '#3d3d3d';
            fotoUser.src=response.img
        }else{
            parametrosIniciales(seleccion.value)
            //parametrosUsuario();
        }
        

        console.log('Success:', response.img)
    })
    .catch(error =>  console.warn(error))
    //.then(response => console.log('Success:', response))
  

})
formSubirImagenP.addEventListener('submit', ev=>{
    ev.preventDefault();    
    
    const enlaceFuncion='productos/';

    let formData = new FormData();    
    formData.append('archivo', fileuploadP.files[0]);
  
    fetch(enlaceSubirPC+enlaceFuncion +id_user.value, { 
        method: "PUT", 
        body: formData
    })    
    .then(response => response.json())
    .then(response=>{ //Grabo el token en localstorage
        
        if(!response.img){
            console.log('está super malo todo')
            return console.error(data.msg);
        }

        if(funcionActual=='editarProd'|| funcionActual=='nuevoProd'){
            upload_buttonP.style.backgroundColor= "#89ff5c";    
            upload_buttonP.style.color= '#3d3d3d';
            fotoUserP.src=response.img            

            setTimeout(function(){               
                
                    console.log('estoy en el temporizador')
                    upload_buttonP.style.backgroundColor= "blue";    
                    upload_buttonP.style.color= 'white';
                    if(funcionActual=='nuevoProd') parametrosIniciales(seleccion.value) ;//parametrosProducto();   
                    
                }, 1200);

            //             
                       
        }else{
            parametrosIniciales(seleccion.value)// parametrosProducto();
        }
        

        console.log('Success:', response.img)
    })
    .catch(error =>  console.warn(error))
    //.then(response => console.log('Success:', response))
  

})




//************************************ Crear EDITAR User, Prod, Catg ******************************************************** */

formCambiarDatosP.addEventListener('submit', ev=>{
    console.log('Submit ... valor de funcionActual= ',funcionActual)
    ev.preventDefault();        //No recargar página    
    crearCateProd(funcionActual, id_user.value); 
})

const crearCateProd=async (accion,id_editar)=>{
    let formData={};     
    let enlace='';
    let crud='POST'

    if(accion=='nuevaCateg'){
        formData['nombre']=categoria.value;
        enlace=enlaceCategoria;
        crud='POST';
    }
     
    if(accion=='nuevoProd'){
        
        formData['categoria']=divCategoria.value;
        formData['nombre']=nombreProducto.value;
        if(descripcion.value)  formData['descripcion']=descripcion.value;
        if(precio.value)  formData['precio']=precio.value;
        enlace=enlaceProducto;
        crud='POST'
    }

    if(accion=='editarCateg'){
        enlace=enlaceCategoria+id_editar;
        formData['nombre']=categoria.value;
        crud='PUT'
    }

    if(accion=='editarProd'){
        enlace=enlaceProducto+id_editar;
        formData['nombre']=nombreProducto.value;
        formData['disponible']=disponible.value;
        if(descripcion.value)  formData['descripcion']=descripcion.value;
        if(precio.value)  formData['precio']=precio.value;


        crud='PUT'
    }

    if(accion=='eliminarProd'){
        enlace=enlaceProducto+id_editar;
        crud='DELETE'
    }

    if(accion=='eliminarCateg'){
        enlace=enlaceCategoria+id_editar;
        crud='DELETE'
    }

       
    console.log('formData es ',formData)
    console.log('el enlace es ',enlace)
    console.log('eCRUD es ',crud)
    
    await fetch(enlace,{
        method: crud,
        body: JSON.stringify(formData),//Contiene correo y password
        headers:{
            'Content-Type':'application/json',
            'c-token':localStorage.getItem('token')
        }
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then( async (resp)=>{
        console.log('la respuesta es');
        console.log(resp)
        
        
        if(crud=='POST'){
            //if(!resp.nombre&&!resp.producto ){ 
            if(!resp.nombre){ 
                console.log('entre al condicional del error')
                console.log('resp.errors[0]',resp.errors[0])
                console.log('resp.errors[0].msg',resp.errors[0].msg)
                
                if(resp.errors[0].msg=='existente'){ //lo hago en el backend
                    //await actualizarProductos();
                    parametrosIniciales(accion);
                    console.error('restaurado');
                    window.alert(` ${formData['nombre']} ya existía, fue restaurado con datos anteriores`);
                    return;
                }
                return console.error('error');
            } 
        }
            

        if(crud=='DELETE'){
            id_user.value='';        
            change_buttonP.style.backgroundColor= "red";    
            change_buttonP.style.color= '#3d3d3d';
        }else{
            id_user.value=resp._id; 
            change_buttonP.style.backgroundColor= "#89ff5c";    
            change_buttonP.style.color= '#3d3d3d';
        }       
        

        
        
        

        setTimeout(function(){
            console.log('estoy en el temporizador')
            change_buttonP.style.backgroundColor= "blue";    
            change_buttonP.style.color= 'white';
            }, 1200);

        if(accion=='nuevaCateg'||accion=='editarCateg') actualizarCategorias();    
        
        if(accion=='editarProd' || accion=='nuevoProd'){ 
            actualizarProductos();
            //divFormDatosP.style.display ='none';
            //divFormImgP.style.display='block';
            if(accion=='nuevoProd'){
                fotoUserP.src='/js/goku.png';
                divFormDatosP.style.display ='none';
                divFormImgP.style.display='block';
            } 
        }

        if(accion=='eliminarProd'||accion=='eliminarCateg'){
            //await actualizarProductos();
            //id_user.value   =   prodObj[divProducto.value]._id
            parametrosIniciales(accion)
        }
    })
    .catch(err=>{
        console.log(err) 
    })
}





//***************************************   BUSCAR   ********************************************************* */
formBuscar.addEventListener('submit',  async (ev)=>{
    ev.preventDefault();//permite cancelar el evento sin detener el funcionamiento  
    //console.log('id user es ', id_user.value)

    let formData={};     
    let enlace=buscar.value+buscarInput.value;
    let crud='GET'

   
    

       
    console.log('formData es ',formData)
    console.log('el enlace es ',enlace)
    
    await fetch(enlace ,{
        method: crud,
        //body: JSON.stringify(formData),//Contiene correo y password
        headers:{
            'Content-Type':'application/json',
            'c-token':localStorage.getItem('token')
        }
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then( async (resp)=> {
        console.log('la respuesta de la petición es');
        console.log(resp.results)
        if(!resp.results){
            return console.error('error');
        } 
        //divFormDatos.style.display ='none';
        //divFormImg.style.display='block';
        
        console.log('crud es ',crud)
        
        button_search.style.backgroundColor= "#89ff5c";    
        button_search.style.color= '#3d3d3d';
        mostrarBusqueda(resp.results,buscar.value)


        setTimeout(function(){
            console.log('estoy en el temporizador')
            button_search.style.backgroundColor= "blue";    
            button_search.style.color= 'white';
            }, 1200);       
        
    })
    .catch(err=>{
        console.log(err) 
    })
})





//************************************ Crear objetos User, Prod, Catg ******************************************************** */

let userObj={}
const actualizarusuarios=async ()=>{
    const resp = await fetch(enlaceUser,{});
    const {usuarios}= await resp.json(); 
    
    let cateHtml=''
    usuarios.forEach((valor)=>{
        userObj[valor.uid]=valor;
            cateHtml+=`
            <option style=" color: black" value="${valor.uid}"> ${valor.nombre} Rol:${valor.rol} </option>                        
            `
    })  
    divSelectUsuarios.innerHTML=cateHtml;
}
let cateObj={}
const actualizarCategorias=async ()=>{
    console.log('estoy en actualizarCategorias')
    const resp = await fetch(enlaceCategoria,{});
    
    const {categorias}= await resp.json(); 
    
    let cateHtml=''
    categorias.forEach((valor)=>{
        cateObj[valor.nombre]=valor._id
        //console.log('el valor.estado es ',valor)
        
            cateHtml+=`
            <option style=" color: black" value="${valor.nombre}"> ${valor.nombre}</option>                        
            `
        
    })     

    divCategoria.innerHTML=cateHtml;
}
let prodObj={}
const actualizarProductos=async ()=>{

    console.log(' estoy en actualizarProductos')
    const resp = await fetch(enlaceProducto,{});
    
    const {productos}= await resp.json(); 
    let cateHtml=''
    productos.forEach((valor)=>{
        prodObj[valor.nombre]=valor
        
        if(valor.disponible=="true"){
            cateHtml+=`
            <option style=" color: black" value="${valor.nombre}"> ${valor.nombre}</option>                        
            `
        }else{
            cateHtml+=`
            <option style=" color: red" value="${valor.nombre}"> ${valor.nombre}</option>                        
            `
        }
    })        
    divProducto.innerHTML=cateHtml;
}




//*************************************** Selects de variables ********************************************************* */

//Selector de categorias
divCategoria.addEventListener("change", async ev=>{
    if(funcionActual=='editarCateg'||funcionActual=='eliminarCateg'){
        id_user.value=cateObj[divCategoria.value];
        categoria.value=divCategoria.value
    } 
})  

//Select de producto
divProducto.addEventListener("change", async ev=>{
    if(funcionActual=='editarProd' || funcionActual=='eliminarProd'){
        (prodObj[divProducto.value].img) 
                    ? fotoUserP.src= prodObj[divProducto.value].img
                    : fotoUserP.src='/js/goku.png';
        id_user.value=          prodObj[divProducto.value]._id;
        nombreProducto.value=   prodObj[divProducto.value].nombre;
        disponible.value=       prodObj[divProducto.value].disponible;
        descripcion.value=      prodObj[divProducto.value].descripcion;
        precio.value=      prodObj[divProducto.value].precio;
        divCategoria.value=      prodObj[divProducto.value].categoria.nombre;
    } 
})  

//Select de usuario
divSelectUsuarios.addEventListener("change", async ev=>{
    

    if(funcionActual=='editarUser'||funcionActual=='eliminarUser'){

        (userObj[divSelectUsuarios.value].img) 
                ? fotoUser.src= userObj[divSelectUsuarios.value].img
                : fotoUser.src='/js/goku.png';

           
        id_user.value   =   userObj[divSelectUsuarios.value].uid          
        nombre.value    =   userObj[divSelectUsuarios.value].nombre
        correo.value    =   userObj[divSelectUsuarios.value].correo
        rol.value       =   userObj[divSelectUsuarios.value].rol
          
    } 
})  
//Escoger cambiar la contraseña del usuario
usarContraseña.addEventListener("change", ev=>{
    console.log('usarContraseña es ..,.',usarContraseña.checked)
    
    if(usarContraseña.checked){
        password.required=true;
        password.disabled=false;
        password2.required=true;
        password2.disabled=false;
        
    }else{
        password.required=false;
        password.disabled=true;
        password2.required=false;
        password2.disabled=true;
    }


})




//Volver al index
const salir=()=>{
    window.location='index.html';
}

const main = async () => {await validarJWT();}
main();
//const socket = io();

