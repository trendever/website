<template lang="jade">
div(class="popup" v-if="show")
  popup-wrapper(:show="show" close="onClose")
    .column-desktop-50.column-desktop-right
      a.desktop-text-right.show-video( v-link="{ name: 'info-user' }", href='' )
        | КАК ЭТО РАБОТАЕТ?
    .column-desktop-50.column-desktop-left
      .container-left
        button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn( v-link="{ name: 'app' }" v-if="isMobile && !isStandalone") СКАЧАТЬ ПРИЛОЖЕНИЕ
        button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn( v-link="{ name: 'signup' }" v-else) ВХОД И РЕГИСТРАЦИЯ
        
</template>

<script type="text/babel">

  import { isAuth } from 'vuex/getters/user.js';
  import popupWrapper from 'base/popup/wrapper.vue'

  export default {
    vuex: {
      getters: {
        isAuth,
      },
    },
    methods: {
      onClose(){

      }
    },
    computed:{
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
          'comfirm-sms'
        ];
        return excludePages.indexOf(this.$route.name) > -1;
      }
    },

    components: {
      popupWrapper
    }
  }

</script>
