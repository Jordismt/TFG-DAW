const express = require("express");
const router = express.Router();
const { verificarToken, esAdmin } = require("../middleware/authMiddleware");
const { exportAppointmentsToCSV } = require("../utils/csvGenerator");
const {
  createAppointment,
  getAllAppointments,
  getUserAppointments,
  getAvailableSlots,
  cancelAppointment,
  updateAppointment,
} = require("../controllers/appointmentController");


// Rutas protegidas
router.post("/", verificarToken, createAppointment); // Crear cita
router.get("/", verificarToken, getUserAppointments); // Obtener citas del usuario autenticado
router.get("/admin", verificarToken, esAdmin, getAllAppointments); // Obtener todas las citas (solo admin)
router.delete("/:id", verificarToken, cancelAppointment); // Cancelar cita
router.get("/export", verificarToken, esAdmin, exportAppointmentsToCSV);
router.get("/disponibilidad/:service_id/:fecha", verificarToken, getAvailableSlots);
router.put("/:id", verificarToken, updateAppointment);

module.exports = router;
