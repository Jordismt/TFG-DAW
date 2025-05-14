const mongoose = require("mongoose");

/**
 * Modelo de Productos para la tienda online
 */
const productSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    precio: { type: Number, required: true },
    stock: { type: Number, required: true },
    imagen: { type: String, required: true }, // URL de la imagen
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
