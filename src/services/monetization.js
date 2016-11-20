export function get_plan(plan_id){

	return new Promise((resolve, reject)=>{

		channel

			.req( 'get_plan' , 'monetization' , { plan_id } )

			.then( data => {

				resolve( data.response_map )

			} )
		
	})

}

export function plans_list (currency){

	return new Promise((resolve, reject)=>{

		channel

			.req( 'plans_list' , 'monetization' , { currency } )

			.then( data => {

				resolve( data.response_map )

			} )
		
	})

}

export function coins_offers (currency, offer_id){

	return new Promise((resolve, reject)=>{

		channel

			.req( 'coins_offers' , 'monetization' , { currency, offer_id } )

			.then( data => {

				resolve( data.response_map )

			} )
		
	})

}

export function buy_coins ( offer_id, gateway ){

	return new Promise((resolve, reject)=>{

		channel

			.req( 'buy_coins' , 'monetization' , { offer_id, gateway } )

			.then( data => {

				resolve( data.response_map )

			} )
		
	})

}

export function subscribe ( plan_id, shop_id ){

	return new Promise((resolve, reject)=>{

		channel

			.req( 'subscribe' , 'monetization' , { plan_id, shop_id  } )

			.then( data => {

				resolve( data.response_map )

			} )
		
	})

}




