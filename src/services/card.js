import channel from 'services/channel/channel.js';

export function retrieve({ shop_id }) {

    return new Promise((resolve, reject)=>{

        channel.req('retrieve', 'card', { shop_id })
            .then(data => {
                resolve(data.response_map.cards);
            })
            .catch(error => {
                reject({ code: '', response: error })
            });
    })
}

export function create({ shop_id, card_name, card_number }) {

    return new Promise((resolve, reject)=> {

        channel.req('create', 'card', { shop_id, card_name, card_number })

        .then(data => {
            resolve(data.response_map);
        })

        .catch(error => {
            reject({ code: '', response: error });
        });
    })
}


export function deleteCard({ card_id }) {

    return new Promise((resolve, reject)=>{

        channel.req('delete', 'card', { card_id })
            .then(data => {
                resolve(data.response_map);
            })
            .catch(error => {
                reject({ code: '', response: error })
            });
    })
}


export function createOrder({ amount, currency, lead_id, card }) {

    return new Promise((resolve, reject)=>{

        channel.req('create', 'order', { amount, currency, lead_id, card })
            .then(data => {
                resolve(data.response_map);
            })
            .catch(error => {
                reject({ code: '', response: error })
            });
    })
}
