Set-ExecutionPolicy Bypass -Scope Process -Force
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
Write-Host "Installing Chocolatey..."
iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# We need to refresh the environment variables so 'choco' is recognized in the same session
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

Write-Host "Installing PostgreSQL and Redis..."
choco install postgresql redis -y

Write-Host "======================================"
Write-Host "Installation Complete! Please look for any red errors."
Write-Host "You can close this window now."
Write-Host "======================================"
