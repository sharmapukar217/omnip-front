/// <reference lib="WebWorker" />
/// <reference types="vite/client" />

import { firebaseApp } from "@/lib/firebase";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
import type { PrecacheEntry } from "workbox-precaching";
import {
  cleanupOutdatedCaches,
  createHandlerBoundToURL,
  precacheAndRoute
} from "workbox-precaching";
import { NavigationRoute, registerRoute } from "workbox-routing";

/** ServiceWorker global */
declare let self: ServiceWorkerGlobalScope & { __WB_MANIFEST: PrecacheEntry[] };

/** on message */
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

if (import.meta.env.PROD) {
  cleanupOutdatedCaches();
  precacheAndRoute(self.__WB_MANIFEST);
  registerRoute(new NavigationRoute(createHandlerBoundToURL("/"), {}));
}

onBackgroundMessage(getMessaging(firebaseApp), (payload: any) => {
  self.registration.showNotification(payload.notification.title, {
    data: payload.data,
    body: payload.notification.body,
    icon: payload.notification.image,
    tag: payload.notification.tag || payload.notification.title
  });
  // return self.clients
  //   .matchAll({ type: "window", includeUncontrolled: true })
  //   .then((clients) => clients.forEach((client) => client.postMessage(payload)));
});
