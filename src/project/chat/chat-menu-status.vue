<style src='./styles/chat-bar.pcss'></style>
<template lang="jade">
menu-component
  div(slot='items')
    .menu_i.__bg-green(@click='setStatus("COMPLETE")')
      .menu_i_t.__txt-white Выполнен
    .menu_i.__bg-blue(@click='setStatus("DELIVERY")')
      .menu_i_t.__txt-white На доставке
    .menu_i.__bg-orange(@click='setStatus("SUBMIT")')
      .menu_i_t.__txt-white Подтвержден
    .menu_i.__bg-red(@click='setStatus("CANCEL")')
      .menu_i_t.__txt-white Отменен
    .menu_i(@click='setShowStatusMenu(false);')
      .menu_i_t.__txt-green Назад
</template>

<script>
  import { setStatus, setShowStatusMenu } from 'vuex/actions/chat.js';

  import MenuComponent from 'base/menu/menu.vue';
  import * as leads from 'services/leads';

  export default{
    vuex: {
      actions: {
        setStatus,
        setShowStatusMenu,
      }
    },
    components: {
      MenuComponent
    },
  }
</script>