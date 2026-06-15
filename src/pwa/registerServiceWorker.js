export function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  // Disable service worker in local development to avoid caching errors (Manifest Syntax Error)
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister();
      }
    });
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => caches.delete(key)));
    });
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch((error) => {
      console.warn("Service worker registration failed:", error);
    });
  });
}
