<template>
  <div class="mobileLayout">
    <div class="wrapper" v-if="notFromUser">
      <user-info
        :img="avatarUrl"
        :code="code"
        :name="name"
        :last-update="lastUpdate"
      ></user-info>
    </div>
    <div class="picture-wrapper">
      <picture :img="picture"></picture>
    </div>
    <div class="wrapper">
      <template v-for="product of products">
        <products
          :name="product.name"
          :price="product.price"
          :discount-price="product.discountPrice"
        ></products>
      </template>
      <buttons
        :is-liked="isLiked"
        :is-mobile="isMobile"
        :product-id="productId"
        :supplier-available="supplierAvailable"
        :like="like"
        :buy="buy"
        :buy-promo-product="buyPromoProduct"
        :auth-seller-product="isAuthUserProduct"
      ></buttons>
    </div>
    <div class="desc-wrapper">
      <description :text="caption"></description>
    </div>
    <div class="tags-wrapper" v-if="!isDirectbot">
      <tags
        :tags="tags"
        :add-tag="goToHome"
        :base-height="170"
        :is-product="true"
      ></tags>
    </div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">

  import picture from '../picture/index.vue';
  import userInfo from '../user-info/index.vue';
  import products from '../products/index.vue';
  import buttons from '../buttons/index.vue';
  import description from '../description/index.vue';
  import tags from 'base/tags/index.vue'
  import { getOpenedProduct, isAuthUserProduct } from 'vuex/getters/products'
  import { authUserId,isFake } from 'vuex/getters/user';
  import * as userService from 'services/user';

  export default {

    data(){
      return {
        authSellerProduct: false,
      }

    },
    computed:{
      notFromUser(){
        if (window.entryPoint == "user"){
          return false;
        }
        return true
      }
    },
    vuex: {
      getters: {
        isAuthUserProduct,
        getOpenedProduct,
        authUserId,
        isFake
      }
    },
    components: {
      picture,
      userInfo,
      products,
      buttons,
      description,
      tags
    },
    props: {
      products: {
        type: Array,
        default: []
      },
      tags: {
        type: Array,
        default: []
      },
      avatarUrl: {
        type: String,
        default: ''
      },
      code: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      lastUpdate: {
        type: String,
        default: ''
      },
      picture: {
        type: String,
        default: ''
      },
      caption: {
        type: String,
        default: ''
      },
      isLiked: {
        type: Boolean,
        default: false
      },
      isMobile: {
        type: Boolean,
        default: false
      },
      supplierAvailable: {
        type: Boolean,
        default: false
      },
      productId: {
        type: Number,
        default: 0
      },
      like: {
        type: Function,
        default: () => {
        }
      },
      buy: {
        type: Function,
        default: () => {
        }
      },
      buyPromoProduct: {
        type: Function,
        default: () => {
        }
      },
      goToHome: {
        type: Function,
        default: () => {
        }
      }

    },
  }
</script>
