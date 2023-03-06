<template>
  <div class="flex items-center">
    <div
      class="m-2 shadow-lg border-dashed border-2 rounded-full bg-slate-400 border-gray-500 cursor-pointer"
      @drop.prevent="onDrop"
    >
      <Icon name="material-symbols:file-upload" size="128" />
    </div>
    <div class="m-5">
      <p>Drag and drop your indieVelo .fit files here</p>
      <span class="font-light italic text-sm"
        >Note: Your data will only be analyzed locally!</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
const emit = defineEmits<{
  (event: "files-dropped", file: Array<File>): void;
}>();

function onDrop(e) {
  emit("files-dropped", [...e.dataTransfer.files]);
}

function preventDefaults(e) {
  e.preventDefault();
}

const events = ["dragenter", "dragover", "dragleave", "drop"];

onMounted(() => {
  events.forEach((eventName) => {
    document.body.addEventListener(eventName, preventDefaults);
  });
});

onUnmounted(() => {
  events.forEach((eventName) => {
    document.body.removeEventListener(eventName, preventDefaults);
  });
});
</script>
