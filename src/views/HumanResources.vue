<template>
  <v-container align="center" justify="center">
    <v-app-bar v-if="device === 'mobile'" color="#C51162" app dir="rtl">
      <v-btn stacked>
        <v-icon icon="mdi-comment-check" color="white"></v-icon>
        <span> خوش آمدید </span>
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
                    <br />
                    <v-btn
                      class="my-2"
                      :color="obj.color"
                      rounded
                      @click="openModal(obj)"
                    >
                      {{ obj.type }}
                    </v-btn>
                    <br />
                    <v-btn
                      class="my-2"
                      :color="obj.color"
                      rounded
                      @click="modalManagerForAdd(obj)"
                    >
                      <v-icon color="black" size="x-large">mdi-plus</v-icon>
                      <span>افزودن</span>
                    </v-btn>
                  </v-card-item>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-card>
    </v-col>

    <!-- admin list -->
    <v-dialog
      v-model="adminListDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="adminListDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="my-4 d-flex justify-center text-center pa-2" color="warning">
            <span>لیست مدیران</span>
          </v-card>
          <v-row>
            <v-col cols="12">
              <v-card class="cart" :style="{ height: 400 + 'px', overflow: 'auto' }">
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-center">
                        <h2>نام</h2>
                      </th>
                      <th class="text-center">
                        <h2>نام خانوادگی</h2>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in adminsList" :key="i" class="text-center">
                      <td>
                        <h3>{{ item?.first_name ? item?.first_name : null }}</h3>
                      </td>
                      <td>
                        <h3>{{ item?.last_name ? item?.last_name : null }}</h3>
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
    <!-- add admin -->
    <v-dialog
      v-model="addAdminDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="addAdminDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span>اضافه کردن مدیر</span>
          </v-card>

          <v-card class="mx-auto" max-width="70%">
            <v-locale-provider rtl>
              <v-text-field
                v-model="firstName"
                class="pa-2"
                color="primary"
                label="نام"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="lastName"
                class="pa-2"
                color="primary"
                label="نام خانوادگی"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="username"
                class="pa-2"
                color="primary"
                label="شماره همراه"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="password"
                class="pa-2"
                color="primary"
                label="رمز ورود"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <!-- <v-checkbox
                  v-model="isStaff"
                  color="secondary"
                  label="مدیر است؟"
                ></v-checkbox> -->

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="success" @click="register(true)">
                <h2>ذخیره کردن مدیر</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-responsive>
      </v-card>
    </v-dialog>
    <!-- worker list -->
    <v-dialog
      v-model="workerListDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="workerListDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="my-4 d-flex justify-center text-center pa-2" color="warning">
            <span>لیست کارگران</span>
          </v-card>
          <v-row>
            <v-col cols="12">
              <v-card class="cart" :style="{ height: 400 + 'px', overflow: 'auto' }">
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-center">
                        <h2>نام</h2>
                      </th>
                      <th class="text-center">
                        <h2>نام خانوادگی</h2>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in workerList" :key="i" class="text-center">
                      <td>
                        <h3>{{ item?.first_name ? item?.first_name : null }}</h3>
                      </td>
                      <td>
                        <h3>{{ item?.last_name ? item?.last_name : null }}</h3>
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
    <!-- add worker -->
    <v-dialog
      v-model="addWorkerDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="addWorkerDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span>اضافه کردن کارگر</span>
          </v-card>

          <v-card class="mx-auto" max-width="70%">
            <v-locale-provider rtl>
              <v-text-field
                v-model="firstName"
                class="pa-2"
                color="primary"
                label="نام"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="lastName"
                class="pa-2"
                color="primary"
                label="نام خانوادگی"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="username"
                class="pa-2"
                color="primary"
                label="شماره همراه"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="password"
                class="pa-2"
                color="primary"
                label="رمز ورود"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="register(false)">
                <h2>ذخیره کردن کارگر</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-responsive>
      </v-card>
    </v-dialog>

    <!-- service provider list -->
    <v-dialog
      v-model="serviceProviderListDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="serviceProviderListDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span> لیست سرویس کارها </span>
          </v-card>
          <v-row>
            <v-col cols="12">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">نام</th>
                    <th class="text-center">نام خانوادگی</th>
                  </tr>
                </thead>
              </v-table>
            </v-col>
            <v-col cols="12">
              <v-card class="cart mx-2" :style="{ height: 400 + 'px', overflow: 'auto' }">
                <v-table>
                  <tbody>
                    <tr
                      v-for="(item, i) in serviceProviders"
                      :key="i"
                      class="text-center"
                    >
                      <td>
                        <span>{{ item?.first_name ? item?.first_name : null }}</span>
                      </td>
                      <td>
                        <span>{{ item?.last_name ? item?.last_name : null }}</span>
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

    <!-- add service provider -->
    <v-dialog
      v-model="addServiceProviderDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="addServiceProviderDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span>اضافه کردن سرویس کار</span>
          </v-card>

          <v-card class="mx-auto" max-width="70%">
            <v-locale-provider rtl>
              <v-text-field
                v-model="firstNameS"
                class="pa-2"
                color="primary"
                label="نام"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="lastNameS"
                class="pa-2"
                color="primary"
                label="نام خانوادگی"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
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
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="phoneNumber"
                class="pa-2"
                color="primary"
                label="شماره همراه"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-locale-provider rtl>
              <v-text-field
                v-model="address"
                class="pa-2"
                color="primary"
                label="آدرس"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-locale-provider rtl>
              <v-text-field
                v-model="nationalCode"
                class="pa-2"
                color="primary"
                label="کد ملی"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="addServiceProvider()">
                <h2>ذخیره کردن سرویس کار</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-responsive>
      </v-card>
    </v-dialog>

    <!-- drivers list -->
    <v-dialog
      v-model="driversListDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="driversListDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span> لیست رانندگان </span>
          </v-card>
          <v-row>
            <v-col cols="12">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">نام</th>
                    <th class="text-center">نام خانوادگی</th>
                  </tr>
                </thead>
              </v-table>
            </v-col>
            <v-col cols="12">
              <v-card class="cart mx-2" :style="{ height: 400 + 'px', overflow: 'auto' }">
                <v-table>
                  <tbody>
                    <tr v-for="(item, i) in drivers" :key="i" class="text-center">
                      <td>
                        <span>{{ item?.first_name ? item?.first_name : null }}</span>
                      </td>
                      <td>
                        <span>{{ item?.last_name ? item?.last_name : null }}</span>
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

    <!-- add driver -->
    <v-dialog
      v-model="addDriversDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="addDriversDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span>اضافه کردن راننده</span>
          </v-card>

          <v-card class="mx-auto" max-width="70%">
            <v-locale-provider rtl>
              <v-text-field
                v-model="firstNameD"
                class="pa-2"
                color="primary"
                label="نام"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="lastNameD"
                class="pa-2"
                color="primary"
                label="نام خانوادگی"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-text-field
                v-model="phoneNumberD"
                class="pa-2"
                color="primary"
                label="شماره همراه"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-locale-provider rtl>
              <v-text-field
                v-model="car"
                class="pa-2"
                color="primary"
                label="ماشین"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-locale-provider rtl>
              <v-text-field
                v-model="carNumber"
                class="pa-2"
                color="primary"
                label="شماره پلاک"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-locale-provider rtl>
              <v-text-field
                v-model="nationalCodeD"
                class="pa-2"
                color="primary"
                label="کد ملی"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="addDriver()">
                <h2>ذخیره کردن راننده</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-responsive>
      </v-card>
    </v-dialog>

    <!-- services list -->
    <v-dialog
      v-model="servicesListDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="servicesListDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span> لیست سرویس ها </span>
          </v-card>
          <v-row>
            <v-col cols="12">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">عنوان</th>
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
                        <span>{{ item?.title }}</span>
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

    <!-- add service -->
    <v-dialog
      v-model="addServiceDialog"
      persistent
      transition="dialog-bottom-transition"
      :fullscreen="device !== 'desktop' && device !== 'large'"
      :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
    >
      <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
        <v-responsive>
          <v-chip outline @click="addServiceDialog = false">
            <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
          </v-chip>

          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span>اضافه کردن سرویس</span>
          </v-card>

          <v-card class="mx-auto" max-width="70%">
            <v-locale-provider rtl>
              <v-text-field
                v-model="serviceTitle"
                class="pa-2"
                color="primary"
                label="عنوان"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <v-divider></v-divider>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="success" @click="addService()">
                <h2>ذخیره کردن سرویس</h2>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-responsive>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";
