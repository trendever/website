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
        .chat-list(v-bind:style="styleObject")
          template(v-for='lead in getLeads | orderBy "updated_at" -1 | cutList')
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
    getLengthList,
  } from 'vuex/getters/lead.js';

  import { isAuth } from 'vuex/getters/user.js';

  import {
    setTab,
    loadLeads,
    leadClose,
  } from 'vuex/actions/lead.js';

  import * as leads from 'services/leads';
  import * as messages from 'services/message';

  import HeaderComponent from 'base/header/header.vue';
  import NavbarComponent from 'base/navbar/navbar.vue';

  import ChatListItem from './chat-list-item.vue';

  export default {
    filters: {
      cutList( leads ){
        return leads.slice( 0, this.getLengthList );
      }
    },
    vuex: {
      getters: {
        isAuth,
        getLeads,
        getTab,
        getIsTab,
        getTitle,
        isEmptyLeads,
        isDone,
        getLengthList
      },
      actions: {
        setTab,
        loadLeads,
        leadClose
      }
    },
    data(){
      return {
        needLoadLeads: true,
        hasMore: true,
        styleObject:{
          pointerEvents: 'auto'
        }
      }
    },
    ready(){
      if ( this.isAuth ) {
        this.scrollListener = listen( this.$els.scrollCnt, 'scroll', (() => {

          let timerId = null;

          return () => {

            if ( timerId !== null ) {

              clearTimeout( timerId );

            }

            this.$set( 'styleObject.pointerEvents', 'none' );

            timerId = setTimeout( () => {

              this.$set( 'styleObject.pointerEvents', 'auto' );

            }, 200 );

            if ( this.needLoadLeads && this.hasMore ) {

              const full_scroll = this.$els.scrollCnt.scrollHeight;
              const diff_scroll = full_scroll - this.$els.scrollCnt.scrollTop;

              if ( diff_scroll < 2500 ) {

                this.$set( 'needLoadLeads', false );

                this.loadLeads().then( (count) => {

                  if(count <= 0){

                    this.$set('hasMore', false);

                  }

                  this.$set( 'needLoadLeads', true );

                } );

              }

            }

          }

        })() );
      } else {
        this.$router.go( { name: 'signup' } );
      }
    },
    beforeDestroy(){
      if ( this.isAuth ) {
        this.scrollListener.remove();
        this.leadClose();
      }
    },

    watch: {
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
