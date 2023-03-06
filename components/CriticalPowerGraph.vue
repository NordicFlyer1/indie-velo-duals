<template>
  <div>
    <client-only>
      <Line :data="data" :options="options" :plugins="[chartPluginHoverLine]" />
    </client-only>
  </div>
</template>
<script setup lang="ts">
import { Line } from "vue-chartjs";
import { ChartOptions, ChartData, ChartDataset } from "chart.js";
import { Duration } from "luxon";

const { criticalPowerCurve, secondaryCriticalPowerCurve } =
  workoutFileStoreToRefs();
const commonDatasetOptions: Partial<ChartDataset<"line">> = {
  pointStyle: false,
  tension: 0.5,
  fill: false,
};

const mapToCoords = (data?: Map<number, number | undefined>) => {
  if (!data) {
    return [];
  }

  return [...data].map(([duration, average]) => ({
    x: duration * 1000,
    y: average,
  }));
};

const data = computed<ChartData<"line">>(() => {
  return {
    datasets: [
      {
        ...commonDatasetOptions,
        label: "Primary",
        data: mapToCoords(criticalPowerCurve.value),
        borderColor: "rgb(75, 192, 192)",
      },
      {
        ...commonDatasetOptions,
        label: "Secondary",
        data: mapToCoords(secondaryCriticalPowerCurve.value),
        borderColor: "rgb(15, 92, 192)",
      },
    ],
  };
});

const tickParser = (tickValue: string | number): string => {
  if (typeof tickValue === "string") {
    return tickValue;
  }

  const duration = Duration.fromMillis(tickValue).shiftToAll();

  if (duration.hours >= 1) {
    if (duration.minutes === 0 && duration.seconds === 0) {
      return `${duration.hours}h`;
    }
  }

  if (duration.minutes >= 1) {
    if (duration.seconds === 0) {
      return `${duration.minutes}m`;
    }
  }

  if (duration.seconds === 1 || duration.seconds === 15) {
    return `${duration.seconds}s`;
  }

  return "";
};

const options: ChartOptions<"line"> = {
  animation: false,
  parsing: false,
  maintainAspectRatio: false,
  interaction: {
    mode: "nearest",
    // axis: "x",
    intersect: false,
  },
  scales: {
    x: {
      type: "logarithmic",
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        callback: tickParser,
      },
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: (item) =>
          Duration.fromMillis(item[0].raw.x).toFormat("hh:mm:ss"),
        label: (item) => `${item.raw.y.toFixed(0)}w`,
      },
    },
  },
};
</script>
