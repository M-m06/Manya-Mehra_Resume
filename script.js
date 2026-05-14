const canvas = document.getElementById("signalCanvas");
const ctx = canvas.getContext("2d");
const portrait = document.querySelector(".about-photo img");

if (portrait) {
  const showMissingPortrait = () => {
    const frame = portrait.closest(".about-photo");
    if (!frame) return;
    frame.classList.add("is-missing");
    portrait.remove();
  };

  portrait.addEventListener("error", showMissingPortrait);

  if (portrait.complete && portrait.naturalWidth === 0) {
    showMissingPortrait();
  }

  window.setTimeout(() => {
    if (document.body.contains(portrait) && portrait.naturalWidth === 0) {
      showMissingPortrait();
    }
  }, 300);
}

const resizeCanvas = () => {
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(rect.width * ratio);
  canvas.height = Math.floor(rect.height * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const points = Array.from({ length: 36 }, (_, index) => ({
  baseX: 0.08 + ((index * 37) % 84) / 100,
  baseY: 0.08 + ((index * 53) % 82) / 100,
  speed: 0.55 + (index % 7) * 0.08,
  radius: 2 + (index % 4) * 0.45,
}));

let frame = 0;

const draw = () => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  frame += 0.012;

  ctx.clearRect(0, 0, width, height);

  const backdrop = ctx.createLinearGradient(0, 0, width, height);
  backdrop.addColorStop(0, "#102024");
  backdrop.addColorStop(0.52, "#17342f");
  backdrop.addColorStop(1, "#56342f");
  ctx.fillStyle = backdrop;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x < width; x += 54) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += 54) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const rendered = points.map((point, index) => {
    const x = point.baseX * width + Math.sin(frame * point.speed + index) * 18;
    const y = point.baseY * height + Math.cos(frame * point.speed + index * 1.7) * 16;
    return { ...point, x, y };
  });

  rendered.forEach((a, index) => {
    rendered.slice(index + 1).forEach((b) => {
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 150) {
        ctx.strokeStyle = `rgba(146, 213, 202, ${0.22 - distance / 820})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    });
  });

  rendered.forEach((point, index) => {
    ctx.beginPath();
    ctx.fillStyle = index % 5 === 0 ? "#f0b45a" : index % 3 === 0 ? "#e37a68" : "#92d5ca";
    ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = "rgba(255,255,255,0.82)";
  ctx.font = "700 13px Inter, sans-serif";
  const labels = [
    ["Business Intelligence", 0.08, 0.18],
    ["Market Research", 0.62, 0.22],
    ["Competitive Benchmarking", 0.18, 0.4],
    ["Product Strategy", 0.68, 0.43],
    ["Growth Strategy", 0.12, 0.67],
    ["Stakeholder Engagement", 0.58, 0.68],
    ["Digital Transformation", 0.34, 0.82],
    ["AI Product Strategy", 0.35, 0.56],
    ["Financial Analytics", 0.72, 0.84],
    ["Data Analysis & Visualization", 0.28, 0.28],
  ];

  labels.forEach(([label, x, y]) => {
    ctx.fillText(label, width * x, height * y);
  });

  requestAnimationFrame(draw);
};

resizeCanvas();
draw();

window.addEventListener("resize", resizeCanvas);

document.querySelectorAll(".interactive-grid").forEach((grid) => {
  grid.querySelectorAll("details").forEach((card) => {
    card.addEventListener("toggle", () => {
      if (!card.open) return;
      grid.querySelectorAll("details").forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.open = false;
        }
      });
    });
  });
});
