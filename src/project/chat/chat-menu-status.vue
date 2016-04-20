<style src="./styles/chat-bar.pcss"></style>
<template lang="jade">
menu-component
  div(slot="items")
    .menu_i.__bg-green
      .menu_i_t.__txt-white Выполнен
    .menu_i.__bg-blue
      .menu_i_t.__txt-white На доставке
    .menu_i.__bg-orange
      .menu_i_t.__txt-white Подтвержден
    .menu_i.__bg-red
      .menu_i_t.__txt-white Отменен
    .menu_i(@click="statusMenuActive=false")
      .menu_i_t.__txt-green Назад
</template>

<script>
  import MenuComponent from 'base/menu/menu.vue';

  export default{
    data: () => ({
    }),

    props: {
      statusMenuActive: {
        type: Boolean,
        required: true,
      }
    },

    components: {
      MenuComponent
    }

  }
</script>