<template>
  <div class="mobileLayout">
    <div class="wrapper">
      <user-info
        img="'http://vsenovoe.info/wp-content/images/2014/03/BMW-R1200S.jpg'"
        code="111112223333"
        name="33333333334445345345"
        last-update="1 день"
      ></user-info>
    </div>
    <div class="picture-wrapper">
      <picture :img="'http://vsenovoe.info/wp-content/images/2014/03/BMW-R1200S.jpg'"></picture>
    </div>
    <div class="wrapper">
      <template v-for="product of products">
        <products
          :name="product.name"
          :price="product.price"
          :old-price="product.oldPrice"
        ></products>
      </template>
      <buttons></buttons>
    </div>
    <div class="desc-wrapper">
      <description></description>
    </div>
  </div>

</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import picture from '../picture/index.vue';
  import userInfo from '../user-info/index.vue';
  import products from '../products/index.vue';
  import buttons from '../buttons/index.vue';
  import description from '../description/index.vue';

  export default {
    components: {
      picture,
      userInfo,
      products,
      buttons,
      description
    },
    props: {
      products: {
        type: Array,
        default: []
      },
    },
  }
</script>
