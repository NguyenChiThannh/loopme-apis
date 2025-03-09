start "Gateway Service" cmd /k "cd app && cd gateway-api && npm i @loopme/common"
start "Auth Service" cmd /k "cd app && cd auth-service && npm i @loopme/common"
start "Chat Service" cmd /k "cd app && cd chat-service && npm i @loopme/common"
start "Comment Service" cmd /k "cd app && cd comment-service && npm i @loopme/common"
start "Friend Service" cmd /k "cd app && cd friend-service && npm i @loopme/common"
start "Group Service" cmd /k "cd app && cd group-service && npm i @loopme/common"
start "Notification Service" cmd /k "cd app && cd notification-service && npm i @loopme/common"
start "Post Service" cmd /k "cd app && cd post-service && npm i @loopme/common"
start "Post Vote Service" cmd /k "cd app && cd post-vote-service && npm i @loopme/common"
start "Realtime Service" cmd /k "cd app && cd realtime-service && npm i @loopme/common"

echo All services have been updated !