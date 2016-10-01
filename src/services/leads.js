import channel from 'services/channel/channel.js';
//import leadsCache from 'cache/leads';

export const ERROR_CODES = {
  NOT_EXISTS: 1,
  FORBIDDEN: 2,

  // Local
  UNATHORIZED: 3,
  OBJECT_NOT_EXIST: 4,
};

export function sendError( errorCode, state = null ) {
  switch ( errorCode ) {
    case ERROR_CODES.FORBIDDEN:
      console.error( new Error( `Lead error: [ FOBIDDEN ]` ), state );
      return false;
    case ERROR_CODES.NOT_EXISTS:
      console.error( new Error( `Lead error: [ NOT_EXISTS ]` ), state );
      return false;
    case ERROR_CODES.UNATHORIZED:
      console.error( new Error( `Lead error: [ UNATHORIZED ]` ), state );
      return false;
    case ERROR_CODES.OBJECT_NOT_EXIST:
      console.error( new Error( `Lead error: [ OBJECT_NOT_EXIST ]` ), state );
      return false;
    default:
      return true;
  }
}

export const USER_ROLES = {
  UNKNOWN: {name: 'НЛО', key: 0},
  CUSTOMER: {name: 'Покупатель', key: 1},
  SUPPLIER: {name: 'Поставщик', key: 2},
  SELLER: {name: 'Продавец', key: 3},
  SUPER_SELLER: {name: 'Супер продавец', key: 4},
};

export const getRole = key => {
  for (let [, value] of Object.entries(USER_ROLES)) {
    if (value.key === key) {
      return value;
    }
  }
};

export const STATUSES = {
  //this status means we created a lead in db,
  // but did not perform any predefined actions
  EMPTY: {name: 'Пустой', key: 0},
  NEW: {name: 'Новый', key: 1},
  IN_PROGRESS: {name: 'В процессе', key: 2},
  SUBMITTED: {name: 'Подтвержден', key: 3},
  ON_DELIVERY: {name: 'На доставке', key: 4},
  COMPLETED: {name: 'Выполнен', key: 5},
  CANCELLED: {name: 'Отменен', key: 6},
};

export const getStatus = key => {
  for (let [, value] of Object.entries(STATUSES)) {
    if (value.key === key) {
      return value;
    }
  }
};

export const getStatusCode = key => {
  return STATUSES[ key ].key;
};

export const STATUS_EVENTS = [
  {name: 'Новый', key:'CREATE'},
  {name: 'В процессе', key:'PROGRESS'},
  {name: 'Подтвержден', key:'SUBMIT'},
  {name: 'На доставке', key:'DELIVERY'},
  {name: 'Выполнен', key:'COMPLETE'},
  {name: 'Отменен', key:'CANCEL'},
];


/**
 * List of user leads
 * @login_required
 * @param  {number} options.limit
 * @param  {number} options.from_lead_id
 * @param  {string} options.roles   list with comma
 *
 * RESOLVE
 *  'customer': [
 *      {
 *        'id': 91,
 *        'source': 'website',
 *        'customer_id': 1379,
 *        'products': [
 *          {
 *            'id': 17639,
 *            'code': 'tf9761',
 *            'instagram_image_caption': 'Кроссовки Asics gel lite 3, за 7500 руб',
 *            'instagram_image_id': '1226621682111654014_3108795937',
 *            'instagram_image_url':
 *   'http://scontent-amt2-1.cdninstagram.com/t51.2885-15/e35/12976548_1777021972528091_1983540821_n.jpg?se=8&ig_cache_key=MTIyNjYyMTY4MjExMTY1NDAxNA%3D%3D.2',
 *            'instagram_link': 'https://www.instagram.com/p/BEF1evEDqh-/',
 *            'instagram_published_at': 1460444700,
 *            'supplier_id': 3603,
 *            'supplier': {},
 *            'mentioned_id': 3655,
 *            'mentioned': {},
 *            'isSale': true,
 *            'items': [
 *              {
 *                'name': 'Кросовки',
 *                'price': 7500
 *              }
 *            ]
 *          }
 *        ],
 *        'customer': {
 *          'id': 1379,
 *          'instagram_id': 1482392154,
 *          'instagram_username': 'happierall',
 *          'instagram_fullname': 'Руслан Янбердин',
 *          'instagram_avatar_url':
 *   'https://scontent.cdninstagram.com/t51.2885-19/10932407_823916984341993_1645923981_a.jpg',
 *          'instagram_caption': 'Hi all'
 *        },
 *        'status': 1,
 *        'user_role': 1,
 *        'shop': {
 *          'id': 3603,
 *          'instagram_id': 3108795937,
 *          'instagram_username': 'dev_supplier',
 *          'instagram_fullname': 'Dev Shop',
 *          'instagram_avatar_url':
 *   'http://scontent-amt2-1.cdninstagram.com/t51.2885-19/s150x150/12677376_196270977423905_1508709347_a.jpg'
 *        },
 *        'chat': {
 *          'id': 91,
 *          'members': [
 *            {
 *              'id': 131,
 *              'user_id': 3653,
 *              'role': 3,
 *              'name': 'seller_1',
 *              'last_message_id': 722
 *            },
 *          ],
 *          'unread_count': 2,
 *          'recent_message': {
 *            'conversation_id': 91,
 *            'user_id': 130,
 *            'parts': [
 *              {
 *                'content': 'test',
 *                'mime_type': 'text/plain'
 *              }
 *            ],
 *            'created_at': 1461907197,
 *            'id': 722,
 *            'user': {
 *              'id': 130,
 *              'user_id': 1379,
 *              'role': 1,
 *              'name': 'happierall',
 *              'last_message_id': 698
 *            }
 *          }
 *        }
 *      }
 *    ],
 *    'seller': []
 *  }
 * REJECT (one of ERROR_CODES) {UNATHORIZED}
 */
