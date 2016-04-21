import {
  SET_SEARCH_VALUE,
  RECEIVE_TAGS,
  SELECT_TAG,
  REMOVE_TAG,
  CLEAR_SEARCH
} from '../mutation-types';


const state = {
  value: '',
  selectedTags: [],
  tags: []
};

const mutations = {
  [SET_SEARCH_VALUE] (state, value) {
    state.value = value;
  },
  
  [RECEIVE_TAGS] (state, tags) {
    state.tags = tags;
  },

  [SELECT_TAG] (state, tag) {
    if(!state.selectedTags.find(it => it.id === tag.id)) {
      state.selectedTags.push(tag);
    }
  },

  [REMOVE_TAG] (state, tag) {
    state.selectedTags.$remove(tag);
  },

  [CLEAR_SEARCH] (state) {
    state.value = '';
    state.selectedTags = [];
  }
};

export default {
  state,
  mutations
};