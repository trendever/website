import {
  LEAD_INIT,
  LEAD_RECEIVE,
  LEAD_UPDATE,
  LEAD_SET_TAB,
  LEAD_CLEAR_NOTIFY,
  LEAD_INC_NOTIFY,
  LEAD_INC_LENGTH_LIST,
  LEAD_CLOSE
} from '../mutation-types';
import * as leads from 'services/leads.js';
import * as message from 'services/message';
import {
  getOlderLead,
  getLeadByConversationId,
  getTab,
  getLengthListOnBody,
  getLeads,
  getLengthList,
  getGroup
} from '../getters/lead';

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

export const incLengthList = ( { dispatch }, count = getLengthListOnBody() ) => {

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
            resolve(leads.length);
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

      const value = JSON.parse( messages[ 0 ].parts[ 0 ].content ).value;

      dispatch( LEAD_UPDATE, Object.assign({
        conversation_id,
        members,
        updated_at: messages[ 0 ].created_at * 1e9
      }, (typeof value !== 'undefined')?{status: leads.getStatusCode(value)}:{}) );

    }

    if ( messages[ 0 ].parts[ 0 ].mime_type === "text/plain" ) {

      dispatch( LEAD_UPDATE, {
        conversation_id,
        members,
        parts: messages[ 0 ].parts,
        updated_at: messages[ 0 ].created_at * 1e9
      } );

      if ( state.conversation.id !== conversation_id ) {

        dispatch( LEAD_INC_NOTIFY, (lead !== undefined) ? lead.id : null );

      }

    }

  }

  const lead = getLeadByConversationId( state, conversation_id );

  if ( lead ) {

    handler( lead );

  } else {

    leads
      .get( { conversation_id } )
      .then(
      ( { lead } ) => {
        // TODO Спросить как можно определить, для текущего пользователя lead в покупаю || продаю.
        dispatch( LEAD_RECEIVE, [ lead ], getGroup( state, lead ) );
        handler( lead );
      } )
      .catch( ( error ) => {
        leads.sendError( error, state );
      } );

  }

};

export const onMessageRead = ( { dispatch, state }, data ) => {

  if ( data.response_map ) {
    if ( data.response_map.chat ) {
      if ( Array.isArray( data.response_map.chat.members ) ) {

        const lead = getLeadByConversationId( state, data.response_map.chat.id );

        if ( lead ) {

          if ( lead.chat ) {

            dispatch( LEAD_UPDATE, {
              conversation_id: lead.chat.id,
              members: data.response_map.chat.members,
              updated_at: lead.chat.recent_message.created_at * 1e9
            } );

          }

        }

      }
    }
  }

};

export const clearNotify = ( { dispatch }, lead_id ) => {

  dispatch( LEAD_CLEAR_NOTIFY, lead_id );

};

export const leadClose = ( { dispatch } ) => {

  dispatch( LEAD_CLOSE );

};
