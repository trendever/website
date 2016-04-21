import channel from "services/channel/channel.js";

export const ERROR_CODES = {
      NO_ERRORS: 0,
      USER_NOT_EXISTS: 1,
      USER_ALREADY_EXISTS: 2,
      WRONG_CREDENTIALS: 3,
      INCORRECT_PHONE_FORMAT: 6,
};

// private
var CONFIG = {
  phone: '',
};

/**
 * Signup user with phone and username
 * (if username is instagram username then instagram=true)
 * @param  {Object} config
 * @return {Promise<bool>}       true if send or code error
 */
export function signup(config) {
  // this for resend SMS (save locally params)
  CONFIG = config ? config : CONFIG;

  return new Promise( (resolve, reject) => {
    let request = {phone: CONFIG.phone};
    if (CONFIG.instagram) {
      request.instagram_username = CONFIG.username;
    } else {
      request.username = CONFIG.username;
    }

    channel.req("register", "auth", request).then( data => {
      if (data.response_map.ErrorCode === ERROR_CODES.NO_ERRORS) {
        resolve(true);
      } else {
        reject(data.response_map.ErrorCode);
      }
    }).catch( error => {
      console.error("signup", error);
    });

  });
}

/**
 * Send password manually (to phone)
 * @param  {Object} config       object with data
 * @param  {string} config.phone user phone (formated +79990000000)
 * @return {Promise<bool>}       true if send or code error
 */
export function sendPassword(config) {
  var _config = config ? config : CONFIG;

  return new Promise( (resolve, reject) => {

    channel.req("send_password", "auth", {phone: _config.phone})
    .then( data => {
      if (data.response_map.ErrorCode === ERROR_CODES.NO_ERRORS) {
        resolve(true);
      } else {
        reject(data.response_map.ErrorCode);
      }
    }).catch( error => {
      console.error("sendPassword", error);
    });

  });
}

/**
 * Confirm by code from sms and get token with user data
 * @param  {Object} config       object with data
 * @param  {code}   config.code  code from sms
 *
 * RESOLVE
 * {
 *  "token": "Strong.Happy.Token",
 *  "user": {
 *    "id": 1379,
 *    "name": "Покупатель #1",
 *    "email": "happierall@gmail.com",
 *    "phone": "+79388708600",
 *    "instagram_id": 1482392154,
 *    "instagram_username": "happierall",
 *    "instagram_fullname": "Руслан Янбердин",
 *    "instagram_avatar_url": "https://scontent.cdninstagram.com/t51.2885-19/10932407_823916984341993_1645923981_a.jpg",
 *    "instagram_caption": "Hi all"
 *   }
 * }
 *
 * REJECT ERROR_CODES {WRONG_CREDENTIALS, INCORRECT_PHONE_FORMAT}
 */
export function confirmByCode(config) {

  return new Promise( (resolve, reject) => {

    channel.req("login", "auth", {
      phone: CONFIG.phone, password: config.code
    }).then( data => {
      if (!data.response_map.ErrorCode) {
        resolve(data.response_map);
      } else {
        reject(data.response_map.ErrorCode);
      }
    }).catch( error => {
      console.error("confirmPhone", error);
    });

  });
}
