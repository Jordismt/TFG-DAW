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

      <div v-if="carrito.items.length > 0" class="mt-4">
        <h4 class="text-center">Total: {{ calcularTotal }}€</h4>

        <!-- Formulario de Dirección de Envío y Método de Pago -->
        <form @submit.prevent="finalizarCompra" class="mt-4">
          <div class="mb-3">
            <label for="calle" class="form-label">Calle</label>
            <input type="text" id="calle" v-model="direccion.calle" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="ciudad" class="form-label">Ciudad</label>
            <input type="text" id="ciudad" v-model="direccion.ciudad" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="codigo_postal" class="form-label">Código Postal</label>
            <input type="text" id="codigo_postal" v-model="direccion.codigo_postal" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="pais" class="form-label">País</label>
            <input type="text" id="pais" v-model="direccion.pais" class="form-control" required />
          </div>

          <div class="mb-3">
            <label for="metodo_pago" class="form-label">Método de Pago</label>
            <select id="metodo_pago" v-model="metodo_pago" class="form-select" required>
              <option value="tarjeta">Tarjeta</option>
              <option value="paypal">PayPal</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          <!-- Botones -->
          <div class="text-center">
            <button class="btn btn-danger" type="button" @click="vaciarCarrito">
              Vaciar carrito
            </button>
            <button 
              class="btn btn-success ms-2"
              type="submit"
              :disabled="!puedeFinalizarCompra"
            >
              Finalizar Compra
            </button>
          </div>
        </form>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import { fetchCarrito, clearCarrito, finalizarCompra as finalizarCompraAPI } from '@/services/apiServices';

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
      direccion: {
        calle: '',
        ciudad: '',
        codigo_postal: '',
        pais: ''
      },
      metodo_pago: 'tarjeta'
    };
  },
  computed: {
    calcularTotal() {
      return this.carrito.items.reduce((total, item) => {
        return total + (item.product_id.precio * item.cantidad);
      }, 0).toFixed(2);
    },
    puedeFinalizarCompra() {
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
        const datos = {
          direccion_envio: this.direccion,
          metodo_pago: this.metodo_pago
        };

        console.log("📦 Datos que se enviarán:", datos); // 👈 AÑADE ESTO

        const response = await finalizarCompraAPI(datos);
        alert("Compra finalizada con éxito!");

        this.carrito = { items: [], total: 0 };
        this.direccion = { calle: '', ciudad: '', codigo_postal: '', pais: '' };
        this.metodo_pago = 'tarjeta';
      } catch (error) {
        console.error("Error al finalizar la compra:", error);
        alert("No se pudo finalizar la compra. Revisa el formulario.");
      }
    }

  }
};
</script>
