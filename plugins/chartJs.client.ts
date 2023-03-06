import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  TimeScale,
  LogarithmicScale,
} from "chart.js";

import "chartjs-adapter-luxon";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  ArcElement,
  TimeScale,
  LogarithmicScale,
  zoomPlugin
);

export default defineNuxtPlugin(() => {});
