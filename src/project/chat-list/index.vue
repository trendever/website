<style src='./style.pcss'></style>
<template lang="jade">
scroll-component(v-el:scroll-cnt)
  right-nav-component(current="chat")
  .chat-list-cnt(v-if='isDone')
    header-component(:title='getTitle', :left-btn-show='false')
      .header__nav(slot='content' v-if='true')
        .header__nav__i.header__text(
          :class='{_active: getTab === "customer"}',
          @click='setTab("customer");',
          @touch='setTab("customer");')
          span Покупаю
        .header__nav__i.header__text(
          :class='{_active: getTab === "seller"}',
          @click='setTab("seller");')
          span Продаю


    .section.top.bottom(:class="{'little-move-up': !$root.isStandalone,'little-move-up-standalone': $root.isStandalone}")
      .section__content
        .chat-list(v-bind:style="styleObject")
            chat-list-item(v-for='lead in leadsArray | orderBy "updated_at" -1 | cutList', :lead='lead', track-by="id", v-ref:item)
    template(v-if='!leadsArray.length')
      .chat-list-cnt-is-empty(v-if="getTab === 'customer'")
        .chat-list-cnt-is-empty__container Нет чатов,#[br]
        span  ... потому что ты пока ничего #[br] не покупаешь
      .chat-list-cnt-is-empty(v-if="getTab === 'seller'")
        .chat-list-cnt-is-empty__container Нет чатов,#[br]
        span  ... потому что ты пока ничего #[br] не продаешь
      .chat-list-cnt-is-empty__banner(v-if="!leadsArray.length && getTab === 'customer'") Нажми Купить&nbsp
       span под товаром #[br]или&nbsp
       span.want напиши @wantit&nbsp
       span под постом в Instagram, #[br] и здесь появится шопинг-чат
      .chat-list-cnt-is-empty__banner.sell(v-if="!leadsArray.length && getTab === 'seller'")
       span Напиши&nbsp
       span.want Покупай по комментарию @wantit&nbsp #[br(v-if="!isMobile")]
       span
        #[br(v-if="isMobile")] под товарами в своем Instagram,
        #[br] чтобы продавать и видеть здесь покупателей
       .how-to-sell-btn.chat-btn( v-link="{name: 'info-instructions-1'}", v-if="isMobile") Как начать продавать?
       //-appstore-link(
        text-link="ПОЛУЧИТЬ ПРИЛОЖЕНИЕ ДЛЯ ПРОДАЖ",
        placeholder-link="Укажите номер, чтобы начать продавать",
        v-if="!isMobile").chat-appstore-link
navbar-component(current='chat')
scroll-top
app-loader.list-loader(v-if="!needLoadLeads")

.help-wrapper(v-if='isFirst')
  .help(@click='isFirst=false')
    .help__chat-list
      .help-conteiner
        .help-text Это шопинг-чаты, где можно напрямую#[br]  общаться с магазинами и заказывать
        .help__chat-list-round
</template>

<script type='text/babel'>
  import AppstoreLink from 'base/appstore-link/appstore-link';
  import appLoader from 'base/loader/loader';
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

  import { isAuth, getTooltips, getUseDays } from 'vuex/getters/user.js';
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
      AppstoreLink,
      appLoader,
      ScrollTop,
      RightNavComponent,
      ScrollComponent,
      HeaderComponent,
      NavbarComponent,
      ChatListItem
    },
    filters: {
      cutList( leadsArray ){
        return leadsArray.slice( 0, this.getLengthList );
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
        getHasMore,
        getUseDays
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
        isMobile: window.browser.mobile,
        needLoadLeads: true,
        leadsArray: [],
        isFirst: false,
        styleObject: {
          pointerEvents: 'auto'
        },
        currentPan: 0
      }
    },
    ready(){

      if ( this.isAuth ) {
        if( this.getUseDays === 0){

          this.$router.go({name: 'monetization'})

        }

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

        leads.onEvent( this.onEvent );

        this.run();

      } else {
        this.$router.go( { name: 'signup' } );
      }
    },
    beforeDestroy(){
      if ( this.isAuth ) {
        this.leadClose();
        leads.offEvent( this.onEvent );
      }
      if (this.scrollListener){
        this.scrollListener.remove();
      }
    },

    computed:{
      leadsArray(){

        if(this.$store.state.leads.tab === 'customer') {
          let leads = this.getLeads.filter(item=>{
            return !(item.cancel_reason === 2) && !(item.cancel_reason === 1);
          });

          return leads;
        }

        if(this.$store.state.leads.tab === 'seller') {
          let leads = this.getLeads.filter(item=>{
            return !(item.cancel_reason === 2) && !(item.cancel_reason === 1);
          });

          return leads;
        }
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
    events:{
      'closeDeleteLead'(){

        this.$broadcast('closeDelete');

      }
    },
    methods: {
      //Добавление нового лида в нужную вкладку
      onEvent(data){
        if (data.response_map.event === "PROGRESS"){
          let lead_id = data.response_map.lead;
          return leads
              .get({lead_id})
              .then((data)=>{
                let lead = data.lead
                this.$store.state.leads.seller.unshift(lead)
              });
        }
      },
      run(){

        this.runLoadingLeads().then( () => {

          const { scrollTop } = this.getScroll;

          //if ( scrollTop > 0 ) {

            this.restoreScroll()

          //}

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



                this.loadLeads().then( () => {
                  setTimeout(()=>{
                    this.$nextTick( () => {
                      add( this.$els.scrollCnt.scrollHeight );
                    } );
                  },1)
                } )



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
