(function () {
  function formatValue(v) {
    if (v === null || v === undefined) return "--";
    if (typeof v === "number") {
      // Keep it simple for demo
      return Number.isInteger(v) ? String(v) : v.toFixed(2);
    }
    return String(v);
  }

  function applyTagMap(tagMap) {
    document.querySelectorAll("[data-tag]").forEach(el => {
      const key = el.getAttribute("data-tag");
      if (!key) return;
      if (!(key in tagMap)) return; // leave placeholder
      el.textContent = formatValue(tagMap[key]);
    });
  }

  function setProjectTitle(name) {
    const el = document.getElementById("projectTitle");
    if (el) el.textContent = name;
  }

  function setStrategySelect(value) {
    const sel = document.getElementById("strategySelect");
    if (!sel) return;
    if (value) sel.value = value;
  }

  function buildPackGrid(packCount = 4) {
    const container = document.getElementById("packGrid");
    if (!container) return;
    container.innerHTML = "";

    for (let i = 1; i <= packCount; i++) {
      const card = document.createElement("div");
      card.className = "pack-card";
      card.innerHTML = `
        <div class="pack-head">
          <div class="pack-title">Pack_i=${i}</div>
          <div class="muted"></div>
        </div>

        <div class="pack-body">
          <div class="pack-left">
            <div class="kvline">
              <div class="kvname">V_i(t)</div>
              <div class="value-box" data-tag="pack.${i}.v">--</div>
              <div class="unit">(V)</div>
            </div>
            <div class="kvline">
              <div class="kvname">I_i(t)</div>
              <div class="value-box" data-tag="pack.${i}.i">--</div>
              <div class="unit">(A)</div>
            </div>
            <div class="kvline">
              <div class="kvname">SOC_i(t)</div>
              <div class="value-box" data-tag="pack.${i}.soc">--</div>
              <div class="unit">(%)</div>
            </div>
            <div class="kvline">
              <div class="kvname">SOH_i(t)</div>
              <div class="value-box" data-tag="pack.${i}.soh">--</div>
              <div class="unit">(%)</div>
            </div>
          </div>

          <div class="pack-right">
            <div class="temp-grid">
              <div class="kvline">
                <div class="kvname">T_i_1</div>
                <div class="value-box" data-tag="pack.${i}.t.1">--</div>
                <div class="unit">(°C)</div>
              </div>
              <div class="kvline">
                <div class="kvname">T_i_2</div>
                <div class="value-box" data-tag="pack.${i}.t.2">--</div>
                <div class="unit">(°C)</div>
              </div>
              <div class="kvline">
                <div class="kvname">T_i_3</div>
                <div class="value-box" data-tag="pack.${i}.t.3">--</div>
                <div class="unit">(°C)</div>
              </div>
              <div class="kvline">
                <div class="kvname">T_i_4</div>
                <div class="value-box" data-tag="pack.${i}.t.4">--</div>
                <div class="unit">(°C)</div>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(card);
    }
  }

  window.UIBinder = {
    applyTagMap,
    setProjectTitle,
    setStrategySelect,
    buildPackGrid
  };
})();
