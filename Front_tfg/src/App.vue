<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import 'bootstrap-icons/font/bootstrap-icons.css';

export default {
  name: 'App'
}
</script>

<style>
/* Estilo global para la aplicación */
body {
  background-color: #98E4FF !important; /* Fondo azul claro */
  color: #01126C; /* Color de texto oscuro */
  margin: 0; /* Eliminar margen por defecto del body */
  font-family: Arial, sans-serif; /* O cualquier fuente que prefieras */
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
