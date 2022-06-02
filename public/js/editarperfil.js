

let usuario = null;
let socket  = null;

//Traigo los elementos del html
const fileupload = document.querySelector('#fileupload');
const sala       = document.querySelector('#sala');
const txtUid     = document.querySelector('#txtUid');
const txtmensaje = document.querySelector('#txtmensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const ulMensajesPriv = document.querySelector('#ulMensajesPriv');
const irSala   = document.querySelector('#irSala');
const btnSalir   = document.querySelector('#btnSalir');

//Traigo los elementos del erditarPerfil html
const fotoUser = document.querySelector('#fotoUser');
const nombreUser       = document.querySelector('#nombreUser');
const correoUser     = document.querySelector('#correoUser');
const contrasenaUser = document.querySelector('#contrasenaUser');



const enlace='/api/auth/' 
const enlaceSubir='/api/uploads/usuarios' 
const enlaceAssets="../../assets/goku.png"
let privado = 'no'
//Leer los parametros del URL
const searchParams = new URLSearchParams(window.location.search);
let salat='';
//Si no está el parametro escritorio, dar error y volver al index
if (!searchParams.has('salaCHAT')){
    
    salat='';
}else{
    salat=searchParams.get('salaCHAT');
}

console.log('salat es B',salat)




// Validar el JWT en el frontEND
const validarJWT = async() => {
    
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
    document.title = usuario.nombre; //El texto de la pestaña de chat.html
    await conectarSocket()
} 




async function uploadFileP() {
    
    //creating form data object and append file into that form data
    let formData = new FormData(); 
    console.log('fileupload.files[0]', fileupload.files[0])
   
    formData.append("accountnum", 123456);
    formData.append('archivo', fileupload.files[0]);
    formData.append("username", "Groucho");
    
    for (var pair of formData.entries()) {
        console.log(pair[0]+ ', ' + pair[1]); 
    }

    await fetch(enlaceSubir+'/'+usuario.uid, { 
        method: "PUT", 
        //body: JSON.stringify(formData),
        body: formData//,
        //headers:{'Content-Type':'application/json'}        
    })
    
    .then(response => response.json())
    .catch(error =>  console.warn(error))
    .then(response => console.log('Success:', response));   
    location.reload();

}






const dibujarMensajes=(mensajes=[])=>{
    console.log('estoy en dibujar mensajes ')
    var salaF  = salat //sala.value;
    let mensajesHtml=`<p>Sala ${salaF} </p>`;
    mensajes.forEach(({nombre,mensaje,sala})=>{
        //console.log('salaF ',salaF);
        //console.log('salaF ',sala);


        if(salaF==sala){
                mensajesHtml+=`
                <li>
                    
                    <p>
                        <span class="text-primary">${nombre}</span>
                        <span>${mensaje}</span>
                    </p>
                </li>
                `
                ulMensajes.innerHTML=mensajesHtml
            }else{                           
            }

    })
}


let arreglo_priv=[]
let cont_priv=0
const dibujarMensajesPriv=({usuario:user,mensaje:mens})=>{
    console.log('estoy en dibujar mensajes Privados')   
    //console.log('usuario ',usuario)  
    //console.log('mensaje ',mensaje)  
    
    //let mensajesHtml=`<p>Privado ${usuario.nombre} id:${usuario.uid} </p>`;
    let usuarioA=user
    let mensajeA=mens

    arreglo_priv.unshift(
        {usuarioA, mensajeA}
    )
    if(arreglo_priv.length>10){
        arreglo_priv.splice(-1,1)      //-1 es ultima posición del arreglo  y 1 es cortar un elemento 
    }


    console.log('arreglo_priv',arreglo_priv)

    let mensajesHtml=`<p> Mensajes Privados </p>`;

    arreglo_priv.forEach(({usuarioA,mensajeA})=>{
                mensajesHtml+=`
                <li>                    
                    <p>
                        <span class="text-primary">${usuarioA.nombre}</span>
                        <span>${mensajeA}</span>
                    </p>
                </li>
                `
    })
    
    ulMensajesPriv.innerHTML=mensajesHtml
        
                //Ventana para mensajes privados. En desarrollo
                //window.open("privado.html?id="+usuario.uid)
                
}

//Cuando tecleo y undo enter envío mensaje a los demás clientes
txtMensaje.addEventListener('keyup',({keyCode})=>{
    const mensaje  = txtMensaje.value;
    const uid      = txtUid.value
    //var salat  = sala.value;
    if(keyCode !=13){return;} //13 corresponde al enter
    if(mensaje.length===0){return;}
    //Emito all backend, paso el mensaje y mi id
    socket.emit('enviar-mensaje',{uid,mensaje,salat})
    txtMensaje.value = '';
})

const irPrivado=(id)=>{
    txtUid.value=id
    //console.log('el id es', id)
    //var edad = prompt('Cuantos años tienes?', '100');
}







const salir=()=>{
    console.log('estoy en salir')
    localStorage.clear(); //borro el token                                         
    location.reload();//Reecargo la página
}


const main = async () => {
    await validarJWT();
}
main();
//const socket = io();

