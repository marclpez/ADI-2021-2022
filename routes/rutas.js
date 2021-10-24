'use strict'

const express = require('express')
const router = express.Router();
var jwt = require('jwt-simple')
var moment = require('moment')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

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
router.get('/protegido', chequeaJWT, function(req, res){
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

router.get('/tweetsDestacados', function(req, res) {

    //DEVUELVE LAS FILAS DE UNA TABLA que coinciden con el filtro
    Like.find().countDocuments({tweet: '61719e2985e48e6c89091f87'}, function (err, count) {
        if(err) console.log(err)
        else console.log(count)
    })

    //VER COMO HACER LA CONSULTA SIN NECESIDAD DE BUCLES FOR 

}); //TODO

router.get('/tweets', async function(req, res) {
    //Si no le llega un valor desde la query pone el por defecto ||
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }

    try{
        var lista_tweets = await Tweet.paginate({}, options);

        if(lista_tweets.docs.length === 0){ //si el array de docs que hay en lista_tweets al paginar esta vacio es que no hay tweets almacenados
            return res.status(404).send({mensaje: 'No hay tweets'})
        }
        if(lista_tweets.hasPrevPage){
            lista_tweets.prevPage = 'http://localhost:3000/twapi/tweets?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_tweets.hasNextPage){
            lista_tweets.nextPage = 'http://localhost:3000/twapi/tweets?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }

        res.status(200).send(lista_tweets);
    }
    catch(err){
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
 });

 router.get('/tweets/:id', async function(req, res) {
    var tweetBuscado;

    try{
        tweetBuscado = await Tweet.findOne({ _id: req.params.id })
        if(tweetBuscado === null){
            return res.status(404).send({mensaje: 'nulo'})
        }
        console.log(tweetBuscado)
        res.status(200).send(tweetBuscado);
    }
    catch(err){
        if(tweetBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'}) 
    }
})

router.get('/usuarios', async function(req, res) {
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }   

    try{
        var lista_usuarios = await User.paginate({}, options)

        if(lista_usuarios.docs.length === 0){
            return res.status(404).send({mensaje: 'No hay usuarios'})
        }
        if(lista_usuarios.hasPrevPage){
            lista_usuarios.prevPage = 'http://localhost:3000/twapi/usuarios?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_usuarios.hasNextPage){
            lista_usuarios.nextPage = 'http://localhost:3000/twapi/usuarios?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }

        res.status(200).send(lista_usuarios)
    }
    catch(err){
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.get('/usuarios/:id', async function(req, res) {
    var usuarioBuscado;

    try{
        usuarioBuscado = await User.findOne({ _id: req.params.id })
        console.log(usuarioBuscado)
        res.status(200).send(usuarioBuscado);
    }
    catch(err){
        if(usuarioBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'}) 
    }
})

//Devuelve los tweets del usuario con :id
router.get('/usuarios/:id/tweets', async function(req, res) {
    var usuarioBuscado;
    const options = {
        limit: req.query.limit || 3,
        page: req.query.page || 1,
    }   

    try{
        usuarioBuscado = await User.findOne({ _id: req.params.id })
        console.log(usuarioBuscado)
        if(usuarioBuscado.tweets.length === 0){
            return res.status(200).send({mensaje: "Este usuario no tiene tweets"})
        }

        var lista_tweets = await Tweet.paginate({autor: usuarioBuscado._id}, options)
        if(lista_tweets.docs.length === 0){ //si el array de docs que hay en lista_tweets al paginar esta vacio es que no hay tweets almacenados
            return res.status(404).send({mensaje: 'No hay tweets'})
        }
        if(lista_tweets.hasPrevPage){
            lista_tweets.prevPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/tweets?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_tweets.hasNextPage){
            lista_tweets.nextPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/tweets?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }

        res.status(200).send(lista_tweets);
    }
    catch(err){
        if(usuarioBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})

//Esta ruta es un poco rara ya que siempre vamos a buscar los likes de un determinado tweet no todos los likes de todos los tweets
router.get('/likes', async function(req, res) {
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }
    
    try{
        var lista_likes = await Like.paginate({}, options)
        if(lista_likes.docs.length === 0){
            return res.status(404).send({mensaje: 'No hay likes'})
        }
        if(lista_likes.hasPrevPage){
            lista_likes.prevPage = 'http://localhost:3000/twapi/likes?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_likes.hasNextPage){
            lista_likes.nextPage = 'http://localhost:3000/twapi/likes?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }
        res.status(200).send(lista_likes)
    }
    catch(err){
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.get('/likes/:id', async function(req, res){
    var likeBuscado;

    try{
        likeBuscado = await Like.findOne({ _id: req.params.id })
        res.status(200).send(likeBuscado)
    }
    catch(err){
        if(likeBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un like con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

//Devuelve los likes de un tweet
router.get('/tweets/:id/likes', async function(req, res) {
    var tweetBuscado;
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }

    try{
        tweetBuscado = await Tweet.findOne({ _id: req.params.id })
        console.log(tweetBuscado)
        if(tweetBuscado.likes.length === 0){
            return res.status(200).send({mensaje:"Este tweet no tiene likes"})
        }

        var lista_likes = await Like.paginate({tweet: tweetBuscado._id}, options) //queremos paginar los likes que tienen asociado el tweet con :id
        if(lista_likes.hasPrevPage){
            lista_likes.prevPage = 'http://localhost:3000/twapi/tweets/' + tweetBuscado._id + '/likes?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_likes.hasNextPage){
            lista_likes.nextPage = 'http://localhost:3000/twapi/tweets/' + tweetBuscado._id + '/likes?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }
        res.status(200).send(lista_likes)
    }
    catch(err){
        if(tweetBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})

//Devuelve los tweets a los que un usuario le ha dado like
router.get('/usuarios/:id/likes', async function(req, res){
    var usuarioBuscado;
    const options = {
        limit: req.query.limit || 3,
        page: req.query.page || 1,
    }   

    try{
        usuarioBuscado = await User.findOne({ _id: req.params.id })
        console.log(usuarioBuscado)
        if(usuarioBuscado.likes.length === 0){
            return res.status(200).send({mensaje: "Este usuario no ha dado like a ningún tweet"})
        }

        var lista_likes = await Like.paginate({usuario: usuarioBuscado._id}, options)
        if(lista_likes.docs.length === 0){ //si el array de docs que hay en lista_tweets al paginar esta vacio es que no hay tweets almacenados
            return res.status(404).send({mensaje: 'No hay tweets'})
        }
        if(lista_likes.hasPrevPage){
            lista_likes.prevPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/likes?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_likes.hasNextPage){
            lista_likes.nextPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/likes?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }

        res.status(200).send(lista_likes);
    }
    catch(err){
        if(usuarioBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})

router.get('/seguimientos', async function(req, res) {
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }

    try{
        var lista_seguimientos = await Seguimiento.paginate({}, options)
        if(lista_seguimientos.docs.length === 0){
            return res.status(404).send({mensaje: 'No hay seguimientos'})
        }
        if(lista_seguimientos.hasPrevPage){
            lista_seguimientos.prevPage = 'http://localhost:3000/twapi/seguimientos?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_seguimientos.hasNextPage){
            lista_seguimientos.nextPage = 'http://localhost:3000/twapi/seguimientos?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }
        res.status(200).send(lista_seguimientos)
    }
    catch(err){
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.get('/seguimientos/:id', async function(req, res) {
    var seguimientoBuscado;

    try{
        seguimientoBuscado = await Seguimiento.findOne({ _id: req.params.id })
        res.status(200).send(seguimientoBuscado)
    }
    catch(err){
        if(seguimientoBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un seguimiento con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

//Devuelve los seguidores del usuario con :id
router.get('/usuarios/:id/seguidores', async function(req, res) {
    var usuarioBuscado;
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }

    try{
        usuarioBuscado = await User.findOne({_id: req.params.id})
        if(usuarioBuscado.seguidores.length === 0){
            return res.status(200).send({mensaje: 'El usuario no tiene seguidores'})
        }

        var lista_seguidores = await Seguimiento.paginate({seguido: usuarioBuscado._id}, options)
        if(lista_seguidores.hasPrevPage){
            lista_seguidores.prevPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/seguidores?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_seguidores.hasNextPage){
            lista_seguidores.nextPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/seguidores?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }

        res.status(200).send(lista_seguidores)
    }
    catch(err){
        if(usuarioBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.get('/usuarios/:id/seguidos', async function(req, res){ 
    var usuarioBuscado;
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }

    try{
        usuarioBuscado = await User.findOne({_id: req.params.id})
        if(usuarioBuscado.seguidos.length === 0){
            return res.status(200).send({mensaje: 'El usuario no sigue a nadie'})
        }

        var lista_seguidos = await Seguimiento.paginate({seguidor: usuarioBuscado._id}, options)
        if(lista_seguidos.hasPrevPage){
            lista_seguidos.prevPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/seguidos?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_seguidos.hasNextPage){
            lista_seguidos.nextPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/seguidos?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }

        res.status(200).send(lista_seguidos)
    }
    catch(err){
        if(usuarioBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.get('/mensajes', async function(req, res){
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }

    try{
        var lista_mensajes = await Mensaje.paginate({}, options)
        console.log(lista_mensajes)
        if(lista_mensajes.docs.length === 0){
            return res.status(404).send({mensaje: 'No hay mensajes'})
        }
        if(lista_mensajes.hasPrevPage){
            lista_mensajes.prevPage = 'http://localhost:3000/twapi/mensajes?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_mensajes.hasNextPage){
            lista_mensajes.nextPage = 'http://localhost:3000/twapi/mensajes?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }
        res.status(200).send(lista_mensajes)
    }
    catch(err){
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})

router.get('/mensajes/:id', async function(req, res) {
    var mensajeBuscado;

    try{
        mensajeBuscado = await Mensaje.findOne({ _id: req.params.id })
        res.status(200).send(mensajeBuscado)
    }
    catch(err){
        if(mensajeBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un mensaje con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

//Simularia la bandeja de entrada de un usuario
router.get('/usuarios/:id/mensajes', async function(req, res){
    var usuarioBuscado;
    const options = {
        limit: req.query.limit || 1,
        page: req.query.page || 1,
    }

    try{
        usuarioBuscado = await User.findOne({_id: req.params.id})
        console.log(usuarioBuscado)
        if(usuarioBuscado.mensajes.length === 0){
            return res.status(200).send({mensaje: 'El usuario no tiene mensajes'})
        }

        var lista_mensajes = await Mensaje.paginate({ $or: [ { emisor: usuarioBuscado._id }, { receptor: usuarioBuscado._id } ] }, options)
        if(lista_mensajes.hasPrevPage){
            lista_mensajes.prevPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/mensajes?limit=' + options.limit +'&page=' + (options.page - 1)
        }
        if(lista_mensajes.hasNextPage){
            lista_mensajes.nextPage = 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/mensajes?limit=' + options.limit +'&page=' + (parseInt(options.page) + 1)
        }

        res.status(200).send(lista_mensajes)
    }
    catch(err){
        if(usuarioBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})


//////POST
//En una app con autentificación basada en Token, el login genera y devuelve el token
router.post('/login', function(req, res){

    User.findOne({ nickname: req.body.nickname }, function (err, user){
        console.log(user)
        if(err || user === null){
            console.log(err)
            res.status(403).send({mensaje:"Credenciales incorrectas"})
        }
        else{
            const iguales = bcrypt.compareSync(req.body.password, user.password) //recibe el valor sin encriptar y el encriptado
            if(iguales){
                var payload = {
                    nickname: req.body.nickname,
                    exp: moment().add(7, 'days').valueOf()
                  }
                var token = jwt.encode(payload, secret)
                res.header('Location', '/twapi/usuarios/' + user._id)
                res.status(201).send({token: token, mensaje:"Login realizado"})
            }
            else{
                res.status(403).send({mensaje:"Credenciales incorrectas"})
            }
        }
    })
 })

router.post('/usuarios', async function(req, res){
    var passwordEncriptada = bcrypt.hashSync(req.body.password, 10)

    var nuevoUsuario = new User({
        nickname: req.body.nickname,
        password: passwordEncriptada,
        email: req.body.email,
        /*tweets: [], SE PODRIA PONER PERO NO ES NECESARIO, LO QUE NO LE PASAMOS LO AÑADE AUTOMATICO GRACIAS A LOS MODELOS
        seguidores: [],
        seguidos: [],
        mensajes: []*/
    })
    
    console.log(nuevoUsuario)
    await nuevoUsuario.save()
    res.header('Location', '/twapi/usuarios/' + nuevoUsuario._id)
    res.status(201).send({mensaje: "Guardado el usuario", usuario: nuevoUsuario})
})

router.post('/tweets', async function(req, res) {
    var idAutor = '617185b4771edd627c5bd7d6';

    try{
        var autor = await User.findOne({ _id: idAutor })
        console.log(autor)

        var nuevoTweet = new Tweet({
            mensaje: req.body.mensaje,
            autor: idAutor //si se le pasa un id de un autor que no existe falla, oleeee
            //likes: []
        })
        console.log(nuevoTweet);
        await nuevoTweet.save();
        res.header('Location', '/twapi/tweets/' + nuevoTweet._id)
        res.status(201).send({mensaje: "Guardado el tweet", tweet: nuevoTweet})
        autor.tweets.push(nuevoTweet); //Almacenamos el nuevo tweet en la lista de tweets del usuario con idAutor
        await autor.save()
    }
    catch(err){
        console.log(err)
        if(autor === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.post('/likes', async function(req, res) {
    var idTweet = '61719e2985e48e6c89091f87';
    var idUsuario = '6171870f4f761a62baca127b';

    try{
        var tweetBuscado = await Tweet.findOne({ _id: idTweet})
        var usuarioBuscado = await User.findOne({_id: idUsuario})
        console.log(tweetBuscado)
        console.log(usuarioBuscado)

        var nuevoLike = new Like({
            usuario: idUsuario, //Habra que verificar que se introduce un id de un usuario de la BD
            tweet: idTweet
        })
        console.log(nuevoLike)

        
        tweetBuscado.likes.push(nuevoLike)
        usuarioBuscado.likes.push(tweetBuscado)
        await tweetBuscado.save()
        await nuevoLike.save()
        await usuarioBuscado.save()

        res.header('Location', '/twapi/tweets/' + idTweet + '/likes' + nuevoLike._id)
        res.status(201).send({mensaje: "Guardado el like"})
    }
    catch(err){
        console.log(err)
        if(tweetBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        if(usuarioBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.post('/seguimientos', async function (req, res) {
    var idSeguidor = '6171a211b7b1e76e8e789cc8';
    var idSeguido = '61719a6a5d0f156b31f22379';

    try{
        var seguidor = await User.findOne({_id: idSeguidor});
        var seguido = await User.findOne({_id: idSeguido});
        console.log(seguidor)
        console.log(seguido)

        var nuevoSeguimiento = new Seguimiento({
            seguidor: idSeguidor,
            seguido: idSeguido
        })
        console.log(nuevoSeguimiento)
        await nuevoSeguimiento.save()

        seguidor.seguidos.push(seguido);
        seguido.seguidores.push(seguidor);
        await seguidor.save();
        await seguido.save();

        res.header('Location', '/twapi/seguimiento/' + nuevoSeguimiento._id)
        res.status(201).send({mensaje: "Guardado el seguimiento"})

    }
    catch(err){
        if(seguidor === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID (seguidor)'})
        }
        if(seguido === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID (seguido)'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.post('/mensajes', async function (req, res) {
    var idEmisor = '61719a6a5d0f156b31f22379';
    var idReceptor = '6171a211b7b1e76e8e789cc8';

    try{
        var emisor = await User.findOne({_id: idEmisor});
        var receptor = await User.findOne({_id: idReceptor});
        console.log(emisor)
        console.log(receptor)

        var nuevoMensaje = new Mensaje({
            emisor: idEmisor,
            receptor: idReceptor,
            mensaje: req.body.mensaje
        })
        console.log(nuevoMensaje)
        await nuevoMensaje.save()

        emisor.mensajes.push(nuevoMensaje);
        receptor.mensajes.push(nuevoMensaje);
        await emisor.save();
        await receptor.save();

        res.header('Location', '/twapi/mensajes/' + nuevoMensaje._id)
        res.status(201).send({mensaje: "Guardado el mensaje"})

    }
    catch(err){
        if(emisor === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID (emisor)'})
        }
        if(receptor === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID (receptor)'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})


router.put('/usuarios/:id', async function(req, res){
    var usuarioBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    try{
        usuarioBuscado = await User.findOneAndUpdate({ _id: req.params.id}, req.body, options)
        console.log(usuarioBuscado)
        res.status(200).send({mensaje: "Usuario actualizado"})
    }
    catch(err){
        if(usuarioBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

//delete: eliminar un like, eliminar un mensaje enviado, eliminar un seguidor, eliminar un seguido, eliminar mi perfil

router.delete('/tweets/:id', async function(req, res){
    var tweetBuscado;
    var usuarioBuscado;
    
    //Mas adelante deberemos comparar que el usuario que crea el tweet coincide con el que tiene la sesion iniciada
    //si no no se podrá eliminar el tweet
    try{
        tweetBuscado = await Tweet.findOneAndDelete({ _id: req.params.id})
        usuarioBuscado = await User.findOne({_id: tweetBuscado.autor}) //este id es el que deberemos comparar con el usuario logueado
        console.log(tweetBuscado)
        console.log(usuarioBuscado)

        //Eliminamos la referencia del tweet a borrar del array de tweets de su autor
        await User.findOneAndUpdate({ _id: usuarioBuscado._id}, {$pull: {tweets: tweetBuscado._id}})

        res.status(200).send({mensaje: "Tweet eliminado"})
    }
    catch(err){
        if(tweetBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})


module.exports = router