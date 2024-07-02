const db = require("../config/db");

// Récupérer tous les articles depuis la base de données et les afficher sur la page blog
exports.getArticles = (req, res) => {
  const userId = req.session.adminId;
  db.query("SELECT id_articles, title, content, DATE_FORMAT(date, '%d/%m/20%y') AS date, id_admin FROM articles", (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération des articles :", error);
      res.status(500).send("Erreur serveur");
      return;
    }
    // Ajouter une propriété isAuthor à chaque article
    results = results.map(article => ({
      ...article,
      isAuthor: article.id_admin === userId
    }));
    // Rendre la page blog avec les articles modifiés
    res.render("blog", { articles: results });
  });
};


// Afficher le formulaire d'ajout d'article
exports.afficherFormulaireAjout = (req, res) => {
  res.render("ajoutArticle");
};

// Ajouter un nouvel article à la base de données
exports.ajouterArticle = (req, res) => {
  const { title, content, date } = req.body;
  const userId = req.session.adminId; 

  // Insérer les données de l'article dans la base de données
  const query = "INSERT INTO articles (title, content, date, id_admin) VALUES (?, ?, ?, ?)";
  db.query(query, [title, content, date, userId], (error, result) => {
    if (error) {
      console.error("Erreur lors de l'ajout de l'article :", error);
      res.status(500).send("Erreur serveur");
      return;
    }
    // Rediriger vers la page blog après l'ajout de l'article
    res.redirect("/blog");
  });
};

// Afficher le formulaire de modification d'article
exports.afficherFormulaireModification = (req, res) => {
  const articleId = req.params.id;
  // Récupérer les données de l'article à modifier depuis la base de données
  db.query("SELECT * FROM articles WHERE id_articles = ?", [articleId], (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération de l'article :", error);
      res.status(500).send("Erreur serveur");
      return;
    }
    const article = results[0];
    if (!article) {
      // Si l'article n'est pas trouvé, envoyer une erreur 404
      res.status(404).send("Article non trouvé");
      return;
    }
    if (article.id_admin !== req.session.adminId) {
      // Si l'utilisateur n'est pas l'auteur de l'article, envoyer une erreur 403 (accès interdit)
      res.status(403).send("Accès interdit : Vous n'êtes pas autorisé à modifier cet article.");
      return;
    }
    // Afficher le formulaire de modification avec les données de l'article
    res.render("modifierArticle", { article });
  });
};

// Modifier un article existant dans la base de données
exports.modifierArticle = (req, res) => {
  const articleId = req.params.id;
  const { title, content, date } = req.body;
  const userId = req.session.adminId;

  // Mettre à jour les données de l'article dans la base de données
  db.query("UPDATE articles SET title = ?, content = ?, date = ? WHERE id_articles = ? AND id_admin = ?", 
    [title, content, date, articleId, userId], 
    (error, result) => {
      if (error) {
        console.error("Erreur lors de la modification de l'article :", error);
        res.status(500).send("Erreur serveur");
        return;
      }
      if (result.affectedRows === 0) {
        // Si aucune ligne n'est affectée (l'utilisateur n'est pas l'auteur de l'article), envoyer une erreur 403 (accès interdit)
        res.status(403).send("Accès interdit : Vous n'êtes pas autorisé à modifier cet article.");
        return;
      }
      // Rediriger vers la page blog après la modification de l'article
      res.redirect("/blog");
    }
  );
};

// Supprimer un article de la base de données
exports.supprimerArticle = (req, res) => {
  const articleId = req.params.id;
  const userId = req.session.adminId;

  // Supprimer l'article avec l'ID spécifié uniquement si l'utilisateur est l'auteur de l'article
  db.query("DELETE FROM articles WHERE id_articles = ? AND id_admin = ?", [articleId, userId], (error, result) => {
    if (error) {
      console.error("Erreur lors de la suppression de l'article :", error);
      res.status(500).send("Erreur serveur");
      return;
    }
    if (result.affectedRows === 0) {
      // Si aucune ligne n'est affectée (l'utilisateur n'est pas l'auteur de l'article), envoyer une erreur 403 (accès interdit)
      res.status(403).send("Accès interdit : Vous n'êtes pas autorisé à supprimer cet article.");
      return;
    }
    // Rediriger vers la page blog après la suppression de l'article
    res.redirect("/blog");
  });
};

// Afficher un article spécifique
exports.lireArticle = (req, res) => {
  const articleId = req.params.id;

  // Récupérer l'article avec l'ID spécifié depuis la base de données
  db.query("SELECT * , DATE_FORMAT(date, '%d/%m/20%y') AS date FROM articles WHERE id_articles = ?", [articleId], (error, results) => {
    if (error) {
      console.error("Erreur lors de la récupération de l'article :", error);
      res.status(500).send("Erreur serveur");
      return;
    }
    const article = results[0];
    if (!article) {
      // Si l'article n'est pas trouvé, envoyer une erreur 404
      res.status(404).send("Article non trouvé");
      return;
    }
    // Afficher la page de l'article avec les données récupérées
    res.render("lireArticle", { article });
  });
};
