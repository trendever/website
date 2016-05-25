import channel from 'services/channel/channel.js';

export const ERROR_CODES = {
      NO_ERRORS: 0,
      USER_NOT_EXISTS: 1,
      USER_ALREADY_EXISTS: 2,
      WRONG_CREDENTIALS: 3,
      INCORRECT_PHONE_FORMAT: 6
};

/**
 * Signup user with phone and username
 * (if username is instagram username then instagram=true)
 * @param  {Object} config
 * @return {Promise<bool>}       true if send or code error
 */
export function signup(phone, username, instagram) {
  // this for resend SMS (save locally params)
  // CONFIG = config ? config : CONFIG;

  return new Promise( (resolve, reject) => {
    let request = { phone };
    if (instagram) {
      request.instagram_username = username;
    } else {
      request.username = username;
    }

    channel.req('register', 'auth', request).then( data => {
      if (data.response_map.ErrorCode === ERROR_CODES.NO_ERRORS) {
        resolve(true);
      } else {
        reject(data.response_map.ErrorCode);
      }
    }).catch( error => {
      console.error('signup', error);
    });

  });
}

/**
 * Send password manually (to phone)
 * @param  {string} phone user phone (formated +79990000000)
 * @return {Promise<bool>}       true if send or code error
 */
export function sendPassword(phone) {

  return new Promise( (resolve, reject) => {

    channel.req('send_password', 'auth', {phone: phone})
    .then( data => {
      if (data.response_map.ErrorCode === ERROR_CODES.NO_ERRORS) {
        resolve(true);
      } else {
        reject(data.response_map.ErrorCode);
      }
    }).catch( error => {
      console.error('sendPassword', error);
    });

  });
}

/**
 * Confirm by code from sms and get token with user data
 * @param  {string}   phone
 * @param  {string}   code      code from sms
 *
 * RESOLVE
 * {
 *  'token': 'Strong.Happy.Token',
 *  'user': {
 *    'id': 1379,
 *    'name': 'Покупатель #1',
 *    'email': 'happierall@gmail.com',
 *    'phone': '+79388708600',
 *    'instagram_id': 1482392154,
 *    'instagram_username': 'happierall',
 *    'instagram_fullname': 'Руслан Янбердин',
 *    'instagram_avatar_url': 'https://scontent.cdninstagram.com/t51.2885-19/10932407_823916984341993_1645923981_a.jpg',
 *    'instagram_caption': 'Hi all'
 *   }
 * }
 *
 * REJECT ERROR_CODES {WRONG_CREDENTIALS, INCORRECT_PHONE_FORMAT}
 */
export function confirmByCode(phone, code) {

  return new Promise( (resolve, reject) => {

    channel.req('login', 'auth', {
      phone: phone, password: code
    }).then( data => {
      if (!data.response_map.ErrorCode) {
        resolve(data.response_map);
      } else {
        reject(data.response_map.ErrorCode);
      }
    }).catch( error => {
      if (!error.response_map || !error.response_map.ErrorCode) {
        console.error('confirmPhone', error);
        return;
      }
      reject(error.response_map.ErrorCode);
    });

  });
}
