
let usuario = null;



const noRoles     = document.querySelector('#noRoles');
const rolUsuarios     = document.querySelector('#rolUsuarios');




//Traigo los elementos del erditarPerfil html
const formFuncion     = document.querySelector('#formFuncion');
const formSubirImagen     = document.querySelector('#formSubirImagen');
const divFormImg     = document.querySelector('#divFormImg');
const divFormDatos     = document.querySelector('#divFormDatos');
const divUsuarios     = document.querySelector('#divUsuarios');
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
const fotoUserP         = document.querySelector('#usarContrasfotoUserPeña');
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
const enlaceCategoria='api/categorias' 
const enlaceProducto='api/productos'      


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

    parametrosNuevoUsuario();

} 

const parametrosNuevoUsuario=()=>{
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
            
            usarContraseña.style.visibility ='hidden'; 
            password.disabled=false;
            password2.disabled=false;
            correo.disabled=false; 
}
const parametrosVerUsuarios=()=>{
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
}
const parametrosVerCategorias=()=>{
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
}
const parametrosEditarUsuario=  async ()=>{
    divFormDatosP.style.display ='none';            
    divFormImgP.style.display='none';
    divUsuarios.style.display ='none'; 
    divCateProd.style.display ='none';
    selectButton.disabled=false;
    id_user.value='';
    id_user.disabled=false;
    funcionActual='editarUser';
    nombre.value='';
    correo.value='';
    rol.value='USER_ROLE';
    estado.value=true;
    fotoUser.src='/js/goku.png'
    divFormDatos.style.display ='block'; 
    divFormImg.style.display='block';
    usarContraseña.style.visibility ='visible'; 
    usarContraseña.checked =false;
    password.disabled=true;
    password2.disabled=true;
    correo.disabled=true; 
}
const parametrosNuevaCategoria=()=>{

    
    divFormDatosP.style.display ='block';            
    divFormImgP.style.display='none';

    divCateProd.style.display ='none';
    divUsuarios.style.display ='none';  
    divFormDatos.style.display ='none';            
    divFormImg.style.display='none';

    

        
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
        
        
        
}
const parametrosNuevoProducto=()=>{

    
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
        disponible.style.display ='block';
        precio.style.display ='block';
        descripcion.style.display ='block';
        
        
        
}

//Selector de función
seleccion.addEventListener("change", async ev=>{
    console.log('addEventListener',seleccion.value)
    
    if(seleccion.value=='nuevoUser'){
        parametrosNuevoUsuario();  
        estoyEn.innerHTML=` Estoy en :  ${seleccion.value} ` 
    }

    if(seleccion.value=='editarUser'){
        await parametrosEditarUsuario();

        console.log('id_user es',id_user.value) 

        if(id_user.value==''){
            divFormDatos.style.display ='none';            
            divFormImg.style.display='none'; 
        }
        
    }

    if(seleccion.value=='verUser')  parametrosVerUsuarios();  
    if(seleccion.value=='verCateg')  parametrosVerCategorias();
    if(seleccion.value=='nuevaCateg') parametrosNuevaCategoria();
    if(seleccion.value=='nuevoProd') parametrosNuevoProducto();
})
//submit Funcion (editar con ID)
 formFuncion.addEventListener('submit',  async (ev)=>{
    ev.preventDefault();//permite cancelar el evento sin detener el funcionamiento  
    estoyEn.innerHTML=` Estoy en :  ${seleccion.value} `      
    //console.log('id user es ', id_user.value)
    
    if(seleccion.value=='editarUser'){

        if(id_user.value!=''&&id_user.value.length> 10){

            console.log('voy a buscar em ',enlaceBuser+id_user.value)
            const resp =  await fetch(enlaceBuser+id_user.value,{});            
            const {results}=  await resp.json(); 
            usuarioEdit=results[0];
            console.log('usuarioEdit',usuarioEdit)
            if(usuarioEdit){
                funcionActual='editarUser'
                nombre.value=usuarioEdit.nombre;
                correo.value=usuarioEdit.correo;
                rol.value=usuarioEdit.rol;
                estado.value=usuarioEdit.estado;
                (usuarioEdit.img) 
                    ? fotoUser.src=usuarioEdit.img
                    : fotoUser.src='/js/goku.png';
                divFormDatos.style.display ='block';
                divFormImg.style.display='block';
                usarContraseña.style.visibility ='visible'; 
                password.disabled=true;
                password2.disabled=true;
                correo.disabled=true;
            }
        }else{funcionActual='' }                        
    }   
    if(seleccion.value=='nuevoUser') parametrosNuevoUsuario(); 
    if(seleccion.value=='verCateg') parametrosVerCategorias();
    if(seleccion.value=='nuevaCateg') parametrosNuevaCategoria();
    if(seleccion.value=='nuevoProd') parametrosNuevoProducto();
})


//Mostrar los usuarios
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

//Mostrar las categorías y usuarios 
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

            (data.disponible)
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








//Crear Usuario
const crearUsuario=()=>{
    const formData={};     
    formData['nombre']=nombre.value;
    formData['rol']=rol.value;
    formData['estado']=estado.value;    
    formData['password']=password.value;
    formData['correo']=correo.value;
    formData['img']='';
    

    console.log('formData SUBIR es ',formData)
    
    fetch(enlaceEditar,{
        method: 'POST',
        body: JSON.stringify(formData),//Contiene correo y password
        headers:{'Content-Type':'application/json'}
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then( (resp)=>{
        console.log('la respuesta Nuevo usuario es');
        console.log(resp)
        if(!resp.usuario.uid){
            return console.error('error');
        }        
        
        divFormDatos.style.display ='none';
        divFormImg.style.display='block';
        id_user.value=resp.usuario.uid;

    })
    .catch(err=>{
        console.log(err)
    })
}



//Accion editar usuarios
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
                editarUsuario(id_user.value);           
            }   
        }else{
            editarUsuario(id_user.value);   
        }

    }

    if(funcionActual=='nuevoUser'){
        if(password.value!=password2.value|| password.value.length<=5){
            (password.value.length<=5)
                ? window.alert('Debe tener mínimo 6 caracteres')
                : window.alert('Las contraseñas no son iguales')
        }else{
            console.log('voy a entrar a editarUsuario')
            crearUsuario(id_user.value);           
        }


    }

})
//Funcion editar Usuario
const editarUsuario=(id)=>{
    const formData={};          //Creo un arreglo con los elementos del formulario
    
    formData['nombre']=nombre.value;
    formData['rol']=rol.value;
    formData['estado']=estado.value;

    if(usarContraseña.checked){
        formData['password']=password.value;
    }

    console.log('formData es ',formData)
    
    fetch(enlaceEditar+id,{
        method: 'PUT',
        body: JSON.stringify(formData),//Contiene correo y password
        headers:{'Content-Type':'application/json'}
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then( ({usuario})=>{
        if(!usuario.nombre){
            return console.error('error');
        }
        //document.title='editando'+usuario.nombre
        change_button.style.backgroundColor= "#89ff5c";    
        change_button.style.color= '#3d3d3d';
    })
    .catch(err=>{
        console.log(err)
    })
}
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
//Subir Foto Usuario
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
            parametrosNuevoUsuario();
        }
        

        console.log('Success:', response.img)
    })
    .catch(error =>  console.warn(error))
    //.then(response => console.log('Success:', response))
  

})


//Volver al index
const salir=()=>{
    window.location='index.html';
}

const main = async () => {
    
    await validarJWT();
}
main();
//const socket = io();

