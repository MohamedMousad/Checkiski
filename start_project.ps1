# Checkiski Starter Script
# This script will install dependencies, apply database migrations, and start both the frontend and backend servers.

Write-Host "======================================"
Write-Host "   Starting Checkiski Setup...        "
Write-Host "======================================"

# 1. Install Frontend Dependencies
Write-Host "`n[1/3] Installing Frontend Dependencies (Node.js/npm)..."
Set-Location -Path "Checkiski.Client"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Failed to install npm dependencies. Please ensure Node.js is installed." -ForegroundColor Red
    exit
}
Set-Location -Path ".."

# 2. Apply Database Migrations
Write-Host "`n[2/3] Applying Database Migrations (Entity Framework Core)..."
Set-Location -Path "Checkiski.Infrastructure"
dotnet ef database update --startup-project ../Checkiski.WebApi
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error: Database migration failed. Ensure PostgreSQL is running and Checkiski.WebApi/appsettings.json has the correct connection string." -ForegroundColor Red
    exit
}
Set-Location -Path ".."

# 3. Start the Servers
Write-Host "`n[3/3] Starting Servers..."
Write-Host "Starting Backend (.NET WebApi) on port 5000..."
Start-Process powershell.exe -ArgumentList "-NoExit -Command `"cd Checkiski.WebApi; dotnet run`""

Write-Host "Starting Frontend (Next.js) on port 3000..."
Start-Process powershell.exe -ArgumentList "-NoExit -Command `"cd Checkiski.Client; npm run dev`""

Write-Host "`n======================================"
Write-Host "Checkiski is now running!"
Write-Host "Frontend: http://localhost:3000"
Write-Host "Backend API: http://localhost:5000"
Write-Host "======================================"
