/**
 * BorneAI — js/map.js
 * Peta Kalimantan menggunakan D3.js + world-atlas.
 * Zoom penuh ke Kalimantan, TANPA overlay apapun yang menutupi peta.
 * Hanya: background laut → daratan → label → marker hotspot → tooltip.
 */

function initMap() {
  const container = document.getElementById("indonesia-map-container");
  if (!container) return;

  container.innerHTML = `<div class="map-loading">Memuat peta Kalimantan...</div>`;

  const W = 680, H = 340;

  // Proyeksi dikalibrasi ke bounding box Kalimantan
  // Lon: 108°E – 119°E  |  Lat: 7°N – 4.5°S
  const projection = d3.geoMercator()
    .center([113.8, 0.8])
    .scale(1500)
    .translate([W / 2, H / 2]);

  const pathGen = d3.geoPath().projection(projection);

  fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-10m.json")
    .then(r => { if (!r.ok) throw new Error("fetch failed"); return r.json(); })
    .then(world => {
      container.innerHTML = "";

      const svg = d3.select(container)
        .append("svg")
        .attr("viewBox", `0 0 ${W} ${H}`)
        .attr("role", "img")
        .attr("aria-label", "Peta Kalimantan dengan sebaran hotspot");

      const allCountries = topojson.feature(world, world.objects.countries);

      // 1. BACKGROUND LAUT
      svg.append("rect")
        .attr("width", W).attr("height", H)
        .attr("fill", "#bfdbfe"); // biru muda serasi tema sky

      // 2. NEGARA TETANGGA — abu sangat tipis (Malaysia, Brunei, dll.)
      //    ID numerik Natural Earth: Malaysia=458, Brunei=96
      const neighborIds = new Set(["458", "096"]);
      svg.append("g")
        .selectAll("path")
        .data(allCountries.features.filter(d => neighborIds.has(String(d.id))))
        .enter().append("path")
        .attr("d", pathGen)
        .attr("fill", "#d1fae5")
        .attr("stroke", "#a7f3d0")
        .attr("stroke-width", 0.6);

      // 3. INDONESIA (id=360) — hijau natural, SATU warna, tanpa overlay
      const indonesia = allCountries.features.find(d => String(d.id) === "360");
      if (indonesia) {
        svg.append("path")
          .datum(indonesia)
          .attr("d", pathGen)
          .attr("fill", "#4ade80")      // hijau segar
          .attr("stroke", "#ffffff")
          .attr("stroke-width", 0.7)
          .attr("opacity", 0.88);
      }

      // 4. GARIS KHATULISTIWA
      const eqY = projection([0, 0])[1];
      if (eqY > 0 && eqY < H) {
        svg.append("line")
          .attr("x1", 0).attr("x2", W)
          .attr("y1", eqY).attr("y2", eqY)
          .attr("stroke", "rgba(255,255,255,0.5)")
          .attr("stroke-width", 0.8)
          .attr("stroke-dasharray", "5,4");
        svg.append("text")
          .attr("x", 8).attr("y", eqY - 4)
          .attr("fill", "rgba(255,255,255,0.65)")
          .attr("font-size", "8px")
          .attr("font-family", "monospace")
          .text("0° Khatulistiwa");
      }

      // 5. LABEL PROVINSI
      const labelG = svg.append("g");
      ISLAND_LABELS.forEach(({ name, lat, lon }) => {
        const [x, y] = projection([lon, lat]);
        if (x < 5 || x > W - 5 || y < 5 || y > H - 5) return;
        labelG.append("text")
          .attr("x", x).attr("y", y)
          .attr("text-anchor", "middle")
          .attr("fill", "rgba(12,42,74,0.75)")
          .attr("font-size", name.startsWith("★") ? "8px" : "8.5px")
          .attr("font-family", "sans-serif")
          .attr("font-weight", "bold")
          .attr("letter-spacing", "0.5px")
          .attr("pointer-events", "none")
          .text(name);
      });

      // 6. TOOLTIP element
      const tooltip = document.getElementById("map-tooltip");
      function showTip(event, d) {
        if (!tooltip) return;
        const rect = container.getBoundingClientRect();
        let tx = event.clientX - rect.left + 14;
        let ty = event.clientY - rect.top - 14;
        // jangan keluar container kanan
        if (tx + 190 > W) tx = tx - 200;
        tooltip.style.display = "block";
        tooltip.style.left = tx + "px";
        tooltip.style.top  = ty + "px";
        const statusIcon = d.level === "danger" ? "🔴 SIAGA" : d.level === "warn" ? "🟡 WASPADA" : "🟢 AMAN";
        tooltip.innerHTML = `
          <strong>${d.name}</strong>
          AQI: ${d.aqi}<br>
          Hotspot: ${d.count} titik<br>
          Status: ${statusIcon}
        `;
      }
      function hideTip() { if (tooltip) tooltip.style.display = "none"; }

      // 7. HOTSPOT MARKERS
      function markerColor(level) {
        if (level === "danger") return "#ef4444";
        if (level === "warn")   return "#fb923c";
        return "#22c55e";
      }

      const markerG = svg.append("g");
      HOTSPOT_MARKERS.forEach(d => {
        const [x, y] = projection([d.lon, d.lat]);
        if (x < 0 || x > W || y < 0 || y > H) return;

        const g = markerG.append("g")
          .attr("transform", `translate(${x},${y})`)
          .style("cursor", "pointer")
          .on("mouseover", e => showTip(e, d))
          .on("mousemove", e => showTip(e, d))
          .on("mouseout",  hideTip);

        // Pulse ring animasi
        const ring = g.append("circle")
          .attr("r", 8).attr("fill", "none")
          .attr("stroke", markerColor(d.level))
          .attr("stroke-width", 1.5).attr("opacity", 0.7);

        function pulse() {
          ring.attr("r", 7).attr("opacity", 0.8)
            .transition().duration(1600).ease(d3.easeSinOut)
            .attr("r", d.level === "danger" ? 20 : 14)
            .attr("opacity", 0)
            .on("end", pulse);
        }
        pulse();

        // Dot utama
        g.append("circle")
          .attr("r", d.level === "danger" ? 6 : 4)
          .attr("fill", markerColor(d.level))
          .attr("stroke", "#fff").attr("stroke-width", 1.5);

        // Label di atas marker
        if (d.level !== "ok") {
          g.append("text")
            .attr("y", -10).attr("text-anchor", "middle")
            .attr("fill", d.level === "danger" ? "#fca5a5" : "#fed7aa")
            .attr("font-size", "8px").attr("font-family", "sans-serif")
            .attr("font-weight", "bold").attr("pointer-events", "none")
            .text(d.name + " ⚠");
        }
      });

      // 8. SENSOR BADGE — pojok kanan bawah
      svg.append("rect")
        .attr("x", W - 130).attr("y", H - 26)
        .attr("width", 122).attr("height", 20)
        .attr("rx", 6).attr("fill", "rgba(12,42,74,0.72)");
      svg.append("text")
        .attr("x", W - 69).attr("y", H - 12)
        .attr("text-anchor", "middle")
        .attr("fill", "#7dd3fc")
        .attr("font-size", "8.5px").attr("font-family", "monospace").attr("font-weight", "bold")
        .text("🛰 847 Sensor Aktif");

    })
    .catch(err => {
      console.error("Map error:", err);
      container.innerHTML = `
        <div class="map-loading" style="color:#fb923c;flex-direction:column;gap:12px">
          <span>⚠ Gagal memuat peta.</span>
          <span style="font-size:0.75rem">Pastikan ada koneksi internet untuk memuat data GeoJSON.</span>
        </div>`;
    });
}