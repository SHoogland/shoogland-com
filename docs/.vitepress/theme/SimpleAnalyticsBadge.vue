<template>
	<footer class="sa-badge">
		<a :href="`https://dashboard.simpleanalytics.com/${hostname}?utm_source=${hostname}&utm_content=badge`"
			referrerpolicy="origin" target="_blank" rel="noopener">
			<img :src="`https://simpleanalyticsbadges.com/${hostname}?mode=${isDark ? 'dark' : 'light'}`"
				alt="Simple Analytics" loading="lazy" referrerpolicy="no-referrer" crossorigin="anonymous" />
		</a>
	</footer>
</template>

<script setup>
import { useData } from 'vitepress'

const { isDark } = useData()
const hostname = 'www.shoogland.com'
</script>

<style scoped>
.sa-badge {
	display: flex;
	justify-content: center;
	padding: 24px;
}
</style>
