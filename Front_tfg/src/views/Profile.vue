<template>
  <div>
    <Header :title="'Perfil de Usuario'" />
    
    <div class="profile-container">
      <div class="container text-center">
        <h1 class="mb-4 fw-bold">Perfil de Usuario</h1>

        <div v-if="user">
          <div class="profile-info">
            <p><strong>Nombre:</strong> {{ user.nombre }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Rol:</strong> {{ user.role }}</p>
          </div>

          <button @click="logout" class="btn btn-outline-danger btn-sm mt-3">
            Cerrar Sesión
          </button>

          <!-- Pedidos del usuario -->
          <div v-if="orders.length > 0">
            <h2 class="mt-4 text-center">Tus Pedidos</h2>
            <ul class="list-group mt-3">
              <li v-for="order in orders" :key="order._id" class="list-group-item">
                <strong>Orden ID:</strong> {{ order._id }}<br>
                <strong>Estado:</strong> <span :class="getEstadoClase(order.estado)">{{ order.estado }}</span><br>
                <strong>Total:</strong> {{ order.total.toFixed(2) }}€<br>
                <strong>Fecha:</strong> {{ new Date(order.createdAt).toLocaleDateString() }}<br>
                <strong>Productos:</strong>
                <ul>
                  <li v-for="item in order.productos" :key="item.product_id._id">
                    {{ item.product_id.nombre }} - {{ item.cantidad }} unidades
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div v-else>
            <p class="text-center mt-4">No tienes pedidos aún.</p>
          </div>

        </div>

        <div v-else-if="loading">
          <p>Cargando información del usuario...</p>
        </div>

        <div v-else>
          <p>No se pudo cargar la información del usuario. Por favor, inicie sesión.</p>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default {
  name: 'Profile',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      user: null,
      orders: [],
      loading: true,
    };
  },
  created() {
    this.loadUser();
    this.loadOrders();
  },
  methods: {
    async loadUser() {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/users/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          this.user = response.data;
        } catch (error) {
          console.error('Error al cargar datos del usuario:', error);
          alert('No se pudo cargar la información del usuario.');
          localStorage.removeItem('userToken');
          this.$router.push('/');
        }
      } else {
        this.$router.push('/');
      }
      this.loading = false;
    },
    

    async loadOrders() {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          this.orders = response.data;
        } catch (error) {
          console.error('Error al cargar pedidos:', error);
          alert('No se pudieron cargar los pedidos.');
        }
      }
    },

    getEstadoClase(estado) {
      switch (estado) {
        case 'pendiente': return 'text-warning';
        case 'pagado': return 'text-primary';
        case 'enviado': return 'text-info';
        case 'completado': return 'text-success';
        case 'cancelado': return 'text-danger';
        case 'rechazado': return 'text-danger';
        case 'reembolsado': return 'text-secondary';
        default: return 'text-muted';
      }
    },
    logout() {
      localStorage.removeItem('userToken');
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.profile-container {
  background-color: #f4f6f9;
  padding: 40px 0;
}

.profile-info {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.profile-info p {
  font-size: 1.2rem;
  margin: 10px 0;
}

button {
  border-radius: 20px;
  font-size: 1rem;
  padding: 10px 20px;
}
</style>
