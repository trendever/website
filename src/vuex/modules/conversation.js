import {
  SET_CONVERSATION,
  RECEIVE_MESSAGE,
  LOAD_MESSAGE,
  UPDATE_CHAT_MEMBERS,
  SET_SHOW_STATUS_MENU,
  SET_SHOW_MENU,
  CLOSE_CONVERSATION,
  SET_STATUS
} from '../mutationTypes/conversation';

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
  [SET_CONVERSATION] ( state, id, members, messages, lead ) {
    state.id       = id;
    state.members  = members;
    state.messages = messages;
    state.lead = lead;
  },
  [RECEIVE_MESSAGE] ( state, messages ) {
    state.messages = state.messages.concat( messages );
  },
  [LOAD_MESSAGE] ( state, messages ) {
    state.messages = messages.concat( state.messages );
  },
  [UPDATE_CHAT_MEMBERS] (state, members) {
    state.members = members;
  },
  [SET_SHOW_STATUS_MENU] ( state, showStatusMenu ) {
    state.showStatusMenu = showStatusMenu;
  },
  [SET_SHOW_MENU] ( state, showMenu ) {
    state.showMenu = showMenu;
    state.showStatusMenu = false;
  },
  [CLOSE_CONVERSATION] ( state ) {
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
  [SET_STATUS] ( state, status ) {
    state.lead.status = status;
    state.showStatusMenu = false;
  },

};

export default {
  state,
  mutations
};
