'use strict'
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://adi:adi@cluster0.pnvdh.mongodb.net/ADI_21-22?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log(e))
 

module.exports = mongoose

