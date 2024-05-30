import voiceChefApi from "./utils/axios";

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

// type Config = {
//   onSuccess?: (registration: ServiceWorkerRegistration) => void;
//   onUpdate?: (registration: ServiceWorkerRegistration) => void;
// };

export function register(config) {
  if ('serviceWorker' in navigator) {
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${publicUrl}/service-worker.js`;

      if (isLocalhost) {
        checkValidServiceWorker(swUrl, config);

        navigator.serviceWorker.ready.then(() => {
          console.log(
            'This web app is being served cache-first by a service worker. To learn more, visit https://cra.link/PWA'
          );
        });
      } else {
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope);
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log(
                'New content is available and will be used when all tabs for this page are closed. See https://cra.link/PWA.'
              );

              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              console.log('Content is cached for offline use.');

              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
      return registration.pushManager.getSubscription().then(async (subscription) => {
        // if(subscription) {
        //   return subscription
        // } else {
          const response = await voiceChefApi.get('/notifications/vapid-public-key');

          console.log('response', response)

          const vapidPublicKey = response.data.publicKey

          console.log('vapidPublic', vapidPublicKey)

          const convertedVapidKey = vapidPublicKey

          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey,
          });
        // }
      })
    }).then((subscription) => {
      console.log('subscription', subscription)

      localStorage.setItem('subscription', JSON.stringify(subscription))
      sendSubscriptionToServer(subscription);
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}


function checkValidServiceWorker(swUrl, config) {
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' }
  })
    .then((response) => {
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

async function sendSubscriptionToServer(subscription) {
  console.log('sent subscription', subscription)

  // Send the subscription object to your server using a fetch request
  await voiceChefApi.post('notifications/subscribe', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: {subscription}
  })
    .then((response) => {
      if (!response) {
        throw new Error('Failed to send subscription to server');
      }
      console.log('Subscription sent to server successfully');
    })
    .catch(error => {
      console.error('Error sending subscription to server:', error);
    });
}