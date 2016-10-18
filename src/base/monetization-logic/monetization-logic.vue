<template lang="jade">
div
</template>

<script>
import channel from 'services/channel/channel';

import { getAuthUser, isAuth } from 'vuex/getters/user';


export default {
  vuex: {
    getters: {
      getAuthUser,
      isAuth
    }
  },
  data () {
    return {
      sevenDays: 60 * 60 * 24 * 7,
      threeDays: 60 * 60 * 24 * 3
    };
  },
  ready() {

    this.$nextTick(()=>{

      if(this.isAuth) {

        let shop_id = this.getAuthUser.supplier_of[0];

        if(shop_id) {

          channel

            .req('retrieve','shop',{shop_id: shop_id })

            .then(data=>{

              return data.response_map.shop.created_at;

            })

            .then(date=>{

              let nowTime = +new Date()/1000;

              let difference = nowTime - date;

              if (difference <= this.threeDays){

                setTimeout(()=>{

                  this.$router.go({name: 'monetization',query: { lessThan: 3 }})

                }, 100)

              }

              if (difference <= this.sevenDays && difference >= this.threeDays){

                setTimeout(()=>{

                  this.$router.go({name: 'monetization',query: { moreThan: 3 }})

                }, 100)

              }

              if(difference >= this.sevenDays) {

                setTimeout(()=>{

                  this.$router.go({name: 'monetization',query: { moreThan: 7 }})

                }, 100)

              }

          });
        }
      }

    })

  }
};

</script>


