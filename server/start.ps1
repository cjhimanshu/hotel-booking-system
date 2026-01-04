# Start the backend server
Set-Location $PSScriptRoot
Write-Host "Starting Hotel Booking Backend Server..." -ForegroundColor Green
node server.js
Read-Host "Press Enter to exit"
