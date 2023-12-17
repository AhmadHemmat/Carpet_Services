<template>
  <v-overlay :model-value="loader" class="align-center justify-center" persistent>
    <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
  </v-overlay>
  <v-app-bar v-if="device === 'mobile'" color="#C51162" app dir="rtl">
    <v-btn stacked>
      <v-badge v-if="openTransfer" color="warning" dot>
        <v-icon
          icon="mdi-comment-question-outline"
          color="#FFFF00"
          @click="continueOpenTaskDialog = true"
        ></v-icon>
      </v-badge>
      <v-icon v-else icon="mdi-comment-check" color="white"></v-icon>
      <span v-if="openTransfer"> انتقال ناتمام </span>
      <span v-else> خوش آمدید </span>
    </v-btn>
  </v-app-bar>
  <v-col cols="12" xs="12" sm="12" md="8" lg="8">
    <v-card rounded="lg" elevation="12">
      <v-card class="cart" :style="{ height: windowHeight + 'px', overflow: 'auto' }">
        <v-container>
          <v-row dense align="center" justify="center">
            <v-col v-for="(obj, i) in variants" :key="i" cols="12" md="6">
              <v-card
                class="mx-auto pb-2"
                align="center"
                justify="center"
                width="100%"
                height="105"
                :variant="obj.variant"
                dir="rtl"
                style="border: 1px solid #3200e6"
              >
                <v-card-item>
                  <div class="mb-1">
                    <v-icon :color="obj.color" size="x-large">{{ obj.icon }}</v-icon>
                    <br />
                    <v-btn class="mb-2" :color="obj.color" @click="openModal(obj)">
                      {{ obj.type }}
                    </v-btn>
                  </div>
                </v-card-item>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-card>
  </v-col>

  <v-dialog
    v-model="selectOperatorDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="selectOperatorDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span>
            مرحله ۱ خروج قالی
            <br />
            انتخاب سرویس کار
          </span>
        </v-card>
        <div class="text-center my-4">
          <v-row align="center" justify="center">
            <v-col>
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#76FF03"
                variant="tonal"
                :disabled="!selectedOperator"
                @click="getServicesOfSelectedServiceProvider(false)"
              >
                بعدی
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12">
            <div class="text-center">انتخاب سرویس کار</div>

            <v-table>
              <thead>
                <tr>
                  <th class="text-center">نام</th>
                  <th class="text-center">نام خانوادگی</th>
                  <th class="text-center">انتخاب</th>
                </tr>
              </thead>
            </v-table>
          </v-col>
          <v-col cols="12">
            <v-card class="cart mx-2" :style="{ height: 300 + 'px', overflow: 'auto' }">
              <v-table>
                <tbody>
                  <tr v-for="(item, i) in serviceProviders" :key="i" class="text-center">
                    <td>
                      <span>{{ item?.first_name ? item?.first_name : null }}</span>
                    </td>
                    <td>
                      <span>{{ item?.last_name ? item?.last_name : null }}</span>
                    </td>
                    <td>
                      <v-radio-group v-model="selectedOperator" column>
                        <v-radio label="انتخاب" color="indigo" :value="item"></v-radio>
                      </v-radio-group>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-responsive>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="selectServicesDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="selectServicesDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span>
            مرحله ۲ خروج قالی
            <br />
            انتخاب سرویس ها
          </span>
        </v-card>
        <div class="text-center my-4">
          <v-row align="center" justify="center">
            <v-col cols="6">
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#76FF03"
                variant="tonal"
                :disabled="selectedServices.length === 0"
                @click="stepperNext"
              >
                بعدی
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#FF1744"
                variant="tonal"
                @click="stepperPrevious"
              >
                قبلی
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12">
            <div class="text-center">انتخاب سرویس ها</div>

            <v-table>
              <thead>
                <tr>
                  <th class="text-center">سرویس</th>
                  <th class="text-center">انتخاب</th>
                </tr>
              </thead>
            </v-table>
          </v-col>
          <v-col cols="12">
            <v-card class="cart mx-2" :style="{ height: 300 + 'px', overflow: 'auto' }">
              <v-table>
                <tbody>
                  <tr v-for="(item, i) in services" :key="i" class="text-center">
                    <td>
                      <span>{{ item?.title ? item?.title : null }}</span>
                    </td>
                    <td>
                      <v-checkbox
                        v-model="selectedServices"
                        label="انتخاب"
                        :value="item.id"
                      ></v-checkbox>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-responsive>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="selectCarpetDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="selectCarpetDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>
        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span>
            مرحله ۳ خروج قالی
            <br />
            اسکن قالی
          </span>
        </v-card>
        <div class="text-center my-4">
          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#76FF03"
                variant="tonal"
                :disabled="!selectedCarpet"
                @click="sendTransfer"
              >
                بعدی
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-responsive class="mx-auto" max-width="344">
          <v-text-field
            v-model="selectedCarpet"
            label="اسکن قالی"
            hide-details="auto"
            autofocus
          ></v-text-field>
        </v-responsive>
        <div class="text-center mt-16">
          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-btn
                class="flex-grow-1"
                height="48"
                color="#FFFF00"
                variant="tonal"
                width="100%"
                @click="updateIsFinishedTransfer"
              >
                ثبت نهایی
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-responsive>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="continueOpenTaskDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="continueOpenTaskDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>
        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span> شما یک انتقال قالی ناتمام دارید </span>
        </v-card>
        <div class="text-center my-4">
          <v-row align="center" justify="center">
            <v-col cols="6">
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                variant="tonal"
                @click="continueOpenTransfer"
              >
                ادامه
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-responsive>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="inputCarpetFromFactoryDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="inputCarpetFromFactoryDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>
        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span>
            {{ dialogTitle }}
            <br />
            اسکن قالی
          </span>
        </v-card>
        <div class="text-center my-4">
          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#76FF03"
                variant="tonal"
                :disabled="!selectedCarpet"
                @click="carpetTransfer()"
              >
                بعدی
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-responsive class="mx-auto" max-width="344">
          <v-text-field
            v-model="selectedCarpet"
            label="اسکن قالی"
            hide-details="auto"
            autofocus
            rounded
          ></v-text-field>
        </v-responsive>
      </v-responsive>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="inputCarpetFromServiceDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="inputCarpetFromServiceDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>
        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span>
            {{ dialogTitle }}
            <br />
            اسکن قالی
          </span>
        </v-card>
        <div class="text-center my-4">
          <v-row align="center" justify="center">
            <v-col cols="12">
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#76FF03"
                variant="tonal"
                :disabled="!selectedCarpet"
                @click="carpetTransfer2()"
              >
                بعدی
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-responsive class="mx-auto" max-width="344">
          <v-text-field
            v-model="selectedCarpet"
            label="اسکن قالی"
            hide-details="auto"
            autofocus
            rounded
          ></v-text-field>
        </v-responsive>
      </v-responsive>
    </v-card>
  </v-dialog>
  <v-dialog
    v-model="inputSelectOperatorDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="inputSelectOperatorDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span>
            مرحله ۱ ورود قالی
            <br />
            انتخاب سرویس کار
          </span>
        </v-card>
        <div class="text-center my-4">
          <v-row align="center" justify="center">
            <v-col>
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#76FF03"
                variant="tonal"
                :disabled="!selectedOperator"
                @click="getServicesOfSelectedServiceProvider(true)"
              >
                بعدی
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12">
            <div class="text-center">انتخاب سرویس کار</div>

            <v-table>
              <thead>
                <tr>
                  <th class="text-center">نام</th>
                  <th class="text-center">نام خانوادگی</th>
                  <th class="text-center">انتخاب</th>
                </tr>
              </thead>
            </v-table>
          </v-col>
          <v-col cols="12">
            <v-card class="cart mx-2" :style="{ height: 300 + 'px', overflow: 'auto' }">
              <v-table>
                <tbody>
                  <tr v-for="(item, i) in serviceProviders" :key="i" class="text-center">
                    <td>
                      <span>{{ item?.first_name ? item?.first_name : null }}</span>
                    </td>
                    <td>
                      <span>{{ item?.last_name ? item?.last_name : null }}</span>
                    </td>
                    <td>
                      <v-radio-group v-model="selectedOperator" column>
                        <v-radio label="انتخاب" color="indigo" :value="item"></v-radio>
                      </v-radio-group>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-responsive>
    </v-card>
  </v-dialog>

  <v-dialog
    v-model="inputSelectServicesDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="inputSelectServicesDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span>
            مرحله ۲ ورود قالی
            <br />
            انتخاب سرویس ها
          </span>
        </v-card>
        <div class="text-center my-4">
          <v-row align="center" justify="center">
            <v-col cols="6">
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#76FF03"
                variant="tonal"
                :disabled="selectedServices.length === 0"
                @click="stepperNext2"
              >
                بعدی
              </v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                color="#FF1744"
                variant="tonal"
                @click="stepperPrevious2"
              >
                قبلی
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-row>
          <v-col cols="12">
            <div class="text-center">انتخاب سرویس ها</div>

            <v-table>
              <thead>
                <tr>
                  <th class="text-center">سرویس</th>
                  <th class="text-center">انتخاب</th>
                </tr>
              </thead>
            </v-table>
          </v-col>
          <v-col cols="12">
            <v-card class="cart mx-2" :style="{ height: 300 + 'px', overflow: 'auto' }">
              <v-table>
                <tbody>
                  <tr v-for="(item, i) in services" :key="i" class="text-center">
                    <td>
                      <span>{{ item?.title ? item?.title : null }}</span>
                    </td>
                    <td>
                      <v-checkbox
                        v-model="selectedServices"
                        label="انتخاب"
                        :value="item.id"
                      ></v-checkbox>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
      </v-responsive>
    </v-card>
  </v-dialog>
  <Alert
    :msg="alertMsg"
    :activate="alertActivator"
    :timeout="alertTimeout"
    :color="alertColor"
  />
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";
import Alert from "@/components/Alert.vue";

