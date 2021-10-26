'use strict'

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//Librerias para subida de imagenes
const fs = require('fs')
const multer = require('multer')
const upload = multer({dest: 'public/images'})

//MODELOS
const Tweet = require('../models/tweet')
const User = require('../models/user')
const Like = require('../models/like')

router.get('/', async function(req, res) {
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

router.get('/destacados', function(req, res) {

    //DEVUELVE LAS FILAS DE UNA TABLA que coinciden con el filtro
    Like.find().countDocuments({tweet: '61719e2985e48e6c89091f87'}, function (err, count) {
        if(err) console.log(err)
        else console.log(count)
    })

    //VER COMO HACER LA CONSULTA SIN NECESIDAD DE BUCLES FOR 

}); //TODO


router.get('/:id', async function(req, res) {
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
        if(tweetBuscado === undefined || tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'}) 
    }
})

router.get('/:id/likes', async function(req, res) {
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
        if(tweetBuscado === undefined || tweetBuscado === null){
            return res.status(404).send({mensaje: 'No existe un tweet con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})

router.post('/', upload.single('image'), async function(req, res) {

    try{
        var autor = await User.findOne({ _id: req.body.autor })
        console.log(autor)

        fs.renameSync(req.file.path, req.file.path + '.' + req.file.mimetype.split('/')[1]) //para añadir la extension al nombre de la imagen
        console.log(req.file)

        var nuevoTweet = new Tweet({
            mensaje: req.body.mensaje,
            autor: autor
        })
        console.log(nuevoTweet);
        await nuevoTweet.save();
        res.header('Location', 'http://localhost:3000/twapi/tweets/' + nuevoTweet._id)
        res.status(201).send({mensaje: "Guardado el tweet", tweet: nuevoTweet})
        autor.tweets.push(nuevoTweet); //Almacenamos el nuevo tweet en la lista de tweets del usuario con idAutor
        await autor.save()
    }
    catch(err){
        console.log(err)
        if(autor === undefined || autor === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.delete('/:id', async function(req, res){
    var tweetBuscado;
    var usuarioBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    //Mas adelante deberemos comparar que el usuario que elimina el tweet coincide con el que tiene la sesion iniciada
    //si no no se podrá eliminar el tweet
    try{
        tweetBuscado = await Tweet.findOneAndDelete({ _id: req.params.id})
        //Eliminamos la referencia del tweet a borrar del array de tweets de su autor
        await User.findOneAndUpdate({ _id: usuarioBuscado._id}, {$pull: {tweets: tweetBuscado._id}}, options)
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