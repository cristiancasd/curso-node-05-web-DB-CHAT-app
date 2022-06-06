
let usuario = null;

//Traigo los elementos del erditarPerfil html
const formSubirImagen     = document.querySelector('#formSubirImagen');
const formCambiarDatos     = document.querySelector('#formCambiarDatos');
const fileupload     = document.querySelector('#fileupload');
const fotoUser       = document.querySelector('#fotoUser');
const nombre     = document.querySelector('#nombre');
const password = document.querySelector('#password');
const password2 = document.querySelector('#password2');

const upload_button = document.querySelector('#upload_button');
const change_button = document.querySelector('#change_button');


const enlace='/api/auth/' 
const enlaceSubir='/api/uploads/usuarios' 
const enlaceAssets="../../assets/goku.png"
const enlaceEditar='/api/usuarios/' 


var nombre_imagen='';

// Validar el JWT en el frontEND
const validarJWT = async() => {
    
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
    document.title = 'editando '+usuario.nombre; //El texto de la pestaña de chat.html

    if(usuario.img){
        fotoUser.src=usuario.img
        nombre_imagen=usuario.img;
    }else{
        fotoUser.src='/js/goku.png'
    }
    
    nombre.value=usuario.nombre

    if(usuario.google){
        password.disabled="true";
        password2.disabled="true";
    }
    
} 




//Subir Foto Put
formSubirImagen.addEventListener('submit', ev=>{
    ev.preventDefault();//permite cancelar el evento sin detener el funcionamiento       
    

    //creating form data object and append file into that form data
    let formData = new FormData(); 
   
    formData.append('archivo', fileupload.files[0]);
  
    fetch(enlaceSubir+'/'+usuario.uid, { 
        method: "PUT", 
        body: formData
    })    
    .then(response => response.json())
    .then(response=>{ //Grabo el token en localstorage
        
        if(!response.img){
            console.log('está super malo todo')
            return console.error(data.msg);
        }
        upload_button.style.backgroundColor= "#89ff5c";    
        upload_button.style.color= '#3d3d3d';
        fotoUser.src=response.img

        console.log('Success:', response.img)
    })
    .catch(error =>  console.warn(error))
    //.then(response => console.log('Success:', response))
  

})

//Cambiar Datos
formCambiarDatos.addEventListener('submit', ev=>{

    ev.preventDefault();        //No recargar página    
    const formData={};          //Creo un arreglo con los elementos del formulario

    if(password.value!=password2.value|| password.value.length<=5){
        
        (password.value.length<=5)
            ? window.alert('Debe tener mínimo 6 caracteres')
            : window.alert('Las contraseñas no son iguales')
    }else{
        for(let el of formCambiarDatos.elements){
            if(el.name.length>0) 
            formData[el.name]=el.value
        } 
        formData['rol']=usuario.rol;
        
        fetch(enlaceEditar+usuario.uid,{
            method: 'PUT',
            body: JSON.stringify(formData),//Contiene correo y password
            headers:{'Content-Type':'application/json'}
        })
        .then(resp =>resp.json()) //Extraemos el .json
        .then( ({usuario})=>{
            if(!usuario.nombre){
                return console.error('error');
            }
            document.title='editando'+usuario.nombre
            change_button.style.backgroundColor= "#89ff5c";    
            change_button.style.color= '#3d3d3d';
        })
        .catch(err=>{
            console.log(err)
        })
    }

    
    
})





const salir=()=>{
    window.location='chat.html';
}


const main = async () => {
    
    await validarJWT();
    
    

}
main();
//const socket = io();

