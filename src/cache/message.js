const Private          = new WeakMap();
const availableForSave = 24;
const initMessageCount = 12;
class MessageCache {
	
	constructor() {
		
		Private.set( this, {} );

		this.has                   = this.has.bind( this );
		this.find                  = this.find.bind( this );
		this.addOldMessage         = this.addOldMessage.bind( this );
		this.addReceiveMessage     = this.addReceiveMessage.bind( this );
		this.commit                = this.commit.bind( this );
		this.init                  = this.init.bind( this );
		this._findIndexByMessageId = this._findIndexByMessageId.bind( this );
		
	}

	_findIndexByMessageId( conversation_id, from_message_id ) {
		
		const conversations = Private.get( this );
		
		if ( conversations.hasOwnProperty( conversation_id ) ) {
			
			const data = conversations[ conversation_id ];
			
			for ( let i = data.length; i; i-- ) {
				
				if ( data[ i - 1 ].id < from_message_id ) {
					
					return i;
					
				}
				
			}
			
		}
		
		return null;
		
	}
	
	has( conversation_id, from_message_id ) {
		
		return this._findIndexByMessageId( conversation_id, from_message_id ) !== null;
		
	}
	
	find( conversation_id, from_message_id, limit = 12 ) {
		
		return new Promise( ( resolve ) => {
			
			const index = this._findIndexByMessageId( conversation_id, from_message_id );
			
			if ( index === null ) {
				
				resolve( [] );
				
			} else {
				
				const data  = Private.get( this )[ conversation_id ];
				const begin = index - limit;
				
				resolve( data.slice( (begin >= 0) ? begin : 0, index ) );
				
			}
			
		} );
		
	}
	
	addOldMessage( conversation_id, messages ) {
		
		const conversations = Private.get( this );
		
		if ( !conversations.hasOwnProperty( conversation_id ) ) {
			
			conversations[ conversation_id ] = [];
			
		}
		
		if ( Array.isArray( messages ) ) {
			
			conversations[ conversation_id ] = messages.concat( conversations[ conversation_id ] );
			
		}

		const dataLength = conversations[ conversation_id ].length;
		
		if (dataLength <= (availableForSave + initMessageCount) ) {
			
			this.commit( conversation_id );

		}

	}

	addReceiveMessage( conversation_id, messages ) {

		const conversations = Private.get( this );

		if ( !conversations.hasOwnProperty( conversation_id ) ) {

			conversations[ conversation_id ] = [];

		}

		if ( Array.isArray( messages ) ) {

			conversations[ conversation_id ] = conversations[ conversation_id ].concat( messages );

		}

		this.commit( conversation_id );

	}

	commit( conversation_id ) {
		
		const conversations = Private.get( this );

		if ( conversations.hasOwnProperty( conversation_id ) ) {

			const data  = conversations[ conversation_id ];
			const end   = data.length - initMessageCount;
			const begin = ((end - availableForSave) < 0) ? 0 : end - availableForSave;
			const gap   = data.slice( begin, end + 1 );

			if (gap.length > 0) {

				localStorage.setItem( `conversation_${conversation_id}`, JSON.stringify( gap ) );

			}

			return data;
			
		}
		
		return null;
		
	}
	
	init( conversation_id, messages ) {

		const conversations = Private.get( this );
		const rowData       = localStorage.getItem( `conversation_${conversation_id}` );

		conversations[ conversation_id ] = messages;

		if ( rowData !== null ) {

			const oldMessage = JSON.parse( rowData );

			if( Array.isArray(oldMessage) ) {

				if(oldMessage.length > 0){

					if(messages[0].id !== oldMessage[oldMessage.length - 1].id){

						localStorage.removeItem(`conversation_${conversation_id}`);

						return true;

					}

				}

				conversations[ conversation_id ] = oldMessage.concat( conversations[ conversation_id ] );

			} else {

				throw new Error('oldMessage - должен быть массив.');

			}

		}


	}
	
}

export default new MessageCache();
