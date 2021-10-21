'use strict'

const express = require('express')
const router = express.Router();
var jwt = require('jwt-simple')
var moment = require('moment')
const mongoose = require('mongoose')

//MODELOS
const Tweet = require('../models/tweet')
const User = require('../models/user')
const Like = require('../models/like')
const Mensaje = require('../models/mensajes')

//MIDDLEWARES
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
router.post('/twapi/login', function(pet, resp){

    User.findOne({ nickname: pet.body.nickname }, function (err, user){
        console.log(user)
        if(err || user === null){
            console.log(err)
            resp.send({mensaje:"Credenciales incorrectas"})
            resp.status(403)
        }
        else{
            if(user.password == pet.body.password){
                var payload = {
                    nickname: pet.body.nickname,
                    exp: moment().add(7, 'days').valueOf()
                  }
                var token = jwt.encode(payload, secret)
                resp.send({token: token, mensaje:"Login realizado"})
            }
        }
    })
 })

//EJEMPLO RUTA PROTEGIDA
router.get('/twapi/protegido', chequeaJWT, function(pet, resp){
     var token = getTokenFromAuthHeader(pet)
     var payload = token.split(".")[1]
     var payloadDecoded = Buffer.from(payload, "Base64").toString() //decodificamos el payload
     var payloadDecodedtoJSON = JSON.parse(payloadDecoded); //lo pasamos a jSON
     console.log(payloadDecodedtoJSON)
     var nickname = payloadDecodedtoJSON.nickname //accedemos al campo del json que queremos
     resp.send({mensaje: "hola " + nickname, dato: "recurso  protegido"})
})
///////////

router.get('/twapi/tweets', (req, res) => {
    Tweet.find({}, function (err, tweets) {
        User.populate(tweets, { path: "autor" }, function (err, tweets) { //el populate es para mostrar todos los campos del autor y no solo su id
          res.status(200).send(tweets);
        });
      });
 });

router.get('/twapi/likes', (req, res) => {
    Like.find((err, lista_likes) => {
        if(err){
            res.json({
                msj: 'No se pudieron listar los likes', 
                err
            })
        }
        else{
            res.json({
                msj: 'Los likes se listaron correctamente',
                lista_likes
            })
        }
    })
});

router.post('/twapi/usuarios', (req, res) => {
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

router.post('/twapi/tweets', (req, res) => {
    var nuevoTweet = new Tweet({
        mensaje: req.body.mensaje,
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

router.post('/twapi/likes', (req, res) => {
    var nuevoLike = new Like({
        usuario: '6170897a2696332be713c5c8',
        tweet: '617089a3d237432c36981ceb'
    })
    console.log(nuevoLike)

    nuevoLike.save(function (err) {
        if (err){
            console.log(String(err))
        }
        res.send("Guardado like")
      });
})

 module.exports = router