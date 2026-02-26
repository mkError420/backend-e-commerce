'use client';

import { useState, useEffect } from 'react';
import AdminHeader from '@/components/Admin/AdminHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Category {
  _id: string;
  name: string;
  parent?: { _id: string; name: string };
  slug: string;
  level?: number;
  isActive?: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories/flat');
      const data = await res.json();
      if (data.success) {
        setCategories(data.categories || data);
      } else {
        console.error('Failed to fetch categories', data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = async () => {
    const name = prompt('Enter category name');
    if (!name) return;
    const parentId = prompt('Enter parent category ID (leave blank for none)');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, parent: parentId || undefined })
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert('Failed to add category: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      alert('Error adding category');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting');
    }
  };

  const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader title="Categories" description="Manage categories" />
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categories</h2>
          <div className="flex gap-2">
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <Button onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-2" /> Add
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(c => (
              <TableRow key={c._id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.parent?.name || '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(c._id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
