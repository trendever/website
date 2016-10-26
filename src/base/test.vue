<template lang="jade">
div
  router-link(:to="{name: 'one'}") one
  router-link(:to="{name: 'home'}") home
  h1 Привет

</template>

<script>
export default {


  data () {
    return {

    };
  }
};
</script>

<style lang="css" scoped>
</style>
