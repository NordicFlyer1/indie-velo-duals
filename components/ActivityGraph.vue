<template>
  <div class="relative">
    <client-only>
      <button
        v-if="isZoomed"
        class="border text-sm border-gray-500 backdrop-blur shadow rounded absolute p-2 top-7 left-10"
        @click="resetZoom"
      >
        Reset Zoom
      </button>
      <Line
        ref="chartRef"
        :plugins="[chartPluginHoverLine]"
        :data="data"
        :options="options"
      />
    </client-only>
  </div>
</template>
<script setup lang="ts">
import { Line } from "vue-chartjs";
import { ChartOptions, ChartData, ChartDataset, Chart } from "chart.js";
const chartRef = ref();

const { records, currentRecordIndex } = workoutFileStoreToRefs();
const store = useWorkoutFileStore();

const isZoomed = ref(false);

watch(currentRecordIndex, (value) => {
  const chart = chartRef.value.chart as Chart;
  const activeElements = chart.tooltip?.getActiveElements();
  if (activeElements?.length && activeElements[0].index === value) {
    return;
  }

  chartRef.value.chart.tooltip.setActiveElements(
    [{ datasetIndex: 0, index: value }],
    {
      x: 0,
      y: 0,
    }
  );
  chartRef.value.chart.update();
});

const commonDatasetOptions: Partial<ChartDataset<"line">> = {
  pointStyle: false,
  tension: 0.5,
  borderWidth: 1,
};

const data = computed<ChartData<"line">>(() => {
  const power = records.value?.map((val) => ({
    x: new Date(val.timestamp).getTime(),
    y: val.power,
  }));

  const secondary = records.value?.map((val) => ({
    x: new Date(val.timestamp).getTime(),
    y: val["Powermeter Power"],
  }));

  const cadence = records.value?.map((val) => ({
    x: new Date(val.timestamp).getTime(),
    y: val.cadence,
  }));

  const hrm = records.value?.map((val) => ({
    x: new Date(val.timestamp).getTime(),
    y: val.heart_rate,
  }));

  return {
    datasets: [
      {
        ...commonDatasetOptions,
        label: "Primary",
        data: power,
        borderColor: "rgb(75, 192, 192)",
      },
      {
        ...commonDatasetOptions,
        label: "Secondary",
        data: secondary,
        borderColor: "rgb(125, 92, 192)",
      },
      {
        ...commonDatasetOptions,
        label: "Cadence",
        data: cadence,
        borderColor: "rgb(125, 2, 92)",
      },
      {
        ...commonDatasetOptions,
        label: "Heart rate",
        data: hrm,
        borderColor: "rgb(255, 50, 50)",
      },
    ],
  };
});

const options: ChartOptions<"line"> = {
  animation: false,
  parsing: false,
  maintainAspectRatio: false,
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  scales: {
    x: {
      type: "time",
      ticks: {
        source: "auto",
        maxRotation: 0,
        autoSkip: true,
      },
    },
  },
  plugins: {
    zoom: {
      zoom: {
        mode: "x",
        drag: {
          enabled: true,
          backgroundColor: "rgba(150,150,150,50)",
        },
        onZoom: () => (isZoomed.value = true),
      },
    },
  },
  onHover: (_event, elements) => {
    if (elements.length && store) {
      store.setCurrentRecordIndex(elements[0].index);
    }
  },
};

function resetZoom() {
  chartRef.value.chart.resetZoom("default");
  isZoomed.value = false;
}
</script>
