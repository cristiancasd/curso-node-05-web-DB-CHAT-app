
const miFormulario = document.querySelector('form');
const enlace='/api/auth/'     


miFormulario.addEventListener('submit', ev=>{
    ev.preventDefault();
    const formData={};

    for(let el of miFormulario.elements){
        if(el.name.length>0)    //Significa que el boton tiene el name
        formData[el.name]=el.value
    }
    
    console.log('formData es ...',formData)
    
    fetch(enlace+'login',{
        method: 'POST',
        body: JSON.stringify(formData),
        headers:{'Content-Type':'application/json'}
    })
    .then(resp =>resp.json()) //Extraemos el .json
    .then(data=>{
        if(!data.msg){
            console.log('está super malo todo')
            return console.error(data.msg);
        }
        localStorage.setItem('token',data.token);
        window.location='chat.html';
    })

    .catch(err=>{
        console.log(err)
    })


})


function handleCredentialResponse(response) {   

    console.log('hello');
    
                                             // Sign In
    //console.log(response.credential);            
    const body={id_token: response.credential};     //obtengo el google Token
    //console.log('el body es ....... ');
    //console.log(body);

    
    //let enlace='https://restserver-criss.herokuapp.com/api/auth/google' 
    

    //petición fetch ... es una promesa pero no regresa el body
    //sino un readableString, hay que serializarolo
    fetch (enlace+'google',           
        {    //hago la petición POST 
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(body)                  //escribo el id_token en el body
    })
        /*.then(resp=>resp.json())
        .then(resp=>{
            console.log('el location hostname es .... ')
            
            localStorage.setItem('email',resp.usuario.correo);  //guardo el correo para poder hacer el logOut
            console.log('respuesta de google.....')
            console.log(resp);
        })*/
        .then(resp=>resp.json())
        .then(({token})=>{
            localStorage.setItem('token',token);
            window.location='chat.html';
        })
        .catch(console.warn);           
}


const button=document.getElementById('google_signout')

button.onclick=()=>{                                            //Sign Out

    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect() //Se recomienda tenerlo desactivado

    google.accounts.id.revoke(localStorage.getItem('email'),done=>{  //funcion para hacer logout
        localStorage.clear();                                         //Botto el correo
        location.reload();
    });        
}