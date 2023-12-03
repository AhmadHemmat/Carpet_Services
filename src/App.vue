<script setup>
import { ref, onMounted } from "vue";
import { loginStore } from "@/stores/index";
import { breakPointsStore } from "@/stores/breakPoints";

import { RouterView } from "vue-router";
import DefaultLayout from "./layouts/DefaultLayout.vue";

const store = { loginStore: loginStore(), breakPointsStore: breakPointsStore() };
onMounted(() => {
  store.loginStore.onStart();
  store.breakPointsStore.deviceDetector();
});

const icons = ref(["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"]);
</script>

<template>
  <v-app id="app">
    <DefaultLayout></DefaultLayout>
  </v-app>
</template>
