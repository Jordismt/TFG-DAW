<template>
  <footer class="custom-footer text-white py-3 mt-5">
    <div class="container text-center">
      <p>&copy; 2025 Peluquería Ainhoa - Todos los derechos reservados</p>
      <nav>
        <router-link to="/" class="text-white mx-2">Inicio</router-link>
        <router-link to="/tienda" class="text-white mx-2">Tienda</router-link>
        <router-link to="/servicios" class="text-white mx-2">Servicios</router-link>
        <router-link to="/citas" class="text-white mx-2">Citas</router-link>

        <!-- 🔥 Botón de Estadísticas solo si es admin -->
        <router-link v-if="isAdmin" to="/estadisticas" class="text-white mx-2 fw-bold">
          📊 Estadísticas
        </router-link>
      </nav>
    </div>
  </footer>
</template>

<script>
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
export default {
  name: 'Footer',
  data() {
    return {
      isAdmin: false,
    };
  },
  created() {
    this.checkAdmin();
  },
  methods: {
    async checkAdmin() {
      const token = localStorage.getItem('userToken'); // ⚡ Verifica si hay sesión activa
      if (!token) return; // 🔒 Si no hay token, el usuario no está autenticado

      try {
        const response = await axios.get(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.role === 'admin') {
          this.isAdmin = true; // ✅ Si el usuario es admin, muestra el botón
        }
      } catch (error) {
        console.error('Error al verificar rol del usuario:', error);
      }
    },
  },
};
</script>

<style scoped>
.custom-footer {
  background-color: #01126C; /* Fondo del footer */
  color: white; /* Texto blanco */
}

.custom-footer a {
  text-decoration: none; /* Quitar subrayado a los enlaces */
}

.custom-footer a:hover {
  text-decoration: underline; /* Subrayado al pasar el mouse */
}
</style>
