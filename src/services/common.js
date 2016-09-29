import channel from 'services/channel/channel.js';

export function marketSms( {phone} ) {

	return new Promise( ( resolve, reject ) => {

		channel.req( 'market_sms', 'common', { phone } )
	       	.then(data => {
                resolve(data.response_map.status);
            })
            .catch(error => {
                reject({ code: '', response: error })
            });
	} );

};