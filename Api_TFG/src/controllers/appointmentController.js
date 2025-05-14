const Appointment = require("../models/Appointment");

/**
 * Crea una nueva cita
 */
exports.createAppointment = async (req, res) => {
  try {
    const { fecha, service_id } = req.body;

    // Validar que los campos obligatorios están presentes
    if (!fecha || !service_id) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    // Crear nueva cita asociada al usuario autenticado
    const nuevaCita = new Appointment({
      user_id: req.user.id,
      fecha,
      service_id,
    });

    await nuevaCita.save();
    res.status(201).json({ msg: "Cita creada con éxito", cita: nuevaCita });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).json({
      msg: "Error en el servidor",
      error: error.message || error
    });
  }
  
};

/**
 * Obtiene todas las citas (solo para administradores)
 */
exports.getAllAppointments = async (req, res) => {
  try {
    const citas = await Appointment.find()
      .populate("user_id", "nombre email")
      .populate("service_id", "nombre precio");
    res.json(citas);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

/**
 * Obtiene las citas del usuario autenticado
 */
exports.getUserAppointments = async (req, res) => {
  try {
    // Asegurémonos de que el campo `service_id` sea correctamente poblado
    const citas = await Appointment.find({ user_id: req.user.id })
      .populate("service_id", "nombre precio"); // Poblamos la información del servicio relacionado
    res.json(citas);
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};


/**
 * Cancela una cita (solo usuario propietario o admin)
 */
exports.cancelAppointment = async (req, res) => {
  try {
    const cita = await Appointment.findById(req.params.id);

    if (!cita) {
      return res.status(404).json({ msg: "Cita no encontrada" });
    }

    // Verificar si el usuario es dueño de la cita o es administrador
    if (cita.user_id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ msg: "No tienes permisos para cancelar esta cita" });
    }

    await cita.deleteOne();
    res.json({ msg: "Cita cancelada exitosamente" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};
