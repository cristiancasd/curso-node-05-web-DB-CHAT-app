

/** ----------------------------- APP gestor de ventas --------------------------------------
 * 
 * Los datos de los productos se encuentra en una base de datos, si estás autenticado con
 * el rol correcto te permite usar la app y hacer  las peticiones al back
 * 
 * La interfaz permite agregar la cantidad de productos que deseas y te dice el precio final
 * al montar el pedido, este se guarda en la base de datos y puedes proceder a hacer otro pedido
 * 
 * Puedes ver los pedidos generados y también marcarlos como anulados. 
 * 
 * Cada venta guarda el id del usuario que la generó
 * 
 * Si un usuario anula o reactiva una venta se le registra el id y se ve en la interfaz
 * 
 */

const div_tabla_pedidoActual = document.querySelector(`#div_tabla_pedidoActual`);
const button_montarPedido = document.querySelector(`#button_montarPedido`);


let usuario = null;
const enlace            =   '/api/auth/' 
const enlaceCategoria   =   '/api/categorias/'  
const enlaceProducto    =   '/api/productos/'  
const enlaceVentas      =   '/api/ventas/'  


const d=new Date()          //Día de hoy
let diaHoy=d.getDate()+'-'+(Number(d.getMonth())+1 ) +'-'+ d.getFullYear()

let mostrarPedidosHoy=[]    //Arreglo con los pedidios de hoy
let pedidosHoy=[]           //Arreglo con los pedidios de hoy
let pedidoActualObj={}      //Objeto con información del pedido actual(temporal) generado
let valorTotal=0;           //Valor total $ del pedido actual(temporal) generado



let ventas=[]               //Arreglo de obejos de días (cada día contiene dia, arregloVentas, estado, id)
let pedidosObj={}           //Objeto de pedidos con indice de id
let pedidosFecha={}         //Objeto de pedidos con indice de fecha


let prodObj={}              //Objeto con indice de nombre de productos
let prod_idObj={}           //Objeto con indice de id de producto
let cateObj={}              //Objeto con indice de nombre de categoría



