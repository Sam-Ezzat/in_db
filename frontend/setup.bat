@echo off
echo ================================
echo Church Management System Setup
echo ================================
echo.

echo Installing dependencies...
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Dependencies installed successfully!
echo.
echo 🚀 Starting development server...
echo    Navigate to http://localhost:3000 when ready
echo.

call npm run dev

pause