<style src="./style.pcss"></style>
<template lang="jade">
div
  .chat-list-cnt
    header-component(:title="title", :left-btn-show="false")
      .header__nav(slot="content" v-if="show !== 'all'")
        .header__nav__i.header__text(
        :class="{_active: leadsTab==='buy'}", @click="leadsSetTab('buy')")
          | Покупаю
        .header__nav__i.header__text(
        :class="{_active: leadsTab==='sell'}", @click="leadsSetTab('sell')")
          | Продаю

    .section.top.bottom
      .section__content
        .chat-list

          .chat-list_i(v-for="lead in object_list | orderBy 'status'",
          v-link="{name: 'chat', params: {id: lead.chat.id}}")

            .chat-list_i_photo
              img(:src="lead.products[0].instagram_image_url")
            .chat-list_i_body
              .body_t {{ getTitle(lead) }}
              .body_status ({{ getStatus(lead) | lowercase }})
              .body_last-msg
                | {{ getRecentMessage(lead) }}
            .chat-list_i_date {{ getDatetime(lead) }}
            .chat-list_i_notify
              span {{ lead.chat.unread_count }}

    navbar-component(current="chat")
</template>

<script>
  import Vue from "vue";
  import {
    getAllLeads,
    leadsSetTab,
    readedAllChatNotify,
   } from 'vuex/actions';
  import {
    leads,
    userID,
    leadsTab
    } from 'vuex/getters';

  import * as service from 'services/leads';

  import { formatDatetime } from 'project/chat/utils';
  import HeaderComponent from 'base/header/header.vue';
  import NavbarComponent from 'base/navbar/navbar.vue';

  export default {
    data: () => ({
      title: null,
    }),

    vuex: {
      getters: {
        leads,
        leadsTab
      },
      actions: {
        getAllLeads,
        leadsSetTab,
        readedAllChatNotify,
      }
    },

    route: {
      activate(transition) {
        this.readedAllChatNotify();
        return this.getAllLeads();
      },
    },

    computed: {
      show () {
        if (this.buy_list.length && this.sell_list.length) {
          return this.leadsTab;
        }
        return 'all';
      },
      object_list () {
        if (this.show === "all") {return this.leads};
        if (this.show === "buy") {return this.buy_list;};
        if (this.show === "sell") {return this.sell_list};
      },
      buy_list () {
        return this.leads.filter(
          obj => obj.user_role === service.USER_ROLES.CUSTOMER.key );
      },
      sell_list () {
        return this.leads.filter( obj => {
          if (obj.user_role === service.USER_ROLES.SELLER.key
           || obj.user_role === service.USER_ROLES.SUPPLIER.key
           || obj.user_role === service.USER_ROLES.SUPER_SELLER.key
           || obj.user_role === service.USER_ROLES.UNKNOWN.key ) {
            return true;
          };
        })
      },
      title () {
        if (this.buy_list.length && this.sell_list.length) return;

        if (this.buy_list.length && !this.sell_list.lengt) {
          return "Шопинг-чаты";
        } else if (!this.buy_list.length && this.sell_list.length) {
          return "Чаты с покупателями";
        }
      },
    },

    methods: {
      getStatus: function(lead) {
        return service.getStatus(lead.status).name
      },
      getTitle: function(lead) {
        if (lead.user_role === service.USER_ROLES.CUSTOMER.key
            || lead.user_role === service.USER_ROLES.SUPPLIER.key) {
          return lead.shop.instagram_username
        }
        return `${lead.customer.instagram_username} (${lead.shop.instagram_username})`
      },
      getRecentMessage: function(lead) {
        let msg = lead.chat.recent_message;
        if (msg.parts[0].mime_type === 'text/plain') {
          return msg.parts[0].content;
        }
        if (msg.parts[0].mime_type === 'text/json') {
          let product = JSON.parse(msg.parts[0].content);
          return `товар: ${product.Title}`;
        }
      },
      getDatetime: function(lead) {
        return formatDatetime(lead.chat.recent_message.created_at);
      },
    },

    components: {
      HeaderComponent,
      NavbarComponent
    }
  }
</script>