<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" md="4">
        <v-card class="cart pa-8" rounded="lg" elevation="24" dir="rtl">
          <v-list-item
            lines="one"
            :title="userProfile?.username"
            :subtitle="role"
            color="#E65100"
            prepend-icon="mdi-account-key"
          >
          </v-list-item>

          <v-list-item
            lines="one"
            :title="userProfile?.first_name + ' ' + userProfile?.last_name"
            color="#E65100"
            prepend-icon="mdi-account-circle"
          >
          </v-list-item>

          <div align="center" justify="center">
            <v-btn v-if="store.isAuthenticated" to="/login" color="error" @click="logout">
              <v-icon>mdi-logout</v-icon>
              خروج از حساب کاربری
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <Alert
      :msg="alertMsg"
      :activate="alertActivator"
      :timeout="alertTimeout"
      :color="alertColor"
    />

    <Alert
      :msg="alertMsg2"
      :activate="alertActivator2"
      :timeout="alertTimeout2"
      :color="alertColor2"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Childs
import Alert from "@/components/Alert.vue";
import { loginStore } from "@/stores/index";
import { breakPointsStore } from "@/stores/breakPoints";
// Life Cycles
onMounted(function () {
  getUserProfile();
});
// const APIUrl = "http://192.168.1.62:8000/";
const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";

const breakPointsStoreVar = breakPointsStore();

const device = ref(breakPointsStoreVar.device);

const store = loginStore();
function logout() {
  store.logout();
}

const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
const alertMsg2 = ref("");
const alertActivator2 = ref(false);
const alertTimeout2 = ref(2000);
const alertColor2 = ref("#E65100");

const userProfile = ref(null);
function getUserProfile() {
  axios.get(APIUrl + "api/account/user/").then((response) => {
    console.log("UUUUUUUUUser", response);
    userProfile.value = response.data;
  });
}
</script>
<style>
.cart {
  border: 1px solid rgb(206, 45, 45);
}
</style>
