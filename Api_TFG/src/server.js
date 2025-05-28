const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");

// Conectar a la base de datos
connectDB();

// ================================
// 🔓 CORS Configuración
// ================================
const corsOptions = {
  origin: ["http://localhost:5173", "https://tfg-daw-rfrw.vercel.app"], // Permite ambos orígenes
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};


app.use(cors(corsOptions));

// ================================
// 🛡️ Seguridad y Middleware globales
// ================================
app.use(helmet());
app.use(express.json());

// ================================
// ⏳ Límite de peticiones
// ================================
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 15 minutos
  max: 500, // Límite de 100 peticiones por IP
});
app.use(limiter);

// ================================
// 🗂️ Rutas de la API
// ================================
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/services", serviceRoutes);
const statsRoutes = require("./routes/statsRoutes");
app.use("/api/stats", statsRoutes);

// 🌐 Servir archivos estáticos (uploads)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🚀 Middleware para CORS en imágenes
app.use("/uploads", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  next();
});


// ================================
// ❌ Manejo de errores globales
// ================================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Error en el servidor", error: err.message });
});

// ================================
// 🚀 Iniciar servidor
// ================================
app.listen(PORT, () => {
  console.log(`✅ Servidor en http://localhost:${PORT}`);
});
