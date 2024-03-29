'use strict'

const express = require('express')
const router = express.Router();
const mongoose = require('mongoose')
const auth = require('../middlewares/auth')

//MODELOS
const User = require('../models/user')
const Seguimiento = require('../models/seguimiento');
const { restart } = require('nodemon');

//LocalStorage
var LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');


router.get('/:id', async function(req, res) {
    var seguimientoBuscado;

    try{
        seguimientoBuscado = await Seguimiento.findOne({ _id: req.params.id })

        if(seguimientoBuscado === undefined || seguimientoBuscado === null){
            return res.status(200).send({mensaje: 'No existe un seguimiento con ese ID'})
        }
        res.status(200).send(seguimientoBuscado)
    }
    catch(err){
        if(seguimientoBuscado === undefined || seguimientoBuscado === null){
            return res.status(404).send({mensaje: 'No existe un seguimiento con ese ID'})
        }
        return res.status(500).send({mensaje: 'Error al realizar la petición'})
    }
});

router.post('/', auth.chequeaJWT, async function (req, res) {
    try{
        var seguidor = await User.findOne({_id: localStorage.idUsuario});
        var seguido = await User.findOne({nickname: req.body.seguido});
        var yaExisteSeguimiento = await Seguimiento.findOne({seguidor: seguidor.nickname, seguido: seguido.nickname})
        
        //seguidor.nickname === ...
        if(localStorage.nickname === seguido.nickname){ //para evitar seguirse a uno mismo
            return res.status(200).send({mensaje: 'No puedes seguirte a ti mismo'})
        }
        else if(yaExisteSeguimiento !== null && yaExisteSeguimiento !== undefined){
            return res.status(200).send({mensaje: 'Ya sigues a este usuario'})
        }
        else if((seguidor !== null && seguido !== null)){
            var nuevoSeguimiento = new Seguimiento({
                seguidor: seguidor.nickname,
                seguido: seguido.nickname
            })
            console.log(nuevoSeguimiento)
            await nuevoSeguimiento.save()
    
            seguidor.seguidos.push(seguido.nickname);
            seguido.seguidores.push(seguidor.nickname);
            await seguidor.save();
            await seguido.save();
    
            res.header('Location', 'http://localhost:3000/twapi/seguimiento/' + nuevoSeguimiento._id)
            res.status(201).send({mensaje: "Guardado el seguimiento", seguimiento: nuevoSeguimiento})            
        }
        else{

            if(seguidor === null){
                return res.status(404).send({mensaje: 'No existe el usuario seguidor'})
            }
            res.status(404).send({mensaje: 'No existe el usuario seguido'})
        }
    }
    catch(err){
        console.log("entro")
        if(seguidor === undefined){
            return res.status(404).send({mensaje: 'No existe el usuario seguidor'})
        }
        if(seguido === undefined){
            return res.status(404).send({mensaje: 'No existe el usuario seguido'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

router.delete('/:id', auth.chequeaJWT, async function(req, res){
    var seguimientoBuscado;
    const options = {
        useFindAndModify: false,
        new : true
    }
    
    try{
        seguimientoBuscado = await Seguimiento.findOneAndDelete({ _id: req.params.id})

        if(seguimientoBuscado !== null){
            console.log(seguimientoBuscado)
            if(seguimientoBuscado.seguidor != localStorage.nickname && seguimientoBuscado.seguido != localStorage.nickname){
                return res.status(401).send({mensaje: "No puedes eliminar un seguimiento que no has realizado tú"})
            }
            //Eliminamos la referencia del seguimiento a borrar del array de seguidos del usuario seguidor en el seguimiento
            await User.findOneAndUpdate({ nickname: seguimientoBuscado.seguidor}, {$pull: {seguidos: seguimientoBuscado.seguido}}, options)
            //Eliminamos la referencia del seguimiento a borrar del array de seguidores del usuario seguido en el seguimiento
            await User.findOneAndUpdate({ nickname: seguimientoBuscado.seguido}, {$pull: {seguidores: seguimientoBuscado.seguidor}}, options)
            
            return res.status(200).send({mensaje: "Seguimiento eliminado"})
        }
        res.status(404).send({mensaje: "No existe un seguimiento con ese ID"})

    }
    catch(err){
        if(seguimientoBuscado === undefined){
            return res.status(404).send({mensaje: 'No existe un seguimiento con ese ID'})
        }
        res.status(500).send({mensaje: "Error"})
    }
})

module.exports = router