onMounted(async () => {
  getServiceProviders();
  getCarpetList();
  checkOpenTask();
  getUserProfile();
  getStatuses();
  await getOpenTransfer();
});

const APIUrl = "http://192.168.1.62:8000/";
// const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";

const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
const store = breakPointsStore();
const device = ref(store.device);
const variants = [
  {
    type: "ورود قالی از کارخانه",
    color: "success",
    variant: "elevated",
    icon: "mdi-clipboard-arrow-down",
  },
  {
    type: "خروج قالی به کارخانه",
    color: "error",
    variant: "elevated",
    icon: "mdi-file-export",
  },
  {
    type: "ورود قالی از سرویس",
    color: "success",
    variant: "elevated",
    icon: "mdi-clipboard-arrow-down",
  },
  {
    type: "خروج قالی به سرویس",
    color: "error",
    variant: "elevated",
    icon: "mdi-file-export",
  },
];
const selectOperatorDialog = ref(false);
const selectCarpetDialog = ref(false);
const selectServicesDialog = ref(false);
const openTransfer = ref(false);
const selectedCarpet = ref(null);
const inputCarpetFromFactoryDialog = ref(false);
const inputCarpetFromServiceDialog = ref(false);
const status = ref(null);
const dialogTitle = ref("");
const outputServiceStatus = ref(null);
const inputFactoryStatus = ref(null);
const outputFactoryStatus = ref(null);
const inputServiceStatus = ref(null);

