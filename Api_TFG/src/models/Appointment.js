const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service_id: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }, // Relación con servicios
    fecha: { type: Date, required: true },
    estado: { type: String, enum: ["pendiente", "confirmada", "completada"], default: "pendiente" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
