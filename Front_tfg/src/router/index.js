import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Servicios from '../views/Servicios.vue';
import Tienda from '../views/Tienda.vue';
import Citas from '../views/Citas.vue';
import ServicioDetalle from '../views/servicioDetalle.vue';  
import Profile from '@/views/Profile.vue';
import DetalleProducto from '@/views/DetalleProducto.vue';
import Carrito from '@/views/Carrito.vue';
import SobreNosotros from '@/views/SobreNosotros.vue';

const routes = [
  
  { path: '/', name: 'Home', component: Home },
  { path: '/servicios', name: 'Servicios', component: Servicios },
  { path: '/servicios/:id', name: 'ServicioDetalle', component: ServicioDetalle, props: true },  // Ruta dinámica para los detalles del servicio
  { path: '/tienda', name: 'Tienda', component: Tienda },
  { path: '/carrito', component: Carrito },
  { path: '/sobre-nosotros', component: SobreNosotros },
  { path: '/citas', name: 'Citas', component: Citas },
  {
    path: '/perfil',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true, // Aseguramos que solo los usuarios logueados puedan acceder
    },
  },
  {
    path: '/producto/:id',
    name: 'detalleProducto',
    component: DetalleProducto,
    props: true,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
