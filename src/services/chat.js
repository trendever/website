import channel from 'services/channel/channel.js';

export const MEMBER_ROLES = {
    CUSTOMER: 0,
    SUPPLIER: 1,
    SELLER: 2,
    SUPER_SELLER: 3,
};

export const ERROR_CODES = {
    NO_ERRORS: 0,
    NOT_EXISTS: 1,
    FORBIDDEN: 2,

    // Local
    UNATHORIZED: 10
};
export function sendError( errorCode, state = null ) {
  switch ( errorCode ) {
    case ERROR_CODES.FORBIDDEN:
      console.error( new Error( `Chat error: [ FOBIDDEN ]` ), state );
      break;
    case ERROR_CODES.NOT_EXISTS:
      console.error( new Error( `Chat error: [ NOT_EXISTS ]` ), state );
      break;
    case ERROR_CODES.UNATHORIZED:
      console.error( new Error( `Chat error: [ UNATHORIZED ]` ), state );
      break;
    case ERROR_CODES.NO_ERRORS:
      console.error( new Error( `Chat error: [ NO_ERRORS ]` ), state );
      break;
    default:
      return true;
  }
}

/**
 * Join to chat
 * @login_required
 * @param {number} object.lead_id
 * @param {number} object.conversation_id
 *
 * RESOLVE
 *  'chat': {
 *    'id': 88,
 *    'members': [
 *      {
 *        'id': 127,
 *        'user_id': 1379,
 *        'role': 1,
 *        'name': 'happierall'
 *      }
 *    ],
 *    'recent_message': {
 *      'conversation_id': 88,
 *      'user_id': 127,
 *      'parts': [
 *        {
 *          'content': 'Все работает',
 *          'mime_type': 'text/plain'
 *        }
 *      ],
 *      'created_at': 1461845250,
 *      'id': 663,
 *      'user': {
 *        'id': 127,
 *        'user_id': 1379,
 *        'role': 1,
 *        'name': 'happierall'
 *      }
 *    }
 *  },
 *  'member': {
 *    'id': 127,
 *    'user_id': 1379,
 *    'role': 1,
 *    'name': 'happierall'
 *  }
 *
 * REJECT (one of ERROR_CODES) {UNATHORIZED, NOT_EXISTS}
 */
export function join({ lead_id, conversation_id }) {

  return new Promise( (resolve, reject) => {

    channel.req('join', 'chat', { lead_id, conversation_id }).then( data => {
      resolve(data.response_map);
    }).catch( error => {
      if (error.log_map.code_key === '403') {
        reject(ERROR_CODES.UNATHORIZED);
      } else if (error.log_map.code_key === '400') {
        reject(ERROR_CODES.NOT_EXISTS);
      }
    });

  });
}


/**
 * Call customer by sms and email (if exists)
 * @login_required
 * @param  {number} lead_id
 */
export function callCustomer(lead_id) {

  return new Promise( (resolve, reject) => {

    channel.req('call_customer', 'chat', { lead_id }).then( data => {
      resolve(data.response_map.status);
    }).catch( error => {
      if (error.log_map.code_key === '403') {
        reject(ERROR_CODES.UNATHORIZED);
      } else if (error.log_map.code_key === '400') {
        reject(ERROR_CODES.NOT_EXISTS);
      }
    });

  });
}

/**
 * Call supplier by sms and email (if exists)
 * @login_required
 * @param  {number} lead_id
 */
export function callSupplier(lead_id) {

  return new Promise( (resolve, reject) => {

    channel.req('call_supplier', 'chat', { lead_id }).then( data => {
      resolve(data.response_map.status);
    }).catch( error => {
      if (error.log_map.code_key === '403') {
        reject(ERROR_CODES.UNATHORIZED);
      } else if (error.log_map.code_key === '400') {
        reject(ERROR_CODES.NOT_EXISTS);
      }
    });

  });
}
