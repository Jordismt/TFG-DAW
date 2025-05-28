<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <button class="close-button" @click="$emit('close')">✖</button>
      
      <h3>{{ isLogin ? "Iniciar Sesión" : "Registrarse" }}</h3>

      <!-- Formulario de inicio de sesión -->
      <form v-if="isLogin" @submit.prevent="login">
        <div class="form-group">
          <input v-model="email" type="email" placeholder="Correo electrónico" required />
        </div>
        <div class="form-group">
          <input v-model="password" type="password" placeholder="Contraseña" required />
        </div>
        <button type="submit">Entrar</button>
      </form>

      <!-- Formulario de registro -->
      <form v-else @submit.prevent="register">
        <div class="form-group">
          <input v-model="nombre" type="text" placeholder="Nombre completo" required />
        </div>
        <div class="form-group">
          <input v-model="email" type="email" placeholder="Correo electrónico" required />
        </div>
        <div class="form-group">
          <input v-model="password" type="password" placeholder="Contraseña" required />
        </div>

        <button type="submit">Crear Cuenta</button>
      </form>

      <button @click="toggleForm">
        {{ isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión" }}
      </button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const API_BASE_URL = "https://tfg-daw-api-tfg.onrender.com"; // 💡 URL correcta

export default {
  data() {
    return {
      isLogin: true,
      email: '',
      password: '',
      nombre: '',
      role: 'user',
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: this.email,
          password: this.password,
        });

        alert('Inicio de sesión exitoso');
        localStorage.setItem('userToken', response.data.token);
        this.$emit('close');
        this.$emit('loginSuccess');

      } catch (error) {
        alert(error.response.data.msg || 'Error al iniciar sesión');
      }
    },

    async register() {
      try {
        const response = await axios.post(`${API_BASE_URL}/api/auth/register`, {
          nombre: this.nombre,
          email: this.email,
          password: this.password,
          role: this.role,
        });
        alert(response.data.msg || 'Cuenta creada con éxito');
        this.isLogin = true;
      } catch (error) {
        alert(error.response.data.msg || 'Error al registrar');
      }
    },

    toggleForm() {
      this.isLogin = !this.isLogin;
      this.email = '';
      this.password = '';
      this.nombre = '';
      this.role = 'user';
    },
  },
};
</script>


<style scoped>
/* Estilos para el modal y el formulario */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Fondo oscuro */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Asegura que el modal esté encima de otros elementos */
}

.modal-content {
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  position: relative;
  z-index: 1001;
  transition: transform 0.3s ease;
}

button.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  color: #01126C; /* Color acorde con la web */
}

h3 {
  color: #01126C;
  margin-bottom: 20px;
  font-size: 24px;
  font-weight: 600;
}

button {
  padding: 12px 20px;
  background-color: #01126C; /* Azul acorde con la web */
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #003366; /* Un tono más oscuro de azul para hover */
}

button[type="submit"] {
  width: 100%;
}

button[type="submit"]:hover {
  background-color: #003366;
}

.form-group {
  margin-bottom: 20px;
}

input {
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
}

input:focus {
  border-color: #01126C;
  outline: none;
}

button:hover {
  background-color: #003366; /* Cambio en el color de fondo del botón al hacer hover */
}

button[type="button"] {
  background-color: transparent;
  color: #01126C;
  text-decoration: underline;
  border: none;
  font-size: 14px;
}

button[type="button"]:hover {
  background-color: transparent;
  color: #003366;
}

</style>
