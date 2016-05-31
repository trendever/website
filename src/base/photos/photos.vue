<style src='./styles/photos.pcss'></style>
<template lang="jade">
.photos
  .photo__title-row
    .photo__title-column( :class='{"active": getColumnNumber === 2}', @click='setColumnNumber(2)')
      .photo__title-column-long
      .photo__title-column-long

    .photo__title-column( :class='{"active": getColumnNumber === 3}', @click='setColumnNumber(3)')
      .photo__title-column-short
      .photo__title-column-short
      .photo__title-column-short

  .photos__list(v-el:photos-list, v-if='object_list')
    template(v-for='product in object_list')
      photo-item(:product='product', :animate='animateShow')

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
    import {
      getPartProducts,
      getMoreProducts,
      setColumnNumber,
      clearSearch,
      } from 'vuex/actions';
    import {
      searchValue,
      selectedTags,
      products,
      isWaitReponseProducts,
      isInfinityProducts,
      hasMoreProducts,
      getColumnNumber,
      openedProfile,
      user,
      } from 'vuex/getters';

    const PRODUCTS_PER_PAGE = 9;
    var scrollY = 0;

    export default {
      ready(){
        this.scrollCnt = document.querySelector('.scroll-cnt');
        this.scrollCnt.scrollTop = scrollY;

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
      data: () => ({
        showBillEmpty: false,
        tag_list: [],
        search: '',
        scrollEvent: null,
        animateShow: true,
      }),

      activate(done) {

        if (!this.object_list.length) {
          this.loadProducts();
        } else {
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
          searchValue,
          selectedTags,
          object_list: products,
          isWaitReponseProducts,
          isInfinityProducts,
          hasMoreProducts,
          getColumnNumber,
          openedProfile,
          user,
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
          var self = this;
          // Add event for infinity scroll

          self.scrollEvent = listen(self.scrollCnt, 'scroll', function(){
            scrollY = self.scrollCnt.scrollTop;

            var full_scroll = (self.$els.photosList !== null) ? self.$els.photosList.offsetHeight : 0;
            var diff_scroll = full_scroll - self.scrollCnt.scrollTop;


            if (diff_scroll < 2500 && !self.isWaitReponseProducts) {
              self.showMore()
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

          this.getMoreProducts(settings);
        },
        getSearchOptions() {
          let options = {limit: PRODUCTS_PER_PAGE};
          let q = this.searchValue.trim();
          let tags = this.selectedTags.map(tag => tag.id);
          let openedUser = this.openedUser

          if(q) {
            Object.assign(options, {q});
          }

          if(tags) {
            Object.assign(options, {tags});
          }

          if (this.$route.name === "user") {
            Object.assign(options, { instagram_name: this.$route.params.username })
          }

          if (this.$route.name === "profile") {
            Object.assign(options, { instagram_name: this.user.instagram_username })
          }

          return options;
        },
        loadProducts() {
          this.$nextTick(() => {
            this.getPartProducts(this.getSearchOptions());
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
        }
      },
      components: {
        photoItem,
      }
    }
</script>