// Validar el JWT en el frontEND
const validarJWT = async() => {

    //Traemos el token de localStorage
    const token = localStorage.getItem('token')||'';

    if (token.length <= 10){ //No hay token
        window.location='index.html' //redireccionamiento
        throw new Error('No hay token en el eservidor')
    }

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
    
    await actualizarPedidos();
    //console.log('addEventListener',seleccion.value)
    divCateProd.style.display='none'
    div_tabla_pedidoActual.innerHTML=''


    switch(accion){
        
        case 'tomarPedido'  :
            estoyEn.innerHTML= 'Estoy en: Tomar nuevo Pedido';
            divCateProd.style.display='block';            
            await actualizarCategorias()
            await actualizarProductos()       
            mostrarCP()     
            break;     

        case 'verPedidos'  :
            estoyEn.innerHTML= 'Estoy en: Ver pedidos';
            await actualizarCategorias()
            await actualizarProductos()
            mostrarPedidosCreados()            
            break;     

        case 'cancelarPedidos'  :
            estoyEn.innerHTML= 'Estoy en: Cancelar pedidos';
            await actualizarCategorias()
            await actualizarProductos()     
            cancelarMostrarPedidos();       
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



//*******************************     MOSTRAR      ******************************************** */
// Mostrar los productos, inputs de cantidades y buttons para agregar
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
                    min-width: 200px;
                    height:450px;
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
                        `

                    if(data.disponible=="true"){
                        cateProdHtml+=`    
                            <div class="input-group mb-3">
                                <input id="input_${data._id}"  type="number" class="form-control" placeholder="Cantidad" aria-label="a" aria-describedby="basic-addon2" min="1"
                                required>
                                <div class="input-group-append">
                                    <button 
                                    id="buttonAdd_${data._id}" 
                                    class="btn btn-primary" 
                                    name="${data._id}" 
                                    onclick="agregar(input_${data._id}.value,'${data._id}')"
                                    type="button">Agregar</button>
                                </div>
                            </div>
                        `
                    }

                        cateProdHtml+=`  
                        
                        </div>
                    </div>
                        
            `
        })
        cateProdHtml+=`</section>`
            
    })



    categoriasTodas.innerHTML=cateHtml
    cateProductos.innerHTML=cateProdHtml

    
}



//*******************************     TABLAS     ******************************************** */

const mostrarPedidosCreados = async() =>{
    
    //console.log('estoy en mostrarPedidosCreados')
    let tabla_pedidoActual=`
    <table class="table table-dark" >
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
    ventas.forEach((data,i)=>{
        //console.log('el valor es ... ',data)

                data.arregloVentas.forEach((valorTemp,v)=>{

                    tabla_pedidoActual+=`

                    <tr>
                        <th scope="row">${i+1} </th>
                        <td>${data.dia}</td>
                        `

                    let nombres = Object.keys(valorTemp.pedido); 
                    let prodHtml='';
                    let cantHtlm='';
                    for(let ii=0; ii< nombres.length; ii++){
                        let nombre = nombres[ii];
                        //console.log('valorTemp.pedido esss',valorTemp.pedido)
                        //console.log('nombre esss',nombre)
                        //console.log('valorTemp.pedido[nombre] ess',valorTemp.pedido[nombre])
                        prodHtml+=
                        `
                            ${nombre}<br>                      
                        `
                        cantHtlm+=
                        `
                        ${valorTemp.pedido[nombre].cantidad}<br>                         
                        `
                    }

                    tabla_pedidoActual+=
                    '<td>' + prodHtml  +  '</td> ' +
                    '<td>' +  cantHtlm +  '</td>'
                    
                    tabla_pedidoActual+=`
                        <td>${data.arregloVentas[v].total}</td>
                        <td>${data.arregloVentas[v].creado}</td>
                        <td>${data.arregloVentas[v].anulado}</td>
                        <td>${data.arregloVentas[v].anuladoPor}</td>
                    `
                    tabla_pedidoActual+=`
                </tr>
                `
                })          
    })
    tabla_pedidoActual+=`
    </tbody>
    </table>`

    div_tabla_pedidoActual.innerHTML=tabla_pedidoActual 
}

const cancelarMostrarPedidos = async() =>{
    
    console.log('estoy en cancelarMostrarPedidos')

    let tabla_pedidoActual=`
    <table class="table table-dark">
    <thead>
    <tr>
        <th scope="col">#</th>
        <th scope="col">No</th>
        <th scope="col">Productos</th>
        <th scope="col">Cantidad</th>
        <th scope="col">Total</th>
        <th scope="col">Creado Por</th>
        <th scope="col">anulado</th>
        <th scope="col">Anular</th>

        <th scope="col">Anulado Por</th>
    </tr>
    </thead>
    <tbody>  
    `
    ventas.forEach((data,i)=>{
        //console.log('el valor es ... ',data)

                data.arregloVentas.forEach((valorTemp,v)=>{

                    tabla_pedidoActual+=`

                    <tr>
                        <th scope="row">${i+1} </th>
                        <td>${data.dia}</td>
                        `

                    let nombres = Object.keys(valorTemp.pedido); 
                    let prodHtml='';
                    let cantHtlm='';
                    for(let ii=0; ii< nombres.length; ii++){
                        let nombre = nombres[ii];
                        //console.log('valorTemp.pedido esss',valorTemp.pedido)
                        //console.log('nombre esss',nombre)
                        //console.log('valorTemp.pedido[nombre] ess',valorTemp.pedido[nombre])
                        prodHtml+=
                        `
                            ${nombre}<br>                      
                        `
                        cantHtlm+=
                        `
                        ${valorTemp.pedido[nombre].cantidad}<br>                         
                        `
                    }

                    tabla_pedidoActual+=
                    '<td>' + prodHtml  +  '</td> ' +
                    '<td>' +  cantHtlm +  '</td>'
                    


                    if(data.arregloVentas[v].anulado){
                        tabla_pedidoActual+=`
                            <td>${data.arregloVentas[v].total}</td>
                            <td>${data.arregloVentas[v].creado}</td>
                            <td>${data.arregloVentas[v].anulado}</td>
                            <td>
                                <button 
                                    id="buttonAnular_${v}" 
                                    class="btn btn-outline-success" 
                                    name="${data.uid}" 
                                    onclick="anular(${i},'${data.uid}',${v},'convalidar')"
                                    type="button">Validar
                                </button>
                            </td>

                            <td>${data.arregloVentas[v].anuladoPor}</td>
                        `
                    }else{
                        tabla_pedidoActual+=`
                            <td>${data.arregloVentas[v].total}</td>
                            <td>${data.arregloVentas[v].creado}</td>
                            <td>${data.arregloVentas[v].anulado}</td>
                            <td>
                                <button 
                                    id="buttonAnular_${v}" 
                                    class="btn btn-outline-danger" 
                                    name="${data.uid}" 
                                    onclick="anular(${i},'${data.uid}',${v},'anular')"
                                    type="button">Anular
                                </button>
                            </td>

                            <td>${data.arregloVentas[v].anuladoPor}</td>
                        `
                    }
                    tabla_pedidoActual+=`
                </tr>
                `
                })
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
        <table class="table table-dark">
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
    valorTotal=0;
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


//***************************************   ACCIONES BUTTONS  **************************************************** */

// Button --- Función agregar producto al pedido temporal
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

// Button ---  Función SUBIR pedido NUEVO db
const montarPedido = async() =>{


    if(!(Object.entries(pedidoActualObj).length === 0)){
        
        let crud='POST';
        
        (mostrarPedidosHoy.length==0)
            ? crud='POST'       
            : crud='PUT';
        
            
        pedidosHoy=mostrarPedidosHoy;

        let objPedido={
            'pedido':pedidoActualObj,
            'total': valorTotal,
            'creado': usuario.uid,
            'anulado':false,
            'anuladoPor':''  
        }
        pedidosHoy.push(objPedido)
        //console.log('pedidosHoy es ',pedidosHoy)
        pedidoActualObj={}
        div_tabla_pedidoActual.innerHTML='';

        (crud==="PUT")
            ? await editar_db('nuevoPedido',pedidosHoy,crud, pedidosFecha[diaHoy].uid)
            : await editar_db('nuevoPedido',pedidosHoy,crud, '');
    }
}

// Button ---  Función ANULAR pedido db
const anular = async(posicionVector,id_anular,variable,funcion) =>{
    //console.log('el posicionVector a anular es ...',posicionVector)
    //console.log('el id a anular es ...',id_anular)
    //console.log('variable anular es ...',variable)
    //console.log('pedidosObj[id_anular] es ...',pedidosObj[id_anular])
    //console.log('pedidosObj[id_anular].arregloVentas[v] es ...',pedidosObj[id_anular].arregloVentas[variable])
    
    if(funcion=='anular'){
        pedidosObj[id_anular].arregloVentas[variable].anulado=true;
    }else{
        pedidosObj[id_anular].arregloVentas[variable].anulado=false;
    }
    pedidosObj[id_anular].arregloVentas[variable].anuladoPor=usuario.uid;

    ventas[posicionVector]=pedidosObj[id_anular]
    //console.log('ventas es ', ventas);
    await editar_db('editarPedido',pedidosObj[id_anular].arregloVentas,'PUT',id_anular)
    await cancelarMostrarPedidos();
}

// CRUD MONTAR pedido o ANULAR pedido
const editar_db = async(funcion,arreglo, accion,id) =>{
    let formData={};     
    let enlace='';
    let crud=accion;
    
    let fecha=  (Number(d.getMonth())+1 ) +'-'+ d.getFullYear()

        if(funcion=='nuevoPedido'){
            if(crud=='POST'){
                enlace=enlaceVentas;
            }else{
                //console.log('pedidosFecha[diaHoy]',pedidosFecha[diaHoy])
                enlace=enlaceVentas+pedidosFecha[diaHoy].uid
            }
        
        formData['dia']=diaHoy;
        formData['fecha']=fecha;
        formData['arregloVentas']=arreglo;
        formData['rol']=usuario.rol;
        
        }

        if(funcion=='editarPedido'){

            formData['arregloVentas']=arreglo;
            formData['rol']=usuario.rol;
            enlace=enlaceVentas+id;
        }

        //console.log('crud es ',crud)
        //console.log('formData es ',formData)
        //console.log('el enlace es ',enlace)
        

        await fetch(enlace,{
            method: crud,
            body: JSON.stringify(formData),
            headers:{
                'Content-Type':'application/json',
                'c-token':localStorage.getItem('token')
            }
        })
        .then(resp =>resp.json()) //Extraemos el .json
        .then( async (resp)=> {
            //console.log('la respuesta de la petición es');
            //console.log(resp)
            if(!resp.venta){
                if(!resp.dia){
                    return console.error('error');
                }
            } 
            //divFormDatos.style.display ='none';
            //divFormImg.style.display='block';
            
            actualizarPedidos()
            button_montarPedido.style.backgroundColor= "#89ff5c";    
            button_montarPedido.style.color= '#3d3d3d';
            
            setTimeout(function(){
                //console.log('estoy en el temporizador')
                button_montarPedido.style.backgroundColor= "blue";    
                button_montarPedido.style.color= 'white';
                }, 1200);

        })
        .catch(err=>{
            console.log(err) 
        })
}



//************************************ Crear objetos User, Prod, Catg ******************************************************** */

const actualizarCategorias=async ()=>{
    //console.log('estoy en actualizarCategorias')
    const resp = await fetch(enlaceCategoria,{});    
    const {categorias}= await resp.json();     
    categorias.forEach((valor)=>{
        cateObj[valor.nombre]=valor._id
    })     
}

const actualizarProductos=async ()=>{
    const resp = await fetch(enlaceProducto,{});    
    const {productos}= await resp.json(); 
    productos.forEach((valor)=>{
        prodObj[valor.nombre]=valor;
        prod_idObj[valor._id]=valor        
    })        
}

const actualizarPedidos=async ()=>{

    await fetch(enlaceVentas,{
        method: 'GET',
        headers:{
            'Content-Type':'application/json',
            'c-token':localStorage.getItem('token')
        }
    })

    .then(resp =>resp.json()) //Extraemos el .json
    .then( async (resp)=> {
        //console.log('la respuesta de la petición es');
        //console.log(resp)
        if(resp.total==0){
            return console.error('No hay ventas guardadas');
        }         
        ventas=  resp.ventas; 
        //console.log(ventas)    
        ventas.forEach((valor)=>{
            pedidosObj[valor.uid]=valor
            pedidosFecha[valor.dia]=valor
        }) 
        if(pedidosFecha[diaHoy]){
            mostrarPedidosHoy=pedidosFecha[diaHoy].arregloVentas;            
        }           
    })
}


//Volver al index
const salir=()=>{
    window.location='index.html';
}

const main = async () => {

    
    
    await validarJWT();
}
main();
//const socket = io();

