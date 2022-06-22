/** ----------------------------- APP CHAT --------------------------------------
 * 
 * Cualquier usuario autenticado puede usar el chat.
 * 
 * Se usan sockets para recibir mensajes y notificaciones en tiempo real
 * 
 * Puedes enviar mensajes a la sala general, crear una sala aparte y enviar mensajes por ahí
 * Estos mensajes en la sala general y salas aparte quedan guardados en el backend (10 mensajes)
 * 
 * Puedes enviar y recibir mensajes privados (los mensajes recibidos se borraran si reinicias la página)
 * 
 * Cualquier usuario puede editar su nombre, contraseña y foto de perfil.
 * Otras ediciones están validadas tanto en el front como en el back
 * 
 */

let usuario = null;
let socket  = null;

//Traigo los elementos del CHAT html
const sala       = document.querySelector('#sala');
const txtUid     = document.querySelector('#txtUid');
const txtmensaje = document.querySelector('#txtmensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const ulMensajesPriv = document.querySelector('#ulMensajesPriv');
const irSala   = document.querySelector('#irSala');
const btnSalir   = document.querySelector('#btnSalir');


const titulo_chat   = document.querySelector('#titulo_chat');


let myId='';


const enlace='/api/auth/' 
const enlaceAssets="../../assets/goku.png"
let privado = 'no'
//Leer los parametros del URL
const searchParams = new URLSearchParams(window.location.search);
let salat='';
//Si no está el parametro escritorio, dar error y volver al index
if (!searchParams.has('salaCHAT')){
    
    salat='';
    titulo_chat.innerHTML='Chat Sala General '
}else{
    salat=searchParams.get('salaCHAT');

    (salat=='')
        ? titulo_chat.innerHTML='Chat Sala General '
        : titulo_chat.innerHTML='Chat en Sala '+salat
}



console.log('sala es ',salat)




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
    if(!userDb){
        localStorage.clear();
        window.location='index.html' //redireccionamiento
    }  

    localStorage.setItem('token',tokenDB) //Renuevo el JWT
    usuario=userDb;
    myId=usuario.uid;
    document.title = usuario.nombre; //El texto de la pestaña de chat.html
    await conectarSocket()
} 

const conectarSocket = async()=>{

    socket=io({
        'extraHeaders':{//enviamos headers adicionales para esta conexión
            'c-token': localStorage.getItem('token'),
            'salat':salat
        }
    });

    socket.on('connect',()=>{console.log('sockets online')})
    socket.on('disconnect',()=>{console.log('sockets disconnect')});

    //Recibo el backend emite un arreglo con los ultimos mensajes del chat
    socket.on('recibir-mensajes',(payload)=>{
        dibujarMensajes(payload)//Los muestro en el front
    })

    //Mostrar en el front los usuarios conectados al chat
    socket.on('usuarios-activos',(payload)=>{
        dibujarUsuarios(payload)//Los muestro en el front
    })

    socket.on('mensaje-privado',(payload)=>{
        dibujarMensajesPriv(payload)//Los muestro en el front
    }) 

}




//Petición Fetch
function obtenerIMG ({usuario}) {
    return new Promise((resolve,reject)=>{
        fetch(enlaceSubir+usuario.uid,{
            method: 'GET',
            headers:{'Content-Type':'application/json'}
        })
        .then(response => response.blob())
        .then(imageBlob => {
            // Then create a local URL for that image and print it 
            const imageObjectURL = URL.createObjectURL(imageBlob);

            if(imageBlob){
                

                let reader = new FileReader();
                reader.readAsDataURL(imageBlob); // convierte el blob a base64 y llama a onload
                

                reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(imageBlob);


                localStorage.setItem('imgErr',imageObjectURL);
                return imageObjectURL
            }
            reject("Llorelo"+response.status)

        })
        .then((imageObjectURL)=> resolve(imageObjectURL)) 
        .catch((err) => reject(err));           
    })
}


const  dibujarUsuarios=async(usuarios=[])=>{
    let usersHtml='';
    //usuarios.forEach(({nombre,uid})=>{
        await usuarios.forEach(({usuario,salat:sal})=>{
        
        let imgPerfil=''
        if(usuario.img){

            imgPerfil=usuario.img
            
        
        }else{           
            //console.log('voy a traer la imagen de ', enlaceSubir + usuario.uid)
            //Obtener la imagen por medio de un GET al servidor         
            //obtenerIMG({usuario})
            imgPerfil='/js/goku.png'
        } 

        //console.log('la imagen de ',usuario.nombre,' es ',imgPerfil)
        
        //if (sal==sala.value){
        if (sal==salat){

            if(myId!=usuario.uid){
                usersHtml+=`
                <img src="${imgPerfil}" width="40" height="40> 
                <li>
                    <p>       
                        <a href=""></a>               
                        <a href="javascript:irPrivado('${usuario.uid}')" class="text-success">${usuario.nombre}</a>                   
                        
                        <span class="fs-6 text-muted">  ${usuario.uid}</span>
                        <span class="fs-6 text-muted">${sal}</span>
                    </p>
                </li>
                `
            }else{
                usersHtml+=`
                <img src="${imgPerfil}" width="40" height="40"> 
                <li>
                    <p>       
                                     
                        <span  class="text-success"> Yo: ${usuario.nombre}</span>                   
                        <span class="fs-6 text-muted">${sal}</span>
                    </p>
                </li>
                `
            }
                
            ulUsuarios.innerHTML=usersHtml
       
        }
            
    })
}

const dibujarMensajes=(mensajes=[])=>{
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
    localStorage.clear(); //borro el token                                         
    location.reload();//Reecargo la página
}


const main = async () => {
    await validarJWT();
}
main();
//const socket = io();