export function find( limit, from_updated_at, roles, direction = false ) {

  //const cacheData = leadsCache.find( limit, from_updated_at, roles );

  return new Promise( (resolve, reject) => {

/*    if ( cacheData !== null ) {
      return resolve(cacheData);
    }*/
    channel.req('list', 'lead', { limit, from_updated_at, roles, direction }).then( data => {
/*      if ( cacheData === null ) {
        leadsCache.addItem(data.response_map, roles);
      }*/
      resolve(data.response_map);

    }).catch( error => {
      if (error.log_map.code_key === '403') {
        reject(ERROR_CODES.UNATHORIZED);
      }
      console.log('Lead list err:', error);
    });

  });
}

/**
 * Get lead by lead_id or conversation_id
 * @param  {number} options.lead_id
 * @param  {number} options.conversation_id
 * RESOLVE
 *  lead: {
 *      'id': 1,
 *      'source': 'website',
 *      'customer_id': 1379,
 *      'status': 3,
 *      'user_role': 1,
 *      'conversation_id': 1,
 *      'products': [
 *        {
 *          'id': 17622,
 *          'title': 'Тестовый товар #2 (17622)',
 *          'code': 'tf9744',
 *          'instagram_image_caption': 'Минимализм в лучшем виде 💗✌️Этот комбинезон вы сможете найти по ссылке в
 *   профиле 😊 RG: @syanafromparis',
 *          'instagram_image_id': '1223302707884078653',
 *          'instagram_image_url':
 *   'https://scontent.cdninstagram.com/l/t51.2885-15/s480x480/e35/12965842_803674876433752_380340161_n.jpg?ig_cache_key=MTIyMzMwMjcwNzg4NDA3ODY1Mw%3D%3D.2',
 *          'instagram_link': 'https://www.instagram.com/p/BD6C1TcNDY9/',
 *          'instagram_published_at': -62135596800,
 *          'supplier_id': 129,
 *          'supplier': {},
 *          'mentioned_id': 1996,
 *          'mentioned': {},
 *          'isSale': true,
 *          'items': [
 *            {
 *              'name': 'Ветровка'
 *            },
 *          ]
 *        },
 *      ],
 *      'customer': {
 *        'id': 1379,
 *        'instagram_id': 1482392154,
 *        'instagram_username': 'happierall',
 *        'instagram_fullname': 'Руслан Янбердин',
 *        'instagram_avatar_url':
 *   'https://scontent.cdninstagram.com/t51.2885-19/10932407_823916984341993_1645923981_a.jpg',
 *        'instagram_caption': 'Hi all'
 *      },
 *      'shop': {
 *        'id': 129,
 *        'instagram_id': 1552963340,
 *        'instagram_username': 'asos_ru',
 *        'instagram_fullname': '(TEST 1) ASOS Russia',
 *        'instagram_avatar_url':
 *   'https://scontent.cdninstagram.com/t51.2885-19/s150x150/11262572_227962937541098_815996954_a.jpg',
 *        'instagram_caption': 'Добро пожаловать на официальную страницу ASOS Russia, где вы откроете для себя мир моды
 *   онлайн. Присоединяйтесь!'
 *      },
 *      'chat': {
 *        'id': 7,
 *        'members': [
 *          {
 *            'id': 11,
 *            'user_id': 1379,
 *            'role': 1,
 *            'name': 'happierall'
 *          }
 *        ],
 *        'unread_count': 4,
 *        'recent_message': {
 *          'conversation_id': 7,
 *          'user_id': 12,
 *          'parts': [
 *            {
 *              'content': 'Hello world',
 *              'mime_type': 'text/plain'
 *            }
 *          ],
 *          'created_at': 1461110215,
 *          'id': 147,
 *          'user': {
 *            'id': 12,
 *            'user_id': 3653,
 *            'role': 3
 *          }
 *        }
 *      }
 *    },
 *
 *    messages: [
 *      {
 *        'conversation_id': 89,
 *        'user_id': 128,
 *        'parts': [
 *          {
 *            'content': 'Hi all',
 *            'mime_type': 'text/plain'
 *          }
 *        ],
 *        'created_at': 1461939232,
 *        'id': 738,
 *        'user': {
 *          'id': 128,
 *          'user_id': 1379,
 *          'role': 1,
 *          'name': 'happierall',
 *          'last_message_id': 693
 *        }
 *      }
 *    ]
 *
 * REJECT (one of ERROR_CODES) {OBJECT_NOT_EXIST, UNATHORIZED}
 */
