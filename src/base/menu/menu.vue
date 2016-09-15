<style src='./menu.pcss'></style>
<template lang="jade">
.menu-cnt(:class="{'desktop-style': !isMoblie }")
  .menu.section__content
    slot(name='items')
      .menu_i
        .menu_i_t.__txt-red Отмена

</template>

<script>
  export default{
    data(){
      return {
        isMoblie: window.browser.mobile
      }
    }
  }
</script>
