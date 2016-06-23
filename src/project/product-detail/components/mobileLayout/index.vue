<template>
  <div class="mobileLayout">
    <div class="wrapper">
      <user-info
        :img="avatarUrl"
        :code="code"
        :name="name"
        :last-update="lastUpdate"
      ></user-info>
    </div>
    <div class="picture-wrapper">
      <picture :img="picture"></picture>
    </div>
    <div class="wrapper">
      <template v-for="product of products">
        <products
          :name="product.name"
          :price="product.price"
          :old-price="product.oldPrice"
        ></products>
      </template>
      <buttons :is-liked.once="isLiked"></buttons>
    </div>
    <div class="desc-wrapper">
      <description :text="caption"></description>
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
      avatarUrl: {
        type: String,
        default: ''
      },
      code: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      lastUpdate: {
        type: String,
        default: ''
      },
      picture: {
        type: String,
        default: ''
      },
      caption: {
        type: String,
        default: ''
      },
      isLiked: {
        type: Boolean,
        default: false
      },
    },
  }
</script>
