/// <reference types="@capacitor-firebase/messaging" />
/// <reference types="@capacitor-community/privacy-screen" />

import type { CapacitorConfig } from "@capacitor/cli";
import { appConfig } from "./app/lib/appConfig";

const config: CapacitorConfig = {
  webDir: "dist",
  appId: appConfig.appId,
  appName: appConfig.title,
  plugins: {
    PrivacyScreen: {
      enable: true
    },
    CapacitorHttp: {
      enabled: true
    },
    CapacitorCookies: {
      enabled: true
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  },

  server: {
    hostname: "omnip.com",

    // cleartext: true,
    // url: "http://192.168.1.69:3000",

    iosScheme: "https",
    androidScheme: "https"
  },

  ios: { path: "native/ios" },
  android: { path: "native/android" }
};

export default config;
