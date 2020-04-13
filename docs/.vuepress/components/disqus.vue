<template>
	<div>
		<span class="the-end">The end</span>
		<div id="disqus_thread"></div>
	</div>
</template>

<script>
export default {
	mounted () {
		if(window.location.href.indexOf('www.shoogland.com') < 0){
			return
		}
		let self = this
		let disqus_config = function () {
			this.page.url = `https://www.shoogland.com${self.$page.regularPath}`
			this.page.identifier = self.$page.key;
			this.language = 'en';
		};

		if(!document.disqusLoaded){
			document.disqusLoaded = true
			var d = document, s = d.createElement('script');
			s.src = 'https://shoogland.disqus.com/embed.js';
			s.setAttribute('data-timestamp', +new Date());
			(d.head || d.body).appendChild(s);
		} else {
			DISQUS.reset({
				reload: true,
				config: function () {
					this.page.identifier = self.$page.key;
					this.page.url = `https://www.shoogland.com/${self.$page.regularPath}`;
					this.page.title = self.$page.title;
					this.language = 'en';
				}
			});
		}

	}
}
</script>

<style>
span.the-end{
	display: block;
	padding: 50px 0;
}
</style>
