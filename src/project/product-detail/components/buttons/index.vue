<template>
  <div class="buttons" :class="{'glued-btns': isMobile && !authSellerProduct}">
    <div class="leftSide">
      <button class="save_btn" @click="like" :class="{ 'active': isLiked, 'default': !isLiked}">
      {{text}}
      </button>
    </div>
    <div class="rightSide">
      <button class="buy_btn" @click="buy">КАК КУПИТЬ?</button>
    </div>
  </div>
  <div class="find-bloger" v-if="authSellerProduct">Найти блогера</div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
    data(){
      return {
        isMobile: window.browser.mobile
      }
    },
    computed: {
      text(){
        return (this.isLiked) ? 'СОХРАНЕНО' : 'СОХРАНИТЬ';
      }
    },
    props: {
      authSellerProduct: {
        type: Boolean,
        default: false
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
      }
    }
  }
</script>
