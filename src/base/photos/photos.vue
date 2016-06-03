<style src='./styles/photos.pcss'></style>
<template lang="jade">
.photos
  .photo__title-row
    .photo__title-column( :class='{"active": getColumnCount === 2}', @click='setColumnNumber(2)')
      .photo__title-column-long
      .photo__title-column-long

    .photo__title-column( :class='{"active": getColumnCount === 3}', @click='setColumnNumber(3)')
      .photo__title-column-short
      .photo__title-column-short
      .photo__title-column-short

  .photos__list(v-el:photos-list, v-if='object_list')
    template(v-for='product in object_list' track-by="id")
      photo-item( :product.once='product', :animate='isAnimateShow' )

  .photos__more-wrap(v-if='hasMore')
    .photos__more( :class='{"_active": isLoading}', @click='enableInfinityScroll(event, true)' )
        .photos__more__base-ic: span еще
        .photos__more__anim-ic: i.ic-update

  .photos__no-more-wrap(v-if='!object_list')
    .photos__no-goods Товаров не найдено
    .main__bottom.__no-goods: a.link.link_primary(
      @click.prevent.stop='clearSearch()',
      href='#',
      v-if="tags || search" ) Сбросить поиск
</template>

<script type='text/babel'>
    import listen from 'event-listener';

    import photoItem from './photo-item.vue';

    import { clearSearch } from 'vuex/actions';
    import { searchValue, selectedTags } from 'vuex/getters';

    import {
      setListId,
      setScrollTop,
      incLengthList,
      setColumnNumber,
      enableInfinityProducts,
      productsClose,
      forceLoadProducts,
    } from 'vuex/actions/products';

    import {
      getList,
      hasMore,
      isInfinity,
      getColumnCount,
      getScrollTop,
      getLengthList,
      isLoading,
      isAnimateShow
    } from 'vuex/getters/products';

    export default {

      props: {
        tags:{
          type: Boolean,
          default: false
        },
        search:{
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

      ready(){

        this.scrollCnt = document.querySelector('.scroll-cnt');

        this.scrollCnt.scrollTop = this.getScrollTop;

        if (this.isInfinity && this.infinityScroll) {

          this.enableInfinityScroll();

        }

      },

      beforeDestroy() {

        if (this.scrollEvent) {

          this.scrollEvent.remove();

        }

        this.productsClose();

      },

      vuex: {
        getters: {
          getList,
          hasMore,
          isInfinity,
          getColumnCount,
          getScrollTop,
          getLengthList,
          isLoading,
          isAnimateShow,
          searchValue,
          selectedTags
        },
        actions: {
          setListId,
          setScrollTop,
          incLengthList,
          setColumnNumber,
          clearSearch,
          productsClose,
          forceLoadProducts
        }
      },

      methods: {

        enableInfinityScroll() {

          this.scrollEvent = listen( this.scrollCnt, 'scroll', () => {

            this.setScrollTop( this.scrollCnt.scrollTop );

            var full_scroll = (this.$els.photosList !== null) ? this.$els.photosList.offsetHeight : 0;
            var diff_scroll = full_scroll - this.scrollCnt.scrollTop;

            if ( diff_scroll < 2500 ) {
              //this.showMore()
            }

          } );

        },

        getSearchOptions() {
          let options = {limit: PRODUCTS_PER_PAGE};

          if (this.filters.search) {
            let q = this.searchValue.trim();

            if(q) {
              Object.assign(options, {q});
            }
          }

          if (this.filters.tags) {
            let tags = this.selectedTags.map(tag => tag.id);
            if(tags) {
              Object.assign(options, {tags});
            }
          }

          if (this.filterBy) {
            Object.assign(options, this.filterBy);
          }

          return options;
        },

        loadProducts() {
          this.$nextTick(() => {
            this.getPartProducts(this.getSearchOptions())
                .then( (data) => {
                  this.object_list = data
                });
            this.animateShow = true;
          })
        }

      },

/*      methods: {
         showMore() {
          if (!this.hasMoreProducts){ return; }
          this.animateShow = true;

          let last_product = this.object_list[this.object_list.length-1];

          let settings = {
            from_id: last_product ? last_product.id : null,
            type: 'more'
          };

          mixpanel.track('Show More Products', {
            offset: this.object_list.length,
            view: `${ this.getColumnNumber }columns`,
          });

          Object.assign(settings, this.getSearchOptions());

          this.getMoreProducts(settings)
          .then( (data) => {
            // this.object_list = this.object_list.concat(data)
            this.object_list = data
          });
        },
      },*/
      watch: {
        selectedTags() {
          if (this.tags) {
            this.forceLoadProducts(this.search, this.tags);
          }
        },
        searchValue() {
          if (this.search) {
            this.forceLoadProducts(this.search, this.tags);
          }
        },
      },

      components: {
        photoItem,
      }
    }
</script>
