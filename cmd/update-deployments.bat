@echo off
setlocal enabledelayedexpansion

REM Thay thế YOUR_DOCKERHUB_USERNAME bằng username Docker Hub của bạn
set DOCKER_USERNAME=nguyenchithanh

echo Start updated file deployment...
echo.

REM Updated gateway-service deployment
echo Updated gateway-service deployment...
powershell -Command "(Get-Content ../k8s/gateway-service-deployment.yaml) -replace 'image: loopme/gateway-service:latest', 'image: %DOCKER_USERNAME%/loopme-gateway-service:latest' | Set-Content ../k8s/gateway-service-deployment.yaml"
echo gateway-service deployment had been updated!
echo -----------------------------------

REM Updated auth-service deployment
echo Updated auth-service deployment...
powershell -Command "(Get-Content ../k8s/auth-service-deployment.yaml) -replace 'image: loopme/auth-service:latest', 'image: %DOCKER_USERNAME%/loopme-auth-service:latest' | Set-Content ../k8s/auth-service-deployment.yaml"
echo auth-service deployment had been updated!
echo -----------------------------------

REM Updated chat-service deployment
echo Updated chat-service deployment...
powershell -Command "(Get-Content ../k8s/chat-service-deployment.yaml) -replace 'image: loopme/chat-service:latest', 'image: %DOCKER_USERNAME%/loopme-chat-service:latest' | Set-Content ../k8s/chat-service-deployment.yaml"
echo chat-service deployment had been updated!
echo -----------------------------------

REM Updated comment-service deployment
echo Updated comment-service deployment...
powershell -Command "(Get-Content ../k8s/comment-service-deployment.yaml) -replace 'image: loopme/comment-service:latest', 'image: %DOCKER_USERNAME%/loopme-comment-service:latest' | Set-Content ../k8s/comment-service-deployment.yaml"
echo comment-service deployment had been updated!
echo -----------------------------------

REM Updated friend-service deployment
echo Updated friend-service deployment...
powershell -Command "(Get-Content ../k8s/friend-service-deployment.yaml) -replace 'image: loopme/friend-service:latest', 'image: %DOCKER_USERNAME%/loopme-friend-service:latest' | Set-Content ../k8s/friend-service-deployment.yaml"
echo friend-service deployment had been updated!
echo -----------------------------------

REM Updated group-service deployment
echo Updated group-service deployment...
powershell -Command "(Get-Content ../k8s/group-service-deployment.yaml) -replace 'image: loopme/group-service:latest', 'image: %DOCKER_USERNAME%/loopme-group-service:latest' | Set-Content ../k8s/group-service-deployment.yaml"
echo group-service deployment had been updated!
echo -----------------------------------

REM Updated notification-service deployment
echo Updated notification-service deployment...
powershell -Command "(Get-Content ../k8s/notification-service-deployment.yaml) -replace 'image: loopme/notification-service:latest', 'image: %DOCKER_USERNAME%/loopme-notification-service:latest' | Set-Content ../k8s/notification-service-deployment.yaml"
echo notification-service deployment had been updated!
echo -----------------------------------

REM Updated post-service deployment
echo Updated post-service deployment...
powershell -Command "(Get-Content ../k8s/post-service-deployment.yaml) -replace 'image: loopme/post-service:latest', 'image: %DOCKER_USERNAME%/loopme-post-service:latest' | Set-Content ../k8s/post-service-deployment.yaml"
echo post-service deployment had been updated!
echo -----------------------------------

REM Updated post-vote-service deployment
echo Updated post-vote-service deployment...
powershell -Command "(Get-Content ../k8s/post-vote-service-deployment.yaml) -replace 'image: loopme/post-vote-service:latest', 'image: %DOCKER_USERNAME%/loopme-post-vote-service:latest' | Set-Content ../k8s/post-vote-service-deployment.yaml"
echo post-vote-service deployment had been updated!
echo -----------------------------------

REM Updated realtime-service deployment
echo Updated realtime-service deployment...
powershell -Command "(Get-Content ../k8s/realtime-service-deployment.yaml) -replace 'image: loopme/realtime-service:latest', 'image: %DOCKER_USERNAME%/loopme-realtime-service:latest' | Set-Content ../k8s/realtime-service-deployment.yaml"
echo realtime-service deployment had been updated!
echo -----------------------------------

echo All file deployment had been updated!
pause 