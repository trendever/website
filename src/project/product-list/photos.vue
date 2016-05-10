<style src="./styles/photos.pcss"></style>
<template lang="jade">
.photos
  .photo__title-row
    .photo__title-column( :class="{'active': getColumnNumber === 2}", @click="setColumnNumber(2)")
      .photo__title-column-long
      .photo__title-column-long

    .photo__title-column( :class="{'active': getColumnNumber === 3}", @click="setColumnNumber(3)")
      .photo__title-column-short
      .photo__title-column-short
      .photo__title-column-short

  .photos__list(v-el:photos-list)
    template(v-for="product in object_list")
      photo-item(:product="product")

  .photos__more-wrap
    //.photos__more._active(
       :class="{'_active': isWaitReponseProducts}",
       @click="enableInfinityScroll(event, true)")
        .photos__more__base-ic: span еще
        .photos__more__anim-ic: i.ic-update
    .photos__more(
       :class="{'_active': isWaitReponseProducts}",
       @click="showMore()")
        .photos__more__base-ic: span еще
        .photos__more__anim-ic: i.ic-update

  .photos__no-more-wrap(v-if="showBillEmpty")
    .photos__no-goods Товаров не найдено
    .main__bottom.__no-goods: a.main__link(
      @click.prevent.stop="onDropList",
      href="#") Сбросить поиск
</template>

<script type="text/babel">
    import listen from 'event-listener';
    import store from 'vuex/store';
    import photoItem from './photo-item.vue';
    import {
      getPartProducts,
      getMoreProducts,
      setColumnNumber,
      } from 'vuex/actions';
    import {
      searchValue,
      selectedTags,
      products,
      isWaitReponseProducts,
      isInfinityProducts,
      getColumnNumber,
      } from 'vuex/getters';

    const PRODUCTS_PER_PAGE = 9;

    export default {
      ready(){
        if (!this.getColumnNumber) {
          let columnNumber = 3;
          if( document.body.offsetWidth <= 750) {
            columnNumber = 2;
          }
          this.setColumnNumber(columnNumber);
        }
      },
      data: () => ({
        showBillEmpty: false,
        tag_list: [],
        search: '',
        scrollEvent: null,
      }),

      activate(done) {
        if (this.isInfinityProducts) {
          this.enableInfinityScroll();
          done();
        }
        window.body.scrollTop = 1000;
        if (!this.object_list.length) {
          this.getPartProducts({limit: PRODUCTS_PER_PAGE});
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
          getColumnNumber,
        },
        actions: {
          getPartProducts,
          getMoreProducts,
          setColumnNumber,
        }
      },
      methods: {
        enableInfinityScroll(e, show_more) {
          var self = this;
          // Add event for infinity scroll
          this.scrollEvent = listen(window, 'scroll', function(){
            var pos_scroll = window.pageYOffset || document.documentElement.scrollTop;
            var full_scroll = self.$els.photosList.offsetHeight;
            var diff_scroll = full_scroll - pos_scroll;

            if (diff_scroll < 2500 && !self.isWaitReponseProducts) {
                self.showMore()
            }
          });
        },
        showMore() {
          let last_product = this.object_list[this.object_list.length-1];

          let settings = {
            from_id: last_product ? last_product.id : null,
            limit: PRODUCTS_PER_PAGE,
            type: "more"
          };

          // mixpanel.track("Show More Products", {
          //   offset: settings.offset,
          //   view: `${ this.getColumnNumber }columns`,
          // });

          Object.assign(settings, this.getSearchOptions());

          this.getMoreProducts(settings);
        },
        getSearchOptions() {
          let options = {};
          let q = this.searchValue.trim();
          let tags = this.selectedTags.map(tag => tag.id);

          if(q) {
            Object.assign(options, {q});
          }

          if(tags) {
            Object.assign(options, {tags});
          }

          return options;
        },
        loadProducts() {
          // this.$nextTick(() => this.getPartProducts(this.getSearchOptions()))
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