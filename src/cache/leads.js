import { onMsg } from 'services/message';
import { onChangeStatus } from 'services/leads';

const Private = new WeakMap();

class LeadCache {
	
	constructor() {
		
		Private.set( this, {
			seller: [],
			customer: [],
		} );
		
		this.addItem      = this.addItem.bind( this );
		this.find         = this.find.bind( this );
		this._resortCache = this._resortCache.bind( this );

		onMsg( this._resortCache );
		onChangeStatus( this._resortCache );

	}

	addItem( leads, role = null ) {

		const cache = Private.get( this );

		if ( role === null ) {

			for ( const key in leads ) {

				if ( leads.hasOwnProperty( key ) ) {

					if ( Array.isArray( leads[ key ] ) ) {

						if ( leads[ key ].length > 0 ) {
							
							cache[ key ] = cache[ key ].concat( leads[ key ] );

						}

					}

				}

			}

		} else {

			if ( Array.isArray( leads.leads ) ) {

				if ( leads.leads.length > 0 ) {

					cache[ role ] = cache[ role ].concat( leads.leads );

				}

			}

		}

	}

	find( limit = null, from_updated_at = null, role = null ) {

		console.log(Private.get(this));

		if ( limit !== null && from_updated_at !== null && role !== null ) {
			
			return this._findFromUpdatedAtLimit( limit, from_updated_at, role );
			
		}
		
		if ( limit === null && from_updated_at !== null && role !== null ) {
			
			return this._findFromUpdated_at( from_updated_at, role );
			
		}
		
		if ( limit !== null && role !== null && from_updated_at === null ) {
			
			return this._findMostRecentLimit( limit, role );
			
		}

		if ( limit === null && role !== null && from_updated_at === null ) {

			return this._findMostRecent( role );

		}

		if ( limit !== null && role === null && from_updated_at === null ) {

			return this._findLimit( limit );

		}

		if ( role === null && limit === null && from_updated_at === null ) {
			
			return this._findAll();
			
		}

		return null;

	}

	_resortCache() {

		const cache = Private.get( this );

		for ( const key in cache ) {
			if ( cache.hasOwnProperty( key ) ) {
				cache[ key ] = this._sortByTime( cache[ key ] );
			}
		}

	}

	_findFromUpdatedAtLimit( limit, from_updated_at, role ) {
		
		const result = {
			leads: []
		};

		this._iterator( ( lead ) => {

			if ( lead.updated_at < from_updated_at ) {

				result.leads.push( lead );

				if ( result.leads.length === limit ) {
					return true;
				}

			}

		}, role );

		if ( result.leads.length > 0 ) {

			return result;

		}

		return null;

	}
	
	_findFromUpdated_at( from_updated_at, role ) {

		const result = {
			leads: []
		};

		this._iterator( ( lead ) => {

			if ( lead.updated_at < from_updated_at ) {

				result.leads.push( lead );

			}

		}, role );

		if ( result.leads.length > 0 ) {

			return result;

		}

		return null;
		
	}
	
	_findMostRecentLimit( limit, role ) {

		const result = Private.get( this )[ role ].slice( 0, limit );

		if ( result.length > 0 ) {

			return {
				leads: result
			};

		}

		return null;
		
	}

	_findMostRecent( role ) {

		const result = Private.get( this )[ role ];

		if ( result.length > 0 ) {

			return {
				leads: result
			};

		}

		return null;

	}

	_findLimit( limit ) {

		const result = {
			seller: [],
			customer: [],
		};

		this._iterator( ( lead, key ) => {

			if ( result[ key ].length < limit ) {

				result[ key ].push( lead );

			}

		} );

		if ( result.seller.length > 0 || result.customer.length > 0 ) {

			return result;

		}

		return null;

	}

	_findAll() {
		
		const { seller, customer } = Private.get( this );

		if ( seller.length > 0 || customer.length > 0 ) {

			return { seller, customer };

		}

		return null;
		
	}

	_iterator( callBack, role = null ) {
		
		const leads = Private.get( this );
		
		if ( role !== null ) {
			
			if ( Array.isArray( leads[ role ] ) ) {
				
				for ( let i = 0; i < leads[ role ].length; i++ ) {// O(n)
					
					if ( callBack( leads[ role ][ i ], role, i , leads ) ) {
						break;
					}
					
				}
				
			}
			
		} else {
			
			for ( const key in leads ) { // O(n*m)
				
				if ( leads.hasOwnProperty( key ) ) {
					
					let kik = false;
					
					if ( Array.isArray( leads[ key ] ) ) {
						
						for ( let i = 0; i < leads[ key ].length; i++ ) {
							
							kik = callBack( leads[ key ][ i ], key, i, leads );
							
						}
						
					}
					
					if ( kik ) {
						break;
					}
					
				}
				
			}
			
		}
		
	}

	_sortByTime( leads ) {

		if ( Array.isArray( leads ) ) {

			const timeArray = [];

			leads.forEach( ( lead ) => {

				timeArray.push( lead.updated_at );

			} );

			const sortedTime = timeArray.sort( ( i, ii ) => {
				if ( i > ii ) {
					return -1;
				} else if ( i < ii ) {
					return 1;
				} else {
					return 0;
				}
			} );

			const sortedLeads = [];

			sortedTime.forEach( ( updated_at ) => {

				for ( let i = 0; i < leads.length; i++ ) {

					if ( leads[ i ].updated_at === updated_at ) {

						sortedLeads.push( leads[ i ] );

						break;

					}

				}

			} );

			return sortedLeads;

		}

	}

}

export default new LeadCache();
