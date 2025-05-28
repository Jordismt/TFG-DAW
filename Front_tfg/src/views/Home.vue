<template>
  <div>
    <!-- Header con título dinámico -->
    <Header :title="'PELUQUERIA AINHOA'" />

    <!-- MAIN -->
    <main class="container my-5">
      <h2 class="text-center mb-5">Nuestros Servicios</h2>

      <!-- Carrusel de Servicios -->
      <div id="serviciosCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div 
            class="carousel-item" 
            v-for="(servicio, index) in servicios" 
            :key="servicio._id" 
            :class="{'active': index === 0}"
          >
            <div class="card h-100 shadow-lg rounded-3" style="background-color: #01126C; color: white;">
              <img
                crossorigin="anonymous"
                :src="getImageUrl(servicio.imagen)"
                class="d-block w-100"
                :alt="servicio.nombre"
              >
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title">{{ servicio.nombre }}</h5>
                <p class="card-text">{{ servicio.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles del Carrusel -->
        <button class="carousel-control-prev" type="button" data-bs-target="#serviciosCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#serviciosCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <!-- Botón para redirigir a la página de Servicios -->
      <div class="text-center mt-4">
        <router-link to="/servicios" class="btn btn-outline-light" style="background-color: #01126C; color: #98E4FF;">Ver más servicios</router-link>
      </div>

      <!-- Carrusel de Productos Destacados -->
      <h2 class="text-center mb-5 mt-5">Nuestros Productos</h2>
      <div id="productosCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-inner">
          <div 
            class="carousel-item" 
            v-for="(producto, index) in productos" 
            :key="producto._id"
            :class="{'active': index === 0}"
          >
            <div class="card h-100 shadow-lg rounded-3" style="background-color: #01126C; color: white;">
              <img
                crossorigin="anonymous"
                :src="getImageUrl(producto.imagen)"
                class="d-block w-100"
                :alt="producto.nombre"
              >
              <div class="card-body d-flex flex-column justify-content-between">
                <h5 class="card-title">{{ producto.nombre }}</h5>
                <p class="card-text">{{ producto.descripcion }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Controles del Carrusel -->
        <button class="carousel-control-prev" type="button" data-bs-target="#productosCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#productosCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <!-- Botón para redirigir a la página de Tienda -->
      <div class="text-center mt-4">
        <router-link to="/tienda" class="btn btn-outline-light" style="background-color: #01126C; color: #98E4FF;">Ver nuestra tienda</router-link>
      </div>

      <!-- Card de Sobre Nosotros -->
      <div class="row mt-5">
        <div class="col-md-12 mb-4">
          <div class="card h-100 shadow-lg rounded-3 sobre-nosotros-card">
            <div class="card-body">
              <h5 class="card-title">Sobre Nosotros</h5>
              <p class="card-text">
                Somos un equipo de profesionales dedicados a ofrecerte los mejores servicios y productos de belleza. 
                Con años de experiencia, estamos comprometidos con tu bienestar.
              </p>
              <router-link to="/sobre-nosotros">
                <button class="btn btn-light mt-3 sobre-nosotros-btn">
                  Leer más
                </button>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Card de Reseñas -->
      <div class="row mt-5">
        <div class="col-md-12 mb-4">
          <div class="card h-100 shadow-lg rounded-3" style="background-color: #01126C; color: white;">
            <div class="card-body">
              <h5 class="card-title">Reseñas</h5>
              <p class="card-text">
                "Excelente servicio, me encantó el corte y la atención fue de 10!" - Juan Pérez
                <br>
                "Productos de alta calidad, ¡me recomendaron el tinte y quedó espectacular!" - Laura Gómez
              </p>
              <button class="btn btn-light mt-3" style="background-color: #98E4FF; color: #01126C;">Ver más</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Carrusel de Marcas -->
      <h2 class="text-center mt-5 mb-3">Nuestras Marcas</h2>
      <div class="marcas-carousel">
        <div class="marcas-track">
          <img v-for="(marca, index) in marcas" :key="index" :src="marca.imagen" alt="Marca" />
          <img v-for="(marca, index) in marcas" :key="'dup-' + index" :src="marca.imagen" alt="Marca" />
        </div>
      </div>

    </main>

    <!-- Footer Component -->
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { fetchServicios, fetchProductos } from '@/services/apiServices';

export default {
  name: 'Home',
  components: {
    Header,
    Footer
  },
  data() {
    return {
      servicios: [],
      productos: [],
      marcas: [
        { imagen: 'marca1.jpg' },
        { imagen: 'marca2.jpg' },
        { imagen: 'marca3.jpg' },
        { imagen: 'marca4.jpg' }
      ]
    };
  },
  methods: {
getImageUrl(path) {
  if (!path) return '';

  // Si la URL contiene 'localhost', reemplázala por tu backend
  if (path.includes('localhost')) {
    // Extraemos el path de la URL de localhost y lo concatenamos con baseUrl
    const urlObj = new URL(path);
    const imagePath = urlObj.pathname; // ejemplo: /uploads/imagen.jpg
    const baseUrl = 'https://tfg-daw-api-tfg.onrender.com';
    return `${baseUrl}${imagePath}`;
  }

  // Si la ruta ya es URL pública válida (sin localhost), la dejamos igual
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  // Si es ruta relativa, la concatenamos con baseUrl
  let imagePath = path.startsWith('/uploads') ? path : `/uploads/${path.startsWith('/') ? path.slice(1) : path}`;
  const baseUrl = 'https://tfg-daw-api-tfg.onrender.com';

  return `${baseUrl}${imagePath}`;
}




  },
  async mounted() {
    try {
      const responseServicios = await fetchServicios();
      this.servicios = responseServicios.data;

      const responseProductos = await fetchProductos();
      this.productos = responseProductos.data;
    } catch (error) {
      console.error("Error al cargar los datos: ", error);
    }
  }
};
</script>

<style scoped>
.card-img-top {
  height: 250px;
  object-fit: cover;
}

.carousel-inner .carousel-item img {
  height: 350px;
  object-fit: cover;
}

.card-body {
  padding: 20px;
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.card-text {
  font-size: 1rem;
}

button {
  transition: all 0.3s ease;
}

button:hover {
  background-color: #86D6FF;
  transform: scale(1.05);
}

.sobre-nosotros-card {
  background-color: #01126C;
  color: white;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.sobre-nosotros-card:hover {
  transform: translateY(-5px);
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
}

.sobre-nosotros-btn {
  background-color: #98E4FF;
  color: #01126C;
  border: none;
}

.sobre-nosotros-btn:hover {
  background-color: #86D6FF;
  color: #01126C;
}

.marcas-carousel {
  overflow: hidden;
  white-space: nowrap;
  margin-bottom: 30px;
  width: 100%;
}

.marcas-track {
  display: inline-flex;
  animation: scroll 10s linear infinite;
  width: max-content;
}

.marcas-track img {
  margin-right: 15px;
  height: 80px;
  border-radius: 10px;
  object-fit: contain;
}

@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
</style>
