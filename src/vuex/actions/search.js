import * as tagsService from 'services/tags';
import * as types from '../mutation-types';
import { selectedTagsId } from 'vuex/getters/search.js';

export const setSearchValue = ( { dispatch }, value ) => {

  dispatch( types.SET_SEARCH_VALUE, value );

};

export const loadTags = ( { dispatch, state } ) => {

  dispatch( types.SEARCH_SET_PENDING, true );

  return tagsService
    .find( { tags: selectedTagsId( state ) } )
    .then( tags => {
      dispatch( types.RECEIVE_TAGS, tags );
      dispatch( types.SEARCH_SET_PENDING, false );
    } );

};

export const selectTag = ( store, tag, clear ) => {
  
  if ( clear === true ) {

    store.dispatch( types.CLEAR_SEARCH );

  }

  if ( tag.active ) {

    store.dispatch( types.REMOVE_TAG, tag );

  } else {

    store.dispatch( types.SELECT_TAG, tag );

  }

  return loadTags( store );

};

export const removeTag = ( store, tag ) => {

  store.dispatch( types.REMOVE_TAG, tag );

  return loadTags( store );

};

export const clearSearch = ( store ) => {

  store.dispatch( types.CLEAR_SEARCH );

  return loadTags( store );

};

