// messages.ts

export const ResponseMessages = {
    NOT_FOUND: "NOT_FOUND",
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
    },
    POST: {
        CREATE_POST_SUCCESS: "Upvote post successful",
        UPVOTE_POST_SUCCESS: "Upvote post successful",
        DOWNVOTE_POST_SUCCESS: "Downvote post successful",
        REMOVEVOTE_POST_SUCCESS: "Removevote post successful",
    }
}