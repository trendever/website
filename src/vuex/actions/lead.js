import * as leads from 'services/leads.js';
import * as types from '../mutationTypes/lead';
import * as message from 'services/message';
import { getOlderLead, getLeads } from '../getters/lead';

export const createLead = ( { dispatch }, product_id ) => {
	return leads.create( product_id ).then(
		( lead ) => {
			dispatch( types.RECEIVE, [ lead ] );
			return lead;
		},
		( error ) => {
			if ( error === leads.ERROR_CODES.UNATHORIZED ) {
				console.log( '[ UNATHORIZED ]: ', error );
			}
			if ( error === leads.ERROR_CODES.OBJECT_NOT_EXIST ) {
				console.log( '[ OBJECT_NOT_EXIST ]: ', error );
			}
			console.log( error );
		} );
};

export const loadLeads = ( { dispatch, state:{ leads:{ tab, seller, customer } }, state } ) => {

	if ( (seller.length + customer.length) === 0 ) {

		return leads.find( 12 ).then(
			( { customer, seller } ) => {
				dispatch( types.RECEIVE, { customer, seller } );
			},
			( error ) => {
				console.log( error );
			}
		);

	} else {

		return leads.find( 6, getOlderLead( state ), tab ).then(
			( { leads } ) => {
				dispatch( types.RECEIVE, { [tab]: leads } );
			},
			( error ) => {
				console.log( error );
			}
		);

	}
};

export const setTab = ( { dispatch }, tab ) => {
	
	return leads.find( 12, null, tab ).then(
		( {leads} ) => {
						
			dispatch( types.SET_TAB, tab, leads );
			
		},
		( error ) => {
			console.log( error );
		}
	);
	
};

export const applyStatus = ( { dispatch }, lead, status_key ) => {
	dispatch( types.APPLY_STATUS, lead, status_key );
};

export const setLastMessages = ( { dispatch }, chat, messages ) => {
	dispatch( types.SET_LAST_MESSAGE, chat, messages );
};

export const initGlobalNotify = ( { dispatch } ) => {
	return message.getCountUnread().then(
		( count ) => {
			dispatch( types.INIT_GLOBAL_NOTIFY, count );
		},
		( error ) => {
			console.log( error );
		}
	);
};

export const incNotify = ( { dispatch, state }, conversation_id ) => {

	let lead = getLeads( state ).find( ( { chat } ) => {

		if ( chat !== null ) {

			return chat.id === conversation_id;
			
		}

	} );

	if ( state.conversation.lead !== null ) {

		if ( state.conversation.id !== conversation_id ) {

			dispatch( types.INC_NOTIFY, (lead !== undefined) ? lead.id : null );

		}

	} else {

		dispatch( types.INC_NOTIFY, (lead !== undefined) ? lead.id : null );

	}

};

export const clearNotify = ( { dispatch }, lead_id ) => {
	dispatch( types.CLEAR_NOTIFY, lead_id );
};
