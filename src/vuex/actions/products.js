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

/**
 * TODO После того как всё правильно заработает: 1) Декомпозировать 2) Сделать сущность которая считает данные для
 * виртуального кролла
 *
 * */

export const initScroll = (
  { dispatch, state }, {
    searchData = {},
    rowHeight = 0,
    viewHeight = 0,
    scrollTop = 0,
    scrollTopReal = 0
  }
) => {

  const columnCount = getColumnCount( state );
  const products    = getProducts( state );

  let rowsCount = 0;

  if ( products !== null ) {

    rowsCount = parseInt( products.length / columnCount )

  }

  const elementsHeight = rowsCount * rowHeight;

  const freeHeight = ( viewHeight - elementsHeight > 1 ) ? viewHeight - elementsHeight : 0;

  let needRowsForCoverFreeSpace = 0;

  if ( freeHeight > 0 ) {

    needRowsForCoverFreeSpace = parseInt( freeHeight / rowHeight ) + 1;

  }

  let needRowLoad = ( columnCount === 3 ) ? needRowsForCoverFreeSpace + 6 : needRowsForCoverFreeSpace + 8;

  const rowsOnDown = (rowsCount * rowHeight - ( scrollTop + viewHeight )) / rowHeight;

  if ( rowsOnDown >= needRowLoad ) {

    needRowLoad = 0;

  }

  searchData.limit = needRowLoad * columnCount;

  return loadProducts( { dispatch, state }, searchData, false ).then( () => {

    dispatch( types.PRODUCTS_SET_SCROLL, {
      scrollTopReal,
      scrollTop,
      viewHeight,
      rowHeight,
      idEnd: getVirtualScrollData( state ).idEnd + columnCount * 3
    } );

  } )

};

export const setScroll = (() => {

  let countOfViewElement = 18;
  let loading            = false;
  let limit              = 21;
  let lastShift          = 0;
  let _scrollTop         = 0;
  let _scrollTopReal     = 0;
  let _searchOptions     = {};

  return ( { dispatch, state }, { scrollTop, rowHeight, scrollTopReal, searchOptions, viewHeight } ) => {

    const columnCount = getColumnCount( state );
    const products    = getProducts( state );

    if ( columnCount === 3 ) {

      countOfViewElement = 18;
      limit              = 21;

    } else if ( columnCount === 2 ) {

      countOfViewElement = 16;
      limit              = 20;

    }

    if ( typeof scrollTop !== 'undefined' ) {

      _scrollTop = scrollTop;

    }

    if ( typeof scrollTopReal !== 'undefined' ) {

      _scrollTopReal = scrollTopReal;

    }

    if ( typeof searchOptions !== 'undefined' ) {

      _searchOptions = searchOptions;

    }

    const maxHeightOfProducts = (products.length / columnCount) * rowHeight;

    if ( maxHeightOfProducts < _scrollTop ) {

      _scrollTop = (columnCount === 3) ? maxHeightOfProducts - 2000 : maxHeightOfProducts;

    }

    const shift = parseInt( _scrollTop / rowHeight );

    if ( (shift ^ 0) === shift ) {

      if ( lastShift !== shift ) {

        lastShift < shift ? lastShift++ : lastShift--;

        if ( lastShift < shift && shift <= 2 ) {

          return null;

        }

        const idEnd         = shift * columnCount + countOfViewElement;
        const productLength = products.slice( idEnd, products.length ).length / columnCount;

        const newOptions = Object.assign(
          {
            scrollTop: _scrollTop,
            rowHeight,
            viewHeight,
            scrollTopReal: _scrollTopReal
          },
          {
            idStart: shift * columnCount,
            idEnd,
            topBlockHeight: shift * rowHeight,
            bottomBlockHeight: parseInt( productLength ) * rowHeight
          }
        );

        if ( Array.isArray( products ) ) {

          if ( products.slice( newOptions.idStart, newOptions.idEnd ).length === countOfViewElement ) {

            dispatch( types.PRODUCTS_SET_SCROLL, newOptions );

          } else {

            if ( !loading ) {

              loading = true;

              _searchOptions.limit = limit;

              return loadProducts( { dispatch, state }, _searchOptions, false ).then( () => {

                loading = false;

                const products = getProducts( state );
                const columnCount = getColumnCount( state );

                dispatch( types.PRODUCTS_SET_SCROLL, Object.assign( {}, newOptions, {
                  idEnd: getVirtualScrollData( state ).idEnd + columnCount * 2,
                  bottomBlockHeight: parseInt( products.slice( idEnd, products.length ).length / columnCount ) * rowHeight
                } ) );

              } )

            }

          }

        }

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

    switch ( getColumnCount( state ) ) {
      case 3:
        options.limit = 9;
        break;
      case 2:
        options.limit = 8;
        break;
    }

    return loadProducts( { dispatch, state }, options, force )
      .then( () => {

        if ( isAnimateShow( state ) ) {

          setTimeout( () => {

            setAnimate( { dispatch, state }, false );

          }, 2000 );

          return 0;

          /**
           * 2 сек после получения данных, после 2 сек выключается анимация
           * жду чтобы картинки успели загрузиться, не вешать же на каждую картинку onLoad
           * */

        }

        return 0;

      } );

  } else {

    return Promise.resolve( _getScrollData( state ).scrollTopReal );

  }

};
