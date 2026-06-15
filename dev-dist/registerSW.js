if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("/test/dev-sw.js?dev-sw", {
    scope: "/test/",
    type: "classic",
  });
