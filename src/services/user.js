import channel from 'services/channel/channel.js';

export const ERROR_CODES = {
  NOT_FOUND: 1,
};

/**
 * Get user
 * @param {number} id                User id
 * @param {string} instagram_name    User instagram_name
 *
 * RESOLVE
 *   {
 *     "id": 1379,
 *     "instagram_id": 1482392154,
 *     "instagram_username": "happierall",
 *     "instagram_fullname": "Руслан Янбердин",
 *     "instagram_avatar_url": "https://scontent.cdninstagram.com/t51.2885-19/10932407_823916984341993_1645923981_a.jpg",
 *     "instagram_caption": "Hi all",
 *     "has_email": true,
 *     "has_phone": true
 *   }
 *
 * REJECT (code: ERROR_CODES.NOT_FOUND, response)
 */
export function get({ user_id, instagram_name }) {

  return new Promise( (resolve, reject) => {

    channel.req('retrieve', 'user', { user_id, instagram_name })
    .then( data => {
      resolve(data.response_map.user);
    }).catch( error => {
      reject({ code: ERROR_CODES.NOT_FOUND, response: error });
    });

  });
}
