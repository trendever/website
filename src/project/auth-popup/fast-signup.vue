<template lang="jade">
popup-wrapper(:show="show", :close="onClose")
  .column-desktop-50.column-desktop-right
    p.desktop-text-right Войдите, чтобы искать и покупать#[br]товары лучших инста-шопов #[span.emoji.emoji_kitty]
  .column-desktop-50.column-desktop-left
    .container-left
      button.btn.btn_primary.__orange.__xl.hello__btn.fast__big__btn(
        @click="onClick") Войти
      .link-container
        a.link-bottom(
          @click.prevent="onClick",
          href="#") Зачем мне это?
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
        this.$dispatch('show:popup:fast-signup', false);
      },
    },

    components: {
      popupWrapper,
    },
  }
</script>