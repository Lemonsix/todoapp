const { prototype } = require('events')
const express = require('express')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000
const path = require('path')


app.get("/", (req,res)=>{
    res.sendFile(path.join(__dirname,'/../../index.html')) // busca el index.html en el proyecto
})

app.listen(port)