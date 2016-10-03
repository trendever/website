<style src='./styles/chat-bar.pcss'></style>
<template lang="jade">
menu-component
  div.menu-items(slot='items')
    .menu_i(@click='setStatus("COMPLETE", "lead.state.changed")')
      .menu_i_t Товара нет в наличии
    .menu_i(@click='setStatus("DELIVERY", "lead.state.changed")')
      .menu_i_t Шоп подключен, но не отвечает
    .menu_i(@click='setStatus("SUBMIT", "lead.state.changed")')
      .menu_i_t Шоп не отвечает
    .menu_i(@click='setStatus("CANCEL", "lead.state.changed")')
      .menu_i_t Шоп отказывается подключаться
    .menu_i(@click='setStatus("CANCEL", "lead.state.changed")')
      .menu_i_t Клиенту не подошел товар
    .menu_i(@click='setStatus("CANCEL", "lead.state.changed")')
      .menu_i_t Клиенту не подошла доставка
    .menu_i(@click='setStatus("CANCEL", "lead.state.changed")')
      .menu_i_t Клиент не отвечает
    .menu_i(@click='setStatus("CANCEL", "lead.state.changed")')
      .menu_i_t Другая причина
    .menu_i(@click='setStatus("CANCEL", "lead.state.changed")')
      .menu_i_t Клиент удалил чат
    .menu_i(@click='setShowCancelMenu(false);')
      .menu_i_t.__txt-green Назад
</template>

<script>
  import { setStatus, setShowStatusMenu, setShowCancelMenu } from 'vuex/actions/chat.js';

  import MenuComponent from 'base/menu/menu.vue';
  import * as leads from 'services/leads';

  export default{
    vuex: {
      actions: {
        setStatus,
        setShowStatusMenu,
        setShowCancelMenu,
      }
    },
    components: {
      MenuComponent
    },
  }
</script>
