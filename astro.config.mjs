// @ts-check
import { defineConfig, envField } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

import tailwind from "@astrojs/tailwind";

import expressiveCode from "astro-expressive-code";

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
    },

  integrations: [tailwind(), expressiveCode()]
});