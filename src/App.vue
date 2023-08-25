<template>
  <div id="app">
    <header>
      <h1>Location App</h1>
    </header>
    <main>
      <current-location-button @get-current-location="getCurrentLocation" />
      <location-search-box @search-location="searchLocation" />
      <p v-if="timezone">Timezone: {{ timezone }}</p>
      <p v-if="localTime">Local Time: {{ localTime }}</p>
      <map-display
        :markers="markers"
        :mapCenter="mapCenter"
        :key="markers.length"
      />
      <location-table
        :locations="locations"
        @delete-selected="deleteSelected"
      />
    </main>
  </div>
</template>

<script>
import { ref } from "vue";
import CurrentLocationButton from "./components/CurrentLocationButton.vue";
import LocationSearchBox from "./components/LocationSearchBox.vue";
import MapDisplay from "./components/MapDisplay.vue";
import LocationTable from "./components/LocationTable.vue";
import { GOOGLE_MAPS_API_KEY } from "./googleMapsLoader.js";

export default {
  components: {
    CurrentLocationButton,
    LocationSearchBox,
    MapDisplay,
    LocationTable,
  },
  setup() {
    const markers = ref([]);
    const locations = ref([]);
    const mapCenter = ref({ lat: 0, lng: 0 });
    const timezone = ref("");
    const localTime = ref("");

    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition(async (position) => {
        console.log(position);
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };

        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );

          if (response.ok) {
            console.log(response);
            const data = await response.json();
            if (data.status === "OK" && data.results.length > 0) {
              const result = data.results[0];
              const fullAddress = result.formatted_address;
              const locationName = `${fullAddress} (current location)`;
              locations.value.push(locationName);
              addMarker(location);
              mapCenter.value = location;
            } else {
              throw new Error("Location not found.");
            }
          } else {
            throw new Error("Failed to fetch location data.");
          }
        } catch (error) {
          console.error("Error getting location details:", error);
        }
      });
    };

    const addMarker = (location) => {
      markers.value.push({ position: location });
    };

    const searchLocation = async ({ locationName }) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            locationName
          )}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Geocoding request failed.");
        }

        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
          const result = data.results[0];
          const latitude = result.geometry.location.lat;
          const longitude = result.geometry.location.lng;
          const location = { lat: latitude, lng: longitude };

          addMarker(location);

          mapCenter.value = location;

          locations.value.push(locationName);
          getTimezoneAndLocalTime(latitude, longitude);
        } else {
          throw new Error("Location not found.");
        }
      } catch (error) {
        console.error("Error searching for location:", error);
      }
    };

    const deleteSelected = (selectedIndexes) => {
      selectedIndexes
        .sort((a, b) => b - a)
        .forEach((index) => {
          markers.value.splice(index, 1);
          locations.value.splice(index, 1);
        });
    };

    const getTimezoneAndLocalTime = async (lat, lng) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lng}&timestamp=${Math.floor(
            Date.now() / 1000
          )}&key=${GOOGLE_MAPS_API_KEY}`
        );

        if (response.ok) {
          const data = await response.json();
          timezone.value = data.timeZoneId;
          localTime.value = new Date().toLocaleString("en-US", {
            timeZone: data.timeZoneId,
            hour12: true,
          });
        } else {
          throw new Error("Failed to fetch timezone data.");
        }
      } catch (error) {
        console.error("Error getting timezone details:", error);
      }
    };

    return {
      markers,
      locations,
      mapCenter,
      timezone,
      localTime,
      getCurrentLocation,
      searchLocation,
      deleteSelected,
    };
  },
};
</script>

<style scoped>
#app {
  text-align: center;
}

header {
  background-color: #333;
  color: white;
  text-align: center;
  padding: 1rem;
}

main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
