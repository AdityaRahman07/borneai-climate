/**
 * BorneAI — js/charts.js
 * Chart.js — tema Sky Blue + Kuning Muda + Coral
 */

function defaultOptions(overrides = {}) {
  return Object.assign({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(12,42,74,0.92)",
        titleColor: "#38bdf8",
        bodyColor: "#fff",
        padding: 10,
        cornerRadius: 8,
      },
    },
  }, overrides);
}

function initAQIChart() {
  const ctx = document.getElementById("aqiChart");
  if (!ctx) return;
  new Chart(ctx, {
    type: "line",
    data: {
      labels: AQI_DATA.labels,
      datasets: [
        {
          label: "AQI Rata-rata",
          data: AQI_DATA.values,
          borderColor: "#0ea5e9",
          backgroundColor: "rgba(56,189,248,0.12)",
          fill: true, tension: 0.4,
          pointBackgroundColor: AQI_DATA.values.map(v => v > AQI_DATA.threshold ? "#ef4444" : "#0ea5e9"),
          pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5,
        },
        {
          label: `Batas Sehat (${AQI_DATA.threshold})`,
          data: Array(AQI_DATA.labels.length).fill(AQI_DATA.threshold),
          borderColor: "#fb923c",
          borderDash: [6,4], borderWidth: 1.5,
          pointRadius: 0, fill: false,
        },
      ],
    },
    options: defaultOptions({
      scales: {
        y: { beginAtZero:true, max:180, grid:{ color:"rgba(14,165,233,0.08)" }, ticks:{ callback: v => v+" AQI", font:{size:11} } },
        x: { grid:{ display:false }, ticks:{ font:{size:11} } },
      },
      plugins: {
        legend: { display:false },
        tooltip: {
          backgroundColor:"rgba(12,42,74,0.92)", titleColor:"#38bdf8", bodyColor:"#fff", padding:10, cornerRadius:8,
          callbacks: { label: ctx => ` AQI: ${ctx.parsed.y}` },
        },
      },
    }),
  });
}

function initDeforChart() {
  const ctx = document.getElementById("deforChart");
  if (!ctx) return;
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: DEFOR_DATA.labels,
      datasets: [{
        label: "Deforestasi (ribu Ha)",
        data: DEFOR_DATA.values,
        backgroundColor: DEFOR_DATA.colors,
        borderRadius: 8, borderSkipped: false,
      }],
    },
    options: defaultOptions({
      scales: {
        y: { grid:{ color:"rgba(14,165,233,0.08)" }, ticks:{ callback: v => v+" ribu Ha", font:{size:11} } },
        x: { grid:{ display:false }, ticks:{ font:{size:11} } },
      },
      plugins: {
        legend: { display:false },
        tooltip: {
          backgroundColor:"rgba(12,42,74,0.92)", titleColor:"#38bdf8", bodyColor:"#fff", padding:10, cornerRadius:8,
          callbacks: { label: ctx => ` ${ctx.parsed.y} ribu Ha` },
        },
      },
    }),
  });
}

function initTempChart() {
  const ctx = document.getElementById("tempChart");
  if (!ctx) return;
  new Chart(ctx, {
    type: "line",
    data: {
      labels: TEMP_DATA.labels,
      datasets: [{
        label: "Anomali Suhu (°C)",
        data: TEMP_DATA.values,
        borderColor: "#fb923c",
        backgroundColor: "rgba(251,146,60,0.1)",
        fill: true, tension: 0.35,
        pointBackgroundColor: TEMP_DATA.values.map(v => v > 0.8 ? "#ef4444" : v > 0.5 ? "#fb923c" : "#fde68a"),
        pointRadius: 5, pointHoverRadius: 7, borderWidth: 2.5,
      }],
    },
    options: defaultOptions({
      scales: {
        y: {
          grid:{ color:"rgba(14,165,233,0.08)" },
          ticks:{ callback: v => "+"+v.toFixed(1)+"°C", font:{size:11} },
          title:{ display:true, text:"°C vs Baseline 1990–2020", font:{size:11}, color:"#4e7a96" },
        },
        x: { grid:{ display:false }, ticks:{ font:{size:11} } },
      },
      plugins: {
        legend: { display:false },
        tooltip: {
          backgroundColor:"rgba(90,10,10,0.92)", titleColor:"#fca5a5", bodyColor:"#fff", padding:10, cornerRadius:8,
          callbacks: { label: ctx => ` Anomali: +${ctx.parsed.y.toFixed(1)}°C` },
        },
      },
    }),
  });
}

function initCharts() {
  initAQIChart();
  initDeforChart();
  initTempChart();
}