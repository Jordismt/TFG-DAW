const User = require("../models/User");

/**
 * Obtiene el perfil del usuario autenticado
 */
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

/**
 * Actualiza el perfil del usuario autenticado
 */
exports.updateUserProfile = async (req, res) => {
  try {
    const { nombre, email, password } = req.body;

    // Verificar si el usuario existe
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    // Actualizar campos
    if (nombre) user.nombre = nombre;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10); // Encriptar nueva contraseña

    await user.save();
    res.json({ msg: "Perfil actualizado", user });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};

/**
 * Elimina un usuario (solo admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });

    res.json({ msg: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ msg: "Error en el servidor", error });
  }
};
