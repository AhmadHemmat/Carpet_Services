<template>
  <v-snackbar v-model="snackbar" :timeout="timeout" :color="color" multi-line>
    {{ text }}
    <template v-slot:actions>
      <v-btn color="black" variant="text" @click="snackbar = false"> بستن </v-btn>
    </template>
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
