<style src='./style.pcss'></style>
<template lang="jade">
div.scroll-cnt(v-el:scroll-cnt)
  .chat-list-cnt(v-if='isDone')
    header-component(:title='getTitle', :left-btn-show='false')
      .header__nav(slot='content' v-if='getIsTab')
        .header__nav__i.header__text(
        :class='{_active: getTab === "customer"}', @click='setTab("customer");',
        @touch='setTab("customer");')
          | Покупаю
        .header__nav__i.header__text(
        :class='{_active: getTab === "seller"}', @click='setTab("seller");')
          | Продаю

    .section.top.bottom
      .section__content
        .chat-list
          template(v-for='lead in getLeads| orderBy "updated_at" -1')
            chat-list-item(:lead='lead')
    .chat-list-cnt-is-empty(v-if='isEmptyLeads') У вас нет шопинг-чатов
    navbar-component(current='chat')
</template>

<script type='text/babel'>
  import listen from 'event-listener';

  import {
    getLeads,
    getTab,
    getIsTab,
    getTitle,
    isEmptyLeads,
    isDone,
  } from 'vuex/getters/lead.js';

  import {
    getPartLeads,
    getMoreLeads,
    applyStatus,
    setTab,
    loadLeads,
    setLastMessages,
  } from 'vuex/actions/lead.js';

  import * as leads from 'services/leads';
  import * as messages from 'services/message';

  import HeaderComponent from 'base/header/header.vue';
  import NavbarComponent from 'base/navbar/navbar.vue';
  import ChatListItem from './chat-list-item.vue';

  export default {
    vuex: {
      getters: {
        getLeads,
        getTab,
        getIsTab,
        getTitle,
        isEmptyLeads,
        isDone,
      },
      actions: {
        setTab,
        loadLeads
      }
    },
    data(){
      return {
        needLoadLeads: true
      }
    },
    ready(){
      this.scrollListener = listen( this.$els.scrollCnt, 'scroll', this.scrollHandler.bind( this ) );
    },
    beforeDestroy(){
      this.scrollListener.remove();
    },
    methods: {
      scrollHandler(){
        if ( this.needLoadLeads ) {

          const full_scroll = this.$els.scrollCnt.scrollHeight;
          const diff_scroll = full_scroll - this.$els.scrollCnt.scrollTop;

          if ( diff_scroll < 2500 ) {
            this.$set( 'needLoadLeads', false );
            this.loadLeads().then(() => {
              this.$set( 'needLoadLeads', true );
            });
          }

        }
      },
    },
    watch:{
      getTab(){
        this.$els.scrollCnt.scrollTop = 0;
      }
    },
    components: {
      HeaderComponent,
      NavbarComponent,
      ChatListItem,
    }
  }
</script>
