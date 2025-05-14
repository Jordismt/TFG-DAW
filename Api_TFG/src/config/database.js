const mongoose = require("mongoose");
require("dotenv").config();

/**
 * Conecta a la base de datos MongoDB usando la URI de .env
 */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB", error);
    process.exit(1); // Detiene la aplicación si hay error
  }
};

module.exports = connectDB;
