# Proyecto Final CFGS DAW - Web para Peluquería

Este es el proyecto final del ciclo de Desarrollo de Aplicaciones Web (DAW). Consiste en el desarrollo de una aplicación web para una peluquería, con múltiples funcionalidades tanto para usuarios como para administradores.

🌐 **URL del proyecto desplegado:** [https://tfg-daw-rfrw.vercel.app/](https://tfg-daw-rfrw.vercel.app/)

---

## ✨ Funcionalidades principales

- **Autenticación de usuarios:**
  - Registro y login de clientes.
  - Roles diferenciados para administradores y clientes.

- **Servicios y productos:**
  - Visualización de los servicios y productos disponibles.

- **Gestión de citas:**
  - Crear citas para los diferentes servicios.

- **Carrito y pedidos:**
  - Añadir productos al carrito.
  - Crear y visualizar pedidos.

- **Perfil de usuario:**
  - Visualizar información personal.
  - Historial de pedidos y citas.

- **Panel de estadísticas:**
  - Exclusivo para administradores.

---

## 🚀 Instalación y ejecución local

Si deseas ejecutar este proyecto en tu entorno local, sigue estos pasos:

### 1️⃣ Clonar el repositorio

```bash
git clone <URL-del-repositorio>
# Para la API
cd Api_TFG
npm install

# Para el Frontend
cd ../Front_tfg
npm install

---

### Parte 3: Ejecución de servidores + Tecnologías + Estructura + Info adicional


### 3️⃣ Ejecutar los servidores de desarrollo

En dos terminales separados, inicia los entornos de desarrollo:

```bash
# API
cd Api_TFG
npm run dev

# Frontend
cd ../Front_tfg
npm run dev
```
🛠️ Tecnologías utilizadas
Frontend: Vue.js, Bootstrap, CSS, ChartJS

Backend: Node.js, Express.js

Base de datos: MongoDB

Autenticación: JWT

Despliegue: Vercel (Frontend) Render(Backend) Mongo Atlas(BD Mongo)

📁 Estructura del repositorio

Api_TFG/        # Backend: API REST
Front_tfg/      # Frontend: aplicación Vue
README.md       # Documentación del proyecto
