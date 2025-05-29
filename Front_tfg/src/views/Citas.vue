<template>
  <div>
    <Header :title="'Citas'" />

    <div class="container my-5">
      <h2 class="text-center mb-5">Gestiona tus citas</h2>

      <!-- Formulario para agendar una nueva cita -->
      <div class="card mb-5 p-4 shadow">
        <div class="card-body">
          <h5 class="card-title mb-4">Agendar Nueva Cita</h5>
          <form @submit.prevent="crearCita">
            <div class="mb-4">
              <label for="service_id" class="form-label">Servicio:</label>
              <select
                v-model="form.service_id"
                id="service_id"
                class="form-select"
                @change="cargarHorarios"
                required
              >
                <option value="" disabled>Selecciona un servicio</option>
                <option
                  v-for="servicio in servicios"
                  :key="servicio._id"
                  :value="servicio._id"
                >
                  {{ servicio.nombre }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label for="fecha" class="form-label">Fecha:</label>
              <input
                v-model="form.fecha"
                type="date"
                id="fecha"
                class="form-control"
                @change="cargarHorarios"
                required
              />
            </div>

            <div class="mb-4" v-if="horariosDisponibles.length > 0">
              <label for="hora" class="form-label">Hora:</label>
              <div class="d-flex flex-wrap gap-3">
                <button
                  v-for="hora in horariosDisponibles"
                  :key="hora"
                  class="btn"
                  :class="{
                    'btn-danger': isHoraOcupada(hora),
                    'btn-outline-primary': !isHoraOcupada(hora),
                    'active': form.hora === hora
                  }"
                  @click.prevent="seleccionarHora(hora)"
                  :disabled="isHoraOcupada(hora)"
                >
                  {{ hora }}
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary mt-4">
              Agendar Cita
            </button>
          </form>
        </div>
      </div>

      <!-- Listado de citas del usuario -->
      <div class="card p-4 shadow">
        <h5 class="card-title mb-4">Tus Citas Agendadas</h5>
        <ul class="list-group">
          <li class="list-group-item d-flex justify-content-between align-items-center" v-for="cita in citas" :key="cita._id">
            <div>
              <strong>{{ cita.service_id.nombre }}</strong> - {{ new Date(cita.fecha).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }) }}
            </div>
            <button class="btn btn-danger btn-sm" @click="cancelarCita(cita._id)">Cancelar</button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>


<script>
import Header from '@/components/Header.vue';
import {
  fetchUserAppointments,
  createAppointment,
  fetchServices,
  fetchAvailableSlots,
  cancelAppointment
} from '@/services/apiServices';

export default {
  name: 'Citas',
  components: { Header },
  data() {
    return {
      citas: [],
      servicios: [],
      horariosDisponibles: [],
      form: {
        service_id: '',
        fecha: '',
        hora: ''
      }
    };
  },
  async mounted() {
    await this.cargarDatos();
  },
  methods: {
  async cargarDatos() {
    try {
      const [citasResponse, serviciosResponse] = await Promise.all([
        fetchUserAppointments(),
        fetchServices()
      ]);
      this.citas = citasResponse.data;
      this.servicios = serviciosResponse.data;
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  },
  async cargarHorarios() {
    if (this.form.service_id && this.form.fecha) {
      try {
        console.log("⏳ Cargando horarios disponibles...");
        
        const response = await fetchAvailableSlots(this.form.service_id, this.form.fecha);
        
        if (response.data.length === 0) {
          console.warn("⚠️ No se encontraron horarios disponibles para esta fecha y servicio.");
          this.horariosDisponibles = [];
          return;
        }

        this.horariosDisponibles = response.data.map(slot => {
          console.log("🔹 Slot recibido:", slot);
          const fechaSlot = new Date(slot);
          return fechaSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        });

        console.log("✅ Horarios disponibles cargados:", this.horariosDisponibles);

      } catch (error) {
        console.error('❌ Error al cargar horarios:', error);
        alert("No se pudieron cargar los horarios, intenta nuevamente.");
      }
    } else {
      console.warn("⚠️ Servicio y fecha son requeridos para cargar horarios.");
      this.horariosDisponibles = [];
    }
  },
  seleccionarHora(hora) {
    this.form.hora = hora;
  },
  /**
   * 🔍 Verifica si una hora está ocupada por el usuario
   */
  isHoraOcupada(hora) {
    return this.citas.some(cita => {
      const citaFecha = new Date(cita.fecha);
      const fechaSeleccionada = new Date(this.form.fecha);

      return (
        citaFecha.toDateString() === fechaSeleccionada.toDateString() &&
        citaFecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) === hora
      );
    });
  },
  async crearCita() {
    try {
      await createAppointment(this.form.service_id, `${this.form.fecha}T${this.form.hora}:00`);
      alert('Cita agendada correctamente');
      this.form = { service_id: '', fecha: '', hora: '' };
      await this.cargarDatos();
    } catch (error) {
      console.error('Error al crear la cita:', error);
    }
  },
  async cancelarCita(id) {
    try {
      await cancelAppointment(id);
      await this.cargarDatos();
      alert('Cita cancelada correctamente');
    } catch (error) {
      console.error('Error al cancelar la cita:', error);
    }
  }
}

};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
}
.card {
  border-radius: 12px;
}
.btn-outline-primary {
  border-color: #007bff;
  color: #007bff;
}
.btn-outline-primary:hover {
  background-color: #007bff;
  color: white;
}
.active {
  background-color: #007bff !important;
  color: white !important;
}
</style>
