const express = require("express");
const router = express.Router();
const { verificarToken, esAdmin } = require("../middleware/authMiddleware");
const { getStats } = require("../controllers/statsController");
const { buscarUsuarioConCitas } = require("../controllers/statsController");


router.get("/", verificarToken, esAdmin, getStats); // 🛡️ Solo admin puede ver stats
router.get("/buscar-usuario", verificarToken, esAdmin, buscarUsuarioConCitas);
module.exports = router;
