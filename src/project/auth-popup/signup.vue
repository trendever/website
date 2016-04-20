<template lang="jade">
popup-wrapper(:show="show", :close="onClose")
  h3 Вход на территорию cвободного шопинга
  button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn(
    @click="onClick") Войти
  a.fast__btn(
    @click.prevent="onClick",
    href="#") &nbsp;Зачем мне это?&nbsp;
</template>

<script type="text/ecmascript-6">
  import popupWrapper from 'base/popup/wrapper.vue'

  export default {
    props: [
      { name: 'show', default: false }
    ],

    methods: {
      onClick() {
        this.onClose();
        this.$router.go({ name: 'signup' });
      },

      onClose() {
        this.$dispatch('show:popup:signup', false);
      },
    },

    watch: {
      show() {
        console.log('show signup!!!')
      }
    },

    components: {
      popupWrapper,
    },
  }
</script>