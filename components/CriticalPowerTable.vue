<template>
  <div class="rounded overflow-clip">
    <table class="table-fixed h-full w-full">
      <thead class="bg-gray-800 text-gray-100">
        <tr>
          <th class="w-[100px]"></th>
          <th class="w-[100px]">Primary</th>
          <th class="w-[100px]">Secondary</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="item in cpdiffs"
          :key="item.duration"
          class="bg-gray-100 even:bg-gray-300"
        >
          <td class="text-right">{{ timeFormatter(item.duration) }}</td>
          <td class="text-center">{{ item.primary.toFixed(0) }}w</td>
          <td class="text-center">{{ item.secondary.toFixed(0) }}w</td>
          <td class="text-center">
            <span> {{ item.diff.toFixed(2) }}% </span>
            <span class="text-xs font-light mx-2">
              {{ (item.primary - item.secondary).toFixed(0) }}w
            </span>
          </td>
        </tr>
        <tr class="bg-gray-100 even:bg-gray-300">
          <td class="text-right">
            Total
            <span class="text-xs font-th">
              {{ Duration.fromMillis(totalDuration).toFormat("hh:mm:ss") }}
            </span>
          </td>
          <td class="text-center">{{ averagePower?.primary.toFixed(0) }}w</td>
          <td class="text-center">{{ averagePower?.secondary.toFixed(0) }}w</td>
          <td class="text-center">
            <span> {{ averagePower?.difference.toFixed(2) }}% </span>
            <span class="text-xs font-light mx-2">
              {{
                (averagePower?.primary - averagePower?.secondary).toFixed(0)
              }}w
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { Duration } from "luxon";

const { averagePower, totalDuration, criticalPowerDifferences } =
  workoutFileStoreToRefs();

const cpdiffs = computed(() => {
  return criticalPowerDifferences.value
    ?.filter((value) => {
      return (
        value.duration === 1000 ||
        value.duration === 5000 ||
        value.duration === 15000 ||
        value.duration === 30000 ||
        value.duration === 60000 ||
        value.duration === 60000 * 5 ||
        value.duration === 60000 * 10 ||
        value.duration === 60000 * 20 ||
        value.duration === 60000 * 60
      );
    })
    .sort((a, b) => a.duration - b.duration);
});

const timeFormatter = (durationMs: number): string => {
  const duration = Duration.fromMillis(durationMs).shiftToAll();
  if (duration.hours >= 1) {
    if (duration.minutes === 0 && duration.seconds === 0) {
      return `${duration.hours}h`;
    }
  }

  if (duration.minutes === 1) {
    return `${duration.minutes} minute`;
  }
  if (duration.minutes > 1) {
    return `${duration.minutes} minutes`;
  }

  return `${duration.seconds} second`;
};
</script>
