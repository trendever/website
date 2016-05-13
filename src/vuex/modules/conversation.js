import {
  CONVERSATION_SET,
  CONVERSATION_RECEIVE_MESSAGE,
  CONVERSATION_LOAD_MESSAGE,
  CONVERSATION_CLOSE,
  CONVERSATION_UPDATE_MEMBERS,
  CONVERSATION_SET_SHOW_MENU,
  CONVERSATION_SET_SHOW_STATUS_MENU,
  CONVERSATION_SET_STATUS
} from '../mutation-types';

// initial state
const state = {
  id: null,
  members: null,
  messages: null,
  lead: null,
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
  [CONVERSATION_RECEIVE_MESSAGE] ( state, messages ) {
    state.messages = state.messages.concat( messages );
  },
  [CONVERSATION_LOAD_MESSAGE] ( state, messages ) {
    state.messages = messages.concat( state.messages );
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
  [CONVERSATION_CLOSE] ( state ) {
    state.id= null;
    state.members= null;
    state.messages= null;
    state.lead= null;
    state.showMenu= false;
    state.showStatusMenu= false;
  },
  /**
   * Установка статуса LEAD происходит в диалоге и в списке лидов/диалогов.
   * по этому используется одна переменная для описания обоих мутаций.
   * Мутации разные в диалоге лид это объект, а в списке лидов/диалогов это массив.
   * */
  [CONVERSATION_SET_STATUS] ( state, status ) {
    state.lead.status = status;
    state.showStatusMenu = false;
  },

};

export default {
  state,
  mutations
};
