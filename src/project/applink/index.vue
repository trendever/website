<script type="text/babel">
export default {
  data(){
  	console.log("HERE IT STARTS")
  	if (browser.mobile){
  		window.location = "https://itunes.apple.com/ru/app/trendever/id1124212231"
  	}else{
  		window.location = "https://www.trendever.com"
  	}
    return {}
  }
}
</script>
