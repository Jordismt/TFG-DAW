const mongoose = require("mongoose");

/**
 * Modelo de Órdenes de Compra
 */
const orderSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productos: [
      {
        product_id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        cantidad: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    estado: { type: String, enum: ["pendiente", "pagado", "enviado", "completado"], default: "pendiente" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
