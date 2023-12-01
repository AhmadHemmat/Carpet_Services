<template>
  <v-app-bar
    v-if="breakPointsStoreVar.device !== 'mobile'"
    height="60"
    dir="rtl"
    color="light-blue-lighten-5"
    rounded="lg"
    app
  >
    <v-btn v-if="store.isAuthenticated" to="/dashboard" color="orange-darken-4">
      <v-icon size="large">mdi-account-circle</v-icon>
      پنل اصلی
    </v-btn>
    <v-btn v-if="!store.isAuthenticated" to="/register" color="orange-darken-4">
      <v-icon size="large">mdi-account-plus</v-icon>
      ایجاد حساب
    </v-btn>
    <v-btn v-if="!store.isAuthenticated" to="/login" color="orange-darken-4">
      <v-icon size="large">mdi-login</v-icon>
      ورود
    </v-btn>
    <v-spacer></v-spacer>
    <router-link to="/">
      <v-img
        :src="logo"
        style="position: absolute; left: 0; top: 0; width: 100px; height: 120px"
      ></v-img>
    </router-link>
  </v-app-bar>
  <v-app-bar v-if="breakPointsStoreVar.device === 'mobile'" color="#e1f5fe" app dir="rtl">
    <v-row class="pa-6" align="center" justify="center"> </v-row>
  </v-app-bar>
  <v-main>
    <router-view />
  </v-main>
  <v-bottom-navigation
    v-if="windowWidth < 500"
    :active="active"
    style="background-color: #e1f5fe"
  >
    <v-btn v-if="store.isAuthenticated" to="/dashboard" color="success">
      <v-icon color="orange-darken-4" size="large">mdi-account-circle</v-icon>
      پنل اصلی
    </v-btn>

    <v-btn v-if="!store.isAuthenticated" to="/register" color="success">
      <v-icon color="orange-darken-4" size="large">mdi-account-plus</v-icon>
      ایجاد حساب
    </v-btn>
    <v-btn v-if="!store.isAuthenticated" to="/login" color="success">
      <v-icon color="orange-darken-4" size="large">mdi-login</v-icon>
      ورود
    </v-btn>

    <v-btn to="/" color="success">
      <v-icon color="orange-darken-4" size="large">mdi-account</v-icon>
      مشاهده پروفایل
    </v-btn>
  </v-bottom-navigation>
</template>

<script setup>
import logo from "@/assets/anadanan2.png";
import { ref } from "vue";
import { loginStore } from "@/stores/index";
import { cartStore } from "@/stores/cart";
import { breakPointsStore } from "@/stores/breakPoints";

const breakPointsStoreVar = breakPointsStore();

const device = ref(breakPointsStoreVar.device);
const store = loginStore();
const cartStoreVar = cartStore();

const active = ref(true);
// const logo = ref('@/assets/profile.png')
let windowWidth = ref(window.innerWidth);
const buyBox = ref(false);
const homeAddress = ref(false);

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
