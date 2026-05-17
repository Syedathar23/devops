import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Send cookies if the backend requires them
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to attach JWT token if stored locally
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // e.g., session expired -> clear storage and redirect
      localStorage.removeItem('token');
      // window.location.href = '/auth'; 
    }
    return Promise.reject(error);
  }
);

export const productApi = {
  getAll: () => api.get('/products/fetchallproducts'),
  getById: (id) => api.get(`/products/fetchSingleProd/${id}`),
  search: (params) => api.get('/products/fetchallproducts', { params }) // Backend may need query params handling
};

export const authApi = {
  login: (data) => api.post('/users/login', data),
  register: (data) => api.post('/users/register', data),
  logout: () => api.post('/users/logout')
};

export const cartApi = {
  getCart: () => api.get('/cart'),
  addToCart: (data) => api.post('/cart', data),
  updateItem: (id, data) => api.put(`/cart/${id}`, data),
  removeItem: (id) => api.delete(`/cart/${id}`),
  clearCart: () => api.delete('/cart')
};

export const orderApi = {
  createOrder: (data) => api.post('/orders', data),
  getUserOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`)
};

export const addressApi = {
  getAddresses: () => api.get('/user/addresses'),
  addAddress: (data) => api.post('/user/addresses', data),
  updateAddress: (id, data) => api.put(`/user/addresses/${id}`, data),
  deleteAddress: (id) => api.delete(`/user/addresses/${id}`),
  setDefault: (id) => api.patch(`/user/addresses/${id}/default`),
};

export default api;
