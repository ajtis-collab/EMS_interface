(function () {
  let currentProject = "BESS_Project_1";
  let currentData = null;
  let currentSeriesKey = "series.total_energy";

  function pad2(n){ return String(n).padStart(2,"0"); }
  function formatClock(d){
    return `${d.getFullYear()}.${pad2(d.getMonth()+1)}.${pad2(d.getDate())}, ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
  }
  function startClock(){
    const el = document.getElementById("clockBox");
    setInterval(() => {
      el.textContent = formatClock(new Date());
    }, 500);
  }

  function setActiveProjectButton(projectName){
    document.querySelectorAll(".project-item").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.project === projectName);
    });
  }

  function setActiveChartChip(seriesKey){
    document.querySelectorAll(".chip").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.series === seriesKey);
    });
  }

  function updateChart(){
    const canvas = document.getElementById("overallChart");
    const legend = document.getElementById("chartLegend");
    if (!canvas || !currentData) return;

    const series = (currentData.series && currentData.series[currentSeriesKey]) ? currentData.series[currentSeriesKey] : [];
    Chart.drawSeries(canvas, series);
    if (legend) legend.textContent = currentSeriesKey;
  }

  function applyData(dataObj){
    currentData = dataObj;
    // title
    UIBinder.setProjectTitle(currentProject);

    // tag values
    const tagMap = dataObj.tagMap || {};
    UIBinder.applyTagMap(tagMap);

    // strategy drop-down (UI-only)
    UIBinder.setStrategySelect(tagMap["overall.current_strategy"] || "Pattern 1");

    // chart
    updateChart();
  }

  async function loadProject(projectName){
    currentProject = projectName;
    setActiveProjectButton(projectName);
    UIBinder.setProjectTitle(projectName);

    const dataObj = await DataProvider.loadProjectData(projectName);
    applyData(dataObj);
  }

  function initProjectNav(){
    const nav = document.getElementById("projectNav");
    nav.addEventListener("click", async (e) => {
      const btn = e.target.closest(".project-item");
      if (!btn) return;
      await loadProject(btn.dataset.project);
    });
  }

  function initChartTabs(){
    const tabs = document.getElementById("chartTabs");
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(".chip");
      if (!btn) return;
      currentSeriesKey = btn.dataset.series;
      setActiveChartChip(currentSeriesKey);
      updateChart();
    });
  }

  function initStrategySelect(){
    const sel = document.getElementById("strategySelect");
    if (!sel) return;
    sel.addEventListener("change", () => {
      // UI only: reflect selection into the display field
      const display = document.querySelector('[data-tag="overall.current_strategy"]');
      if (display) display.textContent = sel.value;
    });
  }

  function initFileLoader(){
    const input = document.getElementById("fileInput");
    if (!input) return;
    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) return;
      try{
        const obj = await DataProvider.loadFromFile(file);
        // keep current project title but mark as "local"
        currentProject = obj?.meta?.project ? obj.meta.project : "Local File";
        UIBinder.setProjectTitle(currentProject);
        setActiveProjectButton(""); // none
        applyData(obj);
      }catch(err){
        alert(err.message || String(err));
      }finally{
        input.value = "";
      }
    });
  }

  async function init(){
    Router.initTabs();
    initProjectNav();
    initChartTabs();
    initStrategySelect();
    initFileLoader();

    UIBinder.buildPackGrid(4);
    startClock();

    // default
    setActiveChartChip(currentSeriesKey);
    await loadProject(currentProject);
  }

  window.addEventListener("DOMContentLoaded", init);
})();