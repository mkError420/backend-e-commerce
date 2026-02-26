import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const queryString = url.searchParams.toString();
    
    // Connect to backend or return sample data
    const fullUrl = `${BACKEND_URL}/api/blog${queryString ? '?' + queryString : ''}`;
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      },
      cache: 'no-store'
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // For file uploads (FormData), we need to forward the body directly
    const formData = await request.formData();
    
    const fullUrl = `${BACKEND_URL}/api/blog`;
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        // Don't set Content-Type for FormData, fetch will set it with boundary
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      },
      body: formData
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create blog post', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const formData = await request.formData();
    
    const fullUrl = `${BACKEND_URL}/api/blog/${id}`;
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      },
      body: formData
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update blog post', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    const fullUrl = `${BACKEND_URL}/api/blog/${id}`;
    
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      }
    });
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete blog post', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
