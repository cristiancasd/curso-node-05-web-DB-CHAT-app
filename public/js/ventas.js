

const div_tabla_pedidoActual = document.querySelector(`#div_tabla_pedidoActual`);


let usuario = null;
const enlace            =   '/api/auth/' 
const enlaceCategoria   =   '/api/categorias/'  
const enlaceProducto    =   '/api/productos/'  



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
    
    if(userDb.rol!='ADMIN_ROLE'&&userDb.rol!='VENTAS_ROL') window.location='index.html'
    
    document.title = 'VENTAS '+usuario.nombre; //El texto de la pestaña de chat.html

    parametrosIniciales(seleccion.value) //parametrosUsuario();

} 
const parametrosIniciales=async(accion)=>{
    
    console.log('addEventListener',seleccion.value)

    divCateProd.style.display='none'

    switch(accion){
        
        case 'tomarPedido'  :
            divCateProd.style.display='block';            
            await actualizarCategorias()
            await actualizarProductos()       
            mostrarCP()     
            break;     

        case 'verPedidos'  :
            await actualizarCategorias()
            await actualizarProductos()
            mostrarPedidosCreados()            
            break;     

        case 'verPedidos'  :
            await actualizarCategorias()
            await actualizarProductos()            
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



const mostrarCP = async() =>{


    const resp = await fetch(enlaceCategoria,{});
    const {total, categorias}= await resp.json(); 

    const resp2 = await fetch(enlaceProducto,{});
    const {total:totalP, productos}= await resp2.json(); 

    categorias.push({'nombre':'OTROS'});
    let cateHtml='';
    let cateProdHtml='';
    let arregloCate=[];
    let arregloCateObj={};
    //let arregloCate=['OTROS'];
    //let arregloCateObj={'OTROS':[]};

    
    
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

  
    let h=0;
    //Separo productos por categoria
    productos.forEach((data)=>{
        h=0;
        
        arregloCate.forEach((valor,i)=>{

            if(data.categoria){ //Si se ha borrado la categoría esta es null
                if(valor==data.categoria.nombre){
                    arregloCateObj[valor].push(data)
                    h=1;
                }
            }
        })
        if(h==0){
            arregloCateObj['OTROS'].push(data)
        }
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
                    height:500px;
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
                            
                            <div class="input-group mb-3">
                                <input id="input_${data._id}"  type="number" class="form-control" placeholder="Cantidad" aria-label="a" aria-describedby="basic-addon2" required>
                                <div class="input-group-append">
                                    <button 
                                    id="buttonAdd_${data._id}" 
                                    class="btn btn-primary" 
                                    name="${data._id}" 
                                    onclick="agregar(input_${data._id}.value,'${data._id}')"
                                    type="button">Agregar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                        
            `
        })
        cateProdHtml+=`</section>`
            
    })



    categoriasTodas.innerHTML=cateHtml
    cateProductos.innerHTML=cateProdHtml

    
}


let pedidoActualObj={}
const agregar = async(cantidad,nombreButton) =>{   
    
    const id_button = document.querySelector(`#buttonAdd_${nombreButton}`);
    const id_input = document.querySelector(`#input_${nombreButton}`);

    if(cantidad>0){
        
        let nombre=prod_idObj[nombreButton].nombre
        pedidoActualObj[nombre]={
            'cantidad':id_input.value,
            'valorParcial': id_input.value*prod_idObj[nombreButton].precio ,
        }       
        
        id_input.value=0;        
        id_button.style.backgroundColor= "green";    
        id_button.style.color= 'white';
        id_button.disabled=true;
        setTimeout(function(){
            id_button.style.backgroundColor= "blue";    
            id_button.style.color= 'white';
            id_button.disabled=false;
            }, 700);

        verPedidoActual();
    }
}

let valorTotal=0;




let pedidosHoy=[]
const montarPedido = async() =>{

    let objPedido={
        'pedido':pedidoActualObj,
        'total': valorTotal,
        'creado': usuario.uid,
        'anulado':false,
        'anuladoPor':''  
    }

    pedidosHoy.push(objPedido)
    console.log('pedidosHoy es ',pedidosHoy)
    pedidoActualObj={}
    div_tabla_pedidoActual.innerHTML=''

}


const mostrarPedidosCreados = async() =>{
    console.log('estoy en mostrarPedidosCreados')
    let tabla_pedidoActual=`
    <table class="table">
    <thead>
    <tr>
        <th scope="col">#</th>
        <th scope="col">No</th>
        <th scope="col">Productos</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Total</th>
        <th scope="col">Creado Por</th>
        <th scope="col">anulado</th>
        <th scope="col">Anulado Por</th>
    </tr>
    </thead>
    <tbody>  
    `
    pedidosHoy.forEach((data,i)=>{
        console.log('el valor es ... ',data)


        tabla_pedidoActual+=`

            <tr>
                <th scope="row">${i+1} </th>
                <td>1</td>
                `


                let nombres = Object.keys(data.pedido); 
                let prodHtml='';
                let cantHtlm='';
                for(let i=0; i< nombres.length; i++){
                  let nombre = nombres[i];
                  
                  prodHtml+=
                    `
                        ${nombre}<br>                      
                    `
                    cantHtlm+=
                    `
                    ${data.pedido[nombre].cantidad}<br>                         
                    `
                }

                tabla_pedidoActual+=
                '<td>' + prodHtml  +  '</td> ' +
                '<td>' +  cantHtlm +  '</td>'
                

        tabla_pedidoActual+=`
                <td>${data.total}</td>
                <td>${data.creado}</td>
                <td>${data.anulado}</td>
                <td>${data.anuladoPor}</td>
            </tr>
            `


    })


    

    tabla_pedidoActual+=`
    </tbody>
    </table>

`
div_tabla_pedidoActual.innerHTML=tabla_pedidoActual

}



const verPedidoActual = async() =>{       

    //console.log(pedidoActualObj)

    let tabla_pedidoActual=`
        <table class="table">
            <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Producto</th>
                <th scope="col">Cantidad</th>
                <th scope="col">V. Parcial</th>
            </tr>
            </thead>
            <tbody>`

    
    let nombres = Object.keys(pedidoActualObj); 
    for(let i=0; i< nombres.length; i++){
      let nombre = nombres[i];
      valorTotal+=pedidoActualObj[nombre].valorParcial;
      tabla_pedidoActual+=
        `<tr>
            <th scope="row">${i+1} </th>
            <td>${nombre}</td>
            <td>${pedidoActualObj[nombre].cantidad}</td>
            <td>${pedidoActualObj[nombre].valorParcial}</td>
        </tr>
        `
    }



         tabla_pedidoActual+=`             <tr>
                        <th scope="row">Total</th>
                        <td></td>
                        <td></td>
                        <td>$ ${valorTotal}</td>
                    </tr>
        </tbody>
        </table>
    `
    
    

    div_tabla_pedidoActual.innerHTML=tabla_pedidoActual
}






//************************************ Crear objetos User, Prod, Catg ******************************************************** */


let cateObj={}
const actualizarCategorias=async ()=>{
    console.log('estoy en actualizarCategorias')
    const resp = await fetch(enlaceCategoria,{});
    
    const {categorias}= await resp.json(); 
    
    categorias.forEach((valor)=>{
        cateObj[valor.nombre]=valor._id
        //console.log('el valor.estado es ',valor)        
    })     
}
let prodObj={}
let prod_idObj={}
const actualizarProductos=async ()=>{

    console.log(' estoy en actualizarProductos')
    const resp = await fetch(enlaceProducto,{});
    
    const {productos}= await resp.json(); 
    let cateHtml=''
    productos.forEach((valor)=>{
        prodObj[valor.nombre]=valor;
        prod_idObj[valor._id]=valor
        
    })        
}





//Volver al index
const salir=()=>{
    window.location='index.html';
}

const main = async () => {await validarJWT();}
main();
//const socket = io();

