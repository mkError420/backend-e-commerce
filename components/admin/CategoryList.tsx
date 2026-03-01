"use client";

import React, { useState } from "react";

interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  parent?: string;
  subcategories?: Array<{
    _id: string;
    name: string;
    slug: string;
    description: string;
    image?: string;
    productCount?: number;
  }>;
  productCount?: number;
}

interface CategoryListProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ categories, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Memoize filtered categories to prevent unnecessary re-renders
  const filteredCategories = React.useMemo(() => 
    categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
    ), [categories, searchTerm]
  );

  // Toggle category expansion
  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Helper function to render category row
  const renderCategoryRow = (category: Category, level: number = 0) => {
    const indent = level * 24; // 24px indent per level
    const isSubcategory = level > 0;
    const isExpanded = expandedCategories.has(category._id);
    
    return (
      <React.Fragment key={category._id}>
        <tr className={`hover:bg-gray-50 ${isSubcategory ? 'bg-gray-50' : ''}`}>
          {/* Image Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            </div>
          </td>

          {/* Name Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="flex items-center" style={{ paddingLeft: `${indent}px` }}>
              {isSubcategory && (
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
              <div>
                <div className={`text-sm font-medium ${isSubcategory ? 'text-gray-700' : 'text-gray-900'}`}>
                  {category.name}
                </div>
                {isSubcategory && (
                  <div className="text-xs text-gray-500">Subcategory</div>
                )}
              </div>
            </div>
          </td>

          {/* Description Column */}
          <td className="px-6 py-4">
            <div className="text-sm text-gray-500 max-w-xs truncate">
              {category.description}
            </div>
          </td>

          {/* Products Column */}
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
              {category.productCount || 0}
            </div>
          </td>

          {/* Subcategories Column */}
          <td className="px-6 py-4">
            <div className="text-sm text-gray-900">
              {category.subcategories?.length || 0}
            </div>
          </td>

          {/* Actions Column */}
          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
            <div className="flex space-x-2">
              <button
                onClick={() => onEdit(category)}
                className="text-blue-600 hover:text-blue-900 transition-colors"
                title="Edit category"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(category._id)}
                className="text-red-600 hover:text-red-900 transition-colors"
                title="Delete category"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              {category.subcategories && category.subcategories.length > 0 && (
                <button
                  onClick={() => toggleExpand(category._id)}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                  title={isExpanded ? "Collapse" : "Expand"}
                >
                  {isExpanded ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              )}
            </div>
          </td>
        </tr>
        
        {/* Render subcategories recursively */}
        {isExpanded && category.subcategories && category.subcategories.length > 0 && 
          category.subcategories.map((subcategory: any) => renderCategoryRow({
            ...subcategory,
            image: subcategory.image || ''
          }, level + 1))
        }
      </React.Fragment>
    );
  };

  return (
    <div>
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="overflow-x-auto">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 text-lg mb-2">No categories found</div>
            <p className="text-gray-500 text-sm">
              {searchTerm ? "Try adjusting your search terms" : "Start by adding your first category"}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subcategories
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredCategories.map((category) => renderCategoryRow(category))}
            </tbody>
          </table>
        )}
      </div>

      {/* Summary */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {filteredCategories.length} of {categories.length} categories
        </div>
      </div>
    </div>
  );
};

export default React.memo(CategoryList);
