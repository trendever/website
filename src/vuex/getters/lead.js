export const getLeads     = ( state ) => {

	if ( !state.leads.hasOwnProperty( state.leads.tab ) ) {
		throw new Error( `${state.leads.tab} - Такого типа LEAD не существует.` );
	}

	return state.leads[ state.leads.tab ];

};

export const getIsTab     = ( { leads } ) => (leads.seller.length + leads.customer.length) > 0;

export const getOlderLead = ( { leads:{tab,  seller, customer } } ) => {
	const times = [];

	const leads = { seller, customer }[tab];
	for ( let i = leads.length; i; i-- ) {
		times.push( leads[ i - 1 ].updated_at );
	}
	return Math.min.apply( Math, times );
};
export const getTitle     = ( state ) => {
	if ( getIsTab( state ) ) {
		return;
	}
	if ( state.leads.tab === 'seller' ) {
		if ( getLeads( state ).length > 0 ) {
			return "Чаты с покупателями";
		}
	}

	return "Шопинг-чаты";

};
export const getTab       = state => state.leads.tab;
export const getPending   = state => state.leads.pending;
export const getGlobalNotifyCount   = state => state.leads.global_notify_count;
export const getNotifyCountList   = state => state.leads.notify_count;