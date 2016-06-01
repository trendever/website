<style src='./styles/photos.pcss'></style>
<template lang="jade">
.photos
  .photo__title-row
    .photo__title-column( :class='{"active": getColumnNumber === 2}', @click='setColumnNumber(list, 2)')
      .photo__title-column-long
      .photo__title-column-long

    .photo__title-column( :class='{"active": getColumnNumber === 3}', @click='setColumnNumber(list, 3)')
      .photo__title-column-short
      .photo__title-column-short
      .photo__title-column-short

  .photos__list(v-el:photos-list, v-if='object_list')
    template(v-for='product in object_list' track-by="id")
      photo-item(:product.once='product', :animate='animateShow')

  .photos__more-wrap(v-if='hasMoreProducts')
    .photos__more(
       :class='{"_active": isWaitReponseProducts}',
       @click='enableInfinityScroll(event, true)')
        .photos__more__base-ic: span еще
        .photos__more__anim-ic: i.ic-update

  .photos__no-more-wrap(v-if='!object_list')
    .photos__no-goods Товаров не найдено
    .main__bottom.__no-goods: a.link.link_primary(
      @click.prevent.stop='clearSearch()',
      href='#') Сбросить поиск
</template>

<script type='text/babel'>
    import listen from 'event-listener';

    import store from 'vuex/store';
    import photoItem from './photo-item.vue';
    import { clearSearch } from 'vuex/actions';
    import {
      getPartProducts,
      getMoreProducts,
      setColumnNumber,
      enableInfinityProducts,
      openList,
    } from 'vuex/actions/products';
    import {
      searchValue,
      selectedTags,
    } from 'vuex/getters';
    import {
        lists,
        isWaitReponseProducts,
        isInfinityProducts,
        hasMoreProducts,
        getColumnNumber,
    } from 'vuex/getters/products';

    const PRODUCTS_PER_PAGE = 9;
    var scrollPositions = {}

    export default {
      data: () => ({
        showBillEmpty: false,
        tag_list: [],
        search: '',
        scrollEvent: null,
        animateShow: true,
        object_list: [],
      }),

      props: {
        filters: {
          type: Object,
          default: () =>  {
            return {tags: false, search: false}
          }
        },
        filterBy: {
          type: Object
        },
        list: {
          type: String,
          required: true
        }
      },

      ready(){
        this.scrollCnt = document.querySelector('.scroll-cnt')
        let scrollY = scrollPositions[this.list]
        this.scrollCnt.scrollTop = scrollY > 0 ? scrollY : 0

        if (!this.getColumnNumber) {
          let columnNumber = 3;
          if( document.body.offsetWidth <= 750) {
            columnNumber = 2;
          }
          this.setColumnNumber(columnNumber);
        }
        if (this.isInfinityProducts) {
          this.enableInfinityScroll();
        }
      },

      activate(done) {
        openList(store, this.list)

        var list = lists(store.state)[this.list]
        if (!list || !list.length) {
          this.loadProducts();
        } else {
          this.object_list = list
          this.animateShow = false;
        }
        done();
      },

      beforeDestroy() {
        if (this.scrollEvent) {
          this.scrollEvent.remove();
        }
      },

      vuex: {
        getters: {
          lists,
          searchValue,
          selectedTags,
          isWaitReponseProducts,
          isInfinityProducts,
          hasMoreProducts,
          getColumnNumber,
        },
        actions: {
          getPartProducts,
          getMoreProducts,
          setColumnNumber,
          clearSearch,
        }
      },

      methods: {
        enableInfinityScroll(e, show_more) {
          // Add event for infinity scroll
          this.scrollEvent = listen(this.scrollCnt, 'scroll', () => {
            scrollPositions[this.list] = this.scrollCnt.scrollTop;

            var full_scroll = (this.$els.photosList !== null) ? this.$els.photosList.offsetHeight : 0;
            var diff_scroll = full_scroll - this.scrollCnt.scrollTop;

            console.log(this.isWaitReponseProducts);
            if (diff_scroll < 2500 && !this.isWaitReponseProducts) {
              this.showMore()
            }
          });
        },
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
          });;
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
      watch: {
        selectedTags() {
          this.loadProducts();
        },
        searchValue() {
          this.loadProducts();
        },
      },
      components: {
        photoItem,
      }
    }
</script>
