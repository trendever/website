<style src='./product-post.pcss'></style>
<template lang="jade">
article.product-post
  header.product-post__header
    img.product-post__user-preview(
     :src='userImage',
     v-on:error='onUserImageError',
     width='72' height='72')

    .product-post__info
      .product-post__info__supplier {{ openedProduct.product.supplier.instagram_username }}
      .product-post__added добавлено&nbsp;
        span.product-post__user-name {{ openedProduct.product.mentioned.instagram_username}}
  main.product-post__body(v-el:image-body)
    div(v-bind:style='{ opacity: imageOpacity }',
        :class='{"__animate": animate}')
      img.product-post__image(
        :src='IgImageUrl',
        :width='width',
        :height='height',
        )
  section.product-post__bottom-photo(v-for='item in openedProduct.product.items')
    .product-post__price-container
      template(v-if='item.discount_price')
        .product-post__price-discount(v-if='item.price') {{ item.price | curency_spaces }}
        .product-post__price-main(v-if='item.discount_price') {{ item.discount_price | curency_spaces }} #[i.ic-currency-rub]
      template(v-if='price(item)')
        .product-post__price-main(v-if='item.price') {{ item.price | curency_spaces }} #[i.ic-currency-rub]
    .product-post__title.__bottom {{{ item.name }}}

  footer.product-post__footer
    a.product-post__action.__heart(
      v-link='{name: "info", params: {type: "post_like"}}')
      .product-post__trend: i.ic-heart
      .product-post__action-title тренд

    a.product-post__action(href='#', @click.prevent='onBuy')
      .product-post__trend: i.ic-bag
      .product-post__action-title купить

    a.product-post__action.__right(v-link='{name:"product_repost", params: {id: obj.id}}' v-if='Mobile')
      .product-post__trend: i.ic-instagram-icon
      .product-post__action-title пост


  .product-post__description
    .product-post__text {{{ openedProduct.product.instagram_image_caption }}}
</template>

<script type='text/babel'>
  import listen from 'event-listener';
  import { urlThumbnail, ratioFit } from 'utils';
  import { setCallbackOnSuccessAuth } from 'vuex/actions';
  import { createLead } from 'vuex/actions/lead.js';
  import { openedProduct, isAuth } from 'vuex/getters';
  import * as leads from 'services/leads';

  export default {
    data(){
      return {
        IgImageUrl: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // transparent (for remove browser borders)
        width: '',
        height: '',
        imageOpacity: 0,

        userImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',

        animate: true,
        Mobile: window.browser.mobile,
      };
    },

    beforeDestroy() {
      if (this.resizeEvent) {
        this.resizeEvent.remove();
      }
    },

    vuex: {
      actions: {
        createLead,
        setCallbackOnSuccessAuth,
      },
      getters: {
        openedProduct,
        isAuth,
      },
    },

    computed: {
      obj() {
        return this.openedProduct.product;
      },
    },

    ready: function() {
      this.loadFullImage();

      this.updateImageSize();

      this.resizeEvent = listen(window, 'optimizedResize', this.updateImageSize.bind( this ))

      this.userImage = this.obj.supplier.instagram_avatar_url;
    },

    methods: {

      updateImageSize(){
        let sizes = ratioFit(this.obj.instagram_image_width,
                            this.obj.instagram_image_height,
                            this.$els.imageBody.offsetWidth,
                            this.obj.instagram_image_height);
        this.width = sizes.width;
        this.height = sizes.height;
      },

      price (item) {
        return (item.price && !item.discount_price);
      },

      zeroPrice (item) {
        return (!item.discount_price && !item.price);
      },

      onBuy() {
        if ( !this.isAuth ) {

          this.$router.go( { name: 'signup' } );
          this.setCallbackOnSuccessAuth(this.onBuy.bind(this))

        } else {

          this.createLead( this.openedProduct.product.id )
          .then(
            ( lead ) => {
              if (lead !== undefined && lead !== null){
                this.$router.go( { name: 'chat', params: { id: lead.id } } );
              }
            },
            ( error ) => {
              if ( error === leads.ERROR_CODES.UNATHORIZED ) {
                this.$router.go( { name: 'signup' } );
              }
            }
          );

        }
      },

      loadFullImage() {
        // Load and set full image.
        let img = new Image();
        let obj = this.openedProduct.product;
        let url = obj.instagram_images.find((img) => img.name === "L").url

        img.load(url, null, null, () => {
          this.IgImageUrl = url;
          this.imageOpacity = 1;
        });
      },

      onUserImageError(e){
        console.warn(`Load user photo has failed. Product id: ${this.obj.id}`);

        this.userImage = require('base/img/logo.png');
      }
    },
  }
</script>
