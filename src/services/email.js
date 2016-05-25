import channel from 'services/channel/channel.js';

export function create( email, type, comment ) {

	return new Promise( ( resolve, reject ) => {

		channel.req( 'create', 'email', { email, type, comment } )
		       .then( ()=> {
			       resolve();
		       }, reject );

	} );

};