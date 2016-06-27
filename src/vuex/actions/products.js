import * as types from '../mutation-types';
import * as products from 'services/products.js';
import { searchValue, selectedTagsId } from 'vuex/getters/search.js';
import { user } from 'vuex/getters/user.js';
import {
  getLastProduct,
  getLengthList,
  getProducts,
  getProduct,
  hasMore,
  getOpenedProduct,
  isLiked
} from 'vuex/getters/products.js';

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

    const tags = selectedTagsId( state );

    if ( Array.isArray( tags ) ) {

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

      setAnimate( { dispatch, state }, true );

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
          reject( error );
        } );

    } else {

      if ( items.length < getLengthList( state ) ) {

        if ( hasMore( state ) ) {

          setAnimate( { dispatch, state }, true );

          products
            .find( getSearchOptions( { state }, { isSearch, isTags, filterByUserName, filterByUserId }, force ) )
            .then( data => {

              dispatch( types.PRODUCTS_RECEIVE, data.object_list );

              resolve();

            } )
            .catch( ( error ) => {
              products.sendError( error, { state, isSearch, isTags, filterByUserName, filterByUserId } );
              reject( error );
            } );

        }

        resolve();

      } else {

        setAnimate( { dispatch, state }, false );

        dispatch( types.PRODUCTS_INC_LENGTH_LIST );
        resolve();

      }

    }

  } );

};

export const openProduct = ( { dispatch, state }, id ) => {

  /**
   * Логика упростилась так как каждый раз при открытии продкута нужно его запрашивать
   * не известно был ли установлени или снят @savetrend/
   * TODO попросить сделать событие product.LIKE - позволит постоянно не запрашивать объект продукта.
   * */

  return products
    .get( id )
    .then( ( product ) => {
      dispatch( types.PRODUCTS_SET_OPENED_PRODUCT, product );
    } )
    .catch( ( error ) => {
      products.sendError( error, { state, id } );
    } );

  /*  const product = getProduct( state, id );

   return new Promise( ( resolve, reject ) => {

   if ( product !== null ) {

   if ( product.hasOwnProperty( 'liked_by' ) ) {

   dispatch( types.PRODUCTS_SET_OPENED_PRODUCT, product );
   resolve();

   } else {

   /!**
   * !!! Внимание
   * Этот дублирущий запрос делается потому что сейчас в объектах ленты нет поля liked_by.
   * *!/

   products
   .get( id )
   .then( ( product ) => {
   dispatch( types.PRODUCTS_SET_OPENED_PRODUCT, product );
   resolve();
   } )
   .catch( ( error ) => {
   products.sendError( error, { state, id } );
   reject( error );
   } );

   }

   } else {

   products
   .get( id )
   .then( ( product ) => {
   dispatch( types.PRODUCTS_SET_OPENED_PRODUCT, product );
   resolve();
   } )
   .catch( ( error ) => {
   products.sendError( error, { state, id } );
   reject( error );
   } );

   }

   } );*/

};

export const setListId = ( { dispatch }, listId ) => {

  dispatch( types.PRODUCTS_SET_LIST_ID, listId );

};

export const setColumnNumber = ( { dispatch }, columnNumber ) => {

  dispatch( types.PRODUCTS_SET_COLUMN_NUMBER, columnNumber );

};

export const closeProduct = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_SET_OPENED_PRODUCT, null );

};

export const closeProducts = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_CLOSE );

};

export const incLengthList = ( { dispatch }, count ) => {

  dispatch( types.PRODUCTS_INC_LENGTH_LIST, count );

};

export const setLike = (
  { dispatch, state },
  product = getOpenedProduct( state ),
  newLikeState = !isLiked( state )
) => {

  if ( product !== null ) {

    dispatch( types.PRODUCTS_UPDATE_LIKED_BY, product, user( state ), newLikeState );

    products
      .like( product.id, newLikeState )
      .then( ( isLike ) => {
        if ( !isLike ) {

          dispatch( types.PRODUCTS_UPDATE_LIKED_BY, product, user( state ), false );

          console.warn( `Отрицательный ответ на установку
          like в ${ newLikeState }
          от пользователя ${ user( state ).id }.
          Id продкута ${ product.id }` );

        }
      } );

  }

  return null;

};

export const setScroll = ( { dispatch }, scrollTop, scrollHeight ) => {

  dispatch( types.PRODUCTS_SET_SCROLL, scrollTop, scrollHeight );

};

export const setAnimate = ( { dispatch }, state ) => {

  dispatch( types.PRODUCTS_SET_ANIMATE, state );

};

export const enableInfinityProducts = ( { dispatch } ) => {

  dispatch( types.PRODUCTS_SET_INFINITY, true );

};
