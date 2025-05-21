const express = require("express");
const router = express.Router();
const { verificarToken, esAdmin } = require("../middleware/authMiddleware");
const {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
  cancelOrder,
} = require("../controllers/orderController");

router.post("/", verificarToken, createOrder);  
router.get("/", verificarToken, getUserOrders);  
router.get("/admin", verificarToken, esAdmin, getAllOrders);  
router.put("/admin/:orderId", verificarToken, esAdmin, updateOrderStatus);  
router.put("/cancel/:orderId", verificarToken, cancelOrder); // Nueva ruta para cancelar


module.exports = router;
