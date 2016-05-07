import * as leads from 'services/leads.js';
import * as types from '../mutationTypes/lead';
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
