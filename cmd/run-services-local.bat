REM Clear console log
@echo off

REM Check and run RabbitMQ container
docker ps | findstr "rabbitmq" > nul
if errorlevel 1 (
    echo Starting RabbitMQ container...
    docker rm -f rabbitmq 2>nul
    docker run -d --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
    echo Waiting for RabbitMQ to start...
    timeout /t 10 /nobreak
) else (
    echo RabbitMQ is already running
)

REM Check and run Redis container
docker ps | findstr "my-redis" > nul
if errorlevel 1 (
    echo Starting Redis container...
    docker rm -f my-redis 2>nul
    docker run --name my-redis -p 6379:6379 -d redis
    echo Waiting for Redis to start...
    timeout /t 10 /nobreak
) else (
    echo Redis is already running
)

echo Starting services...
start "Gateway Service" cmd /k "cd app && cd gateway-api && npm run dev"
start "Auth Service" cmd /k "cd app && cd auth-service && npm run dev"
start "Chat Service" cmd /k "cd app && cd chat-service && npm run dev"
start "Comment Service" cmd /k "cd app && cd comment-service && npm run dev"
start "Friend Service" cmd /k "cd app && cd friend-service && npm run dev"
start "Group Service" cmd /k "cd app && cd group-service && npm run dev"
start "Notification Service" cmd /k "cd app && cd notification-service && npm run dev"
start "Post Service" cmd /k "cd app && cd post-service && npm run dev"
start "Post Vote Service" cmd /k "cd app && cd post-vote-service && npm run dev"
start "Realtime Service" cmd /k "cd app && cd realtime-service && npm run dev"

echo All services have been started!