import {
  SET_SEARCH_VALUE,
  RECEIVE_TAGS,
  SELECT_TAG,
  REMOVE_TAG,
  CLEAR_SEARCH,
  SEARCH_SET_PENDING
} from '../mutation-types';

const storeString = localStorage.getItem( 'SEARCH' );

let state = {
  value: '',
  tags: [],
  selected: [],
  pending: true
};

if ( storeString !== null ) {

  state = JSON.parse( localStorage.getItem( 'SEARCH' ) )

}

const mutations = {

  [ SET_SEARCH_VALUE ] ( state, value ) {

    state.value = value;

    localStorage.setItem( 'SEARCH', JSON.stringify( state ) );

  },

  [ RECEIVE_TAGS ] ( state, tags ) {

    state.tags    = tags;
    state.pending = false;

    localStorage.setItem( 'SEARCH', JSON.stringify( state ) );

  },

  [ SEARCH_SET_PENDING ] ( state, pending ) {

    state.pending = pending;

  },

  [ SELECT_TAG ] ( state, { id, name } ) {

    state.tags = state.tags.filter( ( tag ) => {

      if ( tag.id !== id ) {

        return tag;

      }

    } );

    state.selected.push( { id, name, active: true } );

    localStorage.setItem( 'SEARCH', JSON.stringify( state ) );

  },

  [ REMOVE_TAG ] ( state, { id, name } ) {

    state.tags = state.tags.map( ( tag ) => {

      if ( tag.id === id ) {

        return { id, name, active: false }

      } else {

        return tag

      }

    } )

    state.selected = state.selected.filter( ( tag ) => {

      if ( tag.id !== id ) {

        return tag;

      }

    } );

    localStorage.setItem( 'SEARCH', JSON.stringify( state ) );

  },

  [ CLEAR_SEARCH ] ( state ) {

    state.value = '';

    state.selected = [];

    state.tags = state.tags.map( ( { id, name } ) => {

      return { id, name, active: false };

    } );

    localStorage.setItem( 'SEARCH', JSON.stringify( state ) );

  }

};

export default {
  state,
  mutations
};
