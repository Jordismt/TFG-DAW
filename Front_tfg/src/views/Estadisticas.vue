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
                    class="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{{ new Date(cita.fecha).toLocaleString() }}</strong> - 
                      {{ cita.service_id?.nombre || "Servicio eliminado" }} 
                      <span v-if="cita.service_id">({{ cita.service_id.precio }}€)</span>
                    </div>
                    <div class="btn-group">
                      <button
                        class="btn btn-warning btn-sm"
                        @click="abrirEdicion(cita)"
                      >
                        Editar
                      </button>
                      <button
                        class="btn btn-danger btn-sm"
                        @click="cancelarCita(cita._id)"
                      >
                        Cancelar
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div v-else-if="busquedaRealizada" class="alert alert-info">
            No se encontraron usuarios con ese nombre.
          </div>

          <!-- Modal/Sección de edición -->
          <div v-if="citaAEditar" class="card mt-4 p-4 shadow">
            <h5 class="card-title mb-3">Editar Cita</h5>
            <form @submit.prevent="guardarEdicion">
              <div class="mb-3">
                <label class="form-label">Servicio:</label>
                <select v-model="editForm.service_id" class="form-select" @change="cargarHorariosEdicion" required>
                  <option value="" disabled>Selecciona un servicio</option>
                  <option v-for="servicio in servicios" :key="servicio._id" :value="servicio._id">
                    {{ servicio.nombre }}
                  </option>
                </select>
              </div>

              <div class="mb-3">
                <label class="form-label">Fecha:</label>
                <input v-model="editForm.fecha" type="date" class="form-control" @change="cargarHorariosEdicion" required />
              </div>

              <div class="mb-3" v-if="horariosEdicion.length > 0">
                <label class="form-label">Hora:</label>
                <div class="d-flex flex-wrap gap-2">
                  <button
                    v-for="hora in horariosEdicion"
                    :key="hora"
                    class="btn"
                    :class="{'btn-outline-primary': editForm.hora !== hora, 'btn-primary': editForm.hora === hora}"
                    @click.prevent="seleccionarHoraEdicion(hora)"
                  >
                    {{ hora }}
                  </button>
                </div>
              </div>

              <button type="submit" class="btn btn-success">Guardar Cambios</button>
              <button type="button" class="btn btn-secondary ms-2" @click="cerrarEdicion">Cancelar</button>
            </form>
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
import {
  buscarUsuariosConCitas,
  fetchServices,
  fetchAvailableSlots,
  updateAppointment,
  cancelAppointment, // <-- Importa la función cancelar
} from '@/services/apiServices';

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

      // Para edición
      servicios: [],
      citaAEditar: null,
      editForm: {
        service_id: '',
        fecha: '',
        hora: '',
      },
      horariosEdicion: [],
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
    await this.cargarServicios();
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

    // Cargar servicios para el select de edición
    async cargarServicios() {
      try {
        const response = await fetchServices();
        this.servicios = response.data;
      } catch (error) {
        console.error('Error al cargar servicios:', error);
      }
    },

    abrirEdicion(cita) {
      this.citaAEditar = cita;
      this.editForm.service_id = cita.service_id?._id || '';
      this.editForm.fecha = new Date(cita.fecha).toISOString().slice(0, 10);
      this.editForm.hora = new Date(cita.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      this.cargarHorariosEdicion();
    },
    cerrarEdicion() {
      this.citaAEditar = null;
      this.editForm = { service_id: '', fecha: '', hora: '' };
      this.horariosEdicion = [];
    },
    async cargarHorariosEdicion() {
      if (this.editForm.service_id && this.editForm.fecha) {
        try {
          const response = await fetchAvailableSlots(this.editForm.service_id, this.editForm.fecha);
          this.horariosEdicion = response.data.map((slot) => {
            const date = new Date(slot);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          });
        } catch (error) {
          this.horariosEdicion = [];
          console.error('Error al cargar horarios disponibles:', error);
        }
      }
    },
    seleccionarHoraEdicion(hora) {
      this.editForm.hora = hora;
    },
    async guardarEdicion() {
      if (!this.editForm.service_id || !this.editForm.fecha || !this.editForm.hora) {
        alert('Por favor, completa todos los campos.');
        return;
      }

      const fechaHora = new Date(`${this.editForm.fecha}T${this.editForm.hora}:00`);

      try {
        await updateAppointment(this.citaAEditar._id, {
          service_id: this.editForm.service_id,
          fecha: fechaHora.toISOString(),
        });
        alert('Cita actualizada correctamente.');
        this.cerrarEdicion();
        this.buscarUsuarios();
      } catch (error) {
        console.error('Error al guardar edición:', error);
        alert('No se pudo actualizar la cita.');
      }
    },

    async cancelarCita(idCita) {
      if (!confirm('¿Seguro que quieres cancelar esta cita?')) return;

      try {
        await cancelAppointment(idCita);
        alert('Cita cancelada correctamente.');
        this.buscarUsuarios();
      } catch (error) {
        console.error('Error al cancelar cita:', error);
        alert('No se pudo cancelar la cita.');
      }
    },
  },
};
</script>

<style scoped>
.card {
  border-radius: 10px;
}
.btn-group > button {
  min-width: 75px;
}
.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
}
.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}
.btn-primary {
  background-color: #007bff;
  color: white;
}
.active {
  background-color: #007bff !important;
  color: white !important;
}
</style>
