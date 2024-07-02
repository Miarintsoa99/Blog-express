const express = require("express");
const router = express.Router();

const articleController = require("../controllers/articleController");


// Affichage du formulaire d'ajout d'article
router.get("/ajoutArticle", articleController.afficherFormulaireAjout);

// Soumission du formulaire d'ajout d'article
router.post("/ajouterArticle", articleController.ajouterArticle);

// Modification d'un article
router.get("/modifier-article/:id", articleController.afficherFormulaireModification);
router.post("/modifier-article/:id", articleController.modifierArticle);

// Suppression d'un article
router.post("/supprimer-article/:id", articleController.supprimerArticle);

// Route pour afficher un article spécifique
router.get('/lire-article/:id', articleController.lireArticle);

module.exports = router;
