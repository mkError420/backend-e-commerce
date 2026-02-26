import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    
    // Connect to backend
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:5000';
    
    // Build query string
    const queryString = searchParams.toString();
    const fullUrl = `${backendUrl}/api/products${queryString ? '?' + queryString : ''}`;
    
    console.log('Fetching products from:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if token exists
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')
        })
      } as HeadersInit
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch products', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Connect to backend
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:5000';
    
    const fullUrl = `${backendUrl}/api/products`;
    
    console.log('Creating product at:', fullUrl);
    console.log('Product data:', body);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if token exists
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')
        })
      } as HeadersInit,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create product', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    const body = await request.json();
    
    // Connect to backend
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:5000';
    
    const fullUrl = `${backendUrl}/api/products/${id}`;
    
    console.log('Updating product at:', fullUrl);
    console.log('Update data:', body);
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if token exists
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')
        })
      } as HeadersInit,
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update product', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();
    
    // Connect to backend
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? 'https://your-production-domain.com' 
      : 'http://localhost:5000';
    
    const fullUrl = `${backendUrl}/api/products/${id}`;
    
    console.log('Deleting product at:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        // Add auth header if token exists
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')
        })
      } as HeadersInit
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('API route error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete product', error: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}
