@echo off
echo Starting MK Shop Backend...
cd /d "%~dp0"
copy env.example .env >nul 2>&1
node server-start.js
pause
