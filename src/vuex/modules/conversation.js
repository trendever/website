import {
  CONVERSATION_SET,
  CONVERSATION_RECEIVE_MESSAGE,
  CONVERSATION_LOAD_MESSAGE,
  CONVERSATION_SET_SHOW_MENU,
  CONVERSATION_SET_SHOW_STATUS_MENU,
  CONVERSATION_CONFIRM_MSG,
  CONVERSATION_CLOSE,
  CONVERSATION_SEND_STATUS,
  CONVERSATION_INC_LENGTH_LIST,
} from '../mutation-types';

import { formatMonth } from 'project/chat/utils';

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
  lengthList: 12
};

function getDateMessage( date, id, firstMessage = false ) {
  return {
    firstMessage,
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

const addServiceMessage = (function(){

  let lastDate = null;

  return ( messages ) => {

    console.time('addServiceMessage');

    /**
     * Запоминать последние сутки, если сутки меняются то добавдять сообщение с датой.
     * */

    let lastUserId = null;

    const newMessage = [];

    newMessage.push( getDateMessage( messages[ 0 ].created_at, messages[ 0 ].id, true ) );

    for ( let i = 0; i < messages.length; i++ ) {

      if ( messages[ i ].parts[ 0 ].mime_type === 'text/plain' ) {

        if ( lastUserId === messages[ i ].user.id ) {

          messages[ i ].closestMessage = true;

        } else {

          lastUserId                   = messages[ i ].user.id;
          messages[ i ].closestMessage = false;

        }
      }

      if ( typeof messages[ i ].firstMessage === 'undefined' ) {

        newMessage.push( messages[ i ] );

      }

    }

    console.timeEnd('addServiceMessage');

    return newMessage;

  };

})();

// mutations
const mutations = {

  [CONVERSATION_SET] ( state, id, messages = null, lengthList = 20 ) {

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

    const { all } = state;

    if ( all.hasOwnProperty( id ) ) {

      for ( let i = all[ id ].length; i; i-- ) {
        if ( all[ id ][ i - 1 ].id === messages[ 0 ].id ) {
          return;
        }
      }

      state.all = Object.assign( {}, all, { [id]: addServiceMessage( all[ id ].concat( messages ) ) } );

    } else {

      state.all = Object.assign( {}, all, { [id]: addServiceMessage( messages ) } );

    }

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

  [CONVERSATION_INC_LENGTH_LIST] ( state, lengthList = 12 ) {
    state.lengthList = state.lengthList + lengthList;
  },

  [CONVERSATION_SET_SHOW_STATUS_MENU] ( state, showStatusMenu ) {
    state.showStatusMenu = showStatusMenu;
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
  }

};

export default {
  state,
  mutations
};
