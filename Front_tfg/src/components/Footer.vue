<template>
  <footer class="custom-footer text-white py-3 mt-5">
    <div class="container text-center">
      <p>&copy; 2025 Peluquería Ainhoa - Todos los derechos reservados</p>
      <nav>
        <router-link to="/" class="text-white mx-2">Inicio</router-link>
        <router-link to="/tienda" class="text-white mx-2">Tienda</router-link>
        <router-link to="/servicios" class="text-white mx-2">Servicios</router-link>
        <router-link to="/citas" class="text-white mx-2">Citas</router-link>
      </nav>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.custom-footer {
  background-color: #01126C; /* Fondo del footer */
  color: white; /* Texto blanco */
}

.custom-footer a {
  text-decoration: none; /* Quitar subrayado a los enlaces */
}

.custom-footer a:hover {
  text-decoration: underline; /* Subrayado al pasar el mouse */
}
</style>
