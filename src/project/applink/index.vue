<script type="text/babel">
export default {
  data(){
  	//айфоновские браузеры
  	if (browser.safari_mobile || browser.iphone || browser.ipod || browser.iphone4 || browser.ipod4 || browser.ipad){
  		yaCounter35346175.reachGoal('get_app');
  		window.location = "https://itunes.apple.com/ru/app/trendever/id1124212231"
  		return{};
  	}

  	//если пк - возвращаем на главную
  	if (browser.chrome || browser.safari || browser.mozilla || browser.opera || browser.msie){
  		window.location = "https://www.trendever.com"
    	return {}
  	}

  	//в других случаях - андроид
	yaCounter35346175.reachGoal('get_app');
	window.location = "https://play.google.com/store/apps/details?id=com.trendever.app"
	return{};

  	
	
  }
}
</script>
