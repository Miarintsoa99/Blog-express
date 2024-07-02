const express = require("express");
const router = express.Router();

const articleController = require("../controllers/articleController");
const adminController = require("../controllers/adminController");

// Fonction pour vérifier l'authentification
const verifierAuthentification = (req, res, next) => {
  if (req.session.isAdminLoggedIn) {
    next(); // Passez à la prochaine fonction middleware si l'utilisateur est connecté
  } else {
    res.render("connexion"); 
  }
};

// Route pour afficher la page "/blog" après vérification de l'authentification
router.get("/blog", verifierAuthentification, (req, res) => {
  articleController.getArticles(req, res);
});


router.get("/", (req, res) => {
  res.render("connexion");
});


// Route pour la page d'accueil
router.get("/", (req, res) => {
  if (req.session.isAdminLoggedIn) {
    res.redirect("/blog"); // Rediriger vers le blog si l'utilisateur est connecté
  } else {
    res.render("connexion"); // Sinon, afficher la page de connexion
  }
});


// Route pour l'affichege aricle
router.get("/blog", articleController.getArticles);

// route pour mot de passe
router.get("/motDePasse", (req, res) => {
  res.render("connexion");
});

// Route pour la page admin
router.get("/admin", adminController.getAdminProfile);


// déconnexion
router.get("/deconnexion", (req, res) => {
  // Destruction de la session
  req.session.destroy((err) => {
    if (err) {
      console.error("Erreur lors de la déconnexion :", err);
      res.status(500).send("Erreur serveur");
      return;
    }
    // Redirection vers la page de connexion
    res.render("connexion");
  });
});




module.exports = router;
