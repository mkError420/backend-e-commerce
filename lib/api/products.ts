const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface Product {
  _id: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  regularPrice?: number;
  category: string | { _id: string; name: string };
  images: string[];
  stock: number;
  featured: boolean;
  rating: number;
  numReviews: number;
  createdAt: string;
  originalPrice?: number;
  reviews?: number;
  badge?: string;
}

export interface ProductsResponse {
  products: Product[];
  page: number;
  pages: number;
}

class ProductAPI {
  private getAuthHeaders() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async getProducts(params: {
    page?: number;
    keyword?: string;
    category?: string;
    featured?: boolean;
  } = {}): Promise<ProductsResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page) searchParams.append('pageNumber', params.page.toString());
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.featured) searchParams.append('featured', 'true');

    const url = params.category 
      ? `${API_BASE_URL}/products/category/${params.category}?${searchParams}`
      : `${API_BASE_URL}/products?${searchParams}`;

    const response = await fetch(url, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }

    return response.json();
  }

  async getProductById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }

    return response.json();
  }

  async getFeaturedProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/featured`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }

    return response.json();
  }

  async getProductsByCategory(categoryId: string): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products/category/${categoryId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch products by category');
    }

    return response.json();
  }

  async createProduct(productData: Omit<Product, '_id' | 'createdAt' | 'rating' | 'numReviews'>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to create product');
    }

    return response.json();
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(productData),
    });

    if (!response.ok) {
      throw new Error('Failed to update product');
    }

    return response.json();
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete product');
    }

    return response.json();
  }
}

export const productAPI = new ProductAPI();
