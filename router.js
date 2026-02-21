(function () {
  function setActiveView(viewName) {
    document.querySelectorAll(".tab").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.view === viewName);
    });
    document.querySelectorAll(".view").forEach(v => v.classList.remove("active"));
    const viewEl = document.getElementById(`view-${viewName}`);
    if (viewEl) viewEl.classList.add("active");
  }

  window.Router = {
    setActiveView,
    initTabs() {
      const tabs = document.getElementById("tabs");
      tabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab");
        if (!btn) return;
        setActiveView(btn.dataset.view);
      });
    }
  };
})();