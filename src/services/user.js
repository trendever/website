import channel from 'services/channel/channel.js';

export const ERROR_CODES = {
  NOT_FOUND: 1,
};

/**
 * Get user or shop (instagram_name)
 * @param {number} id                    User id
 * @param {string} instagram_name    User or Shop instagram_name
 *
 * RESOLVE
   {
    User:
 *   {
 *     "id": 1379,
 *     "instagram_id": 1482392154,
 *     "instagram_username": "happierall",
 *     "instagram_fullname": "Руслан Янбердин",
 *     "instagram_avatar_url": "https://scontent.cdninstagram.com/t51.2885-19/10932407_823916984341993_1645923981_a.jpg",
 *     "instagram_caption": "Totally awesome",
 *     "has_email": true,
 *     "has_phone": true
 *   }
    }

    OR

    {
    "Shop": {
        "id": 1379,
        "supplier": {
          "id": 1379,
          "instagram_id": 1482392154,
          "instagram_username": "happierall",
          "instagram_fullname": "Руслан Янбердин",
          "instagram_avatar_url": "https://scontent.cdninstagram.com/t51.2885-19/10932407_823916984341993_1645923981_a.jpg",
          "instagram_caption": "Totally awesome",
          "has_email": true,
          "has_phone": true
        },
        "instagram_id": 1482392154,
        "instagram_username": "happierall",
        "instagram_fullname": "Руслан Янбердин",
        "instagram_avatar_url": "https://scontent.cdninstagram.com/t51.2885-19/10932407_823916984341993_1645923981_a.jpg",
        "instagram_caption": "Totally awesome"
      }
    }
  }
 *
 * REJECT (code: ERROR_CODES.NOT_FOUND, response)
 */
export function get({ user_id, instagram_name }) {

  return new Promise( (resolve, reject) => {

    channel.req('retrieve', 'user', { user_id, instagram_name })
    .then( data => {
      resolve(data.response_map.profile);
    }).catch( error => {
      reject({ code: ERROR_CODES.NOT_FOUND, response: error });
    });

  });
}

export function setEmail(email){

  return new Promise((resolve, reject)=>{
    channel.req('set_email','user',{email})
    .then( data => {
      resolve(data.response_map.status);
    }).catch( error => {
      reject({ code: ERROR_CODES.NOT_FOUND, response: error });
    });
  })
}

export function setToken(token,type){
  return new Promise((resolve, reject)=>{
    channel.req('add','push_tokens',{token,type})
    .then( data => {
      resolve(data.response_map.status);
    }).catch( error => {
      reject({ code: ERROR_CODES.NOT_FOUND, response: error });
    });
  })
}