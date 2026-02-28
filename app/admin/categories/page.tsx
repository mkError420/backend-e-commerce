"use client";

import { useState, useEffect } from "react";
import CategoryForm from "@/components/admin/CategoryForm";
import CategoryList from "@/components/admin/CategoryList";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
}

const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchCategories = async () => {
    try {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch("http://localhost:5000/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to fetch categories");
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        setError("Request timeout - please try again");
      } else {
        console.error("Error fetching categories:", error);
        setError("Network error: " + (error.message || "Unknown error"));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add retry mechanism for failed requests
  const retryFetch = () => {
    setLoading(true);
    setError("");
    fetchCategories();
  };

  const handleCreateCategory = async (categoryData: Omit<Category, "_id">) => {
    try {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch("http://localhost:5000/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const newCategory = await response.json();
        setCategories([...categories, newCategory]);
        setIsFormOpen(false);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to create category");
      }
    } catch (error: any) {
      console.error("Error creating category:", error);
      setError("Network error: " + (error.message || "Unknown error"));
    }
  };

  const handleUpdateCategory = async (id: string, categoryData: Partial<Category>) => {
    try {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories(categories.map(cat => 
          cat._id === id ? updatedCategory : cat
        ));
        setEditingCategory(null);
        setIsFormOpen(false);
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to update category");
      }
    } catch (error: any) {
      console.error("Error updating category:", error);
      setError("Network error: " + (error.message || "Unknown error"));
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      if (typeof window === "undefined") return;
      
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication required");
        return;
      }

      const response = await fetch(`http://localhost:5000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setCategories(categories.filter(cat => cat._id !== id));
        setError("");
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Failed to delete category");
      }
    } catch (error: any) {
      console.error("Error deleting category:", error);
      setError("Network error: " + (error.message || "Unknown error"));
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleAddNew = () => {
    setEditingCategory(null);
    setIsFormOpen(true);
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setIsFormOpen(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 text-sm">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
        <button
          onClick={handleAddNew}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Category
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={retryFetch}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {isFormOpen && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingCategory ? "Edit Category" : "Add New Category"}
          </h2>
          <CategoryForm
            category={editingCategory}
            onSubmit={editingCategory 
              ? (data: Omit<Category, "_id">) => handleUpdateCategory(editingCategory._id, data)
              : handleCreateCategory
            }
            onCancel={handleCancel}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md">
        <CategoryList
          categories={categories}
          onEdit={handleEdit}
          onDelete={handleDeleteCategory}
        />
      </div>
    </div>
  );
};

export default AdminCategoriesPage;
