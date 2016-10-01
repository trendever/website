<style src='./style.pcss'></style>
<template lang="jade">
scroll-component(v-el:scroll-cnt)
  right-nav-component(current="chat")
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
            chat-list-item(v-for='lead in leads | orderBy "updated_at" -1 | cutList',:lead='lead')
    template(v-if='!leads.length')
      .chat-list-cnt-is-empty
        .chat-list-cnt-is-empty__container Нет чатов,#[br]
        span  ... потому что ты пока ничего #[br] не покупаешь и не продаешь.
      .chat-list-cnt-is-empty__banner(v-if="!leads.length") Нажми Купить&nbsp
       span под товаром или&nbsp
       span.want напиши @wantit&nbsp
       span под постом в Instagram, #[br] и здесь появится шопинг-чат.
navbar-component(current='chat')
scroll-top

.help-wrapper(v-if='isFirst')
  .help(@click='isFirst=false')
    .help__chat-list
      .help-conteiner
        .help-text Это шопинг-чаты, где можно напрямую#[br]  общаться с магазинами и заказывать
        .help__chat-list-round
</template>

<script type='text/babel'>
  import RightNavComponent from 'base/right-nav/index';
  import listen from 'event-listener';

  import {
    getLeads,
    getTab,
    getIsTab,
    getTitle,
    isEmptyLeads,
    isDone,
    getLengthList,
    getScroll,
    getHasMore,
    getCountForLoading
  } from 'vuex/getters/lead.js';

  import { isAuth, getTooltips } from 'vuex/getters/user.js';
  import { setTooltip } from 'vuex/actions/user.js';

  import {
    setTab,
    loadLeads,
    leadClose,
    setScroll
  } from 'vuex/actions/lead.js';

  import * as leads from 'services/leads';
  import * as messages from 'services/message';

  import ScrollTop from 'base/scroll-top/scroll-top';
  import ScrollComponent from 'base/scroll/scroll.vue'
  import HeaderComponent from 'base/header/header.vue';
  import NavbarComponent from 'base/navbar/navbar.vue';

  import ChatListItem from './chat-list-item.vue';

  export default {

    components: {
      ScrollTop,
      RightNavComponent,
      ScrollComponent,
      HeaderComponent,
      NavbarComponent,
      ChatListItem
    },
    filters: {
      cutList( leads ){
        return leads.slice( 0, this.getLengthList );
      }
    },
    vuex: {
      getters: {
        getTooltips,
        isAuth,
        getLeads,
        getTab,
        getIsTab,
        getTitle,
        isEmptyLeads,
        isDone,
        getLengthList,
        getScroll,
        getHasMore
      },
      actions: {
        setTooltip,
        setTab,
        loadLeads,
        leadClose,
        setScroll
      }
    },
    data(){
      return {
        needLoadLeads: true,
        isFirst: false,
        styleObject: {
          pointerEvents: 'auto'
        },
        currentPan: 0
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

            this.setScroll( this.$els.scrollCnt.scrollTop, this.$els.scrollCnt.scrollHeight );

            if ( this.needLoadLeads ) {

              const full_scroll = this.$els.scrollCnt.scrollHeight;
              const diff_scroll = full_scroll - this.$els.scrollCnt.scrollTop;

              if ( diff_scroll < 2500 ) {

                this.$set( 'needLoadLeads', false );

                this.loadLeads().then( () => {

                  this.$set( 'needLoadLeads', true );

                } );

              }

            }

          }

        })() );

        this.run();

      } else {
        this.$router.go( { name: 'signup' } );
      }
    },
    beforeDestroy(){
      if ( this.isAuth ) {
        //this.scrollListener.remove();
        this.leadClose();
      }
    },

    computed:{
      leads(){
        if(this.$store.state.leads.tab === 'customer') {
          return this.getLeads.filter(item=>{
            return !(item.cancel_reason === 1);
          });
        }
        return this.getLeads;
      },
      showTooltip(){
        if(this.isEmptyLeads){
          if(this.getTooltips.chats){
            return true;
          }
          return false;
        }
        return false;
      }
    },

    methods: {
      panup(e){
        this.$els.scrollCnt.scrollTop = this.currentPan + Math.abs(e.deltaY);
        this.setScroll( this.$els.scrollCnt.scrollTop, this.$els.scrollCnt.scrollHeight );
      },
      pandown(e){
        this.$els.scrollCnt.scrollTop = this.currentPan - Math.abs(e.deltaY);
        this.setScroll( this.$els.scrollCnt.scrollTop, this.$els.scrollCnt.scrollHeight );
      },
      panend(e){
        this.currentPan = this.$els.scrollCnt.scrollTop;
      },
      run(){

        this.runLoadingLeads().then( () => {

          const { scrollTop } = this.getScroll;

          if ( scrollTop > 0 ) {

            this.restoreScroll()

          }

        } )

      },

      restoreScroll(){

        return new Promise( ( resolve ) => {

          const add = ( targetHeight ) => {

            const { scrollTop } = this.getScroll;

            /**
             * Магическое 1000 это кол-во px после scrollTop;
             * */

            if ( targetHeight < ( scrollTop + 1000 ) ) {

              setTimeout( () => {

                this.loadLeads().then( () => {

                  this.$nextTick( () => {
                    add( this.$els.scrollCnt.scrollHeight );
                  } );

                } )

              }, 1 );

            } else {

              this.$els.scrollCnt.scrollTop = scrollTop;

              resolve();

            }

          };

          this.$nextTick( () => {

            add( this.$els.scrollCnt.scrollHeight );

          } );

        } );

      },
      runLoadingLeads(){

        return new Promise( ( resolve ) => {

          const add = ( scrollHeight ) => {

            if ( document.body.offsetHeight >= scrollHeight ) {

              this.loadLeads().then( () => {

                if ( this.getHasMore ) {

                  this.$nextTick( () => {

                    add( this.$els.scrollCnt.scrollHeight );

                  } );

                } else {

                  resolve()

                }

              } )

            } else {

              resolve();

            }

          };

          this.$nextTick( () => {

            add( this.$els.scrollCnt.scrollHeight )

          } );

        } );

      },

    },

    watch: {

      getTab(){

        this.run();

      }

    }
  }
</script>
