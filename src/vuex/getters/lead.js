export const getTab = ( { leads } ) => {
	if ( getIsTab( { leads } ) ) {
		return leads.tab;
	}
	if ( leads.seller.length > 0 ) {
		return 'seller';
	}
	return 'customer';
};

export const getLeads = ( { leads } ) => {
	return leads[ getTab( { leads } ) ];
};

export const getOlderLead = ( state ) => {
	const leads  = getLeads( state );
	const times = [];
	for ( let i = leads.length; i; i-- ) {
		times.push( leads[ i - 1 ].updated_at );
	}
	return Math.min.apply( Math, times );
};

export const getIsTab = ( { leads } ) => {
	return (leads.seller.length > 0) && (leads.customer.length > 0);
};

export const getTitle = ( state ) => {
	if ( getIsTab( state ) ) {
		return;
	}
	return {
		seller: 'Чаты с покупателями',
		customer: 'Шопинг-чаты'
	}[getTab(state)];
};

export const getLastMessage       = ( state ) => {
	const messages = {};
	const leads = getLeads(state);

	for (let i = leads.length; i; i--) {
		const { id, chat } = leads[ i - 1 ];
		
		if ( chat !== null ) {
			
			const mime = chat.recent_message.parts[ 0 ].mime_type;
			const data = chat.recent_message.parts[ 0 ].content;
			
			if ( mime === 'text/plain' ) {
				messages[ id ] = data;
			}
			if ( mime === 'text/json' ) {
				messages[ id ] = `товар: ${JSON.parse( data ).Title}`;
			}
			
		} else {
			messages[ id ] = '';
		}
		
	}

	return messages;
};

export const getGlobalNotifyCount = state => state.leads.global_notify_count;
export const getNotifyCountList   = state => state.leads.notify_count;

export const isEmptyLeads = ( { leads } ) => {
	return (leads.seller.length === 0) && (leads.customer.length === 0);
};

export const isDone = ( state ) => {
	return state.leads.done;
};
