<style src="./styles/hero.pcss"></style>
<template>
    <!-- BEGIN hero -->
    <div class="section hero">
        <div class="section__content hero__content">
            <div class="hero__content__img"></div>

            <!-- BEGIN profile-header -->
            <div class="profile-header">
                <div class="profile-header__logo">
                    <img class="profile-header__logo__img"
                         v-link="{name: 'why'}"
                         src="/static/img/favicon.png"
                         alt="Trendever">
                </div>

                <div class="profile-header__center">
                    <i class="ic-instagram-icon profile-header__center__ic"></i>
                </div>

                <!-- <div class="profile-header__menu">
                    <div class="profile-header__menu-btn" href="#">
                        <div class="profile-header__menu-btn-label">Меню</div>
                        <div class="profile-header__menu-btn-icon"></div>
                    </div>

                    <div class="profile-header__menu-links">
                        <a class="profile-header__menu-link"
                           href="#">Желания</a>
                        <a class="profile-header__menu-link"
                           href="#">Настройки</a>
                        <a class="profile-header__menu-link" href="#">Выйти</a>
                    </div>
                </div> -->
            </div>
            <!-- END profile-header -->

            <div class="hero__content__logo ic-logo"></div>

            <div class="hero__content__description">
                Шопинг в Instagram
                <br>стал проще
            </div>

            <div class="hero__content__btn-cnt">
                <a v-link="{name: 'why'}"
                   class="btn btn_primary">Почему?</a>
            </div>
        </div>
    </div>
    <!-- END hero -->
</template>
