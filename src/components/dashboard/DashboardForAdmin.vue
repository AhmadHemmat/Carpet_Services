<template>
  <v-app-bar v-if="device === 'mobile'" color="#C51162" app dir="rtl">
    <v-btn stacked>
      <v-icon  icon="mdi-comment-check" color="white"></v-icon>
      <span > خوش آمدید </span>
    </v-btn>
<v-spacer></v-spacer>
    <v-btn>
      <v-icon  icon="mdi-apps" color="#FFFF00" size="large"></v-icon>
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
                :variant="obj.variant"
                dir="rtl"
                style="border: 1px solid #3200e6"
              >
                <v-card-item>
                  <v-icon :color="obj.color" size="x-large">{{ obj.icon }}</v-icon>
                <br/>
                <v-btn class="my-2" :color="obj.color" rounded @click="openModal(obj)">
                  {{ obj.type }}
                </v-btn>
                </v-card-item>
                
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-card>
  </v-col>
  <v-dialog
    v-model="inputExcelDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="inputExcelDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span> وارد کردن فایل اکسل قالی ها </span>
        </v-card>

        <v-file-input
          v-model="metaDataFile"
          class="justify-center mt-12 mx-4"
          label="انتخاب فایل اکسل"
          variant="filled"
          prepend-icon="mdi-file-excel"
          @change="convert"
        ></v-file-input>

        <v-container class="text-center">
          <v-row align="center" justify="center">
            <v-col>
              <v-btn
                class="flex-grow-1"
                height="48"
                width="100%"
                variant="tonal"
                @click="sendCarpetsToAPI"
              >
                ثبت
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-responsive>
    </v-card>
  </v-dialog>

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
        <v-autocomplete
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
        </v-autocomplete>
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
        <v-autocomplete
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
        </v-autocomplete>
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
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";
import { StreamBarcodeReader } from "vue-barcode-reader";
// import carpet from "../../assets/carpet_logo.png";
import * as XLSX from "xlsx";
import { useRouter } from "vue-router";




onMounted(async () => {
  getServiceProviders();
  getCarpetList();
  checkOpenTask();
  getUserProfile();
  await getOpenTransfer();
});
const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";
const router = useRouter();
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
  {
    type: "ورود قالی ها",
    color: "#1B5E20",
    variant: "elevated",
    icon: "mdi-file-excel",
  },
  {
    type: "نقل و انتقالات",
    color: "#3F51B5",
    variant: "elevated",
    icon: "mdi-transit-transfer",
  },
  {
    type: "منابع انسانی",
    color: "#2196F3",
    variant: "elevated",
    icon: "mdi-human-male",
  },
  {
    type: "قالی ها",
    color: "#FF1744",
    variant: "elevated",
    icon: "mdi-google-nearby",
  },
  {
    type: "گزارش گیری",
    color: "#F57C00",
    variant: "elevated",
    icon: "mdi-newspaper",
  },
];
const selectOperatorDialog = ref(false);
const selectCarpetDialog = ref(false);
const selectServicesDialog = ref(false);
const openTransfer = ref(false);
const selectedCarpet = ref(null);

function openModal(obj) {
  if (obj.type === "منابع انسانی") {
    router.push("/hr");
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
const statuses = ref(null);

async function getStatuses() {
  await axios.get(APIUrl + "status/all-status-list/").then((response) => {
    statuses.value = response.data;
  });
}
async function sendTransfer() {
  getCarpetList();
  await getOpenTransfer();
  let status = null;
  await getStatuses();
  for (const s of statuses.value) {
    if (s.title === "خروج") {
      status = s.id;
    }
  }
  const body = {};
  if (!openTransfer.value) {
    body.carpet = [];
    body.id = notIsFinishedTransfer.value.id;
    body.worker = userProfile.value.pk;

    body.status = status;
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
    body.status = status;
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
  await getStatuses();
  for (const s of statuses.value) {
    if (s.title === "خروج") {
      status = s.id;
    }
  }
  const body = {};
  body.carpet = [];
  body.id = notIsFinishedTransfer.value.id;
  body.worker = userProfile.value.pk;
  body.status = status;
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
</style>
