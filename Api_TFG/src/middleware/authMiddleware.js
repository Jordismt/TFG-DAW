const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware para verificar si el usuario está autenticado
 */
exports.verificarToken = (req, res, next) => {
  // Obtén el token de la cabecera Authorization
  const token = req.header("Authorization");
  
  // Verifica si el token no está presente
  if (!token) return res.status(401).json({ msg: "Acceso denegado" });

  // El token debe venir con el prefijo "Bearer"
  try {
    // Separamos el 'Bearer' del token
    const tokenClean = token.split(' ')[1]; // Esto obtiene solo el token

    // Verificamos el token
    const verified = jwt.verify(tokenClean, process.env.JWT_SECRET);

    // Adjuntamos la información del usuario a la petición
    req.user = verified;

    // Llamamos a la siguiente función en la cadena de middlewares
    next();
  } catch (error) {
    // Si el token es inválido
    res.status(400).json({ msg: "Token inválido" });
  }
};

/**
 * Middleware para verificar si el usuario es administrador
 */
exports.esAdmin = (req, res, next) => {
  // Verificamos si el usuario tiene el rol de administrador
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Acceso denegado" });
  
  // Si es admin, continuamos
  next();
};
