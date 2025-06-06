<template>
  <div>
    <Header :title="'Citas'" />

    <div class="container my-5">
      <h2 class="text-center mb-5">Gestiona tus citas</h2>

      <!-- FORMULARIO AGENDAR NUEVA CITA -->
      <div class="card mb-5 p-4 shadow">
        <div class="card-body">
          <h5 class="card-title mb-4">Agendar Nueva Cita</h5>
          <form @submit.prevent="crearCita">
            <div class="mb-4">
              <label class="form-label">Servicio:</label>
              <select v-model="form.service_id" class="form-select" @change="cargarHorarios" required>
                <option value="" disabled>Selecciona un servicio</option>
                <option v-for="servicio in servicios" :key="servicio._id" :value="servicio._id">
                  {{ servicio.nombre }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="form-label">Fecha:</label>
              <input v-model="form.fecha" type="date" class="form-control" @change="cargarHorarios" required />
            </div>

            <div class="mb-4" v-if="horariosDisponibles.length > 0">
              <label class="form-label">Hora:</label>
              <div class="d-flex flex-wrap gap-3">
                <button
                  v-for="hora in horariosDisponibles"
                  :key="hora"
                  class="btn"
                  :class="{
                    'btn-outline-primary': form.hora !== hora,
                    'btn-primary': form.hora === hora
                  }"
                  @click.prevent="seleccionarHora(hora)"
                >
                  {{ hora }}
                </button>
              </div>
            </div>

            <button type="submit" class="btn btn-primary mt-4">Agendar Cita</button>
          </form>
        </div>
      </div>

      <!-- LISTADO DE CITAS -->
      <div class="card p-4 shadow">
        <h5 class="card-title mb-4">Tus Citas Agendadas</h5>
        <ul class="list-group">
          <li
            class="list-group-item d-flex justify-content-between align-items-center"
            v-for="cita in citas"
            :key="cita._id"
          >
            <div>
              <strong>{{ cita.service_id.nombre }}</strong> -
              {{ new Date(cita.fecha).toLocaleString('es-ES', { timeZone: 'Europe/Madrid' }) }}
            </div>
            <div class="btn-group">
              <button class="btn btn-warning btn-sm" @click="abrirEdicion(cita)">Editar</button>
              <button class="btn btn-danger btn-sm" @click="cancelarCita(cita._id)">Cancelar</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- MODAL DE EDICIÓN -->
      <div v-if="citaAEditar" class="card mt-5 p-4 shadow">
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
</template>

<script>
import Header from '@/components/Header.vue';
import {
  fetchUserAppointments,
  createAppointment,
  fetchServices,
  fetchAvailableSlots,
  cancelAppointment,
  updateAppointment,
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
        hora: '',
      },
      citaAEditar: null,
      editForm: {
        service_id: '',
        fecha: '',
        hora: '',
      },
      horariosEdicion: [],
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
          fetchServices(),
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
          const response = await fetchAvailableSlots(this.form.service_id, this.form.fecha);
          this.horariosDisponibles = response.data.map((slot) => {
            const fechaSlot = new Date(slot);
            return fechaSlot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          });
        } catch (error) {
          console.error('Error al cargar horarios:', error);
          this.horariosDisponibles = [];
        }
      } else {
        this.horariosDisponibles = [];
      }
    },
    seleccionarHora(hora) {
      this.form.hora = hora;
    },
    async crearCita() {
      if (!this.form.hora) {
        alert('Selecciona una hora para la cita.');
        return;
      }

      try {
        await createAppointment(this.form.service_id, `${this.form.fecha}T${this.form.hora}:00`);
        alert('Cita agendada correctamente');
        this.form = { service_id: '', fecha: '', hora: '' };
        this.horariosDisponibles = [];
        await this.cargarDatos();
      } catch (error) {
        console.error('Error al crear la cita:', error);
        alert(error.response?.data?.msg || 'Error al crear la cita');
      }
    },
    async cancelarCita(id) {
      if (!confirm('¿Seguro que quieres cancelar esta cita?')) return;
      try {
        await cancelAppointment(id);
        alert('Cita cancelada correctamente');
        await this.cargarDatos();
      } catch (error) {
        console.error('Error al cancelar la cita:', error);
        alert('Error al cancelar la cita');
      }
    },
    abrirEdicion(cita) {
      this.citaAEditar = cita;
      this.editForm.service_id = cita.service_id._id;
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

          // Permitir seleccionar también la hora actual de la cita aunque esté ocupada
          if (this.citaAEditar) {
            const horaActual = new Date(this.citaAEditar.fecha).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (!this.horariosEdicion.includes(horaActual)) {
              this.horariosEdicion.push(horaActual);
              this.horariosEdicion.sort();
            }
          }
        } catch (error) {
          console.error('Error al cargar horarios de edición:', error);
          this.horariosEdicion = [];
        }
      } else {
        this.horariosEdicion = [];
      }
    },
    seleccionarHoraEdicion(hora) {
      this.editForm.hora = hora;
    },
    async guardarEdicion() {
      if (!this.editForm.hora) {
        alert('Selecciona una hora para la cita.');
        return;
      }
      try {
        const fechaHora = `${this.editForm.fecha}T${this.editForm.hora}:00`;
        await updateAppointment(this.citaAEditar._id, {
          service_id: this.editForm.service_id,
          fecha: fechaHora,
        });

        alert('Cita actualizada correctamente');
        this.cerrarEdicion();
        await this.cargarDatos();
      } catch (error) {
        console.error('Error al guardar los cambios:', error);
        alert(error.response?.data?.msg || 'Error al actualizar la cita');
      }
    },
  },
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
.btn-primary {
  background-color: #007bff;
  color: white;
}
.active {
  background-color: #007bff !important;
  color: white !important;
}
</style>
