@echo off
setlocal enabledelayedexpansion

echo ===== INSTALLING NGINX INGRESS CONTROLLER =====
echo.

echo Installing NGINX Ingress Controller...
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

echo Waiting for Ingress Controller to be ready...
kubectl wait --namespace ingress-nginx --for=condition=ready pod --selector=app.kubernetes.io/component=controller --timeout=300s

echo.
echo ===== NGINX INGRESS CONTROLLER INSTALLATION COMPLETE =====
echo.

pause 