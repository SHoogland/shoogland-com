import DefaultTheme from 'vitepress/theme'
import ImageElement from './ImageElement.vue'
import './custom.css'

export default {
	extends: DefaultTheme,
	enhanceApp({ app }) {
		app.component('image-element', ImageElement)
	}
}
