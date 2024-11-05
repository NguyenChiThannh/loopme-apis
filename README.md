# Loopme-apis

## 1. Introduction
LoopMe is a social networking platform similar to Facebook.

### 1.1. Architecture:

![Frame 1](https://github.com/user-attachments/assets/751d728f-b4e4-42db-b6d1-0f1f5663bd56)

### 1.2. Technology used:

- **TypeScript**: The primary programming language used for the application.
- **Express.js**: A framework for building Node.js applications, used for creating the RESTful API.
- **Node.js**: A JavaScript runtime environment used for building server-side applications.
- **JWT (JSON Web Tokens)**: Used for authentication and authorization.
- **Rabbitmq**: A message broker used for handling asynchronous communication between services.
- **Redis**: An in-memory data structure store used for caching and managing sessions.
- **MongoDB**: A NoSQL database used for storing data.
- **Mongoose**: An ODM library for MongoDB and Node.js, used to manage data relationships and validation.
- **Socket.io**: A library for real-time, bidirectional communication between clients and servers.
- **Nodemail**: A module for Node.js used to send emails easily.
- **Zod**: A TypeScript-first schema declaration and validation library.
- **Winston**: A versatile logging library for Node.js, used for logging application activity.

## 2. Setup

### 2.1. Prerequisites

- Node 20 or higher
- Maven
- MongoDB

### 2.2. Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/NguyenChiThannh/loopme-apis.git
   cd loopme-apis
   ```

## 3. API Documentation

### 3.1. Endpoints

POST /register: Registers a new user account.
POST /verify-account: Verifies the user account.
POST /login: Logs in an existing user.
POST /logout: Logs out the user and invalidates the session.
POST /forgot-password: Initiates a password reset process for the user.
POST /verify-forgot-password: Confirms a password reset using a verification code.
POST /refresh-token: Requests a new access token using a refresh token.

GET /: Get the user information.
POST /: Update the user information.
GET /search: Search for users.

POST /refresh: Refresh the OTP (One-Time Password).

POST /: Create a new post.
GET /: Get all posts.
GET /:id: Get a post by its ID.
GET /group/:groupId: Get posts by group ID.
POST /group: Create a new post in a group (requires group membership).
POST /:id/upvote: Upvote a post by its ID.
POST /:id/downvote: Downvote a post by its ID.
DELETE /:id/removevote: Remove the vote from a post by its ID.
POST /:id/comment: Add a comment to a post by its ID.
DELETE /:id/comment: Delete a comment from a post by its ID.

POST /pending-invitations/:userId: Add a pending friend invitation for a user by their ID.
DELETE /pending-invitations/:userId: Remove a pending friend invitation for a user by their ID.
GET /: Get all friends of the authenticated user.
POST /accept-invitations/:userId: Accept a friend invitation for a user by their ID.
DELETE /:userId: Remove a friend by their ID.
GET /all-invitations: Get all friend invitations for the authenticated user.
GET /suggest-mutual-friends: Suggest mutual friends for the authenticated user.

POST /: Create a new group.
GET /search: Search for groups.
GET /:groupId: Get a group by its ID.
POST /:groupId/pending-invitations: Add pending invitations for a group.
DELETE /:groupId/pending-invitations/:userId: Remove a pending invitation for a user from a group (requires group ownership).
POST /:groupId/accept-invitations/:userId: Accept a pending invitation for a user to join a group (requires group ownership).
POST /:groupId/members/:userId: Add a member to a group (requires group ownership).
DELETE /:groupId/members/:userId: Remove a member from a group (requires group ownership).
GET /:groupId/members: Get all members of a group.
GET /:groupId/invitations: Get all pending invitations for a group (requires group ownership).

GET /:userId: Get all messages for a specific user (requires token verification).
POST /:userId: Send a message to a specific user (requires token verification).

GET /: Get all notifications for the authenticated user (requires token verification).
