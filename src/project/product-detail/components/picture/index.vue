<template>
  <div class="picture">
    <img class="img" :src="img" alt="">
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
    props: {
      img:{
        type: String,
        default: null
      }
    }
  }
</script>
