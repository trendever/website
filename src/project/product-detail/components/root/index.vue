<template>
  <div>
    <mobile-layout
      v-if="isSmall"
      :products="products"
      :avatar-url="avatarUrl"
      :code="code"
      :name="mentionedName"
      :tags="tags"
      :picture="picture"
      :caption="caption"
      :is-liked="isLiked"
      last-update="29 дней"
      :is-mobile="isMobile"
      :product-id="productId"
      :like="like"
      :buy="buy"
    ></mobile-layout>
    <desktop-layout
      v-if="!isSmall"
      :products="products"
      :avatar-url="avatarUrl"
      :code="code"
      :name="mentionedName"
      :tags="tags"
      :picture="picture"
      :caption="caption"
      :is-liked="isLiked"
      last-update="29 дней"
      :is-mobile="isMobile"
      :product-id="productId"
      :like="like"
      :buy="buy"
    ></desktop-layout>

    <div class="products" v-if="isProduct">
      <h1 class="title">Больше трендов от {{code}}</h1>
      <photos :list-id="listId" :filter-by-user-name="supplierName"></photos>
    </div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listen from 'event-listener'
  import mobileLayout from '../mobileLayout/index.vue'
  import desktopLayout from '../desktopLayout/index.vue'
  import photos from 'base/photos/photos.vue'
  import { getOpenedProduct, isLiked } from 'vuex/getters/products'
  import { setLike } from 'vuex/actions/products'
  import { isAuth } from 'vuex/getters/user.js'
  import { createLead } from 'vuex/actions/lead.js'
  import { setCallbackOnSuccessAuth } from 'vuex/actions'
  import * as leads from 'services/leads'
  import { ratioFit } from 'utils'

  export default {
    data(){
      return {
        isSmall: false
      }
    },
    components: {
      mobileLayout,
      desktopLayout,
      photos
    },
    ready(){

      const resize = () => {

        if ( window.matchMedia( "(max-width: 750px)" ).matches !== this.isSmall ) {

          this.$set( 'isSmall', window.matchMedia( "(max-width: 750px)" ).matches )

        }

      }

      this.resizeLayout = listen( window, 'optimizedResize', resize )

      resize()

    },

    beforeDestroy(){

      this.resizeLayout.remove()

    },

    methods: {

      // TODO setCallbackOnSuccessAuth - разобраться как это работает.

      like(){

        if ( !this.isAuth ) {

          this.setCallbackOnSuccessAuth( () => {

            this.setLike()
            this.$router.go( { name: "product_detail", params: { id: this.productId } } )

          } )
          this.$router.go( { name: 'signup' } )

        } else {

          this.setLike()

        }

      },
      buy() {

        if ( !this.isAuth ) {

          this.$router.go( { name: 'signup' } )
          this.setCallbackOnSuccessAuth( this.buy.bind( this ) )

        } else {

          this
            .createLead( this.productId )
            .then(
              ( lead ) => {
                if ( lead !== undefined && lead !== null ) {
                  this.$router.go( { name: 'chat', params: { id: lead.id } } )
                }
              }
            )
            .catch(
              ( error ) => {
                if ( error === leads.ERROR_CODES.UNATHORIZED ) {
                  this.$router.go( { name: 'signup' } )
                }
              }
            )

        }

      }

    },

    computed: {

      isProduct(){

        return this.getOpenedProduct !== null

      },

      isMobile(){

        return window.browser.mobile

      },

      listId(){
        return `product-list-of-${this.code}`
      },

      supplier(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.supplier ) {

            return this.getOpenedProduct.supplier

          }

        }

        return null

      },

      mentioned(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.mentioned ) {

            return this.getOpenedProduct.mentioned

          }

        }

        return null
      },

      caption(){

        if ( this.supplier !== null ) {

          return this.supplier.instagram_caption

        }

        return ''

      },

      avatarUrl(){

        if ( this.supplier !== null ) {

          return this.supplier.avatar_url || this.supplier.instagram_avatar_url

        }

        return ''

      },

      picture(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.instagram_images ) {

            const picture = this.getOpenedProduct.instagram_images.find( ( item ) => {

              return item.name === 'M_square'

            } )

            const img = new Image()

            img.load( picture.url, null, null, () => {
              this.imageOpacity = 1
            } )

            return picture.url

          }

        }

        return ''

      },

      code(){

        if ( this.getOpenedProduct ) {

          return this.getOpenedProduct.code

        }

        return ''

      },

      supplierName(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.supplier ) {

            if ( this.getOpenedProduct.supplier.instagram_username ) {

              return this.getOpenedProduct.supplier.instagram_username

            }

          }

        }

        return ''

      },

      mentionedName(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.mentioned ) {

            if ( this.getOpenedProduct.mentioned.instagram_username ) {

              return this.getOpenedProduct.mentioned.instagram_username

            }

          }

        }

        return ''

      },

      products(){

        if ( this.getOpenedProduct ) {

          if ( Array.isArray( this.getOpenedProduct.items ) ) {

            return this.getOpenedProduct.items.map( ( { name = null, price = null, oldPrice = null } ) => {

              return { name, price, oldPrice }

            } )

          }

        }

        return []
      },

      tags(){

        if ( this.getOpenedProduct ) {

          if ( Array.isArray( this.getOpenedProduct.items ) ) {

            return this.getOpenedProduct.items.reduce( ( prevTags, { tags = [] } ) => {

              return prevTags.concat( tags )

            }, [] )

          }

        }

        return []
      },

      productId(){

        if ( this.getOpenedProduct ) {

          return this.getOpenedProduct.id

        }

        return 0

      }

    },

    vuex: {
      getters: {
        getOpenedProduct,
        isLiked,
        isAuth
      },
      actions: {
        setLike,
        createLead,
        setCallbackOnSuccessAuth
      }
    }
  }
</script>
