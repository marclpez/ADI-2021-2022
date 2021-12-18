'use strict'

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const auth = require('../middlewares/auth')

//MODELOS
const Tweet = require('../models/tweet')
const User = require('../models/user')
const Like = require('../models/like')

var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');

router.get('/', async function(req, res) {
    //Si no le llega un valor desde la query pone el por defecto ||
    const options = {
        limit: req.query.limit || 20,
        page: req.query.page || 1,
    }

    try{
        var lista_tweets = await Tweet.paginate({}, options);
        console.log(localStorage.idUsuario);
        console.log(localStorage.nickname);
        console.log(localStorage.token);

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

router.get('/:id', async function(req, res) {
    var tweetBuscado;
    var autor;

    try{
        tweetBuscado = await Tweet.findOne({ _id: req.params.id })
        if(tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        console.log(tweetBuscado)
        autor = await User.findOne({ nickname: tweetBuscado.autor })
        console.log(autor);
        res.status(200).send({idTweet: tweetBuscado._id, autor: autor, mensaje: tweetBuscado.mensaje, likes: tweetBuscado.likes});
    }
    catch(err){
        if(tweetBuscado === undefined || tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'}) 
    }
})

router.get('/:id/likes', async function(req, res) {
    var tweetBuscado;
    const options = {
        limit: req.query.limit || 20,
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
        res.status(200).send({likes: lista_likes})
    }
    catch(err){
        if(tweetBuscado === undefined || tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})

router.post('/', auth.chequeaJWT, async function(req, res) {

    try{
        var autor = await User.findOne({ _id: localStorage.idUsuario })
        console.log(autor)

        var nuevoTweet = new Tweet({
            mensaje: req.body.mensaje,
            autor: autor.nickname
        })
        console.log(nuevoTweet);
        await nuevoTweet.save();
        res.header('Location', 'http://localhost:3000/twapi/tweets/' + nuevoTweet._id)
        res.status(201).send({mensaje: "Guardado el tweet", tweet: nuevoTweet})
        autor.tweets.push(nuevoTweet); //Almacenamos el nuevo tweet en la lista de tweets del usuario con idAutor
        await autor.save();
    }
    catch(err){
        console.log(err)
        if(autor === undefined || autor === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.put('/:id', auth.chequeaJWT, async function(req, res){
    var tweetBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    try{
        tweetBuscado = await Tweet.findOneAndUpdate({ _id: req.params.id}, req.body, options)
        console.log(tweetBuscado)
        if(tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }

        res.status(200).send({mensaje: "Tweet actualizado"})
    }
    catch(err){
        if(tweetBuscado === undefined || tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
});

router.delete('/:id', auth.chequeaJWT, async function(req, res){
    var tweetBuscado;
    var usuarioBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    try{
        tweetBuscado = await Tweet.findOne({ _id: req.params.id})
        usuarioBuscado = await User.findOne({_id: localStorage.idUsuario})
        if(tweetBuscado.autor != localStorage.nickname){
            return res.status(401).send({mensaje: "No puedes eliminar un tweet que no es tuyo"})
        }
        await Tweet.deleteOne({ _id: tweetBuscado._id}) //eliminamos el tweet
        //Eliminamos la referencia del tweet a borrar del array de tweets de su autor
        await User.updateMany({likes: tweetBuscado._id}, {$pull: {likes: tweetBuscado._id}}) //eliminamos el tweet del listado de tweets del autor
        await Like.deleteMany({tweet: tweetBuscado._id}) //elinamos los likes al tweet de la lista de likes
        await User.findOneAndUpdate({ _id: usuarioBuscado._id}, {$pull: {tweets: tweetBuscado._id}}, options) //eliminamos de los usuarios que le han dado like el tweet de su lista de likes
        console.log(tweetBuscado)
        console.log(usuarioBuscado)

        res.status(200).send({mensaje: "Tweet eliminado"})
    }
    catch(err){
        if(tweetBuscado === undefined || tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

module.exports = router