export function get({ lead_id, conversation_id }) {

  return new Promise( (resolve, reject) => {

    channel.req('retrieve', 'lead', { lead_id, conversation_id })
    .then( data => {
      resolve(data.response_map);
    }).catch( error => {
      if (error.log_map.code_key === '403') {
        reject(ERROR_CODES.UNATHORIZED);
      } else if (error.log_map.code_key === '404') {
        reject(ERROR_CODES.OBJECT_NOT_EXIST);
      } else if (error.log_map.code_key === '400') {
        reject(ERROR_CODES.FORBIDDEN);
      }
      console.log('Lead retrieve err:', error);
    });

  });
}


/**
 * Create lead
 * @param  {number} product_id
 *
 * RESOLVE {object} of lead (see struct in get or find)
 * REJECT (one of ERROR_CODES) {OBJECT_NOT_EXIST, UNATHORIZED}
 */
export function create(product_id) {

  return new Promise( (resolve, reject) => {

    channel.req('create', 'lead', {id: product_id})
    .then( data => {
      resolve(data.response_map.lead);
    }).catch( error => {
      if (error.log_map.code_key === '400') {
        reject(ERROR_CODES.OBJECT_NOT_EXIST);
      } else if (error.log_map.code_key === '403') {
        reject(ERROR_CODES.UNATHORIZED);
      }
    });

  });
}


/**
 * Change lead status
 * @param  {number} lead_id
 * @param  {string} event     key of LEAD_STATUS_EVENTS
 *
 * RESOLVE
 * {
 *   id: 10
 *   source: @dev_want
 *   customer_id: 3592
 *   instagram_pk: nYSh0ZDlrCv/+1KcpCsXNeMIGlU=
 *   status: 1
 *   conversation_id: 19
 * }
 *
 * REJECT (one of ERROR_CODES) {FORBIDDEN, UNATHORIZED}
 */
export function setEvent(lead_id, event, cancel_reason) {

  return new Promise( (resolve, reject) => {

    channel.req('event', 'lead', {lead_id, event, cancel_reason})
    .then( data => {
      resolve(data.response_map.lead);
    }).catch( error => {

      if (error.log_map.code_key === '400') {
        // Not exists or forbiden
        reject(ERROR_CODES.FORBIDDEN);
      } else if (error.log_map.code_key === '403') {
        reject(ERROR_CODES.UNATHORIZED);
      }
    });

  });
}

/**
 * Listen when status changed notify received
 * @param  {function} handler    call it func when fired event
 */
/*
export function onChangeStatus(handler) {
  channel.on('RETRIEVED', 'lead', handler);
}

export function removeStatusListener(handler) {
  channel.off('RETRIEVED', 'lead', handler);
}
 */
