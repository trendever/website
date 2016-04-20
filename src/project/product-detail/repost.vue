<style src="./repost.pcss"></style>
<template lang="jade">
div
  .repost(:style="{height: height}")
    .info__close(@click="back"): i.ic-close
    .crop
      img(:src="object.IgImageUrl")
      .repost_header
        h1 Пост в Instagram
    .step.step_1
      .title
        .circle: p 1
        span Сохраните фотографию

      .step_cnt
        .action
          .pict
            img(:src="object.IgImageUrl")
          img.tap(src="/static/img/tap_white.png")
        p Нажмите на фото#[br] #[span.emoji.emoji_fingleft] здесь слева#[br]и удерживайте,#[br]чтобы сохранить

    .step.step_2
      .title
        .circle: p 2
        span Затем скопируйте подпись

      .step_cnt
        .action
          .pict(v-on:copy="addInfo")
            span {{{ caption }}}
          .tail
          img.tap(src="/static/img/tap_grey.png")
        p(
          unselectable="on",
          onselectstart="return false;",
          onmousedown="return false;") Нажмите на текст #[br] #[span.emoji.emoji_fingleft] здесь слева#[br]и удерживайте,#[br] чтобы скопировать

    .footer
      p Нажмите "Продолжить",#[br]чтобы открыть Instagram#[br]и вставить фото с текстом
      button(v-on:click="openInsta") Продолжить
        i.ic-instagram-icon
</template>

<script>
  import products_find from 'services/products/products'
  import { createOpportunity, getFromCache } from 'services/actions'

  export default {
    data: () => ({
      object: {},
      id: ''
    }),
    route: {
      data(transition) {
        var id = +transition.to.params.id;
        var object = getFromCache(id);

        if (object) {
          products_find([], {id}, {}, resp => {
            let object = resp["response_map"]["object_list"][0];
            this.$set('object', object);
          });

          return {id, object};
        }

        return new Promise ( res => products_find([], {id}, {}, resp => {
          let object = resp["response_map"]["object_list"][0];
          res({id, object});

          // for cached
          window.photos = (window.photos || []).concat(object);
        }));
      }
    },
    computed: {
      height() {
        // TODO handler fo resize
        return `${window.innerHeight}px`;
      },
      caption() {
        var source = this.object.IgImageCaption;
        if (!source) return;
        // remove emoji
        // source = source.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, ' ');
        source = source.replace(/([^0-9a-zа-я\s])/ig, ' ').replace(/\s{2,}/g, ' ');
        // need part of text for bubble
        source = source.slice(0, 80);
        source = source.replace(/[.,\/#!\'\"$%+\s@\^☀️&\*;:{}=\-_`~()]/g, "<span class='whitespace'></span>");
        return source + '...'
      }
    },
    methods: {
      back(productId) {
        mixpanel.track("Close Repost Page", {productId: productId});

        this.$route.router.go({
          name: 'product_detail',
          params: { id: this.$get('id') }
        });
      },
      openInsta() {
        window.open("instagram://camera", '_blank');
      },
      addInfo() {
          //Get the selected text and append the extra info
          var selection = window.getSelection(),
              before = 'Покупайте в этой ленте, написав в комментарии @wantit 🙌 <br><br>',
              after = '<br><br>Напишите @wantit 🌷 и инста-шоп ' + this.object.IgSupplierUsername + ' вам ответит ✒️' + this.object.Code + ', все товары на #trendever.com @trendevercom',
              copytext = before + this.object.IgImageCaption + after,
              newdiv = document.createElement('div');

          //hide the newly created container
          newdiv.style.position = 'absolute';
          newdiv.style.top = '-99999px';

          //insert the container, fill it with the extended text, and define the new selection
          document.body.appendChild(newdiv);
          newdiv.innerHTML = copytext;
          selection.selectAllChildren(newdiv);

          window.setTimeout(function () {
              document.body.removeChild(newdiv);
          }, 1);
      }
    }
  }
</script>
