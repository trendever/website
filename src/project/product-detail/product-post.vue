<style src="./product-post.pcss"></style>
<template lang="jade">
article.product-post
  header.product-post__header
    img.product-post__user-preview(
     :src="openedProduct.product.supplier.instagram_avatar_url",
     onerror="this.error=null;this.src='/static/img/favicon.png'",
     width="72" height="72")

    .product-post__info
      .product-post__title {{ openedProduct.product.supplier.instagram_username }}
      .product-post__added добавлено&nbsp;
        span.product-post__user-name {{ openedProduct.product.mentioned.instagram_username}}
  main.product-post__body
    img.product-post__image(
      :src="IgImageUrl",
      width="750px",
      height="750px")
  section.product-post__bottom-photo(v-for="item in openedProduct.product.items")
    .product-post__price-container
      template(v-if="item.discount_price")
        .product-post__price-main(v-if="item.discount_price") {{ item.discount_price | curency_spaces }} #[i.ic-currency-rub]
        .product-post__price-discount(v-if="item.price") {{ item.price | curency_spaces }} #[i.ic-currency-rub]
      template(v-if="price(item)")
        .product-post__price-main(v-if="item.price") {{ item.price | curency_spaces }} #[i.ic-currency-rub]
      template(v-if="zeroPrice(item)") цена по #[br] запросу
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
    .product-post__description-icon: .i-description

    //- .product-post__tags
      a.product-post__link(href="#") @happy
      a.product-post__link(href="#") #beauty
      a.product-post__link(href="#") #family
      a.product-post__link(href="#") #счастье
      a.product-post__link(href="#") #семья
      a.product-post__link(href="#") #малыш
      a.product-post__link(href="#") #путешествия

    .product-post__text {{{ openedProduct.product.instagram_image_caption }}}
</template>

<script>
  import { urlThumbnail } from 'utils'
  import { createLead, getLead } from 'vuex/actions';
  import { openedProduct, isAuth } from 'vuex/getters';
  import * as leads from 'services/leads';

  export default {
    data: () => ({
      IgImageUrl: "",
    }),

    vuex: {
      actions: {
        createLead,
        getLead,
      },
      getters: {
        openedProduct,
        isAuth,
      },
    },

    ready: function() {
      if (!this.tryLoadCachedImage()) {this.loadFullImage()};
    },

    methods: {
      price (item) {
        return (item.price && !item.discount_price);
      },

      zeroPrice (item) {
        return (!item.discount_price && !item.price);
      },

      onBuy() {
        if (!isAuth) {
          this.$router.go({ name: 'signup' });
        } else {
          this.createLead(this.openedProduct.product.id).then( lead => {
            console.log(lead);
            this.$router.go({ name: 'chat', params: {id: lead.id} });
          }).catch( error => {
            if (error === leads.ERROR_CODES.UNATHORIZED) {
              this.$router.go({ name: 'signup' });
            }
          })
        }
      },

      tryLoadCachedImage() {
        if (!this.openedProduct.cachedImages) return false
        var url = this.openedProduct.product.instagram_image_url;
        // load thumbnail first. Because it's caching 80% of cases
        this.IgImageUrl = urlThumbnail(url, 306);

        this.loadFullImage();
      },

      loadFullImage() {
        // Load and set full image.
        var img = new Image();
        img.load(this.openedProduct.product.instagram_image_url, null, null, () => {
          this.IgImageUrl = urlThumbnail(this.openedProduct.product.instagram_image_url);
        });
      }
    },

    computed: {
      Mobile() {
        return window.browser.mobile;
      }
    },
  }
</script>
