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
                <!-- :color="i % 2 === 0 ? '#b5e7a0' : '#f7cac9'" -->

                <v-card-item>
                  <div class="mb-1">
                    {{ obj.type }}
                  </div>
                </v-card-item>
                <v-icon :color="obj.color" size="x-large">{{ obj.icon }}</v-icon>
                <v-btn class="mb-2" :color="obj.color" @click="openModal(obj)">
                  انتخاب
                </v-btn>
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
                @click="getServicesOfSelectedServiceProvider"
              >
                بعدی
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <!-- <v-autocomplete
          class="mt-12"
          v-model="selectedOperator"
          :items="serviceProviders"
          color="blue-grey-lighten-2"
          :item-title="
            (item) => (item?.first_name ? item?.first_name + ' ' + item?.last_name : null)
          "
          label="انتخاب سرویس کار"
          clearable
          return-object
          dir="rtl"
        >
        </v-autocomplete> -->
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
            <v-card class="cart mx-2" :style="{ height: 400 + 'px', overflow: 'auto' }">
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
        <!-- <v-autocomplete
          class="mt-12"
          v-model="selectedServices"
          :items="services"
          color="blue-grey-lighten-2"
          item-title="title"
          item-value="id"
          label="انتخاب سرویس ها"
          clearable
          dir="rtl"
          chips
          closable-chips
          multiple
        >
        </v-autocomplete> -->

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
            <v-card class="cart mx-2" :style="{ height: 400 + 'px', overflow: 'auto' }">
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
            <!-- <v-col cols="6">
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
              </v-col> -->
          </v-row>
        </div>
        <!-- <v-autocomplete
            class="mt-12"
            v-model="selectedCarpet"
            :items="carpetList"
            color="blue-grey-lighten-2"
            :item-title="(item) => (item?.barcode ? item?.barcode : null)"
            label="انتخاب قالی"
            clearable
            dir="rtl"
            return-object
          >
          </v-autocomplete> -->
        <v-responsive class="mx-auto" max-width="344">
          <v-text-field
            v-model="selectedCarpet"
            label="اسکن قالی"
            hide-details="auto"
            autofocus
          ></v-text-field>
        </v-responsive>

        <!-- <div class="hello">
            <StreamBarcodeReader
              @decode="(a, b, c) => onDecode(a, b, c)"
              @loaded="() => onLoaded()"
            ></StreamBarcodeReader>
            Input Value: {{ text || "Nothing" }}
          </div> -->

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
            <!-- <v-col cols="6">
              <v-btn
                class="flex-grow-1"
                height="48"
                variant="tonal"
                @click="stepperPrevious"
              >
                لغو
              </v-btn>
            </v-col> -->
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
                @click="inputCarpetFromFactoryTransfer(selectedCarpet)"
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

  <Alert
    :msg="alertMsg"
    :activate="alertActivator"
    :timeout="alertTimeout"
    :color="alertColor"
  />
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";
// import { StreamBarcodeReader } from "vue-barcode-reader";
import Alert from "@/components/Alert.vue";

// import carpet from "../../assets/carpet_logo.png";
import * as XLSX from "xlsx";
onMounted(async () => {
  getServiceProviders();
  getCarpetList();
  checkOpenTask();
  getUserProfile();
  getStatuses();
  await getOpenTransfer();
});
const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";
const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");

const text = ref("");
const id = ref(null);
function onDecode(a, b, c) {
  text.value = a;
  console.log(text.value);

  // if (id.value) clearTimeout(id.value);
  // id.value = setTimeout(() => {
  //   if (text.value === a) {
  //     text.value = "";
  //   }
  // }, 5000);
}
function onLoaded() {
  console.log("load");
}

