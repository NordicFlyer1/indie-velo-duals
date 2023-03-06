<template>
  <div>
    <client-only>
      <Line ref="chartRef" :plugins="plugins" :data="data" :options="options" />
    </client-only>
  </div>
</template>
<script setup lang="ts">
import { ChartData, ChartOptions, ChartDataset, Plugin, Chart } from "chart.js";
import { Line } from "vue-chartjs";

const chartRef = ref();
const store = useWorkoutFileStore();
const { records, currentRecordIndex } = workoutFileStoreToRefs();

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
  chart.update();
});

const commonDatasetOptions: Partial<ChartDataset<"line">> = {
  pointStyle: false,
  tension: 0.5,
  borderWidth: 1,
};

const data = computed<ChartData<"line">>(() => {
  return {
    datasets: [
      {
        ...commonDatasetOptions,
        label: "test",
        data: records.value?.map((val) => ({
          x: new Date(val.timestamp).getTime(),
          y: val.altitude,
        })),
        borderColor: "rgb(75, 192, 192)",
      },
    ],
  };
});

const plugins: Plugin<"line">[] = [chartPluginHoverLine];
const options: ChartOptions<"line"> = {
  animation: false,
  parsing: false,
  maintainAspectRatio: false,
  normalized: true,
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
        autoSkip: true,
        maxRotation: 0,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      callbacks: {
        label: (item) => `${item.raw.y.toFixed()} m`,
      },
    },
  },
  onHover: (_event, elements) => {
    store?.setCurrentRecordIndex(elements[0].index);
  },
};
</script>
