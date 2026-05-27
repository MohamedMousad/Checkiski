Write-Host "Starting Backend..."
$backend = Start-Process -FilePath "dotnet" -ArgumentList "run --project E:\Checkiski\Checkiski.WebApi" -PassThru -WindowStyle Hidden

Write-Host "Starting Frontend..."
$frontend = Start-Process -FilePath "npm.cmd" -ArgumentList "run dev" -WorkingDirectory "E:\Checkiski\Checkiski.Client" -PassThru -WindowStyle Hidden

Write-Host "Waiting 30 seconds for servers to initialize..."
Start-Sleep -Seconds 30

Write-Host "Running Playwright Tests..."
Set-Location -Path "E:\Checkiski\Checkiski.Client"
npx playwright test --project=chromium --reporter=list > playwright_output.txt

Write-Host "Stopping Servers..."
Stop-Process -Id $backend.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontend.Id -Force -ErrorAction SilentlyContinue
taskkill /F /IM node.exe /T -ErrorAction SilentlyContinue
taskkill /F /IM dotnet.exe /T -ErrorAction SilentlyContinue

Write-Host "--- TEST RESULTS ---"
Get-Content playwright_output.txt
