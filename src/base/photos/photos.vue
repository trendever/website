<style src='./styles/photos.pcss'></style>
<template lang="jade">
.photos(v-bind:style="styleObject", v-el:container)
  .photos__list(v-el:photos-list, v-if='items', v-bind:style="listStyle")

    template(v-for='line in items | lines' track-by="uid")
      .photos__list__cell(v-bind:style="top[$index]")
        template(v-for='item in line.bundle' track-by="id")
          photo-item( :product.once='item.data', :product-id.once="item.id", :animate='true' )

  .photos__more-wrap(v-if='hasMore')
    .photos__more( :class='{"_active": isLoading}' )
        .loader-photos
          app-loader
        //-.photos__more__base-ic: span еще
        //-.photos__more__anim-ic: i.ic-update

  .photos__no-more-wrap(v-if='itemsLength === 0 && !hasMore')
    .main__bottom.__no-goods: a.link.link_primary(
      @click.prevent.stop='clearSearch()',
      href='#',
      v-if="tags || search" ) Сбросить поиск

scroll-top(:class="{'product__detail': $route.name === 'product_detail' && isMobile}")
</template>

<script type='text/babel'>
  import settings from 'settings';
  import listen from 'event-listener';

  import scrollTop from 'base/scroll-top/scroll-top.vue';
  import photoItem from './photo-item.vue';
  import AppLoader from 'base/loader/loader';

  import { clearSearch } from 'vuex/actions/search.js';
  import { searchValue, tags, selectedTagsId } from 'vuex/getters/search.js';
  import { getComeBack } from 'vuex/getters/products';

  import {
    run,
    setListId,
    updateScroll,
    closeProducts,
    setContainerWidth
  } from 'vuex/actions/products';

  import {
    getProducts,
    hasMore,
    isLoading,
    isAnimateShow,
    getColumnCount,
    getScrollData,
  } from 'vuex/getters/products';

  export default {
    vuex: {

      getters: {
        getComeBack,
        items:getProducts,
        hasMore,
        isLoading,
        isAnimateShow,
        searchValue,
        selectedTags: tags,
        selectedTagsId,
        getColumnCount,
        getScrollData
      },

      actions: {
        run,
        setListId,
        updateScroll,
        clearSearch,
        closeProducts,
        setContainerWidth
      }

    },

    props: {
      tags: {
        type: Boolean,
        default: false
      },
      search: {
        type: Boolean,
        default: false
      },
      filterByShopId: {
        default: null
      },
      filterByMentionerId: {
        default: null
      },
      listId: {
        type: String,
        required: true
      },
      infinityScroll: {
        type: Boolean,
        default: true
      }
    },

    data() {
      return {
        isMobile: window.browser.mobile,
        styleObject: {
          pointerEvents: 'auto'
        },
        listStyle: {
          height: '100px',
          maxHeight: '100px'
        },
        lastSelectedTagId: null,
        isRunning: false,
        containerClientWidth: '',
        directbot: settings.directbotActive
      }
    },

    ready() {
      //need for no vue warning about container.clientWidth in rowHeight
      this.$set('containerClientWidth',this.$els.container.clientWidth)

      this.setContainerWidth( this.$els.container.offsetWidth );

      this.scrollCnt = document.querySelector( '.scroll-cnt' );

      this.$set( 'lastSelectedTagId', this.selectedTagsId.join( ',' ) );

      this.setListId( this.listId );

      this.resize = listen( window, 'optimizedResize', () => {

        this.setContainerWidth( this.$els.container.offsetWidth );

        this._setScroll();

      } );

      this._run().then( ( scrollTop ) => {

        this.runScroll();
        this.emitIsRun();

        this.$set( 'isRunning', true );

        this.scrollCnt.scrollTop = scrollTop;

        if (typeof Android !== 'undefined'){
          if (Window.androidhack === 0){
            this.$router.go( { name: 'androidhack' } );
          }
        }

      } ).then(()=>{

        /*if(this.$route.name === 'profile'){

          this.scrollCnt.scrollTop = 0;

        }*/

      })
      if(this.$route.name === 'profile') {

        this.showBlogerBtn = listen(this.scrollCnt, 'scroll', ()=>{

          if(this.scrollCnt.scrollTop >= window.innerHeight * 2){

            this.$dispatch('hide-bloger-btn');

          } else {
            this.$dispatch('show-bloger-btn');
          }

        });

      }

    },

    beforeDestroy() {

      this.resize.remove();

      if ( this.scrollEvent ) {

        this.scrollEvent.remove();

      }

      this.closeProducts();

      this.$set( 'isRunning', false );


      if(this.showBlogerBtn){
        this.showBlogerBtn.remove();
      }

    },

    filters: {
      lines( value ) {

        const { idStart, idEnd } = this.getScrollData;

        const _lines = [];

        const items  = value.slice( idStart, idEnd );

        let interateCout = Math.ceil(items.length / this.getColumnCount);
        let bundleId = 0;
        for(let i = 0; i < interateCout; i++ ){

          let bundle = items.splice(0,this.getColumnCount);
          //нужен id для того чтобы изображения постоянно показывались а не появлялись из ничего
          //каждый раз при скролле
          bundleId += +bundle[0].id;

          _lines.push({uid: bundleId, bundle: bundle});

        }

        return _lines;
      }
    },

    methods: {

      _setScroll() {

        if ( this.rowHeight > 0 && this.isRunning ) {

          const { search, tags, filterByShopId, filterByMentionerId } = this;

          this.updateScroll( {
            scrollTop: this.scrollTop,
            rowHeight: this.rowHeight,
            scrollTopReal: this.scrollCnt.scrollTop,
            searchOptions: { isSearch: search, isTags: tags, filterByShopId , filterByMentionerId }
          } );

        }

      },

      _run( force = false ) {

        const { search, tags, filterByShopId, filterByMentionerId } = this;

        //Возвращение c другой ленты

        if(this.getComeBack){
          force = true;
        }

        //Получение отмеченых товаров

        let includeNotSailed = false;

        if(this.$route.name === 'profile' && this.filterByMentionerId){

          includeNotSailed = true;

        }

        return this.run( { isSearch: search, isTags: tags, filterByShopId, filterByMentionerId, includeNotSailed }, force );

      },

      emitIsRun() {

        this.$dispatch( 'photosIsRun' );

      },

      runScroll() {

        if ( this.scrollEvent ) {

          this.scrollEvent.remove();

        }

        this.scrollEvent = listen( this.scrollCnt, 'scroll', (() => {

          let timerId = null;

          return () => {

            if ( timerId !== null ) {

              clearTimeout( timerId );

            }

            this.$set( 'styleObject.pointerEvents', 'none' );

            timerId = setTimeout( () => {

              this.$set( 'styleObject.pointerEvents', 'auto' );

            }, 200 );

            this._setScroll();

          }

        })() );

      },

    },

    computed: {
      scrollTop: {
        cache: false,
        get(){

          const scrollTop = this.$els.container.getBoundingClientRect().top;

          return ( scrollTop > 0 ) ? 0 : Math.abs( scrollTop );

        }
      },

      top: {
        cache: false,
        get(){

          const { idStart, idEnd } = this.getScrollData;

          const rowCount = ( idEnd - idStart ) / this.getColumnCount;

          const rowHeight = idStart / this.getColumnCount * this.rowHeight;

          const tops = [];

          for ( let i = 0; i < rowCount; i++ ) {

            tops.push( {
              top: `${ rowHeight + i * this.rowHeight}px`
            } );

          }
          return tops;
        }
      },

      rowHeight: {
        cache: false,
        get(){

          if (window.browser.mobile && this.getColumnCount == 3){

            return this.containerClientWidth / this.getColumnCount;

          } else {

            return this.containerClientWidth / this.getColumnCount + 95;

          }
        }
      },



      itemsLength() {

        if ( Array.isArray( this.items ) ) {

          return this.items.length;

        }

        return 0;

      }

    },

    watch: {
      getColumnCount(){
        this.scrollCnt.scrollTop = this.getScrollData.scrollTop;
        this._setScroll();
      },

      items() {
        const height = ( this.itemsLength / this.getColumnCount + 1) * this.rowHeight;

        this.$set( 'listStyle', {
          height: `${ height }px`,
          maxHeight: `${ height }px`
        } )
      },

      listId( listId ) {

        this.setListId( listId );

        this._run().then( ( scrollTop ) => {

          this.scrollCnt.scrollTop = scrollTop;

        } );

      },

      selectedTagsId( selectedTagsId ) {

        if ( this.tags ) {

          const tagsString = selectedTagsId.join( ',' );

          if ( this.lastSelectedTagId !== tagsString ) {

            this.$set( 'lastSelectedTagId', tagsString );

            this._run( true );

          }

        }

      },

      searchValue() {

        if ( this.search ) {

          this._run( true );

        }

      }

    },

    components: {
      AppLoader,
      photoItem,
      scrollTop
    }

  }
</script>
