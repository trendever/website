<template>
  <div>
    <mobile-layout
      v-if="isSmall"
      :products="products"
      :supplier-available="supplierAvailable"
      :avatar-url="avatarUrl"
      :code="code"
      :name="mentionedName"
      :tags="tags"
      :picture="picture"
      :caption="caption"
      :is-liked="isLiked"
      :last-update="lastUpdate"
      :is-mobile="isMobile"
      :product-id="productId"
      :like="like"
      :buy="buy"
      :buy-promo-product="buyPromoProduct"
      :go-to-home="goToHome"
    ></mobile-layout>
    <desktop-layout
      v-if="!isSmall"
      :products="products"
      :supplier-available="supplierAvailable"
      :avatar-url="avatarUrl"
      :code="code"
      :name="mentionedName"
      :tags="tags"
      :picture="picture"
      :caption="caption"
      :is-liked="isLiked"
      :last-update="lastUpdate"
      :is-mobile="isMobile"
      :product-id="productId"
      :like="like"
      :buy="buy"
      :buy-promo-product="buyPromoProduct"
      :go-to-home="goToHome"
    ></desktop-layout>

    <div class="products" v-if="isProduct">
      <div class="title-wrapper">

        <span class="title">
          <p class="title-not-link">Больше от </p>
          <p class="title-link" v-link='{name: "user", params: {id: supplierName}}'>{{supplierName}}</p>
        </span>

      </div>
      <photos :list-id="listId" :filter-by-shop-id="supplier.id"></photos>
      <navbar v-if="false"></navbar>
    </div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import listen from 'event-listener'
  import mobileLayout from '../mobileLayout/index.vue'
  import desktopLayout from '../desktopLayout/index.vue'
  import photos from 'base/photos/photos.vue'
  import navbar from 'base/navbar/navbar.vue'
  import { getOpenedProduct, isLiked, callAfterLoading } from 'vuex/getters/products'
  import { setLike, setCallBackAfterLoading, setComeBack, resetScrollByListId } from 'vuex/actions/products'
  import { isAuth,isFake } from 'vuex/getters/user.js'
  import { createLead } from 'vuex/actions/lead.js'
  import { setCallbackOnSuccessAuth } from 'vuex/actions'
  import { authUser } from 'vuex/actions/user.js';
  import * as leads from 'services/leads'
  import * as auth from 'services/auth'
  import { ratioFit } from 'utils'
  import settings from 'settings'
  import { selectTag } from 'vuex/actions/search.js'
  import { formatPastTime } from 'project/chat/utils';
  export default {
    data(){
      return {
        isSmall: false
      }
    },
    components: {
      mobileLayout,
      desktopLayout,
      photos,
      navbar
    },
    ready(){

      this.callAfterLoading();

      this.onUpdate = this.onUpdate.bind( this )

      this.$on( 'photosIsRun', this.onUpdate );

      const resize = () => {

        if ( window.matchMedia( "(max-width: 750px)" ).matches !== this.isSmall ) {

          this.$set( 'isSmall', window.matchMedia( "(max-width: 750px)" ).matches )

        }

      }

      this.resizeLayout = listen( window, 'optimizedResize', resize )

      resize()

    },

    beforeDestroy(){

      this.$off( 'photosIsRun', this.onUpdate )
      this.resizeLayout.remove()

    },

    methods: {

      goToHome( tag ){

        this.selectTag( tag, true );

        this.setComeBack( true );

        this.resetScrollByListId( 'home' );

        this.$router.go( { name: 'home' } );

      },

      onUpdate(){

        this.$broadcast( 'update' );

      },

      like(){
        if ( !this.isAuth ) {
          window.fakeAuth = {text: " чтобы сохранять товары в свои шопинг-желания"}

          this.setCallbackOnSuccessAuth( function( id, product, newLike ) {
            
            this.$router.go( { name: "product_detail", params: { id } } );

            this.setCallBackAfterLoading( this.setLike.bind( this, product, newLike ) )

          }.bind( this, this.productId, this.getOpenedProduct, true ) );

          this.$router.go( { name: 'signup' } );

        } else {
          if (this.isFake){
            window.fakeAuth = {text: " чтобы сохранять товары в свои шопинг-желания"}
            this.setCallbackOnSuccessAuth(()=>{
              this.$router.go( { name: "product_detail", params: { id } } );
            })
            this.$router.replace( { name: 'signup' } );
          }
          

          this.setLike();

        }

      },

      buy() {
        yaCounter35346175.reachGoal('purchase');
        this._buy( this.productId );
      },

      buyPromoProduct() {

        this._buy( settings.promoProductID );

      },

      _buy( productId ){

        if ( !this.isAuth ) {
          auth.fakeRegister().then(({token,user})=>{
            this.authUser(user, token).then( () => { this._buy(productId) } );
          });

        } else {

          this
            .createLead( productId )
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
      lastUpdate() {
        if ( this.getOpenedProduct ) {
          return formatPastTime(this.getOpenedProduct.instagram_published_at_ago);
        }

      },
      isProduct(){

        return this.getOpenedProduct !== null

      },

      isMobile(){

        return window.browser.mobile

      },

      listId(){
        return `product-list-of-${this.supplierName}`
      },

      supplier(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.supplier ) {

            return this.getOpenedProduct.supplier

          }

        }

        return null

      },

      supplierAvailable(){
        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.supplier ) {

            if ( this.getOpenedProduct.supplier.available ) {

              return this.getOpenedProduct.supplier.available

            }

          }

        }

        return null;
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

          return this.getOpenedProduct.instagram_image_caption

        }

        return ''

      },

      avatarUrl(){

        if ( this.mentioned !== null ) {

          return this.mentioned.avatar_url

        }

        return ''

      },

      picture(){

        if ( this.getOpenedProduct ) {

          if ( this.getOpenedProduct.instagram_images ) {

            console.log(this.getOpenedProduct.instagram_images);
            const picture = this.getOpenedProduct.instagram_images.find( ( item ) => {

              return item.name === 'Max'

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

            return this.getOpenedProduct.items.map( ( { name = null, price = null, discount_price = null } ) => {

              return { name, price, discountPrice: discount_price }

            } )

          }

        }

        return []
      },

      tags(){

        if ( this.getOpenedProduct ) {

          if ( Array.isArray( this.getOpenedProduct.items ) ) {

            const tagsObject = {};

            this.getOpenedProduct.items.forEach( ( { tags = [] } ) => {

              tags.forEach( ( { id, name } ) => {

                tagsObject[ name ] = id;

              } )

            } )

            return Object.keys( tagsObject ).map( ( name ) => {

              return { name, id: tagsObject[ name ] }

            } );

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
        callAfterLoading,
        isLiked,
        isFake,
        isAuth
      },
      actions: {
        authUser,
        resetScrollByListId,
        selectTag,
        setLike,
        setComeBack,
        createLead,
        setCallbackOnSuccessAuth,
        setCallBackAfterLoading
      }
    }
  }
</script>
