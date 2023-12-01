<template>
  <v-expansion-panels v-if="device === 'mobile'" v-model="panel">
    <v-expansion-panel>
      <v-expansion-panel-title>
        <span v-if="panel !== 0">مشاهده پروفایل</span>
        <span v-else>بستن پروفایل</span>
        <template v-slot:actions>
          <v-icon v-if="panel !== 0" color="#E65100" icon="mdi-account-circle"> </v-icon>
          <v-icon v-else color="error" icon="mdi-close"> </v-icon>
        </template>
      </v-expansion-panel-title>
      <v-expansion-panel-text>
        <v-col cols="12" xs="12" sm="12" md="4" lg="4">
          <v-card class="my-2" rounded="lg" elevation="12">
            <!-- <v-list-item
            lines="two"
            :title="userName"
            :subtitle="role"
            :prepend-avatar="avatar"
          >
          </v-list-item> -->
            <v-list-item
              lines="one"
              :title="userProfile.username"
              color="#E65100"
              prepend-icon="mdi-account-circle"
            >
            </v-list-item>
            <v-list-item
              lines="one"
              title="test"
              color="#E65100"
              prepend-icon="mdi-account-key"
            >
            </v-list-item>
            <v-list-item
              v-if="userProfile.is_active"
              lines="one"
              title="فعال"
              color="success"
              prepend-icon="mdi-checkbox-marked-circle"
            >
            </v-list-item>

            <v-list-item
              v-else
              lines="one"
              title="غیر فعال"
              color="error"
              prepend-icon="mdi-checkbox-blank-circle"
            >
            </v-list-item>

            <v-list-item
              lines="two"
              :subtitle="userProfile.email"
              color="#E65100"
              prepend-icon="mdi-email"
            >
            </v-list-item>

            <v-divider></v-divider>

            <v-list density="compact">
              <v-list-item prepend-icon="mdi-account-edit" value="account" color="teal">
                <v-btn
                  class="text-white"
                  v-if="store.isAuthenticated"
                  color="#E65100"
                  width="100%"
                  @click="() => (editProfileDialog = true)"
                >
                  ویرایش اطلاعات کاربر
                </v-btn>
              </v-list-item>

              <v-list-item prepend-icon="mdi-map-marker" value="address" color="teal">
                <v-btn
                  class="text-white"
                  v-if="store.isAuthenticated"
                  color="#E65100"
                  width="100%"
                  @click="() => (editAddressDialog = true)"
                >
                  ویرایش و اضافه کردن آدرس
                </v-btn>
              </v-list-item>

              <!-- <v-list-item
              prepend-icon="mdi-food-fork-drink"
              title="منو شرکت"
              value="kitchen"
              color="#E65100"
              @click="() => (editKitchenDialog = true)"
            >
            </v-list-item> -->

              <!-- <v-list-item
              prepend-icon="mdi-food"
              title="اعضای شرکت"
              color="#E65100"
              value="users"
            >
            </v-list-item> -->

              <!-- <v-list-item
              prepend-icon="mdi-instagram"
              title="رزروهای اعضای شرکت"
              value="posts"
              color="#E65100"
            >
            </v-list-item> -->

              <v-list-item prepend-icon="mdi-logout" value="close" color="error">
                <v-btn
                  v-if="store.isAuthenticated"
                  to="/login"
                  color="error"
                  width="100%"
                  @click="logout"
                >
                  خروج از حساب کاربری
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
  <v-col v-if="device !== 'mobile'" cols="12" xs="12" sm="12" md="4" lg="4">
    <!-- <v-navigation-drawer
      v-if="device !== 'mobile'"
      class="mt-16"
      location="right"
      permanent
    > -->
    <v-card class="cart" height="100%" rounded="lg" elevation="12" dir="rtl">
      <!-- <v-list-item
      lines="two"
      :title="userName"
      :subtitle="role"
      :prepend-avatar="avatar"
    >
    </v-list-item> -->
      <v-list-item
        lines="one"
        :title="userName"
        :subtitle="role"
        color="#E65100"
        prepend-icon="mdi-account-key"
      >
      </v-list-item>
      <v-list-item
        v-if="userStatus"
        lines="one"
        title="فعال"
        color="success"
        prepend-icon="mdi-checkbox-marked-circle"
      >
      </v-list-item>

      <v-list-item
        v-else
        lines="one"
        title="غیر فعال"
        color="error"
        prepend-icon="mdi-checkbox-blank-circle"
      >
      </v-list-item>

      <v-list-item
        lines="one"
        :title="fullName"
        color="#E65100"
        prepend-icon="mdi-account-circle"
      >
      </v-list-item>

      <v-list-item
        v-if="company"
        lines="one"
        :title="company"
        color="#E65100"
        prepend-icon="mdi-checkbox-multiple-blank"
      >
      </v-list-item>

      <v-list-item
        lines="one"
        :title="phoneNumber"
        color="#E65100"
        prepend-icon="mdi-phone-classic"
      >
      </v-list-item>

      <v-list-item
        lines="two"
        :subtitle="description + '- ' + 'پلاک: ' + plaque"
        color="#E65100"
        prepend-icon="mdi-home-map-marker"
      >
      </v-list-item>

      <v-list-item lines="two" :subtitle="email" color="#E65100" prepend-icon="mdi-email">
      </v-list-item>

      <v-divider></v-divider>
      <div style="width: 100%" class="card-actions">
        <v-list density="compact">
          <v-list-item prepend-icon="mdi-account-edit" value="account" color="teal">
            <v-btn
              class="text-white"
              v-if="store.isAuthenticated"
              color="#E65100"
              width="100%"
              @click="() => (editProfileDialog = true)"
            >
              ویرایش اطلاعات کاربر
            </v-btn>
          </v-list-item>

          <v-list-item prepend-icon="mdi-map-marker" value="address" color="teal">
            <v-btn
              class="text-white"
              v-if="store.isAuthenticated"
              color="#E65100"
              width="100%"
              @click="() => (editAddressDialog = true)"
            >
              ویرایش و اضافه کردن آدرس
            </v-btn>
          </v-list-item>

          <!-- <v-list-item
          prepend-icon="mdi-food-fork-drink"
          title="منو شرکت"
          value="kitchen"
          color="#E65100"
          @click="() => (editKitchenDialog = true)"
        >
        </v-list-item> -->

          <!-- <v-list-item
          prepend-icon="mdi-food"
          title="اعضای شرکت"
          color="#E65100"
          value="users"
        >
        </v-list-item> -->

          <!-- <v-list-item
          prepend-icon="mdi-instagram"
          title="رزروهای اعضای شرکت"
          value="posts"
          color="#E65100"
        >
        </v-list-item> -->

          <v-list-item prepend-icon="mdi-logout" value="close" color="error">
            <v-btn
              v-if="store.isAuthenticated"
              to="/login"
              color="error"
              width="100%"
              @click="logout"
            >
              خروج از حساب کاربری
            </v-btn>
          </v-list-item>
        </v-list>
      </div>
    </v-card>
    <!-- </v-navigation-drawer> -->
  </v-col>



  <Alert
    :msg="alertMsg"
    :activate="alertActivator"
    :timeout="alertTimeout"
    :color="alertColor"
  />

  <Alert
    :msg="alertMsg2"
    :activate="alertActivator2"
    :timeout="alertTimeout2"
    :color="alertColor2"
  />
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// Childs
import Alert from "@/components/Alert.vue";
import { loginStore } from "@/stores/index";
import { breakPointsStore } from "@/stores/breakPoints";

