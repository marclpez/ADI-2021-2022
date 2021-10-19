//Cargamos el módulo express
var jwt = require('jwt-simple')
var moment = require('moment')
var express = require('express');
var app = express();
app.use(express.json())

var users = new Map()
users.set("pepe", {login:"pepe", password:"pepe"})
users.set("adi", {login:"adi", password:"adi"})

var secret = '123456'

//En una app con autentificación basada en Token, el login genera y devuelve el token
app.post('/miapi/login', function(pet, resp){
    var loginBuscado = pet.body.login
    var passwordBuscado = pet.body.password
    var user = users.get(loginBuscado)
    if (user && user.password==passwordBuscado) {
        var payload = {
          login: loginBuscado,
          exp: moment().add(7, 'days').valueOf()
        }
        var token = jwt.encode(payload, secret)
        resp.send({token: token, mensaje:"OK"})
    }
    else {
        resp.send(403).end()
    }
})

//Middleware: lo pondremos ANTES de procesar cualquier petición que requiera autentificación
function chequeaJWT(pet, resp, next) {

    var token = getTokenFromAuthHeader(pet)

    try{
      jwt.decode(token, secret) //si no lanza excepcion pasamos al siguiente middleware
      next()
    }
    catch{
        resp.status(403)
        resp.send({mensaje: "no tienes permisos"})
    }
}

//Si en la petición HTTP "pet" existe una cabecera "Authorization"
//con el formato "Authorization: Bearer XXXXXX"  
//devuelve el XXXXXX (en JWT esto sería el token)
function getTokenFromAuthHeader(pet) {
    var cabecera = pet.header('Authorization')
    if (cabecera) {
        //Parte el string por el espacio. Si está, devolverá un array de 2
        //la 2ª pos será lo que hay detrás de "Bearer"
        var campos = cabecera.split(' ')
        if (campos.length>1 && cabecera.startsWith('Bearer')) {
            return campos[1] 
        }
    }
    return undefined
}



//En Express asociamos un método HTTP y una URL con un callback a ejecutar
app.get('/', function(pet,resp) {
   //Tenemos una serie de primitivas para devolver la respuesta HTTP
   resp.status(200);
   resp.send('Hola soy Express'); 
});

app.get('/miapi/protegido1', chequeaJWT, function(pet, resp){
    var token = getTokenFromAuthHeader(pet)
    var payload = token.split(".")[1]
    var payloadDecoded = Buffer.from(payload, "Base64").toString() //decodificamos el payload
    var payloadDecodedtoJSON = JSON.parse(payloadDecoded); //lo pasamos a jSON
    var login = payloadDecodedtoJSON.login //accedemos al campo del json que queremos
    resp.send({mensaje: "hola " + login, dato: "recurso  protegido 1"})
})


//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
 });