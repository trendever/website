<template>
  <div class="picture">
    <img :width="width" :height="height" :src="img">
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
    props: {
      img:{
        type: String,
        default: null
      },
      width:{
        type: String,
        default: '100%'
      },
      height:{
        type: String,
        default: '100%'
      }
    }
  }
</script>
