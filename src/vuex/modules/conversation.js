import {
  CONVERSATION_SET,
  CONVERSATION_RECEIVE_MESSAGE,
  CONVERSATION_LOAD_MESSAGE,
  CONVERSATION_SET_SHOW_MENU,
  CONVERSATION_SET_SHOW_STATUS_MENU,
  CONVERSATION_CONFIRM_MSG,
  CONVERSATION_CONFIRM_STATUS_MSG,
  CONVERSATION_CLOSE,
  CONVERSATION_SEND_STATUS,
  CONVERSATION_INC_LENGTH_LIST,
  CONVERSATION_OPEN_IMG_POPUP,
  CONVERSATION_SET_ACTION
} from '../mutation-types';

// initial state
const state = {

  all: {
    /**
     * 1: messages
     * */
  },

  allInit: {
    /**
     * 1: bool
     * */
  },

  id: null,
  done: false,
  showMenu: false,
  showStatusMenu: false,
  lengthList: 50,
  imgPopUpUrl: false,
  imgWidth: 0,
  imgHeight: 0,
  action: ''
};

function getDateMessage( date, id ) {
  return {
    serviceMessage: true,
    conversation_id: null,
    parts: [ {
      content: JSON.stringify( {
        type: "lead.state.date",
        value: date
      } ),
      mime_type: "json/status"
    } ],
    created_at: date,
    id
  }
}

const addServiceMessage = (function() {

  function normalizeDate( time ) {

    return new Date( time * 1000 );

  }

  let lastDate = null;

  return ( messages ) => {

    console.time( 'addServiceMessage' );

    let lastUserId   = null;
    const newMessage = [];

    lastDate = normalizeDate( messages[ 0 ].created_at ).getDate();

    newMessage.push( getDateMessage( messages[ 0 ].created_at, messages[ 0 ].id ) );

    for ( let i = 0; i < messages.length; i++ ) {

      const MIME = messages[ i ].parts[ 0 ].mime_type;

      /**
       * Для отключения какого нибудь MIME типа просто убрать из условия.
       * Сейчас убрат статус: MIME === 'json/status'
       * */

      if (
        MIME === 'text/plain' ||
        MIME === 'text/json' ||
        MIME === 'image/json' ||
        MIME === 'json/status' ||
        MIME === 'text/html' ||
        MIME === 'image/base64' ||
        MIME === 'json/order' ||
        MIME === 'json/payment'
      ) {

        if ( MIME !== 'json/status' ) {

          if ( lastUserId === messages[ i ].user.user_id ) {

            messages[ i ].closestMessage = true;

          } else {

            lastUserId                   = messages[ i ].user.user_id;
            messages[ i ].closestMessage = false;

          }

        }

        if ( messages[ i ].created_at !== null ) {

          const date = normalizeDate( messages[ i ].created_at );

          if ( date.getDate() !== lastDate ) {

            lastDate = date.getDate();

            newMessage.push( getDateMessage( messages[ i ].created_at, messages[ i ].id ) );

          }

        }

        if ( typeof messages[ i ].serviceMessage === 'undefined' ) {

          if ( MIME === 'json/status' ) {

            const { type } = JSON.parse( messages[ i ].parts[ 0 ].content );

            if(type === 'suplier.called' || type === 'customer.called' || type === 'customer.phone.added'){

              newMessage.push( messages[ i ] );

            }

          } else {

            newMessage.push( messages[ i ] );

          }

        }

        if ( newMessage[ i ] ) {

          if ( newMessage[ i ].parts[ 0 ].mime_type === 'json/status' || newMessage[ i ].serviceMessage ) {

            if ( newMessage.length !== (i + 1) ) {

              if ( newMessage[ i + 1 ].parts[ 0 ].mime_type !== 'json/status' || !newMessage[ i + 1 ].serviceMessage ) {

                newMessage[ i + 1 ].afterServiceMessage = true;

              }

            }

          }

        }

      }

    }

    console.timeEnd( 'addServiceMessage' );

    return newMessage;

  };

})();

