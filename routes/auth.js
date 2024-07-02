const express = require("express");
const authControler = require("../controllers/authControler");

const router = express.Router();

// cela signifie "auth/connexion"
router.post("/connexion", authControler.connexion);   




module.exports = router;
