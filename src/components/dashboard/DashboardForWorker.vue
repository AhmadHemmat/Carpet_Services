<template>
  <v-app-bar v-if="device === 'mobile'" color="#C51162" app dir="rtl">
    <v-btn stacked>
      <v-badge v-if="openTransfer" color="warning" dot>
        <v-icon
          icon="mdi-comment-question-outline"
          color="error"
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
                <v-btn class="mb-2" :color="obj.color" @click="openModal(obj.type)">
                  انتخاب
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </v-card>
  </v-col>
  <v-col cols="12" xs="12" sm="12" md="8" lg="8">
    <v-dialog v-model="inputExcelDialog" persistent transition="dialog-bottom-transition">
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="inputExcelDialog = false">
            <v-icon color="red" size="small">mdi-close</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span class="text-h6"> وارد کردن فایل اکسل قالی ها </span>
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
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="selectOperatorDialog = false">
            <v-icon color="red" size="small">mdi-close</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <!-- <v-icon class="mx-2" color="white">mdi-export</v-icon> -->
            <span class="text-h6">
              مرحله ۱ خروج قالی
              <br />
              انتخاب سرویس کار
            </span>
          </v-card>
          <!-- <v-img
          class="mx-auto mt-12 mb-16"
          max-height="140"
          max-width="240"
          :src="carpetLogo"
        ></v-img> -->
          <v-autocomplete
            class="mt-12"
            v-model="selectedOperator"
            :items="serviceProviders"
            color="blue-grey-lighten-2"
            :item-title="
              (item) =>
                item?.first_name ? item?.first_name + ' ' + item?.last_name : null
            "
            label="انتخاب سرویس کار"
            clearable
            return-object
            dir="rtl"
          >
          </v-autocomplete>

          <v-container class="text-center">
            <v-row align="center" justify="center">
              <v-col>
                <v-btn
                  class="flex-grow-1"
                  height="48"
                  variant="tonal"
                  @click="getServicesOfSelectedServiceProvider"
                >
                  بعدی
                </v-btn>
                <!-- <v-card flat class="pa-4" @click="dialog = true">
                <v-avatar
                  icon="mdi-plus"
                  color="white"
                  variant="tonal"
                  class="mb-2"
                ></v-avatar>

                <div class="text-caption text-truncate">Add shortcut</div>
              </v-card> -->
              </v-col>
            </v-row>

            <v-dialog v-model="dialog" :width="device === 'mobile' ? '100%' : '50%'">
              <v-card title="Add shortcut" rounded="lg">
                <template v-slot:text>
                  <v-label class="text-caption">Name</v-label>

                  <v-text-field
                    density="compact"
                    variant="solo-filled"
                    flat
                  ></v-text-field>

                  <v-text-field
                    density="compact"
                    variant="solo-filled"
                    flat
                  ></v-text-field>
                </template>

                <div class="py-4 px-5 text-end">
                  <v-btn
                    border
                    class="text-none me-2"
                    color="blue"
                    text="Cancel"
                    variant="text"
                    @click="dialog = false"
                  ></v-btn>

                  <v-btn
                    class="text-none"
                    color="blue"
                    text="Done"
                    variant="flat"
                    @click="dialog = false"
                  ></v-btn>
                </div>
              </v-card>
            </v-dialog>
          </v-container>
        </v-responsive>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="selectServicesDialog"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="selectServicesDialog = false">
            <v-icon color="red" size="small">mdi-close</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span class="text-h6">
              مرحله ۲ خروج قالی
              <br />
              انتخاب سرویس ها
            </span>
          </v-card>
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

          <v-container class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="6">
                <v-btn
                  class="flex-grow-1"
                  height="48"
                  variant="tonal"
                  @click="stepperNext"
                >
                  بعدی
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  class="flex-grow-1"
                  height="48"
                  variant="tonal"
                  @click="stepperPrevious"
                >
                  قبلی
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-responsive>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="selectCarpetDialog"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="selectCarpetDialog = false">
            <v-icon color="red" size="small">mdi-close</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span class="text-h6">
              مرحله ۳ خروج قالی
              <br />
              انتخاب قالی
            </span>
          </v-card>
          <v-autocomplete
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
          </v-autocomplete>

          <!-- <div class="hello">
            <StreamBarcodeReader
              @decode="(a, b, c) => onDecode(a, b, c)"
              @loaded="() => onLoaded()"
            ></StreamBarcodeReader>
            Input Value: {{ text || "Nothing" }}
          </div> -->

          <v-container class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="6">
                <v-btn
                  class="flex-grow-1"
                  height="48"
                  variant="tonal"
                  @click="sendTransfer"
                >
                  بعدی
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  class="flex-grow-1"
                  height="48"
                  variant="tonal"
                  @click="stepperPrevious"
                >
                  قبلی
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
          <v-container class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-btn
                  class="flex-grow-1"
                  height="48"
                  variant="tonal"
                  width="100%"
                  @click="updateIsFinishedTransfer"
                >
                  ثبت نهایی
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-responsive>
      </v-card>
    </v-dialog>

    <v-dialog v-model="openTaskDialog" persistent transition="dialog-bottom-transition">
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="openTaskDialog = false">
            <v-icon color="red" size="small">mdi-close</v-icon>
          </v-chip>
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span class="text-h6"> شما یک انتقال قالی ناتمام دارید </span>
          </v-card>
          <v-container class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="6">
                <v-btn
                  class="flex-grow-1"
                  height="48"
                  variant="tonal"
                  @click="showOpenTask"
                >
                  ادامه
                </v-btn>
              </v-col>
              <v-col cols="6">
                <v-btn
                  class="flex-grow-1"
                  height="48"
                  variant="tonal"
                  @click="stepperPrevious"
                >
                  لغو
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-responsive>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="continueOpenTaskDialog"
      persistent
      transition="dialog-bottom-transition"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="continueOpenTaskDialog = false">
            <v-icon color="red" size="small">mdi-close</v-icon>
          </v-chip>
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span class="text-h6"> شما یک انتقال قالی ناتمام دارید </span>
          </v-card>
          <v-container class="text-center">
            <v-row align="center" justify="center">
              <v-col cols="6">
                <v-btn
                  class="flex-grow-1"
                  height="48"
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
          </v-container>
        </v-responsive>
      </v-card>
    </v-dialog>
  </v-col>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";
