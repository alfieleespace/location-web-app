<template>
  <div class="input-container">
    <input
      v-model="locationName"
      @input="onInputChange"
      @blur="onInputBlur"
      @keyup.enter="search"
      placeholder="Enter location"
      class="location-input"
    />
    <div class="autocomplete-suggestions" v-if="showSuggestions">
      <div
        v-for="(suggestion, index) in suggestions"
        :key="index"
        @click="selectSuggestion(suggestion)"
      >
        {{ suggestion.description }}
      </div>
    </div>
    <button @click="search">Search</button>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import loadGoogleMapsApi from "../googleMapsLoader.js";

/* global google */

export default {
  setup(_, { emit }) {
    const locationName = ref("");
    const showSuggestions = ref(false);
    const suggestions = ref([]);

    const search = () => {
      emit("search-location", { locationName: locationName.value });
      showSuggestions.value = false;
    };

    const onInputChange = async () => {
      if (locationName.value === "") {
        showSuggestions.value = false;
        suggestions.value = [];
        return;
      }

      if (typeof google === "undefined") {
        await loadGoogleMapsApi();
        fetchAutocompleteSuggestions();
      } else {
        fetchAutocompleteSuggestions();
      }
    };

    const fetchAutocompleteSuggestions = () => {
      const autoCompleteService = new google.maps.places.AutocompleteService();
      autoCompleteService.getPlacePredictions(
        { input: locationName.value },
        (predictions) => {
          if (predictions) {
            suggestions.value = predictions;
            showSuggestions.value = true;
          }
        }
      );
    };

    const onInputBlur = () => {
      setTimeout(() => {
        showSuggestions.value = false;
      }, 500);
    };

    const selectSuggestion = (suggestion) => {
      locationName.value = suggestion.description;
      showSuggestions.value = false;
    };

    onMounted(() => {
      document.addEventListener("click", (e) => {
        if (
          !e.target.closest(".autocomplete-suggestions") &&
          !e.target.closest(".location-input")
        ) {
          showSuggestions.value = false;
        }
      });
    });

    return {
      locationName,
      search,
      onInputChange,
      onInputBlur,
      selectSuggestion,
      showSuggestions,
      suggestions,
    };
  },
};
</script>

<style scoped>
div {
  margin-bottom: 20px;
}

.input-container {
  position: relative;
}

.input-container input {
  width: 70%;
  padding: 10px;
  border: 1px solid #ccc;
}

.autocomplete-suggestions {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  max-height: 150px;
  overflow-y: auto;
  width: 82.5%;
  top: 100%;
  left: 8.5%;
  z-index: 2;
}

.autocomplete-suggestions div {
  padding: 5px;
  cursor: pointer;
}

button {
  background-color: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
}

button:hover {
  background-color: #388E3C;
}
</style>
