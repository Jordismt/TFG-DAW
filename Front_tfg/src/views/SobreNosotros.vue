<template>
  <div>
    <Header :title="'Sobre Nosotros'" />

    <main class="container my-5">
      <section class="hero bg-primary text-white text-center py-5 mb-5">
        <h1 class="display-4">Conoce Nuestra Historia</h1>
        <p class="lead">Más de 10 años cuidando de tu belleza y bienestar.</p>
      </section>

      <section class="row mb-5">
        <div class="col-md-6">
          <img src="@/assets/sobre-nos-img.jpg" alt="Peluquería" class="img-fluid rounded shadow" />
        </div>
        <div class="col-md-6 d-flex align-items-center">
          <div>
            <h2>Nuestra Historia</h2>
            <p>
              Desde nuestros inicios, hemos trabajado con pasión y dedicación para ofrecer los mejores servicios de peluquería y estética.
              Nuestra misión es realzar tu belleza y brindarte una experiencia única en cada visita.
            </p>
            <p>
              Gracias a un equipo de profesionales cualificados, logramos satisfacer a nuestros clientes, cuidando cada detalle y usando productos
              de alta calidad.
            </p>
          </div>
        </div>
      </section>

      <section class="bg-light p-5 rounded shadow mb-5">
        <h2 class="text-center mb-4">Nuestros Valores</h2>
        <div class="row text-center">
          <div class="col-md-4">
            <h5>Profesionalidad</h5>
            <p>Contamos con un equipo de expertos en constante formación.</p>
          </div>
          <div class="col-md-4">
            <h5>Calidad</h5>
            <p>Trabajamos con los mejores productos para el cuidado de tu cabello y piel.</p>
          </div>
          <div class="col-md-4">
            <h5>Compromiso</h5>
            <p>Nos dedicamos a ofrecerte siempre el mejor servicio.</p>
          </div>
        </div>
      </section>

      <div class="text-center">
        <router-link to="/contacto" class="btn btn-primary">Contáctanos</router-link>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'SobreNosotros',
  components: {
    Header,
    Footer
  }
};
</script>

<style scoped>
.hero {
  background-color: #01126C;
  color: #FFFFFF;
}

.bg-primary {
  background-color: #01126C !important;
}

.btn-primary {
  background-color: #98E4FF;
  color: #01126C;
}

.btn-primary:hover {
  background-color: #86D6FF;
}
</style>
