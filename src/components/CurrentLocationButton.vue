<template>
  <button @click="onGetCurrentLocationClick">Get Current Location</button>
</template>

<script>
export default {
  methods: {
    onGetCurrentLocationClick() {
      this.$emit("get-current-location");
    },
  },
};
</script>

<style scoped>
button {
  background-color: #1976D2;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  margin-bottom: 20px;
}

button:hover {
  background-color: #1565C0;
}
</style>
