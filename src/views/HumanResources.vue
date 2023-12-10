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
                      width="150"
                      @click="openModal(obj)"
                    >
                      {{ obj.type }}
                    </v-btn>
                    <br />
                    <v-btn
                      class="my-2"
                      :color="obj.color"
                      rounded
                      width="150"
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
            <h2>لیست مدیران</h2>
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

          <v-card class="mx-auto my-2" max-width="70%">
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
            <div align="center" justify="center">
              <v-btn
                :disabled="!firstName || !lastName || !username || !password"
                class="my-2"
                color="success"
                width="200"
                @click="register(true)"
              >
                <div>ذخیره</div>
              </v-btn>
            </div>
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
            <h2>لیست کارگران</h2>
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

          <v-card class="mx-auto my-2" max-width="70%">
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
            <div align="center" justify="center">
              <v-btn
                :disabled="!firstName || !lastName || !username || !password"
                class="my-2"
                color="success"
                width="200"
                @click="register(false)"
              >
                <div>ذخیره</div>
              </v-btn>
            </div>
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

          <v-card class="my-4 d-flex justify-center text-center pa-2" color="warning">
            <h2>لیست سرویس کارها</h2>
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
                    <tr
                      v-for="(item, i) in serviceProviders"
                      :key="i"
                      class="text-center"
                    >
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
          <v-card
            class="cart mx-auto my-2"
            max-width="90%"
            :style="{ height: 700 + 'px', overflow: 'auto' }"
          >
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
              <v-text-field
                v-model="phoneNumber"
                class="pa-2"
                color="primary"
                label="شماره همراه"
                rounded
              ></v-text-field>
            </v-locale-provider>
            <!-- <v-locale-provider rtl>
              <v-text-field
                v-model="address"
                class="pa-2"
                color="primary"
                label="آدرس"
                rounded
              ></v-text-field>
            </v-locale-provider> -->
            <v-locale-provider rtl>
              <v-text-field
                v-model="nationalCode"
                class="pa-2"
                color="primary"
                label="کد ملی"
                rounded
              ></v-text-field>
            </v-locale-provider>

            <v-locale-provider rtl>
              <v-autocomplete
                class="mx-2"
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
                rounded
              >
              </v-autocomplete>
            </v-locale-provider>
            <v-divider></v-divider>
            <div align="center" justify="center">
              <v-btn
                :disabled="
                  !firstNameS ||
                  !lastNameS ||
                  !phoneNumber ||
                  !nationalCode ||
                  selectedServices.length === 0
                "
                class="my-2"
                color="success"
                width="200"
                @click="addServiceProvider()"
              >
                <div>ذخیره</div>
              </v-btn>
            </div>
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

          <v-card class="my-4 d-flex justify-center text-center pa-2" color="warning">
            <h2>لیست رانندگان</h2>
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
                    <tr v-for="(item, i) in drivers" :key="i" class="text-center">
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

          <v-card class="mx-auto my-2" max-width="70%">
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
            <div align="center" justify="center">
              <v-btn
                :disabled="
                  !firstNameD ||
                  !lastNameD ||
                  !phoneNumberD ||
                  !car ||
                  !carNumber ||
                  !nationalCodeD
                "
                class="my-2"
                width="200"
                color="success"
                @click="addDriver()"
              >
                <div>ذخیره</div>
              </v-btn>
            </div>
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

          <v-card class="my-4 d-flex justify-center text-center pa-2" color="warning">
            <h2>لیست سرویس ها</h2>
          </v-card>
          <v-row>
            <v-col cols="12">
              <v-card class="cart" :style="{ height: 400 + 'px', overflow: 'auto' }">
                <v-table>
                  <thead>
                    <tr>
                      <th class="text-center">
                        <h2>عنوان</h2>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, i) in services" :key="i" class="text-center">
                      <td>
                        <h3>{{ item?.title }}</h3>
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

          <v-card class="mx-auto my-2" max-width="70%">
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
            <div align="center" justify="center">
              <v-btn
                :disabled="!serviceTitle"
                class="my-2"
                color="success"
                width="200"
                @click="addService()"
              >
                <div>ذخیره</div>
              </v-btn>
            </div>
          </v-card>
        </v-responsive>
      </v-card>
    </v-dialog>

    <Alert
      :msg="alertMsg"
      :activate="alertActivator"
      :timeout="alertTimeout"
      :color="alertColor"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";
import Alert from "@/components/Alert.vue";
const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
// onMounted(() => {
// });

