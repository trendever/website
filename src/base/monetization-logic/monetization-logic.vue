<template>
</template>

<script>
import channel from 'services/channel/channel';

import { authUser } from 'vuex/getters/user';

export default {
  vuex: {
    getters: {
      authUser
    }
  },
  data () {
    return {
      sevenDays: 60 * 60 * 24 * 7,
      threeDays: 60 * 60 * 24 * 3
    };
  },
  ready() {

    let shop_id = this.authUser.supplier_of[0];

    if(shop_id) {

      channel
        .req('retrieve','shop',{shop_id: shop_id })
        .then(data=>{

          return data.response_map.shop.created_at;

        }).then(date=>{

            let nowTime = +new Date()/1000;

            let difference = nowTime - date;

            if (difference <= this.threeDays){

              setTimeout(()=>{

                router.go({name: 'monetization',query: { lessThan: 3 }})

              }, 60 * 1000)

            }

            if (difference <= this.sevenDays && difference >= this.threeDays){

              setTimeout(()=>{

                router.go({name: 'monetization',query: { moreThan: 3 }})

              }, 60 * 1000)

            }

            if(difference >= this.sevenDays) {

              setTimeout(()=>{

                router.go({name: 'monetization',query: { moreThan: 7 }})

              }, 60 * 1000)

            }

        });
    }
  }
};

</script>


