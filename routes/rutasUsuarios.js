'use strict'

const express = require('express')
const router = express.Router();
var jwt = require('jwt-simple')
var moment = require('moment')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const auth = require('../middlewares/auth')

//Librerias para subida de imagenes
const fs = require('fs')
const multer = require('multer')
const upload = multer({dest: 'public/images'})


//MODELOS
const Tweet = require('../models/tweet')
const User = require('../models/user')
const Like = require('../models/like')
const Seguimiento = require('../models/seguimiento')
const Mensaje = require('../models/mensaje');

//LocalStorage
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


router.get('/', async function(req, res) {
    const options = {
        limit: req.query.limit || 2,
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

router.get('/:id', async function(req, res) {
    var usuarioBuscado;

    try{
        usuarioBuscado = await User.findOne({ _id: req.params.id })
        console.log(usuarioBuscado)
        res.status(200).send(usuarioBuscado);
    }
    catch(err){
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'}) 
    }
})

router.get('/:id/tweets', async function(req, res) {
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
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})


router.get('/:id/likes', async function(req, res){
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
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})


router.get('/:id/seguidores', async function(req, res) {
    var usuarioBuscado;
    const options = {
        limit: req.query.limit || 10,
        page: req.query.page || 1,
    }

    try{
        usuarioBuscado = await User.findOne({_id: req.params.id})
        if(usuarioBuscado !== null){
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
    
            return res.status(200).send(lista_seguidores)
        }
        res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
    }
    catch(err){
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.get('/:id/seguidos', async function(req, res){ 
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
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});


router.get('/:id/imagenes', async function(req, res){
    var usuarioBuscado;
    const options = {
        limit: req.query.limit || 1,
        page: req.query.page || 1,
    }

    try{
        usuarioBuscado = await User.findOne({_id: req.params.id})
        console.log(usuarioBuscado)
        if(usuarioBuscado.imagenes.length === 0){
            return res.status(200).send({mensaje: 'El usuario no tiene imágenes'})
        }

        res.status(200).send(usuarioBuscado.imagenes);
    }
    catch(err){
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
})


router.post('/', async function(req, res){
    try{
        if(localStorage.idUsuario !== null){
            return res.status(200).send({mensaje: "Ya estas logueado"})
        }
        var passwordEncriptada = bcrypt.hashSync(req.body.password, 10)
    
    
        var nuevoUsuario = new User({
            nickname: req.body.nickname,
            password: passwordEncriptada,
            email: req.body.email
        })
        
        var usuarioConMismoNickname = await User.findOne({nickname: nuevoUsuario.nickname});
        console.log(usuarioConMismoNickname)
        if(usuarioConMismoNickname === null || usuarioConMismoNickname === undefined){
            //console.log(nuevoUsuario)
            await nuevoUsuario.save();
            res.header('Location', 'http://localhost:3000/twapi/usuarios/' + nuevoUsuario._id)
            return res.status(201).send({mensaje: "Guardado el usuario", usuario: nuevoUsuario})
        }
        res.status(400).send({mensaje: "Ya existe un usuario con ese nickname, prueba con otro"});
    }
    catch(err){
        res.status(400).send({mensaje: String(err)});
    }

});


router.post('/login', async function(req, res){
    var usuarioBuscado;

    try{
        usuarioBuscado = await User.findOne({ nickname: req.body.nickname});
        console.log(usuarioBuscado);

        const iguales = bcrypt.compareSync(req.body.password, usuarioBuscado.password) //recibe el valor sin encriptar y el encriptado
        if(iguales){
            var token = auth.creaToken(usuarioBuscado);
            res.header('Location', 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id)
            auth.guardarDatosLogin(usuarioBuscado._id, usuarioBuscado.nickname, token); //guardamos los datos del usuario logueado en el localStorage
            console.log(localStorage.idUsuario);
            console.log(localStorage.nickname);
            console.log(localStorage.token);
            res.status(201).send({mensaje:"Login realizado"})
        }
        else{
            res.status(403).send({mensaje:"Credenciales incorrectas"})
        }
    }
    catch(err){
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(403).send({mensaje:"Credenciales incorrectas"});
        }
        console.log(err)
        res.status(500).send({mensaje:"Error"});
    }
 });

 router.post('/logout', auth.chequeaJWT, async function(req, res){
    localStorage.clear();
    res.status(200).send({mensaje: "Sesión cerrada"});
 });

 router.post('/imagenes', auth.chequeaJWT, upload.single('image'), async function(req, res){
    var usuarioBuscado;

    try{
        usuarioBuscado = await User.findOne({ _id: localStorage.idUsuario });
        fs.renameSync(req.file.path, req.file.path + '.' + req.file.mimetype.split('/')[1]); //para añadir la extension al nombre de la imagen
        console.log(req.file);
        usuarioBuscado.imagenes.push(req.file.path.split('/')[2]);
        usuarioBuscado.save();
        res.header('Location', 'http://localhost:3000/twapi/usuarios/' + usuarioBuscado._id + '/imagenes');
        res.status(201).send({mensaje: 'Imagen subida'});
    }
    catch(err){
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'});
        }
        res.status(500).send({mensaje: 'Error'});
    }
 });

router.put('/', auth.chequeaJWT, async function(req, res){
    var usuarioBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    try{
        if(req.body.password){
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }
        console.log("password " + req.body.password);
        usuarioBuscado = await User.findOneAndUpdate({ _id: localStorage.idUsuario}, req.body, options)
        console.log(usuarioBuscado)
        if(usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        else if(req.body.nickname){
            localStorage.setItem('nickname', req.body.nickname);
        }
        localStorage.setItem("idUsuario", usuarioBuscado._id)
        res.status(200).send({mensaje: "Usuario actualizado"})
    }
    catch(err){
        if(usuarioBuscado === undefined || usuarioBuscado === null){
            return res.status(404).send({mensaje: 'No existe un usuario con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
});

module.exports = router