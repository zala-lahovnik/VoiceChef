const CACHE_NAME = "cache-sample-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/offline.html",
  "/favicon.ico",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/icon-72x72.png",
  "/icon-128x128.png",
  "/icon-144x144.png",
  "/icon-192.png",
  "/icon-512x512.png",
  "/static/css/main.d27c5761.css", // Posodobite z dejanskim hashom
  "/static/js/453.01cb5c1c.chunk.js", // Posodobite z dejanskim hashom
  "/static/js/main.de974e35.js", // Posodobite z dejanskim hashom
];

self.addEventListener("install", (event) => {
  console.log("Service Worker: Installed");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache
        .addAll(urlsToCache)
        .then(() => {
          console.log("All files are cached");
        })
        .catch((error) => {
          console.error("Failed to cache", error);
          urlsToCache.forEach((url) => {
            fetch(url).catch((err) => {
              console.error("Failed to fetch:", url, err);
            });
          });
        });
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activated");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  //console.log("Fetch event for ", event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        //console.log("Found ", event.request.url, " in cache");
        return response;
      }
      //console.log("Network request for ", event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          // Check if the response is a redirect
          if (networkResponse.type === "opaqueredirect") {
            return Response.redirect(networkResponse.url);
          }

          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request.url, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          return caches.match("/offline.html");
        });
    })
  );
});

self.addEventListener("push", function (event) {
  //console.log("push event v /public");

  const payload = event.data.json();
  const title = payload.title;
  const options = {
    body: payload.body,
    icon: "./logo192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});
