import {
  SET_CONVERSATION,
  RECEIVE_MESSAGE,
  LOAD_MESSAGE,
  UPDATE_CHAT_MEMBERS,
  SET_SHOW_STATUS_MENU,
  SET_SHOW_MENU,
  INCREMENT_CHAT_NOTIFY_COUNT,
  CLEAR_CHAT_NOTIFY_COUNT,
  CLOSE_CONVERSATION
  //  CREATE_MESSAGE,
} from '../mutation-types';
import {
  SET_STATUS
} from '../mutationTypes/lead';
// initial state
const state = {
  notice: {},
  id: null,
  members: null,
  messages: null,
  lead: null,
  notify_count: null,
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
  [INCREMENT_CHAT_NOTIFY_COUNT] (state) {
    state.notify_count += 1;
  },
  [CLEAR_CHAT_NOTIFY_COUNT] (state) {
    state.notify_count = 0;
  },
  [CLOSE_CONVERSATION] ( state ) {
    state.id= null;
    state.members= null;
    state.messages= null;
    state.notify_count= null;
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
  /*  [CREATE_MESSAGE] ( state, messages ) {
   state.messages = state.messages.concat( messages );
   },*/
};

export default {
  state,
  mutations
};