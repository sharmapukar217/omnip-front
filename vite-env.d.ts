/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

declare global {
  interface ImportMetaEnv {
    DEV: boolean;
    SSR: boolean;
    PROD: boolean;
    mode: typeof process.env.NODE_ENV;

    /** directus api url */
    readonly NUXT_PUBLIC_DIRECTUS_URL: string;
    /** directus static token url */
    readonly NUXT_PUBLIC_STATIC_TOKEN: string;

    /** Google vision api key */
    readonly NUXT_PUBLIC_GOOGLE_VISION_KEY: string;

    /** ChatPdf api key */
    readonly NUXT_PUBLIC_CHAT_PDF_KEY: string;

    /** key for api to validate siret number */
    readonly NUXT_PUBLIC_SIRET_API_KEY: string;

    /** firebase config */
    NUXT_PUBLIC_FIREBASE_APP_ID: string;
    NUXT_PUBLIC_FIREBASE_API_KEY: string;
    NUXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string;

    /** firebase valid keys for web push notifications */
    NUXT_PUBLIC_VAPID_KEY: string;
    NUXT_PRIVATE_VAPID_KEY: string;

    /** keys for strpe */
    NUXT_PUBLIC_STRIPE_KEY: string;
    NUXT_PRIVATE_STRIPE_KEY: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }

  interface Window {
    /**
     * toggle vue query devtoos
     * only for developers :-)
     */
    queryDevtool: () => void;
  }

  namespace NodeJS {
    interface ProcessEnv extends ImportMetaEnv {}
  }
}

export {};
