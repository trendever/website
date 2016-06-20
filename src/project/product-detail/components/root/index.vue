<template>
  <div>
    <user img="11111" code="22222" name="wqdqwdqwd" last-update="1 день"></user>
  </div>
</template>

<style scoped lang="postcss">
  @use postcss-autoreset {
    reset: {
      all: initial;
      sizes: 0;
    }
  }
  @use postcss-initial {
    reset: inherited;
  }
</style>

<script type="text/babel">
  import user from '../user-info/index.vue'
  export default {
    components: {
      user
    }
  }
</script>
