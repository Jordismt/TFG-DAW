<template>
  <div>
    <Header :title="'Carrito de Compras'" />

    <div class="container my-5">
      <h2 class="text-center mb-5">Tu Carrito</h2>

      <div v-if="carrito.items.length === 0" class="alert alert-info">
        El carrito está vacío.
      </div>

      <div v-for="item in carrito.items" :key="item.product_id._id" class="card mb-3">
        <div class="card-body">
          <h5 class="card-title">{{ item.product_id.nombre }}</h5>
          <p class="card-text">Cantidad: {{ item.cantidad }}</p>
          <p class="card-text">Precio: {{ (item.product_id.precio * item.cantidad).toFixed(2) }}€</p>
          <p class="text-danger" v-if="item.cantidad > item.product_id.stock">
            ❌ No hay suficiente stock (Stock disponible: {{ item.product_id.stock }})
          </p>
        </div>
      </div>

      <div v-if="carrito.items.length > 0" class="text-center">
        <h4>Total: {{ calcularTotal }}€</h4>
        <button class="btn btn-danger" @click="vaciarCarrito">
          Vaciar carrito
        </button>
        <button 
          class="btn btn-success ms-2"
          @click="finalizarCompra"
          :disabled="!puedeFinalizarCompra"
        >
          Finalizar Compra
        </button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { fetchCarrito, clearCarrito, finalizarCompra } from '@/services/apiServices';

export default {
  name: 'Carrito',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      carrito: {
        items: [],
        total: 0,
      },
    };
  },
  computed: {
    calcularTotal() {
      return this.carrito.items.reduce((total, item) => {
        return total + (item.product_id.precio * item.cantidad);
      }, 0).toFixed(2);
    },
    puedeFinalizarCompra() {
      // Valida si hay stock suficiente en todos los productos
      return this.carrito.items.every(item => item.cantidad <= item.product_id.stock);
    }
  },
  async mounted() {
    try {
      const response = await fetchCarrito();
      this.carrito = response.data;
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  },
  methods: {
    async vaciarCarrito() {
      try {
        await clearCarrito();
        this.carrito = { items: [], total: 0 };
        alert("Carrito vaciado correctamente.");
      } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        alert("No se pudo vaciar el carrito. Inténtalo más tarde.");
      }
    },
    async finalizarCompra() {
      try {
        const response = await finalizarCompra();
        alert("Compra finalizada con éxito!");
        this.carrito = { items: [], total: 0 }; // Vaciar el carrito en frontend
      } catch (error) {
        console.error("Error al finalizar la compra:", error);
        alert("No se pudo finalizar la compra. Revisa el stock e inténtalo de nuevo.");
      }
    }
  }
};
</script>
