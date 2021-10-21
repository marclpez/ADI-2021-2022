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
const Seguimiento = require('../models/seguimiento')
const Mensaje = require('../models/mensaje')

//MIDDLEWARES
var secret = '123456'
//Middleware: lo pondremos ANTES de procesar cualquier reqición que requiera autentificación
function chequeaJWT(req, res, next) {

    var token = getTokenFromAuthHeader(req)

    try{
      jwt.decode(token, secret) //si no lanza excepcion pasamos al siguiente middleware
      next()
    }
    catch{
        res.status(403)
        res.send({mensaje: "no tienes permisos"})
    }
}

//Si en la petición HTTP "pet" existe una cabecera "Authorization"
//con el formato "Authorization: Bearer XXXXXX"  
//devuelve el XXXXXX (en JWT esto sería el token)
function getTokenFromAuthHeader(req) {
    var cabecera = req.header('Authorization')
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

//////////


//EJEMPLO RUTA PROTEGIDA
router.get('/twapi/protegido', chequeaJWT, function(req, res){
    var token = getTokenFromAuthHeader(req)
    var payload = token.split(".")[1]
    var payloadDecoded = Buffer.from(payload, "Base64").toString() //decodificamos el payload
    var payloadDecodedtoJSON = JSON.parse(payloadDecoded); //lo pasamos a jSON
    console.log(payloadDecodedtoJSON)
    var nickname = payloadDecodedtoJSON.nickname //accedemos al campo del json que queremos
    res.send({mensaje: "hola " + nickname, dato: "recurso  protegido"})
})
///////////

//////GET

router.get('/twapi/tweetsDestacados', (req, res) => {

    //DEVUELVE LAS FILAS DE UNA TABLA que coinciden con el filtro
    Like.find().countDocuments({tweet: '61719e2985e48e6c89091f87'}, function (err, count) {
        if(err) console.log(err)
        else console.log(count)
    })

    //VER COMO HACER LA CONSULTA SIN NECESIDAD DE BUCLES FOR 

}); //TODO

router.get('/twapi/tweets', (req, res) => {
    Tweet.find({}, function (err, lista_tweets) {
        if(err) {
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        if(!lista_tweets){
            return res.status(404).send({mensaje: 'No hay tweets'})
        }
        User.populate(lista_tweets, { path: "autor" }, function (err, lista_tweets) { //el populate es para mostrar todos los campos del autor y no solo su id
          res.status(200).send(lista_tweets);
        });
      });
 });

router.get('/twapi/usuarios', (req, res) => {
    User.find((err, lista_usuarios) => {
        if(err) {
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        if(!lista_usuarios){
            return res.status(404).send({mensaje: 'No hay usuarios'})
        }
        res.status(200).send(lista_usuarios)
    })
});

router.get('/twapi/usuarios/:id', (req, res) => {
    User.findOne({ _id: req.params.id }, function (err, user){
        console.log(user)
        if(err) {
            if(user === undefined){
                return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
            }
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        res.status(200).send(user);
    })
})

//Devuelve los tweets del usuario con :id
router.get('/twapi/usuarios/:id/tweets', (req, res) => {
    User.findOne({ _id: req.params.id }, function (err, user){
        console.log(user)
        if(err) {
            if(user === undefined){
                return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
            }
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        if(user.tweets.length == 0){
            res.status(200).send({mensaje: "Este usuario no tiene tweets"})
        }
        res.status(200).send(user.tweets);
    })
})

//Esta ruta es un poco rara ya que siempre vamos a buscar los likes de un determinado tweet no todos los likes de todos los tweets
router.get('/twapi/likes', (req, res) => {
    Like.find((err, lista_likes) => {
        if(err) {
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        if(!lista_likes){
            return res.status(404).send({mensaje: 'No hay likes'})
        }
        res.status(200).send(lista_likes)
    })
});

router.get('/twapi/likes/:id', (req, res) => {
    Like.findOne({ _id: req.params.id }, function(err, like){
        if(err) {
            if(like === undefined){
                return res.status(404).send({mensaje: 'No existe un like con ese ID'})
            }
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        res.status(200).send(like)
    })
});

router.get('/twapi/tweets/:id/likes', (req, res) => {
    Tweet.findOne({ _id: req.params.id }, function (err, tweet){
        console.log(tweet)
        if(err) {
            if(tweet === undefined){
                return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
            }
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        if(tweet.likes.length == 0){
            return res.status(200).send({mensaje:"Este tweet no tiene likes"})
        }
        res.status(200).send(tweet.likes); //devuelve un array con los ids de los likes asociados al tweet con id :id
    }) 
})

router.get('/twapi/seguimientos', (req, res) => {
    Seguimiento.find((err, lista_seguimientos) => {
        if(err) {
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        if(!lista_seguimientos){
            return res.status(404).send({mensaje: 'No hay seguimientos'})
        }
        res.status(200).send(lista_seguimientos)
    })
});

router.get('/twapi/seguimientos/:id', (req, res) => {
    Seguimiento.findOne({ _id: req.params.id }, function(err, seguimiento){
        if(err) {
            if(seguimiento === undefined){
                return res.status(404).send({mensaje: 'No existe un seguimiento con ese ID'})
            }
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        res.status(200).send(seguimiento)
    })
});

router.get('/twapi/usuarios/:id/seguidores', (req, res) => {
    User.findOne({_id: req.params.id}, function(err, user) {
        if(err) {
            if(user === undefined){
                return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
            }
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        if(user.seguidores.length == 0){
            return res.status(200).send({mensaje: 'El usuario no tiene seguidores'})
        }
        res.status(200).send(user.seguidores)
    })
});

router.get('/twapi/usuarios/:id/seguidos', (req, res) => {
    User.findOne({_id: req.params.id}, function(err, user) {
        if(err) {
            if(user === undefined){
                return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
            }
            return res.status(500).send({mensaje: 'Error al realizar la petición'})
        }
        if(user.seguidos.length == 0){
            return res.status(200).send({mensaje: 'El usuario no sigue a nadie'})
        }
        res.status(200).send(user.seguidos)
    })
});


//////POST
//En una app con autentificación basada en Token, el login genera y devuelve el token
router.post('/twapi/login', function(req, res){

    User.findOne({ nickname: req.body.nickname }, function (err, user){
        console.log(user)
        if(err || user === null){
            console.log(err)
            res.status(403).send({mensaje:"Credenciales incorrectas"})
        }
        else{
            if(user.password == req.body.password){
                var payload = {
                    nickname: req.body.nickname,
                    exp: moment().add(7, 'days').valueOf()
                  }
                var token = jwt.encode(payload, secret)
                res.header('Location', '/twapi/usuarios/' + user._id)
                res.status(201).send({token: token, mensaje:"Login realizado"})
            }
        }
    })
 })

router.post('/twapi/usuarios', (req, res) => {
    var nuevoUsuario = new User({
        nickname: req.body.nickname,
        password: req.body.password,
        email: req.body.email,
        /*tweets: [], SE PODRIA PONER PERO NO ES NECESARIO, LO QUE NO LE PASAMOS LO AÑADE AUTOMATICO GRACIAS A LOS MODELOS
        seguidores: [],
        seguidos: [],
        mensajes: []*/
    })
    
    console.log(nuevoUsuario)
    nuevoUsuario.save(function (err) {
        if (err){
            console.log(err)
            return res.status(500).send({mensaje: 'Error creando el usuario'})
        }
        res.header('Location', '/twapi/usuarios/' + nuevoUsuario._id)
        res.status(201).send({mensaje: "Guardado el usuario"})
    });
})

router.post('/twapi/tweets', (req, res) => {
    var idAutor = '6171a211b7b1e76e8e789cc8';

    User.findOne({ _id: idAutor }, function (err, user){
        console.log(user)
        if(err){
            console.log(err)
            if(user === undefined){
                return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
            }
            return res.status(500).send({mensaje: "Error"})
            
        }

        var nuevoTweet = new Tweet({
            mensaje: req.body.mensaje,
            autor: idAutor, //si se le pasa un id de un autor que no existe falla, oleeee
            //likes: []
        })
        console.log(user);
        console.log(nuevoTweet);
        nuevoTweet.save(function (err) { //Almacenamos el nuevo tweet
            if (err){
                console.log(String(err))
                return res.status(500).send({mensaje: 'Error creando el tweet'})
            }
            res.header('Location', '/twapi/tweets/' + nuevoTweet._id)
            res.status(201).send({mensaje: "Guardado el tweet"})
        });
        user.tweets.push(nuevoTweet); //Almacenamos el nuevo tweet en la lista de tweets del usuario con idAutor
        user.save()
    })
})

router.post('/twapi/likes', (req, res) => {
    var idTweet = '617189b173d380645adb3cae';
    var idUsuario = '617185b4771edd627c5bd7d6A';

    Tweet.findOne({ _id: idTweet}, function (err, tweet){
        console.log(tweet)
        if(err){
            console.log(err)
            if(tweet === undefined){
                return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
            }
            return res.status(500).send({mensaje: "Error"})
        }

        User.findOne({_id: idUsuario}, function (err, user){ //verificamos que el usuario con idUsuario esta existe
            console.log(user)
            if(err){
                console.log(err)
                if(user === undefined){
                    return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
                }
                return res.status(500).send({mensaje: "Error"})
            }
            var nuevoLike = new Like({
                usuario: idUsuario, //Habra que verificar que se introduce un id de un usuario de la BD
                tweet: idTweet
            })
            console.log(nuevoLike)
        
            nuevoLike.save(function (err) { //Almacenamos el nuevo like
                if (err){
                    console.log(String(err))
                    return res.status(500).send({mensaje: 'Error creando el like'})
                }
                res.header('Location', '/twapi/tweets/' + idTweet + '/likes' + nuevoLike._id)
                res.status(201).send({mensaje: "Guardado el like"})
            });
    
            tweet.likes.push(nuevoLike) //Lo almacenamos en el listado de likes del tweet asociado
            tweet.save()
        })
    })
})

router.post('/twapi/seguimiento', function (req, res) {
    var idSeguidor = '617185b4771edd627c5bd7d6';
    var idSeguido = '6171870f4f761a62baca127a';

    User.findOne({_id: idSeguidor}, function (err, seguidor){
        console.log(seguidor)
        if(err){
            console.log(err)
            if(seguidor === undefined){
                return res.status(404).send({mensaje: 'No existe un usuario con ese ID (seguidor)'})
            }
            return res.status(500).send({mensaje: "Error"})
        }
        User.findOne({_id: idSeguido}, function (err, seguido){
            console.log(seguido)
            if(err){
                console.log(err)
                if(seguido === undefined){
                    return res.status(404).send({mensaje: 'No existe un usuario con ese ID (seguido)'})
                }
                return res.status(500).send({mensaje: "Error"})
            }
            var nuevoSeguimiento = new Seguimiento({
                seguidor: idSeguidor,
                seguido: idSeguido
            })
            console.log(nuevoSeguimiento)

            nuevoSeguimiento.save(function (err) { //Almacenamos el nuevo like
                if (err){
                    console.log(String(err))
                    return res.status(500).send({mensaje: 'Error creando el seguimiento'})
                }
                res.header('Location', '/twapi/seguimiento/' + nuevoSeguimiento._id)
                res.status(201).send({mensaje: "Guardado el seguimiento"})
            });
            seguidor.seguidos.push(nuevoSeguimiento);
            seguido.seguidores.push(nuevoSeguimiento);
            seguidor.save();
            seguido.save()
        })
    })

})

 module.exports = router