const express = require("express");
const router = express.Router();
const { verificarToken, esAdmin } = require("../middleware/authMiddleware");
const {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");
const upload = require("../middleware/uploadMiddleware");

// Obtener todos los productos (público)
router.get("/", getAllProducts);

// Obtener un producto por ID (público)
router.get("/:id", getProductById);

// Crear producto (solo admin) -> Aquí añadimos el middleware para manejar el archivo
router.post("/", verificarToken, esAdmin, upload.single("imagen"), createProduct);

// Actualizar producto (solo admin)
router.put("/:id", verificarToken, esAdmin, updateProduct);

// Eliminar producto (solo admin)
router.delete("/:id", verificarToken, esAdmin, deleteProduct);

module.exports = router;