async function getStatuses() {
  await axios.get(APIUrl + "status/all-status-list/").then((response) => {
    for (const s of response.data) {
      if (s.title === "ورود از کارخانه") {
        inputFactoryStatus.value = s.id;
      } else if (s.title === "خروج به سرویس") {
        outputServiceStatus.value = s.id;
      } else if (s.title === "خروج به کارخانه") {
        outputFactoryStatus.value = s.id;
      } else if (s.title === "ورود از سرویس") {
        inputServiceStatus.value = s.id;
      }
    }
  });
}
function openModal(obj) {
  selectedCarpet.value = null;
  if (openTransfer.value && obj.type === "خروج قالی به سرویس") {
    selectCarpetDialog.value = true;
    status.value = outputServiceStatus.value;
  } else if (!openTransfer.value && obj.type === "خروج قالی به سرویس") {
    selectOperatorDialog.value = true;
    status.value = outputServiceStatus.value;
  } else if (obj.type === "ورود قالی از کارخانه") {
    inputCarpetFromFactoryDialog.value = true;
    dialogTitle.value = obj.type;
    status.value = inputFactoryStatus.value;
  } else if (obj.type === "خروج قالی به کارخانه") {
    inputCarpetFromFactoryDialog.value = true;
    dialogTitle.value = obj.type;
    status.value = outputFactoryStatus.value;
  } else if (obj.type === "ورود قالی از سرویس") {
    inputSelectOperatorDialog.value = true;
    dialogTitle.value = obj.type;
    status.value = inputServiceStatus.value;
  }
}
const serviceProviders = ref(null);
const selectedOperator = ref(null);
watch(
  () => selectedOperator.value,
  () => {
    selectedServices.value = [];
  }
);

