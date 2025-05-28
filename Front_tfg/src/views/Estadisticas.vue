<template>
  <div>
    <Header :title="'Panel de Estadísticas'" />
    
    <div class="container my-5">
      <h2 class="text-center">📊 Estadísticas de la peluquería</h2>

      <div v-if="loading">Cargando estadísticas...</div>

      <div v-else>
        <!-- Tarjetas de estadísticas -->
        <div class="stats-container">
          <div class="stat-card">Pedidos Totales: <strong>{{ stats.totalOrders }}</strong></div>
          <div class="stat-card">Citas Totales: <strong>{{ stats.totalAppointments }}</strong></div>
          <div class="stat-card">Usuarios Registrados: <strong>{{ stats.totalUsers }}</strong></div>
          <div class="stat-card">Ingresos Totales: <strong>{{ stats.totalRevenue.toFixed(2) }}€</strong></div>
        </div>

        <!-- Gráfico de pedidos por mes -->
        <canvas id="ordersChart"></canvas>
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
const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export default {
  name: "Estadísticas",
  components: { Header, Footer },
  data() {
    return {
      stats: {},
      loading: true,
    };
  },
  async mounted() {
    await this.fetchStats();
    this.renderChart();
  },
  methods: {
    async fetchStats() {
      const token = localStorage.getItem("userToken");
      if (!token) return this.$router.push("/");

      try {
        const response = await axios.get(`${baseUrl.replace(/\/api\/?$/, '')}/api/stats`,  {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.stats = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error al obtener estadísticas:", error);
      }
    },
    renderChart() {
      if (!this.stats.ordersPerMonth) return;

      const ctx = document.getElementById("ordersChart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.stats.ordersPerMonth.map(month => `Mes ${month._id}`),
          datasets: [
            {
              label: "Pedidos",
              data: this.stats.ordersPerMonth.map(month => month.count),
              backgroundColor: "#4caf50",
            },
            {
              label: "Ingresos (€)",
              data: this.stats.ordersPerMonth.map(month => month.revenue),
              backgroundColor: "#ff9800",
            },
          ],
        },
      });
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
</style>
