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
			hostname: 'https://www.shoogland.com'
		},
		'@vuepress/google-analytics': {
			'ga': 'UA-54040031-1'
		}
	}
}