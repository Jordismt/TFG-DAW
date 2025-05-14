// scripts/getToken.js
import axios from "axios";
import fs from "fs";

const baseURL = "http://localhost:5000/api/auth/login"; // Cambia la URL si es diferente

// 👤 Credenciales de usuario
const credentials = {
  email: "jordi@gmail.com", // <- Sustituye por tu email
  password: "Jordismt1*"      // <- Sustituye por tu contraseña
};

const getToken = async () => {
  try {
    const response = await axios.post(baseURL, credentials);
    const token = response.data.token;

    // ✏️ Guardar el token en un archivo
    fs.writeFileSync("token.txt", token);

    console.log(`✅ Token guardado en token.txt`);
  } catch (error) {
    console.error("❌ Error al obtener el token:", error.message);
  }
};

getToken();