function convertPersianNumberToLatin(number) {
  let numberStr = number.toString();

  let str = "";
  for (let i = 0; i < numberStr.length; i++) {
    if (numberStr[i] === "۰") {
      str += "0";
    } else if (numberStr[i] === "۱") {
      str += "1";
    } else if (numberStr[i] === "۲") {
      str += "2";
    } else if (numberStr[i] === "۳") {
      str += "3";
    } else if (numberStr[i] === "۴") {
      str += "4";
    } else if (numberStr[i] === "۵") {
      str += "5";
    } else if (numberStr[i] === "۶") {
      str += "6";
    } else if (numberStr[i] === "۷") {
      str += "7";
    } else if (numberStr[i] === "۸") {
      str += "8";
    } else if (numberStr[i] === "۹") {
      str += "9";
    } else {
      str += numberStr[i];
    }
  }
  return str;
}

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
  alertActivator.value = false;

  const body = {
    firstname: firstName.value,
    lastname: lastName.value,
    is_staff: isStaff,
    username: convertPersianNumberToLatin(username.value),
    password: password.value,
  };
  axios
    .post(APIUrl + "register/", body)
    .then((response) => {
      console.log(response);
      if (isStaff) addAdminDialog.value = false;
      else addWorkerDialog.value = false;

      firstName.value = null;
      lastName.value = null;
      username.value = null;
      password.value = null;
    })
    .catch((error) => {
      if (
        error.response.data.status ===
        "username," + username.value + " allready exsit"
      ) {
        alertMsg.value = "شماره همراه تکراری است";
        alertActivator.value = true;
        alertTimeout.value = 2000;
        alertColor.value = "error";
      }
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
  alertActivator.value = false;

  const body = {
    first_name: firstNameS.value,
    last_name: lastNameS.value,
    phone_number: convertPersianNumberToLatin(phoneNumber.value),
    services: selectedServices.value,
    address: null,
    national_code: convertPersianNumberToLatin(nationalCode.value),
  };
  axios
    .post(APIUrl + "serviceprovider/create-serviceproviders/", body)
    .then((response) => {
      addServiceProviderDialog.value = false;
      firstNameS.value = null;
      lastNameS.value = null;
      phoneNumber.value = null;
      selectedServices.value = [];
      address.value = null;
      nationalCode.value = null;
    })
    .catch((error) => {
      console.log(error);
      if (error.response.data.title[0]) {
        alertMsg.value = "شماره همراه یا کد ملی تکراری است";
        alertActivator.value = true;
        alertTimeout.value = 2000;
        alertColor.value = "error";
      }
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
  alertActivator.value = false;

  const body = {
    first_name: firstNameD.value,
    last_name: lastNameD.value,
    phone_number: convertPersianNumberToLatin(phoneNumberD.value),
    national_code: convertPersianNumberToLatin(nationalCodeD.value),
    car: car.value,
    car_number: carNumber.value,
  };
  axios
    .post(APIUrl + "driver/create-driver/", body)
    .then((response) => {
      addDriversDialog.value = false;
      firstNameD.value = null;
      lastNameD.value = null;
      phoneNumberD.value = null;
      nationalCodeD.value = null;
      car.value = null;
      carNumber.value = null;
    })
    .catch((error) => {
      console.log(error);
      if (error.response.data.title[0]) {
        alertMsg.value = "شماره همراه یا کد ملی یا پلاک تکراری است";
        alertActivator.value = true;
        alertTimeout.value = 2000;
        alertColor.value = "error";
      }
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
  alertActivator.value = flase;

  const body = {
    title: serviceTitle.value,
  };
  axios
    .post(APIUrl + "services/create-services/", body)
    .then((response) => {
      addServiceDialog.value = false;
      serviceTitle.value = null;
    })
    .catch((error) => {
      console.log(error);
      if (error.response.data.title[0]) {
        alertMsg.value = " سرویس تکراری است";
        alertActivator.value = true;
        alertTimeout.value = 2000;
        alertColor.value = "error";
      }
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

const store = breakPointsStore();
const device = ref(store.device);

watch(
  () => addAdminDialog.value,
  () => {
    if (!addAdminDialog.value) {
      firstName.value = null;
      lastName.value = null;
      username.value = null;
      password.value = null;
    }
  }
);
watch(
  () => addWorkerDialog.value,
  () => {
    if (!addWorkerDialog.value) {
      firstName.value = null;
      lastName.value = null;
      username.value = null;
      password.value = null;
    }
  }
);
watch(
  () => addServiceProviderDialog.value,
  () => {
    if (!addServiceProviderDialog.value) {
      firstNameS.value = null;
      lastNameS.value = null;
      phoneNumber.value = null;
      selectedServices.value = [];
      address.value = null;
      nationalCode.value = null;
    }
  }
);
watch(
  () => addDriversDialog.value,
  () => {
    if (!addDriversDialog.value) {
      firstNameD.value = null;
      lastNameD.value = null;
      phoneNumberD.value = null;
      nationalCodeD.value = null;
      car.value = null;
      carNumber.value = null;
    }
  }
);
watch(
  () => addServiceDialog.value,
  () => {
    if (!addServiceDialog.value) {
      serviceTitle.value = null;
    }
  }
);
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
