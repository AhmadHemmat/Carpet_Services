<template>
  <v-card class="mx-auto pa-4 mt-4" width="100%" max-width="500" dir="rtl">
    <div class="text-center mb-4 mt-1">
      <span :class="currentStep.class">
        {{ currentStep.msg }}
      </span>
    </div>
    <v-window v-model="step">
      <v-window-item :value="1">
        <v-text-field
          v-model="phoneNumber"
          counter="11"
          label="شماره همراه"
          minlength="11"
          maxlength="11"
          clearable
          required
          dir="ltr"
        >
        </v-text-field>
        <p
          class="frmValidation"
          :class="{ 'frmValidation--passed': phoneNumberValidFormat }"
        >
          <i
            class="frmIcon fas"
            :class="phoneNumberValidFormat ? 'fa-check' : 'fa-times'"
          >
          </i>
          با 09 شروع شود
        </p>
        <p
          class="frmValidation mb-4"
          :class="{ 'frmValidation--passed': phoneNumberValidLength }"
        >
          <i
            class="frmIcon fas"
            :class="phoneNumberValidLength ? 'fa-check' : 'fa-times'"
          >
          </i>
          شماره همراه معتبر (دارای ۱۱ رقم)
        </p>
      </v-window-item>
      <v-window-item :value="2">
        <!-- <v-text-field
          v-model="userName"
          label="نام کاربری"
          type="text"
          minlength="1"
          maxlength="20"
          clearable
          dir="ltr"
        >
        </v-text-field> -->
        <!-- <p
          class="frmValidation mb-4"
          :class="{ 'frmValidation--passed': userNameValidation }"
        >
          <i class="frmIcon fas" :class="userNameValidation ? 'fa-check' : 'fa-times'">
          </i>
          کاراکترهای مجاز شامل: حروف انگلیسی/ اعداد/ @/ ./ +/ -/ _ است
        </p> -->
        <v-text-field
          v-model="password"
          label="رمز ورود"
          type="password"
          minlength="8"
          maxlength="20"
          clearable
          dir="ltr"
        >
        </v-text-field>
        <p
          class="frmValidation mb-4"
          :class="{ 'frmValidation--passed': passwordValidLength }"
        >
          <i class="frmIcon fas" :class="passwordValidLength ? 'fa-check' : 'fa-times'">
          </i>
          حداقل دارای ۸ کاراکتر باشد
        </p>
        <!-- <v-text-field
          v-model="confirmPassword"
          label="تکرار رمز ورود وارد شده"
          type="password"
          minlength="8"
          maxlength="20"
          clearable
          dir="ltr"
        >
        </v-text-field>
        <p
          class="frmValidation mb-4"
          :class="{ 'frmValidation--passed': confirmPasswordValidation }"
        >
          <i
            class="frmIcon fas"
            :class="confirmPasswordValidation ? 'fa-check' : 'fa-times'"
          >
          </i>
          دقیقا همانند رمز ورود وارد شده در بالا باشد
        </p> -->
      </v-window-item>
      <v-window-item :value="3">
        <v-text-field v-model="firstName" label="نام" type="text" clearable>
        </v-text-field>
        <v-text-field v-model="lastName" label="نام خانوادگی" type="text" clearable>
        </v-text-field>
      </v-window-item>
      <v-window-item :value="4">
        <div class="pa-4 text-center">
          <v-img
            class="mb-4"
            contain
            height="128"
            src="https://cdn.vuetifyjs.com/images/logos/v.svg"
          >
          </v-img>
          <h3 class="title font-weight-light mb-2" style="color: teal">
            به آنادانان خوش آمدید
          </h3>
          <span class="caption grey--text" style="color: teal"> یک دنیا سپاس </span>
        </div>
      </v-window-item>
    </v-window>
    <v-divider v-if="step < 4"> </v-divider>
    <v-card-actions v-if="step < 4">
      <v-btn
        :disabled="!disableBtnPrevious"
        text
        :class="stepText.previousClass"
        @click="step--"
      >
        برگشت
      </v-btn>
      <v-spacer> </v-spacer>
      <v-btn :disabled="disableBtnNext" :class="stepText.class" depressed @click="save">
        {{ stepText.txt }}
      </v-btn>
    </v-card-actions>
  </v-card>
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
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

