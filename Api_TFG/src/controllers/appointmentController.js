const Appointment = require("../models/Appointment");

/**
 * Crea una nueva cita
 */
exports.createAppointment = async (req, res) => {
  try {
    const { fecha, service_id } = req.body;

    // Validar campos
    if (!fecha || !service_id) {
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const inicioCita = new Date(fecha);
    const finCita = new Date(inicioCita.getTime() + 45 * 60000); // +45 minutos

    // Comprobar si ya existe una cita en ese rango para el mismo servicio
    const citaExistente = await Appointment.findOne({
      service_id,
      $or: [
        { fecha: { $gte: inicioCita, $lt: finCita } },
        { fecha: { $lt: inicioCita, $gte: new Date(inicioCita.getTime() - 45 * 60000) } }
      ]
    });

    if (citaExistente) {
      return res.status(400).json({
        msg: "Ya existe una cita programada para este servicio en esa franja horaria."
      });
    }

    // Crear nueva cita
    const nuevaCita = new Appointment({
      user_id: req.user.id,
      fecha: inicioCita,
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


/**
 * Obtener horarios disponibles para un servicio en un día específico
 */
exports.getAvailableSlots = async (req, res) => {
  try {
    const { service_id, fecha } = req.params;

    if (!service_id || !fecha) {
      return res.status(400).json({ msg: "Servicio y fecha son obligatorios" });
    }

    const startDate = new Date(fecha);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(fecha);
    endDate.setHours(23, 59, 59, 999);

    // Buscar todas las citas de ese día y servicio
    const citas = await Appointment.find({
      service_id,
      fecha: { $gte: startDate, $lte: endDate }
    });

    // Generar los bloques de 45 minutos
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      for (let minute = 0; minute < 60; minute += 45) {
        const slot = new Date(startDate);
        slot.setHours(hour, minute, 0, 0);

        // Comprobamos si está ocupado
        const isOccupied = citas.some(cita => {
          const citaFin = new Date(new Date(cita.fecha).getTime() + 45 * 60000);
          return slot >= cita.fecha && slot < citaFin;
        });

        if (!isOccupied) {
          slots.push(slot);
        }
      }
    }

    res.json(slots);
  } catch (error) {
    console.error("Error al obtener los horarios disponibles:", error);
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};