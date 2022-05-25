require("colors");
const path           = require("path")
const { v4: uuidv4 } = require('uuid');

//recibimos las extensiones permitidas, por defecto son imagenes , escojo carpeta donde guardar el archivo
const subirArchivo=(files,extensionesValidas=['png','jpg','jpeg','gif'],carpeta='')=>{

    return new Promise((resolve,reject)=>{

        const {archivo} = files;
        const nombreCortado = archivo.name.split('.'); // separar en un arreglo los valores que separan los puntos
        const extension = nombreCortado[nombreCortado.length-1] //El ultimo valor corresponde a la extensión
        
        //validar extensión del archivo recibido
        if(!extensionesValidas.includes(extension)){
            //El return es para que no se siga usando
            return reject(`La extensión ${extension} no es permitida, ${extensionesValidas}`
          )
        }    
        const nombreTemp=uuidv4()+'.'+extension;  //Creo id unico 
        //La carpeta uploads está en la raiz, creo path con el archivo
        let uploadPath = path.join( __dirname, '../uploads/', carpeta,nombreTemp);
    
        archivo.mv(uploadPath, (err)=>{   //Guardo archivo, si la carpeta no existe, la crea
          if (err) {
            reject(err);
          }  
          resolve(nombreTemp)
        });
    })     
}
module.exports={subirArchivo}
