const express = require("express");
const app = express();

//for reading files
const fs = require("fs");

//for uploading files to server
const multer = require("multer");

//read images
const { createWorker, RecognizeResult } = require("tesseract.js");

const worker = createWorker({
  logger: (m) => console.log(m),
});

//save images
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage }).single("avatar");

app.set("view engine", "ejs");

//add public folder (for styling)
app.use(express.static("public"));

//routes
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    fs.readFile(`./uploads/${req.file.originalname}`, async (err, img) => {
      if (err) return console.log("Ths is your error", err);
      await worker.load();
      await worker.loadLanguage("eng");
      await worker.initialize("eng");
      await worker.recognize(img);
      res.redirect("/download");
      const { data } = await worker.getPDF("Tesseract OCR Result");
      fs.writeFileSync("tesseract-ocr-result.pdf", Buffer.from(data));
      console.log("Generate PDF: tesseract-ocr-result.pdf");
      await worker.terminate();
    });
  });
});

app.get("/download", (req, res) => {
  const file = `${__dirname}/tesseract-ocr-result.pdf`;
  res.download(file);
});

//Start up server
const PORT = 5000 || process.env.PORT;
app.listen(PORT, () => console.log(`I'm running in ${PORT}`));
