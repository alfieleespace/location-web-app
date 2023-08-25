export const GOOGLE_MAPS_API_KEY = "MY_API_KEY";

let isLoaded = false;
let loadingQueue = [];

const loadGoogleMapsApi = (callback) => {
  if (isLoaded) {
    callback();
    return;
  }

  loadingQueue.push(callback);

  if (loadingQueue.length > 1) return;

  const script = document.createElement("script");
  script.src =
  `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=onGoogleMapsLoaded`;
  document.head.appendChild(script);

  window.onGoogleMapsLoaded = () => {
    isLoaded = true;
    while (loadingQueue.length) {
      loadingQueue.pop()();
    }
  };
};

export default loadGoogleMapsApi;
