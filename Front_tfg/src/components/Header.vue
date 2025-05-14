<template>
  <header class="custom-header py-4">
    <div class="container text-center position-relative">
      <h1 class="mb-4 fw-bold">{{ title }}</h1>

      <!-- Contenedor de Iconos (Carrito y Perfil) -->
      <div class="icon-container">
      
        <div class="profile-icon" @click="handleProfileClick">
          <i class="bi bi-person-circle"></i>
        </div>

        <div class="cart-icon" @click="goToCart">
          <i class="bi bi-cart-fill"></i>
          <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
        </div>


      </div>

      <!-- Carrusel -->
      <div id="mainCarousel" class="carousel slide mb-4" data-bs-ride="carousel">
        <div class="carousel-inner rounded">
          <div class="carousel-item active">
            <img src="../assets/corte_pelo.jpeg" class="d-block w-100" alt="Imagen 1">
          </div>
          <div class="carousel-item">
            <img src="../assets/coloracion.png" class="d-block w-100" alt="Imagen 2">
          </div>
          <div class="carousel-item">
            <img src="../assets/ondas.webp" class="d-block w-100" alt="Imagen 3">
          </div>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>

      <!-- Navbar pequeño -->
      <nav class="d-flex justify-content-center gap-4">
        <router-link to="/" class="nav-btn">Inicio</router-link>
        <router-link to="/tienda" class="nav-btn">Tienda</router-link>
        <router-link to="/servicios" class="nav-btn">Servicios</router-link>
        <button @click="handlePedirCita" class="nav-btn">Pedir Cita</button>
      </nav>

      <!-- Modal Login/Registro -->
      <LoginRegisterModal 
        v-if="showModal" 
        @close="showModal = false" 
        @loginSuccess="handleLoginSuccess" 
      />
    </div>
  </header>
</template>


<script>
import LoginRegisterModal from '@/components/LoginRegisterModal.vue';
import { fetchCarrito } from '@/services/apiServices';

export default {
  name: 'Header',
  components: {
    LoginRegisterModal,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      showModal: false,
      redirectTo: null,
      cartItemCount: 0,
    };
  },
  computed: {
    isAuthenticated() {
      return !!localStorage.getItem('userToken');
    },
  },
  methods: {
    async fetchCartItems() {
      if (this.isAuthenticated) {
        try {
          const response = await fetchCarrito();
          this.cartItemCount = response.data.items.reduce((acc, item) => acc + item.cantidad, 0);
        } catch (error) {
          console.error("Error al obtener el carrito:", error);
        }
      }
    },
    handlePedirCita() {
      if (this.isAuthenticated) {
        this.$router.push('/citas');
      } else {
        this.redirectTo = '/citas';
        this.showModal = true;
      }
    },
    handleProfileClick() {
      if (this.isAuthenticated) {
        this.$router.push('/perfil');
      } else {
        this.showModal = true;
      }
    },
    goToCart() {
      this.$router.push('/carrito');
    },
    handleLoginSuccess() {
      this.showModal = false;
      if (this.redirectTo) {
        this.$router.push(this.redirectTo);
        this.redirectTo = null;
      } else {
        this.$router.push('/perfil');
      }
      this.fetchCartItems();
    },
    logout() {
      localStorage.removeItem('userToken');
      this.cartItemCount = 0;
      this.$router.push('/');
    },
  },
  mounted() {
    this.fetchCartItems();
  },
};
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;500;700&display=swap');

.custom-header {
  background-color: #01126C;
  color: white;
  font-family: 'Montserrat', sans-serif;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
}

.icon-container {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 15px;
  z-index: 10;
}

.cart-icon,
.profile-icon {
  color: white;
  font-size: 1.7rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.cart-icon:hover,
.profile-icon:hover {
  transform: scale(1.1);
}

.cart-count {
  background-color: red;
  border-radius: 50%;
  color: white;
  font-size: 0.9rem;
  padding: 2px 5px;
  position: absolute;
  top: -5px;
  right: -10px;
  z-index: 3;
}

.carousel-inner img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  filter: invert(1);
}

.nav-btn {
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 10px 15px;
  background-color: transparent;
  border: 2px solid white;
  border-radius: 5px;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.nav-btn:hover {
  color: #01126C;
  background-color: white;
  transform: scale(1.1);
}
</style>
