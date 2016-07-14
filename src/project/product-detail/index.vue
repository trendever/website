<template lang="jade">
scroll-component(v-el:scroll-cnt)
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
  import { openProduct, closeProduct, setScrollByProduct } from 'vuex/actions/products';
  import { getOpenedProduct, getScrollTopOfProduct } from 'vuex/getters/products';

  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue';
  import PostComponent from './components/root/index.vue';
  import listener from 'event-listener';

  export default {
    components: {
      ScrollComponent,
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
        getOpenedProduct,
        getScrollTopOfProduct
      },
      actions: {
        openProduct,
        closeProduct,
        setScrollByProduct
      }
    },
    route: {
      activate( { to: { params: { id } } } ) {

        return this.openProduct( +id ).then(() => {

          this.scrollListener = listener(this.$els.scrollCnt, 'scroll', () => {

            this.setScrollByProduct(this.$els.scrollCnt.scrollTop);

          });

        });

      },
      canReuse( { to: { params: { id } } } ){
        this.openProduct( +id ).then( () => {
          this.$els.scrollCnt.scrollTop = this.getScrollTopOfProduct;
          this.$broadcast( 'update' )
        } );
        return true;
      }
    },
    beforeDestroy(){
      this.scrollListener.remove();
      this.closeProduct();
    }
  }
</script>
