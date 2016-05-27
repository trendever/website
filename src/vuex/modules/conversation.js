import {
  CONVERSATION_SET,
  CONVERSATION_RECEIVE_MESSAGE,
  CONVERSATION_LOAD_MESSAGE,
  CONVERSATION_SET_SHOW_MENU,
  CONVERSATION_SET_SHOW_STATUS_MENU,
  CONVERSATION_AFTER_LOAD_IMG,
  CONVERSATION_CLOSE,
  CONVERSATION_INC_LENGTH_LIST
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
  lengthList: 12
};

// mutations
const mutations = {

  [CONVERSATION_SET] ( state, id, messages = null, lengthList = 20 ) {

    if ( !state.all.hasOwnProperty( id ) ) {
      state.all[ id ]     = [];
      state.allInit[ id ] = false;
    }

    if ( Array.isArray( messages ) ) {

      state.all[ id ] = messages;

    } else {

      state.all[ id ] = [];

    }

    state.allInit[ id ] = true;
    state.id            = id;
    state.done          = true;
    state.lengthList    = lengthList;

  },

  [CONVERSATION_RECEIVE_MESSAGE] ( state, messages, id ) {

    const { all } = state;

    if ( all.hasOwnProperty( id ) ) {

      for ( let i = all[ id ].length; i; i-- ) {
        if ( all[ id ][ i - 1 ].id === messages[ 0 ].id ) {
          return;
        }
      }

      state.all = Object.assign( {}, all, { [id]: all[ id ].concat( messages ) } );

    } else {

      state.all = Object.assign( {}, all, { [id]: messages } );

    }

  },

  [CONVERSATION_LOAD_MESSAGE] ( state, messages ) {

    const { id, all } = state;

    if ( all.hasOwnProperty( id ) ) {

      state.all = Object.assign( {}, all, { [id]: messages.concat( all[ id ] ) } );

    } else {

      state.all = Object.assign( {}, all, { [id]: messages } );

      console.warn( 'При загрузке старых сообщений должены уже быть сообщения ', { id, all } );

    }

  },

  [CONVERSATION_INC_LENGTH_LIST] ( state, lengthList = 12 ) {

    state.lengthList = state.lengthList + lengthList;
    
  },

  [CONVERSATION_AFTER_LOAD_IMG] ( state, beforeLoadId, newMessage ) {
    state.messages.forEach( ( message ) => {

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
  },

  [CONVERSATION_SET_SHOW_STATUS_MENU] ( state, showStatusMenu ) {
    state.showStatusMenu = showStatusMenu;
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
