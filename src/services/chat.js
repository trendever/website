import channel from "services/channel/channel.js";

/*
  Когда лид создается, создается чат, на клиенте ты запрашиваешь
  lead.list он возвращает тебе весь список твоих лидов,
  по мимо инфы лида, в каждом лиде будет твоя роль указана,
  айди чата и статус лида

  дальше знаю lead_id, ты можешь выполнить chat.join с этим айди,
  джоин именно по айди лида, т.к.
  публик апи на своей стороне по лиду определяет твою роль,
  и с ней добавляет тебя в чат

  а дальше уже chat.send, chan.history,
  там айди чата передается, не лида

  может быть такое что чат не создался,
  тогда у лида айди чата будет пустой.
  Ты можеш сделать lead.event метод послать lead_id и
  имя эвента CREATE, это заставит лид обновить свой статус,
  и пересоздать чат. Актуально если лид ты создал через админку,
  при создании лида через админку чат не создается

  итого:
  lead.list чтобы получить список лидов
  chat.join чтобы вступить в чат
  chat.history получать историю
  lead.event  менять статус лида
*/

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


/**
 * History messages of chat
 * @param  {number} product_id
 *
 * RESOLVE
 * {
 *   "chat": {
 *     "id": 1,
 *     "members": [
 *       {
 *         "id": 1,
 *         "user_id": 1379,
 *         "name": "happierall",
 *         "role": 1
 *       },
 *       {
 *         "id": 2,
 *         "user_id": 3653,
 *         "role": 2
 *       }
 *     ]
 *   },
 *   "recent_message": {
 *      "conversation_id": 1,
 *      "user_id": 1,
 *      "parts": [
 *        {
 *          "content": "Йо нига",
 *          "mime_type": "text/plain"
 *        }
 *      ],
 *      "created_at": 1461083329,
 *      "id": 37,
 *      "user": {
 *        "id": 1,
 *        "user_id": 1379,
 *        "name": "happierall"
 *      }
 *    }
 *   "error": null,
 *   "messages": [
 *     {
 *       "conversation_id": 1,
 *       "user_id": 1379,
 *       "parts": [
 *         {
 *           "content": "{product object}",
 *           "mime_type": "text/json"
 *         }
 *       ],
 *       "user": {
 *          "id": 6,
 *          "user_id": 1379,
 *          "name": "happierall"
 *        }
 *       "created_at": 1460905108,
 *       "id": 1
 *     },
 *     {
 *       "conversation_id": 1,
 *       "user_id": 1379,
 *       "parts": [
 *         {
 *           "content": "Товар в наличии?",
 *           "mime_type": "text/plain"
 *         }
 *       ],
 *       "user": {
 *          "id": 6,
 *          "user_id": 1379,
 *          "name": "happierall"
 *        }
 *       "created_at": 1460910536,
 *       "id": 2
 *     },
 *   ]
 * }
 *
* REJECT (one of ERROR_CODES) {NOT_EXISTS, UNATHORIZED}
 */

export function history(conversation_id) {

  return new Promise( (resolve, reject) => {

    channel.req("history", "chat", conversation_id).then( data => {
      if (!data.response_map.error) {
        resolve(data.response_map);
      } else if (data.response_map.error.code === ERROR_CODES.NOT_EXISTS) {
        reject(data.response_map.error);
      } else if (data.response_map.error.code === ERROR_CODES.FORBIDDEN) {
        reject(data.response_map.error);
      }
    }).catch( error => {
      if (error.log_map.code_key === '403') {
        reject(ERROR_CODES.UNATHORIZED);
      }
    });

  });
}

/**
 * Join to chat
 * @login_required
 * @param {number} object.lead_id
 * @param {number} object.conversation_id
 *
 * RESOLVE
 *  "chat": {
 *    "id": 88,
 *    "members": [
 *      {
 *        "id": 127,
 *        "user_id": 1379,
 *        "role": 1,
 *        "name": "happierall"
 *      }
 *    ],
 *    "recent_message": {
 *      "conversation_id": 88,
 *      "user_id": 127,
 *      "parts": [
 *        {
 *          "content": "Все работает",
 *          "mime_type": "text/plain"
 *        }
 *      ],
 *      "created_at": 1461845250,
 *      "id": 663,
 *      "user": {
 *        "id": 127,
 *        "user_id": 1379,
 *        "role": 1,
 *        "name": "happierall"
 *      }
 *    }
 *  },
 *  "member": {
 *    "id": 127,
 *    "user_id": 1379,
 *    "role": 1,
 *    "name": "happierall"
 *  }
 *
 * REJECT (one of ERROR_CODES) {UNATHORIZED, NOT_EXISTS}
 */
export function join({ lead_id, conversation_id }) {

  return new Promise( (resolve, reject) => {

    channel.req("join", "chat", { lead_id, conversation_id }).then( data => {
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

    channel.req("call_customer", "chat", { lead_id }).then( data => {
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

    channel.req("call_supplier", "chat", { lead_id }).then( data => {
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