(function () {
  async function loadProjectData(projectName) {
    const url = `data/${projectName}.json`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to load ${url}`);
    return await res.json();
  }

  function parseCSV(text) {
    // Very simple CSV: tag,value
    // Example:
    // solar.v,230.1
    // grid.p,1200
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const tagMap = {};
    for (const line of lines) {
      if (line.startsWith("#")) continue;
      const idx = line.indexOf(",");
      if (idx === -1) continue;
      const tag = line.slice(0, idx).trim();
      const val = line.slice(idx + 1).trim();
      tagMap[tag] = isFinite(Number(val)) ? Number(val) : val;
    }
    return { tagMap };
  }

  async function loadFromFile(file) {
    const text = await file.text();
    if (file.name.toLowerCase().endsWith(".json")) {
      const obj = JSON.parse(text);
      return obj;
    }
    if (file.name.toLowerCase().endsWith(".csv")) {
      // Convert CSV tag,value into a minimal data object
      const parsed = parseCSV(text);
      return {
        meta: { project: file.name, source: "csv" },
        tagMap: parsed.tagMap,
        series: {}
      };
    }
    throw new Error("Unsupported file type. Use .json or .csv");
  }

  window.DataProvider = {
    loadProjectData,
    loadFromFile
  };
})();