(async () => {
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@mkshop.com', password: 'admin123' })
    });
    const text = await res.text();
    console.log('status', res.status, 'body', text);
  } catch (err) {
    console.error('error', err);
  }
})();
