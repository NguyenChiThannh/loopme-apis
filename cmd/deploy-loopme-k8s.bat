@echo off
setlocal enabledelayedexpansion

echo ===== DEPLOYING LOOPME APPLICATION ON KUBERNETES =====
echo.

REM Create namespace
echo Creating namespace loopme...
kubectl create namespace loopme
echo Namespace loopme has been created!
echo -----------------------------------

REM Apply ConfigMap and Secret
echo Applying ConfigMap and Secret...
kubectl apply -f ../k8s/common/configmap.yaml -n loopme
kubectl apply -f ../k8s/common/secrets.yaml -n loopme
echo ConfigMap and Secret have been applied!
echo -----------------------------------

REM Deploy PVCs
echo Deploying Persistent Volume Claims...
kubectl apply -f ../k8s/mongodb-pvc.yaml -n loopme
kubectl apply -f ../k8s/redis-pvc.yaml -n loopme
kubectl apply -f ../k8s/rabbitmq-pvc.yaml -n loopme
echo Persistent Volume Claims have been deployed!
echo -----------------------------------

REM Deploy database services
echo Deploying database services...
kubectl apply -f ../k8s/mongodb-deployment.yaml -n loopme
kubectl apply -f ../k8s/mongodb-service.yaml -n loopme
kubectl apply -f ../k8s/redis-deployment.yaml -n loopme
kubectl apply -f ../k8s/redis-service.yaml -n loopme
kubectl apply -f ../k8s/rabbitmq-deployment.yaml -n loopme
kubectl apply -f ../k8s/rabbitmq-service.yaml -n loopme
echo Database services have been deployed!
echo -----------------------------------

echo Waiting for database services to start...
kubectl wait --for=condition=ready pod -l app=mongodb -n loopme --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis -n loopme --timeout=120s
kubectl wait --for=condition=ready pod -l app=rabbitmq -n loopme --timeout=120s
echo Database services are ready!
echo -----------------------------------

REM Deploy microservices
echo Deploying microservices...

echo Deploying Auth Service...
kubectl apply -f ../k8s/auth-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/auth-service-service.yaml -n loopme
echo Auth Service has been deployed!

echo Deploying Chat Service...
kubectl apply -f ../k8s/chat-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/chat-service-service.yaml -n loopme
echo Chat Service has been deployed!

echo Deploying Comment Service...
kubectl apply -f ../k8s/comment-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/comment-service-service.yaml -n loopme
echo Comment Service has been deployed!

echo Deploying Friend Service...
kubectl apply -f ../k8s/friend-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/friend-service-service.yaml -n loopme
echo Friend Service has been deployed!

echo Deploying Group Service...
kubectl apply -f ../k8s/group-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/group-service-service.yaml -n loopme
echo Group Service has been deployed!

echo Deploying Notification Service...
kubectl apply -f ../k8s/notification-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/notification-service-service.yaml -n loopme
echo Notification Service has been deployed!

echo Deploying Post Service...
kubectl apply -f ../k8s/post-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/post-service-service.yaml -n loopme
echo Post Service has been deployed!

echo Deploying Post Vote Service...
kubectl apply -f ../k8s/post-vote-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/post-vote-service-service.yaml -n loopme
echo Post Vote Service has been deployed!

echo Deploying Realtime Service...
kubectl apply -f ../k8s/realtime-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/realtime-service-service.yaml -n loopme
echo Realtime Service has been deployed!

echo All microservices have been deployed!
echo -----------------------------------

REM Deploy Gateway Service
echo Deploying Gateway Service...
kubectl apply -f ../k8s/gateway-service-deployment.yaml -n loopme
kubectl apply -f ../k8s/gateway-service-service.yaml -n loopme
echo Gateway Service has been deployed!
echo -----------------------------------

REM Deploy Ingress
echo Deploying Ingress...
kubectl apply -f ../k8s/ingress-controller.yaml -n loopme
echo Ingress has been deployed!
echo -----------------------------------

echo Checking the status of the pods...
kubectl get pods -n loopme

echo.
echo ===== DEPLOYMENT COMPLETE =====
echo.
echo You can access the application at:
echo - API Gateway: http://loopme.apis/api/
echo - WebSocket: http://loopme.apis/socket.io/
echo.
echo Note: Make sure you've added "127.0.0.1 loopme.apis" to your hosts file.
echo.

pause 