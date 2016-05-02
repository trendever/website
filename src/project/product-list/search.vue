<style src="./styles/search.pcss"></style>
<template lang="jade">
.search-placeholder
  #search
    .search-input
      .search-input__container
        .search-input__search-btn(
          @click="search()")
          i.ic-search.__mirror

        input.search-input__input(
          v-el:input,
          @keyup="search() | debounce 500",
          :value='searchValue',
          @click="onFocusInput",
          type='text',
          placeholder='Ищите или фильтруйте...')

        .search-input__clear-btn
          span.badge(v-if="selectedTags.length") {{ selectedTags.length }}
          span.close(v-show="searchValue.length || selectedTags.length", @click="clearSearch"): i.ic-close

    .search-tags(
      :class="{'__open': showMoreTags}")
      ul.search-tags__container(v-el:tags)

        li.search-tags__item__selected(
          v-for="tag in selectedTags | filterBy searchValue in 'name'",
          @click="removeTag(tag, $index)",
          @touch="removeTag(tag, $index)")
          span {{ tag.name }}&nbsp;
          i.ic-close

        li.search-tags__item.tag_list(
          v-for="tag in tags | filterBy searchValue in 'name'",
          @click="selectTag(tag)") {{ tag.name }}

      .search-tags__button(
        v-if="showMoreButton",
        @click="toggleShowMoreTags")

</template>

<script type="text/babel">
  import {
    searchValue,
    tags,
    selectedTags
  } from 'vuex/getters';

  import {
    loadTags,
    setSearchValue,
    selectTag,
    removeTag,
    clearSearch
  } from 'vuex/actions';

  export default {
    data(){
      return {
        showMoreTags: false,
        showMoreButton: false
      }
    },

    vuex: {
      getters: {
        searchValue,
        tags,
        selectedTags
      },

      actions: {
        loadTags,
        setSearchValue,
        selectTag,
        removeTag,
        clearSearch
      }
    },

    created() {
      this.loadTags();
    },

    methods: {
      toggleShowMoreTags() {
        this.$els.tags.scrollTop = 0;
        this.showMoreTags = !this.showMoreTags;
      },

      search() {
        this.setSearchValue(this.$els.input.value);
        this.scrollToView();
      },

      scrollToView() {
        if(this.searchValue.trim().length || this.selectedTags.length) {
          // document.getElementById('tags').scrollIntoView();
          //window.body.scrollTop = document.getElementById('tags').offsetTop;
        }
      },

      detectHeightTags() {
        this.$nextTick(() => {
          // TODO - need detect this
          this.showMoreButton = !!(this.$els.tags && (this.$els.tags.scrollHeight > this.$els.tags.clientHeight));
        })
      },

      onFocusInput() {
        this.showMoreTags = false;
      }
    },

    watch: {
      searchValue() {
        this.scrollToView();
        this.detectHeightTags();
      },

      selectedTags() {
        this.scrollToView();
        this.detectHeightTags();
      },

      tags() {
        this.showMoreTags = false;
        this.detectHeightTags();
      }
    }
  }
</script>
