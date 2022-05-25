const {OAuth2Client} = require('google-auth-library');
require('colors')
console.log('google-verify.js ... voy a crear un nuevo client'.blue)

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
console.log('ya cree cliente'.blue)


//async function googleVerify(token='') {             //Recibo el token dado por google
const googleVerify=async(token='') =>{ 
    console.log("estoy en googleVerifity función asincrona");

    console.log("idToken ......",token);
    console.log("audience: ++++++++++++ ",process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: token,
        requiredAudience:process.env.GOOGLE_CLIENT_ID
        //audience: process.env.GOOGLE_CLIENT_ID
    });

    console.log('ticket ***********',ticket);
    
    const payload = ticket.getPayload();

    console.log('payload ***********',payload);

    console.log('--------------------------------------++++++---------------'.red, payload);
    const {name,picture,email}=ticket.getPayload(); //Payload tiene la información del usuario google
    return{                                         //Retorno información de usuario
        nombre: name, 
        img: picture, 
        correo: email
    }
  }
  
  module.exports={
      googleVerify
  }

