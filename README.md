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

#### 3.1.1. Auth
- **POST** `/register`: Registers a new user account.
- **POST** `/verify-account`: Verifies the user account.
- **POST** `/login`: Logs in user.
- **POST** `/logout`: Logs out the user.
- **POST** `/forgot-password`: Initiates a password reset process for the user.
- **POST** `/verify-forgot-password`: Confirms a password reset using a otp code.
- **PUT** `/change-pwd`: Change current password.
- **POST** `/refresh-token`: Requests a new access token using a refresh token.

#### 3.1.2. User
- **GET** `/`: Get the user current information.
- **PUT** `/`: Update the user information.
- **GET** `/search`: Search for users by name.
- **GET** `/:id`: Get user information.

#### 3.1.3 Otps
- **POST** `/refresh`: Refresh the OTP.

#### 3.1.4 Posts
- **POST** `/`: Create a new post in newfeed.
- **GET** `/`: Get all posts from friend, groups and public posts for the newsfeed.
- **GET** `/:id`: Get a post by its postId.
- **GET** `/user/:userId`: Get all posts by userId.
- **GET** `/group/:groupId`: Get all posts by groupId.
- **POST** `/group`: Create a new post in a group (requires group membership).
- **POST** `/:id/upvote`: Upvote a post by its Id.
- **POST** `/:id/downvote`: Downvote a post by its Id.
- **DELETE** `/:id/removevote`: Remove the vote from a post by its Id.
- **POST** `/:id/comment`: Add a comment to a post by its Id.
- **DELETE** `/:id/comment`: Delete a comment from a post by its Id.

#### 3.1.5 Friends
- **POST** `/pending-invitations/:userId`: Add a pending friend invitation for a user by their Id.
- **DELETE** `/pending-invitations/:userId`: Remove a pending friend invitation for a user by their Id.
- **GET** `/`: Get all friends of user.
- **POST** `/accept-invitations/:userId`: Accept a friend invitation for a user by their Id.
- **DELETE** `/:userId`: Remove a friend by their Id.
- **GET** `/all-invitations`: Get all friend invitations for user.
- **GET** `/suggest-mutual-friends`: Suggest mutual friends for user.

#### 3.1.6 Groups
- **POST** `/`: Create a new group.
- **GET** `/search`: Search for groups by name.
- **GET** `/:groupId`: Get a group by its ID.
- **POST** `/:groupId/pending-invitations`: Add pending invitations for a group.
- **DELETE** `/:groupId/pending-invitations/:userId`: Remove a pending invitation for a user from a group (requires group ownership).
- **POST** `/:groupId/accept-invitations/:userId`: Accept a pending invitation for a user to join a group (requires group ownership).
- **POST** `/:groupId/members/:userId`: Add a member to a group (requires group ownership).
- **DELETE** `/:groupId/members/:userId`: Remove a member from a group (requires group ownership).
- **GET** `/:groupId/members`: Get all members of a group (requires group ownership).
- **GET** `/:groupId/invitations`: Get all pending invitations for a group (requires group ownership).

#### 3.1.7 Messages
- **GET** `/:userId`: Get all messages for a specific user.
- **POST** `/:userId`: Send a message to a specific user.

#### 3.1.8 Notifications
- **GET** `/`: Get all notifications for the authenticated user.
