export const ERROR = {
  COMMON_SYSTEM_ERROR: {
    CODE: 'sys00001',
    MESSAGE: 'An error has arisen from the system. Please try again later or contact us for a fix.',
  },
  // for All
  NOTFOUND: {
    CODE: '00001',
    MESSAGE: 'Not found, disabled or locked',
  },
  EXISTED: {
    CODE: '00002',
    MESSAGE: 'Existed',
  },
  // user
  USER_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'User not found, disabled or locked',
  },
  USERNAME_OR_PASSWORD_INCORRECT: {
    CODE: 'us00002',
    MESSAGE: 'Username or password is incorrect',
  },
  USER_EXISTED: {
    CODE: 'us00001',
    MESSAGE: 'User existed',
  },
  USER_NOT_VERIFIED: {
    CODE: 'us00001',
    MESSAGE: 'User not verified, please verify your email first',
  },
  //product
  PRODUCT_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'User not found, disabled or locked',
  },
  PRODUCT_EXISTED: {
    CODE: 'us00001',
    MESSAGE: 'Product existed',
  },

  // voucher
  VOUCHER_NOT_FOUND: {
    CODE: 'us00001',
    MESSAGE: 'Voucher not found, disabled or locked',
  },
  VOUCHER_EXISTED: {
    CODE: 'us00001',
    MESSAGE: 'Voucher existed, disabled or locked',
  },
  VOUCHER_EXPIRED: {
    CODE: 'us00001',
    MESSAGE: 'Voucher expired',
  },
  //refreshToken
  EXPIRED: {
    CODE: 'us00001',
    MESSAGE: 'Refresh Token Expired or Invalid',
  },
  // Phone
  PHONE_EXISTED: {
    CODE: '00002',
    MESSAGE: 'Please user another phone numbers',
  },
  VERIFY: {
    CODE: '00002',
    MESSAGE: 'Please verify your phone number first',
  },
  TWO_STEP_VERIFY: {
    CODE: '00002',
    MESSAGE: 'Please do 2 step verify',
  },
};
