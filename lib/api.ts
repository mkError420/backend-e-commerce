const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    
    // Load token from localStorage on client side
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('[API] Request:', options.method || 'GET', url, config.body ? config.body.toString() : '');
      const response = await fetch(url, config);
      
      // Check if response is HTML (error page) instead of JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('Server returned HTML instead of JSON - check API endpoint');
      }
      
      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: `HTTP error! status: ${response.status}` };
        }
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('[API] request failed:', error);
      if (error instanceof Error) {
        console.error('[API] error message', error.message);
      }
      
      // Handle network errors specifically
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Network error - unable to connect to server. Please check your connection.');
      }
      
      throw error;
    }
  }

  // Auth methods
  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }) {
    const response = await this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return this.request<any>('/auth/me');
  }

  async updateProfile(userData: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  }) {
    return this.request<any>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async changePassword(currentPassword: string, newPassword: string) {
    return this.request<any>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  }

  // Product endpoints
  async getProducts(params: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    featured?: boolean;
    onSale?: boolean;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return this.request<any>(`/products${queryString ? `?${queryString}` : ''}`);
  }

  async getProduct(id: string) {
    return this.request<any>(`/products/${id}`);
  }

  async createProduct(productData: any) {
    return this.request<any>('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }

  async updateProduct(id: string, productData: any) {
    return this.request<any>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  }

  async deleteProduct(id: string) {
    return this.request<any>(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  async getFeaturedProducts() {
    return this.request<any>('/products/featured/list');
  }

  async addProductReview(productId: string, rating: number, comment: string) {
    return this.request<any>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify({ rating, comment }),
    });
  }

  // Category endpoints
  async getCategories() {
    return this.request<any>('/categories');
  }

  async getFlatCategories() {
    return this.request<any>('/categories/flat');
  }

  async getCategory(id: string) {
    return this.request<any>(`/categories/${id}`);
  }

  async getCategoryBySlug(slug: string) {
    return this.request<any>(`/categories/slug/${slug}`);
  }

  async createCategory(categoryData: any) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id: string, categoryData: any) {
    return this.request<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: string) {
    return this.request<any>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Order endpoints
  async createOrder(orderData: {
    items: Array<{
      product: string;
      quantity: number;
    }>;
    shippingAddress: any;
    paymentMethod: string;
    notes?: string;
  }) {
    return this.request<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(params: {
    page?: number;
    limit?: number;
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return this.request<any>(`/orders${queryString ? `?${queryString}` : ''}`);
  }

  async getMyOrders() {
    return this.request<any>('/orders/my-orders');
  }

  async getOrder(id: string) {
    return this.request<any>(`/orders/${id}`);
  }

  async updateOrderStatus(id: string, status: string, note?: string) {
    return this.request<any>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, note }),
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: string, transactionId?: string, method?: string) {
    return this.request<any>(`/orders/${id}/payment`, {
      method: 'PUT',
      body: JSON.stringify({ paymentStatus, transactionId, method }),
    });
  }

  async cancelOrder(id: string) {
    return this.request<any>(`/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // User endpoints (Admin)
  async getUsers(params: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    isActive?: boolean;
  } = {}) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return this.request<any>(`/users${queryString ? `?${queryString}` : ''}`);
  }

  async getUser(id: string) {
    return this.request<any>(`/users/${id}`);
  }

  async updateUser(id: string, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  // Upload endpoints
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    return this.request<any>('/upload/image', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async uploadImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    return this.request<any>('/upload/images', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async uploadProductImages(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    return this.request<any>('/upload/product-images', {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    });
  }

  async deleteImage(publicId: string) {
    return this.request<any>(`/upload/${publicId}`, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
