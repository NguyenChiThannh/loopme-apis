@echo off
setlocal enabledelayedexpansion

REM Thay thế bằng username Docker Hub của bạn
set DOCKER_USERNAME=nguyenchithanh

echo Start building and pushing Docker images...
echo.

REM Build và push gateway-service
echo Building and pushing gateway-service...
cd app\gateway-service
docker build -t %DOCKER_USERNAME%/loopme-gateway-service:latest .
docker push %DOCKER_USERNAME%/loopme-gateway-service:latest
cd ..\..
echo gateway-service has been built and pushed!
echo -----------------------------------

REM Build và push auth-service
echo Building and pushing auth-service...
cd app\auth-service
docker build -t %DOCKER_USERNAME%/loopme-auth-service:latest .
docker push %DOCKER_USERNAME%/loopme-auth-service:latest
cd ..\..
echo auth-service has been built and pushed!
echo -----------------------------------

REM Build và push chat-service
echo Building and pushing chat-service...
cd app\chat-service
docker build -t %DOCKER_USERNAME%/loopme-chat-service:latest .
docker push %DOCKER_USERNAME%/loopme-chat-service:latest
cd ..\..
echo chat-service has been built and pushed!
echo -----------------------------------

REM Build và push comment-service
echo Building and pushing comment-service...
cd app\comment-service
docker build -t %DOCKER_USERNAME%/loopme-comment-service:latest .
docker push %DOCKER_USERNAME%/loopme-comment-service:latest
cd ..\..
echo comment-service has been built and pushed!
echo -----------------------------------

REM Build và push friend-service
echo Building and pushing friend-service...
cd app\friend-service
docker build -t %DOCKER_USERNAME%/loopme-friend-service:latest .
docker push %DOCKER_USERNAME%/loopme-friend-service:latest
cd ..\..
echo friend-service has been built and pushed!
echo -----------------------------------

REM Build và push group-service
echo Building and pushing group-service...
cd app\group-service
docker build -t %DOCKER_USERNAME%/loopme-group-service:latest .
docker push %DOCKER_USERNAME%/loopme-group-service:latest
cd ..\..
echo group-service has been built and pushed!
echo -----------------------------------

REM Build và push notification-service
echo Building and pushing notification-service...
cd app\notification-service
docker build -t %DOCKER_USERNAME%/loopme-notification-service:latest .
docker push %DOCKER_USERNAME%/loopme-notification-service:latest
cd ..\..
echo notification-service has been built and pushed!
echo -----------------------------------

REM Build và push post-service
echo Building and pushing post-service...
cd app\post-service
docker build -t %DOCKER_USERNAME%/loopme-post-service:latest .
docker push %DOCKER_USERNAME%/loopme-post-service:latest
cd ..\..
echo post-service has been built and pushed!
echo -----------------------------------

REM Build và push post-vote-service
echo Building and pushing post-vote-service...
cd app\post-vote-service
docker build -t %DOCKER_USERNAME%/loopme-post-vote-service:latest .
docker push %DOCKER_USERNAME%/loopme-post-vote-service:latest
cd ..\..
echo post-vote-service has been built and pushed!
echo -----------------------------------

REM Build và push realtime-service
echo Building and pushing realtime-service...
cd app\realtime-service
docker build -t %DOCKER_USERNAME%/loopme-realtime-service:latest .
docker push %DOCKER_USERNAME%/loopme-realtime-service:latest
cd ..\..
echo realtime-service has been built and pushed!
echo -----------------------------------

echo All Docker images have been built and pushed!
pause 