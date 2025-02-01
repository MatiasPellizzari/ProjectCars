@echo off
cd /d "%~dp0"

:: Check and install Backend dependencies
if not exist "%~dp0ProjectCarsBackend\venv" (
    echo Virtual environment not found, creating one...
    python -m venv "%~dp0ProjectCarsBackend\venv"
    call "%~dp0ProjectCarsBackend\venv\Scripts\activate" && pip install -r "%~dp0ProjectCarsBackend\requirements.txt"
) else (
    call "%~dp0ProjectCarsBackend\venv\Scripts\activate" && pip install --upgrade -r "%~dp0ProjectCarsBackend\requirements.txt"
)

:: Start Flask Backend in a new terminal
start cmd /k "cd /d %~dp0ProjectCarsBackend && call venv\Scripts\activate && python .\logic.py"

:: Check and install Frontend dependencies
if not exist "%~dp0ProjectCarsFrontend\node_modules" (
    echo Installing frontend dependencies...
    cd "%~dp0ProjectCarsFrontend"
    npm install
)

:: Start Frontend in a new terminal
start cmd /k "cd /d %~dp0ProjectCarsFrontend && npm run dev"

:: Wait a few seconds before opening the browser
timeout /t 5 >nul

:: Open the application in the browser
start "" "http://localhost:5173/"