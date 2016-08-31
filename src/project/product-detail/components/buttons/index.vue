<template>
  <div class="buttons">
    <div class="leftSide">
    <button class="save_btn" @click="like" :class="{ 'active': isLiked, 'default': !isLiked}">
    {{text}}
    </button>
    </div>
    <div class="rightSide">
      <button class="buy_btn" @click="buy">КАК КУПИТЬ</button>
    </div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
    computed: {
      text(){
        return (this.isLiked) ? 'СОХРАНИТЬ' : 'СОХРАНИТЬ';
      }
    },
    props: {
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