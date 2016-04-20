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
          @click="onSearch")
          i.ic-search.__mirror
        input.search-input__input(
          v-el:input,
          @keyup="onSearch | debounce 500",
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
          v-for="tag in tag_list_selected | filterBy search in 'Name'",
          @click="removeTag(tag, $index)",
          @touch="removeTag(tag, $index)")
          span {{ tag.Name }}&nbsp;
          i.ic-close
        li.search-tags__item.tag_list(
          v-for="tag in tag_list | filterBy search in 'Name'",
          @click="selectTag(tag)") {{ tag.Name }}
        li.search-tags__item.tag_list_tovar(
          v-for="tag in tag_list_tovar | filterBy search in 'Name'",
          @click="selectTagTovar(tag)") {{ tag.Name }}
      .search-tags__button(
        v-if="showMoreButton",
        @click="onOpenTags")

</template>

<script>

  const CACHE = {
    search: '',
    tag_list: [],
    tag_list_selected: [],
    tag_list_tovar: [],
  };

  export default {
    props: [
      { name: 'show_on_elem', default: '' },
    ],
    data: () => ({
      search: '',
      openTags: false,
      showTags: true,
      tag_list: [],
      tag_list_selected: [],
      tag_list_tovar: [],
      fixOnTop: false,
      showMoreButton: false,
      isMissClick: false,
    }),
    created() {
      // get from cache
      this.$set('search', CACHE.search);
      this.$set('tag_list', CACHE.tag_list);
      this.$set('tag_list_selected', CACHE.tag_list_selected);
      this.$set('tag_list_tovar', CACHE.tag_list_tovar);

      if (!CACHE.tag_list_selected.length) {
        var callback = () => this._sort_photos_tags_selected(tag.Name);
        this.getTags();
      }
      // document.addEventListener('click', this.clickOutService, false);
      // document.addEventListener('touchmove', this.clickOutService, false);
      // document.addEventListener('scroll', this.OnScroll, false);
    },
    destroyed() {
      // document.removeEventListener('click', this.clickOutService, false);
      // document.removeEventListener('touchmove', this.clickOutService, false);
      // document.removeEventListener('scroll', this.OnScroll, false);
    },
    methods: {
      onOpenTags() {
        this.$els.tags.scrollTop = 0;
        this.$set('openTags', !this.$get('openTags'));
      },
      onSearch(callback = null, force = false) {
        var search = this.$get('search');

        var isTagsEmpty = !(this.tag_list_selected && this.tag_list_selected.length);
        var isSearchEmpty = !search && (search.length < 1);

        if ( !force && isTagsEmpty && isSearchEmpty ) {
          return;
        }
        // if space
        if (search.trim() !== search && !force) { return; }

        // scroll to
        document.getElementById('tags').scrollIntoView();

        var onTimeOut = this.tag_list_selected.length === 1 ? 600 : 0;
        setTimeout( () => {
          this.$root.$broadcast('search', {
            search, callback,
            tag_list: this.$get('tag_list_selected')
          });
        }, onTimeOut);
      },
      onClear() {
        this.$set('search', '');
        this.$set('tag_list_selected', []);
        this.$set('openTags', false);
        this.getTags();
        this.onSearch(null, true);
      },
      onFocusInput() {
        this.$set('openTags', false);
        this.$set('showTags', true);
      },
      _sort_photos_tags_selected() {
        var arr = [].concat(this.$get('tag_list'), this.$get('tag_list_selected'));

        var tags = (window.photos || []).map( photo => photo.Tags )
          .reduce( (tagsList, arr) => tagsList.concat(arr), [] )
          .sort( (a, b) => {
            if (a.Name < b.Name) return -1;
            if (a.Name > b.Name) return 1;
            return 0;
          }).filter( (item, pos, arr) => {
            return !pos || item.Name !== arr[pos - 1].Name
          }).sort( (a, b) => a.Weight - b.Weight)
          .filter( ({Name}) => !arr.find( tag => tag.Name === Name ) );

          this.$set('tag_list_tovar', tags || []);
      },
      selectTag(tag) {
        var length = this.$get('tag_list_selected').length;
        var callback = () => this._sort_photos_tags_selected(tag.Name);

        // select main tag
        if (length === 0) {
          this.getTags({id: tag.Id});
        }
        // select daughter tag, uniq them and sort by Weight
        if (length === 1) {
          this.$set('tag_list', []);
        }

        this.tag_list_selected.push(tag);
        this.onSearch(callback, true);

        // this.$els.input.focus();
        this.$set('openTags', false);
      },
      selectTagTovar(tag) {
        var callback = () => this._sort_photos_tags_selected(tag.Name);

        this.tag_list_selected.push(tag);
        this.$set('tag_list', []);
        this.onSearch(callback, true);

        // this.$els.input.focus();
        this.$set('openTags', false);
      },
      removeTag(tag, $index) {
        var callback = () => this._sort_photos_tags_selected(tag.Name);

        // remove main tag
        if ($index === 0) {
          this.$set('tag_list_selected', []);
          this.getTags();
          this.onSearch(callback, true);
        }

        // remove daughter tag
        if ($index === 1) {
          this.$set('tag_list_selected', [this.tag_list_selected[0]]);
          this.getTags({id: this.tag_list_selected[0].Id});
          this.onSearch(callback);
        }

        if ($index > 1) {
          this.tag_list.push(tag);
          this.tag_list_selected.$remove(tag);
          var length = this.tag_list_selected.length;
          var filter = this.tag_list_selected[length - 1].Name;
          this.onSearch( (callback) => this._sort_photos_tags_selected(filter) );
        }

        this.$set('openTags', false);
      },
      getTags(settings = { is_main: true, limit: 40 }) {

        window.channel.model.request(
          'retrieve', 'tag', [], settings, {},
          resp => {
            let tag_list = resp["response_map"]["object_list"] || [];
            var length = this.$get('tag_list_selected').length;
            var filter = length ? this.$get('tag_list_selected')[length - 1].Name : '';

            tag_list = tag_list.filter( ({Name}) => filter !== Name );
            this.$set('tag_list', tag_list);

            if (resp.log_list[0] && resp.log_list[0].code_key == "200") {
            } else {
              this.$set('tag_list', []);
              window.topError(resp.log_list[0].code_str, resp.log_list[0].user_msg);
            }
          }
        )
      },
      detectHeightTags() {
        // TODO - need detect this
        // if (this.openTags) { return; }

        if (this.$els.tags && (this.$els.tags.scrollHeight > this.$els.tags.clientHeight)) {
          this.$set('showMoreButton', true);
        } else {
          this.$set('showMoreButton', false);
        }
      },
      clickOutService() {
        if (this.$get('isMissClick')) {
          this.$set('isMissClick', false);
          return;
        }
        if (this.fixOnTop) {
          this.$set('showTags', false);
        }
        if (!this.$get('search.length')) {
          this.$set('fixOnTop', false);
          this.$set('showTags', true);
          this.$set('openTags', false)
        };
      },
      OnScroll() {
        var show_on_elem = this.$get('show_on_elem');
        var position = window.getXY(show_on_elem)[1];

        // var isNeedVisiblity = (this.lastPosition - position < 0) || this.$get('search.length');
        var isNeedVisiblity = (window.getXY(show_on_elem)[1] < 0);

        if (isNeedVisiblity) {
          this.$set('fixOnTop', true);
          this.$set('showTags', false);
        } else {
          this.$set('fixOnTop', false);
          this.$set('showTags', true);
        }

        this.lastPosition = position;
      },
      missClick() {
        this.$set('isMissClick', true);
      },
    },
    events: {
      ['drop:search']() {
        this.onClear();
      },
    },
    watch: {
      search() {
        CACHE.search = this.$get('search');
      },
      tag_list() {
         CACHE.tag_list = this.$get('tag_list');
         this.$nextTick(this.detectHeightTags);
      },
      tag_list_selected() {
        CACHE.tag_list_selected = this.$get('tag_list_selected');
        this.$nextTick(this.detectHeightTags);
      },
      tag_list_tovar() {
        CACHE.tag_list_tovar = this.$get('tag_list_tovar');
        this.$nextTick(this.detectHeightTags);
      },
    }
  }
</script>
