<template>
  <div class="products">
    <div class="name">{{name}}</div>
    <div class="numbers">
      <span class="oldPrice" v-if="!isNotPrice">{{oldPrice}}</span>
      <span class="price" v-if="!isNotPrice">{{price}}</span>
      <span class="price" v-if="isNotPrice">?</span>
      <i class="ic-currency-rub rub"></i>
    </div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
    props: {
      name: {
        type: String,
        default: null
      },
      oldPrice: {
        type: Number,
        default: null
      },
      price: {
        type: Number,
        default: null
      },
    },
    computed: {
      isNotPrice(){

        return !!(this.oldPrice === null && this.price === null);

      }
    }
  }
</script>
