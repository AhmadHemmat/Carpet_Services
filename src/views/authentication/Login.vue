<template>
  <v-card class="mx-auto pa-4 mt-4" width="100%" max-width="500" dir="rtl">
    <div class="text-center mb-4">
      <span style="color: orangered"> ورود به حساب کاربری </span>
    </div>
    <v-form v-model="form" dir="rtl" @submit.prevent="onSubmit">
      <v-row>
        <v-col cols="1">
          <v-icon class="ma-2" color="#FF1744"> mdi-phone-classic </v-icon>
        </v-col>
        <v-col cols="11">
          <v-text-field
            v-model="userName"
            :rules="[required]"
            class="mb-4"
            clearable
            label="شماره همراه"
            type="text"
            dir="ltr"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="1">
          <v-icon class="ma-2" color="#FF1744"> mdi-lock </v-icon>
        </v-col>
        <v-col cols="11">
          <v-text-field
            v-model="password"
            :rules="[required]"
            class="mb-4"
            clearable
            label="رمز ورود"
            type="password"
            dir="ltr"
          ></v-text-field>
        </v-col>
      </v-row>

      <v-btn
        :disabled="!form"
        block
        color="success"
        size="large"
        type="submit"
        variant="elevated"
      >
        ورود
      </v-btn>
    </v-form>
  </v-card>

  <Alert
    :msg="alertMsg"
    :activate="alertActivator"
    :timeout="alertTimeout"
    :color="alertColor"
  />
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { loginStore } from "@/stores/index";
import axios from "axios";
import Alert from "@/components/Alert.vue";

const APIUrl = "http://192.168.1.62:8000/";
// const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";s

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
// Variables
const store = loginStore();
const router = useRouter();
const form = ref(false);
const userName = ref(null);
const password = ref(null);
const alertMsg = ref("");
const alertActivator = ref(false);
const alertTimeout = ref(5000);
const alertColor = ref("error");
const radios = ref("شماره تلفن همراه");

function onSubmit() {
  const apiUrl = APIUrl + "api/account/login/";
  let param = {
    username: convertPersianNumberToLatin(userName.value),
    password: password.value,
    email: "",
  };

  axios
    .post(apiUrl, param)
    .then((response) => {
      store.login(response.data.key);
      router.push("/");
    })
    .catch((error) => {
      console.log("error from api", error);
      alertActivator.value = true;
      alertMsg.value = "رمز ورود یا شماره همراه اشتباه است";
    })
    .finally(() => {
      alertActivator.value = false;
    });
}

function required(v) {
  return !!v || "این فیلد الزامی است";
}
</script>
