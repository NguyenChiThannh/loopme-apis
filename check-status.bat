@echo off
setlocal enabledelayedexpansion

echo ===== CHECKING LOOPME DEPLOYMENT STATUS =====
echo.

echo Checking pods...
kubectl get pods -n loopme
echo.

echo Checking services...
kubectl get services -n loopme
echo.

echo Checking ingress...
kubectl get ingress -n loopme
echo.

echo Checking persistent volume claims...
kubectl get pvc -n loopme
echo.

echo ===== CHECK COMPLETE =====
echo.

pause