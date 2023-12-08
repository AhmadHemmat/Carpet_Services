<template>
  <v-app-bar
    v-if="breakPointsStoreVar.device !== 'mobile'"
    height="60"
    color="#C51162"
    rounded="lg"
    app
  >
    <v-spacer></v-spacer>
    <v-btn v-if="store.isAuthenticated" to="/profile" color="white">
      <v-icon color="#FFFF00" size="large">mdi-account</v-icon>
      پروفایل
    </v-btn>
    <v-btn
      v-if="store.isAuthenticated && store.isStaff"
      to="/human-resource"
      color="white"
    >
      <v-icon color="#FFFF00" size="large">mdi-human-male</v-icon>
      منابع انسانی
    </v-btn>
    <v-btn v-if="store.isAuthenticated" to="/" color="white">
      <v-icon color="#FFFF00" size="large">mdi-view-dashboard</v-icon>
      پنل اصلی
    </v-btn>
    <v-btn v-if="!store.isAuthenticated" to="/login" color="white">
      <v-icon color="#FFFF00" size="large">mdi-login</v-icon>
      ورود
    </v-btn>
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>
  <v-bottom-navigation
    v-if="windowWidth < 500"
    :active="active"
    style="background-color: #c51162"
  >
    <v-btn v-if="store.isAuthenticated" to="/profile" color="white">
      <v-icon color="#FFFF00" size="large">mdi-account</v-icon>
      پروفایل
    </v-btn>
    <v-btn
      v-if="store.isAuthenticated && store.isStaff"
      to="/human-resource"
      color="white"
    >
      <v-icon color="#FFFF00" size="large">mdi-human-male</v-icon>
      منابع انسانی
    </v-btn>
    <v-btn v-if="store.isAuthenticated" to="/" color="white">
      <v-icon color="#FFFF00" size="large">mdi-view-dashboard</v-icon>
      پنل اصلی
    </v-btn>
    <v-btn v-if="!store.isAuthenticated" to="/login" color="white">
      <v-icon color="#FFFF00" size="large">mdi-login</v-icon>
      ورود
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import { ref } from "vue";
import { loginStore } from "@/stores/index";
import { breakPointsStore } from "@/stores/breakPoints";

const breakPointsStoreVar = breakPointsStore();
const device = ref(breakPointsStoreVar.device);
const store = loginStore();
const active = ref(true);
const windowWidth = ref(window.innerWidth);
</script>
