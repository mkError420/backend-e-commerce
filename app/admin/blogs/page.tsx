'use client'

import React, { useEffect, useState } from 'react'

// Sample blog data
const sampleBlogs = [
  {
    id: 1,
    title: 'Top 10 Gadgets for 2024',
    slug: 'top-10-gadgets-2024',
    excerpt: 'Discover the most innovative gadgets that will revolutionize your daily life...',
    content: 'Full content about top gadgets...',
    author: 'John Doe',
    category: 'Technology',
    tags: ['gadgets', 'tech', '2024'],
    status: 'published',
    views: 1250,
    likes: 45,
    comments: 12,
    publishedAt: '2024-02-20',
    image: '/images/blogs/gadgets-2024.jpg'
  },
  {
    id: 2,
    title: 'Fashion Trends for Spring',
    slug: 'fashion-trends-spring',
    excerpt: 'Get ready for the latest fashion trends that will dominate this spring...',
    content: 'Full content about fashion trends...',
    author: 'Jane Smith',
    category: 'Fashion',
    tags: ['fashion', 'trends', 'spring'],
    status: 'published',
    views: 890,
    likes: 32,
    comments: 8,
    publishedAt: '2024-02-18',
    image: '/images/blogs/fashion-spring.jpg'
  },
  {
    id: 3,
    title: 'Health Tips for Busy Professionals',
    slug: 'health-tips-busy-professionals',
    excerpt: 'Simple and effective health tips for maintaining wellness in a busy schedule...',
    content: 'Full content about health tips...',
    author: 'Dr. Sarah Johnson',
    category: 'Health',
    tags: ['health', 'wellness', 'professional'],
    status: 'draft',
    views: 0,
    likes: 0,
    comments: 0,
    publishedAt: null,
    image: '/images/blogs/health-tips.jpg'
  },
  {
    id: 4,
    title: 'Gaming Setup Guide',
    slug: 'gaming-setup-guide',
    excerpt: 'Complete guide to setting up the perfect gaming station for maximum performance...',
    content: 'Full content about gaming setup...',
    author: 'Mike Wilson',
    category: 'Gaming',
    tags: ['gaming', 'setup', 'equipment'],
    status: 'published',
    views: 2100,
    likes: 78,
    comments: 23,
    publishedAt: '2024-02-15',
    image: '/images/blogs/gaming-setup.jpg'
  },
  {
    id: 5,
    title: 'Home Organization Hacks',
    slug: 'home-organization-hacks',
    excerpt: 'Smart and creative ways to organize your home for maximum efficiency...',
    content: 'Full content about home organization...',
    author: 'Emily Brown',
    category: 'Home',
    tags: ['home', 'organization', 'hacks'],
    status: 'published',
    views: 1560,
    likes: 56,
    comments: 18,
    publishedAt: '2024-02-12',
    image: '/images/blogs/home-organization.jpg'
  }
]

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState(sampleBlogs)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingBlog, setEditingBlog] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    author: '',
    category: 'Technology',
    tags: '',
    status: 'draft',
    image: ''
  })

  const statusColors = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-800'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingBlog) {
      // Update existing blog
      setBlogs(blogs.map(blog => 
        blog.id === editingBlog.id 
          ? { 
              ...blog, 
              ...formData,
              tags: formData.tags.split(',').map(tag => tag.trim()),
              publishedAt: formData.status === 'published' && !blog.publishedAt 
                ? new Date().toISOString().split('T')[0] 
                : blog.publishedAt
            }
          : blog
      ))
    } else {
      // Add new blog
      const newBlog = {
        id: Math.max(...blogs.map(b => b.id)) + 1,
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        views: 0,
        likes: 0,
        comments: 0,
        publishedAt: formData.status === 'published' ? new Date().toISOString().split('T')[0] : null
      }
      setBlogs([...blogs, newBlog])
    }
    
    // Reset form
    setFormData({
      title: '', slug: '', excerpt: '', content: '', 
      author: '', category: 'Technology', tags: '', status: 'draft', image: ''
    })
    setEditingBlog(null)
    setShowAddForm(false)
  }

  const handleEdit = (blog: any) => {
    setEditingBlog(blog)
    setFormData({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt,
      content: blog.content,
      author: blog.author,
      category: blog.category,
      tags: blog.tags.join(', '),
      status: blog.status,
      image: blog.image
    })
    setShowAddForm(true)
  }

  const handleDelete = (blogId: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(blog => blog.id !== blogId))
    }
  }

  const handleCancel = () => {
    setFormData({
      title: '', slug: '', excerpt: '', content: '', 
      author: '', category: 'Technology', tags: '', status: 'draft', image: ''
    })
    setEditingBlog(null)
    setShowAddForm(false)
  }

  const filteredBlogs = filter === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.status === filter)

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Blogs</h1>
        <div className="flex gap-2">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Posts</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-shop_dark_green text-white rounded hover:bg-shop_dark_green"
          >
            Add New Post
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows={2}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={6}
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Author</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="Technology">Technology</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Health">Health</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Home">Home</option>
                  <option value="Sports">Sports</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                className="w-full border rounded px-3 py-2"
                placeholder="tech, gadgets, 2024"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                className="w-full border rounded px-3 py-2"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-shop_dark_green text-white rounded hover:bg-shop_dark_green"
              >
                {editingBlog ? 'Update' : 'Create'} Post
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBlogs.map((blog) => (
              <tr key={blog.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                    <div className="text-sm text-gray-500">{blog.excerpt}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {blog.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {blog.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[blog.status as keyof typeof statusColors]}`}>
                    {blog.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex gap-4">
                    <span>👁 {blog.views}</span>
                    <span>❤️ {blog.likes}</span>
                    <span>💬 {blog.comments}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(blog)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(blog.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Posts</h3>
          <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Published</h3>
          <p className="text-2xl font-bold text-green-600">
            {blogs.filter(b => b.status === 'published').length}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Views</h3>
          <p className="text-2xl font-bold text-blue-600">
            {blogs.reduce((sum, b) => sum + b.views, 0)}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Engagement</h3>
          <p className="text-2xl font-bold text-purple-600">
            {blogs.reduce((sum, b) => sum + b.likes + b.comments, 0)}
          </p>
        </div>
      </div>
    </div>
  )
}
