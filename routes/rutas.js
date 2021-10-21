const express = require('express')
const router = express.Router();
var jwt = require('jwt-simple')
const mongoose = require('mongoose')
const Tweet = require('../models/tweet')
const User = require('../models/user')

var secret = '123456'

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
        if (campos.length > 1 && cabecera.startsWith('Bearer')) {
            return campos[1] 
        }
    }
    return undefined
}

//En Express asociamos un método HTTP y una URL con un callback a ejecutar
router.get('/', function(pet, resp) {
    //Tenemos una serie de primitivas para devolver la respuesta HTTP
    resp.status(200);
    resp.send('Hola soy Express'); 
 });
 
 //En una app con autentificación basada en Token, el login genera y devuelve el token
router.post('/miapi/login', function(pet, resp){
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
 
router.get('/miapi/protegido1', chequeaJWT, function(pet, resp){
     var token = getTokenFromAuthHeader(pet)
     var payload = token.split(".")[1]
     var payloadDecoded = Buffer.from(payload, "Base64").toString() //decodificamos el payload
     var payloadDecodedtoJSON = JSON.parse(payloadDecoded); //lo pasamos a jSON
     var login = payloadDecodedtoJSON.login //accedemos al campo del json que queremos
     resp.send({mensaje: "hola " + login, dato: "recurso  protegido 1"})
 })
 
router.get('/twapi/tweets', (req, res) => {
    Tweet.find({}, function (err, tweets) {
        User.populate(tweets, { path: "autor" }, function (err, tweets) { //el populate es para mostrar todos los campos del autor y no solo su id
          res.status(200).send(tweets);
        });
      });
 });

 router.get('/twapi/usuarios', (req, res) => {
    User.find((err, lista_tweets) => {
        if(err){
            res.json({
                msj: 'No se pudieron listar los tweets', 
                err
            })
        }
        else{
            res.json({
                msj: 'Las personas se listaron correctamente',
                lista_tweets
            })
        }
    })
});

router.post('/twapi/nuevoUsuario', (req, res) => {
    var nuevoUsuario = new User({
        nickname: req.body.nickname,
        password: req.body.password,
        email: req.body.email,
    })
    
    console.log(nuevoUsuario)
    nuevoUsuario.save(function (err) {
        if (err){
            console.log(String(err))
        }
        res.send("Guardado usuario")
      });
})

router.post('/twapi/nuevoTweet', (req, res) => {
    var nuevoTweet = new Tweet({
        mensaje: req.body.mensaje,
        likes: req.body.likes,
        autor: '6170897a2696332be713c5c8' //si se le pasa un id de un autor que no existe falla, oleeee
    })
    console.log(nuevoTweet)

    nuevoTweet.save(function (err) {
        if (err){
            console.log(String(err))
        }
        res.send("Guardado tweet")
      });
})

 module.exports = router