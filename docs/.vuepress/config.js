const url = 'https://www.shoogland.com'

module.exports = {
	title: 'Stephan Hoogland',
	description: 'Professional Backend Developer',
	head: [
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'author', content: 'Stephan Hoogland' }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }]
	],
	themeConfig: {
		repo: 'shoogland/shoogland-com',
		editLinks: true,
		docsDir: 'docs',
		docsBranch: 'main',
		lastUpdated: 'Last Updated',
		editLinkText: 'Edit this page on GitHub',
		sidebar: [
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
		'@vuepress/google-analytics': {
			'ga': 'UA-54040031-1'
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
