<template>
  <div>
    <Header :title="'Carrito de Compras'" />

    <div class="container my-5">
      <h2 class="text-center mb-5">Tu Carrito</h2>

      <div v-if="carrito.items.length === 0" class="alert alert-info">
        El carrito está vacío.
      </div>

      <div 
        v-for="item in carrito.items" 
        :key="item.product_id._id" 
        class="card mb-3"
      >
        <div class="card-body d-flex align-items-center">
          <input
            type="checkbox"
            :value="item.product_id._id"
            v-model="seleccionados"
            class="form-check-input me-3"
          />
          <div>
            <h5 class="card-title">{{ item.product_id.nombre }}</h5>
            <p class="card-text">Cantidad: {{ item.cantidad }}</p>
            <p class="card-text">Precio: {{ (item.product_id.precio * item.cantidad).toFixed(2) }}€</p>
            <p class="text-danger" v-if="item.cantidad > item.product_id.stock">
              ❌ No hay suficiente stock (Stock disponible: {{ item.product_id.stock }})
            </p>
          </div>
        </div>
      </div>

      <div v-if="carrito.items.length > 0" class="mt-4">
        <h4 class="text-center">Total: {{ calcularTotal }}€</h4>

        <!-- Formulario de Dirección de Envío y Método de Pago -->
        <form @submit.prevent="finalizarCompra" class="mt-4">
          <div class="mb-3">
            <label for="calle" class="form-label">Calle</label>
            <input
              type="text"
              id="calle"
              v-model="direccion.calle"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="ciudad" class="form-label">Ciudad</label>
            <input
              type="text"
              id="ciudad"
              v-model="direccion.ciudad"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="codigo_postal" class="form-label">Código Postal</label>
            <input
              type="text"
              id="codigo_postal"
              v-model="direccion.codigo_postal"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="pais" class="form-label">País</label>
            <input
              type="text"
              id="pais"
              v-model="direccion.pais"
              class="form-control"
              required
            />
          </div>

          <div class="mb-3">
            <label for="metodo_pago" class="form-label">Método de Pago</label>
            <select
              id="metodo_pago"
              v-model="metodo_pago"
              class="form-select"
              required
            >
              <option value="tarjeta">Tarjeta</option>
              <option value="paypal">PayPal</option>
              <option value="transferencia">Transferencia</option>
            </select>
          </div>

          <!-- Botones -->
          <div class="text-center">
            <button
              class="btn btn-danger"
              type="button"
              @click="vaciarCarrito"
            >
              Vaciar carrito
            </button>
            <button
              class="btn btn-success ms-2"
              type="submit"
              :disabled="!puedeFinalizarCompra || seleccionados.length === 0"
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
import {
  fetchCarrito,
  clearCarrito,
  finalizarCompra as finalizarCompraAPI
} from '@/services/apiServices';

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
      metodo_pago: 'tarjeta',
      seleccionados: [], // IDs de productos seleccionados
    };
  },
  computed: {
    calcularTotal() {
      return this.carrito.items
        .filter(item => this.seleccionados.includes(item.product_id._id))
        .reduce((total, item) => {
          return total + item.product_id.precio * item.cantidad;
        }, 0)
        .toFixed(2);
    },
    puedeFinalizarCompra() {
      return this.carrito.items
        .filter(item => this.seleccionados.includes(item.product_id._id))
        .every(item => item.cantidad <= item.product_id.stock);
    }
  },
  async mounted() {
    try {
      const response = await fetchCarrito();
      this.carrito = response.data;

      // Por defecto, seleccionamos todos los productos cargados al montar
      this.seleccionados = this.carrito.items.map(item => item.product_id._id);
    } catch (error) {
      console.error("Error al cargar el carrito:", error);
    }
  },
  methods: {
    async vaciarCarrito() {
      try {
        await clearCarrito();
        this.carrito = { items: [], total: 0 };
        this.seleccionados = [];
        alert("Carrito vaciado correctamente.");
      } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        alert("No se pudo vaciar el carrito. Inténtalo más tarde.");
      }
    },
    async finalizarCompra() {
  try {
    if (this.seleccionados.length === 0) {
      alert("Debes seleccionar al menos un producto para comprar.");
      return;
    }

    const productosSeleccionados = this.carrito.items.filter(item =>
      this.seleccionados.includes(item.product_id._id)
    );

    const datos = {
      direccion_envio: this.direccion,
      metodo_pago: this.metodo_pago,
      productos: productosSeleccionados.map(item => ({
        product_id: item.product_id._id,
        cantidad: item.cantidad,
      })),
    };

    const response = await finalizarCompraAPI(datos);
    alert("Compra finalizada con éxito!");

    // Actualizamos carrito con lo que devuelve el backend (ya con los productos comprados eliminados)
    if(response.data.carrito) {
      this.carrito = response.data.carrito;
      this.seleccionados = this.carrito.items.map(item => item.product_id._id);
    } else {
      // Si no devuelve carrito, eliminamos localmente los productos comprados
      this.carrito.items = this.carrito.items.filter(
        item => !this.seleccionados.includes(item.product_id._id)
      );
      this.seleccionados = [];
    }

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
