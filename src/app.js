const express = require("express");
const morgan = require("morgan");
const multer = require("multer");
const path = require("path");
const exphbs = require("express-handlebars");

// Corregiir el error de Handlebards 4.6^
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
const Handlebars = require('handlebars');


//init 
const app = express();
require('./database');

app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    useUnifiedTopology: true,
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");

//middlewares

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// aqui subira los archivos
const storage = multer.diskStorage({
  destination: path.join(__dirname, "public/uploads"),
  filename: (req, file, cb) => {
    //cambiara el nombre del archivo
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

app.use(multer({ storage }).single("image"));

// routes

app.use(require("./routes"));

module.exports = app;