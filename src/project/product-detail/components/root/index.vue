<template>
  <div>
    <mobile-layout
      v-if="isSmall"
      :products="products"
      :avatar-url="avatarUrl"
      :code="code"
      :name="name"
      :tags="tags"
      :picture="picture"
      :caption="caption"
      :is-liked="isLiked"
      last-update="29 дней"

    ></mobile-layout>
    <desktop-layout
      v-if="!isSmall"
      :products="products"
      :avatar-url="avatarUrl"
      :code="code"
      :name="name"
      :tags="tags"
      :picture="picture"
      :caption="caption"
      :is-liked.once="isLiked"
      last-update="29 дней"

    ></desktop-layout>

    <div class="products"></div>

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

  import listen from 'event-listener'
  import mobileLayout from '../mobileLayout/index.vue'
  import desktopLayout from '../desktopLayout/index.vue'
  import { getOpenedProduct, isLiked } from 'vuex/getters/products'

  export default {
    data(){
      return {
        isSmall: false
      }
    },
    components: {
      mobileLayout,
      desktopLayout
    },
    ready(){

      console.log( JSON.parse( JSON.stringify( this.getOpenedProduct ) ) );

      const resize = () => {

        if ( window.matchMedia( "(max-width: 750px)" ).matches !== this.isSmall ) {

          this.$set( 'isSmall', window.matchMedia( "(max-width: 750px)" ).matches );

        }

      };

      this.resizeLayout = listen( window, 'optimizedResize', resize );

      resize();

    },

    beforeDestroy(){

      this.resizeLayout.remove();

    },

    computed: {

      supplier(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.supplier ) {

            return this.getOpenedProduct.supplier;

          }

        }

        return null;

      },

      mentioned(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.mentioned ) {

            return this.getOpenedProduct.mentioned;

          }

        }

        return null;
      },

      caption(){

        if ( this.supplier !== null ) {

          return this.supplier.instagram_caption;

        }

        return '';

      },

      avatarUrl(){

        if ( this.supplier !== null ) {

          return this.supplier.avatar_url || this.supplier.instagram_avatar_url;

        }

        return '';

      },

      picture(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.instagram_images ) {

           const picture = this.getOpenedProduct.instagram_images.find( (item) => {

              return item.name === 'M_square';

            } );

            const img = new Image();

            img.load( picture.url, null, null, () => {
              this.imageOpacity = 1;
            } );

            return picture.url;

          }

        }

        return '';

      },

      code(){

        if ( this.getOpenedProduct ) {

          return this.getOpenedProduct.code;

        }

        return '';

      },

      name(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.mentioned ) {

            if ( this.getOpenedProduct.mentioned.instagram_username ) {

              return this.getOpenedProduct.mentioned.instagram_username;

            }

          }

        }

        return '';

      },

      products(){

        if ( this.getOpenedProduct ) {

          if ( Array.isArray( this.getOpenedProduct.items ) ) {

            return this.getOpenedProduct.items.map( ( { name = null, price = null, oldPrice = null } ) => {

              return { name, price, oldPrice };

            } );

          }

        }

        return [];
      },

      tags(){

        if ( this.getOpenedProduct ) {

          if ( Array.isArray( this.getOpenedProduct.items ) ) {

            return this.getOpenedProduct.items.reduce( ( prevTags, { tags = [] } ) => {

              return prevTags.concat( tags );

            }, [] );

          }

        }

        return [];
      }

    },

    vuex: {
      getters: {
        getOpenedProduct,
        isLiked
      }
    }
  }
</script>
