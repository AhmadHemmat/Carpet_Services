<template>
  <v-container align="center" justify="center">
    <DashboardForAdmin v-if="store.isStaff" />
    <DashboardForWorker v-else-if="store.isStaff === false" />
  </v-container>
  <Alert
    :msg="alertMsg"
    :activate="alertActivator"
    :timeout="alertTimeout"
    :color="alertColor"
  />
</template>

<script setup>
import { ref } from "vue";
import { loginStore } from "@/stores/index";

// Childs
import Alert from "@/components/Alert.vue";
import DashboardForWorker from "@/components/dashboard/DashboardForWorker.vue";
import DashboardForAdmin from "@/components/dashboard/DashboardForAdmin.vue";

const store = loginStore();
const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
</script>
