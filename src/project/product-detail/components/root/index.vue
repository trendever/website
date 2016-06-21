<template>
  <div>
    <user img="11111" code="22222" name="wqdqwdqwd" last-update="1 день"></user>
    <template v-for="product of products">
      <product :name="product.name" :old-price="product.oldPrice" :price="product.price"></product>
    </template>
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
  import product from '../products/index.vue'
  export default {

    data(){

      return {
        products:[
          {
            name:'Это название продкута которое указывается в его названиии в элом это очень длинное название)))',
            oldPrice: 20000,
            price: 10000
          },
          {
            name:'111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111',
            oldPrice: null,
            price: 10000
          },
          {
            name:'222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
            oldPrice: 20000,
            price: null
          },
          {
            name:'222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222',
            oldPrice: null,
            price: null
          }
        ]
      }

    },

    components: {
      user,
      product
    }
  }
</script>