const breakPointsStoreVar = breakPointsStore();

const device = ref(breakPointsStoreVar.device);

const store = loginStore();
function logout() {
  store.logout();
}
const panel = ref(false);

//variables for props for edit 'profile' component
const editProfileDialog = ref(false);
const phoneNumber = ref(null);
const userName = ref(null);
const firstName = ref(null);
const lastName = ref(null);
const email = ref(null);
const nickName = ref(null);
const avatar = ref("");

//variables for props for edit 'address' component
const editAddressDialog = ref(false);
const plaque = ref("");
const description = ref("");

// Variables

const emit = defineEmits(["userRole", "company"]);

const fullName = ref("");
const role = ref(null);

const address = ref(null);
const userStatus = ref(null);

const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
const alertMsg2 = ref("");
const alertActivator2 = ref(false);
const alertTimeout2 = ref(2000);
const alertColor2 = ref("#E65100");
// const isChef = ref(null)
// const isStaff = ref(null)
// const isCustomer = ref(null)

// Functions
function changedProfile() {
  editProfileDialog.value = false;
  alertActivator.value = !alertActivator.value;
  alertMsg.value = "اطلاعات کاربر با موفقیت تغییر یافت";
  alertColor.value = "success";
}

function changedAddress() {
  editAddressDialog.value = false;
  alertActivator.value = !alertActivator.value;
  alertMsg.value = "آدرس کاربر با موفقیت تغییر یافت";
  alertColor.value = "success";
}
const company = ref(null);
function getAndFillProfileData() {
  axios
    .get("https://makacenter.ir/account/my-profile")
    .then((response) => {
      console.log("profile data:", response);

      phoneNumber.value = "0" + response.data.phone.slice(3);
      userName.value = response.data.username;
      firstName.value = response.data.first_name;
      lastName.value = response.data.last_name;
      fullName.value = firstName.value + " " + lastName.value;
      email.value = response.data.email;
      nickName.value = response.data.nick_name;
      avatar.value = response.data.avatar;

      description.value = response.data?.address?.description;
      plaque.value = response.data?.address?.plaque;

      userStatus.value = response.data.is_active;
      // role.value = "مدیر";

      if (response.data.is_company_admin) {
        role.value = "مدیر";
      } else if (response.data.is_chef) {
        role.value = "سرآشپز";
      } else {
        role.value = "مشتری";
      }
      emit("userRole", role.value);
      emit("company", response?.data?.user_companies[0]?.id);
      // if (response.data.user_companies.length > 0) {
      // }
      company.value = response?.data?.user_companies[0]?.name;

      if (response.data.user_companies.length > 0 && !store.isCompanyMember) {
        store.companyMember(true);
      }
    })
    .catch((error) => {
      console.log("error from /account/my-profile API: ", error);
      alertActivator.value = !alertActivator.value;
      alertMsg.value = "لطفا از اتصال به اینترنت اطمینان حاصل کنید";
      alertActivator2.value = !alertActivator2.value;
      alertMsg2.value = "اطلاعات کاربر دریافت نشد";
      // const responseData = {
      //   userName: "مریم اقبالی",
      //   role: "سرآشپز",
      //   avatar: "https://randomuser.mehttps://makacenter.ir/portraits/women/81.jpg",
      //   address: "شهرقدس- خیابان ۴۵ متری انقلاب- خیابان شهرداری- پلاک ۲۱- واحد ۵",
      //   phoneNumber: "09372399272",
      // };

      // avatarAsBase64.value = responseData.avatarAsBase64;
      // address.value = responseData.address;
      // phoneNumber.value = responseData.phoneNumber;
    });
}

const editKitchenDialog = ref(false);

// Life Cycles
onMounted(function () {
  // getAndFillProfileData();
  getUserData();
});

const userProfile = ref(null);
function getUserData() {
  axios.get("http://localhost:8000/getuser/").then((response) => {
    userProfile.value = response.data;
  });
}
</script>
<style>
.cart {
  border: 1px solid rgb(155, 225, 253);
}
.card-outter {
  padding-bottom: 50px;
}
.card-actions {
  position: absolute;
  bottom: 0;
}
</style>
