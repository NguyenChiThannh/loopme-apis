@echo off

REM Kiểm tra và chạy RabbitMQ container
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

REM Kiểm tra và chạy Redis container
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
start "Gateway Service" cmd /k "cd gateway-api && npm run dev"
start "Core Service" cmd /k "cd core-service && npm run dev"
start "Realtime Service" cmd /k "cd realtime-service && npm run dev"
start "Logger Service" cmd /k "cd logger-service && npm run dev"

echo All services have been started!