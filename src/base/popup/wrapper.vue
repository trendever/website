<style src="./wrapper.pcss"></style>
<template lang="jade">
.popup-wrapper(
  @click.stop.prevent="missClick",
  @touchstart="missClick")
  //- .info__close(@click="onClose"): i.ic-close
  slot
</template>

<script type="text/ecmascript-6">
export default {
  props: [
    { name: 'show', required: true },
    { name: 'close', required: true },
  ],

  data: () => ({
    isMissClick: false,
  }),

  attached() {
    // document.addEventListener('click', this.clickOutService, false);
    // document.addEventListener('touchstart', this.clickOutService, false);
  },

  beforeDestroy() {
    // document.removeEventListener('click', this.clickOutService, false);
    // document.removeEventListener('touchstart', this.clickOutService, false);
  },

  methods: {
    onClose() {
      this.$get('close')();
    },

    clickOutService() {
      if (this.$get('isMissClick')) {
        this.$set('isMissClick', false);
        return;
      }
      this.onClose();
    },

    missClick() {
      this.$set('isMissClick', true);
    },
  }
}
</script>