import { StreamBarcodeReader } from "vue-barcode-reader";

// import carpet from "../../assets/carpet_logo.png";
import * as XLSX from "xlsx";
onMounted(() => {
  getServiceProviders();
  getCarpetList();
  checkOpenTask();
  getUserProfile();
  getOpenTransfer();
});
const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";

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
    });
  }
}
// const carpetLogo = carpet;
const store = breakPointsStore();

const device = ref(store.device);

const variants = [
  {
    type: "ورود اکسل قالی ها",
    color: "warning",
    variant: "elevated",
    icon: "mdi-file-excel",
  },
  {
    type: "ورود قالی از کارخانه",
    color: "success",
    variant: "elevated",
    icon: "mdi-clipboard-arrow-down",
  },
  {
    type: "خروج به کارخانه",
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

function openModal(type) {
  if (openTransfer.value && type === "خروج قالی به سرویس") {
    selectCarpetDialog.value = true;
  } else if (!openTransfer.value && type === "خروج قالی به سرویس") {
    selectOperatorDialog.value = true;
  } else if (type === "ورود اکسل قالی ها") {
    inputExcelDialog.value = true;
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
const selectedCarpet = ref(null);
const notIsFinishedTransfer = ref({});

async function getOpenTransfer() {
  notIsFinishedTransfer.value.date = "";
  await axios.get(APIUrl + "transfer/all-transfer-list").then((response) => {
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
const openTaskDialog = ref(false);
const continueOpenTaskDialog = ref(false);
function checkOpenTask() {
  continueOpenTaskDialog.value = localStorage.getItem("openTask");
}
function continueOpenTask() {
  openTaskDialog.value = false;
  continueOpenTaskDialog.value = true;
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
    body.carpet = [selectedCarpet.value.barcode];
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
