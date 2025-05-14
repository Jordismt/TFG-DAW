const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Registra un nuevo usuario
 */
exports.registerUser = async (req, res) => {
  try {
    const { nombre, email, password, role } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ msg: "El email ya está registrado" });

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ nombre, email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({ msg: "Usuario registrado con éxito" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};

/**
 * Inicia sesión y genera un token JWT
 */
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Usuario no encontrado" });

    // Verificar la contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    // Crear token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, user: { id: user._id, nombre: user.nombre, role: user.role } });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor" });
  }
};
