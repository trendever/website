<template lang="jade">
div
  header-component(
    :title="title")
  .section.main.top
    .section__content#headerAnchor
      .wall#PostsList
        .wall__post
          post-component
      footer-component
      navbar-component(current="feed")
</template>

<style>
  .wall{
    &__post{
      margin: 0 0 40px;
    }
  }
</style>

<script>
  import {openProduct} from 'vuex/actions';
  import {openedProduct} from 'vuex/getters';

  import HeaderComponent from 'base/header/header.vue';
  import NavbarComponent from 'base/navbar/navbar.vue';
  import PostComponent from './product-post.vue';
  import FooterComponent from 'base/footer/footer.vue';

  import * as products from 'services/products.js';
  import { getFromCache } from 'services/actions';

  export default {
    data: () => ({
    }),
    computed: {
     title(){
       return "Код товара " + this.openedProduct.product.code
     }
    },
    vuex: {
      getters: {
        openedProduct
      },
      actions: {
        openProduct
      }
    },
    route: {
      activate({to: {params: { id }}}) {
        return this.openProduct(+id).catch( error => {
          this.$route.router.go({name: '404'});
        })
      },
    },
    components: {
      HeaderComponent,
      NavbarComponent,
      PostComponent,
      FooterComponent
    }
  }
</script>
