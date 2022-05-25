

const miFormulario = document.querySelector('form'); //Formulario html

const enlace='/api/auth/'      

miFormulario.addEventListener('submit', ev=>{
    ev.preventDefault();//permite cancelar el evento sin detener el funcionamiento
    const formData={};

    //Creo un arreglo con los elementos del formulario
    for(let el of miFormulario.elements){
        if(el.name.length>0) 
        formData[el.name]=el.value
    }    
    
    //Petición POST para loguear (REST-SERVER)
    fetch(enlace+'login',{
        method: 'POST',
        body: JSON.stringify(formData),//Contiene correo y password
        headers:{'Content-Type':'application/json'}
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then(data=>{
        if(!data.msg){ //no pasó validaciones
            console.log('está super malo todo')
            return console.error(data.msg);
        }
        localStorage.setItem('token',data.token);//token al localstorage
        window.location='chat.html';//Redirecciono al chat
    })
    .catch(err=>{
        console.log(err)
    })
})

//Autenticación google
function handleCredentialResponse(response) {   
    const body={id_token: response.credential}; //obtengo el google Token
    fetch (enlace+'google',{ //hago la petición POST          
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body) //escribo el id_token en el body
    })        
        .then(resp=>resp.json())
        .then(({token})=>{ //Grabo el token en localstorage
            localStorage.setItem('token',token);
            window.location='chat.html'; //Redirecciono al chat
        })
        .catch(console.warn);           
}

const button=document.getElementById('google_signout')

//Sign Out de google
button.onclick=()=>{     
    google.accounts.id.disableAutoSelect() //Se recomienda tenerlo desactivado
    google.accounts.id.revoke(localStorage.getItem('email'),done=>{ //funcion para hacer logout
        localStorage.clear(); //borro el token                                         
        location.reload();//Reecargo la página
    });        
}