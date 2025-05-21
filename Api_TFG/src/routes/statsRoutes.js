const express = require("express");
const router = express.Router();
const { verificarToken, esAdmin } = require("../middleware/authMiddleware");
const { getStats } = require("../controllers/statsController");

router.get("/", verificarToken, esAdmin, getStats); // 🛡️ Solo admin puede ver stats

module.exports = router;
