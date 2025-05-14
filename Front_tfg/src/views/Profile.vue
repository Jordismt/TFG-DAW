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

export default {
  name: 'Profile',
  components: {
    Header,
    Footer,
  },
  data() {
    return {
      user: null,
      loading: true,
    };
  },
  created() {
    this.loadUser();
  },
  methods: {
    async loadUser() {
      const token = localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await axios.get('http://localhost:5000/api/users/profile', {
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
