<template>
  <v-app-bar
    v-if="breakPointsStoreVar.device !== 'mobile'"
    height="60"
    dir="rtl"
    color="#B388FF"
    rounded="lg"
    app
  >
    <v-btn v-if="store.isAuthenticated" to="/dashboard" color="white">
      <v-icon color="#FFFF00" size="large">mdi-view-dashboard</v-icon>
      پنل اصلی
    </v-btn>

    <!-- <v-btn v-if="!store.isAuthenticated" to="/register" color="white">
    <v-icon color="#FFFF00" size="large">mdi-account-plus</v-icon>
    ایجاد حساب
  </v-btn> -->
    <v-btn v-if="!store.isAuthenticated" to="/login" color="white">
      <v-icon color="#FFFF00" size="large">mdi-login</v-icon>
      ورود
    </v-btn>

    <v-btn v-if="store.isAuthenticated" to="/profile" color="white">
      <v-icon color="#FFFF00" size="large">mdi-account</v-icon>
      پروفایل
    </v-btn>
  </v-app-bar>
  <v-app-bar v-if="breakPointsStoreVar.device === 'mobile'" color="#B388FF" app dir="rtl">
    <v-row class="pa-6" align="center" justify="center"> </v-row>
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>
  <v-bottom-navigation
    v-if="windowWidth < 500"
    :active="active"
    style="background-color: #b388ff"
  >
    <v-btn v-if="store.isAuthenticated" to="/dashboard" color="white">
      <v-icon color="#FFFF00" size="large">mdi-view-dashboard</v-icon>
      پنل اصلی
    </v-btn>

    <!-- <v-btn v-if="!store.isAuthenticated" to="/register" color="white">
      <v-icon color="#FFFF00" size="large">mdi-account-plus</v-icon>
      ایجاد حساب
    </v-btn> -->
    <v-btn v-if="!store.isAuthenticated" to="/login" color="white">
      <v-icon color="#FFFF00" size="large">mdi-login</v-icon>
      ورود
    </v-btn>

    <v-btn v-if="store.isAuthenticated" to="/profile" color="white">
      <v-icon color="#FFFF00" size="large">mdi-account</v-icon>
      پروفایل
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
// const logo = ref('@/assets/profile.png')
let windowWidth = ref(window.innerWidth);

function logout() {
  store.logout();
}
</script>

<style>
.footer {
  bottom: 0;
  position: sticky;
  height: auto;
}
</style>
