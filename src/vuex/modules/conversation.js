import {
  CONVERSATION_SET,
  CONVERSATION_RECEIVE_MESSAGE,
  CONVERSATION_LOAD_MESSAGE,
  CONVERSATION_UPDATE_MEMBERS,
  CONVERSATION_SET_SHOW_MENU,
  CONVERSATION_SET_SHOW_STATUS_MENU,
  CONVERSATION_SET_STATUS,
  CONVERSATION_AFTER_LOAD_IMG,
  CONVERSATION_UPDATE_MESSAGE_BY_LEAD,
  CONVERSATION_CLOSE
} from '../mutation-types';

// initial state
const state = {
  done: false,
  members: null,
  messages: null,
  lead: null,

  all:{
    /**
     * 1: messages
     * */
  },

  id: null,
  showMenu: false,
  showStatusMenu: false,
};

// mutations
const mutations = {
  [CONVERSATION_SET] ( state, id, members, messages, lead ) {
    state.id       = id;
    state.members  = members;
    state.messages = messages;
    state.lead = lead;
  },
  /**
   *
   *   [CONVERSATION_SET] ( state, id, messages ) {
    state.id = id;
    if ( !state.all.hasOwnProperty( id ) ) {
      state.all[ id ] = messages;
    }
  },
   * */
  [CONVERSATION_RECEIVE_MESSAGE] ( state, messages ) {
    for ( let i = state.messages.length; i; i-- ) {
      if ( state.messages[ i - 1 ].id === messages[ 0 ].id ) {
        return;
      }
    }
    state.messages = state.messages.concat( messages );
  },
  [CONVERSATION_UPDATE_MESSAGE_BY_LEAD] ( messages, lead ) {

  },
  [CONVERSATION_LOAD_MESSAGE] ( state, messages ) {
    state.messages = messages.concat( state.messages );
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
  [CONVERSATION_UPDATE_MEMBERS] (state, members) {
    state.members = members;
  },
  [CONVERSATION_SET_SHOW_STATUS_MENU] ( state, showStatusMenu ) {
    state.showStatusMenu = showStatusMenu;
  },
  [CONVERSATION_SET_SHOW_MENU] ( state, showMenu ) {
    state.showMenu = showMenu;
    state.showStatusMenu = false;
  },
  /**
   * Установка статуса LEAD происходит в диалоге и в списке лидов/диалогов.
   * по этому используется одна переменная для описания обоих мутаций.
   * Мутации разные в диалоге лид это объект, а в списке лидов/диалогов это массив.
   * */
  [CONVERSATION_SET_STATUS] ( state, status ) {
    state.lead.status = status;
    state.showStatusMenu = false;
    state.showMenu = false;
  },
  [CONVERSATION_CLOSE] ( state ){
    state.id             = null;
    state.showMenu       = false;
    state.showStatusMenu = false;
  }
};

export default {
  state,
  mutations
};
