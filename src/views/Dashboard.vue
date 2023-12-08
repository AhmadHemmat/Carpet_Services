<template>
  <v-container align="center" justify="center">
    <DashboardForAdmin v-if="userProfile?.is_staff" />
    <!-- <DashboardForWorker v-else-if="!userProfile?.is_staff" /> -->
  </v-container>
  <Alert
    :msg="alertMsg"
    :activate="alertActivator"
    :timeout="alertTimeout"
    :color="alertColor"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import { loginStore } from "@/stores/index";

// Childs
import Alert from "@/components/Alert.vue";
import DashboardForWorker from "@/components/dashboard/DashboardForWorker.vue";
import DashboardForAdmin from "@/components/dashboard/DashboardForAdmin.vue";
import axios from "axios"

const store = loginStore();
const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
const isStaff = ref(true);
const APIUrl = "https://carpet.iran.liara.run/";

const userProfile = ref(null);
async function getUserProfile() {
  await axios.get(APIUrl + "api/account/user/").then((response) => {
    console.log("UUUUUUUUUser", response);
    userProfile.value = response.data;
  });
}

onMounted(async () => {
  await getUserProfile()
});
</script>
