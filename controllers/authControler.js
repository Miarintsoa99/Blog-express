const db = require("../config/db");
exports.connexion = (req, res) => {
  const { login, pass } = req.body; 

  // Vérification des informations d'administration dans la base de données
  db.query('SELECT * FROM admin WHERE login = ? AND pass = ?', [login, pass], (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send("Erreur de base de données");
      return;
    }

    // Vérification si l'administrateur existe
    if (results.length === 0) {
      // Message d'erreur
      res.render('connexion', { invalide: "Login ou mot de passe incorrect" });
      return;
    }

    // Définition de la variable de session pour indiquer que l'utilisateur est connecté
    req.session.isAdminLoggedIn = true;
    req.session.adminId = results[0].id_admin;

     
     console.log(req.session);

    res.redirect('/blog');
  });
};


