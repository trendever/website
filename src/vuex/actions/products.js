import * as types from '../mutation-types';
import * as products from 'services/products.js';
import { searchValue, selectedTagsId } from 'vuex/getters/search.js';
import { user } from 'vuex/getters/user.js';
import {
  getLastProduct,
  getColumnCount,
  getProducts,
  hasMore,
  getOpenedProduct,
  isLiked,
  isAnimateShow,
  _getScrollData,
  getVirtualScrollData
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
  { isSearch, isTags, filterByUserName, filterByUserId, limit },
  force = false
) => {

  dispatch( types.PRODUCTS_LOADING, true );

  return new Promise( ( resolve, reject ) => {

    const items = getProducts( state );

    if ( items === null || force ) {

      setAnimate( { dispatch, state }, true );

      products
        .find( getSearchOptions( { state }, { isSearch, isTags, filterByUserName, filterByUserId, limit }, force ) )
        .then( data => {

          if ( force ) {

            dispatch( types.PRODUCTS_FORCE_RECEIVE, data.object_list );

          } else {

            dispatch( types.PRODUCTS_RECEIVE, data.object_list );

          }

          resolve();

        } )
        .catch( ( error ) => {
          products.sendError( error, { state, isSearch, isTags, filterByUserName, filterByUserId, limit } );
          reject( error );
        } );

    } else {

      if ( hasMore( state ) ) {

        setAnimate( { dispatch, state }, true );

        products
          .find( getSearchOptions( { state }, { isSearch, isTags, filterByUserName, filterByUserId, limit }, force ) )
          .then( data => {

            dispatch( types.PRODUCTS_RECEIVE, data.object_list );

            resolve();

          } )
          .catch( ( error ) => {
            products.sendError( error, { state, isSearch, isTags, filterByUserName, filterByUserId, limit } );
            reject( error );
          } );

      }

    }

  } );

};

const getRows = ( state ) => {

  const columnCount = getColumnCount( state );
  const products    = getProducts( state );

  if ( products !== null ) {

    return parseInt( products.length / columnCount )

  }

  return 0;

};

const getRowsByCount = ( state, countElements ) => {

  return parseInt( countElements / getColumnCount( state ) );

};

const getCountElementOnPage = ( state ) => {

  const columnCount = getColumnCount( state );

  switch ( columnCount ) {
    case 3:
      return 27;
    case 2:
      return 18;
    default:
      return 0
  }

};

const getCountRowsOnPage = ( state ) => {

  const columnCount = getColumnCount( state );

  return parseInt( getCountElementOnPage( state ) / columnCount )

};

const getCountItemsByRows = ( state, rowsCount ) => {

  return getColumnCount( state ) * rowsCount;

};

const getNeedRows = ( state, viewHeight, rowHeight ) => {

  const columnCount = getColumnCount( state );
  const coverHeight = getRows( state ) * rowHeight;

  if ( coverHeight < viewHeight ) {

    const needRows = parseInt( viewHeight / coverHeight );

    if ( ( needRows + getRows( state ) ) < getCountRowsOnPage( state ) ) {

      return getCountRowsOnPage( state ) - ( needRows + getRows( state ) ) + columnCount;

    }

    return needRows + columnCount;

  }

  return 0;

};

export const initScroll = ( { dispatch, state }, options ) => {

  /**
   * Эта функция нужня для того чтобы добавить элементы на супер больших мониторах.
   * */

  const needRows = getNeedRows( state, options.viewHeight, options.rowHeight );

  options.searchData.limit = getCountItemsByRows( state, needRows );

  if ( options.searchData.limit > 0 ) {

    return loadProducts( { dispatch, state }, options.searchData, false ).then( () => {

      dispatch( types.PRODUCTS_SET_SCROLL, Object.assign( {}, options, {
        idEnd: getCountItemsByRows( state, getRows( state ) + needRows )
      } ) );

    } )

  }

};

