<template lang="jade">
div(class="popup" v-if="show")
  popup-wrapper(:show="show" close="onClose")
    .column-desktop-50.column-desktop-right
      a.desktop-text-right.show-video( v-link="{ name: 'info-user' }", href='' )
        | КАК ЭТО РАБОТАЕТ?
    .column-desktop-50.column-desktop-left
      .container-left
        button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn( v-link="{ name: 'app' }" v-if="isMobile &&!isStandalone") {{getButtonText()}}
        template(v-else)
          button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn( v-link="{ name: 'signup' }" v-if="isStandalone") ВХОД И РЕГИСТРАЦИЯ
          appstore-link(v-else)

</template>

<script type="text/babel">

  import { isAuth } from 'vuex/getters/user.js';
  import popupWrapper from 'base/popup/wrapper.vue'
  import AppstoreLink from 'base/appstore-link/appstore-link';

  export default {
    vuex: {
      getters: {
        isAuth,
      },
    },
    methods: {
      onClose(){

      },
      getButtonText(){
        switch (this.$route.name){
          case 'product_detail': return 'КУПИТЬ В ПРИЛОЖЕНИИ'; break;
          case 'user': return 'ОТКРЫТЬ В ПРИЛОЖЕНИИ'; break;
          default: return 'СКАЧАТЬ ПРИЛОЖЕНИЕ'; break;
        }
      }
    },
    computed:{
      productDetailPage(){
        return this.$route.name === 'product_detail'
      },
      profilePage(){
        return this.$route.name === 'user';
      },
      isMobile(){
        return browser.mobile;
      },
      isStandalone(){
        return browser.standalone;
      },
      show() {
        return !this.isAuth && !this.isException
      },
      isException(){
        let excludePages = [
          'info-mission',
          'info-user',
          'info-shop',
          'signup',
          '404',
          'contest',
          'comfirm-sms',
          'product_detail'
        ];
        return excludePages.indexOf(this.$route.name) > -1;
      }
    },

    components: {
      popupWrapper,
      AppstoreLink
    }
  }

</script>
