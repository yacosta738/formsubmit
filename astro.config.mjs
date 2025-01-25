// @ts-check
import { defineConfig, envField } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	output: "server",
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
	env: {
		schema: {
			RESEND_API_KEY: envField.string({ context: "server", access: "secret" }),
			SUPABASE_URL: envField.string({ context: "server", access: "secret" }),
			SUPABASE_KEY: envField.string({ context: "server", access: "secret" }),

		}
	}
});
