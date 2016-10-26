<template>
  <div></div>
</template>

<script>
import settings from 'settings';
import channel from 'services/channel/channel';

import { getAuthUser, isAuth } from 'vuex/getters/user';

export default {
  vuex: {
    getters: {
      getAuthUser,
      isAuth
    }
  },
  ready(){

    this.$nextTick(()=>{

      if(this.isAuth) {

        let shop_id;

        if(this.getAuthUser.supplier_of){

          shop_id = this.getAuthUser.supplier_of[0];

        }

        if(shop_id) {

          channel

            .req('retrieve','shop',{shop_id: shop_id })

            .then(data=>{

              return data.response_map.shop.created_at;

            })

            .then(date=>{

              let timeOut = 3000;

              let nowTime = +new Date()/1000;

              let difference = nowTime - date;

              if(difference < 3600 * 24){

                setTimeout(()=>{

                  this.$router.push({name: 'info-instructions-1'})

                }, timeOut)
              }

            })
        }
      }

    })

  }
};
</script>


