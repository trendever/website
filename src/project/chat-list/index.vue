<style src="./style.pcss"></style>
<template lang="jade">
div
  .chat-list-cnt
    header-component(:title="getTitle", :left-btn-show="false")
      .header__nav(slot="content" v-if="getIsTab")
        .header__nav__i.header__text(
        :class="{_active: getTab === 'customer'}", @click="setTab('customer')")
          | Покупаю
        .header__nav__i.header__text(
        :class="{_active: getTab === 'seller'}", @click="setTab('seller')")
          | Продаю

    .section.top.bottom
      .section__content
        .chat-list(v-el:chat-list)
          template(v-for="lead in getLeads")
            chat-list-item(:lead="lead")

    navbar-component(current="chat")
</template>

<script type="text/babel">
  import listen from 'event-listener';

  import {
    getLeads,
    getTab,
    getPending,
    getIsTab,
    getTitle,
  } from 'vuex/getters/lead.js';

  import {
    getPartLeads,
    getMoreLeads,
    applyStatus,
    setTab,
    loadLeads,
    setLastMessages
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
        getPending,
        getIsTab,
        getTitle,
      },
      actions: {
        applyStatus,
        setTab,
        loadLeads,
        setLastMessages
      }
    },
    created() {
      this.onStatus = this.onStatus.bind(this);
      leads.onChangeStatus(this.onStatus);
      messages.onMsg(this.onMsg);
    },

    ready(){
      this.loadLeads();
      this.onScroll();
    },

    beforeDestroy() {
      leads.removeStatusListener(this.onStatus);
      messages.offMsg(this.onMsg);
      this.offScroll();
    },

    methods: {
      onStatus({response_map: {lead}}) {
        this.applyStatus(lead.id, lead.status);
      },
      onScroll(){
        this.scrollListener = listen( window, 'scroll', this.scrollHandler.bind( this ) );
      },
      offScroll(){
        this.scrollListener.remove();
      },
      scrollHandler(){
        let needUpdate     = false;
        const marginBottom = 100;
        const scrollEnd    = document.body.scrollHeight - document.body.offsetHeight - marginBottom;
        if ( !needUpdate ) {
          if ( window.scrollY >= scrollEnd ) {
            needUpdate = true;
            this.loadLeads();
          }
        }
        if ( needUpdate ) {
          this.offScroll();
          setTimeout( () => {
            needUpdate = false;
            this.onScroll();
          }, 100 );
        }
      },
      onMsg({response_map: {chat, messages}}){
        this.setLastMessages(chat, messages);
      },
    },

    components: {
      HeaderComponent,
      NavbarComponent,
      ChatListItem,
    }
  }
</script>