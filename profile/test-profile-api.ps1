# ============================================
# test-profile-api.ps1
# Script de test complet pour Profile Service
# ============================================

$baseUrl = "http://localhost:3000/api/profiles"
$healthUrl = "http://localhost:3000/health"

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  HealthTrack Profile Service Test  " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Test 0: Health Check
Write-Host "[0] Testing Health Check..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri $healthUrl -Method Get
    Write-Host "[OK] Service is running: $($health.status)" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host "[ERROR] Service is NOT running!" -ForegroundColor Red
    Write-Host "  Make sure to run: npm run dev" -ForegroundColor Yellow
    exit
}

# Test 1: Register Patient
Write-Host "[1] Registering Patient..." -ForegroundColor Yellow
$patientData = @{
    email = "patient_$(Get-Date -Format 'HHmmss')@test.com"
    password = "password123"
    firstName = "Ahmed"
    lastName = "Test"
    role = "PATIENT"
    phone = "+212600000000"
    maladieChronique = "Diabete Type 2"
} | ConvertTo-Json

try {
    $patientResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method Post `
        -Body $patientData `
        -ContentType "application/json"
    
    $patientToken = $patientResponse.token
    $patientId = $patientResponse.profile.id
    
    Write-Host "[OK] Patient created: $($patientResponse.profile.email)" -ForegroundColor Green
    Write-Host "  ID: $patientId" -ForegroundColor Gray
    Write-Host "  Token: $($patientToken.Substring(0,20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to create patient" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 2: Register Doctor
Write-Host "[2] Registering Doctor..." -ForegroundColor Yellow
$doctorData = @{
    email = "doctor_$(Get-Date -Format 'HHmmss')@test.com"
    password = "doctor123"
    firstName = "Dr. Sara"
    lastName = "Alami"
    role = "DOCTOR"
    phone = "+212611111111"
} | ConvertTo-Json

try {
    $doctorResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method Post `
        -Body $doctorData `
        -ContentType "application/json"
    
    $doctorToken = $doctorResponse.token
    $doctorId = $doctorResponse.profile.id
    
    Write-Host "[OK] Doctor created: $($doctorResponse.profile.email)" -ForegroundColor Green
    Write-Host "  ID: $doctorId" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to create doctor" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 3: Register Admin
Write-Host "[3] Registering Admin..." -ForegroundColor Yellow
$adminData = @{
    email = "admin_$(Get-Date -Format 'HHmmss')@test.com"
    password = "admin123"
    firstName = "Khalid"
    lastName = "Admin"
    role = "ADMIN"
    phone = "+212622222222"
} | ConvertTo-Json

try {
    $adminResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method Post `
        -Body $adminData `
        -ContentType "application/json"
    
    $adminToken = $adminResponse.token
    $adminId = $adminResponse.profile.id
    
    Write-Host "[OK] Admin created: $($adminResponse.profile.email)" -ForegroundColor Green
    Write-Host "  ID: $adminId" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to create admin" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 4: Login as Patient
Write-Host "[4] Testing Login..." -ForegroundColor Yellow
$loginData = @{
    email = $patientResponse.profile.email
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method Post `
        -Body $loginData `
        -ContentType "application/json"
    
    Write-Host "[OK] Login successful" -ForegroundColor Green
    Write-Host "  Token received: $($loginResponse.token.Substring(0,20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "[ERROR] Login failed" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 5: Get My Profile
Write-Host "[5] Getting Current Profile..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $patientToken"
    }
    
    $myProfile = Invoke-RestMethod -Uri "$baseUrl/me" `
        -Method Get `
        -Headers $headers
    
    Write-Host "[OK] Profile retrieved: $($myProfile.firstName) $($myProfile.lastName)" -ForegroundColor Green
    Write-Host "  Role: $($myProfile.role)" -ForegroundColor Gray
    Write-Host "  Email: $($myProfile.email)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to get profile" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 6: Update My Profile
Write-Host "[6] Updating Profile..." -ForegroundColor Yellow
$updateData = @{
    phone = "+212633333333"
    firstName = "Ahmed Updated"
} | ConvertTo-Json

try {
    $headers = @{
        "Authorization" = "Bearer $patientToken"
    }
    
    $updatedProfile = Invoke-RestMethod -Uri "$baseUrl/me" `
        -Method Put `
        -Headers $headers `
        -Body $updateData `
        -ContentType "application/json"
    
    Write-Host "[OK] Profile updated successfully" -ForegroundColor Green
    Write-Host "  New name: $($updatedProfile.firstName)" -ForegroundColor Gray
    Write-Host "  New phone: $($updatedProfile.phone)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to update profile" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 7: List All Profiles (Admin)
Write-Host "[7] Listing All Profiles (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    
    $allProfiles = Invoke-RestMethod -Uri "$baseUrl" `
        -Method Get `
        -Headers $headers
    
    Write-Host "[OK] Found $($allProfiles.Count) profiles" -ForegroundColor Green
    foreach ($profile in $allProfiles) {
        Write-Host "  - $($profile.firstName) $($profile.lastName) [$($profile.role)]" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to list profiles" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 8: Get Doctors List
Write-Host "[8] Listing Doctors..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $patientToken"
    }
    
    $doctors = Invoke-RestMethod -Uri "$baseUrl/role/DOCTOR" `
        -Method Get `
        -Headers $headers
    
    Write-Host "[OK] Found $($doctors.Count) doctor(s)" -ForegroundColor Green
    foreach ($doctor in $doctors) {
        Write-Host "  - $($doctor.firstName) $($doctor.lastName)" -ForegroundColor Gray
    }
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to list doctors" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 9: Get Statistics (Admin)
Write-Host "[9] Getting Statistics (Admin)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $adminToken"
    }
    
    $stats = Invoke-RestMethod -Uri "$baseUrl/statistics" `
        -Method Get `
        -Headers $headers
    
    Write-Host "[OK] Statistics retrieved:" -ForegroundColor Green
    Write-Host "  Total: $($stats.total)" -ForegroundColor Gray
    Write-Host "  Patients: $($stats.patients)" -ForegroundColor Gray
    Write-Host "  Doctors: $($stats.doctors)" -ForegroundColor Gray
    Write-Host "  Admins: $($stats.admins)" -ForegroundColor Gray
    Write-Host "  Active: $($stats.active)" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "[ERROR] Failed to get statistics" -ForegroundColor Red
    Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
}

# Test 10: Test Authorization (Patient trying admin route)
Write-Host "[10] Testing Authorization (Patient -> Admin route)..." -ForegroundColor Yellow
try {
    $headers = @{
        "Authorization" = "Bearer $patientToken"
    }
    
    $result = Invoke-RestMethod -Uri "$baseUrl/statistics" `
        -Method Get `
        -Headers $headers
    
    Write-Host "[ERROR] Authorization failed - Patient should NOT access admin route!" -ForegroundColor Red
    Write-Host ""
} catch {
    if ($_.Exception.Response.StatusCode -eq 403) {
        Write-Host "[OK] Authorization works correctly (403 Forbidden)" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "[ERROR] Unexpected error" -ForegroundColor Red
        Write-Host "  Details: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host ""
    }
}

# Summary
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "           Test Summary              " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Created Users:" -ForegroundColor Yellow
Write-Host "  Patient: $($patientResponse.profile.email)" -ForegroundColor White
Write-Host "  Doctor:  $($doctorResponse.profile.email)" -ForegroundColor White
Write-Host "  Admin:   $($adminResponse.profile.email)" -ForegroundColor White
Write-Host ""
Write-Host "Tokens for Postman:" -ForegroundColor Yellow
Write-Host "  Patient Token: $patientToken" -ForegroundColor Gray
Write-Host "  Doctor Token:  $doctorToken" -ForegroundColor Gray
Write-Host "  Admin Token:   $adminToken" -ForegroundColor Gray
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Import Postman collection" -ForegroundColor White
Write-Host "  2. Use tokens above for manual testing" -ForegroundColor White
Write-Host "  3. Check MongoDB with: mongosh" -ForegroundColor White
Write-Host "     use healthtrack" -ForegroundColor White
Write-Host "     db.profiles.find()" -ForegroundColor White
Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan