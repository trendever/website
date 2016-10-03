<style src='./menu.pcss'></style>
<template lang="jade">
.menu-cnt(:class="{'desktop-style': !isMobile , 'cancel-items': getShowCancelMenu && !isMobile}")
  .menu.section__content
    slot(name='items')
      .menu_i
        .menu_i_t.__txt-red Отмена

</template>

<script>
  import { getShowCancelMenu } from 'vuex/getters/chat';
  export default{
    vuex: {
      getters: {
        getShowCancelMenu
      }
    },
    data(){
      return {
        isMobile: window.browser.mobile
      }
    }
  }
</script>
