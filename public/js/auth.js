
const categoriasTodas = document.querySelector('#categoriasTodas'); 
const cateProductos   = document.querySelector('#cateProductos'); 

const admin_rol   = document.querySelector('#admin_rol'); 
const ventas_rol   = document.querySelector('#ventas_rol'); 
const user_rol   = document.querySelector('#user_rol'); 
const userLog   = document.querySelector('#userLog'); 

const miFormulario = document.querySelector('form'); //Formulario html

const enlace='/api/auth/'  
const enlaceCategoria='api/categorias'   
const enlaceProducto='api/productos'      



const mostrar = async() =>{


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

    await validarJWT()
}


// Validar el JWT en el frontEND
const validarJWT = async() => {
    
    //Traemos el token de localStorage
    const token = localStorage.getItem('token')||'';

    if (token.length <= 10){ //No hay token
        //throw new Error('No hay token en el eservidor')
        console.log('no hay Token')
        return
    }

    //hago la petición get y para renovar token
    const resp = await fetch(enlace,{   
        headers:{'c-token':token}
    });

    //la respuesta de la petición tiene estos dos valores y los clono
    const {usuario: userDb, token:tokenDB}= await resp.json(); 
    localStorage.setItem('token',tokenDB) //Renuevo el JWT
    usuario=userDb;
    myId=usuario.uid;
    document.title = usuario.nombre; //El texto de la pestaña de chat.html

    verRole(usuario.rol,usuario.nombre)  
} 


miFormulario.addEventListener('submit', ev=>{
    ev.preventDefault();//Que en el submit no se recargue la pagina
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


        verRole(data.usuario.rol, data.usuario.nombre)
        

        //window.location='chat.html';//Redirecciono al chat
        //window.location='autenticado.html'
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
        //.then(({token})=>{ //Grabo el token en localstorage
            //localStorage.setItem('token',token);
            //window.location='chat.html'; //Redirecciono al chat
        .then((data)=>{ //Grabo el token en localstorage
                
            localStorage.setItem('token',data.token);
       

            verRole(data.usuario.rol,data.usuario.nombre)
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

const verRole=(role,nombre) =>{
    userLog.innerHTML=`Usuario: ${nombre}     ROL:  ${role}`
    switch(role){
        case 'USER_ROLE':
            user_rol.style.visibility ='visible';
            ventas_rol.style.visibility ='hidden';
            admin_rol.style.visibility ='hidden';              break;              
        case 'ADMIN_ROLE':
            user_rol.style.visibility ='visible';
            ventas_rol.style.visibility ='visible';
            admin_rol.style.visibility ='visible';              
            break;
        case 'VENTAS_ROL':
            user_rol.style.visibility ='visible';
            ventas_rol.style.visibility ='visible';
            admin_rol.style.visibility ='hidden';  
            break;            
        default:
            console.log('No existe role');
        }
}

const main = async () => {
    await mostrar();
}
main();