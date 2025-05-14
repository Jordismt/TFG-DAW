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
              :src="servicio.imagen"
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
    </div>

    <Footer />
  </div>
</template>


<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { fetchServicioDetalle } from '@/services/apiServices';

export default {
  name: 'ServicioDetalle',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      servicio: null,
    };
  },
  async mounted() {
    const servicioId = this.$route.params.id; // Obtener el ID del servicio desde la URL
    try {
      const response = await fetchServicioDetalle(servicioId);
      this.servicio = response.data;
    } catch (error) {
      console.error("Error al cargar el servicio: ", error);
    }
  },
  methods: {
    irAPedirCita() {
      // Redirigimos a la página de citas y pasamos el ID del servicio por query param
      this.$router.push({ name: 'Citas', query: { service_id: this.servicio._id } });
    }
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
