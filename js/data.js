/**
 * BorneAI — AI for Climate Monitoring Kalimantan
 * js/data.js — semua data fokus Kalimantan (6 Provinsi)
 *
 * Tema warna:
 *   --sky    : #38bdf8  (sky blue)
 *   --yellow : #fde68a  (kuning muda)
 *   --coral  : #fb923c  (coral/terracotta — warna pendukung)
 */

// =============================================
// METRIC CARDS
// =============================================
const METRICS = [
  {
    label: "Rata-rata AQI Kalimantan",
    value: "108",
    color: "#fb923c",
    change: "▲ +18 dari kemarin",
    changeClass: "text-up",
  },
  {
    label: "Suhu Rata-rata (°C)",
    value: "30.7°",
    color: "#ef4444",
    change: "▲ +0.9° dari normal",
    changeClass: "text-up",
  },
  {
    label: "Tutupan Hutan (%)",
    value: "56.4%",
    color: "#0ea5e9",
    change: "▼ -0.5% (2024→2025)",
    changeClass: "text-down",
  },
  {
    label: "Hotspot Aktif (30 hr)",
    value: "687",
    color: "#fb923c",
    change: "▲ +43 dari bulan lalu",
    changeClass: "text-up",
  },
];

// =============================================
// CHART — AQI Bulanan 2025 (Kalimantan)
// =============================================
const AQI_DATA = {
  labels: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"],
  values: [55, 50, 65, 72, 108, 125, 155, 148, 110, 72, 58, 54],
  threshold: 100,
};

// =============================================
// CHART — Deforestasi per Provinsi Kalimantan
// =============================================
const DEFOR_DATA = {
  labels: ["Kalteng","Kalbar","Kaltim","Kalsel","Kalut","Kaltara"],
  values: [342, 218, 156, 94, 62, 48],
  colors: ["#ef4444","#fb923c","#fde68a","#38bdf8","#7dd3fc","#bae6fd"],
};

// =============================================
// CHART — Anomali Suhu Kalimantan
// =============================================
const TEMP_DATA = {
  labels: ["2015","2016","2017","2018","2019","2020","2021","2022","2023","2024","2025*"],
  values: [0.3, 0.7, 0.4, 0.5, 0.8, 0.6, 0.5, 0.8, 0.9, 1.1, 1.3],
};

// =============================================
// AI PREDICTIONS
// =============================================
const PREDICTIONS = [
  {
    label: "🔥 Kebakaran Hutan",
    pct: 78,
    gradient: "linear-gradient(90deg,#fb923c,#ef4444)",
  },
  {
    label: "🌊 Banjir Sungai",
    pct: 52,
    gradient: "linear-gradient(90deg,#38bdf8,#0284c7)",
  },
  {
    label: "🏜️ Kekeringan Lahan Gambut",
    pct: 65,
    gradient: "linear-gradient(90deg,#fde68a,#f59e0b)",
  },
  {
    label: "🌫️ Asap & Polusi Udara",
    pct: 70,
    gradient: "linear-gradient(90deg,#94a3b8,#475569)",
  },
];

// =============================================
// PROVINCE TABLE — 6 Provinsi Kalimantan
// =============================================
const PROVINCES = [
  { provinsi:"Kalimantan Tengah", aqi:128, suhu:31.2, hutan:"47.8%", hotspot:342, status:"SIAGA"   },
  { provinsi:"Kalimantan Barat",  aqi:94,  suhu:30.1, hutan:"52.4%", hotspot:218, status:"SIAGA"   },
  { provinsi:"Kalimantan Timur",  aqi:86,  suhu:29.8, hutan:"61.0%", hotspot:156, status:"WASPADA" },
  { provinsi:"Kalimantan Selatan",aqi:79,  suhu:30.4, hutan:"35.6%", hotspot:94,  status:"WASPADA" },
  { provinsi:"Kalimantan Utara",  aqi:42,  suhu:28.6, hutan:"78.3%", hotspot:62,  status:"BAIK"    },
  { provinsi:"Kalimantan Tengah (IKN)", aqi:55, suhu:29.5, hutan:"72.1%", hotspot:15, status:"BAIK" },
];

