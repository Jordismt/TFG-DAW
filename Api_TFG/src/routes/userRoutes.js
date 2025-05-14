const express = require("express");
const router = express.Router();
const { verificarToken, esAdmin } = require("../middleware/authMiddleware"); // Asegúrate de tener estos middlewares
const {
  getUserProfile,
  updateUserProfile,
  deleteUser
} = require("../controllers/userController"); // Asegúrate de tener estos métodos en tu userController

// Ruta para obtener el perfil del usuario autenticado
router.get("/profile", verificarToken, getUserProfile);

// Ruta para actualizar el perfil del usuario autenticado
router.put("/profile", verificarToken, updateUserProfile);

// Ruta para eliminar un usuario (solo admin)
router.delete("/:id", verificarToken, esAdmin, deleteUser);

module.exports = router;
