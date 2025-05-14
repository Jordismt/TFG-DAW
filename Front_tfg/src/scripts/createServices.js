import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Solución para ES Modules (reemplazo de __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseURL = "http://localhost:5000/api/services"; // La URL del backend (Api_TFG)

// ✅ Ruta correcta hacia TFG_DAW/Api_TFG/uploads
const rootPath = path.resolve(__dirname, "../../../Api_TFG/src/uploads");

const services = [
  {
    nombre: "Tinte y mechas",
    descripcion: "Servicio completo de tinte y mechas",
    precio: 40,
    duracion: 60,
    imagen: path.join(rootPath, "tinte-mechas.webp"),
  },
  {
    nombre: "Manicura y pedicura",
    descripcion: "Manicura y pedicura con esmaltado",
    precio: 25,
    duracion: 45,
    imagen: path.join(rootPath, "manicura-pedicura.jpg"),
  },
  {
    nombre: "Tratamiento capilar",
    descripcion: "Tratamiento para la salud del cabello",
    precio: 30,
    duracion: 50,
    imagen: path.join(rootPath, "trat-capilar.jpg"),
  },
  {
    nombre: "Alisado keratina",
    descripcion: "Alisado de cabello con keratina",
    precio: 50,
    duracion: 90,
    imagen: path.join(rootPath, "alisado-keratina.jpg"),
  },
  {
    nombre: "Depilación facial",
    descripcion: "Depilación facial con cera",
    precio: 10,
    duracion: 30,
    imagen: path.join(rootPath, "depilacion-facial.png"),
  },
  {
    nombre: "Corte de Pelo",
    descripcion: "Corte de pelo masculino",
    precio: 10,
    duracion: 30,
    imagen: path.join(rootPath, "corte-pelo.webp"),
  },
];

const createServices = async () => {
  try {
    for (const service of services) {
      console.log(`⏳ Creando servicio: ${service.nombre}...`);

      // ✅ Verificamos que la imagen existe
      if (!fs.existsSync(service.imagen)) {
        console.error(`❌ Imagen no encontrada: ${service.imagen}`);
        continue;
      }

      const formData = new FormData();
      formData.append("nombre", service.nombre);
      formData.append("descripcion", service.descripcion);
      formData.append("precio", service.precio);
      formData.append("duracion", service.duracion);

      // Leer la imagen y agregarla al formData
      formData.append("imagen", fs.createReadStream(service.imagen));

      // Realizar la petición al backend
      const response = await axios.post(baseURL, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      console.log(`✅ Servicio creado: ${response.data.service.nombre}`);
    }
    console.log("✅ Todos los servicios se han creado correctamente.");
  } catch (error) {
    console.error("❌ Error al crear los servicios:", error.message);
  }
};

createServices();
