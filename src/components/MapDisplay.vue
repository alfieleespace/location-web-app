<template>
  <div id="map"></div>
</template>

<script>
import { onMounted, ref, watch } from "vue";
import loadGoogleMapsApi from "../googleMapsLoader.js";

/* global google */

export default {
  props: {
    markers: Array,
    mapCenter: Object,
  },
  setup(props) {
    const googleMap = ref(null);
    const mapMarkers = ref([]);

    const clearMarkers = () => {
      mapMarkers.value.forEach((marker) => {
        marker.setMap(null);
      });
      mapMarkers.value.length = 0;
    };

    const updateMap = () => {
      console.log("Updating map with new markers...");
      if (googleMap.value) {
        clearMarkers();

        props.markers.forEach((markerData) => {
          const markerPosition = markerData.position;
          if (markerPosition && markerPosition.lat && markerPosition.lng) {
            const marker = new google.maps.Marker({
              position: markerPosition,
              map: googleMap.value,
            });
            mapMarkers.value.push(marker);
          }
        });

        googleMap.value.setCenter(props.mapCenter);
        console.log("Markers after updating:", mapMarkers.value);
      }
    };

    const initializeMap = () => {
      const mapOptions = {
        center: props.mapCenter,
        zoom: 7,
      };

      googleMap.value = new google.maps.Map(
        document.getElementById("map"),
        mapOptions
      );
      updateMap();
    };

    watch(() => props.markers, updateMap, { immediate: true });

    watch(() => props.mapCenter, updateMap);

    onMounted(() => {
      loadGoogleMapsApi(initializeMap);
    });

    return {
      initializeMap,
      clearMarkers,
      updateMap,
    };
  },
};
</script>

<style scoped>
#map {
  height: 300px;
  margin: 1rem 0;
  border: 1px solid #ccc;
}
</style>
