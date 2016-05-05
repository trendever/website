import {
  SET_CONVERSATION,
  RECEIVE_MESSAGE,
  CLOSE_CONVERSATION,
  INCREMENT_CHAT_NOTIFY_COUNT,
  CLEAR_CHAT_NOTIFY_COUNT,
  RECEIVE_CHAT_MSG,
  UPDATE_CHAT_MEMBERS
} from '../mutation-types';

// initial state
const state = {
  id: null,
  members: null,
  messages: null,
  notify_count: null,
};

// mutations
const mutations = {
  [SET_CONVERSATION] ( state, id, members, messages ) {
    state.id       = id;
    state.members  = members;
    state.messages = messages;
  },
  [RECEIVE_MESSAGE] ( state, messages ) {
    console.log(messages);
    state.messages = messages.concat( state.messages );
  },
  [CLOSE_CONVERSATION] ( state ) {
    state = {
      id: null,
      members: null,
      messages: null,
      notify_count: null,
    };
  },
  [INCREMENT_CHAT_NOTIFY_COUNT] (state) {
    state.notify_count += 1;
  },
  [CLEAR_CHAT_NOTIFY_COUNT] (state) {
    state.notify_count = 0;
  },
  [RECEIVE_CHAT_MSG]( state, message ) {
    state.messages.push( message );
  },
  [UPDATE_CHAT_MEMBERS] (state, members) {
    state.members = members;
  },
};

export default {
  state,
  mutations
};
