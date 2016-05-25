import {
  LEAD_INIT,
  LEAD_RECEIVE,
  LEAD_SET_TAB,
  LEAD_APPLY_STATUS,
  LEAD_INC_NOTIFY,
  LEAD_CLEAR_NOTIFY,
  LEAD_SET_LAST_MESSAGE
} from '../mutation-types';

import * as leads from 'services/leads.js';
import * as message from 'services/message';
import { getOlderLead, getLeads, getTab } from '../getters/lead';

export const init = ( { dispatch }, count = 12 ) => {

  return new Promise( ( resolve, reject ) => {
    Promise.all( [ message.getCountUnread(), leads.find( count ) ] ).then(
      ( [countUnread, { customer, seller }] ) => {
        dispatch( LEAD_INIT, { customer, seller, countUnread } );
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

export const loadLeads = ( { dispatch, state }, count = 6 ) => {

  const tab = getTab( state );

  return leads
    .find( count, getOlderLead( state ), tab )
    .then(
      ( { leads } ) => {
        dispatch( LEAD_RECEIVE, leads, tab );
      },
      leads.sendError
    );

};

export const createLead = ( { dispatch }, product_id ) => {
  return leads
    .create( product_id )
    .then(
      ( lead ) => {
        dispatch( LEAD_RECEIVE, [ lead ], 'customer' );
        return lead;
      },
      leads.sendError
    );
};

export const setTab = ( { dispatch }, tab ) => {
  
  dispatch( LEAD_SET_TAB, tab, leads );
  
};




export const onStatus = ( { dispatch }, lead, status_key ) => {
  
  dispatch( LEAD_APPLY_STATUS, lead, status_key );
  
};

export const onMessages = ( { dispatch, state }, chat, messages ) => {
  
  dispatch( LEAD_SET_LAST_MESSAGE, chat, messages );
  
  let lead = getLeads( state ).find( ( { chat:{_chat} } ) => {
    
    if ( _chat !== null ) {
      
      return _chat.id === chat.id;
      
    }
    
  } );
  
  if ( state.conversation.lead !== null ) {
    
    if ( state.conversation.id !== chat.id ) {
      
      dispatch( LEAD_INC_NOTIFY, (lead !== undefined) ? lead.id : null );
      
    }
    
  } else {
    
    dispatch( LEAD_INC_NOTIFY, (lead !== undefined) ? lead.id : null );
    
  }
  
};

export const onMessageRead = () => {
  
};



export const clearNotify = ( { dispatch }, lead_id ) => {
  dispatch( LEAD_CLEAR_NOTIFY, lead_id );
};

