import * as types from '../mutation-types';
import * as products from 'services/products.js';
import { searchValue, selectedTags } from 'vuex/getters';

export const forceLoadProducts = ( { dispatch, state }, isSearch, isTags ) => {

  const request = {
    q: null,
    tags: null,
    limit: state.products.ITEMS_PER_PAGE,
    offset: null,
    instagram_name: null,
    user_id: null
  };

  if ( isSearch ) {

    const q = searchValue( state );

    if (typeof q === 'string') {
      
      request.q = q.trim();
      
    }

  }

  if ( isTags ) {
    
    const tags = selectedTags(state).map(tag => tag.id);

    if(tags) {

      request.tags = tags;

    }
    
  }

  return products
    .find( request )
    .then( data => {
      dispatch( types.PRODUCTS_FORCE_RECEIVE, data.object_list );
    } )
    .catch( ( error ) => {
      products.sendError( error, state );
    } );

};

export const setListId = ( { dispatch }, listId ) => {

  dispatch( types.PRODUCTS_SET_LIST_ID, listId );

};

export const setProductId = ( { dispatch, state }, id ) => {

  dispatch( types.PRODUCTS_SET_PRODUCT_ID, id );

};

export const enableInfinityProducts = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_SET_INFINITY, true );

};

export const setColumnNumber = ( { dispatch }, columnNumber ) => {

  dispatch( types.PRODUCTS_SET_COLUMN_NUMBER, columnNumber );

};

export const setScrollTop = ( { dispatch }, scrollTop ) => {

  dispatch( types.PRODUCTS_SET_SCROLL_TOP, scrollTop );

};

export const incLengthList = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_INC_LENGTH_LIST );

};

export const productsClose = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_CLOSE );

};
