<template lang="jade">
div.scroll-cnt
  header-component(:title='title', :back-link='{name: "home"}')
  .section.main.top
    .section__content#headerAnchor
      .wall#PostsList
        .wall__post
          post-component
      footer-component
</template>

<style>
  .wall{
    &__post{
      margin: 0 0 40px;
    }
  }
</style>

<script type="text/babel">
  import { openProduct, closeProduct } from 'vuex/actions/products';
  import { getOpenedProduct } from 'vuex/getters/products';

  import HeaderComponent from 'base/header/header.vue';
  import PostComponent from './product-post.vue';
  import FooterComponent from 'base/footer/footer.vue';

  import * as products from 'services/products.js';

  export default {
    components: {
      HeaderComponent,
      PostComponent,
      FooterComponent
    },
    computed: {
      title(){
        if ( this.getOpenedProduct ) {
          return 'Тренд ' + this.getOpenedProduct.code
        }
      }
    },
    vuex: {
      getters: {
        getOpenedProduct
      },
      actions: {
        openProduct,
        closeProduct
      }
    },
    route: {
      activate( { to: { params: { id } } } ) {
        return this.openProduct( +id );
      }
    },
    beforeDestroy(){
      this.closeProduct();
    }
  }
</script>
