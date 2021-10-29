'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


//MIDDLEWARES
var secret = '123456'
//Middleware: lo pondremos ANTES de procesar cualquier reqición que requiera autentificación
async function chequeaJWT(req, res, next) {
    var token = localStorage.token;
    console.log(localStorage.nickname);
    console.log(localStorage.idUsuario);
    console.log(token)

    try{
        jwt.decode(token, secret) //si no lanza excepcion pasamos al siguiente middleware
        var payload = token.split(".")[1]
        var payloadDecoded = Buffer.from(payload, "Base64").toString() //decodificamos el payload
        var payloadDecodedtoJSON = JSON.parse(payloadDecoded); //lo pasamos a jSON
        console.log(payloadDecodedtoJSON)
        var idUsuario = payloadDecodedtoJSON.idUsuario //accedemos al campo del json que queremos
        console.log(idUsuario)

        if(localStorage.idUsuario == idUsuario){
            return next();
        } 
        res.status(403).send({mensaje: "no tienes permisos"});
    }
    catch{
        res.status(403).send({mensaje: "no tienes permisos"})
    }
}

function creaToken(usuario){
    var payload = {
        idUsuario: usuario._id,
        exp: moment().add(7, 'days').valueOf()
    }
    return jwt.encode(payload, secret);
}
function guardarDatosLogin(id, nickname, token){
    localStorage.setItem("idUsuario", id);
    localStorage.setItem("nickname", nickname)
    localStorage.setItem("token", token);
}

module.exports = {chequeaJWT, creaToken, guardarDatosLogin}