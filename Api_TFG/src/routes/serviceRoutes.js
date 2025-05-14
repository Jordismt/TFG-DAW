const express = require("express");
const multer = require("multer"); // Importamos multer
const { verificarToken, esAdmin } = require("../middleware/authMiddleware");
const {
  createService,
  getAllServices,
  deleteService,
  updateService,
  getServiceById
} = require("../controllers/serviceController");
const path = require("path");

const router = express.Router();

// Configuración de multer para manejar la carga de imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Nombre único para cada archivo
  }
});
const upload = multer({ storage: storage });

// Rutas
// Ruta para obtener un servicio por ID
router.get("/:id", getServiceById);
router.get("/", getAllServices); // Obtener todos los servicios
router.post("/", verificarToken, esAdmin, upload.single('imagen'), createService); // Crear servicio con imagen
router.delete("/:id", verificarToken, esAdmin, deleteService); // Eliminar servicio
// Agregar en el archivo serviceRoutes.js

router.put("/:id", verificarToken, esAdmin, upload.single('imagen'), updateService); // Actualizar servicio

module.exports = router;
//verificarToken, esAdmin,