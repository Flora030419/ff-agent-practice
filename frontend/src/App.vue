<template>
  <div id="app">
    <Login v-if="!isLoggedIn" />
    <Dashboard v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAuthStore } from './stores/auth.js';
import Login from './pages/Login.vue';
import Dashboard from './pages/Dashboard.vue';

const authStore = useAuthStore();
const isLoggedIn = computed(() => authStore.isLoggedIn);
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
}

#app {
  width: 100%;
  min-height: 100vh;
}
</style>
