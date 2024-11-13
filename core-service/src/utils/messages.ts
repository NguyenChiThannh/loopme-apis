export const ResponseMessages = {
    NOT_FOUND: "NOT_FOUND",
    OK: "OK",
    FORBIDDEN: "FORBIDDEN",
    UNAUTHORIZED: "Unauthorized",
    USER: {
        TOKEN_EXPIRED: "JWT Expired",
        UNAUTHORIZED: "Unauthorized",
        USER_ALREADY_EXISTS: "User already exists. Please use a different email address.",
        REGISTER_SUCCESS: "Registered successfully. Please enter the OTP to verify your account.",
        VERIFY_ACCOUNT_SUCCESS: "Verify successfully.",
        VERIFY_ACCOUNT_FAIL: "The OTP code has expired or is invalid.",
        LOGIN_FAIL: "Email or password is wrong.",
        LOGIN_SUCCESSFUL: "Login successful.",
        REFRESH_TOKEN_SUCCESSFUL: "Refresh token successful.",
        LOGOUT_SUCCESSFUL: "Logout successful.",
        FORGOT_PASSWORD: "Please enter the OTP to set a new password.",
        VERIFY_FORGOT_PASSWORD: "Forgot password successful.",
        SEARCH_USER_SUCCESS: "Search user successful.",
        CHANGE_PASSWORD_SUCCESS: "Change password successful",
        CHANGE_PASSWORD_FAIL: "Password is wrong.",
    },
    OTP: {
        VERIFY_OTP_FAIL: "OTP is invalid or has expired.",
        VERIFY_OTP_SUCCESS: "Verify account successful",
        REFRESH_OTP_SUCCESS: "Verify OTP successful",
    },
    GROUP: {
        CREATE_GROUP_SUCCESS: "Create group successful.",
        GET_GROUP_SUCCESS: "Get group successful.",
        GET_JOINED_GROUP_SUCCESS: "Get joined group successful.",
        ADD_PENDING_INVITATIONS_SUCCESS: "Add pending invitations successful.",
        ACCEPT_PENDING_INVITATIONS_SUCCESS: "Accept pending invitations successful.",
        REMOVE_PENDING_INVITATIONS_SUCCESS: "Remove pending invitations successful.",
        ADD_MEMBER_TO_GROUP_SUCCESS: "Add member to group successful.",
        REMOVE_MEMBER_FROM_GROUP_SUCCESS: "Remove member from group successful.",
        GET_ALL_PENDING_INVITATIONS_SUCCESS: "Get all pending invitations successful",
        GET_ALL_MEMBERS_GROUP_SUCCESS: "Get all members in group successful",
        SEARCH_GROUP_SUCCESS: "Search group successful"
    },
    POST: {
        CREATE_POST_SUCCESS: "Create post successful",
        GET_POST_SUCCESS: "Get post successful",
        DELETE_POST_SUCCESS: "Delete post successful",
        UPDATE_POST_SUCCESS: "Update post successful",
        UPVOTE_POST_SUCCESS: "Upvote post successful",
        DOWNVOTE_POST_SUCCESS: "Downvote post successful",
        REMOVEVOTE_POST_SUCCESS: "Removevote post successful",
        ADD_COMMENT_POST_SUCCESS: "Add comment post successful",
        DELETE_COMMENT_POST_SUCCESS: "Delete comment post successful",
    },
    FRIEND: {
        ADD_PENDING_INVITATIONS_SUCCESS: "Add pending invitations successful.",
        REMOVE_PENDING_INVITATIONS_SUCCESS: "Remove pending invitations successful.",
        ACCEPT_PENDING_INVITATIONS_SUCCESS: "Accept pending invitations successful.",
        REMOVE_FRIEND_SUCCESS: 'Remove friend successful.',
        GET_ALL_FRIEND_SUCCESS: 'Get all friend successful.',
        GET_ALL_INVITATIONS_FRIEND_SUCCESS: "Get all invitations successful."
    },
    NOTIFICATIONS: {
        GET_ALL_NOTIFICATIONS_SUCCESS: "Get all notifications successful",
        MARK_AS_READ_SUCCESS: "Mark as read successful",
        MARK_ALL_AS_READ_SUCCESS: "Mark all as read successful",
    },
    MESSAGE: {
        GET_MESSAGE_SUCCESS: "Get message success",
        SEND_MESSAGE_SUCCESS: "Send messsage success",
        GET_CHANNEL_MESSAGE_SUCCESS: "Get channel message success",
    },
    CHANNEL: {
        GET_ALL_CHANNEL_SUCCESS: "Get all channel success",
        GET_CHANNEL_SUCCESS: "Get channel success",
        CREATE_CHANNEL_SUCCESS: "Create channel success"
    }

}