import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
import ImageElement from './ImageElement.vue'
import SimpleAnalyticsBadge from './SimpleAnalyticsBadge.vue'
import './custom.css'

export default {
	extends: DefaultTheme,
	Layout() {
		return h(DefaultTheme.Layout, null, {
			'layout-bottom': () => h(SimpleAnalyticsBadge)
		})
	},
	enhanceApp({ app }) {
		app.component('image-element', ImageElement)
	}
}
