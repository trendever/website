<template lang="jade">
div
  native-popup(:show-popup="showPopup")
    .main-text
      | Мы видим товары, где вы указаны как поставщик. Вы собираетесь их продавать?
    .button-text
      span(v-on:click="goInstructions") Да
      span(v-on:click="disableSupplier") Нет
</template>

<script>
import settings from 'settings';
import channel from 'services/channel/channel';
import NativePopup from 'base/popup/native';
import { getAuthUser, isAuth } from 'vuex/getters/user';
import { setUseDays } from 'vuex/actions/user';
import { setSupplierStatus } from 'vuex/actions/user';

let storage = window.localStorage;

export default {
  components: {
    NativePopup
  },
  vuex: {
    getters: {
      getAuthUser,
      isAuth
    },
    actions: {
      setUseDays,
      setSupplierStatus
    }
  },
  data () {

    return {
      day: 60 * 60 * 24,
      showPopup: false
    };

  },

  methods:{
    disableSupplier(){
      this.showPopup = false;
      this.setSupplierStatus(false);
      storage.setItem('supplierStatus', 'disabled');
    },
    goInstructions(){
      this.showPopup = false;
      this.setSupplierStatus(true);
      storage.setItem('supplierStatus', 'active');
      storage.setItem('showMonetization','firstTimeAlert');
      this.$router.go({name: 'info-instructions-1'})
    }
  },

  ready() {

    if(!settings.activateMonetization){

      return;

    } else {

      this.$nextTick(() => {

        if(this.isAuth) {

          if(this.getAuthUser.supplier_of === null) {

            return;
          }

          let shop_id = this.getAuthUser.supplier_of[0];

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

                if (difference <= this.day){
                  this.setUseDays(7)
                  return { timeOut, difference }
                }
                if (difference <= this.day * 2){
                  this.setUseDays(6)
                  return { timeOut, difference }
                }

                if (difference <= this.day * 3 ){
                  this.setUseDays(5)
                  return { timeOut, difference }
                }

                if (difference <= this.day * 4){
                  this.setUseDays(4)
                  return { timeOut, difference }
                }

                if(difference <= this.day * 5) {
                  this.setUseDays(3)
                  return { timeOut, difference }
                }

                if(difference <= this.day * 6) {
                  this.setUseDays(2)
                  return { timeOut, difference }
                }

                if(difference <= this.day * 7) {
                  this.setUseDays(1)
                  return { timeOut, difference }
                }

                if(difference > this.day * 7) {
                  this.setUseDays(0)
                  return { timeOut, difference }

                }

              }).then(({timeOut, difference})=>{

                let showMonetization = storage.getItem('showMonetization');

                if(difference <= this.day * 2 || storage.getItem('supplierStatus') === 'disabled') {

                  if(showMonetization === 'firstTimeAlert'){
                    return;
                  }

                  setTimeout(()=>{
                    this.showPopup = true;
                  }, timeOut)

                  return

                }

                if(difference > this.day * 2 && difference <= this.day * 3) {

                  if(showMonetization === 'fiveDaysLeft'){
                    return;
                  }

                  setTimeout(()=>{
                    storage.setItem('showMonetization','fiveDaysLeft');
                    this.$router.go({name: 'monetization'})
                  }, timeOut)
                  return
                }

                if(difference > this.day * 7) {
                  setTimeout(()=>{
                    storage.setItem('showMonetization','noMoreDays');
                    this.$router.go({name: 'monetization'})
                  }, timeOut)

                  return

                }
              })
          }
        }

      })
    }
  }
};

</script>


