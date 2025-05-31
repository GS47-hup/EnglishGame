@echo off
echo 🎓 English Exam Practice Game Launcher
echo.
echo Choose how to run the game:
echo 1. Start local server (recommended)
echo 2. Open HTML file directly
echo.
set /p choice="Enter your choice (1 or 2): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Starting local server...
    python start_server.py
) else if "%choice%"=="2" (
    echo.
    echo 🌐 Opening HTML file directly...
    start index.html
) else (
    echo.
    echo ❌ Invalid choice. Opening HTML file directly...
    start index.html
)

pause 