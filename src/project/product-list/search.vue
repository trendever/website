<style src="./styles/search.pcss"></style>
<template lang="jade">
.search-placeholder
  #search(
    @click.stop.prevent="missClick",
    @touchmove="missClick",
    :class="{'fix-on-top': fixOnTop}")

    .search-input
      .search-input__container
        .search-input__search-btn(
          @click="onSearch()")
          i.ic-search.__mirror

        input.search-input__input(
          v-el:input,
          @keyup="onSearch() | debounce 500",
          v-model='search',
          @click="onFocusInput",
          type='text',
          placeholder='Ищите или фильтруйте...')

        .search-input__clear-btn
          span.badge(v-if="tag_list_selected.length")
            | {{ tag_list_selected.length }}
          span.close(
          v-show="search.length || tag_list_selected.length",
          @click="onClear"): i.ic-close

    .search-tags(
      v-if="showTags",
      :class="{'__open': openTags}")
      ul.search-tags__container(v-el:tags)

        li.search-tags__item__selected(
          v-for="tag in tag_list_selected | filterBy search in 'name'",
          @click="removeTag(tag, $index)",
          @touch="removeTag(tag, $index)")
          span {{ tag.name }}&nbsp;
          i.ic-close

        li.search-tags__item.tag_list(
          v-for="tag in tag_list | filterBy search in 'name'",
          @click="selectTag(tag)") {{ tag.name }}

        li.search-tags__item.tag_list_tolet(
          v-for="tag in tag_list_tolet | filterBy search in 'name'",
          @click="selectTagTolet(tag)") {{ tag.name }}

      .search-tags__button(
        v-if="showMoreButton",
        @click="onOpenTags")

</template>

