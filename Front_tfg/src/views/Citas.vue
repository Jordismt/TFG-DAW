<!-- Citas.vue -->
<template>
  <div>
    <!-- Header con título dinámico -->
    <Header :title="'Citas'"/>

    <!-- CONTENIDO DE LA PÁGINA -->
    <div class="container my-5">
      <h2 class="text-center mb-5">Gestiona tus citas</h2>
      <!-- Aquí tu contenido específico para las citas -->
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';

export default {
  name: 'Citas',
  components: {
    Header
  },
  created() {
    console.log('Componente Citas cargado');
  }
}
</script>