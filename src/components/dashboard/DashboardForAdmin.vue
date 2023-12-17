<template>
  <v-app-bar v-if="device === 'mobile'" color="#C51162" app dir="rtl">
    <v-btn stacked>
      <v-icon icon="mdi-comment-check" color="white"></v-icon>
      <span> خوش آمدید </span>
    </v-btn>
  </v-app-bar>
  <v-col cols="12" xs="12" sm="12" md="8" lg="8">
    <v-card rounded="lg" elevation="12">
      <v-card>
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
                    width="150"
                    :color="obj.color"
                    rounded
                    @click="openModal(obj)"
                  >
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
  <!-- input excel -->
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
          <div style="font-size: 1.5em">وارد کردن فایل اکسل قالی ها</div>
        </v-card>
        <v-locale-provider rtl>
          <v-file-input
            v-model="metaDataFile"
            class="justify-center mt-12 mx-4"
            label="انتخاب فایل اکسل"
            variant="filled"
            prepend-icon="mdi-file-excel"
            accept=".xlsx"
            @change="convert"
          ></v-file-input>
        </v-locale-provider>

        <v-container class="text-center">
          <v-row align="center" justify="center">
            <v-col>
              <v-btn
                :disabled="!metaDataFile"
                height="48"
                width="50%"
                color="success"
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

  <!-- open transfers list -->
  <v-dialog
    v-model="openTransfersDialog"
    persistent
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="openTransfersDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card
          :width="device === 'mobile' ? '100%' : '30%'"
          class="my-4 mx-auto d-flex justify-center text-center pa-2"
          color="warning"
        >
          <div style="font-size: 1.3em">لیست نقل و انتقالات تایید نشده</div>
        </v-card>
        <v-row v-if="device === 'mobile'">
          <v-col cols="12">
            <v-card
              class="cart"
              :style="{ height: windowHeight2 + 'px', overflow: 'auto' }"
            >
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.3em">شناسه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.3em">وضعیت</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.3em">تایید؟</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in openTransfers"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#BDBDBD' : '#FAFAFA' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1.2em">{{ item?.id }}</div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1.2em">
                        {{ item?.status?.title ? item?.status?.title : null }}
                      </div>
                      <br />
                      <v-btn
                        height="40"
                        width="100%"
                        color="yellow"
                        @click="showOpenTransferDetail(item?.id, true)"
                        style="cursor: pointer"
                      >
                        جزییات
                      </v-btn>
                    </td>
                    <td>
                      <v-btn
                        class="flex-grow-1"
                        height="30"
                        width="70"
                        variant="tonal"
                        @click="acceptTransfer(true, item?.id)"
                      >
                        تایید
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
        <v-row v-else>
          <v-col cols="12">
            <v-card
              class="cart"
              :style="{ height: windowHeight2 + 'px', overflow: 'auto' }"
            >
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.2em">ردیف</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">وضعیت</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">کارگر</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">تاریخ</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">سرویس کار</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">سرویس ها</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">فرش ها</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">تایید؟</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in openTransfers"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#BDBDBD' : '#FAFAFA' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1em">{{ ++i }}</div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">
                        {{ item?.status?.title }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{
                          item?.worker?.first_name
                            ? item?.worker?.first_name + " " + item?.worker?.last_name
                            : "ثبت نشده"
                        }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{
                          convertPersianNumberToLatin(
                            gregorian_to_jalali(
                              Number(item?.date.substr(0, 4)),
                              Number(item?.date.substr(5, 2)),
                              Number(item?.date.substr(8, 2))
                            )
                          )
                        }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{
                          item?.serviceProvider?.first_name
                            ? item?.serviceProvider?.first_name +
                              " " +
                              item?.serviceProvider?.last_name
                            : "ثبت نشده"
                        }}
                      </div>
                    </td>
                    <td>
                      <div v-if="item?.services.length > 0">
                        <div
                          v-for="(service, i) in item?.services"
                          :key="i"
                          style="font-size: 1em"
                        >
                          {{ service?.title }} <br />
                        </div>
                      </div>
                      <div v-else style="font-size: 1em">ثبت نشده <br /></div>
                    </td>
                    <td class="pa-2">
                      <div v-if="item?.carpets.length > 0">
                        <v-icon color="#FF1744" @click="fillTransferCarpets2(item?.id)">
                          mdi-eye
                        </v-icon>
                      </div>
                      <div v-else style="font-size: 1em">ثبت نشده <br /></div>
                    </td>
                    <td>
                      <v-btn
                        class="ma-2"
                        height="30"
                        width="70"
                        color="black"
                        @click="acceptTransfer(true, item?.id)"
                      >
                        تایید
                      </v-btn>
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

  <!-- detailOpenTransferDialog -->
  <v-dialog
    v-model="detailOpenTransferDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="detailOpenTransferDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <div style="font-size: 1.7em">جزییات نقل و انتقال</div>
        </v-card>
        <v-list>
          <v-list-item
            v-for="(item, key) in openTransfer"
            :key="key"
            :value="item"
            color="white"
            rounded="xl"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div v-if="key === 'id'" style="font-size: 1.4em">شناسه: {{ item }}</div>
            <div v-else-if="key === 'date'" style="font-size: 1.4em">
              تاریخ: {{ convertGDateToJalali(item) }}
            </div>
            <div v-else-if="key === 'worker'" style="font-size: 1.4em">
              کارگر: {{ item?.first_name + " " + item?.last_name }}
            </div>
            <div v-else-if="key === 'serviceProvider'" style="font-size: 1.4em">
              سرویس کار: {{ item?.first_name + " " + item?.last_name }}
            </div>
            <div v-else-if="key === 'status'" style="font-size: 1.4em">
              وضعیت: {{ item?.title }}
            </div>
            <div v-else-if="key === 'carpets'" style="font-size: 1.4em">
              فرش ها:
              <br />
              <div v-for="(carpet, i) in item" :key="i">{{ carpet?.barcode }} <br /></div>
            </div>
            <div v-else-if="key === 'services'" style="font-size: 1.4em">
              سرویس ها:
              <br />
              <div v-for="(service, i) in item" :key="i">{{ service?.title }} <br /></div>
            </div>

            <!-- <v-list-item-title v-text="item?.status?.title"></v-list-item-title> -->
          </v-list-item>
        </v-list>
        <v-container class="text-center">
          <v-row align="center" justify="center">
            <v-col>
              <v-btn
                class="flex-grow-1"
                height="30"
                width="70"
                variant="tonal"
                @click="acceptTransfer(false, null)"
              >
                تایید
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-responsive>
    </v-card>
  </v-dialog>

  <!-- carpets list -->
  <v-dialog
    v-model="carpetListDialog"
    persistent
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="carpetListDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card
          :width="device === 'mobile' ? '100%' : '40%'"
          class="my-4 mx-auto d-flex justify-center text-center pa-2"
          color="warning"
        >
          <div style="font-size: 1.3em">لیست قالی ها</div>
        </v-card>

        <v-row v-if="device === 'mobile'">
          <v-col cols="12">
            <v-card
              class="cart"
              :style="{ height: windowHeight2 + 'px', overflow: 'auto' }"
            >
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.3em">بارکد</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.3em">کارخانه</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in carpetList" :key="i" class="text-center">
                    <td class="pa-2">
                      <div style="font-size: 1.2em">{{ item?.barcode }}</div>
                      <br />
                      <v-btn
                        height="40"
                        width="100%"
                        color="yellow"
                        @click="showCarpetDetail(item?.id)"
                        style="cursor: pointer"
                      >
                        مشاهده جزییات
                      </v-btn>
                    </td>
                    <td>
                      <div style="font-size: 1.2em">{{ item?.factory }}</div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-card
              class="cart"
              :style="{ height: windowHeight2 + 'px', overflow: 'auto' }"
            >
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.2em">ردیف</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">بارکد</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">کارخانه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">کد نقشه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">اندازه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">رنگ</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">مشتری</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">شکل هندسی</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in carpetList"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#BDBDBD' : '#FAFAFA' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1em">{{ ++i }}</div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">{{ item?.barcode }}</div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{ item?.factory }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">{{ item?.map_code }}</div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{ item?.size }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{ item?.color }}
                      </div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">
                        {{ item?.costumer_name }}
                      </div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">
                        {{ item?.kind ? item?.kind : "ثبت نشده" }}
                      </div>
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

  <!-- detailCarpetDialog -->
  <v-dialog
    v-model="detailCarpetDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="detailCarpetDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <div style="font-size: 1.7em">جزییات فرش</div>
        </v-card>
        <v-list>
          <v-list-item
            v-for="(item, key) in carpet"
            :key="key"
            :value="item"
            color="white"
            rounded="xl"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div v-if="key === 'id'" style="font-size: 1.4em">شناسه: {{ item }}</div>
            <div v-else-if="key === 'barcode'" style="font-size: 1.4em">
              بارکد: {{ item }}
            </div>
            <div v-else-if="key === 'color'" style="font-size: 1.4em">
              رنگ: {{ item }}
            </div>
            <div v-else-if="key === 'costumer_name'" style="font-size: 1.4em">
              مشتری: {{ item }}
            </div>
            <div v-else-if="key === 'map_code'" style="font-size: 1.4em">
              کد نقشه: {{ item }}
            </div>
            <div v-else-if="key === 'size'" style="font-size: 1.4em">
              اندازه: {{ item }}
            </div>
            <div v-else-if="key === 'factory'" style="font-size: 1.4em">
              کارخانه: {{ item }}
            </div>
          </v-list-item>
        </v-list>
      </v-responsive>
    </v-card>
  </v-dialog>

  <!-- all transfers list -->
  <v-dialog
    v-model="allTransfersDialog"
    persistent
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card class="pa-2 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-row align="center" justify="center">
          <v-col cols="2">
            <v-chip outline @click="allTransfersDialog = false">
              <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
            </v-chip>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="4">
            <v-card
              class="cart mx-auto my-1 text-center pa-2"
              :width="device === 'mobile' ? '100%' : '100%'"
              elevation="12"
            >
              <div style="font-size: 1.3em">لیست نقل و انتقالات</div>
            </v-card>
          </v-col>
          <v-col cols="2" v-if="device !== 'mobile'">
            <v-btn
              :disabled="!statisticsBtn"
              height="40"
              width="100%"
              color="primary"
              rounded
              @click="calculateArea"
              style="cursor: pointer"
            >
              <v-icon class="ml-1" color="yellow">mdi-chart-donut-variant</v-icon>
              گزارش فیلتر
            </v-btn>
          </v-col>
          <v-col cols="2" v-if="device !== 'mobile'">
            <v-btn
              :disabled="!statisticsBtn"
              height="40"
              width="100%"
              color="error"
              rounded
              @click="getAllTransfers"
              style="cursor: pointer"
            >
              <v-icon class="ml-1" color="yellow">mdi-filter-remove-outline</v-icon>
              پاک کردن فیلترها
            </v-btn>
          </v-col>
          <v-col cols="12">
            <v-row v-if="device !== 'mobile'" align="center" justify="center">
              <v-col cols="2" align="center" justify="center">
                <v-btn
                  height="40"
                  width="100%"
                  color="#000000"
                  @click="openFilterDialog('status')"
                  style="cursor: pointer"
                  rounded
                >
                  فیلتر وضعیت
                </v-btn>

                <v-card width="100%" class="my-1" color="teal">
                  <div v-if="filteredStatusStand">
                    <span>{{ filteredStatusStand }}</span>
                    <v-icon @click="cleanFilter('status')">mdi-close</v-icon>
                  </div>
                  <div v-else>
                    <span>خالی</span>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="2" align="center" justify="center">
                <v-btn
                  height="40"
                  width="100%"
                  color="#000000"
                  @click="openFilterDialog('worker')"
                  style="cursor: pointer"
                  rounded
                >
                  فیلتر کارگر
                </v-btn>
                <v-card width="100%" class="my-1" color="teal">
                  <div v-if="filteredWorkerStand">
                    <span>{{ filteredWorkerStand }}</span>
                    <v-icon @click="cleanFilter('worker')">mdi-close</v-icon>
                  </div>
                  <div v-else>
                    <span>خالی</span>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="2" align="center" justify="center">
                <v-btn
                  height="40"
                  width="100%"
                  color="#000000"
                  @click="openFilterDialog('date')"
                  style="cursor: pointer"
                  rounded
                >
                  فیلتر تاریخ
                </v-btn>
                <v-card width="100%" class="my-1" color="teal">
                  <div v-if="filteredStartDateStand && filteredEndDateStand">
                    از:
                    <span>{{
                      convertPersianNumberToLatin(
                        gregorian_to_jalali(
                          Number(filteredStartDateStand.substr(0, 4)),
                          Number(filteredStartDateStand.substr(5, 2)),
                          Number(filteredStartDateStand.substr(8, 2))
                        )
                      )
                    }}</span>
                    تا:
                    <span>
                      {{
                        convertPersianNumberToLatin(
                          gregorian_to_jalali(
                            Number(filteredEndDateStand.substr(0, 4)),
                            Number(filteredEndDateStand.substr(5, 2)),
                            Number(filteredEndDateStand.substr(8, 2))
                          )
                        )
                      }}</span
                    >
                    <v-icon @click="cleanFilter('date')">mdi-close</v-icon>
                  </div>
                  <div v-else>
                    <span>خالی</span>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="2" align="center" justify="center">
                <v-btn
                  height="40"
                  width="100%"
                  color="#000000"
                  @click="openFilterDialog('serviceProvider')"
                  style="cursor: pointer"
                  rounded
                >
                  فیلتر سرویس کار
                </v-btn>
                <v-card width="100%" class="my-1" color="teal">
                  <div v-if="filteredServiceProviderStand">
                    <span>{{ filteredServiceProviderStand }}</span>
                    <v-icon @click="cleanFilter('serviceProvider')">mdi-close</v-icon>
                  </div>
                  <div v-else>
                    <span>خالی</span>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="2" align="center" justify="center">
                <v-btn
                  height="40"
                  width="100%"
                  color="#000000"
                  @click="openFilterDialog('service')"
                  style="cursor: pointer"
                  rounded
                >
                  فیلتر سرویس
                </v-btn>
                <v-card width="100%" class="my-1" color="teal">
                  <div v-if="filteredServiceStand">
                    <span>{{ filteredServiceStand }}</span>
                    <v-icon @click="cleanFilter('service')">mdi-close</v-icon>
                  </div>
                  <div v-else>
                    <span>خالی</span>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="2" align="center" justify="center">
                <v-btn
                  height="40"
                  width="100%"
                  color="#000000"
                  @click="openFilterDialog('carpet')"
                  style="cursor: pointer"
                  rounded
                >
                  فیلتر فرش
                </v-btn>
                <v-card width="100%" class="my-1" color="teal">
                  <div
                    v-if="
                      filteredBarcodeStand ||
                      filteredColorStand ||
                      filteredFactoryStand ||
                      filteredSizeStand ||
                      filteredMapCodeStand ||
                      filteredCostumerStand
                    "
                  >
                    <v-btn
                      class="ma-1"
                      height="30"
                      width="80%"
                      color="yellow"
                      @click="carpetFiltersDialog = true"
                      style="cursor: pointer"
                    >
                      مشاهده
                    </v-btn>
                    <v-icon @click="cleanFilter('carpet')">mdi-close</v-icon>
                  </div>
                  <div v-else>
                    <span>خالی</span>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row v-if="device === 'mobile'">
          <v-col cols="12">
            <v-card
              class="cart"
              :style="{ height: windowHeight + 'px', overflow: 'auto' }"
            >
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.3em">شناسه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.3em">وضعیت</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.3em">جزییات</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in allTransfers"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#3F51B5' : '#004D40' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1.2em">{{ item?.id }}</div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1.2em">{{ item?.status?.title }}</div>
                    </td>
                    <td>
                      <v-btn
                        height="40"
                        width="50%"
                        color="yellow"
                        @click="showAllTransferDetail(item?.id)"
                        style="cursor: pointer"
                      >
                        جزییات
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-card
              class="cart mx-2"
              elevation="24"
              :style="{ height: windowHeight + 'px', overflow: 'auto' }"
            >
              <v-table density="compact">
                <thead>
                  <tr style="color: red; background-color: black">
                    <th class="text-center">
                      <div style="font-size: 1.2em">ردیف</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">وضعیت</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">کارگر</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">تاریخ</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">سرویس کار</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">سرویس ها</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">فرش ها</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in allTransfers"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#BDBDBD' : '#FAFAFA' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1em">{{ ++i }}</div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">
                        {{ item?.status?.title }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{
                          item?.worker?.first_name
                            ? item?.worker?.first_name + " " + item?.worker?.last_name
                            : "ثبت نشده"
                        }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{
                          convertPersianNumberToLatin(
                            gregorian_to_jalali(
                              Number(item?.date.substr(0, 4)),
                              Number(item?.date.substr(5, 2)),
                              Number(item?.date.substr(8, 2))
                            )
                          )
                        }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{
                          item?.serviceProvider?.first_name
                            ? item?.serviceProvider?.first_name +
                              " " +
                              item?.serviceProvider?.last_name
                            : "ثبت نشده"
                        }}
                      </div>
                    </td>
                    <td>
                      <div v-if="item?.services.length > 0">
                        <div
                          v-for="(service, i) in item?.services"
                          :key="i"
                          style="font-size: 1em"
                        >
                          {{ service?.title }} <br />
                        </div>
                      </div>
                      <div v-else style="font-size: 1em">ثبت نشده <br /></div>
                    </td>
                    <td class="pa-2">
                      <div v-if="item?.carpets.length > 0">
                        <!-- <v-btn
                          height="30"
                          width="50"
                          color="#FF1744"
                          @click="fillTransferCarpets(item?.id)"
                          style="cursor: pointer"
                        > -->
                        <v-icon color="#FF1744" @click="fillTransferCarpets(item?.id)">
                          mdi-eye
                        </v-icon>
                        <!-- </v-btn> -->
                      </div>
                      <div v-else style="font-size: 1em">ثبت نشده <br /></div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>
        <div class="text-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="12">
                <v-container class="max-width">
                  <v-pagination
                    v-model="transferPage"
                    :length="pageCount"
                    @click="switchTransferPage"
                  ></v-pagination>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </v-responsive>
    </v-card>
  </v-dialog>

  <!-- transfer carpets -->
  <v-dialog
    v-model="transferCarpetsDialog"
    persistent
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="transferCarpetsDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card
          :width="device === 'mobile' ? '100%' : '40%'"
          class="my-4 mx-auto d-flex justify-center text-center pa-2"
          color="warning"
        >
          <div style="font-size: 1.3em">لیست قالی های انتقال</div>
        </v-card>

        <v-row>
          <v-col cols="12">
            <v-card
              class="cart"
              :style="{ height: windowHeight2 + 'px', overflow: 'auto' }"
            >
              <v-table density="compact">
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.2em">ردیف</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">بارکد</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">کارخانه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">کد نقشه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">اندازه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">رنگ</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">مشتری</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">شکل هندسی</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in transferCarpets"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#BDBDBD' : '#FAFAFA' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1em">
                        {{ ++i }}
                      </div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">{{ item?.barcode }}</div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{ item?.factory }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">{{ item?.map_code }}</div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{ item?.size }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{ item?.color }}
                      </div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">
                        {{ item?.costumer_name }}
                      </div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">
                        {{ item?.kind }}
                      </div>
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

  <!-- detailAllTransferDialog -->
  <v-dialog
    v-model="detailAllTransferDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="detailAllTransferDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span style="font-size: 1.7em"> جزییات نقل و انتقال </span>
        </v-card>
        <v-list>
          <v-list-item
            v-for="(item, key) in transfer"
            :key="key"
            :value="item"
            color="white"
            rounded="xl"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div v-if="key === 'id'" style="font-size: 1.4em">شناسه: {{ item }}</div>
            <div v-else-if="key === 'date'" style="font-size: 1.4em">
              تاریخ: {{ convertGDateToJalali(item) }}
            </div>
            <div v-else-if="key === 'worker'" style="font-size: 1.4em">
              کارگر: {{ item?.first_name + " " + item?.last_name }}
            </div>
            <div v-else-if="key === 'serviceProvider'" style="font-size: 1.4em">
              سرویس کار: {{ item?.first_name + " " + item?.last_name }}
            </div>
            <div v-else-if="key === 'status'" style="font-size: 1.4em">
              وضعیت: {{ item?.title }}
            </div>
            <div v-else-if="key === 'carpets'" style="font-size: 1.4em">
              فرش ها:
              <br />
              <div v-for="(carpet, i) in item" :key="i">{{ carpet?.barcode }} <br /></div>
            </div>
            <div v-else-if="key === 'services'" style="font-size: 1.4em">
              سرویس ها:
              <br />
              <div v-for="(service, i) in item" :key="i">{{ service?.title }} <br /></div>
            </div>
          </v-list-item>
        </v-list>
      </v-responsive>
    </v-card>
  </v-dialog>

  <!-- filters dialogs -->
  <v-dialog
    v-model="filterDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="cleanNoAcceptFilters">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>
      </v-responsive>

      <v-responsive align="center" justify="center">
        <div v-if="filterType === 'worker'">
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span style="font-size: 1.7em">فیلتر کارگر</span>
          </v-card>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredWorker"
              :items="workerList"
              color="blue-grey-lighten-2"
              :item-title="(item) => item?.first_name + ' ' + item?.last_name"
              label="انتخاب کارگر"
              clearable
              dir="rtl"
              chips
              closable-chips
              return-object
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-btn
            :disabled="!filteredWorker"
            height="40"
            width="50%"
            color="yellow"
            @click="filter()"
            style="cursor: pointer"
          >
            ثبت
          </v-btn>
        </div>
        <div v-if="filterType === 'serviceProvider'">
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span style="font-size: 1.7em">فیلتر سرویس کار</span>
          </v-card>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredServiceProvider"
              :items="serviceProviders"
              color="blue-grey-lighten-2"
              :item-title="(item) => item?.first_name + ' ' + item?.last_name"
              label="انتخاب سرویس کار"
              clearable
              dir="rtl"
              chips
              closable-chip
              return-object
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-btn
            :disabled="!filteredServiceProvider"
            height="40"
            width="50%"
            color="yellow"
            @click="filter()"
            style="cursor: pointer"
          >
            ثبت
          </v-btn>
        </div>
        <div v-if="filterType === 'service'">
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span style="font-size: 1.7em">فیلتر سرویس</span>
          </v-card>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredService"
              :items="servicesList"
              color="blue-grey-lighten-2"
              item-title="title"
              label="انتخاب سرویس"
              clearable
              dir="rtl"
              chips
              closable-chip
              return-object
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-btn
            :disabled="!filteredService"
            height="40"
            width="50%"
            color="yellow"
            @click="filter()"
            style="cursor: pointer"
          >
            ثبت
          </v-btn>
        </div>
        <div v-if="filterType === 'carpet'">
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span style="font-size: 1.7em">فیلتر فرش</span>
          </v-card>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredBarcode"
              :items="carpetsBarcodes"
              color="blue-grey-lighten-2"
              label="انتخاب بارکد"
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredColor"
              :items="carpetsColors"
              color="blue-grey-lighten-2"
              label="انتخاب رنگ "
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredFactory"
              :items="carpetsFactorys"
              color="blue-grey-lighten-2"
              label="انتخاب کارخانه "
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredCostumer"
              :items="carpetsCostumers"
              color="blue-grey-lighten-2"
              label="انتخاب مشتری "
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredSize"
              :items="carpetsSizes"
              color="blue-grey-lighten-2"
              label="انتخاب اندازه "
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredMapCode"
              :items="carpetsMapCodes"
              color="blue-grey-lighten-2"
              label="انتخاب کد نقشه "
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-btn
            :disabled="
              !filteredBarcode &&
              !filteredColor &&
              !filteredFactory &&
              !filteredSize &&
              !filteredMapCode &&
              !filteredCostumer
            "
            height="40"
            width="50%"
            color="yellow"
            @click="filter()"
            style="cursor: pointer"
          >
            ثبت
          </v-btn>
        </div>
        <div v-if="filterType === 'date'">
          <v-card class="my-4 d-flex justify-center text-center pa-2" color="warning">
            <span style="font-size: 1.7em">فیلتر تاریخ</span>
          </v-card>
          تاریخ شروع
          <br />
          <date-picker
            class="ma-2"
            v-model="filteredStartDate"
            format="YYYY-MM-DD"
            display-format="jYYYY-jMM-jDD"
            style="color: #e65100"
          />
          <br />
          تاریخ پایان
          <br />

          <date-picker
            class="ma-2"
            v-model="filteredEndDate"
            format="YYYY-MM-DD"
            display-format="jYYYY-jMM-jDD"
            style="color: #e65100"
          />
          <v-btn
            class="mt-8"
            :disabled="!filteredStartDate || !filteredEndDate"
            height="40"
            width="50%"
            color="yellow"
            @click="filter()"
            style="cursor: pointer"
          >
            ثبت
          </v-btn>
        </div>
        <div v-if="filterType === 'status'">
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span style="font-size: 1.7em">فیلتر وضعیت</span>
          </v-card>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredStatus"
              :items="statuses"
              color="blue-grey-lighten-2"
              item-title="title"
              label="انتخاب وضعیت"
              clearable
              dir="rtl"
              chips
              closable-chips
              return-object=""
            >
            </v-autocomplete>
          </v-locale-provider>
          <v-btn
            :disabled="!filteredStatus"
            height="40"
            width="50%"
            color="yellow"
            @click="filter()"
            style="cursor: pointer"
          >
            ثبت
          </v-btn>
        </div>
      </v-responsive>
    </v-card>
  </v-dialog>

  <!-- carpet filters dialog -->
  <v-dialog
    v-model="carpetFiltersDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="carpetFiltersDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
          <span style="font-size: 1.7em">فیلترهای فرش</span>
        </v-card>
        <v-list>
          <v-list-item v-if="filteredBarcode" color="white" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div style="font-size: 1.4em">
              بارکد: {{ filteredBarcode }}
              <v-icon @click="filteredBarcode = null">mdi-close</v-icon>
            </div>
          </v-list-item>
          <v-list-item v-if="filteredColor" color="white" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div style="font-size: 1.4em">
              رنگ: {{ filteredColor }}
              <v-icon @click="filteredColor = null">mdi-close</v-icon>
            </div>
          </v-list-item>
          <v-list-item v-if="filteredFactory" color="white" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div style="font-size: 1.4em">
              کارخانه: {{ filteredFactory }}
              <v-icon @click="filteredFactory = null">mdi-close</v-icon>
            </div>
          </v-list-item>
          <v-list-item v-if="filteredSize" color="white" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div style="font-size: 1.4em">
              اندازه: {{ filteredSize }}
              <v-icon @click="filteredSize = null">mdi-close</v-icon>
            </div>
          </v-list-item>
          <v-list-item v-if="filteredMapCode" color="white" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div style="font-size: 1.4em">
              کد نقشه: {{ filteredMapCode }}
              <v-icon @click="filteredMapCode = null">mdi-close</v-icon>
            </div>
          </v-list-item>
          <v-list-item v-if="filteredCostumer" color="white" rounded="xl">
            <template v-slot:prepend>
              <v-icon icon="mdi-checkbox-marked" color="#1DE9B6"></v-icon>
            </template>
            <div style="font-size: 1.4em">
              مشتری: {{ filteredCostumer }}
              <v-icon @click="filteredCostumer = null">mdi-close</v-icon>
            </div>
          </v-list-item>
        </v-list>
      </v-responsive>
    </v-card>
  </v-dialog>

  <!-- add statistics -->
  <v-dialog
    v-model="addStatisticsDialog"
    persistent
    transition="dialog-bottom-transition"
    :fullscreen="device !== 'desktop' && device !== 'large'"
    :width="device === 'desktop' || device === 'large' ? '50%' : '100%'"
  >
    <v-card theme="dark" class="pa-8 d-flex justify-center" dir="rtl">
      <v-chip style="width: 50px" outline @click="addStatisticsDialog = false">
        <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
      </v-chip>

      <v-card class="mt-4 text-center pa-2" color="warning">
        <span>اضافه کردن محاسبه</span>
      </v-card>
      <v-card
        class="cart my-2"
        width="100%"
        :style="{ height: 700 + 'px', overflow: 'auto' }"
      >
        <v-locale-provider rtl>
          <v-autocomplete
            class="mx-2"
            v-model="selectedService"
            :items="servicesList"
            color="blue-grey-lighten-2"
            item-title="title"
            item-value="id"
            label="انتخاب سرویس"
            clearable
            dir="rtl"
            chips
            closable-chips
            rounded
          >
          </v-autocomplete>
        </v-locale-provider>
        <v-row class="px-2" no-gutters>
          <v-col cols="12" md="6">
            <v-locale-provider rtl>
              <v-autocomplete
                class="mx-2"
                v-model="size"
                :items="sizes"
                color="blue-grey-lighten-2"
                item-title="title"
                label="انتخاب اندازه"
                clearable
                dir="rtl"
                chips
                closable-chips
                rounded
                @focus="getSizes"
              >
              </v-autocomplete>
            </v-locale-provider>
          </v-col>
          <v-col cols="12" md="6">
            <v-locale-provider rtl>
              <v-autocomplete
                class="mx-2"
                v-model="geometry"
                :items="kinds"
                color="blue-grey-lighten-2"
                item-title="title"
                label="انتخاب شکل هندسی"
                clearable
                dir="rtl"
                chips
                closable-chips
                rounded
                @focus="getKinds"
              >
              </v-autocomplete>
            </v-locale-provider>
          </v-col>
          <v-col cols="12" md="12">
            <v-locale-provider rtl>
              <v-text-field
                v-model="area"
                class="pa-2"
                color="primary"
                label="مساحت"
                rounded
              ></v-text-field>
            </v-locale-provider>
          </v-col>
        </v-row>

        <v-divider></v-divider>
        <div align="center" justify="center">
          <v-btn
            :disabled="!selectedService || !size || !geometry || !area"
            class="my-2"
            color="success"
            width="200"
            @click="addStatistics()"
          >
            <div>ذخیره</div>
          </v-btn>
        </div>
      </v-card>
    </v-card>
  </v-dialog>

  <!-- statistics -->
  <v-dialog
    v-model="statisticsListDialog"
    persistent
    transition="dialog-bottom-transition"
    fullscreen
  >
    <v-card class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="statisticsListDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card
          :width="device === 'mobile' ? '100%' : '40%'"
          class="my-4 mx-auto d-flex justify-center text-center pa-2"
          color="warning"
        >
          <div style="font-size: 1.3em">آمار</div>
        </v-card>
        <v-row>
          <v-col cols="12">
            <v-card
              class="cart"
              :style="{ height: windowHeight2 + 'px', overflow: 'auto' }"
            >
              <v-table density="compact" v-if="statistics.length > 0">
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.2em">ردیف</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">سرویس</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">مساحت</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.2em">تعداد قالی ها</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in statistics"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#BDBDBD' : '#FAFAFA' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1em">{{ ++i }}</div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1em">{{ item?.title }}</div>
                    </td>
                    <td>
                      <div style="font-size: 1em">
                        {{ item?.area }}
                      </div>
                    </td>
                    <td>
                      <div>
                        {{ item?.carpets?.length }}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </v-table>
              <div class="text-center" v-else>داده ای جهت نمایش وجود ندارد</div>
            </v-card>
          </v-col>
        </v-row>
      </v-responsive>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed, onMounted } from "vue";
