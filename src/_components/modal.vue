<template lang="jade">
.modal(v-if="show" transition="modal")
  .modal__mask
    .modal__overlay(@click="hide")
    .modal__mask__wrapper
      .modal__container
        .modal__close(
          v-show="show_close_btn"
          @click="hide")
          i.ic-close

        slot(name="title")
        slot(name="body")
</template>

<style>
  .modal-enter .modal__container,
  .modal-leave .modal__container {
    opacity: 0;
    -webkit-transform: scale(1.1);
    transform: scale(1.1);
  }
</style>

<script>
  var w = window;

  export default{
    props: {
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      },
      show_close_btn: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      show() {
        if (this.show) {
          w.addClass("body", "lock")
        } else {
          w.removeClass("body", "lock")
        }
      }
    },
    created() {
      this.$on('hook:beforeDestroy', () => {
        w.removeClass("body", "lock")
      });
    },
    methods: {
      hide() {
        this.$set('show', false);
      },
    },
  }
</script>

