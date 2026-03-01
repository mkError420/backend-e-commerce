"use client";

import React, { useState, useEffect } from "react";

interface Category {
  _id?: string;
  name: string;
  description: string;
  image: string;
  subcategories?: Array<{
    name: string;
    slug: string;
    description: string;
    image?: string;
  }>;
}

interface CategoryFormProps {
  category?: Category | null;
  categories?: Category[];
  onSubmit: (data: Omit<Category, "_id">) => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, categories = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    image: string;
    subcategories: Array<{
      name: string;
      slug: string;
      description: string;
    }>;
  }>({
    name: "",
    description: "",
    image: "",
    subcategories: []
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });
  const [newSubcategory, setNewSubcategory] = useState({
    name: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        description: category.description,
        image: category.image,
        subcategories: category.subcategories || []
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSubcategory(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addSubcategory = () => {
    if (newSubcategory.name.trim()) {
      const slug = newSubcategory.name.toLowerCase().replace(/\s+/g, '-');
      console.log('Adding subcategory:', newSubcategory.name);
      console.log('Current subcategories before adding:', formData.subcategories);
      
      setFormData(prev => {
        const updated = {
          ...prev,
          subcategories: [...prev.subcategories, { ...newSubcategory, slug }]
        };
        console.log('Updated subcategories:', updated.subcategories);
        return updated;
      });
      
      setNewSubcategory({ name: "", description: "", image: "" });
    }
  };

  const removeSubcategory = (index: number) => {
    setFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {
      name: "",
      description: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.description;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Debug: Log the form data being submitted
      console.log('=== FORM SUBMISSION DEBUG ===');
      console.log('Form data being submitted:', JSON.stringify(formData, null, 2));
      console.log('Subcategories:', formData.subcategories);
      console.log('Subcategories length:', formData.subcategories.length);
      console.log('Subcategories type:', typeof formData.subcategories);
      console.log('Is subcategories array:', Array.isArray(formData.subcategories));
      
      if (formData.subcategories.length > 0) {
        console.log('Subcategories details:');
        formData.subcategories.forEach((sub, index) => {
          console.log(`  Subcategory ${index + 1}:`, sub);
        });
      }
      
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Category Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter category name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter category description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter image URL (optional)"
        />
      </div>

      {/* Subcategories Section */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Subcategories</h3>
        
        {/* Existing Subcategories */}
        {formData.subcategories.length > 0 && (
          <div className="space-y-2 mb-4">
            {formData.subcategories.map((subcategory, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{subcategory.name}</p>
                  <p className="text-sm text-gray-600">{subcategory.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeSubcategory(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Subcategory */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Subcategory</h4>
          <div className="space-y-3">
            <div>
              <input
                type="text"
                name="name"
                value={newSubcategory.name}
                onChange={handleSubcategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subcategory name"
              />
            </div>
            <div>
              <textarea
                name="description"
                value={newSubcategory.description}
                onChange={handleSubcategoryChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subcategory description"
              />
            </div>
            <div>
              <input
                type="text"
                name="image"
                value={newSubcategory.image}
                onChange={handleSubcategoryChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subcategory image URL (optional)"
              />
            </div>
            <button
              type="button"
              onClick={addSubcategory}
              disabled={!newSubcategory.name.trim()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Add Subcategory
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {category ? "Update Category" : "Create Category"}
        </button>
      </div>
    </form>
  );
};

export default React.memo(CategoryForm);
