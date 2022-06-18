const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/blogs");

app.get("/", (req, res) => {});

app.listen(3000, () => {
  console.log("Server Started on Port:3000");
});
