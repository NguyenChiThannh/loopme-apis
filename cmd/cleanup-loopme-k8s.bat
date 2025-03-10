@echo off
setlocal enabledelayedexpansion

echo ===== DELETE DEPLOYMENT APPLICATION LOOPME =====
echo.

echo Are you sure delete all resource LoopMe? (Y/N)
set /p confirm=

if /i "%confirm%" neq "Y" (
    echo Cancel delete deployment LoopMe.
    goto :end
)

echo Deleting namespace loopme and all resources in it...
kubectl delete namespace loopme

echo.
echo ===== Deleted all resource LoopMe =====
echo.

:end
pause 