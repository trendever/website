import {
  SET_CONVERSATION,
  RECEIVE_MESSAGE,
  LOAD_MESSAGE,
  CHANGED_LEAD_STATUS,
//  CREATE_MESSAGE,
  CLOSE_CONVERSATION,
  SET_SHOW_STATUS_MENU,
  SET_SHOW_MENU,
  INCREMENT_CHAT_NOTIFY_COUNT,
  CLEAR_CHAT_NOTIFY_COUNT,
  UPDATE_CHAT_MEMBERS
} from '../mutation-types';

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
  [LOAD_MESSAGE] ( state, messages ) {
    state.messages = messages.concat( state.messages );
  },
  [RECEIVE_MESSAGE] ( state, messages ) {
    state.messages = state.messages.concat( messages );
  },
/*  [CREATE_MESSAGE] ( state, messages ) {
    state.messages = state.messages.concat( messages );
  },*/
  [CLOSE_CONVERSATION] ( state ) {
    state = {
      id: null,
      members: null,
      messages: null,
      notify_count: null,
      lead: null,
    };
  },
  [UPDATE_CHAT_MEMBERS] (state, members) {
    state.members = members;
  },
  [CHANGED_LEAD_STATUS] ( state, status ) {
    state.lead.status = status;
    state.showStatusMenu = false;
  },
  [SET_SHOW_STATUS_MENU] ( state, showStatusMenu ) {
    state.showStatusMenu = showStatusMenu;
  },
  [SET_SHOW_MENU] ( state, showMenu ) {
    state.showMenu = showMenu;
    state.showStatusMenu = false;
  },
  // TODO Подумать на этим.
  [INCREMENT_CHAT_NOTIFY_COUNT] (state) {
    state.notify_count += 1;
  },
  [CLEAR_CHAT_NOTIFY_COUNT] (state) {
    state.notify_count = 0;
  },

};

export default {
  state,
  mutations
};
