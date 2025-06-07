<template>
  <div>
    <Header :title="'Panel de Estadísticas'" />

    <div class="container my-5">
      <h2 class="text-center mb-4">📊 Estadísticas de la peluquería</h2>

      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status"></div>
        <p class="mt-2">Cargando estadísticas...</p>
      </div>

      <div v-else>
        <!-- Tarjetas -->
        <div class="row g-4">
          <div class="col-md-3" v-for="(value, key) in summaryCards" :key="key">
            <div class="card text-center shadow-sm border-0">
              <div class="card-body">
                <h6 class="card-title">{{ key }}</h6>
                <p class="card-text fs-4 fw-bold">
                  <span v-if="typeof value === 'number'">{{ value }}</span>
                  <span v-else>{{ value }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Gráfico -->
        <div class="mt-5">
          <h4 class="text-center mb-3">📈 Pedidos e ingresos mensuales</h4>
          <canvas id="ordersChart" height="100"></canvas>
        </div>

        <!-- Buscador de usuarios -->
        <div class="mt-5">
          <h4 class="mb-3">🔍 Buscar citas por nombre de usuario</h4>
          <div class="input-group mb-3" style="max-width: 400px;">
            <input
              v-model="nombreBusqueda"
              @keyup.enter="buscarUsuarios"
              type="text"
              class="form-control"
              placeholder="Ej. Ana, Pedro..."
            />
            <button class="btn btn-primary" @click="buscarUsuarios">Buscar</button>
          </div>

          <div v-if="usuariosCitas.length">
            <h5>Resultados:</h5>
            <div
              class="card mb-3 shadow-sm"
              v-for="usuario in usuariosCitas"
              :key="usuario.usuario._id"
            >
              <div class="card-body">
                <h6 class="card-title">{{ usuario.usuario.nombre }} ({{ usuario.usuario.email }})</h6>
                <ul class="list-group list-group-flush mt-2">
                  <li
                    v-for="cita in usuario.citas"
                    :key="cita._id"
                    class="list-group-item"
                  >
                    <strong>{{ new Date(cita.fecha).toLocaleString() }}</strong> - 
                    {{ cita.service_id?.nombre || "Servicio eliminado" }} 
                    <span v-if="cita.service_id">({{ cita.service_id.precio }}€)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-else-if="busquedaRealizada" class="alert alert-info">
            No se encontraron usuarios con ese nombre.
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
import axios from 'axios';
import Chart from 'chart.js/auto';
import { buscarUsuariosConCitas } from '@/services/apiService';

const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default {
  name: 'Estadísticas',
  components: { Header, Footer },
  data() {
    return {
      stats: {},
      loading: true,
      nombreBusqueda: '',
      usuariosCitas: [],
      busquedaRealizada: false,
    };
  },
  computed: {
    summaryCards() {
      return {
        'Pedidos Totales': this.stats.totalOrders ?? 0,
        'Citas Totales': this.stats.totalAppointments ?? 0,
        'Usuarios Registrados': this.stats.totalUsers ?? 0,
        'Ingresos Totales': `${(this.stats.totalRevenue || 0).toFixed(2)} €`,
      };
    },
  },
  async mounted() {
    await this.fetchStats();
    this.renderChart();
  },
  methods: {
    async fetchStats() {
      const token = localStorage.getItem('userToken');
      if (!token) return this.$router.push('/');

      try {
        const response = await axios.get(`${baseUrl.replace(/\/api\/?$/, '')}/api/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.stats = response.data;
        this.loading = false;
      } catch (error) {
        console.error('Error al obtener estadísticas:', error);
      }
    },
    renderChart() {
      if (!this.stats.ordersPerMonth) return;

      const ctx = document.getElementById('ordersChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.stats.ordersPerMonth.map((m) => `Mes ${m._id}`),
          datasets: [
            {
              label: 'Pedidos',
              data: this.stats.ordersPerMonth.map((m) => m.count),
              backgroundColor: '#4caf50',
            },
            {
              label: 'Ingresos (€)',
              data: this.stats.ordersPerMonth.map((m) => m.revenue),
              backgroundColor: '#ff9800',
            },
          ],
        },
      });
    },
    async buscarUsuarios() {
      if (!this.nombreBusqueda.trim()) return;

      try {
        const { data } = await buscarUsuariosConCitas(this.nombreBusqueda);
        this.usuariosCitas = data;
      } catch (err) {
        console.warn('No se encontraron usuarios:', err);
        this.usuariosCitas = [];
      } finally {
        this.busquedaRealizada = true;
      }
    },
  },
};
</script>

<style scoped>
.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin: 30px 0;
}

.stat-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-size: 1.2rem;
}
.card {
  border-radius: 10px;
}
</style>
