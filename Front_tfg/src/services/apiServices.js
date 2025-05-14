// src/services/apiService.js
import axios from "axios";

// Configuración base de Axios
const API_URL = "http://localhost:5000/api"; // Cambia esto si usas otro puerto

// --------- Servicios ---------
export const fetchServicios = () => axios.get(`${API_URL}/services`, { withCredentials: true });
export const createServicio = (data) => axios.post(`${API_URL}/services`, data, { withCredentials: true });
export const deleteServicio = (id) => axios.delete(`${API_URL}/services/${id}`, { withCredentials: true });
export const fetchServicioDetalle = (id) => axios.get(`${API_URL}/services/${id}`, { withCredentials: true });

// --------- Productos (Tienda) ---------
export const fetchProductos = () => axios.get(`${API_URL}/products`);
export const createProducto = (data) => axios.post(`${API_URL}/products`, data);
export const deleteProducto = (id) => axios.delete(`${API_URL}/products/${id}`);
export const fetchProductoPorId = (id) => {
    return axios.get(`${API_URL}/products/${id}`);
  };
// --------- Citas ---------
export const fetchCitas = () => axios.get(`${API_URL}/appointments`);
export const createCita = (data) => axios.post(`${API_URL}/appointments`, data);
export const deleteCita = (id) => axios.delete(`${API_URL}/appointments/${id}`);

const getAuthHeader = () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  };


  export const fetchCarrito = () => axios.get(`${API_URL}/carts`, {
    headers: getAuthHeader(),
    withCredentials: true,
  });
  
  export const addToCarrito = (product_id, cantidad = 1) => {
    return axios.post(
      `${API_URL}/carts/add`,
      { product_id, cantidad },
      {
        headers: getAuthHeader(),
        withCredentials: true,
      }
    );
  };
  
  export const clearCarrito = () => axios.delete(`${API_URL}/carts/clear`, {
    headers: getAuthHeader(),
    withCredentials: true,
  });


  export const finalizarCompra = () => {
    return axios.post(
      `${API_URL}/carts/finalizar-compra`, 
      {},  // Si no necesitas enviar nada, el cuerpo puede ser vacío.
      {
        headers: getAuthHeader(),
        withCredentials: true,  // Si necesitas manejar cookies
      }
    );
  };
  
  