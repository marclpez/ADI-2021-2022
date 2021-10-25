'use strict'

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')

//MODELOS
const User = require('../models/user')
const Seguimiento = require('../models/seguimiento')

router.get('/', async function(req, res) {
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

router.get('/:id', async function(req, res) {
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

router.post('/', async function (req, res) {
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

router.delete('/:id', async function(req, res){
    var seguimientoBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    //Mas adelante deberemos comparar que el usuario que elimina el seguimiento coincide con el que tiene la sesion iniciada
    //si no no se podrá eliminar el seguimiento
    try{
        seguimientoBuscado = await Seguimiento.findOneAndDelete({ _id: req.params.id})
        console.log(seguimientoBuscado)
        //Eliminamos la referencia del seguimiento a borrar del array de seguidos del usuario seguidor en el seguimiento
        await User.findOneAndUpdate({ _id: seguimientoBuscado.seguidor}, {$pull: {seguidos: seguimientoBuscado.seguido}}, options)
        //Eliminamos la referencia del seguimiento a borrar del array de seguidores del usuario seguido en el seguimiento
        await User.findOneAndUpdate({ _id: seguimientoBuscado.seguido}, {$pull: {seguidores: seguimientoBuscado.seguidor}}, options)
        
        res.status(200).send({mensaje: "Seguimiento eliminado"})
    }
    catch(err){
        if(seguimientoBuscado === undefined || seguimientoBuscado === null){
            return res.status(404).send({mensaje: 'No existe un seguimiento con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

module.exports = router