<template>
  <v-col cols="12" xs="12" sm="12" md="8" lg="8">
    <v-sheet class="my-4 mx-2 pa-4 h-100" rounded="lg" elevation="12" height="100%">
      <v-btn
        class="text-none text-white"
        color="#E65100"
        rounded="0"
        variant="flat"
        @click="addMenuDialog = true"
      >
        <v-icon> mdi-plus </v-icon>
        اضافه کردن منو شرکت
      </v-btn>
      <v-chip class="mt-4 mx-16 d-flex justify-center" color="success">
        <span class="text-h5">منو شرکت</span>
      </v-chip>

      <div class="text-center mt-2" dir="rtl">
        <v-table density="compact">
          <thead>
            <tr style="background-color: indigo">
              <th class="text-center" style="color: white">روز و تاریخ</th>
              <th class="text-center" style="color: white">غذا نوع ۱</th>
              <th class="text-center" style="color: white">غذا نوع ۲</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, i) in desserts"
              :key="i"
              :style="{ 'background-color': i % 2 === 0 ? '#FFF3E0' : '#E1F5FE' }"
            >
              <td>
                {{ weekDaysDict(item.week_day) }}
                <br />
                {{ persianDateFrameDict(item.date) }}
              </td>
              <td>{{ item.first_type?.kitchen_food?.food?.title }}</td>
              <td>{{ item.second_type?.kitchen_food?.food?.title }}</td>
            </tr>
          </tbody>
        </v-table>
      </div>
    </v-sheet>
  </v-col>
  <v-dialog
    v-model="addMenuDialog"
    persistent
    :width="device === 'mobile' ? '100%' : '50%'"
  >
    <v-card dir="rtl">
      <v-card-title>
        <v-chip class="mt-4 mx-16 d-flex justify-center" color="success">
          <span class="text-h5">افزودن منو </span>
        </v-chip>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row align="center" justify="center">
            <v-col cols="12">
              انتخاب تاریخ:
              <br />
              <date-picker
                class="ma-2"
                v-model="menuDate"
                format="YYYY-MM-DD"
                display-format="jYYYY-jMM-jDD"
              />
            </v-col>
            <v-col v-if="menuDate" cols="12">
              انتخاب منو :
              <br />
              <span v-if="kitchenFoods.length < 1">
                در این تاریخ از جانب آشپزخانه ها هنوز منو تعریف نشده است.
              </span>
              <v-chip
                class="ma-2 d-flex justify-center"
                v-for="(item, i) in kitchenFoods"
                :key="i"
                :color="item.isSelected ? 'success' : 'error'"
                @click="updateMenu(item)"
              >
                {{ item.kitchen_food.food.title }}
                {{ item.isSelected ? "(انتخاب شده)" : "(انتخاب نشده)" }}
              </v-chip>
            </v-col>
            <span v-else class="text-center">لطفا ابتدا تاریخ را مشخص کنید.</span>

            <!-- <v-col cols="12">
              <v-select
                v-model="menuFirstTypeFood"
                :items="kitchenFoods"
                item-title="kitchen_food.food.title"
                item-value="id"
                label="غذا نوع ۱"
                chips
                clearable
                color="blue"
              ></v-select>
            </v-col>
            <v-col cols="12">
              <v-select
                v-model="menuSecondTypeFood"
                :items="kitchenFoods"
                item-title="kitchen_food.food.title"
                item-value="id"
                label="غذا نوع ۲"
                chips
                clearable
                color="blue"
              ></v-select>
            </v-col> -->
          </v-row>
        </v-container>
        <!-- <small style="color: red">موارد الزامی با * مشخص شده است</small> -->
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          variant="text"
          style="margin: 10px; color: rgb(0, 0, 0); background-color: rgb(255, 60, 0)"
          @click="addMenuDialog = false"
        >
          لغو
        </v-btn>

        <v-btn
          variant="text"
          style="margin: 10px; color: rgb(3, 3, 3); background-color: rgb(0, 255, 0)"
          @click="createMenuForCompany"
        >
          ثبت
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";

const store = breakPointsStore();

const device = ref(store.device);

