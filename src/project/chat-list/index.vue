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
    loadLeads
  } from 'vuex/actions/lead.js';

  import { readedAllChatNotify } from 'vuex/actions/chat.js'

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
        getTitle
      },
      actions: {
        applyStatus,
        setTab,
        loadLeads,
        readedAllChatNotify,
      }
    },

/*    route: {
      activate (transition) {
       // this.readedAllChatNotify();
      },
    },*/

    created() {
      this.onStatus = this.onStatus.bind(this);
      leads.onChangeStatus(this.onStatus);
      messages.onMsg(this.onMsg);
    },

    ready(){
      this.loadLeads();
      this.onScroll();
      //this.enableInfinityScroll();
    },

    beforeDestroy() {
      leads.removeStatusListener(this.onStatus);
      messages.offMsg(this.onMsg);
      this.offScroll();
     // this.disableInfinityScroll();
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
        let needUpdate = false;
        const scrollEnd = document.body.scrollHeight - document.body.offsetHeight;
        if ( !needUpdate ) {
          if ( window.scrollY === scrollEnd ) {
            needUpdate         = true;
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
/*      enableInfinityScroll(e) {
        var self = this;
        // Add event for infinity scroll
        this.scrollEvent = listen(window, 'scroll', function(){
          var pos_scroll = window.pageYOffset || document.documentElement.scrollTop;
          var full_scroll = self.$els.chatList.offsetHeight;
          var diff_scroll = full_scroll - pos_scroll;
          console.log(diff_scroll);
          if (diff_scroll < 800 && !self.isWaitReponseLeads && self.object_list.length >= 3) {
              self.showMore();
          }
        });
      },*/

/*      disableInfinityScroll() {
        if (this.scrollEvent) {
          this.scrollEvent.remove();
        }
      },

      showMore(){
        this.getMoreLeads().then( leads => {
          if (!leads.length) {
            this.disableInfinityScroll();
          }
        });
      },*/

      onMsg({response_map: {chat}}){
        //this.getLead({conversation_id: chat.id, without_cache: true})
      },
    },

    components: {
      HeaderComponent,
      NavbarComponent,
      ChatListItem,
    }
  }
</script>