const services = ref([]);
const selectedServices = ref([]);

function getServiceProviders() {
  axios.get(APIUrl + "serviceprovider/all-serviceproviders-list/").then((response) => {
    console.log(response);
    serviceProviders.value = response.data;
  });
}
function stepperNext() {
  if (selectOperatorDialog.value) {
    selectOperatorDialog.value = false;
    selectServicesDialog.value = true;
    selectCarpetDialog.value = false;
  } else if (selectServicesDialog.value) {
    localStorage.setItem("openTask", true);
    sendTransfer();
    selectOperatorDialog.value = false;
    selectServicesDialog.value = false;
    selectedCarpet.value = null;
    selectCarpetDialog.value = true;
  }
}
const inputSelectOperatorDialog = ref(false);
const inputSelectServicesDialog = ref(false);

const sP = ref(null);
const s = ref(null);
function stepperNext2() {
  if (inputSelectOperatorDialog.value) {
    inputSelectOperatorDialog.value = false;
    inputSelectServicesDialog.value = true;
    inputCarpetFromFactoryDialog.value = false;
  } else if (inputSelectServicesDialog.value) {
    inputSelectOperatorDialog.value = false;
    inputSelectServicesDialog.value = false;
    selectedCarpet.value = null;
    inputCarpetFromServiceDialog.value = true;
    sP.value = selectedOperator.value?.id;
    s.value = selectedServices.value;
  }
}

function stepperPrevious() {
  if (inputSelectServicesDialog.value) {
    inputSelectOperatorDialog.value = true;
    inputSelectServicesDialog.value = false;
    inputCarpetFromFactoryDialog.value = false;
  } else if (inputCarpetFromFactoryDialog.value) {
    inputSelectOperatorDialog.value = false;
    inputSelectServicesDialog.value = true;
    inputCarpetFromFactoryDialog.value = false;
  }
}
function stepperPrevious2() {
  inputSelectOperatorDialog.value = true;
  inputSelectServicesDialog.value = false;
}
function getServicesOfSelectedServiceProvider(p) {
  if (p) stepperNext2();
  else stepperNext();
  services.value = selectedOperator.value.services;
}
const userProfile = ref(null);
function getUserProfile() {
  axios.get(APIUrl + "api/account/user/").then((response) => {
    userProfile.value = response.data;
  });
}
const carpetList = ref([]);
const notIsFinishedTransfer = ref({});

async function getOpenTransfer() {
  notIsFinishedTransfer.value.date = "";
  await axios.get(APIUrl + "transfer/worker-isfinished-transfer/").then((response) => {
    if (response.data.length > 0) {
      for (let i = 0; i < response.data.length; i++) {
        openTransfer.value = true;

        notIsFinishedTransfer.value.id = response.data[i].id;
        notIsFinishedTransfer.value.serviceProviders = response.data[i].service_provider;
        notIsFinishedTransfer.value.services = response.data[i].services;
        notIsFinishedTransfer.value.date = response.data[i].date;
        notIsFinishedTransfer.value.status = response.data[i].status;
        notIsFinishedTransfer.value.worker = response.data[i].worker;
        notIsFinishedTransfer.value.carpets = response.data[i].carpets;
      }
    }
  });
}
async function getCarpetList() {
  carpetList.value = [];
  await axios.get(APIUrl + "carpet/all-carpets-list/").then((response) => {
    carpetList.value = response.data;
  });
}