const props = defineProps({
  company: {
    type: Number,
    // default: false,
  },
});
// Variables
const tab = ref(null);
const desserts = ref([]);
const menuDate = ref(null);
const addMenuDialog = ref(false);
const kitchenFoods = ref([
  {
    kitchen_food: { food: { title: "ابتدا تاریخ را وارد کنید" } },
  },
]);
const menuFirstTypeFood = ref(null);
const menuSecondTypeFood = ref(null);
const JalaliDate = {
  g_days_in_month: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
  j_days_in_month: [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29],
};
function jalaliToGregorian(j_y, j_m, j_d) {
  j_y = parseInt(j_y);
  j_m = parseInt(j_m);
  j_d = parseInt(j_d);
  var jy = j_y - 979;
  var jm = j_m - 1;
  var jd = j_d - 1;

  var j_day_no = 365 * jy + parseInt(jy / 33) * 8 + parseInt(((jy % 33) + 3) / 4);
  for (var i = 0; i < jm; ++i) j_day_no += JalaliDate.j_days_in_month[i];

  j_day_no += jd;

  var g_day_no = j_day_no + 79;

  var gy =
    1600 +
    400 * parseInt(g_day_no / 146097); /* 146097 = 365*400 + 400/4 - 400/100 + 400/400 */
  g_day_no = g_day_no % 146097;

  var leap = true;
  if (g_day_no >= 36525) {
    /* 36525 = 365*100 + 100/4 */ g_day_no--;
    gy += 100 * parseInt(g_day_no / 36524); /* 36524 = 365*100 + 100/4 - 100/100 */
    g_day_no = g_day_no % 36524;

    if (g_day_no >= 365) g_day_no++;
    else leap = false;
  }

  gy += 4 * parseInt(g_day_no / 1461); /* 1461 = 365*4 + 4/4 */
  g_day_no %= 1461;

  if (g_day_no >= 366) {
    leap = false;

    g_day_no--;
    gy += parseInt(g_day_no / 365);
    g_day_no = g_day_no % 365;
  }

  for (var i = 0; g_day_no >= JalaliDate.g_days_in_month[i] + (i == 1 && leap); i++)
    g_day_no -= JalaliDate.g_days_in_month[i] + (i == 1 && leap);
  var gm = i + 1;
  var gd = g_day_no + 1;

  gm = gm < 10 ? "0" + gm : gm;
  gd = gd < 10 ? "0" + gd : gd;

  return [gy, gm, gd];
}
function getListOfFoods(date, kitchen) {
  // بک اند باید کترینگ طرف قرارداد شرکت را در user_companies بدهد
  axios
    .get(
      "https://makacenter.ir/company/active-foods/?date=" + date + "&kitchen=" + kitchen
    )
    .then((response) => {
      kitchenFoods.value = [];
      for (let i = 0; i < response.data.results.length; i++) {
        console.log(response.data.results[i].date);

        const dateSplitted = response.data.results[i].date.split("-");
        console.log(response.data.results[i].date);
        const jD = jalaliToGregorian(dateSplitted[0], dateSplitted[1], dateSplitted[2]);
        const jResult = jD[0] + "-" + jD[1] + "-" + jD[2];

        if (jResult === date) {
          response.data.results[i].isSelected = false;
          kitchenFoods.value.push(response.data.results[i]);
        }
      }
      // if (kitchenFoods.value.length < 1) {
      //   kitchenFoods.value.push({
      //     kitchen_food: {
      //       food: { title: "در این تاریخ از جانب آشپزخانه ها هنوز منو تعریف نشده است." },
      //     },
      //   });
      // }

      for (let i = 0; i < kitchenFoods.value.length; i++) {
        kitchenFoods.value[i].isSelected = false;
      }
      console.log("kitchenFoods.value", kitchenFoods.value);
    });
}
watch(
  () => menuDate.value,
  () => {
    if (menuDate.value) {
      getListOfFoods(menuDate.value, 1);
    }
  }
);
function readMenuOfCompany() {
  console.log("GGGGGGGGGGGGGG");
  axios
    .get("https://makacenter.ir/company/" + props.company + "/company-menu-for-member/")
    .then((response) => {
      console.log(response.data);
      desserts.value = response.data.results;
    })
    .catch((error) => {
      console.log(error);
    });
}
const selectedMenus = ref([]);
function updateMenu(item) {
  selectedMenus.value = [];
  for (let i = 0; i < kitchenFoods.value.length; i++) {
    if (kitchenFoods.value[i].id === item.id) {
      kitchenFoods.value[i].isSelected = !kitchenFoods.value[i].isSelected;
    }

    if (kitchenFoods.value[i].isSelected) {
      selectedMenus.value.push(kitchenFoods.value[i]);
    }

    console.log(selectedMenus.value, "5555555555555555");
  }
}
function createMenuForCompany() {
  const body = {
    date: menuDate.value,
    company: props.company,
    first_type: selectedMenus?.value[0]?.id,
    second_type: selectedMenus?.value[1]?.id,
    third_type: null,
  };
  axios
    .post("https://makacenter.ir/company/menu/", body)
    .then((response) => {
      console.log(response);
      menuDate.value = null;
      menuFirstTypeFood.value = null;
      menuSecondTypeFood.value = null;
      addMenuDialog.value = false;
      readMenuOfCompany();
    })
    .catch((error) => {
      console.log(error);
    });
}
function weekDaysDict(day) {
  if (day === "Saturday") return "شنبه";
  else if (day === "Sunday") return "یکشنبه";
  else if (day === "Monday") return "دوشنبه";
  else if (day === "Tuesday") return "سه شنبه";
  else if (day === "Wednesday") return "چهارشنبه";
  else if (day === "Thursday") return "پنج شنبه";
  else if (day === "Friday") return "جمعه";
}
function persianDateFrameDict(enNumber = "") {
  let n = "";
  for (let i = 0; i < enNumber.length; i++) {
    if (enNumber[i] === "0") n += "۰";
    else if (enNumber[i] === "1") n += "۱";
    else if (enNumber[i] === "2") n += "۲";
    else if (enNumber[i] === "3") n += "۳";
    else if (enNumber[i] === "4") n += "۴";
    else if (enNumber[i] === "5") n += "۵";
    else if (enNumber[i] === "6") n += "۶";
    else if (enNumber[i] === "7") n += "۷";
    else if (enNumber[i] === "8") n += "۸";
    else if (enNumber[i] === "9") n += "۹";
    else n += enNumber[i];
  }
  const y = n.substring(0, 4);
  const m = n.substring(5, 7);
  const d = n.substring(8, 10);

  return y + "/" + m + "/" + d;
}
onMounted(() => {
  readMenuOfCompany();
  // getListOfFoods();
});
</script>
