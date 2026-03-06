let currentIndex = 0;

// ─── Build grids ───────────────────────────────────────────────
function buildGrid(containerId, items) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.dataset.index = i;
    div.onclick = () => openLightbox(i);

    if (a.image) {
      div.innerHTML = `
        <img class="gallery-bg" src="${a.image}" alt="" aria-hidden="true" />
        <img class="gallery-img" src="${a.image}" alt="${a.title}" loading="lazy" />
        <div class="hover-label">
          <div class="piece-title">${a.title}</div>
          ${a.medium || a.year ? `<div class="piece-meta">${a.medium}${a.medium && a.year ? " · " : ""}${a.year}</div>` : ""}
        </div>`;
    } else {
      div.innerHTML = `
        <div class="placeholder" style="background:${a.color}20; color:${a.color};">
          ${a.title}
        </div>
        <div class="hover-label">
          <div class="piece-title">${a.title}</div>
          ${a.medium || a.year ? `<div class="piece-meta">${a.medium}${a.medium && a.year ? " · " : ""}${a.year}</div>` : ""}
        </div>`;
    }
    grid.appendChild(div);
  });
}

buildGrid('home-grid', artworks);

// ─── Lightbox ──────────────────────────────────────────────────
function openLightbox(index) {
  currentIndex = index;
  renderLightbox();
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLightbox() {
  const a = artworks[currentIndex];
  document.getElementById('lb-title').textContent = a.title;
  document.getElementById('lb-year').textContent = a.year;
  document.getElementById('lb-medium').textContent = a.medium;
  document.getElementById('lb-dimensions').textContent = a.dimensions;

  const seriesRow = document.getElementById('lb-series-row');
  if (a.series) {
    document.getElementById('lb-series').textContent = a.series;
    seriesRow.style.display = '';
  } else {
    seriesRow.style.display = 'none';
  }

  const noteEl = document.getElementById('lb-note');
  noteEl.textContent = a.note || '';
  noteEl.style.display = a.note ? '' : 'none';

  const img = document.getElementById('lb-img');
  const ph = document.getElementById('lb-placeholder');
  if (a.image) {
    img.src = a.image;
    img.alt = a.title;
    img.style.display = 'block';
    ph.style.display = 'none';
  } else {
    img.style.display = 'none';
    ph.style.display = 'flex';
    ph.style.background = a.color + '20';
    ph.style.color = a.color;
    ph.textContent = a.title;
  }
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

function handleLightboxClick(e) {
  if (e.target === document.getElementById('lightbox')) closeLightbox();
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + artworks.length) % artworks.length;
  renderLightbox();
}

// ─── Fullscreen ────────────────────────────────────────────────
function openFullscreen() {
  const a = artworks[currentIndex];
  const fs = document.getElementById('fullscreen');
  const fsImg = document.getElementById('fs-img');
  const fsPh = document.getElementById('fs-placeholder');
  if (a.image) {
    fsImg.src = a.image;
    fsImg.alt = a.title;
    fsImg.style.display = 'block';
    fsPh.style.display = 'none';
  } else {
    fsImg.style.display = 'none';
    fsPh.style.display = 'block';
    fsPh.textContent = a.title + ' — full resolution';
  }
  fs.classList.add('open');
}

function closeFullscreen() {
  document.getElementById('fullscreen').classList.remove('open');
}

// ─── Keyboard nav ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox').classList.contains('open');
  const fs = document.getElementById('fullscreen').classList.contains('open');
  if (fs) { if (e.key === 'Escape') closeFullscreen(); return; }
  if (lb) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft') navigate(-1);
  }
});

// ─── Page routing ──────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

// ─── Footer year ───────────────────────────────────────────────
document.getElementById('yr').textContent = new Date().getFullYear();
