
const mongoose=require('mongoose');
require('colors');

//Función conectarse base de datos
const dbConnection = async() =>{
    try{
        console.log('intentando entrar a la base de datos'.yellow)
        await mongoose.connect(process.env.MONGODB_CNN,{
            useNewUrlParser:true,
            useUnifiedTopology:true             
        });
        console.log('base de datos online')

    }catch(error){
        console.log(error);
        throw new Error('Error a la hora de iniciar base de datos'.green)
    }
}

module.exports= dbConnection 

