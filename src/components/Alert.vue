<template>
  <v-snackbar v-model="snackbar" :timeout="timeout" :color="color" multi-line>
    <!-- <v-card width> -->
    <v-row align="center" justify="center">
      <v-col cols="3">
        <v-btn color="black" @click="snackbar = false">
          <v-icon color="error"> mdi-close </v-icon>
        </v-btn>
      </v-col>
      <v-spacer></v-spacer>
      <v-col cols="4">{{ text }}</v-col>
    </v-row>
    <!-- </v-card> -->
  </v-snackbar>
</template>

<script setup>
import { ref, watch } from "vue";

// Props
const props = defineProps({
  msg: String,
  activate: Boolean,
  timeout: Number,
  color: String,
});

// Variables
const snackbar = ref(false);
const text = ref("");
const timeout = ref(2000);
const color = ref("error");

// Watchers
watch(
  () => props.activate,
  () => {
    snackbar.value = true;
    text.value = props.msg;
    timeout.value = props.timeout;
    color.value = props.color;
  }
);
</script>
