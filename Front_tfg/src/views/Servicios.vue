<template>
  <div>
    <Header :title="'Servicios'" />

    <div class="container my-5">
      <h2 class="text-center mb-4">Nuestros Servicios</h2>

      <!-- 🔍 Input de búsqueda -->
      <div class="mb-4">
        <input
          type="text"
          class="form-control"
          placeholder="Buscar servicio por nombre..."
          v-model="busqueda"
        />
      </div>

      <div class="row">
        <div v-for="servicio in serviciosFiltrados" :key="servicio._id" class="col-md-4 mb-4">
          <div class="card h-100 shadow-sm">
            <img 
              crossorigin="anonymous"
              :src="getImageUrl(servicio.imagen)" 
              class="card-img-top" 
              alt="Imagen del servicio"
              @error="servicio.imagen = 'https://via.placeholder.com/300'"
            />

            <div class="card-body">
              <h5 class="card-title">{{ servicio.nombre }}</h5>
              <p class="card-text">{{ servicio.descripcion }}</p>
              <p class="text-primary fw-bold">{{ servicio.precio }}€</p>
              <router-link 
                :to="`/servicios/${servicio._id}`" 
                class="btn btn-primary w-100"
              >
                Ver Detalles
              </router-link>
            </div>
          </div>
        </div>

        <!-- Sin resultados -->
        <div v-if="serviciosFiltrados.length === 0" class="text-center text-muted">
          <p>No se encontraron servicios con ese nombre.</p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { fetchServicios } from '@/services/apiServices';

export default {
  name: 'Servicios',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      servicios: [],
      busqueda: '', // 🔍 Campo de búsqueda
    };
  },
  computed: {
    serviciosFiltrados() {
      const texto = this.busqueda.toLowerCase();
      return this.servicios.filter(servicio =>
        servicio.nombre.toLowerCase().includes(texto)
      );
    },
  },
  async mounted() {
    try {
      const response = await fetchServicios();
      this.servicios = response.data;
    } catch (error) {
      console.error("Error al cargar los servicios: ", error);
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
  }
};
</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>
