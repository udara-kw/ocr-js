const express = require("express");
const app = express();

//for reading files
const fs = require("fs");

//for uploading files to server
const multer = require("multer");

//read images
const createWorker = require("tesseract.js");
const { createBrotliCompress } = require("zlib");

//save images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
});
const upload = multer({ strage: storage }).single("avatar");

app.set("view engine", "ejs");

//routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    console.log(req.file);
  });
});

//Start up server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`I'm running in ${PORT}`));