const openTask = ref({});
const continueOpenTaskDialog = ref(false);
function checkOpenTask() {
  continueOpenTaskDialog.value = localStorage.getItem("openTask");
}

function getDateAndTime() {
  let currentdate = new Date();
  let datetime =
    currentdate.getFullYear() +
    "-" +
    (currentdate.getMonth() + 1) +
    "-" +
    currentdate.getDate() +
    "T" +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds() +
    "Z";

  return datetime;
}

const loader = ref(false);
async function carpetTransfer() {
  let carpet = null;
  for (const c of carpetList.value) {
    if (c.barcode == selectedCarpet.value) {
      carpet = c;
    }
  }
  alertActivator.value = false;
  inputCarpetFromFactoryDialog.value = false;
  loader.value = true;

  const body = {};
  body.carpets = [carpet?.id];
  body.worker = userProfile.value?.id;
  body.status = status.value;
  body.service_provider = null;
  body.services = [];
  body.date = getDateAndTime();
  body.is_finished = true;
  body.admin_verify = false;
  await axios
    .post(APIUrl + "transfer/create-transfer2/", body)
    .then((response) => {
      selectedCarpet.value = null;
      alertMsg.value = "ثبت شد";
      alertActivator.value = true;
      alertTimeout.value = 2000;
      alertColor.value = "success";
      setTimeout(() => {
        loader.value = false;
        inputCarpetFromFactoryDialog.value = true;
      }, 2000);
    })
    .catch((error) => {
      selectedCarpet.value = null;
      alertMsg.value = "این قالی در لیست وجود ندارد";
      alertActivator.value = true;
      alertTimeout.value = 2000;
      alertColor.value = "error";
      setTimeout(() => {
        loader.value = false;
        inputCarpetFromFactoryDialog.value = true;
      }, 2000);
    });
}

