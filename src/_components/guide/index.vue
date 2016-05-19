<template>
<div class="scroll-cnt">
    <header-component
            title='Instagram + Trendever = <i class="ic-heart red"></i>'
            show_on_elem="headerAnchor"></header-component>


    <div class="section main top">
        <div class="section__content main__wrap">
            <div class="main__title">Как покупать<br> прямо в Instagram?</div>
            <!--<div class="main__subtitle">после <a-->
            <!--class="main__link main__link_gray"-->
            <!--href="#">регистрации</a> на-->
            <!--Trendever-->
            <!--</div>-->
            <div class="main__content" id="headerAnchor">
                <div class="main__content__left">
                    <div class="main__list">
                        <div class="main__list__item">
                            <span class="main__list__item__number">1</span>Ищите
                            посты <br>с тегом <br><a class="main__link" target="_blank"
                                                     :href="instagram_url">#trendever</a>
                        </div>
                        <div class="main__list__item">
                            <span class="main__list__item__number">2</span>Поставьте
                            <br>отметку
                            <a class="main__link" target="_blank"
                               :href="instagram_url">@wantit</a>
                            в комментарии
                        </div>
                        <div class="main__list__item">
                            <span class="main__list__item__number">3</span>Ждите
                            email <br>для согласования <br>заказа
                        </div>
                    </div>
                </div>
                <div class="main__content__right">
                    <img src="/static/img/iphone_scr.png" alt="" width="355"
                         height="725">
                </div>
            </div>
            <div class="main__start">
                <a class="main__link main__start__title" target="_blank"
                   :href="instagram_url"
                >Начать шопинг</a>

                <div class="main__start__text">ссылка откроет приложение <br>
                    Instagram, если оно установлено
                </div>
            </div>
            <div class="main__bottom">
                <a class="main__link" v-link="{name: 'home'}">На главную</a>
            </div>
        </div>
    </div>
</div>
</template>

<script>
    import HeaderComponent from 'base/header/header.vue'
    var w = window;

    export default {
        data () {
            return {}
        },
        computed: {
            instagram_url: function () {
                if (w.browser['mobile']) {
                    return "instagram://tag?name=trendever"
                }
                return "http://tofo.me/tag/trendever"
            }
        },
        components: {
            HeaderComponent
        }
    }
</script>