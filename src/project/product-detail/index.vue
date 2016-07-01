<template lang="jade">
div.scroll-cnt(v-el:scroll-cnt)
  header-component(
    :title='title',
    :back-link='{name: "home"}',
    :center-text-link="centerTextLink",
    :avatar-url='avatarUrl')
  .section.main.top
    .section__content
      post-component
</template>

<script type="text/babel">
  import { openProduct, closeProduct } from 'vuex/actions/products';
  import { getOpenedProduct } from 'vuex/getters/products';

  import HeaderComponent from 'base/header/header.vue';
  import PostComponent from './components/root/index.vue';

  export default {
    components: {
      HeaderComponent,
      PostComponent
    },
    computed: {

      title(){
        if ( this.getOpenedProduct ) {
          return 'Тренд от ' + this.supplierName
        }
      },

      supplier(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.supplier ) {

            return this.getOpenedProduct.supplier

          }

        }

        return null

      },

      supplierName(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.supplier ) {

            if ( this.getOpenedProduct.supplier.instagram_username ) {

              return this.getOpenedProduct.supplier.instagram_username

            }

          }

        }

        return null;

      },

      avatarUrl(){

        if ( this.supplier !== null ) {

          return this.supplier.avatar_url || this.supplier.instagram_avatar_url

        }

        return null;

      },

      centerTextLink(){

        if ( this.supplierName !== null ) {

          return { name: "user", params: { id: this.supplierName } };

        }

        return null;

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
      },
      canReuse( { to: { params: { id } } } ){
        this.openProduct( +id ).then( () => {
          this.$els.scrollCnt.scrollTop = 0;
          this.$broadcast( 'update' )
        } );
        return true;
      }
    },
    beforeDestroy(){
      this.closeProduct();
    }
  }
</script>
