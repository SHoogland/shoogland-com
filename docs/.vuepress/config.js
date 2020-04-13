const url = 'https://www.shoogland.com'

module.exports = {
	title: 'Stephan Hoogland',
	description: 'Professional Backend Developer',
	head: [
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'author', content: 'Stephan Hoogland'}]
	],
	themeConfig: {
		repo: 'shoogland/shoogland-com',
		editLinks: true,
		docsDir: 'docs',
		lastUpdated: 'Last Updated',
		editLinkText: 'Edit this page on GitHub',
		sidebar: [
			'/2020/',
			'/2017/'
		]
	},
	plugins: {
		'sitemap': {
			hostname: url
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