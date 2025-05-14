<template>
  <div>
    <Header :title="'Detalles del Producto'" />

    <div class="container my-5" v-if="producto">
      <div class="row">
        <div class="col-md-6">
          <img 
            crossorigin="anonymous"
            :src="producto.imagen" 
            class="img-fluid" 
            alt="Imagen del producto"
          />
        </div>
        <div class="col-md-6">
          <h2>{{ producto.nombre }}</h2>
          <p>{{ producto.descripcion }}</p>
          <p class="text-primary fw-bold">{{ producto.precio }}€</p>
          <p class="fw-bold">Stock: {{ producto.stock }}</p>

          <!-- Input para seleccionar la cantidad -->
          <div class="d-flex align-items-center mb-3">
            <label for="cantidad" class="me-2">Cantidad:</label>
            <input 
              id="cantidad"
              type="number" 
              v-model.number="cantidad" 
              min="1" 
              :max="producto.stock" 
              class="form-control w-25"
            />
          </div>

          <button class="btn btn-success" @click="añadirAlCarrito(producto)">
            Añadir al carrito
          </button>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { fetchProductoPorId, addToCarrito } from '@/services/apiServices';

export default {
  name: 'DetalleProducto',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      producto: null,
      cantidad: 1, // Nueva cantidad por defecto
    };
  },
  async mounted() {
    try {
      const response = await fetchProductoPorId(this.$route.params.id);
      this.producto = response.data;
    } catch (error) {
      console.error('Error al cargar el producto: ', error);
    }
  },
  methods: {
    async añadirAlCarrito(producto) {
      if (this.cantidad > 0 && this.cantidad <= producto.stock) {
        try {
          await addToCarrito(producto._id, this.cantidad);
          alert(`Producto "${producto.nombre}" añadido al carrito.`);
        } catch (error) {
          console.error("Error al añadir al carrito: ", error);
          alert("No se pudo añadir al carrito. Inténtalo más tarde.");
        }
      } else {
        alert("La cantidad seleccionada no es válida.");
      }
    },
  },
};
</script>
