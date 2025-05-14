const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");  // Ahora se usan registerUser y loginUser

// Ruta de registro
router.post("/register", registerUser);

// Ruta de inicio de sesión
router.post("/login", loginUser);

module.exports = router;
