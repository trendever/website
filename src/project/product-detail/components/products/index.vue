<template>
  <div class="products" v-if="isName && !isNotPrice">
    <div class="name">{{name}}</div>
    <div class="numbers">
      <span class="oldPrice">{{oldPrice}}</span>
      <span class="price">{{price}}</span>
      <!--span class="price">?</span-->
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
      isName(){

        return this.name !== null;

      },
      isNotPrice(){

        return !!(this.oldPrice === null && this.price === null);

      }
    }
  }
</script>
