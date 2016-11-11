<template lang="jade">
scroll-component(v-el:scroll-cnt)
  header-component(
    :title='title',
    :center-text-link="centerTextLink",
    :page="page",
    :avatar-url='avatarUrl',
    :show-desktop-arrow="false")
    right-nav-component(slot="content", current="")
  .section.main.top.little-padding
    .section__content
      post-component
</template>

<script type="text/babel">
  import { isAuth } from 'vuex/getters/user';
  import { openProduct, closeProduct, setScrollByProduct } from 'vuex/actions/products';
  import { getOpenedProduct, getScrollTopOfProduct } from 'vuex/getters/products';
  import { checkIsUserProduct } from 'vuex/actions/products';
  import RightNavComponent from 'base/right-nav';
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue';
  import PostComponent from './components/root/index.vue';
  import listener from 'event-listener';

  export default {
    components: {
      RightNavComponent,
      ScrollComponent,
      HeaderComponent,
      PostComponent
    },
    ready() {

      if(this.isAuth){

        this.checkIsUserProduct()
        
        .then(()=>{

          this.$broadcast('isAuthProduct');

        })

      }
  
    },
    computed: {

      title(){
        if ( this.getOpenedProduct ) {
          return this.supplierName
        }
      },

      page(){
        return "product";
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
        getScrollTopOfProduct,
        isAuth
      },
      actions: {
        openProduct,
        closeProduct,
        setScrollByProduct,
        checkIsUserProduct
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
      this.$store.state.products.authUserProduct = false;
    }
  }
</script>
