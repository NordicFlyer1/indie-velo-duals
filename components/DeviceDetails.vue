<template>
  <div>
    <span class="">{{ props.deviceName }}</span>
    <div class="relative pl-1 bg-gray-200 rounded m-1">
      <DeviceTypeIcon
        class="absolute top-0 right-0"
        :device-type="props.device.device_type"
      />
      <div class="flex flex-col gap-2">
        <span class="text-lg">
          {{ props.device.manufacturer }}
        </span>
        <span class="text-sm">
          <span> serial: </span>
          <span
            v-if="props.device.serial_number"
            class="text-xs font-light text-gray-50 font-mono bg-gray-500 rounded-sm w-fit p-0.5"
          >
            {{ props.device.serial_number }}
          </span>
        </span>
        <div class="font-mono text-xs">
          <ul>
            <li
              v-for="item in Object.entries(additionalDetails)"
              :key="item[0]"
            >
              {{ item[0] }}: {{ item[1] }}
            </li>
          </ul>
          <!-- {{ additionalDetails }} -->
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { FitDeviceInfo } from "~~/utils/types/fit";

const props = defineProps<{
  device: FitDeviceInfo | undefined;
  deviceName: string;
}>();

const additionalDetails = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, camelcase
  const { timestamp, device_index, device_type, manufacturer, ...rest } =
    props.device;
  return rest;
});
</script>
