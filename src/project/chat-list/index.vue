<style src="./style.pcss"></style>
<template lang="jade">
div
  .chat-list-cnt
    header-component(:title="title", :left-btn-show="false")
      .header__nav(slot="content" v-if="isTabs")
        .header__nav__i.header__text(
        :class="{_active: leadsTab==='buy'}", @click="leadsSetTab('buy')")
          | Покупаю
        .header__nav__i.header__text(
        :class="{_active: leadsTab==='sell'}", @click="leadsSetTab('sell')")
          | Продаю

    .section.top.bottom
      .section__content
        .chat-list(v-el:chat-list)
          template(v-for="lead in object_list")
            chat-list-item(:lead="lead")

    navbar-component(current="chat")
</template>

<script type="text/babel">
  import listen from 'event-listener';

  import {
    getPartLeads,
    getMoreLeads,
    getLead,
    leadsSetTab,
    readedAllChatNotify,
   } from 'vuex/actions';
  import {
    leadsBuy,
    leadsSell,
    leadsTab,
    isWaitReponseLeads,
    } from 'vuex/getters';

  import * as service from 'services/leads';
  import * as messages from 'services/message';

  import { formatDatetime } from 'project/chat/utils';
  import HeaderComponent from 'base/header/header.vue';
  import NavbarComponent from 'base/navbar/navbar.vue';
  import ChatListItem from './chat-list-item.vue';

  export default {
    data: () => ({
      title: null,
      scrollEvent: null,
    }),

    vuex: {
      getters: {
        leadsBuy,
        leadsSell,
        leadsTab,
        isWaitReponseLeads,
      },
      actions: {
        getPartLeads,
        getMoreLeads,
        getLead,
        leadsSetTab,
        readedAllChatNotify,
      }
    },

    route: {
      activate(transition) {
        this.readedAllChatNotify();
        return this.getPartLeads();
      },
    },

    created() {
      messages.onMsg(this.onMsg);
    },

    ready(){
      this.enableInfinityScroll();
    },

    beforeDestroy() {
      messages.removeListenerMsg(this.onMsg);
      this.disableInfinityScroll();
    },

    computed: {
      isTabs () {
        return this.leadsBuy.length && this.leadsSell.length;
      },

      show () {
        if (this.isTabs) {
          return this.leadsTab;
        } else if (this.leadsSell.length) {
          return "sell";
        }
        return "buy";
      },
      object_list () {
        if (this.show === "buy") {return this.leadsBuy;}
        if (this.show === "sell") {return this.leadsSell;}
      },

      title () {
        if (this.isTabs) {return;}

        if (this.leadsSell.length) {
          return "Чаты с покупателями";
        }
        return "Шопинг-чаты";
      },
    },

    methods: {
      enableInfinityScroll(e) {
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
      },

      disableInfinityScroll() {
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
      },

      onMsg({response_map: {chat}}){
        this.getLead({conversation_id: chat.id, without_cache: true})
      },
    },

    components: {
      HeaderComponent,
      NavbarComponent,
      ChatListItem,
    }
  }
</script>