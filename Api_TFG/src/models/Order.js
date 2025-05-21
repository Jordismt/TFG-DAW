const mongoose = require("mongoose");

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
    estado: { 
      type: String, 
      enum: ["pendiente", "pagado", "enviado", "completado", "cancelado", "rechazado", "reembolsado"], 
      default: "pendiente" 
    },
    direccion_envio: {
      calle: { type: String, required: true },
      ciudad: { type: String, required: true },
      codigo_postal: { type: String, required: true },
      pais: { type: String, required: true }
    },
    metodo_pago: { type: String, enum: ["tarjeta", "paypal", "transferencia"], required: true },
    tracking_info: {
      empresa: { type: String },
      numero_seguimiento: { type: String }
    },
    historial_estados: [
      {
        estado: { type: String },
        fecha: { type: Date, default: Date.now }
      }
    ],
    notas: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