import { loginStore } from "@/stores/index";

const store = loginStore();

// Childs
import Alert from "@/components/Alert.vue";

// Variables
const router = useRouter();
const step = ref(1);
const phoneNumber = ref("");
const userName = ref("");
const password = ref("");
const confirmPassword = ref("");
const firstName = ref("");
const lastName = ref("");
const phoneNumberValidFormat = ref(false);
const phoneNumberValidLength = ref(false);
const userNameValidChars = ref(false);
const passwordValidLength = ref(false);
const confirmPasswordValidValue = ref(false);
const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
const alertMsg2 = ref("");
const alertActivator2 = ref(false);
const alertTimeout2 = ref(2000);
const alertColor2 = ref("orange");

// Computeds
const currentStep = computed(() => {
  switch (step.value) {
    case 1:
      return {
        msg: "لطفا شماره تلفن همراه خود را وارد کنید (الزامی)",
        class: "orange",
      };
    case 2:
      return {
        msg: "نام کاربری و رمز ورود (الزامی)",
        class: "orange",
      };
    case 3:
      return {
        msg: "نام و نام خانوادگی را وارد کنید",
        class: "orange",
      };
    default:
      return {
        msg: "عضویت با موفقیت به پایان رسید",
        class: "green",
      };
  }
});

const disableBtnPrevious = computed(() => {
  if (step.value === 1 || step.value === 4) return false;
  else return true;
});

const disableBtnNext = computed(() => {
  if (
    !(
      (step.value === 1 && phoneNumberValidation.value) ||
      (step.value === 2 && passwordValidation.value) ||
      step.value === 3
    )
  ) {
    return true;
  } else {
    return false;
  }
});

const phoneNumberValidation = computed(() => {
  phoneNumberValidFormat.value = /09+/.test(
    convertLatinPriceToPersian(phoneNumber.value)
  );
  phoneNumberValidLength.value = phoneNumber.value?.length === 11 ? true : false;
  if (phoneNumberValidLength.value && !phoneNumberValidFormat.value) {
    alertActivator.value = !alertActivator.value;
    alertMsg.value = "لطفا یک شماره همراه صحیح وارد کنید";
    alertActivator2.value = !alertActivator2.value;
    alertMsg2.value = "لطفا از اعداد انگلیسی استفاده کنید";
  }
  if (phoneNumberValidFormat.value && phoneNumberValidLength.value) {
    return true;
  } else {
    return false;
  }
});

// const userNameValidation = computed(() => {
//   userNameValidChars.value = /^[a-zA-Z0-9@+_.-]+$/i.test(userName.value);
//   return userNameValidChars.value ? true : false;
// });

const passwordValidation = computed(() => {
  passwordValidLength.value = password.value?.length > 7 ? true : false;
  return passwordValidLength.value ? true : false;
});

// const confirmPasswordValidation = computed(() => {
//   confirmPasswordValidValue.value =
//     confirmPassword.value === password.value ? true : false;
//   return confirmPasswordValidValue.value && password.value?.length > 0 ? true : false;
// });

const stepText = computed(() => {
  if (step.value === 3) {
    return {
      txt: "ثبت",
      class: "save",
      previousClass: "previous",
    };
  } else {
    return {
      txt: "بعدی",
      class: "next",
      previousClass: "previous",
    };
  }
});

// Functions

