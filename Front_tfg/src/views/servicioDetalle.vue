<template>
  <div>
    <Header :title="'Detalles del Servicio'" />

    <div class="container my-5">
      <div v-if="servicio" class="service-detail-card shadow-lg rounded-lg p-4">
        <div class="row">
          <!-- Imagen del Servicio -->
          <div class="col-md-6">
            <img
              crossorigin="anonymous"
              :src="getImageUrl(servicio.imagen)"
              class="img-fluid rounded-3 shadow-lg"
              alt="Imagen del servicio"
            />
          </div>
          <!-- Información del Servicio -->
          <div class="col-md-6 d-flex flex-column justify-content-between">
            <h2 class="service-title">{{ servicio.nombre }}</h2>
            <p class="service-description">{{ servicio.descripcion }}</p>
            <p class="text-primary fw-bold fs-3">{{ servicio.precio }}€</p>

            <!-- Botón para pedir cita -->
            <button 
              class="btn btn-success mt-3 btn-lg"
              @click="irAPedirCita"
            >
              Pedir Cita
            </button>
          </div>
        </div>
      </div>

      <div v-else class="text-center">
        <p class="fs-4">Cargando detalles del servicio...</p>
      </div>

      <!-- Modal Login/Registro -->
      <LoginRegisterModal 
        v-if="showModal" 
        @close="showModal = false" 
        @loginSuccess="handleLoginSuccess"
      />

    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import LoginRegisterModal from '@/components/LoginRegisterModal.vue';
import { fetchServicioDetalle } from '@/services/apiServices';

export default {
  name: 'ServicioDetalle',
  components: {
    Header,
    Footer,
    LoginRegisterModal,
  },
  data() {
    return {
      servicio: null,
      showModal: false,
      redirectTo: null,
    };
  },
  async mounted() {
    const servicioId = this.$route.params.id;
    try {
      const response = await fetchServicioDetalle(servicioId);
      this.servicio = response.data;
    } catch (error) {
      console.error("Error al cargar el servicio: ", error);
    }
  },
  methods: {
      getImageUrl(path) {
        if (!path) return '';

        if (path.includes('localhost')) {
          const urlObj = new URL(path);
          const imagePath = urlObj.pathname;
          const baseUrl = 'https://tfg-daw-api-tfg.onrender.com';
          return `${baseUrl}${imagePath}`;
        }

        if (/^https?:\/\//.test(path)) {
          return path;
        }

        let imagePath = path.startsWith('/uploads') ? path : `/uploads/${path.startsWith('/') ? path.slice(1) : path}`;
        const baseUrl = 'https://tfg-daw-api-tfg.onrender.com';

        return `${baseUrl}${imagePath}`;
      },
    irAPedirCita() {
      const isAuthenticated = !!localStorage.getItem('userToken');
      if (isAuthenticated) {
        this.$router.push({ name: 'Citas' });
      } else {
        // Mostrar modal y asignar redirección
        this.redirectTo = { name: 'Citas' };
        this.showModal = true;
      }
    },
    handleLoginSuccess() {
      this.showModal = false;
      if (this.redirectTo) {
        this.$router.push(this.redirectTo);
        this.redirectTo = null;
      }
    },
  }
};
</script>



<style scoped>
.service-detail-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.service-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

.service-description {
  font-size: 1.1rem;
  color: #555;
  line-height: 1.5;
  margin-top: 15px;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

@media (max-width: 767px) {
  .service-title {
    font-size: 2rem;
  }

  .service-description {
    font-size: 1rem;
  }

  .btn {
    font-size: 1.1rem;
  }
}
</style>
