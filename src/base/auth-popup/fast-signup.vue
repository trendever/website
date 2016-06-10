<template lang="jade">
div(class="popup" v-if="show")
  popup-wrapper(:show="show" close="onClose")
    .column-desktop-50.column-desktop-right
      a.desktop-text-right.show-video( v-link="{ name: 'info-user' }", href='' )
        | Зачем мне Trendever?
    .column-desktop-50.column-desktop-left
      .container-left
        button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn( v-link="{ name: 'signup' }") Войти
        .link-container
          a.link-bottom( v-link="{ name: 'signup' }", href='') Зачем мне это?
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
      show() {
        return !this.isAuth && !this.isException
      },
      isException(){
        let excludePages = [
          'info-mission',
          'info-user',
          'info-shop',
          'signup',
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
