<template lang="jade">
div(class="popup" v-if="show")
  popup-wrapper(:show="show" close="onClose")
    .column-desktop-50.column-desktop-right
      span.desktop-text-right.show-video Смотрите видео о Trendever
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
  import {
    isAuth,
  } from 'vuex/getters';

  import popupWrapper from 'base/popup/wrapper.vue'

  export default {
    data: () => ({}),

    vuex: {
      getters: {
        isAuth,
      }
    },

    methods: {
      onClose() {},
    },

    computed:{
      show() {
        return !this.isAuth && !this.isException
      },
      isException(){
        if (this.$route.name === 'why') {
          return true
        } else if (this.$route.name === 'info') {
          return true
        } else if (this.$route.name === 'signup') {
          return true
        } else if (this.$route.name === 'comfirm-sms') {
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
