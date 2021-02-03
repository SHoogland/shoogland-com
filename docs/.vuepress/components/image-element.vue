<template>
	<picture>
		<source 
			:srcset="`${url}c_fill,h_${height},w_${width},q_auto:best${rootFolder}${source}.webp 1x, ${url}c_fill,h_${height*2},w_${width*2},q_auto:best${rootFolder}${source}.webp 2x`"
			media="(min-width: 1000px)"
			type="image/webp"
		/>
		<source v-if="type === 'png'"
			:srcset="`${url}c_fill,h_${height},w_${width},q_auto:best${rootFolder}${source}.png 1x, ${url}c_fill,h_${height*2},w_${width*2},q_auto:best${rootFolder}${source}.png 2x`"
			media="(min-width: 1000px)"
			type="image/png"
		/>
		<source v-else
			:srcset="`${url}c_fill,h_${height},w_${width},q_auto:best${rootFolder}${source}.jpg 1x, ${url}c_fill,h_${height*2},w_${width*2},q_auto:best${rootFolder}${source}.jpg 2x`"
			media="(min-width: 1000px)"
			type="image/jpeg"
		/>
		<source 
			:srcset="`${url}c_fill,h_${Math.round(height/2)},w_${Math.round(width/2)},q_auto:best${rootFolder}${source}.webp 1x, ${url}c_fill,h_${height},w_${width},q_auto:best${rootFolder}${source}.webp 2x`"
			type="image/webp"
		/>
		<source v-if="type === 'png'"
			:srcset="`${url}c_fill,h_${Math.round(height/2)},w_${Math.round(width/2)},q_auto:best${rootFolder}${source}.png 1x, ${url}c_fill,h_${height},w_${width},q_auto:best${rootFolder}${source}.png 2x`"
			type="image/png"
		/>
		<source v-else
			:srcset="`${url}c_fill,h_${Math.round(height/2)},w_${Math.round(width/2)},q_auto:best${rootFolder}${source}.jpg 1x, ${url}c_fill,h_${height},w_${width},q_auto:best${rootFolder}${source}.jpg 2x`"
			type="image/jpeg"
		/>
		<img v-if="type === 'png'"
			:src="`${url}c_fill,h_${height},w_${width},q_auto:best${rootFolder}${source}.png`"
			:alt="alt"
		/>
		<img v-else
			:src="`${url}c_fill,h_${height},w_${width},q_auto:best${rootFolder}${source}.jpg`"
			:alt="alt"
		/>
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
