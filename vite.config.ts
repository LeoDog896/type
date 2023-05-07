import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const config: UserConfig = {
	plugins: [sveltekit(), SvelteKitPWA({
		registerType: "autoUpdate",
		base: "/type",
		manifest: {
			short_name: "Type",
			name: "Type",
			start_url: "/type",
			display: "standalone",
			theme_color: "#ffffff",
			background_color: "#ffffff",
		},
	})]
};

export default config;
