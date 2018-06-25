/*
 *   In this production mode, a service worker is registered to serve the Content
 *   from the local cache.
 *   This lets user to load the faster upon simulationus visits.
 *   Lets user to view the page insipte being offline.
 *   User can view the deployed updates on their n+1 visit to the page.
 *   This is because of previously cached resources.
 */

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  /*
   * [::1] -> IPv6 localhost address.
   * 127.0.0.1/8 -> localhost for IPv4
   */
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location);
    if (publicUrl.origin !== window.location.origin) {
      /*
       *  This service worker doesn't work if PUBLIC_URL is on different origin
       */
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // If the service is running on localhost, chceks if the serviceWorker is existing or not
        checkValidServiceWorker(swUrl);
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'The web application is cache-based service' +
            'worker.'
          );
        });
      } else {
        // If service worker doesnt exist it performs registration of serviceWorker
        registerValidSW(swUrl);
      }
    });
  }
}

function registerValidSW(swUrl) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              /*
               *   This is display that your page needs to be refreshed since
               *   few updations are being made.
               */
              console.log('New content is available; please refresh.');
            } else {
              console.log('Content is cached for offline use.');
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Service Worker Registration error:', error);
    });
}

/*
 *   checkValidServiceWorker -> This functions carries out the following operations
 *   To check if the service Worker can be found.
 *   Validate if service Worker is present and tries in retriving a JS file
 *   Service worker is not registered and not found
 *   Service worker is found and proceed as normal
 */

function checkValidServiceWorker(swUrl) {
  fetch(swUrl)
    .then(response => {
      if (
        response.status === 404 ||
        response.headers.get('content-type').indexOf('javascript') === -1
      ) {
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        'Internet Connectivity is not available. Running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
