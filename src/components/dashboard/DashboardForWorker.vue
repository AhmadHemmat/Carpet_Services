<template>
  <v-col cols="12" xs="12" sm="12" md="8" lg="8">
    <v-card rounded="lg" elevation="12">
      <v-card class="cart" :style="{ height: windowHeight + 'px', overflow: 'auto' }">
        <v-container>
          <v-row align="center" justify="center">
            <v-col v-for="(obj, i) in variants" :key="i" cols="12" md="6">
              <v-card
                class="mx-auto"
                width="100%"
                height="100%"
                :variant="obj.variant"
                dir="rtl"
              >
                <v-card-item>
                  <div>
                    <div class="text-h6 mb-1">{{ obj.type }}</div>
                  </div>
                </v-card-item>
                <v-card-actions>
                  <v-btn :color="obj.color" @click="openModal(obj.type)"> انتخاب </v-btn>
                </v-card-actions>
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
    :width="device === 'mobile' ? '100%' : '50%'"
  >
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
    :width="device === 'mobile' ? '100%' : '50%'"
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
        {{ serviceProviders }}
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

                <v-text-field density="compact" variant="solo-filled" flat></v-text-field>

                <v-text-field density="compact" variant="solo-filled" flat></v-text-field>
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
    :width="device === 'mobile' ? '100%' : '50%'"
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
              <v-btn class="flex-grow-1" height="48" variant="tonal" @click="stepperNext">
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
    :width="device === 'mobile' ? '100%' : '50%'"
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
          item-title="barcode"
          item-value="id"
          label="انتخاب قالی"
          clearable
          dir="rtl"
        >
        </v-autocomplete>

        <v-container class="text-center">
          <v-row align="center" justify="center">
            <v-col cols="6">
              <v-btn
                class="flex-grow-1"
                height="48"
                variant="tonal"
                @click="updateCarpetStatusToService(selectedCarpet)"
              >
                ثبت
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
    v-model="openTaskDialog"
    persistent
    :width="device === 'mobile' ? '100%' : '50%'"
  >
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
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";
import carpet from "../../assets/carpet_logo.png";
import * as XLSX from "xlsx";
onMounted(() => {
  getServiceProviders();
  getCarpetList();
  checkOpenTask();
});
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
    axios
      .post("http://localhost:8000/carpet/register-from-excel/", body)
      .then((response) => {
        console.log(response);
      });
  }
}
const carpetLogo = carpet;
const store = breakPointsStore();

const device = ref(store.device);

const variants = [
  {
    type: "ورود اولیه قالی",
    color: "success",
    variant: "elevated",
  },
  {
    type: "خروج به کارخانه",
    color: "warning",
    variant: "elevated",
  },
  {
    type: "ورود قالی",
    color: "success",
    variant: "elevated",
  },
  {
    type: "خروج قالی",
    color: "error",
    variant: "elevated",
  },
];
const selectOperatorDialog = ref(false);
const selectCarpetDialog = ref(false);
const selectServicesDialog = ref(false);

function openModal(type) {
  if (type === "خروج قالی") {
    selectOperatorDialog.value = true;
  } else if (type === "ورود اولیه قالی") {
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
  axios
    .get("http://localhost:8000/serviceprovider/all-serviceproviders-list/")
    .then((response) => {
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

  openTask.value = true;
  localStorage.setItem("openTask", openTask.value);
  services.value = selectedOperator.value.services;
}

const carpetList = ref(null);
const selectedCarpet = null;
const statuses = ref(null);
const onServiceStatusId = ref(null);
async function updateCarpetStatusToService(carpetId) {
  await axios.get("http://localhost:8000/getstatus/").then((response) => {
    console.log("sssssssss", response);
    statuses.value = response.data;
    for (const status of response.data) {
      if (status.title === "در دست سرویس") {
        onServiceStatusId.value = status.id;
      }
    }
  });
  console.log("id", carpetId);
  axios
    .post("http://localhost:8000/updatecarpet/", {
      carpet_id: carpetId,
      status_id: onServiceStatusId.value,
    })
    .then((response) => {
      console.log("ssssssssssssssssssssssstttttt", response);
    });
}
function getCarpetList() {
  axios.get("http://localhost:8000/carpet/all-carpets-list/").then((response) => {
    console.log("carpet", response);
    carpetList.value = response.data;
  });
}

const openTask = ref(false);
const openTaskDialog = ref(false);
function checkOpenTask() {
  openTaskDialog.value = localStorage.getItem("openTask");

  console.log("$$$$$$$$$$$$$", localStorage.getItem("openTask"));
}
</script>
<style>
.cart {
  border: 1px solid rgb(155, 225, 253);
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
