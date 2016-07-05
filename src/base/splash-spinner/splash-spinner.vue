<template lang="jade">
.splash-spinner
  spinner-component(size=80, color="#399")

</template>

<style>
.splash-spinner {
  position: fixed 0 0 0 0;
  z-index: 999;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<script>
  import SpinnerComponent from 'base/spinner/spinner.vue'

  export default {
    components: {
      SpinnerComponent,
    },
  }
</script>