<script type="text/babel">
  import {products} from '../../vuex/getters'

  const CACHE = {
    search: '',
    tag_list: [],
    tag_list_selected: [],
    tag_list_tolet: [],
  };

  export default {
    props: [
      { name: 'show_on_elem', default: '' },
    ],
    
    data(){
      return {
        search: '',
        openTags: false,
        showTags: true,
        tag_list: [],
        tag_list_selected: [],
        tag_list_tolet: [],
        fixOnTop: false,
        showMoreButton: false,
        isMissClick: false,
      }
    },

    vuex: {
      getters: {
        products
      },

      actions: {

      }
    },
    
    created() {
      // get from cache
      let {search, tag_list, tag_list_selected, tag_list_tolet} = CACHE;
      
      Object.assign(this, {search, tag_list, tag_list_selected, tag_list_tolet});

      if (!CACHE.tag_list_selected.length) {
        let callback = () => this._sort_photos_tags_selected(tag.name);
        this.getTags();
      }
      // document.addEventListener('click', this.clickOutService, false);
      // document.addEventListener('touchmove', this.clickOutService, false);
      // document.addEventListener('scroll', this.onScroll, false);
    },
    
    destroyed() {
      // document.removeEventListener('click', this.clickOutService, false);
      // document.removeEventListener('touchmove', this.clickOutService, false);
      // document.removeEventListener('scroll', this.onScroll, false);
    },

    methods: {
      onOpenTags() {
        this.$els.tags.scrollTop = 0;
        this.openTags = !this.openTags;
      },

      onSearch(callback = null, force = false) {
        let {search, tag_list_selected: tag_list} = this;

        if (force || tag_list.length || search.trim().length) {
          // scroll to
          document.getElementById('tags').scrollIntoView();

          const delay = this.tag_list_selected.length === 1 ? 600 : 0;

          setTimeout(() => {
            this.$root.$broadcast('search', {search, tag_list, callback});
          }, delay);

          callback(); // todo: remove after debug
        }
      },

      onClear() {
        Object.assign(this, {
          search: '',
          tag_list_selected: [],
          openTags: false
        });

        this.getTags();
        this.onSearch(null, true);
      },

      onFocusInput() {
        this.openTags = false;
        this.showTags = true;
      },

      _sort_photos_tags_selected() {
        const tags = [].concat(this.tag_list, this.tag_list_selected);
        const getTagsFromProduct = product => product.items.reduce((tags, item) => tags.concat(item.tags) , []);
        const getTagsFromProducts = (tags, product) => tags.concat(getTagsFromProduct(product));
        const sort = (a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        };

        this.tag_list_tolet = (this.products || [])
          .reduce(getTagsFromProducts, [])
          .sort(sort)
          .filter( (item, pos, arr) => !pos || item.name !== arr[pos - 1].name)
          .filter( ({name}) => !tags.find( tag => tag.name === name ) );
      },

      selectTag(tag) {
        let length = this.tag_list_selected.length;

        // select main tag
        if (length === 0) {
          this.getTags(tag.id);
        }
        // select daughter tag, uniq them and sort by Weight
        if (length === 1) {
          this.tag_list = [];
        }

        this.tag_list_selected.push(tag);

        this.onSearch(() => this._sort_photos_tags_selected(tag.name), true);

        // this.$els.input.focus();
        this.openTags = false;
      },

      selectTagTolet(tag) {
        this.tag_list_selected.push(tag);
        this.tag_list = [];

        this.onSearch(() => this._sort_photos_tags_selected(tag.name), true);

        // this.$els.input.focus();
        this.openTags = false;
      },

      removeTag(tag, $index) {
        let callback = () => this._sort_photos_tags_selected(tag.name);

        // remove main tag
        if ($index === 0) {
          this.tag_list_selected = [];
          this.getTags();
          this.onSearch(callback, true);
        }

        // remove daughter tag
        if ($index === 1) {
          let firstTag = this.tag_list_selected[0];

          this.tag_list_selected = [firstTag];
          this.getTags(firstTag.id);
          this.onSearch(callback);
        }

        if ($index > 1) {
          this.tag_list.push(tag);
          this.tag_list_selected.$remove(tag);
          let length = this.tag_list_selected.length;
          let filter = this.tag_list_selected[length - 1].name;
          this.onSearch( (callback) => this._sort_photos_tags_selected(filter) );
        }

        this.openTags = false;
      },

      getTags(...tags) {
        window.channel.model.request(
          'retrieve', 'tag', [], {is_main: !tags.length, limit: 40, tags}, {},
          resp => {
            if (!(resp.log_list[0] && resp.log_list[0].code_key == "200")) {
              this.tag_list = [];
              window.topError(resp.log_list[0].code_str, resp.log_list[0].user_msg);
              return;
            }

            let tag_list = resp.response_map.object_list || [];
            let length = this.tag_list_selected.length;
            let lastSelectedTagName = length ? this.tag_list_selected[length - 1].name : '';

            this.tag_list = tag_list.filter(({name}) => lastSelectedTagName !== name);
          }
        )
      },

      detectHeightTags() {
        this.$nextTick(() => {
          // TODO - need detect this
          // if (this.openTags) { return; }
          this.showMoreButton = !!(this.$els.tags && (this.$els.tags.scrollHeight > this.$els.tags.clientHeight));
        })
      },

      clickOutService() {
        if (this.isMissClick) {
          this.isMissClick = false;
          return;
        }

        if (this.fixOnTop) {
          this.showTags = false;
        }

        if (!this.search.length) {
          this.fixOnTop = false;
          this.showTags = true;
          this.openTags = false;
        }
      },

      onScroll() {
        let position = window.getXY(this.show_on_elem)[1];
        let isNeedVisibility = position < 0;

        this.fixOnTop = isNeedVisibility;
        this.showTags = !isNeedVisibility;
      },

      missClick() {
        this.isMissClick = true;
      },
    },

    events: {
      ['drop:search']() {
        this.onClear();
      },
    },

    watch: {
      search() {
        CACHE.search = this.search;
      },

      tag_list() {
         CACHE.tag_list = this.tag_list;
         this.detectHeightTags();
      },

      tag_list_selected() {
        CACHE.tag_list_selected = this.tag_list_selected;
        this.detectHeightTags();
      },

      tag_list_tolet() {
        CACHE.tag_list_tolet = this.tag_list_tolet;
        this.detectHeightTags();
      },
    }
  }
</script>
