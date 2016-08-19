import channel from 'services/channel/channel.js';

export function retrieve({ shop_id }) {

    return new Promise((resolve, reject)=>{

        channel.req('card', 'retrieve', { shop_id })
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

        channel.req('card', 'create', { shop_id, card_name, card_number })

        .then(data => {
            resolve(data.response_map);
        })

        .catch(error => {
            reject({ code: '', response: error });
        });
    })
}


export function deleteCard({ shop_id }) {

    return new Promise((resolve, reject)=>{

        channel.req('card', 'delete', { card_id })
            .then(data => {
                resolve(data.response_map);
            })
            .catch(error => {
                reject({ code: '', response: error })
            });
    })
}
