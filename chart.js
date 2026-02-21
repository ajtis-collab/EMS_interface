(function () {
  function drawGrid(ctx, w, h) {
    ctx.save();
    ctx.strokeStyle = "rgba(156,255,106,0.22)";
    ctx.lineWidth = 1;

    const stepX = 60;
    const stepY = 40;

    for (let x = 0; x <= w; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y <= h; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSeries(canvas, points) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    // background
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    drawGrid(ctx, w, h);

    if (!points || points.length === 0) return;

    const xs = points.map(p => p.v);
    const minV = Math.min(...xs);
    const maxV = Math.max(...xs);
    const span = Math.max(1e-9, maxV - minV);

    // padding
    const padL = 20;
    const padR = 10;
    const padT = 10;
    const padB = 20;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    function xPos(idx) {
      const n = points.length;
      if (n === 1) return padL;
      return padL + (idx / (n - 1)) * plotW;
    }
    function yPos(val) {
      const norm = (val - minV) / span;
      return padT + (1 - norm) * plotH;
    }

    // line
    ctx.save();
    ctx.strokeStyle = "#9cff6a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    points.forEach((p, idx) => {
      const x = xPos(idx);
      const y = yPos(p.v);
      if (idx === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.restore();

    // last point
    const last = points[points.length - 1];
    const lx = xPos(points.length - 1);
    const ly = yPos(last.v);

    ctx.save();
    ctx.fillStyle = "#9cff6a";
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  window.Chart = {
    drawSeries
  };
})();