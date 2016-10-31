<template lang="jade">
#header-menu(v-if="show")

  .menu-cnt

    .menu.section__content

      slot(name='items')

        .menu_i

          .menu_i_t.__txt-red(v-on:click="show = false") Отмена



</template>

<script>
export default {
  props: {
    show: {
      default: false,
      type: Boolean
    }
  }
};
</script>

<style lang="postcss">

@import 'base/vars/vars.pcss';

#header-menu {

  background: rgba(24, 92, 90, .7);
  width: 100%;
  height: 100%;
  z-index:150;
  position: fixed 0 0 * 0;

  .menu.section__content {

    max-height: 100%;
    position: absolute 0 0 * 0;

  }

}

</style>
