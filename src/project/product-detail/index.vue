<template lang="jade">
div.scroll-cnt
  header-component(:title='title')
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

<script>
  import {openProduct} from 'vuex/actions';
  import {openedProduct} from 'vuex/getters';

  import HeaderComponent from 'base/header/header.vue';
  import PostComponent from './product-post.vue';
  import FooterComponent from 'base/footer/footer.vue';

  import * as products from 'services/products.js';

  export default {
    data(){
      return {};
    },
    computed: {
     title(){
       return 'Тренд ' + this.openedProduct.product.code
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
        let self = this;

        return this.openProduct(+id).catch( (error) => {
          console.error(new Error('Product doesn`t exists or error'), {
            extra: {errorData: error.response, id: id}
          });
          self.$router.go({name: '404'});
        })
      },
    },
    components: {
      HeaderComponent,
      PostComponent,
      FooterComponent
    }
  }
</script>
