import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  appId: import.meta.env.NUXT_PUBLIC_FIREBASE_APP_ID,
  apiKey: import.meta.env.NUXT_PUBLIC_FIREBASE_API_KEY,
  projectId: import.meta.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  storageBucket: import.meta.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
} as const;

export const firebaseApp = initializeApp(firebaseConfig);
