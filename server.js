const express = require ("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
console.log("corriendo en puerto", port);
let { MongoClient, ObjectId } = require("mongodb");
let db;
let sanitizeHTML = require ('sanitize-html')

app.use(express.static('public')) //acepta incoming requests desde la carpeta public

async function go() { // sincroniza con mongo con un callback que espera a conectarse para poder continuar
  let client = new MongoClient(process.env.MONGOSTRING);
  await client.connect();
  db = client.db();
  app.listen(port);
}
go();

app.use(express.json()) //acepta json
app.use(express.urlencoded({ extended: false })); // permite pasar formularios al backend

function passwordProtected(req,res,next){
  res.set('WWW-Authenticate','Basic realm="Simple Todo App"')
  //console.log(req.headers.authorization) devuelve la comb de user/password
  if (req.headers.authorization == "Basic TGVtb25zaXg6dzNoeXM3cHM="){ //contrasenia de acceso
    next() // si la contrasenia es correcta ejecuta la siguientefuncion que seria cargar el HTML completo
  } else{
    res.status(401).send("Authentication required") // si se cancela el prompt va a 401
  }
}

app.use(passwordProtected)
app.get("/", (req, res) =>{
  db.collection("items").find().toArray(function (err, items) {      
    res.send(`<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
    </head>
    <body>
    <div class="container">
    <h1 class="display-4 text-center py-1">To-Do App!</h1>
    
    <div class="jumbotron p-3 shadow-sm">
    <form id="create-form" action="/create-item" method="POST">
    <div class="d-flex align-items-center">
    <input id="create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
    <button class="btn btn-primary">Add New Item</button>
    </div>
    </form>
    </div>

    <ul id="item-list" class="list-group pb-5">
    </ul>
    </div>
    <script>
    let items=${JSON.stringify(items)}
    </script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
  </body>
  </html>`)
  })
})

app.post("/create-item", (req, res) => { //crea elementos
  let safeText = sanitizeHTML(req.body.text,{allowedTags: [], allowedAttributes: {}}) // carga en safeText el texto sanitizado

  db.collection("items").insertOne({ text: safeText }, (err,info) => { //inserta un elemento
    res.json({_id:info.insertedId, text:safeText})
  });
});

app.post('/update-item', (req, res) =>{
  let safeText = sanitizeHTML(req.body.text,{allowedTags: [], allowedAttributes: {}})
  db.collection('items').findOneAndUpdate({_id: new ObjectId(req.body.id)}, {$set: {text: safeText}}, ()=> {
    res.json(safeText)
  })
})

app.post('/delete-item', (req, res) =>{
  let safeText = sanitizeHTML(req.body.text,{allowedTags: [], allowedAttributes: {}})
  db.collection('items'). deleteOne({_id: new ObjectId(req.body.id)}, ()=> {
    res.send("Success")
  })
})