// =============================================
// GOOD NEWS — Berita baik Kalimantan
// =============================================
const NEWS = [
  {
    date: "16 MEI 2025",
    title: "Kalimantan Utara Pertahankan 2,3 Juta Ha Hutan Primer dari Perambahan",
    source: "KLHK",
    tag: "Hutan",
    color: "#0ea5e9",
  },
  {
    date: "13 MEI 2025",
    title: "Program Restorasi Lahan Gambut Kalteng Capai 180.000 Ha — Melampaui Target",
    source: "BRGM",
    tag: "Gambut",
    color: "#fde68a",
    tagText: "#92400e",
  },
  {
    date: "10 MEI 2025",
    title: "PLTS Terapung di Waduk Riam Kanan Kalsel Mulai Produksi 10 MW",
    source: "ESDM",
    tag: "Energi Hijau",
    color: "#fb923c",
  },
  {
    date: "7 MEI 2025",
    title: "Sensor AI Pemantau Hotspot Berbasis LoRa Terpasang di 120 Titik Kaltim",
    source: "LAPAN",
    tag: "Teknologi",
    color: "#38bdf8",
  },
];

// =============================================
// SDG PROGRESS — Kalimantan
// =============================================
const SDG_ITEMS = [
  {
    icon: "🌳",
    iconBg: "#e0f2fe",
    name: "Restorasi Hutan & Gambut",
    pct: 58,
    color: "#0ea5e9",
    barBg: "#e0f2fe",
    desc: "Target: 2 juta Ha pada 2030 · Progress: 1.16 juta Ha",
    borderColor: "#0ea5e9",
  },
  {
    icon: "⚡",
    iconBg: "#fef9c3",
    name: "Energi Terbarukan",
    pct: 41,
    color: "#ca8a04",
    barBg: "#fef9c3",
    desc: "Target: 30% bauran EBT 2030 · Progress: 12.3% saat ini",
    borderColor: "#eab308",
  },
  {
    icon: "🔥",
    iconBg: "#fff7ed",
    name: "Reduksi Kebakaran Hutan",
    pct: 34,
    color: "#fb923c",
    barBg: "#fff7ed",
    desc: "Target: <50 hotspot/bulan pada 2030 · Saat ini: 687 titik",
    borderColor: "#fb923c",
  },
];

// =============================================
// HERO COUNTERS
// =============================================
const HERO_COUNTERS = {
  provinsi: 6,
  sensor: 847,
  akurasi: 97.2,
};

// =============================================
// MAP — Hotspot markers Kalimantan (lat, lon)
// =============================================
const HOTSPOT_MARKERS = [
  { name:"Kalteng",  lat:-1.70, lon:113.9, level:"danger", count:342, aqi:128 },
  { name:"Kalbar",   lat: 0.00, lon:109.3, level:"danger", count:218, aqi: 94 },
  { name:"Kaltim",   lat: 0.50, lon:116.8, level:"warn",   count:156, aqi: 86 },
  { name:"Kalsel",   lat:-3.30, lon:115.3, level:"warn",   count: 94, aqi: 79 },
  { name:"Kalut",    lat: 1.20, lon:114.8, level:"ok",     count: 62, aqi: 42 },
  { name:"IKN",      lat:-0.80, lon:117.0, level:"ok",     count: 15, aqi: 55 },
];

// Label pulau & kota penting
const ISLAND_LABELS = [
  { name:"KALIMANTAN TENGAH", lat:-1.5,  lon:113.5 },
  { name:"KALIMANTAN BARAT",  lat: 0.5,  lon:110.2 },
  { name:"KALIMANTAN TIMUR",  lat: 1.2,  lon:116.0 },
  { name:"KALIMANTAN SELATAN",lat:-3.1,  lon:115.5 },
  { name:"KALIMANTAN UTARA",  lat: 3.0,  lon:116.0 },
  { name:"★ IKN",             lat:-0.7,  lon:117.2 },
];