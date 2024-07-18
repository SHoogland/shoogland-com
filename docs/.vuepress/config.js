const url = 'https://www.shoogland.com'

module.exports = {
	title: 'Stephan Hoogland',
	description: 'Professional Backend Developer',
	head: [
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'author', content: 'Stephan Hoogland' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
		['script', {}, `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://gtm.shoogland.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-T5DJK36');`]
	],
	themeConfig: {
		repo: 'shoogland/shoogland-com',
		editLinks: true,
		docsDir: 'docs',
		docsBranch: 'main',
		lastUpdated: 'Last Updated',
		editLinkText: 'Edit this page on GitHub',
		sidebar: [
			'/2024/',
			'/2022/',
			'/2021/',
			'/2020/',
			'/2017/',
			'/2015/'
		]
	},
	plugins: {
		'sitemap': {
			hostname: url,
			exclude: ['/404.html']
		},
		'feed': {
			canonical_base: url,
			feed_options: {
				author: {
					name: "Stephan Hoogland",
					email: "stephan@shoogland.com",
					link: url
				}
			},
			count: 100,
			sort: entries => entries.reverse()
		}
	}
}
