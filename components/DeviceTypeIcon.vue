<template>
  <div
    class="text-xs px-2 pb-0.5 rounded rounded-t-none rounded-r-none border border-r-0 border-t-0"
  >
    {{ props.deviceType }}
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{ deviceType: string }>();
</script>