import axios from "axios";
import { breakPointsStore } from "@/stores/breakPoints";
import * as XLSX from "xlsx";
import { useRouter } from "vue-router";
import DatePicker from "vue3-persian-datetime-picker";
onMounted(async () => {
  await getStatuses();
  await getServiceProviders();
  await getAllUsers();
  await getCarpetList();
  await getServicesList();
});
const windowHeight = computed(() => {
  return window.innerHeight - 290;
});
const windowHeight2 = computed(() => {
  return window.innerHeight - 220;
});
const store = breakPointsStore();
const device = ref(store.device);
const transferPage = ref(1);
function convertGDateToJalali(gDate) {
  const date = new Date(gDate).toLocaleDateString("fa-IR");
  return date;
}

function gregorian_to_jalali(gy, gm, gd) {
  let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy;
  if (gy > 1600) {
    jy = 979;
    gy -= 1600;
  } else {
    jy = 0;
    gy -= 621;
  }
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    parseInt((gy2 + 3) / 4) -
    parseInt((gy2 + 99) / 100) +
    parseInt((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * parseInt(days / 12053);
  days %= 12053;
  jy += 4 * parseInt(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += parseInt((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm = days < 186 ? 1 + parseInt(days / 31) : 7 + parseInt((days - 186) / 30);
  let jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);

  let resultY = jy.toString();
  let resultM = jm < 10 ? "0" + jm.toString() : jm.toString();
  let resultD = jd < 10 ? "0" + jd.toString() : jd.toString();
  return resultY + "-" + resultM + "-" + resultD;
}

function convertPersianNumberToLatin(number) {
  let str = "";
  for (let i = 0; i < number.length; i++) {
    if (number[i] === "0") {
      str += "۰";
    } else if (number[i] === "1") {
      str += "۱";
    } else if (number[i] === "2") {
      str += "۲";
    } else if (number[i] === "3") {
      str += "۳";
    } else if (number[i] === "4") {
      str += "۴";
    } else if (number[i] === "5") {
      str += "۵";
    } else if (number[i] === "6") {
      str += "۶";
    } else if (number[i] === "7") {
      str += "۷";
    } else if (number[i] === "8") {
      str += "۸";
    } else if (number[i] === "9") {
      str += "۹";
    } else {
      str += number[i];
    }
  }
  return str;
}

const APIUrl = "http://192.168.1.62:8000/";
// const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";

const carpetFiltersDialog = ref(false);
const filteredWorker = ref(null);
const filteredServiceProvider = ref(null);
const filteredStartDate = ref(null);
const filteredEndDate = ref(null);
const filteredStatus = ref(null);
const filteredService = ref(null);
const filteredCarpets = ref(null);

const filteredBarcode = ref(null);
const filteredColor = ref(null);
const filteredFactory = ref(null);
const filteredSize = ref(null);
const filteredMapCode = ref(null);
const filteredCostumer = ref(null);

const filteredWorkerStand = ref(null);
const filteredServiceProviderStand = ref(null);
const filteredCarpetsStand = ref([]);
const filteredStartDateStand = ref(null);
const filteredEndDateStand = ref(null);
const filteredStatusStand = ref(null);
const filteredServiceStand = ref(null);

const filteredBarcodeStand = ref(null);
const filteredColorStand = ref(null);
const filteredFactoryStand = ref(null);
const filteredSizeStand = ref(null);
const filteredMapCodeStand = ref(null);
const filteredCostumerStand = ref(null);

const filterDialog = ref(false);

const filterType = ref(null);
function openFilterDialog(type) {
  filterType.value = type;
  filterDialog.value = true;
}

const statuses = ref([]);
async function getStatuses() {
  await axios.get(APIUrl + "status/all-status-list/").then((response) => {
    statuses.value = response.data;
  });
}

const serviceProviders = ref([]);
async function getServiceProviders() {
  await axios
    .get(APIUrl + "serviceprovider/all-serviceproviders-list/")
    .then((response) => {
      serviceProviders.value = response.data;
    });
}

const workerList = ref([]);
async function getAllUsers() {
  workerList.value = [];
  await axios.get(APIUrl + "user/all-user-list/").then((response) => {
    for (const user of response.data) {
      if (!user.is_staff) {
        workerList.value.push(user);
      }
    }
  });
}

const carpetList = ref([]);

const carpetsBarcodes = ref([]);
const carpetsColors = ref([]);
const carpetsFactorys = ref([]);
const carpetsSizes = ref([]);
const carpetsMapCodes = ref([]);
const carpetsCostumers = ref([]);

async function getCarpetList() {
  await axios.get(APIUrl + "carpet/all-carpets-list/").then((response) => {
    carpetList.value = response.data;
    for (const carpet of response.data) {
      if (!carpetsBarcodes.value.includes(carpet.barcode)) {
        carpetsBarcodes.value.push(carpet.barcode);
      }
      if (!carpetsColors.value.includes(carpet.color)) {
        carpetsColors.value.push(carpet.color);
      }
      if (!carpetsFactorys.value.includes(carpet.factory)) {
        carpetsFactorys.value.push(carpet.factory);
      }
      if (!carpetsSizes.value.includes(carpet.size)) {
        carpetsSizes.value.push(carpet.size);
      }
      if (!carpetsMapCodes.value.includes(carpet.map_code)) {
        carpetsMapCodes.value.push(carpet.map_code);
      }
      if (!carpetsCostumers.value.includes(carpet.costumer_name)) {
        carpetsCostumers.value.push(carpet.costumer_name);
      }
    }
  });
}

const servicesList = ref([]);
async function getServicesList() {
  await axios.get(APIUrl + "services/all-services-list/").then((response) => {
    servicesList.value = response.data;
  });
}

const openTransfers = ref([]);
async function getOpenTransfer() {
  openTransfers.value = [];
  let openTransfer = {};
  await axios.get(APIUrl + "transfer/admin-verify-transfer/").then((response) => {
    for (let i = 0; i < response.data.length; i++) {
      openTransfer = {};
      if (response.data[i].is_finished) {
        openTransfer.id = response.data[i].id;
        openTransfer.date = response.data[i].date;

        for (const status of statuses.value) {
          if (status.id === response.data[i].status) {
            openTransfer.status = status;
          }
        }

        for (const serviceProvider of serviceProviders.value) {
          if (serviceProvider.id === response.data[i].service_provider) {
            openTransfer.serviceProvider = serviceProvider;
          }
        }

        for (const worker of workerList.value) {
          if (worker.id === response.data[i].worker) {
            openTransfer.worker = worker;
          }
        }

        openTransfer.carpets = [];
        for (const carpet of carpetList.value) {
          for (const c of response.data[i].carpets) {
            if (carpet.id === c) {
              openTransfer.carpets.push(carpet);
            }
          }
        }

        openTransfer.services = [];
        for (const service of servicesList.value) {
          for (const s of response.data[i].services) {
            if (service.id === s) {
              openTransfer.services.push(service);
            }
          }
        }

        openTransfers.value.push(openTransfer);
      }
    }
  });
}

const detailOpenTransferDialog = ref(false);
const openTransfer = ref(null);
async function showOpenTransferDetail(id, s) {
  if (s) detailOpenTransferDialog.value = true;
  for (const transfer of openTransfers.value) {
    if (transfer.id === id) {
      openTransfer.value = transfer;
    }
  }
}

async function acceptTransfer(s, id) {
  if (s) {
    await showOpenTransferDetail(id, false);
  }
  let carpets = [];
  for (const c of openTransfer?.value?.carpets) {
    carpets.push(c.id);
  }

  let services = [];
  for (const ser of openTransfer?.value?.services) {
    services.push(ser.id);
  }
  const body = {};
  body.carpet = carpets;
  body.worker = openTransfer?.value?.worker?.id;
  body.status = openTransfer?.value?.status?.id;
  body.service_provider = openTransfer?.value?.serviceProvider?.id;
  body.services = services;
  body.date = openTransfer?.value?.date;
  body.is_finished = true;
  body.admin_verify = true;

  axios
    .put(APIUrl + "transfer/update-transfer2/" + openTransfer?.value?.id + "/", body)
    .then((response) => {
      getOpenTransfer();
    });
}

const carpetListDialog = ref(false);
const carpet = ref(null);
const detailCarpetDialog = ref(false);
function showCarpetDetail(id) {
  detailCarpetDialog.value = true;
  for (const c of carpetList.value) {
    if (c.id === id) {
      carpet.value = c;
    }
  }
}

const transfersForCalculteArea = ref([]);
const allTransfers = ref([]);
const transferCarpetsDialog = ref(false);
const transferCarpets = ref(null);
const filterHolder = ref({});
const pageCount = ref(0);
const statisticsBtn = ref(false);
async function filter() {
  statisticsBtn.value = true;
  filterDialog.value = false;
  let filterParams = "&";

  filteredWorkerStand.value = filteredWorker.value?.first_name
    ? filteredWorker.value?.first_name + " " + filteredWorker.value?.last_name
    : null;
  filteredServiceProviderStand.value = filteredServiceProvider.value?.first_name
    ? filteredServiceProvider.value?.first_name +
      " " +
      filteredServiceProvider.value?.last_name
    : null;
  filteredCarpetsStand.value = filteredCarpets.value;
  filteredStartDateStand.value = filteredStartDate.value;
  filteredEndDateStand.value = filteredEndDate.value;
  filteredStatusStand.value = filteredStatus.value?.title;
  filteredServiceStand.value = filteredService.value?.title;

  filteredBarcodeStand.value = filteredBarcode.value;
  filteredColorStand.value = filteredColor.value;
  filteredFactoryStand.value = filteredFactory.value;
  filteredSizeStand.value = filteredSize.value;
  filteredMapCodeStand.value = filteredMapCode.value;
  filteredCostumerStand.value = filteredCostumer.value;

  if (filteredBarcode.value) {
    filterParams += "barcode=" + filteredBarcode.value + "&";
  }
  if (filteredColor.value) {
    filterParams += "color=" + filteredColor.value + "&";
  }
  if (filteredFactory.value) {
    filterParams += "factory=" + filteredFactory.value + "&";
  }
  if (filteredSize.value) {
    filterParams += "size=" + filteredSize.value + "&";
  }
  if (filteredMapCode.value) {
    filterParams += "map_code=" + filteredMapCode.value + "&";
  }
  if (filteredCostumer.value) {
    filterParams += "costumer=" + filteredCostumer.value + "&";
  }

  if (filteredWorker.value) {
    filterParams += "worker=" + filteredWorker.value?.id + "&";
  }

  if (filteredServiceProvider.value) {
    filterParams += "service_provider=" + filteredServiceProvider.value?.id + "&";
  }

  if (filteredCarpets.value?.length > 0) {
    filterParams += "carpets=";
    for (const c of filteredCarpets.value) {
      filterParams += c + ",";
    }
    if (filterParams.slice(-1) === ",") filterParams = filterParams.replace(/.$/, "");
    filterParams += "&";
  }

  if (filteredStartDate.value) {
    filterParams += "start_date=" + filteredStartDate.value + "&";
  }

  if (filteredEndDate.value) {
    filterParams += "end_date=" + filteredEndDate.value + "&";
  }

  if (filteredStatus.value) {
    filterParams += "status=" + filteredStatus.value?.id + "&";
  }

  if (filteredService.value) {
    filterParams += "services=" + filteredService.value?.id + "&";
  }

  allTransfers.value = [];
  let transfer = {};

  await axios
    .get(
      APIUrl +
        "transfer/all-transfer-list/" +
        "?page=" +
        transferPage.value +
        filterParams
    )
    .then((response) => {
      if (response.data.count % 10 === 0) pageCount.value = response.data.count / 10;
      else pageCount.value = response.data.count / 10 + 1;
      for (let i = 0; i < response.data.results.length; i++) {
        transfer = {};
        transfer.id = response.data.results[i].id;
        transfer.date = response.data.results[i].date;

        for (const status of statuses.value) {
          if (status.id === response.data.results[i].status) {
            transfer.status = status;
          }
        }

        for (const serviceProvider of serviceProviders.value) {
          if (serviceProvider.id === response.data.results[i].service_provider) {
            transfer.serviceProvider = serviceProvider;
          }
        }

        for (const worker of workerList.value) {
          if (worker.id === response.data.results[i].worker) {
            transfer.worker = worker;
          }
        }

        transfer.carpets = [];
        for (const carpet of carpetList.value) {
          for (const c of response.data.results[i].carpets) {
            if (carpet.id === c) {
              transfer.carpets.push(carpet);
            }
          }
        }

        transfer.services = [];
        for (const service of servicesList.value) {
          for (const s of response.data.results[i].services) {
            if (service.id === s) {
              transfer.services.push(service);
            }
          }
        }

        allTransfers.value.push(transfer);
      }
    });

  let transfer2 = {};
  transfersForCalculteArea.value = [];
  await axios
    .get(
      APIUrl + "transfer/all-transfer-list/" + "?page_size=9000000000000" + filterParams
    )
    .then((response) => {
      for (let i = 0; i < response.data.results.length; i++) {
        transfer2 = {};

        transfer2.carpets = [];
        for (const carpet of carpetList.value) {
          for (const c of response.data.results[i].carpets) {
            if (carpet.id === c) {
              transfer2.carpets.push(carpet);
            }
          }
        }
        transfer2.services = [];
        for (const service of servicesList.value) {
          for (const s of response.data.results[i].services) {
            if (service.id === s) {
              transfer2.services.push(service);
            }
          }
        }

        transfersForCalculteArea.value.push(transfer2);
      }
    });
}

function cleanNoAcceptFilters() {
  filterDialog.value = false;
}
const allTransfersDialog = ref(false);
async function getAllTransfers() {
  statisticsBtn.value = false;

  filteredWorker.value = null;
  filteredServiceProvider.value = null;
  filteredCarpets.value = [];
  filteredStartDate.value = null;
  filteredEndDate.value = null;
  filteredStatus.value = null;
  filteredService.value = null;
  filteredBarcode.value = null;
  filteredColor.value = null;
  filteredFactory.value = null;
  filteredSize.value = null;
  filteredMapCode.value = null;
  filteredCostumer.value = null;

  filteredWorkerStand.value = null;
  filteredServiceProviderStand.value = null;
  filteredCarpetsStand.value = [];
  filteredStartDateStand.value = null;
  filteredEndDateStand.value = null;
  filteredStatusStand.value = null;
  filteredServiceStand.value = null;
  filteredBarcodeStand.value = null;
  filteredColorStand.value = null;
  filteredFactoryStand.value = null;
  filteredSizeStand.value = null;
  filteredMapCodeStand.value = null;
  filteredCostumerStand.value = null;
  allTransfers.value = [];
  let transfer = {};
  await axios
    .get(APIUrl + "transfer/all-transfer-list/" + "?page=" + transferPage.value)
    .then((response) => {
      if (response.data.count % 10 === 0) pageCount.value = response.data.count / 10;
      else pageCount.value = response.data.count / 10 + 1;

      for (let i = 0; i < response.data.results.length; i++) {
        transfer = {};
        transfer.id = response.data.results[i].id;
        transfer.date = response.data.results[i].date;

        for (const status of statuses.value) {
          if (status.id === response.data.results[i].status) {
            transfer.status = status;
          }
        }

        for (const serviceProvider of serviceProviders.value) {
          if (serviceProvider.id === response.data.results[i].service_provider) {
            transfer.serviceProvider = serviceProvider;
          }
        }

        for (const worker of workerList.value) {
          if (worker.id === response.data.results[i].worker) {
            transfer.worker = worker;
          }
        }

        transfer.carpets = [];
        for (const carpet of carpetList.value) {
          for (const c of response.data.results[i].carpets) {
            if (carpet.id === c) {
              transfer.carpets.push(carpet);
            }
          }
        }

        transfer.services = [];
        for (const service of servicesList.value) {
          for (const s of response.data.results[i].services) {
            if (service.id === s) {
              transfer.services.push(service);
            }
          }
        }

        allTransfers.value.push(transfer);
        console.log(allTransfers.value);
      }
    });
}
function fillTransferCarpets(id) {
  transferCarpetsDialog.value = true;
  for (const t of allTransfers.value) {
    if (t.id === id) {
      transferCarpets.value = t.carpets;
    }
  }
}
function fillTransferCarpets2(id) {
  transferCarpetsDialog.value = true;

  for (const t of openTransfers.value) {
    if (t.id === id) {
      transferCarpets.value = t.carpets;
    }
  }
}
function switchTransferPage() {
  if (
    filteredWorker.value === null &&
    filteredServiceProvider.value === null &&
    filteredStartDate.value === null &&
    filteredEndDate.value === null &&
    filteredStatus.value === null &&
    filteredService.value === null &&
    filteredBarcode.value === null &&
    filteredColor.value === null &&
    filteredFactory.value === null &&
    filteredSize.value === null &&
    filteredMapCode.value === null &&
    filteredCostumer.value === null
  ) {
    getAllTransfers();
  } else {
    filter();
  }
}

function cleanFilter(filter) {
  if (filter === "status") {
    filteredStatus.value = null;
    filteredStatusStand.value = null;
  } else if (filter === "worker") {
    filteredWorker.value = null;
    filteredWorkerStand.value = null;
  } else if (filter === "serviceProvider") {
    filteredServiceProvider.value = null;
    filteredServiceProviderStand.value = null;
  } else if (filter === "date") {
    filteredStartDate.value = null;
    filteredEndDate.value = null;
    filteredStartDateStand.value = null;
    filteredEndDateStand.value = null;
  } else if (filter === "service") {
    filteredService.value = null;
    filteredServiceStand.value = null;
  } else if (filter === "carpet") {
    filteredBarcode.value = null;
    filteredColor.value = null;
    filteredFactory.value = null;
    filteredSize.value = null;
    filteredMapCode.value = null;
    filteredCostumer.value = null;

    filteredBarcodeStand.value = null;
    filteredColorStand.value = null;
    filteredFactoryStand.value = null;
    filteredSizeStand.value = null;
    filteredMapCodeStand.value = null;
    filteredCostumerStand.value = null;
  }

  switchTransferPage();
}

watch(
  () => filteredBarcode.value,
  () => {
    if (!filteredBarcode.value) switchTransferPage();
  }
);
watch(
  () => filteredColor.value,
  () => {
    if (!filteredColor.value) switchTransferPage();
  }
);
watch(
  () => filteredFactory.value,
  () => {
    if (!filteredFactory.value) switchTransferPage();
  }
);
watch(
  () => filteredSize.value,
  () => {
    if (!filteredSize.value) switchTransferPage();
  }
);
watch(
  () => filteredMapCode.value,
  () => {
    if (!filteredMapCode.value) switchTransferPage();
  }
);
watch(
  () => filteredCostumer.value,
  () => {
    if (!filteredCostumer.value) switchTransferPage();
  }
);
const detailAllTransferDialog = ref(false);
const transfer = ref(null);
async function showAllTransferDetail(id) {
  detailAllTransferDialog.value = true;
  for (const t of allTransfers.value) {
    if (t.id === id) {
      transfer.value = t;
    }
  }
}

const services = ref([]);
const selectedOperator = ref(null);
watch(
  () => selectedOperator.value,
  () => {
    selectedServices.value = [];
  }
);
const selectedServices = ref([]);
const router = useRouter();

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
      kind: carpets.value[i].kind,
    };
    axios.post(APIUrl + "carpet/register-from-excel/", body).then((response) => {
      console.log(response);
      inputExcelDialog.value = false;
    });
  }
}

const variants = [
  {
    type: "تنظیمات",
    color: "#009688",
    variant: "elevated",
    icon: "mdi-calculator",
  },
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

const allStatistics = ref(null);
async function getAllStatistics() {
  await axios.get(APIUrl + "statistics/all-statistics-list/").then((response) => {
    allStatistics.value = response.data;
  });
}

const addStatisticsDialog = ref(false);
const selectedService = ref(null);
const size = ref(null);
const geometry = ref(null);
const area = ref(null);
async function addStatistics() {
  let updateCheck = false;
  await getAllStatistics();
  let body = {
    service: selectedService.value,
    size: size.value,
    kind: geometry.value,
    custom_size: area.value,
  };
  for (const s of allStatistics.value) {
    if (
      s.service === selectedService.value &&
      s.size === size.value &&
      s.kind === geometry.value
    ) {
      updateCheck = true;
      axios
        .patch(APIUrl + "statistics/update-statistics/" + s.id + "/", body)
        .then((response) => {
          console.log(response);
          addStatisticsDialog.value = false;
          selectedService.value = null;
          size.value = null;
          geometry.value = null;
          area.value = null;
        });
    }
  }

  if (!updateCheck) {
    axios.post(APIUrl + "statistics/create-statistics/", body).then((response) => {
      console.log(response);
      addStatisticsDialog.value = false;
      selectedService.value = null;
      size.value = null;
      geometry.value = null;
      area.value = null;
    });
  }
}
const openTransfersDialog = ref(false);
function openModal(obj) {
  if (obj.type === "منابع انسانی") {
    router.push("/human-resource");
  } else if (obj.type === "ورود قالی ها") {
    inputExcelDialog.value = true;
  } else if (obj.type === "نقل و انتقالات") {
    openTransfersDialog.value = true;
    getOpenTransfer();
  } else if (obj.type === "قالی ها") {
    carpetListDialog.value = true;
  } else if (obj.type === "گزارش گیری") {
    allTransfersDialog.value = true;
    getAllTransfers();
  } else if (obj.type === "تنظیمات") {
    addStatisticsDialog.value = true;
  }
}

const statisticsListDialog = ref(false);
const statistics = ref([]);
function calculateArea() {
  statisticsListDialog.value = true;
  let totalArea = 0;
  let obj = {};
  statistics.value = [];
  axios.get(APIUrl + "statistics/all-statistics-list/").then((response) => {
    for (const s of response.data) {
      obj = {};
      obj.service = s.service;
      obj.area = 0;
      obj.carpets = [];
      statistics.value.push(obj);
    }
    for (const t of transfersForCalculteArea.value) {
      for (const ss of t.services) {
        for (const s of response.data) {
          if (s.service === ss.id) {
            for (const c of t.carpets) {
              if (s.size === c.size && s.kind === c.kind) {
                // && s.kind === c.kind
                totalArea += s.custom_size;
                for (const o of statistics.value) {
                  if (o.service === ss.id) {
                    o.area += s.custom_size;
                    o.title = ss.title;
                    o.carpets.push(c);
                  }
                }
              }
            }
          }
        }
      }
    }

    for (const o of statistics.value) {
      if (o.area === 0) {
        let index = statistics.value.indexOf(o);
        statistics.value.splice(index, 1);
      }
    }
    for (const o of statistics.value) {
      if (o.area === 0) {
        let index = statistics.value.indexOf(o);
        statistics.value.splice(index, 1);
      }
    }

    console.log(totalArea, "/ ", statistics.value);
  });
}

const sizes = ref([]);
function getSizes() {
  axios.get(APIUrl + "carpet/size-carpet-list/").then((response) => {
    sizes.value = response.data;
  });
}
const kinds = ref([]);
function getKinds() {
  axios.get(APIUrl + "carpet/kind-carpet-list/").then((response) => {
    kinds.value = response.data;
  });
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
