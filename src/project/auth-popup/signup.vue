<template lang="jade">
popup-wrapper(:show='isShowPopupSignup', :close='onClose')
  h3 Вход на территорию cвободного шопинга
  button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn(
    @click='onClick') Войти
  a.fast__btn(
    @click.prevent='onClick',
    href='#') &nbsp;Зачем мне это?&nbsp;
</template>

<script type='text/ecmascript-6'>
  import popupWrapper from 'base/popup/wrapper.vue'
  import {
    isShowPopupSignup,
    isShowPopupFastSignup,
  } from 'vuex/getters';
  import {
    hidePopupSignup,
    showPopupFastSignup,
  } from 'vuex/actions';

  export default {
    vuex: {
      getters: {
        isShowPopupSignup,
      },
      actions: {
        hidePopupSignup,
        showPopupFastSignup,
      }
    },

    methods: {
      onClick() {
        this.onClose();
        this.$router.go({ name: 'signup' });
      },

      onClose() {
        this.hidePopupSignup();
      },
    },

    components: {
      popupWrapper,
    },
  }
</script>