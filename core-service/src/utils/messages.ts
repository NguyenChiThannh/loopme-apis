// messages.ts

export const ResponseMessages = {
    NOT_FOUND: "NOT_FOUND",
    OK: "OK",
    USER: {
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
    },
    OTP: {
        VERIFY_OTP_FAIL: "OTP is invalid or has expired.",
        VERIFY_OTP_SUCCESS: "Verify account successful",
        REFRESH_OTP_SUCCESS: "Verify OTP successful",
    },
    GROUP: {
        CREATE_GROUP_SUCCESS: "Create goup successful.",
        ADD_PENDING_INVITATIONS_SUCCESS: "Add pending invitations successful.",
        ACCEPT_PENDING_INVITATIONS_SUCCESS: "Accept pending invitations successful.",
        REMOVE_PENDING_INVITATIONS_SUCCESS: "Remove pending invitations successful.",
        ADD_MEMBER_TO_GROUP_SUCCESS: "Add member to group successful.",
        REMOVE_MEMBER_FROM_GROUP_SUCCESS: "Remove member from group successful.",
        GET_ALL_PENDING_INVITATIONS_SUCCESS: "Get all pending invitations successful",
        GET_ALL_MEMBERS_GROUP_SUCCESS: "Get all members in group successful"
    },
    POST: {
        CREATE_POST_SUCCESS: "Upvote post successful",
        UPVOTE_POST_SUCCESS: "Upvote post successful",
        DOWNVOTE_POST_SUCCESS: "Downvote post successful",
        REMOVEVOTE_POST_SUCCESS: "Removevote post successful",
    },
    FRIEND: {
        ADD_PENDING_INVITATIONS_SUCCESS: "Add pending invitations successful.",
        REMOVE_PENDING_INVITATIONS_SUCCESS: "Remove pending invitations successful.",
        ACCEPT_PENDING_INVITATIONS_SUCCESS: "Accept pending invitations successful.",
        REMOVE_FRIEND_SUCCESS: 'Remove friend successful.',
        GET_ALL_FRIEND_SUCCESS: 'Get all friend successful.',
        GET_ALL_INVITATIONS_FRIEND_SUCCESS: "Get all invitations successful."
    }
}