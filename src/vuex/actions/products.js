import * as types from '../mutation-types';
import * as products from 'services/products.js';
import { searchValue, selectedTags } from 'vuex/getters';
import { getLastProduct, getLengthList, getProducts, getProduct, hasMore } from '../getters/products.js';

export const getSearchOptions = (
  { state },
  { isSearch, isTags, filterByUserName, filterByUserId },
  force = false
) => {

  const request = {
    q: null,
    from_id: null,
    tags: null,
    limit: state.products.ITEMS_PER_PAGE,
    offset: null,
    instagram_name: null,
    user_id: null
  };

  if ( !force ) {

    const lastProduct = getLastProduct( state );

    if ( lastProduct !== null ) {

      request.from_id = lastProduct.id

    }

  }

  if ( isSearch ) {

    const q = searchValue( state );

    if ( typeof q === 'string' ) {

      request.q = q.trim();

    }

  }

  if ( isTags ) {

    const tags = selectedTags( state ).map( tag => tag.id );

    if ( tags ) {

      request.tags = tags;

    }

  }

  if ( filterByUserName ) {

    request.instagram_name = filterByUserName;

  }

  if ( filterByUserId ) {

    request.user_id = filterByUserId;

  }

  return request;

};

export const loadProducts = (
  { dispatch, state },
  { isSearch, isTags, filterByUserName, filterByUserId },
  force = false
) => {

  dispatch( types.PRODUCTS_LOADING, true );

  return new Promise( ( resolve, reject ) => {

    const items = getProducts( state );

    if ( items === null || force ) {

      products
        .find( getSearchOptions( { state }, { isSearch, isTags, filterByUserName, filterByUserId }, force ) )
        .then( data => {

          if ( force ) {

            dispatch( types.PRODUCTS_FORCE_RECEIVE, data.object_list );

          } else {

            dispatch( types.PRODUCTS_RECEIVE, data.object_list );

          }

          resolve();

        } )
        .catch( ( error ) => {
          products.sendError( error, { state, isSearch, isTags, filterByUserName, filterByUserId } );
          reject(error);
        } );

    } else {

      if ( items.length < getLengthList( state ) ) {

        if ( hasMore( state ) ) {

          products
            .find( getSearchOptions( { state }, { isSearch, isTags, filterByUserName, filterByUserId }, force ) )
            .then( data => {

              dispatch( types.PRODUCTS_RECEIVE, data.object_list );

              resolve();

            } )
            .catch( ( error ) => {
              products.sendError( error, { state, isSearch, isTags, filterByUserName, filterByUserId } );
              reject(error);
            } );

        }

        resolve();

      } else {

        dispatch( types.PRODUCTS_INC_LENGTH_LIST );
        resolve();

      }

    }

  } );

};

export const setListId = ( { dispatch }, listId ) => {

  dispatch( types.PRODUCTS_SET_LIST_ID, listId );

};

export const openProduct = ( { dispatch, state }, id ) => {

  dispatch( types.PRODUCTS_SET_PRODUCT_ID, id );

  const product = getProduct( state );

  return new Promise( ( resolve, reject ) => {

    if ( product !== null ) {

      dispatch( types.PRODUCTS_SET_OPENED_PRODUCT, product );
      resolve();

    } else {

      products
        .get( id )
        .then( ( product ) => {
          dispatch( types.PRODUCTS_SET_OPENED_PRODUCT, product );
          dispatch( types.PRODUCTS_SET_PRODUCT_ID, null );
          resolve();
        } )
        .catch( ( error ) => {
          products.sendError( error, { state, id } );
          reject( error );
        } );

    }

  } );

};

export const closeProduct = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_SET_OPENED_PRODUCT, null );

};

export const enableInfinityProducts = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_SET_INFINITY, true );

};

export const setColumnNumber = ( { dispatch }, columnNumber ) => {

  dispatch( types.PRODUCTS_SET_COLUMN_NUMBER, columnNumber );

};

export const setScroll = ( { dispatch }, scrollTop, scrollHeight ) => {

  dispatch( types.PRODUCTS_SET_SCROLL, scrollTop, scrollHeight );

};

export const incLengthList = ( { dispatch }, count ) => {

  dispatch( types.PRODUCTS_INC_LENGTH_LIST, count );

};

export const productsClose = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_CLOSE );

};
