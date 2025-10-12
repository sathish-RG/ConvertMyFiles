@echo off
echo Starting ConvertMyFiles Server...
echo Current directory: %CD%
echo.
echo Checking Node.js version:
node --version
echo.
echo Starting server...
node server.js
pause
