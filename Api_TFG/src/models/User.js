const mongoose = require("mongoose");

/**
 * Esquema del usuario en MongoDB
 */
const userSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

module.exports = mongoose.model("User", userSchema);
