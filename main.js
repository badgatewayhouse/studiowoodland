// ─── Hamburger menu ─────────────────────────────────────────────
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', open);
});

// Close menu when a nav link is clicked
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', false);
  });
});

// ─── Build grids ───────────────────────────────────────────────
function buildGrid(containerId, items) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';
  items.forEach((a, i) => {
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.dataset.index = i;
    div.onclick = () => openViewer(i);

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

// ─── Viewer (vertical feed) ────────────────────────────────────
// One tap opens a full-screen feed at that piece; scroll moves
// between works. Close: ✕, Escape, or the phone's back button.
const viewer = document.getElementById('viewer');
const viewerFeed = document.getElementById('viewer-feed');

function buildViewer() {
  viewerFeed.innerHTML = '';
  artworks.forEach((a, i) => {
    const slide = document.createElement('div');
    slide.className = 'viewer-slide';

    if (a.image) {
      const img = document.createElement('img');
      img.src = a.image;
      img.alt = a.title;
      img.loading = 'lazy';
      slide.appendChild(img);
    } else {
      const ph = document.createElement('div');
      ph.className = 'viewer-placeholder';
      ph.style.background = a.color + '20';
      ph.style.color = a.color;
      ph.textContent = a.title;
      slide.appendChild(ph);
    }

    const cap = document.createElement('div');
    cap.className = 'viewer-cap';
    const title = document.createElement('span');
    title.className = 'viewer-title';
    title.textContent = a.title;
    const count = document.createElement('span');
    count.className = 'viewer-count';
    count.textContent = `${i + 1} / ${artworks.length}`;
    cap.append(title, count);
    slide.appendChild(cap);

    viewerFeed.appendChild(slide);
  });
}

buildViewer();

function openViewer(index) {
  viewer.classList.add('open');
  document.body.style.overflow = 'hidden';
  viewerFeed.scrollTop = index * viewerFeed.clientHeight;
  history.pushState({ viewer: true }, '');
  document.getElementById('viewer-close').focus();
}

function closeViewer(fromHistory) {
  if (!viewer.classList.contains('open')) return;
  viewer.classList.remove('open');
  document.body.style.overflow = '';
  if (!fromHistory && history.state && history.state.viewer) history.back();
}

// Phone back button (and browser back) closes the viewer
window.addEventListener('popstate', () => closeViewer(true));

function stepViewer(dir) {
  const h = viewerFeed.clientHeight;
  const target = Math.max(0, Math.min(artworks.length - 1, Math.round(viewerFeed.scrollTop / h) + dir));
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  viewerFeed.scrollTo({ top: target * h, behavior: smooth ? 'smooth' : 'auto' });
}

// ─── Keyboard nav ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (!viewer.classList.contains('open')) return;
  if (e.key === 'Escape') closeViewer();
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); stepViewer(1); }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); stepViewer(-1); }
});

// ─── Page routing ──────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  window.scrollTo(0, 0);
}

// ─── Footer year ───────────────────────────────────────────────
document.getElementById('yr').textContent = new Date().getFullYear();
