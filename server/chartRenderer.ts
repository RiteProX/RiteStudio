/**
 * RitemastaPro - Pitch Deck Chart Renderer
 *
 * Renders PitchChart definitions (bar/pie/line) to PNG buffers using
 * chartjs-node-canvas, themed with the deck's color palette. Output
 * is embedded into slide HTML as a base64 data URL.
 */
import { ChartJSNodeCanvas } from "chartjs-node-canvas";
import * as ChartJSModule from "chart.js";
import type { PitchChart, PitchTheme } from "../src/types/pitchDeck";

// Ensure all chart types/scales/plugins are registered. chart.js v3's CJS
// build interacts awkwardly with esbuild's ESM->CJS interop: `import {
// Chart, registerables } from "chart.js"` can produce a namespace object
// where `registerables` is not directly iterable after bundling. Reading
// through the namespace defensively (with a `.default` fallback) avoids
// the "registerables is not iterable" runtime crash while still working
// in dev (Vite/ESM) and in the bundled CJS server.
const ChartJS: any = (ChartJSModule as any).default ?? ChartJSModule;
const Chart = ChartJS.Chart ?? (ChartJSModule as any).Chart;
const registerables = ChartJS.registerables ?? (ChartJSModule as any).registerables;

if (Chart && registerables && Array.isArray(registerables)) {
  Chart.register(...registerables);
}

const WIDTH = 760;
const HEIGHT = 420;

/** A small palette derived from the theme for multi-series charts */
function paletteFromTheme(theme: PitchTheme, count: number): string[] {
  const base = [theme.primaryColor, theme.secondaryColor, "#8A7A6A", "#B8A89A", "#4A3728"];
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(base[i % base.length]);
  return out;
}

export async function renderChartToDataUrl(chart: PitchChart, theme: PitchTheme): Promise<string> {
  const canvas = new ChartJSNodeCanvas({
    width: WIDTH,
    height: HEIGHT,
    backgroundColour: "white",
  });

  const palette = paletteFromTheme(theme, Math.max(chart.datasets.length, chart.labels.length));

  let config: any;

  if (chart.type === "pie") {
    config = {
      type: "pie",
      data: {
        labels: chart.labels,
        datasets: [
          {
            data: chart.datasets[0]?.data || [],
            backgroundColor: paletteFromTheme(theme, chart.labels.length),
            borderWidth: 1,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        plugins: {
          title: { display: !!chart.title, text: chart.title, font: { size: 18, family: theme.fontBody } },
          legend: { position: "right", labels: { font: { family: theme.fontBody, size: 13 } } },
        },
      },
    };
  } else if (chart.type === "line") {
    config = {
      type: "line",
      data: {
        labels: chart.labels,
        datasets: chart.datasets.map((ds, i) => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.color || palette[i],
          backgroundColor: (ds.color || palette[i]) + "33",
          tension: 0.25,
          fill: false,
          pointRadius: 4,
        })),
      },
      options: {
        plugins: {
          title: { display: !!chart.title, text: chart.title, font: { size: 18, family: theme.fontBody } },
          legend: { display: chart.datasets.length > 1, labels: { font: { family: theme.fontBody, size: 13 } } },
        },
        scales: {
          x: { title: { display: !!chart.xAxisLabel, text: chart.xAxisLabel, font: { family: theme.fontBody } } },
          y: { title: { display: !!chart.yAxisLabel, text: chart.yAxisLabel, font: { family: theme.fontBody } }, beginAtZero: true },
        },
      },
    };
  } else {
    // bar (supports grouped bars for multiple datasets)
    config = {
      type: "bar",
      data: {
        labels: chart.labels,
        datasets: chart.datasets.map((ds, i) => ({
          label: ds.label,
          data: ds.data,
          backgroundColor: ds.color || palette[i],
          borderRadius: 4,
        })),
      },
      options: {
        plugins: {
          title: { display: !!chart.title, text: chart.title, font: { size: 18, family: theme.fontBody } },
          legend: { display: chart.datasets.length > 1, labels: { font: { family: theme.fontBody, size: 13 } } },
        },
        scales: {
          x: { title: { display: !!chart.xAxisLabel, text: chart.xAxisLabel, font: { family: theme.fontBody } } },
          y: { title: { display: !!chart.yAxisLabel, text: chart.yAxisLabel, font: { family: theme.fontBody } }, beginAtZero: true },
        },
      },
    };
  }

  const buffer = await canvas.renderToBuffer(config);
  return `data:image/png;base64,${buffer.toString("base64")}`;
}

/** Render every chart present in a PitchDeckData-like object and return a map of dataUrls keyed by field name */
export async function renderAllCharts(
  charts: Record<string, PitchChart | undefined>,
  theme: PitchTheme
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const [key, chart] of Object.entries(charts)) {
    if (chart) {
      out[key] = await renderChartToDataUrl(chart, theme);
    }
  }
  return out;
}
