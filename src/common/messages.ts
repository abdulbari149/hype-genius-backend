export const MESSAGES = {
  USER: {
    SUCCESS: {},
    ERROR: {
      USER_NOT_EXIST: "User doesn't exists",
    },
  },
  EMAIL: {
    SUCCESS: {},
    ERROR: {
      INVALID_EMAIL: 'Invalid Email',
      EMAIL_DOES_NOT_EXIST: "Email doesn't exist",
      EMAIL_IS_EXIST: 'Email already exists',
    },
  },
  AUTH: {
    SUCCESS: {
      VERIFY_EMAIL: 'Account has been verified.',
      RESEND_VERIFICATION_EMAIL: 'Verification email resent.',
      FORGOT_PASSWORD: 'Reset password link has been sent to your email.',
      RESET_PASSWORD: 'Password changed successfully.',
      LOGOUT: 'You logged out successfully.',
      VERIFY_CODE: 'Code has been verified',
    },
    ERROR: {
      TOKEN_EXPIRED: 'Token is expired.',
      TOKEN_INVALID: 'Token is invalid.',
      TOKEN_INVALID_OR_EXPIRED: 'Token is invalid or expired.',
      LOGGED_OUT: 'You are currently logged out, please login again.',
      REFRESH_MALFORMED: 'Refresh token malformed.',
      USERNAME_PASSWORD_INCORRECT: 'Username or password is incorrect.',
      EMAIL_UNVERIFIED: 'Email address not verified',
      VERIFICATION_LINK_EXPIRED:
        'Your verification link is invalid or has expired.',
      USER_ALREADY_VERIFIED: 'User already verified.',
      USER_NOT_EXIST: 'User with this email does not exist.',
      INVALID_CODE: 'User have entered an invalid code',
      USER_ALREADY_EXIST: 'User already exists',
    },
  },
};
export enum ResponseMessage {
  UNAUTHORIZED = 'Unauthorized for request. Token Mismatch.',
  SUCCESS = 'Success',
  SUCCESS_WITH_NO_CONTENT = 'No Content',
  NOT_FOUND = 'Resource Not found',
  CONFLICT = 'The request could not be completed due to a conflict with the current state of the resource',
  NOT_ACCEPTABLE = 'User not activated.',
  FORBIDDEN = 'Not allowed for performing this action.',
  BAD_REQUEST = 'Bad Request. Please verify your request input.',
  SERVER_ERROR = 'Something went wrong, please try again.',
}
