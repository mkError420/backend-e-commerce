// Categories API for frontend
export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
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
      count: Math.floor(Math.random() * 300) + 50, // Demo count
      subcategories: [] // Can be extended with real subcategories
    }));
  }
};
