const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
console.log("corriendo en puerto", port);
const path = require("path");
let { MongoClient } = require("mongodb");
let db;

async function go() {
  let client = new MongoClient(process.env.MONGOSTRING);
  await client.connect()
  db = client.db();
  app.listen(port);
}
go();

app.use(express.urlencoded({ extended: false })); // setea el body

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/../../index.html")); // busca el index.html en el proyecto
});

app.post("/create-item", (req, res) => {
  db.collection("items").insertOne({ text: req.body.item }, () => {
    res.send("thanks for submitting the form");
   console.log(req.body.item)
  });
});