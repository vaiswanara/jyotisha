// బ్రౌజర్‌కి మెసేజ్ వచ్చినప్పుడు దాన్ని నోటిఫికేషన్ లాగా చూపించడం
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "./logo.png", // మీ యాప్ లోగో
      badge: "./logo.png",
      vibrate: [100, 50, 100],
      data: { url: data.url || self.registration.scope },
    };

    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// యూజర్ ఆ నోటిఫికేషన్ మీద క్లిక్ చేసినప్పుడు యాప్ ఓపెన్ అవ్వడం లేదా యాప్ ఓపెన్ లో ఉంటే దానికి సందేశం పంపడం
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const urlToOpen = new URL(event.notification.data.url, self.location.origin).href;
  const cleanAppUrl = self.registration.scope;

  const promiseChain = clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  }).then((windowClients) => {
    let matchingClient = null;

    // యాప్ విండోie ఇప్పటికే ఓపెన్ అయి ఉందో లేదో చూస్తాము
    for (let i = 0; i < windowClients.length; i++) {
      matchingClient = windowClients[i];
      break; // మొదటి విండో క్లయింట్ ని తీసుకుంటాము
    }

    if (matchingClient) {
      // యాప్ విండోను ఫోకస్ చేస్తాము
      const focusPromise = matchingClient.focus();

      // Broadcast Channel ద్వారా మెసేజ్ పంపుతాము
      const channel = new BroadcastChannel("push-notification-channel");
      channel.postMessage({
        type: "PUSH_NOTIFICATION_CLICK",
        url: urlToOpen,
      });
      channel.close();

      return focusPromise;
    } else {
      // విండో ఓపెన్ లేకపోతే (యాప్ క్లోజ్ అయి ఉంటే):
      // iOS లో క్వెరీ పారామీటర్లు ఉన్న URL ని పిలిస్తే Safari బ్రౌజర్ లో ఓపెన్ అవుతుంది. 
      // కాబట్టి క్లీన్ URL ని పిలిచి, పారామీటర్లను Cache Storage లో స్టోర్ చేస్తాము.
      const cacheData = {
        url: urlToOpen,
        timestamp: Date.now()
      };
      
      const saveToCachePromise = caches.open("pending-push-clicks").then((cache) => {
        return cache.put("/latest-click", new Response(JSON.stringify(cacheData)));
      });

      return saveToCachePromise.then(() => {
        return clients.openWindow(cleanAppUrl);
      });
    }
  });

  event.waitUntil(promiseChain);
});
