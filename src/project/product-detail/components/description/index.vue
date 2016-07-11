<template>
  <div v-if="text.length > 0" class="description">
    <div class="bubble bubbleLeft">
      <p class="text">{{text}}</p>
    </div>
  </div>

</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
    props: {
      text:{
        type: String,
        default: ''
      }
    }
  }
</script>
