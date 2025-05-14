const mongoose = require("mongoose");

/**
 * Modelo de Servicios (Ej: Corte de pelo, Tinte, Manicura)
 */
const serviceSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    duracion: { type: Number, required: true }, // Minutos
    imagen: { type: String, required: false }, // URL de la imagen
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
