<template>
  <div>
    <Header :title="'Tienda'" />

    <div class="container my-5">
      <h2 class="text-center mb-4">Nuestros Productos</h2>

      <!-- 🔍 Input de búsqueda -->
      <div class="mb-4">
        <input
          type="text"
          class="form-control"
          placeholder="Buscar producto por nombre..."
          v-model="busqueda"
        />
      </div>

      <div class="row">
        <div 
          v-for="producto in productosFiltrados" 
          :key="producto._id" 
          class="col-md-4 mb-4"
        >
          <div class="card h-100 shadow-sm">
            <img 
              crossorigin="anonymous"
              :src="getImageUrl(producto.imagen)" 
              class="card-img-top" 
              alt="Imagen del producto"
              @error="producto.imagen = 'https://via.placeholder.com/300'"
            />

            <div class="card-body">
              <h5 class="card-title">{{ producto.nombre }}</h5>
              <p class="card-text">{{ producto.descripcion }}</p>
              <p class="text-primary fw-bold">{{ producto.precio }}€</p>
              <button class="btn btn-success w-100 mb-2" @click="añadirAlCarrito(producto)">
                Añadir al carrito
              </button>
              <router-link :to="{ name: 'detalleProducto', params: { id: producto._id } }" class="btn btn-info w-100">
                Ver detalles
              </router-link>
            </div>
          </div>
        </div>

        <!-- Sin resultados -->
        <div v-if="productosFiltrados.length === 0" class="text-center text-muted">
          <p>No se encontraron productos con ese nombre.</p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { fetchProductos, addToCarrito } from '@/services/apiServices';

export default {
  name: 'Tienda',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      productos: [],
      busqueda: '', // 🔍 Campo de búsqueda
    };
  },
  computed: {
    productosFiltrados() {
      const texto = this.busqueda.toLowerCase();
      return this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(texto)
      );
    },
  },
  async mounted() {
    try {
      const response = await fetchProductos();
      this.productos = response.data;
    } catch (error) {
      console.error('Error al cargar los productos: ', error);
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
    async añadirAlCarrito(producto) {
      try {
        await addToCarrito(producto._id, 1);
        alert(`Producto "${producto.nombre}" añadido al carrito.`);
      } catch (error) {
        console.error("Error al añadir al carrito: ", error);
        alert("No se pudo añadir al carrito. Inténtalo más tarde.");
      }
    },
  },
};
</script>

<style scoped>
.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>
