<template>
	<picture>
		<source
			:srcset="`${url}c_fill,h_${height},w_${width},q_auto:best/f_auto${rootFolder}${source} 1x, ${url}c_fill,h_${height * 2},w_${width * 2},q_auto:best/f_auto${rootFolder}${source} 2x`"
			media="(min-width: 1000px)" />
		<source
			:srcset="`${url}c_fill,h_${Math.round(height / 2)},w_${Math.round(width / 2)},q_auto:best/f_auto${rootFolder}${source} 1x, ${url}c_fill,h_${height},w_${width},q_auto:best/f_auto${rootFolder}${source} 2x`" />
		<img :src="`${url}c_fill,h_${height},w_${width},q_auto:best/f_auto${rootFolder}${source}`" :alt="alt" />
	</picture>
</template>

<script>
export default {
	name: 'image-element',
	data() {
		return {
			url: 'https://www.shoogland.com/images/',
			rootFolder: '/shoogland-com/'
		}
	},
	props: ['source', 'width', 'height', 'type', 'alt']
}
</script>