const metaDataFile = ref(null);
const inputExcelDialog = ref(false);
const carpets = ref([]);
function convert(e) {
  var files = e.target.files,
    f = files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    var data = new Uint8Array(e.target.result);
    var workbook = XLSX.read(data, { type: "array" });
    let sheetName = workbook.SheetNames[0];
    /* DO SOMETHING WITH workbook HERE */
    console.log(workbook);
    let worksheet = workbook.Sheets[sheetName];
    console.log(XLSX.utils.sheet_to_json(worksheet));
    carpets.value = XLSX.utils.sheet_to_json(worksheet);
  };
  reader.readAsArrayBuffer(f);
}

function sendCarpetsToAPI() {
  for (let i = 0; i < carpets.value.length; i++) {
    const body = {
      factory: carpets.value[i].factory,
      barcode: carpets.value[i].barcode,
      map_code: carpets.value[i].map_code,
      size: carpets.value[i].size,
      color: carpets.value[i].color,
      costumer_name: carpets.value[i].costumer_name,
    };
    axios.post(APIUrl + "carpet/register-from-excel/", body).then((response) => {
      console.log(response);
      inputExcelDialog.value = false;
    });
  }
}
// const carpetLogo = carpet;
const store = breakPointsStore();

const device = ref(store.device);

