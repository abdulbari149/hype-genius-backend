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
    SUCCESS: {},
    ERROR: {
      EMAIL_PASSWORD_INCORRECT: 'Email or password is incorrect',
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
