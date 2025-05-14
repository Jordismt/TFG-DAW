<template>
  <div>
    <Header :title="'Tienda'" />

    <div class="container my-5">
      <h2 class="text-center mb-5">Nuestros Productos</h2>

      <div class="row">
        <div 
          v-for="producto in productos" 
          :key="producto._id" 
          class="col-md-4 mb-4"
        >
          <div class="card h-100 shadow-sm">
            <img 
              crossorigin="anonymous"
              :src="producto.imagen" 
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
              <!-- Botón para ver detalles -->
              <router-link :to="{ name: 'detalleProducto', params: { id: producto._id } }" class="btn btn-info w-100">
                Ver detalles
              </router-link>
            </div>
          </div>
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
    };
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
    async añadirAlCarrito(producto) {
      try {
        await addToCarrito(producto._id, 1); // Aquí le pasamos la cantidad
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
