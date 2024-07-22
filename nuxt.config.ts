import { existsSync, readFileSync } from "fs";
import { appColors, appConfig } from "./app/lib/appConfig";
import { ACCESS_TOKEN_STORAGE_KEY, REFRESH_TOKEN_STORAGE_KEY } from "./app/lib/constants";

const NODE_ENV = process.env.NODE_ENV;
const IS_PRODUCTION = NODE_ENV === "production";
const ENABLE_PWA = process.env.ENABLE_PWA === "true";
const ENABLE_SSR = process.env.ENABLE_SSR === "true";
const ENABLE_HTTPS = process.env.ENABLE_HTTPS === "true";

console.info(`ssr      : ${!ENABLE_SSR}`);
console.info(`pwa      : ${!ENABLE_PWA}`);
console.info(`https    : ${ENABLE_HTTPS}`);
console.info(`node env : ${NODE_ENV}`);

const setupHTTPS = () => {
  const CERT_FILE = "./.cert/localhost.pem";
  const KEY_FILE = "./.cert/localhost-key.pem";

  if (!ENABLE_HTTPS) return undefined;
  if (!existsSync(CERT_FILE) || !existsSync(KEY_FILE)) return;

  return {
    key: readFileSync(KEY_FILE).toString(),
    cert: readFileSync(CERT_FILE).toString()
  };
};

export default defineNuxtConfig({
  ssr: ENABLE_SSR,
  components: false,
  devtools: { enabled: false },
  future: { compatibilityVersion: 4 },
  experimental: {
    defaults: { nuxtLink: { trailingSlash: "remove" } }
  },
  devServer: {
    host: "0.0.0.0",
    https: setupHTTPS()
  },
  compatibilityDate: "2024-04-03",
  vite: {
    envPrefix: "NUXT_PUBLIC_",
    esbuild: {
      drop: IS_PRODUCTION ? ["console", "debugger"] : undefined
    }
  },
  app: {
    head: {
      charset: "utf-8",
      viewport:
        "width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no"
    }
  },

  modules: [
    "@nuxt/fonts",
    "@nuxtjs/i18n",
    "@nuxt/eslint",
    "@vite-pwa/nuxt",
    "nuxt-typed-router",
    "nuxt-directus-next",
    "@nuxtjs/color-mode",
    "@nuxtjs/tailwindcss"
  ],

  colorMode: { classSuffix: "" },

  directus: {
    staticToken: process.env.NUXT_PUBLIC_STATIC_TOKEN,
    staticTokenServer: process.env.NUXT_PUBLIC_STATIC_TOKEN,
    authConfig: {
      cookieHttpOnly: false,
      cookieSecure: IS_PRODUCTION,
      authTokenCookieName: ACCESS_TOKEN_STORAGE_KEY,
      refreshTokenCookieName: REFRESH_TOKEN_STORAGE_KEY
    },
    moduleConfig: {
      devtools: true,
      autoRefresh: false
    }
  },

  pwa: {
    srcDir: ".",
    disable: !ENABLE_PWA,
    injectRegister: false,
    registerType: "prompt",
    strategies: "injectManifest",
    filename: "service-worker.ts",
    manifest: {
      id: appConfig.appId,
      name: appConfig.title,
      short_name: appConfig.title,
      theme_color: `hsl(${appColors.light.background})`
    },
    injectManifest: {
      additionalManifestEntries: ["/"]
    },
    devOptions: {
      type: "module",
      enabled: ENABLE_PWA,
      navigateFallback: "/",
      navigateFallbackAllowlist: [/^\/$/]
    },
    pwaAssets: {
      overrideManifestIcons: true,
      image: "../public/favicon.svg"
    }
  },

  i18n: {
    langDir: "locales",
    strategy: "no_prefix",
    detectBrowserLanguage: { useCookie: true },
    locales: [
      { code: "en", name: "English", iso: "en-US", file: "en.json", dir: "ltr" },
      { code: "fr", name: "Français", iso: "fr", file: "fr.json", dir: "ltr" }
    ]
  },

  tailwindcss: {
    quiet: true,
    viewer: false,
    cssPath: "app/assets/global.css"
  }
});
