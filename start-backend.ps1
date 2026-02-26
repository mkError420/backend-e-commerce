# PowerShell script to start backend server
Write-Host "🚀 Starting MK Shop Backend..." -ForegroundColor Green

# Navigate to backend directory
Set-Location "e:\rabbani\e-Commerce-by-MK-main\backend"

# Create .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Yellow
    Copy-Item "env.example" ".env"
    Write-Host "✅ .env file created successfully!" -ForegroundColor Green
}

# Start the server
Write-Host "🔧 Starting server..." -ForegroundColor Yellow
try {
    node server-start.js
} catch {
    Write-Host "❌ Error starting server: $_" -ForegroundColor Red
    Read-Host "Press any key to exit..." -ForegroundColor Gray
}
