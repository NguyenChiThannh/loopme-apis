@echo off
setlocal enabledelayedexpansion

echo ===== LOOPME DEPLOYMENT AUTOMATION =====
echo.

echo Step 1: Install NGINX Ingress Controller
echo.
call install-ingress-controller.bat

echo Step 2: Update deployment files with Docker Hub username
echo.
call update-deployments.bat

echo Step 3: Deploy LoopMe application
echo.
call deploy-loopme.bat

echo Step 4: Check deployment status
echo.
call check-status.bat

echo.
echo ===== ALL STEPS COMPLETED =====
echo.
echo You can now access the application at:
echo - API Gateway: http://loopme.apis/api/
echo - WebSocket: http://loopme.apis/socket.io/
echo.
echo Note: Make sure you've added "127.0.0.1 loopme.apis" to your hosts file.
echo.

pause 