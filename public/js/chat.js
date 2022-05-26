let usuario = null;
let socket  = null;

//Traigo los elementos del html
const sala       = document.querySelector('#sala');
const txtUid     = document.querySelector('#txtUid');
const txtmensaje = document.querySelector('#txtmensaje');
const ulUsuarios = document.querySelector('#ulUsuarios');
const ulMensajes = document.querySelector('#ulMensajes');
const irSala   = document.querySelector('#irSala');
const btnSalir   = document.querySelector('#btnSalir');

const enlace='/api/auth/' 

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


//Defino la sala
//const miForm = document.querySelector('form');
//miForm.addEventListener('submit',ev=>{
    //ev.preventDefault();
   // let salat  = sala.value;
    //console.log(salat)
    //socket.emit('user-sala',{salat})   
//})


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
        console.log('Privado:',payload)
    }) 

   

}

const dibujarUsuarios=(usuarios=[])=>{
    let usersHtml='';
    //usuarios.forEach(({nombre,uid})=>{
        usuarios.forEach(({usuario,salat:sal})=>{
        
        //if (sal==sala.value){
        if (sal==salat){
            usersHtml+=`
            <li>
                <p>               
                    <h5 class="text-success">${usuario.nombre}</h5>
                    <spanclass="fs-6 text-muted">${usuario.uid}</span>
                    <spanclass="fs-6 text-muted">${sal}</span>
                </p>
            </li>
            `
            ulUsuarios.innerHTML=usersHtml
        }
            
    })
}

const dibujarMensajes=(mensajes=[])=>{
    console.log('estoy en dibujar mensajes ')
    var salaF  = salat //sala.value;
    let mensajesHtml=`<p>Sala ${salaF} </p>`;
    mensajes.forEach(({nombre,mensaje,sala})=>{
        //console.log('salaF ',salaF);
        //console.log('salaF ',sala);

       if(salaF==sala){
        //console.log('condicional ');
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

const main = async () => {
    await validarJWT();
}
main();
//const socket = io();