import * as XLSX from "xlsx";

onMounted(() => {
  // getAllUsers()
});

const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";
const adminsList = ref([]);
const workerList = ref([]);

function getAllUsers() {
  adminsList.value = [];
  workerList.value = [];
  axios.get(APIUrl + "user/all-user-list/").then((response) => {
    console.log(response);
    for (const user of response.data) {
      if (user.is_staff) {
        adminsList.value.push(user);
      } else {
        workerList.value.push(user);
      }
    }
  });
}
const firstName = ref(null);
const lastName = ref(null);
const isStaff = ref(null);
const username = ref(null);
const password = ref(null);
function register(isStaff) {
  const body = {
    firstname: firstName.value,
    lastname: lastName.value,
    is_staff: isStaff,
    username: username.value,
    password: password.value,
  };
  axios.post(APIUrl + "register/", body).then((response) => {
    console.log(response);
    if (isStaff) addAdminDialog.value = false;
    else addWorkerDialog.value = false;
  });
}

const serviceProviderListDialog = ref(false);
const serviceProviders = ref([]);
async function getServiceProviders() {
  await axios
    .get(APIUrl + "serviceprovider/all-serviceproviders-list/")
    .then((response) => {
      serviceProviders.value = response.data;
    });
}

const firstNameS = ref(null);
const lastNameS = ref(null);
const phoneNumber = ref(null);
const selectedServices = ref([]);
const address = ref(null);
const nationalCode = ref(null);
const addServiceProviderDialog = ref(false);
function addServiceProvider() {
  const body = {
    first_name: firstNameS.value,
    last_name: lastNameS.value,
    phone_number: phoneNumber.value,
    services: selectedServices.value,
    address: address.value,
    national_code: nationalCode.value,
  };
  axios
    .post(APIUrl + "serviceprovider/create-serviceproviders/", body)
    .then((response) => {
      addServiceProviderDialog.value = false;
    });
}

