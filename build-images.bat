start "Gateway Service" cmd /k "cd app && cd gateway-api && docker build -t loopme-api/gateway-service ."
start "Auth Service" cmd /k "cd app && cd auth-service && docker build -t loopme-api/auth-service ."
start "Chat Service" cmd /k "cd app && cd chat-service && docker build -t loopme-api/chat-service ."
start "Comment Service" cmd /k "cd app && cd comment-service && docker build -t loopme-api/comment-service ."
start "Friend Service" cmd /k "cd app && cd friend-service && docker build -t loopme-api/friend-service ."
start "Group Service" cmd /k "cd app && cd group-service && docker build -t loopme-api/group-service ."
start "Notification Service" cmd /k "cd app && cd notification-service && docker build -t loopme-api/notification-service ."
start "Post Service" cmd /k "cd app && cd post-service && docker build -t loopme-api/post-service ."
start "Post Vote Service" cmd /k "cd app && cd post-vote-service && docker build -t loopme-api/post-vote-service ."
start "Realtime Service" cmd /k "cd app && cd realtime-service && docker build -t loopme-api/realtime-service ."

echo All services have been dockerize all service!