<style src='./styles/photos.pcss'></style>
<template lang="jade">
.photos(v-bind:style="styleObject", v-el:container)
  .photos__list(v-el:photos-list, v-if='items')

    .top-block-height(v-bind:style="{ height: topHeight }")

    template(v-for='item in items | list' track-by="id")
      photo-item( :product.once='item', :animate='isAnimateShow' )

    .bottom-block-height(v-bind:style="{ height: bottomHeight }")

  .photos__more-wrap(v-if='hasMore')
    .photos__more( :class='{"_active": isLoading}', @click='runScroll(event, true)' )
        .photos__more__base-ic: span еще
        .photos__more__anim-ic: i.ic-update

  .photos__no-more-wrap(v-if='itemsLength === 0 && !hasMore')
    .photos__no-goods Товаров не найдено
    .main__bottom.__no-goods: a.link.link_primary(
      @click.prevent.stop='clearSearch()',
      href='#',
      v-if="tags || search" ) Сбросить поиск

scroll-top
</template>

<script type='text/babel'>
  import listen from 'event-listener';

  import scrollTop from 'base/scroll-top/scroll-top.vue';
  import photoItem from './photo-item.vue';

  import { clearSearch } from 'vuex/actions/search.js';
  import { searchValue, tags, selectedTagsId } from 'vuex/getters/search.js';

  import {
    run,
    setListId,
    initScroll,
    updateScroll,
    closeProducts
  } from 'vuex/actions/products';

  import {
    getProducts,
    hasMore,
    isLoading,
    isAnimateShow,
    getVirtualScrollData,
    getColumnCount,
  } from 'vuex/getters/products';

  export default {

    vuex: {
      getters: {
        items: getProducts,
        hasMore,
        getVirtualScrollData,
        isLoading,
        isAnimateShow,
        searchValue,
        selectedTags: tags,
        selectedTagsId,
        getColumnCount
      },
      actions: {
        run,
        setListId,
        initScroll,
        updateScroll,
        clearSearch,
        closeProducts
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
      filterByUserName: {
        default: null
      },
      filterByUserId: {
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
        styleObject: {
          pointerEvents: 'auto'
        },
        lastSelectedTagId: null,
        memRowHeight: 0
      }
    },

    ready() {

      this.setListId( this.listId );

      this.scrollCnt = document.querySelector( '.scroll-cnt' );

      this.resize = listen(window, 'optimizedResize', () => {

        this._updateScroll();

      });

      this.$set( 'lastSelectedTagId', this.selectedTagsId.join( ',' ) );

      this._run().then( ( scrollTop ) => {

        this.$nextTick( () => {

          this.scrollCnt.scrollTop = scrollTop;
          this.runScroll();
          this.emitIsRun();

        } );

      } );

    },

    beforeDestroy() {

      this.resize.remove();

      if ( this.scrollEvent ) {

        this.scrollEvent.remove();

      }

      this.closeProducts();

    },

    filters: {
      list( value ){

        const { idStart, idEnd } = this.getVirtualScrollData;

        console.log( { idStart, idEnd } );

        return value.slice( idStart, idEnd );
      }
    },

    methods: {

      _initScroll(){

        const { search, tags, filterByUserName, filterByUserId } = this;

        this.$set( 'memRowHeight', this.rowHeight );

        return this.initScroll( {
          searchData: { isSearch: search, isTags: tags, filterByUserName, filterByUserId },
          rowHeight: this.memRowHeight,
          viewHeight: this.viewHeight,
          scrollTop: this.scrollTop,
          scrollTopReal: this.scrollCnt.scrollTop
        } );

      },

      _setScroll(){

        const { search, tags, filterByUserName, filterByUserId } = this;

        this.updateScroll( {
          scrollTop: this.scrollTop,
          rowHeight: this.memRowHeight,
          scrollTopReal: this.scrollCnt.scrollTop,
          searchOptions: { isSearch: search, isTags: tags, filterByUserName, filterByUserId }
        } );

      },

      _updateScroll(){

        this.$set( 'memRowHeight', this.rowHeight );

        this.updateScroll( { rowHeight: this.memRowHeight } );

      },

      _run( force = false ) {

        const { search, tags, filterByUserName, filterByUserId } = this;

        return this.run( { isSearch: search, isTags: tags, filterByUserName, filterByUserId }, force );

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

          this._initScroll();

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

        } )() );

      }

    },

    computed: {

      topHeight: {
        cache: false,
        get(){
          return `${ this.getVirtualScrollData.topBlockHeight }px`
        }
      },

      bottomHeight: {
        cache: false,
        get(){
          return `${ this.getVirtualScrollData.bottomBlockHeight }px`
        }
      },

      scrollTop: {
        cache: false,
        get(){

          const scrollTop = this.$els.container.getBoundingClientRect().top;

          return ( scrollTop > 0 ) ? 0 : Math.abs( scrollTop );

        }
      },

      rowHeight: {
        cache: false,
        get(){

          return this.$els.photosList.children[ 1 ].offsetHeight;

        }
      },

      viewHeight: {
        cache: false,
        get(){

          const scrollTop = this.$els.container.getBoundingClientRect().top;

          if ( scrollTop > 0 ) {

            return this.scrollCnt.offsetHeight - scrollTop;

          }

          return this.scrollCnt.offsetHeight;

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
        this._updateScroll();
        this.scrollCnt.scrollTop = 0;
      },
      items(){
        this._setScroll();
      },
      listId( listId ) {

        this.setListId( listId );

        this._run().then( ( scrollTop ) => {

            this.scrollCnt.scrollTop = scrollTop;

        });

      },
      selectedTagsId( selectedTagsId ) {

        if ( this.tags ) {

          const tagsString = selectedTagsId.join( ',' );

          if ( this.lastSelectedTagId !== tagsString ) {

            this.$set( 'lastSelectedTagId', tagsString );

            this._run( true ).then(() => {

              this.$nextTick( () => {

                this._initScroll();

              });

            });

          }

        }

      },
      searchValue() {

        if ( this.search ) {

          this._run( true ).then(() => {

            this.$nextTick( () => {

              this._initScroll();

            });

          });

        }

      }
    },

    components: {
      photoItem,
      scrollTop
    }
  }
</script>
