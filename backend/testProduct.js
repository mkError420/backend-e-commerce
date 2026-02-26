(async () => {
  try {
    // login first
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@mkshop.com', password: 'admin123' })
    });
    const loginData = await loginRes.json();
    console.log('login status', loginRes.status, loginData);
    const token = loginData.token;

    const productData = {
      name: 'Test product ' + Date.now(),
      description: 'test desc',
      price: 10,
      category: '699e72220c91790e1a137f42',
      stock: 5,
      thumbnail: '/images/products/placeholder.png',
      images: [{ url: '/images/products/placeholder.png', public_id: 'products/placeholder' }]
    };

    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });
    const text = await res.text();
    console.log('create status', res.status, 'bodyRaw', text);
    try {
      const d = JSON.parse(text);
      console.log('parsed', d);
    } catch (e) {
      console.error('parse error', e);
    }
  } catch (err) {
    console.error('error', err);
  }
})();