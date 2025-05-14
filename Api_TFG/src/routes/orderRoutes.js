const express = require("express");
const router = express.Router();
const { verificarToken, esAdmin } = require("../middleware/authMiddleware");
const {
  createOrder,
  getAllOrders,
  getUserOrders
} = require("../controllers/orderController");

router.post("/", verificarToken, createOrder); // Crear orden
router.get("/", verificarToken, getUserOrders); // Obtener órdenes del usuario
router.get("/admin", verificarToken, esAdmin, getAllOrders); // Todas las órdenes (admin)

module.exports = router;
