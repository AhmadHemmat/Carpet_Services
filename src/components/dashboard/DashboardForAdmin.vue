<template>
  <v-app-bar v-if="device === 'mobile'" color="#C51162" app dir="rtl">
    <v-btn stacked>
      <v-icon icon="mdi-comment-check" color="white"></v-icon>
      <span> خوش آمدید </span>
    </v-btn>
    <v-spacer></v-spacer>
    <v-btn>
      <v-icon icon="mdi-apps" color="#FFFF00" size="large"></v-icon>
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
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="openTransfersDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card
          :width="device === 'mobile' ? '100%' : '20%'"
          class="my-4 mx-auto d-flex justify-center text-center pa-2"
          color="warning"
        >
          <div style="font-size: 1.5em">لیست نقل و انتقالات تایید نشده</div>
        </v-card>
        <v-row v-if="device === 'mobile'">
          <v-col cols="12">
            <v-card class="cart" :style="{ height: 400 + 'px', overflow: 'auto' }">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">
                      <h2>شناسه</h2>
                    </th>
                    <th class="text-center">
                      <h2>وضعیت</h2>
                    </th>
                    <th class="text-center">
                      <h2>تایید؟</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in openTransfers"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#3F51B5' : '#004D40' }"
                  >
                    <td class="pa-2">
                      <h3>{{ item?.id }}</h3>
                    </td>
                    <td class="pa-2">
                      <h3>{{ item?.status?.title ? item?.status?.title : null }}</h3>
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
                        height="48"
                        width="100%"
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
            <v-card class="cart" :style="{ height: 600 + 'px', overflow: 'auto' }">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.5em">شناسه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">وضعیت</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">کارگر</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">تاریخ</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">سرویس کار</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">سرویس ها</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">فرش ها</div>
                    </th>
                    <th class="text-center">
                      <h2>تایید؟</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in openTransfers"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#3F51B5' : '#004D40' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1.4em">{{ item?.id }}</div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1.4em">
                        {{ item?.status?.title }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1.4em">
                        {{
                          item?.worker?.first_name
                            ? item?.worker?.first_name + " " + item?.worker?.last_name
                            : "ثبت نشده"
                        }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1.4em">
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
                      <div style="font-size: 1.4em">
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
                          style="font-size: 1.4em"
                        >
                          {{ service?.title }} <br />
                        </div>
                      </div>
                      <div v-else style="font-size: 1.4em">ثبت نشده <br /></div>
                    </td>
                    <td class="pa-2">
                      <div v-if="item?.carpets.length > 0">
                        <div
                          class="pa-2"
                          v-for="(carpet, i) in item?.carpets"
                          :key="i"
                          style="font-size: 1.4em"
                        >
                          <v-btn
                            height="40"
                            width="70%"
                            color="yellow"
                            @click="showCarpetDetail(carpet?.id)"
                            style="cursor: pointer"
                          >
                            {{ carpet?.barcode }}
                          </v-btn>
                          <br />
                        </div>
                      </div>
                      <div v-else style="font-size: 1.4em">ثبت نشده <br /></div>
                    </td>
                    <td>
                      <v-btn
                        class="flex-grow-1"
                        height="48"
                        width="100%"
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
                height="48"
                width="100%"
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
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="carpetListDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>

        <v-card
          :width="device === 'mobile' ? '100%' : '20%'"
          class="my-4 mx-auto d-flex justify-center text-center pa-2"
          color="warning"
        >
          <div style="font-size: 1.5em">لیست قالی ها</div>
        </v-card>

        <v-row v-if="device === 'mobile'">
          <v-col cols="12">
            <v-card class="cart" :style="{ height: 400 + 'px', overflow: 'auto' }">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">
                      <h2>بارکد</h2>
                    </th>
                    <th class="text-center">
                      <h2>کارخانه</h2>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, i) in carpetList" :key="i" class="text-center">
                    <td class="pa-2">
                      <h3>{{ item?.barcode }}</h3>
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
                      <h3>{{ item?.factory }}</h3>
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-else>
          <v-col cols="12">
            <v-card class="cart" :style="{ height: 600 + 'px', overflow: 'auto' }">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.7em">شناسه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.7em">بارکد</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.7em">کارخانه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.7em">کد نقشه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.7em">اندازه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.7em">رنگ</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.7em">مشتری</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(item, i) in carpetList"
                    :key="i"
                    class="text-center"
                    :style="{ 'background-color': i % 2 === 0 ? '#3F51B5' : '#004D40' }"
                  >
                    <td class="pa-2">
                      <div style="font-size: 1.4em">
                        {{ item?.id }}
                      </div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1.4em">{{ item?.barcode }}</div>
                    </td>
                    <td>
                      <div style="font-size: 1.4em">
                        {{ item?.factory }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1.4em">{{ item?.map_code }}</div>
                    </td>
                    <td>
                      <div style="font-size: 1.4em">
                        {{ item?.size }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1.4em">
                        {{ item?.color }}
                      </div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1.4em">
                        {{ item?.costumer_name }}
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
    <v-card theme="dark" class="pa-8 d-flex justify-center flex-wrap" dir="rtl">
      <v-responsive>
        <v-chip outline @click="allTransfersDialog = false">
          <v-icon color="red" size="large">mdi-exit-to-app</v-icon>
        </v-chip>
        <v-card
          class="mx-auto my-4 text-center pa-2"
          :width="device === 'mobile' ? '100%' : '20%'"
          color="warning"
        >
          <div style="font-size: 1.5em">لیست نقل و انتقالات</div>
        </v-card>

        <v-row v-if="device !== 'mobile'" align="center" justify="center">
          <v-btn
            height="40"
            width="200"
            color="error"
            @click="getAllTransfers"
            style="cursor: pointer"
          >
            پاک کردن فیلترها
          </v-btn>
          <v-col cols="2">
            <v-btn
              height="40"
              width="100%"
              color="yellow"
              @click="openFilterDialog('worker')"
              style="cursor: pointer"
            >
              فیلتر کارگر
            </v-btn>
          </v-col>
          <v-col cols="2"
            ><v-btn
              height="40"
              width="100%"
              color="yellow"
              @click="openFilterDialog('serviceProvider')"
              style="cursor: pointer"
            >
              فیلتر سرویس کار
            </v-btn></v-col
          >
          <v-col cols="2"
            ><v-btn
              height="40"
              width="100%"
              color="yellow"
              @click="openFilterDialog('carpet')"
              style="cursor: pointer"
            >
              فیلتر فرش
            </v-btn></v-col
          >
          <v-col cols="2">
            <v-btn
              height="40"
              width="100%"
              color="yellow"
              @click="openFilterDialog('date')"
              style="cursor: pointer"
            >
              فیلتر تاریخ
            </v-btn></v-col
          >
          <v-col cols="2"
            ><v-btn
              height="40"
              width="100%"
              color="yellow"
              @click="openFilterDialog('status')"
              style="cursor: pointer"
            >
              فیلتر وضعیت
            </v-btn></v-col
          >
        </v-row>

        <v-row v-if="device === 'mobile'">
          <v-col cols="12">
            <v-card class="cart" :style="{ height: 600 + 'px', overflow: 'auto' }">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">
                      <h2>شناسه</h2>
                    </th>
                    <th class="text-center">
                      <h2>وضعیت</h2>
                    </th>
                    <th class="text-center">
                      <h2>جزییات</h2>
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
                      <h3>{{ item?.id }}</h3>
                    </td>
                    <td class="pa-2">
                      <h3>{{ item?.status?.title }}</h3>
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
            <v-card class="cart" :style="{ height: 600 + 'px', overflow: 'auto' }">
              <v-table>
                <thead>
                  <tr>
                    <th class="text-center">
                      <div style="font-size: 1.5em">شناسه</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">وضعیت</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">کارگر</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">تاریخ</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">سرویس کار</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">سرویس ها</div>
                    </th>
                    <th class="text-center">
                      <div style="font-size: 1.5em">فرش ها</div>
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
                      <div style="font-size: 1.4em">{{ item?.id }}</div>
                    </td>
                    <td class="pa-2">
                      <div style="font-size: 1.4em">
                        {{ item?.status?.title }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1.4em">
                        {{
                          item?.worker?.first_name
                            ? item?.worker?.first_name + " " + item?.worker?.last_name
                            : "ثبت نشده"
                        }}
                      </div>
                    </td>
                    <td>
                      <div style="font-size: 1.4em">
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
                      <div style="font-size: 1.4em">
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
                          style="font-size: 1.4em"
                        >
                          {{ service?.title }} <br />
                        </div>
                      </div>
                      <div v-else style="font-size: 1.4em">ثبت نشده <br /></div>
                    </td>
                    <td class="pa-2">
                      <div v-if="item?.carpets.length > 0">
                        <div
                          class="pa-2"
                          v-for="(carpet, i) in item?.carpets"
                          :key="i"
                          style="font-size: 1.4em"
                        >
                          <v-btn
                            height="40"
                            width="70%"
                            color="yellow"
                            @click="showCarpetDetail(carpet?.id)"
                            style="cursor: pointer"
                          >
                            {{ carpet?.barcode }}
                          </v-btn>
                          <br />
                        </div>
                      </div>
                      <div v-else style="font-size: 1.4em">ثبت نشده <br /></div>
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
        <v-chip outline @click="filterDialog = false">
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
              item-value="id"
              label="انتخاب کارگر"
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
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
              item-value="id"
              label="انتخاب سرویس کار"
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
        </div>
        <div v-if="filterType === 'carpet'">
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
            <span style="font-size: 1.7em">فیلتر فرش</span>
          </v-card>
          <v-locale-provider rtl>
            <v-autocomplete
              class="mt-2"
              v-model="filteredCarpets"
              :items="carpetList"
              color="blue-grey-lighten-2"
              item-title="barcode"
              item-value="id"
              label="انتخاب فرش ها"
              clearable
              dir="rtl"
              chips
              closable-chips
              multiple
            >
            </v-autocomplete>
          </v-locale-provider>
        </div>
        <div v-if="filterType === 'date'">
          <v-card class="mt-4 d-flex justify-center text-center pa-2" color="warning">
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
          <date-picker
            class="ma-2"
            v-model="filteredEndDate"
            format="YYYY-MM-DD"
            display-format="jYYYY-jMM-jDD"
            style="color: #e65100"
          />
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
              item-value="id"
              label="انتخاب وضعیت"
              clearable
              dir="rtl"
              chips
              closable-chips
            >
            </v-autocomplete>
          </v-locale-provider>
        </div>
        <v-btn
          height="40"
          width="50%"
          color="yellow"
          @click="filter()"
          style="cursor: pointer"
        >
          ثبت
        </v-btn>
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
import persianDate from "persian-date";
onMounted(async () => {
  await getStatuses();
  await getServiceProviders();
  await getAllUsers();
  await getCarpetList();
  await getServicesList();
});
const store = breakPointsStore();
const device = ref(store.device);
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

const APIUrl = "https://carpet.iran.liara.run/";
// const APIUrl = "http://localhost:8000/";

const filteredWorker = ref(null);
const filteredServiceProvider = ref(null);
const filteredCarpets = ref([]);
const filteredStartDate = ref(null);
const filteredEndDate = ref(null);
const filteredStatus = ref(null);

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
async function getCarpetList() {
  await axios.get(APIUrl + "carpet/all-carpets-list/").then((response) => {
    carpetList.value = response.data;
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
  await axios.get(APIUrl + "transfer/all-transfer-list/").then((response) => {
    for (let i = 0; i < response.data.results.length; i++) {
      openTransfer = {};
      if (response.data.results[i].admin_verify === false) {
        openTransfer.id = response.data.results[i].id;
        openTransfer.date = response.data.results[i].date;

        for (const status of statuses.value) {
          if (status.id === response.data.results[i].status) {
            openTransfer.status = status;
          }
        }

        for (const serviceProvider of serviceProviders.value) {
          if (serviceProvider.id === response.data.results[i].service_provider) {
            openTransfer.serviceProvider = serviceProvider;
          }
        }

        for (const worker of workerList.value) {
          if (worker.id === response.data.results[i].worker) {
            openTransfer.worker = worker;
          }
        }

        openTransfer.carpets = [];
        for (const carpet of carpetList.value) {
          for (const c of response.data.results[i].carpets) {
            if (carpet.id === c) {
              openTransfer.carpets.push(carpet);
            }
          }
        }

        openTransfer.services = [];
        for (const service of servicesList.value) {
          for (const s of response.data.results[i].services) {
            if (service.id === s) {
              openTransfer.services.push(service);
            }
          }
        }

        openTransfers.value.push(openTransfer);
        console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
        console.log(openTransfers.value);
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
      console.log(response);
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

const allTransfers = ref([]);
async function filter() {
  filterDialog.value = false;
  let filterParams = "?";
  if (filteredWorker.value) filterParams += "worker=" + filteredWorker.value + "&";
  if (filteredServiceProvider.value)
    filterParams += "service_provider=" + filteredServiceProvider.value + "&";
  if (filteredCarpets.value.length > 0) {
    filterParams += "carpets=";
    for (const c of filteredCarpets.value) {
      filterParams += c + ",";
    }
    if (filterParams.slice(-1) === ",") filterParams = filterParams.replace(/.$/, "");
    filterParams += "&";
  }

  if (filteredStartDate.value)
    filterParams += "start_date=" + filteredStartDate.value + "&";
  if (filteredEndDate.value) filterParams += "end_date=" + filteredEndDate.value + "&";
  if (filteredStatus.value) filterParams += "status=" + filteredStatus.value + "&";

  allTransfers.value = [];
  let transfer = {};
  await axios
    .get(APIUrl + "transfer/all-transfer-list/" + filterParams)
    .then((response) => {
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
        console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
        console.log(allTransfers.value);
      }
    });
}
const allTransfersDialog = ref(false);
async function getAllTransfers() {
  filteredWorker.value = null;
  filteredServiceProvider.value = null;
  filteredCarpets.value = [];
  filteredStartDate.value = null;
  filteredEndDate.value = null;
  filteredStatus.value = null;
  allTransfers.value = [];
  let transfer = {};
  await axios.get(APIUrl + "transfer/all-transfer-list/").then((response) => {
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
      console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
      console.log(allTransfers.value);
    }
  });
}

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

function filterTransfersByWorker(id) {}

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
    };
    axios.post(APIUrl + "carpet/register-from-excel/", body).then((response) => {
      console.log(response);
      inputExcelDialog.value = false;
    });
  }
}

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
const selectCarpetDialog = ref(false);
const selectedCarpet = ref(null);

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
  }
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
