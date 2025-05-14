const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/authMiddleware");
const {
  getCart,
  addToCart,
  clearCart,
  finalizarCompra
} = require("../controllers/cartController");

router.get("/", verificarToken, getCart);         
router.post("/add", verificarToken, addToCart);   
router.delete("/clear", verificarToken, clearCart);
router.post('/finalizar-compra', verificarToken, finalizarCompra); // 👈 Cambiado a verificarToken

module.exports = router;
