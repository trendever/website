<style src="./product-post.pcss"></style>
<template lang="jade">
article.product-post
  header.product-post__header
    img.product-post__user-preview(
     :src="openedProduct.product.supplier.instagram_avatar_url",
     onerror="this.error=null;this.src='/static/img/favicon.png'",
     width="72" height="72")

    .product-post__info
      .product-post__info__supplier {{ openedProduct.product.supplier.instagram_username }}
      .product-post__added добавлено&nbsp;
        span.product-post__user-name {{ openedProduct.product.mentioned.instagram_username}}
  main.product-post__body
    img.product-post__image(
      :src="IgImageUrl",
      :width="obj.instagram_image_width")
  section.product-post__bottom-photo(v-for="item in openedProduct.product.items")
    .product-post__price-container
      template(v-if="item.discount_price")
        .product-post__price-discount(v-if="item.price") {{ item.price | curency_spaces }}
        .product-post__price-main(v-if="item.discount_price") {{ item.discount_price | curency_spaces }} #[i.ic-currency-rub]
      template(v-if="price(item)")
        .product-post__price-main(v-if="item.price") {{ item.price | curency_spaces }} #[i.ic-currency-rub]
      template(v-if="zeroPrice(item)")
        .product-post__price-main ? #[i.ic-currency-rub]
    .product-post__title.__bottom {{{ item.name }}}

  footer.product-post__footer
    a.product-post__action.__heart(
      v-link="{name: 'info', params: {type: 'post_like'}}")
      .product-post__trend: i.ic-heart
      .product-post__action-title тренд

    a.product-post__action(href="#", @click.prevent="onBuy")
      .product-post__trend: i.ic-bag
      .product-post__action-title купить

    .u-fill

    a.product-post__action(v-link="{name: 'product_repost', params: {id: id}}" v-if="Mobile")
      .product-post__trend: i.ic-instagram-icon
      .product-post__action-title пост



  .product-post__description
    .product-post__text {{{ openedProduct.product.instagram_image_caption }}}
</template>

<script type="text/babel">
  import listen from 'event-listener';
  import { urlThumbnail } from 'utils';
  import { createLead } from 'vuex/actions/lead.js';
  import { openedProduct, isAuth } from 'vuex/getters';
  import * as leads from 'services/leads';

  export default {
    data(){
      return {
        IgImageUrl: "",
        width: "",
        height: "",
        Mobile: window.browser.mobile,
      };
    },
    vuex: {
      actions: {
        createLead,
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
      if (!this.tryLoadCachedImage()) {
        this.loadFullImage();
      };
    },

    methods: {

      price (item) {
        return (item.price && !item.discount_price);
      },

      zeroPrice (item) {
        return (!item.discount_price && !item.price);
      },

      onBuy() {
        if ( !this.isAuth ) {

          this.$router.go( { name: 'signup' } );

        } else {

          const promise = this.createLead( this.openedProduct.product.id );

          promise.then(
            ( lead ) => {
              if(lead !== undefined && lead !== null){
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

      tryLoadCachedImage() {
        if (!this.openedProduct.cachedImages) {
          return false;
        }
        let obj = this.openedProduct.product;

        // load thumbnail first.
        this.IgImageUrl = urlThumbnail(obj.instagram_image_url, 150);

        this.loadFullImage();
      },

      loadFullImage() {
        // Load and set full image.
        let img = new Image();
        let obj = this.openedProduct.product;
        img.load(urlThumbnail(obj.instagram_image_url), null, null, () => {
          this.IgImageUrl = urlThumbnail(obj.instagram_image_url);
        });
      }
    },
  }
</script>
