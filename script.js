/* ========= DOM helpers ========= */
const content   = document.getElementById('content');
const navBtns   = document.querySelectorAll('nav button');

navBtns.forEach(btn =>
  btn.addEventListener('click', () => {
    navBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    loadView(btn.dataset.view);
  })
);

/* ========= API calls ========= */
const API_BASE = 'https://api.thedogapi.com/v1';

async function loadView(view) {
  content.innerHTML = '<p>Loading…</p>';
  try {
    if (view === 'breeds')     await showBreeds();
    if (view === 'random')     await showRandomImage();
  } catch (err) {
    content.innerHTML = `<p class="error">⚠️ ${err.message}</p>`;
  }
}

/* ---- /breeds endpoint ---- */
async function showBreeds() {
  const res = await fetch(`${API_BASE}/breeds`);
  if (!res.ok) throw new Error('Failed to fetch breed list');
  const breeds = await res.json();

  content.innerHTML = '';
  breeds.forEach(breed => {
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <h2>${breed.name}</h2>
      <p><strong>Group:</strong> ${breed.breed_group || 'n/a'}</p>
      <p><strong>Life span:</strong> ${breed.life_span}</p>
      <p><strong>Temperament:</strong> ${breed.temperament || 'n/a'}</p>
    `;
    content.appendChild(card);
  });
}

/* ---- /images/search endpoint ---- */
async function showRandomImage() {
  const res = await fetch(`${API_BASE}/images/search`);
  if (!res.ok) throw new Error('Failed to fetch random image');
  const [img] = await res.json();

  content.innerHTML = `
    <img src="${img.url}" alt="Random dog" class="random-dog" />
    <p style="text-align:center; margin-top:1rem;">
      Click <em>Random Image</em> again for a new photo!
    </p>
  `;
}

/* ========= Kick‑off (optional) ========= */
loadView('breeds');   // load a default view on first visit
