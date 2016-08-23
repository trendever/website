<template>
  <div class="buttons">
    <div class="leftSide">
      <div class="button buttonLeft" @click="like">
        <i class="ic-heart like icon" :class="{ 'icon-active': isLiked, 'icon-default': !isLiked }"></i>
        <span class="text" :class="{ 'text-active': isLiked, 'text-default': !isLiked }">тренд</span>
      </div>
      <div v-if="supplierAvailable" class="button buttonLeft" @click="buy">
        <i class="ic-bag buy icon icon-default"></i>
        <span class="text text-default">купить</span>
      </div>
      <div v-else class="button buttonLeft" @click="buy">
        <i class="ic-dialog know icon icon-default"></i>
        <span class="text text-default">узнать</span>
      </div>
    </div>
    <div class="rightSide">
      <button class="buy_btn" @click="buy">ГДЕ КУПИТЬ</button>
    </div>
  </div>
</template>

<style src="./style.pcss" scoped lang="postcss"></style>

<script type="text/babel">
  export default {
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