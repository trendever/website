import * as types from '../mutation-types';
import * as products from 'services/products.js';
import * as userService from 'services/user';
import { searchValue, selectedTagsId } from 'vuex/getters/search.js';
import { user, authUserId } from 'vuex/getters/user.js';

import {
  getLastProduct,
  getColumnCount,
  getProducts,
  hasMore,
  getOpenedProduct,
  isLiked,
  isAnimateShow,
  getScrollData,
  getCountElementOnPage
} from 'vuex/getters/products.js';

export const setAnimate = ( { dispatch }, state ) => {

  dispatch( types.PRODUCTS_SET_ANIMATE, state );

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

export const loadProducts = (
  { dispatch, state },
  { isSearch, isTags, filterByShopId, filterByMentionerId, limit, includeNotSailed },
  force = false
) => {

  dispatch( types.PRODUCTS_LOADING, true );

  return new Promise( ( resolve, reject ) => {

    const items = getProducts( state );

    if ( items === null || force ) {

      setAnimate( { dispatch, state }, true );

      products
        .find( getSearchOptions( { state }, { isSearch, isTags, filterByShopId, filterByMentionerId, limit, includeNotSailed }, force ) )
        .then( data => {

          if ( force ) {

            dispatch( types.PRODUCTS_FORCE_RECEIVE, data/*.object_list*/ );

          } else {

            dispatch( types.PRODUCTS_RECEIVE, data/*.object_list*/ );

          }

          resolve();

        } )
        .catch( ( error ) => {
          products.sendError( error, { state, isSearch, isTags, filterByShopId, filterByMentionerId, limit, includeNotSailed } );
          reject( error );
        } );

    } else {

      if ( hasMore( state ) ) {

        setAnimate( { dispatch, state }, true );

        products
          .find( getSearchOptions( { state }, { isSearch, isTags, filterByShopId, filterByMentionerId, limit, includeNotSailed }, force ) )
          .then( data => {

            dispatch( types.PRODUCTS_RECEIVE, data/*.object_list*/ );

            resolve();

          } )
          .catch( ( error ) => {
            products.sendError( error, { state, isSearch, isTags, filterByShopId, filterByMentionerId, limit, includeNotSailed } );
            reject( error );
          } );

      } else {

        resolve();

      }

    }

  } );

};

const getShift = ( state, scrollTop, rowHeight ) => {

  const { lastScrollTop } = getScrollData( state );

  return {
    shift: parseInt( scrollTop / rowHeight ),
    direction: scrollTop >= lastScrollTop
  };

};

/**
 *
 isLoading: false,

 searchOptions: {},

 scrollTop: 0,

 scrollTopReal: 0,

 rowHeight: 0,

 idStart: 0,

 idEnd: ITEMS_PER_PAGE,

 * */

export const resetScrollByListId = ( { dispatch }, listId ) => {

  dispatch( types.PRODUCTS_RESET_SCROLL_BY_LIST_ID, listId );

};

export const updateScroll = (() => {

  let oldShift = null;

  return (
    { dispatch, state },
    {
      scrollTop = 0,
      rowHeight,
      scrollTopReal = getScrollData( state ).scrollTop,
      searchOptions = getScrollData( state ).searchOptions
    }
  ) => {

    const { shift, direction } = getShift( state, scrollTop, rowHeight );

    dispatch( types.PRODUCTS_SET_SCROLL, { rowHeight, scrollTop: scrollTopReal, lastScrollTop: scrollTop, shift } );

    if ( oldShift !== shift ) {

      oldShift        = shift;
      const maxId     = getProducts( state ).length;
      const elsByPage = getCountElementOnPage( state );

      const isLoading = getScrollData( state ).isLoading;

      let idEnd   = elsByPage + shift * getColumnCount( state );
      let idStart = shift * getColumnCount( state ) - elsByPage;

      idStart = (idStart > 0) ? idStart : 0;

      if ( maxId - idEnd < 0 ) {

        idEnd   = maxId;
        idStart = idEnd - ( elsByPage * 2 );
        idStart = ( idStart > 0 ) ? idStart : 0
      }

      if ( hasMore( state ) && direction && ( maxId - idEnd <= 7 ) ) {

        if ( !isLoading ) {

          const _searchOptions = Object.assign( {}, searchOptions, { limit: 9 } );

          dispatch( types.PRODUCTS_SET_SCROLL, { isLoading: true } );

          loadProducts( { dispatch, state }, _searchOptions, false ).then().then( () => {

            updateScroll( { dispatch, state }, { scrollTop, rowHeight, scrollTopReal, searchOptions: _searchOptions } );

            dispatch( types.PRODUCTS_SET_SCROLL, { isLoading: false, searchOptions: _searchOptions } );

          } );

        }

      }

      console.log( { idStart, idEnd } );

      dispatch( types.PRODUCTS_SET_SCROLL, { idStart, idEnd } )

    }

  };

})()

export const run = ( { dispatch, state }, options, force ) => {

  /**
   * Смысл в том что если в ленте нет элементов занчит это инициализация,
   * я загружаю ленту и возвращаю позицию скрола.
   *
   * Если элементы есть я просто возвращаю позицию скролла из состояния.
   * */

  if ( !force ) {

    const items = getProducts( state );

    // Stats
    mixpanel.track( 'Show More Products', {
      offset: items !== null ? items.length : null,
      view: `${ getColumnCount( state ) }columns`
    } );

  }

  const items = getProducts( state );

  if ( items === null || force ) {

    options.limit = getCountElementOnPage( state );

    return loadProducts( { dispatch, state }, options, force )
      .then( () => {

        if ( isAnimateShow( state ) ) {

          setTimeout( () => {

            setAnimate( { dispatch, state }, false );

          }, 2000 );

        }

      } );

  } else {

    return Promise.resolve( getScrollData( state ).scrollTop );

  }

};

export const setCallBackAfterLoading = (
  { dispatch }, callback = () => {
  }
) => {

  dispatch( types.PRODUCTS_SET_CALL_BACK_AFTER_LOADING, callback )

};

export const setScrollByProduct = ( { dispatch, state }, scrollTop ) => {

  dispatch( types.PRODUCTS_SAVE_SCROLL_BY_PRODUCT, scrollTop, getOpenedProduct( state ).id );

};

export const setComeBack = ( { dispatch }, comeBack = false ) => {

  dispatch( types.PRODUCTS_SET_COME_BACK, comeBack )

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

export const getSearchOptions = (
  { state },
  { isSearch, isTags, filterByShopId, filterByMentionerId, limit = state.products.ITEMS_PER_PAGE, includeNotSailed },
  force = false
) => {


  const request = {
    query: null,
    tags: null,
    shop_id: 0,
    mentioner_id: 0,
    limit,
    offset: null
  }

  if ( !force ) {

    const lastProduct = getLastProduct( state );

    if ( lastProduct !== null ) {

      request.offset = getProducts( state ).length;

    }

  }


  if (isSearch) {

    const query = searchValue( state );

    if (typeof query === 'string') {
      request.query = query.trim();

    }

  }



  if ( isTags ) {

    const tags = selectedTagsId( state );

    if ( Array.isArray( tags ) ) {

      request.tags = tags;

    }

  }

  if ( filterByShopId ) {

    request.shop_id = filterByShopId;

  }

  if( includeNotSailed ) {

    request.include_not_on_sale = includeNotSailed

  }

  if ( filterByMentionerId ) {

    request.mentioner_id = filterByMentionerId;
    request.include_not_on_sale = true

  }

  return request;

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

};

export const setContainerWidth = ( { dispatch }, width ) => {

  dispatch( types.PRODUCTS_SET_CONTAINER_WIDTH, width );

};

export const checkIsUserProduct = ( { dispatch, state } ) => {

    return userService

      .get({user_id: authUserId(state) })
      .then( res => {
        let isProductSupplier, isProductSeller;

        if(res.supplier_of){

          isProductSupplier = res.supplier_of.some((item)=>{

            return item === getOpenedProduct(state).supplier.id;

          })

        }

        if(res.seller_of) {

          isProductSeller = res.seller_of.some(item=>{

            return item === getOpenedProduct(state).supplier.id;

          });

        }


        if( isProductSupplier || isProductSeller){

          dispatch(types.PRODUCTS_CHECK_AUTH_USER_PRODUCT, true)
          
          return true;

        } else {

          dispatch(types.PRODUCTS_CHECK_AUTH_USER_PRODUCT, false)

          return false;

        }

      })
};
