import * as leads from 'services/leads.js';
import * as types from '../mutationTypes/lead';
import * as message from 'services/message';

import { getOlderLead } from '../getters/lead';

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

		return leads.find( 6, 0 ).then(
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
	dispatch( types.SET_TAB, tab );
};

export const applyStatus = ( { dispatch }, lead_id, status_key ) => {
	dispatch( types.APPLY_STATUS, lead_id, status_key );
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

export const incNotify = ( { dispatch, state }, lead_id ) => {
	if ( state.conversation.id !== lead_id ) {
		dispatch( types.INC_NOTIFY, lead_id );
	}
};

export const clearNotify = ( { dispatch }, lead_id ) => {
	dispatch( types.CLEAR_NOTIFY, lead_id );
};

export const setLastMessages = ( { dispatch }, chat, messages ) => {
	dispatch(types.SET_LAST_MESSAGE, chat, messages);
};