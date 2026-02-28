import axios, { AxiosResponse } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials: any) => api.post("/auth/login", credentials),
  register: (userData: any) => api.post("/auth/register", userData),
  getMe: () => api.get("/auth/me"),
};

export const productAPI = {
  getProducts: (params?: any) => api.get("/products", { params }),
  getProductById: (id: string) => api.get(`/products/${id}`),
  createProduct: (data: any) => api.post("/products", data),
  updateProduct: (id: string, data: any) => api.put(`/products/${id}`, data),
  deleteProduct: (id: string) => api.delete(`/products/${id}`),
  getFeaturedProducts: () => api.get("/products/featured"),
  getProductsByCategory: (categoryId: string) => api.get(`/products/category/${categoryId}`),
};

export const categoryAPI = {
  getCategories: () => api.get("/categories"),
  getCategoryById: (id: string) => api.get(`/categories/${id}`),
  createCategory: (data: any) => api.post("/categories", data),
  updateCategory: (id: string, data: any) => api.put(`/categories/${id}`, data),
  deleteCategory: (id: string) => api.delete(`/categories/${id}`),
};

export const orderAPI = {
  createOrder: (data: any) => api.post("/orders", data),
  getOrderById: (id: string) => api.get(`/orders/${id}`),
  getMyOrders: () => api.get("/orders/myorders"),
  getOrders: () => api.get("/orders"),
  updateOrderToPaid: (id: string, data: any) => api.put(`/orders/${id}/pay`, data),
  updateOrderToDelivered: (id: string) => api.put(`/orders/${id}/deliver`),
  updateOrderStatus: (id: string, status: string) => api.put(`/orders/${id}/status`, { status }),
};

export const userAPI = {
  getUsers: () => api.get("/users"),
  getUserById: (id: string) => api.get(`/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

export default api;