const variants = [
  // {
  //   type: "ورود اکسل قالی ها",
  //   color: "warning",
  //   variant: "elevated",
  //   icon: "mdi-file-excel",
  // },
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
const status = ref(null);
const dialogTitle = ref("");
const inputStatus = ref(null);
const outputStatus = ref(null);

async function getStatuses() {
  await axios.get(APIUrl + "status/all-status-list/").then((response) => {
    for (const s of response.data) {
      if (s.title === "خروج") {
        outputStatus.value = s.id;
      } else {
        inputStatus.value = s.id;
      }
    }
  });
}
function openModal(obj) {
  selectedCarpet.value = null;
  if (openTransfer.value && obj.type === "خروج قالی به سرویس") {
    selectCarpetDialog.value = true;
  } else if (!openTransfer.value && obj.type === "خروج قالی به سرویس") {
    selectOperatorDialog.value = true;
  } else if (obj.type === "ورود قالی از کارخانه") {
    inputCarpetFromFactoryDialog.value = true;
    dialogTitle.value = obj.type;
    status.value = inputStatus.value;
  } else if (obj.type === "خروج قالی به کارخانه") {
    inputCarpetFromFactoryDialog.value = true;
    dialogTitle.value = obj.type;
    status.value = outputStatus.value;
  } else if (obj.type === "ورود قالی از سرویس") {
    inputCarpetFromFactoryDialog.value = true;
    dialogTitle.value = obj.type;
    status.value = inputStatus.value;
  }
}
const dialog = ref(false);
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

function stepperPrevious() {
  if (selectServicesDialog.value) {
    selectOperatorDialog.value = true;
    selectServicesDialog.value = false;
    selectCarpetDialog.value = false;
  } else if (selectCarpetDialog.value) {
    selectOperatorDialog.value = false;
    selectServicesDialog.value = true;
    selectCarpetDialog.value = false;
  }
}
function getServicesOfSelectedServiceProvider() {
  stepperNext();
  services.value = selectedOperator.value.services;
}
const userProfile = ref(null);
function getUserProfile() {
  axios.get(APIUrl + "api/account/user/").then((response) => {
    console.log("UUUUUUUUUser", response);
    userProfile.value = response.data;
  });
}
const carpetList = ref([]);
const notIsFinishedTransfer = ref({});

async function getOpenTransfer() {
  notIsFinishedTransfer.value.date = "";
  await axios
    .get(APIUrl + "transfer/all-transfer-list/?page_size=1000")
    .then((response) => {
      for (let i = 0; i < response.data.results.length; i++) {
        if (
          response.data.results[i].worker === userProfile.value.pk &&
          response.data.results[i].is_finished === false
        ) {
          openTransfer.value = true;

          notIsFinishedTransfer.value.id = response.data.results[i].id;
          notIsFinishedTransfer.value.serviceProviders =
            response.data.results[i].service_provider;
          notIsFinishedTransfer.value.services = response.data.results[i].services;

          for (let j = 0; j < response?.data.results[i]?.date?.length; j++) {
            if (response.data.results[i].date[j] === "T")
              notIsFinishedTransfer.value.date += " ";
            else if (response.data.results[i].date[j] === "Z")
              notIsFinishedTransfer.value.date += "";
            else notIsFinishedTransfer.value.date += response.data.results[i].date[j];
          }
        }
      }
    });
}
async function getCarpetList() {
  carpetList.value = [];
  await axios.get(APIUrl + "carpet/all-carpets-list/").then((response) => {
    console.log("carpet", response);
    for (const carpet of response.data) {
      if (carpet.id !== selectedCarpet?.value?.id) {
        carpetList.value.push(carpet);
      }
    }
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
    "Last Sync: " +
    currentdate.getFullYear() +
    "/" +
    (currentdate.getMonth() + 1) +
    "/" +
    currentdate.getDate() +
    " @ " +
    currentdate.getHours() +
    ":" +
    currentdate.getMinutes() +
    ":" +
    currentdate.getSeconds();
  return datetime.replace("@", "").substring(11);
}

const loader = ref(false);
async function inputCarpetFromFactoryTransfer(carpet) {
  alertActivator.value = false;
  inputCarpetFromFactoryDialog.value = false;
  loader.value = true;

  const body = {};
  body.carpet = [carpet];
  body.worker = userProfile.value.pk;
  body.status = status.value;
  body.service_provider = 1;
  body.services = [];
  body.date = getDateAndTime();
  body.is_finished = true;
  body.admin_verify = false;
  await axios.post(APIUrl + "transfer/create-transfer/", body).then((response) => {
    console.log(response);
    selectedCarpet.value = null;
    alertMsg.value = "ثبت شد";
    alertActivator.value = true;
    alertTimeout.value = 2000;
    alertColor.value = "success";
    setTimeout(() => {
      loader.value = false;
      inputCarpetFromFactoryDialog.value = true;
    }, 2000);
  });
}
async function sendTransfer() {
  getCarpetList();
  await getOpenTransfer();
  const body = {};
  if (!openTransfer.value) {
    body.carpet = [];
    // body.id = notIsFinishedTransfer.value.id;
    body.worker = userProfile.value.pk;

    body.status = outputStatus.value;
    body.service_provider = selectedOperator?.value?.id;
    body.services = selectedServices.value;
    body.date = getDateAndTime();
    body.is_finished = false;
    body.admin_verify = false;
    axios.post(APIUrl + "transfer/create-transfer/", body).then((response) => {
      console.log("transfer", response);
      openTransfer.value = true;
    });
  } else {
    body.carpet = [selectedCarpet.value];
    body.id = notIsFinishedTransfer.value.id;
    body.worker = userProfile.value.pk;
    body.status = outputStatus.value;
    body.service_provider = notIsFinishedTransfer.value.serviceProviders;
    body.services = [];
    body.date = notIsFinishedTransfer.value.date;
    body.is_finished = false;
    body.admin_verify = false;
    axios.post(APIUrl + "transfer/update-transfer/", body).then((response) => {
      console.log("transfer", response);
      // openTransfer.value = true
    });
  }
}

async function updateIsFinishedTransfer() {
  // getCarpetList()
  await getOpenTransfer();
  let status = null;
  const body = {};
  body.carpet = [];
  body.id = notIsFinishedTransfer.value.id;
  body.worker = userProfile.value.pk;
  body.status = outputStatus.value;
  body.service_provider = notIsFinishedTransfer.value.serviceProviders;
  body.services = [];
  body.date = notIsFinishedTransfer.value.date;
  body.is_finished = true;
  body.admin_verify = false;
  axios.post(APIUrl + "transfer/update-transfer/", body).then((response) => {
    console.log("transfer", response);
    selectCarpetDialog.value = false;
    openTransfer.value = false;
    localStorage.removeItem("openTask");
  });
}

function continueOpenTransfer() {
  selectedCarpet.value = null;
  continueOpenTaskDialog.value = false;
  selectCarpetDialog.value = true;
}
</script>
<style>
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
