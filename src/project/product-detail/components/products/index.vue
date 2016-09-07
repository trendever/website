<template>
  <div class="products" v-if="isName">
    <div class="name">{{name}}</div>
    <div class="numbers" v-if="!isNotPrice">
      <span class="price" v-if="price !== null && discountPrice !== null">{{price | curency_spaces}}</span>
      <span class="discountPrice" v-if="discountPrice !== null">{{discountPrice | curency_spaces}}</span>
      <span class="discountPrice" v-if="discountPrice === null && price !== null">{{price | curency_spaces}}</span>
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
      discountPrice: {
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

        return !!(this.discountPrice === null && this.price === null);

      }
    }
  }
</script>