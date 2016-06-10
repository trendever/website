<style src='./wrapper.pcss'></style>
<template lang="jade">
.popup-wrapper()
  slot
</template>

<script type='text/ecmascript-6'>
export default {
  props: [
    { name: 'show', required: true },
    { name: 'close', required: true },
  ],

  data: () => ({
  }),

  methods: {
    onClose() {
      this.$get('close')();
    },
  }
}
</script>
