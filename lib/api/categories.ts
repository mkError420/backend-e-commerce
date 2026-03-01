// Categories API for frontend
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug?: string;
  productCount?: number;
  createdAt?: string;
  subcategories?: Category[];
}

export interface ShopCategory {
  id: string;
  name: string;
  count: number;
  subcategories: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

export const categoryAPI = {
  // Get all categories from backend
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch('http://localhost:5000/api/categories');
      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch categories');
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Transform backend categories to shop format
  transformToShopFormat: (apiCategories: Category[]): ShopCategory[] => {
    return apiCategories.map(cat => ({
      id: cat._id,
      name: cat.name,
      count: cat.productCount || 0, // Use real product count from API
      subcategories: cat.subcategories?.map(sub => ({
        id: sub._id, // Subcategories should have _id from MongoDB
        name: sub.name,
        count: sub.productCount || 0
      })) || []
    }));
  },

  // Transform backend categories to categories page format
  transformToCategoriesPageFormat: (apiCategories: Category[]): any[] => {
    return apiCategories.map(cat => ({
      _id: cat._id,
      name: cat.name,
      description: cat.description,
      image: cat.image,
      slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-'),
      productCount: cat.productCount || 0
    }));
  }
};
