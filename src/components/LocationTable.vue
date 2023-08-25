<template>
  <div>
    <button class="delete-btn" @click="requestDelete">Delete Selected</button>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Location</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(location, index) in displayedLocations" :key="index">
          <td>
            <input type="checkbox" v-model="checkboxModel[index]" />
          </td>
          <td>{{ location }}</td>
        </tr>
      </tbody>
    </table>
    
    <div class="pagination-controls">
      <button @click="goToPreviousPage" :disabled="currentPage === 1">Previous</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="goToNextPage" :disabled="currentPage === totalPages">Next</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

export default {
  props: {
    locations: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { emit }) {
    const checkboxModel = ref({});
    const currentPage = ref(1);
    const recordsPerPage = ref(10);

    const displayedLocations = computed(() => {
      const start = (currentPage.value - 1) * recordsPerPage.value;
      const end = start + recordsPerPage.value;
      return props.locations.slice(start, end);
    });

    watch(() => props.locations, () => {
      checkboxModel.value = {};
    });

    const totalPages = computed(() => {
      return Math.ceil(props.locations.length / recordsPerPage.value);
    });

    const goToNextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const goToPreviousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const requestDelete = () => {
      const selectedIndexes = Object.keys(checkboxModel.value)
        .filter((key) => checkboxModel.value[key])
        .map((key) => (currentPage.value - 1) * recordsPerPage.value + Number(key));
      emit("delete-selected", selectedIndexes);
      checkboxModel.value = {};
    };

    return {
      checkboxModel,
      displayedLocations,
      currentPage,
      totalPages,
      goToNextPage,
      goToPreviousPage,
      requestDelete,
    };
  },
};
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
button.delete-btn {
  margin-bottom: 1rem;
  background-color: #F44336;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
}
button.delete-btn:hover {
  background-color: #D32F2F;
}
.pagination-controls {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