const getLocalScrollTop = ( state, scrollTop ) => {

  const { topBlockHeight } = getVirtualScrollData( state );

  return scrollTop - topBlockHeight;

};

const getCurrentRow = ( state, scrollTop, rowHeight ) => {

  return parseInt( scrollTop / rowHeight );

};

const getNeedLoadData = ( state ) => {

  const { idEnd } = getVirtualScrollData( state );

  return getRowsByCount( state, idEnd ) > ( getRows( state ) - getColumnCount( state ));

};

const getShift = (() => {

  let lastScrollTop = 0;

  const data = {
    direction: true,
    shift: 0
  };

  let lastBorder = 0;

  return ( state, scrollTop, rowHeight ) => {

    data.direction = scrollTop >= lastScrollTop;

    lastScrollTop = scrollTop;

    const border = getColumnCount( state );

    const shift = getCurrentRow( state, scrollTop, rowHeight );

    if ( Number.isInteger( shift / border ) && data.direction ) {

      data.shift = shift;

    }

    if ( !data.direction && getLocalScrollTop( state, scrollTop ) < 0 ) {

      data.shift -= border;

    }

    if ( lastBorder !== border ) {

      lastBorder     = border;
      data.shift     = 0;
      data.direction = true;
      lastScrollTop  = 0;

    }

    return data;

  }

})();

export const updateScroll = (() => {

  let _scrollTop     = 0;
  let _scrollTopReal = 0;
  let _searchOptions = {};
  let _loading       = false;

  return ( { dispatch, state }, { scrollTop, rowHeight, scrollTopReal, searchOptions } ) => {

    if ( rowHeight > 0 ) {

      if ( typeof scrollTop !== 'undefined' ) {

        _scrollTop = scrollTop;

      }

      if ( typeof scrollTopReal !== 'undefined' ) {

        _scrollTopReal = scrollTopReal;

      }

      if ( typeof searchOptions !== 'undefined' ) {

        _searchOptions = searchOptions;

      }

      const { shift } = getShift( state, _scrollTop, rowHeight );

      const needLoadData = getNeedLoadData( state, _scrollTop, rowHeight );

      if ( needLoadData ) {

        _searchOptions.limit = getCountElementOnPage( state );

        if ( !_loading ) {

          _loading = true;

          loadProducts( { dispatch, state }, _searchOptions, false ).then( () => {

            updateScroll( { dispatch, state }, { scrollTop, rowHeight, scrollTopReal, searchOptions } );

            _loading = false;

          } );

        }

      } else {

        const idEnd = getCountElementOnPage( state ) + shift * getColumnCount( state );
        
        dispatch( types.PRODUCTS_SET_SCROLL, Object.assign(
          {},
          { scrollTop: _scrollTop, rowHeight, scrollTopReal: _scrollTopReal },
          {
            localScrollTop: getLocalScrollTop( state, _scrollTop ),
            topBlockHeight: shift * rowHeight,
            bottomBlockHeight: ( getRows( state ) - getRowsByCount( state, idEnd ) ) * rowHeight,
            idStart: shift * getColumnCount( state ),
            idEnd
          }
        ) );

      }

    }

  }

})();

export const setCallBackAfterLoading = (
  { dispatch }, callback = () => {
  }
) => {

  dispatch( types.PRODUCTS_SET_CALL_BACK_AFTER_LOADING, callback )

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
  { isSearch, isTags, filterByUserName, filterByUserId, limit = state.products.ITEMS_PER_PAGE },
  force = false
) => {

  const request = {
    q: null,
    from_id: null,
    tags: null,
    limit,
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

        dispatch( types.PRODUCTS_SET_SCROLL, Object.assign( {}, options, {
          idEnd: getCountItemsByRows( state, 9 )
        } ) );

        if ( isAnimateShow( state ) ) {

          setTimeout( () => {

            setAnimate( { dispatch, state }, false );

          }, 2000 );

          return 0;

        }

        return 0;

      } );

  } else {

    return Promise.resolve( _getScrollData( state ).scrollTopReal );

  }

};
