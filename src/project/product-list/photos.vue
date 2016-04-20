<style src="./styles/photos.pcss"></style>
<template lang="jade">
.photos
  .photos__list#PhotosList
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

<script>
    import {
      getPartProducts,
      getMoreProducts,
      enableInfinityProducts,
      } from 'vuex/actions';
    import {
      products,
      isWaitReponseProducts,
      isInfinityProducts,
      chatNotifyCount,
      } from 'vuex/getters';

    import photoItemColumn3 from './photo-item-column-3.vue';
    import photoItemColumn2 from './photo-item-column-2.vue';

    var w = window;
    var firstLoad =true;
    const CACHE = {
      search: '',
      tag_list: [],
      countColumn: document.body.offsetWidth < 751 ? 2 : 3,
    };
    const LIMIT_TOVAR = 9;

    export default {
      data: () => ({
        countColumn: 3,
        showBillEmpty: false,
        showMoreWrapper: true,
        tag_list: [],
        need_clear_objects_list: false,
        search: '',
      }),

      activate(done) {
        if (this.object_list.length > 1) {
          this.enableInfinityScroll();
          done();
          return;
        }
        this.getPartProducts({});
        done();
      },

      created() {
        // get from cache
        // this.$set('search', CACHE.search);
        // this.$set('tag_list', CACHE.tag_list);
        this.countColumn = CACHE.countColumn;
        this.$on('hook:beforeDestroy', () => {
          // remove old events and data
          w.processDestroy(w.cur);
        });
      },

      beforeDestroy() {
        document.removeEventListener('scroll', this._handlerScroll, false);
        // w.search = this.$get('search');
      },

      computed: {
        component() {
          return `photo-item-column${this.countColumn}`
        },
      },

      vuex: {
        getters: {
          object_list: products,
          chatNotifyCount,
          isWaitReponseProducts,
          isInfinityProducts,
        },
        actions: {
          getPartProducts,
          getMoreProducts,
          enableInfinityProducts,
        }
      },

      methods: {
    //     onDropList() {
    //       this.$root.$broadcast('drop:search');
    //     },

        _handlerScroll() {
          var pos_scroll = w.scrollGetY();
          var full_scroll = w.ge("PhotosList").offsetHeight;
          var diff_scroll = full_scroll - pos_scroll;

          if (diff_scroll < 1500 && !this.isWaitReponseProducts) {
              this.showMore()
          }
        },

        enableInfinityScroll(e, show_more) {
          this.enableInfinityProducts();

          // Add new
          if (show_more) {
            this.showMore();
          }
          // Add event for infinity scroll
          document.addEventListener('scroll', this._handlerScroll, false);
        },

        showMore(callback = null, call) {
          var settings = {
            offset: this.$get('need_clear_objects_list') ? 0 : this.$get('object_list.length'),
            limit: LIMIT_TOVAR,
            type: "more"
          };

          mixpanel.track("Show More Products", {
            offset: settings.offset,
            view: `${ this.countColumn }columns`,
          });

          // if (this.$get('search').length) {
          //   settings.q = this.search;
          // }

          // if (this.$get('tag_list').length) {
          //   settings.tags = this.tag_list;
          // }

          this.getMoreProducts(settings);
        },

        // _handleResponse(resp, callback) {
          // this.$set('is_wait_response', false);
          // let object_list = resp["response_map"]["object_list"];

          // // if empty response
          // if (!object_list.length) {
          //   this.$set('showMoreWrapper', false);
          //   document.removeEventListener('scroll', this._handlerScroll, false);
          // }

          // object_list = this.$get('need_clear_objects_list')
          //   ? object_list
          //   : this.$get('objects_list').concat(object_list);
          // this.$set('need_clear_objects_list', false);

          // // if empty all response
          // if (!object_list.length) {
          //   this.$set('showBillEmpty', true);
          // }

          // this.$set('objects_list', object_list);

          // // caching data
          // window.photos = this.$get('objects_list');

          // if (typeof callback === "function") { callback(); }
        // },
      },

    //   events: {
    //     // search({search, tag_list, callback = null}) {
    //     //   this.$set('tag_list',tag_list.map( tag => tag.Id ));
    //     //   this.$set('search', search.trim());
    //     //   this.$set('need_clear_objects_list', true);
    //     //   this.$nextTick( () => this.showMore(callback));
    //     // },
    //   },

    //   watch: {
    //     objects_list: {
    //       handler() {
    //         var count = this.$get('objects_list').length;

    //         if(!count) {
    //           this.$set('showMoreWrapper', false);
    //           this.$set('showBillEmpty', true);
    //         } else if (count % LIMIT_TOVAR === 0){
    //           this.$set('showMoreWrapper', true);
    //           this.$set('showBillEmpty', false);
    //         } else if (count % LIMIT_TOVAR !== 0) {
    //           this.$set('showMoreWrapper', false);
    //           this.$set('showBillEmpty', false);
    //           }
    //       },
    //       deep: true,
    //     },
    //     // search() {
    //     //   CACHE.search = this.$get('search');
    //     // },
    //     // tag_list() {
    //     //   CACHE.tag_list = this.$get('tag_list');
    //     // },
    //     countColumn() {
    //       CACHE.countColumn = this.$get('countColumn');
    //     },
    //   },

      components: {
        photoItemColumn3,
        photoItemColumn2,
      }
    }

</script>