// const express = require('express')
import express from 'express'
import cors from 'cors'
// const cors = require('cors')
require('dotenv').config()
import initRoutes from './src/routes'
// const initRoutes = require('./src/routes')

require('./conection_database')
const app  = express()
app.use(cors(
    {
        origin: process.env.CLIENT_URL,
        method : ['GET','PORT','PUT','DELETE']
    }
))
//CRUD : create read Update DELETE
app.use(express.json())
app.use(express.urlencoded({extended: true}))

initRoutes(app)
const PORT = process.env.PORT || 8888
const listener  = app.listen(PORT,()=>{
    console.log('server  is run in the port '+ listener.address().port);
})