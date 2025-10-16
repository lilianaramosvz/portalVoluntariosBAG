# start-emulators.ps1
# PowerShell helper to start Firebase emulators for this repo
# Usage: Open PowerShell, run: .\start-emulators.ps1

Write-Host "Starting Firebase emulators (functions, firestore, auth)..."
cd $PSScriptRoot
firebase emulators:start --only functions,firestore,auth
