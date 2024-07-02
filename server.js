const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express();

// Définir le middleware pour gérer les sessions
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


// démarer une connexion sur la base de données
const db = require("./config/db");

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Mysql connécté");
  }
});

// créeationd'un chemin absolu vers le répertoire "public" dans le projet.
// path join.() est une méthode de Node.js qui concatène les parties de chemin spécifiées en arguments pour former un chemin absolu
// __dirname est une variable globale dans Node.js qui représente le répertoire du fichier actuel.
const publicDirectory = path.join(__dirname, "./public");

// configure Express pour servir les fichiers statiques contenus dans le répertoire "public",
app.use(express.static(publicDirectory));

// configuration d'un middleware dans une application Express
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* utilisation de hbs */
app.set("view engine", "hbs");



// Routes
app.use("/", require("./routes/pages"));
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/articles"));

app.listen(5001, () => {
  console.log("Serveur prét à écouter au port 5001");
});

