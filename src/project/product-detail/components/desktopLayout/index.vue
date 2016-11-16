<template>
  <div class="desktopLayout"  v-el:root>

    <div class="product" v-el:product>

      <div class="leftSide" v-bind:style="leftSide">
        <picture :img="picture"></picture>
      </div>

      <div class="rightSide" v-bind:style="rightSide">

        <div class="userAndProducts">
          <user-info
            :img="avatarUrl"
            :code="code"
            :name="name"
            :last-update="lastUpdate"
          ></user-info>
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
          ></buttons>
        </div>
        <div class="description-wrapper">
          <description :text="caption"></description>
        </div>
        <div class="tags-wrapper" v-if="!isDirectbot">
          <tags
            :tags="tags"
            :add-tag="goToHome"
            text-font-size="16px"
            text-line-height="27px"
            max-height="325px"
            :base-height="191"
            :margin-right="5"
            :margin-bottom="5"
            :is-product="true"
          ></tags>
        </div>
      </div>

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
  import listener from 'event-listener';
  import tags from 'base/tags/index.vue'

  export default {
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
    ready(){

      const resize = () => {

        const { offsetWidth } = this.$els.root;
        const { clientWidth } = this.$els.product;

        if ( offsetWidth => 750 ) {

          const widthLeft  = clientWidth * 0.6;
          const widthRight = clientWidth * 0.4;

          this.$set( 'leftSide.width', `${ widthLeft >= 580 ? 580 : widthLeft }px` );
          this.$set( 'rightSide.width', `${ widthLeft >= 580 ? clientWidth - 580 : widthRight }px` );

        }

      };

      this.layoutResize = listener( window, 'optimizedResize', resize );

      resize();

    },
    beforeDestroy(){
      this.layoutResize.remove();
    },
    data(){
      return {
        leftSide: {
          width: '100px'
        },
        rightSide: {
          width: '100px'
        }
      }
    },
    components: {
      picture,
      userInfo,
      products,
      buttons,
      description,
      tags
    }
  }
</script>
