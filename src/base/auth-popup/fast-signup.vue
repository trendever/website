<template lang="jade">
div(class="popup" v-if="show")
  popup-wrapper(:show="show" close="onClose")
    .column-desktop-50.column-desktop-right
      p.desktop-text-right Войдите, чтобы искать и покупать#[br]товары лучших инста-шопов #[span.emoji.emoji_kitty]
    .column-desktop-50.column-desktop-left
      .container-left
        button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn(
          v-link="{ name: 'signup' }") Войти
        .link-container
          a.link-bottom(
            v-link="{ name: 'signup' }",
            href='#') Зачем мне это?
</template>

<script>
  import store from 'vuex/store';
  import {
    isAuth,
    isShowPopupFastSignup,
  } from 'vuex/getters';
  import {
    showPopupFastSignup,
    hidePopupFastSignup,
  } from 'vuex/actions';
  import popupWrapper from 'base/popup/wrapper.vue'

  export default {
    data: () => ({}),

    vuex: {
      actions: {
        hidePopupFastSignup,
      },
      getters: {
        isAuth,
        isShowPopupFastSignup,
      }
    },

    ready() {
      if (!this.isAuth) {
        showPopupFastSignup(store);
      }
    },

    methods: {
      onClose() {
        this.hidePopupFastSignup()
      },
    },

    computed:{
      show() {
        return this.isShowPopupFastSignup && !this.isException
      },
      isException(){
        if (this.$route.name === 'why') {
          return true
        } else if (this.$route.name === 'info') {
          return true
        } else if (this.$route.name === 'signup') {
          return true
        } else if (this.$route.name === 'confirm-sms') {
          return true
        }
        return false
      }
    },

    components: {
      popupWrapper,
    },
  }
</script>
