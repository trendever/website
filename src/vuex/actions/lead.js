import {
  LEAD_INIT,
  LEAD_RECEIVE,
  LEAD_SET_TAB,
  LEAD_CLEAR_NOTIFY,
  LEAD_SET_LAST_MESSAGE,
  LEAD_INC_NOTIFY,
  LEAD_APPLY_STATUS,
  LEAD_INC_LENGTH_LIST
} from '../mutation-types';
import * as leads from 'services/leads.js';
import * as message from 'services/message';
import {
  getOlderLead,
  getLeadByConversationId,
  getTab,
  getLengthListOnBody,
  getLeads,
  getLengthList
} from '../getters/lead';
import { userID } from '../getters';

export const init = ( { dispatch } ) => {

  return new Promise( ( resolve, reject ) => {

    Promise.all( [ message.getCountUnread(), leads.find( getLengthListOnBody() ) ] ).then(
      ( [countUnread, { customer, seller }] ) => {
        dispatch( LEAD_INIT, {
          customer,
          seller,
          countUnread,
          lengthList: getLengthListOnBody()
        } );
        resolve();
      },
      ( errors ) => {
        message.sendError( errors[ 0 ] );
        leads.sendError( errors[ 1 ] );
        reject();
      }
    );

  } );

};

export const incLengthList = ( { dispatch }, count = 6 ) => {

  dispatch( LEAD_INC_LENGTH_LIST, count );

};

export const loadLeads = ( { dispatch, state }, count = 6 ) => {

  return new Promise( ( resolve, reject ) => {

    const tab = getTab( state );
    
    if ( getLeads( state ).length > (getLengthList( state ) + count) ) {

      incLengthList( { dispatch }, count );
      resolve();

    } else {

      leads
        .find( count, getOlderLead( state ), tab )
        .then(
          ( { leads } ) => {
            incLengthList( { dispatch }, leads.length );
            dispatch( LEAD_RECEIVE, leads, tab );
            resolve();
          },
          (error) => {
            leads.sendError( error );
            reject();
          }
        );

    }

  } );

};

export const createLead = ( { dispatch }, product_id ) => {

  return leads
    .create( product_id )
    .then(
      ( lead ) => {
        incLengthList( { dispatch }, 1 );
        dispatch( LEAD_RECEIVE, [ lead ], 'customer' );
        return lead;
      },
      leads.sendError
    );

};

export const setTab = ( { dispatch }, tab ) => {

  dispatch( LEAD_SET_TAB, tab, getLengthListOnBody() );

};

export const onMessages = (
  { dispatch, state },
  { response_map:{ chat:{ id:conversation_id, members }, messages } }
) => {

  function handler( lead ) {

    if ( messages[ 0 ].parts[ 0 ].mime_type === "json/status" ) {

      const statusCode = leads.getStatusCode( JSON.parse( messages[ 0 ].parts[ 0 ].content ).value );

      dispatch( LEAD_APPLY_STATUS, conversation_id, statusCode, members, messages[ 0 ].created_at );

    }

    if ( messages[ 0 ].parts[ 0 ].mime_type === "text/plain" ) {

      dispatch( LEAD_SET_LAST_MESSAGE, conversation_id, messages );

      if ( state.conversation.id !== conversation_id ) {

        dispatch( LEAD_INC_NOTIFY, (lead !== undefined) ? lead.id : null );

      }

    }

  }

  const lead = getLeadByConversationId( state, conversation_id );

  if ( lead ) {

    handler( lead );

  } else {

    leads.get( { conversation_id } ).then(
      ( { lead } ) => {
        // TODO Спросить как можно определить, для текущего пользователя lead в покупаю || продаю.
        dispatch( LEAD_RECEIVE, [ lead ], lead.customer_id === userID( state ) ? 'customer' : 'seller' );
        handler( lead );
      },
      leads.sendError
    );

  }

};

export const clearNotify = ( { dispatch }, lead_id ) => {

  dispatch( LEAD_CLEAR_NOTIFY, lead_id );

};