const drivers = ref([]);
function getAllDrivers() {
  axios.get(APIUrl + "driver/all-driver-list/").then((response) => {
    drivers.value = response.data;
  });
}

const firstNameD = ref(null);
const lastNameD = ref(null);
const phoneNumberD = ref(null);
const nationalCodeD = ref(null);
const car = ref(null);
const carNumber = ref(null);
const driversListDialog = ref(false);
const addDriversDialog = ref(false);
function addDriver() {
  const body = {
    first_name: firstNameD.value,
    last_name: lastNameD.value,
    phone_number: phoneNumberD.value,
    national_code: nationalCodeD.value,
    car: car.value,
    car_number: carNumber.value,
  };
  axios.post(APIUrl + "driver/create-driver/", body).then((response) => {
    addDriversDialog.value = false;
  });
}

const servicesListDialog = ref(false);
const addServiceDialog = ref(false);
const services = ref([]);
function getAllServices() {
  axios.get(APIUrl + "services/all-services-list/").then((response) => {
    services.value = response.data;
  });
}

const serviceTitle = ref(null);
function addService() {
  const body = {
    title: serviceTitle.value,
  };
  axios.post(APIUrl + "services/create-services/", body).then((response) => {
    addServiceDialog.value = false;
  });
}

const variants = [
  {
    type: "مدیران",
    color: "#1B5E20",
    variant: "elevated",
    icon: "mdi-account-multiple",
    add: "افزودن مدیر",
  },
  {
    type: "کارگران",
    color: "#3F51B5",
    variant: "elevated",
    icon: "mdi-run-fast",
    add: "افزودن کارگر",
  },
  {
    type: "سرویس کارها",
    color: "#2196F3",
    variant: "elevated",
    icon: "mdi-ticket-account",
    add: "افزودن سرویس کار",
  },
  {
    type: "سرویس ها",
    color: "#FF1744",
    variant: "elevated",
    icon: "mdi-wrench",
    add: "افزودن سرویس",
  },
  {
    type: "رانندگان",
    color: "#F57C00",
    variant: "elevated",
    icon: "mdi-truck",
    add: "افزودن راننده",
  },
];
const adminListDialog = ref(false);
const addAdminDialog = ref(false);
const workerListDialog = ref(false);
const addWorkerDialog = ref(false);

function openModal(obj) {
  if (obj.type === "مدیران") {
    adminListDialog.value = true;
    getAllUsers();
  } else if (obj.type === "کارگران") {
    workerListDialog.value = true;
    getAllUsers();
  } else if (obj.type === "سرویس کارها") {
    serviceProviderListDialog.value = true;
    getServiceProviders();
  } else if (obj.type === "رانندگان") {
    driversListDialog.value = true;
    getAllDrivers();
  } else if (obj.type === "سرویس ها") {
    servicesListDialog.value = true;
    getAllServices();
  }
}

function modalManagerForAdd(obj) {
  if (obj.add === "افزودن مدیر") {
    addAdminDialog.value = true;
  } else if (obj.add === "افزودن کارگر") {
    addWorkerDialog.value = true;
  } else if (obj.add === "افزودن سرویس کار") {
    addServiceProviderDialog.value = true;
    getAllServices();
  } else if (obj.add === "افزودن راننده") {
    addDriversDialog.value = true;
  } else if (obj.add === "افزودن سرویس") {
    addServiceDialog.value = true;
  }
}

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

const selectOperatorDialog = ref(false);
const selectCarpetDialog = ref(false);
const selectServicesDialog = ref(false);
const openTransfer = ref(false);
const selectedCarpet = ref(null);

const dialog = ref(false);
const selectedOperator = ref(null);
watch(
  () => selectedOperator.value,
  () => {
    selectedServices.value = [];
  }
);

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
