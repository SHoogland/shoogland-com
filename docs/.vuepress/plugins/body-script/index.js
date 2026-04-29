module.exports = (options = {}) => {
	const scripts = Array.isArray(options.scripts) ? options.scripts : []

	return {
		name: 'body-script',
		enhanceAppFiles: () => [{
			name: 'body-script-inject',
			content: `export default ({ isServer }) => {
	if (isServer || typeof document === 'undefined') return
	if (window.__bodyScriptInjected) return
	window.__bodyScriptInjected = true
	const scripts = ${JSON.stringify(scripts)}
	for (const attrs of scripts) {
		const s = document.createElement('script')
		for (const key of Object.keys(attrs)) {
			const value = attrs[key]
			if (key === 'innerHTML') s.innerHTML = value
			else if (value === true) s.setAttribute(key, '')
			else if (value !== false && value != null) s.setAttribute(key, value)
		}
		document.body.appendChild(s)
	}
}
`
		}]
	}
}
