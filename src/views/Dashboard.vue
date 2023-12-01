<template>
  <div class="d-flex flex-row-reverse bg-surface-variant">
    <Profile @company="(id) => (company = id)" @userRole="(role) => (userRole = role)" />
    <DashboardForCustomer v-if="userRole === 'مشتری'" />
    <DashboardForChef />
    <DashboardForAdmin v-if="userRole === 'مدیر'" :company="company" />
  </div>
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
import Profile from "@/components/dashboard/Profile.vue";
import DashboardForCustomer from "@/components/dashboard/DashboardForCustomer.vue";
import DashboardForChef from "@/components/dashboard/DashboardForChef.vue";
import DashboardForAdmin from "@/components/dashboard/DashboardForAdmin.vue";

const store = loginStore();
const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
const userRole = ref("");

const company = ref(null);
function getCompany(id) {
  company.value = id;
}
// Watchers

// Functions
// function getUserRole(role) {
//   userRole.value = role;
//   console.log(userRole.value);
// }
onMounted(() => {
  console.log(store.successLoginAlert);
  if (store.successLoginAlert) {
    console.log("?");
    alertActivator.value = true;
    alertMsg.value = "با موفقیت وارد شدید";
    alertColor.value = "success";
    store.successLoginAlert = false;
  } else {
    alertActivator.value = false;
  }
});
</script>