async function carpetTransfer2() {
  let carpet = null;
  for (const c of carpetList.value) {
    if (c.barcode == selectedCarpet.value) {
      carpet = c;
    }
  }
  alertActivator.value = false;
  inputCarpetFromServiceDialog.value = false;
  loader.value = true;

  const body = {};
  body.carpets = [carpet?.id];
  body.worker = userProfile.value?.id;
  body.status = status.value;
  body.service_provider = sP.value;
  body.services = s.value;
  body.date = getDateAndTime();
  body.is_finished = true;
  body.admin_verify = false;
  await axios
    .post(APIUrl + "transfer/create-transfer2/", body)
    .then((response) => {
      selectedCarpet.value = null;
      alertMsg.value = "ثبت شد";
      alertActivator.value = true;
      alertTimeout.value = 2000;
      alertColor.value = "success";
      setTimeout(() => {
        loader.value = false;
        inputCarpetFromServiceDialog.value = true;
      }, 2000);
    })
    .catch((error) => {
      selectedCarpet.value = null;
      alertMsg.value = "این قالی در لیست وجود ندارد";
      alertActivator.value = true;
      alertTimeout.value = 2000;
      alertColor.value = "error";
      setTimeout(() => {
        loader.value = false;
        inputCarpetFromServiceDialog.value = true;
      }, 2000);
    });
}
async function sendTransfer() {
  alertActivator.value = false;
  selectCarpetDialog.value = false;
  loader.value = true;
  await getOpenTransfer();
  const body = {};
  if (!openTransfer.value) {
    body.carpets = [];
    body.worker = userProfile.value.id;
    body.status = inputFactoryStatus.value;
    body.service_provider = selectedOperator?.value?.id;
    body.services = selectedServices.value;
    body.date = getDateAndTime();
    body.is_finished = false;
    body.admin_verify = false;
    axios
      .post(APIUrl + "transfer/create-transfer2/", body)
      .then((response) => {
        openTransfer.value = true;
      })
      .catch((error) => {
        selectedCarpet.value = null;
        alertMsg.value = "این قالی در لیست وجود ندارد";
        alertActivator.value = true;
        alertTimeout.value = 2000;
        alertColor.value = "error";
        setTimeout(() => {
          loader.value = false;
          selectCarpetDialog.value = true;
        }, 2000);
      });
  } else {
    let carpet = null;
    for (const c of carpetList.value) {
      if (c.barcode == selectedCarpet.value) {
        carpet = c;
      }
    }
    notIsFinishedTransfer.value?.carpets?.push(carpet?.id);
    selectCarpetDialog.value = false;
    alertActivator.value = false;
    loader.value = true;
    const body = {};
    body.carpets = notIsFinishedTransfer.value.carpets;
    body.worker = notIsFinishedTransfer.value.worker;
    body.status = notIsFinishedTransfer.value.status;
    body.service_provider = notIsFinishedTransfer.value.serviceProviders;
    body.services = notIsFinishedTransfer.value.services;
    body.date = notIsFinishedTransfer.value.date;
    body.is_finished = false;
    body.admin_verify = false;
    axios
      .put(
        APIUrl + "transfer/update-transfer2/" + notIsFinishedTransfer.value.id + "/",
        body
      )
      .then((response) => {
        selectedCarpet.value = null;
        alertMsg.value = "ثبت شد";
        alertActivator.value = true;
        alertTimeout.value = 2000;
        alertColor.value = "success";
        setTimeout(() => {
          loader.value = false;
          selectCarpetDialog.value = true;
        }, 2000);
      })
      .catch((error) => {
        selectedCarpet.value = null;
        alertMsg.value = "این قالی در لیست وجود ندارد";
        alertActivator.value = true;
        alertTimeout.value = 2000;
        alertColor.value = "error";
        setTimeout(() => {
          loader.value = false;
          selectCarpetDialog.value = true;
        }, 2000);
      });
  }
}

async function updateIsFinishedTransfer() {
  alertActivator.value = false;
  loader.value = true;

  await getOpenTransfer();
  const body = {};
  body.carpets = notIsFinishedTransfer.value.carpets;
  body.worker = notIsFinishedTransfer.value.worker;
  body.status = notIsFinishedTransfer.value.status;
  body.service_provider = notIsFinishedTransfer.value.serviceProviders;
  body.services = notIsFinishedTransfer.value.services;
  body.date = notIsFinishedTransfer.value.date;
  body.is_finished = true;
  body.admin_verify = false;
  axios
    .put(
      APIUrl + "transfer/update-transfer2/" + notIsFinishedTransfer.value.id + "/",
      body
    )
    .then((response) => {
      selectCarpetDialog.value = false;
      openTransfer.value = false;
      loader.value = false;

      alertMsg.value = "ثبت شد";
      alertActivator.value = true;
      alertTimeout.value = 2000;
      alertColor.value = "success";

      localStorage.removeItem("openTask");
    })
    .catch((error) => {
      alertMsg.value = "دوباره امتحان کنید";
      alertActivator.value = true;
      alertTimeout.value = 2000;
      alertColor.value = "error";
      setTimeout(() => {
        loader.value = false;
        selectCarpetDialog.value = true;
      }, 2000);
    });
}

function continueOpenTransfer() {
  selectedCarpet.value = null;
  continueOpenTaskDialog.value = false;
  selectCarpetDialog.value = true;
}
</script>
<style scoped>
.cart {
  border: 1px solid rgb(237, 74, 74);
  overflow: scroll;
}

/* width */
::-webkit-scrollbar {
  width: 5px;
}

/* Track */
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px grey;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #e65100;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}

.centered-input input {
  text-align: center;
}

.flexcard {
  display: flex;
  flex-direction: column;
}

.flexcard .v-toolbar {
  flex: 0;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #b30000;
}
</style>