// mutations
const mutations = {

  [CONVERSATION_SET] ( state, id, messages = null, lengthList = 50 ) {

    if ( !state.all.hasOwnProperty( id ) ) {
      state.all[ id ]     = [];
      state.allInit[ id ] = false;
    }

    if ( Array.isArray( messages ) ) {

      state.all[ id ] = addServiceMessage( messages );

    } else {

      state.all[ id ] = [];

    }

    state.allInit[ id ] = true;
    state.id            = id;
    state.done          = true;
    state.lengthList    = lengthList;

  },

  [CONVERSATION_LOAD_MESSAGE] ( state, messages ) {

    const { id, all } = state;

    if ( all.hasOwnProperty( id ) ) {

      state.all = Object.assign( {}, all, { [id]: addServiceMessage( messages.concat( all[ id ] ) ) } );

    } else {

      state.all = Object.assign( {}, all, { [id]: addServiceMessage( messages ) } );

      console.warn( 'При загрузке старых сообщений должены уже быть сообщения ', { id, all } );

    }

  },

  [CONVERSATION_RECEIVE_MESSAGE] ( state, messages, id ) {

    console.time( 'CONVERSATION_RECEIVE_MESSAGE' );

    const { all } = state;

    if ( all.hasOwnProperty( id ) ) {
      for ( let i = all[ id ].length; i; i-- ) {
        if ( all[ id ][ i - 1 ].id === messages[ 0 ].id ) {
          return;
        }
      }

      //fix double messages
      if(messages[ 0 ].created_at === null){
        return;
      }

      state.all = Object.assign( {}, all, { [id]: addServiceMessage( all[ id ].concat( messages ) ) } );

    } else {

      state.all = Object.assign( {}, all, { [id]: addServiceMessage( messages ) } );

    }

    console.timeEnd( 'CONVERSATION_RECEIVE_MESSAGE' );

  },

  [CONVERSATION_CONFIRM_MSG] ( state, beforeLoadId, newMessage, id ) {

    if ( state.all.hasOwnProperty( id ) ) {

      state.all[ id ].forEach( ( message ) => {

        if ( 'beforeLoadId' in message ) {

          if ( beforeLoadId === message.beforeLoadId ) {

            message.loaded          = true;
            message.conversation_id = newMessage.conversation_id;
            message.user_id         = newMessage.user_id;
            message.created_at      = newMessage.created_at;
            message.id              = newMessage.id;
            message.user            = newMessage.user;
            message.parts           = newMessage.parts;

          }

        }

      } );

    } else {

      console.warn( '[ CONVERSATION_CONFIRM_MSG ]: Нет такого объекта с сообщениями.', {
        state,
        beforeLoadId,
        newMessage,
        id
      } );

    }

  },

  [CONVERSATION_CONFIRM_STATUS_MSG] ( state, messages, id ){

    console.time( 'CONVERSATION_CONFIRM_STATUS_MSG' );

    if ( Array.isArray( messages ) ) {

      if ( state.all.hasOwnProperty( id ) ) {

        const items = state.all[ id ];

        for ( let i = items.length; i; i-- ) {

          const message = items[ i - 1 ];
                                                                //fast fix double status msg
          if ( message.parts[ 0 ].mime_type === 'json/status' /*&& message.dirty*/ ) {

            if ( JSON.parse( message.parts[ 0 ].content ).value === JSON.parse( messages[ 0 ].parts[ 0 ].content ).value ) {

              state.all[ id ].$set( i - 1, messages[ 0 ] );

              state.all = Object.assign( {}, state.all, { [id]: addServiceMessage( state.all[ id ] ) } );

              return null;

            }

          }

        }

        state.all = Object.assign( {}, state.all, { [id]: addServiceMessage( items.concat( messages ) ) } );

      } else {

        state.all = Object.assign( {}, state.all, { [id]: addServiceMessage( messages ) } );

      }

    }

    console.timeEnd( 'CONVERSATION_CONFIRM_STATUS_MSG' );

  },

  [CONVERSATION_INC_LENGTH_LIST] ( state, lengthList = 12 ) {
    state.lengthList = state.lengthList + lengthList;
  },

  [CONVERSATION_SET_SHOW_STATUS_MENU] ( state, showStatusMenu ) {
    state.showStatusMenu = showStatusMenu;
  },

  [CONVERSATION_OPEN_IMG_POPUP] ( state, url, width, height ){

    state.imgPopUpUrl = url;
    state.imgWidth    = width;
    state.imgHeight   = height;

  },

  [CONVERSATION_SEND_STATUS] ( state ) {
    state.showMenu       = false;
    state.showStatusMenu = false;
  },

  [CONVERSATION_SET_SHOW_MENU] ( state, showMenu ) {
    state.showMenu       = showMenu;
    state.showStatusMenu = false;
  },

  [CONVERSATION_CLOSE] ( state ) {
    state.id             = null;
    state.done           = false;
    state.showMenu       = false;
    state.showStatusMenu = false;
  },
  [CONVERSATION_SET_ACTION] (state, value) {
    state.action = value;

  }

};

export default {
  state,
  mutations
};
