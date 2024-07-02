const db = require("../config/db");

exports.getAdminProfile = (req, res) => {
    // Récupérez l'ID de l'administrateur depuis la session
    const adminId = req.session.adminId;

    // Requête pour récupérer les informations de l'administrateur depuis la base de données
    db.query("SELECT * FROM admin WHERE id_admin = ?", [adminId], (error, results) => {
        if (error) {
            console.error("Erreur lors de la récupération de l'administrateur depuis la base de données :", error);
            res.status(500).send("Erreur serveur");
            return;
        }

        // Vérifiez si un administrateur avec cet ID a été trouvé
        if (results.length === 0) {
            // Si aucun administrateur avec cet ID n'est trouvé, redirigez ou affichez un message d'erreur
            res.status(404).send("Administrateur non trouvé");
            return;
        }

        // Récupérez les informations de l'administrateur depuis les résultats de la requête
        const admin = results[0]; 

        // Passez les informations de l'administrateur à la vue pour affichage
        res.render("admin", { id_admin: admin.id_admin, login: admin.login });
    });
};
