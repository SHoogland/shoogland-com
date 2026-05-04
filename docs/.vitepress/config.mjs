import { defineConfig } from 'vitepress'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { Feed } from 'feed'

const url = 'https://www.shoogland.com'
const author = {
	name: 'Stephan Hoogland',
	email: 'stephan@shoogland.com',
	link: url
}

export default defineConfig({
	title: 'Stephan Hoogland',
	description: 'Professional Backend Developer',
	cleanUrls: false,
	lastUpdated: true,
	ignoreDeadLinks: true,
	rewrites: {
		'README.md': 'index.md',
		':year(\\d{4})/README.md': ':year/index.md'
	},
	sitemap: {
		hostname: url
	},
	head: [
		['link', { rel: 'icon', href: '/favicon.png' }],
		['meta', { name: 'author', content: author.name }],
		['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
		['script', { 'data-collect-dnt': 'true', async: '', src: 'https://www.shoogland.com/proxy.js' }]
	],
	themeConfig: {
		lastUpdatedText: 'Last Updated',
		socialLinks: [
			{ icon: 'github', link: 'https://github.com/shoogland/shoogland-com' }
		],
		editLink: {
			pattern: 'https://github.com/shoogland/shoogland-com/edit/main/docs/:path',
			text: 'Edit this page on GitHub'
		},
		sidebar: [
			{ text: '2025', link: '/2025/' },
			{ text: '2024', link: '/2024/' },
			{ text: '2022', link: '/2022/' },
			{ text: '2021', link: '/2021/' },
			{ text: '2020', link: '/2020/' },
			{ text: '2017', link: '/2017/' },
			{ text: '2015', link: '/2015/' }
		]
	},
	async buildEnd(siteConfig) {
		const feed = new Feed({
			title: siteConfig.site.title,
			description: siteConfig.site.description,
			id: url,
			link: url,
			language: 'en',
			image: `${url}/favicon.png`,
			favicon: `${url}/favicon.png`,
			copyright: `All rights reserved ${new Date().getFullYear()}, ${author.name}`,
			author
		})

		const posts = siteConfig.pages
			.filter((page) => /^\d{4}\/\d{2}-\d{2}-/.test(page))
			.map((page) => {
				const file = path.join(siteConfig.srcDir, page)
				const data = siteConfig.pageData?.[page] ?? null
				return { page, file, data }
			})

		// fall back to reading frontmatter manually since pageData is not exposed
		const matter = (await import('gray-matter')).default
		const fs = await import('node:fs')

		const entries = posts.map(({ page, file }) => {
			const raw = fs.readFileSync(file, 'utf-8')
			const { data, content } = matter(raw)
			const slug = page.replace(/\.md$/, '.html')
			return {
				title: data.title || content.match(/^#\s+(.+)$/m)?.[1] || slug,
				description: data.description || '',
				date: data.date ? new Date(data.date) : new Date(),
				link: `${url}/${slug}`
			}
		})

		entries
			.sort((a, b) => b.date - a.date)
			.forEach((entry) => {
				feed.addItem({
					title: entry.title,
					id: entry.link,
					link: entry.link,
					description: entry.description,
					date: entry.date
				})
			})

		writeFileSync(path.join(siteConfig.outDir, 'feed.rss'), feed.rss2())
		writeFileSync(path.join(siteConfig.outDir, 'feed.atom'), feed.atom1())
	}
})
