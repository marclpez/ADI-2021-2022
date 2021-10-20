'use strict'

//Cargamos el módulo express
var moment = require('moment')
var express = require('express');
var app = express();

app.use(express.json())
const rutas = require('./routes/rutas')
const mongoose = require('./database');
app.use(rutas)

var users = new Map()
users.set("pepe", {login:"pepe", password:"pepe"})
users.set("adi", {login:"adi", password:"adi"})


//Este método delega en el server.listen "nativo" de Node
app.listen(3000, function () {
    console.log("El servidor express está en el puerto 3000");
 });