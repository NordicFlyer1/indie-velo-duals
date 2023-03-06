<template>
  <div class="ml-2">
    <div class="text-lg">Recording Devices</div>
    <div class="ml-1 flex flex-col gap-1">
      <DeviceDetails device-name="Primary" :device="devices.primary" />
      <DeviceDetails device-name="Secondary" :device="devices.secondary" />
    </div>
  </div>
</template>
<script setup lang="ts">
const { devices } = workoutFileStoreToRefs();
</script>
