<style src="./styles/photos.pcss"></style>
<template lang="jade">
.photos
  .photos__list(v-el:photos-list)
    .photo__title-row
      .photo__title-column(
        :class="{'active': countColumn == 2}",
        @click="countColumn = 2") 2 колонки
      .photo__title-column(
        :class="{'active': countColumn == 3}",
        @click="countColumn = 3") 3 колонки

    template(v-for="product in object_list")
      component(:is="component", :product="product")

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

    import {
      getPartProducts,
      getMoreProducts,
      enableInfinityProducts,
      } from 'vuex/actions';
    import {
      searchValue,
      selectedTags,
      products,
      isWaitReponseProducts,
      isInfinityProducts,
      chatNotifyCount,
      } from 'vuex/getters';

    import photoItemColumn3 from './photo-item-column-3.vue';
    import photoItemColumn2 from './photo-item-column-2.vue';

    var firstLoad =true;
    const CACHE = {
      search: '',
      tag_list: [],
      countColumn: document.body.offsetWidth < 751 ? 2 : 3,
    };
    const LIMIT_TOVAR = 12;

    export default {
      data: () => ({
        countColumn: 3,
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

      created() {
        this.countColumn = CACHE.countColumn;
      },

      beforeDestroy() {
        if (this.scrollEvent) {
          this.scrollEvent.remove();
        }
      },

      computed: {
        component() {
          return `photo-item-column${this.countColumn}`
        },
      },

      vuex: {
        getters: {
          searchValue,
          selectedTags,
          object_list: products,
          chatNotifyCount,
          isWaitReponseProducts,
          isInfinityProducts,
        },
        actions: {
          getPartProducts,
          getMoreProducts,
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

          mixpanel.track("Show More Products", {
            offset: settings.offset,
            view: `${ this.countColumn }columns`,
          });

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
        photoItemColumn3,
        photoItemColumn2,
      }
    }

</script>