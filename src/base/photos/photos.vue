<style src='./styles/photos.pcss'></style>
<template lang="jade">
.photos(v-bind:style="styleObject")
  .photo__title-row
    .photo__title-column( :class='{"active": getColumnCount === 2}', @click='setColumnNumber(2)')
      .photo__title-column-long
      .photo__title-column-long

    .photo__title-column( :class='{"active": getColumnCount === 3}', @click='setColumnNumber(3)')
      .photo__title-column-short
      .photo__title-column-short
      .photo__title-column-short

  .photos__list(v-el:photos-list, v-if='items')
    template(v-for='item in items | list' track-by="id")
      photo-item( :product.once='item', :animate='isAnimateShow' )

  .photos__more-wrap(v-if='hasMore')
    .photos__more( :class='{"_active": isLoading}', @click='enableInfinityScroll(event, true)' )
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
  import { searchValue, tags } from 'vuex/getters/search.js';

  import {
    setListId,
    setScroll,
    incLengthList,
    setColumnNumber,
    closeProducts,
    setAnimate,
    loadProducts,
  } from 'vuex/actions/products';

  import {
    getProducts,
    getColumnCount,
    getScroll,
    getLengthList,
    hasMore,
    isInfinity,
    isLoading,
    isAnimateShow
  } from 'vuex/getters/products';

  export default {

    vuex: {
      getters: {
        items: getProducts,
        hasMore,
        isInfinity,
        getColumnCount,
        getScroll,
        getLengthList,
        isLoading,
        isAnimateShow,
        searchValue,
        selectedTags : tags
      },
      actions: {
        setListId,
        setScroll,
        incLengthList,
        setColumnNumber,
        clearSearch,
        closeProducts,
        setAnimate,
        loadProducts
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

    data(){
      return {
        styleObject: {
          pointerEvents: 'auto'
        }
      }
    },

    ready(){

      this.setListId( this.listId );

      this.scrollCnt = document.querySelector( '.scroll-cnt' );

      this.run();

    },

    beforeDestroy() {

      if ( this.scrollEvent ) {

        this.scrollEvent.remove();

      }

      this.closeProducts();

    },

    filters: {
      list( value ){
        return value.slice( 0, this.getLengthList );
      }
    },

    methods: {

      emitIsRun(){

        this.$dispatch('photosIsRun');

      },

      run(){

        this.getProducts()
            .then( () => {

              this.restore()
                  .then( () => {

                    if ( this.isInfinity && this.infinityScroll ) {

                      this.enableInfinityScroll();
                      this.emitIsRun();

                    }

                  } )
                  .catch( ( error ) => {

                    console.error( new Error( error ), this.listId );

                  } );

            } )
            .catch( ( error ) => {

              console.error( new Error( error ), this.listId );

            } );

      },

      restore(){

        return new Promise( ( resolve ) => {

          const add = ( targetHeight ) => {

            const { scrollTop } = this.getScroll;
            /**
             * Magic number
             * 1000 - it is height after scrollTop.
             * */
            if ( targetHeight < scrollTop + 1000 ) {

              setTimeout( () => {

                /**
                 * Magic number
                 * 50 - it is step for get items.
                 * */

                this.incLengthList( 50 );

                this.$nextTick( () => {
                  add( this.scrollCnt.scrollHeight );
                } );

              }, 1 );

            } else {

              this.scrollCnt.scrollTop = scrollTop;

              resolve();

            }

          };

          this.$nextTick( () => {

            add( this.scrollCnt.scrollHeight );

          } );

        } );

      },

      getProducts( force = false ){

        const { search, tags, filterByUserName, filterByUserId } = this;

        return this
          .loadProducts( { isSearch: search, isTags: tags, filterByUserName, filterByUserId }, force )
          .then( () => {

            if ( this.isAnimateShow ) {

              setTimeout( () => {

                this.setAnimate(false);

              }, 2000 )

              /**
               * 2 сек после получения данных, после 2 сек выключается анимация
               * жду чтобы картинки успели загрузиться, не вешать же на каждую картинку onLoad
               * */

            }

          } );

      },

      enableInfinityScroll() {
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

            this.setScroll( this.scrollCnt.scrollTop, this.scrollCnt.scrollHeight );

            const full_scroll = (this.$els.photosList !== null) ? this.$els.photosList.offsetHeight : 0;
            const diff_scroll = full_scroll - this.scrollCnt.scrollTop;

            if ( diff_scroll < 2500 && !this.isLoading ) {
              this.showMore();
            }

          }

        })() );
      },

      showMore() {
        if ( this.hasMore || this.getLengthList < this.items.length ) {

          this.getProducts();

          // Stats
          mixpanel.track( 'Show More Products', {
            offset: this.items !== null ? this.items.length : null,
            view: `${ this.getColumnCount }columns`
          } );

        }
      }

    },

    computed: {

      itemsLength(){

        if ( Array.isArray( this.items ) ) {

          return this.items.length;

        }

        return 0;

      }

    },

    watch: {
      listId( listId ){
        this.setListId( listId );
        this.run();
      },
      selectedTags() {
        if ( this.tags ) {
          this.getProducts( true );
        }
      },
      searchValue() {
        if ( this.search ) {
          this.getProducts( true );
        }
      }
    },

    components: {
      photoItem,
      scrollTop
    }
  }
</script>