function onSubmit(ph, pa) {
  const apiUrl = "https://makacenter.ir/" + "account/api-token-auth/";
  let param;
  param = {
    username: ph,
    password: pa,
  };
  axios
    .post(apiUrl, param)
    .then((response) => {
      store.login(response.data.token);
      router.push("/dashboard");
    })
    .catch((error) => {
      console.log("error from api", error);
      // alertActivator.value = true;
      // alertMsg.value = "رمز ورود یا نام کاربری اشتباه است";
    });
  // .finally(() => {
  //   alertActivator.value = false;
  // });
}
function save() {
  if (step.value < 3) {
    step.value++;
  } else if (step.value === 3) {
    const validPhoneNumber = "+98" + phoneNumber.value.slice(1);
    axios
      .post("https://makacenter.ir/account/register", {
        first_name: firstName.value,
        last_name: lastName.value,
        phone: convertLatinPriceToPersian(validPhoneNumber),
        username: convertLatinPriceToPersian(validPhoneNumber),
        password: password.value,
        password2: password.value,
      })
      .then((response) => {
        step.value++;
        onSubmit(convertLatinPriceToPersian(validPhoneNumber), password.value);
        // setTimeout(function () {
        // router.push("/login");
        // }, 5000);
      })
      .catch((error) => {
        console.log("error from api", error);
        if (error.response.status === 500) {
          step.value = 3;
          alertActivator.value = !alertActivator.value;
          alertMsg.value = "لطفا دوباره امتحان کنید";
        } else if (error.response.data?.phone) {
          if (
            error.response.data?.phone[0] === "کاربران with this phone already exists."
          ) {
            step.value = 1;
            alertActivator.value = !alertActivator.value;
            alertMsg.value = "با این شماره همراه قبلا ثبت نام شده است";
          }
        } else if (error.response.data?.username) {
          if (
            error.response.data?.username[0] ===
            "A user with that username already exists."
          ) {
            step.value = 2;
            alertActivator.value = !alertActivator.value;
            alertMsg.value = "این نام کاربری از قبل انتخاب شده است";
          }
        }
      });
  }
}

function convertLatinPriceToPersian(price) {
  let numberStr = price.toString();

  let priceStr = "";
  for (let i = 0; i < numberStr.length; i++) {
    if (numberStr[i] === "۰") {
      priceStr += "0";
    } else if (numberStr[i] === "۱") {
      priceStr += "1";
    } else if (numberStr[i] === "۲") {
      priceStr += "2";
    } else if (numberStr[i] === "۳") {
      priceStr += "3";
    } else if (numberStr[i] === "۴") {
      priceStr += "4";
    } else if (numberStr[i] === "۵") {
      priceStr += "5";
    } else if (numberStr[i] === "۶") {
      priceStr += "6";
    } else if (numberStr[i] === "۷") {
      priceStr += "7";
    } else if (numberStr[i] === "۸") {
      priceStr += "8";
    } else if (numberStr[i] === "۹") {
      priceStr += "9";
    } else {
      priceStr += numberStr[i];
    }
  }
  return priceStr;
}
</script>

<style>
body {
  background-color: #efefef;
}
.container {
  width: 400px;
  margin: 50px auto;
  background: white;
  padding: 10px;
  font-family: Arial, Helvetica, sans-serif, sans-serif;
  border-radius: 3px;
}
h1 {
  font-size: 24px;
  text-align: center;
  text-transform: uppercase;
}
.frmField {
  background-color: white;
  color: #495057;
  line-height: 1.25;
  font-size: 16px;
  font-family: "Roboto", sans-serif;
  border: 0;
  padding: 10px;
  border: 1px solid #dbdbdb;
  border-radius: 3px;
  width: 90%;
}
.frmLabel {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
}
.frmValidation {
  font-size: 13px;
}
.frmValidation--passed {
  color: #717b85;
}
.frmIcon {
  color: #eb0029;
}
.frmValidation--passed .frmIcon {
  color: #0fa140;
}
.howToBuild {
  text-align: center;
  color: purple;
}
.howToBuild a {
  color: grey;
  font-weight: bold;
  text-decoration: none;
  text-transform: uppercase;
}
.next {
  color: white;
  background-color: teal;
}
.previous {
  color: white;
  background-color: red;
}
.save {
  color: greenyellow;
  background-color: darkgreen;
}
.orange {
  color: orangered;
}
.green {
  color: greenyellow;
}
</style>
