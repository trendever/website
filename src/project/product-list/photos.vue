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

  .photos__more-wrap(v-if="showMoreWrapper")
    .photos__more._active(
       :class="{'_active': isWaitReponseProducts}",
       @click="enableInfinityScroll(event, true)")
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
    import photoItem from './photo-item.vue';
    import {
      getPartProducts,
      getMoreProducts,
      enableInfinityProducts,
      setColumnNumber,
      } from 'vuex/actions';
    import {
      searchValue,
      selectedTags,
      products,
      isWaitReponseProducts,
      isInfinityProducts,
      chatNotifyCount,
      getColumnNumber,
      } from 'vuex/getters';

    var firstLoad =true; // Это нужно?
    const CACHE = {
      search: '',
      tag_list: [],
    };
    const LIMIT_TOVAR = 12;

    export default {
      ready(){
        let columnNumber = 3;
        if( (document.body.offsetWidth) <= 750) {
          columnNumber = 2;
        }
        this.setColumnNumber(columnNumber);
      },
      data: () => ({
        showBillEmpty: false,
        showMoreWrapper: true,
        tag_list: [],
        need_clear_objects_list: false,
        search: '',
        scrollEvent: null,
      }),

      activate(done) {
        if (this.isInfinityProducts) {
          this.enableInfinityScroll();
          done();
          return;
        }
        this.getPartProducts({});
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
          chatNotifyCount,
          isWaitReponseProducts,
          isInfinityProducts,
          getColumnNumber,
        },
        actions: {
          getPartProducts,
          getMoreProducts,
          setColumnNumber,
          // enableInfinityProducts,
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

            if (diff_scroll < 1500 && !self.isWaitReponseProducts) {
                self.showMore()
            }
          });
        },
        showMore(callback = null, call) {
          let settings = {
            offset: this.$get('need_clear_objects_list') ? 0 : this.$get('object_list.length'),
            limit: LIMIT_TOVAR,
            type: "more"
          };

          mixpanel.track("Show More Products", { // mixpanel - не понимаю откуда это берётся.
            offset: settings.offset,
            view: `${ this.getColumnNumber }columns`,
          }); //TODO Что это такое?

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
          this.$nextTick(() => this.getPartProducts(this.getSearchOptions()))
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