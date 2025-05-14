import axios from "axios";
import FormData from "form-data";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Solución para ES Modules (reemplazo de __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseURL = "http://localhost:5000/api/products"; // La URL del backend (Api_TFG)
const rootPath = '/home/jordi/Escritorio/TFG_DAW/Api_TFG/src/uploads';

const products = [




  {
    nombre: "Serum Antifrizz",
    descripcion: "Serum para reducir el encrespamiento y aportar brillo.",
    precio: 18.99,
    stock: 25,
    imagen: "serum-antifrizz.jpg",
  },
];

const createProducts = async () => {
  try {
    for (const product of products) {
      const imagePath = path.join(rootPath, product.imagen); // Ruta completa del archivo de imagen
      console.log(`⏳ Buscando imagen en: ${imagePath}`);

      if (!fs.existsSync(imagePath)) {
        console.error(`❌ Imagen no encontrada: ${imagePath}`);
        continue;
      }

      console.log(`⏳ Creando producto: ${product.nombre}...`);

      const formData = new FormData();
      formData.append("nombre", product.nombre);
      formData.append("descripcion", product.descripcion);
      formData.append("precio", product.precio);
      formData.append("stock", product.stock);
      formData.append("imagen", fs.createReadStream(imagePath)); // Usar la ruta completa de la imagen

      // Realizar la petición al backend
      const response = await axios.post(baseURL, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      console.log(`✅ Producto creado: ${response.data.product.nombre}`);
    }
    console.log("✅ Todos los productos se han creado correctamente.");
  } catch (error) {
    console.error("❌ Error al crear los productos:", error.message);
  }
};

createProducts();
