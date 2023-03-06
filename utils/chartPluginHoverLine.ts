import { Chart, Plugin } from "chart.js";

export default {
  id: "hoverLine",
  afterDraw: (chart: Chart<"line">) => {
    if (chart.tooltip?._active?.length) {
      const x = chart.tooltip._active[0].element.x;
      const yAxis = chart.scales.y;
      const ctx = chart.ctx;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, yAxis.top);
      ctx.lineTo(x, yAxis.bottom);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#ff0000";
      ctx.stroke();
      ctx.restore();
    }
  },
} satisfies Plugin;
