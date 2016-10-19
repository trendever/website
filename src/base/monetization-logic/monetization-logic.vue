<template lang="jade">
div
</template>

<script>
import channel from 'services/channel/channel';

import { getAuthUser, isAuth } from 'vuex/getters/user';
import { setUseDays } from 'vuex/actions/user';

export default {
  vuex: {
    getters: {
      getAuthUser,
      isAuth
    },
    actions: {
      setUseDays
    }
  },
  data () {

    return {
      day: 60 * 60 * 24,
    };

  },


  ready() {

    this.$nextTick(() => {

      if(this.isAuth) {

        let shop_id = this.getAuthUser.supplier_of[0];

        if(shop_id) {

          channel

            .req('retrieve','shop',{shop_id: shop_id })

            .then(data=>{

              return data.response_map.shop.created_at;

            })

            .then(date=>{

              let timeOut = 100;

              let nowTime = +new Date()/1000;

              let difference = nowTime - date;

              if (difference <= this.day){

                setTimeout(()=>{
                  this.setUseDays(7)
                  this.$router.go({name: 'monetization'})

                }, timeOut)

                return

              }

              if (difference <= this.day * 2){

                setTimeout(()=>{
                  this.setUseDays(6)
                  this.$router.go({name: 'monetization'})

                }, timeOut)

                return

              }

              if (difference <= this.day * 3 ){

                setTimeout(()=>{
                  this.setUseDays(5)
                  this.$router.go({name: 'monetization'})

                }, timeOut)

                return

              }

              if (difference <= this.day * 4){

                setTimeout(()=>{
                  this.setUseDays(4)
                  this.$router.go({name: 'monetization'})

                }, timeOut)

                return

              }

              if(difference <= this.day * 5) {

                setTimeout(()=>{
                  this.setUseDays(3)
                  this.$router.go({name: 'monetization'})

                }, timeOut)

                return

              }

              if(difference <= this.day * 6) {

                setTimeout(()=>{
                  this.setUseDays(2)
                  this.$router.go({name: 'monetization'})

                }, timeOut)

                return

              }

              if(difference <= this.day * 7) {

                setTimeout(()=>{
                  this.setUseDays(1)
                  this.$router.go({name: 'monetization'})

                }, timeOut)

                return

              }

              if(difference > this.day * 7) {

                setTimeout(()=>{
                  this.setUseDays(0)
                  this.$router.go({name: 'monetization'})

                }, timeOut)

                return

              }

          });
        }
      }

    })

  }
};

</script>


