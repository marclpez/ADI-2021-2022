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
    console.log(req.headers)
    console.log(token)

    try{
        var tokenRecibido = req.headers.authorization.split(' ')[1];
        console.log("token recibido: " + tokenRecibido)
        if(localStorage.token == tokenRecibido){
            return next();
        } 
        res.status(401).send({mensaje: "no tienes permisos"});
    }
    catch{
        res.status(401).send({mensaje: "no tienes permisos"})
    }
}

function creaToken(usuario){
    var payload = {
        idUsuario: usuario._id,
        exp: moment().add(7, 'days').valueOf()
    }
    return jwt.encode(payload, secret);
}
function guardarDatos(id, nickname, token){
    localStorage.setItem("idUsuario", id);
    localStorage.setItem("nickname", nickname)
    localStorage.setItem("token", token);
}

module.exports = {chequeaJWT, creaToken, guardarDatos}